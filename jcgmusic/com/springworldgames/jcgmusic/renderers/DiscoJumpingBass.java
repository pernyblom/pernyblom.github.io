package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;
import com.springworldgames.jcgmusic.Time;

public class DiscoJumpingBass extends MusicScript implements Renderer {


	@Override
	public void render(RenderPart p) {

		double delta = 0.5;

		if (p.getTempo() < 125)
			delta = 0.25;

		Time t = createTime(p.getStartBar(), 0);

		int n = 0;

		while (t.mBar < p.getEndBar()) {
			int harm = p.getHarmonic(t);
			int pit = p.getHarmonicEventPitch(harm, 0);

			Time t2 = t.copy();
			t2.mPos += delta * 0.95;

			if (n == 0) {
				p.addNote(t, t2, pit, rndInt(125, 127));
				n = 1;
			} else {
				p.addNote(t, t2, p.alignPitch(pit, 7), rndInt(105, 117));
				n = 0;
			}

			t.mPos += delta;
			if (t.mPos >= p.getUniquePart().getMetrum()) {
				t.mPos = 0;
				t.mBar++;
			}
		}

	}

}
