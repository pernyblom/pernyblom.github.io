package com.springworldgames.jcgmusic.harmonygenerators;

import com.springworldgames.jcgmusic.HarmonyGenerator;
import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.UniquePart;

public class SimpleRandomHarmony extends MusicScript implements
		HarmonyGenerator {

	@Override
	public void generateHarmony(UniquePart up) {

		
		int mode = rndInt(1, 2);
		int sec_placement = rndInt(1, up.getMetrum() - 1);

		
		if (up.getMetrum() == 2)
			sec_placement = 1;
		if (up.getMetrum() == 4)
			sec_placement = 2;
		if (up.getMetrum() == 3)
			sec_placement = 2;
		if (up.getMetrum() == 5)
			sec_placement = rndInt(2, 3);
		if (up.getMetrum() == 6)
			sec_placement = 3;
		if (up.getMetrum() == 7)
			sec_placement = rndInt(3, 4);
		if (up.getMetrum() == 8)
			sec_placement = 4;

		if (mode == 1) {
			up.addHarmonic(createTime(0, 0), 1, "135");

			for (int i = 1; i < up.getBars() - 2; i++) {
				int tmp = rndInt(0, 2);
				int basis = 1;
				if (tmp == 1)
					basis = 4;
				if (tmp == 2)
					basis = 5;
				up.addHarmonic(createTime(i, 0), basis, "135");
			}

			up.addHarmonic(createTime(up.getBars() - 2, 0), 5, "135");
			up.addHarmonic(createTime(up.getBars() - 1, 0), 1, "135");

		} else {
			up.addHarmonic(createTime(0, 0), 1, "135");

			for (int i = 0; i < up.getBars() - 1; i++) {
				if (i != 0) {
					int tmp = rndInt(0, 2);
					int basis = 1;
					if (tmp == 1)
						basis = 4;
					if (tmp == 2)
						basis = 5;
					up.addHarmonic(createTime(i, 0), basis, "135");
				}
				if (i != up.getBars() - 2) {
					int tmp = rndInt(0, 2);
					int basis = 1;
					if (tmp == 1)
						basis = 4;
					if (tmp == 2)
						basis = 5;
					up.addHarmonic(createTime(i, sec_placement), basis, "135");
				}
			}

			up.addHarmonic(createTime(up.getBars() - 2, sec_placement), 5,
					"135");
			up.addHarmonic(createTime(up.getBars() - 1, 0), 1, "135");
		}

	}

}
