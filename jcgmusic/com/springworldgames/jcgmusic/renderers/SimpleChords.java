package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;

public class SimpleChords extends MusicScript implements Renderer {

	@Override
	public void render(RenderPart p) {
		for (int i = 0; i < p.getHarmonicEvents(); i++) {
			for (int f = 0; f < p.getHarmonicComponents(i); f++) {
				p.addNote(p.getHarmonicEventStart(i), p.getHarmonicEventEnd(i),
						p.getHarmonicEventPitch(i, f), 127);
			}
			// System.out.println(p.GetHarmonicEventStart(i));
		}
	}

}
