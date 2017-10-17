
function Curve() {
    this.id = "";
    this.evaluateExpressions = true;
    this._constructorName = "Curve";
}

Curve.prototype.setId = function(v) {
    this.id = v;
    return this;
};

Curve.prototype.getValue = function(module, x) {
    return 0;
};


var PredefinedCurveType = {
    LINEAR: 0,
    EXP: 1,
    QUADRATIC: 2,
    CONSTANT: 3,
    SINE: 4,
    COSINE: 5,
    TRIANGLE: 6,
    SAW: 7,
    SQUARE: 8,
    WHITE_NOISE: 9,
    CONSTANT_NOISE: 10,
    LINEAR_NOISE: 11,
    QUADRATIC_NOISE: 12,
    CUBIC_NOISE: 13,
    PERLIN_NOISE: 14,

    toString: function(type) {
        switch (type) {
            case PredefinedCurveType.CONSTANT:
                return "Constant";
            case PredefinedCurveType.CONSTANT_NOISE:
                return "Constant noise";
            case PredefinedCurveType.COSINE:
                return "Cosine";
            case PredefinedCurveType.EXP:
                return "Exponential";
            case PredefinedCurveType.LINEAR:
                return "Linear";
            case PredefinedCurveType.LINEAR_NOISE:
                return "Linear noise";
            case PredefinedCurveType.QUADRATIC:
                return "Quadratic";
            case PredefinedCurveType.QUADRATIC_NOISE:
                return "Quadratic noise";
            case PredefinedCurveType.SAW:
                return "Saw";
            case PredefinedCurveType.SINE:
                return "Sine";
            case PredefinedCurveType.SQUARE:
                return "Square";
            case PredefinedCurveType.TRIANGLE:
                return "Triangle";
            case PredefinedCurveType.WHITE_NOISE:
                return "White noise";
            case PredefinedCurveType.CUBIC_NOISE:
                return "Cubic noise";
            case PredefinedCurveType.PERLIN_NOISE:
                return "Perlin noise";
        }
        return "Unknown type " + type;
    }

};
addPossibleValuesFunction(PredefinedCurveType, PredefinedCurveType.LINEAR, PredefinedCurveType.PERLIN_NOISE);



function PredefinedCurve() {
    Curve.call(this);
    this.amplitude = 1.0;
    this.frequency = 1.0;
    this.phase = 0.0;
    this.bias = 0.0;
    this.clampUpper = false;
    this.upperClamp = 1.0;
    this.clampLower = false;
    this.lowerClamp = -1.0;
    this.seed = 12345;
    this.oldSeed = this.seed;
    this.type = PredefinedCurveType.CONSTANT;
    this.oldType = this.type;

    this.data = null; // Can be used to hold extra stuff

    this._constructorName = "PredefinedCurve";
}

PredefinedCurve.prototype = new Curve();

PredefinedCurve.prototype.setAmplitude = function(a) {
    this.amplitude = a;
    return this;
};
PredefinedCurve.prototype.setBias = function(a) {
    this.bias = a;
    return this;
};
PredefinedCurve.prototype.setFrequency = function(a) {
    this.frequency = a;
    return this;
};
PredefinedCurve.prototype.setPhase = function(a) {
    this.phase = a;
    return this;
};
PredefinedCurve.prototype.setType = function(a) {
    this.type = a;
    return this;
};
PredefinedCurve.prototype.setSeed = function(a) {
    this.seed = a;
    return this;
};

PredefinedCurve.prototype.getValue = function(module, x) {
    var theType = getValueOrExpressionValue(this, "type", module);
    var theAmp = getValueOrExpressionValue(this, "amplitude", module);
    var theFreq = getValueOrExpressionValue(this, "frequency", module);
    var thePhase = getValueOrExpressionValue(this, "phase", module);
    var theSeed = getValueOrExpressionValue(this, "seed", module);
    return this.getPredefinedValue(x, theType, theAmp, theFreq, thePhase, theSeed);
};


PredefinedCurve.prototype.checkSeedOrTypeChange = function(seed, type) {
    if (this.oldSeed != seed || type != this.oldType) {
        this.oldSeed = seed;
        this.oldType = type;
        return true;
    }
    return false;
};

PredefinedCurve.prototype.getPredefinedValue = function(x, type,
                                                        amplitude, frequency, phase, seed) {
    var result = 0;

    switch (type) {
        case PredefinedCurveType.CONSTANT:
            result = amplitude;
            break;
        case PredefinedCurveType.SINE:
            result = amplitude
                * Math.sin(Math.PI * 2.0 * frequency * (x - phase));
            break;
        case PredefinedCurveType.COSINE:
            result = amplitude
                * Math.cos(Math.PI * 2.0 * frequency * (x - phase));
            break;
        case PredefinedCurveType.WHITE_NOISE:
            result = amplitude * (2.0 * Math.random() - 1);
            break;
        case PredefinedCurveType.CONSTANT_NOISE:
            // Use a simple lattice noise
            if (!this.data || this.checkSeedOrTypeChange(seed, type)) {
                this.data = new LatticeNoise(new MersenneTwister(seed));
            }
            result = amplitude * this.data.whiteNoise1((x - phase) * frequency);
            break;
        case PredefinedCurveType.LINEAR_NOISE:
            if (!this.data || this.checkSeedOrTypeChange(seed, type)) {
                this.data = new LatticeNoise(new MersenneTwister(seed));
            }
            result = amplitude * this.data.lerpNoise1((x - phase) * frequency);
            break;
        case PredefinedCurveType.QUADRATIC_NOISE:
            if (!this.data || this.checkSeedOrTypeChange(seed, type)) {
                this.data = new LatticeNoise(new MersenneTwister(seed));
            }
            result = amplitude * this.data.quadraticNoise1((x - phase) * frequency);
            break;
        case PredefinedCurveType.CUBIC_NOISE:
            if (!this.data || this.checkSeedOrTypeChange(seed, type)) {
                this.data = new LatticeNoise(new MersenneTwister(seed));
            }
            result = amplitude * this.data.cubicNoise1((x - phase) * frequency);
            break;
        case PredefinedCurveType.PERLIN_NOISE:
            break;
        case PredefinedCurveType.LINEAR:
            result = amplitude * (x - phase) * frequency;
            break;
        case PredefinedCurveType.QUADRATIC:
            result = amplitude * (x - phase) * (x - phase) * frequency;
            break;
        case PredefinedCurveType.EXP:
            result = amplitude * Math.exp((x - phase) * frequency);
            break;
        case PredefinedCurveType.SAW:
            result = amplitude * (2.0 * mod((x - phase) * frequency, 1) - 1);
            break;
        case PredefinedCurveType.SQUARE:
            var temp = mod((x - phase) * frequency, 1);
            if (temp < 0.5) {
                result = amplitude;
            } else {
                result = -amplitude;
            }
            break;
        case PredefinedCurveType.TRIANGLE:
            var temp = mod((x - phase) * frequency, 1);
            if (temp < 0.5) {
                result = amplitude * (4.0 * temp - 1.0);
            } else {
                result = amplitude * (3.0 - 4.0 * temp);
            }
            break;
    }
    result += this.bias;
    if (this.clampUpper) {
        result = Math.min(this.upperClamp, result);
    }
    if (this.clampLower) {
        result = Math.max(this.lowerClamp, result);
    }
    return result;
};




function LinearInterpolationCurve() {
    Curve.call(this);

    this.xValues = [0, 1];
    this.yValues = [0, 1];

    this.oldXValues = [];
    this.oldYValues = [];

    this.interpolator = null;
    this._constructorName = "LinearInterpolationCurve";
}

LinearInterpolationCurve.prototype = new Curve();

LinearInterpolationCurve.prototype.getValue = function(module, x) {
    var createNew = this.interpolator == null;
    var xValues = this.xValues;
    var yValues = this.yValues;

    if (this.evaluateExpressions) {
        xValues = getValueOrExpressionValue(this, "xValues", module);
        yValues = getValueOrExpressionValue(this, "yValues", module);
    }

    if (xValues.length != this.oldXValues.length || yValues.length != this.oldYValues.length) {
        createNew = true;
    } else {
        // Compare to the old values
        for (var i=0; i<xValues.length; i++) {
            if (xValues[i] != this.oldXValues[i]) {
                createNew = true;
                break;
            }
        }
    }
    if (createNew) {
        if (xValues.length < 2) {
            xValues = [0, 1];
        }
        if (yValues.length < 2) {
            yValues = [0, 1];
        }
        if (xValues.length != yValues.length) {
            yValues.length = xValues.length;
        }

        this.interpolator = new LinearInterpolator(xValues, yValues);
        this.oldXValues = copyValueDeep(xValues);
        this.oldYValues = copyValueDeep(yValues);
    }
    return this.interpolator.interpolate(x);
};


function ExpressionCurve() {
    Curve.call(this);
    this.valueExpression = "0.0";
    this.inputVariableName = "x";
    this._constructorName = "ExpressionCurve";
}
ExpressionCurve.prototype = new Curve();

ExpressionCurve.prototype.getValue = function(module, x) {
    var extraVars = {};
    extraVars[this.inputVariableName] = x;
    var result = getExpressionValue(this.valueExpression, module, extraVars);

//    logit("ehh?");
    return result;
};


function ComputationCurve() {
    Curve.call(this);
    this.computation = new DelayCurveComputation();
    this._constructorName = "ComputationCurve";
}
ComputationCurve.prototype = new Curve();

ComputationCurve.prototype.setComputation = function(c) {
    this.computation = c;
    return this;
};

ComputationCurve.prototype.getValue = function(module, x) {
    return this.computation.getValue(module, x);
};


function CurveComputation() {
    this.id = "";
    this.evaluateExpressions = true;
    this._constructorName = "CurveComputation";
}

CurveComputation.prototype.getValue = function(module, x) {
    return 0;
};

CurveComputation.prototype.getCurveOrConstantValue = function(module, x, curve, curveConstant) {
    if (curve) {
        return curve.getValue(module, x);
    } else {
        return curveConstant;
    }
};

CurveComputation.prototype.getCurveReference = function(module, curve, curveId) {
    if (curveId) {
        // Check if we need to update the reference because the id has changed
        if (!curve || (curve.id != curveId)) {
            // Curve was null or id changed
            return module.getCurve(curveId);
        } else {
            // The current curve reference is the correct one
            return curve;
        }
    } else {
        return null;
    }
};

function DelayCurveComputation() {
    CurveComputation.call(this);
    this.inputCurve = "";
    this.delayConstant = 0;
    this.delayCurve = "";
    this.theInputCurve = null;
    this.theDelayCurve = null;
    this._constructorName = "DelayCurveComputation";
}

DelayCurveComputation.prototype = new CurveComputation();

DelayCurveComputation.prototype.getValue = function(module, x) {
    this.theInputCurve = this.getCurveReference(module, this.theInputCurve, this.inputCurve);
    this.theDelayCurve = this.getCurveReference(module, this.theDelayCurve, this.delayCurve);

    var delay = this.getCurveOrConstantValue(module, x, this.theDelayCurve, this.delayConstant);

    return this.getCurveOrConstantValue(module, x + delay, this.theInputCurve, 0);
};


function AbsCurveComputation() {
    CurveComputation.call(this);
    this.inputCurve = "";
    this.theInputCurve = null;
    this._constructorName = "AbsCurveComputation";
}

AbsCurveComputation.prototype = new CurveComputation();

AbsCurveComputation.prototype.getValue = function(module, x) {
    this.theInputCurve = this.getCurveReference(module, this.theInputCurve, this.inputCurve);

    return Math.abs(this.getCurveOrConstantValue(module, x, this.theInputCurve, 0));
};


function RemapCurveComputation() {
    CurveComputation.call(this);
    this.inputCurve = "";
    this.remapCurve = "";
    this.fromInterval = [0.0, 1.0];
    this.toInterval = [0.0, 1.0];
    this.clampResult = false;
    this.theInputCurve = null;
    this.remapCurve = null;
    this._constructorName = "RemapCurveComputation";
}

RemapCurveComputation.prototype = new CurveComputation();

RemapCurveComputation.prototype.getValue = function(module, x) {
    this.theInputCurve = this.getCurveReference(module, this.theInputCurve, this.inputCurve);
    this.theRemapCurve = this.getCurveReference(module, this.theRemapCurve, this.remapCurve);

    var inputValue = this.getCurveOrConstantValue(module, x, this.theInputCurve, 0);

    var fromRange = this.fromInterval[1] - this.fromInterval[0];
    var toRange = this.fromInterval[1] - this.fromInterval[0];

    var fromFraction = (inputValue - this.fromInterval[0]) / fromRange;

    var remappedFraction = this.getCurveOrConstantValue(module, fromFraction, this.theRemapCurve, fromFraction);

    var result = this.toInterval[0] + toRange * remappedFraction;

    if (this.clampResult) {
        return Math.clamp(result, this.toInterval[0], this.toInterval[1]);
    } else {
        return result;
    }
};


function ClampCurveComputation() {
    CurveComputation.call(this);
    this.inputCurve = "";
    this.upperCurve = "";
    this.lowerCurve = "";
    this.upperLimit = 1.0;
    this.lowerLimit = -1.0;
    this.theInputCurve = null;
    this.theUpperCurve = null;
    this.theLowerCurve = null;
    this._constructorName = "ClampCurveComputation";
}

ClampCurveComputation.prototype = new CurveComputation();

ClampCurveComputation.prototype.getValue = function(module, x) {
    this.theInputCurve = this.getCurveReference(module, this.theInputCurve, this.inputCurve);
    this.theUpperCurve = this.getCurveReference(module, this.theUpperCurve, this.upperCurve);
    this.theLowerCurve = this.getCurveReference(module, this.theLowerCurve, this.lowerCurve);

    var upper = this.getCurveOrConstantValue(module, x, this.theUpperCurve, this.upperLimit);
    var lower = this.getCurveOrConstantValue(module, x, this.theLowerCurve, this.lowerLimit);

    return clamp(this.getCurveOrConstantValue(module, x, this.theInputCurve, 0), lower, upper);
};


function MirrorCurveComputation() {
    CurveComputation.call(this);
    this.inputCurve = "";
    this.mirrorX = 0.0;

    this.theInputCurve = null;
    this._constructorName = "MirrorCurveComputation";
}

MirrorCurveComputation.prototype = new CurveComputation();

MirrorCurveComputation.prototype.getValue = function(module, x) {
    this.theInputCurve = this.getCurveReference(module, this.theInputCurve, this.inputCurve);
    if (x > this.mirrorX) {
        x = 2 * this.mirrorX - x;
    }
    return this.getCurveOrConstantValue(module, x, this.theInputCurve, 0);
};



var Mix1DType = {
    FUBAR: 0
//
};


function MixCurveComputation() {
    CurveComputation.call(this);
    this.inputCurve1 = "";
    this.inputCurve2 = "";

    this.mixConstant = 0.5;
    this.mixCurve = "";

    this.mixType = Mix1DType.FUBAR;

    this.theInputCurve1 = null;
    this.theInputCurve2 = null;
    this.theMixCurve = null;
    this._constructorName = "MixCurveComputation";
}

MixCurveComputation.prototype = new CurveComputation();

MixCurveComputation.prototype.getValue = function(module, x) {
    this.theInputCurve1 = this.getCurveReference(module, this.theInputCurve1, this.inputCurve1);
    this.theInputCurve2 = this.getCurveReference(module, this.theInputCurve2, this.inputCurve2);
    this.theMixCurve = this.getCurveReference(module, this.theMixCurve, this.mixCurve);

    var mixFraction = this.getCurveOrConstantValue(module, x, this.theMixCurve, this.mixConstant);

    var value1 = this.getCurveOrConstantValue(module, x, this.theInputCurve1, 0);
    var value2 = this.getCurveOrConstantValue(module, x, this.theInputCurve2, 0);

    return mixFraction * value1 + (1.0 - mixFraction) * value2;
};


function PeriodicCurveComputation() {
    CurveComputation.call(this);
    this.inputCurve = "";
    this.period = 1.0;
    this.theInputCurve = null;
    this._constructorName = "PeriodicCurveComputation";
}

PeriodicCurveComputation.prototype = new CurveComputation();

PeriodicCurveComputation.prototype.getValue = function(module, x) {
    this.theInputCurve = this.getCurveReference(module, this.theInputCurve, this.inputCurve);
    var period = this.period;
    if (this.evaluateExpressions) {
        period = getValueOrExpressionValue(this, "period", module);
    }

    var result = this.getCurveOrConstantValue(module, mod(x, period), this.theInputCurve, 0);

//    if (this.verbose) {
//        logit(this._constructorName + " x: " + x + " period: " + period + " result: " + result);
//    }

    return result;
};


function SnapCurveComputation() {
    CurveComputation.call(this);
    this.inputCurve = "";
    this.snapMetrics = SnapMetrics.ROUND;
    this.preMultiplier = 1.0;
    this.postMultiplier = 1.0;
    this.theInputCurve = null;
    this._constructorName = "SnapCurveComputation";
}

SnapCurveComputation.prototype = new CurveComputation();

SnapCurveComputation.prototype.getValue = function(module, x) {
    this.theInputCurve = this.getCurveReference(module, this.theInputCurve, this.inputCurve);
    var value = this.getCurveOrConstantValue(module, x, this.theInputCurve, 0);
    return this.postMultiplier * SnapMetrics.snap(value * this.preMultiplier, this.snapMetrics);
};



function CurveGroup() {
    this.curves = [];
}

function CurveModifier() {
}



function MultiInputCurveComputation() {
    CurveComputation.call(this);
    this.inputCurves = [];
    this.theInputCurves = [];
    this._constructorName = "MultiInputCurveComputation";
}

MultiInputCurveComputation.prototype = new CurveComputation();

MultiInputCurveComputation.prototype.setInputCurves = function(v) {
    this.inputCurves = v;
    return this;
};

MultiInputCurveComputation.prototype.updateReferences = function(module, referenceArr, nameArr) {
    for (var i=0; i<nameArr.length; i++) {
        var curve = referenceArr[i];
        var curveName = nameArr[i];
        referenceArr[i] = this.getCurveReference(module, curve, curveName);
    }
};

MultiInputCurveComputation.prototype.getValue = function(module, x) {
    this.updateReferences(module, this.theInputCurves, this.inputCurves);
    return this.getValueReferencesOk(module, x);
};

MultiInputCurveComputation.prototype.getValueReferencesOk = function(module, x) {
    return 0;
};


function ExpressionCurveComputation() {
    MultiInputCurveComputation.call(this);
    this.inputCurvePrefix = "input";
    this.inputVariableName = "x";
    this.valueExpression = "x";
    this._constructorName = "ExpressionCurveComputation";
}

ExpressionCurveComputation.prototype = new MultiInputCurveComputation();

ExpressionCurveComputation.prototype.createCurveFunction = function(module, curve) {
    var that = this;
    return function(input) {
        return that.getCurveOrConstantValue(module, input, curve, 0);
    };
};

ExpressionCurveComputation.prototype.getValueReferencesOk = function(module, x) {
    var refs = this.theInputCurves;

    var that = this;

    var extraVars = {};
    for (var i=0; i<refs.length; i++) {
        var curve = refs[i];
        // This is wasteful... Should be done differently... To many functions constructed...
        extraVars[this.inputCurvePrefix + "" + (i + 1)] = this.createCurveFunction(module, curve);
    }
    extraVars[this.inputVariableName] = x;
    var result = getExpressionValue(this.valueExpression, module, extraVars);
    return result;
};


function OscillatorCurveComputation() {
    MultiInputCurveComputation.call(this);
    this.count = 1;
    this.curveIndices = [0];
    this.baseFrequency = 1.0;
    this.curveAmplitudes = [1.0];
    this.curveFrequencyMultipliers = [1.0];
    this.curvePhases = [0.0];
    this._constructorName = "OscillatorCurveComputation";
}

OscillatorCurveComputation.prototype = new MultiInputCurveComputation();

OscillatorCurveComputation.prototype.getValueReferencesOk = function(module, x) {
    var refs = this.theInputCurves;
    var result = 0.0;
    for (var i=0; i<this.count; i++) {
        var curveIndex = 0;
        if (this.curveIndices.length > 0) {
            curveIndex = this.curveIndices[i % this.curveIndices.length];
        }
        var freq = this.baseFrequency;
        var amp = 1.0;
        if (this.curveAmplitudes.length > 0) {
            amp = this.curveAmplitudes[i % this.curveAmplitudes.length];
        }
        var freqMult = 1.0;
        if (this.curveFrequencyMultipliers.length > 0) {
            freqMult = this.curveFrequencyMultipliers[i % this.curveFrequencyMultipliers.length];
        }
        var phase = 0.0;
        if (this.curvePhases.length > 0) {
            phase = this.curvePhases[i % this.curvePhases.length];
        }
        var curveValue = 0.0;
        if (refs.length > 0) {
            var curve = refs[curveIndex % refs.length];
            curveValue = this.getCurveOrConstantValue(module, freq * freqMult * (x + phase), curve, 0);
        } else {
            curveValue = Math.sin(freq * freqMult * Math.PI * 2 * (x + phase))
        }
        var value = amp * curveValue;
        result += value;
    }
    return result;
};

function AddCurveComputation() {
    MultiInputCurveComputation.call(this);
    this._constructorName = "AddCurveComputation";
}

AddCurveComputation.prototype = new MultiInputCurveComputation();

AddCurveComputation.prototype.getValueReferencesOk = function(module, x) {
    var refs = this.theInputCurves;
    var result = 0.0;
    for (var i=0; i<refs.length; i++) {
        var curve = refs[i];
        result += this.getCurveOrConstantValue(module, x, curve, 0);
    }
    return result;
};

function MultiplyCurveComputation() {
    MultiInputCurveComputation.call(this);
    this._constructorName = "MultiplyCurveComputation";
}

MultiplyCurveComputation.prototype = new MultiInputCurveComputation();

MultiplyCurveComputation.prototype.getValueReferencesOk = function(module, x) {
    var refs = this.theInputCurves;
    var result = 1.0;
    for (var i=0; i<refs.length; i++) {
        var curve = refs[i];
        result *= this.getCurveOrConstantValue(module, x, curve, 1);
    }
    return result;
};


function MinCurveComputation() {
    MultiInputCurveComputation.call(this);
    this._constructorName = "MinCurveComputation";
}

MinCurveComputation.prototype = new MultiInputCurveComputation();

MinCurveComputation.prototype.getValueReferencesOk = function(module, x) {
    var refs = this.theInputCurves;
    var result = null;
    for (var i=0; i<refs.length; i++) {
        var curve = refs[i];

        var temp = this.getCurveOrConstantValue(module, x, curve, 1);
        if (result === null) {
            result = temp;
        } else {
            result = Math.min(temp, result);
        }
    }
    return result === null ? 0 : result;
};


function MaxCurveComputation() {
    MultiInputCurveComputation.call(this);
    this._constructorName = "MaxCurveComputation";
}

MaxCurveComputation.prototype = new MultiInputCurveComputation();

MaxCurveComputation.prototype.getValueReferencesOk = function(module, x) {
    var refs = this.theInputCurves;
    var result = null;
    for (var i=0; i<refs.length; i++) {
        var curve = refs[i];

        var temp = this.getCurveOrConstantValue(module, x, curve, 1);
        if (result === null) {
            result = temp;
        } else {
            result = Math.max(temp, result);
        }
    }
    return result === null ? 0 : result;
};




function CurveGroup() {
    this.curves = [];
}

function CurveModifier() {
}


