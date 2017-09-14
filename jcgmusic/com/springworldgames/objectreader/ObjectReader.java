package com.springworldgames.objectreader;

import java.util.HashMap;

import org.w3c.dom.Element;

public interface ObjectReader {

	public Class<?> getClassFromName(String className);

	public ReadableObject getSimpleInstance(Element element) throws Exception;

	public ReadableObject readAndCreateObject(Element element,
			HashMap<String, ReadableObject> allObjects) throws Exception;

	public void addPackageString(String s);
	public void addPackagesString(Class<?>... classes);

}
