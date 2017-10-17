function AbstractZone() {
    this.id = "";
    this.start = 0.0;
    this.end = 1.0;
    this.positionUnit = PositionUnit.MEASURES;
    this.useLengthRange = false;
    this.lengthRange = [0, 1];
    this.lengthRangeUnit = PositionUnit.MEASURES;

    this._constructorName = "AbstractZone";
}

AbstractZone.prototype.convertLengthRange = function(startBeat, endBeat, harmony, harmonyBeatOffset) {
    var minLengthBeats = positionUnitToBeats2(this.lengthRange[0], this.lengthRangeUnit, harmonyBeatOffset, harmony);
    var maxLengthBeats = positionUnitToBeats2(this.lengthRange[1], this.lengthRangeUnit, harmonyBeatOffset, harmony);
    var beatLength = endBeat - startBeat;
    beatLength = clamp(beatLength, minLengthBeats, maxLengthBeats);
    return startBeat + beatLength;
};

AbstractZone.prototype.containsPosition = function(pos, harmony, harmonyBeatOffset) {
    var startBeat = positionUnitToBeats2(this.start, this.positionUnit, harmonyBeatOffset, harmony);
    var endBeat = positionUnitToBeats2(this.end, this.positionUnit, harmonyBeatOffset, harmony);

    if (this.useLengthRange) {
        endBeat = this.convertLengthRange(startBeat, endBeat, harmony, harmonyBeatOffset);
//        var minLengthBeats = positionUnitToBeats2(this.lengthRange[0], this.lengthRangeUnit, harmonyBeatOffset, harmony);
//        var maxLengthBeats = positionUnitToBeats2(this.lengthRange[1], this.lengthRangeUnit, harmonyBeatOffset, harmony);
//        var beatLength = endBeat - startBeat;
//        beatLength = clamp(beatLength, minLengthBeats, maxLengthBeats);
//        endBeat = startBeat + beatLength;
    }
    //    if (this.positionUnit == PositionUnit.HARMONY_ELEMENTS) {
    //        logit("startBeat: " + startBeat + " endBeat: " + endBeat + " pos: " + pos + "<br />");
    //    }
    return pos >= startBeat && pos < endBeat;
};

AbstractZone.prototype.intersectsRange = function(posRange, harmony, harmonyBeatOffset) {
    var startBeat = positionUnitToBeats2(this.start, this.positionUnit, harmonyBeatOffset, harmony);
    var endBeat = positionUnitToBeats2(this.end, this.positionUnit, harmonyBeatOffset, harmony);

    if (this.useLengthRange) {
        endBeat = this.convertLengthRange(startBeat, endBeat, harmony, harmonyBeatOffset);
    }
    return intervalIntersect(posRange, [startBeat, endBeat]);
};





var MotifZoneFillerLengthMode = {
    ABSOLUTE: 0,
    RELATIVE_MULT: 1,
    RELATIVE_ADD: 2,

    toString: function(type) {
        switch (type) {
            case MotifZoneFillerLengthMode.ABSOLUTE:
                return "Absolute";
            case MotifZoneFillerLengthMode.RELATIVE_ADD:
                return "Relative add";
            case MotifZoneFillerLengthMode.RELATIVE_MULT:
                return "Relative mult";
        }
        return "Unknown length mode " + type;
    }
};
addPossibleValuesFunction(MotifZoneFillerLengthMode, MotifZoneFillerLengthMode.ABSOLUTE, MotifZoneFillerLengthMode.RELATIVE_ADD);


function MotifZone() {
    AbstractZone.call(this);

    this.useNoteRangeIfEmpty = false;

    this.fillerOffsets = []; // [[1, 2, 3], []];
    this.fillerOffsetTypes = [OffsetType.CHORD];
    this.fillerOnOffs = [1];
    this.fillerSnapTypes = [SnapType.NONE];
    this.fillerIndexBorderMode = IndexBorderMode.CLAMP;
    this.fillerLengthModes = [MotifZoneFillerLengthMode.RELATIVE_ADD];
    this.fillerRelativeLengths = [[0.0]];
    this.fillerLengths = [[1]];
    this.fillerLengthUnits = [PositionUnit.BEATS];
    this.fillerPositionOffsets = [[0.0]]; // [[0.1, 0.2, 0.3]];
    this.fillerPositionOffsetUnits = [PositionUnit.BEATS];
    this.fillerRelativeTypes = [VerticalRelativeType.NOTE];
    this.fillerRelativeStrengths = [[1]];

    this._constructorName = "MotifZone";
}

MotifZone.prototype = new AbstractZone();

MotifZone.prototype.addFillers = function(index, motifNote, module) {

    var fillerOffsets = getValueOrExpressionValue(this, "fillerOffsets", module);
    var offsetIndex = IndexBorderMode.getIndex(this.fillerIndexBorderMode, fillerOffsets.length, index);
    if (offsetIndex >= 0) {
        var offsetArr = fillerOffsets[offsetIndex];
        var onOff = this.fillerOnOffs[offsetIndex % this.fillerOnOffs.length];
        if (onOff == 0) {
            return;
        }
        var lengthMode = this.fillerLengthModes[offsetIndex % this.fillerLengthModes.length];
        var relativeLengthArr = this.fillerRelativeLengths[offsetIndex % this.fillerRelativeLengths.length];
        var relativeStrengthArr = this.fillerRelativeStrengths[offsetIndex % this.fillerRelativeStrengths.length];
        var lengthArr = this.fillerLengths[offsetIndex % this.fillerLengths.length];
        var lengthUnit = this.fillerLengthUnits[offsetIndex % this.fillerLengthUnits.length];
        var positionOffsetArr = this.fillerPositionOffsets[offsetIndex % this.fillerPositionOffsets.length];
        var positionOffsetUnit = this.fillerPositionOffsetUnits[offsetIndex % this.fillerPositionOffsetUnits.length];
        var relativeType = this.fillerRelativeTypes[offsetIndex % this.fillerRelativeTypes.length];
        var offsetType = this.fillerOffsetTypes[offsetIndex % this.fillerOffsetTypes.length];
        var snapType = this.fillerSnapTypes[offsetIndex % this.fillerSnapTypes.length];


        for (var i=0; i<offsetArr.length; i++) {
            var offset = offsetArr[i];
            var positionOffset = positionOffsetArr[i % positionOffsetArr.length];
            var note = new FillerNote();

            note.offset = offset;
            note.offsetType = offsetType;
            note.snapType = snapType;
            note.relativeType = relativeType;
            note.positionOffset = positionOffset;
            note.positionOffsetUnit = positionOffsetUnit;

            var relativeLength = relativeLengthArr[i % relativeLengthArr.length];
            var relativeStrength = relativeStrengthArr[i % relativeStrengthArr.length];

            note.strength = motifNote.strength * relativeStrength;

            switch (lengthMode) {
                case MotifZoneFillerLengthMode.ABSOLUTE:
                    note.length = lengthArr[i % lengthArr.length];
                    note.lengthUnit = lengthUnit;
                    break;
                case MotifZoneFillerLengthMode.RELATIVE_ADD:
                    note.length = motifNote.length + relativeLength;
                    note.lengthUnit = motifNote.lengthUnit;
                    break;
                case MotifZoneFillerLengthMode.RELATIVE_MULT:
                    note.length = motifNote.length * relativeLength;
                    note.lengthUnit = motifNote.lengthUnit;
                    break;
            }

            motifNote.addFiller(note);
        }
    }
};


MotifZone.prototype.applyMotifZone = function(elements, module) {
    logit("MotifZone must implement applyMotifZone()<br />");
    return null;
};

// Creates a region of VerticalRelativeMotifElements
function SimpleVerticalRelativeMotifZone() {
    MotifZone.call(this);
    this.indices = [0];
    this.indexBorderMode = IndexBorderMode.END;
    this.relativeType = VerticalRelativeType.VOICE_LINE;
    this.offsetType = OffsetType.SCALE;
    this.beforeOffsetSnapType = SnapType.NONE;
    this.afterOffsetSnapType = SnapType.NONE;
    this._constructorName = "SimpleVerticalRelativeMotifZone";
}

SimpleVerticalRelativeMotifZone.prototype = new MotifZone();

SimpleVerticalRelativeMotifZone.prototype.applyMotifZone = function(elements, module) {
    var result = [];
    var noteIndex = 0;
    for (var i=0; i<elements.length; i++) {
        var e = elements[i];

        var me = new VerticalRelativeMotifElement();
        me.length = e.length;
        me.lengthUnit = e.lengthUnit;
        me.rest = e.rest;
        me.strength = e.strength;

        var index = 0;
        if (this.indices.length > 0) {
            index = IndexBorderMode.getIndex(this.indexBorderMode, this.indices.length, i);
        }
        //        logit("___Index into indices " + index + "<br />");
        if (index >= 0) {
            me.index = this.indices.length > 0 ? this.indices[index] : 0;
            me.relativeType = this.relativeType;
            me.offsetType = this.offsetType;
            me.beforeOffsetSnapType = this.beforeOffsetSnapType;
            me.afterOffsetSnapType = this.afterOffsetSnapType;
        } else {
            // Add a rest instead
            me.rest = true;
        }
        //        logit("zone Creating vrme " + me + " rythm element length: " + e.length + "<br />");

        result.push(me);
        if (!me.rest) {
            this.addFillers(noteIndex, me, module);
            noteIndex++;
        }
    }
    return result;
};


function SimpleHorizontalRelativeMotifZone() {
    MotifZone.call(this);
    this.indices = [0];
    this.indexBorderMode = IndexBorderMode.END;
    this.relativeType = HorizontalRelativeType.NEXT_NOTE;
    this.offsetType = OffsetType.SCALE;
    this.beforeOffsetSnapType = SnapType.NONE;
    this.afterOffsetSnapType = SnapType.NONE;
    this._constructorName = "SimpleHorizontalRelativeMotifZone";
}


SimpleHorizontalRelativeMotifZone.prototype = new MotifZone();

SimpleHorizontalRelativeMotifZone.prototype.applyMotifZone = function(elements) {
    var result = [];
    for (var i=0; i<elements.length; i++) {
        var e = elements[i];

        var me = new HorizontalRelativeMotifElement();
        me.length = e.length;
        me.lengthUnit = e.lengthUnit;
        me.rest = e.rest;
        me.strength = e.strength;

        var index = 0;
        if (this.indices.length > 0) {
            index = IndexBorderMode.getIndex(this.indexBorderMode, this.indices.length, i);
        }
        //        logit("___Index into indices " + index + "<br />");
        if (index >= 0) {
            me.index = this.indices.length > 0 ? this.indices[index] : 0;
            me.relativeType = this.relativeType;
            me.offsetType = this.offsetType;
            me.beforeOffsetSnapType = this.beforeOffsetSnapType;
            me.afterOffsetSnapType = this.afterOffsetSnapType;
        } else {
            // Add a rest instead
            me.rest = true;
        }
        //        logit("zone Creating vrme " + me + " rythm element length: " + e.length + "<br />");

        result.push(me);
    }
    return result;
};




function AdaptiveConnectMotifZone() {
    MotifZone.call(this);
    this.firstPartOfChord = false; // Can be used for approach stuff
    this.firstConnectToPrevious = true;
    this.lastConnectToNext = true;
    this.horizontalOffsets = [-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
    this.horizontalLikelihoods = [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 1, 0.01, 1, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01];

    this.firstToPreviousHorizontalOffsets = [-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
    this.firstToPreviousHorizontalLikelihoods = [0.025, 0.025, 0.025, 0.05, 0.05, 0.1, 1, 0.2, 1, 0.1, 0.05, 0.05, 0.025, 0.025, 0.025];

    this.lastToNextHorizontalOffsets = [-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7];
    this.lastToNextHorizontalLikelihoods = [0.00005, 0.00005, 0.00005, 0.0001, 0.001, 0.01, 1, 0.01, 1, 0.01, 0.001, 0.0001, 0.00005, 0.00005, 0.00005];
    this._constructorName = "AdaptiveConnectMotifZone";
}


AdaptiveConnectMotifZone.prototype = new MotifZone();

AdaptiveConnectMotifZone.prototype.applyMotifZone = function(elements, module) {
    var result = [];
    var addedFirst = false;
    var lastNonRest = null;
    for (var i=0; i<elements.length; i++) {
        var e = elements[i];

        var me = new AdaptiveMotifElement();
        me.length = e.length;
        me.lengthUnit = e.lengthUnit;
        me.rest = e.rest;
        me.strength = e.strength;
        //        me.verticalDomainType = AdaptiveVerticalDomainType.ENUMERABLE;
        me.horizontalDomainTypes = [AdaptiveHorizontalDomainType.ENUMERABLE];
        me.horizontalRelativeTypes = [HorizontalRelativeType.NEXT_NOTE];
        me.horizontalDomainOffsetTypes = [OffsetType.SCALE];

        me.verticalDomainOffsetRange = [-25, 25];
        me.verticalDomainOffsetElements = [-1, 0, 1];
        me.verticalDomainOffsetElementLikelihoods = [1, 1, 1];

        var offsets = this.horizontalOffsets;
        var likelihoods = this.horizontalLikelihoods;
        if (i == elements.length - 1 &&
            this.lastToNextHorizontalLikelihoods.length > 0 && this.lastToNextHorizontalOffsets.length > 0) {
            offsets = this.lastToNextHorizontalOffsets;
            likelihoods = this.lastToNextHorizontalLikelihoods;
        }
        me.horizontalDomainOffsetElements = [offsets];
        me.horizontalDomainOffsetLikelihoods = [likelihoods];
        if (!me.rest) {
            lastNonRest = me;
        }

        if (!addedFirst && !me.rest) {
            if (this.firstConnectToPrevious) {
                var offsets = this.horizontalOffsets;
                var likelihoods = this.horizontalLikelihoods;
                if (this.firstToPreviousHorizontalOffsets.length > 0 &&
                    this.firstToPreviousHorizontalLikelihoods.length > 0) {
                    offsets = this.firstToPreviousHorizontalOffsets;
                    likelihoods = this.firstToPreviousHorizontalLikelihoods;
                }
                me.horizontalDomainTypes.push(AdaptiveHorizontalDomainType.ENUMERABLE);
                me.horizontalRelativeTypes.push(HorizontalRelativeType.PREVIOUS_NOTE);
                me.horizontalDomainOffsetTypes.push(OffsetType.SCALE);
                me.horizontalDomainOffsetElements.push(offsets);
                me.horizontalDomainOffsetLikelihoods.push(likelihoods);
            }
            addedFirst = true;
        }
        result.push(me);
        if (!me.rest) {
            this.addFillers(i, me, module);
        }
    }
    return result;
};



function AdaptiveEmbellishMotifZone() {
    MotifZone.call(this);

    this.verticalIndices = [0]; // The center
    this.verticalOffsetDomains = [[-1, 0, 1]];
    this.verticalOffsetLikelihoods = [[1]];
    this.startVerticalIndices = [0]; // The center
    this.startVerticalOffsetDomains = [[0]];
    this.startVerticalOffsetLikelihoods = [[1]];
    this.endVerticalIndices = []; // The center
    this.endVerticalOffsetDomains = [];
    this.endVerticalOffsetLikelihoods = [];
    this.verticalDomainOffsetType = OffsetType.SCALE;

    this.verticalRelativeType = VerticalRelativeType.VOICE_LINE;
    
    this.constantVerticalOffset = 0;
    this.constantVerticalOffsetType = OffsetType.HALF_STEP;

    this.useHorizontalOffsets = true;
    this.useFirstHorizontalOffsets = true;
    this.useLastHorizontalOffsets = false;
    this.horizontalOffsets = [[-1, 0, 1]];
    this.horizontalLikelihoods = [[1, 0.001, 1]];
    this.startHorizontalOffsets = [];
    this.startHorizontalLikelihoods = [];
    this.endHorizontalOffsets = [];
    this.endHorizontalLikelihoods = [];
    this.horizontalDomainOffsetType = OffsetType.SCALE;

    this._constructorName = "AdaptiveEmbellishMotifZone";
}


AdaptiveEmbellishMotifZone.prototype = new MotifZone();

AdaptiveEmbellishMotifZone.prototype.applyMotifZone = function(elements, module) {
    var result = [];

    var nonRestElements = [];
    for (var i=0; i<elements.length; i++) {
        var e = elements[i];
        if (!e.rest) {
            nonRestElements.push(e);
        }
    }

    var nonRestCounter = 0;
    var nonRestsCount = nonRestElements.length;

    var theVerticalIndices = getValueOrExpressionValue(this, "verticalIndices", module);
    var theStartVerticalIndices = getValueOrExpressionValue(this, "startVerticalIndices", module);
    var theEndVerticalIndices = getValueOrExpressionValue(this, "endVerticalIndices", module);
    for (var i=0; i<elements.length; i++) {
        var e = elements[i];

        var me = new AdaptiveMotifElement();
        me.length = e.length;
        me.lengthUnit = e.lengthUnit;
        me.rest = e.rest;
        me.strength = e.strength;

        me.verticalDomainType = AdaptiveVerticalDomainType.ENUMERABLE;
        me.verticalDomainOffsetType = this.verticalDomainOffsetType;

        me.verticalRelativeType = this.verticalRelativeType;
        me.constantVerticalOffset = this.constantVerticalOffset;
        me.constantVerticalOffsetType = this.constantVerticalOffsetType;

        var doRender = true;
        if (theVerticalIndices.length == 0 && theStartVerticalIndices.length == 0 && theEndVerticalIndices.length == 0) {
            doRender = false;
            me.rest = true;
        }

        if (doRender && !me.rest) {
            var verticalIndex = getItemFromArrayWithStartEndItems(0, theVerticalIndices, nonRestsCount, nonRestCounter,
                theStartVerticalIndices, theEndVerticalIndices);
            var verticalOffsetDomain = getItemFromArrayWithStartEndItems(0, this.verticalOffsetDomains, nonRestsCount,
                nonRestCounter, this.startVerticalOffsetDomains, this.endVerticalOffsetDomains);
            var verticalOffsetLikelihoods = getItemFromArrayWithStartEndItems(0, this.verticalOffsetLikelihoods, nonRestsCount,
                nonRestCounter, this.startVerticalOffsetLikelihoods, this.endVerticalOffsetLikelihoods);

            var calculatedVerticalOffsetDomain = [];
            for (var j=0; j<verticalOffsetDomain.length; j++) {
                calculatedVerticalOffsetDomain[j] = verticalOffsetDomain[j] + verticalIndex;
            }

            me.verticalDomainOffsetElements = calculatedVerticalOffsetDomain;
            me.verticalDomainOffsetElementLikelihoods = verticalOffsetLikelihoods;
            me.horizontalRelativeTypes = [];

            if (this.useHorizontalOffsets &&
                (nonRestCounter != 0 || this.useFirstHorizontalOffsets) &&
                (nonRestCounter != nonRestsCount - 1 || this.useLastHorizontalOffsets)) {

                me.horizontalDomainTypes = [AdaptiveHorizontalDomainType.ENUMERABLE];
                me.horizontalRelativeTypes = [HorizontalRelativeType.NEXT_NOTE];
                me.horizontalDomainOffsetTypes = [OffsetType.SCALE];

                var horizontalOffsets = getItemFromArrayWithStartEndItems([-1, 0, 1], this.horizontalOffsets, nonRestsCount,
                    nonRestCounter, this.startHorizontalOffsets, this.endHorizontalOffsets);
                var horizontalLikelihoods = getItemFromArrayWithStartEndItems([1], this.horizontalLikelihoods, nonRestsCount,
                    nonRestCounter, this.startHorizontalLikelihoods, this.endHorizontalLikelihoods);

                me.horizontalDomainOffsetElements = [horizontalOffsets];
                me.horizontalDomainOffsetLikelihoods = [horizontalLikelihoods];
                me.horizontalDomainOffsetTypes = [this.horizontalDomainOffsetType];
            //                me.horizontalDomainOffsetRanges;
            }
            nonRestCounter++;
        }
        result.push(me);
        if (!me.rest) {
            this.addFillers(i, me, module);
        }
    }
    return result;
};


