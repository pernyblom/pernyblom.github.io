
// Grumdrig at stackoverflow is the author of this (sort of)

var LineGeom = {

    sqr: function(x) { return x * x },
    dist2: function(v, w) { return this.sqr(v.x - w.x) + this.sqr(v.y - w.y) },

    // Return minimum distance between line segment vw and point p
    distToSegmentSquared: function(p, v, w) {
        var l2 = this.dist2(v, w);
        if (l2 == 0) return this.dist2(p, v);
        var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        if (t < 0) return this.dist2(p, v);
        if (t > 1) return this.dist2(p, w);
        return this.dist2(p, { x: v.x + t * (w.x - v.x),
            y: v.y + t * (w.y - v.y) });
    },

    distToSegment: function(p, v, w) { return Math.sqrt(this.distToSegmentSquared(p, v, w)); }

};

