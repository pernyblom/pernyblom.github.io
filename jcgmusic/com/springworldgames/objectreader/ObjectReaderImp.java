package com.springworldgames.objectreader;

import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.w3c.dom.Attr;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;

import com.springworldgames.jcgmusic.ParseUtils;
import com.springworldgames.jcgmusic.XMLUtils;
import com.springworldgames.objectreader.common.PropertyFieldAssociation;

public class ObjectReaderImp implements ObjectReader {

	LinkedHashSet<String> packageStrings = new LinkedHashSet<String>();

	public ObjectReaderImp() {
	}

	public void addPackagesString(Class<?>... classes) {
		for (Class<?> c : classes) {
			addPackageString(c.getPackage().getName());
		}
	}

	public static ArrayList<String> getPackagesString(Class<?>... classes) {
		ArrayList<String> result = new ArrayList<String>();
		for (Class<?> c : classes) {
			result.add(c.getPackage().getName());
		}
		return result;
	}

	public void addPackageString(String s) {
		if (s.endsWith(".")) {
			packageStrings.add(s);
		} else {
			packageStrings.add(s + ".");
		}
	}

	LinkedHashMap<String, Class<?>> classBuffer = new LinkedHashMap<String, Class<?>>();


	public void setShortName(String shortName, Class<?> cl) {
		classBuffer.put(shortName, cl);
	}

	@Override
	public Class<?> getClassFromName(String className) {
		Class<?> objectClass = classBuffer.get(className);

		if (objectClass == null) {
			for (String packageString : packageStrings) {
				String fullName = packageString + className;
				objectClass = classBuffer.get(fullName);
				if (objectClass != null) {
					break;
				}
			}
		}
		if (objectClass == null) {
			for (String packageString : packageStrings) {
				String fullName = packageString + className;
				try {
					objectClass = Class.forName(fullName);
					classBuffer.put(fullName, objectClass);
					break;
				} catch (Exception e) {
				}
			}
		}
		if (objectClass == null) {
			System.out.println(this + " could not find a class named "
					+ className);
			throw new NullPointerException();
		}
		return objectClass;
	}

	public ReadableObject getSimpleInstance(String className) throws Exception {
		Class<?> objectClass = getClassFromName(className);

		ReadableObject obj = (ReadableObject) objectClass.newInstance();
		return obj;
	}

	public ReadableObject getSimpleInstance(Element element) throws Exception {
		return getSimpleInstance(element.getTagName());
	}

	@Override
	public ReadableObject readAndCreateObject(Element element,
			HashMap<String, ReadableObject> allObjects) throws Exception {

		// System.out.System.out.println("Creating + " + element.getTagName());

		Class<?> objectClass = getClassFromName(element.getTagName());

		ReadableObject obj = (ReadableObject) objectClass.newInstance();

		ArrayList<Element> childrenElements = XMLUtils
				.getChildrenElements(element);

		if (childrenElements.size() > 0) {
			Field childrenField = null;
			Field elementChildrenField = null;
			try {
				childrenField = objectClass.getField("children");
			} catch (Exception exception) {
			}
			try {
				elementChildrenField = objectClass.getField("elementChildren");
			} catch (Exception exception2) {
			}
			if (elementChildrenField == null && childrenField == null) {
				// No children or elementChildren field. We then try the
				// PropertyFieldAssociation instead
				PropertyFieldAssociation pfa = obj
						.getPropertyFieldAssociation();
				boolean ok = false;
				if (pfa != null) {
					Set<String> listPropertyNames = pfa.getListPropertyNames();
					if (listPropertyNames != null
							&& listPropertyNames.size() > 0) {
						String listPropName = listPropertyNames.iterator()
								.next();
						for (Element e : childrenElements) {
							ReadableObject childObject = readAndCreateObject(e,
									allObjects);
							pfa.addProperty(obj, listPropName, childObject);
						}
						ok = true;
					}
				}
				if (!ok) {
					throw new IllegalStateException(
							"Object of class "
									+ objectClass.getName()
									+ " had children elements but no field children or elementChildren or PFA that was satisfying");
				}
			} else if (childrenField != null && obj.instantiateChildren()) {
				// The object has a field named children and want them to be
				// initialized before they are added
				ArrayList<ReadableObject> children = new ArrayList<ReadableObject>();

				for (Element e : childrenElements) {
					children.add(readAndCreateObject(e, allObjects));
				}
				childrenField.set(obj, children);
			} else {
				// The object takes over the responsibility of initiating
				// the
				// children elements (if ever)
				ArrayList<Element> children = new ArrayList<Element>();
				children.addAll(childrenElements);
				elementChildrenField.set(obj, children);
			}

		}
		try {

			NamedNodeMap attributes = element.getAttributes();

			for (int k = 0; k < attributes.getLength(); k++) {
				Node node = attributes.item(k);
				// System.out.System.out.println(node);
				if (node.getNodeType() == Node.ATTRIBUTE_NODE) {
					Attr attr = (Attr) node;
					String attrName = attr.getName(); // .trim();
					String value = attr.getValue(); // .trim();

					// Ugly way to deal with namespace stuff
					if (attrName.equals("xmlns") || attrName.contains(":")) {
						continue;
					}
					
					// System.out.System.out.println("Trying to set " + attrName
					// + " to " +
					// value);

					Field field = null;
					Class<?> type = null;
					try {
						field = objectClass.getField(attrName);
						type = field.getType();
					} catch (Exception e) {
						Object fieldValue = obj.getFieldProperty(attrName);
						if (fieldValue != null) {
							type = fieldValue.getClass();
						} else {
							// if (obj.canHandleFieldSetFor(attrName)) {
							// obj.setHandledField(attrName, value);
							// } else {
							System.out.println("Could not find the field "
									+ attrName + " in " + objectClass.getName()
									+ " I am " + this + " obj.id:"
									+ obj.getId() + " obj.idHint: "
									+ obj.idHint()); // +
							// obj.toXML());
							// }
						}
						continue;
					}
					if (type.isPrimitive()) {
						String name = type.getName();
						if (name.equals("double")) {
							try {
								field.setDouble(obj, Double.valueOf(value)
										.doubleValue());
							} catch (NumberFormatException nf) {
								System.out.println("Could not find " + value
										+ "for field " + field.getName()
										+ " in object " + obj);
							}
						} else if (name.equals("int")) {
							try {
								field.setInt(obj, Integer.parseInt(value));
							} catch (NumberFormatException nf) {
								// Maybe a parameter!
								System.out.println("Could not find " + value
										+ "for field " + field.getName()
										+ " in object " + obj);
							}

						} else if (name.equals("boolean")) {
							if (value.equals("true")) {
								field.setBoolean(obj, true);
							} else if (value.equals("false")) {
								field.setBoolean(obj, false);
							} else {
							}

						} else {
							System.out.println("Could not parse: " + name);
						}
					} else {
						String name = type.getName();
						if (name.equals("java.lang.String")) {
							// Important to check for parameters first because a
							// string
							// is always parsable!
							// Exceptions: The "id" of an object and when we
							// explicitly want a string by marking it with a "
							// (&quot;)

							boolean foundParameter = false;

							boolean explicitStringMark = value.startsWith("\"");

							if (!attrName.equals("id") && !explicitStringMark) {
								// The only exception to this rule is when we
								// have the id of an object
							}
							if (explicitStringMark) {
								// Mask that beautiful "
								value = value.substring(1);
							}
							if (!foundParameter) {
								field.set(obj, value);
							}
						} else if (name.equals("java.lang.Boolean")) {
							field.set(obj, Boolean.parseBoolean(value));

						} else if (type.isArray()) {
							Class<?> arrayType = type.getComponentType();
							if (arrayType.isEnum()) {
								List<?> list = Arrays.asList(arrayType
										.getEnumConstants());
								// println("enum constants: " + list);
								ArrayList<String> stringList = ParseUtils
										.parseStringVector(value);
								Object newArray = Array.newInstance(arrayType,
										stringList.size());
								int index = 0;
								for (String s : stringList) {
									boolean wasSet = false;
									for (Object enumConstant : list) {
										if (enumConstant.toString().equals(
												(String) s)) {
											Array.set(newArray, index,
													enumConstant);
											wasSet = true;
											break;
										}
									}
									if (!wasSet) {
										System.out
												.println(this
														+ " could not find an enum constant "
														+ s + " in type "
														+ arrayType);
									}
									index++;
								}
								field.set(obj, newArray);
							} else if (name.equals("[I")) {
								// Integer array
								int[] arr = ParseUtils.parseIntArr(value);
								field.set(obj, arr);
							} else if (name.equals("[D")) {
								double[] arr = ParseUtils.parseDoubleArr(value);
								field.set(obj, arr);
							} else if (name.equals("[Z")) {
								boolean[] arr = ParseUtils
										.parseBooleanArr(value);
								field.set(obj, arr);
							} else if (name.equals("[[I")) {
								// Integer array
								int[][] arr = ParseUtils.parseIntIntArr(value);
								field.set(obj, arr);
							} else if (name.equals("[[D")) {
								// Integer array
								double[][] arr = ParseUtils
										.parseDoubleDoubleArr(value);
								field.set(obj, arr);
							} else {
								Class<?> componentType = type
										.getComponentType();
								System.out.println(this
										+ " could not parse the type " + type
										+ " with name " + name
										+ " component type: "
										+ componentType.getName());
							}
						} else if (type.isEnum()) {
							setEnumField(obj, field, type, value);
						} else {
							ReadableObject gameObject = allObjects.get(value);
							if (gameObject == null) {
								System.out
										.println(this
												+ " could not find the object "
												+ value);
							} else {
								field.set(obj, gameObject);
							}
						}
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(obj);
			throw e;
		}

		// System.out.println(this + " calling init on " + obj +
		// " with allObjects: " + allObjects);
		obj.init(allObjects, this);
		String objId = obj.getId();
		if (objId != null) {
			allObjects.put(objId, (ReadableObject) obj);
			// IDGenerator.addID(objId);
		}
		// profileTimer.endPeriodAndReport(10);

		return (ReadableObject) obj;
	}

	private void setEnumField(ReadableObject obj, Field field, Class<?> type,
			String value) throws IllegalArgumentException,
			IllegalAccessException {
		List<?> list = Arrays.asList(type.getEnumConstants());

		for (Object enumConstant : list) {
			if (enumConstant.toString().equals((String) value)) {
				// System.out.println(this + " found: " + value);
				field.set(obj, enumConstant);
			}
		}

	}

	// public static void main(String[] args) {
	// int [][] arr = new int[2][3];
	//		
	// System.out.println(arr.getClass().getName());
	// }

}
