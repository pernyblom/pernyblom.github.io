
var PredefinedPercussionMotifType = {
    FILL_DOTTED_QUARTER_1: 0,
    FILL_DOTTED_QUARTER_2: 1,
    FILL_DOTTED_QUARTER_3: 2,
    FILL_DOTTED_QUARTER_4: 3,

    ROCK_STANDARD_1: 4,
    ROCK_STANDARD_2: 5,
    ROCK_STANDARD_3: 6,
    ROCK_STANDARD_4: 7,
    ROCK_STANDARD_5: 8,
    ROCK_STANDARD_6: 9,
    ROCK_STANDARD_7: 10,
    ROCK_STANDARD_8: 11,
    ROCK_STANDARD_9: 12,

    FILL_QUARTER_1: 13,
    FILL_QUARTER_2: 14,
    FILL_QUARTER_3: 15,
    FILL_QUARTER_4: 16,

    MARCH_STANDARD_1: 17,
    MARCH_STANDARD_2: 18,
    MARCH_STANDARD_3: 19,

    FILL_QUARTER_TRIPLET_1: 20,
    FILL_QUARTER_TRIPLET_2: 21,
    FILL_QUARTER_TRIPLET_3: 22,

    FILL_EIGHTS_1: 23,
    FILL_EIGHTS_2: 24,
    FILL_EIGHTS_3: 25,
    FILL_EIGHTS_4: 26,
    FILL_EIGHTS_5: 27,
    FILL_EIGHTS_6: 28,
    FILL_EIGHTS_7: 29,
    FILL_EIGHTS_8: 30,

    toString: function(type) {
        switch (type) {
            case PredefinedPercussionMotifType.FILL_EIGHTS_1:
                return "Fill eights 1 (one measure)";
            case PredefinedPercussionMotifType.FILL_EIGHTS_2:
                return "Fill eights 2 (one measure)";
            case PredefinedPercussionMotifType.FILL_EIGHTS_3:
                return "Fill eights 3 (one measure)";
            case PredefinedPercussionMotifType.FILL_EIGHTS_4:
                return "Fill eights 4 (one measure)";
            case PredefinedPercussionMotifType.FILL_EIGHTS_5:
                return "Fill eights 5 (one measure)";
            case PredefinedPercussionMotifType.FILL_EIGHTS_6:
                return "Fill eights 6 (one measure)";
            case PredefinedPercussionMotifType.FILL_EIGHTS_7:
                return "Fill eights 7 (one measure)";
            case PredefinedPercussionMotifType.FILL_EIGHTS_8:
                return "Fill eights 8 (one measure)";
            case PredefinedPercussionMotifType.FILL_QUARTER_TRIPLET_1:
                return "Fill quarter triplet 1 (one measure)";
            case PredefinedPercussionMotifType.FILL_QUARTER_TRIPLET_2:
                return "Fill quarter triplet 2 (one measure)";
            case PredefinedPercussionMotifType.FILL_QUARTER_TRIPLET_3:
                return "Fill quarter triplet 3 (one measure)";
            case PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_1:
                return "Fill dotted quarter 1 (one measure)";
            case PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_2:
                return "Fill dotted quarter 2 (one measure)";
            case PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_3:
                return "Fill dotted quarter 3 (two measures)";
            case PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_4:
                return "Fill dotted quarter 4 (two measures)";
            case PredefinedPercussionMotifType.FILL_QUARTER_1:
                return "Fill quarter 1 (one measures)";
            case PredefinedPercussionMotifType.FILL_QUARTER_2:
                return "Fill quarter 2 (one measures)";
            case PredefinedPercussionMotifType.FILL_QUARTER_3:
                return "Fill quarter 3 (two measures)";
            case PredefinedPercussionMotifType.FILL_QUARTER_4:
                return "Fill quarter 4 (one measures)";
            case PredefinedPercussionMotifType.ROCK_STANDARD_1:
                return "Rock standard 1 (one measure)";
            case PredefinedPercussionMotifType.ROCK_STANDARD_2:
                return "Rock standard 2 (one measure)";
            case PredefinedPercussionMotifType.ROCK_STANDARD_3:
                return "Rock standard 3 (one measure)";
            case PredefinedPercussionMotifType.ROCK_STANDARD_4:
                return "Rock standard 4 (one measure)";
            case PredefinedPercussionMotifType.ROCK_STANDARD_5:
                return "Rock standard 5 (one measure)";
            case PredefinedPercussionMotifType.ROCK_STANDARD_6:
                return "Rock standard 6 (one measure)";
            case PredefinedPercussionMotifType.ROCK_STANDARD_7:
                return "Rock standard 7 (one measure)";
            case PredefinedPercussionMotifType.ROCK_STANDARD_8:
                return "Rock standard 8 (one measure)";
            case PredefinedPercussionMotifType.ROCK_STANDARD_9:
                return "Rock standard 9 (one measure)";
            case PredefinedPercussionMotifType.MARCH_STANDARD_1:
                return "March standard 1 (one measure)";
            case PredefinedPercussionMotifType.MARCH_STANDARD_2:
                return "March standard 2 (one measure)";
            case PredefinedPercussionMotifType.MARCH_STANDARD_3:
                return "March standard 3 (one measure)";
        }
        return "Unknown predefined type " + type;
    }
};
addPossibleValuesFunction(PredefinedPercussionMotifType, PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_1, PredefinedPercussionMotifType.FILL_EIGHTS_8);
// sortEnumAlphabetically(PredefinedPercussionMotifType);


function PredefinedPercussionMotifElement() {
    PercussionMotifElement.call(this);

    this.type = PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_1;

    this.useDefaultDrums = true;

    this.useNamedNotes = false;
    this.drums = [MidiDrum.BASS_DRUM_1, MidiDrum.SNARE_DRUM_1, MidiDrum.CLOSED_HIHAT, MidiDrum.OPEN_HIHAT, MidiDrum.RIDE_CYMBAL_1];
    this.namedNotes = [];

    this.ghostStrength = 0.6;
    this.rollStrength = 0.7;
    this.flamStrength = 0.7;
    this.normalStrength = 0.8;
    this.accentStrength = 0.9;
    this.marcatoStrength = 1.0;

    this.flamLength = 0.25;
    this.flamLengthUnit = PositionUnit.BEAT_EIGHTHS;
}

PredefinedPercussionMotifElement.prototype = new PercussionMotifElement();

PredefinedPercussionMotifElement.prototype.setType = function(v) {
    this.type = v;
    return this;
};

PredefinedPercussionMotifElement.prototype.getNote = function(index, module, defaultNotes) {
    if (this.useDefaultDrums) {
        return defaultNotes[index % defaultNotes.length];
    }
    if (this.useNamedNotes && this.namedNotes.length > 0) {
        var namedNoteId = this.namedNotes[index % this.namedNotes.length];
        var namedNote = module.getNamedNote(namedNoteId);
        if (namedNote) {
            return namedNote.getNote();
        }
    } else if (this.drums.length > 0) {
        return this.drums[index % this.drums.length];
    }
    return 60;
};


PredefinedPercussionMotifElement.prototype.createFlams = function(flamsInfo, module, defaultDrums, result) {
    var flamLength = getValueOrDefault(flamsInfo, "flamLength", 1.0 / 16.0);
    var starts = getValueOrDefault(flamsInfo, "starts", [0.0]); // Without displacement
    var drumIndices = getValueOrDefault(flamsInfo, "drumIndices", [0]);

    var calcStarts = [];
    for (var i=0; i<starts.length; i++) {
        calcStarts.push(starts[i] - flamLength);
    }

    this.getElementsFromPattern({
        starts: calcStarts,
        lengths: [flamLength],
        flams: [1],
        drumIndices: drumIndices
    }, module, defaultDrums, result);
};



PredefinedPercussionMotifElement.prototype.createRoll = function(rollInfo, module, defaultDrums, result) {
    var length = getValueOrDefault(rollInfo, "length", 1.0);
    var start = getValueOrDefault(rollInfo, "start", 0.0);
    var drumIndex = getValueOrDefault(rollInfo, "drumIndex", 0);
    var noteLength = getValueOrDefault(rollInfo, "noteLength", 0.25);

    var noteCount = Math.round(length / noteLength);
    var pos = start;

    var starts = [];
    for (var i=0; i<noteCount; i++) {
        starts.push(pos);
        pos += noteLength;
    }

    this.getElementsFromPattern({
        starts: starts,
        lengths: [noteLength],
        rolls: [1],
        drumIndices: [drumIndex]
    }, module, defaultDrums, result);
};

PredefinedPercussionMotifElement.prototype.getElementsFromPattern = function(patternInfo, module, defaultDrums, result) {

    var starts = patternInfo.starts ? patternInfo.starts : [0];
    var lengths = patternInfo.lengths ? patternInfo.lengths : [1.0 / 4.0];
    var lengthMultiplier = patternInfo.lengthMultiplier ? patternInfo.lengthMultiplier : 1.0;
    var rests = patternInfo.rests ? patternInfo.rests : [0];
    var ghosts = patternInfo.ghosts ? patternInfo.ghosts : [0];
    var rolls = patternInfo.rolls ? patternInfo.rolls : [0];
    var velMults = patternInfo.velMults ? patternInfo.velMults : [1.0];
    var posShifts = patternInfo.posShifts ? patternInfo.posShifts : [0.0];
    var flams = patternInfo.flams ? patternInfo.flams : [0];
    var accents = patternInfo.accents ? patternInfo.accents : [0];
    var marcatos = patternInfo.marcatos ? patternInfo.marcatos : [0];
    var drumIndices = patternInfo.drumIndices ? patternInfo.drumIndices : [0];
    var positionShift = typeof(patternInfo.positionShift) === "undefined" ? 0 : patternInfo.positionShift;


    if (positionShift > 0) {
        var pme = new PrimitivePercussionMotifElement();
        pme.rest = true;
        pme.length = positionShift * lengthMultiplier;
        pme.startTime = 0;
        pme.startTimeUnit = PositionUnit.BEATS;
        result.push(pme);
    }

    for (var i=0; i<starts.length; i++) {

        var pme = new PrimitivePercussionMotifElement();
        pme.rest = rests[i % rests.length] == 1;
        
        pme.note = this.getNote(drumIndices[i % drumIndices.length], module, defaultDrums);
        pme.startTime = starts[i % starts.length] * lengthMultiplier + positionShift + posShifts[i % posShifts.length];
        pme.startTimeUnit = PositionUnit.BEATS;

        pme.length = 0.95 * lengths[i % lengths.length] * lengthMultiplier;
        pme.lengthUnit = PositionUnit.BEATS;
        var strength = this.normalStrength;
        if (flams[i % flams.length] == 1) {
            strength = this.flamStrength;
        } else if (ghosts[i % ghosts.length] == 1) {
            strength = this.ghostStrength;
        } else if (rolls[i % rolls.length] == 1) {
            strength = this.rollStrength;
        } else if (accents[i % accents.length] == 1) {
            strength = this.accentStrength;
        } else if (marcatos[i % marcatos.length] == 1) {
            strength = this.marcatoStrength;
        }
        strength *= velMults[i % velMults.length];

        pme.strength = strength;
        result.push(pme);
    }

};

PredefinedPercussionMotifElement.prototype.getPrimitivePercussionMotifElements = function(module, harmony, harmonyBeatOffset) {
    var result = [];

    var he = harmony.getHarmonyAt(harmonyBeatOffset);
    var harmonyElementBeatLength = he.getBeatLength();
    var measureBeatLength = positionUnitToBeats(1, PositionUnit.MEASURES, he.tsNumerator, he.tsDenominator);

    var defaultDrums = [MidiDrum.BASS_DRUM_1, MidiDrum.SNARE_DRUM_1, MidiDrum.CLOSED_HIHAT];

    // Switch for default drums
    switch (this.type) {
        case PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_1:
        case PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_2:
        case PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_3:
        case PredefinedPercussionMotifType.FILL_EIGHTS_1:
        case PredefinedPercussionMotifType.FILL_EIGHTS_2:
        case PredefinedPercussionMotifType.FILL_EIGHTS_3:
        case PredefinedPercussionMotifType.FILL_EIGHTS_4:
        case PredefinedPercussionMotifType.FILL_EIGHTS_5:
        case PredefinedPercussionMotifType.FILL_EIGHTS_6:
        case PredefinedPercussionMotifType.FILL_EIGHTS_7:
        case PredefinedPercussionMotifType.FILL_EIGHTS_8:
        case PredefinedPercussionMotifType.FILL_QUARTER_1:
        case PredefinedPercussionMotifType.FILL_QUARTER_2:
        case PredefinedPercussionMotifType.FILL_QUARTER_3:
        case PredefinedPercussionMotifType.FILL_QUARTER_TRIPLET_1:
        case PredefinedPercussionMotifType.FILL_QUARTER_TRIPLET_2:
        case PredefinedPercussionMotifType.FILL_QUARTER_TRIPLET_3:
            defaultDrums = [MidiDrum.SNARE_DRUM_1];
            break;
        case PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_4:
            defaultDrums = [MidiDrum.SNARE_DRUM_1, MidiDrum.LOW_TOM_1, MidiDrum.MID_TOM_1];
            break;
        case PredefinedPercussionMotifType.FILL_QUARTER_4:
            defaultDrums = [MidiDrum.SNARE_DRUM_1, MidiDrum.LOW_TOM_1];
            break;
        case PredefinedPercussionMotifType.MARCH_STANDARD_1:
        case PredefinedPercussionMotifType.MARCH_STANDARD_2:
        case PredefinedPercussionMotifType.MARCH_STANDARD_3:
            defaultDrums = [MidiDrum.BASS_DRUM_1, MidiDrum.SNARE_DRUM_1, MidiDrum.PEDAL_HIHAT];
            break;
    }

    // Switch for drum 1 (bass etc.)
    switch (this.type) {
        case PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_1:
            this.getElementsFromPattern({
                starts: [0, 1.5, 3],
                lengths: [1.5, 1.5, 1]
            }, module, defaultDrums, result);
            break;
        case PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_2:
            this.getElementsFromPattern({
                starts: [0.0, 0.5, 2, 3.5],
                lengths: [0.5, 1.5, 1.5, 1],
                rests: [1, 0, 0, 0]
            }, module, defaultDrums, result);
            break;
        case PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_3:
            this.getElementsFromPattern({
                starts: [0.0, 1.0, 2.5, 4.0, 5.5, 7],
                lengths: [1.0, 1.5, 1.5, 1.5, 1.5, 1],
                rests: [1, 0, 0, 0, 0, 0]
            }, module, defaultDrums, result);
            break;
        case PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_4:
            this.getElementsFromPattern({
                starts: [0.0, 1.0, 2.5, 4.0, 5.5, 7],
                lengths: [1.0, 1.5, 1.5, 1.5, 1],
                rests: [1, 0, 0, 0, 0, 0],
                drumIndices: [0, 0, 1, 2, 0, 1]
            }, module, defaultDrums, result);
            break;
        case PredefinedPercussionMotifType.FILL_QUARTER_1:
            this.getElementsFromPattern({
                starts: [0.0, 1.0, 2.0, 3.0],
                lengths: [1.0]
            }, module, defaultDrums, result);
            break;
        case PredefinedPercussionMotifType.FILL_QUARTER_2:
            this.getElementsFromPattern({
                starts: [0.0, 1.0, 2.0, 3.0],
                lengths: [1.0],
                rests: [0, 0, 1, 0]
            }, module, defaultDrums, result);
            break;
        case PredefinedPercussionMotifType.FILL_QUARTER_3:
            this.getElementsFromPattern({
                starts: [0.0, 1.0, 2.0, 3.0, 4, 5, 6, 7],
                lengths: [1.0],
                rests: [0, 0, 1, 0, 0, 1, 0, 0]
            }, module, defaultDrums, result);
            break;
        case PredefinedPercussionMotifType.FILL_QUARTER_4:
            this.getElementsFromPattern({
                starts: [0.0, 1.0, 2.0, 3.0],
                lengths: [1.0]
            }, module, defaultDrums, result);
            this.getElementsFromPattern({
                starts: [0.0, 1.0, 2.0, 3.0],
                lengths: [1.0],
                drumIndices: [1]
            }, module, defaultDrums, result);
            break;
        case PredefinedPercussionMotifType.FILL_EIGHTS_1:
        case PredefinedPercussionMotifType.FILL_EIGHTS_2:
        case PredefinedPercussionMotifType.FILL_EIGHTS_3:
        case PredefinedPercussionMotifType.FILL_EIGHTS_4:
        case PredefinedPercussionMotifType.FILL_EIGHTS_5:
        case PredefinedPercussionMotifType.FILL_EIGHTS_6:
        case PredefinedPercussionMotifType.FILL_EIGHTS_7:
        case PredefinedPercussionMotifType.FILL_EIGHTS_8:
            var accents = [0];
            var rests = [0];
            switch (this.type) {
                case PredefinedPercussionMotifType.FILL_EIGHTS_2:
                    accents = [1, 0, 0, 1, 0, 0, 1, 0];
                    break;
                case PredefinedPercussionMotifType.FILL_EIGHTS_3:
                    accents = [1, 0, 1, 1, 0, 1, 1, 0];
                    break;
                case PredefinedPercussionMotifType.FILL_EIGHTS_4:
                    accents = [1, 1, 0, 1, 1, 0, 1, 0];
                    break;
                case PredefinedPercussionMotifType.FILL_EIGHTS_5:
                    accents = [0, 1, 0, 1, 0, 1, 0, 1];
                    break;
                case PredefinedPercussionMotifType.FILL_EIGHTS_6:
                    rests = [0, 0, 1, 0, 0, 1, 0, 0];
                    break;
                case PredefinedPercussionMotifType.FILL_EIGHTS_7:
                    rests = [0, 0, 0, 0, 1, 0, 0, 0];
                    break;
                case PredefinedPercussionMotifType.FILL_EIGHTS_8:
                    rests = [1, 0, 0, 0, 0, 0, 1, 0];
                    break;
            }
            this.getElementsFromPattern({
                starts: createFilledNumericIncArray(8, 0, 1.0 / 2.0),
                lengths: [1.0 / 2.0],
                accents: accents,
                rests: rests
            }, module, defaultDrums, result);
            break;
        case PredefinedPercussionMotifType.FILL_QUARTER_TRIPLET_1:
        case PredefinedPercussionMotifType.FILL_QUARTER_TRIPLET_2:
        case PredefinedPercussionMotifType.FILL_QUARTER_TRIPLET_3:
            var accents = [0];
            var rests = [0];
            switch (this.type) {
                case PredefinedPercussionMotifType.FILL_QUARTER_TRIPLET_2:
                    accents = [1, 0, 1, 0, 1, 0];
                    break;
                case PredefinedPercussionMotifType.FILL_QUARTER_TRIPLET_3:
//                    rests = [1, 0, 1, 0, 1, 0];
                    break;
            }
            this.getElementsFromPattern({
                starts: [0.0, 2/3, 4/3, 6/3, 8/3, 10/3],
                lengths: [2.0 / 3.0],
                accents: accents,
                rests: rests
            }, module, defaultDrums, result);
            break;
        case PredefinedPercussionMotifType.MARCH_STANDARD_1:
        case PredefinedPercussionMotifType.MARCH_STANDARD_2:
        case PredefinedPercussionMotifType.MARCH_STANDARD_3:
            // Four to the floor, no accents
            this.getElementsFromPattern({
                starts: [0.0, 1, 2.0, 3],
                lengths: [0.5],
                drumIndices: [0]
            }, module, defaultDrums, result);
            break;
        case PredefinedPercussionMotifType.ROCK_STANDARD_1:
        case PredefinedPercussionMotifType.ROCK_STANDARD_7:
        case PredefinedPercussionMotifType.ROCK_STANDARD_8:
        case PredefinedPercussionMotifType.ROCK_STANDARD_9:
            // Two to the floor
            this.getElementsFromPattern({
                starts: [0.0, 2.0],
                lengths: [0.5],
                accents: [1]
            }, module, defaultDrums, result);
            break;
        case PredefinedPercussionMotifType.ROCK_STANDARD_2:
            this.getElementsFromPattern({
                starts: [0.0, 1.5, 2.0],
                lengths: [0.25],
                accents: [1, 0, 1]
            }, module, defaultDrums, result);
            break;
        case PredefinedPercussionMotifType.ROCK_STANDARD_3:
            this.getElementsFromPattern({
                starts: [0.0, 2.0, 2.5],
                lengths: [0.25],
                accents: [1, 1, 0]
            }, module, defaultDrums, result);
            break;
        case PredefinedPercussionMotifType.ROCK_STANDARD_4:
            this.getElementsFromPattern({
                starts: [0.0, 1.5, 2.5],
                lengths: [0.25],
                accents: [1, 0, 0]
            }, module, defaultDrums, result);
            break;
        case PredefinedPercussionMotifType.ROCK_STANDARD_5:
            this.getElementsFromPattern({
                starts: [0.0, 0.5, 1.5, 2.5, 3.5],
                lengths: [0.25],
                accents: [1, 0, 0, 0, 0]
            }, module, defaultDrums, result);
            break;
        case PredefinedPercussionMotifType.ROCK_STANDARD_6:
            this.getElementsFromPattern({
                starts: [0.0, 0.5, 1.5, 2.0, 2.5, 3.5],
                lengths: [0.25],
                accents: [1, 0, 0, 1, 0, 0, 0]
            }, module, defaultDrums, result);
            break;
    }

    // Switch for drum 2 (snare etc.)
    switch (this.type) {
        case PredefinedPercussionMotifType.MARCH_STANDARD_1:
            this.getElementsFromPattern({
                starts: [0.0, 0.5, 1, 1.25, 1.5, 1.75, 2, 2.5],
                lengths: [0.25],
                drumIndices: [1]
            }, module, defaultDrums, result);
            this.createRoll({start: 3.0, length: 1.0, noteLength: 0.125, drumIndex: 1}, module, defaultDrums, result);
            break;
        case PredefinedPercussionMotifType.MARCH_STANDARD_2:
            var starts = [0.5, 1.5, 2.5, 3.5];
            this.getElementsFromPattern({
                starts: starts,
                lengths: [0.25],
                drumIndices: [1]
            }, module, defaultDrums, result);
            this.createFlams({
                starts: starts,
                drumIndices: [1]
            }, module, defaultDrums, result);
            break;
        case PredefinedPercussionMotifType.MARCH_STANDARD_3:
            this.getElementsFromPattern({
                starts: [0, 2/3, 1, 5/3, 2, 8/3, 3],
                lengths: [0.125],
                drumIndices: [1]
            }, module, defaultDrums, result);
            this.createFlams({
                starts: [1, 2, 3],
                drumIndices: [1]
            }, module, defaultDrums, result);
            this.createRoll({start: 11/3, length: 1.0 / 3, noteLength: 1/8, drumIndex: 1}, module, defaultDrums, result);
            break;
        case PredefinedPercussionMotifType.ROCK_STANDARD_1:
        case PredefinedPercussionMotifType.ROCK_STANDARD_2:
        case PredefinedPercussionMotifType.ROCK_STANDARD_3:
        case PredefinedPercussionMotifType.ROCK_STANDARD_4:
        case PredefinedPercussionMotifType.ROCK_STANDARD_5:
        case PredefinedPercussionMotifType.ROCK_STANDARD_6:
            this.getElementsFromPattern({
                starts: [1.0, 3.0],
                lengths: [1.0, 1.0],
                drumIndices: [1],
                accents: [1]
            }, module, defaultDrums, result);
            break;
        case PredefinedPercussionMotifType.ROCK_STANDARD_7:
            this.getElementsFromPattern({
                starts: [1.0, 1.75, 3.0],
                lengths: [0.25],
                drumIndices: [1],
                accents: [1, 0, 1]
            }, module, defaultDrums, result);
            break;
        case PredefinedPercussionMotifType.ROCK_STANDARD_8:
            this.getElementsFromPattern({
                starts: [1.0, 1.75, 3.0, 3.75],
                lengths: [0.25],
                drumIndices: [1],
                accents: [1, 0, 1, 0]
            }, module, defaultDrums, result);
            break;
        case PredefinedPercussionMotifType.ROCK_STANDARD_9:
            this.getElementsFromPattern({
                starts: [1.0, 1.75, 2.25, 3.0, 3.75],
                lengths: [0.25],
                drumIndices: [1],
                accents: [1, 0, 0, 0, 1, 0]
            }, module, defaultDrums, result);
            break;
    }


    // Switch for drum 3 (hihat, ride etc.)
    switch (this.type) {
        case PredefinedPercussionMotifType.MARCH_STANDARD_1:
        case PredefinedPercussionMotifType.MARCH_STANDARD_2:
        case PredefinedPercussionMotifType.MARCH_STANDARD_3:
            this.getElementsFromPattern({
                starts: createFilledNumericIncArray(4, 0, 1.0),
                lengths: [1.0],
                drumIndices: [2]
            }, module, defaultDrums, result);
            break;
        case PredefinedPercussionMotifType.ROCK_STANDARD_1:
        case PredefinedPercussionMotifType.ROCK_STANDARD_2:
        case PredefinedPercussionMotifType.ROCK_STANDARD_3:
        case PredefinedPercussionMotifType.ROCK_STANDARD_4:
        case PredefinedPercussionMotifType.ROCK_STANDARD_5:
        case PredefinedPercussionMotifType.ROCK_STANDARD_6:
        case PredefinedPercussionMotifType.ROCK_STANDARD_7:
        case PredefinedPercussionMotifType.ROCK_STANDARD_8:
        case PredefinedPercussionMotifType.ROCK_STANDARD_9:
            // Eights hihats
            this.getElementsFromPattern({
                starts: createFilledNumericIncArray(8, 0, 0.5),
                lengths: [0.25],
                drumIndices: [2],
                accents: [1, 0]
            }, module, defaultDrums, result);
            break;
    }


    return result;
};

