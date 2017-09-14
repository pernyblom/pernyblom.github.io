package com.springworldgames.objectreader.common;

public class GeneralPair<S extends Object, T extends Object> {

	public S first;
	public T second;

	public GeneralPair(S f, T s) {
		first = f;
		second = s;
	}

	@Override
	public String toString() {
		return "<" + first + "," + second + ">";
	}

}
