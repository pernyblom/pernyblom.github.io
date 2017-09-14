package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;
import com.springworldgames.jcgmusic.Time;

public class FastBass extends MusicScript implements Renderer {


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
		last_pitch = cur_pitch;
		return cur_pitch;
	}

	@Override
	public void render(RenderPart p) {
		SetFirstPitch(p.getHarmonicEventPitch(0, 0));

		double speed = 0.5;
		if (p.getTempo() < 90)
			speed /= 2.0;
		if (p.getTempo() > 180)
			speed *= 2.0;

		double len = rndFloat(0.5, 1.0);

		Time t = createTime(p.getStartBar(), 0);

		int co = 4;
		if (rndInt(0, 1) == 0)
			co = 8;
		int cnt = 0;

		while (t.mBar < p.getEndBar()) {
			int harm = p.getHarmonic(t);

			cnt++;

			if (rndInt(0, 2) != 0) {
				if (cnt % co == 0) {
					p.addNote(t, createTime(t.mBar, t.mPos + speed * len),
							GetNextPitch(p.getHarmonicEventPitch(harm, rndInt(
									-1, 1))), rndInt(120, 126));
				} else
					p.addNote(t, createTime(t.mBar, t.mPos + speed * len),
							GetNextPitch(p.getHarmonicEventPitch(harm, 0)),
							rndInt(120, 126));
			} else {
				if (cnt % co == 0) {
					int up = rndInt(-1, 1);
					p.addNote(t,
							createTime(t.mBar, t.mPos + speed * len / 2),
							GetNextPitch(p.getHarmonicEventPitch(harm, up)),
							rndInt(120, 126));
					p.addNote(createTime(t.mBar, t.mPos + speed / 2),
							createTime(t.mBar, t.mPos + speed / 2
									+ ((speed / 2) * len)), GetNextPitch(p
									.getHarmonicEventPitch(harm, up)), rndInt(
									120, 126));
				} else {
					p.addNote(t,
							createTime(t.mBar, t.mPos + speed * len / 2),
							GetNextPitch(p.getHarmonicEventPitch(harm, 0)),
							rndInt(120, 126));
					p.addNote(createTime(t.mBar, t.mPos + speed / 2),
							createTime(t.mBar, t.mPos + speed / 2
									+ ((speed / 2) * len)), GetNextPitch(p
									.getHarmonicEventPitch(harm, 0)), rndInt(
									120, 126));

				}
			}

			t.mPos += speed;
			if (t.mPos >= p.getUniquePart().getMetrum() - 0.1) {
				t.mPos = 0;
				t.mBar++;
			}
		}
	}

}
