

var MidiControllerType = {
    BANK_SELECT: 0,
    MODULATION: 1,
    BREATH_CONTROLLER: 2,
    FOOT_CONTROLLER: 3,
    PORTAMENTO_TIME: 4,
    DATA_ENTRY_MSB: 5,
    VOLUME: 6,
    BALANCE: 7,
    PAN: 8,
    EXPRESSION_CONTROLLER: 9,
    EFFECT_CONTROL_1: 10,
    EFFECT_CONTROL_2: 11,
    GENERAL_PURPOSE_1: 12,
    GENERAL_PURPOSE_2: 13,
    GENERAL_PURPOSE_3: 14,
    GENERAL_PURPOSE_4: 15,
    BANK_SELECT_LSB: 16,
    MODULATION_LSB: 17,
    BREATH_CONTROLLER_LSB: 18,
    FOOT_CONTROLLER_LSB: 19,
    PORTAMENTO_TIME_LSB: 20,
    DATA_ENTRY_LSB: 21,
    VOLUME_LSB: 22,
    BALANCE_LSB: 23,
    PAN_LSB: 24,
    EXPRESSION_CONTROLLER_LSB: 25,
    EFFECT_CONTROL_1_LSB: 26,
    EFFECT_CONTROL_2_LSB: 27,
    DAMPER_PEDAL: 28,
    PORTAMENTO: 29,
    SOSTENUTO: 30,
    SOFT_PEDAL: 31,
    LEGATO_FOOTSWITCH: 32,
    HOLD_2: 33,
    SOUND_CONTROLLER_1: 34,
    SOUND_CONTROLLER_2: 35,
    SOUND_CONTROLLER_3: 36,
    SOUND_CONTROLLER_4: 37,
    SOUND_CONTROLLER_5: 38,
    SOUND_CONTROLLER_6: 39,
    SOUND_CONTROLLER_7: 40,
    SOUND_CONTROLLER_8: 41,
    SOUND_CONTROLLER_9: 42,
    SOUND_CONTROLLER_10: 43,
    GENERAL_PURPOSE_5: 44,
    GENERAL_PURPOSE_6: 45,
    GENERAL_PURPOSE_7: 46,
    GENERAL_PURPOSE_8: 47,
    PORTAMENTO_CONTROL: 48,
    EFFECTS_DEPTH_1: 49,
    EFFECTS_DEPTH_2: 50,
    EFFECTS_DEPTH_3: 51,
    EFFECTS_DEPTH_4: 52,
    EFFECTS_DEPTH_5: 53,
    DATA_INCREMENT: 54,
    DATA_DECREMENT: 55,
    NRPN_LSB: 56,
    NRPN_MSB: 57,
    RPN_LSB: 58,
    RPN_MSB: 59,
    ALL_SOUNDS_OFF: 60,
    ALL_CONTROLLERS_OFF: 61,
    LOCAL_KEYBOARD: 62,
    ALL_NOTES_OFF: 63,
    OMNI_MODE_OFF: 64,
    OMNI_MODE_ON: 65,
    MONO_OPERATION: 66,
    POLY_OPERATION: 67,

    getValue: function(type) {
        switch (type) {
            case MidiControllerType.ALL_CONTROLLERS_OFF:
                return 121;
            case MidiControllerType.ALL_NOTES_OFF:
                return 123;
            case MidiControllerType.ALL_SOUNDS_OFF:
                return 120;
            case MidiControllerType.BALANCE:
                return 8;
            case MidiControllerType.BANK_SELECT:
                return 0;
            case MidiControllerType.BREATH_CONTROLLER:
                return 2;
            case MidiControllerType.BALANCE_LSB:
                return 40;
            case MidiControllerType.BANK_SELECT_LSB:
                return 32;
            case MidiControllerType.BREATH_CONTROLLER_LSB:
                return 34;
            case MidiControllerType.DAMPER_PEDAL:
                return 64;
            case MidiControllerType.DATA_DECREMENT:
                return 97;
            case MidiControllerType.DATA_ENTRY_MSB:
                return 6;
            case MidiControllerType.DATA_INCREMENT:
                return 96;
            case MidiControllerType.DATA_ENTRY_LSB:
                return 0;
            case MidiControllerType.EFFECTS_DEPTH_1:
                return 91;
            case MidiControllerType.EFFECTS_DEPTH_2:
                return 92;
            case MidiControllerType.EFFECTS_DEPTH_3:
                return 93;
            case MidiControllerType.EFFECTS_DEPTH_4:
                return 94;
            case MidiControllerType.EFFECTS_DEPTH_5:
                return 95;
            case MidiControllerType.EFFECT_CONTROL_1:
                return 12;
            case MidiControllerType.EFFECT_CONTROL_2:
                return 13;
            case MidiControllerType.EFFECT_CONTROL_1_LSB:
                return 44;
            case MidiControllerType.EFFECT_CONTROL_2_LSB:
                return 45;
            case MidiControllerType.EXPRESSION_CONTROLLER_LSB:
                return 43;
            case MidiControllerType.EXPRESSION_CONTROLLER:
                return 11;
            case MidiControllerType.FOOT_CONTROLLER:
                return 4;
            case MidiControllerType.FOOT_CONTROLLER_LSB:
                return 36;
            case MidiControllerType.GENERAL_PURPOSE_1:
                return 16;
            case MidiControllerType.GENERAL_PURPOSE_2:
                return 17;
            case MidiControllerType.GENERAL_PURPOSE_3:
                return 18;
            case MidiControllerType.GENERAL_PURPOSE_4:
                return 19;
            case MidiControllerType.GENERAL_PURPOSE_5:
                return 80;
            case MidiControllerType.GENERAL_PURPOSE_6:
                return 81;
            case MidiControllerType.GENERAL_PURPOSE_7:
                return 82;
            case MidiControllerType.GENERAL_PURPOSE_8:
                return 83;
            case MidiControllerType.HOLD_2:
                return 69;
            case MidiControllerType.LOCAL_KEYBOARD:
                return 0;
            case MidiControllerType.LEGATO_FOOTSWITCH:
                return 68;
            case MidiControllerType.MODULATION:
                return 1;
            case MidiControllerType.MODULATION_LSB:
                return 33;
            case MidiControllerType.MONO_OPERATION:
                return 126;
            case MidiControllerType.NRPN_LSB:
                return 98;
            case MidiControllerType.NRPN_MSB:
                return 99;
            case MidiControllerType.OMNI_MODE_OFF:
                return 124;
            case MidiControllerType.OMNI_MODE_ON:
                return 125;
            case MidiControllerType.PAN:
                return 10;
            case MidiControllerType.PORTAMENTO:
                return 65;
            case MidiControllerType.PORTAMENTO_CONTROL:
                return 84;
            case MidiControllerType.PORTAMENTO_TIME:
                return 5;
            case MidiControllerType.PAN_LSB:
                return 42;
            case MidiControllerType.POLY_OPERATION:
                return 127;
            case MidiControllerType.PORTAMENTO_TIME_LSB:
                return 37;
            case MidiControllerType.RPN_LSB:
                return 100;
            case MidiControllerType.RPN_MSB:
                return 101;
            case MidiControllerType.SOFT_PEDAL:
                return 67;
            case MidiControllerType.SOSTENUTO:
                return 66;
            case MidiControllerType.SOUND_CONTROLLER_1:
                return 70;
            case MidiControllerType.SOUND_CONTROLLER_2:
                return 71;
            case MidiControllerType.SOUND_CONTROLLER_3:
                return 72;
            case MidiControllerType.SOUND_CONTROLLER_4:
                return 73;
            case MidiControllerType.SOUND_CONTROLLER_5:
                return 74;
            case MidiControllerType.SOUND_CONTROLLER_6:
                return 75;
            case MidiControllerType.SOUND_CONTROLLER_7:
                return 76;
            case MidiControllerType.SOUND_CONTROLLER_8:
                return 77;
            case MidiControllerType.SOUND_CONTROLLER_9:
                return 78;
            case MidiControllerType.SOUND_CONTROLLER_10:
                return 79;
            case MidiControllerType.VOLUME:
                return 7;
            case MidiControllerType.VOLUME_LSB:
                return 39;
        }
        logit("Warning unknown midi controller type " + type);
        return 0;
    },

    toString: function(type) {
        switch (type) {
            case MidiControllerType.ALL_CONTROLLERS_OFF:
                return "All controllers off";
            case MidiControllerType.ALL_NOTES_OFF:
                return "All notes off";
            case MidiControllerType.ALL_SOUNDS_OFF:
                return "All sounds off";
            case MidiControllerType.BALANCE:
                return "Balance";
            case MidiControllerType.BALANCE_LSB:
                return "Balance LSB";
            case MidiControllerType.BANK_SELECT:
                return "Bank select";
            case MidiControllerType.BANK_SELECT_LSB:
                return "Bank select LSB";
            case MidiControllerType.BREATH_CONTROLLER:
                return "Breath controller";
            case MidiControllerType.BREATH_CONTROLLER_LSB:
                return "Breath controller LSB";
            case MidiControllerType.DAMPER_PEDAL:
                return "Damper pedal";
            case MidiControllerType.DATA_DECREMENT:
                return "Data decrement";
            case MidiControllerType.DATA_ENTRY_LSB:
                return "Data entry LSB";
            case MidiControllerType.DATA_ENTRY_MSB:
                return "Data entry MSB";
            case MidiControllerType.DATA_INCREMENT:
                return "Data increment";
            case MidiControllerType.EFFECTS_DEPTH_1:
                return "Effects depth 1";
            case MidiControllerType.EFFECTS_DEPTH_2:
                return "Effects depth 2";
            case MidiControllerType.EFFECTS_DEPTH_3:
                return "Effects depth 3";
            case MidiControllerType.EFFECTS_DEPTH_4:
                return "Effects depth 4";
            case MidiControllerType.EFFECTS_DEPTH_5:
                return "Effects depth 5";
            case MidiControllerType.EFFECT_CONTROL_1:
                return "Effect control 1";
            case MidiControllerType.EFFECT_CONTROL_1_LSB:
                return "Effect control 1 LSB";
            case MidiControllerType.EFFECT_CONTROL_2:
                return "Effect control 2";
            case MidiControllerType.EFFECT_CONTROL_2_LSB:
                return "Effect control 2 LSB";
            case MidiControllerType.EXPRESSION_CONTROLLER:
                return "Expression controller";
            case MidiControllerType.EXPRESSION_CONTROLLER_LSB:
                return "Expression controller LSB";
            case MidiControllerType.FOOT_CONTROLLER:
                return "Foot controller";
            case MidiControllerType.FOOT_CONTROLLER_LSB:
                return "Foot controller LSB";
            case MidiControllerType.GENERAL_PURPOSE_1:
                return "General purpose 1";
            case MidiControllerType.GENERAL_PURPOSE_2:
                return "General purpose 2";
            case MidiControllerType.GENERAL_PURPOSE_3:
                return "General purpose 3";
            case MidiControllerType.GENERAL_PURPOSE_4:
                return "General purpose 4";
            case MidiControllerType.GENERAL_PURPOSE_5:
                return "General purpose 5";
            case MidiControllerType.GENERAL_PURPOSE_6:
                return "General purpose 6";
            case MidiControllerType.GENERAL_PURPOSE_7:
                return "General purpose 7";
            case MidiControllerType.GENERAL_PURPOSE_8:
                return "General purpose 8";
            case MidiControllerType.HOLD_2:
                return "Hold 2";
            case MidiControllerType.LEGATO_FOOTSWITCH:
                return "Legato footswitch";
            case MidiControllerType.LOCAL_KEYBOARD:
                return "Local keyboard";
            case MidiControllerType.MODULATION:
                return "Modulation";
            case MidiControllerType.MODULATION_LSB:
                return "Modulation LSB";
            case MidiControllerType.MONO_OPERATION:
                return "Mono operation";
            case MidiControllerType.NRPN_LSB:
                return "NRPN LSB";
            case MidiControllerType.NRPN_MSB:
                return "NRPN MSB";
            case MidiControllerType.OMNI_MODE_OFF:
                return "Omni mode off";
            case MidiControllerType.OMNI_MODE_ON:
                return "Omni mode on";
            case MidiControllerType.PAN:
                return "Pan";
            case MidiControllerType.PAN_LSB:
                return "Pan LSB";
            case MidiControllerType.POLY_OPERATION:
                return "Poly operation";
            case MidiControllerType.PORTAMENTO:
                return "Portamento";
            case MidiControllerType.PORTAMENTO_CONTROL:
                return "Portamento control";
            case MidiControllerType.PORTAMENTO_TIME:
                return "Portamento time";
            case MidiControllerType.PORTAMENTO_TIME_LSB:
                return "Portamento time LSB";
            case MidiControllerType.RPN_LSB:
                return "RPN LSB";
            case MidiControllerType.RPN_MSB:
                return "RPN MSB";
            case MidiControllerType.SOFT_PEDAL:
                return "Soft pedal";
            case MidiControllerType.SOSTENUTO:
                return "Sostenuto";
            case MidiControllerType.SOUND_CONTROLLER_1:
                return "Sound controller 1";
            case MidiControllerType.SOUND_CONTROLLER_2:
                return "Sound controller 2";
            case MidiControllerType.SOUND_CONTROLLER_3:
                return "Sound controller 3";
            case MidiControllerType.SOUND_CONTROLLER_4:
                return "Sound controller 4";
            case MidiControllerType.SOUND_CONTROLLER_5:
                return "Sound controller 5";
            case MidiControllerType.SOUND_CONTROLLER_6:
                return "Sound controller 6";
            case MidiControllerType.SOUND_CONTROLLER_7:
                return "Sound controller 7";
            case MidiControllerType.SOUND_CONTROLLER_8:
                return "Sound controller 8";
            case MidiControllerType.SOUND_CONTROLLER_9:
                return "Sound controller 9";
            case MidiControllerType.SOUND_CONTROLLER_10:
                return "Sound controller 10";
            case MidiControllerType.VOLUME:
                return "Volume";
            case MidiControllerType.VOLUME_LSB:
                return "Volume LSB";
        }
        return "Unknown midi controller type " + type;
    }

};
addPossibleValuesFunction(MidiControllerType, MidiControllerType.BANK_SELECT, MidiControllerType.POLY_OPERATION);


var MidiDrum = {
    BASS_DRUM_2: 35,
    BASS_DRUM_1: 36,
    RIMSHOT: 37,
    SNARE_DRUM_1: 38,
    HAND_CLAP: 39,
    SNARE_DRUM_2: 40,
    LOW_TOM_2: 41,
    CLOSED_HIHAT: 42,
    LOW_TOM_1: 43,
    PEDAL_HIHAT: 44,
    MID_TOM_2: 45,
    OPEN_HIHAT: 46,
    MID_TOM_1: 47,
    HIGH_TOM_2: 48,
    CRASH_CYMBAL_1: 49,
    HIGH_TOM_1: 50,
    RIDE_CYMBAL_1: 51,
    CHINESE_CYMBAL: 52,
    RIDE_BELL: 53,
    TAMBOURINE: 54,
    SPLASH_CYMBAL: 55,
    COWBELL: 56,
    CRASH_CYMBAL_2: 57,
    VIBRA_SLAP: 58,
    RIDE_CYMBAL_2: 59,
    HIGH_BONGO: 60,
    LOW_BONGO: 61,
    MUTE_HIGH_CONGA: 62,
    OPEN_HIGH_CONGA: 63,
    LOW_CONGA: 64,
    HIGH_TIMBALE: 65,
    LOW_TIMBALE: 66,
    HIGH_AGOGO: 67,
    LOW_AGOGO: 68,
    CABASA: 69,
    MARACAS: 70,
    SHORT_WHISTLE: 71,
    LONG_WHISTLE: 72,
    SHORT_GUIRO: 73,
    LONG_GUIRO: 74,
    CLAVES: 75,
    HIGH_WOOD_BLOCK: 76,
    LOW_WOOD_BLOCK: 77,
    MUTE_CUICA: 78,
    OPEN_CUICA: 79,
    MUTE_TRIANGLE: 80,
    OPEN_TRIANGLE: 81,


    toString: function(type) {
        var postfix = " (" + type + ", " + toPitchClassString(type) + "" + Math.floor(type / 12) + ")";
        switch (type) {
            case MidiDrum.BASS_DRUM_1:
                return "Bass drum 1" + postfix;
            case MidiDrum.BASS_DRUM_2:
                return "Bass drum 2" + postfix;
            case MidiDrum.CABASA:
                return "Cabasa" + postfix;
            case MidiDrum.CHINESE_CYMBAL:
                return "Chinese cymbal" + postfix;
            case MidiDrum.CLAVES:
                return "Claves" + postfix;
            case MidiDrum.CLOSED_HIHAT:
                return "Closed hi-hat" + postfix;
            case MidiDrum.COWBELL:
                return "Cowbell" + postfix;
            case MidiDrum.CRASH_CYMBAL_1:
                return "Crash cymbal 1" + postfix;
            case MidiDrum.CRASH_CYMBAL_2:
                return "Crash cymbal 2" + postfix;
            case MidiDrum.HAND_CLAP:
                return "Hand clap" + postfix;
            case MidiDrum.HIGH_AGOGO:
                return "High agogo" + postfix;
            case MidiDrum.HIGH_BONGO:
                return "High bongo" + postfix;
            case MidiDrum.HIGH_TIMBALE:
                return "Timbale" + postfix;
            case MidiDrum.HIGH_TOM_1:
                return "High tom 1" + postfix;
            case MidiDrum.HIGH_TOM_2:
                return "High tom 2" + postfix;
            case MidiDrum.HIGH_WOOD_BLOCK:
                return "High wood block" + postfix;
            case MidiDrum.LONG_GUIRO:
                return "Long guiro" + postfix;
            case MidiDrum.LONG_WHISTLE:
                return "Long whistle" + postfix;
            case MidiDrum.LOW_AGOGO:
                return "Low agogo" + postfix;
            case MidiDrum.LOW_BONGO:
                return "Low bongo" + postfix;
            case MidiDrum.LOW_CONGA:
                return "Low conga" + postfix;
            case MidiDrum.LOW_TIMBALE:
                return "Low timbale" + postfix;
            case MidiDrum.LOW_TOM_1:
                return "Low tom 1" + postfix;
            case MidiDrum.LOW_TOM_2:
                return "Low tom 2" + postfix;
            case MidiDrum.LOW_WOOD_BLOCK:
                return "Low wood block" + postfix;
            case MidiDrum.MARACAS:
                return "Maracas" + postfix;
            case MidiDrum.MID_TOM_1:
                return "Mid tom 1" + postfix;
            case MidiDrum.MID_TOM_2:
                return "Mid tom 2" + postfix;
            case MidiDrum.MUTE_CUICA:
                return "Mute cuica" + postfix;
            case MidiDrum.MUTE_HIGH_CONGA:
                return "Mute high conga" + postfix;
            case MidiDrum.MUTE_TRIANGLE:
                return "Mute triangle" + postfix;
            case MidiDrum.OPEN_CUICA:
                return "Open cuica" + postfix;
            case MidiDrum.OPEN_HIGH_CONGA:
                return "Open high conga" + postfix;
            case MidiDrum.OPEN_HIHAT:
                return "Open hi-hat" + postfix;
            case MidiDrum.OPEN_TRIANGLE:
                return "Open triangle" + postfix;
            case MidiDrum.PEDAL_HIHAT:
                return "Pedal hi-hat" + postfix;
            case MidiDrum.RIDE_BELL:
                return "Ride bell" + postfix;
            case MidiDrum.RIDE_CYMBAL_1:
                return "Ride cymbal 1" + postfix;
            case MidiDrum.RIDE_CYMBAL_2:
                return "Ride cymbal 2" + postfix;
            case MidiDrum.RIMSHOT:
                return "Rimshot" + postfix;
            case MidiDrum.SHORT_GUIRO:
                return "Short guiro" + postfix;
            case MidiDrum.SHORT_WHISTLE:
                return "Short whistle" + postfix;
            case MidiDrum.SNARE_DRUM_1:
                return "Snare drum 1" + postfix;
            case MidiDrum.SNARE_DRUM_2:
                return "Snare drum 2" + postfix;
            case MidiDrum.SPLASH_CYMBAL:
                return "Splash cymbal" + postfix;
            case MidiDrum.TAMBOURINE:
                return "Tambourine" + postfix;
            case MidiDrum.VIBRA_SLAP:
                return "Vibraslap" + postfix;
        }
        return "unknown midi drum" + postfix;
    }

};
addPossibleValuesFunction(MidiDrum, MidiDrum.BASS_DRUM_2, MidiDrum.VIBRA_SLAP);


var MidiProgram = {
    ACOUSTIC_GRAND_PIANO: 0,
    BRIGHT_ACOUSTIC_PIANO: 1,
    ELECTRIC_GRAND_PIANO: 2,
    HONKY_TONK_PIANO: 3,
    ELECTRIC_PIANO_1: 4,
    ELECTRIC_PIANO_2: 5,
    HARPSICHORD: 6,
    CLAVINET: 7,
    CELESTA: 8,
    GLOCKENSPIEL: 9,
    MUSIC_BOX: 10,
    VIBRAPHONE: 11,
    MARIMBA: 12,
    XYLOPHONE: 13,
    TUBULAR_BELLS: 14,
    DULCIMER: 15,
    DRAWBAR_ORGAN: 16,
    PERCUSSIVE_ORGAN: 17,
    ROCK_ORGAN: 18,
    CHURCH_ORGAN: 19,
    REED_ORGAN: 20,
    ACCORDION: 21,
    HARMONICA: 22,
    TANGO_ACCORDION: 23,
    ACOUSTIC_NYLON_GUITAR: 24,
    ACOUSTIC_STEEL_GUITAR: 25,
    ELECTRIC_JAZZ_GUITAR: 26,
    ELECTRIC_CLEAN_GUITAR: 27,
    ELECTRIC_MUTED_GUITAR: 28,
    OVERDRIVEN_GUITAR: 29,
    DISTORTION_GUITAR: 30,
    GUITAR_HARMONICS: 31,
    ACOUSTIC_BASS: 32,
    ELECTRIC_FINGER_BASS: 33,
    ELECTRIC_PICK_BASS: 34,
    FRETLESS_BASS: 35,
    SLAP_BASS_1: 36,
    SLAP_BASS_2: 37,
    SYNTH_BASS_1: 38,
    SYNTH_BASS_2: 39,
    VIOLIN: 40,
    VIOLA: 41,
    CELLO: 42,
    CONTRABASS: 43,
    TREMOLO_STRINGS: 44,
    PIZZICATO_STRINGS: 45,
    ORCHESTRAL_HARP: 46,
    TIMPANI: 47,
    STRING_ENSEMBLE_1: 48,
    STRING_ENSEMBLE_2: 49,
    SYNTH_STRINGS_1: 50,
    SYNTH_STRINGS_2: 51,
    CHOIR_AAHS: 52,
    VOICE_OOHS: 53,
    SYNTH_CHOIR: 54,
    ORCHESTRA_HIT: 55,

    TRUMPET: 56,
    TROMBONE: 57,
    TUBA: 58,
    MUTED_TRUMPET: 59,
    FRENCH_HORN: 60,
    BRASS_SECTION: 61,
    SYNTH_BRASS_1: 62,
    SYNTH_BRASS_2: 63,
    SOPRANO_SAX: 64,
    ALTO_SAX: 65,
    TENOR_SAX: 66,
    BARITONE_SAX: 67,
    OBOE: 68,
    ENGLISH_HORN: 69,
    BASSOON: 70,
    CLARINET: 71,
    PICCOLO: 72,
    FLUTE: 73,
    RECORDER: 74,
    PAN_FLUTE: 75,
    BLOWN_BOTTLE: 76,
    SHAKUHACHI: 77,
    WHISTLE: 78,
    OCARINA: 79,
    SQUARE_LEAD: 80,
    SAW_LEAD: 81,
    CALLIOPE_LEAD: 82,
    CHIFF_LEAD: 83,
    CHARANG_LEAD: 84,
    VOICE_LEAD: 85,
    FIFTHS_LEAD: 86,
    BASS_PLUS_LEAD: 87,
    NEW_AGE_PAD: 88,
    WARM_PAD: 89,
    POLYSYNTH_PAD: 90,
    CHOIR_PAD: 91,
    BOWED_PAD: 92,
    METALLIC_PAD: 93,
    HALO_PAD: 94,
    SWEEP_PAD: 95,
    RAIN_SFX: 96,
    SOUNDTRACK_SFX: 97,
    CRYSTAL_SFX: 98,
    ATMOSPHERE_SFX: 99,
    BRIGHTNESS_SFX: 100,
    GOBLINS_SFX: 101,
    ECHOES_SFX: 102,
    SCIFI_SFX: 103,
    SITAR: 104,
    BANJO: 105,
    SHAMISEN: 106,
    KOTO: 107,
    KALIMBA: 108,
    BAGPIPE: 109,
    FIDDLE: 110,
    SHANAI: 111,
    TINKLE_BELL: 112,
    AGOGO: 113,
    STEEL_DRUMS: 114,
    WOODBLOCK: 115,
    TAIKO_DRUM: 116,
    MELODIC_TOM: 117,
    SYNTH_DRUM: 118,
    REVERSE_CYMBAL: 119,
    GUITAR_FRET_NOISE: 120,
    BREATH_NOISE: 121,
    SEASHORE: 122,
    BIRD_TWEET: 123,
    TELEPHONE_RING: 124,
    HELICOPTER: 125,
    APPLAUSE: 126,
    GUNSHOT: 127,




    toString: function(type) {
        switch (type) {
            case MidiProgram.ACCORDION:
                return "Accordion";
            case MidiProgram.ACOUSTIC_BASS:
                return "Acoustic bass";
            case MidiProgram.ACOUSTIC_GRAND_PIANO:
                return "Acoustic grand piano";
            case MidiProgram.ACOUSTIC_NYLON_GUITAR:
                return "Acoustic nylon guitar";
            case MidiProgram.ACOUSTIC_STEEL_GUITAR:
                return "Acoustic steel guitar";
            case MidiProgram.AGOGO:
                return "Agogo";
            case MidiProgram.ALTO_SAX:
                return "Alto sax";
            case MidiProgram.APPLAUSE:
                return "Applause";
            case MidiProgram.ATMOSPHERE_SFX:
                return "Atmosphere sfx";
            case MidiProgram.BRIGHT_ACOUSTIC_PIANO:
                return "Bright acoustic piano";
            case MidiProgram.BAGPIPE:
                return "Bagpipe";
            case MidiProgram.BANJO:
                return "Banjo";
            case MidiProgram.BARITONE_SAX:
                return "Baritone sax";
            case MidiProgram.BASSOON:
                return "Bassoon";
            case MidiProgram.BASS_PLUS_LEAD:
                return "Bass plus lead";
            case MidiProgram.BIRD_TWEET:
                return "Bird tweet";
            case MidiProgram.BLOWN_BOTTLE:
                return "Blown bottle";
            case MidiProgram.BOWED_PAD:
                return "Bowed pad";
            case MidiProgram.BRASS_SECTION:
                return "Brass section";
            case MidiProgram.BREATH_NOISE:
                return "Breath noise";
            case MidiProgram.BRIGHTNESS_SFX:
                return "Brightness sfx";
            case MidiProgram.CELESTA:
                return "Celesta";
            case MidiProgram.CELLO:
                return "Cello";
            case MidiProgram.CHOIR_AAHS:
                return "Choir aahs";
            case MidiProgram.CHURCH_ORGAN:
                return "Church organ";
            case MidiProgram.CLAVINET:
                return "Clavinet";
            case MidiProgram.CONTRABASS:
                return "Contrabass";
            case MidiProgram.CALLIOPE_LEAD:
                return "Calliope lead";
            case MidiProgram.CHARANG_LEAD:
                return "Charang lead";
            case MidiProgram.CHIFF_LEAD:
                return "Chiff lead";
            case MidiProgram.CHOIR_PAD:
                return "Choir pad";
            case MidiProgram.CLARINET:
                return "Clarinet";
            case MidiProgram.CRYSTAL_SFX:
                return "Crystal sfx";
            case MidiProgram.DISTORTION_GUITAR:
                return "Distortion guitar";
            case MidiProgram.DRAWBAR_ORGAN:
                return "Drawbar organ";
            case MidiProgram.DULCIMER:
                return "Dulcimer";
            case MidiProgram.ELECTRIC_CLEAN_GUITAR:
                return "Electric clean guitar";
            case MidiProgram.ELECTRIC_FINGER_BASS:
                return "Electric finger bass";
            case MidiProgram.ELECTRIC_GRAND_PIANO:
                return "Electric grand piano";
            case MidiProgram.ELECTRIC_JAZZ_GUITAR:
                return "Electric jazz guitar";
            case MidiProgram.ELECTRIC_MUTED_GUITAR:
                return "Electric muted guitar";
            case MidiProgram.ELECTRIC_PIANO_1:
                return "Electric piano 1";
            case MidiProgram.ELECTRIC_PIANO_2:
                return "Electric piano 2";
            case MidiProgram.ELECTRIC_PICK_BASS:
                return "Electric pick bass";
            case MidiProgram.ECHOES_SFX:
                return "Echoes sfx";
            case MidiProgram.ENGLISH_HORN:
                return "English hord";
            case MidiProgram.FRETLESS_BASS:
                return "Fretless bass";
            case MidiProgram.FIDDLE:
                return "Fiddle";
            case MidiProgram.FIFTHS_LEAD:
                return "Fifths lead";
            case MidiProgram.FLUTE:
                return "Flute";
            case MidiProgram.FRENCH_HORN:
                return "French horn";
            case MidiProgram.GLOCKENSPIEL:
                return "Glockenspiel";
            case MidiProgram.GUITAR_HARMONICS:
                return "Guitar harmonics";
            case MidiProgram.GOBLINS_SFX:
                return "Goblins sfx";
            case MidiProgram.GUITAR_FRET_NOISE:
                return "Guitar fret noise";
            case MidiProgram.GUNSHOT:
                return "Gunshot";
            case MidiProgram.HARMONICA:
                return "Harmonica";
            case MidiProgram.HARPSICHORD:
                return "Harpsichord";
            case MidiProgram.HONKY_TONK_PIANO:
                return "Honky-tonk piano";
            case MidiProgram.HALO_PAD:
                return "Halo pad";
            case MidiProgram.HELICOPTER:
                return "Helicopter";
            case MidiProgram.KALIMBA:
                return "Kalimba";
            case MidiProgram.KOTO:
                return "Koto";
            case MidiProgram.MARIMBA:
                return "Marimba";
            case MidiProgram.MUSIC_BOX:
                return "Music box";
            case MidiProgram.MELODIC_TOM:
                return "Melodic tom";
            case MidiProgram.METALLIC_PAD:
                return "Metallic pad";
            case MidiProgram.MUTED_TRUMPET:
                return "Muted trumpet";
            case MidiProgram.NEW_AGE_PAD:
                return "New age pad";
            case MidiProgram.ORCHESTRAL_HARP:
                return "Orchestral harp";
            case MidiProgram.ORCHESTRA_HIT:
                return "Orchestra hit";
            case MidiProgram.OVERDRIVEN_GUITAR:
                return "Overdriven guitar";
            case MidiProgram.OBOE:
                return "Oboe";
            case MidiProgram.OCARINA:
                return "Ocarina";
            case MidiProgram.PERCUSSIVE_ORGAN:
                return "Percussive organ";
            case MidiProgram.PIZZICATO_STRINGS:
                return "Pizzicato strings";
            case MidiProgram.PAN_FLUTE:
                return "Pan flute";
            case MidiProgram.PICCOLO:
                return "Piccolo";
            case MidiProgram.POLYSYNTH_PAD:
                return "Polysynth pad";
            case MidiProgram.REED_ORGAN:
                return "Reed organ";
            case MidiProgram.ROCK_ORGAN:
                return "Rock organ";
            case MidiProgram.RAIN_SFX:
                return "Rain sfx";
            case MidiProgram.RECORDER:
                return "Recorder";
            case MidiProgram.REVERSE_CYMBAL:
                return "Reverse cymbal";
            case MidiProgram.SLAP_BASS_1:
                return "Slap bass 1";
            case MidiProgram.SLAP_BASS_2:
                return "Slap bass 2";
            case MidiProgram.STRING_ENSEMBLE_1:
                return "String ensemble 1";
            case MidiProgram.STRING_ENSEMBLE_2:
                return "String ensemble 2";
            case MidiProgram.SYNTH_BASS_1:
                return "Synth bass 1";
            case MidiProgram.SYNTH_BASS_2:
                return "Synth bass 2";
            case MidiProgram.SYNTH_CHOIR:
                return "Synth choir";
            case MidiProgram.SYNTH_STRINGS_1:
                return "Synth strings 1";
            case MidiProgram.SYNTH_STRINGS_2:
                return "Synth strings 2";
            case MidiProgram.SAW_LEAD:
                return "Saw lead";
            case MidiProgram.SCIFI_SFX:
                return "Sci-fi sfx";
            case MidiProgram.SEASHORE:
                return "Seashore";
            case MidiProgram.SHAKUHACHI:
                return "Shakuhachi";
            case MidiProgram.SHAMISEN:
                return "Shamisen";
            case MidiProgram.SHANAI:
                return "Shanai";
            case MidiProgram.SITAR:
                return "Sitar";
            case MidiProgram.SOPRANO_SAX:
                return "Soprano sax";
            case MidiProgram.SOUNDTRACK_SFX:
                return "Soundtrack sfx";
            case MidiProgram.SQUARE_LEAD:
                return "Square lead";
            case MidiProgram.STEEL_DRUMS:
                return "Steel drums";
            case MidiProgram.SWEEP_PAD:
                return "Sweep pad";
            case MidiProgram.SYNTH_DRUM:
                return "Synth drum";
            case MidiProgram.SYNTH_BRASS_1:
                return "Synth brass 1";
            case MidiProgram.SYNTH_BRASS_2:
                return "Synth brass 2";
            case MidiProgram.TANGO_ACCORDION:
                return "Tango accordion";
            case MidiProgram.TIMPANI:
                return "Timpani";
            case MidiProgram.TREMOLO_STRINGS:
                return "Tremolo strings";
            case MidiProgram.TUBULAR_BELLS:
                return "Tubular bells";
            case MidiProgram.TAIKO_DRUM:
                return "Taiko drum";
            case MidiProgram.TELEPHONE_RING:
                return "Telephone ring";
            case MidiProgram.TENOR_SAX:
                return "Tenor sax";
            case MidiProgram.TINKLE_BELL:
                return "Tinkle bell";
            case MidiProgram.TROMBONE:
                return "Trombone";
            case MidiProgram.TRUMPET:
                return "Trumpet";
            case MidiProgram.TUBA:
                return "Tuba";
            case MidiProgram.VIBRAPHONE:
                return "Vibraphone";
            case MidiProgram.VIOLA:
                return "Viola";
            case MidiProgram.VIOLIN:
                return "Violin";
            case MidiProgram.VOICE_OOHS:
                return "Voice oohs";
            case MidiProgram.VOICE_LEAD:
                return "Voice lead";
            case MidiProgram.WARM_PAD:
                return "Warm pad";
            case MidiProgram.WHISTLE:
                return "Whistle";
            case MidiProgram.WOODBLOCK:
                return "Woodblock";
            case MidiProgram.XYLOPHONE:
                return "Xylophone";
        }
        return "Unknown midi program " + type;
    }
};
addPossibleValuesFunction(MidiProgram, MidiProgram.ACOUSTIC_GRAND_PIANO, MidiProgram.GUNSHOT);

