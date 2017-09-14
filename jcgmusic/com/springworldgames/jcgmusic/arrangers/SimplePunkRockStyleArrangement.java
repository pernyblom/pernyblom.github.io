package com.springworldgames.jcgmusic.arrangers;

import com.springworldgames.jcgmusic.Arranger;
import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.Song;

public class SimplePunkRockStyleArrangement extends MusicScript implements
		Arranger {

	public static Object getScriptName() {
		return "Simple Punk Rock Style Arrangement";
	}

	
	@Override
	public void arrange(Song s) {
		int bars = s.getBars();

		s.addTrack("Melody", 86, 127, 64);
		s.addTrack("Alt Voice", 63, 127, 64);
		s.addTrack("Guitar Left", rndInt(30, 31), 127, 20);
		s.addTrack("Guitar Right", rndInt(30, 31), 127, 100);
		s.addTrack("Guitar Center", rndInt(30, 31), 127, 64);
		s.addTrack("Bass", 35, 127, 64);
		s.addTrack("Drums", 16, 127, 64);
		s.addTrack("Brass", 62, 127, 64);

		int cnt = 0;
		int chorus_cnt = 0;

		int intro_start = rndInt(0, 1);
		int bass_start = rndInt(0, 4);

		for (int i = 0; i < s.getParts(); i++) {
			if (s.getPart(i).getArrHint() == 0) {

			} else {
				if (s.getPart(i).getArrHint() == 1
						|| s.getPart(i).getArrHint() == 3) {
					s.addRenderEvent("Simple Melody", rndInt(0, 32000), 0, s
							.getPartStartBar(i), s.getPartEndBar(i), 2,
							createTime(0, 0), 0.7);
				}

				if (s.getPart(i).getArrHint() == 2) {
					s.addRenderEvent("Simple Melody", rndInt(0, 32000), 1, s
							.getPartStartBar(i), s.getPartEndBar(i), 2,
							createTime(0, 0), 0.8);
				}
			}

			if (s.getPart(i).getArrHint() == 3) {
				int seed = rndInt(0, 32000);

				s.addRenderEvent("Punk Guitar Chords", seed, 4, s
						.getPartStartBar(i), s.getPartEndBar(i), 0, createTime(
						0, 0), 1.0);
				s.setParam("mode", "" + 3);

				s.addRenderEvent("Simple Melody", rndInt(0, 32000), 1, s
						.getPartStartBar(i), s.getPartEndBar(i), 2, createTime(
						0, 0), 0.8);

				s.addRenderEvent("Fast Bass", rndInt(0, 32000), 5, s
						.getPartStartBar(i), s.getPartEndBar(i), -1,
						createTime(0, 0), 1.0);

				s.addRenderEvent("Drums - Punk Rock", rndInt(0, 32000), 6, s
						.getPartStartBar(i), s.getPartEndBar(i) - 1, 1,
						createTime(0, 0), 1.0);
				s.setParam("foot & snare", "" + 1);
				s.setParam("verse hi-hat", "" + 1);

				s.addRenderEvent("Drums - Punk Rock", rndInt(0, 32000), 6, s
						.getPartEndBar(i) - 1, s.getPartEndBar(i), 1,
						createTime(0, 0), 1.0);
				s.setParam("transition", "" + 1);

				if (chorus_cnt > 1) {
					s.addRenderEvent("Punk Guitar Chords", seed, 7, s
							.getPartStartBar(i), s.getPartEndBar(i), 1,
							createTime(0, 0), 1.0);
					s.setParam("mode", "" + 2);
				}

				chorus_cnt++;
			} else {
				int bars_cut = rndInt(1, 2);

				if (cnt == intro_start) {
					s.addRenderEvent("Drums - Punk Rock", rndInt(0, 32000), 6,
							s.getPartStartBar(i),
							s.getPartEndBar(i) - bars_cut, 1, createTime(0, 0),
							1.0);
					s.setParam("intro hi-hat", "" + 1);
				} else if (cnt > intro_start) {
					if (rndInt(0, 4) != 0) {
						s.addRenderEvent("Drums - Punk Rock", rndInt(0, 32000),
								6, s.getPartStartBar(i), s.getPartEndBar(i)
										- bars_cut, 1, createTime(0, 0), 1.0);
						s.setParam("verse hi-hat", "" + 1);
					}

					if (rndInt(0, 4) != 0) {
						s.addRenderEvent("Drums - Punk Rock", rndInt(0, 32000),
								6, s.getPartStartBar(i), s.getPartEndBar(i)
										- bars_cut, 1, createTime(0, 0), 1.0);
						s.setParam("foot & snare", "" + 1);
					}
				}

				s.addRenderEvent("Drums - Punk Rock", rndInt(0, 32000), 6, s
						.getPartEndBar(i)
						- bars_cut, s.getPartEndBar(i), 1, createTime(0, 0),
						1.0);
				s.setParam("transition", "" + 1);

				s.addRenderEvent("Punk Guitar Chords", rndInt(0, 32000), 4, s
						.getPartEndBar(i)
						- bars_cut, s.getPartEndBar(i), 0, createTime(0, 0),
						1.0);
				s.setParam("mode", "" + 3);

				if (cnt >= bass_start)
					s.addRenderEvent("Fast Bass", rndInt(0, 32000), 5, s
							.getPartStartBar(i), s.getPartEndBar(i) - 1, -1,
							createTime(0, 0), 1.0);

				s.addRenderEvent("Fast Bass", rndInt(0, 32000), 5, s
						.getPartEndBar(i) - 1, s.getPartEndBar(i), -1,
						createTime(0, 0), 1.0);

				if (cnt == 0) {
					s.addRenderEvent("Punk Guitar Chords", rndInt(0, 32000), 4,
							s.getPartStartBar(i),
							s.getPartEndBar(i) - bars_cut, 0, createTime(0, 0),
							1.0);
					s.setParam("mode", "" + rndInt(1, 2));
				}

				if (cnt == 1) {
					s.addRenderEvent("Punk Guitar Chords", rndInt(0, 32000), 4,
							s.getPartStartBar(i),
							s.getPartEndBar(i) - bars_cut, 0, createTime(0, 0),
							1.0);
					s.setParam("mode", "" + rndInt(1, 2));
					s.addRenderEvent("Punk Guitar Chords", rndInt(0, 32000), 2,
							s.getPartStartBar(i),
							s.getPartEndBar(i) - bars_cut, 0, createTime(0, 0),
							0.9);
					s.setParam("mode", "" + rndInt(1, 2));
				}

				else if (cnt > 1) {
					boolean skip = false;
					if (cnt >= bass_start && cnt > intro_start
							&& rndInt(0, 3) == 0)
						skip = true;

					if (!skip) {
						s.addRenderEvent("Punk Guitar Chords",
								rndInt(0, 32000), 4, s.getPartStartBar(i), s
										.getPartEndBar(i)
										- bars_cut, 0, createTime(0, 0), 1.0);
						s.setParam("mode", "" + rndInt(1, 2));
						s.addRenderEvent("Punk Guitar Chords",
								rndInt(0, 32000), 2, s.getPartStartBar(i), s
										.getPartEndBar(i)
										- bars_cut, 0, createTime(0, 0), 0.9);
						s.setParam("mode", "" + rndInt(1, 2));
						s.addRenderEvent("Punk Guitar Chords",
								rndInt(0, 32000), 3, s.getPartStartBar(i), s
										.getPartEndBar(i)
										- bars_cut, 0, createTime(0, 0), 0.9);
						s.setParam("mode", "" + rndInt(1, 2));
					}
				}

				cnt++;
			}
		}

		int intro = rndInt(0, 1);

		if (intro == 1) {
			s.addRenderEvent("Metronome", rndInt(0, 32000), 6, 0, 1, 0,
					createTime(-1, 0), 0.8);
		} else if (intro == 0) {
			s.addRenderEvent("Metronome", rndInt(0, 32000), 6, 0, 1, 0,
					createTime(-1, 0), 0.8);
			s.setParam("pitch", "" + 51);
		}

		s.addRenderEvent("Drums - Simple Cymbal", 0, 6, bars - 1, bars, 1,
				createTime(1, 0), 1.0);

	}

}
