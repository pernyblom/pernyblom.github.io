package com.springworldgames.jcgmusic;

import java.util.HashMap;

public class MidiInfo {

	public static final int BANK_SELECT = 0;
	public static final int BANK_SELECT_MSB = 32;
	public static final int MODULATION_WHEEL = 1;
	public static final int BREATH_CONTROLLER = 2;
	public static final int FOOT_CONTROLLER = 4;
	public static final int PORTAMENTO_TIME = 5;
	public static final int DATA_ENTRY = 6;
	public static final int VOLUME = 7;
	public static final int BALANCE = 8;
	public static final int PAN = 10;
	public static final int EXPRESSION = 11;
	public static final int EFFECT_CONTROL_1 = 12;
	public static final int EFFECT_CONTROL_2 = 13;
	public static final int GENERAL_PURPOSE_1 = 15;
	public static final int GENERAL_PURPOSE_2 = 16;
	public static final int GENERAL_PURPOSE_3 = 17;
	public static final int GENERAL_PURPOSE_4 = 18;
	public static final int SUSTAIN = 64;
	public static final int PORTAMENTO = 65;
	public static final int SOSTENUTO = 66;
	public static final int SOFT_PEDAL = 67;
	public static final int LEGATO_FOOTSWITCH = 68;
	public static final int HOLD_2 = 69;
	public static final int SOUND_VARIATION = 70;
	public static final int TIMBRE_CONTENT = 71;
	public static final int RELEASE_TIME = 72;
	public static final int ATTACK_TIME = 73;
	public static final int BRIGHTNESS = 74;
	public static final int DECAY_TIME = 75;
	public static final int VIBRATO_RATE = 76;
	public static final int VIBRATO_DEPTH = 77;
	public static final int VIBRATO_DELAY = 78;
	public static final int SOUND_CONTROLLER_10 = 79;
	public static final int GENERAL_PURPOSE_5 = 80;
	public static final int GENERAL_PURPOSE_6 = 81;
	public static final int GENERAL_PURPOSE_7 = 82;
	public static final int GENERAL_PURPOSE_8 = 83;
	public static final int PORTAMENTO_CONTROL = 84;
	public static final int REVERB_SEND = 91;
	public static final int TREMOLO_DEPTH = 92;
	public static final int CHORUS_SEND = 93;
	public static final int DETUNE = 94;
	public static final int PHASER_DEPTH = 95;
	public static final int DATA_INCREMENT = 96;
	public static final int DATA_DECREMENT = 97;
	public static final int ALL_SOUND_OFF = 120;
	public static final int RESET_ALL_CONTROLLERS = 121;
	public static final int LOCAL_CONTROL = 122;
	public static final int ALL_NOTES_OFF = 123;
	public static final int OMNI_MODE_OFF = 124;
	public static final int OMNI_MODE_ON = 125;
	public static final int MONO_MODE_ON = 126;
	public static final int POLY_MODE_ON = 127;

	public static final int[] PIANO_INDICES = new int[] { 0, 1, 2, 3, 4, 5, 6,
			7 };
	public static final int[] CHROMATIC_PERCUSSION_INDICES = new int[] { 8, 9,
			10, 11, 12, 13, 14, 15 };
	public static final int[] ORGAN_INDICES = new int[] { 16, 17, 18, 19, 20,
			21, 22, 23 };
	public static final int[] GUITAR_INDICES = new int[] { 24, 25, 26, 27, 28,
			29, 30, 31 };
	public static final int[] BASS_INDICES = new int[] { 32, 33, 34, 35, 36,
			37, 38, 39 };
	public static final int[] STRINGS_INDICES = new int[] { 40, 41, 42, 43, 44,
			45, 46, 47 };
	public static final int[] ENSEMBLE_INDICES = new int[] { 48, 49, 50, 51,
			52, 53, 54, 55 };
	public static final int[] BRASS_INDICES = new int[] { 56, 57, 58, 59, 60,
			61, 62, 63 };
	public static final int[] REED_INDICES = new int[] { 64, 65, 66, 67, 68,
			69, 70, 71 };
	public static final int[] PIPE_INDICES = new int[] { 72, 73, 74, 75, 76,
			77, 78, 79 };
	public static final int[] SYNTH_LEAD_INDICES = new int[] { 80, 81, 82, 83,
			84, 85, 86, 87 };
	public static final int[] SYNTH_PAD_INDICES = new int[] { 88, 89, 90, 91,
			92, 93, 94, 95 };
	public static final int[] SYNTH_EFFECTS_INDICES = new int[] { 96, 97, 98,
			99, 100, 101, 102, 103 };
	public static final int[] ETHNIC_INDICES = new int[] { 104, 105, 106, 107,
			108, 109, 110, 111 };
	public static final int[] PERCUSSIVE_INDICES = new int[] { 112, 113, 114,
			115, 116, 117, 118, 119 };
	public static final int[] SOUND_EFFECTS_INDICES = new int[] { 120, 121,
			122, 123, 124, 125, 126, 127 };

	public static final int PERCUSSION_CHANNEL = 9;
	public static final int PERCUSSION_CHANNEL_2 = 10;
	public static final int PERCUSSION_CHANNEL_3 = 11;
	public static final int HARMONY_CHANNEL_1 = 3;
	public static final int HARMONY_CHANNEL_2 = 4;
	public static final int HARMONY_CHANNEL_3 = 5;
	public static final int HARMONY_CHANNEL_4 = 6;
	public static final int HARMONY_CHANNEL_5 = 7;
	public static final int HARMONY_CHANNEL_6 = 8;

	public static final int MELODY_CHANNEL_1 = 0;
	public static final int MELODY_CHANNEL_2 = 1;
	public static final int MELODY_CHANNEL_3 = 2;

	public static final int NO_VALID_CHANNEL = -1;

	public static final int[] HARMONY_CHANNELS = new int[] { HARMONY_CHANNEL_1,
			HARMONY_CHANNEL_2, HARMONY_CHANNEL_3, HARMONY_CHANNEL_4,
			HARMONY_CHANNEL_5, HARMONY_CHANNEL_6 };
	public static final int[] MELODY_CHANNELS = new int[] { MELODY_CHANNEL_1,
			MELODY_CHANNEL_2, MELODY_CHANNEL_3};

	public static int[] getHarmonyChannels() {
		return HARMONY_CHANNELS;
	}

	public static int[] getMelodyChannels() {
		return MELODY_CHANNELS;
	}

	static HashMap<Integer, MidiInstrument> indexInstrumentMap;

	static void createInstrumentMap() {
		indexInstrumentMap = new HashMap<Integer, MidiInstrument>();
		for (MidiInstrument type : MidiInstrument.values()) {
			indexInstrumentMap.put(getInstrumentIndex(type), type);
		}
		// System.out.println("the instrument map " + indexInstrumentMap);
	}

	public static MidiInstrument getInstrumentType(int index) {
		if (indexInstrumentMap == null) {
			createInstrumentMap();
		}
		return indexInstrumentMap.get(index);
	}

	public static String getInstrumentName(MidiInstrument instr) {
		switch (instr) {
		case ACOUSTIC_GRAND_PIANO:
			return "Acoustic Grand Piano";
		case ACCORDION:
			return "Accordion";
		case ACOUSTIC_BASS:
			return "Acoustic Bass";
		case ACOUSTIC_NYLON_GUITAR:
			return "Acoustic Nylon Guitar";
		case ACOUSTIC_STEEL_GUITAR:
			return "Acoustic Steel Guitar";
		case AGOGO:
			return "Agogo";
		}
		return instr.toString().replace('_', ' ').toLowerCase();
	}

	public static String getMidiControlString(int midiControl) {
		switch (midiControl) {
		case BANK_SELECT:
			return "Bank Select";
		case MODULATION_WHEEL:
			return "Modulation Wheel";
		case BREATH_CONTROLLER:
			return "Breath Controller";
		case FOOT_CONTROLLER:
			return "Foot Controller";
		case PORTAMENTO_TIME:
			return "Portamento Time";
		case DATA_ENTRY:
			return "Data Entry";
		case VOLUME:
			return "Volume";
		case BALANCE:
			return "Balance";
		case PAN:
			return "Pan";
		case EXPRESSION:
			return "Expression";
		case EFFECT_CONTROL_1:
			return "Effect Control 1";
		case EFFECT_CONTROL_2:
			return "Effect Control 2";
		case GENERAL_PURPOSE_1:
			return "General Purpose 1";
		case GENERAL_PURPOSE_2:
			return "General Purpose 2";
		case GENERAL_PURPOSE_3:
			return "General Purpose 3";
		case GENERAL_PURPOSE_4:
			return "General Purpose 4";
		case GENERAL_PURPOSE_5:
			return "General Purpose 5";
		case GENERAL_PURPOSE_6:
			return "General Purpose 6";
		case GENERAL_PURPOSE_7:
			return "General Purpose 7";
		case GENERAL_PURPOSE_8:
			return "General Purpose 8";
		case SUSTAIN:
			return "Sustain";
		case PORTAMENTO:
			return "Portamento";
		case SOSTENUTO:
			return "Sostenuto";
		case SOFT_PEDAL:
			return "Soft Pedal";
		case LEGATO_FOOTSWITCH:
			return "Legato Footswitch";
		case HOLD_2:
			return "Hold 2";
		case SOUND_VARIATION:
			return "Sound Variation";
		case TIMBRE_CONTENT:
			return "Timbre Content";
		case RELEASE_TIME:
			return "Release Time";
		case ATTACK_TIME:
			return "Attack Time";
		case BRIGHTNESS:
			return "Brightness";
		case DECAY_TIME:
			return "Decay Time";
		case VIBRATO_RATE:
			return "Vibrato Rate";
		case VIBRATO_DEPTH:
			return "Vibrato Depth";
		case VIBRATO_DELAY:
			return "Vibrato Delay";
		case SOUND_CONTROLLER_10:
			return "Sound Controller 10";
		case PORTAMENTO_CONTROL:
			return "Portament Control";
		case REVERB_SEND:
			return "Reverb Send";
		case TREMOLO_DEPTH:
			return "Tremolo Depth";
		case CHORUS_SEND:
			return "Chorus Send";
		case DETUNE:
			return "Detune";
		case PHASER_DEPTH:
			return "Phaser Depth";
		case DATA_DECREMENT:
			return "Data Decrement";
		case DATA_INCREMENT:
			return "Data Increment";
		case ALL_SOUND_OFF:
			return "All Sound Off";
		case RESET_ALL_CONTROLLERS:
			return "Reset All Controllers";
		case LOCAL_CONTROL:
			return "Local Control";
		case ALL_NOTES_OFF:
			return "All Notes Off";
		case OMNI_MODE_OFF:
			return "Omni Mode Off";
		case OMNI_MODE_ON:
			return "Omni Mode On";
		case MONO_MODE_ON:
			return "Mono Mode On";
		case POLY_MODE_ON:
			return "Poly Mode On";
		}
		return "Unknown Control";
	}

	public static int getInstrumentIndex(MidiInstrument type) {
		switch (type) {
		case ACOUSTIC_GRAND_PIANO:
			return 0;
		case BRIGHT_ACOUSTIC_PIANO:
			return 1;
		case ELECTRIC_GRAND_PIANO:
			return 2;
		case HONKY_TONK_PIANO:
			return 3;
		case ELECTRIC_PIANO_1:
			return 4;
		case ELECTRIC_PIANO_2:
			return 5;
		case HARPSICHORD:
			return 6;
		case CLAVI:
			return 7;
		case CELESTA:
			return 8;
		case GLOCKENSPIEL:
			return 9;
		case MUSIC_BOX:
			return 10;
		case VIBRAPHONE:
			return 11;
		case MARIMBA:
			return 12;
		case XYLOPHONE:
			return 13;
		case TUBULAR_BELLS:
			return 14;
		case DULCIMER:
			return 15;
		case DRAWBAR_ORGAN:
			return 16;
		case PERCUSSIVE_ORGAN:
			return 17;
		case ROCK_ORGAN:
			return 18;
		case CHURCH_ORGAN:
			return 19;
		case REED_ORGAN:
			return 20;
		case ACCORDION:
			return 21;
		case HARMONICA:
			return 22;
		case TANGO_ACCORDION:
			return 23;
		case ACOUSTIC_NYLON_GUITAR:
			return 24;
		case ACOUSTIC_STEEL_GUITAR:
			return 25;
		case ELECTRIC_JAZZ_GUITAR:
			return 26;
		case ELECTRIC_CLEAN_GUITAR:
			return 27;
		case ELECTRIC_MUTED_GUITAR:
			return 28;
		case OVERDRIVEN_GUITAR:
			return 29;
		case DISTORTION_GUITAR:
			return 30;
		case GUITAR_HARMONICS:
			return 31;
		case ACOUSTIC_BASS:
			return 32;
		case ELECTRIC_FINGER_BASS:
			return 33;
		case ELECTRIC_PICK_BASS:
			return 34;
		case AGOGO:
			return 113;
		case ALTO_SAX:
			return 65;
		case APPLAUSE:
			return 126;
		case ATMOSHPERE_FX:
			return 99;
		case BAG_PIPE:
			return 109;
		case BANJO:
			return 105;
		case BARITONE_SAX:
			return 67;
		case BASS_PLUS_LEAD:
			return 87;
		case BASSOON:
			return 70;
		case BIRD_TWEET:
			return 123;
		case BLOWN_BOTTLE:
			return 76;
		case BOWED_PAD:
			return 92;
		case BRASS_SECTION:
			return 61;
		case BREATH_NOISE:
			return 121;
		case BRIGHTNESS_FX:
			return 100;
		case CALLIOPE_LEAD:
			return 82;
		case CELLO:
			return 42;
		case CHARANG_LEAD:
			return 84;
		case CHIFF_LEAD:
			return 83;
		case CHOIR_AAHS:
			return 52;
		case CHOIR_PAD:
			return 91;
		case CLARINET:
			return 71;
		case CONTRABASS:
			return 43;
		case CRYSTAL_FX:
			return 98;
		case ECHOES_FX:
			return 102;
		case ENGLISH_HORN:
			return 69;
		case FIDDLE:
			return 110;
		case FIFTHS_LEAD:
			return 86;
		case FLUTE:
			return 73;
		case FRENCH_HORN:
			return 60;
		case FRETLESS_BASS:
			return 35;
		case GOBLINS_FX:
			return 101;
		case GUITAR_FRET_NOISE:
			return 120;
		case GUNSHOT:
			return 127;
		case HALO_PAD:
			return 94;
		case HELICOPTER:
			return 125;
		case KALIMBA:
			return 108;
		case KOTO:
			return 107;
		case MELODIC_TOM:
			return 117;
		case METALLIC_PAD:
			return 93;
		case MUTED_TRUMPET:
			return 59;
		case NEW_AGE_PAD:
			return 88;
		case OBOE:
			return 68;
		case OCARINA:
			return 79;
		case ORCHESTRA_HIT:
			return 55;
		case ORCHESTRAL_HARP:
			return 46;
		case PAN_FLUTE:
			return 75;
		case PICCOLO:
			return 72;
		case PIZZICATO_STRINGS:
			return 45;
		case POLYSYNTH_PAD:
			return 90;
		case RAIN_FX:
			return 96;
		case RECORDER:
			return 74;
		case REVERSE_CYMBAL:
			return 119;
		case SAWTOOTH_LEAD:
			return 81;
		case SCI_FI_FX:
			return 103;
		case SEASHORE:
			return 122;
		case SHAKUHACHI:
			return 77;
		case SHAMISEN:
			return 106;
		case SHANAI:
			return 111;
		case SITAR:
			return 104;
		case SLAP_BASS_1:
			return 36;
		case SLAP_BASS_2:
			return 37;
		case SOPRANO_SAX:
			return 64;
		case SOUNDTRACK_FX:
			return 97;
		case SQUARE_LEAD:
			return 80;
		case STEEL_DRUMS:
			return 114;
		case STRING_ENSEMBLE_1:
			return 48;
		case STRING_ENSEMBLE_2:
			return 49;
		case SWEEP_PAD:
			return 95;
		case SYNTH_BASS_1:
			return 38;
		case SYNTH_BASS_2:
			return 39;
		case SYNTH_BRASS_1:
			return 62;
		case SYNTH_BRASS_2:
			return 63;
		case SYNTH_DRUM:
			return 118;
		case SYNTH_STRINGS_1:
			return 50;
		case SYNTH_STRINGS_2:
			return 51;
		case SYNTH_VOICE:
			return 54;
		case TAIKO_DRUM:
			return 116;
		case TELEPHONE_RING:
			return 124;
		case TENOR_SAX:
			return 66;
		case TIMPANI:
			return 47;
		case TINKLE_BELL:
			return 112;
		case TREMOLO_STRINGS:
			return 44;
		case TROMBONE:
			return 57;
		case TRUMPET:
			return 56;
		case TUBA:
			return 58;
		case VIOLA:
			return 41;
		case VIOLIN:
			return 40;
		case VOICE_LEAD:
			return 85;
		case VOICE_OOHS:
			return 53;
		case WARM_PAD:
			return 89;
		case WHISTLE:
			return 78;
		case WOODBLOCK:
			return 115;

		default:
			return -1;
		}
	}


	public static String getChannelString(int channel) {
		switch (channel) {
		case MELODY_CHANNEL_1:
			return "Melody channel 1";
		case MELODY_CHANNEL_2:
			return "Melody channel 2";
		case MELODY_CHANNEL_3:
			return "Melody channel 3";
		case HARMONY_CHANNEL_1:
			return "Harmony channel 1";
		case HARMONY_CHANNEL_2:
			return "Harmony channel 2";
		case HARMONY_CHANNEL_3:
			return "Harmony channel 3";
		case HARMONY_CHANNEL_4:
			return "Harmony channel 4";
		case HARMONY_CHANNEL_5:
			return "Harmony channel 5";
		case HARMONY_CHANNEL_6:
			return "Harmony channel 6";
		case PERCUSSION_CHANNEL:
			return "Percussion channel 1";
		case PERCUSSION_CHANNEL_2:
			return "Percussion channel 2";
		case PERCUSSION_CHANNEL_3:
			return "Percussion channel 3";
		}
		return "Channel " + channel;
	}

}
