package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;

public class SimpleMelody extends MusicScript implements Renderer {


	@Override
	public void render(RenderPart p) {

		for (int i = 0; i < p.getEvents(); i++) {
			p.addNote(p.getEventStart(i), p.getEventEnd(i), p.getEventPitch(i),
					127);
		}

	}

}
