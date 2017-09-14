package com.springworldgames.objectreader.common;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.springworldgames.jcgmusic.ArrayUtils;
import com.springworldgames.objectreader.ReadableObject;

public class CompareUtils {

	public static boolean deepEquals(Object value1, Object value2) {
		if (value1 == value2) {
			return true;
		}
		if (value1 == null || value2 == null) {
			return false;
		}
		
		if (value1.getClass() == value2.getClass()) {
			if (value1 instanceof Double || value1 instanceof Integer
					|| value1 instanceof Boolean || value1 instanceof String) {
				return value1.equals(value2);
			} else if (value1.getClass().isEnum()) {
				// System.out.println(this + " comparing enums: " + value1 + " "
				// + value2);
				return value1 == value2;
			} else if (value1 instanceof List) {
				List list1 = (List) value1;
				List list2 = (List) value2;
				if (list1.size() == list2.size()) {
					Iterator iterator1 = list1.iterator();
					Iterator iterator2 = list2.iterator();
					while (iterator1.hasNext()) {
						Object o1 = iterator1.next();
						Object o2 = iterator2.next();
						boolean e = deepEquals(o1, o2);
						if (!e) {
							return false;
						}
					}
					// All values in the list were equal
					return true;
				}
			} else if (value1 instanceof ReadableObject) {
				ReadableObject readableObject1 = (ReadableObject) value1;
				ReadableObject readableObject2 = (ReadableObject) value2;
				PropertyFieldAssociation pfa = readableObject1
						.getPropertyFieldAssociation();
				ArrayList<String> allPropertyNames = pfa.getAllPropertyNames();
				for (String propName : allPropertyNames) {
					Object o1 = pfa.getProperty(readableObject1, propName);
					Object o2 = pfa.getProperty(readableObject2, propName);
					boolean e = deepEquals(o1, o2);
					if (!e) {
						return false;
					}
				}
				return true;
			} else if (value1 instanceof int[]) {
				int[] arr1 = (int[]) value1;
				int[] arr2 = (int[]) value2;
				return ArrayUtils.equals(arr1, arr2);
			} else if (value1 instanceof double[]) {
				double[] arr1 = (double[]) value1;
				double[] arr2 = (double[]) value2;
				return ArrayUtils.equals(arr1, arr2);
			} else if (value1 instanceof double[][]) {
				double[][] arr1 = (double[][]) value1;
				double[][] arr2 = (double[][]) value2;
				return ArrayUtils.equals(arr1, arr2);
			} else if (value1 instanceof int[][]) {
				int[][] arr1 = (int[][]) value1;
				int[][] arr2 = (int[][]) value2;
				return ArrayUtils.equals(arr1, arr2);
			} else if (value1.getClass().isArray()) {
				Class<? extends Object> valueClass = value1.getClass();
				Class<?> componentType = valueClass.getComponentType();
				if (componentType.isEnum()) {
					int length = Array.getLength(value1);
					if (length == Array.getLength(value2)) {
						for (int i=0; i<length; i++) {
							if (Array.get(value1, i) != Array.get(value2, i)) {
								return false;
							}
						}
						return true;
					} else {
						return false;
					}
				} else {
					System.out.println(CompareUtils.class.getSimpleName() + " can not compare a "
							+ value1.getClass().getSimpleName());
				}
			} else {
				System.out.println(CompareUtils.class.getSimpleName() + " can not compare a "
						+ value1.getClass().getSimpleName());
			}
		} else {
			return false;
		}
		return false;
	}

}
