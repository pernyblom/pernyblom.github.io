package com.springworldgames.jcgmusic;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Scanner;

import com.springworldgames.objectreader.ReadableObject;

public class ParseUtils {

	public static String getIntIntArrayValueString(int[][] arr) {
		StringBuilder builder = new StringBuilder();
		for (int i = 0; i < arr.length; i++) {
			builder.append(getIntArrayValueString(arr[i]));
			if (i != arr.length - 1) {
				builder.append(",");
			}
		}
		return builder.toString();
	}

	public static String getDoubleDoubleArrayValueString(double[][] arr) {
		StringBuilder builder = new StringBuilder();
		for (int i = 0; i < arr.length; i++) {
			builder.append(getDoubleArrayValueString(arr[i]));
			if (i != arr.length - 1) {
				builder.append(",");
			}
		}
		return builder.toString();
	}

	public static String getIntArrayValueString(int[] arr) {
		StringBuilder builder = new StringBuilder();
		for (int i = 0; i < arr.length; i++) {
			builder.append(arr[i]);
			if (i != arr.length - 1) {
				builder.append(" ");
			}
		}
		return builder.toString();
	}

	public static String getDoubleArrayValueString(double[] arr) {
		StringBuilder builder = new StringBuilder();
		for (int i = 0; i < arr.length; i++) {
			builder.append(arr[i]);
			if (i != arr.length - 1) {
				builder.append(" ");
			}
		}
		return builder.toString();
	}

	public static String getObjectArrayValueString(Object[] arr) {
		StringBuilder builder = new StringBuilder();
		for (int i = 0; i < arr.length; i++) {
			builder.append(arr[i].toString());
			if (i != arr.length - 1) {
				builder.append(" ");
			}
		}
		return builder.toString();
	}

	public static ArrayList<Integer> parseIntVector(String seqString) {
		ArrayList<String> list = parseStringVector(seqString);
		ArrayList<Integer> result = new ArrayList<Integer>();
		for (String s : list) {
			result.add(Integer.parseInt(s));
		}
		return result;
	}

	public static ArrayList<Double> parseDoubleVector(String seqString) {
		ArrayList<String> list = parseStringVector(seqString);
		ArrayList<Double> result = new ArrayList<Double>();
		for (String s : list) {
			result.add(Double.parseDouble(s));
		}
		return result;
	}

	public static ArrayList<Boolean> parseBooleanVector(String seqString) {
		ArrayList<String> list = parseStringVector(seqString);
		ArrayList<Boolean> result = new ArrayList<Boolean>();
		for (String s : list) {
			result.add(s.equals("true"));
		}
		return result;
	}

	public static ArrayList<ReadableObject> parseReadableObjectVector(
			String seqString, HashMap<String, ReadableObject> allObjects) {

		ArrayList<String> stringList = parseStringVector(seqString);

		ArrayList<ReadableObject> result = new ArrayList<ReadableObject>(
				stringList.size());

		for (String s : stringList) {
			ReadableObject go = allObjects.get(s);
			if (go != null) {
				result.add(go);
			}
		}

		return result;
	}

	public static <T extends ReadableObject> ArrayList<T> parseObjectVector(
			String seqString, HashMap<String, ReadableObject> allObjects,
			T[] typeArr) {
		ArrayList<T> result = new ArrayList<T>();
		ArrayList<String> stringList = parseStringVector(seqString);
		for (String s : stringList) {
			T object = (T) allObjects.get(s);
			if (object != null) {
				result.add(object);
			}
		}
		return result;
	}

	public static <T> ArrayList<T> parseEnumVector(String seqString, T[] typeArr) {
		ArrayList<T> result = new ArrayList<T>();
		Class<?> theClass = typeArr.getClass().getComponentType();
		if (theClass.isEnum()) {
			List<?> list = Arrays.asList(theClass.getEnumConstants());

			// println("enum constants: " + list);
			ArrayList<String> stringList = parseStringVector(seqString);
			for (String s : stringList) {
				for (Object enumConstant : list) {
					if (enumConstant.toString().equals((String) s)) {
						result.add((T) enumConstant);
						break;
					}
				}
			}
		}
		return result;
	}

	static LinkedHashMap<Class<?>, LinkedHashMap<String, Object>> enumStringMaps;

	private static void createEnumMapIfNeccessary(Class<?> enumClass) {
		if (enumStringMaps == null) {
			enumStringMaps = new LinkedHashMap<Class<?>, LinkedHashMap<String, Object>>();
		}
		LinkedHashMap<String, Object> enumMap = enumStringMaps.get(enumClass);
		if (enumMap == null) {
			enumMap = new LinkedHashMap<String, Object>();
			enumStringMaps.put(enumClass, enumMap);
			List<?> list = Arrays.asList(enumClass.getEnumConstants());
			for (Object enumConstant : list) {
				String enumToString = enumConstant.toString();
				enumMap.put(enumToString, enumConstant);
			}
		}
	}
	
	public static Object parseEnum(String enumString, Class<?> enumClass) {
		createEnumMapIfNeccessary(enumClass);
		LinkedHashMap<String, Object> enumMap = enumStringMaps.get(enumClass);
		return enumMap.get(enumString);
	}
	
	public static LinkedHashMap<String, Object> getEnumMap(Class<?> enumClass) {
		createEnumMapIfNeccessary(enumClass);
		LinkedHashMap<String, Object> enumMap = enumStringMaps.get(enumClass);
		return enumMap;
	}

	public static ArrayList<String> parseStringVector(String seqString) {
		return parseStringVector(seqString, " ");
	}

	public static ArrayList<String> parseStringVector(String seqString,
			String delimiter) {

		ArrayList<String> result = new ArrayList<String>();

		if (seqString == null) {
			return result;
		}
		Scanner scanner = new Scanner(seqString);
		scanner.useDelimiter(delimiter);

		while (scanner.hasNext()) {
			result.add(scanner.next());
		}

		scanner.close();

		return result;
	}

	public static ArrayList<Float> parseFloatArr(String seqString) {

		ArrayList<Float> result = new ArrayList<Float>();

		if (seqString == null) {
			return result;
		}
		Scanner scanner = new Scanner(seqString);
		scanner.useDelimiter(" ");

		while (scanner.hasNext()) {
			String string = scanner.next();
			if (!string.isEmpty()) {
				try {
					float theFloat = Float.parseFloat(string);
					result.add(theFloat);
				} catch (NumberFormatException nfe) {
					break;
				}
			}
		}

		scanner.close();

		return result;
	}

	public static double[] parseDoubleArr(String seqString, int dim) {
		double[] result = new double[dim];

		Scanner scanner = new Scanner(seqString);
		scanner.useDelimiter(" ");

		int pos = 0;
		while (scanner.hasNext()) {
			String next = scanner.next();
			if (!next.isEmpty()) {
				result[pos] = Double.parseDouble(next);
				pos++;
			}
		}

		for (int i = pos; i < dim; i++) {
			result[pos] = 0.0;
		}

		scanner.close();

		return result;
	}

	public static int[] parseIntArr(String s) {
		ArrayList<String> list = parseStringVector(s);
		int[] result = new int[list.size()];
		int i = 0;
		for (String str : list) {
			result[i] = Integer.parseInt(str);
			i++;
		}
		return result;
	}

	public static int[][] parseIntIntArr(String s) {
		ArrayList<int[]> arrList = new ArrayList<int[]>();
		String[] arrayStrings = s.split(",");
		for (String as : arrayStrings) {
			String trim = as.trim();
			int[] arr = parseIntArr(trim);
			if (arr != null) {
				arrList.add(arr);
			}
		}
		return ArrayUtils.toIntIntArr(arrList);
	}

	public static double[][] parseDoubleDoubleArr(String s) {
		ArrayList<double[]> arrList = new ArrayList<double[]>();
		String[] arrayStrings = s.split(",");
		for (String as : arrayStrings) {
			String trim = as.trim();
			double[] arr = parseDoubleArr(trim);
			if (arr != null) {
				arrList.add(arr);
			}
		}
		return ArrayUtils.toDoubleDoubleArr(arrList);
	}

	public static double[] parseDoubleArr(String s) {
		ArrayList<String> list = parseStringVector(s);
		double[] result = new double[list.size()];
		int i = 0;
		for (String str : list) {
			result[i] = Double.parseDouble(str);
			i++;
		}
		return result;
	}

	public static boolean[] parseBooleanArr(String s) {
		ArrayList<String> list = parseStringVector(s);
		boolean[] result = new boolean[list.size()];
		int i = 0;
		for (String str : list) {
			result[i] = Boolean.parseBoolean(str);
			i++;
		}
		return result;
	}

	public static Object parseEnumArray(String enumArrString, Class<?> enumClass) {
		List<?> list = Arrays.asList(enumClass.getEnumConstants());
		ArrayList<String> stringList = ParseUtils
				.parseStringVector(enumArrString);
		Object newArray = Array.newInstance(enumClass, stringList.size());
		int index = 0;

		HashMap<String, Object> enumNames = new HashMap<String, Object>();
		for (Object enumConstant : list) {
			enumNames.put(enumConstant.toString(), enumConstant);
		}

		for (String s : stringList) {
			boolean wasSet = false;
			Object enumConstant = enumNames.get(s);
			if (enumConstant == null) {
				System.out.println(ParseUtils.class.getSimpleName()
						+ " could not find an enum constant " + s + " in type "
						+ enumClass);
			} else {
				Array.set(newArray, index, enumConstant);
			}
			index++;
		}
		return newArray;
	}

	public static Object parseObjectFromString(String string,
			Object targetClassInstance) {
		Class<?> targetClass = targetClassInstance.getClass();
		if (targetClassInstance instanceof Double) {
			return Double.parseDouble(string);
		} else if (targetClassInstance instanceof Integer) {
			return Integer.parseInt(string);
		} else if (targetClassInstance instanceof Boolean) {
			if (string.equals("true")) {
				return true;
			} else if (string.equals("false")) {
				return false;
			} else {
				return null;
			}
		} else if (targetClassInstance instanceof String) {
			return string;
		} else if (targetClass.isEnum()) {
			return parseEnum(string, targetClass);
		} else if (targetClassInstance instanceof int[]) {
			return parseIntArr(string);
		} else if (targetClassInstance instanceof double[]) {
			return parseDoubleArr(string);
		} else if (targetClassInstance instanceof boolean[]) {
			return parseBooleanArr(string);
		} else if (targetClassInstance instanceof int[][]) {
			return parseIntIntArr(string);
		} else if (targetClassInstance instanceof double[][]) {
			return parseDoubleDoubleArr(string);
		} else if (targetClass.isArray()) {
			Class<?> arrayType = targetClass.getComponentType();
			if (arrayType.isEnum()) {
				return parseEnumArray(string, arrayType);
			} else {
				System.out.println("ParseUtils was unable to parse " + string
						+ " when the target should be "
						+ targetClass.getSimpleName());
			}
		}
		return null;
	}

}
