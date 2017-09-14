package com.springworldgames.objectreader.common;

import java.util.LinkedHashMap;

public interface PropertyToXMLSchemaHandler {

	boolean handleToXMLSchema(String propertyName,
			StringBuilder attributesBuilder, StringBuilder elementBuilder,
			LinkedHashMap<Class<?>, String> classTypeNameMap,
			LinkedHashMap<Class<?>, String> classTypeMap);

}
