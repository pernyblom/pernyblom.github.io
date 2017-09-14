package com.springworldgames.jcgmusic.harmonygenerators;

import com.springworldgames.jcgmusic.HarmonyGenerator;
import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.UniquePart;

public class ChordMapHarmony extends MusicScript implements HarmonyGenerator {


	@Override
	public void generateHarmony(UniquePart up) {

		int chords = 6;

		int[][] map = new int[][] { { 2, 3, 4, 5, 6 }, { 3, 5 }, { 4, 6 },
				{ 5, 2, 1 }, { 3, 6, 1 }, { 4, 2 } };

		int reset = 4;
		if (rndInt(0, 2) == 0)
			reset = 8;
		if (rndInt(0, 2) == 0)
			reset = 2;

		resetSeed();

		int cur_chord = 1;
		if (rndInt(0, 3) == 0)
			cur_chord = rndInt(1, 6);

		int r = 0;

		for (int i = 0; i < up.getBars() - 2; i++) {
			if (r == 0 || rndInt(0, 2) != 0) {
				up.addHarmonic(createTime(i, 0), cur_chord, "135");

				if (rndInt(0, 1) == 0) {
					if (rndInt(0, 1) == 0) {
						up.addHarmonic(createTime(i, rndInt(1,
								up.getMetrum() - 1)), cur_chord, "135"
								+ rndInt(6, 7));
						cur_chord = map[cur_chord - 1][rndInt(0,
								map[cur_chord - 1].length - 1)];
					} else {
						cur_chord = map[cur_chord - 1][rndInt(0,
								map[cur_chord - 1].length - 1)];
						up.addHarmonic(createTime(i, rndInt(1,
								up.getMetrum() - 1)), cur_chord, "135");
						cur_chord = map[cur_chord - 1][rndInt(0,
								map[cur_chord - 1].length - 1)];
					}
				} else
					cur_chord = map[cur_chord - 1][rndInt(0,
							map[cur_chord - 1].length - 1)];
			}

			r++;
			if (r >= reset) {
				r = 0;
				resetSeed();
				cur_chord = 1;
				if (rndInt(0, 3) == 0)
					cur_chord = rndInt(1, 6);
			}
		}

		if (rndInt(0, 1) == 0)
			up.addHarmonic(createTime(up.getBars() - 2, 0), 5, "135");
		else
			up.addHarmonic(createTime(up.getBars() - 2, 0), 5, "1357");

		up.addHarmonic(createTime(up.getBars() - 1, 0), 1, "135");

	}

}
