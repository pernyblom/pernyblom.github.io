package com.springworldgames.jcgmusic.structuregenerators;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.Song;
import com.springworldgames.jcgmusic.StructureGenerator;


public class OnePartSimpleStructure extends MusicScript implements StructureGenerator {


	@Override
	public void generateStructure(Song song) {
		song.setUniqueParts(1);
		song.setParts(1);	
		song.getPart(0).setUniquePart(0);
	}

}
