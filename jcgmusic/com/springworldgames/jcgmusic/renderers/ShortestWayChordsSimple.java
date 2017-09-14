package com.springworldgames.jcgmusic.renderers;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.RenderPart;
import com.springworldgames.jcgmusic.Renderer;
import com.springworldgames.jcgmusic.Time;

public class ShortestWayChordsSimple extends MusicScript implements Renderer {


	int przew;
	int low;
	int high;

	void SetFirstChord(RenderPart p, int h) {
		przew = rndInt(-1, 1);
		low = p.getHarmonicEventPitch(h, przew);
		high = p.getHarmonicEventPitch(h, przew + p.getHarmonicComponents(h)
				- 1);
	}

	int GetDist(RenderPart p, int harm, int pr) {
		int l = p.getHarmonicEventPitch(harm, pr);
		int h = p.getHarmonicEventPitch(harm, pr
				+ p.getHarmonicComponents(harm) - 1);

		int dist = 0;

		if (l < low)
			dist += low - l;
		else
			dist += l - low;

		if (h < high)
			dist += high - h;
		else
			dist += h - high;

		return dist;
	}

	void PlaceNextChord(RenderPart p, Time t1, Time t2) {
		int harm = p.getHarmonic(t1);

		int pr = 0;
		int dist = GetDist(p, harm, pr);

		while (GetDist(p, harm, pr - 1) < dist) {
			dist = GetDist(p, harm, pr - 1);
			pr--;
		}

		while (GetDist(p, harm, pr + 1) <= dist) {
			dist = GetDist(p, harm, pr + 1);
			pr++;
		}

		przew = pr;
		low = p.getHarmonicEventPitch(harm, przew);
		high = p.getHarmonicEventPitch(harm, przew
				+ p.getHarmonicComponents(harm) - 1);

		for (int f = 0; f < p.getHarmonicComponents(harm); f++) {
			p.addNote(t1, t2, p.getHarmonicEventPitch(harm, przew + f), rndInt(
					105, 125));
		}

	}

	@Override
	public void render(RenderPart p) {
		SetFirstChord(p, 0);

		for (int i = 0; i < p.getHarmonicEvents(); i++) {
			Time t1 = p.getHarmonicEventStart(i);
			Time t2 = p.getHarmonicEventEnd(i);
			PlaceNextChord(p, t1, t2);
		}

	}

}
