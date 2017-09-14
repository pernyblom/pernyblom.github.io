package com.springworldgames.jcgmusic.arrangers;

import com.springworldgames.jcgmusic.Arranger;
import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.Song;

public class SimpleBalladStyleArrangement extends MusicScript implements
		Arranger {

	
	public static Object getScriptName() {
		return "Simple Ballad Style Arrangement";
	}


	@Override
	public void arrange(Song s) {
		int bars = s.getBars();

		s.addTrack("Melody", 73, 127, 64);
		s.addTrack("Alt Voice", 12, 120, 64);

		s.addTrack("Slow Strings", 50, 127, 64);

		if (rndInt(0, 1) == 0)
			s.addTrack("Harph", 47, 127, 64);
		else
			s.addTrack("Guitar", 26, 127, 64);

		for (int i = 0; i < s.getParts(); i++) {
			if (s.getPart(i).getArrHint() == 1)
				s.addRenderEvent("Simple Melody", rndInt(0, 32000), 0, s
						.getPartStartBar(i), s.getPartEndBar(i), 2, createTime(
						0, 0), 0.75);
			if (s.getPart(i).getArrHint() == 2)
				s.addRenderEvent("Simple Melody", rndInt(0, 32000), 1, s
						.getPartStartBar(i), s.getPartEndBar(i), 1, createTime(
						0, 0), 0.75);

			if (s.getPart(i).getArrHint() == 3) {
				s.addRenderEvent("Simple Melody", rndInt(0, 32000), 1, s
						.getPartStartBar(i), s.getPartEndBar(i), rndInt(1, 2),
						createTime(0, 0), 1);
				s.addRenderEvent("Simple Melody", rndInt(0, 32000), 0, s
						.getPartStartBar(i), s.getPartEndBar(i), rndInt(1, 2),
						createTime(0, 0), 1);
				s.addRenderEvent("Shortest Way Chords Smooth",
						rndInt(0, 32000), 2, s.getPartStartBar(i), s
								.getPartEndBar(i), 1, createTime(0, 0), 0.5);
			} else {
				s.addRenderEvent("Simple Bass", rndInt(0, 32000), 2, s
						.getPartStartBar(i), s.getPartEndBar(i), 1, createTime(
						0, 0), 0.5);
			}

		}

		s.addRenderEvent("Shortest Way Chords Smooth", rndInt(0, 32000), 3, 0,
				bars, 0, createTime(0, 0), 0.8);

	}

}
