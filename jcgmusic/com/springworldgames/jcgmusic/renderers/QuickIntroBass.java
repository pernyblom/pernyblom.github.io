package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;
import com.springworldgames.jcgmusic.Time;

public class QuickIntroBass extends MusicScript implements Renderer {

	@Override
	public void render(RenderPart p) {

		log("doing simple chord smooth...");

		int upto = p.getHarmonicEventPitch(0, 0);
		Time t1 = new Time();
		t1.mBar = p.getStartBar();
		t1.mPos = -1.5;

		double len = rndFloat(0.25, 0.5);

		if (rndInt(0, 1) == 0) // diatonic
		{
			Time t2 = new Time();
			t2 = t1;
			t2.mPos += len;

			p.addNote(t1, t2, upto - 3, 102);

			t1.mPos += 0.5;
			t2.mPos = t1.mPos + len;

			p.addNote(t1, t2, upto - 2, 110);

			t1.mPos += 0.5;
			t2.mPos = t1.mPos + len;

			p.addNote(t1, t2, upto - 1, 115);

			t1.mPos = 0;
			t2.mPos = len;

			p.addNote(t1, t2, upto, 127);
		} else // diatonic
		{
			Time t2;
			t2 = t1;
			t2.mPos += len;

			p.addNote(t1, t2, p.alignPitch(upto, -3), 102);

			t1.mPos += 0.5;
			t2.mPos = t1.mPos + len;

			p.addNote(t1, t2, p.alignPitch(upto, -2), 102);

			t1.mPos += 0.5;
			t2.mPos = t1.mPos + len;

			p.addNote(t1, t2, p.alignPitch(upto, -1), 102);

			t1.mPos = 0;
			t2.mPos = len;

			p.addNote(t1, t2, upto, 127);
		}

	}

}
