package com.springworldgames.objectreader.common;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;

import com.springworldgames.objectreader.ReadableObject;
import com.springworldgames.objectreader.ObjectReader;


public class DefaultReadableObject implements ReadableObject, Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -1628694055052554721L;
	
	public String id;

	public static void println(String str) {
		System.out.println(str);
	}
	
	public static String toString(double[] values) {
		return Arrays.toString(values);
	}

	public static String toString(long[] values) {
		return Arrays.toString(values);
	}

	public static String toString(int[] values) {
		return Arrays.toString(values);
	}

	public static String toString(boolean[] values) {
		return Arrays.toString(values);
	}

	public static String toString(short[] values) {
		return Arrays.toString(values);
	}

	public static String toString(float[] values) {
		return Arrays.toString(values);
	}

	public static String toString(Object[] values) {
		return Arrays.toString(values);
	}

	public static String toString(double[][] values) {
		StringBuilder builder = new StringBuilder();
		for (int i=0; i<values.length; i++) {
			builder.append(toString(values[i]));
			builder.append("\n");
		}
		return builder.toString();
	}

	
//	@Override
//	public boolean canHandleFieldSetFor(String attrName) {
//		return false;
//	}

	@Override
	public Object getFieldProperty(String attrName) {
		return null;
	}

	@Override
	public String getId() {
		return id;
	}

	@Override
	public String idHint() {
		return null;
	}

	@Override
	public void init(HashMap<String, ReadableObject> allObjects,
			ObjectReader reader) throws Exception {
	}

	@Override
	public boolean instantiateChildren() {
		return true;
	}

//	@Override
//	public void setHandledField(String attrName, String value) {
//	}

	@Override
	public Object getProperty(String name) {
		return null;
	}

	@Override
	public void setProperty(String name, Object value) {
	}

	@Override
	public void setPropertySubObject(String subObject, String name, Object value) {
		setProperty(name, value);
	}

	@Override
	public String toXML() throws Exception {
		return "";
	}

	@Override
	public void clear() {
	}

	protected void clearAll(Collection<? extends ReadableObject> c) {
		if (c != null) {
			for (ReadableObject go : c) {
				if (go != this) {
					// No infinite recursion please :)
					go.clear();
				}
			}
		}
	}

	@Override
	public PropertyFieldAssociation getPropertyFieldAssociation() {
		return null;
	}

	
}
