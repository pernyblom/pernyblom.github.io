package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;

public class DrumsPunkRock extends MusicScript implements Renderer {

	void DoFootAndSnare(RenderPart p) {
		double step = 1.0;

		if (p.getTempo() < 120)
			step /= 2.0;

		boolean type = true;

		for (int i = p.getStartBar(); i < p.getEndBar(); i++) {
			for (double m = 0; m < p.getUniquePart().getMetrum(); m += step) {
				if (type) {
					if (rndInt(0, 2) != 0 || (m < step)) {
						p.addPercNote(createTime(i, m), createTime(i, m + 0.1),
								36, 127);
						if (rndInt(0, 2) != 0)
							p.addPercNote(createTime(i, m + step / 2),
									createTime(i, m + step / 2 + 0.1), 36, 127);
					} else {
						p.addPercNote(createTime(i, m + step / 2), createTime(
								i, m + step / 2 + 0.1), 36, 127);
					}
				} else {
					p.addPercNote(createTime(i, m), createTime(i, m + 0.1), 38,
							118);
					if (rndInt(0, 2) != 0)
						p.addPercNote(createTime(i, m + step / 2), createTime(
								i, m + step / 2 + 0.1), 36, 127);
				}

				if (type)
					type = false;
				else
					type = true;
			}
		}
	}

	void DoChorusHiHat(RenderPart p, int pit) {
		double step = 0.5;
		if (p.getTempo() < 120)
			step /= 2.0;

		for (int i = p.getStartBar(); i < p.getEndBar(); i++) {
			for (double m = 0; m < p.getUniquePart().getMetrum(); m += step) {
				if (i % 2 == 0) {
					if (m < step) {
						if (rndInt(0, 1) == 0)
							p.addPercNote(createTime(i, m), createTime(i,
									m + 0.1), 57, 125);
						else
							p.addPercNote(createTime(i, m), createTime(i,
									m + 0.1), 49, 125);
					} else
						p.addPercNote(createTime(i, m), createTime(i, m + 0.1),
								pit, rndInt(95, 105));
				} else {
					if (m + step >= p.getUniquePart().getMetrum()
							&& rndInt(0, 1) == 0) {
						if (rndInt(0, 1) == 0)
							p.addPercNote(createTime(i, m), createTime(i,
									m + 0.1), 57, 118);
						else
							p.addPercNote(createTime(i, m), createTime(i,
									m + 0.1), 49, 118);
					} else
						p.addPercNote(createTime(i, m), createTime(i, m + 0.1),
								pit, rndInt(95, 105));
				}
			}
		}
	}

	void DoIntroHiHat(RenderPart p) {
		double step = 1.0;
		if (p.getTempo() < 120)
			step /= 2.0;

		int bars = 4;
		if (rndInt(0, 1) == 0)
			bars = 2;
		if (rndInt(0, 2) == 0)
			bars = 1;

		for (int i = p.getStartBar(); i < p.getEndBar(); i++) {
			if (i % bars == 0) {
				p.addPercNote(createTime(i, -step / 2.0), createTime(i,
						-(step / 2.0) + 0.1), 46, 111);
			}

			for (double m = 0; m < p.getUniquePart().getMetrum(); m += step) {
				p.addPercNote(createTime(i, m), createTime(i, m + 0.1), 42,
						rndInt(109, 113));
			}
		}
	}

	void DoTransition(RenderPart p) {
		double step = 0.25;
		if (p.getTempo() < 100)
			step /= 2.0;

		for (int i = p.getStartBar(); i < p.getEndBar(); i++) {
			double start = rndInt(0, 1) * step * 2;

			p.addPercNote(createTime(i, start), createTime(i, start + 0.1), 36,
					127);
			p.addPercNote(createTime(i, p.getUniquePart().getMetrum() / 2),
					createTime(i, p.getUniquePart().getMetrum() / 2 + 0.1), 36,
					127);
			p.addPercNote(createTime(i, p.getUniquePart().getMetrum() - step
					* 2), createTime(i, p.getUniquePart().getMetrum() - step
					* 2 + 0.1), 36, 127);

			if (rndInt(0, 4) != 0)
				p.addPercNote(createTime(i, start), createTime(i, start + 0.1),
						58, 117);
			if (rndInt(0, 4) != 0)
				p.addPercNote(createTime(i, p.getUniquePart().getMetrum() / 2),
						createTime(i, p.getUniquePart().getMetrum() / 2 + 0.1),
						49, 111);
			if (rndInt(0, 4) != 0)
				p.addPercNote(createTime(i, p.getUniquePart().getMetrum()
						- step * 2), createTime(i, p.getUniquePart()
						.getMetrum()
						- step * 2 + 0.1), 58, 117);

			for (double m = start + rndInt(1, 2) * step; m < p.getUniquePart()
					.getMetrum() / 2; m += step)
				p.addPercNote(createTime(i, m), createTime(i, m + 0.1), 38,
						rndInt(108, 115));

			if (i == p.getEndBar() - 1) {
				int n = 0;

				for (double m = p.getUniquePart().getMetrum() / 2 + step
						* rndInt(0, 2); m < p.getUniquePart().getMetrum()
						- step * rndInt(0, 1); m += step) {
					if (rndInt(0, 5) != 0) {
						p.addPercNote(createTime(i, m), createTime(i, m + 0.1),
								47 - n * 2, rndInt(108, 115));
						if (n < 3 && rndInt(0, 1) == 0)
							n++;
					}
				}
			} else {
				if (rndInt(0, 1) == 0) {
					for (double m = p.getUniquePart().getMetrum() / 2 + step
							* 2; m < p.getUniquePart().getMetrum() - step
							* rndInt(0, 2); m += step) {
						p.addPercNote(createTime(i, m), createTime(i, m + 0.1),
								38, rndInt(108, 115));
					}
				} else {
					boolean type = false;
					if (rndInt(0, 1) == 0)
						type = true;
					for (double m = p.getUniquePart().getMetrum() / 2 + step
							* 2; m < p.getUniquePart().getMetrum() - step
							* rndInt(0, 2); m += step * 2) {
						if (type) {
							p.addPercNote(createTime(i, m), createTime(i,
									m + 0.1), 38, rndInt(108, 115));
							p.addPercNote(createTime(i, m + step), createTime(
									i, m + step + 0.1), 38, rndInt(108, 115));
							type = false;
						} else {
							type = true;
							p.addPercNote(createTime(i, m), createTime(i,
									m + 0.1), 45, 127);
						}
					}
				}
			}
		}
	}

	@Override
	public void render(RenderPart p) {

		// System.out.println(this);
		if (Integer.parseInt(p.getParam("foot & snare")) > 0) {
			// System.out.println("foot snare");
			DoFootAndSnare(p);
		}
		if (Integer.parseInt(p.getParam("chorus hi-hat")) > 0) {
			// System.out.println("chorus hi-hat");
			DoChorusHiHat(p, 46);
		}
		if (Integer.parseInt(p.getParam("verse hi-hat")) > 0) {
			// System.out.println("verse hi-hat");
			DoChorusHiHat(p, 51);
		}
		if (Integer.parseInt(p.getParam("intro hi-hat")) > 0) {
			// System.out.println("intro hi-hat");
			DoIntroHiHat(p);
		}
		if (Integer.parseInt(p.getParam("transition")) > 0) {
			// System.out.println("transition");
			DoTransition(p);
		}
	}

}
