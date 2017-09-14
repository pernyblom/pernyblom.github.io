package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;
import com.springworldgames.jcgmusic.Time;

public class RandomBass extends MusicScript implements Renderer {

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

		double len = rndFloat(0.5, 1.0);
		if (rndInt(0, 1) == 0)
			len = 0.98;

		for (int i = p.getStartBar(); i < p.getEndBar(); i++) {
			for (int m = 0; m < p.getUniquePart().getMetrum(); m++) {
				Time t = createTime(i, m);
				int vel = 127;
				if (m % 2 == 1)
					vel = 115;

				int harm = p.getHarmonic(t);

				if (harm == p.getHarmonicEvents() - 1) {
					p.addNote(p
							.getHarmonicEventStart(p.getHarmonicEvents() - 1),
							p.getHarmonicEventEnd(p.getHarmonicEvents() - 1),
							GetNextPitch(p.getHarmonicEventPitch(p
									.getHarmonicEvents() - 1, 0)), rndInt(115,
									126));
					return;
				}

				Time t2 = t.copy();
				t2.mPos += len;

				int nextPitch = GetNextPitch(p.getHarmonicEventPitch(harm, 0));
				// System.out.println(this + " " + t + " " + t2 + " " +
				// nextPitch);
				p.addNote(t, t2, nextPitch, rndInt(vel - 15, vel));
			}
		}

	}

}
