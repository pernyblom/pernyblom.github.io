

function AbstractSettings(options) {
    this.storagePrefix = getValueOrDefault(options, "storagePrefix", "");
    this.dirty = false;
}
AbstractSettings.prototype.getStoragePropertyName = function() {
    return this.storagePrefix + this._constructorName;
};


AbstractSettings.prototype.loadFromLocalStorage = function() {

    try {
        var lsPropName = this.getStoragePropertyName();
        var jsonObj = JSON.parse(localStorage.getItem(lsPropName));

        if (jsonObj) {
            for (var prop in this) {
                var value = jsonObj[prop];
                if (typeof(value) != 'undefined') {
                    this[prop] = value;
                }
            }
        }
    } catch (exc) {
        // Just silently ignore this
        logit("Error when loading from local storage " + this._constructorName);
    }
};

AbstractSettings.prototype.saveToLocalStorage = function() {
    try {
        var toStore = {};
        for (var prop in this) {
            var value = this[prop];
            if (!isFunction(value)) {
                toStore[prop] = value;
            }
        }
        var lsPropName = this.getStoragePropertyName();
        localStorage.setItem(lsPropName, JSON.stringify(toStore));
    } catch (exc) {
        // Silently ignore
        logit("Error when saving to local storage " + this._constructorName);
    }
};



function RenderSettings() {
    AbstractSettings.call(this);
    this.context2DFps = 30;
    this.webGLFps = 30;

    this.forceContext2D = false;

    this._constructorName = "RenderSettings";
}
RenderSettings.prototype = new AbstractSettings();
