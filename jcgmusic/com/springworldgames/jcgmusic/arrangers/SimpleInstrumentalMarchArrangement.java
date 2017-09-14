package com.springworldgames.jcgmusic.arrangers;

import com.springworldgames.jcgmusic.Arranger;
import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.Song;

public class SimpleInstrumentalMarchArrangement extends MusicScript implements
		Arranger {


	public static Object getScriptName() {
		return "Simple Instrumental March Arrangement";
	}

	@Override
	public void arrange(Song s) {
		int bars = s.getBars();

		if (rndInt(0, 3) != 0)
			s.addTrack("Drums", 49, 120, 64);
		else
			s.addTrack("Drums", 1, 120, 64);

		s.addTrack("Tuba", 59, 127, 72);
		s.addTrack("Bass", 64, 111, 72);

		s.addTrack("Glockenspel", 10, 115, 80);

		s.addTrack("Picolo", 73, 92, 30);

		s.addTrack("Trumpet", 57, 127, 72);
		s.addTrack("French Horn", 61, 120, 72);

		s.addTrack("Tuba2", 59, 125, 59);

		s.addRenderEvent("Drums - March", rndInt(0, 32000), 0, 0, bars, 1,
				createTime(0, 0), 1.0);
		s.setParam("foot", "" + 1);

		s.addRenderEvent("March Chords", rndInt(0, 32000), 1, 0, bars, 0,
				createTime(0, 0), 1.1);
		s.addRenderEvent("March Bass", rndInt(0, 32000), 1, 0, bars, -1,
				createTime(0, 0), 1.1);

		s.addRenderEvent("March Picolo", rndInt(0, 32000), 4, 0, bars, 4,
				createTime(0, 0), 1.0);

		for (int i = 0; i < s.getParts(); i++) {
			if (s.getPart(i).getArrHint() == 0) {
				if (rndInt(0, 1) == 0) {
					s.addRenderEvent("Drums - March", rndInt(0, 32000), 0, s
							.getPartStartBar(i), s.getPartEndBar(i), 1,
							createTime(0, 0), 1.0);
					s.setParam("cymbal", "" + 1);
				}
			} else {
				if (s.getPart(i).getArrHint() == 3)
					s.addRenderEvent("Simple Melody", rndInt(0, 32000), 3, s
							.getPartStartBar(i), s.getPartEndBar(i), 3,
							createTime(0, 0), 1.0);
				else
					s.addRenderEvent("Simple Melody", rndInt(0, 32000), 3, s
							.getPartStartBar(i), s.getPartEndBar(i), 3,
							createTime(0, 0), 0.7);

				s.addRenderEvent("Accented Melody", rndInt(0, 32000), 5, s
						.getPartStartBar(i), s.getPartEndBar(i), 0, createTime(
						0, 0), 1.0);
				s.addRenderEvent("Accented Melody", rndInt(0, 32000), 5, s
						.getPartStartBar(i), s.getPartEndBar(i), 1, createTime(
						0, 0), 1.0);

				s.addRenderEvent("Accented Melody", rndInt(0, 32000), 6, s
						.getPartStartBar(i), s.getPartEndBar(i), 0, createTime(
						0, 0), 1.0);
				s.addRenderEvent("Accented Melody", rndInt(0, 32000), 6, s
						.getPartStartBar(i), s.getPartEndBar(i), 1, createTime(
						0, 0), 1.0);
			}

			if (s.getPart(i).getArrHint() == 3) {
				s.addRenderEvent("Drums - March", rndInt(0, 32000), 0, s
						.getPartStartBar(i), s.getPartEndBar(i), 1, createTime(
						0, 0), 1.0);
				s.setParam("cymbal", "" + 1);
				s.setParam("snare", "" + 1);

				s.addRenderEvent("Random Bass ( Extended )", rndInt(0, 32000),
						7, s.getPartStartBar(i), s.getPartEndBar(i), 1,
						createTime(0, 0), 1.0);
				s.setParam("mode", "" + 1);

				s.addRenderEvent("March Bass", rndInt(0, 32000), 2, s
						.getPartStartBar(i), s.getPartEndBar(i), -2,
						createTime(0, 0), 1.0);
			} else {
				s.addRenderEvent("March Bass", rndInt(0, 32000), 2, s
						.getPartStartBar(i), s.getPartEndBar(i), -1,
						createTime(0, 0), 1.0);

				s.addRenderEvent("Drums - March", rndInt(0, 32000), 0, s
						.getPartStartBar(i), s.getPartEndBar(i), 1, createTime(
						0, 0), 0.9);
				if (rndInt(0, 3) != 0)
					s.setParam("snare", "" + 1);

			}

		}

		s.addRenderEvent("Drums - Simple Cymbal", 0, 0, bars - 1, bars, 1,
				createTime(1, 0), 1.0);

	}


}
