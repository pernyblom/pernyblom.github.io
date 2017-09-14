package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;
import com.springworldgames.jcgmusic.Time;

public class RandomBassExtended extends MusicScript implements Renderer {

	int first_pitch = 0;
	int last_pitch = 0;

	void SetFirstPitch(int f) {
		first_pitch = f;
		last_pitch = f;
	}

	int GetNextPitch(int p) {
		int cur_pitch = p;
		if (cur_pitch - 7 > last_pitch)
			cur_pitch -= 12;
		last_pitch = cur_pitch + rndInt(-3, 3);
		return cur_pitch;
	}

	@Override
	public void render(RenderPart p) {
		SetFirstPitch(p.getHarmonicEventPitch(0, 0));

		int mode = rndInt(0, 1);

		if (Integer.parseInt(p.getParam("mode")) > 0)
			mode = Integer.parseInt(p.getParam("mode")) - 1;

		if (mode == 0) {
			double delta = 0.5;
			for (int i = 0; i < p.getHarmonicEvents(); i++) {
				if (rndInt(0, 5) == 0 || i == p.getHarmonicEvents() - 1) {
					p.addNote(p.getHarmonicEventStart(i), p
							.getHarmonicEventEnd(i), GetNextPitch(p
							.getHarmonicEventPitch(i, 0)), rndInt(122, 127));
				} else {
					p.addNote(p.getHarmonicEventStart(i), createTime(p
							.getHarmonicEventEnd(i).mBar, p
							.getHarmonicEventEnd(i).mPos
							- delta), GetNextPitch(p
							.getHarmonicEventPitch(i, 0)), rndInt(122, 127));
					p.addNote(createTime(p.getHarmonicEventEnd(i).mBar, p
							.getHarmonicEventEnd(i).mPos
							- delta), p.getHarmonicEventEnd(i), GetNextPitch(p
							.getHarmonicEventPitch(i, rndInt(0, 2))
							- 12 * rndInt(0, 1)), rndInt(122, 127));
				}
			}
		} else {

			double len = rndFloat(0.5, 1.0);
			if (rndInt(0, 1) == 0)
				len = 0.98;

			int len_mode = rndInt(0, 1);

			double speed = 1;
			if (p.getTempo() < 90)
				speed = 0.5;

			for (int i = p.getStartBar(); i < p.getEndBar(); i++) {
				for (double m = 0; m < p.getUniquePart().getMetrum(); m += speed) {
					Time t = createTime(i, m);
					int vel = 127;
					if (m % 2 == 1)
						vel = 122;

					int harm = p.getHarmonic(t);

					if (harm == p.getHarmonicEvents() - 1) {
						p.addNote(
								p
										.getHarmonicEventStart(p
												.getHarmonicEvents() - 1), p
										.getHarmonicEventEnd(p
												.getHarmonicEvents() - 1),
								GetNextPitch(p.getHarmonicEventPitch(p
										.getHarmonicEvents() - 1, 0)), rndInt(
										115, 126));
						return;
					}

					Time t2 = t.copy();
					if (len_mode == 0)
						t2.mPos += len * speed;
					else
						t2.mPos += rndFloat(0.5, 1.0) * speed;

					if (rndInt(0, 2) != 0)
						p.addNote(t, t2, GetNextPitch(p.getHarmonicEventPitch(
								harm, 0)), rndInt(vel - 15, vel));
					else
						p.addNote(t, t2, GetNextPitch(p.getHarmonicEventPitch(
								harm, rndInt(-2, 2))), rndInt(vel - 15, vel));
				}
			}
		}
	}

}
