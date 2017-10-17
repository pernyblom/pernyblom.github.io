
function Rythm() {
    this.id = "";
    this.rythmElements = [];
    this._constructorName = "Rythm";
}

Rythm.prototype.addRythmElement = function(e) {
    this.rythmElements.push(e);
    return this;
};

Rythm.prototype.getRythmElements = function() {
    return this.rythmElements;
};


Rythm.prototype.getNoteRythmElements = function(module, harmony, harmonyBeatOffset) {
    var result = [];
    for (var i=0; i<this.rythmElements.length; i++) {
        var re = this.rythmElements[i];
        addAll(result, re.getNoteRythmElements(module, harmony, harmonyBeatOffset));
    }
    return result;
};


function RythmElement() {
    this.id = "";
    this.length = 1.0;
    this.lengthUnit = PositionUnit.BEATS;
    this.strength = 1.0;
    this._constructorName = "RythmElement";
}

// Must be Note rythm elements as result...
RythmElement.prototype.getNoteRythmElements = function(module, harmony, harmonyBeatOffset) {
    if (this instanceof NoteRythmElement) {
        return [this];
    } else {
        logit("RythmElements that are not NoteRythmElements must implement getNoteRythmElements()<br />");
    }
};


RythmElement.prototype.copy = function() {
    return copyObjectDeep(this);
};

RythmElement.prototype.setLength = function(length) {
    this.length = length;
    return this;
};

RythmElement.prototype.setLengthUnit = function(lengthUnit) {
    this.lengthUnit = lengthUnit;
    return this;
};

RythmElement.prototype.getLength = function() {
    return this.length;
};

RythmElement.prototype.getLengthUnit = function() {
    return this.lengthUnit;
};

var NoteRythmElementLengthType = {
    NORMAL: 0,
    DOT: 1,
    TRIPLET: 2,

    toString: function(type) {
        switch (type) {
            case NoteRythmElementLengthType.NORMAL:
                return "Normal";
            case NoteRythmElementLengthType.DOT:
                return "Dotted";
            case NoteRythmElementLengthType.TRIPLET:
                return "Triplet";
        }
        return "Unknown type " + type;
    },

    possibleValues: null,
    getPossibleValues: function() {
        if (!NoteRythmElementLengthType.possibleValues) {
            NoteRythmElementLengthType.possibleValues = [];
            for (var i=NoteRythmElementLengthType.NORMAL; i<=NoteRythmElementLengthType.TRIPLET; i++) {
                NoteRythmElementLengthType.possibleValues.push(i);
            }
        }
        return NoteRythmElementLengthType.possibleValues;
    }
};


function NoteRythmElement() {
    RythmElement.call(this);
    this.rest = false;
    this.lengthType = NoteRythmElementLengthType.NORMAL; // Used for splitting and certainly other things later
    this._constructorName = "NoteRythmElement";
}


NoteRythmElement.prototype = new RythmElement();

NoteRythmElement.prototype.setLengthType = function(type) {
    this.lengthType = type;
    return this;
};


NoteRythmElement.prototype.toString = function() {
    return "NRE{" +
        "length: " + this.length +
        " lengthUnit: " + this.lengthUnit +
        " strength: " + this.strength +
        " rest: " + this.rest +
        " lengthType: " + this.lengthType +
        "}";
};



function SequenceRythmElement() {
    RythmElement.call(this);

    this.elementLengths = [1];
    this.elementLengthUnit = PositionUnit.BEATS;
    this.elementLengthBorderMode = IndexBorderMode.RESTART;

    this.elementStrengths = [1.0];
    this.elementStrengthBorderMode = IndexBorderMode.RESTART;

    this.restPattern = [0];
    this.restPatternBorderMode = IndexBorderMode.RESTART;

    this.cutLast = true;

    this.minElementLength = 0;
    this.minElementLengthUnit = PositionUnit.BEATS;
    this._constructorName = "SequenceRythmElement";

}

SequenceRythmElement.prototype = new RythmElement();


SequenceRythmElement.prototype.getNoteRythmElements = function(module, harmony, harmonyBeatOffset) {

    var result = [];

    if (this.elementLengths.length == 0) {
        return result;
    }

    var harmonyElement = harmony.getHarmonyAt(harmonyBeatOffset);

    var totalLength = positionUnitToBeats2(this.length, this.lengthUnit, harmonyBeatOffset, harmony);

    var minBeatLength = positionUnitToBeats2(this.minElementLength, harmonyBeatOffset, harmony);

    var index = 0;
    var currentPosition = 0;
    while (currentPosition < totalLength) {
        var realElementIndex = IndexBorderMode.getIndex(this.elementLengthBorderMode, this.elementLengths.length, index);
        if (realElementIndex == -1) {
            break;
        }
        var elementLength = this.elementLengths[realElementIndex];
        var beatLength = positionUnitToBeats(elementLength, this.elementLengthUnit,
            harmonyElement.tsNumerator, harmonyElement.tsDenominator, harmony);

        var rest = false;
        if (this.restPattern.length > 0) {
            var realRestIndex = IndexBorderMode.getIndex(this.restPatternBorderMode, this.restPattern.length, index);
            if (realRestIndex >= 0) {
                rest = this.restPattern[realRestIndex] != 0;
            }
        }

        var isLast = false;
        if (currentPosition + beatLength > totalLength) {
            // cut or stop
            isLast = true;
            if (this.cutLast) {
                beatLength = totalLength - currentPosition;
            } else {
                rest = true;
            }
        }
        if (!isLast || beatLength >= minBeatLength) {
            var rythmElement = new NoteRythmElement().setLength(beatLength).setLengthUnit(PositionUnit.BEATS);
            rythmElement.rest = rest;
            result.push(rythmElement);
        }

        if (isLast) {
            break;
        }
        index++;
        currentPosition += beatLength;
    }
    return result;
};

function SplitRythmElement() {
    RythmElement.call(this);
    this.autoDetectLengthType = true;
    this.startLengthType = NoteRythmElementLengthType.NORMAL; // When auto detect is off
    this.noteCount = 4;
    this.noteCountUnit = CountUnit.PLAIN;
    this.extraNoteCount = 0;
    this.extraNoteCountUnit = CountUnit.PLAIN;
    this.densityCurve = "";
    this.densityCurveAmplitude = 1.0;
    this.densityCurveBias = 0.0;
    this.densityCurveFrequency = 1.0;
    this.densityCurvePhase = 0.0;
    this.minLength = 0.25;
    this.minLengthUnit = PositionUnit.BEATS;
    this.splitZoneCollection = new SplitZoneCollection();
    this._constructorName = "SplitRythmElement";
}

SplitRythmElement.prototype = new RythmElement();


SplitRythmElement.prototype.addSplitZone = function(zone) {
    this.splitZoneCollection.addSplitZone(zone);
    return this;
};

SplitRythmElement.prototype.getNoteRythmElements = function(module, harmony, harmonyBeatOffset) {

    var theNoteCount = getValueOrExpressionValue(this, "noteCount", module);
    var theExtraNoteCount = getValueOrExpressionValue(this, "extraNoteCount", module);
    var startLengthType = getValueOrExpressionValue(this, "startLengthType", module);
    var length = getValueOrExpressionValue(this, "length", module);


    theNoteCount = CountUnit.getCount(theNoteCount, this.noteCountUnit, harmony, harmonyBeatOffset);
    theNoteCount += CountUnit.getCount(theExtraNoteCount, this.extraNoteCountUnit, harmony, harmonyBeatOffset);

    theNoteCount = Math.round(theNoteCount);
    // logit("the note counte: " + theNoteCount + "<br />");

    var harmonyElement = harmony.getHarmonyAt(harmonyBeatOffset);
    var szc = this.splitZoneCollection;
    szc.minLength = this.minLength;
    szc.minLengthUnit = this.minLengthUnit;

    var beatLength = positionUnitToBeats2(length, this.lengthUnit, harmonyBeatOffset, harmony);

    var startElement = new NoteRythmElement().setLength(beatLength).setLengthUnit(PositionUnit.BEATS);


    if (this.autoDetectLengthType) {
        // Try to detect the length type
        var possibleLengthTypes =
            [NoteRythmElementLengthType.NORMAL, NoteRythmElementLengthType.DOT, NoteRythmElementLengthType.TRIPLET];

        var closestDistance = 9999999;
        var closestIndex = 0;
        var possibleLengthFractions = [1, 1.5, 1.0/3.0];
        for (var i=0; i<possibleLengthFractions.length; i++) {
            var targetFraction = possibleLengthFractions[i];
            var currentFraction = beatLength;
            var theDistance = Math.abs(currentFraction - targetFraction);
            if (theDistance < closestDistance) {
                closestDistance = theDistance;
                closestIndex = i;
            }
            while (currentFraction < targetFraction) {
                currentFraction *= 2;
                var theDistance = Math.abs(currentFraction - targetFraction);
                if (theDistance < closestDistance) {
                    closestDistance = theDistance;
                    closestIndex = i;
                }
            }
            while (currentFraction > targetFraction) {
                currentFraction /= 2;
                var theDistance = Math.abs(currentFraction - targetFraction);
                if (theDistance < closestDistance) {
                    closestDistance = theDistance;
                    closestIndex = i;
                }
            }
        }
//        logit("Detected length type: " + NoteRythmElementLengthType.toString(possibleLengthTypes[closestIndex]) + " from " + beatLength);
        startElement.lengthType = possibleLengthTypes[closestIndex];
    } else {
        startElement.lengthType = startLengthType;
    }
    //    logit("Setting lengthType to " + NoteRythmElementLengthType.toString(startElement.lengthType));

    var theCurve = module.getCurve(this.densityCurve);
    if (theCurve == null) {
        logit("Could not find curve " + this.densityCurve + "<br />");
        theCurve = {
            getValue: function(m, x) {
                return 0;
            }
        };
    } else {
        var originalCurve = theCurve;
        var that = this;
        theCurve = {
            getValue: function(m, x) {
                return that.densityCurveBias +
                    that.densityCurveAmplitude * originalCurve.getValue(m,
                        that.densityCurveFrequency * (x + that.densityCurvePhase));
            }
        }
    }

    var rythmElements = szc.getSplitBeat(module, [startElement], theNoteCount, theCurve, harmonyElement.tsNumerator, harmonyElement.tsDenominator);

//    if (this.verbose) {
//        var beatLengths = [];
//        for (var i=0; i<rythmElements.length; i++) {
//            var e = rythmElements[i];
//            beatLengths[i] = positionUnitToBeats(e.length, e.lengthUnit, harmonyElement.tsNumerator, harmonyElement.tsDenominator);
//        }
//        logit("beat length " + beatLength + " resulted in " + beatLengths.join(", ") + " treated as " + NoteRythmElementLengthType.toString(startElement.lengthType));
//        logit("  " + harmonyElement.tsNumerator);
//    }

//    logit(JSON.stringify(rythmElements));

    return rythmElements;
};

SplitRythmElement.prototype.setNoteCount = function(c) {
    this.noteCount = c;
    return this;
};
SplitRythmElement.prototype.setNoteCountUnit = function(c) {
    this.noteCountUnit = c;
    return this;
};
SplitRythmElement.prototype.setExtraNoteCount = function(c) {
    this.extraNoteCount = c;
    return this;
};
SplitRythmElement.prototype.setExtraNoteCountUnit = function(c) {
    this.extraNoteCountUnit = c;
    return this;
};

SplitRythmElement.prototype.setDensityCurve = function(c) {
    this.densityCurve = c;
    return this;
};


