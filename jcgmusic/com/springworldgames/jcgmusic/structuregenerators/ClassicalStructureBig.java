package com.springworldgames.jcgmusic.structuregenerators;

import com.springworldgames.jcgmusic.MusicScript;
import com.springworldgames.jcgmusic.Song;
import com.springworldgames.jcgmusic.StructureGenerator;

public class ClassicalStructureBig extends MusicScript implements
		StructureGenerator {


	@Override
	public void generateStructure(Song song) {
		song.setUniqueParts(5);

		int m1 = rndInt(3, 4);
		int m2 = rndInt(3, 4);

		song.getUniquePart(0).setMetrum(m1); // a of A and C
		song.getUniquePart(1).setMetrum(m1); // b of A and C

		song.getUniquePart(2).setMetrum(m2); // a of B
		song.getUniquePart(3).setMetrum(m2); // b of B
		song.getUniquePart(4).setMetrum(m2); // c of B

		song.setParts(9);

		int t1 = rndInt(0, 11);
		int t2 = t1;

		if (rndInt(0, 1) == 0)
			t2 = (t1 + 5) % 12;
		else
			t2 = (t1 + 9) % 12;

		String s1 = getRandomScale();
		String s2 = getRandomScale();

		double te1 = 1.0;
		double te2 = 1.0 + rndFloat(-0.25, 0.5);
		if (rndInt(0, 1) == 0)
			te2 = 1.0f;

		song.getPart(0).setUniquePart(0);
		song.getPart(1).setUniquePart(1);
		song.getPart(2).setUniquePart(0);
		song.getPart(3).setUniquePart(2);
		song.getPart(4).setUniquePart(3);
		song.getPart(5).setUniquePart(4);
		song.getPart(6).setUniquePart(0);
		song.getPart(7).setUniquePart(1);
		song.getPart(8).setUniquePart(0);

		song.getPart(0).setTempoMod(te1);
		song.getPart(1).setTempoMod(te1);
		song.getPart(2).setTempoMod(te1);
		song.getPart(3).setTempoMod(te2);
		song.getPart(4).setTempoMod(te2);
		song.getPart(5).setTempoMod(te2);
		song.getPart(6).setTempoMod(te1);
		song.getPart(7).setTempoMod(te1);
		song.getPart(8).setTempoMod(te1);

		song.getPart(0).setScale(s1);
		song.getPart(1).setScale(s1);
		song.getPart(2).setScale(s1);
		song.getPart(3).setScale(s2);
		song.getPart(4).setScale(s2);
		song.getPart(5).setScale(s2);
		song.getPart(6).setScale(s1);
		song.getPart(7).setScale(s1);
		song.getPart(8).setScale(s1);

		song.getPart(0).setTranspose(t1);
		song.getPart(1).setTranspose(t1);
		song.getPart(2).setTranspose(t1);
		song.getPart(3).setTranspose(t2);
		song.getPart(4).setTranspose(t2);
		song.getPart(5).setTranspose(t2);
		song.getPart(6).setTranspose(t1);
		song.getPart(7).setTranspose(t1);
		song.getPart(8).setTranspose(t1);

		int a_hint = rndInt(1, 2);
		int b_hint = 3;

		if (rndInt(0, 1) == 0) {
			b_hint = rndInt(1, 2);
			a_hint = 3;
		}

		song.getPart(0).setArrHint(a_hint);
		song.getPart(1).setArrHint(b_hint);
		song.getPart(2).setArrHint(a_hint);
		song.getPart(3).setArrHint(rndInt(1, 3));
		song.getPart(4).setArrHint(rndInt(1, 3));
		song.getPart(5).setArrHint(rndInt(1, 3));
		song.getPart(6).setArrHint(a_hint);
		song.getPart(7).setArrHint(b_hint);
		song.getPart(8).setArrHint(a_hint);

	}

}
