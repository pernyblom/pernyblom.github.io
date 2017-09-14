package com.springworldgames.jcgmusic.melodycreators;

import com.springworldgames.jcgmusic.MelodyCreator;
import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.Time;
import com.springworldgames.jcgmusic.UniquePart;
import com.springworldgames.jcgmusic.UniquePhrase;

public class RandomPhrasedMelody extends MusicScript implements MelodyCreator {


	double GetEventLength(UniquePart up, int e) {
		Time t1 = up.getEventStart(e);
		Time t2 = up.getEventEnd(e);
		return (t2.mBar - t1.mBar) * up.getMetrum() + (t2.mPos - t1.mPos);
	}

	@Override
	public void createMelody(UniquePart up) {
		int u_phrases = up.getUniquePhrases();

		int[][] melody = new int[u_phrases][];
		int[][] align = new int[u_phrases][];

		for (int i = 0; i < u_phrases; i++) {
			UniquePhrase p = up.getUniquePhrase(i);
			melody[i] = new int[p.getEvents()];
			align[i] = new int[p.getEvents()];
			for (int m = 0; m < p.getEvents(); m++) {
				melody[i][m] = rndInt(-2, 2);
				align[i][m] = rndInt(0, 1);
			}

			melody[i][0] = rndInt(2, 8);
		}

		int event = 0;
		int theNote = 0;

		for (int s = 0; s < up.getSentences(); s++) {
			for (int p = 0; p < up.getSentence(s).getPhrases(); p++) {
				UniquePhrase upp = up.getSentence(s).getPhrase(p)
						.getUniquePhrase();

				int note = melody[up.getSentence(s).getPhrase(p)
						.getUniquePhraseID()][0];

				for (int e = 0; e < upp.getEvents(); e++) {
					if (event < up.getEvents() - 1) {
						if (align[up.getSentence(s).getPhrase(p)
								.getUniquePhraseID()][e] == 1
								|| GetEventLength(up, event) > 1.2) {
							up.setEventPitch(event, up.alignPitchToHarm(event,
									note));
						} else {
							up.setEventPitch(event, note);
						}

						event++;
						if (e < upp.getEvents() - 1)
							note += melody[up.getSentence(s).getPhrase(p)
									.getUniquePhraseID()][e + 1];
					}
				}
			}
		}

		int last_note = 1;

		if (up.endsSong()) {
			if (rndInt(0, 3) == 0)
				last_note = 5;
		} else {
			if (rndInt(0, 2) != 0)
				last_note = 1 + (rndInt(0, 2) * 2);
		}

		while (theNote > 5) {
			theNote -= 7;
			last_note += 7;
		}

		while (theNote < -3) {
			theNote += 7;
			last_note -= 7;
		}

		if (theNote == 5 && rndInt(0, 1) == 0)
			last_note += 7;

		up.setEventPitch(up.getEvents() - 1, last_note);

	}

}
