
var MajorMixtureChordType = {
    I: 0, // Lowered 3
    II6: 1, // Lowered 6
    IV: 2, // Lowered 6
    VI: 3 // Lowered 3 and 6
};


var MinorMixtureChordType = {
    I: 0 // Raised 3
};


var DynamicHarmonyModulationTarget = {
    NONE: -1,
    SUPERTONIC: 0,
    MEDIANT: 1,
    SUBDOMINANT: 2,
    DOMINANT: 3,
    SUBMEDIANT: 4,
    SUBTONIC: 5,

    invert: function(modulationTarget) {
        switch (modulationTarget) {
            case DynamicHarmonyModulationTarget.SUPERTONIC:
                return DynamicHarmonyModulationTarget.SUBTONIC;
            case DynamicHarmonyModulationTarget.DOMINANT:
                return DynamicHarmonyModulationTarget.SUBDOMINANT;
            case DynamicHarmonyModulationTarget.MEDIANT:
                return DynamicHarmonyModulationTarget.SUBMEDIANT;
            case DynamicHarmonyModulationTarget.SUBDOMINANT:
                return DynamicHarmonyModulationTarget.DOMINANT;
            case DynamicHarmonyModulationTarget.SUBMEDIANT:
                return DynamicHarmonyModulationTarget.MEDIANT;
            case DynamicHarmonyModulationTarget.SUBTONIC:
                return DynamicHarmonyModulationTarget.SUPERTONIC;
        }
        return modulationTarget;
    },

    getScaleType: function(scaleType, modulationTarget, invertType) {
        var otherScaleType = scaleType == ScaleType.MAJOR ? ScaleType.NATURAL_MINOR : ScaleType.MAJOR;

        switch (modulationTarget) {
            case DynamicHarmonyModulationTarget.SUPERTONIC:
            case DynamicHarmonyModulationTarget.MEDIANT:
            case DynamicHarmonyModulationTarget.SUBMEDIANT:
            case DynamicHarmonyModulationTarget.SUBTONIC:
                return invertType ? scaleType : otherScaleType;
        }
        return invertType ? otherScaleType : scaleType;
    },

    toString: function(type) {
        switch (type) {
            case DynamicHarmonyModulationTarget.DOMINANT:
                return "Dominant";
            case DynamicHarmonyModulationTarget.MEDIANT:
                return "Mediant";
            case DynamicHarmonyModulationTarget.SUBDOMINANT:
                return "Subdominant";
            case DynamicHarmonyModulationTarget.SUBMEDIANT:
                return "Submediant";
            case DynamicHarmonyModulationTarget.SUBTONIC:
                return "Subtonic";
            case DynamicHarmonyModulationTarget.SUPERTONIC:
                return "Supertonic";
            case DynamicHarmonyModulationTarget.NONE:
                return "None";
        }
        return "Unknown modulation target " + type;
    }
};
addPossibleValuesFunction(DynamicHarmonyModulationTarget, DynamicHarmonyModulationTarget.NONE, DynamicHarmonyModulationTarget.SUBTONIC);


var AppliedChordType = {
    V: 0,
    V6: 1,
    V7: 2,
    V65: 3,
    V43: 4,
    V42: 5,
    VII: 6,
    VII6: 7,
    VII7: 8,

    toString: function(type) {
        switch (type) {
            case AppliedChordType.V:
                return "V";
            case AppliedChordType.V42:
                return "V42";
            case AppliedChordType.V43:
                return "V43";
            case AppliedChordType.V65:
                return "V65";
            case AppliedChordType.V6:
                return "V6";
            case AppliedChordType.V7:
                return "V7";
            case AppliedChordType.VII:
                return "VII";
            case AppliedChordType.VII6:
                return "VII6";
            case AppliedChordType.VII7:
                return "VII7";
        }
        return "Unknown applied chord type " + type;
    }
};
addPossibleValuesFunction(AppliedChordType, AppliedChordType.V, AppliedChordType.VII7);

