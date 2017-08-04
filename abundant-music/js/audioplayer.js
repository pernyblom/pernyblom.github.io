var AudioPlayerMode = {
    STOP: 0,
    PLAY: 1,
    PAUSE: 2
};


function AudioPlayer() {

    this.audioType = "audio/mpeg";

    this.loadSamplesAsyncOperationConstructor = LoadAudioBuffersAsyncOperation;

    this.controlChannelInfos = [];

    this.channelNodes = [];

    this.notesPerSample = 1;

    this.mode = AudioPlayerMode.STOP;
    this.channelMaps = null;

    this.data = null;
    this.origData = null;

    this.notes = null;
    this.origNotes = null;

    this.tempoEvents = null;
    this.origTempoEvents = null;

    this.controlEvents = null;
    this.origControlEvents = null;

    this.songPlayBeatTime = 0;
    this.currentTempo = 60;

    this.playSeconds = 0; // Where we are in song time
    this.contextOffset = 0; // How much after we are the context when play started

    this.soundFontType = SoundFontType.STANDARD_HEAVY;
    this.settings = new WebAudioPlayerSettings();

//    this.bufferLengths = [
//        [125, 250, 500, 1000, 1500, 2000],
//        [125, 250, 500, 1000, 1500, 2000],
//        [125, 250, 500, 1000, 1500, 2000],
//        [125, 250, 500, 1000, 1500, 2000],
//        [125, 250, 500, 1000, 1500, 2000],
//        [125, 250, 500, 1000, 1500, 2000],
//        [125, 250, 500, 1000, 1500, 2000]];
    this.percussionBufferLengths = [125];

    this.playingVoices = [];

    this.bufferInfos = {};

}

AudioPlayer.prototype.title = "Player";

AudioPlayer.prototype.updateVoice = function(v) {
    if (v.offTime < this.getContextTime()) {
        this.stopVoice(v);
        return false;
    } else {
        return true;
    }
};



AudioPlayer.prototype.step = function() {

    var dSeconds = this.getContextTime() - this.contextOffset - this.playSeconds;

    switch (this.mode) {
        case AudioPlayerMode.PAUSE:
            this.contextOffset += dSeconds;
            break;
        case AudioPlayerMode.STOP:
            this.playSeconds = 0;
            this.contextOffset = this.getContextTime();
            break;
        case AudioPlayerMode.PLAY:

            // Calculate new beat
            var beatStep = this.getBeatStep(dSeconds);

//            logit("  wap beatStep: " + beatStep + " ctx.time " + this.getContextTime());

            // Split
//            logit(" player step bt: " + this.songPlayBeatTime + " sbt: " + scheduleToBeatTime + " s: " + this.playSeconds);

            // Update tempo events
            var lookaheadSeconds = 2.0;

            var tempoBeforeAfter = this.splitSortedEvents(this.tempoEvents, this.playSeconds + dSeconds);
            var newTempoEvents = tempoBeforeAfter[0];
            this.tempoEvents = tempoBeforeAfter[1];
            // Digest the tempo events by setting the tempo
            for (var i=0; i<newTempoEvents.length; i++) {
                this.currentTempo = newTempoEvents[i].b;
            }

            var controlBeforeAfter = this.splitSortedEvents(this.controlEvents, this.playSeconds + dSeconds);
            var newControlEvents = controlBeforeAfter[0];
            this.controlEvents = controlBeforeAfter[1];
            for (var i=0; i<newControlEvents.length; i++) {
                var cEvent = newControlEvents[i];
                this.scheduleControl(cEvent);
            }


            // Schedule notes
//            logit(" spliiting on " + (this.playSeconds + lookaheadSeconds));

            var notesBeforeAfter = this.splitSortedNotes(this.notes, this.playSeconds + lookaheadSeconds, 128);
            this.notes = notesBeforeAfter[1];
            var notesToSchedule = notesBeforeAfter[0];
            for (var ch in notesToSchedule) {
                var arr = notesToSchedule[ch];
                for (var i=0; i<arr.length; i++) {
                    var noteData = arr[i];
                    if (noteData.onTime > this.playSeconds + lookaheadSeconds) {
                        logit("  stupid note should not play yet ")
                    }
                    this.scheduleNoteOnOff(arr[i]);
                }
            }
            this.playSeconds += dSeconds;
            this.songPlayBeatTime += beatStep;

            break;
    }

//    this.contextOffset = this.getContextTime();
    this.updateVoices();
};


AudioPlayer.prototype.stopAllPlayingVoices = function() {
    // All voices that are connected to the graph should be stopped and disconnected
    for (var i=0; i<this.playingVoices.length; i++) {
        var v = this.playingVoices[i];
        this.stopVoice(v);
    }
    this.playingVoices = [];
};


AudioPlayer.prototype.updateVoices = function() {
    var newPlaying = [];
    for (var i=0; i<this.playingVoices.length; i++) {
        var v = this.playingVoices[i];
        if (this.updateVoice(v)) {
            newPlaying.push(v);
        }
    }
    this.playingVoices = newPlaying;
};


AudioPlayer.prototype.noteToFrequency = function(note) {
    var n = note - 69; // A4;
    var p = Math.pow(2.0, n / 12.0);

//    logit("Converting " + note + " to freq n: " + n + " p: " + p + " result: " + (440 * p));

    return 440.0 * p;
};


AudioPlayer.prototype.beatsToSeconds = function(beats, tempo) {
    tempo = tempo ? tempo : this.currentTempo;
    return 60.0 * (beats / tempo);
};

AudioPlayer.prototype.secondsToBeats = function(seconds, tempo) {
    tempo = tempo ? tempo : this.currentTempo;
    return seconds * tempo / 60.0;
};



AudioPlayer.prototype.getBeatStep = function(dSeconds) {
    return (this.currentTempo * dSeconds) / 60.0;
};


AudioPlayer.prototype.setRenderData = function(data) {
    this.data = copyValueDeep(data);
    this.origData = copyValueDeep(data);

    this.notes = copyValueDeep(gatherNotesFromEvents(this.data.events));
    this.origNotes = copyValueDeep(this.notes);

    this.tempoEvents = copyValueDeep(gatherEventsWithType(this.data.events, "t"));
    this.origTempoEvents = copyValueDeep(this.tempoEvents);

    this.controlEvents = copyValueDeep(gatherEventsWithType(this.data.events, "c"));
    this.origControlEvents = copyValueDeep(this.controlEvents);

    return this;
};

AudioPlayer.prototype.setChannelMaps = function(maps) {
    this.channelMaps = {};
//    this.bufferInfos = {};
    for (var i=0; i<maps.length; i++) {
        var map = maps[i];
        this.channelMaps[map.renderChannel] = map;
    }
};



AudioPlayer.prototype.splitSortedEvents = function(events, seconds) {
    var before = [];
    var after = [];

    var splitIndex = events.length;
    for (var i=0; i<events.length; i++) {
        var e = events[i];
        if (e.seconds < seconds) {
            before.push(e);
        } else {
            splitIndex = i;
            break;
        }
    }
    for (var i=splitIndex; i<events.length; i++) {
        after.push(events[i]);
    }
    return [before, after];
};

AudioPlayer.prototype.splitSortedNotes = function(notes, seconds, maxCount) {
    var before = {};
    var after = {};

    maxCount = maxCount ? maxCount : 128;
    var count = 0;

    for (var ch in notes) {
        var arr = notes[ch];

        var beforeArr = null;
        var splitIndex = arr.length;
        for (var i=0; i<arr.length; i++) {
            var noteData = arr[i];
//            var onEvent = noteData.onEvent;
            var onTime = noteData.onTime;
            if (onTime < seconds && count < maxCount) {
                // Should be in left
                if (beforeArr == null) {
                    beforeArr = [];
                    before[ch] = beforeArr;
                }
                beforeArr.push(noteData);
                count++;
            } else {
                splitIndex = i;
                break;
            }
        }
        if (splitIndex < arr.length) {
            var afterArr = [];
            after[ch] = afterArr;
            for (var i=splitIndex; i<arr.length; i++) {
                afterArr.push(arr[i]);
            }
        }
    }

    return [before, after];
};


AudioPlayer.prototype.createContextIfNecessary = function() {
};

AudioPlayer.prototype.play = function() {
    this.createContextIfNecessary();
    switch (this.mode) {
        case AudioPlayerMode.PAUSE:
            // playSeconds should be correct. It is updated in step()
            break;
        case AudioPlayerMode.STOP:
            this.contextOffset = this.getContextTime();
            break;
    }
    this.mode = AudioPlayerMode.PLAY;
};

AudioPlayer.prototype.predictTime = function(tempoEvents, beat) {
    var result = 0;
    var currentTempo = 120;

    var prevBeat = 0;
    for (var i=0; i<tempoEvents.length; i++) {
        var e = tempoEvents[i];
        if (e.t < beat) {
            var diff = e.t - prevBeat;
            var dt = this.beatsToSeconds(diff, currentTempo);
            result += dt;
            currentTempo = e.b;
            prevBeat = e.t;
        } else {
            break;
        }
    }
    if (beat > prevBeat) {
        var diff = beat - prevBeat;
        var dt = this.beatsToSeconds(diff, currentTempo);
        result += dt;
    }
    return result;
};




AudioPlayer.prototype.gotoBeat = function(beat) {
    this.stopAllPlayingVoices();
    var nextBeat = Math.max(0, beat);

    this.data = copyValueDeep(this.origData);
    this.notes = copyValueDeep(this.origNotes);
    this.tempoEvents = copyValueDeep(this.origTempoEvents);
    this.controlEvents = copyValueDeep(this.origControlEvents);

    var newTime = this.predictTime(this.tempoEvents, nextBeat);

//    logit("Trying to set beat to " + nextBeat + " predicted time: " + newTime);

    this.tempoEvents = this.splitSortedEvents(this.tempoEvents, newTime)[1];
    this.controlEvents = this.splitSortedEvents(this.controlEvents, newTime)[1];
    this.notes = this.splitSortedNotes(this.notes, newTime)[1];

    var secondsDiff = newTime - this.playSeconds;

    this.songPlayBeatTime = nextBeat;
    this.playSeconds = newTime;

    this.contextOffset -= secondsDiff;
};



AudioPlayer.prototype.stop = function() {
    this.stopAllPlayingVoices();
    this.mode = AudioPlayerMode.STOP;
    this.data = copyValueDeep(this.origData);
    this.notes = copyValueDeep(this.origNotes);
    this.tempoEvents = copyValueDeep(this.origTempoEvents);
    this.controlEvents = copyValueDeep(this.origControlEvents);
    this.songPlayBeatTime = 0;
    this.playSeconds = 0;
    this.contextOffset = this.getContextTime();
};

AudioPlayer.prototype.pause = function() {
    this.stopAllPlayingVoices();
    this.mode = AudioPlayerMode.PAUSE;
};



AudioPlayer.prototype.getProgramIndex = function(map) {
    return map.program;
};

AudioPlayer.prototype.getBufferInfoId = function(noteData) {
//    var lengths = this.bufferLengths[this.soundFontType];

//    var noteLength = (noteData.offTime - noteData.onTime);
//    var lengthMillis = 1000 * noteLength;

//    var bestLength = lengths[0];
//    // Find the best length
//    for (var i=0; i<lengths.length; i++) {
//        var length = lengths[i];
//        if (length <= lengthMillis) {
//            bestLength = length;
//        }
//    }

    var result = this.getSoundFontPrefix(this.soundFontType);

    var onEvent = noteData.onEvent;
    var channelName = this.data.renderChannelNames[onEvent.c];

    var map = this.channelMaps[channelName];

    var program = this.getProgramIndex(map);

    if (channelName.indexOf("percussion") == 0) {
        result += "_perc_";
    } else {
        result += "_" + program + "_";
    }
    result += "" + onEvent.n; // + "_" + bestLength;

    return result;
};

AudioPlayer.prototype.createBufferInfos = function() {

    for (var ch in this.notes) {
        var arr = this.notes[ch];
        for (var i=0; i<arr.length; i++) {
            this.createBufferInfoForNoteData(arr[i]);
        }
    }
};

AudioPlayer.prototype.getSoundFontPrefix = function(type) {
    return SoundFontType.getSamplesPrefix(type);
};

AudioPlayer.prototype.createBufferInfoForNoteData = function(noteData) {
    var onEvent = noteData.onEvent;
    var offEvent = noteData.offEvent;
    var note = onEvent.n;

    var channelName = this.data.renderChannelNames[onEvent.c];
    var isPercussion = channelName.indexOf("percussion") == 0;

    var channelPrefix = channelName.substring(0, channelName.indexOf("Render"));
    var voiceIndex = parseInt(channelName.substring(channelName.length - 1, channelName.length)) - 1;

    var sampleNote = clamp(Math.ceil(note / this.notesPerSample) * this.notesPerSample, 0, 127);

    if (isPercussion) {
        sampleNote = note;
    }

//    var noteFreq = this.noteToFrequency(note);
//    var sampleNoteFreq = this.noteToFrequency(sampleNote);


//    var playbackRate = noteFreq / sampleNoteFreq;

//    logit("playback rate: " + playbackRate);


    var map = this.channelMaps[channelName];

//    var lengths = this.bufferLengths[this.soundFontType];

    var lengths = [125];

    var program = this.getProgramIndex(map);

    var programDir = "program" + program;
    if (isPercussion) {
        lengths = this.percussionBufferLengths;
        programDir = "percussion";
    }

    var noteLength = (noteData.offTime - noteData.onTime);
    var lengthMillis = 1000 * noteLength;

    var bestLength = lengths[0];
    // Find the best length
    for (var i=0; i<lengths.length; i++) {
        var length = lengths[i];
        if (length <= lengthMillis) {
            bestLength = length;
        }
    }

//    logit("bestLength " + bestLength + " for length: " + lengthMillis + " " + (noteData.offEvent.t - noteData.onEvent.t));

    var id = this.getBufferInfoId(noteData);

    var bufferInfo = this.bufferInfos[id];

    if (!bufferInfo) {
        var prefix = this.getSoundFontPrefix(this.soundFontType);

//        logit("creating buffer info " + channelName + " " + channelPrefix + " " + voiceIndex);

        bufferInfo = {
            id: id,
            channelName: channelName,
            channelPrefix: channelPrefix,
            voiceIndex: voiceIndex,
            isPercussion: isPercussion,
            url: isPercussion ? "samples/" + prefix + "/" + programDir + "/length" + bestLength + "/note_" + sampleNote + (canPlayMp3 ? ".mp3" : ".ogg") : "",
            buffer: null
//            playbackRate: playbackRate
        };
//        logit("Adding buffer info:" + JSON.stringify(bufferInfo));
        this.bufferInfos[id] = bufferInfo;
    }

};

AudioPlayer.prototype.getReadyForPlay = function(callback, cancelFunc) {
    this.createBufferInfos();

    var urls = [];
    var bufferInfoArr = [];
    for (var id in this.bufferInfos) {
        var bufferInfo = this.bufferInfos[id];
        if (!bufferInfo.buffer) {
            var url = bufferInfo.url;
            if (url) {
                urls.push(url);
                bufferInfoArr.push(bufferInfo);
            }
        }
    }
    this.createContextIfNecessary();

//    callback();

    if (urls.length == 0) {
        callback();
    } else {

        if (canPlayMp3) {
            this.audioType= 'audio/mpeg';
        } else {
            this.audioType= 'audio/ogg';
        }
        var op = new this.loadSamplesAsyncOperationConstructor({bufferUrls: urls, audioContext: this.context, audioType: this.audioType,
            onDone: function() {
                for (var i=0; i<bufferInfoArr.length; i++) {
                    var bufferInfo = bufferInfoArr[i];
                    bufferInfo.buffer = op.resultBuffers[i];
//                    logit("Read buffer " + bufferInfo.url);
                }
                callback();
            },
            onCancel: function() {
                if (cancelFunc) {
                    cancelFunc();
                }
            }
        });
        addAsyncOperation(op);
    }
};


AudioPlayer.prototype.scheduleControl = function(cEvent) {
    var delay = 0.1;
    var time = cEvent.seconds + this.contextOffset + delay;

    var channelIndex = cEvent.c;
    var value = cEvent.v;

//    logit("Scheduling control " + channelIndex + " " + value + " " + channelName);

    var info = this.getChannelInfoForControlChannel(channelIndex);

    this.scheduleControlWithChannelInfo(info, value, time);
};



AudioPlayer.prototype.getChannelInfoForControlChannel = function(cChannelIndex) {
    var info = this.controlChannelInfos[cChannelIndex];

    if (!info) {

        info = {};

        var cChannelName = this.data.controlChannelNames[cChannelIndex];

        var index = -1;

        var str = "ControlChannel";
        var wanted = cChannelName.substring(0, cChannelName.indexOf(str)) + "RenderChannel" + cChannelName.charAt(cChannelName.length - 1);

        var controlType = cChannelName.substring(cChannelName.indexOf(str) + str.length, cChannelName.length - 1);
        info.controlType = controlType;

//        logit(controlType);
        // Find the index for
        for (var i=0; i<this.data.renderChannelNames.length; i++) {
            var rChannelName = this.data.renderChannelNames[i];

//            logit(cChannelName + " - " + wanted + " " + rChannelName);

            if (rChannelName == wanted) {
                index = i;
                break;
            }
        }

        if (index != -1) {
            var nodes = this.getOrCreateChannelNodes(index);
            info.nodes = nodes;
//            logit("Found render channel for " + cChannelName);
        } else {
//            logit("Could not find a render channel for " + cChannelName);
        }
        this.controlChannelInfos[cChannelIndex] = info;
    }

    return info;
};


