

function RenderLine() {
    this.id = "renderLine";
    this.activated = true;
    this._constructorName = "RenderLine";
}

RenderLine.prototype.renderBatch = function(state) {
    var activated = getValueOrExpressionValue(this, "activated", state.module);
    if (activated) {
        var lines = this.getPrimitiveRenderLines(state.module, state.constantHarmony);

        // Insert render line planning here...

        var allElements = [];
        var allChannels = [];

        for (var j=0; j<lines.length; j++) {
            var renderLine = lines[j];
            var renderChannel = state.module.getRenderChannel(renderLine.channel);
            if (!renderChannel) {
                logit(" could not find render channel " + renderLine.channel);
                continue;
            }
            var elements = renderLine.getPositionedRenderElements(state.module, state.constantHarmony, 0, state);
            for (var i=0; i<elements.length; i++) {
                allChannels.push(renderChannel);
            }
            addAll(allElements, elements);
        }

        // Insert render element planning here...

        for (var i=0; i<allElements.length; i++) {
            var e = allElements[i];
            state.renderChannel = allChannels[i];
            e.renderBatch(state);
        }
    }
};


RenderLine.prototype.getPrimitiveRenderLines = function(module, harmony) {
    return [this];
};

RenderLine.prototype.getPositionedRenderElements = function(module, harmony, beatOffset, state) {
    var result = [];
    var activated = getValueOrExpressionValue(this, "activated", module);
    if (activated) {
        var lines = this.getPrimitiveRenderLines(module, harmony);
        for (var j=0; j<lines.length; j++) {
            var elements = lines[j].renderElements;
            for (var i=0; i<elements.length; i++) {
                var e = elements[i];
                var pe = e.getPositionedRenderElements(module, harmony, beatOffset, state);
                addAll(result, pe)
            }
        }
    }
    return result;
};



function PrimitiveRenderLine() {
    RenderLine.call(this);
    this.channel = "";
    this.renderElements = [];
    this._constructorName = "PrimitiveRenderLine";
}

PrimitiveRenderLine.prototype = new RenderLine();

PrimitiveRenderLine.prototype.addRenderElement = function(e) {
    this.renderElements.push(e);
    return this;
};


var RenderElementCutHarmonyMode = {
    //
    STOP: 0, // Stop rendering
    CONTINUE_ADAPT: 1, // Continue rendering
    CONTINUE_SAME: 2, // Continue rendering with the same harmony as the start
    toString: function(type) {
        switch (type) {
            case RenderElementCutHarmonyMode.STOP:
                return "Stop";
            case RenderElementCutHarmonyMode.CONTINUE_ADAPT:
                return "Continue adapt";
            case RenderElementCutHarmonyMode.CONTINUE_SAME:
                return "Continue same";
        }
        return "Unknown cut mode " + type;
    }

};
addPossibleValuesFunction(RenderElementCutHarmonyMode, RenderElementCutHarmonyMode.STOP, RenderElementCutHarmonyMode.CONTINUE_SAME);


var NoteOverlapHarmonyMode = {
    //
    SPLIT_REMOVE: 0, // Make the note shorter
    CONTINUE: 1, // Continue the note unchanged
    SPLIT_SNAP: 2, // Split the note and snap the rest of the note
    CONTINUE_OR_SPLIT_SNAP: 3, // Continue if the note is the same as before the snap
    toString: function(type) {
        switch (type) {
            case NoteOverlapHarmonyMode.CONTINUE:
                return "Continue";
            case NoteOverlapHarmonyMode.SPLIT_REMOVE:
                return "Split Remove";
            case NoteOverlapHarmonyMode.SPLIT_SNAP:
                return "Split Snap";
            case NoteOverlapHarmonyMode.CONTINUE_OR_SPLIT_SNAP:
                return "Continue or split snap";
        }
        return "Unknown overlap mode " + type;
    }
};
addPossibleValuesFunction(NoteOverlapHarmonyMode, NoteOverlapHarmonyMode.SPLIT_REMOVE, NoteOverlapHarmonyMode.CONTINUE_OR_SPLIT_SNAP);



function RenderElement() {
    this.id = "";
    this.channel = "";
    this.activated = true;

    this._constructorName = "RenderElement";
}

RenderElement.prototype.copy = function() {
    return copyObjectDeep(this, null);
};



RenderElement.prototype.getPositionedRenderElements = function(module, harmony, beatOffset, state) {
    var activated = getValueOrExpressionValue(this, "activated", module);
    if (activated) {
        if (this instanceof PositionedRenderElement) {
            if (beatOffset != 0) {
                var result = this.copy();
                if (result._constructorName == this._constructorName) {
                    var he = harmony.get(0);
                    result.startTime = positionUnitToBeats(result.startTime, result.startTimeUnit,
                        he.tsNumerator, he.tsDenominator, harmony) + beatOffset;
                    result.startTimeUnit = PositionUnit.BEATS;
                    return [result];
                } else {
                    logit("Probably missing copy() for " + this._constructorName + "<br />");
                }
            }
            return [this];
        } else {
            logit("Forgot to implement getPositionedRenderElements() in render element?")
        }
    } else {
        return [];
    }
};

RenderElement.prototype.renderBatch = function(state) {
    logit("Forgot to implement renderBatch() in render element? " + this._constructorName);
};




function PositionedRenderElement() {
    RenderElement.call(this);
    this.startTime = 0;
    this.startTimeUnit = PositionUnit.BEATS;

    this.maxLength = 1024;
    this.maxLengthUnit = PositionUnit.BEATS;

    this.renderOffset = 0; // An extra "write"-pointer offset that does not influence the harmony
    this.renderOffsetUnit = PositionUnit.BEATS;

    this._constructorName = "PositionedRenderElement";
}

PositionedRenderElement.prototype = new RenderElement();



function ZonesRenderElement() {
    PositionedRenderElement.call(this);

    this.useDefaultIfNoneApplicable = true;
    this.defaultZoneIndices = [0];
    this.zones = [];
    this._constructorName = "ZonesRenderElement";
};

ZonesRenderElement.prototype = new PositionedRenderElement();


ZonesRenderElement.prototype.getPositionedRenderElements = function(module, harmony, beatOffset, state) {
    var result = [];

    var activated = getValueOrExpressionValue(this, "activated", module);

    if (activated) {

        // Three possible ways to select zone:
        // * sample
        // * most specific
        // * first match
        var renderedMutexes = {};

        var renderedSomething = false;
        for (var i=0; i<this.zones.length; i++) {
            var z = this.zones[i];
            var mut = renderedMutexes[z.mutexClassIndex];
            if (!mut && z.applicable(module, harmony)) {
                var list = z.getPositionedRenderElements(module, harmony, beatOffset, state);
                addAll(result, list);
                renderedMutexes[z.mutexClassIndex] = true;
                renderedSomething = true;
                break;
            }
        }
        if (!renderedSomething && this.useDefaultIfNoneApplicable && this.zones.length > 0) {
            for (var i=0; i<this.defaultZoneIndices.length; i++) {
                var defaultZoneIndex = this.defaultZoneIndices[i];
                var z = this.zones[defaultZoneIndex % this.zones.length];
                var list = z.getPositionedRenderElements(module, harmony, beatOffset, state);
                addAll(result, list);
            }
        }
    }
    return result;
};

function RenderElementZone() {
    this.id = "";
    this.mutexClassIndex = 0; // Possible with more zones
    this._constructorName = "RenderElementZone";
}


RenderElementZone.prototype.applicable = function(module, harmony) {
    return true;
};

function HarmonyCountRenderElementZone() {
    RenderElementZone.call(this);

    this.onePerHarmonyIndex = false;

    this.harmonyCounts = [];
    this.harmonyCountDividers = [];

    this.renderElements = [];

    this._constructorName = "HarmonyCountRenderElementZone";
}
HarmonyCountRenderElementZone.prototype = new RenderElementZone();



HarmonyCountRenderElementZone.prototype.applicable = function(module, harmony) {
    var harmonyCount = harmony.getCount();

    for (var i=0; i<this.harmonyCounts.length; i++) {
        var count = this.harmonyCounts[i];
        if (count == harmonyCount) {
            return true;
        }
    }

    for (var i=0; i<this.harmonyCountDividers.length; i++) {
        var divider = this.harmonyCountDividers[i];
        if ((harmonyCount % divider) == 0) {
            return true;
        }
    }

    return false;
};

HarmonyCountRenderElementZone.prototype.getPositionedRenderElements = function(module, harmony, beatOffset, state) {
    var result = [];

    //    var startBeat = positionUnitToBeats(this.startTime, this.startTimeUnit, numerator, denominator, harmony);

    for (var i=0; i<this.renderElements.length; i++) {
        var re = this.renderElements[i];
        var currentBeat = beatOffset;
        if (this.onePerHarmonyIndex) {
            for (var j=0; j<harmony.getCount(); j++) {
                var list = re.getPositionedRenderElements(module, harmony, currentBeat, state);
                list = arrayCopyWithCopy(list);
                addAll(result, list);
                var he = harmony.get(j);
                currentBeat += positionUnitToBeats(he.length, he.lengthUnit, he.tsNumerator, he.tsDenominator, harmony);
            }
        } else {
            var list = re.getPositionedRenderElements(module, harmony, currentBeat, state);
            list = arrayCopyWithCopy(list);
            addAll(result, list);
        }
    }
    return result;
};


function PhraseStructureRenderElement() {
    PositionedRenderElement.call(this);

    this.renderElements = [];
    this.startRenderElements = [];
    this.endRenderElements = [];
    this._constructorName = "PhraseStructureRenderElement";
}
PhraseStructureRenderElement.prototype = new PositionedRenderElement();

PhraseStructureRenderElement.prototype.getPositionedRenderElements = function(module, harmony, beatOffset, state) {
    var result = [];

    var phraseRanges = harmony.getPhraseRanges();

//    if (this.verbose) {
//        logit(this._constructorName + " " + harmony.get(0).tsNumerator + " " + state.constantHarmony.get(0).tsNumerator);
//    }
    var currentBeat = beatOffset;
    // logit(this._constructorName + " Rending at phrase ranges " + JSON.stringify(phraseRanges) + " " + harmony.getBeatLength());
    for (var i=0; i<phraseRanges.length; i++) {
        var range = phraseRanges[i];

//        if (this.verbose) {
//            logit("Rending at phrase range " + JSON.stringify(range));
//        }
        var renderElement = getItemFromArrayWithStartEndItems(null, this.renderElements, phraseRanges.length, i, this.startRenderElements, this.endRenderElements);

        var phraseBeatLength = harmony.getPhraseRangeBeatLength(range);

        if (renderElement != null) {
            var copy = copyObjectDeep(renderElement);
            copy.maxLength = phraseBeatLength;
            var tempResult = copy.getPositionedRenderElements(module, harmony, currentBeat, state);
            addAll(result, tempResult);
        }

        currentBeat += phraseBeatLength;
    }
    return result;
};


// Renders a motif at every harmony element
function AbstractHarmonyIndexPatternMotifRenderElement() {
    PositionedRenderElement.call(this);

    this.useVoiceLine = true;

    // relativeType, offset and offsetType are used when useVoiceLine is false
    this.relativeType = VerticalRelativeType.SCALE_BASE;
    this.offsets = [0];
    this.offsetType = OffsetType.SCALE;
    this.startOffsets = [];
    this.endOffsets = [];

    this.count = 1;
    this.countUnit = CountUnit.HARMONY_ELEMENT_COUNT;

    this.clampAtHarmonyEnd = true;
    this.clampAtPhraseEnd = false;

    this.voiceLine = "";

    this.seeds = [12345];
    this.startSeeds = [];
    this.endSeeds = [];

    this.cutHarmonyMode = RenderElementCutHarmonyMode.STOP;
    this.noteOverlapHarmonyMode = NoteOverlapHarmonyMode.SPLIT_REMOVE;
    this.noteOverlapSnapType = SnapType.SCALE;

    this._constructorName = "AbstractHarmonyIndexPatternMotifRenderElement";

}
AbstractHarmonyIndexPatternMotifRenderElement.prototype = new PositionedRenderElement();

AbstractHarmonyIndexPatternMotifRenderElement.prototype.getMotifIdsAtIndex = function(i, totalCount, harmonyIndex,
                                                                                      harmonyCount, module) {
    logit("" + this._constructorName + " must implement getMotifIdAtIndex()");
    return [];
};

AbstractHarmonyIndexPatternMotifRenderElement.prototype.getRenderChannelIdsAtIndex = function(i, totalCount, harmonyIndex,
                                                                                              harmonyCount, module) {
    return [];
};


AbstractHarmonyIndexPatternMotifRenderElement.prototype.getPositionedRenderElements = function(module, harmony, beatOffset, state) {
    var result = [];

    var activated = getValueOrExpressionValue(this, "activated", module);

    var voiceLineHarmony = state.voiceLineHarmonies[this.voiceLine];
    if (voiceLineHarmony) {
        harmony = voiceLineHarmony;
    }

    if (activated) {

        var harmonyCount = harmony.getCount();

        var currentBeat = beatOffset;

        var startIndex = harmony.getHarmonyIndexAt(currentBeat);

        var theCount = Math.round(CountUnit.getCount(this.count, this.countUnit, harmony, currentBeat));

        //        if (this.countUnit == CountUnit.PHRASE_ELEMENT_COUNT) {
        //            logit(this._constructorName +
        //                ": phrase count: " + theCount + " " +
        //                " <br />");
        //        }

        var endIndex = startIndex + theCount;

        if (this.clampAtHarmonyEnd) {
            endIndex = Math.min(endIndex, harmonyCount);
        }

//        logit(this._constructorName + " " + startIndex + ", " + endIndex + " " + currentBeat);

        for (var i=startIndex; i<endIndex; i++) {
            var he = harmony.get(i);
//            logit("  " + currentBeat);
            var motifs = this.getMotifIdsAtIndex(i - startIndex, endIndex - startIndex, i, harmonyCount, module);

            var renderChannelIds = this.getRenderChannelIdsAtIndex(i - startIndex, endIndex - startIndex, i, harmonyCount, module);

            for (var j=0; j<motifs.length; j++) {
                var motif = motifs[j];
                var renderChannelId = "";
                if (renderChannelIds.length > 0) {
                    renderChannelId = renderChannelIds[j % renderChannelIds.length];
                }
                if (motif) {
                    var mre = new MotifRenderElement();
                    mre.channel = renderChannelId;
                    // logit(this._constructorName + " " + i + " " + j + " setting motif render channel to " + renderChannelId + " <br />");
                    mre.motif = motif;
                    mre.startTime = currentBeat;
                    mre.startTimeUnit = PositionUnit.BEATS;
                    mre.offsets = this.offsets;
                    mre.offsetType = this.offsetType;
                    mre.startOffsets = this.startOffsets;
                    mre.endOffsets = this.endOffsets;
                    mre.useVoiceLine = this.useVoiceLine;
                    mre.voiceLine = this.voiceLine;
                    mre.seed = getItemFromArrayWithStartEndItems(12345, this.seeds, harmonyCount, i, this.startSeeds, this.endSeeds);
                    mre.cutHarmonyMode = this.cutHarmonyMode;
                    mre.noteOverlapHarmonyMode = this.noteOverlapHarmonyMode;
                    mre.noteOverlapSnapType = this.noteOverlapSnapType;
                    result.push(mre);

                } else {
                }
            }
            var beatStep = positionUnitToBeats(he.length, he.lengthUnit, he.tsNumerator, he.tsDenominator, harmony);
            currentBeat += beatStep;
        }
    }
    return result;
};



// Renders a motif at every harmony element
function HarmonyIndexPatternMotifRenderElement() {
    AbstractHarmonyIndexPatternMotifRenderElement.call(this);

    this.motifs = [];
    this.startMotifs = [];
    this.endMotifs = [];

    this._constructorName = "HarmonyIndexPatternMotifRenderElement";
}


HarmonyIndexPatternMotifRenderElement.prototype = new AbstractHarmonyIndexPatternMotifRenderElement();

HarmonyIndexPatternMotifRenderElement.prototype.getMotifIdsAtIndex = function(i, totalCount, harmonyIndex, harmonyCount, module) {
    var motif = getItemFromArrayWithStartEndItems("", this.motifs, totalCount, i, this.startMotifs, this.endMotifs);
    return [motif];
};



// Renders a motif at every harmony element
function HarmonyIndexIndexPatternMotifRenderElement() {
    AbstractHarmonyIndexPatternMotifRenderElement.call(this);

    this.indices = [];
    this.startIndices = [];
    this.endIndices = [];
    this.motifs = [];

    this.channelIndices = [];
    this.startChannelIndices = [];
    this.endChannelIndices = [];
    this.channels = [];

    this._constructorName = "HarmonyIndexIndexPatternMotifRenderElement";
}


HarmonyIndexIndexPatternMotifRenderElement.prototype = new AbstractHarmonyIndexPatternMotifRenderElement();

HarmonyIndexIndexPatternMotifRenderElement.prototype.getMotifIdsAtIndex = function(i, totalCount, harmonyIndex, harmonyCount, module) {
    var theIndices = getValueOrExpressionValue(this, "indices", module);
    var theStartIndices = getValueOrExpressionValue(this, "startIndices", module);
    var theEndIndices = getValueOrExpressionValue(this, "endIndices", module);
    var indices = getItemFromArrayWithStartEndItems([], theIndices, totalCount, i, theStartIndices, theEndIndices);


    var result = [];
    for (var i=0; i<indices.length; i++) {
        var index = indices[i];
        if (index >= 0 && this.motifs.length > 0) {
            var motifId = this.motifs[index % this.motifs.length];
            result.push(motifId);
        }
//        if (index < this.motifs.length) {
//            result.push(this.motifs[index]);
//        }
    }
//    if (this.voiceLine == "bassVoiceLine") {
//        logit([this._constructorName,
//            " getMotifIdsAtIndex() ",
//            " theIndices: " + theIndices + " ",
//            " theStartIndices: " + theStartIndices + " ",
//            " theEndIndices: " + theEndIndices + " ",
//            " indices: " + indices + " ",
//            " result: " + result.join(", ") + " ",
//
//            " <br />"].join("") );
//    }
    return result;
};


HarmonyIndexIndexPatternMotifRenderElement.prototype.getRenderChannelIdsAtIndex = function(i, totalCount, harmonyIndex, harmonyCount, module) {
    var theIndices = getValueOrExpressionValue(this, "channelIndices", module);
    var theStartIndices = getValueOrExpressionValue(this, "startChannelIndices", module);
    var theEndIndices = getValueOrExpressionValue(this, "endChannelIndices", module);
    var indices = getItemFromArrayWithStartEndItems([], theIndices, totalCount, i, theStartIndices, theEndIndices);


    var result = [];
    for (var i=0; i<indices.length; i++) {
        var index = indices[i];
        if (index >= 0 && this.channels.length > 0) {
            var channelId = this.channels[index % this.channels.length];
            result.push(channelId);
        }
    }

    // logit(this._constructorName + " render channels: " + result.join(", ") + "<br />");
    return result;
};



// Renders motifs and steps forward with stepOffset each time
function MultiMotifRenderElement() {
    PositionedRenderElement.call(this);

    this.count = 1;
    this.countUnit = CountUnit.HARMONY_MEASURES;
    this.motifs = [];
    this.startMotifs = [];
    this.endMotifs = [];

    this.stepOffset = 1;
    this.stepOffsetUnit = PositionUnit.MEASURES;

    this.useVoiceLine = true;

    // relativeType, offset and offsetType are used when useVoiceLine is false
    this.relativeType = VerticalRelativeType.SCALE_BASE;
    this.offsets = [0];
    this.offsetType = OffsetType.SCALE;
    this.startOffsets = [];
    this.endOffsets = [];

    this.voiceLine = "";

    this.seeds = [12345];
    this.startSeeds = [];
    this.endSeeds = [];

    this.cutHarmonyMode = RenderElementCutHarmonyMode.STOP;
    this.noteOverlapHarmonyMode = NoteOverlapHarmonyMode.CONTINUE;
    this.noteOverlapSnapType = SnapType.SCALE;

    this._constructorName = "MultiMotifRenderElement";
}

MultiMotifRenderElement.prototype = new PositionedRenderElement();



MultiMotifRenderElement.prototype.getPositionedRenderElements = function(module, harmony, beatOffset, state) {
    var result = [];


    var activated = getValueOrExpressionValue(this, "activated", module);

    if (activated) {
        var he = harmony.get(0);
        // This is a little stupid... Maybe
        var startBeatTime = positionUnitToBeats(this.startTime, this.startTimeUnit, he.tsNumerator, he.tsDenominator, harmony);

        var harmonyIndex = harmony.getHarmonyIndexAt(startBeatTime);

        var count = CountUnit.getCount(this.count, this.countUnit, harmony, startBeatTime);

        var currentBeat = startBeatTime + beatOffset;

        for (var i=0; i<count; i++) {
            var motif = getItemFromArrayWithStartEndItems("", this.motifs, count, i, this.startMotifs, this.endMotifs);
            if (motif) {
                var mre = new MotifRenderElement();
                mre.motif = motif;
                mre.startTime = currentBeat;
                mre.startTimeUnit = PositionUnit.BEATS;
                mre.offsets = this.offsets;
                mre.offsetType = this.offsetType;
                mre.startOffsets = this.startOffsets;
                mre.endOffsets = this.endOffsets;
                mre.useVoiceLine = this.useVoiceLine;
                mre.voiceLine = this.voiceLine;
                mre.seed = getItemFromArrayWithStartEndItems(12345, this.seeds, count, i, this.startSeeds, this.endSeeds);
                mre.cutHarmonyMode = this.cutHarmonyMode;
                mre.noteOverlapHarmonyMode = this.noteOverlapHarmonyMode;
                mre.noteOverlapSnapType = this.noteOverlapSnapType;
                result.push(mre);
            }
            var harmonyIndex = harmony.getHarmonyIndexAt(currentBeat);
            var he = harmony.get(harmonyIndex);
            var stepBeats = positionUnitToBeats(this.stepOffset, this.stepOffsetUnit, he.tsNumerator, he.tsDenominator, harmony);
            currentBeat += stepBeats;
        }
    }
    return result;
};


function AbstractPercussionMotifRenderElement() {
    PositionedRenderElement.call(this);
}
AbstractPercussionMotifRenderElement.prototype = new PositionedRenderElement();

AbstractPercussionMotifRenderElement.prototype.renderPercussionMotif = function(motifId, beatOffset, harmony,
                                                                                harmonyElement, state) {
    var theMotif = state.module.getPercussionMotif(motifId);
    var elements = theMotif.getPrimitivePercussionMotifElements(state.module, harmony, beatOffset);
    for (var j=0; j<elements.length; j++) {
        this.renderPrimitivePercussionMotifElement(elements[j], beatOffset, harmony, harmonyElement, state);
    }
};

AbstractPercussionMotifRenderElement.prototype.getPercussionMotifBeatLength = function(motifId, beatOffset, harmony,
                                                                                       harmonyElement, state) {
    var result = 0;
    var theMotif = state.module.getPercussionMotif(motifId);
    var elements = theMotif.getPrimitivePercussionMotifElements(state.module, harmony, beatOffset);

    for (var j=0; j<elements.length; j++) {
        var element = elements[j];
        var elementBeatLength = positionUnitToBeats2(element.length, element.lengthUnit, beatOffset, harmony);
        var elementStartBeat = positionUnitToBeats2(element.startTime, element.startTimeUnit, beatOffset, harmony);
        var endBeat = elementStartBeat + elementBeatLength;
        result = Math.max(result, endBeat);
    }
    return result;
};

AbstractPercussionMotifRenderElement.prototype.getPercussionMotifsBeatLength = function(motifIds, beatOffset, harmony,
                                                                                        harmonyElement, state) {
    var result = 0;
    for (var i=0; i<motifIds.length; i++) {
        var beatLength = this.getPercussionMotifBeatLength(motifIds[i], beatOffset, harmony, harmonyElement, state);
        result += beatLength;
        beatOffset += beatLength;
    }
    return result;
};



AbstractPercussionMotifRenderElement.prototype.renderPrimitivePercussionMotifElement = function(element, beatOffset, harmony,
                                                                                                harmonyElement, state) {
    if (element.rest) {
        return;
    }


    var renderChannel = state.renderChannel;

    if (element.renderChannel) {
        renderChannel = state.module.getRenderChannel(element.renderChannel);
        if (!renderChannel) {
            renderChannel = state.renderChannel;
        }
    }
    var noteOnEvent = new NoteOnEvent();
    var elementStartBeatTime = positionUnitToBeats(element.startTime, element.startTimeUnit, harmonyElement.tsNumerator, harmonyElement.tsDenominator, harmony);
    noteOnEvent.time = snapMidiTicks(beatOffset + elementStartBeatTime + state.sectionTime, 192);
    noteOnEvent.onVelocity = element.strength;
    noteOnEvent.note = element.note;
    noteOnEvent.renderChannel = renderChannel;

    var elementEndBeatTime = elementStartBeatTime + positionUnitToBeats(element.length, element.lengthUnit, harmonyElement.tsNumerator, harmonyElement.tsDenominator, harmony);
    var noteOffEvent = new NoteOffEvent();
    noteOffEvent.time = snapMidiTicks(beatOffset + elementEndBeatTime * 0.99 + state.sectionTime, 192);
    noteOffEvent.offVelocity = element.strength;
    noteOffEvent.note = noteOnEvent.note;
    noteOffEvent.renderChannel = renderChannel;
    noteOffEvent.startTime = noteOnEvent.time;

    state.data.addEvent(noteOnEvent);
    state.data.addEvent(noteOffEvent);

    if (element.fillers) {
        for (var k=0; k<element.fillers.length; k++) {
            var filler = element.fillers[k];
            // continue here...
        }
    }
};


function PercussionMotifRenderElement() {
    AbstractPercussionMotifRenderElement.call(this);

    this.count = 1;
    this.countUnit = CountUnit.HARMONY_MEASURES;
    this.motifs = [];
    this.startMotifs = [];
    this.endMotifs = [];

    this.stepOffset = 1;
    this.stepOffsetUnit = PositionUnit.MEASURES;

    this.seeds = [12345];
    this.startSeeds = [];
    this.endSeeds = [];

    this._constructorName = "PercussionMotifRenderElement";
}


PercussionMotifRenderElement.prototype = new AbstractPercussionMotifRenderElement();



PercussionMotifRenderElement.prototype.renderBatch = function(state) {

    var activated = getValueOrExpressionValue(this, "activated", state.module);

    if (activated) {
        var harmony = state.constantHarmony;

        var he = harmony.get(0);
        var startBeatTime = positionUnitToBeats(this.startTime, this.startTimeUnit, he.tsNumerator, he.tsDenominator, harmony);

        var count = CountUnit.getCount(this.count, this.countUnit, harmony, startBeatTime);

        var currentBeat = startBeatTime;

        for (var i=0; i<count; i++) {
            var percussionMotif = getItemFromArrayWithStartEndItems("", this.motifs, count, i, this.startMotifs, this.endMotifs);
            var harmonyIndex = harmony.getHarmonyIndexAt(currentBeat);
            var he = harmony.get(harmonyIndex);
            if (percussionMotif) {
                this.renderPercussionMotif(percussionMotif, currentBeat, harmony, he, state);
            }
            var stepBeats = positionUnitToBeats(this.stepOffset, this.stepOffsetUnit, he.tsNumerator, he.tsDenominator, harmony);
            currentBeat += stepBeats;
        }
    }
};



function FlexiblePercussionMotifRenderElement() {
    AbstractPercussionMotifRenderElement.call(this);

    // When this is true, the motifIndices are used to index the indexedMotifs
    this.useIndexedMotifs = false;

    this.motifs = [];
    this.startMotifs = [];
    this.endMotifs = [];

    this.motifIndices = [];
    this.startMotifIndices = [];
    this.endMotifIndices = [];

    this.indexedMotifs = []; // ID ref list

    this.seeds = [12345];
    this.startSeeds = [];
    this.endSeeds = [];

    this._constructorName = "FlexiblePercussionMotifRenderElement";
}


FlexiblePercussionMotifRenderElement.prototype = new AbstractPercussionMotifRenderElement();


FlexiblePercussionMotifRenderElement.prototype.snapBeat = function(beat) {
    return Math.round(beat);
};

FlexiblePercussionMotifRenderElement.prototype.renderBatch = function(state) {


    var activated = getValueOrExpressionValue(this, "activated", state.module);

    if (activated) {
        var harmony = state.constantHarmony;

        var he = harmony.get(0);

//        if (this.verbose) {
//            logit(this._constructorName + " " + he.tsNumerator);
//        }
        var startBeatTime = positionUnitToBeats2(this.startTime, this.startTimeUnit, 0, harmony);
        var maxBeatLength = positionUnitToBeats2(this.maxLength, this.maxLengthUnit, 0, harmony);

        var currentBeat = startBeatTime;

        var harmonyBeatLength = Math.min(maxBeatLength + startBeatTime, harmony.getBeatLength());

        var clampCount = 64;

        var clampedMotifs = [];
        for (var i=0; i<this.startMotifs.length; i++) {
            var motifId = this.startMotifs[i];
            clampedMotifs.push(motifId);
        }
        if (this.motifs.length > 0) {
            for (var i=0; i<clampCount; i++) {
                var motifId = this.motifs[i % this.motifs.length];
                clampedMotifs.push(motifId);
            }
        }


        var theStartMotifIndices = getValueOrExpressionValue(this, "startMotifIndices", state.module);
        var theMotifIndices = getValueOrExpressionValue(this, "motifIndices", state.module);
        var theEndMotifIndices = getValueOrExpressionValue(this, "endMotifIndices", state.module);

        var clampedMotifIndices = [];
        for (var i=0; i<theStartMotifIndices.length; i++) {
            var motifIndex = theStartMotifIndices[i];
            clampedMotifIndices.push(motifIndex);
        }

        if (theMotifIndices.length > 0) {
            for (var i=0; i<clampCount; i++) {
                var motifIndex = theMotifIndices[i % theMotifIndices.length];
                clampedMotifIndices.push(motifIndex);
            }
        }

//        if (this.verbose) {
//            logit("Rendering " + this._constructorName + " at " + currentBeat + " with max beat length " + maxBeatLength + " motifIndices: " + theMotifIndices.join(", "));
//            logit("clamped motif indices: " + clampedMotifIndices.join(", ") + " end motif indices: " + theEndMotifIndices.join(", "));
//        }

//        logit([theMotifIndices.join(", "), theEndMotifIndices.join(", ")].join("; ") + "<br />");

        var i = 0;
        while (currentBeat < harmonyBeatLength) {

            var theEndMotifs = this.endMotifs;
            if (this.useIndexedMotifs) {
                theEndMotifs = [];
                for (var j=0; j<theEndMotifIndices.length; j++) {
                    var endIndex = theEndMotifIndices[j];
                    var mId = this.indexedMotifs[endIndex];
                    if (mId) {
                        theEndMotifs.push(mId);
                    }
                }
            }

            var endBeatLength = this.getPercussionMotifsBeatLength(theEndMotifs, currentBeat, harmony, he, state);

//            logit("  currentBeat: " + currentBeat + " endBeatLength: " + endBeatLength + " " + theEndMotifs.join(", "));

            var initialIndicesLength = this.useIndexedMotifs ? clampedMotifIndices.length : clampedMotifs.length;
            var motifIndex = IndexBorderMode.getIndex(IndexBorderMode.CLAMP, initialIndicesLength, i);
            var percussionMotifId = clampedMotifs[motifIndex];

            if (this.useIndexedMotifs) {
                var percussionMotifIndex = clampedMotifIndices[motifIndex];
                percussionMotifId = this.indexedMotifs[percussionMotifIndex];
//                logit("    Rendering " + percussionMotifId + " from index " + percussionMotifIndex + " from " + this.indexedMotifs.join(", "));
            }

            // logit(this._constructorName + " " + percussionMotifId);

            var harmonyIndex = harmony.getHarmonyIndexAt(currentBeat);
            var he = harmony.get(harmonyIndex);

            var motifBeatLength = 1;
            var renderEnd = false;
            if (percussionMotifId) {
                motifBeatLength = this.getPercussionMotifBeatLength(percussionMotifId, currentBeat, harmony, he, state);

//                logit("    " + this._constructorName + " length: " + motifBeatLength);

                if (motifBeatLength < 0.01) {
                    logit(this._constructorName + " found empty percussion motif...");
                    motifBeatLength = 1;
                } else {
                    // Only render if we can fit the end motifs
                    if ((currentBeat + endBeatLength + motifBeatLength <= harmonyBeatLength)) {
                        this.renderPercussionMotif(percussionMotifId, currentBeat, harmony, he, state);
                    } else {
                        renderEnd = true;
                    }
                }
            }
            // Check if we should render the end motifs

            if ((renderEnd || (currentBeat + endBeatLength + motifBeatLength > harmonyBeatLength))) {
                // Render the end motifs and quit

                var beatBefore = currentBeat;
                currentBeat = this.snapBeat(harmonyBeatLength - endBeatLength);

//                if (currentBeat < beatBefore) {
//                    logit(" bad rendering end... " + beatBefore + " " + currentBeat);
//                }
//                logit("Rendering end " + theEndMotifIndices + " <br />");

                if (this.useIndexedMotifs) {
                    var endMotifId = null;
                    for (var j=0; j<theEndMotifIndices.length; j++) {
                        var endMotifIndex = theEndMotifIndices[j];
                        var endMotifId = this.indexedMotifs[endMotifIndex];
                        this.renderPercussionMotif(endMotifId, currentBeat, harmony, he, state);
                        var tempLength = this.getPercussionMotifBeatLength(endMotifId, currentBeat, harmony, he, state);
                        if (tempLength < 0.01) {
                            tempLength = 1;
                        }
                        currentBeat += tempLength;
                        currentBeat = this.snapBeat(currentBeat);
                    }
                } else {
                    for (var j=0; j<this.endMotifs.length; j++) {
                        var endMotifId = this.endMotifs[j];
                        this.renderPercussionMotif(endMotifId, currentBeat, harmony, he, state);
                        var tempLength = this.getPercussionMotifBeatLength(endMotifId, currentBeat, harmony, he, state);
                        if (tempLength < 0.01) {
                            tempLength = 1;
                        }
                        currentBeat += tempLength;
                        currentBeat = this.snapBeat(currentBeat);
                    }
                }
                break; // We are done!
            }

            var stepBeats = motifBeatLength;
            currentBeat += stepBeats;

            currentBeat = this.snapBeat(currentBeat);

            i++;
        }
    }
};


