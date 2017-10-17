
var ControlChannelDatatype = {
    DOUBLE: 0,
    INTEGER: 1,
    BOOLEAN: 2,

    toString: function(type) {
        switch (type) {
            case ControlChannelDatatype.DOUBLE:
                return "Double";
            case ControlChannelDatatype.BOOLEAN:
                return "Boolean";
            case ControlChannelDatatype.INTEGER:
                return "Integer";
        }
        return "Unknown data type " + type;
    }

};
addPossibleValuesFunction(ControlChannelDatatype, ControlChannelDatatype.DOUBLE, ControlChannelDatatype.BOOLEAN);


function SlotData(slots, defaultValue, dataType) {
    this.values = [];
    this.values.length = slots;
    this.slots = slots;
    this.defaultValue = defaultValue;
    this.dataType = dataType;
}


SlotData.prototype.write = function(slot, value) {
    if (this.slotInRange(slot)) {
        this.values[slot] = value;
    }
};

SlotData.prototype.slotInRange = function(slot) {
    return slot >= 0 && slot < this.slots;
};

SlotData.prototype.slotDefined = function(slot) {
    return !(typeof(this.values[slot]) === 'undefined');
};

SlotData.prototype.read = function(slot) {
    if (this.slotDefined(slot)) {
        return this.values[slot];
    } else {
        return this.defaultValue;
    }
};

var ControlChannelControlWriteMode = {
    NONE: 0,
    SET_CONTROL: 1
}

function ControlChannel() {
    this.id = "";
    this.active = true;
    this.slotsPerBeat = 16;
    this.mixWithDefault = false; // Whether to consider the default value to be a written value that should be used when mixing
    this.controlWriteMode = ControlChannelControlWriteMode.NONE; // What types of control events to add automatically

    this.dataType = ControlChannelDatatype.DOUBLE;

    this._constructorName = "ControlChannel";
}

ControlChannel.prototype.getControlEvents = function(slotData, beatOffset, module) {
    var result = [];

    var active = getValueOrExpressionValue(this, "active", module);

    if (this.controlWriteMode != ControlChannelControlWriteMode.NONE && active) {

        var oldValue = 0;
        var stepLength = 1.0 / this.slotsPerBeat;
        for (var i=0; i<slotData.values.length; i++) {
            var value = slotData.values[i];
            if (typeof(value) === 'undefined') {
                value = this.defaultValue;
            }
            if (i == 0 || value != oldValue) {
                var beatTime = beatOffset + i * stepLength;
                var ev = new SetControlEvent(value, beatTime, this);
                result.push(ev);
            }
            oldValue = value;
        }
    }
    return result;
};

ControlChannel.prototype.createSlotData = function(beatCount) {
    var result = new SlotData(Math.round(beatCount * this.slotsPerBeat), this.defaultValue, this.dataType);
    return result;
};


ControlChannel.prototype.writeInt = function(slot, slotData, intValue) {
    logit("-- All control channels must implement writeInt()");
};

ControlChannel.prototype.writeDouble = function(slot, slotData, doubleValue) {
    logit("-- All control channels must implement writeDouble()");
};

ControlChannel.prototype.writeBoolean = function(slot, slotData, booleanValue) {
    logit("-- All control channels must implement writeBoolean()");
};

ControlChannel.prototype.readInt = function(slot, slotData) {
    logit("-- All control channels must implement readInt()");
};

ControlChannel.prototype.readDouble = function(slot, slotData) {
    logit("-- All control channels must implement readDouble()");
};

ControlChannel.prototype.readBoolean = function(slot, slotData) {
    logit("-- All control channels must implement readBoolean()");
};


var NumericControlChannelMixMode = {
    ADD: 0,
    MULT: 1,
    MIN: 2,
    MAX: 3,
    MEAN: 4,
    OVERWRITE_FIRST: 5,
    OVERWRITE_LAST: 6,

    mix: function(type, oldValue, newValue) {
        switch (type) {
            case NumericControlChannelMixMode.ADD:
                return oldValue + newValue;
            case NumericControlChannelMixMode.MAX:
                return Math.max(oldValue, newValue);
            case NumericControlChannelMixMode.MEAN:
                return (oldValue + newValue) / 2;
            case NumericControlChannelMixMode.MIN:
                return Math.min(oldValue, newValue);
            case NumericControlChannelMixMode.MULT:
                return oldValue * newValue;
            case NumericControlChannelMixMode.OVERWRITE_FIRST:
                return oldValue;
            case NumericControlChannelMixMode.OVERWRITE_LAST:
                return newValue;
        }
        return oldValue + newValue;
    },

    toString: function(type) {
        switch (type) {
            case NumericControlChannelMixMode.ADD:
                return "Add";
            case NumericControlChannelMixMode.MAX:
                return "Max";
            case NumericControlChannelMixMode.MEAN:
                return "Mean";
            case NumericControlChannelMixMode.MIN:
                return "Min";
            case NumericControlChannelMixMode.MULT:
                return "Mult";
            case NumericControlChannelMixMode.OVERWRITE_FIRST:
                return "Overwrite first";
            case NumericControlChannelMixMode.OVERWRITE_LAST:
                return "Overwrite last";
        }
        return "Unknown mix mode " + type;
    }
};
addPossibleValuesFunction(NumericControlChannelMixMode, NumericControlChannelMixMode.ADD, NumericControlChannelMixMode.OVERWRITE_LAST);


function DoubleControlChannel() {
    ControlChannel.call(this);
    this.defaultValue = 0.0;
    this.useRange = false;
    this.range = [-1.0, 1.0];

    this.mixMode = NumericControlChannelMixMode.ADD;

    this.trueWriteValue = 1; // If a boolean value is written, this is the resulting value
    this.falseWriteValue = 0;

    this.readIntSnapMetrics = SnapMetrics.ROUND;

    this.dataType = ControlChannelDatatype.DOUBLE;

    this._constructorName = "DoubleControlChannel";
}

DoubleControlChannel.prototype = new ControlChannel();


DoubleControlChannel.prototype.writeDouble = function(slot, slotData, doubleValue) {
    if (slotData.slotInRange(slot)) {
        if (slotData.slotDefined(slot) || this.mixWithDefault) {
            // Mix it
            var oldValue = slotData.read(slot);
            var unclamped = NumericControlChannelMixMode.mix(this.mixMode, oldValue, doubleValue);
            var clamped = this.useRange ? clamp(unclamped, this.range[0], this.range[1]) : unclamped;
            slotData.write(slot, clamped);
        } else {
            // Write
            var clamped = this.useRange ? clamp(doubleValue, this.range[0], this.range[1]) : doubleValue;
            slotData.write(slot, clamped);
        }
    }
};

DoubleControlChannel.prototype.readDouble = function(slot, slotData) {
    if (slotData && slotData.slotDefined(slot)) {
        return slotData.read(slot);
    } else {
        return this.defaultValue;
    }
};


function IntegerControlChannel() {
    ControlChannel.call(this);
    this.defaultValue = 0;
    this.mixSnapMetrics = SnapMetrics.ROUND;
    this.useRange = false;
    this.range = [-1, 1];
    this.mixMode = NumericControlChannelMixMode.ADD;
    this.trueWriteValue = 1; // If a boolean value is written, this is the resulting value
    this.falseWriteValue = 0;

    this.dataType = ControlChannelDatatype.INTEGER;

    this._constructorName = "IntegerControlChannel";
}

IntegerControlChannel.prototype = new ControlChannel();

IntegerControlChannel.prototype.writeInt = function(slot, slotData, intValue) {
    if (slotData.slotInRange(slot)) {
        if (slotData.slotDefined(slot) || this.mixWithDefault) {
            // Mix it
            var oldValue = slotData.read(slot);
            var mixed = NumericControlChannelMixMode.mix(this.mixMode, oldValue, intValue);
            var snapped = SnapMetrics.snap(mixed, this.mixSnapMetrics);
            var clamped = this.useRange ? clamp(snapped, this.range[0], this.range[1]) : snapped;
            slotData.write(slot, clamped);
        } else {
            // Write
            var clamped = this.useRange ? clamp(intValue, this.range[0], this.range[1]) : intValue;
            slotData.write(slot, clamped);
        }
    }
};



var BooleanControlChannelMixMode = {
    OR: 0,
    AND: 1,
    NOR: 2,
    NAND: 3,
    XOR: 4,
    OVERWRITE_FIRST: 5,
    OVERWRITE_LAST: 6,

    mix: function(type, oldValue, newValue) {
        switch (type) {
            case BooleanControlChannelMixMode.OR:
                return oldValue || newValue;
            case BooleanControlChannelMixMode.AND:
                return oldValue && newValue;
            case BooleanControlChannelMixMode.NOR:
                return !(oldValue || newValue);
            case BooleanControlChannelMixMode.NAND:
                return !(oldValue && newValue);
            case BooleanControlChannelMixMode.XOR:
                return (oldValue || newValue) && !(oldValue && newValue);
            case BooleanControlChannelMixMode.OVERWRITE_FIRST:
                return oldValue;
            case BooleanControlChannelMixMode.OVERWRITE_LAST:
                return newValue;
        }
        return oldValue || newValue;
    },

    toString: function(type) {
        switch (type) {
            case BooleanControlChannelMixMode.OR:
                return "Or";
            case BooleanControlChannelMixMode.AND:
                return "And";
            case BooleanControlChannelMixMode.NOR:
                return "Nor";
            case BooleanControlChannelMixMode.NAND:
                return "Nand";
            case BooleanControlChannelMixMode.XOR:
                return "Xor";
            case BooleanControlChannelMixMode.OVERWRITE_FIRST:
                return "Overwrite first";
            case BooleanControlChannelMixMode.OVERWRITE_LAST:
                return "Overwrite last";
        }
        return "Unknown mix mode " + type;
    }

};
addPossibleValuesFunction(BooleanControlChannelMixMode, BooleanControlChannelMixMode.OR, BooleanControlChannelMixMode.OVERWRITE_LAST);


function BooleanControlChannel() {
    ControlChannel.call(this);
    this.defaultValue = false;
    this.doubleWriteThreshold = 0.5; // Over this value and it becomes true
    this.intWriteThreshold = 1; // Over this value and it becomes true

    this.mixMode = BooleanControlChannelMixMode.OR;

    // When reading int
    this.trueReadIntValue = 1;
    this.falseReadIntValue = 0;

    this.trueReadDoubleValue = 1.0;
    this.falseReadDoubleValue = 0.0;

    this.dataType = ControlChannelDatatype.BOOLEAN;

    this._constructorName = "BooleanControlChannel";
}

BooleanControlChannel.prototype = new ControlChannel();

BooleanControlChannel.prototype.writeBoolean = function(slot, slotData, booleanValue) {
    if (slotData.slotInRange(slot)) {
        if (slotData.slotDefined(slot) || this.mixWithDefault) {
            // Mix it
            var oldValue = slotData.read(slot);
            var mixed = BooleanControlChannelMixMode.mix(this.mixMode, oldValue, booleanValue);
            slotData.write(slot, mixed);
        } else {
            // Write
            slotData.write(slot, booleanValue);
        }
    }
};


