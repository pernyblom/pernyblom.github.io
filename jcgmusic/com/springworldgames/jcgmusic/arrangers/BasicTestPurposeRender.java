package com.springworldgames.jcgmusic.arrangers;

import com.springworldgames.jcgmusic.Arranger;
import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.Song;

public class BasicTestPurposeRender extends MusicScript implements Arranger {

	public BasicTestPurposeRender(int seed) {
		super();
	}

	@Override
	public void arrange(Song s) {
		int bars = s.getBars();

		// The arrangement
		s.addTrack("Melody", 1, 127, 63);
		s.addTrack("Drums", 1, 127, 63);

		s.addRenderEvent("Simple Melody", rndInt(0, 32000), 0, 0, bars, 0,
				createTime(0, 0), 1);
		s.addRenderEvent("Metronome", rndInt(0, 32000), 1, 0, bars, 0,
				createTime(0, 0), 1);
	}

}
