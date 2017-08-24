

function BaseInterpolator(x, m) {
    this.n = x.length;
    this.mm = m;
    this.jsav = 0;
    this.cor = 0;
    this.dj = Math.min(1, Math.floor(Math.pow(this.n, 0.25)));
    this.xx = x;
}

BaseInterpolator.prototype.interpolate = function(x) {
    var jlo = (this.cor != 0) ? this.hunt(x) : this.locate(x);
    return this.rawInterpolate(jlo, x);
};

BaseInterpolator.prototype.rawInterpolate = function(jlo, x) {
    return 0.0;
};


//    public double interpolate(double x) {
//        int jlo = (cor != 0) ? hunt(x) : locate(x);
//        return rawInterpolate(jlo, x);
//    }
//
//    public void interpolate(double x, double[] input, double[] result) {
//        int jlo = (cor != 0) ? hunt(x) : locate(x);
//        rawInterpolate(jlo, x, input, result);
//    }
//
//    public double interpolate(double x, double[] input) {
//        int jlo = (cor != 0) ? hunt(x) : locate(x);
//        return rawInterpolate(jlo, x, input);
//    }

BaseInterpolator.prototype.locate = function(x) {
    var ju, jm, jl;
    if (this.n < 2 || this.mm < 2 || this.mm > this.n) {
        logit("Locate size error");
        return 0;
    }
    var ascnd = (this.xx[this.n - 1] >= this.xx[0]);
    jl = 0;
    ju = this.n - 1;
    while (ju - jl > 1) {
        jm = (ju + jl) >> 1;
        if (x >= this.xx[jm] == ascnd) {
            jl = jm;
        } else {
            ju = jm;
        }
    }
    this.cor = Math.abs(jl - this.jsav) > this.dj ? 0 : 1;
    this.jsav = jl;
    return Math.max(0, Math.min(this.n - this.mm, jl - ((this.mm - 2) >> 1)));
};

BaseInterpolator.prototype.hunt = function(x) {
    var jl = this.jsav;
    var jm, ju;
    var inc = 1;
    if (this.n < 2 || this.mm < 2 || this.mm > this.n) {
        logit(" Hunt size error");
        return 0;
    }
    var ascnd = (this.xx[this.n - 1] > this.xx[0]);
    if (jl < 0 || jl > this.n - 1) {
        jl = 0;
        ju = this.n - 1;
    } else {
        if (x >= this.xx[jl] == ascnd) {
            for (;;) {
                ju = jl + inc;
                if (ju >= this.n - 1) {
                    ju = this.n - 1;
                    break;
                } else if (x < this.xx[ju] == ascnd) {
                    break;
                } else {
                    jl = ju;
                    inc += inc;
                }
            }
        } else {
            ju = jl;
            for (;;) {
                jl = jl - inc;
                if (jl <= 0) {
                    jl = 0;
                    break;
                } else if (x >= this.xx[jl] == ascnd) {
                    break;
                } else {
                    ju = jl;
                    inc += inc;
                }
            }
        }
    }
    while (ju - jl > 1) {
        jm = (ju + jl) >> 1;
        if (x >= this.xx[jm] == ascnd) {
            jl = jm;
        } else {
            ju = jm;
        }
    }
    this.cor = Math.abs(jl - this.jsav) > this.dj ? 0 : 1;
    this.jsav = jl;
    return Math.max(0, Math.min(this.n - this.mm, jl - ((this.mm - 2) >> 1)));
};

//    public double rawInterpolate(int jlo, double x) {
//        return 0.0;
//    }
//
//    public double rawInterpolate(int jlo, double x, double[] input) {
//        return 0.0;
//    }
//
//    public void rawInterpolate(int jlo, double x, double[] input,
//        double[] result) {
//    }

//}


function DoubleBaseInterpolator(x, y, m) {
    BaseInterpolator.call(this, x, m);
    this.yy = y;
}

DoubleBaseInterpolator.prototype = new BaseInterpolator([], 2);



function LinearInterpolator(xValues, yValues) {
    DoubleBaseInterpolator.call(this, xValues, yValues, 2)
}

LinearInterpolator.prototype = new DoubleBaseInterpolator([], [], 2);


LinearInterpolator.prototype.rawInterpolate = function(j, x) {
//    logit("j: " + j + " xx:" + this.xx.join(",") + " yy:" + this.yy.join(","));
    if (this.xx[j] == this.xx[j + 1]) {
        return this.yy[j];
    } else {
        return this.yy[j] + ((x - this.xx[j]) / (this.xx[j + 1] - this.xx[j]))
            * (this.yy[j + 1] - this.yy[j]);
    }
};



