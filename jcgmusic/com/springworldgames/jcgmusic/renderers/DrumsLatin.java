package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;
import com.springworldgames.jcgmusic.Time;

public class DrumsLatin extends MusicScript implements Renderer {


	int GetVel(Time t) {
		return rndInt(110, 126);
	}

	void RealizePattern(RenderPart p, double len, double[] pat, int pitch,
			int vel_off) {
		for (int i = p.getStartBar(); i < p.getEndBar(); i++) {
			for (double m = 0; m < p.getUniquePart().getMetrum(); m += len) {
				for (int n = 0; n < pat.length; n++) {
					if (pat[n] + m < p.getUniquePart().getMetrum()) {
						p.addPercNote(createTime(i, m + pat[n]), createTime(i,
								m + pat[n] + 0.125), pitch, rndInt(100, 120)
								+ vel_off);
					}
				}
			}
		}
	}

	void SpeedUpPattern(double[] pat) {
		for (int i = 0; i < pat.length; i++) {
			pat[i] /= 2.0;
		}
	}

	@Override
	public void render(RenderPart p) {
		double pattern_length = 4;
		double[] foot_pattern = { 0, 1.5, 2.0, 3.5 };
		double[] stick_pattern = { 0, 1, 2.5, 3.5 };
		double[] shaker1_pattern = { 0.5, 1.5, 2.5, 3.5 };
		double[] shaker2_pattern = { 1, 3 };
		double[] bebenek1_pattern = { 0 };
		double[] bebenek2_pattern = { 0.5 };

		double shaker3_length = 0.5;
		double bebenek_length = 1.0;

		if (rndInt(0, 2) == 0)
			shaker3_length = 1.0;

		double[] shaker3_pattern = { 0 };

		if (p.getTempo() < 80) {
			pattern_length /= 2;
			shaker3_length /= 2;
			bebenek_length /= 2;

			SpeedUpPattern(foot_pattern);
			SpeedUpPattern(stick_pattern);
			SpeedUpPattern(shaker1_pattern);
			SpeedUpPattern(shaker2_pattern);
			SpeedUpPattern(shaker3_pattern);
			SpeedUpPattern(bebenek1_pattern);
			SpeedUpPattern(bebenek2_pattern);
		}

		RealizePattern(p, pattern_length, foot_pattern, rndInt(35, 36), 5);
		RealizePattern(p, pattern_length, stick_pattern, 37, 5);

		RealizePattern(p, pattern_length, shaker1_pattern, 36 + 33, 0);
		RealizePattern(p, pattern_length, shaker2_pattern, 36 + 33 + 13, -25);

		if (rndInt(0, 1) == 0)
			RealizePattern(p, shaker3_length, shaker3_pattern, 36 + 6, -30);
		else
			RealizePattern(p, shaker3_length, shaker3_pattern, 36 + 18, -30);

		if (rndInt(0, 1) == 0) {
			RealizePattern(p, bebenek_length, bebenek1_pattern, 36 + 28, -5);
			RealizePattern(p, bebenek_length, bebenek2_pattern, 36 + 26, -6);
		}

	}

}
