function VoiceLinePlanner() {
    this.id = "";
    this.maxSearchStepsPerStep = 5000;
    this.constraintZones = [];
    this._constructorName = "VoiceLinePlanner";
}

VoiceLinePlanner.prototype.planVoices = function(voiceLines, chr, module, result) {
    logit("A voice line planner must implement planVoices()<br />");
};



function ClassicalVoiceLinePlanner() {
    VoiceLinePlanner.call(this);
    this.defaultAbsoluteNoteRange = [20, 110];
    this.defaultMaxSpacing = 12;
    this.defaultHintDistance = 6;

    this._constructorName = "ClassicalVoiceLinePlanner";
}

ClassicalVoiceLinePlanner.prototype = new VoiceLinePlanner();

ClassicalVoiceLinePlanner.prototype.planVoices = function(voiceLines, chr, module, result) {

    var constraints = [];
    for (var i=0; i<this.constraintZones.length; i++) {
        var zone = this.constraintZones[i];
        zone.applyZone(chr, constraints);
    }

    var absoluteNoteRanges = [];
    var penaltyAbsoluteNoteRanges = [];
    var constants = [];
    var undefines = [];
    var hints = [];
    var hintDistances = [];
    var penaltyHintDistances = [];
    var chordRootConstraints = [];
    var chordBassConstraints = [];
    var maxSpacings = [];
    var penaltyMaxSpacings = [];
    var suspensions = [];
    var anticipations = [];

    for (var i=0; i<voiceLines.length; i++) {
        var line = voiceLines[i];

        if (line instanceof DoubledVoiceLine) {
            // Doubled voice lines are dealt with after planning
            continue;
        }

        var lineElements = line.getSingleStepVoiceLineElements(chr, module)

        hints[i] = [];
        hintDistances[i] = [];
        penaltyHintDistances[i] = [];
        absoluteNoteRanges[i] = [];
        penaltyAbsoluteNoteRanges[i] = [];
        chordRootConstraints[i] = [];
        chordBassConstraints[i] = [];
        maxSpacings[i] = [];
        penaltyMaxSpacings[i] = [];

        constants[i] = [];
        undefines[i] = [];

        suspensions[i] = [];
        anticipations[i] = [];

        for (var j=0; j<lineElements.length; j++) {
            var element = lineElements[j];
            var absoluteNoteRange = arrayCopy(this.defaultAbsoluteNoteRange);
            var penaltyAbsoluteNoteRange = arrayCopy(this.defaultAbsoluteNoteRange);
            var harmonyElement = chr.get(j);
            var isConstant = false;
            var isUndefined = false;
            var hintAbsNote = null;
            var hintDistance = this.defaultHintDistance;
            var penaltyHintDistance = this.defaultHintDistance;
            var maxSpacing = this.defaultMaxSpacing;
            var penaltyMaxSpacing = this.defaultMaxSpacing;
            var chordBassConstraint = [];
            var chordRootConstraint = [];

            if (element instanceof ConstantVoiceLineElement) {
                var absNote = harmonyElement.getAbsoluteNoteConstantVoiceLineElement(element);
                absoluteNoteRange = [absNote, absNote];
                isConstant = true;
            } else if (element instanceof ClassicalAdaptiveVoiceLineElement) {
                if (element.range && element.range.length == 2) {
                    var lower = harmonyElement.getAbsoluteNoteWithIndexType(element.range[0], element.rangeIndexType);
                    var upper = harmonyElement.getAbsoluteNoteWithIndexType(element.range[1], element.rangeIndexType);
                    absoluteNoteRange = [lower, upper];
                }
                if (element.penaltyRange && element.penaltyRange.length == 2) {
                    var lower = harmonyElement.getAbsoluteNoteWithIndexType(element.penaltyRange[0], element.rangeIndexType);
                    var upper = harmonyElement.getAbsoluteNoteWithIndexType(element.penaltyRange[1], element.rangeIndexType);
                    penaltyAbsoluteNoteRange = [lower, upper];
                }
                if (element.hintIndex === null || element.maxHintDistance === null) {
                    // Not defined in the adaptive element. This signals the use of default value in planner
                } else {
                    hintAbsNote = harmonyElement.getAbsoluteNoteWithIndexType(element.hintIndex, element.hintIndexType);
                    var upper = harmonyElement.offset(hintAbsNote, element.hintDistanceOffsetType, element.maxHintDistance, harmonyElement);
                    var lower = harmonyElement.offset(hintAbsNote, element.hintDistanceOffsetType, -element.maxHintDistance, harmonyElement);
                    hintDistance = Math.max(Math.abs(hintAbsNote - upper), Math.abs(hintAbsNote - lower));
                    var penaltyUpper = harmonyElement.offset(hintAbsNote, element.hintDistanceOffsetType, element.penaltyMaxHintDistance, harmonyElement);
                    var penaltyLower = harmonyElement.offset(hintAbsNote, element.hintDistanceOffsetType, -element.penaltyMaxHintDistance, harmonyElement);
                    penaltyHintDistance = Math.max(Math.abs(hintAbsNote - penaltyUpper), Math.abs(hintAbsNote - penaltyLower));
//                    logit("Hinting " + hintAbsNote + " " + upper + " " + lower + " " + penaltyHintDistance);
                }
                if (element.chordBassPitchClassConstraint) {
                    chordBassConstraint = element.chordBassPitchClassConstraint;
                }
                if (element.chordRootPitchClassConstraint) {
                    chordRootConstraint = element.chordRootPitchClassConstraint;
                }
                if (element.maxSpacing === null) {
                } else {
                    maxSpacing = element.maxSpacing;
                }
                if (element.penaltyMaxSpacing === null) {
                } else {
                    penaltyMaxSpacing = element.penaltyMaxSpacing;
                }
            } else if (element instanceof UndefinedVoiceLineElement) {
                isUndefined = true;
            } else {
                logit(this._constructorName + " can not handle " + element._constructorName + "<br />");
            }
            absoluteNoteRanges[i][j] = absoluteNoteRange;
            penaltyAbsoluteNoteRanges[i][j] = penaltyAbsoluteNoteRange;
            constants[i][j] = isConstant;
            undefines[i][j] = isUndefined;
            hints[i][j] = hintAbsNote;
            hintDistances[i][j] = hintDistance;
            penaltyHintDistances[i][j] = penaltyHintDistance;
            maxSpacings[i][j] = maxSpacing;
            penaltyMaxSpacings[i][j] = penaltyMaxSpacing;
            chordBassConstraints[i][j] = chordBassConstraint;
            chordRootConstraints[i][j] = chordRootConstraint;
            suspensions[i][j] = element.suspend;
            anticipations[i][j] = element.anticipate;
        }
    }

    //    logit("chord bass stuff: " + JSON.stringify(chordBassConstraints) + "<br />");

    var options = {
        voiceCount: voiceLines.length,
        harmony: chr,
        absoluteNoteRanges: absoluteNoteRanges,
        penaltyAbsoluteNoteRanges: penaltyAbsoluteNoteRanges,
        constants: constants,
        undefines: undefines,
        suspensions: suspensions,
        anticipations: anticipations,
        absoluteNoteHints: hints,
        maxAbsoluteHintDistances: hintDistances,
        penaltyMaxAbsoluteHintDistances: penaltyHintDistances,
        chordRootPitchClassConstraints: chordRootConstraints,
        chordBassPitchClassConstraints: chordBassConstraints,
        maxSpacings: maxSpacings,
        penaltyMaxSpacings: penaltyMaxSpacings,
        maxSearchSteps: this.maxSearchStepsPerStep
//        reusables: module.reusables
    };

    var vg = new ClassicalVoiceLineGenerator(options);
    vg.constraints = constraints;

    voiceLeadingTimer.start();


    var plannedVoiceLines = null;
    var reusableIndex = JSON.stringify(vg);
    vg.reusables = module.reusables;
    var toReuse = module.reusables[reusableIndex];
    if (toReuse) {
//        logit("Reusing voice leading solution!");
        plannedVoiceLines = copyValueDeep(toReuse);
    } else {
//        logit("NOT Reusing voice leading solution!");
        plannedVoiceLines = vg.search();
        module.reusables[reusableIndex] = plannedVoiceLines;
    }

    voiceLeadingTimer.pause();


    if (plannedVoiceLines) {
        for (var i=0; i<plannedVoiceLines.length; i++) {
            plannedVoiceLines[i].id = voiceLines[i].id;
        }
    } else {
        logit("ClassicalVoicePlanner failed with options: " + JSON.stringify(options));
    }

    addAll(result, plannedVoiceLines);
};

