package com.springworldgames.jcgmusic;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.Random;

public class ArrayUtils {

	public static <T> void addAll(Collection<T> c, T[] arr) {
		for (T t : arr) {
			c.add(t);
		}
	}

	public static int[][] deepCopy(int[][] input) {
		int[][] copy = new int[input.length][];
		for (int i = 0; i < input.length; i++) {
			copy[i] = input[i].clone();
		}
		return copy;
	}

	public static double[][] deepCopy(double[][] input) {
		double[][] copy = new double[input.length][];
		for (int i = 0; i < input.length; i++) {
			copy[i] = input[i].clone();
		}
		return copy;
	}

	public static int[] createRoundedIntArray(double[] arr) {
		int[] result = new int[arr.length];
		for (int i = 0; i < arr.length; i++) {
			result[i] = (int) Math.round(arr[i]);
		}
		return result;
	}

	public static Object[] reverse(Object[] arr) {
		Object[] result = new Object[arr.length];
		for (int i = 0; i < arr.length; i++) {
			result[i] = arr[arr.length - i - 1];
		}
		return result;
	}

	public static double[] reverse(double[] arr) {
		double[] result = new double[arr.length];
		for (int i = 0; i < arr.length; i++) {
			result[i] = arr[arr.length - i - 1];
		}
		return result;
	}

	public static int[] reverse(int[] arr) {
		int[] result = new int[arr.length];
		for (int i = 0; i < arr.length; i++) {
			result[i] = arr[arr.length - i - 1];
		}
		return result;
	}

	public static float[] reverse(float[] arr) {
		float[] result = new float[arr.length];
		for (int i = 0; i < arr.length; i++) {
			result[i] = arr[arr.length - i - 1];
		}
		return result;
	}

	public static float[] toFloatArray(double[] arr) {
		float[] result = new float[arr.length];
		for (int i = 0; i < result.length; i++) {
			result[i] = (float) arr[i];
		}
		return result;
	}

	public static double[] toDoubleArray(float[] arr) {
		double[] result = new double[arr.length];
		for (int i = 0; i < result.length; i++) {
			result[i] = arr[i];
		}
		return result;
	}

	public static double[] getLinearDoubleArray(double from, double to, int n) {
		double[] result = new double[n];
		double diff = to - from;

		if (n == 0) {
			return new double[] {};
		} else if (n == 1) {
			return new double[] { 0.5 * (from + to) };
		} else {
			double step = diff / (n - 1);
			for (int i = 0; i < n; i++) {
				result[i] = from + step * i;
			}
			return result;
		}
	}

	public static void getLinearDoubleArray(double from, double to, int n,
			int arrayOffset, double[] result) {
		double diff = to - from;

		if (n == 0) {
			return;
		} else if (n == 1) {
			result[arrayOffset] = 0.5 * (from + to);
		} else {
			double step = diff / (n - 1);
			for (int i = 0; i < n; i++) {
				result[i + arrayOffset] = from + step * i;
			}
		}
	}

	public static int[] getLinearIntArray(int from, int stepLength, int n) {
		int[] result = new int[n];
		for (int i = 0; i < n; i++) {
			result[i] = from + i * stepLength;
		}
		return result;
	}

	public static int[] getLinearIntArray(int n) {
		int[] result = new int[n];
		for (int i = 0; i < n; i++) {
			result[i] = i;
		}
		return result;
	}

	public static void fill(double[] source, double[] result) {
		int n = Math.min(source.length, result.length);
		for (int i = 0; i < n; i++) {
			result[i] = source[i];
		}
	}

	public static double[] getStepwiseLinearDoubleArray(int n,
			double[] fractions, double[] values) {
		double nDouble = n;

		int nToUse = n;
		double[] result = new double[nToUse];

		double firstFrac = fractions[0];
		Arrays.fill(result, 0, Math.min(nToUse, (int) Math.round(firstFrac
				* nDouble)), values[0]);

		double lastFrac = fractions[fractions.length - 1];
		Arrays.fill(result, Math.min(nToUse, (int) Math.round(lastFrac
				* nDouble)), nToUse, values[values.length - 1]);

		for (int i = 1; i < fractions.length; i++) {
			double prevFrac = fractions[i - 1];
			double frac = fractions[i];
			// println(this + " prevFrac:" + prevFrac + " frac:" + frac);
			double fracNDouble = (frac - prevFrac) * nDouble;
			double fracOffsetDouble = prevFrac * nDouble;
			double prevValue = values[i - 1];
			double value = values[i];
			ArrayUtils.getLinearDoubleArray(prevValue, value,
					(int) fracNDouble, (int) fracOffsetDouble, result);
		}
		return result;
	}

	public static void plus(double[] arr1, double[] arr2andResult) {
		int n = Math.min(arr1.length, arr2andResult.length);
		for (int i = 0; i < n; i++) {
			arr2andResult[i] += arr1[i];
		}
	}

	public static void plus(int[] arr1, int[] arr2andResult) {
		int n = Math.min(arr1.length, arr2andResult.length);
		for (int i = 0; i < n; i++) {
			arr2andResult[i] += arr1[i];
		}
	}

	public static boolean equals(int[] arr1, int[] arr2) {
		if (arr1.length == arr2.length) {
			for (int i = 0; i < arr1.length; i++) {
				if (arr1[i] != arr2[i]) {
					return false;
				}
			}
			return true;
		}
		return false;
	}

	public static boolean equals(double[] arr1, double[] arr2) {
		if (arr1.length == arr2.length) {
			for (int i = 0; i < arr1.length; i++) {
				if (arr1[i] != arr2[i]) {
					return false;
				}
			}
			return true;
		}
		return false;
	}

	public static void swap(Object[] arr, int i, int j) {
		Object temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}

	public static void swap(int[] arr, int i, int j) {
		int temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}

	public static void swapCyclic(int[] arr, int i, int j) {
		int temp = arr[i % arr.length];
		arr[i % arr.length] = arr[j % arr.length];
		arr[j % arr.length] = temp;
	}

	public static void swap(double[] arr, int i, int j) {
		double temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}

	public static void swapCyclic(double[] arr, int i, int j) {
		double temp = arr[i % arr.length];
		arr[i % arr.length] = arr[j % arr.length];
		arr[j % arr.length] = temp;
	}

	public static double[] createFilledDoubleArr(int n, double value) {
		double[] result = new double[n];
		Arrays.fill(result, value);
		return result;
	}

	public static int[] createFilledIntArr(int n, int value) {
		int[] result = new int[n];
		Arrays.fill(result, value);
		return result;
	}

	public static int[] createFilledIntArr(int n, int[] values) {
		int[] result = new int[n];
		for (int i = 0; i < n; i++) {
			result[i] = values[i % values.length];
		}
		return result;
	}

	public static double[] createFilledDoubleArr(int n, double[] values) {
		double[] result = new double[n];
		for (int i = 0; i < n; i++) {
			result[i] = values[i % values.length];
		}
		return result;
	}

	public static int[] createFilledIntArr(int n, int resultOffset,
			int[] result, int[] pattern) {
		for (int i = 0; i < n; i++) {
			result[i + resultOffset] = pattern[i % pattern.length];
		}
		return result;
	}


	//
	// public static int[] convertToInt(DoubleFunction function, int n,
	// DoubleToIntConvertMethod method) {
	// int[] result = new int[n];
	// for (int i = 0; i < result.length; i++) {
	// double fraction = i / (double) (n - 1);
	// result[i] = DoubleUtils.convertToInt(function
	// .getDoubleFunctionValue(fraction), method);
	// }
	// return result;
	// }

	public static int[] toIntArr(Collection<Integer> list) {
		int[] result = new int[list.size()];
		int i = 0;
		for (Integer value : list) {
			result[i] = value;
			i++;
		}
		return result;
	}

	public static int[] toIntArr(Integer[] arr) {
		int[] result = new int[arr.length];
		int i = 0;
		for (Integer value : arr) {
			result[i] = value;
			i++;
		}
		return result;
	}

	public static Integer[] toIntegerArr(int[] arr) {
		Integer[] result = new Integer[arr.length];
		int i = 0;
		for (Integer value : arr) {
			result[i] = value;
			i++;
		}
		return result;
	}

	public static Double[] toDoubleArr(double[] arr) {
		Double[] result = new Double[arr.length];
		int i = 0;
		for (double value : arr) {
			result[i] = value;
			i++;
		}
		return result;
	}

	public static double[] toDoubleArr(ArrayList<Double> list) {
		double[] result = new double[list.size()];
		for (int i = 0; i < list.size(); i++) {
			result[i] = list.get(i);
		}
		return result;
	}

	public static ArrayList<Double> toDoubleArrayList(double[] arr) {
		ArrayList<Double> result = new ArrayList<Double>(arr.length);
		for (int i = 0; i < arr.length; i++) {
			result.add(arr[i]);
		}
		return result;
	}

	public static boolean contains(int[] arr, int value) {
		if (arr != null) {
			for (int i = 0; i < arr.length; i++) {
				if (arr[i] == value) {
					return true;
				}
			}
		}
		return false;
	}

	public static int indexOf(int[] arr, int value) {
		if (arr != null) {
			for (int i = 0; i < arr.length; i++) {
				if (arr[i] == value) {
					return i;
				}
			}
		}
		return -1;
	}

	public static <T> int indexOf(T[] arr, T value) {
		if (arr != null) {
			for (int i = 0; i < arr.length; i++) {
				if (arr[i] == value) {
					return i;
				}
			}
		}
		return -1;
	}

	public static boolean contains(Object[] arr, Object value) {
		if (arr != null) {
			for (int i = 0; i < arr.length; i++) {
				if (arr[i] == value) {
					return true;
				}
			}
		}
		return false;
	}

	public static boolean containsEquals(Object[] arr, Object value) {
		if (arr != null) {
			for (int i = 0; i < arr.length; i++) {
				if (arr[i].equals(value)) {
					return true;
				}
			}
		}
		return false;
	}

	public static int getClosestValue(double d, int[] domain) {
		int index = 0;
		double minDiff = Double.POSITIVE_INFINITY;
		for (int i = 0; i < domain.length; i++) {
			double diff = Math.abs(domain[i] - d);
			if (diff < minDiff) {
				index = domain[i];
				minDiff = diff;
			}
		}
		return index;
	}

	public static int getClosestIndex(double value, double[] array) {
		double minDistance = Double.POSITIVE_INFINITY;
		int closestIndex = 0;
		for (int i = 0; i < array.length; i++) {
			double dist = Math.abs(array[i] - value);
			if (dist < minDistance) {
				minDistance = dist;
				closestIndex = i;
			}
		}
		return closestIndex;
	}

	// Use smarter search here instead!
	// The input array is supposed to be sorted so it should not be that
	// difficult
	public static int getClosestIndexSorted(double value, double[] array) {
		return getClosestIndex(value, array);
	}

	public static <T> T[] intersection(T[] objects1, T[] objects2) {
		ArrayList<T> list = new ArrayList<T>();
		for (T o1 : objects1) {
			for (T o2 : objects2) {
				if (o1.equals(o2)) {
					list.add(o1);
				}
			}
		}
		return list.toArray(objects1.clone());
	}


	// For all the input arrays, create copies that are equal to the length of
	// the minimum length input array
	// Doesn't make sense? Live with it!
	public static double[][] matchLengths(double[][] input) {
		int minLength = Integer.MAX_VALUE;
		for (int i = 0; i < input.length; i++) {
			double[] arr = input[i];
			minLength = Math.min(arr.length, minLength);
		}
		double[][] result = new double[input.length][minLength];
		for (int i = 0; i < input.length; i++) {
			double[] arr = input[i];
			double[] resultArr = new double[minLength];
			for (int j = 0; j < minLength; j++) {
				resultArr[j] = arr[j];
			}
			result[i] = resultArr;
		}
		return result;
	}


	public static Object getWithToString(Object[] array, String category) {
		for (Object o : array) {
			if (o.toString().equals(category)) {
				return o;
			}
		}
		return null;
	}

	public static String[] getToStringArray(Object[] array) {
		String[] result = new String[array.length];
		int i = 0;
		for (Object o : array) {
			result[i] = o.toString();
			i++;
		}
		return result;
	}

	@SuppressWarnings("unchecked")
	public static String toStringWithoutBrackets(Collection c) {
		return toStringWithoutBrackets(c, " ", " ");
	}

	@SuppressWarnings("unchecked")
	public static String toStringWithoutBrackets(Collection c,
			String separator, String lastSeparator) {
		StringBuilder builder = new StringBuilder();
		int theLength = c.size();
		Iterator iterator = c.iterator();
		int i = 0;
		while (iterator.hasNext()) {
			Object next = iterator.next();
			builder.append(next.toString());
			if (i == theLength - 2) {
				builder.append(lastSeparator);
			} else if (i < theLength - 1) {
				builder.append(separator);
			}
			i++;
		}
		return builder.toString();
	}

	public static String toStringWithoutBrackets(int[] arr) {
		return toStringWithoutBrackets(arr, " ");
	}

	public static String toStringWithoutBrackets(int[] arr, String separator) {
		return toStringWithoutBrackets(arr, separator, separator);
	}

	public static String toStringWithoutBrackets(int[] arr, String separator,
			String lastSeparator) {
		StringBuilder builder = new StringBuilder();
		for (int i = 0; i < arr.length; i++) {
			builder.append(arr[i]);
			if (i == arr.length - 2) {
				builder.append(lastSeparator);
			} else if (i < arr.length - 1) {
				builder.append(separator);
			}
		}
		return builder.toString();
	}

	public static String toStringWithoutBrackets(int[][] arr) {
		StringBuilder builder = new StringBuilder();
		for (int i = 0; i < arr.length; i++) {
			builder.append(toStringWithoutBrackets(arr[i]));
			if (i < arr.length - 1) {
				builder.append(",");
			}
		}
		return builder.toString();
	}

	public static <T> String toStringWithoutBrackets(T[] arr, String separator,
			String lastSeparator) {
		StringBuilder builder = new StringBuilder();
		for (int i = 0; i < arr.length; i++) {
			builder.append(arr[i].toString());
			if (i == arr.length - 2) {
				builder.append(lastSeparator);
			} else if (i < arr.length - 1) {
				builder.append(separator);
			}
		}
		return builder.toString();
	}

	public static String toStringWithoutBrackets(double[] arr) {
		StringBuilder builder = new StringBuilder();
		for (int i = 0; i < arr.length; i++) {
			builder.append(arr[i]);
			if (i < arr.length - 1) {
				builder.append(" ");
			}
		}
		return builder.toString();
	}

	public static String toStringWithoutBrackets(Object[] arr) {
		StringBuilder builder = new StringBuilder();
		for (int i = 0; i < arr.length; i++) {
			builder.append(arr[i]);
			if (i < arr.length - 1) {
				builder.append(" ");
			}
		}
		return builder.toString();
	}

	public static void shuffle(Object[] array, Random rnd) {
		if (array != null) {
			for (int i = 0; i < array.length; i++) {
				double r = rnd.nextDouble();
				int index = MathUtils.clampInt(r * array.length, 0,
						array.length - 1);
				swap(array, i, index);
			}
		}
	}

	public static int[] getIntArrayFromIntegerArray(Integer[] arr) {
		int[] result = new int[arr.length];
		for (int i = 0; i < arr.length; i++) {
			Integer value = arr[i];
			if (value != null) {
				result[i] = value;
			}
		}
		return result;
	}

	public static Object[] sampleK(Object[] array, int k, Random rnd) {
		if (array != null && array.length > 0) {
			Object[] result = new Object[k];
			for (int i = 0; i < k; i++) {
				double r = rnd.nextDouble();
				int index = MathUtils.clampInt(r * array.length, 0,
						array.length - 1);
				result[i] = array[index];
			}
			return result;
		}
		return null;
	}

	public static Object[] append(Object[] array1, Object[] array2) {
		Object[] result = new Object[array1.length + array2.length];
		for (int i = 0; i < array1.length; i++) {
			result[i] = array1[i];
		}
		for (int i = 0; i < array2.length; i++) {
			result[i + array1.length] = array2[i];
		}
		return result;
	}

	public static <T> Collection<T> fillCollectionWithArray(
			Collection<T> toFill, T[] array) {
		for (T v : array) {
			toFill.add(v);
		}
		return toFill;
	}

	public static <T> LinkedHashSet<T> toSet(T[] array) {
		LinkedHashSet<T> result = new LinkedHashSet<T>();
		for (T v : array) {
			result.add(v);
		}
		return result;
	}


	public static double findClosest(double[] orderedValues, double value,
			int lowerIndex, int upperIndex) {
		double minDistance = Double.POSITIVE_INFINITY;
		int minIndex = lowerIndex;
		for (int i = lowerIndex; i <= upperIndex; i++) {
			double distance = Math.abs(orderedValues[i] - value);
			if (distance < minDistance) {
				minDistance = distance;
				minIndex = i;
			}
		}
		return orderedValues[minIndex];
	}

	public static double findClosest(double[] orderedValues, double value) {
		switch (orderedValues.length) {
		case 0:
			return 0.0;
		case 1:
			return orderedValues[0];
		default:
			int middleIndex = orderedValues.length / 2;
			double middleValue = orderedValues[middleIndex];
			if (value < middleValue) {
				return findClosest(orderedValues, value, 0, middleIndex);
			} else {
				return findClosest(orderedValues, value, middleIndex,
						orderedValues.length - 1);
			}
		}
	}

	public static int[][] toIntIntArr(ArrayList<int[]> arrList) {
		int[][] result = new int[arrList.size()][];
		int i = 0;
		for (int[] arr : arrList) {
			result[i] = arr.clone();
			i++;
		}
		return result;
	}

	public static double[][] toDoubleDoubleArr(ArrayList<double[]> arrList) {
		double[][] result = new double[arrList.size()][];
		int i = 0;
		for (double[] arr : arrList) {
			result[i] = arr.clone();
			i++;
		}
		return result;
	}

	public static String toString(int[][] intArrArr) {
		StringBuilder builder = new StringBuilder();
		builder.append("[");
		for (int i = 0; i < intArrArr.length; i++) {
			int[] arr = intArrArr[i];
			builder.append(Arrays.toString(arr));
			if (i < intArrArr.length - 1) {
				builder.append(", ");
			}
		}
		builder.append("]");
		return builder.toString();
	}

	public static String toString(double[][] doubleArrArr) {
		StringBuilder builder = new StringBuilder();
		builder.append("[");
		for (int i = 0; i < doubleArrArr.length; i++) {
			double[] arr = doubleArrArr[i];
			builder.append(Arrays.toString(arr));
			if (i < doubleArrArr.length - 1) {
				builder.append(", ");
			}
		}
		builder.append("]");
		return builder.toString();
	}

	public static boolean equals(double[][] arr1, double[][] arr2) {
		if (arr1.length == arr2.length) {
			for (int i=0; i<arr1.length; i++) {
				if (!equals(arr1[i], arr2[i])) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	}

	public static boolean equals(int[][] arr1, int[][] arr2) {
		if (arr1.length == arr2.length) {
			for (int i=0; i<arr1.length; i++) {
				if (!equals(arr1[i], arr2[i])) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	}

	public static double[] toDoubleArr(int[] arr) {
		double [] result = new double[arr.length];
		for (int i=0; i<result.length; i++) {
			result[i] = arr[i];
		}
		return result;
	}

}
