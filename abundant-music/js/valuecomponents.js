
function IdReferenceListSelectComponent(object, propertyInfo) {
    GuiPropertySelectListComponent.call(this, object, propertyInfo);
    var manager = this.getUniqueIdManager();
    if (manager) {
        manager.addUniqueIdListener(this.propertyInfo.uniqueIdInfo.namespace, this);
    } else {
        logit("Could not find unique id manager in IdReferenceListSelectComponent<br />");
    }
}

IdReferenceListSelectComponent.prototype = new GuiPropertySelectListComponent();


IdReferenceListSelectComponent.prototype.getItemValue = function(itemString) {
    return itemString;
};

IdReferenceListSelectComponent.prototype.componentRemoved = function() {
    GuiPropertySelectListComponent.prototype.componentRemoved.call(this);
    var manager = this.getUniqueIdManager();
    if (manager) {
        manager.removeUniqueIdListener(this.propertyInfo.uniqueIdInfo.namespace, this);
    }
};

IdReferenceListSelectComponent.prototype.uniqueIdAdded = function(owner, namespace, newId) {
    this.addOption(newId, newId);
};

IdReferenceListSelectComponent.prototype.uniqueIdChanged = function(owner, namespace, oldId, newId) {
    this.changeOption(oldId, newId, newId);
};

IdReferenceListSelectComponent.prototype.uniqueIdRemoved = function(owner, namespace, theId) {
    this.removeOption(theId, "");
};

IdReferenceListSelectComponent.prototype.getValuesAndNames = function() {
    var result = [["", "None"]];
    var manager = this.getUniqueIdManager();
    if (manager) {
        var ids = manager.getUniqueIds(this.getUniqueIdNamespace());
        for (var i=0; i<ids.length; i++) {
            result.push([ids[i], ids[i]]);
        }
    }
    return result;
};


function IntegerSelectComponent(object, propertyInfo) {
    GuiPropertySelectComponent.call(this, object, propertyInfo);
}

IntegerSelectComponent.prototype = new GuiPropertySelectComponent();

IntegerSelectComponent.prototype.setValueVerifyRaw = function() {
    var value = this.$input.val();
    var intValue = parseInt(value);
    var error = isNaN(intValue);
    this.setError(error, "Invalid integer");
    if (!error) {
        this.setValueVerify(intValue);
    }
};


function IntegerListSelectComponent(object, propertyInfo) {
    GuiPropertySelectListComponent.call(this, object, propertyInfo);
}

IntegerListSelectComponent.prototype = new GuiPropertySelectListComponent();


IntegerListSelectComponent.prototype.getItemValue = function(itemString) {
    var intValue = parseInt(itemString);
    return intValue;
};




function FloatSelectComponent(object, propertyInfo) {
    GuiPropertySelectComponent.call(this, object, propertyInfo);
}

FloatSelectComponent.prototype = new GuiPropertySelectComponent();

FloatSelectComponent.prototype.setValueVerifyRaw = function() {
    var value = this.$input.val();
    var floatValue = parseFloat(value);
    var error = isNaN(floatValue);
    this.setError(error, "Invalid decimal");
    if (!error) {
        this.setValueVerify(floatValue);
    }
};

function StringSelectComponent(object, propertyInfo) {
    GuiPropertySelectComponent.call(this, object, propertyInfo);
}

StringSelectComponent.prototype = new GuiPropertySelectComponent();

StringSelectComponent.prototype.setValueVerifyRaw = function() {
    var value = this.$input.val();
    this.setValueVerify(value);
};

function BooleanSelectComponent(object, propertyInfo) {
    GuiPropertySelectComponent.call(this, object, propertyInfo);
}

BooleanSelectComponent.prototype = new GuiPropertySelectComponent();

BooleanSelectComponent.prototype.setValueVerifyRaw = function() {
    var textValue = this.$input.val();
    var booleanValue = textValue == "true" ? true : false;
    //    logit(" in boolean select: textValue: " + textValue + " booleanValue: " + booleanValue + "<br />");
    this.setValueVerify(booleanValue);
};

BooleanSelectComponent.prototype.getValuesAndNames = function() {
    var result = [];
    var values = [true, false];
    for (var i=0; i<values.length; i++) {
        var value = values[i];
        var displayValue = value;
        if (this.propertyInfo.displayFunction) {
            displayValue = this.propertyInfo.displayFunction.call(this, this.object, this.propertyInfo.propertyName, value);
        }
        result.push([value, displayValue]);
    }
    return result;
};



function IntegerTextComponent(object, propertyInfo) {
    GuiPropertyTextComponent.call(this, object, propertyInfo);
}

IntegerTextComponent.prototype = new GuiPropertyTextComponent();

IntegerTextComponent.prototype.setValueVerifyRaw = function() {
    var error = false;
    var textValue = this.$input.val();

    var parseResult = {};
    this.parseInteger(textValue, parseResult);

    error = parseResult.error;

    if (!parseResult.error) {
        error = this.verifyNumberConstraints(parseResult.value);
        if (error) {
            // The setError() is called in verifyNumberConstraints()
            return;
        }
    }
    this.setError(error, "Invalid integer");

    if (!error) {
        this.setValueVerify(parseResult.value);
    }
};


function StringTextAreaComponent(object, propertyInfo) {
    GuiPropertyTextComponent.call(this, object, propertyInfo);
    this.inputTag = "textarea";
}

StringTextAreaComponent.prototype = new GuiPropertyTextComponent();

StringTextAreaComponent.prototype.setValueVerifyRaw = function() {
    var textValue = this.$input.val();
    this.setValueVerify(textValue);
};


function IntegerListTextComponent(object, propertyInfo) {
    GuiPropertyTextComponent.call(this, object, propertyInfo);
}

IntegerListTextComponent.prototype = new GuiPropertyTextComponent();

IntegerListTextComponent.prototype.valueToString = function(value) {
    return value.join(" ");
};


IntegerListTextComponent.prototype.setValueVerifyRaw = function() {
    var error = false;
    var errorMessage = "";

    var textValue = this.$input.val();

    textValue = $.trim(textValue);

    var textArray = textValue.split(" ");

    var intArr = [];
    for (var i=0; i<textArray.length; i++) {
        var text = $.trim(textArray[i]);
        if (text) {
            var parseResult = {};
            this.parseInteger(text, parseResult);
            if (!parseResult.error) {
                intArr.push(parseResult.value);
            }
            error = parseResult.error;
        }
        if (error) {
            errorMessage = "Invalid integer: '" + text + "'";
            break;
        }
    }
    this.setError(error, errorMessage);

    if (!error) {
        this.setValueVerify(intArr);
    }
};


function IntegerList2DTextComponent(object, propertyInfo) {
    GuiPropertyTextComponent.call(this, object, propertyInfo);
}

IntegerList2DTextComponent.prototype = new GuiPropertyTextComponent();

IntegerList2DTextComponent.prototype.valueToString = function(value) {
    var result = "";
    for (var i=0; i<value.length; i++) {
        var arr = value[i];
        result += arr.join(" ");
        if (i < value.length - 1) {
            result += ", ";
        }
    }
    return result;
};


IntegerList2DTextComponent.prototype.setValueVerifyRaw = function() {
    var error = false;
    var errorMessage = "";

    var textValue = this.$input.val();

    textValue = $.trim(textValue);

    var intArrs = [];

    var arrayTexts = textValue.split(",");

    for (var j=0; j<arrayTexts.length; j++) {
        var arrayText = arrayTexts[j];

        var textArray = arrayText.split(" ");

        var intArr = [];
        for (var i=0; i<textArray.length; i++) {
            var text = $.trim(textArray[i]);
            if (text) {
                var parseResult = {};
                this.parseInteger(text, parseResult);
                if (!parseResult.error) {
                    intArr.push(parseResult.value);
                }
                error = parseResult.error;
            }
            if (error) {
                errorMessage = "Invalid integer: '" + text + "'";
                break;
            }
        }
        if (error) {
            break;
        }
        if (intArr.length > 0) {
            intArrs.push(intArr);
        }
    }
    this.setError(error, errorMessage);

    if (!error) {
        this.setValueVerify(intArrs);
        //        logit("Setting value to " + JSON.stringify(intArrs) + "<br />");
    }
};




function FloatTextComponent(object, propertyInfo) {
    GuiPropertyTextComponent.call(this, object, propertyInfo);
}

FloatTextComponent.prototype = new GuiPropertyTextComponent();

FloatTextComponent.prototype.setValueVerifyRaw = function() {
    var error = false;
    var textValue = this.$input.val();
    if (!error) {
        var floatValue = parseFloat(textValue);
        error = isNaN(floatValue);
    }
    if (!error) {
        error = this.verifyNumberConstraints(floatValue);
        if (error) {
            // The setError() is called in verifyNumberConstraints()
            return;
        }
    }
    this.setError(error, "Invalid decimal");

    if (!error) {
        this.setValueVerify(floatValue);
    }
};


function FloatListTextComponent(object, propertyInfo) {
    GuiPropertyTextComponent.call(this, object, propertyInfo);
}

FloatListTextComponent.prototype = new GuiPropertyTextComponent();

FloatListTextComponent.prototype.valueToString = function(value) {
    return value.join(" ");
};


FloatListTextComponent.prototype.setValueVerifyRaw = function() {
    var error = false;
    var errorMessage = "";

    var textValue = this.$input.val();

    textValue = $.trim(textValue);

    var textArray = textValue.split(" ");

    var floatArr = [];
    for (var i=0; i<textArray.length; i++) {
        var text = $.trim(textArray[i]);
        if (text) {
            var floatValue = parseFloat(text);
            error = isNaN(floatValue);
            if (!error) {
                floatArr.push(floatValue);
            }
        }
        if (error) {
            errorMessage = "Invalid decimal: '" + text + "'";
            break;
        }
    }
    this.setError(error, errorMessage);

    if (!error) {
        this.setValueVerify(floatArr);
    }
};


function FloatList2DTextComponent(object, propertyInfo) {
    GuiPropertyTextComponent.call(this, object, propertyInfo);
}

FloatList2DTextComponent.prototype = new GuiPropertyTextComponent();

FloatList2DTextComponent.prototype.valueToString = function(value) {
    var result = "";
    for (var i=0; i<value.length; i++) {
        var arr = value[i];
        result += arr.join(" ");
        if (i < value.length - 1) {
            result += ", ";
        }
    }
    return result;
};


FloatList2DTextComponent.prototype.setValueVerifyRaw = function() {
    var error = false;
    var errorMessage = "";

    var textValue = this.$input.val();

    textValue = $.trim(textValue);

    var floatArrs = [];

    if (textValue != "") {

        var arrayTexts = textValue.split(",");

        for (var j=0; j<arrayTexts.length; j++) {
            var arrayText = arrayTexts[j];

            var textArray = arrayText.split(" ");

            var floatArr = [];
            for (var i=0; i<textArray.length; i++) {
                var text = $.trim(textArray[i]);
                if (text) {

                    var floatValue = parseFloat(text);
                    error = isNaN(floatValue);
                    if (!error) {
                        floatArr.push(floatValue);
                    }
                }
                if (error) {
                    errorMessage = "Invalid decimal: '" + text + "'";
                    break;
                }
            }
            if (error) {
                break;
            }
            floatArrs.push(floatArr);
        }
        this.setError(error, errorMessage);
    }
    if (!error) {
        this.setValueVerify(floatArrs);
        //        logit("Setting value to " + JSON.stringify(intArrs) + "<br />");
    }
};



function StringNotEmptyConstraint(options) {
    this.errorMessage = getValueOrDefault(options, "errorMessage", "Must not be empty");
}

StringNotEmptyConstraint.prototype.isValid = function(object, propName, value) {
    return value != "";
};

StringNotEmptyConstraint.prototype.getInvalidDescription = function(object, propName, value) {
    return this.errorMessage;
};

function StringLengthConstraint(options) {
    this.maxLength = getValueOrDefault(options, "maxLength", 9999999999999);
    this.minLength = getValueOrDefault(options, "minLength", 0);
}

StringLengthConstraint.prototype.isValid = function(object, propName, value) {
    return value.length <= this.maxLength && value.length >= this.minLength;
};

StringLengthConstraint.prototype.getInvalidDescription = function(object, propName, value) {
    if (value.length < this.minLength) {
        var charStr = this.minLength == 1 ? "character" : "characters";
        return "Must have at least " + this.minLength + " " + charStr;
    }
    if (value.length > this.maxLength) {
        var charStr = this.maxLength == 1 ? "character" : "characters";
        return "Must have at most " + this.maxLength + " " + charStr;
    }
    return "";
};

function StringTextComponent(object, propertyInfo) {
    GuiPropertyTextComponent.call(this, object, propertyInfo);
}

StringTextComponent.prototype = new GuiPropertyTextComponent();

StringTextComponent.prototype.setValueVerifyRaw = function() {
    var error = false;
    var textValue = this.$input.val();
    if (!error) {
        this.setValueVerify(textValue);
    }
};


function IdReferenceSelectComponent(object, propertyInfo) {
    GuiPropertySelectComponent.call(this, object, propertyInfo);

    // this.hasValueTypeRadios = false;
    var manager = this.getUniqueIdManager();
    if (manager) {
        manager.addUniqueIdListener(this.propertyInfo.uniqueIdInfo.namespace, this);
    } else {
        logit("Could not find unique id manager in IdReferenceSelectComponent<br />");
    }
}

IdReferenceSelectComponent.prototype = new GuiPropertySelectComponent();


IdReferenceSelectComponent.prototype.componentRemoved = function() {
    GuiPropertySelectComponent.prototype.componentRemoved.call(this);
    var manager = this.getUniqueIdManager();
    if (manager) {
        manager.removeUniqueIdListener(this.propertyInfo.uniqueIdInfo.namespace, this);
    }
};

IdReferenceSelectComponent.prototype.uniqueIdAdded = function(owner, namespace, newId) {
    this.addOption(newId, newId);
};

IdReferenceSelectComponent.prototype.uniqueIdChanged = function(owner, namespace, oldId, newId) {
    this.changeOption(oldId, newId, newId);
};

IdReferenceSelectComponent.prototype.uniqueIdRemoved = function(owner, namespace, theId) {
    this.removeOption(theId, "");
};

IdReferenceSelectComponent.prototype.getValuesAndNames = function() {
    var result = [["", "None"]];
    var manager = this.getUniqueIdManager();
    if (manager) {
        var ids = manager.getUniqueIds(this.getUniqueIdNamespace());
        for (var i=0; i<ids.length; i++) {
            result.push([ids[i], ids[i]]);
        }
    }
    return result;
};

IdReferenceSelectComponent.prototype.setValueVerifyRaw = function() {
    var value = this.$input.val();
    this.setValueVerify(value);
};


function ProcedureButtonComponent(object, propertyInfo) {
    GuiPropertyComponent.call(this, object, propertyInfo);
    this.tagName = "button";
    this.setUniqueId();
}

ProcedureButtonComponent.prototype = new GuiPropertyComponent();

ProcedureButtonComponent.prototype.getHtmlContentBeforeChildren = function(resultArr) {
    resultArr.push(this.propertyInfo.propertyCaption);
};


ProcedureButtonComponent.prototype.jQueryCreated = function($localRoot) {
    GuiPropertyComponent.prototype.jQueryCreated.call(this, $localRoot);
    this.$component.button();
    var propertyInfo = this.propertyInfo;
    var object = this.object;
    var comp = this;
    this.$component.on("click", function() {
        var procInfo = propertyInfo.procedureInfo;
        var args = [];
        var targetObject = null;
        if (procInfo) {
            args = procInfo.args;
            targetObject = procInfo.targetObject;
        }
        if (!targetObject) {
            targetObject = comp;
        }
        var proc = targetObject[propertyInfo.propertyName];
        if (proc && $.isFunction(proc)) {
            proc.apply(targetObject, args);
        } else {
            logit("Could not find procedure " + propertyInfo.propertyName + " in ProcedureButtonComponent<br />");
            logit("" + targetObject._constructorName + " " + propertyInfo.propertyName + "<br />");
        }
    });
};



function UniqueIdTextComponent(object, propertyInfo) {
    GuiPropertyTextComponent.call(this, object, propertyInfo);
    this.hasValueTypeRadios = false;

}

UniqueIdTextComponent.prototype = new GuiPropertyTextComponent();

UniqueIdTextComponent.prototype.setValueVerifyRaw = function() {
    var error = false;
    var errorText = "";
    var textValue = this.$input.val();

    if (!textValue) {
        error = true;
        errorText = "ID can not be empty";
    }
    var oldValue = this.getValue();
    if (!error && oldValue != textValue) {
        var manager = this.getUniqueIdManager();
        var namespace = this.getUniqueIdNamespace();
        error = !manager.uniqueIdAvailable(this.object, namespace, textValue);
        if (error) {
            errorText = "ID already exists";
        }
    }
    if (!error) {
        if (this.setValueVerify(textValue) && oldValue != textValue) {
            manager.changeUniqueId(this.object, namespace, oldValue, textValue);
        }
    } else {
        this.setError(true, errorText);
    }
};


function GuiObjectComponent(object, propertyInfo) {
    GuiPropertyComponent.call(this, object, propertyInfo);

    this.$details = null;
    this.cssClassName = "object-list-panel";
    this.otherCssClasses.push("ui-widget-content");
    this.setUniqueId();

    this.detailsId = this.id + "-details";
    this.newButtonIdPrefix = this.id + "-new-button";

    this.detailsComponent = null;

    this._constructorName = "GuiObjectComponent";
}

GuiObjectComponent.prototype = new GuiPropertyComponent();



GuiObjectComponent.prototype.componentRemoved = function() {
    GuiPropertyComponent.prototype.componentRemoved.call(this);
    if (this.detailsComponent) {
        this.detailsComponent.componentRemoved();
    }
};

GuiObjectComponent.prototype.removeDetailsComponent = function() {
    if (this.detailsComponent) {
        this.detailsComponent.componentRemoved();
        this.detailsComponent = null;
    }
};


GuiObjectComponent.prototype.getHtmlContentBeforeChildren = function(resultArr) {
    resultArr.push("<div>" + this.propertyInfo.propertyCaption + "</div>");

    var objectInfo = this.propertyInfo.objectInfo;
    this.getConstructorsHtml(resultArr,
        objectInfo.constructorInfos, objectInfo.newMode);
    // Details panel
    resultArr.push("<div ");
    resultArr.push("id=\"" + this.detailsId + "\" ");
    resultArr.push(">\n");
    resultArr.push("</div>\n");
};



GuiObjectComponent.prototype.jQueryCreated = function($localRoot) {
    GuiPropertyComponent.prototype.jQueryCreated.call(this, $localRoot);
    this.$details = this.$component.find("#" + this.detailsId);

    var objectInfo = this.propertyInfo.objectInfo;

    var comp = this;

    this.addConstructorClickListeners(objectInfo.constructorInfos, function(constrInfo) {
        //        logit("Creating " + constrInfo.text + "<br />");
        var newValue = comp.createNewValue(constrInfo, comp.propertyInfo);
        comp.setValueVerify(newValue);
        //        comp.object[comp.propertyInfo.propertyName] = newValue;
        comp.updateDetailsPanel();
    }, objectInfo.newMode);
    this.updateDetailsPanel();
};


GuiObjectComponent.prototype.updateDetailsPanel = function() {
    var value = this.getValue();

    var propInfo = this.propertyInfo;

    this.$details.empty();
    this.removeDetailsComponent();

    var instanceText = null;
    var constructorInfos = propInfo.objectInfo.constructorInfos;
    if (constructorInfos.length > 1) {
        for (var i=0; i<constructorInfos.length; i++) {
            var ci = constructorInfos[i];
            if (ci.nameIsConstructor && ci.name == value._constructorName) {
                instanceText = ci.text;
                break;
            }
        }
    }

    // Create or get the details component
    var newComponent = new GuiPropertiesComponent({
        propertyInfoProvider: propInfo.propertyInfoProvider,
        object: value,
        componentRegisters: propInfo.componentRegisters
    });
    newComponent.spawn(this.$details);
    if (instanceText) {
        newComponent.$component.prepend($("<div><p>" + instanceText + "</p></div>"));
    }
    newComponent.alignComponents();

    this.detailsComponent = newComponent;
};





function IntegerSliderComponent(object, propertyInfo) {
    GuiPropertySliderComponent.call(this, object, propertyInfo);
}

IntegerSliderComponent.prototype = new GuiPropertySliderComponent();

IntegerSliderComponent.prototype.setValueVerifyRaw = function() {
    var error = false;
    var value = this.$input.slider("value");

    if (!error) {
        this.setValueVerify(value);
    }
};
