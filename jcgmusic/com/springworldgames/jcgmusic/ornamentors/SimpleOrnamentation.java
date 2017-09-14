package com.springworldgames.jcgmusic.ornamentors;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.Ornamentor;
import com.springworldgames.jcgmusic.Part;
import com.springworldgames.jcgmusic.Time;
import com.springworldgames.jcgmusic.UniquePart;

public class SimpleOrnamentation extends MusicScript implements Ornamentor {


	double getEventLen(UniquePart up, int i) {
		return (up.getEventEnd(i).mBar - up.getEventStart(i).mBar)
				* up.getMetrum()
				+ (up.getEventEnd(i).mPos - up.getEventStart(i).mPos);
	}

	@Override
	public void ornament(UniquePart up, Part p) {
		int off_mode = rndInt(0, 1);
		if (off_mode == 0)
			off_mode = -1;

		int last_off = rndInt(0, 1);

		for (int i = 0; i < up.getEvents(); i++) {
			Time t1 = up.getEventStart(i);
			Time t2 = up.getEventEnd(i);

			boolean tril = false;

			if (rndInt(0, 2) != 0 && getEventLen(up, i) > 1.4) {
				double len = 0.25;

				p.addEvent(t1, createTime(t1.mBar, t1.mPos + len), p
						.computePitch(up.getEventPitch(i)));
				p.addEvent(createTime(t1.mBar, t1.mPos + len * 2), createTime(
						t1.mBar, t1.mPos + len * 3), p.computePitch(up
						.getEventPitch(i)));

				if (rndInt(0, 1) == 0) {
					p.addEvent(createTime(t1.mBar, t1.mPos + len), createTime(
							t1.mBar, t1.mPos + len * 2), p.computePitch(up
							.getEventPitch(i)) - 1);
					p.addEvent(createTime(t1.mBar, t1.mPos + len * 3),
							createTime(t1.mBar, t1.mPos + len * 4), p
									.computePitch(up.getEventPitch(i) + 1));
				} else {
					p.addEvent(createTime(t1.mBar, t1.mPos + len), createTime(
							t1.mBar, t1.mPos + len * 2), p.computePitch(up
							.getEventPitch(i) + 1));
					p.addEvent(createTime(t1.mBar, t1.mPos + len * 3),
							createTime(t1.mBar, t1.mPos + len * 4), p
									.computePitch(up.getEventPitch(i)) - 1);
				}

				tril = true;

				t1.mPos += len * 4;

			} else if (getEventLen(up, i) > 0.9 && rndInt(0, 2) != 0) {
				double len = 0.25;

				p.addEvent(t1, createTime(t1.mBar, t1.mPos + len), p
						.computePitch(up.getEventPitch(i)));
				if (rndInt(0, 1) == 0)
					p.addEvent(createTime(t1.mBar, t1.mPos + len), createTime(
							t1.mBar, t1.mPos + len * 2), p.computePitch(up
							.getEventPitch(i)) - 1);
				else
					p.addEvent(createTime(t1.mBar, t1.mPos + len), createTime(
							t1.mBar, t1.mPos + len * 2), p.computePitch(up
							.getEventPitch(i) + 1));
				t1.mPos += len * 2;

				tril = true;
			}

			double l1 = -100;
			if (i > 0)
				l1 = up.getEventEnd(i - 1).mBar * up.getMetrum()
						+ up.getEventEnd(i - 1).mPos;
			double l2 = up.getEventStart(i).mBar * up.getMetrum()
					+ up.getEventStart(i).mPos;

			if (!tril && l1 < l2 - 0.1 && rndInt(0, 1) == 0) {
				double len = 0.1;
				if (rndInt(0, 1) == 0)
					p.addEvent(createTime(t1.mBar, t1.mPos - len), t1, p
							.computePitch(up.getEventPitch(i)) - 1);
				else
					p.addEvent(createTime(t1.mBar, t1.mPos - len), t1, p
							.computePitch(up.getEventPitch(i) + 1));

				tril = true;
			}

			int off_diat = 0;
			int off_chrom = 0;
			if (i > 0 && i < up.getEvents() - 1 && !tril && last_off == 0) {
				if (up.getEventPitch(i + off_mode) == up.getEventPitch(i)) {
					off_diat = 1;
					last_off = 1;
				} else
					last_off = 0;
			} else
				last_off = 0;

			p.addEvent(t1, t2, p.computePitch(up.getEventPitch(i) + off_diat)
					+ off_chrom);

		}
	}

}
