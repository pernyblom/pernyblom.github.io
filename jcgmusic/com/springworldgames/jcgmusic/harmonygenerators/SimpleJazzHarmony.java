package com.springworldgames.jcgmusic.harmonygenerators;

import com.springworldgames.jcgmusic.HarmonyGenerator;
import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.UniquePart;

public class SimpleJazzHarmony extends MusicScript implements HarmonyGenerator {


	@Override
	public void generateHarmony(UniquePart up) {

		int mode = rndInt(1, 3);
		if (mode == 3)
			mode = 1;
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
			if (rndInt(0, 1) == 0)
				up.addHarmonic(createTime(0, 0), 1, "1357");
			else
				up.addHarmonic(createTime(0, 0), 3, "1357");

			for (int i = 1; i < up.getBars() - 2; i++) {
				int basis = rndInt(1, 7);
				if (basis == 4) {
					if (rndInt(0, 1) == 0)
						up.addHarmonic(createTime(i, 0), basis, "1357");
					else
						up.addHarmonic(createTime(i, 0), basis, "1356");
				} else
					up.addHarmonic(createTime(i, 0), basis, "1357");
			}

			if (rndInt(0, 1) == 0)
				up.addHarmonic(createTime(up.getBars() - 2, 0), 5, "1357");
			else
				up.addHarmonic(createTime(up.getBars() - 2, 0), 7, "1357");

			if (rndInt(0, 1) == 0)
				up.addHarmonic(createTime(up.getBars() - 1, 0), 1, "135");
			else
				up.addHarmonic(createTime(up.getBars() - 1, 0), 1, "1356");
		} else {
			if (rndInt(0, 1) == 0)
				up.addHarmonic(createTime(0, 0), 1, "1357");
			else
				up.addHarmonic(createTime(0, 0), 3, "1357");

			for (int i = 0; i < up.getBars() - 1; i++) {
				if (i != 0) {
					int basis = rndInt(1, 7);
					if (basis == 4) {
						if (rndInt(0, 1) == 0)
							up.addHarmonic(createTime(i, 0), basis, "1357");
						else
							up.addHarmonic(createTime(i, 0), basis, "1356");
					} else
						up.addHarmonic(createTime(i, 0), basis, "1357");
				}
				if (i != up.getBars() - 2) {
					int basis = rndInt(1, 7);
					if (basis == 4) {
						if (rndInt(0, 1) == 0)
							up.addHarmonic(createTime(i, sec_placement), basis,
									"1357");
						else
							up.addHarmonic(createTime(i, sec_placement), basis,
									"1356");
					} else
						up.addHarmonic(createTime(i, sec_placement), basis,
								"1357");
				}
			}

			if (rndInt(0, 1) == 0)
				up.addHarmonic(createTime(up.getBars() - 1, 0), 1, "135");
			else
				up.addHarmonic(createTime(up.getBars() - 1, 0), 3, "1357");
		}

	}

}
