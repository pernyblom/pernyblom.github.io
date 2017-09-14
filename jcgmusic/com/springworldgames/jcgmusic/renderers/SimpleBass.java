package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;
import com.springworldgames.jcgmusic.Time;

public class SimpleBass extends MusicScript implements Renderer {

	@Override
	public void render(RenderPart p) {
		for (int i = 0; i < p.getHarmonicEvents(); i++) {
			Time start = p.getHarmonicEventStart(i);
			while (i + 1 < p.getHarmonicEvents()
					&& p.getHarmonicEventPitch(i + 1, 0) == p
							.getHarmonicEventPitch(i, 0)) {
				i++;
			}
			Time end = p.getHarmonicEventEnd(i);
			int pitch = p.getHarmonicEventPitch(i, 0);
			// System.out.println(this + " " + start + " " + end + " " + pitch);
			p.addNote(start, end, p.getHarmonicEventPitch(i, 0), 127);
		}
	}

}
