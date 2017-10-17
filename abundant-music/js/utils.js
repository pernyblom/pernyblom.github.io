

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

