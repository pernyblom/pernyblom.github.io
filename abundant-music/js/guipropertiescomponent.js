

function traverseObject(obj, propInfoProvider, func, parentInfo, data) {
    try {
        if (obj && (typeof(obj) === 'object')) {

            var infos = propInfoProvider.getGuiPropertyInfos(obj, parentInfo);

            var arr = infos.getAsArray();

            for (var i=0; i<arr.length; i++) {
                var info = arr[i];

                func(obj, info, data);

                if (info.dataType == GuiPropertyDataType.OBJECT_LIST) {
                    var value = obj[info.propertyName];
                    if (value) {
                        for (var j=0; j<value.length; j++) {
                            traverseObject(value[j], propInfoProvider, func, info, data);
                        }
                    } else {
                        logit("Unable to get property " + info.propertyName + " from " + obj + " (" + obj._constructorName + ") <br />");
                    }
                }
                else if (info.dataType == GuiPropertyDataType.OBJECT) {
                    var value = obj[info.propertyName];
                    traverseObject(value, propInfoProvider, func, parentInfo, data);
                }
            }
        }
    } catch (ex) {
        showStacktraceDialog(ex, "traverseObject() constructor: " + obj._constructorName);
    }
}


function ComponentAlignmentInfo() {
    this.verticalOffsets = [];
}

ComponentAlignmentInfo.prototype.setVerticalOffset = function(index, offset) {
    var old = this.verticalOffsets[index]
    if (typeof old === 'undefined') {
        old = offset;
    }
    this.verticalOffsets[index] = Math.max(old, offset);
};

ComponentAlignmentInfo.prototype.getVerticalOffset = function(index) {
    var result = this.verticalOffsets[index]
    if (typeof result === 'undefined') {
        logit("vertical offset undefined");
        return 0;
    }
    return result;
};


function SplitComponent(object, groupMap, groupCaptions) {
    JQueryComponent.call(this);
    this.object = object;
    this.groupMap = groupMap;
    this.groupCaptions = groupCaptions;
}

SplitComponent.prototype = new JQueryComponent();

SplitComponent.prototype.gatherAlignmentInfo = function(info) {
};

SplitComponent.prototype.setAlignment = function(info) {
    // The default for split components is to ignore the parent alignment and deal with all the subcomponents itself
    this.alignComponents();
};

SplitComponent.prototype.alignComponents = function() {
    for (var i=0; i<this.children.length; i++) {
        var info = new ComponentAlignmentInfo();
        var child = this.children[i];
        child.gatherAlignmentInfo(info);
        child.setAlignment(info);
    }
};


function SplitTabsComponent(object, groupMap, groupCaptions) {
    SplitComponent.call(this, object, groupMap, groupCaptions);
    this.cssClassId = "ui-widget";
    this.groupMap.each(function(group, arr) {
        for (var i=0; i<arr.length; i++) {
            this.addChild(arr[i]);
        }
    }, this);
    this.setUniqueId();
    this._constructorName = "SplitTabsComponent";
}

SplitTabsComponent.prototype = new SplitComponent();


SplitTabsComponent.prototype.createJQueryStrings = function(resultArr) {
    this.addStartHtmlString(resultArr);

    resultArr.push("<ul>");
    this.groupMap.each(function(group, arr) {
        var tabId = this.id + "-" + group;
        var caption = this.groupCaptions.get(group);
        resultArr.push("<li>");
        resultArr.push("<a ");
        resultArr.push("href=\"#" + tabId + "\" ");
        resultArr.push(">");
        resultArr.push(caption);
        resultArr.push("</a>");
        resultArr.push("</li>");
    }, this);
    resultArr.push("</ul>");

    // Create a div for each group
    this.groupMap.each(function(group, arr) {
        var tabId = this.id + "-" + group;
        resultArr.push("<div ");
        resultArr.push(" id=\"" + tabId + "\" ");
        resultArr.push(">");
        for (var i=0; i<arr.length; i++) {
            arr[i].createJQueryStrings(resultArr);
        }
        resultArr.push("</div>");
    }, this);

    this.addEndHtmlString(resultArr);
};


SplitTabsComponent.prototype.jQueryCreated = function($localRoot) {
    JQueryComponent.prototype.jQueryCreated.call(this, $localRoot);
    this.$component.tabs();
};

function GuiPropertiesComponent(options) {
    JQueryComponent.call(this);
//    this.tagName = "table";
    this.object = getValueOrDefault(options, "object", null);
    this.propertyInfoProvider = getValueOrDefault(options, "propertyInfoProvider", null);
    this.componentRegisters = getValueOrDefault(options, "componentRegisters", []);
    this.parentPropertyInfo = getValueOrDefault(options, "parentPropertyInfo", null);
    this.passOnComponentRegisters = getValueOrDefault(options, "passOnComponentRegisters", true);
    this.propertyInfos = null;

    this.changeListeners = [];

    this.cssClassName = "properties-component";
    this.otherCssClasses.push("ui-widget-content");


    if (this.object != null) {
        if (this.object.getGuiPropertyInfos) {
            this.propertyInfos = this.object.getGuiPropertyInfos(this.parentPropertyInfo);
        }
        if (!this.propertyInfos && this.propertyInfoProvider) {
            this.propertyInfos = this.propertyInfoProvider.getGuiPropertyInfos(this.object, this.parentPropertyInfo);
        }
        if (!this.propertyInfos) {
            logit("GuiPropertiesComponent missing propertyInfos for " + this.object + "<br />");
        } else {
            this.createComponents();
        }
    }

    this.setUniqueId();

    this._constructorName = "GuiPropertiesComponent";
}

GuiPropertiesComponent.prototype = new JQueryComponent();


GuiPropertiesComponent.prototype.componentRemoved = function() {
    for (var i=0; i<this.children.length; i++) {
        var c = this.children[i];
        if (c.componentRemoved) {
            c.componentRemoved();
        }
    }
};

GuiPropertiesComponent.prototype.gatherAlignmentInfo = function(info) {
};

GuiPropertiesComponent.prototype.setAlignment = function(info) {
    // The default for split components is to ignore the parent alignment and deal with all the subcomponents itself
    this.alignComponents();
};

GuiPropertiesComponent.prototype.alignComponents = function() {
    var info = new ComponentAlignmentInfo();
    for (var i=0; i<this.children.length; i++) {
        var c = this.children[i];
        //        logit(" " + c._constructorName + " <br />");
        c.gatherAlignmentInfo(info);
    }

    for (var i=0; i<this.children.length; i++) {
        var c = this.children[i];
        c.setAlignment(info);
    }
};

GuiPropertiesComponent.prototype.resetAlignment = function() {
    for (var i=0; i<this.children.length; i++) {
        var c = this.children[i];
        c.resetAlignment();
    }
};



GuiPropertiesComponent.prototype.createIntComponent = function(object, propertyInfo) {
    switch (propertyInfo.displayHint) {
        case NumberPropertyDisplayHint.TEXT:
            return new IntegerTextComponent(object, propertyInfo);
        case NumberPropertyDisplayHint.SELECT:
            return new IntegerSelectComponent(object, propertyInfo);
        case NumberPropertyDisplayHint.RADIO_BUTTON:
            return new IntegerRadioButtonsComponent(object, propertyInfo);
    }
    return null;
};

GuiPropertiesComponent.prototype.createIntListComponent = function(object, propertyInfo) {
    switch (propertyInfo.displayHint) {
        case NumberListPropertyDisplayHint.TEXT:
            return new IntegerListTextComponent(object, propertyInfo);
        case NumberListPropertyDisplayHint.SELECT_LIST:
            return new IntegerListSelectComponent(object, propertyInfo);
    }
    return null;
};

GuiPropertiesComponent.prototype.createIntList2DComponent = function(object, propertyInfo) {
    switch (propertyInfo.displayHint) {
        case NumberList2DPropertyDisplayHint.TEXT:
            return new IntegerList2DTextComponent(object, propertyInfo);
    }
    return null;
};


GuiPropertiesComponent.prototype.createFloatComponent = function(object, propertyInfo) {
    switch (propertyInfo.displayHint) {
        case NumberPropertyDisplayHint.TEXT:
            return new FloatTextComponent(object, propertyInfo);
        case NumberPropertyDisplayHint.SELECT:
            return new FloatSelectComponent(object, propertyInfo);
    }
    return null;
};

GuiPropertiesComponent.prototype.createFloatListComponent = function(object, propertyInfo) {
    switch (propertyInfo.displayHint) {
        case NumberListPropertyDisplayHint.TEXT:
            return new FloatListTextComponent(object, propertyInfo);
    }
    return null;
};


GuiPropertiesComponent.prototype.createFloatList2DComponent = function(object, propertyInfo) {
    switch (propertyInfo.displayHint) {
        case NumberList2DPropertyDisplayHint.TEXT:
            return new FloatList2DTextComponent(object, propertyInfo);
    }
    return null;
};


GuiPropertiesComponent.prototype.createStringComponent = function(object, propertyInfo) {
    switch (propertyInfo.displayHint) {
        case StringPropertyDisplayHint.TEXT:
            return new StringTextComponent(object, propertyInfo);
        case StringPropertyDisplayHint.TEXT_AREA:
            return new StringTextAreaComponent(object, propertyInfo);
        case StringPropertyDisplayHint.SELECT:
            return new StringSelectComponent(object, propertyInfo);
    }
    return null;
};

GuiPropertiesComponent.prototype.createBooleanComponent = function(object, propertyInfo) {
    switch (propertyInfo.displayHint) {
        case BooleanPropertyDisplayHint.SELECT:
            return new BooleanSelectComponent(object, propertyInfo);
    }
    return null;
};


GuiPropertiesComponent.prototype.createIdReferenceComponent = function(object, propertyInfo) {
    switch (propertyInfo.displayHint) {
        case IdReferencePropertyDisplayHint.SELECT:
            return new IdReferenceSelectComponent(object, propertyInfo);
    }
    return null;
};

GuiPropertiesComponent.prototype.createIdReferenceListComponent = function(object, propertyInfo) {
    switch (propertyInfo.displayHint) {
        case IdReferencePropertyDisplayHint.SELECT:
            return new IdReferenceListSelectComponent(object, propertyInfo);
    }
    return null;
};


GuiPropertiesComponent.prototype.createUniqueIdComponent = function(object, propertyInfo) {
    switch (propertyInfo.displayHint) {
        case UniqueIdPropertyDisplayHint.TEXT:
            return new UniqueIdTextComponent(object, propertyInfo);
    }
    return null;
};

GuiPropertiesComponent.prototype.createProcedureComponent = function(object, propertyInfo) {
    switch (propertyInfo.displayHint) {
        case ProcedureDisplayHint.BUTTON:
            return new ProcedureButtonComponent(object, propertyInfo);
    }
    return null;
};

GuiPropertiesComponent.prototype.createOtherComponent = function(object, propertyInfo) {
    var otherInfo = propertyInfo.otherInfo;
    if (otherInfo) {
        var result = eval("new " + otherInfo.componentConstructor + "()");
        result.object = object;
        result.propertyInfo = propertyInfo;
        return result;
    }
    return null;
};

GuiPropertiesComponent.prototype.createObjectListComponent = function(object, propertyInfo) {
    return new GuiObjectListComponent(object, propertyInfo);
};

GuiPropertiesComponent.prototype.createObjectComponent = function(object, propertyInfo) {
    return new GuiObjectComponent(object, propertyInfo);
};

GuiPropertiesComponent.prototype.createSplitComponent = function(object, groupMap, groupCaptions, splitType) {
    switch (splitType) {
        case GuiSplitType.TABS:
            return new SplitTabsComponent(object, groupMap, groupCaptions);
    }
    return null;
};

GuiPropertiesComponent.prototype.createComponent = function(info) {
    var component = null;
    switch (info.dataType) {
        case GuiPropertyDataType.INT:
            component = this.createIntComponent(this.object, info);
            break;
        case GuiPropertyDataType.INT_LIST:
            component = this.createIntListComponent(this.object, info);
            break;
        case GuiPropertyDataType.INT_LIST_2D:
            component = this.createIntList2DComponent(this.object, info);
            break;
        case GuiPropertyDataType.FLOAT:
            component = this.createFloatComponent(this.object, info);
            break;
        case GuiPropertyDataType.FLOAT_LIST:
            component = this.createFloatListComponent(this.object, info);
            break;
        case GuiPropertyDataType.FLOAT_LIST_2D:
            component = this.createFloatList2DComponent(this.object, info);
            break;
        case GuiPropertyDataType.BOOLEAN:
            component = this.createBooleanComponent(this.object, info);
            break;
        case GuiPropertyDataType.STRING:
            component = this.createStringComponent(this.object, info);
            break;
        case GuiPropertyDataType.ID_REFERENCE:
            component = this.createIdReferenceComponent(this.object, info);
            break;
        case GuiPropertyDataType.ID_REFERENCE_LIST:
            component = this.createIdReferenceListComponent(this.object, info);
            break;
        case GuiPropertyDataType.UNIQUE_ID:
            component = this.createUniqueIdComponent(this.object, info);
            break;
        case GuiPropertyDataType.SIMPLE_LIST:
            component = this.createSimpleListComponent(this.object, info);
            break;
        case GuiPropertyDataType.SIMPLE_SET:
            component = this.createSimpleSetComponent(this.object, info);
            break;
        case GuiPropertyDataType.OBJECT_LIST:
            component = this.createObjectListComponent(this.object, info);
            break;
        case GuiPropertyDataType.OBJECT:
            component = this.createObjectComponent(this.object, info);
            break;
        case GuiPropertyDataType.PROCEDURE:
            component = this.createProcedureComponent(this.object, info);
            break;
        case GuiPropertyDataType.OTHER:
            component = this.createOtherComponent(this.object, info);
            break;
    }
    return component;
};

GuiPropertiesComponent.prototype.createComponents = function() {
    var infosArr = this.propertyInfos.getAsArray();
    var components = [];

    var splitComponents = new Map(true);

    var groupCaptions = new Map(true);

    var that = this;
    for (var i=0; i<infosArr.length; i++) {
        var info = infosArr[i];

        if (this.passOnComponentRegisters && this.componentRegisters) {
            info.componentRegisters = this.componentRegisters;
        }

        var component = this.createComponent(info);

        component.changeListeners.push(function(c, oldValue, newValue) {
            for (var i=0; i<that.changeListeners.length; i++) {
                that.changeListeners[i](that, that.object, that.object);
            }
        });

        if (component != null) {
            var splitInfo = info.splitInfo;
            if (splitInfo) {
                var splitMap = splitComponents.get(splitInfo.splitType);
                if (!splitMap) {
                    splitMap = new Map(true);
                    splitComponents.put(splitInfo.splitType, splitMap);
                }
                var splitArr = splitMap.get(splitInfo.group);
                if (!splitArr) {
                    splitArr = [];
                    splitMap.put(splitInfo.group, splitArr);
                }
                splitArr.push(component);

                if (splitInfo.groupCaption) {
                    groupCaptions.put(splitInfo.group, splitInfo.groupCaption);
                } else {
                    var oldCaption = groupCaptions.get(splitInfo.group);
                    if (!oldCaption) {
                        groupCaptions.put(splitInfo.group, "Caption");
                    }
                }
            } else {
                components.push(component);
            }
        } else {
            logit("Could not create a component for data type " + info.dataType + "<br />");
        }
    }
    for (var i=0; i<components.length; i++) {
        this.addChild(components[i]);
    }

    splitComponents.each(function(splitType, groupMap) {
        //    logit("group map: " + groupMap);
        var splitComponent = this.createSplitComponent(this.object, groupMap, groupCaptions, splitType);
        this.addChild(splitComponent);
    }, this);

};


function GuiPropertyComponent(object, propertyInfo) {
    JQueryComponent.call(this);
    this.object = object;
    this.propertyInfo = propertyInfo;
    this.otherCssClasses.push("ui-widget");
    this.otherCssClasses.push("gui-property-component");
    this.changeListeners = [];
    this.hasValueTypeRadios = true;

    this.$valueType = null;

    if (this.propertyInfo) {
        var componentRegisters = this.propertyInfo.componentRegisters;
        if (componentRegisters) {
            for (var j=0; j<componentRegisters.length; j++) {
                componentRegisters[j].registerComponent(this, this.propertyInfo);
            }
        }
    }
    this._constructorName = "GuiPropertyComponent";
}

GuiPropertyComponent.prototype = new JQueryComponent();


GuiPropertyComponent.prototype.callChangeListeners = function() {
    var that = this;
    for (var i=0; i<that.changeListeners.length; i++) {
        that.changeListeners[i](that, that.object, that.object);
    }
};

GuiPropertyComponent.prototype.resetAlignment = function() {
};


GuiPropertyComponent.prototype.componentRemoved = function() {
    for (var i=0; i<this.children.length; i++) {
        var c = this.children[i];
        if (c.componentRemoved) {
            c.componentRemoved();
        }
    }
    if (this.propertyInfo) {
        var componentRegisters = this.propertyInfo.componentRegisters;
        if (componentRegisters) {
            for (var j=0; j<componentRegisters.length; j++) {
                componentRegisters[j].unregisterComponent(this, this.propertyInfo);
            }
        }
    }
};

GuiPropertyComponent.prototype.cleanAfterDelete = function(value) {
    if ((typeof(value) === 'object') && this.propertyInfo.propertyInfoProvider) {
//        removeUniqueIds(value, this.propertyInfo.propertyInfoProvider, this.propertyInfo);
//        removeUniqueIdReferenceListener(value, this.propertyInfo.propertyInfoProvider, this.propertyInfo);
    }
};



GuiPropertyComponent.prototype.createNewValue = function(constrInfo, parentPropInfo) {
    var newValue = null;
    if (constrInfo.nameIsConstructor) {
        newValue = eval("new " + constrInfo.name + "();");

        if (typeof(newValue) === 'object') {
//            var uiInfo = this.propertyInfo.uniqueIdInfo;
//            newValue.id = uiInfo.manager.getNextUniqueId(uiInfo.namespace, uiInfo.initPrefix);
//            if (uiInfo.manager.uniqueIdAvailable(null, uiInfo.namespace, newValue.id)) {
//                uiInfo.manager.addUniqueId(newValue, uiInfo.namespace, newValue.id);
//            }
//            addIdReferenceListenersRecursively(newValue, this.propertyInfo.propertyInfoProvider, parentPropInfo);
        }
    } else {
        newValue = constrInfo.createValue();
        //        logit("Created value " + newValue + "<br />");
    }
    return newValue;
};


GuiPropertyComponent.prototype.getConstructorsHtml = function(resultArr, constructorInfos, newMode) {
    if (newMode == GuiNewMode.BUTTONS) {
        for (var i=0; i<constructorInfos.length; i++) {
            var constrInfo = constructorInfos[i];
            resultArr.push("<button ");
            resultArr.push("id='" + (this.newButtonIdPrefix + "-" + i) + "' ");
            resultArr.push(">");
            resultArr.push(constrInfo.text);
            resultArr.push("</button>\n");
        }
    } else {
        logit("select new not supported yet...");
        for (var i=0; i<constructorInfos.length; i++) {
            var constrInfo = constructorInfos[i];
        }
    }
};


GuiPropertyComponent.prototype.addConstructorClickListeners = function(constructorInfos, func, newMode) {
    var comp = this;
    if (newMode == GuiNewMode.BUTTONS) {
        $.each(constructorInfos, function(i, constrInfo) {
            var $button = comp.$component.find("#" + comp.newButtonIdPrefix + "-" + i);
            var buttonOptions = {};
            buttonOptions.label = constrInfo.text;
            buttonOptions.text = true; // comp.listInfo.constructorInfos.length > 1;
            buttonOptions.icons = {};
            buttonOptions.icons["primary"] = "ui-icon-plus";

            $button.button(buttonOptions);
            $button.on("click", function() {
                func(constrInfo);
            });
        });
    }
};



GuiPropertyComponent.prototype.gatherAlignmentInfo = function(info) {
};

GuiPropertyComponent.prototype.setAlignment = function(info) {
};

GuiPropertyComponent.prototype.alignComponents = function() {
};

GuiPropertyComponent.prototype.getValue = function() {
    var value = this.object[this.propertyInfo.propertyName];
    if (typeof value === 'undefined') {
        logit("property was undefined " + this.propertyInfo.propertyName + " in " + this.object._constructorName + "<br />");
        value = this.propertyInfo.defaultValue;
    }
    if (!this.propertyInfo.allowNull && value == null) {
        logit("property was null " + this.propertyInfo.propertyName + " in " + this.object._constructorName + "<br />");
        value = this.propertyInfo.defaultValue;
    }

    // Check if the value is a function... then assume it is a getter function

    return value;
};

GuiPropertyComponent.prototype.getExpressionPropertyName = function() {
    return this.propertyInfo.propertyName + "Expression";
};

GuiPropertyComponent.prototype.getUseExpressionPropertyName = function() {
    return this.propertyInfo.propertyName + "UseExpression";
};


GuiPropertyComponent.prototype.getValueExpression = function() {
    var propName = this.getExpressionPropertyName();
    var expression = this.object[propName];
    if (!expression) {
        // Has no expression
        return "";
    }
    return expression;
};



GuiPropertyComponent.prototype.getUniqueIdManager = function() {
    var uniqueIdInfo = this.propertyInfo.uniqueIdInfo;
    if (uniqueIdInfo) {
        if (uniqueIdInfo.manager) {
            return uniqueIdInfo.manager;
        }else {
            logit("No uniquIdManager found in GuiPropertiesComponent<br />");
        }
    } else {
        logit("No uniquIdInfo found in GuiPropertiesComponent<br />");
    }
    return null;
};

GuiPropertyComponent.prototype.getUniqueIdNamespace = function() {
    var uniqueIdInfo = this.propertyInfo.uniqueIdInfo;
    if (uniqueIdInfo) {
        if (uniqueIdInfo.namespace) {
            return uniqueIdInfo.namespace;
        } else {
            logit("No namespace found in GuiPropertiesComponent<br />");
        }
    } else {
        logit("No namespace found in GuiPropertiesComponent<br />");
    }
    return null;
};



GuiPropertyComponent.prototype.verifyNumberConstraints = function(newValue) {

    var wasError = false;
    var errorText = "";

    for (var i=0; i<this.propertyInfo.constraints.length; i++) {
        var c = this.propertyInfo.constraints[i];
        if (c.getMinValue) {
            var minValue = c.getMinValue();
            if (newValue < minValue) {
                wasError = true;
                errorText = "Must be greater than or equal " + minValue;
            }
        }
        if (c.getMaxValue) {
            var maxValue = c.getMaxValue();
            if (newValue > maxValue) {
                wasError = true;
                errorText = "Must be less than or equal " + maxValue;
            }
        }
    }
    this.setError(wasError, errorText);
    return wasError;
};

// The newValue is assumed to be of the correct type
// It is the subclass that is responsible for converting the value
GuiPropertyComponent.prototype.setValueVerify = function(newValue) {
    var oldValue = this.getValue();

    var wasValid = true;

    if (oldValue != newValue) {

        var errorText = "";
        if (this.propertyInfo.possibleValues && this.propertyInfo.possibleValues.length > 0) {
            if (!arrayContains(this.propertyInfo.possibleValues, newValue)) {
                wasValid = false;
                errorText = "Must be one of: " + this.propertyInfo.possibleValues.join(", ");
            }
        }
        if (wasValid && this.propertyInfo.constraints) {
            for (var i=0; i<this.propertyInfo.constraints.length; i++) {
                var c = this.propertyInfo.constraints[i];
                if (c.isValid && !c.isValid(this.object, this.propertyInfo.propertyName, newValue)) {
                    var desc = c.getInvalidDescription(this.object, this.propertyInfo.propertyName, newValue);
                    errorText = desc;
                    wasValid = false;
                    break;
                }
                if (c.getPossibleValues) {
                    var possibleValues = c.getPossibleValues();
                    if (!arrayContains(possibleValues, newValue)) {
                        wasValid = false;
                        errorText = "Must be one of: " + possibleValues.join(", ");
                        break;
                    }
                }
            }
        }
        if (wasValid) {
            this.setError(false, "");
            // Todo: check if this.object[this.propertyInfo.propertyName] is a function.
            // Then it is treated as a setter function
            this.object[this.propertyInfo.propertyName] = newValue;
            for (var i=0; i<this.changeListeners.length; i++) {
                this.changeListeners[i](this, oldValue, newValue);
            }
        } else {
            this.setError(true, errorText);
        }
    } else {
        this.setError(false, "");
    }
    return wasValid;
};

GuiPropertyComponent.prototype.setError = function(e, text) {
};


GuiPropertyComponent.prototype.setupExpressionInput = function(wantedWidth) {
    this.$expressionInput = this.$component.find("#" + this.id + "-expression-input");
    this.$expressionInput.css("width", wantedWidth + "px");
    var valueExpression = this.getValueExpression();
    this.$expressionInput.val(valueExpression);
    var useExpression = !!this.object[this.getUseExpressionPropertyName()];
    if (useExpression) {
        this.$input.hide();
    } else {
        this.$expressionInput.hide();
    }

    var comp = this;
    this.$expressionInput.on("keydown keypress keyup change", function() {
        // var newValue = comp.$expressionInput.val();
        // logit("Setting expression to " + newValue + "<br />");
        comp.object[comp.getExpressionPropertyName()] = comp.$expressionInput.val();
    });
    // A hack to make right click pasting work...
    this.$expressionInput.on("paste", function() {
        setTimeout(function() {
            comp.object[comp.getExpressionPropertyName()] = comp.$expressionInput.val();
        }, 100);
    });

};


GuiPropertyComponent.prototype.createValueTypeRadioButtons = function($localRoot) {
    if (!this.hasValueTypeRadios) {
        return;
    }
    var valueTypeId = this.id + "-value-type";

    this.$valueType = this.$component.find("#" + valueTypeId);

    this.$valueType.buttonset();

    var valueRadioId = this.id + "-value-radio";
    var expressionRadioId = this.id + "-expression-radio";
    var $valueRadio = this.$component.find("#" + valueRadioId);
    var $expressionRadio = this.$component.find("#" + expressionRadioId);

    var comp = this;
    $valueRadio.click(function() {
        if (comp.$expressionInput) {
            comp.$input.show();
            comp.$expressionInput.hide();
            comp.object[comp.getUseExpressionPropertyName()] = false;
        }
    });
    $expressionRadio.click(function() {
        if (comp.$expressionInput) {
            comp.$input.hide();
            comp.$expressionInput.show();
            comp.object[comp.getUseExpressionPropertyName()] = true;
        }
    });

};

GuiPropertyComponent.prototype.getValueTypeButtonsHtml = function(resultArr) {
    if (!this.hasValueTypeRadios) {
        return;
    }
    var useExpression = !!this.object[this.getUseExpressionPropertyName()];

    var radioClass = "value-type-radio";
    var radiosClass = "value-type-radios";
    var valueTypeId = this.id + "-value-type";
    var radioName = valueTypeId + "-radio-name";
    var valueRadioId = this.id + "-value-radio";
    var expressionRadioId = this.id + "-expression-radio";
    resultArr.push("<span ");
    resultArr.push("id=\"" + valueTypeId + "\" ");
    resultArr.push("class=\"" + radiosClass + "\" ");
    resultArr.push(">")
    resultArr.push("<input type=\"radio\" name=\"" + radioName + "\" ");
    resultArr.push("id=\"" + valueRadioId + "\" ");
    resultArr.push("class=\"" + radioClass + "\" ");
    if (!useExpression) {
        resultArr.push("checked=\"checked\" ");
    }
    resultArr.push("/>");
    resultArr.push("<label ");
    resultArr.push("for=\"" + valueRadioId + "\" ");
    resultArr.push(">V</label>");
    resultArr.push("<input type=\"radio\" name=\"" + radioName + "\" ");
    resultArr.push("id=\"" + expressionRadioId + "\" ");
    resultArr.push("class=\"" + radioClass + "\" ");
    if (useExpression) {
        resultArr.push("checked=\"checked\" ");
    }
    resultArr.push("/>");
    resultArr.push("<label ");
    resultArr.push("for=\"" + expressionRadioId + "\" ");
    resultArr.push(">E</label>");

    resultArr.push("</span>");
};


function GuiPropertyTextComponent(object, propertyInfo) {
    GuiPropertyComponent.call(this, object, propertyInfo);
//    this.tagName = "tr";

    this.$input = null;
    this.$label = null;
    this.$errorLabel = null;
    this.inputTag = "input";
    this.setUniqueId();
    this._constructorName = "GuiPropertyTextComponent";
}

GuiPropertyTextComponent.prototype = new GuiPropertyComponent();


GuiPropertyTextComponent.prototype.gatherAlignmentInfo = function(info) {
    info.setVerticalOffset(0, this.$label.outerWidth());
    if (this.$valueType) {
        var valueTypeLeft = this.$valueType.position().left;
        // logit("vtl: " + valueTypeLeft + "<br />");
        info.setVerticalOffset(1, valueTypeLeft);
    }
};

GuiPropertyTextComponent.prototype.resetAlignment = function(info) {
    this.$label.css("padding-left", "0px");
    if (this.$valueType) {
        this.$valueType.css("padding-left", "0px");
    }
};

GuiPropertyTextComponent.prototype.setAlignment = function(info) {
    var labelWidth = this.$label.outerWidth();
    var labelOffset = info.getVerticalOffset(0);
    this.$label.css("padding-left", (labelOffset - labelWidth) + "px");

    if (this.$valueType) {
        var valueTypeLeft = this.$valueType.position().left;
        var maxValueTypeLeft = info.getVerticalOffset(1);
        var padding = Math.max(maxValueTypeLeft - valueTypeLeft + 5, 0);
        this.$valueType.css("padding-left", padding + "px");
    }

};





GuiPropertyTextComponent.prototype.getHtmlContentBeforeChildren = function(resultArr) {
    var inputId = this.id + "-input";
    var expressionInputId = this.id + "-expression-input";
    var labelId = this.id + "-label";
    var errorLabelId = this.id + "-error-label";
    resultArr.push("<span ");
    //    resultArr.push("for=\"" + inputId + "\" ");
    resultArr.push("id=\"" + labelId + "\" ");
    resultArr.push(">")
    resultArr.push(this.propertyInfo.propertyCaption + "</span>");
    resultArr.push("<" + this.inputTag + " ");
    resultArr.push("class=\"ui-corner-all\" ");
    resultArr.push("id=\"" + inputId + "\" ");
    if (this.propertyInfo.shortDescription) {
        resultArr.push("title=\"" + this.propertyInfo.shortDescription + "\" ");
    }
    resultArr.push(" />");
//    resultArr.push("<textarea ");
    // resultArr.push("class=\"ui-corner-all\" ");
//    resultArr.push("id=\"" + expressionInputId + "\" ");
//    resultArr.push(" />");
//    this.getValueTypeButtonsHtml(resultArr);
    resultArr.push("<label ");
    resultArr.push("id=\"" + errorLabelId + "\" ");
    resultArr.push("></label>");
};

GuiPropertyTextComponent.prototype.setError = function(e, text) {
    if (e) {
        this.$input.addClass("ui-state-error");
        //        this.$errorLabel.addClass("ui-state-error-text");
        this.$errorLabel.text(text);
    } else {
        this.$input.removeClass("ui-state-error");
        //        this.$errorLabel.removeClass("ui-state-error-text");
        this.$errorLabel.text("");
    }
};

GuiPropertyTextComponent.prototype.setValueVerifyRaw = function() {
    logit("GuiPropertyTextComponent must implement setValueVerifyRaw() <br />");
};

GuiPropertyTextComponent.prototype.valueToString = function(value) {
    return value;
};

GuiPropertyTextComponent.prototype.parseInteger = function(str, result) {
    result.error = false;
    var patt = /^[\-\+]?\d+$/g;
    if (!patt.test(str)) {
        result.error = true;
    }
    if (!result.error) {
        var intValue = parseInt(str);
        result.error = isNaN(intValue);
        result.value = intValue;
    }
};


GuiPropertyTextComponent.prototype.jQueryCreated = function($localRoot) {
    JQueryComponent.prototype.jQueryCreated.call(this, $localRoot);

//    this.createValueTypeRadioButtons($localRoot);

    var comp = this;

    this.$input = this.$component.find("#" + this.id + "-input");
    this.$label = this.$component.find("#" + this.id + "-label");
    this.$errorLabel = this.$component.find("#" + this.id + "-error-label");

    this.$errorLabel.css("padding-left", "0.7em");

    var currentLabelWidth = this.$label.width();

    //    if (currentLabelWidth < wantedLabelWidth) {
    //        this.$label.css("padding-left", (wantedLabelWidth - currentLabelWidth) + "px");
    //    }
    this.$label.css("padding-right", "0.7em");
    this.$input.css("width", "10em");

    var value = this.getValue();
    this.$input.val(this.valueToString(value));

//    this.setupExpressionInput(wantedInputWidth);

    //    setTimeout(function() {
    //    logit("label width: " + comp.$label.outerWidth() + " id: " + this.$label.get(0).id + "<br />");
    //    }, 1);

    var comp = this;
    this.$input.on("keydown keypress keyup change", function() {
        comp.setValueVerifyRaw();
    });
    // A hack to make right click pasting work...
    this.$input.on("paste", function() {
        setTimeout(function() {
            comp.setValueVerifyRaw();
        }, 100);
    });

//    this.$input.tooltip();

};


function GuiPropertySingleOptionComponent(object, propertyInfo) {
    GuiPropertyComponent.call(this, object, propertyInfo);
    this._constructorName = "GuiPropertySingleOptionComponent";
}

GuiPropertySingleOptionComponent.prototype = new GuiPropertyComponent();

GuiPropertySingleOptionComponent.prototype.getOptionHtml = function(resultArr, value, displayValue, optionIndex) {
};
GuiPropertySingleOptionComponent.prototype.addOption = function(value, displayValue) {
};


GuiPropertySingleOptionComponent.prototype.getValuesAndNamesHtml = function(resultArr, valuesAndNames) {
    for (var i=0; i<valuesAndNames.length; i++) {
        var valueName = valuesAndNames[i];
        var value = valueName[0];
        var displayValue = valueName[1];
        this.getOptionHtml(resultArr, value, displayValue, i);
    }
};


GuiPropertySingleOptionComponent.prototype.getValuesAndNames = function() {
    var result = [];
    for (var i=0; i<this.propertyInfo.possibleValues.length; i++) {
        var value = this.propertyInfo.possibleValues[i];
        var displayValue = value;
        if (this.propertyInfo.displayFunction) {
            displayValue = this.propertyInfo.displayFunction.call(this, this.object, this.propertyInfo.propertyName, value);
        }
        result.push([value, displayValue]);
    }
    return result;
};

GuiPropertySingleOptionComponent.prototype.setOptionsFromValuesAndNames = function(valuesAndNames) {
    this.$input.empty();
    for (var i=0; i<valuesAndNames.length; i++) {
        var valueName = valuesAndNames[i];
        var value = valueName[0];
        var displayValue = valueName[1];
        this.addOption(value, displayValue);
    }
};


function GuiPropertySelectComponent(object, propertyInfo) {
    GuiPropertySingleOptionComponent.call(this, object, propertyInfo);
    this.$input = null;
    this.$label = null;
    this.$errorLabel = null;
    this.setUniqueId();
    this._constructorName = "GuiPropertySelectComponent";
}

GuiPropertySelectComponent.prototype.componentRemoved = function() {
    GuiPropertyComponent.prototype.componentRemoved.call(this);
};

GuiPropertySelectComponent.prototype = new GuiPropertySingleOptionComponent();


GuiPropertySelectComponent.prototype.gatherAlignmentInfo = function(info) {
    info.setVerticalOffset(0, this.$label.outerWidth());
    if (this.$valueType) {
        info.setVerticalOffset(1, this.$valueType.position().left);
    }
};

GuiPropertySelectComponent.prototype.resetAlignment = function(info) {
    this.$label.css("padding-left", "0px");
    if (this.$valueType) {
        this.$valueType.css("padding-left", "0px");
    }
};


GuiPropertySelectComponent.prototype.setAlignment = function(info) {
    var labelWidth = this.$label.outerWidth();
    var labelOffset = info.getVerticalOffset(0);
    this.$label.css("padding-left", (labelOffset - labelWidth) + "px");

    if (this.$valueType) {
        var valueTypeLeft = this.$valueType.position().left;
        var maxValueTypeLeft = info.getVerticalOffset(1);
        var padding = Math.max(maxValueTypeLeft - valueTypeLeft + 5, 0);
        this.$valueType.css("padding-left", padding + "px");
    }
};


GuiPropertySelectComponent.prototype.getHtmlContentBeforeChildren = function(resultArr) {
    var inputId = this.id + "-input";
    var expressionInputId = this.id + "-expression-input";
    var labelId = this.id + "-label";
    var errorLabelId = this.id + "-error-label";
    resultArr.push("<label ");
    resultArr.push("for=\"" + inputId + "\" ");
    resultArr.push("id=\"" + labelId + "\" ");
    resultArr.push(">")
    resultArr.push(this.propertyInfo.propertyCaption + "</label>");
    resultArr.push("<select ");
    resultArr.push("class=\"ui-corner-all\" ");
    if (this.propertyInfo.shortDescription) {
        resultArr.push("title=\"" + this.propertyInfo.shortDescription + "\" ");
    }
    resultArr.push("id=\"" + inputId + "\" ");
    resultArr.push(">");
    var valuesAndNames = this.getValuesAndNames();
    this.getValuesAndNamesHtml(resultArr, valuesAndNames);

    resultArr.push("</select>");
//    resultArr.push("<textarea ");
    // resultArr.push("class=\"ui-corner-all\" ");
//    resultArr.push("id=\"" + expressionInputId + "\" ");
//    resultArr.push(" />");

//    this.getValueTypeButtonsHtml(resultArr);

    resultArr.push("<label ");
    resultArr.push("id=\"" + errorLabelId + "\" ");
    resultArr.push("></label>");
};

GuiPropertySelectComponent.prototype.getOptionHtml = function(resultArr, value, displayValue, optionIndex) {
    resultArr.push("<option ");
    resultArr.push("value=\"" + value + "\" ");
    resultArr.push("class=\"" + (this.id + "-option") + "\" ");
    resultArr.push(">");
    resultArr.push("" + displayValue);
    resultArr.push("</option>");
};

GuiPropertySelectComponent.prototype.setError = function(e, text) {
    if (e) {
        this.$input.addClass("ui-state-error");
        //        this.$errorLabel.addClass("ui-state-error-text");
        this.$errorLabel.text(text);
    } else {
        this.$input.removeClass("ui-state-error");
        //        this.$errorLabel.removeClass("ui-state-error-text");
        this.$errorLabel.text("");
    }
};


GuiPropertySelectComponent.prototype.removeOption = function(value, newValueIfCurrent) {
    var $theOption = this.$component.find("option").filter("[value=\"" + value + "\"]");
    //    logit("Removing " + $theOption + "<br />");
    var currentValue = this.$input.val();
    if (value == currentValue) {
        //        logit("Removing the currently selected option " + value + "<br />");
    }
    $theOption.remove();
    var newValue = this.$input.val();
    if (newValue != currentValue) {
        //        logit("value changed from " + currentValue + " to " + newValue + "<br />");
        this.setValueVerifyRaw();
    }
};

GuiPropertySelectComponent.prototype.changeOption = function(oldValue, newValue, newDisplayValue) {
    var $theOption = this.$component.find("option").filter("[value=\"" + oldValue + "\"]");
    $theOption.val(newValue);
    $theOption[0].innerHTML = newDisplayValue;
    this.setValueVerifyRaw();
};

GuiPropertySelectComponent.prototype.addOption = function(value, displayValue) {
    var resultArr = [];
    var optionCount = this.$component.find("option").size();
    this.getOptionHtml(resultArr, value, displayValue, optionCount - 1);
    var $newOption = $(resultArr.join(''));
    this.$input.append($newOption);
};


GuiPropertySelectComponent.prototype.setValueVerifyRaw = function() {
    logit("GuiPropertySelectComponent must implement setValueVerifyRaw() <br />");
};


GuiPropertySelectComponent.prototype.jQueryCreated = function($localRoot) {
    JQueryComponent.prototype.jQueryCreated.call(this, $localRoot);

//    this.createValueTypeRadioButtons($localRoot);

    this.$input = this.$component.find("#" + this.id + "-input");
    this.$label = this.$component.find("#" + this.id + "-label");
    this.$errorLabel = this.$component.find("#" + this.id + "-error-label");
    this.$errorLabel.css("padding-left", "0.7em");

    //    var wantedLabelWidth = 250;
    var wantedLabelPaddingRight = 10;

    //    var currentLabelWidth = this.$label.width();

    //    if (currentLabelWidth < wantedLabelWidth) {
    //        this.$label.css("padding-left", (wantedLabelWidth - currentLabelWidth) + "px");
    //    }
    this.$label.css("padding-right", "0.7em");
    this.$input.css("width", "13em");

    //    logit("label outerwidth: " + this.$label.outerWidth() + "<br />");

    var value = this.getValue();

    //    logit(" setting value to " + value + "<br />");
    this.$input.val("" + value);

    var comp = this;
    this.$input.on("change", function() {
        comp.setValueVerifyRaw();
        //        logit("changed to " + comp.$input.prop("value"));
    });

//    this.$input.tooltip();

//    this.setupExpressionInput(wantedInputWidth);
};





function GuiPropertyRadioButtonsComponent(object, propertyInfo) {
    GuiPropertySingleOptionComponent.call(this, object, propertyInfo);
    this.$input = null;
    this.$label = null;
    this.$errorLabel = null;
    this.setUniqueId();
    this._constructorName = "GuiPropertyRadioButtonsComponent";
}

GuiPropertyRadioButtonsComponent.prototype = new GuiPropertySingleOptionComponent();


GuiPropertyRadioButtonsComponent.prototype.getHtmlContentBeforeChildren = function(resultArr) {
    var valuesAndNames = this.getValuesAndNames();
    this.getValuesAndNamesHtml(resultArr, valuesAndNames);
};

GuiPropertyRadioButtonsComponent.prototype.getOptionHtml = function(resultArr, value, displayValue, optionIndex) {
    //    <input type="radio" id="radio1" name="radio" /><label for="radio1">Choice 1</label>

    var radioId = this.id + "-radio-" + optionIndex;
    var labelId = this.id + "-label-" + optionIndex;
    resultArr.push("<input ");
    resultArr.push("type=\"radio\" ");
    resultArr.push("name=\"radio\" ");
    resultArr.push("id=\"" + radioId + "\" ");
    resultArr.push("class=\"radiobutton\" ");
    resultArr.push("/>");
    resultArr.push("<label ");
    resultArr.push("for=\"" + radioId + "\" ");
    resultArr.push("class=\"radiobutton-label\" ");
    resultArr.push("id=\"" + labelId + "\" ");
    resultArr.push(">")
    resultArr.push("" + displayValue);
    resultArr.push("</label>")
};



GuiPropertyRadioButtonsComponent.prototype.removeOption = function(value, newValueIfCurrent) {
    var $theOption = this.$component.find("button").filter(function(index) {
        var optionValue = $(this).data("optionValue");
        return value == optionValue;
    });

    var currentValue = this.$input.val();
    if (value == currentValue) {
        //        logit("Removing the currently selected option " + value + "<br />");
    }
    $theOption.remove();
    var newValue = this.$input.val();
    if (newValue != currentValue) {
        //        logit("value changed from " + currentValue + " to " + newValue + "<br />");
        this.setValueVerifyRaw();
    }
};

GuiPropertyRadioButtonsComponent.prototype.changeOption = function(oldValue, newValue, newDisplayValue) {
    var $button = this.$component.find("button").filter(function(index) {
        var optionValue = $(this).data("optionValue");
        return oldValue == optionValue;
    });
    $button.data("optionData", newValue);

    $button[0].innerHTML = newDisplayValue;
    this.setValueVerifyRaw();
};

GuiPropertyRadioButtonsComponent.prototype.addOption = function(value, displayValue) {
    var resultArr = [];
    this.getOptionHtml(resultArr, value, displayValue);
    var $newOption = $(resultArr.join(''));
    $newOption.data("optionValue", value);
    this.$input.append($newOption);
};


GuiPropertyRadioButtonsComponent.prototype.setValueVerifyRaw = function() {
    logit("GuiPropertySelectComponent must implement setValueVerifyRaw() <br />");
};


GuiPropertyRadioButtonsComponent.prototype.jQueryCreated = function($localRoot) {
    JQueryComponent.prototype.jQueryCreated.call(this, $localRoot);

    var buttonArr = this.$component.find("button").filter(".radiobutton").get();
    var labelArr = this.$component.find("label").filter(".radiobutton-label").get();

    if (buttonArr.length != labelArr.length) {
        logit("Buttons not equal count to labels in GuiPropertyRadioButtonsComponent<br/>");
    }
    var valuesAndNames = this.getValuesAndNames();
    for (var i=0; i<buttonArr.length; i++) {
        var button = buttonArr[i];
        var label = labelArr[i];
        var value = valuesAndNames[i][0];
        $(button).data("optionValue", value);
        $(label).data("optionValue", value);
    }

    this.$component.buttonset();

    this.$label = this.$component.find("#" + this.id + "-label");

    var wantedLabelWidth = 250;
    var wantedLabelPaddingRight = 10;

    var currentLabelWidth = this.$label.width();

    if (currentLabelWidth < wantedLabelWidth) {
        this.$label.css("padding-left", Math.round((wantedLabelWidth - currentLabelWidth) / 15.0) + "em");
    }
    this.$label.css("padding-right", "0.7em");


//    var comp = this;
//    this.$input.on("change", function() {
//        comp.setValueVerifyRaw();
//    //        logit("changed to " + comp.$input.prop("value"));
//    });
};


function GuiAbstractListComponent(object, propertyInfo) {
    GuiPropertyComponent.call(this, object, propertyInfo);

    if (propertyInfo) {
        this.listInfo = propertyInfo.listInfo;
    }
    this.$deleteButton = null;
    this.$list = null;
    this.listItemCounter = 1;
    this.listItemClass = "object-list-item";
    this.listClass = "object-list";

    // These use keys from the generated IDs from listItemCounter and maps to <li> DOM-elements
    this.selectedListItems = {};
    this.listItems = {};

    this._constructorName = "GuiAbstractListComponent";
}

GuiAbstractListComponent.prototype = new GuiPropertyComponent();




GuiAbstractListComponent.prototype.componentRemoved = function() {
    GuiPropertyComponent.prototype.componentRemoved.call(this);
};

GuiAbstractListComponent.prototype.getListItemContentHtml = function(valueItem, resultArr, itemIndex) {
    var listInfo = this.listInfo;

    if (listInfo.itemsDisplayFunction) {
        resultArr.push(listInfo.itemsDisplayFunction.call(this, valueItem));
    } else if (valueItem.id) {
        resultArr.push(valueItem.id);
    } else if (typeof(valueItem) === "object") {
        // Assign a unique ID
        var uiInfo = this.propertyInfo.uniqueIdInfo;
        if (uiInfo) {
            //            var newId = uiInfo.manager.getNextUniqueId(uiInfo.namespace, uiInfo.initPrefix);
            //            uiInfo.manager.addUniqueId(valueItem, uiInfo.namespace, newId);
            //            valueItem.id = newId;
            resultArr.push(valueItem.id);
        } else {
            logit("Cannot put objects in GuiAbstractListComponent without an id or a unique id manager");
        }
    } else {
        // Is just a plain stuff
        resultArr.push("" + valueItem);
    }
};



GuiAbstractListComponent.prototype.setIds = function() {
    this.listId = this.id + "-list";
    this.newButtonIdPrefix = this.id + "-new-button";
    this.copyButtonIdPrefix = this.id + "-copy-button";
    this.newSelectId = this.id + "-new-select";
    this.deleteButtonId = this.id + "-delete-button";
    this.copyButtonId = this.id + "-copy-button";
    this.detailsId = this.id + "-details";
};


GuiAbstractListComponent.prototype.getHtmlContentBeforeChildren = function(resultArr) {

    var listInfo = this.listInfo;

    // Getting the list
    var list = this.getValue();

    // Scroll list panel
    //    resultArr.push("<div ");
    //    resultArr.push("id=\"" + this.scrollPanelId + "\" ");
    //    resultArr.push("class='ui-widget-content' ");
    //    resultArr.push(">\n");

    resultArr.push("<span class='ui-widget' >" + this.propertyInfo.propertyCaption + "</span><br />");

    // List
    resultArr.push("<ul ");
    resultArr.push("id=\"" + this.listId + "\" ");
    resultArr.push("class='object-list' ");
    resultArr.push(">\n");

    for (var i=0; i<list.length; i++) {
        var value = list[i];
        this.getListItemHtml(value, resultArr, i);
    }

    resultArr.push("</ul>\n");

    // Add/delete panel
    resultArr.push("<div>\n");

    // New components
    this.getConstructorsHtml(resultArr, this.listInfo.constructorInfos, this.listInfo.newMode);

    // Delete button
    resultArr.push("<button ");
    resultArr.push("id=\"" + this.deleteButtonId + "\" ");
    resultArr.push(">");
    resultArr.push("</button>\n");

//    logit("Delete button id: " + this.deleteButtonId);

    // Copy button
    resultArr.push("<button ");
    resultArr.push("id=\"" + this.copyButtonId + "\" ");
    resultArr.push(">");
    resultArr.push("</button>\n");

    resultArr.push("</div>\n"); // End of add/delete panel

//    resultArr.push("</div>\n");

};


GuiAbstractListComponent.prototype.getListItemHtml = function(valueItem, resultArr, itemIndex) {
    var listInfo = this.listInfo;
    resultArr.push("<li ");
    resultArr.push("class='" + this.listItemClass + " ui-widget-content' ");
    resultArr.push("id='" + (this.id + "-item-" + this.listItemCounter) +  "' ");
    resultArr.push(">");
    resultArr.push("<div class='vertical-list-item-drag-handle' >")
    resultArr.push("<span class='ui-icon ui-icon-carat-2-n-s'></span>");
    resultArr.push("</div>");

    this.listItemCounter++;

    resultArr.push("<span class='object-list-item-content' >")
    this.getListItemContentHtml(valueItem, resultArr, itemIndex);
    resultArr.push("</span>");
    //    if (!valueItem.id) {
    //        logit("stuff that should be part of lists must have a unique ID")
    //    }
    resultArr.push("</li>\n");
};


GuiAbstractListComponent.prototype.jQueryCreated = function($localRoot) {
    GuiPropertyComponent.prototype.jQueryCreated.call(this, $localRoot);

    var comp = this;

    this.$details = this.$component.find("#" + this.detailsId);

    // Create the list
    this.$list = this.$component.find("#" + this.listId);

    var $listItems = this.$component.find(".object-list-item");
    var list = this.getValue();
    $listItems.each(function(index, element) {
        var valueItem = list[index];
        if (typeof(valueItem) === 'undefined') {
            logit("could not find value for index " + index + " in " + JSON.stringify(list) + " property: " + comp.propertyInfo.propertyName + "<br />");
        } else {
            var $element = $(element);
            $element.data("value", valueItem);
            comp.listItems[element.id] = element;
        }
    });

    this.$list.sortable({
        handle: ".vertical-list-item-drag-handle"
    });
    this.$list.on("sortstop", function(event, ui) {
        comp.itemSortStop(event, ui);
    });

    this.$list.selectable({
        selected: function(event, ui) {
            comp.listItemSelected(event, ui);
        },
        unselected: function(event, ui) {
            comp.listItemUnselected(event, ui);
        }
    });
//    this.$list.on( "selectableunselected", );


    this.addConstructorClickListeners(this.listInfo.constructorInfos, function(constrInfo) {
        comp.appendNewItem(constrInfo, comp.propertyInfo);
    }, this.listInfo.newMode);


    //    if (this.listInfo.newMode == GuiNewMode.BUTTONS) {
    //        $.each(this.listInfo.constructorInfos, function(i, constrInfo) {
    //            var $button = comp.$component.find("#" + this.newButtonIdPrefix + "-" + i);
    //            var buttonOptions = {};
    //            buttonOptions.label = constrInfo.text;
    //            buttonOptions.text = true; // comp.listInfo.constructorInfos.length > 1;
    //            buttonOptions.icons = {};
    //            buttonOptions.icons["primary"] = "ui-icon-plus";
    //
    //            $button.button(buttonOptions);
    //            $button.on("click", function() {
    //                comp.appendNewItem(constrInfo);
    //            });
    //        });
    //    }

    this.$deleteButton = this.$component.find("#" + this.deleteButtonId);
    var buttonOptions = {};
    buttonOptions.label = "Delete";
    buttonOptions.text = false;
    buttonOptions.icons = {};
    buttonOptions.icons["primary"] = "ui-icon-trash";

    this.$deleteButton.button(buttonOptions);
    this.$deleteButton.button("disable");
    this.$deleteButton.click(this, function() {
        comp.deleteSelectedItems();
    });

    this.$copyButton = this.$component.find("#" + this.copyButtonId);
    var buttonOptions = {};
    buttonOptions.label = "Copy";
    buttonOptions.text = false;
    buttonOptions.icons = {};
    buttonOptions.icons["primary"] = "ui-icon-copy";

    this.$copyButton.button(buttonOptions);
    this.$copyButton.button("disable");
    this.$copyButton.click(this, function() {
        comp.copySelectedItems();
    });

};

GuiAbstractListComponent.prototype.itemAppended = function($newItem, newValue) {
};



GuiAbstractListComponent.prototype.appendNewValue = function(newValue) {
    var list = this.getValue();
    var resultArr = [];
    this.getListItemHtml(newValue, resultArr, list.length);
    var $newItem = $(resultArr.join(""));
    this.$list.append($newItem);

    $newItem.data("value", newValue);
    //    $newItem.val("" + newValue);
    this.listItems[$newItem.get(0).id] = $newItem.get(0);

    list.push(newValue);

    var comp = this;
    $newItem.on("change", function() {
        comp.setValueVerifyRaw();
    });

    this.itemAppended($newItem, newValue);
    this.callChangeListeners();
};


GuiAbstractListComponent.prototype.appendNewItem = function(constrInfo, parentPropInfo) {
    var newValue = this.createNewValue(constrInfo, parentPropInfo);
    this.appendNewValue(newValue);
};


GuiAbstractListComponent.prototype.clearSelection = function() {
    var items = this.getSelectedItems();
    for (var i=0; i<items.length; i++) {
        var item = items[i];
        delete this.selectedListItems[item.id];
    }
    this.selectedListItems = {};
    return this;
};


GuiAbstractListComponent.prototype.getSelectedItems = function() {
    var result = [];
    $.each(this.selectedListItems, function(key, value) {
        if (value.id) {
            result.push(value);
        } else {
            // I don't know why this happens sometimes...
        }
    });
    return result;
};


GuiAbstractListComponent.prototype.copySelectedItems = function() {
    var selectedItems = this.getSelectedItems();
    if (selectedItems.length > 0) {

        var list = this.getValue();

        var uiInfo = this.propertyInfo.uniqueIdInfo;

        for (var i=0; i<selectedItems.length; i++) {
            var item = selectedItems[i];
            //            logit("item " + i + ":" + item + " <br />");
            //            investigateObject(item);
            var $item = $(item);
            var valueItem = $item.data("value");

            //            logit("should copy item " + i + " <br />");

            var options = {
//                createUniqueIds: true,
//                propertyInfoProvider: this.propertyInfo.propertyInfoProvider
            };
            var copy = copyValueDeep(valueItem); // , options);

            this.appendNewValue(copy);

//            addIdReferenceListenersRecursively(copy, this.propertyInfo.propertyInfoProvider, this.propertyInfo);

        }
    }
};

GuiAbstractListComponent.prototype.deleteSelectedItems = function() {
    var selectedItems = this.getSelectedItems();
    if (selectedItems.length > 0) {

        var list = this.getValue();

        var uiInfo = this.propertyInfo.uniqueIdInfo;

        for (var i=0; i<selectedItems.length; i++) {
            var item = selectedItems[i];
            //            logit("item " + i + ":" + item + " <br />");
            //            investigateObject(item);
            var $item = $(item);
            var valueItem = $item.data("value");

            if (typeof(valueItem) != 'undefined') {
                $item.remove();
                arrayDelete(list, valueItem);

                this.cleanAfterDelete(valueItem);
            } else {
                logit("Can not find a value for item with index " + i + " and id " + item.id + "<br />");
                //                investigateArrayIds(list);
            }
        }
        this.clearSelection();
        this.$deleteButton.button("disable");
        this.callChangeListeners();
    }
};




GuiAbstractListComponent.prototype.listItemSelected = function(event, ui) {
    this.$deleteButton.button("enable");
    this.$copyButton.button("enable");
    this.selectedListItems[ui.selected.id] = ui.selected;

//    logit("Selected items:");
//    logit(this.selectedListItems);
};


GuiAbstractListComponent.prototype.listItemUnselected = function(event, ui) {
    delete this.selectedListItems[ui.unselected.id];

    if (this.getSelectedItems().length == 0) {
        this.$deleteButton.button("disable");
        this.$copyButton.button("disable");
    }
//    logit("Selected items:");
//    logit(this.selectedListItems);
};


GuiAbstractListComponent.prototype.itemSortStop = function(event, ui) {
    var newArr = [];

    var comp = this;

    this.$component.find(".object-list-item").each(function(index, value) {
        var $item = $(value);
        var valueItem = $item.data("value");
        newArr.push(valueItem);
    });

    var list = this.getValue();

    list.length = 0;
    addAll(list, newArr);

    this.callChangeListeners();

};


// A list that contains select components that can be modified
function GuiPropertySelectListComponent(object, propertyInfo) {
    GuiAbstractListComponent.call(this, object, propertyInfo);
    this.cssClassName = "object-list-panel";
    this.otherCssClasses.push("ui-widget-content");
    this.setUniqueId();

    this.setIds();

    this._constructorName = "GuiPropertySelectListComponent";
}

GuiPropertySelectListComponent.prototype = new GuiAbstractListComponent();

GuiPropertySelectListComponent.prototype.getValueItemId = function(itemIndex, optionIndex) {
    return this.id + "-option-" + itemIndex + "-" + optionIndex;
};

GuiPropertySelectListComponent.prototype.getOptionHtml = function(resultArr, value, displayValue, itemIndex, optionIndex) {
    resultArr.push("<option ");
    resultArr.push("value='" + value + "' ");
    resultArr.push("class='" + (this.id + "-option") + "' ");
    resultArr.push("id='" + this.getValueItemId(itemIndex, optionIndex) + "' ");
    resultArr.push(">");
    resultArr.push("" + displayValue);
    resultArr.push("</option>");
};


GuiPropertySelectListComponent.prototype.getValuesAndNamesHtml = function(resultArr, valuesAndNames, itemIndex) {
    for (var i=0; i<valuesAndNames.length; i++) {
        var valueName = valuesAndNames[i];
        var value = valueName[0];
        var displayValue = valueName[1];
        this.getOptionHtml(resultArr, value, displayValue, itemIndex, i);
    }
};


GuiPropertySelectListComponent.prototype.getValuesAndNames = function() {
    var result = [];
    for (var i=0; i<this.propertyInfo.listInfo.possibleValues.length; i++) {
        var value = this.propertyInfo.listInfo.possibleValues[i];
        var displayValue = value;

        var resultArr = [];
        GuiAbstractListComponent.prototype.getListItemContentHtml.call(this, value, resultArr);
        displayValue = resultArr.join("");
        result.push([value, displayValue]);
    }
    return result;
};


GuiPropertySelectListComponent.prototype.getListItemContentHtml = function(valueItem, resultArr, itemIndex) {
    var theId = this.id + "-select-" + itemIndex;
    resultArr.push("<select ");
    resultArr.push("class='" + this.id + "-select" + "' ");
    resultArr.push("id='" + theId + "' ");
    resultArr.push(">");
    var valuesAndNames = this.getValuesAndNames();
    this.getValuesAndNamesHtml(resultArr, valuesAndNames, itemIndex);
    resultArr.push("</select>");

//    logit("the id was " + theId + "<br />");
};



GuiPropertySelectListComponent.prototype.jQueryCreated = function($localRoot) {
    GuiAbstractListComponent.prototype.jQueryCreated.call(this, $localRoot);

    var list = this.getValue();

    var comp = this;

    for (var i=0; i<list.length; i++) {
        var $item = this.$component.find("#" + this.id + "-select-" + i);
        $item.val("" + list[i]);
        //        logit("Setting vlaue to " + list[i] + " " + $item.size() + "<br />");
        $item.on("change", function() {
            comp.setValueVerifyRaw(i);
        });
    }
};

GuiPropertySelectListComponent.prototype.getItemValue = function(itemString) {
    return itemString;
};


GuiPropertySelectListComponent.prototype.setValueVerifyRaw = function($localRoot) {
    var list = this.getValue();

    var comp = this;

    var $listItems = this.$component.find(".object-list-item");
    var $selectItems = this.$component.find("." + this.id + "-select");
    $listItems.each(function(index, element) {
        var $selectItem = $($selectItems.get(index));
        var itemString = $selectItem.val();
        list[index] = comp.getItemValue(itemString);
        $(element).data("value", list[index]);
    });

    this.callChangeListeners();
    this.setValueVerify(list);
};



GuiPropertySelectListComponent.prototype.itemAppended = function($newItem, newValue) {
//    logit(this._constructorName + " New value: " + JSON.stringify(newValue));
    $newItem.find("select").val("" + newValue);
};


GuiPropertySelectListComponent.prototype.removeOption = function(value, newValueIfCurrent) {
    var $theOption = this.$component.find("option").filter("[value=\"" + value + "\"]");
    $theOption.remove();
    this.setValueVerifyRaw();
};

GuiPropertySelectListComponent.prototype.changeOption = function(oldValue, newValue, newDisplayValue) {
    var $theOptions = this.$component.find("option").filter("[value=\"" + oldValue + "\"]");

    // logit("Changing options " + $theOptions.size() + "<br />");
    $theOptions.each(function(index, element) {
        element.innerHTML = newDisplayValue;
        var $theOption = $(element);
        $theOption.val(newValue);
    });
    this.setValueVerifyRaw();
};

GuiPropertySelectListComponent.prototype.addOption = function(value, displayValue) {

    var $selectItems = this.$component.find("." + this.id + "-select");

    var comp = this;
    $selectItems.each(function(index, element) {
        var resultArr = [];
        var $selectItem = $(element);
        var optionCount = $selectItem.find("option").size();
        comp.getOptionHtml(resultArr, value, displayValue, optionCount - 1);
        var $newOption = $(resultArr.join(''));
        $selectItem.append($newOption);
    });

};





function GuiPropertySliderComponent(object, propertyInfo) {
    GuiPropertyComponent.call(this, object, propertyInfo);
    this.$input = null;
    this.$label = null;
    this.inputTag = "span";
    this.setUniqueId();
    this._constructorName = "GuiPropertySliderComponent";
}

GuiPropertySliderComponent.prototype = new GuiPropertyComponent();


GuiPropertySliderComponent.prototype.gatherAlignmentInfo = function(info) {
    info.setVerticalOffset(0, this.$label.outerWidth());
};

GuiPropertySliderComponent.prototype.setAlignment = function(info) {
    var labelWidth = this.$label.outerWidth();
    var labelOffset = info.getVerticalOffset(0);
    this.$label.css("padding-left", (labelOffset - labelWidth) + "px");
};


GuiPropertySliderComponent.prototype.resetAlignment = function() {
    this.$label.css("padding-left", "0px");
//    if (this.$valueType) {
//        this.$valueType.css("padding-left", "0px");
//    }
};



GuiPropertySliderComponent.prototype.getHtmlContentBeforeChildren = function(resultArr) {
    var inputId = this.id + "-input";
    var labelId = this.id + "-label";
    resultArr.push("<span ");
    //    resultArr.push("for=\"" + inputId + "\" ");
    resultArr.push("id=\"" + labelId + "\" ");
    resultArr.push(">")
    resultArr.push(this.propertyInfo.propertyCaption + "</span>");
    resultArr.push("<" + this.inputTag + " ");
//    resultArr.push("class=\"ui-corner-all\" ");
    resultArr.push("id=\"" + inputId + "\" ");
    resultArr.push(" />");
};

GuiPropertySliderComponent.prototype.setError = function(e, text) {
    logit("Error not implemented in GuiPropertySliderComponent");
};

GuiPropertySliderComponent.prototype.setValueVerifyRaw = function() {
    logit("GuiPropertySliderComponent must implement setValueVerifyRaw() <br />");
};


GuiPropertySliderComponent.prototype.jQueryCreated = function($localRoot) {
    JQueryComponent.prototype.jQueryCreated.call(this, $localRoot);

//    this.createValueTypeRadioButtons($localRoot);

    var comp = this;

    this.$input = this.$component.find("#" + this.id + "-input");
    this.$label = this.$component.find("#" + this.id + "-label");

    var wantedLabelPaddingRight = 10;

    var value = this.getValue();

    this.$input.slider({
        value: value,
        slide: function( event, ui ) {
            comp.setValueVerifyRaw();
        }
    });

    this.$label.css("padding-right", "0.7em");
    this.$input.css("width", "13em");

    var comp = this;

//    this.$input.on("keydown keypress keyup change", function() {
//        comp.setValueVerifyRaw();
//    });

};
