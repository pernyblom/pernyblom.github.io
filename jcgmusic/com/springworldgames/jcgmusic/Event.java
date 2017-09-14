package com.springworldgames.jcgmusic;

public class Event extends AbstractEvent {

	private int pitch;

	@Override
	public String toString() {
		return "Event begin: " + getStart() + " end: " + getEnd() + " pitch: " + pitch;
	}

	public Event(Time begin, Time end, int pitch) {
		super(begin, end);
		this.pitch = pitch;
	}

	public Event(Time begin, Time end) {
		this(begin, end, 0);
	}

	public Event copy() {
		return new Event(getStart().copy(), getEnd().copy(), pitch);
	}

	public int getPitch() {
		return pitch;
	}

	public void setPitch(int pitch) {
		this.pitch = pitch;
	}

}
