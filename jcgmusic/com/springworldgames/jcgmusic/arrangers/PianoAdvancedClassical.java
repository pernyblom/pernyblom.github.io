package com.springworldgames.jcgmusic.arrangers;

import com.springworldgames.jcgmusic.Arranger;
import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.Song;

public class PianoAdvancedClassical extends MusicScript implements Arranger {

	
	public static Object getScriptName() {
		return "Piano Advanced Classical";
	}


	int ArrangeClassical1(Song s) {
		int bars = s.getBars();

		boolean organs = false;

		if (rndInt(0, 1) == 0) // piano timbre
		{
			s.addTrack("Melody", 2, 127, 64);
			s.addTrack("Alt Voice", 1, 127, 64);

			int a1 = rndInt(30, 90);

			s.addTrack("Accomp", rndInt(1, 2), 125, a1);
			s.addTrack("Bass", rndInt(1, 2), 127, rndInt(30, 90));
			s.addTrack("Chords", rndInt(1, 2), 127, rndInt(30, 90));
			s.addTrack("Accomp2", rndInt(1, 2), 125, 64 + (60 - a1));
		} else // Hapsichord timbre
		{
			int f, t;
			f = 7;
			t = 8;

			s.addTrack("Melody", rndInt(f, t), 127, 64);
			s.addTrack("Alt Voice", rndInt(f, t), 127, 64);

			int a1 = rndInt(30, 90);

			s.addTrack("Accomp", rndInt(f, t), 125, a1);
			s.addTrack("Bass", rndInt(f, t), 127, rndInt(30, 90));
			s.addTrack("Chords", rndInt(f, t), 127, rndInt(30, 90));
			s.addTrack("Accomp2", rndInt(f, t), 125, 64 + (60 - a1));
		}

		int[] seeds = new int[5];
		int[] off = new int[5];
		for (int i = 0; i < seeds.length; i++) {
			seeds[i] = rndInt(0, 32000);
			off[i] = rndInt(0, 1);
		}

		int bass_seed = rndInt(0, 32000);
		int bass_seed_chorus = rndInt(0, 32000);

		String melody = "Simple Melody";
		if (rndInt(0, 2) == 0)
			melody = "Accented Melody";

		for (int i = 0; i < s.getParts(); i++) {
			if (s.getPart(i).getArrHint() == 0) // no melody
			{
				s
						.addRenderEvent("Shortest Way Chords Simple", rndInt(0,
								32000), 4, s.getPartStartBar(i), s
								.getPartEndBar(i) - 1, 1, createTime(0, 0), 0.7);
				s.addRenderEvent("Arpeggio Chords", seeds[4], 5, s
						.getPartStartBar(i), s.getPartEndBar(i) - 1,
						1 + off[0], createTime(0, 0), 0.7);
			} else if (s.getPart(i).getArrHint() == 1) // main voice
			{
				s.addRenderEvent(melody, rndInt(0, 32000), 0, s
						.getPartStartBar(i), s.getPartEndBar(i), 1, createTime(
						0, 0), 1);

			} else if (s.getPart(i).getArrHint() == 2) // alt voice
			{
				s.addRenderEvent(melody, rndInt(0, 32000), 1, s
						.getPartStartBar(i), s.getPartEndBar(i), 1, createTime(
						0, 0), 1);

			} else if (s.getPart(i).getArrHint() == 3) // chorus
			{
				s.addRenderEvent("Chordal Melody", rndInt(0, 32000), 0, s
						.getPartStartBar(i), s.getPartEndBar(i), 2 + rndInt(0,
						1), createTime(0, 0), 0.95);
				s.addRenderEvent(melody, rndInt(0, 32000), 1, s
						.getPartStartBar(i), s.getPartEndBar(i), 1 + rndInt(0,
						1), createTime(0, 0), 1);

				s.addRenderEvent("Simple Chords", rndInt(0, 32000), 4, s
						.getPartStartBar(i), s.getPartEndBar(i) - 1, 0,
						createTime(0, 0), 0.7);

				s.addRenderEvent("Arpeggio Chords", rndInt(0, 32000), 5, s
						.getPartStartBar(i), s.getPartEndBar(i) - 1,
						1 + off[3], createTime(0, 0), 0.65);

			}

			s.addRenderEvent("Arpeggio Chords",
					seeds[s.getPart(i).getArrHint()], 2, s.getPartStartBar(i),
					s.getPartEndBar(i) - 1, off[s.getPart(i).getArrHint()],
					createTime(0, 0), 0.7);
			s.addRenderEvent("Simple Chords", rndInt(0, 32000), 4, s
					.getPartEndBar(i) - 1, s.getPartEndBar(i), 1 + (seeds[s
					.getPart(i).getArrHint()] % 2), createTime(0, 0), 0.8);

			if (s.getPart(i).getArrHint() == 3)
				s.addRenderEvent("Random Bass ( Extended )", bass_seed_chorus,
						3, s.getPartStartBar(i), s.getPartEndBar(i), -1,
						createTime(0, 0), 1.0);
			else
				s.addRenderEvent("Random Bass ( Extended )", bass_seed, 3, s
						.getPartStartBar(i), s.getPartEndBar(i), rndInt(0, 1),
						createTime(0, 0), 0.9);

		}

		if (!organs)
			s
					.addRenderEvent("Simple Chords Smooth", rndInt(0, 32000),
							2, bars - 1, bars, 3, createTime(0,
									s.getUniquePart(
											s.getPart(0).getUniquePart())
											.getMetrum() / 2), 0.8);

		return 2;
	}

	@Override
	public void arrange(Song s) {

		int style = rndInt(0, 1);
		int slow = 0;

		if (style == 0)
			slow = ArrangeClassical1(s);
		if (style == 1)
			slow = ArrangeClassical1(s);

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
