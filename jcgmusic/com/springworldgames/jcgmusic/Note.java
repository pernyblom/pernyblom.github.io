package com.springworldgames.jcgmusic;

public class Note {

	private Time start;
	private Time end;
	private int pitch;
	private int volume;

	public Note(Time start, Time end, int pitch, int volume) {
		this.start = start;
		this.end = end;
		this.pitch = pitch;
		this.volume = volume;
	}

	
	@Override
	public String toString() {
		return "Note start:" + start + " end:" + end + " pitch:" + pitch + " volume:" + volume;
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


	public int getPitch() {
		return pitch;
	}


	public int getVolume() {
		return volume;
	}
	
	
}
