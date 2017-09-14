package com.springworldgames.jcgmusic;

public class PercussionNote {

	private Time start;
	private Time end;
	private int key;
	private int volume;

	public PercussionNote(Time start, Time end, int key, int volume) {
		this.start = start;
		this.end = end;
		this.key = key;
		this.volume = volume;
	}

	@Override
	public String toString() {
		return "PercussionNote start:" + start + " end:" + end + " key:" + key
				+ " volume:" + volume;
	}

	public void translate(int bars) {
		start = start.translateCopy(bars);
		end = end.translateCopy(bars);
	}

	public void translate(Time t) {
		start = start.translateCopy(t);
		end = end.translateCopy(t);
	}

	public Time getStart() {
		return start;
	}

	public Time getEnd() {
		return end;
	}

	public int getKey() {
		return key;
	}

	public int getVolume() {
		return volume;
	}

	
	
}
