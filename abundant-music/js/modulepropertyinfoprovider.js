
function ModulePropertyInfoProvider(options) {
    this.module = getValueOrDefault(options, "module", null);
    this.moduleEditor = getValueOrDefault(options, "moduleEditor", null);
    this.uniqueIdManager = getValueOrDefault(options, "uniqueIdManager", new UniqueIdManager());

    var uidManager = this.uniqueIdManager;

    this.variablesUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "variables",
        initPrefix: "variable"
    });
    this.proceduresUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "procedures",
        initPrefix: "procedure"
    });

    this.namedNotesUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "namednotes",
        initPrefix: "namednote"
    });

    this.motifsUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "motifs",
        initPrefix: "motif"
    });

    this.percussionMotifsUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "percussionmotifs",
        initPrefix: "percmotif"
    });

    this.percussionMotifZonesUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "percussionmotifzones",
        initPrefix: "zone"
    });

    this.percussionMotifElementsUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "percmotifelements",
        initPrefix: "percmotifelement"
    });


    this.motifElementsUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "motifelements",
        initPrefix: "motifelement"
    });

    this.motifZonesUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "motifzones",
        initPrefix: "motifzone"
    });

    this.fillersUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "fillers",
        initPrefix: "filler"
    });

    this.rythmsUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "rythms",
        initPrefix: "rythm"
    });


    this.rythmElementsUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "rythmelements",
        initPrefix: "rythmelement"
    });

    this.curvesUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "curves",
        initPrefix: "curve"
    });
    this.curveComputationsUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "curvecomputations",
        initPrefix: "curvecomputation"
    });
    this.splitZoneCollectionUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "szcollections",
        initPrefix: "szcollection"
    });

    this.structuresUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "structures",
        initPrefix: "structure"
    });
    this.sectionReferencesUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "sectionreferences",
        initPrefix: "sectionreference"
    });
    this.sectionModifiersUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "sectionmodifiers",
        initPrefix: "sectionmodifier"
    });
    this.splitZonesUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "splitzones",
        initPrefix: "splitzone"
    });
    this.sectionReferenceModifiersUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "sectionrefmodifiers",
        initPrefix: "sectionrefmodifier"
    });

    this.renderersUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "renderers",
        initPrefix: "renderer"
    });
    this.midiChannelMapsUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "midichannelmaps",
        initPrefix: "map"
    });
    this.midiControllerMessagesUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "midicontrollermessages",
        initPrefix: "message"
    });

    this.sectionsUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "sections",
        initPrefix: "section"
    });

    this.harmonyUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "harmony",
        initPrefix: "harmony"
    });

    this.harmonyElementsUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "harmonyelements",
        initPrefix: "harmonyelement"
    });
    this.harmonyModifiersUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "harmonymodifers",
        initPrefix: "modifier"
    });


    this.voiceLinesUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "voicelines",
        initPrefix: "voiceline"
    });
    this.renderLinesUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "renderlines",
        initPrefix: "renderline"
    });
    this.controlLinesUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "controllines",
        initPrefix: "controlline"
    });

    this.controlChannelsUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "controlchannels",
        initPrefix: "controlchannel"
    });
    this.renderChannelsUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "renderchannels",
        initPrefix: "renderchannel"
    });
    this.suspAntStrategiesUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "suspantstrategies",
        initPrefix: "suspantstrategy"
    });
    this.voicePlannerConstraintsUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "voiceplannerconstraints",
        initPrefix: "constraint"
    });
    this.voicePlannerConstraintZonesUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "voiceplannerconstraintzones",
        initPrefix: "zone"
    });
    this.renderElementsUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "renderelements",
        initPrefix: "renderelement"
    });
    this.renderElementZonesUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "renderelementzones",
        initPrefix: "zone"
    });
    this.controlElementsUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "controlelements",
        initPrefix: "controlelement"
    });
    this.voiceElementsUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "voiceelements",
        initPrefix: "voiceelement"
    });
    this.voiceLinePlannersUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "voicelineplanners",
        initPrefix: "voicelineplanner"
    });
    this.figurationPlannersUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "figurationplanners",
        initPrefix: "figurationplanner"
    });
    this.webAudioSourcesUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "webaudiosource",
        initPrefix: "source"
    });
    this.webAudioEnvelopesUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "webaudioenvelope",
        initPrefix: "envelope"
    });
    this.webAudioSourceZonesUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "webaudiosourcezone",
        initPrefix: "zone"
    });
    this.webAudioInstrumentsUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "webaudioinstrument",
        initPrefix: "instrument"
    });
    this.webAudioChannelInfosUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "webaudiochannelinfo",
        initPrefix: "channelinfo"
    });
    this.webAudioNodesUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "webaudiobeforedestinationnodes",
        initPrefix: "node"
    });
    this.webAudioCurvesUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "webaudiocurves",
        initPrefix: "curve"
    });
    this.sionInstrumentsUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "sioninstrument",
        initPrefix: "instrument"
    });
    this.sionEffectsUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "sioneffect",
        initPrefix: "effect"
    });
    this.sionEffectSendsUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "sioneffectsend",
        initPrefix: "effectsend"
    });
    this.sionMasterEffectsUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "sionmastereffect",
        initPrefix: "mastereffect"
    });
    this.sionInstrumentMapsUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "sioninstrumentmap",
        initPrefix: "map"
    });

    this.registeredComponents = {};
    this.changeListenersToAdd = {};
    this.addedChangeListeners = {};
}

ModulePropertyInfoProvider.prototype.addChangeListenerIfNecessary = function(sourceComponent, listenerComponent,
    sourcePropertyInfo, listenerPropertyInfo) {
    };

ModulePropertyInfoProvider.prototype.registerComponent = function(component, propertyInfo) {
    // Check if there are some changeListenersToAdd that want to listen for changes in the component

    //    logit("Registering component for " + component.object._constructorName + "." + propertyInfo.propertyName + " <br />");
    };

ModulePropertyInfoProvider.prototype.unregisterComponent = function(component, propertyInfo) {
    // Remove all listeners that are associated with this component
    // Both objects that listen for changes to the component and listeners that refer to the component

    //    logit("Unregistering component for " + component.object._constructorName + "." + propertyInfo.propertyName + " <br />");
    };

ModulePropertyInfoProvider.prototype.addComponentChangeListener = function(component, object, propertyName) {
    // If the component that represents the propertyName exists, simply add the listener

    // If the component doesn't exist yet, add the component to the changeListenersToAdd and wait for it to exist
    // and add the listener in the registerComponent() instead
    };

ModulePropertyInfoProvider.prototype.removeComponentChangeListener = function(component, object, propertyName) {
    // If the component that represents the propertyName exists, simply remove the listener

    // If the component doesn't exist yet, don't do anything
    };

ModulePropertyInfoProvider.prototype.getCurveConstructorTexts = function() {
    return [["PredefinedCurve", "Predefined Source"], ["ComputationCurve", "Computation"]];
};



ModulePropertyInfoProvider.prototype.getSectionModifierConstructorTexts = function() {
    return [
    ["SetVariableValueSectionModifier", "Set Variable Value"],
    ["ChangeHarmonySectionModifier", "Change Harmony"]
    ];
};

ModulePropertyInfoProvider.prototype.getRenderElementConstructorTexts = function() {
    return [["MotifRenderElement", "Motif"],
    ["MultiMotifRenderElement", "Multi Motif"],
    ["PercussionMotifRenderElement", "Percussion Motif"],
    ["FlexiblePercussionMotifRenderElement", "Flexible Percussion Motif"],
    ["ZonesRenderElement", "Zones"],
    ["HarmonyIndexPatternMotifRenderElement", "Harmony Index Pattern Motif"],
    ["HarmonyIndexIndexPatternMotifRenderElement", "Harmony Index Index Pattern Motif"],
    ["PhraseStructureRenderElement", "Phrase Structure"]
    ];
};

ModulePropertyInfoProvider.prototype.getHarmonyModifierConstructorTexts = function() {
    return [
    ["RandomShortenHarmonyModifier", "Random Shorten"],
    ["ModeMixtureHarmonyModifier", "Mode Mixture"],
    ["AppendHarmonyModifier", "Append Elements"]
    ];
};


ModulePropertyInfoProvider.prototype.getHarmonyElementConstructorTexts = function() {
    return [
    ["ConstantHarmonyElement", "Simple"],
    ["HarmonyReferenceHarmonyElement", "Harmony Reference"],
    ["StaticSequenceHarmonyElement", "Static Sequence"],
    ["DynamicSequenceHarmonyElement", "Dynamic Sequence"],
    ["PhraseHarmonyElement", "Phrase"]
    ];
};


ModulePropertyInfoProvider.prototype.createDefaultBooleanPropertyInfo = function(propName, caption, defaultValue) {
    var info = new GuiPropertyInfo(
    {
        propertyName: propName,
        propertyCaption: caption,
        propertyInfoProvider: this,
        defaultValue: defaultValue,
        dataType: GuiPropertyDataType.BOOLEAN,
        displayHint: BooleanPropertyDisplayHint.SELECT
    });
    return info;
};

ModulePropertyInfoProvider.prototype.createDefaultFloatPropertyInfo = function(propName, caption, defaultValue) {
    var info = new GuiPropertyInfo(
    {
        propertyName: propName,
        propertyCaption: caption,
        propertyInfoProvider: this,
        defaultValue: defaultValue,
        dataType: GuiPropertyDataType.FLOAT,
        displayHint: NumberPropertyDisplayHint.TEXT
    });
    return info;
};

ModulePropertyInfoProvider.prototype.createDefaultIntPropertyInfo = function(propName, caption, defaultValue) {
    var info = new GuiPropertyInfo(
    {
        propertyName: propName,
        propertyCaption: caption,
        propertyInfoProvider: this,
        defaultValue: defaultValue,
        dataType: GuiPropertyDataType.INT,
        displayHint: NumberPropertyDisplayHint.TEXT
    });
    return info;
};

ModulePropertyInfoProvider.prototype.createDefaultStringPropertyInfo = function(propName, caption, defaultValue) {
    var info = new GuiPropertyInfo(
    {
        propertyName: propName,
        propertyCaption: caption,
        propertyInfoProvider: this,
        defaultValue: defaultValue,
        dataType: GuiPropertyDataType.STRING,
        displayHint: StringPropertyDisplayHint.TEXT
    });
    return info;
};

ModulePropertyInfoProvider.prototype.createStringTextAreaPropertyInfo = function(propName, caption, defaultValue) {
    var info = new GuiPropertyInfo(
    {
        propertyName: propName,
        propertyCaption: caption,
        propertyInfoProvider: this,
        defaultValue: defaultValue,
        dataType: GuiPropertyDataType.STRING,
        displayHint: StringPropertyDisplayHint.TEXT_AREA
    });
    return info;
};


ModulePropertyInfoProvider.prototype.createDefaultMidiNotePropertyInfo = function(propName, caption, defaultValue) {
    return this.createDefaultIntPropertyInfo(propName, caption, defaultValue);
};

ModulePropertyInfoProvider.prototype.createDefaultScaleIndexPropertyInfo = function(propName, caption, defaultValue) {
    return this.createDefaultIntPropertyInfo(propName, caption, defaultValue);
};

ModulePropertyInfoProvider.prototype.createDefaultMinIntPropertyInfo = function(propName, caption, defaultValue, minValue) {
    var info = this.createDefaultIntPropertyInfo(propName, caption, defaultValue);
    info.constraints = [
    {
        getMinValue: function() {
            return minValue;
        }
    }
    ];
    return info;
};


ModulePropertyInfoProvider.prototype.createDefaultMinMaxIntPropertyInfo = function(propName, caption, defaultValue,
    minValue, maxValue) {
    var info = this.createDefaultIntPropertyInfo(propName, caption, defaultValue);
    info.constraints = [
    {
        getMinValue: function() {
            return minValue;
        },
        getMaxValue: function() {
            return maxValue;
        }
    }
    ];
    return info;
};

ModulePropertyInfoProvider.prototype.createDefaultMinFloatPropertyInfo = function(propName, caption, defaultValue, minValue) {
    var info = this.createDefaultFloatPropertyInfo(propName, caption, defaultValue);
    info.constraints = [
    {
        getMinValue: function() {
            return minValue;
        }
    }
    ];
    return info;
};


ModulePropertyInfoProvider.prototype.createDefaultMinMaxFloatPropertyInfo = function(propName, caption, defaultValue,
    minValue, maxValue) {
    var info = this.createDefaultFloatPropertyInfo(propName, caption, defaultValue);
    info.constraints = [
    {
        getMinValue: function() {
            return minValue;
        },
        getMaxValue: function() {
            return maxValue;
        }
    }
    ];
    return info;
};


ModulePropertyInfoProvider.prototype.createDefaultRangePropertyInfo = function(propName, caption, defaultValue, dataType) {
    var info = new GuiPropertyInfo(
    {
        propertyName: propName,
        propertyCaption: caption,
        propertyInfoProvider: this,
        defaultValue: defaultValue,
        dataType: dataType,
        constraints: [
        {
            lengthValid: function(arr) {
                return arr.length == 2;
            },
            lowerUpperValid: function(arr) {
                return arr[0] <= arr[1];
            },
            isValid: function(object, propertyName, value) {
                return this.lengthValid(value) && this.lowerUpperValid(value);
            },
            getInvalidDescription: function(object, propertyName, value) {
                if (!this.lengthValid(value)) {
                    return "Invalid range. Specify a lower and an upper limit";
                }
                if (!this.lowerUpperValid(value)) {
                    return "Invalid range. The first value must not be larger than the second";
                }
                return "";
            }
        }
        ],
        displayHint: NumberPropertyDisplayHint.TEXT
    });
    return info;
};

ModulePropertyInfoProvider.prototype.createDefaultIntRangePropertyInfo = function(propName, caption, defaultValue) {
    return this.createDefaultRangePropertyInfo(propName, caption, defaultValue, GuiPropertyDataType.INT_LIST);
};


ModulePropertyInfoProvider.prototype.createDefaultFloatRangePropertyInfo = function(propName, caption, defaultValue) {
    return this.createDefaultRangePropertyInfo(propName, caption, defaultValue, GuiPropertyDataType.FLOAT_LIST);
};


ModulePropertyInfoProvider.prototype.createDefaultIntListPropertyInfo = function(propName, caption, defaultValue) {
    var info = new GuiPropertyInfo(
    {
        propertyName: propName,
        propertyCaption: caption,
        propertyInfoProvider: this,
        defaultValue: defaultValue,
        dataType: GuiPropertyDataType.INT_LIST,
        displayHint: NumberPropertyDisplayHint.TEXT
    });
    return info;
};

ModulePropertyInfoProvider.prototype.createDefaultIntList2DPropertyInfo = function(propName, caption, defaultValue) {
    var info = new GuiPropertyInfo(
    {
        propertyName: propName,
        propertyCaption: caption,
        propertyInfoProvider: this,
        defaultValue: defaultValue,
        dataType: GuiPropertyDataType.INT_LIST_2D,
        displayHint: NumberPropertyDisplayHint.TEXT
    });
    return info;
};

ModulePropertyInfoProvider.prototype.createDefaultFloatList2DPropertyInfo = function(propName, caption, defaultValue) {
    var info = new GuiPropertyInfo(
    {
        propertyName: propName,
        propertyCaption: caption,
        propertyInfoProvider: this,
        defaultValue: defaultValue,
        dataType: GuiPropertyDataType.FLOAT_LIST_2D,
        displayHint: NumberPropertyDisplayHint.TEXT
    });
    return info;
};

ModulePropertyInfoProvider.prototype.createDefaultIntRangeListPropertyInfo = function(propName, caption, defaultValue) {
    var info = this.createDefaultIntList2DPropertyInfo(propName, caption, defaultValue);

    info.constraints = [
    {
        onePresent: function(arr) {
            return arr.length > 0;
        },
        lengthValid: function(arr) {
            for (var i=0; i<arr.length; i++) {
                if (arr[i].length != 2) {
                    return false;
                }
            }
            return true;
        },
        lowerUpperValid: function(arr) {
            for (var i=0; i<arr.length; i++) {
                if (arr[i][0] > arr[i][1]) {
                    return false;
                }
            }
            return true;
        },
        isValid: function(object, propertyName, value) {
            return this.onePresent(value) && this.lengthValid(value) && this.lowerUpperValid(value);
        },
        getInvalidDescription: function(object, propertyName, value) {
            if (!this.onePresent(value)) {
                return "There must be at least one range specified"
            }
            if (!this.lengthValid(value)) {
                return "Invalid range. Specify lower and upper limits";
            }
            if (!this.lowerUpperValid(value)) {
                return "Invalid range. The first value must not be larger than the second";
            }
            return "";
        }
    }
    ];


    return info;
};



ModulePropertyInfoProvider.prototype.createDefaultFloatListPropertyInfo = function(propName, caption, defaultValue) {
    var info = new GuiPropertyInfo(
    {
        propertyName: propName,
        propertyCaption: caption,
        propertyInfoProvider: this,
        defaultValue: defaultValue,
        dataType: GuiPropertyDataType.FLOAT_LIST,
        displayHint: NumberPropertyDisplayHint.TEXT
    });
    return info;
};



ModulePropertyInfoProvider.prototype.createStrengthPropertyInfo = function(propName, caption, defaultValue) {
    var info = new GuiPropertyInfo(
    {
        propertyName: propName,
        propertyCaption: caption,
        propertyInfoProvider: this,
        defaultValue: defaultValue,
        dataType: GuiPropertyDataType.FLOAT,
        displayHint: NumberPropertyDisplayHint.TEXT,
        constraints: [{
            isValid: function(object, propertyName, value) {
                return value >= 0;
            },
            getInvalidDescription: function(object, propertyName, value) {
                if (value < 0) {
                    return caption + " must not be less than 0";
                }
            }
        }]
    });
    return info;
};


ModulePropertyInfoProvider.prototype.createEnumPropertyInfo = function(propName, caption, defaultValue, enumType) {
    var info = new GuiPropertyInfo(
    {
        propertyName: propName,
        propertyCaption: caption,
        propertyInfoProvider: this,
        defaultValue: defaultValue,
        dataType: GuiPropertyDataType.INT,
        displayHint: NumberPropertyDisplayHint.SELECT,
        possibleValues: enumType.getPossibleValues(),
        displayFunction: function(object, propertyName, value) {
            return enumType.toString(value);
        }
    });
    return info;
};


ModulePropertyInfoProvider.prototype.createEnumListPropertyInfo = function(propName, caption, defaultValue, enumType) {
    var info = new GuiPropertyInfo(
    {
        propertyName: propName,
        propertyCaption: caption,
        propertyInfoProvider: this,
        defaultValue: [],
        dataType: GuiPropertyDataType.INT_LIST,
        displayHint: NumberListPropertyDisplayHint.SELECT_LIST, // This should be LIST_OF_SELECTS instead and there should be a displayFunction() defined also
        listInfo: new GuiListInfo({
            constructorInfos: [
            new GuiConstructorInfo({
                name: "stuff",
                text: "New",
                nameIsConstructor: false,
                createValue: function() {
                    return defaultValue;
                }
            })
            ],
            itemsDisplayFunction: function(input) {
                return enumType.toString(input);
            },
            possibleValues: enumType.getPossibleValues()
        })
    });
    return info;
};

ModulePropertyInfoProvider.prototype.createPositionUnitPropertyInfo = function(propName, caption, defaultValue) {
    return this.createEnumPropertyInfo(propName, caption, defaultValue, PositionUnit);
};

ModulePropertyInfoProvider.prototype.createProcedureButtonPropertyInfo = function(caption, funcName, target, args) {

    var info = new GuiPropertyInfo(
    {
        propertyName: funcName,
        propertyCaption: caption,
        propertyInfoProvider: this,
        dataType: GuiPropertyDataType.PROCEDURE,
        displayHint: ProcedureDisplayHint.BUTTON,
        procedureInfo: new GuiProcedureInfo({
            args: args,
            targetObject: target
        })
    });

    return info;
};

ModulePropertyInfoProvider.prototype.createUniqueIdPropertyInfo = function(prefix, uniqueIdInfo) {
    var info = new GuiPropertyInfo(
    {
        propertyName: "id",
        propertyCaption: "Name",
        propertyInfoProvider: this,
        defaultValue: prefix + "1", // Not really used for unique ids
        dataType: GuiPropertyDataType.UNIQUE_ID,
        displayHint: UniqueIdPropertyDisplayHint.TEXT,
        uniqueIdInfo: uniqueIdInfo
    });
    return info;
};

ModulePropertyInfoProvider.prototype.createPreviewPropertyInfo = function(componentConstructor) {
    var module = this.module;
    var info = new GuiPropertyInfo(
    {
        otherInfo: new GuiOtherInfo({
            componentConstructor: componentConstructor,
            data: module
        }),
        dataType: GuiPropertyDataType.OTHER
    });
    return info;
};

ModulePropertyInfoProvider.prototype.createIdReferencePropertyInfo = function(propertyName, caption, uniqueIdInfo) {
    var info = new GuiPropertyInfo(
    {
        propertyName: propertyName,
        propertyCaption: caption,
        propertyInfoProvider: this,
        defaultValue: "",
        dataType: GuiPropertyDataType.ID_REFERENCE,
        displayHint: IdReferencePropertyDisplayHint.SELECT,
        uniqueIdInfo: uniqueIdInfo
    });
    return info;
};


ModulePropertyInfoProvider.prototype.createIdReferenceListPropertyInfo = function(propertyName, caption, uniqueIdInfo) {
    var info = new GuiPropertyInfo(
    {
        propertyName: propertyName,
        propertyCaption: caption,
        propertyInfoProvider: this,
        dataType: GuiPropertyDataType.ID_REFERENCE_LIST,
        displayHint: IdReferencePropertyDisplayHint.SELECT,
        uniqueIdInfo: uniqueIdInfo,
        listInfo: new GuiListInfo({
            constructorInfos: [
            new GuiConstructorInfo({
                name: "stuff",
                text: "New",
                nameIsConstructor: false,
                createValue: function() {
                    return "";
                }
            })
            ],
            itemsDisplayFunction: function(input) {
                return input;
            }
        })
    });
    return info;
};



ModulePropertyInfoProvider.prototype.createIdReferenceNotSelfPropertyInfo = function(propertyName, caption, uniqueIdInfo) {
    var info = this.createIdReferencePropertyInfo(propertyName, caption, uniqueIdInfo);

    info.constraints = [
    {
        isValid: function(object, propertyName, value) {
            //            logit("" + object.id + ": " + value + "<br />");
            return object.id != value;
        },
        getInvalidDescription: function(object, propertyName, value) {
            if (object.id == value) {
                return "No self reference allowed";
            }
            return "";
        }
    }
    ];

    return info;
};

ModulePropertyInfoProvider.prototype.createObjectPropertyInfo = function(propertyName, caption, uniqueIdInfo, constructorTexts) {
    var provider = this;
    var info = new GuiPropertyInfo(
    {
        propertyName: propertyName,
        propertyCaption: caption,
        propertyInfoProvider: this,
        defaultValue: [],
        dataType: GuiPropertyDataType.OBJECT,
        uniqueIdInfo: uniqueIdInfo
    }
    );

    var constructorInfos = [];
    for (var i=0; i<constructorTexts.length; i++) {
        var ct = constructorTexts[i];
        constructorInfos.push(new GuiConstructorInfo({
            name: ct[0],
            text: ct[1]
        }));
    }

    info.objectInfo = new GuiObjectInfo({
        constructorInfos: constructorInfos
    });

    return info;
};



ModulePropertyInfoProvider.prototype.createObjectListPropertyInfo = function(propertyName, caption, uniqueIdInfo, constructorTexts) {
    var provider = this;
    var info = new GuiPropertyInfo(
    {
        propertyName: propertyName,
        propertyCaption: caption,
        propertyInfoProvider: this,
        defaultValue: [],
        dataType: GuiPropertyDataType.OBJECT_LIST,
        uniqueIdInfo: uniqueIdInfo,
        propertyInfoProvider: provider
    }
    );

    var constructorInfos = [];
    for (var i=0; i<constructorTexts.length; i++) {
        var ct = constructorTexts[i];
        constructorInfos.push(new GuiConstructorInfo({
            name: ct[0],
            text: ct[1]
        }));
    }

    info.listInfo = new GuiListInfo({
        constructorInfos: constructorInfos
    });

    return info;
};



ModulePropertyInfoProvider.prototype.createObjectListInTabPropertyInfo = function(propertyName, caption, uniqueIdInfo, constructorTexts, group, groupCaption) {

    var info = this.createObjectListPropertyInfo(propertyName, caption, uniqueIdInfo, constructorTexts);

    if (!group) {
        group = caption;
    }
    if (!groupCaption) {
        groupCaption = caption;
    }

    info.splitInfo = new GuiSplitInfo({
        group: group,
        groupCaption: groupCaption
    });

    return info;
};

ModulePropertyInfoProvider.prototype.getUniqueNamespace = function(nsPrefix) {
    if (!this.uniqueNamespaces) {
        this.uniqueNamespaces = {};
    }

    var counter = Math.round(Math.random() * 99999999);
    var testNs = nsPrefix + "" + counter;
    while (true) {
        if (!this.uniqueNamespaces[testNs]) {
            // Namespace is available
            this.uniqueNamespaces[testNs] = true;
            break;
        }
        counter++;
        testNs = nsPrefix + "" + counter;
    }
    return testNs;
};

ModulePropertyInfoProvider.prototype.getOrCreateUniqueIdInfo = function(obj, nsPrefix, initPrefix) {
    if (!obj.__uniqueIdInfos) {
        obj.__uniqueIdInfos = {};
    }
    var info = obj.__uniqueIdInfos[nsPrefix];
    if (!info) {
        var uidManager = this.uniqueIdManager;

        var namespace = this.getUniqueNamespace(nsPrefix);

        info = new GuiUniqueIdInfo({
            manager: uidManager,
            namespace: namespace,
            initPrefix: initPrefix
        });

        obj.__uniqueIdInfos[nsPrefix] = info;
    }

    return info;
};


ModulePropertyInfoProvider.prototype.createMotifElementPropertyInfos = function(obj, parentPropertyInfo, result) {
    if (obj instanceof FillerNote) {
        // Filler notes have different namespace
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("filler", this.fillersUidInfo));
    }else {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("motifelement", this.motifElementsUidInfo));
    }

    result.addPropertyInfo(this.createDefaultFloatPropertyInfo("length", "Length", 1.0));

    result.addPropertyInfo(this.createPositionUnitPropertyInfo("lengthUnit", "Length Unit", PositionUnit.BEATS));

    result.addPropertyInfo(this.createStrengthPropertyInfo("strength", "Strength", "0.75"));

    if (obj instanceof ConstantMotifElement) {
        result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("rest", "Rest", false));


        if (obj instanceof VerticalRelativeMotifElement) {
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("index", "Index", 0));

            result.addPropertyInfo(this.createEnumPropertyInfo("relativeType", "Relative Type", VerticalRelativeType.VOICE_LINE, VerticalRelativeType));
            result.addPropertyInfo(this.createEnumPropertyInfo("offsetType", "Offset Type", OffsetType.SCALE, OffsetType));
            result.addPropertyInfo(this.createEnumPropertyInfo("beforeOffsetSnapType", "Before Offset Snap", SnapType.NONE, SnapType));
            result.addPropertyInfo(this.createEnumPropertyInfo("afterOffsetSnapType", "After Offset Snap", SnapType.NONE, SnapType));
        } else if (obj instanceof HorizontalRelativeMotifElement) {
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("index", "Index", 0));

            result.addPropertyInfo(this.createEnumPropertyInfo("relativeType", "Relative Type", HorizontalRelativeType.PREVIOUS_NOTE, HorizontalRelativeType));
            result.addPropertyInfo(this.createEnumPropertyInfo("offsetType", "Offset Type", OffsetType.SCALE, OffsetType));
            result.addPropertyInfo(this.createEnumPropertyInfo("beforeOffsetSnapType", "Before Offset Snap", SnapType.NONE, SnapType));
            result.addPropertyInfo(this.createEnumPropertyInfo("afterOffsetSnapType", "After Offset Snap", SnapType.NONE, SnapType));

        } else if (obj instanceof AdaptiveMotifElement) {

            result.addPropertyInfo(this.createEnumPropertyInfo("verticalDomainType", "Vertical Domain Type", AdaptiveVerticalDomainType.RANGE, AdaptiveVerticalDomainType));
            result.addPropertyInfo(this.createEnumPropertyInfo("verticalRelativeType", "Vertical Relative Type", VerticalRelativeType.VOICE_LINE, VerticalRelativeType));
            result.addPropertyInfo(this.createEnumPropertyInfo("verticalDomainOffsetType", "Vertical Offset Type", OffsetType.SCALE, OffsetType));
            result.addPropertyInfo(this.createDefaultIntRangePropertyInfo("verticalDomainOffsetRange", "Vertical Offset Range", [-15, 15]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("verticalDomainOffsetElements", "Vertical Offset Elements", [-1, 0, 1]));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("verticalDomainOffsetElementLikelihoods", "Vertical Offset Likelihoods", [1, 1, 1]));
            result.addPropertyInfo(this.createIdReferencePropertyInfo("verticalDomainCurve", "Vertical Curve", this.curvesUidInfo));
            result.addPropertyInfo(this.createDefaultIntRangePropertyInfo("verticalDomainCurveOffsetRange", "Vertical Curve Range", [-1, 1]));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("verticalDomainCurveOffsetLikelihoodMultiplier", "Outside Curve L Mult", 0.1));

            result.addPropertyInfo(this.createEnumListPropertyInfo("horizontalDomainTypes", "Horizontal Domain Types", AdaptiveHorizontalDomainType.RANGE, AdaptiveHorizontalDomainType));
            result.addPropertyInfo(this.createEnumListPropertyInfo("horizontalRelativeTypes", "Horizontal Relative Types", HorizontalRelativeType.PREVIOUS_NOTE, HorizontalRelativeType));
            result.addPropertyInfo(this.createEnumListPropertyInfo("horizontalDomainOffsetTypes", "Horizontal Offset Types", OffsetType.SCALE, OffsetType));
            result.addPropertyInfo(this.createDefaultIntRangeListPropertyInfo("horizontalDomainOffsetRanges", "Horizontal Offset Ranges", [[-2, 2]]));
            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("horizontalDomainOffsetElements", "Horizontal Offset Elements", [[-1, 0, 1]]));
            result.addPropertyInfo(this.createDefaultFloatList2DPropertyInfo("horizontalDomainOffsetLikelihoods", "Horizontal Offset Likelihoods", [[1, 1, 1]]));
        }

        // Add the fillers last
        var info = this.createObjectListPropertyInfo("fillers", "Fillers", this.fillersUidInfo,
            [["FillerNote", "Filler"]
            ]);
        result.addPropertyInfo(info);

    } else if (obj instanceof SimpleSequenceMotifElement) {

        result.addPropertyInfo(this.createDefaultIntListPropertyInfo("verticalOffsetPattern", "Offset pattern", [0]));
        result.addPropertyInfo(this.createEnumPropertyInfo("verticalOffsetPatternBorderMode", "Offset pattern index border mode", IndexBorderMode.RESTART, IndexBorderMode));
        result.addPropertyInfo(this.createEnumPropertyInfo("verticalOffsetType", "Offset type", OffsetType.SCALE, OffsetType));
        result.addPropertyInfo(this.createEnumPropertyInfo("verticalRelativeType", "Relative type", VerticalRelativeType.VOICE_LINE, VerticalRelativeType));

        result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("elementLengthPattern", "Element length pattern", [1]));
        result.addPropertyInfo(this.createPositionUnitPropertyInfo("elementLengthPatternUnit", "Element length pattern unit", PositionUnit.BEATS));
        result.addPropertyInfo(this.createEnumPropertyInfo("elementLengthPatternBorderMode", "Element length pattern index border mode", IndexBorderMode.RESTART, IndexBorderMode));

        result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("elementStrengthPattern", "Element strength pattern", [1]));
        result.addPropertyInfo(this.createEnumPropertyInfo("elementStrengthPatternBorderMode", "Element strength pattern index border mode", IndexBorderMode.RESTART, IndexBorderMode));

        result.addPropertyInfo(this.createDefaultIntListPropertyInfo("restPattern", "Rest pattern", [0]));
        result.addPropertyInfo(this.createEnumPropertyInfo("restPatternBorderMode", "Rest pattern index border mode", IndexBorderMode.RESTART, IndexBorderMode));

        result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("cutLast", "Cut last element", true));

        result.addPropertyInfo(this.createDefaultFloatPropertyInfo("minElementLength", "Min element length (after cut)", 0.0));
        result.addPropertyInfo(this.createPositionUnitPropertyInfo("minElementLengthUnit", "Min element length unit", PositionUnit.BEATS));
    }

};


ModulePropertyInfoProvider.prototype.getGuiPropertyInfos = function(obj, parentPropertyInfo) {
    var result = new GuiPropertyInfos();

    //    if (!parentPropertyInfo) {
    //        logit("parent property info not set for " + obj._constructorName + "<br />");
    //    }

    //    logit("getting propertyinfos for " + obj + "<br />");
    //    investigateObject(obj);

    if (obj instanceof GenMusicModule) {

        var info = this.createObjectListInTabPropertyInfo("renderers", "Renderers", this.renderersUidInfo,
            [["WebAudioRenderer", "WebAudio"], ["MidiRenderer", "Midi"], ["WaveRenderer", "Wav"],
            ["JsonRenderer", "JSON"], ["PianoRollRenderer", "Piano Roll"], ["SionRenderer", "Sion"]]);
        result.addPropertyInfo(info);

        var info = this.createObjectListInTabPropertyInfo("structures", "Structures", this.structuresUidInfo,
            [["Structure", "Structure"]]);
        result.addPropertyInfo(info);

        var info = this.createObjectListInTabPropertyInfo("sections", "Sections", this.sectionsUidInfo,
            [["Section", "Section"]]);
        result.addPropertyInfo(info);

        var info = this.createObjectListInTabPropertyInfo("harmony", "Harmony", this.harmonyUidInfo,
            [["ConstantHarmonicRythm", "Harmonic Rythm"]]);
        result.addPropertyInfo(info);

        var info = this.createObjectListInTabPropertyInfo("motifs", "Motifs", this.motifsUidInfo,
            [["Motif", "Motif"]], "motifs", "Motifs");
        result.addPropertyInfo(info);

        var info = this.createObjectListInTabPropertyInfo("namedNotes", "Named Notes", this.namedNotesUidInfo,
            [["SimpleNamedNote", "Simple"], ["MidiDrumNamedNote", "Midi Drum"]], "motifs", "Motifs");
        result.addPropertyInfo(info);

        var info = this.createObjectListInTabPropertyInfo("percussionMotifs", "Percussion Motifs", this.percussionMotifsUidInfo,
            [
            ["PercussionMotif", "Motif"],
            ["SingleElementPercussionMotif", "Single Element Motif"],
            ], "motifs", "Motifs");
        result.addPropertyInfo(info);

        var info = this.createObjectListInTabPropertyInfo("rythms", "Rythms", this.rythmsUidInfo,
            [["Rythm", "Rythm"]]);
        result.addPropertyInfo(info);

        var info = this.createObjectListInTabPropertyInfo("curves", "Curves", this.curvesUidInfo,
            this.getCurveConstructorTexts());
        result.addPropertyInfo(info);

        var info = this.createObjectListInTabPropertyInfo("voiceLinePlanners", "Voice Line Planners", this.voiceLinePlannersUidInfo,
            [["ClassicalVoiceLinePlanner", "Classical"]], "planners", "Planners");
        result.addPropertyInfo(info);
        var info = this.createObjectListInTabPropertyInfo("figurationPlanners", "Figuration Planners", this.figurationPlannersUidInfo,
            [["ClassicalFigurationPlanner", "Classical"]], "planners", "Planners");
        result.addPropertyInfo(info);

        var info = this.createObjectListInTabPropertyInfo("renderChannels", "Render Channels", this.renderChannelsUidInfo,
            [["RenderChannel", "Render Channel"]], "channels", "Channels");
        result.addPropertyInfo(info);


        var info = this.createObjectListInTabPropertyInfo("controlChannels", "Control Channels", this.controlChannelsUidInfo,
            [
            ["DoubleControlChannel", "Double Channel"],
            ["IntegerControlChannel", "Integer Channel"],
            ["BooleanControlChannel", "Boolean Channel"]
            ], "channels", "Channels");
        result.addPropertyInfo(info);

        var info = this.createObjectListInTabPropertyInfo("variables", "Variables and Value Functions", this.variablesUidInfo,
            [
            ["SimpleIntegerEditorVariable", "Integer Variable"],
            ["SimpleDoubleEditorVariable", "Double Variable"],
            ["SimpleBooleanEditorVariable", "Boolean Variable"],
            ["SimpleStringEditorVariable", "String Variable"],
            ["IdReferenceEditorVariable", "Id Reference Variable"],
            ["SimpleObjectEditorVariable", "Object Variable"],
            ["SimpleIntegerArrayEditorVariable", "Integer Array Variable"],
            ["SimpleRandomIntegerArrayEditorVariable", "Simple Random Integer Array"],
            ["MarkovRandomIntegerArrayEditorVariable", "Markov Random Integer Array"],
            ["PatternIntegerArrayEditorVariable", "Pattern Integer Array Variable"],
            ["SimpleDoubleArrayEditorVariable", "Double Array Variable"],
            ["PatternDoubleArrayEditorVariable", "Pattern Double Array Variable"],
            ["SimpleEnumEditorVariable", "Enum Variable"]
            ],
            "variables", "Variables/Procedures");
        result.addPropertyInfo(info);
        var info = this.createObjectListInTabPropertyInfo("procedures", "Procedures", this.proceduresUidInfo,
            [
            ["CustomEditorProcedure", "Custom"]
            ],
            "variables", "Variables/Procedures");
        result.addPropertyInfo(info);

    } else if (obj instanceof EditorProcedure) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("procedure", this.proceduresUidInfo));

    } else if (obj instanceof EditorFunctionOrVariable) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("variable", this.variablesUidInfo));

        if (obj instanceof SimpleIntegerEditorVariable) {
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("value", "Value", 0));
        } else if (obj instanceof SimpleDoubleEditorVariable) {
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("value", "Value", 0));
        } else if (obj instanceof SimpleBooleanEditorVariable) {
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("value", "Value", false));
        } else if (obj instanceof SimpleStringEditorVariable) {
            result.addPropertyInfo(this.createStringTextAreaPropertyInfo("value", "Value", ""));
        } else if (obj instanceof SimpleObjectEditorVariable) {
            result.addPropertyInfo(this.createStringTextAreaPropertyInfo("expression", "Expression", ""));
        } else if (obj instanceof SimpleIntegerArrayEditorVariable) {
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("value", "Value", []));
        } else if (obj instanceof SimpleDoubleArrayEditorVariable) {
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("value", "Value", []));
        } else if (obj instanceof SimpleEnumEditorVariable) {
            result.addPropertyInfo(this.createEnumPropertyInfo("enumType", "Enum type", EnumType.POSITION_UNIT, EnumType));
            result.addPropertyInfo(this.createEnumPropertyInfo("positionUnitValue", "Position unit value", PositionUnit.BEATS, PositionUnit));
            result.addPropertyInfo(this.createEnumPropertyInfo("scaleTypeValue", "Scale type value", ScaleType.MAJOR, ScaleType));
        } else if (obj instanceof PatternIntegerArrayEditorVariable) {
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("count", "Count", 0));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("elements", "Elements", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("startElements", "Start elements", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("endElements", "End elements", []));
            result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Show", "showVariableValueAsJson", this.moduleEditor, [obj]));
        } else if (obj instanceof SimpleRandomIntegerArrayEditorVariable) {
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("count", "Count", 0));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("domain", "Domain", [0, 1]));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("domainLikelihoods", "Likelihoods", [1]));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("seed", "Seed", 12345));
            result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Show", "showVariableValueAsJson", this.moduleEditor, [obj]));
        } else if (obj instanceof MarkovRandomIntegerArrayEditorVariable) {
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("count", "Count", 0));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("seed", "Seed", 12345));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("startStates", "Start states", [0, 1]));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("startStateLikelihoods", "Start state likelihoods", [1, 1]));
            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("stateDomains", "State domains", [[0, 2], [1, 3]]));
            result.addPropertyInfo(this.createDefaultFloatList2DPropertyInfo("stateDomainLikelihoods", "State domain likelihoods", [[1], [1]]));
            result.addPropertyInfo(this.createDefaultFloatList2DPropertyInfo("stateTransitionLikelihoods", "State transition likelihoods", [[1, 1], [1, 1]]));
            result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Show", "showVariableValueAsJson", this.moduleEditor, [obj]));
        } else if (obj instanceof IdReferenceEditorVariable) {
            result.addPropertyInfo(this.createEnumPropertyInfo("referenceType", "Reference type", EditorIdReferenceType.HARMONY, EditorIdReferenceType));
            result.addPropertyInfo(this.createIdReferencePropertyInfo("structure", "Structure", this.structuresUidInfo));
            result.addPropertyInfo(this.createIdReferencePropertyInfo("section", "Section", this.sectionsUidInfo));
            result.addPropertyInfo(this.createIdReferencePropertyInfo("harmony", "Harmony", this.harmonyUidInfo));
            result.addPropertyInfo(this.createIdReferencePropertyInfo("motif", "Motif", this.motifsUidInfo));
            result.addPropertyInfo(this.createIdReferencePropertyInfo("percussionMotif", "Percussion motif", this.percussionMotifsUidInfo));
            result.addPropertyInfo(this.createIdReferencePropertyInfo("rythm", "Rythm", this.rythmsUidInfo));
            result.addPropertyInfo(this.createIdReferencePropertyInfo("curve", "Curve", this.curvesUidInfo));
            result.addPropertyInfo(this.createIdReferencePropertyInfo("renderChannel", "Render channel", this.renderChannelsUidInfo));
            result.addPropertyInfo(this.createIdReferencePropertyInfo("controlChannel", "Control channel", this.controlChannelsUidInfo));
            result.addPropertyInfo(this.createIdReferencePropertyInfo("namedNote", "Named note", this.namedNotesUidInfo));
        } else if (obj instanceof PatternDoubleArrayEditorVariable) {
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("count", "Count", 0));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("elements", "Elements", []));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("startElements", "Start elements", []));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("endElements", "End elements", []));
            result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Show", "showVariableValueAsJson", this.moduleEditor, [obj]));
        }

    } else if (obj instanceof NamedNote) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("namedNote", this.namedNotesUidInfo));

        if (obj instanceof SimpleNamedNote) {
            result.addPropertyInfo(this.createDefaultMidiNotePropertyInfo("note", "Note", 60));
        } else if (obj instanceof MidiDrumNamedNote) {
            result.addPropertyInfo(this.createEnumPropertyInfo("note", "Note", MidiDrum.BASS_DRUM_1, MidiDrum));
        }
        
    } else if (obj instanceof PianoRollRenderer) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("renderer", this.renderersUidInfo));

        result.addPropertyInfo(this.createIdReferencePropertyInfo("structure", "Structure", this.structuresUidInfo));
        result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Render Piano Roll", "showRenderDataPianoRoll", this.moduleEditor, [obj]));
    } else if (obj instanceof JsonRenderer) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("renderer", this.renderersUidInfo));

        result.addPropertyInfo(this.createIdReferencePropertyInfo("structure", "Structure", this.structuresUidInfo));
        result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Render Data to JSON", "showRenderDataJson", this.moduleEditor, [obj]));
        result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Module to JSON", "showModuleJson", this.moduleEditor, [obj]));

    } else if (obj instanceof VoiceLinePlanner) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("planner", this.voiceLinePlannersUidInfo));
        result.addPropertyInfo(this.createDefaultIntPropertyInfo("maxSearchStepsPerStep", "Max search steps per voice step", 5000));

        if (obj instanceof ClassicalVoiceLinePlanner) {
        }

        result.addPropertyInfo(this.createObjectListPropertyInfo("constraintZones", "Constraint zones", this.voicePlannerConstraintZonesUidInfo,
            [
            ["IndexedVoiceLinePlannerConstraintZone", "Indexed Zone"]
            ]));

    } else if (obj instanceof FigurationPlanner) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("planner", this.figurationPlannersUidInfo));

        if (obj instanceof ClassicalFigurationPlanner) {
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("maxMLSolutions", "Max ML Solutions", 10));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("maxSearchSteps", "Max search steps", 1000));
        }

    } else if (obj instanceof WebAudioInstrument) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("instrument", this.webAudioInstrumentsUidInfo));

        result.addPropertyInfo(this.createIdReferencePropertyInfo("amplitudeEnvelope", "Amplitude envelope", this.webAudioEnvelopesUidInfo));
        result.addPropertyInfo(this.createObjectListPropertyInfo("zones", "Zones", this.webAudioSourceZonesUidInfo,
            [["WebAudioSourceZone", "Zone"]]));
        
    } else if (obj instanceof WebAudioSourceZone) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("zone", this.webAudioSourceZonesUidInfo));
        result.addPropertyInfo(this.createDefaultIntRangePropertyInfo("noteInterval", "Note interval", [0, 127]));
        result.addPropertyInfo(this.createIdReferencePropertyInfo("source", "Source", this.webAudioSourcesUidInfo));

    } else if (obj instanceof WebAudioRenderChannelInfo) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("channelinfo", this.webAudioChannelInfosUidInfo));

        var info = this.createObjectListPropertyInfo("nodes", "Nodes", this.webAudioNodesUidInfo, [["WebAudioNodeSpec", "Node"]]);
        result.addPropertyInfo(info);
    } else if (obj instanceof WebAudioNodeSpec) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("node", this.webAudioNodesUidInfo));
    } else if (obj instanceof WebAudioSource) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("source", this.webAudioSourcesUidInfo));

        if (obj instanceof WebAudioCurveBufferSource) {
            result.addPropertyInfo(this.createIdReferencePropertyInfo("curve", "Curve", this.curvesUidInfo));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("useInternalCurve", "Use internal curve", false));
            result.addPropertyInfo(this.createIdReferencePropertyInfo("internalCurve", "Internal curve", this.webAudioCurvesUidInfo));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("amplitude", "Amplitude", 0.5));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("bias", "Bias", 0.0));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("bufferFrequency", "Buffer frequency", 20.0));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("bufferPeriods", "Buffer periods", 2));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("adaptToFrequency", "Adapt to frequency", true));
        }
    } else if (obj instanceof WebAudioEnvelope) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("envelope", this.webAudioEnvelopesUidInfo));

        if (obj instanceof WebAudioADSREnvelope) {
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("amplitude", "Amplitude", 1.0));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("bias", "Bias", 0.0));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("delay", "Delay", 0.0));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("attack", "Attack time", 0.1));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("decay", "Decay time", 0.1));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("sustain", "Sustain level", 0.5));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("release", "Release time", 0.5));
        }
    } else if (obj instanceof WebAudioRenderer) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("renderer", this.renderersUidInfo));
        result.addPropertyInfo(this.createIdReferencePropertyInfo("structure", "Structure", this.structuresUidInfo));
        result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Open Player", "openWebAudioStructurePlayer", this.moduleEditor, [obj]));

        var info = this.createObjectListPropertyInfo("sources", "Sources", this.webAudioSourcesUidInfo,
            [["WebAudioCurveBufferSource", "Curve Buffer Source"]]);
        result.addPropertyInfo(info);
        var info = this.createObjectListPropertyInfo("envelopes", "Envelopes", this.webAudioEnvelopesUidInfo,
            [["WebAudioADSREnvelope", "ADSR"]]);
        result.addPropertyInfo(info);
        var info = this.createObjectListPropertyInfo("instruments", "Instruments", this.webAudioInstrumentsUidInfo,
            [["WebAudioInstrument", "Instrument"]]);
        result.addPropertyInfo(info);
        var info = this.createObjectListPropertyInfo("channelInfos", "Channel infos", this.webAudioChannelInfosUidInfo,
            [["WebAudioRenderChannelInfo", "Render Channel Info"]]);
        result.addPropertyInfo(info);
        var info = this.createObjectListPropertyInfo("beforeDestinationNodes", "Nodes before destination",
            this.webAudioNodesUidInfo,
            [["WebAudioNodeSpec", "Node"]]);
        result.addPropertyInfo(info);
        var info = this.createObjectListPropertyInfo("internalCurves", "Internal curves",
            this.webAudioCurvesUidInfo,
            this.getCurveConstructorTexts());
        result.addPropertyInfo(info);
    } else if (obj instanceof SionEffect) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("effect", this.sionEffectsUidInfo));

        if (obj instanceof SionSerialEffect) {
            var info = this.createObjectListPropertyInfo("effects", "Effects", this.sionEffectsUidInfo, effectStuff);
            result.addPropertyInfo(info);
        } else if (obj instanceof SionDelayEffect) {
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("time", "Time (ms)", 200));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("feedback", "Feedback (%)", 25));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("cross", "Cross", 0));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("wet", "Wet", 100));
        } else if (obj instanceof SionReverbEffect) {
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("longDelay", "Long delay", 70));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("shortDelay", "Short delay", 40));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("feedback", "Feedback", 80));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("wet", "Wet", 100));
        }else if (obj instanceof Sion3BandEqualizerEffect) {
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("lowGain", "Low gain", 100));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("middleGain", "Middle gain", 100));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("highGain", "High gain", 100));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("lowFrequency", "Low frequency", 800));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("highFrequency", "High frequency", 5000));
        }else if (obj instanceof SionChorusEffect) {
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("delayTime", "Delay time", 20));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("feedback", "Feedback", 50));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("depth", "Depth", 200));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("wet", "Wet", 100));
        }
        else if (obj instanceof SionDistortionEffect) {
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("preGain", "Pre gain", -60));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("postGain", "Post gain", -12));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("lpfFreq", "LPF frequency", 2400));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("lpfSlope", "LPF slope", 1));
        } else if (obj instanceof SionCompressorEffect) {
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("threshold", "Threshold", 70));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("windoWidth", "Window width", 50));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("attack", "Attack", 20));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("release", "Release", 20));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("maxGain", "Max gain", 6));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("outputLevel", "Output level", 50));
        } else if (obj instanceof SionWaveShaperEffect) {
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("distortion", "Distortion", 50));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("outputLevel", "Output level", 100));
        }

    } else if (obj instanceof SionInstrument) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("instrument", this.sionInstrumentsUidInfo));

        result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("isPercussion", "Is percussion", false));
        result.addPropertyInfo(this.createIdReferencePropertyInfo("percussionNote", "Percussion note", this.namedNotesUidInfo));
        result.addPropertyInfo(this.createDefaultMidiNotePropertyInfo("percussionPlayNote", "Percussion play note", 24));

        if (obj instanceof SionPresetInstrument) {
            result.addPropertyInfo(this.createEnumPropertyInfo("category", "Category", SionPresetCategory.DEFAULT, SionPresetCategory));
            result.addPropertyInfo(this.createEnumPropertyInfo("defaultInstrument", "Default instrument", SionPresetVoiceDEFAULT._SINE_WAVE, SionPresetVoiceDEFAULT));
            result.addPropertyInfo(this.createEnumPropertyInfo("bassInstrument", "Bass instrument", SionPresetVoiceVALSOUND_BASS._ANALOG_BASS_2_FBSYNTH, SionPresetVoiceVALSOUND_BASS));
            result.addPropertyInfo(this.createEnumPropertyInfo("bellInstrument", "Bell instrument", SionPresetVoiceVALSOUND_BELL._CALM_BELL, SionPresetVoiceVALSOUND_BELL));
            result.addPropertyInfo(this.createEnumPropertyInfo("brassInstrument", "Brass instrument", SionPresetVoiceVALSOUND_BRASS._BRASS_STRINGS, SionPresetVoiceVALSOUND_BRASS));
            result.addPropertyInfo(this.createEnumPropertyInfo("guitarInstrument", "Guitar instrument", SionPresetVoiceVALSOUND_GUITAR._GUITAR_VELOLOW, SionPresetVoiceVALSOUND_GUITAR));
            result.addPropertyInfo(this.createEnumPropertyInfo("leadInstrument", "Lead instrument", SionPresetVoiceVALSOUND_LEAD._ACO_CODE, SionPresetVoiceVALSOUND_LEAD));
            result.addPropertyInfo(this.createEnumPropertyInfo("percussionInstrument", "Percussion instrument", SionPresetVoiceVALSOUND_PERCUS._BASS_DRUM_2, SionPresetVoiceVALSOUND_PERCUS));
            result.addPropertyInfo(this.createEnumPropertyInfo("pianoInstrument", "Piano instrument", SionPresetVoiceVALSOUND_PIANO._ACO_PIANO2_ATTACK, SionPresetVoiceVALSOUND_PIANO));
            result.addPropertyInfo(this.createEnumPropertyInfo("seInstrument", "SE instrument", SionPresetVoiceVALSOUND_SE._S_E_DETUNE_IS_NEEDED_O2C, SionPresetVoiceVALSOUND_SE));
            result.addPropertyInfo(this.createEnumPropertyInfo("specialInstrument", "Special instrument", SionPresetVoiceVALSOUND_SPECIAL._DIGITAL_1, SionPresetVoiceVALSOUND_SPECIAL));
            result.addPropertyInfo(this.createEnumPropertyInfo("strPadInstrument", "String/Pad instrument", SionPresetVoiceVALSOUND_STRPAD._ACCORDION1, SionPresetVoiceVALSOUND_STRPAD));
            result.addPropertyInfo(this.createEnumPropertyInfo("windInstrument", "Wind instrument", SionPresetVoiceVALSOUND_WIND._CLARINET_1, SionPresetVoiceVALSOUND_WIND));
            result.addPropertyInfo(this.createEnumPropertyInfo("worldInstrument", "World instrument", SionPresetVoiceVALSOUND_WORLD._BANJO_HARPCI, SionPresetVoiceVALSOUND_WORLD));
            result.addPropertyInfo(this.createEnumPropertyInfo("midiInstrument", "Midi instrument", SionPresetVoiceMIDI._GRANDPNO, SionPresetVoiceMIDI));
            result.addPropertyInfo(this.createEnumPropertyInfo("midiDrumInstrument", "Midi drum instrument", SionPresetVoiceMIDI_DRUM._SEQ_CLICK_H, SionPresetVoiceMIDI_DRUM));
        }
    } else if (obj instanceof SionEffectSend) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("effectsend", this.sionEffectSendsUidInfo));

        result.addPropertyInfo(this.createIdReferencePropertyInfo("effect", "Effect", this.sionEffectsUidInfo));
        result.addPropertyInfo(this.createDefaultIntPropertyInfo("sendLevel", "Send level", 0));

    } else if (obj instanceof SionInstrumentChannelMap) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("map", this.sionInstrumentMapsUidInfo));
        result.addPropertyInfo(this.createIdReferencePropertyInfo("renderChannel", "Render channel", this.renderChannelsUidInfo));

        result.addPropertyInfo(this.createObjectPropertyInfo("instrument", "Instrument", this.sionInstrumentUidInfo,
            [["SionPresetInstrument", "Preset"]]));

        result.addPropertyInfo(this.createDefaultIntPropertyInfo("masterVolume", "Master volume", 64));

        var info = this.createObjectListPropertyInfo("effectSends", "Effect sends", this.sionEffectSendsUidInfo,
            [["SionEffectSend", "Effect send"]]);
        result.addPropertyInfo(info);


    } else if (obj instanceof SionRenderer) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("renderer", this.renderersUidInfo));
        result.addPropertyInfo(this.createIdReferencePropertyInfo("structure", "Structure", this.structuresUidInfo));

        result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Open Renderer", "openSionRenderer", this.moduleEditor, [obj]));

        var info = this.createObjectListPropertyInfo("mappings", "Instrument mappings", this.sionInstrumentMapsUidInfo,
            [["SionInstrumentChannelMap", "Map"]]);
        result.addPropertyInfo(info);

        var effectStuff = [["SionDelayEffect", "Delay"], ["SionReverbEffect", "Reverb"], ["Sion3BandEqualizerEffect", "Equalizer"],
        ["SionChorusEffect", "Chorus"], ["SionDistortionEffect", "Distortion"], ["SionCompressorEffect", "Compressor"],
        ["SionWaveShaperEffect", "Wave shape"], ["SionSerialEffect", "Serial"]
        ];
        var info = this.createObjectListPropertyInfo("effects", "Effects", this.sionEffectsUidInfo, effectStuff);
        result.addPropertyInfo(info);

        var info = this.createObjectListPropertyInfo("masterEffects", "Master effects", this.sionMasterEffectsUidInfo, effectStuff);
        result.addPropertyInfo(info);

    } else if (obj instanceof InitialMidiControllerMessage) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("message", this.midiControllerMessagesUidInfo));
        result.addPropertyInfo(this.createEnumPropertyInfo("type", "Type", MidiControllerType.VOLUME, MidiControllerType));
        result.addPropertyInfo(this.createDefaultIntPropertyInfo("value", "Value", 64));

    } else if (obj instanceof MidiChannelMap) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("renderer", this.midiChannelMapsUidInfo));
        result.addPropertyInfo(this.createIdReferencePropertyInfo("renderChannel", "Render channel", this.renderChannelsUidInfo));
        result.addPropertyInfo(this.createEnumPropertyInfo("program", "Program", MidiProgram.ACOUSTIC_GRAND_PIANO, MidiProgram));
        result.addPropertyInfo(this.createDefaultIntPropertyInfo("channel", "Midi channel", 0));

        var info = this.createObjectListPropertyInfo("initialControllerMessages", "Initial controller messages", this.midiControllerMessagesUidInfo,
            [["InitialMidiControllerMessage", "Controller Message"]]);
        result.addPropertyInfo(info);

    } else if (obj instanceof MidiRenderer) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("renderer", this.renderersUidInfo));
        result.addPropertyInfo(this.createIdReferencePropertyInfo("structure", "Structure", this.structuresUidInfo));

        result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Open Renderer", "openMidiRenderer", this.moduleEditor, [obj]));

        var info = this.createObjectListPropertyInfo("channelMaps", "Channel maps", this.midiChannelMapsUidInfo,
            [["MidiChannelMap", "Channel Map"]]);
        result.addPropertyInfo(info);

    } else if (obj instanceof SplitZone) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("splitzone", this.splitZonesUidInfo));
        result.addPropertyInfo(this.createDefaultFloatRangePropertyInfo("noteLengthInterval", "Note length interval", [0.0, 16.0]));
        result.addPropertyInfo(this.createEnumPropertyInfo("noteLengthIntervalUnit", "Note length interval unit", PositionUnit.BEATS, PositionUnit));
        result.addPropertyInfo(this.createEnumPropertyInfo("splitStrategy", "Split strategy", SplitStrategy.HALVE, SplitStrategy));
        result.addPropertyInfo(this.createEnumPropertyInfo("dottedSplitStrategy", "Dot split strategy", DottedSplitStrategy.LONGEST_FIRST, DottedSplitStrategy));
        result.addPropertyInfo(this.createEnumPropertyInfo("tripletSplitStrategy", "Triplet split strategy", TripletSplitStrategy.HALVE, TripletSplitStrategy));
        result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("velocityMultipliers", "Strength multipliers", [1.0]));
        result.addPropertyInfo(this.createDefaultFloatPropertyInfo("likelihood", "Likelihood", 1.0));
        result.addPropertyInfo(this.createDefaultIntRangePropertyInfo("iterationInterval", "Iteration interval", [0, 128]));
        result.addPropertyInfo(this.createDefaultFloatRangePropertyInfo("positionInterval", "Position interval", [0.0, 1.0]));
        result.addPropertyInfo(this.createEnumPropertyInfo("positionIntervalUnit", "Position interval unit", PositionUnit.MEASURES, PositionUnit));
        result.addPropertyInfo(this.createDefaultIntRangePropertyInfo("noteCountInterval", "Note count interval", [0, 128]));
        result.addPropertyInfo(this.createDefaultIntListPropertyInfo("keepPattern", "Keep pattern", [1]));

    } else if (obj instanceof SplitZoneCollection) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("szcollection", this.splitZoneCollectionUidInfo));
        result.addPropertyInfo(this.createDefaultFloatPropertyInfo("minLength", "Minimum Length", 0.25));
        result.addPropertyInfo(this.createEnumPropertyInfo("minLengthUnit", "Minimum length unit", PositionUnit.BEATS, PositionUnit));
        result.addPropertyInfo(this.createEnumPropertyInfo("defaultSplitStrategy", "Default split strategy", SplitStrategy.HALVE, SplitStrategy));
        result.addPropertyInfo(this.createEnumPropertyInfo("defaultDottedSplitStrategy", "Default dot split strategy", DottedSplitStrategy.LONGEST_FIRST, DottedSplitStrategy));
        result.addPropertyInfo(this.createEnumPropertyInfo("defaultTripletSplitStrategy", "Default triplet split strategy", TripletSplitStrategy.HALVE, TripletSplitStrategy));

        result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("defaultVelocityMultipliers", "Default strength multipliers", [1.0]));
        result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("tryHalveIfStrategyFails", "Halve on fail", true));
        result.addPropertyInfo(this.createDefaultIntPropertyInfo("seed", "Seed", 12345));

        var info = this.createObjectListPropertyInfo("zones", "Split Zones", this.splitZonesUidInfo,
            [["SplitZone", "Split Zone"]]);
        result.addPropertyInfo(info);

    } else if (obj instanceof SectionModifier) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("sectionmodifier", this.sectionModifiersUidInfo));

        if (obj instanceof SetVariableValueSectionModifier) {
            result.addPropertyInfo(this.createIdReferencePropertyInfo("variable", "Variable", this.variablesUidInfo));
            result.addPropertyInfo(this.createStringTextAreaPropertyInfo("valueExpression", "Value expression", ""));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("restoreAfterRender", "Restore value after render", true));

        } else if (obj instanceof ChangeHarmonySectionModifier) {
            result.addPropertyInfo(this.createIdReferencePropertyInfo("harmony", "Harmony", this.harmonyUidInfo));
        } else if (obj instanceof TransposeSectionModifier) {
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("semiSteps", "Semi steps", 0));
        }

    } else if (obj instanceof Structure) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("structure", this.structuresUidInfo));

        result.addPropertyInfo(this.createPreviewPropertyInfo("StructurePreviewComponent"));

        var info = this.createObjectListPropertyInfo("references", "Sections", this.sectionReferencesUidInfo,
            [["SectionReference", "Section Reference"]]);
        result.addPropertyInfo(info);

    } else if (obj instanceof VoiceLineElement) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("voiceelement", this.voiceElementsUidInfo));

        if (obj instanceof SingleStepVoiceLineElement) {

            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("suspend", "Suspend", false));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("anticipate", "Anticipate", false));

            if (obj instanceof ConstantVoiceLineElement) {
                result.addPropertyInfo(this.createDefaultIntPropertyInfo("octaves", "Octaves", 0));
                result.addPropertyInfo(this.createDefaultIntPropertyInfo("index", "Index", 0));
                result.addPropertyInfo(this.createEnumPropertyInfo("indexType", "Index Type", IndexType.SCALE, IndexType));
                result.addPropertyInfo(this.createEnumPropertyInfo("snapType", "Snap Type", SnapType.CHORD, SnapType));
            } else if (obj instanceof ClassicalAdaptiveVoiceLineElement) {

                result.addPropertyInfo(this.createDefaultIntPropertyInfo("hintIndex", "Hint Index", 0));
                result.addPropertyInfo(this.createEnumPropertyInfo("hintIndexType", "Hint Index Type", IndexType.SCALE, IndexType));

                result.addPropertyInfo(this.createDefaultIntPropertyInfo("hintMaxDistance", "Hint Max Distance", 6));
                result.addPropertyInfo(this.createEnumPropertyInfo("hintDistanceOffsetType", "Hint Distance Offset Type", OffsetType.HALF_STEP, OffsetType));

                result.addPropertyInfo(this.createDefaultIntListPropertyInfo("chordRootPitchClassConstraint", "Chord Root Pitch Class Constraints", []));
                result.addPropertyInfo(this.createDefaultIntListPropertyInfo("chordBassPitchClassConstraint", "Chord Bass Pitch Class Constraints", []));

                result.addPropertyInfo(this.createDefaultIntRangePropertyInfo("range", "Range", [30, 100]));
                result.addPropertyInfo(this.createEnumPropertyInfo("rangeIndexType", "Range Index Type", IndexType.MIDI_NOTE, IndexType));

                result.addPropertyInfo(this.createDefaultIntPropertyInfo("maxOverlap", "Max Overlap", 0));
                result.addPropertyInfo(this.createEnumPropertyInfo("overlapOffsetType", "Max Overlap Offset Type", OffsetType.HALF_STEP, OffsetType));

                result.addPropertyInfo(this.createDefaultIntPropertyInfo("maxSpacing", "Max Spacing", 0));
                result.addPropertyInfo(this.createEnumPropertyInfo("spacingOffsetType", "Max Spacing Offset Type", OffsetType.HALF_STEP, OffsetType));

                result.addPropertyInfo(this.createDefaultIntPropertyInfo("maxNoPenaltyLeap", "Max Leap Without Penalty", 12));
                result.addPropertyInfo(this.createEnumPropertyInfo("leapOffsetType", "Max Leap Offset Type", OffsetType.HALF_STEP, OffsetType));

            } else if (obj instanceof UndefinedVoiceLineElement) {

        }

        } else {
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("length", "Harmony Step Length", 1));
            result.addPropertyInfo(this.createEnumPropertyInfo("lengthType", "Harmony Step Length Type", HarmonyStepLengthType.HARMONY_STEPS, HarmonyStepLengthType));

            if (obj instanceof ConstantSequenceVoiceLineElement) {
                result.addPropertyInfo(this.createDefaultIntListPropertyInfo("indices", "Indices", [0]));
                result.addPropertyInfo(this.createEnumPropertyInfo("indexType", "Index Type", IndexType.SCALE, IndexType));
                result.addPropertyInfo(this.createDefaultIntListPropertyInfo("octaves", "Octaves", [0]));
                result.addPropertyInfo(this.createEnumPropertyInfo("snapType", "Snap Type", SnapType.CHORD, SnapType));
            //            }else if (obj instanceof ClassicalAdaptiveSequenceVoiceLineElement) {
            }
        }

    } else if (obj instanceof ControlChannel) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("controlchannel", this.controlChannelsUidInfo));

        result.addPropertyInfo(this.createDefaultMinMaxIntPropertyInfo("slotsPerBeat", "Slots per beat", 32, 1, 128));
        result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("mixWithDefault", "Mix with default value", false));

        if (obj instanceof DoubleControlChannel) {
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("defaultValue", "Default value", 0.0));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("useRange", "Use range", false));
            result.addPropertyInfo(this.createDefaultFloatRangePropertyInfo("range", "Range", [-1.0, 1.0]));
            result.addPropertyInfo(this.createEnumPropertyInfo("mixMode", "Mix mode", NumericControlChannelMixMode.ADD, NumericControlChannelMixMode));

            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("trueWriteValue", "True write value", 1.0));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("falseWriteValue", "False write value", 0.0));

            result.addPropertyInfo(this.createEnumPropertyInfo("readIntSnapMetrics", "Read int snap metrics", SnapMetrics.ROUND, SnapMetrics));
        } else if (obj instanceof IntegerControlChannel) {
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("defaultValue", "Default value", 0));
            result.addPropertyInfo(this.createEnumPropertyInfo("mixSnapMetrics", "Mix snap metrics", SnapMetrics.ROUND, SnapMetrics));
            result.addPropertyInfo(this.createEnumPropertyInfo("mixMode", "Mix mode", NumericControlChannelMixMode.ADD, NumericControlChannelMixMode));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("useRange", "Use range", false));
            result.addPropertyInfo(this.createDefaultIntRangePropertyInfo("range", "Range", [-1, 1]));

            result.addPropertyInfo(this.createDefaultIntPropertyInfo("trueWriteValue", "True write value", 1));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("falseWriteValue", "False write value", 0));
        }else if (obj instanceof BooleanControlChannel) {
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("defaultValue", "Default value", false));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("doubleWriteThreshold", "Double write threshold", 0.5));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("intWriteThreshold", "Integer write threshold", 1));

            result.addPropertyInfo(this.createEnumPropertyInfo("mixMode", "Mix mode", BooleanControlChannelMixMode.OR, BooleanControlChannelMixMode));

            result.addPropertyInfo(this.createDefaultIntPropertyInfo("trueReadIntValue", "True read int value", 1));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("falseReadIntValue", "False read int value", 0));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("trueReadDoubleValue", "True read double value", 1.0));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("falseReadDoubleValue", "False read double value", 0.0));
        }

    } else if (obj instanceof AbstractVoiceLinePlannerConstraintZone) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("zone", this.voicePlannerConstraintZonesUidInfo));

        if (obj instanceof IndexedVoiceLinePlannerConstraintZone) {

            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("globalIndices", "Global indices", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("indexPattern", "Index pattern", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("startIndexPattern", "Start index pattern", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("endIndexPattern", "End index pattern", []));

            result.addPropertyInfo(this.createObjectListPropertyInfo("constraints", "Constraints", this.voicePlannerConstraintsUidInfo,
                [
                ["ChordDoublingVoiceLinePlannerConstraint", "Chord Doubling"],
                ["ChordCompletenessVoiceLinePlannerConstraint", "Chord Completeness"]
                //                ["EmptyVoiceLinePlannerConstraint", "Empty"]
                ]));
        }

        result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("addInstanceDuplicates", "Add instance duplicates", false));
        result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("addClassDuplicates", "Add class duplicates", false));

    } else if (obj instanceof VoiceLinePlannerConstraint) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("constraint", this.voicePlannerConstraintsUidInfo));

        if (obj instanceof StandardVoiceLinePlannerConstraint) {
            
    }
    } else if (obj instanceof SuspAntStrategy) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("strategy", this.suspAntStrategiesUidInfo));

        result.addPropertyInfo(this.createIdReferenceListPropertyInfo("voiceLines", "Voice lines", this.voiceLinesUidInfo));

        if (obj instanceof SimpleSuspAntStrategy) {
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("possibleLengthIncrements", "Possible length increments", [1]));
            result.addPropertyInfo(this.createEnumPropertyInfo("possibleLengthIncrementUnit", "Possible length increments unit", PositionUnit.BEATS, PositionUnit));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("minLength", "Min length", 1));
            result.addPropertyInfo(this.createEnumPropertyInfo("minLengthUnit", "Min length unit", PositionUnit.BEATS, PositionUnit));
        }

    } else if (obj instanceof RenderChannel) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("renderchannel", this.renderChannelsUidInfo));

    } else if (obj instanceof VoiceLine) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("voiceline", this.voiceLinesUidInfo));

        if (obj instanceof ConstantVoiceLine) {
            // Only constant stuff is allowed
            var info = this.createObjectListPropertyInfo("lineElements", "Voice Elements", this.voiceElementsUidInfo,
                [["ConstantVoiceLineElement", "Simple"],
                ["ConstantSequenceVoiceLineElement", "Simple Sequence"]
                ]);
            result.addPropertyInfo(info);
        } else if (obj instanceof SimpleBassVoiceLine) {
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("octaves", "Octaves", -1));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("startOctaves", "Start octaves", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("endOctaves", "End octaves", []));

        } else if (obj instanceof ClassicalAdaptiveVoiceLine) {

            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("useHintCurve", "Use hint curve", false));
            result.addPropertyInfo(this.createIdReferencePropertyInfo("hintCurve", "Hint curve", this.curvesUidInfo));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("hintCurveMultiplier", "Hint curve multiplier", 1.0));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("hintCurveBias", "Hint curve bias", 0.0));
            result.addPropertyInfo(this.createEnumPropertyInfo("hintCurveSnapMetrics", "Hint curve snap metrics", SnapMetrics.ROUND, SnapMetrics));

            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("suspendPattern", "Suspend pattern", [0]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("startSuspendPattern", "Start suspend pattern", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("endSuspendPattern", "End suspend pattern", []));
            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("phraseSuspendPattern", "Phrase suspend pattern", []));
            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("startPhraseSuspendPattern", "Start phrase suspend pattern", []));
            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("endPhraseSuspendPattern", "End phrase suspend pattern", []));

            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("hintIndices", "Hint indices", []));
            result.addPropertyInfo(this.createEnumPropertyInfo("hintIndexType", "Hint index type", IndexType.SCALE, IndexType));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("startHintIndices", "Start hint indices", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("endHintIndices", "End hint indices", []));

            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("maxHintDistances", "Max hint distances", [6]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("startMaxHintDistances", "Start max hint distances", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("endMaxHintDistances", "End max hint distances", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("penaltyMaxHintDistances", "Max penalty hint distances", [3]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("startPenaltyMaxHintDistances", "Start max penalty hint distances", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("endPenaltyMaxHintDistances", "End max penalty hint distances", []));
            result.addPropertyInfo(this.createEnumPropertyInfo("hintDistanceOffsetType", "Max hint distance offset type", OffsetType.HALF_STEP, OffsetType));

            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("chordRootPitchClassConstraints", "Chord root constraints", [[]]));
            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("startChordRootPitchClassConstraints", "Start chord root constraints", []));
            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("endChordRootPitchClassConstraints", "End chord root constraints", []));

            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("chordBassPitchClassConstraints", "Chord bass constraints", [[]]));
            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("startChordBassPitchClassConstraints", "Start chord bass constraints", []));
            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("endChordBassPitchClassConstraints", "End chord bass constraints", []));

            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("maxSpacings", "Max spacings to upper adjacent", [24]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("startMaxSpacings", "Start max spacings", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("endMaxSpacings", "End max spacings", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("penaltyMaxSpacings", "Max penalty spacings to upper adjacent", [12]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("startPenaltyMaxSpacings", "Start max penalty spacings", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("endPenaltyMaxSpacings", "End max penalty spacings", []));
            result.addPropertyInfo(this.createEnumPropertyInfo("spacingOffsetType", "Max spacing offset type", OffsetType.HALF_STEP, OffsetType));

        //    // Add more start/end stuff if necessary
        //    this.maxOverlaps = [0];
        //    this.overlapOffsetType = OffsetType.HALF_STEP;
        //
        //    this.maxNoPenaltyLeaps = [12];
        //    this.leapOffsetType = OffsetType.HALF_STEP;
        //
        //    this.ranges = [[30, 100]];
        //    this.rangeIndexType = IndexType.MIDI_NOTE;


        } else {
            // A voice line that can have adaptive elements as well
            var info = this.createObjectListPropertyInfo("lineElements", "Voice Elements", this.voiceElementsUidInfo,
                [["ConstantVoiceLineElement", "Simple"],
                ["ClassicalAdaptiveVoiceLineElement", "Classical Adaptive"],
                ["ConstantSequenceVoiceLineElement", "Simple Sequence"],
                ["ClassicalAdaptiveSequenceVoiceLineElement", "Classical Adaptive Sequence"]]);
            result.addPropertyInfo(info);
        }

    }
    else if (obj instanceof ControlElement) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("controlelement", this.controlElementsUidInfo));

        result.addPropertyInfo(this.createDefaultFloatPropertyInfo("startTime", "Start position", 0.0));
        result.addPropertyInfo(this.createEnumPropertyInfo("startTimeUnit", "Start position unit", PositionUnit.BEATS, PositionUnit));
        result.addPropertyInfo(this.createDefaultFloatPropertyInfo("endTime", "End position", 1.0));
        result.addPropertyInfo(this.createEnumPropertyInfo("endTimeUnit", "End position unit", PositionUnit.BEATS, PositionUnit));

        result.addPropertyInfo(this.createDefaultFloatPropertyInfo("controlOffset", "Control Offset", 0.0));
        result.addPropertyInfo(this.createEnumPropertyInfo("controlOffsetUnit", "Control Offset Unit", PositionUnit.BEATS, PositionUnit));

        if (obj instanceof CurveControlElement) {
            result.addPropertyInfo(this.createIdReferencePropertyInfo("curve", "Curve", this.curvesUidInfo));

            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("cycles", "Curve cycles", 1.0));
            result.addPropertyInfo(this.createEnumPropertyInfo("cyclesUnit", "Curve cycles unit", CyclesUnit.CYCLES_PER_PERIOD, CyclesUnit));

            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("multiplier", "Curve multiplier", 1.0));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("bias", "Curve bias", 0.0));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("phase", "Curve phase", 0.0));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("frequencyMultiplier", "Curve frequency multiplier", 1.0));

            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("constantValue", "Constant curve value", 0.0));
        }

    } else if (obj instanceof RenderElementZone) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("zone", this.renderElementZonesUidInfo));

        if (obj instanceof HarmonyCountRenderElementZone) {
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("onePerHarmonyIndex", "One per harmony index", false));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("harmonyCounts", "Harmony counts", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("harmonyCountDividers", "Harmony count dividers", []));

            result.addPropertyInfo(this.createObjectListPropertyInfo("renderElements", "Render elements", this.renderElementsUidInfo,
                this.getRenderElementConstructorTexts()));
        }

    } else if (obj instanceof RenderElement) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("renderelement", this.renderElementsUidInfo));

        result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("activated", "Activated", true));

        if (obj instanceof PositionedRenderElement) {

            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("startTime", "Start position", 0.0));
            result.addPropertyInfo(this.createEnumPropertyInfo("startTimeUnit", "Start position unit", PositionUnit.BEATS, PositionUnit));

            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("renderOffset", "Render Offset", 0.0));
            result.addPropertyInfo(this.createEnumPropertyInfo("renderOffsetUnit", "Render Offset Unit", PositionUnit.BEATS, PositionUnit));


            if (obj instanceof MotifRenderElement) {
                result.addPropertyInfo(this.createIdReferencePropertyInfo("motif", "Motif", this.motifsUidInfo));
                result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("useVoiceLine", "Use voice line", true));
                result.addPropertyInfo(this.createIdReferencePropertyInfo("voiceLine", "Voice line", this.voiceLinesUidInfo));
                result.addPropertyInfo(this.createIdReferencePropertyInfo("figurationPlanner", "Figuration planner", this.figurationPlannersUidInfo));

                result.addPropertyInfo(this.createEnumPropertyInfo("relativeType", "Relative type", VerticalRelativeType.SCALE_BASE, VerticalRelativeType));
                result.addPropertyInfo(this.createDefaultIntListPropertyInfo("offsets", "Offsets", [0]));
                result.addPropertyInfo(this.createEnumPropertyInfo("offsetType", "Offset type", OffsetType.SCALE, OffsetType));
                result.addPropertyInfo(this.createDefaultIntListPropertyInfo("startOffsets", "Start offsets", []));
                result.addPropertyInfo(this.createDefaultIntListPropertyInfo("endOffsets", "End offsets", []));

                result.addPropertyInfo(this.createDefaultIntPropertyInfo("seed", "Seed", 12345));
                result.addPropertyInfo(this.createDefaultFloatPropertyInfo("splitNoteMinLength", "Split Note Min Length", 1.0));
                result.addPropertyInfo(this.createEnumPropertyInfo("splitNoteMinLengthUnit", "Split Note Min Length Unit", PositionUnit.BEAT_EIGHTHS, PositionUnit));
                result.addPropertyInfo(this.createEnumPropertyInfo("cutHarmonyMode", "Cut Harmony Mode", RenderElementCutHarmonyMode.STOP, RenderElementCutHarmonyMode));
                result.addPropertyInfo(this.createEnumPropertyInfo("noteOverlapHarmonyMode", "Note Overlap Harmony Mode", NoteOverlapHarmonyMode.CONTINUE, NoteOverlapHarmonyMode));
                result.addPropertyInfo(this.createEnumPropertyInfo("noteOverlapSnapType", "Note Overlap Snap Type", SnapType.SCALE, SnapType));
            } else if (obj instanceof PhraseStructureRenderElement) {
                result.addPropertyInfo(this.createObjectListPropertyInfo("renderElements", "Render elements", this.renderElementsUidInfo, this.getRenderElementConstructorTexts()));
                result.addPropertyInfo(this.createObjectListPropertyInfo("startRenderElements", "Start render elements", this.renderElementsUidInfo, this.getRenderElementConstructorTexts()));
                result.addPropertyInfo(this.createObjectListPropertyInfo("endRenderElements", "End render elements", this.renderElementsUidInfo, this.getRenderElementConstructorTexts()));

            } else if (obj instanceof ZonesRenderElement) {

                result.addPropertyInfo(this.createDefaultIntListPropertyInfo("defaultZoneIndices", "Default zone indices", [0]));
                result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("useDefaultIfNoneApplicable", "Use default when no applicable", true));
                
                result.addPropertyInfo(this.createObjectListPropertyInfo("zones", "Zones", this.renderElementZonesUidInfo,
                    [["HarmonyCountRenderElementZone", "Harmony Count Zone"]]));
                    
            } else if (obj instanceof FlexiblePercussionMotifRenderElement) {
                
                result.addPropertyInfo(this.createIdReferenceListPropertyInfo("motifs", "Motifs", this.percussionMotifsUidInfo));
                result.addPropertyInfo(this.createIdReferenceListPropertyInfo("startMotifs", "Start motifs", this.percussionMotifsUidInfo));
                result.addPropertyInfo(this.createIdReferenceListPropertyInfo("endMotifs", "End motifs", this.percussionMotifsUidInfo));

            } else if (obj instanceof PercussionMotifRenderElement) {
                
                result.addPropertyInfo(this.createDefaultFloatPropertyInfo("count", "Count", 1));
                result.addPropertyInfo(this.createEnumPropertyInfo("countUnit", "Count Unit", CountUnit.HARMONY_MEASURES, CountUnit));
                result.addPropertyInfo(this.createIdReferenceListPropertyInfo("motifs", "Motifs", this.percussionMotifsUidInfo));
                result.addPropertyInfo(this.createIdReferenceListPropertyInfo("startMotifs", "Start motifs", this.percussionMotifsUidInfo));
                result.addPropertyInfo(this.createIdReferenceListPropertyInfo("endMotifs", "End motifs", this.percussionMotifsUidInfo));

                result.addPropertyInfo(this.createDefaultFloatPropertyInfo("stepOffset", "Step offset", 1.0));
                result.addPropertyInfo(this.createEnumPropertyInfo("stepOffsetUnit", "Step offset unit", PositionUnit.MEASURES, PositionUnit));

            } else if (obj instanceof AbstractHarmonyIndexPatternMotifRenderElement) {

                if (obj instanceof HarmonyIndexPatternMotifRenderElement) {
                    result.addPropertyInfo(this.createIdReferenceListPropertyInfo("motifs", "Motifs", this.motifsUidInfo));
                    result.addPropertyInfo(this.createIdReferenceListPropertyInfo("startMotifs", "Start motifs", this.motifsUidInfo));
                    result.addPropertyInfo(this.createIdReferenceListPropertyInfo("endMotifs", "End motifs", this.motifsUidInfo));
                } else if (obj instanceof HarmonyIndexIndexPatternMotifRenderElement) {
                    result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("indices", "Indices", []));
                    result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("startIndices", "Start indices", []));
                    result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("endIndices", "End indices", []));
                    
                    result.addPropertyInfo(this.createIdReferenceListPropertyInfo("motifs", "Motifs", this.motifsUidInfo));
                }
                result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("useVoiceLine", "Use voice line", true));
                result.addPropertyInfo(this.createIdReferencePropertyInfo("voiceLine", "Voice line", this.voiceLinesUidInfo));

                result.addPropertyInfo(this.createEnumPropertyInfo("relativeType", "Relative type", VerticalRelativeType.SCALE_BASE, VerticalRelativeType));
                result.addPropertyInfo(this.createDefaultIntListPropertyInfo("offsets", "Offsets", [0]));
                result.addPropertyInfo(this.createEnumPropertyInfo("offsetType", "Offset type", OffsetType.SCALE, OffsetType));
                result.addPropertyInfo(this.createDefaultIntListPropertyInfo("startOffsets", "Start offsets", []));
                result.addPropertyInfo(this.createDefaultIntListPropertyInfo("endOffsets", "End offsets", []));

                result.addPropertyInfo(this.createDefaultIntListPropertyInfo("seeds", "Seeds", [12345]));
                result.addPropertyInfo(this.createDefaultIntListPropertyInfo("startSeeds", "Start seeds", [12345]));
                result.addPropertyInfo(this.createDefaultIntListPropertyInfo("endSeeds", "End seeds", [12345]));

                result.addPropertyInfo(this.createEnumPropertyInfo("cutHarmonyMode", "Cut Harmony Mode", RenderElementCutHarmonyMode.STOP, RenderElementCutHarmonyMode));
                result.addPropertyInfo(this.createEnumPropertyInfo("noteOverlapHarmonyMode", "Note Overlap Harmony Mode", NoteOverlapHarmonyMode.CONTINUE, NoteOverlapHarmonyMode));
                result.addPropertyInfo(this.createEnumPropertyInfo("noteOverlapSnapType", "Note Overlap Snap Type", SnapType.SCALE, SnapType));

            } else if (obj instanceof MultiMotifRenderElement) {
                result.addPropertyInfo(this.createDefaultFloatPropertyInfo("count", "Count", 1));
                result.addPropertyInfo(this.createEnumPropertyInfo("countUnit", "Count Unit", CountUnit.HARMONY_MEASURES, CountUnit));
                result.addPropertyInfo(this.createIdReferenceListPropertyInfo("motifs", "Motifs", this.motifsUidInfo));
                result.addPropertyInfo(this.createIdReferenceListPropertyInfo("startMotifs", "Start motifs", this.motifsUidInfo));
                result.addPropertyInfo(this.createIdReferenceListPropertyInfo("endMotifs", "End motifs", this.motifsUidInfo));

                result.addPropertyInfo(this.createDefaultFloatPropertyInfo("stepOffset", "Step offset", 1.0));
                result.addPropertyInfo(this.createEnumPropertyInfo("stepOffsetUnit", "Step offset unit", PositionUnit.MEASURES, PositionUnit));

                result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("useVoiceLine", "Use voice line", true));
                result.addPropertyInfo(this.createIdReferencePropertyInfo("voiceLine", "Voice line", this.voiceLinesUidInfo));

                result.addPropertyInfo(this.createEnumPropertyInfo("relativeType", "Relative type", VerticalRelativeType.SCALE_BASE, VerticalRelativeType));
                result.addPropertyInfo(this.createDefaultIntListPropertyInfo("offsets", "Offsets", [0]));
                result.addPropertyInfo(this.createEnumPropertyInfo("offsetType", "Offset type", OffsetType.SCALE, OffsetType));
                result.addPropertyInfo(this.createDefaultIntListPropertyInfo("startOffsets", "Start offsets", []));
                result.addPropertyInfo(this.createDefaultIntListPropertyInfo("endOffsets", "End offsets", []));

                result.addPropertyInfo(this.createDefaultIntListPropertyInfo("seeds", "Seeds", [12345]));
                result.addPropertyInfo(this.createDefaultIntListPropertyInfo("startSeeds", "Start seeds", [12345]));
                result.addPropertyInfo(this.createDefaultIntListPropertyInfo("endSeeds", "End seeds", [12345]));

                result.addPropertyInfo(this.createEnumPropertyInfo("cutHarmonyMode", "Cut Harmony Mode", RenderElementCutHarmonyMode.STOP, RenderElementCutHarmonyMode));
                result.addPropertyInfo(this.createEnumPropertyInfo("noteOverlapHarmonyMode", "Note Overlap Harmony Mode", NoteOverlapHarmonyMode.CONTINUE, NoteOverlapHarmonyMode));
                result.addPropertyInfo(this.createEnumPropertyInfo("noteOverlapSnapType", "Note Overlap Snap Type", SnapType.SCALE, SnapType));

            }
        }
    } else if (obj instanceof RenderLine) {

        result.addPropertyInfo(this.createUniqueIdPropertyInfo("renderline", this.renderLinesUidInfo));

        result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("activated", "Activated", true));

        if (obj instanceof PrimitiveRenderLine) {
            result.addPropertyInfo(this.createIdReferencePropertyInfo("channel", "Render Channel", this.renderChannelsUidInfo));

            var info = this.createObjectListPropertyInfo("renderElements", "Render Elements", this.renderElementsUidInfo,
                this.getRenderElementConstructorTexts());
            result.addPropertyInfo(info);
        }
    } else if (obj instanceof ControlLine) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("controlline", this.controlLinesUidInfo));

        if (obj instanceof PrimitiveControlLine) {
            result.addPropertyInfo(this.createIdReferencePropertyInfo("channel", "Control Channel", this.controlChannelsUidInfo));

            var info = this.createObjectListPropertyInfo("controlElements", "Control Elements", this.controlElementsUidInfo,
                [["CurveControlElement", "Curve Control"]]);
            result.addPropertyInfo(info);
        }
    } else if (obj instanceof AbstractSection) {

        if (obj instanceof Section) {

            result.addPropertyInfo(this.createUniqueIdPropertyInfo("section", this.sectionsUidInfo));

            result.addPropertyInfo(this.createPreviewPropertyInfo("SectionPreviewComponent"));

            result.addPropertyInfo(this.createIdReferencePropertyInfo("harmonicRythm", "Harmony", this.harmonyUidInfo));
            result.addPropertyInfo(this.createIdReferencePropertyInfo("voiceLinePlanner", "Voice Line Planner", this.voiceLinePlannersUidInfo));
            result.addPropertyInfo(this.createIdReferencePropertyInfo("figurationPlanner", "Default Figuration Planner", this.figurationPlannersUidInfo));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("tempo", "Tempo (BPM)", 80.0));

            var info = this.createObjectListPropertyInfo("voiceLines", "Voice Lines", this.voiceLinesUidInfo,
                [["ConstantVoiceLine", "Simple Line"],
                ["SimpleBassVoiceLine", "Simple Bass Line"],
                ["ClassicalAdaptiveVoiceLine", "Classical Adaptive Line"]
                ]);
            result.addPropertyInfo(info);

            var info = this.createObjectListPropertyInfo("renderLines", "Render Lines", this.renderLinesUidInfo,
                [["PrimitiveRenderLine", "Simple Render Line"]]);
            result.addPropertyInfo(info);

            var info = this.createObjectListPropertyInfo("suspAntStrategies", "Suspension/Anticipation Strategies", this.suspAntStrategiesUidInfo,
                [["SimpleSuspAntStrategy", "Simple Strategy"]]);
            result.addPropertyInfo(info);

            var info = this.createObjectListPropertyInfo("controlLines", "Control Lines", this.controlLinesUidInfo,
                [["PrimitiveControlLine", "Simple"]]);
            result.addPropertyInfo(info);
            
            result.addPropertyInfo(this.createObjectListPropertyInfo("modifiers", "Section Modifiers", this.sectionModifiersUidInfo,
                this.getSectionModifierConstructorTexts()));
        } else if (obj instanceof SectionReference) {
            result.addPropertyInfo(this.createUniqueIdPropertyInfo("section", this.sectionReferencesUidInfo));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("active", "Active", true));

            result.addPropertyInfo(this.createPreviewPropertyInfo("SectionPreviewComponent"));
            
            result.addPropertyInfo(this.createIdReferenceNotSelfPropertyInfo("section", "Section", this.sectionsUidInfo));

            var info = this.createObjectListPropertyInfo("modifiers", "Section Modifiers", this.sectionReferenceModifiersUidInfo,
                this.getSectionModifierConstructorTexts());
            result.addPropertyInfo(info);
        }
            
    } else if (obj instanceof HarmonyModifier) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("modifier", this.harmonyModifiersUidInfo));

        if (obj instanceof RandomShortenHarmonyModifier) {
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("totalBeats", "Total beats", [0]));
            result.addPropertyInfo(this.createDefaultMinMaxIntPropertyInfo("maxAttempts", "Max attempts", 20, 1, 1000));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("indexLikelihoods", "Index likelihoods", [1]));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("startIndexLikelihoods", "Start index likelihoods", []));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("endIndexLikelihoods", "End index likelihoods", []));
            
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("minElementLength", "Min element length", 1));
            result.addPropertyInfo(this.createEnumPropertyInfo("minElementLengthUnit", "Min element length unit", PositionUnit.MEASURES, PositionUnit));

            result.addPropertyInfo(this.createDefaultIntPropertyInfo("seed", "Seed", 12345));

        } else if (obj instanceof ModeMixtureHarmonyModifier) {
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("majorRoots", "Major roots", [5]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("majorFromRoots", "Major from roots", [0]));
            result.addPropertyInfo(this.createEnumListPropertyInfo("majorNewScaleTypes", "Major new scale types", [ScaleType.NATURAL_MINOR], ScaleType));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("minorRoots", "Minor roots", [4, 6]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("minorFromRoots", "Minor from roots", []));
            result.addPropertyInfo(this.createEnumListPropertyInfo("minorNewScaleTypes", "Minor new scale types", [ScaleType.MELODIC_MINOR], ScaleType));
            
        } else if (obj instanceof AppendHarmonyModifier) {
            var info = this.createObjectListPropertyInfo("elements", "Elements", this.harmonyElementsUidInfo,
                this.getHarmonyElementConstructorTexts());
            result.addPropertyInfo(info);
        }
        
    } else if (obj instanceof ConstantHarmonicRythm) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("harmony", this.harmonyUidInfo));

        result.addPropertyInfo(this.createPreviewPropertyInfo("HarmonyPreviewComponent"));

        var info = this.createObjectListPropertyInfo("harmonyElements", "Harmony Elements", this.harmonyElementsUidInfo,
            this.getHarmonyElementConstructorTexts());
        result.addPropertyInfo(info);

        var info = this.createObjectListPropertyInfo("modifiers", "Modifiers", this.harmonyModifiersUidInfo,
            this.getHarmonyModifierConstructorTexts());
        result.addPropertyInfo(info);

    } else if (obj instanceof HarmonyElement) {

        result.addPropertyInfo(this.createUniqueIdPropertyInfo("harmonyelement", this.harmonyElementsUidInfo));

        result.addPropertyInfo(this.createPreviewPropertyInfo("HarmonyPreviewComponent"));

        if (obj instanceof HarmonyReferenceHarmonyElement) {
            result.addPropertyInfo(this.createIdReferencePropertyInfo("harmony", "Harmony", this.harmonyUidInfo));

        } else if (obj instanceof ConstantHarmonyElement) {
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("length", "Length", 1.0));
            result.addPropertyInfo(this.createPositionUnitPropertyInfo("lengthUnit", "Length Unit", PositionUnit.MEASURES));
            result.addPropertyInfo(this.createStrengthPropertyInfo("strength", "Strength", 1.0));
            result.addPropertyInfo(this.createEnumPropertyInfo("scaleType", "Scale Type", ScaleType.MAJOR, ScaleType));
            result.addPropertyInfo(this.createDefaultMidiNotePropertyInfo("baseNote", "Scale base note", 60));

            result.addPropertyInfo(this.createEnumPropertyInfo("chordType", "Chord Type", ChordType.TRIAD, ChordType));
            result.addPropertyInfo(this.createDefaultScaleIndexPropertyInfo("chordRoot", "Chord root scale index", 0));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("chordInversions", "Chord inversions", 0));

            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("scale", "Custom scale", [0, 2, 4, 5, 7, 9, 11]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("chord", "Custom chord scale indices", [0, 2, 4]));

            result.addPropertyInfo(this.createDefaultIntPropertyInfo("tsNumerator", "Time signature numerator", 4));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("tsDenominator", "Time signature denominator", 4));

            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("startsPhrase", "Starts phrase", false));
        } else if (obj instanceof SequenceHarmonyElement) {

            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("tsNumerators", "Numerators", [4]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("tsDenominators", "Denominators", [4]));

            result.addPropertyInfo(this.createEnumPropertyInfo("harmonyLengthMode", "Harmony length mode", HarmonyLengthMode.LENGTH_PATTERN, HarmonyLengthMode));

            result.addPropertyInfo(this.createDefaultIntPropertyInfo("count", "Count", 1));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("lengthPattern", "Length pattern", [1.0]));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("startLengthPattern", "Start length pattern", []));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("endLengthPattern", "End length pattern", []));
            result.addPropertyInfo(this.createPositionUnitPropertyInfo("lengthPatternUnit", "Length pattern unit", PositionUnit.MEASURES));

            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("totalLength", "Total length", 1.0));
            result.addPropertyInfo(this.createPositionUnitPropertyInfo("totalLengthUnit", "Total length unit", PositionUnit.MEASURES));

            result.addPropertyInfo(this.createIdReferencePropertyInfo("lengthRythm", "Length rythm", this.rythmsUidInfo));

            result.addPropertyInfo(this.createDefaultIntPropertyInfo("lengthRepeats", "Length repeats", 0));

            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("usePositionSnap", "Use position snap", false));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("positionSnapPattern", "Position snap pattern", [1.0]));
            result.addPropertyInfo(this.createPositionUnitPropertyInfo("positionSnapUnit", "Position snap unit", PositionUnit.BEATS));
            result.addPropertyInfo(this.createEnumPropertyInfo("positionSnapMetrics", "Position snap metrics", SnapMetrics.ROUND, SnapMetrics));

            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("phraseStructureCounts", "Phrase structure counts", []));

            if (obj instanceof PlannedHarmonyElement) {

                result.addPropertyInfo(this.createDefaultMidiNotePropertyInfo("scaleBaseNote", "Scale base note", 60));
                result.addPropertyInfo(this.createEnumPropertyInfo("scaleType", "Scale type", ScaleType.MAJOR, ScaleType));

                result.addPropertyInfo(this.createDefaultIntPropertyInfo("seed", "Seed", 12345));

                if (obj instanceof StaticSequenceHarmonyElement) {

                    result.addPropertyInfo(this.createDefaultIntPropertyInfo("baseRoot", "Base chord root", 0));
                    result.addPropertyInfo(this.createDefaultFloatPropertyInfo("baseToBaseLikelihood", "Base to base likelihood", 0.01));
                    result.addPropertyInfo(this.createDefaultFloatPropertyInfo("baseToNeighbourLikelihood", "Base to neighbour likelihood", 1));
                    result.addPropertyInfo(this.createDefaultFloatPropertyInfo("baseToPassingLikelihood", "Base to passing likelihood", 1));
                    result.addPropertyInfo(this.createDefaultFloatPropertyInfo("baseToAuxiliaryLikelihood", "Base to auxiliary likelihood", 1));
                    result.addPropertyInfo(this.createDefaultFloatPropertyInfo("auxiliaryToAuxiliaryLikelihood", "Auxiliary to auxiliary likelihood", 0.01));
                    result.addPropertyInfo(this.createDefaultFloatPropertyInfo("auxiliaryToBaseLikelihood", "Auxiliary to base likelihood", 1));
                    result.addPropertyInfo(this.createDefaultFloatPropertyInfo("auxiliaryToNeighbourLikelihood", "Auxiliary to neighbour likelihood", 1));
                    result.addPropertyInfo(this.createDefaultFloatPropertyInfo("auxiliaryToPassingLikelihood", "Auxiliary to passing likelihood", 1));
                    result.addPropertyInfo(this.createDefaultIntListPropertyInfo("auxiliaryChordRoots", "Auxiliary chord roots", [3, 4]));
                    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("auxiliaryChordRootLikelihoods", "Auxiliary chord root likelihoods", [1, 1]));

                    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("canEndWithBase", "Can end with base chord", true));
                    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("canEndWithAuxiliary", "Can end with auxiliary chord", false));
                    result.addPropertyInfo(this.createDefaultIntListPropertyInfo("possibleAuxiliaryEndRoots", "Possible auxiliary end chord roots", [3, 4]));
                } else if (obj instanceof DynamicSequenceHarmonyElement) {
                    result.addPropertyInfo(this.createDefaultIntListPropertyInfo("majorStartRoots", "Possible start roots", [0]));
                    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("majorStartRootLikelihoods", "Start root likelihoods", [1]));
                    result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("majorProgressionMovements", "Major progression movements", [[-4, -2, 1]]));
                    result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("startMajorProgressionMovements", "Start major progression movements", []));
                    result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("endMajorProgressionMovements", "End major progression movements", []));
                    result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("minorProgressionMovements", "Minor progression movements", [[-4, -2, 1]]));
                    result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("startMinorProgressionMovements", "Start minor progression movements", []));
                    result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("endMinorProgressionMovements", "End minor progression movements", []));
                    result.addPropertyInfo(this.createDefaultFloatList2DPropertyInfo("majorProgressionMovementLikelihoods", "Progression movement likelihoods", [1]));
                    result.addPropertyInfo(this.createDefaultIntListPropertyInfo("majorPossibleEndRoots", "Major possible end roots", [1, 3]));
                    result.addPropertyInfo(this.createDefaultIntListPropertyInfo("minorPossibleEndRoots", "Minor possible end roots", [1, 3]));
                    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("modulate", "Modulate", false));
                    result.addPropertyInfo(this.createDefaultIntListPropertyInfo("majorModulationPossibleEndRoots", "Major modulation possible end roots", [1, 3]));
                    result.addPropertyInfo(this.createDefaultIntListPropertyInfo("minorModulationPossibleEndRoots", "Minor modulation possible end roots", [1, 3]));
                    result.addPropertyInfo(this.createEnumPropertyInfo("majorModulationTarget", "Major modulation target", DynamicHarmonyModulationTarget.DOMINANT, DynamicHarmonyModulationTarget));
                    result.addPropertyInfo(this.createEnumPropertyInfo("minorModulationTarget", "Minor modulation target", DynamicHarmonyModulationTarget.MEDIANT, DynamicHarmonyModulationTarget));

                    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("addAllStarts", "Add all starts", true));
                    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("addAllMovements", "Add all movements", true));

                } else if (obj instanceof PhraseHarmonyElement) {
                    result.addPropertyInfo(this.createEnumPropertyInfo("phraseType", "Phrase type", PhraseHarmonyElementType.COMPLETE, PhraseHarmonyElementType));

                    result.addPropertyInfo(this.createDefaultFloatPropertyInfo("staticHarmonyLength", "Static length", 25));
                    result.addPropertyInfo(this.createEnumPropertyInfo("staticHarmonyLengthUnit", "Static length unit", LengthAndCountUnit.LENGTH_PERCENT, LengthAndCountUnit));
                    result.addPropertyInfo(this.createDefaultFloatRangePropertyInfo("staticHarmonyLengthLimits", "Static length limits", [0, 100]));
                    result.addPropertyInfo(this.createEnumPropertyInfo("staticHarmonyLengthLimitsUnit", "Static length limits unit", LengthAndCountUnit.LENGTH_PERCENT, LengthAndCountUnit));
                    result.addPropertyInfo(this.createDefaultFloatPropertyInfo("staticHarmonyLengthImportance", "Static length importance", 1.0));
                    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("staticHarmonyUseLocalSeed", "Static use local seed", false));
                    result.addPropertyInfo(this.createDefaultIntPropertyInfo("staticHarmonySeed", "Static local seed", 12345));

                    result.addPropertyInfo(this.createDefaultFloatPropertyInfo("dynamicHarmonyLength", "Dynamic length", 25));
                    result.addPropertyInfo(this.createEnumPropertyInfo("dynamicHarmonyLengthUnit", "Dynamic length unit", LengthAndCountUnit.LENGTH_PERCENT, LengthAndCountUnit));
                    result.addPropertyInfo(this.createDefaultFloatRangePropertyInfo("dynamicHarmonyLengthLimits", "Dynamic length limits", [0, 100]));
                    result.addPropertyInfo(this.createEnumPropertyInfo("dynamicHarmonyLengthLimitsUnit", "Dynamic length limits unit", LengthAndCountUnit.LENGTH_PERCENT, LengthAndCountUnit));
                    result.addPropertyInfo(this.createDefaultFloatPropertyInfo("dynamicHarmonyLengthImportance", "Dynamic length importance", 1.0));
                    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("dynamicHarmonyUseLocalSeed", "Dynamic use local seed", false));
                    result.addPropertyInfo(this.createDefaultIntPropertyInfo("dynamicHarmonySeed", "Dynamic local seed", 12345));

                    result.addPropertyInfo(this.createDefaultFloatPropertyInfo("dominantCadenceHarmonyLength", "Dominant length", 25));
                    result.addPropertyInfo(this.createEnumPropertyInfo("dominantCadenceHarmonyLengthUnit", "Dominant length unit", LengthAndCountUnit.LENGTH_PERCENT, LengthAndCountUnit));
                    result.addPropertyInfo(this.createDefaultFloatRangePropertyInfo("dominantCadenceHarmonyLengthLimits", "Dominant length limits", [0, 100]));
                    result.addPropertyInfo(this.createEnumPropertyInfo("dominantCadenceHarmonyLengthLimitsUnit", "Dominant length limits unit", LengthAndCountUnit.LENGTH_PERCENT, LengthAndCountUnit));
                    result.addPropertyInfo(this.createDefaultFloatPropertyInfo("dominantCadenceHarmonyLengthImportance", "Dominant length importance", 1.0));
                    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("dominantCadenceHarmonyUseLocalSeed", "Dominant use local seed", false));
                    result.addPropertyInfo(this.createDefaultIntPropertyInfo("dominantCadenceHarmonySeed", "Dominant local seed", 12345));

                    result.addPropertyInfo(this.createDefaultFloatPropertyInfo("tonicCadenceHarmonyLength", "Tonic cadence length", 25));
                    result.addPropertyInfo(this.createEnumPropertyInfo("tonicCadenceHarmonyLengthUnit", "Tonic cadence length unit", LengthAndCountUnit.LENGTH_PERCENT, LengthAndCountUnit));
                    result.addPropertyInfo(this.createDefaultFloatRangePropertyInfo("tonicCadenceHarmonyLengthLimits", "Tonic cadence length limits", [0, 100]));
                    result.addPropertyInfo(this.createEnumPropertyInfo("tonicCadenceHarmonyLengthLimitsUnit", "Tonic cadence length limits unit", LengthAndCountUnit.LENGTH_PERCENT, LengthAndCountUnit));
                    result.addPropertyInfo(this.createDefaultFloatPropertyInfo("tonicCadenceHarmonyLengthImportance", "Tonic cadence length importance", 1.0));
                    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("tonicCadenceHarmonyUseLocalSeed", "Tonic cadence use local seed", false));
                    result.addPropertyInfo(this.createDefaultIntPropertyInfo("tonicCadenceHarmonySeed", "Tonic cadence local seed", 12345));

                    result.addPropertyInfo(this.createEnumPropertyInfo("phraseShorteningMode", "Phrase shortening mode", PhraseHarmonyElementShorteningMode.BEATS, PhraseHarmonyElementShorteningMode));
                    result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("phraseShorteningBeats", "Phrase shortening beats", [[4, 2, 1]]));

                    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("phraseShorteningMinLengths", "Phrase shortening min lengths", [1]));
                    result.addPropertyInfo(this.createEnumPropertyInfo("phraseShorteningMinLengthUnit", "Phrase shortening min length unit", PositionUnit.BEATS, PositionUnit));
                }
            }
        }

        var info = this.createObjectListPropertyInfo("modifiers", "Modifiers", this.harmonyModifiersUidInfo,
            this.getHarmonyModifierConstructorTexts());
        result.addPropertyInfo(info);

    } else if (obj instanceof Rythm) {

        // Rythm unique id
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("rythm", this.rythmsUidInfo));

        result.addPropertyInfo(this.createPreviewPropertyInfo("RythmPreviewComponent"));

        var info = this.createObjectListPropertyInfo("rythmElements", "Rythm Elements", this.rythmElementsUidInfo,
            [["NoteRythmElement", "Simple"], ["SequenceRythmElement", "Simple sequence"], ["SplitRythmElement", "Split"]]);
        result.addPropertyInfo(info);

    } else if (obj instanceof RythmElement) {

        result.addPropertyInfo(this.createUniqueIdPropertyInfo("rythmelement", this.rythmElementsUidInfo));

        result.addPropertyInfo(this.createDefaultFloatPropertyInfo("length", "Length", 1.0));
        result.addPropertyInfo(this.createPositionUnitPropertyInfo("lengthUnit", "Length Unit", PositionUnit.BEATS));
        result.addPropertyInfo(this.createStrengthPropertyInfo("strength", "Strength", 0.75));

        if (obj instanceof NoteRythmElement) {
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("rest", "Rest", false));
            result.addPropertyInfo(this.createEnumPropertyInfo("lengthType", "Length Type", NoteRythmElementLengthType.NORMAL, NoteRythmElementLengthType));
        } else if (obj instanceof SequenceRythmElement) {
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("elementLengths", "Element lengths", [1]));
            result.addPropertyInfo(this.createPositionUnitPropertyInfo("elementLengthUnit", "Element lengths unit", PositionUnit.BEATS));
            result.addPropertyInfo(this.createEnumPropertyInfo("elementLengthBorderMode", "Element lengths index border mode", IndexBorderMode.RESTART, IndexBorderMode));

            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("elementStrengths", "Element strengths", [1]));
            result.addPropertyInfo(this.createEnumPropertyInfo("elementStrengthsBorderMode", "Element strengths index border mode", IndexBorderMode.RESTART, IndexBorderMode));

            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("restPattern", "Rest pattern", [0]));
            result.addPropertyInfo(this.createEnumPropertyInfo("restPatternBorderMode", "Rest pattern index border mode", IndexBorderMode.RESTART, IndexBorderMode));

            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("cutLast", "Cut last element", true));

            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("minElementLength", "Min element length (after cut)", 0.0));
            result.addPropertyInfo(this.createPositionUnitPropertyInfo("minElementLengthUnit", "Min element length unit", PositionUnit.BEATS));


        } else if (obj instanceof SplitRythmElement) {
            result.addPropertyInfo(this.createDefaultMinFloatPropertyInfo("noteCount", "Note count", 4, 1));
            result.addPropertyInfo(this.createEnumPropertyInfo("noteCountUnit", "Note count unit", CountUnit.PLAIN, CountUnit));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("extraNoteCount", "Extra note count", 0));
            result.addPropertyInfo(this.createEnumPropertyInfo("extraNoteCountUnit", "Extra note count unit", CountUnit.PLAIN, CountUnit));
            result.addPropertyInfo(this.createIdReferencePropertyInfo("densityCurve", "Density curve", this.curvesUidInfo));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("densityCurveAmplitude", "Density curve amplitude", 1.0));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("densityCurveBias", "Density curve bias", 0.0));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("densityCurveFrequency", "Density curve frequency", 1.0));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("densityCurvePhase", "Density curve phase", 0.0));
            
            result.addPropertyInfo(this.createObjectPropertyInfo("splitZoneCollection", "Split Zone Collection", this.splitZoneCollectionUidInfo,
                [["SplitZoneCollection", "Split Zone Collection"]]));
        }
    } else if (obj instanceof PercussionMotifZone) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("percussionmotifzone", this.percussionMotifZonesUidInfo));

        result.addPropertyInfo(this.createDefaultFloatPropertyInfo("start", "Start", 0));
        result.addPropertyInfo(this.createDefaultFloatPropertyInfo("end", "End", 1));
        result.addPropertyInfo(this.createPositionUnitPropertyInfo("positionUnit", "Position Unit", PositionUnit.MEASURES));

        if (obj instanceof VersatilePercussionMotifZone) {
            result.addPropertyInfo(this.createIdReferenceListPropertyInfo("namedNotes", "Named Notes", this.namedNotesUidInfo));

            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("noteIndexPattern", "Named note index pattern", [[0]]));
            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("startNoteIndexPattern", "Start named note index pattern", []));
            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("endNoteIndexPattern", "End named note index pattern", []));

            result.addPropertyInfo(this.createDefaultFloatList2DPropertyInfo("positionOffsetPattern", "Position offset pattern", [[0]]));
            result.addPropertyInfo(this.createDefaultFloatList2DPropertyInfo("startPositionOffsetPattern", "Start position offset pattern", []));
            result.addPropertyInfo(this.createDefaultFloatList2DPropertyInfo("endPositionOffsetPattern", "End position offset pattern", []));
            result.addPropertyInfo(this.createEnumPropertyInfo("positionOffsetUnit", "Position offset unit", PositionUnit.BEATS, PositionUnit));

            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("beatConditionMultiplier", "Beat condition multiplier", 1.0));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("beatConditionBias", "Beat condition bias", 0.0));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("beatConditionDivisorCheck", "Beat condition divisor check", 1.0));
            result.addPropertyInfo(this.createEnumPropertyInfo("beatConditionDivisorCheckUnit", "Beat condition divisor check unit", PositionUnit.MEASURES, PositionUnit));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("beatConditionMaxRelativeDistance", "Beat condition max relative distance", 0.01));

            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("beatConditionQuotients", "Beat condition possible quotients", []));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("beatConditionRemainders", "Beat condition possible remainders", []));
        }
    } else if (obj instanceof PercussionMotifElement) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("element", this.percussionMotifElementsUidInfo));

        if (obj instanceof PrimitivePercussionMotifElement) {
            result.addPropertyInfo(this.createDefaultMidiNotePropertyInfo("note", "Note", 60));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("startTime", "Start time", 0.0));
            result.addPropertyInfo(this.createEnumPropertyInfo("startTimeUnit", "Start time unit", PositionUnit.BEATS, PositionUnit));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("length", "Length", 1.0));
            result.addPropertyInfo(this.createEnumPropertyInfo("lengthUnit", "Length unit", PositionUnit.BEATS, PositionUnit));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("strength", "Strength", 1.0));
        } else if (obj instanceof PredefinedPercussionMotifElement) {
            result.addPropertyInfo(this.createEnumPropertyInfo("type", "Type", PredefinedPercussionMotifType.FILL_DOTTED_QUARTER_1, PredefinedPercussionMotifType));

            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("useDefaultDrums", "Use default drums", true));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("useNamedNotes", "Use named notes", false));

            result.addPropertyInfo(this.createEnumListPropertyInfo("drums", "Drums", [MidiDrum.BASS_DRUM_1], MidiDrum));
            result.addPropertyInfo(this.createIdReferenceListPropertyInfo("namedNotes", "Named notes", this.namedNotesUidInfo));

            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("normalStrength", "Normal strength", 0.8));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("ghostStrength", "Ghost strength", 0.4));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("rollStrength", "Roll strength", 0.5));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("flamStrength", "Flam strength", 0.5));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("accentStrength", "Accent strength", 0.8));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("marcatoStrength", "Marcato strength", 1.0));
        }
    } else if (obj instanceof AbstractPercussionMotif) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("percussionmotif", this.percussionMotifsUidInfo));

        if (obj instanceof PercussionMotif) {
            result.addPropertyInfo(this.createEnumPropertyInfo("mode", "Mode", PercussionMotifMode.ELEMENTS, PercussionMotifMode));

            result.addPropertyInfo(this.createIdReferencePropertyInfo("rythm", "Rythm", this.rythmsUidInfo));

            result.addPropertyInfo(this.createPreviewPropertyInfo("PercussionMotifPreviewComponent"));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("seed", "Seed", 12345));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("useExternalSeed", "Use external seed", false));

            var info = this.createObjectListPropertyInfo("zones", "Zones", this.percussionMotifZonesUidInfo,
                [
                ["VersatilePercussionMotifZone", "Versatile"]
                ]);
            result.addPropertyInfo(info);

            var info = this.createObjectListPropertyInfo("elements", "Elements", this.percussionMotifElementsUidInfo,
                [
                ["PrimitivePercussionMotifElement", "Primitive"],
                ["PredefinedPercussionMotifElement", "Predefined"]
                ]);
            result.addPropertyInfo(info);
        } else if (obj instanceof SingleElementPercussionMotif) {
            result.addPropertyInfo(this.createPreviewPropertyInfo("PercussionMotifPreviewComponent"));
            var info = this.createObjectPropertyInfo("element", "Element", this.percussionMotifElementsUidInfo, [
                ["PrimitivePercussionMotifElement", "Primitive"],
                ["PredefinedPercussionMotifElement", "Predefined"]
                ]);
            result.addPropertyInfo(info);
        }
    } else if (obj instanceof Motif) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("motif", this.motifsUidInfo));

        result.addPropertyInfo(this.createPreviewPropertyInfo("MotifPreviewComponent"));

        result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("rythmBased", "Rythm Based", false));

        result.addPropertyInfo(this.createIdReferencePropertyInfo("rythm", "Rythm", this.rythmsUidInfo));

        result.addPropertyInfo(this.createIdReferenceNotSelfPropertyInfo("inheritedMotif", "Inherits", this.motifsUidInfo));

        result.addPropertyInfo(this.createDefaultIntPropertyInfo("seed", "Seed", 12345));
        result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("useExternalSeed", "Use external seed", false));

        // Motif elements
        var info = this.createObjectListPropertyInfo("motifElements", "Motif Elements", this.motifElementsUidInfo,
            [
            ["SimpleSequenceMotifElement", "Simple sequence"],
            ["VerticalRelativeMotifElement", "Simple Vertical"],
            ["HorizontalRelativeMotifElement", "Simple Horizontal"],
            ["AdaptiveMotifElement", "Adaptive"]
            ]);
        result.addPropertyInfo(info);

        // Motif zones
        var info = this.createObjectListPropertyInfo("motifZones", "Motif Zones", this.motifZonesUidInfo,
            [["SimpleVerticalRelativeMotifZone", "Simple Vertical Zone"],
            ["SimpleHorizontalRelativeMotifZone", "Simple Horizontal Zone"],
            ["AdaptiveConnectMotifZone", "Adaptive Connect"],
            ["AdaptiveEmbellishMotifZone", "Adaptive Embellish"]
            ]);
        result.addPropertyInfo(info);

    } else if (obj instanceof MotifZone) {

        result.addPropertyInfo(this.createUniqueIdPropertyInfo("zone", this.motifZonesUidInfo));

        result.addPropertyInfo(this.createDefaultFloatPropertyInfo("start", "Start", 0));
        result.addPropertyInfo(this.createDefaultFloatPropertyInfo("end", "End", 1));
        result.addPropertyInfo(this.createPositionUnitPropertyInfo("positionUnit", "Position Unit", PositionUnit.MEASURES));

        result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("useLengthRange", "Use length range", false));
        result.addPropertyInfo(this.createDefaultFloatRangePropertyInfo("lengthRange", "Length range", [0, 1]));
        result.addPropertyInfo(this.createPositionUnitPropertyInfo("lengthRangeUnit", "Length range Unit", PositionUnit.MEASURES));

        if (obj instanceof SimpleVerticalRelativeMotifZone) {
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("indices", "Indices", [0]));
            result.addPropertyInfo(this.createEnumPropertyInfo("indexBorderMode", "Index Border Mode", IndexBorderMode.END, IndexBorderMode));
            result.addPropertyInfo(this.createEnumPropertyInfo("relativeType", "Relative Type", VerticalRelativeType.VOICE_LINE, VerticalRelativeType));
            result.addPropertyInfo(this.createEnumPropertyInfo("offsetType", "Offset Type", OffsetType.SCALE, OffsetType));
            result.addPropertyInfo(this.createEnumPropertyInfo("beforeOffsetSnapType", "Before Snap Type", SnapType.NONE, SnapType));
            result.addPropertyInfo(this.createEnumPropertyInfo("afterOffsetSnapType", "After Snap Type", SnapType.NONE, SnapType));
        } else if (obj instanceof SimpleHorizontalRelativeMotifZone) {

            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("indices", "Indices", [0]));
            result.addPropertyInfo(this.createEnumPropertyInfo("indexBorderMode", "Index Border Mode", IndexBorderMode.END, IndexBorderMode));
            result.addPropertyInfo(this.createEnumPropertyInfo("relativeType", "Relative Type", HorizontalRelativeType.NEXT_NOTE, HorizontalRelativeType));
            result.addPropertyInfo(this.createEnumPropertyInfo("offsetType", "Offset Type", OffsetType.SCALE, OffsetType));
            result.addPropertyInfo(this.createEnumPropertyInfo("beforeOffsetSnapType", "Before Snap Type", SnapType.NONE, SnapType));
            result.addPropertyInfo(this.createEnumPropertyInfo("afterOffsetSnapType", "After Snap Type", SnapType.NONE, SnapType));

        } else if (obj instanceof AdaptiveConnectMotifZone) {

            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("firstPartOfChord", "First part of chord", false));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("firstConnectToPrevious", "First connect to previous", true));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("lastConnectToNext", "Last connect to next", true));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("horizontalOffsets", "Horizontal offsets", [-2, -1, 0, 1, 2]));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("horizontalLikelihoods", "Horizontal likelihoods", [0.1, 1, 0.1, 1, 0.1]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("firstToPreviousHorizontalOffsets", "First to previous horizontal offsets", [-2, -1, 0, 1, 2]));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("firstToPreviousHorizontalLikelihoods", "First to previous horizontal likelihoods", [0.1, 1, 0.1, 1, 0.1]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("lastToNextHorizontalOffsets", "Last to next horizontal offsets", [-1, 0, 1]));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("lastToNextHorizontalLikelihoods", "Last to next horizontal likelihoods", [1, 0.01, 1]));

        } else if (obj instanceof AdaptiveEmbellishMotifZone) {

            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("verticalIndices", "Vertical indices", [0]));
            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("verticalOffsetDomains", "Vertical offset domain", [[-1, 0, 1]]));
            result.addPropertyInfo(this.createDefaultFloatList2DPropertyInfo("verticalOffsetLikelihoods", "Vertical offset likelihoods", [[1]]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("startVerticalIndices", "Start vertical indices", [0]));
            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("startVerticalOffsetDomains", "Start vertical offset domain", [[0]]));
            result.addPropertyInfo(this.createDefaultFloatList2DPropertyInfo("startVerticalOffsetLikelihoods", "Start vertical offset likelihoods", [[1]]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("endVerticalIndices", "End vertical indices", []));
            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("endVerticalOffsetDomains", "End vertical offset domain", []));
            result.addPropertyInfo(this.createDefaultFloatList2DPropertyInfo("endVerticalOffsetLikelihoods", "End vertical offset likelihoods", []));
            result.addPropertyInfo(this.createEnumPropertyInfo("verticalDomainOffsetType", "Vertical offset type", OffsetType.SCALE, OffsetType));


            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("useHorizontalOffsets", "Use horizontal offsets", true));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("useFirstHorizontalOffsets", "Use first horizontal offsets", true));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("useLastHorizontalOffsets", "Use last horizontal offsets", false));

            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("horizontalOffsets", "Horizontal offsets", [[-1, 0, 1]]));
            result.addPropertyInfo(this.createDefaultFloatList2DPropertyInfo("horizontalLikelihoods", "Horizontal likelihoods", [[1, 0.001, 1]]));
            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("startHorizontalOffsets", "Start horizontal offsets", []));
            result.addPropertyInfo(this.createDefaultFloatList2DPropertyInfo("startHorizontalLikelihoods", "Start horizontal likelihoods", []));
            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("endHorizontalOffsets", "End horizontal offsets", []));
            result.addPropertyInfo(this.createDefaultFloatList2DPropertyInfo("endHorizontalLikelihoods", "End horizontal likelihoods", []));
            result.addPropertyInfo(this.createEnumPropertyInfo("horizontalDomainOffsetType", "Horizontal offset type", OffsetType.SCALE, OffsetType));
            
        }

        // Filler stuff. Should be possible to hide them all with an editor property
        result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("fillerOffsets", "Filler Offsets", []));
        result.addPropertyInfo(this.createEnumListPropertyInfo("fillerOffsetTypes", "Filler Offset Types", OffsetType.CHORD, OffsetType));
        result.addPropertyInfo(this.createDefaultIntListPropertyInfo("fillerOnOffs", "Filler On/Offs", [1]));
        result.addPropertyInfo(this.createEnumListPropertyInfo("fillerSnapTypes", "Filler Snap Types", SnapType.NONE, SnapType));
        result.addPropertyInfo(this.createEnumPropertyInfo("fillerIndexBorderMode", "Filler Index Border Mode", IndexBorderMode.CLAMP, IndexBorderMode));
        result.addPropertyInfo(this.createEnumListPropertyInfo("fillerLengthModes", "Filler Length Modes", MotifZoneFillerLengthMode.RELATIVE_ADD, MotifZoneFillerLengthMode));
        result.addPropertyInfo(this.createDefaultFloatList2DPropertyInfo("fillerRelativeLengths", "Filler Relative Lengths", [[0.0]]));
        result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("fillerLengths", "Filler Lengths", [[1]]));
        result.addPropertyInfo(this.createEnumListPropertyInfo("fillerLengthUnits", "Filler Length Units", PositionUnit.BEATS, PositionUnit));
        result.addPropertyInfo(this.createDefaultFloatList2DPropertyInfo("fillerPositionOffsets", "Filler Position Offsets", [[0.0]]));
        result.addPropertyInfo(this.createEnumListPropertyInfo("fillerPositionOffsetUnits", "Filler Position Offset Units", PositionUnit.BEATS, PositionUnit));
        result.addPropertyInfo(this.createEnumListPropertyInfo("fillerRelativeTypes", "Filler Relative Types", VerticalRelativeType.NOTE, VerticalRelativeType));

    } else if (obj instanceof MotifElement) {

        this.createMotifElementPropertyInfos(obj, parentPropertyInfo, result);

    } else if (obj instanceof CurveComputation) {
        //        result.addPropertyInfo(this.createUniqueIdPropertyInfo("curvecomputation", this.curveComputationsUidInfo));

        if (obj instanceof DelayCurveComputation) {
            result.addPropertyInfo(this.createIdReferencePropertyInfo("inputCurve", "Input Curve", this.curvesUidInfo));
            result.addPropertyInfo(this.createIdReferencePropertyInfo("delayCurve", "Delay Curve", this.curvesUidInfo));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("delayConstant", "Delay Constant", 0.0));
        } else if (obj instanceof PeriodicCurveComputation) {
            result.addPropertyInfo(this.createIdReferencePropertyInfo("inputCurve", "Input Curve", this.curvesUidInfo));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("period", "Period", 0.0));
        } else if (obj instanceof SnapCurveComputation) {
            result.addPropertyInfo(this.createIdReferencePropertyInfo("inputCurve", "Input Curve", this.curvesUidInfo));
            result.addPropertyInfo(this.createEnumPropertyInfo("snapMetrics", "Snap metrics", SnapMetrics.ROUND, SnapMetrics));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("preMultiplier", "Pre multiplier", 1.0));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("postMultiplier", "Post multiplier", 1.0));
        } else if (obj instanceof MixCurveComputation) {
            result.addPropertyInfo(this.createIdReferencePropertyInfo("inputCurve1", "Input Curve 1", this.curvesUidInfo));
            result.addPropertyInfo(this.createIdReferencePropertyInfo("inputCurve2", "Input Curve 2", this.curvesUidInfo));
            result.addPropertyInfo(this.createIdReferencePropertyInfo("mixCurve", "Mix Curve", this.curvesUidInfo));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("mixConstant", "Mix Constant", 0.5));

        } else if (obj instanceof MultiInputCurveComputation) {
            result.addPropertyInfo(this.createIdReferenceListPropertyInfo("inputCurves", "Inputs", this.curvesUidInfo));
            if (obj instanceof ExpressionCurveComputation) {
                result.addPropertyInfo(this.createDefaultStringPropertyInfo("inputCurvePrefix", "Input curve name prefix", "input"));
                result.addPropertyInfo(this.createDefaultStringPropertyInfo("inputVariableName", "Input variable name", "x"));
                result.addPropertyInfo(this.createStringTextAreaPropertyInfo("valueExpression", "Value expression", "x"));
            } else if (obj instanceof OscillatorCurveComputation) {
                result.addPropertyInfo(this.createDefaultIntPropertyInfo("count", "Count", 1));
                result.addPropertyInfo(this.createDefaultIntListPropertyInfo("curveIndices", "Curve indices", [0]));
                result.addPropertyInfo(this.createDefaultFloatPropertyInfo("baseFrequency", "Base frequency", 1.0));
                result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("curveAmplitudes", "Amplitudes", [1.0]));
                result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("curveFrequencyMultipliers", "Frequency multipliers", [1.0]));
                result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("curvePhases", "Phases", [0.0]));
            }
        }

    } else if (obj instanceof Curve) {
        result.addPropertyInfo(this.createUniqueIdPropertyInfo("curve", this.curvesUidInfo));


        if (obj instanceof PredefinedCurve) {
            result.addPropertyInfo(this.createEnumPropertyInfo("type", "Curve Type", PredefinedCurveType.CONSTANT, PredefinedCurveType));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("amplitude", "Amplitude", 1.0));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("bias", "Bias", 0.0));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("frequency", "Frequency", 1.0));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("phase", "Phase", 0.0));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("clampUpper", "Clamp upper value", false));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("upperClamp", "Upper clamp limit", 1.0));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("clampLower", "Clamp lower value", false));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("lowerClamp", "Lower clamp limit", -1.0));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("seed", "Seed", 123456));
        } else if (obj instanceof ComputationCurve) {
            result.addPropertyInfo(this.createObjectPropertyInfo("computation", "Computation", this.curveComputationsUidInfo,
                [["AddCurveComputation", "Add"],
                ["MultiplyCurveComputation", "Mult"],
                ["MinCurveComputation", "Min"],
                ["MaxCurveComputation", "Max"],
                ["AbsCurveComputation", "Abs"],
                ["ClampCurveComputation", "Clamp"],
                ["MirrorCurveComputation", "Mirror"],
                ["PeriodicCurveComputation", "Make Periodic"],
                ["MixCurveComputation", "Mix"],
                ["RemapCurveComputation", "Remap"],
                ["SnapCurveComputation", "Snap"],
                ["DelayCurveComputation", "Delay"],
                ["OscillatorCurveComputation", "Oscillator"],
                ["ExpressionCurveComputation", "Expression"]
                ]));
        }
        result.addPropertyInfo(this.createPreviewPropertyInfo("CurvePreviewComponent"));
    } else {
        logit("Unable to create proeprty info for " + obj + " constructor: " + obj._constructorName + " json: " + objectToJson(obj).join("") + " <br />");
    }
    return result;
};



