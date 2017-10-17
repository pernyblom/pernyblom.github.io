

var PercussionMotifMode = {
    RYTHM_AND_ZONES: 0,
    RYTHM_AND_RENDER_PATTERN: 1,
    ELEMENTS: 2,

    toString: function(type) {
        switch (type) {
            case PercussionMotifMode.ELEMENTS:
                return "Elements";
            case PercussionMotifMode.RYTHM_AND_RENDER_PATTERN:
                return "Rythm and render pattern";
            case PercussionMotifMode.RYTHM_AND_ZONES:
                return "Rythm and zones";
        }
        return "Unknown percussion motif mode " + type;
    }

};
addPossibleValuesFunction(PercussionMotifMode, PercussionMotifMode.RYTHM_AND_ZONES, PercussionMotifMode.ELEMENTS);


function AbstractPercussionMotif() {
    this.id = "";
    this.seed = 12345;
    this.useExternalSeed = false;

    this._constructorName = "AbstractPercussionMotif";
}


function PercussionMotif() {
    AbstractPercussionMotif.call(this);
    this.mode = PercussionMotifMode.ELEMENTS;
    this.rythm = "";
    this.elements = [];
    this.zones = [];
    this.modifiers = [];

    // These are used when mode is RYTHM_AND_RENDER_PATTERN
    this.namedNotes = []; // Indexed from the render pattern
    this.renderPattern = [[0]]; // list 2d, negative means rest
    this.startRenderPattern = []; // list 2d
    this.endRenderPattern = []; // list 2d

    this._constructorName = "PercussionMotif";
}

PercussionMotif.prototype = new AbstractPercussionMotif();

PercussionMotif.prototype.getPercussionMotifElementsFromRythmAndZones = function(module, noteRythmElements,
                                                                                 harmony, harmonyBeatOffset) {
    var result = [];



//    logit(this._constructorName + " gettting note rythm elements" + JSON.stringify(this.zones));

    // Should have different classes (one-of, non-overlap osv.)
    for (var i=0; i<this.zones.length; i++) {
        var zone = this.zones[i];
        var list = zone.getPercussionMotifElements(module, noteRythmElements, harmony, harmonyBeatOffset);

        addAll(result, list);
    }

    return result;
};


PercussionMotif.prototype.getPercussionMotifElementsFromRythmAndRenderPattern = function(module, noteRythmElements,
                                                                                         harmony, harmonyBeatOffset) {
    var result = [];
    return result;
};

PercussionMotif.prototype.getPrimitivePercussionMotifElements = function(module, harmony, harmonyBeatOffset) {
    var result = [];

//    if (this.verbose) {
//        logit(this._constructorName + " " + harmony.get(0).tsNumerator);
//    }
    switch (this.mode) {
        case PercussionMotifMode.RYTHM_AND_ZONES:
        case PercussionMotifMode.RYTHM_AND_RENDER_PATTERN:
            var theRythm = module.getRythm(this.rythm);
            if (theRythm) {
                var list = [];
                var noteRythmElements = theRythm.getNoteRythmElements(module, harmony, harmonyBeatOffset);
                if (this.mode == PercussionMotifMode.RYTHM_AND_ZONES) {
                    list = this.getPercussionMotifElementsFromRythmAndZones(module, noteRythmElements, harmony, harmonyBeatOffset);
                } else if (this.mode == PercussionMotifMode.RYTHM_AND_RENDER_PATTERN) {
                    list = this.getPercussionMotifElementsFromRythmAndRenderPattern(module, noteRythmElements, harmony, harmonyBeatOffset);
                }
                addAll(result, list);
            } else {
                logit(this._constructorName + " Could not find rythm " + this.rythm + "<br />");
            }
            break;
        case PercussionMotifMode.ELEMENTS:
            for (var i=0; i<this.elements.length; i++) {
                var e = this.elements[i];
                var list = e.getPrimitivePercussionMotifElements(module, harmony, harmonyBeatOffset);
                addAll(result, list);
            }
            break;
    }
    return result;
};


function SingleElementPercussionMotif() {
    AbstractPercussionMotif.call(this);
    this.element = new PredefinedPercussionMotifElement();

    this._constructorName = "SingleElementPercussionMotif";
}

SingleElementPercussionMotif.prototype = new AbstractPercussionMotif();


SingleElementPercussionMotif.prototype.getPrimitivePercussionMotifElements = function(module, harmony, harmonyBeatOffset) {
    return this.element.getPrimitivePercussionMotifElements(module, harmony, harmonyBeatOffset);
};

function PercussionMotifElement() {
    this.id = "";
    this.renderChannel = "";
    this._constructorName = "PercussionMotifElement";
}

PercussionMotifElement.prototype.getPrimitivePercussionMotifElements = function(module, harmony, harmonyBeatOffset) {
    return [this];
};


function PrimitivePercussionMotifElement() {
    PercussionMotifElement.call(this);

    this.startTime = 0;
    this.startTimeUnit = PositionUnit.BEATS;

    this.length = 1;
    this.lengthUnit = PositionUnit.BEATS;

    this.rest = false;

    this.strength = 1.0;

    this.note = 60;

    this._constructorName = "PrimitivePercussionMotifElement";
}

PrimitivePercussionMotifElement.prototype = new PercussionMotifElement();


