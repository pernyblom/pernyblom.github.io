package com.springworldgames.jcgmusic;

import java.util.LinkedHashMap;

public class RenderEvent {

	private final String scriptName;
	private final int seed;

	private final int initialStep;
	private final int finalStep;
	private final int octave;
	private final Time timeOffset;
	private final double volMult;

	LinkedHashMap<String, String> parameters = new LinkedHashMap<String, String>();
	
	@Override
	public String toString() {
		return "RenderEvent script:" + scriptName + " seed: " + seed;
	}
	
	public RenderEvent(String scriptName, int seed, int initialBar,
			int finalBar, int octave, Time timeOffset, double volMult) {
		this.scriptName = scriptName;
		this.seed = seed;
		this.initialStep = initialBar;
		this.finalStep = finalBar;
		this.octave = octave;
		this.timeOffset = timeOffset;
		this.volMult = volMult;
	}

	public String getParam(String name) {
		return parameters.get(name);
	}
	
	public void setParam(String name, String value) {
		parameters.put(name, value);
	}
	
	
	public String getScriptName() {
		return scriptName;
	}

	public int getSeed() {
		return seed;
	}

	public int getInitialStep() {
		return initialStep;
	}

	public int getFinalStep() {
		return finalStep;
	}

	public int getOctave() {
		return octave;
	}

	public Time getTimeOffset() {
		return timeOffset;
	}

	public double getVolMult() {
		return volMult;
	}
	

}
