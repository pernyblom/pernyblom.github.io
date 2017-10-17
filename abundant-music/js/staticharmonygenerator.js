

var StaticHarmonyMode = {
    BASE: 0,
    AUXILIARY: 1,
    BASE_NEIGHBOUR: 2,
    AUXILIARY_NEIGHBOUR: 3,
    PASSING_TOWARDS_BASE: 4,
    PASSING_TOWARDS_AUXILIARY: 5,
    ACCENTED_64_BASE: 6
};

function StaticHarmonyState() {
    this.harmony = null;
    this.targetHarmony = null; // Keep track of where to go next or towards (passing target or neighbour)
    this.mode = StaticHarmonyMode.BASE;
    this.auxiliaryRoot = 0;
    this.stepCost = 0;
}

StaticHarmonyState.prototype.toString = function() {
    return "SHS {" +
        "harmony: " + this.harmony +
        "mode: " + this.mode +
        "stepCost: " + this.stepCost +
        (this.targetHarmony ? "targetHarmony: " + this.targetHarmony : "") +
        "}";
};


function StaticHarmonyGenerator(options) {
    HarmonyGenerator.call(this, options);
    this.scaleBaseNote = getValueOrDefault(options,
        "scaleBaseNote", 60);
    this.scaleType = getValueOrDefault(options,
        "scaleType", ScaleType.MAJOR);
    this.baseRoot = getValueOrDefault(options,
        "baseRoot", 0);
    this.baseHarmony = new ConstantHarmonyElement().setChordRoot(this.baseRoot).setBaseNote(this.scaleBaseNote).setScaleType(this.scaleType);

    this.baseToBaseLikelihood = getValueOrDefault(options,
        "baseToBaseLikelihood", 0.01);
    this.baseExpandedLikelihood = getValueOrDefault(options,
        "baseExpandedLikelihood", 1);
    this.baseToNeighbourLikelihood = getValueOrDefault(options,
        "baseToNeighbourLikelihood", 1);
    this.baseToPassingLikelihood = getValueOrDefault(options,
        "baseToPassingLikelihood", 1);
    this.baseToAuxiliaryLikelihood = getValueOrDefault(options,
        "baseToAuxiliaryLikelihood", 1);

    this.auxiliaryToAuxiliaryLikelihood = getValueOrDefault(options,
        "auxiliaryToAuxiliaryLikelihood", 0.01);
    this.auxiliaryExpandedLikelihood = getValueOrDefault(options,
        "auxiliaryExpandedLikelihood", 1);
    this.auxiliaryToBaseLikelihood = getValueOrDefault(options,
        "auxiliaryToBaseLikelihood", 1);
    this.auxiliaryToNeighbourLikelihood = getValueOrDefault(options,
        "auxiliaryToNeighbourLikelihood", 1);
    this.auxiliaryToPassingLikelihood = getValueOrDefault(options,
        "auxiliaryToPassingLikelihood", 1);


    this.baseToBaseCost = getValueOrDefault(options,
        "baseToBaseCost", 0);
    this.baseExpandedCost = getValueOrDefault(options,
        "baseExpandedCost", 0);
    this.baseToNeighbourCost = getValueOrDefault(options,
        "baseToNeighbourCost", 0);
    this.baseToPassingCost = getValueOrDefault(options,
        "baseToPassingCost", 0);
    this.baseToAuxiliaryCost = getValueOrDefault(options,
        "baseToAuxiliaryCost", 0);

    this.auxiliaryToAuxiliaryCost = getValueOrDefault(options,
        "auxiliaryToAuxiliaryCost", 0);
    this.auxiliaryExpandedCost = getValueOrDefault(options,
        "auxiliaryExpandedCost", 0);
    this.auxiliaryToBaseCost = getValueOrDefault(options,
        "auxiliaryToBaseCost", 0);
    this.auxiliaryToNeighbourCost = getValueOrDefault(options,
        "auxiliaryToNeighbourCost", 0);
    this.auxiliaryToPassingCost = getValueOrDefault(options,
        "auxiliaryToPassingCost", 0);


    this.auxiliaryChordRoots = getValueOrDefault(options,
        "auxiliaryChordRoots", [3, 4, 2, 5]);
    this.auxiliaryChordRootLikelihoods = getValueOrDefault(options,
        "auxiliaryChordRootLikelihoods", [1, 1, 0.2, 0.2]);
    this.auxiliaryChordRootCosts = getValueOrDefault(options,
        "auxiliaryChordRootCosts", [0, 0, 0, 0]);

    this.minorPassingChordRoots = getValueOrDefault(options,
        "minorPassingChordRoots", [0, 1, 2, 3, 4, 5, 6]);
    this.minorPassingChordInversions = getValueOrDefault(options,
        "minorPassingChordInversions", [[1], [1], [1], [1], [1], [1], [1]]);
    this.majorPassingChordRoots = getValueOrDefault(options,
        "majorPassingChordRoots", [0, 1, 2, 3, 4, 5, 6]);
    this.majorPassingChordInversions = getValueOrDefault(options,
        "majorPassingChordInversions", [[1], [1], [1], [1], [1], [1], [1]]);

    this.passingIncrements = getValueOrDefault(options,
        "passingIncrements", [-2, -1, 1, 2]);
    this.passingIncrementLikelihoods = getValueOrDefault(options,
        "passingIncrementLikelihoods", [0.25, 1, 1, 0.25]);
    this.passingIncrementCosts = getValueOrDefault(options,
        "passingIncrementCosts", [0, 0, 0, 0]);

    this.majorNeighbourChordRoots = getValueOrDefault(options,
        "majorNeighbourChordRoots", [0, 1, 2, 3, 4, 5, 6]);
    this.majorNeighbourChordInversions = getValueOrDefault(options,
        "majorNeighbourChordInversions", [[1], [1], [1], [1], [1], [1], [1]]);
    this.minorNeighbourChordRoots = getValueOrDefault(options,
        "minorNeighbourChordRoots", [0, 1, 2, 3, 4, 5, 6]);
    this.minorNeighbourChordInversions = getValueOrDefault(options,
        "minorNeighbourChordInversions", [[1], [1], [1], [1], [1], [1], [1]]);
    this.majorNeighbourSusChordRoots = getValueOrDefault(options,
        "majorNeighbourSusChordRoots", [0, 1, 4, 5]);
    this.minorNeighbourSusChordRoots = getValueOrDefault(options,
        "minorNeighbourSusChordRoots", [0, 2, 3]);
    this.majorNeighbourMixtureChordRoots = getValueOrDefault(options,
        "majorNeighbourMixtureChordRoots", [0, 1, 2, 3, 4, 5, 6]);
    this.minorNeighbourMixtureChordRoots = getValueOrDefault(options,
        "minorNeighbourMixtureChordRoots", [0, 1, 2, 3, 4, 5, 6]);

    this.mixture = getValueOrDefault(options, "mixture", true);

    this.canEndWithBase = getValueOrDefault(options,
        "canEndWithBase", true);
    this.canEndWithAuxiliary = getValueOrDefault(options,
        "canEndWithAuxiliary", false);

    this.possibleAuxiliaryEndRoots = getValueOrDefault(options,
        "possibleAuxiliaryEndRoots", [3, 4, 2, 5]);
    this.possibleAuxiliaryEndInversions = getValueOrDefault(options,
        "possibleAuxiliaryEndInversions", [[0], [0], [0], [0]]);
    this.possiblePassingEndRoots = getValueOrDefault(options,
        "possiblePassingEndRoots", [0]);
    this.possiblePassingEndInversions = getValueOrDefault(options,
        "possiblePassingEndInversions", [[0, 1]]);
    this.possibleNeighbourEndRoots = getValueOrDefault(options,
        "possibleNeighbourEndRoots", [0]);
    this.possibleNeighbourEndInversions = getValueOrDefault(options,
        "possibleNeighbourEndInversions", [[0]]);

    this.baseSeventhLikelihoods = getValueOrDefault(options,
        "baseSeventhLikelihoods", [[1, 1, 1, 1, 1, 1, 1]]);
    this.baseSeventhCosts = getValueOrDefault(options,
        "baseSeventhCosts", [[0, 0, 0, 0, 0, 0, 0]]);
    this.baseTriadLikelihoods = getValueOrDefault(options,
        "baseTriadLikelihoods", [[1, 1, 1, 1, 1, 1, 1]]);
    this.baseTriadCosts = getValueOrDefault(options,
        "baseTraidCosts", [[0, 0, 0, 0, 0, 0, 0]]);

    this.auxiliarySeventhLikelihoods = getValueOrDefault(options,
        "auxiliarySeventhLikelihoods", [[1, 1, 1, 1, 1, 1, 1]]);
    this.auxiliaryTriadLikelihoods = getValueOrDefault(options,
        "auxiliaryTriadLikelihoods", [[1, 1, 1, 1, 1, 1, 1]]);
    this.passingSeventhLikelihoods = getValueOrDefault(options,
        "passingSeventhLikelihoods", [[1, 1, 1, 1, 1, 1, 1]]);
    this.passingTriadLikelihoods = getValueOrDefault(options,
        "passingTriadLikelihoods", [[1, 1, 1, 1, 1, 1, 1]]);
    this.neighbourSeventhLikelihoods = getValueOrDefault(options,
        "neighbourSeventhLikelihoods", [[1, 1, 1, 1, 1, 1, 1]]);
    this.neighbourTriadLikelihoods = getValueOrDefault(options,
        "neighbourTriadLikelihoods", [[1, 1, 1, 1, 1, 1, 1]]);

    this.simpleMixtureLikelihood = getValueOrDefault(options,
        "simpleMixtureLikelihood", 1);
    this.sus2Likelihood = getValueOrDefault(options,
        "sus2Likelihood", 1);
    this.sus4Likelihood = getValueOrDefault(options,
        "sus4Likelihood", 1);

    this.neighbourMixtureSeventhLikelihoods = getValueOrDefault(options,
        "neighbourMixtureSeventhLikelihoods", [[0, 0, 0, 0, 0, 0, 0]]);
    this.neighbourMixtureTriadLikelihoods = getValueOrDefault(options,
        "neighbourMixtureTriadLikelihoods", [[1, 1, 1, 1, 1, 1, 1]]);

    this.auxiliarySeventhCosts = getValueOrDefault(options,
        "auxiliarySeventhCosts", [[0, 0, 0, 0, 0, 0, 0]]);
    this.auxiliaryTriadCosts = getValueOrDefault(options,
        "auxiliaryTriadCosts", [[0, 0, 0, 0, 0, 0, 0]]);
    this.passingSeventhCosts = getValueOrDefault(options,
        "passingSeventhCosts", [[0, 0, 0, 0, 0, 0, 0]]);
    this.passingTriadCosts = getValueOrDefault(options,
        "passingTriadCosts", [[0, 0, 0, 0, 0, 0, 0]]);
    this.neighbourSeventhCosts = getValueOrDefault(options,
        "neighbourSeventhCosts", [[0, 0, 0, 0, 0, 0, 0]]);
    this.neighbourTriadCosts = getValueOrDefault(options,
        "neighbourTriadCosts", [[0, 0, 0, 0, 0, 0, 0]]);

    this.neighbourMixtureSeventhCosts = getValueOrDefault(options,
        "neighbourMixtureSeventhCosts", [[0, 0, 0, 0, 0, 0, 0]]);
    this.neighbourMixtureTriadCosts = getValueOrDefault(options,
        "neighbourMixtureTriadCosts", [[0, 0, 0, 0, 0, 0, 0]]);





    this.startWithAccented64Likelihood = getValueOrDefault(options,
        "startWithAccented64Likelihood", 110);
    this.startWithoutAccented64Likelihood = getValueOrDefault(options,
        "startWithoutAccented64Likelihood", 1);
    this.startWithAccented64Cost = getValueOrDefault(options,
        "startWithAccented64Cost", 10);
    this.startWithoutAccented64Cost = getValueOrDefault(options,
        "startWithoutAccented64Cost", 0);

//    this. = getValueOrDefault(options, "", [1, 1]);
}

StaticHarmonyGenerator.prototype = new HarmonyGenerator();




StaticHarmonyGenerator.prototype.getStartStateIterator = function() {

    var states = [];
    var likelihoods = [];
    var costs = [];

    if (this.count > 1 && this.startWithAccented64Likelihood > 0) {
        var accState = new StaticHarmonyState();
        accState.harmony = this.baseHarmony.copy();
        accState.harmony.note = "S";
        accState.harmony.chordRoot = (accState.harmony.chordRoot + 3) % 7;
        accState.harmony.chordInversions = 2;
        accState.harmony.chordType = ChordType.TRIAD;
        accState.mode = StaticHarmonyMode.ACCENTED_64_BASE;
        states.push(accState);
        var likelihood = this.startWithAccented64Likelihood;
        var cost = this.startWithAccented64Cost;
        if (this.startBeatStrengths.length > 0) {
            var firstBeatStrength = this.startBeatStrengths[0];
            var secondBeatStrength = this.startBeatStrengths[1 % this.startBeatStrengths.length];
            if (secondBeatStrength > firstBeatStrength) {
                likelihood *= 0.1;
                cost += 10;
//                logit("Should not start with 64 " + firstBeatStrength + " " + secondBeatStrength);
            } else {
//                logit("Can start with 64 " + firstBeatStrength + " " + secondBeatStrength);
            }
        }
        likelihoods.push(likelihood);
        costs.push(cost);
    }
    var state = new StaticHarmonyState();
    state.harmony = this.baseHarmony.copy();
    state.harmony.note = "S";
    state.mode = StaticHarmonyMode.BASE;

    this.getChordsStuff(0, state,
        this.startWithoutAccented64Likelihood,
        this.startWithoutAccented64Cost,
        this.baseSeventhLikelihoods, this.baseTriadLikelihoods,
        this.baseSeventhCosts, this.baseTriadCosts,
        states, likelihoods, costs);

    //    logit("Returning start state: " + result + "<br />");
    return new RandomDfsStateIterator2(states, likelihoods, costs, this.rnd);
};


StaticHarmonyGenerator.prototype.isGoalState = function(state) {
    //    logit("Checking if " + state + " is goal state: ");

    var result = true;
    switch (state.mode) {
        case StaticHarmonyMode.BASE:
            result = this.canEndWithBase;
            break;
        case StaticHarmonyMode.AUXILIARY:
            if (this.canEndWithAuxiliary) {
                if (this.possibleAuxiliaryEndRoots.length > 0) {
                    var rootPitchClass =
                        state.harmony.getAbsoluteNoteFromScaleIndex(state.harmony.getChordRootScaleIndex()) % 12;
                    for (var i=0; i<this.possibleAuxiliaryEndRoots.length; i++) {
                        var pitchClass = state.harmony.getAbsoluteNoteFromScaleIndex(this.possibleAuxiliaryEndRoots[i]) % 12;
                        if (pitchClass == rootPitchClass) {
                            result = true;
                            break;
                        }
                    }
                    result = false;
                }
                result = true;
            } else {
                result = false;
            }
            break;
        default:
            result = false;
            break;
    }
    //    if (result) {
    //        logit("__ found goal state " + state + "<br />");
    //    }
    return result;
};

StaticHarmonyGenerator.prototype.isInvalidState = function(state) {
    return false;
};

StaticHarmonyGenerator.prototype.getBaseState = function() {
    var state = new StaticHarmonyState();
    state.harmony = this.baseHarmony.copy();
    state.harmony.note = "S";
    state.mode = StaticHarmonyMode.BASE;
    return state;
};

StaticHarmonyGenerator.prototype.getAuxiliaryHarmony = function(root) {
    var harmony = this.baseHarmony.copy();
    harmony.chordRoot = root;
    harmony.note = "S, A";
    return harmony;
};

StaticHarmonyGenerator.prototype.getAuxiliaryState = function(root) {
    var state = new StaticHarmonyState();
    state.harmony = this.getAuxiliaryHarmony(root);
    state.mode = StaticHarmonyMode.AUXILIARY;
    return state;
};

StaticHarmonyGenerator.prototype.getPassingTowardsTargetStatesAndLikelihoods = function(node, nextStates, nextLikelihoods, nextCosts) {

    var currentHarmony = node.state.harmony;
    var targetHarmony = node.state.targetHarmony;

    var currentBass = currentHarmony.getBassScaleIndex();
    var targetBass = targetHarmony.getBassScaleIndex();

    var towardsAux = node.state.mode == StaticHarmonyMode.PASSING_TOWARDS_AUXILIARY;
    var passingIncrements = this.passingIncrements;
    var passingIncrementLikelihoods = this.passingIncrementLikelihoods;
    var passingIncrementCosts = this.passingIncrementCosts;

    var likelihoods = [];
    var costs = [];
    var harmonies = [];
    var modes = [];

    var increments = passingIncrements;
    var absIncrements = [];
    var absLikelihoods = [];
    var absCosts = [];
    var diff = targetBass - currentBass;
    for (var i=0; i<increments.length; i++) {
        var inc = increments[i];
        var l = passingIncrementLikelihoods[i % passingIncrementLikelihoods.length];
        var c = passingIncrementCosts[i % passingIncrementCosts.length];
        if ((diff < 0 && inc < 0) || (diff > 0 && inc > 0)) {
            absIncrements.push(Math.abs(inc));
            absLikelihoods.push(l);
            absCosts.push(c);
        }
    }
    var absDiff = Math.abs(diff);

    var canMoveToTarget = false;
    var moveToTargetLikelihood = 0;
    var moveToTargetCost = 0;
    for (var k=0; k<absIncrements.length; k++) {
        if (absIncrements[k] == absDiff) {
            canMoveToTarget = true;
            moveToTargetLikelihood = Math.max(moveToTargetLikelihood, absLikelihoods[k]);
            moveToTargetCost = Math.max(moveToTargetCost, absCosts[k]);
        }
    }

    if (canMoveToTarget) {
        // Just add the target harmony
        var theTargetHarmony = targetHarmony.copy();
        harmonies.push(theTargetHarmony);
        theTargetHarmony.note = "S" + (towardsAux ? ", A" : "");
        modes.push(towardsAux ? StaticHarmonyMode.AUXILIARY : StaticHarmonyMode.BASE);
        likelihoods.push(moveToTargetLikelihood);
        costs.push(moveToTargetCost);
    }

    var isMinor = false;
    var passingChordRoots = isMinor ? this.majorPassingChordRoots : this.minorPassingChordRoots;
    var passingChordInversions = isMinor ? this.majorPassingChordInversions : this.minorPassingChordInversions;


    // Continue passing motion for valid increments
    for (var k=0; k<absIncrements.length; k++) {
        var absIncrement = absIncrements[k];
        if (absIncrement < absDiff) {
            var incrementLikelihood = absLikelihoods[k];
            var incrementCost = absCosts[k];
            var passingChords = this.getBassPassingChords(currentHarmony.copy(), targetHarmony, absIncrement,
                passingChordRoots, passingChordInversions);
//            logit("Getting " + passingChords.length + " passing chords from " + currentHarmony.toRomanString() + " to " + targetHarmony.toRomanString());
            for (var j=0; j<passingChords.length; j++) {
                var pc = passingChords[j];
                harmonies.push(pc);
                pc.note = "S, " + (towardsAux ? "PA" : "PB");
                likelihoods.push(incrementLikelihood);
                costs.push(incrementCost);
                modes.push(towardsAux ? StaticHarmonyMode.PASSING_TOWARDS_AUXILIARY : StaticHarmonyMode.PASSING_TOWARDS_BASE);
            }
        }
    }

    var depth = node.depth;

//    index, state, likelihood, seventhLikelihoodArr, triadLikelihoodArr,
//        resultStates, resultLikelihoods

    for (var i=0; i<harmonies.length; i++) {
        var state = new StaticHarmonyState();
        state.harmony = harmonies[i];
        state.targetHarmony = targetHarmony; // Not used if mode is AUXILIARY
        state.mode = modes[i];

        this.getChordsStuff(depth, state, likelihoods[i], costs[i],
            this.passingSeventhLikelihoods, this.passingTriadLikelihoods,
            this.passingSeventhCosts, this.passingTriadCosts,
            nextStates, nextLikelihoods, nextCosts);
    }

};


StaticHarmonyGenerator.prototype.getBaseStatesAndLikelihoods = function(node, nextStates, nextLikelihoods, nextCosts) {

    var currentHarmony = node.state.harmony;

    var isMinor = this.scaleType == ScaleType.MAJOR ? false : true;

    if (this.baseToBaseLikelihood > 0) {
        var baseState = this.getBaseState();
        nextStates.push(baseState);
        baseState.harmony.note = "S";
        nextLikelihoods.push(this.baseToBaseLikelihood);
        nextCosts.push(this.baseToBaseCost);
    }
    if (this.baseExpandedLikelihood > 0 && currentHarmony.chordInversions == 0) {
        var baseState = this.getBaseState();
        baseState.harmony.chordInversions = 1;
        nextStates.push(baseState);
        baseState.harmony.note = "S, BE";
        nextLikelihoods.push(this.baseExpandedLikelihood);
        nextCosts.push(this.baseExpandedCost);
    }

    var depth = node.depth;
    if (this.baseToAuxiliaryLikelihood > 0) {

        var auxLikelihoods = [];
        var auxCosts = [];
        var auxStates = [];
        for (var i=0; i<this.auxiliaryChordRoots.length; i++) {
            var auxRoot = this.auxiliaryChordRoots[i];
            var auxLikelihood = this.auxiliaryChordRootLikelihoods[i % this.auxiliaryChordRootLikelihoods.length];
            var auxCost = this.auxiliaryChordRootCosts[i % this.auxiliaryChordRootCosts.length];
            var auxState = this.getAuxiliaryState(auxRoot);

            this.getChordsStuff(depth, auxState, auxLikelihood, auxCost,
                this.auxiliarySeventhLikelihoods, this.auxiliaryTriadLikelihoods,
                this.auxiliarySeventhCosts, this.auxiliaryTriadCosts,
                auxStates, auxLikelihoods, auxCosts);
        }
        if (auxLikelihoods.length > 0) {
            for (var i=0; i<auxLikelihoods.length; i++) {
                nextStates.push(auxStates[i]);
                auxStates[i].harmony.note = "S, A";
                nextLikelihoods.push(this.baseToAuxiliaryLikelihood * auxLikelihoods[i]);
                nextCosts.push(this.baseToAuxiliaryCost + auxCosts[i]);
            }
        }
    }
    if (this.baseToNeighbourLikelihood > 0 && currentHarmony.chordInversions == 0) {
        var likelihoods = [];
        var costs = [];
        var harmonies = [];

        //        var baseChordRoot = this.baseHarmony.chordRoot;

        var likelihood = this.baseToNeighbourLikelihood;

        var neighbourChordRoots = isMinor ? this.minorNeighbourChordRoots : this.majorNeighbourChordRoots;
        var neighbourChordInversions = isMinor ? this.minorNeighbourChordInversions : this.majorNeighbourChordInversions;
        var neighbourSusChordRoots = isMinor ? this.minorNeighbourSusChordRoots : this.majorNeighbourSusChordRoots;
        var neighbourMixtureChordRoots = isMinor ? this.minorNeighbourMixtureChordRoots : this.majorNeighbourMixtureChordRoots;

        if (!this.mixture) {
            neighbourMixtureChordRoots = [];
        }

        var neighbourChords = this.getBassNeighbourChords(this.baseHarmony, neighbourChordRoots, neighbourChordInversions, neighbourSusChordRoots, neighbourMixtureChordRoots);

        for (var i=0; i<neighbourChords.length; i++) {
            harmonies.push(neighbourChords[i]);
            likelihoods.push(1);
            costs.push(0);
        }

        for (var i=0; i<harmonies.length; i++) {
            var neighbourSeventhLikelihoods = this.neighbourSeventhLikelihoods;
            var neighbourTriadLikelihoods = this.neighbourTriadLikelihoods;
            var neighbourSeventhCosts = this.neighbourSeventhCosts;
            var neighbourTriadCosts = this.neighbourTriadCosts;

            var state = new StaticHarmonyState();
            state.harmony = harmonies[i];
            state.harmony.note = "S, BN";


            if (this.baseHarmony.scaleType != state.harmony.scaleType) {
//                logit(" Adding neighrour mixture!!");
                state.harmony.note += "X";
                likelihood *= this.simpleMixtureLikelihood;
//                logit(likelihood);
                neighbourSeventhLikelihoods = this.neighbourMixtureSeventhLikelihoods;
                neighbourTriadLikelihoods = this.neighbourMixtureTriadLikelihoods;
                neighbourSeventhCosts = this.neighbourMixtureSeventhCosts;
                neighbourTriadCosts = this.neighbourMixtureTriadCosts;
            }

            state.mode = StaticHarmonyMode.BASE_NEIGHBOUR;
            this.getChordsStuff(depth, state, likelihood, this.baseToNeighbourCost,
                neighbourSeventhLikelihoods, neighbourTriadLikelihoods,
                neighbourSeventhCosts, neighbourTriadCosts,
                nextStates, nextLikelihoods, nextCosts);
        }
    }
    if (this.baseToPassingLikelihood > 0) {

        // For generate all passing chords from all possible auxiliary chords
        var likelihoods = [];
        var costs = [];
        var harmonies = [];
        var targetHarmonies = [];

        var scale = node.state.harmony.getScale();
        for (var i=0; i<this.auxiliaryChordRoots.length; i++) {
            var auxRoot = this.auxiliaryChordRoots[i];
            var auxLikelihood = this.auxiliaryChordRootLikelihoods[i % this.auxiliaryChordRootLikelihoods.length];
            var auxCost = this.auxiliaryChordRootCosts[i % this.auxiliaryChordRootCosts.length];
            var increments = this.passingIncrements;
            for (var k=0; k<increments.length; k++) {
                var incrementLikelihood = this.passingIncrementLikelihoods[k % this.passingIncrementLikelihoods.length];
                var incrementCost = this.passingIncrementCosts[k % this.passingIncrementCosts.length];
                var increment = increments[k];
                var auxRootUp = auxRoot;
                if (this.baseRoot > auxRoot) {
                    auxRootUp += 7;
                }
                var auxRootDown = auxRootUp - scale.length;
                var auxHarmony = this.getAuxiliaryHarmony(increment > 0 ? auxRootUp : auxRootDown);

//                logit("Passing from " + this.baseRoot + " to " + auxHarmony.chordRoot);
                var passingChords = this.getBassPassingChords(this.baseHarmony.copy(), auxHarmony, Math.abs(increment),
                    this.majorPassingChordRoots, this.majorPassingChordInversions);
//                logit("Found " + passingChords.length + " passing chords " + increment);
                for (var j=0; j<passingChords.length; j++) {
                    var pc = passingChords[j];
//                    logit("  " + pc.toRomanString() + " " + (incrementLikelihood * auxLikelihood));
                    harmonies.push(pc);
                    targetHarmonies.push(auxHarmony.copy());
                    likelihoods.push(auxLikelihood * incrementLikelihood);
                    costs.push(auxCost + incrementCost);
                }
            }
        }

        var sizeBefore = nextStates.length;

        for (var i=0; i<harmonies.length; i++) {
            var state = new StaticHarmonyState();
            state.harmony = harmonies[i];
            state.harmony.note = "S, PA";
            state.targetHarmony = targetHarmonies[i];
            state.mode = StaticHarmonyMode.PASSING_TOWARDS_AUXILIARY;

//            logit("Testing " + state.harmony.toRomanString() + " " + (this.baseToPassingLikelihood * likelihoods[i]));

            this.getChordsStuff(depth, state, this.baseToPassingLikelihood * likelihoods[i], this.baseToPassingCost + costs[i],
                this.passingSeventhLikelihoods, this.passingTriadLikelihoods,
                this.passingSeventhCosts, this.passingTriadCosts,
                nextStates, nextLikelihoods, nextCosts);
        }

//        logit("  Added " + (nextStates.length - sizeBefore) + " states");

    }


};



StaticHarmonyGenerator.prototype.getAuxiliaryStatesAndLikelihoods = function(node, nextStates, nextLikelihoods, nextCosts) {
    var currentHarmony = node.state.harmony;

    if (this.auxiliaryToAuxiliaryLikelihood > 0) {
        var nextState = new StaticHarmonyState();
        nextState.harmony = node.state.harmony.copy();
        nextState.harmony.note = "S, A";
        nextState.mode = StaticHarmonyMode.AUXILIARY;
        nextStates.push(nextState);
        nextLikelihoods.push(this.auxiliaryToAuxiliaryLikelihood);
        nextCosts.push(this.auxiliaryToAuxiliaryCost);
    }
    if (this.auxiliaryExpandedLikelihood > 0 && currentHarmony.chordInversions == 0) {
        var nextState = new StaticHarmonyState();
        nextState.harmony = currentHarmony.copy();
        nextState.harmony.note = "S, AE";
        nextState.harmony.chordInversions = 1;
        nextState.mode = StaticHarmonyMode.AUXILIARY;
        nextStates.push(nextState);
        nextLikelihoods.push(this.auxiliaryExpandedLikelihood);
        nextCosts.push(this.auxiliaryExpandedCost);
    }
    if (this.auxiliaryToBaseLikelihood > 0) {
        var nextState = new StaticHarmonyState();
        nextState.harmony = this.baseHarmony.copy();
        nextState.harmony.note = "S";
        nextState.mode = StaticHarmonyMode.BASE;
        nextStates.push(nextState);
        nextLikelihoods.push(this.auxiliaryToBaseLikelihood);
        nextCosts.push(this.auxiliaryToBaseCost);
    }
    if (this.auxiliaryToNeighbourLikelihood > 0 && currentHarmony.chordInversions == 0) {

        var isMinor = currentHarmony.scaleType == ScaleType.NATURAL_MINOR;

        var neighbourChordRoots = isMinor ? this.minorNeighbourChordRoots : this.majorNeighbourChordRoots;
        var neighbourChordInversions = isMinor ? this.minorNeighbourChordInversions : this.majorNeighbourChordInversions;
        var neighbourSusChordRoots = isMinor ? this.minorNeighbourSusChordRoots : this.majorNeighbourSusChordRoots;
        var neighbourMixtureChordRoots = isMinor ? this.minorNeighbourMixtureChordRoots : this.majorNeighbourMixtureChordRoots;

        if (!this.mixture) {
            neighbourMixtureChordRoots = [];
        }

        var neighbours = this.getBassNeighbourChords(node.state.harmony.copy(), neighbourChordRoots, neighbourChordInversions, neighbourSusChordRoots, neighbourMixtureChordRoots);
        var likelihoods = [];
        var costs = [];
        for (var i=0; i<neighbours.length; i++) {
            likelihoods.push(1);
            costs.push(0);
        }

        for (var i=0; i<neighbours.length; i++) {
            var state = new StaticHarmonyState();
            state.harmony = neighbours[i];
            state.harmony.note = "S, AN";
            var likelihood = this.auxiliaryToNeighbourLikelihood * likelihoods[i];
            if (node.state.harmony.scaleType != state.harmony.scaleType) {
//                logit(" Adding neighrour mixture!!");
                state.harmony.note += "X";
                likelihood *= this.simpleMixtureLikelihood;
            }
            state.mode = StaticHarmonyMode.AUXILIARY_NEIGHBOUR;
            state.auxiliaryRoot = node.state.harmony.chordRoot;
            nextStates.push(state);
            nextLikelihoods.push(likelihood);
            nextCosts.push(this.auxiliaryToNeighbourCost + costs[i]);
        }
    }
};


StaticHarmonyGenerator.prototype.getSuccessorIterator = function(node) {
    var state = node.state;

    var possibleNextStates = [];
    var possibleNextStateLikelihoods = [];
    var possibleNextStateCosts = [];

    var chordsLeft = this.count - node.depth;

    switch (state.mode) {
        case StaticHarmonyMode.ACCENTED_64_BASE:
            var state = new StaticHarmonyState();
            state.harmony = this.baseHarmony.copy();
            state.mode = StaticHarmonyMode.BASE;
            possibleNextStates.push(state);
            possibleNextStateLikelihoods.push(1);
            possibleNextStateCosts.push(0);
            break;
        case StaticHarmonyMode.BASE:
            this.getBaseStatesAndLikelihoods(node, possibleNextStates, possibleNextStateLikelihoods, possibleNextStateCosts);
            break;
        case StaticHarmonyMode.AUXILIARY:
            this.getAuxiliaryStatesAndLikelihoods(node, possibleNextStates, possibleNextStateLikelihoods, possibleNextStateCosts);
            break;
        case StaticHarmonyMode.BASE_NEIGHBOUR:
            // Always goes back to base
            possibleNextStates.push(this.getBaseState());
            possibleNextStateLikelihoods.push(1.0);
            possibleNextStateCosts.push(0);
            break;
        case StaticHarmonyMode.AUXILIARY_NEIGHBOUR:
            // Always goes back to previous auxiliary
            possibleNextStates.push(this.getAuxiliaryState(node.state.auxiliaryRoot));
            possibleNextStateLikelihoods.push(1.0);
            possibleNextStateCosts.push(0);
            break;
        case StaticHarmonyMode.PASSING_TOWARDS_AUXILIARY:
            this.getPassingTowardsTargetStatesAndLikelihoods(node, possibleNextStates, possibleNextStateLikelihoods, possibleNextStateCosts);
            break;
        case StaticHarmonyMode.PASSING_TOWARDS_BASE:
            this.getPassingTowardsTargetStatesAndLikelihoods(node, possibleNextStates, possibleNextStateLikelihoods, possibleNextStateCosts);
            break;
    }
    //    logit("Iterator for " + node + " states:" + possibleNextStates + " likelihoods: " + possibleNextStateLikelihoods + "<br />");

    this.calculateBeatStrengthRepetitionCosts(node, possibleNextStates, possibleNextStateLikelihoods, possibleNextStateCosts);
    this.calculateSeventhToTriadCosts(node, possibleNextStates, possibleNextStateLikelihoods, possibleNextStateCosts);
    this.calculateSusCosts(node, possibleNextStates, possibleNextStateLikelihoods, possibleNextStateCosts, this.sus2Likelihood, this.sus4Likelihood);


    return new RandomDfsStateIterator2(possibleNextStates, possibleNextStateLikelihoods, possibleNextStateCosts, this.rnd);
};

