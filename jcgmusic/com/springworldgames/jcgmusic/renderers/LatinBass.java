package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;
import com.springworldgames.jcgmusic.Time;

public class LatinBass extends MusicScript implements Renderer {


	@Override
	public void render(RenderPart p) {

		double speed = 2;

		int vel = 125;

		int pyk = 0;

		int old_harm = 0;

		for (int i = p.getStartBar(); i < p.getEndBar(); i++) {
			pyk = 0;
			for (double m = 0; m < p.getUniquePart().getMetrum(); m += speed) {
				if (p.getUniquePart().getMetrum() - m < speed) {
					Time t = createTime(i, m);
					int harm = p.getHarmonic(t);
					old_harm = harm;
					Time t2 = createTime(i, p.getUniquePart().getMetrum());
					p.addNote(t, t2, p.getHarmonicEventPitch(harm, 0), rndInt(
							vel - 15, vel));
				} else {

					Time t = createTime(i, m);
					int harm = p.getHarmonic(t);

					if (old_harm != harm) {
						pyk = 0;
						old_harm = harm;
					}

					int off = 0;
					if (pyk == 0)
						pyk = 1;
					else {
						off = 3;
						pyk = 0;
					}

					Time t2 = createTime(i, m + speed * 0.70);
					p.addNote(t, t2, p.alignPitch(p.getHarmonicEventPitch(harm,
							0), -off), rndInt(vel - 15, vel));

					t = createTime(i, m + speed * 0.75);
					harm = p.getHarmonic(t);
					t2 = createTime(i, m + speed * 0.95);
					p.addNote(t, t2, p.alignPitch(p.getHarmonicEventPitch(harm,
							0), -off), rndInt(vel - 15, vel));

				}

				pyk++;
			}
		}

	}

}
