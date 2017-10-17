

function HarmonyModifier() {
    this.id = "";
    this.active = true;
    this._constructorName = "HarmonyModifier";
}


HarmonyModifier.prototype.modifyConstantHarmonyElements = function(elements, module) {
    return elements;
};


// Adding voice line constraints where appropriate
// After the voice leading planning, it also sets suspend to true for the resulting elements that have obeyed
function SuspendHarmonyModifier() {
    HarmonyModifier.call(this);
    this.seed = 12345;

    this.voiceLineOnPattern = [1];

    this.suspendProbabilities = [0.25];
    this.doubleSuspendProbabilities = [0.1];
    this.tripleSuspendProbabilities = [0.05];
    this._constructorName = "SuspendHarmonyModifier";
}
SuspendHarmonyModifier.prototype = new SectionModifier();

SuspendHarmonyModifier.prototype.modifyConstantHarmonyElements = function(elements, module) {
    var result = copyValueDeep(elements);

    var active = getValueOrExpressionValue(this, "active", module);

    if (active && elements.length > 0) {


        var seed = getValueOrExpressionValue(this, "seed", module);
        var probs = getValueOrExpressionValue(this, "suspendProbabilities", module);

        var allowDissonantPreparation = false;

        var allowConsonantSuspension = false;
        var allowStartsWeak = false;

        var allowAnticipateResolution = false; // This translates into a non-doubling constraint
        var allowAnticipateResolutionWithBass = true;

        var minBeatLength = 2;

        var infos = [];

        var currentBeat = 0;
        var measureBeatLength = positionUnitToBeats(1, PositionUnit.MEASURES, elements[0].tsNumerator, elements[0].tsDenominator);

        var minSecondLength = 2;

        for (var i=0; i<result.length-1; i++) {

            var info = {};

            var first = result[i];
            var second = result[i+1];


            var firstLength = first.getBeatLength();
            var secondLength = second.getBeatLength();


            var firstScaleIndices = first.getChordScaleIndices();
            var firstAbsNotes = first.getAbsoluteNotesFromScaleIndices(firstScaleIndices);
            var firstPitchClasses = first.getPitchClassesFromAbsoluteNotes(firstAbsNotes);
            var secondScaleIndices = second.getChordScaleIndices();
            var secondAbsNotes = second.getAbsoluteNotesFromScaleIndices(secondScaleIndices);
            var secondPitchClasses = second.getPitchClassesFromAbsoluteNotes(secondAbsNotes);

            var allPairs = [];

            var beatLength = first.getBeatLength();
            var secondBeatLength = second.getBeatLength();

            var ok = !second.isSus();

            ok = ok && secondLength >= minSecondLength;

            // Do this in a better way with disallowed pairs or something...
            if (secondLength == 2 && (firstLength == 4 || firstLength == 6 || firstLength == 8)) {
                ok = false;
            }

            var secondStartBeat = currentBeat + beatLength;
            var modulus = (secondStartBeat % measureBeatLength);
            if (modulus != 0 && modulus != 2) {
                ok = ok && allowStartsWeak;
            }

            ok = ok && secondBeatLength >= minBeatLength;

            if (ok) {
                // Add all pairs of notes
                for (var j=0; j<firstPitchClasses.length; j++) {
                    var firstPc = firstPitchClasses[j];
                    var closestPc = first.getClosestNoteWithPitchClasses(firstPc + 24, secondPitchClasses) % 12;
                    if (closestPc == firstPc && !allowConsonantSuspension) {
                        // The note was part of the second chord and we do not allow consonant suspensions
                        continue;
                    }
                    for (var k=0; k<secondPitchClasses.length; k++) {
                        var secondPc = secondPitchClasses[k];

                        var distance = first.lowerPitchClassDistance(firstPc, secondPc);

                        if (firstPc == secondPc) {
                            logit(" bad closest? " + closestPc + " " + firstPc + " " + secondPc);
                            continue;
                        }

                        if (distance > 2) {
                            // Can not resolve normally
                            continue;
                        }

                        allPairs.push([firstPc, secondPc]);
                    }
                }
            }
            info.pairs = allPairs;
            if (info.pairs.length > 0) {
                info.text = first.toRomanString() + "->" + second.toRomanString();
            }
            infos.push(info);

            currentBeat += beatLength;
        }

//        logit(this._constructorName + " seed " + seed);

        if (probs.length == 0) {
            probs = [0.2];
        }

        var rnd = new MersenneTwister(seed);
        for (var i=0; i<infos.length; i++) {
            var info = infos[i];
            if (rnd.random() < probs[i % probs.length]) {
                var maxCount = 1;
                if (rnd.random() < this.doubleSuspendProbabilities[i % this.doubleSuspendProbabilities.length]) {
                    maxCount = 2;
                }
                if (rnd.random() < this.tripleSuspendProbabilities[i % this.tripleSuspendProbabilities.length]) {
                    maxCount = 3;
                }
                var toSample = Math.min(info.pairs.length, maxCount);

                var rndInfos = [];
                for (var j=0; j<info.pairs.length; j++) {
                    rndInfos.push({data: j, likelihood: 1});
                }
                var indices = sampleNDataWithoutReplacement(rndInfos, toSample, rnd);

                for (var j=0; j<indices.length; j++) {
                    var pair = info.pairs[indices[j]]; // info.pairs[Math.floor(rnd.random() * info.pairs.length)];
                    var constraint = new SuspendVoiceLinePlannerConstraint();
                    constraint.onPattern = copyValueDeep(this.voiceLineOnPattern);
                    constraint.suspendPitchClassPairs.push(pair);
                    result[i+1].voiceLineConstraints.push(constraint);

                    var sectionModifier = new ConditionalSuspendSectionModifier();
                    sectionModifier.harmonyIndex = i;
                    sectionModifier.suspendPitchClassPairs.push(pair);
                    result[i+1].sectionModifiers.push(sectionModifier);

//                    logit(this._constructorName + " adding constraint at " + (i+1) + " pair: " + JSON.stringify(pair));
                }
            }
//            for (var j=0; j<info.pairs.length; j++) {
//
//            }
        }
//        logit(this._constructorName + " " + JSON.stringify(infos));
    }

    return result;
};


function RandomShortenHarmonyModifier() {
    HarmonyModifier.call(this);
    this.totalBeats = [0];
    this.maxAttempts = 20;
    this.indexLikelihoods = [1];
    this.startIndexLikelihoods = [];
    this.endIndexLikelihoods = [];
    this.minElementLength = 1;
    this.minElementLengthUnit = PositionUnit.BEATS;
    this.seed = 12345;
    this._constructorName = "RandomShortenHarmonyModifier";
}

RandomShortenHarmonyModifier.prototype = new HarmonyModifier();

RandomShortenHarmonyModifier.prototype.modifyConstantHarmonyElements = function(elements, module) {
    var result = copyValueDeep(elements);

    if (!this.active) {
        return result;
    }

    if (result.length > 0) {
        var likelihoods = [];
        for (var i=0; i<result.length; i++) {
            var likelihood = getItemFromArrayWithStartEndItems(1, this.indexLikelihoods, result.length, i,
                this.startIndexLikelihoods, this.endIndexLikelihoods);
            likelihoods.push(likelihood);
        }

        var cumulative = getProbabilityDistribution(fixLikelihoods(likelihoods));

        var rnd = new MersenneTwister(this.seed);

        function getBadRepeatArray(elements) {
            var measureStarts = [];
            var currentBeat = 0;
            var harmony = new ConstantHarmonicRythm(elements);
            var measureLength = positionUnitToBeats2(1, PositionUnit.MEASURES, currentBeat, harmony);

            var crossesArr = [];

//            var beatStarts = [];

            var numerator = elements[0].tsNumerator;
            var startBeatStrengths = HarmonyGenerator.prototype.getStartBeatStrengthsFromHarmonyElements(module, elements, 0, numerator);

            for (var i=0; i<elements.length; i++) {
//                beatStarts[i] = currentBeat;
                var cost = 0.0;
                if (i < elements.length - 1) {
                    cost = HarmonyGenerator.prototype.calculateBeatStrengthRepetitionCost(elements[i], startBeatStrengths[i],
                        elements[i+1], startBeatStrengths[i+1]);
                }
                crossesArr[i] = cost > 0;

                var beatLength = elements[i].getBeatLength();
                var oldMeasureIndex = Math.floor(currentBeat / measureLength);
                var newMeasureIndex = Math.floor((currentBeat + beatLength) / measureLength);
                var newBeatStart = newMeasureIndex * measureLength;
                var stepIntoNew = currentBeat + beatLength - newBeatStart;

                crossesArr[i] = crossesArr[i] || (newMeasureIndex > oldMeasureIndex && stepIntoNew > 0.01);
                currentBeat += beatLength;
            }

//            logit(" crosses: " + crossesArr.join(", "));

            return crossesArr;
        }

        var crossBefore = getBadRepeatArray(result);

        for (var j=0; j<this.totalBeats.length; j++) {
            var beatsToTest = this.totalBeats[j];
            //            logit("Testing " + beatsToTest + " <br />");
            var success = false;
            for (var i=0; i<this.maxAttempts; i++) {
                var index = sampleIndexIntegerDistribution(rnd, cumulative);

                var toShorten = result[index];
                var beatLength = toShorten.getBeatLength();

                toShorten.length = beatLength;
                toShorten.lengthUnit = PositionUnit.BEATS;

                var minBeatLength = positionUnitToBeats(this.minElementLength, this.minElementLengthUnit,
                    toShorten.tsNumerator, toShorten.tsDenominator);

                if (beatLength - beatsToTest >= minBeatLength) {
                    var oldLength = toShorten.length;
                    toShorten.length -= beatsToTest;

                    var crossAfter = getBadRepeatArray(result);
                    if (arrayEquals(crossBefore, crossAfter)) {
                        success = true;
                        break;
                    } else {
//                        logit("Cross before: " + crossBefore.join(", "));
//                        logit("Cross after:  " + crossAfter.join(", "));
                        toShorten.length = oldLength;
                    }
                }
            }
            if (success) {
                break;
            }
        }
    }
    return result;
};


function MultiRandomShortenHarmonyModifier() {
    HarmonyModifier.call(this);
    this.totalBeats = [[0]];
    this.maxAttempts = 20;
    this.indexLikelihoods = [[1]];
    this.startIndexLikelihoods = [];
    this.endIndexLikelihoods = [];
    this.minElementLengths = [1];
    this.minElementLengthUnit = PositionUnit.BEATS;
    this.seed = 12345;
    this._constructorName = "MultiRandomShortenHarmonyModifier";
}

MultiRandomShortenHarmonyModifier.prototype = new HarmonyModifier();

MultiRandomShortenHarmonyModifier.prototype.modifyConstantHarmonyElements = function(elements, module) {

    if (!this.active) {
        return copyValueDeep(elements);
    }

    function getBeatLength(els) {
        var sum = 0;
        for (var j=0; j<els.length; j++) {
            sum += els[j].getBeatLength();
        }
        return sum;
    }
    var lengthBefore = getBeatLength(elements);

    for (var i=0; i<this.totalBeats.length; i++) {
        var beats = this.totalBeats[i];

        var modifier = new RandomShortenHarmonyModifier();
        modifier.totalBeats = beats;
        modifier.maxAttempts = this.maxAttempts;

        modifier.indexLikelihoods = this.indexLikelihoods.length > 0 ? this.indexLikelihoods[IndexBorderMode.getIndex(IndexBorderMode.CLAMP, this.indexLikelihoods.length, i)] : [1];
        modifier.startIndexLikelihoods = this.startIndexLikelihoods.length > 0 ? this.startIndexLikelihoods[IndexBorderMode.getIndex(IndexBorderMode.CLAMP, this.startIndexLikelihoods.length, i)] : [];
        modifier.endIndexLikelihoods = this.endIndexLikelihoods.length > 0 ? this.endIndexLikelihoods[IndexBorderMode.getIndex(IndexBorderMode.CLAMP, this.endIndexLikelihoods.length, i)] : [];
        modifier.minElementLength = this.minElementLengths.length > 0 ? this.minElementLengths[IndexBorderMode.getIndex(IndexBorderMode.CLAMP, this.minElementLengths.length, i)] : 1;
        modifier.minElementLengthUnit = this.minElementLengthUnit;
        modifier.seed = this.seed;

        var copy = copyValueDeep(elements);
        var result = modifier.modifyConstantHarmonyElements(copy, module);
        var lengthAfter = getBeatLength(result);
        // logit("length before: " + lengthBefore + " after: " + lengthAfter);
        if (beats == 0 || (lengthAfter < lengthBefore - 0.9 * beats)) {
            return result;
        }
    }

    return copyValueDeep(elements);
};


function AppendHarmonyModifier() {
    HarmonyModifier.call(this);
    this.elements = [];
    this._constructorName = "AppendHarmonyModifier";
}

AppendHarmonyModifier.prototype = new HarmonyModifier();

AppendHarmonyModifier.prototype.modifyConstantHarmonyElements = function(elements, module) {
    var result = copyValueDeep(elements);
    if (!this.active) {
        return result;
    }
    for (var i=0; i<this.elements.length; i++) {
        var e = this.elements[i];
        var toAppend = e.getConstantHarmonyElements(module);
        addAll(result, toAppend);
    }
    return result;
};



function PartialHarmonyModifier() {
    HarmonyModifier.call(this);
    this._constructorName = "PartialHarmonyModifier";
}

PartialHarmonyModifier.prototype = new HarmonyModifier();

PartialHarmonyModifier.prototype.getModifierIndexRanges = function(elements, module) {
    return [[0, elements.length - 1]];
};

PartialHarmonyModifier.prototype.modifyHarmonyElement = function(index, elements, module) {
};

PartialHarmonyModifier.prototype.modifyIndexRange = function(indexRange, elements, module) {
    for (var i=indexRange[0]; i<=indexRange[1]; i++) {
        this.modifyHarmonyElement(i, elements, module);
    }
};

PartialHarmonyModifier.prototype.modifyConstantHarmonyElements = function(elements, module) {
    var result = copyValueDeep(elements);

    if (!this.active) {
        return result;
    }

    var ranges = this.getModifierIndexRanges(elements, module);
    for (var i=0; i<ranges.length; i++) {
        var range = ranges[i];
        this.modifyIndexRange(range, result, module);
    }
    return result;
};



function ModeMixtureHarmonyModifier() {
    HarmonyModifier.call(this);
    this.majorRoots = [];
    this.majorFromRoots = [];
    this.majorNewScaleTypes = [ScaleType.NATURAL_MINOR];
    this.minorRoots = [4, 6];
    this.minorFromRoots = [];
    this.minorNewScaleTypes = [ScaleType.MELODIC_MINOR, ScaleType.HARMONIC_MINOR];
    this.indexRanges = [];
    this.modifyPattern = [1];
    this.startModifyPattern = [];
    this.endModifyPattern = [];
    this.addCrossRelationConstraint = true;
    this._constructorName = "ModeMixtureHarmonyModifier";
}

ModeMixtureHarmonyModifier.prototype = new HarmonyModifier();

ModeMixtureHarmonyModifier.prototype.modify = function(index, elements, module, fromRoots, roots, scaleType) {
    var element = elements[index];
    var rootPitchClass = element.getAbsoluteNoteFromChordRootIndex(0) % 12;
    var ok = false;
    if (fromRoots.length == 0) {
        ok = true;
    }
    if (index > 0) {
        var prevElement = elements[index - 1];
        var prevRootPitchClass = prevElement.getAbsoluteNoteFromChordRootIndex(0) % 12;
        for (var i=0; i<fromRoots.length; i++) {
            var possiblePitchClass = prevElement.getAbsoluteNoteFromScaleIndex(fromRoots[i]) % 12;
            if (possiblePitchClass == prevRootPitchClass) {
                ok = true;
                break;
            }
        }
    }
    if (ok) {
        ok = false;
        for (var i=0; i<roots.length; i++) {
            var possiblePitchClass = element.getAbsoluteNoteFromScaleIndex(roots[i]) % 12;
            if (possiblePitchClass == rootPitchClass) {
                ok = true;
                break;
            }
        }
    }
    if (ok) {
        element.scaleType = scaleType;
    }
};

ModeMixtureHarmonyModifier.prototype.modifyHarmonyElement = function(index, elements, module) {
    var element = elements[index];

    switch (element.scaleType) {
        case ScaleType.MAJOR:
            this.modify(index, elements, module, this.majorFromRoots, this.majorRoots, this.majorNewScaleTypes[index % this.majorNewScaleTypes.length]);
            break;
        case ScaleType.NATURAL_MINOR:
            this.modify(index, elements, module, this.minorFromRoots, this.minorRoots, this.minorNewScaleTypes[index % this.minorNewScaleTypes.length]);
            break;
    }
};

ModeMixtureHarmonyModifier.prototype.modifyConstantHarmonyElements = function(elements, module) {
    var result = copyValueDeep(elements);

    var active = getValueOrExpressionValue(this, "active", module);
    if (!active) {
        return result;
    }

    var changedIndices = {};
    for (var i=0; i<this.indexRanges.length; i++) {
        if (!changedIndices[i]) {
            this.modifyHarmonyElement(i, result, module);
            changedIndices[i] = true;
        }
    }
    for (var i=0; i<elements.length; i++) {
        var modify = getItemFromArrayWithStartEndItems(0, this.modifyPattern, elements.length, i, this.startModifyPattern, this.endModifyPattern);
        if (modify != 0 && !changedIndices[i]) {
            this.modifyHarmonyElement(i, result, module);
            changedIndices[i] = true;
        }
    }
    return result;
};





