package com.springworldgames.objectreader.common;

public interface PropertyValidator {

	boolean valueOK(String property, Object value);
	String getReasonNotOK(String property, Object value);
}
