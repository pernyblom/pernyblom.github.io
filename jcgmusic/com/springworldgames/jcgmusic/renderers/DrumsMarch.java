package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;

public class DrumsMarch extends MusicScript implements Renderer {


	void DoSnare(RenderPart p) {
		double step = 1.0;

		if (p.getTempo() < 70)
			step /= 2.0;

		double len = p.getUniquePart().getMetrum() / step;

		int pat_len = (int) (rndInt(1, 2) * len);

		int[] pattern = new int[pat_len];

		for (int i = 0; i < pat_len; i++)
			pattern[i] = rndInt(0, 2);

		int n = 0;

		for (int i = p.getStartBar(); i < p.getEndBar(); i++) {
			for (double m = 0; m < p.getUniquePart().getMetrum(); m += step) {
				p
						.addPercNote(createTime(i, m), createTime(i, m + 0.1),
								40, 127);

				int doit = pattern[n % pat_len];
				if (rndInt(0, 2) == 0)
					doit = rndInt(0, 2);

				if (doit == 0 || doit == 1)
					p.addPercNote(createTime(i, m + step * 5.0 / 8.0),
							createTime(i, m + 0.1 + step * 5.0 / 8.0), 38,
							rndInt(90, 100));

				if (doit == 1)
					p.addPercNote(createTime(i, m + step * 2.5 / 8.0),
							createTime(i, m + 0.1 + step * 2.5 / 8.0), 40,
							rndInt(80, 100));

				if (doit == 2) {
					p.addPercNote(createTime(i, m + step * 4.0 / 6.0),
							createTime(i, m + 0.1 + step * 4.0 / 6.0), 40,
							rndInt(80, 90));
					p.addPercNote(createTime(i, m + step * 5.0 / 6.0),
							createTime(i, m + 0.1 + step * 5.0 / 6.0), 38,
							rndInt(90, 100));
				}

				n++;
			}
		}
	}

	void DoFoot(RenderPart p) {
		double step = 1.0;
		if (p.getTempo() < 70)
			step /= 2.0;
		for (int i = p.getStartBar(); i < p.getEndBar(); i++) {
			for (double m = 0; m < p.getUniquePart().getMetrum(); m += step)
				p.addPercNote(createTime(i, m), createTime(i, m + 0.1), 36,
						rndInt(75, 95));
			if (rndInt(0, 1) == 0)
				p.addPercNote(createTime(i, p.getUniquePart().getMetrum()
						- step * 0.25), createTime(i, p.getUniquePart()
						.getMetrum()
						- step * 0.1), 36, rndInt(65, 85));
		}
	}

	void DoCymbal(RenderPart p) {
		double step = 1.0;
		if (p.getTempo() < 70)
			step /= 2.0;
		for (int i = p.getStartBar(); i < p.getEndBar(); i++) {
			int n = 0;
			for (double m = 0; m < p.getUniquePart().getMetrum(); m += step) {
				if (n == 0 || (n == 1 && rndInt(0, 1) == 0))
					p.addPercNote(createTime(i, m), createTime(i, m + 0.1), 59,
							rndInt(85, 115));
				if (n == 0)
					n = 1;
				else
					n = 0;
			}
		}
	}

	@Override
	public void render(RenderPart p) {
		if (Integer.parseInt(p.getParam("snare")) > 0)
			DoSnare(p);
		if (Integer.parseInt(p.getParam("foot")) > 0)
			DoFoot(p);
		if (Integer.parseInt(p.getParam("cymbal")) > 0)
			DoCymbal(p);
	}

}
