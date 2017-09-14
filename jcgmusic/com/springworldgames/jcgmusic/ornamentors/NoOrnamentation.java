package com.springworldgames.jcgmusic.ornamentors;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.Ornamentor;
import com.springworldgames.jcgmusic.Part;
import com.springworldgames.jcgmusic.UniquePart;

public class NoOrnamentation extends MusicScript implements Ornamentor {

	@Override
	public void ornament(UniquePart up, Part p) {
		for (int i = 0; i < up.getEvents(); i++)
			p.addEvent(up.getEventStart(i), up.getEventEnd(i), p
					.computePitch(up.getEventPitch(i)));
	}

}
