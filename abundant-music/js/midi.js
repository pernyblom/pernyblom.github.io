
var Midi = (function() {


    var MessageStatus = {
        NOTE_OFF: 0x80,
        NOTE_ON: 0x90,
        KEY_PRESSURE: 0xA0,
        CONTROL_CHANGE: 0xB0,
        PROGRAM_CHANGE: 0xC0,
        CHANNEL_PRESSURE: 0xD0,
        PITCH_BEND: 0xE0,
        SYSTEM: 0xF0,
        INVALID: 0x00,
        isStatus: function(value) {
            return value != MessageStatus.INVALID && MessageStatus.STRING_TABLE[value] != null;
        },
        toString: function(value) {
            return MessageStatus.STRING_TABLE[value];
        }
    };

    MessageStatus.STRING_TABLE = {};
    MessageStatus.STRING_TABLE[MessageStatus.NOTE_OFF] = "NOTE_OFF";
    MessageStatus.STRING_TABLE[MessageStatus.NOTE_ON] = "NOTE_ON";
    MessageStatus.STRING_TABLE[MessageStatus.KEY_PRESSURE] = "KEY_PRESSURE";
    MessageStatus.STRING_TABLE[MessageStatus.CONTROL_CHANGE] = "CONTROL_CHANGE";
    MessageStatus.STRING_TABLE[MessageStatus.PROGRAM_CHANGE] = "PROGRAM_CHANGE";
    MessageStatus.STRING_TABLE[MessageStatus.CHANNEL_PRESSURE] = "CHANNEL_PRESSURE";
    MessageStatus.STRING_TABLE[MessageStatus.PITCH_BEND] = "PITCH_BEND";
    MessageStatus.STRING_TABLE[MessageStatus.SYSTEM] = "SYSTEM";
    MessageStatus.STRING_TABLE[MessageStatus.INVALID] = "INVALID";


    function Message(status) {
        this.status = typeof(status) === 'undefined' ? 0 : status;
    }
    Message.prototype.encode = function(data) {
    };
    Message.prototype.toString = function() {
        return "[Message(status=" + MessageStatus.toString(this.status) + ")]";
    };




    function DataMessage(status, data1, data2) {
        Message.call(this, status);
        this.data1 = typeof(data1) === 'undefined' ? 0 : data1;
        this.data2 = typeof(data2) === 'undefined' ? 0 : data2;
    }

    DataMessage.prototype = new Message();

    DataMessage.prototype.combinedData = function() {
        var combined = this.data2;
        combined <<= 7;
        combined |= this.data1;
        return combined;
    };




    function ChannelMessage(status, channel, data1, data2) {
        DataMessage.call(this, status, data1, data2);
        this.channel = typeof(channel) === 'undefined' ? 0 : channel;
    }

    ChannelMessage.prototype = new DataMessage();

    ChannelMessage.prototype.encode = function(data) {
        data.writeByte(this.status | this.channel);
        data.writeByte(Math.round(this.data1));
        data.writeByte(Math.round(this.data2));
    };

    ChannelMessage.prototype.toString = function() {
        return "[ChannelMessage(status=" + MessageStatus.toString(this.status) + " channel=" + this.channel + " data1=" + this.data1.toString(16) + " data2=" + this.data2.toString(16) + ")]";
    };


    function VoiceMessage(status, channel, data1, data2) {
        ChannelMessage.call(this, status, channel, data1, data2);
    }
    VoiceMessage.prototype = new ChannelMessage();

    VoiceMessage.prototype.octave = function() {
        return Math.floor(this.data1 / 12) - 1;
    };
    VoiceMessage.prototype.pitch = function() {
        return this.data1;
    };
    VoiceMessage.prototype.note = function() {
        return this.pitch() % 12;
    };
    VoiceMessage.prototype.velocity = function() {
        return this.data2;
    };
    VoiceMessage.prototype.toString = function() {
        return "[VoiceMessage(status=" + MessageStatus.toString(this.status) + " channel=" + this.channel + " note=" + MIDINote.toString(this.note()) + " octave=" + this.octave() + " velocity=" + this.velocity() + ")]";
    };


    var MIDINote = {
        C: 0,
        C_SHARP: 1,
        D: 2,
        D_SHARP: 3,
        E: 4,
        F: 5,
        F_SHARP: 6,
        G: 7,
        G_SHARP: 8,
        A: 9,
        A_SHARP: 10,
        B: 11,

        toString: function(value) {
            switch(value)
            {
                case this.C: return "C";
                case this.C_SHARP: return "C#";
                case this.D: return "D";
                case this.D_SHARP: return "D#";
                case this.E: return "E";
                case this.F: return "F";
                case this.F_SHARP: return "F#";
                case this.G: return "G";
                case this.G_SHARP: return "G#";
                case this.A: return "A";
                case this.A_SHARP: return "A#";
                case this.B: return "B";
            }

            return "UNKNOWN";
        }
    };


    var MetaEventMessageType =
    {
        SEQUENCE_NUM: 0x00,

        TEXT: 0x01,
        COPYRIGHT: 0x02,
        TRACK_NAME: 0x03,
        INSTRUMENT_NAME: 0x04,
        LYRIC: 0x05,
        MARKER: 0x06,
        CUE_POINT: 0x07,
        PROGRAM_NAME: 0x08,
        DEVICE_NAME: 0x09,

        CHANNEL_PREFIX: 0x20,
        MIDI_PORT: 0x21,
        END_OF_TRACK: 0x2F,
        SET_TEMPO: 0x51,
        SMPTE_OFFSET: 0x54,
        TIME_SIGNATURE: 0x58,
        KEY_SIGNATURE: 0x59,
        SEQUENCER_SPECIFIC: 0x7F
    }



    var SystemMessageType = {
        SYS_EX_START: 0x0,
        MIDI_TIME_CODE: 0x1,
        SONG_POSITION: 0x2,
        SONG_SELECT: 0x3,
        TUNE_REQUEST: 0x6,
        SYS_EX_END: 0x7,
        TIMING_CLOCK: 0x8,
        START: 0xA,
        CONTINUE: 0xB,
        STOP: 0xC,
        ACTIVE_SENSING: 0xE,
        SYSTEM_RESET: 0xF,

        toString: function(value) {
            switch(value)
            {
                case this.SYS_EX_START: return "SYS_EX_START";
                case this.MIDI_TIME_CODE: return "MIDI_TIME_CODE";
                case this.SONG_POSITION: return "SONG_POSITION";
                case this.SONG_SELECT: return "SONG_SELECT";
                case this.TUNE_REQUEST: return "TUNE_REQUEST";
                case this.SYS_EX_END: return "SYS_EX_END";
                case this.TIMING_CLOCK: return "TIMING_CLOCK";
                case this.START: return "START";
                case this.CONTINUE: return "CONTINUE";
                case this.STOP: return "STOP";
                case this.ACTIVE_SENSING: return "ACTIVE_SENSING";
                case this.SYSTEM_RESET: return "SYSTEM_RESET";
            }

            return "UNKNOWN";
        }
    };



    function MetaEventMessage(type) {
        Message.call(this, SystemMessageType.SYSTEM_RESET);
        this.type = type;
    }
    MetaEventMessage.prototype = new Message();


    function EndTrackMessage(type) {
        MetaEventMessage.call(this, type);
    }

    EndTrackMessage.prototype = new MetaEventMessage();

    EndTrackMessage.prototype.END_OF_TRACK = new EndTrackMessage(MetaEventMessageType.END_OF_TRACK);

    EndTrackMessage.prototype.encode = function(data) {
        data.writeByte(0xff);
        data.writeByte(0x2f);
        data.writeByte(0);
    };

    function ProgramChangeMessage(channel, instrument) {
        ChannelMessage.call(this, MessageStatus.PROGRAM_CHANGE, channel, instrument);
    }
    ProgramChangeMessage.prototype = new ChannelMessage();

    ProgramChangeMessage.prototype.encode = function(data) {
        data.writeByte(this.status | this.channel);
        data.writeByte(this.data1);
    };


    ProgramChangeMessage.prototype.toString = function() {
        return "[ProgramChangeMessage(channel=" + this.channel + " program=" + this.data1 + ")]";
    };


    function SetTempoMessage(microsPerQuarter) {
        MetaEventMessage.call(this, MetaEventMessageType.SET_TEMPO);

        this.microsPerQuarter = microsPerQuarter;
    }
    SetTempoMessage.prototype = new MetaEventMessage();

    SetTempoMessage.prototype.encode = function(data) {
        data.writeByte(0xff);
        data.writeByte(0x51);
        writeVariableLengthUInt(data, 3);
        data.writeByte((this.microsPerQuarter >> 16) & 0xff);
        data.writeByte((this.microsPerQuarter >> 8) & 0xff);
        data.writeByte((this.microsPerQuarter) & 0xff);
    };

    SetTempoMessage.prototype.toString= function() {
        return "[SetTempoMessage(microsPerQuarter=" + this.microsPerQuarter + ")]";
    };



    function MIDITrackEvent(time, message)
    {
        this.eventTime = time;
        this.eventMessage = message;

    }

    MIDITrackEvent.prototype.encode = function(data) {
        writeVariableLengthUInt(data, this.eventTime);
        this.eventMessage.encode(data);
    };

    MIDITrackEvent.prototype.toString = function() {
        return "[MIDITrackEvent(time=" + this.eventTime + " message=" + this.eventMessage + ")]";
    };



    function MIDITrack(events) {
        this.trackEvents = events;
    }
    MIDITrack.prototype.toString = function() {
        return "[MIDITrack(events=\n\t" + this.trackEvents.join("\n\t") + ")]";
    };


    function MIDIFile(format, division, tracks)
    {
        this.fileFormat = format;
        this.midiDivision = division;
        this.midiTracks = tracks ? tracks : [];

    }
    MIDIFile.prototype.numTracks = function() {
        return this.midiTracks.length;
    };
    MIDIFile.prototype.toString = function() {
        return "[MIDIFile(format=" + this.fileFormat + " division=" + this.midiDivision + " numTracks=" + this.midiTracks.length + " tracks=\n\t" + this.midiTracks.join("\n\t") + ")]";
    };


    function MIDIEncoder() {
    }
    MIDIEncoder.prototype.MIDI_FILE_HEADER_TAG = 0x4D546864; // MThd
    MIDIEncoder.prototype.MIDI_FILE_HEADER_SIZE = 0x00000006;
    MIDIEncoder.prototype.MIDI_TRACK_HEADER_TAG = 0x4D54726B; // MTrk

    MIDIEncoder.prototype.encodeEvents = function(data, events) {
        for (var i = 0; i < events.length; i++) {
            var event = events[i];
            event.encode(data);
        }
    };


    MIDIEncoder.prototype.encodeFile = function(data, file) {

        data.writeInt(this.MIDI_FILE_HEADER_TAG);
        data.writeInt(this.MIDI_FILE_HEADER_SIZE);

        var format = file.fileFormat;
        var numTracks = file.midiTracks.length;
        var timingDivision = file.midiDivision;

        if (typeof(format) === 'undefined') {
            logit("format undef...");
        }
        if (typeof(numTracks) === 'undefined') {
            logit("numtracks undef...");
        }
        if (typeof(timingDivision) === 'undefined') {
            logit("divisiion undef...");
        }
        data.writeShort(format);
        data.writeShort(numTracks);
        data.writeShort(timingDivision);

        var tracks = file.midiTracks;

        var track;
        var trackHeader;
        var trackSize;
        var trackEnd;
        var trackTime;

        var events;
        var event;
        var eventDelta;

        var messageBytes;
        var message;

        var previousStatusByte;

        for (var i = 0; i < numTracks; i++) {
            track = tracks[i];

            events = track.trackEvents;

            data.writeInt(this.MIDI_TRACK_HEADER_TAG);

            // Encoding all events in the track and then check and write the size
            var trackBytes = new FakeByteArray();
            this.encodeEvents(trackBytes, events);

            data.writeInt(trackBytes.length);

            // Write all the track bytes
            data.appendByteArray(trackBytes);
        }
//    logit("Data length: " + data.lengths.length);
    }



    function writeVariableLengthUInt(data, theUInt) {
        var mask = 0xffffff7f;

        var bytes = [];

        for (var i = 0; i < 4; i++) {
            var masked = theUInt & mask;
            var byt = masked & 0x7f;
            //trace("current: " + theUInt.toString(2) + " masked: " + masked.toString(2) + " the byte: " + byte.toString(2));
            if (masked) {
                bytes.push(byt);
            }
            theUInt = theUInt >> 7;
        }
        if (bytes.length == 0) {
            bytes.push(0);
        }

//var str = "";
//var hexStr = "";
        for (i = bytes.length - 1; i >= 0; i--) {
            byt = bytes[i];
            if (i != 0) {
                byt = byt | 0x80;
            }
            data.writeByte(byt);
            //str += byte.toString(2);
            //hexStr += byte.toString(16);
        }
//trace("Result: " + str + " or " + hexStr);
    }



    function encodeMidi(midiDataObject, resultBuffer) {

        var resultMidiTracks = [];

        if (typeof(midiDataObject.midiTracks) === 'undefined') {
            logit("Midi data missing midiTracks property<br />");
            return;
        }

        if (typeof(midiDataObject.midiTracks.length) === 'undefined') {
            logit("Midi data midiTracks property not an array<br />");
            return;
        }

        var inputMidiTracks = midiDataObject.midiTracks;

        inputMidiTracks.push({});

        for (var i = 0; i < inputMidiTracks.length - 1; i++) {

            var trackEvents = [];

            var track = inputMidiTracks[i];

            if (typeof(track.trackEvents) === 'undefined') {
//        textArea.text += "Midi data track missing trackEvents property\n";
//        textArea.text += JSON.stringify(track) + "\n";
//        textArea.text += JSON.stringify(inputMidiTracks[i]) + "\n";
//        textArea.text += JSON.stringify(inputMidiTracks) + "\n";
                return;
            }

            var events = track.trackEvents;
            for (var j = 0; j < events.length; j++) {
                var event = events[j];

                if (typeof(event.eventTime) === 'undefined') {
//            textArea.text += "Midi data event missing eventTime property\n";
                    return;
                }

                var eventTime = event.eventTime;

                if (typeof(event.eventMessage) === 'undefined') {
//            textArea.text += "Midi data event missing eventMessage property\n";
                    return;
                }

                var eventMessage = event.eventMessage;

                if (typeof(eventMessage.messageClass) === 'undefined') {
//            textArea.text += "Midi data event message missing messageClass property\n";
                    return;
                }

                var messageClass = eventMessage.messageClass;

                var message = null;
                var statusStr = "";
                var status = 0;
                switch (messageClass) {
                    case "ChannelMessage":
                        statusStr = eventMessage.status;
                        status = MessageStatus.CONTROL_CHANGE;
                        switch (statusStr) {
                            case "CONTROL_CHANGE":
                                status = MessageStatus.CONTROL_CHANGE;
                                break;
                        }
                        message = new ChannelMessage(status, eventMessage.channel, eventMessage.data1, eventMessage.data2);
                        break;
                    case "VoiceMessage":
                        statusStr = eventMessage.status;
                        status = MessageStatus.NOTE_OFF;
                        switch (statusStr) {
                            case "NOTE_ON":
                                status = MessageStatus.NOTE_ON;
                                break;
                            case "NOTE_OFF":
                                status = MessageStatus.NOTE_OFF;
                                break;
                        }
                        message = new VoiceMessage(status, eventMessage.channel, eventMessage.data1, eventMessage.data2);
                        break;
                    case "EndTrackMessage":
                        message = EndTrackMessage.prototype.END_OF_TRACK;
                        break;
                    case "ProgramChangeMessage":
                        message = new ProgramChangeMessage(eventMessage.channel, eventMessage.program);
                        break;
                    case "SetTempoMessage":
                        message = new SetTempoMessage(eventMessage.microsPerQuarter);
                        break;
                }
                if (message != null) {
                    trackEvents.push(new MIDITrackEvent(eventTime, message));
                } else {
                    logit("message was " + message + " " + messageClass);
                }

            }
            resultMidiTracks.push(new MIDITrack(trackEvents));
        }

        var midiFile = new MIDIFile(midiDataObject.fileFormat, midiDataObject.midiDivisions, resultMidiTracks);

//trace("file before: " + midiFile.toString());

        var encoder = new MIDIEncoder();
        encoder.encodeFile(resultBuffer, midiFile);

    }

    return {
        encodeMidi: encodeMidi
    }

})();
