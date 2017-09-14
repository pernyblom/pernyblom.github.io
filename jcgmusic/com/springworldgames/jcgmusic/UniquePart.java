package com.springworldgames.jcgmusic;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Random;

public class UniquePart {

	private int metrum = 4;

	private int structureSeed = 20;
	private int rythmSeed = 20;
	private int harmonySeed = 20;
	private int melodySeed = 20;
	private int ornamentationSeed = 20;

	private String structureScript = "Fixed Classical";
	private String rythmScript = "Random Static Rythm";
	private String harmonyScript = "Simple Random Harmony";
	private String melodyScript = "Simple Random Melody";
	private String ornamentationScript = "No Ornamentation";

	private ArrayList<UniquePhrase> uniquePhrases = new ArrayList<UniquePhrase>();
	private ArrayList<Sentence> sentences = new ArrayList<Sentence>();
	private ArrayList<Harmonic> harmonics = new ArrayList<Harmonic>();
	private ArrayList<Event> events = new ArrayList<Event>();

	private LinkedHashMap<Event, Harmonic> eventHarmony = new LinkedHashMap<Event, Harmonic>();

	public void randomize(Song song, Random rnd) {
		structureSeed = Utils.getRandomInt(1, 32000, rnd);
		rythmSeed = Utils.getRandomInt(1, 32000, rnd);
		harmonySeed = Utils.getRandomInt(1, 32000, rnd);
		melodySeed = Utils.getRandomInt(1, 32000, rnd);
		ornamentationSeed = Utils.getRandomInt(1, 32000, rnd);

		// System.out.println(this + " harmonySeed: " + harmonySeed);

		structureScript = Utils.sampleUniformObjectDistribution(rnd, song
				.getCreator().getInnerStructureScriptNames());
		rythmScript = Utils.sampleUniformObjectDistribution(rnd, song
				.getCreator().getRythmScriptNames());
		harmonyScript = Utils.sampleUniformObjectDistribution(rnd, song
				.getCreator().getHarmonyScriptNames());
		melodyScript = Utils.sampleUniformObjectDistribution(rnd, song
				.getCreator().getMelodyScriptNames());
		ornamentationScript = Utils.sampleUniformObjectDistribution(rnd,
				song.getCreator().getOrnamentorScriptNames());
	}

	public ArrayList<Event> getEventList() {
		return events;
	}

	public ArrayList<Harmonic> getHarmonicList() {
		return harmonics;
	}

	public void assignEventsToHarmony() {
		int bars = getBars();
		int metrum = getMetrum();

		Time endOfTime = new Time(bars - 1, metrum);

		for (int i = 0; i < harmonics.size(); i++) {
			Harmonic h1 = harmonics.get(i);
			Time t1 = h1.getStartTime();
			Time t2 = endOfTime;
			if (i + 1 < harmonics.size()) {
				Harmonic h2 = harmonics.get(i + 1);
				t2 = h2.getStartTime();
			}
			h1.setEndTime(t2.copy());

			for (Event e : events) {
				if (e.intersects(t1, t2, metrum)) {
					boolean hasEvent = eventHarmony.containsKey(e);
					if (!hasEvent) {
						eventHarmony.put(e, h1);
					} else {
						Harmonic harmonic = eventHarmony.get(e);

						double oldOverlap = harmonic.toInterval2D(metrum)
								.intersectCopy(e.toInterval2D(metrum))
								.getLength();
						double newOverlap = h1.toInterval2D(metrum)
								.intersectCopy(e.toInterval2D(metrum))
								.getLength();
						if (newOverlap > oldOverlap) {
							eventHarmony.put(e, h1);
						}

						// System.out.println(this + " event " + e
						// + " already in harmony " + harmonic
						// + " with times "
						// + harmonic.getStartTime().getPosition(metrum)
						// + " and "
						// + harmonic.getEndTime().getPosition(metrum)
						// + " also should be in " + h1 + " with times "
						// + t1.getPosition(metrum) + " and "
						// + t2.getPosition(metrum));
						// System.out.println(this
						// + " "
						// + e.intersect(harmonic.getStartTime(), harmonic
						// .getEndTime(), metrum)
						// + " "
						// + e.intersect(h1.getStartTime(), h1
						// .getEndTime(), metrum));
					}
				}
			}
		}
		for (Event e : events) {
			if (!eventHarmony.containsKey(e)) {
				Time start = e.getStart();
				Time end = e.getEnd();

				if (start.getPosition(metrum) >= endOfTime.getPosition(metrum)) {
					eventHarmony.put(e, harmonics.get(harmonics.size() - 1));
				} else if (end.getPosition(metrum) <= 0) {
					// System.out.println(this + " assigning event " + e
					// + " to start harmony " + harmonics.get(0));
					eventHarmony.put(e, harmonics.get(0));
				} else {
					System.out.println(this + " event " + e
							+ " not assigned to harmony");
				}
				// if (start.m_Bar < 0 || start.m_Pos < 0 || end.m_Bar < 0
				// || end.m_Pos < 0) {
				// eventHarmony.put(e, harmonics.get(0));
				// } else {
				// }
			}
		}
	}

	public void setSentences(int count) {
		Utils.setSize(count, sentences, Sentence.class);
	}

	public int getSentences() {
		return sentences.size();
	}

	public Sentence getSentence(int index) {
		Utils.expandIfNeccessary(index, sentences, Sentence.class);
		return sentences.get(index);
	}

	public void setUniquePhrases(int count) {
		Utils.setSize(count, uniquePhrases, UniquePhrase.class);
	}

	public int getUniquePhrases() {
		return uniquePhrases.size();
	}

	public UniquePhrase getUniquePhrase(int index) {
		Utils.expandIfNeccessary(index, uniquePhrases, UniquePhrase.class);
		return uniquePhrases.get(index);
	}

	public void setMetrum(int metrum) {
		this.metrum = metrum;
	}

	public int getMetrum() {
		return metrum;
	}

	public int getBars() {
		int bars = 0;
		for (Sentence s : sentences) {
			bars += s.getBars();
		}
		return bars;
	}

	public boolean endsSong() {
		return false;
	}

	public int getEvents() {
		return events.size();
	}

	public Time getEventStart(int index) {
		return events.get(index).getStart();
	}

	public Time getEventEnd(int index) {
		return events.get(index).getEnd();
	}

	public int getEventPitch(int index) {
		return events.get(index).getPitch();
	}

	public int setEventPitch(int index, int pitch) {
		events.get(index).setPitch(pitch);
		return pitch;
	}

	public void setScriptStructure(String scriptName) {
		structureScript = scriptName;
	}

	public void setScriptRhythm(String scriptName) {
		rythmScript = scriptName;
	}

	public void setScriptMelody(String scriptName) {
		melodyScript = scriptName;
	}

	public void setScriptHarmony(String scriptName) {
		harmonyScript = scriptName;
	}

	public void setScriptOrnamentation(String scriptName) {
		ornamentationScript = scriptName;
	}

	public String getScriptStructure() {
		return structureScript;
	}

	public String getScriptRhythm() {
		return rythmScript;
	}

	public String getScriptMelody() {
		return melodyScript;
	}

	public String getScriptHarmony() {
		return harmonyScript;
	}

	public String getScriptOrnamentation() {
		return ornamentationScript;
	}

	public int getScriptStructureSeed() {
		return structureSeed;
	}

	public int getScriptRhythmSeed() {
		return rythmSeed;
	}

	public int getScriptMelodySeed() {
		return melodySeed;
	}

	public int getScriptHarmonySeed() {
		return harmonySeed;
	}

	public int getScriptOrnamentationSeed() {
		return ornamentationSeed;
	}

	public void setScriptStructureSeed(int seed) {
		structureSeed = seed;
	}

	public void setScriptRhythmSeed(int seed) {
		rythmSeed = seed;
	}

	public void setScriptMelodySeed(int seed) {
		melodySeed = seed;
	}

	public void setScriptHarmonySeed(int seed) {
		harmonySeed = seed;
	}

	public void setScriptOrnamentationSeed(int seed) {
		ornamentationSeed = seed;
	}

	public int getEventBasis(int index) {
		Event event = events.get(index);
		Harmonic harmonic = eventHarmony.get(event);
		return harmonic.getBaseNote();
	}

	public void addHarmonic(Time time, int baseNote, String chordString) {
		harmonics.add(new Harmonic(time, baseNote, chordString));
	}

	public int alignPitchToHarm(int eventIndex, int scaleNote) {
		Event event = events.get(eventIndex);
		Harmonic harmonic = eventHarmony.get(event);

		int[] scaleDegrees = harmonic.getScaleDegrees();
		int scaleDegree = MathUtils.positiveMod(scaleNote - 1, 7);

		if (ArrayUtils.contains(scaleDegrees, scaleDegree)) {
			return scaleNote;
		}

		int closestNote = harmonic.getBaseNote();
		int closestDistance = Integer.MAX_VALUE;
		for (int i = scaleNote - 7; i < scaleNote + 7; i++) {
			scaleDegree = MathUtils.positiveMod(i - 1, 7);
			if (ArrayUtils.contains(scaleDegrees, scaleDegree)) {
				int distance = Math.abs(i - scaleNote);
				if (distance < closestDistance) {
					closestDistance = distance;
					closestNote = i;
				}
			}
		}
		return closestNote;
	}

	public void addEvent(Event event) {
		events.add(event);
	}

	public Harmonic getEventHarmonic(Event event) {
		return eventHarmony.get(event);
	}

}
