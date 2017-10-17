
function VoiceLine() {
    this.id = "voiceLine";
    this.lineElements = [];
    this.modifiers = [];
    this._constructorName = "VoiceLine";
}

VoiceLine.prototype.add = function(e) {
    this.lineElements.push(e);
    return this;
};

VoiceLine.prototype.get = function(index) {
    return this.lineElements[index];
};

VoiceLine.prototype.getVoiceLineElements = function() {
    return this.lineElements;
};

VoiceLine.prototype.size = function() {
    return this.lineElements.length;
};
VoiceLine.prototype.getCount = function() {
    return this.lineElements.length;
};

VoiceLine.prototype.addVoiceLineElement = function(e) {
    this.lineElements.push(e);
    return this;
};

VoiceLine.prototype.toString = function() {
    return this.lineElements.toString();
};

VoiceLine.prototype.getSingleStepVoiceLineElements = function(harmony, module) {
    var result = [];
    var offset = 0;
    for (var i=0; i<this.lineElements.length; i++) {
        var le = this.lineElements[i];
        var singleSteps = le.getSingleStepVoiceLineElements(harmony, module, offset);
        addAll(result, singleSteps);
        offset += singleSteps.length;
    }
    return result;
};

function DoubledVoiceLine() {
    VoiceLine.call(this);
    this.octaves = 0;
    this.toDouble = "";
    this._constructorName = "DoubledVoiceLine";
}

DoubledVoiceLine.prototype = new VoiceLine();

DoubledVoiceLine.prototype.doubleVoiceLine = function(constantLines) {
    var toDouble = null;
    for (var i=0; i<constantLines.length; i++) {
        var line = constantLines[i];
        if (line.id == this.toDouble) {
            toDouble = line;
            break;
        }
    }
    if (toDouble) {
        // All elements must be constant or undefined
        var elements = toDouble.getVoiceLineElements();

        var result = [];

        for (var i=0; i<elements.length; i++) {
            result[i] = elements[i].copy();
        }
        return result;
    } else {
        logit("Could not find voice line " + this.toDouble + "<br />");
        return null;
    }
};


function SimpleBassVoiceLine() {
    VoiceLine.call(this);
    this.octaves = -1;
    this.startOctaves = [];
    this.endOctaves = [];
    this._constructorName = "SimpleBassVoiceLine";
}

SimpleBassVoiceLine.prototype = new VoiceLine();


SimpleBassVoiceLine.prototype.getSingleStepVoiceLineElements = function(harmony, module) {
    var result = [];
    for (var i=0; i<harmony.getCount(); i++) {
        var harmonyElement = harmony.get(i);
        var vle = new ConstantVoiceLineElement();

        var absNote = harmonyElement.getAbsoluteNoteFromChordBassIndex(0);

        var octave = getItemWithDefaultWithStartEndItems(this.octaves, harmony.getCount(), i,
            this.startOctaves, this.endOctaves);
        absNote += octave * 12;
        vle.index = harmonyElement.getScaleIndexAndChromaticOffsetForAbsoluteNote(absNote)[0];
        vle.indexType = IndexType.SCALE;
        vle.snapType = SnapType.CHORD;

        result.push(vle);
    }
    return result;
};



function getClassicalAdaptiveVoiceLineElements(harmony, module, length, harmonyOffset) {
}


// Creates a complete voice line
// For an alternative when not all must be adaptive, use ClassicalAdaptiveSequenceVoiceLineElement instead
function ClassicalAdaptiveVoiceLine() {
    VoiceLine.call(this);

    this.isUndefined = false;

    this.useHintCurve = false;
    this.hintCurve = "";
    this.hintCurveMultiplier = 1.0;
    this.hintCurveBias = 0.0;
    this.hintCurveSnapMetrics = SnapMetrics.ROUND;
    this.useHintCurveLengthFractionAmplitudeMultiplier = false;
    this.hintCurveReferenceCount = 8;
    this.hintCurveLengthFractionAmplitudeMultiplier = 0.5;

    this.hintIndices = [];
    this.hintIndexType = IndexType.SCALE;

    this.startHintIndices = [];
    this.endHintIndices = [];

    this.maxHintDistances = [12];
    this.startMaxHintDistances = [];
    this.endMaxHintDistances = [];
    this.penaltyMaxHintDistances = [3];
    this.startPenaltyMaxHintDistances = [];
    this.endPenaltyMaxHintDistances = [];
    this.hintDistanceOffsetType = OffsetType.HALF_STEP;



    this.chordRootPitchClassConstraints = [[]];
    this.chordBassPitchClassConstraints = [[]];

    this.suspendPattern = [0];
    this.startSuspendPattern = [];
    this.endSuspendPattern = [];
    this.suspendIndexRanges = []; // [[1, 3], [7, 8]] etc.
    this.suspendIndices = [];
    this.phraseSuspendPattern = [];
    this.startPhraseSuspendPattern = [];
    this.endPhraseSuspendPattern = [];


    this.anticipatePattern = [0];
    this.startAnticipatePattern = [];
    this.endAnticipatePattern = [];
    this.anticipateIndexRanges = []; // [[1, 3], [7, 8]] etc.
    this.anticipateIndices = [];

    // All of the start/end/chordpitch bla bla are int list 2ds such as [[]]
    this.startChordRootPitchClassConstraints = [];
    this.endChordRootPitchClassConstraints = [];

    this.startChordBassPitchClassConstraints = [];
    this.endChordBassPitchClassConstraints = [];

    this.maxSpacings = [24];
    this.startMaxSpacings = [];
    this.endMaxSpacings = [];
    this.penaltyMaxSpacings = [12];
    this.startPenaltyMaxSpacings = [];
    this.endPenaltyMaxSpacings = [];
    this.spacingOffsetType = OffsetType.HALF_STEP;

    this.ranges = [[30, 100]];
    this.startRanges = [];
    this.endRanges = [];
    this.penaltyRanges = [[30, 100]];
    this.startPenaltyRanges = [];
    this.endPenaltyRanges = [];
    this.rangeIndexType = IndexType.MIDI_NOTE;

    this.maxOverlaps = [0];
    this.overlapOffsetType = OffsetType.HALF_STEP;

    this.maxNoPenaltyLeaps = [12];
    this.leapOffsetType = OffsetType.HALF_STEP;

    // Insert penalties here...
    this._constructorName = "ClassicalAdaptiveVoiceLine";
}

ClassicalAdaptiveVoiceLine.prototype = new VoiceLine();

ClassicalAdaptiveVoiceLine.prototype.getSingleStepVoiceLineElements = function(harmony, module) {
    var result = [];

    var harmonyLength = harmony.getCount();

    var theCurve = null;

    var useHintCurve = getValueOrExpressionValue(this, "useHintCurve", module);

    if (useHintCurve) {
//        if (this.hintCurveExpression) {
//            logit(this._constructorName + " evaluating " + this.hintCurveExpression);
//        }

        var hintCurveId = getValueOrExpressionValue(this, "hintCurve", module);

//        logit("Generating with hint curve " + hintCurveId);
//        if (this.hintCurveExpression) {
//            logit(this._constructorName + " result: " + hintCurveId);
//        }
        theCurve = module.getCurve(hintCurveId);
        if (!theCurve) {
            logit(this._constructorName + " could not find curve " + hintCurveId + "<br />");
            theCurve = new PredefinedCurve();
        }
    }

    var hintCurveMultiplier = getValueOrExpressionValue(this, "hintCurveMultiplier", module);
    var hintCurveBias = getValueOrExpressionValue(this, "hintCurveBias", module);
    var hintIndices = getValueOrExpressionValue(this, "hintIndices", module);
    var startHintIndices = getValueOrExpressionValue(this, "startHintIndices", module);
    var endHintIndices = getValueOrExpressionValue(this, "endHintIndices", module);
    var suspendPattern = getValueOrExpressionValue(this, "suspendPattern", module);
    var startSuspendPattern = getValueOrExpressionValue(this, "startSuspendPattern", module);
    var endSuspendPattern = getValueOrExpressionValue(this, "endSuspendPattern", module);
    var phraseSuspendPattern = getValueOrExpressionValue(this, "phraseSuspendPattern", module);
    var startPhraseSuspendPattern = getValueOrExpressionValue(this, "startPhraseSuspendPattern", module);
    var endPhraseSuspendPattern = getValueOrExpressionValue(this, "endPhraseSuspendPattern", module);

    var chordBassPitchClassConstraints = getValueOrExpressionValue(this, "chordBassPitchClassConstraints", module);
    var startChordBassPitchClassConstraints = getValueOrExpressionValue(this, "startChordBassPitchClassConstraints", module);
    var endChordBassPitchClassConstraints = getValueOrExpressionValue(this, "endChordBassPitchClassConstraints", module);

    var useHintCurveLengthFractionAmplitudeMultiplier = getValueOrExpressionValue(this, "useHintCurveLengthFractionAmplitudeMultiplier", module);

    if (useHintCurveLengthFractionAmplitudeMultiplier) {
        var referenceFraction = harmonyLength / this.hintCurveReferenceCount;

        if (referenceFraction < 1) {
            // ax + b
            // a * 1 + b = 1
            // a * 0.5 + b = f
            // a = 1 - b
            // (1 - b) * 0.5 + b = f
            // 0.5 - 0.5b + b = f
            // 0.5 - 0.5b = f
            // b = -2f + 1
            //
            // (1 - b)x + b
            // (1 - 1 + 2f)x -2f + 1
            // 2fx - 2f + 1

            var ampMultiplier = Math.max(0, Math.min(1,
                2 * this.hintCurveLengthFractionAmplitudeMultiplier * referenceFraction -
                    2 * this.hintCurveLengthFractionAmplitudeMultiplier + 1));

//            logit("Amp multiplier " + ampMultiplier + " " + harmonyLength + " before: " + hintCurveMultiplier + " after: " + (hintCurveMultiplier * ampMultiplier));

            hintCurveMultiplier *= ampMultiplier;

        }

    }
    var fractionMultiplier = harmonyLength > 1 ? (1.0 / (harmonyLength - 1)) : 1.0;
    for (var i=0; i<harmonyLength; i++) {
        if (this.isUndefined) {
            var vle = new UndefinedVoiceLineElement();
            result.push(vle);
        } else {

            var vle = new ClassicalAdaptiveVoiceLineElement();

            var theHintIndex = null;

            var fraction = i * fractionMultiplier;
            if (theCurve) {
                var valueBeforeSnap = hintCurveBias + hintCurveMultiplier * theCurve.getValue(module, fraction);
                theHintIndex = SnapMetrics.snap(valueBeforeSnap, this.hintCurveSnapMetrics);
//                logit(i + " The hint index " + theHintIndex +  " for fraction " + fraction + " bias: " + hintCurveBias + " mult: " + hintCurveMultiplier);
            } else {
                theHintIndex = getItemFromArrayWithStartEndItems(theHintIndex, hintIndices, harmonyLength, i,
                    startHintIndices, endHintIndices);
            }

            var maxHintDistance = getItemFromArrayWithStartEndItems(6, this.maxHintDistances, harmonyLength, i,
                this.startMaxHintDistances, this.endMaxHintDistances);

            var penaltyMaxHintDistance = getItemFromArrayWithStartEndItems(3, this.penaltyMaxHintDistances, harmonyLength, i,
                this.startPenaltyMaxHintDistances, this.endPenaltyMaxHintDistances);

            var theChordBassConstraint = getItemFromArrayWithStartEndItems([], chordBassPitchClassConstraints, harmonyLength, i,
                startChordBassPitchClassConstraints, endChordBassPitchClassConstraints);

            var theChordRootConstraint = getItemFromArrayWithStartEndItems([], this.chordRootPitchClassConstraints, harmonyLength, i,
                this.startChordRootPitchClassConstraints, this.endChordRootPitchClassConstraints);

            var maxSpacing = getItemFromArrayWithStartEndItems([], this.maxSpacings, harmonyLength, i,
                this.startMaxSpacings, this.endMaxSpacings);

            var penaltyMaxSpacing = getItemFromArrayWithStartEndItems([], this.penaltyMaxSpacings, harmonyLength, i,
                this.startPenaltyMaxSpacings, this.endPenaltyMaxSpacings);

            var suspend = getItemFromArrayWithStartEndItems(0, suspendPattern, harmonyLength, i,
                startSuspendPattern, endSuspendPattern);

            var anticipate = getItemFromArrayWithStartEndItems(0, this.anticipatePattern, harmonyLength, i,
                this.startAnticipatePattern, this.endAnticipatePattern);

            var range = getItemFromArrayWithStartEndItems(0, this.ranges, harmonyLength, i,
                this.startRanges, this.endRanges);
            var penaltyRange = getItemFromArrayWithStartEndItems(0, this.penaltyRanges, harmonyLength, i,
                this.startPenaltyRanges, this.endPenaltyRanges);

            //        logit("Setting chord bass constraint to " + theChordBassConstraint + " default: " + [] +
            //            " items: " + this.chordBassPitchClassConstraints +
            //            " start: " + this.startChordBassPitchClassConstraints +
            //            " end: " + this.endChordBassPitchClassConstraints +
            //            "<br />");
            vle.suspend = !!suspend;
            vle.anticipate = !!anticipate;
            vle.chordBassPitchClassConstraint = theChordBassConstraint;
            vle.chordRootPitchClassConstraint = theChordRootConstraint;
            vle.hintIndex = theHintIndex;
            vle.hintIndexType = this.hintIndexType;
            vle.maxHintDistance = maxHintDistance;
            vle.penaltyMaxHintDistance = penaltyMaxHintDistance;
            vle.maxSpacing = maxSpacing;
            vle.penaltyMaxSpacing = penaltyMaxSpacing;
            vle.spacingOffsetType = this.spacingOffsetType;
            vle.range = range;
            vle.penaltyRange = penaltyRange;

            result.push(vle);
        }
    }


    if (!this.isUndefined) {
        if (phraseSuspendPattern.length > 0 || startPhraseSuspendPattern.length > 0 || endPhraseSuspendPattern.length > 0) {
            var phraseRanges = harmony.getPhraseRanges();
            for (var i=0; i<phraseRanges.length; i++) {
                var phraseRange = phraseRanges[i];


                suspendPattern = [];
                if (phraseSuspendPattern.length > 0) {
                    suspendPattern = phraseSuspendPattern[i % phraseSuspendPattern.length];
                }
                startSuspendPattern = [];
                if (startPhraseSuspendPattern.length > 0) {
                    startSuspendPattern = startPhraseSuspendPattern[i % startPhraseSuspendPattern.length];
                }
                endSuspendPattern = [];
                if (endPhraseSuspendPattern.length > 0) {
                    endSuspendPattern = endPhraseSuspendPattern[i % endPhraseSuspendPattern.length];
                }

//            logit("Suspend stuff " + i + " " + [JSON.stringify(suspendPattern), JSON.stringify(startSuspendPattern), JSON.stringify(endSuspendPattern)].join(";;;") + "<br />");

                for (var j=phraseRange[0]; j<=phraseRange[1]; j++) {
                    var phraseIndex = j - phraseRange[0];
                    var suspend = getItemFromArrayWithStartEndItems(0, suspendPattern, phraseRange[1] - phraseRange[0] + 1, phraseIndex,
                        startSuspendPattern, endSuspendPattern);
                    var vle = result[j];
                    vle.suspend = !!suspend;
//                if (vle.suspend) {
//                    logit("Setting suspend for index " + j + "<br />");
//                }
                }
            }
        }
    }
    return result;
};


// Only allows ConstantVoiceLineElements and elements that directly create ConstantVoiceLineElements
function ConstantVoiceLine() {
    VoiceLine.call(this);
    this._constructorName = "ConstantVoiceLine";
}

ConstantVoiceLine.prototype = new VoiceLine();


ConstantVoiceLine.prototype.toString = function(options) {
    var result = "[";
    for (var i=0; i<this.lineElements.length; i++) {
        var e = this.lineElements[i];
        result += e.index;
        var innerStrs = [];
        if (options && options.showAbsoluteNote && options.harmony) {
            var he = options.harmony.get(i);
            var absNote = he.getAbsoluteNoteConstantVoiceLineElement(e);
            innerStrs.push("abs: " + absNote);
        }
        if (innerStrs.length > 0) {
            result += " (" + innerStrs + ")";
        }
        if (i < this.lineElements.length - 1) {
            result += ", ";
        }
    }
    result += "]";
    return result;
};

var HarmonyStepLengthType = {
    HARMONY_STEPS: 0,
    HARMONY_LENGTH_PLUS_STEPS: 1,

    toString: function(type) {
        switch (type) {
            case HarmonyStepLengthType.HARMONY_STEPS:
                return "Harmony steps";
            case HarmonyStepLengthType.HARMONY_LENGTH_PLUS_STEPS:
                return "Harmony steps plus harmony length";
        }
        return "Unknown step length type " + type;
    },
    getStepLength: function(harmony, type, length) {
        switch (type) {
            case HarmonyStepLengthType.HARMONY_STEPS:
                return length;
            case HarmonyStepLengthType.HARMONY_LENGTH_PLUS_STEPS:
                return harmony.getCount() + length;
        }
        return length;
    }
};
addPossibleValuesFunction(HarmonyStepLengthType, HarmonyStepLengthType.HARMONY_STEPS, HarmonyStepLengthType.HARMONY_LENGTH_PLUS_STEPS);


function VoiceLineElement() {
    this.id = "";
    this.length = 1;
    this.lengthType = HarmonyStepLengthType.HARMONY_STEPS;
    this.modifiers = [];
    this._constructorName = "VoiceLineElement";
}

VoiceLineElement.prototype.getLength = function(harmony) {
    return HarmonyStepLengthType.getStepLength(harmony, this.lengthType, this.length);
};

VoiceLineElement.prototype.getSingleStepVoiceLineElements = function(harmony, module, harmonyOffset) {
    if (this instanceof SingleStepVoiceLineElement) {
        return [this];
    } else {
        logit("Missing getSingleStepVoiceLineElements() for non-SingleStepVoiceLineElement <br />");
        return null;
    }
};


function ConstantSequenceVoiceLineElement() {
    VoiceLineElement.call(this);
    this.indexBorderMode = IndexBorderMode.RESTART;
    this.octaves = [0];
    this.indices = [0];
    this.indexType = IndexType.SCALE;
    this.snapType = SnapType.CHORD;
    this._constructorName = "ConstantSequenceVoiceLineElement";
}

ConstantSequenceVoiceLineElement.prototype = new VoiceLineElement();

//function ClassicalAdaptiveSequenceVoiceLineElement() {
//    VoiceLineElement.call(this);
//
//    addClassicalAdaptiveVoiceLineProperties.call(this);
//
//    this._constructorName = "ClassicalAdaptiveSequenceVoiceLineElement";
//}
//
//ClassicalAdaptiveSequenceVoiceLineElement.prototype = new VoiceLineElement();
//
//ClassicalAdaptiveSequenceVoiceLineElement.prototype.getSingleStepVoiceLineElements = function(harmony, module, harmonyOffset) {
//    return getClassicalAdaptiveVoiceLineElements.call(this, harmony, module, this.getLength(harmony), harmonyOffset);
//};

function SingleStepVoiceLineElement() {
    VoiceLineElement.call(this);
    this.suspend = false;
    this.anticipate = false;
    this._constructorName = "SingleStepVoiceLineElement";
}

SingleStepVoiceLineElement.prototype = new VoiceLineElement();

SingleStepVoiceLineElement.prototype.getSingleStepVoiceLineElements = function(harmony, module, harmonyOffset) {
    return [this];
};


function UndefinedVoiceLineElement() {
    SingleStepVoiceLineElement.call(this);
    this._constructorName = "UndefinedVoiceLineElement";
}

UndefinedVoiceLineElement.prototype = new SingleStepVoiceLineElement();


function ConstantVoiceLineElement() {
    SingleStepVoiceLineElement.call(this);
    this.octaves = 0;
    this.index = 0;
    this.indexType = IndexType.SCALE;
    this.snapType = SnapType.CHORD;
    this._constructorName = "ConstantVoiceLineElement";
}

ConstantVoiceLineElement.prototype = new SingleStepVoiceLineElement();



ConstantVoiceLineElement.prototype.setIndex = function(index) {
    this.index = index;
    return this;
};

ConstantVoiceLineElement.prototype.setOctaves = function(octaves) {
    this.octaves = octaves;
    return this;
};

ConstantVoiceLineElement.prototype.setIndexType = function(indexType) {
    this.indexType = indexType;
    return this;
};

ConstantVoiceLineElement.prototype.setSnapType = function(snapType) {
    this.snapType = snapType;
    return this;
};


function AdaptiveVoiceLineElement() {
    SingleStepVoiceLineElement.call(this);
}

AdaptiveVoiceLineElement.prototype = new SingleStepVoiceLineElement();


function ClassicalAdaptiveVoiceLineElement(options) {
    AdaptiveVoiceLineElement.call(this, options);

    this.hintIndex = 0;
    this.hintIndexType = IndexType.SCALE;
    this.maxHintDistance = 6;
    this.penaltyMaxHintDistance = 3;
    this.hintDistanceOffsetType = OffsetType.HALF_STEP;
    this.chordRootPitchClassConstraint = [];
    this.chordBassPitchClassConstraint = [];

    this.maxOverlap = 0;
    this.overlapOffsetType = OffsetType.HALF_STEP;

    this.maxSpacing = 24;
    this.penaltyMaxSpacing = 12;
    this.spacingOffsetType = OffsetType.HALF_STEP;

    this.maxNoPenaltyLeap = 12;
    this.leapOffsetType = OffsetType.HALF_STEP;

    this.range = [30, 100];
    this.penaltyRange = [30, 100];
    this.rangeIndexType = IndexType.MIDI_NOTE;

    // Insert penalties here...

    this._constructorName = "ClassicalAdaptiveVoiceLineElement";
}


ClassicalAdaptiveVoiceLineElement.prototype = new AdaptiveVoiceLineElement();

