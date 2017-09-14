package com.springworldgames.jcgmusic;

import java.util.ArrayList;

public class RenderPart {

	private int trackIndex;
	private ArrayList<ChromaticEvent> chromaticEvents;
	private ArrayList<Harmonic> harmonics;
	private Part part;
	private UniquePart uniquePart;
	private int[] scaleOffsets;
	private RenderEvent renderEvent;

	ArrayList<Note> notes = new ArrayList<Note>();
	ArrayList<PercussionNote> percNotes = new ArrayList<PercussionNote>();
	private Song song;

	public int getTrackIndex() {
		return trackIndex;
	}

	public ArrayList<Note> getNotes() {
		return notes;
	}

	public ArrayList<PercussionNote> getPercussionNotes() {
		return percNotes;
	}

	public void setData(Part part, UniquePart uniquePart, RenderEvent re,
			Song song) {
		this.part = part;
		this.uniquePart = uniquePart;
		this.renderEvent = re;
		this.song = song;

		ArrayList<ChromaticEvent> chromaticEventList = part
				.getChromaticEventList();

		chromaticEvents = new ArrayList<ChromaticEvent>();
		for (ChromaticEvent ce : chromaticEventList) {
			chromaticEvents.add(ce.copy());
		}

		ArrayList<Harmonic> harmonicList = uniquePart.getHarmonicList();
		harmonics = new ArrayList<Harmonic>();
		for (Harmonic h : harmonicList) {
			Harmonic copy = h.copy();
			// copy.translate(part.GetStartBar());
			harmonics.add(copy);
		}
		scaleOffsets = part.getScaleOffsets().clone();
	}

	public RenderPart(int trackIndex) {
		this.trackIndex = trackIndex;
	}

	public int getEvents() {
		return chromaticEvents.size();
	}

	public int getHarmonic(Time t) {
		int metrum = uniquePart.getMetrum();
		double pos = t.getPosition(metrum);

		for (int i = 0; i < harmonics.size(); i++) {
			Harmonic h = harmonics.get(i);
			Interval2D interval = h.toInterval2D(metrum);
			if (interval.contains(pos) && interval.contains(pos + 0.01)) {
				return i;
			}
		}

		if (pos < 0) {
			return 0;
		} else {
			System.out.println(this + " " + t);
			return harmonics.size() - 1;
		}

		// Harmonic h = harmonics.get(0);
		//
		// t = t.copy();
		// t.m_Pos += 0.01;
		//
		// int compareStart = h.getStartTime().compareTo(t);
		// int compareEnd = h.getEndTime().compareTo(t);
		// boolean contains = AbstractEvent.contains(h.getStartTime(), h
		// .getEndTime(), t);
		//
		// System.out.println(this + " compareStart: " + compareStart
		// + " compareEnd: " + compareEnd + " " + t + " " + h);
		//
		// System.out.println(this + " could not find an harmonic for " + t +
		// " "
		// + harmonics);
		// return -1;
	}

	public Time getEventStart(int index) {
		return chromaticEvents.get(index).getStart();
	}

	public Time getEventEnd(int index) {
		return chromaticEvents.get(index).getEnd();
	}

	public int getEventPitch(int index) {
		return 12 * renderEvent.getOctave()
				+ chromaticEvents.get(index).getChromaticNote();
	}

	public int getHarmonicEvents() {
		return harmonics.size();
	}

	// public int GetHarmonic(int index) {
	// Harmonic harmonic = harmonics.get(index);
	// return 0;
	// }

	public int getHarmonicComponents(int index) {
		Harmonic harmonic = harmonics.get(index);
		return harmonic.getOffsets().length;
	}

	public int getHarmonicEventPitch(int index, int chordNoteIndex) {
		Harmonic harmonic = harmonics.get(index);

		int[] offsets = harmonic.getOffsets();
		int octaveOffset = 0;
		while (chordNoteIndex < 0) {
			chordNoteIndex += offsets.length;
			octaveOffset--;
		}

		while (chordNoteIndex >= offsets.length) {
			chordNoteIndex -= offsets.length;
			octaveOffset++;
		}

		int scaleIndex = harmonic.getBaseNote()
				+ harmonic.getOffsets()[chordNoteIndex];

		return 12 * renderEvent.getOctave() + octaveOffset * 12
				+ part.computePitch(scaleIndex);
	}

	public Time getHarmonicEventStart(int index) {
		Harmonic harmonic = harmonics.get(index);
		return harmonic.getStartTime();
	}

	public Time getHarmonicEventEnd(int index) {
		Harmonic harmonic = harmonics.get(index);
		return harmonic.getEndTime();
	}

	public int alignPitch(int chromaticChordNote, int scaleOffset) {

		int baseChrScaleNote = part.computePitch(1);

		int[] scaleOffsets = part.getScaleOffsets();

		int[] pitchClasses = new int[scaleOffsets.length];
		for (int i = 0; i < scaleOffsets.length; i++) {
			pitchClasses[i] = (baseChrScaleNote + scaleOffsets[i]) % 12;
		}

		int inPitchClass = chromaticChordNote % 12;

		int theOriginalScaleIndex = 0;

		if (!ArrayUtils.contains(pitchClasses, inPitchClass)) {
			// Find the closest scale note
			for (int i = chromaticChordNote - 7; i < chromaticChordNote + 8; i++) {

			}
			// System.out.println(this + " error " + chromaticChordNote + " " +
			// scaleOffset);
			// StackTraceUtils.printStackTrace();
		}
		for (int i = 0; i < pitchClasses.length; i++) {
			if (inPitchClass == pitchClasses[i]) {
				theOriginalScaleIndex = i;
				break;
			}
		}
		int newPitchClass = pitchClasses[MathUtils.positiveMod(
				theOriginalScaleIndex + scaleOffset, pitchClasses.length)];

		// System.out.println(this + " in pc: " + inPitchClass + " out pc: " +
		// newPitchClass + " offset: " + scaleOffset);

		int increment = scaleOffset > 0 ? 1 : -1;

		int currentNote = chromaticChordNote;
		while (true) {
			if ((currentNote % 12) == newPitchClass) {
				return currentNote;
			}
			currentNote += increment;
		}
	}

	public int computePitch(int note) {
		return note;
	}

	public void addNote(Time start, Time end, int pitch, int volume) {
		int initialStep = renderEvent.getInitialStep() - part.getStartBar();
		int finalStep = renderEvent.getFinalStep() - part.getStartBar();
		if (start.mBar >= initialStep && start.mBar <= finalStep) {
			notes.add(new Note(start.copy(), end.copy(), pitch,
					(int) (volume * renderEvent.getVolMult())));
		}
	}

	public void addPercNote(Time start, Time end, int key, int volume) {
		int initialStep = renderEvent.getInitialStep() - part.getStartBar();
		int finalStep = renderEvent.getFinalStep() - part.getStartBar();
		if (start.mBar >= initialStep && start.mBar <= finalStep) {
			percNotes.add(new PercussionNote(start.copy(), end.copy(), key,
					(int) (volume * renderEvent.getVolMult())));
		}
	}

	public int getTempo() {
		return (int) (part.getTempoMod() * song.getTempo());
	}

	public int getArrHint() {
		return part.getArrHint();
	}

	public int getStartBar() {
		return 0;
		// return renderEvent.getInitialStep();
		// return part.GetStartBar();
	}

	public int getEndBar() {
		return uniquePart.getBars();
		// return renderEvent.getFinalStep();
		// return part.GetEndBar();
	}

	public UniquePart getUniquePart() {
		return uniquePart;
	}

	public String getParam(String name) {
		String param = renderEvent.getParam(name);
		if (param == null) {
			return "0"; // Ugly hack, but makes the scripts work the way they
			// are now checking for non-existence with == 0
		} else {
			return param;
		}
	}

	public void translateNotes(int bars) {
		for (Note n : notes) {
			n.translate(bars);
		}
		for (PercussionNote n : percNotes) {
			n.translate(bars);
		}
	}

	public void translateNotes(Time t) {
		for (Note n : notes) {
			n.translate(t);
		}
		for (PercussionNote n : percNotes) {
			n.translate(t);
		}
	}

	public Part getPart() {
		return part;
	}

	public boolean isDrumPart() {
		return percNotes.size() > 0;
	}

}
