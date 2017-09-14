package com.springworldgames.jcgmusic;

import java.util.ArrayList;
import java.util.Random;

public class Song {

	int seed = 10;
	Random rnd = new Random(10);
	
	ArrayList<Track> tracks = new ArrayList<Track>();
	ArrayList<UniquePart> uniqueParts = new ArrayList<UniquePart>();
	ArrayList<Part> parts = new ArrayList<Part>();
	ArrayList<TempoMod> tempoMods = new ArrayList<TempoMod>();

	private int tempo = 120;
	private RenderEvent latestRenderEvent;
	private SongCreator creator;

	public Song(SongCreator creator) {
		this.creator = creator;
	}
	
	public SongCreator getCreator() {
		return creator;
	}
	
	public int getTempo() {
		return tempo;
	}
	
	public void setTempo(int tempo) {
		this.tempo = tempo;
	}
	
	public void setSeed(int seed) {
		rnd = new Random(seed);
		this.seed = seed;
	}
	
	public ArrayList<Track> getTracks() {
		return tracks;
	}

	public void setUniqueParts(int count) {
		Utils.setSize(count, uniqueParts, UniquePart.class);
		setSeed(seed);
		for (UniquePart up : uniqueParts) {
			up.randomize(this, rnd);
		}
	}

	public int getUniqueParts() {
		return uniqueParts.size();
	}

	public UniquePart getUniquePart(int index) {
		// Utils.expandIfNeccessary(index, uniqueParts, UniquePart.class);
		return uniqueParts.get(index);
	}

	public void setParts(int count) {
		Utils.setSize(count, parts, Part.class);
	}

	public int getParts() {
		return parts.size();
	}

	public Part getPart(int index) {
		// Utils.expandIfNeccessary(index, parts, Part.class);
		return parts.get(index);
	}


	public int getBars() {
		int bars = 0;
		for (Part part : parts) {
			int upIndex = part.getUniquePart();
			UniquePart up = uniqueParts.get(upIndex);
			bars += up.getBars();
		}
		return bars;
	}

	public int getPartStartBar(int index) {
		Part part = parts.get(index);
		return part.getStartBar();
	}

	public int getPartEndBar(int index) {
		Part part = parts.get(index);
		return part.getEndBar();
	}

	public void addTrack(String name, int patch, int vol, int pan) {
		tracks.add(new Track(name, patch, vol, pan));
	}

	public void addRenderEvent(String scriptName, int seed, int trackIndex,
			int initialBar, int finalBar, int octave, Time timeOffset,
			double volMult) {
		Track track = tracks.get(trackIndex);
		// Try to find the part index
		// int partIndex = -1;
		// for (int i=0; i<parts.size(); i++) {
		// Part p = parts.get(i);
		// int pStart = p.GetStartBar();
		// int pEnd = p.GetEndBar();
		// double center = (pStart + pEnd) / 2.0;
		// if (center >= initialBar && center <= finalBar) {
		// partIndex = i;
		// }
		// }
		// if (partIndex == -1) {
		// System.out.println(this +
		// " could not find the part for this render event");
		// partIndex = 0;
		// }

		RenderEvent event = new RenderEvent(scriptName, seed, initialBar,
				finalBar, octave, timeOffset, volMult);

		latestRenderEvent = event;
		track.addRenderEvent(event);
	}

	public void setParam(String name, String value) {
		latestRenderEvent.setParam(name, value);
	}

	public void addTempoMod(Time pos, double val) {
		tempoMods.add(new TempoMod(pos, val));
	}
	
	public ArrayList<TempoMod> getTempoMods() {
		return tempoMods;
	}

}
