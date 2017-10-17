

function ClassicalVoiceLineState() {
    this.stateIndex = 0;
//    this.absoluteNotes = [];
//    this.scaleIndices = [];
}

ClassicalVoiceLineState.prototype.copy = function() {
    var result = new ClassicalVoiceLineState();
    result.stateIndex = this.stateIndex;
    //    result.absoluteNotes = arrayCopy(this.absoluteNotes);
    //    result.scaleIndices = arrayCopy(this.scaleIndices);
    return result;
};

ClassicalVoiceLineState.prototype.toString = function() {
    return "CVLS{" +
        "stateIndex: " + this.stateIndex +
        //    "absoluteNotes: " + this.absoluteNotes +
        //    "scaleIndices: " + this.scaleIndices +
        "}";
};


function ClassicalVoiceLineGenerator(options) {
    VoiceLineGenerator.call(this, options);

    this.voiceCount = getValueOrDefault(options,
        "voiceCount", 4);

    this.maxDomainSize = getValueOrDefault(options,
        "maxDomainSize", 100);

    // General constraints, one for each harmony index
    this.constraints = getValueOrDefault(options, "constraints", []);

    // For constant voices
    this.constants = getValueOrDefault(options, "constants", [[false], [false], [false], [false]]);

    // For undefined voices
    this.undefines = getValueOrDefault(options, "undefines", [[false], [false], [false], [false]]);

    this.anticipations = getValueOrDefault(options, "anticipations", [[false], [false], [false], [false]]);
    this.suspensions = getValueOrDefault(options, "suspensions", [[false], [false], [false], [false]]);

    // Ranges
    this.absoluteNoteRanges = getValueOrDefault(options, "absoluteNoteRanges", [[[65, 85]], [[50, 75]], [[40, 70]], [[35, 60]]]); // Hard limit
    this.penaltyAbsoluteNoteRanges = getValueOrDefault(options, "penaltyAbsoluteNoteRanges", [[[65, 85]], [[50, 75]], [[40, 70]], [[35, 60]]]); // Soft limit
    this.noteRangePenalties = getValueOrDefault(options, "noteRangePenalties", [[0.5], [0.5], [0.5], [0.5]]);

    // Hints
    this.absoluteNoteHints = getValueOrDefault(options, "absoluteNoteHints", [[70], null, null, [40]]);
    this.maxAbsoluteHintDistances = getValueOrDefault(options, "maxAbsoluteHintDistances", [[6], null, null, [10]]); // Hard limit

    this.penaltyMaxAbsoluteHintDistances = getValueOrDefault(options, "penaltyMaxAbsoluteHintDistances", [[3], null, null, [3]]); // Soft limit
//    this.hintDistancePenalties = getValueOrDefault(options, "hintDistancePenalties", [[0.3], [0.2], [0.2], [0.2]]);
    this.hintDistancePenalties = getValueOrDefault(options, "hintDistancePenalties", [[0.5], [0.5], [0.5], [0.5]]);



    // Pitch class constraints
    this.chordRootPitchClassConstraints = getValueOrDefault(options, "chordRootPitchClassConstraints", [null, null, null, null]);
    this.chordBassPitchClassConstraints = getValueOrDefault(options, "chordBassPitchClassConstraints", [null, null, null, [[0]]]);

    // Voice spacings
    this.maxSpacings = getValueOrDefault(options, "maxSpacings", [[12], [12], [12], [24]]); // Hard limit

    this.penaltyMaxSpacings = getValueOrDefault(options, "penaltyMaxSpacings", [[12], [12], [12], [24]]); // Soft limit
    this.spacingPenalties = getValueOrDefault(options, "spacingPenalties", [[0.5], [0.5], [0.5], [0.5]]);


    // Parallel perfects
    this.parallelOctavesAndUnisonsPenalties = getValueOrDefault(options, "parallelOctavesAndUnisonsPenalties", [4, 4, 4, 4]);
    this.parallelFifthsPenalties = getValueOrDefault(options, "parallelFifthsPenalties", [3, 3, 3, 3]);

    // Leaps
    this.maxLeapSizes = getValueOrDefault(options, "maxLeapSizes", [[12], [5], [5], [12]]);
    this.maxLeapSizePenalties = getValueOrDefault(options, "maxLeapSizePenalties", [[1], [1], [1], [1]]);
    this.maxFinalLeapSizes = getValueOrDefault(options, "maxFinalLeapSizes", [[4], [5], [5], [12]]);
    this.maxFinalLeapSizePenalties = getValueOrDefault(options, "maxFinalLeapSizePenalties", [[3], [0.5], [0.5], [0.5]]);
    this.suspensionLeapPenalties = getValueOrDefault(options, "suspensionLeapPenalties", [[2], [2], [2], [2]]);
    this.largeLeapReverseDirectionPenaltyFactors = getValueOrDefault(options, "largeLeapReverseDirectionPenaltyFactor", [1, 1, 1, 1]);

    // Sus chord preparations and resolution
    this.unresolvedSusChordPenalties = getValueOrDefault(options, "unresolvedSusChordPenalties", [[1], [1], [1], [1]]);
    this.unpreparedSusChordPenalties = getValueOrDefault(options, "unpreparedSusChordPenalties", [[0.2], [0.2], [0.2], [0.2]]);


    // Melodic dissonances
    this.augmentedSecondPenalties = getValueOrDefault(options, "augmentedSecondPenalties", [3]);

    // Doublings
    this.rootDoublingPenalties = getValueOrDefault(options, "rootDoublingPenalties", [0]);
    this.thirdDoublingPenalties = getValueOrDefault(options, "thirdDoublingPenalties", [1]);
    this.fifthDoublingPenalties = getValueOrDefault(options, "fifthDoublingPenalties", [1]);
    this.seventhDoublingPenalties = getValueOrDefault(options, "seventhDoublingPenalties", [1]);

    this.leadingToneDoublingPenalties = getValueOrDefault(options, "leadingToneDoublingPenalties", [3]);

    // Chord completeness
    this.missingRootPenalties = getValueOrDefault(options, "missingRootPenalties", [3]);
    this.missingThirdPenalties = getValueOrDefault(options, "missingThirdPenalties", [2]);
    this.missingFifthPenalties = getValueOrDefault(options, "missingFifthPenalties", [0.25]);
    this.missingSeventhPenalties = getValueOrDefault(options, "missingSeventhPenalties", [2]);

    this.invertedMissingRootPenalties = getValueOrDefault(options, "missingRootPenalties", [3]);
    this.invertedMissingThirdPenalties = getValueOrDefault(options, "missingThirdPenalties", [2]);
    this.invertedMissingFifthPenalties = getValueOrDefault(options, "missingFifthPenalties", [1]);
    this.invertedMissingSeventhPenalties = getValueOrDefault(options, "missingSeventhPenalties", [2]);

    // Preparations and resolutions of dissonances
    this.unpreparedSeventhPenalties = getValueOrDefault(options, "unpreparedSeventhPenalties", [0.25]);
    this.unresolvedSeventhPenalties = getValueOrDefault(options, "unresolvedSeventhPenalties", [0.5]);

    this.unprepared64FourthPenalties = getValueOrDefault(options, "unprepared64FourthPenalties", [0.2]);
    this.unresolved64FourthPenalties = getValueOrDefault(options, "unresolved64FourthPenalties", [0.4]);

    // Cross relations
    this.crossRelationPenalties = getValueOrDefault(options, "crossRelationPenalties", [3]);


    // The following properties will be set in prepareBeforeSearch()
    this.chordPitchClassesArr = [];
    this.scalePitchClassesArr = [];

    this.allPairs = [];
    this.adjacentPairs = [];

    this.possibleAbsoluteNoteTuples = [];
    this.possibleScaleIndexTuples = [];
    this.zeroStepCosts = [];
    this.zeroStepDomainIndices = [];
    this.oneStepCosts = [];
    this.oneStepHeuristicCosts = [];
    this.oneStepDomainIndices = [];

    this.zeroStepConstraints = [];
    this.oneStepConstraints = [];
    this.twoStepConstraints = [];
}


ClassicalVoiceLineGenerator.prototype = new VoiceLineGenerator();



ClassicalVoiceLineGenerator.prototype.getTwoStepCost = function(harmonyIndex, prevPrevStateIndex, prevStateIndex, stateIndex, verbose) {
    var stepCost = 0;

    var absoluteNotes = this.possibleAbsoluteNoteTuples[harmonyIndex][stateIndex];
    var prevAbsoluteNotes = this.possibleAbsoluteNoteTuples[harmonyIndex - 1][prevStateIndex];


    // Check smooth entering and resolution of sevenths and fourths here!

    // Check that a large leap has a step or small leap that follows
    var prevPrevAbsoluteNotes = this.possibleAbsoluteNoteTuples[harmonyIndex - 2][prevPrevStateIndex];
    for (var i=0; i<absoluteNotes.length; i++) {
        var factor = this.largeLeapReverseDirectionPenaltyFactors[i % this.largeLeapReverseDirectionPenaltyFactors.length]
        var count = this.getlargeLeapReverseDirectionPenaltyCount(prevPrevAbsoluteNotes[i],
            prevAbsoluteNotes[i], absoluteNotes[i]);
        stepCost += factor * count;
    }

    return stepCost;
};

ClassicalVoiceLineGenerator.prototype.getOneStepCost = function(harmonyIndex, prevStateIndex, stateIndex, verbose) {
    var stepCost = 0;

    for (var i=0; i<this.oneStepConstraints[harmonyIndex].length; i++) {
        var cstr = this.oneStepConstraints[harmonyIndex][i];
        stepCost += cstr.oneStepCost(harmonyIndex, prevStateIndex, stateIndex, this);
    }

    var absoluteNotes = this.possibleAbsoluteNoteTuples[harmonyIndex][stateIndex];
    var prevAbsoluteNotes = this.possibleAbsoluteNoteTuples[harmonyIndex - 1][prevStateIndex];
    var scaleIndices = this.possibleScaleIndexTuples[harmonyIndex][stateIndex];
    var prevScaleIndices = this.possibleScaleIndexTuples[harmonyIndex - 1][prevStateIndex];

    var chordPitchClasses = this.chordPitchClassesArr[harmonyIndex];
    var prevChordPitchClasses = this.chordPitchClassesArr[harmonyIndex - 1];

    var harmonyElement = this.harmony.get(harmonyIndex);
    var hasSeventh = harmonyElement.hasSeventh();
    var isSus = harmonyElement.isSus();
    var susPitchClass = chordPitchClasses[0];
    if (isSus) {
        susPitchClass = chordPitchClasses[1];
    }

    var rootPitchClass = chordPitchClasses[0];
    var prevRootPitchClass = prevChordPitchClasses[0];
    var thirdPitchClass = chordPitchClasses[1];
    var fifthPitchClass = chordPitchClasses[2];
    var seventhPitchClass = rootPitchClass;
    if (hasSeventh) {
        seventhPitchClass = chordPitchClasses[3];
    }

    var is64 = harmonyElement.is64Triad();

    var prevHarmonyElement = this.harmony.get(harmonyIndex - 1);
    var prevHasSeventh = prevHarmonyElement.hasSeventh();
    var prevIsSus = prevHarmonyElement.isSus();
    var prevSusPitchClass = prevChordPitchClasses[0];
    if (prevIsSus) {
        prevSusPitchClass = prevChordPitchClasses[1];
    }

    var prevSeventhPitchClass = prevChordPitchClasses[0];
    if (prevHasSeventh) {
        prevSeventhPitchClass = prevChordPitchClasses[3];
    }
    var prevIs64 = prevHarmonyElement.is64Triad();
    var prev64PitchClass = prevChordPitchClasses[0]; // The root of the chord is the fourth and dissonant note

    // Check for large leaps into final index
    var finalIndex = harmonyIndex == this.harmony.getCount() - 1;

    var scaleChanged = this.changedScaleArr[harmonyIndex];

    var scalePitchClasses = this.scalePitchClassesArr[harmonyIndex];
    var prevScalePitchClasses = this.scalePitchClassesArr[harmonyIndex - 1];

    // Checking cross relations when changing scale
    if (scaleChanged) {
        var wasCrossRelation = false;

        var bassAbsNote = absoluteNotes[absoluteNotes.length - 1];
        var bassPrevAbsNote = prevAbsoluteNotes[prevAbsoluteNotes.length - 1];

        var bassPitchClass = bassAbsNote % 12;

        var bassHasNewPitchClass = !arrayContains(prevScalePitchClasses, bassPitchClass);

        if (bassHasNewPitchClass) {
            // Check if it is smooth in the bass
            if (Math.abs(bassAbsNote - bassPrevAbsNote) <= 2) {
                // No problem?
            } else {
                var maxUpperIndex = Math.floor(absoluteNotes.length / 2);

                var foundSmoothInUpper = false;
                for (var i=0; i<maxUpperIndex; i++) {
                    var prevAbsNote = prevAbsoluteNotes[i];
                    var curAbsNote = absoluteNotes[i];
                    if ((curAbsNote % 12) == bassPitchClass && Math.abs(curAbsNote - prevAbsNote) <= 2) {
                        // Enters smoothly in the upper voice, no problemo
                        foundSmoothInUpper = true;
                        break;
                    }
                }
                if (!foundSmoothInUpper) {
//                    logit("is cross relation! " + (new ConstantHarmonicRythm([prevHarmonyElement, harmonyElement]).toRomanString()));
                    stepCost += this.crossRelationPenalties[harmonyIndex % this.crossRelationPenalties.length];
                    wasCrossRelation = true;
                }
            }
        }
//        if (!wasCrossRelation) {
//            stepCost += 10;
//        }
    }


    // Iterator through all voices
    for (var i=0; i<absoluteNotes.length; i++) {
        var prevAbsNote = prevAbsoluteNotes[i];
        var curAbsNote = absoluteNotes[i];

        // Check preparation and resolution of of sevenths
        // Moving within a seventh chord with same root is OK
        var seventhExpanded = hasSeventh && prevHasSeventh && rootPitchClass == prevRootPitchClass;

//        if (seventhExpanded) {
//            logit("Seventh expanded!");
//        }

        if (hasSeventh && !seventhExpanded) {
            var prepareSeventhFactor = this.unpreparedSeventhPenalties[harmonyIndex % this.unpreparedSeventhPenalties.length];
            stepCost += prepareSeventhFactor * this.getlargeLeapToPitchClassPenaltyCount(prevAbsNote, curAbsNote, 1, seventhPitchClass);
        }
        if (prevHasSeventh && !seventhExpanded) {
            var resolveSeventhFactor = this.unresolvedSeventhPenalties[harmonyIndex % this.unresolvedSeventhPenalties.length];
//            stepCost += resolveSeventhFactor * this.getlargeLeapFromPitchClassPenaltyCount(prevAbsNote, curAbsNote, 1, prevSeventhPitchClass);
            var seventhResolveCost = resolveSeventhFactor * this.getLeapRangeFromPitchClassPenaltyCount(prevAbsNote, curAbsNote, -2, -1, prevSeventhPitchClass);
            stepCost += seventhResolveCost;
//            if (seventhResolveCost == 0 && (prevAbsNote % 12) == prevSeventhPitchClass) {
//                logit(" 7th resolve cost " + seventhResolveCost + " " + prevAbsNote + " " + curAbsNote);
//            }
        }
        // Check preparation and resolution of of the fourths in 64 chords
        if (is64) {
            var prepare64Factor = this.unprepared64FourthPenalties[harmonyIndex % this.unprepared64FourthPenalties.length];
            stepCost += prepare64Factor * this.getlargeLeapToPitchClassPenaltyCount(prevAbsNote, curAbsNote, 1, rootPitchClass);
        }
        if (prevIs64) {
            var resolve64Factor = this.unresolved64FourthPenalties[harmonyIndex % this.unresolved64FourthPenalties.length];
//            stepCost += resolve64Factor * this.getlargeLeapFromPitchClassPenaltyCount(prevAbsNote, curAbsNote, 1, prev64PitchClass);
            var resolve64Cost = resolve64Factor * this.getLeapRangeFromPitchClassPenaltyCount(prevAbsNote, curAbsNote, -2, -1, prev64PitchClass);
            stepCost += resolve64Cost;
        }


        // Checking augmented 2nds
        if (Math.abs(prevAbsNote - curAbsNote) == 3) {
            // Could be an augmented 2nd

            var wasAug2nd = false;
            var scaleIndex = scaleIndices[i];
            var prevScaleIndex = prevScaleIndices[i];

            if (scaleChanged) {
                var curAbsNotePartOfPreviousScale = arrayContains(prevScalePitchClasses, curAbsNote % 12);
                var prevAbsNotePartOfCurrentScale = arrayContains(scalePitchClasses, prevAbsNote % 12);

                if (!curAbsNotePartOfPreviousScale || !prevAbsNotePartOfCurrentScale) {
                    wasAug2nd = true;
//                    logit("Found aug2nd " + scalePitchClasses.join(", ") + "  " + prevScalePitchClasses.join(", ") + " " + curAbsNote + " " + prevAbsNote);
                }
            } else if (Math.abs(prevScaleIndex - scaleIndex) == 1) {
                // Moved within same scale a single index and this resulted in a minor third/aug 2nd
                wasAug2nd = true;
            }
            if (wasAug2nd) {
//                logit("Found aug2nd!!");
                stepCost += this.augmentedSecondPenalties[harmonyIndex % this.augmentedSecondPenalties.length];
            }
        }

        // Compare with all other voices except the current
        var parallelOctavesAndUnisonsPenalty = this.parallelOctavesAndUnisonsPenalties[i % this.parallelOctavesAndUnisonsPenalties.length];
        var parallelFifthsPenalty = this.parallelFifthsPenalties[i % this.parallelFifthsPenalties.length];

        for (var j=i+1; j<absoluteNotes.length; j++) {
            var curOtherAbsNote = absoluteNotes[j];
            var prevOtherAbsNote = prevAbsoluteNotes[j];

            if (this.isParallelOctavesOrUnisons(prevOtherAbsNote, curOtherAbsNote, prevAbsNote, curAbsNote)) {
                stepCost += parallelOctavesAndUnisonsPenalty;
            }
            if (this.isParallelPerfectFifths(prevOtherAbsNote, curOtherAbsNote, prevAbsNote, curAbsNote)) {
                stepCost += parallelFifthsPenalty;
            }
            // Check augmented seconds as well!

        }

        var leapSizePenaltyArr = this.maxLeapSizePenalties[i % this.maxLeapSizePenalties.length];
        var maxLeapArr = this.maxLeapSizes[i % this.maxLeapSizes.length];
        stepCost += leapSizePenaltyArr[harmonyIndex % leapSizePenaltyArr.length] * this.getlargeLeapPenaltyCount(prevAbsNote, curAbsNote, maxLeapArr[harmonyIndex % maxLeapArr.length]);

        if (finalIndex) {
            var finalLeapSizePenaltyArr = this.maxFinalLeapSizePenalties[i % this.maxFinalLeapSizePenalties.length];
            var maxFinalLeapArr = this.maxFinalLeapSizes[i % this.maxFinalLeapSizes.length];
            var finalLeapCost = finalLeapSizePenaltyArr[harmonyIndex % finalLeapSizePenaltyArr.length] * this.getlargeLeapPenaltyCount(prevAbsNote, curAbsNote, maxFinalLeapArr[harmonyIndex % maxFinalLeapArr.length]);
            stepCost += finalLeapCost;
//            logit("final leap cost " + finalLeapCost + " " + i + " " + maxFinalLeapArr);
        }
        var lineSuspensions = this.suspensions[i % this.suspensions.length];
        if (lineSuspensions[(harmonyIndex - 1) % lineSuspensions.length]) {

            // Check if the current suspension is consonant or dissonant
            var prevPitchClass = prevAbsNote % 12;
            var consonantSusp = arrayContains(chordPitchClasses, prevPitchClass);

            if (consonantSusp) {
                // No penalty here?
            } else {
                var suspensionLeapPenaltyArr = this.suspensionLeapPenalties[i % this.suspensionLeapPenalties.length];
                stepCost += suspensionLeapPenaltyArr[harmonyIndex % suspensionLeapPenaltyArr.length] * this.getLeapRangePenaltyCount(prevAbsNote, curAbsNote, -2, -1);
            }
        }
        if (prevIsSus) {
            // Resolve the sus
            var unresolvedSusChordPenaltyArr = this.unresolvedSusChordPenalties[i % this.unresolvedSusChordPenalties.length];
            stepCost += unresolvedSusChordPenaltyArr[harmonyIndex % unresolvedSusChordPenaltyArr.length] *
                this.getLeapRangeFromPitchClassPenaltyCount(prevAbsNote, curAbsNote, -2, -1, prevSusPitchClass);
        }
        if (isSus) {
            // Try not to leap into the sus note
            var unpreparedSusChordPenaltyArr = this.unpreparedSusChordPenalties[i % this.unpreparedSusChordPenalties.length];
            var prepareSusFactor = unpreparedSusChordPenaltyArr[harmonyIndex % unpreparedSusChordPenaltyArr.length];
            stepCost += prepareSusFactor * this.getlargeLeapToPitchClassPenaltyCount(prevAbsNote, curAbsNote, 1, susPitchClass);
        }
    }

    return stepCost;
};

ClassicalVoiceLineGenerator.prototype.getZeroStepCost = function(harmonyIndex, stateIndex, verbose) {
    var stepCost = 0;

    var absoluteNotes = this.possibleAbsoluteNoteTuples[harmonyIndex][stateIndex];

    for (var i=0; i<this.zeroStepConstraints[harmonyIndex].length; i++) {
        var cstr = this.zeroStepConstraints[harmonyIndex][i];
        stepCost += cstr.zeroStepCost(harmonyIndex, stateIndex, this);
    }

    // Check spacing penalty
    for (var i=0; i<absoluteNotes.length; i++) {
        if (i > 0) {
            var dist = Math.abs(absoluteNotes[i] - absoluteNotes[i-1]);
            var spacingsArr = this.penaltyMaxSpacings[i % this.penaltyMaxSpacings.length]

            var penaltyMaxSpacing = spacingsArr[harmonyIndex % spacingsArr.length];

            //            logitRnd("pms: " + penaltyMaxSpacing + " dist: " + dist + " <br />", 0.01);
            if (dist > penaltyMaxSpacing) {
                var wrongCount = dist - penaltyMaxSpacing;
                var arr = this.spacingPenalties[i % this.spacingPenalties.length];
                stepCost += wrongCount * arr[harmonyIndex % arr.length];
            }
            //            if (verbose && isNaN(stepCost)) {
            //                logit(["stepCost:", "dist:", dist, "penaltyArr:", penaltyArr,   "<br />"].join(""));
            //            }
        }
    }

    // Check note range penalty
    for (var i=0; i<absoluteNotes.length; i++) {
        var note = absoluteNotes[i];
        var penaltyRange = this.penaltyAbsoluteNoteRanges[i][harmonyIndex];
        var wrongCount = 0;
        if (note < penaltyRange[0]) {
            wrongCount = penaltyRange[0] - note;
        } else if (note > penaltyRange[1]) {
            wrongCount = note - penaltyRange[1];
        }
        var penaltyArr = this.noteRangePenalties[i % this.noteRangePenalties.length];
        stepCost += penaltyArr[harmonyIndex % penaltyArr.length] * wrongCount;
    }



    // Check note hint penalty
    for (var i=0; i<absoluteNotes.length; i++) {
        var note = absoluteNotes[i];
        var hintDistance = this.penaltyMaxAbsoluteHintDistances[i][harmonyIndex];
        var hint = this.absoluteNoteHints[i][harmonyIndex];

        if (hint === null) {
            continue;
        }
        var dist = Math.abs(hint - note);

        var wrongCount = 0;
        if (dist > hintDistance) {
            wrongCount = dist - hintDistance;
        }
        var penaltyArr = this.hintDistancePenalties[i % this.hintDistancePenalties.length];
        var penalty = penaltyArr[harmonyIndex % penaltyArr.length] * wrongCount
        stepCost += penalty;

//        if (i == 0) {
//            logit("hint: " + hint + " note: " + note + " wrongCount: " + wrongCount + " dist: " + dist + " penalty: " + penalty)
//        }
    }

    var pitchClassMap = this.getPitchClassMap(absoluteNotes);

    var harmonyElement = this.harmony.get(harmonyIndex);
    var isSeventh = harmonyElement.isSeventh();

    var chordPitchClasses = this.chordPitchClassesArr[harmonyIndex];

    var leadingTonePitchClass = harmonyElement.getAbsoluteNoteFromScaleIndex(6) % 12;

    var rootPitchClass = chordPitchClasses[0];
    var thirdPitchClass = chordPitchClasses[1];
    var fifthPitchClass = chordPitchClasses[2];
    var seventhPitchClass = rootPitchClass;
    if (isSeventh) {
        seventhPitchClass = chordPitchClasses[3];
    }


    var missingRootPenalties = harmonyElement.chordInversions == 0 ? this.missingRootPenalties : this.invertedMissingRootPenalties;
    var missingThirdPenalties = harmonyElement.chordInversions == 0 ? this.missingThirdPenalties : this.invertedMissingThirdPenalties;
    var missingFifthPenalties = harmonyElement.chordInversions == 0 ? this.missingFifthPenalties : this.invertedMissingFifthPenalties;
    var missingSeventhPenalties = harmonyElement.chordInversions == 0 ? this.missingSeventhPenalties : this.invertedMissingSeventhPenalties;
    if (!pitchClassMap[rootPitchClass]) {
        // Missing root
        stepCost += missingRootPenalties[harmonyIndex % missingRootPenalties.length];
    }

    if (!pitchClassMap[thirdPitchClass]) {
        // Missing third
        stepCost += missingThirdPenalties[harmonyIndex % missingThirdPenalties.length];
    }
    if (!pitchClassMap[fifthPitchClass]) {
        // Missing fifth
        stepCost += missingFifthPenalties[harmonyIndex % missingFifthPenalties.length];
    }
    if (isSeventh && !pitchClassMap[seventhPitchClass]) {
        // Missing seventh
        stepCost += missingSeventhPenalties[harmonyIndex % missingSeventhPenalties.length];
    }

    // Chord doublings


    // Penalty for doubling third and fifth
    if (pitchClassMap[rootPitchClass] > 1) {
        // Doubled or tripled root
        stepCost += this.rootDoublingPenalties[harmonyIndex % this.rootDoublingPenalties.length] *
            (pitchClassMap[rootPitchClass] - 1);
    }
    if (pitchClassMap[thirdPitchClass] > 1) {
        // Doubled or tripled third
        stepCost += this.thirdDoublingPenalties[harmonyIndex % this.thirdDoublingPenalties.length] *
            (pitchClassMap[thirdPitchClass] - 1);
    }
    if (pitchClassMap[fifthPitchClass] > 1) {
        // Doubled or tripled fifth
        stepCost += this.fifthDoublingPenalties[harmonyIndex % this.fifthDoublingPenalties.length] *
            (pitchClassMap[fifthPitchClass] - 1);
    }
    if (isSeventh && pitchClassMap[seventhPitchClass] > 1) {
        // Doubled or tripled seventh
        stepCost += this.seventhDoublingPenalties[harmonyIndex % this.seventhDoublingPenalties.length] *
            (pitchClassMap[seventhPitchClass] - 1);
    }

    if (pitchClassMap[leadingTonePitchClass] > 1) {
        // Doubled or tripled leading tone
        stepCost += this.leadingToneDoublingPenalties[harmonyIndex % this.leadingToneDoublingPenalties.length] *
            (pitchClassMap[leadingTonePitchClass] - 1);
//        logit("Doubled leading tone " + pitchClassMap[leadingTonePitchClass]);
    }

    return stepCost;
};





ClassicalVoiceLineGenerator.prototype.getPitchClassMap = function(absoluteNotes) {
    var pitchClassMap = {};
    for (var i=0; i<absoluteNotes.length; i++) {
        var absNote = absoluteNotes[i];
        var pitchClass = absNote % 12;
        var count = pitchClassMap[pitchClass];
        if (count) {
            count++;
        } else {
            count = 1;
        }
        pitchClassMap[pitchClass] = count;
    }
    return pitchClassMap;
};

ClassicalVoiceLineGenerator.prototype.getStepCost = function(node) {
    var index = node.searchDepth + node.resultIndex - 1;
    var stepCost = 0;
    var state = node.state;

    if (index > 0) {
        // We can look one step back
        var prevState = this.resultStates[index - 1];

        var oneStepCost = this.oneStepCosts[index][prevState.stateIndex][state.stateIndex];
        if (!oneStepCost) {
            oneStepCost = this.getOneStepCost(index, prevState.stateIndex, state.stateIndex);
            this.oneStepCosts[index][prevState.stateIndex][state.stateIndex] = oneStepCost;
        }
        stepCost += oneStepCost;

        if (index > 1) {
            // We can check two steps back
            var prevPrevState = this.resultStates[index - 2];
            stepCost += this.getTwoStepCost(index, prevPrevState.stateIndex, prevState.stateIndex, state.stateIndex);
        }
    }
    // logit("Step cost for " + node.state + " was " + stepCost);

    stepCost += this.zeroStepCosts[index][state.stateIndex];

//    logit("___ zero step costs for state index " + state.stateIndex + ": " + JSON.stringify(this.zeroStepCosts[index]));

    return stepCost;
};


// Get scale index domains
ClassicalVoiceLineGenerator.prototype.getStates = function(node) {
    var result = [];


    var index = node.searchDepth + node.resultIndex;


    var domainIndices = this.zeroStepDomainIndices[index];

//    if (index > 0) {
//        var domainLength = domainIndices.length;
//
//        var prevState = this.resultStates[index - 1];
//        domainIndices = this.oneStepDomainIndices[index][prevState.stateIndex];
//
//        if (!domainIndices) {
//            var that = this;
//            // Create sorted domains for each possible previous state index
//            var j = prevState.stateIndex;
//            domainIndices = createFilledNumericIncArray(domainLength, 0, 1);
//            this.oneStepDomainIndices[index][j] = domainIndices;
//
//            domainIndices.sort(function(a, b) {
//                return (that.zeroStepCosts[index][a] + that.oneStepHeuristicCosts[index][j][a]) -
//                    (that.zeroStepCosts[index][b] + that.oneStepHeuristicCosts[index][j][b]);
//            });
//        }
//    }

    for (var i=0; i<domainIndices.length; i++) {
        var newState = new ClassicalVoiceLineState();
        newState.stateIndex = domainIndices[i];
        result.push(newState);

//        if (newState.stateIndex > 49) {
//            logit("state index " + newState.stateIndex);
//        }
    }

//    logit("Getting states at index " + index);
//    logit("  Result: " + JSON.stringify(result));

    return result;
};



ClassicalVoiceLineGenerator.prototype.prepareBeforeSearch = function() {

    var harmonyElements = this.harmony.getConstantHarmonyElements();

    this.chordPitchClassesArr = [];
    this.scalePitchClassesArr = [];

    this.changedScaleArr = [];

    for (var i=0; i<harmonyElements.length; i++) {
        var harmonyElement = harmonyElements[i];

        this.zeroStepConstraints[i] = [];
        this.oneStepConstraints[i] = [];
        this.twoStepConstraints[i] = [];

        if (!this.constraints[i]) {
            this.constraints[i] = [];
        }
//        if (harmonyElement.voiceLineConstraints.length > 0) {
//            logit(harmonyElement.voiceLineConstraints);
//        }
        addAll(this.constraints[i], harmonyElement.voiceLineConstraints);

        var chordPitchClasses = harmonyElement.getPitchClassesFromAbsoluteNotes(harmonyElement.getChordAbsoluteNotes());
        var scalePitchClasses = harmonyElement.getPitchClassesFromAbsoluteNotes(harmonyElement.getScaleAbsoluteNotes());
        this.chordPitchClassesArr.push(chordPitchClasses);
        this.scalePitchClassesArr.push(scalePitchClasses);

        var changedScale = false;
        if (i > 0) {
            var prevHarmonyElement = harmonyElements[i - 1];
            changedScale = (harmonyElement.baseNote != prevHarmonyElement.baseNote) ||
                !arrayEquals(scalePitchClasses, this.scalePitchClassesArr[i - 1]);
        }
        this.changedScaleArr[i] = changedScale;

        //        logit("Chord pitch classes for harmony " + i + ": " + chordPitchClasses + "<br />");
    }


    for (var i=0; i<this.constraints.length; i++) {
        var constraintArr = this.constraints[i];
        for (var j=0; j<constraintArr.length; j++) {
            var constraint = constraintArr[j];
            var steps = constraint.getCheckCostSteps();
            for (var k=0; k<steps.length; k++) {
                var step = steps[k];
                var cArr = null;
                switch (step) {
                    case 0:
                        cArr = this.zeroStepConstraints;
                        break;
                    case 1:
                        cArr = this.oneStepConstraints;
                        break;
                    case 2:
                        cArr = this.twoStepConstraints;
                        break;
                }
                if (cArr != null) {
                    cArr[i].push(constraint);
//                    logit(cArr);
                }
            }
        }
    }


    for (var i=0; i<this.voiceCount; i++) {
        for (var j=i+1; j<this.voiceCount; j++) {
            this.allPairs.push([i, j]);
        }
    }

    for (var i=0; i<this.voiceCount-1; i++) {
        this.adjacentPairs.push([i, i+1]);
    }

    var absoluteNoteRanges = this.absoluteNoteRanges;
    var voiceCount = this.voiceCount;
    var maxSpacings = this.maxSpacings;
    var absoluteNoteHints = this.absoluteNoteHints;

//    logit(JSON.stringify(absoluteNoteHints));

    var maxAbsoluteHintDistances = this.maxAbsoluteHintDistances;
    var chordRootPitchClassConstraints = this.chordRootPitchClassConstraints; // = getValueOrDefault(options, "chordRootPitchClassConstraints", [null, null, null, null]);
    var chordBassPitchClassConstraints = this.chordBassPitchClassConstraints; // = getValueOrDefault(options, "chordBassPitchClassConstraints", [null, null, null, [0]]);
    var chordPitchClassesArr = this.chordPitchClassesArr;
    var constants = this.constants;

    // Recursivly gather all combinations of scale indices and absolute notes
    function gatherDomain(harmonyIndex, voiceIndex,
                          previousAbsNote, previousScaleIndex, currentAbsTuple, currentScaleIndexTuple,
                          resultAbsoluteNoteTuples, resultScaleIndexTuples) {

        var constantsArr = constants[voiceIndex];

        var isConstant = constantsArr[harmonyIndex % constantsArr.length];

        var voiceAbsoluteRanges = absoluteNoteRanges[voiceIndex];
        var absRange = voiceAbsoluteRanges[harmonyIndex % voiceAbsoluteRanges.length];

        var harmonyElement = harmonyElements[harmonyIndex];

        var possibleScaleIndices = {};

        if (isConstant) {

            var scaleIndex = harmonyElement.getScaleIndexAndChromaticOffsetForAbsoluteNote(absRange[0])[0];
            possibleScaleIndices[scaleIndex] = absRange[0];

        } else {

            var chordPitchClasses = chordPitchClassesArr[harmonyIndex];

            var currentAbsNote = previousAbsNote;
            var currentScaleIndex = previousScaleIndex;

            if (!absRange) {
                logit("Could not find absolute note range for voice " + voiceIndex + "<br />");
                absRange = [previousAbsNote, previousAbsNote + 12];
            }
            var currentLowerAbsNote = absRange[0];
            var currentUpperAbsNote = absRange[1];

            currentAbsNote = Math.min(currentUpperAbsNote, currentAbsNote);

            // Check the max spacing between current voice index and next
            if (voiceIndex > 0) {
                var maxSpacingArr = maxSpacings[voiceIndex];
                if (maxSpacingArr && maxSpacingArr.length > 0) {
                    currentLowerAbsNote = Math.max(currentLowerAbsNote, previousAbsNote - maxSpacingArr[harmonyIndex % maxSpacingArr.length]);
                }
            }

            // Check hints for the current voice
            var hints = absoluteNoteHints[voiceIndex];
            var hintDistances = maxAbsoluteHintDistances[voiceIndex];
            if (hints && hintDistances && hints.length > 0 && hintDistances.length > 0) {
                var hintMiddle = hints[harmonyIndex % hints.length];
                if (hintMiddle === null) {
                } else {
                    var hintDistance = hintDistances[harmonyIndex % hintDistances.length];
                    if (hintMiddle === null || hintDistance === null) {
                        // The hint was not valid
                    } else {
                        var upperHint = hintMiddle + hintDistance;
                        var lowerHint = hintMiddle - hintDistance;

                        currentAbsNote = Math.min(currentAbsNote, upperHint);
                        currentLowerAbsNote = Math.max(currentLowerAbsNote, lowerHint);
                    }
                }
            }

            // Restrict chord pitch classes by using the chord root and chord bass constraints
            var chordBassConstraints = chordBassPitchClassConstraints[voiceIndex];
            if (chordBassConstraints && chordBassConstraints.length > 0) {
                var bassIndices = chordBassConstraints[harmonyIndex % chordBassConstraints.length];
                if (bassIndices && bassIndices.length > 0) {
                    chordPitchClasses = [];
                    for (var i=0; i<bassIndices.length; i++) {
                        var pitchClass = harmonyElement.getAbsoluteNoteFromChordBassIndex(bassIndices[i]) % 12;
                        chordPitchClasses.push(pitchClass);
                    }
                }
            }

            var chordRootConstraints = chordRootPitchClassConstraints[voiceIndex];
            if (chordRootConstraints && chordRootConstraints.length > 0) {
                var rootIndices = chordRootConstraints[harmonyIndex % chordRootConstraints.length];
                if (rootIndices && rootIndices.length > 0) {
                    chordPitchClasses = [];
                    for (var i=0; i<rootIndices.length; i++) {
                        var pitchClass = harmonyElement.getAbsoluteNoteFromChordRootIndex(rootIndices[i]) % 12;
                        chordPitchClasses.push(pitchClass);
                        //                    logit("settign croot ppitch cklad " + pitchClass + "<br />");
                    }
                }
            }


            while (currentAbsNote >= currentLowerAbsNote) {
                if (arrayContains(chordPitchClasses, currentAbsNote % 12)) {
                    var currentScaleIndex = harmonyElement.getScaleIndexAndChromaticOffsetForAbsoluteNote(currentAbsNote)[0];
                    possibleScaleIndices[currentScaleIndex] = currentAbsNote;
                }
                //            currentScaleIndex--;
                currentAbsNote--; // = harmonyElement.getAbsoluteNoteFromScaleIndex(currentScaleIndex);
            }
        }

        // Go through all the possible scale indices and gather domain recursively
        for (var scaleIndex in possibleScaleIndices) {
            var absTuple = arrayCopy(currentAbsTuple);
            var scaleIndexTuple = arrayCopy(currentScaleIndexTuple);

            var absNote = possibleScaleIndices[scaleIndex];

            absTuple[voiceIndex] = absNote;
            scaleIndexTuple[voiceIndex] = scaleIndex;

            if (voiceIndex < voiceCount - 1) {
                gatherDomain(harmonyIndex, voiceIndex + 1,
                    absNote, scaleIndex,
                    absTuple, scaleIndexTuple,
                    resultAbsoluteNoteTuples, resultScaleIndexTuples)
            } else {
                // Reached the final voice index
                resultAbsoluteNoteTuples[harmonyIndex].push(absTuple);
                resultScaleIndexTuples[harmonyIndex].push(scaleIndexTuple);
            }
        }
    }

    var resultAbsoluteNoteTuples = [];
    var resultScaleIndexTuples = [];


//    voiceLeadingPrepareTimer.start();

    // Calculate all the possible state combinations without any concerns for
    // horizontal stuff like maximum leaps etc.

//    logit("Calculating index ");
//    var reusableIndex = JSON.stringify([absoluteNoteRanges, harmonyElements, voiceCount, maxSpacings, absoluteNoteHints, maxAbsoluteHintDistances,
//        chordRootPitchClassConstraints, chordBassPitchClassConstraints, chordPitchClassesArr, constants]);
////    logit("Done Calculating index " + reusableIndex);
//    var toReuse = this.reusables[reusableIndex];
//    if (toReuse) {
//        logit("REusing domain for voice leading");
//        resultAbsoluteNoteTuples = copyValueDeep(toReuse[0]);
//        resultScaleIndexTuples = copyValueDeep(toReuse[1]);
//    } else {

    for (var i=0; i<harmonyElements.length; i++) {
        var voiceAbsoluteRanges = this.absoluteNoteRanges[0];
        var upperMaxAbsNote = voiceAbsoluteRanges[i % voiceAbsoluteRanges.length][1];
        var upperMaxScaleIndex = harmonyElement.getScaleIndexAndChromaticOffsetForAbsoluteNote(upperMaxAbsNote)[0];
        resultAbsoluteNoteTuples[i] = [];
        resultScaleIndexTuples[i] = [];
        gatherDomain(i, 0, upperMaxAbsNote, upperMaxScaleIndex, [], [], resultAbsoluteNoteTuples, resultScaleIndexTuples);
        //        logit("Domain for harmony " + i + ": " + JSON.stringify(resultAbsoluteNoteTuples[i]) + "<br />");
    }
//        this.reusables[reusableIndex] = copyValueDeep([resultAbsoluteNoteTuples, resultScaleIndexTuples]);
//    }

//    voiceLeadingPrepareTimer.pause();


    this.possibleAbsoluteNoteTuples = resultAbsoluteNoteTuples;
    this.possibleScaleIndexTuples = resultScaleIndexTuples;


    for (var i=0; i<harmonyElements.length; i++) {
        var domain = this.possibleAbsoluteNoteTuples[i];
        var scaleDomain = this.possibleScaleIndexTuples[i];
//        logit(scaleDomain);
        for (var j=0; j<scaleDomain.length; j++) {
            for (var k=0; k<scaleDomain[j].length; k++) {
                scaleDomain[j][k] = parseInt(scaleDomain[j][k]);
            }
        }
//        logit(scaleDomain);
        // logit("Domain size for index " + i + ": " + domain.length + "<br />");
        //        logit("Domain for index " + i + ": " + domain.join(", ") + "<br />");
    }


    // Sort the domain increasingly according to the zero step cost
    // (spacing, doubling, hints, range, chord completeness)

    this.zeroStepCosts = [];
    this.oneStepCosts = [];

    this.zeroStepDomainIndices = [];
    this.oneStepDomainIndices = [];



    for (var i=0; i<harmonyElements.length; i++) {
        var domain = this.possibleAbsoluteNoteTuples[i];
        var scaleDomain = this.possibleScaleIndexTuples[i];


        var costs = createFilledArray(domain.length, 0);
        var zeroStepIndices = createFilledNumericIncArray(domain.length, 0, 1);


        for (var j=0; j<domain.length; j++) {
            costs[j] = this.getZeroStepCost(i, j);
            if (isNaN(costs[j])) {
                logit("NaN cost for domain " + domain[j].join(",") + " verbose follows:<br />");
                this.getZeroStepCost(i, j, true);
            }
        }
        //        logit("costs for index " + i + ": " + costs.join(", ") + "<br />");

        zeroStepIndices.sort(function(a, b) {
            return costs[a] - costs[b];
        });



        var maxDomainSize = this.maxDomainSize;
        var newDomain = [];
        var newScaleDomain = [];
        var newCosts = [];
        for (var j=0; j<Math.min(maxDomainSize, zeroStepIndices.length); j++) {
            var index = zeroStepIndices[j];
            newDomain[j] = domain[index];
            newScaleDomain[j] = scaleDomain[index];
            newCosts[j] = costs[index];
        }
//        logit(i + " Domain before " + domain.length + " Domain after: " + newDomain.length);

        // Reset the indices, the domain is now sorted
        this.zeroStepDomainIndices[i] = createFilledNumericIncArray(newDomain.length, 0, 1);

        this.zeroStepCosts[i] = newCosts;
        this.possibleAbsoluteNoteTuples[i] = newDomain;
        this.possibleScaleIndexTuples[i] = newScaleDomain;



//        logit(i + " new scale domain " + JSON.stringify(newScaleDomain));
//        logit(i + " new domain " + JSON.stringify(newDomain));
//        logit(i + " new costs " + JSON.stringify(newCosts));
        if (i > 0) {
            this.oneStepCosts[i] = [];
            this.oneStepHeuristicCosts[i] = [];
            this.oneStepDomainIndices[i] = [];

            var prevDomain = this.possibleAbsoluteNoteTuples[i - 1];

            for (var j=0; j<prevDomain.length; j++) {
                this.oneStepCosts[i][j] = [];
                this.oneStepHeuristicCosts[i][j] = [];
//                var fromAbsNotes = prevDomain[j];
//                for (var k=0; k<newDomain.length; k++) {
//                    var toAbsNotes = newDomain[k];
//
//                    var heurCost = 0;
//                    for (var l=0; l<fromAbsNotes.length; l++) {
//                        var from = fromAbsNotes[l];
//                        var to = toAbsNotes[l];
//                        heurCost += 0.25 * Math.abs(from - to);
//                    }
//                    this.oneStepHeuristicCosts[i][j][k] = heurCost; // this.getOneStepCost(i, j, k);
//                }
            }

            //            var that = this;
            //            for (var j=0; j<prevDomain.length; j++) {
            //                this.oneStepDomainIndices[i][j] = createFilledNumericIncArray(domain.length, 0, 1);
            //
            //                this.oneStepDomainIndices[i][j].sort(function(a, b) {
            //                    return (that.zeroStepCosts[i][a] + that.oneStepCosts[i][j][a]) -
            //                    (that.zeroStepCosts[i][b] + that.oneStepCosts[i][j][b]);
            //                });
            //            }
        }


    }


//    logit("maxSpacings: " + JSON.stringify(this.maxSpacings) + " <br />");
//    logit("absoluteNoteRanges: " + JSON.stringify(this.absoluteNoteRanges) + " <br />");
//    logit("penaltyMaxSpacings: " + JSON.stringify(this.penaltyMaxSpacings) + " <br />");
//    logit("penaltyMaxAbsoluteHintDistances: " + JSON.stringify(this.penaltyMaxAbsoluteHintDistances) + " <br />");
//    logit("penaltyAbsoluteNoteRanges: " + JSON.stringify(this.penaltyAbsoluteNoteRanges) + " <br />");
//    logit("absoluteNoteHints: " + JSON.stringify(this.absoluteNoteHints) + " <br />");

};

ClassicalVoiceLineGenerator.prototype.createInitialState = function() {
    return new ClassicalVoiceLineState();
};


ClassicalVoiceLineGenerator.prototype.extractSolution = function(state, harmonyIndex) {
    var result = [];
    //    var absoluteNotes = this.possibleAbsoluteNoteTuples[harmonyIndex][state.stateIndex];
//    logit("state index: " + state.stateIndex + " harmonyIndex: " + harmonyIndex);
    var scaleIndices = this.possibleScaleIndexTuples[harmonyIndex][state.stateIndex];
    for (var i=0; i<scaleIndices.length; i++) {
        var undef = false;
        if (this.undefines && this.undefines.length > 0) {
            var undefinesArr = this.undefines[i % this.undefines.length];
            if (undefinesArr.length > 0) {
                undef = undefinesArr[harmonyIndex % undefinesArr.length];
            }
        }
        if (undef) {
            result.push(new UndefinedVoiceLineElement());
        } else {
            var vle = new ConstantVoiceLineElement();
            //            var theState = this.resultStates[harmonyIndex];
            //    var preCalcScaleIndexTuples = this.possibleScaleIndexTuples[index];
            vle.setIndexType(IndexType.SCALE);
            vle.setSnapType(SnapType.NONE);
            vle.setIndex(scaleIndices[i]);
            vle.suspend = this.suspensions[i][harmonyIndex];
            result.push(vle);
        }
    }
    return result;
};

