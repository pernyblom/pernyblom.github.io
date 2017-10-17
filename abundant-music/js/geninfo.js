
function GenInfo() {
    this.globalSeed = 123456;

    // Song structure and phrase group seeds
    this.tempoSeed = 123456;
    this.scaleSeed = 123456;
    this.tsSeed = 123456;
    this.introSeed = 123456;
    this.endSeed = 123456;
    this.renderAmountSeed = 123456;
    this.modulationSeed = 123456;
    this.tonicizationSeed = 123456;
    this.songStructureSeed = 123456;
    this.glueSeed = 123456;
    this.phraseGroupSeed = 123456;
    this.phraseGroupSimilaritySeed = 123456;
    this.groupSimilaritySeed = 123456;
    this.groupDifferenceSeed = 123456;

    // Indices seeds. Yes, they are referenced somewhere but the property name is computed :)
    this.melodyShapeIndicesSeed = 123456;
    this.bassShapeIndicesSeed = 123456;
    this.harmonyIndicesSeed = 123456;
    this.harmonyRythmIndicesSeed = 123456;
    this.suspendIndicesSeed = 123456;
    this.melodyChannelDistributionIndicesSeed = 123456;
    this.inner1ChannelDistributionIndicesSeed = 123456;
    this.inner2ChannelDistributionIndicesSeed = 123456;
    this.bassChannelDistributionIndicesSeed = 123456;
    this.melodyMotifDistributionIndicesSeed = 123456;
    this.inner1MotifDistributionIndicesSeed = 123456;
    this.inner2MotifDistributionIndicesSeed = 123456;
    this.bassMotifDistributionIndicesSeed = 123456;
    this.percussionMotifDistributionIndicesSeed = 123456;
    this.percussionFillMotifDistributionIndicesSeed = 123456;
    this.harmonyExtraIndicesSeed = 123456;
    this.renderAmountIndicesSeed = 123456;
    this.tempoIndicesSeed = 123456;
    this.sequentialTempoChangeIndicesSeed = 123456;
    this.parallelTempoChangeIndicesSeed = 123456;
    this.sequentialMelodyEffectChangeIndicesSeed = 123456;
    this.sequentialInner1EffectChangeIndicesSeed = 123456;
    this.sequentialInner2EffectChangeIndicesSeed = 123456;
    this.sequentialBassEffectChangeIndicesSeed = 123456;
    this.sequentialPercussionEffectChangeIndicesSeed = 123456;

    // All else seeds
    this.instrumentTypeSeed = 123456;
    this.melodyInstrumentSeed = 123456;
    this.inner1InstrumentSeed = 123456;
    this.inner2InstrumentSeed = 123456;
    this.bassInstrumentSeed = 123456;
    this.melodyMotifSeed = 123456;
    this.melodyMotifRythmSeed = 123456;
    this.melodyMotifEmbellishConnectSeed = 123456;
    this.bassMotifSeed = 123456;
    this.bassMotifRythmSeed = 123456;
    this.bassMotifEmbellishConnectSeed = 123456;
    this.harmonyMotifSeed = 123456;
    this.harmonyMotifRythmSeed = 123456;
    this.harmonyMotifEmbellishConnectSeed = 123456;
    this.percussionMotifSeed = 123456;
    this.percussionFillMotifSeed = 123456;
    this.percussionInstrumentSeed = 123456;
    this.percussionFillInstrumentSeed = 123456;
    this.percussionMotifRythmSeed = 123456;
    this.percussionFillMotifRythmSeed = 123456;
    this.melodyShapeSeed = 123456;
    this.bassShapeSeed = 123456;
    this.harmonyRythmSeed = 123456;
    this.melodyMotifDistributionSeed = 123456;
    this.inner1MotifDistributionSeed = 123456;
    this.inner2MotifDistributionSeed = 123456;
    this.bassMotifDistributionSeed = 123456;
    this.percussionMotifDistributionSeed = 123456;
    this.percussionFillMotifDistributionSeed = 123456;
    this.melodyHarmonyPunctationSeed = 123456;
    this.innerHarmonyPunctationSeed = 123456;
    this.harmonySeed = 123456;
    this.channelDistributionSeed = 123456;
    this.tempoChangeSeed = 123456;
    this.effectChangeSeed = 123456;
    this.suspendSeed = 123456;

    // Likelihoods and other settings
    this.allInstrumentsDifferentProbability = 0.35;
    this.adaptHarmonyRythmToTempo = true;
    this.adaptHarmonyRythmToTimeSignature = true;
    this.adaptSuspensionToTempo = true;
    this.adaptMotifRythmsToTempo = true; // Kommer att användas så småningom när jag implementerat detta :)
    this.tonicizeLikelihoodMultipliers = [1.0]; // : möjligt att ha en för varje frasgrupp (som är fri)
    this.modulateLikelihoodMultiplier = 0.25; //
    this.simpleMixtureLikelihoods = [1.0]; // : (harmonyExtra får ett av dessa värden beroende på dess index)
    this.sus2ChordsLikelihoods = [1.0]; // : (harmonyExtra, se ovan)
    this.sus4ChordsLikelihoods = [1.0]; // : (harmonyExtra, se ovan)
    this.neighbourChordsLikelihoods = [1.0]; // : (harmonyExtra, se ovan)
    this.passingChordsLikelihoods = [1.0]; // : (harmonyExtra, se ovan)
    this.timeSignature2Likelihood = 1.0; //
    this.timeSignature3Likelihood = 1.0; //
    this.timeSignature4Likelihood = 3.0; //
    this.minorScaleLikelihood = 1; //
    this.majorScaleLikelihood = 1; //
    this.setScaleBaseNote = false;
    this.scaleBaseNote = 60;
    this.raiseLeadingInMinorProbabilities = [0.5]; // : harmonyExtra, se ovan
    this.strictBuildSongStructureLikelihoodMultiplier = 1.0; // : begränsar vilka song structures som kan användas
    this.buildSongStructureLikelihoodMultiplier = 1.0; // : begränsar vilka song structures som kan användas
    this.verseChorusSongStructureLikelihoodMultiplier = 1.0; // :
    this.verseChorusBridgeSongStructureLikelihoodMultiplier = 1.0; // :
    this.noMelodyPartSongStructureLikelihoodMultiplier = 1.0; // :
    this.electronicLikelihood = 1.0; //  : Kommer troligtvis att ändras när man får bättre musikstilar :)
    this.electricLikelihood = 1.0; //  : Kommer troligtvis att ändras när man får bättre musikstilar :)
    this.acousticLikelihood = 1.0; //  : Kommer troligtvis att ändras när man får bättre musikstilar :)
    this.filterFEffectsProbMultiplier = 1.0; // :
    this.filterBWEffectsProbMultiplier = 1.0; // :
    this.panEffectsProbMultiplier = 1.0; // :
    this.oddHarmonyRythmProbability = 0.01; // :
    this.melodyShareProbabilities = [0.3]; // : pss som för harmonyExtra fast för inner1motifdistributions
    this.endSongTempoChangeProbability = 0.5; // :
    this.endPhraseGroupTempoChangeProbabilities = [0.0]; // :
    this.adaptTempoToRenderAmount = true; // :
    this.tempoAdaptBias = 3;
    this.tempoAdaptRandomMultiplier = 3;
    this.useNaturalTempoChanges = true; // Increasing tempo up to target level, decrease rapidly etc.
    this.voiceLineSuspensionProbabilities = [0.5]; // : suspendInfos får detta som harmonyExtra ovan
    this.songIntroProbability = 0.7; // :
    this.songEndProbability = 0.5; // :
    this.withinPhraseGroupSimilarRandomFraction = 0.35; // :
    this.withinPhraseGroupSimilarBias = 0.55; // :
    this.samePhraseGroupIndexSimilarRandomFraction = 0.25; // :
    this.samePhraseGroupIndexSimilarBias = 0.5; // :
    this.differentPhraseGroupIndexDifferentRandomFraction = 0.3; // :
    this.differentPhraseGroupIndexDifferentBias = 0.25; // :
    this.defaultPrefixGlueProbability = 0.3;
    this.defaultPostfixGlueProbability = 0.3;
    this.prefixGlueProbabilityMultiplier = 1;
    this.postfixGlueProbabilityMultiplier = 1;
    this.prolongStaticLikelihoods = [2];
    this.prolongDynamicLikelihoods = [4];
    this.prolongDominantCadenceLikelihoods = [3];
    this.prolongTonicCadenceLikelihoods = [1];
    this.prolongHarmonyPartBiases = [20];
    this.prolongHarmonyPartRandomFractions = [50];
    this.overwriteGroupModulationIndices = false;
    this.groupModulation1Indices = [1];
    this.groupModulation2Indices = [1, 2];
    this.groupModulation3Indices = [1, 2, 3];
    this.groupModulation4Indices = [1, 2, 3, 4];
    this.groupModulation5Indices = [1, 2, 3, 4, 5];
    this.harmonyLengthLikelihoodMultipliers = [{}];
    this.harmonyLengthLikelihoodOverwriters = [{}];
    this.overwriteHarmonyLengthLikelihoods = [false];
    this.harmonyLengthLikelihoods = [{"4": 1}];


    // Domains
    this.tempoRange = [60, 140];

    this.melodyShapeAmpRanges = [[6, 12]];
    this.melodyShapeBiasRanges = [[68, 76]];

    this.melodyStartLevels = [[MelodyOffsetLevel.VERY_LOW, MelodyOffsetLevel.LOW, MelodyOffsetLevel.MIDDLE, MelodyOffsetLevel.HIGH, MelodyOffsetLevel.VERY_HIGH]];
    this.melodyEndLevels = [[MelodyOffsetLevel.VERY_LOW, MelodyOffsetLevel.LOW, MelodyOffsetLevel.MIDDLE, MelodyOffsetLevel.HIGH, MelodyOffsetLevel.VERY_HIGH]];

    this.bassShapeAmpRanges = [[2, 4]];
    this.bassShapeBiasRanges = [[35, 45]];

    this.bassStartLevels = [[MelodyOffsetLevel.VERY_LOW, MelodyOffsetLevel.LOW, MelodyOffsetLevel.MIDDLE, MelodyOffsetLevel.HIGH, MelodyOffsetLevel.VERY_HIGH]];
    this.bassEndLevels = [[MelodyOffsetLevel.VERY_LOW, MelodyOffsetLevel.LOW, MelodyOffsetLevel.MIDDLE, MelodyOffsetLevel.HIGH, MelodyOffsetLevel.VERY_HIGH]];

    this.majorDeceptiveRootRndInfos = [
        {data: 6, likelihood: 1, _constructorName: "IntDataSample"},
        {data: 5, likelihood: 4, _constructorName: "IntDataSample"},
        {data: 3, likelihood: 4, _constructorName: "IntDataSample"},
        {data: 2, likelihood: 1, _constructorName: "IntDataSample"},
        {data: 1, likelihood: 1, _constructorName: "IntDataSample"}
    ];

    this.minorDeceptiveRootRndInfos = [
        {data: 6, likelihood: 1, _constructorName: "IntDataSample"},
        {data: 5, likelihood: 4, _constructorName: "IntDataSample"},
        {data: 3, likelihood: 4, _constructorName: "IntDataSample"},
        {data: 2, likelihood: 1, _constructorName: "IntDataSample"},
        {data: 1, likelihood: 1, _constructorName: "IntDataSample"}
    ];

    this.electronicMelodyInstrInfos = [
        // {data: MidiProgram.CALLIOPE_LEAD, likelihood: 1},
//        {data: MidiProgram.CHIFF_LEAD, likelihood: 1},
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PIANO_1, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PIANO_2, likelihood: 1}),
//        {data: MidiProgram.FIFTHS_LEAD, likelihood: 1},
//        new MidiProgramDataSample({data: MidiProgram.SYNTH_BRASS_1, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.SYNTH_BRASS_2, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SAW_LEAD, likelihood: 1})
//        {data: MidiProgram.SQUARE_LEAD, likelihood: 1}
//        {data: MidiProgram.VOICE_LEAD, likelihood: 1}
//        {data: MidiProgram.CHARANG_LEAD, likelihood: 1}
    ];
    this.electronicInnerFastInstrInfos = [
//        {data: MidiProgram.CALLIOPE_LEAD, likelihood: 1},
//        {data: MidiProgram.CHIFF_LEAD, likelihood: 1},
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PIANO_1, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PIANO_2, likelihood: 1}),
//        {data: MidiProgram.SAW_LEAD, likelihood: 1},
//        {data: MidiProgram.SQUARE_LEAD, likelihood: 1}
//        {data: MidiProgram.VOICE_LEAD, likelihood: 1},
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_GRAND_PIANO, likelihood: 1})
//        {data: MidiProgram.ELECTRIC_JAZZ_GUITAR, likelihood: 1},
//        {data: MidiProgram.ELECTRIC_MUTED_GUITAR, likelihood: 1}
//        {data: MidiProgram.CHARANG_LEAD, likelihood: 1}
    ];
    this.electronicInnerSlowInstrInfos = [
//        {data: MidiProgram.BOWED_PAD, likelihood: 1},
        new MidiProgramDataSample({data: MidiProgram.HALO_PAD, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.METALLIC_PAD, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.NEW_AGE_PAD, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.POLYSYNTH_PAD, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SWEEP_PAD, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SYNTH_STRINGS_1, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SYNTH_STRINGS_2, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.WARM_PAD, likelihood: 1})
    ];

    this.electronicBassInstrInfos = [
//        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PIANO_1, likelihood: 1},
        new MidiProgramDataSample({data: MidiProgram.SYNTH_BASS_1, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SYNTH_BASS_1, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SYNTH_BASS_2, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SYNTH_BASS_2, likelihood: 1})
//        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PIANO_2, likelihood: 1}
    ];


    this.electricMelodyInstrInfos = [
        new MidiProgramDataSample({data: MidiProgram.DISTORTION_GUITAR, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_GRAND_PIANO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.PERCUSSIVE_ORGAN, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ROCK_ORGAN, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.SYNTH_BRASS_1, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.SYNTH_BRASS_2, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_JAZZ_GUITAR, likelihood: 1},
//        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_MUTED_GUITAR, likelihood: 1},
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PIANO_1, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PIANO_2, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.OVERDRIVEN_GUITAR, likelihood: 1})
//        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_CLEAN_GUITAR, likelihood: 1}
    ];
    this.electricInnerFastInstrInfos = [
        new MidiProgramDataSample({data: MidiProgram.DISTORTION_GUITAR, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_GRAND_PIANO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_JAZZ_GUITAR, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_MUTED_GUITAR, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PIANO_1, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PIANO_2, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.OVERDRIVEN_GUITAR, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.SYNTH_BRASS_1, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.SYNTH_BRASS_2, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SYNTH_CHOIR, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_CLEAN_GUITAR, likelihood: 1})
    ];
    this.electricInnerSlowInstrInfos = [
        new MidiProgramDataSample({data: MidiProgram.DISTORTION_GUITAR, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.OVERDRIVEN_GUITAR, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.SYNTH_BRASS_1, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.SYNTH_BRASS_2, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SYNTH_CHOIR, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.BOWED_PAD, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.HALO_PAD, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.METALLIC_PAD, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.NEW_AGE_PAD, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.POLYSYNTH_PAD, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SWEEP_PAD, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SYNTH_STRINGS_1, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SYNTH_STRINGS_2, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.WARM_PAD, likelihood: 1})
//        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_CLEAN_GUITAR, likelihood: 1}
    ];
    this.electricBassInstrInfos = [
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_GRAND_PIANO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_FINGER_BASS, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PICK_BASS, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SYNTH_BASS_1, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SYNTH_BASS_2, likelihood: 1})
//        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PIANO_1, likelihood: 1},
//        new MidiProgramDataSample({data: MidiProgram.ELECTRIC_PIANO_2, likelihood: 1}
    ];

    this.acousticMelodyInstrInfos = [
        new MidiProgramDataSample({data: MidiProgram.ACOUSTIC_GRAND_PIANO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.BRIGHT_ACOUSTIC_PIANO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ACOUSTIC_NYLON_GUITAR, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ACOUSTIC_STEEL_GUITAR, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ORCHESTRAL_HARP, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.CELLO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.FLUTE, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.PICCOLO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.PIZZICATO_STRINGS, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.RECORDER, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.VIOLIN, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.TRUMPET, likelihood: 1},
//        new MidiProgramDataSample({data: MidiProgram.MUTED_TRUMPET, likelihood: 1},
//        new MidiProgramDataSample({data: MidiProgram.SOPRANO_SAX, likelihood: 1},
        new MidiProgramDataSample({data: MidiProgram.OBOE, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.REED_ORGAN, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ROCK_ORGAN, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.TROMBONE, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.VIOLA, likelihood: 1})
    ];


    this.acousticInnerFastInstrInfos = [
        new MidiProgramDataSample({data: MidiProgram.ACOUSTIC_GRAND_PIANO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.BRIGHT_ACOUSTIC_PIANO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ACOUSTIC_NYLON_GUITAR, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ACOUSTIC_STEEL_GUITAR, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ORCHESTRAL_HARP, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.CELLO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.FLUTE, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.PICCOLO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.PIZZICATO_STRINGS, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.RECORDER, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.VIOLIN, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.TRUMPET, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.MUTED_TRUMPET, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.SOPRANO_SAX, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.OBOE, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.REED_ORGAN, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ROCK_ORGAN, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.TROMBONE, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.VIOLA, likelihood: 1})
    ];

    this.acousticInnerSlowInstrInfos = [
        new MidiProgramDataSample({data: MidiProgram.STRING_ENSEMBLE_1, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.STRING_ENSEMBLE_2, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.VOICE_OOHS, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.ALTO_SAX, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.BARITONE_SAX, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.CHOIR_AAHS, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.CHURCH_ORGAN, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.CLARINET, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.CLAVINET, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ENGLISH_HORN, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.MUTED_TRUMPET, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.OBOE, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.OCARINA, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.PAN_FLUTE, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.REED_ORGAN, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ROCK_ORGAN, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.SOPRANO_SAX, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.CELLO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.FLUTE, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.PICCOLO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.RECORDER, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.VIOLIN, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.VIOLA, likelihood: 1})
    ];

    this.acousticBassInstrInfos = [
        new MidiProgramDataSample({data: MidiProgram.ACOUSTIC_GRAND_PIANO, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.BRIGHT_ACOUSTIC_PIANO, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.CONTRABASS, likelihood: 1}),
//        new MidiProgramDataSample({data: MidiProgram.BASSOON, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.FRETLESS_BASS, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SLAP_BASS_1, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.SLAP_BASS_2, likelihood: 1}),
        // new MidiProgramDataSample({data: MidiProgram.TIMPANI, likelihood: 1}),
        new MidiProgramDataSample({data: MidiProgram.ACOUSTIC_BASS, likelihood: 1})
    ];


    this.bassDrumRndInfos = [
        new MidiDrumDataSample({data: MidiDrum.LOW_TOM_1, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.LOW_TOM_2, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.LOW_BONGO, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.LOW_CONGA, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.LOW_TIMBALE, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.BASS_DRUM_1, likelihood: 20}),
        new MidiDrumDataSample({data: MidiDrum.BASS_DRUM_2, likelihood: 20})
    ];

    this.snareRndInfos = [
        new MidiDrumDataSample({data: MidiDrum.SNARE_DRUM_1, likelihood: 30}),
//        new MidiDrumDataSample({data: MidiDrum.CRASH_CYMBAL_1, likelihood: 1}),
//        new MidiDrumDataSample({data: MidiDrum.CRASH_CYMBAL_2, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.HAND_CLAP, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.HIGH_TOM_1, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.HIGH_TOM_2, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.MID_TOM_1, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.MID_TOM_2, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.OPEN_HIGH_CONGA, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.SNARE_DRUM_2, likelihood: 30})
    ];

    this.crashRndInfos = [
        new MidiDrumDataSample({data: MidiDrum.CHINESE_CYMBAL, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.SPLASH_CYMBAL, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.CRASH_CYMBAL_1, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.CRASH_CYMBAL_2, likelihood: 1})
    ];

    this.rideRndInfos = [
        new MidiDrumDataSample({data: MidiDrum.MARACAS, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.OPEN_TRIANGLE, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.MUTE_TRIANGLE, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.CLAVES, likelihood: 1}),
        new MidiDrumDataSample({data: MidiDrum.RIDE_BELL, likelihood: 2}),
        new MidiDrumDataSample({data: MidiDrum.RIMSHOT, likelihood: 5}),
        new MidiDrumDataSample({data: MidiDrum.RIDE_CYMBAL_1, likelihood: 20}),
        new MidiDrumDataSample({data: MidiDrum.RIDE_CYMBAL_2, likelihood: 20}),
        new MidiDrumDataSample({data: MidiDrum.PEDAL_HIHAT, likelihood: 20}),
        new MidiDrumDataSample({data: MidiDrum.CLOSED_HIHAT, likelihood: 20}),
        new MidiDrumDataSample({data: MidiDrum.OPEN_HIHAT, likelihood: 20})
    ];

    this.fillIndexPatternRndInfos = [
        {data: [0], likelihood: 10, _constructorName: "IntListDataSample"},
        {data: [0, 1], likelihood: 1, _constructorName: "IntListDataSample"},
        {data: [0, 1, 0], likelihood: 1, _constructorName: "IntListDataSample"},
        {data: [0, 1, 1], likelihood: 1, _constructorName: "IntListDataSample"},
        {data: [0, 1, 2], likelihood: 1, _constructorName: "IntListDataSample"},
        {data: [0, 0, 1], likelihood: 1, _constructorName: "IntListDataSample"},
        {data: [0, 0, 0, 1], likelihood: 5, _constructorName: "IntListDataSample"},
        {data: [0, 0, 1, 0], likelihood: 3, _constructorName: "IntListDataSample"},
        {data: [0, 1, 0, 0], likelihood: 2, _constructorName: "IntListDataSample"},
        {data: [0, 0, 1, 1], likelihood: 1, _constructorName: "IntListDataSample"},
        {data: [0, 1, 1, 1], likelihood: 1, _constructorName: "IntListDataSample"},
        {data: [0, 1, 1, 0], likelihood: 1, _constructorName: "IntListDataSample"},
        {data: [0, 0, 1, 2], likelihood: 1, _constructorName: "IntListDataSample"},
        {data: [0, 1, 2, 0], likelihood: 1, _constructorName: "IntListDataSample"},
        {data: [0, 1, 2, 1], likelihood: 1, _constructorName: "IntListDataSample"}
    ];


    this.phraseGroupTypes = [
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_INCOMPLETE, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_TONIC_PROLONG, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE_PLAGIAL, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE_IMPERFECT, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_DECEPTIVE, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_TONICIZE, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_PHRASE_MODULATE, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample"},
        {data: SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample"}, // Better to use in a harmonic plan
        {data: SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE, likelihood: 0.125, _constructorName: "PhraseGroupTypeDataSample"},
        {data: SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_MODULATE_BACK, likelihood: 0.125, _constructorName: "PhraseGroupTypeDataSample"},
        {data: SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_MODULATE, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample"},
        {data: SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_MODULATE, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample"},
        {data: SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT, likelihood: 0.25, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT_SHORTEN, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_COMPLETE_DIFFERENT_SCALE_TYPE, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_COMPLETE, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_COMPLETE, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" }, // No shortening as in ant/cons
        {data: SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_INITIAL_PLUS_COMPLETE, likelihood: 0.5, _constructorName: "PhraseGroupTypeDataSample" }, // Start with dynamic harmony
        {data: SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_DOMINANT_PROLONG_CADENCE, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_COMPLETE, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_DOMINANT_PROLONG, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_DOMINANT_PROLONG_PLUS_COMPLETE, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_DOMINANT_PROLONG_PLUS_TONIC_CADENCE_PROLONG, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" }, //
        {data: SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLAGIAL_PLUS_COMPLETE, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_COMPLETE_PLAGIAL, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.DECEPTIVE_PLUS_DECEPTIVE, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_DECEPTIVE, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.COMPLETE_IMPERFECT_PLUS_DECEPTIVE, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_DECEPTIVE, likelihood: 0.1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.DECEPTIVE_PLUS_COMPLETE, likelihood: 0.5, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_COMPLETE_LENGTHEN_DOMINANT, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.DECEPTIVE_PLUS_COMPLETE_LENGTHEN_DOMINANT, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.DECEPTIVE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.COMPLETE_IMPERFECT_PLUS_COMPLETE_LENGTHEN_DOMINANT, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.COMPLETE_IMPERFECT_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_INITIAL_PLUS_COMPLETE_LENGTHEN_DOMINANT, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_INITIAL_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE_LENGTHEN_DOMINANT, likelihood: 0.025, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC, likelihood: 0.025, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE_LENGTHEN_DOMINANT, likelihood: 0.025, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC, likelihood: 0.025, _constructorName: "PhraseGroupTypeDataSample" }
    ];

    this.modulatePhraseGroupTypes = [
        {data: SimpleModuleGeneratorPhraseGroupType.PHRASE_MODULATE, likelihood: 0.5, _constructorName: "PhraseGroupTypeDataSample"},
        {data: SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_PHRASE_MODULATE, likelihood: 0.5, _constructorName: "PhraseGroupTypeDataSample"},
        {data: SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample"},
        {data: SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_MODULATE, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample"},
        {data: SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_MODULATE, likelihood: 0.5, _constructorName: "PhraseGroupTypeDataSample"}
    ];

    this.introGroupTypes = [
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_TONIC_PROLONG, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE_PLAGIAL, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE_IMPERFECT, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_DECEPTIVE, likelihood: 0.05, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_INCOMPLETE, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" }
    ];

    this.endGroupTypes = [
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_TONIC_PROLONG, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE_PLAGIAL, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE_IMPERFECT, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_INCOMPLETE, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_DECEPTIVE, likelihood: 0.25, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" }
    ];
    this.glueGroupTypes = [
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_SILENT, likelihood: 0.25, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_TONIC_PROLONG, likelihood: 3, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE_PLAGIAL, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE_IMPERFECT, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_DECEPTIVE, likelihood: 0.25, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_INCOMPLETE, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" },
        {data: SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE, likelihood: 1, _constructorName: "PhraseGroupTypeDataSample" }
    ];

    this.harmonyRythmDensityCurveFrequencyOverrides = [];
    this.harmonyRythmDensityCurveAmplitudeOverrides = [];

    this.harmonyRythmMeasureCountOverrides = [];
    this.harmonyRythmNoteCountOverrides = [];

    this.overwriteSongPartStructureRndInfos = false;
    this.songPartStructureRndInfos = [];

    this.overwriteSongPartStructure = false;
    this.songPartStructure = [new SongPartStructureInfo()];


    this.overwriteMelodyInstruments = false;
    this.melodyInstruments = [MidiProgram.ACOUSTIC_GRAND_PIANO, MidiProgram.ORCHESTRAL_HARP, MidiProgram.ACOUSTIC_STEEL_GUITAR];

    this.overwriteInner1Instruments = false;
    this.inner1Instruments = [MidiProgram.ACOUSTIC_GRAND_PIANO, MidiProgram.ORCHESTRAL_HARP, MidiProgram.ACOUSTIC_STEEL_GUITAR];

    this.overwriteInner2Instruments = false;
    this.inner2Instruments = [MidiProgram.ACOUSTIC_GRAND_PIANO, MidiProgram.ORCHESTRAL_HARP, MidiProgram.ACOUSTIC_STEEL_GUITAR];

    this.overwriteBassInstruments = false;
    this.bassInstruments = [MidiProgram.ACOUSTIC_GRAND_PIANO, MidiProgram.ACOUSTIC_BASS, MidiProgram.CONTRABASS];


    this.minorHarmonicPlans = [
        {data: [DynamicHarmonyModulationTarget.MEDIANT, DynamicHarmonyModulationTarget.MEDIANT, DynamicHarmonyModulationTarget.SUBDOMINANT], likelihood: 1, _constructorName: "HarmonicPlanDataSample"},
        {data: [DynamicHarmonyModulationTarget.DOMINANT, DynamicHarmonyModulationTarget.SUBDOMINANT], likelihood: 1, _constructorName: "HarmonicPlanDataSample"}
    ];
    this.majorHarmonicPlans = [
        {data: [DynamicHarmonyModulationTarget.DOMINANT, DynamicHarmonyModulationTarget.SUBDOMINANT], likelihood: 1, _constructorName: "HarmonicPlanDataSample"},
        {data: [DynamicHarmonyModulationTarget.SUPERTONIC, DynamicHarmonyModulationTarget.MEDIANT, DynamicHarmonyModulationTarget.DOMINANT], likelihood: 1, _constructorName: "HarmonicPlanDataSample"}
    ];

    this.renderAmountStrengthMap = {
        veryWeak: [0.02],
        weak: [0.15],
        medium: [0.4],
        strong: [0.7],
        veryStrong: [1.0],
        _constructorName: "RenderAmountStrengthMap"
    };


    this.majorModulationTargetInfos = [
        {data: DynamicHarmonyModulationTarget.MEDIANT, likelihood: 0.1, _constructorName: "ModulationTargetDataSample"},
//        {data: DynamicHarmonyModulationTarget.SUBDOMINANT, likelihood: 0.02},
        {data: DynamicHarmonyModulationTarget.SUBMEDIANT, likelihood: 0.1, _constructorName: "ModulationTargetDataSample"},
        {data: DynamicHarmonyModulationTarget.SUPERTONIC, likelihood: 0.2, _constructorName: "ModulationTargetDataSample"},
        {data: DynamicHarmonyModulationTarget.DOMINANT, likelihood: 1, _constructorName: "ModulationTargetDataSample"}
    ];
    this.minorModulationTargetInfos = [
        {data: DynamicHarmonyModulationTarget.MEDIANT, likelihood: 1, _constructorName: "ModulationTargetDataSample"},
//        {data: DynamicHarmonyModulationTarget.SUBDOMINANT, likelihood: 0.05},
        {data: DynamicHarmonyModulationTarget.SUBMEDIANT, likelihood: 0.1, _constructorName: "ModulationTargetDataSample"},
        {data: DynamicHarmonyModulationTarget.SUBTONIC, likelihood: 0.1, _constructorName: "ModulationTargetDataSample"},
        {data: DynamicHarmonyModulationTarget.DOMINANT, likelihood: 0.2, _constructorName: "ModulationTargetDataSample"}
    ];

    this.melodyMotifIndexPatternInfos = [
        {data: [[1], [1], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [2], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[0], [1], [2], [1]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[0], [1], [2], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[0], [1], [1], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[0], [1], [2], [3]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [1], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [2], [1]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [2], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [1], [3]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [2], [3]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [3], [1]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [3], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [1], [0], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [2], [0], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [3], [0], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [3], [0], [1]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [2], [0], [1]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [2], [1], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [2], [3], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [2], [2], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [2], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [1], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"}
    ];

    this.bassMotifIndexPatternInfos = [
        {data: [[1], [1], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [2], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[0], [1], [2], [1]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[0], [1], [2], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[0], [1], [1], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[0], [1], [2], [3]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [1], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [2], [1]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [2], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [1], [3]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [2], [3]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [3], [1]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [3], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [1], [0], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [2], [0], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [3], [0], [2]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [3], [0], [1]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [2], [0], [1]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [2], [1], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [2], [3], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [2], [2], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [2], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"},
        {data: [[1], [0], [1], [0]], likelihood: 1, _constructorName: "IntList2DDataSample"}
    ];

    this.harmonyElements = [];

    this.customMelodyCurveInfos = [];
    this.customBassCurveInfos = [];

    // Override phrase group types for verse, chorus and bridge
    this.songPartTypeOverrideInfos = [];

    this.overrideBassDrumNote = false;
    this.bassDrumNote = MidiDrum.BASS_DRUM_1;
    this.overrideSnareDrumNote = false;
    this.snareDrumNote = MidiDrum.SNARE_DRUM_1;
    this.overrideCrashDrumNote = false;
    this.crashDrumNote = MidiDrum.CRASH_CYMBAL_1;
    this.overrideRideDrumNotes = false;
    this.rideDrumNotes = [MidiDrum.CLOSED_HIHAT, MidiDrum.OPEN_HIHAT, MidiDrum.RIDE_CYMBAL_1];

    this.addBassDrumsOverride = [];
    this.addSnareDrumsOverride = [];
    this.addRideDrumsOverride = [];
    this.addCrashDrumsOverride = [];

    this.percussionFillMotifIndicesOverride = [];
    this.percussionFillProbabilities = [0.35];
    this.overrideFillNotes = false;
    this.fillNotes = [MidiDrum.SNARE_DRUM_1, MidiDrum.OPEN_HIHAT, MidiDrum.RIDE_CYMBAL_1, MidiDrum.BASS_DRUM_1];
    this.fillActivatedRenderAmountRange = [0.1, 0.4];

    this.useMaxHarmonyElementLength = true;
    this.useMaxCustomHarmonyElementLength = false;
    this.maxCustomHarmonyElementLength = 2;
    this.maxCustomHarmonyElementLengthUnit = PositionUnit.MEASURES;
    this.maxCustomHarmonyElementLengthUseExpression = false;

    this.melodyMotifRythmCountIncreasePerIndex = 0.4;
    this.melodyMotifRythmCountIncreaseOffsetRange = [0.5, 1.0];
    this.bassMotifRythmCountIncreasePerIndex = 0.4;
    this.bassMotifRythmCountIncreaseOffsetRange = [0.25, 0.75];

    this.melodyMotifRythmNoteCountOverrides = [];
    this.bassMotifRythmNoteCountOverrides = [];

    this.melodyMotifZone1Probabilities = [0.5];
    this.melodyMotifZone1TripletLikelihoods = [0.5];
    this.melodyMotifZone1DotSecondLikelihoods = [0.5];
    this.melodyMotifZone1DotFirstLikelihoods = [2];
    this.melodyMotifZone1DotNormalDotLikelihoods = [0.5];
    this.melodyMotifZone1NormalDotDotLikelihoods = [0.5];
    this.melodyMotifZone1DotDotNormalLikelihoods = [0.5];
    this.melodyMotifZone1StartPosRanges = [[0, 0]];
    this.melodyMotifZone1EndPosRanges = [[0.75, 0.75]];
    this.melodyMotifZone1StartEnds = [];

    this.bassMotifZone1Probabilities = [0.5];
    this.bassMotifZone1TripletLikelihoods = [0.01];
    this.bassMotifZone1DotSecondLikelihoods = [0.5];
    this.bassMotifZone1DotFirstLikelihoods = [2];
    this.bassMotifZone1DotNormalDotLikelihoods = [0.5];
    this.bassMotifZone1NormalDotDotLikelihoods = [0.5];
    this.bassMotifZone1DotDotNormalLikelihoods = [0.5];
    this.bassMotifZone1StartPosRanges = [[0, 0]];
    this.bassMotifZone1EndPosRanges = [[0.75, 0.75]];
    this.bassMotifZone1StartEnds = [];

    this.extraMelodyRenderElements = [];
    this.extraInner1RenderElements = [];
    this.extraInner2RenderElements = [];
    this.extraBassRenderElements = [];

    // Counts
    this.melodyShapeCount = 6;
    this.bassShapeCount = 6;
    this.harmonyRythmCount = 6;
    this.harmonyCount = 6;
    this.harmonyExtraCount = 6;
    this.suspendTypeCount = 6;
    this.channelDistributionCount = 6; // For each voice line
    this.motifDistributionCount = 6; // For each voice line
    this.renderAmountCount = 6;
    this.tempoCount = 6;
    this.tempoChangeCount = 6;
    this.effectChangeCount = 6;


    // General export stuff
    this.songName = "song";

    // Midi render stuff
    this.instrumentVolumeHints = {};
//    this.instrumentVolumeHints[MidiProgram.SYNTH_STRINGS_1] = 90 / 127.0;
//    this.instrumentVolumeHints[MidiProgram.PAN_FLUTE] = 90 / 127.0;
//    this.instrumentVolumeHints[MidiProgram.CHURCH_ORGAN] = 110 / 127.0;
//    this.instrumentVolumeHints[MidiProgram.METALLIC_PAD] = 90 / 127.0;
    this.applyInstrumentVolumeHintsToMelody = false;
    this.applyInstrumentVolumeHintsToInner1 = true;
    this.applyInstrumentVolumeHintsToInner1 = true;
    this.applyInstrumentVolumeHintsToBass = false;

    this.melodyVolumeMultipliers = [1];
    this.inner1VolumeMultipliers = [1];
    this.inner2VolumeMultipliers = [1];
    this.bassVolumeMultipliers = [1];
    this.percussionVolumeMultiplier = 1;

    this.melodyPans = [20 / 127.0]; // The pans are not used yet...
    this.bassPans = [110 / 127.0];
    this.inner1Pans = [80 / 127.0];
    this.inner2Pans = [60 / 127.0];
    this.percussionPan = 64 / 127.0;

    this.mergeChannels = false;

    this.exportChordsToNewChannel = false;

    this.exportVolume = true;
    this.exportEffects = true;
    this.melodyReverbSends = [1];
    this.melodyChorusSends = [0.3];
    this.bassReverbSends = [0.1];
    this.bassChorusSends = [0.1];
    this.inner1ReverbSends = [0.1];
    this.inner1ChorusSends = [0.1];
    this.inner2ReverbSends = [0.1];
    this.inner2ChorusSends = [0.1];
    this.percussionReverbSend = 0;
    this.percussionChorusSend = 0;

    // Wav render stuff
    this.soundFontType = SoundFontType.STANDARD_LIGHT;
    this.normalizeRenderedResult = false;
    this.compressRenderedResult = false;

    this._constructorName = "GenInfo";
}

GenInfo.prototype.phraseGroupTypes_allowedTypes = {"PhraseGroupTypeDataSample": 1};
GenInfo.prototype.modulatePhraseGroupTypes_allowedTypes = {"PhraseGroupTypeDataSample": 1};
GenInfo.prototype.introGroupTypes_allowedTypes = {"PhraseGroupTypeDataSample": 1};
GenInfo.prototype.endGroupTypes_allowedTypes = {"PhraseGroupTypeDataSample": 1};
GenInfo.prototype.glueGroupTypes_allowedTypes = {"PhraseGroupTypeDataSample": 1};
GenInfo.prototype.majorDeceptiveRootRndInfos_allowedTypes = {"IntDataSample": 1};
GenInfo.prototype.minorDeceptiveRootRndInfos_allowedTypes = {"IntDataSample": 1};
GenInfo.prototype.electronicMelodyInstrInfos_allowedTypes = {"MidiProgramDataSample": 1};
GenInfo.prototype.electronicInnerFastInstrInfos_allowedTypes = {"MidiProgramDataSample": 1};
GenInfo.prototype.electronicInnerSlowInstrInfos_allowedTypes = {"MidiProgramDataSample": 1};
GenInfo.prototype.electronicBassInstrInfos_allowedTypes = {"MidiProgramDataSample": 1};
GenInfo.prototype.electricMelodyInstrInfos_allowedTypes = {"MidiProgramDataSample": 1};
GenInfo.prototype.electricInnerFastInstrInfos_allowedTypes = {"MidiProgramDataSample": 1};
GenInfo.prototype.electricInnerSlowInstrInfos_allowedTypes = {"MidiProgramDataSample": 1};
GenInfo.prototype.electricBassInstrInfos_allowedTypes = {"MidiProgramDataSample": 1};
GenInfo.prototype.acousticMelodyInstrInfos_allowedTypes = {"MidiProgramDataSample": 1};
GenInfo.prototype.acousticInnerFastInstrInfos_allowedTypes = {"MidiProgramDataSample": 1};
GenInfo.prototype.acousticInnerSlowInstrInfos_allowedTypes = {"MidiProgramDataSample": 1};
GenInfo.prototype.acousticBassInstrInfos_allowedTypes = {"MidiProgramDataSample": 1};
GenInfo.prototype.bassDrumRndInfos_allowedTypes = {"MidiDrumDataSample": 1};
GenInfo.prototype.snareRndInfos_allowedTypes = {"MidiDrumDataSample": 1};
GenInfo.prototype.crashRndInfos_allowedTypes = {"MidiDrumDataSample": 1};
GenInfo.prototype.rideRndInfos_allowedTypes = {"MidiDrumDataSample": 1};
GenInfo.prototype.fillIndexPatternRndInfos_allowedTypes = {"IntListDataSample": 1};
GenInfo.prototype.songPartStructure_allowedTypes = {"SongPartStructureInfo": 1};
GenInfo.prototype.songPartStructureRndInfos_allowedTypes = {"SongPartStructureInfoDataSample": 1};
GenInfo.prototype.majorHarmonicPlans_allowedTypes = {"HarmonicPlanDataSample": 1};
GenInfo.prototype.minorHarmonicPlans_allowedTypes = {"HarmonicPlanDataSample": 1};
GenInfo.prototype.majorModulationTargetInfos_allowedTypes = {"ModulationTargetDataSample": 1};
GenInfo.prototype.minorModulationTargetInfos_allowedTypes = {"ModulationTargetDataSample": 1};
GenInfo.prototype.melodyMotifIndexPatternInfos_allowedTypes = {"IntList2DDataSample": 1};
GenInfo.prototype.bassMotifIndexPatternInfos_allowedTypes = {"IntList2DDataSample": 1};
GenInfo.prototype.songPartTypeOverrideInfos_allowedTypes = {"SongPartTypeOverrideInfo": 1};
GenInfo.prototype.harmonyElements_allowedTypes = {"SimpleSequenceHarmonyElement": 1, "PhraseHarmonyElement": 1};
GenInfo.prototype.customMelodyCurveInfos_allowedTypes = {"LinearInterpolatedCustomVoiceLineCurveInfo": 1};
GenInfo.prototype.customBassCurveInfos_allowedTypes = {"LinearInterpolatedCustomVoiceLineCurveInfo": 1};


GenInfo.prototype.randomize = function(rnd) {
    this.globalSeed = rnd.genrand_int31();

    // Song structure seeds
    this.tempoSeed = rnd.genrand_int31();
    this.scaleSeed = rnd.genrand_int31();
    this.tsSeed = rnd.genrand_int31();
    this.introSeed = rnd.genrand_int31();
    this.endSeed = rnd.genrand_int31();
    this.renderAmountSeed = rnd.genrand_int31();
    this.modulationSeed = rnd.genrand_int31();
    this.tonicizationSeed = rnd.genrand_int31();
    this.songStructureSeed = rnd.genrand_int31();
    this.glueSeed = rnd.genrand_int31();
    this.phraseGroupSeed = rnd.genrand_int31();
    this.phraseGroupSimilaritySeed = rnd.genrand_int31();
    this.groupSimilaritySeed = rnd.genrand_int31();
    this.groupDifferenceSeed = rnd.genrand_int31();


    // Indices seeds
    this.melodyShapeIndicesSeed = rnd.genrand_int31();
    this.bassShapeIndicesSeed = rnd.genrand_int31();
    this.harmonyIndicesSeed = rnd.genrand_int31();
    this.harmonyRythmIndicesSeed = rnd.genrand_int31();
    this.suspendIndicesSeed = rnd.genrand_int31();
    this.melodyChannelDistributionIndicesSeed = rnd.genrand_int31();
    this.inner1ChannelDistributionIndicesSeed = rnd.genrand_int31();
    this.inner2ChannelDistributionIndicesSeed = rnd.genrand_int31();
    this.bassChannelDistributionIndicesSeed = rnd.genrand_int31();
    this.melodyMotifDistributionIndicesSeed = rnd.genrand_int31();
    this.inner1MotifDistributionIndicesSeed = rnd.genrand_int31();
    this.inner2MotifDistributionIndicesSeed = rnd.genrand_int31();
    this.bassMotifDistributionIndicesSeed = rnd.genrand_int31();
    this.percussionMotifDistributionIndicesSeed = rnd.genrand_int31();
    this.percussionFillMotifDistributionIndicesSeed = rnd.genrand_int31();
    this.harmonyExtraIndicesSeed = rnd.genrand_int31();
    this.renderAmountIndicesSeed = rnd.genrand_int31();
    this.tempoIndicesSeed = rnd.genrand_int31();
    this.sequentialTempoChangeIndicesSeed = rnd.genrand_int31();
    this.parallelTempoChangeIndicesSeed = rnd.genrand_int31();
    this.sequentialMelodyEffectChangeIndicesSeed = rnd.genrand_int31();
    this.sequentialInner1EffectChangeIndicesSeed = rnd.genrand_int31();
    this.sequentialInner2EffectChangeIndicesSeed = rnd.genrand_int31();
    this.sequentialBassEffectChangeIndicesSeed = rnd.genrand_int31();
    this.sequentialPercussionEffectChangeIndicesSeed = rnd.genrand_int31();


    // All else seeds
    this.instrumentTypeSeed = rnd.genrand_int31();
    this.melodyInstrumentSeed = rnd.genrand_int31();
    this.inner1InstrumentSeed = rnd.genrand_int31();
    this.inner2InstrumentSeed = rnd.genrand_int31();
    this.bassInstrumentSeed = rnd.genrand_int31();
    this.melodyMotifSeed = rnd.genrand_int31();
    this.melodyMotifRythmSeed = rnd.genrand_int31();
    this.melodyMotifEmbellishConnectSeed = rnd.genrand_int31();
    this.bassMotifSeed = rnd.genrand_int31();
    this.bassMotifRythmSeed = rnd.genrand_int31();
    this.bassMotifEmbellishConnectSeed = rnd.genrand_int31();
    this.harmonyMotifSeed = rnd.genrand_int31();
    this.harmonyMotifRythmSeed = rnd.genrand_int31();
    this.harmonyMotifEmbellishConnectSeed = rnd.genrand_int31();
    this.percussionMotifSeed = rnd.genrand_int31();
    this.percussionFillMotifSeed = rnd.genrand_int31();
    this.percussionInstrumentSeed = rnd.genrand_int31();
    this.percussionFillInstrumentSeed = rnd.genrand_int31();
    this.percussionMotifRythmSeed = rnd.genrand_int31();
    this.percussionFillMotifRythmSeed = rnd.genrand_int31();
    this.melodyShapeSeed = rnd.genrand_int31();
    this.bassShapeSeed = rnd.genrand_int31();
    this.harmonyRythmSeed = rnd.genrand_int31();
    this.melodyMotifDistributionSeed = rnd.genrand_int31();
    this.inner1MotifDistributionSeed = rnd.genrand_int31();
    this.inner2MotifDistributionSeed = rnd.genrand_int31();
    this.bassMotifDistributionSeed = rnd.genrand_int31();
    this.percussionMotifDistributionSeed = rnd.genrand_int31();
    this.percussionFillMotifDistributionSeed = rnd.genrand_int31();
    this.melodyHarmonyPunctationSeed = rnd.genrand_int31();
    this.innerHarmonyPunctationSeed = rnd.genrand_int31();
    this.harmonySeed = rnd.genrand_int31();
    this.channelDistributionSeed = rnd.genrand_int31();
    this.tempoChangeSeed = rnd.genrand_int31();
    this.effectChangeSeed = rnd.genrand_int31();
    this.suspendSeed = rnd.genrand_int31();

};


GenInfo.prototype.set = function(inputGenInfo) {
    for (var prop in inputGenInfo) {
        var old = this[prop];
        if (typeof(old) == 'undefined') {
            logit("Tried to set a value in genInfo that did not exist. Probably a bug to look for ;). Property name: '" + prop + "'");
        } else {
            this[prop] = inputGenInfo[prop];
        }
//        logit("setting " + prop + " to " + inputGenInfo[prop]);
    }
//    for (var prop in this) {
//        var test = inputGenInfo[prop];
//        if (typeof(test) === 'undefined') {
//            console.log("Not setting prop: " + prop);
//        }
//    }
};
