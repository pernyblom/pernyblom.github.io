

var QuadraticSplineInterpolation = {
    CR00: 0.5,
    CR01: -1,
    CR02: 0.5,

    CR10: -1.0,
    CR11: 1,
    CR12: 0.0,

    CR20: 0.5,
    CR21: 0.5,
    CR22: 0.0,

    interpolate: function(x, knots) {
        var nknots = knots.length;
        var nspans = nknots - 2;
        var knot = 0;
        if (nspans < 1) {
            logit(" quadratic spline has too few knots");
            return 0.0;
        }
        x = clamp(x, 0.0, 0.9999) * nspans;
        // println("clamped x: " + x);
        var span = Math.floor(x);
        // println("span before: " + span);
        if (span >= nknots - 2) {
            span = nknots - 2;
        }
        // println("span after: " + span);
        x -= span;
        knot += span;

        // println("knot: " + knot + " knots.length: " + knots.length);

        var knot0 = knots[knot];
        var knot1 = knots[knot + 1];
        var knot2 = knots[knot + 2];

        var c2 = this.CR00 * knot0 + this.CR01 * knot1 + this.CR02 * knot2;
        var c1 = this.CR10 * knot0 + this.CR11 * knot1 + this.CR12 * knot2;
        var c0 = this.CR20 * knot0 + this.CR21 * knot1 + this.CR22 * knot2;
        return (c2 * x + c1) * x + c0;
    }
    
};

var SplineInterpolation = {

    CR00: -0.5,
    CR01: 1.5,
    CR02: -1.5,
    CR03: 0.5,

    CR10: 1.0,
    CR11: -2.5,
    CR12: 2.0,
    CR13: -0.5,

    CR20: -0.5,
    CR21: 0.0,
    CR22: 0.5,
    CR23: 0.0,

    CR30: 0.0,
    CR31: 1.0,
    CR32: 0.0,
    CR33: 0.0,

    //    interpolateLinearEnds: function(x,
    //        internalKnots) {
    //        return this.interpolate(x, getLinearEndKnots(internalKnots));
    //    },

    interpolate: function(x, knots) {
        var nknots = knots.length;
        var nspans = nknots - 3;
        var knot = 0;
        if (nspans < 1) {
            logit(" Spline has too few knots");
            return 0.0;
        }
        x = clamp(x, 0.0, 0.9999) * nspans;
        // println("clamped x: " + x);
        var span = Math.floor(x);
        // println("span before: " + span);
        if (span >= nknots - 3) {
            span = nknots - 3;
        }
        // println("span after: " + span);
        x -= span;
        knot += span;

        // println("knot: " + knot + " knots.length: " + knots.length);

        var knot0 = knots[knot];
        var knot1 = knots[knot + 1];
        var knot2 = knots[knot + 2];
        var knot3 = knots[knot + 3];

        var c3 = this.CR00 * knot0 + this.CR01 * knot1 + this.CR02 * knot2 + this.CR03 * knot3;
        var c2 = this.CR10 * knot0 + this.CR11 * knot1 + this.CR12 * knot2 + this.CR13 * knot3;
        var c1 = this.CR20 * knot0 + this.CR21 * knot1 + this.CR22 * knot2 + this.CR23 * knot3;
        var c0 = this.CR30 * knot0 + this.CR31 * knot1 + this.CR32 * knot2 + this.CR33 * knot3;
        return ((c3 * x + c2) * x + c1) * x + c0;
    }

//	public static void interpolate(double x, double[] result, double[]... knots) {
//		int nknots = knots.length;
//		int nspans = nknots - 3;
//		int knot = 0;
//		if (nspans < 1) {
//			System.out.println(SplineInterpolation.class.getName()
//					+ " Spline has too few knots");
//			return;
//		}
//		x = MathUtils.clamp(x, 0.0, 0.9999) * nspans;
//		// println("clamped x: " + x);
//		int span = (int) x;
//		// println("span before: " + span);
//		if (span >= nknots - 3) {
//			span = nknots - 3;
//		}
//		// println("span after: " + span);
//		x -= span;
//		knot += span;
//
//		// println("knot: " + knot + " knots.length: " + knots.length);
//
//		int dimension = result.length;
//		for (int i = 0; i < dimension; i++) {
//			double knot0 = knots[knot][i];
//			double knot1 = knots[knot + 1][i];
//			double knot2 = knots[knot + 2][i];
//			double knot3 = knots[knot + 3][i];
//
//			double c3 = CR00 * knot0 + CR01 * knot1 + CR02 * knot2 + CR03
//					* knot3;
//			double c2 = CR10 * knot0 + CR11 * knot1 + CR12 * knot2 + CR13
//					* knot3;
//			double c1 = CR20 * knot0 + CR21 * knot1 + CR22 * knot2 + CR23
//					* knot3;
//			double c0 = CR30 * knot0 + CR31 * knot1 + CR32 * knot2 + CR33
//					* knot3;
//
//			result[i] = ((c3 * x + c2) * x + c1) * x + c0;
//		}
//	}
//
//	public static double[] interpolateArray(double[] inputs, double... knots) {
//		double[] result = new double[inputs.length];
//		for (int i = 0; i < inputs.length; i++) {
//			result[i] = interpolate(inputs[i], knots);
//		}
//		return result;
//	}
//
//	public static double[] interpolateLinearEndsArray(double[] inputs,
//			double... internalKnots) {
//		double[] knots = getLinearEndKnots(internalKnots);
//		double[] result = new double[inputs.length];
//		for (int i = 0; i < inputs.length; i++) {
//			result[i] = interpolate(inputs[i], knots);
//		}
//		return result;
//	}
//
//	public static double[] interpolateLinearEndsArray(double minInputValue,
//			double maxInputValue, int n, double... internalKnots) {
//		double[] inputs = new double[n];
//		double stepLength = (maxInputValue - minInputValue) / (n - 1);
//		for (int i = 0; i < n; i++) {
//			inputs[i] = minInputValue + i * stepLength;
//		}
//		return interpolateLinearEndsArray(inputs, internalKnots);
//	}
//
//	// Default range between 0.0 and 1.0
//	public static double[] interpolateLinearEndsArray(int n,
//			double... internalKnots) {
//		return interpolateLinearEndsArray(0.0, 1.0, n, internalKnots);
//	}
//
//	public static double[] getLinearEndKnots(double... internalKnots) {
//		double[] result = new double[internalKnots.length + 2];
//		double diff1 = internalKnots[1] - internalKnots[0];
//		double diff2 = internalKnots[internalKnots.length - 1]
//				- internalKnots[internalKnots.length - 2];
//		result[0] = internalKnots[0] - diff1;
//		result[result.length - 1] = internalKnots[internalKnots.length - 1]
//				+ diff2;
//		for (int i = 1; i < result.length - 1; i++) {
//			result[i] = internalKnots[i - 1];
//		}
//		return result;
//	}

};


