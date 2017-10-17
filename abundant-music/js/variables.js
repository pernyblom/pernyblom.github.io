
function EditorFunctionOrVariable() {
    this.id = "";
    this._constructorName = "EditorFunctionOrVariable";
}


var EnumType = {
    POSITION_UNIT: 0,
    CHORD_TYPE: 1,
    SCALE_TYPE: 2,
    INDEX_TYPE: 3,
    SNAP_TYPE: 4,
    SNAP_METRICS: 5,
    VERTICAL_RELATIVE_TYPE: 6,
    INDEX_BORDER_MODE: 7,
    HORIZONTAL_RELATIVE_TYPE: 8,
    OFFSET_TYPE: 9,
    COUNT_UNIT: 10,
    PREDEFINED_CURVE_TYPE: 11,

    toString: function(unit) {
        switch (unit) {
            case EnumType.CHORD_TYPE:
                return "ChordType";
            case EnumType.COUNT_UNIT:
                return "CountUnit";
            case EnumType.HORIZONTAL_RELATIVE_TYPE:
                return "HorizontalRelativeType";
            case EnumType.INDEX_BORDER_MODE:
                return "IndexBorderMode";
            case EnumType.INDEX_TYPE:
                return "IndexType";
            case EnumType.OFFSET_TYPE:
                return "OffsetType";
            case EnumType.POSITION_UNIT:
                return "PositionUnit";
            case EnumType.SCALE_TYPE:
                return "ScaleType";
            case EnumType.SNAP_METRICS:
                return "SnapMetrics";
            case EnumType.SNAP_TYPE:
                return "SnapType";
            case EnumType.VERTICAL_RELATIVE_TYPE:
                return "VerticalRelativeType";
            case EnumType.PREDEFINED_CURVE_TYPE:
                return "PredefinedCurveType";
        }
        return "Unknown enum type " + unit;
    }
};
addPossibleValuesFunction(EnumType, EnumType.POSITION_UNIT, EnumType.PREDEFINED_CURVE_TYPE);



function SimpleEnumEditorVariable() {
    EditorFunctionOrVariable.call(this);
    this.enumType = EnumType.POSITION_UNIT;
    
    this.positionUnitValue = PositionUnit.BEATS;
    this.chordTypeValue = ChordType.TRIAD;
    this.scaleTypeValue = ScaleType.MAJOR;
    this.indexTypeValue = IndexType.SCALE;
    this.snapTypeValue = SnapType.NONE;
    this.snapMetricsValue = SnapMetrics.ROUND;
    this.verticalRelativeTypeValue = VerticalRelativeType.CHORD_ROOT;
    this.horizontalRelativeTypeValue = HorizontalRelativeType.NEXT_NOTE;
    this.indexBorderModeValue = IndexBorderMode.RESTART;
    this.offsetTypeValue = OffsetType.SCALE;
    this.countUnitValue = CountUnit.PLAIN;
    this.predefinedCurveTypeValue = PredefinedCurveType.CONSTANT;

    this._constructorName = "SimpleEnumEditorVariable";
}
SimpleEnumEditorVariable.prototype = new EditorFunctionOrVariable();

SimpleEnumEditorVariable.prototype.getValue = function(module) {
    switch (this.enumType) {
        case EnumType.CHORD_TYPE:
            return this.chordTypeValue;
        case EnumType.COUNT_UNIT:
            return this.countUnitValue;
        case EnumType.HORIZONTAL_RELATIVE_TYPE:
            return this.horizontalRelativeTypeValue;
        case EnumType.INDEX_BORDER_MODE:
            return this.indexBorderModeValue;
        case EnumType.INDEX_TYPE:
            return this.indexTypeValue;
        case EnumType.OFFSET_TYPE:
            return this.offsetTypeValue;
        case EnumType.POSITION_UNIT:
            return this.positionUnitValue;
        case EnumType.PREDEFINED_CURVE_TYPE:
            return this.predefinedCurveTypeValue;
        case EnumType.SCALE_TYPE:
            return this.scaleTypeValue;
        case EnumType.SNAP_METRICS:
            return this.snapMetricsValue;
        case EnumType.SNAP_TYPE:
            return this.snapTypeValue;
        case EnumType.VERTICAL_RELATIVE_TYPE:
            return this.verticalRelativeTypeValue;
    }
    return 0;
};


function BooleanEditorVariable() {
    EditorFunctionOrVariable.call(this);
    this._constructorName = "BooleanEditorVariable";
}

BooleanEditorVariable.prototype = new EditorFunctionOrVariable();


function SimpleBooleanEditorVariable() {
    BooleanEditorVariable.call(this);
    this.value = false;

    this._constructorName = "SimpleBooleanEditorVariable";
}
SimpleBooleanEditorVariable.prototype = new BooleanEditorVariable();

SimpleBooleanEditorVariable.prototype.getValue = function(module) {
    return this.value;
};





function ObjectEditorVariable() {
    EditorFunctionOrVariable.call(this);
    this._constructorName = "ObjectEditorVariable";
}

ObjectEditorVariable.prototype = new EditorFunctionOrVariable();


function SimpleObjectEditorVariable() {
    ObjectEditorVariable.call(this);

    this.value = {};

    this._constructorName = "SimpleObjectEditorVariable";
}
SimpleObjectEditorVariable.prototype = new ObjectEditorVariable();

SimpleObjectEditorVariable.prototype.getValue = function(module) {
    return getValueOrExpressionValue(this, "value", module);
};




function StringEditorVariable() {
    EditorFunctionOrVariable.call(this);
    this._constructorName = "StringEditorVariable";
}

StringEditorVariable.prototype = new EditorFunctionOrVariable();


function SimpleStringEditorVariable() {
    StringEditorVariable.call(this);
    this.value = "";

    this._constructorName = "SimpleStringEditorVariable";
}
SimpleStringEditorVariable.prototype = new StringEditorVariable();

SimpleStringEditorVariable.prototype.getValue = function(module) {
    return this.value;
};




var EditorIdReferenceType = {

    STRUCTURE: 0,
    SECTION: 1,
    HARMONY: 2,
    MOTIF: 3,
    PERCUSSION_MOTIF: 4,
    RYTHM: 5,
    CURVE: 6,
    RENDER_CHANNEL: 7,
    CONTROL_CHANNEL: 8,
    NAMED_NOTE: 9,

    toString: function(unit) {
        switch (unit) {
            case EditorIdReferenceType.CONTROL_CHANNEL:
                return "Control channel";
            case EditorIdReferenceType.CURVE:
                return "Curve";
            case EditorIdReferenceType.HARMONY:
                return "Harmony";
            case EditorIdReferenceType.MOTIF:
                return "Motif";
            case EditorIdReferenceType.NAMED_NOTE:
                return "Named note";
            case EditorIdReferenceType.PERCUSSION_MOTIF:
                return "Percussion motif";
            case EditorIdReferenceType.RENDER_CHANNEL:
                return "Render channel";
            case EditorIdReferenceType.RYTHM:
                return "Rythm";
            case EditorIdReferenceType.SECTION:
                return "Section";
            case EditorIdReferenceType.STRUCTURE:
                return "Structure";
        }
        return "Unknown id reference type " + unit;
    }
};
addPossibleValuesFunction(EditorIdReferenceType, EditorIdReferenceType.HARMONY, EditorIdReferenceType.NAMED_NOTE);



function IdReferenceEditorVariable() {
    StringEditorVariable.call(this);
    this.referenceType = EditorIdReferenceType.HARMONY;
    this.structure = "";
    this.section = "";
    this.harmony = "";
    this.motif = "";
    this.percussionMotif = "";
    this.rythm = "";
    this.curve = "";
    this.renderChannel = "";
    this.controlChannel = "";
    this.namedNote = "";

    this._constructorName = "IdReferenceEditorVariable";
}
IdReferenceEditorVariable.prototype = new StringEditorVariable();

IdReferenceEditorVariable.prototype.getValue = function(module) {
    switch (this.referenceType) {
        case EditorIdReferenceType.CONTROL_CHANNEL:
            return this.controlChannel
        case EditorIdReferenceType.CURVE:
            return this.curve;
        case EditorIdReferenceType.HARMONY:
            return this.harmony;
        case EditorIdReferenceType.MOTIF:
            return this.motif;
        case EditorIdReferenceType.NAMED_NOTE:
            return this.namedNote;
        case EditorIdReferenceType.PERCUSSION_MOTIF:
            return this.percussionMotif;
        case EditorIdReferenceType.RENDER_CHANNEL:
            return this.renderChannel;
        case EditorIdReferenceType.RYTHM:
            return this.rythm;
        case EditorIdReferenceType.SECTION:
            return this.section;
        case EditorIdReferenceType.STRUCTURE:
            return this.structure;
    }
    return "";
};







function DoubleEditorVariable() {
    EditorFunctionOrVariable.call(this);
    this._constructorName = "DoubleEditorVariable";
}

DoubleEditorVariable.prototype = new EditorFunctionOrVariable();


function SimpleDoubleEditorVariable() {
    DoubleEditorVariable.call(this);
    this.value = 0.0;

    this._constructorName = "SimpleDoubleEditorVariable";
}
SimpleDoubleEditorVariable.prototype = new DoubleEditorVariable();

SimpleDoubleEditorVariable.prototype.getValue = function(module) {
    return this.value;
};



function IntegerEditorVariable() {
    EditorFunctionOrVariable.call(this);
    this._constructorName = "IntegerEditorVariable";
}

IntegerEditorVariable.prototype = new EditorFunctionOrVariable();


function SimpleIntegerEditorVariable() {
    IntegerEditorVariable.call(this);
    this.value = 0;

    this._constructorName = "SimpleIntegerEditorVariable";
}
SimpleIntegerEditorVariable.prototype = new IntegerEditorVariable();


SimpleIntegerEditorVariable.prototype.getValue = function(module) {
    return this.value;
};




function DoubleArrayEditorVariable() {
    EditorFunctionOrVariable.call(this);
    this._constructorName = "DoubleArrayEditorVariable";
}

DoubleArrayEditorVariable.prototype = new EditorFunctionOrVariable();

DoubleArrayEditorVariable.prototype.getValue = function(module) {
    return [];
};

function SimpleDoubleArrayEditorVariable() {
    DoubleArrayEditorVariable.call(this);
    this.value = [];

    this._constructorName = "SimpleDoubleArrayEditorVariable";
}
SimpleDoubleArrayEditorVariable.prototype = new DoubleArrayEditorVariable();


SimpleDoubleArrayEditorVariable.prototype.getValue = function(module) {
    return this.value;
};



function IntegerArrayEditorVariable() {
    EditorFunctionOrVariable.call(this);
    this._constructorName = "IntegerArrayEditorVariable";
}

IntegerArrayEditorVariable.prototype = new EditorFunctionOrVariable();

IntegerArrayEditorVariable.prototype.getValue = function(module) {
    return [];
};


function IntegerArray2DEditorVariable() {
    EditorFunctionOrVariable.call(this);
    this._constructorName = "IntegerArray2DEditorVariable";
}

IntegerArray2DEditorVariable.prototype = new EditorFunctionOrVariable();

IntegerArray2DEditorVariable.prototype.getValue = function(module) {
    return [];
};

function SimpleIntegerArray2DEditorVariable() {
    IntegerArray2DEditorVariable.call(this);
    this.value = [];

    this._constructorName = "SimpleIntegerArray2DEditorVariable";
}
SimpleIntegerArray2DEditorVariable.prototype = new IntegerArray2DEditorVariable();

SimpleIntegerArray2DEditorVariable.prototype.getValue = function(module) {
    return this.value;
};



function SimpleRandomIntegerArrayEditorVariable() {
    IntegerArrayEditorVariable.call(this);
    this.seed = 12345;
    this.count = 10;
    this.domain = [0, 1];
    this.domainLikelihoods = [1];

    this._constructorName = "SimpleRandomIntegerArrayEditorVariable";
}

SimpleRandomIntegerArrayEditorVariable.prototype = new IntegerArrayEditorVariable();

SimpleRandomIntegerArrayEditorVariable.prototype.getValue = function(module, params) {
    var theSeed = getValueOrDefault(params, "seed", this.seed);
    var theCount = getValueOrDefault(params, "count", this.count);
    var rnd = new MersenneTwister(theSeed);
    var theLikelihoods = this.domainLikelihoods;
    if (theLikelihoods.length == 0) {
        theLikelihoods = [1];
    }
    var theDomain = this.domain;
    if (theDomain.length == 0) {
        theDomain = [0];
    }
    var dist = getProbabilityDistribution(createFilledPatternArray(theCount, theLikelihoods));

    var result = [];
    for (var i=0; i<theCount; i++) {
        var index = sampleIndexIntegerDistribution(rnd, dist);
        var element = theDomain[index % theDomain.length];
        result.push(element)
    }
    return result;
};




function MarkovRandomIntegerArrayEditorVariable() {
    IntegerArrayEditorVariable.call(this);
    this.seed = 12345;
    this.count = 10;
    this.startStates = [0, 1];
    this.startStateLikelihoods = [1, 1];
    this.stateDomains = [[0], [1]];
    this.stateDomainLikelihoods = [[1], [1]];
    this.stateTransitionLikelihoods = [[1, 1], [1, 1]];

    this._constructorName = "MarkovRandomIntegerArrayEditorVariable";
}

MarkovRandomIntegerArrayEditorVariable.prototype = new IntegerArrayEditorVariable();

MarkovRandomIntegerArrayEditorVariable.prototype.getValue = function(module, params) {
    var theSeed = getValueOrDefault(params, "seed", this.seed);
    var theCount = getValueOrDefault(params, "count", this.count);
    var rnd = new MersenneTwister(theSeed);


    var theStartStates = this.startStates;
    if (theStartStates.length == 0) {
        theStartStates = [0];
    }
    var theStartStateLikelihoods = this.startStateLikelihoods;
    if (theStartStateLikelihoods.length == 0) {
        theStartStateLikelihoods = [1];
    }

    var theStateDomains = this.stateDomains;
    if (theStateDomains.length == 0) {
        theStateDomains = [[0]];
    }
    for (var i=0; i<theStateDomains.length; i++) {
        var dom = theStateDomains[i];
        if (dom.length == 0) {
            theStateDomains[i] = [0];
        }
    }

    var stateDomainDistributions = [];
    for (var i=0; i<this.stateDomainLikelihoods.length; i++) {
        var lik = this.stateDomainLikelihoods[i];
        var dist = getProbabilityDistribution(lik);
        stateDomainDistributions[i] = dist;
    }

    var stateTransitionDistributions = [];
    for (var i=0; i<this.stateTransitionLikelihoods.length; i++) {
        var lik = this.stateTransitionLikelihoods[i];
        var dist = getProbabilityDistribution(lik);
        stateTransitionDistributions[i] = dist;
    }

    var startStateDistribution = getProbabilityDistribution(createFilledPatternArray(theStartStates.length,
        this.startStateLikelihoods));

    var currentState = sampleIndexIntegerDistribution(rnd, startStateDistribution);

    var result = [];
    for (var i=0; i<theCount; i++) {
        // Sample from the domain
        var domain = theStateDomains[currentState % theStateDomains.length];

        var domainDistribution = stateDomainDistributions[currentState % stateDomainDistributions.length];

        var domainIndex = sampleIndexIntegerDistribution(rnd, domainDistribution);

        var element = domain[domainIndex % domain.length];
        
        result.push(element);

        var stateTransitionDistribution = stateTransitionDistributions[currentState % stateTransitionDistributions.length];

        currentState = sampleIndexIntegerDistribution(rnd, stateTransitionDistribution);
    }
    return result;
};



function SimpleIntegerArrayEditorVariable() {
    IntegerArrayEditorVariable.call(this);
    this.value = [];

    this._constructorName = "SimpleIntegerArrayEditorVariable";
}
SimpleIntegerArrayEditorVariable.prototype = new IntegerArrayEditorVariable();

SimpleIntegerArrayEditorVariable.prototype.getValue = function(module) {
    return this.value;
};


function PatternIntegerArrayEditorVariable() {
    IntegerArrayEditorVariable.call(this);
    this.count = 0;
    this.elements = [];
    this.startElements = [];
    this.endElements = [];

    this._constructorName = "PatternIntegerArrayEditorVariable";
}
PatternIntegerArrayEditorVariable.prototype = new IntegerArrayEditorVariable();

PatternIntegerArrayEditorVariable.prototype.getValue = function(module) {
    var result = [];
    for (var i=0; i<this.count; i++) {
        var value = getItemFromArrayWithStartEndItems(0, this.elements, this.count, i, this.startElements, this.endElements);
        result.push(value);
    }
    return result;
};

function PatternDoubleArrayEditorVariable() {
    DoubleArrayEditorVariable.call(this);
    this.count = 0;
    this.elements = [];
    this.startElements = [];
    this.endElements = [];

    this._constructorName = "PatternDoubleArrayEditorVariable";
}
PatternDoubleArrayEditorVariable.prototype = new DoubleArrayEditorVariable();

PatternDoubleArrayEditorVariable.prototype.getValue = function(module) {
    var result = [];
    for (var i=0; i<this.count; i++) {
        var value = getItemFromArrayWithStartEndItems(0, this.elements, this.count, i, this.startElements, this.endElements);
        result.push(value);
    }
    return result;
};



