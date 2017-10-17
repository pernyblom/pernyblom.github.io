



// Options for the planner
PlannedHarmonyElement.prototype.fillOptions = function(options, module) {
    var lengths = this.getBeatLengths(module);
    var count = lengths.length;

    // All stuff that can be expressions comes here...
    options.scaleBaseNote = getValueOrExpressionValue(this, "scaleBaseNote", module);

    // The actual lengths of the chords must be determined here since the position snapping can
    // decrease the count.

    options.count = count;
    options.seed = this.seed;
};



PlannedHarmonyElement.prototype.setCount = function(v) {
    this.count = v;
    return this;
};


StaticSequenceHarmonyElement.prototype.fillOptions = function(options, module) {
    copyObjectPropertiesDeep(options, this);
    PlannedHarmonyElement.prototype.fillOptions.call(this, options, module);
};


StaticSequenceHarmonyElement.prototype.getConstantHarmonyElements = function(module, beatOffset) {
    if (!module) {
        logit("module missing in " + this._constructorName + "<br />");
        showStacktraceDialog(null, "static sequence harmony");
    }

    var options = {};
    this.fillOptions(options, module);

    var generator = new StaticHarmonyGenerator(options);
    var solution = generator.searchML();

    this.setLengthsAndPhraseStructure(solution, module);

    return solution;
};


DynamicSequenceHarmonyElement.prototype.fillOptions = function(options, module) {
    copyObjectPropertiesDeep(options, this);
    PlannedHarmonyElement.prototype.fillOptions.call(this, options, module);

    options.modulateLikelihoods = [1];
    for (var i=0; i<options.count; i++) {
        options.modulateLikelihoods[i] = getItemFromArrayWithStartEndItems(1, this.modulateLikelihoods, options.count, i, this.startModulateLikelihoods, this.endModulateLikelihoods);
        var progressionCount = options.count > 1 ? options.count - 1 : 1;
        options.majorProgressionMovements[i] = getItemFromArrayWithStartEndItems([-4, -2, 1], this.majorProgressionMovements, progressionCount, i, this.startMajorProgressionMovements, this.endMajorProgressionMovements);
        options.minorProgressionMovements[i] = getItemFromArrayWithStartEndItems([-4, -2, 1], this.minorProgressionMovements, progressionCount, i, this.startMinorProgressionMovements, this.endMinorProgressionMovements);
    }
    
//    logit("fklsjd: " + options.modulateLikelihoods.join(", ") + " <br />");
};


DynamicSequenceHarmonyElement.prototype.getConstantHarmonyElements = function(module, beatOffset) {

    if (!module) {
        logit("module missing in " + this._constructorName + "<br />");
        showStacktraceDialog(null, "static sequence harmony");
    }

    var options = {};
    this.fillOptions(options, module);

    var generator = new DynamicHarmonyGenerator(options);
    var solution = generator.searchML();

    // Set the lengths of the solution here... The planner doesn't do that, it is just concerned with strong/weak

    this.setLengthsAndPhraseStructure(solution, module);

    //    logit("Found dynamic solution " + solution + "<br />");
    return solution;
};



var PhraseHarmonyElementShorteningMode = {
    BEATS: 0,

    toString: function(type) {
        switch (type) {
            case PhraseHarmonyElementShorteningMode.BEATS:
                return "Beats";
        }
        return "Unknown phrase harmony element shortening mode " + type;
    }

};
addPossibleValuesFunction(PhraseHarmonyElementShorteningMode, PhraseHarmonyElementShorteningMode.BEATS, PhraseHarmonyElementShorteningMode.BEATS);


function PhraseHarmonyElement() {
    PlannedHarmonyElement.call(this);

    this.phraseType = PhraseHarmonyElementType.COMPLETE;
    this.harmonyReference = ""; // Used for derived consequent phrases

    this.modulate = false;
    this.modulateInvertScaleType = false;
    this.majorModulationTarget = DynamicHarmonyModulationTarget.DOMINANT;
    this.minorModulationTarget = DynamicHarmonyModulationTarget.MEDIANT;
    this.modulateRemoveDominant = true;
    this.modulateRemoveInitialTonic = true;
    this.modulateStaticLengthFactor = 0.2;
    this.modulateDynamicLengthFactor = 5;
    this.modulateDominantCadenceLengthFactor = 0.2;
    this.modulateTonicCadenceLengthFactor = 0.2;

    this.majorDeceptiveRoot = 5;
    this.majorDeceptiveInversions = 0;
    this.minorDeceptiveRoot = 5;
    this.minorDeceptiveInversions = 0;

    // LengthAndCountUnit.LENGTH is interpreted as beats
    this.staticHarmonyLength = 25;
    this.staticHarmonyLengthUnit = LengthAndCountUnit.LENGTH_PERCENT;
    this.staticHarmonyLengthLimits = [0, 100];
    this.staticHarmonyLengthLimitsUnit = LengthAndCountUnit.LENGTH_PERCENT;
    this.staticHarmonyLengthImportance = 1.0;
    this.staticHarmonyUseLocalSeed = false;
    this.staticHarmonySeed = 12345;
    this.staticHarmonyRaiseLeadingToneRoots = [4, 6];
    this.staticHarmonyPassingChordLikelihood = 1;
    this.staticHarmonyNeighbourChordLikelihood = 1;
    this.staticHarmonySus2ChordLikelihood = 1;
    this.staticHarmonySus4ChordLikelihood = 1;
    this.staticHarmonySimpleMixtureLikelihood = 1;

    this.dynamicHarmonyLength = 25;
    this.dynamicHarmonyLengthUnit = LengthAndCountUnit.LENGTH_PERCENT;
    this.dynamicHarmonyLengthLimits = [0, 100];
    this.dynamicHarmonyLengthLimitsUnit = LengthAndCountUnit.LENGTH_PERCENT;
    this.dynamicHarmonyLengthImportance = 1.0;
    this.dynamicHarmonyUseLocalSeed = false;
    this.dynamicHarmonySeed = 12345;
    this.dynamicHarmonyRaiseLeadingToneRoots = [];
    this.dynamicHarmonyRaiseLeadingToneAppliedRoots = [4, 6]; // Default is to raise for applied chords
    this.dynamicHarmonyPassingChordLikelihood = 1;
    this.dynamicHarmonyNeighbourChordLikelihood = 1;
    this.dynamicHarmonySus2ChordLikelihood = 1;
    this.dynamicHarmonySus4ChordLikelihood = 1;
    this.dynamicHarmonySimpleMixtureLikelihood = 1;

    this.dominantCadenceHarmonyLength = 1;
    this.dominantCadenceHarmonyLengthUnit = LengthAndCountUnit.COUNT;
    this.dominantCadenceHarmonyLengthLimits = [0, 100];
    this.dominantCadenceHarmonyLengthLimitsUnit = LengthAndCountUnit.LENGTH_PERCENT;
    this.dominantCadenceHarmonyLengthImportance = 1.0;
    this.dominantCadenceHarmonyUseLocalSeed = false;
    this.dominantCadenceHarmonySeed = 12345;
    this.dominantCadenceHarmonyRaiseLeadingToneRoots = [4, 6];
    this.dominantCadenceHarmonyPassingChordLikelihood = 1;
    this.dominantCadenceHarmonyNeighbourChordLikelihood = 1;
    this.dominantCadenceHarmonySus2ChordLikelihood = 1;
    this.dominantCadenceHarmonySus4ChordLikelihood = 1;
    this.dominantCadenceHarmonySimpleMixtureLikelihood = 1;

    this.tonicCadenceHarmonyLength = 1;
    this.tonicCadenceHarmonyLengthUnit = LengthAndCountUnit.COUNT;
    this.tonicCadenceHarmonyLengthLimits = [0, 100];
    this.tonicCadenceHarmonyLengthLimitsUnit = LengthAndCountUnit.LENGTH_PERCENT;
    this.tonicCadenceHarmonyLengthImportance = 1.0;
    this.tonicCadenceHarmonyUseLocalSeed = false;
    this.tonicCadenceHarmonySeed = 12345;
    this.tonicCadenceHarmonyRaiseLeadingToneRoots = [4, 6];
    this.tonicCadenceHarmonyPassingChordLikelihood = 1;
    this.tonicCadenceHarmonyNeighbourChordLikelihood = 1;
    this.tonicCadenceHarmonySus2ChordLikelihood = 1;
    this.tonicCadenceHarmonySus4ChordLikelihood = 1;
    this.tonicCadenceHarmonySimpleMixtureLikelihood = 1;

    this.overrideDefaultPhraseStructure = false; // Set this to true to use the phrase structure counts instead

    // For shortening the phrase, for example in antecedent/consequent phrases
    this.phraseShorteningMode = PhraseHarmonyElementShorteningMode.BEATS;
    this.phraseShorteningBeats = [[4], [4], [2], [2], [2], [1], [1], [1]];
    this.phraseShorteningMinLengths = [1];
    this.phraseShorteningMinLengthUnit = PositionUnit.BEATS;

    this.raiseLeadingTone = true;

    this.maxLengthSearchSteps = 200;

    this._constructorName = "PhraseHarmonyElement";
}


PhraseHarmonyElement.prototype = new PlannedHarmonyElement();


