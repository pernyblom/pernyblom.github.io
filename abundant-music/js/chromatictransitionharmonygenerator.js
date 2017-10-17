


function ChromaticTransitionHarmonyState() {
    this.harmony = null;
    this.stepCost = 0;
    this._constructorName = "ChromaticTransitionHarmonyState";
}

ChromaticTransitionHarmonyState.prototype.toString = function() {
    return JSON.stringify(this);
};

ChromaticTransitionHarmonyState.prototype.copy = function() {
    return copyObjectDeep(this);
};

function ChromaticTransitionHarmonyGenerator(options) {
    HarmonyGenerator.call(this, options);
    this.scaleBaseNote = getValueOrDefault(options,
        "scaleBaseNote", 60);
    this.scaleType = getValueOrDefault(options,
        "scaleType", ScaleType.MAJOR);

    this.scaleBaseChordRootScaleModeTuples = getValueOrDefault(options,
        "scaleBaseChordRootScaleModeTuples", [[this.scaleBaseNote, 0, 0]]);

    this.endScaleBaseChordRootScaleModeTuples = getValueOrDefault(options,
        "endScaleBaseChordRootScaleModeTuples", [[this.scaleBaseNote, 0, 0]]);

    this.chordRootChangeCost = getValueOrDefault(options, "chordRootChangeCost", 0);
    this.scaleBaseChangeCost = getValueOrDefault(options, "scaleBaseChangeCost", 0);
    this.scaleModeChangeCost = getValueOrDefault(options, "scaleModeChangeCost", 0);

    this.noChangeCost = getValueOrDefault(options, "noChangeCost", 3);
    this.toMuchChangeCost = getValueOrDefault(options, "toMuchChangeCost", 5);

    this._constructorName = "ChromaticTransitionHarmonyGenerator";

}

ChromaticTransitionHarmonyGenerator.prototype = new HarmonyGenerator();



ChromaticTransitionHarmonyGenerator.prototype.addTuple = function(tuple, lik, cost, result, likelihoods, costs) {
    var harmony = new ConstantHarmonyElement();
    harmony.scaleType = this.scaleType;
    harmony.baseNote = tuple[0];
    harmony.chordRoot = tuple[1];
    harmony.scaleMode = tuple[2];
    var state = new ChromaticTransitionHarmonyState();
    state.harmony = harmony;

    result.push(state);
    likelihoods.push(lik);
    costs.push(cost);
}


ChromaticTransitionHarmonyGenerator.prototype.getStartStateIterator = function() {
    var result = [];
    var likelihoods = [];
    var costs = [];


    for (var i=0; i<this.scaleBaseChordRootScaleModeTuples.length; i++) {
        var tuple = this.scaleBaseChordRootScaleModeTuples[i];
        this.addTuple(tuple, 1, 0, result, likelihoods, costs);
    }
    // Adding the goals as well to avoid search failure
    for (var i=0; i<this.endScaleBaseChordRootScaleModeTuples.length; i++) {
        var tuple = this.endScaleBaseChordRootScaleModeTuples[i];
        this.addTuple(tuple, 0.1, 1000, result, likelihoods, costs);
    }
    return new RandomDfsStateIterator2(result, likelihoods, costs, this.rnd);
};



ChromaticTransitionHarmonyGenerator.prototype.isGoalState = function(state) {

    var harmony = state.harmony;
    for (var i=0; i<this.endScaleBaseChordRootScaleModeTuples.length; i++) {
        var tuple = this.endScaleBaseChordRootScaleModeTuples[i];
        if ((tuple[0] % 12) == (harmony.baseNote % 12) &&
            (tuple[1] % 7) == (harmony.chordRoot % 12) &&
            (tuple[2] % 7) == (harmony.scaleMode % 7)) {
            return true;
        }
    }
    return false;
};

ChromaticTransitionHarmonyGenerator.prototype.isInvalidState = function(state) {
    return false;
};


ChromaticTransitionHarmonyGenerator.prototype.getSuccessors = function(state, states, likelihoods, costs) {

    var rootProgressions = [0, 1, 2, 3, 4, 5, 6];
    var rootProgressionLikelihoods = [1, 1, 1, 1, 1, 1, 1];
    var rootProgressionCosts = [0, 0, 0, 0, 0, 0, 0];
    var modeProgressions = [0, 1, 2, 3, 4, 5, 6];
    var modeProgressionLikelihoods = [1, 1, 1, 1, 1, 1, 1];
    var modeProgressionCosts = [0, 0, 0, 0, 0, 0, 0];
    var scaleProgressions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    var scaleProgressionLikelihoods = [1, 0.25, 0.25, 1, 1, 1, 0.1, 1, 1, 1, 0.25, 0.25];
    var scaleProgressionCosts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (var i=0; i<this.endScaleBaseChordRootScaleModeTuples.length; i++) {
        var tuple = this.endScaleBaseChordRootScaleModeTuples[i];
        this.addTuple(tuple, 0.1, 1000, states, likelihoods, costs);
    }
    var lik = 1;
    var cost = 0;

    function updateLikCost(index, likelihoods, costs) {
        lik *= likelihoods[index % likelihoods.length];
        cost += costs[index % costs.length];
    }

    for (var i=0; i<rootProgressions.length; i++) {
        var rp = rootProgressions[i];
        for (var j=0; j<modeProgressions.length; j++) {
            var mp = modeProgressions[j];
            var newState = state.copy();
            var harmony = newState.harmony;
            var oldChordRoot = harmony.chordRoot;
            var oldScaleMode = harmony.scaleMode;
            harmony.chordRoot = positiveMod(harmony.chordRoot + rp, 7);
            harmony.scaleMode = positiveMod(harmony.scaleMode + mp, 7);
            states.push(newState);
            lik = 1;
            cost = 0;
            updateLikCost(rp, rootProgressionLikelihoods, rootProgressionCosts);
            updateLikCost(mp, modeProgressionLikelihoods, modeProgressionCosts);
            if (rp == 0 && mp == 0) {
                lik *= 0.25;
                cost += this.noChangeCost;
            } else if (rp != 0 && mp != 0) {
                lik *= 0.25 * (1.0 / 42.0);
                cost += this.toMuchChangeCost;
            }

            if (rp != 0) {
                cost += this.chordRootChangeCost;
                if (this.chordRootChangeCost > 0.1) {
                    lik *= 0.01;
                }
            }

            if (mp != 0) {
                cost += this.scaleModeChangeCost;
                if (this.scaleModeChangeCost > 0.1) {
                    lik *= 0.01;
                }
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
            states.push(newState);
            lik = 1;
            cost = 0;
            updateLikCost(rp, rootProgressionLikelihoods, rootProgressionCosts);
            updateLikCost(sp, scaleProgressionLikelihoods, scaleProgressionCosts);

            if (rp == 0 && sp == 0) {
                lik *= 0.25;
                cost += this.noChangeCost;
            } else if (rp != 0 && sp != 0) {
                lik *= 0.25 / (7 * 11);
                cost += this.toMuchChangeCost;
            }

            if (rp != 0) {
                cost += this.chordRootChangeCost;
                if (this.chordRootChangeCost > 0.1) {
                    lik *= 0.01;
                }
            }

            if (sp != 0) {
                cost += this.scaleBaseChangeCost;
                if (this.scaleBaseChangeCost > 0.1) {
                    lik *= 0.01;
                }
            }

//            logit(oldChordRoot + " -> " + harmony.chordRoot + " " + oldScaleMode + " -> " + harmony.scaleMode + " " + lik + " " + cost);
            likelihoods.push(lik);
            costs.push(cost);
        }

    }
};



ChromaticTransitionHarmonyGenerator.prototype.getSuccessorIterator = function(node) {
    var state = node.state;

    var possibleNextStates = [];
    var possibleNextStateLikelihoods = [];
    var possibleNextStateCosts = [];

    this.getSuccessors(state, possibleNextStates, possibleNextStateLikelihoods, possibleNextStateCosts);

    return new RandomDfsStateIterator2(possibleNextStates, possibleNextStateLikelihoods, possibleNextStateCosts, this.rnd);
};

