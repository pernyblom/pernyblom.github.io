

/*
 * Main function giving a function stack trace with a forced or passed in Error
 *
 * @cfg {Error} e The error to create a stacktrace from (optional)
 * @cfg {Boolean} guess If we should try to resolve the names of anonymous functions
 * @return {Array} of Strings with functions, lines, files, and arguments where possible
 */

function printStackTrace(options) {
    options = options || {guess: true};
    var ex = options.e || null, guess = !!options.guess;
    var p = new printStackTrace.implementation(), result = p.run(ex);
    return (guess) ? p.guessAnonymousFunctions(result) : result;
}

printStackTrace.implementation = function() {
};

printStackTrace.implementation.prototype = {
    /**
     * @param {Error} ex The error to create a stacktrace from (optional)
     * @param {String} mode Forced mode (optional, mostly for unit tests)
     */
    run: function(ex, mode) {
        ex = ex || this.createException();
        // examine exception properties w/o debugger
        //for (var prop in ex) {alert("Ex['" + prop + "']=" + ex[prop]);}
        mode = mode || this.mode(ex);
        if (mode === 'other') {
            return this.other(arguments.callee);
        } else {
            return this[mode](ex);
        }
    },

    createException: function() {
        try {
            this.undef();
        } catch (e) {
            return e;
        }
    },

    /**
     * Mode could differ for different exception, e.g.
     * exceptions in Chrome may or may not have arguments or stack.
     *
     * @return {String} mode of operation for the exception
     */
    mode: function(e) {
        if (e['arguments'] && e.stack) {
            return 'chrome';
        } else if (typeof e.message === 'string' && typeof window !== 'undefined' && window.opera) {
            // e.message.indexOf("Backtrace:") > -1 -> opera
            // !e.stacktrace -> opera
            if (!e.stacktrace) {
                return 'opera9'; // use e.message
            }
            // 'opera#sourceloc' in e -> opera9, opera10a
            if (e.message.indexOf('\n') > -1 && e.message.split('\n').length > e.stacktrace.split('\n').length) {
                return 'opera9'; // use e.message
            }
            // e.stacktrace && !e.stack -> opera10a
            if (!e.stack) {
                return 'opera10a'; // use e.stacktrace
            }
            // e.stacktrace && e.stack -> opera10b
            if (e.stacktrace.indexOf("called from line") < 0) {
                return 'opera10b'; // use e.stacktrace, format differs from 'opera10a'
            }
            // e.stacktrace && e.stack -> opera11
            return 'opera11'; // use e.stacktrace, format differs from 'opera10a', 'opera10b'
        } else if (e.stack) {
            return 'firefox';
        }
        return 'other';
    },

    /**
     * Given a context, function name, and callback function, overwrite it so that it calls
     * printStackTrace() first with a callback and then runs the rest of the body.
     *
     * @param {Object} context of execution (e.g. window)
     * @param {String} functionName to instrument
     * @param {Function} function to call with a stack trace on invocation
     */
    instrumentFunction: function(context, functionName, callback) {
        context = context || window;
        var original = context[functionName];
        context[functionName] = function instrumented() {
            callback.call(this, printStackTrace().slice(4));
            return context[functionName]._instrumented.apply(this, arguments);
        };
        context[functionName]._instrumented = original;
    },

    /**
     * Given a context and function name of a function that has been
     * instrumented, revert the function to it's original (non-instrumented)
     * state.
     *
     * @param {Object} context of execution (e.g. window)
     * @param {String} functionName to de-instrument
     */
    deinstrumentFunction: function(context, functionName) {
        if (context[functionName].constructor === Function &&
                context[functionName]._instrumented &&
                context[functionName]._instrumented.constructor === Function) {
            context[functionName] = context[functionName]._instrumented;
        }
    },

    /**
     * Given an Error object, return a formatted Array based on Chrome's stack string.
     *
     * @param e - Error object to inspect
     * @return Array<String> of function calls, files and line numbers
     */
    chrome: function(e) {
        var stack = (e.stack + '\n').replace(/^\S[^\(]+?[\n$]/gm, '').
          replace(/^\s+at\s+/gm, '').
          replace(/^([^\(]+?)([\n$])/gm, '{anonymous}()@$1$2').
          replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}()@$1').split('\n');
        stack.pop();
        return stack;
    },

    /**
     * Given an Error object, return a formatted Array based on Firefox's stack string.
     *
     * @param e - Error object to inspect
     * @return Array<String> of function calls, files and line numbers
     */
    firefox: function(e) {
        return e.stack.replace(/(?:\n@:0)?\s+$/m, '').replace(/^\(/gm, '{anonymous}(').split('\n');
    },

    opera11: function(e) {
        // "Error thrown at line 42, column 12 in <anonymous function>() in file://localhost/G:/js/stacktrace.js:\n"
        // "Error thrown at line 42, column 12 in <anonymous function: createException>() in file://localhost/G:/js/stacktrace.js:\n"
        // "called from line 7, column 4 in bar(n) in file://localhost/G:/js/test/functional/testcase1.html:\n"
        // "called from line 15, column 3 in file://localhost/G:/js/test/functional/testcase1.html:\n"
        var ANON = '{anonymous}', lineRE = /^.*line (\d+), column (\d+)(?: in (.+))? in (\S+):$/;
        var lines = e.stacktrace.split('\n'), result = [];

        for (var i = 0, len = lines.length; i < len; i += 2) {
            var match = lineRE.exec(lines[i]);
            if (match) {
                var location = match[4] + ':' + match[1] + ':' + match[2];
                var fnName = match[3] || "global code";
                fnName = fnName.replace(/<anonymous function: (\S+)>/, "$1").replace(/<anonymous function>/, ANON);
                result.push(fnName + '@' + location + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
            }
        }

        return result;
    },

    opera10b: function(e) {
        // "<anonymous function: run>([arguments not available])@file://localhost/G:/js/stacktrace.js:27\n" +
        // "printStackTrace([arguments not available])@file://localhost/G:/js/stacktrace.js:18\n" +
        // "@file://localhost/G:/js/test/functional/testcase1.html:15"
        var ANON = '{anonymous}', lineRE = /^(.*)@(.+):(\d+)$/;
        var lines = e.stacktrace.split('\n'), result = [];

        for (var i = 0, len = lines.length; i < len; i++) {
            var match = lineRE.exec(lines[i]);
            if (match) {
                var fnName = match[1]? (match[1] + '()') : "global code";
                result.push(fnName + '@' + match[2] + ':' + match[3]);
            }
        }

        return result;
    },

    /**
     * Given an Error object, return a formatted Array based on Opera 10's stacktrace string.
     *
     * @param e - Error object to inspect
     * @return Array<String> of function calls, files and line numbers
     */
    opera10a: function(e) {
        // "  Line 27 of linked script file://localhost/G:/js/stacktrace.js\n"
        // "  Line 11 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html: In function foo\n"
        var ANON = '{anonymous}', lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
        var lines = e.stacktrace.split('\n'), result = [];

        for (var i = 0, len = lines.length; i < len; i += 2) {
            var match = lineRE.exec(lines[i]);
            if (match) {
                var fnName = match[3] || ANON;
                result.push(fnName + '()@' + match[2] + ':' + match[1] + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
            }
        }

        return result;
    },

    // Opera 7.x-9.2x only!
    opera9: function(e) {
        // "  Line 43 of linked script file://localhost/G:/js/stacktrace.js\n"
        // "  Line 7 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html\n"
        var ANON = '{anonymous}', lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
        var lines = e.message.split('\n'), result = [];

        for (var i = 2, len = lines.length; i < len; i += 2) {
            var match = lineRE.exec(lines[i]);
            if (match) {
                result.push(ANON + '()@' + match[2] + ':' + match[1] + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
            }
        }

        return result;
    },

    // Safari, IE, and others
    other: function(curr) {
        var ANON = '{anonymous}', fnRE = /function\s*([\w\-$]+)?\s*\(/i, stack = [], fn, args, maxStackSize = 10;
        while (curr && stack.length < maxStackSize) {
            fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON;
            args = Array.prototype.slice.call(curr['arguments'] || []);
            stack[stack.length] = fn + '(' + this.stringifyArguments(args) + ')';
            curr = curr.caller;
        }
        return stack;
    },

    /**
     * Given arguments array as a String, subsituting type names for non-string types.
     *
     * @param {Arguments} object
     * @return {Array} of Strings with stringified arguments
     */
    stringifyArguments: function(args) {
        var result = [];
        var slice = Array.prototype.slice;
        for (var i = 0; i < args.length; ++i) {
            var arg = args[i];
            if (arg === undefined) {
                result[i] = 'undefined';
            } else if (arg === null) {
                result[i] = 'null';
            } else if (arg.constructor) {
                if (arg.constructor === Array) {
                    if (arg.length < 3) {
                        result[i] = '[' + this.stringifyArguments(arg) + ']';
                    } else {
                        result[i] = '[' + this.stringifyArguments(slice.call(arg, 0, 1)) + '...' + this.stringifyArguments(slice.call(arg, -1)) + ']';
                    }
                } else if (arg.constructor === Object) {
                    result[i] = '#object';
                } else if (arg.constructor === Function) {
                    result[i] = '#function';
                } else if (arg.constructor === String) {
                    result[i] = '"' + arg + '"';
                } else if (arg.constructor === Number) {
                    result[i] = arg;
                }
            }
        }
        return result.join(',');
    },

    sourceCache: {},

    /**
     * @return the text from a given URL
     */
    ajax: function(url) {
        var req = this.createXMLHTTPObject();
        if (req) {
            try {
                req.open('GET', url, false);
                req.send(null);
                return req.responseText;
            } catch (e) {
            }
        }
        return '';
    },

    /**
     * Try XHR methods in order and store XHR factory.
     *
     * @return <Function> XHR function or equivalent
     */
    createXMLHTTPObject: function() {
        var xmlhttp, XMLHttpFactories = [
            function() {
                return new XMLHttpRequest();
            }, function() {
                return new ActiveXObject('Msxml2.XMLHTTP');
            }, function() {
                return new ActiveXObject('Msxml3.XMLHTTP');
            }, function() {
                return new ActiveXObject('Microsoft.XMLHTTP');
            }
        ];
        for (var i = 0; i < XMLHttpFactories.length; i++) {
            try {
                xmlhttp = XMLHttpFactories[i]();
                // Use memoization to cache the factory
                this.createXMLHTTPObject = XMLHttpFactories[i];
                return xmlhttp;
            } catch (e) {
            }
        }
    },

    /**
     * Given a URL, check if it is in the same domain (so we can get the source
     * via Ajax).
     *
     * @param url <String> source url
     * @return False if we need a cross-domain request
     */
    isSameDomain: function(url) {
        return url.indexOf(location.hostname) !== -1;
    },

    /**
     * Get source code from given URL if in the same domain.
     *
     * @param url <String> JS source URL
     * @return <Array> Array of source code lines
     */
    getSource: function(url) {
        // TODO reuse source from script tags?
        if (!(url in this.sourceCache)) {
            this.sourceCache[url] = this.ajax(url).split('\n');
        }
        return this.sourceCache[url];
    },

    guessAnonymousFunctions: function(stack) {
        for (var i = 0; i < stack.length; ++i) {
            var reStack = /\{anonymous\}\(.*\)@(.*)/,
                reRef = /^(.*?)(?::(\d+))(?::(\d+))?(?: -- .+)?$/,
                frame = stack[i], ref = reStack.exec(frame);

            if (ref) {
                var m = reRef.exec(ref[1]), file = m[1],
                    lineno = m[2], charno = m[3] || 0;
                if (file && this.isSameDomain(file) && lineno) {
                    var functionName = this.guessAnonymousFunction(file, lineno, charno);
                    stack[i] = frame.replace('{anonymous}', functionName);
                }
            }
        }
        return stack;
    },

    guessAnonymousFunction: function(url, lineNo, charNo) {
        var ret;
        try {
            ret = this.findFunctionName(this.getSource(url), lineNo);
        } catch (e) {
            ret = 'getSource failed with url: ' + url + ', exception: ' + e.toString();
        }
        return ret;
    },

    findFunctionName: function(source, lineNo) {
        // FIXME findFunctionName fails for compressed source
        // (more than one function on the same line)
        // TODO use captured args
        // function {name}({args}) m[1]=name m[2]=args
        var reFunctionDeclaration = /function\s+([^(]*?)\s*\(([^)]*)\)/;
        // {name} = function ({args}) TODO args capture
        // /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*function(?:[^(]*)/
        var reFunctionExpression = /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*function\b/;
        // {name} = eval()
        var reFunctionEvaluation = /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*(?:eval|new Function)\b/;
        // Walk backwards in the source lines until we find
        // the line which matches one of the patterns above
        var code = "", line, maxLines = Math.min(lineNo, 20), m, commentPos;
        for (var i = 0; i < maxLines; ++i) {
            // lineNo is 1-based, source[] is 0-based
            line = source[lineNo - i - 1];
            commentPos = line.indexOf('//');
            if (commentPos >= 0) {
                line = line.substr(0, commentPos);
            }
            // TODO check other types of comments? Commented code may lead to false positive
            if (line) {
                code = line + code;
                m = reFunctionExpression.exec(code);
                if (m && m[1]) {
                    return m[1];
                }
                m = reFunctionDeclaration.exec(code);
                if (m && m[1]) {
                    //return m[1] + "(" + (m[2] || "") + ")";
                    return m[1];
                }
                m = reFunctionEvaluation.exec(code);
                if (m && m[1]) {
                    return m[1];
                }
            }
        }
        return '(?)';
    }
};







// [start, end]
function intervalIntersect(int1, int2) {
    return !(int1[1] < int2[0] || int1[0] > int2[1]);
}


function mod(a, b) {
    var n = Math.round(a / b);
    a -= n * b;
    if (a < 0) {
        a += b;
    }
    return a;
}


function hash(a) {
    a = (a + 0x7ed55d16) + (a << 12);
    a = (a ^ 0xc761c23c) ^ (a >> 19);
    a = (a + 0x165667b1) + (a << 5);
    a = (a + 0xd3a2646c) ^ (a << 9);
    a = (a + 0xfd7046c5) + (a << 3);
    a = (a ^ 0xb55a4f09) ^ (a >> 16);
    return a;
}


function hashCode(str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        var ch = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+ch;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function djb2Code(str){
    var hash = 5381;
    for (i = 0; i < str.length; i++) {
        var ch = str.charCodeAt(i);
        hash = ((hash << 5) + hash) + ch; /* hash * 33 + c */
    }
    return hash;
}


function sdbmCode(str){
    var hash = 0;
    for (i = 0; i < str.length; i++) {
        var ch = str.charCodeAt(i);
        hash = ch + (hash << 6) + (hash << 16) - hash;
    }
    return hash;
}

function loseCode(str){
    var hash = 0;
    for (i = 0; i < str.length; i++) {
        var ch = str.charCodeAt(i);
        hash += ch;
    }
    return hash;
}

function getValueOrDefault(options, prop, def) {
    return options && options[prop] != undefined ? options[prop] : def;
}

function setValueOrDefault(target, options, prop, def) {
    target[prop] = options && options[prop] != undefined ? options[prop] : def;
}

function arrayEquals(arr1, arr2) {
    if (arr1 && arr2 && arr1.length == arr2.length) {
        for (var i=0; i<arr1.length; i++) {
            if (arr1[i] != arr2[i]) {
                return false;
            }
        }
        return true;
    }
    return false;
}

function setEquals(set1, set2) {
    if (set1 && set2 && set1.length == set2.length) {
        for (var i=0; i<set1.length; i++) {
            if (!arrayContains(set2, set1[i])) {
                return false;
            }
        }
        return true;
    }
    return false;
}



function arrayCopy(arr) {
    if (arr) {
        var result = [];
        for (var i=0; i<arr.length; i++) {
            result.push(arr[i]);
        }
        return result;
    }
    return null;
}

function arrayCopyWithCopy(arr) {
    if (arr) {
        var result = [];
        for (var i=0; i<arr.length; i++) {
            result.push(copyValueDeep(arr[i]));
        }
        return result;
    }
    return null;
}


function array2dCopy(arr) {
    if (arr) {
        var result = [];
        for (var i=0; i<arr.length; i++) {
            result.push(arrayCopy(arr[i]))
        }
        return result;
    }
    return null;
}



function addAll(arr1, arr2) {
    //    if (!arr2) {
    //        logit(printStackTrace().join("<br />"));
    //    }
    if (arr2 && arr1) {
        for (var i=0; i<arr2.length; i++) {
            arr1.push(arr2[i]);
        }
    }
}


function positiveMod(a, b) {
    var result;
    if (a >= 0) {
        result = a % b;
    } else {
        result = (b + a % b) % b;
    }
    return result;
}


function getObjectWithId(id, arr) {
    for (var i=0; i<arr.length; i++) {
        var obj = arr[i];
        if (obj.id == id) {
            return obj;
        }
    }
    return null;
}

function getObjectIndexWithId(id, arr) {
    for (var i=0; i<arr.length; i++) {
        var obj = arr[i];
        if (obj.id == id) {
            return i;
        }
    }
    return -1;
}


function fixLikelihoods(likelihoods) {
    var result = [];

    if (likelihoods.length > 0) {
        var ok = false;
        for (var i=0; i<likelihoods.length; i++) {
            var l = likelihoods[i];
            l = Math.max(0, l);
            if (l > 0) {
                ok = true;
            }
            result[i] = l;
        }
        if (!ok) {
            result[0] = 1;
        }
    }
    return result;
}

function getProbabilityDistribution(likelihoods) {
    var result = [];

    var length = likelihoods.length;

    var sum = 0.0;
    for (var i = 0; i < length; i++) {
        sum += parseFloat(likelihoods[i]);
    }

    result[0] = likelihoods[0];
    for (var i = 1; i < length; i++) {
        result[i] = (result[i - 1] + likelihoods[i]);
    }
    if (sum > 0.000000001) {
        for (var i = 0; i < length; i++) {
            result[i] /= sum;
        }
    } else {
        // Setting all to the same person
        var increment = 1.0 / length;
        for (var i = 0; i < length; i++) {
            result[i] = (i+1) * increment;;
        }
    }
    return result;
}

function getProbabilityFractions(likelihoods) {

    var result = [];

    var length = likelihoods.length;

    var sum = 0.0;
    for (var i = 0; i < length; i++) {
        sum += parseFloat(likelihoods[i]);
    }

    if (sum > 0.000000001) {
        for (var i = 0; i < length; i++) {
            result[i] = likelihoods[i] / sum;
        }
    } else {
        // Setting all to the same person
        for (var i = 0; i < length; i++) {
            result[i] = 1.0 / length;
        }
    }

//    logit("sum : " + sum + "<br />");

    //    logit("ProbabilityFractions input: " + likelihoods + " result: " + result + "<br />");
    return result;
}

function sampleDataIndex(rndInfos, rnd) {
    var info = {};
    var likelihoods = [];
    for (var j=0; j<rndInfos.length; j++) {
        if (typeof(rndInfos[j].active) != 'undefined') {
            likelihoods[j] = rndInfos[j].active ? rndInfos[j].likelihood : 0;
        } else {
            likelihoods[j] = rndInfos[j].likelihood;
        }
    }
    var dist = getProbabilityDistribution(likelihoods);
    var index = sampleIndexIntegerDistribution(rnd, dist);

    return index;
}

function sampleData(rndInfos, rnd) {
    var index = sampleDataIndex(rndInfos, rnd);
    var rndInfo = rndInfos[index];
    return rndInfo.data;
}

function sampleNData(rndInfos, n, rnd) {
    var result = [];
    for (var i=0; i<n; i++) {
        result.push(sampleData(rndInfos, rnd));
    }
    return result;
}

function sampleNDataWithoutReplacement(rndInfos, n, rnd, replace) {
    var result = [];

    if (!replace) {
        rndInfos = arrayCopy(rndInfos);
    }
    n = Math.min(rndInfos.length, n);
    if (n == rndInfos.length) {
        for (var i=0; i<rndInfos.length; i++) {
            result.push(rndInfos[i].data);
        }
    } else {
        for (var i=0; i<n; i++) {
            var index = sampleDataIndex(rndInfos, rnd);
            var rndInfo = rndInfos[index];
            var data = rndInfo.data;
            result.push(data);
            rndInfos.splice(index, 1);
        }
    }
    return result;
}



function sampleIndexIntegerDistribution(rnd, cumulative) {
    var rndValue = rnd.random();
    for (var j = 0; j < cumulative.length; j++) {
        if (rndValue < cumulative[j]) {
            return j;
        }
    }
    logit("RandomUtils: Could not properly sample "
        + cumulative);
    return 0; // This should never happen
}

function arrayShuffle(arr, rnd) {
    for(var r, tmp, i=arr.length; i; r=parseInt(rnd.random()*i), tmp=arr[--i], arr[i]=arr[r], arr[r]=tmp);
}

function arrayContains(arr, value) {
    for (var i=0; i<arr.length; i++) {
        if (arr[i] == value) {
            return true;
        }
    }
    return false;
}
function arrayContainsExactly(arr, value) {
    for (var i=0; i<arr.length; i++) {
        if (arr[i] === value) {
            return true;
        }
    }
    return false;
}

function arrayContainsSameProperty(arr, propName, propValue) {
    for (var i=0; i<arr.length; i++) {
        if (arr[i][propName] == propValue) {
            return true;
        }
    }
    return false;
}

function arrayIndexOf(arr, value) {
    for (var i=0; i<arr.length; i++) {
        if (arr[i] == value) {
            return i;
        }
    }
    return -1;
}

function arrayDelete(arr, value) {
    var index = arrayIndexOf(arr, value);
    if (index >= 0) {
        arr.splice(index, 1);
    }
}

function arrayReplace(arr, oldValue, newValue) {
    var index = arrayIndexOf(arr, oldValue);
    if (index >= 0) {
        arr[index] = newValue;
    }
}


function arrayDeleteAll(arr, values) {
    for (var i=0; i<values.length; i++) {
        arrayDelete(arr, values[i]);
    }
}


function investigateObject(obj) {
    for (var key in obj) {
        logit("__" + key + ":" + obj[key] + "<br />");
    }
}

function investigateKeys(obj) {
    var keys = [];
    for (var key in obj) {
        keys.push(key);
    }
    logit("Keys: " + keys.join(", ") + "<br />");
}

function investigateArrayIds(arr) {
    var ids = [];
    for (var i=0; i<arr.length; i++) {
        ids.push(arr[i].id);
    }
    logit("ids: " + ids.join(", ") + "<br />");
}

// Get item from array if not the index is within the startItems or at the end, overlapping endItems
// The defaultItem is used if the length of items is 0
// Note that the length of items is separated from the length parameter
function getItemFromArrayWithStartEndItems(defaultWhenEmpty, items, length, index, startItems, endItems) {
    var theDefault = defaultWhenEmpty;
    if (!items) {
        logit(printStackTrace().join("<br />"));
    }
    if (index >= 0 && items.length > 0) {
        theDefault = items[index % items.length];
    }
    return getItemWithDefaultWithStartEndItems(theDefault, length, index, startItems, endItems);
}

// Get item choosing from startItems, endItems and a defaultItem that is used when not within startItems or endItems
function getItemWithDefaultWithStartEndItems(defaultItem, length, index, startItems, endItems) {
    var result = defaultItem;
    if (index >= 0 && index < startItems.length) {
        result = startItems[index];
        //        logit("__getting start index " + " theIndex: " + index + " startItems: " + startItems + "<br />")
    }
    var fromEndIndex = length - index - 1;
    if (fromEndIndex >= 0 && fromEndIndex < endItems.length) {
        result = endItems[endItems.length - fromEndIndex - 1];
        //        logit("__getting end index<br />")
    }
    return result;
}



function isArray(obj) {
    return (Object.prototype.toString.call(obj) === '[object Array]');
}

function showStacktraceDialog(ex, description) {
    if (!description) {
        description = "";
    }
    var stString = printStackTrace({
        e: ex,
        guess:true
    }).join("\n");
    var w = 1000;
    var h = 500;
    var $dialogDiv = $("<div title='Error Stacktrace " + description + "' ><textarea style='width: " + w + "px; height: " + h + "px' >" + stString + "</textarea></div>");
    $dialogDiv.dialog({
        width: w + 50,
        height: h + 150,
        buttons: {
            "Close": function() {
                $dialogDiv.dialog("close");
            }
        }
    });
}


function lerp(t, x0, x1) {
    return x0 + t * (x1 - x0);
}

function clamp(x, a, b) {
    return (x < a ? a : (x > b ? b : x));
}


function base64ArrayBuffer(arrayBuffer) {
    var base64    = ''
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

    var bytes         = new Uint8Array(arrayBuffer)
    var byteLength    = bytes.byteLength
    var byteRemainder = byteLength % 3
    var mainLength    = byteLength - byteRemainder

    var a, b, c, d
    var chunk

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
        d = chunk & 63               // 63       = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
        chunk = bytes[mainLength]

        a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3)   << 4 // 3   = 2^2 - 1

        base64 += encodings[a] + encodings[b] + '=='
    } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

        a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

        base64 += encodings[a] + encodings[b] + encodings[c] + '='
    }

    return base64
}


function toPitchClassString(note) {
    var pitchClass = note % 12;

    switch (pitchClass) {
        case 0:
            return "C";
        case 1:
            return "C#";
        case 2:
            return "D";
        case 3:
            return "D#";
        case 4:
            return "E";
        case 5:
            return "F";
        case 6:
            return "F#";
        case 7:
            return "G";
        case 8:
            return "G#";
        case 9:
            return "A";
        case 10:
            return "A#";
        case 11:
            return "B";
    }
    return "?";
}


function getOption(optionName, options, defaultOptions) {
    var value = options[optionName];
    if (typeof(value) === 'undefined') {
        value = defaultOptions[optionName];
    }
    return value;
}

function getValue2LevelsOrDefault(obj, prop1, prop2, def) {
    if (obj && obj[prop1]) {
        var value = obj[prop1][prop2];
        if (! (typeof(value) === 'undefined')) {
            return value;
        }
    }
    return def;
}

function copyValueDeep(value, parentObject, options) {
    if (isArray(value)) {
        var result = [];
        if (options && options.propertyInfo &&
            options.propertyInfo.dataType == GuiPropertyDataType.ID_REFERENCE_LIST) {
            var uiInfo = options.propertyInfo.uniqueIdInfo;
            for (var i=0; i<value.length; i++) {
                result[i] = getValue2LevelsOrDefault(options.oldToNewIdMap, uiInfo.namespace, value[i], value[i]);
            }
        } else {
            for (var i=0; i<value.length; i++) {
                result[i] = copyValueDeep(value[i], parentObject, options);
            }
        }
        return result;
    } else if (typeof(value) === 'function') {
        return value;
    } else if (typeof(value) === 'object') {
        return copyObjectDeep(value, options);
    } else {
        if (options && options.propertyInfo) {
            if (options.propertyInfo.dataType == GuiPropertyDataType.UNIQUE_ID ||
                options.propertyInfo.dataType == GuiPropertyDataType.ID_REFERENCE) {
                var uiInfo = options.propertyInfo.uniqueIdInfo;
                var theId = getValue2LevelsOrDefault(options.oldToNewIdMap, uiInfo.namespace, value, value);

                // logit("copying id " + value + " " + theId + " " + JSON.stringify(options.oldToNewIdMap[uiInfo.namespace]) + " <br />");
                return theId;
            }
        }
        return value;
    }
}


function copyObjectPropertiesShallow(copy, source) {
    for (var propName in source) {
        var value = source[propName];
        copy[propName] = value;
    }
}

function copyObjectPropertiesDeep(copy, source, options) {
    for (var propName in source) {
        var value = source[propName];
        if (! (typeof(value) === 'function')) {
            if (options && options.propertyInfos) {
                options.propertyInfo = options.propertyInfos.getPropertyInfo(propName);
            } else if (options) {
                options.propertyInfo = null;
            }
            copy[propName] = copyValueDeep(value, source, options);
        }
    }
}


var isValidFunctionName = function() {
    var validName = /^[$A-Z_][0-9A-Z_$]*$/i;
    var reserved = {
        'abstract':true,
        'boolean':true,
        // ...
        'with':true
    };
    return function(s) {
        // Ensure a valid name and not reserved.
        return validName.test(s) && !reserved[s];
    };
}();


function copyObjectDeep(obj, options) {
    if (typeof(obj) === 'undefined' || obj == null) {
        return obj;
    }
    var copy = null;
    if (!obj._constructorName) {
        // logit("Missing _constructorName " + obj + " in copyObject()<br />");
        copy = {};
    } else {
        if (isValidFunctionName(obj._constructorName)) {
            copy = eval("new " + obj._constructorName + "()");
        } else {
            copy = {};
        }
    }
    var createUniqueIds = getValueOrDefault(options, "createUniqueIds", false);
    if (createUniqueIds) {
        var propertyInfoProvider = getValueOrDefault(options, "propertyInfoProvider", null);
        if (propertyInfoProvider && obj._constructorName) {
            var propertyInfos = propertyInfoProvider.getGuiPropertyInfos(obj);
            options.propertyInfos = propertyInfos;
        } else {
            options.propertyInfos = null;
        }
        if (!options.oldToNewIdMap) {
            options.oldToNewIdMap = {};
            traverseObject(obj, propertyInfoProvider, createOldToNewIdMap, null, options.oldToNewIdMap);
            // logit(JSON.stringify(options.oldToNewIdMap));
        }
    }
    copyObjectPropertiesDeep(copy, obj, options);
    //    var arr = [];
    //    objectToJson(options, arr);
    //    logit(arr.join(""));

    return copy;
}


function objectFromJson(jsonStr) {
    var jsonObj = $.parseJSON(jsonStr);
    if (!jsonObj._constructorName) {
        logit("Missing _constructorName " + jsonObj.id + " in objectFromJson()<br />");
    }
    return copyObjectDeep(jsonObj);
}


function objectToJson(obj, arr, visited) {
    if (!obj._constructorName) {
        logit("Missing _constructorName " + obj.id + " in objectToJson()<br />");
    }
    if (!arr) {
        arr = [];
    }

    if (!visited) {
        visited = new Map(true);
    }
    var hasVisited = visited.get(obj);
    if (hasVisited) {
        logit("Have visited " + JSON.stringify(obj));
        return;
    }
    visited.put(obj, true);

    arr.push("{\n");

    var propNames = [];
    for (var propName in obj) {
        if (propName.indexOf("__") < 0) {
            var value = obj[propName];
            if (value != null) {
                if (!(typeof(value) === 'object') || value._constructorName || isArray(value)) {
                    if (! (typeof(value) === 'function')) {
                        propNames.push(propName);
                    }
                }
            }
        }
    }

    for (var i=0; i<propNames.length; i++) {
        var propName = propNames[i];
        var value = obj[propName];
        arr.push("\"" + propName + "\": ");
        valueToJson(value, arr, visited);
        if (i != propNames.length - 1) {
            arr.push(", ");
        }
    }
    arr.push("}");
    return arr;
}

function isFunction(obj) {
    return typeof(obj) === 'function';
}

function valueToJson(value, arr, visited) {
    if (!arr) {
        arr = [];
    }
    if (isArray(value)) {
        arr.push("[");
        for (var i=0; i<value.length; i++) {
            valueToJson(value[i], arr, visited);
            if (i != value.length - 1) {
                arr.push(", ");
            }
        }
        arr.push("]");
    } else if (isFunction(value)) {
    } else if (typeof(value) === 'object') {
        objectToJson(value, arr, visited);
    } else if (typeof(value) === 'string') {
        arr.push("\"" + value + "\"");
    } else {
        arr.push(value);
    }
    return arr;
}

function traverseValue(value, visitor, visited) {
    if (value == null) {
        return;
    }

    if (!visited) {
        visited = new Map(true);
    }

    if (isArray(value)) {
        for (var i=0; i<value.length; i++) {
            traverseValue(value[i], visitor, visited);
        }
    } else if (isFunction(value)) {
    } else if (typeof(value) === 'object') {

        var hasVisited = visited.get(value);
        if (hasVisited) {
//            logit("Have visited " + JSON.stringify(value));
            return;
        }
        visited.put(value, true);

        for (var propName in value) {
            if (propName.indexOf("__") < 0) {
                var v = value[propName];
                visitor(v, propName, value);
                if (v != null) {
                    traverseValue(v, visitor, visited);
                }
            }
        }
    } else if (typeof(value) === 'string') {
    } else {
    }
}


//var expressionData = {};

function getExpressionValue(expression, module, extraVars, verbose, object, propName) {

//    perfTimer3.start();

    var result = null;

    var exprIsString = typeof(expression) === "string";

    if (exprIsString && !expression.match(/[a-z]/i)) {
//        logit("Expression simple " + expression);
        result = eval(expression);
//        perfTimer3.pause();
        return result;
    }

    // Checking if there are only a single variable in the expression
    if (exprIsString && !expression.match(/[^a-z]/i)) {
//           logit("A single var expression? " + expression);
        var variable = module.getVariable(expression);
        if (variable) {
            result = variable.getValue(module);
//            perfTimer3.pause();
            return result;
        }
    }


    // Try to find all the variables and replace the expression with the variable values

    var foundVars = {};
    var myArray = null;
    var replacedExpression = expression;
    var replaceSuccess = true;
    do {
        myArray = /([a-z][a-z0-9]*Var)/gi.exec(replacedExpression);
        if (myArray) {
            for (var i=0; i<myArray.length; i++) {
                var varName = myArray[i];
                var variable = module.getVariable(varName);
                if (variable) {
                    foundVars[variable.id] = variable;
                    var varValue = variable.getValue(module);
                    var valueType = typeof(varValue);
                    if (valueType === 'string' || valueType === 'number' || isArray(varValue)) {
                        var re = new RegExp(myArray[i], "g");
                        replacedExpression = replacedExpression.replace(re, JSON.stringify(variable.getValue(module)));
                    } else {
                        replaceSuccess = false;
                        break;
                    }
                } else {
                    replaceSuccess = false;
                    break;
                }
            }
        }
    } while (myArray != null && replaceSuccess);
//    logit(JSON.stringify(myArray));
    if (replaceSuccess) {
//            logit("transformed " + expression + " to " + tempExpr);
        try {
            var result = eval(replacedExpression);
//            perfTimer3.pause();
            return result;
        } catch (exc) {
            logit("Error when evaluating " + replacedExpression + " original: " + expression + " exc: " + exc);
        }
    }



    var prv={ };
    function prop(name, def) {
        prv[name] = def;
        return function(value) {
            // if (!value) is true for 'undefined', 'null', '0', NaN, '' (empty string) and false.
            // I assume you wanted undefined. If you also want null add: || value===null
            // Another way is to check arguments.length to get how many parameters was
            // given to this function when it was called.
            if (typeof value === "undefined"){
                //check if hasOwnProperty so you don't unexpected results from
                //the objects prototype.
                return Object.prototype.hasOwnProperty.call(prv,name) ? prv[name] : undefined;
            }
            prv[name] = value;
            return this;
        }
    }

    var pub = {};
    pub["module"] = prop("module", module); // Make the module available

    for (var varId in foundVars) {
        var v = foundVars[varId];
        pub[v.id] = prop(v.id, v.getValue(module));
    }
//    var variables = module.getVariables();
//    for (var i=0; i<variables.length; i++) {
//        var v = variables[i];
//        pub[v.id] = prop(v.id, v.getValue(module));
//    }
    for (var i=0; i<module.procedures.length; i++) {
        var v = module.procedures[i];
        pub[v.id] = prop(v.id, v.getProcedure(module));
    }
    if (extraVars) {
        for (var varName in extraVars) {
            pub[varName] = prop(varName, extraVars[varName]);
        }
    }

    pub.getTheValue = function() {
        with (prv) {
            return eval(expression);
        }
    };

    result = pub.getTheValue();
//    perfTimer3.pause();

    return result;
}

function getValueOrExpressionValue(object, propName, module, extraVars, verbose) {
    var result = object[propName];
    try {
        if (object[propName + "UseExpression"]) {
            var expression = object[propName + "Expression"];
            if (expression) {
                if (verbose) {
                    logit("Found expression " + expression);
                }
                var temp = getExpressionValue(expression, module, extraVars, verbose, object, propName);
                if (temp != null) {
                    result = temp;
                }
            }
        }
    } catch (ex) {
        logit("Expression eval error. useExpression: " + object[propName + "UseExpression"] + " expression: " + object[propName + "Expression"]);
//        showStacktraceDialog(ex, "Error in expression evaluation");
    }
    return result;
}


function strcmp(a, b) {
    // a = a.toString(), b = b.toString();
    for (var i = 0,n = Math.max(a.length, b.length); i<n && a.charAt(i) === b.charAt(i); ++i);
    if (i === n) {
        return 0;
    }
    return a.charAt(i) > b.charAt(i) ? -1 : 1;
}

//function logit(str) {
//    if (output) {
//        output.innerHTML += str;
//    }
//}
//
//function logitRnd(str, prob) {
//    if (Math.random() < prob) {
//        if (output) {
//            output.innerHTML += str;
//        }
//    }
//}


function createFilledArray(count, element) {
    var result = [];
    for (var i=0; i<count; i++) {
        result[i] = element;
    }
    return result;
}
function fillArray(result, count, element) {
    for (var i=0; i<count; i++) {
        result[i] = element;
    }
}

function createFilledArrayWithCopyValue(count, element) {
    var result = [];
    for (var i=0; i<count; i++) {
        result.push(copyValueDeep(element));
    }
    return result;
}

function createFilledNumericIncArray(count, element, inc) {
    var result = [];
    for (var i=0; i<count; i++) {
        result.push(element);
        element += inc;
    }
    return result;
}

function createFilledPatternArray(count, pattern) {
    var result = [];
    for (var i=0; i<count; i++) {
        var element = pattern[i % pattern.length];
        result.push(element);
    }
    return result;
}


function getConstructorNameArr(arr) {
    var result = [];
    for (var i=0; i<arr.length; i++) {
        result.push(arr[i]._constructorName);
    }
    return result;
}


function arrayElementsPropertyToString(arr, propName, result) {
    if (!result) {
        result = [];
    }
    for (var i=0; i<arr.length; i++) {
        result.push(arr[i][propName]);
    }
    return result;
}

function snapMidiTicks(beatStep, beatTicks) {
    var ticks = beatStep * beatTicks;
    var intTicks = Math.floor(ticks);
    var frac = ticks - intTicks;
    return beatStep - frac / beatTicks;
}


function addPossibleValuesFunction(obj, from, to) {
    obj.possibleValues = null;
    obj.getPossibleValues = function() {
        if (!obj.possibleValues) {
            obj.possibleValues = [];
            for (var i=from; i<=to; i++) {
                obj.possibleValues.push(i);
            }
        }
        return obj.possibleValues;
    }
}

function sortEnumAlphabetically(obj) {

    // Need to get all the properties of the object and the current value
    var valuePropNames = {};
    for (var propName in obj) {
        var value = obj[propName];
        if (typeof(value) === "number") {
            valuePropNames[value] = propName;
        }
    }

    var values = obj.getPossibleValues();
    var descriptionValues = [];
    for (var i=0; i<values.length; i++) {
        var desc = obj.toString(values[i]);
        var propName = valuePropNames[values[i]];
        descriptionValues.push({
            description: desc,
            value: values[i],
            propName: propName
        });
    }
    descriptionValues.sort(function(v1, v2) {
        return strcmp(v2.description, v1.description);
    });

    for (var i=0; i<descriptionValues.length; i++) {
        var dv = descriptionValues[i];
        values[i] = dv.value;
        obj[dv.propName] = values[i];
        //        console.log(dv.description);
    }
    obj.possibleValues = values;
}


function stringEndsWith(str, suffix) {
    return str.length == suffix.length ? str == suffix : str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function stringStartsWith(str, prefix) {
    return str.slice(0, prefix.length) == prefix;
}

function userToDirName(user) {
    var oldUser = user;
    var strs = ["http://www.", "https://www."];
    for (var i=0; i<strs.length; i++) {
        var str = strs[i];
        if (user.indexOf(str) == 0) {
            user = user.substring(str.length);
        }
    }
    var temp = user;
    var result = temp.replace(/[^a-zA-Z\d_]/g, "_");
    return result;
}

function getArrayValueOrDefault(arr, i, def, validFunc) {
    if (arr && arr.length > 0) {
        var v = arr[i % arr.length];
        if (!validFunc || validFunc(v)) {
            return v;
        }
    }
    return def;
}

function padNumberString(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}



function validateArrayValue(arrayValue, allowedTypes, defaultAllowedArrayTypes, correct) {
    if (!allowedTypes) {
        allowedTypes = defaultAllowedArrayTypes;
    }
    if (!allowedTypes) {
        return false;
    }

    var result = true;

    var type = typeof(arrayValue);

    if (isArray(arrayValue)) {
        result = allowedTypes["array"];
    } else if (type === 'object') {
        result = allowedTypes[arrayValue._constructorName];
        if (result) {
            // Need to validate against a default value there as well
            var safeValue = eval("new " + arrayValue._constructorName + "()");
            result = validateValueWithSafeValue(arrayValue, safeValue, null, defaultAllowedArrayTypes, correct);
//            console.log("Validated object in array " + arrayValue._constructorName + ". Result: " + result);
        }
    } else {
        result = allowedTypes[type];
    }
    return result;
}

// Recursively checks that the testObject has the same properties as the originalObject
// testObject can have fewer properties
// The types of the objects must also be the same
function validateValueWithSafeValue(testValue, safeValue, allowedTypes, defaultAllowedArrayTypes, correct) {

    if (!testValue) {
        return true;
    }

    var testType = typeof(testValue);
    var safeType = typeof(safeValue);

    if (testType != safeType) {
        return false;
    }

    var wasValid = true;

    if (isArray(testValue)) {

        if (!isArray(safeValue)) {
            return false;
        }

        var arrayOk = true;
        for (var i=0; i<testValue.length; i++) {
            var val = testValue[i];
            var typeValid = validateArrayValue(val, allowedTypes, defaultAllowedArrayTypes, correct);
            if (!typeValid) {
                logit("Type not valid in array " + val + " " + typeof(val) + " " + allowedTypes);
                arrayOk = false;
                break;
            }
        }
        if (!arrayOk) {
            if (correct) {
                testValue.length = 0; // Just nuke the whole array
                return true;
            } else {
                return false;
            }
        }

    } else if (testType == 'object') {
        for (var prop in testValue) {
            var oldValue = safeValue[prop];
            if (typeof(oldValue) == 'undefined') {
                logit("Property " + prop + " in " + safeValue._constructorName + " did not exist");
                if (correct) {
                    // Just removed the incorrect value
                    logit("Removed it!");
                    delete testValue[prop];
                    return true;
                }
                return false; // Property did not exist in original
            } else {
                var newValue = testValue[prop];

                var types = safeValue[prop + "_allowedTypes"];

//                if (types) {
//                    console.log("Found types for " + prop);
//                }
//                if (!types && isArray(newValue)) {
//                    console.log(safeValue._constructorName + " missing allowed types for array")
//                }

                var v = validateValueWithSafeValue(newValue, oldValue, types, defaultAllowedArrayTypes, correct);
                if (!v) {
                    logit("Property " + prop + " in " + safeValue._constructorName + " was not valid");
//                    console.log(newValue);
                    if (correct) {
                        logit("Used default value for it instead!");
                        testValue[prop] = oldValue;
                        return true;
                    } else {
                        return false;
                    }
                }

            }
        }
    }

    return wasValid;

};


function midiNoteToFrequency(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
}



var VoiceLineSemantics = {
    MELODY: 0,
    INNER: 1,
    BASS: 2,
    DOUBLED: 3
};


// Chord types
var ChordType = {
    TRIAD: 0,
    SEVENTH: 1,
    SUS2: 2,
    SUS4: 3,
    SUS2_SEVENTH: 4,
    SUS4_SEVENTH: 5,
    NINTH: 6,
    CUSTOM: 7,

    toString: function(type) {
        switch (type) {
            case ChordType.CUSTOM:
                return "Custom";
            case ChordType.SEVENTH:
                return "Seventh";
            case ChordType.SUS2:
                return "Sus2";
            case ChordType.SUS2_SEVENTH:
                return "Sus2 Seventh";
            case ChordType.SUS4:
                return "Sus4";
            case ChordType.SUS4_SEVENTH:
                return "Sus4 Seventh";
            case ChordType.TRIAD:
                return "Triad";
            case ChordType.NINTH:
                return "Ninth";
        }
        return "Unknown chord type " + type;
    }
};
addPossibleValuesFunction(ChordType, ChordType.TRIAD, ChordType.CUSTOM);



var SimpleScaleType = {
    MAJOR: 1,
    NATURAL_MINOR: 2,

    toString: function(type) {
        switch (type) {
            case SimpleScaleType.MAJOR:
                return "Major";
            case SimpleScaleType.NATURAL_MINOR:
                return "Minor";
        }
        return "Unknown scale type " + type;
    }
};
addPossibleValuesFunction(SimpleScaleType, SimpleScaleType.MAJOR, SimpleScaleType.NATURAL_MINOR);



var ScaleType = {
    CUSTOM: 0,
    MAJOR: 1,
    NATURAL_MINOR: 2,
    HARMONIC_MINOR: 3,
    MELODIC_MINOR: 4,
    PERSIAN: 5,
    DIMINISHED: 6,
    WHOLE_NOTE: 7,

    MAJOR_SCALE_STEPS: [ 0, 2, 4, 5, 7, 9, 11 ],
    NATURAL_MINOR_SCALE_STEPS: [ 0, 2, 3, 5, 7, 8, 10 ],
    HARMONIC_MINOR_SCALE_STEPS: [ 0, 2, 3, 5, 7, 8, 11 ],
    MELODIC_MINOR_SCALE_STEPS: [ 0, 2, 3, 5, 7, 9, 11 ],
    PERSIAN_SCALE_STEPS: [ 0, 1, 4, 5, 6, 8, 11 ],
    DIMINISHED_SCALE_STEPS: [ 0, 1, 3, 4, 6, 7, 9, 10 ],
    WHOLE_NOTE_SCALE_STEPS: [ 0, 2, 4, 6, 8, 10 ],

    getChromaticSteps: function(type) {
        switch (type) {
            case ScaleType.MAJOR:
                return ScaleType.MAJOR_SCALE_STEPS;
            case ScaleType.NATURAL_MINOR:
                return ScaleType.NATURAL_MINOR_SCALE_STEPS;
            case ScaleType.HARMONIC_MINOR:
                return ScaleType.HARMONIC_MINOR_SCALE_STEPS;
            case ScaleType.MELODIC_MINOR:
                return ScaleType.MELODIC_MINOR_SCALE_STEPS;
            case ScaleType.PERSIAN:
                return ScaleType.PERSIAN_SCALE_STEPS;
            case ScaleType.DIMINISHED:
                return ScaleType.DIMINISHED_SCALE_STEPS;
            case ScaleType.WHOLE_NOTE:
                return ScaleType.WHOLE_NOTE_SCALE_STEPS;
            default:
                return ScaleType.MAJOR_SCALE_STEPS;
        }
        return ScaleType.MAJOR_SCALE_STEPS;
    },

    toString: function(type) {
        switch (type) {
            case ScaleType.CUSTOM:
                return "Custom";
            case ScaleType.MAJOR:
                return "Major";
            case ScaleType.NATURAL_MINOR:
                return "Minor";
            case ScaleType.HARMONIC_MINOR:
                return "Harmonic minor";
            case ScaleType.MELODIC_MINOR:
                return "Melodic minor";
            case ScaleType.PERSIAN:
                return "Persian";
            case ScaleType.DIMINISHED:
                return "Diminished";
            case ScaleType.WHOLE_NOTE:
                return "Whole note";
        }
        return "Unknown scale type " + type;
    }
};
addPossibleValuesFunction(ScaleType, ScaleType.CUSTOM, ScaleType.WHOLE_NOTE);



var IndexType = {
    MIDI_NOTE: 0,
    SCALE: 1,
    CHORD_BASS: 2,
    CHORD_ROOT: 3,

    toString: function(type) {
        switch (type) {
            case IndexType.MIDI_NOTE:
                return "Midi note";
            case IndexType.SCALE:
                return "Scale";
            case IndexType.CHORD_BASS:
                return "Chord bass";
            case IndexType.CHORD_ROOT:
                return "Chord root";
        }
        return "Unknown index type " + type;
    }
};
addPossibleValuesFunction(IndexType, IndexType.MIDI_NOTE, IndexType.CHORD_ROOT);



// Snap types
var SnapType = {
    NONE: 0,
    SCALE: 1,
    CHORD: 2,

    toString: function(type) {
        switch (type) {
            case SnapType.NONE:
                return "None";
            case SnapType.CHORD:
                return "Chord";
            case SnapType.SCALE:
                return "Scale";
        }
        return "Unknown snap type " + type;
    }
};
addPossibleValuesFunction(SnapType, SnapType.NONE, SnapType.CHORD);

var FrequencyUnit = {
    HERTZ: 0,
    MIDI_NOTE: 1,

    toString: function(type) {
        switch (type) {
            case FrequencyUnit.HERTZ:
                return "Hertz";
            case FrequencyUnit.MIDI_NOTE:
                return "Midi note";
        }
        return "Unknown frequency unit " + type;
    }
};
addPossibleValuesFunction(FrequencyUnit, FrequencyUnit.HERTZ, FrequencyUnit.MIDI_NOTE);


var CyclesUnit = {
    CYCLES_PER_PERIOD: 0,
    CYCLES_PER_BEAT: 1,
    CYCLES_PER_MEASURE: 2,
    CYCLES_PER_HARMONY: 3,

    getFrequency: function(unit, cycles, periodStartBeat, periodEndBeat, harmony) {
        var periodBeats = periodEndBeat - periodStartBeat;
        if (periodBeats > 0) {
            switch (unit) {
                case CyclesUnit.CYCLES_PER_PERIOD:
                    return cycles;
                case CyclesUnit.CYCLES_PER_BEAT:
                    return cycles;
                case CyclesUnit.CYCLES_PER_MEASURE:
                    // positionUnitToBeats(length, unit, numerator, denominator, harmony);
                    return cycles;
                case CyclesUnit.CYCLES_PER_HARMONY:
                    var harmonyBeats = harmony.getBeatLength();
                    return periodBeats / harmonyBeats;
            }
        }
        return cycles;
    },
    toString: function(type) {
        switch (type) {
            case CyclesUnit.CYCLES_PER_PERIOD:
                return "Cycles per period";
            case CyclesUnit.CYCLES_PER_BEAT:
                return "Cycles per beat";
            case CyclesUnit.CYCLES_PER_MEASURE:
                return "Cycles per measure";
            case CyclesUnit.CYCLES_PER_HARMONY:
                return "Cycles per harmony";
        }
        return "Unknown cycles unit " + type;
    }
};
addPossibleValuesFunction(CyclesUnit, CyclesUnit.CYCLES_PER_PERIOD, CyclesUnit.CYCLES_PER_HARMONY);


function frequencyUnitToHertz(freq, unit) {
    switch (unit) {
        case FrequencyUnit.HERTZ:
            return freq;
        case FrequencyUnit.MIDI_NOTE:
            var n = freq - 69; // A4;
            return 440.0 * Math.pow(2.0, n / 12.0);
    }
    return freq;
}


var SnapMetrics = {
    FLOOR: 0,
    CEIL: 1,
    ROUND: 2,
    toString: function(type) {
        switch (type) {
            case SnapMetrics.CEIL:
                return "Ceil";
            case SnapMetrics.FLOOR:
                return "Floor";
            case SnapMetrics.ROUND:
                return "Round";
        }
        return "Unknown snap metrics " + type;
    },
    snap: function(value, metrics) {
        switch (metrics) {
            case SnapMetrics.CEIL:
                return Math.ceil(value);
            case SnapMetrics.FLOOR:
                return Math.floor(value);
            case SnapMetrics.ROUND:
                return Math.round(value);
        }
        return Math.round(value);
    }
};
addPossibleValuesFunction(SnapMetrics, SnapMetrics.FLOOR, SnapMetrics.ROUND);


var VerticalRelativeType = {
    //
    MIDI_ZERO: 0, //
    SCALE_BASE: 1, //
    CHORD_BASS: 2,
    CHORD_ROOT: 3, //
    VOICE_LINE: 4,
    NOTE: 5,

    toString: function(type) {
        switch (type) {
            case VerticalRelativeType.MIDI_ZERO:
                return "Midi zero";
            case VerticalRelativeType.SCALE_BASE:
                return "Scale base";
            case VerticalRelativeType.CHORD_BASS:
                return "Chord bass";
            case VerticalRelativeType.CHORD_ROOT:
                return "Chord root";
            case VerticalRelativeType.VOICE_LINE:
                return "Voice line";
            case VerticalRelativeType.NOTE:
                return "Note";
        }
        return "Unknown type " + type;
    },

    sample: function(rnd) {
        return Math.min(4, Math.max(0, Math.floor(rnd.random() * 5)));
    }
};
addPossibleValuesFunction(VerticalRelativeType, VerticalRelativeType.MIDI_ZERO, VerticalRelativeType.NOTE);





var IndexBorderMode = {
    END: 0,
    RESTART: 1,
    MIRROR: 2,
    CLAMP: 3,

    toString: function(type) {
        switch (type) {
            case IndexBorderMode.END:
                return "End";
            case IndexBorderMode.RESTART:
                return "Restart";
            case IndexBorderMode.MIRROR:
                return "Mirror";
            case IndexBorderMode.CLAMP:
                return "Clamp";
        }
    },

    getIndex: function(mode, size, index) {
        if (index < size) {
            return index;
        }
        switch (mode) {
            case IndexBorderMode.END:
                return -1;
            case IndexBorderMode.CLAMP:
                return size - 1;
            case IndexBorderMode.RESTART:
                return index % size;
            case IndexBorderMode.MIRROR:
                var period = size * 2;
                var periodIndex = index % period;
                if (periodIndex < size) {
                    return periodIndex;
                } else {
                    return period - periodIndex - 1;
                }
                return index % size;
        }
        return index;
    }
};
addPossibleValuesFunction(IndexBorderMode, IndexBorderMode.END, IndexBorderMode.CLAMP);



var HorizontalRelativeType = {
    PREVIOUS_NOTE: 0, //
    NEXT_NOTE: 1, //
    PREVIOUS_VOICE_LINE_ELEMENT: 2, //
    NEXT_VOICE_LINE_ELEMENT: 3, //

    toString: function(type) {
        switch (type) {
            case HorizontalRelativeType.NEXT_NOTE:
                return "Next note";
            case HorizontalRelativeType.NEXT_VOICE_LINE_ELEMENT:
                return "Next voice line element";
            case HorizontalRelativeType.PREVIOUS_NOTE:
                return "Previous note";
            case HorizontalRelativeType.PREVIOUS_VOICE_LINE_ELEMENT:
                return "Previous voice line element";
        }
        return "Unknown horiz. relative type " + type;
    }
};
addPossibleValuesFunction(HorizontalRelativeType, HorizontalRelativeType.PREVIOUS_NOTE, VerticalRelativeType.NEXT_VOICE_LINE_ELEMENT);


var OffsetType = {
    CHORD: 0,
    SCALE: 1,
    HALF_STEP: 2,
    OCTAVE: 3,
    CHORD_TRIAD_ONLY: 4,
    CHORD_SEVENTH_ONLY: 5,

    toString: function(type) {
        switch (type) {
            case OffsetType.CHORD:
                return "Chord";
            case OffsetType.SCALE:
                return "Scale";
            case OffsetType.HALF_STEP:
                return "Half step";
            case OffsetType.OCTAVE:
                return "Octave";
            case OffsetType.CHORD_TRIAD_ONLY:
                return "Chord triad only";
            case OffsetType.CHORD_SEVENTH_ONLY:
                return "Chord seventh only";
        }
        return "Unknown offset type " + type;
    }

};
addPossibleValuesFunction(OffsetType, OffsetType.CHORD, OffsetType.CHORD_SEVENTH_ONLY);


var LengthAndCountUnit = {
    LENGTH_PERCENT: 0,
    COUNT_PERCENT: 1,
    LENGTH: 2,
    COUNT: 3,

    toString: function(unit) {
        switch (unit) {
            case LengthAndCountUnit.LENGTH:
                return "Length";
            case LengthAndCountUnit.COUNT:
                return "Count";
            case LengthAndCountUnit.LENGTH_PERCENT:
                return "Length percent";
            case LengthAndCountUnit.COUNT_PERCENT:
                return "Count percent";
        }
        return "Unknown length and count unit";
    }

};
addPossibleValuesFunction(LengthAndCountUnit, LengthAndCountUnit.LENGTH_PERCENT, LengthAndCountUnit.COUNT);


var CountUnit = {
    PLAIN: 0,
    HARMONY_ELEMENT_MEASURES: 1,
    HARMONY_ELEMENT_BEATS: 2,
    HARMONY_MEASURES: 3,
    HARMONY_BEATS: 4,
    HARMONY_ELEMENT_COUNT: 5,
    PLAIN_PLUS_HARMONY_ELEMENT_MEASURES: 6,
    PLAIN_PLUS_HARMONY_ELEMENT_BEATS: 7,
    PLAIN_PLUS_HARMONY_MEASURES: 8,
    PLAIN_PLUS_HARMONY_BEATS: 9,
    PLAIN_PLUS_HARMONY_ELEMENT_COUNT: 10,
    PHRASE_ELEMENT_COUNT: 11,

    toString: function(unit) {
        switch (unit) {
            case CountUnit.PLAIN:
                return "Plain";
            case CountUnit.HARMONY_BEATS:
                return "Harmony beats";
            case CountUnit.HARMONY_ELEMENT_BEATS:
                return "Harmony element beats";
            case CountUnit.HARMONY_ELEMENT_COUNT:
                return "Harmony element count";
            case CountUnit.HARMONY_ELEMENT_MEASURES:
                return "Harmony element measures";
            case CountUnit.HARMONY_MEASURES:
                return "Harmony measures";
            case CountUnit.PHRASE_ELEMENT_COUNT:
                return "Phrase element count";
            case CountUnit.PLAIN_PLUS_HARMONY_BEATS:
                return "Plain + Harmony beats";
            case CountUnit.PLAIN_PLUS_HARMONY_ELEMENT_BEATS:
                return "Plain + Harmony element beats";
            case CountUnit.PLAIN_PLUS_HARMONY_ELEMENT_COUNT:
                return "Plain + Harmony element count";
            case CountUnit.PLAIN_PLUS_HARMONY_ELEMENT_MEASURES:
                return "Plain + Harmony element measures";
            case CountUnit.PLAIN_PLUS_HARMONY_MEASURES:
                return "Plain + Harmony measures";
        }
        return "Unknown count unit " + unit;
    },

    getCount: function(count, unit, harmony, harmonyBeatOffset) {
        switch (unit) {
            case CountUnit.PLAIN:
                return count;
            case CountUnit.HARMONY_ELEMENT_COUNT:
                return harmony.getCount() * count;
            case CountUnit.HARMONY_BEATS:
                var beats = 0;
                for (var i=0; i<harmony.getCount(); i++) {
                    var he = harmony.get(i);
                    beats += positionUnitToBeats(he.length, he.lengthUnit, he.tsNumerator, he.tsDenominator, null);
                }
                return beats * count;
            case CountUnit.HARMONY_ELEMENT_BEATS:
                var harmonyIndex = harmony.getHarmonyIndexAt(harmonyBeatOffset);
                var he = harmony.get(harmonyIndex);
                return count * positionUnitToBeats(he.length, he.lengthUnit, he.tsNumerator, he.tsDenominator, null);
            case CountUnit.HARMONY_ELEMENT_MEASURES:
                var harmonyIndex = harmony.getHarmonyIndexAt(harmonyBeatOffset);
                var he = harmony.get(harmonyIndex);
                var beats = positionUnitToBeats(he.length, he.lengthUnit, he.tsNumerator, he.tsDenominator, null);
                return count * (beats / he.tsNumerator);
            case CountUnit.HARMONY_MEASURES:
                var measures = 0;
                for (var i=0; i<harmony.getCount(); i++) {
                    var he = harmony.get(i);
                    var beats = positionUnitToBeats(he.length, he.lengthUnit, he.tsNumerator, he.tsDenominator, null);
                    measures += (beats / he.tsNumerator);
                }
                return measures * count;

            case CountUnit.PHRASE_ELEMENT_COUNT:
                var range = harmony.getPhraseRangeAt(harmonyBeatOffset);
                return count * (range[1] - range[0] + 1);
            case CountUnit.PLAIN_PLUS_HARMONY_ELEMENT_COUNT:
                return harmony.getCount() + count;
            case CountUnit.PLAIN_PLUS_HARMONY_BEATS:
                var beats = 0;
                for (var i=0; i<harmony.getCount(); i++) {
                    var he = harmony.get(i);
                    beats += positionUnitToBeats(he.length, he.lengthUnit, he.tsNumerator, he.tsDenominator, null);
                }
                return beats + count;
            case CountUnit.PLAIN_PLUS_HARMONY_ELEMENT_BEATS:
                var harmonyIndex = harmony.getHarmonyIndexAt(harmonyBeatOffset);
                var he = harmony.get(harmonyIndex);
                return count + positionUnitToBeats(he.length, he.lengthUnit, he.tsNumerator, he.tsDenominator, null);
            case CountUnit.PLAIN_PLUS_HARMONY_ELEMENT_MEASURES:
                var harmonyIndex = harmony.getHarmonyIndexAt(harmonyBeatOffset);
                var he = harmony.get(harmonyIndex);
                var beats = positionUnitToBeats(he.length, he.lengthUnit, he.tsNumerator, he.tsDenominator, null);
                return beats / he.tsNumerator + count;
            case CountUnit.PLAIN_PLUS_HARMONY_MEASURES:
                var measures = 0;
                for (var i=0; i<harmony.getCount(); i++) {
                    var he = harmony.get(i);
                    var beats = positionUnitToBeats(he.length, he.lengthUnit, he.tsNumerator, he.tsDenominator, null);
                    measures += (beats / he.tsNumerator);
                }
                return measures + count;
        }
        return count;
    }
};
addPossibleValuesFunction(CountUnit, CountUnit.PLAIN, CountUnit.PLAIN_PLUS_HARMONY_ELEMENT_COUNT);


var PositionUnit = {
    MEASURES: 0,
    BEATS: 1,
    WHOLE_NOTES: 2,
    HALF_NOTES: 3,
    QUARTER_NOTES: 4,
    EIGHTH_NOTES: 5,
    SIXTEENTH_NOTES: 6,
    BEATS_PLUS_MEASURE: 7,
    BEAT_THIRDS: 8,
    BEAT_FOURTHS: 9,
    BEAT_FIFTHS: 10,
    BEAT_SIXTHS: 11,
    BEAT_SEVENTHS: 12,
    BEAT_EIGHTHS: 13,
    BEAT_NINTHS: 14,
    HARMONY_INDEX: 15,
    HARMONY: 16,
    BEATS_PLUS_HARMONY: 17,
    BEATS_PLUS_HARMONY_ELEMENT: 18,
    HARMONY_ELEMENTS: 19,
    PHRASE: 20,
    // Add MEASURE_THIRDS/FOURTHS/FIFTHS/SIXTHS/SEVENTHS/EIGHTHS/NINTHS

    toString: function(unit) {
        switch (unit) {
            case PositionUnit.BEATS:
                return "Beats";
            case PositionUnit.BEATS_PLUS_MEASURE:
                return "Beats plus one measure";
            case PositionUnit.BEATS_PLUS_HARMONY:
                return "Beats plus harmony length";
            case PositionUnit.BEATS_PLUS_HARMONY_ELEMENT:
                return "Beats plus harmony element length";
            case PositionUnit.BEAT_EIGHTHS:
                return "Beat eighths";
            case PositionUnit.BEAT_FIFTHS:
                return "Beat fifths";
            case PositionUnit.BEAT_FOURTHS:
                return "Beat fourths";
            case PositionUnit.BEAT_NINTHS:
                return "Beat ninths";
            case PositionUnit.BEAT_SEVENTHS:
                return "Beat sevenths";
            case PositionUnit.BEAT_SIXTHS:
                return "Beat sixths";
            case PositionUnit.BEAT_THIRDS:
                return "Beat thirds";
            case PositionUnit.EIGHTH_NOTES:
                return "Eighth notes";
            case PositionUnit.HALF_NOTES:
                return "Half notes";
            case PositionUnit.MEASURES:
                return "Measures";
            case PositionUnit.QUARTER_NOTES:
                return "Quarter notes";
            case PositionUnit.SIXTEENTH_NOTES:
                return "Sixteenth notes";
            case PositionUnit.WHOLE_NOTES:
                return "Whole notes";
            case PositionUnit.HARMONY_INDEX:
                return "Harmony index";
            case PositionUnit.HARMONY:
                return "Harmony";
            case PositionUnit.HARMONY_ELEMENTS:
                return "Harmony elements";
            case PositionUnit.PHRASE:
                return "Phrase";
        }
        return "Unknown position unit " + unit;
    }
};
addPossibleValuesFunction(PositionUnit, PositionUnit.MEASURES, PositionUnit.PHRASE);


function positionUnitToBeats2(length, unit, harmonyBeatOffset, harmony) {
    var harmonyIndex = harmony.getHarmonyIndexAt(harmonyBeatOffset);

    var harmonyElement = harmony.get(harmonyIndex);

    // Find the phrase index range
    var phraseStartIndex = 0;
    for (var i=harmonyIndex; i>=0; i--) {
        var he = harmony.get(i);
        if (he.startsPhrase) {
            phraseStartIndex = i;
            break;
        }
    }
    var phraseEndIndex = harmony.getCount();
    for (var i=harmonyIndex; i<harmony.getCount(); i++) {
        var he = harmony.get(i);
        if (he.startsPhrase) {
            phraseEndIndex = Math.max(i - 1, harmonyIndex);
            break;
        }
    }

    return positionUnitToBeats(length, unit, harmonyElement.tsNumerator, harmonyElement.tsDenominator, harmony, harmonyElement,
        [phraseStartIndex, phraseEndIndex]);
}


function positionUnitToBeats(length, unit, numerator, denominator, harmony, harmonyElement, phraseIndexRange) {
    var multiplier = 1.0;
    switch (denominator) {
        case 2:
            multiplier = 0.5;
            break;
        case 4:
            multiplier = 1.0;
            break;
        case 8:
            multiplier = 2.0;
            break;
    }

    switch (unit) {
        case PositionUnit.BEATS:
            return length;
        case PositionUnit.BEAT_THIRDS:
            return length / 3.0;
        case PositionUnit.BEAT_FOURTHS:
            return length / 4.0;
        case PositionUnit.BEAT_FIFTHS:
            return length / 5.0;
        case PositionUnit.BEAT_SIXTHS:
            return length / 6.0;
        case PositionUnit.BEAT_SEVENTHS:
            return length / 7.0;
        case PositionUnit.BEAT_EIGHTHS:
            return length / 8.0;
        case PositionUnit.BEAT_NINTHS:
            return length / 9.0;
        case PositionUnit.QUARTER_NOTES:
            return multiplier * length;
        case PositionUnit.EIGHTH_NOTES:
            return multiplier * 0.5 * length;
        case PositionUnit.HALF_NOTES:
            return multiplier * 2.0 * length;
        case PositionUnit.MEASURES:
            return numerator * length;
        case PositionUnit.SIXTEENTH_NOTES:
            return multiplier * 0.25 * length;
        case PositionUnit.WHOLE_NOTES:
            return multiplier * 4 * length;
        case PositionUnit.BEATS_PLUS_MEASURE:
            return numerator + length;
        case PositionUnit.HARMONY:
            if (harmony) {
                return length * harmony.getBeatLength();
            } else {
                return length * numerator;
            }
        case PositionUnit.HARMONY_ELEMENTS:
            if (harmonyElement) {
                return length * positionUnitToBeats(harmonyElement.length, harmonyElement.lengthUnit, numerator, denominator);
            } else {
                return length * numerator;
            }
        case PositionUnit.BEATS_PLUS_HARMONY_ELEMENT:
            if (harmonyElement) {
                return length + positionUnitToBeats(harmonyElement.length, harmonyElement.lengthUnit, numerator, denominator);
            } else {
                return numerator + length;
            }
        case PositionUnit.BEATS_PLUS_HARMONY:
            if (harmony) {
                return length + harmony.getBeatLength();
            } else {
                return numerator + length;
            }
        case PositionUnit.HARMONY_INDEX:
            if (harmony) {
                var intLength = Math.floor(length);

                var frac = length - intLength;
                var currentBeat = 0;
                var lastExisting = null;
                for (var i = 0; i<intLength; i++) {
                    var he = harmony.get(i);
                    if (he) {
                        currentBeat += positionUnitToBeats(he.length, he.lengthUnit, he.tsNumerator, he.tsDenominator, null);
                        lastExisting = he;
                    }
                }
                var last = harmony.get(intLength);
                if (!last) {
                    last = lastExisting;
                }
                if (last) {
                    currentBeat += positionUnitToBeats(last.length * frac, last.lengthUnit, last.tsNumerator, last.tsDenominator, null);
                }
                return currentBeat;
            } else {
                return positionUnitToBeats(length, PositionUnit.MEASURES, numerator, denominator, harmony);
            }
            break;
        case PositionUnit.PHRASE:
            if (harmony) {
                if (phraseIndexRange) {
                    var phraseBeatLength = 0;
                    for (var i=phraseIndexRange[0]; i<=phraseIndexRange[1]; i++) {
                        if (i >= 0 && i < harmony.getCount()) {
                            phraseBeatLength += harmony.get(i).getBeatLength();
                        }
                    }
                    return length * phraseBeatLength;
                } else {
                    return length * harmony.getBeatLength();
                }
            } else {
                return length * numerator;
            }
            break;
    }

    return length;
}


var PhraseHarmonyElementType = {
    COMPLETE: 0,
    COMPLETE_IMPERFECT: 1,
    INCOMPLETE: 2,
    DECEPTIVE: 3,
    ANTECEDENT_CONSEQUENT: 4,
    PROLONGED_TONIC: 5,
    PROLONGED_TONIC_INCOMPLETE: 6,
    PROLONGED_TONIC_COMPLETE: 7,
    PROLONGED_TONIC_COMPLETE_IMPERFECT: 8,
    COMPLETE_MODULATE: 9,
    CONSEQUENT: 10,
    COMPLETE_MODULATE_IMPERFECT: 11,
    INCOMPLETE_INITIAL: 12,
    PROLONGED_DOMINANT: 13,
    PROLONGED_DOMINANT_CADENCE: 14,
    COMPLETE_PLAGIAL: 15,
    CHROMATIC_TRANSITION_INCOMPLETE: 16,
    CHROMATIC_TRANSITION_COMPLETE: 17,
    CHROMATIC_TRANSITION_MODULATE: 18,
    CHROMATIC_TRANSITION_TONICIZE: 19,
    COMPLETE_TONICIZE: 20,
    COMPLETE_TONICIZE_IMPERFECT: 21,
    COMPLETE_LENGTHEN_FINAL_TONIC: 22,
    COMPLETE_LENGTHEN_DOMINANT: 23,
    INCOMPLETE_NO_DOMINANT: 24,
    CHROMATIC_OSCILLATION: 25,

    toString: function(type) {
        switch (type) {
            case PhraseHarmonyElementType.CHROMATIC_OSCILLATION:
                return "Chromatic oscillation";
            case PhraseHarmonyElementType.INCOMPLETE_NO_DOMINANT:
                return "Incomplete no dominant";
            case PhraseHarmonyElementType.COMPLETE_TONICIZE:
                return "Complete tonicize";
            case PhraseHarmonyElementType.COMPLETE_LENGTHEN_FINAL_TONIC:
                return "Complete lengthen final tonic";
            case PhraseHarmonyElementType.COMPLETE_LENGTHEN_DOMINANT:
                return "Complete lengthen cadence dominant";
            case PhraseHarmonyElementType.COMPLETE_TONICIZE_IMPERFECT:
                return "Complete tonicize imperfect";
            case PhraseHarmonyElementType.CHROMATIC_TRANSITION_MODULATE:
                return "Chromatic transition modulate";
            case PhraseHarmonyElementType.CHROMATIC_TRANSITION_TONICIZE:
                return "Chromatic transition tonicize";
            case PhraseHarmonyElementType.CHROMATIC_TRANSITION_INCOMPLETE:
                return "Chromatic transition incomplete";
            case PhraseHarmonyElementType.CHROMATIC_TRANSITION_COMPLETE:
                return "Chromatic transition complete";
            case PhraseHarmonyElementType.ANTECEDENT_CONSEQUENT:
                return "Antecedent consequent";
            case PhraseHarmonyElementType.COMPLETE:
                return "Complete";
            case PhraseHarmonyElementType.COMPLETE_IMPERFECT:
                return "Complete imperfect";
            case PhraseHarmonyElementType.INCOMPLETE:
                return "Incomplete";
            case PhraseHarmonyElementType.INCOMPLETE_INITIAL:
                return "Incomplete initial";
            case PhraseHarmonyElementType.DECEPTIVE:
                return "Deceptive";
            case PhraseHarmonyElementType.PROLONGED_TONIC:
                return "Prolonged tonic";
            case PhraseHarmonyElementType.PROLONGED_TONIC_COMPLETE:
                return "Prolonged tonic complete";
            case PhraseHarmonyElementType.PROLONGED_TONIC_COMPLETE_IMPERFECT:
                return "Prolonged tonic imperfect";
            case PhraseHarmonyElementType.PROLONGED_TONIC_INCOMPLETE:
                return "Prolonged tonic incomplete";
            case PhraseHarmonyElementType.COMPLETE_MODULATE:
                return "Complete modulate";
            case PhraseHarmonyElementType.COMPLETE_MODULATE_IMPERFECT:
                return "Complete modulate imperfect";
            case PhraseHarmonyElementType.CONSEQUENT:
                return "Consequent";
            case PhraseHarmonyElementType.PROLONGED_DOMINANT:
                return "Prolonged dominant";
            case PhraseHarmonyElementType.PROLONGED_DOMINANT_CADENCE:
                return "Prolonged dominant cadence";
            case PhraseHarmonyElementType.COMPLETE_PLAGIAL:
                return "Complete plagial";
        }
        return "Unknown phrase harmony element type " + type;
    }

};
addPossibleValuesFunction(PhraseHarmonyElementType, PhraseHarmonyElementType.COMPLETE, PhraseHarmonyElementType.CHROMATIC_OSCILLATION);
// Give credit to the one who coded this!

function Map(linkEntries) {
    this.current = undefined;
    this.size = 0;
    this.isLinked = true;

    if(linkEntries === false)
        this.disableLinking();
}

Map.from = function(obj, foreignKeys, linkEntries) {
    var map = new Map(linkEntries);

    for(var prop in obj) {
        if(foreignKeys || obj.hasOwnProperty(prop))
            map.put(prop, obj[prop]);
    }

    return map;
};

Map.noop = function() {
    return this;
};

Map.illegal = function() {
    throw new Error('can\'t do this with unlinked maps');
};

Map.prototype.disableLinking = function() {
    this.isLinked = false;
    this.link = Map.noop;
    this.unlink = Map.noop;
    this.disableLinking = Map.noop;
    this.next = Map.illegal;
    this.key = Map.illegal;
    this.value = Map.illegal;
    this.removeAll = Map.illegal;
    this.each = Map.illegal;
    this.flip = Map.illegal;
    this.drop = Map.illegal;
    this.listKeys = Map.illegal;
    this.listValues = Map.illegal;

    return this;
};

Map.prototype.hash = function(value) {
    return value instanceof Object ? (value.__hash ||
        (value.__hash = 'object ' + ++arguments.callee.current)) :
    (typeof value) + ' ' + String(value);
};

Map.prototype.hash.current = 0;

Map.prototype.link = function(entry) {
    if(this.size === 0) {
        entry.prev = entry;
        entry.next = entry;
        this.current = entry;
    }
    else {
        entry.prev = this.current.prev;
        entry.prev.next = entry;
        entry.next = this.current;
        this.current.prev = entry;
    }
};

Map.prototype.unlink = function(entry) {
    if(this.size === 0)
        this.current = undefined;
    else {
        entry.prev.next = entry.next;
        entry.next.prev = entry.prev;
        if(entry === this.current)
            this.current = entry.next;
    }
};

Map.prototype.get = function(key) {
    var entry = this[this.hash(key)];
    return typeof entry === 'undefined' ? undefined : entry.value;
};

Map.prototype.put = function(key, value) {
    var hash = this.hash(key);

    if(this.hasOwnProperty(hash))
        this[hash].value = value;
    else {
        var entry = {
            key : key,
            value : value
        };
        this[hash] = entry;

        this.link(entry);
        ++this.size;
    }

    return this;
};

Map.prototype.remove = function(key) {
    var hash = this.hash(key);

    if(this.hasOwnProperty(hash)) {
        --this.size;
        this.unlink(this[hash]);

        delete this[hash];
    }

    return this;
};

Map.prototype.removeAll = function() {
    while(this.size)
        this.remove(this.key());

    return this;
};

Map.prototype.contains = function(key) {
    return this.hasOwnProperty(this.hash(key));
};

Map.prototype.isUndefined = function(key) {
    var hash = this.hash(key);
    return this.hasOwnProperty(hash) ?
    typeof this[hash] === 'undefined' : false;
};

Map.prototype.next = function() {
    this.current = this.current.next;
};

Map.prototype.key = function() {
    return this.current.key;
};

Map.prototype.value = function() {
    return this.current.value;
};

Map.prototype.each = function(func, thisArg) {
    if(typeof thisArg === 'undefined')
        thisArg = this;

    for(var i = this.size; i--; this.next()) {
        var n = func.call(thisArg, this.key(), this.value(), i > 0);
        if(typeof n === 'number')
            i += n; // allows to add/remove entries in func
    }

    return this;
};

Map.prototype.flip = function(linkEntries) {
    var map = new Map(linkEntries);

    for(var i = this.size; i--; this.next()) {
        var	value = this.value(),
        list = map.get(value);

        if(list) list.push(this.key());
        else map.put(value, [this.key()]);
    }

    return map;
};

Map.prototype.drop = function(func, thisArg) {
    if(typeof thisArg === 'undefined')
        thisArg = this;

    for(var i = this.size; i--; ) {
        if(func.call(thisArg, this.key(), this.value())) {
            this.remove(this.key());
            --i;
        }
        else this.next();
    }

    return this;
};

Map.prototype.listValues = function() {
    var list = [];

    for(var i = this.size; i--; this.next())
        list.push(this.value());

    return list;
}

Map.prototype.listKeys = function() {
    var list = [];

    for(var i = this.size; i--; this.next())
        list.push(this.key());

    return list;
}

Map.prototype.toString = function() {
    var string = '[object Map';

    function addEntry(key, value, hasNext) {
        string += '    { ' + this.hash(key) + ' : ' + value + ' }' +
        (hasNext ? ',' : '') + '\n';
    }

    if(this.isLinked && this.size) {
        string += '\n';
        this.each(addEntry);
    }

    string += ']';
    return string;
};

Map.reverseIndexTableFrom = function(array, linkEntries) {
    var map = new Map(linkEntries);

    for(var i = 0, len = array.length; i < len; ++i) {
        var	entry = array[i],
        list = map.get(entry);

        if(list) list.push(i);
        else map.put(entry, [i]);
    }

    return map;
};

Map.cross = function(map1, map2, func, thisArg) {
    var linkedMap, otherMap;

    if(map1.isLinked) {
        linkedMap = map1;
        otherMap = map2;
    }
    else if(map2.isLinked) {
        linkedMap = map2;
        otherMap = map1;
    }
    else Map.illegal();

    for(var i = linkedMap.size; i--; linkedMap.next()) {
        var key = linkedMap.key();
        if(otherMap.contains(key))
            func.call(thisArg, key, map1.get(key), map2.get(key));
    }

    return thisArg;
};

Map.uniqueArray = function(array) {
    var map = new Map;

    for(var i = 0, len = array.length; i < len; ++i)
        map.put(array[i]);

    return map.listKeys();
};


var MersenneTwister = function(seed) {
    if (seed == undefined) {
        seed = new Date().getTime();
    }
    /* Period parameters */
    this.N = 624;
    this.M = 397;
    this.MATRIX_A = 0x9908b0df;   /* constant vector a */
    this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
    this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

    this.mt = new Array(this.N); /* the array for the state vector */
    this.mti=this.N+1; /* mti==N+1 means mt[N] is not initialized */

    this.init_genrand(seed);
};

/* initializes mt[N] with a seed */
MersenneTwister.prototype.init_genrand = function(s) {
    this.mt[0] = s >>> 0;
    for (this.mti=1; this.mti<this.N; this.mti++) {
        var s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
        this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
        + this.mti;
        /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
        /* In the previous versions, MSBs of the seed affect   */
        /* only MSBs of the array mt[].                        */
        /* 2002/01/09 modified by Makoto Matsumoto             */
        this.mt[this.mti] >>>= 0;
    /* for >32 bit machines */
    }
};

/* initialize by an array with array-length */
/* init_key is the array for initializing keys */
/* key_length is its length */
/* slight change for C++, 2004/2/26 */
MersenneTwister.prototype.init_by_array = function(init_key, key_length) {
    var i, j, k;
    this.init_genrand(19650218);
    i=1;
    j=0;
    k = (this.N>key_length ? this.N : key_length);
    for (; k; k--) {
        var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30)
        this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
        + init_key[j] + j; /* non linear */
        this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
        i++;
        j++;
        if (i>=this.N) {
            this.mt[0] = this.mt[this.N-1];
            i=1;
        }
        if (j>=key_length) j=0;
    }
    for (k=this.N-1; k; k--) {
        var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
        this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
        - i; /* non linear */
        this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
        i++;
        if (i>=this.N) {
            this.mt[0] = this.mt[this.N-1];
            i=1;
        }
    }

    this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
};

/* generates a random number on [0,0xffffffff]-interval */
MersenneTwister.prototype.genrand_int32 = function() {
    var y;
    var mag01 = new Array(0x0, this.MATRIX_A);
    /* mag01[x] = x * MATRIX_A  for x=0,1 */

    if (this.mti >= this.N) { /* generate N words at one time */
        var kk;

        if (this.mti == this.N+1)   /* if init_genrand() has not been called, */
            this.init_genrand(5489); /* a default initial seed is used */

        for (kk=0;kk<this.N-this.M;kk++) {
            y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
            this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
        }
        for (;kk<this.N-1;kk++) {
            y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
            this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
        }
        y = (this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
        this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

        this.mti = 0;
    }

    y = this.mt[this.mti++];

    /* Tempering */
    y ^= (y >>> 11);
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= (y >>> 18);

    return y >>> 0;
};

/* generates a random number on [0,0x7fffffff]-interval */
MersenneTwister.prototype.genrand_int31 = function() {
    return (this.genrand_int32()>>>1);
};

/* generates a random number on [0,1]-real-interval */
MersenneTwister.prototype.genrand_real1 = function() {
    return this.genrand_int32()*(1.0/4294967295.0);
/* divided by 2^32-1 */
};

/* generates a random number on [0,1)-real-interval */
MersenneTwister.prototype.random = function() {
    return this.genrand_int32()*(1.0/4294967296.0);
/* divided by 2^32 */
};

/* generates a random number on (0,1)-real-interval */
MersenneTwister.prototype.genrand_real3 = function() {
    return (this.genrand_int32() + 0.5)*(1.0/4294967296.0);
/* divided by 2^32 */
};

/* generates a random number on [0,1) with 53-bit resolution*/
MersenneTwister.prototype.genrand_res53 = function() {
    var a=this.genrand_int32()>>>5, b=this.genrand_int32()>>>6;
    return(a*67108864.0+b)*(1.0/9007199254740992.0);
};





// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());



var MidiControllerType = {
    BANK_SELECT: 0,
    MODULATION: 1,
    BREATH_CONTROLLER: 2,
    FOOT_CONTROLLER: 3,
    PORTAMENTO_TIME: 4,
    DATA_ENTRY_MSB: 5,
    VOLUME: 6,
    BALANCE: 7,
    PAN: 8,
    EXPRESSION_CONTROLLER: 9,
    EFFECT_CONTROL_1: 10,
    EFFECT_CONTROL_2: 11,
    GENERAL_PURPOSE_1: 12,
    GENERAL_PURPOSE_2: 13,
    GENERAL_PURPOSE_3: 14,
    GENERAL_PURPOSE_4: 15,
    BANK_SELECT_LSB: 16,
    MODULATION_LSB: 17,
    BREATH_CONTROLLER_LSB: 18,
    FOOT_CONTROLLER_LSB: 19,
    PORTAMENTO_TIME_LSB: 20,
    DATA_ENTRY_LSB: 21,
    VOLUME_LSB: 22,
    BALANCE_LSB: 23,
    PAN_LSB: 24,
    EXPRESSION_CONTROLLER_LSB: 25,
    EFFECT_CONTROL_1_LSB: 26,
    EFFECT_CONTROL_2_LSB: 27,
    DAMPER_PEDAL: 28,
    PORTAMENTO: 29,
    SOSTENUTO: 30,
    SOFT_PEDAL: 31,
    LEGATO_FOOTSWITCH: 32,
    HOLD_2: 33,
    SOUND_CONTROLLER_1: 34,
    SOUND_CONTROLLER_2: 35,
    SOUND_CONTROLLER_3: 36,
    SOUND_CONTROLLER_4: 37,
    SOUND_CONTROLLER_5: 38,
    SOUND_CONTROLLER_6: 39,
    SOUND_CONTROLLER_7: 40,
    SOUND_CONTROLLER_8: 41,
    SOUND_CONTROLLER_9: 42,
    SOUND_CONTROLLER_10: 43,
    GENERAL_PURPOSE_5: 44,
    GENERAL_PURPOSE_6: 45,
    GENERAL_PURPOSE_7: 46,
    GENERAL_PURPOSE_8: 47,
    PORTAMENTO_CONTROL: 48,
    EFFECTS_DEPTH_1: 49,
    EFFECTS_DEPTH_2: 50,
    EFFECTS_DEPTH_3: 51,
    EFFECTS_DEPTH_4: 52,
    EFFECTS_DEPTH_5: 53,
    DATA_INCREMENT: 54,
    DATA_DECREMENT: 55,
    NRPN_LSB: 56,
    NRPN_MSB: 57,
    RPN_LSB: 58,
    RPN_MSB: 59,
    ALL_SOUNDS_OFF: 60,
    ALL_CONTROLLERS_OFF: 61,
    LOCAL_KEYBOARD: 62,
    ALL_NOTES_OFF: 63,
    OMNI_MODE_OFF: 64,
    OMNI_MODE_ON: 65,
    MONO_OPERATION: 66,
    POLY_OPERATION: 67,

    getValue: function(type) {
        switch (type) {
            case MidiControllerType.ALL_CONTROLLERS_OFF:
                return 121;
            case MidiControllerType.ALL_NOTES_OFF:
                return 123;
            case MidiControllerType.ALL_SOUNDS_OFF:
                return 120;
            case MidiControllerType.BALANCE:
                return 8;
            case MidiControllerType.BANK_SELECT:
                return 0;
            case MidiControllerType.BREATH_CONTROLLER:
                return 2;
            case MidiControllerType.BALANCE_LSB:
                return 40;
            case MidiControllerType.BANK_SELECT_LSB:
                return 32;
            case MidiControllerType.BREATH_CONTROLLER_LSB:
                return 34;
            case MidiControllerType.DAMPER_PEDAL:
                return 64;
            case MidiControllerType.DATA_DECREMENT:
                return 97;
            case MidiControllerType.DATA_ENTRY_MSB:
                return 6;
            case MidiControllerType.DATA_INCREMENT:
                return 96;
            case MidiControllerType.DATA_ENTRY_LSB:
                return 0;
            case MidiControllerType.EFFECTS_DEPTH_1:
                return 91;
            case MidiControllerType.EFFECTS_DEPTH_2:
                return 92;
            case MidiControllerType.EFFECTS_DEPTH_3:
                return 93;
            case MidiControllerType.EFFECTS_DEPTH_4:
                return 94;
            case MidiControllerType.EFFECTS_DEPTH_5:
                return 95;
            case MidiControllerType.EFFECT_CONTROL_1:
                return 12;
            case MidiControllerType.EFFECT_CONTROL_2:
                return 13;
            case MidiControllerType.EFFECT_CONTROL_1_LSB:
                return 44;
            case MidiControllerType.EFFECT_CONTROL_2_LSB:
                return 45;
            case MidiControllerType.EXPRESSION_CONTROLLER_LSB:
                return 43;
            case MidiControllerType.EXPRESSION_CONTROLLER:
                return 11;
            case MidiControllerType.FOOT_CONTROLLER:
                return 4;
            case MidiControllerType.FOOT_CONTROLLER_LSB:
                return 36;
            case MidiControllerType.GENERAL_PURPOSE_1:
                return 16;
            case MidiControllerType.GENERAL_PURPOSE_2:
                return 17;
            case MidiControllerType.GENERAL_PURPOSE_3:
                return 18;
            case MidiControllerType.GENERAL_PURPOSE_4:
                return 19;
            case MidiControllerType.GENERAL_PURPOSE_5:
                return 80;
            case MidiControllerType.GENERAL_PURPOSE_6:
                return 81;
            case MidiControllerType.GENERAL_PURPOSE_7:
                return 82;
            case MidiControllerType.GENERAL_PURPOSE_8:
                return 83;
            case MidiControllerType.HOLD_2:
                return 69;
            case MidiControllerType.LOCAL_KEYBOARD:
                return 0;
            case MidiControllerType.LEGATO_FOOTSWITCH:
                return 68;
            case MidiControllerType.MODULATION:
                return 1;
            case MidiControllerType.MODULATION_LSB:
                return 33;
            case MidiControllerType.MONO_OPERATION:
                return 126;
            case MidiControllerType.NRPN_LSB:
                return 98;
            case MidiControllerType.NRPN_MSB:
                return 99;
            case MidiControllerType.OMNI_MODE_OFF:
                return 124;
            case MidiControllerType.OMNI_MODE_ON:
                return 125;
            case MidiControllerType.PAN:
                return 10;
            case MidiControllerType.PORTAMENTO:
                return 65;
            case MidiControllerType.PORTAMENTO_CONTROL:
                return 84;
            case MidiControllerType.PORTAMENTO_TIME:
                return 5;
            case MidiControllerType.PAN_LSB:
                return 42;
            case MidiControllerType.POLY_OPERATION:
                return 127;
            case MidiControllerType.PORTAMENTO_TIME_LSB:
                return 37;
            case MidiControllerType.RPN_LSB:
                return 100;
            case MidiControllerType.RPN_MSB:
                return 101;
            case MidiControllerType.SOFT_PEDAL:
                return 67;
            case MidiControllerType.SOSTENUTO:
                return 66;
            case MidiControllerType.SOUND_CONTROLLER_1:
                return 70;
            case MidiControllerType.SOUND_CONTROLLER_2:
                return 71;
            case MidiControllerType.SOUND_CONTROLLER_3:
                return 72;
            case MidiControllerType.SOUND_CONTROLLER_4:
                return 73;
            case MidiControllerType.SOUND_CONTROLLER_5:
                return 74;
            case MidiControllerType.SOUND_CONTROLLER_6:
                return 75;
            case MidiControllerType.SOUND_CONTROLLER_7:
                return 76;
            case MidiControllerType.SOUND_CONTROLLER_8:
                return 77;
            case MidiControllerType.SOUND_CONTROLLER_9:
                return 78;
            case MidiControllerType.SOUND_CONTROLLER_10:
                return 79;
            case MidiControllerType.VOLUME:
                return 7;
            case MidiControllerType.VOLUME_LSB:
                return 39;
        }
        logit("Warning unknown midi controller type " + type);
        return 0;
    },

    toString: function(type) {
        switch (type) {
            case MidiControllerType.ALL_CONTROLLERS_OFF:
                return "All controllers off";
            case MidiControllerType.ALL_NOTES_OFF:
                return "All notes off";
            case MidiControllerType.ALL_SOUNDS_OFF:
                return "All sounds off";
            case MidiControllerType.BALANCE:
                return "Balance";
            case MidiControllerType.BALANCE_LSB:
                return "Balance LSB";
            case MidiControllerType.BANK_SELECT:
                return "Bank select";
            case MidiControllerType.BANK_SELECT_LSB:
                return "Bank select LSB";
            case MidiControllerType.BREATH_CONTROLLER:
                return "Breath controller";
            case MidiControllerType.BREATH_CONTROLLER_LSB:
                return "Breath controller LSB";
            case MidiControllerType.DAMPER_PEDAL:
                return "Damper pedal";
            case MidiControllerType.DATA_DECREMENT:
                return "Data decrement";
            case MidiControllerType.DATA_ENTRY_LSB:
                return "Data entry LSB";
            case MidiControllerType.DATA_ENTRY_MSB:
                return "Data entry MSB";
            case MidiControllerType.DATA_INCREMENT:
                return "Data increment";
            case MidiControllerType.EFFECTS_DEPTH_1:
                return "Effects depth 1";
            case MidiControllerType.EFFECTS_DEPTH_2:
                return "Effects depth 2";
            case MidiControllerType.EFFECTS_DEPTH_3:
                return "Effects depth 3";
            case MidiControllerType.EFFECTS_DEPTH_4:
                return "Effects depth 4";
            case MidiControllerType.EFFECTS_DEPTH_5:
                return "Effects depth 5";
            case MidiControllerType.EFFECT_CONTROL_1:
                return "Effect control 1";
            case MidiControllerType.EFFECT_CONTROL_1_LSB:
                return "Effect control 1 LSB";
            case MidiControllerType.EFFECT_CONTROL_2:
                return "Effect control 2";
            case MidiControllerType.EFFECT_CONTROL_2_LSB:
                return "Effect control 2 LSB";
            case MidiControllerType.EXPRESSION_CONTROLLER:
                return "Expression controller";
            case MidiControllerType.EXPRESSION_CONTROLLER_LSB:
                return "Expression controller LSB";
            case MidiControllerType.FOOT_CONTROLLER:
                return "Foot controller";
            case MidiControllerType.FOOT_CONTROLLER_LSB:
                return "Foot controller LSB";
            case MidiControllerType.GENERAL_PURPOSE_1:
                return "General purpose 1";
            case MidiControllerType.GENERAL_PURPOSE_2:
                return "General purpose 2";
            case MidiControllerType.GENERAL_PURPOSE_3:
                return "General purpose 3";
            case MidiControllerType.GENERAL_PURPOSE_4:
                return "General purpose 4";
            case MidiControllerType.GENERAL_PURPOSE_5:
                return "General purpose 5";
            case MidiControllerType.GENERAL_PURPOSE_6:
                return "General purpose 6";
            case MidiControllerType.GENERAL_PURPOSE_7:
                return "General purpose 7";
            case MidiControllerType.GENERAL_PURPOSE_8:
                return "General purpose 8";
            case MidiControllerType.HOLD_2:
                return "Hold 2";
            case MidiControllerType.LEGATO_FOOTSWITCH:
                return "Legato footswitch";
            case MidiControllerType.LOCAL_KEYBOARD:
                return "Local keyboard";
            case MidiControllerType.MODULATION:
                return "Modulation";
            case MidiControllerType.MODULATION_LSB:
                return "Modulation LSB";
            case MidiControllerType.MONO_OPERATION:
                return "Mono operation";
            case MidiControllerType.NRPN_LSB:
                return "NRPN LSB";
            case MidiControllerType.NRPN_MSB:
                return "NRPN MSB";
            case MidiControllerType.OMNI_MODE_OFF:
                return "Omni mode off";
            case MidiControllerType.OMNI_MODE_ON:
                return "Omni mode on";
            case MidiControllerType.PAN:
                return "Pan";
            case MidiControllerType.PAN_LSB:
                return "Pan LSB";
            case MidiControllerType.POLY_OPERATION:
                return "Poly operation";
            case MidiControllerType.PORTAMENTO:
                return "Portamento";
            case MidiControllerType.PORTAMENTO_CONTROL:
                return "Portamento control";
            case MidiControllerType.PORTAMENTO_TIME:
                return "Portamento time";
            case MidiControllerType.PORTAMENTO_TIME_LSB:
                return "Portamento time LSB";
            case MidiControllerType.RPN_LSB:
                return "RPN LSB";
            case MidiControllerType.RPN_MSB:
                return "RPN MSB";
            case MidiControllerType.SOFT_PEDAL:
                return "Soft pedal";
            case MidiControllerType.SOSTENUTO:
                return "Sostenuto";
            case MidiControllerType.SOUND_CONTROLLER_1:
                return "Sound controller 1";
            case MidiControllerType.SOUND_CONTROLLER_2:
                return "Sound controller 2";
            case MidiControllerType.SOUND_CONTROLLER_3:
                return "Sound controller 3";
            case MidiControllerType.SOUND_CONTROLLER_4:
                return "Sound controller 4";
            case MidiControllerType.SOUND_CONTROLLER_5:
                return "Sound controller 5";
            case MidiControllerType.SOUND_CONTROLLER_6:
                return "Sound controller 6";
            case MidiControllerType.SOUND_CONTROLLER_7:
                return "Sound controller 7";
            case MidiControllerType.SOUND_CONTROLLER_8:
                return "Sound controller 8";
            case MidiControllerType.SOUND_CONTROLLER_9:
                return "Sound controller 9";
            case MidiControllerType.SOUND_CONTROLLER_10:
                return "Sound controller 10";
            case MidiControllerType.VOLUME:
                return "Volume";
            case MidiControllerType.VOLUME_LSB:
                return "Volume LSB";
        }
        return "Unknown midi controller type " + type;
    }

};
addPossibleValuesFunction(MidiControllerType, MidiControllerType.BANK_SELECT, MidiControllerType.POLY_OPERATION);


var MidiDrum = {
    BASS_DRUM_2: 35,
    BASS_DRUM_1: 36,
    RIMSHOT: 37,
    SNARE_DRUM_1: 38,
    HAND_CLAP: 39,
    SNARE_DRUM_2: 40,
    LOW_TOM_2: 41,
    CLOSED_HIHAT: 42,
    LOW_TOM_1: 43,
    PEDAL_HIHAT: 44,
    MID_TOM_2: 45,
    OPEN_HIHAT: 46,
    MID_TOM_1: 47,
    HIGH_TOM_2: 48,
    CRASH_CYMBAL_1: 49,
    HIGH_TOM_1: 50,
    RIDE_CYMBAL_1: 51,
    CHINESE_CYMBAL: 52,
    RIDE_BELL: 53,
    TAMBOURINE: 54,
    SPLASH_CYMBAL: 55,
    COWBELL: 56,
    CRASH_CYMBAL_2: 57,
    VIBRA_SLAP: 58,
    RIDE_CYMBAL_2: 59,
    HIGH_BONGO: 60,
    LOW_BONGO: 61,
    MUTE_HIGH_CONGA: 62,
    OPEN_HIGH_CONGA: 63,
    LOW_CONGA: 64,
    HIGH_TIMBALE: 65,
    LOW_TIMBALE: 66,
    HIGH_AGOGO: 67,
    LOW_AGOGO: 68,
    CABASA: 69,
    MARACAS: 70,
    SHORT_WHISTLE: 71,
    LONG_WHISTLE: 72,
    SHORT_GUIRO: 73,
    LONG_GUIRO: 74,
    CLAVES: 75,
    HIGH_WOOD_BLOCK: 76,
    LOW_WOOD_BLOCK: 77,
    MUTE_CUICA: 78,
    OPEN_CUICA: 79,
    MUTE_TRIANGLE: 80,
    OPEN_TRIANGLE: 81,


    toString: function(type) {
        var postfix = " (" + type + ", " + toPitchClassString(type) + "" + Math.floor(type / 12) + ")";
        switch (type) {
            case MidiDrum.BASS_DRUM_1:
                return "Bass drum 1" + postfix;
            case MidiDrum.BASS_DRUM_2:
                return "Bass drum 2" + postfix;
            case MidiDrum.CABASA:
                return "Cabasa" + postfix;
            case MidiDrum.CHINESE_CYMBAL:
                return "Chinese cymbal" + postfix;
            case MidiDrum.CLAVES:
                return "Claves" + postfix;
            case MidiDrum.CLOSED_HIHAT:
                return "Closed hi-hat" + postfix;
            case MidiDrum.COWBELL:
                return "Cowbell" + postfix;
            case MidiDrum.CRASH_CYMBAL_1:
                return "Crash cymbal 1" + postfix;
            case MidiDrum.CRASH_CYMBAL_2:
                return "Crash cymbal 2" + postfix;
            case MidiDrum.HAND_CLAP:
                return "Hand clap" + postfix;
            case MidiDrum.HIGH_AGOGO:
                return "High agogo" + postfix;
            case MidiDrum.HIGH_BONGO:
                return "High bongo" + postfix;
            case MidiDrum.HIGH_TIMBALE:
                return "Timbale" + postfix;
            case MidiDrum.HIGH_TOM_1:
                return "High tom 1" + postfix;
            case MidiDrum.HIGH_TOM_2:
                return "High tom 2" + postfix;
            case MidiDrum.HIGH_WOOD_BLOCK:
                return "High wood block" + postfix;
            case MidiDrum.LONG_GUIRO:
                return "Long guiro" + postfix;
            case MidiDrum.LONG_WHISTLE:
                return "Long whistle" + postfix;
            case MidiDrum.LOW_AGOGO:
                return "Low agogo" + postfix;
            case MidiDrum.LOW_BONGO:
                return "Low bongo" + postfix;
            case MidiDrum.LOW_CONGA:
                return "Low conga" + postfix;
            case MidiDrum.LOW_TIMBALE:
                return "Low timbale" + postfix;
            case MidiDrum.LOW_TOM_1:
                return "Low tom 1" + postfix;
            case MidiDrum.LOW_TOM_2:
                return "Low tom 2" + postfix;
            case MidiDrum.LOW_WOOD_BLOCK:
                return "Low wood block" + postfix;
            case MidiDrum.MARACAS:
                return "Maracas" + postfix;
            case MidiDrum.MID_TOM_1:
                return "Mid tom 1" + postfix;
            case MidiDrum.MID_TOM_2:
                return "Mid tom 2" + postfix;
            case MidiDrum.MUTE_CUICA:
                return "Mute cuica" + postfix;
            case MidiDrum.MUTE_HIGH_CONGA:
                return "Mute high conga" + postfix;
            case MidiDrum.MUTE_TRIANGLE:
                return "Mute triangle" + postfix;
            case MidiDrum.OPEN_CUICA:
                return "Open cuica" + postfix;
            case MidiDrum.OPEN_HIGH_CONGA:
                return "Open high conga" + postfix;
            case MidiDrum.OPEN_HIHAT:
                return "Open hi-hat" + postfix;
            case MidiDrum.OPEN_TRIANGLE:
                return "Open triangle" + postfix;
            case MidiDrum.PEDAL_HIHAT:
                return "Pedal hi-hat" + postfix;
            case MidiDrum.RIDE_BELL:
                return "Ride bell" + postfix;
            case MidiDrum.RIDE_CYMBAL_1:
                return "Ride cymbal 1" + postfix;
            case MidiDrum.RIDE_CYMBAL_2:
                return "Ride cymbal 2" + postfix;
            case MidiDrum.RIMSHOT:
                return "Rimshot" + postfix;
            case MidiDrum.SHORT_GUIRO:
                return "Short guiro" + postfix;
            case MidiDrum.SHORT_WHISTLE:
                return "Short whistle" + postfix;
            case MidiDrum.SNARE_DRUM_1:
                return "Snare drum 1" + postfix;
            case MidiDrum.SNARE_DRUM_2:
                return "Snare drum 2" + postfix;
            case MidiDrum.SPLASH_CYMBAL:
                return "Splash cymbal" + postfix;
            case MidiDrum.TAMBOURINE:
                return "Tambourine" + postfix;
            case MidiDrum.VIBRA_SLAP:
                return "Vibraslap" + postfix;
        }
        return "unknown midi drum" + postfix;
    }

};
addPossibleValuesFunction(MidiDrum, MidiDrum.BASS_DRUM_2, MidiDrum.VIBRA_SLAP);


var MidiProgram = {
    ACOUSTIC_GRAND_PIANO: 0,
    BRIGHT_ACOUSTIC_PIANO: 1,
    ELECTRIC_GRAND_PIANO: 2,
    HONKY_TONK_PIANO: 3,
    ELECTRIC_PIANO_1: 4,
    ELECTRIC_PIANO_2: 5,
    HARPSICHORD: 6,
    CLAVINET: 7,
    CELESTA: 8,
    GLOCKENSPIEL: 9,
    MUSIC_BOX: 10,
    VIBRAPHONE: 11,
    MARIMBA: 12,
    XYLOPHONE: 13,
    TUBULAR_BELLS: 14,
    DULCIMER: 15,
    DRAWBAR_ORGAN: 16,
    PERCUSSIVE_ORGAN: 17,
    ROCK_ORGAN: 18,
    CHURCH_ORGAN: 19,
    REED_ORGAN: 20,
    ACCORDION: 21,
    HARMONICA: 22,
    TANGO_ACCORDION: 23,
    ACOUSTIC_NYLON_GUITAR: 24,
    ACOUSTIC_STEEL_GUITAR: 25,
    ELECTRIC_JAZZ_GUITAR: 26,
    ELECTRIC_CLEAN_GUITAR: 27,
    ELECTRIC_MUTED_GUITAR: 28,
    OVERDRIVEN_GUITAR: 29,
    DISTORTION_GUITAR: 30,
    GUITAR_HARMONICS: 31,
    ACOUSTIC_BASS: 32,
    ELECTRIC_FINGER_BASS: 33,
    ELECTRIC_PICK_BASS: 34,
    FRETLESS_BASS: 35,
    SLAP_BASS_1: 36,
    SLAP_BASS_2: 37,
    SYNTH_BASS_1: 38,
    SYNTH_BASS_2: 39,
    VIOLIN: 40,
    VIOLA: 41,
    CELLO: 42,
    CONTRABASS: 43,
    TREMOLO_STRINGS: 44,
    PIZZICATO_STRINGS: 45,
    ORCHESTRAL_HARP: 46,
    TIMPANI: 47,
    STRING_ENSEMBLE_1: 48,
    STRING_ENSEMBLE_2: 49,
    SYNTH_STRINGS_1: 50,
    SYNTH_STRINGS_2: 51,
    CHOIR_AAHS: 52,
    VOICE_OOHS: 53,
    SYNTH_CHOIR: 54,
    ORCHESTRA_HIT: 55,

    TRUMPET: 56,
    TROMBONE: 57,
    TUBA: 58,
    MUTED_TRUMPET: 59,
    FRENCH_HORN: 60,
    BRASS_SECTION: 61,
    SYNTH_BRASS_1: 62,
    SYNTH_BRASS_2: 63,
    SOPRANO_SAX: 64,
    ALTO_SAX: 65,
    TENOR_SAX: 66,
    BARITONE_SAX: 67,
    OBOE: 68,
    ENGLISH_HORN: 69,
    BASSOON: 70,
    CLARINET: 71,
    PICCOLO: 72,
    FLUTE: 73,
    RECORDER: 74,
    PAN_FLUTE: 75,
    BLOWN_BOTTLE: 76,
    SHAKUHACHI: 77,
    WHISTLE: 78,
    OCARINA: 79,
    SQUARE_LEAD: 80,
    SAW_LEAD: 81,
    CALLIOPE_LEAD: 82,
    CHIFF_LEAD: 83,
    CHARANG_LEAD: 84,
    VOICE_LEAD: 85,
    FIFTHS_LEAD: 86,
    BASS_PLUS_LEAD: 87,
    NEW_AGE_PAD: 88,
    WARM_PAD: 89,
    POLYSYNTH_PAD: 90,
    CHOIR_PAD: 91,
    BOWED_PAD: 92,
    METALLIC_PAD: 93,
    HALO_PAD: 94,
    SWEEP_PAD: 95,
    RAIN_SFX: 96,
    SOUNDTRACK_SFX: 97,
    CRYSTAL_SFX: 98,
    ATMOSPHERE_SFX: 99,
    BRIGHTNESS_SFX: 100,
    GOBLINS_SFX: 101,
    ECHOES_SFX: 102,
    SCIFI_SFX: 103,
    SITAR: 104,
    BANJO: 105,
    SHAMISEN: 106,
    KOTO: 107,
    KALIMBA: 108,
    BAGPIPE: 109,
    FIDDLE: 110,
    SHANAI: 111,
    TINKLE_BELL: 112,
    AGOGO: 113,
    STEEL_DRUMS: 114,
    WOODBLOCK: 115,
    TAIKO_DRUM: 116,
    MELODIC_TOM: 117,
    SYNTH_DRUM: 118,
    REVERSE_CYMBAL: 119,
    GUITAR_FRET_NOISE: 120,
    BREATH_NOISE: 121,
    SEASHORE: 122,
    BIRD_TWEET: 123,
    TELEPHONE_RING: 124,
    HELICOPTER: 125,
    APPLAUSE: 126,
    GUNSHOT: 127,




    toString: function(type) {
        switch (type) {
            case MidiProgram.ACCORDION:
                return "Accordion";
            case MidiProgram.ACOUSTIC_BASS:
                return "Acoustic bass";
            case MidiProgram.ACOUSTIC_GRAND_PIANO:
                return "Acoustic grand piano";
            case MidiProgram.ACOUSTIC_NYLON_GUITAR:
                return "Acoustic nylon guitar";
            case MidiProgram.ACOUSTIC_STEEL_GUITAR:
                return "Acoustic steel guitar";
            case MidiProgram.AGOGO:
                return "Agogo";
            case MidiProgram.ALTO_SAX:
                return "Alto sax";
            case MidiProgram.APPLAUSE:
                return "Applause";
            case MidiProgram.ATMOSPHERE_SFX:
                return "Atmosphere sfx";
            case MidiProgram.BRIGHT_ACOUSTIC_PIANO:
                return "Bright acoustic piano";
            case MidiProgram.BAGPIPE:
                return "Bagpipe";
            case MidiProgram.BANJO:
                return "Banjo";
            case MidiProgram.BARITONE_SAX:
                return "Baritone sax";
            case MidiProgram.BASSOON:
                return "Bassoon";
            case MidiProgram.BASS_PLUS_LEAD:
                return "Bass plus lead";
            case MidiProgram.BIRD_TWEET:
                return "Bird tweet";
            case MidiProgram.BLOWN_BOTTLE:
                return "Blown bottle";
            case MidiProgram.BOWED_PAD:
                return "Bowed pad";
            case MidiProgram.BRASS_SECTION:
                return "Brass section";
            case MidiProgram.BREATH_NOISE:
                return "Breath noise";
            case MidiProgram.BRIGHTNESS_SFX:
                return "Brightness sfx";
            case MidiProgram.CELESTA:
                return "Celesta";
            case MidiProgram.CELLO:
                return "Cello";
            case MidiProgram.CHOIR_AAHS:
                return "Choir aahs";
            case MidiProgram.CHURCH_ORGAN:
                return "Church organ";
            case MidiProgram.CLAVINET:
                return "Clavinet";
            case MidiProgram.CONTRABASS:
                return "Contrabass";
            case MidiProgram.CALLIOPE_LEAD:
                return "Calliope lead";
            case MidiProgram.CHARANG_LEAD:
                return "Charang lead";
            case MidiProgram.CHIFF_LEAD:
                return "Chiff lead";
            case MidiProgram.CHOIR_PAD:
                return "Choir pad";
            case MidiProgram.CLARINET:
                return "Clarinet";
            case MidiProgram.CRYSTAL_SFX:
                return "Crystal sfx";
            case MidiProgram.DISTORTION_GUITAR:
                return "Distortion guitar";
            case MidiProgram.DRAWBAR_ORGAN:
                return "Drawbar organ";
            case MidiProgram.DULCIMER:
                return "Dulcimer";
            case MidiProgram.ELECTRIC_CLEAN_GUITAR:
                return "Electric clean guitar";
            case MidiProgram.ELECTRIC_FINGER_BASS:
                return "Electric finger bass";
            case MidiProgram.ELECTRIC_GRAND_PIANO:
                return "Electric grand piano";
            case MidiProgram.ELECTRIC_JAZZ_GUITAR:
                return "Electric jazz guitar";
            case MidiProgram.ELECTRIC_MUTED_GUITAR:
                return "Electric muted guitar";
            case MidiProgram.ELECTRIC_PIANO_1:
                return "Electric piano 1";
            case MidiProgram.ELECTRIC_PIANO_2:
                return "Electric piano 2";
            case MidiProgram.ELECTRIC_PICK_BASS:
                return "Electric pick bass";
            case MidiProgram.ECHOES_SFX:
                return "Echoes sfx";
            case MidiProgram.ENGLISH_HORN:
                return "English hord";
            case MidiProgram.FRETLESS_BASS:
                return "Fretless bass";
            case MidiProgram.FIDDLE:
                return "Fiddle";
            case MidiProgram.FIFTHS_LEAD:
                return "Fifths lead";
            case MidiProgram.FLUTE:
                return "Flute";
            case MidiProgram.FRENCH_HORN:
                return "French horn";
            case MidiProgram.GLOCKENSPIEL:
                return "Glockenspiel";
            case MidiProgram.GUITAR_HARMONICS:
                return "Guitar harmonics";
            case MidiProgram.GOBLINS_SFX:
                return "Goblins sfx";
            case MidiProgram.GUITAR_FRET_NOISE:
                return "Guitar fret noise";
            case MidiProgram.GUNSHOT:
                return "Gunshot";
            case MidiProgram.HARMONICA:
                return "Harmonica";
            case MidiProgram.HARPSICHORD:
                return "Harpsichord";
            case MidiProgram.HONKY_TONK_PIANO:
                return "Honky-tonk piano";
            case MidiProgram.HALO_PAD:
                return "Halo pad";
            case MidiProgram.HELICOPTER:
                return "Helicopter";
            case MidiProgram.KALIMBA:
                return "Kalimba";
            case MidiProgram.KOTO:
                return "Koto";
            case MidiProgram.MARIMBA:
                return "Marimba";
            case MidiProgram.MUSIC_BOX:
                return "Music box";
            case MidiProgram.MELODIC_TOM:
                return "Melodic tom";
            case MidiProgram.METALLIC_PAD:
                return "Metallic pad";
            case MidiProgram.MUTED_TRUMPET:
                return "Muted trumpet";
            case MidiProgram.NEW_AGE_PAD:
                return "New age pad";
            case MidiProgram.ORCHESTRAL_HARP:
                return "Orchestral harp";
            case MidiProgram.ORCHESTRA_HIT:
                return "Orchestra hit";
            case MidiProgram.OVERDRIVEN_GUITAR:
                return "Overdriven guitar";
            case MidiProgram.OBOE:
                return "Oboe";
            case MidiProgram.OCARINA:
                return "Ocarina";
            case MidiProgram.PERCUSSIVE_ORGAN:
                return "Percussive organ";
            case MidiProgram.PIZZICATO_STRINGS:
                return "Pizzicato strings";
            case MidiProgram.PAN_FLUTE:
                return "Pan flute";
            case MidiProgram.PICCOLO:
                return "Piccolo";
            case MidiProgram.POLYSYNTH_PAD:
                return "Polysynth pad";
            case MidiProgram.REED_ORGAN:
                return "Reed organ";
            case MidiProgram.ROCK_ORGAN:
                return "Rock organ";
            case MidiProgram.RAIN_SFX:
                return "Rain sfx";
            case MidiProgram.RECORDER:
                return "Recorder";
            case MidiProgram.REVERSE_CYMBAL:
                return "Reverse cymbal";
            case MidiProgram.SLAP_BASS_1:
                return "Slap bass 1";
            case MidiProgram.SLAP_BASS_2:
                return "Slap bass 2";
            case MidiProgram.STRING_ENSEMBLE_1:
                return "String ensemble 1";
            case MidiProgram.STRING_ENSEMBLE_2:
                return "String ensemble 2";
            case MidiProgram.SYNTH_BASS_1:
                return "Synth bass 1";
            case MidiProgram.SYNTH_BASS_2:
                return "Synth bass 2";
            case MidiProgram.SYNTH_CHOIR:
                return "Synth choir";
            case MidiProgram.SYNTH_STRINGS_1:
                return "Synth strings 1";
            case MidiProgram.SYNTH_STRINGS_2:
                return "Synth strings 2";
            case MidiProgram.SAW_LEAD:
                return "Saw lead";
            case MidiProgram.SCIFI_SFX:
                return "Sci-fi sfx";
            case MidiProgram.SEASHORE:
                return "Seashore";
            case MidiProgram.SHAKUHACHI:
                return "Shakuhachi";
            case MidiProgram.SHAMISEN:
                return "Shamisen";
            case MidiProgram.SHANAI:
                return "Shanai";
            case MidiProgram.SITAR:
                return "Sitar";
            case MidiProgram.SOPRANO_SAX:
                return "Soprano sax";
            case MidiProgram.SOUNDTRACK_SFX:
                return "Soundtrack sfx";
            case MidiProgram.SQUARE_LEAD:
                return "Square lead";
            case MidiProgram.STEEL_DRUMS:
                return "Steel drums";
            case MidiProgram.SWEEP_PAD:
                return "Sweep pad";
            case MidiProgram.SYNTH_DRUM:
                return "Synth drum";
            case MidiProgram.SYNTH_BRASS_1:
                return "Synth brass 1";
            case MidiProgram.SYNTH_BRASS_2:
                return "Synth brass 2";
            case MidiProgram.TANGO_ACCORDION:
                return "Tango accordion";
            case MidiProgram.TIMPANI:
                return "Timpani";
            case MidiProgram.TREMOLO_STRINGS:
                return "Tremolo strings";
            case MidiProgram.TUBULAR_BELLS:
                return "Tubular bells";
            case MidiProgram.TAIKO_DRUM:
                return "Taiko drum";
            case MidiProgram.TELEPHONE_RING:
                return "Telephone ring";
            case MidiProgram.TENOR_SAX:
                return "Tenor sax";
            case MidiProgram.TINKLE_BELL:
                return "Tinkle bell";
            case MidiProgram.TROMBONE:
                return "Trombone";
            case MidiProgram.TRUMPET:
                return "Trumpet";
            case MidiProgram.TUBA:
                return "Tuba";
            case MidiProgram.VIBRAPHONE:
                return "Vibraphone";
            case MidiProgram.VIOLA:
                return "Viola";
            case MidiProgram.VIOLIN:
                return "Violin";
            case MidiProgram.VOICE_OOHS:
                return "Voice oohs";
            case MidiProgram.VOICE_LEAD:
                return "Voice lead";
            case MidiProgram.WARM_PAD:
                return "Warm pad";
            case MidiProgram.WHISTLE:
                return "Whistle";
            case MidiProgram.WOODBLOCK:
                return "Woodblock";
            case MidiProgram.XYLOPHONE:
                return "Xylophone";
        }
        return "Unknown midi program " + type;
    }
};
addPossibleValuesFunction(MidiProgram, MidiProgram.ACOUSTIC_GRAND_PIANO, MidiProgram.GUNSHOT);


var SongStructureType = {
    BUILD: 0,
    VERSE_CHORUS: 1,
    VERSE_CHORUS_BRIDGE: 2
};


var SimpleModuleGeneratorPhraseGroupType = {
    SINGLE_COMPLETE: 0,
    TONIC_PROLONG_PLUS_COMPLETE: 1,
    DECEPTIVE_PLUS_COMPLETE: 2,
    COMPLETE_PLUS_COMPLETE: 3,
    ANTECEDENT_CONSEQUENT: 4,
    TONIC_PROLONG_PLUS_DOMINANT_PROLONG_CADENCE: 5,
    TONIC_PROLONG_PLUS_DOMINANT_PROLONG_PLUS_TONIC_CADENCE_PROLONG: 6,
    TONIC_PROLONG_PLUS_DOMINANT_PROLONG_PLUS_COMPLETE: 7,
    TONICIZE_PLUS_COMPLETE: 8, // Returns immediately back in second phrase
    COMPLETE_PLUS_MODULATE: 9, // Can continue with new tonic but also return in next phrase group
    MODULATE_PLUS_MODULATE_BACK: 10,
    MODULATE_PLUS_COMPLETE: 11, // new tonic
    INCOMPLETE_PLUS_MODULATE: 12, //
    INCOMPLETE_SHORTER_PLUS_COMPLETE: 13, // Phrase elision
    INCOMPLETE_WEAK_PLUS_COMPLETE_WEAK_TONIC: 14, // Phrase extension
    COMPLETE_PLUS_COMPLETE_DIFFERENT_SCALE_TYPE: 15,
    SINGLE_INCOMPLETE: 16,
    SINGLE_TONIC_PROLONG: 17,
    INCOMPLETE_PLUS_COMPLETE: 18,
    ANTECEDENT_CONSEQUENT_SHORTEN: 19,
    COMPLETE_PLUS_PHRASE_MODULATE: 20,
    TONICIZE_PLUS_TONICIZE: 21,
    INCOMPLETE_INITIAL_PLUS_COMPLETE: 22,
    PHRASE_MODULATE: 23,
    TONIC_PROLONG_PLUS_DOMINANT_PROLONG: 24,
    INCOMPLETE_PLUS_DOMINANT_PROLONG: 25,
    INCOMPLETE_PLUS_DOMINANT_PROLONG_CADENCE: 26,
    SINGLE_COMPLETE_PLAGIAL: 27,
    SINGLE_SILENT: 28,
    COMPLETE_PLAGIAL_PLUS_COMPLETE: 29,
    COMPLETE_PLUS_COMPLETE_PLAGIAL: 30,
    CUSTOM: 31,
    SINGLE_CUSTOM_HARMONY: 32,
    DOUBLE_CUSTOM_HARMONY: 33,
    INCOMPLETE_PLUS_COMPLETE_IMPERFECT: 34,
    SINGLE_COMPLETE_IMPERFECT: 35,
    INCOMPLETE_PLUS_DECEPTIVE: 36,
    DECEPTIVE_PLUS_DECEPTIVE: 37,
    COMPLETE_IMPERFECT_PLUS_DECEPTIVE: 38,
    TONICIZE_PLUS_DECEPTIVE: 39,
    SINGLE_DECEPTIVE: 40,
    COMPLETE_IMPERFECT_PLUS_COMPLETE_LENGTHEN_DOMINANT: 41,
    COMPLETE_IMPERFECT_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC: 42,
    INCOMPLETE_PLUS_COMPLETE_LENGTHEN_DOMINANT: 43,
    INCOMPLETE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC: 44,
    DECEPTIVE_PLUS_COMPLETE_LENGTHEN_DOMINANT: 45,
    DECEPTIVE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC: 46,
    MODULATE_PLUS_COMPLETE_LENGTHEN_DOMINANT: 47,
    MODULATE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC: 48,
    TONICIZE_PLUS_COMPLETE_LENGTHEN_DOMINANT: 49,
    TONICIZE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC: 50,
    INCOMPLETE_INITIAL_PLUS_COMPLETE_LENGTHEN_DOMINANT: 51,
    INCOMPLETE_INITIAL_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC: 52,

    toString: function(type) {
        switch (type) {
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_IMPERFECT_PLUS_COMPLETE_LENGTHEN_DOMINANT:
                return "Complete imperfect + complete lengthen dominant";
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_IMPERFECT_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
                return "Complete imperfect + complete lengthen final tonic";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_COMPLETE_LENGTHEN_DOMINANT:
                return "Incomplete + complete lengthen dominant";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
                return "Incomplete + complete lengthen final tonic";
            case SimpleModuleGeneratorPhraseGroupType.DECEPTIVE_PLUS_COMPLETE_LENGTHEN_DOMINANT:
                return "Deceptive + complete lengthen dominant";
            case SimpleModuleGeneratorPhraseGroupType.DECEPTIVE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
                return "Deceptive + complete lengthen final tonic";
            case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE_LENGTHEN_DOMINANT:
                return "Modulate + complete lengthen dominant";
            case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
                return "Modulate + complete lengthen final tonic";
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE_LENGTHEN_DOMINANT:
                return "Tonicize + complete lengthen dominant";
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
                return "Tonicize + complete lengthen final tonic";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_INITIAL_PLUS_COMPLETE_LENGTHEN_DOMINANT:
                return "Incomplete initial + complete lengthen dominant";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_INITIAL_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
                return "Incomplete initial + complete lengthen final tonic";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_DECEPTIVE:
                return "Incomplete + deceptive";
            case SimpleModuleGeneratorPhraseGroupType.DECEPTIVE_PLUS_DECEPTIVE:
                return "Deceptive + deceptive";
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_IMPERFECT_PLUS_DECEPTIVE:
                return "Complete imperfect + deceptive";
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_DECEPTIVE:
                return "Tonicize + deceptive";
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLAGIAL_PLUS_COMPLETE:
                return "Complete plagial + complete";
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_COMPLETE_PLAGIAL:
                return "Complete + complete plagial";
            case SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT:
                return "Antecedent consequent";
            case SimpleModuleGeneratorPhraseGroupType.SINGLE_SILENT:
                return "Single silent";
            case SimpleModuleGeneratorPhraseGroupType.SINGLE_DECEPTIVE:
                return "Single deceptive";
            case SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE_PLAGIAL:
                return "Single complete plagial";
            case SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE_IMPERFECT:
                return "Single complete imperfect";
            case SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT_SHORTEN:
                return "Antecedent consequent shorten";
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_COMPLETE:
                return "Complete + complete";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_COMPLETE_IMPERFECT:
                return "Complete + complete imperfect";
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_COMPLETE_DIFFERENT_SCALE_TYPE:
                return "Complete + complete change scale type";
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_MODULATE:
                return "Complete + modulate";
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_PHRASE_MODULATE:
                return "Complete + phrase modulate";
            case SimpleModuleGeneratorPhraseGroupType.DECEPTIVE_PLUS_COMPLETE:
                return "Deceptive + complete";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_INITIAL_PLUS_COMPLETE:
                return "Incomplete initial + complete";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_COMPLETE:
                return "Incomplete + complete";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_MODULATE:
                return "Incomplete + modulate";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_DOMINANT_PROLONG:
                return "Incomplete + dominant prolong";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_DOMINANT_PROLONG_CADENCE:
                return "Incomplete + dominant prolong cadence";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_SHORTER_PLUS_COMPLETE:
                return "Incomplete shorter + complete";
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_WEAK_PLUS_COMPLETE_WEAK_TONIC:
                return "Incomplete weak + complete weak tonic";
            case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE:
                return "Modulate + complete";
            case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_MODULATE_BACK:
                return "Modulate + modulate back";
            case SimpleModuleGeneratorPhraseGroupType.PHRASE_MODULATE:
                return "Phrase modulate";
            case SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE:
                return "Single complete";
            case SimpleModuleGeneratorPhraseGroupType.SINGLE_INCOMPLETE:
                return "Single incomplete";
            case SimpleModuleGeneratorPhraseGroupType.SINGLE_TONIC_PROLONG:
                return "Single tonic prolong";
            case SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_COMPLETE:
                return "Tonic prolong + complete";
            case SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_DOMINANT_PROLONG_CADENCE:
                return "Tonic prolong + dominant prolong cadence";
            case SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_DOMINANT_PROLONG:
                return "Tonic prolong + dominant prolong";
            case SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_DOMINANT_PROLONG_PLUS_COMPLETE:
                return "Tonic prolong + dominaint prolong + complete";
            case SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_DOMINANT_PROLONG_PLUS_TONIC_CADENCE_PROLONG:
                return "Tonic prolong + dominant prolong + tonic cadence prolong";
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE:
                return "Tonicize + complete";
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_TONICIZE:
                return "Tonicize + tonicize";
            case SimpleModuleGeneratorPhraseGroupType.CUSTOM:
                return "Custom";
            case SimpleModuleGeneratorPhraseGroupType.SINGLE_CUSTOM_HARMONY:
                return "Single custom harmony";
            case SimpleModuleGeneratorPhraseGroupType.DOUBLE_CUSTOM_HARMONY:
                return "Double custom harmony";
        }
        return "Unknown phrase group type " + type;
    },

    tonicizeOrModulate: function(type) {
        switch (type) {
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_MODULATE:
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_PHRASE_MODULATE:
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_MODULATE:
            case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE:
            case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_MODULATE_BACK:
            case SimpleModuleGeneratorPhraseGroupType.PHRASE_MODULATE:
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE:
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_TONICIZE:
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_DECEPTIVE:
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE_LENGTHEN_DOMINANT:
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
            case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE_LENGTHEN_DOMINANT:
            case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
                return true;
        }
        return false;
    }
};
addPossibleValuesFunction(SimpleModuleGeneratorPhraseGroupType, SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE, SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_INITIAL_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC);



var SongPartType = {
    VERSE_1: 0,
    VERSE_2: 1,
    CHORUS_1: 2,
    CHORUS_2: 3,
    BRIDGE_1: 4,
    BRIDGE_2: 5,
    MISC_1: 6,
    MISC_2: 7,

    getIndex: function(type) {
        switch (type) {
            case SongPartType.VERSE_1:
            case SongPartType.BRIDGE_1:
            case SongPartType.CHORUS_1:
            case SongPartType.MISC_1:
                return 0;
            case SongPartType.VERSE_2:
            case SongPartType.BRIDGE_2:
            case SongPartType.CHORUS_2:
            case SongPartType.MISC_2:
                return 1;
        }
        return 0;
    },

    isVerse: function(type) {
        switch (type) {
            case SongPartType.VERSE_1:
            case SongPartType.VERSE_2:
                return true;
        }
        return false;
    },
    isChorus: function(type) {
        switch (type) {
            case SongPartType.CHORUS_1:
            case SongPartType.CHORUS_2:
                return true;
        }
        return false;
    },
    isBridge: function(type) {
        switch (type) {
            case SongPartType.BRIDGE_1:
            case SongPartType.BRIDGE_2:
                return true;
        }
        return false;
    },

    toIndicatorString: function(type) {
        switch (type) {
            case SongPartType.BRIDGE_1:
                return "bridge1";
            case SongPartType.BRIDGE_2:
                return "bridge2";
            case SongPartType.CHORUS_1:
                return "chorus1";
            case SongPartType.CHORUS_2:
                return "chorus2";
            case SongPartType.VERSE_1:
                return "verse1";
            case SongPartType.VERSE_2:
                return "verse2";
            case SongPartType.MISC_1:
                return "misc1";
            case SongPartType.MISC_2:
                return "misc2";
        }
        return "verse1";
    },

    toString: function(type) {
        switch (type) {
            case SongPartType.BRIDGE_1:
                return "Bridge 1";
            case SongPartType.BRIDGE_2:
                return "Bridge 2";
            case SongPartType.CHORUS_1:
                return "Chorus 1";
            case SongPartType.CHORUS_2:
                return "Chorus 2";
            case SongPartType.VERSE_1:
                return "Verse 1";
            case SongPartType.VERSE_2:
                return "Verse 2";
            case SongPartType.MISC_1:
                return "Misc 1";
            case SongPartType.MISC_2:
                return "Misc 2";
        }
        return "Unknown song part type " + type;
    }
};
addPossibleValuesFunction(SongPartType, SongPartType.VERSE_1, SongPartType.MISC_2);


function MotifRythmInfo(options) {
    this.noteCountRange = [0.25, 1.0]; // Notes per beat

    this.zone1Prob = 0.5;
    this.zone1TripletLikelihood = getValueOrDefault(options, "zone1TripletLikelihood", 0.5);
    this.zone1DotSecondLikelihood = getValueOrDefault(options, "zone1DotSecondLikelihood", 0.5);
    this.zone1DotFirstLikelihood = getValueOrDefault(options, "zone1DotFirstLikelihood", 2);
    this.zone1DotNormalDotLikelihood = getValueOrDefault(options, "zone1DotNormalDotLikelihood", 0.5);
    this.zone1NormalDotDotLikelihood = getValueOrDefault(options, "zone1NormalDotDotLikelihood", 0.5);
    this.zone1DotDotNormalLikelihood = getValueOrDefault(options, "zone1DotDotNormalLikelihood", 0.5);
    this.zone1StartPosRange = getValueOrDefault(options, "zone1StartPosRange", [0, 0]);
    this.zone1EndPosRange = getValueOrDefault(options, "zone1EndPosRange", [0.75, 0.75]);

    this._constructorName = "MotifRythmInfo";
}


var MelodyOffsetLevel = {
    VERY_LOW: -2,
    LOW: -1,
    MIDDLE: 0,
    HIGH: 1,
    VERY_HIGH: 2,

    toString: function(t) {
        switch (t) {
            case MelodyOffsetLevel.HIGH:
                return "High";
            case MelodyOffsetLevel.LOW:
                return "Low";
            case MelodyOffsetLevel.MIDDLE:
                return "Middle";
            case MelodyOffsetLevel.VERY_HIGH:
                return "Very high";
            case MelodyOffsetLevel.VERY_LOW:
                return "Very low";
        }
        return "Unknown melody offset level " + t;
    }
};
addPossibleValuesFunction(MelodyOffsetLevel, MelodyOffsetLevel.VERY_LOW, MelodyOffsetLevel.VERY_HIGH);


function RenderAmountStrengthMap() {
    this.veryWeak = [0.02];
    this.weak = [0.15];
    this.medium = [0.4];
    this.strong = [0.7];
    this.veryStrong = [1.0];
    this._constructorName = "RenderAmountStrengthMap";
}



function IndexPropertyIndex() {
    this.indexProperty = PhraseGroupIndexProperty.HARMONY_RYTHM;
    this.otherPartType = SongPartType.VERSE_1;
    this._constructorName = "IndexPropertyIndex";
}


function SongPartTypeOverrideInfo(options) {
    AbstractSongPartStructureInfo.call(this, options);

    this.customPhraseTypes = [PhraseHarmonyElementType.INCOMPLETE, PhraseHarmonyElementType.COMPLETE];

    this.sameGroupIndexSames = getValueOrDefault(options, "sameGroupIndexSames", []); // Forcing some index properties to be same
    this.sameGroupIndexDifferents = getValueOrDefault(options, "sameGroupIndexDifferents", []); // Forcing some index properties to be different
    this.differentGroupIndexSameInfos = []; // IndexPropertyIndex
    this.differentGroupIndexDifferentInfos = []; // IndexPropertyIndex

    this._constructorName = "SongPartTypeOverrideInfo";
}
//SongPartTypeOverrideInfo.prototype = new AbstractSongPartStructureInfo();


var PhraseGroupIndexProperty = {
    MELODY_SHAPE: 0,
    BASS_SHAPE: 1,
    HARMONY: 2,
    HARMONY_RYTHM: 3,
    SUSPEND: 4,
    MELODY_INSTRUMENT_DISTRIBUTION: 5,
    INNER_1_INSTRUMENT_DISTRIBUTION: 6,
    INNER_2_INSTRUMENT_DISTRIBUTION: 7,
    BASS_INSTRUMENT_DISTRIBUTION: 8,
    MELODY_MOTIF_DISTRIBUTION: 9,
    INNER_1_MOTIF_DISTRIBUTION: 10,
    INNER_2_MOTIF_DISTRIBUTION: 11,
    BASS_MOTIF_DISTRIBUTION: 12,
    HARMONY_CHARACTERISTIC: 13,
    PERCUSSION_MOTIF_DISTRIBUTION: 14,
    RENDER_AMOUNT: 15,
    TEMPO: 16,
    PERCUSSION_FILL_DISTRIBUTION: 17,
    TEMPO_CHANGE_1: 18,
    TEMPO_CHANGE_2: 19,
    MELODY_EFFECTS: 20,
    INNER_1_EFFECTS: 21,
    INNER_2_EFFECTS: 22,
    BASS_EFFECTS: 23,
    PERCUSSION_EFFECTS: 24,

    toString: function(type) {
        switch (type) {
            case PhraseGroupIndexProperty.BASS_EFFECTS:
               return "Bass Effects";
            case PhraseGroupIndexProperty.BASS_INSTRUMENT_DISTRIBUTION:
               return "Bass Instrument Distribution";
            case PhraseGroupIndexProperty.BASS_MOTIF_DISTRIBUTION:
               return "Bass Motif Distribution";
            case PhraseGroupIndexProperty.BASS_SHAPE:
               return "Bass Shape";
            case PhraseGroupIndexProperty.HARMONY:
               return "Harmony";
            case PhraseGroupIndexProperty.HARMONY_CHARACTERISTIC:
               return "Harmony Characteristic";
            case PhraseGroupIndexProperty.HARMONY_RYTHM:
               return "Harmony Rythm";
            case PhraseGroupIndexProperty.INNER_1_EFFECTS:
               return "Inner 1 Effects";
            case PhraseGroupIndexProperty.INNER_1_INSTRUMENT_DISTRIBUTION:
               return "Inner 1 Instrument Distribution";
            case PhraseGroupIndexProperty.INNER_1_MOTIF_DISTRIBUTION:
               return "Inner 1 Motif Distribution";
            case PhraseGroupIndexProperty.INNER_2_EFFECTS:
               return "Inner 2 Effects";
            case PhraseGroupIndexProperty.INNER_2_INSTRUMENT_DISTRIBUTION:
               return "Inner 2 Instrument Distribution";
            case PhraseGroupIndexProperty.INNER_2_MOTIF_DISTRIBUTION:
               return "Inner 2 Motif Distribution";
            case PhraseGroupIndexProperty.MELODY_EFFECTS:
               return "Melody Effects";
            case PhraseGroupIndexProperty.MELODY_INSTRUMENT_DISTRIBUTION:
               return "Melody Instrument Distribution";
            case PhraseGroupIndexProperty.MELODY_MOTIF_DISTRIBUTION:
               return "Melody Motif Distribution";
            case PhraseGroupIndexProperty.MELODY_SHAPE:
               return "Melody Shape";
            case PhraseGroupIndexProperty.PERCUSSION_EFFECTS:
               return "Percussion Effects";
            case PhraseGroupIndexProperty.PERCUSSION_FILL_DISTRIBUTION:
               return "Percussion Fill Distribution";
            case PhraseGroupIndexProperty.PERCUSSION_MOTIF_DISTRIBUTION:
               return "Percussion Motif Distribution";
            case PhraseGroupIndexProperty.RENDER_AMOUNT:
               return "Render Amount";
            case PhraseGroupIndexProperty.SUSPEND:
               return "Suspend";
            case PhraseGroupIndexProperty.TEMPO:
               return "Tempo";
            case PhraseGroupIndexProperty.TEMPO_CHANGE_1:
               return "Tempo Change 1";
            case PhraseGroupIndexProperty.TEMPO_CHANGE_2:
               return "Tempo Change 2";
        }
        return "Unknown phrase group index property";
    }

};
addPossibleValuesFunction(PhraseGroupIndexProperty, PhraseGroupIndexProperty.MELODY_SHAPE, PhraseGroupIndexProperty.PERCUSSION_EFFECTS);




//veryWeak: [0.02],
//    weak: [0.15],
//    medium: [0.4],
//    strong: [0.7],
//    veryStrong: [1.0]

var SongPartStrength = {
    DEFAULT: 0,
    VERY_WEAK: 1,
    WEAK: 2,
    MEDIUM: 3,
    STRONG: 4,
    VERY_STRONG: 5,

    toString: function(type) {
        switch (type) {
            case SongPartStrength.DEFAULT:
                return "Default";
            case SongPartStrength.MEDIUM:
                return "Medium";
            case SongPartStrength.STRONG:
                return "Strong";
            case SongPartStrength.VERY_STRONG:
                return "Very Strong";
            case SongPartStrength.VERY_WEAK:
                return "Very Weak";
            case SongPartStrength.WEAK:
                return "Weak";
        }
        return "Medium";
    },

    toIndicatorString: function(type) {
        switch (type) {
            case SongPartStrength.DEFAULT:
                return "";
            case SongPartStrength.MEDIUM:
                return "medium";
            case SongPartStrength.STRONG:
                return "strong";
            case SongPartStrength.VERY_STRONG:
                return "veryStrong";
            case SongPartStrength.VERY_WEAK:
                return "veryWeak";
            case SongPartStrength.WEAK:
                return "weak";
        }
        return "";
    }
};
addPossibleValuesFunction(SongPartStrength, SongPartStrength.DEFAULT, SongPartStrength.VERY_STRONG);


function AbstractSongPartStructureInfo() {
    this.partType = SongPartType.VERSE_1;

    this.harmonyRythmCountOverrides = [];
    this.harmonyTotalLengthOverrides = [];

    this.overridePhraseGroupType = false;
    this.phraseGroupType = SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT_SHORTEN;
    this.overrideMajorModulationTarget = false;
    this.majorModulationTarget = DynamicHarmonyModulationTarget.DOMINANT;
    this.overrideMinorModulationTarget = false;
    this.minorModulationTarget = DynamicHarmonyModulationTarget.DOMINANT;

    this.overrideScaleBaseNote = false;
    this.scaleBaseNote = 60;
    this.overrideScaleType = false;
    this.scaleType = ScaleType.MAJOR;

    // For custom harmony
    this.harmonyElementIndices = [];

    // For custom melody and bass curves
    this.customMelodyCurveIndices = [];
    this.customBassCurveIndices = [];

    // For custom render elements
    this.extraMelodyRenderElementIndices = [];
    this.extraInner1RenderElementIndices = [];
    this.extraInner2RenderElementIndices = [];
    this.extraBassRenderElementIndices = [];
    this.extraPercussionRenderElementIndices = [];


    // Forcing indices
    this.melodyShapeIndexOverride = [];
    this.bassShapeIndexOverride = [];
    this.harmonyIndexOverride = [];
    this.harmonyRythmIndexOverride = [];
    this.suspendIndexOverride = [];
    this.melodyChannelDistributionIndexOverride = [];
    this.inner1ChannelDistributionIndexOverride = [];
    this.inner2ChannelDistributionIndexOverride = [];
    this.bassChannelDistributionIndexOverride = [];
    this.melodyMotifDistributionIndexOverride = [];
    this.inner1MotifDistributionIndexOverride = [];
    this.inner2MotifDistributionIndexOverride = [];
    this.bassMotifDistributionIndexOverride = [];
    this.percussionMotifDistributionIndexOverride = [];
    this.percussionFillMotifDistributionIndexOverride = [];
    this.harmonyExtraIndexOverride = [];


    this.renderAmountIndexOverride = [];
    this.tempoIndexOverride = [];
    this.sequentialTempoChangeIndexOverride = [];
    this.parallelTempoChangeIndexOverride = [];
    this.sequentialMelodyEffectChangeIndexOverride = [];
    this.sequentialInner1EffectChangeIndexOverride = [];
    this.sequentialInner2EffectChangeIndexOverride = [];
    this.sequentialBassEffectChangeIndexOverride = [];
    this.sequentialPercussionEffectChangeIndexOverride = [];

}



function SongPartStructureInfo(options) {
    AbstractSongPartStructureInfo.call(this, options);
    this.strength = getValueOrDefault(options, "strength", SongPartStrength.DEFAULT);

    this.prefixProbsOverride = getValueOrDefault(options, "prefixProbsOverride", []);
    this.postfixProbsOverride = getValueOrDefault(options, "postfixProbsOverride", []);

    this.majorGroupModulationTarget = getValueOrDefault(options, "majorGroupModulationTarget", -1);
    this.minorGroupModulationTarget = getValueOrDefault(options, "minorGroupModulationTarget", -1);

    this.melodyRenderAmountOverride = [];
    this.inner1RenderAmountOverride = [];
    this.inner2RenderAmountOverride = [];
    this.bassRenderAmountOverride = [];
    this.percussionRenderAmountOverride = [];

    this.prefixInfoOverrides = [];
    this.postfixInfoOverrides = [];

    this._constructorName = "SongPartStructureInfo";
}
//SongPartStructureInfo.prototype = new AbstractSongPartStructureInfo();

function CustomVoiceLineCurveInfo(options) {
    this.amplitude = 1.0;
    this.bias = 0.0;
    this.type = 0;
    this.curveId = "";
    this._constructorName = "CustomVoiceLineCurveInfo";
}

CustomVoiceLineCurveInfo.prototype.counter = 0;

CustomVoiceLineCurveInfo.prototype.getCurve = function() {
    return null;
};

//function LinearInterpolationCurve() {
//    Curve.call(this);
//
//    this.xValues = [0, 1];
//    this.yValues = [0, 1];
function LinearInterpolatedCustomVoiceLineCurveInfo() {
    CustomVoiceLineCurveInfo.call(this);
    this.xValues = [0, 1];
    this.yValues = [60, 70];
    this._constructorName = "LinearInterpolatedCustomVoiceLineCurveInfo";
}

LinearInterpolatedCustomVoiceLineCurveInfo.prototype = new CustomVoiceLineCurveInfo();

LinearInterpolatedCustomVoiceLineCurveInfo.prototype.getCurve = function() {
    var result = new LinearInterpolationCurve();
    result.xValues = arrayCopy(this.xValues);
    result.yValues = arrayCopy(this.yValues);
    if (!this.curveId) {
        this.curveId = "CustomVoiceLineCurveInfo" + CustomVoiceLineCurveInfo.prototype.counter;
        CustomVoiceLineCurveInfo.prototype.counter++;
    }
    result.id = this.curveId;
    return result;
};
function VoiceLinePlannerConstraint() {
    this.id = "";
    this._constructorName = "VoiceLinePlannerConstraint";
}


function EmptyVoiceLinePlannerConstraint() {
    VoiceLinePlannerConstraint.call(this);
    this._constructorName = "EmptyVoiceLinePlannerConstraint";
}
EmptyVoiceLinePlannerConstraint.prototype = new VoiceLinePlannerConstraint();



function MinVoiceLinePlannerConstraint() {
    VoiceLinePlannerConstraint.call(this);
    this.constraints = [];
    this._constructorName = "MinVoiceLinePlannerConstraint";

}
MinVoiceLinePlannerConstraint.prototype = new VoiceLinePlannerConstraint();


function VoiceChordNotesVoiceLinePlannerConstraint() {
    VoiceLinePlannerConstraint.call(this);
    this.chordRootPitchClassConstraints = []; // 2d arrays
    this.chordBassPitchClassConstraints = [];
    this.chordRootPitchClassConstraintCosts = [[1]]; // 2d arrays
    this.chordBassPitchClassConstraintCosts = [[1]];

    this._constructorName = "VoiceChordNotesVoiceLinePlannerConstraint";
}
VoiceChordNotesVoiceLinePlannerConstraint.prototype = new VoiceLinePlannerConstraint();

function HarmonyElement() {
    this.id = "";
    this.modifiers = [];
    this._constructorName = "HarmonyElement";
}

function HarmonyReferenceHarmonyElement() {
    HarmonyElement.call(this);
    this.harmony = "";
    this._constructorName = "HarmonyReferenceHarmonyElement";
}
HarmonyReferenceHarmonyElement.prototype = new HarmonyElement();


function SwitchHarmonyElement() {
    HarmonyElement.call(this);
    this.index = 0;
    this.indexedElements = [];
    this._constructorName = "SwitchHarmonyElement";
}
SwitchHarmonyElement.prototype = new HarmonyElement();


function ConstantHarmonyElement() {
    HarmonyElement.call(this);

    this.length = 1.0;
    this.lengthUnit = PositionUnit.MEASURES;
    this.strength = 1.0;
    this.startBeatStrength = 1.0;

    this.scaleType = ScaleType.MAJOR;
    this.baseNote = 60; // Scale base absolute note

    this.chordType = ChordType.TRIAD;
    this.chordRoot = 0; // Scale index
    this.chordInversions = 0;

    this.scale = [0, 2, 4, 5, 7, 9, 11]; // Custom scale
    this.chord = [0, 2, 4]; // Custom chord scale indices when in root
    // position
    this.scaleMode = 0;

    // Time signature
    this.tsNumerator = 4;
    this.tsDenominator = 4;

    // Alterations
    this.alterations = [];

    // Voice line planner constraints
    this.voiceLineConstraints = [];

    this.sectionModifiers = [];

    this.startsPhrase = false;

    this.note = "";

    this._constructorName = "ConstantHarmonyElement";
}

ConstantHarmonyElement.prototype = new HarmonyElement();



var HarmonyLengthMode = {
    COUNT_AND_LENGTH_PATTERN: 0, // The count determines the number of elements. The length pattern is used for determining the length of the separate elements
    COUNT_AND_RYTHM: 1, // The count determines number of elements. The rythm determines the relative lengths. Total length is also used to scale the rythm
    RYTHM_ONLY: 2, // A rythm determines relative lenghts. Total length is used to scale it

    toString: function(type) {
        switch (type) {
            case HarmonyLengthMode.COUNT_AND_LENGTH_PATTERN:
                return "Count and length pattern";
            case HarmonyLengthMode.COUNT_AND_RYTHM:
                return "Count and rythm";
            case HarmonyLengthMode.RYTHM_ONLY:
                return "Rythm only";
        }
        return "Unknown length mode " + type;
    }
};
addPossibleValuesFunction(HarmonyLengthMode, HarmonyLengthMode.COUNT_AND_LENGTH_PATTERN, HarmonyLengthMode.RYTHM_ONLY);


function SequenceHarmonyElement() {
    HarmonyElement.call(this);
    this.harmonyLengthMode = HarmonyLengthMode.RYTHM_ONLY;

    // Each lengths' element becomes a harmony element
    this.count = 1;
    this.lengthPattern = [1.0];
    this.startLengthPattern = [];
    this.endLengthPattern = [];
    this.lengthPatternUnit = PositionUnit.MEASURES;

    this.totalLength = 1.0; // Used when a lengthRythm is used
    this.totalLengthUnit = PositionUnit.MEASURES;
    this.setTotalLengthExternally = false;

    this.beatStrengths = [1, 0.8, 0.9, 0.6, 0.3, 0.4, 0.2];

    // For rythm-based harmony elements
    this.lengthRythm = "";
    this.rythmTsNumerator = 4;
    this.rythmTsDenominator = 4;
    this.setTsNumeratorExternally = false;

    this.useMaxElementLength = false;
    this.maxElementLength = 1;
    this.maxElementLengthUnit = PositionUnit.MEASURES;

    this.lengthRepeats = 0; // Repeats the lengths

    this.usePositionSnap = false;
    this.positionSnapPattern = [1.0];
    this.positionSnapUnit = PositionUnit.BEATS;
    this.positionSnapMetrics = SnapMetrics.ROUND;

    this.phraseStructureCounts = [];

    this.tsNumerators = [4];
    this.startTsNumerators = [];
    this.endTsNumerators = [];

    this.tsDenominators = [4];
    this.startTsDenominators = [];
    this.endTsDenominators = [];

    this._constructorName = "SequenceHarmonyElement";
}
SequenceHarmonyElement.prototype = new HarmonyElement();

function SimpleSequenceHarmonyElement() {
    SequenceHarmonyElement.call(this);

    this.scaleBaseNotes = [60];
    this.scaleBaseNoteIndices = [0];
    this.startScaleBaseNoteIndices = [];
    this.endScaleBaseNoteIndices = [];

    this.scaleTypes = [ScaleType.MAJOR];
    this.scaleTypeIndices = [0];
    this.startScaleTypeIndices = [];
    this.endScaleTypeIndices = [];

    this.scaleModes = [0];
    this.startScaleModes = [];
    this.endScaleModes = [];

    this.chordRoots = [0];
    this.startChordRoots = [];
    this.endChordRoots = [];

    this.chordInversions = [0];
    this.startChordInversions = [];
    this.endChordInversions = [];

    this.chordTypes = [ChordType.TRIAD];
    this.chordTypeIndices = [0];
    this.startChordTypeIndices = [];
    this.endChordTypeIndices = [];

    this.customScales = [[0, 2, 4, 5, 7, 9, 11]];
    this.customScaleIndices = [0];
    this.startCustomScaleIndices = [];
    this.endCustomScaleIndices = [];

    this.customChords = [[0, 2, 4]];
    this.customChordIndices = [0];
    this.startCustomChordIndices = [];
    this.endCustomChordIndices = [];

    this.voiceLineConstraints = [];
    this.voiceLineConstraintIndices = []; // 2d array
    this.startVoiceLineConstraintIndices = []; // 2d array
    this.endVoiceLineConstraintIndices = []; // 2d array


    this._constructorName = "SimpleSequenceHarmonyElement";
}

SimpleSequenceHarmonyElement.prototype = new SequenceHarmonyElement();

SimpleSequenceHarmonyElement.prototype.voiceLineConstraints_allowedTypes = {"VoiceChordNotesVoiceLinePlannerConstraint": 1};


function PlannedHarmonyElement() {
    SequenceHarmonyElement.call(this);

    this.scaleBaseNote = 60;
    this.scaleType = ScaleType.MAJOR;

    this.seed = 12345;

    this._constructorName = "PlannedHarmonyElement";
}

PlannedHarmonyElement.prototype = new SequenceHarmonyElement();


function StaticSequenceHarmonyElement() {
    PlannedHarmonyElement.call(this);

    this.baseRoot = 0;
    this.baseToBaseLikelihood = 0.01;
    this.baseToNeighbourLikelihood = 1;
    this.baseToPassingLikelihood = 1;
    this.baseToAuxiliaryLikelihood = 1;
    this.auxiliaryToAuxiliaryLikelihood = 0.01;
    this.auxiliaryToBaseLikelihood = 1;
    this.auxiliaryToNeighbourLikelihood = 1;
    this.auxiliaryToPassingLikelihood = 1;
    this.auxiliaryChordRoots = [3, 4];
    this.auxiliaryChordRootLikelihoods = [1, 1];
    this.fromBasePassingChordRoots = [0, 1, 2, 3, 4, 5, 6];
    this.fromBasePassingChordRootLikelihoods = [1];
    this.fromBasePassingIncrements = [-2, 1, 1, 2];
    this.fromBasePassingIncrementLikelihoods = [0.5, 1, 1, 0.5];
    this.fromBasePassingInversions = [0, 1, 2];
    this.fromBasePassingInversionLikelihoods = [0.5, 1, 0.5];
    this.fromBaseNeighbourChordRoots = [0, 1, 2, 3, 4, 5, 6];
    this.fromBaseNeighbourChordRootLikelihoods = [1];
    this.fromAuxiliaryPassingChordRoots = [0, 1, 2, 3, 4, 5, 6];
    this.fromAuxiliaryPassingChordRootLikelihoods = [1];
    this.fromAuxiliaryPassingIncrements = [-2, -1, 1, 2];
    this.fromAuxiliaryPassingIncrementLikelihoods = [0.5, 1, 1, 0.5];
    this.fromAuxiliaryNeighbourChordRoots = [0, 1, 2, 3, 4, 5, 6];
    this.fromAuxiliaryNeighbourChordRootLikelihoods = [1];
    this.canEndWithBase = true;
    this.canEndWithAuxiliary = false;
    this.possibleAuxiliaryEndRoots = [3, 4];
    this._constructorName = "StaticSequenceHarmonyElement";
}


StaticSequenceHarmonyElement.prototype = new PlannedHarmonyElement();




function DynamicSequenceHarmonyElement() {
    PlannedHarmonyElement.call(this);

    this.modulate = false;
    this.majorModulationTarget = DynamicHarmonyModulationTarget.DOMINANT;
    this.minorModulationTarget = DynamicHarmonyModulationTarget.MEDIANT;
    this.majorStartRoots = [0];
    this.majorStartRootLikelihoods = [1];

    this.majorProgressionRoots = [[0, 1, 2, 3, 4, 5]];
    this.majorProgressionRootLikelihoods = [[1]];

    this.minorProgressionRoots = [[0, 2, 3, 4, 5, 6]];
    this.minorProgressionRootLikelihoods = [[1]];

    this.majorProgressionMovements = [[-4, -2, 1]];
    this.startMajorProgressionMovements = [];
    this.endMajorProgressionMovements = [];
    this.majorProgressionMovementLikelihoods = [[1]];
    this.startMajorProgressionMovementLikelihoods = [];
    this.endMajorProgressionMovementLikelihoods = [];

    this.minorProgressionMovements = [[-4, -2, 1]];
    this.startMinorProgressionMovements = [];
    this.endMinorProgressionMovements = [];
    this.minorProgressionMovementLikelihoods = [[1]];
    this.startMinorProgressionMovementLikelihoods = [];
    this.endMinorProgressionMovementLikelihoods = [];

    this.majorPossibleEndRoots = [1, 3];
    this.minorPossibleEndRoots = [3];
    this.majorModulationPossibleEndRoots = [1, 3];
    this.minorModulationPossibleEndRoots = [3];

    this.passingRoots = [0, 1, 2, 3, 4, 5, 6];
    this.passingRootLikelihoods = [1];

    var options = null;
    this.passingInversions = getValueOrDefault(options,
        "passingInversions", [1, 2]);
    this.passingInversionLikelihoods = getValueOrDefault(options,
        "passingInversionLikelihoods", [1, 0.5]);
    this.passingIncrements = getValueOrDefault(options,
        "passingIncrements", [-2, -1, 1, 2]);
    this.passingIncrementLikelihoods = getValueOrDefault(options,
        "passingIncrementLikelihoods", [0.5, 1, 1, 0.5]);
    this.neighbourRoots = getValueOrDefault(options,
        "neighbourRoots", [0, 1, 2, 3, 4, 5, 6]);
    this.neighbourRootLikelihoods = getValueOrDefault(options,
        "neighbourRootLikelihoods", [1]);
    this.neighbourInversions = getValueOrDefault(options,
        "neighbourInversions", [1, 2]);
    this.neighbourInversionLikelihoods = getValueOrDefault(options,
        "neighbourInversionLikelihoods", [1, 0.5]);
    this.expansionRoots = getValueOrDefault(options,
        "expansionRoots", [0, 1, 2, 3, 4, 5, 6]);
    this.expansionRootLikelihoods = getValueOrDefault(options,
        "expansionRootLikelihoods", [1]);
    this.expansionInversions = getValueOrDefault(options,
        "expansionInversions", [1]);
    this.expansionInversionLikelihoods = getValueOrDefault(options,
        "expansionInversionLikelihoods", [1]);

    this.rootProgressionLikelihood = getValueOrDefault(options,
        "rootProgressionLikelihood", 1);
    this.repeatRootLikelihood = getValueOrDefault(options,
        "repeatRootLikelihood", 0);
    this.passingLikelihood = getValueOrDefault(options,
        "passingLikelihood", 1);
    this.neighbourLikelihood = getValueOrDefault(options,
        "neighbourLikelihood", 1);
    this.expansionLikelihood = getValueOrDefault(options,
        "expansionLikelihood", 1);
    this.modulateLikelihoods = [1];
    this.startModulateLikelihoods = [0.01];
    this.endModulateLikelihoods = [0.01];


    this.majorAppliedChords = getValueOrDefault(options,
        "majorAppliedChords", [AppliedChordType.V, AppliedChordType.V7]);
    this.majorAppliedChordLikelihoods = getValueOrDefault(options,
        "majorAppliedChordLikelihoods", [1]);
    this.minorAppliedChords = getValueOrDefault(options,
        "minorAppliedChords", [AppliedChordType.V, AppliedChordType.V7]);
    this.minorAppliedChordLikelihoods = getValueOrDefault(options,
        "minorAppliedChordLikelihoods", [1]);

    this.addAllMovements = getValueOrDefault(options,
        "addAllMovements", true); // Adding all possible roots
    this.addAllStarts = getValueOrDefault(options,
        "addAllStarts", true);

    this._constructorName = "DynamicSequenceHarmonyElement";
}


DynamicSequenceHarmonyElement.prototype = new PlannedHarmonyElement();

var MajorMixtureChordType = {
    I: 0, // Lowered 3
    II6: 1, // Lowered 6
    IV: 2, // Lowered 6
    VI: 3 // Lowered 3 and 6
};


var MinorMixtureChordType = {
    I: 0 // Raised 3
};


var DynamicHarmonyModulationTarget = {
    NONE: -1,
    SUPERTONIC: 0,
    MEDIANT: 1,
    SUBDOMINANT: 2,
    DOMINANT: 3,
    SUBMEDIANT: 4,
    SUBTONIC: 5,

    invert: function(modulationTarget) {
        switch (modulationTarget) {
            case DynamicHarmonyModulationTarget.SUPERTONIC:
                return DynamicHarmonyModulationTarget.SUBTONIC;
            case DynamicHarmonyModulationTarget.DOMINANT:
                return DynamicHarmonyModulationTarget.SUBDOMINANT;
            case DynamicHarmonyModulationTarget.MEDIANT:
                return DynamicHarmonyModulationTarget.SUBMEDIANT;
            case DynamicHarmonyModulationTarget.SUBDOMINANT:
                return DynamicHarmonyModulationTarget.DOMINANT;
            case DynamicHarmonyModulationTarget.SUBMEDIANT:
                return DynamicHarmonyModulationTarget.MEDIANT;
            case DynamicHarmonyModulationTarget.SUBTONIC:
                return DynamicHarmonyModulationTarget.SUPERTONIC;
        }
        return modulationTarget;
    },

    getScaleType: function(scaleType, modulationTarget, invertType) {
        var otherScaleType = scaleType == ScaleType.MAJOR ? ScaleType.NATURAL_MINOR : ScaleType.MAJOR;

        switch (modulationTarget) {
            case DynamicHarmonyModulationTarget.SUPERTONIC:
            case DynamicHarmonyModulationTarget.MEDIANT:
            case DynamicHarmonyModulationTarget.SUBMEDIANT:
            case DynamicHarmonyModulationTarget.SUBTONIC:
                return invertType ? scaleType : otherScaleType;
        }
        return invertType ? otherScaleType : scaleType;
    },

    toString: function(type) {
        switch (type) {
            case DynamicHarmonyModulationTarget.DOMINANT:
                return "Dominant";
            case DynamicHarmonyModulationTarget.MEDIANT:
                return "Mediant";
            case DynamicHarmonyModulationTarget.SUBDOMINANT:
                return "Subdominant";
            case DynamicHarmonyModulationTarget.SUBMEDIANT:
                return "Submediant";
            case DynamicHarmonyModulationTarget.SUBTONIC:
                return "Subtonic";
            case DynamicHarmonyModulationTarget.SUPERTONIC:
                return "Supertonic";
            case DynamicHarmonyModulationTarget.NONE:
                return "None";
        }
        return "Unknown modulation target " + type;
    }
};
addPossibleValuesFunction(DynamicHarmonyModulationTarget, DynamicHarmonyModulationTarget.NONE, DynamicHarmonyModulationTarget.SUBTONIC);


var AppliedChordType = {
    V: 0,
    V6: 1,
    V7: 2,
    V65: 3,
    V43: 4,
    V42: 5,
    VII: 6,
    VII6: 7,
    VII7: 8,

    toString: function(type) {
        switch (type) {
            case AppliedChordType.V:
                return "V";
            case AppliedChordType.V42:
                return "V42";
            case AppliedChordType.V43:
                return "V43";
            case AppliedChordType.V65:
                return "V65";
            case AppliedChordType.V6:
                return "V6";
            case AppliedChordType.V7:
                return "V7";
            case AppliedChordType.VII:
                return "VII";
            case AppliedChordType.VII6:
                return "VII6";
            case AppliedChordType.VII7:
                return "VII7";
        }
        return "Unknown applied chord type " + type;
    }
};
addPossibleValuesFunction(AppliedChordType, AppliedChordType.V, AppliedChordType.VII7);





// Options for the planner
PlannedHarmonyElement.prototype.fillOptions = function(options, module) {
    var lengths = this.getBeatLengths(module);
    var count = lengths.length;

    // All stuff that can be expressions comes here...
    options.scaleBaseNote = getValueOrExpressionValue(this, "scaleBaseNote", module);

    // The actual lengths of the chords must be determined here since the position snapping can
    // decrease the count.

    options.count = count;
    options.seed = this.seed;
};



PlannedHarmonyElement.prototype.setCount = function(v) {
    this.count = v;
    return this;
};


StaticSequenceHarmonyElement.prototype.fillOptions = function(options, module) {
    copyObjectPropertiesDeep(options, this);
    PlannedHarmonyElement.prototype.fillOptions.call(this, options, module);
};


StaticSequenceHarmonyElement.prototype.getConstantHarmonyElements = function(module, beatOffset) {
    if (!module) {
        logit("module missing in " + this._constructorName + "<br />");
        showStacktraceDialog(null, "static sequence harmony");
    }

    var options = {};
    this.fillOptions(options, module);

    var generator = new StaticHarmonyGenerator(options);
    var solution = generator.searchML();

    this.setLengthsAndPhraseStructure(solution, module);

    return solution;
};


DynamicSequenceHarmonyElement.prototype.fillOptions = function(options, module) {
    copyObjectPropertiesDeep(options, this);
    PlannedHarmonyElement.prototype.fillOptions.call(this, options, module);

    options.modulateLikelihoods = [1];
    for (var i=0; i<options.count; i++) {
        options.modulateLikelihoods[i] = getItemFromArrayWithStartEndItems(1, this.modulateLikelihoods, options.count, i, this.startModulateLikelihoods, this.endModulateLikelihoods);
        var progressionCount = options.count > 1 ? options.count - 1 : 1;
        options.majorProgressionMovements[i] = getItemFromArrayWithStartEndItems([-4, -2, 1], this.majorProgressionMovements, progressionCount, i, this.startMajorProgressionMovements, this.endMajorProgressionMovements);
        options.minorProgressionMovements[i] = getItemFromArrayWithStartEndItems([-4, -2, 1], this.minorProgressionMovements, progressionCount, i, this.startMinorProgressionMovements, this.endMinorProgressionMovements);
    }
    
//    logit("fklsjd: " + options.modulateLikelihoods.join(", ") + " <br />");
};


DynamicSequenceHarmonyElement.prototype.getConstantHarmonyElements = function(module, beatOffset) {

    if (!module) {
        logit("module missing in " + this._constructorName + "<br />");
        showStacktraceDialog(null, "static sequence harmony");
    }

    var options = {};
    this.fillOptions(options, module);

    var generator = new DynamicHarmonyGenerator(options);
    var solution = generator.searchML();

    // Set the lengths of the solution here... The planner doesn't do that, it is just concerned with strong/weak

    this.setLengthsAndPhraseStructure(solution, module);

    //    logit("Found dynamic solution " + solution + "<br />");
    return solution;
};



var PhraseHarmonyElementShorteningMode = {
    BEATS: 0,

    toString: function(type) {
        switch (type) {
            case PhraseHarmonyElementShorteningMode.BEATS:
                return "Beats";
        }
        return "Unknown phrase harmony element shortening mode " + type;
    }

};
addPossibleValuesFunction(PhraseHarmonyElementShorteningMode, PhraseHarmonyElementShorteningMode.BEATS, PhraseHarmonyElementShorteningMode.BEATS);


function PhraseHarmonyElement() {
    PlannedHarmonyElement.call(this);

    this.phraseType = PhraseHarmonyElementType.COMPLETE;
    this.harmonyReference = ""; // Used for derived consequent phrases

    this.modulate = false;
    this.modulateInvertScaleType = false;
    this.majorModulationTarget = DynamicHarmonyModulationTarget.DOMINANT;
    this.minorModulationTarget = DynamicHarmonyModulationTarget.MEDIANT;
    this.modulateRemoveDominant = true;
    this.modulateRemoveInitialTonic = true;
    this.modulateStaticLengthFactor = 0.2;
    this.modulateDynamicLengthFactor = 5;
    this.modulateDominantCadenceLengthFactor = 0.2;
    this.modulateTonicCadenceLengthFactor = 0.2;

    this.majorDeceptiveRoot = 5;
    this.majorDeceptiveInversions = 0;
    this.minorDeceptiveRoot = 5;
    this.minorDeceptiveInversions = 0;

    // LengthAndCountUnit.LENGTH is interpreted as beats
    this.staticHarmonyLength = 25;
    this.staticHarmonyLengthUnit = LengthAndCountUnit.LENGTH_PERCENT;
    this.staticHarmonyLengthLimits = [0, 100];
    this.staticHarmonyLengthLimitsUnit = LengthAndCountUnit.LENGTH_PERCENT;
    this.staticHarmonyLengthImportance = 1.0;
    this.staticHarmonyUseLocalSeed = false;
    this.staticHarmonySeed = 12345;
    this.staticHarmonyRaiseLeadingToneRoots = [4, 6];
    this.staticHarmonyPassingChordLikelihood = 1;
    this.staticHarmonyNeighbourChordLikelihood = 1;
    this.staticHarmonySus2ChordLikelihood = 1;
    this.staticHarmonySus4ChordLikelihood = 1;
    this.staticHarmonySimpleMixtureLikelihood = 1;

    this.dynamicHarmonyLength = 25;
    this.dynamicHarmonyLengthUnit = LengthAndCountUnit.LENGTH_PERCENT;
    this.dynamicHarmonyLengthLimits = [0, 100];
    this.dynamicHarmonyLengthLimitsUnit = LengthAndCountUnit.LENGTH_PERCENT;
    this.dynamicHarmonyLengthImportance = 1.0;
    this.dynamicHarmonyUseLocalSeed = false;
    this.dynamicHarmonySeed = 12345;
    this.dynamicHarmonyRaiseLeadingToneRoots = [];
    this.dynamicHarmonyRaiseLeadingToneAppliedRoots = [4, 6]; // Default is to raise for applied chords
    this.dynamicHarmonyPassingChordLikelihood = 1;
    this.dynamicHarmonyNeighbourChordLikelihood = 1;
    this.dynamicHarmonySus2ChordLikelihood = 1;
    this.dynamicHarmonySus4ChordLikelihood = 1;
    this.dynamicHarmonySimpleMixtureLikelihood = 1;

    this.dominantCadenceHarmonyLength = 1;
    this.dominantCadenceHarmonyLengthUnit = LengthAndCountUnit.COUNT;
    this.dominantCadenceHarmonyLengthLimits = [0, 100];
    this.dominantCadenceHarmonyLengthLimitsUnit = LengthAndCountUnit.LENGTH_PERCENT;
    this.dominantCadenceHarmonyLengthImportance = 1.0;
    this.dominantCadenceHarmonyUseLocalSeed = false;
    this.dominantCadenceHarmonySeed = 12345;
    this.dominantCadenceHarmonyRaiseLeadingToneRoots = [4, 6];
    this.dominantCadenceHarmonyPassingChordLikelihood = 1;
    this.dominantCadenceHarmonyNeighbourChordLikelihood = 1;
    this.dominantCadenceHarmonySus2ChordLikelihood = 1;
    this.dominantCadenceHarmonySus4ChordLikelihood = 1;
    this.dominantCadenceHarmonySimpleMixtureLikelihood = 1;

    this.tonicCadenceHarmonyLength = 1;
    this.tonicCadenceHarmonyLengthUnit = LengthAndCountUnit.COUNT;
    this.tonicCadenceHarmonyLengthLimits = [0, 100];
    this.tonicCadenceHarmonyLengthLimitsUnit = LengthAndCountUnit.LENGTH_PERCENT;
    this.tonicCadenceHarmonyLengthImportance = 1.0;
    this.tonicCadenceHarmonyUseLocalSeed = false;
    this.tonicCadenceHarmonySeed = 12345;
    this.tonicCadenceHarmonyRaiseLeadingToneRoots = [4, 6];
    this.tonicCadenceHarmonyPassingChordLikelihood = 1;
    this.tonicCadenceHarmonyNeighbourChordLikelihood = 1;
    this.tonicCadenceHarmonySus2ChordLikelihood = 1;
    this.tonicCadenceHarmonySus4ChordLikelihood = 1;
    this.tonicCadenceHarmonySimpleMixtureLikelihood = 1;

    this.overrideDefaultPhraseStructure = false; // Set this to true to use the phrase structure counts instead

    // For shortening the phrase, for example in antecedent/consequent phrases
    this.phraseShorteningMode = PhraseHarmonyElementShorteningMode.BEATS;
    this.phraseShorteningBeats = [[4], [4], [2], [2], [2], [1], [1], [1]];
    this.phraseShorteningMinLengths = [1];
    this.phraseShorteningMinLengthUnit = PositionUnit.BEATS;

    this.raiseLeadingTone = true;

    this.maxLengthSearchSteps = 200;

    this._constructorName = "PhraseHarmonyElement";
}


PhraseHarmonyElement.prototype = new PlannedHarmonyElement();



function DataSample(options) {
//    this.id = "";
    this.likelihood = getValueOrDefault(options, "likelihood", 1);
    this.active = true;
    this._constructorName = "DataSample";
}

function IntDataSample(options) {
    DataSample.call(this, options);
    this.data = 0;
    this._constructorName = "IntDataSample";
}
IntDataSample.prototype = new DataSample();

function IntListDataSample(options) {
    DataSample.call(this, options);
    this.data = [];
    this._constructorName = "IntListDataSample";
}
IntListDataSample.prototype = new DataSample();

function IntList2DDataSample(options) {
    DataSample.call(this, options);
    this.data = [];
    this._constructorName = "IntList2DDataSample";
}
IntList2DDataSample.prototype = new DataSample();

function FloatDataSample(options) {
    DataSample.call(this, options);
    this.data = 0.0;
    this._constructorName = "FloatDataSample";
}
FloatDataSample.prototype = new DataSample();

function FloatListDataSample(options) {
    DataSample.call(this, options);
    this.data = [];
    this._constructorName = "FloatListDataSample";
}
FloatListDataSample.prototype = new DataSample();


function MidiProgramDataSample(options) {
    DataSample.call(this, options);
    this.data = getValueOrDefault(options, "data", MidiProgram.ACOUSTIC_GRAND_PIANO);
    this._constructorName = "MidiProgramDataSample";
}
MidiProgramDataSample.prototype = new DataSample();


function MidiDrumDataSample(options) {
    DataSample.call(this, options);
    this.data = getValueOrDefault(options, "data", MidiDrum.BASS_DRUM_1);
    this._constructorName = "MidiDrumDataSample";
}
MidiDrumDataSample.prototype = new DataSample();


function PhraseGroupTypeDataSample(options) {
    DataSample.call(this, options);
    this.data = getValueOrDefault(options, "data", SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT);
    this._constructorName = "PhraseGroupTypeDataSample";
}
PhraseGroupTypeDataSample.prototype = new DataSample();

function ModulationTargetDataSample(options) {
    DataSample.call(this, options);
    this.data = getValueOrDefault(options, "data", DynamicHarmonyModulationTarget.MEDIANT);
    this._constructorName = "ModulationTargetDataSample";
}
ModulationTargetDataSample.prototype = new DataSample();


function SongPartStructureInfoDataSample(options) {
    DataSample.call(this, options);
    this.data = [new SongPartStructureInfo()]; //getValueOrDefault(options, "data", new SongPartStructureInfo());
    this._constructorName = "SongPartStructureInfoDataSample";
}
SongPartStructureInfoDataSample.prototype = new DataSample();
SongPartStructureInfoDataSample.prototype.data_allowedTypes = {"SongPartStructureInfo": 1};


function HarmonicPlanDataSample(options) {
    DataSample.call(this, options);
    this.data = [DynamicHarmonyModulationTarget.DOMINANT, DynamicHarmonyModulationTarget.SUBDOMINANT]; //getValueOrDefault(options, "data", new SongPartStructureInfo());
    this._constructorName = "HarmonicPlanDataSample";
}
HarmonicPlanDataSample.prototype = new DataSample();

function GenInfo() {
    this.globalSeed = 123456;

    // Song structure and phrase group seeds
    this.tempoSeed = 123456;
    this.scaleSeed = 123456;
    this.tsSeed = 123456;
    this.introSeed = 123456;
    this.endSeed = 123456;
    this.renderAmountSeed = 123456;
    this.modulationSeed = 123456;
    this.tonicizationSeed = 123456;
    this.songStructureSeed = 123456;
    this.glueSeed = 123456;
    this.phraseGroupSeed = 123456;
    this.phraseGroupSimilaritySeed = 123456;
    this.groupSimilaritySeed = 123456;
    this.groupDifferenceSeed = 123456;

    // Indices seeds. Yes, they are referenced somewhere but the property name is computed :)
    this.melodyShapeIndicesSeed = 123456;
    this.bassShapeIndicesSeed = 123456;
    this.harmonyIndicesSeed = 123456;
    this.harmonyRythmIndicesSeed = 123456;
    this.suspendIndicesSeed = 123456;
    this.melodyChannelDistributionIndicesSeed = 123456;
    this.inner1ChannelDistributionIndicesSeed = 123456;
    this.inner2ChannelDistributionIndicesSeed = 123456;
    this.bassChannelDistributionIndicesSeed = 123456;
    this.melodyMotifDistributionIndicesSeed = 123456;
    this.inner1MotifDistributionIndicesSeed = 123456;
    this.inner2MotifDistributionIndicesSeed = 123456;
    this.bassMotifDistributionIndicesSeed = 123456;
    this.percussionMotifDistributionIndicesSeed = 123456;
    this.percussionFillMotifDistributionIndicesSeed = 123456;
    this.harmonyExtraIndicesSeed = 123456;
    this.renderAmountIndicesSeed = 123456;
    this.tempoIndicesSeed = 123456;
    this.sequentialTempoChangeIndicesSeed = 123456;
    this.parallelTempoChangeIndicesSeed = 123456;
    this.sequentialMelodyEffectChangeIndicesSeed = 123456;
    this.sequentialInner1EffectChangeIndicesSeed = 123456;
    this.sequentialInner2EffectChangeIndicesSeed = 123456;
    this.sequentialBassEffectChangeIndicesSeed = 123456;
    this.sequentialPercussionEffectChangeIndicesSeed = 123456;

    // All else seeds
    this.instrumentTypeSeed = 123456;
    this.melodyInstrumentSeed = 123456;
    this.inner1InstrumentSeed = 123456;
    this.inner2InstrumentSeed = 123456;
    this.bassInstrumentSeed = 123456;
    this.melodyMotifSeed = 123456;
    this.melodyMotifRythmSeed = 123456;
    this.melodyMotifEmbellishConnectSeed = 123456;
    this.bassMotifSeed = 123456;
    this.bassMotifRythmSeed = 123456;
    this.bassMotifEmbellishConnectSeed = 123456;
    this.harmonyMotifSeed = 123456;
    this.harmonyMotifRythmSeed = 123456;
    this.harmonyMotifEmbellishConnectSeed = 123456;
    this.percussionMotifSeed = 123456;
    this.percussionFillMotifSeed = 123456;
    this.percussionInstrumentSeed = 123456;
    this.percussionFillInstrumentSeed = 123456;
    this.percussionMotifRythmSeed = 123456;
    this.percussionFillMotifRythmSeed = 123456;
    this.melodyShapeSeed = 123456;
    this.bassShapeSeed = 123456;
    this.harmonyRythmSeed = 123456;
    this.melodyMotifDistributionSeed = 123456;
    this.inner1MotifDistributionSeed = 123456;
    this.inner2MotifDistributionSeed = 123456;
    this.bassMotifDistributionSeed = 123456;
    this.percussionMotifDistributionSeed = 123456;
    this.percussionFillMotifDistributionSeed = 123456;
    this.melodyHarmonyPunctationSeed = 123456;
    this.innerHarmonyPunctationSeed = 123456;
    this.harmonySeed = 123456;
    this.channelDistributionSeed = 123456;
    this.tempoChangeSeed = 123456;
    this.effectChangeSeed = 123456;
    this.suspendSeed = 123456;

    // Likelihoods and other settings
    this.allInstrumentsDifferentProbability = 0.35;
    this.adaptHarmonyRythmToTempo = true;
    this.adaptHarmonyRythmToTimeSignature = true;
    this.adaptSuspensionToTempo = true;
    this.adaptMotifRythmsToTempo = true; // Kommer att användas så småningom när jag implementerat detta :)
    this.tonicizeLikelihoodMultipliers = [1.0]; // : möjligt att ha en för varje frasgrupp (som är fri)
    this.modulateLikelihoodMultiplier = 0.25; //
    this.simpleMixtureLikelihoods = [1.0]; // : (harmonyExtra får ett av dessa värden beroende på dess index)
    this.sus2ChordsLikelihoods = [1.0]; // : (harmonyExtra, se ovan)
    this.sus4ChordsLikelihoods = [1.0]; // : (harmonyExtra, se ovan)
    this.neighbourChordsLikelihoods = [1.0]; // : (harmonyExtra, se ovan)
    this.passingChordsLikelihoods = [1.0]; // : (harmonyExtra, se ovan)
    this.timeSignature2Likelihood = 1.0; //
    this.timeSignature3Likelihood = 1.0; //
    this.timeSignature4Likelihood = 3.0; //
    this.minorScaleLikelihood = 1; //
    this.majorScaleLikelihood = 1; //
    this.setScaleBaseNote = false;
    this.scaleBaseNote = 60;
    this.raiseLeadingInMinorProbabilities = [0.5]; // : harmonyExtra, se ovan
    this.strictBuildSongStructureLikelihoodMultiplier = 1.0; // : begränsar vilka song structures som kan användas
    this.buildSongStructureLikelihoodMultiplier = 1.0; // : begränsar vilka song structures som kan användas
    this.verseChorusSongStructureLikelihoodMultiplier = 1.0; // :
    this.verseChorusBridgeSongStructureLikelihoodMultiplier = 1.0; // :
    this.noMelodyPartSongStructureLikelihoodMultiplier = 1.0; // :
    this.electronicLikelihood = 1.0; //  : Kommer troligtvis att ändras när man får bättre musikstilar :)
    this.electricLikelihood = 1.0; //  : Kommer troligtvis att ändras när man får bättre musikstilar :)
    this.acousticLikelihood = 1.0; //  : Kommer troligtvis att ändras när man får bättre musikstilar :)
    this.filterFEffectsProbMultiplier = 1.0; // :
    this.filterBWEffectsProbMultiplier = 1.0; // :
    this.panEffectsProbMultiplier = 1.0; // :
    this.oddHarmonyRythmProbability = 0.01; // :
    this.melodyShareProbabilities = [0.3]; // : pss som för harmonyExtra fast för inner1motifdistributions
    this.endSongTempoChangeProbability = 0.5; // :
    this.endPhraseGroupTempoChangeProbabilities = [0.0]; // :
    this.adaptTempoToRenderAmount = true; // :
    this.tempoAdaptBias = 3;
    this.tempoAdaptRandomMultiplier = 3;
    this.useNaturalTempoChanges = true; // Increasing tempo up to target level, decrease rapidly etc.
    this.voiceLineSuspensionProbabilities = [0.5]; // : suspendInfos får detta som harmonyExtra ovan
    this.songIntroProbability = 0.7; // :
    this.songEndProbability = 0.5; // :
    this.withinPhraseGroupSimilarRandomFraction = 0.35; // :
    this.withinPhraseGroupSimilarBias = 0.55; // :
    this.samePhraseGroupIndexSimilarRandomFraction = 0.25; // :
    this.samePhraseGroupIndexSimilarBias = 0.5; // :
    this.differentPhraseGroupIndexDifferentRandomFraction = 0.3; // :
    this.differentPhraseGroupIndexDifferentBias = 0.25; // :
    this.defaultPrefixGlueProbability = 0.3;
    this.defaultPostfixGlueProbability = 0.3;
    this.prefixGlueProbabilityMultiplier = 1;
    this.postfixGlueProbabilityMultiplier = 1;
    this.prolongStaticLikelihoods = [2];
    this.prolongDynamicLikelihoods = [4];
    this.prolongDominantCadenceLikelihoods = [3];
    this.prolongTonicCadenceLikelihoods = [1];
    this.prolongHarmonyPartBiases = [20];
    this.prolongHarmonyPartRandomFractions = [50];
    this.overwriteGroupModulationIndices = false;
    this.groupModulation1Indices = [1];
    this.groupModulation2Indices = [1, 2];
    this.groupModulation3Indices = [1, 2, 3];
    this.groupModulation4Indices = [1, 2, 3, 4];
    this.groupModulation5Indices = [1, 2, 3, 4, 5];
    this.harmonyLengthLikelihoodMultipliers = [{}];
    this.harmonyLengthLikelihoodOverwriters = [{}];
    this.overwriteHarmonyLengthLikelihoods = [false];
    this.harmonyLengthLikelihoods = [{"4": 1}];


    // Domains
    this.tempoRange = [60, 140];

    this.melodyShapeAmpRanges = [[6, 12]];
    this.melodyShapeBiasRanges = [[68, 76]];

    this.melodyStartLevels = [[MelodyOffsetLevel.VERY_LOW, MelodyOffsetLevel.LOW, MelodyOffsetLevel.MIDDLE, MelodyOffsetLevel.HIGH, MelodyOffsetLevel.VERY_HIGH]];
    this.melodyEndLevels = [[MelodyOffsetLevel.VERY_LOW, MelodyOffsetLevel.LOW, MelodyOffsetLevel.MIDDLE, MelodyOffsetLevel.HIGH, MelodyOffsetLevel.VERY_HIGH]];

    this.bassShapeAmpRanges = [[2, 4]];
    this.bassShapeBiasRanges = [[35, 45]];

    this.bassStartLevels = [[MelodyOffsetLevel.VERY_LOW, MelodyOffsetLevel.LOW, MelodyOffsetLevel.MIDDLE, MelodyOffsetLevel.HIGH, MelodyOffsetLevel.VERY_HIGH]];
    this.bassEndLevels = [[MelodyOffsetLevel.VERY_LOW, MelodyOffsetLevel.LOW, MelodyOffsetLevel.MIDDLE, MelodyOffsetLevel.HIGH, MelodyOffsetLevel.VERY_HIGH]];

    this.majorDeceptiveRootRndInfos = [
        {data: 6, likelihood: 1, _constructorName: "IntDataSample"},
        {data: 5, likelihood: 4, _constructorName: "IntDataSample"},
        {data: 3, likelihood: 4, _constructorName: "IntDataSample"},
        {data: 2, likelihood: 1, _constructorName: "IntDataSample"},
        {data: 1, likelihood: 1, _constructorName: "IntDataSample"}
    ];

    this.minorDeceptiveRootRndInfos = [
        {data: 6, likelihood: 1, _constructorName: "IntDataSample"},
        {data: 5, likelihood: 4, _constructorName: "IntDataSample"},
        {data: 3, likelihood: 4, _constructorName: "IntDataSample"},
        {data: 2, likelihood: 1, _constructorName: "IntDataSample"},
        {data: 1, likelihood: 1, _constructorName: "IntDataSample"}
    ];

    this.electronicMelodyInstrInfos = [
        // {data: MidiProgram.CALLIOPE_LEAD, likelihood: 1},
//        {data: MidiProgram.CHIFF_LEAD, likelihood: 1},
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PIANO_1, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PIANO_2, likelihood: 1}),
//        {data: MidiProgram.FIFTHS_LEAD, likelihood: 1},
//        new MidiProgramDataSample({data: MidiProgram.SYNTH_BRASS_1, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.SYNTH_BRASS_2, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SAW_LEAD, likelihood: 1})
//        {data: MidiProgram.SQUARE_LEAD, likelihood: 1}
//        {data: MidiProgram.VOICE_LEAD, likelihood: 1}
//        {data: MidiProgram.CHARANG_LEAD, likelihood: 1}
    ];
    this.electronicInnerFastInstrInfos = [
//        {data: MidiProgram.CALLIOPE_LEAD, likelihood: 1},
//        {data: MidiProgram.CHIFF_LEAD, likelihood: 1},
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PIANO_1, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PIANO_2, likelihood: 1}),
//        {data: MidiProgram.SAW_LEAD, likelihood: 1},
//        {data: MidiProgram.SQUARE_LEAD, likelihood: 1}
//        {data: MidiProgram.VOICE_LEAD, likelihood: 1},
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_GRAND_PIANO, likelihood: 1})
//        {data: MidiProgram.ELECTRIC_JAZZ_GUITAR, likelihood: 1},
//        {data: MidiProgram.ELECTRIC_MUTED_GUITAR, likelihood: 1}
//        {data: MidiProgram.CHARANG_LEAD, likelihood: 1}
    ];
    this.electronicInnerSlowInstrInfos = [
//        {data: MidiProgram.BOWED_PAD, likelihood: 1},
        new MidiProgramDataSample({data: MidiProgram.HALO_PAD, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.METALLIC_PAD, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.NEW_AGE_PAD, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.POLYSYNTH_PAD, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SWEEP_PAD, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SYNTH_STRINGS_1, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SYNTH_STRINGS_2, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.WARM_PAD, likelihood: 1})
    ];

    this.electronicBassInstrInfos = [
//        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PIANO_1, likelihood: 1},
        new MidiProgramDataSample({data: MidiProgram.SYNTH_BASS_1, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SYNTH_BASS_1, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SYNTH_BASS_2, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SYNTH_BASS_2, likelihood: 1})
//        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PIANO_2, likelihood: 1}
    ];


    this.electricMelodyInstrInfos = [
        new MidiProgramDataSample({data: MidiProgram.DISTORTION_GUITAR, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_GRAND_PIANO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.PERCUSSIVE_ORGAN, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ROCK_ORGAN, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.SYNTH_BRASS_1, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.SYNTH_BRASS_2, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_JAZZ_GUITAR, likelihood: 1},
//        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_MUTED_GUITAR, likelihood: 1},
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PIANO_1, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PIANO_2, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.OVERDRIVEN_GUITAR, likelihood: 1})
//        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_CLEAN_GUITAR, likelihood: 1}
    ];
    this.electricInnerFastInstrInfos = [
        new MidiProgramDataSample({data: MidiProgram.DISTORTION_GUITAR, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_GRAND_PIANO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_JAZZ_GUITAR, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_MUTED_GUITAR, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PIANO_1, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PIANO_2, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.OVERDRIVEN_GUITAR, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.SYNTH_BRASS_1, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.SYNTH_BRASS_2, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SYNTH_CHOIR, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_CLEAN_GUITAR, likelihood: 1})
    ];
    this.electricInnerSlowInstrInfos = [
        new MidiProgramDataSample({data: MidiProgram.DISTORTION_GUITAR, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.OVERDRIVEN_GUITAR, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.SYNTH_BRASS_1, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.SYNTH_BRASS_2, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SYNTH_CHOIR, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.BOWED_PAD, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.HALO_PAD, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.METALLIC_PAD, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.NEW_AGE_PAD, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.POLYSYNTH_PAD, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SWEEP_PAD, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SYNTH_STRINGS_1, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SYNTH_STRINGS_2, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.WARM_PAD, likelihood: 1})
//        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_CLEAN_GUITAR, likelihood: 1}
    ];
    this.electricBassInstrInfos = [
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_GRAND_PIANO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_FINGER_BASS, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PICK_BASS, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SYNTH_BASS_1, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SYNTH_BASS_2, likelihood: 1})
//        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PIANO_1, likelihood: 1},
//        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PIANO_2, likelihood: 1}
    ];

    this.acousticMelodyInstrInfos = [
        new MidiProgramDataSample({data: MidiProgram.ACOUSTIC_GRAND_PIANO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.BRIGHT_ACOUSTIC_PIANO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ACOUSTIC_NYLON_GUITAR, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ACOUSTIC_STEEL_GUITAR, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ORCHESTRAL_HARP, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.CELLO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.FLUTE, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.PICCOLO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.PIZZICATO_STRINGS, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.RECORDER, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.VIOLIN, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.TRUMPET, likelihood: 1},
//        new MidiProgramDataSample({data: MidiProgram.MUTED_TRUMPET, likelihood: 1},
//        new MidiProgramDataSample({data: MidiProgram.SOPRANO_SAX, likelihood: 1},
        new MidiProgramDataSample({data: MidiProgram.OBOE, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.REED_ORGAN, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ROCK_ORGAN, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.TROMBONE, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.VIOLA, likelihood: 1})
    ];


    this.acousticInnerFastInstrInfos = [
        new MidiProgramDataSample({data: MidiProgram.ACOUSTIC_GRAND_PIANO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.BRIGHT_ACOUSTIC_PIANO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ACOUSTIC_NYLON_GUITAR, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ACOUSTIC_STEEL_GUITAR, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ORCHESTRAL_HARP, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.CELLO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.FLUTE, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.PICCOLO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.PIZZICATO_STRINGS, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.RECORDER, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.VIOLIN, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.TRUMPET, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.MUTED_TRUMPET, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.SOPRANO_SAX, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.OBOE, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.REED_ORGAN, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ROCK_ORGAN, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.TROMBONE, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.VIOLA, likelihood: 1})
    ];

    this.acousticInnerSlowInstrInfos = [
        new MidiProgramDataSample({data: MidiProgram.STRING_ENSEMBLE_1, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.STRING_ENSEMBLE_2, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.VOICE_OOHS, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.ALTO_SAX, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.BARITONE_SAX, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.CHOIR_AAHS, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.CHURCH_ORGAN, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.CLARINET, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.CLAVINET, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ENGLISH_HORN, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.MUTED_TRUMPET, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.OBOE, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.OCARINA, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.PAN_FLUTE, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.REED_ORGAN, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ROCK_ORGAN, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.SOPRANO_SAX, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.CELLO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.FLUTE, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.PICCOLO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.RECORDER, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.VIOLIN, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.VIOLA, likelihood: 1})
    ];

    this.acousticBassInstrInfos = [
        new MidiProgramDataSample({data: MidiProgram.ACOUSTIC_GRAND_PIANO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.BRIGHT_ACOUSTIC_PIANO, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.CONTRABASS, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.BASSOON, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.FRETLESS_BASS, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SLAP_BASS_1, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SLAP_BASS_2, likelihood: 1}),
        // new MidiProgramDataSample({data: MidiProgram.TIMPANI, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ACOUSTIC_BASS, likelihood: 1})
    ];


    this.bassDrumRndInfos = [
        new MidiDrumDataSample({data: MidiDrum.LOW_TOM_1, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.LOW_TOM_2, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.LOW_BONGO, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.LOW_CONGA, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.LOW_TIMBALE, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.BASS_DRUM_1, likelihood: 20}),
        new MidiDrumDataSample({data: MidiDrum.BASS_DRUM_2, likelihood: 20})
    ];

    this.snareRndInfos = [
        new MidiDrumDataSample({data: MidiDrum.SNARE_DRUM_1, likelihood: 30}),
//        new MidiDrumDataSample({data: MidiDrum.CRASH_CYMBAL_1, likelihood: 1}),
//        new MidiDrumDataSample({data: MidiDrum.CRASH_CYMBAL_2, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.HAND_CLAP, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.HIGH_TOM_1, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.HIGH_TOM_2, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.MID_TOM_1, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.MID_TOM_2, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.OPEN_HIGH_CONGA, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.SNARE_DRUM_2, likelihood: 30})
    ];

    this.crashRndInfos = [
        new MidiDrumDataSample({data: MidiDrum.CHINESE_CYMBAL, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.SPLASH_CYMBAL, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.CRASH_CYMBAL_1, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.CRASH_CYMBAL_2, likelihood: 1})
    ];

    this.rideRndInfos = [
        new MidiDrumDataSample({data: MidiDrum.MARACAS, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.OPEN_TRIANGLE, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.MUTE_TRIANGLE, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.CLAVES, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.RIDE_BELL, likelihood: 2}),
        new MidiDrumDataSample({data: MidiDrum.RIMSHOT, likelihood: 5}),
        new MidiDrumDataSample({data: MidiDrum.RIDE_CYMBAL_1, likelihood: 20}),
        new MidiDrumDataSample({data: MidiDrum.RIDE_CYMBAL_2, likelihood: 20}),
        new MidiDrumDataSample({data: MidiDrum.PEDAL_HIHAT, likelihood: 20}),
        new MidiDrumDataSample({data: MidiDrum.CLOSED_HIHAT, likelihood: 20}),
        new MidiDrumDataSample({data: MidiDrum.OPEN_HIHAT, likelihood: 20})
    ];

    this.fillIndexPatternRndInfos = [
        {data: [0], likelihood: 10, _constructorName: "IntListDataSample"},
        {data: [0, 1], likelihood: 1, _constructorName: "IntListDataSample"},
        {data: [0, 1, 0], likelihood: 1, _constructorName: "IntListDataSample"},
        {data: [0, 1, 1], likelihood: 1, _constructorName: "IntListDataSample"},
        {data: [0, 1, 2], likelihood: 1, _constructorName: "IntListDataSample"},
        {data: [0, 0, 1], likelihood: 1, _constructorName: "IntListDataSample"},
        {data: [0, 0, 0, 1], likelihood: 5, _constructorName: "IntListDataSample"},
        {data: [0, 0, 1, 0], likelihood: 3, _constructorName: "IntListDataSample"},
        {data: [0, 1, 0, 0], likelihood: 2, _constructorName: "IntListDataSample"},
        {data: [0, 0, 1, 1], likelihood: 1, _constructorName: "IntListDataSample"},
        {data: [0, 1, 1, 1], likelihood: 1, _constructorName: "IntListDataSample"},
        {data: [0, 1, 1, 0], likelihood: 1, _constructorName: "IntListDataSample"},
        {data: [0, 0, 1, 2], likelihood: 1, _constructorName: "IntListDataSample"},
        {data: [0, 1, 2, 0], likelihood: 1, _constructorName: "IntListDataSample"},
        {data: [0, 1, 2, 1], likelihood: 1, _constructorName: "IntListDataSample"}
    ];


    this.phraseGroupTypes = [
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_INCOMPLETE, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_TONIC_PROLONG, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE_PLAGIAL, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE_IMPERFECT, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_DECEPTIVE, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_TONICIZE, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_PHRASE_MODULATE, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample"},
        {data: SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample"}, // Better to use in a harmonic plan
        {data: SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE, likelihood: 0.125, _constructorName: "PhraseGroupTypeDataSample"},
        {data: SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_MODULATE_BACK, likelihood: 0.125, _constructorName: "PhraseGroupTypeDataSample"},
        {data: SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_MODULATE, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample"},
        {data: SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_MODULATE, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample"},
        {data: SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT, likelihood: 0.25, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT_SHORTEN, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_COMPLETE_DIFFERENT_SCALE_TYPE, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_COMPLETE, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_COMPLETE, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" }, // No shortening as in ant/cons
        {data: SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_INITIAL_PLUS_COMPLETE, likelihood: 0.5, _constructorName: "PhraseGroupTypeDataSample" }, // Start with dynamic harmony
        {data: SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_DOMINANT_PROLONG_CADENCE, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_COMPLETE, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_DOMINANT_PROLONG, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_DOMINANT_PROLONG_PLUS_COMPLETE, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_DOMINANT_PROLONG_PLUS_TONIC_CADENCE_PROLONG, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" }, //
        {data: SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLAGIAL_PLUS_COMPLETE, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_COMPLETE_PLAGIAL, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.DECEPTIVE_PLUS_DECEPTIVE, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_DECEPTIVE, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.COMPLETE_IMPERFECT_PLUS_DECEPTIVE, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_DECEPTIVE, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.DECEPTIVE_PLUS_COMPLETE, likelihood: 0.5, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_COMPLETE_LENGTHEN_DOMINANT, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.DECEPTIVE_PLUS_COMPLETE_LENGTHEN_DOMINANT, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.DECEPTIVE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.COMPLETE_IMPERFECT_PLUS_COMPLETE_LENGTHEN_DOMINANT, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.COMPLETE_IMPERFECT_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_INITIAL_PLUS_COMPLETE_LENGTHEN_DOMINANT, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_INITIAL_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE_LENGTHEN_DOMINANT, likelihood: 0.025, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC, likelihood: 0.025, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE_LENGTHEN_DOMINANT, likelihood: 0.025, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC, likelihood: 0.025, _constructorName: "PhraseGroupTypeDataSample" }
    ];

    this.modulatePhraseGroupTypes = [
        {data: SimpleModuleGeneratorPhraseGroupType.PHRASE_MODULATE, likelihood: 0.5, _constructorName: "PhraseGroupTypeDataSample"},
        {data: SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_PHRASE_MODULATE, likelihood: 0.5, _constructorName: "PhraseGroupTypeDataSample"},
        {data: SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample"},
        {data: SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_MODULATE, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample"},
        {data: SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_MODULATE, likelihood: 0.5, _constructorName: "PhraseGroupTypeDataSample"}
    ];

    this.introGroupTypes = [
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_TONIC_PROLONG, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE_PLAGIAL, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE_IMPERFECT, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_DECEPTIVE, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_INCOMPLETE, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" }
    ];

    this.endGroupTypes = [
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_TONIC_PROLONG, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE_PLAGIAL, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE_IMPERFECT, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_INCOMPLETE, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_DECEPTIVE, likelihood: 0.25, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" }
    ];
    this.glueGroupTypes = [
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_SILENT, likelihood: 0.25, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_TONIC_PROLONG, likelihood: 3, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE_PLAGIAL, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE_IMPERFECT, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_DECEPTIVE, likelihood: 0.25, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_INCOMPLETE, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" }
    ];

    this.harmonyRythmDensityCurveFrequencyOverrides = [];
    this.harmonyRythmDensityCurveAmplitudeOverrides = [];

    this.harmonyRythmMeasureCountOverrides = [];
    this.harmonyRythmNoteCountOverrides = [];

    this.overwriteSongPartStructureRndInfos = false;
    this.songPartStructureRndInfos = [];

    this.overwriteSongPartStructure = false;
    this.songPartStructure = [new SongPartStructureInfo()];


    this.overwriteMelodyInstruments = false;
    this.melodyInstruments = [MidiProgram.ACOUSTIC_GRAND_PIANO, MidiProgram.ORCHESTRAL_HARP, MidiProgram.ACOUSTIC_STEEL_GUITAR];

    this.overwriteInner1Instruments = false;
    this.inner1Instruments = [MidiProgram.ACOUSTIC_GRAND_PIANO, MidiProgram.ORCHESTRAL_HARP, MidiProgram.ACOUSTIC_STEEL_GUITAR];

    this.overwriteInner2Instruments = false;
    this.inner2Instruments = [MidiProgram.ACOUSTIC_GRAND_PIANO, MidiProgram.ORCHESTRAL_HARP, MidiProgram.ACOUSTIC_STEEL_GUITAR];

    this.overwriteBassInstruments = false;
    this.bassInstruments = [MidiProgram.ACOUSTIC_GRAND_PIANO, MidiProgram.ACOUSTIC_BASS, MidiProgram.CONTRABASS];


    this.minorHarmonicPlans = [
        {data: [DynamicHarmonyModulationTarget.MEDIANT, DynamicHarmonyModulationTarget.MEDIANT, DynamicHarmonyModulationTarget.SUBDOMINANT], likelihood: 1, _constructorName: "HarmonicPlanDataSample"},
        {data: [DynamicHarmonyModulationTarget.DOMINANT, DynamicHarmonyModulationTarget.SUBDOMINANT], likelihood: 1, _constructorName: "HarmonicPlanDataSample"}
    ];
    this.majorHarmonicPlans = [
        {data: [DynamicHarmonyModulationTarget.DOMINANT, DynamicHarmonyModulationTarget.SUBDOMINANT], likelihood: 1, _constructorName: "HarmonicPlanDataSample"},
        {data: [DynamicHarmonyModulationTarget.SUPERTONIC, DynamicHarmonyModulationTarget.MEDIANT, DynamicHarmonyModulationTarget.DOMINANT], likelihood: 1, _constructorName: "HarmonicPlanDataSample"}
    ];

    this.renderAmountStrengthMap = {
        veryWeak: [0.02],
        weak: [0.15],
        medium: [0.4],
        strong: [0.7],
        veryStrong: [1.0],
        _constructorName: "RenderAmountStrengthMap"
    };


    this.majorModulationTargetInfos = [
        {data: DynamicHarmonyModulationTarget.MEDIANT, likelihood: 0.1, _constructorName: "ModulationTargetDataSample"},
//        {data: DynamicHarmonyModulationTarget.SUBDOMINANT, likelihood: 0.02},
        {data: DynamicHarmonyModulationTarget.SUBMEDIANT, likelihood: 0.1, _constructorName: "ModulationTargetDataSample"},
        {data: DynamicHarmonyModulationTarget.SUPERTONIC, likelihood: 0.2, _constructorName: "ModulationTargetDataSample"},
        {data: DynamicHarmonyModulationTarget.DOMINANT, likelihood: 1, _constructorName: "ModulationTargetDataSample"}
    ];
    this.minorModulationTargetInfos = [
        {data: DynamicHarmonyModulationTarget.MEDIANT, likelihood: 1, _constructorName: "ModulationTargetDataSample"},
//        {data: DynamicHarmonyModulationTarget.SUBDOMINANT, likelihood: 0.05},
        {data: DynamicHarmonyModulationTarget.SUBMEDIANT, likelihood: 0.1, _constructorName: "ModulationTargetDataSample"},
        {data: DynamicHarmonyModulationTarget.SUBTONIC, likelihood: 0.1, _constructorName: "ModulationTargetDataSample"},
        {data: DynamicHarmonyModulationTarget.DOMINANT, likelihood: 0.2, _constructorName: "ModulationTargetDataSample"}
    ];

    this.melodyMotifIndexPatternInfos = [
        {data: [[1], [1], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [2], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[0], [1], [2], [1]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[0], [1], [2], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[0], [1], [1], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[0], [1], [2], [3]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [1], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [2], [1]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [2], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [1], [3]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [2], [3]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [3], [1]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [3], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [1], [0], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [2], [0], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [3], [0], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [3], [0], [1]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [2], [0], [1]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [2], [1], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [2], [3], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [2], [2], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [2], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [1], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"}
    ];

    this.bassMotifIndexPatternInfos = [
        {data: [[1], [1], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [2], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[0], [1], [2], [1]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[0], [1], [2], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[0], [1], [1], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[0], [1], [2], [3]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [1], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [2], [1]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [2], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [1], [3]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [2], [3]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [3], [1]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [3], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [1], [0], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [2], [0], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [3], [0], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [3], [0], [1]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [2], [0], [1]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [2], [1], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [2], [3], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [2], [2], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [2], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [1], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"}
    ];

    this.harmonyElements = [];

    this.customMelodyCurveInfos = [];
    this.customBassCurveInfos = [];

    // Override phrase group types for verse, chorus and bridge
    this.songPartTypeOverrideInfos = [];

    this.overrideBassDrumNote = false;
    this.bassDrumNote = MidiDrum.BASS_DRUM_1;
    this.overrideSnareDrumNote = false;
    this.snareDrumNote = MidiDrum.SNARE_DRUM_1;
    this.overrideCrashDrumNote = false;
    this.crashDrumNote = MidiDrum.CRASH_CYMBAL_1;
    this.overrideRideDrumNotes = false;
    this.rideDrumNotes = [MidiDrum.CLOSED_HIHAT, MidiDrum.OPEN_HIHAT, MidiDrum.RIDE_CYMBAL_1];

    this.addBassDrumsOverride = [];
    this.addSnareDrumsOverride = [];
    this.addRideDrumsOverride = [];
    this.addCrashDrumsOverride = [];

    this.percussionFillMotifIndicesOverride = [];
    this.percussionFillProbabilities = [0.35];
    this.overrideFillNotes = false;
    this.fillNotes = [MidiDrum.SNARE_DRUM_1, MidiDrum.OPEN_HIHAT, MidiDrum.RIDE_CYMBAL_1, MidiDrum.BASS_DRUM_1];
    this.fillActivatedRenderAmountRange = [0.1, 0.4];

    this.useMaxHarmonyElementLength = true;
    this.useMaxCustomHarmonyElementLength = false;
    this.maxCustomHarmonyElementLength = 2;
    this.maxCustomHarmonyElementLengthUnit = PositionUnit.MEASURES;
    this.maxCustomHarmonyElementLengthUseExpression = false;

    this.melodyMotifRythmCountIncreasePerIndex = 0.4;
    this.melodyMotifRythmCountIncreaseOffsetRange = [0.5, 1.0];
    this.bassMotifRythmCountIncreasePerIndex = 0.4;
    this.bassMotifRythmCountIncreaseOffsetRange = [0.25, 0.75];

    this.melodyMotifRythmNoteCountOverrides = [];
    this.bassMotifRythmNoteCountOverrides = [];

    this.melodyMotifZone1Probabilities = [0.5];
    this.melodyMotifZone1TripletLikelihoods = [0.5];
    this.melodyMotifZone1DotSecondLikelihoods = [0.5];
    this.melodyMotifZone1DotFirstLikelihoods = [2];
    this.melodyMotifZone1DotNormalDotLikelihoods = [0.5];
    this.melodyMotifZone1NormalDotDotLikelihoods = [0.5];
    this.melodyMotifZone1DotDotNormalLikelihoods = [0.5];
    this.melodyMotifZone1StartPosRanges = [[0, 0]];
    this.melodyMotifZone1EndPosRanges = [[0.75, 0.75]];
    this.melodyMotifZone1StartEnds = [];

    this.bassMotifZone1Probabilities = [0.5];
    this.bassMotifZone1TripletLikelihoods = [0.01];
    this.bassMotifZone1DotSecondLikelihoods = [0.5];
    this.bassMotifZone1DotFirstLikelihoods = [2];
    this.bassMotifZone1DotNormalDotLikelihoods = [0.5];
    this.bassMotifZone1NormalDotDotLikelihoods = [0.5];
    this.bassMotifZone1DotDotNormalLikelihoods = [0.5];
    this.bassMotifZone1StartPosRanges = [[0, 0]];
    this.bassMotifZone1EndPosRanges = [[0.75, 0.75]];
    this.bassMotifZone1StartEnds = [];

    this.extraMelodyRenderElements = [];
    this.extraInner1RenderElements = [];
    this.extraInner2RenderElements = [];
    this.extraBassRenderElements = [];

    // Counts
    this.melodyShapeCount = 6;
    this.bassShapeCount = 6;
    this.harmonyRythmCount = 6;
    this.harmonyCount = 6;
    this.harmonyExtraCount = 6;
    this.suspendTypeCount = 6;
    this.channelDistributionCount = 6; // For each voice line
    this.motifDistributionCount = 6; // For each voice line
    this.renderAmountCount = 6;
    this.tempoCount = 6;
    this.tempoChangeCount = 6;
    this.effectChangeCount = 6;


    // General export stuff
    this.songName = "song";

    // Midi render stuff
    this.instrumentVolumeHints = {};
//    this.instrumentVolumeHints[MidiProgram.SYNTH_STRINGS_1] = 90 / 127.0;
//    this.instrumentVolumeHints[MidiProgram.PAN_FLUTE] = 90 / 127.0;
//    this.instrumentVolumeHints[MidiProgram.CHURCH_ORGAN] = 110 / 127.0;
//    this.instrumentVolumeHints[MidiProgram.METALLIC_PAD] = 90 / 127.0;
    this.applyInstrumentVolumeHintsToMelody = false;
    this.applyInstrumentVolumeHintsToInner1 = true;
    this.applyInstrumentVolumeHintsToInner1 = true;
    this.applyInstrumentVolumeHintsToBass = false;

    this.melodyVolumeMultipliers = [1];
    this.inner1VolumeMultipliers = [1];
    this.inner2VolumeMultipliers = [1];
    this.bassVolumeMultipliers = [1];
    this.percussionVolumeMultiplier = 1;

    this.melodyPans = [20 / 127.0]; // The pans are not used yet...
    this.bassPans = [110 / 127.0];
    this.inner1Pans = [80 / 127.0];
    this.inner2Pans = [60 / 127.0];
    this.percussionPan = 64 / 127.0;

    this.mergeChannels = false;

    this.exportChordsToNewChannel = false;

    this.exportVolume = true;
    this.exportEffects = true;
    this.melodyReverbSends = [1];
    this.melodyChorusSends = [0.3];
    this.bassReverbSends = [0.1];
    this.bassChorusSends = [0.1];
    this.inner1ReverbSends = [0.1];
    this.inner1ChorusSends = [0.1];
    this.inner2ReverbSends = [0.1];
    this.inner2ChorusSends = [0.1];
    this.percussionReverbSend = 0;
    this.percussionChorusSend = 0;

    // Wav render stuff
    this.soundFontType = SoundFontType.STANDARD_LIGHT;
    this.normalizeRenderedResult = false;
    this.compressRenderedResult = false;

    this._constructorName = "GenInfo";
}

GenInfo.prototype.phraseGroupTypes_allowedTypes = {"PhraseGroupTypeDataSample": 1};
GenInfo.prototype.modulatePhraseGroupTypes_allowedTypes = {"PhraseGroupTypeDataSample": 1};
GenInfo.prototype.introGroupTypes_allowedTypes = {"PhraseGroupTypeDataSample": 1};
GenInfo.prototype.endGroupTypes_allowedTypes = {"PhraseGroupTypeDataSample": 1};
GenInfo.prototype.glueGroupTypes_allowedTypes = {"PhraseGroupTypeDataSample": 1};
GenInfo.prototype.majorDeceptiveRootRndInfos_allowedTypes = {"IntDataSample": 1};
GenInfo.prototype.minorDeceptiveRootRndInfos_allowedTypes = {"IntDataSample": 1};
GenInfo.prototype.electronicMelodyInstrInfos_allowedTypes = {"MidiProgramDataSample": 1};
GenInfo.prototype.electronicInnerFastInstrInfos_allowedTypes = {"MidiProgramDataSample": 1};
GenInfo.prototype.electronicInnerSlowInstrInfos_allowedTypes = {"MidiProgramDataSample": 1};
GenInfo.prototype.electronicBassInstrInfos_allowedTypes = {"MidiProgramDataSample": 1};
GenInfo.prototype.electricMelodyInstrInfos_allowedTypes = {"MidiProgramDataSample": 1};
GenInfo.prototype.electricInnerFastInstrInfos_allowedTypes = {"MidiProgramDataSample": 1};
GenInfo.prototype.electricInnerSlowInstrInfos_allowedTypes = {"MidiProgramDataSample": 1};
GenInfo.prototype.electricBassInstrInfos_allowedTypes = {"MidiProgramDataSample": 1};
GenInfo.prototype.acousticMelodyInstrInfos_allowedTypes = {"MidiProgramDataSample": 1};
GenInfo.prototype.acousticInnerFastInstrInfos_allowedTypes = {"MidiProgramDataSample": 1};
GenInfo.prototype.acousticInnerSlowInstrInfos_allowedTypes = {"MidiProgramDataSample": 1};
GenInfo.prototype.acousticBassInstrInfos_allowedTypes = {"MidiProgramDataSample": 1};
GenInfo.prototype.bassDrumRndInfos_allowedTypes = {"MidiDrumDataSample": 1};
GenInfo.prototype.snareRndInfos_allowedTypes = {"MidiDrumDataSample": 1};
GenInfo.prototype.crashRndInfos_allowedTypes = {"MidiDrumDataSample": 1};
GenInfo.prototype.rideRndInfos_allowedTypes = {"MidiDrumDataSample": 1};
GenInfo.prototype.fillIndexPatternRndInfos_allowedTypes = {"IntListDataSample": 1};
GenInfo.prototype.songPartStructure_allowedTypes = {"SongPartStructureInfo": 1};
GenInfo.prototype.songPartStructureRndInfos_allowedTypes = {"SongPartStructureInfoDataSample": 1};
GenInfo.prototype.majorHarmonicPlans_allowedTypes = {"HarmonicPlanDataSample": 1};
GenInfo.prototype.minorHarmonicPlans_allowedTypes = {"HarmonicPlanDataSample": 1};
GenInfo.prototype.majorModulationTargetInfos_allowedTypes = {"ModulationTargetDataSample": 1};
GenInfo.prototype.minorModulationTargetInfos_allowedTypes = {"ModulationTargetDataSample": 1};
GenInfo.prototype.melodyMotifIndexPatternInfos_allowedTypes = {"IntList2DDataSample": 1};
GenInfo.prototype.bassMotifIndexPatternInfos_allowedTypes = {"IntList2DDataSample": 1};
GenInfo.prototype.songPartTypeOverrideInfos_allowedTypes = {"SongPartTypeOverrideInfo": 1};
GenInfo.prototype.harmonyElements_allowedTypes = {"SimpleSequenceHarmonyElement": 1, "PhraseHarmonyElement": 1};
GenInfo.prototype.customMelodyCurveInfos_allowedTypes = {"LinearInterpolatedCustomVoiceLineCurveInfo": 1};
GenInfo.prototype.customBassCurveInfos_allowedTypes = {"LinearInterpolatedCustomVoiceLineCurveInfo": 1};


GenInfo.prototype.randomize = function(rnd) {
    this.globalSeed = rnd.genrand_int31();

    // Song structure seeds
    this.tempoSeed = rnd.genrand_int31();
    this.scaleSeed = rnd.genrand_int31();
    this.tsSeed = rnd.genrand_int31();
    this.introSeed = rnd.genrand_int31();
    this.endSeed = rnd.genrand_int31();
    this.renderAmountSeed = rnd.genrand_int31();
    this.modulationSeed = rnd.genrand_int31();
    this.tonicizationSeed = rnd.genrand_int31();
    this.songStructureSeed = rnd.genrand_int31();
    this.glueSeed = rnd.genrand_int31();
    this.phraseGroupSeed = rnd.genrand_int31();
    this.phraseGroupSimilaritySeed = rnd.genrand_int31();
    this.groupSimilaritySeed = rnd.genrand_int31();
    this.groupDifferenceSeed = rnd.genrand_int31();


    // Indices seeds
    this.melodyShapeIndicesSeed = rnd.genrand_int31();
    this.bassShapeIndicesSeed = rnd.genrand_int31();
    this.harmonyIndicesSeed = rnd.genrand_int31();
    this.harmonyRythmIndicesSeed = rnd.genrand_int31();
    this.suspendIndicesSeed = rnd.genrand_int31();
    this.melodyChannelDistributionIndicesSeed = rnd.genrand_int31();
    this.inner1ChannelDistributionIndicesSeed = rnd.genrand_int31();
    this.inner2ChannelDistributionIndicesSeed = rnd.genrand_int31();
    this.bassChannelDistributionIndicesSeed = rnd.genrand_int31();
    this.melodyMotifDistributionIndicesSeed = rnd.genrand_int31();
    this.inner1MotifDistributionIndicesSeed = rnd.genrand_int31();
    this.inner2MotifDistributionIndicesSeed = rnd.genrand_int31();
    this.bassMotifDistributionIndicesSeed = rnd.genrand_int31();
    this.percussionMotifDistributionIndicesSeed = rnd.genrand_int31();
    this.percussionFillMotifDistributionIndicesSeed = rnd.genrand_int31();
    this.harmonyExtraIndicesSeed = rnd.genrand_int31();
    this.renderAmountIndicesSeed = rnd.genrand_int31();
    this.tempoIndicesSeed = rnd.genrand_int31();
    this.sequentialTempoChangeIndicesSeed = rnd.genrand_int31();
    this.parallelTempoChangeIndicesSeed = rnd.genrand_int31();
    this.sequentialMelodyEffectChangeIndicesSeed = rnd.genrand_int31();
    this.sequentialInner1EffectChangeIndicesSeed = rnd.genrand_int31();
    this.sequentialInner2EffectChangeIndicesSeed = rnd.genrand_int31();
    this.sequentialBassEffectChangeIndicesSeed = rnd.genrand_int31();
    this.sequentialPercussionEffectChangeIndicesSeed = rnd.genrand_int31();


    // All else seeds
    this.instrumentTypeSeed = rnd.genrand_int31();
    this.melodyInstrumentSeed = rnd.genrand_int31();
    this.inner1InstrumentSeed = rnd.genrand_int31();
    this.inner2InstrumentSeed = rnd.genrand_int31();
    this.bassInstrumentSeed = rnd.genrand_int31();
    this.melodyMotifSeed = rnd.genrand_int31();
    this.melodyMotifRythmSeed = rnd.genrand_int31();
    this.melodyMotifEmbellishConnectSeed = rnd.genrand_int31();
    this.bassMotifSeed = rnd.genrand_int31();
    this.bassMotifRythmSeed = rnd.genrand_int31();
    this.bassMotifEmbellishConnectSeed = rnd.genrand_int31();
    this.harmonyMotifSeed = rnd.genrand_int31();
    this.harmonyMotifRythmSeed = rnd.genrand_int31();
    this.harmonyMotifEmbellishConnectSeed = rnd.genrand_int31();
    this.percussionMotifSeed = rnd.genrand_int31();
    this.percussionFillMotifSeed = rnd.genrand_int31();
    this.percussionInstrumentSeed = rnd.genrand_int31();
    this.percussionFillInstrumentSeed = rnd.genrand_int31();
    this.percussionMotifRythmSeed = rnd.genrand_int31();
    this.percussionFillMotifRythmSeed = rnd.genrand_int31();
    this.melodyShapeSeed = rnd.genrand_int31();
    this.bassShapeSeed = rnd.genrand_int31();
    this.harmonyRythmSeed = rnd.genrand_int31();
    this.melodyMotifDistributionSeed = rnd.genrand_int31();
    this.inner1MotifDistributionSeed = rnd.genrand_int31();
    this.inner2MotifDistributionSeed = rnd.genrand_int31();
    this.bassMotifDistributionSeed = rnd.genrand_int31();
    this.percussionMotifDistributionSeed = rnd.genrand_int31();
    this.percussionFillMotifDistributionSeed = rnd.genrand_int31();
    this.melodyHarmonyPunctationSeed = rnd.genrand_int31();
    this.innerHarmonyPunctationSeed = rnd.genrand_int31();
    this.harmonySeed = rnd.genrand_int31();
    this.channelDistributionSeed = rnd.genrand_int31();
    this.tempoChangeSeed = rnd.genrand_int31();
    this.effectChangeSeed = rnd.genrand_int31();
    this.suspendSeed = rnd.genrand_int31();

};


GenInfo.prototype.set = function(inputGenInfo) {
    for (var prop in inputGenInfo) {
        var old = this[prop];
        if (typeof(old) == 'undefined') {
            logit("Tried to set a value in genInfo that did not exist. Probably a bug to look for ;). Property name: '" + prop + "'");
        } else {
            this[prop] = inputGenInfo[prop];
        }
//        logit("setting " + prop + " to " + inputGenInfo[prop]);
    }
//    for (var prop in this) {
//        var test = inputGenInfo[prop];
//        if (typeof(test) === 'undefined') {
//            console.log("Not setting prop: " + prop);
//        }
//    }
};


// Chord types
var SoundFontType = {
    STANDARD_LIGHT: 0,
    STANDARD_HEAVY: 1,
//    NES_STYLE: 2,
    SNES_STYLE: 2,
//    OPL2FM_STYLE: 4,
    GXSCC_STYLE: 3,
//    GB_STYLE: 6,

    getSamplesPrefix: function(type) {
        switch (type) {
            case SoundFontType.STANDARD_LIGHT:
                return "standard_light";
            case SoundFontType.STANDARD_HEAVY:
                return "standard_heavy";
//            case SoundFontType.NES_STYLE:
//                return "nes_style";
//            case SoundFontType.OPL2FM_STYLE:
//                return "opl2fm_style";
            case SoundFontType.SNES_STYLE:
                return "snes_style";
            case SoundFontType.GXSCC_STYLE:
                return "gxscc_style";
//            case SoundFontType.GB_STYLE:
//                return "gb_style";
        }
        return "Unknown soundfont type " + type;
    },


    toString: function(type) {
        switch (type) {
            case SoundFontType.STANDARD_LIGHT:
                return "Standard (light)";
            case SoundFontType.STANDARD_HEAVY:
                return "Standard (heavy)";
//            case SoundFontType.NES_STYLE:
//                return "NES Style";
//            case SoundFontType.OPL2FM_STYLE:
//                return "OPL2 FM Style";
            case SoundFontType.SNES_STYLE:
                return "SNES Style";
            case SoundFontType.GXSCC_STYLE:
                return "GXSCC Style";
//            case SoundFontType.GB_STYLE:
//                return "GB Style";
        }
        return "Unknown soundfont type " + type;
    },

    toShortString: function(type) {
        switch (type) {
            case SoundFontType.STANDARD_LIGHT:
                return "Light";
            case SoundFontType.STANDARD_HEAVY:
                return "Heavy";
//            case SoundFontType.NES_STYLE:
//                return "NES";
//            case SoundFontType.OPL2FM_STYLE:
//                return "OPL2";
            case SoundFontType.SNES_STYLE:
                return "SNES";
            case SoundFontType.GXSCC_STYLE:
                return "GXSCC";
//            case SoundFontType.GB_STYLE:
//                return "GB";
        }
        return "Unknown soundfont type " + type;
    }


};
addPossibleValuesFunction(SoundFontType, SoundFontType.STANDARD_LIGHT, SoundFontType.GXSCC_STYLE);
