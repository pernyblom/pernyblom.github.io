package com.springworldgames.jcgmusic.rythmgenerators;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RythmGenerator;
import com.springworldgames.jcgmusic.Time;
import com.springworldgames.jcgmusic.UniquePhrase;

public class SimpleSwingRythm extends MusicScript implements RythmGenerator {

	void Add(UniquePhrase up, Time t1, Time t2) {
		up.addEvent(t1, t2);
	}

	@Override
	public void generateRythm(UniquePhrase up) {
		int bars = up.getBars();

		if (up.endsSentence())
			bars--;

		boolean must_follow = false;

		if (rndInt(0, 2) != 0) {
			if (rndInt(0, 1) == 0) {
				Add(up, createTime(-1, up.getMetrum() - 0.25), createTime(-1,
						up.getMetrum()));
				must_follow = true;
			} else {
				Add(up, createTime(-1, up.getMetrum() - 0.5), createTime(-1, up
						.getMetrum()));
				if (rndInt(0, 1) == 0)
					must_follow = true;
			}
		}

		for (int i = 0; i < bars; i++) {
			int met = up.getMetrum();

			if (i == bars - 1)
				met--;

			for (int b = 0; b < met; b += 1) {
				int t = rndInt(0, 3);

				if (must_follow)
					t = rndInt(0, 2);

				if (b == met - 1)
					t = rndInt(1, 2);

				if (t == 0) {
					Add(up, createTime(i, b), createTime(i, b + 0.75));
					Add(up, createTime(i, b + 0.75), createTime(i, b + 1));
					must_follow = true;
				}
				if (t == 1) {
					Add(up, createTime(i, b), createTime(i, b + 1));
					must_follow = false;
				}
				if (t == 2) {
					Add(up, createTime(i, b), createTime(i, b + 0.5));
					Add(up, createTime(i, b + 0.5), createTime(i, b + 1));
					must_follow = false;
				}
				if (t == 3) {
					if (rndInt(0, 1) == 0)
						Add(up, createTime(i, b + 0.5), createTime(i, b + 1));
					else {
						Add(up, createTime(i, b + 0.75), createTime(i, b + 1));
						must_follow = true;
					}
				}

			}
		}

		if (up.endsSentence())
			up.addEvent(createTime(up.getBars() - 1, 0), createTime(up
					.getBars() - 1, up.getMetrum()));

	}

}
