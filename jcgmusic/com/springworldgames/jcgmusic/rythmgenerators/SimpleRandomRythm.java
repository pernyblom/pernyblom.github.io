package com.springworldgames.jcgmusic.rythmgenerators;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RythmGenerator;
import com.springworldgames.jcgmusic.Time;
import com.springworldgames.jcgmusic.UniquePhrase;

public class SimpleRandomRythm extends MusicScript implements RythmGenerator {

	void Add(UniquePhrase up, Time t1, Time t2) {
		up.addEvent(t1, t2);
	}

	@Override
	public void generateRythm(UniquePhrase up) {


		int bars = up.getBars();

		if (up.endsSentence())
			bars--;

		int przednutki = rndInt(0, 4);

		if (przednutki == 0)
			Add(up, createTime(-1, up.getMetrum() - 1), createTime(-1, up
					.getMetrum()));
		else if (przednutki == 1)
			Add(up, createTime(-1, up.getMetrum() - 0.5), createTime(-1, up
					.getMetrum()));
		else if (przednutki == 2) {
			Add(up, createTime(-1, up.getMetrum() - 1), createTime(-1, up
					.getMetrum() - 0.5));
			Add(up, createTime(-1, up.getMetrum() - 0.5), createTime(-1, up
					.getMetrum()));
		}


		for (int i = 0; i < bars; i++) {
			for (int b = 0; b < up.getMetrum(); b += 1) {
				int t = rndInt(0, 1);
				if (t == 0)
					Add(up, createTime(i, b), createTime(i, b + 1));
				if (t == 1) {
					Add(up, createTime(i, b), createTime(i, b + 0.5));
					Add(up, createTime(i, b + 0.5), createTime(i, b + 1));
				}
			}
		}

		if (up.endsSentence())
			up.addEvent(createTime(up.getBars() - 1, 0), createTime(up
					.getBars() - 1, up.getMetrum()));

	}

}
