package com.springworldgames.jcgmusic;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.Set;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.sax.SAXSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import com.springworldgames.objectreader.ObjectReader;
import com.springworldgames.objectreader.ReadableObject;
import com.springworldgames.objectreader.XMLWritable;
import com.springworldgames.objectreader.common.PropertyFieldAssociation;
import com.springworldgames.objectreader.common.PropertyToXMLSchemaHandler;
import com.springworldgames.objectreader.common.ValidatedProperties;

public class XMLUtils {

	public static void elementToXML(Element e, StringBuilder builder)
			throws Exception {
		elementToXML(e, builder, true);
	}

	public static void elementToXML(Element e, StringBuilder builder,
			boolean addNewLines) throws Exception {
		NamedNodeMap attributes = e.getAttributes();

		builder.append("<" + e.getTagName() + " ");

		int nrAttributes = attributes.getLength();

		for (int i = 0; i < nrAttributes; i++) {
			Node item = attributes.item(i);
			builder.append(item + " ");
		}

		ArrayList<Node> childrenNodes = XMLUtils.getChildrenNodes(e);

		if (childrenNodes.size() == 0) {
			builder.append(" />" + (addNewLines ? "\n" : ""));
		} else {
			builder.append(" >" + (addNewLines ? "\n" : ""));
		}
		for (Node n : childrenNodes) {
			short nodeType = n.getNodeType();
			switch (nodeType) {
			case Node.CDATA_SECTION_NODE:
			case Node.TEXT_NODE:
				builder.append(n.getNodeValue());
				break;
			case Node.ELEMENT_NODE:
				elementToXML((Element) n, builder, addNewLines);
			}
		}

		if (childrenNodes.size() > 0) {
			builder.append("</" + e.getTagName() + ">"
					+ (addNewLines ? "\n" : ""));
		}

	}

	public static String elementToXML(Element e) throws Exception {
		StringBuilder builder = new StringBuilder();
		elementToXML(e, builder);
		return builder.toString();
	}

	public static String elementChildrenToXML(Element e, boolean addNewLines)
			throws Exception {
		StringBuilder builder = new StringBuilder();

		ArrayList<Node> nodes = getChildrenNodes(e);
		for (Node n : nodes) {
			short nodeType = n.getNodeType();
			switch (nodeType) {
			case Node.ELEMENT_NODE:
				elementToXML((Element) n, builder, addNewLines);
				break;
			case Node.TEXT_NODE:
			case Node.CDATA_SECTION_NODE:
				builder.append(n.getNodeValue());
				break;
			}
		}
		return builder.toString();
	}

	public static Document parseXMLFile(String filename) throws Exception {
		return parseXMLFile(new File(filename));
	}

	public static Document parseXMLFile(File f)
			throws ParserConfigurationException, SAXException, IOException {
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder = factory.newDocumentBuilder();

		return builder.parse(f);
	}

	public static Document parseXMLFile(InputStream stream)
			throws ParserConfigurationException, SAXException, IOException {
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
		DocumentBuilder builder = factory.newDocumentBuilder();
		return builder.parse(stream);
	}

	public static ArrayList<Element> getElementsByTagName(Element parent,
			String tagName) {
		ArrayList<Element> result = new ArrayList<Element>();
		NodeList children = parent.getElementsByTagName(tagName);
		for (int i = 0; i < children.getLength(); i++) {

			result.add((Element) children.item(i));
		}
		return result;
	}

	public static ArrayList<String> getStringSeqAttribute(String name, Element e) {
		ArrayList<String> result = new ArrayList<String>();

		String seqString = e.getAttribute(name);

		Scanner scanner = new Scanner(seqString);
		scanner.useDelimiter(" ");

		while (scanner.hasNext()) {
			result.add(scanner.next());
		}

		scanner.close();

		return result;
	}

	public static String getStringSeqAttributeString(
			Collection<? extends Object> seq, String name) {
		String result = " " + name + "=\"";
		for (Iterator<? extends Object> i = seq.iterator(); i.hasNext();) {
			result += i.next();
			if (i.hasNext()) {
				result += " ";
			}
		}
		return result + "\" ";
	}

	public static String getDoubleArrValueString(double[] d) {
		String result = "";
		for (int i = 0; i < d.length; i++) {
			result += d[i];
			if (i != d.length - 1) {
				result += " ";
			}
		}
		return result;
	}

	public static String getIntegerArrValueString(int[] d) {
		String result = "";
		for (int i = 0; i < d.length; i++) {
			result += d[i];
			if (i != d.length - 1) {
				result += " ";
			}
		}
		return result;
	}

	public static void getIntegerArrValueString(int[] d, StringBuilder builder) {
		for (int i = 0; i < d.length; i++) {
			builder.append(d[i]);
			if (i != d.length - 1) {
				builder.append(" ");
			}
		}
	}

	public static String getDoubleSeqAttributeString(double[] d, String name) {
		String result = " " + name + "=\"";
		for (int i = 0; i < d.length; i++) {
			result += d[i];
			if (i != d.length - 1) {
				result += " ";
			}
		}
		return result + "\" ";
	}

	public static String getIntSeqAttributeString(int[] d, String name) {
		String result = " " + name + "=\"";
		for (int i = 0; i < d.length; i++) {
			result += d[i];
			if (i != d.length - 1) {
				result += " ";
			}
		}
		return result + "\" ";
	}

	public static void getIntSeqAttributeString(int[] d, String name,
			StringBuilder builder) {
		builder.append(" " + name + "=\"");
		for (int i = 0; i < d.length; i++) {
			builder.append(d[i]);
			if (i != d.length - 1) {
				builder.append(" ");
			}
		}
		builder.append("\" ");
	}

	public static void getDoubleSeqAttributeString(double[] d, String name,
			StringBuilder builder) {
		builder.append(" " + name + "=\"");
		for (int i = 0; i < d.length; i++) {
			builder.append(d[i]);
			if (i != d.length - 1) {
				builder.append(" ");
			}
		}
		builder.append("\" ");
	}

	public static String getDoubleAttributeString(double d, String name) {
		return " " + name + "=\"" + d + "\" ";
	}

	public static void getDoubleAttributeString(double d, String name,
			StringBuilder builder) {
		builder.append(" ");
		builder.append(name + "=\"");
		builder.append(d);
		builder.append("\" ");
	}

	public static String getFloatAttributeString(float d, String name) {
		return " " + name + "=\"" + d + "\" ";
	}

	public static void getFloatAttributeString(float d, String name,
			StringBuilder builder) {
		builder.append(" ");
		builder.append(name + "=\"");
		builder.append(d);
		builder.append("\" ");
	}

	public static String getIntAttributeString(int d, String name) {
		return " " + name + "=\"" + d + "\" ";
	}

	public static void getIntAttributeString(int d, String name,
			StringBuilder builder) {
		builder.append(" " + name + "=\"" + d + "\" ");
	}

	public static String getStringAttributeString(String s, String attributeName) {
		if (s == null) {
			return "";
		}
		return " " + attributeName + "=\"" + escapeAndLinebreaks(s) + "\" ";
	}

	public static String getStringAttributeStringNoInitialSpace(String s,
			String attributeName) {
		if (s == null) {
			return "";
		}
		return attributeName + "=\"" + escapeAndLinebreaks(s) + "\" ";
	}

	public static void getStringAttributeString(String s, String name,
			StringBuilder builder) {
		if (s == null) {
			return;
		}
		builder.append(" ");
		builder.append(name);
		builder.append("=\"");
		escapeAndLinebreaks(s, builder);
		builder.append("\" ");
	}

	public static String escape(String content) {
		StringBuffer buffer = new StringBuffer();
		for (int i = 0; i < content.length(); i++) {
			char c = content.charAt(i);
			if (c == '<')
				buffer.append("&lt;");
			else if (c == '>')
				buffer.append("&gt;");
			else if (c == '&')
				buffer.append("&amp;");
			else if (c == '"')
				buffer.append("&quot;");
			else if (c == '\'')
				buffer.append("&apos;");
			else
				buffer.append(c);
		}
		return buffer.toString();
	}

	public static String escapeAndLinebreaks(String content) {
		StringBuilder buffer = new StringBuilder();
		for (int i = 0; i < content.length(); i++) {
			char c = content.charAt(i);
			switch (c) {
			case '<':
				buffer.append("&lt;");
				break;
			case '>':
				buffer.append("&gt;");
				break;
			case '&':
				buffer.append("&amp;");
				break;
			case '"':
				buffer.append("&quot;");
				break;
			case '\'':
				buffer.append("&apos;");
				break;
			case '\r':
				// buffer.append("&#13;");
				break;
			case '\n':
				buffer.append("&#10;");
				break;
			default:
				buffer.append(c);
				break;
			}
		}
		return buffer.toString();
	}

	public static void escapeAndLinebreaks(String content, StringBuilder builder) {
		for (int i = 0; i < content.length(); i++) {
			char c = content.charAt(i);
			switch (c) {
			case '<':
				builder.append("&lt;");
				break;
			case '>':
				builder.append("&gt;");
				break;
			case '&':
				builder.append("&amp;");
				break;
			case '"':
				builder.append("&quot;");
				break;
			case '\'':
				builder.append("&apos;");
				break;
			case '\r':
				// builder.append("&#13;");
				break;
			case '\n':
				builder.append("&#10;");
				break;
			default:
				builder.append(c);
				break;
			}
		}
	}

	public static boolean getBooleanAttribute(String name, Element e,
			boolean def) {
		String att = e.getAttribute(name);
		if (att == null) {
			return def;
		} else {
			return Boolean.parseBoolean(att);
		}
	}

	public static boolean getBooleanAttribute(String name, Element e) {
		return Boolean.parseBoolean(e.getAttribute(name));
	}

	public static int getIntAttribute(String name, Element e) {
		return Integer.parseInt(e.getAttribute(name));
	}

	public static double getDoubleAttribute(String name, Element e, double def) {
		String att = e.getAttribute(name);
		if (att.isEmpty()) {
			return def;
		} else {
			try {
				double val = Double.parseDouble(att);
				return val;
			} catch (Exception ex) {
			}
		}
		return def;
	}

	public static float getFloatAttribute(String name, Element e, float def) {
		String att = e.getAttribute(name);
		if (att.isEmpty()) {
			return def;
		} else {
			try {
				float val = Float.parseFloat(att);
				return val;
			} catch (Exception ex) {
			}
		}
		return def;
	}

	public static int getIntAttribute(String name, Element e, int def) {
		String att = e.getAttribute(name);
		if (att == null) {
			return def;
		} else {
			try {
				int val = Integer.parseInt(att);
				return val;
			} catch (Exception ex) {
			}
		}
		return def;
	}

	public static double getDoubleAttribute(String name, Element e) {
		return Double.parseDouble(e.getAttribute(name));
	}

	static double[] dummy = new double[3];

	public static double[] getDoubleArrAttribute(String name, Element e, int dim) {
		return ParseUtils.parseDoubleArr(e.getAttribute(name), dim);
	}

	public static int[] getIntArrAttribute(Element e, String name, int dim) {
		int[] result = new int[dim];

		String seqString = e.getAttribute(name);

		Scanner scanner = new Scanner(seqString);
		scanner.useDelimiter(" ");

		int pos = 0;
		while (scanner.hasNext()) {
			result[pos] = Integer.parseInt(scanner.next());
			// result[pos] = scanner.nextDouble();
			pos++;
		}

		for (int i = pos; i < dim; i++) {
			result[pos] = 0;
		}

		scanner.close();

		return result;
	}

	public static int[] getIntArrAttribute(String name, Element e) {
		ArrayList<String> list = getStringSeqAttribute(name, e);
		int[] result = new int[list.size()];
		for (int i = 0; i < list.size(); i++) {
			result[i] = Integer.parseInt(list.get(i));
		}
		return result;
	}

	public static ArrayList<Double> getDoubleSeqAttribute(String name, Element e) {

		ArrayList<Double> result = new ArrayList<Double>();

		String seqString = e.getAttribute(name);

		Scanner scanner = new Scanner(seqString);
		scanner.useDelimiter(" ");

		while (scanner.hasNext()) {
			result.add(Double.parseDouble(scanner.next()));
		}

		scanner.close();

		return result;
	}

	public static Element getFirstChildElementNamed(Element e, String name) {

		NodeList list = e.getElementsByTagName(name);

		for (int i = 0; i < list.getLength(); i++) {
			Node n = list.item(i);
			if (n.getNodeType() == Node.ELEMENT_NODE) {
				return (Element) n;
			}
		}

		return null;
	}

	public static ArrayList<Element> getChildrenElementsNamed(Element e,
			String name) {
		ArrayList<Element> result = new ArrayList<Element>();

		NodeList list = e.getElementsByTagName(name);

		for (int i = 0; i < list.getLength(); i++) {
			Node n = list.item(i);
			if (n.getNodeType() == Node.ELEMENT_NODE) {
				result.add((Element) n);
			}
		}

		return result;

	}

	public static ArrayList<Element> getChildrenElements(Element e) {
		ArrayList<Element> result = new ArrayList<Element>();

		NodeList list = e.getChildNodes();

		for (int i = 0; i < list.getLength(); i++) {
			Node n = list.item(i);
			if (n.getNodeType() == Node.ELEMENT_NODE) {
				result.add((Element) n);
			}
		}
		return result;
	}

	public static ArrayList<Node> getChildrenNodes(Element e) {
		ArrayList<Node> result = new ArrayList<Node>();

		NodeList list = e.getChildNodes();

		for (int i = 0; i < list.getLength(); i++) {
			Node n = list.item(i);
			result.add(n);
		}
		return result;
	}

	public static ArrayList<Node> getChildrenTextAndElements(Element e) {
		ArrayList<Node> result = new ArrayList<Node>();

		NodeList list = e.getChildNodes();
		for (int i = 0; i < list.getLength(); i++) {
			Node n = list.item(i);
			short nodeType = n.getNodeType();
			if (nodeType == Node.ELEMENT_NODE || nodeType == Node.TEXT_NODE) {
				result.add(n);
			}
		}
		return result;
	}

	public static ArrayList<Node> getChildrenTextAndCdataNodes(Element e) {
		ArrayList<Node> result = new ArrayList<Node>();

		NodeList list = e.getChildNodes();
		for (int i = 0; i < list.getLength(); i++) {
			Node n = list.item(i);
			short nodeType = n.getNodeType();
			if (nodeType == Node.TEXT_NODE
					|| nodeType == Node.CDATA_SECTION_NODE) {
				result.add(n);
			}
		}
		return result;
	}

	public static ArrayList<Node> getChildrenTextCdataElementNodes(Element e) {
		ArrayList<Node> result = new ArrayList<Node>();

		NodeList list = e.getChildNodes();
		for (int i = 0; i < list.getLength(); i++) {
			Node n = list.item(i);
			short nodeType = n.getNodeType();
			if (nodeType == Node.TEXT_NODE
					|| nodeType == Node.CDATA_SECTION_NODE
					|| nodeType == Node.ELEMENT_NODE) {
				result.add(n);
			}
		}
		return result;
	}

	public static String getChildAppendedText(Element e) {
		StringBuilder builder = new StringBuilder();

		NodeList list = e.getChildNodes();
		for (int i = 0; i < list.getLength(); i++) {
			Node n = list.item(i);
			short nodeType = n.getNodeType();
			if (nodeType == Node.TEXT_NODE
					|| nodeType == Node.CDATA_SECTION_NODE) {
				builder.append(n.getNodeValue());
			}
		}
		return builder.toString();
	}

	public static String getStringAttribute(String name, Element e) {
		if (e.hasAttribute(name)) {
			String result = e.getAttribute(name);
			return result;
		} else {
			return null;
		}
	}

	public static Element getFirstChildElement(Element e) {
		NodeList list = e.getChildNodes();

		for (int i = 0; i < list.getLength(); i++) {
			Node n = list.item(i);
			if (n.getNodeType() == Node.ELEMENT_NODE) {
				return (Element) n;
			}
		}
		return null;
	}

	public static String getBooleanAttributeString(boolean b, String name) {
		return " " + name + "=\"" + b + "\" ";
	}

	public static void getBooleanAttributeString(boolean b, String name,
			StringBuilder builder) {
		builder.append(" ");
		builder.append(name + "=\"");
		builder.append(b);
		builder.append("\" ");
	}

	// Parses the XML-file f and returns the document element
	public static Element parseAndGetElement(File f) throws Exception {

		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();

		DocumentBuilder builder = factory.newDocumentBuilder();

		Document doc = builder.parse(f);

		return doc.getDocumentElement();
	}

	public static Element parseAndGetElement(String fileString)
			throws Exception {
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();

		DocumentBuilder builder = factory.newDocumentBuilder();

		InputStream inputStream = StringUtils.stringToInputStream(fileString,
				"utf-8");
		Document doc = builder.parse(inputStream);
		return doc.getDocumentElement();
	}

	public static Element parseAndGetElement(InputStream is) throws Exception {
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();

		DocumentBuilder builder = factory.newDocumentBuilder();

		Document doc = builder.parse(is);
		return doc.getDocumentElement();
	}

	static class IndexedAttributeInfo {
		String name;
		int startIndex = 0;
		String prefix;
		String postfix;
		String value;

		public String getAttributeValue(int index) {
			if (prefix == null && postfix == null) {
				return value;
			} else {
				return (prefix == null ? "" : prefix) + (index + startIndex)
						+ (postfix == null ? "" : postfix);
			}
		}

		public String getAttributeString(int index) {
			return name + "=\"" + getAttributeValue(index) + "\" ";
		}
	}

	public static ArrayList<Element> expandIndexedElementTemplate(
			Element template) {
		ArrayList<Element> result = new ArrayList<Element>();
		int n = XMLUtils.getIntAttribute("n", template);
		String tagName = XMLUtils.getStringAttribute("tagname", template);
		int defaultStartIndex = XMLUtils.getIntAttribute("default_start_index",
				template);
		ArrayList<Element> attributeElements = getChildrenElements(template);
		ArrayList<IndexedAttributeInfo> attrInfos = new ArrayList<IndexedAttributeInfo>();
		for (Element ae : attributeElements) {
			IndexedAttributeInfo iai = new IndexedAttributeInfo();
			iai.startIndex = XMLUtils.getIntAttribute("start_index", ae,
					defaultStartIndex);
			iai.prefix = XMLUtils.getStringAttribute("prefix", ae);
			iai.postfix = XMLUtils.getStringAttribute("postfix", ae);
			iai.value = XMLUtils.getStringAttribute("value", ae);
			iai.name = XMLUtils.getStringAttribute("name", ae);
			attrInfos.add(iai);
		}

		for (int i = 0; i < n; i++) {
			Element newElement = getNewElement(tagName);
			for (IndexedAttributeInfo iai : attrInfos) {
				newElement.setAttribute(iai.name, iai.getAttributeValue(i));
			}
			result.add(newElement);
		}

		return result;
	}

	static DocumentBuilderFactory documentBuilderFactory;
	static DocumentBuilder documentBuilder;
	static Document defaultDocument;

	static void createDocumentBuilderIfNecessary() {
		if (documentBuilderFactory == null) {
			documentBuilderFactory = DocumentBuilderFactory.newInstance();
			try {
				documentBuilder = documentBuilderFactory.newDocumentBuilder();
				defaultDocument = documentBuilder.newDocument();
			} catch (ParserConfigurationException e) {
				e.printStackTrace();
			}
		}
	}

	public static Element getNewElement(String tagName) {
		createDocumentBuilderIfNecessary();
		Element result = defaultDocument.createElement(tagName);
		return result;
	}

	public static void getSimpleTagString(String tagName, String[] attrNames,
			Object[] values, StringBuilder builder) {
		builder.append("<" + tagName + " ");
		for (int i = 0; i < values.length; i++) {
			Object value = values[i];
			getStringAttributeString(value.toString(), attrNames[i], builder);
		}
		builder.append(" />\n");
	}

	public static String allToXML(ArrayList<Element> c) throws Exception {
		String result = "";
		if (c != null) {
			for (Element go : c) {
				result += XMLUtils.elementToXML(go);
			}
		}
		return result;
	}

	public static String allToXML(Collection<? extends XMLWritable> c)
			throws Exception {
		String result = "";
		if (c != null) {
			for (XMLWritable w : c) {
				result += w.toXML();
			}
		}
		return result;
	}

	public static void getAndSetTaggedInstance(Object target, Element element,
			ObjectReader reader, HashMap<String, ReadableObject> allObjects) {
		getAndSetTaggedInstance(target, element, reader, allObjects, null);
	}

	public static void getAndSetTaggedInstance(Object target, Element element,
			ObjectReader reader, HashMap<String, ReadableObject> allObjects,
			Set<String> tagExceptions) {
		String tagName = element.getTagName();
		if (tagExceptions != null && tagExceptions.contains(tagName)) {
			return;
		}
		try {
			Class<?> targetClass = target.getClass();
			Field field = targetClass.getField(tagName);
			Class<?> type = field.getType();
			if (type.isAssignableFrom(ArrayList.class)) {
				ArrayList list = (ArrayList) field.get(target);
				ArrayList<Element> elements = getChildrenElements(element);
				for (Element e : elements) {
					ReadableObject newObject = reader.readAndCreateObject(e,
							allObjects);
					list.add(newObject);
				}
			} else {
				Element firstChild = getFirstChildElement(element);
				ReadableObject newObject = reader.readAndCreateObject(
						firstChild, allObjects);
				field.set(target, newObject);
			}
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (NoSuchFieldException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static void getAndSetTaggedInstance(Object target,
			ArrayList<Element> elements, ObjectReader reader,
			HashMap<String, ReadableObject> allObjects) {
		getAndSetTaggedInstance(target, elements, reader, allObjects, null);
	}

	public static void getAndSetTaggedInstance(Object target,
			ArrayList<Element> elements, ObjectReader reader,
			HashMap<String, ReadableObject> allObjects, Set<String> exceptions) {
		for (Element e : elements) {
			getAndSetTaggedInstance(target, e, reader, allObjects, exceptions);
		}
	}

	public static void getTaggedContentIfNotNull(StringBuilder builder,
			String tagName, XMLWritable writable) throws Exception {
		if (writable != null) {
			builder.append("<" + tagName + ">\n");
			builder.append(writable.toXML());
			builder.append("\n</" + tagName + ">\n");
		}
	}

	public static void getTaggedContentIfNotEmpty(StringBuilder builder,
			String tagName, ArrayList<? extends XMLWritable> writables)
			throws Exception {
		if (writables.size() > 0) {
			builder.append("<" + tagName + ">\n");
			for (XMLWritable w : writables) {
				builder.append(w.toXML());
			}
			builder.append("\n</" + tagName + ">\n");
		}
	}

	public static LinkedHashMap<String, Object> parsePropertiesElement(
			ObjectReader reader, Element e, Set<String> ignoreProperties) {
		LinkedHashMap<String, Object> result = new LinkedHashMap<String, Object>();

		NamedNodeMap attributes = e.getAttributes();
		int length = attributes.getLength();
		for (int i = 0; i < length; i++) {
			Node item = attributes.item(i);
			Attr attr = (Attr) item;
			String propertyName = attr.getName();
			if (ignoreProperties.contains(propertyName)) {
				continue;
			}
			String propertyValue = attr.getValue();
			result.put(propertyName, propertyValue); // Using strings
		}

		// Now, get the complex properties
		ArrayList<Element> childrenElements = XMLUtils.getChildrenElements(e);
		for (Element el : childrenElements) {
			String propertyName = el.getTagName();
			if (ignoreProperties.contains(propertyName)) {
				continue;
			}
			Element firstChildElement = XMLUtils.getFirstChildElement(el);
			try {
				ReadableObject object = reader.readAndCreateObject(
						firstChildElement,
						new HashMap<String, ReadableObject>());
				result.put(propertyName, object);
			} catch (Exception e1) {
				e1.printStackTrace();
			}
		}
		return result;
	}

	public static void getPropertiesTagString(StringBuilder builder,
			String tagName, Map<String, Object> map) {
		getPropertiesTagString(builder, tagName, map, null);
	}

	public static void getPropertiesSequenceTagString(StringBuilder builder,
			String sequenceTagName, String tagName,
			ArrayList<LinkedHashMap<String, Object>> list) {
		builder.append("<" + tagName + ">\n");
		for (Map<String, Object> m : list) {
			getPropertiesTagString(builder, tagName, m, null);
		}
		builder.append("</" + tagName + ">\n");
	}

	public static void getPropertiesTagString(StringBuilder builder,
			String tagName, Map<String, Object> map,
			Set<String> ignoreProperties) {

		StringBuilder childrenBuilder = new StringBuilder();
		builder.append("<" + tagName + " ");
		for (String s : map.keySet()) {
			// System.out.println(XMLUtils.class.getSimpleName()
			// + " going throuth property " + s);
			if (ignoreProperties != null && ignoreProperties.contains(s)) {
				// System.out.println(XMLUtils.class.getSimpleName() +
				// " ignoring property " + s);
				continue;
			}
			Object value = map.get(s);
			if (value == null) {
				continue;
			}

			if (value instanceof Integer || value instanceof Double
					|| value instanceof Boolean || value instanceof String
					|| value.getClass().isEnum()) {
				getStringAttributeString(value.toString(), s, builder);
			} else if (value instanceof int[]) {
				getStringAttributeString(
						getIntegerArrValueString((int[]) value), s, builder);
			} else if (value instanceof double[]) {
				getStringAttributeString(
						getDoubleArrValueString((double[]) value), s, builder);
			} else if (value instanceof int[][]) {
				getStringAttributeString(ParseUtils
						.getIntIntArrayValueString((int[][]) value), s, builder);
			} else if (value instanceof double[]) {
				getStringAttributeString(ParseUtils
						.getDoubleDoubleArrayValueString((double[][]) value),
						s, builder);

			} else if (value instanceof ReadableObject) {
				ReadableObject readableObject = (ReadableObject) value;
				String xml = PropertyFieldAssociation.toXML(readableObject,
						true);

				childrenBuilder.append("<" + s + ">\n");
				childrenBuilder.append(xml);
				childrenBuilder.append("</" + s + ">\n");
			} else if (value.getClass().isArray()) {
				int arrayLength = Array.getLength(value);
				Object[] arr = new Object[arrayLength];
				for (int i = 0; i < arrayLength; i++) {
					arr[i] = Array.get(value, i);
				}
				XMLUtils.getStringAttributeString(ParseUtils
						.getObjectArrayValueString(arr), s, builder);
			}
		}
		builder.append(">\n");

		builder.append(childrenBuilder.toString());
		builder.append("</" + tagName + ">\n");
	}

	public static String getXMLSchemaListTypeForReadableObjects(
			String listType, LinkedHashMap<Class<?>, String> classTypeNameMap,
			LinkedHashMap<Class<?>, String> classTypeMap,
			Class<?>... readableObjectClasses) throws Exception {
		return getXMLSchemaListTypeForReadableObjects(listType,
				classTypeNameMap, classTypeMap,
				getReadableObjectArray(readableObjectClasses));
	}

	public static String getXMLSchemaListTypeForReadableObjects(
			String listType, LinkedHashMap<Class<?>, String> classTypeNameMap,
			LinkedHashMap<Class<?>, String> classTypeMap,
			ReadableObject... readableObjects) {
		StringBuilder builder = new StringBuilder();

		builder.append("<xs:complexType name=\"" + listType + "\" >\n");
		builder
				.append("  <xs:choice minOccurs=\"0\" maxOccurs=\"unbounded\">\n");
		for (ReadableObject ro : readableObjects) {
			Class<? extends ReadableObject> roClass = ro.getClass();
			String theType = classTypeNameMap.get(roClass);
			if (theType == null) {
				System.out.println("XMLUtils could not find type for "
						+ roClass.getSimpleName());
			}
			builder.append("    <xs:element name=\"" + roClass.getSimpleName()
					+ "\" type=\"" + theType + "\" />\n");
		}
		builder.append("  </xs:choice>\n");

		builder.append("</xs:complexType>\n");
		return builder.toString();
	}

	private static ReadableObject[] getReadableObjectArray(
			Class<?>... readableObjectClasses) throws Exception {
		int i = 0;
		ReadableObject[] objects = new ReadableObject[readableObjectClasses.length];
		for (Class<?> cl : readableObjectClasses) {
			objects[i] = (ReadableObject) cl.newInstance();
			i++;
		}
		return objects;
	}

	public static String getXMLSchemaTypeForReadableObjects(
			LinkedHashMap<Class<?>, String> classTypeNameMap,
			LinkedHashMap<Class<?>, String> classTypeMap,
			Class<?>... readableObjectClasses) throws Exception {
		return getXMLSchemaTypeForReadableObjects(classTypeNameMap,
				classTypeMap, getReadableObjectArray(readableObjectClasses));
	}

	public static String getXMLSchemaTypeForReadableObjects(
			LinkedHashMap<Class<?>, String> classTypeNameMap,
			LinkedHashMap<Class<?>, String> classTypeMap,
			ReadableObject... readableObjects) {
		for (ReadableObject readableObject : readableObjects) {
			getXMLSchemaTypesForReadableObject(readableObject,
					classTypeNameMap, classTypeMap);
		}
		StringBuilder builder = new StringBuilder();

		for (String str : classTypeMap.values()) {
			builder.append(str);
			builder.append("\n");
		}
		return builder.toString();
	}

	public static String getXMLSchemaTypeForReadableObjects(
			ReadableObject... readableObjects) {
		LinkedHashMap<Class<?>, String> classTypeNameMap = new LinkedHashMap<Class<?>, String>();
		LinkedHashMap<Class<?>, String> classTypeMap = new LinkedHashMap<Class<?>, String>();
		return getXMLSchemaTypeForReadableObjects(classTypeNameMap,
				classTypeMap, readableObjects);
	}

	public static boolean getXMLSchemaAttributeOrElement(
			ValidatedProperties pfa, String propName, String fieldName,
			Object propertyValue, StringBuilder elementsBuilder,
			StringBuilder attributesBuilder,
			LinkedHashMap<Class<?>, String> classTypeNameMap,
			LinkedHashMap<Class<?>, String> classTypeMap,
			boolean addAttributeForAllElements, boolean allAttributesString) {

		boolean hasAnElement = false;
		Class<?> propertyClass = propertyValue == null ? String.class
				: propertyValue.getClass();
		if (propertyValue instanceof ReadableObject) {
			ReadableObject ro = (ReadableObject) propertyValue;
			Class<?> roClass = ro.getClass();
			if (!classTypeNameMap.containsKey(roClass)) {
				// We get this class first
				getXMLSchemaTypesForReadableObject(ro, classTypeNameMap,
						classTypeMap);
			}
			String theType = classTypeNameMap.get(roClass);
			elementsBuilder.append("    <xs:element name=\""
					+ roClass.getSimpleName() + "\" type=\"" + theType
					+ "\" />\n");
			if (addAttributeForAllElements) {
				attributesBuilder.append("  <xs:attribute name=\"" + fieldName
						+ "\" type=\"xs:string\" />\n");
			}
			hasAnElement = true;
		} else if (propertyValue instanceof List) {
			LinkedHashSet<Class<?>> listClasses = pfa.getListClasses(propName);
			for (Class<?> listClass : listClasses) {
				ReadableObject listObject;
				try {
					listObject = (ReadableObject) listClass.newInstance();
					getXMLSchemaTypesForReadableObject(listObject,
							classTypeNameMap, classTypeMap);
					elementsBuilder.append("    <xs:element name=\""
							+ listClass.getSimpleName() + "\" type=\""
							+ classTypeNameMap.get(listClass) + "\" />\n");
					hasAnElement = true;
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		} else {
			String xmlSchemaTypeName = "xs:string";
			if (!allAttributesString) {
				if (propertyClass.isEnum()) {
					if (!classTypeNameMap.containsKey(propertyClass)) {
						String xmlSchemaType = getXMLSchemaTypeForEnum(propertyClass);
						classTypeNameMap.put(propertyClass, xmlSchemaTypeName);
						classTypeMap.put(propertyClass, xmlSchemaType);
					}
					xmlSchemaTypeName = getXMLSchemaTypeName(propertyClass);
				} else if (propertyValue instanceof Integer) {
					xmlSchemaTypeName = "xs:integer";
				} else if (propertyValue instanceof Double) {
					xmlSchemaTypeName = "xs:decimal";
				} else if (propertyValue instanceof Boolean) {
					xmlSchemaTypeName = "xs:boolean";
				}
			}
			attributesBuilder.append("  <xs:attribute name=\"" + fieldName
					+ "\" type=\"" + xmlSchemaTypeName + "\" />\n");
		}
		return hasAnElement;
	}

	public static void getXMLSchemaTypesForReadableObject(
			ReadableObject readableObject,
			LinkedHashMap<Class<?>, String> classTypeNameMap,
			LinkedHashMap<Class<?>, String> classTypeMap) {
		Class<? extends ReadableObject> objectClass = readableObject.getClass();

		if (classTypeNameMap.containsKey(objectClass)) {
			// We already have this
			return;
		}

		StringBuilder builder = new StringBuilder();

		PropertyFieldAssociation pfa = readableObject
				.getPropertyFieldAssociation();
		String typeName = getXMLSchemaTypeName(objectClass);

		classTypeNameMap.put(objectClass, typeName);

		builder.append("<xs:complexType name=\"" + typeName + "\" >\n");

		if (pfa != null) {

			StringBuilder elementsBuilder = new StringBuilder();
			StringBuilder attributesBuilder = new StringBuilder();

			elementsBuilder
					.append("  <xs:choice minOccurs=\"0\" maxOccurs=\"unbounded\">\n");

			ArrayList<String> allPropertyNames = pfa.getAllPropertyNames();
			boolean hasAnElement = false;
			for (String propName : allPropertyNames) {

				PropertyToXMLSchemaHandler handler = pfa
						.getToXMLSchemaHandler(propName);

				if (handler == null) {

					Object propertyValue = pfa.getProperty(readableObject,
							propName);

					String fieldName = pfa.getPropertyFieldName(propName);

					hasAnElement = getXMLSchemaAttributeOrElement(pfa,
							propName, fieldName, propertyValue,
							elementsBuilder, attributesBuilder,
							classTypeNameMap, classTypeMap, false, false)
							|| hasAnElement;
				} else {
					hasAnElement = handler.handleToXMLSchema(propName,
							attributesBuilder, elementsBuilder,
							classTypeNameMap, classTypeMap);
				}
			}

			elementsBuilder.append("  </xs:choice>\n");
			if (hasAnElement) {
				builder.append(elementsBuilder.toString());
			}
			builder.append(attributesBuilder.toString());
		} else {
			System.out
					.println("XMLUtils could not get pfa from " + objectClass);
		}

		builder.append("</xs:complexType>\n");

		classTypeMap.put(objectClass, builder.toString());

	}

	public static String getXMLSchemaTypeName(Class<?> theClass) {
		String simpleName = theClass.getSimpleName();
		String typeName = Character.toLowerCase(simpleName.charAt(0))
				+ simpleName.substring(1) + "Type";
		return typeName;
	}

	public static String getXMLSchemaTypeForEnum(Class<?> enumClass) {
		StringBuilder builder = new StringBuilder();

		String typeName = getXMLSchemaTypeName(enumClass);

		builder.append("<xs:simpleType name=\"" + typeName + "\" >\n");
		builder.append("  <xs:restriction base=\"xs:string\" >\n");

		for (Object ec : enumClass.getEnumConstants()) {
			builder.append("    <xs:enumeration value=\"" + ec.toString()
					+ "\" />\n");
		}

		builder.append("  </xs:restriction>\n");
		builder.append("</xs:simpleType>\n");
		return builder.toString();
	}


	public static String formatXmlHomeMade(String xml) throws Exception {
		XmlFormatInfo info = new XmlFormatInfo();
		Element root = parseAndGetElement(xml);
		return formatXmlHomeMade(root, info);
	}

	public static String formatXmlHomeMade(Element root, XmlFormatInfo info) {
		return formatXmlHomeMade(root, info, 0);
	}

	private static void appendBlanks(StringBuilder builder, int blanks) {
		for (int i = 0; i < blanks; i++) {
			builder.append(' ');
		}
	}

	public static String formatXmlHomeMade(Element element) {
		return formatXmlHomeMade(element, new XmlFormatInfo(), 0);
	}
	
	public static String formatXmlHomeMade(Element element, XmlFormatInfo info,
			int columnStart) {
		StringBuilder builder = new StringBuilder();
		appendBlanks(builder, columnStart);

		int currentColumn = columnStart;

		String elementStartString = "<" + element.getTagName();
		builder.append(elementStartString);
		currentColumn += elementStartString.length();

		NamedNodeMap attributes = element.getAttributes();
		int nAttributes = attributes.getLength();
		if (nAttributes > 0) {
			builder.append(" ");
		}
		for (int i = 0; i < nAttributes; i++) {
			if (currentColumn > info.maxColumnWidth) {
				builder.append("\n");
				appendBlanks(builder, columnStart + info.indentStep);
				currentColumn = columnStart + info.indentStep;
			}
			Attr attr = (Attr) attributes.item(i);
			String attrString = getStringAttributeStringNoInitialSpace(attr
					.getValue(), attr.getName());
			currentColumn += attrString.length();
			builder.append(attrString);
		}

		ArrayList<Node> nodes = getChildrenTextCdataElementNodes(element);
		if (nodes.size() == 0) {
			builder.append("/>\n");
		} else {
			builder.append(">\n");

			boolean lastWasTextOrCData = false;
			for (Node child : nodes) {
				short nodeType = child.getNodeType();
				if (nodeType == Node.ELEMENT_NODE) {
					if (lastWasTextOrCData) {
						builder.append("\n");
					}
					builder.append(formatXmlHomeMade((Element) child, info,
							columnStart + info.indentStep));
				} else if (nodeType == Node.TEXT_NODE) {
					if (lastWasTextOrCData) {
						builder.append("\n");
						appendBlanks(builder, columnStart + info.indentStep);
						String text = child.getNodeValue();
						builder.append(text);
						lastWasTextOrCData = true;
					}
				} else if (nodeType == Node.CDATA_SECTION_NODE) {
					if (lastWasTextOrCData) {
						builder.append("\n");
					}
					builder.append("<![CDATA[\n");
					builder.append(child.getNodeValue());
					builder.append("\n]]>");
					lastWasTextOrCData = true;
				}
			}

			appendBlanks(builder, columnStart);
			builder.append("</" + element.getTagName() + ">\n");
		}

		return builder.toString();
	}

	public static String formatXml(String xml) {
		try {

			// String style =
			// "<xsl:stylesheet version=\"1.0\" xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\"> <xsl:output omit-xml-declaration=\"yes\" indent=\"yes\"/> <xsl:template match=\"node()|@*\"> <xsl:copy> <xsl:apply-templates select=\"node()|@*\"/> </xsl:copy> </xsl:template> </xsl:stylesheet>";

			// Use a Transformer for output
			TransformerFactory tFactory = TransformerFactory.newInstance();
			// Source styleSource = new SAXSource(new InputSource(
			// new ByteArrayInputStream(style.getBytes())));

			Transformer serializer = tFactory.newTransformer(); // styleSource);

			serializer.setOutputProperty(OutputKeys.INDENT, "yes");

			Source xmlSource = new SAXSource(new InputSource(
					new ByteArrayInputStream(xml.getBytes())));

			StreamResult res = new StreamResult(new ByteArrayOutputStream());
			serializer.transform(xmlSource, res);
			return new String(((ByteArrayOutputStream) res.getOutputStream())
					.toByteArray());
		} catch (Exception e) {
			e.printStackTrace();
			return xml;
		}
	}

}
