package com.springworldgames.objectreader.common;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;

import org.w3c.dom.Element;

import com.springworldgames.jcgmusic.ParseUtils;
import com.springworldgames.jcgmusic.XMLUtils;
import com.springworldgames.objectreader.ReadableObject;



public class ReadableObjectWithProperties extends DefaultReadableObject {

	
	public String[] getPropertyNames() {
		PropertyFieldAssociation pfa = getPropertyFieldAssociation();
		if (pfa != null) {
			return pfa.getPropertyNames();
		}
		return new String[0];
	}

	public boolean isPropertyIndirect(String name) {
		PropertyFieldAssociation pfa = getPropertyFieldAssociation();
		if (pfa != null) {
			return pfa.isPropertyIndirect(name);
		}
		return false;
	}

	@Override
	public Object getFieldProperty(String fieldName) {
		PropertyFieldAssociation pfa = getPropertyFieldAssociation();
		if (pfa != null) {
			return pfa.getFieldProperty(fieldName);
		}
		return null;
	}

	@Override
	public Object getProperty(String name) {
		PropertyFieldAssociation pfa = getPropertyFieldAssociation();
		if (pfa != null) {
			return pfa.getProperty(this, name);
		}
		return null;
	}

	public boolean isPropertyEnumerable(String name) {
		PropertyFieldAssociation pfa = getPropertyFieldAssociation();
		if (pfa != null) {
			return pfa.isPropertyEnumerable(name);
		}
		return false;
	}

	public Collection<Object> getEnumerables(String name) {
		PropertyFieldAssociation pfa = getPropertyFieldAssociation();
		if (pfa != null) {
			return pfa.getEnumerables(name);
		}
		return null;
	}

	public int getArrayPropertyMinArity(String name) {
		PropertyFieldAssociation pfa = getPropertyFieldAssociation();
		if (pfa != null) {
			return pfa.getArrayPropertyMinArity(name);
		}
		return 0;
	}

	public int getArrayPropertyMaxArity(String name) {
		PropertyFieldAssociation pfa = getPropertyFieldAssociation();
		if (pfa != null) {
			return pfa.getArrayPropertyMaxArity(name);
		}
		return Integer.MAX_VALUE;
	}

	public int getIntPropertyMaxValue(String name) {
		PropertyFieldAssociation pfa = getPropertyFieldAssociation();
		if (pfa != null) {
			return pfa.getIntPropertyMaxValue(name);
		}
		return Integer.MAX_VALUE;
	}

	public int getIntPropertyMinValue(String name) {
		PropertyFieldAssociation pfa = getPropertyFieldAssociation();
		if (pfa != null) {
			return pfa.getIntPropertyMinValue(name);
		}
		return Integer.MIN_VALUE;
	}

	public double getDoublePropertyMaxValue(String name) {
		PropertyFieldAssociation pfa = getPropertyFieldAssociation();
		if (pfa != null) {
			return pfa.getDoublePropertyMaxValue(name);
		}
		return Double.POSITIVE_INFINITY;
	}

	public double getDoublePropertyMinValue(String name) {
		PropertyFieldAssociation pfa = getPropertyFieldAssociation();
		if (pfa != null) {
			return pfa.getDoublePropertyMinValue(name);
		}
		return Double.NEGATIVE_INFINITY;
	}

	public boolean getPropertyTryToParseText(String name) {
		PropertyFieldAssociation pfa = getPropertyFieldAssociation();
		if (pfa != null) {
			return pfa.getPropertyTryToParseText(name);
		}
		return false;
	}
	
	@Override
	public void setProperty(String name, Object value) {
		PropertyFieldAssociation pfa = getPropertyFieldAssociation();
		if (pfa != null) {
			pfa.setProperty(this, name, value);
		}
	}

	public PropertyFieldAssociation getPropertyFieldAssociation() {
		return null;
	}

	public void getAttributeString(StringBuilder builder) throws Exception {

		XMLUtils.getStringAttributeString(getId(), "id", builder);

		// Get all properties
		String[] names = getPropertyNames();

		for (String name : names) {

			Object object = getProperty(name);
			if (object == null) {
				println(this + " could not get property " + name
						+ " propertyNames: " + Arrays.toString(names));
				continue;
			}
			PropertyFieldAssociation pfa = getPropertyFieldAssociation();
			if (pfa != null) {
				String fieldName = pfa.getPropertyFieldName(name);
				if (fieldName == null) {
					println(this + " could not find the field name " + name);
				}
				if (fieldName != null) {
					if (object instanceof ReadableObject) {
						ReadableObject go = (ReadableObject) object;
						XMLUtils.getStringAttributeString(go.getId(),
								fieldName, builder);
					} else if (object instanceof java.lang.Integer) {
						builder.append(XMLUtils.getIntAttributeString(
								(Integer) object, fieldName));
					} else if (object instanceof java.lang.Double) {
						double value = (java.lang.Double) object;
						XMLUtils.getDoubleAttributeString(value,
								fieldName, builder);
					} else if (object instanceof Boolean) {
						builder.append(XMLUtils.getBooleanAttributeString(
								(Boolean) object, fieldName));
					} else if (object instanceof String) {
						XMLUtils.getStringAttributeString(
								(String) object, fieldName, builder);
					} else if (object instanceof int[]) {
						int[] arr = (int[]) object;
						XMLUtils.getStringAttributeString(
								ParseUtils.getIntArrayValueString(arr),
								fieldName, builder);
					} else if (object instanceof double[]) {
						double[] arr = (double[]) object;
						XMLUtils.getStringAttributeString(
								ParseUtils.getDoubleArrayValueString(arr),
								fieldName, builder);
					} else {
						XMLUtils.getStringAttributeString(object
								.toString(), fieldName, builder);
					}
				}
			}
		}
	}

	@Override
	public String toXML() throws Exception {
		Class<? extends ReadableObjectWithProperties> theClass = getClass();
		String tagName = theClass.getSimpleName();

		Field childrenField = null;
		try {
			childrenField = theClass.getField("children");
		} catch (NoSuchFieldException nsfe) {
			childrenField = null;
		}
		boolean hasChildren = childrenField != null;

		StringBuilder builder = new StringBuilder();
		builder.append("<" + tagName + " ");

		getAttributeString(builder);

		if (hasChildren) {
			builder.append(" >\n");
			ArrayList<?> theChildren = (ArrayList<?>) childrenField.get(this);
			for (Object c : theChildren) {
				if (c instanceof ReadableObject) {
					ReadableObject go = (ReadableObject) c;
					builder.append(go.toXML());
				} else if (c instanceof Element) {
					Element e = (Element) c;
					builder.append(XMLUtils.elementToXML(e));
				} else {
					println(this + " Found an invalid type in child arraylist "
							+ c.getClass().getName());
				}
			}
			builder.append("</" + tagName + ">\n");
		} else {
			builder.append(" />\n");
		}

		return builder.toString();
	}


}
