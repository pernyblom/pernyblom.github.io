
var SionPresetCategory = {
    DEFAULT: 0,
    VALSOUND_BASS: 1,
    VALSOUND_BELL: 2,
    VALSOUND_BRASS: 3,
    VALSOUND_GUITAR: 4,
    VALSOUND_LEAD: 5,
    VALSOUND_PERCUS: 6,
    VALSOUND_PIANO: 7,
    VALSOUND_SE: 8,
    VALSOUND_SPECIAL: 9,
    VALSOUND_STRPAD: 10,
    VALSOUND_WIND: 11,
    VALSOUND_WORLD: 12,
    MIDI: 13,
    MIDI_DRUM: 14,
    toString: function(cat) {
        switch (cat) {
            case SionPresetCategory.DEFAULT:
                return "default";
            case SionPresetCategory.VALSOUND_BASS:
                return "valsound.bass";
            case SionPresetCategory.VALSOUND_BELL:
                return "valsound.bell";
            case SionPresetCategory.VALSOUND_BRASS:
                return "valsound.brass";
            case SionPresetCategory.VALSOUND_GUITAR:
                return "valsound.guitar";
            case SionPresetCategory.VALSOUND_LEAD:
                return "valsound.lead";
            case SionPresetCategory.VALSOUND_PERCUS:
                return "valsound.percus";
            case SionPresetCategory.VALSOUND_PIANO:
                return "valsound.piano";
            case SionPresetCategory.VALSOUND_SE:
                return "valsound.se";
            case SionPresetCategory.VALSOUND_SPECIAL:
                return "valsound.special";
            case SionPresetCategory.VALSOUND_STRPAD:
                return "valsound.strpad";
            case SionPresetCategory.VALSOUND_WIND:
                return "valsound.wind";
            case SionPresetCategory.VALSOUND_WORLD:
                return "valsound.world";
            case SionPresetCategory.MIDI:
                return "midi";
            case SionPresetCategory.MIDI_DRUM:
                return "midi.drum";
        }
        return "Unknown " + cat;
    }
};
addPossibleValuesFunction(SionPresetCategory, SionPresetCategory.DEFAULT, SionPresetCategory.MIDI_DRUM);

var SionPresetVoiceDEFAULT = {
    _SINE_WAVE: 0,
    _SAW_WAVE: 1,
    _8BIT_TRIANGLE_WAVE: 2,
    _TRIANGLE_WAVE: 3,
    _SQUARE_WAVE: 4,
    _WHITE_NOISE: 5,
    _93BIT_NOISE: 6,
    _WAVE_TABLE_SAMPLE: 7,
    _MA3_WAVE_SAMPLE: 8,
    _PULSE_WAVE_SAMPLE: 9,
    _RAMP_WAVE_SAMPLE: 10,
    _1_OPERATOR_BASS_DRUM: 11,
    _1_OPERATOR_SNARE_DRUM: 12,
    _1_OPERATOR_CLOSED_HI_HAT: 13,
    _1_OPERATOR_OPENED_HI_HAT: 14,
    _1_OPERATOR_CRASH_SYMBAL: 15,
    _DUAL_SAW: 16,
    _DUAL_SQUARE: 17,
    toString: function(cat) {
        switch (cat) {
            case SionPresetVoiceDEFAULT._SINE_WAVE:
                return "Sine wave";
            case SionPresetVoiceDEFAULT._SAW_WAVE:
                return "Saw wave";
            case SionPresetVoiceDEFAULT._8BIT_TRIANGLE_WAVE:
                return "8bit triangle wave";
            case SionPresetVoiceDEFAULT._TRIANGLE_WAVE:
                return "Triangle wave";
            case SionPresetVoiceDEFAULT._SQUARE_WAVE:
                return "Square wave";
            case SionPresetVoiceDEFAULT._WHITE_NOISE:
                return "White noise";
            case SionPresetVoiceDEFAULT._93BIT_NOISE:
                return "93bit noise";
            case SionPresetVoiceDEFAULT._WAVE_TABLE_SAMPLE:
                return "Wave table sample";
            case SionPresetVoiceDEFAULT._MA3_WAVE_SAMPLE:
                return "MA3 wave sample";
            case SionPresetVoiceDEFAULT._PULSE_WAVE_SAMPLE:
                return "Pulse wave sample";
            case SionPresetVoiceDEFAULT._RAMP_WAVE_SAMPLE:
                return "Ramp wave sample";
            case SionPresetVoiceDEFAULT._1_OPERATOR_BASS_DRUM:
                return "1 operator bass drum";
            case SionPresetVoiceDEFAULT._1_OPERATOR_SNARE_DRUM:
                return "1 operator snare drum";
            case SionPresetVoiceDEFAULT._1_OPERATOR_CLOSED_HI_HAT:
                return "1 operator closed hi-hat";
            case SionPresetVoiceDEFAULT._1_OPERATOR_OPENED_HI_HAT:
                return "1 operator opened hi-hat";
            case SionPresetVoiceDEFAULT._1_OPERATOR_CRASH_SYMBAL:
                return "1 operator crash symbal";
            case SionPresetVoiceDEFAULT._DUAL_SAW:
                return "Dual saw";
            case SionPresetVoiceDEFAULT._DUAL_SQUARE:
                return "Dual square";
        }
        return "Unknown " + cat;
    },
    getMML: function(cat, index) {
        switch (cat) {
            case SionPresetVoiceDEFAULT._SINE_WAVE:
                return "#@" + index + "{0 0 0  0 63 00 00 63 00 00 1 0 01 0 0 0 0 0};";
            case SionPresetVoiceDEFAULT._SAW_WAVE:
                return "#@" + index + "{0 0 0  1 63 00 00 63 00 00 1 0 01 0 0 0 0 0};";
            case SionPresetVoiceDEFAULT._8BIT_TRIANGLE_WAVE:
                return "#@" + index + "{0 0 0  3 63 00 00 63 00 00 1 0 01 0 0 0 0 0};";
            case SionPresetVoiceDEFAULT._TRIANGLE_WAVE:
                return "#@" + index + "{0 0 0  4 63 00 00 63 00 00 1 0 01 0 0 0 0 0};";
            case SionPresetVoiceDEFAULT._SQUARE_WAVE:
                return "#@" + index + "{0 0 0  5 63 00 00 63 00 00 1 0 01 0 0 0 0 0};";
            case SionPresetVoiceDEFAULT._WHITE_NOISE:
                return "#@" + index + "{0 0 0  6 63 00 00 63 00 00 1 0 01 0 0 0 0 0};";
            case SionPresetVoiceDEFAULT._93BIT_NOISE:
                return "#@" + index + "{0 0 0  25 63 00 00 63 00 00 1 0 01 0 0 0 0 0};";
            case SionPresetVoiceDEFAULT._WAVE_TABLE_SAMPLE:
                return "#@" + index + "{0 0 0  7 63 00 00 63 00 00 1 0 01 0 0 0 0 0};";
            case SionPresetVoiceDEFAULT._MA3_WAVE_SAMPLE:
                return "#@" + index + "{0 0 0  33 63 00 00 63 00 00 1 0 01 0 0 0 0 0};";
            case SionPresetVoiceDEFAULT._PULSE_WAVE_SAMPLE:
                return "#@" + index + "{0 0 0  81 63 00 00 63 00 00 1 0 01 0 0 0 0 0};";
            case SionPresetVoiceDEFAULT._RAMP_WAVE_SAMPLE:
                return "#@" + index + "{0 0 0  160 63 00 00 63 00 00 1 0 01 0 0 0 0 0};";
            case SionPresetVoiceDEFAULT._1_OPERATOR_BASS_DRUM:
                return "#@" + index + "{0 0 0  0 63 00 00 28 00 00 1 0 01 0 0 0 0 0};";
            case SionPresetVoiceDEFAULT._1_OPERATOR_SNARE_DRUM:
                return "#@" + index + "{0 0 0  17 63 00 00 32 00 00 1 0 01 0 0 0 0 0};";
            case SionPresetVoiceDEFAULT._1_OPERATOR_CLOSED_HI_HAT:
                return "#@" + index + "{0 0 0  19 63 00 00 40 00 00 1 0 01 0 0 0 0 0};";
            case SionPresetVoiceDEFAULT._1_OPERATOR_OPENED_HI_HAT:
                return "#@" + index + "{0 0 0  19 63 00 00 28 00 00 1 0 01 0 0 0 0 0};";
            case SionPresetVoiceDEFAULT._1_OPERATOR_CRASH_SYMBAL:
                return "#@" + index + "{0 0 0  16 48 00 00 24 00 00 1 0 01 0 0 0 0 0};";
            case SionPresetVoiceDEFAULT._DUAL_SAW:
                return "#AL@" + index + "{0 1 1 0 8   63 0 0 63};";
            case SionPresetVoiceDEFAULT._DUAL_SQUARE:
                return "#AL@" + index + "{0 5 5 0 8   63 0 0 63};";
        }
        return "";
    }
};
addPossibleValuesFunction(SionPresetVoiceDEFAULT, SionPresetVoiceDEFAULT._SINE_WAVE, SionPresetVoiceDEFAULT._DUAL_SQUARE);
var SionPresetVoiceVALSOUND_BASS = {
    _ANALOG_BASS_2_FBSYNTH: 0,
    _ANALOG_BASS: 1,
    _ANALOG_BASS_2_Q2: 2,
    _CHOPPER_BASS_0: 3,
    _CHOPPER_BASS_1: 4,
    _CHOPPER_BASS_2_CUT: 5,
    _CHOPPER_BASS_3: 6,
    _ELEC_CHOPPER_BASS_4: 7,
    _EFFECT_BASS_1: 8,
    _EFFECT_BASS_2_TO_UP: 9,
    _EFFECT_BASS_1: 10,
    _MOHAAA: 11,
    _EFFECT_FB_BASS_5: 12,
    _MAGICAL_BASS: 13,
    _E_BASS_6: 14,
    _E_BASS_7: 15,
    _E_BASS_70: 16,
    _VAL006_BASS_LIKE_EURO: 17,
    _E_BASS_X2: 18,
    _E_BASS_X4: 19,
    _METAL_PICK_BASS_X5: 20,
    _GROOVE_BASS_1: 21,
    _ANALOG_BASS_GROOVE_2: 22,
    _HARMONICS_1: 23,
    _LOW_BASS_X1: 24,
    _LOW_BASS_X2_LITTLE_FB: 25,
    _LOW_BASS_X1_REZZO: 26,
    _LOW_BASS_PICKED: 27,
    _METAL_BASS: 28,
    _E_N_BASS_1: 29,
    _PSG_BASS_1: 30,
    _PSG_BASS_2: 31,
    _REZONANCE_TYPE_BASS_1: 32,
    _SLAP_BASS: 33,
    _SLAP_BASS_1: 34,
    _SLAP_BASS_2_1_: 35,
    _SLAP_BASS_3: 36,
    _SLAP_BASS_PULL: 37,
    _SLAP_BASS_MUTE: 38,
    _SLAP_BASS_PICK: 39,
    _SUPER_BASS_2: 40,
    _SP_BASS3_SOFT: 41,
    _SP_BASS4_SOFT_2: 42,
    _SP_BASS5_ATTACK: 43,
    _SP_BASS6_REZZ_PIPEBASS: 44,
    _SYNTH_BASS_1: 45,
    _SYNTH_BASS_2_MYON: 46,
    _SYNTH_BASS_3_CHO: 47,
    _SYNTH_WIND_BASS_4: 48,
    _SYNTH_BASS_5_Q2: 49,
    _OLD_WOOD_BASS: 50,
    _W_BASS_BRIGHT: 51,
    _W_BASS_X2_BOW: 52,
    _WOOD_BASS_3_MUTED1: 53,
    toString: function(cat) {
        switch (cat) {
            case SionPresetVoiceVALSOUND_BASS._ANALOG_BASS_2_FBSYNTH:
                return "Analog Bass #2+FBsynth";
            case SionPresetVoiceVALSOUND_BASS._ANALOG_BASS:
                return "Analog Bass";
            case SionPresetVoiceVALSOUND_BASS._ANALOG_BASS_2_Q2:
                return "Analog bass #2 (q2)";
            case SionPresetVoiceVALSOUND_BASS._CHOPPER_BASS_0:
                return "Chopper Bass 0";
            case SionPresetVoiceVALSOUND_BASS._CHOPPER_BASS_1:
                return "Chopper Bass 1";
            case SionPresetVoiceVALSOUND_BASS._CHOPPER_BASS_2_CUT:
                return "Chopper bass 2 (CUT)";
            case SionPresetVoiceVALSOUND_BASS._CHOPPER_BASS_3:
                return "Chopper bass 3";
            case SionPresetVoiceVALSOUND_BASS._ELEC_CHOPPER_BASS_4:
                return "Elec.Chopper bass+ 4";
            case SionPresetVoiceVALSOUND_BASS._EFFECT_BASS_1:
                return "Effect Bass 1";
            case SionPresetVoiceVALSOUND_BASS._EFFECT_BASS_2_TO_UP:
                return "Effect Bass 2 to UP";
            case SionPresetVoiceVALSOUND_BASS._EFFECT_BASS_1:
                return "Effect Bass 1";
            case SionPresetVoiceVALSOUND_BASS._MOHAAA:
                return "Mohaaa";
            case SionPresetVoiceVALSOUND_BASS._EFFECT_FB_BASS_5:
                return "Effect FB Bass #5";
            case SionPresetVoiceVALSOUND_BASS._MAGICAL_BASS:
                return "Magical bass";
            case SionPresetVoiceVALSOUND_BASS._E_BASS_6:
                return "E.Bass #6";
            case SionPresetVoiceVALSOUND_BASS._E_BASS_7:
                return "E.Bass #7";
            case SionPresetVoiceVALSOUND_BASS._E_BASS_70:
                return "E.Bass 70";
            case SionPresetVoiceVALSOUND_BASS._VAL006_BASS_LIKE_EURO:
                return "VAL006 Bass like Euro";
            case SionPresetVoiceVALSOUND_BASS._E_BASS_X2:
                return "E.Bass x2";
            case SionPresetVoiceVALSOUND_BASS._E_BASS_X4:
                return "E.Bass x4";
            case SionPresetVoiceVALSOUND_BASS._METAL_PICK_BASS_X5:
                return "Metal pick bass X5";
            case SionPresetVoiceVALSOUND_BASS._GROOVE_BASS_1:
                return "Groove Bass 1";
            case SionPresetVoiceVALSOUND_BASS._ANALOG_BASS_GROOVE_2:
                return "Analog Bass Groove #2";
            case SionPresetVoiceVALSOUND_BASS._HARMONICS_1:
                return "Harmonics #1";
            case SionPresetVoiceVALSOUND_BASS._LOW_BASS_X1:
                return "Low Bass x1";
            case SionPresetVoiceVALSOUND_BASS._LOW_BASS_X2_LITTLE_FB:
                return "Low_bass x2 Little FB";
            case SionPresetVoiceVALSOUND_BASS._LOW_BASS_X1_REZZO:
                return "Low Bass x1 Rezzo.";
            case SionPresetVoiceVALSOUND_BASS._LOW_BASS_PICKED:
                return "Low Bass Picked";
            case SionPresetVoiceVALSOUND_BASS._METAL_BASS:
                return "metal bass";
            case SionPresetVoiceVALSOUND_BASS._E_N_BASS_1:
                return "e.n.bass 1";
            case SionPresetVoiceVALSOUND_BASS._PSG_BASS_1:
                return "psg bass 1";
            case SionPresetVoiceVALSOUND_BASS._PSG_BASS_2:
                return "psg bass 2";
            case SionPresetVoiceVALSOUND_BASS._REZONANCE_TYPE_BASS_1:
                return "rezonance type bass #1";
            case SionPresetVoiceVALSOUND_BASS._SLAP_BASS:
                return "slap bass";
            case SionPresetVoiceVALSOUND_BASS._SLAP_BASS_1:
                return "slap bass 1";
            case SionPresetVoiceVALSOUND_BASS._SLAP_BASS_2_1_:
                return "slap bass 2 (1+)";
            case SionPresetVoiceVALSOUND_BASS._SLAP_BASS_3:
                return "slap bass #3";
            case SionPresetVoiceVALSOUND_BASS._SLAP_BASS_PULL:
                return "slap bass pull";
            case SionPresetVoiceVALSOUND_BASS._SLAP_BASS_MUTE:
                return "slap bass mute";
            case SionPresetVoiceVALSOUND_BASS._SLAP_BASS_PICK:
                return "slap bass pick";
            case SionPresetVoiceVALSOUND_BASS._SUPER_BASS_2:
                return "super bass #2";
            case SionPresetVoiceVALSOUND_BASS._SP_BASS3_SOFT:
                return "sp_bass#3 soft";
            case SionPresetVoiceVALSOUND_BASS._SP_BASS4_SOFT_2:
                return "sp_bass#4 soft*2";
            case SionPresetVoiceVALSOUND_BASS._SP_BASS5_ATTACK:
                return "sp_bass#5 attack";
            case SionPresetVoiceVALSOUND_BASS._SP_BASS6_REZZ_PIPEBASS:
                return "sp.bass#6 rezz+pipebass";
            case SionPresetVoiceVALSOUND_BASS._SYNTH_BASS_1:
                return "synth bass 1";
            case SionPresetVoiceVALSOUND_BASS._SYNTH_BASS_2_MYON:
                return "synth bass 2 myon";
            case SionPresetVoiceVALSOUND_BASS._SYNTH_BASS_3_CHO:
                return "synth bass #3 cho!";
            case SionPresetVoiceVALSOUND_BASS._SYNTH_WIND_BASS_4:
                return "synth-wind-bass #4";
            case SionPresetVoiceVALSOUND_BASS._SYNTH_BASS_5_Q2:
                return "synth bass #5 q2";
            case SionPresetVoiceVALSOUND_BASS._OLD_WOOD_BASS:
                return "old wood bass";
            case SionPresetVoiceVALSOUND_BASS._W_BASS_BRIGHT:
                return "w.bass bright";
            case SionPresetVoiceVALSOUND_BASS._W_BASS_X2_BOW:
                return "w.bass x2 bow";
            case SionPresetVoiceVALSOUND_BASS._WOOD_BASS_3_MUTED1:
                return "wood bass 3 (muted1)";
        }
        return "Unknown " + cat;
    },
    getMML: function(cat, index) {
        switch (cat) {
            case SionPresetVoiceVALSOUND_BASS._ANALOG_BASS_2_FBSYNTH:
                return "#OPN@" + index + "{6 7  31 00 00 12 01 18 0 01 0 0 31 00 01 12 01 04 0 02 0 0 31 00 00 09 00 03 0 01 7 0 31 00 00 09 00 03 0 01 3 0};";
            case SionPresetVoiceVALSOUND_BASS._ANALOG_BASS:
                return "#OPN@" + index + "{5 6  31 00 00 00 00 41 0 01 0 0 20 00 00 10 00 00 0 01 1 0 24 00 00 08 00 00 0 01 2 0 20 00 00 10 00 00 0 01 3 0};";
            case SionPresetVoiceVALSOUND_BASS._ANALOG_BASS_2_Q2:
                return "#OPN@" + index + "{6 4  21 05 00 00 02 35 0 00 0 0 26 10 00 11 01 00 0 01 0 0 27 00 00 11 00 00 0 01 3 0 27 14 00 11 01 00 0 01 7 0};";
            case SionPresetVoiceVALSOUND_BASS._CHOPPER_BASS_0:
                return "#OPN@" + index + "{0 5  28 14 15 15 04 25 0 10 1 0 31 14 10 09 03 34 0 00 2 0 31 14 09 09 02 23 0 00 3 0 31 06 05 11 02 00 0 00 7 0};";
            case SionPresetVoiceVALSOUND_BASS._CHOPPER_BASS_1:
                return "#OPN@" + index + "{0 5  28 14 15 15 04 30 0 14 1 0 31 14 10 09 02 35 0 03 2 0 31 14 09 09 02 25 0 00 3 0 31 06 05 11 01 00 0 00 7 0};";
            case SionPresetVoiceVALSOUND_BASS._CHOPPER_BASS_2_CUT:
                return "#OPN@" + index + "{0 4  31 15 28 05 02 28 0 15 6 0 31 10 15 04 04 41 0 04 6 0 31 08 03 05 01 21 0 00 6 0 31 02 02 05 15 00 0 00 6 0};";
            case SionPresetVoiceVALSOUND_BASS._CHOPPER_BASS_3:
                return "#OPN@" + index + "{0 5  31 18 02 13 09 28 0 13 1 0 31 10 15 04 04 41 0 01 2 0 31 08 03 05 01 21 0 00 3 0 31 02 02 12 15 00 0 00 7 0};";
            case SionPresetVoiceVALSOUND_BASS._ELEC_CHOPPER_BASS_4:
                return "#OPN@" + index + "{0 5  31 18 02 13 09 28 0 13 1 0 31 10 15 04 04 41 0 01 2 0 31 08 03 05 01 21 0 00 3 0 31 02 02 12 15 00 0 01 7 0};";
            case SionPresetVoiceVALSOUND_BASS._EFFECT_BASS_1:
                return "#OPN@" + index + "{4 3  23 05 04 07 02 00 0 01 3 0 30 02 02 08 02 00 0 07 3 0 24 05 04 07 02 00 0 01 7 0 31 02 02 08 02 00 0 10 7 0};";
            case SionPresetVoiceVALSOUND_BASS._EFFECT_BASS_2_TO_UP:
                return "#OPN@" + index + "{4 3  03 06 05 15 02 00 0 01 3 0 07 04 03 15 02 00 0 07 3 0 03 06 05 15 02 00 0 01 7 0 07 04 03 15 02 00 0 10 7 0};";
            case SionPresetVoiceVALSOUND_BASS._EFFECT_BASS_1:
                return "#OPN@" + index + "{4 3  22 05 06 00 00 09 0 01 3 0 19 03 04 07 01 00 0 07 3 0 23 00 00 00 00 19 0 01 7 0 20 02 00 07 01 00 0 01 7 0};";
            case SionPresetVoiceVALSOUND_BASS._MOHAAA:
                return "#OPN@" + index + "{0 5  07 00 00 15 00 21 0 01 0 0 06 00 00 15 00 18 0 02 0 0 08 00 00 15 00 23 0 01 0 0 18 00 00 15 00 00 0 02 0 0};";
            case SionPresetVoiceVALSOUND_BASS._EFFECT_FB_BASS_5:
                return "#OPN@" + index + "{0 7  31 06 02 15 03 20 0 01 3 0 31 06 02 15 06 14 0 02 0 0 06 06 02 15 01 08 0 01 7 0 31 05 01 15 02 00 0 02 0 0};";
            case SionPresetVoiceVALSOUND_BASS._MAGICAL_BASS:
                return "#OPN@" + index + "{0 7  31 08 00 06 10 38 0 01 3 0 28 18 05 06 13 47 0 10 7 0 31 07 07 06 08 23 0 00 2 0 28 09 06 08 01 00 0 00 0 0};";
            case SionPresetVoiceVALSOUND_BASS._E_BASS_6:
                return "#OPN@" + index + "{0 7  31 15 00 10 05 35 0 14 3 0 31 14 07 07 04 41 0 04 7 0 31 14 03 00 02 18 0 00 3 0 31 12 08 08 01 00 0 00 7 0};";
            case SionPresetVoiceVALSOUND_BASS._E_BASS_7:
                return "#OPN@" + index + "{3 7  31 15 00 10 05 29 0 10 7 0 31 13 07 07 04 46 0 04 7 0 31 14 05 00 02 19 0 00 3 0 31 12 04 08 01 00 0 00 0 0};";
            case SionPresetVoiceVALSOUND_BASS._E_BASS_70:
                return "#OPN@" + index + "{2 5  31 08 00 00 03 34 0 00 3 0 31 14 06 09 02 42 0 08 0 0 31 16 03 00 02 20 0 00 7 0 31 12 05 08 02 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_BASS._VAL006_BASS_LIKE_EURO:
                return "#OPN@" + index + "{0 4  31 07 07 11 02 25 0 06 0 0 31 06 06 11 01 55 0 04 7 0 31 09 06 11 01 18 0 00 3 0 31 06 08 11 15 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_BASS._E_BASS_X2:
                return "#OPN@" + index + "{2 7  31 14 08 03 01 33 0 00 1 0 31 17 08 09 05 30 0 14 2 0 31 15 08 05 05 35 0 04 3 0 31 15 08 06 01 00 0 01 7 0};";
            case SionPresetVoiceVALSOUND_BASS._E_BASS_X4:
                return "#OPN@" + index + "{2 7  31 14 03 00 02 33 0 03 3 0 23 16 04 12 03 30 0 10 0 0 31 13 03 11 03 27 0 00 7 0 31 07 05 09 01 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_BASS._METAL_PICK_BASS_X5:
                return "#OPN@" + index + "{3 7  31 14 00 06 13 51 0 13 0 0 31 13 00 06 13 21 0 01 0 0 31 09 00 06 13 23 0 00 0 0 31 09 00 07 13 00 0 00 0 0};";
            case SionPresetVoiceVALSOUND_BASS._GROOVE_BASS_1:
                return "#OPN@" + index + "{5 3  31 00 00 00 00 38 0 00 0 0 21 00 00 13 00 05 0 00 0 0 21 00 00 13 00 03 0 01 0 0 21 00 00 13 00 03 0 01 0 0};";
            case SionPresetVoiceVALSOUND_BASS._ANALOG_BASS_GROOVE_2:
                return "#OPN@" + index + "{6 5  31 00 00 00 00 41 0 02 0 0 31 00 00 10 00 02 0 01 0 0 31 00 00 10 00 01 0 01 7 0 31 00 00 10 00 01 0 01 3 0};";
            case SionPresetVoiceVALSOUND_BASS._HARMONICS_1:
                return "#OPN@" + index + "{6 6  31 12 09 00 02 45 0 02 3 0 31 10 08 06 01 00 0 01 7 0 31 13 08 05 02 00 0 02 7 0 31 16 12 05 10 00 0 00 3 0};";
            case SionPresetVoiceVALSOUND_BASS._LOW_BASS_X1:
                return "#OPN@" + index + "{5 3  31 00 09 15 00 25 0 00 0 0 31 15 06 08 01 00 0 00 1 0 31 15 06 08 01 00 0 01 2 0 31 15 00 07 02 00 0 01 3 0};";
            case SionPresetVoiceVALSOUND_BASS._LOW_BASS_X2_LITTLE_FB:
                return "#OPN@" + index + "{5 6  21 00 09 00 00 24 0 00 0 0 21 15 06 08 01 00 0 00 1 0 21 15 06 08 01 00 0 01 2 0 27 15 00 07 02 00 0 01 3 0};";
            case SionPresetVoiceVALSOUND_BASS._LOW_BASS_X1_REZZO:
                return "#OPN@" + index + "{5 3  31 00 09 15 00 30 0 00 0 0 31 15 06 12 01 02 0 00 1 0 31 15 06 12 01 02 0 01 2 0 31 15 10 12 02 02 0 04 3 0};";
            case SionPresetVoiceVALSOUND_BASS._LOW_BASS_PICKED:
                return "#OPN@" + index + "{5 7  31 05 00 00 11 33 0 00 0 0 30 12 04 09 01 00 0 00 0 0 27 14 08 09 03 00 0 01 0 0 27 14 07 12 15 06 0 05 0 0};";
            case SionPresetVoiceVALSOUND_BASS._METAL_BASS:
                return "#OPN@" + index + "{0 5  20 10 09 15 01 22 0 00 7 0 17 09 00 00 02 22 0 01 7 0 21 09 00 00 01 18 0 00 3 0 18 08 00 08 01 00 0 01 3 0};";
            case SionPresetVoiceVALSOUND_BASS._E_N_BASS_1:
                return "#OPN@" + index + "{3 7  27 14 00 04 04 25 0 07 0 0 31 12 00 04 03 45 0 02 0 0 31 19 00 04 05 15 0 00 0 0 31 12 06 07 01 00 0 00 0 0};";
            case SionPresetVoiceVALSOUND_BASS._PSG_BASS_1:
                return "#OPN@" + index + "{5 7  31 14 00 00 00 22 0 00 0 0 31 14 03 08 05 00 0 01 3 0 31 14 03 08 03 00 0 00 0 0 31 16 03 08 03 00 0 01 7 0};";
            case SionPresetVoiceVALSOUND_BASS._PSG_BASS_2:
                return "#OPN@" + index + "{5 7  31 14 00 00 00 22 0 01 0 0 31 14 03 08 05 00 0 02 3 0 31 14 03 08 03 00 0 00 0 0 31 16 03 08 03 00 0 01 7 0};";
            case SionPresetVoiceVALSOUND_BASS._REZONANCE_TYPE_BASS_1:
                return "#OPN@" + index + "{2 0  24 19 02 13 10 33 0 03 3 0 26 16 05 14 06 28 0 00 0 0 15 14 06 08 05 14 0 00 0 0 31 07 05 09 02 00 0 02 7 0};";
            case SionPresetVoiceVALSOUND_BASS._SLAP_BASS:
                return "#OPN@" + index + "{2 2  31 10 07 08 02 33 0 00 7 0 21 08 08 07 05 23 0 07 7 0 31 05 06 07 01 37 0 00 3 0 31 08 06 07 05 00 0 01 7 0};";
            case SionPresetVoiceVALSOUND_BASS._SLAP_BASS_1:
                return "#OPN@" + index + "{2 7  31 14 07 08 02 33 0 00 7 0 21 15 06 07 04 18 0 06 7 0 31 05 06 07 01 40 0 00 3 0 31 12 07 07 05 00 0 01 3 0};";
            case SionPresetVoiceVALSOUND_BASS._SLAP_BASS_2_1_:
                return "#OPN@" + index + "{2 7  31 14 07 08 02 33 0 00 7 0 21 15 06 07 04 28 0 07 7 0 31 05 06 07 01 40 0 00 3 0 31 12 07 07 05 00 0 01 3 0};";
            case SionPresetVoiceVALSOUND_BASS._SLAP_BASS_3:
                return "#OPN@" + index + "{2 7  31 14 07 00 05 32 0 03 7 0 31 16 01 12 04 35 0 10 0 0 31 11 02 00 03 23 0 00 3 0 31 12 05 07 01 00 0 00 0 0};";
            case SionPresetVoiceVALSOUND_BASS._SLAP_BASS_PULL:
                return "#OPN@" + index + "{2 2  31 10 07 08 02 33 0 00 7 0 21 08 08 09 05 23 0 10 7 0 31 05 06 10 01 37 0 00 3 0 31 16 06 11 01 00 0 01 7 0};";
            case SionPresetVoiceVALSOUND_BASS._SLAP_BASS_MUTE:
                return "#OPN@" + index + "{2 2  31 18 07 11 12 33 0 00 7 0 21 11 08 11 15 23 0 07 7 0 31 15 06 11 11 37 0 00 3 0 31 15 06 13 11 00 0 01 7 0};";
            case SionPresetVoiceVALSOUND_BASS._SLAP_BASS_PICK:
                return "#OPN@" + index + "{2 2  31 10 07 08 02 33 0 00 7 0 21 09 08 07 05 23 0 07 7 0 31 05 06 08 01 37 0 00 3 0 31 11 06 10 05 00 0 01 7 0};";
            case SionPresetVoiceVALSOUND_BASS._SUPER_BASS_2:
                return "#OPN@" + index + "{2 2  24 18 02 13 09 12 0 03 3 0 26 16 05 14 09 24 0 01 0 0 31 12 02 08 03 22 0 00 7 0 31 07 05 09 02 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_BASS._SP_BASS3_SOFT:
                return "#OPN@" + index + "{2 3  24 18 02 13 09 25 0 03 3 0 26 16 05 14 09 24 0 01 0 0 31 12 02 08 03 32 0 00 7 0 31 07 05 09 02 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_BASS._SP_BASS4_SOFT_2:
                return "#OPN@" + index + "{2 1  24 18 02 13 10 28 0 03 3 0 26 16 05 14 06 24 0 00 0 0 31 12 02 08 03 30 0 00 7 0 31 07 05 09 02 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_BASS._SP_BASS5_ATTACK:
                return "#OPN@" + index + "{0 5  19 18 02 15 10 30 0 00 3 0 31 16 05 14 05 24 0 00 0 0 31 12 02 08 03 30 0 00 7 0 31 10 07 09 02 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_BASS._SP_BASS6_REZZ_PIPEBASS:
                return "#OPN@" + index + "{2 3  24 18 02 13 09 35 0 12 3 0 26 16 05 14 09 25 0 02 0 0 31 12 02 08 03 32 0 00 7 0 31 07 05 09 02 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_BASS._SYNTH_BASS_1:
                return "#OPN@" + index + "{4 3  30 00 00 00 00 23 0 01 3 0 27 04 00 07 01 00 0 01 3 0 30 00 00 00 00 18 0 01 7 0 25 04 00 07 01 00 0 01 7 0};";
            case SionPresetVoiceVALSOUND_BASS._SYNTH_BASS_2_MYON:
                return "#OPN@" + index + "{5 7  14 00 09 12 00 26 0 00 0 0 14 15 06 08 01 00 0 00 1 0 20 15 06 08 01 00 0 01 2 0 18 15 00 12 02 00 0 01 3 0};";
            case SionPresetVoiceVALSOUND_BASS._SYNTH_BASS_3_CHO:
                return "#OPN@" + index + "{3 7  31 11 09 00 04 32 0 01 3 0 31 15 07 08 05 41 0 08 7 0 26 18 07 10 06 04 0 00 3 0 31 09 06 07 01 00 0 00 7 0};";
            case SionPresetVoiceVALSOUND_BASS._SYNTH_WIND_BASS_4:
                return "#OPN@" + index + "{2 7  31 13 09 00 04 32 0 00 3 0 31 15 07 08 04 21 0 01 0 0 26 18 07 08 03 21 0 01 7 0 31 09 06 07 01 00 0 00 0 0};";
            case SionPresetVoiceVALSOUND_BASS._SYNTH_BASS_5_Q2:
                return "#OPN@" + index + "{4 4  20 00 00 08 07 17 0 00 3 0 18 07 04 11 00 00 0 01 3 0 18 00 00 09 00 22 0 01 7 0 15 00 00 11 01 00 0 01 7 0};";
            case SionPresetVoiceVALSOUND_BASS._OLD_WOOD_BASS:
                return "#OPN@" + index + "{5 7  31 15 00 13 02 28 0 00 0 0 31 10 01 12 01 04 0 02 0 0 25 10 01 12 01 04 0 01 0 0 31 10 01 12 01 04 0 02 0 0};";
            case SionPresetVoiceVALSOUND_BASS._W_BASS_BRIGHT:
                return "#OPN@" + index + "{2 7  31 13 03 10 02 32 0 00 7 0 31 12 04 10 03 20 0 00 0 0 31 17 00 10 07 15 0 02 3 0 31 06 01 10 05 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_BASS._W_BASS_X2_BOW:
                return "#OPN@" + index + "{4 5  31 11 05 00 03 25 0 00 3 0 31 10 09 08 04 00 0 01 3 0 23 12 05 00 04 14 0 00 7 0 31 12 09 07 05 00 0 02 7 0};";
            case SionPresetVoiceVALSOUND_BASS._WOOD_BASS_3_MUTED1:
                return "#OPN@" + index + "{5 5  31 15 00 15 02 38 0 00 0 0 31 10 01 12 01 04 0 02 0 0 25 10 01 12 01 02 0 01 0 0 31 10 01 12 01 04 0 01 0 0};";
        }
        return "";
    }
};
addPossibleValuesFunction(SionPresetVoiceVALSOUND_BASS, SionPresetVoiceVALSOUND_BASS._ANALOG_BASS_2_FBSYNTH, SionPresetVoiceVALSOUND_BASS._WOOD_BASS_3_MUTED1);
var SionPresetVoiceVALSOUND_BELL = {
    _CALM_BELL: 0,
    _CHINA_BELL_DOUBLE: 1,
    _CHURCH_BELL_2: 2,
    _CHURCH_BELL: 3,
    _GLOCKEN_1: 4,
    _HARP_1: 5,
    _HARP_2: 6,
    _KIRAKIRA: 7,
    _MARIMBA: 8,
    _OLD_BELL: 9,
    _PERCUS_BELL: 10,
    _PRETTY_BELL: 11,
    _SYNTH_BELL_0_FROMOPM: 12,
    _SYNTH_BELL_1_O5: 13,
    _SYNTH_BELL_2: 14,
    _VIBERAPHON_AMS_MODU: 15,
    _TWIN_MARINBA_2_GAMP_C: 16,
    _TWIN_MARINBA_1_GAMP_C: 17,
    toString: function(cat) {
        switch (cat) {
            case SionPresetVoiceVALSOUND_BELL._CALM_BELL:
                return "Calm Bell";
            case SionPresetVoiceVALSOUND_BELL._CHINA_BELL_DOUBLE:
                return "China Bell Double";
            case SionPresetVoiceVALSOUND_BELL._CHURCH_BELL_2:
                return "Church Bell 2";
            case SionPresetVoiceVALSOUND_BELL._CHURCH_BELL:
                return "Church Bell";
            case SionPresetVoiceVALSOUND_BELL._GLOCKEN_1:
                return "Glocken 1";
            case SionPresetVoiceVALSOUND_BELL._HARP_1:
                return "Harp #1";
            case SionPresetVoiceVALSOUND_BELL._HARP_2:
                return "Harp #2";
            case SionPresetVoiceVALSOUND_BELL._KIRAKIRA:
                return "kirakira";
            case SionPresetVoiceVALSOUND_BELL._MARIMBA:
                return "Marimba";
            case SionPresetVoiceVALSOUND_BELL._OLD_BELL:
                return "Old Bell";
            case SionPresetVoiceVALSOUND_BELL._PERCUS_BELL:
                return "Percus. Bell";
            case SionPresetVoiceVALSOUND_BELL._PRETTY_BELL:
                return "Pretty Bell";
            case SionPresetVoiceVALSOUND_BELL._SYNTH_BELL_0_FROMOPM:
                return "Synth Bell #0 (fromOPM)";
            case SionPresetVoiceVALSOUND_BELL._SYNTH_BELL_1_O5:
                return "Synth Bell #1 o5";
            case SionPresetVoiceVALSOUND_BELL._SYNTH_BELL_2:
                return "Synth Bell 2";
            case SionPresetVoiceVALSOUND_BELL._VIBERAPHON_AMS_MODU:
                return "Viberaphon AMS-modu.";
            case SionPresetVoiceVALSOUND_BELL._TWIN_MARINBA_2_GAMP_C:
                return "twin marinba 2 g&amp, c";
            case SionPresetVoiceVALSOUND_BELL._TWIN_MARINBA_1_GAMP_C:
                return "twin marinba 1 g&amp, c";
        }
        return "Unknown " + cat;
    },
    getMML: function(cat, index) {
        switch (cat) {
            case SionPresetVoiceVALSOUND_BELL._CALM_BELL:
                return "#OPN@" + index + "{4 3  31 12 00 10 05 38 0 06 3 0 31 08 04 06 11 04 0 02 3 0 31 12 04 06 02 40 0 06 7 0 31 06 04 06 11 00 0 02 7 0};";
            case SionPresetVoiceVALSOUND_BELL._CHINA_BELL_DOUBLE:
                return "#OPN@" + index + "{4 7  21 15 08 00 03 27 0 08 3 0 31 13 05 06 04 00 0 04 3 0 21 15 08 00 03 25 0 06 7 0 31 13 05 06 04 00 0 03 7 0};";
            case SionPresetVoiceVALSOUND_BELL._CHURCH_BELL_2:
                return "#OPN@" + index + "{4 0  26 03 00 02 15 35 0 04 3 0 31 06 00 03 15 07 0 11 0 0 31 06 00 01 14 41 0 06 7 0 31 07 00 03 15 00 0 11 7 0};";
            case SionPresetVoiceVALSOUND_BELL._CHURCH_BELL:
                return "#OPN@" + index + "{4 0  26 03 00 02 15 35 0 04 3 0 31 06 00 03 15 07 0 11 0 0 31 06 00 01 14 41 0 04 7 0 31 07 00 03 15 00 0 15 7 0};";
            case SionPresetVoiceVALSOUND_BELL._GLOCKEN_1:
                return "#OPN@" + index + "{4 3  31 24 00 12 15 32 0 14 2 0 31 15 00 08 15 00 0 02 0 0 31 20 00 04 15 27 0 15 0 0 31 14 00 05 15 00 0 02 0 0};";
            case SionPresetVoiceVALSOUND_BELL._HARP_1:
                return "#OPN@" + index + "{1 7  31 10 10 06 05 26 0 03 0 0 31 10 10 07 05 50 0 02 0 0 31 13 10 07 13 40 0 02 0 0 31 14 05 07 10 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_BELL._HARP_2:
                return "#OPN@" + index + "{1 3  31 09 00 00 15 40 0 06 3 0 31 11 00 08 15 30 0 01 7 0 31 08 00 00 15 40 0 01 0 0 31 08 00 08 14 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_BELL._KIRAKIRA:
                return "#OPN@" + index + "{1 7  21 11 06 00 12 31 0 06 2 0 21 12 08 00 12 26 0 10 6 0 28 11 07 00 12 32 0 02 0 0 28 04 02 04 05 00 0 02 0 0};";
            case SionPresetVoiceVALSOUND_BELL._MARIMBA:
                return "#OPN@" + index + "{4 6  22 16 07 03 15 36 0 15 3 0 16 10 13 07 10 00 0 01 3 0 19 18 07 03 08 26 0 06 7 0 16 11 12 07 10 03 0 02 7 0};";
            case SionPresetVoiceVALSOUND_BELL._OLD_BELL:
                return "#OPN@" + index + "{4 6  27 04 00 05 14 34 0 03 3 0 31 07 00 06 14 00 0 01 0 0 31 07 00 03 13 41 0 14 7 0 31 08 00 06 14 16 0 04 7 0};";
            case SionPresetVoiceVALSOUND_BELL._PERCUS_BELL:
                return "#OPN@" + index + "{5 3  31 12 00 09 05 38 0 12 0 0 31 15 04 05 11 09 0 03 0 0 31 12 04 08 12 09 0 02 3 0 31 06 04 08 11 09 0 01 7 0};";
            case SionPresetVoiceVALSOUND_BELL._PRETTY_BELL:
                return "#OPN@" + index + "{6 6  31 12 09 00 03 43 0 02 0 0 31 09 08 06 03 00 0 01 3 0 31 13 08 05 03 00 0 04 7 0 31 16 16 05 13 13 0 15 0 0};";
            case SionPresetVoiceVALSOUND_BELL._SYNTH_BELL_0_FROMOPM:
                return "#OPN@" + index + "{6 2  31 05 05 05 02 30 0 07 7 0 31 08 05 07 15 00 0 03 7 0 31 06 07 07 05 00 0 00 3 0 31 08 05 05 02 10 0 01 3 0};";
            case SionPresetVoiceVALSOUND_BELL._SYNTH_BELL_1_O5:
                return "#OPN@" + index + "{6 3  31 05 05 05 02 33 0 08 3 0 27 11 00 06 15 00 0 02 3 0 31 06 07 06 05 00 0 00 7 0 31 11 08 06 03 00 0 01 7 0};";
            case SionPresetVoiceVALSOUND_BELL._SYNTH_BELL_2:
                return "#OPN@" + index + "{6 5  31 08 09 00 05 33 0 07 3 0 31 09 07 08 02 00 0 03 7 0 31 12 07 08 01 00 0 02 3 0 31 09 07 07 01 00 0 01 7 0};";
            case SionPresetVoiceVALSOUND_BELL._VIBERAPHON_AMS_MODU:
                return "#OPN@" + index + "{4 5  24 14 00 07 15 50 0 12 3 0 24 10 00 07 15 00 0 04 7 0 26 14 00 06 15 57 0 04 7 0 26 08 00 06 15 00 0 04 3 0};";
            case SionPresetVoiceVALSOUND_BELL._TWIN_MARINBA_2_GAMP_C:
                return "#OPN@" + index + "{4 5  18 09 05 14 12 33 0 14 3 0 31 16 06 09 07 00 0 04 3 0 18 09 05 14 12 33 0 07 7 0 31 16 06 09 07 00 0 03 7 0};";
            case SionPresetVoiceVALSOUND_BELL._TWIN_MARINBA_1_GAMP_C:
                return "#OPN@" + index + "{4 2  31 10 05 00 12 30 0 08 3 0 31 16 06 09 09 00 0 04 3 0 31 10 05 00 12 30 0 06 7 0 31 16 06 09 09 00 0 03 7 0};";
        }
        return "";
    }
};
addPossibleValuesFunction(SionPresetVoiceVALSOUND_BELL, SionPresetVoiceVALSOUND_BELL._CALM_BELL, SionPresetVoiceVALSOUND_BELL._TWIN_MARINBA_1_GAMP_C);
var SionPresetVoiceVALSOUND_BRASS = {
    _BRASS_STRINGS: 0,
    _E_MUTE_TRAMPET: 1,
    _HORN_2: 2,
    _ALPINE_HORN_3: 3,
    _LEAD_BRASS: 4,
    _NORMAL_HORN: 5,
    _SYNTH_OBOE: 6,
    _OBOE_2: 7,
    _ATTACK_BRASS_Q2: 8,
    _SAX: 9,
    _SOFT_BRASS_LEAD: 10,
    _SYNTH_BRASS_1_OLD: 11,
    _SYNTH_BRASS_2_OLD: 12,
    _SYNTH_BRASS_3: 13,
    _SYNTH_BRASS_4: 14,
    _SYN_BRASS_5_LONG: 15,
    _SYNTH_BRASS_6: 16,
    _TRUMPET: 17,
    _TRUMPET_2: 18,
    _TWIN_HORN_OR_OL25: 19,
    toString: function(cat) {
        switch (cat) {
            case SionPresetVoiceVALSOUND_BRASS._BRASS_STRINGS:
                return "Brass strings";
            case SionPresetVoiceVALSOUND_BRASS._E_MUTE_TRAMPET:
                return "E.mute Trampet";
            case SionPresetVoiceVALSOUND_BRASS._HORN_2:
                return "HORN 2";
            case SionPresetVoiceVALSOUND_BRASS._ALPINE_HORN_3:
                return "Alpine Horn #3";
            case SionPresetVoiceVALSOUND_BRASS._LEAD_BRASS:
                return "Lead brass";
            case SionPresetVoiceVALSOUND_BRASS._NORMAL_HORN:
                return "Normal HORN";
            case SionPresetVoiceVALSOUND_BRASS._SYNTH_OBOE:
                return "Synth Oboe";
            case SionPresetVoiceVALSOUND_BRASS._OBOE_2:
                return "Oboe 2";
            case SionPresetVoiceVALSOUND_BRASS._ATTACK_BRASS_Q2:
                return "Attack Brass (q2)";
            case SionPresetVoiceVALSOUND_BRASS._SAX:
                return "SAX";
            case SionPresetVoiceVALSOUND_BRASS._SOFT_BRASS_LEAD:
                return "Soft brass(lead)";
            case SionPresetVoiceVALSOUND_BRASS._SYNTH_BRASS_1_OLD:
                return "Synth Brass 1 OLD";
            case SionPresetVoiceVALSOUND_BRASS._SYNTH_BRASS_2_OLD:
                return "Synth Brass 2 OLD";
            case SionPresetVoiceVALSOUND_BRASS._SYNTH_BRASS_3:
                return "Synth Brass 3";
            case SionPresetVoiceVALSOUND_BRASS._SYNTH_BRASS_4:
                return "Synth Brass #4";
            case SionPresetVoiceVALSOUND_BRASS._SYN_BRASS_5_LONG:
                return "Syn.Brass 5(long)";
            case SionPresetVoiceVALSOUND_BRASS._SYNTH_BRASS_6:
                return "Synth Brass 6";
            case SionPresetVoiceVALSOUND_BRASS._TRUMPET:
                return "Trumpet";
            case SionPresetVoiceVALSOUND_BRASS._TRUMPET_2:
                return "Trumpet 2";
            case SionPresetVoiceVALSOUND_BRASS._TWIN_HORN_OR_OL25:
                return "Twin Horn (or OL=25)";
        }
        return "Unknown " + cat;
    },
    getMML: function(cat, index) {
        switch (cat) {
            case SionPresetVoiceVALSOUND_BRASS._BRASS_STRINGS:
                return "#OPN@" + index + "{5 7  20 00 00 00 00 27 0 01 0 0 15 03 00 06 01 05 0 02 1 0 14 04 00 06 01 05 0 01 2 0 15 04 00 06 01 05 0 01 3 0};";
            case SionPresetVoiceVALSOUND_BRASS._E_MUTE_TRAMPET:
                return "#OPN@" + index + "{2 7  13 06 00 08 01 26 0 02 3 0 15 08 00 08 01 32 0 02 7 0 21 15 00 08 11 20 0 02 3 0 18 04 00 08 02 00 0 08 0 0};";
            case SionPresetVoiceVALSOUND_BRASS._HORN_2:
                return "#OPN@" + index + "{4 7  15 11 02 00 02 23 0 02 3 0 13 12 02 15 02 00 0 02 3 0 15 13 05 00 01 27 0 02 7 0 13 11 02 15 02 00 0 02 7 0};";
            case SionPresetVoiceVALSOUND_BRASS._ALPINE_HORN_3:
                return "#OPN@" + index + "{5 7  15 10 00 06 05 35 0 01 0 0 15 05 00 08 02 06 0 02 2 0 15 05 00 08 02 06 0 01 5 0 15 05 00 08 02 06 0 01 0 0};";
            case SionPresetVoiceVALSOUND_BRASS._LEAD_BRASS:
                return "#OPN@" + index + "{2 7  18 04 02 08 01 27 0 02 3 0 14 14 00 08 05 33 0 08 0 0 20 00 02 08 00 36 0 02 7 0 17 04 01 08 03 00 0 02 0 0};";
            case SionPresetVoiceVALSOUND_BRASS._NORMAL_HORN:
                return "#OPN@" + index + "{4 7  15 13 02 15 01 36 0 02 3 0 13 12 02 15 03 00 0 02 3 0 15 13 05 15 02 25 0 02 7 0 13 11 02 15 03 00 0 02 7 0};";
            case SionPresetVoiceVALSOUND_BRASS._SYNTH_OBOE:
                return "#OPN@" + index + "{6 3  17 15 15 03 15 15 0 01 7 0 16 00 09 00 00 00 0 06 3 0 21 15 11 01 04 04 0 04 3 0 18 15 11 01 04 04 0 06 7 0};";
            case SionPresetVoiceVALSOUND_BRASS._OBOE_2:
                return "#OPN@" + index + "{2 5  19 18 00 09 02 23 0 01 0 0 31 17 00 06 03 28 0 06 0 0 31 20 00 05 01 51 0 08 0 0 16 31 00 11 00 00 0 04 0 0};";
            case SionPresetVoiceVALSOUND_BRASS._ATTACK_BRASS_Q2:
                return "#OPN@" + index + "{4 4  15 09 08 08 02 14 0 04 7 0 18 15 01 08 03 00 0 04 3 0 16 09 08 08 02 12 0 02 3 0 31 15 01 08 03 00 0 02 7 0};";
            case SionPresetVoiceVALSOUND_BRASS._SAX:
                return "#OPN@" + index + "{2 6  13 06 00 08 01 14 0 02 3 0 15 08 00 08 01 30 0 10 7 0 21 07 00 08 02 35 0 01 3 0 18 04 00 09 02 00 0 02 0 0};";
            case SionPresetVoiceVALSOUND_BRASS._SOFT_BRASS_LEAD:
                return "#OPN@" + index + "{4 7  16 03 00 02 01 30 0 01 5 0 18 00 00 07 00 03 0 04 0 0 16 00 00 02 02 35 0 01 1 0 18 05 00 07 01 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_BRASS._SYNTH_BRASS_1_OLD:
                return "#OPN@" + index + "{5 7  31 07 05 10 02 28 0 01 0 0 31 02 05 10 02 00 0 00 0 0 31 02 05 10 02 02 0 01 0 0 31 10 05 10 10 00 0 02 0 0};";
            case SionPresetVoiceVALSOUND_BRASS._SYNTH_BRASS_2_OLD:
                return "#OPN@" + index + "{5 7  31 10 01 10 02 28 0 02 0 0 31 12 01 10 02 02 0 01 0 0 31 12 01 10 02 04 0 02 0 0 31 12 01 10 10 03 0 04 0 0};";
            case SionPresetVoiceVALSOUND_BRASS._SYNTH_BRASS_3:
                return "#OPN@" + index + "{4 7  15 09 00 09 02 22 0 02 7 0 23 04 02 09 05 00 0 02 7 0 14 10 00 09 02 20 0 02 3 0 20 04 00 09 02 00 0 02 3 0};";
            case SionPresetVoiceVALSOUND_BRASS._SYNTH_BRASS_4:
                return "#OPN@" + index + "{5 7  20 00 00 00 00 22 0 04 0 0 18 12 00 08 01 00 0 08 0 0 20 12 00 08 01 00 0 04 6 0 22 12 00 08 01 00 0 04 2 0};";
            case SionPresetVoiceVALSOUND_BRASS._SYN_BRASS_5_LONG:
                return "#OPN@" + index + "{4 7  29 02 02 00 03 28 0 02 7 0 29 00 02 08 05 04 0 04 7 0 21 02 02 00 02 32 0 01 3 0 29 00 02 08 05 04 0 02 3 0};";
            case SionPresetVoiceVALSOUND_BRASS._SYNTH_BRASS_6:
                return "#OPN@" + index + "{2 7  30 08 08 05 03 25 0 01 1 0 25 10 08 06 04 30 0 02 1 0 20 10 05 06 03 40 0 01 5 0 20 05 05 07 05 00 0 01 3 0};";
            case SionPresetVoiceVALSOUND_BRASS._TRUMPET:
                return "#OPN@" + index + "{2 7  13 06 00 08 01 25 0 02 3 0 15 08 00 08 01 32 0 06 7 0 21 07 00 08 02 42 0 02 3 0 18 04 00 08 02 00 0 02 0 0};";
            case SionPresetVoiceVALSOUND_BRASS._TRUMPET_2:
                return "#OPN@" + index + "{2 6  13 06 00 08 01 14 0 02 3 0 15 08 00 08 01 30 0 12 7 0 21 07 00 08 02 38 0 02 3 0 18 04 00 08 02 00 0 02 0 0};";
            case SionPresetVoiceVALSOUND_BRASS._TWIN_HORN_OR_OL25:
                return "#OPN@" + index + "{4 6  14 06 00 11 03 32 0 04 3 0 16 08 00 09 02 00 0 04 3 0 14 06 00 11 03 33 0 03 7 0 16 08 00 09 02 00 0 03 7 0};";
        }
        return "";
    }
};
addPossibleValuesFunction(SionPresetVoiceVALSOUND_BRASS, SionPresetVoiceVALSOUND_BRASS._BRASS_STRINGS, SionPresetVoiceVALSOUND_BRASS._TWIN_HORN_OR_OL25);
var SionPresetVoiceVALSOUND_GUITAR = {
    _GUITAR_VELOLOW: 0,
    _GUITAR_VELOHIGH: 1,
    _A_GUITAR_3: 2,
    _CUTTING_E_GUITAR: 3,
    _DIS_SYNTH_OLD: 4,
    _DRA_SPI_DIS_G: 5,
    _DIS_GUITAR_3: 6,
    _DIS_GUITAR_3: 7,
    _FEED_BACK_GUITAR_1: 8,
    _HARD_DIS_GUITAR_1: 9,
    _HARD_DIS_GUITAR_3: 10,
    _DIS_GUITAR_94_HARD: 11,
    _NEW_DIS_GUITAR_1: 12,
    _NEW_DIS_GUITAR_2: 13,
    _NEW_DIS_GUITAR_3: 14,
    _OVERDRIVE_G__AL013: 15,
    _METAL: 16,
    _SOFT_DIS_GUITAR: 17,
    toString: function(cat) {
        switch (cat) {
            case SionPresetVoiceVALSOUND_GUITAR._GUITAR_VELOLOW:
                return "Guitar VeloLow";
            case SionPresetVoiceVALSOUND_GUITAR._GUITAR_VELOHIGH:
                return "Guitar VeloHigh";
            case SionPresetVoiceVALSOUND_GUITAR._A_GUITAR_3:
                return "A.Guitar #3";
            case SionPresetVoiceVALSOUND_GUITAR._CUTTING_E_GUITAR:
                return "Cutting E.Guitar";
            case SionPresetVoiceVALSOUND_GUITAR._DIS_SYNTH_OLD:
                return "Dis. Synth (old)";
            case SionPresetVoiceVALSOUND_GUITAR._DRA_SPI_DIS_G:
                return "Dra-spi-Dis.G.";
            case SionPresetVoiceVALSOUND_GUITAR._DIS_GUITAR_3:
                return "Dis.Guitar 3-";
            case SionPresetVoiceVALSOUND_GUITAR._DIS_GUITAR_3:
                return "Dis.Guitar 3+";
            case SionPresetVoiceVALSOUND_GUITAR._FEED_BACK_GUITAR_1:
                return "Feed-back Guitar 1";
            case SionPresetVoiceVALSOUND_GUITAR._HARD_DIS_GUITAR_1:
                return "Hard Dis. Guitar 1";
            case SionPresetVoiceVALSOUND_GUITAR._HARD_DIS_GUITAR_3:
                return "Hard Dis.Guitar 3";
            case SionPresetVoiceVALSOUND_GUITAR._DIS_GUITAR_94_HARD:
                return "Dis.Guitar '94 Hard";
            case SionPresetVoiceVALSOUND_GUITAR._NEW_DIS_GUITAR_1:
                return "New Dis.Guitar 1";
            case SionPresetVoiceVALSOUND_GUITAR._NEW_DIS_GUITAR_2:
                return "New Dis.Guitar 2";
            case SionPresetVoiceVALSOUND_GUITAR._NEW_DIS_GUITAR_3:
                return "New Dis.Guitar 3";
            case SionPresetVoiceVALSOUND_GUITAR._OVERDRIVE_G__AL013:
                return "Overdrive.G. (AL=013)";
            case SionPresetVoiceVALSOUND_GUITAR._METAL:
                return "METAL";
            case SionPresetVoiceVALSOUND_GUITAR._SOFT_DIS_GUITAR:
                return "Soft Dis.Guitar";
        }
        return "Unknown " + cat;
    },
    getMML: function(cat, index) {
        switch (cat) {
            case SionPresetVoiceVALSOUND_GUITAR._GUITAR_VELOLOW:
                return "#OPN@" + index + "{1 3  31 11 06 00 02 45 0 07 0 0 31 07 05 00 05 35 0 02 0 0 31 07 06 00 05 40 0 01 0 0 31 13 05 05 01 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_GUITAR._GUITAR_VELOHIGH:
                return "#OPN@" + index + "{1 4  31 11 06 00 02 43 0 09 0 0 31 07 05 00 05 35 0 02 0 0 31 07 06 00 05 35 0 01 0 0 31 13 06 05 01 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_GUITAR._A_GUITAR_3:
                return "#OPN@" + index + "{1 7  31 10 08 04 02 34 0 13 0 0 31 09 07 04 02 36 0 02 0 0 31 09 08 04 02 38 0 01 0 0 31 04 02 08 02 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_GUITAR._CUTTING_E_GUITAR:
                return "#OPN@" + index + "{3 5  21 07 01 00 01 18 0 04 0 0 24 00 04 09 01 15 0 06 0 0 22 20 02 07 13 05 0 02 3 0 31 12 00 06 01 00 0 02 7 0};";
            case SionPresetVoiceVALSOUND_GUITAR._DIS_SYNTH_OLD:
                return "#OPN@" + index + "{5 7  31 00 00 12 01 18 0 01 0 0 31 00 01 12 01 04 0 02 0 0 31 00 01 12 01 04 0 00 0 0 31 00 01 12 01 04 0 02 0 0};";
            case SionPresetVoiceVALSOUND_GUITAR._DRA_SPI_DIS_G:
                return "#OPN@" + index + "{0 7  16 15 01 03 03 26 0 03 3 0 19 31 01 03 00 27 0 01 0 0 26 31 01 03 00 26 0 01 5 0 27 31 01 08 00 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_GUITAR._DIS_GUITAR_3:
                return "#OPN@" + index + "{1 7  31 15 01 03 03 30 0 03 3 0 31 00 01 10 01 25 0 01 0 0 31 00 01 10 01 22 0 01 5 0 31 13 01 07 01 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_GUITAR._DIS_GUITAR_3:
                return "#OPN@" + index + "{0 5  31 04 00 00 01 08 0 03 0 0 18 01 00 08 00 25 0 15 0 0 31 04 00 00 01 23 0 07 7 0 31 12 00 09 00 00 0 01 1 0};";
            case SionPresetVoiceVALSOUND_GUITAR._FEED_BACK_GUITAR_1:
                return "#OPN@" + index + "{3 7  31 13 00 02 02 26 0 06 3 0 18 07 04 10 05 24 0 03 3 0 31 00 00 08 00 22 0 04 0 0 31 00 00 07 01 00 0 02 7 0};";
            case SionPresetVoiceVALSOUND_GUITAR._HARD_DIS_GUITAR_1:
                return "#OPN@" + index + "{0 5  31 04 04 06 01 08 0 03 0 0 18 01 04 00 01 27 0 12 0 0 31 04 04 00 01 22 0 02 3 0 31 12 00 08 01 00 0 02 7 0};";
            case SionPresetVoiceVALSOUND_GUITAR._HARD_DIS_GUITAR_3:
                return "#OPN@" + index + "{0 5  31 04 01 00 00 11 0 03 0 0 18 01 04 07 00 23 0 15 0 0 31 04 02 00 00 24 0 05 1 0 31 12 00 07 01 00 0 01 7 0};";
            case SionPresetVoiceVALSOUND_GUITAR._DIS_GUITAR_94_HARD:
                return "#OPN@" + index + "{0 7  31 00 00 11 00 21 0 09 7 0 31 15 00 10 01 26 0 02 3 0 31 05 00 08 01 25 0 01 3 0 31 00 00 07 00 04 0 02 7 0};";
            case SionPresetVoiceVALSOUND_GUITAR._NEW_DIS_GUITAR_1:
                return "#OPN@" + index + "{0 5  31 05 00 00 00 20 0 02 3 0 18 05 04 07 01 20 0 05 3 0 31 06 05 00 00 22 0 01 7 0 31 12 00 08 01 00 0 01 7 0};";
            case SionPresetVoiceVALSOUND_GUITAR._NEW_DIS_GUITAR_2:
                return "#OPN@" + index + "{0 5  31 05 00 00 00 20 0 03 3 0 18 05 04 07 01 20 0 07 3 0 31 06 05 00 00 22 0 01 7 0 31 12 00 08 01 00 0 01 7 0};";
            case SionPresetVoiceVALSOUND_GUITAR._NEW_DIS_GUITAR_3:
                return "#OPN@" + index + "{3 5  31 05 00 00 10 08 0 03 0 0 31 01 00 08 00 20 0 15 0 0 31 04 00 15 00 22 0 01 3 0 31 12 00 08 01 00 0 01 7 0};";
            case SionPresetVoiceVALSOUND_GUITAR._OVERDRIVE_G__AL013:
                return "#OPN@" + index + "{1 7  31 05 00 00 01 30 0 03 0 0 18 05 00 08 01 21 0 02 2 0 31 05 04 00 01 29 0 01 6 0 31 11 00 08 01 00 0 01 2 0};";
            case SionPresetVoiceVALSOUND_GUITAR._METAL:
                return "#OPN@" + index + "{3 7  26 16 07 04 08 24 0 08 7 0 22 15 06 04 09 22 0 12 2 0 26 09 02 07 08 43 0 03 0 0 30 08 02 08 08 00 0 04 0 0};";
            case SionPresetVoiceVALSOUND_GUITAR._SOFT_DIS_GUITAR:
                return "#OPN@" + index + "{0 7  16 15 01 09 03 26 0 06 3 0 19 15 01 00 00 27 0 03 0 0 26 15 02 00 02 26 0 01 5 0 21 31 00 07 00 00 0 01 0 0};";
        }
        return "";
    }
};
addPossibleValuesFunction(SionPresetVoiceVALSOUND_GUITAR, SionPresetVoiceVALSOUND_GUITAR._GUITAR_VELOLOW, SionPresetVoiceVALSOUND_GUITAR._SOFT_DIS_GUITAR);
var SionPresetVoiceVALSOUND_LEAD = {
    _ACO_CODE: 0,
    _ANALOG_SYNTHE_1: 1,
    _BOSCO_LEAD: 2,
    _COSMO_LEAD: 3,
    _COSMO_LEAD_2: 4,
    _DIGITAL_LEAD_1: 5,
    _DOUBLE_SIN_WAVE: 6,
    _E_ORGAN_2_BRIGHT: 7,
    _E_ORGAN_2_VOICE: 8,
    _E_ORGAN_4_CLICK: 9,
    _E_ORGAN_5_CLICK: 10,
    _E_ORGAN_6: 11,
    _E_ORGAN_7_CHURCH: 12,
    _METAL_LEAD: 13,
    _METAL_LEAD_3: 14,
    _MONO_LEAD: 15,
    _PSG_LIKE_PC88_LONG: 16,
    _PSG_CUT_1: 17,
    _ATTACK_SYNTH: 18,
    _SIN_WAVE: 19,
    _SYNTH_AMP__BELL_2: 20,
    _CHORUS_2_VOICE_BELL: 21,
    _SYNTH_CUT_8_4: 22,
    _SYNTH_LONG_8_4: 23,
    _ACO_CODE_2: 24,
    _ACO_CODE_3: 25,
    _SYNTH_FB_LONG_4: 26,
    _SYNTH_FB_LONG_5: 27,
    _SYNTH_LEAD_0: 28,
    _SYNTH_LEAD_1: 29,
    _SYNTH_LEAD_2: 30,
    _SYNTH_LEAD_3: 31,
    _SYNTH_LEAD_4: 32,
    _SYNTH_LEAD_5: 33,
    _SYNTH_LEAD_6: 34,
    _SYNTH_LEAD_7_SOFT_FB: 35,
    _SYNTH_PSG: 36,
    _SYNTH_PSG_2: 37,
    _SYNTH_PSG_3: 38,
    _SYNTH_PSG_4: 39,
    _SYNTH_PSG_5: 40,
    _SIN_WATER_SYNTH: 41,
    toString: function(cat) {
        switch (cat) {
            case SionPresetVoiceVALSOUND_LEAD._ACO_CODE:
                return "Aco code";
            case SionPresetVoiceVALSOUND_LEAD._ANALOG_SYNTHE_1:
                return "Analog synthe 1";
            case SionPresetVoiceVALSOUND_LEAD._BOSCO_LEAD:
                return "Bosco-lead";
            case SionPresetVoiceVALSOUND_LEAD._COSMO_LEAD:
                return "Cosmo Lead";
            case SionPresetVoiceVALSOUND_LEAD._COSMO_LEAD_2:
                return "Cosmo Lead 2";
            case SionPresetVoiceVALSOUND_LEAD._DIGITAL_LEAD_1:
                return "Digital lead #1";
            case SionPresetVoiceVALSOUND_LEAD._DOUBLE_SIN_WAVE:
                return "Double sin wave";
            case SionPresetVoiceVALSOUND_LEAD._E_ORGAN_2_BRIGHT:
                return "E.Organ 2 bright";
            case SionPresetVoiceVALSOUND_LEAD._E_ORGAN_2_VOICE:
                return "E.Organ 2 (voice)";
            case SionPresetVoiceVALSOUND_LEAD._E_ORGAN_4_CLICK:
                return "E.Organ 4 Click";
            case SionPresetVoiceVALSOUND_LEAD._E_ORGAN_5_CLICK:
                return "E.Organ 5 Click";
            case SionPresetVoiceVALSOUND_LEAD._E_ORGAN_6:
                return "E.Organ 6";
            case SionPresetVoiceVALSOUND_LEAD._E_ORGAN_7_CHURCH:
                return "E.Organ 7 Church";
            case SionPresetVoiceVALSOUND_LEAD._METAL_LEAD:
                return "Metal Lead";
            case SionPresetVoiceVALSOUND_LEAD._METAL_LEAD_3:
                return "Metal Lead 3";
            case SionPresetVoiceVALSOUND_LEAD._MONO_LEAD:
                return "MONO Lead";
            case SionPresetVoiceVALSOUND_LEAD._PSG_LIKE_PC88_LONG:
                return "PSG like PC88 (long)";
            case SionPresetVoiceVALSOUND_LEAD._PSG_CUT_1:
                return "PSG Cut 1";
            case SionPresetVoiceVALSOUND_LEAD._ATTACK_SYNTH:
                return "Attack Synth";
            case SionPresetVoiceVALSOUND_LEAD._SIN_WAVE:
                return "Sin wave";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_AMP__BELL_2:
                return "Synth &amp,  Bell 2";
            case SionPresetVoiceVALSOUND_LEAD._CHORUS_2_VOICE_BELL:
                return "Chorus #2(Voice)+bell";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_CUT_8_4:
                return "Synth Cut 8-4";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_LONG_8_4:
                return "Synth long 8-4";
            case SionPresetVoiceVALSOUND_LEAD._ACO_CODE_2:
                return "ACO_Code #2";
            case SionPresetVoiceVALSOUND_LEAD._ACO_CODE_3:
                return "ACO_Code #3";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_FB_LONG_4:
                return "Synth FB long 4";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_FB_LONG_5:
                return "Synth FB long 5";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_LEAD_0:
                return "Synth Lead 0";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_LEAD_1:
                return "Synth Lead 1";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_LEAD_2:
                return "Synth Lead 2";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_LEAD_3:
                return "Synth Lead 3";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_LEAD_4:
                return "Synth Lead 4";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_LEAD_5:
                return "Synth Lead 5";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_LEAD_6:
                return "Synth Lead 6";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_LEAD_7_SOFT_FB:
                return "Synth Lead 7 (Soft FB)";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_PSG:
                return "Synth PSG";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_PSG_2:
                return "Synth PSG 2";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_PSG_3:
                return "Synth PSG 3";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_PSG_4:
                return "Synth PSG 4";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_PSG_5:
                return "Synth PSG 5";
            case SionPresetVoiceVALSOUND_LEAD._SIN_WATER_SYNTH:
                return "Sin water synth";
        }
        return "Unknown " + cat;
    },
    getMML: function(cat, index) {
        switch (cat) {
            case SionPresetVoiceVALSOUND_LEAD._ACO_CODE:
                return "#OPN@" + index + "{4 4  15 00 00 12 00 28 0 08 3 0 17 06 01 12 01 00 0 08 3 0 15 00 00 12 00 21 0 04 7 0 17 06 01 12 01 00 0 04 7 0};";
            case SionPresetVoiceVALSOUND_LEAD._ANALOG_SYNTHE_1:
                return "#OPN@" + index + "{1 6  31 10 00 08 05 18 0 10 0 0 31 05 01 08 02 30 0 02 0 0 31 05 01 08 02 50 0 08 0 0 31 05 01 08 02 00 0 02 0 0};";
            case SionPresetVoiceVALSOUND_LEAD._BOSCO_LEAD:
                return "#OPN@" + index + "{6 5  28 02 02 06 00 20 0 05 7 0 10 04 04 06 00 10 0 02 3 0 15 02 02 06 00 00 0 03 7 0 15 04 04 06 00 00 0 01 3 0};";
            case SionPresetVoiceVALSOUND_LEAD._COSMO_LEAD:
                return "#OPN@" + index + "{3 7  31 00 00 00 00 25 0 00 3 0 15 00 00 01 00 25 0 01 7 0 22 00 00 01 00 23 0 01 7 0 18 00 00 06 00 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_LEAD._COSMO_LEAD_2:
                return "#OPN@" + index + "{3 7  31 00 00 00 00 33 0 00 3 0 15 00 00 01 00 30 0 01 7 0 22 00 00 01 00 28 0 00 7 0 18 00 00 06 00 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_LEAD._DIGITAL_LEAD_1:
                return "#OPN@" + index + "{2 7  31 00 00 00 00 26 0 01 0 0 31 00 00 00 00 37 0 02 3 0 31 00 00 00 00 27 0 02 7 0 31 12 00 15 01 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_LEAD._DOUBLE_SIN_WAVE:
                return "#OPN@" + index + "{7 4  18 04 00 10 01 00 0 01 3 0 18 04 00 07 01 00 0 04 3 0 17 04 00 10 01 00 0 01 7 0 14 04 00 07 01 00 0 04 7 0};";
            case SionPresetVoiceVALSOUND_LEAD._E_ORGAN_2_BRIGHT:
                return "#OPN@" + index + "{6 7  31 00 00 09 00 33 0 05 7 0 31 13 00 09 01 00 0 03 3 0 31 00 00 09 00 03 0 02 3 0 31 00 00 09 00 00 0 01 7 0};";
            case SionPresetVoiceVALSOUND_LEAD._E_ORGAN_2_VOICE:
                return "#OPN@" + index + "{6 3  31 15 00 15 03 35 0 07 7 0 31 00 00 09 00 00 0 03 3 0 31 15 03 11 01 04 0 01 3 0 31 15 00 11 01 04 0 02 7 0};";
            case SionPresetVoiceVALSOUND_LEAD._E_ORGAN_4_CLICK:
                return "#OPN@" + index + "{6 3  31 00 00 04 01 33 0 02 0 0 31 00 00 10 01 00 0 01 3 0 31 12 00 10 01 00 0 04 7 0 31 16 00 12 06 00 0 08 3 0};";
            case SionPresetVoiceVALSOUND_LEAD._E_ORGAN_5_CLICK:
                return "#OPN@" + index + "{6 2  31 00 00 04 01 35 0 02 0 0 31 00 00 10 01 00 0 02 3 0 31 12 00 10 01 00 0 04 7 0 28 16 00 14 08 00 0 08 3 0};";
            case SionPresetVoiceVALSOUND_LEAD._E_ORGAN_6:
                return "#OPN@" + index + "{6 7  31 15 00 00 01 33 0 07 7 0 31 10 00 09 01 00 0 04 3 0 31 00 00 09 00 03 0 01 3 0 31 00 00 09 00 00 0 02 7 0};";
            case SionPresetVoiceVALSOUND_LEAD._E_ORGAN_7_CHURCH:
                return "#OPN@" + index + "{6 7  31 00 00 09 00 33 0 04 7 0 31 00 00 09 00 00 0 04 3 0 31 00 00 09 00 00 0 02 3 0 31 00 00 09 00 00 0 01 7 0};";
            case SionPresetVoiceVALSOUND_LEAD._METAL_LEAD:
                return "#OPN@" + index + "{0 7  25 05 00 15 04 22 0 02 3 0 21 02 00 12 03 26 0 07 0 0 18 07 05 08 04 27 0 06 7 0 21 05 03 08 02 00 0 04 0 0};";
            case SionPresetVoiceVALSOUND_LEAD._METAL_LEAD_3:
                return "#OPN@" + index + "{2 7  31 10 00 00 01 25 0 04 3 0 31 05 00 04 15 25 0 00 3 0 31 09 00 06 10 37 0 04 7 0 31 00 00 09 00 00 0 02 7 0};";
            case SionPresetVoiceVALSOUND_LEAD._MONO_LEAD:
                return "#OPN@" + index + "{3 7  24 11 01 00 08 42 0 04 2 0 24 09 01 00 05 19 0 04 6 0 23 09 02 00 10 25 0 08 1 0 23 05 03 11 08 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_LEAD._PSG_LIKE_PC88_LONG:
                return "#OPN@" + index + "{1 7  31 00 00 15 00 27 0 02 0 0 31 00 00 15 00 50 0 01 0 0 31 00 00 15 00 40 0 02 0 0 31 00 00 15 00 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_LEAD._PSG_CUT_1:
                return "#OPN@" + index + "{5 7  31 00 00 00 00 30 0 02 0 0 31 15 00 15 03 00 0 01 0 0 31 15 00 15 03 00 0 01 0 0 31 15 00 15 03 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_LEAD._ATTACK_SYNTH:
                return "#OPN@" + index + "{0 7  31 15 01 00 01 40 0 08 0 0 31 15 01 00 01 20 0 04 0 0 31 15 01 00 01 37 0 01 0 0 31 15 01 08 03 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_LEAD._SIN_WAVE:
                return "#OPN@" + index + "{6 2  31 00 00 15 00 43 0 00 0 0 31 00 00 15 00 00 0 00 0 0 31 00 00 15 00 00 0 00 0 0 31 00 00 15 00 00 0 00 0 0};";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_AMP__BELL_2:
                return "#OPN@" + index + "{4 7  21 00 01 11 00 29 0 02 3 0 14 08 00 13 01 08 0 04 3 0 31 11 00 00 02 35 0 14 3 0 31 08 05 10 15 00 0 04 7 0};";
            case SionPresetVoiceVALSOUND_LEAD._CHORUS_2_VOICE_BELL:
                return "#OPN@" + index + "{4 7  21 00 01 11 00 35 0 02 3 0 14 08 00 13 01 00 0 02 3 0 31 12 00 00 02 44 0 14 3 0 31 09 05 10 15 00 0 08 7 0};";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_CUT_8_4:
                return "#OPN@" + index + "{4 7  31 00 00 00 00 30 0 08 3 0 18 13 09 07 01 00 0 08 3 0 31 00 00 00 00 22 0 04 7 0 21 13 09 07 01 00 0 04 7 0};";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_LONG_8_4:
                return "#OPN@" + index + "{4 7  31 00 00 00 00 30 0 08 3 0 18 13 01 07 01 00 0 08 3 0 31 00 00 00 00 22 0 04 7 0 21 13 01 07 01 00 0 04 7 0};";
            case SionPresetVoiceVALSOUND_LEAD._ACO_CODE_2:
                return "#OPN@" + index + "{4 7  31 00 00 00 00 28 0 04 3 0 31 10 00 07 01 00 0 04 3 0 31 00 00 00 00 21 0 04 7 0 31 10 00 07 01 00 0 04 7 0};";
            case SionPresetVoiceVALSOUND_LEAD._ACO_CODE_3:
                return "#OPN@" + index + "{4 7  31 00 00 00 00 28 0 04 3 0 31 10 00 07 01 00 0 08 3 0 31 00 00 00 00 21 0 04 7 0 31 10 00 07 01 00 0 04 7 0};";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_FB_LONG_4:
                return "#OPN@" + index + "{3 7  25 07 00 00 05 23 0 02 7 0 17 00 00 09 00 32 0 04 3 0 25 07 00 00 06 27 0 02 3 0 16 08 00 09 01 00 0 02 0 0};";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_FB_LONG_5:
                return "#OPN@" + index + "{4 7  22 04 00 00 03 22 0 02 3 0 16 08 00 09 02 00 0 08 3 0 22 00 00 00 00 15 0 02 7 0 16 08 00 09 02 00 0 08 7 0};";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_LEAD_0:
                return "#OPN@" + index + "{4 6  24 07 01 00 00 23 0 01 3 0 23 08 00 06 01 00 0 01 3 0 24 07 01 00 00 12 0 01 7 0 15 08 00 08 01 08 0 03 7 0};";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_LEAD_1:
                return "#OPN@" + index + "{3 7  14 10 00 15 01 25 0 02 0 0 31 00 07 15 00 15 0 01 3 0 31 00 00 15 00 30 0 02 7 0 31 00 00 15 00 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_LEAD_2:
                return "#OPN@" + index + "{2 7  31 04 02 08 01 25 0 04 3 0 14 14 00 08 05 32 0 04 0 0 21 00 02 08 00 35 0 02 7 0 21 04 01 08 03 00 0 02 0 0};";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_LEAD_3:
                return "#OPN@" + index + "{3 7  20 00 00 00 00 29 0 02 3 0 18 12 00 08 01 25 0 02 7 0 20 12 00 08 01 30 0 01 3 0 22 12 00 08 01 00 0 02 0 0};";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_LEAD_4:
                return "#OPN@" + index + "{4 5  25 31 01 03 01 10 0 02 3 0 31 10 01 10 02 00 0 04 7 0 25 31 01 03 01 05 0 02 7 0 31 10 01 10 02 00 0 04 3 0};";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_LEAD_5:
                return "#OPN@" + index + "{4 6  31 10 00 08 02 16 0 11 7 0 31 03 00 08 02 18 0 01 7 0 31 03 00 08 02 50 0 08 3 0 31 03 00 08 02 00 0 02 3 0};";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_LEAD_6:
                return "#OPN@" + index + "{4 5  31 00 00 00 00 22 0 02 7 0 18 10 00 06 01 00 0 08 7 0 31 00 00 00 00 23 0 04 3 0 18 10 00 06 01 00 0 04 3 0};";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_LEAD_7_SOFT_FB:
                return "#OPN@" + index + "{1 7  31 00 00 00 00 23 0 02 1 0 31 10 08 00 05 20 0 02 7 0 15 12 00 12 02 36 0 06 5 0 18 00 00 06 00 00 0 02 0 0};";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_PSG:
                return "#OPN@" + index + "{0 7  31 01 03 00 15 21 0 02 3 0 31 01 06 00 15 41 0 04 3 0 31 01 03 00 15 22 0 01 3 0 31 13 00 06 02 00 0 01 3 0};";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_PSG_2:
                return "#OPN@" + index + "{0 7  17 01 03 08 15 32 0 08 3 0 19 01 06 08 15 35 0 04 3 0 22 01 03 08 15 20 0 02 3 0 31 11 00 08 02 00 0 01 3 0};";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_PSG_3:
                return "#OPN@" + index + "{5 7  31 00 00 00 00 24 0 02 0 0 31 15 00 09 03 06 0 01 0 0 31 15 00 09 03 06 0 01 0 0 31 15 00 09 03 06 0 02 0 0};";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_PSG_4:
                return "#OPN@" + index + "{5 7  31 00 00 00 00 22 0 01 0 0 31 15 01 09 03 00 0 01 0 0 31 15 01 09 03 00 0 00 0 0 31 15 02 09 04 10 0 02 0 0};";
            case SionPresetVoiceVALSOUND_LEAD._SYNTH_PSG_5:
                return "#OPN@" + index + "{1 7  31 00 00 15 00 28 0 05 0 0 31 00 00 15 00 45 0 03 0 0 31 00 00 15 00 45 0 02 0 0 31 00 00 15 00 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_LEAD._SIN_WATER_SYNTH:
                return "#OPN@" + index + "{6 0  31 00 00 15 00 44 0 01 0 0 24 00 00 15 00 02 0 01 0 0 25 21 00 15 15 14 0 06 0 0 24 00 00 15 00 04 0 02 0 0};";
        }
        return "";
    }
};
addPossibleValuesFunction(SionPresetVoiceVALSOUND_LEAD, SionPresetVoiceVALSOUND_LEAD._ACO_CODE, SionPresetVoiceVALSOUND_LEAD._SIN_WATER_SYNTH);
var SionPresetVoiceVALSOUND_PERCUS = {
    _BASS_DRUM_2: 0,
    _BASS_DRUM_3_O1F: 1,
    _RUFINA_BD_O2C: 2,
    _B_D__VBEND: 3,
    _BD808_2_VBEND: 4,
    _CHO_CHO_3_O2E: 5,
    _COW_BELL_1: 6,
    _CRASH_CYMBAL_NOISE: 7,
    _CRASH_NOISE: 8,
    _CRASH_NOISE_SHORT: 9,
    _ETHNIC_PERCUS_0: 10,
    _ETHNIC_PERCUS_1: 11,
    _HEAVY_BD: 12,
    _HEAVY_BD2: 13,
    _HEAVY_SD1: 14,
    _HI_HAT_CLOSE_5: 15,
    _HI_HAT_CLOSE_4: 16,
    _HI_HAT_CLOSE_5: 17,
    _HI_HAT_CLOSE_6_808: 18,
    _HI_HAT_7_METAL_O3_6: 19,
    _HI_HAT_CLOSE_8_O4: 20,
    _HI_HAT_OPEN_O4E_G: 21,
    _OPEN_HAT2_METAL_O4C: 22,
    _OPEN_HAT3_METAL: 23,
    _HI_HAT_OPEN_4_O4F: 24,
    _METAL_RIDE_O4C_OR_O5C: 25,
    _RIM_SHOT_1_O3C: 26,
    _SNARE_DRUM_LIGHT: 27,
    _SNARE_DRUM_LIGHTER: 28,
    _SNARE_DRUM_808_O2_O3: 29,
    _SNARE4_808TYPE_O2: 30,
    _SNARE5_O1_2_FRANGER: 31,
    _TOM_OLD: 32,
    _SYNTH_TOM_2_ALGO_3: 33,
    _SYNTH_NOISY_TOM_3: 34,
    _SYNTH_TOM_3: 35,
    _SYNTH_DX7_TOM_4: 36,
    _TRIANGLE_1_O5C: 37,
    toString: function(cat) {
        switch (cat) {
            case SionPresetVoiceVALSOUND_PERCUS._BASS_DRUM_2:
                return "Bass Drum 2";
            case SionPresetVoiceVALSOUND_PERCUS._BASS_DRUM_3_O1F:
                return "Bass Drum 3 o1f";
            case SionPresetVoiceVALSOUND_PERCUS._RUFINA_BD_O2C:
                return "RUFINA BD o2c";
            case SionPresetVoiceVALSOUND_PERCUS._B_D__VBEND:
                return "B.D.(-vBend)";
            case SionPresetVoiceVALSOUND_PERCUS._BD808_2_VBEND:
                return "BD808_2(-vBend)";
            case SionPresetVoiceVALSOUND_PERCUS._CHO_CHO_3_O2E:
                return "Cho cho 3 (o2e)";
            case SionPresetVoiceVALSOUND_PERCUS._COW_BELL_1:
                return "Cow-Bell 1";
            case SionPresetVoiceVALSOUND_PERCUS._CRASH_CYMBAL_NOISE:
                return "Crash Cymbal (noise)";
            case SionPresetVoiceVALSOUND_PERCUS._CRASH_NOISE:
                return "Crash Noise";
            case SionPresetVoiceVALSOUND_PERCUS._CRASH_NOISE_SHORT:
                return "Crash Noise Short";
            case SionPresetVoiceVALSOUND_PERCUS._ETHNIC_PERCUS_0:
                return "ETHNIC Percus.0";
            case SionPresetVoiceVALSOUND_PERCUS._ETHNIC_PERCUS_1:
                return "ETHNIC Percus.1";
            case SionPresetVoiceVALSOUND_PERCUS._HEAVY_BD:
                return "Heavy BD.";
            case SionPresetVoiceVALSOUND_PERCUS._HEAVY_BD2:
                return "Heavy BD2";
            case SionPresetVoiceVALSOUND_PERCUS._HEAVY_SD1:
                return "Heavy SD1";
            case SionPresetVoiceVALSOUND_PERCUS._HI_HAT_CLOSE_5:
                return "Hi-Hat close 5_";
            case SionPresetVoiceVALSOUND_PERCUS._HI_HAT_CLOSE_4:
                return "Hi-Hat close 4";
            case SionPresetVoiceVALSOUND_PERCUS._HI_HAT_CLOSE_5:
                return "Hi-Hat close 5";
            case SionPresetVoiceVALSOUND_PERCUS._HI_HAT_CLOSE_6_808:
                return "Hi-Hat Close 6 -808-";
            case SionPresetVoiceVALSOUND_PERCUS._HI_HAT_7_METAL_O3_6:
                return "Hi-hat #7 Metal o3-6";
            case SionPresetVoiceVALSOUND_PERCUS._HI_HAT_CLOSE_8_O4:
                return "Hi-Hat Close #8 o4";
            case SionPresetVoiceVALSOUND_PERCUS._HI_HAT_OPEN_O4E_G:
                return "Hi-hat Open o4e-g+";
            case SionPresetVoiceVALSOUND_PERCUS._OPEN_HAT2_METAL_O4C:
                return "Open-hat2 Metal o4c-";
            case SionPresetVoiceVALSOUND_PERCUS._OPEN_HAT3_METAL:
                return "Open-hat3 Metal";
            case SionPresetVoiceVALSOUND_PERCUS._HI_HAT_OPEN_4_O4F:
                return "Hi-Hat Open #4 o4f";
            case SionPresetVoiceVALSOUND_PERCUS._METAL_RIDE_O4C_OR_O5C:
                return "Metal ride o4c or o5c";
            case SionPresetVoiceVALSOUND_PERCUS._RIM_SHOT_1_O3C:
                return "Rim Shot #1 o3c";
            case SionPresetVoiceVALSOUND_PERCUS._SNARE_DRUM_LIGHT:
                return "Snare Drum Light";
            case SionPresetVoiceVALSOUND_PERCUS._SNARE_DRUM_LIGHTER:
                return "Snare Drum Lighter";
            case SionPresetVoiceVALSOUND_PERCUS._SNARE_DRUM_808_O2_O3:
                return "Snare Drum 808 o2-o3";
            case SionPresetVoiceVALSOUND_PERCUS._SNARE4_808TYPE_O2:
                return "Snare4 -808type- o2";
            case SionPresetVoiceVALSOUND_PERCUS._SNARE5_O1_2_FRANGER:
                return "Snare5 o1-2(Franger)";
            case SionPresetVoiceVALSOUND_PERCUS._TOM_OLD:
                return "Tom (old)";
            case SionPresetVoiceVALSOUND_PERCUS._SYNTH_TOM_2_ALGO_3:
                return "Synth tom 2 algo 3";
            case SionPresetVoiceVALSOUND_PERCUS._SYNTH_NOISY_TOM_3:
                return "Synth (Noisy) Tom #3";
            case SionPresetVoiceVALSOUND_PERCUS._SYNTH_TOM_3:
                return "Synth Tom #3";
            case SionPresetVoiceVALSOUND_PERCUS._SYNTH_DX7_TOM_4:
                return "Synth -DX7- Tom #4";
            case SionPresetVoiceVALSOUND_PERCUS._TRIANGLE_1_O5C:
                return "Triangle 1 o5c";
        }
        return "Unknown " + cat;
    },
    getMML: function(cat, index) {
        switch (cat) {
            case SionPresetVoiceVALSOUND_PERCUS._BASS_DRUM_2:
                return "#OPN@" + index + "{0 0  30 26 00 13 15 26 0 01 0 0 30 28 00 14 15 37 0 15 3 0 30 16 00 08 15 05 0 00 0 0 29 16 00 08 15 00 0 00 0 0};";
            case SionPresetVoiceVALSOUND_PERCUS._BASS_DRUM_3_O1F:
                return "#OPN@" + index + "{2 5  24 19 00 00 15 30 0 01 3 0 31 18 13 14 15 30 0 00 0 0 31 19 13 08 15 05 0 01 7 0 31 16 15 12 15 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_PERCUS._RUFINA_BD_O2C:
                return "#OPN@" + index + "{5 5  29 20 18 15 05 11 0 00 2 0 31 16 18 15 05 02 0 00 0 0 31 16 17 15 03 00 0 00 0 0 31 15 18 15 04 00 0 00 0 0};";
            case SionPresetVoiceVALSOUND_PERCUS._B_D__VBEND:
                return "#OPN@" + index + "{3 7  31 08 00 01 05 08 0 15 1 0 31 21 04 01 12 18 0 01 0 0 31 26 00 15 15 14 0 00 0 0 31 13 10 15 15 00 0 00 0 0};";
            case SionPresetVoiceVALSOUND_PERCUS._BD808_2_VBEND:
                return "#OPN@" + index + "{6 3  31 16 10 15 15 15 0 00 0 0 31 15 10 15 15 00 0 00 0 0 28 15 20 15 15 00 0 02 3 0 26 15 20 15 15 00 0 02 7 0};";
            case SionPresetVoiceVALSOUND_PERCUS._CHO_CHO_3_O2E:
                return "#OPN@" + index + "{4 2  18 18 00 14 15 00 0 04 7 0 17 17 00 14 15 00 0 02 3 0 18 18 00 14 15 00 0 04 3 0 17 17 00 14 15 00 0 02 7 0};";
            case SionPresetVoiceVALSOUND_PERCUS._COW_BELL_1:
                return "#OPN@" + index + "{3 7  31 18 19 06 02 08 0 12 1 0 31 18 12 06 02 35 0 07 2 0 31 17 13 06 03 32 0 07 3 0 31 19 15 09 01 00 0 02 7 0};";
            case SionPresetVoiceVALSOUND_PERCUS._CRASH_CYMBAL_NOISE:
                return "#OPN@" + index + "{4 7  31 00 00 00 00 00 0 15 7 0 21 10 11 13 05 00 0 00 7 0 31 00 00 14 00 00 0 08 3 0 31 09 09 09 15 05 0 15 3 0};";
            case SionPresetVoiceVALSOUND_PERCUS._CRASH_NOISE:
                return "#OPN@" + index + "{0 7  23 02 08 02 15 00 0 15 3 0 25 02 08 02 15 14 0 12 7 0 22 02 08 05 15 04 0 03 3 0 23 07 08 05 15 00 0 06 7 0};";
            case SionPresetVoiceVALSOUND_PERCUS._CRASH_NOISE_SHORT:
                return "#OPN@" + index + "{0 7  23 02 08 02 15 00 0 15 3 0 25 02 08 02 15 14 0 12 7 0 22 02 08 05 15 04 0 03 3 0 23 07 08 05 15 00 0 06 7 0};";
            case SionPresetVoiceVALSOUND_PERCUS._ETHNIC_PERCUS_0:
                return "#OPN@" + index + "{3 7  31 19 06 03 13 40 0 10 3 0 31 12 04 00 05 34 0 04 3 0 31 16 06 10 14 36 0 02 7 0 31 14 06 06 15 00 0 00 0 0};";
            case SionPresetVoiceVALSOUND_PERCUS._ETHNIC_PERCUS_1:
                return "#OPN@" + index + "{4 6  31 16 00 05 15 35 0 00 3 0 31 05 15 15 15 00 0 00 3 0 31 21 00 15 11 15 0 04 1 0 31 20 21 09 02 00 0 00 7 0};";
            case SionPresetVoiceVALSOUND_PERCUS._HEAVY_BD:
                return "#OPN@" + index + "{5 0  31 15 00 08 15 10 0 00 0 0 31 13 00 08 15 00 0 00 0 0 31 13 00 08 15 00 0 00 0 0 31 24 00 09 15 20 0 01 0 0};";
            case SionPresetVoiceVALSOUND_PERCUS._HEAVY_BD2:
                return "#OPN@" + index + "{5 3  31 16 10 08 15 10 0 00 0 0 31 15 10 08 15 00 0 00 0 0 31 10 10 08 14 00 0 00 0 0 31 20 10 08 15 10 0 01 0 0};";
            case SionPresetVoiceVALSOUND_PERCUS._HEAVY_SD1:
                return "#OPN@" + index + "{4 7  31 00 00 00 00 00 0 15 0 0 28 00 15 13 00 00 0 04 0 0 31 18 15 07 04 00 0 00 0 0 31 05 12 07 00 00 0 00 0 0};";
            case SionPresetVoiceVALSOUND_PERCUS._HI_HAT_CLOSE_5:
                return "#OPN@" + index + "{4 7  31 00 00 00 00 00 0 15 7 0 18 17 18 13 05 00 0 00 7 0 31 00 00 14 00 00 0 08 3 0 18 16 13 09 15 05 0 15 3 0};";
            case SionPresetVoiceVALSOUND_PERCUS._HI_HAT_CLOSE_4:
                return "#OPN@" + index + "{4 7  31 11 00 00 05 00 0 15 0 0 31 17 12 09 09 00 0 00 0 0 31 00 00 15 00 00 0 00 0 0 25 19 20 15 15 07 0 15 0 0};";
            case SionPresetVoiceVALSOUND_PERCUS._HI_HAT_CLOSE_5:
                return "#OPN@" + index + "{4 7  31 00 00 00 00 00 0 15 7 0 21 18 18 13 05 00 0 00 7 0 31 00 00 14 00 00 0 08 3 0 31 17 13 09 15 05 0 15 3 0};";
            case SionPresetVoiceVALSOUND_PERCUS._HI_HAT_CLOSE_6_808:
                return "#OPN@" + index + "{0 7  27 00 10 00 15 39 0 15 0 0 31 04 10 14 15 30 0 11 0 0 31 10 10 14 15 05 0 09 7 0 31 19 10 15 15 00 0 09 3 0};";
            case SionPresetVoiceVALSOUND_PERCUS._HI_HAT_7_METAL_O3_6:
                return "#OPN@" + index + "{4 7  31 16 10 08 10 00 0 15 3 0 31 18 07 12 15 00 0 01 3 0 31 10 10 06 10 02 0 15 7 0 21 18 07 12 15 00 0 00 7 0};";
            case SionPresetVoiceVALSOUND_PERCUS._HI_HAT_CLOSE_8_O4:
                return "#OPN@" + index + "{4 7  25 19 00 09 03 00 0 15 0 0 22 19 16 14 05 00 0 01 0 0 31 10 15 15 05 00 0 15 0 0 31 19 19 15 02 00 0 15 0 0};";
            case SionPresetVoiceVALSOUND_PERCUS._HI_HAT_OPEN_O4E_G:
                return "#OPN@" + index + "{4 5  31 05 06 00 05 00 0 15 7 0 31 10 04 07 08 19 0 03 1 0 31 20 06 03 03 00 0 01 7 0 31 25 06 07 10 06 0 07 0 0};";
            case SionPresetVoiceVALSOUND_PERCUS._OPEN_HAT2_METAL_O4C:
                return "#OPN@" + index + "{4 7  31 14 00 08 03 00 0 15 3 0 31 15 08 12 13 00 0 07 3 0 31 13 00 06 03 01 0 10 7 0 31 15 11 12 12 00 0 07 7 0};";
            case SionPresetVoiceVALSOUND_PERCUS._OPEN_HAT3_METAL:
                return "#OPN@" + index + "{4 7  31 14 00 08 03 00 0 15 3 0 31 15 08 12 13 00 0 07 3 0 31 13 00 06 01 01 0 10 7 0 31 15 11 12 07 00 0 07 7 0};";
            case SionPresetVoiceVALSOUND_PERCUS._HI_HAT_OPEN_4_O4F:
                return "#OPN@" + index + "{4 6  31 15 00 09 01 00 0 15 0 0 31 20 05 14 05 03 0 04 0 0 31 10 09 09 01 00 0 10 0 0 31 22 05 14 05 00 0 07 0 0};";
            case SionPresetVoiceVALSOUND_PERCUS._METAL_RIDE_O4C_OR_O5C:
                return "#OPN@" + index + "{4 5  20 05 00 00 05 11 0 15 3 0 18 11 09 07 11 00 0 08 3 0 31 19 00 03 03 00 0 15 7 0 16 12 09 07 11 00 0 07 7 0};";
            case SionPresetVoiceVALSOUND_PERCUS._RIM_SHOT_1_O3C:
                return "#OPN@" + index + "{0 7  31 11 00 15 15 37 0 15 1 0 31 12 00 15 15 40 0 10 2 0 31 17 00 15 15 13 0 00 3 0 31 16 00 15 15 00 0 00 7 0};";
            case SionPresetVoiceVALSOUND_PERCUS._SNARE_DRUM_LIGHT:
                return "#OPN@" + index + "{4 7  31 00 00 07 00 00 0 15 0 0 31 15 15 09 02 00 0 15 0 0 31 21 00 15 11 10 0 04 1 0 31 19 17 09 02 00 0 00 7 0};";
            case SionPresetVoiceVALSOUND_PERCUS._SNARE_DRUM_LIGHTER:
                return "#OPN@" + index + "{4 6  31 00 00 14 00 00 0 10 3 0 31 15 15 14 01 00 0 12 7 0 31 15 00 14 15 00 0 02 3 0 31 15 00 14 15 00 0 00 7 0};";
            case SionPresetVoiceVALSOUND_PERCUS._SNARE_DRUM_808_O2_O3:
                return "#OPN@" + index + "{4 7  31 00 00 00 00 05 0 15 7 0 31 18 17 15 01 00 0 09 3 0 31 19 00 15 15 00 0 00 7 0 26 21 16 15 15 00 0 00 3 0};";
            case SionPresetVoiceVALSOUND_PERCUS._SNARE4_808TYPE_O2:
                return "#OPN@" + index + "{4 7  31 12 00 12 04 00 0 07 3 0 27 15 18 15 01 00 0 15 3 0 31 20 15 12 15 11 0 01 7 0 31 19 15 15 15 00 0 01 7 0};";
            case SionPresetVoiceVALSOUND_PERCUS._SNARE5_O1_2_FRANGER:
                return "#OPN@" + index + "{4 7  31 16 00 00 02 06 0 15 7 0 31 18 15 15 00 00 0 09 3 0 28 20 00 15 15 00 0 00 7 0 25 16 15 15 15 00 0 00 3 0};";
            case SionPresetVoiceVALSOUND_PERCUS._TOM_OLD:
                return "#OPN@" + index + "{4 7  31 11 00 01 15 00 0 15 3 0 31 20 14 15 05 00 0 01 3 0 31 16 15 05 15 48 0 00 7 0 31 11 15 15 15 00 0 00 7 0};";
            case SionPresetVoiceVALSOUND_PERCUS._SYNTH_TOM_2_ALGO_3:
                return "#OPN@" + index + "{3 7  31 04 00 01 00 00 0 15 1 0 31 21 04 01 10 15 0 01 0 0 31 26 00 15 15 00 0 00 0 0 31 11 00 07 15 00 0 00 0 0};";
            case SionPresetVoiceVALSOUND_PERCUS._SYNTH_NOISY_TOM_3:
                return "#OPN@" + index + "{3 7  31 20 00 00 02 00 0 15 3 0 31 18 13 06 08 28 0 00 3 0 31 16 09 12 05 44 0 01 7 0 31 14 04 12 01 00 0 00 7 0};";
            case SionPresetVoiceVALSOUND_PERCUS._SYNTH_TOM_3:
                return "#OPN@" + index + "{1 7  31 18 10 00 01 00 0 15 3 0 31 15 10 06 05 00 0 05 3 0 31 17 12 12 06 37 0 01 7 0 31 14 04 12 01 00 0 00 7 0};";
            case SionPresetVoiceVALSOUND_PERCUS._SYNTH_DX7_TOM_4:
                return "#OPN@" + index + "{3 7  31 04 00 01 00 00 0 11 0 0 31 21 04 01 06 25 0 01 3 0 31 26 00 15 15 00 0 00 0 0 31 11 00 07 15 00 0 00 0 0};";
            case SionPresetVoiceVALSOUND_PERCUS._TRIANGLE_1_O5C:
                return "#OPN@" + index + "{4 5  31 18 00 11 02 09 0 14 3 0 31 21 07 12 04 00 0 08 3 0 31 22 00 12 15 00 0 15 7 0 31 20 06 15 15 00 0 07 7 0};";
        }
        return "";
    }
};
addPossibleValuesFunction(SionPresetVoiceVALSOUND_PERCUS, SionPresetVoiceVALSOUND_PERCUS._BASS_DRUM_2, SionPresetVoiceVALSOUND_PERCUS._TRIANGLE_1_O5C);
var SionPresetVoiceVALSOUND_PIANO = {
    _ACO_PIANO2_ATTACK: 0,
    _BACKING_1_CLAV_: 1,
    _CLAV_COAD: 2,
    _DEEP_PIANO_1: 3,
    _DEEP_PIANO_3: 4,
    _E_PIANO_2: 5,
    _E_PIANO_3: 6,
    _E_PIANO_4_2_: 7,
    _E_BELL_PIANO_5: 8,
    _E_PIANO_6: 9,
    _E_PIANO_7: 10,
    _HARPCI_CHORD_1: 11,
    _HARPCI_2: 12,
    _PIANO1_ML1_10_05_01: 13,
    _PIANO3: 14,
    _PIANO4: 15,
    _DIGITAL_PIANO_5: 16,
    _PIANO_6_HIGH_TONE: 17,
    _PANNING_HARPCI: 18,
    _YAM_HARPCI_CHORD: 19,
    toString: function(cat) {
        switch (cat) {
            case SionPresetVoiceVALSOUND_PIANO._ACO_PIANO2_ATTACK:
                return "Aco Piano2 (Attack)";
            case SionPresetVoiceVALSOUND_PIANO._BACKING_1_CLAV_:
                return "Backing 1 (Clav.)";
            case SionPresetVoiceVALSOUND_PIANO._CLAV_COAD:
                return "Clav. coad";
            case SionPresetVoiceVALSOUND_PIANO._DEEP_PIANO_1:
                return "Deep Piano 1";
            case SionPresetVoiceVALSOUND_PIANO._DEEP_PIANO_3:
                return "Deep Piano 3";
            case SionPresetVoiceVALSOUND_PIANO._E_PIANO_2:
                return "E.piano #2";
            case SionPresetVoiceVALSOUND_PIANO._E_PIANO_3:
                return "E.piano #3";
            case SionPresetVoiceVALSOUND_PIANO._E_PIANO_4_2_:
                return "E.piano #4(2+)";
            case SionPresetVoiceVALSOUND_PIANO._E_BELL_PIANO_5:
                return "E.(Bell)Piano #5";
            case SionPresetVoiceVALSOUND_PIANO._E_PIANO_6:
                return "E.Piano #6";
            case SionPresetVoiceVALSOUND_PIANO._E_PIANO_7:
                return "E.Piano #7";
            case SionPresetVoiceVALSOUND_PIANO._HARPCI_CHORD_1:
                return "Harpci chord 1";
            case SionPresetVoiceVALSOUND_PIANO._HARPCI_2:
                return "Harpci 2";
            case SionPresetVoiceVALSOUND_PIANO._PIANO1_ML1_10_05_01:
                return "Piano1 (ML1,10,05,01)";
            case SionPresetVoiceVALSOUND_PIANO._PIANO3:
                return "Piano3";
            case SionPresetVoiceVALSOUND_PIANO._PIANO4:
                return "Piano4";
            case SionPresetVoiceVALSOUND_PIANO._DIGITAL_PIANO_5:
                return "Digital Piano #5";
            case SionPresetVoiceVALSOUND_PIANO._PIANO_6_HIGH_TONE:
                return "Piano 6 High-tone";
            case SionPresetVoiceVALSOUND_PIANO._PANNING_HARPCI:
                return "Panning Harpci";
            case SionPresetVoiceVALSOUND_PIANO._YAM_HARPCI_CHORD:
                return "Yam Harpci chord";
        }
        return "Unknown " + cat;
    },
    getMML: function(cat, index) {
        switch (cat) {
            case SionPresetVoiceVALSOUND_PIANO._ACO_PIANO2_ATTACK:
                return "#OPN@" + index + "{4 5  31 05 00 00 00 23 0 01 3 0 20 10 03 07 08 00 0 01 3 0 31 03 00 00 00 25 0 01 7 0 31 12 03 07 10 02 0 01 7 0};";
            case SionPresetVoiceVALSOUND_PIANO._BACKING_1_CLAV_:
                return "#OPN@" + index + "{2 7  31 08 03 06 02 40 0 01 3 0 31 07 04 06 02 37 0 05 2 0 31 07 02 06 01 30 0 03 7 0 28 30 09 07 00 00 0 01 4 0};";
            case SionPresetVoiceVALSOUND_PIANO._CLAV_COAD:
                return "#OPN@" + index + "{2 6  31 15 08 06 02 35 0 12 3 0 31 06 02 06 02 32 0 03 0 0 31 06 02 06 01 32 0 01 7 0 31 08 06 07 04 00 0 02 0 0};";
            case SionPresetVoiceVALSOUND_PIANO._DEEP_PIANO_1:
                return "#OPN@" + index + "{2 5  31 09 04 00 02 38 0 00 3 0 22 07 03 09 03 31 0 03 0 0 31 07 03 02 03 27 0 00 7 0 28 07 01 07 01 00 0 00 0 0};";
            case SionPresetVoiceVALSOUND_PIANO._DEEP_PIANO_3:
                return "#OPN@" + index + "{2 0  31 20 09 00 02 08 0 00 7 0 31 11 03 01 01 23 0 04 3 0 31 13 05 02 02 30 0 00 3 0 31 00 04 06 00 00 0 01 7 0};";
            case SionPresetVoiceVALSOUND_PIANO._E_PIANO_2:
                return "#OPN@" + index + "{4 6  22 05 00 03 05 30 0 02 3 0 16 08 08 07 02 00 0 02 3 0 20 05 00 03 05 34 0 04 7 0 17 08 07 07 02 00 0 02 7 0};";
            case SionPresetVoiceVALSOUND_PIANO._E_PIANO_3:
                return "#OPN@" + index + "{4 7  22 05 00 03 05 41 0 01 3 0 16 08 08 07 02 00 0 02 3 0 31 18 00 03 10 44 0 08 7 0 31 09 07 07 02 03 0 01 7 0};";
            case SionPresetVoiceVALSOUND_PIANO._E_PIANO_4_2_:
                return "#OPN@" + index + "{4 6  31 05 00 15 05 46 0 02 3 0 31 09 08 15 03 00 0 02 3 0 31 05 00 15 05 44 0 04 7 0 31 09 07 15 03 00 0 02 7 0};";
            case SionPresetVoiceVALSOUND_PIANO._E_BELL_PIANO_5:
                return "#OPN@" + index + "{4 7  31 07 00 09 05 35 0 06 3 0 31 11 07 14 04 05 0 02 3 0 31 10 09 09 05 35 0 12 7 0 31 11 07 14 04 05 0 02 7 0};";
            case SionPresetVoiceVALSOUND_PIANO._E_PIANO_6:
                return "#OPN@" + index + "{4 7  29 20 00 00 03 34 0 08 3 0 17 08 00 07 06 02 0 04 3 0 30 00 00 00 00 25 0 04 7 0 18 08 00 07 06 02 0 04 7 0};";
            case SionPresetVoiceVALSOUND_PIANO._E_PIANO_7:
                return "#OPN@" + index + "{4 7  31 15 00 10 15 40 0 15 0 0 31 10 00 07 15 15 0 01 0 0 31 10 00 05 15 20 0 01 0 0 31 10 00 07 15 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_PIANO._HARPCI_CHORD_1:
                return "#OPN@" + index + "{2 5  31 13 00 15 10 30 0 00 3 0 31 11 02 00 03 32 0 07 3 0 31 02 00 00 01 30 0 00 7 0 31 06 06 07 01 00 0 04 7 0};";
            case SionPresetVoiceVALSOUND_PIANO._HARPCI_2:
                return "#OPN@" + index + "{2 7  31 04 00 05 01 30 0 00 3 0 31 09 01 02 01 40 0 12 0 0 31 04 03 06 01 30 0 03 7 0 31 11 05 08 04 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_PIANO._PIANO1_ML1_10_05_01:
                return "#OPN@" + index + "{2 7  28 04 00 05 01 37 0 01 3 0 22 09 01 02 01 47 0 12 0 0 29 04 03 06 01 37 0 03 7 0 18 08 00 06 06 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_PIANO._PIANO3:
                return "#OPN@" + index + "{2 7  31 04 02 00 01 35 0 01 3 0 24 00 01 05 00 38 0 01 0 0 28 00 00 05 00 42 0 04 5 0 28 07 04 06 04 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_PIANO._PIANO4:
                return "#OPN@" + index + "{2 7  31 04 00 05 01 37 0 01 3 0 31 09 01 02 01 47 0 10 0 0 31 04 03 06 01 37 0 02 7 0 31 08 00 06 06 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_PIANO._DIGITAL_PIANO_5:
                return "#OPN@" + index + "{3 7  28 04 00 07 01 27 0 01 4 0 28 14 07 04 03 42 0 14 3 0 26 04 03 08 02 38 0 03 7 0 25 07 08 07 00 00 0 01 6 0};";
            case SionPresetVoiceVALSOUND_PIANO._PIANO_6_HIGH_TONE:
                return "#OPN@" + index + "{2 7  28 04 00 05 01 39 0 01 3 0 31 13 01 02 02 50 0 14 0 0 29 04 03 06 01 41 0 03 7 0 21 08 06 06 06 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_PIANO._PANNING_HARPCI:
                return "#OPN@" + index + "{2 7  31 02 10 06 14 40 0 12 3 0 25 02 15 06 14 32 0 09 0 0 30 02 04 06 14 34 0 05 7 0 20 02 08 06 14 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_PIANO._YAM_HARPCI_CHORD:
                return "#OPN@" + index + "{1 4  31 06 05 06 07 40 0 10 0 0 31 06 04 05 05 35 0 02 0 0 31 06 05 05 05 24 0 01 0 0 31 07 06 07 05 00 0 01 0 0};";
        }
        return "";
    }
};
addPossibleValuesFunction(SionPresetVoiceVALSOUND_PIANO, SionPresetVoiceVALSOUND_PIANO._ACO_PIANO2_ATTACK, SionPresetVoiceVALSOUND_PIANO._YAM_HARPCI_CHORD);
var SionPresetVoiceVALSOUND_SE = {
    _S_E_DETUNE_IS_NEEDED_O2C: 0,
    _S_E_2_O0_1_2: 1,
    _S_E_3_FEEDIN_NOISE_ADD_: 2,
    toString: function(cat) {
        switch (cat) {
            case SionPresetVoiceVALSOUND_SE._S_E_DETUNE_IS_NEEDED_O2C:
                return "S.E.(Detune is needed o2c)";
            case SionPresetVoiceVALSOUND_SE._S_E_2_O0_1_2:
                return "S.E. 2 o0-1-2";
            case SionPresetVoiceVALSOUND_SE._S_E_3_FEEDIN_NOISE_ADD_:
                return "S.E. 3(Feedin /noise add.)";
        }
        return "Unknown " + cat;
    },
    getMML: function(cat, index) {
        switch (cat) {
            case SionPresetVoiceVALSOUND_SE._S_E_DETUNE_IS_NEEDED_O2C:
                return "#OPN@" + index + "{0 4  31 07 03 00 01 12 0 00 1 0 31 10 00 08 03 25 0 00 2 0 31 06 04 08 08 00 0 04 3 0 31 12 00 08 00 00 0 12 7 0};";
            case SionPresetVoiceVALSOUND_SE._S_E_2_O0_1_2:
                return "#OPN@" + index + "{1 2  31 06 07 15 03 08 0 00 3 0 31 06 09 15 06 08 0 00 7 0 06 06 06 15 01 10 0 12 3 0 31 05 04 15 02 00 0 00 0 0};";
            case SionPresetVoiceVALSOUND_SE._S_E_3_FEEDIN_NOISE_ADD_:
                return "#OPN@" + index + "{4 6  04 03 00 15 04 00 0 00 7 0 08 07 07 15 01 00 0 07 7 0 05 00 00 15 00 00 0 00 3 0 08 06 03 15 01 00 0 04 3 0};";
        }
        return "";
    }
};
addPossibleValuesFunction(SionPresetVoiceVALSOUND_SE, SionPresetVoiceVALSOUND_SE._S_E_DETUNE_IS_NEEDED_O2C, SionPresetVoiceVALSOUND_SE._S_E_3_FEEDIN_NOISE_ADD_);
var SionPresetVoiceVALSOUND_SPECIAL = {
    _DIGITAL_1: 0,
    _DIGITAL_2: 1,
    _DIGITAL_BAS_3_O2_O3: 2,
    _DIGITAL_GTR_3_O2_O3: 3,
    _DIGITAL_4_O4A: 4,
    toString: function(cat) {
        switch (cat) {
            case SionPresetVoiceVALSOUND_SPECIAL._DIGITAL_1:
                return "Digital 1";
            case SionPresetVoiceVALSOUND_SPECIAL._DIGITAL_2:
                return "Digital 2";
            case SionPresetVoiceVALSOUND_SPECIAL._DIGITAL_BAS_3_O2_O3:
                return "Digital[BAS] 3 o2-o3";
            case SionPresetVoiceVALSOUND_SPECIAL._DIGITAL_GTR_3_O2_O3:
                return "Digital[GTR] 3 o2-o3";
            case SionPresetVoiceVALSOUND_SPECIAL._DIGITAL_4_O4A:
                return "Digital 4 o4a";
        }
        return "Unknown " + cat;
    },
    getMML: function(cat, index) {
        switch (cat) {
            case SionPresetVoiceVALSOUND_SPECIAL._DIGITAL_1:
                return "#OPN@" + index + "{3 6  31 12 03 05 05 26 0 14 7 0 31 16 06 00 03 28 0 08 3 0 31 00 12 00 00 30 0 00 0 0 31 15 12 12 02 00 0 01 7 0};";
            case SionPresetVoiceVALSOUND_SPECIAL._DIGITAL_2:
                return "#OPN@" + index + "{0 7  31 15 00 12 03 27 0 10 7 0 31 16 00 00 04 30 0 15 3 0 31 15 00 00 02 30 0 02 0 0 31 15 00 12 02 00 0 01 7 0};";
            case SionPresetVoiceVALSOUND_SPECIAL._DIGITAL_BAS_3_O2_O3:
                return "#OPN@" + index + "{0 7  31 00 00 09 00 27 0 12 1 0 31 10 00 09 01 25 0 00 2 0 31 10 00 09 01 25 0 12 3 0 31 12 00 14 02 03 0 01 7 0};";
            case SionPresetVoiceVALSOUND_SPECIAL._DIGITAL_GTR_3_O2_O3:
                return "#OPN@" + index + "{0 7  31 00 00 09 00 27 0 12 1 0 31 10 00 09 01 25 0 00 2 0 31 10 00 09 01 25 0 03 3 0 31 12 00 14 02 03 0 01 7 0};";
            case SionPresetVoiceVALSOUND_SPECIAL._DIGITAL_4_O4A:
                return "#OPN@" + index + "{5 0  31 31 00 00 00 61 0 09 0 0 31 31 00 13 00 03 0 03 0 0 31 31 00 13 00 15 0 09 0 0 31 31 00 13 00 06 0 06 0 0};";
        }
        return "";
    }
};
addPossibleValuesFunction(SionPresetVoiceVALSOUND_SPECIAL, SionPresetVoiceVALSOUND_SPECIAL._DIGITAL_1, SionPresetVoiceVALSOUND_SPECIAL._DIGITAL_4_O4A);
var SionPresetVoiceVALSOUND_STRPAD = {
    _ACCORDION1: 0,
    _ACCORDION2: 1,
    _ACCORDION3: 2,
    _CHORUS_2_VOICE: 3,
    _CHORUS_3: 4,
    _CHORUS_4: 5,
    _F_STRINGS_1: 6,
    _F_STRINGS_2: 7,
    _F_STRINGS_3: 8,
    _F_STRINGS_4_LOW: 9,
    _PIZZICATE1_KOTO2: 10,
    _SOUND_TRUCK_MODOKI: 11,
    _STRINGS: 12,
    _SYNTH_ACCORDION: 13,
    _PHASER_SYNTHE: 14,
    _FB_SYNTH: 15,
    _SYNTH_STRINGS_MB: 16,
    _SYNTH_STRINGS_2: 17,
    _SYNTH_SWEEP_PAD_1: 18,
    _TWIN_SYNTH_1_CALM: 19,
    _TWIN_SYNTH_2_FB: 20,
    _TWIN_SYNTH_3_FB: 21,
    _VOCODER_VOICE1: 22,
    _VOICE_O3_O5: 23,
    _VOICE_O3_O5: 24,
    toString: function(cat) {
        switch (cat) {
            case SionPresetVoiceVALSOUND_STRPAD._ACCORDION1:
                return "Accordion1";
            case SionPresetVoiceVALSOUND_STRPAD._ACCORDION2:
                return "Accordion2";
            case SionPresetVoiceVALSOUND_STRPAD._ACCORDION3:
                return "Accordion3";
            case SionPresetVoiceVALSOUND_STRPAD._CHORUS_2_VOICE:
                return "Chorus #2(Voice)";
            case SionPresetVoiceVALSOUND_STRPAD._CHORUS_3:
                return "Chorus #3";
            case SionPresetVoiceVALSOUND_STRPAD._CHORUS_4:
                return "Chorus #4";
            case SionPresetVoiceVALSOUND_STRPAD._F_STRINGS_1:
                return "F.Strings 1";
            case SionPresetVoiceVALSOUND_STRPAD._F_STRINGS_2:
                return "F.Strings 2";
            case SionPresetVoiceVALSOUND_STRPAD._F_STRINGS_3:
                return "F.Strings 3";
            case SionPresetVoiceVALSOUND_STRPAD._F_STRINGS_4_LOW:
                return "F.Strings 4 (low)";
            case SionPresetVoiceVALSOUND_STRPAD._PIZZICATE1_KOTO2:
                return "Pizzicate#1(KOTO2)";
            case SionPresetVoiceVALSOUND_STRPAD._SOUND_TRUCK_MODOKI:
                return "sound truck modoki";
            case SionPresetVoiceVALSOUND_STRPAD._STRINGS:
                return "Strings";
            case SionPresetVoiceVALSOUND_STRPAD._SYNTH_ACCORDION:
                return "Synth Accordion";
            case SionPresetVoiceVALSOUND_STRPAD._PHASER_SYNTHE:
                return "Phaser synthe.";
            case SionPresetVoiceVALSOUND_STRPAD._FB_SYNTH:
                return "FB Synth.";
            case SionPresetVoiceVALSOUND_STRPAD._SYNTH_STRINGS_MB:
                return "Synth Strings MB";
            case SionPresetVoiceVALSOUND_STRPAD._SYNTH_STRINGS_2:
                return "Synth Strings #2";
            case SionPresetVoiceVALSOUND_STRPAD._SYNTH_SWEEP_PAD_1:
                return "Synth.Sweep Pad #1";
            case SionPresetVoiceVALSOUND_STRPAD._TWIN_SYNTH_1_CALM:
                return "Twin synth. #1 Calm";
            case SionPresetVoiceVALSOUND_STRPAD._TWIN_SYNTH_2_FB:
                return "Twin synth. #2 FB";
            case SionPresetVoiceVALSOUND_STRPAD._TWIN_SYNTH_3_FB:
                return "Twin synth. #3 FB";
            case SionPresetVoiceVALSOUND_STRPAD._VOCODER_VOICE1:
                return "Vocoder voice1";
            case SionPresetVoiceVALSOUND_STRPAD._VOICE_O3_O5:
                return "Voice o3-o5";
            case SionPresetVoiceVALSOUND_STRPAD._VOICE_O3_O5:
                return "Voice' o3-o5";
        }
        return "Unknown " + cat;
    },
    getMML: function(cat, index) {
        switch (cat) {
            case SionPresetVoiceVALSOUND_STRPAD._ACCORDION1:
                return "#OPN@" + index + "{4 6  17 00 00 00 00 20 0 04 3 0 16 09 00 12 02 00 0 08 3 0 15 00 00 07 00 36 0 04 7 0 15 09 00 12 02 00 0 08 7 0};";
            case SionPresetVoiceVALSOUND_STRPAD._ACCORDION2:
                return "#OPN@" + index + "{4 6  21 00 01 11 00 22 0 04 3 0 14 08 00 13 01 00 0 04 3 0 21 00 01 10 00 30 0 04 7 0 14 08 01 13 01 00 0 04 7 0};";
            case SionPresetVoiceVALSOUND_STRPAD._ACCORDION3:
                return "#OPN@" + index + "{4 7  31 05 00 00 00 25 0 04 7 0 14 08 00 13 01 00 0 04 7 0 31 08 00 00 10 25 0 02 3 0 14 06 00 13 01 00 0 04 3 0};";
            case SionPresetVoiceVALSOUND_STRPAD._CHORUS_2_VOICE:
                return "#OPN@" + index + "{4 6  21 00 01 11 00 40 0 04 3 0 14 08 00 13 01 00 0 04 3 0 21 00 01 10 00 37 0 04 7 0 14 08 01 13 01 00 0 04 7 0};";
            case SionPresetVoiceVALSOUND_STRPAD._CHORUS_3:
                return "#OPN@" + index + "{4 4  21 00 00 02 00 42 0 04 3 0 18 04 00 09 01 00 0 08 3 0 21 00 00 02 00 45 0 04 7 0 18 04 00 09 01 00 0 04 7 0};";
            case SionPresetVoiceVALSOUND_STRPAD._CHORUS_4:
                return "#OPN@" + index + "{6 3  21 00 00 02 00 39 0 04 0 0 18 04 00 09 01 00 0 04 1 0 18 10 00 09 01 00 0 04 3 0 18 08 00 09 02 00 0 02 7 0};";
            case SionPresetVoiceVALSOUND_STRPAD._F_STRINGS_1:
                return "#OPN@" + index + "{2 7  25 10 00 05 01 29 0 01 1 0 25 11 00 08 05 15 0 05 1 0 28 13 00 06 02 45 0 01 0 0 14 04 00 06 00 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_STRPAD._F_STRINGS_2:
                return "#OPN@" + index + "{2 0  21 07 00 07 03 37 0 01 3 0 20 11 00 12 03 15 0 05 7 0 16 08 00 12 03 45 0 01 0 0 14 05 00 12 01 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_STRPAD._F_STRINGS_3:
                return "#OPN@" + index + "{2 7  25 10 00 05 01 35 0 01 3 0 25 11 00 08 05 13 0 05 0 0 28 13 00 06 02 45 0 01 7 0 14 04 00 06 01 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_STRPAD._F_STRINGS_4_LOW:
                return "#OPN@" + index + "{2 7  25 10 00 05 01 29 0 00 3 0 25 11 00 08 05 20 0 04 0 0 28 13 00 06 02 38 0 01 7 0 14 04 00 06 01 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_STRPAD._PIZZICATE1_KOTO2:
                return "#OPN@" + index + "{0 6  31 07 08 01 02 30 0 03 7 0 31 05 09 01 01 30 0 02 0 0 31 05 08 03 02 35 0 01 0 0 31 11 07 05 05 00 0 01 3 0};";
            case SionPresetVoiceVALSOUND_STRPAD._SOUND_TRUCK_MODOKI:
                return "#OPN@" + index + "{4 7  31 00 00 00 00 30 0 02 3 0 18 13 04 07 01 00 0 02 3 0 31 00 00 00 00 22 0 03 7 0 21 13 04 07 01 00 0 03 7 0};";
            case SionPresetVoiceVALSOUND_STRPAD._STRINGS:
                return "#OPN@" + index + "{2 7  15 09 00 05 01 27 0 02 3 0 15 00 00 05 15 31 0 02 0 0 15 00 00 05 00 27 0 02 0 0 13 03 00 08 00 00 0 02 7 0};";
            case SionPresetVoiceVALSOUND_STRPAD._SYNTH_ACCORDION:
                return "#OPN@" + index + "{4 7  18 00 00 11 00 21 0 02 3 0 15 09 00 13 02 00 0 08 3 0 18 00 00 11 00 20 0 02 7 0 14 09 00 13 02 00 0 04 7 0};";
            case SionPresetVoiceVALSOUND_STRPAD._PHASER_SYNTHE:
                return "#OPN@" + index + "{0 7  27 31 05 05 05 08 0 01 4 0 26 31 04 05 04 18 0 01 5 0 19 31 00 05 02 18 0 01 6 0 16 15 00 06 02 00 0 03 4 0};";
            case SionPresetVoiceVALSOUND_STRPAD._FB_SYNTH:
                return "#OPN@" + index + "{3 7  31 06 00 00 04 22 0 02 0 0 18 00 00 08 00 28 0 04 6 0 20 05 00 08 02 28 0 02 1 0 20 04 00 08 01 00 0 02 2 0};";
            case SionPresetVoiceVALSOUND_STRPAD._SYNTH_STRINGS_MB:
                return "#OPN@" + index + "{3 7  21 00 00 00 00 30 0 01 1 0 14 07 07 06 03 25 0 02 6 0 15 00 00 05 00 38 0 05 6 0 18 00 00 06 00 00 0 02 0 0};";
            case SionPresetVoiceVALSOUND_STRPAD._SYNTH_STRINGS_2:
                return "#OPN@" + index + "{2 7  20 01 00 08 01 32 0 02 7 0 15 04 00 08 01 28 0 02 0 0 22 01 00 08 01 34 0 02 3 0 14 02 00 09 01 00 0 02 0 0};";
            case SionPresetVoiceVALSOUND_STRPAD._SYNTH_SWEEP_PAD_1:
                return "#OPN@" + index + "{5 6  31 07 00 09 05 18 0 04 0 0 31 15 00 14 01 05 0 08 0 0 31 16 00 15 02 05 0 04 0 0 31 26 00 14 02 05 0 08 1 0};";
            case SionPresetVoiceVALSOUND_STRPAD._TWIN_SYNTH_1_CALM:
                return "#OPN@" + index + "{4 2  16 03 00 00 02 25 0 04 3 0 19 12 00 06 01 00 0 04 3 0 16 03 00 00 02 20 0 03 7 0 19 12 00 06 01 00 0 03 7 0};";
            case SionPresetVoiceVALSOUND_STRPAD._TWIN_SYNTH_2_FB:
                return "#OPN@" + index + "{4 6  16 03 00 00 02 20 0 04 7 0 19 12 00 06 01 00 0 08 3 0 16 03 00 00 02 06 0 03 3 0 19 12 00 06 01 08 0 06 7 0};";
            case SionPresetVoiceVALSOUND_STRPAD._TWIN_SYNTH_3_FB:
                return "#OPN@" + index + "{4 6  16 06 05 00 02 20 0 04 3 0 19 12 00 06 01 00 0 08 3 0 16 06 05 00 02 06 0 03 7 0 19 12 00 06 01 08 0 06 7 0};";
            case SionPresetVoiceVALSOUND_STRPAD._VOCODER_VOICE1:
                return "#OPN@" + index + "{4 7  31 08 05 12 15 20 0 04 7 0 31 00 00 15 00 00 0 08 7 0 31 08 05 12 15 24 0 03 3 0 31 00 00 15 00 00 0 06 3 0};";
            case SionPresetVoiceVALSOUND_STRPAD._VOICE_O3_O5:
                return "#OPN@" + index + "{6 0  10 00 01 03 00 70 0 01 0 0 12 00 00 05 00 07 0 03 3 0 12 00 01 06 02 00 0 02 7 0 18 00 00 06 00 17 0 00 3 0};";
            case SionPresetVoiceVALSOUND_STRPAD._VOICE_O3_O5:
                return "#OPN@" + index + "{6 0  10 00 01 03 00 70 0 00 0 0 12 00 00 05 00 06 0 03 3 0 12 00 01 06 02 00 0 02 7 0 18 00 00 06 00 10 0 01 3 0};";
        }
        return "";
    }
};
addPossibleValuesFunction(SionPresetVoiceVALSOUND_STRPAD, SionPresetVoiceVALSOUND_STRPAD._ACCORDION1, SionPresetVoiceVALSOUND_STRPAD._VOICE_O3_O5);
var SionPresetVoiceVALSOUND_WIND = {
    _CLARINET_1: 0,
    _CLARINET_2_BRIGHTER: 1,
    _E_FLUTE: 2,
    _E_FLUTE_2: 3,
    _FLUTE__BELL: 4,
    _OLD_FLUTE: 5,
    _WHITSLE_1: 6,
    _WHITSLE_2: 7,
    toString: function(cat) {
        switch (cat) {
            case SionPresetVoiceVALSOUND_WIND._CLARINET_1:
                return "Clarinet #1";
            case SionPresetVoiceVALSOUND_WIND._CLARINET_2_BRIGHTER:
                return "Clarinet #2 Brighter";
            case SionPresetVoiceVALSOUND_WIND._E_FLUTE:
                return "E.Flute";
            case SionPresetVoiceVALSOUND_WIND._E_FLUTE_2:
                return "E.Flute 2";
            case SionPresetVoiceVALSOUND_WIND._FLUTE__BELL:
                return "Flute + Bell";
            case SionPresetVoiceVALSOUND_WIND._OLD_FLUTE:
                return "Old flute";
            case SionPresetVoiceVALSOUND_WIND._WHITSLE_1:
                return "Whitsle 1";
            case SionPresetVoiceVALSOUND_WIND._WHITSLE_2:
                return "Whitsle 2";
        }
        return "Unknown " + cat;
    },
    getMML: function(cat, index) {
        switch (cat) {
            case SionPresetVoiceVALSOUND_WIND._CLARINET_1:
                return "#OPN@" + index + "{3 7  31 00 00 07 00 35 0 04 0 0 25 14 00 04 02 42 0 04 0 0 31 00 00 08 00 38 0 02 0 0 18 07 00 08 01 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_WIND._CLARINET_2_BRIGHTER:
                return "#OPN@" + index + "{3 7  31 00 00 07 00 40 0 08 0 0 27 17 00 04 04 45 0 08 0 0 31 00 00 08 00 37 0 04 0 0 18 07 00 08 01 00 0 01 0 0};";
            case SionPresetVoiceVALSOUND_WIND._E_FLUTE:
                return "#OPN@" + index + "{3 0  20 00 00 10 00 38 0 06 0 0 14 16 00 10 05 36 0 02 3 0 18 18 00 10 03 40 0 04 0 0 14 12 00 10 01 00 0 02 0 0};";
            case SionPresetVoiceVALSOUND_WIND._E_FLUTE_2:
                return "#OPN@" + index + "{3 5  20 00 00 10 00 28 0 02 3 0 14 16 00 10 05 40 0 02 3 0 18 18 00 10 03 34 0 04 0 0 14 12 00 10 01 00 0 02 7 0};";
            case SionPresetVoiceVALSOUND_WIND._FLUTE__BELL:
                return "#OPN@" + index + "{4 5  16 00 00 08 01 47 0 08 3 0 14 00 00 08 00 00 0 04 3 0 31 12 00 08 02 45 0 14 7 0 31 08 00 08 15 00 0 08 7 0};";
            case SionPresetVoiceVALSOUND_WIND._OLD_FLUTE:
                return "#OPN@" + index + "{2 7  20 05 00 14 01 50 0 04 0 0 15 15 00 14 02 45 0 08 0 0 18 15 00 14 02 50 0 08 0 0 14 02 00 14 00 00 0 04 0 0};";
            case SionPresetVoiceVALSOUND_WIND._WHITSLE_1:
                return "#OPN@" + index + "{2 7  20 05 00 14 01 60 0 04 0 0 15 15 00 14 02 55 0 12 0 0 18 15 00 14 02 60 0 08 0 0 14 02 00 14 00 00 0 04 0 0};";
            case SionPresetVoiceVALSOUND_WIND._WHITSLE_2:
                return "#OPN@" + index + "{2 7  20 05 00 14 01 55 0 02 0 0 15 15 00 14 02 55 0 08 0 0 18 15 00 14 02 60 0 08 0 0 14 02 00 14 00 00 0 04 0 0};";
        }
        return "";
    }
};
addPossibleValuesFunction(SionPresetVoiceVALSOUND_WIND, SionPresetVoiceVALSOUND_WIND._CLARINET_1, SionPresetVoiceVALSOUND_WIND._WHITSLE_2);
var SionPresetVoiceVALSOUND_WORLD = {
    _BANJO_HARPCI: 0,
    _KOTO: 1,
    _KOTO_2: 2,
    _SITAR_1: 3,
    _SHAMISEN_2: 4,
    _SHAMISEN_1: 5,
    _SYNTH_SHAMISEN: 6,
    toString: function(cat) {
        switch (cat) {
            case SionPresetVoiceVALSOUND_WORLD._BANJO_HARPCI:
                return "Banjo (Harpci)";
            case SionPresetVoiceVALSOUND_WORLD._KOTO:
                return "KOTO";
            case SionPresetVoiceVALSOUND_WORLD._KOTO_2:
                return "Koto 2";
            case SionPresetVoiceVALSOUND_WORLD._SITAR_1:
                return "Sitar 1";
            case SionPresetVoiceVALSOUND_WORLD._SHAMISEN_2:
                return "Shamisen 2";
            case SionPresetVoiceVALSOUND_WORLD._SHAMISEN_1:
                return "Shamisen 1";
            case SionPresetVoiceVALSOUND_WORLD._SYNTH_SHAMISEN:
                return "Synth Shamisen";
        }
        return "Unknown " + cat;
    },
    getMML: function(cat, index) {
        switch (cat) {
            case SionPresetVoiceVALSOUND_WORLD._BANJO_HARPCI:
                return "#OPN@" + index + "{1 7  31 07 00 10 15 38 0 12 7 0 31 08 06 07 03 52 0 10 1 0 31 12 06 07 03 25 0 01 0 0 31 11 07 07 03 00 0 03 5 0};";
            case SionPresetVoiceVALSOUND_WORLD._KOTO:
                return "#OPN@" + index + "{3 0  31 00 00 10 00 38 0 06 0 0 24 13 00 10 05 40 0 02 3 0 28 15 00 10 03 40 0 04 0 0 24 12 08 10 02 00 0 02 0 0};";
            case SionPresetVoiceVALSOUND_WORLD._KOTO_2:
                return "#OPN@" + index + "{0 7  31 07 03 03 02 30 0 03 7 0 31 05 03 03 01 30 0 02 0 0 31 05 03 05 02 30 0 01 0 0 31 10 03 07 02 00 0 01 3 0};";
            case SionPresetVoiceVALSOUND_WORLD._SITAR_1:
                return "#OPN@" + index + "{0 6  18 05 03 01 02 30 0 03 7 0 31 05 04 01 01 28 0 02 0 0 31 05 03 03 02 35 0 01 0 0 31 10 02 05 04 00 0 01 3 0};";
            case SionPresetVoiceVALSOUND_WORLD._SHAMISEN_2:
                return "#OPN@" + index + "{3 7  31 16 06 07 02 33 0 01 3 0 31 16 06 07 04 18 0 06 0 0 31 06 06 07 01 40 0 01 7 0 31 15 06 07 05 00 0 02 0 0};";
            case SionPresetVoiceVALSOUND_WORLD._SHAMISEN_1:
                return "#OPN@" + index + "{2 7  31 16 06 07 02 33 0 01 3 0 31 16 06 07 04 18 0 08 0 0 31 06 06 07 01 40 0 01 7 0 31 15 06 07 05 00 0 02 0 0};";
            case SionPresetVoiceVALSOUND_WORLD._SYNTH_SHAMISEN:
                return "#OPN@" + index + "{2 7  31 16 06 07 01 33 0 01 3 0 31 16 06 07 04 18 0 07 0 0 31 06 06 07 00 40 0 01 7 0 31 15 06 07 02 00 0 02 0 0};";
        }
        return "";
    }
};
addPossibleValuesFunction(SionPresetVoiceVALSOUND_WORLD, SionPresetVoiceVALSOUND_WORLD._BANJO_HARPCI, SionPresetVoiceVALSOUND_WORLD._SYNTH_SHAMISEN);
var SionPresetVoiceMIDI = {
    _GRANDPNO: 0,
    _BRITEPNO: 1,
    _E_GRANDP: 2,
    _HNKYTONK: 3,
    _E_PIANO1: 4,
    _E_PIANO2: 5,
    _HARPSI: 6,
    _CLAVI: 7,
    _CELESTA: 8,
    _GLOCKEN: 9,
    _MUSICBOX: 10,
    _VIBES: 11,
    _MARIMBA: 12,
    _XYLOPHON: 13,
    _TUBULBEL: 14,
    _DULCIMER: 15,
    _DRAWORGN: 16,
    _PERCORGN: 17,
    _ROCKORGN: 18,
    _CHRCHORG: 19,
    _REEDORGN: 20,
    _ACORDION: 21,
    _HARMNICA: 22,
    _TANGOACD: 23,
    _NYLONGTR: 24,
    _STEELGTR: 25,
    _JAZZ_GTR: 26,
    _CLEANGTR: 27,
    _MUTE_GTR: 28,
    _OVRDRIVE: 29,
    _DIST_GTR: 30,
    _GTRHARMO: 31,
    _ACO_BASS: 32,
    _FNGRBASS: 33,
    _PICKBASS: 34,
    _FRETLESS: 35,
    _SLAPBAS1: 36,
    _SLAPBAS2: 37,
    _SYNBASS1: 38,
    _SYNBASS2: 39,
    _VIOLIN: 40,
    _VIOLA: 41,
    _CELLO: 42,
    _CONTRABS: 43,
    _TREM_STR: 44,
    _PIZZ_STR: 45,
    _HARP: 46,
    _TIMPANI: 47,
    _STRINGS1: 48,
    _STRINGS2: 49,
    _SYN_STR1: 50,
    _SYN_STR2: 51,
    _CHOIRAAH: 52,
    _VOICEOOH: 53,
    _SYNVOICE: 54,
    _ORCH_HIT: 55,
    _TRUMPET: 56,
    _TROMBONE: 57,
    _TUBA: 58,
    _MUTE_TRP: 59,
    _FR_HORN: 60,
    _BRASSECT: 61,
    _SYNBRAS1: 62,
    _SYNBRAS2: 63,
    _SPRNOSAX: 64,
    _ALTO_SAX: 65,
    _TENORSAX: 66,
    _BARI_SAX: 67,
    _OBOE: 68,
    _ENG_HORN: 69,
    _BASSOON: 70,
    _CLARINET: 71,
    _PICCOLO: 72,
    _FLUTE: 73,
    _RECORDER: 74,
    _PANFLUTE: 75,
    _BOTTLE: 76,
    _SHAKHCHI: 77,
    _WHISTLE: 78,
    _OCARINA: 79,
    _SQUARELD: 80,
    _SAW_LEAD: 81,
    _CALIOPLD: 82,
    _CHIFFLD: 83,
    _CHARANLD: 84,
    _VOICE_LD: 85,
    _FIFTH_LD: 86,
    _BASS_LD: 87,
    _NEWAGEPD: 88,
    _WARM_PAD: 89,
    _POLYSYPD: 90,
    _CHOIRPAD: 91,
    _BOWEDPAD: 92,
    _METALPAD: 93,
    _HALO_PAD: 94,
    _SWEEPPAD: 95,
    _RAIN: 96,
    _SOUNDTRK: 97,
    _CRYSTAL: 98,
    _ATMOSPHR: 99,
    _BRIGHT: 100,
    _GOBLINS: 101,
    _ECHOES: 102,
    _SCI_FI: 103,
    _SITAR: 104,
    _BANJO: 105,
    _SHAMISEN: 106,
    _KOTO: 107,
    _KALIMBA: 108,
    _BAGPIPE: 109,
    _FIDDLE: 110,
    _SHANAI: 111,
    _TNKLBELL: 112,
    _AGOGO: 113,
    _STEELDRM: 114,
    _WOODBLOK: 115,
    _TAIKODRM: 116,
    _MELODTOM: 117,
    _SYN_DRUM: 118,
    _REVCYMBL: 119,
    _FRETNOIZ: 120,
    _BRTHNOIZ: 121,
    _SEASHORE: 122,
    _TWEET: 123,
    _TELPHONE: 124,
    _HELICPTR: 125,
    _APPLAUSE: 126,
    _GUNSHOT: 127,
    toString: function(cat) {
        switch (cat) {
            case SionPresetVoiceMIDI._GRANDPNO:
                return "GrandPno";
            case SionPresetVoiceMIDI._BRITEPNO:
                return "BritePno";
            case SionPresetVoiceMIDI._E_GRANDP:
                return "E.GrandP";
            case SionPresetVoiceMIDI._HNKYTONK:
                return "HnkyTonk";
            case SionPresetVoiceMIDI._E_PIANO1:
                return "E.Piano1";
            case SionPresetVoiceMIDI._E_PIANO2:
                return "E.Piano2";
            case SionPresetVoiceMIDI._HARPSI:
                return "Harpsi.";
            case SionPresetVoiceMIDI._CLAVI:
                return "Clavi.";
            case SionPresetVoiceMIDI._CELESTA:
                return "Celesta";
            case SionPresetVoiceMIDI._GLOCKEN:
                return "Glocken";
            case SionPresetVoiceMIDI._MUSICBOX:
                return "MusicBox";
            case SionPresetVoiceMIDI._VIBES:
                return "Vibes";
            case SionPresetVoiceMIDI._MARIMBA:
                return "Marimba";
            case SionPresetVoiceMIDI._XYLOPHON:
                return "Xylophon";
            case SionPresetVoiceMIDI._TUBULBEL:
                return "TubulBel";
            case SionPresetVoiceMIDI._DULCIMER:
                return "Dulcimer";
            case SionPresetVoiceMIDI._DRAWORGN:
                return "DrawOrgn";
            case SionPresetVoiceMIDI._PERCORGN:
                return "PercOrgn";
            case SionPresetVoiceMIDI._ROCKORGN:
                return "RockOrgn";
            case SionPresetVoiceMIDI._CHRCHORG:
                return "ChrchOrg";
            case SionPresetVoiceMIDI._REEDORGN:
                return "ReedOrgn";
            case SionPresetVoiceMIDI._ACORDION:
                return "Acordion";
            case SionPresetVoiceMIDI._HARMNICA:
                return "Harmnica";
            case SionPresetVoiceMIDI._TANGOACD:
                return "TangoAcd";
            case SionPresetVoiceMIDI._NYLONGTR:
                return "NylonGtr";
            case SionPresetVoiceMIDI._STEELGTR:
                return "SteelGtr";
            case SionPresetVoiceMIDI._JAZZ_GTR:
                return "Jazz Gtr";
            case SionPresetVoiceMIDI._CLEANGTR:
                return "CleanGtr";
            case SionPresetVoiceMIDI._MUTE_GTR:
                return "Mute.Gtr";
            case SionPresetVoiceMIDI._OVRDRIVE:
                return "Ovrdrive";
            case SionPresetVoiceMIDI._DIST_GTR:
                return "Dist.Gtr";
            case SionPresetVoiceMIDI._GTRHARMO:
                return "GtrHarmo";
            case SionPresetVoiceMIDI._ACO_BASS:
                return "Aco.Bass";
            case SionPresetVoiceMIDI._FNGRBASS:
                return "FngrBass";
            case SionPresetVoiceMIDI._PICKBASS:
                return "PickBass";
            case SionPresetVoiceMIDI._FRETLESS:
                return "Fretless";
            case SionPresetVoiceMIDI._SLAPBAS1:
                return "SlapBas1";
            case SionPresetVoiceMIDI._SLAPBAS2:
                return "SlapBas2";
            case SionPresetVoiceMIDI._SYNBASS1:
                return "SynBass1";
            case SionPresetVoiceMIDI._SYNBASS2:
                return "SynBass2";
            case SionPresetVoiceMIDI._VIOLIN:
                return "Violin";
            case SionPresetVoiceMIDI._VIOLA:
                return "Viola";
            case SionPresetVoiceMIDI._CELLO:
                return "Cello";
            case SionPresetVoiceMIDI._CONTRABS:
                return "ContraBs";
            case SionPresetVoiceMIDI._TREM_STR:
                return "Trem.Str";
            case SionPresetVoiceMIDI._PIZZ_STR:
                return "Pizz.Str";
            case SionPresetVoiceMIDI._HARP:
                return "Harp";
            case SionPresetVoiceMIDI._TIMPANI:
                return "Timpani";
            case SionPresetVoiceMIDI._STRINGS1:
                return "Strings1";
            case SionPresetVoiceMIDI._STRINGS2:
                return "Strings2";
            case SionPresetVoiceMIDI._SYN_STR1:
                return "Syn.Str1";
            case SionPresetVoiceMIDI._SYN_STR2:
                return "Syn.Str2";
            case SionPresetVoiceMIDI._CHOIRAAH:
                return "ChoirAah";
            case SionPresetVoiceMIDI._VOICEOOH:
                return "VoiceOoh";
            case SionPresetVoiceMIDI._SYNVOICE:
                return "SynVoice";
            case SionPresetVoiceMIDI._ORCH_HIT:
                return "Orch.Hit";
            case SionPresetVoiceMIDI._TRUMPET:
                return "Trumpet";
            case SionPresetVoiceMIDI._TROMBONE:
                return "Trombone";
            case SionPresetVoiceMIDI._TUBA:
                return "Tuba";
            case SionPresetVoiceMIDI._MUTE_TRP:
                return "Mute.Trp";
            case SionPresetVoiceMIDI._FR_HORN:
                return "Fr.Horn";
            case SionPresetVoiceMIDI._BRASSECT:
                return "BrasSect";
            case SionPresetVoiceMIDI._SYNBRAS1:
                return "SynBras1";
            case SionPresetVoiceMIDI._SYNBRAS2:
                return "SynBras2";
            case SionPresetVoiceMIDI._SPRNOSAX:
                return "SprnoSax";
            case SionPresetVoiceMIDI._ALTO_SAX:
                return "Alto Sax";
            case SionPresetVoiceMIDI._TENORSAX:
                return "TenorSax";
            case SionPresetVoiceMIDI._BARI_SAX:
                return "Bari.Sax";
            case SionPresetVoiceMIDI._OBOE:
                return "Oboe";
            case SionPresetVoiceMIDI._ENG_HORN:
                return "Eng.Horn";
            case SionPresetVoiceMIDI._BASSOON:
                return "Bassoon";
            case SionPresetVoiceMIDI._CLARINET:
                return "Clarinet";
            case SionPresetVoiceMIDI._PICCOLO:
                return "Piccolo";
            case SionPresetVoiceMIDI._FLUTE:
                return "Flute";
            case SionPresetVoiceMIDI._RECORDER:
                return "Recorder";
            case SionPresetVoiceMIDI._PANFLUTE:
                return "PanFlute";
            case SionPresetVoiceMIDI._BOTTLE:
                return "Bottle";
            case SionPresetVoiceMIDI._SHAKHCHI:
                return "Shakhchi";
            case SionPresetVoiceMIDI._WHISTLE:
                return "Whistle";
            case SionPresetVoiceMIDI._OCARINA:
                return "Ocarina";
            case SionPresetVoiceMIDI._SQUARELD:
                return "SquareLd";
            case SionPresetVoiceMIDI._SAW_LEAD:
                return "Saw.Lead";
            case SionPresetVoiceMIDI._CALIOPLD:
                return "CaliopLd";
            case SionPresetVoiceMIDI._CHIFFLD:
                return "ChiffLd";
            case SionPresetVoiceMIDI._CHARANLD:
                return "CharanLd";
            case SionPresetVoiceMIDI._VOICE_LD:
                return "Voice Ld";
            case SionPresetVoiceMIDI._FIFTH_LD:
                return "Fifth Ld";
            case SionPresetVoiceMIDI._BASS_LD:
                return "Bass &Ld";
            case SionPresetVoiceMIDI._NEWAGEPD:
                return "NewAgePd";
            case SionPresetVoiceMIDI._WARM_PAD:
                return "Warm Pad";
            case SionPresetVoiceMIDI._POLYSYPD:
                return "PolySyPd";
            case SionPresetVoiceMIDI._CHOIRPAD:
                return "ChoirPad";
            case SionPresetVoiceMIDI._BOWEDPAD:
                return "BowedPad";
            case SionPresetVoiceMIDI._METALPAD:
                return "MetalPad";
            case SionPresetVoiceMIDI._HALO_PAD:
                return "Halo Pad";
            case SionPresetVoiceMIDI._SWEEPPAD:
                return "SweepPad";
            case SionPresetVoiceMIDI._RAIN:
                return "Rain";
            case SionPresetVoiceMIDI._SOUNDTRK:
                return "SoundTrk";
            case SionPresetVoiceMIDI._CRYSTAL:
                return "Crystal";
            case SionPresetVoiceMIDI._ATMOSPHR:
                return "Atmosphr";
            case SionPresetVoiceMIDI._BRIGHT:
                return "Bright";
            case SionPresetVoiceMIDI._GOBLINS:
                return "Goblins";
            case SionPresetVoiceMIDI._ECHOES:
                return "Echoes";
            case SionPresetVoiceMIDI._SCI_FI:
                return "Sci-Fi";
            case SionPresetVoiceMIDI._SITAR:
                return "Sitar";
            case SionPresetVoiceMIDI._BANJO:
                return "Banjo";
            case SionPresetVoiceMIDI._SHAMISEN:
                return "Shamisen";
            case SionPresetVoiceMIDI._KOTO:
                return "Koto";
            case SionPresetVoiceMIDI._KALIMBA:
                return "Kalimba";
            case SionPresetVoiceMIDI._BAGPIPE:
                return "Bagpipe";
            case SionPresetVoiceMIDI._FIDDLE:
                return "Fiddle";
            case SionPresetVoiceMIDI._SHANAI:
                return "Shanai";
            case SionPresetVoiceMIDI._TNKLBELL:
                return "TnklBell";
            case SionPresetVoiceMIDI._AGOGO:
                return "Agogo";
            case SionPresetVoiceMIDI._STEELDRM:
                return "SteelDrm";
            case SionPresetVoiceMIDI._WOODBLOK:
                return "WoodBlok";
            case SionPresetVoiceMIDI._TAIKODRM:
                return "TaikoDrm";
            case SionPresetVoiceMIDI._MELODTOM:
                return "MelodTom";
            case SionPresetVoiceMIDI._SYN_DRUM:
                return "Syn.Drum";
            case SionPresetVoiceMIDI._REVCYMBL:
                return "RevCymbl";
            case SionPresetVoiceMIDI._FRETNOIZ:
                return "FretNoiz";
            case SionPresetVoiceMIDI._BRTHNOIZ:
                return "BrthNoiz";
            case SionPresetVoiceMIDI._SEASHORE:
                return "Seashore";
            case SionPresetVoiceMIDI._TWEET:
                return "Tweet";
            case SionPresetVoiceMIDI._TELPHONE:
                return "Telphone";
            case SionPresetVoiceMIDI._HELICPTR:
                return "Helicptr";
            case SionPresetVoiceMIDI._APPLAUSE:
                return "Applause";
            case SionPresetVoiceMIDI._GUNSHOT:
                return "Gunshot";
        }
        return "Unknown " + cat;
    },
    getMML: function(cat, index) {
        switch (cat) {
            case SionPresetVoiceMIDI._GRANDPNO:
                return "#MA@" + index + "{3 0  08 15 07 00 06 15 39 0 1 01 0 0 00 14 03 02 03 02 28 1 3 05 0 0 00 13 01 01 04 03 22 0 0 01 0 0 00 13 03 02 06 04 00 1 2 01 0 0};";
            case SionPresetVoiceMIDI._BRITEPNO:
                return "#MA@" + index + "{3 0  00 15 02 02 02 05 39 1 2 01 0 0 00 15 02 02 03 15 28 0 2 05 0 0 00 15 02 02 02 13 25 1 2 01 0 0 00 15 02 01 05 04 10 1 0 01 0 0};";
            case SionPresetVoiceMIDI._E_GRANDP:
                return "#MA@" + index + "{5 6  00 13 02 02 04 06 20 1 1 04 0 0 00 13 01 01 06 07 08 1 2 01 0 0 00 13 03 03 04 14 11 1 1 02 0 0 00 13 01 01 05 15 08 1 2 02 0 0};";
            case SionPresetVoiceMIDI._HNKYTONK:
                return "#MA@" + index + "{5 6  00 15 01 02 05 14 26 1 0 01 3 2 00 13 03 02 10 03 02 1 2 02 7 2 00 12 01 02 05 03 23 0 0 01 7 0 00 13 03 03 10 03 02 1 2 02 3 2};";
            case SionPresetVoiceMIDI._E_PIANO1:
                return "#MA@" + index + "{3 1  00 11 03 02 10 03 27 1 1 03 0 1 00 11 02 02 09 04 27 0 3 03 0 0 00 10 04 01 04 01 19 1 1 02 0 0 00 10 01 01 07 08 05 1 0 01 0 1};";
            case SionPresetVoiceMIDI._E_PIANO2:
                return "#MA@" + index + "{5 5  18 15 04 05 12 11 35 1 0 07 0 2 00 15 02 01 08 15 04 0 2 01 0 2 00 15 00 01 11 01 18 1 1 01 0 2 00 15 02 01 07 15 04 1 0 01 0 2};";
            case SionPresetVoiceMIDI._HARPSI:
                return "#MA@" + index + "{6 4  04 14 02 02 05 00 00 1 1 01 0 0 03 15 02 00 05 03 20 1 3 06 0 0 04 15 03 00 01 06 28 1 2 07 0 0 05 14 02 02 07 15 04 1 0 01 0 0};";
            case SionPresetVoiceMIDI._CLAVI:
                return "#MA@" + index + "{3 5  05 15 01 01 06 15 24 0 0 01 0 2 00 15 01 01 05 00 29 0 0 01 0 2 04 15 03 03 07 02 27 1 1 07 0 2 00 15 02 02 09 02 08 1 0 03 0 2};";
            case SionPresetVoiceMIDI._CELESTA:
                return "#MA@" + index + "{5 2  02 14 06 06 05 15 21 1 2 09 0 0 00 13 04 04 04 14 06 0 0 01 0 0 05 14 06 06 06 12 22 1 3 10 0 0 00 14 04 04 04 14 06 0 0 01 0 0};";
            case SionPresetVoiceMIDI._GLOCKEN:
                return "#MA@" + index + "{7 0  00 15 09 03 04 04 09 1 0 07 0 2 00 15 11 02 03 11 15 1 0 04 0 2 00 15 03 02 04 04 18 1 1 02 0 2 00 15 04 03 04 14 04 0 0 01 0 2};";
            case SionPresetVoiceMIDI._MUSICBOX:
                return "#MA@" + index + "{5 0  01 05 05 02 02 00 32 1 2 02 0 0 00 15 04 03 02 00 01 1 1 01 3 0 01 10 05 02 02 00 28 1 0 09 0 0 00 15 02 01 01 00 06 1 0 01 7 0};";
            case SionPresetVoiceMIDI._VIBES:
                return "#MA@" + index + "{5 0  00 12 04 02 04 02 23 0 0 07 0 2 00 13 09 02 05 06 07 1 2 04 0 2 00 12 04 02 03 02 30 1 0 08 0 2 00 13 02 03 04 15 07 0 0 01 0 1};";
            case SionPresetVoiceMIDI._MARIMBA:
                return "#MA@" + index + "{5 7  00 10 07 04 04 15 40 1 1 12 0 0 00 11 04 04 05 15 05 0 0 01 0 0 00 11 07 06 04 15 33 1 0 06 0 0 00 13 04 05 05 15 05 1 0 01 0 0};";
            case SionPresetVoiceMIDI._XYLOPHON:
                return "#MA@" + index + "{5 2  00 15 09 06 06 13 24 0 2 05 0 0 00 15 07 05 07 13 03 0 0 01 0 0 00 15 06 06 06 10 29 1 2 05 0 0 00 15 06 06 07 14 00 0 2 01 0 0};";
            case SionPresetVoiceMIDI._TUBULBEL:
                return "#MA@" + index + "{5 0  16 15 04 03 03 05 16 0 1 10 0 1 00 15 03 02 03 02 05 0 0 01 0 0 08 15 04 03 03 05 16 0 1 07 3 1 00 15 03 02 03 02 05 0 2 02 7 0};";
            case SionPresetVoiceMIDI._DULCIMER:
                return "#MA@" + index + "{6 3  01 14 10 04 04 12 06 0 2 02 0 0 01 11 03 03 03 05 20 0 1 03 0 0 00 13 03 03 03 00 10 0 0 01 0 0 00 12 04 04 04 06 06 0 0 01 0 0};";
            case SionPresetVoiceMIDI._DRAWORGN:
                return "#MA@" + index + "{2 0  00 15 04 00 12 00 00 0 2 00 0 1 04 15 05 00 12 00 00 0 1 01 0 0 09 13 05 00 12 01 07 0 2 03 1 1 04 15 01 00 12 00 07 0 2 02 0 1};";
            case SionPresetVoiceMIDI._PERCORGN:
                return "#MA@" + index + "{7 4  00 14 05 00 10 01 03 0 2 00 2 2 00 13 08 00 00 05 29 0 0 02 0 0 00 14 05 00 10 01 01 0 2 01 3 0 00 14 06 00 10 00 01 0 2 02 7 0};";
            case SionPresetVoiceMIDI._ROCKORGN:
                return "#MA@" + index + "{7 4  00 15 15 00 13 00 09 0 1 01 3 3 21 11 15 00 10 01 05 0 1 01 0 2 00 15 15 00 14 00 09 0 0 02 6 0 17 15 15 00 14 00 09 0 0 00 7 1};";
            case SionPresetVoiceMIDI._CHRCHORG:
                return "#MA@" + index + "{7 0  00 09 15 00 05 00 19 0 2 03 0 0 00 11 07 00 02 02 29 0 0 07 0 0 00 08 15 00 05 00 04 0 2 01 0 0 05 08 07 00 05 00 04 0 2 00 0 0};";
            case SionPresetVoiceMIDI._REEDORGN:
                return "#MA@" + index + "{5 3  16 07 08 00 05 01 24 1 2 02 0 0 00 05 15 00 06 00 00 1 2 01 0 0 05 06 12 00 05 03 10 1 1 01 0 0 00 05 15 00 07 00 00 1 1 02 0 0};";
            case SionPresetVoiceMIDI._ACORDION:
                return "#MA@" + index + "{5 2  17 08 02 00 00 01 21 0 0 03 6 0 00 07 02 00 10 02 02 0 1 01 7 0 17 06 15 00 00 01 18 0 0 01 2 0 00 07 15 00 10 00 07 0 2 02 3 0};";
            case SionPresetVoiceMIDI._HARMNICA:
                return "#MA@" + index + "{4 0  00 15 15 00 09 00 44 0 3 15 0 0 00 15 15 00 08 00 41 0 0 10 0 0 00 15 15 00 08 00 36 0 0 01 0 0 00 06 15 00 08 00 03 0 2 02 0 0};";
            case SionPresetVoiceMIDI._TANGOACD:
                return "#MA@" + index + "{5 4  12 07 12 00 00 00 15 0 0 02 1 1 00 07 02 00 10 00 10 0 2 02 1 0 05 07 15 00 00 00 20 0 0 01 0 0 16 07 15 00 10 00 10 0 0 01 0 1};";
            case SionPresetVoiceMIDI._NYLONGTR:
                return "#MA@" + index + "{5 6  00 14 01 01 04 08 21 1 1 01 0 0 00 15 03 03 07 15 00 0 0 01 0 0 01 11 05 05 05 04 14 1 0 03 0 0 00 13 04 04 09 15 13 0 2 01 0 0};";
            case SionPresetVoiceMIDI._STEELGTR:
                return "#MA@" + index + "{4 4  05 15 07 01 04 02 26 0 2 09 0 2 00 15 03 01 08 05 45 1 2 12 0 2 00 15 02 01 04 01 23 1 2 01 0 2 00 13 03 02 08 15 04 0 0 01 0 1};";
            case SionPresetVoiceMIDI._JAZZ_GTR:
                return "#MA@" + index + "{3 0  00 15 07 01 07 03 17 1 1 01 0 2 00 15 05 01 04 02 18 0 3 05 0 2 00 15 02 00 07 15 31 0 1 03 0 2 00 12 02 00 08 15 04 0 0 01 0 2};";
            case SionPresetVoiceMIDI._CLEANGTR:
                return "#MA@" + index + "{5 0  01 15 10 02 02 01 15 0 1 01 0 0 00 15 02 02 09 15 03 0 2 01 0 0 04 15 02 02 03 06 16 1 1 03 0 0 00 14 04 04 08 06 03 0 2 01 0 0};";
            case SionPresetVoiceMIDI._MUTE_GTR:
                return "#MA@" + index + "{5 7  00 13 08 06 07 07 17 1 0 00 0 0 00 14 09 03 09 07 00 0 0 00 0 0 00 14 03 03 08 09 04 0 3 01 0 0 00 11 04 03 10 03 00 1 0 01 0 0};";
            case SionPresetVoiceMIDI._OVRDRIVE:
                return "#MA@" + index + "{4 2  12 15 08 00 02 15 19 1 0 00 7 2 00 12 01 00 01 01 15 0 1 02 3 2 00 11 02 00 10 01 15 0 0 01 0 2 00 11 01 01 10 01 10 0 0 02 0 2};";
            case SionPresetVoiceMIDI._DIST_GTR:
                return "#MA@" + index + "{4 4  03 11 12 00 02 00 08 0 1 02 0 0 00 12 05 00 10 01 29 0 0 01 0 0 08 12 05 00 10 01 23 0 0 02 0 0 06 12 01 00 10 05 15 0 0 01 0 0};";
            case SionPresetVoiceMIDI._GTRHARMO:
                return "#MA@" + index + "{5 5  08 15 02 08 07 00 22 0 1 00 0 0 08 13 03 03 09 15 06 0 0 02 0 0 00 11 02 08 07 00 17 0 0 00 0 0 06 10 07 07 07 15 13 0 0 02 0 0};";
            case SionPresetVoiceMIDI._ACO_BASS:
                return "#MA@" + index + "{5 3  00 11 03 03 08 10 14 1 1 01 0 0 00 12 03 03 08 11 00 0 0 01 0 0 00 09 03 03 01 01 07 0 3 01 0 0 00 12 03 03 08 10 05 0 0 01 0 0};";
            case SionPresetVoiceMIDI._FNGRBASS:
                return "#MA@" + index + "{3 6  00 10 02 01 03 01 28 1 2 01 0 2 00 09 04 03 06 04 58 1 0 12 0 2 00 11 03 02 03 02 22 1 2 01 0 2 00 11 01 01 08 02 00 1 0 02 0 2};";
            case SionPresetVoiceMIDI._PICKBASS:
                return "#MA@" + index + "{3 5  00 15 07 02 03 01 19 1 2 01 0 2 00 12 11 04 06 07 21 1 0 07 0 2 00 15 09 02 06 02 23 1 2 02 0 2 00 11 02 06 08 06 00 1 0 01 0 2};";
            case SionPresetVoiceMIDI._FRETLESS:
                return "#MA@" + index + "{3 4  00 12 03 02 03 01 29 1 2 01 2 2 00 10 03 03 06 03 25 1 2 01 1 2 00 09 03 02 06 01 25 1 2 01 0 2 00 11 01 02 08 02 00 1 0 02 0 2};";
            case SionPresetVoiceMIDI._SLAPBAS1:
                return "#MA@" + index + "{3 3  00 15 07 02 03 02 14 1 2 01 0 2 00 15 06 06 06 04 21 1 0 09 0 2 00 12 09 02 06 02 24 1 2 01 0 2 00 15 02 15 08 15 03 1 0 01 0 2};";
            case SionPresetVoiceMIDI._SLAPBAS2:
                return "#MA@" + index + "{3 2  00 15 07 02 03 01 14 1 2 01 0 2 00 11 05 06 07 02 18 0 0 12 0 2 00 09 09 02 06 02 30 1 2 01 0 2 00 15 02 06 08 06 06 1 0 01 0 2};";
            case SionPresetVoiceMIDI._SYNBASS1:
                return "#MA@" + index + "{3 5  00 14 06 02 08 05 14 0 0 01 0 0 08 14 04 01 08 06 39 0 1 02 0 0 00 14 02 01 08 06 35 0 0 01 0 0 00 14 02 02 08 09 00 0 0 01 0 0};";
            case SionPresetVoiceMIDI._SYNBASS2:
                return "#MA@" + index + "{5 6  00 15 05 07 08 06 20 0 0 02 0 2 00 15 01 07 08 12 00 0 1 02 0 2 00 15 03 07 07 06 20 0 0 01 0 2 00 15 02 07 08 12 00 0 1 01 0 2};";
            case SionPresetVoiceMIDI._VIOLIN:
                return "#MA@" + index + "{5 2  12 06 00 00 03 00 18 1 2 01 0 0 00 06 04 00 07 02 03 0 0 01 5 0 06 14 05 07 10 00 06 1 1 04 0 0 00 06 07 07 07 15 03 0 2 01 1 0};";
            case SionPresetVoiceMIDI._VIOLA:
                return "#MA@" + index + "{5 2  01 06 00 00 03 00 09 1 2 01 0 0 00 06 06 00 07 01 03 0 0 01 0 0 06 14 06 07 07 00 08 1 1 01 0 0 00 06 07 07 07 15 03 0 2 01 0 0};";
            case SionPresetVoiceMIDI._CELLO:
                return "#MA@" + index + "{3 4  01 15 06 00 06 00 16 0 0 01 0 0 00 15 05 15 14 15 20 0 0 05 0 2 00 15 05 00 07 02 45 0 0 01 0 0 00 06 03 00 07 01 01 0 2 03 0 0};";
            case SionPresetVoiceMIDI._CONTRABS:
                return "#MA@" + index + "{3 6  00 15 06 00 02 00 25 0 0 01 0 0 17 15 06 15 14 15 21 0 0 05 0 2 00 15 06 00 04 03 27 0 0 03 0 0 00 06 03 00 07 01 00 0 2 02 0 0};";
            case SionPresetVoiceMIDI._TREM_STR:
                return "#MA@" + index + "{5 3  20 07 02 00 03 01 22 1 2 01 2 0 00 06 03 00 06 01 02 0 0 02 0 1 12 07 03 00 04 00 22 1 1 01 4 0 00 06 03 00 06 01 02 0 0 01 0 2};";
            case SionPresetVoiceMIDI._PIZZ_STR:
                return "#MA@" + index + "{5 7  00 15 11 05 11 09 20 0 0 01 0 0 00 14 07 08 07 02 00 0 0 01 0 0 08 15 07 06 05 15 17 0 1 01 0 0 00 12 06 05 06 15 00 0 0 01 0 0};";
            case SionPresetVoiceMIDI._HARP:
                return "#MA@" + index + "{3 6  00 15 08 05 08 04 41 0 0 02 0 0 00 11 08 07 09 04 33 0 0 05 0 0 00 11 07 03 02 04 33 0 2 01 0 0 00 15 04 02 02 01 04 1 0 01 0 2};";
            case SionPresetVoiceMIDI._TIMPANI:
                return "#MA@" + index + "{3 3  00 15 08 04 03 03 04 1 1 01 0 2 00 15 02 02 02 15 33 1 0 00 7 2 00 15 07 03 03 00 28 1 2 01 0 2 08 15 04 03 03 15 00 1 0 00 0 2};";
            case SionPresetVoiceMIDI._STRINGS1:
                return "#MA@" + index + "{7 2  07 05 10 00 06 00 11 0 2 01 1 1 04 12 06 00 06 01 24 0 0 02 0 0 00 06 06 00 06 01 07 0 2 01 5 0 12 06 05 00 06 01 05 0 0 02 3 1};";
            case SionPresetVoiceMIDI._STRINGS2:
                return "#MA@" + index + "{7 3  09 06 10 00 05 00 00 0 0 01 3 0 02 12 06 00 05 01 23 0 0 01 0 1 01 05 06 00 06 00 00 0 2 01 5 0 27 05 05 00 06 01 07 0 0 01 7 0};";
            case SionPresetVoiceMIDI._SYN_STR1:
                return "#MA@" + index + "{5 0  00 09 08 00 02 01 27 0 0 01 6 0 00 07 15 00 05 00 07 0 0 01 3 0 04 09 11 00 02 00 20 1 0 01 3 0 00 06 15 00 04 00 00 0 1 01 7 0};";
            case SionPresetVoiceMIDI._SYN_STR2:
                return "#MA@" + index + "{5 5  09 09 08 00 02 01 19 0 0 01 0 0 00 06 06 00 05 00 06 0 0 01 0 0 27 08 08 00 02 00 10 0 0 01 0 0 00 05 07 00 04 03 00 0 1 01 0 0};";
            case SionPresetVoiceMIDI._CHOIRAAH:
                return "#MA@" + index + "{5 5  07 12 00 00 00 15 19 0 0 06 0 0 00 06 03 00 05 06 23 0 2 04 0 0 08 07 15 00 03 00 30 0 1 01 0 0 00 05 15 00 05 00 00 0 0 02 0 0};";
            case SionPresetVoiceMIDI._VOICEOOH:
                return "#MA@" + index + "{5 7  07 12 00 00 00 15 20 1 0 05 0 1 00 07 03 00 05 06 20 0 2 04 0 0 10 07 07 00 04 03 26 0 2 01 0 0 00 09 01 00 05 00 00 0 0 01 0 0};";
            case SionPresetVoiceMIDI._SYNVOICE:
                return "#MA@" + index + "{5 0  00 10 00 00 04 15 22 0 0 01 0 0 00 07 15 00 05 01 08 0 2 01 0 0 09 09 15 00 04 00 26 0 1 01 0 0 00 07 15 00 05 00 00 0 2 03 0 0};";
            case SionPresetVoiceMIDI._ORCH_HIT:
                return "#MA@" + index + "{7 5  08 15 04 04 06 06 00 1 0 04 0 1 06 12 05 03 03 01 00 0 0 01 0 0 06 12 07 06 06 00 00 0 0 01 0 0 06 11 07 07 06 00 00 0 0 00 0 0};";
            case SionPresetVoiceMIDI._TRUMPET:
                return "#MA@" + index + "{3 6  01 08 08 00 05 01 20 0 0 01 0 0 00 10 08 00 05 04 23 0 2 03 0 0 00 07 07 00 06 01 26 0 2 01 0 0 00 09 15 00 08 00 06 0 0 01 0 0};";
            case SionPresetVoiceMIDI._TROMBONE:
                return "#MA@" + index + "{3 7  08 07 06 00 07 01 28 0 0 01 0 0 00 09 08 00 05 04 15 0 2 01 0 0 01 06 07 00 07 01 26 0 2 01 0 0 00 08 15 00 08 00 05 0 0 01 0 0};";
            case SionPresetVoiceMIDI._TUBA:
                return "#MA@" + index + "{3 7  08 06 05 00 06 02 34 0 0 01 0 0 01 12 08 00 11 04 24 0 2 01 0 0 01 09 07 00 09 03 17 0 2 01 0 0 00 07 15 00 08 00 00 0 0 02 0 0};";
            case SionPresetVoiceMIDI._MUTE_TRP:
                return "#MA@" + index + "{5 0  10 07 00 00 07 05 26 0 0 03 0 0 02 09 13 00 09 04 00 0 0 00 0 0 17 07 09 00 06 01 19 0 0 05 0 0 02 08 07 00 09 02 00 0 0 01 0 0};";
            case SionPresetVoiceMIDI._FR_HORN:
                return "#MA@" + index + "{5 0  08 07 09 00 00 00 16 0 3 01 2 0 00 09 14 00 07 00 01 0 2 01 7 0 00 06 09 00 02 01 22 0 2 01 6 1 08 10 14 00 07 00 01 0 2 01 3 0};";
            case SionPresetVoiceMIDI._BRASSECT:
                return "#MA@" + index + "{5 6  00 08 06 00 02 01 22 0 0 01 7 2 00 09 15 00 08 00 08 0 0 01 7 2 12 07 07 00 05 01 22 0 0 01 0 2 00 09 08 00 08 00 07 0 0 01 0 2};";
            case SionPresetVoiceMIDI._SYNBRAS1:
                return "#MA@" + index + "{5 6  00 07 06 00 08 02 16 0 0 01 7 2 00 09 15 00 10 00 10 0 0 01 7 2 00 07 06 00 08 02 16 0 0 01 0 2 00 09 08 00 10 00 10 0 0 01 0 2};";
            case SionPresetVoiceMIDI._SYNBRAS2:
                return "#MA@" + index + "{3 6  00 06 03 00 04 01 28 0 0 01 0 0 01 09 07 00 05 07 39 0 0 06 0 0 08 07 05 03 03 11 35 0 0 01 0 0 00 15 15 00 07 00 04 0 0 01 0 0};";
            case SionPresetVoiceMIDI._SPRNOSAX:
                return "#MA@" + index + "{3 0  00 15 09 06 06 03 29 1 0 03 0 0 00 08 02 00 06 00 26 0 0 01 0 0 01 08 05 00 00 00 12 0 1 01 0 0 00 08 06 00 08 01 03 0 0 01 0 0};";
            case SionPresetVoiceMIDI._ALTO_SAX:
                return "#MA@" + index + "{5 4  01 09 03 00 00 00 10 1 2 01 0 2 00 08 02 00 09 00 09 0 0 01 0 2 09 09 03 00 00 00 13 1 2 01 0 2 01 09 02 00 09 00 21 0 0 01 0 2};";
            case SionPresetVoiceMIDI._TENORSAX:
                return "#MA@" + index + "{5 3  01 07 03 00 00 00 05 1 2 01 0 2 08 07 02 00 09 00 15 0 0 01 0 2 09 07 03 00 00 00 08 1 2 01 0 2 00 07 02 00 09 00 13 0 2 01 0 2};";
            case SionPresetVoiceMIDI._BARI_SAX:
                return "#MA@" + index + "{5 6  00 07 03 00 05 00 18 1 2 01 0 0 00 07 02 00 08 02 06 1 0 02 0 0 02 07 05 00 01 00 14 1 1 02 0 0 00 07 04 00 08 01 05 1 0 01 0 0};";
            case SionPresetVoiceMIDI._OBOE:
                return "#MA@" + index + "{5 0  05 10 00 00 04 00 30 0 2 01 0 0 00 09 01 01 09 00 09 0 0 03 0 0 00 11 00 00 04 02 24 0 0 01 0 1 00 10 00 00 10 00 14 0 0 02 0 0};";
            case SionPresetVoiceMIDI._ENG_HORN:
                return "#MA@" + index + "{5 0  05 10 00 00 04 00 34 0 2 01 0 0 00 09 01 01 09 01 11 0 0 03 0 0 00 11 00 00 04 02 24 0 0 01 0 1 00 10 00 01 10 01 11 0 0 02 0 0};";
            case SionPresetVoiceMIDI._BASSOON:
                return "#MA@" + index + "{5 0  01 12 07 00 00 01 24 1 2 01 0 0 09 07 01 00 08 01 00 1 2 03 0 0 01 12 07 00 00 01 24 1 2 01 0 0 09 07 01 00 08 01 03 1 0 03 1 0};";
            case SionPresetVoiceMIDI._CLARINET:
                return "#MA@" + index + "{5 7  00 07 02 00 01 01 37 1 2 02 0 0 00 08 02 00 08 01 03 0 0 01 0 0 00 05 02 00 01 01 26 1 1 04 0 0 00 07 02 00 08 01 03 0 0 01 0 0};";
            case SionPresetVoiceMIDI._PICCOLO:
                return "#MA@" + index + "{5 7  02 10 12 00 07 01 12 0 0 05 0 0 00 09 07 00 08 15 39 0 0 01 0 0 01 08 05 00 07 01 30 0 0 01 0 0 00 08 05 00 10 00 06 0 0 01 0 0};";
            case SionPresetVoiceMIDI._FLUTE:
                return "#MA@" + index + "{5 7  00 13 10 00 01 01 07 0 0 03 0 0 00 07 08 00 11 03 37 0 0 03 0 0 00 14 08 00 09 00 39 0 0 01 0 1 16 06 05 00 10 00 01 0 0 01 0 0};";
            case SionPresetVoiceMIDI._RECORDER:
                return "#MA@" + index + "{5 7  03 09 06 07 10 00 58 0 0 02 0 1 08 08 05 00 10 00 04 0 0 01 0 0 24 10 09 06 06 09 15 0 0 07 0 0 00 08 05 00 10 00 36 0 0 01 0 1};";
            case SionPresetVoiceMIDI._PANFLUTE:
                return "#MA@" + index + "{5 7  00 10 00 00 06 00 00 0 1 12 0 1 03 11 10 01 10 00 35 0 0 10 0 1 00 08 15 00 04 00 44 0 0 02 0 0 00 08 00 00 09 00 05 0 0 01 0 1};";
            case SionPresetVoiceMIDI._BOTTLE:
                return "#MA@" + index + "{5 7  10 12 12 00 07 01 12 1 0 05 0 0 00 07 07 00 09 06 27 0 0 01 0 0 08 07 08 00 08 03 11 0 3 02 0 1 00 07 05 00 08 00 01 0 0 01 0 0};";
            case SionPresetVoiceMIDI._SHAKHCHI:
                return "#MA@" + index + "{5 7  02 10 12 00 05 01 06 0 0 05 0 0 08 06 07 00 09 05 23 0 0 01 0 1 18 10 08 00 03 03 02 0 1 00 0 2 00 06 05 00 09 00 01 0 0 01 0 0};";
            case SionPresetVoiceMIDI._WHISTLE:
                return "#MA@" + index + "{2 0  00 06 10 00 06 00 05 0 0 01 0 0 00 08 08 00 07 00 05 0 0 01 0 2 17 06 10 09 07 00 44 0 0 01 0 2 08 06 08 00 07 00 05 0 0 01 7 2};";
            case SionPresetVoiceMIDI._OCARINA:
                return "#MA@" + index + "{5 7  03 08 06 07 08 00 60 0 1 02 0 0 00 08 05 00 09 00 00 0 0 01 0 0 24 10 09 06 06 09 15 0 0 01 0 0 08 07 05 00 10 00 26 0 0 01 0 0};";
            case SionPresetVoiceMIDI._SQUARELD:
                return "#MA@" + index + "{5 0  08 15 15 00 07 04 46 0 3 01 0 0 08 10 15 00 10 00 03 0 2 01 0 0 08 15 15 00 02 03 38 0 3 02 0 0 08 10 15 00 10 00 03 0 2 01 0 0};";
            case SionPresetVoiceMIDI._SAW_LEAD:
                return "#MA@" + index + "{5 7  00 15 00 00 07 00 26 0 0 01 7 2 08 13 15 00 07 00 10 0 0 01 7 2 20 15 15 00 03 00 20 0 1 01 0 2 08 14 15 00 08 00 10 0 0 01 0 2};";
            case SionPresetVoiceMIDI._CALIOPLD:
                return "#MA@" + index + "{5 7  08 12 04 00 07 08 00 0 0 04 0 1 08 12 06 00 06 07 20 0 1 04 0 2 00 08 06 00 05 05 03 0 1 02 0 0 16 06 04 00 08 01 02 0 0 01 0 1};";
            case SionPresetVoiceMIDI._CHIFFLD:
                return "#MA@" + index + "{5 0  08 07 07 00 02 06 04 0 1 01 4 0 08 15 06 00 08 00 11 0 0 01 0 0 08 07 07 00 02 06 03 0 1 01 1 0 08 15 06 00 08 00 11 0 0 01 2 0};";
            case SionPresetVoiceMIDI._CHARANLD:
                return "#MA@" + index + "{5 0  01 09 02 00 06 02 08 0 2 01 4 2 12 09 01 00 08 02 14 0 0 02 0 0 01 09 02 00 06 02 10 0 2 01 1 2 12 09 01 00 08 02 14 0 0 02 1 0};";
            case SionPresetVoiceMIDI._VOICE_LD:
                return "#MA@" + index + "{5 0  06 04 00 00 00 15 13 0 0 07 0 0 00 07 03 00 08 06 19 0 0 02 0 0 08 07 15 00 09 00 28 0 1 01 0 1 00 07 15 00 08 00 02 0 0 01 0 0};";
            case SionPresetVoiceMIDI._FIFTH_LD:
                return "#MA@" + index + "{7 0  24 12 01 01 08 01 21 0 0 01 0 2 00 12 01 01 06 02 15 0 0 01 1 2 00 12 00 00 08 00 26 0 0 02 4 2 16 12 01 01 08 01 06 0 0 03 1 2};";
            case SionPresetVoiceMIDI._BASS_LD:
                return "#MA@" + index + "{5 0  01 11 02 00 03 00 22 0 0 01 0 0 16 10 02 00 09 00 17 0 0 01 0 0 00 12 03 04 04 05 11 0 2 01 0 0 00 13 03 00 09 06 12 0 0 01 0 0};";
            case SionPresetVoiceMIDI._NEWAGEPD:
                return "#MA@" + index + "{5 5  01 15 15 03 03 00 38 1 0 07 0 2 00 15 07 04 04 00 11 0 2 05 0 2 01 06 01 00 01 00 24 0 2 01 7 0 00 08 01 00 05 01 00 0 2 01 0 0};";
            case SionPresetVoiceMIDI._WARM_PAD:
                return "#MA@" + index + "{5 7  00 10 00 00 05 00 40 0 0 01 1 0 00 03 00 00 04 00 02 0 0 01 0 0 00 10 00 00 03 00 47 0 0 01 3 0 00 03 00 00 04 00 02 0 0 01 2 0};";
            case SionPresetVoiceMIDI._POLYSYPD:
                return "#MA@" + index + "{5 0  03 06 05 00 04 01 34 0 0 01 7 0 00 10 05 00 06 01 02 0 2 02 6 0 27 06 03 00 03 01 34 0 0 01 0 0 08 09 03 00 05 00 00 0 2 01 2 0};";
            case SionPresetVoiceMIDI._CHOIRPAD:
                return "#MA@" + index + "{5 2  08 10 00 00 00 15 33 0 0 01 7 2 00 04 03 00 07 03 22 0 2 08 0 0 00 07 03 00 03 00 33 0 1 01 0 0 00 06 15 00 05 00 00 0 0 02 3 0};";
            case SionPresetVoiceMIDI._BOWEDPAD:
                return "#MA@" + index + "{5 4  00 02 01 00 03 04 42 0 2 07 0 0 00 06 02 00 05 03 00 0 0 01 0 0 00 02 01 00 03 04 42 0 2 07 1 0 00 06 02 00 05 03 00 0 0 01 2 0};";
            case SionPresetVoiceMIDI._METALPAD:
                return "#MA@" + index + "{5 6  10 15 02 00 03 00 23 1 2 01 0 0 00 05 06 00 04 00 03 0 2 01 5 0 00 15 06 00 03 03 07 1 1 01 0 0 00 05 07 00 04 00 04 0 1 01 1 0};";
            case SionPresetVoiceMIDI._HALO_PAD:
                return "#MA@" + index + "{5 6  00 04 01 00 03 01 37 0 0 01 5 2 00 06 02 00 05 00 00 0 2 01 7 0 00 12 05 00 04 01 30 0 0 01 3 2 00 08 02 00 05 00 00 0 2 01 0 0};";
            case SionPresetVoiceMIDI._SWEEPPAD:
                return "#MA@" + index + "{5 0  00 04 08 00 03 00 30 0 0 01 5 0 00 03 08 00 04 00 00 0 2 01 3 0 00 03 01 00 04 00 34 0 2 02 2 0 00 07 02 00 05 00 00 0 2 01 7 0};";
            case SionPresetVoiceMIDI._RAIN:
                return "#MA@" + index + "{5 1  00 15 08 00 06 08 02 1 3 10 0 2 16 08 05 01 02 00 00 1 0 01 0 3 00 15 08 00 06 08 02 1 3 10 2 2 16 08 05 01 02 00 00 1 0 01 3 2};";
            case SionPresetVoiceMIDI._SOUNDTRK:
                return "#MA@" + index + "{5 3  00 06 03 00 03 03 18 0 2 03 0 0 00 04 02 00 04 00 09 0 1 03 0 0 16 06 03 00 03 03 16 0 0 01 0 0 00 04 01 00 04 01 03 0 2 01 0 0};";
            case SionPresetVoiceMIDI._CRYSTAL:
                return "#MA@" + index + "{5 5  00 15 08 01 05 04 20 0 1 06 0 2 00 12 02 02 04 07 09 0 0 01 0 2 00 15 08 01 05 04 20 0 1 15 2 2 00 12 02 02 04 07 09 0 0 01 2 2};";
            case SionPresetVoiceMIDI._ATMOSPHR:
                return "#MA@" + index + "{5 4  20 06 03 02 04 15 21 0 1 01 0 0 00 15 03 00 04 03 00 0 0 01 0 0 20 12 03 00 04 15 16 0 1 02 3 0 00 09 06 05 04 03 12 0 0 02 7 0};";
            case SionPresetVoiceMIDI._BRIGHT:
                return "#MA@" + index + "{2 0  11 15 01 01 04 05 07 0 2 01 3 0 09 15 02 05 04 15 07 0 0 01 3 0 11 15 01 01 04 05 07 0 2 01 1 0 09 15 02 05 04 15 07 0 0 01 1 0};";
            case SionPresetVoiceMIDI._GOBLINS:
                return "#MA@" + index + "{5 4  13 01 01 00 01 02 18 0 2 03 7 2 00 02 01 00 04 01 09 0 2 03 0 0 00 02 01 00 02 00 20 0 0 01 0 2 00 03 01 00 03 00 03 0 2 01 4 2};";
            case SionPresetVoiceMIDI._ECHOES:
                return "#MA@" + index + "{5 0  00 04 03 00 00 05 34 0 0 02 0 0 00 10 02 00 12 00 14 0 2 01 0 0 16 03 03 00 02 02 35 0 0 01 0 1 00 10 15 00 03 00 00 0 0 01 0 0};";
            case SionPresetVoiceMIDI._SCI_FI:
                return "#MA@" + index + "{5 2  01 05 03 00 03 08 25 0 1 02 0 0 04 06 01 01 04 02 06 0 0 01 7 0 01 05 03 00 03 08 25 0 1 02 3 0 04 06 01 01 04 02 06 0 0 01 3 0};";
            case SionPresetVoiceMIDI._SITAR:
                return "#MA@" + index + "{5 3  00 13 02 03 02 05 10 0 2 02 0 2 09 15 02 06 04 15 08 0 0 07 0 2 08 13 02 03 02 05 03 0 2 01 1 2 17 15 02 06 04 15 08 0 0 04 1 2};";
            case SionPresetVoiceMIDI._BANJO:
                return "#MA@" + index + "{5 0  04 13 03 02 01 01 10 1 0 01 0 0 00 13 03 03 05 14 00 1 2 03 0 0 01 15 07 04 02 01 15 0 0 06 0 0 01 15 07 08 08 14 00 0 2 01 0 0};";
            case SionPresetVoiceMIDI._SHAMISEN:
                return "#MA@" + index + "{3 4  08 15 01 01 03 02 26 0 0 01 0 2 00 15 10 05 06 07 20 0 0 03 0 2 16 15 08 03 03 03 24 0 0 05 0 2 08 15 04 04 04 15 01 1 0 03 0 2};";
            case SionPresetVoiceMIDI._KOTO:
                return "#MA@" + index + "{3 6  08 15 07 05 05 02 20 0 2 03 0 0 16 15 09 08 08 04 21 0 2 05 0 0 00 15 02 02 03 15 42 0 0 01 0 0 00 15 02 02 02 15 03 1 0 01 0 2};";
            case SionPresetVoiceMIDI._KALIMBA:
                return "#MA@" + index + "{5 6  04 15 10 05 06 10 08 0 1 04 3 2 00 12 02 03 05 00 08 0 0 01 0 2 00 15 08 05 06 10 14 0 1 05 2 2 00 12 02 04 04 00 08 1 0 01 4 2};";
            case SionPresetVoiceMIDI._BAGPIPE:
                return "#MA@" + index + "{5 1  09 11 09 00 12 01 16 0 2 01 0 2 08 07 15 00 13 00 11 0 0 03 1 2 00 10 09 00 09 03 00 0 0 01 0 2 01 08 06 00 13 00 10 0 0 04 0 2};";
            case SionPresetVoiceMIDI._FIDDLE:
                return "#MA@" + index + "{5 2  01 08 09 00 03 01 07 1 2 01 0 0 00 06 06 00 07 02 00 0 0 01 0 2 04 12 06 07 07 00 09 1 1 02 0 0 00 09 03 07 08 14 25 0 2 01 0 0};";
            case SionPresetVoiceMIDI._SHANAI:
                return "#MA@" + index + "{5 0  05 10 00 00 04 00 16 0 2 01 0 0 00 09 01 01 09 00 13 0 0 06 0 0 00 11 00 00 04 02 24 0 0 01 0 1 00 10 00 00 10 00 15 0 0 02 0 0};";
            case SionPresetVoiceMIDI._TNKLBELL:
                return "#MA@" + index + "{5 3  00 15 06 03 04 05 16 0 1 15 0 2 00 12 06 07 06 14 11 0 2 02 0 2 01 12 06 02 02 05 30 0 0 07 7 2 00 15 05 04 05 13 01 0 0 06 0 2};";
            case SionPresetVoiceMIDI._AGOGO:
                return "#MA@" + index + "{5 1  00 14 10 04 04 02 23 0 0 07 0 2 00 15 07 06 06 01 08 0 0 05 0 2 00 14 09 06 04 02 33 0 0 10 7 2 00 15 07 06 06 07 04 0 0 02 0 2};";
            case SionPresetVoiceMIDI._STEELDRM:
                return "#MA@" + index + "{7 0  16 04 04 04 05 02 00 1 0 02 0 2 00 06 06 03 04 00 22 0 0 02 0 2 00 14 04 04 04 02 00 1 0 02 0 2 02 15 04 04 04 02 00 1 0 00 3 0};";
            case SionPresetVoiceMIDI._WOODBLOK:
                return "#MA@" + index + "{5 5  00 15 10 09 09 02 33 1 2 05 1 2 00 15 10 07 07 02 00 1 0 02 3 2 00 15 10 10 08 02 28 0 0 10 3 2 00 15 10 07 07 02 00 0 0 02 0 2};";
            case SionPresetVoiceMIDI._TAIKODRM:
                return "#MA@" + index + "{4 7  04 15 11 04 03 05 24 0 0 00 0 0 00 15 12 10 03 01 19 0 0 04 0 0 00 15 12 04 03 04 11 0 0 03 0 0 00 15 14 05 05 00 00 0 0 00 0 0};";
            case SionPresetVoiceMIDI._MELODTOM:
                return "#MA@" + index + "{5 7  04 15 09 08 08 05 14 0 2 01 0 2 00 15 03 05 05 14 00 0 0 00 0 2 01 15 03 04 04 05 12 1 2 00 0 2 00 15 04 04 04 14 00 1 0 00 0 2};";
            case SionPresetVoiceMIDI._SYN_DRUM:
                return "#MA@" + index + "{5 2  12 14 11 08 10 02 00 1 0 00 7 0 00 12 03 00 04 15 00 1 0 00 0 0 24 15 04 00 04 07 00 0 0 00 0 2 22 15 07 00 07 15 00 0 0 00 0 2};";
            case SionPresetVoiceMIDI._REVCYMBL:
                return "#MA@" + index + "{5 7  00 04 15 00 00 00 00 0 0 15 0 2 08 02 15 15 15 15 06 0 0 09 0 1 00 04 15 00 00 00 00 0 0 15 0 2 03 02 15 15 15 15 06 0 0 15 0 2};";
            case SionPresetVoiceMIDI._FRETNOIZ:
                return "#MA@" + index + "{5 7  08 15 08 04 06 02 00 0 2 06 0 2 02 08 06 04 10 08 15 0 2 03 0 2 10 15 06 02 06 02 00 0 0 06 0 2 02 08 08 08 10 08 00 0 2 06 0 2};";
            case SionPresetVoiceMIDI._BRTHNOIZ:
                return "#MA@" + index + "{5 7  02 10 12 00 05 01 14 0 0 05 0 0 00 07 08 08 09 15 05 0 0 01 0 0 00 10 12 00 05 01 09 0 0 08 0 0 00 08 08 07 09 15 12 0 0 01 0 0};";
            case SionPresetVoiceMIDI._SEASHORE:
                return "#MA@" + index + "{3 7  00 15 15 00 00 00 04 0 0 03 0 0 04 15 02 02 02 15 21 0 0 00 0 0 01 15 00 04 04 15 12 0 0 00 0 0 00 01 02 04 04 15 00 0 0 00 0 0};";
            case SionPresetVoiceMIDI._TWEET:
                return "#MA@" + index + "{5 0  00 03 07 03 03 10 21 1 2 05 0 2 00 05 06 07 07 03 00 1 1 10 0 2 00 03 07 03 03 10 21 1 2 05 0 2 00 05 06 04 04 03 00 1 1 10 7 3};";
            case SionPresetVoiceMIDI._TELPHONE:
                return "#MA@" + index + "{5 5  02 11 02 00 00 06 28 1 1 05 0 2 00 15 04 03 03 01 03 1 0 04 0 2 02 11 02 00 00 06 28 1 1 05 0 2 00 15 04 03 03 01 15 1 0 04 7 2};";
            case SionPresetVoiceMIDI._HELICPTR:
                return "#MA@" + index + "{5 5  14 15 06 00 00 00 01 0 0 15 0 2 00 02 00 00 05 00 04 0 0 00 0 2 14 15 00 00 00 00 24 0 0 00 0 2 00 02 00 00 05 00 11 0 0 00 0 2};";
            case SionPresetVoiceMIDI._APPLAUSE:
                return "#MA@" + index + "{5 7  24 15 12 00 01 00 00 0 0 00 0 0 00 04 02 00 05 00 08 0 0 00 0 0 24 06 00 00 01 15 00 0 0 09 0 1 00 03 00 07 07 15 07 0 0 03 0 0};";
            case SionPresetVoiceMIDI._GUNSHOT:
                return "#MA@" + index + "{5 7  00 15 03 00 00 15 11 0 0 05 0 0 06 15 06 08 08 11 04 0 0 15 0 0 01 15 02 00 00 15 02 0 0 05 0 0 06 15 06 08 08 11 26 0 0 05 0 0};";
        }
        return "";
    }
};
addPossibleValuesFunction(SionPresetVoiceMIDI, SionPresetVoiceMIDI._GRANDPNO, SionPresetVoiceMIDI._GUNSHOT);
var SionPresetVoiceMIDI_DRUM = {
    _SEQ_CLICK_H: 0,
    _BRUSH_TAP: 1,
    _BRUSH_SWIRL: 2,
    _BRUSH_SLAP: 3,
    _BRUSH_TAP_SWIRL: 4,
    _SNARE_ROLL: 5,
    _CASTANET: 6,
    _SNARE_L: 7,
    _STICKS: 8,
    _BASS_DRUM_L: 9,
    _OPEN_RIM_SHOT: 10,
    _BASS_DRUM_M: 11,
    _BASS_DRUM_H: 12,
    _CLOSED_RIM_SHOT: 13,
    _SNARE_M: 14,
    _HAND_CLAP: 15,
    _SNARE_H: 16,
    _FLOOR_TOM_L: 17,
    _HI_HAT_CLOSED: 18,
    _FLOOR_TOM_H: 19,
    _HI_HAT_PEDAL: 20,
    _LOW_TOM: 21,
    _HI_HAT_OPEN: 22,
    _MID_TOM_L: 23,
    _MID_TOM_H: 24,
    _CRASH_CYMBAL_1: 25,
    _HIGH_TOM: 26,
    _RIDE_CYMBAL_1: 27,
    _CHINESE_CYMBAL: 28,
    _RIDE_CYMBAL_CUP: 29,
    _TAMBOURINE: 30,
    _SPLASH_CYMBAL: 31,
    _COWBELL: 32,
    _CRASH_CYMBAL_2: 33,
    _VIBRASLAP: 34,
    _RIDE_CYMBAL_2: 35,
    _BONGO_H: 36,
    _BONGO_L: 37,
    _CONGA_H_MUTE: 38,
    _CONGA_H_OPEN: 39,
    _CONGA_L: 40,
    _TIMBALE_H: 41,
    _TIMBALE_L: 42,
    _AGOGO_H: 43,
    _AGOGO_L: 44,
    _CABASA: 45,
    _MARACAS: 46,
    _SAMBA_WHISTLE_H: 47,
    _SAMBA_WHISTLE_L: 48,
    _GUIRO_SHORT: 49,
    _GUIRO_LONG: 50,
    _CLAVES: 51,
    _WOOD_BLOCK_H: 52,
    _WOOD_BLOCK_L: 53,
    _CUICA_MUTE: 54,
    _CUICA_OPEN: 55,
    _TRIANGLE_MUTE: 56,
    _TRIANGLE_OPEN: 57,
    _SHAKER: 58,
    _JINGLE_BELLS: 59,
    _BELL_TREE: 60,
    toString: function(cat) {
        switch (cat) {
            case SionPresetVoiceMIDI_DRUM._SEQ_CLICK_H:
                return "Seq Click H";
            case SionPresetVoiceMIDI_DRUM._BRUSH_TAP:
                return "Brush Tap";
            case SionPresetVoiceMIDI_DRUM._BRUSH_SWIRL:
                return "Brush Swirl";
            case SionPresetVoiceMIDI_DRUM._BRUSH_SLAP:
                return "Brush Slap";
            case SionPresetVoiceMIDI_DRUM._BRUSH_TAP_SWIRL:
                return "Brush Tap Swirl";
            case SionPresetVoiceMIDI_DRUM._SNARE_ROLL:
                return "Snare Roll";
            case SionPresetVoiceMIDI_DRUM._CASTANET:
                return "Castanet";
            case SionPresetVoiceMIDI_DRUM._SNARE_L:
                return "Snare L";
            case SionPresetVoiceMIDI_DRUM._STICKS:
                return "Sticks";
            case SionPresetVoiceMIDI_DRUM._BASS_DRUM_L:
                return "Bass Drum L";
            case SionPresetVoiceMIDI_DRUM._OPEN_RIM_SHOT:
                return "Open Rim Shot";
            case SionPresetVoiceMIDI_DRUM._BASS_DRUM_M:
                return "Bass Drum M";
            case SionPresetVoiceMIDI_DRUM._BASS_DRUM_H:
                return "Bass Drum H";
            case SionPresetVoiceMIDI_DRUM._CLOSED_RIM_SHOT:
                return "Closed Rim Shot";
            case SionPresetVoiceMIDI_DRUM._SNARE_M:
                return "Snare M";
            case SionPresetVoiceMIDI_DRUM._HAND_CLAP:
                return "Hand Clap";
            case SionPresetVoiceMIDI_DRUM._SNARE_H:
                return "Snare H";
            case SionPresetVoiceMIDI_DRUM._FLOOR_TOM_L:
                return "Floor Tom L";
            case SionPresetVoiceMIDI_DRUM._HI_HAT_CLOSED:
                return "Hi-Hat Closed";
            case SionPresetVoiceMIDI_DRUM._FLOOR_TOM_H:
                return "Floor Tom H";
            case SionPresetVoiceMIDI_DRUM._HI_HAT_PEDAL:
                return "Hi-Hat Pedal";
            case SionPresetVoiceMIDI_DRUM._LOW_TOM:
                return "Low Tom";
            case SionPresetVoiceMIDI_DRUM._HI_HAT_OPEN:
                return "Hi-Hat Open";
            case SionPresetVoiceMIDI_DRUM._MID_TOM_L:
                return "Mid Tom L";
            case SionPresetVoiceMIDI_DRUM._MID_TOM_H:
                return "Mid Tom H";
            case SionPresetVoiceMIDI_DRUM._CRASH_CYMBAL_1:
                return "Crash Cymbal 1";
            case SionPresetVoiceMIDI_DRUM._HIGH_TOM:
                return "High Tom";
            case SionPresetVoiceMIDI_DRUM._RIDE_CYMBAL_1:
                return "Ride Cymbal 1";
            case SionPresetVoiceMIDI_DRUM._CHINESE_CYMBAL:
                return "Chinese Cymbal";
            case SionPresetVoiceMIDI_DRUM._RIDE_CYMBAL_CUP:
                return "Ride Cymbal Cup";
            case SionPresetVoiceMIDI_DRUM._TAMBOURINE:
                return "Tambourine";
            case SionPresetVoiceMIDI_DRUM._SPLASH_CYMBAL:
                return "Splash Cymbal";
            case SionPresetVoiceMIDI_DRUM._COWBELL:
                return "Cowbell";
            case SionPresetVoiceMIDI_DRUM._CRASH_CYMBAL_2:
                return "Crash Cymbal 2";
            case SionPresetVoiceMIDI_DRUM._VIBRASLAP:
                return "Vibraslap";
            case SionPresetVoiceMIDI_DRUM._RIDE_CYMBAL_2:
                return "Ride Cymbal 2";
            case SionPresetVoiceMIDI_DRUM._BONGO_H:
                return "Bongo H";
            case SionPresetVoiceMIDI_DRUM._BONGO_L:
                return "Bongo L";
            case SionPresetVoiceMIDI_DRUM._CONGA_H_MUTE:
                return "Conga H Mute";
            case SionPresetVoiceMIDI_DRUM._CONGA_H_OPEN:
                return "Conga H Open";
            case SionPresetVoiceMIDI_DRUM._CONGA_L:
                return "Conga L";
            case SionPresetVoiceMIDI_DRUM._TIMBALE_H:
                return "Timbale H";
            case SionPresetVoiceMIDI_DRUM._TIMBALE_L:
                return "Timbale L";
            case SionPresetVoiceMIDI_DRUM._AGOGO_H:
                return "Agogo H";
            case SionPresetVoiceMIDI_DRUM._AGOGO_L:
                return "Agogo L";
            case SionPresetVoiceMIDI_DRUM._CABASA:
                return "Cabasa";
            case SionPresetVoiceMIDI_DRUM._MARACAS:
                return "Maracas";
            case SionPresetVoiceMIDI_DRUM._SAMBA_WHISTLE_H:
                return "Samba Whistle H";
            case SionPresetVoiceMIDI_DRUM._SAMBA_WHISTLE_L:
                return "Samba Whistle L";
            case SionPresetVoiceMIDI_DRUM._GUIRO_SHORT:
                return "Guiro Short";
            case SionPresetVoiceMIDI_DRUM._GUIRO_LONG:
                return "Guiro Long";
            case SionPresetVoiceMIDI_DRUM._CLAVES:
                return "Claves";
            case SionPresetVoiceMIDI_DRUM._WOOD_BLOCK_H:
                return "Wood Block H";
            case SionPresetVoiceMIDI_DRUM._WOOD_BLOCK_L:
                return "Wood Block L";
            case SionPresetVoiceMIDI_DRUM._CUICA_MUTE:
                return "Cuica Mute";
            case SionPresetVoiceMIDI_DRUM._CUICA_OPEN:
                return "Cuica Open";
            case SionPresetVoiceMIDI_DRUM._TRIANGLE_MUTE:
                return "Triangle Mute";
            case SionPresetVoiceMIDI_DRUM._TRIANGLE_OPEN:
                return "Triangle Open";
            case SionPresetVoiceMIDI_DRUM._SHAKER:
                return "Shaker";
            case SionPresetVoiceMIDI_DRUM._JINGLE_BELLS:
                return "Jingle Bells";
            case SionPresetVoiceMIDI_DRUM._BELL_TREE:
                return "Bell Tree";
        }
        return "Unknown " + cat;
    },
    getMML: function(cat, index) {
        switch (cat) {
            case SionPresetVoiceMIDI_DRUM._SEQ_CLICK_H:
                return "#MA@" + index + "{5 6  04 15 00 15 15 00 56 0 0 06 0 2 00 15 08 15 15 12 00 1 0 05 0 2 06 15 11 15 15 11 39 0 0 10 0 2 00 14 11 15 15 15 01 1 0 05 0 2};";
            case SionPresetVoiceMIDI_DRUM._BRUSH_TAP:
                return "#MA@" + index + "{5 7  00 15 08 00 00 03 00 0 0 05 0 2 00 09 08 08 11 11 00 0 2 00 0 2 06 15 08 06 14 03 36 0 0 12 0 2 06 12 13 08 08 00 44 0 2 01 0 2};";
            case SionPresetVoiceMIDI_DRUM._BRUSH_SWIRL:
                return "#MA@" + index + "{5 7  18 15 05 00 06 00 00 0 0 00 0 2 03 09 08 00 10 06 00 0 0 00 0 3 16 15 00 00 15 15 00 0 0 00 0 0 00 03 06 03 15 06 21 0 0 01 0 3};";
            case SionPresetVoiceMIDI_DRUM._BRUSH_SLAP:
                return "#MA@" + index + "{5 7  00 15 00 00 00 00 00 0 0 04 0 2 13 12 08 06 12 09 00 0 0 15 0 2 07 11 10 04 07 13 09 0 0 00 0 2 00 08 08 11 11 13 00 0 2 00 0 2};";
            case SionPresetVoiceMIDI_DRUM._BRUSH_TAP_SWIRL:
                return "#MA@" + index + "{5 7  18 15 05 00 03 00 00 0 0 05 5 2 03 09 06 00 10 06 00 0 0 03 0 3 16 15 00 00 15 15 00 0 0 09 0 0 20 03 06 03 15 06 16 0 0 03 0 3};";
            case SionPresetVoiceMIDI_DRUM._SNARE_ROLL:
                return "#MA@" + index + "{5 7  02 07 00 00 02 00 13 0 0 08 3 1 26 15 05 00 09 03 00 0 0 00 6 0 00 15 10 08 04 03 08 0 0 03 0 2 00 14 06 07 07 05 00 0 0 00 0 2};";
            case SionPresetVoiceMIDI_DRUM._CASTANET:
                return "#MA@" + index + "{5 6  01 15 07 05 09 15 02 0 0 07 0 2 06 10 08 05 15 15 00 1 0 05 0 2 05 15 05 06 05 00 39 0 0 02 0 2 00 12 10 09 09 10 20 0 0 05 0 2};";
            case SionPresetVoiceMIDI_DRUM._SNARE_L:
                return "#MA@" + index + "{5 7  24 15 12 00 00 01 09 0 0 00 0 2 00 15 07 07 07 03 00 0 0 00 0 2 00 14 11 07 05 15 48 0 0 07 0 2 00 15 10 06 00 00 28 0 0 00 0 2};";
            case SionPresetVoiceMIDI_DRUM._STICKS:
                return "#MA@" + index + "{6 7  20 15 09 12 08 09 00 0 1 15 0 2 03 13 10 02 08 11 00 0 0 10 0 2 03 13 08 02 05 05 21 0 1 10 0 2 08 12 11 09 07 11 00 0 0 12 0 2};";
            case SionPresetVoiceMIDI_DRUM._BASS_DRUM_L:
                return "#MA@" + index + "{5 1  04 15 10 11 06 15 00 0 0 02 0 2 00 15 06 06 05 07 16 0 0 02 0 2 01 11 09 07 04 07 13 0 0 05 0 2 12 15 07 08 05 07 00 0 0 01 0 2};";
            case SionPresetVoiceMIDI_DRUM._OPEN_RIM_SHOT:
                return "#MA@" + index + "{5 7  02 15 00 05 05 00 05 1 0 12 0 2 00 15 07 07 07 07 00 1 0 10 0 2 00 15 10 06 06 08 00 0 0 12 0 2 02 15 07 07 07 07 00 0 0 07 0 2};";
            case SionPresetVoiceMIDI_DRUM._BASS_DRUM_M:
                return "#MA@" + index + "{5 6  06 15 13 07 07 15 00 0 0 12 0 2 00 15 07 07 04 07 00 0 0 02 0 2 10 15 09 07 06 07 19 0 0 03 0 2 12 15 08 10 06 11 00 0 0 02 0 2};";
            case SionPresetVoiceMIDI_DRUM._BASS_DRUM_H:
                return "#MA@" + index + "{5 6  06 15 13 07 06 15 14 0 0 12 0 2 00 15 07 07 07 07 12 0 0 02 0 2 02 15 09 07 04 07 09 0 0 02 0 2 12 15 07 08 06 07 00 0 0 01 0 2};";
            case SionPresetVoiceMIDI_DRUM._CLOSED_RIM_SHOT:
                return "#MA@" + index + "{5 6  01 15 02 00 08 05 08 0 0 10 0 2 06 13 09 03 03 15 00 1 0 07 0 2 18 11 00 00 09 13 00 0 0 09 0 2 18 13 09 11 09 11 00 0 0 00 0 2};";
            case SionPresetVoiceMIDI_DRUM._SNARE_M:
                return "#MA@" + index + "{5 7  13 15 00 05 07 00 07 1 0 12 0 2 00 15 07 10 09 07 00 1 0 08 0 2 00 15 05 07 08 06 00 0 0 12 0 2 02 15 07 07 06 07 01 0 0 07 0 2};";
            case SionPresetVoiceMIDI_DRUM._HAND_CLAP:
                return "#MA@" + index + "{5 7  00 15 04 04 06 00 02 0 0 00 0 2 05 15 06 09 04 01 00 0 0 00 0 2 27 15 08 00 15 01 00 0 2 12 1 2 02 15 10 09 08 05 00 0 2 15 0 2};";
            case SionPresetVoiceMIDI_DRUM._SNARE_H:
                return "#MA@" + index + "{5 7  02 15 01 00 07 00 10 0 0 12 0 2 00 15 07 11 07 13 00 0 0 10 0 0 28 15 10 06 05 08 09 0 0 09 0 2 18 15 08 10 06 01 00 0 0 07 0 2};";
            case SionPresetVoiceMIDI_DRUM._FLOOR_TOM_L:
                return "#MA@" + index + "{5 4  06 13 10 06 06 15 09 0 0 12 0 2 00 15 10 07 11 07 00 0 0 05 0 2 01 15 03 05 05 15 21 0 0 00 0 2 00 15 06 05 06 07 00 0 0 05 0 2};";
            case SionPresetVoiceMIDI_DRUM._HI_HAT_CLOSED:
                return "#MA@" + index + "{5 7  00 15 00 00 00 03 02 0 0 15 0 2 00 11 08 12 08 11 00 0 2 00 0 2 14 15 03 03 13 03 12 0 0 00 0 2 11 11 10 08 11 00 00 0 2 12 0 2};";
            case SionPresetVoiceMIDI_DRUM._FLOOR_TOM_H:
                return "#MA@" + index + "{5 0  06 12 05 06 06 15 00 0 0 12 0 2 19 15 09 07 11 07 00 0 0 10 0 2 01 15 04 04 05 15 26 0 0 00 0 2 00 15 06 04 06 05 00 0 0 05 0 2};";
            case SionPresetVoiceMIDI_DRUM._HI_HAT_PEDAL:
                return "#MA@" + index + "{5 7  00 15 00 00 00 03 00 0 0 12 0 2 00 07 08 08 08 11 15 0 2 00 0 2 20 15 03 05 14 03 08 0 0 06 0 2 11 08 03 08 08 00 00 0 2 05 0 2};";
            case SionPresetVoiceMIDI_DRUM._LOW_TOM:
                return "#MA@" + index + "{5 0  06 12 05 06 06 15 01 0 0 10 0 2 18 15 08 07 09 07 00 0 0 01 0 2 01 15 03 05 05 15 17 0 0 00 0 2 00 15 06 05 05 07 00 0 0 05 0 2};";
            case SionPresetVoiceMIDI_DRUM._HI_HAT_OPEN:
                return "#MA@" + index + "{5 7  00 15 00 00 00 03 02 0 0 15 0 2 00 11 07 06 08 11 01 0 2 00 0 2 14 15 03 03 13 03 12 0 0 00 0 2 11 11 09 05 11 00 09 0 2 12 0 2};";
            case SionPresetVoiceMIDI_DRUM._MID_TOM_L:
                return "#MA@" + index + "{5 0  06 12 05 06 06 15 00 0 0 10 0 2 18 15 09 07 10 06 00 0 0 08 0 2 00 15 04 02 05 15 28 0 0 00 0 2 00 15 06 05 07 07 02 0 0 04 0 2};";
            case SionPresetVoiceMIDI_DRUM._MID_TOM_H:
                return "#MA@" + index + "{5 0  06 12 04 06 05 15 09 0 0 10 0 2 19 15 09 07 07 07 00 0 0 01 0 2 01 15 04 05 05 15 39 0 0 01 0 2 00 15 06 06 07 07 03 0 0 04 0 2};";
            case SionPresetVoiceMIDI_DRUM._CRASH_CYMBAL_1:
                return "#MA@" + index + "{5 3  16 15 09 00 06 00 14 0 0 12 0 2 18 09 03 04 05 02 03 0 0 10 0 0 00 11 03 00 04 00 00 0 0 15 0 2 06 12 04 05 05 07 13 0 0 15 0 2};";
            case SionPresetVoiceMIDI_DRUM._HIGH_TOM:
                return "#MA@" + index + "{5 0  06 12 04 06 07 15 04 0 0 08 0 2 19 15 10 07 08 07 00 0 0 06 0 2 05 15 05 05 06 15 50 0 0 01 0 2 00 12 06 05 06 07 00 0 0 05 0 2};";
            case SionPresetVoiceMIDI_DRUM._RIDE_CYMBAL_1:
                return "#MA@" + index + "{5 7  00 15 07 00 00 04 09 0 2 15 0 2 14 14 04 04 04 14 03 0 0 09 0 2 00 15 00 00 00 04 08 0 2 15 0 2 11 15 04 02 05 13 16 0 0 15 0 2};";
            case SionPresetVoiceMIDI_DRUM._CHINESE_CYMBAL:
                return "#MA@" + index + "{5 7  00 15 03 07 02 01 31 0 0 00 0 2 30 14 03 05 02 00 00 1 0 05 0 0 00 15 01 08 03 06 15 0 0 02 0 2 06 09 02 05 03 00 09 0 0 00 0 2};";
            case SionPresetVoiceMIDI_DRUM._RIDE_CYMBAL_CUP:
                return "#MA@" + index + "{5 7  19 15 07 00 00 04 22 0 2 15 0 2 12 15 05 04 04 14 00 0 0 15 0 2 19 15 00 00 00 04 12 0 2 12 0 2 11 15 05 02 05 13 27 0 0 15 0 2};";
            case SionPresetVoiceMIDI_DRUM._TAMBOURINE:
                return "#MA@" + index + "{5 6  00 08 07 04 01 02 10 0 0 10 0 2 13 14 07 12 11 05 00 0 0 05 0 2 08 08 07 05 02 02 00 0 0 10 0 2 08 13 07 12 07 06 00 0 0 15 0 2};";
            case SionPresetVoiceMIDI_DRUM._SPLASH_CYMBAL:
                return "#MA@" + index + "{5 7  25 12 06 03 03 00 00 0 0 08 0 0 03 09 03 04 03 12 00 1 0 12 0 0 13 05 00 03 03 00 01 0 0 05 0 0 19 12 03 05 08 06 00 1 0 15 0 0};";
            case SionPresetVoiceMIDI_DRUM._COWBELL:
                return "#MA@" + index + "{5 4  00 15 09 08 05 03 00 1 2 03 0 2 00 10 07 05 03 03 00 1 0 00 0 2 02 15 15 11 09 10 03 1 0 04 0 2 00 15 12 05 05 03 32 1 0 01 0 2};";
            case SionPresetVoiceMIDI_DRUM._CRASH_CYMBAL_2:
                return "#MA@" + index + "{5 7  00 15 06 00 00 00 00 0 2 09 0 2 00 09 04 02 02 00 00 1 0 00 0 0 00 15 03 00 00 00 00 0 2 15 0 2 02 09 06 03 04 03 08 0 0 07 4 2};";
            case SionPresetVoiceMIDI_DRUM._VIBRASLAP:
                return "#MA@" + index + "{5 7  29 13 01 02 06 00 00 0 0 01 2 1 08 15 06 05 09 02 00 0 0 00 6 0 29 15 05 04 04 00 29 0 0 06 0 2 30 15 06 05 04 00 00 0 0 00 0 2};";
            case SionPresetVoiceMIDI_DRUM._RIDE_CYMBAL_2:
                return "#MA@" + index + "{5 7  07 15 00 00 06 00 05 0 0 15 0 3 14 14 05 05 04 11 16 0 0 15 0 2 06 15 00 00 00 04 07 0 2 09 0 2 11 15 05 03 05 14 00 0 0 09 0 2};";
            case SionPresetVoiceMIDI_DRUM._BONGO_H:
                return "#MA@" + index + "{5 3  00 15 05 12 12 00 00 0 0 06 0 2 00 15 05 08 07 00 00 0 0 10 0 2 00 15 05 12 12 00 02 0 0 15 0 2 00 15 04 07 03 00 00 0 0 15 0 2};";
            case SionPresetVoiceMIDI_DRUM._BONGO_L:
                return "#MA@" + index + "{5 3  00 15 05 12 12 00 00 0 0 06 0 2 00 15 05 08 07 00 07 0 0 10 0 2 00 15 05 12 12 00 06 0 0 15 0 2 00 15 05 08 03 00 00 0 0 15 0 2};";
            case SionPresetVoiceMIDI_DRUM._CONGA_H_MUTE:
                return "#MA@" + index + "{5 4  00 14 14 10 10 01 06 0 0 00 2 2 08 15 08 09 10 01 00 0 0 01 0 2 00 15 00 00 00 00 44 0 0 00 0 2 00 15 13 09 10 01 07 0 0 00 0 2};";
            case SionPresetVoiceMIDI_DRUM._CONGA_H_OPEN:
                return "#MA@" + index + "{5 7  03 10 10 05 08 12 38 0 0 10 0 2 00 12 06 07 09 04 00 0 0 12 0 2 00 15 10 06 08 08 00 0 0 12 0 2 02 15 07 07 09 07 00 0 0 02 0 2};";
            case SionPresetVoiceMIDI_DRUM._CONGA_L:
                return "#MA@" + index + "{5 7  03 10 10 05 08 12 31 0 0 10 0 2 00 12 05 06 09 04 00 0 0 12 0 2 00 15 10 06 08 08 00 0 0 12 0 2 10 15 07 07 09 07 00 0 0 02 0 2};";
            case SionPresetVoiceMIDI_DRUM._TIMBALE_H:
                return "#MA@" + index + "{3 6  00 12 07 00 08 00 22 0 0 02 0 2 00 15 09 06 08 00 49 0 0 07 0 2 04 13 06 10 06 01 26 0 0 09 0 2 06 15 09 06 08 00 06 0 0 09 0 2};";
            case SionPresetVoiceMIDI_DRUM._TIMBALE_L:
                return "#MA@" + index + "{3 6  00 12 07 00 08 00 22 0 0 02 0 2 00 15 09 06 08 00 49 0 0 07 0 2 04 13 06 10 06 01 23 0 0 12 0 2 06 15 09 06 08 00 04 0 0 09 0 2};";
            case SionPresetVoiceMIDI_DRUM._AGOGO_H:
                return "#MA@" + index + "{5 5  00 14 12 06 06 02 21 0 0 07 0 2 00 15 08 06 06 01 10 0 0 02 0 2 00 14 12 06 05 02 26 0 0 07 0 2 00 15 08 06 06 01 10 0 0 02 0 2};";
            case SionPresetVoiceMIDI_DRUM._AGOGO_L:
                return "#MA@" + index + "{5 5  00 14 12 06 06 02 21 0 0 07 0 2 00 15 08 06 06 01 10 0 0 02 0 2 00 14 12 05 05 02 13 0 0 07 0 2 00 15 08 06 06 01 29 0 0 02 0 2};";
            case SionPresetVoiceMIDI_DRUM._CABASA:
                return "#MA@" + index + "{3 7  00 15 00 03 05 06 00 0 0 07 0 2 00 14 08 04 04 10 24 1 0 15 0 2 00 14 04 02 06 04 00 0 0 15 0 2 06 08 11 09 04 00 02 0 0 15 0 2};";
            case SionPresetVoiceMIDI_DRUM._MARACAS:
                return "#MA@" + index + "{4 7  00 15 00 03 05 06 04 0 0 15 0 2 00 08 08 04 04 06 03 1 0 15 0 2 06 12 09 03 03 15 00 0 0 15 0 2 12 07 10 10 03 08 00 0 0 15 0 2};";
            case SionPresetVoiceMIDI_DRUM._SAMBA_WHISTLE_H:
                return "#MA@" + index + "{5 5  01 15 00 00 07 00 10 0 0 00 0 1 00 12 01 00 12 01 43 0 0 15 0 1 00 15 00 00 07 00 23 0 0 00 0 2 00 08 01 00 12 00 06 0 0 15 0 1};";
            case SionPresetVoiceMIDI_DRUM._SAMBA_WHISTLE_L:
                return "#MA@" + index + "{5 5  01 15 00 00 07 00 10 0 0 00 0 1 00 12 01 00 12 01 43 0 0 15 0 1 00 15 00 00 07 00 23 0 0 00 0 2 00 08 01 00 12 00 06 0 0 15 0 1};";
            case SionPresetVoiceMIDI_DRUM._GUIRO_SHORT:
                return "#MA@" + index + "{3 7  01 12 02 06 00 00 12 0 0 01 0 0 04 12 03 06 10 00 00 0 0 03 0 0 11 13 01 00 06 00 32 0 0 15 5 0 07 15 07 12 15 06 00 1 0 00 1 0};";
            case SionPresetVoiceMIDI_DRUM._GUIRO_LONG:
                return "#MA@" + index + "{3 7  01 12 02 06 00 00 14 0 0 01 0 0 04 12 03 06 10 00 00 0 0 03 0 0 11 15 00 00 06 00 32 0 0 12 0 0 07 09 06 14 12 06 05 0 0 00 2 0};";
            case SionPresetVoiceMIDI_DRUM._CLAVES:
                return "#MA@" + index + "{4 0  00 13 07 06 06 10 11 0 0 07 0 2 00 15 14 11 03 10 13 0 0 07 0 2 00 15 11 08 00 12 00 1 0 00 0 2 08 15 03 08 08 00 00 1 0 15 0 2};";
            case SionPresetVoiceMIDI_DRUM._WOOD_BLOCK_H:
                return "#MA@" + index + "{4 0  00 14 06 06 06 10 63 0 0 15 0 2 00 15 06 06 05 11 00 0 0 06 0 2 02 13 12 00 10 12 00 1 0 07 0 2 08 15 07 12 07 04 00 1 0 03 0 2};";
            case SionPresetVoiceMIDI_DRUM._WOOD_BLOCK_L:
                return "#MA@" + index + "{4 0  00 14 06 06 06 10 63 0 0 15 0 2 00 15 06 06 05 11 00 0 0 06 0 2 02 15 10 00 10 12 16 1 0 10 0 2 16 12 07 12 12 04 00 1 0 03 0 2};";
            case SionPresetVoiceMIDI_DRUM._CUICA_MUTE:
                return "#MA@" + index + "{5 0  00 13 10 12 13 11 15 0 2 00 0 2 00 06 00 06 05 00 06 0 0 06 0 2 00 15 08 08 12 00 14 0 0 00 0 2 00 06 00 07 07 00 02 0 0 06 0 2};";
            case SionPresetVoiceMIDI_DRUM._CUICA_OPEN:
                return "#MA@" + index + "{5 1  16 09 08 15 08 15 12 0 0 00 0 0 08 07 06 08 08 04 00 0 0 15 0 0 00 15 07 00 00 00 36 0 0 02 0 2 00 13 07 11 11 12 18 0 0 10 0 2};";
            case SionPresetVoiceMIDI_DRUM._TRIANGLE_MUTE:
                return "#MA@" + index + "{7 0  22 15 12 08 04 00 05 0 0 09 0 2 04 11 05 09 05 06 00 0 0 15 0 2 06 15 11 12 07 03 07 0 0 15 0 2 00 14 13 08 11 15 06 0 0 06 0 2};";
            case SionPresetVoiceMIDI_DRUM._TRIANGLE_OPEN:
                return "#MA@" + index + "{7 0  22 15 05 05 04 00 03 0 0 09 0 2 04 11 05 09 05 06 00 0 0 15 0 2 06 15 09 09 07 03 08 0 0 15 0 2 00 14 05 05 11 15 03 0 0 06 0 2};";
            case SionPresetVoiceMIDI_DRUM._SHAKER:
                return "#MA@" + index + "{4 7  00 09 00 03 05 06 00 0 0 07 0 2 00 09 06 04 04 06 04 1 0 03 0 2 00 14 04 02 06 04 01 0 0 12 0 2 06 09 10 09 04 08 02 0 0 15 0 2};";
            case SionPresetVoiceMIDI_DRUM._JINGLE_BELLS:
                return "#MA@" + index + "{5 0  02 07 06 00 00 00 20 0 0 06 0 2 03 06 11 05 05 04 00 0 0 02 0 2 02 03 00 00 02 00 07 1 0 06 0 2 02 07 05 02 06 15 00 0 0 09 0 2};";
            case SionPresetVoiceMIDI_DRUM._BELL_TREE:
                return "#MA@" + index + "{5 7  19 12 04 02 00 00 24 0 0 03 0 2 02 04 03 05 05 04 00 0 0 02 0 3 02 03 00 00 02 00 07 1 0 07 0 3 13 05 04 02 06 06 02 0 0 03 0 3};";
        }
        return "";
    }
};
addPossibleValuesFunction(SionPresetVoiceMIDI_DRUM, SionPresetVoiceMIDI_DRUM._SEQ_CLICK_H, SionPresetVoiceMIDI_DRUM._BELL_TREE);

