package com.springworldgames.jcgmusic.ornamentors;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.Ornamentor;
import com.springworldgames.jcgmusic.Part;
import com.springworldgames.jcgmusic.Time;
import com.springworldgames.jcgmusic.UniquePart;

public class LightRandomizer extends MusicScript implements Ornamentor {


	// What is this?
	double abs(double i) {
		if (i < 0)
			return -1;
		return i;
	}

	@Override
	public void ornament(UniquePart up, Part p) {
		boolean skip = false;

		int upp = rndInt(0, 1);

		for (int i = 0; i < up.getEvents(); i++) {
			if (i < up.getEvents() - 1 && !skip) {
				Time t = up.getEventStart(i);

				int poz = (int) t.mPos;
				double tmp = t.mPos - poz;

				if (abs(tmp) < 0.1) {
					p.addEvent(up.getEventStart(i), up.getEventEnd(i), p
							.computePitch(up.getEventPitch(i)));
				} else // the note starts on a week part of the bar
				{
					skip = true;

					if (i > 0 && i < up.getEvents() - 1) {
						if (up.getEventPitch(i) != up.getEventPitch(i + 1)
								&& up.getEventPitch(i) != up
										.getEventPitch(i - 1)) {
							p.addEvent(up.getEventStart(i), up.getEventEnd(i),
									p.computePitch(up.getEventPitch(i)));
							skip = false;
						}
					}

					if (skip) {
						if (up.getEventPitch(i) == up.getEventPitch(i + 1)) {
							if (upp == 0)
								p.addEvent(up.getEventStart(i), up
										.getEventEnd(i), p.computePitch(up
										.getEventPitch(i) + 1));
							else
								p.addEvent(up.getEventStart(i), up
										.getEventEnd(i), p.computePitch(up
										.getEventPitch(i) - 1));
						}

						if (up.getEventPitch(i) > up.getEventPitch(i + 1)) {
							if (rndInt(0, 1) == 0)
								p.addEvent(up.getEventStart(i), up
										.getEventEnd(i), p.computePitch(up
										.getEventPitch(i) - 1));
							else
								p.addEvent(up.getEventStart(i), up
										.getEventEnd(i), p.computePitch(up
										.getEventPitch(i + 1) + 1));
						}

						if (up.getEventPitch(i) < up.getEventPitch(i + 1)) {
							if (rndInt(0, 1) == 0)
								p.addEvent(up.getEventStart(i), up
										.getEventEnd(i), p.computePitch(up
										.getEventPitch(i) + 1));
							else
								p.addEvent(up.getEventStart(i), up
										.getEventEnd(i), p.computePitch(up
										.getEventPitch(i + 1)) - 1);
						}
					}

				}
			} else {
				p.addEvent(up.getEventStart(i), up.getEventEnd(i), p
						.computePitch(up.getEventPitch(i)));
				skip = false;
			}

		}
	}

}
