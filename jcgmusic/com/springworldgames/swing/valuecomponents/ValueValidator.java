package com.springworldgames.swing.valuecomponents;

public interface ValueValidator {

	public boolean validValue(Object value, StringBuilder errors, StringBuilder warnings);
}
