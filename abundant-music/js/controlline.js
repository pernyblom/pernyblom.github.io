
function ControlLine() {
    this.id = "";
    this._constructorName = "ControlLine";
}

ControlLine.prototype.copy = function() {
    return copyObjectDeep(this);
};

ControlLine.prototype.getPrimitiveControlLines = function(module, harmony) {
    return [this];
};

ControlLine.prototype.renderBatch = function(state) {
    var lines = this.getPrimitiveControlLines(state.module, state.constantHarmony);

    var allElements = [];
    var allChannels = [];


    for (var j=0; j<lines.length; j++) {
        var controlLine = lines[j];
        var controlChannel = state.module.getControlChannel(controlLine.channel);
        if (!controlChannel) {
            logit(" could not find control channel " + controlLine.channel);
            continue;
        }
        var elements = controlLine.getPrimitiveControlElements(state.module, state.constantHarmony);
        for (var i=0; i<elements.length; i++) {
            allChannels.push(controlChannel);
        }

        addAll(allElements, elements);
    }

    var beatLength = state.constantHarmony.getBeatLength();

    for (var i=0; i<allElements.length; i++) {
        var e = allElements[i];
        state.controlChannel = allChannels[i];
        state.controlSlotData = state.controlSlotDatas[state.controlChannel.id];
        if (! state.controlSlotData) {
            state.controlSlotData = state.controlChannel.createSlotData(beatLength);
            state.controlSlotDatas[state.controlChannel.id] = state.controlSlotData;
        }
        e.renderBatch(state);
    }


};

function PrimitiveControlLine() {
    ControlLine.call(this);
    this.channel = "";
    this.controlElements = [];
    this._constructorName = "PrimitiveControlLine";
}

PrimitiveControlLine.prototype = new ControlLine();


PrimitiveControlLine.prototype.getPrimitiveControlElements = function(module, harmony) {
    var result = [];
    for (var i=0; i<this.controlElements.length; i++) {
        var e = this.controlElements[i];
        addAll(result, e.getPrimitiveControlElements(module, harmony));
    }
    return result;
};


PrimitiveControlLine.prototype.addControlElement = function(e) {
    this.controlElements.push(e);
    return this;
};

function ControlElement() {
    this.id = "";
    this.active = true;

    this._constructorName = "ControlElement";
}

ControlElement.prototype.getPrimitiveControlElements = function(module, harmony) {
    return [this];
};


function PositionedControlElement() {
    ControlElement.call(this);
    this.startTime = 0;
    this.startTimeUnit = PositionUnit.BEATS;

    this.endTime = 1;
    this.endTimeUnit = PositionUnit.BEATS;

    this.controlOffset = 0; // An extra "write"-pointer offset
    this.controlOffsetUnit = PositionUnit.BEATS;
    this._constructorName = "PositionedControlElement";

}

PositionedControlElement.prototype = new ControlElement();


function MultiStepControlElement() {
    PositionedControlElement.call(this);
    this.startIndices = [];
    this.indices = [];
    this.endIndices = [];

    this.elements = [];
    this._constructorName = "MultiStepControlElement";
}
MultiStepControlElement.prototype = new PositionedControlElement();

MultiStepControlElement.prototype.getPrimitiveControlElements = function(module, harmony) {
    var result = [];

    var active = getValueOrExpressionValue(this, "active", module);
    if (!active) {
        return result;
    }

    var currentBeat = positionUnitToBeats2(this.startTime, this.startTimeUnit, 0, harmony);

    var harmonyBeatLength = harmony.getBeatLength();

    var startIndices = getValueOrExpressionValue(this, "startIndices", module);
    var indices = getValueOrExpressionValue(this, "indices", module);
    var endIndices = getValueOrExpressionValue(this, "endIndices", module);

//    logit(startIndices + " " + indices + " " + endIndices);

    if (this.verbose) {
        logit(this._constructorName + " " + startIndices + " " + indices + " " + endIndices + " " + this.activeExpression + " " + this.activeUseExpression);
    }

    var that = this;

    function getLength(testIndices, beatOffset, elements) {
        var result = 0;
        for (var i=0; i<testIndices.length; i++) {
            var index = testIndices[i];
            if (index < elements.length) {
                var element = elements[index];
                var primitiveElements = element.getPrimitiveControlElements(module, harmony);

                var maxEndBeat = 0;
                for (var j=0; j<primitiveElements.length; j++) {
                    var pElement = primitiveElements[j];
                    var endBeat = positionUnitToBeats2(pElement.endTime, pElement.endTimeUnit, result, harmony);
//                    logit("   endBeat in getLength(): " + endBeat + " pElement.endTime: " + pElement.endTime + " pElement.endTimeUnit: " + pElement.endTimeUnit);
//                    logit("    " + JSON.stringify(pElement));
                    maxEndBeat = Math.max(maxEndBeat, endBeat);
                }
                result += maxEndBeat;
            }
        }
        return result;
    }

    function appendWithIndex(index, beatOffset, elements) {

        if (that.verbose) {
            logit("  Rendering at index " + index + " beat: " + beatOffset);
        }


        var beatStep = 1;
        if (index < elements.length) {
            var element = elements[index];
            element = copyObjectDeep(element);
            var primitiveElements = element.getPrimitiveControlElements(module, harmony);

            var maxEndBeat = 0;
            for (var i=0; i<primitiveElements.length; i++) {
                var pElement = primitiveElements[i];

                // Shift the position
                var startBeat = positionUnitToBeats2(pElement.startTime, pElement.startTimeUnit, 0, harmony);
                var endBeat = positionUnitToBeats2(pElement.endTime, pElement.endTimeUnit, 0, harmony);

                pElement.startTime = startBeat + beatOffset;
                pElement.startTimeUnit = PositionUnit.BEATS;
                pElement.endTime = endBeat + beatOffset;
                pElement.endTimeUnit = PositionUnit.BEATS;

                result.push(pElement);

                maxEndBeat = Math.max(maxEndBeat, endBeat);
            }
            return Math.max(1, maxEndBeat);
        }
        return beatStep;
    }

    var stepIndex = 0;
    while (currentBeat < harmonyBeatLength) {

        var beatStep = 1;

        // Check the length of the end
        var endLength = getLength(endIndices, currentBeat, this.elements);

        var renderEnd = false;

        if (stepIndex < startIndices.length) {
            var index = startIndices[stepIndex];
            beatStep = getLength([index], currentBeat, this.elements);
            if (currentBeat + beatStep + endLength <= harmonyBeatLength) {
                beatStep = appendWithIndex(index, currentBeat, this.elements);
            } else {
                renderEnd = true;
            }
        } else if (indices.length > 0) {
            var index = indices[positiveMod(stepIndex - startIndices.length, indices.length)];
            beatStep = getLength([index], currentBeat, this.elements);
            if (currentBeat + beatStep + endLength <= harmonyBeatLength) {
                beatStep = appendWithIndex(index, currentBeat, this.elements);
            } else {
                renderEnd = true;
            }
        } else if (currentBeat + beatStep + endLength > harmonyBeatLength) {
            renderEnd = true;
        }

        if (renderEnd) {
            beatStep = harmonyBeatLength - currentBeat;
            currentBeat = harmonyBeatLength - endLength;
            var totalBeatStep = 0;
            for (var i=0; i<endIndices.length; i++) {
                totalBeatStep += appendWithIndex(endIndices[i], currentBeat, this.elements);
            }
            if (totalBeatStep > 0.01) {
                beatStep = totalBeatStep;
            }
            break;
        }

        currentBeat += beatStep;
        stepIndex++;
    }

    return result;
};


function MultiParallelControlElement() {
    PositionedControlElement.call(this);
    this.indices = [];

    this.elements = [];
    this._constructorName = "MultiParallelControlElement";
}
MultiParallelControlElement.prototype = new PositionedControlElement();

MultiParallelControlElement.prototype.getPrimitiveControlElements = function(module, harmony) {
    var result = [];

    var active = getValueOrExpressionValue(this, "active", module);
    if (!active) {
        return result;
    }

    var currentBeat = positionUnitToBeats2(this.startTime, this.startTimeUnit, 0, harmony);

    var indices = getValueOrExpressionValue(this, "indices", module);

//    logit(startIndices + " " + indices + " " + endIndices);

    if (this.verbose) {
        logit(this._constructorName + " " + indices + " " + this.activeExpression + " " + this.activeUseExpression);
    }

    var that = this;


    function appendWithIndex(index, beatOffset, elements) {
        if (that.verbose) {
            logit(that._constructorName + " Rendering at index " + index + " beat: " + beatOffset);
        }
        if (index < elements.length) {
            var element = elements[index];
            element = copyObjectDeep(element);
            var primitiveElements = element.getPrimitiveControlElements(module, harmony);

            for (var i=0; i<primitiveElements.length; i++) {
                var pElement = primitiveElements[i];

                // Shift the position
                var startBeat = positionUnitToBeats2(pElement.startTime, pElement.startTimeUnit, 0, harmony);
                var endBeat = positionUnitToBeats2(pElement.endTime, pElement.endTimeUnit, 0, harmony);

                pElement.startTime = startBeat + beatOffset;
                pElement.startTimeUnit = PositionUnit.BEATS;
                pElement.endTime = endBeat + beatOffset;
                pElement.endTimeUnit = PositionUnit.BEATS;

                result.push(pElement);
            }
        }
    }

    for (var i=0; i<indices.length; i++) {
        appendWithIndex(indices[i], currentBeat, this.elements);
    }

    return result;
};


function PrimitiveControlElement() {
    PositionedControlElement.call(this);
    this.batched = false;

    this._constructorName = "PrimitiveControlElement";
}

PrimitiveControlElement.prototype = new PositionedControlElement();


PrimitiveControlElement.prototype.renderBatch = function(state) {

    var active = getValueOrExpressionValue(this, "active", state.module);

    if (!active) {
        return;
    }

    var harmony = state.constantHarmony;

    var startBeatTime = positionUnitToBeats(this.startTime, this.startTimeUnit,
        harmony.tsNumerator, harmony.tsDenominator, harmony);
    var endBeatTime = positionUnitToBeats(this.endTime, this.endTimeUnit,
        harmony.tsNumerator, harmony.tsDenominator, harmony);

    var slotData = state.controlSlotData;
    var channel = state.controlChannel;

    var startSlot = channel.slotsPerBeat * startBeatTime;
    var endSlot = channel.slotsPerBeat * endBeatTime - 1;

    var slotCount = endSlot - startSlot + 1;

    if (this.batched) {
        var slotIndices = [];
        var slotFractions = [];
        for (var i=startSlot; i<=endSlot; i++) {
            var slotFraction = (i - startSlot) / slotCount;
            slotFractions.push(slotFraction);
            slotIndices.push(i);
        }
        this.renderAtSlots(slotIndices, startSlot, endSlot, slotFractions, startBeatTime, endBeatTime, state, slotData);
    } else {
        for (var i=startSlot; i<=endSlot; i++) {
            var slotFraction = (i - startSlot) / slotCount;
            this.renderAtSlot(i, startSlot, endSlot, slotFraction, startBeatTime, endBeatTime, state, slotData);
        }
    }
};


PrimitiveControlElement.prototype.renderAtSlot = function(slotIndex, startSlot, endSlot, slotFraction,
                                                          startBeatTime, endBeatTime, state, slotData) {
};
PrimitiveControlElement.prototype.renderAtSlots = function(slotIndices, startSlot, endSlot, slotFractions,
                                                           startBeatTime, endBeatTime, state, slotData) {
};


function CurveControlElement() {
    PrimitiveControlElement.call(this);
    this.curve = "";

    this.cycles = 1.0;
    this.cyclesUnit = CyclesUnit.CYCLES_PER_PERIOD;

    this.amplitude = 1.0;
    this.bias = 0.0;
    this.phase = 0.0;
    this.frequencyMultiplier = 1.0;

    this.constantValue = 0.0; // When no curve is selected or not found

    this.theCurve = null;
    this._constructorName = "CurveControlElement";
}

CurveControlElement.prototype = new PrimitiveControlElement();



CurveControlElement.prototype.renderAtSlot = function(slotIndex, startSlot, endSlot, slotFraction,
                                                      startBeatTime, endBeatTime, state, slotData) {

    var x = slotFraction;

    this.theCurve = CurveComputation.prototype.getCurveReference(state.module, this.theCurve, this.curve);

    var rawValue = CurveComputation.prototype.getCurveOrConstantValue(state.module,
        this.frequencyMultiplier * (x + this.phase),
        this.theCurve, this.constantValue);
    var value = this.bias + this.amplitude * rawValue;

    if (this.verbose) {
        logit(this._constructorName + " writing " + value + " at " + slotIndex + " rawValue: " + rawValue + " amp: " + this.amplitude + " bias: " + this.bias + " slotFraction: " + slotFraction);
    }

    state.controlChannel.writeDouble(slotIndex, slotData, value);
};


function NaturalTempoCurveControlElement() {
    SectionModifier.call(this);
    this.baseTempo = 120.0;
    this.prevTempo = 120.0;
    this.currentTempo = 120.0;
    this.nextTempo = 120.0;

    // The default settings is to span a complete harmony
    this.startTime = 0;
    this.startTimeUnit = PositionUnit.HARMONY;
    this.endTime = 1;
    this.endTimeUnit = PositionUnit.HARMONY;


    this.batched = true; // so that renderAtSlots() is called

    this._constructorName = "NaturalTempoCurveControlElement";
}

NaturalTempoCurveControlElement.prototype = new PrimitiveControlElement();

NaturalTempoCurveControlElement.prototype.renderAtSlots = function(slotIndices, startSlot, endSlot, slotFractions,
                                                                   startBeatTime, endBeatTime, state, slotData) {

    var baseTempo = getValueOrExpressionValue(this, "baseTempo", state.module);
    var prevTempo = getValueOrExpressionValue(this, "prevTempo", state.module);
    var currentTempo = getValueOrExpressionValue(this, "currentTempo", state.module);
    var nextTempo = getValueOrExpressionValue(this, "nextTempo", state.module);

//    logit(this._constructorName + " prev: " + prevTempo + " cur: " + currentTempo + " next: " + nextTempo);

    var largeFraction = 0.95;
    var smallFraction = 1.0 - largeFraction;

    var fractionAboveCurrent = currentTempo / baseTempo;
    var fractionAbovePrev = prevTempo / baseTempo;
    var fractionAboveNext = nextTempo / baseTempo;

    var halfPrev = 0.5 * (fractionAbovePrev + 1.0);
    var halfNext = 0.5 * (fractionAboveCurrent + 1.0);

    // End increase always ends with the current fraction
    // Start increase always starts with previous fraction
    // Start decrease always starts half between prev and base fraction
    // End decrease always ends with half between current and base fraction
    //

    var increaseXValues = [0, 1];
    var increaseYValues = [fractionAbovePrev, fractionAboveCurrent];

    var increaseDecreaseXValues = [0, largeFraction, 1];
    var increaseDecreaseYValues = [fractionAbovePrev, fractionAboveCurrent, halfNext];

    var decreaseIncreaseXValues = [0.0, smallFraction, 1];
    var decreaseIncreaseYValues = [halfPrev, 1.0, fractionAboveCurrent];

    var decreaseIncreaseDecreaseXValues = [0.0, smallFraction, largeFraction, 1];
    var decreaseIncreaseDecreaseYValues = [halfPrev, 1.0, fractionAboveCurrent, halfNext];

    var xValues = increaseXValues;
    var yValues = increaseYValues;
//    logit("prev: " + prevTempo + " cur: " + currentTempo + " next: " + nextTempo);
    if (currentTempo < prevTempo) {
        if (nextTempo >= currentTempo) {
            xValues = decreaseIncreaseXValues;
            yValues = decreaseIncreaseYValues;
        } else {
            xValues = decreaseIncreaseDecreaseXValues;
            yValues = decreaseIncreaseDecreaseYValues;
        }
    } else if (currentTempo >= prevTempo) {
        // When the tempos are same, there should be an increase anyway
        if (nextTempo >= currentTempo) {
            xValues = increaseXValues;
            yValues = increaseYValues;
        } else {
            xValues = increaseDecreaseXValues;
            yValues = increaseDecreaseYValues;
        }
    }
    // Creating a new interpolator for each call, wasteful but maybe not that terrible...
    var func = new LinearInterpolator(xValues, yValues);


//    logit("  xValues: " + xValues.join(", ") + " yValues: " + yValues.join(", "));

    for (var i=0; i<slotIndices.length; i++) {
        var x = slotFractions[i];
        var slotIndex = slotIndices[i];
        var value = func.interpolate(x);

        state.controlChannel.writeDouble(slotIndex, slotData, value);
    }

//    state.controlChannel.writeDouble(slotIndex, slotData, value);
};






