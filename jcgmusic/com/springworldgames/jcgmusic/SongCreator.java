package com.springworldgames.jcgmusic;

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Random;

import javax.sound.midi.MidiEvent;
import javax.sound.midi.MidiMessage;
import javax.sound.midi.MidiSystem;
import javax.sound.midi.Sequence;
import javax.swing.JFileChooser;

import com.springworldgames.jcgmusic.arrangers.PianoAdvancedBoogieWoogie;
import com.springworldgames.jcgmusic.arrangers.PianoAdvancedClassical;
import com.springworldgames.jcgmusic.arrangers.PianoAdvancedDisco;
import com.springworldgames.jcgmusic.arrangers.PianoAdvancedSwingingBlues;
import com.springworldgames.jcgmusic.arrangers.PianoSimpleArrangement;
import com.springworldgames.jcgmusic.arrangers.SimpleBalladStyleArrangement;
import com.springworldgames.jcgmusic.arrangers.SimpleDanceStyleArrangement;
import com.springworldgames.jcgmusic.arrangers.SimpleInstrumentalMarchArrangement;
import com.springworldgames.jcgmusic.arrangers.SimpleLatinStyleArrangement;
import com.springworldgames.jcgmusic.arrangers.SimplePunkRockStyleArrangement;
import com.springworldgames.jcgmusic.harmonygenerators.AdvancedRandomHarmony;
import com.springworldgames.jcgmusic.harmonygenerators.ChordMapHarmony;
import com.springworldgames.jcgmusic.harmonygenerators.RandomRiffHarmony;
import com.springworldgames.jcgmusic.harmonygenerators.SimpleFixedHarmony;
import com.springworldgames.jcgmusic.harmonygenerators.SimpleJazzHarmony;
import com.springworldgames.jcgmusic.harmonygenerators.SimpleRandomHarmony;
import com.springworldgames.jcgmusic.innerstructuregenerators.FixedClassical;
import com.springworldgames.jcgmusic.melodycreators.RandomPhrasedMelody;
import com.springworldgames.jcgmusic.melodycreators.SimpleRandomMelody;
import com.springworldgames.jcgmusic.melodycreators.WideRandomMelody;
import com.springworldgames.jcgmusic.ornamentors.LightRandomizer;
import com.springworldgames.jcgmusic.ornamentors.NoOrnamentation;
import com.springworldgames.jcgmusic.ornamentors.SimpleOrnamentation;
import com.springworldgames.jcgmusic.renderers.AccentedMelody;
import com.springworldgames.jcgmusic.renderers.ArpeggioChords;
import com.springworldgames.jcgmusic.renderers.ArpeggioChordsFast;
import com.springworldgames.jcgmusic.renderers.BoogieWoogie;
import com.springworldgames.jcgmusic.renderers.BoogieWoogieSwing;
import com.springworldgames.jcgmusic.renderers.ChordalMelody;
import com.springworldgames.jcgmusic.renderers.DiscoJumpingBass;
import com.springworldgames.jcgmusic.renderers.DrumsDanceFootAndSnare;
import com.springworldgames.jcgmusic.renderers.DrumsDanceHiHat;
import com.springworldgames.jcgmusic.renderers.DrumsDanceSnareAttack;
import com.springworldgames.jcgmusic.renderers.DrumsLatin;
import com.springworldgames.jcgmusic.renderers.DrumsMarch;
import com.springworldgames.jcgmusic.renderers.DrumsPunkRock;
import com.springworldgames.jcgmusic.renderers.DrumsSimpleCymbal;
import com.springworldgames.jcgmusic.renderers.FastBass;
import com.springworldgames.jcgmusic.renderers.LatinBass;
import com.springworldgames.jcgmusic.renderers.LatinChords;
import com.springworldgames.jcgmusic.renderers.MarchBass;
import com.springworldgames.jcgmusic.renderers.MarchChords;
import com.springworldgames.jcgmusic.renderers.MarchPicolo;
import com.springworldgames.jcgmusic.renderers.Metronome;
import com.springworldgames.jcgmusic.renderers.PunkGuitarChords;
import com.springworldgames.jcgmusic.renderers.QuickIntroBass;
import com.springworldgames.jcgmusic.renderers.RandomBass;
import com.springworldgames.jcgmusic.renderers.RandomBassExtended;
import com.springworldgames.jcgmusic.renderers.ShortestWayChordsSimple;
import com.springworldgames.jcgmusic.renderers.ShortestWayChordsSmooth;
import com.springworldgames.jcgmusic.renderers.SimpleBass;
import com.springworldgames.jcgmusic.renderers.SimpleChords;
import com.springworldgames.jcgmusic.renderers.SimpleChordsSmooth;
import com.springworldgames.jcgmusic.renderers.SimpleMelody;
import com.springworldgames.jcgmusic.renderers.SineVelocitySimpleMelody;
import com.springworldgames.jcgmusic.renderers.SwingingBlues;
import com.springworldgames.jcgmusic.rythmgenerators.RandomStaticRythm;
import com.springworldgames.jcgmusic.rythmgenerators.SimpleRandomRythm;
import com.springworldgames.jcgmusic.rythmgenerators.SimpleSwingRythm;
import com.springworldgames.jcgmusic.structuregenerators.ClassicalStructureBig;
import com.springworldgames.jcgmusic.structuregenerators.ClassicalStructureSmall;
import com.springworldgames.jcgmusic.structuregenerators.ModernSongStructure;
import com.springworldgames.jcgmusic.structuregenerators.OnePartSimpleStructure;
import com.springworldgames.jcgmusic.structuregenerators.RandomStructure;
import com.springworldgames.objectreader.common.DefaultReadableObject;
import com.springworldgames.objectreader.common.PropertyFieldAssociation;

public class SongCreator extends DefaultReadableObject {

	public String structureScript = "Modern Song Structure";
	public String arrangementScript = "Simple Dance Style Arrangement";
	public int seed = 123;
	public int tempo = 120;

	PropertyFieldAssociation pfa;

	public PropertyFieldAssociation getPropertyFieldAssociation() {
		pfa = new PropertyFieldAssociation();
		pfa.addAssociation("Structure", "structureScript");
		pfa.setEnumerables("Structure", structureClasses.keySet());

		pfa.addAssociation("Arrangement", "arrangementScript");
		pfa.setEnumerables("Arrangement", arrangeClasses.keySet());

		pfa.addAssociation("Seed", "seed");
		pfa.addIntAssociationMinMax("Tempo", "tempo", 10, 500);
		return pfa;
	}

	LinkedHashMap<String, Class<?>> innerStructureClasses = new LinkedHashMap<String, Class<?>>();
	LinkedHashMap<String, Class<?>> structureClasses = new LinkedHashMap<String, Class<?>>();
	LinkedHashMap<String, Class<?>> renderClasses = new LinkedHashMap<String, Class<?>>();
	LinkedHashMap<String, Class<?>> ornamentorClasses = new LinkedHashMap<String, Class<?>>();
	LinkedHashMap<String, Class<?>> arrangeClasses = new LinkedHashMap<String, Class<?>>();
	LinkedHashMap<String, Class<?>> rythmClasses = new LinkedHashMap<String, Class<?>>();
	LinkedHashMap<String, Class<?>> harmonyClasses = new LinkedHashMap<String, Class<?>>();
	LinkedHashMap<String, Class<?>> melodyClasses = new LinkedHashMap<String, Class<?>>();

	ScriptGetter<StructureGenerator> structures = new ScriptGetter<StructureGenerator>(
			structureClasses, new StructureGenerator[0]);
	ScriptGetter<InnerStructureGenerator> innerStructures = new ScriptGetter<InnerStructureGenerator>(
			innerStructureClasses, new InnerStructureGenerator[0]);
	ScriptGetter<Renderer> renderers = new ScriptGetter<Renderer>(
			renderClasses, new Renderer[0]);
	ScriptGetter<Ornamentor> ornamentors = new ScriptGetter<Ornamentor>(
			ornamentorClasses, new Ornamentor[0]);
	ScriptGetter<Arranger> arrangers = new ScriptGetter<Arranger>(
			arrangeClasses, new Arranger[0]);
	ScriptGetter<RythmGenerator> rythms = new ScriptGetter<RythmGenerator>(
			rythmClasses, new RythmGenerator[0]);
	ScriptGetter<HarmonyGenerator> harmonies = new ScriptGetter<HarmonyGenerator>(
			harmonyClasses, new HarmonyGenerator[0]);
	ScriptGetter<MelodyCreator> melodies = new ScriptGetter<MelodyCreator>(
			melodyClasses, new MelodyCreator[0]);

	ArrayList<RenderPart> renderParts;
	private Song song;

	// Settings for unique parts
	LinkedHashMap<Integer, String> innerStructureScripts = new LinkedHashMap<Integer, String>();
	LinkedHashMap<Integer, Integer> innerStructureSeeds = new LinkedHashMap<Integer, Integer>();
	LinkedHashMap<Integer, String> rythmScripts = new LinkedHashMap<Integer, String>();
	LinkedHashMap<Integer, Integer> rythmSeeds = new LinkedHashMap<Integer, Integer>();
	LinkedHashMap<Integer, String> harmonyScripts = new LinkedHashMap<Integer, String>();
	LinkedHashMap<Integer, Integer> harmonySeeds = new LinkedHashMap<Integer, Integer>();
	LinkedHashMap<Integer, String> melodyScripts = new LinkedHashMap<Integer, String>();
	LinkedHashMap<Integer, Integer> melodySeeds = new LinkedHashMap<Integer, Integer>();
	LinkedHashMap<Integer, String> ornamentScripts = new LinkedHashMap<Integer, String>();
	LinkedHashMap<Integer, Integer> ornamentSeeds = new LinkedHashMap<Integer, Integer>();

	// Settings for parts
	LinkedHashMap<Integer, Integer> transposes = new LinkedHashMap<Integer, Integer>();
	LinkedHashMap<Integer, String> scales = new LinkedHashMap<Integer, String>();
	LinkedHashMap<Integer, Double> tempoMods = new LinkedHashMap<Integer, Double>();
	LinkedHashMap<Integer, Integer> arrHints = new LinkedHashMap<Integer, Integer>();

	public void setInnerStructureScript(int upIndex, String script) {
		innerStructureScripts.put(upIndex, script);
	}

	public void setInnerStructureSeed(int upIndex, Integer seed) {
		innerStructureSeeds.put(upIndex, seed);
	}

	public void setRythmScript(int upIndex, String script) {
		rythmScripts.put(upIndex, script);
	}

	public void setRythmSeed(int upIndex, Integer seed) {
		rythmSeeds.put(upIndex, seed);
	}

	public void setHarmonyScript(int upIndex, String script) {
		harmonyScripts.put(upIndex, script);
	}

	public void setHarmonySeed(int upIndex, Integer seed) {
		harmonySeeds.put(upIndex, seed);
	}

	public void setMelodyScript(int upIndex, String script) {
		melodyScripts.put(upIndex, script);
	}

	public void setMelodySeed(int upIndex, Integer seed) {
		melodySeeds.put(upIndex, seed);
	}

	public void setOrnamentScript(int upIndex, String script) {
		ornamentScripts.put(upIndex, script);
	}

	public void setOrnamentSeed(int upIndex, Integer seed) {
		ornamentSeeds.put(upIndex, seed);
	}

	public Collection<String> getInnerStructureScriptNames() {
		return innerStructureClasses.keySet();
	}

	public Collection<String> getRythmScriptNames() {
		return rythmClasses.keySet();
	}

	public Collection<String> getHarmonyScriptNames() {
		return harmonyClasses.keySet();
	}

	public Collection<String> getMelodyScriptNames() {
		return melodyClasses.keySet();
	}

	public Collection<String> getOrnamentorScriptNames() {
		return ornamentorClasses.keySet();
	}

	public SongCreator() {
		// Structure scripts
		structureClasses.put("Classical Structure Big",
				ClassicalStructureBig.class);
		structureClasses.put("Classical Structure Small",
				ClassicalStructureSmall.class);
		structureClasses
				.put("Modern Song Structure", ModernSongStructure.class);
		structureClasses.put("One Part Simple Structure",
				OnePartSimpleStructure.class);
		structureClasses.put("Random Structure", RandomStructure.class);

		// Inner structure scripts
		innerStructureClasses.put("Fixed Classical", FixedClassical.class);

		// Rythm scripts
		rythmClasses.put("Random Static Rythm", RandomStaticRythm.class);
		rythmClasses.put("Simple Random Rythm", SimpleRandomRythm.class);
		rythmClasses.put("Simple Swing Rythm", SimpleSwingRythm.class);

		// Harmony scripts
		harmonyClasses.put("Advanced Random Harmony",
				AdvancedRandomHarmony.class);
		harmonyClasses.put("Chord Map Harmony", ChordMapHarmony.class);
		harmonyClasses.put("Random Riff Harmony", RandomRiffHarmony.class);
		harmonyClasses.put("Simple Fixed Harmony", SimpleFixedHarmony.class);
		harmonyClasses.put("Simple Jazz Harmony", SimpleJazzHarmony.class);
		harmonyClasses.put("Simple Random Harmony", SimpleRandomHarmony.class);

		// Melody scripts
		melodyClasses.put("Random Phrased Melody", RandomPhrasedMelody.class);
		melodyClasses.put("Simple Random Melody", SimpleRandomMelody.class);
		melodyClasses.put("Wide Random Melody", WideRandomMelody.class);

		// Ornament scripts
		ornamentorClasses.put("No Ornamentation", NoOrnamentation.class);
		ornamentorClasses.put("Light Randomizer", LightRandomizer.class);
		ornamentorClasses
				.put("Simple Ornamentation", SimpleOrnamentation.class);

		// Arrangement scripts
		arrangeClasses.put("Piano Simple Arrangement",
				PianoSimpleArrangement.class);
		arrangeClasses.put("Piano Advanced Classical",
				PianoAdvancedClassical.class);
		arrangeClasses.put("Piano Advanced Disco", PianoAdvancedDisco.class);
		arrangeClasses.put("Piano Advanced Boogie Woogie",
				PianoAdvancedBoogieWoogie.class);
		arrangeClasses.put("Piano Advanced Swinging Blues",
				PianoAdvancedSwingingBlues.class);
		arrangeClasses.put("Simple Ballad Style Arrangement",
				SimpleBalladStyleArrangement.class);
		arrangeClasses.put("Simple Dance Style Arrangement",
				SimpleDanceStyleArrangement.class);
		arrangeClasses.put("Simple Instrumental March Arrangement",
				SimpleInstrumentalMarchArrangement.class);
		arrangeClasses.put("Simple Latin Style Arrangement",
				SimpleLatinStyleArrangement.class);
		arrangeClasses.put("Simple Punk Rock Style Arrangement",
				SimplePunkRockStyleArrangement.class);

		// Render scripts
		renderClasses.put("Accented Melody", AccentedMelody.class);
		renderClasses.put("Arpeggio Chords", ArpeggioChords.class);
		renderClasses.put("Arpeggio Chords Fast", ArpeggioChordsFast.class);
		renderClasses.put("Boogie Woogie", BoogieWoogie.class);
		renderClasses.put("Boogie Woogie Swing", BoogieWoogieSwing.class);
		renderClasses.put("Chordal Melody", ChordalMelody.class);
		renderClasses.put("Disco Jumping Bass", DiscoJumpingBass.class);
		renderClasses.put("Drums - Dance Foot & Snare",
				DrumsDanceFootAndSnare.class);
		renderClasses.put("Drums - Dance Hi-Hat", DrumsDanceHiHat.class);
		renderClasses.put("Drums - Dance Snare Attack",
				DrumsDanceSnareAttack.class);
		renderClasses.put("Drums - Latin", DrumsLatin.class);
		renderClasses.put("Drums - March", DrumsMarch.class);
		renderClasses.put("Drums - Punk Rock", DrumsPunkRock.class);
		renderClasses.put("Drums - Simple Cymbal", DrumsSimpleCymbal.class);
		renderClasses.put("Fast Bass", FastBass.class);
		renderClasses.put("Latin Bass", LatinBass.class);
		renderClasses.put("Latin Chords", LatinChords.class);
		renderClasses.put("March Bass", MarchBass.class);
		renderClasses.put("March Chords", MarchChords.class);
		renderClasses.put("March Picolo", MarchPicolo.class);
		renderClasses.put("Metronome", Metronome.class);
		renderClasses.put("Punk Guitar Chords", PunkGuitarChords.class);
		renderClasses.put("Quick Intro Bass", QuickIntroBass.class);
		renderClasses.put("Random Bass", RandomBass.class);
		renderClasses.put("Random Bass ( Extended )", RandomBassExtended.class);
		renderClasses.put("Shortest Way Chords Simple",
				ShortestWayChordsSimple.class);
		renderClasses.put("Shortest Way Chords Smooth",
				ShortestWayChordsSmooth.class);
		renderClasses.put("Simple Bass", SimpleBass.class);
		renderClasses.put("Simple Chords", SimpleChords.class);
		renderClasses.put("Simple Chords Smooth", SimpleChordsSmooth.class);
		renderClasses.put("Simple Melody", SimpleMelody.class);
		renderClasses.put("Sine Velocity Simple Melody",
				SineVelocitySimpleMelody.class);
		renderClasses.put("Swinging Blues", SwingingBlues.class);
	}

	class ScriptGetter<T> {

		private LinkedHashMap<String, Class<?>> classes;
		private T[] arr;

		public Object instantiate(LinkedHashMap<String, Class<?>> classes,
				String name) throws InstantiationException,
				IllegalAccessException {

			Class<?> cl = classes.get(name);
			if (cl == null) {
				throw new NullPointerException(
						"Could not find a script with name '" + name + "'");
			}
			Object newInstance = cl.newInstance();
			return newInstance;
		}

		public ScriptGetter(LinkedHashMap<String, Class<?>> classes, T[] arr) {
			this.classes = classes;
			this.arr = arr;
		}

		public T getScript(String name, Song song)
				throws InstantiationException, IllegalAccessException {
			Object newInstance = instantiate(classes, name);
			if (arr.getClass().getComponentType().isAssignableFrom(
					newInstance.getClass())) {
				MusicScript ms = (MusicScript) newInstance;
				ms.setSong(song);
				return (T) newInstance;
			} else {
				throw new IllegalArgumentException("Script with name '" + name
						+ "' does not implement "
						+ HarmonyGenerator.class.getName());
			}
		}
	}

	public void createSong() throws Exception {
		song = new Song(this);
		song.setTempo(tempo);
		song.setSeed(seed);

		renderParts = new ArrayList<RenderPart>();

		StructureGenerator structureGenerator = structures.getScript(
				structureScript, song);
		structureGenerator.setSeed(seed);
		structureGenerator.generateStructure(song);

		// Generate inner structure
		for (int i = 0; i < song.getUniqueParts(); i++) {
			UniquePart up = song.getUniquePart(i);

			// Getting the parameters for the inner structure
			String innerStructureScript = innerStructureScripts.get(i);
			Integer innerStructureSeed = innerStructureSeeds.get(i);

			if (innerStructureScript != null) {
				up.setScriptStructure(innerStructureScript);
			}
			if (innerStructureSeed != null) {
				up.setScriptStructureSeed(innerStructureSeed);
			}
			InnerStructureGenerator innerStructureGenerator = innerStructures
					.getScript(up.getScriptStructure(), song);
			innerStructureGenerator.generateInnerStructure(up);
		}

		// Make sure that:
		// * All parts have a reference to its unique part
		// *
		int currentBar = 0;
		for (int i = 0; i < song.getParts(); i++) {
			Part part = song.getPart(i);
			int uniquePartId = part.getUniquePart();
			UniquePart uniquePart = song.getUniquePart(uniquePartId);

			// Make sure that every part has a correct start and end bar
			part.setStartBar(currentBar);
			part.setEndBar(currentBar + uniquePart.getBars() - 1);

			int sentenceCount = uniquePart.getSentences();

			for (int j = 0; j < sentenceCount; j++) {
				Sentence sentence = uniquePart.getSentence(j);

				int phraseCount = sentence.getPhrases();
				for (int k = 0; k < phraseCount; k++) {
					Phrase phrase = sentence.getPhrase(k);
					int uniquePhraseID = phrase.getUniquePhraseID();
					UniquePhrase uniquePhrase = uniquePart
							.getUniquePhrase(uniquePhraseID);

					// Update the phrase reference to a unique phrase
					phrase.setUniquePhrase(uniquePhrase);
					phrase.setBars(uniquePhrase.getBars());

					// Update the unique phrase position info into the part and
					// sentence
					uniquePhrase.setStartsSentence(k == 0);
					uniquePhrase.setEndsSentence(k == phraseCount - 1);
					uniquePhrase.setStartsPart(j == 0 && k == 0);
					uniquePhrase.setEndsPart(j == sentenceCount - 1
							&& k == phraseCount - 1);
				}
			}

			int bars = uniquePart.getBars();
			currentBar += bars;
		}

		// Set all the scripts and seeds for the unique parts
		for (int i = 0; i < song.getUniqueParts(); i++) {
			UniquePart up = song.getUniquePart(i);

			String script = rythmScripts.get(i);
			Integer seed = rythmSeeds.get(i);
			if (script != null) {
				up.setScriptRhythm(script);
			}
			if (seed != null) {
				up.setScriptRhythmSeed(seed);
			}

			script = harmonyScripts.get(i);
			seed = harmonySeeds.get(i);
			if (script != null) {
				up.setScriptHarmony(script);
			}
			if (seed != null) {
				up.setScriptHarmonySeed(seed);
			}

			script = melodyScripts.get(i);
			seed = melodySeeds.get(i);
			if (script != null) {
				up.setScriptMelody(script);
			}
			if (seed != null) {
				up.setScriptMelodySeed(seed);
			}

			script = ornamentScripts.get(i);
			seed = ornamentSeeds.get(i);
			if (script != null) {
				up.setScriptOrnamentation(script);
			}
			if (seed != null) {
				up.setScriptOrnamentationSeed(seed);
			}
		}

		// Generate rythms
		for (int i = 0; i < song.getUniqueParts(); i++) {
			UniquePart up = song.getUniquePart(i);
			String scriptRhythm = up.getScriptRhythm();
			int rythmSeed = up.getScriptRhythmSeed();

			for (int j = 0; j < up.getUniquePhrases(); j++) {
				RythmGenerator rythm = rythms.getScript(scriptRhythm, song);
				rythm.setSeed(rythmSeed);
				UniquePhrase uniquePhrase = up.getUniquePhrase(j);
				rythm.generateRythm(uniquePhrase);
			}
		}

		// After the rythm is generated, we have events in the unique phrases
		// that must be copied to the unique part
		for (int i = 0; i < song.getUniqueParts(); i++) {
			UniquePart up = song.getUniquePart(i);
			int bars = 0;
			for (int j = 0; j < up.getSentences(); j++) {
				Sentence sentence = up.getSentence(j);
				int phrases = sentence.getPhrases();
				for (int k = 0; k < phrases; k++) {
					Phrase phrase = sentence.getPhrase(k);
					UniquePhrase uniquePhrase = phrase.getUniquePhrase();
					for (int l = 0; l < uniquePhrase.getEvents(); l++) {
						Event event = uniquePhrase.getEvent(l);
						up.addEvent((Event) event.copy().translate(bars));
					}
					bars += phrase.getBars();
				}
			}
		}

		// Generate harmony
		for (int i = 0; i < song.getUniqueParts(); i++) {
			UniquePart up = song.getUniquePart(i);
			String scriptHarmony = up.getScriptHarmony();
			int harmonySeed = up.getScriptHarmonySeed();
			HarmonyGenerator harmony = harmonies.getScript(scriptHarmony, song);
			harmony.setSeed(harmonySeed);
			harmony.generateHarmony(up);
		}

		// Calculate the harmony for all events
		for (int i = 0; i < song.getUniqueParts(); i++) {
			UniquePart up = song.getUniquePart(i);
			up.assignEventsToHarmony();
		}

		// for (int i = 0; i < song.GetUniqueParts(); i++) {
		// UniquePart up = song.GetUniquePart(i);
		// ArrayList<Harmonic> harmonicList = up.getHarmonicList();
		// for (Harmonic h : harmonicList) {
		// System.out.println(h);
		// }
		// ArrayList<Event> eventList = up.getEventList();
		// for (Event e : eventList) {
		// System.out.println(e + " " + up.getEventHarmonic(e));
		// }
		// }

		// Generate melody
		for (int i = 0; i < song.getUniqueParts(); i++) {
			UniquePart up = song.getUniquePart(i);
			String scriptMelody = up.getScriptMelody();
			int melodySeed = up.getScriptMelodySeed();
			MelodyCreator melody = melodies.getScript(scriptMelody, song);
			melody.setSeed(melodySeed);
			melody.createMelody(up);
		}

		// Ornament
		for (int i = 0; i < song.getParts(); i++) {
			Part part = song.getPart(i);

			int uniquePartIndex = part.getUniquePart();
			UniquePart uniquePart = song.getUniquePart(uniquePartIndex);

			String scriptOrnamentation = uniquePart.getScriptOrnamentation();
			int seed = uniquePart.getScriptOrnamentationSeed();
			Ornamentor script = ornamentors
					.getScript(scriptOrnamentation, song);
			script.setSeed(seed);
			script.ornament(uniquePart, part);
		}

		// for (int i = 0; i < song.GetParts(); i++) {
		// Part up = song.GetPart(i);
		// ArrayList<ChromaticEvent> eventList = up.getChromaticEventList();
		// for (ChromaticEvent e : eventList) {
		// System.out.println(e);
		// }
		// }

		// Arrangement
		Arranger arranger = arrangers.getScript(arrangementScript, song);
		arranger.arrange(song);

		// Render
		ArrayList<Track> tracks = song.getTracks();
		for (int i = 0; i < tracks.size(); i++) {
			Track t = tracks.get(i);
			ArrayList<RenderEvent> renderEvents = t.getRenderEvents();

			// System.out.println("track " + i + " render events " +
			// renderEvents);

			for (RenderEvent re : renderEvents) {
				String scriptName = re.getScriptName();

				int initialStep = re.getInitialStep();
				int finalStep = re.getFinalStep();

				// Gather the parts that are part of this RenderEvent
				ArrayList<Part> parts = new ArrayList<Part>();
				for (int j = 0; j < song.getParts(); j++) {
					Part part = song.getPart(j);
					if ((part.getStartBar() >= initialStep && part.getEndBar() <= finalStep)
							|| (initialStep >= part.getStartBar() && finalStep <= part
									.getEndBar())) {
						parts.add(part);
					}
				}
				int renderSeed = re.getSeed();

				// System.out.println("  " + scriptName + " " + initialStep +
				// " "
				// + finalStep + " " + parts);

				for (Part p : parts) {
					UniquePart up = song.getUniquePart(p.getUniquePart());
					RenderPart rp = new RenderPart(i);
					renderParts.add(rp);
					Renderer renderer = renderers.getScript(scriptName, song);
					rp.setData(p, up, re, song);
					// renderer.setSeed(up.getsc);
					renderer.setSeed(renderSeed);
					renderer.render(rp);
					// ArrayList<Note> notes = rp.getNotes();

					// System.out.println(p.GetStartBar() + " " + notes);
					rp.translateNotes(p.getStartBar());
					Time timeOffset = re.getTimeOffset();
					rp.translateNotes(timeOffset);

					// System.out.println("  After translate: " + notes);

				}

			}
		}

	}

	private int getRandomSeed(Random rnd) {
		return Utils.getRandomInt(1, 32000, rnd);
	}

	private long getTick(Time time, int metrum, int offset) {
		return (long) (192 * (time.mBar + time.mPos / metrum)) + offset;
	}

	private void addNote(javax.sound.midi.Track[] midiTracks, int metrum,
			int offset, int trackIndex, Time start, Time end, int channel,
			int pitch, int velocity) throws Exception {

		long onTime = (long) (192 * (start.mBar + start.mPos / metrum))
				+ offset;
		long offTime = (long) (192 * (end.mBar + end.mPos / metrum)) + offset;

		// System.out.println(onTime + " " + offTime);

		MidiEvent[] events = MidiUtils.getNoteOnAndOffEvents(pitch, channel,
				velocity, velocity, onTime, offTime);

		// if (trackIndex > 1) {
		// System.out.println(trackIndex + " " + start);
		// }
		javax.sound.midi.Track midiTrack = midiTracks[trackIndex];
		midiTrack.add(events[0]);
		midiTrack.add(events[1]);

	}

	public int getChannelFromTrackIndex(int trackIndex,
			LinkedHashSet<Integer> drumTrackIndices) {
		if (drumTrackIndices.contains(trackIndex)) {
			return 9;
		}
		if (trackIndex > 7) {
			return trackIndex + 3;
		}
		return trackIndex;
	}

	Sequence generateMidiSequence() throws Exception {
		Sequence sequence = null;

		int ticksPerQuarterNote4Over4InSequence = 192 / 4;
		sequence = new Sequence(Sequence.PPQ,
				ticksPerQuarterNote4Over4InSequence);

		ArrayList<Track> tracks = song.getTracks();

		int currentTick = 0;

		javax.sound.midi.Track[] midiTracks = new javax.sound.midi.Track[tracks
				.size()];

		LinkedHashSet<Integer> drumTrackIndices = new LinkedHashSet<Integer>();

		for (RenderPart rp : renderParts) {
			if (rp.isDrumPart()) {
				drumTrackIndices.add(rp.getTrackIndex());
			}
		}

		for (int i = 0; i < tracks.size(); i++) {
			Track track = tracks.get(i);
			int pan = track.getPan();
			int vol = track.getVol();
			midiTracks[i] = sequence.createTrack();

			int channel = getChannelFromTrackIndex(i, drumTrackIndices);

			MidiMessage message = MidiUtils.getSetChannelControlMessage(
					channel, MidiInfo.PAN, pan);
			midiTracks[i].add(new MidiEvent(message, currentTick));

			message = MidiUtils.getSetChannelControlMessage(channel,
					MidiInfo.VOLUME, vol);
			midiTracks[i].add(new MidiEvent(message, currentTick));

			message = MidiUtils.getProgramChangeMessage(
					getChannelFromTrackIndex(i, drumTrackIndices), tracks
							.get(i).getPatch() - 1);
			midiTracks[i].add(new MidiEvent(message, currentTick));
		}

		// Set the initial tempo
		MidiMessage setTempoMessage = MidiUtils.getSetTempoMessage((int) (song
				.getTempo()));
		midiTracks[0].add(new MidiEvent(setTempoMessage, currentTick));

		int offset = 192;

		for (int i = 0; i < song.getParts(); i++) {
			Part part = song.getPart(i);
			UniquePart up = song.getUniquePart(part.getUniquePart());
			int metrum = up.getMetrum();
			double startPosition = new Time(part.getStartBar(), 0)
					.getPosition(metrum);
			double endPosition = new Time(part.getEndBar(), metrum)
					.getPosition(metrum);

			long tick = getTick(new Time(part.getStartBar(), 0), metrum, offset);
			double tempoMod = part.getTempoMod();

			ArrayList<TempoMod> mods = song.getTempoMods();
			for (TempoMod mod : mods) {
				Time modPos = mod.getPos();
				double position = modPos.getPosition(up.getMetrum());
				if (position > startPosition && position < endPosition) {
					// Add a tempo mod stuff here
					setTempoMessage = MidiUtils.getSetTempoMessage((int) (song
							.getTempo()
							* mod.getMod() * tempoMod));
					long modTick = getTick(mod.getPos(), metrum, offset);
					midiTracks[0].add(new MidiEvent(setTempoMessage, modTick));
				}
			}

			setTempoMessage = MidiUtils.getSetTempoMessage((int) (song
					.getTempo() * tempoMod));
			midiTracks[0].add(new MidiEvent(setTempoMessage, tick));
		}

		for (RenderPart rp : renderParts) {
			ArrayList<Note> notes = rp.getNotes();
			ArrayList<PercussionNote> percNotes = rp.getPercussionNotes();
			int trackIndex = rp.getTrackIndex();
			int channel = getChannelFromTrackIndex(trackIndex, drumTrackIndices);
			UniquePart uniquePart = rp.getUniquePart();
			int metrum = uniquePart.getMetrum();

			// Track theTrack = tracks.get(trackIndex);

			for (Note n : notes) {
				Time start = n.getStart();
				Time end = n.getEnd();
				addNote(midiTracks, metrum, offset, trackIndex, start, end,
						channel, n.getPitch(), n.getVolume());
			}

			for (PercussionNote n : percNotes) {
				Time start = n.getStart();
				Time end = n.getEnd();
				addNote(midiTracks, metrum, offset, trackIndex, start, end, 9,
						n.getKey(), n.getVolume());
			}
		}

		return sequence;
	}

	public static void main(String[] args) throws Exception {

		SongCreator creator = new SongCreator();

		JFileChooser fc = new JFileChooser();

		Object[][] infos = new Object[][] {
				{ "boogie_woogie_1.mid",
						PianoAdvancedBoogieWoogie.getScriptName(), 3, 120 }, //
				{ "boogie_woogie_2.mid",
						PianoAdvancedBoogieWoogie.getScriptName(), 3335, 100 }, //
				{ "piano_classical_1.mid",
						PianoAdvancedClassical.getScriptName(), 2124, 100 }, //
				{ "piano_classical_2.mid",
						PianoAdvancedClassical.getScriptName(), 2474, 70 }, //
				{ "piano_disco_1.mid", PianoAdvancedDisco.getScriptName(), 345,
						120 }, //
				{ "piano_disco_2.mid", PianoAdvancedDisco.getScriptName(), 986,
						140 }, //
				{ "swinging_blues_1.mid",
						PianoAdvancedSwingingBlues.getScriptName(), 3451, 110 }, //
				{ "swinging_blues_2.mid",
						PianoAdvancedSwingingBlues.getScriptName(), 72, 120 }, //
				{ "piano_simple_1.mid", PianoSimpleArrangement.getScriptName(),
						34512, 100 }, //
				{ "piano_simple_2.mid", PianoSimpleArrangement.getScriptName(),
						3, 90 }, //
				{ "ballad_1.mid", SimpleBalladStyleArrangement.getScriptName(),
						345123, 70 }, //
				{ "ballad_2.mid", SimpleBalladStyleArrangement.getScriptName(),
						7355, 80 }, //
				{ "dance_1.mid", SimpleDanceStyleArrangement.getScriptName(),
						3451234, 130 }, //
				{ "dance_2.mid", SimpleDanceStyleArrangement.getScriptName(),
						52344234, 110 }, //
				{ "march_1.mid",
						SimpleInstrumentalMarchArrangement.getScriptName(),
						34512345, 110 }, //
				{ "march_2.mid",
						SimpleInstrumentalMarchArrangement.getScriptName(),
						5723, 90 }, //
				{ "latin_1.mid", SimpleLatinStyleArrangement.getScriptName(),
						345123456, 90 }, //
				{ "latin_1.mid", SimpleLatinStyleArrangement.getScriptName(),
						5345, 120 }, //
				{ "punk_rock_1.mid",
						SimplePunkRockStyleArrangement.getScriptName(), 2, 120 }, //
				{ "punk_rock_2.mid",
						SimplePunkRockStyleArrangement.getScriptName(), 232,
						100 }, //
		};

		for (int i = 0; i < infos.length; i++) {
			creator.arrangementScript = (String) infos[i][1];
			creator.seed = (Integer) infos[i][2];
			creator.tempo = (Integer) infos[i][3];
			creator.createSong();
			Sequence sequence = creator.generateMidiSequence();
			int[] types = MidiSystem.getMidiFileTypes();
			File file = new File("DevResources/Sound/" + infos[i][0]);
			MidiSystem.write(sequence, types[1], file);
		}
	}

}
