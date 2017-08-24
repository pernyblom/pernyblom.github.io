

function JQueryComponent() {
    this.$component = null;
    this.cssClassName = "component"; // Main class
    this.otherCssClasses = [];
    this.id = "";
    this.tagName = "div";
    this.children = [];
    this._constructorName = "JQueryComponent";
}

JQueryComponent.prototype.counters = {};

JQueryComponent.prototype.setUniqueId = function() {
    var counter = JQueryComponent.prototype.counters[this.cssClassName];
    if (!counter) {
        counter = 1;
    } else {
        counter++;
    }
    JQueryComponent.prototype.counters[this.cssClassName] = counter;
    this.id = this.cssClassName + "-" + counter;
};


JQueryComponent.prototype.hide = function() {
    this.$component.hide();
};

JQueryComponent.prototype.show = function() {
    this.$component.show();
};

JQueryComponent.prototype.addChild = function(c) {
    this.children.push(c);
};


JQueryComponent.prototype.addStartHtmlString = function(resultArr) {
    resultArr.push("<" + this.tagName + " " +
        "class=\"" + this.cssClassName + (this.otherCssClasses.length > 0 ? " " + this.otherCssClasses.join(" ") : "") + "\" " +
        (this.id ? "id=\"" + this.id + "\" " : "") +
        this.getTagAttributeString() +
        " >");
};

JQueryComponent.prototype.getTagAttributeString = function() {
    var result = "";
    var obj = {};
    this.getTagAttributes(obj);
    for (var atr in obj) {
        result += " " + atr + "=\"" + obj[atr] + " ";
    }
    return result;
};

JQueryComponent.prototype.getTagAttributes = function(obj) {
};

JQueryComponent.prototype.addEndHtmlString = function(resultArr) {
    resultArr.push("</" + this.tagName + ">");
};


JQueryComponent.prototype.spawn = function(parent) {
    var strings = [];
    this.createJQueryStrings(strings);
    var $item = $(strings.join(''));
    var $parentComponent = parent.$component;
    if (!$parentComponent) {
        $parentComponent = parent;
    }
    $parentComponent.append($item);
    this.jQueryCreated($parentComponent);
};

JQueryComponent.prototype.jQueryCreated = function($localRoot) {
    var selector = "." + this.cssClassName;
    if ($localRoot.is(selector)) {
        this.$component = $localRoot;
    } else {
        this.$component = $localRoot.find("." + this.cssClassName);
    }
    if (this.id) {
        this.$component = this.$component.filter("#" + this.id);
    }
    for (var i=0; i<this.children.length; i++) {
        this.children[i].jQueryCreated($localRoot);
    }
};

JQueryComponent.prototype.createJQueryStrings = function(resultArr) {
    this.addStartHtmlString(resultArr);
    this.getHtmlContentBeforeChildren(resultArr);
    for (var i=0; i<this.children.length; i++) {
        this.getHtmlContentBeforeChild(resultArr, i);
        this.children[i].createJQueryStrings(resultArr);
        this.getHtmlContentAfterChild(resultArr, i);
    }
    this.getHtmlContentAfterChildren(resultArr);
    this.addEndHtmlString(resultArr);
};

JQueryComponent.prototype.getHtmlContentBeforeChildren = function(resultArr) {
};

JQueryComponent.prototype.getHtmlContentAfterChildren = function(resultArr) {
};

JQueryComponent.prototype.getHtmlContentBeforeChild = function(resultArr, childIndex) {
};
JQueryComponent.prototype.getHtmlContentAfterChild = function(resultArr, childIndex) {
};


JQueryComponent.prototype.enable = function() {
};

JQueryComponent.prototype.disable = function() {
};

function JQueryButton(options) {
    JQueryComponent.call(this, options);
    this.tagName = "button";
    this.text = getValueOrDefault(options, "text", "");
    this.enableText = getValueOrDefault(options, "enableText", true);
    this.primaryIcon = getValueOrDefault(options, "primaryIcon", "");
    this.secondaryIcon = getValueOrDefault(options, "secondaryIcon", "");
    this.cssClassName = "jquery-button";
    this.setUniqueId();
    this.clickListeners = [];
    this._constructorName = "JQueryButton";
}

JQueryButton.prototype = new JQueryComponent();


JQueryButton.prototype.enable = function() {
    this.$component.button("enable");
};

JQueryButton.prototype.disable = function() {
    this.$component.button("disable");
};

JQueryButton.prototype.jQueryCreated = function($localRoot) {
    JQueryComponent.prototype.jQueryCreated.call(this, $localRoot);
    var buttonOptions = {};
    buttonOptions.text = this.enableText;
    if (this.primaryIcon || this.secondaryIcon) {
        buttonOptions.icons = {};
        if (this.primaryIcon) {
            buttonOptions.icons["primary"] = this.primaryIcon;
        }
        if (this.secondaryIcon) {
            buttonOptions.icons["secondary"] = this.secondaryIcon;
        }
    }
    this.$component.button(buttonOptions);
    this.$component.click(this, this.buttonClick);

//    logit("button " + this.$component.size() + " id: " + this.id);
};

JQueryButton.prototype.buttonClick = function(event) {
    var button = event.data;
    $.each(button.clickListeners, function(key, value) {
        //        logit("bc data " + value.data + "<br />");
        value.clicked(value.data);
    });
//    $.each(event, function(key, value) {
//        logit(" " + key + ":" + value + "<br />");
//    });
};

JQueryButton.prototype.addClickListener = function(l) {
    this.clickListeners.push(l);
    return this;
};

JQueryButton.prototype.getHtmlContentBeforeChildren = function(resultArr) {
    resultArr.push(this.text);
};


function JQueryPanel() {
    JQueryComponent.call(this);
    this._constructorName = "JQueryPanel";
}

JQueryPanel.prototype = new JQueryComponent();


function JQueryListItem() {
    JQueryPanel.call(this);
    this.cssClassName = "list-item";
    this.otherCssClasses.push("ui-widget-content");
    this.tagName = "li";
    this._constructorName = "JQueryListItem";
}

JQueryListItem.prototype = new JQueryPanel();

function JQueryVerticalListItemDragHandle() {
    JQueryComponent.call(this);
    this.iconClass = "ui-icon-carat-2-n-s";
    this.otherCssClasses.push("vertical-list-item-drag-handle");
    this._constructorName = "JQueryVerticalListItemDragHandle";
}

JQueryVerticalListItemDragHandle.prototype = new JQueryComponent();


JQueryVerticalListItemDragHandle.prototype.getHtmlContentBeforeChildren = function(resultArr) {
    resultArr.push("<span class='ui-icon " + this.iconClass + "'></span>");
};



