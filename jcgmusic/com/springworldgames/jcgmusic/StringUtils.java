package com.springworldgames.jcgmusic;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Collection;
import java.util.Iterator;

public class StringUtils {

	public static String constantToNormalString(String constantString) {
		StringBuilder builder = new StringBuilder();
		int length = constantString.length();
		for (int i = 0; i < length; i++) {
			char ch = constantString.charAt(i);
			if (i == 0) {
				builder.append(Character.toLowerCase(ch));
			} else {
				if (ch == '_') {
					builder.append(" ");
				} else {
					builder.append(Character.toLowerCase(ch));
				}
			}
		}
		return builder.toString();
	}

	public static String inputStreamToString(InputStream is) throws IOException {
		if (is != null) {
			StringBuilder sb = new StringBuilder();
			String line;

			try {
				BufferedReader reader = new BufferedReader(
						new InputStreamReader(is, "UTF-8"));
				while ((line = reader.readLine()) != null) {
					sb.append(line).append("\n");
				}
			} finally {
				is.close();
			}
			return sb.toString();
		} else {
			return "";
		}
	}

	public static String emptyIfNull(Object o, String s) {
		if (o == null) {
			return "";
		} else {
			return s;
		}
	}

	public static InputStream stringToInputStream(String str, String encoding)
			throws Exception {
		byte[] bytes = str.getBytes(encoding);
		return new ByteArrayInputStream(bytes);
	}

	public static InputStream stringToInputStream(String str) throws Exception {
		byte[] bytes = str.getBytes("utf-8");
		return new ByteArrayInputStream(bytes);
	}

	public static void appendMany(StringBuilder builder, int n, String str) {
		for (int i = 0; i < n; i++) {
			builder.append(str);
		}
	}

	public static String mergeWithSeparator(String[] arr, String separator) {
		String result = "";
		for (int i = 0; i < arr.length; i++) {
			result += arr[i];
			if (i < arr.length - 1) {
				result += separator;
			}
		}
		return result;
	}

	public static void mergeWithSeparator(StringBuilder builder,
			Collection<? extends Object> collection, String separator) {
		Iterator<? extends Object> iterator = collection.iterator();
		while (iterator.hasNext()) {
			Object next = iterator.next();
			builder.append(next.toString());
			if (iterator.hasNext()) {
				builder.append(separator);
			}
		}
	}

	// public static void main(String[] args) throws Exception {
	// stringToInputStream("hej bla bal", "utf-8");
	// }
}
