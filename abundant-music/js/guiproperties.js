

var GuiPropertyDataType = {
    INT: 0,
    FLOAT: 1,
    STRING: 2,
    BOOLEAN: 3,
    ID_REFERENCE: 4,
    UNIQUE_ID: 5,
    INT_LIST: 6,
    INT_SET: 7,
    INT_LIST_2D: 8,
    FLOAT_LIST: 9,
    FLOAT_SET: 10,
    FLOAT_LIST_2D: 11,
    STRING_LIST: 12,
    STRING_SET: 13,
    STRING_LIST_2D: 14,
    BOOLEAN_LIST: 15,
    BOOLEAN_LIST_2D: 16,
    OBJECT_LIST: 17,
    OBJECT: 18,
    PROCEDURE: 19,
    POSITIONED_1D_LIST: 20,
    OTHER: 21,
    ID_REFERENCE_LIST: 22
};


var StringListPropertyDisplayHint = {
    TEXT: 0,
    TEXT_AREA: 1,
    TEXT_LIST: 2,
    SELECT_LIST: 3
};


var NumberListPropertyDisplayHint = {
    TEXT: 0,
    TEXT_AREA: 1,
    TEXT_LIST: 2,
    SELECT_LIST: 3
};


var NumberList2DPropertyDisplayHint = {
    TEXT: 0,
    TEXT_AREA: 1,
    TEXT_LIST: 2
};


var NumberPropertyDisplayHint = {
    TEXT: 0,
    SLIDER: 1,
    SPINNER: 2,
    COMBOBOX: 3,
    LIST: 4,
    TABLE: 5,
    SPINNER_SLIDER: 6,
    RADIO_BUTTON: 7,
    SELECT: 8
};

var StringPropertyDisplayHint = {
    TEXT: 0,
    COMBOBOX: 1,
    LIST: 2,
    TABLE: 3,
    SELECT: 4,
    TEXT_AREA: 5
};

var BooleanPropertyDisplayHint = {
    TEXT: 0,
    COMBOBOX: 1,
    RADIO_BUTTON: 2,
    SELECT: 3
};

var IdReferencePropertyDisplayHint = {
    TEXT: 0,
    COMBOBOX: 1,
    RADIO_BUTTON: 2,
    SELECT: 3
};

var UniqueIdPropertyDisplayHint = {
    TEXT: 0
};

var ProcedureDisplayHint = {
    BUTTON: 0,
    SELECT: 1,
    MENU: 2
};

var ObjectDisplayHint = {
    PANEL: 0, // Show the object data within a panel and buttons for "unset", "create new" (using constructor infos)
    DIALOG: 1 // Open a dialog to edit object
};

var GuiListOrientation = {
    VERTICAL: 0,
    HORIZONTAL: 1
};

var GuiDetailPanelMode = {
    SHARE: 0,
    SEPARATE: 1,
    DIALOG: 2
};

var GuiSplitType = {
    TABS: 0,
    ACCORDION: 1,
    WINDOWS: 2
};

var GuiNewMode = {
    BUTTONS: 0,
    SELECT: 1,
    COMBOBOX: 2,
    DIALOG: 3
};


function GuiPropertyInfos(options) {
    this.infos = getValueOrDefault(options, "infos", new Map(true));
}

GuiPropertyInfos.prototype.addPropertyInfo = function(info) {
    this.infos.put(info.propertyName, info);
    return this;
};

GuiPropertyInfos.prototype.getPropertyInfo = function(propertyName) {
    return this.infos.get(propertyName);
};

GuiPropertyInfos.prototype.getAsArray = function() {
    return this.infos.listValues();
};

function IndentInfo() {
    this.level = 0;
    this.whiteSpaceString = " ";
}

IndentInfo.prototype.getWhiteSpaceString = function() {
    var result = "";
    for (var i=0; i<this.level; i++) {
        result += this.whiteSpaceString;
    }
    return result;
};


function PropertyConstraint() {
}

PropertyConstraint.prototype.isValid = function(object, propertyName, value) {
    return true;
};

PropertyConstraint.prototype.getInvalidDescription = function(object, propertyName, value) {
    return "";
};

function RangePropertyConstraint(range) {
    this.range = range || [0, 1];
}
RangePropertyConstraint.prototype = new PropertyConstraint();

RangePropertyConstraint.prototype.isValid = function(object, propertyName, value) {
    return value >= this.range[0] && value <= this.range[1];
};

RangePropertyConstraint.prototype.getInvalidDescription = function(object, propertyName, value) {
    if (value < this.range[0]) {
        return "Must be greater than or equal " + this.range[0];
    }
    if (value > this.range[1]) {
        return "Must be less than or equal " + this.range[1];
    }
    return "";
};

function MinPropertyConstraint(minValue) {
    this.minValue = minValue;
}
MinPropertyConstraint.prototype = new PropertyConstraint();

MinPropertyConstraint.prototype.isValid = function(object, propertyName, value) {
    return value >= this.minValue;
};

MinPropertyConstraint.prototype.getInvalidDescription = function(object, propertyName, value) {
    if (value < this.minValue) {
        return "Must be greater than or equal " + this.minValue;
    }
    return "";
};

function MaxPropertyConstraint(maxValue) {
    this.maxValue = maxValue;
}
MaxPropertyConstraint.prototype = new PropertyConstraint();

MaxPropertyConstraint.prototype.isValid = function(object, propertyName, value) {
    return value <= this.maxValue;
};

MaxPropertyConstraint.prototype.getInvalidDescription = function(object, propertyName, value) {
    if (value > this.maxValue) {
        return "Must be less than or equal " + this.maxValue;
    }
    return "";
};


function ArrayMinLengthConstraint(minLength) {
    this.minLength = typeof(minLength) === 'undefined' ? 1 : minLength;
}
ArrayMinLengthConstraint.prototype = new PropertyConstraint();

ArrayMinLengthConstraint.prototype.isValid = function(object, propertyName, value) {
    return value.length >= this.minLength;
};

ArrayMinLengthConstraint.prototype.getInvalidDescription = function(object, propertyName, value) {
    if (value.length < this.minLength) {
        return "Must contain at least " + this.minLength + " " + (this.minLength == 1 ? "item" : "items");
    }
    return "";
};



function ArrayElementConstraint(constraint) {
    this.elementConstraint = constraint || {
        isValid: function() {
            return true;
        },
        getInvalidDescription: function() {
            return "";
        }
    };
}
ArrayElementConstraint.prototype = new PropertyConstraint();

ArrayElementConstraint.prototype.isValid = function(object, propertyName, value) {
    if (this.elementConstraint) {
        if (isArray(value)) {
//            logit("Checking array elements in " + value.join(", ") + " prop name: " + propertyName);
            for (var i=0; i<value.length; i++) {
                if (!this.elementConstraint.isValid(object, propertyName + "[" + i + "]", value[i])) {
                    return false;
                }
            }
        }
    }
    return true;
};

ArrayElementConstraint.prototype.getInvalidDescription = function(object, propertyName, value) {
    if (this.elementConstraint) {
        if (isArray(value)) {
            for (var i=0; i<value.length; i++) {
                var propName = propertyName + "[" + i + "]";
                if (!this.elementConstraint.isValid(object, propName, value[i])) {
                    return "Item " + (i+1) + ": " + this.elementConstraint.getInvalidDescription(object, propName, value[i]);
                }
            }
        }
    }
    return "";
};



// Constraint example:
//
// var dummyConstraint = {
//    isValid: function(object, propName, value) {
//        return true;
//    },
//    getPossibleValues: function(object, propName) {
//        return [1, 3, 7];
//    },
//    getMinValue: function(object, propName) {
//        return 0;
//    },
//    getMaxValue: function(object, propName) {
//        return 10;
//    },
//    getValueIncrement: function(object, propName) {
//        return 1;
//    },
//    getInvalidDescription: function(object, propName, value) {
//        return "invalid value";
//    }
// };
//


// Used for splitting up into tabs, windows, accordions etc.
function GuiSplitInfo(options) {
    this.group = getValueOrDefault(options, "group", "Group");
    this.groupCaption = getValueOrDefault(options, "groupCaption", "");
    this.splitType = getValueOrDefault(options, "splitType", GuiSplitType.TABS);
}



function GuiListInfo(options) {
    this.constructorInfos = getValueOrDefault(options, "constructorInfos", []);
    this.newMode = getValueOrDefault(options, "newMode", GuiNewMode.BUTTONS);
    this.itemsDisplayFunction = getValueOrDefault(options, "itemsDisplayFunction", null); // How to display the container elements
    this.detailPanelMode = getValueOrDefault(options, "detailPanelMode", GuiDetailPanelMode.SEPARATE);
    this.possibleValues = getValueOrDefault(options, "possibleValues", []);
}

function GuiObjectInfo(options) {
    this.constructorInfos = getValueOrDefault(options, "constructorInfos", []);
    this.newMode = getValueOrDefault(options, "newMode", GuiNewMode.BUTTONS);
    this.canUnset = getValueOrDefault(options, "canUnset", true);
}


//var uniqueIdManager = {
//    addUniqueIdListener: function(namespaces, listener) {
//        // Adding the listener to
//    },
//    removeUniqueIdListener: function(namespaces, listener) {
//        //
//    },
//    uniqueIdAvailable: function(namespace, testId) {
//        //
//    },
//    getUniqueIds: function(namespace) {
//        //
//    },
//    changeUniqueId: function(namespace, oldId, newId) {
//        // Make sure that all listeners of that namespace know about this
//    },
//    removeUniqueId: function(namespace, oldId, newId) {
//        // Make sure that all listeners of that namespace know about this
//    }
//}
//


function GuiUniqueIdInfo(options) {
    this.manager = getValueOrDefault(options, "manager", null);
    this.namespace = getValueOrDefault(options, "namespace", "ns");
    this.initPrefix = getValueOrDefault(options, "initPrefix", "id"); // Used for new objects
}

function GuiProcedureInfo(options) {
    this.args = getValueOrDefault(options, "args", []);
    this.targetObject = getValueOrDefault(options, "targetObject", null); // What should be used as "this". The component is used instead if null.
    this.group = getValueOrDefault(options, "group", "procedureGroup"); // For grouping procedures in menus, select options etc.
}

function GuiConstructorInfo(options) {
    this.name = getValueOrDefault(options, "name", "");
    this.text = getValueOrDefault(options, "text", "");
    this.nameIsConstructor = getValueOrDefault(options, "nameIsConstructor", true);
    this.createValue = getValueOrDefault(options, "createValue", function() {return 0});
}


// Used for stuff that has a position (either implicit or explicit)
// * position + length: All explicit
// * length only: Position is implicit with the order and lengths
// * position only: Length is implicit
// * no position/length: Length and position is implicit
function GuiPositioned1DListInfo(options) {
    this.constructorInfos = getValueOrDefault(options, "constructorInfos", []);
    this.newMode = getValueOrDefault(options, "newMode", GuiNewMode.BUTTONS);
    this.detailPanelMode = getValueOrDefault(options, "detailPanelMode", GuiDetailPanelMode.SEPARATE);
    this.positionPropertyName = getValueOrDefault(options, "positionPropertyName", null);
    this.lengthPropertyName = getValueOrDefault(options, "lengthPropertyName", null);
    this.allowOverlap = getValueOrDefault(options, "allowOverlap", false); // Only when both position and length are explicit
    this.positionSnapFunction = getValueOrDefault(options, "positionSnapFunction", null);
    this.lengthSnapFunction = getValueOrDefault(options, "lengthSnapFunction", null);
}

function GuiOtherInfo(options) {
    this.componentConstructor = getValueOrDefault(options, "componentConstructor", "");
    this.data = getValueOrDefault(options, "data", null);
}


function GuiPropertyInfo(options) {
    this.propertyName = getValueOrDefault(options, "propertyName", "propName");
    this.propertyCaption = getValueOrDefault(options, "propertyCaption", "Prop. Caption");
    this.dataType = getValueOrDefault(options, "dataType", GuiPropertyDataType.INT);
    this.possibleValues = getValueOrDefault(options, "possibleValues", []);
    this.defaultValue = getValueOrDefault(options, "defaultValue", 0);
    this.allowNull = getValueOrDefault(options, "allowNull", false); // Not always possible
    this.displayHint = getValueOrDefault(options, "displayHint", NumberPropertyDisplayHint.TEXT);
    this.shortDescription = getValueOrDefault(options, "shortDescription", null); // Single line short string
    this.longDescription = getValueOrDefault(options, "longDescription", null); // Single line string
    this.multilineDescription = getValueOrDefault(options, "multilineDescription", null); // Array of strings
    this.convertFunction = getValueOrDefault(options, "convertFunction", null); // function(propName, value) {return Math.round(value);}
    this.displayFunction = getValueOrDefault(options, "displayFunction", null); // function(propName, value) {return "string representation"}
    this.constraints = getValueOrDefault(options, "constraints", []);
    this.splitInfo = getValueOrDefault(options, "splitInfo", null); // Used for splitting up content into tabs, windows etc.
    this.listInfo = getValueOrDefault(options, "listInfo", null); // Only used when the property is a container
    this.objectInfo = getValueOrDefault(options, "objectInfo", null); // Only used when the property is an object
    this.uniqueIdInfo = getValueOrDefault(options, "uniqueIdInfo", null); // Used for unique ids
    this.procedureInfo = getValueOrDefault(options, "procedureInfo", null); // Used when the "property" is a method name
    this.positioned1DListInfo = getValueOrDefault(options, "positioned1DListInfo", null); //
    this.propertyInfoProvider = getValueOrDefault(options, "propertyInfoProvider", null); //
    this.otherInfo = getValueOrDefault(options, "otherInfo", null); //
    this.componentRegisters = getValueOrDefault(options, "componentRegisters", []); //
}


GuiPropertyInfo.prototype.getValue = function(object) {
};

