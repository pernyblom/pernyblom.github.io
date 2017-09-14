package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;
import com.springworldgames.jcgmusic.Time;

public class MarchChords extends MusicScript implements Renderer {


	void PlaceNextChord(RenderPart p, Time t1) {
		int harm = p.getHarmonic(t1);

		for (int f = 0; f < p.getHarmonicComponents(harm); f++) {
			int pit = p.computePitch(p.getHarmonicEventPitch(harm, f));

			while (pit > 70)
				pit -= 12;

			while (pit < 48)
				pit += 12;

			Time end = t1;
			end.mPos += rndFloat(0.12, 0.18);
			p.addPercNote(t1, end, pit, rndInt(85, 95));
		}
	}

	@Override
	public void render(RenderPart p) {

		double step = 1.0;
		if (p.getTempo() < 70)
			step /= 2.0;

		for (int i = p.getStartBar(); i < p.getEndBar(); i++) {
			if (i % 2 == 1 && rndInt(0, 1) == 0) {
				for (double m = 0; m < p.getUniquePart().getMetrum(); m += step) {
					if (m > 0)
						PlaceNextChord(p, createTime(i, m));
					PlaceNextChord(p, createTime(i, m + step * 4.0 / 6.0));

					if (rndInt(0, 1) == 0
							&& m + step < p.getUniquePart().getMetrum())
						PlaceNextChord(p, createTime(i, m + step * 8.0 / 6.0));
				}
			} else {
				for (double m = 0; m < p.getUniquePart().getMetrum(); m += step) {
					PlaceNextChord(p, createTime(i, m + step * 4.0 / 6.0));
				}
			}
		}

	}

}
