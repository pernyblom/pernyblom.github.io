package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;

public class DrumsDanceHiHat extends MusicScript implements Renderer {


	@Override
	public void render(RenderPart p) {

		Pattern[] patterns = new Pattern[50];

		int w = 0;

		boolean b42 = false;

		if (rndInt(0, 1) == 0) {
			int[] pit2 = { 42 };
			double[] pat2 = { 0, 0.25, 0.5 };
			patterns[w++] = newPattern(1, pit2, pat2, 115, 120);
			b42 = true;
		} else {
			int[] pit2 = { 44 };
			double[] pat2 = { 0 };
			patterns[w++] = newPattern(1, pit2, pat2, 115, 120);

			int[] pit3 = { 82 };
			double[] pat3 = { 0.5 };
			patterns[w++] = newPattern(1, pit3, pat3, 115, 120);
		}

		int[] pit4 = { 44 };
		double[] pat4 = { 0.5 + 0.25 * rndInt(0, 1) };
		patterns[w++] = newPattern(1, pit4, pat4, 115, 120);

		int[] pit5 = { 46 };
		double[] pat5 = { 0.51 + 0.25 * rndInt(0, 1) };
		patterns[w++] = newPattern(1, pit5, pat5, 115, 120);

		if (rndInt(0, 1) == 0 && !b42) {
			pit5 = new int[] { 42 };
			if (b42)
				pit5[0] = 37;
			pat5 = new double[] { 0, 0.5, 0.75 };
			patterns[w++] = newPattern(1.0, pit5, pat5, 80, 90);
		}

		if (p.getTempo() < 90) {
			for (int i = 0; i < w; i++) {
				patterns[i].Length /= 2.0;
				for (int y = 0; y < patterns[i].pattern.length; y++)
					patterns[i].pattern[y] /= 2.0;
			}
		}

		if (p.getTempo() > 199) {
			for (int i = 0; i < w; i++) {
				patterns[i].Length *= 2.0;
				for (int y = 0; y < patterns[i].pattern.length; y++)
					patterns[i].pattern[y] *= 2.0;
			}
		}

		for (int i = 0; i < w; i++)
			realizePattern(p, patterns[i]);

	}

}
