package com.springworldgames.objectreader.common;

import java.util.ArrayList;

import com.springworldgames.objectreader.ReadableObject;


public class ReadableObjectWithPropertiesAndChildren extends
		ReadableObjectWithProperties {

	public ArrayList<ReadableObject> children = new ArrayList<ReadableObject>();

	protected <T extends ReadableObject> void addAllFromChildren(ArrayList<T> list) {
		for (ReadableObject go : children) {
			list.add((T) go);
		}
	}

	static protected <T extends ReadableObject> void addAllFromChildren(
			ArrayList<ReadableObject> children, ArrayList<T> list) {
		for (ReadableObject go : children) {
			list.add((T) go);
		}
	}
}
