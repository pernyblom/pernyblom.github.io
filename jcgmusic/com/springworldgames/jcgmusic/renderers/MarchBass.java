package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;
import com.springworldgames.jcgmusic.Time;

public class MarchBass extends MusicScript implements Renderer {


	@Override
	public void render(RenderPart p) {
		double step = 1.0;
		if (p.getTempo() < 70)
			step /= 2.0;

		for (int i = p.getStartBar(); i < p.getEndBar(); i++) {
			int n = 0;

			for (double m = 0; m < p.getUniquePart().getMetrum(); m += step) {
				if (m + step >= p.getUniquePart().getMetrum()
						&& rndInt(0, 2) != 0) {
					Time t = createTime(i, m);
					int harm = p.getHarmonic(t);
					int basis = p.getHarmonicEventPitch(harm, 2) - 12;
					double len = step / 3.0;

					p.addNote(t, createTime(i, m + len), p.alignPitch(p
							.getHarmonicEventPitch(harm, 0), -3), 95);
					p.addNote(createTime(i, m + len),
							createTime(i, m + len * 2), p.alignPitch(p
									.getHarmonicEventPitch(harm, 0), -2), 100);
					p.addNote(createTime(i, m + len * 2), createTime(i, m
							+ step), p.alignPitch(p.getHarmonicEventPitch(harm,
							0), -1), 105);
				} else {
					Time t = createTime(i, m);
					int harm = p.getHarmonic(t);
					int basis = p.getHarmonicEventPitch(harm, 0);

					if (rndInt(0, 3) == 0)
						n = rndInt(0, 1);

					if (n == 1)
						basis = p.getHarmonicEventPitch(harm, 2) - 12;

					Time end = t.copy();
					end.mPos += step * 0.3;

					p.addNote(t, end, basis, rndInt(100, 119));

					if (n == 0)
						n = 1;
					else
						n = 0;
				}
			}
		}

	}

}
