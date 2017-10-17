
var InstrumentCapabilityProperty = {
    // Booleans
    STRUM: 0,
    SLOW_BLOCK_CHORD: 1,
    QUICK_BLOCK_CHORD: 2,
    SLOW_ARPEGGIO: 3,
    QUICK_ARPEGGIO: 4,
    HARMONIZED_ARPEGGIO: 5,
    SLOW_MELODY: 6,
    QUICK_MELODY: 7,
    SLOW_BASS: 8,
    QUICK_BASS: 9,
    LONG_NOTE: 10,
    VIBRATO: 11,
    TREMOLO: 12,
    PORTAMENTO: 13,
    TRILL: 14,
    GLISSANDO: 15,
    NOTE_BEND: 16,
    SLIDE: 17,
    FILTER_FREQ_CHANGE: 18,
    FILTER_BW_CHANGE: 19,
    VELOCITY_CHANGE: 20,
    PAN_CHANGE: 21,

    // Range [lower, upper] midi notes
    NOTE_RANGE: 22,

    toString: function(type) {
        return type;
    }
};



var SimpleModuleGeneratorInstrumentSetType = {
    ACOUSTIC: 0,
    ELECTRIC: 1,
    ELECTRONIC: 2
};

var SimpleModuleGeneratorHarmonyStyleType = {
    BLOCK_CHORDS_SIMPLE: 0,
    ARPEGGIO_RESTARTING: 1,
    SLOW_VOICE: 2,
    SLOW_HARMONIZED_VOICE: 3,
    BLOCK_CHORDS_SMOOTH: 4,
    SINGLE_STRUM: 5,
    ARPEGGIO_RESTARTING_HARMONIZED: 6,
    ARPEGGIO_RESTARTING_WITH_THIRDS: 7,
    ARPEGGIO_RESTARTING_WITH_SIXTHS: 8,
    ARPEGGIO_RESTARTING_WITH_OCTAVES: 9,
    SINGLE_BLOCK_CHORD: 10,
    SIMPLE_ARPEGGIO_RESTARTING: 11,
    SIMPLE_ARPEGGIO_RESTARTING_HARMONIZED: 12,
    SIMPLE_ARPEGGIO_RESTARTING_WITH_THIRDS: 13,
    SIMPLE_ARPEGGIO_RESTARTING_WITH_SIXTHS: 14,
    SIMPLE_ARPEGGIO_RESTARTING_WITH_OCTAVES: 15,
    STRUMS: 16
};

var SimpleModuleGeneratorBassType = {
    REPEATED: 0,
    OCTAVES: 1,
    FIFTHS: 2,
    ARPEGGIO: 3,
    MELODIC: 4
};


var SimpleModuleGeneratorConnectType = {
    CHORD: 0,
    SCALE: 1
};




function createSectionInfos(genInfo) {
    var result = [];

    var songStructureInfo = genInfo.songStructureInfo;

    var phraseTypeIndices = songStructureInfo.phraseTypeIndices;
    var melodyChannelDistributionIndices = songStructureInfo.melodyChannelDistributionIndices;
    var inner1ChannelDistributionIndices = songStructureInfo.inner1ChannelDistributionIndices;
    var inner2ChannelDistributionIndices = songStructureInfo.inner2ChannelDistributionIndices;
    var bassChannelDistributionIndices = songStructureInfo.bassChannelDistributionIndices;
    var melodyMotifDistributionIndices = songStructureInfo.melodyMotifDistributionIndices;
    var inner1MotifDistributionIndices = songStructureInfo.inner1MotifDistributionIndices;
    var inner2MotifDistributionIndices = songStructureInfo.inner2MotifDistributionIndices;
    var bassMotifDistributionIndices = songStructureInfo.bassMotifDistributionIndices;
    var percussionMotifDistributionIndices = songStructureInfo.percussionMotifDistributionIndices;
    var percussionFillMotifDistributionIndices = songStructureInfo.percussionFillMotifDistributionIndices;
    var harmonyRythmIndices = songStructureInfo.harmonyRythmIndices;
    var harmonyIndices = songStructureInfo.harmonyIndices;
    var harmonyExtraIndices = songStructureInfo.harmonyExtraIndices;
    var melodyShapeIndices = songStructureInfo.melodyShapeIndices;
    var bassShapeIndices = songStructureInfo.bassShapeIndices;
    var suspendIndices = songStructureInfo.suspendIndices;
    var renderAmountIndices = songStructureInfo.renderAmountIndices;
    var tempoIndices = songStructureInfo.tempoIndices;
    var sequentialMelodyEffectChangeIndices = songStructureInfo.sequentialMelodyEffectChangeIndices;
    var sequentialInner1EffectChangeIndices = songStructureInfo.sequentialInner1EffectChangeIndices;
    var sequentialInner2EffectChangeIndices = songStructureInfo.sequentialInner2EffectChangeIndices;
    var sequentialBassEffectChangeIndices = songStructureInfo.sequentialBassEffectChangeIndices;
    var sequentialPercussionEffectChangeIndices = songStructureInfo.sequentialPercussionEffectChangeIndices;
    var sequentialTempoChangeIndices = songStructureInfo.sequentialTempoChangeIndices;
    var parallelTempoChangeIndices = songStructureInfo.parallelTempoChangeIndices;
    var modifierFunctions = songStructureInfo.modifierFunctions;

    for (var i=0; i<phraseTypeIndices.length; i++) {
        var info = new SimpleModuleGeneratorSectionInfo({
            renderAmountIndex: renderAmountIndices[i],
            melodyShapeIndex: melodyShapeIndices[i],
            bassShapeIndex: bassShapeIndices[i],
            suspendIndex: suspendIndices[i],
            phraseIndex: phraseTypeIndices[i],
            harmonyIndex: harmonyIndices[i],
            harmonyExtraIndex: harmonyExtraIndices[i],
            harmonyRythmIndex: harmonyRythmIndices[i],
            percussionMotifDistributionIndex: percussionMotifDistributionIndices[i],
            percussionFillMotifDistributionIndex: percussionFillMotifDistributionIndices[i],
            melodyChannelDistributionIndex: melodyChannelDistributionIndices[i],
            inner1ChannelDistributionIndex: inner1ChannelDistributionIndices[i],
            inner2ChannelDistributionIndex: inner2ChannelDistributionIndices[i],
            bassChannelDistributionIndex: bassChannelDistributionIndices[i],
            melodyMotifDistributionIndex: melodyMotifDistributionIndices[i],
            inner1MotifDistributionIndex: inner1MotifDistributionIndices[i],
            inner2MotifDistributionIndex: inner2MotifDistributionIndices[i],
            bassMotifDistributionIndex: bassMotifDistributionIndices[i],
            tempoIndex: tempoIndices[i],
            sequentialMelodyEffectChangeIndex: sequentialMelodyEffectChangeIndices[i],
            sequentialInner1EffectChangeIndex: sequentialInner1EffectChangeIndices[i],
            sequentialInner2EffectChangeIndex: sequentialInner2EffectChangeIndices[i],
            sequentialBassEffectChangeIndex: sequentialBassEffectChangeIndices[i],
            sequentialPercussionEffectChangeIndex: sequentialPercussionEffectChangeIndices[i],
            sequentialTempoChangeIndex: sequentialTempoChangeIndices[i],
            parallelTempoChangeIndex: parallelTempoChangeIndices[i],
            modifierFunctions: modifierFunctions[i],
            index: i
        });
        result.push(info);

//        logit("Created section info: " + JSON.stringify(info) + "<br />");
    }

    return result;
}


function createOrGetRandom(obj, seedPropName) {
    var prop = seedPropName + "Rnd";
    var rnd = obj[prop];
    if (!rnd) {
        var seed = obj[seedPropName];
        if (!seed) {
            seed = Math.round(Math.random() * 472389472);
            logit("Could not find seed " + seedPropName); //  + " in " + JSON.stringify(obj) + "<br />");
            obj[seedPropName] = seed;
        }
        rnd = new MersenneTwister(seed);
        obj[prop] = rnd;
    }
    return rnd;
}

function getOscillatingIndices(rnd, value1, value2, stay1Likelihood, switch1Likelihood, stay2Likelihood, switch2Likelihood) {
    var indices = [];

    var noteCount = rnd.random() * 6 + 3;
    var current = value1;

    for (var i=0; i<noteCount; i++) {
        indices.push(current);
        if (current == value1) {
            current = sampleData([
                {data: value1, likelihood: stay1Likelihood},
                {data: value2, likelihood: switch1Likelihood}], rnd);
        } else {
            current = sampleData([
                {data: value2, likelihood: stay2Likelihood},
                {data: value1, likelihood: switch2Likelihood}], rnd);
        }
    }
    return indices;
}


function getMelodicVerticalIndices(rnd, options)  {
    var indices = [];

    var maxLeaps = getValueOrDefault(options, "maxLeaps", 1);
    var sameMultFactor = getValueOrDefault(options, "sameMultFactor", 1);

    var leapRndInfos = getValueOrDefault(options, "leapRndInfos",
        [
            {data: 2, likelihood: 1},
            {data: -2, likelihood: 1}
        ]);

    var noteCount = rnd.random() * 6 + 3;

    var current = 0;
    var lastStep = 0;
    var leapsLeft = maxLeaps;

    var sameMultiplier = 1;
    for (var i=0; i<noteCount; i++) {
        indices.push(current);

        var rndInfos = [];
        var step = 0;
        if (leapsLeft == 0 || Math.abs(lastStep) > 1) {

            var nMultiplier = 1;
            var pMultiplier = 1;

            if (current > 0) {
                pMultiplier = 1 / (1 + current);
            } else if (current < 0) {
                nMultiplier = 1 / (1 - current);
            }

            step = sampleData([
                {data: 0, likelihood: 0.5 * sameMultiplier},
                {data: -1, likelihood: 1 * nMultiplier},
                {data: 1, likelihood: 1 * pMultiplier}
            ], rnd);


            if (lastStep > 2 && step > 0) {
                step = -step;
            } else if (lastStep < -2 && step < 0) {
                step = -step;
            }

        } else {
            // We can make a leap
            var leapSize = sampleData(leapRndInfos, rnd);
            step = leapSize;
            if (lastStep > 1 && step > 0) {
                step = -step;
            } else if (lastStep < -1 && step < 0) {
                step = -step;
            }
            leapsLeft--;
        }
        if (step == 0) {
            sameMultiplier *= sameMultFactor;
        } else {
            sameMultiplier = 1;
        }
        current += step;
        lastStep = step;
    }
    return indices;
}


function setMelodyMotifVerticalIndices(index, motifInfo, genData, genInfo, sectionInfos) {
    var rnd = createOrGetRandom(genInfo, "melodyMotifSeed");

    var indices = getMelodicVerticalIndices(rnd,
        {
            sameMultFactor: 0.8,
            maxLeaps: sampleData([
                {data: 1, likelihood: 1},
                {data: 0, likelihood: 1}
            ], rnd),
            leapRndInfos: [
                {data: 7, likelihood: 1},
                {data: -7, likelihood: 1},
                {data: 6, likelihood: 2},
                {data: -6, likelihood: 2},
                {data: 5, likelihood: 4},
                {data: -5, likelihood: 4},
                {data: 4, likelihood: 8},
                {data: -4, likelihood: 8},
                {data: 3, likelihood: 16},
                {data: -3, likelihood: 16},
                {data: 2, likelihood: 32},
                {data: -2, likelihood: 32}
            ]
        });

//    logit("Melody indices: " + indices.join(", ") + "<br />");
    motifInfo.verticalIndices = indices;

}


function setMotifRythm(options, motifInfo, genData, genInfo, sectionInfos, seedName, namePrefix) {
    var motifRythmRnd = createOrGetRandom(genInfo, seedName);

    var noteCountRange = getValueOrDefault(options, "noteCountRange", [0.25, 1.0]);
    var zone1Prob = getValueOrDefault(options, "zone1Prob", 0.5);
    var zone1TripletLikelihood = getValueOrDefault(options, "zone1TripletLikelihood", 0.5);
    var zone1DotSecondLikelihood = getValueOrDefault(options, "zone1DotSecondLikelihood", 0.5);
    var zone1DotFirstLikelihood = getValueOrDefault(options, "zone1DotFirstLikelihood", 2);
    var zone1DotNormalDotLikelihood = getValueOrDefault(options, "zone1DotNormalDotLikelihood", 0.5);
    var zone1NormalDotDotLikelihood = getValueOrDefault(options, "zone1NormalDotDotLikelihood", 0.5);
    var zone1DotDotNormalLikelihood = getValueOrDefault(options, "zone1DotDotNormalLikelihood", 0.5);
    var zone1StartPosRange = getValueOrDefault(options, "zone1StartPosRange", [0, 0]);
    var zone1EndPosRange = getValueOrDefault(options, "zone1EndPosRange", [0.75, 0.75]);
    var zone1StartEnd = getValueOrDefault(options, "zone1StartEnd", []);
    var densityCurveType = getValueOrDefault(options, "densityCurveType", PredefinedCurveType.CONSTANT_NOISE);

    motifInfo.noteCount = 1;
    motifInfo.noteCountUnit = CountUnit.HARMONY_ELEMENT_BEATS;
    motifInfo.densitySeed = Math.round(motifRythmRnd.random() * 947283493 + 142);
    motifInfo.densityCurveType = densityCurveType;

    motifInfo.addZone1 = motifRythmRnd.random() < zone1Prob;

    function sampleSingleRange(range, rnd) {
        var l = range[1] - range[0];
        return rnd.random() * l + range[0];
    }

    function sampleRange(startRange, endRange, rnd) {
        return [sampleSingleRange(startRange, rnd), sampleSingleRange(endRange, rnd)];
    }

    var zone1PosRange = sampleRange(zone1StartPosRange, zone1EndPosRange, motifRythmRnd);

    var zone1Length = zone1PosRange[1] - zone1PosRange[0];

    var start = motifRythmRnd.random() * zone1Length + zone1PosRange[0];
    var spaceLeft = 1.0 - start;
    var end = Math.min(1.0, start + motifRythmRnd.random() * spaceLeft);

    if (zone1StartEnd && zone1StartEnd.length > 1) {
        start = zone1StartEnd[0];
        end = zone1StartEnd[1];
//        logit("Overwriting zone 1 start end " + zone1StartEnd.join(", ") + " " + seedName);
    }
    motifInfo.zone1PositionInterval = [start, end];
    motifInfo.zone1SplitStrategy = sampleData([
        {data: SplitStrategy.TRIPLET, likelihood: zone1TripletLikelihood},
        {data: SplitStrategy.DOT_SECOND, likelihood: zone1DotSecondLikelihood},
        {data: SplitStrategy.DOT_FIRST, likelihood: zone1DotFirstLikelihood},
        {data: SplitStrategy.DOT_NORMAL_DOT, likelihood: zone1DotNormalDotLikelihood},
        {data: SplitStrategy.NORMAL_DOT_DOT, likelihood: zone1NormalDotDotLikelihood},
        {data: SplitStrategy.DOT_DOT_NORMAL, likelihood: zone1DotDotNormalLikelihood}
    ], motifRythmRnd); //;
    motifInfo.zone1MaxApplications = 1 + Math.floor(motifRythmRnd.random() * 3);

    motifInfo.noteCount = noteCountRange[0] + motifRythmRnd.random() * (noteCountRange[1] - noteCountRange[0]);


}


function setMelodyMotifEmbellishConnectStuff(motifInfo, genData, genInfo, sectionInfos) {
    motifInfo.embellishStart = 0.0;
    motifInfo.embellishEnd = 0.5;
    motifInfo.connectStart = 0.75;
    motifInfo.connectEnd = 1.0;

    var motifRnd = createOrGetRandom(genInfo, "melodyMotifEmbellishConnectSeed");
    var rnd = motifRnd.random();

    motifInfo.embellishEnd = 0.25 + 0.5 * motifRnd.random();

    if (motifRnd.random() < 0.5) {
        motifInfo.embellishStart = Math.max(0, motifInfo.embellishEnd - 0.25 - motifRnd.random() * 0.5);
    }

    var embellishWidth = motifInfo.embellishEnd - motifInfo.embellishStart;
    var sizeLeft = 1.0 - embellishWidth - motifInfo.embellishStart;

    var connectSize = motifRnd.random() * 0.75 * sizeLeft + 0.25 * sizeLeft;

    var connectSpan = sizeLeft - connectSize;

    var connectOffset = motifRnd.random() * connectSpan;

    motifInfo.connectStart = motifInfo.embellishEnd + connectOffset;
    motifInfo.connectEnd = motifInfo.connectStart + connectSize;


    if (motifRnd.random() < 0.2) {
        motifInfo.addConnect = false;
    }

}


function setHarmonyMotifEmbellishConnectStuff(motifInfo, genData, genInfo, sectionInfos) {
    motifInfo.embellishStart = 0.0;
    motifInfo.embellishEnd = 1.0;

    var motifRnd = createOrGetRandom(genInfo, "harmonyMotifEmbellishConnectSeed");
    var rnd = motifRnd.random();
    if (rnd < 0.25) {
        motifInfo.embellishStart = motifRnd.random() * 0.35;
        motifInfo.embellishEnd = 1.0 - motifRnd.random() * 0.35;
    } else if (rnd < 0.65) {
        motifInfo.embellishStart = motifRnd.random() * 0.6;
    } else {
        motifInfo.embellishEnd = 1.0 - motifRnd.random() * 0.6;
    }

    motifInfo.addConnect = false;
}

function setBassMotifEmbellishConnectStuff(motifInfo, genData, genInfo, sectionInfos) {
    motifInfo.embellishStart = 0.0;
    motifInfo.embellishEnd = 0.75;
    motifInfo.connectStart = 0.75;
    motifInfo.connectEnd = 1.0;

    var motifRnd = createOrGetRandom(genInfo, "bassMotifEmbellishConnectSeed");

    var rnd = motifRnd.random();

    if (rnd < 0.25) {
        var connectShift = -0.25 + motifRnd.random() * 0.5;
        motifInfo.connectStart += connectShift;
        motifInfo.embellishEnd -= connectShift;
    }

    // logit(motifInfo);

}


function createMelodyMotifInfo(index, genData, genInfo, sectionInfos) {

    var result = {};

    var incrementPerIndex = genInfo.melodyMotifRythmCountIncreasePerIndex;
    var incrementRange = genInfo.melodyMotifRythmCountIncreaseOffsetRange;

    var range = [index * incrementPerIndex + Math.min(incrementRange[0], incrementRange[1]),
        index * incrementPerIndex + Math.max(incrementRange[1], incrementRange[0])];
    if (index == 0) {
        result.noteCount = 1;
        result.noteCountUnit = CountUnit.PLAIN;
    } else {
        setMotifRythm({
            zone1Prob: getArrayValueOrDefault(genInfo.melodyMotifZone1Probabilities, index-1, 0.5),
            zone1TripletLikelihood: getArrayValueOrDefault(genInfo.melodyMotifZone1TripletLikelihoods, index-1, 0.5),
            zone1DotDotNormalLikelihood: getArrayValueOrDefault(genInfo.melodyMotifZone1DotDotNormalLikelihoods, index-1, 0.5),
            zone1DotFirstLikelihood: getArrayValueOrDefault(genInfo.melodyMotifZone1DotFirstLikelihoods, index-1, 2),
            zone1DotNormalDotLikelihood: getArrayValueOrDefault(genInfo.melodyMotifZone1DotNormalDotLikelihoods, index-1, 0.5),
            zone1DotSecondLikelihood: getArrayValueOrDefault(genInfo.melodyMotifZone1DotSecondLikelihoods, index-1, 0.5),
            zone1NormalDotDotLikelihood: getArrayValueOrDefault(genInfo.melodyMotifZone1NormalDotDotLikelihoods, index-1, 0.5),
            zone1StartPosRange: getArrayValueOrDefault(genInfo.melodyMotifZone1StartPosRanges, index-1, [0, 0]),
            zone1EndPosRange: getArrayValueOrDefault(genInfo.melodyMotifZone1EndPosRanges, index-1, [0.75, 0.75]),
            zone1StartEnd: getArrayValueOrDefault(genInfo.melodyMotifZone1StartEnds, index-1, []),
            noteCountRange: range
        }, result, genData, genInfo, sectionInfos, "melodyMotifRythmSeed");
        setMelodyMotifEmbellishConnectStuff(result, genData, genInfo, sectionInfos);
    }
    if (index > 0 && genInfo.melodyMotifRythmNoteCountOverrides.length > 0) {
        result.noteCount = genInfo.melodyMotifRythmNoteCountOverrides[(index - 1) % genInfo.melodyMotifRythmNoteCountOverrides.length];
        result.noteCountUnit = CountUnit.HARMONY_ELEMENT_BEATS;
    }

    var levels = [0.95, 0.75, 0.5, 0.25];

    result.fillerOffsetsExpression =
        createChainedLevelExpression(["[[1]]", "[[1]]", "[]", "[]", "[]" ], levels, "melodyRenderAmountVar");
    result.fillerOffsetTypes = [OffsetType.OCTAVE];

    setMelodyMotifVerticalIndices(index, result, genData, genInfo, sectionInfos);

    return result;
}

function createChainedExpression(valueExpressions, levelExpressions, level, earlyFinishResult) {
    if (level == valueExpressions.length - 1) {
        return "(" + valueExpressions[level] + ")";
    }
    var expr = valueExpressions[level];
    var levelExpression = levelExpressions[level];
    if (levelExpression) {
        return "(" + levelExpressions[level] + " ? " + expr + " : " + createChainedExpression(valueExpressions, levelExpressions, level + 1) + ")";
    } else {
        return "(" + earlyFinishResult + ")";
    }
}


function createChainedLevelExpression(valueExpressions, levelValues, varName) {
    var levelExpressions = [];
    for (var i=0; i<levelValues.length; i++) {
        var expr = varName + " > " + levelValues[i];
        levelExpressions[i] = expr;
    }
    return createChainedExpression(valueExpressions, levelExpressions, 0, valueExpressions[valueExpressions.length - 1]);
}



function setHarmonyMotif(motifInfo, genData, genInfo, sectionInfos, renderAmountVar, options) {
    var motifRnd = createOrGetRandom(genInfo, "harmonyMotifSeed");

    var rythmDensityMultiplier = getValueOrDefault(options, "rythmDensityMultiplier", 1);

    var type = SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING;

    type = sampleData([
        {data: SimpleModuleGeneratorHarmonyStyleType.BLOCK_CHORDS_SMOOTH, likelihood: 1},
        {data: SimpleModuleGeneratorHarmonyStyleType.STRUMS, likelihood: 1},
        {data: SimpleModuleGeneratorHarmonyStyleType.SINGLE_STRUM, likelihood: 1},
        {data: SimpleModuleGeneratorHarmonyStyleType.SINGLE_BLOCK_CHORD, likelihood: 1},
        {data: SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING_WITH_OCTAVES, likelihood: 2},
        {data: SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING_WITH_SIXTHS, likelihood: 0.1},
        {data: SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING_WITH_THIRDS, likelihood: 0.1},
        {data: SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING, likelihood: 2},
        {data: SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING_HARMONIZED, likelihood: 2},
        {data: SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_WITH_OCTAVES, likelihood: 2},
        {data: SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_WITH_SIXTHS, likelihood: 0.1},
        {data: SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_WITH_THIRDS, likelihood: 0.1},
        {data: SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING, likelihood: 2},
        {data: SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_HARMONIZED, likelihood: 2}
    ], motifRnd);

//    if (rnd < 0.5) {
//        type = SimpleModuleGeneratorHarmonyStyleType.BLOCK_CHORDS_SIMPLE;
//    }


    // Generating expressions for turning on/off stuff when renderAmount changes

    var fractionCount = 4;
    var rangeFractions = [0];
    var meanStep = 1.0 / fractionCount;
    var currentFraction = 0;
    for (var i=0; i<fractionCount-1; i++) {
        currentFraction += meanStep * 0.5 + motifRnd.random() * meanStep;
        if (currentFraction >= 1) {
            currentFraction = 1;
        }
        rangeFractions.push(currentFraction);
    }
    rangeFractions.push(1);

    var rangeStarts = [0, 0.1, 0.25, 0.5, 1.0];

    var ranges = [];

    for (var i=0; i<rangeStarts.length-1; i++) {
        ranges[i] = [];

        var rangeStart = rangeStarts[i];
        var rangeEnd = rangeStarts[i+1];
        var span = rangeEnd - rangeStart;



        for (var j=0; j<rangeFractions.length-1; j++) {
            var fraction = rangeFractions[j];
            var fractionSpan = rangeFractions[j+1] - rangeFractions[j];

            var start = rangeStart + span * fraction;
            var end = rangeStart + span * (fraction + fractionSpan);
            ranges[i].push([start, end]);
        }
    }

    var offLevel = 0.1 + 0.1 * motifRnd.random();

    var levels = [0.95, 0.75, 0.5, 0.25, 0.0];

//    var expr = createChainedLevelExpression(["[[2, 7, 9]]", "[[2, 7]]", "[[2]]", "[[2]]", "[]" ], levels, renderAmountVar);

//    logit(expr);

    var useSimpleRythm = false;
    var useMelodicIndices = true;

    var noteCountMultiplier = 1;
    var motifRythmRnd = createOrGetRandom(genInfo, "harmonyMotifRythmSeed");



    switch (type) {
        case SimpleModuleGeneratorHarmonyStyleType.STRUMS:
            useMelodicIndices = false;
            noteCountMultiplier = 0.25 + 0.25 * motifRythmRnd.random();
            break;
        case SimpleModuleGeneratorHarmonyStyleType.BLOCK_CHORDS_SMOOTH:
            useMelodicIndices = false;
            noteCountMultiplier = 0.25 + 0.5 * motifRythmRnd.random();
            break;
        case SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING:
        case SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_WITH_OCTAVES:
        case SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_WITH_THIRDS:
        case SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_WITH_SIXTHS:
        case SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_HARMONIZED:
            useSimpleRythm = true;
            break;
    }


    function createStrum(motifInfo) {
        var strumLength = 0.05 + motifRnd.random() * 0.1;

        var strumCount = 2 + Math.floor(3 * motifRnd.random());

        var relativeLengths = createFilledNumericIncArray(strumCount, -strumLength, -strumLength);
        var positionOffsets = createFilledNumericIncArray(strumCount, strumLength, strumLength);
//                logit("relativeLengths: " + relativeLengths.join(", ") + " offsets: " + positionOffsets.join(", "));
        motifInfo.fillerOffsets = [createFilledNumericIncArray(strumCount, 1, 1)];

        motifInfo.fillerRelativeStrengths = [createFilledNumericIncArray(strumCount, 0.8, -0.1)];

        motifInfo.fillerLengthModes = [MotifZoneFillerLengthMode.RELATIVE_ADD];
        motifInfo.fillerRelativeLengths = [relativeLengths];

        motifInfo.fillerPositionOffsets = [positionOffsets]; // [[0.1, 0.2, 0.3]];
        motifInfo.fillerPositionOffsetUnits = [PositionUnit.BEATS];
    }

    function getIndicesStringForLevels(levels, possible, maxVerticalCount) {
        var result = [];
        var possibleRndInfos = [];
        for (var i=0; i<possible.length; i++) {
            possibleRndInfos.push({likelihood: 1, data: possible[i]});
        }
        for (var i=0; i<levels; i++) {
            var count = Math.floor(motifRnd.random() * 10 + 1);
            var arr = [];
            for (var j=0; j<count; j++) {
                var strengthFrac = (i + 1) / levels;
                var verticalCount = Math.round(strengthFrac * maxVerticalCount * motifRnd.random());

                var arr2 = sampleNDataWithoutReplacement(possibleRndInfos, verticalCount, motifRnd);
                arr.push(arr2);
            }
            result.push(JSON.stringify(arr));
        }
        return result.reverse();
    }


    switch (type) {
        case SimpleModuleGeneratorHarmonyStyleType.STRUMS:
        case SimpleModuleGeneratorHarmonyStyleType.BLOCK_CHORDS_SMOOTH:
        case SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING:
        case SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_WITH_OCTAVES:
        case SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_WITH_THIRDS:
        case SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_WITH_SIXTHS:
        case SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_HARMONIZED:
        case SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING:
        case SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING_WITH_OCTAVES:
        case SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING_WITH_THIRDS:
        case SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING_WITH_SIXTHS:
        case SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING_HARMONIZED:

            var arpeggioIndices = useMelodicIndices ? getMelodicVerticalIndices(motifRnd, {
                sameMultFactor: 0.9,
                maxLeaps: sampleData([
//                {data: 2, likelihood: 1},
                    {data: 1, likelihood: 1},
                    {data: 0, likelihood: 2}
                ], motifRnd)}) : [0];

            motifInfo.verticalOffsetType = OffsetType.CHORD;
            motifInfo.verticalIndices = arpeggioIndices; // [0, 1, 2, 3, 2, 1];
            motifInfo.verticalIndicesExpression = renderAmountVar + " > " + offLevel + " ? " + JSON.stringify(arpeggioIndices) + " : []"; // [0, 1, 2, 3, 2, 1];
            motifInfo.startVerticalIndices = [0]; // [0, 1, 2, 3, 2, 1];
            motifInfo.startVerticalIndicesExpression = renderAmountVar + " > " + offLevel + " ? [0] : []"; // [0, 1, 2, 3, 2, 1];
            motifInfo.verticalOffsetDomains = [[0]];
            motifInfo.verticalOffsetLikelihoods = [[1]];
            motifInfo.verticalRelativeType = VerticalRelativeType.MIDI_ZERO;
            motifInfo.constantVerticalOffset = Math.floor(50 + 20 * motifRnd.random());
            motifInfo.constantVerticalOffsetType = OffsetType.HALF_STEP;

            motifInfo.fillerRelativeStrengths = [[0.75]];


//            logit(JSON.stringify(getIndicesStringForLevels(levels.length, [1, 2, 3], 3)))

            if (type == SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING_HARMONIZED ||
                type == SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_HARMONIZED) {
                motifInfo.fillerOffsets = [[1]];
//                motifInfo.fillerOffsetsExpression =
//                    createChainedLevelExpression(["[[1, 2]]", "[[1, 2]]", "[[1]]", "[[1]]", "[]" ], levels, renderAmountVar);
                motifInfo.fillerOffsetsExpression =
                    createChainedLevelExpression(getIndicesStringForLevels(levels.length, [1, 2, 3], 3), levels, renderAmountVar);
                motifInfo.fillerOffsetTypes = [OffsetType.CHORD];
            } else if (type == SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING_WITH_OCTAVES ||
                type == SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_WITH_OCTAVES) {
                motifInfo.fillerOffsetsExpression =
                    createChainedLevelExpression(getIndicesStringForLevels(levels.length, [1, 2], 2), levels, renderAmountVar);
//                motifInfo.fillerOffsetsExpression =
//                    createChainedLevelExpression(["[[1, 2]]", "[[1]]", "[[1]]", "[[1]]", "[]" ], levels, renderAmountVar);
                motifInfo.fillerOffsets = [[1]];
                motifInfo.fillerOffsetTypes = [OffsetType.OCTAVE];
            } else if (type == SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING_WITH_THIRDS ||
                type == SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_WITH_THIRDS) {
//                motifInfo.fillerOffsetsExpression =
//                    createChainedLevelExpression(["[[2, 7]]", "[[2, 7]]", "[[2]]", "[[2]]", "[]" ], levels, renderAmountVar);
                motifInfo.fillerOffsetsExpression =
                    createChainedLevelExpression(getIndicesStringForLevels(levels.length, [2, 7], 2), levels, renderAmountVar);
                motifInfo.fillerOffsets = [[2]];
                motifInfo.fillerOffsetTypes = [OffsetType.SCALE];
            } else if (type == SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING_WITH_SIXTHS ||
                type == SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING_WITH_SIXTHS) {
                motifInfo.fillerOffsetsExpression =
                    createChainedLevelExpression(getIndicesStringForLevels(levels.length, [5, 7], 2), levels, renderAmountVar);
//                motifInfo.fillerOffsetsExpression =
//                    createChainedLevelExpression(["[[5, 7]]", "[[5, 7]]", "[[5]]", "[[5]]", "[]" ], levels, renderAmountVar);
                motifInfo.fillerOffsets = [[5]];
                motifInfo.fillerOffsetTypes = [OffsetType.SCALE];
            } else if (type == SimpleModuleGeneratorHarmonyStyleType.ARPEGGIO_RESTARTING ||
                type == SimpleModuleGeneratorHarmonyStyleType.SIMPLE_ARPEGGIO_RESTARTING) {

                motifInfo.fillerOffsetsExpression =
                    createChainedLevelExpression(getIndicesStringForLevels(levels.length, [1], 1), levels, renderAmountVar);

//                motifInfo.fillerOffsetsExpression =
//                    createChainedLevelExpression(["[[1]]", "[]", "[]", "[]", "[]" ], levels, renderAmountVar);
                motifInfo.fillerOffsetTypes = [OffsetType.OCTAVE];
            } else if (type == SimpleModuleGeneratorHarmonyStyleType.BLOCK_CHORDS_SMOOTH) {
                motifInfo.fillerOffsetsExpression =
                    createChainedLevelExpression(getIndicesStringForLevels(levels.length, [1, 2, 3], 3), levels, renderAmountVar);
//                motifInfo.fillerOffsetsExpression =
//                    createChainedLevelExpression(["[[1, 2, 3]]", "[1, 2]", "[1, 2]", "[1]", "[]" ], levels, renderAmountVar);
                motifInfo.fillerOffsetTypes = [OffsetType.CHORD];
            } else if (type == SimpleModuleGeneratorHarmonyStyleType.STRUMS) {
                motifInfo.fillerOffsetsExpression =
                    createChainedLevelExpression(getIndicesStringForLevels(levels.length, [1, 2, 3], 3), levels, renderAmountVar);
//                motifInfo.fillerOffsetsExpression =
//                    createChainedLevelExpression(["[[1, 2, 3]]", "[1, 2]", "[1, 2]", "[1]", "[]" ], levels, renderAmountVar);
                motifInfo.fillerOffsetTypes = [OffsetType.CHORD];
                createStrum(motifInfo);
            }
            if (useSimpleRythm) {
                setMotifRythm({
                    zone1Prob: 0,
                    noteCountRange: [0.5 * noteCountMultiplier * rythmDensityMultiplier, 2.0 * noteCountMultiplier * rythmDensityMultiplier],
                    densityCurveType: PredefinedCurveType.LINEAR
                }, motifInfo, genData, genInfo, sectionInfos, "harmonyMotifRythmSeed");
                motifInfo.densityAmplitude = motifRythmRnd.random() * 0.1 - 0.05
            } else {
                setMotifRythm({
                    zone1TripletLikelihood: 0.1,
                    noteCountRange: [0.5 * noteCountMultiplier * rythmDensityMultiplier, 2.0 * noteCountMultiplier * rythmDensityMultiplier]
                }, motifInfo, genData, genInfo, sectionInfos, "harmonyMotifRythmSeed");
            }
            break;
        case SimpleModuleGeneratorHarmonyStyleType.SINGLE_BLOCK_CHORD:
        case SimpleModuleGeneratorHarmonyStyleType.SINGLE_STRUM:
            motifInfo.verticalOffsetType = OffsetType.CHORD;
            motifInfo.verticalIndices = [0];
            motifInfo.verticalOffsetDomains = [[0]];
            motifInfo.verticalOffsetLikelihoods = [[1]];
            motifInfo.verticalRelativeType = VerticalRelativeType.MIDI_ZERO;
            motifInfo.constantVerticalOffset = Math.floor(50 + 20 * motifRnd.random());
            motifInfo.constantVerticalOffsetType = OffsetType.HALF_STEP;
            motifInfo.fillerOffsets = [[1, 2]];
            motifInfo.fillerOffsetsExpression =
                createChainedLevelExpression(["[[1, 2, 3]]", "[1, 2]", "[1, 2]", "[1]", "[]" ], levels, renderAmountVar);
            motifInfo.fillerOffsetTypes = [OffsetType.CHORD];
            motifInfo.fillerRelativeStrengths = [[0.8]];
            if (type == SimpleModuleGeneratorHarmonyStyleType.SINGLE_STRUM) {
                createStrum(motifInfo);
            }
            motifInfo.noteCount = 1;
            motifInfo.noteCountUnit = CountUnit.PLAIN;
//            setMotifRythm({noteCountRange: [0.25, 1.5]}, motifInfo, genData, genInfo, sectionInfos);
            break;
    }

}

function setBassMotifVerticalIndices(motifInfo, genData, genInfo, sectionInfos) {
    var motifRnd = createOrGetRandom(genInfo, "bassMotifSeed");

    var rnd = motifRnd.random();

    motifInfo.verticalOffsetType = OffsetType.CHORD;
    motifInfo.verticalIndices = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    var type = sampleData([
        {data: SimpleModuleGeneratorBassType.ARPEGGIO, likelihood: 1},
        {data: SimpleModuleGeneratorBassType.FIFTHS, likelihood: 1},
        {data: SimpleModuleGeneratorBassType.OCTAVES, likelihood: 1},
        {data: SimpleModuleGeneratorBassType.REPEATED, likelihood: 1}
        // {data: SimpleModuleGeneratorBassType.MELODIC, likelihood: 1}
    ], motifRnd);


    var levels = [0.95, 0.75, 0.5, 0.25];

    motifInfo.fillerOffsetsExpression =
        createChainedLevelExpression(["[[1]]", "[[1]]", "[]", "[]", "[]" ], levels, "bassRenderAmountVar");
    motifInfo.fillerOffsetTypes = [OffsetType.OCTAVE];

    switch (type) {
        case SimpleModuleGeneratorBassType.ARPEGGIO:

            var arpeggioIndices = getMelodicVerticalIndices(motifRnd, {
                sameMultFactor: 0.9,
                maxLeaps: sampleData([
                    // {data: 2, likelihood: 1},
                    {data: 1, likelihood: 2},
                    {data: 0, likelihood: 4}
                ], motifRnd)});
            motifInfo.verticalIndices = arpeggioIndices; // [0, 2, 1, 0, 1, 2, 1, 0, -1, -2, -1];
            motifInfo.verticalOffsetDomains = [[0]];
            motifInfo.verticalOffsetLikelihoods = [[1]];
            // logit(motifInfo);
            break;
        case SimpleModuleGeneratorBassType.FIFTHS:
//            motifInfo.verticalIndices = [0, 2, 0, 2, 0, 2, 2, 0, 0, 0, 0];
            var stay1Likelihood = 1;
            var switch1Likelihood = 1;
            var stay2Likelihood = 1;
            var switch2Likelihood = 1;
            motifInfo.verticalIndices = getOscillatingIndices(motifRnd, 0, 2, stay1Likelihood, switch1Likelihood, stay2Likelihood, switch2Likelihood);
            motifInfo.verticalOffsetDomains = [[0]];
            motifInfo.verticalOffsetLikelihoods = [[1]];
            break;
        case SimpleModuleGeneratorBassType.MELODIC:
            var melodicIndices = getMelodicVerticalIndices(motifRnd, {
                sameMultFactor: 0.9,
                maxLeaps: sampleData([

                    {data: 1, likelihood: 1},
                    {data: 0, likelihood: 3}
                ], motifRnd)});
            motifInfo.verticalIndices = melodicIndices; // [0, 1, 2, 1, 0, 0, 0, 1, 0];
            motifInfo.verticalOffsetType = OffsetType.SCALE;
            break;
        case SimpleModuleGeneratorBassType.OCTAVES:
            var stay1Likelihood = 1;
            var switch1Likelihood = 1;
            var stay2Likelihood = 1;
            var switch2Likelihood = 1;
            motifInfo.verticalIndices = getOscillatingIndices(motifRnd, 0, 1, stay1Likelihood, switch1Likelihood, stay2Likelihood, switch2Likelihood);
//            motifInfo.verticalIndices = [0, 1, 0, 1, 0, 0, 0, 1, 0];
            motifInfo.verticalOffsetType = OffsetType.OCTAVE;
            motifInfo.verticalOffsetDomains = [[0]];
            motifInfo.verticalOffsetLikelihoods = [[1]];
            break;
        case SimpleModuleGeneratorBassType.REPEATED:
            motifInfo.verticalIndices = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            break;
    }

}


function createBassMotifInfo(index, genData, genInfo, sectionInfos) {

    var result = {};

    var incrementPerIndex = genInfo.bassMotifRythmCountIncreasePerIndex;
    var incrementRange = genInfo.bassMotifRythmCountIncreaseOffsetRange;

    var range = [index * incrementPerIndex + Math.min(incrementRange[0], incrementRange[1]),
        index * incrementPerIndex + Math.max(incrementRange[1], incrementRange[0])];


    setMotifRythm({
            zone1Prob: getArrayValueOrDefault(genInfo.bassMotifZone1Probabilities, index-1, 0.5),
            zone1TripletLikelihood: getArrayValueOrDefault(genInfo.bassMotifZone1TripletLikelihoods, index-1, 0.01),
            zone1DotDotNormalLikelihood: getArrayValueOrDefault(genInfo.bassMotifZone1DotDotNormalLikelihoods, index-1, 0.5),
            zone1DotFirstLikelihood: getArrayValueOrDefault(genInfo.bassMotifZone1DotFirstLikelihoods, index-1, 2),
            zone1DotNormalDotLikelihood: getArrayValueOrDefault(genInfo.bassMotifZone1DotNormalDotLikelihoods, index-1, 0.5),
            zone1DotSecondLikelihood: getArrayValueOrDefault(genInfo.bassMotifZone1DotSecondLikelihoods, index-1, 0.5),
            zone1NormalDotDotLikelihood: getArrayValueOrDefault(genInfo.bassMotifZone1NormalDotDotLikelihoods, index-1, 0.5),
            zone1StartPosRange: getArrayValueOrDefault(genInfo.bassMotifZone1StartPosRanges, index-1, [0, 0]),
            zone1EndPosRange: getArrayValueOrDefault(genInfo.bassMotifZone1EndPosRanges, index-1, [0.75, 0.75]),
            zone1StartEnd: getArrayValueOrDefault(genInfo.bassMotifZone1StartEnds, index-1, []),
            noteCountRange: range
        }, result, genData, genInfo, sectionInfos,
        "bassMotifRythmSeed");

    if (genInfo.bassMotifRythmNoteCountOverrides.length > 0) {
        result.noteCount = genInfo.bassMotifRythmNoteCountOverrides[index % genInfo.bassMotifRythmNoteCountOverrides.length];
        result.noteCountUnit = CountUnit.HARMONY_ELEMENT_BEATS;
    }

    setBassMotifVerticalIndices(result, genData, genInfo, sectionInfos);

    setBassMotifEmbellishConnectStuff(result, genData, genInfo, sectionInfos);

    return result;
}

function createHarmonyMotifInfo(renderAmountVar, genData, genInfo, sectionInfos, options) {

    var result = {};

    setHarmonyMotif(result, genData, genInfo, sectionInfos, renderAmountVar, options);

    setHarmonyMotifEmbellishConnectStuff(result, genData, genInfo, sectionInfos);

    return result;
}

function createPercussionMotifInfos(grooveCount, fillCount, result, genData, genInfo, sectionInfos) {

    var motifRnd = createOrGetRandom(genInfo, "percussionMotifSeed");
    var fillRnd = createOrGetRandom(genInfo, "percussionFillMotifSeed");
    var instrRnd = createOrGetRandom(genInfo, "percussionInstrumentSeed");
    var fillInstrRnd = createOrGetRandom(genInfo, "percussionFillInstrumentSeed");
    var rythmRnd = createOrGetRandom(genInfo, "percussionMotifRythmSeed");
    var fillRythmRnd = createOrGetRandom(genInfo, "percussionFillMotifRythmSeed");

    var songStructureInfo = genInfo.songStructureInfo;

    var numerator = 4;
    if (songStructureInfo.numerators && songStructureInfo.numerators.length > 0) {
        numerator = songStructureInfo.numerators[0];
    }

    var bassDrumRndInfos = genInfo.bassDrumRndInfos;
    var bassDrumNote = sampleData(bassDrumRndInfos, instrRnd);

    var snareRndInfos = genInfo.snareRndInfos;
    var snareDrumNote = sampleData(snareRndInfos, instrRnd);

    var crashRndInfos = genInfo.crashRndInfos;
    var crashNote = sampleData(crashRndInfos, instrRnd);

    var rideRndInfos = genInfo.rideRndInfos;
    var rideNotes = sampleNDataWithoutReplacement(rideRndInfos, 4, instrRnd); // sampleData(rndInfos, rnd);

    if (genInfo.overrideBassDrumNote) {
        bassDrumNote = genInfo.bassDrumNote;
    }
    if (genInfo.overrideSnareDrumNote) {
        snareDrumNote = genInfo.snareDrumNote;
    }
    if (genInfo.overrideCrashDrumNote) {
        crashNote = genInfo.crashDrumNote;
    }
    if (genInfo.overrideRideDrumNotes && genInfo.rideDrumNotes.length > 0) {
        rideNotes = genInfo.rideDrumNotes;
    }

    function perturbPattern(options, rnd) {
        if (!rnd) {
            rnd = rythmRnd;
        }

        var pattern = getValueOrDefault(options, "pattern", []);
        var strengths = getValueOrDefault(options, "strengths", []);
        var patternLength = getValueOrDefault(options, "patternLength", 16);
        var pertubations = getValueOrDefault(options, "pertubations", 1);
        var addMod = getValueOrDefault(options, "addMod", 1);
        var posShiftRndInfos = getValueOrDefault(options, "posShiftRndInfos", [{data: 1, likelihood: 1}]);

        var rndInfos = [
            {data: "posShift", likelihood: 1},
            {data: "addAccent", likelihood: 1},
            {data: "addGhost", likelihood: 1},
            {data: "addExtra", likelihood: 1},
            {data: "remove", likelihood: 1}
        ];

        var posShift = sampleData(posShiftRndInfos, rnd);

        var operations = sampleNData(rndInfos, pertubations, rnd);

        for (var i=0; i<operations.length; i++) {
            var index = 0;
            if (pattern.length > 0) {
                index = Math.floor(rnd.random() * pattern.length);
            }
            var element = pattern[index];
            var prevElement = 0;
            var nextElement = 0;
            var hasPrevElement = false;
            var hasNextElement = false;
            var spaceBefore = element > 0;
            var spaceForShiftBefore = element > posShift - 1;
            var spaceAfter = element < patternLength - 1;
            var spaceForShiftAfter = element < patternLength - posShift;
            if (index > 0) {
                prevElement = pattern[index - 1];
                hasPrevElement = true;
                spaceBefore = element - 1 > prevElement;
                spaceForShiftBefore = element - posShift > prevElement;
            }
            if (index < pattern.length - 1) {
                nextElement = pattern[index + 1];
                hasNextElement = true;
                spaceAfter = element + 1 < nextElement;
                spaceForShiftAfter = element + posShift < nextElement;
            }
//                logit(operations[i] + " " + JSON.stringify(pattern) + " " + JSON.stringify(strengths));
            switch (operations[i]) {
                case "posShift":
                    if (spaceBefore) {
                        if (spaceAfter) {
                            pattern[index] = rnd.random() < 0.5 ? element + posShift : element - posShift;
                        } else {
                            pattern[index] = element - posShift;
                        }
                    } else if (spaceAfter) {
                        pattern[index] = element + posShift;
                    }
                    break;
                case "addAccent":
                    strengths[index] = 1.0;
                    break;
                case "addGhost":
                    if (spaceBefore) {
                        pattern.splice(index, 0, element-1);
                        strengths.splice(index, 0, defaultStrength * 0.7);
                    }
                    break;
                case "addExtra":
                    var rndInfos = [];
                    var possible = createFilledNumericIncArray(patternLength, 0, 1);
                    arrayDeleteAll(possible, pattern);

                    var newPossible = [];
                    for (var j=0; j<possible.length; j++) {
                        var p = possible[j];
                        if (p % addMod == 0) {
                            newPossible.push(p);
                        }
                    }
                    possible = newPossible;
                    if (possible.length > 0) {
                        var newElement = possible[Math.floor(rnd.random() * possible.length)];
                        var at = pattern.length;
                        for (var j=0; j<pattern.length; j++) {
                            if (newElement < pattern[j]) {
                                at = j;
                                break;
                            }
                        }
                        pattern.splice(at, 0, newElement);
                        strengths.splice(at, 0, defaultStrength);
                    }
                    break;
                case "remove":
                    if (pattern.length > 1) {
                        pattern.splice(index, 1);
                        strengths.splice(index, 1);
                    }
                    break;
                default:
                    logit("unknown operation " + operations[i])
                    break;
            }
//                logit("  " + operations[i] + " after " + JSON.stringify(pattern) + " " + JSON.stringify(strengths));
        }
    }

    function assignIndices(pattern, max) {
        var result = [];
        var map = {};
        for (var i=0; i<pattern.length; i++) {
            var index = pattern[i];
            var trueIndex = map[index];
            if (typeof(trueIndex) === 'undefined') {
                trueIndex = Math.floor(motifRnd.random() * max);
                map[index] = trueIndex;
            }
            result.push(trueIndex);
        }
        return result;
    }


    var renderAmountRangeRndInfos = [
        {data: [0.0, 0.2], likelihood: 10},
        {data: [0.2, 0.4], likelihood: 8},
        {data: [0.4, 0.7], likelihood: 3},
        {data: [0.7, 1.0], likelihood: 1}];



    function getBooleanFromPattern(pattern, index, def) {
        if (pattern.length > 0) {
            return pattern[index % pattern.length] != 0;
        }
        return def;
    }

    for (var i=0; i<grooveCount; i++) {
        var info = {};
//        var infos = sampleData(typeInfos, rnd);
//        info.predefinedType = sampleData(infos, rnd);

        var renderAmountRangeRndInfosCopy = copyValueDeep(renderAmountRangeRndInfos);

        var rideRange = sampleNDataWithoutReplacement(renderAmountRangeRndInfosCopy, 1, motifRnd, true)[0];
        var bassRange = sampleNDataWithoutReplacement(renderAmountRangeRndInfosCopy, 1, motifRnd, true)[0];
        var crashRange = sampleNDataWithoutReplacement(renderAmountRangeRndInfosCopy, 1, motifRnd, true)[0];
        var snareRange = sampleNDataWithoutReplacement(renderAmountRangeRndInfosCopy, 1, motifRnd, true)[0];

        var addBassDrum = motifRnd.random() < 0.9;
        var addSnareDrum = motifRnd.random() < (addBassDrum ? 0.85 : 0.7);
        var addRide = motifRnd.random() < (addBassDrum || addSnareDrum ? 0.8 : 0.9);
        var addCrash = motifRnd.random() < (addBassDrum || addRide || addSnareDrum ? 0.1 : 0.15);

        addBassDrum = getBooleanFromPattern(genInfo.addBassDrumsOverride, i, addBassDrum);
        addSnareDrum = getBooleanFromPattern(genInfo.addSnareDrumsOverride, i, addSnareDrum);
        addRide = getBooleanFromPattern(genInfo.addRideDrumsOverride, i, addRide);
        addCrash = getBooleanFromPattern(genInfo.addCrashDrumsOverride, i, addCrash);

        if (!addBassDrum && !addSnareDrum && !addRide && !addCrash) {
            var index = sampleData([
                {data: 0, likelihood: 5},
                {data: 1, likelihood: 1},
                {data: 2, likelihood: 5},
                {data: 3, likelihood: 0.5}
            ], motifRnd);
            switch (index) {
                case 0:
                    addBassDrum = true;
                    break;
                case 1:
                    addSnareDrum = true;
                    break;
                case 2:
                    addRide = true;
                    break;
                case 3:
                    addCrash = true;
                    break;
            }
        }

        info.motifZoneInfos = [];

        info.rythmNoteCount = numerator * 4;
        info.densityAmplitude = 0.3 * rythmRnd.random();
        info.densityFrequency = 1 + Math.ceil(rythmRnd.random() * 3);
        info.densitySeed = rythmRnd.genrand_int31();

        var defaultStrength = 0.8;

        var divisorCheck = 16;

        function createAmountExpressionFromRange(prefix, range, rnd) {
            var amount = range[0] + rnd.random() * (range[1] - range[0]);
//            logit("amount expr from range " + JSON.stringify(range) + " gives amoutn " + JSON.stringify(amount));
            return prefix + "RenderAmountVar > " + amount;
        }

        if (addBassDrum) {
            var zoneInfo = {};
            var amountRange = bassRange;
            zoneInfo.activatedExpression = createAmountExpressionFromRange("percussion", amountRange, motifRnd);
            zoneInfo.multiplier = 4;
            zoneInfo.remainders = [0, 8];
            zoneInfo.remainderStrengths = createFilledArray(zoneInfo.remainders.length, 1.0);
            perturbPattern({
                addMod: 2,
                posShiftRndInfos: [
                    {data: 0, likelihood: 40},
//                    {data: 1, likelihood: 1},
                    {data: 2, likelihood: 10}],
                strengths: zoneInfo.remainderStrengths,
                pattern: zoneInfo.remainders,
                perturbations: Math.floor(rythmRnd.random() * 2)});
            zoneInfo.divisorCheck = divisorCheck;
            zoneInfo.divisorCheckUnit = PositionUnit.BEATS;
            zoneInfo.notes = [bassDrumNote];
            info.motifZoneInfos.push(zoneInfo);
        }
        if (addSnareDrum) {
            var zoneInfo = {};
            var amountRange = snareRange;
            zoneInfo.activatedExpression = createAmountExpressionFromRange("percussion", amountRange, motifRnd);
            zoneInfo.multiplier = 4;
            zoneInfo.remainders = [4, 12];
            zoneInfo.remainderStrengths = createFilledArray(zoneInfo.remainders.length, 1.0);
            perturbPattern({
                addMod: 2,
                posShiftRndInfos: [
//                    {data: 1, likelihood: 1},
                    {data: 2, likelihood: 20}],
                strengths: zoneInfo.remainderStrengths,
                pattern: zoneInfo.remainders,
                perturbations: Math.floor(rythmRnd.random() * 2)});
            zoneInfo.divisorCheck = divisorCheck;
            zoneInfo.divisorCheckUnit = PositionUnit.BEATS;
            zoneInfo.notes = [snareDrumNote];
            info.motifZoneInfos.push(zoneInfo);
        }
        if (addRide) {
            var zoneInfo = {};
//            var note2 = sampleData(rndInfos, rnd);
            var amountRange = rideRange;
            zoneInfo.activatedExpression = createAmountExpressionFromRange("percussion", amountRange, motifRnd);
            zoneInfo.multiplier = 4;

            zoneInfo.remainders = sampleData([
                {data: createFilledNumericIncArray(8, 0, 2), likelihood: 1}
//                {data: createFilledNumericIncArray(16, 0, 1), likelihood: 1}
            ], motifRnd);
            zoneInfo.remainderStrengths = createFilledArray(zoneInfo.remainders.length, defaultStrength);
            perturbPattern({
                strengths: zoneInfo.remainderStrengths,
                pattern: zoneInfo.remainders,
                perturbations: Math.floor(rythmRnd.random() * 3)});
            zoneInfo.quotients = [];
            zoneInfo.divisorCheck = divisorCheck;
            zoneInfo.divisorCheckUnit = PositionUnit.BEATS;
            zoneInfo.notes = copyValueDeep(rideNotes);

            var patternInfos = [
                {data: [0], likelihood: 10},
                {data: [0, 1], likelihood: 1},
                {data: [0, 1, 0], likelihood: 1},
                {data: [0, 1, 1], likelihood: 1},
                {data: [0, 1, 2], likelihood: 1},
                {data: [0, 0, 1], likelihood: 1},
                {data: [0, 0, 0, 1], likelihood: 5},
                {data: [0, 0, 1, 0], likelihood: 3},
                {data: [0, 1, 0, 0], likelihood: 2},
                {data: [0, 0, 1, 1], likelihood: 1},
                {data: [0, 1, 1, 1], likelihood: 1},
                {data: [0, 1, 1, 0], likelihood: 1},
                {data: [0, 0, 1, 2], likelihood: 1},
                {data: [0, 1, 2, 0], likelihood: 1},
                {data: [0, 1, 2, 1], likelihood: 1}
            ];
//            rnd.random();


            var pattern = sampleData(patternInfos, motifRnd);

            pattern = assignIndices(pattern, rideNotes.length);
            zoneInfo.noteIndexPattern = [];
            for (var j=0; j<pattern.length; j++) {
                zoneInfo.noteIndexPattern.push([pattern[j]]);
            }

            if (motifRnd.random() < 0.2) {
                // Adding special start ride
                zoneInfo.startNoteIndexPattern = [];
                pattern = sampleData(patternInfos, motifRnd);
                pattern = assignIndices(pattern, rideNotes.length);
                for (var j=0; j<pattern.length; j++) {
                    zoneInfo.startNoteIndexPattern.push([pattern[j]]);
                }
            }
            if (motifRnd.random() < 0.2) {
                // Adding special end ride
                zoneInfo.endNoteIndexPattern = [];
                pattern = sampleData(patternInfos, motifRnd);
                pattern = assignIndices(pattern, rideNotes.length);
                for (var j=0; j<pattern.length; j++) {
                    zoneInfo.endNoteIndexPattern.push([pattern[j]]);
                }
            }
            info.motifZoneInfos.push(zoneInfo);
        }
        if (addCrash) {
            var zoneInfo = {};
            var amountRange = crashRange;
            zoneInfo.activatedExpression = createAmountExpressionFromRange("percussion", amountRange, motifRnd);
            zoneInfo.multiplier = 4;
            zoneInfo.remainders = [0];
            zoneInfo.remainderStrengths = createFilledArray(zoneInfo.remainders.length, 1.0);
            zoneInfo.divisorCheck = divisorCheck;
            zoneInfo.divisorCheckUnit = PositionUnit.BEATS;
            zoneInfo.notes = [crashNote];
            info.motifZoneInfos.push(zoneInfo);
        }
        result.push(info);
    }

    var fillNoteRndInfos = [];

    fillNoteRndInfos.push({data: bassDrumNote, likelihood: 1});
    fillNoteRndInfos.push({data: crashNote, likelihood: 1});
    fillNoteRndInfos.push({data: snareDrumNote, likelihood: 5});
    for (var i=0; i<rideNotes.length; i++) {
        fillNoteRndInfos.push({data: rideNotes[i], likelihood: 1});
    }

    var fillNotes = sampleNDataWithoutReplacement(fillNoteRndInfos, 4, fillInstrRnd); // sampleData(rndInfos, rnd);

    if (genInfo.overrideFillNotes && genInfo.fillNotes.length > 0) {
        fillNotes = genInfo.fillNotes;
    }


    for (var i=0; i<fillCount; i++) {
        var info = {};


        info.motifZoneInfos = [];

        info.rythmNoteCount = numerator * 4;
        info.densityAmplitude = 0.3 * fillRythmRnd.random();
        info.densityFrequency = 1 + Math.ceil(fillRythmRnd.random() * 3);
        info.densitySeed = fillRythmRnd.genrand_int31();

        var defaultStrength = 0.8;

        var fillActivatedRange = genInfo.fillActivatedRenderAmountRange;
        var zoneInfo = {};
        zoneInfo.multiplier = 4;
        zoneInfo.activatedExpression = createAmountExpressionFromRange("percussion", fillActivatedRange, fillRnd);
        var fillRndValue = fillRnd.random();

        var fillPatternRndInfos = [
            {data: [0, 8], likelihood: 0.15},
            {data: [0, 8, 12], likelihood: 0.15},
            {data: [0, 4, 8, 12], likelihood: 0.15},
            {data: [0, 4, 8, 10, 12], likelihood: 0.15},
            {data: [0, 2, 4, 6, 8, 10, 12, 14], likelihood: 0.5},
            {data: [0, 4, 8, 10, 12, 14], likelihood: 0.2}
        ];

        zoneInfo.remainders = sampleData(fillPatternRndInfos, fillRnd);

        zoneInfo.remainderStrengths = createFilledArray(zoneInfo.remainders.length, defaultStrength);
        perturbPattern({
            strengths: zoneInfo.remainderStrengths,
            pattern: zoneInfo.remainders,
            perturbations: Math.floor(fillRythmRnd.random() * 3)}, fillRythmRnd);
        zoneInfo.divisorCheck = divisorCheck;
        zoneInfo.divisorCheckUnit = PositionUnit.BEATS;
        zoneInfo.notes = fillNotes;
        info.motifZoneInfos.push(zoneInfo);

        var fillIndexPatternRndInfos = copyValueDeep(genInfo.fillIndexPatternRndInfos);

        var pattern = sampleData(fillIndexPatternRndInfos, fillRnd);

//        pattern = assignIndices(pattern, fillNotes.length);

        zoneInfo.noteIndexPattern = [];
        for (var j=0; j<pattern.length; j++) {
            zoneInfo.noteIndexPattern.push([pattern[j]]);
        }

        if (fillRnd.random() < 0.2) {
            // Adding special start fill
            zoneInfo.startNoteIndexPattern = [];
            pattern = sampleData(fillIndexPatternRndInfos, fillRnd);
//            pattern = assignIndices(pattern, fillNotes.length);
            for (var j=0; j<pattern.length; j++) {
                zoneInfo.startNoteIndexPattern.push([pattern[j]]);
            }
        }
        if (fillRnd.random() < 0.2) {
            // Adding special end fill
            zoneInfo.endNoteIndexPattern = [];
            pattern = sampleData(fillIndexPatternRndInfos, fillRnd);
//            pattern = assignIndices(pattern, fillNotes.length);
            for (var j=0; j<pattern.length; j++) {
                zoneInfo.endNoteIndexPattern.push([pattern[j]]);
            }
        }

//        logit("fill info " + JSON.stringify(info));
        result.push(info);
    }

}

function createSuspendInfos(genData, genInfo, sectionInfos) {
    var rnd = createOrGetRandom(genInfo, "suspendSeed");

    var count = genInfo.suspendTypeCount;

    var tempo = genInfo.songStructureInfo.baseTempo;


    var maxTempo = 140;
    var minTempo = 60;
    var tempoSpan = maxTempo - minTempo;

    var tempoFraction = (tempo - minTempo) / tempoSpan;

    if (!genInfo.adaptSuspensionToTempo) {
        tempoFraction = 0.5;
    }

    var maxProb = 0.5 - 0.4 * tempoFraction;

//    logit("sus maxprob: " + maxProb);

    for (var i=0; i<count; i++) {
        var useSuspend = false;
        if (rnd.random() < genInfo.voiceLineSuspensionProbabilities[i % genInfo.voiceLineSuspensionProbabilities.length]) {
            useSuspend = true;
        }
        var info = {};
        info.seed = rnd.genrand_int31();
        info.probability = useSuspend ? rnd.random() * maxProb : 0;
        genData.suspendInfos[i] = info;
    }

}


function createMotifInfos(genData, genInfo, sectionInfos) {
    //
    // melody motifs, inner 1 motifs, inner 2 motifs, bass motifs, harmony motifs

    var melodyMotifCount = 4;

    var inner1StartIndex = melodyMotifCount;
    var inner2StartIndex = inner1StartIndex + melodyMotifCount;

    var bassStartIndex = inner2StartIndex + melodyMotifCount;

    var bassMotifCount = 4;

    var harmonyStartIndex = bassStartIndex + bassMotifCount;

    var harmonyMotifCount = 4; // for melody, inner1 and inner2

    var percussionGrooveMotifCount = 2;

    var percussionFillMotifCount = 4;

    for (var i=0; i<melodyMotifCount; i++) {
        var motifInfo = createMelodyMotifInfo(i, genData, genInfo, sectionInfos);
        // logit("Created motif info: " + JSON.stringify(motifInfo) + "<br />");
        genData.motifInfos[i] = motifInfo;
    }

    function copyMotifInfoWithChanges(motifInfo, prefix) {
        var copy = copyValueDeep(motifInfo);
        copy.fillerOffsetsExpression = copy.fillerOffsetsExpression.replace(/melody/g, prefix);
        return copy;
    }

    // Copy the melody motifs to inner 1 and inner 2
    for (var i=0; i<melodyMotifCount; i++) {
        genData.motifInfos[i + inner1StartIndex] = copyMotifInfoWithChanges(genData.motifInfos[i], "inner1");
    }
    for (var i=0; i<melodyMotifCount; i++) {
        genData.motifInfos[i + inner2StartIndex] = copyMotifInfoWithChanges(genData.motifInfos[i], "inner2");
    }


    for (var i=0; i<bassMotifCount; i++) {
        var motifInfo = createBassMotifInfo(i, genData, genInfo, sectionInfos);
        // logit("Created motif info: " + JSON.stringify(motifInfo) + "<br />");
        genData.motifInfos[i + bassStartIndex] = motifInfo;
    }


    var propNames = ["melody", "inner1", "inner2"];
    var rythmDensityMultipliers = [1, 1, 0.25];

    for (var j=0; j<propNames.length; j++) {
        for (var i=0; i<harmonyMotifCount; i++) {
            var motifInfo = createHarmonyMotifInfo(propNames[j] + "RenderAmountVar", genData, genInfo, sectionInfos,
                {rythmDensityMultiplier: rythmDensityMultipliers[j]});
            var index = i + harmonyStartIndex + j * harmonyMotifCount;
//            logit(propNames[j] + " harmony motif index " + i + " is " + index);
            genData.motifInfos[index] = motifInfo;
        }
    }
    genData.percussionMotifInfos = [];
    createPercussionMotifInfos(percussionGrooveMotifCount, percussionFillMotifCount, genData.percussionMotifInfos, genData, genInfo, sectionInfos);

//    logit(genData.percussionMotifInfos);

}

function createIndexInfos(genData, genInfo, sectionInfos) {
    var songStructureInfo = genInfo.songStructureInfo;
    var indexInfos = songStructureInfo.indexInfos;
    for (var i=0; i<indexInfos.length; i++) {
        genData.indexInfos[i] = copyValueDeep(indexInfos[i]);
    }
}

function createHarmonyRythmInfos(genData, genInfo, sectionInfos) {

    var harmonyRythmCount = genInfo.harmonyRythmCount;

    var hrRnd = createOrGetRandom(genInfo, "harmonyRythmSeed");

    var songStructureInfo = genInfo.songStructureInfo;

    var numerator = songStructureInfo.numerators[0];

    var useOddTime = hrRnd.random() < genInfo.oddHarmonyRythmProbability;

    if (useOddTime) {
        logit("Using odd time with numerator " + numerator);
    }
//    logit(useOddTime);


    for (var i=0; i<harmonyRythmCount; i++) {
        var info = {};

        var lengthLikelihoods = {"2": 30, "4": 70};

        info.measureSplitStrategy = SplitStrategy.HALVE;

        if (numerator == 3) {
            info.measureSplitStrategy = SplitStrategy.TRIPLET;
        }

        if (genInfo.adaptHarmonyRythmToTimeSignature) {
            if (useOddTime) {
                switch (numerator) {
                    case 2:
                        lengthLikelihoods = {"3": 30, "6": 70};
                        break;
                    case 3:
                        lengthLikelihoods = {"3": 70, "6": 30};
                        break;
                    case 4:
                        lengthLikelihoods = {"3": 100};
                        break;
                }
            } else {
                switch (numerator) {
                    case 2:
                        lengthLikelihoods = {"2": 0, "4": 100, "8": 50};
                        break;
                    case 3:
                        lengthLikelihoods = {"2": 10, "4": 90};
                        break;
                    case 4:
                        lengthLikelihoods = {"2": 30, "4": 70};
                        break;
                }
            }
        }
        var lengthTypes = {"2": NoteRythmElementLengthType.NORMAL,
            "3": NoteRythmElementLengthType.DOT,
            "4": NoteRythmElementLengthType.NORMAL,
            "6": NoteRythmElementLengthType.DOT,
            "8": NoteRythmElementLengthType.NORMAL
        };

        if (genInfo.adaptHarmonyRythmToTempo) {
            if (songStructureInfo.baseTempo > 110) {
                if (useOddTime) {
                    lengthLikelihoods["6"] *= 2;
                    lengthLikelihoods["3"] *= 0.75;
                } else {
                    lengthLikelihoods["4"] = 100;
                    lengthLikelihoods["2"] = 0;
                }
            } else if (songStructureInfo.baseTempo < 80) {
                if (useOddTime) {
                    lengthLikelihoods["6"] = 0;
                    lengthLikelihoods["3"] = 100;
                } else {
                    lengthLikelihoods["4"] *= 1;
                    lengthLikelihoods["2"] *= 1;
                }
            }
        }

        for (var lStr in genInfo.harmonyLengthLikelihoodMultipliers[i % genInfo.harmonyLengthLikelihoodMultipliers.length]) {
            var old = lengthLikelihoods[lStr];
            if (old) {
                lengthLikelihoods[lStr] *= genInfo.harmonyLengthLikelihoodMultipliers[i % genInfo.harmonyLengthLikelihoodMultipliers.length][lStr];
            }
        }
        for (var lStr in genInfo.harmonyLengthLikelihoodOverwriters[i % genInfo.harmonyLengthLikelihoodOverwriters.length]) {
            lengthLikelihoods[lStr] = genInfo.harmonyLengthLikelihoodOverwriters[i % genInfo.harmonyLengthLikelihoodOverwriters.length][lStr];
        }
        if (genInfo.overwriteHarmonyLengthLikelihoods[i % genInfo.overwriteHarmonyLengthLikelihoods.length]) {
            lengthLikelihoods = genInfo.harmonyLengthLikelihoods[i % genInfo.harmonyLengthLikelihoods.length];
        }

        var maxCountAdds = {
            "2": 3,
            "3": 4,
            "4": 6,
            "6": 7,
            "8": 8
        };

        var minCounts = {
            "2": 4,
            "3": 4,
            "4": 4,
            "6": 6,
            "8": 7
        };


        if (genInfo.adaptHarmonyRythmToTempo) {
            if (songStructureInfo.baseTempo > 115) {
                maxCountAdds["8"] = 2;
                maxCountAdds["6"] = 2;
                maxCountAdds["4"] = 3;
                maxCountAdds["3"] = 2;
                maxCountAdds["2"] = 2;
            } else if (songStructureInfo.baseTempo > 105) {
                maxCountAdds["8"] = 2;
                maxCountAdds["6"] = 2;
                maxCountAdds["4"] = 4;
                maxCountAdds["3"] = 3;
            } else if (songStructureInfo.baseTempo > 90) {
                maxCountAdds["8"] = 4;
                maxCountAdds["6"] = 4;
                maxCountAdds["4"] = 5;
            }
        }

        // Fewer beats with lower numerator
        for (var c in maxCountAdds) {
            var add = maxCountAdds[c];
            add = Math.round(add * (numerator / 4.0));
            maxCountAdds[c] = add;
        }

//        lengthLikelihoods["6"] = 10000;
        if (genInfo.harmonyRythmMeasureCountOverrides.length > 0) {
            var c = genInfo.harmonyRythmMeasureCountOverrides[i % genInfo.harmonyRythmMeasureCountOverrides.length];
            lengthLikelihoods = {};
            lengthLikelihoods[c] = 1;
//            logit("Overwriting harmony rythm count " + c + " for index " + i);
        }

        var lengthRndInfos = [];
        for (var lengthStr in lengthLikelihoods) {
            var lik = lengthLikelihoods[lengthStr];
            if (lik > 0) {
                var lt = lengthTypes[lengthStr];
                lengthRndInfos.push({
                    data: {length: parseInt(lengthStr), lengthType: lt},
                    likelihood: lik
                });
            }
        }

        var totalLengthInfo = sampleData(lengthRndInfos, hrRnd);

        var maxAdd = maxCountAdds[totalLengthInfo.length];
        if (!maxAdd) {
            maxAdd = 3;
        }

        var minCount = minCounts[totalLengthInfo.length];
        if (!minCount) {
            minCount = 4;
        }

        var count = minCount + Math.floor(hrRnd.random() * maxAdd);


//        logit("HR count " + count + " " + minCount + " " + maxAdd + " " + totalLengthInfo.length);

        info.lengthType = totalLengthInfo.lengthType;

        info.totalLength = totalLengthInfo.length;
        info.count = count;
        info.count = getArrayValueOrDefault(genInfo.harmonyRythmNoteCountOverrides, i, info.count);

        info.seed = Math.round(hrRnd.random() * 947283493 + 142);

        info.densityFrequency = 2 + Math.floor(hrRnd.random() * 4);
        info.densityAmplitude = 1;


        if (genInfo.harmonyRythmDensityCurveFrequencyOverrides.length > 0) {
            info.densityFrequency = genInfo.harmonyRythmDensityCurveFrequencyOverrides[i % genInfo.harmonyRythmDensityCurveFrequencyOverrides.length];
        }
        if (genInfo.harmonyRythmDensityCurveAmplitudeOverrides.length > 0) {
            info.densityAmplitude = genInfo.harmonyRythmDensityCurveAmplitudeOverrides[i % genInfo.harmonyRythmDensityCurveAmplitudeOverrides.length];
//            logit("Forcing density amp to " + info.densityAmplitude);
        }

        info.staticLength = 10;
        info.dynamicLength = 10;
        info.dominantCadenceLength = 10;
        info.tonicCadenceLength = 10;

        var harmonyProlongInfos = [
            {data: {propName: "staticLength"}, likelihood: genInfo.prolongStaticLikelihoods[i % genInfo.prolongStaticLikelihoods.length]},
            {data: {propName: "dynamicLength"}, likelihood: genInfo.prolongDynamicLikelihoods[i % genInfo.prolongDynamicLikelihoods.length]},
            {data: {propName: "dominantCadenceLength"}, likelihood: genInfo.prolongDominantCadenceLikelihoods[i % genInfo.prolongDominantCadenceLikelihoods.length]},
            {data: {propName: "tonicCadenceLength"}, likelihood: genInfo.prolongTonicCadenceLikelihoods[i % genInfo.prolongTonicCadenceLikelihoods.length]}
        ];

        var lengthBias = genInfo.prolongHarmonyPartBiases[i % genInfo.prolongHarmonyPartBiases.length];
        var lengthFraction = genInfo.prolongHarmonyPartRandomFractions[i % genInfo.prolongHarmonyPartRandomFractions.length];

        var prolongInfo = sampleData(harmonyProlongInfos, hrRnd);
        info[prolongInfo.propName] = lengthBias + Math.ceil(hrRnd.random() * lengthFraction);


        genData.harmonyRythmInfos[i] = info;
    }

}

function getCustomLinearInterpolationCurveInfo(id, rndInfos, msRnd, bakeAmpBias) {
    var info = sampleData(rndInfos, msRnd);
    var ampRange = info.ampRange;
    var biasRange = info.biasRange;

    var curve = new LinearInterpolationCurve();
    curve.id = id;
    curve.xValues = copyValueDeep(info.xValues);
    curve.yValues = copyValueDeep(info.yValues);

    if (info.xValuesExpression) {
        curve.xValuesExpression = info.xValuesExpression;
        curve.xValuesUseExpression = true;
    }
    if (info.yValuesExpression) {
        curve.yValuesExpression = info.yValuesExpression;
        curve.yValuesUseExpression = true;
    }
    curve.evaluateExpressions = curve.yValuesUseExpression || curve.xValuesUseExpression;

    info.amplitude = ampRange[0] + msRnd.random() * (ampRange[1] - ampRange[0]);
    info.bias = biasRange[0] + msRnd.random() * (biasRange[1] - biasRange[0]);

    info.curveId = curve.id;
    info.curve = curve;
//        logit("creating curve " + JSON.stringify(curve));

    return info;
}


function getRandomCurveInfos(options, rnd) {

    var leapsRange = getValueOrDefault(options, "leapsRange", [1, 1]);
    var startLevels = getValueOrDefault(options, "startLevels", [-10, -5, 0, 5, 10]);
    var endLevels = getValueOrDefault(options, "endLevels", [-10, -5, 0, 5, 10]);
    var depths = getValueOrDefault(options, "depths", [2, 3]);
    var ampRange = getValueOrDefault(options, "ampRange", [10, 14]);
    var biasRange = getValueOrDefault(options, "biasRange", [68, 76]);

    function getPossible(currentLevel, prevStep, prevPrevStep, depth, currentResult, allResults, maxDepth) {
        currentResult.push(currentLevel);
        if (depth == maxDepth) {
            // Check validity
            var ok = arrayContains(endLevels, currentLevel);

            var leaps = 0;
            for (var i=1; i<currentResult.length; i++) {
                var step = currentResult[i] - currentResult[i-1];
                if (Math.abs(step) > 5) {
                    leaps++;
                }
            }
            ok = ok || (leaps >= leapsRange[0] && leaps <= leapsRange[1]);
            if (ok) {
                allResults.push(copyValueDeep(currentResult));
            }
            return;
        }
        var absPrev = Math.abs(prevStep);
        var absPrevPrev = Math.abs(prevPrevStep);

        var possibleSteps = [];

        if (absPrev != 0) {
            possibleSteps.push(0);
        }

        if (currentLevel < 10) {
            possibleSteps.push(5);
        }
        if (currentLevel > -10) {
            possibleSteps.push(-5);
        }

        // No leap is allowed if we stayed on previous level and leapt before that
        var noLeap = absPrev == 0 && absPrevPrev >= 10;

        if (!noLeap) {
            if (currentLevel <= 0 && absPrev <= 5) {
                possibleSteps.push(10);
            }
            if (currentLevel >= 0 && absPrev <= 5) {
                possibleSteps.push(-10);
            }
            if (currentLevel <= -5 && absPrev <= 5) {
                possibleSteps.push(15);
            }
            if (currentLevel >= 5 && absPrev <= 5) {
                possibleSteps.push(-15);
            }
        }
        for (var i=0; i<possibleSteps.length; i++) {
            var step = possibleSteps[i];
            var resultCopy = copyValueDeep(currentResult);
            getPossible(currentLevel + step, step, prevStep, depth + 1, resultCopy, allResults, maxDepth);
        }
    }

    var allResults = [];
    for (var i=0; i<startLevels.length; i++) {
        for (var j=0; j<depths.length; j++) {
            getPossible(startLevels[i], 0, 0, 0, [], allResults, depths[j]);
        }
    }

//    logit(JSON.stringify(allResults));

    var rndInfos = [];

    for (var i=0; i<allResults.length; i++) {
        var profile = allResults[i];

        var xValues = [];
        var yValues = [];
        var xStep = 1.0 / (profile.length - 1);
        for (var j=0; j<profile.length; j++) {
            xValues[j] = j * xStep;
            yValues[j] = 0.1 * profile[j];
        }

        if (rnd.random() < 0.5) {
            // Perturb x somewhat
            var index = 1 + Math.floor(rnd.random() * (xValues.length - 2));
            xValues[index] += -xStep * 0.25 + rnd.random() * xStep * 0.5;
//            logit("new xValues: " + JSON.stringify(xValues));
        }

        rndInfos.push(
            {data:
            {ampRange: ampRange, biasRange: biasRange, xValues: xValues, yValues: yValues},
                likelihood: 1});
    }

    return rndInfos;
}


function createMelodyShapeInfos(genData, genInfo, sectionInfos) {

    var msRnd = createOrGetRandom(genInfo, "melodyShapeSeed");
    var bsRnd = createOrGetRandom(genInfo, "bassShapeSeed");

    var melodyShapeCount = genInfo.melodyShapeCount;


    var rndInfos = getRandomCurveInfos({
    }, msRnd);


    function updateRndInfos(infos, ampRange, biasRange) {
        for (var i=0; i<infos.length; i++) {
            var info = infos[i];
            info.data.ampRange = ampRange;
            info.data.biasRange = biasRange;
        }
    }

    function convertLevels(input) {
        var result = [];
        for (var i=0; i<input.length; i++) {
            result[i] = 5 * Math.round(clamp(input[i], -2, 2));
        }
        return result;
    }

    function getLevels(arr2d, def) {
        var result = def;
        if (arr2d.length > 0) {
            var arr = arr2d[i % arr2d.length];
            if (arr.length > 0) {
                result = arr;
            }
        }
        return convertLevels(result);
    }

    for (var i=0; i<melodyShapeCount; i++) {
        var melodyRndInfos = copyValueDeep(rndInfos);

        var startLevels = getLevels(genInfo.melodyStartLevels, [-2, -1, 0, 1, 2]);
        var endLevels = getLevels(genInfo.melodyEndLevels, [-2, -1, 0, 1, 2]);

        var ampRange = [6, 12];
        var biasRange = [68, 76];
        if (genInfo.melodyShapeAmpRanges.length > 0) {
            ampRange = genInfo.melodyShapeAmpRanges[i % genInfo.melodyShapeAmpRanges.length];
//            logit("Overriding amp range for index " + i + " with " + ampRange.join(", "));
        }
        if (genInfo.melodyShapeBiasRanges.length > 0) {
            biasRange = genInfo.melodyShapeBiasRanges[i % genInfo.melodyShapeBiasRanges.length];
//            logit("Overriding bias range for index " + i + " with " + biasRange.join(", "));
        }
        updateRndInfos(melodyRndInfos, copyValueDeep(ampRange), copyValueDeep(biasRange));

        genData.melodyShapeInfos[i] = getCustomLinearInterpolationCurveInfo("melodyCurve" + (i+1), melodyRndInfos, msRnd);
    }

    var bassShapeCount = genInfo.bassShapeCount;

    for (var i=0; i<bassShapeCount; i++) {
        var bassRndInfos = copyValueDeep(rndInfos);
        var ampRange = [2, 4];
        var biasRange = [35, 45];
        if (genInfo.bassShapeAmpRanges.length > 0) {
            ampRange = genInfo.bassShapeAmpRanges[i % genInfo.bassShapeAmpRanges.length];
        }
        if (genInfo.bassShapeBiasRanges.length > 0) {
            biasRange = genInfo.bassShapeBiasRanges[i % genInfo.bassShapeBiasRanges.length];
        }
        updateRndInfos(bassRndInfos, ampRange, biasRange);
        genData.bassShapeInfos[i] = getCustomLinearInterpolationCurveInfo("bassCurve" + (i+1), bassRndInfos, bsRnd);
    }

}


function createChannelDistributionInfos(genData, genInfo, sectionInfos) {
    var prefixes = ["melody", "inner1", "inner2", "bass"];

    for (var j=0; j<prefixes.length; j++) {
        var prefix = prefixes[j];
        for (var i=0; i<3; i++) {
            var info = {channels: [[i]], endChannels: [[i]]};
            genData[prefix + "ChannelDistributionInfos"][i] = info;
        }
    }
}


function createChannelInstruments(genData, genInfo, sectionInfos) {

    var instrRnd = createOrGetRandom(genInfo, "instrumentTypeSeed");
    var melodyInstrRnd = createOrGetRandom(genInfo, "melodyInstrumentSeed");
    var inner1InstrRnd = createOrGetRandom(genInfo, "inner1InstrumentSeed");
    var inner2InstrRnd = createOrGetRandom(genInfo, "inner2InstrumentSeed");
    var bassInstrRnd = createOrGetRandom(genInfo, "bassInstrumentSeed");

    var electronicMelodyInstrInfos = genInfo.electronicMelodyInstrInfos;
    var electronicInnerFastInstrInfos = genInfo.electronicInnerFastInstrInfos;
    var electronicInnerSlowInstrInfos = genInfo.electronicInnerSlowInstrInfos;
    var electronicBassInstrInfos = genInfo.electronicBassInstrInfos;

    var electricMelodyInstrInfos = genInfo.electricMelodyInstrInfos;
    var electricInnerFastInstrInfos = genInfo.electricInnerFastInstrInfos;
    var electricInnerSlowInstrInfos = genInfo.electricInnerSlowInstrInfos;
    var electricBassInstrInfos = genInfo.electricBassInstrInfos;

    var acousticMelodyInstrInfos = genInfo.acousticMelodyInstrInfos;
    var acousticInnerFastInstrInfos = genInfo.acousticInnerFastInstrInfos;
    var acousticInnerSlowInstrInfos = genInfo.acousticInnerSlowInstrInfos;
    var acousticBassInstrInfos = genInfo.acousticBassInstrInfos;

    var melodyInstrumentInfos = acousticMelodyInstrInfos;
    var inner1InstrumentInfos = acousticInnerFastInstrInfos;
    var inner2InstrumentInfos = acousticInnerSlowInstrInfos;
    var bassInstrumentInfos = acousticBassInstrInfos;

    var instrType = sampleData(
        [
            {data: SimpleModuleGeneratorInstrumentSetType.ACOUSTIC, likelihood: genInfo.acousticLikelihood},
            {data: SimpleModuleGeneratorInstrumentSetType.ELECTRIC, likelihood: genInfo.electricLikelihood},
            {data: SimpleModuleGeneratorInstrumentSetType.ELECTRONIC, likelihood: genInfo.electronicLikelihood}
        ],
        instrRnd);

    switch (instrType) {
        case SimpleModuleGeneratorInstrumentSetType.ACOUSTIC:
            melodyInstrumentInfos = acousticMelodyInstrInfos;
            inner1InstrumentInfos = acousticInnerFastInstrInfos;
            inner2InstrumentInfos = acousticInnerSlowInstrInfos;
            bassInstrumentInfos = acousticBassInstrInfos;
            break;
        case SimpleModuleGeneratorInstrumentSetType.ELECTRIC:
            melodyInstrumentInfos = electricMelodyInstrInfos;
            inner1InstrumentInfos = electricInnerFastInstrInfos;
            inner2InstrumentInfos = electricInnerSlowInstrInfos;
            bassInstrumentInfos = electricBassInstrInfos;
            break;
        case SimpleModuleGeneratorInstrumentSetType.ELECTRONIC:
            melodyInstrumentInfos = electronicMelodyInstrInfos;
            inner1InstrumentInfos = electronicInnerFastInstrInfos;
            inner2InstrumentInfos = electronicInnerSlowInstrInfos;
            bassInstrumentInfos = electronicBassInstrInfos;
            break;
    }


    var allDifferentProb = genInfo.allInstrumentsDifferentProbability;

    if (melodyInstrumentInfos.length < 3 || inner1InstrumentInfos.length < 3 ||
        inner2InstrumentInfos.length < 3 || bassInstrumentInfos.length < 3) {
        allDifferentProb = -1;
    }

    if (melodyInstrRnd.random() < allDifferentProb) {
        // All instruments different
        genData.melodyChannelInstruments = sampleNDataWithoutReplacement(melodyInstrumentInfos, 3, melodyInstrRnd);
        genData.inner1ChannelInstruments = sampleNDataWithoutReplacement(inner1InstrumentInfos, 3, inner1InstrRnd);
        genData.inner2ChannelInstruments = sampleNDataWithoutReplacement(inner2InstrumentInfos, 3, inner2InstrRnd);
        genData.bassChannelInstruments = sampleNDataWithoutReplacement(bassInstrumentInfos, 3, bassInstrRnd);
    } else {
        for (var i=0; i<3; i++) {
            genData.melodyChannelInstruments[i] = sampleData(melodyInstrumentInfos, melodyInstrRnd);
            genData.inner1ChannelInstruments[i] = sampleData(inner1InstrumentInfos, inner1InstrRnd);
            genData.inner2ChannelInstruments[i] = sampleData(inner2InstrumentInfos, inner2InstrRnd);
            genData.bassChannelInstruments[i] = sampleData(bassInstrumentInfos, bassInstrRnd);
        }
    }

    if (genInfo.overwriteMelodyInstruments && genInfo.melodyInstruments.length > 0) {
//        logit("Overwriting melod yinstrument " + genInfo.melodyInstruments);
        genData.melodyChannelInstruments = copyValueDeep(createFilledPatternArray(3, genInfo.melodyInstruments));
    }
    if (genInfo.overwriteInner1Instruments && genInfo.inner1Instruments.length > 0) {
        genData.inner1ChannelInstruments = copyValueDeep(createFilledPatternArray(3, genInfo.inner1Instruments));
    }
    if (genInfo.overwriteInner2Instruments && genInfo.inner2Instruments.length > 0) {
        genData.inner2ChannelInstruments = copyValueDeep(createFilledPatternArray(3, genInfo.inner2Instruments));
    }
    if (genInfo.overwriteBassInstruments && genInfo.bassInstruments.length > 0) {
        genData.bassChannelInstruments = copyValueDeep(createFilledPatternArray(3, genInfo.bassInstruments));
    }
}



function createMotifDistributionInfos(genData, genInfo, sectionInfos) {

    var melodyRnd = createOrGetRandom(genInfo, "melodyMotifDistributionSeed");
    var inner1Rnd = createOrGetRandom(genInfo, "inner1MotifDistributionSeed");
    var inner2Rnd = createOrGetRandom(genInfo, "inner2MotifDistributionSeed");
    var bassRnd = createOrGetRandom(genInfo, "bassMotifDistributionSeed");
    var percussionRnd = createOrGetRandom(genInfo, "percussionMotifDistributionSeed");
    var percussionFillRnd = createOrGetRandom(genInfo, "percussionFillMotifDistributionSeed");
    var melodyHarmPuncRnd = createOrGetRandom(genInfo, "melodyHarmonyPunctationSeed");
    var innerHarmPuncRnd = createOrGetRandom(genInfo, "innerHarmonyPunctationSeed");

    var motifDistributionCount = genInfo.motifDistributionCount;

    var melodyIntensities = genInfo.songStructureInfo.melodyMotifDistributionRythmIntensities;

    var melodyMotifCount = 4;

    var inner1StartIndex = melodyMotifCount;
    var inner2StartIndex = inner1StartIndex + melodyMotifCount;

    var bassStartIndex = inner2StartIndex + melodyMotifCount;

    var bassMotifCount = 4;

    var harmonyStartIndex = bassStartIndex + bassMotifCount;

    var harmonyMotifCount = 4; // for melody, inner1 and inner2

    var motifCount = 4;

    var grooveMotifCount = 2;
    var fillMotifCount = 4;

    var fillStartIndex = genData.fillStartIndex;


    var grooveRndInfos = [
        {data: [0], likelihood: 1}
//        {data: [0, 1], likelihood: 1}
    ];

    for (var i=0; i<motifDistributionCount; i++) {
        var grooveMap = {};
        var indices = sampleData(grooveRndInfos, percussionRnd);

        var info = {
            indices: []
        };
        for (var j=0; j<indices.length; j++) {
            var index = indices[j];
            var trueIndex = grooveMap[index];
            if (typeof(trueIndex) === 'undefined') {
                trueIndex = Math.floor(percussionRnd.random() * grooveMotifCount);
                grooveMap[index] = trueIndex;
            }
            info.indices.push(trueIndex);
        }
        var rndValue = percussionRnd.random();

        genData.percussionMotifDistributionInfos[i] = info;
    }


    // Fill distributions
    for (var i=0; i<motifDistributionCount; i++) {
        var info = {
            indices: []
        };
        var indices = sampleData(grooveRndInfos, percussionFillRnd);
        var rndValue = percussionFillRnd.random();

        // What type of fill, if any
        var fillIndex1 = Math.floor(percussionFillRnd.random() * fillMotifCount);
        var fillIndex2 = Math.floor(percussionFillRnd.random() * fillMotifCount);

        var prob = getArrayValueOrDefault(genInfo.percussionFillProbabilities, i, 0.35);

        var fillIndexOverride = getArrayValueOrDefault(genInfo.percussionFillMotifIndicesOverride, i, fillIndex1);
        if (fillIndexOverride < 0) {
            prob = 0;
        } else if (genInfo.percussionFillMotifIndicesOverride.length > 0) {
            prob = 1;
            fillIndex1 = fillIndexOverride;
        }

        if (rndValue < prob) {
            info.indices = [fillIndex1 + fillStartIndex];
        } else {
            // No fill, just continue pattern
        }
//        logit(info + " prob: " + prob);
        genData.percussionFillMotifDistributionInfos[i] = info;
    }


    var melodyMotifIndexPatternInfos = genInfo.melodyMotifIndexPatternInfos;
    var bassMotifIndexPatternInfos = genInfo.bassMotifIndexPatternInfos;


    // Create the melody motif distributions
    for (var j=0; j<motifDistributionCount; j++) {
        var info = {};

        var melodyRythmIntensity = 1; // melodyIntensities[j];

        var possibleEndIndices = [];
        for (var i=1; i<motifCount; i++) {
            possibleEndIndices[i-1] = {data: i, likelihood: 1};
        }

        var multiplier = 1;
        for (var k=0; k<possibleEndIndices.length; k++) {
            possibleEndIndices[k].likelihood *= multiplier;
            multiplier *= melodyRythmIntensity;
        }
        var endIndex = sampleData(possibleEndIndices, melodyRnd);

        info.endIndices = [[endIndex], [0]];
//        info.endIndicesExpression = "melodyRenderAmountVar > 0 ? [[" + endIndex + "], [0]] : []";
        var renderAmountExpression = "";

        // Add harmony punctation
        function addHarmonyPunctation(endIndices, offset) {
            var indicesEnd = sampleData([
                {data: [], likelihood: 0.5},
                {data: [0], likelihood: 1},
                {data: [1], likelihood: 1},
                {data: [0, 1], likelihood: 1}
            ], melodyHarmPuncRnd);
            for (var k=0; k<indicesEnd.length; k++) {
                endIndices[indicesEnd[k]].push(sampleData([
                    {data: offset + harmonyStartIndex, likelihood: 1},
                    {data: offset + harmonyStartIndex+1, likelihood: 1},
                    {data: offset + harmonyStartIndex+2, likelihood: 1},
                    {data: offset + harmonyStartIndex+3, likelihood: 1}
                ], melodyHarmPuncRnd));
            }
        }

        addHarmonyPunctation(info.endIndices, 0);

        var possibleIndices = [];
        for (var i=1; i<motifCount; i++) {
            possibleIndices[i-1] = {data: i, likelihood: 1};
        }

        var multiplier = 1;
        for (var k=0; k<possibleIndices.length; k++) {
            possibleIndices[k].likelihood *= multiplier;
            multiplier *= melodyRythmIntensity;
        }

        var melodyMotifIndices = [];
        melodyMotifIndices[0] = 0;
        for (var i=1; i<motifCount; i++) {
            var index = sampleDataIndex(possibleIndices, melodyRnd); // Sampling index because we need it for removing it for further sampling
            melodyMotifIndices[i] = possibleIndices[index].data;
            possibleIndices.splice(index, 1);
        }

        var indicesPhrase = sampleData(melodyMotifIndexPatternInfos, melodyRnd);

        var indices = [];
        for (var i=0; i<indicesPhrase.length; i++) {
            var arr = indicesPhrase[i];
            indices[i] = [melodyMotifIndices[arr[0]]]
        }
        info.indices = copyValueDeep(indices);

        genData.melodyMotifDistributionInfos[j] = info;
        // logit("Created melody motif distribution: " + JSON.stringify(info) + "<br />");
    }

    // Inner voice 1 can share the melody line with the melody, but then the distributions become paired
    for (var j=0; j<motifDistributionCount; j++) {
        var info = {};

        var melodyInfo = genData.melodyMotifDistributionInfos[j];

        info.indices = createFilledArrayWithCopyValue(melodyInfo.indices.length, [inner1StartIndex]);
        info.endIndices = [];
//        info.endIndices = createFilledArrayWithCopyValue(melodyInfo.endIndices.length, [0]);

        genData.inner1MotifDistributionInfos[j] = info;

        var shareMelody = inner1Rnd.random() < genInfo.melodyShareProbabilities[j % genInfo.melodyShareProbabilities.length];

        function shareWithMelody(melodyIndices, otherIndices, offset) {
            var possibleShareIndices = [];
            var shareMotifIndices = [];
            for (var k=1; k<melodyIndices.length; k++) {
                var tempIndices = melodyIndices[k];
                for (var l=0; l<tempIndices; l++) {
                    var index = tempIndices[l];
                    if (index > 0 && index < motifCount) {
                        // Can be shared
                        possibleShareIndices.push(k);
                        shareMotifIndices.push(index);
                    }
                }
            }
            if (possibleShareIndices.length > 0) {
                var rndDatas = [];
                for (var k=0; k<possibleShareIndices.length; k++) {
                    rndDatas.push({data: possibleShareIndices[k], likelihood: 1});
                }
                var index = sampleDataIndex(rndDatas, inner1Rnd);
                var shareIndex = possibleShareIndices[index];
                otherIndices[shareIndex].push(offset + shareMotifIndices[index]);
//                logit("Melody indices before: " + JSON.stringify(melodyIndices) + "<br />");
                arrayDelete(melodyIndices[shareIndex], shareMotifIndices[index]);
                melodyIndices[shareIndex].push(0);
                arrayDelete(otherIndices[shareIndex], offset);
//                logit("Melody indices after: " + JSON.stringify(melodyIndices) + "<br />");
            }
        }
        if (shareMelody) {
            shareWithMelody(melodyInfo.indices, info.indices, inner1StartIndex);
        }
//        logit("Can be shared: " + JSON.stringify(possibleShareIndices) + " " + JSON.stringify(shareMotifIndices) + "<br />");
//        logit("Created inner1 motif distribution: " + JSON.stringify(info) + "<br />");
    }

    // Inner 2 is mainly for slow voices
    for (var j=0; j<motifDistributionCount; j++) {
        var info = {};

        var melodyInfo = genData.melodyMotifDistributionInfos[j];

        info.indices = createFilledArrayWithCopyValue(melodyInfo.indices.length, [inner2StartIndex]);
        info.endIndices = createFilledArrayWithCopyValue(melodyInfo.endIndices.length, [inner2StartIndex]);

        genData.inner2MotifDistributionInfos[j] = info;
    }


    // Bass is similar to melody
    for (var j=0; j<motifDistributionCount; j++) {
        var info = {};

        // genData.harmonyStartIndex + 1
        var bassRythmIntensity = 1; // melodyIntensities[j];

        var possibleEndIndices = [];
        for (var i=0; i<motifCount; i++) {
            possibleEndIndices[i] = {data: i, likelihood: 1};
        }

        var multiplier = 1;
        for (var k=0; k<possibleEndIndices.length; k++) {
            possibleEndIndices[k].likelihood *= multiplier;
            multiplier *= bassRythmIntensity;
        }
        var endIndex = sampleData(possibleEndIndices, bassRnd);

        info.endIndices = [[endIndex + bassStartIndex]];

        var possibleIndices = [];
        for (var i=0; i<motifCount; i++) {
            possibleIndices[i] = {data: i, likelihood: 1};
        }

        var multiplier = 1;
        for (var k=0; k<possibleIndices.length; k++) {
            possibleIndices[k].likelihood *= multiplier;
            multiplier *= bassRythmIntensity;
        }

        var bassMotifIndices = [];
        for (var i=0; i<motifCount; i++) {
            var index = sampleDataIndex(possibleIndices, bassRnd); // Sampling index because we need it for removing it for further sampling
            bassMotifIndices[i] = possibleIndices[index].data;
            possibleIndices.splice(index, 1);
        }

        var indicesPhrase = sampleData(bassMotifIndexPatternInfos, melodyRnd);

        var indices = [];
        for (var i=0; i<indicesPhrase.length; i++) {
            var arr = indicesPhrase[i];
            indices[i] = [bassMotifIndices[arr[0]] + bassStartIndex];
        }
        info.indices = copyValueDeep(indices);

        genData.bassMotifDistributionInfos[j] = info;
//        logit("Created bass motif distribution: " + JSON.stringify(info) + "<br />");
    }



    // Inner 1 can render harmony and also help with punctate

    for (var k=0; k<2; k++) {
        var prefix = "inner" + (k + 1);
        for (var j=0; j<motifDistributionCount; j++) {

            var innerDistInfo = genData[prefix + "MotifDistributionInfos"][j];

            var onOffPatterns = [ // Use 0 and 1 instead :)
                {data: [true], likelihood: 10},
                {data: [false], likelihood: 1},
                {data: [false, true], likelihood: 5},
                {data: [true, false], likelihood: 5},
                {data: [false, true, false], likelihood: 1},
                {data: [false, true, true], likelihood: 1},
                {data: [true, false, false], likelihood: 1},
                {data: [true, false, true], likelihood: 3},
                {data: [true, true, false], likelihood: 3},
                {data: [false, false, false, true], likelihood: 1},
                {data: [false, false, true, false], likelihood: 1},
                {data: [false, false, true, true], likelihood: 1},
                {data: [false, true, false, false], likelihood: 1},
                {data: [false, true, true, false], likelihood: 3},
                {data: [false, true, true, true], likelihood: 4},
                {data: [true, false, false, false], likelihood: 1},
                {data: [true, false, false, true], likelihood: 1},
                {data: [true, false, true, true], likelihood: 1},
                {data: [true, true, false, false], likelihood: 1},
                {data: [true, true, false, true], likelihood: 3},
                {data: [true, true, true, false], likelihood: 3}
            ];

            var onOffPattern1 = sampleData(onOffPatterns, innerHarmPuncRnd);

            for (var i=0; i<innerDistInfo.indices.length; i++) {
                var on = onOffPattern1[i % onOffPattern1.length];
                if (on) {
                    var index = harmonyStartIndex + (k + 1) * harmonyMotifCount + Math.floor(innerHarmPuncRnd.random() * harmonyMotifCount);
                    innerDistInfo.indices[i].push(index);
                }
            }
//        logit(inner1DistInfo);
        }
    }
}

function createRenderAmountInfos(genData, genInfo, sectionInfos) {

    var songStructure = genInfo.songStructureInfo;

    var propNames = ["melodyRenderAmount", "inner1RenderAmount",
        "inner2RenderAmount", "bassRenderAmount", "percussionRenderAmount"];


    function perturbRenderAmountInfo(info, rnd) {
        var operationRndInfos = [
            {data: "partialRedistribute", likelihood: 1},
            {data: "fullRedistribute", likelihood: 2}
        ];

        function infoOk(info) {
            // At least two must be greater than 0
            var amountGtZeroCount = 0;
            var voiceCount = 0;
            for (var p in info) {
                var amount = info[p];
                if (amount > 0) {
                    amountGtZeroCount++;
                    if (p != "percussionRenderAmount") {
                        voiceCount++;
                    }
                }
            }

            return voiceCount >= 2;
        }

        var result = info;
        var count = 3;
        for (var i=0; i<count; i++) {

            info = copyValueDeep(result);

            var op = sampleData(operationRndInfos, rnd);
            var propName = propNames[0];
            while (propName == propNames[0] || info[propName] == 0) {
                propName = propNames[Math.floor(rnd.random() * propNames.length)];
            }
            var otherPropNames = [];
            var totalOthersLeft = 0;

            var otherPropName = propName;
            while (propName == otherPropName) {
                otherPropName = propNames[Math.floor(rnd.random() * propNames.length)];
            }
            for (var j=0; j<propNames.length; j++) {
                var pName = propNames[j];
                if (propName != pName) {
                    otherPropNames.push(pName);
                    totalOthersLeft += 1.0 - info[pName];
                }
            }

            var oldValue = info[propName];

            var maxDistribute = Math.min(totalOthersLeft, oldValue);
//            var toDistribute = maxDistribute;


            function distribute(info, amount, from) {

//                logit("  Distributing " + amount + " from " + from);
                var iterations = 0;
                while (amount > 0.0001 && iterations < 5) {
                    var to = otherPropNames[Math.floor(rnd.random() * otherPropNames.length)];
                    var theAmount = 0;
                    if (amount <= 0.2 || rnd.random() < 0.5) {
                        // Try to distribute all
                        theAmount = Math.min(1.0 - info[to], amount);
                    } else {
                        theAmount = Math.min(1.0 - info[to], amount * rnd.random());
                    }
                    info[to] += theAmount;
                    info[from] -= theAmount;
                    iterations++;
                    amount -= theAmount;
//                    logit("    Moving " + theAmount + " from " + from + " to " + to + " left: " + amount);
                }
            }

            switch (op) {
                case "partialRedistribute":
                    toDistribute = maxDistribute * rnd.random();
                    distribute(info, toDistribute, propName);
                    break;
                case "fullRedistribute":
                    var toDistribute = maxDistribute;
                    distribute(info, toDistribute, propName);
                    break;
            }

            if (infoOk(info)) {
//                logit("   before " + op + ": " + JSON.stringify(result));
                result = info;
//                logit("   After " + op + ": " + JSON.stringify(result));
            } else {
//                logit("info not ok " + JSON.stringify(info));
            }
        }
        return result;
    }




    for (var i=0; i<songStructure.renderAmounts.length; i++) {

        var renderAmount = songStructure.renderAmounts[i];
        var seed = songStructure.renderAmountSeeds[i];

        var rnd = new MersenneTwister(seed);

        var info = {};

        for (var j=0; j<propNames.length; j++) {
            var propName = propNames[j];
            info[propName] = (0.8 + rnd.random() * 0.2) * renderAmount;
        }

//        logit("Info before " + JSON.stringify(info));

        info = perturbRenderAmountInfo(info, rnd);

//        logit("Info after " + JSON.stringify(info));

        genData.renderAmountInfos[i] = info;
    }

}



function createTempoInfos(genData, genInfo, sectionInfos) {

    var rnd = createOrGetRandom(genInfo, "tempoSeed");

    var songStructure = genInfo.songStructureInfo;

    var prevTempo = songStructure.baseTempo;
    for (var i=0; i<songStructure.tempos.length; i++) {
        var tempo = songStructure.tempos[i];
        var prevTempo = tempo;
        if (i > 0) {
            prevTempo = songStructure.tempos[i - 1];
        }
        var nextTempo = tempo;
        if (i < songStructure.tempos.length - 1) {
            nextTempo = songStructure.tempos[i + 1]
        }
        var info = {
            tempo: tempo,
            prevTempo: prevTempo,
            nextTempo: nextTempo
        };
        genData.tempoInfos[i] = info;
    }

//    logit(genData.tempoInfos);
}


function getLinearInterpolationCurveControlElement(id, rndInfos, rnd) {
    var curveInfo = getCustomLinearInterpolationCurveInfo(id + "Curve", rndInfos, rnd);
    var cce = new CurveControlElement();
    cce.id = id;
    cce.curve = curveInfo.curveId;
    cce.amplitude = curveInfo.amplitude;
    cce.bias = curveInfo.bias;
    cce.theCurve = curveInfo.curve;
    return cce;
}

function getCustomCurveControlElement(id, curve) {
    var cce = new CurveControlElement();
    cce.id = id;
    cce.curve = curve.id;
    cce.amplitude = 1;
    cce.bias = 0;
    cce.theCurve = curve;

    return cce;
}


function getEffectInfo(options, rnd) {
    var id = getValueOrDefault(options, "id", "");
    var useStartEndTime = getValueOrDefault(options, "useStartEndTime", false);
    var startTime = getValueOrDefault(options, "startTime", 0.0);
    var startTimeUnit = getValueOrDefault(options, "startTimeUnit", PositionUnit.HARMONY);
    var endTime = getValueOrDefault(options, "endTime", 0.0);
    var endTimeUnit = getValueOrDefault(options, "endTimeUnit", PositionUnit.HARMONY);
    var length = getValueOrDefault(options, "length", 1.0);
    var lengthUnit = getValueOrDefault(options, "lengthUnit", PositionUnit.HARMONY);
    var offset = getValueOrDefault(options, "offset", 0.0);
    var activeExpression = getValueOrDefault(options, "activeExpression", "");
    var phraseGroupIndex = getValueOrDefault(options, "phraseGroupIndex", -1); // -1 means don't use
    var curveData = getValueOrDefault(options, "curveData", {ampRange: [1, 1], biasRange: [0.0, 0.0], xValues: [0, 1], yValues: [0, 1]});
    var curve = getValueOrDefault(options, "curve", null);
    var variables = getValueOrDefault(options, "variables", []);

    var info = {};
    var cce = null;
    if (curve) {
        cce = getCustomCurveControlElement(id, curve);
    } else {
        cce = getLinearInterpolationCurveControlElement(id, [{data: curveData, likelihood: 1}], rnd);
    }
    if (useStartEndTime) {
        cce.startTime = startTime;
        cce.startTimeUnit = startTimeUnit;
        cce.endTime = endTime;
        cce.endTimeUnit = endTimeUnit;
    } else {
        cce.startTime = offset;
        cce.startTimeUnit = lengthUnit;
        cce.endTime = length + offset;
        cce.endTimeUnit = lengthUnit;
    }
    if (activeExpression) {
        cce.activeExpression = activeExpression;
        cce.activeUseExpression = true;
    }
    if (phraseGroupIndex >= 0) {
        var expr = "indexInfoVar.phraseGroupIndex == " + phraseGroupIndex;
        if (cce.activeExpression) {
            expr = "(" + cce.activeExpression + ") && " + expr;
        }
        cce.activeExpression = expr;
        cce.activeUseExpression = true;
    }

    info.element = cce;
    info.curve = cce.theCurve;
    info.variables = variables;

//    logit(JSON.stringify(info));

    return info;
}



function getNoChangeEffectDescription(options) {
    var prefixId = getValueOrDefault(options, "prefixId", "prefix");
    var length = getValueOrDefault(options, "length", 1);
    var lengthUnit = getValueOrDefault(options, "lengthUnit", PositionUnit.MEASURES);
    var value = getValueOrDefault(options, "value", 1.0);

    var constantCurve = new PredefinedCurve().setType(PredefinedCurveType.CONSTANT).setAmplitude(value).setBias(0.0);
    constantCurve.id = prefixId + "NoChangeCurve";
    var constantElement = new CurveControlElement();
    constantElement.endTime = length;
    constantElement.endTimeUnit = lengthUnit;
    constantElement.curve = constantCurve.id;

    return {element: constantElement, curve: constantCurve};
}

var PhraseGroupEffectConstraint = {
    START_HIGH: 0,
    START_MID: 1,
    START_LOW: 2,
    END_HIGH: 3,
    END_MID: 4,
    END_LOW: 5
};

var PhraseGroupEffectType = {
    INC_DEC_FIRST_PHRASE: 0,
    DEC_INC_FIRST_PHRASE: 1,
    INC_DEC_SECOND_PHRASE: 2,
    DEC_INC_SECOND_PHRASE: 3,
    INC_SECOND_PHRASE: 4,
    DEC_SECOND_PHRASE: 5,
    INC_FIRST_PHRASE_STAY: 6,
    DEC_FIRST_PHRASE_STAY: 7,
    INC_FIRST_PHRASE_RETURN: 8,
    DEC_FIRST_PHRASE_RETURN: 9,
    INC_GROUP: 10,
    DEC_GROUP: 11,
    INC_DEC_GROUP: 12,
    DEC_INC_GROUP: 13,

    RANDOM_FIRST_PHRASE: 14,
    RANDOM_SECOND_PHRASE: 15,
    RANDOM_ALL_DIFFERENT: 16,
    RANDOM_ALL_SAME: 17,
    RANDOM_GROUP: 18,

    appendEffectInfos: function(type, options, rnd) {
        var ampFraction = getValueOrDefault(options, "ampFraction", 0.5);
        var xFraction = getValueOrDefault(options, "xFraction", 0.5);
        var infos = getValueOrDefault(options, "infos", []);
        var indices = getValueOrDefault(options, "indices", []);
        var id = getValueOrDefault(options, "id", "theId");
        var constraints1 = getValueOrDefault(options, "constraints1", []);
        var constraints2 = getValueOrDefault(options, "constraints2", []);

        var xValues1 = [0, 1];
        var yValues1 = [1, 1];
        var xValues2 = [0, 1];
        var yValues2 = [1, 1];

        var id1 = id + "1";
        var id2 = id + "2";

        var curveData1 = null;
        var curveData2 = null;

        switch (type) {
            case PhraseGroupEffectType.RANDOM_ALL_SAME:
            case PhraseGroupEffectType.RANDOM_ALL_DIFFERENT:
            case PhraseGroupEffectType.RANDOM_FIRST_PHRASE:
            case PhraseGroupEffectType.RANDOM_GROUP:
            case PhraseGroupEffectType.RANDOM_SECOND_PHRASE:
                var curveRndInfos1 = getRandomCurveInfos({
                    ampRange: [0.3, 0.5], biasRange: [1, 1]
                }, rnd);
                var curveRndInfos2 = getRandomCurveInfos({
                    ampRange: [0.3, 0.5], biasRange: [1, 1]
                }, rnd);
                curveData1 = sampleData(curveRndInfos, rnd);
                switch (type) {
                    case PhraseGroupEffectType.RANDOM_ALL_SAME:
                        curveData2 = curveData1;
                        break;
                    case PhraseGroupEffectType.RANDOM_ALL_DIFFERENT:
                        curveData2 = sampleData(curveRndInfos, rnd);
                        break;
                    case PhraseGroupEffectType.RANDOM_FIRST_PHRASE:
                        // Already done!
                        break;
                    case PhraseGroupEffectType.RANDOM_SECOND_PHRASE:
                        curveData2 = curveData1;
                        curveData1 = null;
                        break;
                    case PhraseGroupEffectType.RANDOM_GROUP:
                        break;
                }

                break;
            case PhraseGroupEffectType.DEC_SECOND_PHRASE:
                yValues2 = [1.0 - ampFraction, 1.0];
                break;
            case PhraseGroupEffectType.INC_SECOND_PHRASE:
                yValues2 = [1.0 + ampFraction, 1.0];
                break;
            case PhraseGroupEffectType.DEC_INC_GROUP:
                yValues1 = [1.0, 1.0 - ampFraction];
                yValues2 = [1.0 - ampFraction, 1.0];
                break;
            case PhraseGroupEffectType.INC_DEC_GROUP:
                yValues1 = [1.0, 1.0 + ampFraction];
                yValues2 = [1.0 + ampFraction, 1.0];
                break;
            case PhraseGroupEffectType.DEC_FIRST_PHRASE_STAY:
                yValues1 = [1.0, 1.0 - ampFraction];
                yValues2 = [1.0 - ampFraction, 1.0 - ampFraction];
                break;
            case PhraseGroupEffectType.INC_FIRST_PHRASE_STAY:
                yValues1 = [1.0, 1.0 + ampFraction];
                yValues2 = [1.0 + ampFraction, 1.0 + ampFraction];
                break;
            case PhraseGroupEffectType.DEC_FIRST_PHRASE_RETURN:
                yValues1 = [1, 1.0 - ampFraction];
                break;
            case PhraseGroupEffectType.INC_FIRST_PHRASE_RETURN:
                yValues1 = [1, 1.0 + ampFraction];
                break;
            case PhraseGroupEffectType.INC_GROUP:
                yValues1 = [1, 1.0 + ampFraction * xFraction];
                yValues2 = [1.0 + ampFraction * xFraction, 1.0 + ampFraction];
                break;
            case PhraseGroupEffectType.DEC_GROUP:
                yValues1 = [1, 1.0 - ampFraction * xFraction];
                yValues2 = [1.0 - ampFraction * xFraction, 1.0 - ampFraction];
                break;
            case PhraseGroupEffectType.INC_DEC_FIRST_PHRASE:
                xValues1 = [0, xFraction, 1];
                yValues1 = [1, 1.0 + ampFraction, 1];
                break;
            case PhraseGroupEffectType.INC_DEC_SECOND_PHRASE:
                xValues2 = [0, xFraction, 1];
                yValues2 = [1, 1.0 + ampFraction, 1];
                break;
            case PhraseGroupEffectType.DEC_INC_FIRST_PHRASE:
                xValues1 = [0, xFraction, 1];
                yValues1 = [1, 1.0 - ampFraction, 1];
                break;
            case PhraseGroupEffectType.DEC_INC_SECOND_PHRASE:
                xValues2 = [0, xFraction, 1];
                yValues2 = [1, 1.0 - ampFraction, 1];
                break;
            default:
                logit("Unknown effect " + type);
                break;
        }
        var nextIndex = infos.length;

        if (!curveData1) {
            curveData1 = {ampRange: [1.0, 1.0], biasRange: [0, 0], xValues: xValues1, yValues: yValues1};
        }
        if (!curveData2) {
            curveData2 = {ampRange: [1.0, 1.0], biasRange: [0, 0], xValues: xValues2, yValues: yValues2};
        }
        addAll(infos,
            [
                getEffectInfo({ // Increase in first group
                    id: id1,
                    curveData: curveData1,
                    activeExpression: "indexInfoVar.phraseGroupCount == 2",
                    phraseGroupIndex: 0
                }, rnd),
                getEffectInfo({ // Decrease in second group
                    id: id2,
                    curveData: curveData2,
                    activeExpression: "indexInfoVar.phraseGroupCount == 2",
                    phraseGroupIndex: 1
                }, rnd)]);
        indices.push(nextIndex);
        indices.push(nextIndex+1);
    },

    toString: function(type) {
        return "toString() for PhraseGroupEffectType not implemented";
    }
}
addPossibleValuesFunction(PhraseGroupEffectType, PhraseGroupEffectType.INC_DEC_FIRST_PHRASE, PhraseGroupEffectType.DEC_INC_GROUP);



function createEffectChangeInfos(genData, genInfo, sectionInfos) {

    var rnd = createOrGetRandom(genInfo, "effectChangeSeed");

    var songStructureInfo = genInfo.songStructureInfo;

    var numerator = 4;
    if (songStructureInfo.numerators && songStructureInfo.numerators.length > 0) {
        numerator = songStructureInfo.numerators[0];
    }


    var datas = [
        {prefix: "melody", instruments: genData.melodyChannelInstruments},
        {prefix: "inner1", instruments: genData.inner1ChannelInstruments},
        {prefix: "inner2", instruments: genData.inner2ChannelInstruments},
        {prefix: "bass", instruments: genData.bassChannelInstruments}
    ];

    var instrumentEffectCapabilitiesArr = [
        [MidiProgram.BOWED_PAD, [InstrumentCapabilityProperty.FILTER_BW_CHANGE,InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE], [0.25, 0.25, 0.25]],
        [MidiProgram.CHOIR_PAD, [InstrumentCapabilityProperty.FILTER_BW_CHANGE,InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE], [0.25, 0.25, 0.25]],
        [MidiProgram.DISTORTION_GUITAR, [InstrumentCapabilityProperty.FILTER_BW_CHANGE,InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE], [0.1, 0.1, 0.0]],
        [MidiProgram.ELECTRIC_CLEAN_GUITAR, [InstrumentCapabilityProperty.FILTER_BW_CHANGE,InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE], [0.1, 0.1, 0.0]],
        [MidiProgram.ELECTRIC_FINGER_BASS, [InstrumentCapabilityProperty.FILTER_BW_CHANGE,InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE], [0.1, 0.1, 0.0]],
        [MidiProgram.ELECTRIC_PIANO_1, [InstrumentCapabilityProperty.FILTER_BW_CHANGE,InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE], [0.1, 0.1, 0.0]],
        [MidiProgram.ELECTRIC_PIANO_2, [InstrumentCapabilityProperty.FILTER_BW_CHANGE,InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE], [0.1, 0.1, 0.0]],
        [MidiProgram.ELECTRIC_PICK_BASS, [InstrumentCapabilityProperty.FILTER_BW_CHANGE,InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE], [0.1, 0.1, 0.0]],
        [MidiProgram.HALO_PAD, [InstrumentCapabilityProperty.FILTER_BW_CHANGE,InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE], [0.35, 0.35, 0.25]],
        [MidiProgram.METALLIC_PAD, [InstrumentCapabilityProperty.FILTER_BW_CHANGE,InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE], [0.35, 0.35, 0.25]],
        [MidiProgram.NEW_AGE_PAD, [InstrumentCapabilityProperty.FILTER_BW_CHANGE,InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE], [0.35, 0.35, 0.25]],
        [MidiProgram.OVERDRIVEN_GUITAR, [InstrumentCapabilityProperty.FILTER_BW_CHANGE,InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE], [0.1, 0.1, 0.0]],
        [MidiProgram.POLYSYNTH_PAD, [InstrumentCapabilityProperty.FILTER_BW_CHANGE,InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE], [0.25, 0.25, 0.25]],
        [MidiProgram.SAW_LEAD, [InstrumentCapabilityProperty.FILTER_BW_CHANGE,InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE], [0.3, 0.3, 0.0]],
        [MidiProgram.SQUARE_LEAD, [InstrumentCapabilityProperty.FILTER_BW_CHANGE,InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE], [0.3, 0.3, 0.0]],
        [MidiProgram.SWEEP_PAD, [InstrumentCapabilityProperty.FILTER_BW_CHANGE,InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE], [0.35, 0.35, 0.25]],
        [MidiProgram.SYNTH_BASS_1, [InstrumentCapabilityProperty.FILTER_BW_CHANGE,InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE], [0.25, 0.25, 0.0]],
        [MidiProgram.SYNTH_BASS_2, [InstrumentCapabilityProperty.FILTER_BW_CHANGE,InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE], [0.25, 0.25, 0.0]],
        [MidiProgram.SYNTH_BRASS_1, [InstrumentCapabilityProperty.FILTER_BW_CHANGE,InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE], [0.25, 0.25, 0.0]],
        [MidiProgram.SYNTH_BRASS_2, [InstrumentCapabilityProperty.FILTER_BW_CHANGE,InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE], [0.25, 0.25, 0.0]],
        [MidiProgram.SYNTH_CHOIR, [InstrumentCapabilityProperty.FILTER_BW_CHANGE,InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE], [0.15, 0.15, 0.0]],
        [MidiProgram.SYNTH_STRINGS_1, [InstrumentCapabilityProperty.FILTER_BW_CHANGE,InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE], [0.15, 0.15, 0.25]],
        [MidiProgram.SYNTH_STRINGS_2, [InstrumentCapabilityProperty.FILTER_BW_CHANGE,InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE], [0.15, 0.15, 0.25]],
        [MidiProgram.WARM_PAD, [InstrumentCapabilityProperty.FILTER_BW_CHANGE,InstrumentCapabilityProperty.FILTER_FREQ_CHANGE, InstrumentCapabilityProperty.PAN_CHANGE], [0.35, 0.35, 0.25]]
    ];

    for (var i=0; i<instrumentEffectCapabilitiesArr.length; i++) {
        var arr = instrumentEffectCapabilitiesArr[i];
        var caps = arr[1];
        var probs = arr[2];
        for (var j=0; j<caps.length; j++) {
            var cap = caps[j];
            var prob = probs[j % probs.length];
            switch (cap) {
                case InstrumentCapabilityProperty.FILTER_BW_CHANGE:
                    prob *= genInfo.filterBWEffectsProbMultiplier;
                    break;
                case InstrumentCapabilityProperty.FILTER_FREQ_CHANGE:
                    prob *= genInfo.filterFEffectsProbMultiplier;
                    break;
                case InstrumentCapabilityProperty.PAN_CHANGE:
                    prob *= genInfo.panEffectsProbMultiplier;
                    break;
            }
            probs[j % probs.length] = prob;
        }
    }

    var instrumentEffectCapabilities = {};
    for (var i=0; i<instrumentEffectCapabilitiesArr.length; i++) {
        var arr = instrumentEffectCapabilitiesArr[i];
        instrumentEffectCapabilities[arr[0]] = arr[1];
    }
    var instrumentEffectProbs = {};
    for (var i=0; i<instrumentEffectCapabilitiesArr.length; i++) {
        var arr = instrumentEffectCapabilitiesArr[i];
        instrumentEffectProbs[arr[0]] = arr[2];
    }


    function addSequentialEffects(options, rnd) {
        var instruments = getValueOrDefault(options, "instruments", []);
        var prefix = getValueOrDefault(options, "prefix", "melody");
        var effect = getValueOrDefault(options, "effect", "FilterF");
        var infos = getValueOrDefault(options, "infos", []);


        if (instruments.length == 0 && prefix == "percussion") {
            // Special case
        }

        var minValue = 0.0;
        var maxValue = 1.0;

        var noChangeValue = 1.0;

        var valueNotReturnLikMult = 1.0;
        var beatLengthLikMult = 1.0;
        var measureLengthLikMult = 1.0;
        var harmonyLengthLikMult = 1.0;

        switch (effect) {
            case "FilterF":
                valueNotReturnLikMult = 0.5;
                beatLengthLikMult = 0.1;
                measureLengthLikMult = 0.2;
                switch (prefix) {
                    case "melody":
                        maxValue = 100 / 127.0;
                        minValue = 55 / 127.0;
                        break;
                    case "inner1":
                        maxValue = 65 / 127.0;
                        minValue = 30 / 127.0;
                        break;
                    case "inner2":
                        maxValue = 65 / 127.0;
                        minValue = 30 / 127.0;
                        break;
                    case "bass":
                        maxValue = 45 / 127.0;
                        minValue = 10 / 127.0;
                        break;
                    default:
                        maxValue = 80 / 127.0;
                        minValue = 20 / 127.0;
                        break;
                }
                break;
            case "FilterQ":
                valueNotReturnLikMult = 0.1;
                beatLengthLikMult = 0.1;
                measureLengthLikMult = 0.2;
                var minMinQ = 0.4;
                var minAddQ = 0.15;
                var minMaxQ = 0.65;
                var maxAddQ = 0.15;
                switch (prefix) {
                    case "melody":
                        minMinQ = 0.4;
                        minMaxQ = 0.65;
                        break;
                }
                maxValue = minMaxQ + rnd.random() * maxAddQ;
                minValue = minMinQ + rnd.random() * minAddQ;
                break;
            case "Pan":
                var melodyPan = 20;
                var bassPan = 110;
                var inner1Pan = 80;
                var inner2Pan = 60;
                var percussionPan = 64;

                valueNotReturnLikMult = 0.0000001;
                beatLengthLikMult = 0.0000001;
                measureLengthLikMult = 0.0001;

                var symmetric = rnd.random() < 0.8;

                var offset1 = rnd.random() * 0.3;
                var offset2 = rnd.random() * 0.3;
                if (symmetric) {
                    offset2 = offset1;
                }
                minValue = 0.05 + offset1;
                maxValue = 0.95 - offset2;

                switch (prefix) {
                    case "melody":
                        noChangeValue = melodyPan / 127.0;
                        break;
                    case "inner1":
                        noChangeValue = inner1Pan / 127.0;
                        break;
                    case "inner2":
                        noChangeValue = inner2Pan / 127.0;
                        break;
                    case "bass":
                        noChangeValue = bassPan / 127.0;
                        break;
                    case "percussion":
                        noChangeValue = percussionPan / 127.0;
                        break;
                }

                break;
        }

        var xyValuesRndInfos = [
            {data: {xValues: [0, 0.5, 1], yValues: [minValue, maxValue, minValue]}, likelihood: 1},
            {data: {xValues: [0, 0.5, 1], yValues: [maxValue, minValue, maxValue]}, likelihood: 1},
            {data: {xValues: [0, 0.33, 0.67, 1], yValues: [minValue, maxValue, maxValue, minValue]}, likelihood: 1},
            {data: {xValues: [0, 0.33, 0.67, 1], yValues: [maxValue, minValue, minValue, maxValue]}, likelihood: 1},
            {data: {xValues: [0, 0.33, 0.67, 1], yValues: [minValue, maxValue, minValue, maxValue]}, likelihood: valueNotReturnLikMult},
            {data: {xValues: [0, 0.33, 0.67, 1], yValues: [maxValue, minValue, maxValue, minValue]}, likelihood: valueNotReturnLikMult},
            {data: {xValues: [0, 1], yValues: [minValue, maxValue]}, likelihood: valueNotReturnLikMult},
            {data: {xValues: [0, 1], yValues: [maxValue, minValue]}, likelihood: valueNotReturnLikMult}
        ];
        var lengthLengthUnitRndInfos = [
            {data: {length: 0.5, lengthUnit: PositionUnit.HARMONY}, likelihood: harmonyLengthLikMult},
            {data: {length: 1, lengthUnit: PositionUnit.HARMONY}, likelihood: harmonyLengthLikMult},
            {data: {length: 1, lengthUnit: PositionUnit.BEATS}, likelihood: beatLengthLikMult},
            {data: {length: 2, lengthUnit: PositionUnit.BEATS}, likelihood: beatLengthLikMult * (numerator == 3 ? 0.1 : 1)},
            {data: {length: 3, lengthUnit: PositionUnit.BEATS}, likelihood: beatLengthLikMult * (numerator == 3 ? 1 : 0.1)},
            {data: {length: 1, lengthUnit: PositionUnit.MEASURES}, likelihood: measureLengthLikMult}
//            {data: {length: 2, lengthUnit: PositionUnit.MEASURES}, likelihood: 1}
        ];


        for (var i=0; i<instruments.length; i++) {
            var instr = instruments[i];
            // Index 0 is always no change
            var caps = instrumentEffectCapabilities[instr];
            var probs = instrumentEffectProbs[instr];

//            if (caps) {
//                logit(MidiProgram.toString(instr) + " caps " + caps + " probs " + probs);
//            }

            if (!caps) {
                caps = [];
                probs = [0.0, 0.0]
            }

            var arr = [];
            infos[i][effect] = arr;

//            logit("Adding effects for " + prefix + " " + i + " " + effect);
            arr.push(getNoChangeEffectDescription({prefixId: prefix + effect + "SequentialEffect" + i, value: noChangeValue}));

            var infoCount = 3;

            switch (effect) {
                case "Pan":
                    var capIndex = caps.indexOf(InstrumentCapabilityProperty.PAN_CHANGE);
                    if (capIndex >= 0) {
                        var slidePan = rnd.random() < probs[capIndex];
                        if (slidePan) {
//                            logit("pan change " + prefix + " i: " + i);
                            for (var j=0; j<infoCount; j++) {
                                var xyValues = sampleData(xyValuesRndInfos, rnd);
                                var lengthLengthUnit = sampleData(lengthLengthUnitRndInfos, rnd);
                                arr.push(getEffectInfo(
                                    {
                                        id: prefix + effect + "SequentialEffectAdd" + i,
                                        length: lengthLengthUnit.length,
                                        lengthUnit: lengthLengthUnit.lengthUnit,
                                        activeExpression: prefix + "RenderAmountVar > 0",
                                        curveData: {ampRange: [1.0, 1.0], biasRange: [0.0, 0.0], xValues: xyValues.xValues, yValues: xyValues.yValues}
                                    },
                                    rnd));
                            }
                        }
                    }

                    break;
                case "FilterF":
                    var capIndex = caps.indexOf(InstrumentCapabilityProperty.FILTER_FREQ_CHANGE);
                    if (capIndex >= 0) {
                        var slideF = rnd.random() < probs[capIndex];
                        if (slideF) {
                            for (var j=0; j<infoCount; j++) {
                                var xyValues = sampleData(xyValuesRndInfos, rnd);
                                var lengthLengthUnit = sampleData(lengthLengthUnitRndInfos, rnd);
                                arr.push(getEffectInfo(
                                    {
                                        id: prefix + effect + "SequentialEffectAdd" + i,
                                        length: lengthLengthUnit.length,
                                        lengthUnit: lengthLengthUnit.lengthUnit,
                                        activeExpression: prefix + "RenderAmountVar > 0",
                                        curveData: {ampRange: [1.0, 1.0], biasRange: [0.0, 0.0], xValues: xyValues.xValues, yValues: xyValues.yValues}
                                    },
                                    rnd));
                            }
                        }
                    }
                    break;
                case "FilterQ":
                    var capIndex = caps.indexOf(InstrumentCapabilityProperty.FILTER_BW_CHANGE);
                    if (capIndex >= 0) {
                        var slideQ = rnd.random() < probs[capIndex];
                        for (var j=0; j<infoCount; j++) {
                            var xyValues = sampleData(xyValuesRndInfos, rnd);
                            var lengthLengthUnit = sampleData(lengthLengthUnitRndInfos, rnd);
                            if (slideQ) {
                                arr.push(getEffectInfo(
                                    {
                                        id: prefix + effect + "SequentialEffectAdd" + i,
                                        length: lengthLengthUnit.length,
                                        activeExpression: prefix + "RenderAmountVar > 0",
                                        lengthUnit: lengthLengthUnit.lengthUnit,
                                        curveData: {ampRange: [1.0, 1.0], biasRange: [0.0, 0.0], xValues: xyValues.xValues, yValues: xyValues.yValues}
                                    },
                                    rnd));
                            } else {
                                var qLevel = rnd.random() * (maxValue - minValue) + minValue;
                                arr.push(getEffectInfo(
                                    {
                                        id: prefix + effect + "SequentialEffectAdd" + i,
                                        length: 1,
                                        activeExpression: prefix + "RenderAmountVar > 0",
                                        lengthUnit: PositionUnit.MEASURES,
                                        curveData: {ampRange: [1.0, 1.0], biasRange: [0.0, 0.0], xValues: [0, 1], yValues: [qLevel, qLevel]}
                                    },
                                    rnd));
                            }
                        }
                    }
                    break;
            }
        }


    }

    var effects = ["FilterF", "FilterQ", "Pan"];

    for (var i=0; i<datas.length; i++) {
        var prefix = datas[i].prefix;
        var capName = prefix.substr(0, 1).toUpperCase() + prefix.substr(1);
        var propName = "sequential" + capName + "EffectChangeInfos";
        var propName2 = "sequential" + capName + "EffectChangePatternInfos";
        genData[propName] = [];
        genData[propName2] = [];
        var data = datas[i];
        data.infos = genData[propName];
        for (var j=0; j<effects.length; j++) {
            for (var k=0; k<data.instruments.length; k++) {
                genData[propName].push({}); // Make sure that we have an object for each channel
            }
            data.effect = effects[j];

            addSequentialEffects(data, rnd);
        }
//        if (prefix == "bass") {
//            logit("Effect infos " + genData[propName].length + " " + prefix);
//        }
        var patternInfos = genData[propName2];
        var patternCount = genInfo.effectChangeCount;

        var indicesRndInfos = [
            {data: [1], likelihood: 5},
            {data: [1, 2], likelihood: 8},
            {data: [1, 1, 2], likelihood: 2},
            {data: [1, 2, 2], likelihood: 2},
            {data: [1, 2, 3], likelihood: 2},
            {data: [1, 1, 1, 2], likelihood: 1},
            {data: [1, 1, 2, 1], likelihood: 1},
            {data: [1, 1, 2, 2], likelihood: 1},
            {data: [1, 2, 1, 1], likelihood: 1},
            {data: [1, 2, 1, 2], likelihood: 1}
        ];

        for (var k=0; k<patternCount; k++) {
            var patternInfo = {};
            for (var j=0; j<effects.length; j++) {
                var effect = effects[j];
                var indices = sampleData(indicesRndInfos, rnd);

                var addEndIndices = rnd.random() < 0.5;

                var endIndices = [];
                if (addEndIndices) {
                    endIndices = [1 + Math.floor(3 * rnd.random())];
                }
//                var startIndices = [1 + Math.floor(2 * rnd.random())];
                patternInfo[effect] = {
                    indices: indices,
                    startIndices: [],
                    endIndices: endIndices
                };
            }
            patternInfos[k] = patternInfo;
        }

    }


}





function createTempoChangeInfos(genData, genInfo, sectionInfos) {

    var rnd = createOrGetRandom(genInfo, "tempoChangeSeed");

    var slowDownAtSongEnd = rnd.random() < genInfo.endSongTempoChangeProbability;
    var adaptToRenderAmount = true;

    var songStructureInfo = genInfo.songStructureInfo;

    var numerator = 4;
    if (songStructureInfo.numerators && songStructureInfo.numerators.length > 0) {
        numerator = songStructureInfo.numerators[0];
    }

    genData.sequentialTempoChangeInfos = [getNoChangeEffectDescription({prefixId: "sequentialTempo"})];

    var sequentialInfoPatternCount = genInfo.tempoChangeCount;
    for (var i=0; i<sequentialInfoPatternCount; i++) {
        var info = {};
        info.indices = [0];
        info.startIndices = [];
        info.endIndices = [];
        genData.sequentialTempoChangePatternInfos.push(info);
    }

//    var adaptVariable = new ExpressionEditorVariable();

    var adaptCurve = new ExpressionCurve();
    adaptCurve.id = "tempoRenderAmountAdaptCurve";
    adaptCurve.valueExpression = "1.0";

    genData.parallelTempoChangeInfos = [
        getEffectInfo({ // Group end
            id: "tempoGroupEnd",
            lengthUnit: PositionUnit.HARMONY,
            length: 0.5,
            offset: 0.5,
            curveData: {ampRange: [-0.3, -0.3], biasRange: [1.0, 1.0], xValues: [0, 1], yValues: [0, 1]},
            activeExpression: "indexInfoVar.phraseGroupIndex == indexInfoVar.phraseGroupCount - 1 && !indexInfoVar.isConnectGroup && !indexInfoVar.isIntro && !indexInfoVar.isEnd"
        }, rnd),
        getEffectInfo({ // Song end
            id: "tempoSongEnd",
            useStartEndTime: true,
            startTimeUnit: PositionUnit.BEATS_PLUS_HARMONY,
            startTime: -numerator,
            endTimeUnit: PositionUnit.BEATS_PLUS_HARMONY,
            endTime: 0,
            curveData: {ampRange: [-0.4, -0.4], biasRange: [1.0, 1.0], xValues: [0, 1], yValues: [0, 1]},
            activeExpression: "indexInfoVar.phraseGroupIndex == indexInfoVar.phraseGroupCount - 1 && indexInfoVar.songGroupIndex == indexInfoVar.songGroupCount - 1"
        }, rnd),
        getEffectInfo({ // Adapt to render amount
            id: "tempoAdaptRenderAmount",
            lengthUnit: PositionUnit.HARMONY,
            length: 1.0,
            curve: adaptCurve,
            activeExpression: "true"
        }, rnd)
    ];

    var slowDownAtGroupEndIndex = 0;
    var slowDownAtSongEndIndex = 1;
    var renderAmountAdaptIndex = 2;


    var tempoEffectTypeRndInfos = [
        {data: PhraseGroupEffectType.INC_FIRST_PHRASE_STAY, likelihood: 1},
        {data: PhraseGroupEffectType.DEC_FIRST_PHRASE_STAY, likelihood: 1},
        {data: PhraseGroupEffectType.DEC_SECOND_PHRASE, likelihood: 1},
        {data: PhraseGroupEffectType.INC_SECOND_PHRASE, likelihood: 1}
    ];

    var parallelInfoPatternCount = genInfo.tempoChangeCount;
    for (var i=0; i<parallelInfoPatternCount; i++) {
        var info = {};
        info.indices = [];
        var slowDownAtGroupEnd = rnd.random() < genInfo.endPhraseGroupTempoChangeProbabilities[i % genInfo.endPhraseGroupTempoChangeProbabilities.length];

        if (slowDownAtGroupEnd) {
//            logit("slowing down at group end " + i);
            info.indices.push(slowDownAtGroupEndIndex);
        }
        if (slowDownAtSongEnd) {
            info.indices.push(slowDownAtSongEndIndex);
        }
        if (adaptToRenderAmount) {
            info.indices.push(renderAmountAdaptIndex);
        }
//        var addTempoEffect = false; // rnd.random() < 0.1;
//
//        if (addTempoEffect) {
//
//            var effect = sampleData(tempoEffectTypeRndInfos, rnd);
//
////            logit("Adding tempo effect " + effect);
//            var ampFraction = 0.05 + rnd.random() * 0.05;
//            var xFraction = 0.2 + 0.6 * rnd.random();
//            PhraseGroupEffectType.appendEffectInfos(effect, {
//                id: "tempoEffect" + info.indices.length + "_",
//                indices: info.indices,
//                infos: genData.parallelTempoChangeInfos,
//                ampFraction: ampFraction,
//                xFraction: xFraction
//            }, rnd);
//        }
        genData.parallelTempoChangePatternInfos.push(info);

    }

//    logit("parallel pattern infos: " + JSON.stringify(genData.parallelTempoChangePatternInfos));
//    logit("parallel info: " + JSON.stringify(genData.parallelTempoChangeInfos));

//    var indexInfo = {
//        phraseGroupIndex: j,
//        phraseGroupCount: count,
//        songGroupIndex: i,
//        songGroupCount: phraseGroupInfo.groupTypes.length,
//        isConnectGroup: isConnectGroup,
//        notConnectGroupIndex: notConnectGroupIndex,
//        notConnectGroupCount: notConnectGroupCount,
//        isIntro: isIntro,
//        isEnd: isEnd
//    };


}



function createPhraseInfos(genData, genInfo, sectionInfos) {

    var songStructureInfo = genInfo.songStructureInfo;

    if (songStructureInfo.phraseTypes && songStructureInfo.phraseTypes.length > 0) {
        for (var i=0; i<songStructureInfo.phraseTypes.length; i++) {
            var info = {};
            info.phraseType = songStructureInfo.phraseTypes[i];
            info.minorModulationTarget = songStructureInfo.minorModulationTargets[i];
            info.majorModulationTarget = songStructureInfo.majorModulationTargets[i];
            genData.phraseInfos[i] = info;
        }
    } else {
        logit("Must provide phrase types in song structure info");
    }
}


function createHarmonyExtraInfos(genData, genInfo, sectionInfos) {
    var rnd = createOrGetRandom(genInfo, "harmonySeed");

    var songStructure = genInfo.songStructureInfo;


    var count = genInfo.harmonyExtraCount;
    var majorDeceptiveRoots = sampleNData(genInfo.majorDeceptiveRootRndInfos, Math.max(count, 16), rnd);
    var minorDeceptiveRoots = sampleNData(genInfo.minorDeceptiveRootRndInfos, Math.max(count, 16), rnd);
    for (var i=0; i<count; i++) {
        var info = {};
        info.harmonySeed = rnd.genrand_int31();
        info.raiseLeadingTone = rnd.random() < genInfo.raiseLeadingInMinorProbabilities[i % genInfo.raiseLeadingInMinorProbabilities.length];
        info.simpleMixtureLikelihood = genInfo.simpleMixtureLikelihoods[i % genInfo.simpleMixtureLikelihoods.length];
        info.sus2ChordsLikelihood = genInfo.sus2ChordsLikelihoods[i % genInfo.sus2ChordsLikelihoods.length];
        info.sus4ChordsLikelihood = genInfo.sus4ChordsLikelihoods[i % genInfo.sus4ChordsLikelihoods.length];
        info.neighbourChordsLikelihood = genInfo.neighbourChordsLikelihoods[i % genInfo.neighbourChordsLikelihoods.length];
        info.passingChordsLikelihood = genInfo.passingChordsLikelihoods[i % genInfo.passingChordsLikelihoods.length];
        info.majorDeceptiveRoot = majorDeceptiveRoots[i];
        info.minorDeceptiveRoot = minorDeceptiveRoots[i];

        // Add likelihoods for the harmony progression here....
        genData.harmonyExtraInfos[i] = info;
//        logit(info.majorDeceptiveRoot + " " + info.minorDeceptiveRoot);
    }
}

function createHarmonyInfos(genData, genInfo, sectionInfos) {

    var rnd = createOrGetRandom(genInfo, "harmonySeed");

    var songStructure = genInfo.songStructureInfo;

    if (songStructure.scaleTypes && songStructure.scaleTypes.length > 0) {
        for (var i=0; i<songStructure.scaleTypes.length; i++) {
            var info = {};
            info.scaleType = songStructure.scaleTypes[i];
            info.scaleBaseNote = songStructure.scaleBaseNotes[i];
            info.numerator = songStructure.numerators[i];
            info.harmonyElementIndex = songStructure.harmonyElementIndices[i];
            genData.harmonyInfos[i] = info;
//             logit(info);
        }
    } else {
        logit("Must provide scaletypes in song structure");
    }
}


function createModuleGeneratorData(genInfo, sectionInfos) {
    var genData = new SimpleModuleGeneratorData();

    createIndexInfos(genData, genInfo, sectionInfos);

    createMotifInfos(genData, genInfo, sectionInfos);

    createSuspendInfos(genData, genInfo, sectionInfos);

    createHarmonyRythmInfos(genData, genInfo, sectionInfos);

    createMelodyShapeInfos(genData, genInfo, sectionInfos);

    createChannelDistributionInfos(genData, genInfo, sectionInfos);

    createChannelInstruments(genData, genInfo, sectionInfos);

    createMotifDistributionInfos(genData, genInfo, sectionInfos);

    createPhraseInfos(genData, genInfo, sectionInfos);

    createHarmonyInfos(genData, genInfo, sectionInfos);

    createHarmonyExtraInfos(genData, genInfo, sectionInfos);

    createRenderAmountInfos(genData, genInfo, sectionInfos);

    createTempoInfos(genData, genInfo, sectionInfos);

    createTempoChangeInfos(genData, genInfo, sectionInfos);

    createEffectChangeInfos(genData, genInfo, sectionInfos);

    return genData;
}


function SimpleModuleGeneratorData() {

    this.baseTempo = 120;

    this.indexInfos = [];

    this.tempoInfos = []; // Absolute tempos

//    this.globalTempoChangeInfos = [];
    this.sequentialTempoChangeInfos = []; // Is indexed by tempoChangePatternInfos
    this.sequentialTempoChangePatternInfos = []; // Is indexed by a property
    this.parallelTempoChangeInfos = []; // Is indexed by tempoChangePatternInfos
    this.parallelTempoChangePatternInfos = []; // Is indexed by a property

    this.sequentialMelodyEffectChangeInfos = []; // Is indexed by tempoChangePatternInfos
    this.sequentialMelodyEffectChangePatternInfos = []; // Is indexed by a property
    this.sequentialInner1EffectChangeInfos = []; // Is indexed by tempoChangePatternInfos
    this.sequentialInner1EffectChangePatternInfos = []; // Is indexed by a property
    this.sequentialInner2EffectChangeInfos = []; // Is indexed by tempoChangePatternInfos
    this.sequentialInner2EffectChangePatternInfos = []; // Is indexed by a property
    this.sequentialBassEffectChangeInfos = []; // Is indexed by tempoChangePatternInfos
    this.sequentialBassEffectChangePatternInfos = []; // Is indexed by a property
    this.sequentialPercussionEffectChangeInfos = []; // Is indexed by tempoChangePatternInfos
    this.sequentialPercussionEffectChangePatternInfos = []; // Is indexed by a property


    this.renderAmountInfos = [];

    this.suspendInfos = [];

    this.harmonyExtraInfos = [];

    this.harmonyInfos = [];

    this.phraseInfos = [];

    this.harmonyRythmInfos = [];

    this.melodyShapeInfos = [];

    this.bassShapeInfos = [];

    this.melodyChannelInstruments = [];
    this.inner1ChannelInstruments = [];
    this.inner2ChannelInstruments = [];
    this.bassChannelInstruments = [];

    this.percussionMotifInfos = [];

    this.fillStartIndex = 2;

    this.percussionMotifDistributionInfos = [];
    this.percussionFillMotifDistributionInfos = [];

    this.motifInfos = [];

    this.bassStartIndex = 4;
    this.harmonyStartIndex = 8;

    this.melodyChannelDistributionInfos = [];
    this.inner1ChannelDistributionInfos = [];
    this.inner2ChannelDistributionInfos = [];
    this.bassChannelDistributionInfos = [];

    this.melodyMotifDistributionInfos = [];
    this.inner1MotifDistributionInfos = [];
    this.inner2MotifDistributionInfos = [];
    this.bassMotifDistributionInfos = [];
}


function SimpleModuleGeneratorSectionInfo(options) {

    this.index = getValueOrDefault(options, "index", 0);

    // Type of harmony rythm
    this.harmonyRythmIndex = getValueOrDefault(options, "harmonyRythmIndex", 0);

    // Type of harmony
    this.harmonyIndex = getValueOrDefault(options, "harmonyIndex", 0);

    this.harmonyExtraIndex = getValueOrDefault(options, "harmonyExtraIndex", 0);

    // Type of phrase
    this.phraseIndex = getValueOrDefault(options, "phraseIndex", 0);

    // Render amount
    this.renderAmountIndex = getValueOrDefault(options, "renderAmountIndex", 0);

    // Type of suspension
    this.suspendIndex = getValueOrDefault(options, "suspendIndex", 0);

    // Channel distributions
    this.melodyChannelDistributionIndex = getValueOrDefault(options, "melodyChannelDistributionIndex", 0);
    this.inner1ChannelDistributionIndex = getValueOrDefault(options, "inner1ChannelDistributionIndex", 0);
    this.inner2ChannelDistributionIndex = getValueOrDefault(options, "inner2ChannelDistributionIndex", 0);
    this.bassChannelDistributionIndex = getValueOrDefault(options, "bassChannelDistributionIndex", 0);

    // Type indices for melody
    this.melodyShapeIndex = getValueOrDefault(options, "melodyShapeIndex", 0); // A curve or something that describes the melody voice line
    this.melodyMotifDistributionIndex = getValueOrDefault(options, "melodyMotifDistributionIndex", 0); // How motifs are distributed
    this.melodyMotifsIndex = 0; // The actual set of motifs
//    this.melodyOrnamentationTypeIndex = 0; // Ornamentation (grace notes etc.)
//    this.melodyHarmonizationTypeIndex = 0; // Harmonization (adding fillers)

    // Type indices for inner voice 1
    this.inner1MotifDistributionIndex = getValueOrDefault(options, "inner1MotifDistributionIndex", 0); // How motifs are distributed
    this.inner1MotifsIndex = 0; // The actual set of motifs

    // Type indices for inner voice 2
    this.inner2MotifDistributionIndex = getValueOrDefault(options, "inner2MotifDistributionIndex", 0); // How motifs are distributed
    this.inner2MotifsIndex = 0; // The actual set of motifs

    // Type indices for bass
    this.bassShapeIndex = getValueOrDefault(options, "bassShapeIndex", 0);
    this.bassMotifDistributionIndex = getValueOrDefault(options, "bassMotifDistributionIndex", 0); // How motifs are distributed
    this.bassMotifsIndex = 0; // The actual set of motifs

    // Type indices for percussion
    this.percussionMotifDistributionIndex = getValueOrDefault(options, "percussionMotifDistributionIndex", 0); // How motifs are distributed
    this.percussionFillMotifDistributionIndex = getValueOrDefault(options, "percussionFillMotifDistributionIndex", 0); // How motifs are distributed
    this.percussionMotifsIndex = 0; // The actual set of motifs (including fills)

    // Tempo
    this.tempoIndex = getValueOrDefault(options, "tempoIndex", 0); // How tempos are modified per section based on the base tempo

    // Effect change
    this.sequentialMelodyEffectChangeIndex = getValueOrDefault(options, "sequentialMelodyEffectChangeIndex", 0);
    this.sequentialInner1EffectChangeIndex = getValueOrDefault(options, "sequentialInner1EffectChangeIndex", 0);
    this.sequentialInner2EffectChangeIndex = getValueOrDefault(options, "sequentialInner2EffectChangeIndex", 0);
    this.sequentialBassEffectChangeIndex = getValueOrDefault(options, "sequentialBassEffectChangeIndex", 0);
    this.sequentialPercussionEffectChangeIndex = getValueOrDefault(options, "sequentialPercussionEffectChangeIndex", 0);

    // Tempo change
    this.sequentialTempoChangeIndex = getValueOrDefault(options, "sequentialTempoChangeIndex", 0); // How tempos are modified on small scales
    this.parallelTempoChangeIndex = getValueOrDefault(options, "parallelTempoChangeIndex", 0); // How tempos are modified on small scales

    this.modifierFunctions = getValueOrDefault(options, "modifierFunctions", []); // Functions that can modify stuff in getSetVariableModifiers()
    this.preModifierFunctions = getValueOrDefault(options, "preModifierFunctions", []); // Functions that can modify stuff in getSetVariableModifiers()
}

SimpleModuleGeneratorSectionInfo.prototype.getSetVariableModifiers = function(data) {

    var melodyShapeInfo = data.melodyShapeInfos[this.melodyShapeIndex % data.melodyShapeInfos.length];
//    logit("Mel shape index " + this.melodyShapeIndex + " " + JSON.stringify(melodyShapeInfo));
    var bassShapeInfo = data.bassShapeInfos[this.bassShapeIndex % data.bassShapeInfos.length];
    var phraseInfo = data.phraseInfos[this.phraseIndex % data.phraseInfos.length];
    var harmonyInfo = data.harmonyInfos[this.harmonyIndex % data.harmonyInfos.length];
    var harmonyExtraInfo = data.harmonyExtraInfos[this.harmonyExtraIndex % data.harmonyExtraInfos.length];
    var harmonyRythmInfo = data.harmonyRythmInfos[this.harmonyRythmIndex % data.harmonyRythmInfos.length];
    var melodyMotifDistributionInfo = data.melodyMotifDistributionInfos[this.melodyMotifDistributionIndex % data.melodyMotifDistributionInfos.length];
    var bassMotifDistributionInfo = data.bassMotifDistributionInfos[this.bassMotifDistributionIndex % data.bassMotifDistributionInfos.length];
    var inner1MotifDistributionInfo = data.inner1MotifDistributionInfos[this.inner1MotifDistributionIndex % data.inner1MotifDistributionInfos.length];
    var inner2MotifDistributionInfo = data.inner2MotifDistributionInfos[this.inner2MotifDistributionIndex % data.inner2MotifDistributionInfos.length];
    var percussionMotifDistributionInfo = data.percussionMotifDistributionInfos[this.percussionMotifDistributionIndex % data.percussionMotifDistributionInfos.length];
    var percussionFillMotifDistributionInfo = data.percussionFillMotifDistributionInfos[this.percussionFillMotifDistributionIndex % data.percussionFillMotifDistributionInfos.length];
    var melodyChannelDistributionInfo = data.melodyChannelDistributionInfos[this.melodyChannelDistributionIndex % data.melodyChannelDistributionInfos.length];
    var bassChannelDistributionInfo = data.bassChannelDistributionInfos[this.bassChannelDistributionIndex % data.bassChannelDistributionInfos.length];
    var inner1ChannelDistributionInfo = data.inner1ChannelDistributionInfos[this.inner1ChannelDistributionIndex % data.inner1ChannelDistributionInfos.length];
    var inner2ChannelDistributionInfo = data.inner2ChannelDistributionInfos[this.inner2ChannelDistributionIndex % data.inner2ChannelDistributionInfos.length];
    var suspendInfo = data.suspendInfos[this.suspendIndex % data.suspendInfos.length];
    var renderAmountInfo = data.renderAmountInfos[this.renderAmountIndex % data.renderAmountInfos.length];
    var tempoInfo = data.tempoInfos[this.tempoIndex % data.tempoInfos.length];
    var sequentialMelodyEffectChangeInfo = data.sequentialMelodyEffectChangePatternInfos[this.sequentialMelodyEffectChangeIndex % data.sequentialMelodyEffectChangePatternInfos.length];
    var sequentialInner1EffectChangeInfo = data.sequentialInner1EffectChangePatternInfos[this.sequentialInner1EffectChangeIndex % data.sequentialInner1EffectChangePatternInfos.length];
    var sequentialInner2EffectChangeInfo = data.sequentialInner2EffectChangePatternInfos[this.sequentialInner2EffectChangeIndex % data.sequentialInner2EffectChangePatternInfos.length];
    var sequentialBassEffectChangeInfo = data.sequentialBassEffectChangePatternInfos[this.sequentialBassEffectChangeIndex % data.sequentialBassEffectChangePatternInfos.length];
    var sequentialPercussionEffectChangeInfo = data.sequentialPercussionEffectChangePatternInfos[this.sequentialPercussionEffectChangeIndex % data.sequentialPercussionEffectChangePatternInfos.length];
    var sequentialTempoChangeInfo = data.sequentialTempoChangePatternInfos[this.sequentialTempoChangeIndex % data.sequentialTempoChangePatternInfos.length];
    var parallelTempoChangeInfo = data.parallelTempoChangePatternInfos[this.parallelTempoChangeIndex % data.parallelTempoChangePatternInfos.length];

    var indexInfo = data.indexInfos[this.index % data.indexInfos.length];

//    logit(this.harmonyIndex);

    for (var i=0; i<this.preModifierFunctions.length; i++) {
        this.preModifierFunctions[i](
            {
                melodyShapeInfo: melodyShapeInfo,
                bassShapeInfo: bassShapeInfo,
                phraseInfo: phraseInfo,
                harmonyInfo: harmonyInfo,
                harmonyExtraInfo: harmonyExtraInfo,
                harmonyRythmInfo: harmonyRythmInfo,
                melodyMotifDistributionInfo: melodyMotifDistributionInfo,
                inner1MotifDistributionInfo: inner1MotifDistributionInfo,
                inner2MotifDistributionInfo: inner2MotifDistributionInfo,
                bassMotifDistributionInfo: bassMotifDistributionInfo,
                percussionMotifDistributionInfo: percussionMotifDistributionInfo,
                percussionFillMotifDistributionInfo: percussionFillMotifDistributionInfo,
                melodyChannelDistributionInfo: melodyChannelDistributionInfo,
                inner1ChannelDistributionInfo: inner1ChannelDistributionInfo,
                inner2ChannelDistributionInfo: inner2ChannelDistributionInfo,
                bassChannelDistributionInfo: bassChannelDistributionInfo,
                suspendInfo: suspendInfo,
                renderAmountInfo: renderAmountInfo,
                tempoInfo: tempoInfo,
                sequentialMelodyEffectChangeInfo: sequentialMelodyEffectChangeInfo,
                sequentialInner1EffectChangeInfo: sequentialInner1EffectChangeInfo,
                sequentialInner2EffectChangeInfo: sequentialInner2EffectChangeInfo,
                sequentialBassEffectChangeInfo: sequentialBassEffectChangeInfo,
                sequentialPercussionEffectChangeInfo: sequentialPercussionEffectChangeInfo,
                parallelTempoChangeInfo: parallelTempoChangeInfo,
                indexInfo: indexInfo
            });
    }

    var mods = [
        // Index info
        ["indexInfoVar", indexInfo],

        // Render amount
        ["melodyRenderAmountVar", "" + JSON.stringify(renderAmountInfo.melodyRenderAmount)],
        ["inner1RenderAmountVar", "" + JSON.stringify(renderAmountInfo.inner1RenderAmount)],
        ["inner2RenderAmountVar", "" + JSON.stringify(renderAmountInfo.inner2RenderAmount)],
        ["bassRenderAmountVar", "" + JSON.stringify(renderAmountInfo.bassRenderAmount)],
        ["percussionRenderAmountVar", "" + JSON.stringify(renderAmountInfo.percussionRenderAmount)],

        // Melody voice line suspension
        ["suspendSeedVar", "" + JSON.stringify(suspendInfo.seed)],
        ["suspendProbabilityVar", "" + JSON.stringify(suspendInfo.probability)],

        // Melody motif and channel distribution
        ["melodyIndexMotifPatternVar", "" + JSON.stringify(melodyMotifDistributionInfo.indices)],
        ["endMelodyIndexMotifPatternVar", "" + JSON.stringify(melodyMotifDistributionInfo.endIndices)],
        ["melodyChannelIndicesVar", "" + JSON.stringify(melodyChannelDistributionInfo.channels)],
        ["endMelodyChannelIndicesVar", "" + JSON.stringify(melodyChannelDistributionInfo.endChannels)],

        // Bass motif distribution
        ["bassIndexMotifPatternVar", "" + JSON.stringify(bassMotifDistributionInfo.indices)],
        ["endBassIndexMotifPatternVar", "" + JSON.stringify(bassMotifDistributionInfo.endIndices)],
        ["bassChannelIndicesVar", "" + JSON.stringify(bassChannelDistributionInfo.channels)],
        ["endBassChannelIndicesVar", "" + JSON.stringify(bassChannelDistributionInfo.endChannels)],

        // Inner 1 motif distribution
        ["inner1IndexMotifPatternVar", "" + JSON.stringify(inner1MotifDistributionInfo.indices)],
        ["endInner1IndexMotifPatternVar", "" + JSON.stringify(inner1MotifDistributionInfo.endIndices)],
        ["inner1ChannelIndicesVar", "" + JSON.stringify(inner1ChannelDistributionInfo.channels)],
        ["endInner1ChannelIndicesVar", "" + JSON.stringify(inner1ChannelDistributionInfo.endChannels)],

        // Inner 2 motif distribution
        ["inner2IndexMotifPatternVar", "" + JSON.stringify(inner2MotifDistributionInfo.indices)],
        ["endInner2IndexMotifPatternVar", "" + JSON.stringify(inner2MotifDistributionInfo.endIndices)],
        ["inner2ChannelIndicesVar", "" + JSON.stringify(inner2ChannelDistributionInfo.channels)],
        ["endInner2ChannelIndicesVar", "" + JSON.stringify(inner2ChannelDistributionInfo.endChannels)],


        // Percussion motif distribution
        ["percIndexMotifPatternVar", "" + JSON.stringify(percussionMotifDistributionInfo.indices)],
        ["endPercIndexMotifPatternVar", "" + JSON.stringify(percussionFillMotifDistributionInfo.indices)],

        // Harmony rythm
        ["harmonyNoteCountVar", "" + harmonyRythmInfo.count],
        ["harmonyTotalLengthVar", "" + harmonyRythmInfo.totalLength],
        ["harmonyRythmLengthTypeVar", "" + harmonyRythmInfo.lengthType],
        ["harmonyRythmMeasureSplitStrategyVar", "" + harmonyRythmInfo.measureSplitStrategy],
        ["hrDensityCurveSeedVar", "" + harmonyRythmInfo.seed],
        ["hrDensityCurveAmpVar", "" + harmonyRythmInfo.densityAmplitude],
        ["hrDensityCurveFreqVar", "" + harmonyRythmInfo.densityFrequency],
        ["staticHarmonyLengthVar", "" + harmonyRythmInfo.staticLength],
        ["dynamicHarmonyLengthVar", "" + harmonyRythmInfo.dynamicLength],
        ["dominantCadenceHarmonyLengthVar", "" + harmonyRythmInfo.dominantCadenceLength],
        ["tonicCadenceHarmonyLengthVar", "" + harmonyRythmInfo.tonicCadenceLength],

        // Phrase structure
        ["harmonyPhraseTypeVar", "" + phraseInfo.phraseType],
        ["harmonyMajorModulationTargetVar", "" + phraseInfo.majorModulationTarget],
        ["harmonyMinorModulationTargetVar", "" + phraseInfo.minorModulationTarget],

        // Tempo
        ["sectionTempoVar", "" + tempoInfo.tempo],
        ["nextSectionTempoVar", "" + tempoInfo.nextTempo],
        ["prevSectionTempoVar", "" + tempoInfo.prevTempo],
        ["parallelTempoChangeIndicesVar", JSON.stringify(parallelTempoChangeInfo.indices)],
        ["sequentialTempoChangeIndicesVar", JSON.stringify(sequentialTempoChangeInfo.indices)],
        ["sequentialTempoChangeStartIndicesVar", JSON.stringify(sequentialTempoChangeInfo.startIndices)],
        ["sequentialTempoChangeEndIndicesVar", JSON.stringify(sequentialTempoChangeInfo.endIndices)],

        // Effects
        ["sequentialMelodyEffectChangeInfoVar", sequentialMelodyEffectChangeInfo],
        ["sequentialInner1EffectChangeInfoVar", sequentialInner1EffectChangeInfo],
        ["sequentialInner2EffectChangeInfoVar", sequentialInner2EffectChangeInfo],
        ["sequentialBassEffectChangeInfoVar", sequentialBassEffectChangeInfo],
        ["sequentialPercussionEffectChangeInfoVar", sequentialPercussionEffectChangeInfo],

        // Harmony
        ["harmonyScaleBaseVar", "" + harmonyInfo.scaleBaseNote],
        ["scaleTypeVar", "" + harmonyInfo.scaleType],
        ["numeratorVar", "" + harmonyInfo.numerator],
        ["harmonyElementIndexVar", "" + harmonyInfo.harmonyElementIndex],


        ["harmonySeedVar", "" + harmonyExtraInfo.harmonySeed],
        ["harmonyRaiseLeadingToneVar", "" + harmonyExtraInfo.raiseLeadingTone],
        ["harmonySimpleMixtureLikelihoodVar", "" + harmonyExtraInfo.simpleMixtureLikelihood],
        ["harmonySus2ChordsLikelihoodVar", "" + harmonyExtraInfo.sus2ChordsLikelihood],
        ["harmonySus4ChordsLikelihoodVar", "" + harmonyExtraInfo.sus4ChordsLikelihood],
        ["harmonyNeighbourChordsLikelihoodVar", "" + harmonyExtraInfo.neighbourChordsLikelihood],
        ["harmonyPassingChordsLikelihoodVar", "" + harmonyExtraInfo.passingChordsLikelihood],
        ["harmonyMajorDeceptiveRootVar", "" + harmonyExtraInfo.majorDeceptiveRoot],
        ["harmonyMinorDeceptiveRootVar", "" + harmonyExtraInfo.minorDeceptiveRoot],


        // Melody shape
        ["melodyCurveAmplitudeVar", "" + melodyShapeInfo.amplitude],
        ["melodyCurveBiasVar", "" + melodyShapeInfo.bias],
        ["melodyCurveTypeVar", "" + melodyShapeInfo.curveType],
        ["melodyCurveIdVar", "" + "\"" + melodyShapeInfo.curveId + "\""],
        ["melodyCurveMultiplyAmpVar", "true"],

        // Bass shape
        ["bassCurveAmplitudeVar", "" + bassShapeInfo.amplitude],
        ["bassCurveBiasVar", "" + bassShapeInfo.bias],
        ["bassCurveTypeVar", "" + bassShapeInfo.curveType],
        ["bassCurveIdVar", "" + "\"" + bassShapeInfo.curveId + "\""],
        ["bassCurveMultiplyAmpVar", "true"]

    ];

    for (var i=0; i<this.modifierFunctions.length; i++) {
        this.modifierFunctions[i](mods);
    }
//    logit(mods);

    return mods;
};

function findMod(varName, mods) {
    for (var i=0; i<mods.length; i++) {
        var m = mods[i];
        if (m[0] == varName) {
            return m[1];
        }
    }
    return null;
}

function setMod(varName, value, mods) {
    for (var i=0; i<mods.length; i++) {
        var m = mods[i];
        if (m[0] == varName) {
            m[1] = value;
//                logit("Setting " + m[0] + " to " + m[1]);
            break;
        }
    }
}

function getPhraseIndexInfo(mods) {
    var indexInfo = findMod("indexInfoVar", mods);
    return indexInfo;
}


function getPhraseGroupIndex(mods) {
    var indexInfo = getPhraseIndexInfo(mods);
    return indexInfo.phraseGroupIndex;
}

function createPhraseGroupInfo(rnd, genInfo, module) {
    var melodyShapeCount = genInfo.melodyShapeCount;
    var bassShapeCount = genInfo.bassShapeCount;
    var harmonyRythmCount = genInfo.harmonyRythmCount;
    var harmonyCount = genInfo.harmonyCount;
    var harmonyExtraCount = genInfo.harmonyExtraCount;
    var suspendTypeCount = genInfo.suspendTypeCount;
    var channelDistributionCount = genInfo.channelDistributionCount; // For each voice line
    var motifDistributionCount = genInfo.motifDistributionCount; // For each voice line
    var renderAmountCount = genInfo.renderAmountCount;
    var tempoCount = genInfo.tempoCount;
    var tempoChangeCount = genInfo.tempoChangeCount;
    var effectChangeCount = genInfo.effectChangeCount;


    var propertyNameCounts = [
        // "phraseTypeIndices", // Determined by the phrase group sequence
        ["melodyShapeIndices", melodyShapeCount], // 0
        ["bassShapeIndices", bassShapeCount], // 1
        ["harmonyIndices", harmonyCount], // 2
        ["harmonyRythmIndices", harmonyRythmCount], // 3
        ["suspendIndices", suspendTypeCount], // 4
        ["melodyChannelDistributionIndices", channelDistributionCount], // 5
        ["inner1ChannelDistributionIndices", channelDistributionCount], // 6
        ["inner2ChannelDistributionIndices", channelDistributionCount], // 7
        ["bassChannelDistributionIndices", channelDistributionCount], // 8
        ["melodyMotifDistributionIndices", motifDistributionCount], // 9
        ["inner1MotifDistributionIndices", motifDistributionCount], // 10
        ["inner2MotifDistributionIndices", motifDistributionCount], // 11
        ["bassMotifDistributionIndices", motifDistributionCount], // 12
        ["harmonyExtraIndices", harmonyExtraCount], // 13
        ["percussionMotifDistributionIndices", motifDistributionCount], // 14
        ["renderAmountIndices", renderAmountCount], // 15
        ["tempoIndices", tempoCount], // 16
        ["percussionFillMotifDistributionIndices", motifDistributionCount], // 17
        ["sequentialTempoChangeIndices", tempoChangeCount], // 18
        ["parallelTempoChangeIndices", tempoChangeCount], // 19
        ["sequentialMelodyEffectChangeIndices", effectChangeCount], // 20
        ["sequentialInner1EffectChangeIndices", effectChangeCount], // 21
        ["sequentialInner2EffectChangeIndices", effectChangeCount], // 22
        ["sequentialBassEffectChangeIndices", effectChangeCount], // 23
        ["sequentialPercussionEffectChangeIndices", effectChangeCount] // 24
    ];
    for (var i=0; i<propertyNameCounts.length; i++) {
        var arr = propertyNameCounts[i];
        arr[2] = createOrGetRandom(genInfo, arr[0] + "Seed");
    }

    var tempoRnd = createOrGetRandom(genInfo, "tempoSeed");
    var tempo = tempoRnd.random() * (genInfo.tempoRange[1] - genInfo.tempoRange[0]) + genInfo.tempoRange[0];

    var scaleRnd = createOrGetRandom(genInfo, "scaleSeed");
    var scaleBase = 55 + Math.round(scaleRnd.random() * 10);

    if (genInfo.setScaleBaseNote) {
        scaleBase = positiveMod(genInfo.scaleBaseNote, 12) + 60;
    }
//    scaleBase = 60;
    var scaleTypeRndInfos = [
        {data: ScaleType.MAJOR, likelihood: genInfo.majorScaleLikelihood},
        {data: ScaleType.NATURAL_MINOR, likelihood: genInfo.minorScaleLikelihood}
    ];
    var scaleType = sampleData(scaleTypeRndInfos, scaleRnd); // scaleRnd.random() < 0.5 ? ScaleType.MAJOR : ScaleType.NATURAL_MINOR;
//    var scaleType = ScaleType.MAJOR;

//    logit("Sampling scale " + JSON.stringify(scaleTypeRndInfos) + " " + ScaleType.toString(scaleType));

    var alwaysSameWithinGroup = [16];

    function getPhraseGroupTypes(tonicizeFraction) {
        var result = copyValueDeep(genInfo.phraseGroupTypes);
        for (var i=0; i<result.length; i++) {
            if (SimpleModuleGeneratorPhraseGroupType.tonicizeOrModulate(result[i].data)) {
                result[i].likelihood *= tonicizeFraction;
//                logit("Setting with " + tonicizeFraction);
            }
        }

        return result;
    }


    var modulatePhraseGroupTypes = copyValueDeep(genInfo.modulatePhraseGroupTypes);

    var groupTypePropertySames = {};
    groupTypePropertySames[SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_COMPLETE_DIFFERENT_SCALE_TYPE] = [3, 9];
    groupTypePropertySames[SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT_SHORTEN] = [3, 13];

    var groupIndexPropertySames = {};

    var numeratorRndInfos = [
        {data: 2, likelihood: genInfo.timeSignature2Likelihood},
        {data: 3, likelihood: genInfo.timeSignature3Likelihood},
        {data: 4, likelihood: genInfo.timeSignature4Likelihood}
    ];

    var tsRnd = createOrGetRandom(genInfo, "tsSeed");
    var numerator = sampleData(numeratorRndInfos, tsRnd);


    var introGroupTypes = genInfo.introGroupTypes;
    var introRnd = createOrGetRandom(genInfo, "introSeed");
    var hasIntro = introRnd.random() < genInfo.songIntroProbability;
    var introGroupType = sampleData(introGroupTypes, introRnd);

    var introHarmonyCount = introGroupType == SimpleModuleGeneratorPhraseGroupType.SINGLE_TONIC_PROLONG ?
        2 + Math.floor(introRnd.random() * 3) :
        4 + Math.floor(introRnd.random() * 2);
    var introLength = sampleData([
        {data: 1, likelihood: tempo < 90 ? 6 : 3},
        {data: 2, likelihood: 1}], introRnd);

    if (numerator == 2) {
        introLength *= 2;
    }

    var introRenderAmount = 0.7 * introRnd.random();
    var introMelodyOn = false; // rnd.random() < 0.2;


    var endRnd = createOrGetRandom(genInfo, "endSeed");
    var endGroupTypes = genInfo.endGroupTypes;
    var hasEnd = endRnd.random() < genInfo.songEndProbability;
    var endGroupType = sampleData(endGroupTypes, endRnd);

    var endHarmonyCount = endGroupType == SimpleModuleGeneratorPhraseGroupType.SINGLE_TONIC_PROLONG ?
        2 + Math.floor(endRnd.random() * 3) : 4 + Math.floor(endRnd.random() * 2);
    var endLength = sampleData([
        {data: 1, likelihood: tempo < 90 ? 2 : 1},
        {data: 2, likelihood: 2}], endRnd);
    if (numerator == 2) {
        endLength *= 2;
    }
    var endRenderAmount = 0.7 * endRnd.random();
    var endMelodyOn = endRnd.random() < 0.5;


    var glueGroupTypes = genInfo.glueGroupTypes;

    // Must be ordered according to data...
    var groupPropertyRndInfos = [
        {data: PhraseGroupIndexProperty.MELODY_SHAPE, likelihood: 5},
        {data: PhraseGroupIndexProperty.BASS_SHAPE, likelihood: 5},
        {data: PhraseGroupIndexProperty.HARMONY, likelihood: 5},
        {data: PhraseGroupIndexProperty.HARMONY_RYTHM, likelihood: 50},
        {data: PhraseGroupIndexProperty.SUSPEND, likelihood: 5},
        {data: PhraseGroupIndexProperty.MELODY_INSTRUMENT_DISTRIBUTION, likelihood: 40},
        {data: PhraseGroupIndexProperty.INNER_1_INSTRUMENT_DISTRIBUTION, likelihood: 25},
        {data: PhraseGroupIndexProperty.INNER_2_INSTRUMENT_DISTRIBUTION, likelihood: 25},
        {data: PhraseGroupIndexProperty.BASS_INSTRUMENT_DISTRIBUTION, likelihood: 35},
        {data: PhraseGroupIndexProperty.MELODY_MOTIF_DISTRIBUTION, likelihood: 40},
        {data: PhraseGroupIndexProperty.INNER_1_MOTIF_DISTRIBUTION, likelihood: 5},
        {data: PhraseGroupIndexProperty.INNER_2_MOTIF_DISTRIBUTION, likelihood: 5},
        {data: PhraseGroupIndexProperty.BASS_MOTIF_DISTRIBUTION, likelihood: 10},
        {data: PhraseGroupIndexProperty.HARMONY_CHARACTERISTIC, likelihood: 20},
        {data: PhraseGroupIndexProperty.PERCUSSION_MOTIF_DISTRIBUTION, likelihood: 5},
        {data: PhraseGroupIndexProperty.RENDER_AMOUNT, likelihood: 5},
        {data: PhraseGroupIndexProperty.TEMPO, likelihood: 15}, // Is always same for now...
        {data: PhraseGroupIndexProperty.PERCUSSION_FILL_DISTRIBUTION, likelihood: 5},
        {data: PhraseGroupIndexProperty.TEMPO_CHANGE_1, likelihood: 15},
        {data: PhraseGroupIndexProperty.TEMPO_CHANGE_2, likelihood: 15},
        {data: PhraseGroupIndexProperty.MELODY_EFFECTS, likelihood: 15},
        {data: PhraseGroupIndexProperty.INNER_1_EFFECTS, likelihood: 15},
        {data: PhraseGroupIndexProperty.INNER_2_EFFECTS, likelihood: 15},
        {data: PhraseGroupIndexProperty.BASS_EFFECTS, likelihood: 15},
        {data: PhraseGroupIndexProperty.PERCUSSION_EFFECTS, likelihood: 15}
    ];


    var numerators = [];
    var tempos = [];
    var scaleTypes = [];
    var scaleBases = [];
    var majorModulationTargets = [];
    var minorModulationTargets = [];
    var modulationInvertScaleTypes = [];
    var withinGroupSameInfos = [];
    var withinGroupDifferentInfos = [];
    var groupIndices = [];
    var groupModifierFunctions = [];

//    var midRenderAmount = 0.35 + 0.3 * rnd.random();
    var renderAmountRnd = createOrGetRandom(genInfo, "renderAmountSeed");

    var midRenderAmount = 0.2 + 0.4 * renderAmountRnd.random();
    var lowRenderAmount = 0.05 + 0.15 * renderAmountRnd.random();

    var low = lowRenderAmount;
    var mid = midRenderAmount;
    var high = 1.0;


    var verseRenderAmountPatterns = [
        {data: [mid, mid], likelihood: 1},
        {data: [mid, low], likelihood: 1},
        {data: [low, mid], likelihood: 1},
        {data: [low, low], likelihood: 1}
    ];
    var chorusRenderAmountPatterns = [
        {data : [high, high], likelihood: 1}
    ];
    var bridgeRenderAmountPatterns = [
        {data : [low, mid], likelihood: 1},
        {data : [mid, low], likelihood: 1}
    ];
    var miscRenderAmountPatterns = [
        {data : [low, mid], likelihood: 1},
        {data : [mid, low], likelihood: 1}
    ];

    var verseGroupRndInfos = [
        {
            data: {
                groups: [0]
            },
            likelihood: 1
        },
        {
            data: {
                groups: [1]
            },
            likelihood: 1
        }
    ];
    var chorusGroupRndInfos = [
        {
            data: {
                groups: [2]
            },
            likelihood: 1
        },
        {
            data: {
                groups: [3]
            },
            likelihood: 1
        }
    ];
    var bridgeGroupRndInfos = [
        {
            data: {
                groups: [4]
            },
            likelihood: 1
        },
        {
            data: {
                groups: [5]
            },
            likelihood: 1
        }
    ];
    var miscGroupRndInfos = [
        {
            data: {
                groups: [6]
            },
            likelihood: 1
        },
        {
            data: {
                groups: [7]
            },
            likelihood: 1
        }
    ];


    var renderAmounts = [];
    var renderAmountSeeds = [];


    var groupPattern = [];
    var groupRenderAmounts = [];
    var groupRenderAmountSeeds = [];
    var prefixGroupProbs = [];
    var postfixGroupProbs = [];
    var prefixGroupRenderAmountBiasMults = [];
    var postfixGroupRenderAmountBiasMults = [];

    var groupModulationTargets = [];
    var groupScaleTypes = [];
    var groupScaleBases = [];
    var groupModulates = [];

    var modifierFunctions = [];

    var groupHarmonyElementIndices = [];



    var songPartStructureRndInfos = [
        {data:
            [
                ["verse1", {strength: "veryWeak", prefixProbsOverride: [0], postfixProbsOverride: [0], sameGroupIndexSames: [createFilledNumericIncArray(24, 0, 1)]}],
                ["verse1", {strength: "medium", prefixProbsOverride: [0], postfixProbsOverride: [0]}],
                ["verse1", {strength: "veryStrong", prefixProbsOverride: [0], postfixProbsOverride: [0]}],
                ["chorus1", {strength: "veryWeak", prefixProbsOverride: [0.7]}],
                ["verse1", {strength: "veryStrong", prefixProbsOverride: [0], postfixProbsOverride: [0]}],
                ["chorus1", {strength: "veryStrong", prefixProbsOverride: [0], postfixProbsOverride: [0]}]
            ],
            likelihood: 1 * genInfo.strictBuildSongStructureLikelihoodMultiplier},
        {data:
            [
                ["verse1", {strength: "veryWeak", prefixProbsOverride: [0], postfixProbsOverride: [0], sameGroupIndexSames: [createFilledNumericIncArray(24, 0, 1)]}],
                ["verse1", {strength: "medium", prefixProbsOverride: [0], postfixProbsOverride: [0]}],
                ["verse1", {strength: "veryStrong", prefixProbsOverride: [0], postfixProbsOverride: [0]}],
                ["chorus1", {strength: "veryWeak", prefixProbsOverride: [0.7]}],
                ["verse1", {strength: "veryStrong", prefixProbsOverride: [0], postfixProbsOverride: [0]}],
                ["bridgeNoMelody1", {strength: "strong", prefixProbsOverride: [0], postfixProbsOverride: [0]}],
                ["chorus1", {strength: "veryStrong", prefixProbsOverride: [0], postfixProbsOverride: [0]}]
            ],
            likelihood: 1 * genInfo.noMelodyPartSongStructureLikelihoodMultiplier * genInfo.strictBuildSongStructureLikelihoodMultiplier},
        {data:
            [["verse1", "veryWeak", [0], [0], [createFilledNumericIncArray(24, 0, 1)]],
                ["verse1", "medium", [0], [0]],
                ["verse1", "veryStrong", [0], [0]],
                ["chorus1", "veryWeak", [0.7], null],
                ["chorus1", "veryStrong", [0], [0]],
                ["verse1", "veryStrong", [0.7], [0]]
            ],
            likelihood: 1 * genInfo.strictBuildSongStructureLikelihoodMultiplier},
        {data:
            [["verse1", "veryWeak", [0], [0], [createFilledNumericIncArray(24, 0, 1)]],
                ["verse1", "medium", [0], [0]],
                ["chorus1", "veryWeak", [0.7], null],
                ["chorus1", "veryStrong", [0], [0]],
                ["verse1", "veryStrong", [0.7], [0]]
            ],
            likelihood: 1 * genInfo.strictBuildSongStructureLikelihoodMultiplier},
        {data:
            [["verse1", "veryWeak", [0], [0], [createFilledNumericIncArray(24, 0, 1)]],
                ["verse1", "medium", [0], [0]],
                ["chorus1", "veryWeak", [0.7], null],
                ["chorus1", "veryStrong", [0], [0]],
                ["bridgeNoMelody1", "strong", [0], [0]],
                ["verse1", "veryStrong", [0.7], [0]]
            ],
            likelihood: 1 * genInfo.noMelodyPartSongStructureLikelihoodMultiplier * genInfo.strictBuildSongStructureLikelihoodMultiplier},
        {data:
            [["verse1", "veryWeak", [0], [0], null],
                ["verse1", "medium", [0], [0]],
                ["verse1", "veryStrong", [0], [0]],
                ["chorus1", "veryWeak", [0.7], null],
                ["verse1", "veryStrong", [0], [0]],
                ["chorus1", "veryStrong", [0], [0]]
            ],
            likelihood: 1 * genInfo.buildSongStructureLikelihoodMultiplier},
        {data:
            [["verse1", "veryWeak", [0], [0], null],
                ["verse1", "medium", [0], [0]],
                ["verse1", "veryStrong", [0], [0]],
                ["bridgeNoMelody1", "strong", [0], [0]],
                ["chorus1", "veryWeak", [0.7], null],
                ["verse1", "veryStrong", [0], [0]],
                ["chorus1", "veryStrong", [0], [0]]
            ],
            likelihood: 1 * genInfo.noMelodyPartSongStructureLikelihoodMultiplier * genInfo.buildSongStructureLikelihoodMultiplier},
        {data:
            [["verse1", "veryWeak", [0], [0], null],
                ["verse1", "medium", [0], [0]],
                ["verse1", "veryStrong", [0], [0]],
                ["chorus1", "veryWeak", [0.7], null],
                ["verse1", "veryStrong", [0], [0]],
                ["bridgeNoMelody1", "strong", [0], [0]],
                ["chorus1", "veryStrong", [0], [0]]
            ],
            likelihood: 1 * genInfo.noMelodyPartSongStructureLikelihoodMultiplier * genInfo.buildSongStructureLikelihoodMultiplier},
        {data:
            [["verse1", "veryWeak", [0], [0], null],
                ["verse1", "medium", [0], [0]],
                ["verse1", "veryStrong", [0], [0]],
                ["chorus1", "veryWeak", [0.7], null],
                ["chorus1", "veryStrong", [0], [0]],
                ["verse1", "veryStrong", [0.7], [0]]
            ],
            likelihood: 1 * genInfo.buildSongStructureLikelihoodMultiplier},
        {data:
            [["verse1", "veryWeak", [0], [0], null],
                ["verse1", "medium", [0], [0]],
                ["verse1", "veryStrong", [0], [0]],
                ["chorus1", "veryWeak", [0.7], null],
                ["chorus1", "veryStrong", [0], [0]],
                ["bridgeNoMelody1", "strong", [0], [0]],
                ["verse1", "veryStrong", [0.7], [0]]
            ],
            likelihood: 1 * genInfo.noMelodyPartSongStructureLikelihoodMultiplier * genInfo.buildSongStructureLikelihoodMultiplier},
        {data:
            [["verse1", "veryWeak", [0], [0], null],
                ["verse1", "medium", [0], [0]],
                ["chorus1", "veryWeak", [0.7], null],
                ["chorus1", "veryStrong", [0], [0]],
                ["verse1", "veryStrong", [0.7], [0]]
            ],
            likelihood: 1 * genInfo.buildSongStructureLikelihoodMultiplier},
        {data:
            [["verse1", "veryWeak", [0], [0], null],
                ["verse1", "medium", [0], [0]],
                ["chorus1", "veryWeak", [0.7], null],
                ["chorus1", "veryStrong", [0], [0]],
                ["bridgeNoMelody1", "strong", [0], [0]],
                ["verse1", "veryStrong", [0.7], [0]]
            ],
            likelihood: 1 * genInfo.noMelodyPartSongStructureLikelihoodMultiplier * genInfo.buildSongStructureLikelihoodMultiplier},
        {data: [["verse1"], ["chorus1"], ["verse1"], ["chorus1"], ["verse2"], ["chorus1"]], likelihood: 1 * genInfo.verseChorusSongStructureLikelihoodMultiplier},
        {data: [["verseNoMelody2"], ["verse1"], ["chorus1"], ["verse1"], ["chorus1"], ["verse2"], ["chorus1"]], likelihood: 1 * genInfo.noMelodyPartSongStructureLikelihoodMultiplier * genInfo.verseChorusSongStructureLikelihoodMultiplier},
        {data: [["verse1"], ["chorus1"], ["verse1"], ["chorus1"], ["verse1"], ["chorus2"]], likelihood: 1 * genInfo.verseChorusSongStructureLikelihoodMultiplier},
        {data: [["chorusNoMelody1"], ["verse1"], ["chorus1"], ["verse1"], ["chorus1"], ["verse1"], ["chorus2"]], likelihood: 1 * genInfo.noMelodyPartSongStructureLikelihoodMultiplier * genInfo.verseChorusSongStructureLikelihoodMultiplier},
        {data: [["verse1"], ["chorus1"], ["verse1"], ["chorus1"], ["verse2"], ["chorus1"], ["chorus1"]], likelihood: 1 * genInfo.verseChorusSongStructureLikelihoodMultiplier},
        {data: [["verse1"], ["chorus1"], ["verse1"], ["chorus1"], ["verse2"], ["chorus1"], ["chorus1"], ["verseNoMelody1"]], likelihood: 1 * genInfo.noMelodyPartSongStructureLikelihoodMultiplier * genInfo.verseChorusSongStructureLikelihoodMultiplier},
        {data: [["verse1"], ["chorus1"], ["verse1"], ["chorus1"], ["verse2"], ["chorus2"], ["chorus1"]], likelihood: 1 * genInfo.verseChorusSongStructureLikelihoodMultiplier},
        {data: [["verse1"], ["chorus1"], ["verse1"], ["chorus1"], ["verse2"], ["chorus2"], ["chorus1"], ["chorusNoMelody2"]], likelihood: 1 * genInfo.noMelodyPartSongStructureLikelihoodMultiplier * genInfo.verseChorusSongStructureLikelihoodMultiplier},
        {data: [["verse1"], ["chorus1"], ["verse1"], ["chorus1"], ["verse1"], ["chorus2"], ["chorus1"]], likelihood: 1 * genInfo.verseChorusSongStructureLikelihoodMultiplier},
        {data: [["chorusNoMelody1"], ["verse1"], ["chorus1"], ["verse1"], ["chorus1"], ["verse1"], ["chorus2"], ["chorus1"]], likelihood: 1 * genInfo.noMelodyPartSongStructureLikelihoodMultiplier * genInfo.verseChorusSongStructureLikelihoodMultiplier},
        {data: [["verse1"], ["chorus1"], ["verse1"], ["chorus1"], ["bridge1"], ["verse1"], ["chorus2"]], likelihood: 1 * genInfo.verseChorusBridgeSongStructureLikelihoodMultiplier},
        {data: [["verse1"], ["chorus1"], ["verse1"], ["chorus1"], ["bridgeNoMelody1"], ["verse1"], ["chorus2"]], likelihood: 1 * genInfo.noMelodyPartSongStructureLikelihoodMultiplier * genInfo.verseChorusBridgeSongStructureLikelihoodMultiplier},
        {data: [["verse1"], ["chorus1"], ["verse1"], ["chorus1"], ["bridge1"], ["verse1"], ["chorus1"]], likelihood: 1 * genInfo.verseChorusBridgeSongStructureLikelihoodMultiplier},
        {data: [["verse1"], ["chorus1"], ["verse1"], ["chorus1"], ["bridgeNoMelody1"], ["verse1"], ["chorus1"]], likelihood: 1 * genInfo.noMelodyPartSongStructureLikelihoodMultiplier * genInfo.verseChorusBridgeSongStructureLikelihoodMultiplier},
        {data: [["verse1"], ["chorus1"], ["verse2"], ["chorus1"], ["bridge1"], ["verse1"], ["chorus1"]], likelihood: 1 * genInfo.verseChorusBridgeSongStructureLikelihoodMultiplier},
        {data: [["verse1"], ["chorus1"], ["verse2"], ["chorus1"], ["bridgeNoMelody1"], ["verse1"], ["chorus1"]], likelihood: 1 * genInfo.noMelodyPartSongStructureLikelihoodMultiplier * genInfo.verseChorusBridgeSongStructureLikelihoodMultiplier},
        {data: [["verse1"], ["chorus1"], ["verse2"], ["chorus1"], ["bridge1"], ["verse2"], ["chorus1"]], likelihood: 1 * genInfo.verseChorusBridgeSongStructureLikelihoodMultiplier},
        {data: [["verse1"], ["chorus1"], ["verse2"], ["chorus1"], ["bridgeNoMelody1"], ["verse2"], ["chorus1"]], likelihood: 1 * genInfo.noMelodyPartSongStructureLikelihoodMultiplier * genInfo.verseChorusBridgeSongStructureLikelihoodMultiplier},
        {data: [["verse1"], ["chorus1"], ["verse1"], ["chorus1"], ["bridge1"], ["verse2"], ["chorus2"]], likelihood: 1 * genInfo.verseChorusBridgeSongStructureLikelihoodMultiplier},
        {data: [["verse1"], ["chorus1"], ["verse1"], ["chorus1"], ["bridgeNoMelody1"], ["verse2"], ["chorus2"]], likelihood: 1 * genInfo.noMelodyPartSongStructureLikelihoodMultiplier * genInfo.verseChorusBridgeSongStructureLikelihoodMultiplier},
        {data: [["verse1"], ["chorus1"], ["verse1"], ["chorus1"], ["bridge1"], ["chorus1"], ["chorus1"]], likelihood: 1 * genInfo.verseChorusBridgeSongStructureLikelihoodMultiplier},
        {data: [["verse1"], ["chorus1"], ["verse1"], ["chorus1"], ["bridgeNoMelody1"], ["chorus1"], ["chorus1"]], likelihood: 1 * genInfo.noMelodyPartSongStructureLikelihoodMultiplier * genInfo.verseChorusBridgeSongStructureLikelihoodMultiplier},
        {data: [["verse1"], ["chorus1"], ["verse1"], ["chorus1"], ["bridge1"], ["chorus2"], ["chorus2"]], likelihood: 1 * genInfo.verseChorusBridgeSongStructureLikelihoodMultiplier},
        {data: [["verse1"], ["chorus1"], ["verse1"], ["chorus1"], ["bridgeNoMelody1"], ["chorus2"], ["chorus2"]], likelihood: 1 * genInfo.noMelodyPartSongStructureLikelihoodMultiplier * genInfo.verseChorusBridgeSongStructureLikelihoodMultiplier},
        {data: [["verse1"], ["chorus1"], ["verse1"], ["chorus1"], ["bridge1"], ["chorus1"], ["chorus2"]], likelihood: 1 * genInfo.verseChorusBridgeSongStructureLikelihoodMultiplier},
        {data: [["verse1"], ["chorus1"], ["verse1"], ["chorus1"], ["bridgeNoMelody1"], ["chorus1"], ["chorus2"]], likelihood: 1 * genInfo.noMelodyPartSongStructureLikelihoodMultiplier * genInfo.verseChorusBridgeSongStructureLikelihoodMultiplier}
    ];


    function convertSongPartStructureInfos(data) {
        for (var j=0; j<data.length; j++) {
            if (data[j]._constructorName == "SongPartStructureInfo") {
                data[j].strength = SongPartStrength.toIndicatorString(data[j].strength);
                data[j] = [SongPartType.toIndicatorString(data[j].partType), data[j]];
            }
        }
    }

    // Rearange when SongPartStructureInfo is used as input
    var extraSongPartStructureRndInfos = copyValueDeep(genInfo.songPartStructureRndInfos);
    for (var i=0; i<extraSongPartStructureRndInfos.length; i++) {
        var espsri = extraSongPartStructureRndInfos[i];
        var data = espsri.data;
        convertSongPartStructureInfos(data);
    }

    if (genInfo.overwriteSongPartStructureRndInfos && extraSongPartStructureRndInfos.length > 0) {
        songPartStructureRndInfos = copyValueDeep(extraSongPartStructureRndInfos);
    }


    var minorHarmonicPlans = genInfo.minorHarmonicPlans;
    var majorHarmonicPlans = genInfo.majorHarmonicPlans;


    var modulationRnd = createOrGetRandom(genInfo, "modulationSeed");

    var songPartStructureRndInfosCopy = copyValueDeep(songPartStructureRndInfos);

    for (var i=0; i<songPartStructureRndInfosCopy.length; i++) {

        var info = songPartStructureRndInfosCopy[i];

        var data = info.data;
        var modulateOk = data.length > 5;
        for (var j=0; j<data.length; j++) {
            if (data[j].length > 1) {
                modulateOk = false;
                break;
            }
        }
        var doModulate = false;
        var indices = [];
        var infoCopy = copyValueDeep(info);
        var dataCopy = infoCopy.data;
        var plans = scaleType == ScaleType.MAJOR ? majorHarmonicPlans : minorHarmonicPlans;
        var plan = sampleData(plans, modulationRnd);

        if (modulateOk) {
            // Add harmonic plan

            var span = plan.length - 1;

            var firstIndex = 1 + Math.floor(modulationRnd.random() * (dataCopy.length - 3));
            var lastIndex = Math.max(firstIndex + span, dataCopy.length - 2 - Math.floor(modulationRnd.random() * (dataCopy.length - firstIndex)));
            var secondIndex = clamp(firstIndex + 1 + Math.floor(modulationRnd.random() * (lastIndex - firstIndex)), firstIndex + 1, lastIndex - 1);

            var indices = plan.length == 2 ? [firstIndex, lastIndex] : [firstIndex, secondIndex, lastIndex];
            doModulate = true;
        }
        if (genInfo.overwriteGroupModulationIndices) {
            var overwriteOk = true;
            var newIndices = [];
            var indicesPropName = "groupModulation" + plan.length + "Indices";

            if (genInfo[indicesPropName].length == plan.length) {
                for (var j=0; j<genInfo[indicesPropName].length; j++) {
                    var index = genInfo[indicesPropName][j];
                    if (index >= data.length) {
                        overwriteOk = false;
                    }
                    newIndices.push(index);
                }
            } else {
                overwriteOk = false;
            }
            if (overwriteOk) {
                indices = newIndices;
//                logit("new indices: " + newIndices + " " + rnd.random());
                doModulate = true;
            } else {
                logit("overwrite group modulation indices failed " + genInfo[indicesPropName] + " " + plan.length);
            }
        }

        if (doModulate) {
//            logit("Using plan " + plan);
            for (var j=0; j<indices.length; j++) {
                var oldData = dataCopy[indices[j]][1];
                if (!oldData || isArray(oldData)) {
                    dataCopy[indices[j]][1] = {groupModulationTarget: plan[j]};
                } else {
                    oldData.majorGroupModulationTarget = plan[j];
                    oldData.minorGroupModulationTarget = plan[j];
                }
            }
            infoCopy.likelihood *= genInfo.modulateLikelihoodMultiplier;
//            logit(infoCopy);

            songPartStructureRndInfos.push(infoCopy);
        }
    }

//            logit("structure rnd infos length: " + songPartStructureRndInfos.length);

//    logit(songPartStructureRndInfos);

    var songStructureRnd = createOrGetRandom(genInfo, "songStructureSeed");

    var songPartStructure = sampleData(songPartStructureRndInfos, songStructureRnd);

    if (genInfo.overwriteSongPartStructure && genInfo.songPartStructure.length > 0) {
        songPartStructure = copyValueDeep(genInfo.songPartStructure);
        convertSongPartStructureInfos(songPartStructure);
//            logit(songPartStructure);
    }

//    logit(songPartStructure);

    var prevWasVerse = false;
    var prevWasChorus = false;
    var prevWasBridge = false;

    var renderAmountStrengthMap = genInfo.renderAmountStrengthMap;

    var currentScaleBase = scaleBase;
    var currentScaleType = scaleType;

    var glueRnd = createOrGetRandom(genInfo, "glueSeed");

    var songFormStructureGroups = {};
    for (var i=0; i<songPartStructure.length; i++) {

        var songPart = songPartStructure[i][0];
        var partInfo = songPartStructure[i][1];

        var strengthStr = "";
        var prefixProbsOverride = null;
        var postfixProbsOverride = null;
        var sameGroupIndexSames = null;
        var groupModulationTarget = -1;

        var partGroupHarmonyElementIndices = [];
        var modifiers = [];

        if (typeof(partInfo) == 'object') {
            strengthStr = partInfo.strength;
            prefixProbsOverride = partInfo.prefixProbsOverride;
            postfixProbsOverride = partInfo.postfixProbsOverride;
            sameGroupIndexSames = partInfo.sameGroupIndexSames;
            partGroupHarmonyElementIndices = (partInfo.harmonyElementIndices && partInfo.harmonyElementIndices.length > 0) ? partInfo.harmonyElementIndices : [];
            if (currentScaleType == ScaleType.NATURAL_MINOR) {
                groupModulationTarget = typeof(partInfo.minorGroupModulationTarget) === 'undefined' ? -1 : partInfo.minorGroupModulationTarget;
            } else {
                groupModulationTarget = typeof(partInfo.majorGroupModulationTarget) === 'undefined' ? -1 : partInfo.majorGroupModulationTarget;
            }
        } else {
            strengthStr = songPartStructure[i][1];
            prefixProbsOverride = songPartStructure[i][2];
            postfixProbsOverride = songPartStructure[i][3];
            sameGroupIndexSames = songPartStructure[i][4];
        }

//        logit("Using " + DynamicHarmonyModulationTarget.toString(groupModulationTarget) + " " + i);

        var groups = songFormStructureGroups[songPart];
        var amounts = strengthStr ? renderAmountStrengthMap[strengthStr] : null;

        var isVerse = songPart.indexOf("verse") >= 0;
        var isChorus = songPart.indexOf("chorus") >= 0;
        var isBridge = songPart.indexOf("bridge") >= 0;
        var isMisc = songPart.indexOf("misc") >= 0;

        var noMelody = songPart.indexOf("NoMelody") >= 0;

        var songPartIndex = parseInt(songPart.charAt(songPart.length - 1)) - 1;

        if (!groups) {
            // Is it a verse, chorus, bridge?
            if (isVerse) {
                groups = verseGroupRndInfos[songPartIndex % verseGroupRndInfos.length].data.groups;
            } else if (isChorus) {
                groups = chorusGroupRndInfos[songPartIndex % chorusGroupRndInfos.length].data.groups;
//                groups = sampleData(chorusGroupRndInfos, songStructureRnd).groups;
            } else if (isBridge) {
                groups = bridgeGroupRndInfos[songPartIndex % bridgeGroupRndInfos.length].data.groups;
//                groups = sampleData(bridgeGroupRndInfos, songStructureRnd).groups;
            } else {
                groups = miscGroupRndInfos[songPartIndex % miscGroupRndInfos.length].data.groups;
//                logit("samping from misc " + songPartIndex + " " + JSON.stringify(groups) + " " + songPart);
            }
            songFormStructureGroups[songPart] = groups;
        }

        var sptoInfo = null;
        for (var j=0; j<genInfo.songPartTypeOverrideInfos.length; j++) {
            var sptoTemp = genInfo.songPartTypeOverrideInfos[j];

//            logit(" checking override " + sptoTemp.partType);
            if (sptoTemp.partType == groups[0]) {
                sptoInfo = sptoTemp;
                break;
            }
        }

        if (sptoInfo) {
            if (partGroupHarmonyElementIndices.length == 0) {
                partGroupHarmonyElementIndices = sptoInfo.harmonyElementIndices;
            }
        }

        if (partGroupHarmonyElementIndices.length == 0) {
            partGroupHarmonyElementIndices = [0]; // If no override, just use the phrase harmony
        }


        if (!amounts) {
            if (isVerse) {
                amounts = createFilledPatternArray(groups.length, sampleData(verseRenderAmountPatterns, renderAmountRnd));
            } else if (isChorus) {
                amounts = createFilledPatternArray(groups.length, sampleData(chorusRenderAmountPatterns, renderAmountRnd));
            } else if (isBridge) {
                amounts = createFilledPatternArray(groups.length, sampleData(bridgeRenderAmountPatterns, renderAmountRnd));
            } else {
                amounts = createFilledPatternArray(groups.length, sampleData(miscRenderAmountPatterns, renderAmountRnd));
            }
        }
//        logit("amounts: " + amounts + " " + strengthStr);

        var seeds = [];
        var prefixRenderAmountBiasMults = [];
        var postfixRenderAmountBiasMults = [];

        var prefixProbs = [];
        var postfixProbs = [];

        var seedLengthBefore = seeds.length;
        var randomSeeds = seeds.length == 0;

        var canHavePostfix = i < songPartStructure.length - 1;
        var canHavePrefix = i > 0 && postfixGroupProbs[postfixGroupProbs.length - 1] == 0;
        for (var j=0; j<groups.length; j++) {
            modifiers[j] = [];

            if (randomSeeds) {
                seeds[j] = renderAmountRnd.genrand_int31();
            } else {
                seeds[j] = seeds[j % seedLengthBefore];
            }
            if (sameGroupIndexSames && sameGroupIndexSames.length > 0) {
                groupIndexPropertySames[groups[j]] = sameGroupIndexSames[j % sameGroupIndexSames.length];
            }

            var prefixLikelihood = genInfo.defaultPrefixGlueProbability;
            var postfixLikelihood = genInfo.defaultPostfixGlueProbability;

            var prefixBiasMult = [0.05, 0.14];
            var postfixBiasMult = [0.05, 0.25];
            if (isBridge) {
                prefixLikelihood = 0.1;
                postfixLikelihood = 0.1;
            }
            if (prevWasBridge) {
                postfixLikelihood = 0.1;
            }
            if (isChorus) {
                postfixLikelihood = 0.5;
                postfixBiasMult = [0.05, 0.15]; // Make it very silent
            }
            if ((prevWasVerse || prevWasBridge) && isChorus) {
                prefixLikelihood = 0.5;
                prefixBiasMult = [0.3, 0.5]; // Prepare for chorus
            }
            if (prefixProbs) {

            }

            prefixProbs[j] = j == 0 && canHavePrefix && glueRnd.random() < prefixLikelihood ? 1.0 : 0.0;
            postfixProbs[j] = j == groups.length - 1 && canHavePostfix && glueRnd.random() < postfixLikelihood ? 1.0 : 0.0;

            prefixProbs[j] *= genInfo.prefixGlueProbabilityMultiplier;
            postfixProbs[j] *= genInfo.postfixGlueProbabilityMultiplier;

            prefixRenderAmountBiasMults[j] = prefixBiasMult;
            postfixRenderAmountBiasMults[j] = postfixBiasMult;

            (function(pInfo) {

                if (pInfo && typeof(pInfo) == 'object') {
                    var modArr = [];


                    if (pInfo.melodyRenderAmountOverride && pInfo.melodyRenderAmountOverride.length > 0) {
                        modArr.push(function(mods) {
                            setMod("melodyRenderAmountVar", "" + pInfo.melodyRenderAmountOverride[0], mods);
                        });
                    }
                    if (pInfo.inner1RenderAmountOverride && pInfo.inner1RenderAmountOverride.length > 0) {
//                        logit("Overriding inner 1 render amount " + pInfo.inner1RenderAmountOverride[0]);
                        modArr.push(function(mods) {
                            setMod("inner1RenderAmountVar", "" + pInfo.inner1RenderAmountOverride[0], mods);
                        });
                    }
                    if (pInfo.inner2RenderAmountOverride && pInfo.inner2RenderAmountOverride.length > 0) {
                        modArr.push(function(mods) {
                            setMod("inner2RenderAmountVar", "" + pInfo.inner2RenderAmountOverride[0], mods);
                        });
                    }
                    if (pInfo.bassRenderAmountOverride && pInfo.bassRenderAmountOverride.length > 0) {
                        modArr.push(function(mods) {
                            setMod("bassRenderAmountVar", "" + pInfo.bassRenderAmountOverride[0], mods);
                        });
                    }
                    if (pInfo.percussionRenderAmountOverride && pInfo.percussionRenderAmountOverride.length > 0) {
                        modArr.push(function(mods) {
                            setMod("percussionRenderAmountVar", "" + pInfo.percussionRenderAmountOverride[0], mods);
                        });
                    }
                    if (pInfo.harmonyRythmCountOverrides && pInfo.harmonyRythmCountOverrides.length > 0) {
                        modArr.push(function(mods) {
                            setMod("harmonyNoteCountVar", "" + pInfo.harmonyRythmCountOverrides[getPhraseGroupIndex(mods) % pInfo.harmonyRythmCountOverrides.length], mods);
                        });
                    }
                    if (pInfo.harmonyTotalLengthOverrides && pInfo.harmonyTotalLengthOverrides.length > 0) {

                        modArr.push(function(mods) {
                            setMod("harmonyTotalLengthVar", "" + pInfo.harmonyTotalLengthOverrides[getPhraseGroupIndex(mods) % pInfo.harmonyTotalLengthOverrides.length], mods);
                        });
                    }

                    if (pInfo.customMelodyCurveIndices && pInfo.customMelodyCurveIndices.length > 0) {
                        modArr.push(function(mods) {

                            var customIndex = pInfo.customMelodyCurveIndices[getPhraseGroupIndex(mods) % pInfo.customMelodyCurveIndices.length];

                            if (genInfo.customMelodyCurveInfos && genInfo.customMelodyCurveInfos.length > 0) {

                                if (customIndex > 0) {
                                    var curveInfo = genInfo.customMelodyCurveInfos[(customIndex - 1) % genInfo.customMelodyCurveInfos.length];

                                    curveInfo = copyObjectDeep(curveInfo); // To get access to member functions
                                    var curve = copyObjectDeep(curveInfo.getCurve());
                                    if (curve) {
//                                    logit(JSON.stringify(curve));
                                        setMod("melodyCurveAmplitudeVar", "" + curveInfo.amplitude, mods);
                                        setMod("melodyCurveBiasVar", "" + curveInfo.bias, mods);
                                        setMod("melodyCurveTypeVar", "" + curveInfo.type, mods);
                                        setMod("melodyCurveIdVar", "\"" + curve.id + "\"", mods);
                                        setMod("melodyCurveMultiplyAmpVar", "false", mods);
                                        module.addCurve(curve);
                                    }
                                }
                            }
                        });
                    }
                    if (pInfo.customBassCurveIndices && pInfo.customBassCurveIndices.length > 0) {
                        modArr.push(function(mods) {

                            var customIndex = pInfo.customBassCurveIndices[getPhraseGroupIndex(mods) % pInfo.customBassCurveIndices.length];

                            if (genInfo.customBassCurveInfos && genInfo.customBassCurveInfos.length > 0) {

                                if (customIndex > 0) {
                                    var curveInfo = genInfo.customBassCurveInfos[(customIndex - 1) % genInfo.customBassCurveInfos.length];

                                    curveInfo = copyObjectDeep(curveInfo); // To get access to member functions
                                    var curve = copyObjectDeep(curveInfo.getCurve());
                                    if (curve) {
//                                    logit(JSON.stringify(curve));
                                        setMod("bassCurveAmplitudeVar", "" + curveInfo.amplitude, mods);
                                        setMod("bassCurveBiasVar", "" + curveInfo.bias, mods);
                                        setMod("bassCurveTypeVar", "" + curveInfo.type, mods);
                                        setMod("bassCurveIdVar", "\"" + curve.id + "\"", mods);
                                        setMod("bassCurveMultiplyAmpVar", "false", mods);
                                        module.addCurve(curve);
                                    }
                                }
                            }
                        });
                    }

//                    if (pInfo.overridePhraseGroupType) {
//                        modArr.push(function(mods) {
//                            var indexInfo = findMod("indexInfoVar", mods);
//                            var index = indexInfo.phraseGroupIndex;
//
//                            var phraseTypes = [];
//                            getPhraseTypesFromGroupType(pInfo.phraseGroupType, phraseTypes);
//                            if (phraseTypes.length > 0) {
//                                setMod("harmonyPhraseTypeVar", "" + phraseTypes[index % phraseTypes.length], mods);
//                            }
//                        });
//                    }

                    if (pInfo.overrideScaleBaseNote) {
                        modArr.push(function(mods) {
                            setMod("harmonyScaleBaseVar", "" + pInfo.scaleBaseNote, mods);
                        });
                    }
                    if (pInfo.overrideScaleType) {
                        modArr.push(function(mods) {
                            setMod("scaleTypeVar", "" + pInfo.scaleType, mods);
                        });
                    }

                    if (pInfo.extraMelodyRenderElementIndices) {
                        modArr.push(function(mods) {
                            setMod("extraMelodyRenderElementIndicesVar", JSON.stringify(pInfo.extraMelodyRenderElementIndices), mods);
                        });
                    }
                    if (pInfo.extraInner1RenderElementIndices) {
                        modArr.push(function(mods) {
                            setMod("extraInner1RenderElementIndicesVar", JSON.stringify(pInfo.extraInner1RenderElementIndices), mods);
                        });
                    }
                    if (pInfo.extraInner2RenderElementIndices) {
                        modArr.push(function(mods) {
                            setMod("extraInner2RenderElementIndicesVar", JSON.stringify(pInfo.extraInner2RenderElementIndices), mods);
                        });
                    }
                    if (pInfo.extraBassRenderElementIndices) {
                        modArr.push(function(mods) {
                            setMod("extraBassRenderElementIndicesVar", JSON.stringify(pInfo.extraBassRenderElementIndices), mods);
                        });
                    }
                    if (pInfo.extraPercussionRenderElementIndices) {
                        modArr.push(function(mods) {
                            setMod("extraPercussionRenderElementIndicesVar", JSON.stringify(pInfo.extraPercussionRenderElementIndices), mods);
                        });
                    }

//                        ["harmonyMajorModulationTargetVar", "" + phraseInfo.majorModulationTarget],
//                        ["harmonyMinorModulationTargetVar", "" + phraseInfo.minorModulationTarget],


//                    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overrideMajorModulationTarget", "Override major modulation/tonicization target", false));
//                    result.addPropertyInfo(this.createEnumPropertyInfo("majorModulationTarget", "Major modulation/tonicization target", DynamicHarmonyModulationTarget.DOMINANT, DynamicHarmonyModulationTarget));
//                    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overrideMinorModulationTarget", "Override minor modulation/tonicization target", false));
//                    result.addPropertyInfo(this.createEnumPropertyInfo("minorModulationTarget", "Minor modulation/tonicization target", DynamicHarmonyModulationTarget.DOMINANT, DynamicHarmonyModulationTarget));


                    modifiers[j] = modArr;
                }
            })(partInfo);

            if (noMelody) {
//                logit("Adding no melody part");
                modifiers[j].push(function(mods) {
                    setMod("melodyRenderAmountVar", "0", mods);
                });
            }
        }

        if (prefixProbsOverride && prefixProbsOverride.length > 0) {
            prefixProbs = prefixProbsOverride;
        }
        if (postfixProbsOverride && postfixProbsOverride.length > 0) {
            postfixProbs = postfixProbsOverride;
        }



//        logit("Creating " + songPart + " " + groups.join(", "));

        addAll(groupModulates, createFilledArray(groups.length, groupModulationTarget >= 0));
        addAll(groupModulationTargets, createFilledArray(groups.length, groupModulationTarget));
        addAll(groupScaleBases, createFilledArray(groups.length, currentScaleBase));
        addAll(groupScaleTypes, createFilledArray(groups.length, currentScaleType));
        addAll(groupHarmonyElementIndices, createFilledArrayWithCopyValue(groups.length, partGroupHarmonyElementIndices));
        addAll(groupPattern, groups);
        addAll(groupRenderAmounts, amounts);
        addAll(groupRenderAmountSeeds, seeds);
        addAll(prefixGroupRenderAmountBiasMults, prefixRenderAmountBiasMults);
        addAll(postfixGroupRenderAmountBiasMults, postfixRenderAmountBiasMults);
        addAll(prefixGroupProbs, prefixProbs);
        addAll(postfixGroupProbs, postfixProbs);
        addAll(modifierFunctions, modifiers);


        if (groupModulationTarget >= 0) {
            var che = new ConstantHarmonyElement().setScaleType(currentScaleType).setBaseNote(currentScaleBase);
            currentScaleBase = che.getAbsoluteNoteFromScaleIndex(groupModulationTarget + 1);
            currentScaleType = DynamicHarmonyModulationTarget.getScaleType(currentScaleType, groupModulationTarget, false);
        }

        prevWasBridge = isBridge;
        prevWasVerse = isVerse;
        prevWasChorus = isChorus;
    }

    var finalScaleBase = currentScaleBase;
    var finalScaleType = currentScaleType;

//    logit("Group harmony elements " + JSON.stringify(groupHarmonyElementIndices));
//    logit("Group scale types " + groupScaleTypes.join(", "));
//    logit("Group mod targets " + groupModulationTargets.join(", "));
//    logit("Group pattern " + groupPattern.join(", "));
//    logit("Group render amounts " + groupRenderAmounts.join(", "));
//    logit("Group render amount seeds " + groupRenderAmountSeeds.join(", "));
//    logit("Group prefix bias mults " + prefixGroupRenderAmountBiasMults.join(", "));
//    logit("Group postfix bias mults " + postfixGroupRenderAmountBiasMults.join(", "));
//    logit("Group prefix probs " + prefixGroupProbs.join(", "));
//    logit("Group postfix probs " + postfixGroupProbs.join(", "));

    var harmonyElementIndices = [];

    var groupTypeMap = {};
    // logit("start index " + startIndex);
    var groupMajorModulationTargetMap = {};
    var groupMinorModulationTargetMap = {};
    var withinGroupSameInfosMap = {};

    var majorModulationTargetInfos = genInfo.majorModulationTargetInfos;
    var minorModulationTargetInfos = genInfo.minorModulationTargetInfos;

    var customGroupPhraseTypes = [];

    var isIntros = [];
    var isEnds = [];
    var isConnectGroups = [];
    var isPrefixGroups = [];
    var isPostfixGroups = [];
    var notConnectGroupIndices = [];
    var notConnectGroupCount = 0;

    var actualGroupIndex = 0;

    var groupTypes = [];
    var songPartTypes = [];

    var tempoFraction = tempo / 120;

    var tempoAdapt = tempoFraction * (genInfo.tempoAdaptBias + tempoRnd.random() * genInfo.tempoAdaptRandomMultiplier);
    if (!genInfo.adaptTempoToRenderAmount) {
        tempoAdapt = 0;
    }
    var phraseGroupRnd = createOrGetRandom(genInfo, "phraseGroupSeed");
    var tonicizationRnd = createOrGetRandom(genInfo, "tonicizationSeed");
    var phraseGroupSimilarityRnd = createOrGetRandom(genInfo, "phraseGroupSimilaritySeed");

    for (var i=0; i<groupPattern.length; i++) {
        var index = groupPattern[i];
        var groupType = groupTypeMap[index];

        var modifiers = modifierFunctions[i];

        var harmonyIndices = groupHarmonyElementIndices[i];

        var sptoInfo = null;
        for (var j=0; j<genInfo.songPartTypeOverrideInfos.length; j++) {
            var sptoTemp = genInfo.songPartTypeOverrideInfos[j];
            if (sptoTemp.partType == index) {
                sptoInfo = sptoTemp;
                break;
            }
        }

        var customPhraseTypes = [PhraseHarmonyElementType.INCOMPLETE, PhraseHarmonyElementType.COMPLETE];
        if (sptoInfo && sptoInfo.customPhraseTypes && sptoInfo.customPhraseTypes.length > 0) {
            customPhraseTypes = copyValueDeep(sptoInfo.customPhraseTypes);
            if (!customPhraseTypes) {
                logit("Failed to clone custom phrase types " + sptoInfo.customPhraseTypes.join(", "));
            }
//            logit("Using custom phrase types " + JSON.stringify(sptoInfo.customPhraseTypes) + " at " + i);
        }

//        var groupModulate = groupModulates[i];
        var groupModulationTarget = groupModulationTargets[i];
        var groupScaleType = groupScaleTypes[i];
        var groupScaleBase = groupScaleBases[i];

        var majorModulationTarget = groupMajorModulationTargetMap[index];
        var minorModulationTarget = groupMinorModulationTargetMap[index];


        var phraseModulate = false;
        if (groupModulationTarget >= 0) {
            var oldGroupType = groupType;
            majorModulationTarget = groupModulationTarget;
            minorModulationTarget = groupModulationTarget;
            groupType = sampleData(modulatePhraseGroupTypes, modulationRnd);
            if (groupType == SimpleModuleGeneratorPhraseGroupType.PHRASE_MODULATE) {
                groupType = oldGroupType;
                phraseModulate = true;
            }
        }

//        var scaleType = groupScaleTypeMap[index];
        var withinGroupSames = withinGroupSameInfosMap[index];

        var indicesForGroupType = groupIndices[index];
        if (!indicesForGroupType) {
            indicesForGroupType = [];
            groupIndices[index] = indicesForGroupType;
        }

        if (typeof(withinGroupSames) === 'undefined' || typeof(groupType) === 'undefined') {
            var sameCount = Math.floor(groupPropertyRndInfos.length *
                (genInfo.withinPhraseGroupSimilarBias + phraseGroupSimilarityRnd.random() * genInfo.withinPhraseGroupSimilarRandomFraction));
            var withinTempRndInfos = copyValueDeep(groupPropertyRndInfos);

            for (var j=0; j<alwaysSameWithinGroup.length; j++) {
                // We don't want to waste the sampling on stuff that are always same within the group
                withinTempRndInfos[alwaysSameWithinGroup[j]].likelihood = 0.0001;
            }

            withinGroupSames = sampleNDataWithoutReplacement(withinTempRndInfos, sameCount, phraseGroupSimilarityRnd, true);
            withinGroupSameInfosMap[index] = withinGroupSames;

            addAll(withinGroupSames, alwaysSameWithinGroup);

            // For groups that do not modulate, we keep track of the type of group so we get the same within the same index
            if (groupModulationTarget == -1 || phraseModulate) {
                var phraseGroupTypes = getPhraseGroupTypes(genInfo.tonicizeLikelihoodMultipliers[index % genInfo.tonicizeLikelihoodMultipliers.length]);
                groupType = sampleData(phraseGroupTypes, phraseGroupRnd);

                if (sptoInfo && sptoInfo.overridePhraseGroupType) {
                    groupType = sptoInfo.phraseGroupType;
//                    logit("Overriding group type for " + index)
                }

                majorModulationTarget = -1;
                minorModulationTarget = -1;
                //
                if (SimpleModuleGeneratorPhraseGroupType.tonicizeOrModulate(groupType)) {
                    majorModulationTarget = sampleData(majorModulationTargetInfos, tonicizationRnd);
                    minorModulationTarget = sampleData(minorModulationTargetInfos, tonicizationRnd);
                    if (sptoInfo && sptoInfo.overrideMajorModulationTarget) {
                        majorModulationTarget = sptoInfo.majorModulationTarget;
                    }
                    if (sptoInfo && sptoInfo.overrideMinorModulationTarget) {
                        minorModulationTarget = sptoInfo.minorModulationTarget;
                    }
                }
                groupMajorModulationTargetMap[index] = majorModulationTarget;
                groupMinorModulationTargetMap[index] = minorModulationTarget;
                groupTypeMap[index] = groupType;
            }
        }


        function addActualGroup(renderAmount, renderAmountSeed, scaleType, groupType, scaleBase, majorModTarget, minorModTarget, withinGroupSames, modifiers,
                                isConnect, isIntro, isEnd, numerator, modulationInvertScaleType, harmonyIndices, isPrefix, isPostfix) {
            if (!numerator) {
                numerator = 4;
            }

            if (typeof(groupType) === 'undefined') {
                logit("Adding undef actual group " + scaleType + " " + scaleBase + " " + majorModTarget + "/" + minorModTarget + " groupType: " + groupType + " connect: " + isConnect + " isIntro: " + isIntro + " isEnd: " + isEnd + " groupmodtarget: " + groupModulationTarget);
            }

            var groupTempo = tempo + tempoAdapt * renderAmount;

            if (!harmonyIndices) {
                harmonyIndices = [0];
            }

            harmonyElementIndices.push(harmonyIndices);
            renderAmounts.push(renderAmount);
            renderAmountSeeds.push(renderAmountSeed);
            numerators.push(numerator);
            scaleTypes.push(scaleType);
            groupTypes.push(groupType);
            songPartTypes.push(index);
            scaleBases.push(scaleBase);
            majorModulationTargets.push(majorModTarget);
            minorModulationTargets.push(minorModTarget);
            modulationInvertScaleTypes.push(!!modulationInvertScaleType);
            withinGroupSameInfos.push(copyValueDeep(withinGroupSames));
            groupModifierFunctions.push(modifiers);
            indicesForGroupType.push(actualGroupIndex);
            isConnectGroups.push(!!isConnect);
            isPrefixGroups.push(!!isPrefix);
            isPostfixGroups.push(!!isPostfix);
            notConnectGroupIndices.push(isConnect ? -1 : notConnectGroupCount);
            isEnds.push(isEnd);
            isIntros.push(isIntro);
            tempos.push(groupTempo);
            customGroupPhraseTypes.push(customPhraseTypes);

            if (!isConnect) {
                notConnectGroupCount++;
            }
            actualGroupIndex++;
        }

        function addGlueGroup(scaleType, scaleBase, majorModTarget, minorModTarget, withinGroupSames, renderAmountBias, renderAmountMult, isPrefix, isPostfix) {
            var glueGroupType = sampleData(glueGroupTypes, glueRnd);

            var glueHarmonyCount =
                glueGroupType == SimpleModuleGeneratorPhraseGroupType.SINGLE_TONIC_PROLONG ?
                    2 + Math.floor(glueRnd.random() * 4) :
                    4 + Math.floor(glueRnd.random() * 3);

            var isProlong = glueGroupType == SimpleModuleGeneratorPhraseGroupType.SINGLE_TONIC_PROLONG;
            var glueHarmonyCount = sampleData([
                {data: 1, likelihood: isProlong ? 1    : 0},
                {data: 2, likelihood: isProlong ? 1    : 0},
                {data: 3, likelihood: isProlong ? 1    : 0},
                {data: 4, likelihood: isProlong ? 0.5  : 1},
                {data: 5, likelihood: isProlong ? 0.25 : 1},
                {data: 6, likelihood: isProlong ? 0    : 1}
            ], glueRnd);

            var glueLength = sampleData([
                {data: 1, likelihood: tempo < 90 ? 6 : 3},
                {data: 2, likelihood: 1}], glueRnd);

            if (numerator == 2) {
                glueLength *= 2;
            }

            if (glueGroupType == SimpleModuleGeneratorPhraseGroupType.SINGLE_SILENT) {
                switch (numerator) {
                    case 2:
                        glueLength = sampleData([
                            {data: 0.5, likelihood: tempo < 90 ? 0.5 : 1},
                            {data: 1, likelihood: tempo < 90 ? 0.25 : 0.5}], glueRnd);
                        break;
                    case 3:
                        glueLength = sampleData([
                            {data: 1.0/3.0, likelihood: tempo < 90 ? 1 : 0.25},
                            {data: 2.0/3.0, likelihood: tempo < 90 ? 0.5 : 1},
                            {data: 1, likelihood: tempo < 90 ? 0.25 : 0.5}], glueRnd);
                        break;
                    case 4:
                        glueLength = sampleData([
                            {data: 0.25, likelihood: tempo < 90 ? 1 : 0.25},
                            {data: 0.5, likelihood: tempo < 90 ? 0.5 : 1},
                            {data: 1, likelihood: tempo < 90 ? 0.25 : 0.5}], glueRnd);
                        break;
                    default:
                        glueLength = 0.5;
                }
//                glueLength = 1;
                glueHarmonyCount = 1;
            }


            var glueRenderAmount = renderAmountBias + renderAmountMult * glueRnd.random();
            var glueMelodyOn = false; // rnd.random() < 0.2;
            addActualGroup(glueRenderAmount, glueRnd.genrand_int31(), scaleType, glueGroupType, scaleBase, majorModTarget, minorModTarget, withinGroupSames,
                [function(mods) {
                    setMod("harmonyNoteCountVar", "" + glueHarmonyCount, mods);
                    setMod("harmonyTotalLengthVar", "" + glueLength, mods);
                    setMod("harmonyRythmLengthTypeVar", "" + (numerator == 3 ? NoteRythmElementLengthType.DOT : NoteRythmElementLengthType.NORMAL), mods);
                    setMod("melodyRenderAmountVar", "" + 0, mods);
                }], true, false, false, numerator, false, harmonyIndices, isPrefix, isPostfix);
        }

        if (i == 0 && hasIntro) {
//            logit("Adding intro");
            addActualGroup(introRenderAmount, introRnd.genrand_int31(), groupScaleType, introGroupType, groupScaleBase, -1, -1, withinGroupSames,
                [function(mods) {
                    setMod("harmonyNoteCountVar", "" + introHarmonyCount, mods);
                    setMod("harmonyTotalLengthVar", "" + introLength, mods);
                    setMod("harmonyRythmLengthTypeVar", "" + (numerator == 3 ? NoteRythmElementLengthType.DOT : NoteRythmElementLengthType.NORMAL), mods);
                    setMod("melodyRenderAmountVar", "" + (introMelodyOn ? 1.0 : 0.0), mods);
                }], false, true, false, numerator, false, [0]);
        }


        var hasPrefixGlue = glueRnd.random() < prefixGroupProbs[i];
        if (hasPrefixGlue) {
            var biasMult = prefixGroupRenderAmountBiasMults[i];
            addGlueGroup(groupScaleType, groupScaleBase, -1, -1, withinGroupSames, biasMult[0], biasMult[1], true, false);
        }

//        var modifiers = [];

//        logit("Adding acutal group with modifers ");
//        logit(modifiers);

        if (groupType == SimpleModuleGeneratorPhraseGroupType.CUSTOM) {
            if (customPhraseTypes) {
                for (var k=0; k<customPhraseTypes.length; k++) {
                    switch (customPhraseTypes[k]) {
                        case PhraseHarmonyElementType.COMPLETE_MODULATE:
                        case PhraseHarmonyElementType.COMPLETE_MODULATE_IMPERFECT:
                        case PhraseHarmonyElementType.COMPLETE_TONICIZE:
                        case PhraseHarmonyElementType.COMPLETE_TONICIZE_IMPERFECT:
                        case PhraseHarmonyElementType.CHROMATIC_TRANSITION_MODULATE:
                        case PhraseHarmonyElementType.CHROMATIC_TRANSITION_TONICIZE:
                            majorModulationTarget = sampleData(majorModulationTargetInfos, tonicizationRnd);
                            minorModulationTarget = sampleData(minorModulationTargetInfos, tonicizationRnd);
                            if (sptoInfo && sptoInfo.overrideMajorModulationTarget) {
                                majorModulationTarget = sptoInfo.majorModulationTarget;
                            }
                            if (sptoInfo && sptoInfo.overrideMinorModulationTarget) {
                                minorModulationTarget = sptoInfo.minorModulationTarget;
                            }
                            break;
                    }
                }
            } else {
                logit("Could not find any custom phrase types");
            }
        }

        addActualGroup(groupRenderAmounts[i], groupRenderAmountSeeds[i], groupScaleType, groupType, groupScaleBase, majorModulationTarget, minorModulationTarget, withinGroupSames,
            modifiers, false, false, false, numerator, false, harmonyIndices);


        var hasPostfixGlue = glueRnd.random() < postfixGroupProbs[i];
        if (hasPostfixGlue) {
            var postfixScaleType = groupScaleType;
            var postfixScaleBase = groupScaleBase;
            if (i + 1 < groupPattern.length) {
                postfixScaleType = groupScaleTypes[i+1];
                postfixScaleBase = groupScaleBases[i+1];
            }
            var biasMult = postfixGroupRenderAmountBiasMults[i];
            addGlueGroup(postfixScaleType, postfixScaleBase, -1, -1, withinGroupSames, biasMult[0], biasMult[1], false, true);
        }

        if (i == groupPattern.length - 1 && hasEnd) {
//            logit("Adding end");
            addActualGroup(endRenderAmount, endRnd.genrand_int31(), finalScaleType, endGroupType, finalScaleBase, -1, -1, withinGroupSames,
                [function(mods) {
                    setMod("harmonyNoteCountVar", "" + endHarmonyCount, mods);
                    setMod("harmonyTotalLengthVar", "" + endLength, mods);
                    setMod("harmonyRythmLengthTypeVar", "" + (numerator == 3 ? NoteRythmElementLengthType.NORMAL : NoteRythmElementLengthType.NORMAL), mods);
                    setMod("melodyRenderAmountVar", "" + (endMelodyOn ? 1.0 : 0.0), mods);
                }], false, false, true, numerator, false);
        }
    }

//    logit("harmony element indices: " + JSON.stringify(harmonyElementIndices));

    // Create differences and sames between groups
    // Groups with the same group type index are supposed to be very similar while groups with different group type indices should
    // be different instead.

//    logit("groupIndices: " + JSON.stringify(groupIndices));



    // Sample what should be the same for groups with the same group type index

    var groupSimilarityRnd = createOrGetRandom(genInfo, "groupSimilaritySeed");
    var groupDifferenceRnd = createOrGetRandom(genInfo, "groupDifferenceSeed");


    var groupSameInfos = [];
    for (var groupTypeIndex in groupTypeMap) {
        var groupType = groupTypeMap[groupTypeIndex];
        groupTypeIndex = parseInt(groupTypeIndex);
        var sameGroupTypeIndices = groupIndices[groupTypeIndex];
        if (sameGroupTypeIndices.length > 1) {
            var rndInfosCopy = copyValueDeep(groupPropertyRndInfos);
            var sameCount = Math.floor(groupPropertyRndInfos.length * (genInfo.samePhraseGroupIndexSimilarBias +
                genInfo.samePhraseGroupIndexSimilarRandomFraction * groupSimilarityRnd.random()));
            var sames = sampleNDataWithoutReplacement(rndInfosCopy, sameCount, groupSimilarityRnd, true);
            var info = {
                groupIndices: sameGroupTypeIndices,
                properties: sames
            };
            groupSameInfos.push(info);

            var extraSames = groupTypePropertySames[groupType];
            if (extraSames) {
                groupSameInfos.push({groupIndices: sameGroupTypeIndices, properties: extraSames});
            }

            extraSames = groupIndexPropertySames[groupTypeIndex];
            if (extraSames) {
                groupSameInfos.push({groupIndices: sameGroupTypeIndices, properties: extraSames});
            }
        }
    }



//    logit("groupSameInfos: " + JSON.stringify(groupSameInfos));


    // Sample what should be different between groups with different group type indices
    var groupDifferentInfos = [];
    for (var groupTypeIndex1 in groupTypeMap) {
        groupTypeIndex1 = parseInt(groupTypeIndex1);
        var sameGroupTypeIndices1 = groupIndices[groupTypeIndex1];
        for (var groupTypeIndex2 in groupTypeMap) {
            groupTypeIndex2 = parseInt(groupTypeIndex2);

            if (groupTypeIndex2 > groupTypeIndex1) {
                var sameGroupTypeIndices2 = groupIndices[groupTypeIndex2];

                // For each pair of the actual indices, add a
                var rndInfosCopy = copyValueDeep(groupPropertyRndInfos);
                var diffCount = Math.floor(groupPropertyRndInfos.length * (genInfo.differentPhraseGroupIndexDifferentBias +
                    genInfo.differentPhraseGroupIndexDifferentRandomFraction * groupDifferenceRnd.random()));
                var diffs = sampleNDataWithoutReplacement(rndInfosCopy, diffCount, groupDifferenceRnd, true);

                for (var i=0; i<sameGroupTypeIndices1.length; i++) {
                    for (var j=0; j<sameGroupTypeIndices2.length; j++) {
                        var info = {
                            groupIndices: [sameGroupTypeIndices1[i], sameGroupTypeIndices2[j]],
                            properties: diffs
                        };
                        groupDifferentInfos.push(info);
                    }
                }
            }
        }
    }


    var phraseGroupInfo = {
        baseTempo: tempo,
        propertyNameCounts: propertyNameCounts,
        groupTypes: groupTypes,
        songPartTypes: songPartTypes,
        customPhraseTypes: customGroupPhraseTypes,
        groupRenderAmounts: renderAmounts,
        groupRenderAmountSeeds: renderAmountSeeds,
        groupNumerators: numerators,
        groupTempos: tempos,
        groupHarmonyElementIndices: harmonyElementIndices,
        groupScaleTypes: scaleTypes,
        groupScaleBaseNotes: scaleBases,
        groupMajorModulationTargets: majorModulationTargets,
        groupMinorModulationTargets: minorModulationTargets,
        groupModulationInvertScaleTypes: modulationInvertScaleTypes,
        alwaysSameInfos: [ // Some properties are paired such as motif distribution indices for proper sharing of melody line
            [PhraseGroupIndexProperty.MELODY_MOTIF_DISTRIBUTION, PhraseGroupIndexProperty.INNER_1_MOTIF_DISTRIBUTION]
        ],
        withinGroupSameInfos: withinGroupSameInfos,
        withinGroupDifferentInfos: withinGroupDifferentInfos,
        groupSameInfos: groupSameInfos,
        groupDifferentInfos: groupDifferentInfos,
        groupModifierFunctions: groupModifierFunctions,
        notConnectGroupIndices: notConnectGroupIndices,
        isConnectGroups: isConnectGroups,
        isPrefixGroups: isPrefixGroups,
        isPostfixGroups: isPostfixGroups,
        isIntros: isIntros,
        isEnds: isEnds
    };

//    logit(JSON.stringify(phraseGroupInfo));
//    logit(phraseGroupInfo);

    return phraseGroupInfo;
}

function intersectDomains(dom1, dom2) {
    var result = {};
    for (var d1 in dom1) {
        if (dom2[d1]) {
            result[d1] = true;
        }
    }
    return result;
}

function checkConstraints(propIndex, ssInfo, pgInfo, domains, depth, groupSameArrs, groupDifferentArrs,
                          withinSameGroupIndices, withinDifferentGroupIndices) {
    var wrongCount = 0;

//    var thisValue = domains[depth][0];

//    logit("Current domain: " + JSON.stringify(domains[depth]) + " depth: " + depth + " groupIndex: " + ssInfo.groupIndices[depth]);

    var currentGroupIndex = ssInfo.groupIndices[depth];
    var currentIndicesForGroup = ssInfo.indicesForGroups[currentGroupIndex];

    var lastInGroup = currentIndicesForGroup[currentIndicesForGroup.length - 1] == depth;

    for (var k=0; k<groupSameArrs.length; k++) {
        var groupSames = groupSameArrs[k];
        if (arrayContains(groupSames, currentGroupIndex)) {
            // This group is involved in a constraint

            // Only check the constraints when we are at the end of the group, then we know that all values have been set in both groups
            if (lastInGroup) {
                for (var i=0; i<groupSames.length; i++) {
                    var otherGroupIndex = groupSames[i];
                    if (otherGroupIndex < currentGroupIndex) {
                        var otherIndicesForGroup = ssInfo.indicesForGroups[otherGroupIndex];

                        // We know that we have values for the other group since the group index is lower

                        for (var j=0; j<Math.min(currentIndicesForGroup.length, otherIndicesForGroup.length); j++) {
                            var currentIndex = currentIndicesForGroup[j];
                            var otherIndex = otherIndicesForGroup[j];
                            if (domains[currentIndex][0] != domains[otherIndex][0]) {
//                                logit("Need to backtrack because the domains for indices " + currentIndicesForGroup.join(",") + " must be same as for " + otherIndicesForGroup.join(",") );
//                            logit("Need to backtrack because domains[" + currentIndex + "][0] was different from domains[" + otherIndex + "][0]");
                                wrongCount++; // We need to backtrack
                            }
                        }
                    }
                }
            }
        }
    }
    for (var k=0; k<groupDifferentArrs.length; k++) {
        var groupDifferents = groupDifferentArrs[k];
        if (arrayContains(groupDifferents, currentGroupIndex)) {
            // This group is involved in a constraint

            // Only check the constraints when we are at the end of the group, then we know that all values have been set in both groups
            if (lastInGroup) {
                for (var i=0; i<groupDifferents.length; i++) {
                    var otherGroupIndex = groupDifferents[i];
                    if (otherGroupIndex < currentGroupIndex) {
                        var otherIndicesForGroup = ssInfo.indicesForGroups[otherGroupIndex];

                        // We know that we have values for the other group since the group index is lower

                        var allSame = true;
                        for (var j=0; j<Math.min(currentIndicesForGroup.length, otherIndicesForGroup.length); j++) {
                            var currentIndex = currentIndicesForGroup[j];
                            var otherIndex = otherIndicesForGroup[j];
                            if (domains[currentIndex][0] != domains[otherIndex][0]) {
                                allSame = false; // At least one difference, it is OK!
                            }
                        }
                        if (allSame) {
//                            logit("Need to backtrack because the domains for indices " + currentIndicesForGroup.join(",") + " must be different for " + otherIndicesForGroup.join(",") );
                            wrongCount++;
                        }
                    }
                }
            }
        }
    }

    if (lastInGroup) {
        if (arrayContains(withinSameGroupIndices, currentGroupIndex)) {
            // The group should have the same
            var startIndex = currentIndicesForGroup[0];
            var value = domains[startIndex][0];
            for (var i=1; i<currentIndicesForGroup.length; i++) {
                if (domains[currentIndicesForGroup[i]][0] != value) {
//                    logit("Need to backtrack because not same within group " + currentIndicesForGroup.join(", "));
                    wrongCount++; // Not all same within group
                }
            }
        }
        if (arrayContains(withinDifferentGroupIndices, currentGroupIndex)) {
            // The group should have the same
            var startIndex = currentIndicesForGroup[0];
            var value = domains[startIndex][0];
            var allSame = true;
            for (var i=1; i<currentIndicesForGroup.length; i++) {
                if (domains[currentIndicesForGroup[i]][0] != value) {
                    allSame = false; // Not all same within group
                    break;
                }
            }
            if (allSame) {
//                logit("Need to backtrack because not same within group " + currentIndicesForGroup.join(", "));
            }
        }
    }

    return wrongCount;
}


function assignPropertyIndexArrayRec(propIndex, ssInfo, pgInfo, domains, depth, groupSames, groupDifferents,
                                     withinSameGroupIndices, withinDifferentGroupIndices, searchInfo) {
    if (depth >= ssInfo.phraseTypes.length) {
        if (searchInfo.currentSolutionCost < searchInfo.bestSolutionCost) {
            searchInfo.bestSolutionCost = searchInfo.currentSolutionCost;
            searchInfo.bestSolution = domains;
        }
        if (searchInfo.bestSolution == null) {
            searchInfo.bestSolution = domains;
        }
        return domains;
    }
    var result = null;

    var domain = domains[depth];
    for (var i=0; i<domain.length; i++) {
        searchInfo.expansions++;

        // logit("Testing " + domain[i] + " on depth " + depth);
//        logit(searchInfo.expansions + " depth: " + depth);
        if (searchInfo.expansions > searchInfo.maxExpansions) {
//            logit("Reached max number of search node expansions in assignPropertyIndexArrayRec()");
            break;
        }
        var domainsCopy = copyValueDeep(domains);
        domainsCopy[depth] = [domain[i]];
        var wrongCount = checkConstraints(propIndex, ssInfo, pgInfo, domainsCopy, depth, groupSames, groupDifferents,
            withinSameGroupIndices, withinDifferentGroupIndices);
        if (wrongCount + searchInfo.currentSolutionCost < searchInfo.bestSolutionCost) {
            // We can search deeper
            searchInfo.currentSolutionCost += wrongCount;
            var tempResult = assignPropertyIndexArrayRec(propIndex, ssInfo, pgInfo, domainsCopy, depth + 1, groupSames, groupDifferents,
                withinSameGroupIndices, withinDifferentGroupIndices, searchInfo);
            searchInfo.currentSolutionCost -= wrongCount;
            if (tempResult) {
                result = tempResult;
                if (searchInfo.bestSolutionCost < 0.01) {
                    break;
                }
            }
        }
    }
    return result;
}

function assignPropertyIndexArray(propIndex, ssInfo, pgInfo, rnd) {


    var maxExpansions = 100;

    var found = false;
    while (!found && maxExpansions < 20000) {

        var searchInfo = {expansions: 0, maxExpansions: maxExpansions, bestSolution: null, bestSolutionCost: 1, currentSolutionCost: 0};

        var propCount = pgInfo.propertyNameCounts[propIndex];
        var propName = propCount[0];
        var domainSize = propCount[1];

        // logit("assigning array for " + propName + " domain size: " + domainSize);
        var domains = [];

        for (var i=0; i<ssInfo.phraseTypes.length; i++) {
            var domain = createFilledNumericIncArray(domainSize, 0, 1);
            arrayShuffle(domain, rnd);
            domains.push(domain);
        }

        var groupSames = [];
        for (var i=0; i<pgInfo.groupSameInfos.length; i++) {
            var groupSameInfo = pgInfo.groupSameInfos[i];
            var arr = [];
            if (arrayContains(groupSameInfo.properties, propIndex)) {
                addAll(arr, groupSameInfo.groupIndices);
                groupSames.push(arr);
            }
        }
        var groupDifferents = [];
        for (var i=0; i<pgInfo.groupDifferentInfos.length; i++) {
            var groupDifferentInfo = pgInfo.groupDifferentInfos[i];
            var arr = [];
            if (arrayContains(groupDifferentInfo.properties, propIndex)) {
                addAll(arr, groupDifferentInfo.groupIndices);
                groupDifferents.push(arr);
            }
        }
        var withinSameGroupIndices = [];
        for (var i=0; i<pgInfo.withinGroupSameInfos.length; i++) {
            var withinSameArr = pgInfo.withinGroupSameInfos[i];
            if (arrayContains(withinSameArr, propIndex)) {
                withinSameGroupIndices.push(i);
            }
        }
        var withinDifferentGroupIndices = [];
        for (var i=0; i<pgInfo.withinGroupDifferentInfos.length; i++) {
            var withinDifferentArr = pgInfo.withinGroupDifferentInfos[i];
            if (arrayContains(withinDifferentArr, propIndex)) {
                withinDifferentGroupIndices.push(i);
            }
        }

//    logit("Group sames: " + JSON.stringify(groupSames));
//    logit("Group diff: " + JSON.stringify(groupDifferents));

        var resultDomains = assignPropertyIndexArrayRec(propIndex, ssInfo, pgInfo, domains, 0, groupSames, groupDifferents,
            withinSameGroupIndices, withinDifferentGroupIndices, searchInfo);
        if (searchInfo.bestSolution) {
//            logit("Found solution for " + propName + " " + searchInfo.bestSolutionCost + " expansions: " + searchInfo.expansions);
            for (var i=0; i<resultDomains.length; i++) {
                var value = resultDomains[i][0];
                ssInfo[propName][i] = value;
            }
            found = true;
        } else {
            maxExpansions *= 2;
            found = false;
//            logit("Failed, testing with " + maxExpansions);
        }
    }
    if (!found) {
        logit("Unable to find solution for " + propName);
        for (var i=0; i<ssInfo.phraseTypes.length; i++) {
            var groupIndex = ssInfo.songPartTypes[i % ssInfo.songPartTypes.length];
            ssInfo[propName][i] = groupIndex % ssInfo.phraseTypes.length;
        }
    }

    // logit(resultDomains);
}

function assignPropertyIndexArrays(ssInfo, pgInfo, rnd, genInfo) {

    var done = [];

    for (var i=0; i<pgInfo.propertyNameCounts.length; i++) {
        if (!done[i]) {

            var propRnd = pgInfo.propertyNameCounts[i][2];
            assignPropertyIndexArray(i, ssInfo, pgInfo, propRnd);

            // Check if we can automatically write the result for some other property that should be exactly the same
            for (var j=0; j<pgInfo.alwaysSameInfos.length; j++) {
                var sameArr = pgInfo.alwaysSameInfos[j];
                if (arrayContains(sameArr, i)) {
                    for (var k=0; k<sameArr.length; k++) {
                        var otherIndex = sameArr[k];
                        if (otherIndex != i) {
                            var propCount = pgInfo.propertyNameCounts[i];
                            var propName = propCount[0];
                            var otherPropCount = pgInfo.propertyNameCounts[otherIndex];
                            var otherPropName = otherPropCount[0];
                            ssInfo[otherPropName] = copyValueDeep(ssInfo[propName]);
                            done[otherIndex] = true;
                        }
                    }
                }
            }
            done[i] = true;
        }
    }


//    logit(JSON.stringify(ssInfo.songPartTypes) + " and " + JSON.stringify(ssInfo.phraseTypes));

    // Overriding indices
    for (var i=0; i<pgInfo.propertyNameCounts.length; i++) {
        var propCount = pgInfo.propertyNameCounts[i];
        var propName = propCount[0];
        var indexOverridePropName = propName.substring(0, propName.indexOf("Indices")) + "IndexOverride";

//        logit("p: " + indexOverridePropName);

        var prevPartType = -1;
        var partTypeCounter = 0;
        for (var k=0; k<ssInfo.phraseTypes.length; k++) {
            var partType = ssInfo.songPartTypes[k];
            if (partType == prevPartType) {
                partTypeCounter++;
            } else {
                partTypeCounter = 0;
            }
            prevPartType = partType;
            for (var j=0; j<genInfo.songPartTypeOverrideInfos.length; j++) {
                var info = genInfo.songPartTypeOverrideInfos[j];
                if (info.partType == partType) {
                    var propValue = info[indexOverridePropName];
                    if (propValue && propValue.length > 0) {
                        var newIndex = propValue[partTypeCounter % propValue.length];
//                        logit("Overwriting indices " + propName + " " + indexOverridePropName + " " + partType + " " + newIndex);
                        ssInfo[propName][k] = newIndex;
                    } else if (typeof(propValue) === 'undefined') {
                        logit("Could not find index override prop " + indexOverridePropName);
                    }
//                logit("maybe Using override in index set stuff " + info.partType);
                }
            }
        }
    }


    ssInfo.phraseTypeIndices = [];
    for (var i=0; i<ssInfo.phraseTypes.length; i++) {
        ssInfo.phraseTypeIndices[i] = i;
        ssInfo.harmonyIndices[i] = i;
        ssInfo.tempoIndices[i] = i;
        ssInfo.renderAmountIndices[i] = i;
    }

}

function getPhraseTypesFromGroupType(groupType, phraseTypes, custom) {

    if (!custom) {
        custom = [PhraseHarmonyElementType.INCOMPLETE, PhraseHarmonyElementType.COMPLETE];
    }

    switch (groupType) {
        case SimpleModuleGeneratorPhraseGroupType.SINGLE_CUSTOM_HARMONY:
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.DOUBLE_CUSTOM_HARMONY:
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.CUSTOM:
            addAll(phraseTypes, custom);
            break;
        case SimpleModuleGeneratorPhraseGroupType.SINGLE_SILENT:
            phraseTypes.push(PhraseHarmonyElementType.PROLONGED_TONIC);
            break;
        case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLAGIAL_PLUS_COMPLETE:
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_PLAGIAL);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_COMPLETE_PLAGIAL:
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_PLAGIAL);
            break;
        case SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE_PLAGIAL:
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_PLAGIAL);
            break;
        case SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_DOMINANT_PROLONG_PLUS_TONIC_CADENCE_PROLONG:
            phraseTypes.push(PhraseHarmonyElementType.PROLONGED_TONIC);
            phraseTypes.push(PhraseHarmonyElementType.PROLONGED_DOMINANT);
            phraseTypes.push(PhraseHarmonyElementType.PROLONGED_TONIC_COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_DOMINANT_PROLONG_PLUS_COMPLETE:
            phraseTypes.push(PhraseHarmonyElementType.PROLONGED_TONIC);
            phraseTypes.push(PhraseHarmonyElementType.PROLONGED_DOMINANT);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_DOMINANT_PROLONG:
            phraseTypes.push(PhraseHarmonyElementType.INCOMPLETE);
            phraseTypes.push(PhraseHarmonyElementType.PROLONGED_DOMINANT);
            break;
        case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_DOMINANT_PROLONG_CADENCE:
            phraseTypes.push(PhraseHarmonyElementType.INCOMPLETE);
            phraseTypes.push(PhraseHarmonyElementType.PROLONGED_DOMINANT_CADENCE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_DOMINANT_PROLONG_CADENCE:
            phraseTypes.push(PhraseHarmonyElementType.PROLONGED_TONIC);
            phraseTypes.push(PhraseHarmonyElementType.PROLONGED_DOMINANT_CADENCE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_DOMINANT_PROLONG:
            phraseTypes.push(PhraseHarmonyElementType.PROLONGED_TONIC);
            phraseTypes.push(PhraseHarmonyElementType.PROLONGED_DOMINANT);
            break;
        case SimpleModuleGeneratorPhraseGroupType.TONIC_PROLONG_PLUS_COMPLETE:
            phraseTypes.push(PhraseHarmonyElementType.PROLONGED_TONIC);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.SINGLE_TONIC_PROLONG:
            phraseTypes.push(PhraseHarmonyElementType.PROLONGED_TONIC);
            break;
        case SimpleModuleGeneratorPhraseGroupType.SINGLE_INCOMPLETE:
            phraseTypes.push(PhraseHarmonyElementType.INCOMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE:
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.SINGLE_COMPLETE_IMPERFECT:
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_IMPERFECT);
            break;
        case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE:
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_MODULATE);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE:
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_MODULATE);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_TONICIZE:
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_MODULATE_IMPERFECT);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_MODULATE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_MODULATE_BACK:
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_MODULATE);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_MODULATE);
            // logit(scaleTypes + " " + majorModulationTargets + " " + minorModulationTargets + " " + scaleBaseNotes);
            break;
        case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_MODULATE:
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_IMPERFECT);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_MODULATE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_PHRASE_MODULATE:
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_MODULATE:
            phraseTypes.push(PhraseHarmonyElementType.INCOMPLETE);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_MODULATE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_COMPLETE_DIFFERENT_SCALE_TYPE:
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT:
            phraseTypes.push(PhraseHarmonyElementType.INCOMPLETE);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT_SHORTEN:
            phraseTypes.push(PhraseHarmonyElementType.INCOMPLETE);
            phraseTypes.push(PhraseHarmonyElementType.CONSEQUENT);
            break;
        case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_COMPLETE:
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_IMPERFECT);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_COMPLETE:
            phraseTypes.push(PhraseHarmonyElementType.INCOMPLETE);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_COMPLETE_IMPERFECT:
            phraseTypes.push(PhraseHarmonyElementType.INCOMPLETE);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_IMPERFECT);
            break;
        case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_INITIAL_PLUS_COMPLETE:
            phraseTypes.push(PhraseHarmonyElementType.INCOMPLETE_INITIAL);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_INITIAL_PLUS_COMPLETE_LENGTHEN_DOMINANT:
            phraseTypes.push(PhraseHarmonyElementType.INCOMPLETE_INITIAL);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_LENGTHEN_DOMINANT);
            break;
        case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_INITIAL_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
            phraseTypes.push(PhraseHarmonyElementType.INCOMPLETE_INITIAL);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_LENGTHEN_FINAL_TONIC);
            break;
        case SimpleModuleGeneratorPhraseGroupType.DECEPTIVE_PLUS_COMPLETE:
            phraseTypes.push(PhraseHarmonyElementType.DECEPTIVE);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_DECEPTIVE:
            phraseTypes.push(PhraseHarmonyElementType.INCOMPLETE);
            phraseTypes.push(PhraseHarmonyElementType.DECEPTIVE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.DECEPTIVE_PLUS_DECEPTIVE:
            phraseTypes.push(PhraseHarmonyElementType.DECEPTIVE);
            phraseTypes.push(PhraseHarmonyElementType.DECEPTIVE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.COMPLETE_IMPERFECT_PLUS_DECEPTIVE:
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_IMPERFECT);
            phraseTypes.push(PhraseHarmonyElementType.DECEPTIVE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_DECEPTIVE:
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_MODULATE);
            phraseTypes.push(PhraseHarmonyElementType.DECEPTIVE);
            break;
        case SimpleModuleGeneratorPhraseGroupType.COMPLETE_IMPERFECT_PLUS_COMPLETE_LENGTHEN_DOMINANT:
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_IMPERFECT);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_LENGTHEN_DOMINANT);
            break;
        case SimpleModuleGeneratorPhraseGroupType.COMPLETE_IMPERFECT_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_IMPERFECT);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_LENGTHEN_FINAL_TONIC);
            break;
        case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_COMPLETE_LENGTHEN_DOMINANT:
            phraseTypes.push(PhraseHarmonyElementType.INCOMPLETE);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_LENGTHEN_DOMINANT);
            break;
        case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
            phraseTypes.push(PhraseHarmonyElementType.INCOMPLETE);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_LENGTHEN_FINAL_TONIC);
            break;
        case SimpleModuleGeneratorPhraseGroupType.DECEPTIVE_PLUS_COMPLETE_LENGTHEN_DOMINANT:
            phraseTypes.push(PhraseHarmonyElementType.DECEPTIVE);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_LENGTHEN_DOMINANT);
            break;
        case SimpleModuleGeneratorPhraseGroupType.DECEPTIVE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
            phraseTypes.push(PhraseHarmonyElementType.DECEPTIVE);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_LENGTHEN_FINAL_TONIC);
            break;
        case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE_LENGTHEN_DOMINANT:
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_MODULATE);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_LENGTHEN_DOMINANT);
            break;
        case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_MODULATE);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_LENGTHEN_FINAL_TONIC);
            break;
        case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE_LENGTHEN_DOMINANT:
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_TONICIZE);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_LENGTHEN_DOMINANT);
            break;
        case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_TONICIZE);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_LENGTHEN_FINAL_TONIC);
            break;
        case SimpleModuleGeneratorPhraseGroupType.SINGLE_DECEPTIVE:
            phraseTypes.push(PhraseHarmonyElementType.DECEPTIVE);
            break;
        default:
            logit("Unknown group type " + groupType);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE_IMPERFECT);
            phraseTypes.push(PhraseHarmonyElementType.COMPLETE);
            break;
    }


}

function createSongStructureInfo(rnd, genInfo, module) {

    // SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT

    var phraseGroupInfo = createPhraseGroupInfo(rnd, genInfo, module);

    var ssInfo = {
        baseTempo: phraseGroupInfo.baseTempo,

        songPartTypes: [],

        phraseTypes: [],
        groupIndices: [],
        indicesForGroups: [], // the real indices for all groups

        renderAmounts: [],
        renderAmountSeeds: [],
        numerators: [],
        tempos: [],
        scaleTypes: [],
        scaleBaseNotes: [],
        harmonyElementIndices: [],
        minorModulationTargets: [],
        majorModulationTargets: [],

        indexInfos: [],
        modifierFunctions: []
    };

//    logit("Group types: " + JSON.stringify(phraseGroupInfo.groupTypes) + " song part types: " + JSON.stringify(phraseGroupInfo.songPartTypes));


    for (var i=0; i<phraseGroupInfo.groupTypes.length; i++) {
        var groupType = phraseGroupInfo.groupTypes[i];
        var songPartType = phraseGroupInfo.songPartTypes[i];

        var customPhraseTypes = phraseGroupInfo.customPhraseTypes[i];
        var sizeBefore = ssInfo.phraseTypes.length;


        // The following procedure is because of some phrase group types change the scale in the second phrase etc.
        var renderAmount = phraseGroupInfo.groupRenderAmounts[i];
        var renderAmountSeed = phraseGroupInfo.groupRenderAmountSeeds[i];
        var scaleType = phraseGroupInfo.groupScaleTypes[i];
        var tempo = phraseGroupInfo.groupTempos[i];
        var scaleBaseNote = phraseGroupInfo.groupScaleBaseNotes[i];
        var harmonyElementIndices = phraseGroupInfo.groupHarmonyElementIndices[i];
        var majorModulationTarget = phraseGroupInfo.groupMajorModulationTargets[i];
        var minorModulationTarget = phraseGroupInfo.groupMinorModulationTargets[i];
        var invertScaleType = phraseGroupInfo.groupModulationInvertScaleTypes[i];
        var modifierFunctionArr = phraseGroupInfo.groupModifierFunctions[i];
        var numerator = phraseGroupInfo.groupNumerators[i];
        var isConnectGroup = phraseGroupInfo.isConnectGroups[i];
        var isPrefixGroup = phraseGroupInfo.isPrefixGroups[i];
        var isPostfixGroup = phraseGroupInfo.isPostfixGroups[i];
        var notConnectGroupIndex = phraseGroupInfo.notConnectGroupIndices[i];
        var notConnectGroupCount = phraseGroupInfo.notConnectGroupIndices.length;
        var isEnd = phraseGroupInfo.isEnds[i];
        var isIntro = phraseGroupInfo.isIntros[i];
        var tempos = createFilledArray(4, tempo);
        var scaleTypes = createFilledArray(4, scaleType);
        var scaleBaseNotes = createFilledArray(4, scaleBaseNote);
        var majorModulationTargets = createFilledArray(4, -1);
        var minorModulationTargets = createFilledArray(4, -1);
        var modifierFunctions = createFilledArray(4, modifierFunctionArr);
        var renderAmounts = createFilledArray(4, renderAmount);
        var renderAmountSeeds = createFilledArray(4, renderAmountSeed);
        var numerators = createFilledArray(4, numerator);
//        var songPartTypes = createFilledArray(4, phraseGroupInfo.songPartTypes);


        function updateScaleForModulation(modIndex, keepScale, invertModulation, phraseModulate) {
            majorModulationTargets[modIndex] = majorModulationTarget;
            minorModulationTargets[modIndex] = minorModulationTarget;
            if (modIndex == 0) {
                if (!keepScale) {
                    // Set the second scale to the modulation target's scale
                    var modTarget = majorModulationTarget;
                    switch (scaleTypes[0]) {
                        case ScaleType.MAJOR:
                            modTarget = majorModulationTarget;
                            break;
                        case ScaleType.NATURAL_MINOR:
                            modTarget = minorModulationTarget;
                            break;
                    }
                    var newScaleType = DynamicHarmonyModulationTarget.getScaleType(scaleTypes[0], modTarget, false);
                    scaleTypes[1] = newScaleType;
                    var testHarmony = new ConstantHarmonyElement().setScaleType(scaleTypes[0]).setBaseNote(scaleBaseNotes[0]);
                    scaleBaseNotes[1] = testHarmony.getAbsoluteNoteFromScaleIndex(modTarget + 1);
                } else {
                    scaleTypes[1] = scaleTypes[0];
                }
            } else {
                if (invertModulation) {
                    if (scaleTypes[0] == scaleTypes[1]) {
                        majorModulationTargets[modIndex] = DynamicHarmonyModulationTarget.invert(majorModulationTarget);
                        minorModulationTargets[modIndex] = DynamicHarmonyModulationTarget.invert(minorModulationTarget);
                    } else {
                        majorModulationTargets[modIndex] = DynamicHarmonyModulationTarget.invert(minorModulationTarget);
                        minorModulationTargets[modIndex] = DynamicHarmonyModulationTarget.invert(majorModulationTarget);
                    }
                }
            }
            if (phraseModulate) {
                majorModulationTargets[modIndex] = -1;
                minorModulationTargets[modIndex] = -1;
            }
        }


        getPhraseTypesFromGroupType(groupType, ssInfo.phraseTypes, customPhraseTypes);

        switch (groupType) {
            case SimpleModuleGeneratorPhraseGroupType.SINGLE_CUSTOM_HARMONY:
                break;
            case SimpleModuleGeneratorPhraseGroupType.CUSTOM:
                if (customPhraseTypes) {
                    for (var j=0; j<customPhraseTypes.length; j++) {
                        switch (customPhraseTypes[j]) {
                            case PhraseHarmonyElementType.COMPLETE_MODULATE:
                            case PhraseHarmonyElementType.COMPLETE_MODULATE_IMPERFECT:
                            case PhraseHarmonyElementType.CHROMATIC_TRANSITION_MODULATE:
                                updateScaleForModulation(j, false);
                                break;
                            case PhraseHarmonyElementType.COMPLETE_TONICIZE:
                            case PhraseHarmonyElementType.COMPLETE_TONICIZE_IMPERFECT:
                            case PhraseHarmonyElementType.CHROMATIC_TRANSITION_TONICIZE:
                                updateScaleForModulation(j, true);
                                break;
                        }
                    }
                } else {
                    logit("Could not find any custom phrase types for group " + i);
                }
                break;
            case SimpleModuleGeneratorPhraseGroupType.SINGLE_SILENT:
                modifierFunctions[0].push(function(mods) {
                    setMod("melodyRenderAmountVar", "" + 0, mods);
                    setMod("inner1RenderAmountVar", "" + 0, mods);
                    setMod("inner2RenderAmountVar", "" + 0, mods);
                    setMod("bassRenderAmountVar", "" + 0, mods);
                    setMod("percussionRenderAmountVar", "" + 0, mods);
                });
                break;
            case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE:
            case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE_LENGTHEN_DOMINANT:
            case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
                updateScaleForModulation(0, false);
                break;
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE:
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE_LENGTHEN_DOMINANT:
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_COMPLETE_LENGTHEN_FINAL_TONIC:
                updateScaleForModulation(0, true);
                break;
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_DECEPTIVE:
                updateScaleForModulation(0, true);
                break;
            case SimpleModuleGeneratorPhraseGroupType.TONICIZE_PLUS_TONICIZE:
                updateScaleForModulation(0, true);
                updateScaleForModulation(1, true);
                break;
            case SimpleModuleGeneratorPhraseGroupType.MODULATE_PLUS_MODULATE_BACK:
                updateScaleForModulation(0, false);
                updateScaleForModulation(1, true, true);
                // logit(scaleTypes + " " + majorModulationTargets + " " + minorModulationTargets + " " + scaleBaseNotes);
                break;
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_MODULATE:
                updateScaleForModulation(1, true);
                break;
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_PHRASE_MODULATE:
                updateScaleForModulation(0, false, false, true);
                break;
            case SimpleModuleGeneratorPhraseGroupType.INCOMPLETE_PLUS_MODULATE:
                updateScaleForModulation(1, true);
                break;
            case SimpleModuleGeneratorPhraseGroupType.COMPLETE_PLUS_COMPLETE_DIFFERENT_SCALE_TYPE:
                scaleTypes[1] = scaleType == ScaleType.MAJOR ? ScaleType.NATURAL_MINOR : ScaleType.MAJOR;
                break;
        }

//        logit(modifierFunctions);

        var count = ssInfo.phraseTypes.length - sizeBefore;
        ssInfo.indicesForGroups[i] = [];
        for (var j=0; j<count; j++) {
            ssInfo.indicesForGroups[i].push(ssInfo.groupIndices.length);
            ssInfo.groupIndices.push(i);
            ssInfo.renderAmounts[sizeBefore + j] = renderAmounts[j];
            ssInfo.renderAmountSeeds[sizeBefore + j] = renderAmountSeeds[j];
            ssInfo.numerators[sizeBefore + j] = numerators[j];
            ssInfo.tempos[sizeBefore + j] = tempos[j];
            ssInfo.scaleTypes[sizeBefore + j] = scaleTypes[j];
            ssInfo.scaleBaseNotes[sizeBefore + j] = scaleBaseNotes[j];
            ssInfo.majorModulationTargets[sizeBefore + j] = majorModulationTargets[j];
            ssInfo.minorModulationTargets[sizeBefore + j] = minorModulationTargets[j];
            ssInfo.modifierFunctions[sizeBefore + j] = modifierFunctions[j];

            ssInfo.songPartTypes.push(songPartType);

            ssInfo.harmonyElementIndices[sizeBefore + j] = (harmonyElementIndices && harmonyElementIndices.length > 0) ? harmonyElementIndices[j % harmonyElementIndices.length] : 0;
//            logit("Pushing spt " + songPartType);

            var indexInfo = {
                phraseGroupIndex: j,
                phraseGroupCount: count,
                songGroupIndex: i,
                songGroupCount: phraseGroupInfo.groupTypes.length,
                isConnectGroup: isConnectGroup,
                isPrefixGroup: isPrefixGroup,
                isPostfixGroup: isPostfixGroup,
                notConnectGroupIndex: notConnectGroupIndex,
                notConnectGroupCount: notConnectGroupCount,
                isIntro: isIntro,
                isEnd: isEnd
            };

            ssInfo.indexInfos[sizeBefore + j] = indexInfo;
        }
        for (var j=0; j<phraseGroupInfo.propertyNameCounts.length; j++) {
            var propName = phraseGroupInfo.propertyNameCounts[j][0];
            var arr = ssInfo[propName];
            if (!arr) {
                arr = [];
                ssInfo[propName] = arr;
            }
            for (var k=0; k<count; k++) {
                arr.push(-1);
            }
        }
    }
    assignPropertyIndexArrays(ssInfo, phraseGroupInfo, rnd, genInfo);

//    logit(ssInfo.harmonyElementIndices);

    return ssInfo;
}



function createTestModule(seed, inputGenInfo, resultObj) {

    moduleConstructTimer.start();


    if (!resultObj) {
        resultObj = {};
    }
    if (!seed) {
        seed = 898443427;
    }
    if (!inputGenInfo) {
        inputGenInfo = {};
    }

    var rnd = new MersenneTwister(seed);
    var genInfo = new GenInfo();
    genInfo.randomize(rnd);
    genInfo.set(inputGenInfo);

    var globalRnd = new MersenneTwister(genInfo.globalSeed);
    globalRnd = null;

    var module = new GenMusicModule();
    var songStructureInfo = createSongStructureInfo(globalRnd, genInfo, module);

    genInfo.songStructureInfo = songStructureInfo;
    resultObj.songStructureInfo = songStructureInfo;

    var sectionInfos = createSectionInfos(genInfo);
    var genData = createModuleGeneratorData(genInfo, sectionInfos);



    var bassDrum = new MidiDrumNamedNote().setNote(MidiDrum.BASS_DRUM_1).setId("Bass drum");
    var snareDrum = new MidiDrumNamedNote().setNote(MidiDrum.SNARE_DRUM_1).setId("Snare drum");
    var hihat = new MidiDrumNamedNote().setNote(MidiDrum.CLOSED_HIHAT).setId("Hihat");
    module.namedNotes = [bassDrum, snareDrum, hihat];

    var percussionRenderChannel1 = new RenderChannel();
    percussionRenderChannel1.id = "percussionRenderChannel1";
    module.renderChannels.push(percussionRenderChannel1);


    var tempoChannel = new DoubleControlChannel();
    tempoChannel.defaultValue = 1.0;
    tempoChannel.mixMode = NumericControlChannelMixMode.MULT;
    tempoChannel.mixWithDefault = true;
    tempoChannel.id = "tempoChannel";
    module.controlChannels.push(tempoChannel);


    var voicePlanner = new ClassicalVoiceLinePlanner();
    voicePlanner.id = "voicePlanner";


    var hrDensityCurveSeedVar = new SimpleIntegerEditorVariable();
    hrDensityCurveSeedVar.id = "hrDensityCurveSeedVar";
    hrDensityCurveSeedVar.value = 341234;
    module.addVariable(hrDensityCurveSeedVar);

    var hrDensityCurveAmpVar = new SimpleIntegerEditorVariable();
    hrDensityCurveAmpVar.id = "hrDensityCurveAmpVar";
    hrDensityCurveAmpVar.value = 1;
    module.addVariable(hrDensityCurveAmpVar);

    var hrDensityCurveFreqVar = new SimpleIntegerEditorVariable();
    hrDensityCurveFreqVar.id = "hrDensityCurveFreqVar";
    hrDensityCurveFreqVar.value = 1;
    module.addVariable(hrDensityCurveFreqVar);

    var hrDensityCurve = new PredefinedCurve().setType(PredefinedCurveType.CONSTANT_NOISE).setAmplitude(1.0).setFrequency(3).setSeed(3242);

    hrDensityCurve.seedUseExpression = true;
    hrDensityCurve.seedExpression = hrDensityCurveSeedVar.id;

    hrDensityCurve.amplitudeUseExpression = true;
    hrDensityCurve.amplitudeExpression = hrDensityCurveAmpVar.id;
    hrDensityCurve.frequencyUseExpression = true;
    hrDensityCurve.frequencyExpression = hrDensityCurveFreqVar.id;

    hrDensityCurve.id = "HR density curve";

    module.addCurve(hrDensityCurve);


    function createSplitRythm(rythmInfo) {
        var id = getValueOrDefault(rythmInfo, "id", "unnamedRythm1");
        var length = getValueOrDefault(rythmInfo, "length", 1);
        var lengthUnit = getValueOrDefault(rythmInfo, "lengthUnit", PositionUnit.HARMONY_ELEMENTS);
        var noteCount = getValueOrDefault(rythmInfo, "noteCount", 1);
        var noteCountUnit = getValueOrDefault(rythmInfo, "noteCountUnit", CountUnit.HARMONY_ELEMENT_BEATS);
        var extraNoteCount = getValueOrDefault(rythmInfo, "extraNotes", 0);
        var extraNoteCountUnit = getValueOrDefault(rythmInfo, "extraNoteCountUnit", CountUnit.PLAIN);
        var addZone1 = getValueOrDefault(rythmInfo, "addZone1", false);
        var zone1PositionInterval = getValueOrDefault(rythmInfo, "zone1PositionInterval", [0.5, 1]);
        var zone1MaxApplications = getValueOrDefault(rythmInfo, "zone1MaxApplications", 128);
        var zone1SplitStrategy = getValueOrDefault(rythmInfo, "zone1SplitStrategy", SplitStrategy.DOT_FIRST);
        var densityCurveId = getValueOrDefault(rythmInfo, "densityCurveId", "");
        var rythm = new Rythm();
        rythm.id = id;
        var rythmElement = new SplitRythmElement();
        rythmElement.setLength(length);
        rythmElement.setLengthUnit(lengthUnit);
        rythmElement.setExtraNoteCount(extraNoteCount);
        rythmElement.setExtraNoteCountUnit(extraNoteCountUnit);
        rythmElement.setNoteCount(noteCount);
        rythmElement.setNoteCountUnit(noteCountUnit);
        rythmElement.setDensityCurve(densityCurveId);

        if (addZone1) {
            var splitZone1 = new SplitZone();
            splitZone1.setPositionInterval(zone1PositionInterval);
            splitZone1.setPositionIntervalUnit(PositionUnit.HARMONY_ELEMENTS);
            splitZone1.setSplitStrategy(zone1SplitStrategy);
            splitZone1.maxApplications = zone1MaxApplications;
            rythmElement.addSplitZone(splitZone1);
        }
        rythm.addRythmElement(rythmElement);
        return rythm;
    }


    var hrRythm = new Rythm();
    hrRythm.id = "hrRythm";

    var harmonyRaiseLeadingToneVar = new SimpleBooleanEditorVariable();
    harmonyRaiseLeadingToneVar.id = "harmonyRaiseLeadingToneVar";
    harmonyRaiseLeadingToneVar.value = true;
    module.addVariable(harmonyRaiseLeadingToneVar);

    var harmonySimpleMixtureLikelihoodVar = new SimpleDoubleEditorVariable();
    harmonySimpleMixtureLikelihoodVar.id = "harmonySimpleMixtureLikelihoodVar";
    harmonySimpleMixtureLikelihoodVar.value = 1;
    module.addVariable(harmonySimpleMixtureLikelihoodVar);

    var harmonySus2ChordsLikelihoodVar = new SimpleDoubleEditorVariable();
    harmonySus2ChordsLikelihoodVar.id = "harmonySus2ChordsLikelihoodVar";
    harmonySus2ChordsLikelihoodVar.value = 1;
    module.addVariable(harmonySus2ChordsLikelihoodVar);

    var harmonySus4ChordsLikelihoodVar = new SimpleDoubleEditorVariable();
    harmonySus4ChordsLikelihoodVar.id = "harmonySus4ChordsLikelihoodVar";
    harmonySus4ChordsLikelihoodVar.value = 1;
    module.addVariable(harmonySus4ChordsLikelihoodVar);

    var harmonyNeighbourChordsLikelihoodVar = new SimpleDoubleEditorVariable();
    harmonyNeighbourChordsLikelihoodVar.id = "harmonyNeighbourChordsLikelihoodVar";
    harmonyNeighbourChordsLikelihoodVar.value = 1;
    module.addVariable(harmonyNeighbourChordsLikelihoodVar);

    var harmonyPassingChordsLikelihoodVar = new SimpleDoubleEditorVariable();
    harmonyPassingChordsLikelihoodVar.id = "harmonyPassingChordsLikelihoodVar";
    harmonyPassingChordsLikelihoodVar.value = 1;
    module.addVariable(harmonyPassingChordsLikelihoodVar);

    var harmonyMajorDeceptiveRootVar = new SimpleIntegerEditorVariable();
    harmonyMajorDeceptiveRootVar.id = "harmonyMajorDeceptiveRootVar";
    harmonyMajorDeceptiveRootVar.value = 5;
    module.addVariable(harmonyMajorDeceptiveRootVar);

    var harmonyMinorDeceptiveRootVar = new SimpleIntegerEditorVariable();
    harmonyMinorDeceptiveRootVar.id = "harmonyMinorDeceptiveRootVar";
    harmonyMinorDeceptiveRootVar.value = 5;
    module.addVariable(harmonyMinorDeceptiveRootVar);

    var harmonyPhraseTypeVar = new SimpleIntegerEditorVariable();
    harmonyPhraseTypeVar.id = "harmonyPhraseTypeVar";
    harmonyPhraseTypeVar.value = 2;
    module.addVariable(harmonyPhraseTypeVar);

    var harmonyNoteCountVar = new SimpleIntegerEditorVariable();
    harmonyNoteCountVar.id = "harmonyNoteCountVar";
    harmonyNoteCountVar.value = 5;
    module.addVariable(harmonyNoteCountVar);

    var harmonyTotalLengthVar = new SimpleDoubleEditorVariable();
    harmonyTotalLengthVar.id = "harmonyTotalLengthVar";
    harmonyTotalLengthVar.value = 4;
    module.addVariable(harmonyTotalLengthVar);

    var harmonyRythmLengthTypeVar = new SimpleIntegerEditorVariable();
    harmonyRythmLengthTypeVar.id = "harmonyRythmLengthTypeVar";
    harmonyRythmLengthTypeVar.value = NoteRythmElementLengthType.NORMAL;
    module.addVariable(harmonyRythmLengthTypeVar);

    var harmonyRythmMeasureSplitStrategyVar = new SimpleIntegerEditorVariable();
    harmonyRythmMeasureSplitStrategyVar.id = "harmonyRythmMeasureSplitStrategyVar";
    harmonyRythmMeasureSplitStrategyVar.value = NoteRythmElementLengthType.NORMAL;
    module.addVariable(harmonyRythmMeasureSplitStrategyVar);

    var harmonySRE = new SplitRythmElement().setLength(1).setNoteCount(harmonyNoteCountVar.value).setNoteCountUnit(CountUnit.PLAIN).setLengthUnit(PositionUnit.MEASURES).setDensityCurve(hrDensityCurve.id);
    harmonySRE.startLengthTypeUseExpression = true;
    harmonySRE.autoDetectLengthType = false;
    harmonySRE.startLengthTypeExpression = harmonyRythmLengthTypeVar.id;
    harmonySRE.noteCountUseExpression = true;
    harmonySRE.lengthUseExpression = true;
    harmonySRE.lengthExpression = harmonyTotalLengthVar.id;
    harmonySRE.lengthUnit = PositionUnit.MEASURES;

    harmonySRE.noteCountExpression = harmonyNoteCountVar.id;
    var harmonySzc = new SplitZoneCollection();

    var harmonySz = new SplitZone();
//    harmonySz.verbose = true;
    harmonySz.splitStrategy = SplitStrategy.HALVE;
    harmonySz.splitStrategyUseExpression = true;
    harmonySz.splitStrategyExpression = harmonyRythmMeasureSplitStrategyVar.id;
    harmonySz.positionInterval = [0, 128];
    harmonySz.noteLengthInterval = [0.95, 1.001];
    harmonySz.noteLengthIntervalUnit = PositionUnit.MEASURES;
    harmonySzc.addSplitZone(harmonySz);
    harmonySRE.splitZoneCollection = harmonySzc;

    hrRythm.addRythmElement(harmonySRE);


    var allPercMotifs = [];


    for (var i=0; i<genData.percussionMotifInfos.length; i++) {

        var info = genData.percussionMotifInfos[i];

        var percussionMotif = null;
        if (typeof(info.predefinedType) != 'undefined') {
            percussionMotif = new SingleElementPercussionMotif();
            percussionMotif.element = new PredefinedPercussionMotifElement().setType(info.predefinedType);
            percussionMotif.mode = PercussionMotifMode.ELEMENTS;
        } else {
            percussionMotif = new PercussionMotif();
            percussionMotif.verbose = true;
            percussionMotif.mode = PercussionMotifMode.RYTHM_AND_ZONES;

            var percDensCurve = new PredefinedCurve();
            percDensCurve.type = getValueOrDefault(info, "densityCurveType", PredefinedCurveType.CONSTANT_NOISE);
            percDensCurve.amplitude = getValueOrDefault(info, "densityAmplitude", 1);
            percDensCurve.frequency = getValueOrDefault(info, "densityFrequency", 3);
            percDensCurve.seed = getValueOrDefault(info, "densitySeed", 334324);
            percDensCurve.id = "percussionRythmCurve" + (i + 1);
            module.addCurve(percDensCurve);

            var percRythmElement = new SplitRythmElement();
            percRythmElement.verbose = true;
            percRythmElement.densityCurve = percDensCurve.id;
            percRythmElement.noteCount = getValueOrDefault(info, "rythmNoteCount", 4);
            percRythmElement.length = getValueOrDefault(info, "rythmLength", 1);
            percRythmElement.lengthUnit = getValueOrDefault(info, "rythmLengthUnit", PositionUnit.MEASURES);
            percRythmElement.minLength = getValueOrDefault(info, "rythmMinLength", 0.125);
            percRythmElement.minLengthUnit = getValueOrDefault(info, "rythmMinLengthUnit", PositionUnit.BEATS);

            var percRythm = new Rythm();
            percRythm.id = "percussionRythm" + (i + 1);
            percRythm.addRythmElement(percRythmElement);
            module.addRythm(percRythm);

            percussionMotif.rythm = percRythm.id;

            var zoneInfos = getValueOrDefault(info, "motifZoneInfos", []);
            for (var j=0; j<zoneInfos.length; j++) {
                var zoneInfo = zoneInfos[j];

                var zone = new VersatilePercussionMotifZone();
                zone.activatedExpression = getValueOrDefault(zoneInfo, "activatedExpression", "");
                if (zone.activatedExpression) {
                    zone.activatedUseExpression = true;
                }
                zone.useNamedNotes = false;
                zone.notes = getValueOrDefault(zoneInfo, "notes", [MidiDrum.CHINESE_CYMBAL]);
                zone.noteIndexPattern = getValueOrDefault(zoneInfo, "noteIndexPattern", [[0]]);
                zone.startNoteIndexPattern = getValueOrDefault(zoneInfo, "startNoteIndexPattern", []);
                zone.endNoteIndexPattern = getValueOrDefault(zoneInfo, "endNoteIndexPattern", []);
                zone.start = getValueOrDefault(zoneInfo, "start", 0);
                zone.end = getValueOrDefault(zoneInfo, "end", 1);
                zone.beatConditionMultiplier = getValueOrDefault(zoneInfo, "multiplier", 1);
                zone.beatConditionBias = getValueOrDefault(zoneInfo, "bias", 0);
                zone.beatConditionRemainders = getValueOrDefault(zoneInfo, "remainders", []);
                zone.beatConditionRemainderStrengths = getValueOrDefault(zoneInfo, "remainderStrengths", [1]);
                zone.beatConditionQuotients = getValueOrDefault(zoneInfo, "quotients", []);
                zone.beatConditionDivisorCheck = getValueOrDefault(zoneInfo, "divisorCheck", 1);
                zone.beatConditionDivisorCheckUnit = getValueOrDefault(zoneInfo, "divisorCheckUnit", PositionUnit.MEASURES);

                percussionMotif.zones.push(zone);

//                logit(zone);
            }

            if (percussionMotif.zones.length == 0) {
                logit("no zones in " + percussionMotif.id);
            }
//            logit(percussionMotif.zones);

        }
        percussionMotif.id = "percussionMotif" + (i+1);

        module.percussionMotifs.push(percussionMotif);
        allPercMotifs.push(percussionMotif.id);

//        logit("hello " + i);

    }

    var indexInfoVar = new SimpleObjectEditorVariable();
    indexInfoVar.id = "indexInfoVar";
    indexInfoVar.value = {};
    module.addVariable(indexInfoVar);


    var staticHarmonyElement = new StaticSequenceHarmonyElement().setCount(4);
    staticHarmonyElement.lengthPattern = [2, 1];
    var dhe1 = new DynamicSequenceHarmonyElement().setCount(4);
    dhe1.seed = 124153542;
    dhe1.lengthPattern = [4, 2, 1, 1];
    dhe1.lengthPatternUnit = PositionUnit.BEATS;
    dhe1.scaleBaseNote = 60;
    dhe1.modulate = true;

    var che1 = new ConstantHarmonyElement().setBaseNote(67).setChordRoot(4).setLength(4).setLengthUnit(PositionUnit.BEATS);
    var che2 = new ConstantHarmonyElement().setBaseNote(67).setChordRoot(0).setLength(4).setLengthUnit(PositionUnit.BEATS);


    var harmony1 = new ConstantHarmonicRythm([dhe1, che1, che2]);
    //    var harmony1 = new ConstantHarmonicRythm([staticHarmonyElement, new DynamicSequenceHarmonyElement().setCount(4)]);
    harmony1.id = "harmony1";



    var harmonySeedVar = new SimpleIntegerEditorVariable();
    harmonySeedVar.id = "harmonySeedVar";
    harmonySeedVar.value = 123456789;
    module.addVariable(harmonySeedVar);

    var harmonyScaleBaseVar = new SimpleIntegerEditorVariable();
    harmonyScaleBaseVar.id = "harmonyScaleBaseVar";
    harmonyScaleBaseVar.value = 60;
    module.addVariable(harmonyScaleBaseVar);

    var numeratorVar = new SimpleIntegerEditorVariable();
    numeratorVar.id = "numeratorVar";
    numeratorVar.value = 4;
    module.addVariable(numeratorVar);

    var harmonyMajorModulationTargetVar = new SimpleIntegerEditorVariable();
    harmonyMajorModulationTargetVar.id = "harmonyMajorModulationTargetVar";
    harmonyMajorModulationTargetVar.value = -1;
    module.addVariable(harmonyMajorModulationTargetVar);

    var harmonyMinorModulationTargetVar = new SimpleIntegerEditorVariable();
    harmonyMinorModulationTargetVar.id = "harmonyMinorModulationTargetVar";
    harmonyMinorModulationTargetVar.value = -1;
    module.addVariable(harmonyMinorModulationTargetVar);

    var scaleTypeVar = new SimpleIntegerEditorVariable();
    scaleTypeVar.id = "scaleTypeVar";
    scaleTypeVar.value = ScaleType.MAJOR;
    module.addVariable(scaleTypeVar);


    var staticHarmonyLengthVar = new SimpleIntegerEditorVariable();
    staticHarmonyLengthVar.id = "staticHarmonyLengthVar";
    staticHarmonyLengthVar.value = 10;
    module.addVariable(staticHarmonyLengthVar);

    var dynamicHarmonyLengthVar = new SimpleIntegerEditorVariable();
    dynamicHarmonyLengthVar.id = "dynamicHarmonyLengthVar";
    dynamicHarmonyLengthVar.value = 10;
    module.addVariable(dynamicHarmonyLengthVar);

    var dominantCadenceHarmonyLengthVar = new SimpleIntegerEditorVariable();
    dominantCadenceHarmonyLengthVar.id = "dominantCadenceHarmonyLengthVar";
    dominantCadenceHarmonyLengthVar.value = 10;
    module.addVariable(dominantCadenceHarmonyLengthVar);

    var tonicCadenceHarmonyLengthVar = new SimpleIntegerEditorVariable();
    tonicCadenceHarmonyLengthVar.id = "tonicCadenceHarmonyLengthVar";
    tonicCadenceHarmonyLengthVar.value = 10;
    module.addVariable(tonicCadenceHarmonyLengthVar);

    var phe = new PhraseHarmonyElement().setCount(12);
    phe.seed = 23463;
    phe.staticHarmonyLength = 10;
    phe.staticHarmonyLengthUseExpression = true;
    phe.staticHarmonyLengthExpression = staticHarmonyLengthVar.id;
    phe.staticHarmonyLengthUnit = LengthAndCountUnit.LENGTH_PERCENT;
    phe.staticHarmonySimpleMixtureLikelihoodUseExpression = true;
    phe.staticHarmonySimpleMixtureLikelihoodExpression = harmonySimpleMixtureLikelihoodVar.id;
    phe.staticHarmonyNeighbourChordLikelihoodUseExpression = true;
    phe.staticHarmonyNeighbourChordLikelihoodExpression = harmonyNeighbourChordsLikelihoodVar.id;
    phe.staticHarmonyPassingChordLikelihoodUseExpression = true;
    phe.staticHarmonyPassingChordLikelihoodExpression = harmonyPassingChordsLikelihoodVar.id;
    phe.staticHarmonySus2ChordLikelihoodUseExpression = true;
    phe.staticHarmonySus2ChordLikelihoodExpression = harmonySus2ChordsLikelihoodVar.id;
    phe.staticHarmonySus4ChordLikelihoodUseExpression = true;
    phe.staticHarmonySus4ChordLikelihoodExpression = harmonySus4ChordsLikelihoodVar.id;

    phe.dynamicHarmonyLength = 70;
    phe.dynamicHarmonyLengthUseExpression = true;
    phe.dynamicHarmonyLengthExpression = dynamicHarmonyLengthVar.id;
    phe.dynamicHarmonyLengthUnit = LengthAndCountUnit.LENGTH_PERCENT;
    phe.dynamicHarmonySimpleMixtureLikelihoodUseExpression = true;
    phe.dynamicHarmonySimpleMixtureLikelihoodExpression = harmonySimpleMixtureLikelihoodVar.id;
    phe.dynamicHarmonyNeighbourChordLikelihoodUseExpression = true;
    phe.dynamicHarmonyNeighbourChordLikelihoodExpression = harmonyNeighbourChordsLikelihoodVar.id;
    phe.dynamicHarmonyPassingChordLikelihoodUseExpression = true;
    phe.dynamicHarmonyPassingChordLikelihoodExpression = harmonyPassingChordsLikelihoodVar.id;
    phe.dynamicHarmonySus2ChordLikelihoodUseExpression = true;
    phe.dynamicHarmonySus2ChordLikelihoodExpression = harmonySus2ChordsLikelihoodVar.id;
    phe.dynamicHarmonySus4ChordLikelihoodUseExpression = true;
    phe.dynamicHarmonySus4ChordLikelihoodExpression = harmonySus4ChordsLikelihoodVar.id;


    phe.dominantCadenceHarmonyLength = 10;
    phe.dominantCadenceHarmonyLengthUseExpression = true;
    phe.dominantCadenceHarmonyLengthExpression = dominantCadenceHarmonyLengthVar.id;
    phe.dominantCadenceHarmonyLengthUnit = LengthAndCountUnit.LENGTH_PERCENT;
    phe.dominantCadenceHarmonySimpleMixtureLikelihoodUseExpression = true;
    phe.dominantCadenceHarmonySimpleMixtureLikelihoodExpression = harmonySimpleMixtureLikelihoodVar.id;
    phe.dominantCadenceHarmonyNeighbourChordLikelihoodUseExpression = true;
    phe.dominantCadenceHarmonyNeighbourChordLikelihoodExpression = harmonyNeighbourChordsLikelihoodVar.id;
    phe.dominantCadenceHarmonyPassingChordLikelihoodUseExpression = true;
    phe.dominantCadenceHarmonyPassingChordLikelihoodExpression = harmonyPassingChordsLikelihoodVar.id;
    phe.dominantCadenceHarmonySus2ChordLikelihoodUseExpression = true;
    phe.dominantCadenceHarmonySus2ChordLikelihoodExpression = harmonySus2ChordsLikelihoodVar.id;
    phe.dominantCadenceHarmonySus4ChordLikelihoodUseExpression = true;
    phe.dominantCadenceHarmonySus4ChordLikelihoodExpression = harmonySus4ChordsLikelihoodVar.id;

    phe.tonicCadenceHarmonyLength = 10;
    phe.tonicCadenceHarmonyLengthUseExpression = true;
    phe.tonicCadenceHarmonyLengthExpression = tonicCadenceHarmonyLengthVar.id;
    phe.tonicCadenceHarmonyLengthUnit = LengthAndCountUnit.LENGTH_PERCENT;
    phe.tonicCadenceHarmonySimpleMixtureLikelihoodUseExpression = true;
    phe.tonicCadenceHarmonySimpleMixtureLikelihoodExpression = harmonySimpleMixtureLikelihoodVar.id;
    phe.tonicCadenceHarmonyNeighbourChordLikelihoodUseExpression = true;
    phe.tonicCadenceHarmonyNeighbourChordLikelihoodExpression = harmonyNeighbourChordsLikelihoodVar.id;
    phe.tonicCadenceHarmonyPassingChordLikelihoodUseExpression = true;
    phe.tonicCadenceHarmonyPassingChordLikelihoodExpression = harmonyPassingChordsLikelihoodVar.id;
    phe.tonicCadenceHarmonySus2ChordLikelihoodUseExpression = true;
    phe.tonicCadenceHarmonySus2ChordLikelihoodExpression = harmonySus2ChordsLikelihoodVar.id;
    phe.tonicCadenceHarmonySus4ChordLikelihoodUseExpression = true;
    phe.tonicCadenceHarmonySus4ChordLikelihoodExpression = harmonySus4ChordsLikelihoodVar.id;

    phe.useMaxElementLength = genInfo.useMaxHarmonyElementLength;
    phe.maxElementLength = 2;
    phe.maxElementLengthUnit = PositionUnit.MEASURES;
    phe.maxElementLengthUseExpression = true;
    phe.maxElementLengthExpression = "Math.floor(3 / " + numeratorVar.id + " + 1)";

    phe.seedUseExpression = true;
    phe.seedExpression = harmonySeedVar.id;
    phe.tsNumerators = [4];
    phe.tsNumeratorsUseExpression = true;
    phe.tsNumeratorsExpression = "[" + numeratorVar.id + "]";
    phe.rythmTsNumeratorUseExpression = true;
    phe.rythmTsNumeratorExpression = numeratorVar.id;

    phe.scaleBaseNote = 60;
    phe.scaleBaseNoteUseExpression = true;
    phe.scaleBaseNoteExpression = harmonyScaleBaseVar.id;
    phe.raiseLeadingToneUseExpression = true;
    phe.raiseLeadingToneExpression = harmonyRaiseLeadingToneVar.id;
    phe.majorDeceptiveRootUseExpression = true;
    phe.majorDeceptiveRootExpression = harmonyMajorDeceptiveRootVar.id;
    phe.minorDeceptiveRootUseExpression = true;
    phe.minorDeceptiveRootExpression = harmonyMinorDeceptiveRootVar.id;


    phe.modulate = false;
    phe.modulateUseExpression = true;
    phe.modulateExpression = harmonyMajorModulationTargetVar.id + " != -1 || " + harmonyMinorModulationTargetVar.id + " != -1";

    phe.majorModulationTarget = DynamicHarmonyModulationTarget.DOMINANT;
    phe.majorModulationTargetUseExpression = true;
    phe.majorModulationTargetExpression = harmonyMajorModulationTargetVar.id;

    phe.minorModulationTarget = DynamicHarmonyModulationTarget.MEDIANT;
    phe.minorModulationTargetUseExpression = true;
    phe.minorModulationTargetExpression = harmonyMinorModulationTargetVar.id;

    phe.harmonyLengthMode = HarmonyLengthMode.RYTHM_ONLY;
    phe.lengthRythm = hrRythm.id;

    phe.scaleType = ScaleType.MAJOR;
    phe.scaleTypeUseExpression = true;
    phe.scaleTypeExpression = scaleTypeVar.id;

    phe.totalLength = 4;
    phe.totalLengthUseExpression = true;
    phe.totalLengthExpression = harmonyTotalLengthVar.id;

    phe.totalLengthUnit = PositionUnit.MEASURES;
    phe.lengthRepeats = 0;
    phe.phraseType = PhraseHarmonyElementType.ANTECEDENT_CONSEQUENT;
    phe.phraseTypeUseExpression = true;
    phe.phraseTypeExpression = "harmonyPhraseTypeVar";
    phe.phraseStructureCounts = [harmonyNoteCountVar.value, harmonyNoteCountVar.value];
    phe.phraseStructureCountsUseExpression = true;
    phe.phraseStructureCountsExpression = "[harmonyNoteCountVar, harmonyNoteCountVar]";


    var harmonies = [phe];
    for (var i=0; i<genInfo.harmonyElements.length; i++) {
        var he = copyValueDeep(genInfo.harmonyElements[i]);
        if (he instanceof SequenceHarmonyElement) {
            he.lengthRythm = he.lengthRythm ? he.lengthRythm : hrRythm.id;

            if (he.setTotalLengthExternally) {
                he.totalLengthUseExpression = true;
                he.totalLengthExpression = harmonyTotalLengthVar.id;
            }
            if (he.setTsNumeratorExternally) {
                he.tsNumeratorsUseExpression = true;
                he.tsNumeratorsExpression = "[" + numeratorVar.id + "]";
                he.rythmTsNumeratorUseExpression = true;
                he.rythmTsNumeratorExpression = numeratorVar.id;
            }

            he.useMaxElementLength = genInfo.useMaxCustomHarmonyElementLength;
            he.maxElementLength = genInfo.maxCustomHarmonyElementLength;
            he.maxElementLengthUnit = genInfo.maxCustomHarmonyElementLengthUnit;
            he.maxElementLengthUseExpression = genInfo.maxCustomHarmonyElementLengthUseExpression;
            he.maxElementLengthExpression = "Math.floor(3 / " + numeratorVar.id + " + 1)";

        } else {
            console.log("Constant harmony of unknown type " + he._constructorName);
        }

        harmonies.push(he);
    }

    var harmonyElementIndexVar = new SimpleIntegerEditorVariable();
    harmonyElementIndexVar.id = "harmonyElementIndexVar";
    harmonyElementIndexVar.value = 0;
    module.addVariable(harmonyElementIndexVar);


    var she = new SwitchHarmonyElement();
    she.indexExpression = harmonyElementIndexVar.id;
    she.indexUseExpression = true;
    she.indexedElements = harmonies;

    var harmony2 = new ConstantHarmonicRythm([she]);

    harmony2.id = "harmony2";


    var suspendSeedVar = new SimpleIntegerEditorVariable();
    suspendSeedVar.id = "suspendSeedVar";
    suspendSeedVar.value = true;
    module.addVariable(suspendSeedVar);

    var suspendProbabilityVar = new SimpleDoubleEditorVariable();
    suspendProbabilityVar.id = "suspendProbabilityVar";
    suspendProbabilityVar.value = true;
    module.addVariable(suspendProbabilityVar);

    var suspendModifier = new SuspendHarmonyModifier();
    suspendModifier.voiceLineOnPattern = [0, 1, 1, 0];
    suspendModifier.seedUseExpression = true;
    suspendModifier.seedExpression = suspendSeedVar.id;
    suspendModifier.suspendProbabilitiesUseExpression = true;
    suspendModifier.suspendProbabilitiesExpression = "[" + suspendProbabilityVar.id + "]";


    harmony2.modifiers = [suspendModifier];

    var sectionTempoVar = new SimpleDoubleEditorVariable();
    sectionTempoVar.id = "sectionTempoVar";
    sectionTempoVar.value = 120.0;
    module.addVariable(sectionTempoVar);
    var nextSectionTempoVar = new SimpleDoubleEditorVariable();
    nextSectionTempoVar.id = "nextSectionTempoVar";
    nextSectionTempoVar.value = 120.0;
    module.addVariable(nextSectionTempoVar);
    var prevSectionTempoVar = new SimpleDoubleEditorVariable();
    prevSectionTempoVar.id = "prevSectionTempoVar";
    prevSectionTempoVar.value = 120.0;
    module.addVariable(prevSectionTempoVar);

    var section = new Section();
    section.id = "section";
    section.harmonicRythm = harmony2.id;
    section.tempo = songStructureInfo.baseTempo;
    if (!genInfo.useNaturalTempoChanges) {
        // Abruptly change tempos instead
        section.tempoUseExpression = true;
        section.tempoExpression = "" + sectionTempoVar.id;
    }
    module.addSection(section);



    if (genInfo.exportChordsToNewChannel) {
//        logit("Exporting to new channel");
        var chordsRenderChannel = new RenderChannel();
        chordsRenderChannel.id = "chordsRenderChannel";
        module.renderChannels.push(chordsRenderChannel);

        var chordMotif = new Motif();
        chordMotif.id = "chordMotif";
        var cme = new VerticalRelativeMotifElement();
        cme.relativeType = VerticalRelativeType.CHORD_BASS;
        cme.length = 1;
        cme.lengthUnit = PositionUnit.HARMONY_INDEX;

        for (var i=1; i<4; i++) {
            var filler = new FillerNote();
            filler.offset = i;
            filler.lengthMode = FillerNoteLengthMode.MATCH;
            cme.addFiller(filler);
        }
        chordMotif.motifElements = [cme];
        module.addMotif(chordMotif);

        var chordMotifRenderElement = new HarmonyIndexPatternMotifRenderElement(); // Default phrase
        chordMotifRenderElement.useVoiceLine = false;
        chordMotifRenderElement.count = 1;
        chordMotifRenderElement.countUnit = CountUnit.HARMONY_ELEMENT_COUNT;
        chordMotifRenderElement.motifs = [chordMotif.id];

        var chordRenderLine = new PrimitiveRenderLine();
        chordRenderLine.channel = chordsRenderChannel.id;
        chordRenderLine.id = "chordsRenderLine";
        chordRenderLine.addRenderElement(chordMotifRenderElement);

        section.addRenderLine(chordRenderLine);
    }



    function createHintCurvesIfNecessary(infos) {
        for (var i=0; i<infos.length; i++) {
            var shapeInfo = infos[i];
            if (shapeInfo.curveId) {
                var shapeCurve = copyObjectDeep(shapeInfo.curve);
                module.addCurve(shapeCurve);
//                logit("Adding curve " + shapeCurve.id);
            }
        }
    }
    createHintCurvesIfNecessary(genData.melodyShapeInfos);
    createHintCurvesIfNecessary(genData.bassShapeInfos);

    var controlChannels = {};

    // Creates the default type of control line used for velocities, effects and tempo
    function createControlLineAndChannel(options) {
        var controlLineId = getValueOrDefault(options, "controlLineId", "");
        var controlLineVerbose = getValueOrDefault(options, "controlLineVerbose", false);
        var channelId = getValueOrDefault(options, "channelId", "");
        var channelMixMode = getValueOrDefault(options, "channelMixMode", NumericControlChannelMixMode.MULT);
        var channelMixWithDefault = getValueOrDefault(options, "channelMixWithDefault", true);
        var channelDefaultValue = getValueOrDefault(options, "channelDefaultValue", 1.0);
        var controlWriteMode = getValueOrDefault(options, "controlWriteMode", ControlChannelControlWriteMode.NONE);

        var controlLine = new PrimitiveControlLine();
        controlLine.id = controlLineId;
        controlLine.channel = channelId;
        section.addControlLine(controlLine);

        if (!controlChannels[channelId]) {
            var channel = new DoubleControlChannel();
            channel.id = channelId;
            channel.defaultValue = channelDefaultValue;
            channel.mixMode = channelMixMode;
            channel.mixWithDefault = channelMixWithDefault;
            channel.controlWriteMode = controlWriteMode;
            module.addControlChannel(channel);
            controlChannels[channelId] = channel;
        }

        return controlLine;
    }


    function createControlLineFromDescription(desc, options) {
        var type = getValueOrDefault(desc, "type", "sequential");
        var activeExpression = getValueOrDefault(desc, "activeExpression", "");

        var verbose = getValueOrDefault(options, "verbose", false);
        var elementsVerbose = getValueOrDefault(options, "elementsVerbose", false);
        var multiStepVerbose = getValueOrDefault(options, "multiStepVerbose", false);

        var controlLine = createControlLineAndChannel(options);

        var elements = getValueOrDefault(desc, "elements", []);
        var curves = getValueOrDefault(desc, "curves", []);
        var indices = getValueOrDefault(desc, "indices", []);
        var indicesExpression = getValueOrDefault(desc, "indicesExpression", "");

        for (var i=0; i<curves.length; i++) {
            module.addCurve(curves[i]);
        }

        var elementsCopy = arrayCopyWithCopy(elements);
        if (elementsVerbose) {
            for (var i=0; i<elementsCopy.length; i++) {
                elementsCopy[i].verbose = true;
            }
        }

        // Create the elements
        switch (type) {
            case "sequential":

                var startIndicesExpression = getValueOrDefault(desc, "startIndicesExpression", "");
                var startIndices = getValueOrDefault(desc, "startIndices", []);
                var endIndicesExpression = getValueOrDefault(desc, "endIndicesExpression", "");
                var endIndices = getValueOrDefault(desc, "endIndices", []);

                var msce = new MultiStepControlElement();
                if (multiStepVerbose) {
                    msce.verbose = true;
                }
                if (activeExpression) {
                    msce.activeUseExpression = true;
                    msce.activeExpression = activeExpression;
                }

                msce.startIndices = startIndices;
                if (startIndicesExpression) {
                    msce.startIndicesUseExpression = true;
                    msce.startIndicesExpression = startIndicesExpression;
                }
                msce.indices = indices;
                if (indicesExpression) {
                    msce.indicesUseExpression = true;
                    msce.indicesExpression = indicesExpression;
                }
                msce.endIndices = endIndices;
                if (endIndicesExpression) {
                    msce.endIndicesUseExpression = true;
                    msce.endIndicesExpression = endIndicesExpression;
                }

                msce.elements = elementsCopy;
                controlLine.addControlElement(msce);
                if (verbose) {
                    logit("Adding element " + JSON.stringify(msce))
                }
                break;
            case "parallel":

                var msce = new MultiParallelControlElement();
                if (multiStepVerbose) {
                    msce.verbose = true;
                }
                if (activeExpression) {
                    msce.activeUseExpression = true;
                    msce.activeExpression = activeExpression;
                }

                msce.indices = indices;
                if (indicesExpression) {
                    msce.indicesUseExpression = true;
                    msce.indicesExpression = indicesExpression;
                }
                msce.elements = elementsCopy;
                controlLine.addControlElement(msce);
                if (verbose) {
                    logit("Adding element " + JSON.stringify(msce))
                }
                break;
            default:
                logit("Missing type in effect description");
                break;
        }
        return controlLine;
    }

    function createVoiceLineAndRenderLine(options) {
        var name = getValueOrDefault(options, "name", "dummy");
        var addHintCurve = getValueOrDefault(options, "addHintCurve", false);
        var chordRootPitchClassConstraints = getValueOrDefault(options, "chordRootPitchClassConstraints", []);
        var chordBassPitchClassConstraints = getValueOrDefault(options, "chordBassPitchClassConstraints", []);
        var chordBassPitchClassConstraintsExpression = getValueOrDefault(options, "chordBassPitchClassConstraintsExpression", "");
        var penaltyRanges = getValueOrDefault(options, "penaltyRanges", [[50, 100]]);
        var ranges = getValueOrDefault(options, "ranges", [[40, 110]]);
        var maxSpacings = getValueOrDefault(options, "maxSpacings", [24]);
        var penaltyMaxSpacings = getValueOrDefault(options, "penaltyMaxSpacings", [12]);
        var pan = getValueOrDefault(options, "pan", 64);

        var capName = name.substr(0, 1).toUpperCase() + name.substr(1);


        var voiceLine = new ClassicalAdaptiveVoiceLine();
        voiceLine.ranges = ranges;
        voiceLine.penaltyRanges = penaltyRanges;
        voiceLine.chordRootPitchClassConstraints = chordRootPitchClassConstraints;
        voiceLine.chordBassPitchClassConstraints = chordBassPitchClassConstraints;
        if (chordBassPitchClassConstraintsExpression) {
            voiceLine.chordBassPitchClassConstraintsExpression = chordBassPitchClassConstraintsExpression;
            voiceLine.chordBassPitchClassConstraintsUseExpression = true;
        }
        voiceLine.maxSpacings = maxSpacings;
        voiceLine.penaltyMaxSpacings = penaltyMaxSpacings;


        var sequentialEffectChangeInfoVar = new SimpleObjectEditorVariable();
        sequentialEffectChangeInfoVar.id = "sequential" + capName + "EffectChangeInfoVar";
        module.addVariable(sequentialEffectChangeInfoVar);

        for (var i=0; i<3; i++) {

            var noteVelocitiesChannel = new DoubleControlChannel();
            noteVelocitiesChannel.id = name + "NoteVelocitiesChannel" + (i+1);
            noteVelocitiesChannel.defaultValue = 1.0;
            noteVelocitiesChannel.controlWriteMode = ControlChannelControlWriteMode.NONE; // Used to modify note velocities
            module.controlChannels.push(noteVelocitiesChannel);

            var noteVelocitiesControlLine = new PrimitiveControlLine();
            noteVelocitiesControlLine.id = name + "NoteVelocitiesControlLine" + (i+1);
            noteVelocitiesControlLine.channel = noteVelocitiesChannel.id;
            section.addControlLine(noteVelocitiesControlLine);


            var effects = [
                ["FilterF", NumericControlChannelMixMode.MULT, 1.0],
                ["FilterQ", NumericControlChannelMixMode.MULT, 1.0],
                ["Pan", NumericControlChannelMixMode.OVERWRITE_LAST, pan / 127.0]
            ];

            for (var j=0; j<effects.length; j++) {
                var effectName = effects[j][0];
                var mixMode = effects[j][1];
                var defaultValue = effects[j][2];
                var elements = [];
                var curves = [];
                var infosForVoice = genData["sequential" + capName + "EffectChangeInfos"];
                if (!infosForVoice) {
                    logit("Could not find any infos for voice " + ("sequential" + capName + "EffectChangeInfos"));
                }
                var infosForInstrument = infosForVoice[i];
                if (!infosForInstrument) {
                    logit("Could not find any infos for instrument " + i);
                }
                var effectInfos = infosForInstrument[effectName];
                if (!effectInfos) {
                    logit("Could not find any effect infos for " + ("sequential" + capName + "EffectChangeInfos") + " " + i + " " + effectName);
                    logit(" infos for instrument " + JSON.stringify(infosForInstrument));
                }
                for (var k=0; k<effectInfos.length; k++) {
                    var effectInfo = effectInfos[k];
                    elements.push(effectInfo.element);
                    curves.push(effectInfo.curve);
                }
                var indicesVarName = name + "ChannelIndicesVar";

                var controlLineActiveExpression = indicesVarName + "[0].indexOf(" + i + ") >= 0";

                createControlLineFromDescription(
                    {
                        type: "sequential",
                        elements: elements,
                        curves: curves,
                        activeExpression: controlLineActiveExpression,
                        indicesExpression: sequentialEffectChangeInfoVar.id + "." + effectName + ".indices",
                        startIndicesExpression: sequentialEffectChangeInfoVar.id + "." + effectName + ".startIndices",
                        endIndicesExpression: sequentialEffectChangeInfoVar.id + "." + effectName + ".endIndices"
                    },
                    {
                        channelId: name + "ControlChannel" + effectName + (i+1),
                        channelMixMode: mixMode,
                        channelDefaultValue: defaultValue,
                        controlLineId: name + effectName + "ControlLine" + (i+1),
                        controlWriteMode: ControlChannelControlWriteMode.SET_CONTROL
                    });
//                logit("Created control channel " + name + "ControlChannel" + effectName + (i+1));
            }
        }

        if (addHintCurve) {
            var curveMultAmpVar = new SimpleBooleanEditorVariable();
            curveMultAmpVar.id = name + "CurveMultiplyAmpVar";
            curveMultAmpVar.value = true;
            module.addVariable(curveMultAmpVar);

            voiceLine.useHintCurveLengthFractionAmplitudeMultiplier = true;
            voiceLine.useHintCurveLengthFractionAmplitudeMultiplierUseExpression = true;
            voiceLine.useHintCurveLengthFractionAmplitudeMultiplierExpression = curveMultAmpVar.id;
            voiceLine.hintCurveReferenceCount = 6;
            voiceLine.hintCurveLengthFractionAmplitudeMultiplier = 0.5;

            voiceLine.hintIndices = [70];
            voiceLine.hintIndexType = IndexType.MIDI_NOTE;

            var curveTypeVar = new SimpleIntegerEditorVariable();
            curveTypeVar.id = name + "CurveTypeVar";
            curveTypeVar.value = PredefinedCurveType.LINEAR;
            module.addVariable(curveTypeVar);

            var curveIdVar = new SimpleStringEditorVariable();
            curveIdVar.id = name + "CurveIdVar";
            curveIdVar.value = "";
            module.addVariable(curveIdVar);

            var curveAmplitudeVar = new SimpleDoubleEditorVariable();
            curveAmplitudeVar.id = name + "CurveAmplitudeVar";
            curveAmplitudeVar.value = 10;
            module.addVariable(curveAmplitudeVar);

            var curveBiasVar = new SimpleDoubleEditorVariable();
            curveBiasVar.id = name + "CurveBiasVar";
            curveBiasVar.value = 60;
            module.addVariable(curveBiasVar);

            var hintCurve = new PredefinedCurve();
            hintCurve.type = PredefinedCurveType.LINEAR;
            hintCurve.typeUseExpression = true;
            hintCurve.typeExpression = curveTypeVar.id;
            hintCurve.id = name + "HintCurve";
            module.addCurve(hintCurve);

            voiceLine.useHintCurve = true;
            voiceLine.hintCurve = hintCurve.id;
            voiceLine.hintCurveUseExpression = true;
            voiceLine.hintCurveExpression = curveIdVar.id + " ? " + curveIdVar.id + " : \"" + hintCurve.id + "\"";
            voiceLine.hintCurveMultiplier = curveAmplitudeVar.value;
            voiceLine.hintCurveMultiplierUseExpression = true;
            voiceLine.hintCurveMultiplierExpression = curveAmplitudeVar.id;
            voiceLine.hintCurveBias = curveBiasVar.value;
            voiceLine.hintCurveBiasUseExpression = true;
            voiceLine.hintCurveBiasExpression = curveBiasVar.id;
        }
//        voiceLine.phraseSuspendPatternUseExpression = true;
//        voiceLine.phraseSuspendPatternExpression = "[" + suspendPatternVar.id + "]"; // ", " + suspendPatternPhrase2Var.id + "]";
//        voiceLine.startPhraseSuspendPatternUseExpression = true;
//        voiceLine.startPhraseSuspendPatternExpression = "[" + startSuspendPatternVar.id + "]"; //", " + startSuspendPatternPhrase2Var.id + "]";
//        voiceLine.endPhraseSuspendPatternUseExpression = true;
//        voiceLine.endPhraseSuspendPatternExpression = "[" + startSuspendPatternVar.id + "]"; // ", " + startSuspendPatternPhrase2Var.id + "]";
        voiceLine.id = name + "VoiceLine";
        section.voiceLines.push(voiceLine);

        var indexMotifPatternVar = new SimpleIntegerArray2DEditorVariable();
        indexMotifPatternVar.id = name + "IndexMotifPatternVar";
        indexMotifPatternVar.value = [[1], [2], [0], [2]];
        module.addVariable(indexMotifPatternVar);
        var endIndexMotifPatternVar = new SimpleIntegerArray2DEditorVariable();
        endIndexMotifPatternVar.id = "end" + capName + "IndexMotifPatternVar";
        endIndexMotifPatternVar.value = [[2], [0]];
        module.addVariable(endIndexMotifPatternVar);


        var renderChannel1 = new RenderChannel();
        renderChannel1.id = name + "RenderChannel1";
        module.addRenderChannel(renderChannel1);
        var renderChannel2 = new RenderChannel();
        renderChannel2.id = name + "RenderChannel2";
        module.addRenderChannel(renderChannel2);
        var renderChannel3 = new RenderChannel();
        renderChannel3.id = name + "RenderChannel3";
        module.addRenderChannel(renderChannel3);

        var renderChannels = [renderChannel1.id, renderChannel2.id, renderChannel3.id];
        var channelIndicesVar = new SimpleIntegerArray2DEditorVariable();
        channelIndicesVar.id = name + "ChannelIndicesVar";
        channelIndicesVar.value = [[0]];
        module.addVariable(channelIndicesVar);
        var endChannelIndicesVar = new SimpleIntegerArray2DEditorVariable();
        endChannelIndicesVar.id = "end" + capName + "ChannelIndicesVar";
        endChannelIndicesVar.value = [[0]];
        module.addVariable(endChannelIndicesVar);


        var renderAmountVar = new SimpleDoubleEditorVariable();
        renderAmountVar.id = name + "RenderAmountVar";
        renderAmountVar.value = 1.0;
        module.addVariable(renderAmountVar);


        var hipre1 = new HarmonyIndexIndexPatternMotifRenderElement(); // Default phrase
//        hipre1.activatedUseExpression = true;
//        hipre1.activatedExpression = renderAmountVar.id;
        hipre1.voiceLine = voiceLine.id;
        hipre1.count = 1;
        hipre1.countUnit = CountUnit.PHRASE_ELEMENT_COUNT;
        hipre1.channels = copyValueDeep(renderChannels);
        hipre1.channelIndicesUseExpression = true;
        hipre1.channelIndicesExpression = channelIndicesVar.id;
        hipre1.endChannelIndicesUseExpression = true;
        hipre1.endChannelIndicesExpression = endChannelIndicesVar.id;
        hipre1.indicesUseExpression = true;
        hipre1.indicesExpression = renderAmountVar.id + " > 0 ? " + indexMotifPatternVar.id + " : []";
        hipre1.endIndicesUseExpression = true;
        hipre1.endIndicesExpression = renderAmountVar.id + " > 0 ? " + endIndexMotifPatternVar.id + " : []";
        hipre1.motifs = arrayCopy(allMotifIds);

        var psre = new PhraseStructureRenderElement();
        psre.renderElements = [hipre1];
//        psre.endRenderElements = [hipre2];

        var renderLine = new PrimitiveRenderLine();
        renderLine.voiceLine = voiceLine.id;
        renderLine.channel = renderChannel1.id;
        renderLine.id = name + "RenderLine";
        renderLine.addRenderElement(psre);

        // Extra render elements
        var extraRenderElementIndicesVar = new SimpleObjectEditorVariable();
        extraRenderElementIndicesVar.id = "extra" + capName + "RenderElementIndicesVar";
        extraRenderElementIndicesVar.defaultValue = [];
        module.addVariable(extraRenderElementIndicesVar);

        // Add activation formulas for all extra render elements
        var extraRenderElements = genInfo["extra" + capName + "RenderElements"];
        if (extraRenderElements && extraRenderElements.length > 0) {
            for (var i=0; i<extraRenderElements.length; i++) {
                var extra = extraRenderElements[i];
                extra.activatedUseExpression = true;
                var varId = extraRenderElementIndicesVar.id;
                var varIndexed = varId + "[indexInfoVar.phraseGroupIndex]";
                extra.activatedExpression = varId + " && " + varIndexed + " && (" + varIndexed + ".indexOf(" + i + ") != -1)";
            }
        }

        return renderLine;
    }


    var percussionRenderAmountVar = new SimpleDoubleEditorVariable();
    percussionRenderAmountVar.id = "percussionRenderAmountVar";
    percussionRenderAmountVar.value = 1.0;
    module.addVariable(percussionRenderAmountVar);


    var ivl1SuspStrategy = new SimpleSuspAntStrategy();
    ivl1SuspStrategy.possibleLengthIncrements = [2, 1];
    ivl1SuspStrategy.voiceLines = ["melodyVoiceLine", "inner1VoiceLine", "inner2VoiceLine", "bassVoiceLine"];
    section.suspAntStrategies = [ivl1SuspStrategy];


    module.addVoiceLinePlanner(voicePlanner);

    module.addRythm(hrRythm);

    module.addHarmony(harmony1);
    module.addHarmony(harmony2);

    section.voiceLinePlanner = voicePlanner.id;


    function createHarmonyIndexMotif(options) {
        var rythmId = getValueOrDefault(options, "rythmId", "rythm1");
        var id = getValueOrDefault(options, "id", "bassMotif1");
        var embellishStart = getValueOrDefault(options, "embellishStart", 0.0);
        var embellishEnd = getValueOrDefault(options, "embellishEnd", 0.75);
        var connectStart = getValueOrDefault(options, "connectStart", 0.75);
        var connectEnd = getValueOrDefault(options, "connectEnd", 1.0);
        var verticalOffsetType = getValueOrDefault(options, "verticalOffsetType", OffsetType.SCALE);
        var horizontalOffsetType = getValueOrDefault(options, "horizontalOffsetType", OffsetType.SCALE);
        var verticalIndices = getValueOrDefault(options, "verticalIndices", [0]);
        var verticalIndicesExpression = getValueOrDefault(options, "verticalIndicesExpression", "");
        var startVerticalIndices = getValueOrDefault(options, "startVerticalIndices", [0]);
        var startVerticalIndicesExpression = getValueOrDefault(options, "startVerticalIndicesExpression", "");
        var verticalOffsetDomains = getValueOrDefault(options, "verticalOffsetDomains", [[-3, -2, -1, 0, 1, 2, 3]]);
        var verticalOffsetLikelihoods = getValueOrDefault(options, "verticalOffsetLikelihoods", [[0.2, 0.3, 0.5, 1, 0.5, 0.3, 0.2]]);
        var addConnect = getValueOrDefault(options, "addConnect", true);
        var addEmbellish = getValueOrDefault(options, "addEmbellish", true);
        var fillerRelativeStrengths = getValueOrDefault(options, "fillerRelativeStrengths", [[0.75]]);
        var fillerRelativeLengths = getValueOrDefault(options, "fillerRelativeLengths", [[0.0]]);
        var fillerLengthModes = getValueOrDefault(options, "fillerLengthModes", [MotifZoneFillerLengthMode.RELATIVE_ADD]);
        var fillerPositionOffsets = getValueOrDefault(options, "fillerPositionOffsets", [[0.0]]);
        var fillerPositionOffsetUnits = getValueOrDefault(options, "fillerPositionOffsetUnits", [PositionUnit.BEATS]);
        var fillerOffsets = getValueOrDefault(options, "fillerOffsets", []);
        var fillerOffsetsExpression = getValueOrDefault(options, "fillerOffsetsExpression", "");
        var fillerOffsetTypes = getValueOrDefault(options, "fillerOffsetTypes", []);
        var verticalRelativeType = getValueOrDefault(options, "verticalRelativeType", VerticalRelativeType.VOICE_LINE);
        var constantVerticalOffset = getValueOrDefault(options, "constantVerticalOffset", 0);
        var constantVerticalOffsetType = getValueOrDefault(options, "constantVerticalOffsetType", OffsetType.HALF_STEP);

//        logit("motif " + id + " vod: " + verticalOffsetDomains.join(", "));

        var motif = new Motif();
        motif.id = id;
        motif.rythmBased = true;
        motif.rythm = rythmId;

        var eZone = new AdaptiveEmbellishMotifZone();
        eZone.useNoteRangeIfEmpty = true;
        eZone.positionUnit = PositionUnit.HARMONY_ELEMENTS;

        eZone.start = embellishStart;
        eZone.end = embellishEnd;

        eZone.verticalDomainOffsetType = verticalOffsetType;
        eZone.horizontalDomainOffsetType = horizontalOffsetType;

        eZone.verticalRelativeType = verticalRelativeType;
        eZone.constantVerticalOffset = constantVerticalOffset;
        eZone.constantVerticalOffsetType = constantVerticalOffsetType;

        eZone.verticalIndices = verticalIndices;
        if (verticalIndicesExpression) {
            eZone.verticalIndicesUseExpression = true;
            eZone.verticalIndicesExpression = verticalIndicesExpression;
        }
        eZone.startVerticalIndices = startVerticalIndices;
        if (startVerticalIndicesExpression) {
            eZone.startVerticalIndicesUseExpression = true;
            eZone.startVerticalIndicesExpression = startVerticalIndicesExpression;
        }
        eZone.verticalOffsetDomains = verticalOffsetDomains;
        eZone.verticalOffsetLikelihoods = verticalOffsetLikelihoods;

        eZone.fillerRelativeStrengths = fillerRelativeStrengths;
        eZone.fillerOffsets = fillerOffsets;
        eZone.fillerOffsetsExpression = fillerOffsetsExpression;
        if (fillerOffsetsExpression) {
            eZone.fillerOffsetsUseExpression = true;
        }
        eZone.fillerOffsetTypes = fillerOffsetTypes;

        eZone.fillerPositionOffsets = fillerPositionOffsets;
        eZone.fillerPositionOffsetUnits = fillerPositionOffsetUnits;

        eZone.fillerRelativeLengths = fillerRelativeLengths;
        eZone.fillerLengthModes = fillerLengthModes;

        eZone.useHorizontalOffsets = false;

        var cZone = new AdaptiveConnectMotifZone();
        cZone.start = connectStart;
        cZone.end = connectEnd;
        cZone.positionUnit = PositionUnit.HARMONY_ELEMENTS;
        // cZone.useNoteRangeIfEmpty = true;

        motif.motifZones = [];
        if (addEmbellish) {
            motif.motifZones.push(eZone);
        }
        if (addConnect) {
            motif.motifZones.push(cZone);
        }
        return motif;
    }


    function createMotifFromMotifInfo(motifInfo, idPrefix, idPostfix) {

        // Split rythm properties
        var densityCurveType = getValueOrDefault(motifInfo, "densityCurveType", PredefinedCurveType.CONSTANT_NOISE);
        var densityAmplitude = getValueOrDefault(motifInfo, "densityAmplitude", 1);
        var densitySeed = getValueOrDefault(motifInfo, "densitySeed", 123);
        var densityFrequency = getValueOrDefault(motifInfo, "densityFrequency", 4);

        // Create rythm density curve
        var densityCurve = new PredefinedCurve().setType(densityCurveType).setAmplitude(densityAmplitude).setSeed(densitySeed).setFrequency(densityFrequency);
        densityCurve.id = idPrefix + "RythmDensityCurve" + idPostfix;
        module.addCurve(densityCurve);

        // Create rythm
        var rythmOptions = copyValueDeep(motifInfo);
        rythmOptions.id = idPrefix + "Rythm" + idPostfix;
        rythmOptions.densityCurveId = densityCurve.id;
        var rythm = createSplitRythm(rythmOptions);
        module.addRythm(rythm);

        // Create motif
        var motifOptions = copyValueDeep(motifInfo);
        motifOptions.rythmId = rythm.id;
        motifOptions.id = idPrefix + "Motif" + idPostfix;
        var motif = createHarmonyIndexMotif(motifOptions);

        return motif;
    }


    var allMotifIds = [];

    for (var i=0; i<genData.motifInfos.length; i++) {
        var prefix = "melody";
        var motifInfo = genData.motifInfos[i];
        var motif = createMotifFromMotifInfo(motifInfo, prefix, "" + (i + 1));
        module.addMotif(motif);
        allMotifIds.push(motif.id);
    }

    var bassStartIndex = genData.bassStartIndex;
    var harmonyStartIndex = genData.harmonyStartIndex;

    var melodyPan = 20;
    var bassPan = 110;
    var inner1Pan = 80;
    var inner2Pan = 60;

    var melodyRenderLine = createVoiceLineAndRenderLine({name: "melody", addHintCurve: true, // chordRootPitchClassConstraints: [[0, 1, 2, 3]],
        ranges: [[40, 110]], penaltyRanges: [[50, 100]], pan: melodyPan,
        chordBassPitchClassConstraintsExpression: "melodyRenderAmountVar == 0 ? [[0]] : []"}); // To force other voices to complete chords etc.
    section.addRenderLine(melodyRenderLine);
    var inner1RenderLine = createVoiceLineAndRenderLine({name: "inner1", addHintCurve: false,
        penaltyRanges: [[50, 80]], pan: inner1Pan,
        chordBassPitchClassConstraintsExpression: "inner1RenderAmountVar == 0 || (bassRenderAmountVar == 0 && inner2RenderAmountVar == 0) ? [[0]] : []"});
    section.addRenderLine(inner1RenderLine);
    var inner2RenderLine = createVoiceLineAndRenderLine({name: "inner2", addHintCurve: false,
        penaltyRanges: [[50, 80]], pan: inner2Pan,
        chordBassPitchClassConstraintsExpression: "inner2RenderAmountVar == 0 || bassRenderAmountVar == 0 ? [[0]] : []"});
    section.addRenderLine(inner2RenderLine);
    var bassRenderLine = createVoiceLineAndRenderLine({name: "bass", addHintCurve: true, chordBassPitchClassConstraints: [[0]], pan: bassPan,
        maxSpacings: [36], penaltyMaxSpacings: [36], ranges: [[25, 80]], penaltyRanges: [[30, 70]]});
    section.addRenderLine(bassRenderLine);




    var percIndexMotifPatternVar = new SimpleIntegerArrayEditorVariable();
    percIndexMotifPatternVar.id = "percIndexMotifPatternVar";
    percIndexMotifPatternVar.value = [0];
    module.addVariable(percIndexMotifPatternVar);
    var endPercIndexMotifPatternVar = new SimpleIntegerArrayEditorVariable();
    endPercIndexMotifPatternVar.id = "endPercIndexMotifPatternVar";
    endPercIndexMotifPatternVar.value = [0];
    module.addVariable(endPercIndexMotifPatternVar);



    var percMRE = new FlexiblePercussionMotifRenderElement();
    percMRE.verbose = true;
    percMRE.activatedUseExpression = true;
    percMRE.activatedExpression = percussionRenderAmountVar.id + " > 0";
    percMRE.useIndexedMotifs = true;
    percMRE.motifIndicesUseExpression = true;
    percMRE.motifIndicesExpression = percIndexMotifPatternVar.id;
    percMRE.endMotifIndicesUseExpression = true;
    percMRE.endMotifIndicesExpression = endPercIndexMotifPatternVar.id;
    percMRE.indexedMotifs = copyValueDeep(allPercMotifs);



    var percussionPsre = new PhraseStructureRenderElement();
    percussionPsre.verbose = true;
    percussionPsre.renderElements = [percMRE];

    var percussionLine1 = new PrimitiveRenderLine();
    percussionLine1.addRenderElement(percussionPsre);
    percussionLine1.id = "percussionLine1";
    percussionLine1.channel = percussionRenderChannel1.id;
    section.addRenderLine(percussionLine1);


    section.tempoMode = SectionTempoMode.CHANGE_CONTROL_CHANNEL;
    section.tempoChannel = tempoChannel.id;


    var parallelTempoChangeIndicesVar = new SimpleIntegerArrayEditorVariable();
    parallelTempoChangeIndicesVar.value = [];
    parallelTempoChangeIndicesVar.id = "parallelTempoChangeIndicesVar";
    module.addVariable(parallelTempoChangeIndicesVar);


    var sequentialTempoChangeStartIndicesVar = new SimpleIntegerArrayEditorVariable();
    sequentialTempoChangeStartIndicesVar.value = [];
    sequentialTempoChangeStartIndicesVar.id = "sequentialTempoChangeStartIndicesVar";
    module.addVariable(sequentialTempoChangeStartIndicesVar);

    var sequentialTempoChangeIndicesVar = new SimpleIntegerArrayEditorVariable();
    sequentialTempoChangeIndicesVar.value = [0];
    sequentialTempoChangeIndicesVar.id = "sequentialTempoChangeIndicesVar";
    module.addVariable(sequentialTempoChangeIndicesVar);

    var sequentialTempoChangeEndIndicesVar = new SimpleIntegerArrayEditorVariable();
    sequentialTempoChangeEndIndicesVar.value = [];
    sequentialTempoChangeEndIndicesVar.id = "sequentialTempoChangeEndIndicesVar";
    module.addVariable(sequentialTempoChangeEndIndicesVar);



    // Tempo patterns
    var sequentialTempoElements = [];
    var sequentialTempoCurves = [];
    for (var i=0; i<genData.sequentialTempoChangeInfos.length; i++) {
        var info = genData.sequentialTempoChangeInfos[i];
        sequentialTempoElements.push(info.element);
        sequentialTempoCurves.push(info.curve);
    }
    var sequentialTempoDesc = {
        elements: sequentialTempoElements,
        curves: sequentialTempoCurves,
        type: "sequential",
        indicesExpression: sequentialTempoChangeIndicesVar.id,
        startIndicesExpression: sequentialTempoChangeStartIndicesVar.id,
        endIndicesExpression: sequentialTempoChangeEndIndicesVar.id
    };
//    logit("phrase tempo desc: " + JSON.stringify(phraseTempoDesc));
    createControlLineFromDescription(sequentialTempoDesc,
        {
//            verbose: true,
//            multiStepVerbose: true,
//            elementsVerbose: true,
            channelId: tempoChannel.id,
            controlWriteMode: ControlChannelControlWriteMode.NONE
        });


    var parallelTempoElements = [];
    var parallelTempoCurves = [];
    for (var i=0; i<genData.parallelTempoChangeInfos.length; i++) {
        var info = genData.parallelTempoChangeInfos[i];
        parallelTempoElements.push(info.element);
        parallelTempoCurves.push(info.curve);
        if (info.variables) {
            for (var j=0; j<info.variables.length; j++) {
                module.addVariable(info.variables[j]);
            }
        }
    }
    var parallelTempoDesc = {
        elements: parallelTempoElements,
        curves: parallelTempoCurves,
        type: "parallel",
        indicesExpression: parallelTempoChangeIndicesVar.id
    };
//    logit("phrase tempo desc: " + JSON.stringify(phraseTempoDesc));
    var tempoControlLine = createControlLineFromDescription(parallelTempoDesc,
        {
//            verbose: true,
//            multiStepVerbose: true,
//            elementsVerbose: true,
            channelId: tempoChannel.id,
            controlWriteMode: ControlChannelControlWriteMode.NONE
        });
    if (genInfo.useNaturalTempoChanges) {
        var naturalTempoElement = new NaturalTempoCurveControlElement();
        naturalTempoElement.baseTempo = songStructureInfo.baseTempo;
        naturalTempoElement.prevTempoUseExpression = true;
        naturalTempoElement.prevTempoExpression = prevSectionTempoVar.id;
        naturalTempoElement.currentTempoUseExpression = true;
        naturalTempoElement.currentTempoExpression = sectionTempoVar.id;
        naturalTempoElement.nextTempoUseExpression = true;
        naturalTempoElement.nextTempoExpression = nextSectionTempoVar.id;

        tempoControlLine.addControlElement(naturalTempoElement);
    }

    var structure = new Structure();
    structure.id = "structure";

    var measureVelocityCurve = new LinearInterpolationCurve();
    measureVelocityCurve.id = "measureVelocityCurve";
    module.addCurve(measureVelocityCurve);
    measureVelocityCurve.xValuesUseExpression = true;
    measureVelocityCurve.yValuesUseExpression = true;
    measureVelocityCurve.xValuesExpression = "[0, 1, 2, 3, 3.99]";
    measureVelocityCurve.yValuesExpression = "[1.0, 0.9, 0.95, 0.85, 0.85]";



    var sectionVelocityCurve = new ComputationCurve();
    sectionVelocityCurve.id = "sectionVelocityCurve";
    module.addCurve(sectionVelocityCurve);
    var modCompute = new PeriodicCurveComputation();
//    modCompute.verbose = true;
    modCompute.inputCurve = measureVelocityCurve.id;
    modCompute.periodUseExpression = true;
    modCompute.periodExpression = numeratorVar.id;
    sectionVelocityCurve.computation = modCompute;



    function createSectionModifiers(mods, arr, index) {
        for (var i=0; i<mods.length; i++) {
            var modInfo = mods[i];

            var sm = new SetVariableValueSectionModifier().setVariable(modInfo[0]);
            var valueExpression = modInfo[1];

            if (typeof(valueExpression) == "string") {
                if (!valueExpression.match(/[a-z]/i)) {
//                    logit("Value expression is simple? " + valueExpression);
                    sm.value = eval(valueExpression);
                } else {
                    sm.valueExpression = valueExpression;
                }
            } else {
                sm.valueExpression = valueExpression;
            }

            sm.id = "Set " + modInfo[0] + " section " + index;
            arr.push(sm);
        }

        var prefixes = ["melody", "inner1", "inner2", "bass", "percussion"];
        var counts = [3, 3, 3, 1];
        for (var i=0; i<prefixes.length; i++) {
            for (var j=0; j<counts[i]; j++) {
                var nvsm = new NoteVelocitiesSectionModifier();
                nvsm.curveGlobalTime = false;
                nvsm.curve = sectionVelocityCurve.id;

                nvsm.curveMultiplierUseExpression = true;
                nvsm.curveMultiplierExpression = prefixes[i] + "RenderAmountVar * 0.4 + 0.6";
                nvsm.channel = prefixes[i] + "RenderChannel" + (j+1);
//                logit(i + " " + j);
                arr.push(nvsm);
            }
        }
    }


    for (var i=0; i<sectionInfos.length; i++) {
        var sectionInfo = sectionInfos[i];
        var sectionRef = new SectionReference(section.id);
        var mods = sectionInfo.getSetVariableModifiers(genData);
        createSectionModifiers(mods, sectionRef.modifiers, i+1);
        structure.references.push(sectionRef);
    }

    module.addStructure(structure);

//    for (var i=0; i<module.controlChannels.length; i++) {
//        var cch = module.controlChannels[i];
//        logit("cch.id: " + cch.id);
//    }


    if (!(typeof(WebAudioRenderer) === "undefined")) {
        var waRenderer = new WebAudioRenderer();
        waRenderer.id = "webAudioRenderer";
        waRenderer.structure = module.getStructures()[0].id;

        var waEnv1 = new WebAudioADSREnvelope();
        waEnv1.id = "env1";
        var waEnv2 = new WebAudioADSREnvelope();
        waEnv2.id = "env2";
        waEnv2.attack = 0.01;
        waEnv2.release = 0.2;
        waEnv2.sustain = 0.0;

        waRenderer.envelopes = [waEnv1, waEnv2];

        var bufferCurve1 = new PredefinedCurve();
        bufferCurve1.id = "bufferCurve1";
        bufferCurve1.type = PredefinedCurveType.SQUARE;
        module.curves.push(bufferCurve1);

        var quadNoiseCurve1 = new PredefinedCurve();
        quadNoiseCurve1.id = "bufferCurve2";
        quadNoiseCurve1.type = PredefinedCurveType.QUADRATIC_NOISE;
        quadNoiseCurve1.frequency = 40;
        module.curves.push(quadNoiseCurve1);
        var quadNoiseCurve2 = new PredefinedCurve();
        quadNoiseCurve2.id = "bufferCurve3";
        quadNoiseCurve2.type = PredefinedCurveType.QUADRATIC_NOISE;
        quadNoiseCurve2.frequency = 220;
        module.curves.push(quadNoiseCurve2);

        var waBuffer1 = new WebAudioCurveBufferSource();
        waBuffer1.id = "buffer1";
        waBuffer1.curve = bufferCurve1.id;

        var waBuffer2 = new WebAudioCurveBufferSource();
        waBuffer2.id = "buffer2";
        waBuffer2.curve = quadNoiseCurve1.id;
        waBuffer2.adaptToFrequency = false;

        var waBuffer3 = new WebAudioCurveBufferSource();
        waBuffer3.id = "buffer3";
        waBuffer3.curve = quadNoiseCurve2.id;
        waBuffer3.adaptToFrequency = false;

        waRenderer.sources = [waBuffer1, waBuffer2, waBuffer3];

        var zoneCounter = 1;
        function createWebAudioZone(bufferId, noteInterval, ampEnvId) {
            var result = new WebAudioSourceZone();
            result.noteInterval = noteInterval ? noteInterval : [0, 127];
            result.id = "waSourceZone" + zoneCounter;
            result.amplitudeEnvelope = ampEnvId ? ampEnvId : "";
            zoneCounter++;
            result.source = bufferId;
            return result;
        }
        var waSourceZone1 = createWebAudioZone(waBuffer1.id);
        var waSourceZone2 = createWebAudioZone(waBuffer1.id);
        var waSourceZone3 = createWebAudioZone(waBuffer1.id);
        var waSourceZone4 = createWebAudioZone(waBuffer2.id, [36, 36], waEnv2.id);
        var waSourceZone5 = createWebAudioZone(waBuffer3.id, [38, 38], waEnv2.id);
        var waSourceZone6 = createWebAudioZone(waBuffer3.id, [42, 42], waEnv2.id);

        var waInstr1 = new WebAudioInstrument();
        waInstr1.id = "waInstrument1";
        waInstr1.zones = [waSourceZone1];

        var waInstr2 = new WebAudioInstrument();
        waInstr2.id = "waInstrument2";
        waInstr2.zones = [waSourceZone2];

        var waInstr3 = new WebAudioInstrument();
        waInstr3.id = "waInstrument3";
        waInstr3.zones = [waSourceZone3];

        var waInstr4 = new WebAudioInstrument();
        waInstr4.id = "percussionInstrument";
        waInstr4.zones = [waSourceZone4, waSourceZone5, waSourceZone6];

        waRenderer.instruments = [waInstr1, waInstr2, waInstr3, waInstr4];

        var waChannelInfo1 = new WebAudioRenderChannelInfo();
        waChannelInfo1.instrument = waInstr1.id;
        waChannelInfo1.renderChannel = "melodyRenderChannel1";

        var waChannelInfo2 = new WebAudioRenderChannelInfo();
        waChannelInfo2.instrument = waInstr2.id;
        waChannelInfo2.renderChannel = "inner1RenderChannel1";

        var waChannelInfo5 = new WebAudioRenderChannelInfo();
        waChannelInfo5.instrument = waInstr2.id;
        waChannelInfo5.renderChannel = "inner2RenderChannel1";

        var waChannelInfo3 = new WebAudioRenderChannelInfo();
        waChannelInfo3.instrument = waInstr3.id;
        waChannelInfo3.renderChannel = "bassRenderChannel1";

        var waChannelInfo4 = new WebAudioRenderChannelInfo();
        waChannelInfo4.instrument = waInstr4.id;
        waChannelInfo4.renderChannel = percussionRenderChannel1.id;

        waRenderer.channelInfos = [waChannelInfo1, waChannelInfo2, waChannelInfo3, waChannelInfo4, waChannelInfo5];

        module.addRenderer(waRenderer);
    }
//    if (!(typeof(PianoRollRenderer) === "undefined")) {
//        var prRenderer = new PianoRollRenderer();
//        prRenderer.id = "pianoRollRenderer";
//        prRenderer.structure = module.getStructures()[0].id;
//        module.addRenderer(prRenderer);
//    }
    if (!(typeof(JsonAudioRenderer) === "undefined")) {
        var jsonRenderer = new JsonRenderer();
        jsonRenderer.id = "jsonRenderer";
        jsonRenderer.structure = module.getStructures()[0].id;
        module.addRenderer(jsonRenderer);
    }
    if (!(typeof(MidiRenderer) === "undefined")) {
        var midiRenderer = new MidiRenderer();
        midiRenderer.id = "midiRenderer";
        midiRenderer.structure = module.getStructures()[0].id;

        function getIdsWithIdContains(str, arr) {
            var result = [];
            if (!arr) {
                arr = module.renderChannels;
            }
            for (var i=0; i<arr.length; i++) {
                var channel = arr[i];
                if (channel.id.indexOf(str) != -1) {
                    result.push(channel.id);
                }
            }
            return result;
        }

        var reverbSendType = MidiControllerType.EFFECTS_DEPTH_1;
        var chorusSendType = MidiControllerType.EFFECTS_DEPTH_3;


        var melodyRenderChannels = getIdsWithIdContains("melodyRenderChannel");
        var inner1RenderChannels = getIdsWithIdContains("inner1RenderChannel");
        var inner2RenderChannels = getIdsWithIdContains("inner2RenderChannel");
        var bassRenderChannels = getIdsWithIdContains("bassRenderChannel");

        var controlChannels = getIdsWithIdContains("ControlChannel", module.controlChannels);

        var controllerTypeMap = {
            "FilterF": MidiControllerType.SOUND_CONTROLLER_2,
            "FilterQ": MidiControllerType.SOUND_CONTROLLER_5,
            "Pan": MidiControllerType.PAN
        }

        if (genInfo.exportChordsToNewChannel) {
            var chId = chordsRenderChannel.id;
            var midiMap = new MidiChannelMap();
            midiMap.id = "Map for " + chId;
            midiMap.channel = 15;
            midiMap.renderChannel = chId;
            midiMap.program = 1;
            midiRenderer.channelMaps.push(midiMap);
        }

        for (var i=0; i<melodyRenderChannels.length; i++) {
            var mergeIndex = genInfo.mergeChannels ? 0 : i;
            var chId = melodyRenderChannels[i];
            var midiMap = new MidiChannelMap();
            midiMap.id = "Map for " + chId;
            midiMap.channel = mergeIndex;
            midiMap.renderChannel = chId;
            var program = genData.melodyChannelInstruments[mergeIndex % genData.melodyChannelInstruments.length];
            midiMap.program = program;
            if (!genInfo.mergeChannels) {
                var melodyReverbSend = 127 * genInfo.melodyReverbSends[mergeIndex % genInfo.melodyReverbSends.length];
                var melodyChorusSend = 127 * genInfo.melodyChorusSends[mergeIndex % genInfo.melodyChorusSends.length];
                var melodyVolume = 127 * genInfo.melodyVolumeMultipliers[mergeIndex % genInfo.melodyVolumeMultipliers.length];
                midiMap.initialControllerMessages = [
                    new InitialMidiControllerMessage().setType(MidiControllerType.VOLUME).setValue(melodyVolume),
                    new InitialMidiControllerMessage().setType(MidiControllerType.PAN).setValue(melodyPan),
                    new InitialMidiControllerMessage().setType(reverbSendType).setValue(melodyReverbSend),
                    new InitialMidiControllerMessage().setType(chorusSendType).setValue(melodyChorusSend)
                ];
            }
            midiRenderer.channelMaps.push(midiMap);
        }
        if (!genInfo.mergeChannels) {

            for (var i=0; i<controlChannels.length; i++) {
                var chId = controlChannels[i];
                var controlMap = new MidiControlChannelMap();
                controlMap.amplitude = 127.0;
                controlMap.id = "Map for " + chId;
                controlMap.controlChannel = chId;
                var offset = chId.indexOf("ControlChannel") + "ControlChannel".length;
                var controllerStr = chId.substring(offset, chId.length - 1);

                var voiceStr = chId.substring(0, chId.indexOf("ControlChannel"));
                //            logit("Voice str: '" + voiceStr + "'");

                var voiceIndex = parseInt(chId.substring(chId.length - 1, chId.length));
                //            logit("Voice index: '" + voiceIndex + "'");

                var channelOffset = 0;
                if (voiceStr == "inner1") {
                    channelOffset = 3;
                } else if (voiceStr == "inner2") {
                    channelOffset = 6;
                } else if (voiceStr == "percussion") {
                    channelOffset = 9;
                } else if (voiceStr == "bass") {
                    channelOffset = 11;
                }
                controlMap.channel = voiceIndex + channelOffset - 1;

                var controllerType = controllerTypeMap[controllerStr];
                if (typeof(controllerType) === 'undefined') {
                    logit("Could not find controller type for " + controllerStr);
                } else {
                    controlMap.controllerType = controllerType;
                    midiRenderer.controlChannelMaps.push(controlMap);
                }
            }
        }
        var volumeHints = [];
        for (var progStr in genInfo) {
            var program = parseInt(progStr);
            if (!isNaN(program)) {
                volumeHints[program] = 127 * genInfo[progStr];
            }
        }

        for (var i=0; i<inner1RenderChannels.length; i++) {
            var mergeIndex = genInfo.mergeChannels ? 3 : i + 3;
            var chId = inner1RenderChannels[i];
            var midiMap = new MidiChannelMap();
            midiMap.id = "Map for " + chId;
            midiMap.channel = mergeIndex;
            midiMap.renderChannel = chId;
            var program = genData.inner1ChannelInstruments[mergeIndex % genData.inner1ChannelInstruments.length];
            midiMap.program = program;

            if (!genInfo.mergeChannels) {

                var volume = 127;
                if (volumeHints[program]) {
                    volume = volumeHints[program];
                }
                volume *= genInfo.inner1VolumeMultipliers[i % genInfo.inner1VolumeMultipliers.length];
                var inner1ReverbSend = 127 * genInfo.inner1ReverbSends[i % genInfo.inner1ReverbSends.length];
                var inner1ChorusSend = 127 * genInfo.inner1ChorusSends[i % genInfo.inner1ChorusSends.length];

                midiMap.initialControllerMessages = [
                    new InitialMidiControllerMessage().setType(MidiControllerType.VOLUME).setValue(volume),
                    new InitialMidiControllerMessage().setType(MidiControllerType.PAN).setValue(inner1Pan),
                    new InitialMidiControllerMessage().setType(reverbSendType).setValue(inner1ReverbSend),
                    new InitialMidiControllerMessage().setType(chorusSendType).setValue(inner1ChorusSend)
                ];
            }
//            midiMap.initialControllerMessages = [new InitialMidiControllerMessage().setType(MidiControllerType.VOLUME).setValue(64)];
            midiRenderer.channelMaps.push(midiMap);
        }

        for (var i=0; i<inner2RenderChannels.length; i++) {
            var mergeIndex = genInfo.mergeChannels ? 6 : i + 6;

            var chId = inner2RenderChannels[i];
            var midiMap = new MidiChannelMap();
            midiMap.id = "Map for " + chId;
            midiMap.channel = mergeIndex;
            midiMap.renderChannel = chId;
            var program = genData.inner2ChannelInstruments[mergeIndex % genData.inner2ChannelInstruments.length];
            midiMap.program = program;

            if (!genInfo.mergeChannels) {

                var volume = 127;
                if (volumeHints[program]) {
                    volume = volumeHints[program];
                }
                volume *= genInfo.inner2VolumeMultipliers[i % genInfo.inner2VolumeMultipliers.length];

                var inner2ReverbSend = 127 * genInfo.inner2ReverbSends[i % genInfo.inner2ReverbSends.length];
                var inner2ChorusSend = 127 * genInfo.inner2ChorusSends[i % genInfo.inner2ChorusSends.length];

                midiMap.initialControllerMessages = [
                    new InitialMidiControllerMessage().setType(MidiControllerType.VOLUME).setValue(volume),
                    new InitialMidiControllerMessage().setType(MidiControllerType.PAN).setValue(inner2Pan),
                    new InitialMidiControllerMessage().setType(reverbSendType).setValue(inner2ReverbSend),
                    new InitialMidiControllerMessage().setType(chorusSendType).setValue(inner2ChorusSend)
                ];
            }
//            midiMap.initialControllerMessages = [new InitialMidiControllerMessage().setType(MidiControllerType.VOLUME).setValue(64)];
            midiRenderer.channelMaps.push(midiMap);
        }

        for (var i=0; i<bassRenderChannels.length; i++) {
            var mergeIndex = genInfo.mergeChannels ? 11 : i + 11;

            var chId = bassRenderChannels[i];
            var midiMap = new MidiChannelMap();
            midiMap.id = "Map for " + chId;
            midiMap.channel = mergeIndex;
            midiMap.renderChannel = chId;
            var program = genData.bassChannelInstruments[mergeIndex % genData.bassChannelInstruments.length];
            midiMap.program = program;

            if (!genInfo.mergeChannels) {
                var bassReverbSend = 127 * genInfo.bassReverbSends[i % genInfo.bassReverbSends.length];
                var bassChorusSend = 127 * genInfo.bassChorusSends[i % genInfo.bassChorusSends.length];

                var bassVolume = 127 * genInfo.bassVolumeMultipliers[i % genInfo.bassVolumeMultipliers.length];

                midiMap.initialControllerMessages = [
                    new InitialMidiControllerMessage().setType(MidiControllerType.VOLUME).setValue(bassVolume),
                    new InitialMidiControllerMessage().setType(MidiControllerType.PAN).setValue(bassPan),
                    new InitialMidiControllerMessage().setType(reverbSendType).setValue(bassReverbSend),
                    new InitialMidiControllerMessage().setType(chorusSendType).setValue(bassChorusSend)
                ];
            }
            midiRenderer.channelMaps.push(midiMap);
        }

        var percussionMidiMap = new MidiChannelMap();
        percussionMidiMap.id = "Map for " + percussionRenderChannel1.id;
        percussionMidiMap.channel = 9;
        percussionMidiMap.renderChannel = percussionRenderChannel1.id;
        percussionMidiMap.program = 0;
        if (!genInfo.mergeChannels) {

            var percussionVolume = 127 * genInfo.percussionVolumeMultiplier;
            percussionMidiMap.initialControllerMessages = [
                new InitialMidiControllerMessage().setType(MidiControllerType.VOLUME).setValue(percussionVolume),
                new InitialMidiControllerMessage().setType(reverbSendType).setValue(127 * genInfo.percussionReverbSend),
                new InitialMidiControllerMessage().setType(chorusSendType).setValue(127 * genInfo.percussionChorusSend)
            ];
        }
//        percussionMidiMap.initialControllerMessages = [new InitialMidiControllerMessage().setType(MidiControllerType.VOLUME).setValue(64)];
        midiRenderer.channelMaps.push(percussionMidiMap);

        module.addRenderer(midiRenderer);
    }

    moduleConstructTimer.pause();


    // Remove expression that are unneccesary
    traverseValue(module, function(v, propName, obj) {

//        if (propName.indexOf("_") >= 0) {
//            logit(propName);
//        }

        if (stringEndsWith(propName, "Expression")) {
            var valuePropName = propName.substring(0, propName.indexOf("Expression"));
            var useStr = valuePropName + "UseExpression";

            if (obj[useStr]) {
                // Found expression
                if (typeof(v) === "string" && !v.match(/[a-z]/i)) {
                    if (typeof(obj[valuePropName]) != 'undefined') {
                        obj[valuePropName] = eval(v);
                        obj[useStr] = false;
//                        logit("Evaluated expression value " + v + " to " + JSON.stringify(obj[valuePropName]));
                    } else {
//                        logit("Value prop name was undefined? " + valuePropName);
                    }
                } else {
//                    logit("Will evaluate expression " + v + " for property " + propName + " on obj " + obj._constructorName);
                }
//                    logit("useStr for " + propName + " = " + useStr + " value: " + v);
            }
        }

//        if (propName.indexOf("Expression") > 0) {
//            logit("Found expression property: " + propName + " " + v);
//        }
    });

    return module;
}


