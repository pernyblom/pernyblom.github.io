

// Chord types
var SoundFontType = {
    STANDARD_LIGHT: 0,
    STANDARD_HEAVY: 1,
//    NES_STYLE: 2,
    SNES_STYLE: 2,
//    OPL2FM_STYLE: 4,
    GXSCC_STYLE: 3,
//    GB_STYLE: 6,

    getSamplesPrefix: function(type) {
        switch (type) {
            case SoundFontType.STANDARD_LIGHT:
                return "standard_light";
            case SoundFontType.STANDARD_HEAVY:
                return "standard_heavy";
//            case SoundFontType.NES_STYLE:
//                return "nes_style";
//            case SoundFontType.OPL2FM_STYLE:
//                return "opl2fm_style";
            case SoundFontType.SNES_STYLE:
                return "snes_style";
            case SoundFontType.GXSCC_STYLE:
                return "gxscc_style";
//            case SoundFontType.GB_STYLE:
//                return "gb_style";
        }
        return "Unknown soundfont type " + type;
    },


    toString: function(type) {
        switch (type) {
            case SoundFontType.STANDARD_LIGHT:
                return "Standard (light)";
            case SoundFontType.STANDARD_HEAVY:
                return "Standard (heavy)";
//            case SoundFontType.NES_STYLE:
//                return "NES Style";
//            case SoundFontType.OPL2FM_STYLE:
//                return "OPL2 FM Style";
            case SoundFontType.SNES_STYLE:
                return "SNES Style";
            case SoundFontType.GXSCC_STYLE:
                return "GXSCC Style";
//            case SoundFontType.GB_STYLE:
//                return "GB Style";
        }
        return "Unknown soundfont type " + type;
    },

    toShortString: function(type) {
        switch (type) {
            case SoundFontType.STANDARD_LIGHT:
                return "Light";
            case SoundFontType.STANDARD_HEAVY:
                return "Heavy";
//            case SoundFontType.NES_STYLE:
//                return "NES";
//            case SoundFontType.OPL2FM_STYLE:
//                return "OPL2";
            case SoundFontType.SNES_STYLE:
                return "SNES";
            case SoundFontType.GXSCC_STYLE:
                return "GXSCC";
//            case SoundFontType.GB_STYLE:
//                return "GB";
        }
        return "Unknown soundfont type " + type;
    }


};
addPossibleValuesFunction(SoundFontType, SoundFontType.STANDARD_LIGHT, SoundFontType.GXSCC_STYLE);
