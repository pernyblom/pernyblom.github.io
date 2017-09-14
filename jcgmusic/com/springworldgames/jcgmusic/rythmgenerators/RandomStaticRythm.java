package com.springworldgames.jcgmusic.rythmgenerators;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RythmGenerator;
import com.springworldgames.jcgmusic.Time;
import com.springworldgames.jcgmusic.UniquePhrase;

public class RandomStaticRythm extends MusicScript implements RythmGenerator {


	void Add(UniquePhrase up, Time t1, Time t2) {
		up.addEvent(t1, t2);
	}

	@Override
	public void generateRythm(UniquePhrase up) {
		
		int bars = up.getBars();

		if (up.endsSentence())
			bars--;


		Time poz = new Time(0, 0);

		int start = rndInt(0, 4);

		if (start == 0) {
			poz.mBar = 0;
			poz.mPos = -1;
		}

		if (start == 1) {
			poz.mBar = 0;
			poz.mPos = -0.5;
		}

		if (start == 2) {
			poz.mBar = 0;
			poz.mPos = 0;
		}

		if (start == 3) {
			poz.mBar = 0;
			poz.mPos = 0.5;
		}

		if (start == 4) {
			poz.mBar = 0;
			poz.mPos = 1;
		}

		double delta;

		int mode = rndInt(0, 3);
		if (mode == 0)
			delta = 2;
		if (mode == 1)
			delta = 1;
		if (mode == 2)
			delta = 0.5;
		if (mode == 3 && getSongTempo() < 130)
			delta = 0.25;
		else
			delta = 0.5;

		while (poz.mBar < bars) {
			Time t2 = poz.copy();
			t2.mPos += delta;
			if (t2.mPos >= up.getMetrum())
				t2.mPos = up.getMetrum();

			Add(up, poz.copy(), t2.copy());

			poz.mPos += delta;
			if (poz.mPos >= up.getMetrum()) {
				poz.mPos = 0;
				poz.mBar++;
			}
		}

		if (up.endsSentence())
			up.addEvent(createTime(up.getBars() - 1, 0), createTime(up
					.getBars() - 1, up.getMetrum()));

	}

}
