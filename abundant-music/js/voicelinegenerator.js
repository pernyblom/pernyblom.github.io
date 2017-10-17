
function VoiceLineSearchNode(state, searchDepth, resultIndex) {
    this.state = state;
    this.searchDepth = searchDepth;
    this.resultIndex = resultIndex; // Where to write the result
    this.totalCost = 0;
}

VoiceLineSearchNode.prototype.toString = function() {
    return "VLSN {" +
        "state: " + this.state +
        "depth: " + this.depth +
        "}";
};


function VoiceLineGenerator(options) {
    this.reusables = getValueOrDefault(options, "reusables", {});

    this.maxSearchDepth = getValueOrDefault(options, "maxSearchDepth", 3);
    this.maxSearchSteps = getValueOrDefault(options, "maxSearchSteps", 2000);
    this.harmony = getValueOrDefault(options,
        "harmony", new ConstantHarmonicRythm([new ConstantHarmonyElement().setChordRoot(0)]));
    this.checkParallelOctavesAndUnisons = getValueOrDefault(options, "checkParallelOctavesAndUnisons", true);
    this.parallelOctavesAndUnisonsPenalty = getValueOrDefault(options, "parallelOctavesAndUnisonsPenalty", 10);
    this.checkParallelFifths = getValueOrDefault(options, "checkParallelFifths", true);
    this.parallelFifthsPenalty = getValueOrDefault(options, "parallelFifthsPenalty", 10);
    this.checkLargeLeapReverseDirection = getValueOrDefault(options, "checkLargeLeapReverseDirection", true);
    this.largeLeapReverseDirectionPenaltyFactor = getValueOrDefault(options, "largeLeapReverseDirectionPenaltyFactor", 1);
    this.checkLeadingToneDoubling = getValueOrDefault(options, "checkLeadingToneDoubling", true); //
    this.leadingToneDoublingPenalty = getValueOrDefault(options, "leadingToneDoubling", 5); //

    this.bestSolutionCost = 99999999;
    this.resultStates = [];
    this.searchSteps = 0;
}


VoiceLineGenerator.prototype.getlargeLeapToPitchClassPenaltyCount = function(prevAbsNote, curAbsNote, maxLeap, pitchClass) {
    if ((curAbsNote % 12) == pitchClass) {
        return this.getlargeLeapPenaltyCount(prevAbsNote, curAbsNote, maxLeap);
    } else {
        return 0;
    }
};

VoiceLineGenerator.prototype.getlargeLeapFromPitchClassPenaltyCount = function(prevAbsNote, curAbsNote, maxLeap, pitchClass) {
    if ((prevAbsNote % 12) == pitchClass) {
        return this.getlargeLeapPenaltyCount(prevAbsNote, curAbsNote, maxLeap);
    } else {
        return 0;
    }
};

VoiceLineGenerator.prototype.getLeapRangeFromPitchClassPenaltyCount = function(prevAbsNote, curAbsNote, lowerLeap, upperLeap, pitchClass) {
    if ((prevAbsNote % 12) == pitchClass) {
        return this.getLeapRangePenaltyCount(prevAbsNote, curAbsNote, lowerLeap, upperLeap);
    } else {
        return 0;
    }
};

VoiceLineGenerator.prototype.getlargeLeapPenaltyCount = function(prevAbsNote, curAbsNote, maxLeap) {
    var leapSize = Math.abs(prevAbsNote - curAbsNote);
    if (leapSize > maxLeap) {
        return leapSize - maxLeap;
    } else {
        return 0;
    }
};
VoiceLineGenerator.prototype.getLeapRangePenaltyCount = function(prevAbsNote, curAbsNote, lowerLeap, upperLeap) {
    var leapSize = curAbsNote - prevAbsNote;
    if (leapSize < lowerLeap) {
        return lowerLeap - leapSize;
    } else if (leapSize > upperLeap) {
        return leapSize - upperLeap;
    }
    return 0;
};


// Assumes that states have absoluteNote as a property
VoiceLineGenerator.prototype.getlargeLeapReverseDirectionPenaltyCount = function(prevPrevAbsNote, prevAbsNote, curAbsNote) {


    var step = prevAbsNote - prevPrevAbsNote;
    var afterStep = curAbsNote - prevAbsNote;

    // Always make the step positive
    if (step < 0) {
        step = -step;
        afterStep = -afterStep;
    }

    var count = 0;

    // Fourths and fifths give penalty when followed by a third or greater in the same direction
    //
    // Sixths give penalty when followed by a second or unison in the same direction
    //
    // The reverse direction is penalized when larger than a third

    if (step < 5) {
        // A small leap or just a step
    } else if (step < 8) {
        // A medium leap
        if (afterStep > 4) {
            // A third or greater after
            count += (afterStep - 4);
        }
        if (afterStep < -4) {
            // Reversing direction to much
            count += (-afterStep - 4);
        }
    } else {
        // A large leap
        if (afterStep > -1) {
            // Not reversing direction
            count += (afterStep + 1);
        }
        if (afterStep < -4) {
            // Reversing direction to much
            count += (-afterStep - 4);
        }
    }
    return count;
};


VoiceLineGenerator.prototype.isParallelWithMod = function(prev1, cur1, prev2, cur2, mod) {
    if (prev1 == cur1 || prev2 == cur2) {
        // If any of the voices holds, it can not be parallel octaves
        return false;
    }
    var prevDiff = prev1 - prev2;
    var prevAbsDiff = Math.abs(prevDiff);
    if ((prevAbsDiff % 12) == mod) {
        // Previous was octave or unison
        var curDiff = cur1 - cur2;
        var curAbsDiff = Math.abs(curDiff);
        if ((curAbsDiff % 12) == mod) {
            // Current is also octave or unison
            return true;
        }
    }
};


VoiceLineGenerator.prototype.isParallelOctavesOrUnisons = function(prev1, cur1, prev2, cur2) {
    return this.isParallelWithMod(prev1, cur1, prev2, cur2, 0);
};

VoiceLineGenerator.prototype.isParallelPerfectFifths = function(prev1, cur1, prev2, cur2) {
    return this.isParallelWithMod(prev1, cur1, prev2, cur2, 7);
};


VoiceLineGenerator.prototype.searchRecursive = function(node) {
    var index = node.searchDepth + node.resultIndex;

    if (node.searchDepth >= this.maxSearchDepth || index >= this.harmony.getCount()) {
        // Reached end of harmony or maximum search depth
        this.bestSolutionCost = Math.min(node.totalCost, this.bestSolutionCost);
        return node;
    }

    var minCost = 99999999;
    var bestNode = null; // Best goal node
    var bestState = null; // Best state at current index

    var states = this.getStates(node);
//        logit("__Current search depth: " + node.searchDepth + "<br />");
    //    logit("____Domain: " + domain + "<br />");
    for (var i=0; i<states.length; i++) {

        this.searchSteps++;
        if (this.searchSteps > this.maxSearchSteps) {
            return bestNode;
        }

        var newState = states[i];
        var newNode = new VoiceLineSearchNode(newState, node.searchDepth + 1, node.resultIndex);
        var stepCost = this.getStepCost(newNode);

        var totalCost = stepCost + node.totalCost;
//        logit("__ " + i + " step cost: " + stepCost + " total cost: " + totalCost + " best cost: " + this.bestSolutionCost);
        if (totalCost < this.bestSolutionCost) {
            newNode.totalCost = totalCost;
            this.resultStates[index] = newState; // Writing to result so the next search level has access to previous states
            var result = this.searchRecursive(newNode);
            if (result && result.totalCost < minCost) {
                minCost = result.totalCost;
                bestNode = result;
                bestState = newState;
            }
        }
    }
    //    logit("____Best state at search depth " + node.searchDepth + ": " + bestState + "<br />");
    // Write the result state
    this.resultStates[index] = bestState;

    return bestNode;
};



VoiceLineGenerator.prototype.search = function() {




    var result = [];

    this.bestSolutionCost = 99999999;
    this.resultStates = [];

    voiceLeadingPrepareTimer.start();

    this.prepareBeforeSearch();

    voiceLeadingPrepareTimer.pause();



    var harmonyElements = this.harmony.getConstantHarmonyElements();

//    logit("Entering voice line search...");

    var totalSearchSteps = 0;
    var sortOfTotalCost = 0;
    var individualSearchSteps = [];
    for (var i=0; i<harmonyElements.length; i++) {
//        logit("Searching step " + i + "<br />");
        this.bestSolutionCost = 99999999;
        this.searchSteps = 0;
        var emptyState = this.createInitialState();
        var node = new VoiceLineSearchNode(emptyState, 0, i);
        var solution = this.searchRecursive(node);
        if (solution) {
            var state = this.resultStates[i];
            var vle = this.extractSolution(state, i);

            for (var j=0; j<vle.length; j++) {
                if (j >= result.length) {
                    result[j] = new ConstantVoiceLine();
                }
                result[j].addVoiceLineElement(vle[j]);
            }
            //            logit("_Step " + i + " result scale index: " + state.scaleIndex + "<br />");
        } else {
            this.failReason = "Failed to find solution";
            return null;
        }
        totalSearchSteps += this.searchSteps;
        sortOfTotalCost += this.bestSolutionCost;
        individualSearchSteps.push(this.searchSteps);
    }
//    logit("search steps: " + totalSearchSteps + " individual steps: " + individualSearchSteps.join(",") + " sort of cost: " + sortOfTotalCost + "<br />");
//    logit("Sort of cost: " + sortOfTotalCost);


    return result;
};
