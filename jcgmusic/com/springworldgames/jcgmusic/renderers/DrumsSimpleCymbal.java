package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;

public class DrumsSimpleCymbal extends MusicScript implements Renderer {


	@Override
	public void render(RenderPart p) {
		int pit = Integer.parseInt(p.getParam("pitch"));
		if (pit == 0)
			pit = 49;

		for (int i = p.getStartBar(); i < p.getEndBar(); i++) {
			p.addPercNote(createTime(i, 0), createTime(i, 1), pit, rndInt(115,
					127));
		}

	}

}
