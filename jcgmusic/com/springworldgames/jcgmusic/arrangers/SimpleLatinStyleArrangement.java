package com.springworldgames.jcgmusic.arrangers;

import com.springworldgames.jcgmusic.Arranger;
import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.Song;

public class SimpleLatinStyleArrangement extends MusicScript implements
		Arranger {


	public static Object getScriptName() {
		return "Simple Latin Style Arrangement";
	}

	@Override
	public void arrange(Song s) {
		int bars = s.getBars();

		int[] patches = { 109, 107, 106, 12, 11, 13, 19, 76, 78, 80, 72, 65,
				47, 24, 23, 73, 73, 73 };

		s.addTrack("Melody", getRandom(patches), 127, 64);
		s.addTrack("Alt Voice", 2, 127, 64);
		s.addTrack("Fill", 50, 127, 64);
		s.addTrack("Bass", 33, 127, 64);
		if (rndInt(0, 1) != 0)
			s.addTrack("Accomp", rndInt(1, 6), 127, 64); // accomp = piano
		else
			s.addTrack("Accomp", 25, 127, 64); // accomp = guitar
		s.addTrack("Drums", 1, 127, 64);

		int chorus_seed = rndInt(0, 32000);
		int normal_seed = rndInt(0, 32000);

		for (int i = 0; i < s.getParts(); i++) {
			if (s.getPart(i).getArrHint() == 0) {

			}

			if (s.getPart(i).getArrHint() == 1) {
				s.addRenderEvent("Simple Melody", rndInt(0, 32000), 0, s
						.getPartStartBar(i), s.getPartEndBar(i), 2, createTime(
						0, 0), 0.95);
			}

			if (s.getPart(i).getArrHint() == 2) {
				s.addRenderEvent("Simple Melody", rndInt(0, 32000), 1, s
						.getPartStartBar(i), s.getPartEndBar(i), 2, createTime(
						0, 0), 0.95);
			}

			if (s.getPart(i).getArrHint() == 3) {
				s.addRenderEvent("Simple Melody", rndInt(0, 32000), 0, s
						.getPartStartBar(i), s.getPartEndBar(i), 2, createTime(
						0, 0), 1.0);
				s.addRenderEvent("Chordal Melody", rndInt(0, 32000), 1, s
						.getPartStartBar(i), s.getPartEndBar(i), 2, createTime(
						0, 0), 1.0);
				s.addRenderEvent("Latin Chords", chorus_seed, 4, s
						.getPartStartBar(i), s.getPartEndBar(i), 1, createTime(
						0, 0), 0.9);
				s.addRenderEvent("Latin Bass", rndInt(0, 32000), 3, s
						.getPartStartBar(i), s.getPartEndBar(i), -1,
						createTime(0, 0), 1.0);
				s.addRenderEvent("Shortest Way Chords Simple",
						rndInt(0, 32000), 2, s.getPartStartBar(i), s
								.getPartEndBar(i), 1, createTime(0, 0), 0.65);
				s.addRenderEvent("Drums - Latin", chorus_seed, 5, s
						.getPartStartBar(i), s.getPartEndBar(i), 1, createTime(
						0, 0), 0.85);
			} else {
				s.addRenderEvent("Latin Chords", normal_seed, 4, s
						.getPartStartBar(i), s.getPartEndBar(i), 1, createTime(
						0, 0), 0.75);
				s.addRenderEvent("Latin Bass", rndInt(0, 32000), 3, s
						.getPartStartBar(i), s.getPartEndBar(i), -1,
						createTime(0, 0), 0.95);
				s.addRenderEvent("Shortest Way Chords Simple",
						rndInt(0, 32000), 2, s.getPartStartBar(i), s
								.getPartEndBar(i), 1, createTime(0, 0), 0.5);
				s.addRenderEvent("Drums - Latin", normal_seed, 5, s
						.getPartStartBar(i), s.getPartEndBar(i), 1, createTime(
						0, 0), 0.8);
			}
		}
	}

}
