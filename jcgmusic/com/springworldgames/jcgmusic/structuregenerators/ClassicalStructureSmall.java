package com.springworldgames.jcgmusic.structuregenerators;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.Part;
import com.springworldgames.jcgmusic.Song;
import com.springworldgames.jcgmusic.StructureGenerator;
import com.springworldgames.jcgmusic.UniquePart;

public class ClassicalStructureSmall extends MusicScript implements
		StructureGenerator {

	@Override
	public void generateStructure(Song song) {
		song.setUniqueParts(2);

		int metrum = rndInt(3, 4);

		for (int i = 0; i < song.getUniqueParts(); i++) {
			UniquePart up = song.getUniquePart(i);
			up.setMetrum(metrum);
		}

		song.setParts(3);

		int[] trans = new int[3];

		trans[0] = rndInt(0, 11);
		trans[1] = (trans[0] + 5) % 12;
		trans[2] = (trans[1] + 5) % 12;

		if (rndInt(0, 2) == 0)
			trans[0] = trans[1];
		if (rndInt(0, 2) == 0)
			trans[2] = trans[1];

		for (int i = 0; i < song.getParts(); i++) {
			Part p = song.getPart(i);
			p.setTempoMod(1.0);
			p.setTranspose(trans[i]);
			p.setScale(getRandomScale());
			p.setUniquePart(i % song.getUniqueParts());
			p.setArrHint(rndInt(1, 3));
		}

	}

}
