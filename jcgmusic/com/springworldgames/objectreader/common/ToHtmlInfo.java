package com.springworldgames.objectreader.common;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;

import com.springworldgames.jcgmusic.ParseUtils;
import com.springworldgames.objectreader.ObjectReader;
import com.springworldgames.objectreader.ObjectReaderImp;
import com.springworldgames.objectreader.ReadableObject;

public class ToHtmlInfo extends DefaultXMLWritableReadableObject {

	public String className;
	
	public String defaultMapCssClass = "map";
	public String defaultReadableObjectCssClass = "readable_object";
	public String defaultListCssClass = "readable_object_list";
	public boolean alternatePropertyCssClass = true;
	public String propertyCssClass1 = "property_1";
	public String propertyCssClass2 = "property_2";
	
	public boolean showDefaultProperties = true;
	public String visibleProperties;
	public String hiddenProperties;

	public boolean showEllipsis = true;
	
	public LinkedHashMap<Class<?>, String> specificCssClasses = new LinkedHashMap<Class<?>, String>();
	
	
	LinkedHashSet<String> visiblePropertiesSet = new LinkedHashSet<String>();
	LinkedHashSet<String> hiddenPropertiesSet = new LinkedHashSet<String>();

	ReadableObject defaultObject;

	ObjectReaderImp reader;

	public void addHiddenProperty(String p) {
		hiddenPropertiesSet.add(p);
	}
	
	public LinkedHashSet<String> getHiddenPropertiesSet() {
		return hiddenPropertiesSet;
	}
	
	private void createDefaultObjectIfNecessary(ReadableObject object) {
		defaultObject = null;
		if (defaultObject == null && object != null) {
			try {
				defaultObject = object.getClass().newInstance();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	@Override
	public void init(HashMap<String, ReadableObject> allObjects,
			ObjectReader reader) throws Exception {
		this.reader = (ObjectReaderImp) reader;
		if (visibleProperties != null && !visibleProperties.isEmpty()) {
			ArrayList<String> list = ParseUtils.parseStringVector(
					visibleProperties, ",");
			for (String s : list) {
				visiblePropertiesSet.add(s.trim());
			}
		}
		if (hiddenProperties != null && !hiddenProperties.isEmpty()) {
			ArrayList<String> list = ParseUtils.parseStringVector(
					hiddenProperties, ",");
			for (String s : list) {
				hiddenPropertiesSet.add(s.trim());
			}
		}
	}

	public boolean showProperty(ReadableObject parentObject, String propertyName, Object propertyValue) {
		if (showDefaultProperties) {
			return visiblePropertiesSet.contains(propertyName)
					|| !hiddenPropertiesSet.contains(propertyName);
		} else {
			if (visiblePropertiesSet.contains(propertyName)) {
				return true;
			}
			if (hiddenPropertiesSet.contains(propertyName)) {
				return false;
			}

			// The most difficult case where we have to dig up an instance of
			// the class
			createDefaultObjectIfNecessary(parentObject);
			if (defaultObject != null) {
				PropertyFieldAssociation pfa = defaultObject
						.getPropertyFieldAssociation();
				if (pfa != null) {
					Object defaultObjectValue = pfa.getProperty(defaultObject,
							propertyName);
					return !CompareUtils.deepEquals(defaultObjectValue, propertyValue);
				}
			}
			return true;
		}
	}

	public String getPropertyCssClass(int count) {
		if (!alternatePropertyCssClass) {
			return propertyCssClass1;
		}
		if (count % 2 == 0) {
			return propertyCssClass1;
		} else {
			return propertyCssClass2;
		}
	}

}
