package com.springworldgames.jcgmusic.arrangers;

import com.springworldgames.jcgmusic.Arranger;
import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.Song;

public class PianoAdvancedDisco extends MusicScript implements Arranger {


	public static Object getScriptName() {
		return "Piano Advanced Disco";
	}

	
	@Override
	public void arrange(Song s) {
		int bars = s.getBars();

		s.addTrack("Melody", 6, 127, 64);
		s.addTrack("Alt Voice", 5, 127, 64);
		s.addTrack("Accomp", 5, 127, 64);
		s.addTrack("Chorus Intro", 4, 127, 64);
		s.addTrack("Accomp boost", 6, 127, 64);

		int intro_seed = rndInt(0, 32000);

		for (int i = 0; i < s.getParts(); i++) {
			int end = s.getPartEndBar(i);

			if (i == s.getParts() - 1)
				end--;

			if (s.getPart(i).getArrHint() == 0) {
				s.addRenderEvent("Shortest Way Chords Simple",
						rndInt(0, 32000), rndInt(0, 1), s.getPartStartBar(i), s
								.getPartEndBar(i), rndInt(1, 2), createTime(0,
								0), 0.8);
			}

			if (s.getPart(i).getArrHint() == 1) {
				s.addRenderEvent("Simple Melody", rndInt(0, 32000), 0, s
						.getPartStartBar(i), s.getPartEndBar(i), 1, createTime(
						0, 0), 1.0);
			}

			if (s.getPart(i).getArrHint() == 2) {
				s.addRenderEvent("Simple Melody", rndInt(0, 32000), 1, s
						.getPartStartBar(i), s.getPartEndBar(i), 1, createTime(
						0, 0), 1.0);
			}

			if (s.getPart(i).getArrHint() == 3) {
				s.addRenderEvent("Simple Melody", rndInt(0, 32000), 0, s
						.getPartStartBar(i), s.getPartEndBar(i), 1, createTime(
						0, 0), 1.0);
				s.addRenderEvent("Simple Melody", rndInt(0, 32000), 1, s
						.getPartStartBar(i), s.getPartEndBar(i), 2, createTime(
						0, 0), 1.0);
				s.addRenderEvent("Disco Jumping Bass", rndInt(0, 32000), 4, s
						.getPartStartBar(i), end, -1, createTime(0, 0), 1.0);
				s.addRenderEvent("Random Bass", rndInt(0, 32000), 3, s
						.getPartStartBar(i), end, rndInt(0, 2),
						createTime(0, 0), 0.8);
			}
		}

		s.addRenderEvent("Quick Intro Bass", intro_seed, 3, bars - 1, bars, -1,
				createTime(1, 0), 1.0);
		s.addRenderEvent("Quick Intro Bass", intro_seed, 3, bars - 1, bars, 0,
				createTime(1, 0), 1.0);
		s.addRenderEvent("Simple Chords", rndInt(0, 32000), 3, bars - 1, bars,
				2, createTime(0, 0), 1.0);
		s.addRenderEvent("Simple Chords", rndInt(0, 32000), 3, bars - 1, bars,
				3, createTime(1, 0), 1.0);
		s.addRenderEvent("Disco Jumping Bass", rndInt(0, 32000), 2, 0,
				bars - 1, 0, createTime(0, 0), 0.9);

	}

}
