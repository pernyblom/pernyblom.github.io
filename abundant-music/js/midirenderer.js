

function MidiRenderer() {
    this.id = "";
    this.structure = "";

    this.channelMaps = [];
    this.controlChannelMaps = [];

    this._constructorName = "MidiRenderer";
}

function MidiChannelMap() {
    this.id = "";
    this.renderChannel = "";
    this.program = MidiProgram.ACOUSTIC_GRAND_PIANO;
    this.channel = 0;
    this.initialControllerMessages = [];
    this._constructorName = "MidiChannelMap";
}

function MidiControlChannelMap() {
    this.id = "";
    this.controlChannel = "";
    this.channel = 0;
    this.amplitude = 1.0;
    this.bias = 0.0;
    this.controllerType = MidiControllerType.VOLUME;
    this._constructorName = "MidiControlChannelMap";
}


function InitialMidiControllerMessage() {
    this.id = "";
    this.type = MidiControllerType.VOLUME;
    this.value = 64;
    this._constructorName = "InitialMidiControllerMessage";
}

InitialMidiControllerMessage.prototype.setType = function(v) {
    this.type = v;
    return this;
};
InitialMidiControllerMessage.prototype.setValue = function(v) {
    this.value = v;
    return this;
};


MidiRenderer.prototype.getMidiData = function(renderData, module, options) {
    var result = {};

    if (!options) {
        options = {
            exportEffects: true,
            exportVolume: true
        };
    }


    result.fileFormat = 0;
    result.midiDivisions = 192;

    var tracks = [];
    var track = {};
    tracks.push(track);
    var trackEvents = [];
    track.trackEvents = trackEvents;


    var time = 0;
    var events = renderData.getEvents();

    var quarterTicks = 192;


    var emptyChannels = {};

    var controlChannelMaps = {};
    for (var i=0; i<this.controlChannelMaps.length; i++) {
        var map = this.controlChannelMaps[i];
        controlChannelMaps[map.controlChannel] = map;
//        logit("Adding control channel map " + map.controlChannel);
    }
    var channelMaps = {};
    for (var i=0; i<this.channelMaps.length; i++) {
        var map = this.channelMaps[i];
        channelMaps[map.renderChannel] = map;
        emptyChannels[map.channel] = true;
    }

    // Avoid adding events to channels that have no notes
    for (var i=0; i<events.length; i++) {
        var event = events[i];
        if (event.type == "noteOn" || event.type == "noteOff") {
            var channelMap = channelMaps[event.renderChannel.id];
            if (channelMap) {
                emptyChannels[channelMap.channel] = false;
            }
        }
    }

    var sentProgramChanges = {};

    // Set all initial programs
    for (var i=0; i<this.channelMaps.length; i++) {
        var map = this.channelMaps[i];
        if (!emptyChannels[map.channel]) {

            if (!sentProgramChanges[map.channel]) {
                var trackEvent = {
                    eventTime: 0,
                    eventMessage: {
                        messageClass: "ProgramChangeMessage",
                        channel: map.channel,
                        program: map.program
                    }
                };
                trackEvents.push(trackEvent);
                sentProgramChanges[map.channel] = true;
            }
            // Add some initial control values
            for (var j=0; j<map.initialControllerMessages.length; j++) {
                var message = map.initialControllerMessages[j];

                var controllerType = MidiControllerType.getValue(message.type);
                if (options.exportEffects && message.type != MidiControllerType.VOLUME ||
                    options.exportVolume && message.type == MidiControllerType.VOLUME) {

                    trackEvent = {
                        eventTime: 0,
                        eventMessage: {
                            messageClass: "ChannelMessage",
                            channel: map.channel,
                            status: "CONTROL_CHANGE",
                            data1: controllerType,
                            data2: message.value
                        }
                    };
                    trackEvents.push(trackEvent);
//                    logit("Adding ctrl change " + map.channel);
                } else {
    //                logit("Not exporting " + controllerType);
                }
            }
        } else {
//            logit("Channel " + map.channel + " was empty");
        }
    }


    var ticks = 0;
    for (var i=0; i<events.length; i++) {
        var event = events[i];

        var deltaTime = event.time - time;

        var eventTime = Math.round(quarterTicks * deltaTime);

        ticks += eventTime;

        var trackEvent = null;
        if (event.type == "noteOn" || event.type == "noteOff") {
            var channelMap = channelMaps[event.renderChannel.id];
            if (!channelMap) {
                channelMap = {
                    channel: 0
                };
                // logit(" could not find channel map for " + event.renderChannel.id + " all maps: " + JSON.stringify(channelMaps) + "<br />")
            }
            var isNoteOn = event.type == "noteOn";

//            if (!isNoteOn) {
//                if (event.startTime < 8) {
//                    logit(" off at " + event.time + " started at " + event.startTime + " ticks: " + ticks + ", " + (ticks / quarterTicks));
//                }
//            }

            var status = isNoteOn ? "NOTE_ON" : "NOTE_OFF";
            var dVelocity = isNoteOn ? event.onVelocity : event.offVelocity;
            var velocity = Math.round(clamp(dVelocity * 127, 0, 127));
//            logit("Writing note on " + event.note + " to " + channelMap.channel);
            trackEvent = {
                eventTime: eventTime,
                eventMessage: {
                    messageClass: "VoiceMessage",
                    status: status,
                    channel: channelMap.channel,
                    data1: event.note,
                    data2: velocity
                }
            };
        } else if (event.type == "setControl") {

            var controlMap = controlChannelMaps[event.controlChannel.id];
            if (!controlMap) {
//                controlMap = {
//                    channel: 0,
//                    controllerType: MidiControllerType.VOLUME
//                };
//                logit("Could not find control map for " + event.controlChannel.id);
                continue;
            } else {
//                logit("Found control map for " + event.controlChannel.id + " " + JSON.stringify(controlMap));
            }
            var ctrlData = clamp(Math.round(event.value * controlMap.amplitude + controlMap.bias), 0, 127);
            var controllerType = MidiControllerType.getValue(controlMap.controllerType);
//            logit("Writing ctrlData " + ctrlData + " to " + controlMap.channel + " controllerType: " + controllerType);

            if (controlMap &&
                (options.exportEffects && controlMap.controllerType != MidiControllerType.VOLUME ||
                options.exportVolume && controlMap.controllerType == MidiControllerType.VOLUME)) {

                if (controllerType == MidiControllerType.VOLUME) {
//                    logit("Adding volume message");
                }
                if (!emptyChannels[controlMap.channel]) {
                    trackEvent = {
                        eventTime: eventTime,
                        eventMessage: {
                            messageClass: "ChannelMessage",
                            channel: controlMap.channel,
                            status: "CONTROL_CHANGE",
                            data1: controllerType,
                            data2: ctrlData
                        }
                    };
                }
//                logit("Adding ctrl change " + map.channel);
            } else {
//                logit("Not adding " + controllerType);
            }
        } else if (event.type == "setTempo") {
            var microsPerMinute = 60000000;
            var microsPerQuarter = Math.round(microsPerMinute / event.bpm);
//            logit("midi renderer Writing tempo " + microsPerQuarter);
            trackEvent = {
                eventTime: eventTime,
                eventMessage: {
                    messageClass: "SetTempoMessage",
                    microsPerQuarter: microsPerQuarter
                }
            };
        } else {
            logit("Unknown event type " + event.type);
        }
        if (trackEvent) {
            trackEvents.push(trackEvent);
            time = event.time;
        }
    }

    // Add the end of track event
    trackEvents.push({
        eventTime: quarterTicks,
        eventMessage: {
            messageClass: "EndTrackMessage"
        }
    });

    result.midiTracks = tracks;

    return result;
};
