package com.springworldgames.jcgmusic.melodycreators;

import com.springworldgames.jcgmusic.MelodyCreator;
import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.UniquePart;

public class WideRandomMelody extends MusicScript implements MelodyCreator {

	@Override
	public void createMelody(UniquePart up) {
		int note = up.getEventBasis(0);
		rndInt(0, 1);

		for (int i = 0; i < up.getEvents() - 1; i++) {
			note = up.alignPitchToHarm(i, note);
			note = up.setEventPitch(i, note);
			if (i < up.getEvents() - 2)
				note += rndInt(-3, 3);
			if (note < up.getEventBasis(0) - 8 && rndInt(0, 2) == 0)
				note = up.getEventBasis(0) + rndInt(-2, 6);
			if (note > up.getEventBasis(0) + 8 && rndInt(0, 2) == 0)
				note = up.getEventBasis(0) - rndInt(-2, 6);
		}

		int last_note = 1;

		while (note > 5) {
			note -= 7;
			last_note += 7;
		}

		while (note < -3) {
			note += 7;
			last_note -= 7;
		}

		if (note == 5 && rndInt(0, 1) == 0)
			last_note += 7;

		up.setEventPitch(up.getEvents() - 1, last_note);

	}

}
