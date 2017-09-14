package com.springworldgames.jcgmusic;

import java.util.HashMap;

public class MusicInfo {

	public static final double TWO_POW_ONE_TVELWTH = Math.pow(2.0, 1.0 / 12.0);

	public static int[] majorSteps = new int[] { 0, 2, 2, 1, 2, 2, 2, 1 };
	public static int[] majorAbsSteps = new int[] { 0, 2, 4, 5, 7, 9, 11 };

	public static int[] naturalMinorSteps = new int[] { 0, 2, 1, 2, 2, 1, 2, 2 };
	public static int[] naturalMinorAbsSteps = new int[] { 0, 2, 3, 5, 7, 8, 10 };

	public static int[] harmonicMinorSteps = new int[] { 0, 2, 1, 2, 2, 1, 3, 1 };
	public static int[] harmonicMinorAbsSteps = new int[] { 0, 2, 3, 5, 7, 8,
			11 };

	public static int[] melodicMinorSteps = new int[] { 0, 2, 1, 2, 2, 2, 2, 1 };
	public static int[] melodicMinorAbsSteps = new int[] { 0, 2, 3, 5, 7, 9, 11 };

	public static int[] dorianSteps = new int[] { 0, 2, 1, 2, 2, 2, 1, 2 };
	public static int[] dorianAbsSteps = new int[] { 0, 2, 3, 5, 7, 9, 10 };

	public static int[] phrygianSteps = new int[] { 0, 1, 2, 2, 2, 1, 2, 2 };
	public static int[] phrygianAbsSteps = new int[] { 0, 1, 3, 5, 7, 8, 10 };

	public static int[] lydianSteps = new int[] { 0, 2, 2, 2, 1, 2, 2, 1 };
	public static int[] lydianAbsSteps = new int[] { 0, 2, 4, 6, 7, 9, 11 };

	public static int[] mixolydianSteps = new int[] { 0, 2, 2, 1, 2, 2, 1, 2 };
	public static int[] mixolydianAbsSteps = new int[] { 0, 2, 4, 5, 7, 9, 10 };

	public static int[] locrianSteps = new int[] { 0, 1, 2, 2, 1, 2, 2, 2 };
	public static int[] locrianAbsSteps = new int[] { 0, 1, 3, 5, 6, 8, 10 };

	public static int[] wholeToneSteps = new int[] { 0, 2, 2, 2, 2, 2, 2 };
	public static int[] wholeToneAbsSteps = new int[] { 0, 2, 4, 6, 8, 10 };

	public static int[] diminishedSteps = new int[] { 0, 2, 1, 2, 1, 2, 1, 2, 1 };
	public static int[] diminishedAbsSteps = new int[] { 0, 2, 3, 5, 6, 8, 9,
			11 };

	public static int[] bluesSteps = new int[] { 0, 2, 1, 2, 1, 3, 1, 2 };
	public static int[] bluesAbsSteps = new int[] { 0, 2, 3, 5, 6, 9, 10 };

	public static int[] neapolitanMinorSteps = new int[] { 0, 1, 2, 2, 2, 1, 3 };
	public static int[] neapolitanMinorAbsSteps = new int[] { 0, 1, 3, 5, 7, 8,
			11 };

	public static int[] neapolitanMajorSteps = new int[] { 0, 1, 3, 1, 2, 2, 2 };
	public static int[] neapolitanMajorAbsSteps = new int[] { 0, 1, 4, 5, 7, 9,
			11 };

	public static int[] neapolitanDorianAbsSteps = new int[] { 0, 1, 3, 5, 7,
			9, 10 };

	public static int[] neapolitanMixolydianAbsSteps = new int[] { 0, 1, 4, 5,
			7, 9, 10 };

	public static int[] orientalAbsSteps = new int[] { 0, 1, 4, 5, 6, 9, 10 };

	public static int[] arabianAbsSteps = new int[] { 0, 2, 4, 5, 6, 9, 10 };

	public static int[] algerianAbsSteps = new int[] { 0, 2, 3, 5, 6, 7, 8, 11 };

	public static int[] egyptianAbsSteps = new int[] { 0, 1, 4, 5, 7, 8, 11 };

	public static int[] persianAbsSteps = new int[] { 0, 1, 4, 5, 6, 8, 11 };

	public static int[] syrianAbsSteps = new int[] { 0, 1, 4, 5, 8, 11 };

	public static int[] jewishAbsSteps = new int[] { 0, 1, 4, 5, 7, 8, 10 };

	public static int[] hungarianMajorAbsSteps = new int[] { 0, 3, 4, 6, 7, 9,
			10 };

	public static int[] hungarianMinorAbsSteps = new int[] { 0, 2, 3, 6, 7, 8,
			11 };

	public static int[] gypsy1AbsSteps = new int[] { 0, 2, 3, 6, 7, 8, 10 };

	public static int[] gypsy2AbsSteps = new int[] { 0, 1, 4, 5, 7, 8, 11 };

	public static int[] allNotesSteps = new int[] { 0, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 1, 1 };
	public static int[] chromaticAbsSteps = new int[] { 0, 1, 2, 3, 4, 5, 6, 7,
			8, 9, 10, 11 };

	public static double[] noteFrequencies;

	public static HashMap<String, Integer> stringNoteMap = new HashMap<String, Integer>();
	public static HashMap<Integer, String> noteStringMap = new HashMap<Integer, String>();

	public static int getNoteFromString(String s) {
		return stringNoteMap.get(s);
	}

	public static String getStringFromNote(int note) {
		return noteStringMap.get(note);
	}

	public static String getStringFromNoteGeneral(int note) {
		int octave = note / 12;
		int normalizedNote = note - octave * 12;
		switch (normalizedNote) {
		case 0:
			return "C";
		case 1:
			return "C#";
		case 2:
			return "D";
		case 3:
			return "D#";
		case 4:
			return "E";
		case 5:
			return "F";
		case 6:
			return "F#";
		case 7:
			return "G";
		case 8:
			return "G#";
		case 9:
			return "A";
		case 10:
			return "A#";
		case 11:
			return "B";
		}
		System.out
				.println("In musicInfo: getStringFromNoteGeneral() failed. note: "
						+ note
						+ " normalizedNote: "
						+ normalizedNote
						+ " octave: " + octave);
		return null;
	}

	public static void generateConstants() {

		StringBuilder builder = new StringBuilder();
		for (int i = 0; i <= 9; i++) {
			int base = 12 * i;
			// C0 has number 12
			builder.append("public static int C" + i + " = " + (12 + base)
					+ ";\n");
			builder.append("public static int Cis" + i + " = " + (13 + base)
					+ ";\n");
			builder.append("public static int Des" + i + " = " + (13 + base)
					+ ";\n");
			builder.append("public static int D" + i + " = " + (14 + base)
					+ ";\n");
			builder.append("public static int Dis" + i + " = " + (15 + base)
					+ ";\n");
			builder.append("public static int Es" + i + " = " + (15 + base)
					+ ";\n");
			builder.append("public static int E" + i + " = " + (16 + base)
					+ ";\n");
			builder.append("public static int F" + i + " = " + (17 + base)
					+ ";\n");
			builder.append("public static int Fis" + i + " = " + (18 + base)
					+ ";\n");
			builder.append("public static int Ges" + i + " = " + (18 + base)
					+ ";\n");
			builder.append("public static int G" + i + " = " + (19 + base)
					+ ";\n");
			builder.append("public static int Gis" + i + " = " + (20 + base)
					+ ";\n");
			builder.append("public static int As" + i + " = " + (20 + base)
					+ ";\n");
			builder.append("public static int A" + i + " = " + (21 + base)
					+ ";\n");
			builder.append("public static int Ais" + i + " = " + (22 + base)
					+ ";\n");
			builder.append("public static int Bes" + i + " = " + (22 + base)
					+ ";\n");
			builder.append("public static int B" + i + " = " + (23 + base)
					+ ";\n");
		}
		System.out.println(builder.toString());
	}

	public static void generateStringNoteMapping() {

		// Generated the building of the map from Strings to ints
		StringBuilder builder = new StringBuilder();
		String noteString;
		for (int i = 0; i <= 9; i++) {
			// C0 has number 12
			noteString = "C" + i;
			builder.append("stringNoteMap.put(\"" + noteString + "\", "
					+ noteString + ");\n");
			builder.append("noteStringMap.put(" + noteString + ", \""
					+ noteString + "\");\n");
			noteString = "Cis" + i;
			builder.append("stringNoteMap.put(\"" + noteString + "\", "
					+ noteString + ");\n");
			builder.append("noteStringMap.put(" + noteString + ", \""
					+ noteString + "\");\n");
			noteString = "Des" + i;
			builder.append("stringNoteMap.put(\"" + noteString + "\", "
					+ noteString + ");\n");
			builder.append("noteStringMap.put(" + noteString + ", \""
					+ noteString + "\");\n");
			noteString = "D" + i;
			builder.append("stringNoteMap.put(\"" + noteString + "\", "
					+ noteString + ");\n");
			builder.append("noteStringMap.put(" + noteString + ", \""
					+ noteString + "\");\n");
			noteString = "Dis" + i;
			builder.append("stringNoteMap.put(\"" + noteString + "\", "
					+ noteString + ");\n");
			builder.append("noteStringMap.put(" + noteString + ", \""
					+ noteString + "\");\n");
			noteString = "Es" + i;
			builder.append("stringNoteMap.put(\"" + noteString + "\", "
					+ noteString + ");\n");
			builder.append("noteStringMap.put(" + noteString + ", \""
					+ noteString + "\");\n");
			noteString = "E" + i;
			builder.append("stringNoteMap.put(\"" + noteString + "\", "
					+ noteString + ");\n");
			builder.append("noteStringMap.put(" + noteString + ", \""
					+ noteString + "\");\n");
			noteString = "F" + i;
			builder.append("stringNoteMap.put(\"" + noteString + "\", "
					+ noteString + ");\n");
			builder.append("noteStringMap.put(" + noteString + ", \""
					+ noteString + "\");\n");
			noteString = "Fis" + i;
			builder.append("stringNoteMap.put(\"" + noteString + "\", "
					+ noteString + ");\n");
			builder.append("noteStringMap.put(" + noteString + ", \""
					+ noteString + "\");\n");
			noteString = "Ges" + i;
			builder.append("stringNoteMap.put(\"" + noteString + "\", "
					+ noteString + ");\n");
			builder.append("noteStringMap.put(" + noteString + ", \""
					+ noteString + "\");\n");
			noteString = "G" + i;
			builder.append("stringNoteMap.put(\"" + noteString + "\", "
					+ noteString + ");\n");
			builder.append("noteStringMap.put(" + noteString + ", \""
					+ noteString + "\");\n");
			noteString = "Gis" + i;
			builder.append("stringNoteMap.put(\"" + noteString + "\", "
					+ noteString + ");\n");
			builder.append("noteStringMap.put(" + noteString + ", \""
					+ noteString + "\");\n");
			noteString = "As" + i;
			builder.append("stringNoteMap.put(\"" + noteString + "\", "
					+ noteString + ");\n");
			builder.append("noteStringMap.put(" + noteString + ", \""
					+ noteString + "\");\n");
			noteString = "A" + i;
			builder.append("stringNoteMap.put(\"" + noteString + "\", "
					+ noteString + ");\n");
			builder.append("noteStringMap.put(" + noteString + ", \""
					+ noteString + "\");\n");
			noteString = "Ais" + i;
			builder.append("stringNoteMap.put(\"" + noteString + "\", "
					+ noteString + ");\n");
			builder.append("noteStringMap.put(" + noteString + ", \""
					+ noteString + "\");\n");
			noteString = "Bes" + i;
			builder.append("stringNoteMap.put(\"" + noteString + "\", "
					+ noteString + ");\n");
			builder.append("noteStringMap.put(" + noteString + ", \""
					+ noteString + "\");\n");
			noteString = "B" + i;
			builder.append("stringNoteMap.put(\"" + noteString + "\", "
					+ noteString + ");\n");
			builder.append("noteStringMap.put(" + noteString + ", \""
					+ noteString + "\");\n");
		}
		System.out.println(builder.toString());
	}

	// Automatically generated constants (with generateConstants())
	public static int C0 = 12;
	public static int Cis0 = 13;
	public static int Des0 = 13;
	public static int D0 = 14;
	public static int Dis0 = 15;
	public static int Es0 = 15;
	public static int E0 = 16;
	public static int F0 = 17;
	public static int Fis0 = 18;
	public static int Ges0 = 18;
	public static int G0 = 19;
	public static int Gis0 = 20;
	public static int As0 = 20;
	public static int A0 = 21;
	public static int Ais0 = 22;
	public static int Bes0 = 22;
	public static int B0 = 23;
	public static int C1 = 24;
	public static int Cis1 = 25;
	public static int Des1 = 25;
	public static int D1 = 26;
	public static int Dis1 = 27;
	public static int Es1 = 27;
	public static int E1 = 28;
	public static int F1 = 29;
	public static int Fis1 = 30;
	public static int Ges1 = 30;
	public static int G1 = 31;
	public static int Gis1 = 32;
	public static int As1 = 32;
	public static int A1 = 33;
	public static int Ais1 = 34;
	public static int Bes1 = 34;
	public static int B1 = 35;
	public static int C2 = 36;
	public static int Cis2 = 37;
	public static int Des2 = 37;
	public static int D2 = 38;
	public static int Dis2 = 39;
	public static int Es2 = 39;
	public static int E2 = 40;
	public static int F2 = 41;
	public static int Fis2 = 42;
	public static int Ges2 = 42;
	public static int G2 = 43;
	public static int Gis2 = 44;
	public static int As2 = 44;
	public static int A2 = 45;
	public static int Ais2 = 46;
	public static int Bes2 = 46;
	public static int B2 = 47;
	public static int C3 = 48;
	public static int Cis3 = 49;
	public static int Des3 = 49;
	public static int D3 = 50;
	public static int Dis3 = 51;
	public static int Es3 = 51;
	public static int E3 = 52;
	public static int F3 = 53;
	public static int Fis3 = 54;
	public static int Ges3 = 54;
	public static int G3 = 55;
	public static int Gis3 = 56;
	public static int As3 = 56;
	public static int A3 = 57;
	public static int Ais3 = 58;
	public static int Bes3 = 58;
	public static int B3 = 59;
	public static int C4 = 60;
	public static int Cis4 = 61;
	public static int Des4 = 61;
	public static int D4 = 62;
	public static int Dis4 = 63;
	public static int Es4 = 63;
	public static int E4 = 64;
	public static int F4 = 65;
	public static int Fis4 = 66;
	public static int Ges4 = 66;
	public static int G4 = 67;
	public static int Gis4 = 68;
	public static int As4 = 68;
	public static int A4 = 69;
	public static int Ais4 = 70;
	public static int Bes4 = 70;
	public static int B4 = 71;
	public static int C5 = 72;
	public static int Cis5 = 73;
	public static int Des5 = 73;
	public static int D5 = 74;
	public static int Dis5 = 75;
	public static int Es5 = 75;
	public static int E5 = 76;
	public static int F5 = 77;
	public static int Fis5 = 78;
	public static int Ges5 = 78;
	public static int G5 = 79;
	public static int Gis5 = 80;
	public static int As5 = 80;
	public static int A5 = 81;
	public static int Ais5 = 82;
	public static int Bes5 = 82;
	public static int B5 = 83;
	public static int C6 = 84;
	public static int Cis6 = 85;
	public static int Des6 = 85;
	public static int D6 = 86;
	public static int Dis6 = 87;
	public static int Es6 = 87;
	public static int E6 = 88;
	public static int F6 = 89;
	public static int Fis6 = 90;
	public static int Ges6 = 90;
	public static int G6 = 91;
	public static int Gis6 = 92;
	public static int As6 = 92;
	public static int A6 = 93;
	public static int Ais6 = 94;
	public static int Bes6 = 94;
	public static int B6 = 95;
	public static int C7 = 96;
	public static int Cis7 = 97;
	public static int Des7 = 97;
	public static int D7 = 98;
	public static int Dis7 = 99;
	public static int Es7 = 99;
	public static int E7 = 100;
	public static int F7 = 101;
	public static int Fis7 = 102;
	public static int Ges7 = 102;
	public static int G7 = 103;
	public static int Gis7 = 104;
	public static int As7 = 104;
	public static int A7 = 105;
	public static int Ais7 = 106;
	public static int Bes7 = 106;
	public static int B7 = 107;
	public static int C8 = 108;
	public static int Cis8 = 109;
	public static int Des8 = 109;
	public static int D8 = 110;
	public static int Dis8 = 111;
	public static int Es8 = 111;
	public static int E8 = 112;
	public static int F8 = 113;
	public static int Fis8 = 114;
	public static int Ges8 = 114;
	public static int G8 = 115;
	public static int Gis8 = 116;
	public static int As8 = 116;
	public static int A8 = 117;
	public static int Ais8 = 118;
	public static int Bes8 = 118;
	public static int B8 = 119;
	public static int C9 = 120;
	public static int Cis9 = 121;
	public static int Des9 = 121;
	public static int D9 = 122;
	public static int Dis9 = 123;
	public static int Es9 = 123;
	public static int E9 = 124;
	public static int F9 = 125;
	public static int Fis9 = 126;
	public static int Ges9 = 126;
	public static int G9 = 127;
	public static int Gis9 = 128;
	public static int As9 = 128;
	public static int A9 = 129;
	public static int Ais9 = 130;
	public static int Bes9 = 130;
	public static int B9 = 131;

	// Uses the note constants
	public static double getNoteFrequency(int note) {
		int n = note - A4;
		return 440.0 * Math.pow(2.0, n / 12.0);
	}


	public static String intervalToString(int interval) {

		if (interval < 24) {
			switch (interval) {
			case 0:
				return "Unison";
			case 1:
				return "Minor 2nd";
			case 2:
				return "Major 2nd";
			case 3:
				return "Minor 3rd";
			case 4:
				return "Major 3rd";
			case 5:
				return "Perfect 4th";
			case 6:
				return "Dim 5th";
			case 7:
				return "Perfect 5th";
			case 8:
				return "Minor 6th";
			case 9:
				return "Major 6th";
			case 10:
				return "Minor 7th";
			case 11:
				return "Major 7th";
			case 12:
				return "Octave";
			case 13:
				return "Minor 9th";
			case 14:
				return "Major 9th";
			case 15:
				return "Minor 10th";
			case 16:
				return "Major 10th";
			case 17:
				return "Perfect 11th";
			case 18:
				return "Dim 12th";
			case 19:
				return "Perfect 12th";
			case 20:
				return "Minor 13th";
			case 21:
				return "Major 13th";
			case 22:
				return "Minor 14th";
			case 23:
				return "Major 14th";
			}

		} else {
			int octaves = interval / 12;
			int value = interval % 12;
			if (value == 0) {
				return octaves + " Octaves";
			} else {
				return octaves + " Oct. + " + intervalToString(value % 12);
			}
		}
		return "";
	}


	static {
		noteFrequencies = new double[12 * 20];
		for (int i = 0; i < noteFrequencies.length; i++) {
			// Start with A and work upwards
			noteFrequencies[i] = 27.5 * Math.pow(MusicInfo.TWO_POW_ONE_TVELWTH,
					i);
		}

		stringNoteMap.put("C0", C0);
		noteStringMap.put(C0, "C0");
		stringNoteMap.put("Cis0", Cis0);
		noteStringMap.put(Cis0, "Cis0");
		stringNoteMap.put("Des0", Des0);
		noteStringMap.put(Des0, "Des0");
		stringNoteMap.put("D0", D0);
		noteStringMap.put(D0, "D0");
		stringNoteMap.put("Dis0", Dis0);
		noteStringMap.put(Dis0, "Dis0");
		stringNoteMap.put("Es0", Es0);
		noteStringMap.put(Es0, "Es0");
		stringNoteMap.put("E0", E0);
		noteStringMap.put(E0, "E0");
		stringNoteMap.put("F0", F0);
		noteStringMap.put(F0, "F0");
		stringNoteMap.put("Fis0", Fis0);
		noteStringMap.put(Fis0, "Fis0");
		stringNoteMap.put("Ges0", Ges0);
		noteStringMap.put(Ges0, "Ges0");
		stringNoteMap.put("G0", G0);
		noteStringMap.put(G0, "G0");
		stringNoteMap.put("Gis0", Gis0);
		noteStringMap.put(Gis0, "Gis0");
		stringNoteMap.put("As0", As0);
		noteStringMap.put(As0, "As0");
		stringNoteMap.put("A0", A0);
		noteStringMap.put(A0, "A0");
		stringNoteMap.put("Ais0", Ais0);
		noteStringMap.put(Ais0, "Ais0");
		stringNoteMap.put("Bes0", Bes0);
		noteStringMap.put(Bes0, "Bes0");
		stringNoteMap.put("B0", B0);
		noteStringMap.put(B0, "B0");
		stringNoteMap.put("C1", C1);
		noteStringMap.put(C1, "C1");
		stringNoteMap.put("Cis1", Cis1);
		noteStringMap.put(Cis1, "Cis1");
		stringNoteMap.put("Des1", Des1);
		noteStringMap.put(Des1, "Des1");
		stringNoteMap.put("D1", D1);
		noteStringMap.put(D1, "D1");
		stringNoteMap.put("Dis1", Dis1);
		noteStringMap.put(Dis1, "Dis1");
		stringNoteMap.put("Es1", Es1);
		noteStringMap.put(Es1, "Es1");
		stringNoteMap.put("E1", E1);
		noteStringMap.put(E1, "E1");
		stringNoteMap.put("F1", F1);
		noteStringMap.put(F1, "F1");
		stringNoteMap.put("Fis1", Fis1);
		noteStringMap.put(Fis1, "Fis1");
		stringNoteMap.put("Ges1", Ges1);
		noteStringMap.put(Ges1, "Ges1");
		stringNoteMap.put("G1", G1);
		noteStringMap.put(G1, "G1");
		stringNoteMap.put("Gis1", Gis1);
		noteStringMap.put(Gis1, "Gis1");
		stringNoteMap.put("As1", As1);
		noteStringMap.put(As1, "As1");
		stringNoteMap.put("A1", A1);
		noteStringMap.put(A1, "A1");
		stringNoteMap.put("Ais1", Ais1);
		noteStringMap.put(Ais1, "Ais1");
		stringNoteMap.put("Bes1", Bes1);
		noteStringMap.put(Bes1, "Bes1");
		stringNoteMap.put("B1", B1);
		noteStringMap.put(B1, "B1");
		stringNoteMap.put("C2", C2);
		noteStringMap.put(C2, "C2");
		stringNoteMap.put("Cis2", Cis2);
		noteStringMap.put(Cis2, "Cis2");
		stringNoteMap.put("Des2", Des2);
		noteStringMap.put(Des2, "Des2");
		stringNoteMap.put("D2", D2);
		noteStringMap.put(D2, "D2");
		stringNoteMap.put("Dis2", Dis2);
		noteStringMap.put(Dis2, "Dis2");
		stringNoteMap.put("Es2", Es2);
		noteStringMap.put(Es2, "Es2");
		stringNoteMap.put("E2", E2);
		noteStringMap.put(E2, "E2");
		stringNoteMap.put("F2", F2);
		noteStringMap.put(F2, "F2");
		stringNoteMap.put("Fis2", Fis2);
		noteStringMap.put(Fis2, "Fis2");
		stringNoteMap.put("Ges2", Ges2);
		noteStringMap.put(Ges2, "Ges2");
		stringNoteMap.put("G2", G2);
		noteStringMap.put(G2, "G2");
		stringNoteMap.put("Gis2", Gis2);
		noteStringMap.put(Gis2, "Gis2");
		stringNoteMap.put("As2", As2);
		noteStringMap.put(As2, "As2");
		stringNoteMap.put("A2", A2);
		noteStringMap.put(A2, "A2");
		stringNoteMap.put("Ais2", Ais2);
		noteStringMap.put(Ais2, "Ais2");
		stringNoteMap.put("Bes2", Bes2);
		noteStringMap.put(Bes2, "Bes2");
		stringNoteMap.put("B2", B2);
		noteStringMap.put(B2, "B2");
		stringNoteMap.put("C3", C3);
		noteStringMap.put(C3, "C3");
		stringNoteMap.put("Cis3", Cis3);
		noteStringMap.put(Cis3, "Cis3");
		stringNoteMap.put("Des3", Des3);
		noteStringMap.put(Des3, "Des3");
		stringNoteMap.put("D3", D3);
		noteStringMap.put(D3, "D3");
		stringNoteMap.put("Dis3", Dis3);
		noteStringMap.put(Dis3, "Dis3");
		stringNoteMap.put("Es3", Es3);
		noteStringMap.put(Es3, "Es3");
		stringNoteMap.put("E3", E3);
		noteStringMap.put(E3, "E3");
		stringNoteMap.put("F3", F3);
		noteStringMap.put(F3, "F3");
		stringNoteMap.put("Fis3", Fis3);
		noteStringMap.put(Fis3, "Fis3");
		stringNoteMap.put("Ges3", Ges3);
		noteStringMap.put(Ges3, "Ges3");
		stringNoteMap.put("G3", G3);
		noteStringMap.put(G3, "G3");
		stringNoteMap.put("Gis3", Gis3);
		noteStringMap.put(Gis3, "Gis3");
		stringNoteMap.put("As3", As3);
		noteStringMap.put(As3, "As3");
		stringNoteMap.put("A3", A3);
		noteStringMap.put(A3, "A3");
		stringNoteMap.put("Ais3", Ais3);
		noteStringMap.put(Ais3, "Ais3");
		stringNoteMap.put("Bes3", Bes3);
		noteStringMap.put(Bes3, "Bes3");
		stringNoteMap.put("B3", B3);
		noteStringMap.put(B3, "B3");
		stringNoteMap.put("C4", C4);
		noteStringMap.put(C4, "C4");
		stringNoteMap.put("Cis4", Cis4);
		noteStringMap.put(Cis4, "Cis4");
		stringNoteMap.put("Des4", Des4);
		noteStringMap.put(Des4, "Des4");
		stringNoteMap.put("D4", D4);
		noteStringMap.put(D4, "D4");
		stringNoteMap.put("Dis4", Dis4);
		noteStringMap.put(Dis4, "Dis4");
		stringNoteMap.put("Es4", Es4);
		noteStringMap.put(Es4, "Es4");
		stringNoteMap.put("E4", E4);
		noteStringMap.put(E4, "E4");
		stringNoteMap.put("F4", F4);
		noteStringMap.put(F4, "F4");
		stringNoteMap.put("Fis4", Fis4);
		noteStringMap.put(Fis4, "Fis4");
		stringNoteMap.put("Ges4", Ges4);
		noteStringMap.put(Ges4, "Ges4");
		stringNoteMap.put("G4", G4);
		noteStringMap.put(G4, "G4");
		stringNoteMap.put("Gis4", Gis4);
		noteStringMap.put(Gis4, "Gis4");
		stringNoteMap.put("As4", As4);
		noteStringMap.put(As4, "As4");
		stringNoteMap.put("A4", A4);
		noteStringMap.put(A4, "A4");
		stringNoteMap.put("Ais4", Ais4);
		noteStringMap.put(Ais4, "Ais4");
		stringNoteMap.put("Bes4", Bes4);
		noteStringMap.put(Bes4, "Bes4");
		stringNoteMap.put("B4", B4);
		noteStringMap.put(B4, "B4");
		stringNoteMap.put("C5", C5);
		noteStringMap.put(C5, "C5");
		stringNoteMap.put("Cis5", Cis5);
		noteStringMap.put(Cis5, "Cis5");
		stringNoteMap.put("Des5", Des5);
		noteStringMap.put(Des5, "Des5");
		stringNoteMap.put("D5", D5);
		noteStringMap.put(D5, "D5");
		stringNoteMap.put("Dis5", Dis5);
		noteStringMap.put(Dis5, "Dis5");
		stringNoteMap.put("Es5", Es5);
		noteStringMap.put(Es5, "Es5");
		stringNoteMap.put("E5", E5);
		noteStringMap.put(E5, "E5");
		stringNoteMap.put("F5", F5);
		noteStringMap.put(F5, "F5");
		stringNoteMap.put("Fis5", Fis5);
		noteStringMap.put(Fis5, "Fis5");
		stringNoteMap.put("Ges5", Ges5);
		noteStringMap.put(Ges5, "Ges5");
		stringNoteMap.put("G5", G5);
		noteStringMap.put(G5, "G5");
		stringNoteMap.put("Gis5", Gis5);
		noteStringMap.put(Gis5, "Gis5");
		stringNoteMap.put("As5", As5);
		noteStringMap.put(As5, "As5");
		stringNoteMap.put("A5", A5);
		noteStringMap.put(A5, "A5");
		stringNoteMap.put("Ais5", Ais5);
		noteStringMap.put(Ais5, "Ais5");
		stringNoteMap.put("Bes5", Bes5);
		noteStringMap.put(Bes5, "Bes5");
		stringNoteMap.put("B5", B5);
		noteStringMap.put(B5, "B5");
		stringNoteMap.put("C6", C6);
		noteStringMap.put(C6, "C6");
		stringNoteMap.put("Cis6", Cis6);
		noteStringMap.put(Cis6, "Cis6");
		stringNoteMap.put("Des6", Des6);
		noteStringMap.put(Des6, "Des6");
		stringNoteMap.put("D6", D6);
		noteStringMap.put(D6, "D6");
		stringNoteMap.put("Dis6", Dis6);
		noteStringMap.put(Dis6, "Dis6");
		stringNoteMap.put("Es6", Es6);
		noteStringMap.put(Es6, "Es6");
		stringNoteMap.put("E6", E6);
		noteStringMap.put(E6, "E6");
		stringNoteMap.put("F6", F6);
		noteStringMap.put(F6, "F6");
		stringNoteMap.put("Fis6", Fis6);
		noteStringMap.put(Fis6, "Fis6");
		stringNoteMap.put("Ges6", Ges6);
		noteStringMap.put(Ges6, "Ges6");
		stringNoteMap.put("G6", G6);
		noteStringMap.put(G6, "G6");
		stringNoteMap.put("Gis6", Gis6);
		noteStringMap.put(Gis6, "Gis6");
		stringNoteMap.put("As6", As6);
		noteStringMap.put(As6, "As6");
		stringNoteMap.put("A6", A6);
		noteStringMap.put(A6, "A6");
		stringNoteMap.put("Ais6", Ais6);
		noteStringMap.put(Ais6, "Ais6");
		stringNoteMap.put("Bes6", Bes6);
		noteStringMap.put(Bes6, "Bes6");
		stringNoteMap.put("B6", B6);
		noteStringMap.put(B6, "B6");
		stringNoteMap.put("C7", C7);
		noteStringMap.put(C7, "C7");
		stringNoteMap.put("Cis7", Cis7);
		noteStringMap.put(Cis7, "Cis7");
		stringNoteMap.put("Des7", Des7);
		noteStringMap.put(Des7, "Des7");
		stringNoteMap.put("D7", D7);
		noteStringMap.put(D7, "D7");
		stringNoteMap.put("Dis7", Dis7);
		noteStringMap.put(Dis7, "Dis7");
		stringNoteMap.put("Es7", Es7);
		noteStringMap.put(Es7, "Es7");
		stringNoteMap.put("E7", E7);
		noteStringMap.put(E7, "E7");
		stringNoteMap.put("F7", F7);
		noteStringMap.put(F7, "F7");
		stringNoteMap.put("Fis7", Fis7);
		noteStringMap.put(Fis7, "Fis7");
		stringNoteMap.put("Ges7", Ges7);
		noteStringMap.put(Ges7, "Ges7");
		stringNoteMap.put("G7", G7);
		noteStringMap.put(G7, "G7");
		stringNoteMap.put("Gis7", Gis7);
		noteStringMap.put(Gis7, "Gis7");
		stringNoteMap.put("As7", As7);
		noteStringMap.put(As7, "As7");
		stringNoteMap.put("A7", A7);
		noteStringMap.put(A7, "A7");
		stringNoteMap.put("Ais7", Ais7);
		noteStringMap.put(Ais7, "Ais7");
		stringNoteMap.put("Bes7", Bes7);
		noteStringMap.put(Bes7, "Bes7");
		stringNoteMap.put("B7", B7);
		noteStringMap.put(B7, "B7");
		stringNoteMap.put("C8", C8);
		noteStringMap.put(C8, "C8");
		stringNoteMap.put("Cis8", Cis8);
		noteStringMap.put(Cis8, "Cis8");
		stringNoteMap.put("Des8", Des8);
		noteStringMap.put(Des8, "Des8");
		stringNoteMap.put("D8", D8);
		noteStringMap.put(D8, "D8");
		stringNoteMap.put("Dis8", Dis8);
		noteStringMap.put(Dis8, "Dis8");
		stringNoteMap.put("Es8", Es8);
		noteStringMap.put(Es8, "Es8");
		stringNoteMap.put("E8", E8);
		noteStringMap.put(E8, "E8");
		stringNoteMap.put("F8", F8);
		noteStringMap.put(F8, "F8");
		stringNoteMap.put("Fis8", Fis8);
		noteStringMap.put(Fis8, "Fis8");
		stringNoteMap.put("Ges8", Ges8);
		noteStringMap.put(Ges8, "Ges8");
		stringNoteMap.put("G8", G8);
		noteStringMap.put(G8, "G8");
		stringNoteMap.put("Gis8", Gis8);
		noteStringMap.put(Gis8, "Gis8");
		stringNoteMap.put("As8", As8);
		noteStringMap.put(As8, "As8");
		stringNoteMap.put("A8", A8);
		noteStringMap.put(A8, "A8");
		stringNoteMap.put("Ais8", Ais8);
		noteStringMap.put(Ais8, "Ais8");
		stringNoteMap.put("Bes8", Bes8);
		noteStringMap.put(Bes8, "Bes8");
		stringNoteMap.put("B8", B8);
		noteStringMap.put(B8, "B8");
		stringNoteMap.put("C9", C9);
		noteStringMap.put(C9, "C9");
		stringNoteMap.put("Cis9", Cis9);
		noteStringMap.put(Cis9, "Cis9");
		stringNoteMap.put("Des9", Des9);
		noteStringMap.put(Des9, "Des9");
		stringNoteMap.put("D9", D9);
		noteStringMap.put(D9, "D9");
		stringNoteMap.put("Dis9", Dis9);
		noteStringMap.put(Dis9, "Dis9");
		stringNoteMap.put("Es9", Es9);
		noteStringMap.put(Es9, "Es9");
		stringNoteMap.put("E9", E9);
		noteStringMap.put(E9, "E9");
		stringNoteMap.put("F9", F9);
		noteStringMap.put(F9, "F9");
		stringNoteMap.put("Fis9", Fis9);
		noteStringMap.put(Fis9, "Fis9");
		stringNoteMap.put("Ges9", Ges9);
		noteStringMap.put(Ges9, "Ges9");
		stringNoteMap.put("G9", G9);
		noteStringMap.put(G9, "G9");
		stringNoteMap.put("Gis9", Gis9);
		noteStringMap.put(Gis9, "Gis9");
		stringNoteMap.put("As9", As9);
		noteStringMap.put(As9, "As9");
		stringNoteMap.put("A9", A9);
		noteStringMap.put(A9, "A9");
		stringNoteMap.put("Ais9", Ais9);
		noteStringMap.put(Ais9, "Ais9");
		stringNoteMap.put("Bes9", Bes9);
		noteStringMap.put(Bes9, "Bes9");
		stringNoteMap.put("B9", B9);
		noteStringMap.put(B9, "B9");
	}

	public static int circleOfFifthCW(int note) {
		int octave = note / 12;
		int next = note + 7;
		if (next / 12 > octave) {
			next -= 12; // Move it back down
		}
		return next;
	}

	public static int circleOfFifthCCW(int note) {
		int octave = note / 12;
		int next = note - 7;
		if (next / 12 < octave) {
			next += 12; // Move it back down
		}
		return next;
	}

	// Both inputs must be within [0..11]
	public static int pitchClassDistance(int c1, int c2) {
		return MathUtils.minInt(Math.abs(c1 - c2), 12 - Math.abs(c1 - c2));
	}

	public static int getClosestNoteWithPitchClasses(int absoluteNote,
			int[] pitchClasses) {
		int notePitchClass = absoluteNote % 12;
		int minDistance = 99999;
		int closestPitchClass = 0;
		for (int i = 0; i < pitchClasses.length; i++) {
			int distance = pitchClassDistance(notePitchClass, pitchClasses[i]);
			if (distance < minDistance) {
				minDistance = distance;
				closestPitchClass = pitchClasses[i];
			}
		}
		if (((absoluteNote + minDistance) % 12) == closestPitchClass) {
			return absoluteNote + minDistance;
		} else if (((absoluteNote - minDistance) % 12) == closestPitchClass) {
			return absoluteNote - minDistance;
		} else {
			System.out.println("Error in MusicInfo.getClosestNotewithPitchClasses()");
			return (absoluteNote / 12) * 12 + closestPitchClass;
		}
	}

	public static void main(String[] args) {
		System.out.println(getStringFromNote(circleOfFifthCW(Ges4)));
		// generateConstants();
		// generateStringNoteMapping();
	}


	public static int[] createNormalizedInvertedChord(int[] chordOffsets,
			int chordInversions) {
		int[] copy = chordOffsets.clone();
		for (int i = 0; i < chordInversions; i++) {
			// Inverting the offsets and normalizing so the first element is
			// zero
			int first = copy[0];
			for (int j = 1; j < copy.length; j++) {
				copy[j - 1] = copy[j];
			}
			copy[copy.length - 1] = first + 12;

			first = copy[0];
			for (int j = 0; j < copy.length; j++) {
				copy[j] -= first;
			}
		}
		return copy;
	}

}
