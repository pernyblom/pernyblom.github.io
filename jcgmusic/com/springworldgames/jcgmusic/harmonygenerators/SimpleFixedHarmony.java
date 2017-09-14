package com.springworldgames.jcgmusic.harmonygenerators;

import com.springworldgames.jcgmusic.HarmonyGenerator;
import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.UniquePart;

public class SimpleFixedHarmony extends MusicScript implements HarmonyGenerator {


	@Override
	public void generateHarmony(UniquePart up) {
		up.addHarmonic(createTime(0, 0), 1, "135");

		for (int i = 1; i < up.getBars() - 2; i++) {
			if (i % 2 == 1)
				up.addHarmonic(createTime(i, 0), 4, "135");
			else
				up.addHarmonic(createTime(i, 0), 1, "135");
		}

		up.addHarmonic(createTime(up.getBars() - 2, 0), 5, "135");
		up.addHarmonic(createTime(up.getBars() - 1, 0), 1, "135");

	}

}
