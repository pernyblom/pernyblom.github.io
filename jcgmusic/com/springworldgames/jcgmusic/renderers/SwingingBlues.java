package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;
import com.springworldgames.jcgmusic.Time;

public class SwingingBlues extends MusicScript implements Renderer {


	@Override
	public void render(RenderPart p) {
		for (int b = p.getStartBar(); b < p.getEndBar(); b++) {
			int top = 4;
			for (int m = 0; m < p.getUniquePart().getMetrum(); m++) {
				Time t = createTime(b, m);
				int harm = p.getHarmonic(t);

				int pit = p.getHarmonicEventPitch(harm, 0);

				if (pit == p.alignPitch(pit, 1))
					pit = p.alignPitch(pit, 3);
				if (pit == p.alignPitch(pit, 1))
					pit = p.alignPitch(pit, 4);
				if (pit == p.alignPitch(pit, 5))
					pit = p.alignPitch(pit, 0);

				Time t2 = t.copy();
				t2.mPos += 0.6;

				p.addNote(t, t2, pit, rndInt(122, 127));
				p.addNote(t, t2, p.alignPitch(pit, top), rndInt(122, 127));

				t.mPos += 0.75;
				t2.mPos = t.mPos + 0.2;

				p.addNote(t, t2, pit, rndInt(105, 115));
				p.addNote(t, t2, p.alignPitch(pit, top), rndInt(105, 115));

				if (top == 4)
					top = 5;
				else
					top = 4;
			}
		}

	}

}
