package com.springworldgames.jcgmusic;


public class Harmonic {

	private int[] offsets;
	private Time startTime;
	private Time endTime;
	private int baseNote; // Scale index
	private String chordString;

	public Harmonic() {
	}

	public Interval2D toInterval2D(int metrum) {
		return new Interval2D(startTime.getPosition(metrum), endTime
				.getPosition(metrum));
	}

	public Harmonic copy() {
		Harmonic result = new Harmonic();
		result.offsets = offsets.clone();
		result.startTime = startTime.copy();
		result.endTime = endTime.copy();
		result.baseNote = baseNote;
		result.chordString = chordString;
		return result;
	}

	public int[] getOffsets() {
		return offsets;
	}

	@Override
	public String toString() {
		return "Harmonic startTime: " + startTime
				+ (endTime == null ? "" : " endTime: " + endTime)
				+ " baseNote: " + baseNote + " chord: " + chordString;
	}

	public Time getStartTime() {
		return startTime.copy();
	}

	public Time getEndTime() {
		return endTime.copy();
	}

	public int getBaseNote() {
		return baseNote;
	}

	public String getChordString() {
		return chordString;
	}

	public void setEndTime(Time t) {
		endTime = t.copy();
	}

	public Harmonic(Time time, int baseNote, String chordString) {
		this.startTime = time;
		this.baseNote = baseNote;
		this.chordString = chordString;

		offsets = new int[chordString.length()];
		// parsing chord string into indices
		for (int i = 0; i < chordString.length(); i++) {
			char ch = chordString.charAt(i);
			switch (ch) {
			case '1':
				offsets[i] = 0;
				break;
			case '2':
				offsets[i] = 1;
				break;
			case '3':
				offsets[i] = 2;
				break;
			case '4':
				offsets[i] = 3;
				break;
			case '5':
				offsets[i] = 4;
				break;
			case '6':
				offsets[i] = 5;
				break;
			case '7':
				offsets[i] = 6;
				break;
			}
		}
	}

	public int[] getScaleDegrees() {
		int[] result = new int[offsets.length];
		for (int i = 0; i < offsets.length; i++) {
			result[i] = (baseNote - 1 + offsets[i]) % 7; // Greatest assumption
			// of all :)
		}
		return result;
	}

	public void translate(int bars) {
		startTime = startTime.translateCopy(bars);
		endTime = endTime.translateCopy(bars);
	}

}
