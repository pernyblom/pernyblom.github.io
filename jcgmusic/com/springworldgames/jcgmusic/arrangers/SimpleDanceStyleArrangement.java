package com.springworldgames.jcgmusic.arrangers;

import com.springworldgames.jcgmusic.Arranger;
import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.Song;

public class SimpleDanceStyleArrangement extends MusicScript implements
		Arranger {

	public static String getScriptName() {
		return "Simple Dance Style Arrangement";
	}
	
	@Override
	public void arrange(Song s) {

		int bars = s.getBars();

		s.addTrack("Melody", 2, 127, 64);
		s.addTrack("Alt Voice", 2, 127, 64);
		s.addTrack("Pad", rndInt(89, 96), 127, 64);

		if (rndInt(0, 1) == 0)
			s.addTrack("Bass", 36, 127, 64);
		else
			s.addTrack("Bass", rndInt(39, 40), 127, 64);

		int[] acomp_pitch = { 5, 6, 27, 39, 46, 63, 97, 103, 107 };

		s.addTrack("Accomp", getRandom(acomp_pitch), 127, 64);
		s.addTrack("Drums", 1, 127, 64);

		s.addTrack("Strings", rndInt(51, 52), 127, 64);
		s.addTrack("Lead Bass", 88, 127, 64);

		s.addTrack("Voice Powerup", 92, 127, 64);

		s.addTrack("Acomp 2", 1, 127, 64);

		double back = 0.5;
		if (s.getTempo() > 90)
			back = 1.0;

		int cnt = 0;
		int chorus_cnt = 0;

		int attack_seed = rndInt(0, 32000);
		int start_cyk_with = rndInt(0, 3);
		int start_bit_with = rndInt(start_cyk_with, start_cyk_with + 2);
		int start_acomp_with = rndInt(0, 3);

		int drum_seed1 = rndInt(0, 32000);
		int drum_seed2 = rndInt(0, 32000);

		int arp_seed = rndInt(0, 32000);

		for (int i = 0; i < s.getParts(); i++) {
			if (s.getPart(i).getArrHint() == 0) {

			} else {
				if (s.getPart(i).getArrHint() == 1
						|| s.getPart(i).getArrHint() == 3) {
					s.addRenderEvent("Simple Melody", rndInt(0, 32000), 0, s
							.getPartStartBar(i), s.getPartEndBar(i), 2,
							createTime(0, 0), 1.0);
					s.addRenderEvent("Simple Melody", rndInt(0, 32000), 0, s
							.getPartStartBar(i), s.getPartEndBar(i), 2,
							createTime(0, back), 0.7);
					s.addRenderEvent("Simple Melody", rndInt(0, 32000), 0, s
							.getPartStartBar(i), s.getPartEndBar(i), 2,
							createTime(0, 2 * back), 0.5);
					s.addRenderEvent("Simple Melody", rndInt(0, 32000), 0, s
							.getPartStartBar(i), s.getPartEndBar(i), 2,
							createTime(0, 3 * back), 0.3);
				}

				if (s.getPart(i).getArrHint() == 2
						|| s.getPart(i).getArrHint() == 3) {
					s.addRenderEvent("Simple Melody", rndInt(0, 32000), 1, s
							.getPartStartBar(i), s.getPartEndBar(i), 2,
							createTime(0, 0), 1.0);
					s.addRenderEvent("Simple Melody", rndInt(0, 32000), 1, s
							.getPartStartBar(i), s.getPartEndBar(i), 2,
							createTime(0, back), 0.7);
					s.addRenderEvent("Simple Melody", rndInt(0, 32000), 1, s
							.getPartStartBar(i), s.getPartEndBar(i), 2,
							createTime(0, 2 * back), 0.5);
					s.addRenderEvent("Simple Melody", rndInt(0, 32000), 1, s
							.getPartStartBar(i), s.getPartEndBar(i), 2,
							createTime(0, 3 * back), 0.3);
				}
			}

			if (s.getPart(i).getArrHint() == 3) {
				if (rndInt(0, 7) != 0) {
					s.addRenderEvent("Drums - Dance Hi-Hat", drum_seed1, 5, s
							.getPartStartBar(i), s.getPartEndBar(i), 1,
							createTime(0, 0), 1.0);
					s.addRenderEvent("Drums - Dance Foot & Snare", drum_seed2,
							5, s.getPartStartBar(i), s.getPartEndBar(i), 1,
							createTime(0, 0), 1.0);
				}

				if (rndInt(0, 4) != 1) {
					s.addRenderEvent("Shortest Way Chords Simple", rndInt(0,
							32000), 2, s.getPartStartBar(i),
							s.getPartEndBar(i), 1, createTime(0, 0), 0.85);
					s.addRenderEvent("Shortest Way Chords Simple", rndInt(0,
							32000), 6, s.getPartStartBar(i),
							s.getPartEndBar(i), 2, createTime(0, 0), 0.70);
				}

				s.addRenderEvent("Random Bass", 6, 3, s.getPartStartBar(i), s
						.getPartEndBar(i), -1, createTime(0, 0), 1.0);
				s.addRenderEvent("Random Bass", 1, 7, s.getPartStartBar(i), s
						.getPartEndBar(i), -1, createTime(0, 0.5), 1.0);
				s.addRenderEvent("Random Bass", 1, 7, s.getPartStartBar(i), s
						.getPartEndBar(i), 0, createTime(0, 0.0), 1.0);

				s.addRenderEvent("Drums - Dance Snare Attack", attack_seed, 5,
						((s.getPartStartBar(i) + s.getPartEndBar(i)) / 2) - 2,
						(s.getPartStartBar(i) + s.getPartEndBar(i)) / 2, 1,
						createTime(0, 0), 1.0);
				s.addRenderEvent("Drums - Dance Snare Attack", attack_seed, 5,
						s.getPartEndBar(i) - 2, s.getPartEndBar(i), 1,
						createTime(0, 0), 1.0);

				if (chorus_cnt > 1)
					s.addRenderEvent("Arpeggio Chords Fast", arp_seed, 4, s
							.getPartStartBar(i), s.getPartEndBar(i), 2,
							createTime(0, 0.0), 0.9);

				if (chorus_cnt > 2)
					s.addRenderEvent("Simple Melody", rndInt(0, 32000), 8, s
							.getPartStartBar(i), s.getPartEndBar(i), rndInt(2,
							3), createTime(0, 0), 1.0);

				chorus_cnt++;
			} else {
				if (i + 1 < s.getParts() && s.getPart(i + 1).getArrHint() == 3) {
					if (rndInt(0, 1) == 0 && i != 0)
						s.addRenderEvent("Drums - Dance Snare Attack",
								attack_seed, 5, s.getPartStartBar(i), s
										.getPartEndBar(i), 1, createTime(0, 0),
								1.0);
					else
						s.addRenderEvent("Drums - Dance Snare Attack",
								attack_seed, 5, (s.getPartStartBar(i) + s
										.getPartEndBar(i)) / 2, s
										.getPartEndBar(i), 1, createTime(0, 0),
								1.0);
				}

				if (cnt == 0) {
					s.addRenderEvent("Shortest Way Chords Simple", rndInt(0,
							32000), 2, s.getPartStartBar(i),
							s.getPartEndBar(i), 1, createTime(0, 0), 0.65);
					s.addRenderEvent("Simple Bass", rndInt(0, 32000), 3, s
							.getPartStartBar(i), s.getPartEndBar(i), -1,
							createTime(0, 0), 1.0);
				} else if (cnt >= 1) {
					s.addRenderEvent("Shortest Way Chords Simple", rndInt(0,
							32000), 2, s.getPartStartBar(i),
							s.getPartEndBar(i), 1, createTime(0, 0), 0.75);
					s.addRenderEvent("Random Bass", 2, 3, s.getPartStartBar(i),
							s.getPartEndBar(i), -1, createTime(0, 0), 1.0);
					s.addRenderEvent("Shortest Way Chords Simple", rndInt(0,
							32000), 6, s.getPartStartBar(i),
							s.getPartEndBar(i), 2, createTime(0, 0), 0.65);
				}

				if (cnt >= start_cyk_with)
					s.addRenderEvent("Drums - Dance Hi-Hat", drum_seed1, 5, s
							.getPartStartBar(i), s.getPartEndBar(i), 1,
							createTime(0, 0), 0.9);

				if (cnt >= start_bit_with)
					s.addRenderEvent("Drums - Dance Foot & Snare", drum_seed2,
							5, s.getPartStartBar(i), s.getPartEndBar(i), 1,
							createTime(0, 0), 0.9);

				if (cnt >= start_acomp_with)
					s.addRenderEvent("Arpeggio Chords Fast", rndInt(0, 32000),
							4, s.getPartStartBar(i), s.getPartEndBar(i), 1,
							createTime(0, 0.0), 0.9);

				s.addRenderEvent("Sine Velocity Simple Melody",
						rndInt(0, 32000), 9, s.getPartStartBar(i), s
								.getPartEndBar(i), 2, createTime(0, 0.0), 0.9);

				cnt++;
			}
		}

	}

}
