
function PropertyInfoProvider(options) {

    this.uniqueIdManager = getValueOrDefault(options, "uniqueIdManager", new UniqueIdManager());

    var uidManager = this.uniqueIdManager;

    this.spsiUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "spsi",
        initPrefix: "spsi"
    });
    this.spsidsUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "spsids",
        initPrefix: "spsids"
    });
    this.phraseGroupTypesUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "phraseGroupTypes",
        initPrefix: "groupType"
    });

    this.eomUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "eom",
        initPrefix: "eom"
    });
    this.eoi1UidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "eoi1",
        initPrefix: "eoi1"
    });
    this.eoi2UidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "eoi2",
        initPrefix: "eoi2"
    });
    this.eobUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "eob",
        initPrefix: "eob"
    });

    this.emUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "em",
        initPrefix: "em"
    });
    this.ei1UidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "ei1",
        initPrefix: "ei1"
    });
    this.ei2UidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "ei2",
        initPrefix: "ei2"
    });
    this.ebUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "eb",
        initPrefix: "eb"
    });

    this.amUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "am",
        initPrefix: "am"
    });
    this.ai1UidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "ai1",
        initPrefix: "ai1"
    });
    this.ai2UidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "ai2",
        initPrefix: "ai2"
    });
    this.abUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "ab",
        initPrefix: "ab"
    });

    this.bdUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "bd",
        initPrefix: "bd"
    });
    this.sdUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "sd",
        initPrefix: "sd"
    });
    this.cdUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "cd",
        initPrefix: "cd"
    });
    this.rdUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "rd",
        initPrefix: "rd"
    });

}


PropertyInfoProvider.prototype.createDefaultBooleanPropertyInfo = function(propName, caption, defaultValue, shortDescription, longDescription) {
    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            dataType: GuiPropertyDataType.BOOLEAN,
            displayHint: BooleanPropertyDisplayHint.SELECT,
            shortDescription: shortDescription,
            longDescription: longDescription
        });
    return info;
};

PropertyInfoProvider.prototype.createDefaultFloatPropertyInfo = function(propName, caption, defaultValue, extraConstraints) {
    var constraints = [];
    if (extraConstraints) {
        addAll(constraints, extraConstraints);
    }
    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            constraints: constraints,
            dataType: GuiPropertyDataType.FLOAT,
            displayHint: NumberPropertyDisplayHint.TEXT
        });
    return info;
};

PropertyInfoProvider.prototype.createDefaultLikelihoodPropertyInfo = function(propName, caption, defaultValue) {
    return this.createDefaultFloatPropertyInfo(propName, caption, defaultValue, [new MinPropertyConstraint(0)]);
};

PropertyInfoProvider.prototype.createDefaultProbabilityPropertyInfo = function(propName, caption, defaultValue) {
    return this.createDefaultFloatPropertyInfo(propName, caption, defaultValue, [new RangePropertyConstraint([0, 1])]);
};

PropertyInfoProvider.prototype.createDefaultIntPropertyInfo = function(propName, caption, defaultValue, extraConstraints) {
    var constraints = [];
    if (extraConstraints) {
        addAll(constraints, extraConstraints);
    }
    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            constraints: constraints,
            dataType: GuiPropertyDataType.INT,
            displayHint: NumberPropertyDisplayHint.TEXT
        });
    return info;
};

PropertyInfoProvider.prototype.createDefaultIndexPropertyInfo = function(propName, caption, defaultValue) {
    return this.createDefaultIntPropertyInfo(propName, caption, defaultValue, [new MinPropertyConstraint(0)]);
};

PropertyInfoProvider.prototype.createDefaultStringPropertyInfo = function(propName, caption, defaultValue, shortDescription, longDescription) {
    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            dataType: GuiPropertyDataType.STRING,
            displayHint: StringPropertyDisplayHint.TEXT,
            shortDescription: shortDescription,
            longDescription: longDescription
        });
    return info;
};

PropertyInfoProvider.prototype.createDefaultStringSeedPropertyInfo = function(propName, caption, defaultValue, shortDescription, longDescription) {
    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            dataType: GuiPropertyDataType.STRING,
            displayHint: StringPropertyDisplayHint.TEXT,
            shortDescription: shortDescription,
            longDescription: longDescription
//            constraints: [
//                {
//                    isValid: function(object, propertyName, value) {
//                        return value == "" || !isNaN(parseInt(value));
//                    },
//                    getInvalidDescription: function(object, propertyName, value) {
//                        if (value != "" && isNaN(parseInt(value))) {
//                            return "Not a valid seed";
//                        }
//                        return "";
//                    }
//                }
//            ]

        });
    return info;
};




PropertyInfoProvider.prototype.createStringTextAreaPropertyInfo = function(propName, caption, defaultValue) {
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



PropertyInfoProvider.prototype.createDefaultMinIntPropertyInfo = function(propName, caption, defaultValue, minValue) {
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


PropertyInfoProvider.prototype.createDefaultMinMaxIntPropertyInfo = function(propName, caption, defaultValue,
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

PropertyInfoProvider.prototype.createDefaultMinFloatPropertyInfo = function(propName, caption, defaultValue, minValue) {
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


PropertyInfoProvider.prototype.createDefaultMinMaxFloatPropertyInfo = function(propName, caption, defaultValue,
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




PropertyInfoProvider.prototype.createDefaultRangePropertyInfo = function(propName, caption, defaultValue, dataType, extraConstraints) {
    var constraints = [
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
    ];

    if (extraConstraints) {
        addAll(constraints, extraConstraints);
    }

    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            dataType: dataType,
            constraints: constraints,
            displayHint: NumberPropertyDisplayHint.TEXT
        });
    return info;
};

PropertyInfoProvider.prototype.createDefaultIntRangePropertyInfo = function(propName, caption, defaultValue, extraConstraints) {
    return this.createDefaultRangePropertyInfo(propName, caption, defaultValue, GuiPropertyDataType.INT_LIST, extraConstraints);
};


PropertyInfoProvider.prototype.createDefaultFloatRangePropertyInfo = function(propName, caption, defaultValue, extraConstraints) {
    return this.createDefaultRangePropertyInfo(propName, caption, defaultValue, GuiPropertyDataType.FLOAT_LIST, extraConstraints);
};

PropertyInfoProvider.prototype.createDefaultRangeListPropertyInfo = function(propName, caption, defaultValue, dataType, extraConstraints) {
    var constraints = [];

    if (extraConstraints) {
        addAll(constraints, extraConstraints);
    }

    constraints.push({
        rangeLengthValid: function(range) {
            return range.length == 2;
        },
        lowerUpperValid: function(arr) {
            return arr[0] <= arr[1];
        },
        rangeValid: function(range) {
            return this.rangeLengthValid(range) && this.lowerUpperValid(range);
        },
        isValid: function(object, propertyName, value) {
            for (var i=0; i<value.length; i++) {
                var range = value[i];
                if (!this.rangeValid(range)) {
                    return false;
                }
            }
            return true;
        },
        getInvalidDescription: function(object, propertyName, value) {
            for (var i=0; i<value.length; i++) {
                var range = value[i];
                if (!this.rangeLengthValid(range)) {
                    return "Invalid range: " + range.join(",") + ". Specify a lower and an upper limit";
                }
                if (!this.lowerUpperValid(range)) {
                    return "Invalid range: " + range.join(",") + ". The first value must not be larger than the second";
                }
            }
            return "";
        }
    });

    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            dataType: dataType,
            constraints: constraints,
            displayHint: NumberPropertyDisplayHint.TEXT
        });
    return info;
};


PropertyInfoProvider.prototype.createDefaultIntListPropertyInfo = function(propName, caption, defaultValue, extraConstraints) {
    var constraints = [];
    if (extraConstraints) {
        addAll(constraints, extraConstraints);
    }
    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            constraints: constraints,
            dataType: GuiPropertyDataType.INT_LIST,
            displayHint: NumberPropertyDisplayHint.TEXT
        });
    return info;
};

PropertyInfoProvider.prototype.createDefaultIndexListPropertyInfo = function(propName, caption, defaultValue) {
    return this.createDefaultIntListPropertyInfo(propName, caption, defaultValue, [new ArrayElementConstraint(new MinPropertyConstraint(0))]);
};

PropertyInfoProvider.prototype.createDefaultIntList2DPropertyInfo = function(propName, caption, defaultValue) {
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

PropertyInfoProvider.prototype.createDefaultFloatList2DPropertyInfo = function(propName, caption, defaultValue) {
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

PropertyInfoProvider.prototype.createDefaultIntRangeListPropertyInfo = function(propName, caption, defaultValue) {
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


PropertyInfoProvider.prototype.createDefaultProbabilityListPropertyInfo = function(propName, caption, defaultValue) {
    return this.createDefaultFloatListPropertyInfo(propName, caption, defaultValue, [new ArrayElementConstraint(new RangePropertyConstraint([0, 1]))]);
};

PropertyInfoProvider.prototype.createDefaultLikelihoodListPropertyInfo = function(propName, caption, defaultValue) {
    return this.createDefaultFloatListPropertyInfo(propName, caption, defaultValue, [new ArrayElementConstraint(new MinPropertyConstraint(0))]);
};


PropertyInfoProvider.prototype.createDefaultFloatListPropertyInfo = function(propName, caption, defaultValue, extraConstraints) {
    var constraints = [];
    if (extraConstraints) {
        addAll(constraints, extraConstraints);
    }

    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            constraints: constraints,
            dataType: GuiPropertyDataType.FLOAT_LIST,
            displayHint: NumberPropertyDisplayHint.TEXT
        });
    return info;
};



PropertyInfoProvider.prototype.createStrengthPropertyInfo = function(propName, caption, defaultValue) {
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


PropertyInfoProvider.prototype.createEnumPropertyInfo = function(propName, caption, defaultValue, enumType) {
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


PropertyInfoProvider.prototype.createEnumListPropertyInfo = function(propName, caption, defaultValue, enumType) {
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


PropertyInfoProvider.prototype.createProcedureButtonPropertyInfo = function(caption, funcName, target, args) {

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

PropertyInfoProvider.prototype.createUniqueIdPropertyInfo = function(prefix, uniqueIdInfo) {
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

PropertyInfoProvider.prototype.createPreviewPropertyInfo = function(componentConstructor) {
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

PropertyInfoProvider.prototype.createIdReferencePropertyInfo = function(propertyName, caption, uniqueIdInfo) {
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


PropertyInfoProvider.prototype.createIdReferenceListPropertyInfo = function(propertyName, caption, uniqueIdInfo) {
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



PropertyInfoProvider.prototype.createIdReferenceNotSelfPropertyInfo = function(propertyName, caption, uniqueIdInfo) {
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

PropertyInfoProvider.prototype.createObjectPropertyInfo = function(propertyName, caption, uniqueIdInfo, constructorTexts) {
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

PropertyInfoProvider.prototype.createSongPartStructureInfoDataSampleListPropertyInfo = function(propertyName, caption, uidInfo) {
    var info = this.createObjectListPropertyInfo(propertyName, caption, uidInfo, [
        ["SongPartStructureInfoDataSample", "Song Part Structure Likelihood"]]);
    info.listInfo.itemsDisplayFunction = function(valueItem) {
        var structureStrArr = [];
        var arr = valueItem.data;
        for (var i=0; i<arr.length; i++) {
            structureStrArr.push(SongPartType.toString(arr[i].partType));
        }
        return "Structure (" + structureStrArr.join(", ") + ")" + ", Likelihood: " + valueItem.likelihood;
    };
    return info;
};

PropertyInfoProvider.prototype.createSongPartStructureInfoListPropertyInfo = function(propertyName, caption, uidInfo) {
    var info = this.createObjectListPropertyInfo(propertyName, caption, uidInfo, [
        ["SongPartStructureInfo", "Song Part Structure"]]);
    info.listInfo.itemsDisplayFunction = function(valueItem) {
        return SongPartType.toString(valueItem.partType);
    };
    return info;
};



PropertyInfoProvider.prototype.createPhraseGroupTypeDataSampleListPropertyInfo = function(propertyName, caption, uidInfo) {
    var info = this.createObjectListPropertyInfo(propertyName, caption, uidInfo, [
        ["PhraseGroupTypeDataSample", "Phrase group likelihood"]]);
    info.listInfo.itemsDisplayFunction = function(valueItem) {
        return SimpleModuleGeneratorPhraseGroupType.toString(valueItem.data) + ", Likelihood: " + valueItem.likelihood;
    };
    return info;
};

PropertyInfoProvider.prototype.createMidiProgramDataSampleListPropertyInfo = function(propertyName, caption, uidInfo) {
    var info = this.createObjectListPropertyInfo(propertyName, caption, uidInfo, [
        ["MidiProgramDataSample", "Instrument Likelihood"]]);
    info.listInfo.itemsDisplayFunction = function(valueItem) {
        return MidiProgram.toString(valueItem.data) + ", Likelihood: " + valueItem.likelihood;
    };
    return info;
};


PropertyInfoProvider.prototype.createMidiDrumDataSampleListPropertyInfo = function(propertyName, caption, uidInfo) {
    var info = this.createObjectListPropertyInfo(propertyName, caption, uidInfo, [
        ["MidiDrumDataSample", "Drum Likelihood"]]);
    info.listInfo.itemsDisplayFunction = function(valueItem) {
        return MidiDrum.toString(valueItem.data) + ", Likelihood: " + valueItem.likelihood;
    };
    return info;
};


PropertyInfoProvider.prototype.createIntDataSampleListPropertyInfo = function(propertyName, caption, uidInfo) {
    var info = this.createObjectListPropertyInfo(propertyName, caption, uidInfo, [
        ["IntDataSample", "Int Likelihood"]]);
    info.listInfo.itemsDisplayFunction = function(valueItem) {
        return "Value: " + valueItem.data + ", Likelihood: " + valueItem.likelihood;
    };
    return info;
};

PropertyInfoProvider.prototype.createIntListDataSampleListPropertyInfo = function(propertyName, caption, uidInfo) {
    var info = this.createObjectListPropertyInfo(propertyName, caption, uidInfo, [
        ["IntListDataSample", "Int List Likelihood"]]);
    info.listInfo.itemsDisplayFunction = function(valueItem) {
        return "Value: " + valueItem.data.join(", ") + ", Likelihood: " + valueItem.likelihood;
    };
    return info;
};


PropertyInfoProvider.prototype.createFloatDataSampleListPropertyInfo = function(propertyName, caption, uidInfo) {
    var info = this.createObjectListPropertyInfo(propertyName, caption, uidInfo, [
        ["FloatDataSample", "Float Likelihood"]]);
    info.listInfo.itemsDisplayFunction = function(valueItem) {
        return "Value: " + valueItem.data + ", Likelihood: " + valueItem.likelihood;
    };
    return info;
};

PropertyInfoProvider.prototype.createFloatListDataSampleListPropertyInfo = function(propertyName, caption, uidInfo) {
    var info = this.createObjectListPropertyInfo(propertyName, caption, uidInfo, [
        ["FloatListDataSample", "Float List Likelihood"]]);
    info.listInfo.itemsDisplayFunction = function(valueItem) {
        return "Value: " + valueItem.data.join(", ") + ", Likelihood: " + valueItem.likelihood;
    };
    return info;
};




PropertyInfoProvider.prototype.createObjectListPropertyInfo = function(propertyName, caption, uniqueIdInfo, constructorTexts) {
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





PropertyInfoProvider.prototype.createObjectListInTabPropertyInfo = function(propertyName, caption, uniqueIdInfo, constructorTexts, group, groupCaption) {

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

PropertyInfoProvider.prototype.getUniqueNamespace = function(nsPrefix) {
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

PropertyInfoProvider.prototype.getOrCreateUniqueIdInfo = function(obj, nsPrefix, initPrefix) {
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


PropertyInfoProvider.prototype.getMixableExportPropertyInfos = function(result) {
    var constraints = [
        new ArrayElementConstraint(new RangePropertyConstraint([0, 1]))
    ];

    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("melodyVolumeMultipliers", "Melody Volume Multipliers", [1], constraints));
    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("inner1VolumeMultipliers", "Inner 1 Volume Multipliers", [1], constraints));
    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("inner2VolumeMultipliers", "Inner 2 Volume Multipliers", [1], constraints));
    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("bassVolumeMultipliers", "Bass Volume Multipliers", [1], constraints));
    result.addPropertyInfo(this.createDefaultMinMaxFloatPropertyInfo("percussionVolumeMultiplier", "Percussion Volume Multiplier", 1, 0, 1));

    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("melodyReverbSends", "Melody Reverb Sends", [1], constraints));
    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("melodyChorusSends", "Melody Chorus Sends", [40 / 127.0], constraints));
    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("bassReverbSends", "Bass Reverb Sends", [10 / 127.0], constraints));
    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("bassChorusSends", "Bass Chorus Sends", [10 / 127.0], constraints));
    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("inner1ReverbSends", "Inner 1 Reverb Sends", [10 / 127.0], constraints));
    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("inner1ChorusSends", "Inner 1 Chorus Sends", [10 / 127.0], constraints));
    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("inner2ReverbSends", "Inner 2 Reverb Sends", [10 / 127.0], constraints));
    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("inner2ChorusSends", "Inner 2 Chorus Sends", [10 / 127.0], constraints));
    result.addPropertyInfo(this.createDefaultMinMaxFloatPropertyInfo("percussionReverbSend", "Percussion Reverb Send", 0, 0, 1));
    result.addPropertyInfo(this.createDefaultMinMaxFloatPropertyInfo("percussionChorusSend", "Percussion Chorus Send", 0, 0, 1));
};

PropertyInfoProvider.prototype.getMidiExportPropertyInfos = function(result) {

    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("exportVolume", "Export Volume", true));
    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("exportEffects", "Export Effects", true));
    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("mergeChannels", "Merge Channels", false));
    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("exportChordsToNewChannel", "Export Chords to New Channel", false));

    this.getMixableExportPropertyInfos(result);
};


PropertyInfoProvider.prototype.getWavExportPropertyInfos = function(result) {
    result.addPropertyInfo(this.createEnumPropertyInfo("soundFontType", "Sound Font", SoundFontType.STANDARD_LIGHT, SoundFontType));
    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("normalizeRenderedResult", "Normalize", false));
    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("compressRenderedResult", "Compress", false));
    this.getMidiExportPropertyInfos(result);
};

PropertyInfoProvider.prototype.getWavClientExportPropertyInfos = function(result) {
    this.getMidiExportPropertyInfos(result);
};

PropertyInfoProvider.prototype.getDataSamplePropertyInfos = function(result) {
    result.addPropertyInfo(this.createDefaultMinFloatPropertyInfo("likelihood", "Likelihood", 1, 0));
    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("active", "Active", true));
};

PropertyInfoProvider.prototype.getPlannedHarmonyElementPropertyInfos = function(result) {
    result.addPropertyInfo(this.createDefaultIntPropertyInfo("scaleBaseNote", "Scale base note", 60));
    result.addPropertyInfo(this.createEnumPropertyInfo("scaleType", "Scale type", ScaleType.MAJOR, ScaleType));
    result.addPropertyInfo(this.createDefaultIntPropertyInfo("seed", "Seed", 12345));

    this.getSequenceHarmonyElementPropertyInfos(result);
};

PropertyInfoProvider.prototype.getSequenceHarmonyElementPropertyInfos = function(result) {

    result.addPropertyInfo(this.createEnumPropertyInfo("harmonyLengthMode", "Length Mode", HarmonyLengthMode.RYTHM_ONLY, HarmonyLengthMode));

    result.addPropertyInfo(this.createDefaultMinMaxIntPropertyInfo("count", "Count", 4, 1, 32));
    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("lengthPattern", "Length pattern", [1.0],
        [new ArrayMinLengthConstraint(1), new ArrayElementConstraint(new MinPropertyConstraint(0.01))]));

//            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("startLengthPattern", "Length pattern", [1.0],
//                [new ArrayElementConstraint(new MinPropertyConstraint(0.01))]));
//            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("endLengthPattern", "End length pattern", [],
//                [new ArrayElementConstraint(new MinPropertyConstraint(0.01))]));
    result.addPropertyInfo(this.createEnumPropertyInfo("lengthPatternUnit", "Length pattern unit", PositionUnit.MEASURES, PositionUnit));

    result.addPropertyInfo(this.createDefaultMinMaxFloatPropertyInfo("totalLength", "Total length ()", 1.0, 0.001, 128));
    result.addPropertyInfo(this.createEnumPropertyInfo("totalLengthUnit", "Total length unit", PositionUnit.MEASURES, PositionUnit));
    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("setTotalLengthExternally", "Set total length externally", false));


    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("beatStrengths", "Beat strengths", [1, 0.8, 0.9, 0.6, 0.3, 0.4, 0.2],
        [new ArrayMinLengthConstraint(1)]));

    result.addPropertyInfo(this.createDefaultIntListPropertyInfo("tsNumerators", "Beats per measures", [4],
        [new ArrayMinLengthConstraint(1)]));
    result.addPropertyInfo(this.createDefaultIntPropertyInfo("rythmTsNumerator", "Rythm beats per measure", 4));

    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("setTsNumeratorExternally", "Set beats per measure externally", false));

};


PropertyInfoProvider.prototype.getGuiPropertyInfos = function(obj, parentPropertyInfo) {
    var result = new GuiPropertyInfos();


    switch (obj._constructorName) {
        case "UserInfo":
            result.addPropertyInfo(this.createDefaultStringPropertyInfo("name", "Name", "", "Your name"));
            result.addPropertyInfo(this.createDefaultStringPropertyInfo("email", "Email", "", "Your email address"));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("subscribe", "Subscribe to news", "", "Whether to subscribe to the newsletter or not"));
            break;
        case "VoiceChordNotesVoiceLinePlannerConstraint":
            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("chordRootPitchClassConstraints", "Voice chord roots", []));
            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("chordRootPitchClassConstraintCosts", "Voice chord root costs", []));
            break;
        case "PhraseHarmonyElement":
            result.addPropertyInfo(this.createEnumPropertyInfo("phraseType", "Phrase type", PhraseHarmonyElementType.COMPLETE, PhraseHarmonyElementType));
            result.addPropertyInfo(this.createEnumPropertyInfo("majorModulationTarget", "Major modulation target", DynamicHarmonyModulationTarget.DOMINANT, DynamicHarmonyModulationTarget));
            result.addPropertyInfo(this.createEnumPropertyInfo("minorModulationTarget", "Minor modulation target", DynamicHarmonyModulationTarget.MEDIANT, DynamicHarmonyModulationTarget));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("majorDeceptiveRoot", "Major deceptive root", 5));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("minorDeceptiveRoot", "Minor deceptive root", 5));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("raiseLeadingTone", "Raise leading tone", true));

            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("staticHarmonyLength", "Static harmony length", 25));
            result.addPropertyInfo(this.createEnumPropertyInfo("staticHarmonyLengthUnit", "Static harmony length unit", LengthAndCountUnit.LENGTH_PERCENT, LengthAndCountUnit));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("staticHarmonySus2ChordLikelihood", "Static harmony sus2 likelihood", 1));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("staticHarmonySus4ChordLikelihood", "Static harmony sus4 likelihood", 1));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("staticHarmonySimpleMixtureLikelihood", "Static harmony mixture likelihood", 1));

            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("dynamicHarmonyLength", "Dynamic harmony length", 25));
            result.addPropertyInfo(this.createEnumPropertyInfo("dynamicHarmonyLengthUnit", "Dynamic harmony length unit", LengthAndCountUnit.LENGTH_PERCENT, LengthAndCountUnit));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("dynamicHarmonySus2ChordLikelihood", "Dynamic harmony sus2 likelihood", 1));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("dynamicHarmonySus4ChordLikelihood", "Dynamic harmony sus4 likelihood", 1));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("dynamicHarmonySimpleMixtureLikelihood", "Dynamic harmony mixture likelihood", 1));

            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("dominantCadenceHarmonyLength", "Dominant cadence harmony length", 25));
            result.addPropertyInfo(this.createEnumPropertyInfo("dominantCadenceHarmonyLengthUnit", "Dominant cadence harmony length unit", LengthAndCountUnit.LENGTH_PERCENT, LengthAndCountUnit));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("dominantCadenceHarmonySus2ChordLikelihood", "Dominant cadence harmony sus2 likelihood", 1));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("dominantCadenceHarmonySus4ChordLikelihood", "Dominant cadence harmony sus4 likelihood", 1));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("dominantCadenceHarmonySimpleMixtureLikelihood", "Dominant cadence harmony mixture likelihood", 1));

            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("tonicCadenceHarmonyLength", "Tonic cadence harmony length", 25));
            result.addPropertyInfo(this.createEnumPropertyInfo("tonicCadenceHarmonyLengthUnit", "Tonic cadence harmony length unit", LengthAndCountUnit.LENGTH_PERCENT, LengthAndCountUnit));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("tonicCadenceHarmonySus2ChordLikelihood", "Tonic cadence harmony sus2 likelihood", 1));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("tonicCadenceHarmonySus4ChordLikelihood", "Tonic cadence harmony sus4 likelihood", 1));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("tonicCadenceHarmonySimpleMixtureLikelihood", "Tonic cadence harmony mixture likelihood", 1));

            this.getPlannedHarmonyElementPropertyInfos(result);
            break;
        case "SimpleSequenceHarmonyElement":
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("scaleBaseNotes", "Scale base notes", [60]));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("scaleBaseNoteIndices", "Scale base note indices", [0]));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("startScaleBaseNoteIndices", "Start scale base note indices", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("endScaleBaseNoteIndices", "End scale base note indices", []));
            result.addPropertyInfo(this.createEnumListPropertyInfo("scaleTypes", "Scale types", ScaleType.MAJOR, ScaleType));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("scaleTypeIndices", "Scale type indices", [0]));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("startScaleTypeIndices", "Start scale type indices", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("endScaleTypeIndices", "End scale type indices", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("scaleModes", "Scale modes", [0]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("startScaleModes", "Start scale modes", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("endScaleModes", "End scale modes", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("chordRoots", "Chord roots", [0]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("startChordRoots", "Start chord roots", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("endChordRoots", "End chord roots", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("chordInversions", "Chord inversions", [0], [
                new ArrayElementConstraint(
                    new RangePropertyConstraint([0, 3]))
            ]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("startChordInversions", "Start chord inversions", [], [
                new ArrayElementConstraint(
                    new RangePropertyConstraint([0, 3]))
            ]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("endChordInversions", "End chord inversions", [], [
                new ArrayElementConstraint(
                    new RangePropertyConstraint([0, 3]))
            ]));
            result.addPropertyInfo(this.createEnumListPropertyInfo("chordTypes", "Chord types", ChordType.TRIAD, ChordType));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("chordTypeIndices", "Chord type indices", [0]));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("startChordTypeIndices", "Start chord type indices", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("endChordTypeIndices", "End chord type indices", []));

            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("customScales", "Custom scales", [[0, 2, 3, 5, 7, 9, 11]]));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("customScaleIndices", "Custom scale indices", [0]));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("startCustomScaleIndices", "Start custom scale indices", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("endCustomScaleIndices", "End custom scale indices", []));

            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("customChords", "Custom chords", [[0, 2, 4]]));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("customChordIndices", "Custom chord indices", [0]));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("startCustomChordIndices", "Start custom chord indices", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("endCustomChordIndices", "End custom chord indices", []));

            this.getSequenceHarmonyElementPropertyInfos(result);

            var info = this.createObjectListPropertyInfo("voiceLineConstraints", "Voice line constraints", this.phraseGroupTypesUidInfo,
                [
                    ["VoiceChordNotesVoiceLinePlannerConstraint", "Voice chord notes constraint"]
                ]);
            info.listInfo.itemsDisplayFunction = function(valueItem) {
                var result = "Voice line constraint (" + valueItem._constructorName + ")";
                return result;
            };
            result.addPropertyInfo(info);

            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("voiceLineConstraintIndices", "Voice line constraint indices", []));
            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("startVoiceLineConstraintIndices", "Start voice line constraint indices", []));
            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("endVoiceLineConstraintIndices", "End voice line constraint indices", []));

            break;
        case "SongPartStructureInfo":
            result.addPropertyInfo(this.createEnumPropertyInfo("partType", "Part Type", SongPartType.VERSE_1, SongPartType));
            result.addPropertyInfo(this.createEnumPropertyInfo("strength", "Strength", SongPartStrength.DEFAULT, SongPartStrength));

            result.addPropertyInfo(this.createDefaultProbabilityListPropertyInfo("prefixProbsOverride", "Prefix Group Probabilities (Override)", []));
            result.addPropertyInfo(this.createDefaultProbabilityListPropertyInfo("postfixProbsOverride", "Postfix Group Probabilities (Override)", []));

            result.addPropertyInfo(this.createEnumPropertyInfo("majorGroupModulationTarget", "Major Group Modulation Target", DynamicHarmonyModulationTarget.NONE, DynamicHarmonyModulationTarget));
            result.addPropertyInfo(this.createEnumPropertyInfo("minorGroupModulationTarget", "Minor Group Modulation Target", DynamicHarmonyModulationTarget.NONE, DynamicHarmonyModulationTarget));

            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("melodyRenderAmountOverride", "Melody render amount overrides", []));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("inner1RenderAmountOverride", "Inner 1 render amount overrides", []));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("inner2RenderAmountOverride", "Inner 2 render amount overrides", []));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("bassRenderAmountOverride", "Bass render amount overrides", []));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("percussionRenderAmountOverride", "Percussion render amount overrides", []));

            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("harmonyRythmCountOverrides", "Harmony rythm count overrides", [], [new ArrayElementConstraint(new RangePropertyConstraint([1, 32]))]));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("harmonyTotalLengthOverrides", "Harmony total length overrides", [], [new ArrayElementConstraint(new RangePropertyConstraint([0.125, 32]))]));

            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overrideScaleBaseNote", "Override scale base note", false));
            result.addPropertyInfo(this.createDefaultMinMaxIntPropertyInfo("scaleBaseNote", "Scale base note", 60, 0, 127));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overrideScaleType", "Override scale type", false));
            result.addPropertyInfo(this.createEnumPropertyInfo("scaleType", "Scale type", SimpleScaleType.MAJOR, SimpleScaleType));

            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overridePhraseGroupType", "Override phrase group type", false));
            result.addPropertyInfo(this.createEnumPropertyInfo("phraseGroupType", "Phrase group type", SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT_SHORTEN, SimpleModuleGeneratorPhraseGroupType));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overrideMajorModulationTarget", "Override major modulation/tonicization target", false));
            result.addPropertyInfo(this.createEnumPropertyInfo("majorModulationTarget", "Major modulation/tonicization target", DynamicHarmonyModulationTarget.DOMINANT, DynamicHarmonyModulationTarget));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overrideMinorModulationTarget", "Override minor modulation/tonicization target", false));
            result.addPropertyInfo(this.createEnumPropertyInfo("minorModulationTarget", "Minor modulation/tonicization target", DynamicHarmonyModulationTarget.DOMINANT, DynamicHarmonyModulationTarget));

            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("harmonyElementIndices", "Custom harmony indices", [0]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("customMelodyCurveIndices", "Custom melody indices", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("customBassCurveIndices", "Custom bass indices", []));

            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("extraMelodyRenderElementIndices", "Extra melody render elements", []));

//            this.sameGroupIndexSames = getValueOrDefault(options, "sameGroupIndexSames", []);
//            this.groupModulationTarget = getValueOrDefault(options, "groupModulationTarget", -1);

            break;
        case "ModulationTargetDataSample":
            result.addPropertyInfo(this.createEnumPropertyInfo("data", "Data", DynamicHarmonyModulationTarget.MEDIANT, DynamicHarmonyModulationTarget));
            this.getDataSamplePropertyInfos(result);
            break;
        case "PhraseGroupTypeDataSample":
            result.addPropertyInfo(this.createEnumPropertyInfo("data", "Data", SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT, SimpleModuleGeneratorPhraseGroupType));
            this.getDataSamplePropertyInfos(result);
            break;
        case "SongPartStructureInfoDataSample":
            result.addPropertyInfo(this.createSongPartStructureInfoListPropertyInfo("data", "Data", this.spsiUidInfo));
            this.getDataSamplePropertyInfos(result);
            break;
        case "MidiProgramDataSample":
            result.addPropertyInfo(this.createEnumPropertyInfo("data", "Data", MidiProgram.ACOUSTIC_GRAND_PIANO, MidiProgram));
            this.getDataSamplePropertyInfos(result);
            break;
        case "MidiDrumDataSample":
            result.addPropertyInfo(this.createEnumPropertyInfo("data", "Data", MidiDrum.BASS_DRUM_1, MidiDrum));
            this.getDataSamplePropertyInfos(result);
            break;
        case "IntDataSample":
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("data", "Data", 0));
            this.getDataSamplePropertyInfos(result);
            break;
        case "IntListDataSample":
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("data", "Data", []));
            this.getDataSamplePropertyInfos(result);
            break;
        case "FloatDataSample":
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("data", "Data", 0));
            this.getDataSamplePropertyInfos(result);
            break;
        case "FloatListDataSample":
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("data", "Data", []));
            this.getDataSamplePropertyInfos(result);
            break;
        case "PrimitiveWebAudioPlayerInstrument":
            result.addPropertyInfo(this.createEnumPropertyInfo("type", "Type", PrimitiveWebAudioPlayerInstrumentType.SAW, PrimitiveWebAudioPlayerInstrumentType));
            break;
        case "WebAudioPlayerSettings":
            var info = this.createObjectListPropertyInfo("melodyInstruments", "Melody instruments", this.phraseGroupTypesUidInfo,
                [
                    ["PrimitiveWebAudioPlayerInstrument", "Primitive"]
                ]);
            info.listInfo.itemsDisplayFunction = function(valueItem) {
                return "Instrument (" + valueItem._constructorName + ")";
            };
            result.addPropertyInfo(info);

            var info = this.createObjectListPropertyInfo("inner1Instruments", "Inner 1 instruments", this.phraseGroupTypesUidInfo,
                [
                    ["PrimitiveWebAudioPlayerInstrument", "Primitive"]
                ]);
            info.listInfo.itemsDisplayFunction = function(valueItem) {
                return "Instrument (" + valueItem._constructorName + ")";
            };
            result.addPropertyInfo(info);

            var info = this.createObjectListPropertyInfo("inner2Instruments", "Inner 2 instruments", this.phraseGroupTypesUidInfo,
                [
                    ["PrimitiveWebAudioPlayerInstrument", "Primitive"]
                ]);
            info.listInfo.itemsDisplayFunction = function(valueItem) {
                return "Instrument (" + valueItem._constructorName + ")";
            };
            result.addPropertyInfo(info);

            var info = this.createObjectListPropertyInfo("bassInstruments", "Bass instruments", this.phraseGroupTypesUidInfo,
                [
                    ["PrimitiveWebAudioPlayerInstrument", "Primitive"]
                ]);
            info.listInfo.itemsDisplayFunction = function(valueItem) {
                return "Instrument (" + valueItem._constructorName + ")";
            };
            result.addPropertyInfo(info);

            this.getMixableExportPropertyInfos(result);
            break;
        case "SoundManager2PlayerSettings":
        case "PlayerSettings":
            this.getMidiExportPropertyInfos(result);
            break;
        case "MidiExportSettings":
            result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Export Midi", "export2", {export2: function() {exportMidi()}}));
            this.getMidiExportPropertyInfos(result);
            break;
        case "WavExportSettings":
            result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Export Wav", "export2", {export2: function() {exportWav()}}));
            this.getWavExportPropertyInfos(result);
            break;
        case "WavClientExportSettings":
            result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Export Wav", "export2", {export2: function() {exportWav()}}));
            this.getWavClientExportPropertyInfos(result);
            break;
        case "Mp3ExportSettings":
            result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Export Mp3", "export2", {export2: function() {exportMp3()}}));
//            result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Save As Preset", "saveAsPreset", {saveAsPreset: function() {savePreset()}}));
            this.getWavExportPropertyInfos(result);
            break;
        case "OggExportSettings":
            result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Export Ogg", "export2", {export2: function() {exportOgg()}}));
            this.getWavExportPropertyInfos(result);
            break;
        case "ItExportSettings":
            result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Export IT", "export2", {export2: function() {exportIT()}}));
            break;
        case "ThemeSettings":
            result.addPropertyInfo(this.createEnumPropertyInfo("theme", "Theme (refresh page to see change)", JQueryUITheme.BLITZER, JQueryUITheme));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("transparentDialogs", "Use transparent dialogs", false));
//            result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Update theme", "update", {update: function() {updateTheme()}}));
            break;
        case "Visualizer3DSettings":
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("on", "On", true));
            result.addPropertyInfo(this.createDefaultMinMaxIntPropertyInfo("webGLFps", "FPS (WebGL)", 20, 1, 60));
            result.addPropertyInfo(this.createDefaultMinMaxIntPropertyInfo("context2DFps", "FPS (2D Context)", 5, 1, 60));
            result.addPropertyInfo(this.createEnumPropertyInfo("stopMovementMode", "Stop Movement Mode", Visualizer3DStopMovementMode.PAN, Visualizer3DStopMovementMode));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("forceContext2D", "Force 2D Context", false));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("usePerspective", "Perspective mode", true));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("addBloom", "Add Bloom", true));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("addSimulatedAA", "Add Simulated Antialising", true));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("addVignette", "Add Vignette", true));
            break;
        case "SongSettings":
            result.addPropertyInfo(this.createDefaultStringPropertyInfo("name", "Name", "", "The name of your song. This is the name that shows up in the 'My Songs' tab"));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("seed", "Seed", "", "The main seed. Determines all the sub seeds for structure, content and indices."));
            break;
        case "SongContentSeedSettings":
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("instrumentTypeSeed", "Instrument Type Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("melodyInstrumentSeed", "Melody Instrument Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("inner1InstrumentSeed", "Inner 1 Instrument Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("inner2InstrumentSeed", "Inner 2 Instrument Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("bassInstrumentSeed", "Bass Instrument Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("melodyMotifSeed", "Melody Motif Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("melodyMotifRythmSeed", "Melody Rythm Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("melodyMotifEmbellishConnectSeed", "Melody Connect Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("bassMotifSeed", "Bass Motif Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("bassMotifRythmSeed", "Bass Rythm Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("bassMotifEmbellishConnectSeed", "Bass Connect Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("harmonyMotifSeed", "Harmony Motif Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("harmonyMotifRythmSeed", "Harmony Motif Rythm Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("harmonyMotifEmbellishConnectSeed", "Harmony Motif Connect Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("percussionMotifSeed", "Percussion Motif Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("percussionFillMotifSeed", "Percussion Fill Motif Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("percussionInstrumentSeed", "Percussion Instrument Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("percussionFillInstrumentSeed", "Percussion Fill Instrument Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("percussionMotifRythmSeed", "Percussion Rythm Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("percussionFillMotifRythmSeed", "Percussion Fill Rythm Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("melodyShapeSeed", "Melody Shape Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("bassShapeSeed", "Bass Shape Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("harmonyRythmSeed", "Harmony Rythm Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("melodyMotifDistributionSeed", "Melody Distribution Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("inner1MotifDistributionSeed", "Inner 1 Distribution Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("inner2MotifDistributionSeed", "Inner 2 Distribution Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("bassMotifDistributionSeed", "Bass Distribution Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("percussionMotifDistributionSeed", "Percussion Distribution Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("percussionFillMotifDistributionSeed", "Percussion Fill Distribution Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("melodyHarmonyPunctationSeed", "Melody Harmony Punctation Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("innerHarmonyPunctationSeed", "Inner Harmony Punctation Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("harmonySeed", "Harmony Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("channelDistributionSeed", "Channel Distribution Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("tempoChangeSeed", "Tempo Change Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("effectChangeSeed", "Effect Change Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("suspendSeed", "Suspend Seed", ""));
            break;
        case "SongStructureSeedSettings":
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("scaleSeed", "Scale Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("tsSeed", "Time Signature Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("introSeed", "Intro Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("endSeed", "End Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("renderAmountSeed", "Render Amount Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("modulationSeed", "Modulation Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("tonicizationSeed", "Tonicization Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("songStructureSeed", "Song Structure Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("tempoSeed", "Tempo Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("glueSeed", "Glue Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("phraseGroupSeed", "Phrase Group Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("phraseGroupSimilaritySeed", "Phrase Group Similarity Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("groupSimilaritySeed", "Group Similarity Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("groupDifferenceSeed", "Group Difference Seed", ""));
            break;
        case "SongIndicesSeedSettings":
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("melodyShapeIndicesSeed", "Melody Shape Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("bassShapeIndicesSeed", "Bass Shape Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("harmonyIndicesSeed", "Harmony Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("harmonyRythmIndicesSeed", "Harmony Rythm Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("suspendIndicesSeed", "Suspend Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("melodyChannelDistributionIndicesSeed", "Melody Channel Distribution Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("inner1ChannelDistributionIndicesSeed", "Inner 1 Channel Distribution Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("inner2ChannelDistributionIndicesSeed", "Inner 2 Channel Distribution Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("bassChannelDistributionIndicesSeed", "Bass Channel Distribution Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("melodyMotifDistributionIndicesSeed", "Melody Motif Distribution Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("inner1MotifDistributionIndicesSeed", "Inner 1 Motif Distribution Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("inner2MotifDistributionIndicesSeed", "Inner 2 Motif Distribution Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("bassMotifDistributionIndicesSeed", "Bass Motif Distribution Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("percussionMotifDistributionIndicesSeed", "Percussion Motif Distribution Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("percussionFillMotifDistributionIndicesSeed", "Percussion Fill Distribution Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("harmonyExtraIndicesSeed", "Harmony Characteristics Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("renderAmountIndicesSeed", "Render Amount Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("tempoIndicesSeed", "Tempo Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("sequentialTempoChangeIndicesSeed", "Tempo Change 1 Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("parallelTempoChangeIndicesSeed", "Tempo Change 2 Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("sequentialMelodyEffectChangeIndicesSeed", "Melody Effect Change Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("sequentialInner1EffectChangeIndicesSeed", "Inner 1 Effect Change Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("sequentialInner2EffectChangeIndicesSeed", "Inner 2 Effect Change Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("sequentialBassEffectChangeIndicesSeed", "Bass Effect Change Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("sequentialPercussionEffectChangeIndicesSeed", "Percussion Effect Change Indices Seed", ""));
            break;
        case "SongParameters":
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("minorScaleLikelihood", "Minor Scale Likelihood", 1.0));
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("majorScaleLikelihood", "Major Scale Likelihood", 1.0));

            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("timeSignature2Likelihood", "2/4 Time Signature Likelihood", 1.0));
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("timeSignature3Likelihood", "3/4 Time Signature Likelihood", 1.0));
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("timeSignature4Likelihood", "4/4 Time Signature Likelihood", 3.0));

            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("electronicLikelihood", "Electronic Instruments Likelihood", 1.0));
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("electricLikelihood", "Electric Instruments Likelihood", 1.0));
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("acousticLikelihood", "Acoustic Instruments Likelihood", 1.0));

            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("strictBuildSongStructureLikelihoodMultiplier", "Strict Build Likelihood Multiplier", 1.0));
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("buildSongStructureLikelihoodMultiplier", "Build Likelihood Multiplier", 1.0));
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("verseChorusSongStructureLikelihoodMultiplier", "Verse Chorus Likelihood Multiplier", 1.0));
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("verseChorusBridgeSongStructureLikelihoodMultiplier", "Verse Chorus Bridge Likelihood Multiplier", 1.0));
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("noMelodyPartSongStructureLikelihoodMultiplier", "No Melody Part Likelihood Multiplier", 1.0));

            result.addPropertyInfo(this.createDefaultProbabilityListPropertyInfo("percussionFillProbabilities", "Percussion fill probabilities", [0.35]));

            result.addPropertyInfo(this.createDefaultProbabilityListPropertyInfo("raiseLeadingInMinorProbabilities", "Raise Leading Probabilities", [0.5]));

            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("tonicizeLikelihoodMultipliers", "Tonicize Likelihood Multipliers", [1.0]));
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("modulateLikelihoodMultiplier", "Modulate Likelihood Multiplier", 0.25));

            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("simpleMixtureLikelihoods", "Simple Mixture Likelihoods", [1.0]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("sus2ChordsLikelihoods", "Sus2 Chords Likelihoods", [1.0]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("sus4ChordsLikelihoods", "Sus4 Chords Likelihoods", [1.0]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("neighbourChordsLikelihoods", "Neighbour Chords Likelihoods", [1.0]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("passingChordsLikelihoods", "Passing Chords Likelihoods", [1.0]));

            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("melodyMotifRythmCountIncreasePerIndex", "Melody motif rythm count inc per index", 0.4));
            result.addPropertyInfo(this.createDefaultFloatRangePropertyInfo("melodyMotifRythmCountIncreaseOffsetRange", "Melody motif rythm count offet range", [0.5, 1.0]));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("bassMotifRythmCountIncreasePerIndex", "Bass motif rythm count inc per index", 0.4));
            result.addPropertyInfo(this.createDefaultFloatRangePropertyInfo("bassMotifRythmCountIncreaseOffsetRange", "Bass motif rythm count offset range", [0.25, 0.75]));

            result.addPropertyInfo(this.createDefaultProbabilityListPropertyInfo("melodyMotifZone1Probabilities", "Melody motif zone 1 probabilities", [0.5]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("melodyMotifZone1TripletLikelihoods", "Melody motif zone 1 triplet likelihoods", [0.5]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("melodyMotifZone1DotFirstLikelihoods", "Melody motif zone 1 dot first likelihoods", [2]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("melodyMotifZone1DotSecondLikelihoods", "Melody motif zone 1 dot second likelihoods", [0.5]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("melodyMotifZone1DotNormalDotLikelihoods", "Melody motif zone 1 dot normal dot likelihoods", [0.5]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("melodyMotifZone1NormalDotDotLikelihoods", "Melody motif zone 1 normal dot dot likelihoods", [0.5]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("melodyMotifZone1DotDotNormalLikelihoods", "Melody motif zone 1 dot dot normal likelihoods", [0.5]));
            result.addPropertyInfo(this.createDefaultRangeListPropertyInfo("melodyMotifZone1StartPosRanges", "Melody motif zone 1 start pos ranges", [[0, 0]], GuiPropertyDataType.FLOAT_LIST_2D));
            result.addPropertyInfo(this.createDefaultRangeListPropertyInfo("melodyMotifZone1EndPosRanges", "Melody motif zone 1 end pos ranges", [[0.75, 0.75]], GuiPropertyDataType.FLOAT_LIST_2D));
            result.addPropertyInfo(this.createDefaultRangeListPropertyInfo("melodyMotifZone1StartEnds", "Melody motif zone 1 start ends", [], GuiPropertyDataType.FLOAT_LIST_2D));

            result.addPropertyInfo(this.createDefaultProbabilityListPropertyInfo("bassMotifZone1Probabilities", "Bass motif zone 1 probabilities", [0.5]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("bassMotifZone1TripletLikelihoods", "Bass motif zone 1 triplet likelihoods", [0.01]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("bassMotifZone1DotFirstLikelihoods", "Bass motif zone 1 dot first likelihoods", [2]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("bassMotifZone1DotSecondLikelihoods", "Bass motif zone 1 dot second likelihoods", [0.5]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("bassMotifZone1DotNormalDotLikelihoods", "Bass motif zone 1 dot normal dot likelihoods", [0.5]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("bassMotifZone1NormalDotDotLikelihoods", "Bass motif zone 1 normal dot dot likelihoods", [0.5]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("bassMotifZone1DotDotNormalLikelihoods", "Bass motif zone 1 dot dot normal likelihoods", [0.5]));
            result.addPropertyInfo(this.createDefaultRangeListPropertyInfo("bassMotifZone1StartPosRanges", "Bass motif zone 1 start pos ranges", [[0, 0]], GuiPropertyDataType.FLOAT_LIST_2D));
            result.addPropertyInfo(this.createDefaultRangeListPropertyInfo("bassMotifZone1EndPosRanges", "Bass motif zone 1 end pos ranges", [[0.75, 0.75]], GuiPropertyDataType.FLOAT_LIST_2D));
            result.addPropertyInfo(this.createDefaultRangeListPropertyInfo("bassMotifZone1StartEnds", "Bass motif zone 1 start ends", [], GuiPropertyDataType.FLOAT_LIST_2D));


            result.addPropertyInfo(this.createDefaultProbabilityPropertyInfo("allInstrumentsDifferentProbability", "All Instrument Different Probability", 0.35));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("adaptHarmonyRythmToTempo", "Adapt Harmony Rythm to Tempo", true));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("adaptHarmonyRythmToTimeSignature", "Adapt Harmony Rythm to Time Signature", true));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("adaptSuspensionToTempo", "Adapt Suspension to Tempo", true));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("adaptMotifRythmsToTempo", "Adapt Motif Rythms to Tempo", true));

            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("filterFEffectsProbMultiplier", "Filter F Probability Multiplier", 1.0));
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("filterBWEffectsProbMultiplier", "Filter BW Probability Multiplier", 1.0));
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("panEffectsProbMultiplier", "Pan Effect Probability Multiplier", 1.0));

            result.addPropertyInfo(this.createDefaultProbabilityPropertyInfo("oddHarmonyRythmProbability", "Odd Harmony Rythm Probability", 0.01));

            result.addPropertyInfo(this.createDefaultProbabilityListPropertyInfo("melodyShareProbabilities", "Melody Share Probabilities", [0.3]));
            result.addPropertyInfo(this.createDefaultProbabilityPropertyInfo("endSongTempoChangeProbability", "End Song Tempo Change Probability", 0.5));
            result.addPropertyInfo(this.createDefaultProbabilityListPropertyInfo("endPhraseGroupTempoChangeProbabilities", "End Phrase Group Tempo Change Probabilities", [0.0]));

            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("adaptTempoToRenderAmount", "Adapt Tempo to Render Amount", true));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("tempoAdaptBias", "Tempo Adapt Bias", 3));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("tempoAdaptRandomMultiplier", "Tempo Adapt Random Multiplier", 3));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("useNaturalTempoChanges", "Use Natural Tempo Changes", true));

            result.addPropertyInfo(this.createDefaultProbabilityListPropertyInfo("voiceLineSuspensionProbabilities", "Voice Line Suspension Probabilities", [0.5]));
            result.addPropertyInfo(this.createDefaultProbabilityPropertyInfo("songIntroProbability", "Song Intro Probability", 0.7));
            result.addPropertyInfo(this.createDefaultProbabilityPropertyInfo("songEndProbability", "Song End Probability", 0.5));

            result.addPropertyInfo(this.createDefaultMinMaxFloatPropertyInfo("withinPhraseGroupSimilarRandomFraction", "Within Phrase Group Similar Fraction", 0.35, 0, 1));
            result.addPropertyInfo(this.createDefaultMinMaxFloatPropertyInfo("withinPhraseGroupSimilarBias", "Within Phrase Group Similar Bias", 0.55, 0, 1));

            result.addPropertyInfo(this.createDefaultMinMaxFloatPropertyInfo("samePhraseGroupIndexSimilarRandomFraction", "Same Phrase Group Index Similar Fraction", 0.25, 0, 1));
            result.addPropertyInfo(this.createDefaultMinMaxFloatPropertyInfo("samePhraseGroupIndexSimilarBias", "Same Phrase Group Index Similar Bias", 0.5, 0, 1));

            result.addPropertyInfo(this.createDefaultMinMaxFloatPropertyInfo("differentPhraseGroupIndexDifferentRandomFraction", "Different Phrase Group Index Different Fraction", 0.3, 0, 1));
            result.addPropertyInfo(this.createDefaultMinMaxFloatPropertyInfo("differentPhraseGroupIndexDifferentBias", "Different Phrase Group Index Different Bias", 0.25, 0, 1));

            result.addPropertyInfo(this.createDefaultProbabilityPropertyInfo("prefixGlueProbabilityMultiplier", "Prefix Group Probability Multiplier", 1));
            result.addPropertyInfo(this.createDefaultProbabilityPropertyInfo("postfixGlueProbabilityMultiplier", "Postfix Group Probability Multiplier", 1));

            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("useMaxHarmonyElementLength", "Use max harmony element length", true));

            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("prolongStaticLikelihoods", "Prolong Static Likelihoods", [2]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("prolongDynamicLikelihoods", "Prolong Dynamic Likelihoods", [4]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("prolongDominantCadenceLikelihoods", "Prolong Dominant Cadence Likelihoods", [3]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("prolongTonicCadenceLikelihoods", "Prolong Tonic Cadence Likelihoods", [1]));

            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("prolongHarmonyPartBiases", "Prolong Harmony Part Biases", [20]));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("prolongHarmonyPartRandomFractions", "Prolong Harmony Part Fractions", [50]));

//            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overwriteGroupModulationIndices", "Overwrite Group Modulation Indices", false));
//            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("groupModulation1Indices", "Single Step Modulation indices", [1]));
//            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("groupModulation2Indices", "Two Step Modulation indices", [1, 2]));
//            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("groupModulation3Indices", "Three Step Modulation indices", [1, 2, 3]));
//            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("groupModulation4Indices", "Four Step Modulation indices", [1, 2, 3, 4]));
//            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("groupModulation5Indices", "Five Step Modulation indices", [1, 2, 3, 4, 5]));


//            this.harmonyLengthLikelihoodMultipliers = [{}];
//            this.harmonyLengthLikelihoodOverwriters = [{}];
//            this.overwriteHarmonyLengthLikelihoods = [false];
//            this.harmonyLengthLikelihoods = [{"4": 1}];
            break;
        case "SongPartTypeOverrideInfo":
            result.addPropertyInfo(this.createEnumPropertyInfo("partType", "Part type", SongPartType.VERSE_1, SongPartType));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overridePhraseGroupType", "Override phrase group type", false));
            result.addPropertyInfo(this.createEnumPropertyInfo("phraseGroupType", "Phrase group type", SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT_SHORTEN, SimpleModuleGeneratorPhraseGroupType));

            result.addPropertyInfo(this.createEnumListPropertyInfo("customPhraseTypes", "Custom phrase types", PhraseHarmonyElementType.COMPLETE, PhraseHarmonyElementType));

            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overrideMajorModulationTarget", "Override major modulation/tonicization target", false));
            result.addPropertyInfo(this.createEnumPropertyInfo("majorModulationTarget", "Major modulation/tonicization target", DynamicHarmonyModulationTarget.DOMINANT, DynamicHarmonyModulationTarget));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overrideMinorModulationTarget", "Override minor modulation/tonicization target", false));
            result.addPropertyInfo(this.createEnumPropertyInfo("minorModulationTarget", "Minor modulation/tonicization target", DynamicHarmonyModulationTarget.DOMINANT, DynamicHarmonyModulationTarget));

            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("harmonyElementIndices", "Custom harmony indices", []));

            result.addPropertyInfo(this.createEnumListPropertyInfo("sameGroupIndexSames", "Same part sames", PhraseGroupIndexProperty.HARMONY_RYTHM, PhraseGroupIndexProperty));
            result.addPropertyInfo(this.createEnumListPropertyInfo("sameGroupIndexDifferents", "Same part differents", PhraseGroupIndexProperty.HARMONY_RYTHM, PhraseGroupIndexProperty));

//            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("sameGroupIndexDifferents", "Same part differents", [], PhraseGroupIndexProperty));


            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("melodyShapeIndexOverride", "Melody Shape index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("bassShapeIndexOverride", "Bass Shape index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("harmonyRythmIndexOverride", "Harmony rythm index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("suspendIndexOverride", "Suspend index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("melodyChannelDistributionIndexOverride", "Melody instrument index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("inner1ChannelDistributionIndexOverride", "Inner 1 instrument index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("inner2ChannelDistributionIndexOverride", "Inner 2 instrument index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("bassChannelDistributionIndexOverride", "Bass instrument index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("melodyMotifDistributionIndexOverride", "Melody motif distribution index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("inner1MotifDistributionIndexOverride", "Inner 1 motif distribution index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("inner2MotifDistributionIndexOverride", "Inner 2 motif distribution index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("bassMotifDistributionIndexOverride", "Bass motif distribution index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("percussionMotifDistributionIndexOverride", "Percussion motif distribution index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("percussionFillMotifDistributionIndexOverride", "Percussion fill motif distribution index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("harmonyExtraIndexOverride", "Harmony characteristics index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("renderAmountIndexOverride", "Render amount index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("sequentialMelodyEffectChangeIndexOverride", "Melody effect index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("sequentialInner1EffectChangeIndexOverride", "Inner 1 effect index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("sequentialInner2EffectChangeIndexOverride", "Inner 2 effect index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("sequentialBassEffectChangeIndexOverride", "Bass effect index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("sequentialPercussionEffectChangeIndexOverride", "Percussion effect index override", []));



//            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("harmonyIndexOverride", "Harmony index override", []));
//            this.tempoIndexOverride = [];
//            this.sequentialTempoChangeIndexOverride = [];
//            this.parallelTempoChangeIndexOverride = [];

            break;
        case "LinearInterpolatedCustomVoiceLineCurveInfo":
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("xValues", "X Values", [0, 1]));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("yValues", "Y Values", [60, 70]));
            break;

        case "SongDetails":
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("setScaleBaseNote", "Set scale base note", false));
            result.addPropertyInfo(this.createDefaultMinMaxIntPropertyInfo("scaleBaseNote", "Scale base note", 60, 0, 127));


            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overwriteSongPartStructure", "Overwrite Song Structure", false));
            result.addPropertyInfo(this.createSongPartStructureInfoListPropertyInfo("songPartStructure", "Song Structure", this.spsidsUidInfo));

            var info = this.createObjectListPropertyInfo("songPartTypeOverrideInfos", "Song part type override infos", this.phraseGroupTypesUidInfo,
                [
                    ["SongPartTypeOverrideInfo", "Song part type override info"]
                ]);
            info.listInfo.itemsDisplayFunction = function(valueItem) {
                return SongPartType.toString(valueItem.partType);
            };
            result.addPropertyInfo(info);

            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("harmonyRythmMeasureCountOverrides", "Harmony Rythm Measure Count overrides", [], [new ArrayElementConstraint(new RangePropertyConstraint([1, 32]))]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("harmonyRythmNoteCountOverrides", "Harmony Rythm note count overrides", [], [new ArrayElementConstraint(new RangePropertyConstraint([0.125, 32]))]));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("harmonyRythmDensityCurveAmplitudeOverrides", "Harmony Rythm Density curve amp overrides", []));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("harmonyRythmDensityCurveFrequencyOverrides", "Harmony Rythm Density curve freq overrides", []));

            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("melodyMotifRythmNoteCountOverrides", "Melody motif rythm note count overrides", []));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("bassMotifRythmNoteCountOverrides", "Bass motif rythm note count overrides", []));

            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overwriteMelodyInstruments", "Override Melody Instruments", false));
            result.addPropertyInfo(this.createEnumListPropertyInfo("melodyInstruments", "Melody Instruments", MidiProgram.ACOUSTIC_GRAND_PIANO, MidiProgram));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overwriteInner1Instruments", "Override Inner 1 Instruments", false));
            result.addPropertyInfo(this.createEnumListPropertyInfo("inner1Instruments", "Inner 1 Instruments", MidiProgram.ACOUSTIC_GRAND_PIANO, MidiProgram));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overwriteInner2Instruments", "Override Inner 2 Instruments", false));
            result.addPropertyInfo(this.createEnumListPropertyInfo("inner2Instruments", "Inner 2 Instruments", MidiProgram.ACOUSTIC_GRAND_PIANO, MidiProgram));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overwriteBassInstruments", "Override Bass Instruments", false));
            result.addPropertyInfo(this.createEnumListPropertyInfo("bassInstruments", "Bass Instruments", MidiProgram.ACOUSTIC_GRAND_PIANO, MidiProgram));

            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("percussionFillMotifIndicesOverride", "Fill motif indices override", []));

            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("addBassDrumsOverride", "Add Bass Drum Overrides", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("addSnareDrumsOverride", "Add Snare Drum Overrides", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("addCrashDrumsOverride", "Add Crash Overrides", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("addRideDrumsOverride", "Add Ride Overrides", []));

            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overrideBassDrumNote", "Override bass drum note", false));
            result.addPropertyInfo(this.createEnumPropertyInfo("bassDrumNote", "Bass Drum", MidiDrum.BASS_DRUM_1, MidiDrum));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overrideSnareDrumNote", "Override snare drum note", false));
            result.addPropertyInfo(this.createEnumPropertyInfo("snareDrumNote", "Snare Drum", MidiDrum.SNARE_DRUM_1, MidiDrum));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overrideCrashDrumNote", "Override crash drum note", false));
            result.addPropertyInfo(this.createEnumPropertyInfo("crashDrumNote", "Crash Drum", MidiDrum.CRASH_CYMBAL_1, MidiDrum));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overrideRideDrumNotes", "Override ride notes", false));
            result.addPropertyInfo(this.createEnumListPropertyInfo("rideDrumNotes", "Ride Drums", MidiDrum.RIDE_BELL, MidiDrum));

            var info = this.createObjectListPropertyInfo("harmonyElements", "Harmony elements", this.phraseGroupTypesUidInfo,
                [
                    ["SimpleSequenceHarmonyElement", "Simple Harmony Sequence"],
                    ["PhraseHarmonyElement", "Phrase Harmony"]
                ]);
            info.listInfo.itemsDisplayFunction = function(valueItem) {
                var result = "Harmony Element (" + valueItem._constructorName + ")";
                return result;
            };
            result.addPropertyInfo(info);


            var info = this.createObjectListPropertyInfo("customMelodyCurveInfos", "Melody curve infos", this.phraseGroupTypesUidInfo,
                [
                    ["LinearInterpolatedCustomVoiceLineCurveInfo", "Linear Interpolation"]
                ]);
            info.listInfo.itemsDisplayFunction = function(valueItem) {
                var result = "Voice line curve (" + valueItem._constructorName + ")";
                return result;
            };
            result.addPropertyInfo(info);

            var info = this.createObjectListPropertyInfo("customBassCurveInfos", "Bass curve infos", this.phraseGroupTypesUidInfo,
                [
                    ["LinearInterpolatedCustomVoiceLineCurveInfo", "Linear Interpolation"]
                ]);
            info.listInfo.itemsDisplayFunction = function(valueItem) {
                var result = "Voice line curve (" + valueItem._constructorName + ")";
                return result;
            };
            result.addPropertyInfo(info);



            break;
        case "SongDomains":

            result.addPropertyInfo(this.createDefaultFloatRangePropertyInfo("tempoRange", "Tempo Range", [], [new ArrayElementConstraint(new RangePropertyConstraint([10, 500]))]));
            result.addPropertyInfo(this.createDefaultRangeListPropertyInfo("melodyShapeAmpRanges", "Melody Shape Amplitude Ranges", [[6, 12]], GuiPropertyDataType.FLOAT_LIST_2D, [new ArrayElementConstraint(new ArrayElementConstraint(new RangePropertyConstraint([-12, 12])))]));
            result.addPropertyInfo(this.createDefaultRangeListPropertyInfo("melodyShapeBiasRanges", "Melody Shape Bias Ranges", [[68, 76]], GuiPropertyDataType.FLOAT_LIST_2D, [new ArrayElementConstraint(new ArrayElementConstraint(new RangePropertyConstraint([50, 90])))]));
            result.addPropertyInfo(this.createDefaultRangeListPropertyInfo("bassShapeAmpRanges", "Bass Shape Amplitude Ranges", [[2, 4]], GuiPropertyDataType.FLOAT_LIST_2D, [new ArrayElementConstraint(new ArrayElementConstraint(new RangePropertyConstraint([-12, 12])))]));
            result.addPropertyInfo(this.createDefaultRangeListPropertyInfo("bassShapeBiasRanges", "Bass Shape Bias Ranges", [[35, 45]], GuiPropertyDataType.FLOAT_LIST_2D, [new ArrayElementConstraint(new ArrayElementConstraint(new RangePropertyConstraint([25, 55])))]));

            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overwriteSongPartStructureRndInfos", "Overwrite Song Structure Domain", false));
            result.addPropertyInfo(this.createSongPartStructureInfoDataSampleListPropertyInfo("songPartStructureRndInfos", "Song Structure Domain", this.spsidsUidInfo));

            result.addPropertyInfo(this.createPhraseGroupTypeDataSampleListPropertyInfo("phraseGroupTypes", "Phrase group types", this.phraseGroupTypesUidInfo));

            result.addPropertyInfo(this.createPhraseGroupTypeDataSampleListPropertyInfo("modulatePhraseGroupTypes", "Modulate phrase group types", this.phraseGroupTypesUidInfo));

            result.addPropertyInfo(this.createIntDataSampleListPropertyInfo("majorDeceptiveRootRndInfos", "Major deceptive root likelihoods", this.phraseGroupTypesUidInfo));
            result.addPropertyInfo(this.createIntDataSampleListPropertyInfo("minorDeceptiveRootRndInfos", "Minor deceptive root likelihoods", this.phraseGroupTypesUidInfo));

            result.addPropertyInfo(this.createPhraseGroupTypeDataSampleListPropertyInfo("introGroupTypes", "Intro group types", this.phraseGroupTypesUidInfo));
            result.addPropertyInfo(this.createPhraseGroupTypeDataSampleListPropertyInfo("endGroupTypes", "End group types", this.phraseGroupTypesUidInfo));
            result.addPropertyInfo(this.createPhraseGroupTypeDataSampleListPropertyInfo("glueGroupTypes", "Postfix/prefix group types", this.phraseGroupTypesUidInfo));



            var info = this.createObjectListPropertyInfo("majorModulationTargetInfos", "Major modulation/tonicization targets", this.phraseGroupTypesUidInfo,
                [
                    ["ModulationTargetDataSample", "Major modulation/tonicization target likelihood"]
                ]);
            info.listInfo.itemsDisplayFunction = function(valueItem) {
                return DynamicHarmonyModulationTarget.toString(valueItem.data) + ", Likelihood: " + valueItem.likelihood;
            };
            result.addPropertyInfo(info);

            var info = this.createObjectListPropertyInfo("minorModulationTargetInfos", "Minor modulation/tonicization targets", this.phraseGroupTypesUidInfo,
                [
                    ["ModulationTargetDataSample", "Minor modulation/tonicization target likelihood"]
                ]);
            info.listInfo.itemsDisplayFunction = function(valueItem) {
                return DynamicHarmonyModulationTarget.toString(valueItem.data) + ", Likelihood: " + valueItem.likelihood;
            };
            result.addPropertyInfo(info);


            result.addPropertyInfo(this.createMidiProgramDataSampleListPropertyInfo("electronicMelodyInstrInfos", "Electronic Melody Instrument Distribution", this.eomUidInfo));
            result.addPropertyInfo(this.createMidiProgramDataSampleListPropertyInfo("electronicInnerFastInstrInfos", "Electronic Inner 1 Instrument Distribution", this.eoi1UidInfo));
            result.addPropertyInfo(this.createMidiProgramDataSampleListPropertyInfo("electronicInnerSlowInstrInfos", "Electronic Inner 2 Instrument Distribution", this.eoi2UidInfo));
            result.addPropertyInfo(this.createMidiProgramDataSampleListPropertyInfo("electronicBassInstrInfos", "Electronic Bass Instrument Distribution", this.eobUidInfo));

            result.addPropertyInfo(this.createMidiProgramDataSampleListPropertyInfo("electricMelodyInstrInfos", "Electric Melody Instrument Distribution", this.emUidInfo));
            result.addPropertyInfo(this.createMidiProgramDataSampleListPropertyInfo("electricInnerFastInstrInfos", "Electric Inner 1 Instrument Distribution", this.ei1UidInfo));
            result.addPropertyInfo(this.createMidiProgramDataSampleListPropertyInfo("electricInnerSlowInstrInfos", "Electric Inner 2 Instrument Distribution", this.ei2UidInfo));
            result.addPropertyInfo(this.createMidiProgramDataSampleListPropertyInfo("electricBassInstrInfos", "Electric Bass Instrument Distribution", this.ebUidInfo));

            result.addPropertyInfo(this.createMidiProgramDataSampleListPropertyInfo("acousticMelodyInstrInfos", "Acoustic Melody Instrument Distribution", this.amUidInfo));
            result.addPropertyInfo(this.createMidiProgramDataSampleListPropertyInfo("acousticInnerFastInstrInfos", "Acoustic Inner 1 Instrument Distribution", this.ai1UidInfo));
            result.addPropertyInfo(this.createMidiProgramDataSampleListPropertyInfo("acousticInnerSlowInstrInfos", "Acoustic Inner 2 Instrument Distribution", this.ai2UidInfo));
            result.addPropertyInfo(this.createMidiProgramDataSampleListPropertyInfo("acousticBassInstrInfos", "Acoustic Bass Instrument Distribution", this.abUidInfo));

            result.addPropertyInfo(this.createMidiDrumDataSampleListPropertyInfo("bassDrumRndInfos", "Bass Drum Distribution", this.bdUidInfo));
            result.addPropertyInfo(this.createMidiDrumDataSampleListPropertyInfo("snareRndInfos", "Snare Drum Distribution", this.sdUidInfo));
            result.addPropertyInfo(this.createMidiDrumDataSampleListPropertyInfo("crashRndInfos", "Crash Drum Distribution", this.cdUidInfo));
            result.addPropertyInfo(this.createMidiDrumDataSampleListPropertyInfo("rideRndInfos", "Ride Drum Distribution", this.rdUidInfo));


//
//            this.minorHarmonicPlans = [
//                {data: [DynamicHarmonyModulationTarget.MEDIANT, DynamicHarmonyModulationTarget.MEDIANT, DynamicHarmonyModulationTarget.SUBDOMINANT], likelihood: 1},
//                {data: [DynamicHarmonyModulationTarget.DOMINANT, DynamicHarmonyModulationTarget.SUBDOMINANT], likelihood: 1}
//            ];
//            this.majorHarmonicPlans = [
//                {data: [DynamicHarmonyModulationTarget.DOMINANT, DynamicHarmonyModulationTarget.SUBDOMINANT], likelihood: 1},
//                {data: [DynamicHarmonyModulationTarget.SUPERTONIC, DynamicHarmonyModulationTarget.MEDIANT, DynamicHarmonyModulationTarget.DOMINANT], likelihood: 1}
//            ];
//
//            this.renderAmountStrengthMap = {
//                veryWeak: [0.02],
//                weak: [0.15],
//                medium: [0.4],
//                strong: [0.7],
//                veryStrong: [1.0]
//            };
//
//
//            this.majorModulationTargetInfos = [
//                {data: DynamicHarmonyModulationTarget.MEDIANT, likelihood: 0.1},
////        {data: DynamicHarmonyModulationTarget.SUBDOMINANT, likelihood: 0.02},
//                {data: DynamicHarmonyModulationTarget.SUBMEDIANT, likelihood: 0.1},
//                {data: DynamicHarmonyModulationTarget.SUPERTONIC, likelihood: 0.2},
//                {data: DynamicHarmonyModulationTarget.DOMINANT, likelihood: 1}
//            ];
//            this.minorModulationTargetInfos = [
//                {data: DynamicHarmonyModulationTarget.MEDIANT, likelihood: 1},
////        {data: DynamicHarmonyModulationTarget.SUBDOMINANT, likelihood: 0.05},
//                {data: DynamicHarmonyModulationTarget.SUBMEDIANT, likelihood: 0.1},
//                {data: DynamicHarmonyModulationTarget.SUBTONIC, likelihood: 0.1},
//                {data: DynamicHarmonyModulationTarget.DOMINANT, likelihood: 0.2}
//            ];
//
//            this.melodyMotifIndexPatternInfos = [
//                {data: [[1], [1], [0]], likelihood: 1},
//                {data: [[1], [2], [0]], likelihood: 1},
//                {data: [[0], [1], [2], [1]], likelihood: 1},
//                {data: [[0], [1], [2], [2]], likelihood: 1},
//                {data: [[0], [1], [1], [2]], likelihood: 1},
//                {data: [[0], [1], [2], [3]], likelihood: 1},
//                {data: [[1], [0], [1], [2]], likelihood: 1},
//                {data: [[1], [0], [2], [1]], likelihood: 1},
//                {data: [[1], [0], [2], [2]], likelihood: 1},
//                {data: [[1], [0], [1], [3]], likelihood: 1},
//                {data: [[1], [0], [2], [3]], likelihood: 1},
//                {data: [[1], [0], [3], [1]], likelihood: 1},
//                {data: [[1], [0], [3], [2]], likelihood: 1},
//                {data: [[1], [1], [0], [2]], likelihood: 1},
//                {data: [[1], [2], [0], [2]], likelihood: 1},
//                {data: [[1], [3], [0], [2]], likelihood: 1},
//                {data: [[1], [3], [0], [1]], likelihood: 1},
//                {data: [[1], [2], [0], [1]], likelihood: 1},
//                {data: [[1], [2], [1], [0]], likelihood: 1},
//                {data: [[1], [2], [3], [0]], likelihood: 1},
//                {data: [[1], [2], [2], [0]], likelihood: 1},
//                {data: [[1], [0], [2], [0]], likelihood: 1},
//                {data: [[1], [0], [1], [0]], likelihood: 1}
//            ];
//
//            this.bassMotifIndexPatternInfos = [
//                {data: [[1], [1], [0]], likelihood: 1},
//                {data: [[1], [2], [0]], likelihood: 1},
//                {data: [[0], [1], [2], [1]], likelihood: 1},
//                {data: [[0], [1], [2], [2]], likelihood: 1},
//                {data: [[0], [1], [1], [2]], likelihood: 1},
//                {data: [[0], [1], [2], [3]], likelihood: 1},
//                {data: [[1], [0], [1], [2]], likelihood: 1},
//                {data: [[1], [0], [2], [1]], likelihood: 1},
//                {data: [[1], [0], [2], [2]], likelihood: 1},
//                {data: [[1], [0], [1], [3]], likelihood: 1},
//                {data: [[1], [0], [2], [3]], likelihood: 1},
//                {data: [[1], [0], [3], [1]], likelihood: 1},
//                {data: [[1], [0], [3], [2]], likelihood: 1},
//                {data: [[1], [1], [0], [2]], likelihood: 1},
//                {data: [[1], [2], [0], [2]], likelihood: 1},
//                {data: [[1], [3], [0], [2]], likelihood: 1},
//                {data: [[1], [3], [0], [1]], likelihood: 1},
//                {data: [[1], [2], [0], [1]], likelihood: 1},
//                {data: [[1], [2], [1], [0]], likelihood: 1},
//                {data: [[1], [2], [3], [0]], likelihood: 1},
//                {data: [[1], [2], [2], [0]], likelihood: 1},
//                {data: [[1], [0], [2], [0]], likelihood: 1},
//                {data: [[1], [0], [1], [0]], likelihood: 1}
//            ];

            break;
    }

//    result.addPropertyInfo(this.createDefaultIntPropertyInfo("value", "Value", 0));
//    result.addPropertyInfo(this.createEnumPropertyInfo("enumType", "Enum type", EnumType.POSITION_UNIT, EnumType));

    return result;
};



