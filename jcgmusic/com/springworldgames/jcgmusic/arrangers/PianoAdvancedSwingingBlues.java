package com.springworldgames.jcgmusic.arrangers;

import com.springworldgames.jcgmusic.Arranger;
import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.Song;

public class PianoAdvancedSwingingBlues extends MusicScript implements Arranger {


	public static Object getScriptName() {
		return "Piano Advanced Swinging Blues";
	}

	
	@Override
	public void arrange(Song s) {

		int bars = s.getBars();

		s.addTrack("Melody", rndInt(2, 4), 127, 64);
		s.addTrack("Alt Mel", rndInt(2, 4), 127, 64);
		s.addTrack("Acc", rndInt(1, 4), 127, 64);
		s.addTrack("Bass", rndInt(1, 4), 127, 64);

		for (int i = 0; i < s.getParts(); i++) {
			if (s.getPart(i).getArrHint() == 0) {

				s.addRenderEvent("Random Bass", rndInt(0, 32000), 3, s
						.getPartStartBar(i), s.getPartEndBar(i), 0, createTime(
						0, 0), 1);
			}

			if (s.getPart(i).getArrHint() == 1) {
				s.addRenderEvent("Simple Melody", rndInt(0, 32000), 0, s
						.getPartStartBar(i), s.getPartEndBar(i), 2, createTime(
						0, 0), 1);

				s.addRenderEvent("Random Bass", rndInt(0, 32000), 3, s
						.getPartStartBar(i), s.getPartEndBar(i), 0, createTime(
						0, 0), 1);
			}

			if (s.getPart(i).getArrHint() == 2) {
				s.addRenderEvent("Simple Melody", rndInt(0, 32000), 1, s
						.getPartStartBar(i), s.getPartEndBar(i), 2, createTime(
						0, 0), 1);

				s.addRenderEvent("Random Bass", rndInt(0, 32000), 3, s
						.getPartStartBar(i), s.getPartEndBar(i), 0, createTime(
						0, 0), 1);
			}

			if (s.getPart(i).getArrHint() == 3) {
				s.addRenderEvent("Chordal Melody", rndInt(0, 32000), 0, s
						.getPartStartBar(i), s.getPartEndBar(i), 2, createTime(
						0, 0), 1);
				s.addRenderEvent("Simple Melody", rndInt(0, 32000), 1, s
						.getPartStartBar(i), s.getPartEndBar(i), 3, createTime(
						0, 0), 0.8);
				s.addRenderEvent("Swinging Blues", rndInt(0, 32000), 1, s
						.getPartStartBar(i), s.getPartEndBar(i) - 1, 1,
						createTime(0, 0), 0.75);
				s.addRenderEvent("Random Bass", 1, 3, s.getPartStartBar(i), s
						.getPartEndBar(i), -1, createTime(0, 0), 1);
			}
		}

		s.addRenderEvent("Swinging Blues", rndInt(0, 32000), 2, s
				.getPartEndBar(0) - 1, s.getPartEndBar(0), 0, createTime(-(s
				.getPartEndBar(0) - s.getPartStartBar(0)), 0), 0.5);
		s.addRenderEvent("Swinging Blues", rndInt(0, 32000), 2, 0, bars - 1, 0,
				createTime(0, 0), 0.8);
		s.addRenderEvent("Simple Chords", rndInt(0, 32000), 2, bars - 1, bars,
				0, createTime(0, 0), 1);

	}

}
