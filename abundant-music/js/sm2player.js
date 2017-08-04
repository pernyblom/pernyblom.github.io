

function AudioElementVoice() {
    this.audioElement = null;
    this.offTime = 0;
    this.isPlaying = false;
    this.timeout = null;
}


function SoundManager2Player() {
    AudioPlayer.call(this);

    this.notesPerSample = 1;

    this.contextStartTime = -1;

    this.loadSamplesAsyncOperationConstructor = LoadSM2SoundsAsyncOperation;
}
SoundManager2Player.prototype = new AudioPlayer();

SoundManager2Player.prototype.title = "Sound Manager 2 (Web Audio not detected)";


SoundManager2Player.prototype.getSoundFontPrefix = function(type) {
    return SoundFontType.getSamplesPrefix(SoundFontType.STANDARD_HEAVY);
};


SoundManager2Player.prototype.getProgramIndex = function(map) {
    return 0;
};

SoundManager2Player.prototype.getContextTime = function() {
    var currentSeconds = Date.now() * 0.001;
    if (this.contextStartTime == -1) {
        this.contextStartTime = currentSeconds;
    }
    return currentSeconds - this.contextStartTime;
};



SoundManager2Player.prototype.stopVoice = function(v) {
    if (v.timeout != null) {
        clearTimeout(v.timeout);
        v.timeout = null;
    }
//    v.audioElement.pause();
//    v.audioElement.currentTime = 0;
//    v.isPlaying = false;
};



SoundManager2Player.prototype.getOrCreateChannelNodes = function(channel) {
    var nodes = this.channelNodes[channel];
    if (!nodes) {
        nodes = {};
        nodes.channelName = this.data.renderChannelNames[channel];
        this.channelNodes[channel] = nodes;
    }
    return nodes;
};

SoundManager2Player.prototype.scheduleControlWithChannelInfo = function(info, value) {
};


SoundManager2Player.prototype.scheduleNoteOnOff = function(noteData) {

    var onEvent = noteData.onEvent;
    var delay = 0.1;
    var onTime = noteData.onTime + this.contextOffset + delay;
    var offTime = noteData.offTime + this.contextOffset + delay;

    // Add some reverb time
    offTime += 2;

    var bufferInfoId = this.getBufferInfoId(noteData);
    var bufferInfo = this.bufferInfos[bufferInfoId];

    var audioElement = bufferInfo.buffer;

    var volMult = 1;
    if (bufferInfo.channelPrefix == "percussion") {
        volMult = this.settings.percussionVolumeMultiplier;
    } else {
        var arr = this.settings[bufferInfo.channelPrefix + "VolumeMultipliers"];
        if (arr.length > 0) {
            volMult = arr[bufferInfo.voiceIndex % arr.length];
        }
    }

    var voice = new AudioElementVoice();
    voice.audioElement = audioElement;
    voice.offTime = offTime;
    voice.isPlaying = true;
    this.playingVoices.push(voice);

    var delaySeconds = Math.max(0, onTime - this.getContextTime());

//    logit("delay " + delaySeconds);
    voice.timeout = setTimeout(function() {
//        audioElement.stop();
//        audioElement.currentTime = 0;
        audioElement.play({volume: Math.round(clamp(volMult * 100, 0, 100))});
    }, Math.round(delaySeconds * 1000));
};






