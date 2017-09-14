package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;
import com.springworldgames.jcgmusic.Time;

public class BoogieWoogieSwing extends MusicScript implements Renderer {

	@Override
	public void render(RenderPart p) {

		// System.out.println(this);

		Time t = createTime(p.getStartBar(), 0);
		double delta;
		double[] delta_swing = new double[8];

		if (p.getTempo() > 90)
			delta = 0.5;
		else
			delta = 0.25;

		for (int i = 0; i < 8; i++)
			delta_swing[i] = delta;

		int[] vel = { 127, 118, 125, 115, 127, 115, 127, 127 };

		for (int i = 0; i < 8; i += 2) {
			if (rndInt(0, 1) == 0) {
				delta_swing[i] *= 1.5;
				delta_swing[i + 1] *= 0.5;
			}
		}

		int[] scale = { 0, 7, 2, 3, 3, 4, -3, 4 };
		int[] diat_off = { 0, 0, 0, 0, 1, 0, 0, 0 };

		int note = 0;
		int old_nhp = -1;

		double len_mult = 1.0;
		if (rndInt(0, 1) == 0)
			len_mult = 0.9;

		while (t.mBar < p.getEndBar()) {
			int nhp = p.getHarmonicEventPitch(p.getHarmonic(t), 0);
			if (nhp != old_nhp) {
				note = 0;
				old_nhp = nhp;
			}

			Time t2 = new Time();
			t2.mBar = t.mBar;
			t2.mPos = t.mPos + delta_swing[note] * len_mult;

			log("note " + note + " start: " + t.mBar + ", " + t.mPos
					+ " ( len = " + delta_swing[note] + " )");

			int chrPitch = p.alignPitch(nhp, scale[note]) + diat_off[note];
			// System.out.println(this + " " + chrPitch);

			p.addNote(t, t2, chrPitch, rndInt(vel[note] - 5, vel[note]));

			t.mPos += delta_swing[note];
			note = (note + 1) % 8;

			if (t.mPos >= p.getUniquePart().getMetrum()) {
				t.mBar++;
				t.mPos = 0;
				note = 0;
			}
		}

	}

}
