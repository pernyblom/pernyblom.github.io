

function LatticeNoise(rnd, sizeExponent) {
    sizeExponent = sizeExponent ? Math.min(12, Math.max(2, sizeExponent)) : 9;
    this.TAB_SIZE = Math.round(Math.pow(2, sizeExponent));
    this.TAB_MASK = this.TAB_SIZE - 1;
    this.valueTab = [];
    this.rnd = rnd ? rnd : Math.random;
    this.fillValueTab();
}

LatticeNoise.prototype.fillValueTab = function() {
    for (var i = 0; i < this.TAB_SIZE; i++) {
        this.valueTab[i] = 1.0 - 2.0 * this.rnd.random();
    }
};

LatticeNoise.prototype.whiteNoise1 = function(x) {
    var ix = Math.floor(x);
    return this.latticeValue1(ix);
};


LatticeNoise.prototype.whiteNoise2 = function(x, y) {
    var ix = Math.floor(x);
    var iy = Math.floor(y);
    return this.latticeValue2(ix, iy);
};

LatticeNoise.prototype.lerpNoise1 = function(x) {
    var ix = Math.floor(x);
    var fx = x - ix;
    return lerp(fx, this.latticeValue1(ix), this.latticeValue1(ix + 1));
};


LatticeNoise.prototype.cubicNoise1 = function(x) {
    var ix = Math.floor(x);
    var fx = x - ix;

    var xknots4 = [];
    for (var i = -1; i <= 2; i++) {
        xknots4[i + 1] = this.latticeValue1(ix + i);
    }
    return SplineInterpolation.interpolate(fx, xknots4);
};

LatticeNoise.prototype.quadraticNoise1 = function(x) {
    var ix = Math.floor(x);
    var fx = x - ix;

    var xknots3 = [];
    for (var i = -1; i <= 1; i++) {
        xknots3[i + 1] = this.latticeValue1(ix + i);
    }
    return QuadraticSplineInterpolation.interpolate(fx, xknots3);
};



LatticeNoise.prototype.latticeValue1 = function(ix) {
    return this.valueTab[this.index1(ix)];
};

LatticeNoise.prototype.latticeValue2 = function(ix, iy) {
    return this.valueTab[this.index2(ix, iy)];
};

LatticeNoise.prototype.index1 = function(ix) {
    return hash(ix) & this.TAB_MASK;
};

LatticeNoise.prototype.index2 = function(ix, iy) {
    return hash(iy + hash(ix)) & this.TAB_MASK;
};



//
//public class LatticeNoise {
//
//	int TAB_SIZE = 512;
//	int TAB_MASK = TAB_SIZE - 1;
//
//	double[] valueTab = new double[TAB_SIZE];
//	private long seed;
//
//	public LatticeNoise(long seed) {
//		setSeed(seed);
//	}
//
//	void fillValueTab() {
//		Random rnd = new Random(seed);
//		for (int i = 0; i < TAB_SIZE; i++) {
//			valueTab[i] = 1.0 - 2.0 * rnd.nextDouble();
//		}
//	}
//
//	public void setSeed(long seed) {
//		this.seed = seed;
//		fillValueTab();
//	}
//
//	public double noise(double x, double y, double z) {
//
//		double[] xknots4 = new double[4];
//		double[] yknots4 = new double[4];
//		double[] zknots4 = new double[4];
//
//		int ix = MathUtils.floorInt(x);
//		double fx = x - ix;
//
//		int iy = MathUtils.floorInt(y);
//		double fy = y - iy;
//
//		int iz = MathUtils.floorInt(z);
//		double fz = z - iz;
//
//		for (int k = -1; k <= 2; k++) {
//			for (int j = -1; j <= 2; j++) {
//				for (int i = -1; i <= 2; i++) {
//					xknots4[i + 1] = latticeValue(ix + i, iy + j, iz + k);
//				}
//				yknots4[j + 1] = SplineInterpolation.interpolate(fx, xknots4);
//			}
//			zknots4[k + 1] = SplineInterpolation.interpolate(fy, yknots4);
//		}
//		return SplineInterpolation.interpolate(fz, zknots4);
//	}
//
//	public double noise(double x, double y) {
//		int ix = MathUtils.floorInt(x);
//		double fx = x - ix;
//
//		int iy = MathUtils.floorInt(y);
//		double fy = y - iy;
//
//		double[] xknots4 = new double[4];
//		double[] yknots4 = new double[4];
//
//		for (int j = -1; j <= 2; j++) {
//			for (int i = -1; i <= 2; i++) {
//				xknots4[i + 1] = latticeValue(ix + i, iy + j);
//			}
//			yknots4[j + 1] = SplineInterpolation.interpolate(fx, xknots4);
//		}
//		return SplineInterpolation.interpolate(fy, yknots4);
//	}
//
//	public double periodicNoise(double x, double y, int periodX, int periodY) {
//		double[] xknots4 = new double[4];
//		double[] yknots4 = new double[4];
//
//		int ix = MathUtils.floorInt(x);
//		double fx = x - ix;
//
//		int iy = MathUtils.floorInt(y);
//		double fy = y - iy;
//
//		for (int j = -1; j <= 2; j++) {
//			for (int i = -1; i <= 2; i++) {
//				xknots4[i + 1] = periodicLatticeValue(ix + i, iy + j, periodX,
//						periodY);
//			}
//			yknots4[j + 1] = SplineInterpolation.interpolate(fx, xknots4);
//		}
//		return SplineInterpolation.interpolate(fy, yknots4);
//	}
//
//	public double noise(double x) {
//		int ix = MathUtils.floorInt(x);
//		double fx = x - ix;
//
//		double[] xknots4 = new double[4];
//		for (int i = -1; i <= 2; i++) {
//			xknots4[i + 1] = latticeValue(ix + i);
//		}
//		return SplineInterpolation.interpolate(fx, xknots4);
//	}
//
//	public double periodicNoise(double x, int period) {
//		int ix = MathUtils.floorInt(x);
//		double fx = x - ix;
//
//		double[] xknots4 = new double[4];
//		for (int i = -1; i <= 2; i++) {
//			xknots4[i + 1] = periodicLatticeValue(ix + i, period);
//		}
//		return SplineInterpolation.interpolate(fx, xknots4);
//	}
//
//	public double lerpNoise(double x, double y) {
//		int ix = MathUtils.floorInt(x);
//		double fx = x - ix;
//
//		int iy = MathUtils.floorInt(y);
//		double fy = y - iy;
//
//		double[] yknots2 = new double[2];
//		for (int j = -1; j <= 0; j++) {
//			yknots2[j + 1] = MathUtils.lerp(fx, latticeValue(ix - 1, iy + j),
//					latticeValue(ix, iy + j));
//		}
//		return MathUtils.lerp(fy, yknots2[0], yknots2[1]);
//	}
//
//	public double periodicLerpNoise(double x, double y, int periodX, int periodY) {
//		int ix = MathUtils.floorInt(x);
//		double fx = x - ix;
//
//		int iy = MathUtils.floorInt(y);
//		double fy = y - iy;
//
//		double[] yknots2 = new double[2];
//		for (int j = -1; j <= 0; j++) {
//			yknots2[j + 1] = MathUtils.lerp(fx, periodicLatticeValue(ix - 1, iy
//					+ j, periodX, periodY), periodicLatticeValue(ix, iy + j,
//					periodX, periodY));
//		}
//		return MathUtils.lerp(fy, yknots2[0], yknots2[1]);
//	}
//
//	public double lerpNoise(double x) {
//		int ix = MathUtils.floorInt(x);
//		double fx = x - ix;
//		return MathUtils.lerp(fx, latticeValue(ix - 1), latticeValue(ix));
//	}
//
//	public double periodicLerpNoise(double x, int period) {
//		int ix = MathUtils.floorInt(x);
//		double fx = x - ix;
//		return MathUtils.lerp(fx, periodicLatticeValue(ix - 1, period),
//				periodicLatticeValue(ix, period));
//	}
//
//	public double whiteNoise(double x, double y) {
//		int ix = MathUtils.floorInt(x);
//		int iy = MathUtils.floorInt(y);
//		return latticeValue(ix, iy);
//	}
//
//	public double whiteNoise(double x) {
//		int ix = MathUtils.floorInt(x);
//		return latticeValue(ix);
//	}
//
//	public double periodicWhiteNoise(double x, double y, int periodX,
//			int periodY) {
//		int ix = MathUtils.floorInt(x);
//		int iy = MathUtils.floorInt(y);
//		return periodicLatticeValue(ix, iy, periodX, periodY);
//	}
//
//	public double periodicWhiteNoise(double x, int period) {
//		int ix = MathUtils.floorInt(x);
//		return periodicLatticeValue(ix, period);
//	}
//
//	double latticeValue(int ix, int iy, int iz) {
//		return valueTab[index(ix, iy, iz)];
//	}
//
//	double periodicLatticeValue(int ix, int iy, int iz, int periodX,
//			int periodY, int periodZ) {
//		return valueTab[index(MathUtils.positiveMod(ix, periodX), MathUtils
//				.positiveMod(iy, periodY), MathUtils.positiveMod(iz, periodZ))];
//	}
//
//	double latticeValue(int ix, int iy) {
//		return valueTab[index(ix, iy)];
//	}
//
//	double periodicLatticeValue(int ix, int iy, int periodX, int periodY) {
//		return valueTab[index(MathUtils.positiveMod(ix, periodX), MathUtils
//				.positiveMod(iy, periodY))];
//	}
//
//	double latticeValue(int ix) {
//		return valueTab[index(ix)];
//	}
//
//	double periodicLatticeValue(int ix, int period) {
//		return valueTab[index(MathUtils.positiveMod(ix, period))];
//	}
//
//	int index(int ix) {
//		return MathUtils.hash(ix) & TAB_MASK;
//	}
//
//	int index(int ix, int iy) {
//		return MathUtils.hash(iy + MathUtils.hash(ix)) & TAB_MASK;
//	}
//
//	int index(int ix, int iy, int iz) {
//		return MathUtils.hash(iz + MathUtils.hash(iy + MathUtils.hash(ix)))
//				& TAB_MASK;
//	}
//
//	public static void main(String[] args) {
//		LatticeNoise noise = new LatticeNoise(10);
//
//		for (int i = 0; i < 20; i++) {
//			System.out.println(noise.periodicNoise(0.2 * i, 2));
//		}
//	}
//
//}
