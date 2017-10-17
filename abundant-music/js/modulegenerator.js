//
//function ModuleGenerator(options) {
//    this.harmonySeed = getValueOrDefault(options, "harmonySeed", 123);
//}
//
//ModuleGenerator.prototype.generateModule = function() {
//    var result = new GenMusicModule();
//    return result;
//};
//
//
//function SimpleModuleGeneratorData() {
//
//    // The module
//    this.module = new GenMusicModule();
//
//    // Create a single section with voice lines and render lines
//
//    // Add all the harmonic rythms
//
//
//    // Stuff that can be indexed
//    this.harmonyTypes = [new ConstantHarmonicRythm([])]; // All harmonies must have a unique ID
//    this.phraseTypes = [SimpleModuleGeneratorPhraseType.SIMPLE_COMPLETE];
//    this.scaleTypes = [ScaleType.MAJOR];
//    this.transpositionTypes = [0];
//    this.modulationTypes = [SimpleModuleGeneratorModulationType.NONE];
//    this.tonicizationTypes = [SimpleModuleGeneratorTonicizationType.NONE];
//    this.mixtureTypes = [SimpleModuleGeneratorMixtureType.NONE];
//
//    this.melodyHeightAmounts = [0, 7];
//    this.melodyDistributions = [
//    [SimpleModuleGeneratorVoiceLineType.MELODY], //
//    [SimpleModuleGeneratorVoiceLineType.MELODY, SimpleModuleGeneratorVoiceLineType.INNER_1] //
//    ];
//    this.melodyDoublings = [SimpleModuleGeneratorDoublingType.NONE]; //
//    this.melodyMotifDistributions = [
//    {
//        harmonyCountZones: [
//        {
//            harmonyCountDividers: [2, 4],
//            motifIndices: [0, 1, 0, 2], // What they point out depends on the slowness
//            endMotifIndices: [3],
//            motifConnects: [SimpleModuleGeneratorMotifConnectType.CONNECT, 0, 1, 0],
//            endMotifConnects: [0]
//        }]
//    }
//    ];
//    this.melodyInstruments = [
//    MidiProgram.ACOUSTIC_GRAND_PIANO
//    ];
//    this.melodyOrnamentations = [SimpleModuleGeneratorMelodyOrnamentationType.NONE];
//    this.melodyHarmonizations = [SimpleModuleGeneratorMelodyHarmonizationType.NONE];
//    this.melodySlowMotifs = []; // Actual melody motifs
//    this.melodySlowMotifsWithConnection = [];
//    this.melodyNormalMotifs = [];
//    this.melodyNormalMotifsWithConnection = [];
//    this.melodyFastMotifs = [];
//    this.melodyFastMotifsWithConnection = [];
//
//    this.harmonyStyles = [SimpleModuleGeneratorHarmonyStyleType.BLOCK_CHORDS_SIMPLE];
//    this.harmonyMotifDistributions = [
//    {
//        harmonyCountDividers: [4],
//        rythmIndices: [0], // What they point out depends on the slowness of harmony instrument
//        endRythmIndices: [1]
//    }
//    ];
//    this.harmonyInstruments = [
//    MidiProgram.ACOUSTIC_NYLON_GUITAR
//    ];
//    this.harmonySlowRythms = [];
//    this.harmonyNormalRythms = [];
//    this.harmonyFastRythms = [];
//
//    this.bassMotifDistributions = [
//    {
//        harmonyCountZones: [
//        {
//            harmonyCountDividers: [2, 4],
//            motifIndices: [0, 1, 0, 2], // What they point out depends on the slowness
//            endMotifIndices: [3],
//            motifConnects: [0],
//            endMotifConnects: [0]
//        }]
//    }
//    ];
//    this.bassDoublings = [SimpleModuleGeneratorDoublingType.NONE];
//    this.bassInstruments = [
//    MidiProgram.ACOUSTIC_GRAND_PIANO
//    ];
//    this.bassOrnamentations = [SimpleModuleGeneratorMelodyOrnamentationType.NONE];
//    this.bassHarmonizations = [SimpleModuleGeneratorMelodyHarmonizationType.NONE];
//    this.bassSlowMotifs = []; // Actual bass motifs
//    this.bassSlowMotifsWithConnection = [];
//    this.bassNormalMotifs = [];
//    this.bassNormalMotifsWithConnection = [];
//    this.bassFastMotifs = [];
//    this.bassFastMotifsWithConnection = [];
//
//    this.percussionMotifDistributions = [
//    {
//        defaultZoneIndex: 0,
//        harmonyCountZones: [
//        {
//            harmonyCountDividers: [2, 4],
//            motifIndices: [0],
//            endMotifIndices: [3],
//            motifFills: [0],
//            endMotifFills: [1]
//        }]
//    }
//    ];
//    this.percussionMotifs = [];
//    this.percussionFillMotifs = [];
//}
//
//
//
//function SimpleModuleGenerator(options) {
//    ModuleGenerator.call(this, options);
//}
//
//SimpleModuleGenerator.prototype = new ModuleGenerator();
//
//
//
//
//SimpleModuleGenerator.prototype.generateHarmony = function(options, module, rnd) {
//    };
//
//
//
//
//SimpleModuleGenerator.prototype.generateModule = function() {
//    // Generate all the stuff in SimpleModuleGeneratorData
//    var genData = new SimpleModuleGeneratorData();
//
//
//    // Generate SimpleModuleGeneratorSectionInfos here...
//
//    var sectionInfos = [new SimpleModuleGeneratorSectionInfo()];
//
//
//    return genData.module;
//};
//
