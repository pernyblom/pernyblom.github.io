

var VoiceLineSemantics = {
    MELODY: 0,
    INNER: 1,
    BASS: 2,
    DOUBLED: 3
};


// Chord types
var ChordType = {
    TRIAD: 0,
    SEVENTH: 1,
    SUS2: 2,
    SUS4: 3,
    SUS2_SEVENTH: 4,
    SUS4_SEVENTH: 5,
    NINTH: 6,
    CUSTOM: 7,

    toString: function(type) {
        switch (type) {
            case ChordType.CUSTOM:
                return "Custom";
            case ChordType.SEVENTH:
                return "Seventh";
            case ChordType.SUS2:
                return "Sus2";
            case ChordType.SUS2_SEVENTH:
                return "Sus2 Seventh";
            case ChordType.SUS4:
                return "Sus4";
            case ChordType.SUS4_SEVENTH:
                return "Sus4 Seventh";
            case ChordType.TRIAD:
                return "Triad";
            case ChordType.NINTH:
                return "Ninth";
        }
        return "Unknown chord type " + type;
    }
};
addPossibleValuesFunction(ChordType, ChordType.TRIAD, ChordType.CUSTOM);



var SimpleScaleType = {
    MAJOR: 1,
    NATURAL_MINOR: 2,

    toString: function(type) {
        switch (type) {
            case SimpleScaleType.MAJOR:
                return "Major";
            case SimpleScaleType.NATURAL_MINOR:
                return "Minor";
        }
        return "Unknown scale type " + type;
    }
};
addPossibleValuesFunction(SimpleScaleType, SimpleScaleType.MAJOR, SimpleScaleType.NATURAL_MINOR);



var ScaleType = {
    CUSTOM: 0,
    MAJOR: 1,
    NATURAL_MINOR: 2,
    HARMONIC_MINOR: 3,
    MELODIC_MINOR: 4,
    PERSIAN: 5,
    DIMINISHED: 6,
    WHOLE_NOTE: 7,

    MAJOR_SCALE_STEPS: [ 0, 2, 4, 5, 7, 9, 11 ],
    NATURAL_MINOR_SCALE_STEPS: [ 0, 2, 3, 5, 7, 8, 10 ],
    HARMONIC_MINOR_SCALE_STEPS: [ 0, 2, 3, 5, 7, 8, 11 ],
    MELODIC_MINOR_SCALE_STEPS: [ 0, 2, 3, 5, 7, 9, 11 ],
    PERSIAN_SCALE_STEPS: [ 0, 1, 4, 5, 6, 8, 11 ],
    DIMINISHED_SCALE_STEPS: [ 0, 1, 3, 4, 6, 7, 9, 10 ],
    WHOLE_NOTE_SCALE_STEPS: [ 0, 2, 4, 6, 8, 10 ],

    getChromaticSteps: function(type) {
        switch (type) {
            case ScaleType.MAJOR:
                return ScaleType.MAJOR_SCALE_STEPS;
            case ScaleType.NATURAL_MINOR:
                return ScaleType.NATURAL_MINOR_SCALE_STEPS;
            case ScaleType.HARMONIC_MINOR:
                return ScaleType.HARMONIC_MINOR_SCALE_STEPS;
            case ScaleType.MELODIC_MINOR:
                return ScaleType.MELODIC_MINOR_SCALE_STEPS;
            case ScaleType.PERSIAN:
                return ScaleType.PERSIAN_SCALE_STEPS;
            case ScaleType.DIMINISHED:
                return ScaleType.DIMINISHED_SCALE_STEPS;
            case ScaleType.WHOLE_NOTE:
                return ScaleType.WHOLE_NOTE_SCALE_STEPS;
            default:
                return ScaleType.MAJOR_SCALE_STEPS;
        }
        return ScaleType.MAJOR_SCALE_STEPS;
    },

    toString: function(type) {
        switch (type) {
            case ScaleType.CUSTOM:
                return "Custom";
            case ScaleType.MAJOR:
                return "Major";
            case ScaleType.NATURAL_MINOR:
                return "Minor";
            case ScaleType.HARMONIC_MINOR:
                return "Harmonic minor";
            case ScaleType.MELODIC_MINOR:
                return "Melodic minor";
            case ScaleType.PERSIAN:
                return "Persian";
            case ScaleType.DIMINISHED:
                return "Diminished";
            case ScaleType.WHOLE_NOTE:
                return "Whole note";
        }
        return "Unknown scale type " + type;
    }
};
addPossibleValuesFunction(ScaleType, ScaleType.CUSTOM, ScaleType.WHOLE_NOTE);



var IndexType = {
    MIDI_NOTE: 0,
    SCALE: 1,
    CHORD_BASS: 2,
    CHORD_ROOT: 3,

    toString: function(type) {
        switch (type) {
            case IndexType.MIDI_NOTE:
                return "Midi note";
            case IndexType.SCALE:
                return "Scale";
            case IndexType.CHORD_BASS:
                return "Chord bass";
            case IndexType.CHORD_ROOT:
                return "Chord root";
        }
        return "Unknown index type " + type;
    }
};
addPossibleValuesFunction(IndexType, IndexType.MIDI_NOTE, IndexType.CHORD_ROOT);



// Snap types
var SnapType = {
    NONE: 0,
    SCALE: 1,
    CHORD: 2,

    toString: function(type) {
        switch (type) {
            case SnapType.NONE:
                return "None";
            case SnapType.CHORD:
                return "Chord";
            case SnapType.SCALE:
                return "Scale";
        }
        return "Unknown snap type " + type;
    }
};
addPossibleValuesFunction(SnapType, SnapType.NONE, SnapType.CHORD);

var FrequencyUnit = {
    HERTZ: 0,
    MIDI_NOTE: 1,

    toString: function(type) {
        switch (type) {
            case FrequencyUnit.HERTZ:
                return "Hertz";
            case FrequencyUnit.MIDI_NOTE:
                return "Midi note";
        }
        return "Unknown frequency unit " + type;
    }
};
addPossibleValuesFunction(FrequencyUnit, FrequencyUnit.HERTZ, FrequencyUnit.MIDI_NOTE);


var CyclesUnit = {
    CYCLES_PER_PERIOD: 0,
    CYCLES_PER_BEAT: 1,
    CYCLES_PER_MEASURE: 2,
    CYCLES_PER_HARMONY: 3,

    getFrequency: function(unit, cycles, periodStartBeat, periodEndBeat, harmony) {
        var periodBeats = periodEndBeat - periodStartBeat;
        if (periodBeats > 0) {
            switch (unit) {
                case CyclesUnit.CYCLES_PER_PERIOD:
                    return cycles;
                case CyclesUnit.CYCLES_PER_BEAT:
                    return cycles;
                case CyclesUnit.CYCLES_PER_MEASURE:
                    // positionUnitToBeats(length, unit, numerator, denominator, harmony);
                    return cycles;
                case CyclesUnit.CYCLES_PER_HARMONY:
                    var harmonyBeats = harmony.getBeatLength();
                    return periodBeats / harmonyBeats;
            }
        }
        return cycles;
    },
    toString: function(type) {
        switch (type) {
            case CyclesUnit.CYCLES_PER_PERIOD:
                return "Cycles per period";
            case CyclesUnit.CYCLES_PER_BEAT:
                return "Cycles per beat";
            case CyclesUnit.CYCLES_PER_MEASURE:
                return "Cycles per measure";
            case CyclesUnit.CYCLES_PER_HARMONY:
                return "Cycles per harmony";
        }
        return "Unknown cycles unit " + type;
    }
};
addPossibleValuesFunction(CyclesUnit, CyclesUnit.CYCLES_PER_PERIOD, CyclesUnit.CYCLES_PER_HARMONY);


function frequencyUnitToHertz(freq, unit) {
    switch (unit) {
        case FrequencyUnit.HERTZ:
            return freq;
        case FrequencyUnit.MIDI_NOTE:
            var n = freq - 69; // A4;
            return 440.0 * Math.pow(2.0, n / 12.0);
    }
    return freq;
}


var SnapMetrics = {
    FLOOR: 0,
    CEIL: 1,
    ROUND: 2,
    toString: function(type) {
        switch (type) {
            case SnapMetrics.CEIL:
                return "Ceil";
            case SnapMetrics.FLOOR:
                return "Floor";
            case SnapMetrics.ROUND:
                return "Round";
        }
        return "Unknown snap metrics " + type;
    },
    snap: function(value, metrics) {
        switch (metrics) {
            case SnapMetrics.CEIL:
                return Math.ceil(value);
            case SnapMetrics.FLOOR:
                return Math.floor(value);
            case SnapMetrics.ROUND:
                return Math.round(value);
        }
        return Math.round(value);
    }
};
addPossibleValuesFunction(SnapMetrics, SnapMetrics.FLOOR, SnapMetrics.ROUND);


var VerticalRelativeType = {
    //
    MIDI_ZERO: 0, //
    SCALE_BASE: 1, //
    CHORD_BASS: 2,
    CHORD_ROOT: 3, //
    VOICE_LINE: 4,
    NOTE: 5,

    toString: function(type) {
        switch (type) {
            case VerticalRelativeType.MIDI_ZERO:
                return "Midi zero";
            case VerticalRelativeType.SCALE_BASE:
                return "Scale base";
            case VerticalRelativeType.CHORD_BASS:
                return "Chord bass";
            case VerticalRelativeType.CHORD_ROOT:
                return "Chord root";
            case VerticalRelativeType.VOICE_LINE:
                return "Voice line";
            case VerticalRelativeType.NOTE:
                return "Note";
        }
        return "Unknown type " + type;
    },

    sample: function(rnd) {
        return Math.min(4, Math.max(0, Math.floor(rnd.random() * 5)));
    }
};
addPossibleValuesFunction(VerticalRelativeType, VerticalRelativeType.MIDI_ZERO, VerticalRelativeType.NOTE);





var IndexBorderMode = {
    END: 0,
    RESTART: 1,
    MIRROR: 2,
    CLAMP: 3,

    toString: function(type) {
        switch (type) {
            case IndexBorderMode.END:
                return "End";
            case IndexBorderMode.RESTART:
                return "Restart";
            case IndexBorderMode.MIRROR:
                return "Mirror";
            case IndexBorderMode.CLAMP:
                return "Clamp";
        }
    },

    getIndex: function(mode, size, index) {
        if (index < size) {
            return index;
        }
        switch (mode) {
            case IndexBorderMode.END:
                return -1;
            case IndexBorderMode.CLAMP:
                return size - 1;
            case IndexBorderMode.RESTART:
                return index % size;
            case IndexBorderMode.MIRROR:
                var period = size * 2;
                var periodIndex = index % period;
                if (periodIndex < size) {
                    return periodIndex;
                } else {
                    return period - periodIndex - 1;
                }
                return index % size;
        }
        return index;
    }
};
addPossibleValuesFunction(IndexBorderMode, IndexBorderMode.END, IndexBorderMode.CLAMP);



var HorizontalRelativeType = {
    PREVIOUS_NOTE: 0, //
    NEXT_NOTE: 1, //
    PREVIOUS_VOICE_LINE_ELEMENT: 2, //
    NEXT_VOICE_LINE_ELEMENT: 3, //

    toString: function(type) {
        switch (type) {
            case HorizontalRelativeType.NEXT_NOTE:
                return "Next note";
            case HorizontalRelativeType.NEXT_VOICE_LINE_ELEMENT:
                return "Next voice line element";
            case HorizontalRelativeType.PREVIOUS_NOTE:
                return "Previous note";
            case HorizontalRelativeType.PREVIOUS_VOICE_LINE_ELEMENT:
                return "Previous voice line element";
        }
        return "Unknown horiz. relative type " + type;
    }
};
addPossibleValuesFunction(HorizontalRelativeType, HorizontalRelativeType.PREVIOUS_NOTE, VerticalRelativeType.NEXT_VOICE_LINE_ELEMENT);


var OffsetType = {
    CHORD: 0,
    SCALE: 1,
    HALF_STEP: 2,
    OCTAVE: 3,
    CHORD_TRIAD_ONLY: 4,
    CHORD_SEVENTH_ONLY: 5,

    toString: function(type) {
        switch (type) {
            case OffsetType.CHORD:
                return "Chord";
            case OffsetType.SCALE:
                return "Scale";
            case OffsetType.HALF_STEP:
                return "Half step";
            case OffsetType.OCTAVE:
                return "Octave";
            case OffsetType.CHORD_TRIAD_ONLY:
                return "Chord triad only";
            case OffsetType.CHORD_SEVENTH_ONLY:
                return "Chord seventh only";
        }
        return "Unknown offset type " + type;
    }

};
addPossibleValuesFunction(OffsetType, OffsetType.CHORD, OffsetType.CHORD_SEVENTH_ONLY);


var LengthAndCountUnit = {
    LENGTH_PERCENT: 0,
    COUNT_PERCENT: 1,
    LENGTH: 2,
    COUNT: 3,

    toString: function(unit) {
        switch (unit) {
            case LengthAndCountUnit.LENGTH:
                return "Length";
            case LengthAndCountUnit.COUNT:
                return "Count";
            case LengthAndCountUnit.LENGTH_PERCENT:
                return "Length percent";
            case LengthAndCountUnit.COUNT_PERCENT:
                return "Count percent";
        }
        return "Unknown length and count unit";
    }

};
addPossibleValuesFunction(LengthAndCountUnit, LengthAndCountUnit.LENGTH_PERCENT, LengthAndCountUnit.COUNT);


var CountUnit = {
    PLAIN: 0,
    HARMONY_ELEMENT_MEASURES: 1,
    HARMONY_ELEMENT_BEATS: 2,
    HARMONY_MEASURES: 3,
    HARMONY_BEATS: 4,
    HARMONY_ELEMENT_COUNT: 5,
    PLAIN_PLUS_HARMONY_ELEMENT_MEASURES: 6,
    PLAIN_PLUS_HARMONY_ELEMENT_BEATS: 7,
    PLAIN_PLUS_HARMONY_MEASURES: 8,
    PLAIN_PLUS_HARMONY_BEATS: 9,
    PLAIN_PLUS_HARMONY_ELEMENT_COUNT: 10,
    PHRASE_ELEMENT_COUNT: 11,

    toString: function(unit) {
        switch (unit) {
            case CountUnit.PLAIN:
                return "Plain";
            case CountUnit.HARMONY_BEATS:
                return "Harmony beats";
            case CountUnit.HARMONY_ELEMENT_BEATS:
                return "Harmony element beats";
            case CountUnit.HARMONY_ELEMENT_COUNT:
                return "Harmony element count";
            case CountUnit.HARMONY_ELEMENT_MEASURES:
                return "Harmony element measures";
            case CountUnit.HARMONY_MEASURES:
                return "Harmony measures";
            case CountUnit.PHRASE_ELEMENT_COUNT:
                return "Phrase element count";
            case CountUnit.PLAIN_PLUS_HARMONY_BEATS:
                return "Plain + Harmony beats";
            case CountUnit.PLAIN_PLUS_HARMONY_ELEMENT_BEATS:
                return "Plain + Harmony element beats";
            case CountUnit.PLAIN_PLUS_HARMONY_ELEMENT_COUNT:
                return "Plain + Harmony element count";
            case CountUnit.PLAIN_PLUS_HARMONY_ELEMENT_MEASURES:
                return "Plain + Harmony element measures";
            case CountUnit.PLAIN_PLUS_HARMONY_MEASURES:
                return "Plain + Harmony measures";
        }
        return "Unknown count unit " + unit;
    },

    getCount: function(count, unit, harmony, harmonyBeatOffset) {
        switch (unit) {
            case CountUnit.PLAIN:
                return count;
            case CountUnit.HARMONY_ELEMENT_COUNT:
                return harmony.getCount() * count;
            case CountUnit.HARMONY_BEATS:
                var beats = 0;
                for (var i=0; i<harmony.getCount(); i++) {
                    var he = harmony.get(i);
                    beats += positionUnitToBeats(he.length, he.lengthUnit, he.tsNumerator, he.tsDenominator, null);
                }
                return beats * count;
            case CountUnit.HARMONY_ELEMENT_BEATS:
                var harmonyIndex = harmony.getHarmonyIndexAt(harmonyBeatOffset);
                var he = harmony.get(harmonyIndex);
                return count * positionUnitToBeats(he.length, he.lengthUnit, he.tsNumerator, he.tsDenominator, null);
            case CountUnit.HARMONY_ELEMENT_MEASURES:
                var harmonyIndex = harmony.getHarmonyIndexAt(harmonyBeatOffset);
                var he = harmony.get(harmonyIndex);
                var beats = positionUnitToBeats(he.length, he.lengthUnit, he.tsNumerator, he.tsDenominator, null);
                return count * (beats / he.tsNumerator);
            case CountUnit.HARMONY_MEASURES:
                var measures = 0;
                for (var i=0; i<harmony.getCount(); i++) {
                    var he = harmony.get(i);
                    var beats = positionUnitToBeats(he.length, he.lengthUnit, he.tsNumerator, he.tsDenominator, null);
                    measures += (beats / he.tsNumerator);
                }
                return measures * count;

            case CountUnit.PHRASE_ELEMENT_COUNT:
                var range = harmony.getPhraseRangeAt(harmonyBeatOffset);
                return count * (range[1] - range[0] + 1);
            case CountUnit.PLAIN_PLUS_HARMONY_ELEMENT_COUNT:
                return harmony.getCount() + count;
            case CountUnit.PLAIN_PLUS_HARMONY_BEATS:
                var beats = 0;
                for (var i=0; i<harmony.getCount(); i++) {
                    var he = harmony.get(i);
                    beats += positionUnitToBeats(he.length, he.lengthUnit, he.tsNumerator, he.tsDenominator, null);
                }
                return beats + count;
            case CountUnit.PLAIN_PLUS_HARMONY_ELEMENT_BEATS:
                var harmonyIndex = harmony.getHarmonyIndexAt(harmonyBeatOffset);
                var he = harmony.get(harmonyIndex);
                return count + positionUnitToBeats(he.length, he.lengthUnit, he.tsNumerator, he.tsDenominator, null);
            case CountUnit.PLAIN_PLUS_HARMONY_ELEMENT_MEASURES:
                var harmonyIndex = harmony.getHarmonyIndexAt(harmonyBeatOffset);
                var he = harmony.get(harmonyIndex);
                var beats = positionUnitToBeats(he.length, he.lengthUnit, he.tsNumerator, he.tsDenominator, null);
                return beats / he.tsNumerator + count;
            case CountUnit.PLAIN_PLUS_HARMONY_MEASURES:
                var measures = 0;
                for (var i=0; i<harmony.getCount(); i++) {
                    var he = harmony.get(i);
                    var beats = positionUnitToBeats(he.length, he.lengthUnit, he.tsNumerator, he.tsDenominator, null);
                    measures += (beats / he.tsNumerator);
                }
                return measures + count;
        }
        return count;
    }
};
addPossibleValuesFunction(CountUnit, CountUnit.PLAIN, CountUnit.PLAIN_PLUS_HARMONY_ELEMENT_COUNT);


var PositionUnit = {
    MEASURES: 0,
    BEATS: 1,
    WHOLE_NOTES: 2,
    HALF_NOTES: 3,
    QUARTER_NOTES: 4,
    EIGHTH_NOTES: 5,
    SIXTEENTH_NOTES: 6,
    BEATS_PLUS_MEASURE: 7,
    BEAT_THIRDS: 8,
    BEAT_FOURTHS: 9,
    BEAT_FIFTHS: 10,
    BEAT_SIXTHS: 11,
    BEAT_SEVENTHS: 12,
    BEAT_EIGHTHS: 13,
    BEAT_NINTHS: 14,
    HARMONY_INDEX: 15,
    HARMONY: 16,
    BEATS_PLUS_HARMONY: 17,
    BEATS_PLUS_HARMONY_ELEMENT: 18,
    HARMONY_ELEMENTS: 19,
    PHRASE: 20,
    // Add MEASURE_THIRDS/FOURTHS/FIFTHS/SIXTHS/SEVENTHS/EIGHTHS/NINTHS

    toString: function(unit) {
        switch (unit) {
            case PositionUnit.BEATS:
                return "Beats";
            case PositionUnit.BEATS_PLUS_MEASURE:
                return "Beats plus one measure";
            case PositionUnit.BEATS_PLUS_HARMONY:
                return "Beats plus harmony length";
            case PositionUnit.BEATS_PLUS_HARMONY_ELEMENT:
                return "Beats plus harmony element length";
            case PositionUnit.BEAT_EIGHTHS:
                return "Beat eighths";
            case PositionUnit.BEAT_FIFTHS:
                return "Beat fifths";
            case PositionUnit.BEAT_FOURTHS:
                return "Beat fourths";
            case PositionUnit.BEAT_NINTHS:
                return "Beat ninths";
            case PositionUnit.BEAT_SEVENTHS:
                return "Beat sevenths";
            case PositionUnit.BEAT_SIXTHS:
                return "Beat sixths";
            case PositionUnit.BEAT_THIRDS:
                return "Beat thirds";
            case PositionUnit.EIGHTH_NOTES:
                return "Eighth notes";
            case PositionUnit.HALF_NOTES:
                return "Half notes";
            case PositionUnit.MEASURES:
                return "Measures";
            case PositionUnit.QUARTER_NOTES:
                return "Quarter notes";
            case PositionUnit.SIXTEENTH_NOTES:
                return "Sixteenth notes";
            case PositionUnit.WHOLE_NOTES:
                return "Whole notes";
            case PositionUnit.HARMONY_INDEX:
                return "Harmony index";
            case PositionUnit.HARMONY:
                return "Harmony";
            case PositionUnit.HARMONY_ELEMENTS:
                return "Harmony elements";
            case PositionUnit.PHRASE:
                return "Phrase";
        }
        return "Unknown position unit " + unit;
    }
};
addPossibleValuesFunction(PositionUnit, PositionUnit.MEASURES, PositionUnit.PHRASE);


function positionUnitToBeats2(length, unit, harmonyBeatOffset, harmony) {
    var harmonyIndex = harmony.getHarmonyIndexAt(harmonyBeatOffset);

    var harmonyElement = harmony.get(harmonyIndex);

    // Find the phrase index range
    var phraseStartIndex = 0;
    for (var i=harmonyIndex; i>=0; i--) {
        var he = harmony.get(i);
        if (he.startsPhrase) {
            phraseStartIndex = i;
            break;
        }
    }
    var phraseEndIndex = harmony.getCount();
    for (var i=harmonyIndex; i<harmony.getCount(); i++) {
        var he = harmony.get(i);
        if (he.startsPhrase) {
            phraseEndIndex = Math.max(i - 1, harmonyIndex);
            break;
        }
    }

    return positionUnitToBeats(length, unit, harmonyElement.tsNumerator, harmonyElement.tsDenominator, harmony, harmonyElement,
        [phraseStartIndex, phraseEndIndex]);
}


function positionUnitToBeats(length, unit, numerator, denominator, harmony, harmonyElement, phraseIndexRange) {
    var multiplier = 1.0;
    switch (denominator) {
        case 2:
            multiplier = 0.5;
            break;
        case 4:
            multiplier = 1.0;
            break;
        case 8:
            multiplier = 2.0;
            break;
    }

    switch (unit) {
        case PositionUnit.BEATS:
            return length;
        case PositionUnit.BEAT_THIRDS:
            return length / 3.0;
        case PositionUnit.BEAT_FOURTHS:
            return length / 4.0;
        case PositionUnit.BEAT_FIFTHS:
            return length / 5.0;
        case PositionUnit.BEAT_SIXTHS:
            return length / 6.0;
        case PositionUnit.BEAT_SEVENTHS:
            return length / 7.0;
        case PositionUnit.BEAT_EIGHTHS:
            return length / 8.0;
        case PositionUnit.BEAT_NINTHS:
            return length / 9.0;
        case PositionUnit.QUARTER_NOTES:
            return multiplier * length;
        case PositionUnit.EIGHTH_NOTES:
            return multiplier * 0.5 * length;
        case PositionUnit.HALF_NOTES:
            return multiplier * 2.0 * length;
        case PositionUnit.MEASURES:
            return numerator * length;
        case PositionUnit.SIXTEENTH_NOTES:
            return multiplier * 0.25 * length;
        case PositionUnit.WHOLE_NOTES:
            return multiplier * 4 * length;
        case PositionUnit.BEATS_PLUS_MEASURE:
            return numerator + length;
        case PositionUnit.HARMONY:
            if (harmony) {
                return length * harmony.getBeatLength();
            } else {
                return length * numerator;
            }
        case PositionUnit.HARMONY_ELEMENTS:
            if (harmonyElement) {
                return length * positionUnitToBeats(harmonyElement.length, harmonyElement.lengthUnit, numerator, denominator);
            } else {
                return length * numerator;
            }
        case PositionUnit.BEATS_PLUS_HARMONY_ELEMENT:
            if (harmonyElement) {
                return length + positionUnitToBeats(harmonyElement.length, harmonyElement.lengthUnit, numerator, denominator);
            } else {
                return numerator + length;
            }
        case PositionUnit.BEATS_PLUS_HARMONY:
            if (harmony) {
                return length + harmony.getBeatLength();
            } else {
                return numerator + length;
            }
        case PositionUnit.HARMONY_INDEX:
            if (harmony) {
                var intLength = Math.floor(length);

                var frac = length - intLength;
                var currentBeat = 0;
                var lastExisting = null;
                for (var i = 0; i<intLength; i++) {
                    var he = harmony.get(i);
                    if (he) {
                        currentBeat += positionUnitToBeats(he.length, he.lengthUnit, he.tsNumerator, he.tsDenominator, null);
                        lastExisting = he;
                    }
                }
                var last = harmony.get(intLength);
                if (!last) {
                    last = lastExisting;
                }
                if (last) {
                    currentBeat += positionUnitToBeats(last.length * frac, last.lengthUnit, last.tsNumerator, last.tsDenominator, null);
                }
                return currentBeat;
            } else {
                return positionUnitToBeats(length, PositionUnit.MEASURES, numerator, denominator, harmony);
            }
            break;
        case PositionUnit.PHRASE:
            if (harmony) {
                if (phraseIndexRange) {
                    var phraseBeatLength = 0;
                    for (var i=phraseIndexRange[0]; i<=phraseIndexRange[1]; i++) {
                        if (i >= 0 && i < harmony.getCount()) {
                            phraseBeatLength += harmony.get(i).getBeatLength();
                        }
                    }
                    return length * phraseBeatLength;
                } else {
                    return length * harmony.getBeatLength();
                }
            } else {
                return length * numerator;
            }
            break;
    }

    return length;
}


var PhraseHarmonyElementType = {
    COMPLETE: 0,
    COMPLETE_IMPERFECT: 1,
    INCOMPLETE: 2,
    DECEPTIVE: 3,
    ANTECEDENT_CONSEQUENT: 4,
    PROLONGED_TONIC: 5,
    PROLONGED_TONIC_INCOMPLETE: 6,
    PROLONGED_TONIC_COMPLETE: 7,
    PROLONGED_TONIC_COMPLETE_IMPERFECT: 8,
    COMPLETE_MODULATE: 9,
    CONSEQUENT: 10,
    COMPLETE_MODULATE_IMPERFECT: 11,
    INCOMPLETE_INITIAL: 12,
    PROLONGED_DOMINANT: 13,
    PROLONGED_DOMINANT_CADENCE: 14,
    COMPLETE_PLAGIAL: 15,
    CHROMATIC_TRANSITION_INCOMPLETE: 16,
    CHROMATIC_TRANSITION_COMPLETE: 17,
    CHROMATIC_TRANSITION_MODULATE: 18,
    CHROMATIC_TRANSITION_TONICIZE: 19,
    COMPLETE_TONICIZE: 20,
    COMPLETE_TONICIZE_IMPERFECT: 21,
    COMPLETE_LENGTHEN_FINAL_TONIC: 22,
    COMPLETE_LENGTHEN_DOMINANT: 23,
    INCOMPLETE_NO_DOMINANT: 24,
    CHROMATIC_OSCILLATION: 25,

    toString: function(type) {
        switch (type) {
            case PhraseHarmonyElementType.CHROMATIC_OSCILLATION:
                return "Chromatic oscillation";
            case PhraseHarmonyElementType.INCOMPLETE_NO_DOMINANT:
                return "Incomplete no dominant";
            case PhraseHarmonyElementType.COMPLETE_TONICIZE:
                return "Complete tonicize";
            case PhraseHarmonyElementType.COMPLETE_LENGTHEN_FINAL_TONIC:
                return "Complete lengthen final tonic";
            case PhraseHarmonyElementType.COMPLETE_LENGTHEN_DOMINANT:
                return "Complete lengthen cadence dominant";
            case PhraseHarmonyElementType.COMPLETE_TONICIZE_IMPERFECT:
                return "Complete tonicize imperfect";
            case PhraseHarmonyElementType.CHROMATIC_TRANSITION_MODULATE:
                return "Chromatic transition modulate";
            case PhraseHarmonyElementType.CHROMATIC_TRANSITION_TONICIZE:
                return "Chromatic transition tonicize";
            case PhraseHarmonyElementType.CHROMATIC_TRANSITION_INCOMPLETE:
                return "Chromatic transition incomplete";
            case PhraseHarmonyElementType.CHROMATIC_TRANSITION_COMPLETE:
                return "Chromatic transition complete";
            case PhraseHarmonyElementType.ANTECEDENT_CONSEQUENT:
                return "Antecedent consequent";
            case PhraseHarmonyElementType.COMPLETE:
                return "Complete";
            case PhraseHarmonyElementType.COMPLETE_IMPERFECT:
                return "Complete imperfect";
            case PhraseHarmonyElementType.INCOMPLETE:
                return "Incomplete";
            case PhraseHarmonyElementType.INCOMPLETE_INITIAL:
                return "Incomplete initial";
            case PhraseHarmonyElementType.DECEPTIVE:
                return "Deceptive";
            case PhraseHarmonyElementType.PROLONGED_TONIC:
                return "Prolonged tonic";
            case PhraseHarmonyElementType.PROLONGED_TONIC_COMPLETE:
                return "Prolonged tonic complete";
            case PhraseHarmonyElementType.PROLONGED_TONIC_COMPLETE_IMPERFECT:
                return "Prolonged tonic imperfect";
            case PhraseHarmonyElementType.PROLONGED_TONIC_INCOMPLETE:
                return "Prolonged tonic incomplete";
            case PhraseHarmonyElementType.COMPLETE_MODULATE:
                return "Complete modulate";
            case PhraseHarmonyElementType.COMPLETE_MODULATE_IMPERFECT:
                return "Complete modulate imperfect";
            case PhraseHarmonyElementType.CONSEQUENT:
                return "Consequent";
            case PhraseHarmonyElementType.PROLONGED_DOMINANT:
                return "Prolonged dominant";
            case PhraseHarmonyElementType.PROLONGED_DOMINANT_CADENCE:
                return "Prolonged dominant cadence";
            case PhraseHarmonyElementType.COMPLETE_PLAGIAL:
                return "Complete plagial";
        }
        return "Unknown phrase harmony element type " + type;
    }

};
addPossibleValuesFunction(PhraseHarmonyElementType, PhraseHarmonyElementType.COMPLETE, PhraseHarmonyElementType.CHROMATIC_OSCILLATION);
