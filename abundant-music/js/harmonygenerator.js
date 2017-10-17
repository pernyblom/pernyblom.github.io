

function HarmonyGenerator(options) {
    DfsSolver.call(this, options);
    this.maxMLSolutions = 20;
    this.maxSearchSteps = 5000;
    this.count = getValueOrDefault(options, "count", 1);
    this.startBeatStrengths = getValueOrDefault(options, "startBeatStrengths", [1.0]);
    this.seed = getValueOrDefault(options, "seed", 12345);
    this.setSeed(this.seed);
    this.failReason = "";
    this._constructorName = "HarmonyGenerator";
}

HarmonyGenerator.prototype = new DfsSolver();

HarmonyGenerator.prototype.extractStateResultData = function(state) {
    return state.harmony;
};


HarmonyGenerator.prototype.getStartBeatStrengthsFromHarmonyElements = function(module, elements, beatOffset, numerator, beatStrengths) {
    var beatLengths = [];
    for (var i=0; i<elements.length; i++) {
        beatLengths[i] = elements[i].getBeatLength();
    }
    return this.getStartBeatStrengths(module, beatLengths, beatOffset, numerator, beatStrengths);
};

HarmonyGenerator.prototype.getStartBeatStrengths = function(module, beatLengths, beatOffset, numerator, beatStrengths) {
    var result = [];
    var num = numerator;
    var currentBeat = beatOffset ? beatOffset : 0;

    // The beat strengths should come
    if (!beatStrengths) {
        beatStrengths = [1, 0.7, 0.9, 0.5, 0.3, 0.2, 0.1];
    }

    for (var i=0; i<beatLengths.length; i++) {
        var beatIndex = Math.floor(currentBeat) % num;
        result.push(beatStrengths[beatIndex % beatStrengths.length]);

        var beatLength = beatLengths[i];
        currentBeat += beatLength;
    }

    return result;
};


HarmonyGenerator.prototype.calculateSeventhToTriadCosts = function(node, possibleNextStates, possibleNextStateLikelihoods, possibleNextStateCosts) {
    var state = node.state;
    var fromHarmony = state.harmony;

    for (var i=0; i<possibleNextStates.length; i++) {
        var toHarmony = possibleNextStates[i].harmony;
        if (fromHarmony.sameScale(toHarmony)) {
            var fromRoot = positiveMod(fromHarmony.chordRoot, 7);
            var toRoot = positiveMod(toHarmony.chordRoot, 7);
            if (fromRoot == toRoot && fromHarmony.isSeventh() && toHarmony.isTriad()) {
                var cost = 5;
//                logit("Compensating for seventh to triad");
                possibleNextStateCosts[i] += cost;
            }
        }
    }
};

HarmonyGenerator.prototype.getCostFromLikelihood = function(l) {
    return l > 0.0 ? -Math.log(l) : 99999999999;
};

HarmonyGenerator.prototype.calculateSusCosts = function(node, possibleNextStates, possibleNextStateLikelihoods, possibleNextStateCosts,
                                                        sus2Likelihood, sus4Likelihood) {
    var state = node.state;
    var fromHarmony = state.harmony;

    for (var i=0; i<possibleNextStates.length; i++) {
        var toHarmony = possibleNextStates[i].harmony;

        if (toHarmony.isSus2()) {
            possibleNextStateLikelihoods[i] *= sus2Likelihood;
        } else if (toHarmony.isSus4()) {
            possibleNextStateLikelihoods[i] *= sus4Likelihood;
        }

        if (fromHarmony.sameScale(toHarmony)) {
            var cost = 0;
            if (fromHarmony.isSus()) {
                // toHarmony should have one note that is a step below so the sus can resolve


                var susAbsNote = fromHarmony.getAbsoluteNoteFromChordRootIndex(1) % 12;
                var toPitchClasses = toHarmony.getChordPitchClasses();
                if (!arrayContains(toPitchClasses, (susAbsNote - 1) % 12) && !arrayContains(toPitchClasses, (susAbsNote - 2) % 12)) {
                    cost += 2;
//                    logit("Avoiding sus " + fromHarmony.toRomanString() + " -> " + toHarmony.toRomanString());
                } else {
//                    logit("Not Avoiding sus " + fromHarmony.toRomanString() + " -> " + toHarmony.toRomanString());
                }

                if (toHarmony.isSus()) {
                    cost += 1; // Two suses in row may not be the greatest idea...
                }

            }
            if (cost > 0) {
                possibleNextStateCosts[i] += cost;
            }
        }
    }
};

HarmonyGenerator.prototype.calculateBeatStrengthRepetitionCost = function(fromHarmony, fromBeatStrength, toHarmony, toBeatStrength) {
    var cost = 0.0;
    if (toBeatStrength > fromBeatStrength) {
        if (fromHarmony.sameScale(toHarmony)) {
            var fromRoot = positiveMod(fromHarmony.chordRoot, 7);
            var toRoot = positiveMod(toHarmony.chordRoot, 7);

            if (fromRoot == toRoot) {
                cost += 5;
//                        logit("  root was same...");
            }
            var fromBass = fromHarmony.getAbsoluteNoteFromChordBassIndex(0);
            var toBass = toHarmony.getAbsoluteNoteFromChordBassIndex(0);

            if (fromBass == toBass) {
                cost += 5;
//                        logit("  bass was same...");
            }

            // V and VII is treated as the same chord
            if ((fromRoot == 6 && toRoot == 4) || (fromRoot == 4 && toRoot == 6)) {
                cost += 5;
//                        logit("Compensating for V <-> VII");
            }
        }
    }
    return cost;
};


HarmonyGenerator.prototype.calculateBeatStrengthRepetitionCosts = function(node, possibleNextStates, possibleNextStateLikelihoods, possibleNextStateCosts) {

    if (this.startBeatStrengths.length > 0) {
        var fromBeatStrength = this.startBeatStrengths[node.depth % this.startBeatStrengths.length];
        var toBeatStrength = this.startBeatStrengths[(node.depth + 1) % this.startBeatStrengths.length];

        var state = node.state;
        if (toBeatStrength > fromBeatStrength) {
            var fromHarmony = state.harmony;

//            logit("Checking " + fromBeatStrength + " " + toBeatStrength + " " + fromHarmony.toRomanString());
            for (var i=0; i<possibleNextStates.length; i++) {

                var toHarmony = possibleNextStates[i].harmony;

                var cost = this.calculateBeatStrengthRepetitionCost(fromHarmony, fromBeatStrength, toHarmony, toBeatStrength);

                if (cost > 0) {
//                    var likelihood = possibleNextStateLikelihoods[i];
//                    possibleNextStateLikelihoods[i] = likelihood * multiplier;
                    possibleNextStateCosts[i] += cost;
                }
            }
        }
    }

};


HarmonyGenerator.prototype.getChordsStuff = function(index, state, likelihood, cost, seventhLikelihoodArr, triadLikelihoodArr,
                                                     seventhCostArr, triadCostArr,
                                                     resultStates, resultLikelihoods, resultCosts) {
    var harmony = state.harmony;

    var seventhLikelihoods = [0, 0, 0, 0, 0, 0, 0];
    if (seventhLikelihoodArr.length > 0) {
        seventhLikelihoods = seventhLikelihoodArr[index % seventhLikelihoodArr.length];
    }
    var triadLikelihoods = [0, 0, 0, 0, 0, 0, 0];
    if (triadLikelihoodArr.length > 0) {
        triadLikelihoods = triadLikelihoodArr[index % triadLikelihoodArr.length];
    }
    var seventhCosts = [0, 0, 0, 0, 0, 0, 0];
    if (seventhCostArr.length > 0) {
        seventhCosts = seventhCostArr[index % seventhCostArr.length];
    }
    var triadCosts = [0, 0, 0, 0, 0, 0, 0];
    if (triadCostArr.length > 0) {
        triadCosts = triadCostArr[index % triadCostArr.length];
    }

    var seventhLikelihood = 0;
    if (seventhLikelihoods.length > 0) {
        seventhLikelihood = seventhLikelihoods[positiveMod(harmony.chordRoot, 7) % seventhLikelihoods.length];
    }
    var triadLikelihood = 0;
    if (triadLikelihoods.length > 0) {
        triadLikelihood = triadLikelihoods[positiveMod(harmony.chordRoot, 7) % triadLikelihoods.length];
    }
    var seventhCost = 0;
    if (seventhCosts.length > 0) {
        seventhCost = seventhCosts[positiveMod(harmony.chordRoot, 7) % seventhCosts.length];
    }
    var triadCost = 0;
    if (triadCosts.length > 0) {
        triadCost = triadCosts[positiveMod(harmony.chordRoot, 7) % triadCosts.length];
    }

    if (seventhLikelihood > 0) {
        var stateCopy = copyValueDeep(state);
        stateCopy.harmony.addSeventh();
        resultStates.push(stateCopy);
        resultLikelihoods.push(likelihood * seventhLikelihood);
        resultCosts.push(cost + seventhCost);
    }
    if (triadLikelihood > 0) {
        var stateCopy = copyValueDeep(state);
        stateCopy.harmony.removeSeventh();
        resultStates.push(stateCopy);
        resultLikelihoods.push(likelihood * triadLikelihood);
        resultCosts.push(cost + triadCost);
    }

    if (seventhLikelihood == 0 && triadLikelihood == 0) {
        var stateCopy = copyValueDeep(state);
        resultStates.push(stateCopy);
        resultLikelihoods.push(likelihood);
        resultCosts.push(cost);
    }

};


HarmonyGenerator.prototype.setSeed = function(seed) {
    this.seed = seed;
    this.rnd = new MersenneTwister(this.seed);
};

//HarmonyGenerator.prototype.getStartState = function() {
//    logit("HarmonyGenerator need to implement getStartState()<br />");
//};

HarmonyGenerator.prototype.isGoalNode = function(node) {
    if (node.depth >= this.count - 1) {
        // Checking goal state at the end
        var result = this.isGoalState(node.state);
        //        if (result) {
        //            logit("Found goal state on depth " + node.depth + "<br />");
        //        }
        return result;
    }
    return false;
};

HarmonyGenerator.prototype.isMaxDepth = function(node) {
    return node.depth >= this.count - 1;
};

HarmonyGenerator.prototype.getBassNeighbourChords = function(fromHarmony, possibleRoots, possibleInversions, possibleSusRoots, possibleMixtureRoots) {

    var harmonies = [];

    var inversions = fromHarmony.chordInversions;

    if (inversions == 0) {
        var baseChordRoot = fromHarmony.chordRoot;
        var fromChordType = fromHarmony.chordType;


        if (!fromHarmony.isSus()) {
            // A 63 chord with the root a 3rd below base
            harmonies.push(fromHarmony.copy().setChordRoot(baseChordRoot - 2).setChordInversions(1));

            // A 63 chord with the root a 4th below base
            harmonies.push(fromHarmony.copy().setChordRoot(baseChordRoot - 3).setChordInversions(1));

            // A 64 chord with the root a 5th below base
            harmonies.push(fromHarmony.copy().setChordRoot(baseChordRoot - 4).setChordInversions(2));

            // A 64 chord with the root a 6th below base
            harmonies.push(fromHarmony.copy().setChordRoot(baseChordRoot - 5).setChordInversions(2));
        }

        if (!fromHarmony.isSus()) {
            // A sus2 chord with the same root
            // Not a good neighbour since it doesn't resolve down
//            harmonies.push(fromHarmony.copy().setChordType(ChordType.SUS2));

            // A sus4 chord with the same root
            harmonies.push(fromHarmony.copy().setChordType(ChordType.SUS4));
        }
        if (fromHarmony.scaleType == ScaleType.MAJOR) {
            if (fromHarmony.chordRoot == 0 && fromHarmony.chordType == ChordType.TRIAD) {
                harmonies.push(fromHarmony.copy().setChordRoot(3).setChordInversions(2).setScaleType(ScaleType.HARMONIC_MINOR));
//                logit("adding mixture 1");
            }
            if (fromHarmony.chordRoot == 4 && fromHarmony.chordType == ChordType.TRIAD) {
                harmonies.push(fromHarmony.copy().setChordRoot(0).setChordInversions(2).setScaleType(ScaleType.HARMONIC_MINOR));
//                logit("adding mixture 2");
            }
        }
    } else {
        logit("Not supporting neighbour chords with inversion " + inversions + "<br />");
    }

    var result = this.filterChords(fromHarmony, harmonies, possibleRoots, possibleInversions, possibleSusRoots, possibleMixtureRoots);

    return result;
};

HarmonyGenerator.prototype.filterChords = function(fromHarmony, tempResult, possibleRoots, possibleInversions, possibleSusRoots, possibleMixtureRoots) {
    var result = [];
    for (var i=0; i<tempResult.length; i++) {
        var chord = tempResult[i];
        var ok = true;
        var chordRoot = positiveMod(chord.chordRoot, 7);

        var isSus = chord.isSus();
        var isMixture = chord.scaleType != fromHarmony.scaleType &&
            (chord.scaleType == ScaleType.MAJOR || fromHarmony.scaleType == ScaleType.MAJOR);

        if (!isSus && !isMixture && possibleRoots) {
            var index = possibleRoots.indexOf(chordRoot);
            if (index >= 0) {
                if (possibleInversions) {
                    var inversions = possibleInversions[index];
                    if (inversions && !arrayContains(inversions, chord.chordInversions)) {
                        ok = false;
                    } else if (!inversions) {
                        logit("Invalid possible inversions? " + JSON.stringify(possibleInversions));
                    }
                }
            } else {
                ok = false;
            }
        }
        if (!isMixture && isSus) {
            if (possibleSusRoots) {
                var index = possibleSusRoots.indexOf(chordRoot);
                if (index >= 0) {
                } else {
                    ok = false;
                }
            } else {
                ok = false;
            }
        }
        if (isMixture) {
            // Mixture of some kind perhaps...

//            logit("filtering mixture chords...");
            if (possibleMixtureRoots) {
                // Scale types
                if (!arrayContains(possibleMixtureRoots, chordRoot)) {
                    ok = false;
//                    logit(" removed " + possibleMixtureRoots + " : " + chordRoot);
                } else {
//                    logit(" keeping mixture chord! " + ok);
                }

            } else {
                ok = false;
            }
        }
        if (ok) {
            result.push(chord);
        }
    }
    return result;
};

HarmonyGenerator.prototype.getBassPassingChords = function(fromHarmony, toHarmony,
                                                           absIncrement, possibleRoots, possibleInversions) {
    var tempResult = [];
    var fromBassIndex = fromHarmony.getBassScaleIndex();
    var toBassIndex = toHarmony.getBassScaleIndex();

    var diff = toBassIndex - fromBassIndex;
    var absDiff = Math.abs(diff);

    // Make sure that we don't overshoot the target
    absIncrement = Math.min(absIncrement, absDiff);
    var increment = absIncrement;
    if (diff == 0) {
        logit("Can not find a passing chord when the basses are the same <br />");
        return tempResult;
    } else if (diff < 0) {
        increment = -increment;
    }

    var fromChordRoot = fromHarmony.getChordRootScaleIndex();

//    if (fromHarmony.hasSeventh()) {
//        logit("getBassPassingChords() does not support seventh chords yet <br />");
    if (fromHarmony.chordInversions > 1) {
        logit("getBassPassingChords() does not support chords with inversions > 1 yet <br />");
    } else if (fromHarmony.chordInversions == 0) {
        // A 53 chord
        switch (increment) {
            case -2:
                // A 63 chord with its root a 5th below (for example I and IV6)
                tempResult.push(fromHarmony.copy().setChordRoot(fromChordRoot - 4).setChordInversions(1));
                // A 53 chord with its root a 3nd below (for example I and VI)
                tempResult.push(fromHarmony.copy().setChordRoot(fromChordRoot - 2).setChordInversions(0));
                break;
            case -1:
                // A 63 chord with its root a 4th below (for example I and V6)
                tempResult.push(fromHarmony.copy().setChordRoot(fromChordRoot - 3).setChordInversions(1));
                // A 53 chord with its root a 2nd below (for example I and VII, which should be avoided in major)
                tempResult.push(fromHarmony.copy().setChordRoot(fromChordRoot - 1).setChordInversions(0));
                break;
            case 1:
                // A 63 chord with its root a 2nd below (for example I and VII6)
                tempResult.push(fromHarmony.copy().setChordRoot(fromChordRoot - 1).setChordInversions(1));
                // A 53 chord with its root a 2nd above (for example I and II, which should be avoided in minor)
                tempResult.push(fromHarmony.copy().setChordRoot(fromChordRoot + 1).setChordInversions(0));
                break;
            case 2:
                // A 53 chord with its root a 3rd above (for example I and III)
                tempResult.push(fromHarmony.copy().setChordRoot(fromChordRoot + 2).setChordInversions(0));
                // A 63 chord with same root (for example I and I6)
                tempResult.push(fromHarmony.copy().setChordRoot(fromChordRoot).setChordInversions(1));
                break;
            default:
                logit("getBassPassingChords() does not support increments " + increment + "<br />");
                break;
        }
    } else {
        // A 63 chord
        switch (increment) {
            case -2:
                // A 63 chord with its root a 3rd below (for example I6 and VI6)
                tempResult.push(fromHarmony.copy().setChordRoot(fromChordRoot - 2).setChordInversions(1));
                // A 53 chord with same root (for example I6 and I)
                tempResult.push(fromHarmony.copy().setChordRoot(fromChordRoot).setChordInversions(0));
                break;
            case -1:
                // A 53 chord with its root a 2nd above (for example I6 and II)
                tempResult.push(fromHarmony.copy().setChordRoot(fromChordRoot + 1).setChordInversions(0));
                // A 63 chord with its root a 2nd below (for example I6 and VII6)
                tempResult.push(fromHarmony.copy().setChordRoot(fromChordRoot - 1).setChordInversions(1));
                break;
            case 1:
                // A 53 chord with its root a 4th above (for example I6 and IV)
                tempResult.push(fromHarmony.copy().setChordRoot(fromChordRoot + 3).setChordInversions(0));
                // A 63 chord with its root a 2nd above (for example I6 and II6)
                tempResult.push(fromHarmony.copy().setChordRoot(fromChordRoot + 1).setChordInversions(1));
                break;
            case 2:
                // A 63 chord with its root a 3rd above (for example I6 and III6)
                tempResult.push(fromHarmony.copy().setChordRoot(fromChordRoot + 2).setChordInversions(1));
                // A 53 chord with its root a fifth above (for example I6 and V)
                tempResult.push(fromHarmony.copy().setChordRoot(fromChordRoot + 4).setChordInversions(0));
                break;
            default:
                logit("getBassPassingChords() does not support increments " + increment + "<br />");
                break;
        }
    }

    var result = this.filterChords(fromHarmony, tempResult, possibleRoots, possibleInversions);

    return result;
};

HarmonyGenerator.prototype.getThirdFromBassPassingChords = function(fromHarmony, toHarmony,
                                                                    absIncrement) {
};

HarmonyGenerator.prototype.getFifthFromBassPassingChords = function(fromHarmony, toHarmony,
                                                                    absIncrement) {
};

HarmonyGenerator.prototype.getSeventhFromBassPassingChords = function(fromHarmony, toHarmony,
                                                                      absIncrement) {
};

HarmonyGenerator.prototype.prepareBeforeSearch = function() {
};
HarmonyGenerator.prototype.searchDone = function() {
};

