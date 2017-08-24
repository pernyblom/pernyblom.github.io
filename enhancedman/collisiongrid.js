
function CollisionGrid(w, h) {
    this.width = w;
    this.height = h;

    this.grid = [];
    this.fires = [];
    this.widths = [];
    this.heights = [];
    for (var i=0; i<w; i++) {
        this.grid[i] = [];
        this.fires[i] = [];
        this.widths[i] = [];
        this.heights[i] = [];
        for (var j=0; j<h; j++) {
            this.grid[i][j] = false;
            this.fires[i][j] = false;
            this.widths[i][j] = GRID_SIZE;
            this.heights[i][j] = GRID_SIZE;
        }
    }
}

CollisionGrid.prototype.setSolid = function(i, j, s) {
    this.grid[i][j] = s;
};

CollisionGrid.prototype.setFire = function(i, j, s) {
    this.fires[i][j] = s;
};

CollisionGrid.prototype.rectIntersects = function(r, resultInfo) {
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
            if (this.grid[i][j]) {

                var otherRect = [i * GRID_SIZE, -j * GRID_SIZE, this.widths[i][j], this.heights[i][j]];
//                logitRnd(" Grid was busy.. " + "rect: " + r.join(", ") + " other rect: " + otherRect.join(", "), 1.0);
                if (rectCollide(r, otherRect)) {
//                    logitRnd(" collision !!!!", 1.0);
                    if (this.fires[i][j]) {
                        resultInfo.hitFire = true;
                    }
                    hit = true;
                }
            }
        }
    }
    return hit;
};