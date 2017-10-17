
function RenderData() {
    this.events = [];
}


RenderData.prototype.toNetJSON = function() {
    var resultArr = [];
    resultArr.push("{");

    var renderChannelIndices = {};
    var renderChannelNames = [];
    var controlChannelIndices = {};
    var controlChannelNames = [];
    for (var i=0; i<this.events.length; i++) {
        var e = this.events[i];
        if (e.renderChannel) {
            var index = renderChannelIndices[e.renderChannel.id];
            if (typeof(index) === 'undefined') {
                renderChannelIndices[e.renderChannel.id] = renderChannelNames.length;
                renderChannelNames.push(e.renderChannel.id);
            }
        }
        if (e.controlChannel) {
            var index = controlChannelIndices[e.controlChannel.id];
            if (typeof(index) === 'undefined') {
                controlChannelIndices[e.controlChannel.id] = controlChannelNames.length;
                controlChannelNames.push(e.controlChannel.id);
            }
        }
    }

    resultArr.push("\"renderChannelNames\": " + JSON.stringify(renderChannelNames) + ",");
    resultArr.push("\"controlChannelNames\": " + JSON.stringify(controlChannelNames) + ",");

    resultArr.push("\"events\": [");
    var resultArr2 = [];
    for (var i=0; i<this.events.length; i++) {
        resultArr2.push(this.events[i].toNetJSON(renderChannelIndices, controlChannelIndices));
    }
    resultArr.push(resultArr2.join(",\n"));
    resultArr.push("]}\n");
    return resultArr.join("");
};

RenderData.prototype.sort = function() {
    this.events.sort(function(a, b) {
        var diff = a.time - b.time;
        return diff;
    });
};



RenderData.prototype.addEvent = function(event) {
    this.events.push(event);
    return this;
};
RenderData.prototype.addEvents = function(events) {
    addAll(this.events, events);
    return this;
};

RenderData.prototype.getEvents = function() {
    return this.events;
};

RenderData.prototype.getNonOverlappingDatas = function() {
    var result = [];
    
    return result;
};


RenderData.prototype.getTimeLimits = function() {
    var minTime = this.events.length == 0 ? 0 : 99999999;
    var maxTime = this.events.length == 0 ? 0 : -99999999;
    for (var i = 0; i<this.events.length; i++) {
        var e = this.events[i];
        var t = e.getTime();
        minTime = Math.min(minTime, t);
        maxTime = Math.max(maxTime, t);
    }
    return [minTime, maxTime];
};

RenderData.prototype.splitOnTime = function(time) {
    var before = new RenderData();
    var after = new RenderData();
		
    for (var i = 0; i<this.events.length; i++) {
        var e = this.events[i];
        if (e.getTime() >= time) {
            after.events.push(e);
        } else {
            before.events.push(e);
        }
    }
    var result = [before, after];
    return result;
};




function RenderEvent(time) {
    this.time = time;
}


RenderEvent.prototype.toNetJSON = function(renderChannelIndices, controlChannelIndices) {
    var resultArr = [];

    for (var prop in this.netJSONPropertiesMap) {
        var value = this[prop];
        var shortProp = this.netJSONPropertiesMap[prop];
        value = this.netJSONTransformProperty(prop, value, renderChannelIndices, controlChannelIndices);
        if (typeof(value) === 'string') {
            resultArr.push("\"" + shortProp + "\":\"" + value + "\"");
        } else {
            resultArr.push("\"" + shortProp + "\":" + value);
        }
    }

    return "{" + resultArr.join(",") + "}";
};

RenderEvent.prototype.netJSONTransformProperty = function(name, value, renderChannelIndices, controlChannelIndices) {
    if (name == "type") {
        return this.netJSONType;
    }
    return value;
};

RenderEvent.prototype.getTime = function() {
    return this.time;
};


function NoteOnEvent(note, time, onVelocity, renderChannel) {
    RenderEvent.call(this, time);
    this.type = "noteOn";
    this.note = note;
    this.onVelocity = onVelocity;
    this.renderChannel = renderChannel;
}

NoteOnEvent.prototype = new RenderEvent();


NoteOnEvent.prototype.netJSONPropertiesMap = {"time": "t", "type": "y", "note": "n", "onVelocity": "v", "renderChannel": "c"};

NoteOnEvent.prototype.netJSONType = "n";


NoteOnEvent.prototype.netJSONTransformProperty = function(name, value, renderChannelIndices, controlChannelIndices) {
    if (name == "renderChannel") {
        return renderChannelIndices[value.id];
    } else {
        return RenderEvent.prototype.netJSONTransformProperty.call(this, name, value, renderChannelIndices, controlChannelIndices);
    }
};


NoteOnEvent.prototype.toString = function() {
    return "noteOn(" + this.note + ", " + this.time + ", " + this.onVelocity + ", " + this.renderChannel.id + ")";
};

function NoteOffEvent(note, time, offVelocity, renderChannel) {
    RenderEvent.call(this, time);
    this.type = "noteOff";
    this.note = note;
    this.offVelocity = offVelocity;
    this.renderChannel = renderChannel;
}

NoteOffEvent.prototype = new RenderEvent();

NoteOffEvent.prototype.netJSONPropertiesMap = {"time": "t", "type": "y", "note": "n", "offVelocity": "v", "renderChannel": "c"};

NoteOffEvent.prototype.netJSONType = "f";

NoteOffEvent.prototype.netJSONTransformProperty = function(name, value, renderChannelIndices, controlChannelIndices) {
    if (name == "renderChannel") {
        return renderChannelIndices[value.id];
    } else {
        return RenderEvent.prototype.netJSONTransformProperty.call(this, name, value, renderChannelIndices, controlChannelIndices);
    }
};


NoteOffEvent.prototype.toString = function() {
    return "noteOff(" + this.note + ", " + this.time + ", " + this.offVelocity + ", " + this.renderChannel.id + ")";
};

function SetControlEvent(value, time, controlChannel) {
    RenderEvent.call(this, time);
    this.type = "setControl";
    this.value = value;
    this.controlChannel = controlChannel;
}

SetControlEvent.prototype = new RenderEvent();

SetControlEvent.prototype.netJSONPropertiesMap = {"time": "t", "type": "y", "value": "v", "controlChannel": "c"};

SetControlEvent.prototype.netJSONType = "c";

SetControlEvent.prototype.netJSONTransformProperty = function(name, value, renderChannelIndices, controlChannelIndices) {
    if (name == "controlChannel") {
        return controlChannelIndices[value.id];
    } else {
        return RenderEvent.prototype.netJSONTransformProperty.call(this, name, value, renderChannelIndices, controlChannelIndices);
    }
};


function SetTempoEvent(bpm, time) {
    RenderEvent.call(this, time);
    this.type = "setTempo";
    this.bpm = bpm;
}

SetTempoEvent.prototype = new RenderEvent();

SetTempoEvent.prototype.netJSONPropertiesMap = {"time": "t", "type": "y", "bpm": "b"};

SetTempoEvent.prototype.netJSONType = "t";

SetTempoEvent.prototype.toString = function() {
    return "setTempo(" + this.bpm + ", " + this.time + ")";
};

