
function CollisionGrid(w, h) {
    this.width = w;
    this.height = h;

    this.grid = [];
    for (var i=0; i<w; i++) {
        this.grid[i] = [];
        for (var j=0; j<h; j++) {
            this.grid[i][j] = [];
        }
    }
}

CollisionGrid.prototype.addObject = function(i, j) {
    this.grid[i][j].push(o);
};

CollisionGrid.prototype.rectIntersects = function(r, resultInfo) {

    return false;

    var minI = Math.max(0, Math.floor(r[0] / GRID_SIZE));
    var maxI = Math.min(this.width - 1, Math.floor((r[0] + r[2]) / GRID_SIZE));
    var minJ = Math.max(0, Math.floor(-r[1] / GRID_SIZE));
    var maxJ = Math.min(this.height - 1, Math.floor((-r[1] + r[3]) / GRID_SIZE));

//    logitRnd([minI, maxI, minJ, maxJ].join(",") + " " + r.join(", "), 0.1);

    if (-r[1] + r[3] >= GRID_SIZE * this.height || r[0] <= 0 ||
        r[0] + r[2] >= GRID_SIZE * this.width) {
        return true;
    }

    if (!resultInfo) {
        resultInfo = {};
    }
    resultInfo.hitFire = false;

    var hit = false;
    for (var i=minI; i<=maxI; i++) {
        for (var j=minJ; j<=maxJ; j++) {
            if (this.grid[i][j].length > 0) {
                hit = true;
            }
        }
    }
    return hit;
};