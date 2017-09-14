package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;

public class DrumsDanceFootAndSnare extends MusicScript implements Renderer {


	@Override
	public void render(RenderPart p) {
		Pattern[] patterns = new Pattern[50];

		int w = 0;

		int[] pit1 = { 35, 36 };
		double[] pat1 = { 0 };
		patterns[w++] = newPattern(1, pit1, pat1, 119, 120);

		if (rndInt(0, 1) == 0) {
			int[] pit3 = { 35, 36 };
			double[] pat3 = { 0.5 + rndInt(0, 3) };
			patterns[w++] = newPattern(4, pit3, pat3, 115, 116);

		}

		if (rndInt(0, 2) != 0) {
			int[] p_pit = { 52, 40, 41, 48, 53, 55, 56, 62, 64 };
			int[] pit2 = { p_pit[rndInt(0, p_pit.length - 1)] };
			double[] pat2 = { 1 + rndInt(-1, 1) * 0.5 };
			patterns[w++] = newPattern(2, pit2, pat2, 100, 110);

			int[] pit3 = { 38, 39 };
			double[] pat3 = { rndInt(0, 1) };
			patterns[w++] = newPattern(2, pit3, pat3, 100, 110);
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
