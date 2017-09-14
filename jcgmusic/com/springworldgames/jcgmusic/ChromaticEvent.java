package com.springworldgames.jcgmusic;

public class ChromaticEvent extends AbstractEvent {

	private int chromaticNote;

	@Override
	public String toString() {
		return "ChromaticEvent begin: " + getStart() + " end: " + getEnd()
				+ " chromaticNote: " + chromaticNote;
	}

	public ChromaticEvent(Time begin, Time end, int chrPitch) {
		super(begin, end);
		this.chromaticNote = chrPitch;
	}

	public ChromaticEvent(Time begin, Time end) {
		this(begin, end, 0);
	}

	public ChromaticEvent copy() {
		return new ChromaticEvent(getStart().copy(), getEnd().copy(),
				chromaticNote);
	}

	public int getChromaticNote() {
		return chromaticNote;
	}

	public void setChromaticNote(int pitch) {
		this.chromaticNote = pitch;
	}

}
