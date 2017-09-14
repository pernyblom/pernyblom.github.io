package com.springworldgames.jcgmusic;

import java.util.ArrayList;

public class Part {

	private int startBar;
	private int endBar;
	private int uniquePart;

	private double tempoMod = 1.0;
	private int transpose = 0;
	private String scale = MusicScript.MAJOR;
	private int arrHint = 3;

	int[] currentScale = MusicScript.majorAbsSteps;
	public static final int CHROMATIC_BASE = 45;

	ArrayList<ChromaticEvent> chromaticEvents = new ArrayList<ChromaticEvent>();

	public ArrayList<ChromaticEvent> getChromaticEventList() {
		return chromaticEvents;
	}

	@Override
	public String toString() {
		return "Part startBar: " + startBar + " endBar: " + endBar
				+ " uniquePart: " + uniquePart + " tempoMod: " + tempoMod
				+ " transpose: " + transpose + " scale: " + scale
				+ " arrHint: " + arrHint;
	}

	public int getStartBar() {
		return startBar;
	}

	public int getEndBar() {
		return endBar;
	}

	public int getUniquePart() {
		return uniquePart;
	}

	public void setUniquePart(int uniquePart) {
		this.uniquePart = uniquePart;
	}

	public double getTempoMod() {
		return tempoMod;
	}

	public void setTempoMod(double tempoMod) {
		this.tempoMod = tempoMod;
	}

	public int getTranspose() {
		return transpose;
	}

	public void setTranspose(int transpose) {
		this.transpose = transpose;
	}

	public String getScale() {
		return scale;
	}

	public void setScale(String scale) {
		this.scale = scale;
		currentScale = MusicScript.getScaleOffsets(scale);
	}

	public int getArrHint() {
		return arrHint;
	}

	public void setArrHint(int arrHint) {
		this.arrHint = arrHint;
	}

	public void setStartBar(int startBar) {
		this.startBar = startBar;
	}

	public void setEndBar(int endBar) {
		this.endBar = endBar;
	}

	public void addEvent(Time start, Time end, int chromaticNote) {
		chromaticEvents.add(new ChromaticEvent(start.copy(), end.copy(),
				chromaticNote));
	}

	public int computePitch(int scaleNote) {
		int scaleIndex = scaleNote - 1;

		int octaveOffset = 0;
		while (scaleIndex < 0) {
			scaleIndex += 7;
			octaveOffset--;
		}
		while (scaleIndex > 6) {
			scaleIndex -= 7;
			octaveOffset++;
		}

		return CHROMATIC_BASE + transpose + currentScale[scaleIndex] + 12
				* octaveOffset;
	}

	public int[] getScaleOffsets() {
		return currentScale;
	}

}
