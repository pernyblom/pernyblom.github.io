
function HarmonyElement() {
    this.id = "";
    this.modifiers = [];
    this._constructorName = "HarmonyElement";
}

function HarmonyReferenceHarmonyElement() {
    HarmonyElement.call(this);
    this.harmony = "";
    this._constructorName = "HarmonyReferenceHarmonyElement";
}
HarmonyReferenceHarmonyElement.prototype = new HarmonyElement();


function SwitchHarmonyElement() {
    HarmonyElement.call(this);
    this.index = 0;
    this.indexedElements = [];
    this._constructorName = "SwitchHarmonyElement";
}
SwitchHarmonyElement.prototype = new HarmonyElement();


function ConstantHarmonyElement() {
    HarmonyElement.call(this);

    this.length = 1.0;
    this.lengthUnit = PositionUnit.MEASURES;
    this.strength = 1.0;
    this.startBeatStrength = 1.0;

    this.scaleType = ScaleType.MAJOR;
    this.baseNote = 60; // Scale base absolute note

    this.chordType = ChordType.TRIAD;
    this.chordRoot = 0; // Scale index
    this.chordInversions = 0;

    this.scale = [0, 2, 4, 5, 7, 9, 11]; // Custom scale
    this.chord = [0, 2, 4]; // Custom chord scale indices when in root
    // position
    this.scaleMode = 0;

    // Time signature
    this.tsNumerator = 4;
    this.tsDenominator = 4;

    // Alterations
    this.alterations = [];

    // Voice line planner constraints
    this.voiceLineConstraints = [];

    this.sectionModifiers = [];

    this.startsPhrase = false;

    this.note = "";

    this._constructorName = "ConstantHarmonyElement";
}

ConstantHarmonyElement.prototype = new HarmonyElement();



var HarmonyLengthMode = {
    COUNT_AND_LENGTH_PATTERN: 0, // The count determines the number of elements. The length pattern is used for determining the length of the separate elements
    COUNT_AND_RYTHM: 1, // The count determines number of elements. The rythm determines the relative lengths. Total length is also used to scale the rythm
    RYTHM_ONLY: 2, // A rythm determines relative lenghts. Total length is used to scale it

    toString: function(type) {
        switch (type) {
            case HarmonyLengthMode.COUNT_AND_LENGTH_PATTERN:
                return "Count and length pattern";
            case HarmonyLengthMode.COUNT_AND_RYTHM:
                return "Count and rythm";
            case HarmonyLengthMode.RYTHM_ONLY:
                return "Rythm only";
        }
        return "Unknown length mode " + type;
    }
};
addPossibleValuesFunction(HarmonyLengthMode, HarmonyLengthMode.COUNT_AND_LENGTH_PATTERN, HarmonyLengthMode.RYTHM_ONLY);


function SequenceHarmonyElement() {
    HarmonyElement.call(this);
    this.harmonyLengthMode = HarmonyLengthMode.RYTHM_ONLY;

    // Each lengths' element becomes a harmony element
    this.count = 1;
    this.lengthPattern = [1.0];
    this.startLengthPattern = [];
    this.endLengthPattern = [];
    this.lengthPatternUnit = PositionUnit.MEASURES;

    this.totalLength = 1.0; // Used when a lengthRythm is used
    this.totalLengthUnit = PositionUnit.MEASURES;
    this.setTotalLengthExternally = false;

    this.beatStrengths = [1, 0.8, 0.9, 0.6, 0.3, 0.4, 0.2];

    // For rythm-based harmony elements
    this.lengthRythm = "";
    this.rythmTsNumerator = 4;
    this.rythmTsDenominator = 4;
    this.setTsNumeratorExternally = false;

    this.useMaxElementLength = false;
    this.maxElementLength = 1;
    this.maxElementLengthUnit = PositionUnit.MEASURES;

    this.lengthRepeats = 0; // Repeats the lengths

    this.usePositionSnap = false;
    this.positionSnapPattern = [1.0];
    this.positionSnapUnit = PositionUnit.BEATS;
    this.positionSnapMetrics = SnapMetrics.ROUND;

    this.phraseStructureCounts = [];

    this.tsNumerators = [4];
    this.startTsNumerators = [];
    this.endTsNumerators = [];

    this.tsDenominators = [4];
    this.startTsDenominators = [];
    this.endTsDenominators = [];

    this._constructorName = "SequenceHarmonyElement";
}
SequenceHarmonyElement.prototype = new HarmonyElement();

function SimpleSequenceHarmonyElement() {
    SequenceHarmonyElement.call(this);

    this.scaleBaseNotes = [60];
    this.scaleBaseNoteIndices = [0];
    this.startScaleBaseNoteIndices = [];
    this.endScaleBaseNoteIndices = [];

    this.scaleTypes = [ScaleType.MAJOR];
    this.scaleTypeIndices = [0];
    this.startScaleTypeIndices = [];
    this.endScaleTypeIndices = [];

    this.scaleModes = [0];
    this.startScaleModes = [];
    this.endScaleModes = [];

    this.chordRoots = [0];
    this.startChordRoots = [];
    this.endChordRoots = [];

    this.chordInversions = [0];
    this.startChordInversions = [];
    this.endChordInversions = [];

    this.chordTypes = [ChordType.TRIAD];
    this.chordTypeIndices = [0];
    this.startChordTypeIndices = [];
    this.endChordTypeIndices = [];

    this.customScales = [[0, 2, 4, 5, 7, 9, 11]];
    this.customScaleIndices = [0];
    this.startCustomScaleIndices = [];
    this.endCustomScaleIndices = [];

    this.customChords = [[0, 2, 4]];
    this.customChordIndices = [0];
    this.startCustomChordIndices = [];
    this.endCustomChordIndices = [];

    this.voiceLineConstraints = [];
    this.voiceLineConstraintIndices = []; // 2d array
    this.startVoiceLineConstraintIndices = []; // 2d array
    this.endVoiceLineConstraintIndices = []; // 2d array


    this._constructorName = "SimpleSequenceHarmonyElement";
}

SimpleSequenceHarmonyElement.prototype = new SequenceHarmonyElement();

SimpleSequenceHarmonyElement.prototype.voiceLineConstraints_allowedTypes = {"VoiceChordNotesVoiceLinePlannerConstraint": 1};


function PlannedHarmonyElement() {
    SequenceHarmonyElement.call(this);

    this.scaleBaseNote = 60;
    this.scaleType = ScaleType.MAJOR;

    this.seed = 12345;

    this._constructorName = "PlannedHarmonyElement";
}

PlannedHarmonyElement.prototype = new SequenceHarmonyElement();


function StaticSequenceHarmonyElement() {
    PlannedHarmonyElement.call(this);

    this.baseRoot = 0;
    this.baseToBaseLikelihood = 0.01;
    this.baseToNeighbourLikelihood = 1;
    this.baseToPassingLikelihood = 1;
    this.baseToAuxiliaryLikelihood = 1;
    this.auxiliaryToAuxiliaryLikelihood = 0.01;
    this.auxiliaryToBaseLikelihood = 1;
    this.auxiliaryToNeighbourLikelihood = 1;
    this.auxiliaryToPassingLikelihood = 1;
    this.auxiliaryChordRoots = [3, 4];
    this.auxiliaryChordRootLikelihoods = [1, 1];
    this.fromBasePassingChordRoots = [0, 1, 2, 3, 4, 5, 6];
    this.fromBasePassingChordRootLikelihoods = [1];
    this.fromBasePassingIncrements = [-2, 1, 1, 2];
    this.fromBasePassingIncrementLikelihoods = [0.5, 1, 1, 0.5];
    this.fromBasePassingInversions = [0, 1, 2];
    this.fromBasePassingInversionLikelihoods = [0.5, 1, 0.5];
    this.fromBaseNeighbourChordRoots = [0, 1, 2, 3, 4, 5, 6];
    this.fromBaseNeighbourChordRootLikelihoods = [1];
    this.fromAuxiliaryPassingChordRoots = [0, 1, 2, 3, 4, 5, 6];
    this.fromAuxiliaryPassingChordRootLikelihoods = [1];
    this.fromAuxiliaryPassingIncrements = [-2, -1, 1, 2];
    this.fromAuxiliaryPassingIncrementLikelihoods = [0.5, 1, 1, 0.5];
    this.fromAuxiliaryNeighbourChordRoots = [0, 1, 2, 3, 4, 5, 6];
    this.fromAuxiliaryNeighbourChordRootLikelihoods = [1];
    this.canEndWithBase = true;
    this.canEndWithAuxiliary = false;
    this.possibleAuxiliaryEndRoots = [3, 4];
    this._constructorName = "StaticSequenceHarmonyElement";
}


StaticSequenceHarmonyElement.prototype = new PlannedHarmonyElement();




function DynamicSequenceHarmonyElement() {
    PlannedHarmonyElement.call(this);

    this.modulate = false;
    this.majorModulationTarget = DynamicHarmonyModulationTarget.DOMINANT;
    this.minorModulationTarget = DynamicHarmonyModulationTarget.MEDIANT;
    this.majorStartRoots = [0];
    this.majorStartRootLikelihoods = [1];

    this.majorProgressionRoots = [[0, 1, 2, 3, 4, 5]];
    this.majorProgressionRootLikelihoods = [[1]];

    this.minorProgressionRoots = [[0, 2, 3, 4, 5, 6]];
    this.minorProgressionRootLikelihoods = [[1]];

    this.majorProgressionMovements = [[-4, -2, 1]];
    this.startMajorProgressionMovements = [];
    this.endMajorProgressionMovements = [];
    this.majorProgressionMovementLikelihoods = [[1]];
    this.startMajorProgressionMovementLikelihoods = [];
    this.endMajorProgressionMovementLikelihoods = [];

    this.minorProgressionMovements = [[-4, -2, 1]];
    this.startMinorProgressionMovements = [];
    this.endMinorProgressionMovements = [];
    this.minorProgressionMovementLikelihoods = [[1]];
    this.startMinorProgressionMovementLikelihoods = [];
    this.endMinorProgressionMovementLikelihoods = [];

    this.majorPossibleEndRoots = [1, 3];
    this.minorPossibleEndRoots = [3];
    this.majorModulationPossibleEndRoots = [1, 3];
    this.minorModulationPossibleEndRoots = [3];

    this.passingRoots = [0, 1, 2, 3, 4, 5, 6];
    this.passingRootLikelihoods = [1];

    var options = null;
    this.passingInversions = getValueOrDefault(options,
        "passingInversions", [1, 2]);
    this.passingInversionLikelihoods = getValueOrDefault(options,
        "passingInversionLikelihoods", [1, 0.5]);
    this.passingIncrements = getValueOrDefault(options,
        "passingIncrements", [-2, -1, 1, 2]);
    this.passingIncrementLikelihoods = getValueOrDefault(options,
        "passingIncrementLikelihoods", [0.5, 1, 1, 0.5]);
    this.neighbourRoots = getValueOrDefault(options,
        "neighbourRoots", [0, 1, 2, 3, 4, 5, 6]);
    this.neighbourRootLikelihoods = getValueOrDefault(options,
        "neighbourRootLikelihoods", [1]);
    this.neighbourInversions = getValueOrDefault(options,
        "neighbourInversions", [1, 2]);
    this.neighbourInversionLikelihoods = getValueOrDefault(options,
        "neighbourInversionLikelihoods", [1, 0.5]);
    this.expansionRoots = getValueOrDefault(options,
        "expansionRoots", [0, 1, 2, 3, 4, 5, 6]);
    this.expansionRootLikelihoods = getValueOrDefault(options,
        "expansionRootLikelihoods", [1]);
    this.expansionInversions = getValueOrDefault(options,
        "expansionInversions", [1]);
    this.expansionInversionLikelihoods = getValueOrDefault(options,
        "expansionInversionLikelihoods", [1]);

    this.rootProgressionLikelihood = getValueOrDefault(options,
        "rootProgressionLikelihood", 1);
    this.repeatRootLikelihood = getValueOrDefault(options,
        "repeatRootLikelihood", 0);
    this.passingLikelihood = getValueOrDefault(options,
        "passingLikelihood", 1);
    this.neighbourLikelihood = getValueOrDefault(options,
        "neighbourLikelihood", 1);
    this.expansionLikelihood = getValueOrDefault(options,
        "expansionLikelihood", 1);
    this.modulateLikelihoods = [1];
    this.startModulateLikelihoods = [0.01];
    this.endModulateLikelihoods = [0.01];


    this.majorAppliedChords = getValueOrDefault(options,
        "majorAppliedChords", [AppliedChordType.V, AppliedChordType.V7]);
    this.majorAppliedChordLikelihoods = getValueOrDefault(options,
        "majorAppliedChordLikelihoods", [1]);
    this.minorAppliedChords = getValueOrDefault(options,
        "minorAppliedChords", [AppliedChordType.V, AppliedChordType.V7]);
    this.minorAppliedChordLikelihoods = getValueOrDefault(options,
        "minorAppliedChordLikelihoods", [1]);

    this.addAllMovements = getValueOrDefault(options,
        "addAllMovements", true); // Adding all possible roots
    this.addAllStarts = getValueOrDefault(options,
        "addAllStarts", true);

    this._constructorName = "DynamicSequenceHarmonyElement";
}


DynamicSequenceHarmonyElement.prototype = new PlannedHarmonyElement();
