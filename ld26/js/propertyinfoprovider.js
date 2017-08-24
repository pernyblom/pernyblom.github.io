
function PropertyInfoProvider(options) {

    this.uniqueIdManager = getValueOrDefault(options, "uniqueIdManager", new UniqueIdManager());

    var uidManager = this.uniqueIdManager;

    this.uidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "spsi",
        initPrefix: "spsi"
    });
}


PropertyInfoProvider.prototype.createDefaultBooleanPropertyInfo = function(propName, caption, defaultValue) {
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

PropertyInfoProvider.prototype.createDefaultStringPropertyInfo = function(propName, caption, defaultValue) {
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

PropertyInfoProvider.prototype.createDefaultStringSeedPropertyInfo = function(propName, caption, defaultValue) {
    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            dataType: GuiPropertyDataType.STRING,
            displayHint: StringPropertyDisplayHint.TEXT
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
    return this.createDefaultRangePropertyInfo(propName, caption, defaultValue, GuiPropertyDataType.INT_LIST);
};


PropertyInfoProvider.prototype.createDefaultFloatRangePropertyInfo = function(propName, caption, defaultValue, extraConstraints) {
    return this.createDefaultRangePropertyInfo(propName, caption, defaultValue, GuiPropertyDataType.FLOAT_LIST);
};

PropertyInfoProvider.prototype.createDefaultRangeListPropertyInfo = function(propName, caption, defaultValue, dataType) {
    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            dataType: dataType,
            constraints: [
                {
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
                }
            ],
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

PropertyInfoProvider.prototype.getDataSamplePropertyInfos = function(result) {
    result.addPropertyInfo(this.createDefaultMinFloatPropertyInfo("likelihood", "Likelihood", 1, 0));
    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("active", "Active", true));
};


PropertyInfoProvider.prototype.getGuiPropertyInfos = function(obj, parentPropertyInfo) {
    var result = new GuiPropertyInfos();

    switch (obj._constructorName) {
        case "RenderSettings":
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("forceContext2D", "Force 2D Context", false));
//            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("enableShadowMap", "Shadow Maps", true));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("addBloom", "Add Bloom", true));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("addSimulatedAA", "Add Simulated AA", true));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("addVignette", "Add Vignette", true));
//            result.addPropertyInfo(this.createEnumPropertyInfo("lightQuality", "Light Quality", Quality.VERY_HIGH, Quality));
//            result.addPropertyInfo(this.createEnumPropertyInfo("materialQuality", "Material Quality", Quality.VERY_HIGH, Quality));
//            result.addPropertyInfo(this.createEnumPropertyInfo("geometryQuality", "Geometry Quality", Quality.VERY_HIGH, Quality));
            break;
        case "SoundSettings":
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("sfxs", "Play SFX", true));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("music", "Play Music", true));
            break;
        case "GameSettings":

            result.addPropertyInfo(this.createEnumPropertyInfo("levelIndex", "Level", 0, StandardLevel));
//            result.addPropertyInfo(this.createEnumPropertyInfo("playerCount", "Players", PlayerCount.ONE, PlayerCount));
//            result.addPropertyInfo(this.createEnumPropertyInfo("useTouch", "Use touch controls", YesNoAuto.AUTO, YesNoAuto));
            break;
        case "LevelSelectSettings":
            break;
    }

    return result;
};



