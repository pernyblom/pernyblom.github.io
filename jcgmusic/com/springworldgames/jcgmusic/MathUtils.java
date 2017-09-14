package com.springworldgames.jcgmusic;

public class MathUtils {


	public static double diffAngle(double x1, double y1, double x2, double y2) {
		double l1 = Math.sqrt(x1 * x1 + y1 * y1);
		double l2 = Math.sqrt(x2 * x2 + y2 * y2);
		double ArrayList = x1 * y2 - x2 * y1;
		double angle = Math.asin(ArrayList / (l1 * l2));
		return angle;
	}


	public static boolean isStrange(double sq) {
		return Double.isInfinite(sq) || Double.isNaN(sq);
	}

	public static double clamp(double x, double a, double b) {
		return (x < a ? a : (x > b ? b : x));
	}

	public static int clampInt(double x, int a, int b) {
		int intX = (int) x;
		return (intX < a ? a : (intX > b ? b : intX));
	}

	public static int clampIntToInt(int x, int a, int b) {
		return (x < a ? a : (x > b ? b : x));
	}

	public static double smoothStep(double a, double b, double x) {
		if (x < a) {
			return 0.0;
		}
		if (x >= b) {
			return 1.0;
		}
		x = (x - a) / (b - a);
		return (x * x * (3.0 - 2.0 * x));
	}

	public static double smoothStep(double x) {
		if (x < 0.0) {
			return 0.0;
		}
		if (x >= 1.0) {
			return 1.0;
		}
		return (x * x * (3.0 - 2.0 * x));
	}

	public static int floorInt(double x) {
		return (int) Math.floor(x);
	}

	public static int ceilInt(double x) {
		return (int) Math.ceil(x);
	}

	public static long floorLong(double x) {
		return (long) Math.floor(x);
	}

	public static long ceilLong(double x) {
		return (long) Math.ceil(x);
	}

	// A magic hash
	public static int hash(int a) {
		a = (a + 0x7ed55d16) + (a << 12);
		a = (a ^ 0xc761c23c) ^ (a >> 19);
		a = (a + 0x165667b1) + (a << 5);
		a = (a + 0xd3a2646c) ^ (a << 9);
		a = (a + 0xfd7046c5) + (a << 3);
		a = (a ^ 0xb55a4f09) ^ (a >> 16);
		return a;
	}

	public static double lerp(double t, double x0, double x1) {
		return x0 + t * (x1 - x0);
	}

	public static double[] lerp(double t, double[] x0, double[] x1) {
		double[] result = new double[x0.length];
		for (int i = 0; i < x0.length; i++) {
			result[i] = x0[i] + t * (x1[i] - x0[i]);
		}
		return result;
	}

	public static int lerp(double t, int x0, int x1) {
		return (int) (x0 + t * (x1 - x0));
	}

	public static int[] lerp(double t, int[] x0, int[] x1) {
		int[] result = new int[x0.length];
		for (int i = 0; i < x0.length; i++) {
			result[i] = (int) (x0[i] + t * (x1[i] - x0[i]));
		}
		return result;
	}

	public static double biLerp(double xFrac, double yFrac, double f00,
			double f10, double f01, double f11) {
		double oneMinusXFrac = 1.0 - xFrac;
		double oneMinusYFrac = 1.0 - yFrac;
		return f00 * oneMinusXFrac * oneMinusYFrac + f10 * xFrac
				* oneMinusYFrac + f01 * oneMinusXFrac * yFrac + f11 * xFrac
				* yFrac;
	}

	public static double biLerp(double x, double y, double[][] grid) {
		int xIndex = (int) x;
		int yIndex = (int) y;

		if (xIndex >= grid.length || yIndex >= grid[0].length) {
			return 0.0;
		}
		double xFrac = x - xIndex;
		double yFrac = y - yIndex;

		double oneMinusXFrac = 1.0 - xFrac;
		double oneMinusYFrac = 1.0 - yFrac;

		boolean nextXOk = xIndex < grid.length - 1;
		boolean nextYOk = yIndex < grid[0].length - 1;

		double f00 = grid[xIndex][yIndex];

		if (nextXOk && nextYOk) {
			double f10 = grid[xIndex + 1][yIndex];
			double f01 = grid[xIndex][yIndex + 1];
			double f11 = grid[xIndex + 1][yIndex + 1];
			return f00 * oneMinusXFrac * oneMinusYFrac + f10 * xFrac
					* oneMinusYFrac + f01 * oneMinusXFrac * yFrac + f11 * xFrac
					* yFrac;
		} else if (nextXOk) {
			return grid[xIndex][yIndex];
		} else if (nextYOk) {
			return grid[xIndex][yIndex];
		} else {
			return grid[xIndex][yIndex];
		}

	}

	public static void biLerp(double xFrac, double yFrac, double[] f00,
			double[] f10, double[] f01, double[] f11, double [] result) {
		double oneMinusXFrac = 1.0 - xFrac;
		double oneMinusYFrac = 1.0 - yFrac;
		for (int i = 0; i < f00.length; i++) {
			result[i] = f00[i] * oneMinusXFrac * oneMinusYFrac + f10[i] * xFrac
					* oneMinusYFrac + f01[i] * oneMinusXFrac * yFrac + f11[i]
					* xFrac * yFrac;
		}
	}

	public static int biLerp(double xFrac, double yFrac, int f00, int f10,
			int f01, int f11) {
		double oneMinusXFrac = 1.0 - xFrac;
		double oneMinusYFrac = 1.0 - yFrac;
		return (int) (f00 * oneMinusXFrac * oneMinusYFrac + f10 * xFrac
				* oneMinusYFrac + f01 * oneMinusXFrac * yFrac + f11 * xFrac
				* yFrac);
	}

	public static int[] biLerp(double xFrac, double yFrac, int[] f00,
			int[] f10, int[] f01, int[] f11) {
		double oneMinusXFrac = 1.0 - xFrac;
		double oneMinusYFrac = 1.0 - yFrac;
		int[] result = new int[f00.length];
		for (int i = 0; i < f00.length; i++) {
			result[i] = (int) (f00[i] * oneMinusXFrac * oneMinusYFrac + f10[i]
					* xFrac * oneMinusYFrac + f01[i] * oneMinusXFrac * yFrac + f11[i]
					* xFrac * yFrac);
		}
		return result;
	}

	public static int intMod(int a, int b) {
		return (int) Math.round(mod((double) a, b));
	}

	public static double mod(double a, double b) {
		int n = (int) (a / b);
		a -= n * b;
		if (a < 0) {
			a += b;
		}
		return a;
	}

	public static double unitClamp(double x) {
		return clamp(x, 0.0, 1.0);
	}

	// Ramps from (0.0, 0.0) to (0.5, 1.0) and then down to (1.0, 0.0)
	public static double trianglePulse(double x) {
		if (x < 0.0 || x > 1.0) {
			return 0.0;
		} else if (x < 0.5) {
			return 2.0 * x;
		} else {
			return 2.0 - 2.0 * x;
		}
	}

	public static double sawtoothWave(double x) {
		double newX = mod(x, 1.0);
		// newX is now in [0..1]
		return 1.0 - newX;
	}

	// Period 1, amplitude 1
	public static double squareWave(double x) {
		double newX = mod(x, 1.0);
		// newX is now in [0..1]
		if (newX < 0.5) {
			return 1.0;
		} else {
			return -1.0;
		}
	}

	// Period 1, amplitude 1
	public static double squareWave(double x, double dutyCycle) {
		double newX = mod(x, 1.0);
		// newX is now in [0..1]
		if (newX < dutyCycle) {
			return 1.0;
		} else {
			return -1.0;
		}
	}

	// Period 1, amplitude 1
	public static double triangleWave(double x) {
		double newX = mod(x, 1.0);
		// newX is now in [0..1]
		if (newX < 0.25) {
			return 4.0 * newX;
		} else if (newX < 0.75) {
			return 2.0 - 4.0 * newX;
		} else {
			return -4.0 + 4.0 * newX;
		}
	}

	public static double sinc(double x) {
		if (Math.abs(x) < 0.0001) {
			return 1.0;
		}
		return Math.sin(2.0 * Math.PI * x) / (2.0 * Math.PI * x);
	}

	public static double max(double... arr) {
		double result = Double.NEGATIVE_INFINITY;
		for (int i = 0; i < arr.length; i++) {
			result = Math.max(result, arr[i]);
		}
		return result;
	}

	public static double max(double[] arr, int[] maxIndex) {
		double result = Double.NEGATIVE_INFINITY;
		for (int i = 0; i < arr.length; i++) {
			if (arr[i] > result) {
				result = arr[i];
				maxIndex[0] = i;
			}
		}
		return result;
	}

	public static double max(double[] arr, int[] maxIndex, int fromIndex, int toIndex) {
		double result = Double.NEGATIVE_INFINITY;
		for (int i = fromIndex; i <= toIndex; i++) {
			if (arr[i] > result) {
				result = arr[i];
				maxIndex[0] = i;
			}
		}
		return result;
	}

	public static double min(double... arr) {
		double result = Double.POSITIVE_INFINITY;
		for (int i = 0; i < arr.length; i++) {
			result = Math.min(result, arr[i]);
		}
		return result;
	}

	public static double maxAbs(double[] arr) {
		double result = Double.NEGATIVE_INFINITY;
		for (int i = 0; i < arr.length; i++) {
			result = Math.max(result, Math.abs(arr[i]));
		}
		return result;
	}

	public static int maxInt(int... arr) {
		int result = Integer.MIN_VALUE;
		for (int i = 0; i < arr.length; i++) {
			result = Math.max(result, arr[i]);
		}
		return result;
	}

	public static int minInt(int... arr) {
		int result = Integer.MAX_VALUE;
		for (int i = 0; i < arr.length; i++) {
			result = Math.min(result, arr[i]);
		}
		return result;
	}

	public static double sum(double... arr) {
		double theSum = 0.0;
		for (int i = 0; i < arr.length; i++) {
			theSum += arr[i];
		}
		return theSum;
	}

	// Good for very small p
	public static double intPow(double x, int p) {
		double result = 1.0;
		int sign = 1;
		if (p < 0) {
			sign = -1;
		}
		for (int i = 0; i < sign * p; i++) {
			result *= x;
		}
		return sign == 1 ? result : 1.0 / result;
	}


	public static double[] mult(double[] array, double gain) {
		for (int i = 0; i < array.length; i++) {
			array[i] *= gain;
		}
		return array;
	}

	// Arr1 and Arr2 must be of same length
	public static double[] pointwiseMult(double[] arr1, double[] arr2) {
		double[] result = new double[arr1.length];
		for (int i = 0; i < result.length; i++) {
			result[i] = arr1[i] * arr2[i];
		}
		return result;
	}

	public static int[] round(double[] input) {
		int[] result = new int[input.length];
		for (int i = 0; i < input.length; i++) {
			result[i] = (int) Math.round(input[i]);
		}
		return result;
	}

	public static int sum(int[] arr) {
		int result = 0;
		for (int i = 0; i < arr.length; i++) {
			result += arr[i];
		}
		return result;
	}

	// Only works for positive integers (I suppose :))
	public static int gcd(int u, int v) {
		int shift;

		/* GCD(0,x) := x */
		if (u == 0 || v == 0)
			return u | v;

		/*
		 * Let shift := lg K, where K is the greatest power of 2 dividing both u
		 * and v.
		 */
		for (shift = 0; ((u | v) & 1) == 0; ++shift) {
			u >>= 1;
			v >>= 1;
		}

		while ((u & 1) == 0)
			u >>= 1;

		/* From here on, u is always odd. */
		do {
			while ((v & 1) == 0)
				/* Loop X */
				v >>= 1;

			/*
			 * Now u and v are both odd, so diff(u, v) is even. Let u = min(u,
			 * v), v = diff(u, v)/2.
			 */
			if (u < v) {
				v -= u;
			} else {
				int diff = u - v;
				u = v;
				v = diff;
			}
			v >>= 1;
		} while (v != 0);

		return u << shift;
	}

	// Returns the index of the maximum value in arr
	public static int maxIndex(int[] arr) {
		int result = 0;
		int maxValue = Integer.MIN_VALUE;
		for (int i = 0; i < arr.length; i++) {
			int val = arr[i];
			if (val > maxValue) {
				maxValue = val;
				result = i;
			}
		}
		return result;
	}

	// b must be positive
	public static int positiveMod(int a, int b) {
		int result;
		if (a >= 0) {
			result = a % b;
		} else {
			result = (b + a % b) % b;
		}
		return result;
	}

	public static double minMax(double min, double max, double value) {
		return Math.min(max, Math.max(min, value));
	}

	public static int minMax(int min, int max, int value) {
		return Math.min(max, Math.max(min, value));
	}

	public static double step(double d) {
		return d > 0.0 ? 1.0 : 0.0;
	}

	public static int sum(int[] distancePattern, int terms) {
		int result = 0;
		for (int i = 0; i < terms; i++) {
			result += distancePattern[i % distancePattern.length];
		}
		return result;
	}

	public static boolean isEven(int v) {
		return (v % 2) == 0;
	}

	// public static void main(String[] args) {
	// for (int i=-15; i<15; i++) {
	// System.out.println(i + " " + positiveMod(i, 4));
	// }
	// }

	// public static void main(String[] args) {
	// for (int i=0; i<32; i++) {
	// System.out.println("gcd(" + i + ", 16) = " + gcd(i, 16));
	// }
	// }
}
