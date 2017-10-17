


function ControlRoll(options) {
    GuiComponent.call(this, options);
    this.beatWidth = getValueOrDefault(options, "beatWidth", 50);
    this.slotsPerBeat = getValueOrDefault(options, "slotsPerBeat", 32);
    this.beatLengthRange = getValueOrDefault(options, "beatLengthRange", [1, 1]);
    this.harmony = getValueOrDefault(options, "harmony", new ConstantHarmonicRythm([new ConstantHarmonyElement()]));
    this.slotData = getValueOrDefault(options, "slotData", null);
    this.autoControlLimits = getValueOrDefault(options, "autoControlLimits", true);
    this.controlLimits = getValueOrDefault(options, "controlLimits", [-1, 1]); // Only used for double and integer
    this.paddingLeft = getValueOrDefault(options, "paddingLeft", 60);
    this.updateControlLimits();
    this.updateSize();
}

ControlRoll.prototype = new GuiComponent();

ControlRoll.prototype.updateControlLimits = function() {
    if (this.autoControlLimits && this.slotData != null) {
        var minLimit = -1;
        var maxLimit = 1;
        this.controlLimits = [minLimit, maxLimit];
    } else if (this.renderData == null) {
        this.noteLimits = [-1, 1];
    } else {
// Just keep the current limits
}
};

ControlRoll.prototype.getHeaderHeight = function() {
    return 0;
};

ControlRoll.prototype.getFooterHeight = function() {
    return 0;
};


ControlRoll.prototype.getControlRowsWidth = function() {
    var ches = this.harmony.getConstantHarmonyElements();
    var harmonyWidth = 0;
    for (var i=0; i<ches.length; i++) {
        var e = ches[i];
        var beats = positionUnitToBeats(e.getLength(), e.getLengthUnit(), e.tsNumerator, e.tsDenominator);
        harmonyWidth += beats * this.beatWidth;
    }
//    var dataWidth = 0;
//    if (this.renderData) {
//        var limits = this.renderData.getTimeLimits();
//        dataWidth = Math.ceil(limits[1] * this.beatWidth);
//    }

    return Math.max(harmonyWidth, dataWidth);
};



ControlRoll.prototype.updateSize = function() {
    this.updateControlLimits();
    if (this.autoWidth) {
        var sum = 0;
        if (this.showKeys) {
            sum += this.keysWidth;
        }
        sum += this.getNoteRowsWidth();

        this.width = sum;
    }
    if (this.autoHeight) {
        var sum = 0;

        // Calculate header height

        // Calculate note rows height
        var rows = this.noteLimits[1] - this.noteLimits[0] + 1;
        sum += this.noteRowHeight * rows;

        // Calculate footer height
        this.height = sum;
    }
};

ControlRoll.prototype.paintRows = function(x, y, context) {
    var startNote = this.noteLimits[0];
    var endNote = this.noteLimits[1];

    var range = endNote - startNote + 1;
    var w = this.getNoteRowsWidth();
    for (var i=0; i<range; i++) {
        if (i % 2 == 0) {
            context.fillStyle = "#aaaaaa";
        } else {
            context.fillStyle = "#cccccc";
        }
        context.fillRect(x, y + i * this.noteRowHeight, w, this.noteRowHeight);
    }

    // Paint the beat lines
    var beats = w / this.beatWidth;
    var currentX = x;
    context.beginPath();
    for (var i=0; i<beats; i++) {
        currentX = x + i * this.beatWidth;
        context.moveTo(currentX, y);
        context.lineTo(currentX, y + range * this.noteRowHeight);
    }
    context.lineWidth = 1;
    context.strokeStyle = "#888888";
    context.stroke();

    var ches = this.harmony.getConstantHarmonyElements();

    var totalHeight = this.noteRowHeight * range;

    if (this.highlightScales || this.highlightChords) {

        currentX = x;
        for (var i=0; i<ches.length; i++) {
            var e = ches[i];
            var beats = positionUnitToBeats(e.getLength(), e.getLengthUnit(), e.tsNumerator, e.tsDenominator);
            var scalePitchClasses = e.getPitchClassesFromAbsoluteNotes(e.getScaleAbsoluteNotes());
            var chordPitchClasses = e.getPitchClassesFromAbsoluteNotes(e.getAbsoluteNotesFromScaleIndices(e.getChordRootPositionScaleIndices()));
            for (var j=0; j<range; j++) {
                var note = j + startNote;
                var pitchClass = note % 12;
                var highlightScale = arrayContains(scalePitchClasses, pitchClass);
                var highlightChord = arrayContains(chordPitchClasses, pitchClass);
                var noteY = y + totalHeight - (j + 1) * this.noteRowHeight;
                if (highlightChord && this.highlightChords) {
                    context.fillStyle = "#ffff00";
                    context.fillRect(currentX, noteY, beats * this.beatWidth, this.noteRowHeight);
                } else if (highlightScale && this.highlightScales) {
                    context.fillStyle = "#ffffff";
                    context.fillRect(currentX, noteY, beats * this.beatWidth, this.noteRowHeight);
                }
            }
            currentX += beats * this.beatWidth;
        }
    }
    // Paint the harmony lines
    currentX = x;
    context.beginPath();
    for (var i=0; i<ches.length; i++) {
        var e = ches[i];
        var beats = positionUnitToBeats(e.getLength(), e.getLengthUnit(), e.tsNumerator, e.tsDenominator);
        currentX += beats * this.beatWidth;
        context.moveTo(currentX, y);
        context.lineTo(currentX, y + range * this.noteRowHeight);
    }
    context.lineWidth = 2;
    context.strokeStyle = "#666666";
    context.stroke();

};

ControlRoll.prototype.paint = function(offsetX, offsetY, context) {
    if (!offsetX) {
        offsetX = 0;
    }
    if (!offsetY) {
        offsetY = 0;
    }

    // Paint one harmony at a time since the time signature can change
    context.fillStyle = "#444444";
    context.fillRect(offsetX, offsetY, this.width, this.height);

    var keysY = offsetY;
    if (this.showKeys) {
        this.paintKeys(offsetX, keysY, context);
    }

    var rowsX = offsetX;
    var rowsY = keysY;
    rowsX += this.paddingLeft;
    this.paintRows(rowsX, rowsY, context);

    this.paintNotes(rowsX, rowsY, context);

};

