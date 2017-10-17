



PhraseHarmonyElement.prototype.getSeed = function(rnd, localSeed, useLocalSeed) {
    var result = localSeed;

    if (!useLocalSeed) {
        result = rnd.genrand_int32();
    }
    return result;
};


PhraseHarmonyElement.prototype.shiftRight = function(copy, i) {
    var indices = copy[i];
    var nextIndices = copy[i + 1];
    nextIndices.unshift(indices.pop());
};

PhraseHarmonyElement.prototype.shiftLeft = function(copy, i) {
    var indices = copy[i];
    var prevIndices = copy[i - 1];
    prevIndices.push(indices.shift());
};



PhraseHarmonyElement.prototype.getSuccessors = function(currentIndices, lengthInfos, beatLengths) {
    var result = [];
    for (var i=0; i<currentIndices.length; i++) {
        if (currentIndices[i].length > 1) {
            if (i > 0) {
                // Move one element from the current to the previous
                var copy = array2dCopy(currentIndices);
                this.shiftLeft(copy, i);
                result.push(copy);
                if (i > 1) {
                    copy = array2dCopy(copy);
                    this.shiftLeft(copy, i - 1);
                    result.push(copy);
                }
            }
            if (i < currentIndices.length - 1) {
                // Move one element from the current to the next
                var copy = array2dCopy(currentIndices);
                this.shiftRight(copy, i);
                result.push(copy);
                if (i < currentIndices.length - 2) {
                    copy = array2dCopy(copy);
                    this.shiftRight(copy, i + 1);
                    result.push(copy);
                }
            }
        }
    }
    //    logit("____Returning successors: " + JSON.stringify(result) + "<br />");
    return result;
};


PhraseHarmonyElement.prototype.getBestSuccessor = function(currentIndices, lengthInfos, beatLengths, totalLength) {
    var successors = this.getSuccessors(currentIndices, lengthInfos, beatLengths);
    var bestPenalty = 9999999;
    var result = successors[0];
    for (var i=0; i<successors.length; i++) {
        var succ = successors[i];
        var penalty = this.getPenalty(succ, lengthInfos, beatLengths, totalLength);
        if (penalty < bestPenalty) {
            result = succ;
            bestPenalty = penalty;
        }
    }
    return result;
};




PhraseHarmonyElement.prototype.getBeatLengthFromIndices = function(indices, beatLengths) {
    var result = 0;
    for (var i=0; i<indices.length; i++) {
        result += beatLengths[indices[i]];
    }
    return result;
};


PhraseHarmonyElement.prototype.getSinglePenalty = function(currentValue, wantedValue) {
    var fraction = Math.abs(currentValue - wantedValue) / wantedValue;

    return fraction;
};


PhraseHarmonyElement.prototype.getPenalty = function(currentIndices, lengthInfos, beatLengths, totalLength) {
    var resultPenalty = 0;

    //    logit("_____Getting penalty for " + JSON.stringify(currentIndices) + "<br />");

    for (var i=0; i<currentIndices.length; i++) {
        var indices = currentIndices[i];
        var lengthInfo = lengthInfos[i];
        var wantedLength = lengthInfo.length;
        var wantedLengthUnit = lengthInfo.lengthUnit;
        var currentCount = indices.length;
        var currentBeatLength = this.getBeatLengthFromIndices(indices, beatLengths);

        var penaltyInc = 0;
        switch (wantedLengthUnit) {
            case LengthAndCountUnit.COUNT:
                var wantedCount = wantedLength;
                penaltyInc = this.getSinglePenalty(currentCount, wantedCount);
                break;
            case LengthAndCountUnit.COUNT_PERCENT:
                var wantedCount = wantedLength * 0.01 * beatLengths.length;
                penaltyInc = this.getSinglePenalty(currentCount, wantedCount);
                break;
            case LengthAndCountUnit.LENGTH:
                var wantedBeatLength = wantedLength;
                penaltyInc = this.getSinglePenalty(currentBeatLength, wantedBeatLength);
                break;
            case LengthAndCountUnit.LENGTH_PERCENT:
                var wantedBeatLength = wantedLength * 0.01 * totalLength;
                penaltyInc = this.getSinglePenalty(currentBeatLength, wantedBeatLength);
                //                logit("_______element penalty " + i + " was " + penaltyInc + " total: " + resultPenalty + " wanted length: " +
                //                    wantedLength + " " + LengthAndCountUnit.toString(wantedLengthUnit) +
                //                    " wanted beat length: " + wantedBeatLength +
                //                    " total length: " + totalLength +
                //                    " current beat length: " + currentBeatLength +
                //                    "<br />");
                break;
        }
        resultPenalty += penaltyInc * lengthInfo.importance;
    }
    return resultPenalty;
};


PhraseHarmonyElement.prototype.getBestIndices = function(startIndices, lengthInfos, beatLengths, totalLength) {

    var current = startIndices;

    var lowestPenalty = this.getPenalty(current, lengthInfos, beatLengths, totalLength);

    var indexCount = 0;
    for (var i=0; i<current.length; i++) {
        indexCount += current[i].length;
    }

    var fillCount = indexCount - current.length + 1;
    // Find a good start state by filling each to the max
    for (var i=0; i<current.length; i++) {
        var temp = [];
        var currentIndex = 0;
        for (var j=0; j<current.length; j++) {
            temp[j] = [];
            if (j == i) {
                temp[j] = createFilledNumericIncArray(fillCount, currentIndex, 1);
                currentIndex += fillCount;
            } else {
                temp[j] = [currentIndex];
                currentIndex += 1;
            }
        }
//        logit("Creating test start state " + JSON.stringify(temp));
        var penalty = this.getPenalty(temp, lengthInfos, beatLengths, totalLength);
        if (penalty < lowestPenalty) {
            lowestPenalty = penalty;
            current = temp;
        }
    }

    //    logit("_starting getting best indices: " + JSON.stringify(current) + " penalty: " + lowestPenalty + "<br />");
    for (var i=0; i<this.maxLengthSearchSteps; i++) {
        var successor = this.getBestSuccessor(current, lengthInfos, beatLengths, totalLength);
        if (successor) {
            var penalty = this.getPenalty(successor, lengthInfos, beatLengths, totalLength);
            //        logit("__best successor: " + JSON.stringify(successor) + " penalty: " + penalty + "<br />");
            if (penalty < lowestPenalty) {
                current = successor;
                lowestPenalty = penalty;
            } else {
                break;
            }
        }
    }

    return current;
};

PhraseHarmonyElement.prototype.getLengthInfos = function(options, module) {

    var modulate = getValueOrDefault(options,  "modulate", false);

    var skipInitialTonic = getValueOrDefault(options,  "skipInitialTonic", false);
    var skipDynamicHarmony = getValueOrDefault(options,  "skipDynamicHarmony", false);
    var skipDominant = getValueOrDefault(options,  "skipDominant", false);
    var skipTonicCadence = getValueOrDefault(options,  "skipTonicCadence", false);

    var staticHarmonyLength = getValueOrExpressionValue(this, "staticHarmonyLength", module);
    var dynamicHarmonyLength = getValueOrExpressionValue(this, "dynamicHarmonyLength", module);
    var dominantCadenceHarmonyLength = getValueOrExpressionValue(this, "dominantCadenceHarmonyLength", module);
    var tonicCadenceHarmonyLength = getValueOrExpressionValue(this, "tonicCadenceHarmonyLength", module);

    var lengthInfos = [];
    if (!skipInitialTonic) {
        lengthInfos.push({
            importance: this.staticHarmonyLengthImportance,
            length: modulate ? this.modulateStaticLengthFactor * staticHarmonyLength : staticHarmonyLength,
            lengthUnit: this.staticHarmonyLengthUnit,
            lengthLimits: this.staticHarmonyLengthLimits,
            lengthLimitsUnit: this.staticHarmonyLengthLimitsUnit
        });
    }
    if (!skipDynamicHarmony) {
        lengthInfos.push({
            importance: this.dynamicHarmonyLengthImportance,
            length: modulate ? this.modulateDynamicLengthFactor * dynamicHarmonyLength : dynamicHarmonyLength,
            lengthUnit: this.dynamicHarmonyLengthUnit,
            lengthLimits: this.dynamicHarmonyLengthLimits,
            lengthLimitsUnit: this.dynamicHarmonyLengthLimitsUnit
        });
    }

    if (!skipDominant) {
        lengthInfos.push({
            importance: this.dominantCadenceHarmonyLengthImportance,
            length: modulate ? this.modulateDominantCadenceLengthFactor * dominantCadenceHarmonyLength : dominantCadenceHarmonyLength,
            lengthUnit: this.dominantCadenceHarmonyLengthUnit,
            lengthLimits: this.dominantCadenceHarmonyLengthLimits,
            lengthLimitsUnit: this.dominantCadenceHarmonyLengthLimitsUnit
        });
    }
    if (!skipTonicCadence) {
        lengthInfos.push(
            {
                importance: this.tonicCadenceHarmonyLengthImportance,
                length: modulate ? this.modulateTonicCadenceLengthFactor * tonicCadenceHarmonyLength : tonicCadenceHarmonyLength,
                lengthUnit: this.tonicCadenceHarmonyLengthUnit,
                lengthLimits: this.tonicCadenceHarmonyLengthLimits,
                lengthLimitsUnit: this.tonicCadenceHarmonyLengthLimitsUnit
            });
    }



    // Normalize percent if they are all of the same length unit
    var lu = lengthInfos[0].lengthUnit;

    if (lu == LengthAndCountUnit.LENGTH_PERCENT || lu == LengthAndCountUnit.COUNT_PERCENT) {
        var allSame = true;
        var sum = 0;
        for (var i=0; i<lengthInfos.length; i++) {
            var lengthUnit = lengthInfos[i].lengthUnit;
            if (lu != lengthUnit) {
                allSame = false;
            } else {
                sum += lengthInfos[i].length;
            }
        }
        if (allSame && sum > 0) {
            for (var i=0; i<lengthInfos.length; i++) {
                var lengthInfo = lengthInfos[i];
                lengthInfo.length = 100 * (lengthInfo.length / sum);
            }
        }
    }

//    logit(lengthInfos);


    return lengthInfos;
};

PhraseHarmonyElement.prototype.countSevenths = function(solution) {
    var result = 0;
    for (var i=0; i<solution.length; i++) {
        if (solution[i].chordType == ChordType.SEVENTH) {
            result++;
        }
    }
    return result;
};


PhraseHarmonyElement.prototype.getConstantHarmonyElements = function(module, beatOffset) {

    harmonyTimer.start();


    var theSeed = getValueOrExpressionValue(this, "seed", module);

    var theScaleBaseNote = getValueOrExpressionValue(this, "scaleBaseNote", module);

    var beatLengths = this.getBeatLengths(module);

//    if (beatLengths[0] == 1 && beatLengths.length == 1) {
//        logit(this._constructorName + " got beat length low " + beatLengths.join(", "));
//    }
    var startBeatStrengths = this.getStartBeatStrengths(module, beatLengths, beatOffset);

    var theScaleType = getValueOrExpressionValue(this, "scaleType", module);
    var thePhraseType = getValueOrExpressionValue(this, "phraseType", module);
    var doModulate = getValueOrExpressionValue(this, "modulate", module);
    var modulateInvertScaleType = getValueOrExpressionValue(this, "modulateInvertScaleType", module);
    var theMajorModulationTarget = getValueOrExpressionValue(this, "majorModulationTarget", module);
    var theMinorModulationTarget = getValueOrExpressionValue(this, "minorModulationTarget", module);

    var majorDeceptiveRoot = getValueOrExpressionValue(this, "majorDeceptiveRoot", module);
    var minorDeceptiveRoot = getValueOrExpressionValue(this, "minorDeceptiveRoot", module);

//    logit(this._constructorName + " beatLengths: " + beatLengths.join(", "));

    var raiseLeadingTone = getValueOrExpressionValue(this, "raiseLeadingTone", module);

    var isMinor = theScaleType == ScaleType.NATURAL_MINOR;

    var replan = true;
    var didReplan = false;

    var modulateRemoveDominant = this.modulateRemoveDominant;

    var modulateRemoveInitialTonic = this.modulateRemoveInitialTonic;


    while (replan) {
        replan = false;

        var rnd = new MersenneTwister(theSeed);

        var skipInitialTonic = false;
        var skipDynamicHarmony = false;
        var skipDominant = false;
        var skipTonicCadence = false;

        var tonicCadenceBase = 0;

        var dominantBaseRoot = 4;

        var majorModulationPossibleEndRoots = [1, 3, 5];
        var minorModulationPossibleEndRoots = [3, 5];
        var majorModulationPossibleEndInversions = [[0]];
        var minorModulationPossibleEndInversions = [[0]];

        var rootPitchCost = 5;

        var dynamicMajorStartRoots = [1, 3];
        var dynamicMinorStartRoots = [3];
        var dynamicMajorPossibleEndRoots = [1, 3, 5];
        var dynamicMinorPossibleEndRoots = [3, 5];

        var endVoiceConstraints = [];

        var dynamicIsChromatic = false;
        var chromaticStartTuples = [[theScaleBaseNote, 0, 0]]; // scale base, chord root, scale mode
        var chromaticEndTuples = [[theScaleBaseNote, 3, 0]];
        var chromaticChangeScaleModeCost = 0;
        var chromaticChangeChordRootCost = 0;
        var chromaticChangeScaleBaseCost = 0;

        var lengthenFinalTonic = false;
        var lengthenDominant = false;

        var staticIsChromatic = false;
        var chromaticOscillationStartTuples = [[theScaleBaseNote, 0, 0]]; // scale base, chord root, scale mode
        var chromaticOscillationEndTuples = [[theScaleBaseNote, 0, 0]];

        if (!isMinor) {
            chromaticEndTuples.push([theScaleBaseNote, 3, 0]);
        }
        var che = new ConstantHarmonyElement().setBaseNote(theScaleBaseNote).setScaleType(theScaleType);

        switch (thePhraseType) {
            case PhraseHarmonyElementType.INCOMPLETE_NO_DOMINANT:
                dynamicMajorPossibleEndRoots = [1, 3];
                dynamicMinorPossibleEndRoots = [3];
                skipTonicCadence = true;
                skipDominant = true;
                break;
            case PhraseHarmonyElementType.CHROMATIC_OSCILLATION:
                skipDynamicHarmony = true;
                skipDominant = true;
                skipTonicCadence = true;
                staticIsChromatic = true;
                chromaticOscillationEndTuples = [];
                for (var j=0; j<12; j++) {
                    chromaticOscillationEndTuples.push([theScaleBaseNote + j, 0, 0]);
                }
                break;
            case PhraseHarmonyElementType.CHROMATIC_TRANSITION_INCOMPLETE:
                skipInitialTonic = true;
                skipTonicCadence = true;
                skipDominant = false;
                var targetScaleBase = che.getAbsoluteNoteFromScaleIndex(3);
                chromaticEndTuples = [[targetScaleBase, 0, 0]];
                dynamicIsChromatic = true;
                chromaticChangeScaleModeCost = 20;
                chromaticChangeChordRootCost = 20;
                break;
            case PhraseHarmonyElementType.CHROMATIC_TRANSITION_COMPLETE:
                skipInitialTonic = true;
                skipTonicCadence = false;
                skipDominant = false;
                chromaticChangeScaleModeCost = 20;
                chromaticChangeChordRootCost = 20;
                var targetScaleBase = che.getAbsoluteNoteFromScaleIndex(3);
                chromaticEndTuples = [[theScaleBaseNote, 0, 0]];
                dynamicIsChromatic = true;
                endVoiceConstraints.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([[1, 2, 3], [], [], []]).setRootPitchCosts([[rootPitchCost]]));
                break;
            case PhraseHarmonyElementType.CHROMATIC_TRANSITION_MODULATE:
            case PhraseHarmonyElementType.CHROMATIC_TRANSITION_TONICIZE:
                skipInitialTonic = true;
                skipTonicCadence = true;
                skipDominant = true;
                var modTarget = theScaleType == ScaleType.NATURAL_MINOR ? theMinorModulationTarget : theMajorModulationTarget;
                var newScaleBaseNote = che.getAbsoluteNoteFromScaleIndex(modTarget + 1);
                // Modulate by changing the scale mode and the scale base note
                chromaticChangeChordRootCost = 20;
                chromaticChangeScaleModeCost = 10;
                chromaticEndTuples = [[newScaleBaseNote, 0, modTarget + 1]];
//                logit("chromatic modulation to " + modTarget);

                dynamicIsChromatic = true;
                endVoiceConstraints.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([[1, 2, 3], [], [], []]).setRootPitchCosts([[rootPitchCost]]));
                break;
            case PhraseHarmonyElementType.COMPLETE_IMPERFECT:
                // Can not end on root
                endVoiceConstraints.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([[0], [], [], []]).setRootPitchCosts([[rootPitchCost]]));
                break;
            case PhraseHarmonyElementType.COMPLETE:
                endVoiceConstraints.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([[1, 2, 3], [], [], []]).setRootPitchCosts([[rootPitchCost]]));
                break;
            case PhraseHarmonyElementType.COMPLETE_LENGTHEN_FINAL_TONIC:
                lengthenFinalTonic = true;
                endVoiceConstraints.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([[1, 2, 3], [], [], []]).setRootPitchCosts([[rootPitchCost]]));
                break;
            case PhraseHarmonyElementType.COMPLETE_LENGTHEN_DOMINANT:
                lengthenDominant = true;
                endVoiceConstraints.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([[1, 2, 3], [], [], []]).setRootPitchCosts([[rootPitchCost]]));
                break;
            case PhraseHarmonyElementType.COMPLETE_PLAGIAL:
                endVoiceConstraints.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([[1, 2, 3], [], [], []]).setRootPitchCosts([[rootPitchCost]]));
                dominantBaseRoot = 3;
                break;
            case PhraseHarmonyElementType.COMPLETE_MODULATE:
            case PhraseHarmonyElementType.COMPLETE_TONICIZE:
                endVoiceConstraints.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([[1, 2, 3], [], [], []]).setRootPitchCosts([[rootPitchCost]]));
                doModulate = true;
                break;
            case PhraseHarmonyElementType.COMPLETE_MODULATE_IMPERFECT:
            case PhraseHarmonyElementType.COMPLETE_TONICIZE_IMPERFECT:
                endVoiceConstraints.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([[0], [], [], []]).setRootPitchCosts([[rootPitchCost]]));
                doModulate = true;
                break;
            case PhraseHarmonyElementType.DECEPTIVE:
                // Should not end on tonic
//                endVoiceConstraints.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([[1], [], [], []]).setRootPitchCosts([[rootPitchCost]]));
                tonicCadenceBase = isMinor ? minorDeceptiveRoot : majorDeceptiveRoot;
                break;
            case PhraseHarmonyElementType.INCOMPLETE:
                skipTonicCadence = true;
                break;
            case PhraseHarmonyElementType.INCOMPLETE_INITIAL:
                skipInitialTonic = true;
                break;
            case PhraseHarmonyElementType.ANTECEDENT_CONSEQUENT:
            case PhraseHarmonyElementType.CONSEQUENT:
                endVoiceConstraints.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([[1, 2, 3], [], [], []]).setRootPitchCosts([[rootPitchCost]]));
                skipTonicCadence = true;
                break;
            case PhraseHarmonyElementType.PROLONGED_DOMINANT_CADENCE:
                endVoiceConstraints.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([[1, 2, 3], [], [], []]).setRootPitchCosts([[rootPitchCost]]));
                skipInitialTonic = true;
                skipDynamicHarmony = true;
                break;
            case PhraseHarmonyElementType.PROLONGED_DOMINANT:
                skipInitialTonic = true;
                skipDynamicHarmony = true;
                skipTonicCadence = true;
                break;
            case PhraseHarmonyElementType.PROLONGED_TONIC:
                skipDynamicHarmony = true;
                skipDominant = true;
                skipTonicCadence = true;
                break;
            case PhraseHarmonyElementType.PROLONGED_TONIC_COMPLETE:
                endVoiceConstraints.push(new VoiceChordNotesVoiceLinePlannerConstraint().setRootPitches([[1, 2, 3], [], [], []]).setRootPitchCosts([[rootPitchCost]]));
                skipDynamicHarmony = true;
                break;
            case PhraseHarmonyElementType.PROLONGED_TONIC_INCOMPLETE:
                skipDynamicHarmony = true;
                skipTonicCadence = true;
                break;
        }

        if (doModulate) {
            if (modulateRemoveDominant) {
                skipDominant = true;
                minorModulationPossibleEndRoots = [4];
                majorModulationPossibleEndRoots = [4];
                minorModulationPossibleEndInversions = [[0]];
                majorModulationPossibleEndInversions = [[0]];
            }
            if (modulateRemoveInitialTonic) {
                skipInitialTonic = true;
                dynamicMinorStartRoots = [0];
                dynamicMajorStartRoots = [0];
            }
        }

        var minCount = 4;
        if (skipInitialTonic) {
            minCount--;
        }
        if (skipDynamicHarmony) {
            minCount--;
        }
        if (skipDominant) {
            minCount--;
        }
        if (skipTonicCadence) {
            minCount--;
        }
        if (minCount == 0) {
            skipTonicCadence = false;
        }

//        if (beatLengths[0] == 1 && beatLengths.length == 1) {
//            logit(this._constructorName + " minCount " + minCount);
//        }

        if (beatLengths.length < minCount) {
            return [new ConstantHarmonyElement().setBaseNote(theScaleBaseNote).setScaleType(theScaleType)];
        }

        var indices = [];

        for (var i=0; i<minCount; i++) {
            if (i == 0) {
                indices.push(createFilledNumericIncArray(beatLengths.length - minCount + 1, 0, 1));
            } else {
                indices.push([beatLengths.length - minCount + i]);
            }
        }

        var lengthInfos = this.getLengthInfos({
            skipInitialTonic: skipInitialTonic,
            skipDynamicHarmony: skipDynamicHarmony,
            skipDominant: skipDominant,
            skipTonicCadence: skipTonicCadence,
            modulate: doModulate
        }, module);

        var totalLength = 0;
        for (var i=0; i<beatLengths.length; i++) {
            totalLength += beatLengths[i];
        }
//        logit("Starting indices: " + JSON.stringify(indices) + "<br />");
//    logit(lengthInfos);
        if (indices.length > 1) {
            indices = this.getBestIndices(indices, lengthInfos, beatLengths, totalLength);
        }
//        logit("Result indices: " + JSON.stringify(indices) + "<br />");



        var dynamicIndex = 1;
        var dominantIndex = 2;
        var finalTonicIndex = 3;

        var solution = [];

        function raiseLeading(sol, scaleType, scaleBase, roots, verbose) {
            if (raiseLeadingTone) {
                for (var i=0; i<sol.length; i++) {
                    var s = sol[i];
                    if (s.scaleMode == 0 &&
                        s.scaleType == ScaleType.NATURAL_MINOR &&
                        s.scaleType == scaleType && s.baseNote == scaleBase) {

                        var chordRootScaleIndex = positiveMod(s.getChordRootScaleIndex(), 7);

                        if (arrayContains(roots, chordRootScaleIndex)) {
                            s.scaleType = ScaleType.MELODIC_MINOR;
                            if (verbose) {
                                logit("raising leading!");
                            }
                        }
//                s.getChordAbsoluteNotes();
                    }
                }
            }
        }

        function getBeatStrengths(indices, beatStrengths) {
            var result = [];
            for (var i=0; i<indices.length; i++) {
                var index = indices[i];
                result.push(beatStrengths[index % beatStrengths.length]);
            }
            return result;
        }


        if (!skipInitialTonic) {
            var staticOptions = {};
            staticOptions.count = indices[0].length;
            staticOptions.startBeatStrengths = getBeatStrengths(indices[0], startBeatStrengths);
            staticOptions.seed = this.getSeed(rnd, this.staticHarmonySeed, this.staticHarmonyUseLocalSeed);
            //    logit("Static seed " + staticOptions.seed + "<br />");
            staticOptions.scaleType = theScaleType;
            staticOptions.scaleBaseNote = theScaleBaseNote;

            var staticSolution = null;

            if (staticIsChromatic) {
//                logit("Calling oscillating chromatic generator " + staticOptions.count + " indices: " + indices[0].join(", "));

                staticOptions.startScaleBaseChordRootScaleModeTuples = chromaticOscillationStartTuples;
                staticOptions.endScaleBaseChordRootScaleModeTuples = chromaticOscillationEndTuples;

                var chromaticGenerator = new ChromaticOscillationHarmonyGenerator(staticOptions);

                var reuseIndex = JSON.stringify(chromaticGenerator);
                var toReuse = module.reusables[reuseIndex];
                if (toReuse) {
                    staticSolution = copyValueDeep(toReuse);
                } else {
                    staticSolution = chromaticGenerator.searchML();
                    module.reusables[reuseIndex] = copyValueDeep(staticSolution);
                }

//                raiseLeading(staticSolution, theScaleType, theScaleBaseNote,
//                    raiseLeadingTone ? [4, 6] : []);

//                if (staticSolution && staticOptions.count > 2) {
//                    logit(JSON.stringify(staticSolution));
//                }

            } else {

                staticOptions.baseSeventhLikelihoods = [[0]];
                staticOptions.startWithAccented64Likelihood = 0;
                staticOptions.startWithoutAccented64Likelihood = 1;

                staticOptions.baseToNeighbourLikelihood = getValueOrExpressionValue(this, "staticHarmonyNeighbourChordLikelihood", module);
                staticOptions.auxiliaryToNeighbourLikelihood = getValueOrExpressionValue(this, "staticHarmonyNeighbourChordLikelihood", module);
                staticOptions.baseToPassingLikelihood = getValueOrExpressionValue(this, "staticHarmonyPassingChordLikelihood", module);
                staticOptions.simpleMixtureLikelihood = getValueOrExpressionValue(this, "staticHarmonySimpleMixtureLikelihood", module);
                staticOptions.sus2Likelihood = getValueOrExpressionValue(this, "staticHarmonySus2ChordLikelihood", module);
                staticOptions.sus4Likelihood = getValueOrExpressionValue(this, "staticHarmonySus4ChordLikelihood", module);

//            logit(staticOptions.simpleMixtureLikelihood);

                var staticGenerator = new StaticHarmonyGenerator(staticOptions);

                var reuseIndex = JSON.stringify(staticGenerator);
                var toReuse = module.reusables[reuseIndex];
                if (toReuse) {
                    staticSolution = copyValueDeep(toReuse);
//                logit("Reusing static tonic harmony");
                } else {
                    staticSolution = staticGenerator.searchML();
                    module.reusables[reuseIndex] = copyValueDeep(staticSolution);
                }

                raiseLeading(staticSolution, theScaleType, theScaleBaseNote,
                    getValueOrExpressionValue(this, "staticHarmonyRaiseLeadingToneRoots", module));

//        if (staticSolution[0].chordType == ChordType.SEVENTH) {
//            logit("static tonic had seventh!" + i);
//        } else {
//            logit("static tonic had no seventh!" + i);
//        }
//        for (var i=0; i<staticSolution.length; i++) {
//            if (staticSolution[i].chordType == ChordType.SEVENTH) {
//                logit("static tonic had seventh!" + i);
//            }
//        }
                //    logit("static solution length: " + staticSolution.length + "<br />");

            }
            addAll(solution, staticSolution);
        } else {
            dynamicIndex--;
            dominantIndex--;
            finalTonicIndex--;
        }

        var dynamicSolution = null;


        if (!skipDynamicHarmony) {
            var dynamicOptions = {};


            dynamicOptions.count = indices[dynamicIndex].length;
            dynamicOptions.seed = this.getSeed(rnd, this.dynamicHarmonySeed, this.dynamicHarmonyUseLocalSeed);
            dynamicOptions.scaleType = theScaleType;
            dynamicOptions.scaleBaseNote = theScaleBaseNote;
            dynamicOptions.startBeatStrengths = getBeatStrengths(indices[dynamicIndex], startBeatStrengths);

            if (dynamicIsChromatic) {
//                logit("Calling chromatic generator " + dynamicOptions.count + " indices: " + indices.join(", "));

                dynamicOptions.scaleBaseChordRootScaleModeTuples = chromaticStartTuples;
                dynamicOptions.endScaleBaseChordRootScaleModeTuples = chromaticEndTuples;
                dynamicOptions.chordRootChangeCost = chromaticChangeChordRootCost;
                dynamicOptions.scaleBaseChangeCost = chromaticChangeScaleBaseCost;
                dynamicOptions.scaleModeChangeCost = chromaticChangeScaleModeCost;

                var chromaticGenerator = new ChromaticTransitionHarmonyGenerator(dynamicOptions);

                var reuseIndex = JSON.stringify(chromaticGenerator);
                var toReuse = module.reusables[reuseIndex];
                var dynamicSolution = null;
                if (toReuse) {
                    dynamicSolution = copyValueDeep(toReuse);
                    //                logit("Reusing dynamic harmony");
                } else {
                    dynamicSolution = chromaticGenerator.searchML();
                    module.reusables[reuseIndex] = copyValueDeep(dynamicSolution);
                }

                raiseLeading(dynamicSolution, theScaleType, theScaleBaseNote,
                    raiseLeadingTone ? [4, 6] : []);

//                if (dynamicSolution && dynamicOptions.count > 2) {
//                    logit(JSON.stringify(dynamicSolution));
//                }


            } else {

                dynamicOptions.majorStartRoots = dynamicMajorStartRoots;
                dynamicOptions.minorStartRoots = dynamicMinorStartRoots;

                dynamicOptions.modulate = doModulate;
                dynamicOptions.modulateInvertScaleType = modulateInvertScaleType;
                dynamicOptions.majorModulationTarget = theMajorModulationTarget;
                dynamicOptions.minorModulationTarget = theMinorModulationTarget;

                dynamicOptions.neighbourLikelihood = getValueOrExpressionValue(this, "dynamicHarmonyNeighbourChordLikelihood", module);
                dynamicOptions.passingLikelihood = getValueOrExpressionValue(this, "dynamicHarmonyPassingChordLikelihood", module);
                dynamicOptions.simpleMixtureLikelihood = getValueOrExpressionValue(this, "dynamicHarmonySimpleMixtureLikelihood", module);
                dynamicOptions.sus2Likelihood = getValueOrExpressionValue(this, "dynamicHarmonySus2ChordLikelihood", module);
                dynamicOptions.sus4Likelihood = getValueOrExpressionValue(this, "dynamicHarmonySus4ChordLikelihood", module);


                if (doModulate) {
                    dynamicOptions.mixture = false;
                }


                //            var dynamicMinorPossibleEndSusRoots = [3, 5];
                //            var dynamicMajorPossibleEndSusRoots = [1, 3, 5];
                dynamicOptions.minorPossibleEndRoots = dynamicMinorPossibleEndRoots;
                dynamicOptions.majorPossibleEndRoots = dynamicMajorPossibleEndRoots;
                //            dynamicOptions.minorPossibleEndSus2Roots = dynamicMinorPossibleEndSusRoots;
                //            dynamicOptions.majorPossibleEndSus2Roots = dynamicMajorPossibleEndSusRoots;


                //            var minorModulationPossibleEndSusRoots = [3, 5];
                //            var majorModulationPossibleEndSusRoots = [1, 3, 5];
                dynamicOptions.minorModulationPossibleEndRoots = minorModulationPossibleEndRoots;
                dynamicOptions.majorModulationPossibleEndRoots = majorModulationPossibleEndRoots;
                //            dynamicOptions.minorModulationPossibleEndSusRoots = minorModulationPossibleEndSusRoots;
                //            dynamicOptions.majorModulationPossibleEndSusRoots = majorModulationPossibleEndSusRoots;
                dynamicOptions.minorModulationPossibleEndInversions = minorModulationPossibleEndInversions;
                dynamicOptions.majorModulationPossibleEndInversions = majorModulationPossibleEndInversions;

                var dynamicGenerator = new DynamicHarmonyGenerator(dynamicOptions);

                var reuseIndex = JSON.stringify(dynamicGenerator);
                var toReuse = module.reusables[reuseIndex];
                var dynamicSolution = null;
                if (toReuse) {
                    dynamicSolution = copyValueDeep(toReuse);
                    //                logit("Reusing dynamic harmony");
                } else {
                    dynamicSolution = dynamicGenerator.searchML();
                    module.reusables[reuseIndex] = copyValueDeep(dynamicSolution);
                }

                //            var dynamicSolution = dynamicGenerator.searchML();

                raiseLeading(dynamicSolution, theScaleType, theScaleBaseNote,
                    getValueOrExpressionValue(this, "dynamicHarmonyRaiseLeadingToneRoots", module));

                if (doModulate) {

                    var che = new ConstantHarmonyElement().setBaseNote(theScaleBaseNote).setScaleType(theScaleType);
                    var modTarget = theScaleType == ScaleType.NATURAL_MINOR ? theMinorModulationTarget : theMajorModulationTarget;

                    var newScaleBaseNote = che.getAbsoluteNoteFromScaleIndex(modTarget + 1);
                    var newScaleType = DynamicHarmonyModulationTarget.getScaleType(theScaleType, modTarget);

                    raiseLeading(dynamicSolution, newScaleType, newScaleBaseNote,
                        getValueOrExpressionValue(this, "dynamicHarmonyRaiseLeadingToneAppliedRoots", module));
                }
            }
        } else {
            dominantIndex--;
            finalTonicIndex--;
        }
        var dynamicEnd = null;

        if (!dynamicSolution) {
            // logit(this._constructorName + "Could not find dynamic solution for count " + dynamicOptions.count + "<br />");
            dynamicEnd = new ConstantHarmonyElement().setScaleType(theScaleType).setBaseNote(theScaleBaseNote);
        } else {
//        logit([this._constructorName,
//            " dynamic solution count ",
//            dynamicOptions.count,
//            "<br />"].join(""));
            addAll(solution, dynamicSolution);
            dynamicEnd = copyObjectDeep(dynamicSolution[dynamicSolution.length - 1]);
            dynamicEnd.scaleType = (dynamicEnd.scaleType == ScaleType.MELODIC_MINOR || dynamicEnd.scaleType == ScaleType.HARMONIC_MINOR) ?
                ScaleType.NATURAL_MINOR : dynamicEnd.scaleType;
        }

//    logit("Dynamic end base note " + dynamicEnd.baseNote + " <br />");

        var numerator = this.getTsNumerator(module);

        function getLengthenMeasures(rnd) {
            var measureCount = sampleData([
                {data: 1, likelihood: 1},
                {data: 2, likelihood: (numerator > 2 ? 0.5 : 1) * 1}
            ], rnd);
            return measureCount;
        }

        function getLengthenCount(options, measureCount, rnd) {

            var lengthenCount = sampleData([
                {data: 1, likelihood: numerator * measureCount < 3 ? 1 : 0},
                {data: 2, likelihood: 1},
                {data: 3, likelihood: numerator * measureCount >= 3 ? 0.5 * measureCount : 0},
                {data: 4, likelihood: numerator * measureCount >= 4 ? 0.25 * measureCount : 0},
                {data: 5, likelihood: numerator * measureCount >= 5 ? 0.125 * measureCount : 0},
                {data: 6, likelihood: numerator * measureCount >= 6 ? 0.1 * measureCount : 0},
                {data: 7, likelihood: numerator * measureCount >= 7 ? 0.05 * measureCount : 0},
                {data: 8, likelihood: numerator * measureCount >= 8 ? 0.025 * measureCount : 0}
            ], rnd);
            options.count += lengthenCount;
            for (var j=0; j<lengthenCount; j++) {
                options.startBeatStrengths.push(1);
            }
            return lengthenCount;
        }

        function extractLengthenedSolution(lengthenCount, solution, extraSolution) {

            if (lengthenCount) {

                for (var j=0; j<lengthenCount; j++) {
                    var extra = solution[solution.length - lengthenCount + j];
                    if (extra) {
                        extraSolution[j] = extra;
                    } else {
                        logit("could not find any extra solution at " + (solution.length - lengthenCount + j) +
                            " solution length: " + solution.length + " j: " + j + " lengthenCount: " + lengthenCount);
                        lengthenCount--;
                    }
                }

                if (solution.length > lengthenCount) {
                    solution.length = solution.length - lengthenCount;
                } else {
                    logit("Tried to remove the complete solution after lengthening " + lengthenCount + " total: " + solution.length);
                }
            } else {
                logit("strange lengthen count " + lengthenCount);
            }

        }

        var lengthenMeasures = 0;

        var extraDominantCadenceSolution = [];
        var dominantStartIndex = -1;
        if (!skipDominant) {
            var dominantCadenceOptions = {};
            dominantCadenceOptions.count = indices[dominantIndex].length;
            dominantCadenceOptions.startBeatStrengths = getBeatStrengths(indices[dominantIndex], startBeatStrengths);
            dominantCadenceOptions.seed = this.getSeed(rnd, this.dominantCadenceHarmonySeed, this.dominantCadenceHarmonyUseLocalSeed);

            var lengthenCount = 0;
            if (lengthenDominant) {
                var rnd2 = new MersenneTwister(dominantCadenceOptions.seed);
                lengthenMeasures = getLengthenMeasures(rnd2);
                lengthenCount = getLengthenCount(dominantCadenceOptions, lengthenMeasures, rnd2);
            }

            var beatsBeforeDominant = 0;
            for (var i=0; i<dominantIndex - 1; i++) {
                var indicesBefore = indices[i];
                for (var j=0; j<indicesBefore.length; j++) {
                    var indexBefore = indicesBefore[j];
                    beatsBeforeDominant += beatLengths[indexBefore];
                }
            }
//        logit("Beats before dominant " + beatsBeforeDominant);
            dominantCadenceOptions.startWithAccented64Likelihood = 1;
            dominantCadenceOptions.startWithoutAccented64Likelihood = 1;

            dominantCadenceOptions.baseRoot = dominantBaseRoot;
            dominantCadenceOptions.auxiliaryChordRoots = [0];
            dominantCadenceOptions.auxiliaryChordRootLikelihoods = [1];
            dominantCadenceOptions.scaleType = dynamicEnd.scaleType;
            dominantCadenceOptions.scaleBaseNote = dynamicEnd.baseNote;
            dominantCadenceOptions.baseToNeighbourLikelihood = getValueOrExpressionValue(this, "dominantCadenceHarmonyNeighbourChordLikelihood", module);
            dominantCadenceOptions.auxiliaryToNeighbourLikelihood = getValueOrExpressionValue(this, "dominantCadenceHarmonyNeighbourChordLikelihood", module);
            dominantCadenceOptions.baseToPassingLikelihood = getValueOrExpressionValue(this, "dominantCadenceHarmonyPassingChordLikelihood", module);
            dominantCadenceOptions.simpleMixtureLikelihood = getValueOrExpressionValue(this, "dominantCadenceHarmonySimpleMixtureLikelihood", module);
            dominantCadenceOptions.sus2Likelihood = getValueOrExpressionValue(this, "dominantCadenceHarmonySus2ChordLikelihood", module);
            dominantCadenceOptions.sus4Likelihood = getValueOrExpressionValue(this, "dominantCadenceHarmonySus4ChordLikelihood", module);

            // Make the accented stuff depend on whether start the measure or not

            if (skipTonicCadence) {
                dominantCadenceOptions.baseSeventhLikelihoods = [[0]];
            }

            var dominantCadenceGenerator = new StaticHarmonyGenerator(dominantCadenceOptions);

            var reuseIndex = JSON.stringify(dominantCadenceGenerator);
            var toReuse = module.reusables[reuseIndex];
            var dominantCadenceSolution = null;
            if (toReuse) {
                dominantCadenceSolution = copyValueDeep(toReuse);
//                logit("Reusing dominant cadence harmony");
            } else {
                dominantCadenceSolution = dominantCadenceGenerator.searchML();
                module.reusables[reuseIndex] = copyValueDeep(dominantCadenceSolution);
            }

//            var dominantCadenceSolution = dominantCadenceGenerator.searchML();
            //    logit("dominant cadence solution length: " + dominantCadenceSolution.length + "<br />");

            raiseLeading(dominantCadenceSolution, dynamicEnd.scaleType, dynamicEnd.baseNote,
                getValueOrExpressionValue(this, "dominantCadenceHarmonyRaiseLeadingToneRoots", module));

            if (lengthenDominant) {
//                logit("Dominant solution length: " + dominantCadenceSolution.length + " input count: " + dominantCadenceOptions.count + " lengthenCount: " + lengthenCount);
                extractLengthenedSolution(lengthenCount, dominantCadenceSolution, extraDominantCadenceSolution);
            }

            dominantStartIndex = solution.length;

            addAll(solution, dominantCadenceSolution);
        } else {
            finalTonicIndex--;
        }


        var extraTonicCadenceSolution = [];
        if (!skipTonicCadence) {
            var tonicCadenceOptions = {};
            tonicCadenceOptions.baseRoot = tonicCadenceBase;
            tonicCadenceOptions.count = indices[finalTonicIndex].length;
            tonicCadenceOptions.startBeatStrengths = getBeatStrengths(indices[finalTonicIndex], startBeatStrengths);
            tonicCadenceOptions.seed = this.getSeed(rnd, this.tonicCadenceHarmonySeed, this.tonicCadenceHarmonyUseLocalSeed);
            var lengthenCount = 0;
            if (lengthenFinalTonic) {
                var rnd2 = new MersenneTwister(tonicCadenceOptions.seed);
                lengthenMeasures = getLengthenMeasures(rnd2);
                lengthenCount = getLengthenCount(tonicCadenceOptions, lengthenMeasures, rnd2);
            }
            tonicCadenceOptions.scaleType = dynamicEnd.scaleType;
            tonicCadenceOptions.scaleBaseNote = dynamicEnd.baseNote;
            //        tonicCadenceOptions.scaleType = this.scaleType;
            //        tonicCadenceOptions.scaleBaseNote = this.scaleBaseNote;
            tonicCadenceOptions.baseSeventhLikelihoods = [[0]];
            tonicCadenceOptions.startWithAccented64Likelihood = 0;
            tonicCadenceOptions.startWithoutAccented64Likelihood = 1;
            tonicCadenceOptions.baseExpandedLikelihood = 0;

            tonicCadenceOptions.baseToNeighbourLikelihood = getValueOrExpressionValue(this, "tonicCadenceHarmonyNeighbourChordLikelihood", module);
            tonicCadenceOptions.auxiliaryToNeighbourLikelihood = getValueOrExpressionValue(this, "tonicCadenceHarmonyNeighbourChordLikelihood", module);
            tonicCadenceOptions.baseToPassingLikelihood = getValueOrExpressionValue(this, "tonicCadenceHarmonyPassingChordLikelihood", module);
            tonicCadenceOptions.simpleMixtureLikelihood = getValueOrExpressionValue(this, "tonicCadenceHarmonySimpleMixtureLikelihood", module);
            tonicCadenceOptions.sus2Likelihood = getValueOrExpressionValue(this, "tonicCadenceHarmonySus2ChordLikelihood", module);
            tonicCadenceOptions.sus4Likelihood = getValueOrExpressionValue(this, "tonicCadenceHarmonySus4ChordLikelihood", module);


            var tonicCadenceGenerator = new StaticHarmonyGenerator(tonicCadenceOptions);

            var reuseIndex = JSON.stringify(tonicCadenceGenerator);
            var toReuse = module.reusables[reuseIndex];
            var tonicCadenceSolution = null;
            if (toReuse) {
                tonicCadenceSolution = copyValueDeep(toReuse);
//                logit("Reusing tonic cadence harmony");
            } else {
                tonicCadenceSolution = tonicCadenceGenerator.searchML();
                module.reusables[reuseIndex] = copyValueDeep(tonicCadenceSolution);
            }


//            var tonicCadenceSolution = tonicCadenceGenerator.searchML();
            //        logit("tonic cadence solution length: " + tonicCadenceSolution.length + "<br />");
            raiseLeading(tonicCadenceSolution, dynamicEnd.scaleType, dynamicEnd.baseNote,
                getValueOrExpressionValue(this, "tonicCadenceHarmonyRaiseLeadingToneRoots", module));
            if (lengthenFinalTonic) {
                extractLengthenedSolution(lengthenCount, tonicCadenceSolution, extraTonicCadenceSolution);
            }
            addAll(solution, tonicCadenceSolution);
        }

        this.setLengthsAndPhraseStructure(solution, module, beatOffset);

        if (!this.overrideDefaultPhraseStructure) {
            for (var i=0; i<solution.length; i++) {
                var he = solution[i];
                he.startsPhrase = i == 0;
            }
        }


        if (thePhraseType == PhraseHarmonyElementType.ANTECEDENT_CONSEQUENT || thePhraseType == PhraseHarmonyElementType.CONSEQUENT) {
            var chr = new ConstantHarmonicRythm(solution);
            var minBeatLengths = [];
            for (var i=0; i<this.phraseShorteningMinLengths.length; i++) {
                minBeatLengths[i] = positionUnitToBeats2(this.phraseShorteningMinLengths[i], this.phraseShorteningMinLengthUnit, 0, chr);
            }

            // Copy the solution, shorten the copy and add a tonic cadence
            var rshm = new MultiRandomShortenHarmonyModifier();
            rshm.totalBeats = this.phraseShorteningBeats;
            rshm.minElementLengths = minBeatLengths;
            rshm.minElementLengthUnit = PositionUnit.BEATS;
            rshm.startIndexLikelihoods = [[0.001], [0.001], [0.001], [0.01], [0.01], []];
            rshm.indexLikelihoods = [[0.01], [0.01], [0.01], [0.1]];
            rshm.endIndexLikelihoods = [[0.1, 1, 10], [0.1, 1, 10], [0.1, 1, 10], [0.1, 1, 1], []];

            var lengthBefore = 0;
            for (var i=0; i<solution.length; i++) {
                lengthBefore += solution[i].getBeatLength();
            }

            //        logit("length before: " + lengthBefore + " <br />");
            var consequent = copyValueDeep(solution);
            consequent = rshm.modifyConstantHarmonyElements(consequent, module);

            var lengthAfter = 0;
            for (var i=0; i<consequent.length; i++) {
                lengthAfter += consequent[i].getBeatLength();
            }
            //        logit("length after: " + lengthAfter + " <br />");

            //        logit(valueToJson(consequent).join("") + "<br />");

            var actualShortening = lengthBefore - lengthAfter;

            if (actualShortening > 0.001) {
                // Add final tonic (could be a tonic cadence stuff here...)
                var tonic = new ConstantHarmonyElement();
                tonic.setLength(actualShortening);
                tonic.setLengthUnit(PositionUnit.BEATS);
                tonic.scaleType = dynamicEnd.scaleType;
                tonic.baseNote = dynamicEnd.baseNote;
                consequent.push(tonic);
            } else {
                thePhraseType = PhraseHarmonyElementType.COMPLETE;
//                logit("Replanning since could not add final tonic...");
                replan = true;
                didReplan = true;
                continue;
//                logit(this._constructorName + " could not add final tonic" + " <br />");
            }
            for (var i=0; i<consequent.length; i++) {
                var he = consequent[i];
                he.startsPhrase = i == 0;
            }

            if (thePhraseType == PhraseHarmonyElementType.CONSEQUENT) {
                solution = consequent;
            } else {
                addAll(solution, consequent);
            }
//        logit("ant cons length: " + solution.length);
        }

        // Find uses of simple mixture
        for (var i=0; i<solution.length-1; i++) {
            var dse = solution[i];
            var nextDse = solution[i+1];
            var nextNextDse = solution[i+2];

            if (dse.baseNote == nextDse.baseNote) {

                var pitchClasses = dse.getChordPitchClasses();
                var nextPitchClasses = nextDse.getChordPitchClasses();
                var nextNextPitchClasses = null; // nextPitchClasses;
                if (nextNextDse) {
                    nextNextPitchClasses = nextNextDse.getChordPitchClasses();
                }

                if (dse.scaleType == ScaleType.MAJOR) {
                    if (nextDse.scaleType == ScaleType.NATURAL_MINOR ||
                        nextDse.scaleType == ScaleType.HARMONIC_MINOR ||
                        nextDse.scaleType == ScaleType.MELODIC_MINOR) {
                        // Going from major to some form of minor

                        var secondPitchClass = dse.getAbsoluteNoteFromScaleIndex(1) % 12;
                        var thirdPitchClass = dse.getAbsoluteNoteFromScaleIndex(2) % 12;
                        var fifthPitchClass = dse.getAbsoluteNoteFromScaleIndex(4) % 12;
                        var sixthPitchClass = dse.getAbsoluteNoteFromScaleIndex(5) % 12;

                        var nextThirdPitchClass = nextDse.getAbsoluteNoteFromScaleIndex(2) % 12;
                        var nextSixthPitchClass = nextDse.getAbsoluteNoteFromScaleIndex(5) % 12;

                        if ((arrayContains(pitchClasses, thirdPitchClass) || arrayContains(pitchClasses, secondPitchClass)) &&
                            arrayContains(nextPitchClasses, nextThirdPitchClass)) {
                            // If 3 is lowered, the direct progression from 3 to lowered 3 should be performed or from 2 to lowered 3
                            var thirdOrSecondToLoweredThirdC = new MinVoiceLinePlannerConstraint();

                            var thirdToLoweredThirdC = new PitchClassStepVoiceLinePlannerConstraint();
                            thirdToLoweredThirdC.id = "thirdToLoweredThirdC";
                            thirdToLoweredThirdC.fromPitchClass = thirdPitchClass;
                            thirdToLoweredThirdC.toPitchClass = nextThirdPitchClass;

                            var secondToLoweredThirdC = new PitchClassStepVoiceLinePlannerConstraint();
                            secondToLoweredThirdC.id = "secondToLoweredThirdC";
                            secondToLoweredThirdC.fromPitchClass = secondPitchClass;
                            secondToLoweredThirdC.toPitchClass = nextThirdPitchClass;

                            thirdOrSecondToLoweredThirdC.constraints = [thirdToLoweredThirdC, secondToLoweredThirdC];
                            nextDse.voiceLineConstraints.push(thirdOrSecondToLoweredThirdC);
                        }
                        if (nextNextDse) {
                            var nextNextSecondPitchClass = nextNextDse.getAbsoluteNoteFromScaleIndex(1) % 12;
                            if (arrayContains(nextPitchClasses, nextThirdPitchClass) && arrayContains(nextNextPitchClasses, nextNextSecondPitchClass)) {
                                // Lowered 3 should continue moving to 2
                                var loweredThirdToSecondC = new PitchClassStepVoiceLinePlannerConstraint();
                                loweredThirdToSecondC.id = "loweredThirdToSecondC";
                                loweredThirdToSecondC.fromPitchClass = nextThirdPitchClass;
                                loweredThirdToSecondC.toPitchClass = nextNextSecondPitchClass;
                                nextNextDse.voiceLineConstraints.push(loweredThirdToSecondC);
                            }
                        }

                        if ((arrayContains(pitchClasses, fifthPitchClass) || arrayContains(pitchClasses, sixthPitchClass)) &&
                            arrayContains(nextPitchClasses, nextSixthPitchClass)) {
                            // If 6 is lowered, the direct progression from 6 to lowered 6 should be performed or a progression from 5 to lowered 6
                            var sixthOrFifthToLoweredSixthC = new MinVoiceLinePlannerConstraint();

                            var sixthToLoweredSixthC = new PitchClassStepVoiceLinePlannerConstraint();
                            sixthToLoweredSixthC.fromPitchClass = sixthPitchClass;
                            sixthToLoweredSixthC.toPitchClass = nextSixthPitchClass;

                            var fifthToLoweredSixthC = new PitchClassStepVoiceLinePlannerConstraint();
                            fifthToLoweredSixthC.fromPitchClass = fifthPitchClass;
                            fifthToLoweredSixthC.toPitchClass = nextSixthPitchClass;

                            sixthOrFifthToLoweredSixthC.constraints = [sixthToLoweredSixthC, fifthToLoweredSixthC];
                            nextDse.voiceLineConstraints.push(sixthOrFifthToLoweredSixthC);
                        }
                        if (nextNextDse) {
                            // Lowered 6 should continue moving to 5
                            var nextNextFifthPitchClass = nextNextDse.getAbsoluteNoteFromScaleIndex(4) % 12;

                            if (arrayContains(nextPitchClasses, nextSixthPitchClass) && arrayContains(nextNextPitchClasses, nextNextFifthPitchClass)) {
                                var loweredSixthToFifthC = new PitchClassStepVoiceLinePlannerConstraint();
                                loweredSixthToFifthC.fromPitchClass = nextSixthPitchClass;
                                loweredSixthToFifthC.toPitchClass = nextNextFifthPitchClass;
                                nextNextDse.voiceLineConstraints.push(loweredSixthToFifthC);
                            }
                        }
                    }
                }
            }
        }


        if (doModulate && !skipDynamicHarmony) {
            // Add voice leading constraints for the applied chords

            // Find the leading note for the modulation target
            var che = new ConstantHarmonyElement().setBaseNote(theScaleBaseNote).setScaleType(theScaleType);
            var modTarget = theScaleType == ScaleType.NATURAL_MINOR ? theMinorModulationTarget : theMajorModulationTarget;

            var newScaleBaseNote = che.getAbsoluteNoteFromScaleIndex(modTarget + 1);
            var newScaleType = DynamicHarmonyModulationTarget.getScaleType(theScaleType, modTarget);

            for (var i=1; i<solution.length; i++) {
                var dse = solution[i];
                var prevDse = solution[i-1];
                if (dse.baseNote == newScaleBaseNote) {
                    var leadingTonePitchClass = dse.getAbsoluteNoteFromScaleIndex(6) % 12;
                    if (prevDse.baseNote == theScaleBaseNote) {
                        // Entering new harmony, add enter constraints
                        var enterPclr = new PitchClassLeapRangeVoiceLinePlannerConstraint();
                        enterPclr.pitchClass = leadingTonePitchClass;
                        enterPclr.enterRange = [-1, 1];
                        enterPclr.enterPenaltyFactor = 0.1;
                        enterPclr.enterNotFoundPenalty = 1.0;
                        enterPclr.enterDoublingPenalty = 1.0;
                        dse.voiceLineConstraints.push(enterPclr);


                        // Penalize leaps in all voices
                        var enterLeapC = new LeapRangeVoiceLinePlannerConstraint();
                        enterLeapC.range = [-3, 3];
                        enterLeapC.penaltyFactor = 0.2;
                        dse.voiceLineConstraints.push(enterLeapC);

//                    logit("Adding enter constraint");

                        if (i < solution.length - 1) {
                            var nextDse = solution[i+1];
                            var leavePclr = new PitchClassLeapRangeVoiceLinePlannerConstraint();
                            leavePclr.pitchClass = leadingTonePitchClass;
                            leavePclr.leaveRange = [1, 2];
                            leavePclr.leavePenaltyFactor = 1.0;
                            leavePclr.leaveNotFoundPenalty = 1.0;
                            leavePclr.leaveDoublingPenalty = 1.0;
                            nextDse.voiceLineConstraints.push(leavePclr);

                            var leaveLeapC = new LeapRangeVoiceLinePlannerConstraint();
                            leaveLeapC.range = [-3, 3];
                            leaveLeapC.penaltyFactor = 0.2;
                            nextDse.voiceLineConstraints.push(leaveLeapC);

//                        logit("Adding leave constraint");
                        }
                    }
                }
            }

        }

        var showSolution = false; // doModulate; // || didReplan;

//        showSolution = doModulate;

//    if (theScaleType == ScaleType.NATURAL_MINOR) {
//        showSolution = !raiseLeadingTone || showSolution;
//    }
        for (var i=0; i<solution.length; i++) {
//        if (positiveMod(solution[i].chordRoot, 7) == 5) {
//            showSolution = true;
//        }
            var hasMixture = solution[i].toRomanString().indexOf("X") >= 0;
            if (hasMixture) {
//                showSolution = true;
            }
//            var hasPassing = solution[i].note.indexOf("P") >= 0;
//            if (hasPassing) {
//                showSolution = true;
//            }
            var hasSus = solution[i].toRomanString().indexOf("sus") >= 0;
            if (hasSus) {
//                showSolution = true;
            }
            var hasNeighbourMixture = solution[i].toRomanString().indexOf("NX") >= 0 || solution[i].toRomanString().indexOf("NMX") >= 0;
//            if (hasNeighbourMixture) {
//                showSolution = true;
//            }

            var hasSus = solution[i].toRomanString().indexOf("sus") >= 0;

            var hasDynamicExpansion = solution[i].note.indexOf("D, E") >= 0;

//            if (hasSus && hasDynamicExpansion) {
//                showSolution = true;
//            }
//            if (solution[i].note.indexOf("sus") >= 0) {
//                showSolution = true;
//            }
        }
//        showSolution = false;

        if (showSolution) {
            var chr = new ConstantHarmonicRythm(solution);
//        logit("" + dynamicMajorStartRoots + " " + dynamicMinorStartRoots);
//        logit("Major target: " + theMajorModulationTarget + " minor target: " + theMinorModulationTarget);
            logit("The phrase progression: " + chr.toRomanString());
        }

        for (var i=0; i<solution.length; i++) {
            solution[i].tsNumerator = numerator;
        }

//    logit("NUmerator: " + numerator);

        function insertLengthenedSolution(extraSolution, index, solution, totalLength, beatOffset) {
            var lengthLeft = totalLength;

            // Just a single measure for now...
            var lengthInc = Math.max(1, Math.floor(totalLength / extraSolution.length));

            var currentBeat = beatOffset;
            for (var j=0; j<extraSolution.length; j++) {

                var extra = extraSolution[j];
                if (!extra) {
                    continue;
                }
                var theInc = lengthInc;
                if (j == extraSolution.length - 1) {
                    extra.length = lengthLeft;
                } else {
                    currentBeat += theInc;
                    extra.length = theInc;
                }
                lengthLeft -= theInc;

                extra.lengthUnit = PositionUnit.BEATS;
                extra.tsNumerator = numerator;
            }
            if (index < solution.length) {
                for (var i=0; i<extraSolution.length; i++) {
                    var extra = extraSolution[i];
                    if (extra) {
                        solution.splice(index + i, 0, extra);
                    }
//                    logit("Splicing at " + index + " new length; " + solution.length);
                }
            } else {
                for (var i=0; i<extraSolution.length; i++) {
                    var extra = extraSolution[i];
                    if (extra) {
                        solution.push(extra);
                    }
                }
            }
        }

        if (lengthenFinalTonic) {
            insertLengthenedSolution(extraTonicCadenceSolution, solution.length, solution, lengthenMeasures * numerator,
                beatOffset);
        }
        if (lengthenDominant && dominantStartIndex >= 0) {
//            logit("Lengthening dominant final solution " + dominantStartIndex);
            insertLengthenedSolution(extraDominantCadenceSolution, dominantStartIndex, solution, lengthenMeasures * numerator,
                beatOffset);
        }


        for (var i=0; i<endVoiceConstraints.length; i++) {
            solution[solution.length - 1].voiceLineConstraints.push(endVoiceConstraints[i]);
        }


//    logit("phrase type " + PhraseHarmonyElementType.toString(thePhraseType));
//    for (var i=0; i<solution.length; i++) {
//        logit(solution[i].length);
//    }

        //    logit("startsphrase: " + arrayElementsPropertyToString(solution, "startsPhrase").join(', ') + "<br />");
    }

//    if (beatLengths[0] == 1) {
//        var tempChr = new ConstantHarmonicRythm(solution);
//        logit(this._constructorName + " solution: " + JSON.stringify(solution) + " length: " + tempChr.getBeatLength());
//    }

    harmonyTimer.pause();

    return solution;
};
