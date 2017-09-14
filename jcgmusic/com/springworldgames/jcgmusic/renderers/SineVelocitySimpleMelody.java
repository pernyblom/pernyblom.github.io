package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;
import com.springworldgames.jcgmusic.Time;

public class SineVelocitySimpleMelody extends MusicScript implements Renderer {

	int first_pitch = 0;
	int last_pitch = 0;

	void SetFirstPitch(int f) {
		first_pitch = f;
		last_pitch = f;
	}

	int GetNextPitch(int p) {
		int cur_pitch = p;
		if (cur_pitch - 7 > last_pitch)
			cur_pitch -= 12;
		last_pitch = cur_pitch;
		return cur_pitch;
	}

	double phase;
	double period;
	double vel_from;
	double vel_to;

	int GetVel(double al) {
		return (int) (vel_from + ((Math.sin(al * period + phase) + 1.0) / 2.0)
				* (vel_to - vel_from));
	}

	@Override
	public void render(RenderPart p) {
		int tempo = p.getTempo() + rndInt(-50, 50);

		phase = rndFloat(-1, 1);
		period = rndFloat(p.getUniquePart().getMetrum() / 8.0, p
				.getUniquePart().getMetrum());

		vel_from = rndInt(30, 50);
		vel_to = rndInt(110, 120);

		double delta = 0.5;
		if (tempo > 150)
			delta = 1.0;
		if (tempo < 60)
			delta = 0.25;

		Time t = createTime(p.getStartBar(), 0);

		int[] pattern = new int[rndInt(3, 8)];

		for (int i = 0; i < pattern.length; i++) {
			pattern[i] = rndInt(-1, 1);
			if (rndInt(0, 4) == 0)
				pattern[i] = -2;
		}

		int n = 0;

		SetFirstPitch(p.getHarmonicEventPitch(0, 0));

		double al = 0;

		while (t.mBar < p.getEndBar()) {
			int harm = p.getHarmonic(t);
			int pit = GetNextPitch(p.getHarmonicEventPitch(harm, 0));

			if (pattern[n % pattern.length] == 0)
				p.addNote(t, createTime(t.mBar, t.mPos + delta / 2.0), pit,
						GetVel(al));
			if (pattern[n % pattern.length] == 1)
				p.addNote(t, createTime(t.mBar, t.mPos + delta / 2.0), p
						.alignPitch(pit, 7), GetVel(al));
			if (pattern[n % pattern.length] == -1)
				p.addNote(t, createTime(t.mBar, t.mPos + delta / 2.0), p
						.alignPitch(pit, -7), GetVel(al));

			t.mPos += delta;
			al += delta;
			if (t.mPos >= p.getUniquePart().getMetrum()) {
				t.mPos = 0;
				t.mBar++;
			}
			n++;
		}

	}

}
