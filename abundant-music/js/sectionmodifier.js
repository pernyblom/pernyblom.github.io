

function SectionModifier() {
    this.id = "";
    this.active = true;
    this._constructorName = "SectionModifier";
}


SectionModifier.prototype.modifySection = function(section, state) {
    return section;
};
SectionModifier.prototype.modifyConstantHarmony = function(harmony, state) {
    return harmony;
};
SectionModifier.prototype.modifyPlannedVoiceLines = function(voiceLines, state) {
    return voiceLines;
};
SectionModifier.prototype.beforeControlRender = function(state) {
};
SectionModifier.prototype.afterControlRender = function(state) {
};
SectionModifier.prototype.beforeSectionFinalized = function(section, state) {
};
SectionModifier.prototype.sectionRendered = function(section, state) {
};



function NoteVelocitiesSectionModifier() {
    SectionModifier.call(this);
    this.curve = "";
    this.channel = "";
    this.curveBias = 0.0;
    this.curveMultiplier = 1.0;
    this.curveGlobalTime = true;
    this._constructorName = "NoteVelocitiesSectionModifier";
}

NoteVelocitiesSectionModifier.prototype = new SectionModifier();

NoteVelocitiesSectionModifier.prototype.beforeSectionFinalized = function(section, state) {
    var events = state.data.getEvents();

//    logit("Applying " + this._constructorName + " at " + state.sectionTime);

    var theCurve = state.module.getCurve(this.curve);
    if (!theCurve) {
        theCurve = new PredefinedCurve().setType(PredefinedCurveType.CONSTANT).setAmplitude(1.0);
    }

    var curveMultiplier = getValueOrExpressionValue(this, "curveMultiplier", state.module);
    var curveBias = getValueOrExpressionValue(this, "curveBias", state.module);

    for (var i=0; i<events.length; i++) {
        var e = events[i];

        if (e.time >= state.oldSectionTime && e instanceof NoteOnEvent) {
            if (!this.channel || e.renderChannel.id == this.channel) {
                var time = e.time;
                if (!this.curveGlobalTime) {
                    time = e.time - state.oldSectionTime;
                }
                var curveValue = theCurve.getValue(state.module, time);
//                logit("vel curve value at " + e.time + ": " + curveValue);
                var value = curveMultiplier * curveValue + curveBias;
                e.onVelocity *= value;
            }
        }
    }
};



function ConditionalSuspendSectionModifier() {
    SectionModifier.call(this);
    this.suspendPitchClassPairs = []; // [fromPc, toPc]
    this.harmonyIndex = 0;
    this._constructorName = "ConditionalSuspendSectionModifier";
}

ConditionalSuspendSectionModifier.prototype = new SectionModifier();

ConditionalSuspendSectionModifier.prototype.modifyPlannedVoiceLines = function(voiceLines, state) {

    var active = getValueOrExpressionValue(this, "active", state.module);

    if (active) {
        voiceLines = copyValueDeep(voiceLines);

//        logit(JSON.stringify(voiceLines));

        var absNotes = [];
        var prevAbsNotes = [];
        var prevVles = [];

        var pitchClasses = [];
        var prevPitchClasses = [];

        for (var i=0; i<voiceLines.length; i++) {
            var vl = voiceLines[i];
            var prevVle = vl.get(this.harmonyIndex);
            var prevAbsNote = state.constantHarmony.get(this.harmonyIndex).getAbsoluteNoteConstantVoiceLineElement(prevVle);
            var vle = vl.get(this.harmonyIndex + 1);
            var absNote = state.constantHarmony.get(this.harmonyIndex + 1).getAbsoluteNoteConstantVoiceLineElement(vle);
            absNotes.push(absNote);
            prevAbsNotes.push(prevAbsNote);
            prevVles.push(prevVle);
            pitchClasses.push(absNote % 12);
            prevPitchClasses.push(prevAbsNote % 12);
        }

//        logit("prevAbsnotes: " + JSON.stringify(prevAbsNotes) + " absNotes: " + JSON.stringify(absNotes));
//        logit("prevPitches: " + JSON.stringify(prevPitchClasses) + " pitches: " + JSON.stringify(pitchClasses));
//        logit("suspendPairs: " + JSON.stringify(this.suspendPitchClassPairs));


        for (var j=0; j<this.suspendPitchClassPairs.length; j++) {
            var pair = this.suspendPitchClassPairs[j];
            for (var i=0; i<absNotes.length; i++) {
                var prevAbs = prevAbsNotes[i];
                var prevPc = prevAbs % 12;
                var toAbs = absNotes[i];
                var toPc = toAbs % 12;
                if (pair[0] == prevPc && pair[1] == toPc) {
//                    logit(this._constructorName + " Modifying vle at " + this.harmonyIndex + " voice order: " + i);
                    if (prevAbs <= toAbs || prevAbs - toAbs > 2) {
                    } else {
//                        logit(this._constructorName + " Modifying vle at " + this.harmonyIndex + " voice order: " + i);
                        prevVles[i].suspend = true;
                    }
                }
            }
        }

    }
    return voiceLines;
};



function SetVariableValueSectionModifier() {
    SectionModifier.call(this);
    this.variable = "";
    this.variableProperty = "value";
    this.valueExpression = "";
    this.value = 0;
    this.restoreAfterRender = true;

    this.valueBefore = null;
    this.hasBeenSet = false;

    this._constructorName = "SetVariableValueSectionModifier";
}

SetVariableValueSectionModifier.prototype = new SectionModifier();

SetVariableValueSectionModifier.prototype.setVariable = function(v) {
    this.variable = v;
    return this;
};

SetVariableValueSectionModifier.prototype.setValueExpression = function(v) {
    this.valueExpression = v;
    return this;
};

SetVariableValueSectionModifier.prototype.modifySection = function(section, state) {
    try {
        this.hasBeenSet = false;
        var temp = null;
        if (this.valueExpression) {
            temp = getExpressionValue(this.valueExpression, state.module);
        } else {
            temp = this.value;
        }
        if (!(typeof(temp) === 'undefined') && temp != null) {
            var theVariable = state.module.getVariable(this.variable);
            if (theVariable) {
                if (typeof(theVariable[this.variableProperty]) === 'undefined') {
                    logit("The variable " + this.variable + " does not have a property '" + this.variableProperty + "' <br />");
                } else {
                    this.valueBefore = theVariable[this.variableProperty];
                    // Check if same type and if the variable has a value that can be set etc.
                    theVariable[this.variableProperty] = temp;
//                                            logit("Setting variable " + this.variable + " to " + temp);
                    this.hasBeenSet = true;
                }
            }
        }
    } catch (ex) {
        logit("" + ex);
        logit(this._constructorName + " Error in modifySection " + this.valueExpression);
        var temp = getExpressionValue(this.valueExpression, state.module);
//        logit(this._constructorName + " temp " + temp);
    }
    return section;
};


SetVariableValueSectionModifier.prototype.sectionRendered = function(section, state) {
    if (this.restoreAfterRender && this.hasBeenSet) {
        var theVariable = state.module.getVariable(this.variable);
        if (theVariable) {
            theVariable[this.variableProperty] = this.valueBefore;
        }
    }
};



function ChangeHarmonySectionModifier() {
    SectionModifier.call(this);
    this.harmony = "";

    this._constructorName = "ChangeHarmonySectionModifier";
}

ChangeHarmonySectionModifier.prototype = new SectionModifier();



ChangeHarmonySectionModifier.prototype.modifySection = function(section, state) {
    var copy = copyObjectDeep(section);
    copy.harmonicRythm = this.harmony;
    return copy;
};





function ChangeTempoSectionModifier() {
    SectionModifier.call(this);
    this.tempo = 60.0;

    this._constructorName = "ChangeTempoSectionModifier";
}

ChangeTempoSectionModifier.prototype = new SectionModifier();



ChangeTempoSectionModifier.prototype.modifySection = function(section, state) {
    var copy = copyObjectDeep(section);
    copy.tempo = this.tempo;
    return copy;
};



function TransposeSectionModifier() {
    SectionModifier.call(this);
    this.semiSteps = 0;

    this._constructorName = "TransposeSectionModifier";
}

TransposeSectionModifier.prototype = new SectionModifier();



TransposeSectionModifier.prototype.modifyConstantHarmony = function(harmony, state) {
    var copy = copyObjectDeep(harmony);
    for (var i=0; i<copy.getCount(); i++) {
        var he = copy.get(i);
        he.baseNote += this.semiSteps;
    }
    return copy;
};





