package com.springworldgames.objectreader.common;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

import com.springworldgames.jcgmusic.ArrayUtils;
import com.springworldgames.jcgmusic.XMLUtils;
import com.springworldgames.objectreader.ReadableObject;

public class PfaHtmlUtils {

	public static void mapToHtml(StringBuilder builder, String extraAttributes,
			String id, String cssClass, String title,
			ReadableObject parentObject, Map<String, Object> map,
			ToHtmlInfo info, ToHtmlInfo defaultInfo,
			LinkedHashMap<String, ToHtmlInfo> infos) {

		StringBuilder tempBuilder = new StringBuilder();
		XMLUtils.getPropertiesTagString(tempBuilder, "properties", map);
		// System.out.println("Entering mapToHtml() with map:\n"
		// + tempBuilder.toString() + "\nkeys: " + map.keySet());
		// System.out.println("parent Object is: " + (parentObject == null ?
		// "null"
		// : PropertyFieldAssociation.toXML(parentObject)));

		if (info == null) {
			info = defaultInfo;
			if (info == null) {
				info = new ToHtmlInfo();
			}
		}

		String attributes = extraAttributes == null ? "" : extraAttributes;
		if (cssClass != null && !cssClass.isEmpty()) {
			attributes += "class=\"" + cssClass + "\" ";
		}
		if (id != null && !id.isEmpty()) {
			attributes += "id=\"" + id + "\" ";
		}

		builder.append("<table " + attributes + " >\n");
		if (title != null) {
			builder.append("<tr><th colspan=\"2\">" + title + "</th></tr>");
		}

		LinkedHashSet<String> complexPropertyNames = new LinkedHashSet<String>();

		LinkedHashMap<String, String> simpleMap = new LinkedHashMap<String, String>();

		boolean skippedProperty = false;

		for (String propName : map.keySet()) {
			Object value = map.get(propName);

			if (value == null) {
				continue;
			}
			
			if (!info.showProperty(parentObject, propName, value)) {
				// Skipping this property
				skippedProperty = true;
				continue;
			}

			String string = getSimpleStringForValue(value);
			if (string != null) {
				simpleMap.put(propName, string);
			} else {
				complexPropertyNames.add(propName);
			}

		}

		int count = 0;
		for (String propName : simpleMap.keySet()) {
			String propertyClass = info.getPropertyCssClass(count);
			builder.append("<tr class=\"" + propertyClass + "\" >\n");
			builder.append("<td>" + propName + "</td>");
			builder.append("<td>" + simpleMap.get(propName) + "</td>");
			builder.append("</tr>\n");
			count++;
		}

		for (String propName : complexPropertyNames) {
			Object value = map.get(propName);

			// if (!info.showProperty(parentObject, propName, value)) {
			// // Skipping this property
			// skippedProperty = true;
			// continue;
			// }

			builder.append("<tr>\n");
			builder.append("<td colspan=\"2\" class=\""
					+ info.defaultListCssClass + "\" >\n");

			builder.append(propName + "<br/>");
			if (value instanceof ReadableObject) {
				ReadableObject readableObject = (ReadableObject) value;
				readableObjectToHtml(builder, readableObject, null, null,
						defaultInfo, infos);
			} else if (value instanceof List) {
				List objectList = (List) value;

				builder.append("<div class=\"" + info.defaultListCssClass
						+ "\" >\n");
				Iterator iterator = objectList.iterator();
				while (iterator.hasNext()) {
					Object next = iterator.next();
					if (next instanceof ReadableObject) {
						// builder.append("<tr>\n");
						// builder.append("<td colspan=\"2\" class=\""
						// + info.defaultListCssClass + "\" >\n");
						ReadableObject readableObject = (ReadableObject) next;
						readableObjectToHtml(builder, readableObject, null,
								null, defaultInfo, infos);
						// builder.append("</td>\n");
						// builder.append("</tr>\n");
					}
				}
				builder.append("</div>\n");
			} else {
				System.out.println(PfaHtmlUtils.class.getSimpleName()
						+ " unable to create HTML for " + value + " "
						+ value.getClass().getSimpleName());
			}
			builder.append("</td>\n");
			builder.append("</tr>\n");

		}

		if (skippedProperty && info != null && info.showEllipsis) {
			String propertyClass = info.getPropertyCssClass(count);
			builder.append("<td colspan=\"2\" class=\"" + propertyClass
					+ "\" >\n");
			builder.append("...");
			builder.append("</td>\n");
		}

		builder.append("</table>\n");
	}

	public static void readableObjectToHtml(StringBuilder builder,
			ReadableObject object, String extraAttributes, String id,
			ToHtmlInfo defaultInfo, LinkedHashMap<String, ToHtmlInfo> infos) {

		ToHtmlInfo info = infos.get(object.getClass().getSimpleName());
		if (info == null) {
			info = defaultInfo;
		}

		String cssClass = info.defaultReadableObjectCssClass;
		String specificClass = info.specificCssClasses.get(object.getClass());
		if (specificClass != null) {
			cssClass = specificClass;
		}

		PropertyFieldAssociation pfa = object.getPropertyFieldAssociation();

		if (pfa != null) {

			ArrayList<String> allPropertyNames = pfa.getAllPropertyNames();

			LinkedHashMap<String, Object> objectMap = new LinkedHashMap<String, Object>();

			for (String propName : allPropertyNames) {
				Object value = pfa.getProperty(object, propName);
				objectMap.put(propName, value);
			}

			mapToHtml(builder, extraAttributes, id, cssClass, object.getClass()
					.getSimpleName(), object, objectMap, info, defaultInfo,
					infos);

		} else {
			builder.append("No PFA found for "
					+ object.getClass().getSimpleName());
		}
	}

	public static String getSimpleStringForValue(Object value) {
		if (value instanceof String || value instanceof Double
				|| value instanceof Integer || value instanceof Boolean
				|| value.getClass().isEnum()) {
			return value.toString();
		} else if (value instanceof int[][]) {
			return ArrayUtils.toString((int[][]) value);
		} else if (value instanceof double[][]) {
			return ArrayUtils.toString((double[][]) value);
		} else if (value instanceof int[]) {
			return Arrays.toString((int[]) value);
		} else if (value instanceof double[]) {
			return Arrays.toString((double[]) value);
		}
		return null;
	}

}
