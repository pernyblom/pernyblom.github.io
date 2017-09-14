package com.springworldgames.jcgmusic;

public class TempoMod {

	private final Time pos;
	private final double mod;

	public TempoMod(Time pos, double mod) {
		this.pos = pos;
		this.mod = mod;
	}

	public Time getPos() {
		return pos;
	}

	public double getMod() {
		return mod;
	}
	
}
