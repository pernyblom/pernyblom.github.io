


function WebAudioVoice() {
    this.outputNode = null;
    this.offTime = 0;
}


function WebAudioChannelNodes() {
    this.channelName = "";
    this.chorusSend = null;
    this.delaySend = null;
    this.reverbSend = null;
    this.gain = null;
    this.filter = null;
    this.panner = null;
}


function WebAudioPlayer() {
    AudioPlayer.call(this);

    this.notesPerSample = 6;
    this.context = null;

    this.compressor = null;

    this.melodicBuffers = {};
    this.percussionBuffers = {};

    this.bufferAmpScale = 0.1;
}
WebAudioPlayer.prototype = new AudioPlayer();

WebAudioPlayer.prototype.title = "Web Audio";


WebAudioPlayer.prototype.getContextTime = function() {
    return this.context.currentTime;
};

WebAudioPlayer.prototype.contextSupported = function() {
    return this.getContextConstructor() != null;
};

WebAudioPlayer.prototype.getContextConstructor = function() {
    var con = null;
    if (typeof(AudioContext) != 'undefined') {
        con = AudioContext;
    } else if (typeof(webkitAudioContext) != 'undefined') {
        con = webkitAudioContext;
    }
    return con;
};

WebAudioPlayer.prototype.createContextIfNecessary = function() {
    if (!this.context) {
        var con = this.getContextConstructor();
        this.context = new con();
    }
};


WebAudioPlayer.prototype.createBuffer = function(func, freq) {
    var buffer = this.context.createBuffer(1, this.context.sampleRate, this.context.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i=0; i<data.length; i++) {
        var frac = i / (data.length - 1);
        data[i] = func.call(this, frac * freq);
    }
    return buffer;
};


WebAudioPlayer.prototype.stopVoice = function(v) {
    v.outputNode.disconnect();
};



WebAudioPlayer.prototype.getOrCreateChannelNodes = function(channel) {
    if (!this.compressor) {
        this.compressor = this.context.createDynamicsCompressor();
        this.compressor.connect(this.context.destination);


//        void setPosition(in float x, in float y, in float z);
//        void setOrientation(in float x, in float y, in float z, in float xUp, in float yUp, in float zUp);
        this.context.listener.setPosition(0, 0, 0);
        this.context.listener.setOrientation(0, 0, -1, 0, 1, 0);

    }
    var nodes = this.channelNodes[channel];
    if (!nodes) {
        nodes = new WebAudioChannelNodes();
        nodes.channelName = this.data.renderChannelNames[channel];
        this.channelNodes[channel] = nodes;

        nodes.panner = this.context.createPanner();
        nodes.panner.setPosition(0, 0, 1);
        nodes.panner.connect(this.compressor);

        nodes.filter = this.context.createBiquadFilter();
        nodes.filter.type = 0;
        nodes.filter.frequency.value = 10000;
        nodes.filter.Q.value = 0;
        nodes.filter.connect(nodes.panner);

        nodes.gain = this.context.createGain();
        nodes.gain.connect(nodes.filter);
//        logit(" Creating nodes for channel " + channel);
    }
    return nodes;
};

WebAudioPlayer.prototype.scheduleControlWithChannelInfo = function(info, value, time) {
    try {

        if (info.nodes) {

//        logit("Scheduling control for " + info.nodes.channelName);
            switch (info.controlType) {
                case "Pan":
//                logit("Setting pan to " + value);
                    var maxAngle = Math.PI / 4;
                    var angleFrac = 2 * (value - 0.5);
                    var angle = angleFrac * maxAngle;
                    var distance = 1;

//                logit("Setting angle frac to " + angleFrac + " " + info.nodes.channelName + " " + this.data.controlChannelNames[channelIndex]);

                    info.nodes.panner.setPosition(distance * Math.sin(angle), 0, -distance * Math.cos(angle));
                    break;
                case "FilterF":
//                info.nodes.filter.frequency.value =
                    var maxFreq = this.noteToFrequency(127);
                    var minFreq = this.noteToFrequency(0);

                    var frequency = minFreq + (maxFreq - minFreq) * value;
//                logit("Setting filter f to " + frequency + " at " + time + " " + maxFreq + " " + minFreq);
                    info.nodes.filter.frequency.exponentialRampToValueAtTime(frequency, time);
                    break;
                case "FilterQ":
                    var newQ = 1.0 / (0.01 + 0.1 * value);
//                logit("Setting filter q to " + newQ + " at " + time);
                    info.nodes.filter.Q.exponentialRampToValueAtTime(newQ, time);
                    break;
                default:
                    logit("Unknown control type " + info.controlType);
                    break;
            }
        }
    } catch (ex) {
        logit("Error when scheduling control");
    }
};

WebAudioPlayer.prototype.sineBufferFunc = function(f) {
    var a = 2.0 * Math.PI * f;
    return this.bufferAmpScale * Math.sin(a); //  + 0.25 * Math.sin(2 * a) + 0.15 * Math.sin(3 * a);
};

WebAudioPlayer.prototype.sawBufferFunc = function(f) {
//    var a = 2.0 * Math.PI * f;
    f = mod(f, 1);
    return this.bufferAmpScale * (-1 + 2 * f);
};

WebAudioPlayer.prototype.squareBufferFunc = function(f) {
//    var a = 2.0 * Math.PI * f;
    f = mod(f, 1);
    return this.bufferAmpScale * (f < 0.5 ? -1 : 1);
};

WebAudioPlayer.prototype.triangleBufferFunc = function(f) {
//    var a = 2.0 * Math.PI * f;
    f = mod(f, 1);
    return this.bufferAmpScale * (f < 0.5 ? -1 + 4 * f : 3 - 4 * f);
};


WebAudioPlayer.prototype.snareBufferFunc = function(f) {
    return this.bufferAmpScale * (-1 + 2 * Math.random());
};


WebAudioPlayer.prototype.scheduleNoteOnOff = function(noteData) {

    var bufferInfoId = this.getBufferInfoId(noteData);
    var bufferInfo = this.bufferInfos[bufferInfoId];

    var isPercussion = bufferInfo.channelPrefix == "percussion";
    var onEvent = noteData.onEvent;

    var delay = 0.1;
    var onTime = noteData.onTime + this.contextOffset + delay;
    var offTime = noteData.offTime + this.contextOffset + delay;

    var origOffTime = offTime;
    // Add some reverb time
    offTime += 1;

    var voiceIndex = bufferInfo.voiceIndex;

    var instrType = null; // PrimitiveWebAudioPlayerInstrumentType.SQUARE;
    var instrumentArr = null;
    switch (bufferInfo.channelPrefix) {
        case "melody":
            instrumentArr = this.settings.melodyInstruments;
            break;
        case "inner1":
            instrumentArr = this.settings.inner1Instruments;
            break;
        case "inner2":
            instrumentArr = this.settings.inner2Instruments;
            break;
        case "bass":
            instrumentArr = this.settings.bassInstruments;
            break;
    }
    if (instrumentArr != null) {
        if (instrumentArr.length > 0) {
            var instrument = instrumentArr[voiceIndex % instrumentArr.length];
            if (instrument instanceof PrimitiveWebAudioPlayerInstrument) {
                instrType = instrument.type;
            }
        } else {
            instrType = PrimitiveWebAudioPlayerInstrumentType.SQUARE;
        }
    }
    if (!isPercussion && typeof(instrType) === 'undefined') {
//        logit("Got instr type " + instrType + " for prop name " + typePropName);
        instrType = PrimitiveWebAudioPlayerInstrumentType.MATCH;
    }
    if (instrType == null) {
//        logit("Not scheduling " + bufferInfo.channelPrefix);
        return;
    }

    var nodes = this.getOrCreateChannelNodes(onEvent.c);

    var bufferSource = this.context.createBufferSource();

    var oscOutput = bufferSource;

    var buffer = null;

    if (isPercussion) {

        buffer = bufferInfo.buffer;

        if (!buffer) {
            logit("Could not find percussion buffer " + onEvent.n);
            buffer = this.percussionBuffers[onEvent.n];

            if (!buffer) {
                var bufferFunc = this.snareBufferFunc;
                buffer = this.createBuffer(bufferFunc, 1);
                this.percussionBuffers[onEvent.n] = buffer;
            }

            var ampEnvNode = this.context.createGain();
            var ampEnvGainParam = ampEnvNode.gain;
            ampEnvGainParam.setValueAtTime(0, onTime);
            ampEnvGainParam.exponentialRampToValueAtTime(1, onTime + 0.01);
            ampEnvGainParam.exponentialRampToValueAtTime(0, onTime + 0.25);

            bufferSource.connect(ampEnvNode);

            bufferSource.playbackRate.value = 1;
            oscOutput = ampEnvNode;
        }

    } else {
        bufferSource.loop = true;
        var freq = this.noteToFrequency(onEvent.n);
//            var freqScale = this.context.sampleRate / 500.0;

        var freqMult = 22;
        buffer = this.melodicBuffers[instrType];
        if (!buffer) {
            var bufferFunc = this.sineBufferFunc;
            switch (instrType) {
                case PrimitiveWebAudioPlayerInstrumentType.SAW:
                    bufferFunc = this.sawBufferFunc;
                    break;
                case PrimitiveWebAudioPlayerInstrumentType.SINE:
                    bufferFunc = this.sineBufferFunc;
                    break;
                case PrimitiveWebAudioPlayerInstrumentType.TRIANGLE:
                    bufferFunc = this.triangleBufferFunc;
                    break;
                case PrimitiveWebAudioPlayerInstrumentType.SQUARE:
                    bufferFunc = this.squareBufferFunc;
                    break;
            }
            buffer = this.createBuffer(bufferFunc, freqMult);
            this.melodicBuffers[instrType] = buffer;
        }
        bufferSource.playbackRate.value = freq / freqMult;

        var noteLength = origOffTime - onTime;

        var attackTime = Math.min(0.05, noteLength * 0.5);
        var decayTime = Math.min(0.2, noteLength * 0.5);
        var sustainValue = 0.25;
        var releaseTime = 0.25;

        var ampEnvNode = this.context.createGain();
        var ampEnvGainParam = ampEnvNode.gain;
        ampEnvGainParam.setValueAtTime(0, onTime);
        ampEnvGainParam.linearRampToValueAtTime(1, onTime + attackTime);
        ampEnvGainParam.linearRampToValueAtTime(sustainValue, onTime + attackTime + decayTime);
        ampEnvGainParam.linearRampToValueAtTime(sustainValue, origOffTime);
        ampEnvGainParam.linearRampToValueAtTime(0, origOffTime + releaseTime);

        bufferSource.connect(ampEnvNode);

        oscOutput = ampEnvNode;
    }

    bufferSource.buffer = buffer;

//    logit(" Scheduling note with time " + noteData.onTime + " at " + onTime + " offset: " + this.contextOffset);

//    logit(" Active source count: " + this.context.activeSourceCount);

    var volMult = 1;
    if (bufferInfo.channelPrefix == "percussion") {
        volMult = this.settings.percussionVolumeMultiplier;
    } else {
        var arr = this.settings[bufferInfo.channelPrefix + "VolumeMultipliers"];
        if (arr && arr.length > 0) {
            volMult = arr[bufferInfo.voiceIndex % arr.length];
        }
    }

    var velNode = this.context.createGain();
    velNode.gain.value = onEvent.v * volMult;

//    logit(onEvent.v);

    oscOutput.connect(velNode);

    velNode.connect(nodes.gain);

    bufferSource.start(onTime);
    bufferSource.stop(offTime);

    var voice = new WebAudioVoice();
    voice.outputNode = oscOutput;
    voice.offTime = offTime;
    this.playingVoices.push(voice);
};






