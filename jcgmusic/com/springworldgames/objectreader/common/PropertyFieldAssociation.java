package com.springworldgames.objectreader.common;

import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;

import com.springworldgames.jcgmusic.ArrayUtils;
import com.springworldgames.jcgmusic.ParseUtils;
import com.springworldgames.jcgmusic.XMLUtils;
import com.springworldgames.objectreader.ReadableObject;

//A reflection orgy
public class PropertyFieldAssociation extends ValidatedProperties {

	LinkedHashMap<String, String> propertyFieldMap = new LinkedHashMap<String, String>();
	LinkedHashMap<String, String> fieldPropertyMap = new LinkedHashMap<String, String>();

	ArrayList<PropertyFieldAssociationListener> listeners = new ArrayList<PropertyFieldAssociationListener>();
	LinkedHashSet<String> indirectProperties = new LinkedHashSet<String>();

	// LinkedHashMap<String, IndirectPropertyType> indirectPropertyTypes = new
	// LinkedHashMap<String, IndirectPropertyType>();

	@Override
	protected void informAllListeners() {
		for (PropertyFieldAssociationListener l : listeners) {
			l.propertyFieldAssociationChanged(this);
		}
	}

	public void addChangeListener(PropertyFieldAssociationListener l) {
		if (!listeners.contains(l)) {
			listeners.add(l);
		}
	}

	public void removeChangeListener(PropertyFieldAssociationListener l) {
		listeners.remove(l);
	}

	public boolean hasProperty(String propName) {
		return propertyFieldMap.containsKey(propName);
	}

	public PropertyFieldAssociation addAssociation(String propName,
			String fieldName, String groupName) {
		addAssociation(propName, fieldName);
		setGroupName(propName, groupName);
		return this;
	}
	
	public PropertyFieldAssociation addAssociation(String propName,
			String fieldName) {
		propertyFieldMap.put(propName, fieldName);
		fieldPropertyMap.put(fieldName, propName);
		orderedProperties.add(propName);
		informAllListeners();
		return this;
	}

	public PropertyFieldAssociation addAssociationAndValue(String propName,
			String fieldName, Object value) {
		propertyValueMap.put(propName, value);
		return addAssociation(propName, fieldName);
	}

	public PropertyFieldAssociation addAssociationAndValues(String propName,
			String fieldName, Object[] possibleValues, Object startValue) {
		propertyValueMap.put(propName, startValue);
		addEnumerables(propName, possibleValues);
		return addAssociation(propName, fieldName);
	}

	public PropertyFieldAssociation setAssociationAndValues(String propName,
			String fieldName, Object[] possibleValues) {
		Object previousValue = propertyValueMap.get(propName);
		if (previousValue == null
				|| !ArrayUtils.contains(possibleValues, previousValue)) {
			propertyValueMap.put(propName, possibleValues[0]);
		}
		setEnumerables(propName, possibleValues);
		return setAssociation(propName, fieldName);
	}

	public PropertyFieldAssociation addIntAssociationMinMax(String propName,
			String fieldName, int min, int max) {
		setIntPropertyMinMax(propName, min, max);
		addAssociation(propName, fieldName);
		return this;
	}

	public PropertyFieldAssociation addIntAssociationMin(String propName,
			String fieldName, int min) {
		setIntPropertyMin(propName, min);
		addAssociation(propName, fieldName);
		return this;
	}

	public PropertyFieldAssociation addDoubleAssociationMinMax(String propName,
			String fieldName, double min, double max) {
		setDoublePropertyMinMax(propName, min, max);
		addAssociation(propName, fieldName);
		return this;
	}

	public PropertyFieldAssociation addDoubleAssociationMin(String propName,
			String fieldName, double min) {
		setDoublePropertyMin(propName, min);
		addAssociation(propName, fieldName);
		return this;
	}

	public PropertyFieldAssociation addAssociationIfNecessary(String propName,
			String fieldName) {
		String existingFieldName = propertyFieldMap.get(propName);
		if (!fieldName.equals(existingFieldName)) {
			addAssociation(propName, fieldName);
		}
		return this;
	}

	public PropertyFieldAssociation setAssociation(String propName,
			String fieldName) {
		propertyFieldMap.put(propName, fieldName);
		fieldPropertyMap.put(fieldName, propName);
		if (!orderedProperties.contains(propName)) {
			orderedProperties.add(propName);
			informAllListeners();
		}
		return this;
	}

	public PropertyFieldAssociation setOrRemoveAssociation(boolean set,
			String propName, String fieldName) {
		if (set) {
			setAssociation(propName, fieldName);
		} else {
			removeProperty(propName);
		}
		return this;
	}

	public PropertyFieldAssociation setOrRemoveAssociation(boolean set,
			String propName, String fieldName, Object[] values) {
		if (set) {
			setAssociation(propName, fieldName);
			LinkedHashSet<Object> enumSet = enumerables.get(propName);
			if (enumSet == null || enumSet.size() != values.length) {
				setEnumerables(propName, values);
			}
		} else {
			removeProperty(propName);
		}
		return this;
	}

	public void removeProperty(String s) {
		String fieldName = propertyFieldMap.get(s);
		if (fieldName != null) {
			fieldPropertyMap.remove(fieldName);
			propertyFieldMap.remove(s);
			orderedProperties.remove(s);
			arrayMinArities.remove(s);
			arrayMaxArities.remove(s);
			enumerables.remove(s);
			indirectProperties.remove(s);
			informAllListeners();
		}
	}

	public void removeAssociationsStartsWith(String string) {
		ArrayList<String> toRemove = new ArrayList<String>();
		for (String s : propertyFieldMap.keySet()) {
			if (s.startsWith(string)) {
				toRemove.add(s);
			}
		}
		for (String s : toRemove) {
			removeProperty(s);
		}
	}

	public String[] getPropertyNames() {
		return orderedProperties.toArray(new String[] {});
	}

	public String getPropertyFieldName(String propName) {
		return propertyFieldMap.get(propName);
	}

	public Object getFieldProperty(String fieldName) {
		String propName = fieldPropertyMap.get(fieldName);
		if (propName == null) {
			return null;
		}
		return propertyValueMap.get(propName);
	}

	public Object getProperty(ReadableObject o, String propName) {
		try {
			String fieldName = propertyFieldMap.get(propName);

			if (fieldName == null) {
				System.out.println(this + " could not find field for property "
						+ propName + " in object " + o);
			}
			if (propertyValueMap.containsKey(propName)) {
				return propertyValueMap.get(propName);
				// } else if (o.canHandleFieldSetFor(fieldName)) {
				// return o.getProperty(fieldName);
			} else {
				Field field = o.getClass().getField(fieldName);
				if (field == null) {
					System.out.println(this
							+ " could not find the field for the property "
							+ propName + " map: " + propertyFieldMap
							+ " holder: " + o);
				}
				return field.get(o);
			}
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (NoSuchFieldException e) {
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		}
		return null;
	}

	// Assumes that the property field is a list
	@SuppressWarnings("unchecked")
	public void addProperty(ReadableObject targetObject, String listPropName,
			Object value) throws Exception {
		String fieldName = propertyFieldMap.get(listPropName);
		if (fieldName == null) {
			throw new NullPointerException(
					"Could not find the field for property " + listPropName);
		}
		Field field = targetObject.getClass().getField(fieldName);
		Object previousValue = field.get(targetObject);
		if (previousValue instanceof List) {
			List list = (List) previousValue;
			list.add(value);
		}
	}

	public void setProperty(ReadableObject targetObject, String propName,
			Object value) {
		try {
			Object handledValue = propertyValueMap.get(propName);
			if (handledValue != null) {
				propertyValueMap.put(propName, value);
			} else {
				String fieldName = propertyFieldMap.get(propName);
				// if (targetObject.canHandleFieldSetFor(fieldName)) {
				// targetObject.setHandledField(fieldName, value.toString());
				// } else {
				Class<? extends ReadableObject> targetClass = targetObject
						.getClass();
				String setMethodName = "set"
						+ Character.toUpperCase(fieldName.charAt(0))
						+ fieldName.substring(1);
				boolean foundMethod = false;
				try {

					Class<?> realClass = value.getClass();
					if (value instanceof Double) {
						realClass = double.class;
					} else if (value instanceof Float) {
						realClass = float.class;
					} else if (value instanceof Integer) {
						realClass = int.class;
					} else if (value instanceof Boolean) {
						realClass = boolean.class;
					}

					Method method = targetClass.getMethod(setMethodName,
							realClass);
					// System.out.println(this + " found method "
					// + setMethodName);
					try {
						method.invoke(targetObject, value);
						foundMethod = true;
					} catch (InvocationTargetException e) {
						e.printStackTrace();
					}
				} catch (NoSuchMethodException e) {
					// System.out.println(this + " could not find method "
					// + setMethodName);
				}
				if (!foundMethod) {
					Field field = targetObject.getClass().getField(fieldName);
					field.set(targetObject, value);
				}
			}
			// }
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (NoSuchFieldException e) {
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (NullPointerException e) {
			System.out.println(this + " problem when setting property "
					+ propName + " holder: " + targetObject + " value: "
					+ value);
			e.printStackTrace();
		}
	}

	public static String[][] getDefaultAssociations(String... strings) {
		String[][] result = new String[strings.length][2];
		for (int i = 0; i < strings.length; i++) {
			String s = strings[i];
			result[i] = new String[] { s, s };
		}
		return result;
	}

	public PropertyFieldAssociation addDefaultAssociations(String... strings) {
		String[][] associations = getDefaultAssociations(strings);
		for (int i = 0; i < associations.length; i++) {
			addAssociation(associations[i][0], associations[i][1]);
		}
		return this;
	}

	public void setIndirectProperty(String name, boolean indirect) {
		if (indirect) {
			indirectProperties.add(name);
		} else {
			indirectProperties.remove(name);
			// indirectPropertyTypes.remove(name);
		}
	}

	// public void setIndirectPropertyType(String name, IndirectPropertyType
	// type) {
	// indirectPropertyTypes.put(name, type);
	// if (!isPropertyIndirect(name)) {
	// setIndirectProperty(name, true);
	// }
	// }
	//
	// public Set<String> getIndirectPropertyTypePropertyNames() {
	// return indirectPropertyTypes.keySet();
	// }
	//
	// public IndirectPropertyType getIndirectPropertyType(String name) {
	// return indirectPropertyTypes.get(name);
	// }

	public boolean isPropertyIndirect(String name) {
		return indirectProperties.contains(name);
	}

	public void setOrRemoveMultipleAssociations(String propertyPrefix,
			String fieldPrefix, int nrValues, int maxValues) {
		for (int i = 1; i <= maxValues; i++) {
			setOrRemoveAssociation(nrValues >= i, propertyPrefix + i,
					fieldPrefix + i);
		}
	}

	public void setOrRemoveMultipleAssociationsInterleaved(
			String[] propertyPrefixes, String[] fieldPrefixes, int[] nrValues,
			int maxValues) {
		for (int i = 1; i <= maxValues; i++) {
			for (int j = 0; j < propertyPrefixes.length; j++) {
				setOrRemoveAssociation(nrValues[j] >= i, propertyPrefixes[j]
						+ i, fieldPrefixes[j] + i);
			}
		}
	}

	public void setOrRemoveMultipleAssociations(boolean set,
			String propertyPrefix, String fieldPrefix, int nrValues,
			int maxValues) {
		for (int i = 1; i <= maxValues; i++) {
			setOrRemoveAssociation(set && nrValues >= i, propertyPrefix + i,
					fieldPrefix + i);
		}
	}

	public <T> void setOrRemoveMultipleAssociations(boolean set,
			String propertyPrefix, String fieldPrefix, int nrValues,
			int maxValues, ArrayList<T> listWithNotNulls,
			PropertyValidator validator, ReadableObject object) {
		listWithNotNulls.clear();
		for (int i = 1; i <= maxValues; i++) {
			boolean doSet = set && nrValues >= i;
			String propName = propertyPrefix + i;
			setOrRemoveAssociation(doSet, propName, fieldPrefix + i);
			if (doSet) {
				Object value = getProperty(object, propName);
				if (value != null) {
					listWithNotNulls.add((T) value);
				}
				if (validator != null) {
					setPropertyValidator(propName, validator);
				}
			}
		}
	}

	public <T> void gatherOrderedPropertiesWithPrefix(String propertyPrefix,
			int nrValues, ArrayList<T> result, ReadableObject object) {
		for (int i = 1; i <= nrValues; i++) {
			String propName = propertyPrefix + i;
			Object value = getProperty(object, propName);
			if (value != null) {
				result.add((T) value);
			}
		}
	}

	public <T> void setOrRemoveMultipleAssociations(boolean set,
			String propertyPrefix, String fieldPrefix, int nrValues,
			int maxValues, ArrayList<T> listWithNotNulls, ReadableObject object) {
		setOrRemoveMultipleAssociations(set, propertyPrefix, fieldPrefix,
				nrValues, maxValues, listWithNotNulls, null, object);
	}

	public void setPropertyValueFromString(ReadableObject object,
			String propertyName, String propertyValue) {
		System.out
				.println(this
						+ " setPropertyValueFromString() not implemented yet... Called with args: "
						+ object + " " + propertyName + " " + propertyValue);
	}

	public static String toXML(ReadableObject toXMLObject) {
		return toXML(toXMLObject, false);
	}

	static boolean propertyEquals(ReadableObject object, String propertyName,
			Object value) {
		PropertyFieldAssociation pfa = object.getPropertyFieldAssociation();
		Object valueToCompareWith = pfa.getProperty(object, propertyName);
		return CompareUtils.deepEquals(valueToCompareWith, value);
	}

	@SuppressWarnings("unchecked")
	public static String toXML(ReadableObject toXMLObject,
			boolean displayChangedOnly) {

		StringBuilder builder = new StringBuilder();

		PropertyFieldAssociation pfa = toXMLObject
				.getPropertyFieldAssociation();

		ReadableObject defaultObject = null;
		if (displayChangedOnly) {
			try {
				defaultObject = toXMLObject.getClass().newInstance();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		Class<? extends ReadableObject> objectClass = toXMLObject.getClass();

		String tagName = objectClass.getSimpleName();

		if (pfa == null) {
			System.out.println(PropertyFieldAssociation.class
					+ " unable to get pfa from " + toXMLObject.getClass() + " "
					+ toXMLObject);
			return "<" + tagName + " />";
		}

		StringBuilder attributesBuilder = new StringBuilder();
		StringBuilder childrenBuilder = new StringBuilder();

		// Get all properties
		ArrayList<String> allPropertyNames = pfa.getAllPropertyNames();

		for (String name : allPropertyNames) {

			Object object = pfa.getProperty(toXMLObject, name);
			if (object == null) {
				// System.out.println(PropertyFieldAssociation.class
				// + " could not get property " + name
				// + " propertyNames: " + allPropertyNames + " in object " +
				// toXMLObject.getClass());
				continue;
			}
			PropertyToXMLHandler handler = pfa.getToXMLHandler(name);
			if (handler != null) {
				// A custom made XML handler was provided.
				handler.handleToXML(toXMLObject, object, name,
						attributesBuilder, childrenBuilder);
				// System.out.println(PropertyFieldAssociation.class +
				// " using custom handler");
				continue;
			}

			String fieldName = pfa.getPropertyFieldName(name);
			if (fieldName == null) {
				System.out.println(PropertyFieldAssociation.class
						+ " could not find the field name " + name);
			}
			if (fieldName != null) {
				if (object instanceof List) {
					List<ReadableObject> theList = (List<ReadableObject>) object;
					String propertyTag = pfa.getPropertyTag(name);
					if (propertyTag != null && !propertyTag.isEmpty()) {
						childrenBuilder.append("<" + propertyTag + ">\n");
					}
					for (ReadableObject go : theList) {
						if (go == null) {
							System.out.println(PropertyFieldAssociation.class
									.getSimpleName()
									+ " found a null value in list "
									+ name
									+ " tag: " + propertyTag);
						} else {
							childrenBuilder.append(PropertyFieldAssociation
									.toXML(go, displayChangedOnly));
						}
					}
					if (propertyTag != null && !propertyTag.isEmpty()) {
						childrenBuilder.append("</" + propertyTag + ">\n");
					}
				} else if (object instanceof ReadableObject) {
					String propertyTag = pfa.getPropertyTag(name);
					ReadableObject go = (ReadableObject) object;
					if (propertyTag == null) {
						XMLUtils.getStringAttributeString(go.getId(),
								fieldName, attributesBuilder);
					} else {
						if (!propertyTag.isEmpty()) {
							childrenBuilder.append("<" + propertyTag + ">\n");
						}
						// System.out.println("adding gamesobject to children");
						childrenBuilder.append(PropertyFieldAssociation.toXML(
								go, displayChangedOnly));
						if (!propertyTag.isEmpty()) {
							childrenBuilder.append("</" + propertyTag + ">\n");
						}
					}
				} else if (object instanceof Integer
						|| object instanceof Double || object instanceof String
						|| object instanceof Boolean
						|| object.getClass().isEnum()) {
					if (defaultObject == null
							|| !propertyEquals(defaultObject, name, object)) {
						attributesBuilder.append(XMLUtils
								.getStringAttributeString(object.toString(),
										fieldName));
					}
				} else if (object instanceof int[]) {
					if (defaultObject == null
							|| !propertyEquals(defaultObject, name, object)) {
						int[] arr = (int[]) object;
						XMLUtils.getStringAttributeString(ParseUtils
								.getIntArrayValueString(arr), fieldName,
								attributesBuilder);
					}
				} else if (object instanceof double[]) {
					if (defaultObject == null
							|| !propertyEquals(defaultObject, name, object)) {
						double[] arr = (double[]) object;
						XMLUtils.getStringAttributeString(ParseUtils
								.getDoubleArrayValueString(arr), fieldName,
								attributesBuilder);
					}
				} else if (object instanceof double[][]) {
					if (defaultObject == null
							|| !propertyEquals(defaultObject, name, object)) {

						double[][] arr = (double[][]) object;
						XMLUtils.getStringAttributeString(ParseUtils
								.getDoubleDoubleArrayValueString(arr),
								fieldName, attributesBuilder);
					}
				} else if (object instanceof int[][]) {
					if (defaultObject == null
							|| !propertyEquals(defaultObject, name, object)) {
						int[][] arr = (int[][]) object;
						XMLUtils.getStringAttributeString(ParseUtils
								.getIntIntArrayValueString(arr), fieldName,
								attributesBuilder);
					}
				} else {
					if (defaultObject == null
							|| !propertyEquals(defaultObject, name, object)) {
						Class<? extends Object> theClass = object.getClass();
						if (theClass.isArray()) {
							int arrayLength = Array.getLength(object);
							Object[] arr = new Object[arrayLength];
							for (int i = 0; i < arrayLength; i++) {
								arr[i] = Array.get(object, i);
							}
							XMLUtils.getStringAttributeString(ParseUtils
									.getObjectArrayValueString(arr), fieldName,
									attributesBuilder);
						} else {
							XMLUtils.getStringAttributeString(
									object.toString(), fieldName,
									attributesBuilder);
						}
					}
				}
			}
		}
		builder.append("<" + tagName + " ");
		builder.append(attributesBuilder.toString());

		if (childrenBuilder.length() > 0) {
			builder.append(" >\n");
			builder.append(childrenBuilder.toString());
			builder.append("</" + tagName + ">\n");
		} else {
			builder.append(" />\n");
		}
		return builder.toString();
	}

	public static void getXMLSchema(ReadableObject schemaObject,
			StringBuilder builder) {
		PropertyFieldAssociation pfa = schemaObject
				.getPropertyFieldAssociation();

		ArrayList<String> allPropertyNames = pfa.getAllPropertyNames();

		for (String name : allPropertyNames) {
			Object object = pfa.getProperty(schemaObject, name);

			if (object == null) {
				// System.out.println(PropertyFieldAssociation.class
				// + " could not get property " + name
				// + " propertyNames: " + allPropertyNames + " in object " +
				// toXMLObject.getClass());
				continue;
			}
			// PropertyToXMLSchemaHandler handler =
			// pfa.getToXMLSchemaHandler(name);
			// if (handler != null) {
			// // A custom made XML handler was provided.
			// handler.handleToXML(object, name, attributesBuilder,
			// childrenBuilder);
			// // System.out.println(PropertyFieldAssociation.class +
			// // " using custom handler");
			// continue;
			// }

			String fieldName = pfa.getPropertyFieldName(name);
			if (fieldName == null) {
				System.out.println(PropertyFieldAssociation.class
						+ " could not find the field name " + name);
			}

		}
	}

}
