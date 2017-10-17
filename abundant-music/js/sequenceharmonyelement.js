


SequenceHarmonyElement.prototype.getTsNumerator = function(module) {
    var tsNumerators = getValueOrExpressionValue(this, "tsNumerators", module);

    var tsNumerator = tsNumerators.length == 0 ? 4 : tsNumerators[0];

    return tsNumerator;
};


SequenceHarmonyElement.prototype.getStartBeatStrengths = function(module, beatLengths, beatOffset, beatStrengths) {
    var numerator = this.getTsNumerator(module);
    return HarmonyGenerator.prototype.getStartBeatStrengths(module, beatLengths, beatOffset, numerator, beatStrengths);
};



SequenceHarmonyElement.prototype.getBeatLengths = function(module) {
    var result = [];
    if (!module) {
        showStacktraceDialog(null, "no module in " + this._constructorName);
    }

    var tsNumerators = getValueOrExpressionValue(this, "tsNumerators", module);
    var tsDenominators = getValueOrExpressionValue(this, "tsDenominators", module);

    var theCount = getValueOrExpressionValue(this, "count", module);

    var tsNumerator = tsNumerators.length == 0 ? 4 : tsNumerators[0];
    var tsDenominator = tsDenominators.length == 0 ? 4 : tsDenominators[0];

    switch (this.harmonyLengthMode) {
        case HarmonyLengthMode.COUNT_AND_RYTHM:
        case HarmonyLengthMode.RYTHM_ONLY:
            var lengthRythmId = getValueOrExpressionValue(this, "lengthRythm", module);
            var rythm = module.getRythm(lengthRythmId);
            if (!rythm) {
                logit("Unable to find rythm " + lengthRythmId + "<br />");
                break;
            }

            var rythmTsNumerator = getValueOrExpressionValue(this, "rythmTsNumerator", module);

//            logit(" rythmTsNumerator: " + rythmTsNumerator);

            var rythmHarmony = new ConstantHarmonicRythm([new ConstantHarmonyElement().setTimeSignature(rythmTsNumerator, this.rythmTsDenominator)]);

//            logit("  getting harmony rythm rythm " + rythmHarmony.)

            var elements = rythm.getNoteRythmElements(module, rythmHarmony, 0);
            if (this.harmonyLengthMode == HarmonyLengthMode.RYTHM_ONLY) {
                theCount = elements.length;
            }


            var rythmBeatLength = 0.0;
            for (var i=0; i<Math.max(1, theCount); i++) {
                tsNumerator = getItemFromArrayWithStartEndItems(4, tsNumerators, theCount, i, this.startTsNumerators, this.endTsNumerators);
                tsDenominator = getItemFromArrayWithStartEndItems(4, tsDenominators, theCount, i, this.startTsDenominators, this.endTsDenominators);
                var beatLength = Math.max(1.0, tsDenominator);
                if (elements.length > 0) {
                    var dummyHarmony = new ConstantHarmonicRythm([new ConstantHarmonyElement().setTimeSignature(tsNumerator, tsDenominator)]);
                    var element = elements[i % elements.length];
                    beatLength = positionUnitToBeats(element.length, element.lengthUnit, tsNumerator, tsDenominator, dummyHarmony);
                }
                result.push(beatLength);
                rythmBeatLength += beatLength;
            }

//            logit(" Beatlengths in element: " + result.join(", ") + " total length: " + rythmBeatLength);

            // Scale the lengths so the total length becomes equal to totalLength
            var theTotalLength = getValueOrExpressionValue(this, "totalLength", module);
            var totalBeatLength = positionUnitToBeats(theTotalLength, this.totalLengthUnit, tsNumerator, tsDenominator, rythmHarmony);

            var scaleFactor = totalBeatLength / rythmBeatLength;
            for (var i=0; i<result.length; i++) {
                result[i] = result[i] * scaleFactor;
            }
//            logit("    corrected Beatlengths in element: " + result.join(", "));

            break;
        case HarmonyLengthMode.COUNT_AND_LENGTH_PATTERN:
            var theLengthPattern = getValueOrExpressionValue(this, "lengthPattern", module);
            var theStartLengthPattern = getValueOrExpressionValue(this, "startLengthPattern", module);
            var theEndLengthPattern = getValueOrExpressionValue(this, "endLengthPattern", module);
            for (var i=0; i<Math.max(1, theCount); i++) {
                tsNumerator = getItemFromArrayWithStartEndItems(4, tsNumerators, theCount, i, this.startTsNumerators, this.endTsNumerators);
                tsDenominator = getItemFromArrayWithStartEndItems(4, tsDenominators, theCount, i, this.startTsDenominators, this.endTsDenominators);
                var length = getItemFromArrayWithStartEndItems(1.0, theLengthPattern, theCount, i, theStartLengthPattern, theEndLengthPattern);
                var beatLength = positionUnitToBeats(length, this.lengthPatternUnit, tsNumerator, tsDenominator, null);
                beatLength = Math.max(1.0, beatLength);
                result.push(beatLength);
            }
            break;
    }
    var origLength = result.length;
    for (var i=0; i<this.lengthRepeats; i++) {
        for (var j=0; j<origLength; j++) {
            result.push(result[j]);
        }
    }

    if (result.length == 0) {
        result.push(1.0);
    }

    // Snap the lengths
    if (this.usePositionSnap && this.positionSnapPattern.length > 0) {
        var currentBeat = 0.0;
        var currentSnapBeat = 0.0;

        var lengthCounter = 0;
        var snapCounter = 0;

        while (lengthCounter < result.length) {
            var length = result[lengthCounter];
            currentBeat += length;
            if (currentBeat < currentSnapBeat) {
            } else {
                // Snap to the current snap beat
                var prevSnapBeat = currentSnapBeat;
                while (currentSnapBeat < currentBeat) {
                    var snapLength = this.positionSnapPattern[snapCounter % this.positionSnapPattern.length];
                    var snapBeatLength = positionUnitToBeats(snapLength, this.positionSnapUnit, tsNumerator, tsDenominator, null);
                    snapBeatLength = Math.max(1.0 / 16.0, snapBeatLength); // Prevent infinite loops :)
                    prevSnapBeat = currentSnapBeat;
                    currentSnapBeat += snapBeatLength;
                    snapCounter++;
                }
                // The prevSnapBeat is now less than or equal to currentBeat and currentSnapBeat is greater than currentBeat
                var shorterLengthInc = prevSnapBeat - currentBeat;
                var longerLengthInc = currentSnapBeat - currentBeat;

                var lengthInc = 0;

                switch (this.positionSnapMetrics) {
                    case SnapMetrics.CEIL:
                        if (shorterLengthInc >= 0) {
                            lengthInc = shorterLengthInc;
                        } else {
                            lengthInc = longerLengthInc;
                        }
                        break;
                    case SnapMetrics.FLOOR:
                        if (shorterLengthInc + length > (1.0 / 16.0)) {
                            lengthInc = shorterLengthInc;
                        } else {
                            lengthInc = longerLengthInc;
                        }
                        break;
                    case SnapMetrics.ROUND:
                        if (shorterLengthInc + length > (1.0 / 16.0)) {
                            if (Math.abs(shorterLengthInc) < Math.abs(longerLengthInc)) {
                                lengthInc = shorterLengthInc;
                            } else {
                                lengthInc = longerLengthInc;
                            }
                        } else {
                            lengthInc = longerLengthInc;
                        }
                        break;
                }
                length += lengthInc;
                currentBeat += lengthInc;
                result[lengthCounter] = length;
            }
            lengthCounter++;
        }
    }




    var useMaxElementLength = getValueOrExpressionValue(this, "useMaxElementLength", module);
    if (useMaxElementLength) {
        var newResult = [];

        var maxElementLength = getValueOrExpressionValue(this, "maxElementLength", module);
        var maxElementLengthUnit = getValueOrExpressionValue(this, "maxElementLengthUnit", module);

        var maxBeatLength = positionUnitToBeats(maxElementLength, maxElementLengthUnit, tsNumerator, tsDenominator);

        function splitOrKeep(beats) {
            var temp = [];
            if (beats > maxBeatLength) {
                temp.push(maxBeatLength);
                addAll(temp, splitOrKeep(beats - maxBeatLength));
            } else if (beats > 0.01) {
                temp.push(beats);
            }
            return temp;
        }
        for (var i=0; i<result.length; i++) {
            var beats = result[i];
            addAll(newResult, splitOrKeep(beats));
        }

        if (result.length != newResult.length) {
//            logit(this._constructorName + " Splitted up the beat lengths from " + result.join(",") + " to " + newResult.join(","));
        }

        result = newResult;
    }

    return result;
};



SequenceHarmonyElement.prototype.setLengthsAndPhraseStructure = function(solution, module, beatOffset) {
    if (solution != null) {
        if (!beatOffset) {
            beatOffset = 0;
        }
        var lengths = this.getBeatLengths(module);

        var startBeatStrengths = this.getStartBeatStrengths(module, lengths, beatOffset);
        for (var i=0; i<solution.length; i++) {
            var che = solution[i];
            che.length = lengths[i % lengths.length];
            che.lengthUnit = PositionUnit.BEATS;
            che.startBeatStrength = startBeatStrengths[i % startBeatStrengths.length];
        }

        var thePhraseStructureCounts = getValueOrExpressionValue(this, "phraseStructureCounts", module);

        if (!thePhraseStructureCounts || typeof(thePhraseStructureCounts) === 'undefined') {
            thePhraseStructureCounts = [];
        }

        var currentIndex = 0;
        for (var i=0; i<thePhraseStructureCounts.length; i++) {
            if (currentIndex < solution.length) {
                solution[currentIndex].startsPhrase = true;
            }
            var psc = thePhraseStructureCounts[i];
            currentIndex += psc;
        }
    }
};


SequenceHarmonyElement.prototype.getConstantHarmonyElements = function(module, beatOffset) {
    logit(this._constructorName + " must implement getConstantHarmonyElements() <br />");
};



SimpleSequenceHarmonyElement.prototype.getConstantHarmonyElements = function(module, beatOffset) {
    var result = [];

    var beatLengths = this.getBeatLengths(module);

    for (var i=0; i<beatLengths.length; i++) {
        var beatLength = beatLengths[i];

        var che = new ConstantHarmonyElement();
        che.length = beatLength;
        che.lengthUnit = PositionUnit.BEATS;

        var scaleBaseIndex = getItemFromArrayWithStartEndItems(0, this.scaleBaseNoteIndices, beatLengths.length, i, this.startScaleBaseNoteIndices, this.endScaleBaseNoteIndices);
        che.baseNote = this.scaleBaseNotes.length > 0 ? this.scaleBaseNotes[scaleBaseIndex % this.scaleBaseNotes.length] : 60;

        var scaleTypeIndex = getItemFromArrayWithStartEndItems(0, this.scaleTypeIndices, beatLengths.length, i, this.startScaleTypeIndices, this.endScaleTypeIndices);
        che.scaleType = this.scaleTypes.length > 0 ? this.scaleTypes[scaleTypeIndex % this.scaleTypes.length] : ScaleType.MAJOR;

        var chordTypeIndex = getItemFromArrayWithStartEndItems(0, this.chordTypeIndices, beatLengths.length, i, this.startChordTypeIndices, this.endChordTypeIndices);
        che.chordType = this.chordTypes.length > 0 ? this.chordTypes[chordTypeIndex % this.chordTypes.length] : ChordType.TRIAD;

//        logit("Setting chord type to " + JSON.stringify(che.chordType) + " for index " + i + " all: " + JSON.stringify(this.chordTypes));

        che.chordRoot = getItemFromArrayWithStartEndItems(0, this.chordRoots, beatLengths.length, i, this.startChordRoots, this.endChordRoots);
        che.chordInversions = getItemFromArrayWithStartEndItems(0, this.chordInversions, beatLengths.length, i, this.startChordInversions, this.endChordInversions);
        che.scaleMode = getItemFromArrayWithStartEndItems(0, this.scaleModes, beatLengths.length, i, this.startScaleModes, this.endScaleModes);

        var scaleIndex = getItemFromArrayWithStartEndItems(0, this.customScaleIndices, beatLengths.length, i, this.startCustomScaleIndices, this.endCustomScaleIndices);
        che.scale = this.customScales.length > 0 ? this.customScales[scaleIndex % this.customScales.length] : [0, 2, 3, 5, 7, 9, 11];

        var chordIndex = getItemFromArrayWithStartEndItems(0, this.customChordIndices, beatLengths.length, i, this.startCustomChordIndices, this.endCustomChordIndices);
        che.chord = this.customChords.length > 0 ? this.customChords[chordIndex % this.customChords.length] : [0, 2, 4];
        if (che.chord.length == 0) {
            che.chord = [0, 2, 4];
        }

        che.tsNumerator = getItemFromArrayWithStartEndItems(4, this.tsNumerators, beatLengths.length, i, this.startTsNumerators, this.endTsNumerators);

        if (this.voiceLineConstraints.length > 0) {
            var constraintIndices = getItemFromArrayWithStartEndItems([], this.voiceLineConstraintIndices, beatLengths.length, i, this.startVoiceLineConstraintIndices, this.endVoiceLineConstraintIndices);
//            logit("Voice line constraints " + JSON.stringify(this.voiceLineConstraints) + " and indices" + JSON.stringify(constraintIndices));
            if (constraintIndices.length > 0) {
                for (var j=0; j<constraintIndices.length; j++) {
                    var cIndex = constraintIndices[j];
                    if (cIndex >= 0) {
                        var constraint = this.voiceLineConstraints[cIndex % this.voiceLineConstraints.length];
                        che.voiceLineConstraints.push(constraint);
                    }
                }
            }
        }


        result.push(che);

//        logit("chord scale type: " + che.scaleType + " chord type: " + che.chordType + " chord root: " + che.chordRoot);
//        logit("chord scale indices: " + che.getChordScaleIndices().join(", "));
//        logit("chord absolute notes: " + che.getChordAbsoluteNotes().join(", "));
    }



    return result;
}
