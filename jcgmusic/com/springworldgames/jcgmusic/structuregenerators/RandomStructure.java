package com.springworldgames.jcgmusic.structuregenerators;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.Part;
import com.springworldgames.jcgmusic.Song;
import com.springworldgames.jcgmusic.StructureGenerator;


public class RandomStructure extends MusicScript implements StructureGenerator {

	@Override
	public void generateStructure(Song song) {
		song.setUniqueParts(rndInt(1,4));
		song.setParts(rndInt(song.getUniqueParts(), (song.getUniqueParts()*3)));	
		
		int metrum = rndInt(0,2);

		// constant metrum 4
		if (metrum == 0)
		{
			for (int i = 0; i < song.getUniqueParts(); i++)
				song.getUniquePart(i).setMetrum(4);
		}

		// constant random metrum
		if (metrum == 1)
		{
			int m = rndInt(2,8);
			for (int i = 0; i < song.getUniqueParts(); i++)
				song.getUniquePart(i).setMetrum(m);
		}

		// random metrum
		if (metrum == 2)
		{
			for (int i = 0; i < song.getUniqueParts(); i++)
				song.getUniquePart(i).setMetrum(rndInt(2,8));
		}
		
		int[] trans = new int[3];

		trans[0] = rndInt(0, 11);
		trans[1] = (trans[0] + 5) % 12;
		trans[2] = (trans[1] + 5) % 12;

		for (int i = 0; i < song.getParts(); i++)
		{
			Part p = song.getPart(i);
			p.setUniquePart(rndInt(0,song.getUniqueParts()-1));		
			p.setTranspose(trans[rndInt(0,2)]);
			p.setTempoMod(1.0);
			p.setScale(getRandomScale());
			p.setArrHint(rndInt(1,3));
		}
	}

}
