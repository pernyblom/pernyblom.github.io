package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;
import com.springworldgames.jcgmusic.Time;

public class BoogieWoogie extends MusicScript implements Renderer {


	@Override
	public void render(RenderPart p) {
		Time t = createTime(p.getStartBar(), 0);
		double delta;

		if (p.getTempo() > 110)
			delta = 0.5;
		else if (p.getTempo() < 100)
			delta = 0.25;
		else {
			if (rndInt(0, 1) == 0)
				delta = 0.25;
			else
				delta = 0.5;
		}

		int[] scale = { 0, 7, 2, 3, 3, 4, -3, 4 };
		int[] diat_off = { 0, 0, 0, 0, 1, 0, 0, 0 };

		int note = 0;
		int old_nhp = -1;

		double delta_mult = rndFloat(0.5, 1.0);
		if (rndInt(0, 1) == 0)
			delta_mult = 0.95;

		while (t.mBar < p.getEndBar()) {
			int nhp = p.getHarmonicEventPitch(p.getHarmonic(t), 0);
			if (nhp != old_nhp) {
				note = 0;
				old_nhp = nhp;
			}

			Time t2 = new Time(0, 0);
			t2.mBar = t.mBar;
			t2.mPos = t.mPos + delta * delta_mult;

			int chrPitch = p.alignPitch(p.getHarmonicEventPitch(p
					.getHarmonic(t), 0), scale[note])
					+ diat_off[note];

			p.addNote(t, t2, chrPitch, 127);

			note = (note + 1) % 8;

			t.mPos += delta;
			if (t.mPos >= p.getUniquePart().getMetrum()) {
				t.mBar++;
				t.mPos = 0;
				note = 0;
			}
		}

	}

}
