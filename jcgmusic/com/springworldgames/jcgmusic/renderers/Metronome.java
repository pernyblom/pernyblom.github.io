package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;

public class Metronome extends MusicScript implements Renderer {

	@Override
	public void render(RenderPart p) {
		int test = Integer.parseInt(p.getParam("pitch"));
		if (test == 0) test = 37;

		for (int i = p.getStartBar(); i < p.getEndBar(); i++)
		{
			for (int u = 0; u < p.getUniquePart().getMetrum(); u++)
			{		
				int vel = 127;
				if (u != 0) vel = 90;
				p.addPercNote(createTime(i,u), createTime(i,u+0.5) , test, vel);
			}
		}

	}

}
