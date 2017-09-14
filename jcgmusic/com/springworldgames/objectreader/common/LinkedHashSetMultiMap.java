package com.springworldgames.objectreader.common;

import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

public class LinkedHashSetMultiMap<K, S> implements Iterable<LinkedHashSet<S>>,
		Map<K, LinkedHashSet<S>> {

	LinkedHashMap<K, LinkedHashSet<S>> theMap = new LinkedHashMap<K, LinkedHashSet<S>>();

	// Total number of items in all the sets
	public int totalSize() {
		int result = 0;
		for (LinkedHashSet<S> s : theMap.values()) {
			result += s.size();
		}
		return result;
	}
	
	public boolean remove(K k, S s) {
		LinkedHashSet<S> set = theMap.get(k);
		if (set != null) {
			return set.remove(s);
		}
		return false;
	}

	// Shallow copy
	public LinkedHashSetMultiMap<K, S> copy() {
		LinkedHashSetMultiMap<K, S> result = new LinkedHashSetMultiMap<K, S>();
		for (K key : theMap.keySet()) {
			LinkedHashSet<S> set = theMap.get(key);
			for (S value : set) {
				result.add(key, value);
			}
		}
		return result;
	}

	public int size() {
		return theMap.size();
	}

	public LinkedHashSetMultiMap<K, S> add(K key, S value) {
		LinkedHashSet<S> c = theMap.get(key);
		if (c == null) {
			c = new LinkedHashSet<S>();
			theMap.put(key, c);
		}
		c.add(value);
		return this;
	}

	public LinkedHashSetMultiMap<K, S> addAll(K key, S... values) {
		if (values.length > 0) {
			LinkedHashSet<S> c = theMap.get(key);
			if (c == null) {
				c = new LinkedHashSet<S>();
				theMap.put(key, c);
			}
			for (S value : values) {
				c.add(value);
			}
		}
		return this;
	}

	public LinkedHashSetMultiMap<K, S> addAll(K key, Collection<S> values) {
		if (values.size() > 0) {
			LinkedHashSet<S> c = theMap.get(key);
			if (c == null) {
				c = new LinkedHashSet<S>();
				theMap.put(key, c);
			}
			for (S value : values) {
				c.add(value);
			}
		}
		return this;
	}

	public LinkedHashSet<S> getIntersection(K... keys) {
		LinkedHashSet<S> result = new LinkedHashSet<S>();
		boolean firstTime = true;
		for (K k : keys) {
			LinkedHashSet<S> set = theMap.get(k);
			if (set == null) {
				// One of the sets was empty
				return new LinkedHashSet<S>(0);
			}
			if (firstTime) {
				result.addAll(set);
				firstTime = false;
			} else {
				Iterator<S> iterator = result.iterator();
				while (iterator.hasNext()) {
					S v = iterator.next();
					if (!set.contains(v)) {
						iterator.remove();
					}
				}
			}
		}
		return result;
	}

	public LinkedHashSet<GeneralPair<K, S>> getAllPossiblePairs() {
		LinkedHashSet<GeneralPair<K, S>> result = new LinkedHashSet<GeneralPair<K, S>>();
		for (K key : theMap.keySet()) {
			LinkedHashSet<S> list = theMap.get(key);
			for (S value : list) {
				result.add(new GeneralPair<K, S>(key, value));
			}
		}
		return result;
	}

	@Override
	public Iterator<LinkedHashSet<S>> iterator() {
		return theMap.values().iterator();
	}

	@Override
	public boolean containsKey(Object arg0) {
		return theMap.containsKey(arg0);
	}

	@Override
	public boolean containsValue(Object value) {
		return theMap.containsValue(value);
	}

	@Override
	public Set<java.util.Map.Entry<K, LinkedHashSet<S>>> entrySet() {
		return theMap.entrySet();
	}

	@Override
	public boolean isEmpty() {
		return theMap.isEmpty();
	}

	@Override
	public Set<K> keySet() {
		return theMap.keySet();
	}

	@Override
	public LinkedHashSet<S> put(K key, LinkedHashSet<S> value) {
		return theMap.put(key, value);
	}

	@Override
	public void putAll(Map<? extends K, ? extends LinkedHashSet<S>> m) {
		theMap.putAll(m);
	}

	@Override
	public Collection<LinkedHashSet<S>> values() {
		return theMap.values();
	}

	@Override
	public void clear() {
		theMap.clear();
	}

	@Override
	public LinkedHashSet<S> get(Object key) {
		return theMap.get(key);
	}

	@Override
	public LinkedHashSet<S> remove(Object key) {
		return theMap.remove(key);
	}

}
