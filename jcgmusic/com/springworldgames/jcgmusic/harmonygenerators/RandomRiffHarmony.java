package com.springworldgames.jcgmusic.harmonygenerators;

import com.springworldgames.jcgmusic.HarmonyGenerator;
import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.UniquePart;

public class RandomRiffHarmony extends MusicScript implements HarmonyGenerator {

	class Offset {
		int bar;
		double pos;
	};

	@Override
	public void generateHarmony(UniquePart up) {
		int chords = rndInt(2, 3);
		int[] basis = new int[chords];

		if (rndInt(0, 1) == 0) // tonic on the end
		{
			basis[chords - 1] = 1;

			if (chords == 2) {
				basis[0] = rndInt(3, 6);
			} else {
				basis[0] = rndInt(2, 6);
				do {
					basis[1] = rndInt(3, 6);
				} while (basis[0] == basis[1]);
			}
		} else // tonic on the front
		{
			basis[0] = 1;

			if (chords == 2) {
				basis[1] = rndInt(3, 6);
			} else {
				basis[2] = rndInt(3, 6);
				do {
					basis[1] = rndInt(2, 6);
				} while (basis[1] == basis[2]);
			}
		}

		Offset[] pattern = new Offset[chords];
		for (int i=0; i<chords; i++) {
			pattern[i] = new Offset();
		}
		
		pattern[0].bar = 0;
		pattern[0].pos = 0;

		if (chords == 2) {
			if (rndInt(0, 1) == 0) {
				pattern[1].bar = 1;
				pattern[1].pos = 0;
			} else {
				pattern[1].bar = 0;
				pattern[1].pos = up.getMetrum() - 1;
			}
		} else {
			if (rndInt(0, 1) == 0) {
				pattern[1].bar = 0;
				if (up.getMetrum() == 2)
					pattern[1].pos = 1;
				else if (up.getMetrum() == 3)
					pattern[1].pos = 2;
				else if (up.getMetrum() == 4)
					pattern[1].pos = 2;
				else if (up.getMetrum() == 5)
					pattern[1].pos = 3;
				else
					pattern[1].pos = up.getMetrum() - 2;
				pattern[2].bar = 1;
				pattern[2].pos = 0;
			} else {
				pattern[1].bar = 0;
				if (up.getMetrum() < 5)
					pattern[1].pos = up.getMetrum() - 1;
				else
					pattern[1].pos = up.getMetrum() - 2;
				pattern[2].bar = 1;
				pattern[2].pos = 1;
			}
		}

		for (int i = 0; i < up.getBars(); i += 2) {
			if (i + 2 >= up.getBars() && up.endsSong() && rndInt(0, 3) != 0) {
				if (rndInt(0, 1) == 0)
					basis[chords - 2] = 5;
				basis[chords - 1] = 1;
			}

			for (int c = 0; c < chords; c++) {
				up.addHarmonic(createTime(i + pattern[c].bar, pattern[c].pos),
						basis[c], "135");
			}
		}

	}
}
