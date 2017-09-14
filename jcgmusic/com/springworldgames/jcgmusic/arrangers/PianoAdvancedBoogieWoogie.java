package com.springworldgames.jcgmusic.arrangers;

import com.springworldgames.jcgmusic.Arranger;
import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.Song;

public class PianoAdvancedBoogieWoogie extends MusicScript implements Arranger {

	public static Object getScriptName() {
		return "Piano Advanced Boogie Woogie";
	}

	
	int ArrangeBoogieWoogie(Song s) {
		int bars = s.getBars();

		s.addTrack("Melody", rndInt(2, 4), 127, 64);
		s.addTrack("Alt Voice", rndInt(1, 4), 127, 64);
		s.addTrack("Accomp", rndInt(1, 4), 127, 64);
		s.addTrack("Chorus Intro", rndInt(1, 4), 127, 64);

		String bw = "Boogie Woogie";
		if (rndInt(0, 1) == 0)
			bw += " Swing";

		int bw_seed = rndInt(0, 32000);
		int bw_seed_chorus = rndInt(0, 32000);
		int bw_seed_alt = rndInt(0, 32000);
		int chor_off = rndInt(0, 1);
		int intro_seed = rndInt(0, 32000);

		String melody = "Simple Melody";
		if (rndInt(0, 2) == 0)
			melody = "Accented Melody";

		for (int i = 0; i < s.getParts(); i++) {
			if (s.getPart(i).getArrHint() == 0) {
				s.addRenderEvent("Simple Chords", rndInt(0, 32000), 1, s
						.getPartStartBar(i), s.getPartEndBar(i), 1, createTime(
						0, 0), 0.8);
				s.addRenderEvent(bw, bw_seed, 2, s.getPartStartBar(i), s
						.getPartEndBar(i) - 1, -1 + rndInt(0, 1), createTime(0,
						0), 1.0);
			}
			if (s.getPart(i).getArrHint() == 1) {
				s.addRenderEvent(melody, rndInt(0, 32000), 0, s
						.getPartStartBar(i), s.getPartEndBar(i), 1, createTime(
						0, 0), 1);
				s.addRenderEvent(bw, bw_seed, 2, s.getPartStartBar(i), s
						.getPartEndBar(i) - 1, -1, createTime(0, 0), 1.0);
			}
			if (s.getPart(i).getArrHint() == 2) {
				s.addRenderEvent(melody, rndInt(0, 32000), 1, s
						.getPartStartBar(i), s.getPartEndBar(i), 1, createTime(
						0, 0), 1);
				s.addRenderEvent(bw, bw_seed_alt, 2, s.getPartStartBar(i), s
						.getPartEndBar(i) - 1, -1, createTime(0, 0), 1.0);
			}
			if (s.getPart(i).getArrHint() == 3) {
				s.addRenderEvent("Chordal Melody", rndInt(0, 32000), 0, s
						.getPartStartBar(i), s.getPartEndBar(i), 2, createTime(
						0, 0), 1);
				s.addRenderEvent(bw, bw_seed_chorus, 2, s.getPartStartBar(i), s
						.getPartEndBar(i) - 1, chor_off, createTime(0, 0), 1.0);
				s.addRenderEvent(bw, bw_seed_chorus, 2, s.getPartStartBar(i), s
						.getPartEndBar(i) - 1, -1, createTime(0, 0), 1.0);

				s.addRenderEvent("Quick Intro Bass", intro_seed, 3, s
						.getPartStartBar(i), s.getPartStartBar(i) + 1, -1,
						createTime(0, 0), 1.0);
			}

			s.addRenderEvent("Simple Chords", rndInt(0, 32000), 2, s
					.getPartEndBar(i) - 1, s.getPartEndBar(i), 0, createTime(0,
					0), 0.8);

			if (i == s.getParts() - 1) {
				s.addRenderEvent("Simple Chords", rndInt(0, 32000), 2, s
						.getPartEndBar(i) - 1, s.getPartEndBar(i), 2,
						createTime(0, 0), 0.8);
				s.addRenderEvent("Simple Chords Smooth", rndInt(0, 32000), 2, s
						.getPartEndBar(i) - 1, s.getPartEndBar(i), 3,
						createTime(0, s.getUniquePart(
								s.getPart(i).getUniquePart()).getMetrum() / 2),
						0.8);
			} else {
				s.addRenderEvent("Simple Chords", rndInt(0, 32000), 2, s
						.getPartEndBar(i) - 1, s.getPartEndBar(i), 1,
						createTime(0, s.getUniquePart(
								s.getPart(i).getUniquePart()).getMetrum() / 2),
						0.75);
			}
		}

		return 1;
	}

	@Override
	public void arrange(Song s) {
		int style = rndInt(0, 1);
		int slow;

		slow = ArrangeBoogieWoogie(s);

		if (slow > 0) {
			int bars = 0;
			for (int i = 0; i < s.getParts(); i++) {
				double metrum = s.getUniquePart(s.getPart(i).getUniquePart())
						.getMetrum();
				bars += s.getUniquePart(s.getPart(i).getUniquePart()).getBars();

				if (i == s.getParts() - 1) {
					// zwolnienie na koniec
					s.addTempoMod(createTime(bars - 2, metrum / 3), 0.95);
					s.addTempoMod(createTime(bars - 2, (metrum / 3) * 2), 0.90);
					s.addTempoMod(createTime(bars - 1, 0), 0.8);
				} else if (slow > 1) {
					// zwolnienie na koniec czesci
					s.addTempoMod(createTime(bars - 2, metrum / 3), 0.95);
					s.addTempoMod(createTime(bars - 2, (metrum / 3) * 2), 0.90);
					s.addTempoMod(createTime(bars - 1, 0), 0.85);
					s.addTempoMod(createTime(bars - 1, metrum - 1), 0.95);
				}
			}
		}
	}

}
