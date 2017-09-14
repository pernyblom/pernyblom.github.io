package com.springworldgames.jcgmusic;

import java.util.ArrayList;

public class Track {

	private String name;
	private int patch;
	private int vol;
	private int pan;

	private ArrayList<RenderEvent> renderEvents = new ArrayList<RenderEvent>();
	
	public Track(String name, int patch, int vol, int pan) {
		this.name = name;
		this.patch = patch;
		this.vol = vol;
		this.pan = pan;
	}

	
	
	public String getName() {
		return name;
	}



	public int getPatch() {
		return patch;
	}



	public int getVol() {
		return vol;
	}



	public int getPan() {
		return pan;
	}



	public void addRenderEvent(RenderEvent event) {
		renderEvents.add(event);
	}
	
	public ArrayList<RenderEvent> getRenderEvents() {
		return renderEvents;
	}
	
	
}
