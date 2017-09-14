package com.springworldgames.jcgmusic.innerstructuregenerators;

import com.springworldgames.jcgmusic.InnerStructureGenerator;
import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.UniquePart;

public class FixedClassical extends MusicScript implements
		InnerStructureGenerator {

	@Override
	public void generateInnerStructure(UniquePart up) {

		// Set sentences
		up.setSentences(2);

		up.getSentence(0).setPhrases(2);
		up.getSentence(1).setPhrases(2);

		// Set unique phrases
		up.setUniquePhrases(rndInt(1, 4));

		for (int i = 0; i < up.getUniquePhrases(); i++)
			up.getUniquePhrase(i).setBars(2);

		if (up.getUniquePhrases() == 1) // AAAA
		{
			up.getSentence(0).getPhrase(0).setUniquePhrase(0);
			up.getSentence(0).getPhrase(1).setUniquePhrase(0);
			up.getSentence(1).getPhrase(0).setUniquePhrase(0);
			up.getSentence(1).getPhrase(1).setUniquePhrase(0);
		} else if (up.getUniquePhrases() == 2) // ABAB
		{
			up.getSentence(0).getPhrase(0).setUniquePhrase(0);
			up.getSentence(0).getPhrase(1).setUniquePhrase(1);
			up.getSentence(1).getPhrase(0).setUniquePhrase(0);
			up.getSentence(1).getPhrase(1).setUniquePhrase(1);
		} else if (up.getUniquePhrases() == 3) // ABAC && ABCB
		{
			if (rndInt(0, 1) == 0) {
				up.getSentence(0).getPhrase(0).setUniquePhrase(0);
				up.getSentence(0).getPhrase(1).setUniquePhrase(1);
				up.getSentence(1).getPhrase(0).setUniquePhrase(0);
				up.getSentence(1).getPhrase(1).setUniquePhrase(2);
			} else {
				up.getSentence(0).getPhrase(0).setUniquePhrase(0);
				up.getSentence(0).getPhrase(1).setUniquePhrase(1);
				up.getSentence(1).getPhrase(0).setUniquePhrase(2);
				up.getSentence(1).getPhrase(1).setUniquePhrase(1);
			}
		} else if (up.getUniquePhrases() == 4) // ABCD
		{
			up.getSentence(0).getPhrase(0).setUniquePhrase(0);
			up.getSentence(0).getPhrase(1).setUniquePhrase(1);
			up.getSentence(1).getPhrase(0).setUniquePhrase(2);
			up.getSentence(1).getPhrase(1).setUniquePhrase(3);
		}

	}

}
