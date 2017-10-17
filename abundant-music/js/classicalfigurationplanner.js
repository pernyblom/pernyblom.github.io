
function FigurationPlanner() {
    this.id = "";
    this._constructorName = "FigurationPlanner";
}

FigurationPlanner.prototype.getFigurator = function(options) {
    return new Figurator(options);
};


function ClassicalFigurationPlanner() {
    FigurationPlanner.call(this);
    this.maxMLSolutions = 10;
    this.maxSearchSteps = 1000;
    this._constructorName = "ClassicalFigurationPlanner";
}

ClassicalFigurationPlanner.prototype = new FigurationPlanner();

ClassicalFigurationPlanner.prototype.getFigurator = function(options) {
    options.maxMLSolutions = this.maxMLSolutions;
    options.maxSearchSteps = this.maxSearchSteps;
    return new Figurator(options);
};
