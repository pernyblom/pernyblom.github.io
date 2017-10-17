function DfsSearchNode(state, previousNode, depth) {
    this.state = state;
    this.previous = previousNode;
    this.next = null;
    this.depth = depth;
    this.totalCost = 0;
}

DfsSearchNode.prototype.toString = function() {
    return "DFSSN {" +
    "state: " + this.state +
    "depth: " + this.depth +
    "totalCost: " + this.totalCost +
    "}";
};


function RandomDfsStateIterator(elements, likelihoods, rnd, stepCostSetter) {
    this.elements = elements;
    this.likelihoods = likelihoods;
    this.rnd = rnd;
    if (stepCostSetter) {
        this.stepCosts = stepCostSetter(this.likelihoods);
    } else {
        this.stepCosts = this.getStepCosts(likelihoods);
    }
//    logit("___ state step costs: " + this.stepCosts + "<br />");
}

RandomDfsStateIterator.prototype.getStepCosts = function(likelihoods) {
    var stepCosts = [];
    for (var i=0; i<likelihoods.length; i++) {
        var l = likelihoods[i];
        stepCosts[i] = l > 0.0 ? -Math.log(l) : 99999999999;
    }
    return stepCosts;
};

RandomDfsStateIterator.prototype.hasNext = function() {
    return this.elements.length > 0;
};


RandomDfsStateIterator.prototype.next = function() {
    var result = null;
    // Sample next element with the probability distribution
    if (this.elements.length > 0) {
        var probDist = getProbabilityDistribution(this.likelihoods);
        var index = sampleIndexIntegerDistribution(this.rnd, probDist);
        result = this.elements[index];
        result.stepCost = this.stepCosts[index];
        this.elements.splice(index, 1);
        this.likelihoods.splice(index, 1);
        this.stepCosts.splice(index, 1);
    } else if (this.elements.length == 1) {
        result = this.elements[0];
        result.stepCost = this.stepCosts[0];
        this.elements.length = 0;
    } else {
        logit("Can not get next from iterator. empty");
    }
    if (result.stepCost < 0) {
        logit(" stepcost less than 0...");
    }
    return result;
};


function RandomDfsStateIterator2(elements, likelihoods, costs, rnd) {
    this.elements = elements;
    this.likelihoods = likelihoods;
    this.rnd = rnd;
    this.stepCosts = costs;
}


RandomDfsStateIterator2.prototype.hasNext = function() {
    return this.elements.length > 0;
};


RandomDfsStateIterator2.prototype.next = function() {
    // Sample next element with the probability distribution
    if (this.elements.length > 0) {
        var probDist = getProbabilityDistribution(this.likelihoods);
        var index = sampleIndexIntegerDistribution(this.rnd, probDist);
        result = this.elements[index];
        result.stepCost = this.stepCosts[index];
        this.elements.splice(index, 1);
        this.likelihoods.splice(index, 1);
        this.stepCosts.splice(index, 1);
        return result;
    } else if (this.elements.length == 1) {
        var result = this.elements[0];
        result.stepCost = this.stepCosts[0];
        this.elements.length = 0;
        return result;
    } else {
        logit("Can not get next from iterator. empty");
        return null;
    }
};


function SimpleDfsStateIterator(elements) {
    this.elements = elements;
}

SimpleDfsStateIterator.prototype.hasNext = function() {
    return this.elements.length > 0;
};


SimpleDfsStateIterator.prototype.next = function() {
    if (this.elements.length > 0) {
        var result = this.shift();
        return result;
    } else {
        logit("Can not get next from iterator. empty");
        return null;
    }
};



function DfsSolver(options) {
    this.maxMLSolutions = getValueOrDefault(options, "maxMLSolutions", 10);
    this.maxSearchSteps = getValueOrDefault(options, "maxSearchSteps", 1000);
    this.steps = 0;
    this.mlSolutions = 0;
    this._constructorName = "DfsSolver";
}

DfsSolver.prototype.getGoalLikelihood = function(node) {
    return 1;
};


DfsSolver.prototype.extractStateResultData = function(state) {
    logit("DfsSolver need to implement extractStateResultData()");
};

DfsSolver.prototype.getStartStateIterator = function() {
    logit("DfsSolver need to implement getStartStateIterator()<br />");
};

DfsSolver.prototype.isGoalState = function(state) {
    logit("DfsSolver need to implement isGoalState()<br />");
    return true;
};
DfsSolver.prototype.isInvalidState = function(state) {
    logit("DfsSolver need to implement isInvalidState()<br />");
    return false;
};

DfsSolver.prototype.getSuccessorIterator = function(node) {
    logit("DfsSolver need to implement getSuccessorIterator()<br />");
};

DfsSolver.prototype.isGoalNode = function(node) {
    logit("DfsSolver need to implement isGoalNode()<br />");
};

DfsSolver.prototype.isMaxDepth = function(node) {
    return false;
};


DfsSolver.prototype.searchRecursive = function(node) {
    // Do a depth-first search

    if (this.isGoalNode(node)) {
        return node;
    } else if (this.isMaxDepth(node)) {
        return null;
    }

    if (this.isInvalidState(node.state)) {
        return null;
    }

    var iterator = this.getSuccessorIterator(node);
    while (iterator.hasNext()) {
        this.steps++;
        if (this.steps > this.maxSearchSteps) {
            this.failReason = "Unable to find a solution within " + this.maxSearchSteps + " search steps";
            return null;
        //        } else {
        //            logit("steps: " + this.steps + " ");
        }
        var next = iterator.next();
        var newNode = new DfsSearchNode(next, node, node.depth + 1);
        if (this.searchRecursive(newNode)) {
            node.next = newNode;
            return node;
        }
    }
    this.failReason = "Unable to find a solution";
    return null;
};



DfsSolver.prototype.search = function() {
    this.prepareBeforeSearch();
    
    if (this.seed && this.setSeed) {
        this.setSeed(this.seed);
    }
    this.steps = 0;
    var iterator = this.getStartStateIterator();
    while (iterator.hasNext()) {
        var startState = iterator.next();
        var node = new DfsSearchNode(startState, null, 0);

        var solution = this.searchRecursive(node);
        if (solution) {
            // Extract solution
            var result = [];
            var current = solution;
            do {
                result.push(this.extractStateResultData(current.state));
                current = current.next;
            } while (current);
            return result;
        }
    }
    return null;
};




DfsSolver.prototype.searchMLRecursive = function(node) {
    if (this.isGoalNode(node)) {
        if (node.totalCost < 0.999999 * this.bestSolutionCost) {
            this.bestSolutionCost = Math.min(node.totalCost, this.bestSolutionCost);
            this.mlSolutions++;
//                        logit(this._constructorName + " Found solution. solution count: " + this.mlSolutions + " this cost: " + node.totalCost + " best cost: " + this.bestSolutionCost + " steps: " + this.steps);
            //            var result = this.extractSolutionFromMLGoalNode(node);
            //            logit("___ The solution: " + result + "<br />");
            
            return node;
        } else {
            return null;
        }
    } else if (this.isMaxDepth(node)) {
        return null;
    }

    if (this.isInvalidState(node.state)) {
        return null;
    }

    var minCost = Number.MAX_VALUE;
    var bestNode = null; // Best goal node

    var iterator = this.getSuccessorIterator(node);
    while (iterator.hasNext()) {
        this.steps++;

        if (this.steps > this.maxSearchSteps) {
            if (this.mlSolutions == 0) {
                this.failReason = "Unable to find a solution within " + this.maxSearchSteps + " search steps";
            }
            return bestNode;
        }

        var newState = iterator.next();


        var stepCost = newState.stepCost;
        var totalCost = stepCost + node.totalCost;

//        logit("Checking state " + newState + "<br />");

        //        logit("Total cost " + totalCost + " on level " + node.depth + " stepCost: " + stepCost + " <br />");
        if (totalCost < this.bestSolutionCost) {
            var newNode = new DfsSearchNode(newState, node, node.depth + 1);
            newNode.totalCost = totalCost;
            var result = this.searchMLRecursive(newNode);
            if (result) {
                node.next = newNode;
                bestNode = result;
//                logit("__Found best node " + bestNode + " on depth " + node.depth + "<br />");
            }
        } else {
        //            logit("Pruning because of cost " + totalCost + " " + this.bestSolutionCost + " steps: " + this.steps + "<br />");
        }
        if (this.mlSolutions >= this.maxMLSolutions) {
            break;
        }
    }
//    logit("Returning best node " + bestNode + " on depth " + node.depth + "<br />");
    return bestNode;
};



DfsSolver.prototype.prepareBeforeSearch = function() {
};

DfsSolver.prototype.searchDone = function() {
};


DfsSolver.prototype.searchML = function() {

    this.prepareBeforeSearch();

    this.bestSolutionCost = Number.MAX_VALUE;

    if (this.seed && this.setSeed) {
        this.setSeed(this.seed);
    }
    var bestSolution = null;

    this.steps = 0;
    var iterator = this.getStartStateIterator();
    while (iterator.hasNext()) {
        var startState = iterator.next();

        var node = new DfsSearchNode(startState, null, 0);
        node.totalCost = startState.stepCost;

//        investigateObject(startState);

//        logit("Starting ML search from " + startState + " <br />");

        var solution = this.searchMLRecursive(node);
        if (solution) {
            bestSolution = this.extractSolutionFromMLGoalNode(solution);
            var states = this.extractStatesFromMLGoalNode(solution);
//                    logit("Solution states: " + states + "<br />");
        }
        if (this.mlSolutions >= this.maxMLSolutions) {
            break;
        }
    }
    this.searchDone();
    if (bestSolution != null) {
        //        logit("Returning result " + bestSolution + "<br />");
        return bestSolution;
    }
    logit("Failed to find a solution in DfsSolver " + this.failReason + "<br />");
    return null;
};

DfsSolver.prototype.extractPartialSolutionFromNode = function(node) {
    var currentNode = node;
    var solution = [];
    do {
        solution.unshift(currentNode.state.harmony);
        currentNode = currentNode.previous;
    } while (currentNode);
    return solution;
};

DfsSolver.prototype.extractPartialSolutionStatesFromNode = function(node) {
    var currentNode = node;
    var states = [];
    do {
        states.unshift(currentNode.state);
        currentNode = currentNode.previous;
    } while (currentNode);
    return states;
};

DfsSolver.prototype.extractSolutionFromStates = function(states) {
    var solution = [];
    for (var i=0; i<states.length; i++) {
        solution.push(this.extractStateResultData(states[i]));
    }
    return solution;
};

DfsSolver.prototype.extractSolutionFromMLGoalNode = function(node) {
    var result = [];
    var current = node;
    while (current.previous) {
        current = current.previous;
    }
    while (current) {
        result.push(this.extractStateResultData(current.state));
        current = current.next;
    }
    return result;
};

DfsSolver.prototype.extractStatesFromMLGoalNode = function(node) {
    var result = [];
    var current = node;
    while (current.previous) {
        current = current.previous;
    }
    while (current) {
        result.push(current.state);
        current = current.next;
    }
    return result;
};