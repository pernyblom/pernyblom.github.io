package com.springworldgames.objectreader.common;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Set;

import org.w3c.dom.Element;

import com.springworldgames.jcgmusic.ParseUtils;
import com.springworldgames.jcgmusic.XMLUtils;
import com.springworldgames.objectreader.ReadableObject;

public class ValidatedProperties {

	LinkedHashMap<String, PropertyToXMLHandler> propertyToXMLHandlerMap = new LinkedHashMap<String, PropertyToXMLHandler>();
	LinkedHashMap<String, PropertyToXMLSchemaHandler> propertyToXMLSchemaHandlerMap = new LinkedHashMap<String, PropertyToXMLSchemaHandler>();

	
	LinkedHashMap<String, String> groupNames = new LinkedHashMap<String, String>();

	// If the property should be enclosed by a tag, this is where you find the
	// names of the tags.
	// Can be used with lists, Strings, GameObjects and certainly more in the
	// future
	LinkedHashMap<String, String> propertyTags = new LinkedHashMap<String, String>();

	LinkedHashSetMultiMap<String, Class<?>> listClasses = new LinkedHashSetMultiMap<String, Class<?>>();

	LinkedHashMap<String, Integer> arrayMinArities = new LinkedHashMap<String, Integer>();
	LinkedHashMap<String, Integer> arrayMaxArities = new LinkedHashMap<String, Integer>();

	LinkedHashMap<String, Integer> intArrayMaxs = new LinkedHashMap<String, Integer>();
	LinkedHashMap<String, Integer> intArrayMins = new LinkedHashMap<String, Integer>();

	LinkedHashMap<String, Double> doubleArrayMaxs = new LinkedHashMap<String, Double>();
	LinkedHashMap<String, Double> doubleArrayMins = new LinkedHashMap<String, Double>();

	LinkedHashMap<String, Integer> intMaxs = new LinkedHashMap<String, Integer>();
	LinkedHashMap<String, Integer> intMins = new LinkedHashMap<String, Integer>();

	LinkedHashMap<String, Double> doubleMaxs = new LinkedHashMap<String, Double>();
	LinkedHashMap<String, Double> doubleMins = new LinkedHashMap<String, Double>();

	LinkedHashMap<String, Boolean> tryToParseMap = new LinkedHashMap<String, Boolean>();

	LinkedHashMap<String, PropertyValidator> validators = new LinkedHashMap<String, PropertyValidator>();

	LinkedHashSetMultiMap<String, Object> enumerables = new LinkedHashSetMultiMap<String, Object>();

	ArrayList<String> orderedProperties = new ArrayList<String>();

	LinkedHashMap<String, Object> propertyValueMap = new LinkedHashMap<String, Object>();

	public PropertyToXMLHandler getToXMLHandler(String name) {
		return propertyToXMLHandlerMap.get(name);
	}

	public PropertyToXMLSchemaHandler getToXMLSchemaHandler(String name) {
		return propertyToXMLSchemaHandlerMap.get(name);
	}

	public String toXML() {
		StringBuilder builder = new StringBuilder();
		builder.append("<" + getClass().getSimpleName() + ">\n");
		for (String name : orderedProperties) {
			builder.append("  <property_info "); // Start of property_info
			XMLUtils.getStringAttributeString(name, "name", builder);

			getXMLIntAttributeString("array_min_arity", arrayMinArities
					.get(name), builder);
			getXMLIntAttributeString("array_max_arity", arrayMaxArities
					.get(name), builder);

			getXMLIntAttributeString("int_array_max_value", intArrayMins
					.get(name), builder);
			getXMLIntAttributeString("int_array_min_value", intArrayMaxs
					.get(name), builder);

			getXMLDoubleAttributeString("double_array_max_value",
					doubleArrayMins.get(name), builder);
			getXMLDoubleAttributeString("double_array_min_value",
					doubleArrayMaxs.get(name), builder);

			getXMLIntAttributeString("int_min_value", intMins.get(name),
					builder);
			getXMLIntAttributeString("int_max_value", intMaxs.get(name),
					builder);

			getXMLDoubleAttributeString("double_min_value", doubleMins
					.get(name), builder);
			getXMLDoubleAttributeString("double_max_value", doubleMaxs
					.get(name), builder);

			Object value = propertyValueMap.get(name);
			if (value != null) {
				XMLUtils.getStringAttributeString(value.toString(), "value",
						builder);
				String typeString = "String";
				if (value instanceof Double) {
					typeString = "Double";
				} else if (value instanceof Integer) {
					typeString = "Integer";
				} else if (value instanceof Boolean) {
					typeString = "Boolean";
				} else if (value instanceof double[]) {
					typeString = "double[]";
				} else if (value instanceof int[]) {
					typeString = "int[]";
				}
				XMLUtils.getStringAttributeString(typeString, "type", builder);
			}
			builder.append(">\n"); // End of property_info
		}
		builder.append("</" + getClass().getSimpleName() + ">\n");

		return builder.toString();
	}

	public void setFromInputStream(InputStream is) throws Exception {
		Element root = XMLUtils.parseAndGetElement(is);
		setFromElement(root);
	}

	public void setFromElement(Element root) {
		ArrayList<Element> list = XMLUtils.getChildrenElements(root);
		for (Element e : list) {
			String nameString = e.getAttribute("name");
			String valueString = e.getAttribute("value");
			String typeString = e.getAttribute("type");
			setPropertyFromString(nameString, valueString, typeString);
		}
	}

	public void setPropertyFromString(String name, String valueString,
			String typeString) {
		if (!valueString.isEmpty() && !typeString.isEmpty()) {
			if (typeString.equals("Integer")) {
				propertyValueMap.put(name, Integer.parseInt(valueString));
			} else if (typeString.equals("Double")) {
				propertyValueMap.put(name, Double.parseDouble(valueString));
			} else if (typeString.equals("Boolean")) {
				propertyValueMap.put(name, Boolean.parseBoolean(valueString));
			} else if (typeString.equals("double[]")) {
				propertyValueMap.put(name, ParseUtils
						.parseDoubleArr(valueString));
			} else if (typeString.equals("int[]")) {
				propertyValueMap.put(name, ParseUtils.parseIntArr(valueString));
			}
		}
	}

	public static Object getValueFromString(PropertyHolder object,
			String propertyName, String valueString) {
		Object value = object.getProperty(propertyName);
		Object newValue = null;
		if (value instanceof Integer) {
			newValue = Integer.parseInt(valueString);
		} else if (value instanceof String) {
			newValue = valueString;
		} else if (value instanceof Double) {
			newValue = Double.parseDouble(valueString);
		} else if (value instanceof Boolean) {
			newValue = Boolean.parseBoolean(valueString);
		} else if (value instanceof double[]) {
			newValue = ParseUtils.parseDoubleArr(valueString);
		} else if (value instanceof int[]) {
			newValue = ParseUtils.parseIntArr(valueString);
		} else if (value != null && value.getClass().isEnum()) {
			newValue = ParseUtils.parseEnum(valueString, value.getClass());
		} else {
			System.out.println(ValidatedProperties.class
					+ " can not handle getValueFromString() for property: "
					+ propertyName + " with current value: " + value
					+ " valueString: " + valueString);
		}
		return newValue;
	}

	public static void setPropertyFromString(PropertyHolder object,
			String propertyName, String valueString) throws Exception {
		Object newValue = getValueFromString(object, propertyName, valueString);
		if (newValue != null) {
			object.setProperty(propertyName, newValue);
		}
	}

	// Avoids setDirty() calls in the object
	public static void setPropertyFromStringWithPFA(ReadableObject object,
			String propertyName, String valueString) throws Exception {
		Object newValue = getValueFromString(object, propertyName, valueString);
		if (newValue != null) {
			PropertyFieldAssociation pfa = object.getPropertyFieldAssociation();
			pfa.setProperty(object, propertyName, newValue);
		}
	}

	public void setIntFromAttribute(LinkedHashMap<String, Integer> map,
			String name, String attrValueString) {

	}

	void getXMLIntAttributeString(String attrName, Integer value,
			StringBuilder builder) {
		if (value != null) {
			XMLUtils.getIntAttributeString(value, attrName, builder);
		}
	}

	void getXMLDoubleAttributeString(String attrName, Double value,
			StringBuilder builder) {
		if (value != null) {
			XMLUtils.getDoubleAttributeString(value, attrName, builder);
		}
	}

	void getXMLBooleanAttributeString(String attrName, Boolean value,
			StringBuilder builder) {
		if (value != null) {
			XMLUtils.getBooleanAttributeString(value, attrName, builder);
		}
	}

	public Object getPropertyValue(String propName) {
		return propertyValueMap.get(propName);
	}

	public void setAllPropertiesTryToParseText(boolean p) {
		for (String s : orderedProperties) {
			setPropertyTryToParseText(s, p);
		}
	}

	public boolean getPropertyTryToParseText(String name) {
		Boolean result = tryToParseMap.get(name);
		if (result != null) {
			return result;
		}
		return false;
	}

	public void setPropertyTryToParseText(String name, boolean p) {
		tryToParseMap.put(name, p);
	}

	public void setPropertyValueFromString(String propName, String stringValue) {
		Object currentValue = propertyValueMap.get(propName);
		if (currentValue == null) {
			// Just assume that it is a string then
			setPropertyValue(propName, stringValue);
		} else {
			if (currentValue instanceof Double) {
				setPropertyValue(propName, Double.parseDouble(stringValue));
			} else if (currentValue instanceof Integer) {
				setPropertyValue(propName, Integer.parseInt(stringValue));
			} else if (currentValue instanceof double[]) {
				setPropertyValue(propName, ParseUtils
						.parseDoubleArr(stringValue));
			} else if (currentValue instanceof int[]) {
				setPropertyValue(propName, ParseUtils.parseIntArr(stringValue));
			} else {
				setPropertyValue(propName, stringValue);
			}
		}
	}

	public void setPropertyValue(String propName, Object value) {
		propertyValueMap.put(propName, value);
		if (!orderedProperties.contains(propName)) {
			orderedProperties.add(propName);
		}
	}

	public void setPropertyValidator(String propName,
			PropertyValidator validator) {
		validators.put(propName, validator);
	}

	public PropertyValidator getValidator(String propName) {
		return validators.get(propName);
	}

	public boolean valueOK(String propName, Object value) {
		return valueOK(propName, value, null);
	}

	public boolean valueOK(String propName, Object value,
			StringBuilder resultInfo) {
		PropertyValidator validator = validators.get(propName);
		if (validator != null) {
			boolean result = validator.valueOK(propName, value);
			if (!result && resultInfo != null) {
				resultInfo.append(validator.getReasonNotOK(propName, value));
			}
			return result;
		} else {
			if (value instanceof Integer) {
				Integer max = intMaxs.get(propName);
				Integer min = intMins.get(propName);
				Integer intValue = (Integer) value;
				if (max != null && intValue > max) {
					if (resultInfo != null) {
						resultInfo.append("Integer out of bounds. Max: " + max
								+ " Current: " + intValue);
					}
					return false;
				}
				if (min != null && intValue < min) {
					if (resultInfo != null) {
						resultInfo.append("Integer out of bounds. Min: " + min
								+ " Current: " + intValue);
					}
					return false;
				}
			} else if (value instanceof Double) {
				Double max = doubleMaxs.get(propName);
				Double min = doubleMins.get(propName);
				Double doubleValue = (Double) value;
				if (max != null && doubleValue > max) {
					if (resultInfo != null) {
						resultInfo.append("Double out of bounds. Max: " + max
								+ " Current: " + doubleValue);
					}
					return false;
				}
				if (min != null && doubleValue < min) {
					if (resultInfo != null) {
						resultInfo.append("Double out of bounds. Min: " + min
								+ " Current: " + doubleValue);
					}
					return false;
				}
			} else if (value instanceof double[]) {
				Double max = doubleArrayMaxs.get(propName);
				Double min = doubleArrayMins.get(propName);
				double[] arr = (double[]) value;
				for (double v : arr) {
					if (min != null && v < min) {
						return false;
					}
					if (max != null && v > max) {
						return false;
					}
				}
				Integer minArity = arrayMinArities.get(propName);
				Integer maxArity = arrayMaxArities.get(propName);
				if (minArity != null && arr.length < minArity) {
					return false;
				}
				if (maxArity != null && arr.length > maxArity) {
					return false;
				}
			} else if (value instanceof int[]) {
				Integer max = intArrayMaxs.get(propName);
				Integer min = intArrayMins.get(propName);
				int[] arr = (int[]) value;
				for (int v : arr) {
					if (min != null && v < min) {
						return false;
					}
					if (max != null && v > max) {
						return false;
					}
				}
				Integer minArity = arrayMinArities.get(propName);
				Integer maxArity = arrayMaxArities.get(propName);
				if (minArity != null && arr.length < minArity) {
					return false;
				}
				if (maxArity != null && arr.length > maxArity) {
					return false;
				}

			}
		}
		return true;
	}

	public int getArrayPropertyMinArity(String name) {
		Integer result = arrayMinArities.get(name);
		if (result == null) {
			return 0;
		}
		return result;
	}

	public int getArrayPropertyMaxArity(String name) {
		Integer result = arrayMaxArities.get(name);
		if (result == null) {
			return Integer.MAX_VALUE;
		}
		return result;
	}

	public int getIntPropertyMaxValue(String name) {
		Integer result = intMaxs.get(name);
		if (result == null) {
			return Integer.MAX_VALUE;
		}
		return result;
	}

	public int getIntPropertyMinValue(String name) {
		Integer result = intMins.get(name);
		if (result == null) {
			return Integer.MIN_VALUE;
		}
		return result;
	}

	public double getDoublePropertyMinValue(String name) {
		Double result = doubleMins.get(name);
		if (result == null) {
			return Double.NEGATIVE_INFINITY;
		}
		return result;
	}

	public double getDoublePropertyMaxValue(String name) {
		Double result = doubleMaxs.get(name);
		if (result == null) {
			return Double.POSITIVE_INFINITY;
		}
		return result;
	}

	public void setArrayPropertyMinMaxArity(String name, int minArity,
			int maxArity) {
		boolean changed = false;
		Integer prevMinArity = arrayMinArities.get(name);
		if (prevMinArity == null || minArity != prevMinArity) {
			changed = true;
		}
		Integer prevMaxArity = arrayMaxArities.get(name);
		if (prevMaxArity == null || maxArity != prevMaxArity) {
			changed = true;
		}
		arrayMinArities.put(name, minArity);
		arrayMaxArities.put(name, maxArity);
		if (changed) {
			informAllListeners();
		}
	}

	public void setArrayPropertyMinArity(String name, int arity) {
		arrayMinArities.put(name, arity);
		informAllListeners();
	}

	public void setArrayPropertyMaxArity(String name, int arity) {
		arrayMaxArities.put(name, arity);
		informAllListeners();
	}

	public void setIntPropertyMax(String string, int maxValue) {
		intMaxs.put(string, maxValue);
		informAllListeners();
	}

	public void setIntPropertyMin(String string, int minValue) {
		intMins.put(string, minValue);
		informAllListeners();
	}

	public void setIntPropertyMinMax(String string, int minValue, int maxValue) {
		intMins.put(string, minValue);
		intMaxs.put(string, maxValue);
		informAllListeners();
	}

	public void setDoublePropertyMinMax(String string, double minValue,
			double maxValue) {
		doubleMins.put(string, minValue);
		doubleMaxs.put(string, maxValue);
		informAllListeners();
	}

	public void setDoublePropertyMin(String string, double minValue) {
		doubleMins.put(string, minValue);
		informAllListeners();
	}

	public void setDoublePropertyMax(String string, double maxValue) {
		doubleMaxs.put(string, maxValue);
		informAllListeners();
	}

	public void setIntArrayPropertyMaxValue(String string, int i) {
		intArrayMaxs.put(string, i);
		informAllListeners();
	}

	public void setIntArrayPropertyMinValue(String string, int i) {
		intArrayMins.put(string, i);
		informAllListeners();
	}

	public void setDoubleArrayPropertyMaxValue(String string, double i) {
		doubleArrayMaxs.put(string, i);
		informAllListeners();
	}

	public void setDoubleArrayPropertyMinValue(String string, double i) {
		doubleArrayMins.put(string, i);
		informAllListeners();
	}

	public boolean isPropertyEnumerable(String name) {
		return enumerables.get(name) != null;
	}

	public Collection<Object> getEnumerables(String name) {
		return enumerables.get(name);
	}

	public void addEnumerable(String name, Object value) {
		enumerables.add(name, value);
	}

	public void addEnumerables(String name, Object[] values) {
		for (Object o : values) {
			enumerables.add(name, o);
		}
	}

	public void setEnumerables(String name, Object[] values) {
		enumerables.remove(name);
		for (Object o : values) {
			enumerables.add(name, o);
		}
		informAllListeners();
	}

	public void setEnumerables(String name, Collection<? extends Object> values) {
		enumerables.remove(name);
		for (Object o : values) {
			enumerables.add(name, o);
		}
		informAllListeners();
	}

	public void setMultipleEnumerablesIfNecessary(String prefix,
			int nrProperties, int maxProperties,
			Collection<? extends Object> values) {
		setMultipleEnumerablesIfNecessary(prefix, nrProperties, maxProperties,
				values, null);
	}

	public void setMultipleEnumerablesIfNecessary(String prefix,
			int nrProperties, int maxProperties,
			Collection<? extends Object> values, PropertyHolder object) {
		for (int i = 1; i <= nrProperties; i++) {
			String name = prefix + i;
			setEnumerablesIfNecessary(name, values, object);
		}
	}

	public void setEnumerablesIfNecessary(String name,
			Collection<? extends Object> values) {
		setEnumerablesIfNecessary(name, values, null);
	}

	public void setEnumerablesIfNecessary(String name,
			Collection<? extends Object> values, PropertyHolder object) {
		boolean dirty = false;
		LinkedHashSet<Object> currentValues = enumerables.get(name);

		for (Object o : values) {
			if (currentValues == null || !currentValues.contains(o)) {
				// System.out.println(this + " adding enumerable: " + o);
				enumerables.add(name, o);
				dirty = true;
			}
		}

		if (currentValues != null) {
			ArrayList<Object> toRemove = new ArrayList<Object>();
			for (Object o : currentValues) {
				if (!values.contains(o)) {
					toRemove.add(o);
					dirty = true;
				}
			}
			// System.out.println(this + " removing " + toRemove + " " + values
			// + " " + currentValues);
			currentValues.removeAll(toRemove);
		}

		if (object != null) {
			// Check if the object has a valid value
			currentValues = enumerables.get(name);
			Object currentValue = object.getProperty(name);
			if (currentValues != null && !currentValues.contains(currentValue)
					&& currentValues.size() > 0) {
				Object defaultValue = currentValues.iterator().next();
				object.setProperty(name, defaultValue);
				// System.out.println(this + " setting " + name + " of object "
				// + object + " to " + defaultValue);
			}
		}

		if (dirty) {
			informAllListeners();
		}
	}

	public ArrayList<String> getAllPropertyNames() {
		return orderedProperties;
	}

	protected void informAllListeners() {
	}

	public void removeEnumerables(String name) {
		if (enumerables.get(name) != null) {
			enumerables.remove(name);
			informAllListeners();
		}
	}

	public void addListClasses(String property, Class<?>... classes) {
		listClasses.addAll(property, classes);
	}

	public LinkedHashSet<Class<?>> getListClasses(String property) {
		return listClasses.get(property);
	}

	public Set<String> getListPropertyNames() {
		return listClasses.keySet();
	}
	
	
	
	public void setPropertyTag(String property, String tagName) {
		propertyTags.put(property, tagName);
	}

	public String getPropertyTag(String property) {
		return propertyTags.get(property);
	}

	public void addPropertyToXMLHandler(String propName,
			PropertyToXMLHandler handler) {
		propertyToXMLHandlerMap.put(propName, handler);
	}

	public void addPropertyToXMLSchemaHandler(String propName,
			PropertyToXMLSchemaHandler handler) {
		propertyToXMLSchemaHandlerMap.put(propName, handler);
	}

	public void setPropertyNamesForGroup(String groupName, String... propertyNames) {
		for (String propName : propertyNames) {
			groupNames.put(propName, groupName);
		}
	}
	
	public void setGroupName(String propName, String groupName) {
		groupNames.put(propName, groupName);
	}
	
	public String getGroupName(String propName) {
		return groupNames.get(propName);
	}
}
