
function FigurationGridCellInfo() {
    this.startBeat = 0.0;
    this.endBeat = 1.0;
}

function FigurationGrid(options) {
    this.beatCellSize = getValueOrDefault(options, "beatCellSize", 1);
    this.noteCellSize = getValueOrDefault(options, "noteCellSize", 5);

    this.infos = [];
    this.nextIndices = [];
    this.previousIndices = [];
}

FigurationGrid.prototype.storeInfo = function(info) {
    this.infos.push(info);
};

FigurationGrid.prototype.getBeatCellIndex = function(beat) {
    return Math.floor(beat / this.beatCellSize);
};
FigurationGrid.prototype.getNoteCellIndex = function(note) {
    return Math.floor(note / this.noteCellSize);
};

FigurationGrid.prototype.getOverlapIndices = function(beatInterval, note) {
    
};






