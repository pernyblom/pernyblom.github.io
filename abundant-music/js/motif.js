

function Motif() {
    this.id = "";
    this.motifElements = [];
    this.motifZones = [];
    this.modifiers = [];
    this.rythmBased = false;
    this.rythm = "";
    //    this.inherits = false;
    this.inheritedMotif = "";
    this.seed = 12345;
    this.useExternalSeed = false;

    this._constructorName = "Motif";
}

Motif.prototype.toString = function(options) {
    var result = "{";
    result += "" + $.map(this.motifElements, function(o, i) {
        return o.toString(options);
    });
    result += "}";
    return result;
};

Motif.prototype.getConstantMotifElements = function(module, harmony, harmonyBeatOffset, visitedMotifs) {
    if (!visitedMotifs) {
        visitedMotifs = new Map(true);
    }
    var result = [];

    if (this.inheritedMotif) {
        var motif = module.getMotif(this.inheritedMotif);
        if (motif) {
            if (visitedMotifs.get(this)) {
                // Inherit loop...
                logit("Motif detected inherit loop...");
            } else {
                // Make sure that we add ourself to the visited motifs
                visitedMotifs.put(this, this);
                var list = motif
                    .getConstantMotifElements(module, harmony, harmonyBeatOffset, visitedMotifs);

                addAll(result, list);
            }
        }
    } else if (this.rythmBased) {
        var theRythm = module.getRythm(this.rythm);
        if (theRythm) {
            // Getting the note rythm elements
            var startHarmonyIndex = harmony.getHarmonyIndexAt(harmonyBeatOffset);
            //            var startHarmonyElement = harmony.get(startHarmonyIndex);
            var noteRythmElements = theRythm.getNoteRythmElements(module, harmony, harmonyBeatOffset);

            noteRythmElements = arrayCopyWithCopy(noteRythmElements);

            //            logit("Got note rythm elements: " + noteRythmElements + "<br />");
            // Create clusters for the zone elements
            var elementZones = [];
            var zoneElements = [];
            var rangeZoneElements = [];

            var currentPosition = 0;
            for (var j=0; j<noteRythmElements.length; j++) {
                var rythmElement = noteRythmElements[j];
                var elementBeatLength = positionUnitToBeats2(rythmElement.length, rythmElement.lengthUnit, harmonyBeatOffset, harmony);
                rythmElement.length = elementBeatLength; // Use beats to simplify the rest of the processing
                rythmElement.lengthUnit = PositionUnit.BEATS;

                elementZones[j] = -1;
                var harmonyIndex = harmony.getHarmonyIndexAt(currentPosition + harmonyBeatOffset);
                var harmonyElement = harmony.get(harmonyIndex);

                for (var i=0; i<this.motifZones.length; i++) {
                    if (!zoneElements[i]) {
                        zoneElements[i] = [];
                    }
                    if (!rangeZoneElements[i]) {
                        rangeZoneElements[i] = [];
                    }
                    var zone = this.motifZones[i];
                    if (zone.intersectsRange([currentPosition, currentPosition + elementBeatLength], harmony, harmonyBeatOffset)) {
                        rangeZoneElements[i].push(j);
                    }
                }
                for (var i=0; i<this.motifZones.length; i++) {
                    var zone = this.motifZones[i];
                    if (zone.containsPosition(currentPosition, harmony, harmonyBeatOffset)) {
                        zoneElements[i].push(j);
                        elementZones[j] = i;
                        break; // Each rythm element can only be part of one zone
                    }
                }
                currentPosition += elementBeatLength;
            }

            // Check if the zone can't be empty
            for (var i=0; i<this.motifZones.length; i++) {
                var zone = this.motifZones[i];
                if (zone.useNoteRangeIfEmpty && zoneElements[i].length == 0) {
                    // Get the rythm elements that haven't been taken yet
                    for (var j=0; j<rangeZoneElements[i].length; j++) {
                        var index = rangeZoneElements[i][j];
                        if (elementZones[index] == -1) {
                            // Not taken yet...
                            zoneElements[i].push(index);
                            elementZones[index] = i;
                            // logit("Using range in motif.js " + zoneElements);
                        }
                    }
                }
            }

            //            logit("zone elements: " + JSON.stringify(zoneElements) + "<br />");
            //            logit("element zones: " + JSON.stringify(elementZones) + "<br />");

            var appliedZones = {};
            for (var j=0; j<noteRythmElements.length; j++) {
                var rythmElement = noteRythmElements[j];
                if (rythmElement.rest || elementZones[j] == -1) {
                    // Elements that have no zones become rests
                    var rest = new ConstantMotifElement();
                    rest.rest = true;
                    rest.length = rythmElement.length;
                    rest.lengthUnit = rythmElement.lengthUnit;
                    result.push(rest);
                } else {
                    // Element has a zone and is not a rest
                    var zoneIndex = elementZones[j];
                    if (!appliedZones[zoneIndex]) {
                        var zone = this.motifZones[elementZones[j]];


                        var elementIndices = zoneElements[elementZones[j]];
                        var elements = [];
                        for (var k=0; k<elementIndices.length; k++) {
                            elements[k] = noteRythmElements[elementIndices[k]];
                        }
                        var zoneResult = zone.applyMotifZone(elements, module);
                        //                        logit("Applying zone " + zoneResult + "<br />");
                        addAll(result, zoneResult);
                        appliedZones[zoneIndex] = true;
                    }
                }
            }


            // The result array should now contain the constant motif elements given by the zones

        } else {
            logit(" could not find rythm " + this.rythm);
        }

    } else {
        for (var i=0; i<this.motifElements.length; i++) {
            var e = this.motifElements[i];
            var list = e.getConstantMotifElements(module, harmony, harmonyBeatOffset, visitedMotifs);
            addAll(result, list);
        }
    }

    // Apply the modifiers
    for (var i=0; i<this.modifiers.length; i++) {
        var m = this.modifiers[i];
        result = m.apply(module, result);
    }

    return result;
};


Motif.prototype.addMotifElement = function(element) {
    this.motifElements.push(element);
    return this;
};


function MotifElement() {
    this.id = "";
    this.length = 1;
    this.lengthUnit = PositionUnit.BEATS;
    this.strength = 1.0;
    this._constructorName = "MotifElement";
}

MotifElement.prototype.getConstantMotifElements = function(module, harmony, harmonyBeatOffset, visitedMotifs) {
    return [this];
};


MotifElement.prototype.toString = function(options) {
    var showLength = getValueOrDefault(options, "showLength", false);
    var showLengthUnit = getValueOrDefault(options, "showLength", false);

    var result = "";
    if (showLength) {
        result += "len:" + this.length + " ";
    }
    if (showLengthUnit) {
        result += "lu:" + this.lengthUnit + " ";
    }
    return result;
};

MotifElement.prototype.setLength = function(length) {
    this.length = length;
    return this;
};

MotifElement.prototype.setLengthUnit = function(lengthUnit) {
    this.lengthUnit = lengthUnit;
    return this;
};

MotifElement.prototype.getLength = function() {
    return this.length;
};

MotifElement.prototype.getLengthUnit = function() {
    return this.lengthUnit;
};

MotifElement.prototype.set = function(e) {
    MotifElement.set.call(this, e);
    e.length = this.length;
    e.lengthUnit = this.lengthUnit;
    e.strength = this.strength;
};


function SimpleSequenceMotifElement() {
    MotifElement.call(this);

    this.verticalOffsetPattern = [0];
    this.verticalOffsetPatternBorderMode = IndexBorderMode.RESTART;
    this.verticalOffsetType = OffsetType.SCALE;
    this.verticalRelativeType = VerticalRelativeType.VOICE_LINE;

    this.elementLengthPattern = [1];
    this.elementLengthPatternUnit = PositionUnit.BEATS;
    this.elementLengthPatternBorderMode = IndexBorderMode.RESTART;

    this.elementStrengthPattern = [1.0];
    this.elementStrengthPatternBorderMode = IndexBorderMode.RESTART;

    this.restPattern = [0];
    this.restPatternBorderMode = IndexBorderMode.RESTART;

    this.cutLast = true;

    this.minElementLength = 0;
    this.minElementLengthUnit = PositionUnit.BEATS;

    this._constructorName = "SimpleSequenceMotifElement";
}

SimpleSequenceMotifElement.prototype = new MotifElement();



SimpleSequenceMotifElement.prototype.getConstantMotifElements = function(module, harmony, harmonyBeatOffset, visitedMotifs) {
    var result = [];

    if (this.elementLengthPattern.length == 0) {
        return result;
    }

    var harmonyElement = harmony.getHarmonyAt(harmonyBeatOffset);

    var totalLength = positionUnitToBeats(this.length, this.lengthUnit, harmonyElement.tsNumerator, harmonyElement.tsDenominator, harmony);

    var minBeatLength = positionUnitToBeats(this.minElementLength, this.minElementLengthUnit, harmonyElement.tsNumerator, harmonyElement.tsDenominator, harmony);

    var index = 0;
    var currentPosition = 0;
    while (currentPosition < totalLength) {
        var realElementIndex = IndexBorderMode.getIndex(this.elementLengthPatternBorderMode, this.elementLengthPattern.length, index);
        if (realElementIndex == -1) {
            break;
        }
        var elementLength = this.elementLengthPattern[realElementIndex];
        var beatLength = positionUnitToBeats(elementLength, this.elementLengthPatternUnit,
            harmonyElement.tsNumerator, harmonyElement.tsDenominator, harmony);

        var rest = false;
        if (this.restPattern.length > 0) {
            var realRestIndex = IndexBorderMode.getIndex(this.restPatternBorderMode, this.restPattern.length, index);
            if (realRestIndex >= 0) {
                rest = this.restPattern[realRestIndex] != 0;
            }
        }

        var offset = 0;
        if (this.verticalOffsetPattern.length > 0) {
            var realOffsetIndex = IndexBorderMode.getIndex(this.verticalOffsetPatternBorderMode,
                this.verticalOffsetPattern.length, index);
            if (realOffsetIndex >= 0) {
                offset = this.verticalOffsetPattern[realOffsetIndex];
            }
        }

        var isLast = false;
        if (currentPosition + beatLength > totalLength) {
            // cut or stop
            isLast = true;
            if (this.cutLast) {
                beatLength = totalLength - currentPosition;
            } else {
                rest = true;
            }
        }
        if (!isLast || beatLength >= minBeatLength) {
            var motifElement = new VerticalRelativeMotifElement().setLength(beatLength).setLengthUnit(PositionUnit.BEATS);
            motifElement.rest = rest;
            motifElement.index = offset;
            motifElement.relativeType = this.verticalRelativeType;
            motifElement.offsetType = this.verticalOffsetType;
            result.push(motifElement);
        }

        if (isLast) {
            break;
        }
        index++;
        currentPosition += beatLength;
    }
    return result;
};


var FillerNoteLengthMode = {
    INDEPENDENT: 0,
    MATCH: 1
};


function FillerNote() {
    MotifElement.call(this);
    this.positionOffset = 0.0;
    this.positionOffsetUnit = PositionUnit.BEATS;
    this.relativeType = VerticalRelativeType.NOTE;
    this.offsetType = OffsetType.CHORD;
    this.offset = 1;
    this.snapType = SnapType.NONE;
    this.lengthMode = FillerNoteLengthMode.INDEPENDENT;
    this._constructorName = "FillerNote";
}

FillerNote.prototype = new MotifElement();

FillerNote.prototype.copy = function() {
    var result = new FillerNote();
    MotifElement.prototype.set(this, result);
    result.positionOffset = this.positionOffset;
    result.positionOffsetUnit = this.positionOffsetUnit;
    result.relativeType = this.relativeType;
    result.offsetType = this.offsetType;
    result.offset = this.offset;
    return result;
};

FillerNote.prototype.getAbsoluteNote = function(refAbsNote, harmonyElement, voiceLineElement) {
    if (this.relativeType == VerticalRelativeType.NOTE) {
        // Keep the refAbsNote
    } else {
        refAbsNote = harmonyElement.getVerticalRelativeAbsoluteNote(this.relativeType, voiceLineElement);
    }
    refAbsNote = harmonyElement.offset(refAbsNote, this.offsetType, this.offset, harmonyElement);
    return harmonyElement.snap(refAbsNote, this.snapType, harmonyElement);
};


function ConstantMotifElement() {
    MotifElement.call(this);
    this.rest = false;
    this.fillers = [];
    this._constructorName = "ConstantMotifElement";
}

ConstantMotifElement.prototype = new MotifElement();


ConstantMotifElement.prototype.addFiller = function(f) {
    this.fillers.push(f);
    return this;
};



ConstantMotifElement.prototype.toString = function(options) {
    var result = MotifElement.prototype.toString.call(this, options);
    var strs = [];
    var showVelocity = getValueOrDefault(options, "showVelocity", false);
    var showRest = getValueOrDefault(options, "showRest", true);
    if (this.rest && showRest) {
        strs.push("R");
    }
    if (showVelocity) {
        strs.push("vel:" + this.strength);
    }
    return result + " " + strs;
};

ConstantMotifElement.prototype.set = function(e) {
    MotifElement.prototype.set.call(this, e);
    e.rest = this.rest;
    e.fillers = [];
    for (var i=0; i<this.fillers.length; i++) {
        e.fillers.push(this.fillers[i].copy());
    }
};

ConstantMotifElement.prototype.setRest = function(r) {
    this.rest = r;
    return this;
};

ConstantMotifElement.prototype.getBeatLength = function(numerator, denominator) {
    //    logit("calling getBeatLength() in cme with " + [this.length, this.lengthUnit, numerator, denominator] + "<br />");
    return positionUnitToBeats(this.length, this.lengthUnit, numerator, denominator);
};




function VerticalRelativeMotifElement() {
    ConstantMotifElement.call(this);
    this.index = 0;
    this.relativeType = VerticalRelativeType.VOICE_LINE;
    this.offsetType = OffsetType.SCALE;
    this.beforeOffsetSnapType = SnapType.NONE;
    this.afterOffsetSnapType = SnapType.NONE;
    this._constructorName = "VerticalRelativeMotifElement";
}

VerticalRelativeMotifElement.prototype = new ConstantMotifElement();

VerticalRelativeMotifElement.prototype.toString = function(options) {
    var result = ConstantMotifElement.prototype.toString.call(this, options);
    var strs = [];
    var showIndex = getValueOrDefault(options, "showIndex", true);
    var showRelativeType = getValueOrDefault(options, "showRelativeType", false);
    var showOffsetType = getValueOrDefault(options, "showOffsetType", false);
    var showBeforeOffsetSnapType = getValueOrDefault(options, "showBeforeOffsetSnapType", false);
    var showAfterOffsetSnapType = getValueOrDefault(options, "showAfterOffsetSnapType", false);
    var showLength = getValueOrDefault(options, "showAfterOffsetSnapType", true);
    if (showIndex) {
        strs.push("ind:" + this.index);
    }
    if (showRelativeType) {
        strs.push("rt:" + VerticalRelativeType.toString(this.relativeType));
    }
    if (showOffsetType) {
        strs.push("ot:" + OffsetType.toString(this.offsetType));
    }
    if (showLength) {
        strs.push("len:" + this.length);
    }
    return result + " " + strs;
};

VerticalRelativeMotifElement.prototype.setIndex = function(index) {
    this.index = index;
    return this;
};

VerticalRelativeMotifElement.prototype.setRelativeType = function(relativeType) {
    this.relativeType = relativeType;
    return this;
};

VerticalRelativeMotifElement.prototype.setOffsetType = function(offsetType) {
    this.offsetType = offsetType;
    return this;
};

VerticalRelativeMotifElement.prototype.setBeforeOffsetSnapType = function(type) {
    this.beforeOffsetSnapType = type;
    return this;
};

VerticalRelativeMotifElement.prototype.setAfterOffsetSnapType = function(type) {
    this.afterOffsetSnapType = type;
    return this;
};

VerticalRelativeMotifElement.prototype.copy = function() {
    var result = new VerticalRelativeMotifElement();
    ConstantMotifElement.prototype.set.call(this, result);
    result.index = this.index;
    result.relativeType = this.relativeType;
    result.offsetType = this.offsetType;
    result.beforeOffsetSnapType = this.beforeOffsetSnapType;
    result.afterOffsetSnapType = this.afterOffsetSnapType;
    return result;
};


function ClusterableMotifElement() {
    ConstantMotifElement.call(this);
    this.clusterPositionIndex = 0; // Just counting notes
    this.clusterPositionFraction = 0; // Between 0 and 1. Uses beat position within cluster
    this.clusterId = 0;
    this._constructorName = "ClusterableMotifElement";
}

ClusterableMotifElement.prototype = new ConstantMotifElement();

ClusterableMotifElement.prototype.set = function(e) {
    ConstantMotifElement.prototype.set.call(this, e);
    e.clusterPositionIndex = this.clusterPositionIndex;
    e.clusterPositionFraction = this.clusterPositionFraction;
    e.clusterId = this.clusterId;
};


function HorizontalRelativeMotifElement() {
    ClusterableMotifElement.call(this);
    this.index = 0;
    this.relativeType = HorizontalRelativeType.PREVIOUS_NOTE;
    this.offsetType = OffsetType.SCALE;
    this.beforeOffsetSnapType = SnapType.NONE;
    this.afterOffsetSnapType = SnapType.NONE;
    this._constructorName = "HorizontalRelativeMotifElement";
}

HorizontalRelativeMotifElement.prototype = new ClusterableMotifElement();

HorizontalRelativeMotifElement.prototype.setIndex = function(index) {
    this.index = index;
    return this;
};

HorizontalRelativeMotifElement.prototype.setRelativeType = function(relativeType) {
    this.relativeType = relativeType;
    return this;
};

HorizontalRelativeMotifElement.prototype.setOffsetType = function(offsetType) {
    this.offsetType = offsetType;
    return this;
};

HorizontalRelativeMotifElement.prototype.setBeforeOffsetSnapType = function(type) {
    this.beforeOffsetSnapType = type;
    return this;
};

HorizontalRelativeMotifElement.prototype.setAfterOffsetSnapType = function(type) {
    this.afterOffsetSnapType = type;
    return this;
};


HorizontalRelativeMotifElement.prototype.copy = function() {
    var result = new HorizontalRelativeMotifElement();
    ClusterableMotifElement.prototype.set.call(this, result);
    result.index = this.index;
    result.relativeType = this.relativeType;
    result.offsetType = this.offsetType;
    result.beforeOffsetSnapType = this.beforeOffsetSnapType;
    result.afterOffsetSnapType = this.afterOffsetSnapType;
    return result;
};



var AdaptiveVerticalDomainType = {
    ENUMERABLE: 0,
    RANGE: 1,
    CURVE: 2,

    toString: function(type) {
        switch (type) {
            case AdaptiveVerticalDomainType.ENUMERABLE:
                return "Enumerable";
            case AdaptiveVerticalDomainType.RANGE:
                return "Range";
            case AdaptiveVerticalDomainType.CURVE:
                return "Curve";
        }
        return "Unknown ad. vert. dom. type " + type;
    }

};
addPossibleValuesFunction(AdaptiveVerticalDomainType, AdaptiveVerticalDomainType.ENUMERABLE, AdaptiveVerticalDomainType.CURVE);


var AdaptiveHorizontalDomainType = {
    ENUMERABLE: 0,
    RANGE: 1,

    toString: function(type) {
        switch (type) {
            case AdaptiveHorizontalDomainType.ENUMERABLE:
                return "Enumerable";
            case AdaptiveHorizontalDomainType.RANGE:
                return "Range";
        }
        return "Unknown ad. horiz. dom. type " + type;
    }
};
addPossibleValuesFunction(AdaptiveHorizontalDomainType, AdaptiveHorizontalDomainType.ENUMERABLE, AdaptiveHorizontalDomainType.RANGE);


function AdaptiveMotifElement() {
    ClusterableMotifElement.call(this);

    this.verticalDomainType = AdaptiveVerticalDomainType.RANGE;
    this.verticalRelativeType = VerticalRelativeType.VOICE_LINE;

    this.constantVerticalOffset = 0;
    this.constantVerticalOffsetType = OffsetType.HALF_STEP;

    this.verticalDomainOffsetType = OffsetType.SCALE;
    this.verticalDomainOffsetRange = [-15, 15];
    this.verticalDomainOffsetElements = [-1, 0, 1];
    this.verticalDomainOffsetElementLikelihoods = [1, 1, 1];
    this.verticalDomainCurve = "";
    this.verticalDomainCurveOffsetRange = [-1, 1]; // How far off the curve to go
    this.verticalDomainCurveOffsetLikelihoodMultiplier = 0.1; // What to multiply the likelihood when getting outside curve

    this.horizontalDomainTypes = [AdaptiveHorizontalDomainType.RANGE];
    this.horizontalRelativeTypes = [HorizontalRelativeType.PREVIOUS_NOTE];
    this.horizontalDomainOffsetTypes = [OffsetType.SCALE];
    this.horizontalDomainOffsetRanges = [[-2, 2]];
    this.horizontalDomainOffsetElements = [[-1, 0, 1]];
    this.horizontalDomainOffsetLikelihoods = [[1, 1, 1]];

    this._constructorName = "AdaptiveMotifElement";
}

AdaptiveMotifElement.prototype = new ClusterableMotifElement();



AdaptiveMotifElement.prototype.setVerticalDomainType = function(a) {
    this.verticalDomainType = a;
    return this;
};

AdaptiveMotifElement.prototype.setVerticalRelativeType = function(a) {
    this.verticalRelativeType = a;
    return this;
};

AdaptiveMotifElement.prototype.setVerticalDomainOffsetType = function(a) {
    this.verticalDomainOffsetType = a;
    return this;
};

AdaptiveMotifElement.prototype.setVerticalDomainOffsetRange = function(a) {
    this.verticalDomainOffsetRange = a;
    return this;
};

AdaptiveMotifElement.prototype.setVerticalDomainOffsetElements = function(a) {
    this.verticalDomainOffsetElements = a;
    return this;
};

AdaptiveMotifElement.prototype.setVerticalDomainOffsetCurve = function(a) {
    this.verticalDomainOffsetCurve = a;
    return this;
};

AdaptiveMotifElement.prototype.setHorizontalDomainTypes = function(a) {
    this.horizontalDomainTypes = a;
    return this;
};
AdaptiveMotifElement.prototype.setHorizontalRelativeTypes = function(a) {
    this.horizontalRelativeTypes = a;
    return this;
};
AdaptiveMotifElement.prototype.setHorizontalDomainOffsetTypes = function(a) {
    this.horizontalDomainOffsetTypes = a;
    return this;
};
AdaptiveMotifElement.prototype.setHorizontalDomainOffsetRanges = function(a) {
    this.horizontalDomainOffsetRanges = a;
    return this;
};
AdaptiveMotifElement.prototype.setHorizontalDomainOffsetElements = function(a) {
    this.horizontalDomainOffsetElements = a;
    return this;
};
AdaptiveMotifElement.prototype.setHorizontalDomainOffsetLikelihoods = function(a) {
    this.horizontalDomainOffsetLikelihoods = a;
    return this;
};

