package com.springworldgames.jcgmusic.structuregenerators;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.Song;
import com.springworldgames.jcgmusic.StructureGenerator;

public class ModernSongStructure extends MusicScript implements StructureGenerator {


	@Override
	public void generateStructure(Song s) {
		int intro_mode = rndInt(0,4);
		// 0 = no intro
		// 1 = intro based on verse ( no voice )
		// 2 = intro based on chorus ( no voice )
		// 3 = intro based on new part, harmony and structure like verse 
		// 4 = intro based on new part, harmony and structure like chorus
		
		int start_with = rndInt(-2,1);
		// 0 - verse
		// 1 - chorus
		if (start_with < 0) start_with = 0;
		if (intro_mode == 1) start_with = 1;
		if (intro_mode == 2) start_with = 0;
		
		int bridge_mode = rndInt(0,2);
		// bridge based on
		// 0 - based on verse
		// 1 - based on chorus
		// 1 - based on new
		
		int after_bridge = rndInt(0,1);
		// 0 - verse
		// 1 - chorus
		
		int u_parts = 3;
		int bridge = 2;
		int verse = 0;
		int chorus = 1;
		if (intro_mode > 2) 
		{
			verse++;
			chorus++;
			bridge++;
			u_parts++;
		}
				
		s.setUniqueParts(u_parts);
		
		int metrum = 4;
		if (rndInt(0,5) == 0) 
		{
			int m = rndInt(0,3);
			if (m == 0) metrum = 2;
			if (m == 1) metrum = 3;
			if (m == 2) metrum = 4;
			if (m == 3) metrum = 5;
			if (m == 3) metrum = 6;
		}
		
		// initialize unique parts
		for (int i = 0; i < u_parts; i++)
			s.getUniquePart(i).setMetrum(metrum);	
		
		// set unique parts (intro)
		if (intro_mode == 3) 
		{
			s.getUniquePart(0).setScriptStructure(s.getUniquePart(1).getScriptStructure());
			s.getUniquePart(0).setScriptStructureSeed(s.getUniquePart(1).getScriptStructureSeed());
		}
		else if (intro_mode == 4) 
		{
			s.getUniquePart(0).setScriptStructure(s.getUniquePart(2).getScriptStructure());
			s.getUniquePart(0).setScriptStructureSeed(s.getUniquePart(2).getScriptStructureSeed());
		}
		
		// set unique parts (bridge)
		if (bridge_mode == 0)
		{
			s.getUniquePart(bridge).setScriptStructure(s.getUniquePart(verse).getScriptStructure());
			s.getUniquePart(bridge).setScriptStructureSeed(s.getUniquePart(verse).getScriptStructureSeed());
		}
		else if (bridge_mode == 1)
		{
			s.getUniquePart(bridge).setScriptStructure(s.getUniquePart(chorus).getScriptStructure());
			s.getUniquePart(bridge).setScriptStructureSeed(s.getUniquePart(chorus).getScriptStructureSeed());
		}
		
		// count normal parts
		int parts = 7; // 2 x Verse, 4 x Chorus and 1 x Bridge
		if (intro_mode > 0) parts++;
		if (start_with > 0) parts++;
		if (after_bridge == 0) parts++;
		
		int mangle_ending = rndInt(0,1);
		if (mangle_ending > 0) parts++;
			
		String scale = getRandomScale();
		int trans = rndInt(0,11);
		
		s.setParts(parts);
		
		for (int i = 0; i < parts; i++)
		{
			s.getPart(i).setTempoMod(1.0);
			s.getPart(i).setScale(scale);
			s.getPart(i).setTranspose(trans);
		}
		
		// link the structure (intro)
		int part = 0;
		
		if (intro_mode == 1) // intro from verse
		{
			s.getPart(0).setUniquePart(0);
			s.getPart(0).setArrHint(0);
			part++;
		}
		else if (intro_mode == 2) // intro from chorus
		{
			s.getPart(0).setUniquePart(1);
			s.getPart(0).setArrHint(0);
			part++;
		}
		else if (intro_mode > 2) // intro from new 
		{
			s.getPart(0).setUniquePart(0);
			s.getPart(0).setArrHint(rndInt(0,3));
			part++;
		}
		
		// link the structure (verses)
		int first_verse = part;
		if (start_with > 0) first_verse++;
		for (int i = 0; i < 2; i++)
		{
			s.getPart(first_verse+(i*2)).setUniquePart(verse);
			s.getPart(first_verse+(i*2)).setArrHint(1);
		}
		
		if (after_bridge == 0) 
		{
			s.getPart(first_verse+5).setUniquePart(verse);
			s.getPart(first_verse+5).setArrHint(1);
		}
		
		// link the structure (bridge)
		s.getPart(first_verse+4).setUniquePart(bridge);
		s.getPart(first_verse+4).setArrHint(3);
		s.getPart(first_verse+4).setTranspose((trans+5)%12);
		s.getPart(first_verse+4).setScale(getRandomScale());
		
		// link the structure (chorus)
		if (start_with > 0)
		{
			s.getPart(part).setUniquePart(chorus);
			s.getPart(part).setArrHint(3);	
		}
		
		for (int i = 0; i < 2; i++)
		{
			s.getPart(first_verse+(i*2)+1).setUniquePart(chorus);
			s.getPart(first_verse+(i*2)+1).setArrHint(3);
		}
		
		if (after_bridge == 0) first_verse++;	
		
		s.getPart(first_verse+5).setUniquePart(chorus);
		s.getPart(first_verse+5).setArrHint(3);
		
		s.getPart(first_verse+6).setUniquePart(chorus);
		s.getPart(first_verse+6).setArrHint(3);
		
		if (mangle_ending > 0)
		{
			trans = (trans + rndInt(1,3))%12;
			s.getPart(first_verse+7).setUniquePart(chorus);
			s.getPart(first_verse+7).setArrHint(3);
			s.getPart(first_verse+7).setTranspose(trans);
			s.getPart(first_verse+6).setTranspose(trans);
		}	

	
	}

}
