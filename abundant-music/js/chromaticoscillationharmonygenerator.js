
function ChromaticOscillationHarmonyState() {
    this.harmony = null;
    this.stepCost = 0;
    this.mode = 0; // 1 means that it is in another harmony than the base
    this._constructorName = "ChromaticOscillationHarmonyState";
}

ChromaticOscillationHarmonyState.prototype.toString = function() {
    return JSON.stringify(this);
};

ChromaticOscillationHarmonyState.prototype.copy = function() {
    return copyObjectDeep(this);
};

function ChromaticOscillationHarmonyGenerator(options) {
    HarmonyGenerator.call(this, options);
    this.scaleBaseNote = getValueOrDefault(options,
        "scaleBaseNote", 60);
    this.scaleType = getValueOrDefault(options,
        "scaleType", ScaleType.MAJOR);

    this.startScaleBaseChordRootScaleModeTuples = getValueOrDefault(options,
        "startScaleBaseChordRootScaleModeTuples", [[this.scaleBaseNote, 0, 0]]);

    this.endScaleBaseChordRootScaleModeTuples = getValueOrDefault(options,
        "endScaleBaseChordRootScaleModeTuples", [[this.scaleBaseNote, 0, 0]]);

    this._constructorName = "ChromaticOscillationHarmonyGenerator";

}

ChromaticOscillationHarmonyGenerator.prototype = new HarmonyGenerator();



ChromaticOscillationHarmonyGenerator.prototype.addTuple = function(tuple, lik, cost, mode, result, likelihoods, costs) {
    var harmony = new ConstantHarmonyElement();
    harmony.scaleType = this.scaleType;
    harmony.baseNote = tuple[0];
    harmony.chordRoot = tuple[1];
    harmony.scaleMode = tuple[2];
    var state = new ChromaticOscillationHarmonyState();
    state.harmony = harmony;
    state.mode = mode;

    result.push(state);
    likelihoods.push(lik);
    costs.push(cost);
};

ChromaticOscillationHarmonyGenerator.prototype.getStartStates = function(result, likelihoods, costs) {
    for (var i=0; i<this.startScaleBaseChordRootScaleModeTuples.length; i++) {
        var tuple = this.startScaleBaseChordRootScaleModeTuples[i];
        this.addTuple(tuple, 1, 0, 0, result, likelihoods, costs);
    }
    // Adding the goals as well to avoid search failure
    for (var i=0; i<this.endScaleBaseChordRootScaleModeTuples.length; i++) {
        var tuple = this.endScaleBaseChordRootScaleModeTuples[i];
        this.addTuple(tuple, 0.1, 1000, 0, result, likelihoods, costs);
    }
};


ChromaticOscillationHarmonyGenerator.prototype.getStartStateIterator = function() {
    var result = [];
    var likelihoods = [];
    var costs = [];
    this.getStartStates(result, likelihoods, costs);
    return new RandomDfsStateIterator2(result, likelihoods, costs, this.rnd);
};



ChromaticOscillationHarmonyGenerator.prototype.isGoalState = function(state) {

    var harmony = state.harmony;
    for (var i=0; i<this.endScaleBaseChordRootScaleModeTuples.length; i++) {
        var tuple = this.endScaleBaseChordRootScaleModeTuples[i];
        if ((tuple[0] % 12) == (harmony.baseNote % 12) &&
            (tuple[1] % 7) == (harmony.chordRoot % 12) &&
            (tuple[2] % 7) == (harmony.scaleMode % 7)) {
//            logit("Was goal: " + JSON.stringify(harmony) + " " + state.mode);
            return true;
        }
    }
    return false;
};

ChromaticOscillationHarmonyGenerator.prototype.isInvalidState = function(state) {
    return false;
};


ChromaticOscillationHarmonyGenerator.prototype.getSuccessors = function(state, states, likelihoods, costs) {


    switch (state.mode) {
        case 1:
            this.getStartStates(states, likelihoods, costs);
        default:
            break;
    }

    var rootProgressions = [0, 1, 2, 3, 4, 5, 6];
    var rootProgressionLikelihoods = [1, 1, 1, 1, 1, 1, 1];
    var rootProgressionCosts = [0, 0, 0, 0, 0, 0, 0];
    var modeProgressions = [1, 2, 3, 4, 5, 6];
    var modeProgressionLikelihoods = [1, 1, 1, 1, 1, 1];
    var modeProgressionCosts = [0, 0, 0, 0, 0, 0];
    var scaleProgressions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    var scaleProgressionLikelihoods = [0.25, 0.25, 1, 1, 1, 0.1, 1, 1, 1, 0.25, 0.25];
    var scaleProgressionCosts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (var i=0; i<this.endScaleBaseChordRootScaleModeTuples.length; i++) {
        var tuple = this.endScaleBaseChordRootScaleModeTuples[i];
        this.addTuple(tuple, 0.0001, 1000, 0, states, likelihoods, costs);
    }

    var lik = 1;
    var cost = 0;

    function updateLikCost(index, likelihoods, costs) {
        lik *= likelihoods[index % likelihoods.length];
        cost += costs[index % costs.length];
    }

//    for (var i=0; i<rootProgressions.length; i++) {
//        var rp = rootProgressions[i];
    var rp = 0;
    for (var j=0; j<modeProgressions.length; j++) {
        var mp = modeProgressions[j];
        var newState = state.copy();
        var harmony = newState.harmony;
        var oldChordRoot = harmony.chordRoot;
        var oldScaleMode = harmony.scaleMode;
        harmony.chordRoot = positiveMod(harmony.chordRoot + rp, 7);
        harmony.scaleMode = positiveMod(harmony.scaleMode + mp, 7);
        newState.mode = (rp == 0 && mp == 0) ? 0 : 1;
        harmony.note = "mode " + newState.mode + " rp: " + rp + " mp: " + mp;
        states.push(newState);
        lik = 1;
        cost = 0;
        updateLikCost(rp, rootProgressionLikelihoods, rootProgressionCosts);
        updateLikCost(mp, modeProgressionLikelihoods, modeProgressionCosts);
        if (rp == 0 && mp == 0) {
            lik *= 0.001;
            cost += 10;
        } else if (rp != 0 && mp != 0) {
            lik *= 0.001 * (1.0 / 42.0);
            cost += 20;
        }

//            logit(oldChordRoot + " -> " + harmony.chordRoot + " " + oldScaleMode + " -> " + harmony.scaleMode + " " + lik + " " + cost);
        likelihoods.push(lik);
        costs.push(cost);
    }

    for (var j=0; j<scaleProgressions.length; j++) {
        var sp = scaleProgressions[j];
        var newState = state.copy();
        var harmony = newState.harmony;
        var oldChordRoot = harmony.chordRoot;
        var oldBaseNote = harmony.baseNote;
        harmony.chordRoot = positiveMod(harmony.chordRoot + rp, 7);
        harmony.baseNote = ((harmony.baseNote + sp) % 12) + 60;;
        newState.mode = (rp == 0 && sp == 0) ? 0 : 1;
        harmony.note = "mode " + newState.mode + " rp: " + rp + " sp: " + sp;
        states.push(newState);
        lik = 1;
        cost = 0;
        updateLikCost(rp, rootProgressionLikelihoods, rootProgressionCosts);
        updateLikCost(sp, scaleProgressionLikelihoods, scaleProgressionCosts);

        if (rp == 0 && sp == 0) {
            lik *= 0.001;
            cost += 10;
        } else if (rp != 0 && sp != 0) {
            lik *= 0.001 / (7 * 11);
            cost += 20;
        }

//            logit(oldChordRoot + " -> " + harmony.chordRoot + " " + oldScaleMode + " -> " + harmony.scaleMode + " " + lik + " " + cost);
        likelihoods.push(lik);
        costs.push(cost);
    }

//    }
//    for (var i=0; i<likelihoods.length; i++) {
//        if (typeof(likelihoods[i]) == "undefined") {
//            logit("undef like");
//        }
//    }
//    for (var i=0; i<costs.length; i++) {
//        if (typeof(costs[i]) == "undefined") {
//            logit("undef cost");
//        }
//    }
};



ChromaticOscillationHarmonyGenerator.prototype.getSuccessorIterator = function(node) {
    var state = node.state;

    var possibleNextStates = [];
    var possibleNextStateLikelihoods = [];
    var possibleNextStateCosts = [];

    this.getSuccessors(state, possibleNextStates, possibleNextStateLikelihoods, possibleNextStateCosts);

    return new RandomDfsStateIterator2(possibleNextStates, possibleNextStateLikelihoods, possibleNextStateCosts, this.rnd);
};

