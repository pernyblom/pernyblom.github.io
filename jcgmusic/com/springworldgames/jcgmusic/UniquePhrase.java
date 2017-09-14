package com.springworldgames.jcgmusic;

import java.util.ArrayList;

public class UniquePhrase {

	public int metrum = 4;
	public int bars = 2;
	public ArrayList<Event> events = new ArrayList<Event>();
	private boolean startsPart;
	private boolean endsPart;
	private boolean startsSentence;
	private boolean endsSentence;
	private int id;
	
	public void setBars(int bars) {
		this.bars = bars;
	}

	public int getBars() {
		return bars;
	}
	
	public void setMetrum(int metrum) {
		this.metrum = metrum;
	}
	
	public int getMetrum() {
		return metrum;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public int getId() {
		return id;
	}
	
	public void setStartsPart(boolean startsPart) {
		this.startsPart = startsPart;
	}
	
	public boolean startsPart() {
		return startsPart;
	}

	public void setEndsPart(boolean endsPart) {
		this.endsPart = endsPart;
	}
	
	public boolean endsPart() {
		return endsPart;
	}

	public void setStartsSentence(boolean startsSentence) {
		this.startsSentence = startsSentence;
	}
	
	public boolean startsSentence() {
		return startsSentence;
	}
	
	public void setEndsSentence(boolean endsSentence) {
		this.endsSentence = endsSentence;
	}
	
	public boolean endsSentence() {
		return endsSentence;
	}
	
	public void addEvent(Time begin, Time end) {
		Event event = new Event(begin, end);
		events.add(event);
	}

	public int getEvents() {
		return events.size();
	}
	
	public Event getEvent(int index) {
		return events.get(index);
	}
	
}
