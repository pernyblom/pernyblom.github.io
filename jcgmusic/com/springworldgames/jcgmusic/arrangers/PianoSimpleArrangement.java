package com.springworldgames.jcgmusic.arrangers;

import com.springworldgames.jcgmusic.Arranger;
import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.Song;

public class PianoSimpleArrangement extends MusicScript implements Arranger {

	public static Object getScriptName() {
		return "Piano Simple Arrangement";
	}


	@Override
	public void arrange(Song s) {
		int bars = s.getBars();

		s.addTrack("Melody", 1, 127, 64);
		s.addTrack("Alt Voice", 2, 127, 64);
		s.addTrack("Chords", 1, 127, 64);

		for (int i = 0; i < s.getParts(); i++) {
			if (s.getPart(i).getArrHint() == 1)
				s.addRenderEvent("Simple Melody", rndInt(0, 32000), 0, s
						.getPartStartBar(i), s.getPartEndBar(i), 1, createTime(
						0, 0), 1);
			if (s.getPart(i).getArrHint() == 2)
				s.addRenderEvent("Simple Melody", rndInt(0, 32000), 1, s
						.getPartStartBar(i), s.getPartEndBar(i), 1, createTime(
						0, 0), 1);
			if (s.getPart(i).getArrHint() == 3) {
				s.addRenderEvent("Simple Melody", rndInt(0, 32000), 0, s
						.getPartStartBar(i), s.getPartEndBar(i), 1, createTime(
						0, 0), 1);
				s.addRenderEvent("Simple Melody", rndInt(0, 32000), 1, s
						.getPartStartBar(i), s.getPartEndBar(i), 2, createTime(
						0, 0.05), 0.8);
			}

		}

		s.addRenderEvent("Simple Chords", rndInt(0, 32000), 2, 0, bars, 0,
				createTime(0, 0), 0.8);
	}

}
