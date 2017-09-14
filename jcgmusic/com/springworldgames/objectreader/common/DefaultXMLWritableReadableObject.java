package com.springworldgames.objectreader.common;

import java.io.Serializable;


public class DefaultXMLWritableReadableObject extends DefaultReadableObject {

	protected String getTagName() {
		return getClass().getSimpleName();
	}

	protected String getExtraAttributeString() {
		return "";
	}

	protected String getChildrenXML() {
		return "";
	}

	protected boolean toXMLHasChildren() {
		return false;
	}

	@Override
	public String toXML() {
		if (toXMLHasChildren()) {
			String tagName = getTagName();
			return "<" + tagName + " " + getExtraAttributeString() + " >\n"
					+ getChildrenXML() + "</" + tagName + ">\n";

		} else {
			return "<" + getTagName() + " " + getExtraAttributeString()
					+ " />\n";
		}
	}

	
	
}
