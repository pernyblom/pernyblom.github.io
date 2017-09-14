package com.springworldgames.objectreader.common;

public interface PropertyHolder {
	void setProperty(String name, Object value);
	void setPropertySubObject(String subObject, String name, Object value);

	Object getProperty(String name);

}
