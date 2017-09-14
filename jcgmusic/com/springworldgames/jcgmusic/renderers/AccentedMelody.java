package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;
import com.springworldgames.jcgmusic.Time;

public class AccentedMelody extends MusicScript implements Renderer {


	@Override
	public void render(RenderPart p) {
		double max_len = 0.25;

		for (int i = 0; i < p.getEvents(); i++) {
			Time t = p.getEventStart(i);

			int poz = (int) t.mPos;

			if ((poz == 0 || poz == 2) && t.mPos - poz < 0.1) {
				// accent

				p.addNote(p.getEventStart(i), p.getEventEnd(i), p
						.getEventPitch(i), rndInt(124, 127));
			} else {
				double len = (p.getEventEnd(i).mBar - p.getEventStart(i).mBar)
						* p.getUniquePart().getMetrum()
						+ (p.getEventEnd(i).mPos - p.getEventStart(i).mPos);

				if (len > max_len) {
					p.addNote(p.getEventStart(i), createTime(
							p.getEventStart(i).mBar, p.getEventStart(i).mPos
									+ max_len), p.getEventPitch(i), rndInt(85,
							105));
				} else
					p.addNote(p.getEventStart(i), p.getEventEnd(i), p
							.getEventPitch(i), rndInt(85, 105));

			}

		}
	}

}
