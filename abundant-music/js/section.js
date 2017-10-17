
function AbstractSection() {
    this.id = "";
    this.active = true;
    this.modifiers = [];
    this._constructorName = "AbstractSection";
}

AbstractSection.prototype.getConcreteSections = function(state) {
    logit("Sections need to implement getConcreteSections() " + this._constructorName + "<br />");
    return [];
};

AbstractSection.prototype.concretizeSections = function(sections, state) {
    // Make sure that we only return concrete sections
    var result = sections;
    var done = false;
    do {
        done = true;
        for (var i=0; i<result.length; i++) {
            if (!(result[i] instanceof Section)) {
                done = false;
            }
        }
        if (!done) {
            var newResult = [];
            for (var i=0; i<result.length; i++) {
                var list = result[i].getConcreteSections(state);
                addAll(newResult, list);
            }
            result = newResult;
        }
    } while (!done);

    return result;
};

AbstractSection.prototype.renderBatch = function(state) {

    var sections = this.getConcreteSections(state);

    for (var i=0; i<sections.length; i++) {
        var concreteSection = sections[i];
        if (!(concreteSection instanceof Section)) {
            logit("Failed to concretize section... " + concreteSection._constructorName + " <br />");
            continue;
        }
        for (var j=0; j<this.modifiers.length; j++) {
            var sm = this.modifiers[j];
            concreteSection = sm.modifySection(concreteSection, state);
        }
        state.oldSectionTime = state.sectionTime;
        if (concreteSection.active) {
            concreteSection.renderBatch(state);
        }
        for (var j=0; j<this.modifiers.length; j++) {
            var sm = this.modifiers[j];
            sm.beforeSectionFinalized(concreteSection, state);
        }
        for (var j=0; j<this.modifiers.length; j++) {
            var sm = this.modifiers[j];
            sm.sectionRendered(concreteSection, state);
        }
    }
};

function SectionReference(sectionId) {
    AbstractSection.call(this);
    this.section = sectionId ? sectionId : "";
    this._constructorName = "SectionReference";
}

SectionReference.prototype = new AbstractSection();

SectionReference.prototype.getConcreteSections = function(state) {
    var theSectionId = getValueOrExpressionValue(this, "section", state.module);

    var section = state.module.getSection(theSectionId);
    if (!section) {
        logit("Could not find section " + theSectionId + "<br />");
        return [];
    }
    var result = this.concretizeSections([section], state);
    return result;
};


var SectionTempoMode = {
    CONSTANT: 0,
    CHANGE_CONTROL_CHANNEL: 1,
    CONTROL_CHANNEL: 2
};


function Section() {
    AbstractSection.call(this);
    this.harmonicRythm = "";
    this.voiceLinePlanner = "";
    this.figurationPlanner = "";
    this.tempoMode = SectionTempoMode.CONSTANT;
    this.tempo = 60.0;
    this.tempoChannel = "";
    this.voiceLines = [];
    this.renderLines = [];
    this.controlLines = [];
    this.suspAntStrategies = [];
    this._constructorName = "Section";
}

Section.prototype = new AbstractSection();

Section.prototype.getConcreteSections = function(state) {
    return [this];
};

Section.prototype.addVoiceLine = function(e) {
    this.voiceLines.push(e);
    return this;
};

Section.prototype.addRenderLine = function(e) {
    this.renderLines.push(e);
    return this;
};

Section.prototype.addControlLine = function(e) {
    this.controlLines.push(e);
    return this;
};

Section.prototype.addModifier = function(e) {
    this.modifiers.push(e);
    return this;
};


Section.prototype.getVoiceLine = function(id) {
    return getObjectWithId(id, this.voiceLines);
};


Section.prototype.generateVoiceLineHarmonies = function(chr, voiceLines, module) {
    var result = {};

    for (var j=0; j<voiceLines.length; j++) {
        var voiceLine = voiceLines[j];
        var strategy = null;
        for (var i=0; i<this.suspAntStrategies.length; i++) {
            var s = this.suspAntStrategies[i];
            if (arrayContains(s.voiceLines, voiceLine.id)) {
                strategy = s;
                break;
            }
        }
        if (strategy) {
            result[voiceLine.id] = strategy.createVoiceLineHarmony(voiceLine, chr, module);
            //            logit("voice line harmonies: " + valueToJson(result).join("") + "<br />");
        }
    }

    return result;
};

Section.prototype.planVoices = function(chr, voiceLines, module) {
    var result = [];

    if (this.voiceLinePlanner) {

        var theVoiceLinePlannerId = getValueOrExpressionValue(this, "voiceLinePlanner", module);

        var planner = module.getVoiceLinePlanner(theVoiceLinePlannerId);

        if (!planner) {
            logit("Could not find voice line planner '" + theVoiceLinePlannerId + "'<br />");
        } else {
            planner.planVoices(voiceLines, chr, module, result);
        }

    } else {

        for (var i=0; i<voiceLines.length; i++) {
            var line = voiceLines[i];

            if (line instanceof DoubledVoiceLine) {
                // Doubled voice lines are dealt with when there are only ConstantVoiceLineElements (and undefined) left
                continue;
            }

            var lineElements = line.getSingleStepVoiceLineElements(chr, module);
            var newLine = new ConstantVoiceLine();
            newLine.id = line.id; // So we can find it later by using the same
            // original name
            for (var j = 0; j<lineElements.length; j++) {
                var e = lineElements[j];
                if (e instanceof ConstantVoiceLineElement || e instanceof UndefinedVoiceLineElement) {
                    newLine.add(e);
                } else {
                    logit("Only supports Constant voice line elements when no voice line planner is selected");
                }
            }
            result.push(newLine);
        }
    }

    // After all the planning is done, take care of the voice lines that are derived from other lines
    for (var i=0; i<voiceLines.length; i++) {
        var line = voiceLines[i];
        if (line instanceof DoubledVoiceLine) {
            var doubled = line.doubleVoiceLine(result);
            if (doubled) {
                result.add(doubled);
            }
        }
    }
    // logit("planned voices in section: " + result + "<br />");

    return result;
};


Section.prototype.renderBatch = function(state) {

    if (!this.active) {
        return;
    }

    // Need a place to store modified sections
    state.section = this;

    state.oldSectionTime = state.sectionTime;

    for (var i=0; i<this.modifiers.length; i++) {
        var sm = this.modifiers[i];
        state.section = sm.modifySection(state.section, state);
    }

    var harmonyId = getValueOrExpressionValue(state.section, "harmonicRythm", state.module);

    var harmony = state.module.getHarmony(harmonyId);
    if (harmony) {

        state.harmony = harmony;
        var theTempo = getValueOrExpressionValue(state.section, "tempo", state.module);
        var sectionTempoMode = this.tempoMode;

        var harmonyElements = harmony.getConstantHarmonyElements(state.module);

        var chr = new ConstantHarmonicRythm(harmonyElements);

//        logit(" constant harmony in section: " + chr.get(0).tsNumerator);

//        logit(harmonyElements);

        state.constantHarmony = chr;



        for (var i=0; i<this.modifiers.length; i++) {
            var sm = this.modifiers[i];
            state.constantHarmony = sm.modifyConstantHarmony(state.constantHarmony, state);
        }

        // Modify the voice line before planning
        state.voiceLines = state.section.voiceLines;

        // Plan the voices
        state.plannedVoiceLines = this.planVoices(state.constantHarmony, state.voiceLines, state.module);

        for (var i=0; i<this.modifiers.length; i++) {
            var sm = this.modifiers[i];
            state.plannedVoiceLines = sm.modifyPlannedVoiceLines(state.plannedVoiceLines, state);
        }

        for (var i=0; i<state.constantHarmony.getCount(); i++) {
            var che = state.constantHarmony.get(i);
            for (var j=0; j<che.sectionModifiers.length; j++) {
                var sm = che.sectionModifiers[j];
                state.plannedVoiceLines = sm.modifyPlannedVoiceLines(state.plannedVoiceLines, state);
            }
        }

        // Generate voice line harmonies
        state.voiceLineHarmonies = this.generateVoiceLineHarmonies(state.constantHarmony, state.plannedVoiceLines, state.module);

        state.renderLines = state.section.renderLines;
        state.controlLines = state.section.controlLines;
        // Add section tempo
        // logit("Setting tempo event " + state.sectionTempo + " <br />");
        for (var i=0; i<state.renderLines.length; i++) {
            //            logit("Rendering line " + i);
            var line = state.renderLines[i];
            line.renderBatch(state);
        }


        for (var j=0; j<che.sectionModifiers.length; j++) {
            var sm = che.sectionModifiers[j];
            sm.beforeControlRender(state);
        }
        perfTimer2.start();

//        logit("fsdf " + state.controlLines.length);
        for (var i=0; i<state.controlLines.length; i++) {
            var line = state.controlLines[i];
            line.renderBatch(state);
        }
        perfTimer2.pause();

        for (var j=0; j<che.sectionModifiers.length; j++) {
            var sm = che.sectionModifiers[j];
            sm.afterControlRender(state);
        }



        switch (sectionTempoMode) {
            case SectionTempoMode.CONSTANT:
                state.data.addEvent(new SetTempoEvent(theTempo, state.sectionTime));
                break;
            case SectionTempoMode.CHANGE_CONTROL_CHANNEL:
            case SectionTempoMode.CONTROL_CHANNEL:
                var tempoCh = state.module.getControlChannel(this.tempoChannel);
                if (tempoCh) {
                    var slotData = state.controlSlotDatas[tempoCh.id];
                    if (slotData) {
                        var sectionLength = state.constantHarmony.getBeatLength();
                        var slotBeatFraction = 1.0 / tempoCh.slotsPerBeat;
                        var oldTempo = 0;
                        for (var i=0; i<sectionLength; i++) {
                            for (var j=0; j<tempoCh.slotsPerBeat; j++) {
                                var slot = i * tempoCh.slotsPerBeat + j;
                                var tempoValue = tempoCh.readDouble(slot, slotData);
                                var beat = i + slotBeatFraction * j;
                                var newTempo = Math.round(theTempo * tempoValue);
                                if (newTempo > 10 && newTempo != oldTempo) {
                                    state.data.addEvent(new SetTempoEvent(newTempo, state.sectionTime + beat));
//                                    logit("Setting tempo to " + newTempo + " value: " + tempoValue + " slot: " + slot);
                                    oldTempo = newTempo;
                                } else if (newTempo <= 10) {
                                    logit("Tempo strange " + newTempo + " tempoValue:" + tempoValue + " slot: " + slot);
                                }
                            }
                        }
                    } else {
                        var tempoValue = tempoCh.readDouble(0);
                        var newTempo = Math.round(theTempo * tempoValue);
                        state.data.addEvent(new SetTempoEvent(newTempo, state.sectionTime));
//                        logit("Could not find slot data for channel " + this.tempoChannel);
                    }
                } else {
                    logit("Could not find tempo channel " + tempoCh);
                    state.data.addEvent(new SetTempoEvent(theTempo, state.sectionTime));
                }
                break;
        }

        var beatLength = state.constantHarmony.getBeatLength();
        for (var i=0; i<state.module.controlChannels.length; i++) {
            var ch = state.module.controlChannels[i];
            var slotData = state.controlSlotDatas[ch.id];
            if (!slotData) {
//                logit("Could not find any slot data for " + ch.id);
                slotData = ch.createSlotData(beatLength);
                state.controlSlotDatas[ch.id] = slotData;
            }
        }

        for (var ctrlCh in state.controlSlotDatas) {
            var slotData = state.controlSlotDatas[ctrlCh];
            var channel = state.module.getControlChannel(ctrlCh);
            var ctrlEvents = channel.getControlEvents(slotData, state.sectionTime);
//            logit("Got " + ctrlEvents.length + " control events from " + ctrlCh);
            addAll(state.data.addEvents(ctrlEvents));
        }

        for (var i=0; i<this.modifiers.length; i++) {
            var sm = this.modifiers[i];
            sm.beforeSectionFinalized(state.section, state);
        }


        for (var i=0; i<this.modifiers.length; i++) {
            var sm = this.modifiers[i];
            sm.sectionRendered(state.section, state);
        }

        // Step forward the section time
        state.sectionTime += state.constantHarmony.getBeatLength();

//        logit("SEction time: " + state.sectionTime + " " + state.constantHarmony.getBeatLength());
        state.controlSlotDatas = {};


    } else {
        logit(" could not find harmony "
            + harmonyId);
    }

};




