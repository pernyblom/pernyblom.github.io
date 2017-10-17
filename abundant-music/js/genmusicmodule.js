

function GenMusicModule() {
    this.id = "module1";
    this.renderers = [];
    this.structures = [];
    this.sections = [];
    this.harmony = [];
    this.percussionMotifs = [];
    this.motifs = [];
    this.motifGroups = [];
    this.rythms = [];
    this.rythmGroups = [];
    this.curves = [];
    this.curveGroups = [];
    this.parameters = [];
    this.renderChannels = [];
    this.namedNotes = [];
    this.controlChannels = [];
    this.voiceLinePlanners = [];
    this.figurationPlanners = [];
    this._variables = [];
    this._variablesHash = {};
    this.procedures = [];

    // Stuff that are normally somewhere else but can be named and reused

    // Voice lines are normally part of a section, but can be named and used for harmony generation.
    // Good for using an existing melody/bass and harmonize it
    this.voiceLines = []; 
    this.idCounters = {};

    this.reusables = {};

    this._constructorName = "GenMusicModule";
}




GenMusicModule.prototype.getUniqueId = function(prefix, testArr) {
    var counter = this.idCounters[prefix];
    for (var j=0; j<100; j++) {
        if (counter) {
            counter++;
        } else {
            counter = 1;
            this.idCounters[prefix] = counter;
        }
        var str = prefix + "" + counter;
        var found = false;
        for (var i=0; i<testArr.length; i++) {
            if (str == testArr[i].id) {
                found = true;
                break;
            }
        }
        if (!found) {
            return str;
        }
    }
    logit("failed to find unique id with prefix " + prefix + " and arr " + testArr + "<br />");
};

GenMusicModule.prototype.deleteRythm = function(r) {
    arrayDelete(this.rythms, r);
    return this;
};


GenMusicModule.prototype.setRythms = function(r) {
    this.rythms = r;
    return this;
};


GenMusicModule.prototype.getRythms = function() {
    return this.rythms;
};

GenMusicModule.prototype.getMotifs = function() {
    return this.motifs;
};

GenMusicModule.prototype.getCurves = function() {
    return this.curves;
};

GenMusicModule.prototype.getHarmonies = function() {
    return this.harmony;
};
GenMusicModule.prototype.getSections = function() {
    return this.sections;
};

GenMusicModule.prototype.getStructures = function() {
    return this.structures;
};



GenMusicModule.prototype.addRenderer = function(s) {
    this.renderers.push(s);
    return this;
};
GenMusicModule.prototype.addStructure = function(s) {
    this.structures.push(s);
    return this;
};
GenMusicModule.prototype.addSection = function(s) {
    this.sections.push(s);
    return this;
};
GenMusicModule.prototype.addHarmony = function(s) {
    this.harmony.push(s);
    return this;
};
GenMusicModule.prototype.addMotif = function(m) {
    this.motifs.push(m);
    return this;
};
GenMusicModule.prototype.addMotifGroup = function(s) {
    this.motifGroups.push(s);
    return this;
};
GenMusicModule.prototype.addRythm = function(s) {
    this.rythms.push(s);
    return this;
};
GenMusicModule.prototype.addRythmGroup = function(s) {
    this.rythmGroups.push(s);
    return this;
};
GenMusicModule.prototype.addCurve = function(s) {
    this.curves.push(s);
    return this;
};
GenMusicModule.prototype.addCurveGroup = function(s) {
    this.curveGroups.push(s);
    return this;
};
GenMusicModule.prototype.addParameter = function(s) {
    this.parameters.push(s);
    return this;
};
GenMusicModule.prototype.addRenderChannel = function(s) {
    this.renderChannels.push(s);
    return this;
};
GenMusicModule.prototype.addControlChannel = function(s) {
    this.controlChannels.push(s);
    return this;
};
GenMusicModule.prototype.addVoiceLinePlanner = function(s) {
    this.voiceLinePlanners.push(s);
    return this;
};
GenMusicModule.prototype.addVariable = function(s) {
    this._variables.push(s);
    this._variablesHash[s.id] = s;
    return this;
};
GenMusicModule.prototype.getVariables = function() {
    return this._variables;
};

GenMusicModule.prototype.getRythm = function(id) {
    return getObjectWithId(id, this.rythms);
};
GenMusicModule.prototype.getVariable = function(id) {
    return this._variablesHash[id];
};

GenMusicModule.prototype.getRythmGroup = function(id) {
    return getObjectWithId(id, this.rythmGroups);
};

GenMusicModule.prototype.getCurve = function(id) {
    return getObjectWithId(id, this.curves);
};

GenMusicModule.prototype.getCurveGroup = function(id) {
    return getObjectWithId(id, this.curveGroups);
};

GenMusicModule.prototype.getParameter = function(id) {
    return getObjectWithId(id, this.parameters);
};
GenMusicModule.prototype.getSynthRenderer = function(id) {
    return getObjectWithId(id, this.renderers);
};
GenMusicModule.prototype.getRenderer = function(id) {
    return getObjectWithId(id, this.renderers);
};

GenMusicModule.prototype.getStructure = function(id) {
    return getObjectWithId(id, this.structures);
};

GenMusicModule.prototype.getSection = function(id) {
    return getObjectWithId(id, this.sections);
};

GenMusicModule.prototype.getHarmony = function(id) {
    return getObjectWithId(id, this.harmony);
};

GenMusicModule.prototype.getMotif = function(id) {
    return getObjectWithId(id, this.motifs);
};

GenMusicModule.prototype.getNamedNote = function(id) {
    return getObjectWithId(id, this.namedNotes);
};

GenMusicModule.prototype.getPercussionMotif = function(id) {
    return getObjectWithId(id, this.percussionMotifs);
};

GenMusicModule.prototype.getMotifGroup = function(id) {
    return getObjectWithId(id, this.motifGroups);
};

GenMusicModule.prototype.getControlChannel = function(id) {
    return getObjectWithId(id, this.controlChannels);
};

GenMusicModule.prototype.getRenderChannel = function(id) {
    return getObjectWithId(id, this.renderChannels);
};

GenMusicModule.prototype.getVoiceLinePlanner = function(id) {
    return getObjectWithId(id, this.voiceLinePlanners);
};
GenMusicModule.prototype.getFigurationPlanner = function(id) {
    return getObjectWithId(id, this.figurationPlanners);
};



GenMusicModule.prototype.renderBatch = function(structureId) {

    var result = new RenderData();
    var structure = this.getStructure(structureId);
    if (structure) {
        var state = new RenderState(this, result);
        //        logit("Rendering structure from module ");

        structure.renderBatch(state);
    } else {
        logit( " could not find structure "
            + structureId);
    }
    return result;
};

GenMusicModule.prototype.toJSON = function() {
    // Create a pure JSON
    };


function createGenMusicModuleFromJson(options) {
    
    // Options can be all JSON but can also contain "real" objects without a "jsonType" property
    // In such cases, when a jsonType is necessary for knowing which constructor to use, JSON2
    // is called on the object first which must then provide a correct object with the jsonType
    // property set.

    var moduleOptions = {
        motifs: [
        {
            id: "motif",
            motifElements: [
            {
                jsonType: "VerticalRelativeMotifElement",
                length: 1,
                index: 2
            }
            ]
        }
        ],
        sections: [
        {
            voiceLines: [
            {
                id: "voiceLine",
                jsonType: "ConstantVoiceLine",
                lineElements: []
            }
            ],
            renderLines: [
            {
                id: "renderLine",
                channel: "renderChannel",
                renderElements: [
                {
                    jsonType: "MotifRenderElement",
                    motif: "motif",
                    voiceLine: "voiceLine"
                }
                ]
            }
            ]
        }
        ],
        structures: [],
        harmony: []
    };

}



