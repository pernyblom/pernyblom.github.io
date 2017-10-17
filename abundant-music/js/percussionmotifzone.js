
function PercussionMotifZone() {
    AbstractZone.call(this);
    this.activated = true;

    this._constructorName = "PercussionMotifZone";
}

PercussionMotifZone.prototype = new AbstractZone();


function VersatilePercussionMotifZone() {
    PercussionMotifZone.call(this);

    this.useNamedNotes = true;

    this.namedNotes = [];
    this.notes = [];

    this.noteIndexPattern = [[0]];
    this.startNoteIndexPattern = [];
    this.endNoteIndexPattern = [];

    this.positionOffsetPattern = [[0]];
    this.startPositionOffsetPattern = [];
    this.endPositionOffsetPattern = [];
    this.positionOffsetUnit = PositionUnit.BEATS;

    // (currentBeat * multiplier + bias) / divisorBeats
    this.beatConditionMultiplier = 1;
    this.beatConditionBias = 0;
    this.beatConditionDivisorCheck = 1;
    this.beatConditionDivisorCheckUnit = PositionUnit.MEASURES;
    this.beatConditionMaxRelativeDistance = 0.01;
    this.beatConditionQuotients = [];
    this.beatConditionRemainders = [];
    this.beatConditionQuotientStrengths = [1.0];
    this.beatConditionRemainderStrengths = [1.0];

    this._constructorName = "VersatilePercussionMotifZone";
}

VersatilePercussionMotifZone.prototype = new PercussionMotifZone();


VersatilePercussionMotifZone.prototype.getPercussionMotifElements = function(module, noteRythmElements,
                                                                             harmony, harmonyBeatOffset) {
    var result = [];

    var activated = getValueOrExpressionValue(this, "activated", module);

    var currentBeat = 0;

    var activeElements = [];
    var elementStartBeats = [];
    var elementBeatLengths = [];
    var elementHarmonies = [];
    var elementStrengths = [];

    var missingBeatCondition = this.beatConditionQuotients.length == 0 && this.beatConditionRemainders.length == 0;

//    logit(" Entering " + this._constructorName);


    for (var i=0; i<noteRythmElements.length; i++) {
        var he = harmony.getHarmonyAt(currentBeat + harmonyBeatOffset);

        var nre = noteRythmElements[i];
        var beatLength = positionUnitToBeats(nre.length, nre.lengthUnit, he.tsNumerator, he.tsDenominator, harmony);

        var ok = activated;

        var strength = nre.strength;

        if (!missingBeatCondition) {
            ok = false;

            var beatDivisor = positionUnitToBeats(this.beatConditionDivisorCheck, this.beatConditionDivisorCheckUnit,
                he.tsNumerator, he.tsDenominator, harmony);

            var beatCheck = currentBeat * this.beatConditionMultiplier + this.beatConditionBias;
            var quotient = beatCheck / beatDivisor;
            var remainder = mod(beatCheck, beatDivisor);


            for (var j=0; j<this.beatConditionQuotients.length; j++) {
                var q = this.beatConditionQuotients[j];
                if (Math.abs(q - quotient) <= this.beatConditionMaxRelativeDistance) {
                    ok = activated;
                    if (this.beatConditionQuotientStrengths.length > 0) {
                        strength *= this.beatConditionQuotientStrengths[j % this.beatConditionQuotientStrengths.length];
                    }
                    break;
                }
            }
            for (var j=0; j<this.beatConditionRemainders.length; j++) {
                var r = this.beatConditionRemainders[j];
                if (Math.abs(r - remainder) <= this.beatConditionMaxRelativeDistance) {
                    ok = activated;
                    if (this.beatConditionRemainderStrengths.length > 0) {
                        strength *= this.beatConditionRemainderStrengths[j % this.beatConditionRemainderStrengths.length];
                    }
                    break;
                }
            }
//            logit(i + " div: " + beatDivisor + " check " + beatCheck + " q: " + quotient + " r: " + remainder + " qs: " +
//                JSON.stringify(this.beatConditionQuotients) + " rs: " + JSON.stringify(this.beatConditionRemainders) + " ok: " + ok);
        }

        if (ok) {
            activeElements.push(nre);
            elementStartBeats.push(currentBeat);
            elementBeatLengths.push(beatLength);
            elementHarmonies.push(he);
            elementStrengths.push(strength);
        }
        currentBeat += beatLength;
    }

    var maxRythmEndTime = currentBeat;
    var maxActiveEndTime = 0;

    for (var i=0; i<activeElements.length; i++) {

        var noteIndices = getItemFromArrayWithStartEndItems([], this.noteIndexPattern,
            activeElements.length, i, this.startNoteIndexPattern, this.endNoteIndexPattern);

        var positionOffsets = getItemFromArrayWithStartEndItems([], this.positionOffsetPattern,
            activeElements.length, i, this.startPositionOffsetPattern, this.endPositionOffsetPattern);

        if (positionOffsets.length == 0) {
            positionOffsets = [0];
        }

        var he = elementHarmonies[i];
        for (var j=0; j<noteIndices.length; j++) {
            var me = new PrimitivePercussionMotifElement();

            var posOffset = positionUnitToBeats(positionOffsets[j % positionOffsets.length],
                this.positionOffsetUnit, he.tsNumerator, he.tsDenominator, harmony);

            me.startTime = elementStartBeats[i] + posOffset;
            me.startTimeUnit = PositionUnit.BEATS;

            me.length = elementBeatLengths[i];
            me.lengthUnit = PositionUnit.BEATS;
            me.rest = nre.rest;
            me.strength = elementStrengths[i];

            var note = MidiDrum.BASS_DRUM_1;
            if (this.useNamedNotes) {
                if (this.namedNotes.length > 0) {
                    var noteName = this.namedNotes[noteIndices[j] % this.namedNotes.length];

                    var namedNote = module.getNamedNote(noteName);
                    if (namedNote) {
                        note = namedNote.note;
                    }
                }
            } else {
                if (this.notes.length > 0) {
                    note = this.notes[noteIndices[j] % this.notes.length];
                }
            }

            maxActiveEndTime = Math.max(maxActiveEndTime, me.startTime + me.length);
            me.note = note;
            result.push(me);
        }
    }

    if (maxActiveEndTime < maxRythmEndTime) {
        var me = new PrimitivePercussionMotifElement();

        me.startTime = maxActiveEndTime;
        me.startTimeUnit = PositionUnit.BEATS;

        me.length = maxRythmEndTime - maxActiveEndTime;
        me.lengthUnit = PositionUnit.BEATS;
        me.rest = true;
        result.push(me);
//        logit(this._constructorName + " adding a final rest at: " + me.startTime + " l: " + me.length);
    }

//    logit(result);
    return result;
};

