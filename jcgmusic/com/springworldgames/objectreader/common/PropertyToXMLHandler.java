package com.springworldgames.objectreader.common;

public interface PropertyToXMLHandler {

	void handleToXML(Object object, Object propertyValue,
			String propertyName, StringBuilder attributesBuilder, StringBuilder childrenBuilder);

}
