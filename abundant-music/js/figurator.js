

function FiguratorState() {
    this.absoluteNote = 60;
    this.stepCost = 0;
}

FiguratorState.prototype.toString = function() {
    return "FS{absNote:" + this.absoluteNote + ", stepCost:" + this.stepCost + "}";
};

var NonClassicalScaleFigurationMode = {
    TREAT_AS_CLASSICAL: 0,
    AUTO: 1
};

function Figurator(options) {
    DfsSolver.call(this, options);
    this.module = getValueOrDefault(options, "module", null);
    this.verbose = getValueOrDefault(options, "verbose", false);
    this.seed = getValueOrDefault(options, "seed", 352435);
    this.cluster = getValueOrDefault(options, "cluster", []);
    this.harmonyIndices = getValueOrDefault(options, "harmonyIndices", [0]); // Also defines the voice line element indices
    this.harmony = getValueOrDefault(options, "harmony", null); // For the section. Use harmonyIndices as index.
    this.voiceLine = getValueOrDefault(options, "voiceLine", null); // For the section. Use harmonyIndices as index.
    this.previousNotes = getValueOrDefault(options, "previousNotes", null); // Voice elements
    this.nextNotes = getValueOrDefault(options, "nextNotes", null); // Voice elements
    this.absoluteNotes = getValueOrDefault(options, "absoluteNotes", null);

    // Likelihood multipliers for certain intervals
    this.diminishedFifthLikelihood = getValueOrDefault(options, "diminishedFifthLikelihood", 0.001);
    this.augmentedFourthLikelihood = getValueOrDefault(options, "augmentedFourthLikelihood", 0.001);
    this.augmentedSecondLikelihood = getValueOrDefault(options, "augmentedSecondLikelihood", 0.01);
    this.minorSeventhLikelihood = getValueOrDefault(options, "minorSeventhLikelihood", 1.0);
    this.majorSeventhLikelihood = getValueOrDefault(options, "majorSeventhLikelihood", 1.0);

}

Figurator.prototype = new DfsSolver();


Figurator.prototype.setSeed = function(seed) {
    this.seed = seed;
    this.rnd = new MersenneTwister(this.seed);
};

Figurator.prototype.extractStateResultData = function(state) {
    return state.absoluteNote;
};

Figurator.prototype.isGoalNode = function(node) {
    if (node.depth >= this.cluster.length - 1) {
        return this.isGoalState(node.state);
    }
    return false;
};

Figurator.prototype.isGoalState = function(state) {
    return true;
};

Figurator.prototype.isInvalidState = function(state) {
    // Stuff that can be put here:
    // * Outlining dissonces
    // * Forbidden parallels
    return false;
};

Figurator.prototype.getHorizontalOffsets = function(e, j, likelihoodArr) {
    var offsets = [];
    switch (e.horizontalDomainTypes[j]) {
        case AdaptiveHorizontalDomainType.ENUMERABLE:
            offsets = e.horizontalDomainOffsetElements[j];
            if (likelihoodArr) {
                for (var i=0; i<offsets.length; i++) {
                    likelihoodArr[i] = e.horizontalDomainOffsetLikelihoods[j][i % e.horizontalDomainOffsetLikelihoods[j].length];
                }
            }
            break;
        case AdaptiveHorizontalDomainType.RANGE:
            for (var i=e.horizontalDomainOffsetRanges[j][0]; i<= e.horizontalDomainOffsetRanges[j][1]; i++) {
                offsets.push(i);
                if (likelihoodArr) {
                    likelihoodArr.push(1);
                }
            }
            break;
    }
    return offsets;
};

Figurator.prototype.getVerticalOffsets = function(e, likelihoodArr) {
    var offsets = [];

    switch (e.verticalDomainType) {
        case AdaptiveVerticalDomainType.ENUMERABLE:
            offsets = e.verticalDomainOffsetElements;
            for (var i=0; i<offsets.length; i++) {
                var l = e.verticalDomainOffsetElementLikelihoods[i % e.verticalDomainOffsetElementLikelihoods.length];
                likelihoodArr.push(l);
            }
            break;
        case AdaptiveVerticalDomainType.RANGE:
            for (var i=e.verticalDomainOffsetRange[0]; i<= e.verticalDomainOffsetRange[1]; i++) {
                offsets.push(i);
                likelihoodArr.push(1);
            }
            break;
        case AdaptiveVerticalDomainType.CURVE:
            // logit("Adaptive curve offsets not supported yet...");
            var fraction = e.clusterPositionFraction;

            var curve = e.verticalDomainCurve;
            if (curve) {
                var theCurve = this.module.getCurve(curve);
                var offsetRange = e.verticalDomainCurveOffsetRange; // How far off the curve to go
                var multiplier = e.verticalDomainCurveOffsetLikelihoodMultiplier; // What to multiply the likelihood when getting outside curve

                var curveValue = theCurve.getValue(this.module, fraction);
                curveValue = SnapMetrics.snap(curveValue, SnapMetrics.ROUND);
                for (var i=offsetRange[0]; i<= offsetRange[1]; i++) {
                    offsets.push(curveValue + i);
                    var lik = 1;
                    if (i != 0) {
                        lik = Math.pow(multiplier, Math.abs(i));
                    }
                    likelihoodArr.push(lik);
                }
            } else {
                logit("figurator could not find curve " + curve + "<br />");
            }
            break;
    }
    return offsets;
};


Figurator.prototype.intersectDomainAndLikelihoodArrs = function(doms, liks) {
    var prevDom = doms[0];
    var prevLik = liks[0];
    var result = null;
    for (var i=1; i<doms.length; i++) {
        var dom = doms[i];
        var lik = liks[i];
        result = this.intersectDomainAndLikelihoods(prevDom, prevLik, dom, lik);
        prevDom = result[0];
        prevLik = result[1];
    }
    return result;
};

Figurator.prototype.intersectDomainAndLikelihoods = function(dom1, dom2, lik1, lik2) {
    var resultDomain = {};
    var resultLikelihoods = {};

    for (var d in dom1) {
        if (dom2[d]) {
            resultDomain[d] = true;
            resultLikelihoods[d] = lik1[d] * lik2[d];
        }
    }
    return [resultDomain, resultLikelihoods];
};


Figurator.prototype.adjustForMelodicIntervals = function(likelihoods, previousAbsNote, harmonyElement) {
    var prevScaleIndex = harmonyElement.getScaleIndexAndChromaticOffsetForAbsoluteNote(previousAbsNote)[0];
    for (var d in likelihoods) {
        var multiplier = 1.0;
        d = parseInt(d, 10);
        var scaleIndex = harmonyElement.getScaleIndexAndChromaticOffsetForAbsoluteNote(d)[0];
        var diff = Math.abs(prevScaleIndex - scaleIndex);
        var absDiff = Math.abs(previousAbsNote - d);
        if (absDiff == 6) {
            // Tritone
            if (diff == 3) {
                // aug4
                multiplier *= this.augmentedFourthLikelihood;
            } else if (diff == 4) {
                // dim5
                multiplier *= this.diminishedFifthLikelihood;
            } else {
                logit("Not a good sign absDiff == 6 and not an aug4 or dim5. diff: " + diff + " " + " <br />");
                multiplier *= this.diminishedFifthLikelihood;
            }
        }
        if (diff == 1 && absDiff == 3) {
            // aug2
            multiplier *= this.augmentedSecondLikelihood;
        }
        likelihoods[d] = multiplier * likelihoods[d];
    }
};



// If index > 0, it must have a valid previousAbsNote
Figurator.prototype.getDomain = function(index, previousAbsNote, nextAbsNote, resultLikelihoods, node) {

    var harmonyIndex = this.harmonyIndices[index];
    var harmonyElement = this.harmony.get(harmonyIndex);
    var voiceLineElement = this.voiceLine.get(harmonyIndex);
    var currentElement = this.cluster[index];

    var nextElementHarmonyIndex = harmonyIndex;
    var nextElement = null;
    if (index < this.cluster.length - 1) {
        nextElementHarmonyIndex = this.harmonyIndices[index + 1];
        nextElement = this.cluster[index + 1];
    }
    var nextElementHarmonyElement = this.harmony.get(nextElementHarmonyIndex);
    var nextElementVoiceLineElement = this.voiceLine.get(nextElementHarmonyIndex);

    var prevElementHarmonyIndex = harmonyIndex;
    var prevElement = null;
    if (index > 0) {
        prevElementHarmonyIndex = this.harmonyIndices[index - 1];
        prevElement = this.cluster[index - 1];
    }
    var prevPrevElementHarmonyIndex = harmonyIndex;
    var prevPrevElement = null;
    if (index > 1) {
        prevPrevElementHarmonyIndex = this.harmonyIndices[index - 2];
        prevPrevElement = this.cluster[index - 2];
    }
    var prevElementHarmonyElement = this.harmony.get(prevElementHarmonyIndex);
    var prevPrevElementHarmonyElement = this.harmony.get(prevPrevElementHarmonyIndex);

    var nextHarmonyIndex = harmonyIndex;
    if (harmonyIndex < this.harmony.getCount() - 1) {
        nextHarmonyIndex += 1;
    }
    var nextHarmonyElement = this.harmony.get(nextHarmonyIndex);
    var nextVoiceLineElement = this.voiceLine.get(nextHarmonyIndex);

    if (!nextHarmonyElement) {
        logit("Unable to get harmony element with index " + nextHarmonyIndex + " from harmony " + this.harmony.toRomanString() + "<br />");
    }

    var prevHarmonyIndex = harmonyIndex;
    if (harmonyIndex > 0) {
        prevHarmonyIndex -= 1;
    }
    var prevHarmonyElement = this.harmony.get(prevHarmonyIndex);
    var prevVoiceLineElement = this.voiceLine.get(prevHarmonyIndex);


    var domain = null;
    var likelihoods = {};

    // ====================================================
    // Check any vertical constraints for the next element
    // ====================================================
    var verticalDomain = null;
    var verticalLikelihoods = {};

    var baseAbsNote = harmonyElement.getVerticalRelativeAbsoluteNote(currentElement.verticalRelativeType, voiceLineElement);

    if (currentElement.constantVerticalOffset) {
        baseAbsNote = harmonyElement.offset(baseAbsNote, currentElement.constantVerticalOffsetType,
            currentElement.constantVerticalOffset, harmonyElement);
    }

    var verticalLikelihoodArr = [];
    var offsets = this.getVerticalOffsets(currentElement, verticalLikelihoodArr);
    //        logit("Vertical Offsets: " + JSON.stringify(offsets) + "<br />");

    for (var i=0; i<offsets.length; i++) {
        var offset = offsets[i];
        var absNote = harmonyElement.offset(baseAbsNote, currentElement.verticalDomainOffsetType, offset, harmonyElement);

        if (verticalDomain == null) {
            verticalDomain = {};
        }
        if (absNote > 1 && absNote <= 127) {
            verticalDomain[absNote] = true;
            verticalLikelihoods[absNote] = verticalLikelihoodArr[i];
        }
    }

    if (verticalDomain != null) {
        domain = verticalDomain;
        likelihoods = verticalLikelihoods;
    }



    // ====================================================
    // Look backwards and check if the previous element refers to the current
    // ====================================================

    var prevToCurrentHorizontalDomain = null;
    var prevToCurrentHorizontalLikelihoods = {};
    if (prevElement) {
        for (var j=0; j<prevElement.horizontalRelativeTypes.length; j++) {
            var horizontalRelativeType = prevElement.horizontalRelativeTypes[j];
            switch (horizontalRelativeType) {
                case HorizontalRelativeType.NEXT_NOTE:
                    // The current element refers forward and influences the possible successors

                    if (prevToCurrentHorizontalDomain == null) {
                        prevToCurrentHorizontalDomain = {};
                    }
                    var likelihoodArr = [];
                    var offsets = this.getHorizontalOffsets(prevElement, j, likelihoodArr);

                    for (var i=0; i<offsets.length; i++) {
                        var absNote = prevElementHarmonyElement.offset(previousAbsNote,
                            prevElement.horizontalDomainOffsetTypes[j], offsets[i], prevElementHarmonyElement);
                        // Reinterpret this absolute note in the current harmony
                        if (absNote > 1 && absNote < 127) {
                            var reinterpreted = harmonyElement.snap(absNote, SnapType.SCALE, harmonyElement);
                            if (reinterpreted > 1 && reinterpreted < 127) {
                                prevToCurrentHorizontalDomain[reinterpreted] = true;
                                var oldL = prevToCurrentHorizontalLikelihoods[reinterpreted];
                                prevToCurrentHorizontalLikelihoods[reinterpreted] = oldL ? oldL * likelihoodArr[i] : likelihoodArr[i];
                            }
                        }
                    }
                    break;
            }
        }
    }
    if (prevToCurrentHorizontalDomain != null) {
        if (domain == null) {
            domain = prevToCurrentHorizontalDomain;
            likelihoods = prevToCurrentHorizontalLikelihoods;
        } else {
            var temp = this.intersectDomainAndLikelihoods(domain, prevToCurrentHorizontalDomain,
                likelihoods, prevToCurrentHorizontalLikelihoods);
            domain = temp[0];
            likelihoods = temp[1];
        }
    }

    // ====================================================
    // The current element can refer back to the previous element or voice line element
    // ====================================================
    var currentToPreviousHorizontalDomain = null;
    var currentToPreviousHorizontalLikelihoods = {};

    for (var j=0; j<currentElement.horizontalRelativeTypes.length; j++) {
        var horizontalRelativeType = currentElement.horizontalRelativeTypes[j];
        switch (horizontalRelativeType) {
            case HorizontalRelativeType.PREVIOUS_NOTE:
            case HorizontalRelativeType.PREVIOUS_VOICE_LINE_ELEMENT:
                // The current element refers backward and is influenced

                if (currentToPreviousHorizontalDomain == null) {
                    currentToPreviousHorizontalDomain = {};
                }
                var likelihoodArr = [];
                var offsets = this.getHorizontalOffsets(currentElement, j, likelihoodArr);
                var referenceAbsNote = previousAbsNote;

                if (referenceAbsNote == null &&
                    currentElement.horizontalRelativeTypes[j] == HorizontalRelativeType.PREVIOUS_NOTE) {
                    var previousNote = this.previousNotes.get(currentElement);
                    referenceAbsNote = this.absoluteNotes.get(previousNote);
                }

                if (referenceAbsNote == null ||
                    currentElement.horizontalRelativeTypes[j] == HorizontalRelativeType.PREVIOUS_VOICE_LINE_ELEMENT) {
                    referenceAbsNote = prevHarmonyElement.getAbsoluteNoteConstantVoiceLineElement(prevVoiceLineElement);
                }

                for (var i=0; i<offsets.length; i++) {
                    var absNote = harmonyElement.offset(referenceAbsNote,
                        currentElement.horizontalDomainOffsetTypes[j], offsets[i], harmonyElement);
                    //                        logit("______offset " + offsets[i] + " gave abs note " + absNote + "<br />");

                    if (absNote > 1 && absNote < 127) {
                        currentToPreviousHorizontalDomain[absNote] = true;
                        currentToPreviousHorizontalLikelihoods[absNote] = likelihoodArr[i];
                    }
                }
                break;
        }
    }

    // Set or intersect the domain
    if (currentToPreviousHorizontalDomain != null) {
        if (domain == null) {
            domain = currentToPreviousHorizontalDomain;
            likelihoods = currentToPreviousHorizontalLikelihoods;
        } else {
            var temp = this.intersectDomainAndLikelihoods(domain, currentToPreviousHorizontalDomain,
                likelihoods, currentToPreviousHorizontalLikelihoods);
            domain = temp[0];
            likelihoods = temp[1];
        }
    }


    // ====================================================
    // The current element can refer to the next element or voice line element
    // If the current element is the last in the cluster, it may exist a next absolute note
    // ====================================================
    var currentToNextHorizontalDomain = null;
    var currentToNextHorizontalLikelihoods = {};

    for (var j=0; j<currentElement.horizontalRelativeTypes.length; j++) {
        var  horizontalRelativeType = currentElement.horizontalRelativeTypes[j];
        switch ( horizontalRelativeType) {
            case HorizontalRelativeType.NEXT_NOTE:
            case HorizontalRelativeType.NEXT_VOICE_LINE_ELEMENT:
                // The next element refers forward

                var likelihoodArr = [];
                var offsets = this.getHorizontalOffsets(currentElement, j, likelihoodArr);
                var referenceAbsNote = nextAbsNote;
                if (currentElement.horizontalRelativeTypes[j] == HorizontalRelativeType.NEXT_VOICE_LINE_ELEMENT) {
                    referenceAbsNote = nextHarmonyElement.getAbsoluteNoteConstantVoiceLineElement(nextVoiceLineElement);
                    //                    logit("______getting abs note from previous voice line " + referenceAbsNote + "<br />");
                }
                if (currentElement.horizontalRelativeTypes[j] == HorizontalRelativeType.NEXT_NOTE) {
                    var nextNote = this.nextNotes.get(currentElement);
                    if (nextNote) {
                        referenceAbsNote = this.absoluteNotes.get(nextNote);
                    }
                    if (!referenceAbsNote && index == this.cluster.length - 1) {
                        referenceAbsNote = nextHarmonyElement.getAbsoluteNoteConstantVoiceLineElement(nextVoiceLineElement);
                    }
                }
                if (referenceAbsNote != null) {
                    if (currentToNextHorizontalDomain == null) {
                        currentToNextHorizontalDomain = {};
                    }
                    for (var i=0; i<offsets.length; i++) {
                        var absNote = harmonyElement.offset(referenceAbsNote,
                            currentElement.horizontalDomainOffsetTypes[j], offsets[i], harmonyElement);
                        //                        logit("______offset " + offsets[i] + " gave abs note " + absNote + "<br />");
                        if (absNote > 1 && absNote < 127) {
                            currentToNextHorizontalDomain[absNote] = true;
                            currentToNextHorizontalLikelihoods[absNote] = likelihoodArr[i];
                        }
                    }
                }
                break;
        }
    }

    // Set or intersect the domain
    if (currentToNextHorizontalDomain != null) {
        if (domain == null) {
            domain = currentToNextHorizontalDomain;
            likelihoods = currentToNextHorizontalLikelihoods;
        } else {
            var temp = this.intersectDomainAndLikelihoods(domain, currentToNextHorizontalDomain,
                likelihoods, currentToNextHorizontalLikelihoods);
            domain = temp[0];
            likelihoods = temp[1];
        }
    }

    // Adjust likelihoods for certain ill-sounding melodic intervals



    var sameScale = harmonyElement.sameScale(prevElementHarmonyElement);
    if (sameScale) {
        this.adjustForMelodicIntervals(likelihoods, previousAbsNote, harmonyElement);
    }

    if (index > 0) {
        var scaleIndices = harmonyElement.getChordRootPositionScaleIndices();
        var pitchClasses = harmonyElement.getPitchClassesFromScaleIndices(scaleIndices);

        var prevScaleIndices = prevHarmonyElement.getChordRootPositionScaleIndices();
        var prevPitchClasses = prevHarmonyElement.getPitchClassesFromScaleIndices(prevScaleIndices);

        var prevWasHarmonic = arrayContains(prevPitchClasses, previousAbsNote % 12);

        var isSeventh = false;
        var isSeventhElement = harmonyElement.isSeventh();
        if (isSeventhElement) {
            var seventhPitchClass = harmonyElement.getAbsoluteNoteFromScaleIndex(scaleIndices[3]) % 12;
            isSeventh = seventhPitchClass == (previousAbsNote % 12);
        }

        var prevWasSeventh = false;
        var prevWasSeventhElement = prevHarmonyElement.isSeventh();
        if (prevWasSeventhElement) {
            var prevSeventhPitchClass = prevHarmonyElement.getAbsoluteNoteFromScaleIndex(prevScaleIndices[3]) % 12;
            prevWasSeventh = prevSeventhPitchClass == (previousAbsNote % 12);
        }

        var prevPrevWasHarmonic = true;

        var prevLeapSize = 0;
        var prevLeapDiff = 0;

        if (index > 1) {
            var prevPrevScaleIndices = prevPrevElementHarmonyElement.getChordRootPositionScaleIndices();
            var prevPrevPitchClasses = prevPrevElementHarmonyElement.getPitchClassesFromScaleIndices(prevPrevScaleIndices);
            var prevPrevAbsNote = node.previous.state.absoluteNote;
            prevPrevWasHarmonic = arrayContains(prevPrevPitchClasses, prevPrevAbsNote % 12);

            prevLeapDiff = previousAbsNote - prevPrevAbsNote;
            prevLeapSize = Math.abs(prevLeapDiff);
        }

        for (var d in likelihoods) {
            var lik = likelihoods[d];

            d = parseInt(d, 10);
            var leapDiff = d - previousAbsNote;
            var leapSize = Math.abs(leapDiff);
            if (leapSize > 2) {
                var pitchClass = d % 12;
                if (!arrayContains(pitchClasses, d) || (prevWasSeventh && pitchClass == seventhPitchClass)) {
                    // Punish leaps into non-harmony or sevenths
                    var multiplier = 1.0 / (1 + leapSize * 4);
                    lik = multiplier * lik;
                }
                if (!prevWasHarmonic || prevWasSeventh) {
                    // Punish leaps from non-harmony
                    var multiplier = 1.0 / (1 + leapSize);
                    lik = multiplier * lik;
                }

            }
            if (!prevWasHarmonic && !prevPrevWasHarmonic && !arrayContains(prevPrevPitchClasses, d)) {
                // Three non-harmonic notes in row, punish!!!
                var threeNHInRowPenalty = 0.1;
                lik = threeNHInRowPenalty * lik;
            }
            if (prevLeapSize > 5) { // Larger than perfect fourth
                // Punish large leaps without change in direction using step
                if ((leapDiff >= 0 && prevLeapDiff > 0) ||
                    (leapDiff <= 0 && prevLeapDiff < 0)) {
                    // Leaping in the same direction (or stays the same)
                    var prevLeapPenaltyCount = prevLeapSize - 5;
                    prevLeapPenaltyCount += leapSize;
                    var multiplier = 1.0 / (1 + prevLeapPenaltyCount);
//                    lik = multiplier * lik;
                }
            }

            likelihoods[d] = lik;
        }




    }



    for (var d in likelihoods) {
        resultLikelihoods[d] = likelihoods[d];
    }




    if (this.verbose) {
        logit("In getDomain() for index " + index + " previousAbsNote: " + previousAbsNote + " nextAbsNote: " + nextAbsNote + "<br />");
        logit("___ prev to current domain: " + JSON.stringify(prevToCurrentHorizontalDomain) + "<br />");
        logit("___ prev to current likelihoods: " + JSON.stringify(prevToCurrentHorizontalLikelihoods) + "<br />");
        logit("___ current to prev domain: " + JSON.stringify(currentToPreviousHorizontalDomain) + "<br />");
        logit("___ current to prev likelihoods: " + JSON.stringify(currentToPreviousHorizontalLikelihoods) + "<br />");
        logit("___ current to next domain: " + JSON.stringify(currentToNextHorizontalDomain) + "<br />");
        logit("___ current to next likelihoods: " + JSON.stringify(currentToNextHorizontalLikelihoods) + "<br />");
        logit("__ resulting domain: " + JSON.stringify(domain) + "<br />");
        logit("__ resulting likelihoods: " + JSON.stringify(resultLikelihoods) + "<br />");
    }
    //    logit(
    //        "__ resulting domain: " + JSON.stringify(domain) + " " +
    //        "__ vertical domain: " + JSON.stringify(verticalDomain) + " " +
    //        "<br />");
    //    logit(
    //        "__ resulting likelihoods: " + JSON.stringify(resultLikelihoods) +  " " +
    //        "__ vertical likelihoods: " + JSON.stringify(verticalLikelihoods) +  " " +
    //        "<br />");
    return domain;
};


Figurator.prototype.getSuccessorDomain = function(index, node, likelihoods) {
    var currentState = node.state;
    var currentAbsNote = currentState.absoluteNote;

    return this.getDomain(index + 1, currentAbsNote, null, likelihoods, node);
};


Figurator.prototype.intersectDomains = function(dom1, dom2) {
    var result = {};
    for (var d in dom1) {
        if (dom2[d]) {
            result[d] = true;
        }
    }
    return result;
};

Figurator.prototype.createStatesFromDomain = function(domain, domainLikelihoods, resultStates, resultLikelihoods) {
    for (var d in domain) {
        var state = new FiguratorState();
        state.absoluteNote = parseInt(d, 10);
        resultStates.push(state);
        var likelihood = domainLikelihoods[d];
        if (!likelihood) {
            likelihood = 1;
        }
        resultLikelihoods.push(likelihood);
    }
};

Figurator.prototype.getSuccessorDomainStatesAndLikelihoods = function(index, node, resultStates, resultLikelihoods) {

    if (index >= this.cluster.length) {
        logit("Index error in Figurator.prototype.getDomainStatesAndLikelihoods() " + index + " " + this.cluster.length + "<br />");
        return;
    }

    var domainLikelihoods = {};
    var domain = this.getSuccessorDomain(index, node, domainLikelihoods);

    //    logit("____domain: " + JSON.stringify(domain) + " index: " + index + " <br />");
    //    logit("____domainLikelihoods: " + JSON.stringify(domainLikelihoods) + " index: " + index + " <br />");

    this.createStatesFromDomain(domain, domainLikelihoods, resultStates, resultLikelihoods);
};

Figurator.prototype.getSuccessorDomainIteratorForElement = function(index, node) {
    var states = [];
    var likelihoods = [];
    this.getSuccessorDomainStatesAndLikelihoods(index, node, states, likelihoods);
    return new RandomDfsStateIterator(states, likelihoods, this.rnd);
};

Figurator.prototype.getStartStateIterator = function() {

    var domainLikelihoods = {};
    var domain = this.getDomain(0, null, null, domainLikelihoods, null);

    var states = [];
    var likelihoods = [];
    this.createStatesFromDomain(domain, domainLikelihoods, states, likelihoods);

    return new RandomDfsStateIterator(states, likelihoods, this.rnd);
};

Figurator.prototype.getSuccessorIterator = function(node) {
    return this.getSuccessorDomainIteratorForElement(node.depth, node);
};


Figurator.prototype.prepareBeforeSearch = function() {
    figurationTimer.start();
};

Figurator.prototype.searchDone = function() {
    figurationTimer.pause();
};

