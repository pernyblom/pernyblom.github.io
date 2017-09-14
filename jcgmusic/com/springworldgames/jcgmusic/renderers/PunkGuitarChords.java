package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;
import com.springworldgames.jcgmusic.Time;

public class PunkGuitarChords extends MusicScript implements Renderer {

	boolean[] GenerateAccents(RenderPart p, double speed, boolean first) {
		int count = (int) (p.getUniquePart().getMetrum() / speed);

		boolean[] accents = new boolean[count];

		for (int i = 0; i < count; i++) {
			if (first && i == 0)
				accents[i] = true;
			else {
				if (i > 0 && accents[i - 1]) {
					accents[i] = false;
				} else {
					if (rndInt(0, 1) == 0)
						accents[i] = true;
					else
						accents[i] = false;
				}
			}
		}

		return accents;
	}

	int last_harm;
	int low_pit;

	int abs(int val) {
		if (val < 0)
			return -val;
		return val;
	}

	void PlacePunkChord(RenderPart p, Time t, Time t2, int vel, int harm,
			boolean accent, int swap_down) {
		int[] pit = new int[3];

		pit[0] = p.getHarmonicEventPitch(harm, 0);
		pit[1] = p.alignPitch(p.getHarmonicEventPitch(harm, 0), 4);
		pit[2] = p.alignPitch(p.getHarmonicEventPitch(harm, 0), 7);

		if (last_harm < -100) {
			last_harm = harm;
			low_pit = pit[0] + rndInt(-4, 10);
		}

		if (last_harm != harm) {
			last_harm = harm;
			low_pit = pit[0] + rndInt(-3, 5);
		}

		while (pit[0] > low_pit) {
			int odl = pit[0] - low_pit;

			if (odl >= abs(low_pit - (pit[1] - 12))) {

				int tmp = pit[2];
				pit[2] = pit[1];
				pit[1] = tmp;

				tmp = pit[1];
				pit[1] = pit[0];
				pit[0] = tmp;

				pit[0] = pit[2] - 12;
			} else
				break;
		}

		int odl = pit[1] - pit[0];
		if (odl != 6) {
			if (swap_down == 1) {
				p.addNote(t, t2, pit[0], vel);
				p.addNote(t, t2, pit[1] - 12, vel);
				p.addNote(t, t2, pit[1], vel);
			} else {
				p.addNote(t, t2, pit[0], vel);
				p.addNote(t, t2, pit[1], vel);
				p.addNote(t, t2, pit[2], vel);

				if (rndInt(0, 1) == 0 && accent)
					p.addNote(t, t2, pit[1] + 12, vel);
			}
		} else {
			if (accent) {
				p.addNote(t, t2, p.getHarmonicEventPitch(harm, 0), vel);
				p.addNote(t, t2, p.alignPitch(p.getHarmonicEventPitch(harm, 0),
						4) - 12, vel / 3);
				p.addNote(t, t2, p.getHarmonicEventPitch(harm, 0) - 12, vel);
			} else {
				p.addNote(t, t2, p.getHarmonicEventPitch(harm, 0), vel);
				p.addNote(t, t2, p.getHarmonicEventPitch(harm, 0) - 12, vel);
			}
		}

	}

	void DoMode1(RenderPart p) {
		Time tOuter = createTime(p.getStartBar(), 0);

		double speed = 0.5;

		if (p.getTempo() < 110)
			speed /= 2.0;

		int wyprz = rndInt(0, 2);
		int speed_up = rndInt(0, 1);

		int reset = 8;
		if (rndInt(0, 1) == 0)
			reset = 4;

		resetSeed();
		boolean[] accents = GenerateAccents(p, speed, true);

		int reset_counter = 0;

		for (int i = p.getStartBar(); i < p.getEndBar(); i++) {
			Time t = createTime(i, 0);

			for (int a = 0; a < accents.length; a++) {
				int harm = p.getHarmonic(t);

				if (wyprz > 0 && a == accents.length - 1) {
					if (wyprz == 1 || (wyprz == 2 && rndInt(0, 1) == 0))
						harm = p.getHarmonic(createTime(t.mBar + 1, 0));
				}

				Time t2;
				int vel = 88;
				if (accents[a]) {
					t2 = createTime(t.mBar, t.mPos + 0.8 * speed);
					vel = 116;
				} else
					t2 = createTime(t.mBar, t.mPos + speed * 0.4);

				PlacePunkChord(p, t, t2, vel, harm, accents[a], 0);

				if (speed_up > 0 && !accents[a] && a == accents.length - 1) {
					PlacePunkChord(p,
							createTime(t.mBar, t.mPos + speed / 2.0),
							createTime(t2.mBar, t2.mPos + speed * 0.4), vel,
							harm, accents[a], 0);
				}

				t.mPos += speed;
			}

			reset_counter++;
			if (reset_counter >= reset) {
				reset_counter = 0;
				resetSeed();
				last_harm = -1000;
				accents = GenerateAccents(p, speed, true);
			} else {
				accents = GenerateAccents(p, speed, false);
			}
		}
	}

	void DoMode2(RenderPart p) {
		double step = 2;
		if (p.getUniquePart().getMetrum() == 3) {
			step = 2;
			if (p.getTempo() < 120)
				step /= 2.0;
		} else {
			if (p.getTempo() < 110)
				step /= 2.0;
		}

		int swap_down = rndInt(0, 1);

		for (int i = p.getStartBar(); i < p.getEndBar(); i++) {
			for (double m = 0; m + step * 0.9 < p.getUniquePart().getMetrum(); m += step) {
				Time t = createTime(i, m);
				int harm = p.getHarmonic(t);

				if (rndInt(0, 2) != 0)
					PlacePunkChord(p, t, createTime(i, m + step / 2.0), 120,
							harm, true, swap_down);
				else {
					PlacePunkChord(p, t, createTime(i, m + step / 4.0), 120,
							harm, true, swap_down);
					PlacePunkChord(p, createTime(i, m + step / 4.0),
							createTime(i, m + step / 2.0), 120, harm, true,
							swap_down);
				}

				PlacePunkChord(p, createTime(i, m + step / 2.0), createTime(i,
						m + step / 2.0 + 0.1), 88, harm, false, swap_down);

				if ((i != p.getStartBar() || m > 0) && rndInt(0, 4) != 0) {
					if (rndInt(0, 1) == 0) {
						if (m > 0)
							harm = p.getHarmonic(createTime(i, m - 0.1));
						else
							harm = p.getHarmonic(createTime(i - 1, p
									.getUniquePart().getMetrum()
									- step / 4.0 + m));
					}

					if (rndInt(0, 3) != 0) {
						PlacePunkChord(p, createTime(i - 1, p.getUniquePart()
								.getMetrum()
								- step / 4.0 + m), t, 120, harm, true,
								swap_down);
					} else {
						PlacePunkChord(p, createTime(i - 1, p.getUniquePart()
								.getMetrum()
								- step / 4.0 + m), createTime(i - 1, p
								.getUniquePart().getMetrum()
								- step / 4.0 + 0.1 + m), 88, harm, false,
								swap_down);
						PlacePunkChord(p, createTime(i - 1, p.getUniquePart()
								.getMetrum()
								- step / 8.0 + m), createTime(i - 1, p
								.getUniquePart().getMetrum()
								- step / 8.0 + 0.1 + m), 88, harm, false,
								swap_down);
					}

				}

				if (swap_down == 0)
					swap_down = 1;
				else
					swap_down = 0;
			}
		}
	}

	void DoMode3(RenderPart p) {
		double step = 1.0;
		if (p.getTempo() < 140)
			step /= 2.0;
		if (p.getTempo() < 60)
			step /= 2.0;

		Time t = createTime(p.getStartBar(), 0);

		int[] swap_down = { rndInt(0, 1), rndInt(0, 1) };
		boolean[] accent = { false, false };

		if (rndInt(0, 1) == 0)
			accent[0] = true;
		if (rndInt(0, 1) == 0)
			accent[1] = true;

		if (rndInt(0, 2) != 0) {
			accent[0] = false;
			accent[1] = false;
			swap_down[0] = 0;
			swap_down[1] = 0;
		}

		for (int i = p.getStartBar(); i < p.getEndBar(); i++) {
			for (double m = 0; m < p.getUniquePart().getMetrum(); m += step) {
				int harm = p.getHarmonic(createTime(i, m));
				if (rndInt(0, 3) != 0 || (m < 0.1 && rndInt(0, 1) == 0)) {
					PlacePunkChord(p, createTime(i, m),
							createTime(i, m + step), 125, harm, accent[0],
							swap_down[0]);
				} else {
					PlacePunkChord(p, createTime(i, m), createTime(i, m + step
							/ 2), 120, harm, accent[1], swap_down[1]);
					PlacePunkChord(p, createTime(i, m + step / 2), createTime(
							i, m + step), 120, harm, accent[1], swap_down[1]);
				}
			}
		}
	}

	@Override
	public void render(RenderPart p) {
		int mode = Integer.parseInt(p.getParam("mode"));
		if (mode == 0)
			mode = rndInt(0, 2);
		else
			mode--;

		last_harm = -1000;
		if (mode == 0)
			DoMode1(p);
		if (mode == 1)
			DoMode2(p);
		if (mode == 2)
			DoMode3(p);
	}

}
