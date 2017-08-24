


function createCanvas(width, height) {
    // Do this with jQuery instead...
    var canvasElement = document.createElement("canvas");
    canvasElement.width = width;
    canvasElement.height = height;
    return canvasElement;
}

function createCanvas2DContext(width, height) {
    createCanvas(width, height).getContext("2d");
}


function createSubImage(origImage, rect, processorFunc) {
    var canvasElement = createCanvas(rect[2], rect[3]);
    var tempContext = canvasElement.getContext("2d");

    tempContext.drawImage(origImage, rect[0], rect[1], rect[2], rect[3], 0, 0, rect[2], rect[3]);


    if (processorFunc) {
        // Perform some processing on the sub image
        var imageData = tempContext.getImageData(0, 0, rect[2], rect[3]);
        processorFunc(imageData);
        tempContext.putImageData(imageData, 0, 0);
    }
    return canvasElement;
}

// [start, end]
function intervalIntersect(int1, int2) {
    return !(int1[1] < int2[0] || int1[0] > int2[1]);
}

function rectDistanceToPoint(rect, p) {
    var l1 = LineGeom.distToSegmentSquared(p, {x: rect[0], y: rect[1]}, {x: rect[0], y: rect[1] + rect[3]});
    var l2 = LineGeom.distToSegmentSquared(p, {x: rect[0], y: rect[1]}, {x: rect[0] + rect[2], y: rect[1]});
    var l3 = LineGeom.distToSegmentSquared(p, {x: rect[0] + rect[2], y: rect[1]}, {x: rect[0] + rect[2], y: rect[1] + rect[3]});
    var l4 = LineGeom.distToSegmentSquared(p, {x: rect[0], y: rect[1] + rect[3]}, {x: rect[0] + rect[2], y: rect[1] + rect[3]});

    return Math.sqrt(Math.min(Math.min(l1, l2), Math.min(l3, l4)));
}

// Rects are represented with arrays:
// [x, y, width, height]
function rectCollide(rect1, rect2) {
    var x1 = rect1[0];
    var y1 = rect1[1];
    var x2 = rect2[0];
    var y2 = rect2[1];

    // y1 + height1 < y2 || y1 > y2 + height2 || x1 + width1 < x2 || x1 > x2 + width2
    return ! ( y1 + rect1[3] < y2 || y1 > y2 + rect2[3] || x1 + rect1[2] < x2 || x1 > x2 + rect2[2] )
}

function rectCenter(rect) {
    return [rect[0] + 0.5 * rect[2], rect[1] + 0.5 * rect[3]];
}

function rectScaleCopy(rect, sx, sy) {
    return rectScale(rectCopy(rect), sx, sy);
}

function rectScale(rect, sx, sy) {
    rect[0] *= sx;
    rect[1] *= sy;
    rect[2] *= sx;
    rect[3] *= sy;
    return rect;
}

function rectContains(rect, vec) {
    var vx = vec[0];
    var vy = vec[1];
    var rx = rect[0];
    var ry = rect[1];
    var rw = rect[2];
    var rh = rect[3];
    return ! (vx < rx || vx > rx + rw || vy < ry || vy > ry + rh);
}

function rectContainsRect(rect1, rect2) {
    var r1x = rect1[0];
    var r1y = rect1[1];
    var r1w = rect1[2];
    var r1h = rect1[3];
    var r2x = rect2[0];
    var r2y = rect2[1];
    var r2w = rect2[2];
    var r2h = rect2[3];
    return (r2x >= r1x && r2x + r2w <= r1x + r1w &&
        r2y >= r1y && r2y + r2h <= r1y + r1h);
}

function rectTranslate(rect, dx, dy) {
    rect[0] += dx;
    rect[1] += dy;
    return rect;
}

function rectTranslateCopy(rect, dx, dy) {
    return rectTranslate(rectCopy(rect), dx, dy);
}


function rectCopy(rect) {
    return [rect[0], rect[1], rect[2], rect[3]];
}

// The nowVec is assumed to be inside the rectangle
function collisionResponse(rect, prevVec, nowVec, impactVec, newVelVec) {
    var oldVelVec = vecMinusCopy(nowVec, prevVec);

    var rx1 = rect[0];
    var ry1 = rect[1];
    var rx2 = rx1 + rect[2];
    var ry2 = ry1 + rect[3];

    var xStepLength = oldVelVec[0];
    var yStepLength = Math.abs(oldVelVec[1]);

    var vxMultiplier = 1;
    var vyMultiplier = 1;

    if (prevVec[0] >= rx2) {
        vxMultiplier = -1;
        impactVec[0] = rx2;
        var xFraction = Math.abs((oldVelVec[0] - impactVec[0]) / oldVelVec[0]);
        impactVec[1] = Math.max(ry1, Math.min(ry2, prevVec[1] + xFraction * oldVelVec[1]));
    } else if (prevVec[0] <= rx1) {
        vxMultiplier = -1;
        impactVec[0] = rx1;
        var xFraction = Math.abs((oldVelVec[0] - impactVec[0]) / oldVelVec[0]);
        impactVec[1] = Math.max(ry1, Math.min(ry2, prevVec[1] + xFraction * oldVelVec[1]));
    }
    if (prevVec[1] >= ry2) {
        vyMultiplier = -1;
        impactVec[1] = ry2;
        var yFraction = Math.abs((oldVelVec[1] - impactVec[1]) / oldVelVec[1]);
        impactVec[0] = Math.max(rx1, Math.min(rx2, prevVec[0] + yFraction * oldVelVec[0]));
    } else if (prevVec[1] <= ry1) {
        vyMultiplier = -1;
        impactVec[1] = ry1;
        var yFraction = Math.abs((oldVelVec[1] - impactVec[1]) / oldVelVec[1]);
        impactVec[0] = Math.max(rx1, Math.min(rx2, prevVec[0] + yFraction * oldVelVec[0]));
    }


    newVelVec[0] = oldVelVec[0] * vxMultiplier;
    newVelVec[1] = oldVelVec[1] * vyMultiplier;
}


function vecEquals(vec1, vec2) {
    return vec1[0] == vec2[0] && vec1[1] == vec2[1];
}


function vecCrossWithZ(vec) {
    return [-vec[1], vec[0]];
}

function vecCrossValue(vec1, vec2) {
    return vec1[0] * vec2[1] - vec1[1] * vec2[0];
}

function vecNormalize(vec) {
    var length = vecLength(vec);
    vec[0] /= length;
    vec[1] /= length;
    return vec;
}

function vecCopy(vec) {
    return [vec[0], vec[1]];
}

function vecNormalizeCopy(vec) {
    return vecNormalize(vecCopy(vec));
}

function vecDistanceBetween(vec1, vec2) {
    return distanceBetween(vec1[0], vec1[1], vec2[0], vec2[1]);
}

function vecSqDistanceBetween(vec1, vec2) {
    return sqDistanceBetween(vec1[0], vec1[1], vec2[0], vec2[1]);
}

function vecDot(vec1, vec2) {
    return vec1[0] * vec2[0] + vec1[1] * vec2[1];
}

function vecMinus(vec1, vec2) {
    vec1[0] -= vec2[0];
    vec1[1] -= vec2[1];
    return vec1;
}

function vecRotate(vec, rad) {
    var x = vec[0];
    var y = vec[1];

    var newX = x * Math.cos(rad) - y * Math.sin(rad);
    var newY = x * Math.sin(rad) + y * Math.cos(rad);

    vec[0] = newX;
    vec[1] = newY;

    return vec;
}

function vecRotateCopy(vec, rad) {
    return vecRotate(vecCopy(vec), rad);
}

function vecRotateWithVec(vec, rotVec) {
    var x = vec[0];
    var y = vec[1];

    var cosAngle = rotVec[0];
    var sinAngle = rotVec[1];
    var newX = x * cosAngle - y * sinAngle;
    var newY = x * sinAngle + y * cosAngle;

    vec[0] = newX;
    vec[1] = newY;

    return vec;
}

function vecRotateWithVecCopy(vec, rotVec) {
    return vecRotateWithVec(vecCopy(vec), rotVec);
}


function vecRotateAroundCenter(vec, rad, centerX, centerY) {
    var x = vec[0] - centerX;
    var y = vec[1] - centerY;

    var newX = x * Math.cos(rad) - y * Math.sin(rad);
    var newY = x * Math.sin(rad) + y * Math.cos(rad);

    vec[0] = newX + centerX;
    vec[1] = newY + centerY;

    return vec;
}

function vecRotateAroundCenterCopy(vec, rad, centerX, centerY) {
    return vecRotateAroundCenter(vecCopy(vec), rad, centerX, centerY);
}


function vecRotateWithVecAroundCenter(vec, rotVec, centerX, centerY) {
    var x = vec[0] - centerX;
    var y = vec[1] - centerY;

    var cosAngle = rotVec[0];
    var sinAngle = rotVec[1];

    var newX = x * cosAngle - y * sinAngle;
    var newY = x * sinAngle + y * cosAngle;

    vec[0] = newX + centerX;
    vec[1] = newY + centerY;

    return vec;
}

function vecRotateWithVecAroundCenterCopy(vec, rotVec, centerX, centerY) {
    return vecRotateWithVecAroundCenter(vecCopy(vec), rotVec, centerX, centerY);
}



function vecMult(vec, d) {
    vec[0] *= d;
    vec[1] *= d;
    return vec;
}

function vecMultCopy(vec, d) {
    return vecMult(vecCopy(vec), d);
}

function vecPlus(vec1, vec2) {
    vec1[0] += vec2[0];
    vec1[1] += vec2[1];
    return vec1;
}

function vecMinusCopy(vec1, vec2) {
    return vecMinus(vecCopy(vec1), vec2);
}

function vecPlusCopy(vec1, vec2) {
    return vecPlus(vecCopy(vec1), vec2);
}

function vecLength(vec) {
    return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
}


function distanceBetween(x1, y1, x2, y2) {
    var diffX = x2 - x1;
    var diffY = y2 - y1;

    return Math.sqrt(diffX * diffX + diffY * diffY);
}

function sqDistanceBetween(x1, y1, x2, y2) {
    var diffX = x2 - x1;
    var diffY = y2 - y1;

    return diffX * diffX + diffY * diffY;
}

function vec2dToString(vec) {
    return "[" + vec[0] + "," + vec[1] + "]";
}


function vec3dToString(vec) {
    return "[" + vec[0] + "," + vec[1] + "," + vec[2] + "]";
}

function vec4dToString(vec) {
    return "[" + vec[0] + "," + vec[1] + "," + vec[2] + "," + vec[3] + "]";
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
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function djb2Code(str){
    var hash = 5381;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
    }
    return hash;
}


function sdbmCode(str){
    var hash = 0;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = char + (hash << 6) + (hash << 16) - hash;
    }
    return hash;
}

function loseCode(str){
    var hash = 0;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash += char;
    }
    return hash;
}

function distanceBetween3d(x1, y1, z1, x2, y2, z2) {
    var diffX = x2 - x1;
    var diffY = y2 - y1;
    var diffZ = z2 - z1;

    return Math.sqrt(diffX * diffX + diffY * diffY + diffZ * diffZ);
}


function createCoordinateSystem3d(vec) {
    var v = vec3dNormalizeCopy(vec);

    var v1 = [0, 0, 0];
    var v2 = [0, 0, 0];
    var v3 = [0, 0, 0];
    var invLen;
    if (Math.abs(v[0]) > Math.abs(v[1])) {
        invLen = 1.0 / Math.sqrt(v[0] * v[0] + v[2] * v[2]);
        vec3dSet(v2, -v[2] * invLen, 0.0, v[0] * invLen);
    } else {
        invLen = 1.0 / Math.sqrt(v[1] * v[1] + v[2] * v[2]);
        vec3dSet(v2, 0.0, v[2] * invLen, -v[1] * invLen);
    }
    vec3dSetVec(v3, vec3dCrossCopy(v, v2));
    vec3dSetVec(v1, v);

    return [v1, v2, v3];
}

function vec3dSet(v, x, y, z) {
    v[0] = x;
    v[1] = y;
    v[2] = z;
}

function vec3dSetVec(v, v2) {
    v[0] = v2[0];
    v[1] = v2[1];
    v[2] = v2[2];
}


function vec3dNormalize(vec) {
    var length = vec3dLength(vec);
    vec[0] /= length;
    vec[1] /= length;
    vec[2] /= length;
    return vec;
}

function vec3dCopy(vec) {
    return [vec[0], vec[1], vec[2]];
}

function vec3dNormalizeCopy(vec) {
    return vec3dNormalize(vec3dCopy(vec));
}

function vec3dDistanceBetween(vec1, vec2) {
    return distanceBetween3d(vec1[0], vec1[1], vec1[2], vec2[0], vec2[1], vec2[2]);
}

function vec3dDot(vec1, vec2) {
    return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2];
}

function vec3dNegate(vec) {
    vec[0] = -vec[0];
    vec[1] = -vec[1];
    vec[2] = -vec[2];
    return vec;
}

function vec3dNegateCopy(vec) {
    return vec3dNegate(vec3dCopy(vec));
}

function vec3dMinus(vec1, vec2) {
    vec1[0] -= vec2[0];
    vec1[1] -= vec2[1];
    vec1[2] -= vec2[2];
    return vec1;
}

function vec3dCross(vec1, vec2) {
    var x1 = vec1[0];
    var y1 = vec1[1];
    var z1 = vec1[2];
    var x2 = vec2[0];
    var y2 = vec2[1];
    var z2 = vec2[2];
    vec1[0] = y1 * z2 - z1 * y2;
    vec1[1] = z1 * x2 - x1 * z2;
    vec1[2] = x1 * y2 - y1 * x2;
    return vec1;
}

function vec3dCrossCopy(vec1, vec2) {
    return vec3dCross(vec3dCopy(vec1), vec2);
}

function vec3dMult(vec, d) {
    vec[0] *= d;
    vec[1] *= d;
    vec[2] *= d;
    return vec;
}


function vec3dMultCopy(vec, d) {
    return vec3dMult(vec3dCopy(vec), d);
}

function vec3dPlus(vec1, vec2) {
    vec1[0] += vec2[0];
    vec1[1] += vec2[1];
    vec1[2] += vec2[2];
    return vec1;
}

function vec3dMinusCopy(vec1, vec2) {
    return vec3dMinus(vec3dCopy(vec1), vec2);
}

function vec3dPlusCopy(vec1, vec2) {
    return vec3dPlus(vec3dCopy(vec1), vec2);
}

function vec3dLength(vec) {
    return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
}

// bounds [minX, minY, minZ, maxX, maxY, maxZ]
function bounds3dUpdateVec(bounds, vec) {
    bounds[0] = Math.min(vec[0], bounds[0]);
    bounds[3] = Math.max(vec[0], bounds[3]);
    bounds[1] = Math.min(vec[1], bounds[1]);
    bounds[4] = Math.max(vec[1], bounds[4]);
    bounds[2] = Math.min(vec[2], bounds[2]);
    bounds[5] = Math.max(vec[2], bounds[5]);
}

// bounds [minX, minY, maxX, maxY]
function bounds2dUpdateVec(bounds, vec) {
    bounds[0] = Math.min(vec[0], bounds[0]);
    bounds[2] = Math.max(vec[0], bounds[2]);
    bounds[1] = Math.min(vec[1], bounds[1]);
    bounds[3] = Math.max(vec[1], bounds[3]);
}

function bounds2dUpdateRect(bounds, rect) {
    bounds2dUpdateVec(bounds, [rect[0], rect[1]]);
    bounds2dUpdateVec(bounds, [rect[0] + rect[2], rect[1] + rect[3]]);
}

function rectToBounds2d(rect) {
    return [rect[0], rect[1], rect[0] + rect[2], rect[1] + rect[3]];
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
            for (var i=0; i<value.length; i++) {
                result[i] = copyValueDeep(value[i], parentObject, options);
            }
        return result;
    } else if (typeof(value) === 'function') {
        return value;
    } else if (typeof(value) === 'object') {
        return copyObjectDeep(value, options);
    } else {
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
    copyObjectPropertiesDeep(copy, obj, options);

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

function getExpressionValue(expression, module, extraVars) {
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
    for (var i=0; i<module.variables.length; i++) {
        var v = module.variables[i];
        pub[v.id] = prop(v.id, v.getValue(module));
    }
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

    return pub.getTheValue();
}

function getValueOrExpressionValue(object, propName, module, extraVars) {
    var result = object[propName];
    try {
        if (object[propName + "UseExpression"]) {
            var expression = object[propName + "Expression"];
            if (expression) {
                var temp = getExpressionValue(expression, module, extraVars);
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


function createFilledArray(count, element) {
    var result = [];
    for (var i=0; i<count; i++) {
        result.push(element);
    }
    return result;
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




function decode64(input) {
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    var decode64KeyStr = "ABCDEFGHIJKLMNOP" +
        "QRSTUVWXYZabcdef" +
        "ghijklmnopqrstuv" +
        "wxyz0123456789+/" +
        "=";

    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    var base64test = /[^A-Za-z0-9\+\/\=]/g;
    if (base64test.exec(input)) {
        alert("There were invalid base64 characters in the input text.\n" +
            "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
            "Expect errors in decoding.");
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    do {
        enc1 = decode64KeyStr.indexOf(input.charAt(i++));
        enc2 = decode64KeyStr.indexOf(input.charAt(i++));
        enc3 = decode64KeyStr.indexOf(input.charAt(i++));
        enc4 = decode64KeyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";

    } while (i < input.length);

    return unescape(output);
}

function findMinIndex(arr) {
    var min = arr[0];
    var minIndex = 0;
    for (var i=0; i<arr.length; i++) {
        if (arr[i] < min) {
            min = arr[i];
            minIndex = i;
        }
    }
    return minIndex;
}