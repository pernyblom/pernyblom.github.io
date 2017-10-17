

function AbstractVoiceLinePlannerConstraintZone() {
    this.id = "";

    this.addInstanceDuplicates = false;
    this.addClassDuplicates = false;
    this._constructorName = "AbstractVoiceLinePlannerConstraintZone";
}

AbstractVoiceLinePlannerConstraintZone.prototype.applyZone = function(harmony, resultConstraints) {
};

function IndexedVoiceLinePlannerConstraintZone() {
    AbstractVoiceLinePlannerConstraintZone.call(this);

    // Adds constraints for all steps
    this.globalIndices = [];

    // Patterns for harmony index
    this.indexPattern = [];
    this.startIndexPattern = [];
    this.endIndexPattern = [];

    // Patterns for phrases
    this.phraseIndexPattern = [];
    this.startPhraseIndexPattern = [];
    this.endPhraseIndexPattern = [];

    // Index ranges
    this.indexRanges = [];

    // Adds constraints for specific indices (pairs of [index, constraint index])
    this.indexConstraintIndices = [];

    // List of all constraints that are indexed
    this.constraints = [];
    this._constructorName = "IndexedVoiceLinePlannerConstraintZone";
}

IndexedVoiceLinePlannerConstraintZone.prototype = new AbstractVoiceLinePlannerConstraintZone();

IndexedVoiceLinePlannerConstraintZone.prototype.checkAndAddConstraint = function(cIndex, result, hIndex) {
    var c = this.constraints[cIndex % this.constraints.length];
    if (c instanceof EmptyVoiceLinePlannerConstraint) {
        return;
    }
    var arr = result[hIndex];
    if (!arr) {
        arr = [];
        result[hIndex] = arr;
    }
    if ((this.addInstanceDuplicates || !arrayContainsExactly(arr, c)) &&
        (this.addClassDuplicates || !arrayContainsSameProperty(arr, "_constructorName", c._constructorName))) {
        arr.push(c);
    }
};

// Adds constraints
IndexedVoiceLinePlannerConstraintZone.prototype.applyZone = function(harmony, resultConstraints) {
    var constraintCount = this.constraints.length;
    if (constraintCount > 0) {
        var harmonyCount = harmony.getCount();

        for (var i=0; i<this.globalIndices.length; i++) {
            var cIndex = this.globalIndices[i];
            for (var j=0; j<harmonyCount; j++) {
                this.checkAndAddConstraint(cIndex, resultConstraints, j)
            }
        }
        if (this.indexPattern.length > 0) {
            for (var i=0; i<harmonyCount; i++) {
                var cIndex = getItemFromArrayWithStartEndItems(0, this.indexPattern, harmonyCount, i, this.startIndexPattern, this.endIndexPattern);
                this.checkAndAddConstraint(cIndex, resultConstraints, i);
            }
        }
    }
};


// The steps this constraint checks backward for costs and validity.
// Not used during the planning phase, just the init phase.
VoiceLinePlannerConstraint.prototype.getCheckCostSteps = function() {
    //    return [0, 1, 2];
    return [];
};
VoiceLinePlannerConstraint.prototype.getCheckValidSteps = function() {
    //    return [0, 1, 2];
    return [];
};

VoiceLinePlannerConstraint.prototype.zeroStepCost = function(harmonyIndex, stateIndex, planner) {
    return 0;
};
VoiceLinePlannerConstraint.prototype.oneStepCost = function(harmonyIndex, prevStateIndex, stateIndex, planner) {
    return 0;
};
VoiceLinePlannerConstraint.prototype.twoStepCost = function(harmonyIndex, prevPrevStateIndex, prevStateIndex, stateIndex, planner) {
    return 0;
};
VoiceLinePlannerConstraint.prototype.zeroStepValid = function(harmonyIndex, stateIndex, planner) {
    return true;
};
VoiceLinePlannerConstraint.prototype.oneStepValid = function(harmonyIndex, prevStateIndex, stateIndex, planner) {
    return true;
};
VoiceLinePlannerConstraint.prototype.twoStepValid = function(harmonyIndex, prevPrevStateIndex, prevStateIndex, stateIndex, planner) {
    return true;
};



EmptyVoiceLinePlannerConstraint.prototype.getCheckCostSteps = function() {
    return [];
};
EmptyVoiceLinePlannerConstraint.prototype.getCheckValidSteps = function() {
    return [];
};


var SuspendVoiceLinePlannerConstraintMode = {
    PITCH_CLASSES: 0
};

function SuspendVoiceLinePlannerConstraint() {
    VoiceLinePlannerConstraint.call(this);
    this.mode = SuspendVoiceLinePlannerConstraintMode.PITCH_CLASSES;

    this.suspendPitchClassPairs = []; // [fromPc, toPc]


    this.onPattern = [1];

    this.penalties = [1];
    this._constructorName = "SuspendVoiceLinePlannerConstraint";
}
SuspendVoiceLinePlannerConstraint.prototype = new VoiceLinePlannerConstraint();

SuspendVoiceLinePlannerConstraint.prototype.getCheckCostSteps = function() {
    return [1];
};

SuspendVoiceLinePlannerConstraint.prototype.oneStepCost = function(harmonyIndex, prevStateIndex, stateIndex, planner) {
    var stepCost = 0;

    var absNotes = planner.possibleAbsoluteNoteTuples[harmonyIndex][stateIndex];
//    var chordPitchClasses = planner.chordPitchClassesArr[harmonyIndex];
    var prevAbsNotes = planner.possibleAbsoluteNoteTuples[harmonyIndex-1][prevStateIndex];
//    var prevChordPitchClasses = planner.chordPitchClassesArr[harmonyIndex-1];


    for (var j=0; j<this.suspendPitchClassPairs.length; j++) {
        var pair = this.suspendPitchClassPairs[j];
        var penalty = this.penalties[j % this.penalties.length];

        var found = false;
        for (var i=0; i<absNotes.length; i++) {
            if (this.onPattern[i % this.onPattern.length] == 1) {
                var fromAbs = prevAbsNotes[i];
                var fromPc = fromAbs % 12;
                var toAbs = absNotes[i];
                var toPc = toAbs % 12;
                if (pair[0] == fromPc && pair[1] == toPc) {
                    // Should be resolved correctly
                    found = true;
                    if (fromAbs <= toAbs || fromAbs - toAbs > 2) {
                        stepCost += penalty;
                    }
                }
            }
        }
        if (!found) {
            stepCost += penalty;
        }
    }

//    if (this.suspendPitchClassPairs.length > 0 && stepCost == 0) {
//        logit("succeeded!!!");
//
//    }

    return stepCost;
};



MinVoiceLinePlannerConstraint.prototype.getCheckCostSteps = function() {
    var result = [];
    for (var i=0; i<this.constraints.length; i++) {
        var c = this.constraints[i];
        var steps = c.getCheckCostSteps();
        for (var j=0; j<steps.length; j++) {
            if (!arrayContains(result, steps[j])) {
                result.push(steps[j]);
            }
        }
    }
    return result;
};

MinVoiceLinePlannerConstraint.prototype.zeroStepCost = function(harmonyIndex, stateIndex, planner) {
    if (this.constraints.length == 0) {
        return 0;
    }
    var result = 99999999;
    for (var i=0; i<this.constraints.length; i++) {
        var c = this.constraints[i];
        result = Math.min(result, c.zeroStepCost(harmonyIndex, stateIndex, planner));
    }
    return result;
};
MinVoiceLinePlannerConstraint.prototype.oneStepCost = function(harmonyIndex, prevStateIndex, stateIndex, planner) {
    if (this.constraints.length == 0) {
        return 0;
    }
    var result = 99999999;
    for (var i=0; i<this.constraints.length; i++) {
        var c = this.constraints[i];
        result = Math.min(result, c.oneStepCost(harmonyIndex, prevStateIndex, stateIndex, planner));
    }
    return result;
};
MinVoiceLinePlannerConstraint.prototype.twoStepCost = function(harmonyIndex, prevPrevStateIndex, prevStateIndex, stateIndex, planner) {
    if (this.constraints.length == 0) {
        return 0;
    }
    var result = 99999999;
    for (var i=0; i<this.constraints.length; i++) {
        var c = this.constraints[i];
        result = Math.min(result, c.twoStepCost(harmonyIndex, prevPrevStateIndex, prevStateIndex, stateIndex, planner));
    }
    return result;
};


function PitchClassStepVoiceLinePlannerConstraint() {
    VoiceLinePlannerConstraint.call(this);
    this.fromPitchClass = 0;
    this.toPitchClass = 0;
    this.sameRegister = true;

    this.penalty = 2;
    this.missingPenalty = 3;

    this.progressionCount = 1; // This is stupid, always gives parallel octaves if set higher than 1
    this._constructorName = "PitchClassStepVoiceLinePlannerConstraint";

}
PitchClassStepVoiceLinePlannerConstraint.prototype = new VoiceLinePlannerConstraint();

PitchClassStepVoiceLinePlannerConstraint.prototype.getCheckCostSteps = function() {
    return [1];
};

PitchClassStepVoiceLinePlannerConstraint.prototype.oneStepCost = function(harmonyIndex, prevStateIndex, stateIndex, planner) {
    var stepCost = 0;

    var absNotes = planner.possibleAbsoluteNoteTuples[harmonyIndex][stateIndex];
    var prevAbsNotes = planner.possibleAbsoluteNoteTuples[harmonyIndex-1][prevStateIndex];

    var chordPitchClasses = planner.chordPitchClassesArr[harmonyIndex];
    var prevChordPitchClasses = planner.chordPitchClassesArr[harmonyIndex-1];

    if (!arrayContains(prevChordPitchClasses, this.fromPitchClass) ||
        !arrayContains(chordPitchClasses, this.toPitchClass)) {
        return this.missingPenalty;
//        logit(this._constructorName + " should not be used when it can't be fulfilled " + this.id);
//        logit("  " + this.fromPitchClass + " -> " + this.toPitchClass + "  " + prevChordPitchClasses.join(", ") + " -> " + chordPitchClasses.join(", "));
    }

    var possibleCount = 0;
    var okCount = 0;
    for (var i=0; i<absNotes.length; i++) {
        var absNote = absNotes[i];
        var prevAbsNote = prevAbsNotes[i];

        var pc = absNote % 12;
        var prevPc = prevAbsNote % 12;

        if (prevPc == this.fromPitchClass) {
            possibleCount++;
        }

        if (prevPc == this.fromPitchClass && pc == this.toPitchClass &&
            (!this.sameRegister || Math.abs(absNote - prevAbsNote) <= 6)) {
            okCount++;
        }
    }
    if (possibleCount == 0) {
        // missing the pitch class
        stepCost += this.missingPenalty;
    }

    var mustCount = Math.min(possibleCount, this.progressionCount);
    if (okCount >= mustCount) {
//        logit(this._constructorName + " made it!");
    } else {
        stepCost += this.penalty * (mustCount - okCount);
    }

    return stepCost;
};


function PitchClassLeapRangeVoiceLinePlannerConstraint() {
    VoiceLinePlannerConstraint.call(this);

    this.pitchClass = 0;

    this.enterRange = [-1, 1]; // [lower, upper]
    this.leaveRange = [-1, 1]; // [lower, upper]

    this.enterPenaltyFactor = 0.0;
    this.leavePenaltyFactor = 0.0;

    this.enterNotFoundPenalty = 0;
    this.leaveNotFoundPenalty = 0;

    this.enterDoublingPenalty = 0;
    this.leaveDoublingPenalty = 0;
    this._constructorName = "PitchClassLeapRangeVoiceLinePlannerConstraint";
}
PitchClassLeapRangeVoiceLinePlannerConstraint.prototype = new VoiceLinePlannerConstraint();


PitchClassLeapRangeVoiceLinePlannerConstraint.prototype.getCheckCostSteps = function() {
    return [1];
};

PitchClassLeapRangeVoiceLinePlannerConstraint.prototype.oneStepCost = function(harmonyIndex, prevStateIndex, stateIndex, planner) {
    var stepCost = 0;

    var absNotes = planner.possibleAbsoluteNoteTuples[harmonyIndex][stateIndex];
    var prevAbsNotes = planner.possibleAbsoluteNoteTuples[harmonyIndex-1][prevStateIndex];

    var enterFound = false;
    var leaveFound = false;

    function getCostCount(range, fromAbs, toAbs) {
        var count = 0;
        var diff = toAbs - fromAbs;
        if (diff > range[1]) {
            count = diff - range[1];
        } else if (diff < range[0]) {
            count = range[0] - diff;
        }
        return count;
    }

    var leaveFrom = 0;
    var leaveTo = 0;
    var enterFrom = 0;
    var enterTo = 0;

    for (var i=0; i<absNotes.length; i++) {
        var fromAbs = prevAbsNotes[i];
        var fromPc = fromAbs % 12;
        var toAbs = absNotes[i];
        var toPc = toAbs % 12;
        if (this.pitchClass == toPc) {
            // Checking enter stuff
            if (enterFound) {
                stepCost += this.enterDoublingPenalty;
            }
            enterFound = true;
            stepCost += getCostCount(this.enterRange, fromAbs, toAbs) * this.enterPenaltyFactor;
            enterFrom = fromAbs;
            enterTo = toAbs;
        }
        if (this.pitchClass == fromPc) {
            // Checking leave stuff
            if (leaveFound) {
                stepCost += this.leaveDoublingPenalty;
            }
            leaveFound = true;
            stepCost += getCostCount(this.leaveRange, fromAbs, toAbs) * this.leavePenaltyFactor;
            leaveFrom = fromAbs;
            leaveTo = toAbs;
        }
    }
    if (!enterFound) {
        stepCost += this.enterNotFoundPenalty;
    }
    if (!leaveFound) {
        stepCost += this.leaveNotFoundPenalty;
    }

//    if (stepCost == 0 && this.leavePenaltyFactor > 0.0) {
//        logit(this._constructorName + " zero cost " + leaveFrom + " -> " + leaveTo);
//    }

    return stepCost;
};




function LeapRangeVoiceLinePlannerConstraint() {
    VoiceLinePlannerConstraint.call(this);

    this.voiceIndices = [0, 1, 2, 3];

    this.range = [-1, 1]; // [lower, upper]

    this.penaltyFactor = 0.0;

    this._constructorName = "LeapRangeVoiceLinePlannerConstraint";
}
LeapRangeVoiceLinePlannerConstraint.prototype = new VoiceLinePlannerConstraint();


LeapRangeVoiceLinePlannerConstraint.prototype.getCheckCostSteps = function() {
    return [1];
};

LeapRangeVoiceLinePlannerConstraint.prototype.oneStepCost = function(harmonyIndex, prevStateIndex, stateIndex, planner) {
    var stepCost = 0;

    var absNotes = planner.possibleAbsoluteNoteTuples[harmonyIndex][stateIndex];
    var prevAbsNotes = planner.possibleAbsoluteNoteTuples[harmonyIndex-1][prevStateIndex];

    function getCostCount(range, fromAbs, toAbs) {
        var count = 0;
        var diff = toAbs - fromAbs;
        if (diff > range[1]) {
            count = diff - range[1];
        } else if (diff < range[0]) {
            count = range[0] - diff;
        }
        return count;
    }

    for (var i=0; i<this.voiceIndices.length; i++) {
        var voiceIndex = this.voiceIndices[i];
        if (voiceIndex < absNotes.length) {
            var fromAbs = prevAbsNotes[voiceIndex];
            var toAbs = absNotes[voiceIndex];
            stepCost += getCostCount(this.range, fromAbs, toAbs) * this.penaltyFactor;
        }
    }

    return stepCost;
};





VoiceChordNotesVoiceLinePlannerConstraint.prototype.getCheckCostSteps = function() {
    return [0];
};

VoiceChordNotesVoiceLinePlannerConstraint.prototype.setRootPitches = function(v) {
    this.chordRootPitchClassConstraints = v;
    return this;
};
VoiceChordNotesVoiceLinePlannerConstraint.prototype.setRootPitchCosts = function(v) {
    this.chordRootPitchClassConstraintCosts = v;
    return this;
};

VoiceChordNotesVoiceLinePlannerConstraint.prototype.zeroStepCost = function(harmonyIndex, stateIndex, planner) {
    var stepCost = 0;

    var absoluteNotes = planner.possibleAbsoluteNoteTuples[harmonyIndex][stateIndex];
    var chordPitchClasses = planner.chordPitchClassesArr[harmonyIndex];

    for (var i=0; i<this.chordRootPitchClassConstraints.length; i++) {
        var rootArr = this.chordRootPitchClassConstraints[i];
        var costArr = this.chordRootPitchClassConstraintCosts[i % this.chordRootPitchClassConstraintCosts.length];

        if (i < absoluteNotes.length) {
            // absolute note for voice with index i
            var absNote = absoluteNotes[i];
            var pitchClass = absNote % 12;
            for (var j=0; j<rootArr.length; j++) {
                var rootIndex = rootArr[j];
                var cost = costArr[j % costArr.length];
                if (rootIndex < chordPitchClasses.length) {
                    var chordNotePitchClass = chordPitchClasses[rootIndex];
                    if (pitchClass == chordNotePitchClass) {
//                        logit("chord pitch class " + chordNotePitchClass);
                        stepCost += cost;
                    }
                }
            }
        }
    }

//    if (stepCost > 0) {
//        logit("Getting zero step cost for " + this._constructorName + " " + harmonyIndex + " " + stateIndex + " " + stepCost);
//    }

    return stepCost;
};


function ChordDoublingVoiceLinePlannerConstraint() {
    VoiceLinePlannerConstraint.call(this);
    this.rootDoublingPenalty = 0;
    this.thirdDoublingPenalty = 1;
    this.fifthDoublingPenalty = 1;
    this.seventhDoublingPenalty = 1;
    this._constructorName = "ChordDoublingVoiceLinePlannerConstraint";
}
ChordDoublingVoiceLinePlannerConstraint.prototype = new VoiceLinePlannerConstraint();

ChordDoublingVoiceLinePlannerConstraint.prototype.getCheckCostSteps = function() {
    return [0];
};
ChordDoublingVoiceLinePlannerConstraint.prototype.zeroStepCost = function(harmonyIndex, stateIndex, planner) {
    var stepCost = 0;

    var absoluteNotes = planner.possibleAbsoluteNoteTuples[harmonyIndex][stateIndex];

    var pitchClassMap = planner.getPitchClassMap(absoluteNotes);

    var harmonyElement = planner.harmony.get(harmonyIndex);
    var isSeventh = harmonyElement.isSeventh();

    var chordPitchClasses = planner.chordPitchClassesArr[harmonyIndex];

    var rootPitchClass = chordPitchClasses[0];
    var thirdPitchClass = chordPitchClasses[1];
    var fifthPitchClass = chordPitchClasses[2];
    var seventhPitchClass = rootPitchClass;
    if (isSeventh) {
        seventhPitchClass = chordPitchClasses[3];
    }

    if (pitchClassMap[rootPitchClass] > 1) {
        // Doubled or tripled root
        stepCost += this.rootDoublingPenalty *
            (pitchClassMap[rootPitchClass] - 1);
    }
    if (pitchClassMap[thirdPitchClass] > 1) {
        // Doubled or tripled third
        stepCost += this.thirdDoublingPenalty *
            (pitchClassMap[thirdPitchClass] - 1);
    }
    if (pitchClassMap[fifthPitchClass] > 1) {
        // Doubled or tripled fifth
        stepCost += this.fifthDoublingPenalty *
            (pitchClassMap[fifthPitchClass] - 1);
    }
    if (isSeventh && pitchClassMap[seventhPitchClass] > 1) {
        // Doubled or tripled seventh
        stepCost += this.seventhDoublingPenalty *
            (pitchClassMap[seventhPitchClass] - 1);
    }

    return stepCost;
};


function ChordCompletenessVoiceLinePlannerConstraint() {
    VoiceLinePlannerConstraint.call(this);

    this.missingRootPenalty = 3;
    this.missingThirdPenalty = 2;
    this.missingFifthPenalty = 1;
    this.missingSeventhPenalty = 2;

    this._constructorName = "ChordCompletenessVoiceLinePlannerConstraint";
}
ChordCompletenessVoiceLinePlannerConstraint.prototype = new VoiceLinePlannerConstraint();

ChordCompletenessVoiceLinePlannerConstraint.prototype.getCheckCostSteps = function() {
    return [0];
};
ChordCompletenessVoiceLinePlannerConstraint.prototype.zeroStepCost = function(harmonyIndex, stateIndex, planner) {
    var stepCost = 0;

    var absoluteNotes = planner.possibleAbsoluteNoteTuples[harmonyIndex][stateIndex];

    var pitchClassMap = planner.getPitchClassMap(absoluteNotes);

    var harmonyElement = planner.harmony.get(harmonyIndex);
    var isSeventh = harmonyElement.isSeventh();

    var chordPitchClasses = planner.chordPitchClassesArr[harmonyIndex];

    var rootPitchClass = chordPitchClasses[0];
    var thirdPitchClass = chordPitchClasses[1];
    var fifthPitchClass = chordPitchClasses[2];
    var seventhPitchClass = rootPitchClass;
    if (isSeventh) {
        seventhPitchClass = chordPitchClasses[3];
    }

    if (!pitchClassMap[rootPitchClass]) {
        // Missing root
        stepCost += this.missingRootPenalty;
    }
    if (!pitchClassMap[thirdPitchClass]) {
        // Missing third
        stepCost += this.missingThirdPenalty;
    }
    if (!pitchClassMap[fifthPitchClass]) {
        // Missing fifth
        stepCost += this.missingFifthPenalty;
    }
    if (isSeventh && !pitchClassMap[seventhPitchClass]) {
        // Missing seventh
        stepCost += this.missingSeventhPenalty;;
    }

    return stepCost;
};
