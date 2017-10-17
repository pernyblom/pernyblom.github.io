


HarmonyElement.prototype.getLength = function() {
    return this.length;
};

HarmonyElement.prototype.getLengthUnit = function() {
    return this.lengthUnit;
};


HarmonyElement.prototype.setLengthUnit = function(u) {
    this.lengthUnit = u;
    return this;
};

HarmonyElement.prototype.setLength = function(l) {
    this.length = l;
    return this;
};

HarmonyElement.prototype.getConstantHarmonyElements = function(module, beatOffset) {
    return [this];
};


HarmonyElement.prototype.applyModifers = function(elements, module) {
};



HarmonyReferenceHarmonyElement.prototype.getConstantHarmonyElements = function(module, beatOffset) {
    var harmonyId = getValueOrExpressionValue(this, "harmony", module);
    var harmony = module.getHarmony(harmonyId);
    if (harmony) {
        return applyHarmonyModifiers(harmony.getConstantHarmonyElements(module), this.modifiers, module);
    } else {
        logit("Could not find harmony " + harmonyId + "<br />");
    }
    return [];
};



SwitchHarmonyElement.prototype.getConstantHarmonyElements = function(module, beatOffset) {
    var result = [];
    var index = getValueOrExpressionValue(this, "index", module);
    var indexedElements = this.indexedElements; // getValueOrExpressionValue(this, "indexedElements", module);

//    if (this.indexExpression) {
////        console.log(this._constructorName + " using index " + index + " on " + indexedElements + " " + this.indexExpression);
//        var v = module.getVariable(this.indexExpression);
//        if (v) {
//            logit("index var " + v.id + " " + v.value + " " + this.indexUseExpression + " " + index);
//        }
//    }

    if (indexedElements.length > 0) {
        var harmony = indexedElements[index % indexedElements.length];
        if (harmony) {
            return harmony.getConstantHarmonyElements(module);
        } else {
            console.log("harmony null in " + this._constructorName + " for index " + index);
        }
    } else {
        console.log("to few indexed elements in " + this._constructorName + " for index " + index);
    }
    result.push(new ConstantHarmonyElement());
};



ConstantHarmonyElement.prototype.getConstantHarmonyElements = function(module, beatOffset) {
    return applyHarmonyModifiers([this], this.modifiers, module);
};


ConstantHarmonyElement.prototype.getBeatLength = function() {
    return positionUnitToBeats(this.length, this.lengthUnit, this.tsNumerator, this.tsDenominator);
};

ConstantHarmonyElement.prototype.toString = function() {
    var scale = this.getScale();
    var result = "HarmonyElement {";
    result += " scale: " + scale;
    result += " chordRoot: " + this.chordRoot;
    result += " inversions: " + this.chordInversions;
    result += "}";
    return result;
};

ConstantHarmonyElement.prototype.sameScale = function(che) {
    if (che.baseNote == this.baseNote) {
        var otherScale = che.getScale();
        var thisScale = this.getScale();
        if (otherScale.length == thisScale.length) {
            for (var i=0; i<thisScale.length; i++) {
                if (thisScale[i] != otherScale[i]) {
                    return false;
                }
            }
            return true;
        }
    }
    return false;
};

ConstantHarmonyElement.prototype.toRomanString = function() {
    var result = "";
    var scale = this.getScale();

    var scaleDegree = positiveMod(this.chordRoot, scale.length);
    switch (scaleDegree) {
        case 0:
            result += "I";
            break;
        case 1:
            result += "II";
            break;
        case 2:
            result += "III";
            break;
        case 3:
            result += "IV";
            break;
        case 4:
            result += "V";
            break;
        case 5:
            result += "VI";
            break;
        case 6:
            result += "VII";
            break;
    }

    switch (this.chordType) {
        case ChordType.TRIAD:
            switch (this.chordInversions) {
                case 0:
                    break;
                case 1:
                    result += "6";
                    break;
                case 2:
                    result += "64";
                    break;
            }
            break;
        case ChordType.NINTH:
            switch (this.chordInversions) {
                case 0:
                    result += "9";
                    break;
                default:
                    result += "9(" + this.chordInversions + ")";
                    break;
            }
            break;
        case ChordType.SEVENTH:
            switch (this.chordInversions) {
                case 0:
                    result += "7";
                    break;
                case 1:
                    result += "65";
                    break;
                case 2:
                    result += "43";
                    break;
                case 3:
                    result += "42";
                    break;
            }
            break;
        case ChordType.SUS2:
            switch (this.chordInversions) {
                case 0:
                    result += "sus2";
                    break;
                default:
                    result += "sus2(" + this.chordInversions + ")";
                    break;
            }
            break;
        case ChordType.SUS4:
            switch (this.chordInversions) {
                case 0:
                    result += "sus4";
                    break;
                default:
                    result += "sus4(" + this.chordInversions + ")";
                    break;
            }
            break;
        case ChordType.SUS2_SEVENTH:
            switch (this.chordInversions) {
                case 0:
                    result += "sus2_7";
                    break;
                default:
                    result += "sus2_7(" + this.chordInversions + ")";
                    break;
            }
            break;
        case ChordType.SUS4_SEVENTH:
            switch (this.chordInversions) {
                case 0:
                    result += "sus4_7";
                    break;
                default:
                    result += "sus4_7(" + this.chordInversions + ")";
                    break;
            }
            break;
    }
    if (this.note) {
        result += "(" + this.note + ")";
    }
    return result;
};

ConstantHarmonyElement.prototype.copy = function() {
    return copyObjectDeep(this);
};

// Get the harmony element that has its scale base at scaleIndex (in the current scale) and its
// chord root at otherRootScaleIndex (in the new scale)
ConstantHarmonyElement.prototype.getDerivedChord = function(scaleIndex, scaleType, otherRootScaleIndex) {
    var result = this.copy();
    var newScaleBase = this.getAbsoluteNoteFromScaleIndex(scaleIndex);
    result.baseNote = newScaleBase;
    result.chordRoot = otherRootScaleIndex;
    result.scaleType = scaleType;
    return result;
};

ConstantHarmonyElement.prototype.setTimeSignature = function(n, d) {
    this.tsNumerator = n;
    this.tsDenominator = d;
    return this;
};

ConstantHarmonyElement.prototype.setBaseNote = function(baseNote) {
    this.baseNote = baseNote;
    return this;
};

ConstantHarmonyElement.prototype.getBaseNote = function() {
    return this.baseNote;
};


ConstantHarmonyElement.prototype.getChordRootScaleIndex = function() {

    switch (this.chordType) {
        case ChordType.CUSTOM:
            return this.chord[0];
        default:
            return this.chordRoot;
    }
};


ConstantHarmonyElement.prototype.alterScaleCopy = function(scaleOffsets) {
    var result = scaleOffsets;
    if (this.alterations && this.alterations.length > 0) {
        var alterResult = arrayCopy(scaleOffsets);
        for (var i=0; i<this.alterations.length; i+=2) {
            if (i < this.alterations.length - 1) {
                var scaleIndex = this.alterations[i];
                var offset = this.alterations[i + 1];
                alterResult[scaleIndex % alterResult.length] += offset;
            }
        }
        result = alterResult;
    }
    var scaleMode = clamp(this.scaleMode, -12, 12);

//    if (scaleMode != 0) {
//        logit("Scale before mode: " + result.join(",") + "  " + scaleMode);
//    }

    var absScaleMode = Math.abs(scaleMode);
    for (var i=0; i<absScaleMode; i++) {
        var modeResult = arrayCopy(result);
        if (scaleMode > 0) {
            // Shift everything left
            var first = modeResult.shift(); // Remove first element
//            if (first != 0) {
//                logit("First scale offset not zero. This will not be pretty :) " + this._constructorName);
//            }
            modeResult.push(12);
            var toSub = modeResult[0];
            for (var j=0; j<modeResult.length; j++) {
                modeResult[j] = Math.abs(modeResult[j] - toSub);
            }
        } else {
            var last = modeResult.pop();
            var toAdd = 12 - last;
            for (var j=0; j<modeResult.length; j++) {
                modeResult[j] = modeResult[j] + toAdd;
            }
            modeResult.unshift(0);
        }
        result = modeResult;


//        if (scaleMode != 0) {
//            logit("Scale after mode: " + result.join(",") + "  " + scaleMode + " iteration " + i);
//        }
    }
    return result;
};

ConstantHarmonyElement.prototype.addAlteration = function(scaleIndex, offset) {
    this.alterations.push(scaleIndex);
    this.alterations.push(offset);
    return this;
};

ConstantHarmonyElement.prototype.clearAlterations = function() {
    this.alterations = [];
    return this;
};

ConstantHarmonyElement.prototype.getScale = function() {
    var result = ScaleType.MAJOR_SCALE_STEPS;

    switch (this.scaleType) {
        case ScaleType.CUSTOM:
            result = this.scale;
            break;
        default:
            result = ScaleType.getChromaticSteps(this.scaleType);
            break;
    }
    return this.alterScaleCopy(result);
};

ConstantHarmonyElement.prototype.getHarmonyElements = function() {

    var result = [];
    result.push(this);
    return result;
};


ConstantHarmonyElement.prototype.hasSeventh = function() {
    return this.isSeventh() || this.isNinth();
};

ConstantHarmonyElement.prototype.isNinth = function() {
    return this.chordType == ChordType.NINTH;
};

ConstantHarmonyElement.prototype.addSeventh = function() {
    switch (this.chordType) {
        case ChordType.SUS2:
            this.chordType = ChordType.SUS2_SEVENTH;
            break;
        case ChordType.SUS4:
            this.chordType = ChordType.SUS4_SEVENTH;
            break;
        case ChordType.TRIAD:
            this.chordType = ChordType.SEVENTH;
            break;
    }
    return this;
};

ConstantHarmonyElement.prototype.removeSeventh = function() {
    switch (this.chordType) {
        case ChordType.SUS2_SEVENTH:
            this.chordType = ChordType.SUS2;
            break;
        case ChordType.SUS4_SEVENTH:
            this.chordType = ChordType.SUS4;
            break;
        case ChordType.SEVENTH:
        case ChordType.NINTH:
            this.chordType = ChordType.TRIAD;
            break;
    }
    return this;
};



ConstantHarmonyElement.prototype.isSeventh = function() {
    switch (this.chordType) {
        case ChordType.SEVENTH:
        case ChordType.SUS2_SEVENTH:
        case ChordType.SUS4_SEVENTH:
            return true;
    }
    return false;
};



ConstantHarmonyElement.prototype.isSus = function() {
    switch (this.chordType) {
        case ChordType.SUS2:
        case ChordType.SUS4:
        case ChordType.SUS2_SEVENTH:
        case ChordType.SUS4_SEVENTH:
            return true;
    }
    return false;
};
ConstantHarmonyElement.prototype.isSus2 = function() {
    switch (this.chordType) {
        case ChordType.SUS2:
        case ChordType.SUS2_SEVENTH:
            return true;
    }
    return false;
};
ConstantHarmonyElement.prototype.isSus4 = function() {
    switch (this.chordType) {
        case ChordType.SUS4:
        case ChordType.SUS4_SEVENTH:
            return true;
    }
    return false;
};

ConstantHarmonyElement.prototype.isTriad = function() {
    switch (this.chordType) {
        case ChordType.SUS2:
        case ChordType.SUS4:
        case ChordType.TRIAD:
            return true;
    }
    return false;
};

ConstantHarmonyElement.prototype.is64Triad = function() {
    return this.chordType == ChordType.TRIAD && this.chordInversions == 2;
};

ConstantHarmonyElement.prototype.is63Triad = function() {
    return this.chordType == ChordType.TRIAD && this.chordInversions == 1;
};

ConstantHarmonyElement.prototype.is53Triad = function() {
    return this.chordType == ChordType.TRIAD && this.chordInversions == 0;
};

ConstantHarmonyElement.prototype.setChordRoot = function(chordRoot) {
    this.chordRoot = chordRoot;
    return this;
};

ConstantHarmonyElement.prototype.setChordType = function(t) {
    this.chordType = t;
    return this;
};

ConstantHarmonyElement.prototype.setScaleType = function(t) {
    this.scaleType = t;
    return this;
};

ConstantHarmonyElement.prototype.getScaleType = function() {
    return this.scaleType;
};



ConstantHarmonyElement.prototype.setChordInversions = function(chordInversions) {
    this.chordInversions = chordInversions;
    return this;
};

ConstantHarmonyElement.prototype.getChordInversions = function() {
    return this.chordInversions;
};


ConstantHarmonyElement.prototype.getChordScaleIndices = function() {
    var root = this.chordRoot;
    switch (this.chordType) {
        case ChordType.CUSTOM:
            return this.chord;
        case ChordType.SEVENTH:
            return [root, root + 2, root + 4, root + 6];
        case ChordType.NINTH:
            return [root, root + 2, root + 4, root + 6, root + 8];
        case ChordType.TRIAD:
            return [root, root + 2, root + 4];
        case ChordType.SUS2:
            return [root, root + 1, root + 4];
        case ChordType.SUS2_SEVENTH:
            return [root, root + 1, root + 4, root + 6];
        case ChordType.SUS4:
            return [root, root + 3, root + 4];
        case ChordType.SUS4_SEVENTH:
            return [root, root + 3, root + 4, root + 6];
    }
//    logit("FAlling thoughlll " + this.chordType + " " + typeof(this.chordType));
    return this.chord;
};

ConstantHarmonyElement.prototype.getThirdScaleIndex = function() {

    switch (this.chordType) {
        case ChordType.SEVENTH:
        case ChordType.TRIAD:
        case ChordType.NINTH:
            return this.chordRoot + 2;
        case ChordType.SUS2:
        case ChordType.SUS2_SEVENTH:
            return this.chordRoot + 1;
        case ChordType.SUS4:
        case ChordType.SUS4_SEVENTH:
            return this.chordRoot + 3;
    }
    return this.chordRoot + 2;
};

ConstantHarmonyElement.prototype.getFifthScaleIndex = function() {
    switch (this.chordType) {
        case ChordType.SEVENTH:
        case ChordType.TRIAD:
        case ChordType.SUS2:
        case ChordType.SUS2_SEVENTH:
        case ChordType.SUS4:
        case ChordType.SUS4_SEVENTH:
        case ChordType.NINTH:
            return this.chordRoot + 4;
    }
    return this.chordRoot + 4;
};


ConstantHarmonyElement.prototype.getSeventhScaleIndex = function() {

    switch (this.chordType) {
        case ChordType.SUS2_SEVENTH:
        case ChordType.SUS4_SEVENTH:
        case ChordType.SEVENTH:
        case ChordType.NINTH:
            return this.chordRoot + 6;
    }
    return this.chordRoot + 7;
};



ConstantHarmonyElement.prototype.getBassScaleIndex = function() {

    switch (this.chordType) {
        case ChordType.SEVENTH:
        case ChordType.TRIAD:
        case ChordType.NINTH:
            return this.chordRoot + this.chordInversions * 2;
        case ChordType.SUS2:
        case ChordType.SUS2_SEVENTH:
            switch (this.chordInversions) {
                case 0:
                    return this.chordRoot;
                case 1:
                    return this.chordRoot + 1;
                case 2:
                    return this.chordRoot + 4;
                case 3:
                    return this.chordRoot + 6;
            }
            break;
        case ChordType.SUS4:
        case ChordType.SUS4_SEVENTH:
            switch (this.chordInversions) {
                case 0:
                    return this.chordRoot;
                case 1:
                    return this.chordRoot + 3;
                case 2:
                    return this.chordRoot + 4;
                case 3:
                    return this.chordRoot + 6;
            }
            break;
    }
    return this.chordRoot + this.chordInversions * 2;
};

ConstantHarmonyElement.prototype.getThirdAboveBassScaleIndex = function() {
    logit("getThirdAboveBassScaleIndex() not implemented yet... <br />");
    return this.getBassScaleIndex() + 2;
};



ConstantHarmonyElement.prototype.getChordRootPositionAbsoluteOffsets = function(maxCount) {
    var result = [];
    var scaleIndices = this.getChordRootPositionScaleIndices(maxCount);
    var scale = this.getScale();
    var first = scaleIndices[0];
    var firstAbsolute = this.getAbsoluteNote(this.baseNote, scale, first);
    var diff = firstAbsolute - this.baseNote;
    for (var i=0; i<scaleIndices.length; i++) {
        result[i] = this.getAbsoluteNote(this.baseNote, scale, scaleIndices[i]) - firstAbsolute + diff;
        //        result[i] = scale[positiveMod(scaleIndices[i], scale.length)];
        //        if (i > 0 && result[i] < result[i-1]) {
        //            result[i] += 12;
        //        }
    }
    return result;
};

ConstantHarmonyElement.prototype.getChordRootPositionScaleIndices = function(maxCount) {
    var chordRoot = this.chordRoot;

    var result = [chordRoot, chordRoot + 2, chordRoot + 4 ];
    switch (this.chordType) {
        case ChordType.CUSTOM:
            result = arrayCopy(this.chord);
            break;
        case ChordType.SEVENTH:
            result = [ chordRoot, chordRoot + 2, chordRoot + 4,
                chordRoot + 6 ];
            break;
        case ChordType.NINTH:
            result = [ chordRoot, chordRoot + 2, chordRoot + 4,
                chordRoot + 6, chordRoot + 8 ];
            break;
        case ChordType.TRIAD:
            result = [chordRoot, chordRoot + 2, chordRoot + 4 ];
            break;
        case ChordType.SUS2:
            result = [ chordRoot, chordRoot + 1, chordRoot + 4 ];
            break;
        case ChordType.SUS4:
            result = [ chordRoot, chordRoot + 3, chordRoot + 4 ];
            break;
        case ChordType.SUS2_SEVENTH:
            result = [ chordRoot, chordRoot + 1, chordRoot + 4, chordRoot + 6 ];
            break;
        case ChordType.SUS4_SEVENTH:
            result = [ chordRoot, chordRoot + 3, chordRoot + 4, chordRoot + 6 ];
            break;
    }
    if (maxCount) {
        result.length = maxCount;
    }
    return result;
};


ConstantHarmonyElement.prototype.getAbsoluteNoteFromChordBassIndex = function(index) {
    //    var theChord = this.getChordRootPositionScaleIndices();
    var chordOffsets = this.getChordRootPositionAbsoluteOffsets();
    var first = chordOffsets[0];
    for (var i=0; i<chordOffsets.length; i++) {
        chordOffsets[i] -= first;
    }
    //    logit("  Chord offsets: " + chordOffsets + " first: " + first + " baseNote: " + this.baseNote + " index: " + index + " inversions: " + this.chordInversions + "<br />");
    return this.getAbsoluteNote(this.baseNote + first, chordOffsets, index + this.chordInversions);
};


ConstantHarmonyElement.prototype.getAbsoluteNoteFromChordRootIndex = function(index, maxCount) {
    var chordOffsets = this.getChordRootPositionAbsoluteOffsets(maxCount);
    //var theChord = this.getChordRootPositionScaleIndices();
    var first = chordOffsets[0];
    for (var i=0; i<chordOffsets.length; i++) {
        chordOffsets[i] -= first;
    }
    return this.getAbsoluteNote(this.baseNote + first, chordOffsets, index);
};

ConstantHarmonyElement.prototype.getAbsoluteNoteFromScaleIndex = function(index) {
    var theScale = this.getScale();
    return this.getAbsoluteNote(this.baseNote, theScale, index);
};

ConstantHarmonyElement.prototype.getAbsoluteNotesFromScaleIndices = function(indices) {
    var theScale = this.getScale();
    var result = [];
    for (var i=0; i<indices.length; i++) {
        result.push(this.getAbsoluteNote(this.baseNote, theScale, indices[i]));
    }
    return result;
};

ConstantHarmonyElement.prototype.getChordAbsoluteNotes = function() {
    return this.getAbsoluteNotesFromScaleIndices(this.getChordScaleIndices());
};

ConstantHarmonyElement.prototype.getChordPitchClasses = function() {
    return this.getPitchClassesFromAbsoluteNotes(this.getAbsoluteNotesFromScaleIndices(this.getChordScaleIndices()));
};


ConstantHarmonyElement.prototype.getAbsoluteNote = function(absoluteBaseNote, offsets, index) {
    //    logit("Getting absolute note " + absoluteBaseNote + " " + offsets + " " + index + "<br>");
    var offsetIndex = 0;
    var octaveOffset = 0;
    offsetIndex = positiveMod(index, offsets.length);
    if (index >= 0) {
        octaveOffset = Math.floor(index / offsets.length);
    } else {
        octaveOffset = -Math.floor((-index + offsets.length - 1) / offsets.length);
    }
    return absoluteBaseNote + 12 * octaveOffset + offsets[offsetIndex];
};

ConstantHarmonyElement.prototype.getPitchClasses = function(baseNote, chordOffsets) {
    var result = [];
    for (var i = 0; i < chordOffsets.length; i++) {
        result[i] = (baseNote + chordOffsets[i]) % 12;
    }
    return result;
};

ConstantHarmonyElement.prototype.getPitchClassesFromAbsoluteNotes = function(absoluteNotes) {
    var result = [];
    for (var i = 0; i < absoluteNotes.length; i++) {
        result[i] = absoluteNotes[i] % 12;
    }
    return result;
};

ConstantHarmonyElement.prototype.getPitchClassesSetFromAbsoluteNotes = function(absoluteNotes) {
    var result = {};
    for (var i = 0; i < absoluteNotes.length; i++) {
        var pitchClass = absoluteNotes[i] % 12;
        result[pitchClass] = true;
    }
    return result;
};

ConstantHarmonyElement.prototype.getPitchClassesFromScaleIndices = function(scaleIndices) {
    var result = [];
    for (var i = 0; i < scaleIndices.length; i++) {
        result[i] = this.getAbsoluteNoteFromScaleIndex(scaleIndices[i]) % 12;
    }
    return result;
};

ConstantHarmonyElement.prototype.pitchClassDistance = function(c1, c2) {

    return Math.min(Math.abs(c1 - c2), 12 - Math.abs(c1 - c2));
};


// c2 must be "smaller" than c1
ConstantHarmonyElement.prototype.lowerPitchClassDistance = function(c1, c2) {
    if (c2 <= c1) {
        return c1 - c2;
    } else {
        return c1 + 12 - c2;
    }
};


ConstantHarmonyElement.prototype.getClosestNoteWithPitchClasses = function(absoluteNote, pitchClasses, distanceFunc) {

    if (!distanceFunc) {
        distanceFunc = this.pitchClassDistance;
    }

    absoluteNote = Math.min(127, Math.max(1, absoluteNote));

    var notePitchClass = absoluteNote % 12;
    var minDistance = 99999;
    var closestPitchClass = 0;
    for (var i = 0; i < pitchClasses.length; i++) {
        var distance = distanceFunc(notePitchClass, pitchClasses[i]);
        if (distance < minDistance) {
            minDistance = distance;
            closestPitchClass = pitchClasses[i];
        }
    }

    var upperAbs = absoluteNote + minDistance;
    var lowerAbs = absoluteNote - minDistance;

    if (upperAbs <= 127 && (upperAbs % 12) == closestPitchClass) {
        return absoluteNote + minDistance;
    } else if (lowerAbs > 1 && (lowerAbs % 12) == closestPitchClass) {
        return absoluteNote - minDistance;
    } else {
        logit("Error in getClosestNotewithPitchClasses() input " + absoluteNote + " and " + pitchClasses + "<br />");
//        logit(printStackTrace().join("<br />"));
        return Math.floor(absoluteNote / 12) * 12 + closestPitchClass;
    }
};


ConstantHarmonyElement.prototype.getChordRootIndexAndChromaticOffsetForAbsoluteNote = function(absoluteNote, maxCount) {
    var increments = this.getChordRootPositionAbsoluteOffsets(maxCount);
    var baseNote = this.getBaseNote();
    var firstInc = increments[0];
    baseNote += firstInc;
    for (var i=0; i<increments.length; i++) {
        increments[i] -= firstInc;
    }
    var result = this.getScaleIndexAndChromaticOffsetForAbsoluteNoteStatic(absoluteNote,
        baseNote, increments);
    //    logit("Getting chord root index from " + absoluteNote + " increments: " + increments + " result: " + result + "<br />");
    return result;
};


ConstantHarmonyElement.prototype.getScaleIndexAndChromaticOffsetForAbsoluteNote = function(absoluteNote) {

    return this.getScaleIndexAndChromaticOffsetForAbsoluteNoteStatic(absoluteNote,
        this.getBaseNote(), this.getScale());
};

ConstantHarmonyElement.prototype.getScaleIndexAndChromaticOffsetForAbsoluteNoteStatic = function(absoluteNote, theBaseNote, increments) {

    var chromaticOffset = 0;
    var resultIndex = 0;

    var absDiff = absoluteNote - theBaseNote;

    var diffOctave = 0;

    var normalizedNote = absDiff;
    while (normalizedNote < 0) {
        normalizedNote += 12;
        diffOctave--;
    }
    while (normalizedNote > 11) {
        normalizedNote -= 12;
        diffOctave++;
    }
    var shortestAbsDistance = 9999999;
    for (var i = 0; i < increments.length; i++) {
        if (increments[i] == normalizedNote) {
            resultIndex = i + diffOctave * increments.length;
            chromaticOffset = 0;
            break;
        } else {
            var diff = normalizedNote - increments[i];
            if (Math.abs(diff) < shortestAbsDistance) {
                shortestAbsDistance = Math.abs(diff);
                resultIndex = i + diffOctave * increments.length;
                chromaticOffset = diff;
            }
        }
    }
    return [resultIndex, chromaticOffset];
};

ConstantHarmonyElement.prototype.getScaleAbsoluteNotes = function() {
    var result = [];
    var scale = this.getScale();
    for (var i=0; i<scale.length; i++) {
        var absNote = this.getAbsoluteNoteFromScaleIndex(i);
        result.push(absNote);
    }
    return result;
};


ConstantHarmonyElement.prototype.getVerticalRelativeAbsoluteNote = function(verticalRelativeType, voiceLineElement) {
    var absoluteNote = null;
    switch (verticalRelativeType) {
        case VerticalRelativeType.VOICE_LINE:
        case VerticalRelativeType.NOTE:
            if (voiceLineElement) {
                absoluteNote = this.getAbsoluteNoteConstantVoiceLineElement(voiceLineElement);
            } else {
                absoluteNote = this.getBaseNote();
            }
            break;
        case VerticalRelativeType.MIDI_ZERO:
            absoluteNote = 0;
            break;
        case VerticalRelativeType.SCALE_BASE:
            absoluteNote = this.getBaseNote();
            break;
        case VerticalRelativeType.CHORD_ROOT:
            absoluteNote = this.getAbsoluteNoteFromChordRootIndex(0);
            break;
        case VerticalRelativeType.CHORD_BASS:
            absoluteNote = this.getAbsoluteNoteFromChordBassIndex(0);
            break;
    }
    return absoluteNote;
};

ConstantHarmonyElement.prototype.getAbsoluteNoteWithIndexType = function(index, indexType) {
    var result = 0;

    switch (indexType) {
        case IndexType.SCALE:
            result = this.getAbsoluteNoteFromScaleIndex(index);
            break;
        case IndexType.CHORD_ROOT:
            result = this.getAbsoluteNoteFromChordRootIndex(index);
            break;
        case IndexType.CHORD_BASS:
            result = this.getAbsoluteNoteFromChordBassIndex(index);
            break;
        case IndexType.MIDI_NOTE:
            result = index;
            break;
    }

    return result;
};


ConstantHarmonyElement.prototype.getAbsoluteNoteConstantVoiceLineElement = function(e) {

    // public int getAbsoluteNote(ConstantVoiceLineElement e) {
    var result = this.getAbsoluteNoteWithIndexType(e.index, e.indexType);

    //    var beforeSnap = result;
    //    var beforeSnapPitchClass = beforeSnap % 12;

    result = this.snap(result, e.snapType, this);

    //    switch (e.snapType) {
    //        case SnapType.NONE:
    //            break;
    //        case SnapType.SCALE:
    //            var pitchClasses = this.getPitchClasses(this.baseNote, this.getScale());
    //            result = this.getClosestNoteWithPitchClasses(result, pitchClasses);
    //            break;
    //        case SnapType.CHORD:
    //            var scaleIndices = this.getChordRootPositionScaleIndices();
    //            var pitchClasses = this.getPitchClassesFromScaleIndices(scaleIndices);
    //            result = this.getClosestNoteWithPitchClasses(result, pitchClasses);
    //            break;
    //    }

    //    var scalePitchClasses = this.getPitchClassesFromAbsoluteNotes(this.getScaleAbsoluteNotes());
    //    var chordOffsets = this.getChordRootPositionScaleIndices();
    //    var chordAbsOffsets = this.getChordRootPositionAbsoluteOffsets();
    //    var chordPitchClasses = this.getPitchClasses(this.baseNote, chordAbsOffsets);
    //    var resultPitchClass = result % 12;
    //    logit("Getting VL absolute note. Index: " + e.index +
    //        " index type: " + e.indexType +
    //        " snap type: " + e.snapType +
    //        " before snap: " + beforeSnap +
    //        " before snap pitch class: " + beforeSnapPitchClass +
    //        " after snap: " + result +
    //        " after snap pitch class: " + resultPitchClass +
    //        " chord pitch classes: " + chordPitchClasses +
    //        " scale pitch classes: " + scalePitchClasses +
    //        "<br />");

    return result + 12 * e.octaves;
};



ConstantHarmonyElement.prototype.snap = function(absoluteNote,
                                                 snapType, harmonyElement) {
    var result = Math.min(127, Math.max(1, absoluteNote));
    switch (snapType) {
        case SnapType.NONE:
            break;
        case SnapType.SCALE:
            var pitchClasses = harmonyElement.getPitchClasses(harmonyElement.baseNote, harmonyElement.getScale());
            result = harmonyElement.getClosestNoteWithPitchClasses(result, pitchClasses);
            break;
        case SnapType.CHORD:
            var scaleIndices = harmonyElement.getChordRootPositionScaleIndices();
            var pitchClasses = harmonyElement.getPitchClassesFromScaleIndices(scaleIndices);
            result = harmonyElement.getClosestNoteWithPitchClasses(result, pitchClasses);
            break;
    }
    return result;
};

ConstantHarmonyElement.prototype.offset = function(absoluteNote,
                                                   offsetType, offset, harmonyElement) {
    var result = absoluteNote;

    switch (offsetType) {
        case OffsetType.SCALE:
            var indexChr = harmonyElement
                .getScaleIndexAndChromaticOffsetForAbsoluteNote(result);
            var scaleIndex = indexChr[0] + offset;
            // logit("Absolute note " + absoluteNote + " gives scale index: " + scaleIndex + "<br />");
            var absNote = harmonyElement.getAbsoluteNoteFromScaleIndex(scaleIndex);
            result = absNote;
            break;
        case OffsetType.HALF_STEP:
            result = absoluteNote + offset;
            break;
        case OffsetType.CHORD:
            var indexChr = harmonyElement.getChordRootIndexAndChromaticOffsetForAbsoluteNote(result);
            result = harmonyElement.getAbsoluteNoteFromChordRootIndex(indexChr[0] + offset);
            break;
        case OffsetType.CHORD_TRIAD_ONLY:
            var indexChr = harmonyElement.getChordRootIndexAndChromaticOffsetForAbsoluteNote(result, 3);
            result = harmonyElement.getAbsoluteNoteFromChordRootIndex(indexChr[0] + offset);
            break;
        case OffsetType.CHORD_SEVENTH_ONLY:
            var indexChr = harmonyElement.getChordRootIndexAndChromaticOffsetForAbsoluteNote(result, 4);
            result = harmonyElement.getAbsoluteNoteFromChordRootIndex(indexChr[0] + offset);
            break;
        case OffsetType.OCTAVE:
            result = absoluteNote + offset * 12;
            break;
        default:
            logit(" offset type " + OffsetType.toString(offsetType)
                + " not supported yet");
            break;
    }
    return result;
};

ConstantHarmonyElement.prototype.snapOffsetSnap = function(absoluteNote,
                                                           beforeOffsetSnapType, offsetType, afterOffsetSnapType,
                                                           offset, harmonyElement) {

    var result = absoluteNote;
    result = harmonyElement.snap(result, beforeOffsetSnapType, harmonyElement);
    result = harmonyElement.offset(result, offsetType, offset, harmonyElement);
    result = harmonyElement.snap(result, afterOffsetSnapType, harmonyElement);

    return result;
};

