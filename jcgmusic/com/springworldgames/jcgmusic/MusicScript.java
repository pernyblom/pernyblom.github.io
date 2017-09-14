package com.springworldgames.jcgmusic;

import java.util.LinkedHashMap;
import java.util.Random;

public class MusicScript implements Seedable {

	int seed;
	Random rnd;
	private Song song;

	public static final String MAJOR = "major";
	public static final String LYDIAN = "lydian";
	public static final String NATURAL_MINOR = "natural minor";
	public static final String HARMONIC_MINOR = "harmonic minor";
	public static final String MELODIC_MINOR = "melodic minor";

	public static final String[] SCALES = new String[] { MAJOR, NATURAL_MINOR,
			HARMONIC_MINOR };

	public static int[] majorAbsSteps = new int[] { 0, 2, 4, 5, 7, 9, 11 };
	public static int[] naturalMinorAbsSteps = new int[] { 0, 2, 3, 5, 7, 8, 10 };
	public static int[] harmonicMinorAbsSteps = new int[] { 0, 2, 3, 5, 7, 8,
		11 };
	public static int[] melodicMinorAbsSteps = new int[] { 0, 2, 3, 5, 7, 9, 11 };
	public static int[] lydianAbsSteps = new int[] { 0, 2, 4, 6, 7, 9, 11 };

	public static LinkedHashMap<String, int[]> scaleOffsets;

	
	static {
		scaleOffsets = new LinkedHashMap<String, int[]>();
		scaleOffsets.put(MAJOR, majorAbsSteps);
		scaleOffsets.put(NATURAL_MINOR, naturalMinorAbsSteps);
		scaleOffsets.put(LYDIAN, lydianAbsSteps);
		scaleOffsets.put(HARMONIC_MINOR, harmonicMinorAbsSteps);
		scaleOffsets.put(MELODIC_MINOR, melodicMinorAbsSteps);
	}

	public static int[] getScaleOffsets(String scaleName) {
		int[] offsets = scaleOffsets.get(scaleName);
		if (offsets == null) {
			System.out.println(MusicScript.class.getSimpleName()
					+ " could not find scale with name " + scaleName);
			offsets = majorAbsSteps;
		}
		return offsets;
	}

	public MusicScript() {
		rnd = new Random(seed);
	}

	@Override
	public void setSeed(int seed) {
		this.seed = seed;
		rnd = new Random(seed);
	}

	@Override
	public int getSeed() {
		return seed;
	}

	public void resetSeed() {
		rnd = new Random(seed);
	}

	public int rndInt(int lower, int upper) {
		return Utils.getRandomInt(lower, upper, rnd);
	}

	public double rndFloat(double lower, double upper) {
		return Utils.getRandomBetween(lower, upper, rnd);
	}

	public Time createTime(int bar, double pos) {
		return new Time(bar, pos);
	}

	public String getRandomScale() {
		String result = Utils
				.sampleUniformObjectDistribution(rnd, SCALES);
		// System.out.println(this + " " + result);
		return result;
	}

	public int getSongTempo() {
		return song.getTempo();
	}

	protected int getRandom(int[] patches) {
		return patches[rndInt(0, patches.length - 1)];
	}

	protected void log(String str) {
	}

	// Stuff for percussion

	public class Pattern {
		public double Length;
		public int[] Pitches;
		public int velfrom;
		public int velto;
		public double[] pattern;
	};

	protected Pattern newPattern(double l, int[] pit, double[] pat, int v1,
			int v2) {
		Pattern p = new Pattern();
		p.Length = l;
		p.Pitches = pit;
		p.pattern = pat;
		p.velfrom = v1;
		p.velto = v2;
		return p;
	}

	protected void realizePattern(RenderPart p, Pattern pat) {
		for (int i = p.getStartBar(); i < p.getEndBar(); i++) {
			for (double m = 0; m < p.getUniquePart().getMetrum(); m += pat.Length) {
				for (int n = 0; n < pat.pattern.length; n++) {
					if (pat.pattern[n] + m < p.getUniquePart().getMetrum()) {
						for (int q = 0; q < pat.Pitches.length; q++)
							p.addPercNote(createTime(i, m + pat.pattern[n]),
									createTime(i, m + pat.pattern[n] + 0.1),
									pat.Pitches[q], rndInt(pat.velfrom,
											pat.velto));
					}
				}
			}
		}
	}

	public void setSong(Song song) {
		this.song = song;
	}

}
