

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


var Quality = {
    VERY_LOW: 0,
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    VERY_HIGH: 4,

    toString: function(t) {
        switch (t) {
            case Quality.HIGH:
                return "High";
            case Quality.LOW:
                return "Low";
            case Quality.MEDIUM:
                return "Medium";
            case Quality.VERY_HIGH:
                return "Very High";
            case Quality.VERY_LOW:
                return "Very Low";
        }
        return "Unknown " + t;
    }
}
addPossibleValuesFunction(Quality, Quality.VERY_LOW, Quality.VERY_HIGH);

function RenderSettings() {
    AbstractSettings.call(this);

    this.forceContext2D = false;
    this.addBloom = true;
    this.addVignette = true;
    this.addSimulatedAA = true;
    this.enableShadowMap = true;

    this.lightQuality = Quality.VERY_HIGH;
    this.materialQuality = Quality.VERY_HIGH;
    this.geometryQuality = Quality.VERY_HIGH;

    this._constructorName = "RenderSettings";
}
RenderSettings.prototype = new AbstractSettings();


function SoundSettings() {
    AbstractSettings.call(this);

    this.sfxs = true;
    this.music = true;

    this._constructorName = "SoundSettings";
}
SoundSettings.prototype = new AbstractSettings();



var PlayerCount = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,

    toString: function(t) {
        switch (t) {
            case PlayerCount.FOUR:
                return "Four";
            case PlayerCount.ONE:
                return "One";
            case PlayerCount.THREE:
                return "Three";
            case PlayerCount.TWO:
                return "Two";
        }
        return "Unknown " + t;
    }
}
addPossibleValuesFunction(PlayerCount, PlayerCount.ONE, PlayerCount.FOUR);


function GameSettings() {
    AbstractSettings.call(this);

    this.playerCount = PlayerCount.ONE;

    this._constructorName = "GameSettings";
}
GameSettings.prototype = new AbstractSettings();
