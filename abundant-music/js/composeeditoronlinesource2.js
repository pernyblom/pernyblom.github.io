
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
function FakeByteArray() {
    this.position = 0;
    this.length = 0;
    this.data = [];
    this.lengths = [];
}

FakeByteArray.prototype.toBuffer = function() {

    var result = new ArrayBuffer(this.length);
    var dv = new DataView(result);

    var bytePos = 0;
    for (var i=0; i<this.data.length; i++) {
        var d = this.data[i];
        var dataLength = this.lengths[i];

//        logit("bytepos " + bytePos + " dataLength: " + dataLength + " length: " + this.length);
        switch (dataLength) {
            case 1:
                dv.setUint8(bytePos, d);
                break;
            case 2:
                dv.setUint16(bytePos, d);
                break;
            case 4:
                dv.setUint32(bytePos, d);
                break;
        }
        bytePos += dataLength;
    }

    return result;
};

FakeByteArray.prototype.appendByteArray = function(arr) {
    for (var i=0; i<arr.data.length; i++) {
        var d = arr.data[i];
        var dataLength = arr.lengths[i];
        switch (dataLength) {
            case 1:
//                logit("Appending byte " + d);
                this.writeByte(d);
                break;
            case 2:
//                logit("Appending short " + d);
                this.writeShort(d);
                break;
            case 4:
//                logit("Appending int " + d);
                this.writeInt(d);
                break;
        }
    }
};


FakeByteArray.prototype.writeByte = function(byt) {
    if (typeof(byt) === 'undefined') {
        logit("bad byte...");
    }
    this.length += 1;
    this.data[this.position] = byt;
    this.lengths[this.position] = 1;
    this.position += 1;
};

FakeByteArray.prototype.writeInt = function(i) {
    if (typeof(i) === 'undefined') {
        logit("bad int...");
    }
    this.length += 4;
    this.data[this.position] = i;
    this.lengths[this.position] = 4;
    this.position += 1;
};

FakeByteArray.prototype.writeShort = function(s) {
    if (typeof(s) === 'undefined') {
        logit("bad short...");
    }
    this.length += 2;
    this.data[this.position] = s;
    this.lengths[this.position] = 2;
    this.position += 1;
};
/**
 * @author sole / http://soledadpenades.com
 * @author mrdoob / http://mrdoob.com
 * @author Robert Eisele / http://www.xarg.org
 * @author Philippe / http://philippe.elsass.me
 * @author Robert Penner / http://www.robertpenner.com/easing_terms_of_use.html
 * @author Paul Lewis / http://www.aerotwist.com/
 * @author lechecacharro
 * @author Josh Faul / http://jocafa.com/
 * @author egraether / http://egraether.com/
 */

var TWEEN = TWEEN || ( function () {

    var _tweens = [];

    return {

        REVISION: '7',

        getAll: function () {

            return _tweens;

        },

        removeAll: function () {

            _tweens = [];

        },

        add: function ( tween ) {

            _tweens.push( tween );

        },

        remove: function ( tween ) {

            var i = _tweens.indexOf( tween );

            if ( i !== -1 ) {

                _tweens.splice( i, 1 );

            }

        },

        update: function ( time ) {

            if ( _tweens.length === 0 ) return false;

            var i = 0, l = _tweens.length;

            time = time !== undefined ? time : Date.now();

            while ( i < l ) {

                if ( _tweens[ i ].update( time ) ) {

                    i ++;

                } else {

                    _tweens.splice( i, 1 );

                    l --;

                }

            }

            return true;

        }

    };

} )();

TWEEN.Tween = function ( object ) {

    var _object = object;
    var _valuesStart = {};
    var _valuesEnd = {};
    var _duration = 1000;
    var _delayTime = 0;
    var _startTime = null;
    var _easingFunction = TWEEN.Easing.Linear.None;
    var _interpolationFunction = TWEEN.Interpolation.Linear;
    var _chainedTweens = [];
    var _onStartCallback = null;
    var _onStartCallbackFired = false;
    var _onUpdateCallback = null;
    var _onCompleteCallback = null;

    this.to = function ( properties, duration ) {

        if ( duration !== null ) {

            _duration = duration;

        }

        _valuesEnd = properties;

        return this;

    };

    this.start = function ( time ) {

        TWEEN.add( this );

        _onStartCallbackFired = false;

        _startTime = time !== undefined ? time : Date.now();
        _startTime += _delayTime;

        for ( var property in _valuesEnd ) {

            // This prevents the engine from interpolating null values
            if ( _object[ property ] === null ) {

                continue;

            }

            // check if an Array was provided as property value
            if ( _valuesEnd[ property ] instanceof Array ) {

                if ( _valuesEnd[ property ].length === 0 ) {

                    continue;

                }

                // create a local copy of the Array with the start value at the front
                _valuesEnd[ property ] = [ _object[ property ] ].concat( _valuesEnd[ property ] );

            }

            _valuesStart[ property ] = _object[ property ];

        }

        return this;

    };

    this.stop = function () {

        TWEEN.remove( this );
        return this;

    };

    this.delay = function ( amount ) {

        _delayTime = amount;
        return this;

    };

    this.easing = function ( easing ) {

        _easingFunction = easing;
        return this;

    };

    this.interpolation = function ( interpolation ) {

        _interpolationFunction = interpolation;
        return this;

    };

    this.chain = function () {

        _chainedTweens = arguments;
        return this;

    };

    this.onStart = function ( callback ) {

        _onStartCallback = callback;
        return this;

    };

    this.onUpdate = function ( callback ) {

        _onUpdateCallback = callback;
        return this;

    };

    this.onComplete = function ( callback ) {

        _onCompleteCallback = callback;
        return this;

    };

    this.update = function ( time ) {

        if ( time < _startTime ) {

            return true;

        }

        if ( _onStartCallbackFired === false ) {

            if ( _onStartCallback !== null ) {

                _onStartCallback.call( _object );

            }

            _onStartCallbackFired = true;

        }

        var elapsed = ( time - _startTime ) / _duration;
        elapsed = elapsed > 1 ? 1 : elapsed;

        var value = _easingFunction( elapsed );

        for ( var property in _valuesStart ) {

            var start = _valuesStart[ property ];
            var end = _valuesEnd[ property ];

            if ( end instanceof Array ) {

                _object[ property ] = _interpolationFunction( end, value );

            } else {

                _object[ property ] = start + ( end - start ) * value;

            }

        }

        if ( _onUpdateCallback !== null ) {

            _onUpdateCallback.call( _object, value );

        }

        if ( elapsed == 1 ) {

            if ( _onCompleteCallback !== null ) {

                _onCompleteCallback.call( _object );

            }

            for ( var i = 0, l = _chainedTweens.length; i < l; i ++ ) {

                _chainedTweens[ i ].start( time );

            }

            return false;

        }

        return true;

    };

};

TWEEN.Easing = {

    Linear: {

        None: function ( k ) {

            return k;

        }

    },

    Quadratic: {

        In: function ( k ) {

            return k * k;

        },

        Out: function ( k ) {

            return k * ( 2 - k );

        },

        InOut: function ( k ) {

            if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
            return - 0.5 * ( --k * ( k - 2 ) - 1 );

        }

    },

    Cubic: {

        In: function ( k ) {

            return k * k * k;

        },

        Out: function ( k ) {

            return --k * k * k + 1;

        },

        InOut: function ( k ) {

            if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
            return 0.5 * ( ( k -= 2 ) * k * k + 2 );

        }

    },

    Quartic: {

        In: function ( k ) {

            return k * k * k * k;

        },

        Out: function ( k ) {

            return 1 - ( --k * k * k * k );

        },

        InOut: function ( k ) {

            if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
            return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );

        }

    },

    Quintic: {

        In: function ( k ) {

            return k * k * k * k * k;

        },

        Out: function ( k ) {

            return --k * k * k * k * k + 1;

        },

        InOut: function ( k ) {

            if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
            return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );

        }

    },

    Sinusoidal: {

        In: function ( k ) {

            return 1 - Math.cos( k * Math.PI / 2 );

        },

        Out: function ( k ) {

            return Math.sin( k * Math.PI / 2 );

        },

        InOut: function ( k ) {

            return 0.5 * ( 1 - Math.cos( Math.PI * k ) );

        }

    },

    Exponential: {

        In: function ( k ) {

            return k === 0 ? 0 : Math.pow( 1024, k - 1 );

        },

        Out: function ( k ) {

            return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );

        },

        InOut: function ( k ) {

            if ( k === 0 ) return 0;
            if ( k === 1 ) return 1;
            if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
            return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );

        }

    },

    Circular: {

        In: function ( k ) {

            return 1 - Math.sqrt( 1 - k * k );

        },

        Out: function ( k ) {

            return Math.sqrt( 1 - ( --k * k ) );

        },

        InOut: function ( k ) {

            if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
            return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);

        }

    },

    Elastic: {

        In: function ( k ) {

            var s, a = 0.1, p = 0.4;
            if ( k === 0 ) return 0;
            if ( k === 1 ) return 1;
            if ( !a || a < 1 ) { a = 1; s = p / 4; }
            else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
            return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );

        },

        Out: function ( k ) {

            var s, a = 0.1, p = 0.4;
            if ( k === 0 ) return 0;
            if ( k === 1 ) return 1;
            if ( !a || a < 1 ) { a = 1; s = p / 4; }
            else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
            return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

        },

        InOut: function ( k ) {

            var s, a = 0.1, p = 0.4;
            if ( k === 0 ) return 0;
            if ( k === 1 ) return 1;
            if ( !a || a < 1 ) { a = 1; s = p / 4; }
            else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
            if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
            return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;

        }

    },

    Back: {

        In: function ( k ) {

            var s = 1.70158;
            return k * k * ( ( s + 1 ) * k - s );

        },

        Out: function ( k ) {

            var s = 1.70158;
            return --k * k * ( ( s + 1 ) * k + s ) + 1;

        },

        InOut: function ( k ) {

            var s = 1.70158 * 1.525;
            if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
            return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );

        }

    },

    Bounce: {

        In: function ( k ) {

            return 1 - TWEEN.Easing.Bounce.Out( 1 - k );

        },

        Out: function ( k ) {

            if ( k < ( 1 / 2.75 ) ) {

                return 7.5625 * k * k;

            } else if ( k < ( 2 / 2.75 ) ) {

                return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;

            } else if ( k < ( 2.5 / 2.75 ) ) {

                return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;

            } else {

                return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;

            }

        },

        InOut: function ( k ) {

            if ( k < 0.5 ) return TWEEN.Easing.Bounce.In( k * 2 ) * 0.5;
            return TWEEN.Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;

        }

    }

};

TWEEN.Interpolation = {

    Linear: function ( v, k ) {

        var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.Linear;

        if ( k < 0 ) return fn( v[ 0 ], v[ 1 ], f );
        if ( k > 1 ) return fn( v[ m ], v[ m - 1 ], m - f );

        return fn( v[ i ], v[ i + 1 > m ? m : i + 1 ], f - i );

    },

    Bezier: function ( v, k ) {

        var b = 0, n = v.length - 1, pw = Math.pow, bn = TWEEN.Interpolation.Utils.Bernstein, i;

        for ( i = 0; i <= n; i++ ) {
            b += pw( 1 - k, n - i ) * pw( k, i ) * v[ i ] * bn( n, i );
        }

        return b;

    },

    CatmullRom: function ( v, k ) {

        var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.CatmullRom;

        if ( v[ 0 ] === v[ m ] ) {

            if ( k < 0 ) i = Math.floor( f = m * ( 1 + k ) );

            return fn( v[ ( i - 1 + m ) % m ], v[ i ], v[ ( i + 1 ) % m ], v[ ( i + 2 ) % m ], f - i );

        } else {

            if ( k < 0 ) return v[ 0 ] - ( fn( v[ 0 ], v[ 0 ], v[ 1 ], v[ 1 ], -f ) - v[ 0 ] );
            if ( k > 1 ) return v[ m ] - ( fn( v[ m ], v[ m ], v[ m - 1 ], v[ m - 1 ], f - m ) - v[ m ] );

            return fn( v[ i ? i - 1 : 0 ], v[ i ], v[ m < i + 1 ? m : i + 1 ], v[ m < i + 2 ? m : i + 2 ], f - i );

        }

    },

    Utils: {

        Linear: function ( p0, p1, t ) {

            return ( p1 - p0 ) * t + p0;

        },

        Bernstein: function ( n , i ) {

            var fc = TWEEN.Interpolation.Utils.Factorial;
            return fc( n ) / fc( i ) / fc( n - i );

        },

        Factorial: ( function () {

            var a = [ 1 ];

            return function ( n ) {

                var s = 1, i;
                if ( a[ n ] ) return a[ n ];
                for ( i = n; i > 1; i-- ) s *= i;
                return a[ n ] = s;

            };

        } )(),

        CatmullRom: function ( p0, p1, p2, p3, t ) {

            var v0 = ( p2 - p0 ) * 0.5, v1 = ( p3 - p1 ) * 0.5, t2 = t * t, t3 = t * t2;
            return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

        }

    }

};

var ClassicalNoise = function(r) { // Classic Perlin noise in 3D, for comparison
    if (r == undefined) r = Math;
    this.grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
        [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
        [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
    this.p = [];
    for (var i=0; i<256; i++) {
        this.p[i] = Math.floor(r.random()*256);
    }
    // To remove the need for index wrapping, double the permutation table length
    this.perm = [];
    for(var i=0; i<512; i++) {
        this.perm[i]=this.p[i & 255];
    }
};

ClassicalNoise.prototype.dot = function(g, x, y, z) {
    return g[0]*x + g[1]*y + g[2]*z;
};

ClassicalNoise.prototype.mix = function(a, b, t) {
    return (1.0-t)*a + t*b;
};

ClassicalNoise.prototype.fade = function(t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
};

// Classic Perlin noise, 3D version
ClassicalNoise.prototype.noise = function(x, y, z) {
    // Find unit grid cell containing point
    var X = Math.floor(x);
    var Y = Math.floor(y);
    var Z = Math.floor(z);

    // Get relative xyz coordinates of point within that cell
    x = x - X;
    y = y - Y;
    z = z - Z;

    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    X = X & 255;
    Y = Y & 255;
    Z = Z & 255;

    // Calculate a set of eight hashed gradient indices
    var gi000 = this.perm[X+this.perm[Y+this.perm[Z]]] % 12;
    var gi001 = this.perm[X+this.perm[Y+this.perm[Z+1]]] % 12;
    var gi010 = this.perm[X+this.perm[Y+1+this.perm[Z]]] % 12;
    var gi011 = this.perm[X+this.perm[Y+1+this.perm[Z+1]]] % 12;
    var gi100 = this.perm[X+1+this.perm[Y+this.perm[Z]]] % 12;
    var gi101 = this.perm[X+1+this.perm[Y+this.perm[Z+1]]] % 12;
    var gi110 = this.perm[X+1+this.perm[Y+1+this.perm[Z]]] % 12;
    var gi111 = this.perm[X+1+this.perm[Y+1+this.perm[Z+1]]] % 12;

    // The gradients of each corner are now:
    // g000 = grad3[gi000];
    // g001 = grad3[gi001];
    // g010 = grad3[gi010];
    // g011 = grad3[gi011];
    // g100 = grad3[gi100];
    // g101 = grad3[gi101];
    // g110 = grad3[gi110];
    // g111 = grad3[gi111];
    // Calculate noise contributions from each of the eight corners
    var n000= this.dot(this.grad3[gi000], x, y, z);
    var n100= this.dot(this.grad3[gi100], x-1, y, z);
    var n010= this.dot(this.grad3[gi010], x, y-1, z);
    var n110= this.dot(this.grad3[gi110], x-1, y-1, z);
    var n001= this.dot(this.grad3[gi001], x, y, z-1);
    var n101= this.dot(this.grad3[gi101], x-1, y, z-1);
    var n011= this.dot(this.grad3[gi011], x, y-1, z-1);
    var n111= this.dot(this.grad3[gi111], x-1, y-1, z-1);
    // Compute the fade curve value for each of x, y, z
    var u = this.fade(x);
    var v = this.fade(y);
    var w = this.fade(z);
    // Interpolate along x the contributions from each of the corners
    var nx00 = this.mix(n000, n100, u);
    var nx01 = this.mix(n001, n101, u);
    var nx10 = this.mix(n010, n110, u);
    var nx11 = this.mix(n011, n111, u);
    // Interpolate the four results along y
    var nxy0 = this.mix(nx00, nx10, v);
    var nxy1 = this.mix(nx01, nx11, v);
    // Interpolate the two last results along z
    var nxyz = this.mix(nxy0, nxy1, w);

    return nxyz;
};



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





var GuiPropertyDataType = {
    INT: 0,
    FLOAT: 1,
    STRING: 2,
    BOOLEAN: 3,
    ID_REFERENCE: 4,
    UNIQUE_ID: 5,
    INT_LIST: 6,
    INT_SET: 7,
    INT_LIST_2D: 8,
    FLOAT_LIST: 9,
    FLOAT_SET: 10,
    FLOAT_LIST_2D: 11,
    STRING_LIST: 12,
    STRING_SET: 13,
    STRING_LIST_2D: 14,
    BOOLEAN_LIST: 15,
    BOOLEAN_LIST_2D: 16,
    OBJECT_LIST: 17,
    OBJECT: 18,
    PROCEDURE: 19,
    POSITIONED_1D_LIST: 20,
    OTHER: 21,
    ID_REFERENCE_LIST: 22
};


var StringListPropertyDisplayHint = {
    TEXT: 0,
    TEXT_AREA: 1,
    TEXT_LIST: 2,
    SELECT_LIST: 3
};


var NumberListPropertyDisplayHint = {
    TEXT: 0,
    TEXT_AREA: 1,
    TEXT_LIST: 2,
    SELECT_LIST: 3
};


var NumberList2DPropertyDisplayHint = {
    TEXT: 0,
    TEXT_AREA: 1,
    TEXT_LIST: 2
};


var NumberPropertyDisplayHint = {
    TEXT: 0,
    SLIDER: 1,
    SPINNER: 2,
    COMBOBOX: 3,
    LIST: 4,
    TABLE: 5,
    SPINNER_SLIDER: 6,
    RADIO_BUTTON: 7,
    SELECT: 8
};

var StringPropertyDisplayHint = {
    TEXT: 0,
    COMBOBOX: 1,
    LIST: 2,
    TABLE: 3,
    SELECT: 4,
    TEXT_AREA: 5
};

var BooleanPropertyDisplayHint = {
    TEXT: 0,
    COMBOBOX: 1,
    RADIO_BUTTON: 2,
    SELECT: 3
};

var IdReferencePropertyDisplayHint = {
    TEXT: 0,
    COMBOBOX: 1,
    RADIO_BUTTON: 2,
    SELECT: 3
};

var UniqueIdPropertyDisplayHint = {
    TEXT: 0
};

var ProcedureDisplayHint = {
    BUTTON: 0,
    SELECT: 1,
    MENU: 2
};

var ObjectDisplayHint = {
    PANEL: 0, // Show the object data within a panel and buttons for "unset", "create new" (using constructor infos)
    DIALOG: 1 // Open a dialog to edit object
};

var GuiListOrientation = {
    VERTICAL: 0,
    HORIZONTAL: 1
};

var GuiDetailPanelMode = {
    SHARE: 0,
    SEPARATE: 1,
    DIALOG: 2
};

var GuiSplitType = {
    TABS: 0,
    ACCORDION: 1,
    WINDOWS: 2
};

var GuiNewMode = {
    BUTTONS: 0,
    SELECT: 1,
    COMBOBOX: 2,
    DIALOG: 3
};


function GuiPropertyInfos(options) {
    this.infos = getValueOrDefault(options, "infos", new Map(true));
}

GuiPropertyInfos.prototype.addPropertyInfo = function(info) {
    this.infos.put(info.propertyName, info);
    return this;
};

GuiPropertyInfos.prototype.getPropertyInfo = function(propertyName) {
    return this.infos.get(propertyName);
};

GuiPropertyInfos.prototype.getAsArray = function() {
    return this.infos.listValues();
};

function IndentInfo() {
    this.level = 0;
    this.whiteSpaceString = " ";
}

IndentInfo.prototype.getWhiteSpaceString = function() {
    var result = "";
    for (var i=0; i<this.level; i++) {
        result += this.whiteSpaceString;
    }
    return result;
};


function PropertyConstraint() {
}

PropertyConstraint.prototype.isValid = function(object, propertyName, value) {
    return true;
};

PropertyConstraint.prototype.getInvalidDescription = function(object, propertyName, value) {
    return "";
};

function RangePropertyConstraint(range) {
    this.range = range || [0, 1];
}
RangePropertyConstraint.prototype = new PropertyConstraint();

RangePropertyConstraint.prototype.isValid = function(object, propertyName, value) {
    return value >= this.range[0] && value <= this.range[1];
};

RangePropertyConstraint.prototype.getInvalidDescription = function(object, propertyName, value) {
    if (value < this.range[0]) {
        return "Must be greater than or equal " + this.range[0];
    }
    if (value > this.range[1]) {
        return "Must be less than or equal " + this.range[1];
    }
    return "";
};

function MinPropertyConstraint(minValue) {
    this.minValue = minValue;
}
MinPropertyConstraint.prototype = new PropertyConstraint();

MinPropertyConstraint.prototype.isValid = function(object, propertyName, value) {
    return value >= this.minValue;
};

MinPropertyConstraint.prototype.getInvalidDescription = function(object, propertyName, value) {
    if (value < this.minValue) {
        return "Must be greater than or equal " + this.minValue;
    }
    return "";
};

function MaxPropertyConstraint(maxValue) {
    this.maxValue = maxValue;
}
MaxPropertyConstraint.prototype = new PropertyConstraint();

MaxPropertyConstraint.prototype.isValid = function(object, propertyName, value) {
    return value <= this.maxValue;
};

MaxPropertyConstraint.prototype.getInvalidDescription = function(object, propertyName, value) {
    if (value > this.maxValue) {
        return "Must be less than or equal " + this.maxValue;
    }
    return "";
};


function ArrayMinLengthConstraint(minLength) {
    this.minLength = typeof(minLength) === 'undefined' ? 1 : minLength;
}
ArrayMinLengthConstraint.prototype = new PropertyConstraint();

ArrayMinLengthConstraint.prototype.isValid = function(object, propertyName, value) {
    return value.length >= this.minLength;
};

ArrayMinLengthConstraint.prototype.getInvalidDescription = function(object, propertyName, value) {
    if (value.length < this.minLength) {
        return "Must contain at least " + this.minLength + " " + (this.minLength == 1 ? "item" : "items");
    }
    return "";
};



function ArrayElementConstraint(constraint) {
    this.elementConstraint = constraint || {
        isValid: function() {
            return true;
        },
        getInvalidDescription: function() {
            return "";
        }
    };
}
ArrayElementConstraint.prototype = new PropertyConstraint();

ArrayElementConstraint.prototype.isValid = function(object, propertyName, value) {
    if (this.elementConstraint) {
        if (isArray(value)) {
//            logit("Checking array elements in " + value.join(", ") + " prop name: " + propertyName);
            for (var i=0; i<value.length; i++) {
                if (!this.elementConstraint.isValid(object, propertyName + "[" + i + "]", value[i])) {
                    return false;
                }
            }
        }
    }
    return true;
};

ArrayElementConstraint.prototype.getInvalidDescription = function(object, propertyName, value) {
    if (this.elementConstraint) {
        if (isArray(value)) {
            for (var i=0; i<value.length; i++) {
                var propName = propertyName + "[" + i + "]";
                if (!this.elementConstraint.isValid(object, propName, value[i])) {
                    return "Item " + (i+1) + ": " + this.elementConstraint.getInvalidDescription(object, propName, value[i]);
                }
            }
        }
    }
    return "";
};



// Constraint example:
//
// var dummyConstraint = {
//    isValid: function(object, propName, value) {
//        return true;
//    },
//    getPossibleValues: function(object, propName) {
//        return [1, 3, 7];
//    },
//    getMinValue: function(object, propName) {
//        return 0;
//    },
//    getMaxValue: function(object, propName) {
//        return 10;
//    },
//    getValueIncrement: function(object, propName) {
//        return 1;
//    },
//    getInvalidDescription: function(object, propName, value) {
//        return "invalid value";
//    }
// };
//


// Used for splitting up into tabs, windows, accordions etc.
function GuiSplitInfo(options) {
    this.group = getValueOrDefault(options, "group", "Group");
    this.groupCaption = getValueOrDefault(options, "groupCaption", "");
    this.splitType = getValueOrDefault(options, "splitType", GuiSplitType.TABS);
}



function GuiListInfo(options) {
    this.constructorInfos = getValueOrDefault(options, "constructorInfos", []);
    this.newMode = getValueOrDefault(options, "newMode", GuiNewMode.BUTTONS);
    this.itemsDisplayFunction = getValueOrDefault(options, "itemsDisplayFunction", null); // How to display the container elements
    this.detailPanelMode = getValueOrDefault(options, "detailPanelMode", GuiDetailPanelMode.SEPARATE);
    this.possibleValues = getValueOrDefault(options, "possibleValues", []);
}

function GuiObjectInfo(options) {
    this.constructorInfos = getValueOrDefault(options, "constructorInfos", []);
    this.newMode = getValueOrDefault(options, "newMode", GuiNewMode.BUTTONS);
    this.canUnset = getValueOrDefault(options, "canUnset", true);
}


//var uniqueIdManager = {
//    addUniqueIdListener: function(namespaces, listener) {
//        // Adding the listener to
//    },
//    removeUniqueIdListener: function(namespaces, listener) {
//        //
//    },
//    uniqueIdAvailable: function(namespace, testId) {
//        //
//    },
//    getUniqueIds: function(namespace) {
//        //
//    },
//    changeUniqueId: function(namespace, oldId, newId) {
//        // Make sure that all listeners of that namespace know about this
//    },
//    removeUniqueId: function(namespace, oldId, newId) {
//        // Make sure that all listeners of that namespace know about this
//    }
//}
//


function GuiUniqueIdInfo(options) {
    this.manager = getValueOrDefault(options, "manager", null);
    this.namespace = getValueOrDefault(options, "namespace", "ns");
    this.initPrefix = getValueOrDefault(options, "initPrefix", "id"); // Used for new objects
}

function GuiProcedureInfo(options) {
    this.args = getValueOrDefault(options, "args", []);
    this.targetObject = getValueOrDefault(options, "targetObject", null); // What should be used as "this". The component is used instead if null.
    this.group = getValueOrDefault(options, "group", "procedureGroup"); // For grouping procedures in menus, select options etc.
}

function GuiConstructorInfo(options) {
    this.name = getValueOrDefault(options, "name", "");
    this.text = getValueOrDefault(options, "text", "");
    this.nameIsConstructor = getValueOrDefault(options, "nameIsConstructor", true);
    this.createValue = getValueOrDefault(options, "createValue", function() {return 0});
}


// Used for stuff that has a position (either implicit or explicit)
// * position + length: All explicit
// * length only: Position is implicit with the order and lengths
// * position only: Length is implicit
// * no position/length: Length and position is implicit
function GuiPositioned1DListInfo(options) {
    this.constructorInfos = getValueOrDefault(options, "constructorInfos", []);
    this.newMode = getValueOrDefault(options, "newMode", GuiNewMode.BUTTONS);
    this.detailPanelMode = getValueOrDefault(options, "detailPanelMode", GuiDetailPanelMode.SEPARATE);
    this.positionPropertyName = getValueOrDefault(options, "positionPropertyName", null);
    this.lengthPropertyName = getValueOrDefault(options, "lengthPropertyName", null);
    this.allowOverlap = getValueOrDefault(options, "allowOverlap", false); // Only when both position and length are explicit
    this.positionSnapFunction = getValueOrDefault(options, "positionSnapFunction", null);
    this.lengthSnapFunction = getValueOrDefault(options, "lengthSnapFunction", null);
}

function GuiOtherInfo(options) {
    this.componentConstructor = getValueOrDefault(options, "componentConstructor", "");
    this.data = getValueOrDefault(options, "data", null);
}


function GuiPropertyInfo(options) {
    this.propertyName = getValueOrDefault(options, "propertyName", "propName");
    this.propertyCaption = getValueOrDefault(options, "propertyCaption", "Prop. Caption");
    this.dataType = getValueOrDefault(options, "dataType", GuiPropertyDataType.INT);
    this.possibleValues = getValueOrDefault(options, "possibleValues", []);
    this.defaultValue = getValueOrDefault(options, "defaultValue", 0);
    this.allowNull = getValueOrDefault(options, "allowNull", false); // Not always possible
    this.displayHint = getValueOrDefault(options, "displayHint", NumberPropertyDisplayHint.TEXT);
    this.shortDescription = getValueOrDefault(options, "shortDescription", null); // Single line short string
    this.longDescription = getValueOrDefault(options, "longDescription", null); // Single line string
    this.multilineDescription = getValueOrDefault(options, "multilineDescription", null); // Array of strings
    this.convertFunction = getValueOrDefault(options, "convertFunction", null); // function(propName, value) {return Math.round(value);}
    this.displayFunction = getValueOrDefault(options, "displayFunction", null); // function(propName, value) {return "string representation"}
    this.constraints = getValueOrDefault(options, "constraints", []);
    this.splitInfo = getValueOrDefault(options, "splitInfo", null); // Used for splitting up content into tabs, windows etc.
    this.listInfo = getValueOrDefault(options, "listInfo", null); // Only used when the property is a container
    this.objectInfo = getValueOrDefault(options, "objectInfo", null); // Only used when the property is an object
    this.uniqueIdInfo = getValueOrDefault(options, "uniqueIdInfo", null); // Used for unique ids
    this.procedureInfo = getValueOrDefault(options, "procedureInfo", null); // Used when the "property" is a method name
    this.positioned1DListInfo = getValueOrDefault(options, "positioned1DListInfo", null); //
    this.propertyInfoProvider = getValueOrDefault(options, "propertyInfoProvider", null); //
    this.otherInfo = getValueOrDefault(options, "otherInfo", null); //
    this.componentRegisters = getValueOrDefault(options, "componentRegisters", []); //
}


GuiPropertyInfo.prototype.getValue = function(object) {
};



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

function IdReferenceListSelectComponent(object, propertyInfo) {
    GuiPropertySelectListComponent.call(this, object, propertyInfo);
    var manager = this.getUniqueIdManager();
    if (manager) {
        manager.addUniqueIdListener(this.propertyInfo.uniqueIdInfo.namespace, this);
    } else {
        logit("Could not find unique id manager in IdReferenceListSelectComponent<br />");
    }
}

IdReferenceListSelectComponent.prototype = new GuiPropertySelectListComponent();


IdReferenceListSelectComponent.prototype.getItemValue = function(itemString) {
    return itemString;
};

IdReferenceListSelectComponent.prototype.componentRemoved = function() {
    GuiPropertySelectListComponent.prototype.componentRemoved.call(this);
    var manager = this.getUniqueIdManager();
    if (manager) {
        manager.removeUniqueIdListener(this.propertyInfo.uniqueIdInfo.namespace, this);
    }
};

IdReferenceListSelectComponent.prototype.uniqueIdAdded = function(owner, namespace, newId) {
    this.addOption(newId, newId);
};

IdReferenceListSelectComponent.prototype.uniqueIdChanged = function(owner, namespace, oldId, newId) {
    this.changeOption(oldId, newId, newId);
};

IdReferenceListSelectComponent.prototype.uniqueIdRemoved = function(owner, namespace, theId) {
    this.removeOption(theId, "");
};

IdReferenceListSelectComponent.prototype.getValuesAndNames = function() {
    var result = [["", "None"]];
    var manager = this.getUniqueIdManager();
    if (manager) {
        var ids = manager.getUniqueIds(this.getUniqueIdNamespace());
        for (var i=0; i<ids.length; i++) {
            result.push([ids[i], ids[i]]);
        }
    }
    return result;
};


function IntegerSelectComponent(object, propertyInfo) {
    GuiPropertySelectComponent.call(this, object, propertyInfo);
}

IntegerSelectComponent.prototype = new GuiPropertySelectComponent();

IntegerSelectComponent.prototype.setValueVerifyRaw = function() {
    var value = this.$input.val();
    var intValue = parseInt(value);
    var error = isNaN(intValue);
    this.setError(error, "Invalid integer");
    if (!error) {
        this.setValueVerify(intValue);
    }
};


function IntegerListSelectComponent(object, propertyInfo) {
    GuiPropertySelectListComponent.call(this, object, propertyInfo);
}

IntegerListSelectComponent.prototype = new GuiPropertySelectListComponent();


IntegerListSelectComponent.prototype.getItemValue = function(itemString) {
    var intValue = parseInt(itemString);
    return intValue;
};




function FloatSelectComponent(object, propertyInfo) {
    GuiPropertySelectComponent.call(this, object, propertyInfo);
}

FloatSelectComponent.prototype = new GuiPropertySelectComponent();

FloatSelectComponent.prototype.setValueVerifyRaw = function() {
    var value = this.$input.val();
    var floatValue = parseFloat(value);
    var error = isNaN(floatValue);
    this.setError(error, "Invalid decimal");
    if (!error) {
        this.setValueVerify(floatValue);
    }
};

function StringSelectComponent(object, propertyInfo) {
    GuiPropertySelectComponent.call(this, object, propertyInfo);
}

StringSelectComponent.prototype = new GuiPropertySelectComponent();

StringSelectComponent.prototype.setValueVerifyRaw = function() {
    var value = this.$input.val();
    this.setValueVerify(value);
};

function BooleanSelectComponent(object, propertyInfo) {
    GuiPropertySelectComponent.call(this, object, propertyInfo);
}

BooleanSelectComponent.prototype = new GuiPropertySelectComponent();

BooleanSelectComponent.prototype.setValueVerifyRaw = function() {
    var textValue = this.$input.val();
    var booleanValue = textValue == "true" ? true : false;
    //    logit(" in boolean select: textValue: " + textValue + " booleanValue: " + booleanValue + "<br />");
    this.setValueVerify(booleanValue);
};

BooleanSelectComponent.prototype.getValuesAndNames = function() {
    var result = [];
    var values = [true, false];
    for (var i=0; i<values.length; i++) {
        var value = values[i];
        var displayValue = value;
        if (this.propertyInfo.displayFunction) {
            displayValue = this.propertyInfo.displayFunction.call(this, this.object, this.propertyInfo.propertyName, value);
        }
        result.push([value, displayValue]);
    }
    return result;
};



function IntegerTextComponent(object, propertyInfo) {
    GuiPropertyTextComponent.call(this, object, propertyInfo);
}

IntegerTextComponent.prototype = new GuiPropertyTextComponent();

IntegerTextComponent.prototype.setValueVerifyRaw = function() {
    var error = false;
    var textValue = this.$input.val();

    var parseResult = {};
    this.parseInteger(textValue, parseResult);

    error = parseResult.error;

    if (!parseResult.error) {
        error = this.verifyNumberConstraints(parseResult.value);
        if (error) {
            // The setError() is called in verifyNumberConstraints()
            return;
        }
    }
    this.setError(error, "Invalid integer");

    if (!error) {
        this.setValueVerify(parseResult.value);
    }
};


function StringTextAreaComponent(object, propertyInfo) {
    GuiPropertyTextComponent.call(this, object, propertyInfo);
    this.inputTag = "textarea";
}

StringTextAreaComponent.prototype = new GuiPropertyTextComponent();

StringTextAreaComponent.prototype.setValueVerifyRaw = function() {
    var textValue = this.$input.val();
    this.setValueVerify(textValue);
};


function IntegerListTextComponent(object, propertyInfo) {
    GuiPropertyTextComponent.call(this, object, propertyInfo);
}

IntegerListTextComponent.prototype = new GuiPropertyTextComponent();

IntegerListTextComponent.prototype.valueToString = function(value) {
    return value.join(" ");
};


IntegerListTextComponent.prototype.setValueVerifyRaw = function() {
    var error = false;
    var errorMessage = "";

    var textValue = this.$input.val();

    textValue = $.trim(textValue);

    var textArray = textValue.split(" ");

    var intArr = [];
    for (var i=0; i<textArray.length; i++) {
        var text = $.trim(textArray[i]);
        if (text) {
            var parseResult = {};
            this.parseInteger(text, parseResult);
            if (!parseResult.error) {
                intArr.push(parseResult.value);
            }
            error = parseResult.error;
        }
        if (error) {
            errorMessage = "Invalid integer: '" + text + "'";
            break;
        }
    }
    this.setError(error, errorMessage);

    if (!error) {
        this.setValueVerify(intArr);
    }
};


function IntegerList2DTextComponent(object, propertyInfo) {
    GuiPropertyTextComponent.call(this, object, propertyInfo);
}

IntegerList2DTextComponent.prototype = new GuiPropertyTextComponent();

IntegerList2DTextComponent.prototype.valueToString = function(value) {
    var result = "";
    for (var i=0; i<value.length; i++) {
        var arr = value[i];
        result += arr.join(" ");
        if (i < value.length - 1) {
            result += ", ";
        }
    }
    return result;
};


IntegerList2DTextComponent.prototype.setValueVerifyRaw = function() {
    var error = false;
    var errorMessage = "";

    var textValue = this.$input.val();

    textValue = $.trim(textValue);

    var intArrs = [];

    var arrayTexts = textValue.split(",");

    for (var j=0; j<arrayTexts.length; j++) {
        var arrayText = arrayTexts[j];

        var textArray = arrayText.split(" ");

        var intArr = [];
        for (var i=0; i<textArray.length; i++) {
            var text = $.trim(textArray[i]);
            if (text) {
                var parseResult = {};
                this.parseInteger(text, parseResult);
                if (!parseResult.error) {
                    intArr.push(parseResult.value);
                }
                error = parseResult.error;
            }
            if (error) {
                errorMessage = "Invalid integer: '" + text + "'";
                break;
            }
        }
        if (error) {
            break;
        }
        if (intArr.length > 0) {
            intArrs.push(intArr);
        }
    }
    this.setError(error, errorMessage);

    if (!error) {
        this.setValueVerify(intArrs);
        //        logit("Setting value to " + JSON.stringify(intArrs) + "<br />");
    }
};




function FloatTextComponent(object, propertyInfo) {
    GuiPropertyTextComponent.call(this, object, propertyInfo);
}

FloatTextComponent.prototype = new GuiPropertyTextComponent();

FloatTextComponent.prototype.setValueVerifyRaw = function() {
    var error = false;
    var textValue = this.$input.val();
    if (!error) {
        var floatValue = parseFloat(textValue);
        error = isNaN(floatValue);
    }
    if (!error) {
        error = this.verifyNumberConstraints(floatValue);
        if (error) {
            // The setError() is called in verifyNumberConstraints()
            return;
        }
    }
    this.setError(error, "Invalid decimal");

    if (!error) {
        this.setValueVerify(floatValue);
    }
};


function FloatListTextComponent(object, propertyInfo) {
    GuiPropertyTextComponent.call(this, object, propertyInfo);
}

FloatListTextComponent.prototype = new GuiPropertyTextComponent();

FloatListTextComponent.prototype.valueToString = function(value) {
    return value.join(" ");
};


FloatListTextComponent.prototype.setValueVerifyRaw = function() {
    var error = false;
    var errorMessage = "";

    var textValue = this.$input.val();

    textValue = $.trim(textValue);

    var textArray = textValue.split(" ");

    var floatArr = [];
    for (var i=0; i<textArray.length; i++) {
        var text = $.trim(textArray[i]);
        if (text) {
            var floatValue = parseFloat(text);
            error = isNaN(floatValue);
            if (!error) {
                floatArr.push(floatValue);
            }
        }
        if (error) {
            errorMessage = "Invalid decimal: '" + text + "'";
            break;
        }
    }
    this.setError(error, errorMessage);

    if (!error) {
        this.setValueVerify(floatArr);
    }
};


function FloatList2DTextComponent(object, propertyInfo) {
    GuiPropertyTextComponent.call(this, object, propertyInfo);
}

FloatList2DTextComponent.prototype = new GuiPropertyTextComponent();

FloatList2DTextComponent.prototype.valueToString = function(value) {
    var result = "";
    for (var i=0; i<value.length; i++) {
        var arr = value[i];
        result += arr.join(" ");
        if (i < value.length - 1) {
            result += ", ";
        }
    }
    return result;
};


FloatList2DTextComponent.prototype.setValueVerifyRaw = function() {
    var error = false;
    var errorMessage = "";

    var textValue = this.$input.val();

    textValue = $.trim(textValue);

    var floatArrs = [];

    if (textValue != "") {

        var arrayTexts = textValue.split(",");

        for (var j=0; j<arrayTexts.length; j++) {
            var arrayText = arrayTexts[j];

            var textArray = arrayText.split(" ");

            var floatArr = [];
            for (var i=0; i<textArray.length; i++) {
                var text = $.trim(textArray[i]);
                if (text) {

                    var floatValue = parseFloat(text);
                    error = isNaN(floatValue);
                    if (!error) {
                        floatArr.push(floatValue);
                    }
                }
                if (error) {
                    errorMessage = "Invalid decimal: '" + text + "'";
                    break;
                }
            }
            if (error) {
                break;
            }
            floatArrs.push(floatArr);
        }
        this.setError(error, errorMessage);
    }
    if (!error) {
        this.setValueVerify(floatArrs);
        //        logit("Setting value to " + JSON.stringify(intArrs) + "<br />");
    }
};



function StringNotEmptyConstraint(options) {
    this.errorMessage = getValueOrDefault(options, "errorMessage", "Must not be empty");
}

StringNotEmptyConstraint.prototype.isValid = function(object, propName, value) {
    return value != "";
};

StringNotEmptyConstraint.prototype.getInvalidDescription = function(object, propName, value) {
    return this.errorMessage;
};

function StringLengthConstraint(options) {
    this.maxLength = getValueOrDefault(options, "maxLength", 9999999999999);
    this.minLength = getValueOrDefault(options, "minLength", 0);
}

StringLengthConstraint.prototype.isValid = function(object, propName, value) {
    return value.length <= this.maxLength && value.length >= this.minLength;
};

StringLengthConstraint.prototype.getInvalidDescription = function(object, propName, value) {
    if (value.length < this.minLength) {
        var charStr = this.minLength == 1 ? "character" : "characters";
        return "Must have at least " + this.minLength + " " + charStr;
    }
    if (value.length > this.maxLength) {
        var charStr = this.maxLength == 1 ? "character" : "characters";
        return "Must have at most " + this.maxLength + " " + charStr;
    }
    return "";
};

function StringTextComponent(object, propertyInfo) {
    GuiPropertyTextComponent.call(this, object, propertyInfo);
}

StringTextComponent.prototype = new GuiPropertyTextComponent();

StringTextComponent.prototype.setValueVerifyRaw = function() {
    var error = false;
    var textValue = this.$input.val();
    if (!error) {
        this.setValueVerify(textValue);
    }
};


function IdReferenceSelectComponent(object, propertyInfo) {
    GuiPropertySelectComponent.call(this, object, propertyInfo);

    // this.hasValueTypeRadios = false;
    var manager = this.getUniqueIdManager();
    if (manager) {
        manager.addUniqueIdListener(this.propertyInfo.uniqueIdInfo.namespace, this);
    } else {
        logit("Could not find unique id manager in IdReferenceSelectComponent<br />");
    }
}

IdReferenceSelectComponent.prototype = new GuiPropertySelectComponent();


IdReferenceSelectComponent.prototype.componentRemoved = function() {
    GuiPropertySelectComponent.prototype.componentRemoved.call(this);
    var manager = this.getUniqueIdManager();
    if (manager) {
        manager.removeUniqueIdListener(this.propertyInfo.uniqueIdInfo.namespace, this);
    }
};

IdReferenceSelectComponent.prototype.uniqueIdAdded = function(owner, namespace, newId) {
    this.addOption(newId, newId);
};

IdReferenceSelectComponent.prototype.uniqueIdChanged = function(owner, namespace, oldId, newId) {
    this.changeOption(oldId, newId, newId);
};

IdReferenceSelectComponent.prototype.uniqueIdRemoved = function(owner, namespace, theId) {
    this.removeOption(theId, "");
};

IdReferenceSelectComponent.prototype.getValuesAndNames = function() {
    var result = [["", "None"]];
    var manager = this.getUniqueIdManager();
    if (manager) {
        var ids = manager.getUniqueIds(this.getUniqueIdNamespace());
        for (var i=0; i<ids.length; i++) {
            result.push([ids[i], ids[i]]);
        }
    }
    return result;
};

IdReferenceSelectComponent.prototype.setValueVerifyRaw = function() {
    var value = this.$input.val();
    this.setValueVerify(value);
};


function ProcedureButtonComponent(object, propertyInfo) {
    GuiPropertyComponent.call(this, object, propertyInfo);
    this.tagName = "button";
    this.setUniqueId();
}

ProcedureButtonComponent.prototype = new GuiPropertyComponent();

ProcedureButtonComponent.prototype.getHtmlContentBeforeChildren = function(resultArr) {
    resultArr.push(this.propertyInfo.propertyCaption);
};


ProcedureButtonComponent.prototype.jQueryCreated = function($localRoot) {
    GuiPropertyComponent.prototype.jQueryCreated.call(this, $localRoot);
    this.$component.button();
    var propertyInfo = this.propertyInfo;
    var object = this.object;
    var comp = this;
    this.$component.on("click", function() {
        var procInfo = propertyInfo.procedureInfo;
        var args = [];
        var targetObject = null;
        if (procInfo) {
            args = procInfo.args;
            targetObject = procInfo.targetObject;
        }
        if (!targetObject) {
            targetObject = comp;
        }
        var proc = targetObject[propertyInfo.propertyName];
        if (proc && $.isFunction(proc)) {
            proc.apply(targetObject, args);
        } else {
            logit("Could not find procedure " + propertyInfo.propertyName + " in ProcedureButtonComponent<br />");
            logit("" + targetObject._constructorName + " " + propertyInfo.propertyName + "<br />");
        }
    });
};



function UniqueIdTextComponent(object, propertyInfo) {
    GuiPropertyTextComponent.call(this, object, propertyInfo);
    this.hasValueTypeRadios = false;

}

UniqueIdTextComponent.prototype = new GuiPropertyTextComponent();

UniqueIdTextComponent.prototype.setValueVerifyRaw = function() {
    var error = false;
    var errorText = "";
    var textValue = this.$input.val();

    if (!textValue) {
        error = true;
        errorText = "ID can not be empty";
    }
    var oldValue = this.getValue();
    if (!error && oldValue != textValue) {
        var manager = this.getUniqueIdManager();
        var namespace = this.getUniqueIdNamespace();
        error = !manager.uniqueIdAvailable(this.object, namespace, textValue);
        if (error) {
            errorText = "ID already exists";
        }
    }
    if (!error) {
        if (this.setValueVerify(textValue) && oldValue != textValue) {
            manager.changeUniqueId(this.object, namespace, oldValue, textValue);
        }
    } else {
        this.setError(true, errorText);
    }
};


function GuiObjectComponent(object, propertyInfo) {
    GuiPropertyComponent.call(this, object, propertyInfo);

    this.$details = null;
    this.cssClassName = "object-list-panel";
    this.otherCssClasses.push("ui-widget-content");
    this.setUniqueId();

    this.detailsId = this.id + "-details";
    this.newButtonIdPrefix = this.id + "-new-button";

    this.detailsComponent = null;

    this._constructorName = "GuiObjectComponent";
}

GuiObjectComponent.prototype = new GuiPropertyComponent();



GuiObjectComponent.prototype.componentRemoved = function() {
    GuiPropertyComponent.prototype.componentRemoved.call(this);
    if (this.detailsComponent) {
        this.detailsComponent.componentRemoved();
    }
};

GuiObjectComponent.prototype.removeDetailsComponent = function() {
    if (this.detailsComponent) {
        this.detailsComponent.componentRemoved();
        this.detailsComponent = null;
    }
};


GuiObjectComponent.prototype.getHtmlContentBeforeChildren = function(resultArr) {
    resultArr.push("<div>" + this.propertyInfo.propertyCaption + "</div>");

    var objectInfo = this.propertyInfo.objectInfo;
    this.getConstructorsHtml(resultArr,
        objectInfo.constructorInfos, objectInfo.newMode);
    // Details panel
    resultArr.push("<div ");
    resultArr.push("id=\"" + this.detailsId + "\" ");
    resultArr.push(">\n");
    resultArr.push("</div>\n");
};



GuiObjectComponent.prototype.jQueryCreated = function($localRoot) {
    GuiPropertyComponent.prototype.jQueryCreated.call(this, $localRoot);
    this.$details = this.$component.find("#" + this.detailsId);

    var objectInfo = this.propertyInfo.objectInfo;

    var comp = this;

    this.addConstructorClickListeners(objectInfo.constructorInfos, function(constrInfo) {
        //        logit("Creating " + constrInfo.text + "<br />");
        var newValue = comp.createNewValue(constrInfo, comp.propertyInfo);
        comp.setValueVerify(newValue);
        //        comp.object[comp.propertyInfo.propertyName] = newValue;
        comp.updateDetailsPanel();
    }, objectInfo.newMode);
    this.updateDetailsPanel();
};


GuiObjectComponent.prototype.updateDetailsPanel = function() {
    var value = this.getValue();

    var propInfo = this.propertyInfo;

    this.$details.empty();
    this.removeDetailsComponent();

    var instanceText = null;
    var constructorInfos = propInfo.objectInfo.constructorInfos;
    if (constructorInfos.length > 1) {
        for (var i=0; i<constructorInfos.length; i++) {
            var ci = constructorInfos[i];
            if (ci.nameIsConstructor && ci.name == value._constructorName) {
                instanceText = ci.text;
                break;
            }
        }
    }

    // Create or get the details component
    var newComponent = new GuiPropertiesComponent({
        propertyInfoProvider: propInfo.propertyInfoProvider,
        object: value,
        componentRegisters: propInfo.componentRegisters
    });
    newComponent.spawn(this.$details);
    if (instanceText) {
        newComponent.$component.prepend($("<div><p>" + instanceText + "</p></div>"));
    }
    newComponent.alignComponents();

    this.detailsComponent = newComponent;
};





function IntegerSliderComponent(object, propertyInfo) {
    GuiPropertySliderComponent.call(this, object, propertyInfo);
}

IntegerSliderComponent.prototype = new GuiPropertySliderComponent();

IntegerSliderComponent.prototype.setValueVerifyRaw = function() {
    var error = false;
    var value = this.$input.slider("value");

    if (!error) {
        this.setValueVerify(value);
    }
};


function GuiObjectListComponent(object, propertyInfo) {
    GuiAbstractListComponent.call(this, object, propertyInfo);
    this.$details = null;
    this.cssClassName = "object-list-panel";
    this.otherCssClasses.push("ui-widget-content");
    this.setUniqueId();

    this.setIds();

    this._constructorName = "GuiObjectListComponent";

    this.currentDetailComponent = null;

    var uiInfo = propertyInfo.uniqueIdInfo;
//    uiInfo.manager.addUniqueIdListener(uiInfo.namespace, this);
}

GuiObjectListComponent.prototype = new GuiAbstractListComponent();


GuiObjectListComponent.prototype.componentRemoved = function() {
    GuiAbstractListComponent.prototype.componentRemoved.call(this);
    var uiInfo = this.propertyInfo.uniqueIdInfo;
//    uiInfo.manager.removeUniqueIdListener(uiInfo.namespace, this);
    if (this.currentDetailComponent) {
        this.currentDetailComponent.componentRemoved();
    }
};



GuiObjectListComponent.prototype.getHtmlContentBeforeChildren = function(resultArr) {

    GuiAbstractListComponent.prototype.getHtmlContentBeforeChildren.call(this, resultArr);


    // Details panel
    resultArr.push("<div ");
    resultArr.push("id=\"" + this.detailsId + "\" ");
    resultArr.push(">\n");
    resultArr.push("</div>\n");

};


GuiObjectListComponent.prototype.jQueryCreated = function($localRoot) {
    GuiAbstractListComponent.prototype.jQueryCreated.call(this, $localRoot);

    this.$details = this.$component.find("#" + this.detailsId);
};

GuiObjectListComponent.prototype.itemAppended = function($newItem, newValue) {
    GuiAbstractListComponent.prototype.itemAppended.call(this, $newItem, newValue);
    this.callChangeListeners();
};


GuiObjectListComponent.prototype.deleteSelectedItems = function() {
    GuiAbstractListComponent.prototype.deleteSelectedItems.call(this);
    this.updateDetailsPanel();
    this.callChangeListeners();
};

GuiObjectListComponent.prototype.removeDetailComponent = function() {
    if (this.currentDetailComponent) {
        //        this.propertyInfo.

        this.currentDetailComponent.componentRemoved();
        this.currentDetailComponent = null;
    }
};


GuiObjectListComponent.prototype.updateDetailsPanel = function() {
    var selectedArr = this.getSelectedItems();
    var comp = this;
    var propInfo = this.propertyInfo;
    if (selectedArr.length == 1) {
        var item = selectedArr[0];

        var valueItem = $(item).data("value");

        if (valueItem) {
            this.$details.empty();
            // Create or get the details component
            //            logit("Creating details component with parentPropInfo " + propInfo + "<br />");

            var instanceText = null;
            var constructorInfos = propInfo.listInfo.constructorInfos;
            if (constructorInfos.length > 1) {
                for (var i=0; i<constructorInfos.length; i++) {
                    var ci = constructorInfos[i];
                    if (ci.nameIsConstructor && ci.name == valueItem._constructorName) {
                        instanceText = ci.text;
                        break;
                    }
                }
            }
            var newComponent = new GuiPropertiesComponent({
                propertyInfoProvider: propInfo.propertyInfoProvider,
                object: valueItem,
                parentPropertyInfo: propInfo,
                componentRegisters: propInfo.componentRegisters
            });

            var that = this;
            newComponent.changeListeners.push(
                function(c, oldValue, newValue) {
                    that.callChangeListeners();
                    var items = that.getSelectedItems();
                    for (var i=0; i<items.length; i++) {
                        var item = items[i];
                        var valueItem = $(item).data("value");
                        var rArr = [];
                        that.getListItemContentHtml(valueItem, rArr);
//                            logit("new item html " + rArr.join(""));
                        $(item).find(".object-list-item-content")[0].innerHTML = rArr.join("");
                    }
                }
            );

            this.$details.show();
            newComponent.spawn(this.$details);
            if (instanceText) {
                newComponent.$component.prepend($("<div><p>" + instanceText + "</p></div>"));
            }
            newComponent.alignComponents();

            // Make sure that the previous detail component knows about its removal
            this.removeDetailComponent();
            this.currentDetailComponent = newComponent;
            // Show the details
        }
    } else {
        // Hide all details
        this.$details.empty();
        this.removeDetailComponent();
    }
};


GuiObjectListComponent.prototype.listItemSelected = function(event, ui) {
    GuiAbstractListComponent.prototype.listItemSelected.call(this, event, ui);
    this.updateDetailsPanel();
};


GuiObjectListComponent.prototype.listItemUnselected = function(event, ui) {
    GuiAbstractListComponent.prototype.listItemUnselected.call(this, event, ui);
    this.updateDetailsPanel();
};


function UniqueIdManager() {
    this.listeners = {};
    this.uniqueIdInfos = {};

    this.globalListeners = [];
//var uniqueIdListener = {
//    uniqueIdAdded: function(owner, namespace, id) {
//    },
//    uniqueIdChanged: function(owner, namespace, oldId, newId) {
//    },
//    uniqueIdRemoved: function(owner, namespace, id) {
//    }
//}

}

UniqueIdManager.prototype.addGlobalUniqueIdListener = function(listener) {
    this.globalListeners.push(listener);
};


UniqueIdManager.prototype.addUniqueIdListener = function(namespace, listener) {
    var listenerArr = this.listeners[namespace];
    if (!listenerArr) {
        listenerArr = [];
        this.listeners[namespace] = listenerArr;
    }
    listenerArr.push(listener);
};

UniqueIdManager.prototype.removeUniqueIdListener = function(namespace, listener) {
    var listenerArr = this.listeners[namespace];
    if (listenerArr) {
        arrayDelete(listenerArr, listener);
    }
};


UniqueIdManager.prototype.uniqueIdAvailable = function(owner, namespace, testId) {
    var idInfos = this.uniqueIdInfos[namespace];
    if (!idInfos) {
        return true;
    }
    var existingOwner = idInfos.get(testId);
    if (existingOwner === owner) {
        return true;
    }
    if (typeof existingOwner === 'undefined') {
        return true;
    }
    return false;
};


UniqueIdManager.prototype.uniqueIdExists = function(owner, namespace, testId) {
    var idInfos = this.uniqueIdInfos[namespace];
    if (!idInfos) {
        return false;
    }
    var existingOwner = idInfos.get(testId);
    if (existingOwner) {
        return true;
    }
    return false;
};


UniqueIdManager.prototype.getNextUniqueId = function(namespace, prefix) {
    var counter = 1;
    var idInfos = this.uniqueIdInfos[namespace];
    while (true) {
        var testId = prefix + "" + counter;
        if (!idInfos || typeof idInfos.get(testId) === 'undefined') {
            return testId;
        }
        counter++;
    }
};

UniqueIdManager.prototype.getUniqueIds = function(namespace) {
    var idInfos = this.uniqueIdInfos[namespace];
    if (!idInfos) {
        return [];
    } else {
        return idInfos.listKeys();
    }
};

UniqueIdManager.prototype.getListeners = function(namespace) {
    var arr = this.listeners[namespace];
    return arr ? arr : [];
};

UniqueIdManager.prototype.addUniqueId = function(owner, namespace, newId) {
    //    logit("Adding unique id " + newId + " ns: " + namespace + "<br />");

    var idInfos = this.uniqueIdInfos[namespace];
    if (!idInfos) {
        idInfos = new Map(true);
        this.uniqueIdInfos[namespace] = idInfos;
    }
    if (typeof idInfos.get(newId) === 'undefined') {
        idInfos.put(newId, owner);
        //        logit("addUniqueId() called in uid manager. Listeners: " + this.getListeners(namespace) + "<br />");
        $.each(this.getListeners(namespace), function(key, value) {
            //            logit("Calling listener for id added in uid manager<br />");
            value.uniqueIdAdded(owner, namespace, newId);
        });
        for (var i=0; i<this.globalListeners.length; i++) {
            this.globalListeners[i].uniqueIdAdded(owner, namespace, newId);
        }
    } else {
        logit("id already existed in addUniqueId() " + namespace + " " + newId + "<br />");
    }
};

UniqueIdManager.prototype.changeUniqueId = function(owner, namespace, oldId, newId) {
    var idInfos = this.uniqueIdInfos[namespace];
    if (idInfos) {
        var oldOwner = idInfos.get(oldId);
        //        if (oldOwner == owner) {
        idInfos.remove(oldId);
        idInfos.put(newId, owner);
        $.each(this.getListeners(namespace), function(key, value) {
            value.uniqueIdChanged(owner, namespace, oldId, newId);
        });
        //        } else {
        //            logit("old owner not the same as new owner in changeUniqueId() " + namespace + " " + oldId + " " + newId + "<br />");
        //        }
    } else {
        logit("could not find any ids for namespace " + namespace + " in changeUniqueId()<br />");
    }
    for (var i=0; i<this.globalListeners.length; i++) {
        this.globalListeners[i].uniqueIdChanged(owner, namespace, oldId, newId);
    }

};

UniqueIdManager.prototype.removeUniqueId = function(namespace, id) {

    var idInfos = this.uniqueIdInfos[namespace];
    if (idInfos) {
        var owner = idInfos.get(id);
        if (typeof owner === 'undefined') {
            logit("owner not exist in removeUniqueId() " + namespace + " " + id + "<br />");
        } else {
            idInfos.remove(id);
            $.each(this.getListeners(namespace), function(key, value) {
                value.uniqueIdRemoved(owner, namespace, id);
            });
        }
    } else {
        logit("could not find any ids for namespace " + namespace + " in removeUniqueId()<br />");
    }

    for (var i=0; i<this.globalListeners.length; i++) {
        this.globalListeners[i].uniqueIdRemoved(owner, namespace, id);
    }

};


function PropertyInfoProvider(options) {

    this.uniqueIdManager = getValueOrDefault(options, "uniqueIdManager", new UniqueIdManager());

    var uidManager = this.uniqueIdManager;

    this.spsiUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "spsi",
        initPrefix: "spsi"
    });
    this.spsidsUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "spsids",
        initPrefix: "spsids"
    });
    this.phraseGroupTypesUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "phraseGroupTypes",
        initPrefix: "groupType"
    });

    this.eomUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "eom",
        initPrefix: "eom"
    });
    this.eoi1UidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "eoi1",
        initPrefix: "eoi1"
    });
    this.eoi2UidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "eoi2",
        initPrefix: "eoi2"
    });
    this.eobUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "eob",
        initPrefix: "eob"
    });

    this.emUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "em",
        initPrefix: "em"
    });
    this.ei1UidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "ei1",
        initPrefix: "ei1"
    });
    this.ei2UidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "ei2",
        initPrefix: "ei2"
    });
    this.ebUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "eb",
        initPrefix: "eb"
    });

    this.amUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "am",
        initPrefix: "am"
    });
    this.ai1UidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "ai1",
        initPrefix: "ai1"
    });
    this.ai2UidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "ai2",
        initPrefix: "ai2"
    });
    this.abUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "ab",
        initPrefix: "ab"
    });

    this.bdUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "bd",
        initPrefix: "bd"
    });
    this.sdUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "sd",
        initPrefix: "sd"
    });
    this.cdUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "cd",
        initPrefix: "cd"
    });
    this.rdUidInfo = new GuiUniqueIdInfo({
        manager: uidManager,
        namespace: "rd",
        initPrefix: "rd"
    });

}


PropertyInfoProvider.prototype.createDefaultBooleanPropertyInfo = function(propName, caption, defaultValue, shortDescription, longDescription) {
    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            dataType: GuiPropertyDataType.BOOLEAN,
            displayHint: BooleanPropertyDisplayHint.SELECT,
            shortDescription: shortDescription,
            longDescription: longDescription
        });
    return info;
};

PropertyInfoProvider.prototype.createDefaultFloatPropertyInfo = function(propName, caption, defaultValue, extraConstraints) {
    var constraints = [];
    if (extraConstraints) {
        addAll(constraints, extraConstraints);
    }
    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            constraints: constraints,
            dataType: GuiPropertyDataType.FLOAT,
            displayHint: NumberPropertyDisplayHint.TEXT
        });
    return info;
};

PropertyInfoProvider.prototype.createDefaultLikelihoodPropertyInfo = function(propName, caption, defaultValue) {
    return this.createDefaultFloatPropertyInfo(propName, caption, defaultValue, [new MinPropertyConstraint(0)]);
};

PropertyInfoProvider.prototype.createDefaultProbabilityPropertyInfo = function(propName, caption, defaultValue) {
    return this.createDefaultFloatPropertyInfo(propName, caption, defaultValue, [new RangePropertyConstraint([0, 1])]);
};

PropertyInfoProvider.prototype.createDefaultIntPropertyInfo = function(propName, caption, defaultValue, extraConstraints) {
    var constraints = [];
    if (extraConstraints) {
        addAll(constraints, extraConstraints);
    }
    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            constraints: constraints,
            dataType: GuiPropertyDataType.INT,
            displayHint: NumberPropertyDisplayHint.TEXT
        });
    return info;
};

PropertyInfoProvider.prototype.createDefaultIndexPropertyInfo = function(propName, caption, defaultValue) {
    return this.createDefaultIntPropertyInfo(propName, caption, defaultValue, [new MinPropertyConstraint(0)]);
};

PropertyInfoProvider.prototype.createDefaultStringPropertyInfo = function(propName, caption, defaultValue, shortDescription, longDescription) {
    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            dataType: GuiPropertyDataType.STRING,
            displayHint: StringPropertyDisplayHint.TEXT,
            shortDescription: shortDescription,
            longDescription: longDescription
        });
    return info;
};

PropertyInfoProvider.prototype.createDefaultStringSeedPropertyInfo = function(propName, caption, defaultValue, shortDescription, longDescription) {
    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            dataType: GuiPropertyDataType.STRING,
            displayHint: StringPropertyDisplayHint.TEXT,
            shortDescription: shortDescription,
            longDescription: longDescription
//            constraints: [
//                {
//                    isValid: function(object, propertyName, value) {
//                        return value == "" || !isNaN(parseInt(value));
//                    },
//                    getInvalidDescription: function(object, propertyName, value) {
//                        if (value != "" && isNaN(parseInt(value))) {
//                            return "Not a valid seed";
//                        }
//                        return "";
//                    }
//                }
//            ]

        });
    return info;
};




PropertyInfoProvider.prototype.createStringTextAreaPropertyInfo = function(propName, caption, defaultValue) {
    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            dataType: GuiPropertyDataType.STRING,
            displayHint: StringPropertyDisplayHint.TEXT_AREA
        });
    return info;
};



PropertyInfoProvider.prototype.createDefaultMinIntPropertyInfo = function(propName, caption, defaultValue, minValue) {
    var info = this.createDefaultIntPropertyInfo(propName, caption, defaultValue);
    info.constraints = [
        {
            getMinValue: function() {
                return minValue;
            }
        }
    ];
    return info;
};


PropertyInfoProvider.prototype.createDefaultMinMaxIntPropertyInfo = function(propName, caption, defaultValue,
                                                                             minValue, maxValue) {
    var info = this.createDefaultIntPropertyInfo(propName, caption, defaultValue);
    info.constraints = [
        {
            getMinValue: function() {
                return minValue;
            },
            getMaxValue: function() {
                return maxValue;
            }
        }
    ];
    return info;
};

PropertyInfoProvider.prototype.createDefaultMinFloatPropertyInfo = function(propName, caption, defaultValue, minValue) {
    var info = this.createDefaultFloatPropertyInfo(propName, caption, defaultValue);
    info.constraints = [
        {
            getMinValue: function() {
                return minValue;
            }
        }
    ];
    return info;
};


PropertyInfoProvider.prototype.createDefaultMinMaxFloatPropertyInfo = function(propName, caption, defaultValue,
                                                                               minValue, maxValue) {
    var info = this.createDefaultFloatPropertyInfo(propName, caption, defaultValue);
    info.constraints = [
        {
            getMinValue: function() {
                return minValue;
            },
            getMaxValue: function() {
                return maxValue;
            }
        }
    ];
    return info;
};




PropertyInfoProvider.prototype.createDefaultRangePropertyInfo = function(propName, caption, defaultValue, dataType, extraConstraints) {
    var constraints = [
        {
            lengthValid: function(arr) {
                return arr.length == 2;
            },
            lowerUpperValid: function(arr) {
                return arr[0] <= arr[1];
            },
            isValid: function(object, propertyName, value) {
                return this.lengthValid(value) && this.lowerUpperValid(value);
            },
            getInvalidDescription: function(object, propertyName, value) {
                if (!this.lengthValid(value)) {
                    return "Invalid range. Specify a lower and an upper limit";
                }
                if (!this.lowerUpperValid(value)) {
                    return "Invalid range. The first value must not be larger than the second";
                }
                return "";
            }
        }
    ];

    if (extraConstraints) {
        addAll(constraints, extraConstraints);
    }

    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            dataType: dataType,
            constraints: constraints,
            displayHint: NumberPropertyDisplayHint.TEXT
        });
    return info;
};

PropertyInfoProvider.prototype.createDefaultIntRangePropertyInfo = function(propName, caption, defaultValue, extraConstraints) {
    return this.createDefaultRangePropertyInfo(propName, caption, defaultValue, GuiPropertyDataType.INT_LIST, extraConstraints);
};


PropertyInfoProvider.prototype.createDefaultFloatRangePropertyInfo = function(propName, caption, defaultValue, extraConstraints) {
    return this.createDefaultRangePropertyInfo(propName, caption, defaultValue, GuiPropertyDataType.FLOAT_LIST, extraConstraints);
};

PropertyInfoProvider.prototype.createDefaultRangeListPropertyInfo = function(propName, caption, defaultValue, dataType, extraConstraints) {
    var constraints = [];

    if (extraConstraints) {
        addAll(constraints, extraConstraints);
    }

    constraints.push({
        rangeLengthValid: function(range) {
            return range.length == 2;
        },
        lowerUpperValid: function(arr) {
            return arr[0] <= arr[1];
        },
        rangeValid: function(range) {
            return this.rangeLengthValid(range) && this.lowerUpperValid(range);
        },
        isValid: function(object, propertyName, value) {
            for (var i=0; i<value.length; i++) {
                var range = value[i];
                if (!this.rangeValid(range)) {
                    return false;
                }
            }
            return true;
        },
        getInvalidDescription: function(object, propertyName, value) {
            for (var i=0; i<value.length; i++) {
                var range = value[i];
                if (!this.rangeLengthValid(range)) {
                    return "Invalid range: " + range.join(",") + ". Specify a lower and an upper limit";
                }
                if (!this.lowerUpperValid(range)) {
                    return "Invalid range: " + range.join(",") + ". The first value must not be larger than the second";
                }
            }
            return "";
        }
    });

    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            dataType: dataType,
            constraints: constraints,
            displayHint: NumberPropertyDisplayHint.TEXT
        });
    return info;
};


PropertyInfoProvider.prototype.createDefaultIntListPropertyInfo = function(propName, caption, defaultValue, extraConstraints) {
    var constraints = [];
    if (extraConstraints) {
        addAll(constraints, extraConstraints);
    }
    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            constraints: constraints,
            dataType: GuiPropertyDataType.INT_LIST,
            displayHint: NumberPropertyDisplayHint.TEXT
        });
    return info;
};

PropertyInfoProvider.prototype.createDefaultIndexListPropertyInfo = function(propName, caption, defaultValue) {
    return this.createDefaultIntListPropertyInfo(propName, caption, defaultValue, [new ArrayElementConstraint(new MinPropertyConstraint(0))]);
};

PropertyInfoProvider.prototype.createDefaultIntList2DPropertyInfo = function(propName, caption, defaultValue) {
    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            dataType: GuiPropertyDataType.INT_LIST_2D,
            displayHint: NumberPropertyDisplayHint.TEXT
        });
    return info;
};

PropertyInfoProvider.prototype.createDefaultFloatList2DPropertyInfo = function(propName, caption, defaultValue) {
    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            dataType: GuiPropertyDataType.FLOAT_LIST_2D,
            displayHint: NumberPropertyDisplayHint.TEXT
        });
    return info;
};

PropertyInfoProvider.prototype.createDefaultIntRangeListPropertyInfo = function(propName, caption, defaultValue) {
    var info = this.createDefaultIntList2DPropertyInfo(propName, caption, defaultValue);

    info.constraints = [
        {
            onePresent: function(arr) {
                return arr.length > 0;
            },
            lengthValid: function(arr) {
                for (var i=0; i<arr.length; i++) {
                    if (arr[i].length != 2) {
                        return false;
                    }
                }
                return true;
            },
            lowerUpperValid: function(arr) {
                for (var i=0; i<arr.length; i++) {
                    if (arr[i][0] > arr[i][1]) {
                        return false;
                    }
                }
                return true;
            },
            isValid: function(object, propertyName, value) {
                return this.onePresent(value) && this.lengthValid(value) && this.lowerUpperValid(value);
            },
            getInvalidDescription: function(object, propertyName, value) {
                if (!this.onePresent(value)) {
                    return "There must be at least one range specified"
                }
                if (!this.lengthValid(value)) {
                    return "Invalid range. Specify lower and upper limits";
                }
                if (!this.lowerUpperValid(value)) {
                    return "Invalid range. The first value must not be larger than the second";
                }
                return "";
            }
        }
    ];


    return info;
};


PropertyInfoProvider.prototype.createDefaultProbabilityListPropertyInfo = function(propName, caption, defaultValue) {
    return this.createDefaultFloatListPropertyInfo(propName, caption, defaultValue, [new ArrayElementConstraint(new RangePropertyConstraint([0, 1]))]);
};

PropertyInfoProvider.prototype.createDefaultLikelihoodListPropertyInfo = function(propName, caption, defaultValue) {
    return this.createDefaultFloatListPropertyInfo(propName, caption, defaultValue, [new ArrayElementConstraint(new MinPropertyConstraint(0))]);
};


PropertyInfoProvider.prototype.createDefaultFloatListPropertyInfo = function(propName, caption, defaultValue, extraConstraints) {
    var constraints = [];
    if (extraConstraints) {
        addAll(constraints, extraConstraints);
    }

    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            constraints: constraints,
            dataType: GuiPropertyDataType.FLOAT_LIST,
            displayHint: NumberPropertyDisplayHint.TEXT
        });
    return info;
};



PropertyInfoProvider.prototype.createStrengthPropertyInfo = function(propName, caption, defaultValue) {
    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            dataType: GuiPropertyDataType.FLOAT,
            displayHint: NumberPropertyDisplayHint.TEXT,
            constraints: [{
                isValid: function(object, propertyName, value) {
                    return value >= 0;
                },
                getInvalidDescription: function(object, propertyName, value) {
                    if (value < 0) {
                        return caption + " must not be less than 0";
                    }
                }
            }]
        });
    return info;
};


PropertyInfoProvider.prototype.createEnumPropertyInfo = function(propName, caption, defaultValue, enumType) {
    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: defaultValue,
            dataType: GuiPropertyDataType.INT,
            displayHint: NumberPropertyDisplayHint.SELECT,
            possibleValues: enumType.getPossibleValues(),
            displayFunction: function(object, propertyName, value) {
                return enumType.toString(value);
            }
        });
    return info;
};


PropertyInfoProvider.prototype.createEnumListPropertyInfo = function(propName, caption, defaultValue, enumType) {
    var info = new GuiPropertyInfo(
        {
            propertyName: propName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: [],
            dataType: GuiPropertyDataType.INT_LIST,
            displayHint: NumberListPropertyDisplayHint.SELECT_LIST, // This should be LIST_OF_SELECTS instead and there should be a displayFunction() defined also
            listInfo: new GuiListInfo({
                constructorInfos: [
                    new GuiConstructorInfo({
                        name: "stuff",
                        text: "New",
                        nameIsConstructor: false,
                        createValue: function() {
                            return defaultValue;
                        }
                    })
                ],
                itemsDisplayFunction: function(input) {
                    return enumType.toString(input);
                },
                possibleValues: enumType.getPossibleValues()
            })
        });
    return info;
};


PropertyInfoProvider.prototype.createProcedureButtonPropertyInfo = function(caption, funcName, target, args) {

    var info = new GuiPropertyInfo(
        {
            propertyName: funcName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            dataType: GuiPropertyDataType.PROCEDURE,
            displayHint: ProcedureDisplayHint.BUTTON,
            procedureInfo: new GuiProcedureInfo({
                args: args,
                targetObject: target
            })
        });

    return info;
};

PropertyInfoProvider.prototype.createUniqueIdPropertyInfo = function(prefix, uniqueIdInfo) {
    var info = new GuiPropertyInfo(
        {
            propertyName: "id",
            propertyCaption: "Name",
            propertyInfoProvider: this,
            defaultValue: prefix + "1", // Not really used for unique ids
            dataType: GuiPropertyDataType.UNIQUE_ID,
            displayHint: UniqueIdPropertyDisplayHint.TEXT,
            uniqueIdInfo: uniqueIdInfo
        });
    return info;
};

PropertyInfoProvider.prototype.createPreviewPropertyInfo = function(componentConstructor) {
    var module = this.module;
    var info = new GuiPropertyInfo(
        {
            otherInfo: new GuiOtherInfo({
                componentConstructor: componentConstructor,
                data: module
            }),
            dataType: GuiPropertyDataType.OTHER
        });
    return info;
};

PropertyInfoProvider.prototype.createIdReferencePropertyInfo = function(propertyName, caption, uniqueIdInfo) {
    var info = new GuiPropertyInfo(
        {
            propertyName: propertyName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: "",
            dataType: GuiPropertyDataType.ID_REFERENCE,
            displayHint: IdReferencePropertyDisplayHint.SELECT,
            uniqueIdInfo: uniqueIdInfo
        });
    return info;
};


PropertyInfoProvider.prototype.createIdReferenceListPropertyInfo = function(propertyName, caption, uniqueIdInfo) {
    var info = new GuiPropertyInfo(
        {
            propertyName: propertyName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            dataType: GuiPropertyDataType.ID_REFERENCE_LIST,
            displayHint: IdReferencePropertyDisplayHint.SELECT,
            uniqueIdInfo: uniqueIdInfo,
            listInfo: new GuiListInfo({
                constructorInfos: [
                    new GuiConstructorInfo({
                        name: "stuff",
                        text: "New",
                        nameIsConstructor: false,
                        createValue: function() {
                            return "";
                        }
                    })
                ],
                itemsDisplayFunction: function(input) {
                    return input;
                }
            })
        });
    return info;
};



PropertyInfoProvider.prototype.createIdReferenceNotSelfPropertyInfo = function(propertyName, caption, uniqueIdInfo) {
    var info = this.createIdReferencePropertyInfo(propertyName, caption, uniqueIdInfo);

    info.constraints = [
        {
            isValid: function(object, propertyName, value) {
                //            logit("" + object.id + ": " + value + "<br />");
                return object.id != value;
            },
            getInvalidDescription: function(object, propertyName, value) {
                if (object.id == value) {
                    return "No self reference allowed";
                }
                return "";
            }
        }
    ];

    return info;
};

PropertyInfoProvider.prototype.createObjectPropertyInfo = function(propertyName, caption, uniqueIdInfo, constructorTexts) {
    var provider = this;
    var info = new GuiPropertyInfo(
        {
            propertyName: propertyName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: [],
            dataType: GuiPropertyDataType.OBJECT,
            uniqueIdInfo: uniqueIdInfo
        }
    );

    var constructorInfos = [];
    for (var i=0; i<constructorTexts.length; i++) {
        var ct = constructorTexts[i];
        constructorInfos.push(new GuiConstructorInfo({
            name: ct[0],
            text: ct[1]
        }));
    }

    info.objectInfo = new GuiObjectInfo({
        constructorInfos: constructorInfos
    });

    return info;
};

PropertyInfoProvider.prototype.createSongPartStructureInfoDataSampleListPropertyInfo = function(propertyName, caption, uidInfo) {
    var info = this.createObjectListPropertyInfo(propertyName, caption, uidInfo, [
        ["SongPartStructureInfoDataSample", "Song Part Structure Likelihood"]]);
    info.listInfo.itemsDisplayFunction = function(valueItem) {
        var structureStrArr = [];
        var arr = valueItem.data;
        for (var i=0; i<arr.length; i++) {
            structureStrArr.push(SongPartType.toString(arr[i].partType));
        }
        return "Structure (" + structureStrArr.join(", ") + ")" + ", Likelihood: " + valueItem.likelihood;
    };
    return info;
};

PropertyInfoProvider.prototype.createSongPartStructureInfoListPropertyInfo = function(propertyName, caption, uidInfo) {
    var info = this.createObjectListPropertyInfo(propertyName, caption, uidInfo, [
        ["SongPartStructureInfo", "Song Part Structure"]]);
    info.listInfo.itemsDisplayFunction = function(valueItem) {
        return SongPartType.toString(valueItem.partType);
    };
    return info;
};



PropertyInfoProvider.prototype.createPhraseGroupTypeDataSampleListPropertyInfo = function(propertyName, caption, uidInfo) {
    var info = this.createObjectListPropertyInfo(propertyName, caption, uidInfo, [
        ["PhraseGroupTypeDataSample", "Phrase group likelihood"]]);
    info.listInfo.itemsDisplayFunction = function(valueItem) {
        return SimpleModuleGeneratorPhraseGroupType.toString(valueItem.data) + ", Likelihood: " + valueItem.likelihood;
    };
    return info;
};

PropertyInfoProvider.prototype.createMidiProgramDataSampleListPropertyInfo = function(propertyName, caption, uidInfo) {
    var info = this.createObjectListPropertyInfo(propertyName, caption, uidInfo, [
        ["MidiProgramDataSample", "Instrument Likelihood"]]);
    info.listInfo.itemsDisplayFunction = function(valueItem) {
        return MidiProgram.toString(valueItem.data) + ", Likelihood: " + valueItem.likelihood;
    };
    return info;
};


PropertyInfoProvider.prototype.createMidiDrumDataSampleListPropertyInfo = function(propertyName, caption, uidInfo) {
    var info = this.createObjectListPropertyInfo(propertyName, caption, uidInfo, [
        ["MidiDrumDataSample", "Drum Likelihood"]]);
    info.listInfo.itemsDisplayFunction = function(valueItem) {
        return MidiDrum.toString(valueItem.data) + ", Likelihood: " + valueItem.likelihood;
    };
    return info;
};


PropertyInfoProvider.prototype.createIntDataSampleListPropertyInfo = function(propertyName, caption, uidInfo) {
    var info = this.createObjectListPropertyInfo(propertyName, caption, uidInfo, [
        ["IntDataSample", "Int Likelihood"]]);
    info.listInfo.itemsDisplayFunction = function(valueItem) {
        return "Value: " + valueItem.data + ", Likelihood: " + valueItem.likelihood;
    };
    return info;
};

PropertyInfoProvider.prototype.createIntListDataSampleListPropertyInfo = function(propertyName, caption, uidInfo) {
    var info = this.createObjectListPropertyInfo(propertyName, caption, uidInfo, [
        ["IntListDataSample", "Int List Likelihood"]]);
    info.listInfo.itemsDisplayFunction = function(valueItem) {
        return "Value: " + valueItem.data.join(", ") + ", Likelihood: " + valueItem.likelihood;
    };
    return info;
};


PropertyInfoProvider.prototype.createFloatDataSampleListPropertyInfo = function(propertyName, caption, uidInfo) {
    var info = this.createObjectListPropertyInfo(propertyName, caption, uidInfo, [
        ["FloatDataSample", "Float Likelihood"]]);
    info.listInfo.itemsDisplayFunction = function(valueItem) {
        return "Value: " + valueItem.data + ", Likelihood: " + valueItem.likelihood;
    };
    return info;
};

PropertyInfoProvider.prototype.createFloatListDataSampleListPropertyInfo = function(propertyName, caption, uidInfo) {
    var info = this.createObjectListPropertyInfo(propertyName, caption, uidInfo, [
        ["FloatListDataSample", "Float List Likelihood"]]);
    info.listInfo.itemsDisplayFunction = function(valueItem) {
        return "Value: " + valueItem.data.join(", ") + ", Likelihood: " + valueItem.likelihood;
    };
    return info;
};




PropertyInfoProvider.prototype.createObjectListPropertyInfo = function(propertyName, caption, uniqueIdInfo, constructorTexts) {
    var provider = this;
    var info = new GuiPropertyInfo(
        {
            propertyName: propertyName,
            propertyCaption: caption,
            propertyInfoProvider: this,
            defaultValue: [],
            dataType: GuiPropertyDataType.OBJECT_LIST,
            uniqueIdInfo: uniqueIdInfo,
            propertyInfoProvider: provider
        }
    );

    var constructorInfos = [];
    for (var i=0; i<constructorTexts.length; i++) {
        var ct = constructorTexts[i];
        constructorInfos.push(new GuiConstructorInfo({
            name: ct[0],
            text: ct[1]
        }));
    }

    info.listInfo = new GuiListInfo({
        constructorInfos: constructorInfos
    });

    return info;
};





PropertyInfoProvider.prototype.createObjectListInTabPropertyInfo = function(propertyName, caption, uniqueIdInfo, constructorTexts, group, groupCaption) {

    var info = this.createObjectListPropertyInfo(propertyName, caption, uniqueIdInfo, constructorTexts);

    if (!group) {
        group = caption;
    }
    if (!groupCaption) {
        groupCaption = caption;
    }

    info.splitInfo = new GuiSplitInfo({
        group: group,
        groupCaption: groupCaption
    });

    return info;
};

PropertyInfoProvider.prototype.getUniqueNamespace = function(nsPrefix) {
    if (!this.uniqueNamespaces) {
        this.uniqueNamespaces = {};
    }

    var counter = Math.round(Math.random() * 99999999);
    var testNs = nsPrefix + "" + counter;
    while (true) {
        if (!this.uniqueNamespaces[testNs]) {
            // Namespace is available
            this.uniqueNamespaces[testNs] = true;
            break;
        }
        counter++;
        testNs = nsPrefix + "" + counter;
    }
    return testNs;
};

PropertyInfoProvider.prototype.getOrCreateUniqueIdInfo = function(obj, nsPrefix, initPrefix) {
    if (!obj.__uniqueIdInfos) {
        obj.__uniqueIdInfos = {};
    }
    var info = obj.__uniqueIdInfos[nsPrefix];
    if (!info) {
        var uidManager = this.uniqueIdManager;

        var namespace = this.getUniqueNamespace(nsPrefix);

        info = new GuiUniqueIdInfo({
            manager: uidManager,
            namespace: namespace,
            initPrefix: initPrefix
        });

        obj.__uniqueIdInfos[nsPrefix] = info;
    }

    return info;
};


PropertyInfoProvider.prototype.getMixableExportPropertyInfos = function(result) {
    var constraints = [
        new ArrayElementConstraint(new RangePropertyConstraint([0, 1]))
    ];

    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("melodyVolumeMultipliers", "Melody Volume Multipliers", [1], constraints));
    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("inner1VolumeMultipliers", "Inner 1 Volume Multipliers", [1], constraints));
    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("inner2VolumeMultipliers", "Inner 2 Volume Multipliers", [1], constraints));
    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("bassVolumeMultipliers", "Bass Volume Multipliers", [1], constraints));
    result.addPropertyInfo(this.createDefaultMinMaxFloatPropertyInfo("percussionVolumeMultiplier", "Percussion Volume Multiplier", 1, 0, 1));

    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("melodyReverbSends", "Melody Reverb Sends", [1], constraints));
    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("melodyChorusSends", "Melody Chorus Sends", [40 / 127.0], constraints));
    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("bassReverbSends", "Bass Reverb Sends", [10 / 127.0], constraints));
    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("bassChorusSends", "Bass Chorus Sends", [10 / 127.0], constraints));
    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("inner1ReverbSends", "Inner 1 Reverb Sends", [10 / 127.0], constraints));
    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("inner1ChorusSends", "Inner 1 Chorus Sends", [10 / 127.0], constraints));
    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("inner2ReverbSends", "Inner 2 Reverb Sends", [10 / 127.0], constraints));
    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("inner2ChorusSends", "Inner 2 Chorus Sends", [10 / 127.0], constraints));
    result.addPropertyInfo(this.createDefaultMinMaxFloatPropertyInfo("percussionReverbSend", "Percussion Reverb Send", 0, 0, 1));
    result.addPropertyInfo(this.createDefaultMinMaxFloatPropertyInfo("percussionChorusSend", "Percussion Chorus Send", 0, 0, 1));
};

PropertyInfoProvider.prototype.getMidiExportPropertyInfos = function(result) {

    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("exportVolume", "Export Volume", true));
    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("exportEffects", "Export Effects", true));
    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("mergeChannels", "Merge Channels", false));
    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("exportChordsToNewChannel", "Export Chords to New Channel", false));

    this.getMixableExportPropertyInfos(result);
};


PropertyInfoProvider.prototype.getWavExportPropertyInfos = function(result) {
    result.addPropertyInfo(this.createEnumPropertyInfo("soundFontType", "Sound Font", SoundFontType.STANDARD_LIGHT, SoundFontType));
    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("normalizeRenderedResult", "Normalize", false));
    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("compressRenderedResult", "Compress", false));
    this.getMidiExportPropertyInfos(result);
};

PropertyInfoProvider.prototype.getWavClientExportPropertyInfos = function(result) {
    this.getMidiExportPropertyInfos(result);
};

PropertyInfoProvider.prototype.getDataSamplePropertyInfos = function(result) {
    result.addPropertyInfo(this.createDefaultMinFloatPropertyInfo("likelihood", "Likelihood", 1, 0));
    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("active", "Active", true));
};

PropertyInfoProvider.prototype.getPlannedHarmonyElementPropertyInfos = function(result) {
    result.addPropertyInfo(this.createDefaultIntPropertyInfo("scaleBaseNote", "Scale base note", 60));
    result.addPropertyInfo(this.createEnumPropertyInfo("scaleType", "Scale type", ScaleType.MAJOR, ScaleType));
    result.addPropertyInfo(this.createDefaultIntPropertyInfo("seed", "Seed", 12345));

    this.getSequenceHarmonyElementPropertyInfos(result);
};

PropertyInfoProvider.prototype.getSequenceHarmonyElementPropertyInfos = function(result) {

    result.addPropertyInfo(this.createEnumPropertyInfo("harmonyLengthMode", "Length Mode", HarmonyLengthMode.RYTHM_ONLY, HarmonyLengthMode));

    result.addPropertyInfo(this.createDefaultMinMaxIntPropertyInfo("count", "Count", 4, 1, 32));
    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("lengthPattern", "Length pattern", [1.0],
        [new ArrayMinLengthConstraint(1), new ArrayElementConstraint(new MinPropertyConstraint(0.01))]));

//            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("startLengthPattern", "Length pattern", [1.0],
//                [new ArrayElementConstraint(new MinPropertyConstraint(0.01))]));
//            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("endLengthPattern", "End length pattern", [],
//                [new ArrayElementConstraint(new MinPropertyConstraint(0.01))]));
    result.addPropertyInfo(this.createEnumPropertyInfo("lengthPatternUnit", "Length pattern unit", PositionUnit.MEASURES, PositionUnit));

    result.addPropertyInfo(this.createDefaultMinMaxFloatPropertyInfo("totalLength", "Total length ()", 1.0, 0.001, 128));
    result.addPropertyInfo(this.createEnumPropertyInfo("totalLengthUnit", "Total length unit", PositionUnit.MEASURES, PositionUnit));
    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("setTotalLengthExternally", "Set total length externally", false));


    result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("beatStrengths", "Beat strengths", [1, 0.8, 0.9, 0.6, 0.3, 0.4, 0.2],
        [new ArrayMinLengthConstraint(1)]));

    result.addPropertyInfo(this.createDefaultIntListPropertyInfo("tsNumerators", "Beats per measures", [4],
        [new ArrayMinLengthConstraint(1)]));
    result.addPropertyInfo(this.createDefaultIntPropertyInfo("rythmTsNumerator", "Rythm beats per measure", 4));

    result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("setTsNumeratorExternally", "Set beats per measure externally", false));

};


PropertyInfoProvider.prototype.getGuiPropertyInfos = function(obj, parentPropertyInfo) {
    var result = new GuiPropertyInfos();


    switch (obj._constructorName) {
        case "UserInfo":
            result.addPropertyInfo(this.createDefaultStringPropertyInfo("name", "Name", "", "Your name"));
            result.addPropertyInfo(this.createDefaultStringPropertyInfo("email", "Email", "", "Your email address"));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("subscribe", "Subscribe to news", "", "Whether to subscribe to the newsletter or not"));
            break;
        case "VoiceChordNotesVoiceLinePlannerConstraint":
            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("chordRootPitchClassConstraints", "Voice chord roots", []));
            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("chordRootPitchClassConstraintCosts", "Voice chord root costs", []));
            break;
        case "PhraseHarmonyElement":
            result.addPropertyInfo(this.createEnumPropertyInfo("phraseType", "Phrase type", PhraseHarmonyElementType.COMPLETE, PhraseHarmonyElementType));
            result.addPropertyInfo(this.createEnumPropertyInfo("majorModulationTarget", "Major modulation target", DynamicHarmonyModulationTarget.DOMINANT, DynamicHarmonyModulationTarget));
            result.addPropertyInfo(this.createEnumPropertyInfo("minorModulationTarget", "Minor modulation target", DynamicHarmonyModulationTarget.MEDIANT, DynamicHarmonyModulationTarget));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("majorDeceptiveRoot", "Major deceptive root", 5));
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("minorDeceptiveRoot", "Minor deceptive root", 5));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("raiseLeadingTone", "Raise leading tone", true));

            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("staticHarmonyLength", "Static harmony length", 25));
            result.addPropertyInfo(this.createEnumPropertyInfo("staticHarmonyLengthUnit", "Static harmony length unit", LengthAndCountUnit.LENGTH_PERCENT, LengthAndCountUnit));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("staticHarmonySus2ChordLikelihood", "Static harmony sus2 likelihood", 1));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("staticHarmonySus4ChordLikelihood", "Static harmony sus4 likelihood", 1));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("staticHarmonySimpleMixtureLikelihood", "Static harmony mixture likelihood", 1));

            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("dynamicHarmonyLength", "Dynamic harmony length", 25));
            result.addPropertyInfo(this.createEnumPropertyInfo("dynamicHarmonyLengthUnit", "Dynamic harmony length unit", LengthAndCountUnit.LENGTH_PERCENT, LengthAndCountUnit));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("dynamicHarmonySus2ChordLikelihood", "Dynamic harmony sus2 likelihood", 1));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("dynamicHarmonySus4ChordLikelihood", "Dynamic harmony sus4 likelihood", 1));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("dynamicHarmonySimpleMixtureLikelihood", "Dynamic harmony mixture likelihood", 1));

            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("dominantCadenceHarmonyLength", "Dominant cadence harmony length", 25));
            result.addPropertyInfo(this.createEnumPropertyInfo("dominantCadenceHarmonyLengthUnit", "Dominant cadence harmony length unit", LengthAndCountUnit.LENGTH_PERCENT, LengthAndCountUnit));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("dominantCadenceHarmonySus2ChordLikelihood", "Dominant cadence harmony sus2 likelihood", 1));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("dominantCadenceHarmonySus4ChordLikelihood", "Dominant cadence harmony sus4 likelihood", 1));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("dominantCadenceHarmonySimpleMixtureLikelihood", "Dominant cadence harmony mixture likelihood", 1));

            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("tonicCadenceHarmonyLength", "Tonic cadence harmony length", 25));
            result.addPropertyInfo(this.createEnumPropertyInfo("tonicCadenceHarmonyLengthUnit", "Tonic cadence harmony length unit", LengthAndCountUnit.LENGTH_PERCENT, LengthAndCountUnit));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("tonicCadenceHarmonySus2ChordLikelihood", "Tonic cadence harmony sus2 likelihood", 1));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("tonicCadenceHarmonySus4ChordLikelihood", "Tonic cadence harmony sus4 likelihood", 1));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("tonicCadenceHarmonySimpleMixtureLikelihood", "Tonic cadence harmony mixture likelihood", 1));

            this.getPlannedHarmonyElementPropertyInfos(result);
            break;
        case "SimpleSequenceHarmonyElement":
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("scaleBaseNotes", "Scale base notes", [60]));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("scaleBaseNoteIndices", "Scale base note indices", [0]));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("startScaleBaseNoteIndices", "Start scale base note indices", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("endScaleBaseNoteIndices", "End scale base note indices", []));
            result.addPropertyInfo(this.createEnumListPropertyInfo("scaleTypes", "Scale types", ScaleType.MAJOR, ScaleType));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("scaleTypeIndices", "Scale type indices", [0]));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("startScaleTypeIndices", "Start scale type indices", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("endScaleTypeIndices", "End scale type indices", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("scaleModes", "Scale modes", [0]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("startScaleModes", "Start scale modes", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("endScaleModes", "End scale modes", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("chordRoots", "Chord roots", [0]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("startChordRoots", "Start chord roots", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("endChordRoots", "End chord roots", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("chordInversions", "Chord inversions", [0], [
                new ArrayElementConstraint(
                    new RangePropertyConstraint([0, 3]))
            ]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("startChordInversions", "Start chord inversions", [], [
                new ArrayElementConstraint(
                    new RangePropertyConstraint([0, 3]))
            ]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("endChordInversions", "End chord inversions", [], [
                new ArrayElementConstraint(
                    new RangePropertyConstraint([0, 3]))
            ]));
            result.addPropertyInfo(this.createEnumListPropertyInfo("chordTypes", "Chord types", ChordType.TRIAD, ChordType));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("chordTypeIndices", "Chord type indices", [0]));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("startChordTypeIndices", "Start chord type indices", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("endChordTypeIndices", "End chord type indices", []));

            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("customScales", "Custom scales", [[0, 2, 3, 5, 7, 9, 11]]));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("customScaleIndices", "Custom scale indices", [0]));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("startCustomScaleIndices", "Start custom scale indices", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("endCustomScaleIndices", "End custom scale indices", []));

            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("customChords", "Custom chords", [[0, 2, 4]]));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("customChordIndices", "Custom chord indices", [0]));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("startCustomChordIndices", "Start custom chord indices", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("endCustomChordIndices", "End custom chord indices", []));

            this.getSequenceHarmonyElementPropertyInfos(result);

            var info = this.createObjectListPropertyInfo("voiceLineConstraints", "Voice line constraints", this.phraseGroupTypesUidInfo,
                [
                    ["VoiceChordNotesVoiceLinePlannerConstraint", "Voice chord notes constraint"]
                ]);
            info.listInfo.itemsDisplayFunction = function(valueItem) {
                var result = "Voice line constraint (" + valueItem._constructorName + ")";
                return result;
            };
            result.addPropertyInfo(info);

            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("voiceLineConstraintIndices", "Voice line constraint indices", []));
            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("startVoiceLineConstraintIndices", "Start voice line constraint indices", []));
            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("endVoiceLineConstraintIndices", "End voice line constraint indices", []));

            break;
        case "SongPartStructureInfo":
            result.addPropertyInfo(this.createEnumPropertyInfo("partType", "Part Type", SongPartType.VERSE_1, SongPartType));
            result.addPropertyInfo(this.createEnumPropertyInfo("strength", "Strength", SongPartStrength.DEFAULT, SongPartStrength));

            result.addPropertyInfo(this.createDefaultProbabilityListPropertyInfo("prefixProbsOverride", "Prefix Group Probabilities (Override)", []));
            result.addPropertyInfo(this.createDefaultProbabilityListPropertyInfo("postfixProbsOverride", "Postfix Group Probabilities (Override)", []));

            result.addPropertyInfo(this.createEnumPropertyInfo("majorGroupModulationTarget", "Major Group Modulation Target", DynamicHarmonyModulationTarget.NONE, DynamicHarmonyModulationTarget));
            result.addPropertyInfo(this.createEnumPropertyInfo("minorGroupModulationTarget", "Minor Group Modulation Target", DynamicHarmonyModulationTarget.NONE, DynamicHarmonyModulationTarget));

            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("melodyRenderAmountOverride", "Melody render amount overrides", []));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("inner1RenderAmountOverride", "Inner 1 render amount overrides", []));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("inner2RenderAmountOverride", "Inner 2 render amount overrides", []));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("bassRenderAmountOverride", "Bass render amount overrides", []));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("percussionRenderAmountOverride", "Percussion render amount overrides", []));

            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("harmonyRythmCountOverrides", "Harmony rythm count overrides", [], [new ArrayElementConstraint(new RangePropertyConstraint([1, 32]))]));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("harmonyTotalLengthOverrides", "Harmony total length overrides", [], [new ArrayElementConstraint(new RangePropertyConstraint([0.125, 32]))]));

            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overrideScaleBaseNote", "Override scale base note", false));
            result.addPropertyInfo(this.createDefaultMinMaxIntPropertyInfo("scaleBaseNote", "Scale base note", 60, 0, 127));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overrideScaleType", "Override scale type", false));
            result.addPropertyInfo(this.createEnumPropertyInfo("scaleType", "Scale type", SimpleScaleType.MAJOR, SimpleScaleType));

            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overridePhraseGroupType", "Override phrase group type", false));
            result.addPropertyInfo(this.createEnumPropertyInfo("phraseGroupType", "Phrase group type", SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT_SHORTEN, SimpleModuleGeneratorPhraseGroupType));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overrideMajorModulationTarget", "Override major modulation/tonicization target", false));
            result.addPropertyInfo(this.createEnumPropertyInfo("majorModulationTarget", "Major modulation/tonicization target", DynamicHarmonyModulationTarget.DOMINANT, DynamicHarmonyModulationTarget));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overrideMinorModulationTarget", "Override minor modulation/tonicization target", false));
            result.addPropertyInfo(this.createEnumPropertyInfo("minorModulationTarget", "Minor modulation/tonicization target", DynamicHarmonyModulationTarget.DOMINANT, DynamicHarmonyModulationTarget));

            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("harmonyElementIndices", "Custom harmony indices", [0]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("customMelodyCurveIndices", "Custom melody indices", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("customBassCurveIndices", "Custom bass indices", []));

            result.addPropertyInfo(this.createDefaultIntList2DPropertyInfo("extraMelodyRenderElementIndices", "Extra melody render elements", []));

//            this.sameGroupIndexSames = getValueOrDefault(options, "sameGroupIndexSames", []);
//            this.groupModulationTarget = getValueOrDefault(options, "groupModulationTarget", -1);

            break;
        case "ModulationTargetDataSample":
            result.addPropertyInfo(this.createEnumPropertyInfo("data", "Data", DynamicHarmonyModulationTarget.MEDIANT, DynamicHarmonyModulationTarget));
            this.getDataSamplePropertyInfos(result);
            break;
        case "PhraseGroupTypeDataSample":
            result.addPropertyInfo(this.createEnumPropertyInfo("data", "Data", SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT, SimpleModuleGeneratorPhraseGroupType));
            this.getDataSamplePropertyInfos(result);
            break;
        case "SongPartStructureInfoDataSample":
            result.addPropertyInfo(this.createSongPartStructureInfoListPropertyInfo("data", "Data", this.spsiUidInfo));
            this.getDataSamplePropertyInfos(result);
            break;
        case "MidiProgramDataSample":
            result.addPropertyInfo(this.createEnumPropertyInfo("data", "Data", MidiProgram.ACOUSTIC_GRAND_PIANO, MidiProgram));
            this.getDataSamplePropertyInfos(result);
            break;
        case "MidiDrumDataSample":
            result.addPropertyInfo(this.createEnumPropertyInfo("data", "Data", MidiDrum.BASS_DRUM_1, MidiDrum));
            this.getDataSamplePropertyInfos(result);
            break;
        case "IntDataSample":
            result.addPropertyInfo(this.createDefaultIntPropertyInfo("data", "Data", 0));
            this.getDataSamplePropertyInfos(result);
            break;
        case "IntListDataSample":
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("data", "Data", []));
            this.getDataSamplePropertyInfos(result);
            break;
        case "FloatDataSample":
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("data", "Data", 0));
            this.getDataSamplePropertyInfos(result);
            break;
        case "FloatListDataSample":
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("data", "Data", []));
            this.getDataSamplePropertyInfos(result);
            break;
        case "PrimitiveWebAudioPlayerInstrument":
            result.addPropertyInfo(this.createEnumPropertyInfo("type", "Type", PrimitiveWebAudioPlayerInstrumentType.SAW, PrimitiveWebAudioPlayerInstrumentType));
            break;
        case "WebAudioPlayerSettings":
            var info = this.createObjectListPropertyInfo("melodyInstruments", "Melody instruments", this.phraseGroupTypesUidInfo,
                [
                    ["PrimitiveWebAudioPlayerInstrument", "Primitive"]
                ]);
            info.listInfo.itemsDisplayFunction = function(valueItem) {
                return "Instrument (" + valueItem._constructorName + ")";
            };
            result.addPropertyInfo(info);

            var info = this.createObjectListPropertyInfo("inner1Instruments", "Inner 1 instruments", this.phraseGroupTypesUidInfo,
                [
                    ["PrimitiveWebAudioPlayerInstrument", "Primitive"]
                ]);
            info.listInfo.itemsDisplayFunction = function(valueItem) {
                return "Instrument (" + valueItem._constructorName + ")";
            };
            result.addPropertyInfo(info);

            var info = this.createObjectListPropertyInfo("inner2Instruments", "Inner 2 instruments", this.phraseGroupTypesUidInfo,
                [
                    ["PrimitiveWebAudioPlayerInstrument", "Primitive"]
                ]);
            info.listInfo.itemsDisplayFunction = function(valueItem) {
                return "Instrument (" + valueItem._constructorName + ")";
            };
            result.addPropertyInfo(info);

            var info = this.createObjectListPropertyInfo("bassInstruments", "Bass instruments", this.phraseGroupTypesUidInfo,
                [
                    ["PrimitiveWebAudioPlayerInstrument", "Primitive"]
                ]);
            info.listInfo.itemsDisplayFunction = function(valueItem) {
                return "Instrument (" + valueItem._constructorName + ")";
            };
            result.addPropertyInfo(info);

            this.getMixableExportPropertyInfos(result);
            break;
        case "SoundManager2PlayerSettings":
        case "PlayerSettings":
            this.getMidiExportPropertyInfos(result);
            break;
        case "MidiExportSettings":
            result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Export Midi", "export2", {export2: function() {exportMidi()}}));
            this.getMidiExportPropertyInfos(result);
            break;
        case "WavExportSettings":
            result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Export Wav", "export2", {export2: function() {exportWav()}}));
            this.getWavExportPropertyInfos(result);
            break;
        case "WavClientExportSettings":
            result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Export Wav", "export2", {export2: function() {exportWav()}}));
            this.getWavClientExportPropertyInfos(result);
            break;
        case "Mp3ExportSettings":
            result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Export Mp3", "export2", {export2: function() {exportMp3()}}));
//            result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Save As Preset", "saveAsPreset", {saveAsPreset: function() {savePreset()}}));
            this.getWavExportPropertyInfos(result);
            break;
        case "OggExportSettings":
            result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Export Ogg", "export2", {export2: function() {exportOgg()}}));
            this.getWavExportPropertyInfos(result);
            break;
        case "ItExportSettings":
            result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Export IT", "export2", {export2: function() {exportIT()}}));
            break;
        case "ThemeSettings":
            result.addPropertyInfo(this.createEnumPropertyInfo("theme", "Theme (refresh page to see change)", JQueryUITheme.BLITZER, JQueryUITheme));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("transparentDialogs", "Use transparent dialogs", false));
//            result.addPropertyInfo(this.createProcedureButtonPropertyInfo("Update theme", "update", {update: function() {updateTheme()}}));
            break;
        case "Visualizer3DSettings":
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("on", "On", true));
            result.addPropertyInfo(this.createDefaultMinMaxIntPropertyInfo("webGLFps", "FPS (WebGL)", 20, 1, 60));
            result.addPropertyInfo(this.createDefaultMinMaxIntPropertyInfo("context2DFps", "FPS (2D Context)", 5, 1, 60));
            result.addPropertyInfo(this.createEnumPropertyInfo("stopMovementMode", "Stop Movement Mode", Visualizer3DStopMovementMode.PAN, Visualizer3DStopMovementMode));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("forceContext2D", "Force 2D Context", false));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("usePerspective", "Perspective mode", true));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("addBloom", "Add Bloom", true));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("addSimulatedAA", "Add Simulated Antialising", true));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("addVignette", "Add Vignette", true));
            break;
        case "SongSettings":
            result.addPropertyInfo(this.createDefaultStringPropertyInfo("name", "Name", "", "The name of your song. This is the name that shows up in the 'My Songs' tab"));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("seed", "Seed", "", "The main seed. Determines all the sub seeds for structure, content and indices."));
            break;
        case "SongContentSeedSettings":
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("instrumentTypeSeed", "Instrument Type Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("melodyInstrumentSeed", "Melody Instrument Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("inner1InstrumentSeed", "Inner 1 Instrument Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("inner2InstrumentSeed", "Inner 2 Instrument Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("bassInstrumentSeed", "Bass Instrument Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("melodyMotifSeed", "Melody Motif Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("melodyMotifRythmSeed", "Melody Rythm Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("melodyMotifEmbellishConnectSeed", "Melody Connect Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("bassMotifSeed", "Bass Motif Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("bassMotifRythmSeed", "Bass Rythm Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("bassMotifEmbellishConnectSeed", "Bass Connect Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("harmonyMotifSeed", "Harmony Motif Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("harmonyMotifRythmSeed", "Harmony Motif Rythm Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("harmonyMotifEmbellishConnectSeed", "Harmony Motif Connect Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("percussionMotifSeed", "Percussion Motif Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("percussionFillMotifSeed", "Percussion Fill Motif Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("percussionInstrumentSeed", "Percussion Instrument Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("percussionFillInstrumentSeed", "Percussion Fill Instrument Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("percussionMotifRythmSeed", "Percussion Rythm Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("percussionFillMotifRythmSeed", "Percussion Fill Rythm Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("melodyShapeSeed", "Melody Shape Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("bassShapeSeed", "Bass Shape Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("harmonyRythmSeed", "Harmony Rythm Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("melodyMotifDistributionSeed", "Melody Distribution Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("inner1MotifDistributionSeed", "Inner 1 Distribution Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("inner2MotifDistributionSeed", "Inner 2 Distribution Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("bassMotifDistributionSeed", "Bass Distribution Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("percussionMotifDistributionSeed", "Percussion Distribution Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("percussionFillMotifDistributionSeed", "Percussion Fill Distribution Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("melodyHarmonyPunctationSeed", "Melody Harmony Punctation Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("innerHarmonyPunctationSeed", "Inner Harmony Punctation Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("harmonySeed", "Harmony Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("channelDistributionSeed", "Channel Distribution Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("tempoChangeSeed", "Tempo Change Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("effectChangeSeed", "Effect Change Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("suspendSeed", "Suspend Seed", ""));
            break;
        case "SongStructureSeedSettings":
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("scaleSeed", "Scale Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("tsSeed", "Time Signature Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("introSeed", "Intro Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("endSeed", "End Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("renderAmountSeed", "Render Amount Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("modulationSeed", "Modulation Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("tonicizationSeed", "Tonicization Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("songStructureSeed", "Song Structure Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("tempoSeed", "Tempo Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("glueSeed", "Glue Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("phraseGroupSeed", "Phrase Group Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("phraseGroupSimilaritySeed", "Phrase Group Similarity Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("groupSimilaritySeed", "Group Similarity Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("groupDifferenceSeed", "Group Difference Seed", ""));
            break;
        case "SongIndicesSeedSettings":
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("melodyShapeIndicesSeed", "Melody Shape Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("bassShapeIndicesSeed", "Bass Shape Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("harmonyIndicesSeed", "Harmony Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("harmonyRythmIndicesSeed", "Harmony Rythm Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("suspendIndicesSeed", "Suspend Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("melodyChannelDistributionIndicesSeed", "Melody Channel Distribution Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("inner1ChannelDistributionIndicesSeed", "Inner 1 Channel Distribution Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("inner2ChannelDistributionIndicesSeed", "Inner 2 Channel Distribution Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("bassChannelDistributionIndicesSeed", "Bass Channel Distribution Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("melodyMotifDistributionIndicesSeed", "Melody Motif Distribution Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("inner1MotifDistributionIndicesSeed", "Inner 1 Motif Distribution Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("inner2MotifDistributionIndicesSeed", "Inner 2 Motif Distribution Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("bassMotifDistributionIndicesSeed", "Bass Motif Distribution Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("percussionMotifDistributionIndicesSeed", "Percussion Motif Distribution Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("percussionFillMotifDistributionIndicesSeed", "Percussion Fill Distribution Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("harmonyExtraIndicesSeed", "Harmony Characteristics Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("renderAmountIndicesSeed", "Render Amount Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("tempoIndicesSeed", "Tempo Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("sequentialTempoChangeIndicesSeed", "Tempo Change 1 Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("parallelTempoChangeIndicesSeed", "Tempo Change 2 Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("sequentialMelodyEffectChangeIndicesSeed", "Melody Effect Change Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("sequentialInner1EffectChangeIndicesSeed", "Inner 1 Effect Change Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("sequentialInner2EffectChangeIndicesSeed", "Inner 2 Effect Change Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("sequentialBassEffectChangeIndicesSeed", "Bass Effect Change Indices Seed", ""));
            result.addPropertyInfo(this.createDefaultStringSeedPropertyInfo("sequentialPercussionEffectChangeIndicesSeed", "Percussion Effect Change Indices Seed", ""));
            break;
        case "SongParameters":
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("minorScaleLikelihood", "Minor Scale Likelihood", 1.0));
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("majorScaleLikelihood", "Major Scale Likelihood", 1.0));

            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("timeSignature2Likelihood", "2/4 Time Signature Likelihood", 1.0));
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("timeSignature3Likelihood", "3/4 Time Signature Likelihood", 1.0));
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("timeSignature4Likelihood", "4/4 Time Signature Likelihood", 3.0));

            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("electronicLikelihood", "Electronic Instruments Likelihood", 1.0));
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("electricLikelihood", "Electric Instruments Likelihood", 1.0));
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("acousticLikelihood", "Acoustic Instruments Likelihood", 1.0));

            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("strictBuildSongStructureLikelihoodMultiplier", "Strict Build Likelihood Multiplier", 1.0));
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("buildSongStructureLikelihoodMultiplier", "Build Likelihood Multiplier", 1.0));
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("verseChorusSongStructureLikelihoodMultiplier", "Verse Chorus Likelihood Multiplier", 1.0));
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("verseChorusBridgeSongStructureLikelihoodMultiplier", "Verse Chorus Bridge Likelihood Multiplier", 1.0));
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("noMelodyPartSongStructureLikelihoodMultiplier", "No Melody Part Likelihood Multiplier", 1.0));

            result.addPropertyInfo(this.createDefaultProbabilityListPropertyInfo("percussionFillProbabilities", "Percussion fill probabilities", [0.35]));

            result.addPropertyInfo(this.createDefaultProbabilityListPropertyInfo("raiseLeadingInMinorProbabilities", "Raise Leading Probabilities", [0.5]));

            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("tonicizeLikelihoodMultipliers", "Tonicize Likelihood Multipliers", [1.0]));
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("modulateLikelihoodMultiplier", "Modulate Likelihood Multiplier", 0.25));

            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("simpleMixtureLikelihoods", "Simple Mixture Likelihoods", [1.0]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("sus2ChordsLikelihoods", "Sus2 Chords Likelihoods", [1.0]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("sus4ChordsLikelihoods", "Sus4 Chords Likelihoods", [1.0]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("neighbourChordsLikelihoods", "Neighbour Chords Likelihoods", [1.0]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("passingChordsLikelihoods", "Passing Chords Likelihoods", [1.0]));

            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("melodyMotifRythmCountIncreasePerIndex", "Melody motif rythm count inc per index", 0.4));
            result.addPropertyInfo(this.createDefaultFloatRangePropertyInfo("melodyMotifRythmCountIncreaseOffsetRange", "Melody motif rythm count offet range", [0.5, 1.0]));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("bassMotifRythmCountIncreasePerIndex", "Bass motif rythm count inc per index", 0.4));
            result.addPropertyInfo(this.createDefaultFloatRangePropertyInfo("bassMotifRythmCountIncreaseOffsetRange", "Bass motif rythm count offset range", [0.25, 0.75]));

            result.addPropertyInfo(this.createDefaultProbabilityListPropertyInfo("melodyMotifZone1Probabilities", "Melody motif zone 1 probabilities", [0.5]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("melodyMotifZone1TripletLikelihoods", "Melody motif zone 1 triplet likelihoods", [0.5]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("melodyMotifZone1DotFirstLikelihoods", "Melody motif zone 1 dot first likelihoods", [2]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("melodyMotifZone1DotSecondLikelihoods", "Melody motif zone 1 dot second likelihoods", [0.5]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("melodyMotifZone1DotNormalDotLikelihoods", "Melody motif zone 1 dot normal dot likelihoods", [0.5]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("melodyMotifZone1NormalDotDotLikelihoods", "Melody motif zone 1 normal dot dot likelihoods", [0.5]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("melodyMotifZone1DotDotNormalLikelihoods", "Melody motif zone 1 dot dot normal likelihoods", [0.5]));
            result.addPropertyInfo(this.createDefaultRangeListPropertyInfo("melodyMotifZone1StartPosRanges", "Melody motif zone 1 start pos ranges", [[0, 0]], GuiPropertyDataType.FLOAT_LIST_2D));
            result.addPropertyInfo(this.createDefaultRangeListPropertyInfo("melodyMotifZone1EndPosRanges", "Melody motif zone 1 end pos ranges", [[0.75, 0.75]], GuiPropertyDataType.FLOAT_LIST_2D));
            result.addPropertyInfo(this.createDefaultRangeListPropertyInfo("melodyMotifZone1StartEnds", "Melody motif zone 1 start ends", [], GuiPropertyDataType.FLOAT_LIST_2D));

            result.addPropertyInfo(this.createDefaultProbabilityListPropertyInfo("bassMotifZone1Probabilities", "Bass motif zone 1 probabilities", [0.5]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("bassMotifZone1TripletLikelihoods", "Bass motif zone 1 triplet likelihoods", [0.01]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("bassMotifZone1DotFirstLikelihoods", "Bass motif zone 1 dot first likelihoods", [2]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("bassMotifZone1DotSecondLikelihoods", "Bass motif zone 1 dot second likelihoods", [0.5]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("bassMotifZone1DotNormalDotLikelihoods", "Bass motif zone 1 dot normal dot likelihoods", [0.5]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("bassMotifZone1NormalDotDotLikelihoods", "Bass motif zone 1 normal dot dot likelihoods", [0.5]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("bassMotifZone1DotDotNormalLikelihoods", "Bass motif zone 1 dot dot normal likelihoods", [0.5]));
            result.addPropertyInfo(this.createDefaultRangeListPropertyInfo("bassMotifZone1StartPosRanges", "Bass motif zone 1 start pos ranges", [[0, 0]], GuiPropertyDataType.FLOAT_LIST_2D));
            result.addPropertyInfo(this.createDefaultRangeListPropertyInfo("bassMotifZone1EndPosRanges", "Bass motif zone 1 end pos ranges", [[0.75, 0.75]], GuiPropertyDataType.FLOAT_LIST_2D));
            result.addPropertyInfo(this.createDefaultRangeListPropertyInfo("bassMotifZone1StartEnds", "Bass motif zone 1 start ends", [], GuiPropertyDataType.FLOAT_LIST_2D));


            result.addPropertyInfo(this.createDefaultProbabilityPropertyInfo("allInstrumentsDifferentProbability", "All Instrument Different Probability", 0.35));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("adaptHarmonyRythmToTempo", "Adapt Harmony Rythm to Tempo", true));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("adaptHarmonyRythmToTimeSignature", "Adapt Harmony Rythm to Time Signature", true));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("adaptSuspensionToTempo", "Adapt Suspension to Tempo", true));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("adaptMotifRythmsToTempo", "Adapt Motif Rythms to Tempo", true));

            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("filterFEffectsProbMultiplier", "Filter F Probability Multiplier", 1.0));
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("filterBWEffectsProbMultiplier", "Filter BW Probability Multiplier", 1.0));
            result.addPropertyInfo(this.createDefaultLikelihoodPropertyInfo("panEffectsProbMultiplier", "Pan Effect Probability Multiplier", 1.0));

            result.addPropertyInfo(this.createDefaultProbabilityPropertyInfo("oddHarmonyRythmProbability", "Odd Harmony Rythm Probability", 0.01));

            result.addPropertyInfo(this.createDefaultProbabilityListPropertyInfo("melodyShareProbabilities", "Melody Share Probabilities", [0.3]));
            result.addPropertyInfo(this.createDefaultProbabilityPropertyInfo("endSongTempoChangeProbability", "End Song Tempo Change Probability", 0.5));
            result.addPropertyInfo(this.createDefaultProbabilityListPropertyInfo("endPhraseGroupTempoChangeProbabilities", "End Phrase Group Tempo Change Probabilities", [0.0]));

            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("adaptTempoToRenderAmount", "Adapt Tempo to Render Amount", true));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("tempoAdaptBias", "Tempo Adapt Bias", 3));
            result.addPropertyInfo(this.createDefaultFloatPropertyInfo("tempoAdaptRandomMultiplier", "Tempo Adapt Random Multiplier", 3));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("useNaturalTempoChanges", "Use Natural Tempo Changes", true));

            result.addPropertyInfo(this.createDefaultProbabilityListPropertyInfo("voiceLineSuspensionProbabilities", "Voice Line Suspension Probabilities", [0.5]));
            result.addPropertyInfo(this.createDefaultProbabilityPropertyInfo("songIntroProbability", "Song Intro Probability", 0.7));
            result.addPropertyInfo(this.createDefaultProbabilityPropertyInfo("songEndProbability", "Song End Probability", 0.5));

            result.addPropertyInfo(this.createDefaultMinMaxFloatPropertyInfo("withinPhraseGroupSimilarRandomFraction", "Within Phrase Group Similar Fraction", 0.35, 0, 1));
            result.addPropertyInfo(this.createDefaultMinMaxFloatPropertyInfo("withinPhraseGroupSimilarBias", "Within Phrase Group Similar Bias", 0.55, 0, 1));

            result.addPropertyInfo(this.createDefaultMinMaxFloatPropertyInfo("samePhraseGroupIndexSimilarRandomFraction", "Same Phrase Group Index Similar Fraction", 0.25, 0, 1));
            result.addPropertyInfo(this.createDefaultMinMaxFloatPropertyInfo("samePhraseGroupIndexSimilarBias", "Same Phrase Group Index Similar Bias", 0.5, 0, 1));

            result.addPropertyInfo(this.createDefaultMinMaxFloatPropertyInfo("differentPhraseGroupIndexDifferentRandomFraction", "Different Phrase Group Index Different Fraction", 0.3, 0, 1));
            result.addPropertyInfo(this.createDefaultMinMaxFloatPropertyInfo("differentPhraseGroupIndexDifferentBias", "Different Phrase Group Index Different Bias", 0.25, 0, 1));

            result.addPropertyInfo(this.createDefaultProbabilityPropertyInfo("prefixGlueProbabilityMultiplier", "Prefix Group Probability Multiplier", 1));
            result.addPropertyInfo(this.createDefaultProbabilityPropertyInfo("postfixGlueProbabilityMultiplier", "Postfix Group Probability Multiplier", 1));

            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("useMaxHarmonyElementLength", "Use max harmony element length", true));

            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("prolongStaticLikelihoods", "Prolong Static Likelihoods", [2]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("prolongDynamicLikelihoods", "Prolong Dynamic Likelihoods", [4]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("prolongDominantCadenceLikelihoods", "Prolong Dominant Cadence Likelihoods", [3]));
            result.addPropertyInfo(this.createDefaultLikelihoodListPropertyInfo("prolongTonicCadenceLikelihoods", "Prolong Tonic Cadence Likelihoods", [1]));

            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("prolongHarmonyPartBiases", "Prolong Harmony Part Biases", [20]));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("prolongHarmonyPartRandomFractions", "Prolong Harmony Part Fractions", [50]));

//            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overwriteGroupModulationIndices", "Overwrite Group Modulation Indices", false));
//            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("groupModulation1Indices", "Single Step Modulation indices", [1]));
//            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("groupModulation2Indices", "Two Step Modulation indices", [1, 2]));
//            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("groupModulation3Indices", "Three Step Modulation indices", [1, 2, 3]));
//            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("groupModulation4Indices", "Four Step Modulation indices", [1, 2, 3, 4]));
//            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("groupModulation5Indices", "Five Step Modulation indices", [1, 2, 3, 4, 5]));


//            this.harmonyLengthLikelihoodMultipliers = [{}];
//            this.harmonyLengthLikelihoodOverwriters = [{}];
//            this.overwriteHarmonyLengthLikelihoods = [false];
//            this.harmonyLengthLikelihoods = [{"4": 1}];
            break;
        case "SongPartTypeOverrideInfo":
            result.addPropertyInfo(this.createEnumPropertyInfo("partType", "Part type", SongPartType.VERSE_1, SongPartType));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overridePhraseGroupType", "Override phrase group type", false));
            result.addPropertyInfo(this.createEnumPropertyInfo("phraseGroupType", "Phrase group type", SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT_SHORTEN, SimpleModuleGeneratorPhraseGroupType));

            result.addPropertyInfo(this.createEnumListPropertyInfo("customPhraseTypes", "Custom phrase types", PhraseHarmonyElementType.COMPLETE, PhraseHarmonyElementType));

            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overrideMajorModulationTarget", "Override major modulation/tonicization target", false));
            result.addPropertyInfo(this.createEnumPropertyInfo("majorModulationTarget", "Major modulation/tonicization target", DynamicHarmonyModulationTarget.DOMINANT, DynamicHarmonyModulationTarget));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overrideMinorModulationTarget", "Override minor modulation/tonicization target", false));
            result.addPropertyInfo(this.createEnumPropertyInfo("minorModulationTarget", "Minor modulation/tonicization target", DynamicHarmonyModulationTarget.DOMINANT, DynamicHarmonyModulationTarget));

            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("harmonyElementIndices", "Custom harmony indices", []));

            result.addPropertyInfo(this.createEnumListPropertyInfo("sameGroupIndexSames", "Same part sames", PhraseGroupIndexProperty.HARMONY_RYTHM, PhraseGroupIndexProperty));
            result.addPropertyInfo(this.createEnumListPropertyInfo("sameGroupIndexDifferents", "Same part differents", PhraseGroupIndexProperty.HARMONY_RYTHM, PhraseGroupIndexProperty));

//            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("sameGroupIndexDifferents", "Same part differents", [], PhraseGroupIndexProperty));


            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("melodyShapeIndexOverride", "Melody Shape index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("bassShapeIndexOverride", "Bass Shape index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("harmonyRythmIndexOverride", "Harmony rythm index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("suspendIndexOverride", "Suspend index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("melodyChannelDistributionIndexOverride", "Melody instrument index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("inner1ChannelDistributionIndexOverride", "Inner 1 instrument index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("inner2ChannelDistributionIndexOverride", "Inner 2 instrument index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("bassChannelDistributionIndexOverride", "Bass instrument index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("melodyMotifDistributionIndexOverride", "Melody motif distribution index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("inner1MotifDistributionIndexOverride", "Inner 1 motif distribution index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("inner2MotifDistributionIndexOverride", "Inner 2 motif distribution index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("bassMotifDistributionIndexOverride", "Bass motif distribution index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("percussionMotifDistributionIndexOverride", "Percussion motif distribution index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("percussionFillMotifDistributionIndexOverride", "Percussion fill motif distribution index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("harmonyExtraIndexOverride", "Harmony characteristics index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("renderAmountIndexOverride", "Render amount index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("sequentialMelodyEffectChangeIndexOverride", "Melody effect index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("sequentialInner1EffectChangeIndexOverride", "Inner 1 effect index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("sequentialInner2EffectChangeIndexOverride", "Inner 2 effect index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("sequentialBassEffectChangeIndexOverride", "Bass effect index override", []));
            result.addPropertyInfo(this.createDefaultIndexListPropertyInfo("sequentialPercussionEffectChangeIndexOverride", "Percussion effect index override", []));



//            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("harmonyIndexOverride", "Harmony index override", []));
//            this.tempoIndexOverride = [];
//            this.sequentialTempoChangeIndexOverride = [];
//            this.parallelTempoChangeIndexOverride = [];

            break;
        case "LinearInterpolatedCustomVoiceLineCurveInfo":
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("xValues", "X Values", [0, 1]));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("yValues", "Y Values", [60, 70]));
            break;

        case "SongDetails":
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("setScaleBaseNote", "Set scale base note", false));
            result.addPropertyInfo(this.createDefaultMinMaxIntPropertyInfo("scaleBaseNote", "Scale base note", 60, 0, 127));


            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overwriteSongPartStructure", "Overwrite Song Structure", false));
            result.addPropertyInfo(this.createSongPartStructureInfoListPropertyInfo("songPartStructure", "Song Structure", this.spsidsUidInfo));

            var info = this.createObjectListPropertyInfo("songPartTypeOverrideInfos", "Song part type override infos", this.phraseGroupTypesUidInfo,
                [
                    ["SongPartTypeOverrideInfo", "Song part type override info"]
                ]);
            info.listInfo.itemsDisplayFunction = function(valueItem) {
                return SongPartType.toString(valueItem.partType);
            };
            result.addPropertyInfo(info);

            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("harmonyRythmMeasureCountOverrides", "Harmony Rythm Measure Count overrides", [], [new ArrayElementConstraint(new RangePropertyConstraint([1, 32]))]));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("harmonyRythmNoteCountOverrides", "Harmony Rythm note count overrides", [], [new ArrayElementConstraint(new RangePropertyConstraint([0.125, 32]))]));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("harmonyRythmDensityCurveAmplitudeOverrides", "Harmony Rythm Density curve amp overrides", []));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("harmonyRythmDensityCurveFrequencyOverrides", "Harmony Rythm Density curve freq overrides", []));

            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("melodyMotifRythmNoteCountOverrides", "Melody motif rythm note count overrides", []));
            result.addPropertyInfo(this.createDefaultFloatListPropertyInfo("bassMotifRythmNoteCountOverrides", "Bass motif rythm note count overrides", []));

            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overwriteMelodyInstruments", "Override Melody Instruments", false));
            result.addPropertyInfo(this.createEnumListPropertyInfo("melodyInstruments", "Melody Instruments", MidiProgram.ACOUSTIC_GRAND_PIANO, MidiProgram));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overwriteInner1Instruments", "Override Inner 1 Instruments", false));
            result.addPropertyInfo(this.createEnumListPropertyInfo("inner1Instruments", "Inner 1 Instruments", MidiProgram.ACOUSTIC_GRAND_PIANO, MidiProgram));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overwriteInner2Instruments", "Override Inner 2 Instruments", false));
            result.addPropertyInfo(this.createEnumListPropertyInfo("inner2Instruments", "Inner 2 Instruments", MidiProgram.ACOUSTIC_GRAND_PIANO, MidiProgram));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overwriteBassInstruments", "Override Bass Instruments", false));
            result.addPropertyInfo(this.createEnumListPropertyInfo("bassInstruments", "Bass Instruments", MidiProgram.ACOUSTIC_GRAND_PIANO, MidiProgram));

            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("percussionFillMotifIndicesOverride", "Fill motif indices override", []));

            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("addBassDrumsOverride", "Add Bass Drum Overrides", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("addSnareDrumsOverride", "Add Snare Drum Overrides", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("addCrashDrumsOverride", "Add Crash Overrides", []));
            result.addPropertyInfo(this.createDefaultIntListPropertyInfo("addRideDrumsOverride", "Add Ride Overrides", []));

            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overrideBassDrumNote", "Override bass drum note", false));
            result.addPropertyInfo(this.createEnumPropertyInfo("bassDrumNote", "Bass Drum", MidiDrum.BASS_DRUM_1, MidiDrum));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overrideSnareDrumNote", "Override snare drum note", false));
            result.addPropertyInfo(this.createEnumPropertyInfo("snareDrumNote", "Snare Drum", MidiDrum.SNARE_DRUM_1, MidiDrum));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overrideCrashDrumNote", "Override crash drum note", false));
            result.addPropertyInfo(this.createEnumPropertyInfo("crashDrumNote", "Crash Drum", MidiDrum.CRASH_CYMBAL_1, MidiDrum));
            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overrideRideDrumNotes", "Override ride notes", false));
            result.addPropertyInfo(this.createEnumListPropertyInfo("rideDrumNotes", "Ride Drums", MidiDrum.RIDE_BELL, MidiDrum));

            var info = this.createObjectListPropertyInfo("harmonyElements", "Harmony elements", this.phraseGroupTypesUidInfo,
                [
                    ["SimpleSequenceHarmonyElement", "Simple Harmony Sequence"],
                    ["PhraseHarmonyElement", "Phrase Harmony"]
                ]);
            info.listInfo.itemsDisplayFunction = function(valueItem) {
                var result = "Harmony Element (" + valueItem._constructorName + ")";
                return result;
            };
            result.addPropertyInfo(info);


            var info = this.createObjectListPropertyInfo("customMelodyCurveInfos", "Melody curve infos", this.phraseGroupTypesUidInfo,
                [
                    ["LinearInterpolatedCustomVoiceLineCurveInfo", "Linear Interpolation"]
                ]);
            info.listInfo.itemsDisplayFunction = function(valueItem) {
                var result = "Voice line curve (" + valueItem._constructorName + ")";
                return result;
            };
            result.addPropertyInfo(info);

            var info = this.createObjectListPropertyInfo("customBassCurveInfos", "Bass curve infos", this.phraseGroupTypesUidInfo,
                [
                    ["LinearInterpolatedCustomVoiceLineCurveInfo", "Linear Interpolation"]
                ]);
            info.listInfo.itemsDisplayFunction = function(valueItem) {
                var result = "Voice line curve (" + valueItem._constructorName + ")";
                return result;
            };
            result.addPropertyInfo(info);



            break;
        case "SongDomains":

            result.addPropertyInfo(this.createDefaultFloatRangePropertyInfo("tempoRange", "Tempo Range", [], [new ArrayElementConstraint(new RangePropertyConstraint([10, 500]))]));
            result.addPropertyInfo(this.createDefaultRangeListPropertyInfo("melodyShapeAmpRanges", "Melody Shape Amplitude Ranges", [[6, 12]], GuiPropertyDataType.FLOAT_LIST_2D, [new ArrayElementConstraint(new ArrayElementConstraint(new RangePropertyConstraint([-12, 12])))]));
            result.addPropertyInfo(this.createDefaultRangeListPropertyInfo("melodyShapeBiasRanges", "Melody Shape Bias Ranges", [[68, 76]], GuiPropertyDataType.FLOAT_LIST_2D, [new ArrayElementConstraint(new ArrayElementConstraint(new RangePropertyConstraint([50, 90])))]));
            result.addPropertyInfo(this.createDefaultRangeListPropertyInfo("bassShapeAmpRanges", "Bass Shape Amplitude Ranges", [[2, 4]], GuiPropertyDataType.FLOAT_LIST_2D, [new ArrayElementConstraint(new ArrayElementConstraint(new RangePropertyConstraint([-12, 12])))]));
            result.addPropertyInfo(this.createDefaultRangeListPropertyInfo("bassShapeBiasRanges", "Bass Shape Bias Ranges", [[35, 45]], GuiPropertyDataType.FLOAT_LIST_2D, [new ArrayElementConstraint(new ArrayElementConstraint(new RangePropertyConstraint([25, 55])))]));

            result.addPropertyInfo(this.createDefaultBooleanPropertyInfo("overwriteSongPartStructureRndInfos", "Overwrite Song Structure Domain", false));
            result.addPropertyInfo(this.createSongPartStructureInfoDataSampleListPropertyInfo("songPartStructureRndInfos", "Song Structure Domain", this.spsidsUidInfo));

            result.addPropertyInfo(this.createPhraseGroupTypeDataSampleListPropertyInfo("phraseGroupTypes", "Phrase group types", this.phraseGroupTypesUidInfo));

            result.addPropertyInfo(this.createPhraseGroupTypeDataSampleListPropertyInfo("modulatePhraseGroupTypes", "Modulate phrase group types", this.phraseGroupTypesUidInfo));

            result.addPropertyInfo(this.createIntDataSampleListPropertyInfo("majorDeceptiveRootRndInfos", "Major deceptive root likelihoods", this.phraseGroupTypesUidInfo));
            result.addPropertyInfo(this.createIntDataSampleListPropertyInfo("minorDeceptiveRootRndInfos", "Minor deceptive root likelihoods", this.phraseGroupTypesUidInfo));

            result.addPropertyInfo(this.createPhraseGroupTypeDataSampleListPropertyInfo("introGroupTypes", "Intro group types", this.phraseGroupTypesUidInfo));
            result.addPropertyInfo(this.createPhraseGroupTypeDataSampleListPropertyInfo("endGroupTypes", "End group types", this.phraseGroupTypesUidInfo));
            result.addPropertyInfo(this.createPhraseGroupTypeDataSampleListPropertyInfo("glueGroupTypes", "Postfix/prefix group types", this.phraseGroupTypesUidInfo));



            var info = this.createObjectListPropertyInfo("majorModulationTargetInfos", "Major modulation/tonicization targets", this.phraseGroupTypesUidInfo,
                [
                    ["ModulationTargetDataSample", "Major modulation/tonicization target likelihood"]
                ]);
            info.listInfo.itemsDisplayFunction = function(valueItem) {
                return DynamicHarmonyModulationTarget.toString(valueItem.data) + ", Likelihood: " + valueItem.likelihood;
            };
            result.addPropertyInfo(info);

            var info = this.createObjectListPropertyInfo("minorModulationTargetInfos", "Minor modulation/tonicization targets", this.phraseGroupTypesUidInfo,
                [
                    ["ModulationTargetDataSample", "Minor modulation/tonicization target likelihood"]
                ]);
            info.listInfo.itemsDisplayFunction = function(valueItem) {
                return DynamicHarmonyModulationTarget.toString(valueItem.data) + ", Likelihood: " + valueItem.likelihood;
            };
            result.addPropertyInfo(info);


            result.addPropertyInfo(this.createMidiProgramDataSampleListPropertyInfo("electronicMelodyInstrInfos", "Electronic Melody Instrument Distribution", this.eomUidInfo));
            result.addPropertyInfo(this.createMidiProgramDataSampleListPropertyInfo("electronicInnerFastInstrInfos", "Electronic Inner 1 Instrument Distribution", this.eoi1UidInfo));
            result.addPropertyInfo(this.createMidiProgramDataSampleListPropertyInfo("electronicInnerSlowInstrInfos", "Electronic Inner 2 Instrument Distribution", this.eoi2UidInfo));
            result.addPropertyInfo(this.createMidiProgramDataSampleListPropertyInfo("electronicBassInstrInfos", "Electronic Bass Instrument Distribution", this.eobUidInfo));

            result.addPropertyInfo(this.createMidiProgramDataSampleListPropertyInfo("electricMelodyInstrInfos", "Electric Melody Instrument Distribution", this.emUidInfo));
            result.addPropertyInfo(this.createMidiProgramDataSampleListPropertyInfo("electricInnerFastInstrInfos", "Electric Inner 1 Instrument Distribution", this.ei1UidInfo));
            result.addPropertyInfo(this.createMidiProgramDataSampleListPropertyInfo("electricInnerSlowInstrInfos", "Electric Inner 2 Instrument Distribution", this.ei2UidInfo));
            result.addPropertyInfo(this.createMidiProgramDataSampleListPropertyInfo("electricBassInstrInfos", "Electric Bass Instrument Distribution", this.ebUidInfo));

            result.addPropertyInfo(this.createMidiProgramDataSampleListPropertyInfo("acousticMelodyInstrInfos", "Acoustic Melody Instrument Distribution", this.amUidInfo));
            result.addPropertyInfo(this.createMidiProgramDataSampleListPropertyInfo("acousticInnerFastInstrInfos", "Acoustic Inner 1 Instrument Distribution", this.ai1UidInfo));
            result.addPropertyInfo(this.createMidiProgramDataSampleListPropertyInfo("acousticInnerSlowInstrInfos", "Acoustic Inner 2 Instrument Distribution", this.ai2UidInfo));
            result.addPropertyInfo(this.createMidiProgramDataSampleListPropertyInfo("acousticBassInstrInfos", "Acoustic Bass Instrument Distribution", this.abUidInfo));

            result.addPropertyInfo(this.createMidiDrumDataSampleListPropertyInfo("bassDrumRndInfos", "Bass Drum Distribution", this.bdUidInfo));
            result.addPropertyInfo(this.createMidiDrumDataSampleListPropertyInfo("snareRndInfos", "Snare Drum Distribution", this.sdUidInfo));
            result.addPropertyInfo(this.createMidiDrumDataSampleListPropertyInfo("crashRndInfos", "Crash Drum Distribution", this.cdUidInfo));
            result.addPropertyInfo(this.createMidiDrumDataSampleListPropertyInfo("rideRndInfos", "Ride Drum Distribution", this.rdUidInfo));


//
//            this.minorHarmonicPlans = [
//                {data: [DynamicHarmonyModulationTarget.MEDIANT, DynamicHarmonyModulationTarget.MEDIANT, DynamicHarmonyModulationTarget.SUBDOMINANT], likelihood: 1},
//                {data: [DynamicHarmonyModulationTarget.DOMINANT, DynamicHarmonyModulationTarget.SUBDOMINANT], likelihood: 1}
//            ];
//            this.majorHarmonicPlans = [
//                {data: [DynamicHarmonyModulationTarget.DOMINANT, DynamicHarmonyModulationTarget.SUBDOMINANT], likelihood: 1},
//                {data: [DynamicHarmonyModulationTarget.SUPERTONIC, DynamicHarmonyModulationTarget.MEDIANT, DynamicHarmonyModulationTarget.DOMINANT], likelihood: 1}
//            ];
//
//            this.renderAmountStrengthMap = {
//                veryWeak: [0.02],
//                weak: [0.15],
//                medium: [0.4],
//                strong: [0.7],
//                veryStrong: [1.0]
//            };
//
//
//            this.majorModulationTargetInfos = [
//                {data: DynamicHarmonyModulationTarget.MEDIANT, likelihood: 0.1},
////        {data: DynamicHarmonyModulationTarget.SUBDOMINANT, likelihood: 0.02},
//                {data: DynamicHarmonyModulationTarget.SUBMEDIANT, likelihood: 0.1},
//                {data: DynamicHarmonyModulationTarget.SUPERTONIC, likelihood: 0.2},
//                {data: DynamicHarmonyModulationTarget.DOMINANT, likelihood: 1}
//            ];
//            this.minorModulationTargetInfos = [
//                {data: DynamicHarmonyModulationTarget.MEDIANT, likelihood: 1},
////        {data: DynamicHarmonyModulationTarget.SUBDOMINANT, likelihood: 0.05},
//                {data: DynamicHarmonyModulationTarget.SUBMEDIANT, likelihood: 0.1},
//                {data: DynamicHarmonyModulationTarget.SUBTONIC, likelihood: 0.1},
//                {data: DynamicHarmonyModulationTarget.DOMINANT, likelihood: 0.2}
//            ];
//
//            this.melodyMotifIndexPatternInfos = [
//                {data: [[1], [1], [0]], likelihood: 1},
//                {data: [[1], [2], [0]], likelihood: 1},
//                {data: [[0], [1], [2], [1]], likelihood: 1},
//                {data: [[0], [1], [2], [2]], likelihood: 1},
//                {data: [[0], [1], [1], [2]], likelihood: 1},
//                {data: [[0], [1], [2], [3]], likelihood: 1},
//                {data: [[1], [0], [1], [2]], likelihood: 1},
//                {data: [[1], [0], [2], [1]], likelihood: 1},
//                {data: [[1], [0], [2], [2]], likelihood: 1},
//                {data: [[1], [0], [1], [3]], likelihood: 1},
//                {data: [[1], [0], [2], [3]], likelihood: 1},
//                {data: [[1], [0], [3], [1]], likelihood: 1},
//                {data: [[1], [0], [3], [2]], likelihood: 1},
//                {data: [[1], [1], [0], [2]], likelihood: 1},
//                {data: [[1], [2], [0], [2]], likelihood: 1},
//                {data: [[1], [3], [0], [2]], likelihood: 1},
//                {data: [[1], [3], [0], [1]], likelihood: 1},
//                {data: [[1], [2], [0], [1]], likelihood: 1},
//                {data: [[1], [2], [1], [0]], likelihood: 1},
//                {data: [[1], [2], [3], [0]], likelihood: 1},
//                {data: [[1], [2], [2], [0]], likelihood: 1},
//                {data: [[1], [0], [2], [0]], likelihood: 1},
//                {data: [[1], [0], [1], [0]], likelihood: 1}
//            ];
//
//            this.bassMotifIndexPatternInfos = [
//                {data: [[1], [1], [0]], likelihood: 1},
//                {data: [[1], [2], [0]], likelihood: 1},
//                {data: [[0], [1], [2], [1]], likelihood: 1},
//                {data: [[0], [1], [2], [2]], likelihood: 1},
//                {data: [[0], [1], [1], [2]], likelihood: 1},
//                {data: [[0], [1], [2], [3]], likelihood: 1},
//                {data: [[1], [0], [1], [2]], likelihood: 1},
//                {data: [[1], [0], [2], [1]], likelihood: 1},
//                {data: [[1], [0], [2], [2]], likelihood: 1},
//                {data: [[1], [0], [1], [3]], likelihood: 1},
//                {data: [[1], [0], [2], [3]], likelihood: 1},
//                {data: [[1], [0], [3], [1]], likelihood: 1},
//                {data: [[1], [0], [3], [2]], likelihood: 1},
//                {data: [[1], [1], [0], [2]], likelihood: 1},
//                {data: [[1], [2], [0], [2]], likelihood: 1},
//                {data: [[1], [3], [0], [2]], likelihood: 1},
//                {data: [[1], [3], [0], [1]], likelihood: 1},
//                {data: [[1], [2], [0], [1]], likelihood: 1},
//                {data: [[1], [2], [1], [0]], likelihood: 1},
//                {data: [[1], [2], [3], [0]], likelihood: 1},
//                {data: [[1], [2], [2], [0]], likelihood: 1},
//                {data: [[1], [0], [2], [0]], likelihood: 1},
//                {data: [[1], [0], [1], [0]], likelihood: 1}
//            ];

            break;
    }

//    result.addPropertyInfo(this.createDefaultIntPropertyInfo("value", "Value", 0));
//    result.addPropertyInfo(this.createEnumPropertyInfo("enumType", "Enum type", EnumType.POSITION_UNIT, EnumType));

    return result;
};



var SongSettingsComponent = (function() {

    function changeComponentValue(newValue, createdComps, index, tabsId, changeListener) {
        var oldComp = createdComps[index];
        var oldValue = oldComp.object;
//            logit("Searching for " + oldComp.id);
        $("#" + oldComp.id).remove();

        copyObjectPropertiesDeep(oldValue, newValue);
//            logit("New value " + JSON.stringify(newValue) + " " + oldValue._constructorName);
        var comp = new GuiPropertiesComponent({object: oldValue, propertyInfoProvider: propertyInfoProvider});
        createdComps[index] = comp;
        var contentArr = [];
        comp.createJQueryStrings(contentArr);

        var $theTab = $("#" + tabsId + index);
        $theTab.append($(contentArr.join("")));
        var $tabs = $("#" + tabsId);
        comp.jQueryCreated($tabs);

        // Code duplication below...
        addChangeListener(index, createdComps, changeListener);
        oldValue.dirty = true;
        settingsDirty = true;
        if (changeListener) {
            changeListener(comp, oldValue, oldValue);
        }

        comp.$component.detach();

        $("#topdiv").append(comp.$component);
        comp.alignComponents();

        comp.$component.detach();
        $theTab.append(comp.$component);

        addSideButtons(comp, index);
    }

    function addChangeListener(index, createdComps, changeListener) {
        var comp = createdComps[index];
        var oldValue = comp.object;
        comp.changeListeners.push(function() {
            oldValue.dirty = true;
        });
        if (changeListener) {
            comp.changeListeners.push(changeListener);
        }
    }


    function compIsSeed(c) {
        var propInfo = c.propertyInfo;
        return stringEndsWith(propInfo.propertyName.toLowerCase(), "seed");
    }

    function compIsControlEtc(c) {
        var propInfo = c.propertyInfo;
        var test = propInfo.propertyName.toLowerCase();

        var result =
            stringEndsWith(test, "volumemultipliers") ||
                stringEndsWith(test, "volumemultiplier") ||
                stringEndsWith(test, "reverbsends") ||
                stringEndsWith(test, "reverbsend") ||
                stringEndsWith(test, "chorussends") ||
                stringEndsWith(test, "chorussend");
        return result;
    }

    function compIsLikelihoodOrProbEtc(c) {
        var propInfo = c.propertyInfo;
        var test = propInfo.propertyName.toLowerCase();

        var result =
            stringEndsWith(test, "renderamountoverride") ||
                stringEndsWith(test, "probsoverride") ||
                stringEndsWith(test, "likelihood") ||
                stringEndsWith(test, "likelihoods") ||
                stringEndsWith(test, "likelihoodmultiplier") ||
                stringEndsWith(test, "likelihoodmultipliers") ||
                stringEndsWith(test, "probmultipliers") ||
                stringEndsWith(test, "fraction") ||
                stringEndsWith(test, "probability") ||
                stringEndsWith(test, "probabilities");
        return result;
    }


    function zeroInput(comp) {
        comp.$input.val("0");
        comp.setValueVerifyRaw();
    }

    function oneInput(comp) {
        comp.$input.val("1");
        comp.setValueVerifyRaw();
    }

    function clearSeed(comp) {
        comp.$input.val("");
        comp.setValueVerifyRaw();
    }
    function randomizeSeed(comp) {
        var seed = globalRnd.genrand_int32();
        comp.$input.val("" + seed);
        comp.setValueVerifyRaw();
    }
    function explicitizeSeed(comp) {
        var mainSeed = getMainSeed();
        var rnd = new MersenneTwister(mainSeed);
        var createModuleSeed = rnd.genrand_int31();
        var genInfoRnd = new MersenneTwister(createModuleSeed);
        globalGenInfo.randomize(genInfoRnd);
        var propInfo = comp.propertyInfo;

        var explicitSeed = globalGenInfo[propInfo.propertyName];

        if (explicitSeed) {
            comp.$input.val("" + explicitSeed);
            comp.setValueVerifyRaw();
        }
    }

    function getAllChildrenWithTest(index, createdComps, test) {
        var result = [];
        var comp = createdComps[index];
        for (var j=0; j<comp.children.length; j++) {
            var child = comp.children[j];
            if (test(child)) {
                result.push(child);
            }
        }
        return result;
    }

    function getAllSeedChildren(index, createdComps) {
        return getAllChildrenWithTest(index, createdComps, compIsSeed)
    }
    function getAllLikelihoodChildren(index, createdComps) {
        return getAllChildrenWithTest(index, createdComps, compIsLikelihoodOrProbEtc);
    }


    function addSideButtons(comp, index) {

        function addSeedButtonsEventHandlers(child, $clearButton, $randomizeButton, $explicitButton) {
            var propInfo = child.propertyInfo;
            $clearButton.click(function() {
                clearSeed(child);
            });
            $randomizeButton.click(function() {
                randomizeSeed(child);
            });
            if ($explicitButton) {
                $explicitButton.click(function() {
                    explicitizeSeed(child);
                });
            }
        }

        function addLikelihoodButtonsEventHandlers(child, $zeroButton, $oneButton) {
            $zeroButton.click(function() {
                zeroInput(child);
            });
            $oneButton.click(function() {
                oneInput(child);
            });
        }

        function addButtonValueEventHandler(child, $button, value) {
            $button.click(function() {
                child.$input.val("" + value);
                child.setValueVerifyRaw();
            });
        }

        for (var i=0; i<comp.children.length; i++) {
            var child = comp.children[i];

//            var test = stringEndsWith(child.propertyInfo.propertyName.toLowerCase(), "likelihoods");
//            if (test) {
//                logit(child.propertyInfo.propertyName + " was seed or etc" + test);
//            }


            if (compIsLikelihoodOrProbEtc(child)) {
                var propInfo = child.propertyInfo;

                var $zeroButton = $("<button style=\"height: 3em; font-size: 60%\" title=\"Set to zero\" class=\"zero-likelihood-button\">0</button>");
                var $oneButton = $("<button style=\"height: 3em; font-size: 60%\" title=\"Set to one\" class=\"one-likelihood-button\">1</button>");
                child.$component.append($zeroButton);
                child.$component.append($oneButton);

                $zeroButton.button();
                $oneButton.button();

                addLikelihoodButtonsEventHandlers(child, $zeroButton, $oneButton);
            }

            if (compIsControlEtc(child)) {
                var propInfo = child.propertyInfo;

                var divisions = 100;
                var strValue = child.$input.val();
                var value = parseFloat(strValue);
                if (isNaN(value)) {

                } else {

                    var $ctrlSlider = $("<div style=\"width: 10em; margin-right: 1em; height: 1em; display: inline-block; font-size: 60%\"  class=\"ctrl-slider\"></div>");
                    child.$component.append($ctrlSlider);

                    function refreshCtrl(toRefresh, $slider) {
                        return function() {
                            var value = clamp((1 / divisions) * $slider.slider("value"), 0, 1);
                            toRefresh.$input.val("" + value);
                            toRefresh.setValueVerifyRaw();
                        };
                    }

                    $ctrlSlider.slider({
                        min: 0,
                        max: divisions,
                        value: clamp(Math.round(value * divisions), 0, divisions),
                        slide: refreshCtrl(child, $ctrlSlider),
                        change: refreshCtrl(child, $ctrlSlider)
                    });

                    var values = [0, 1];
                    for (var j=0; j<values.length; j++) {
                        var value = values[j];
                        var $valueButton = $("<button style=\"height: 3em; font-size: 60%\" title=\"Set to zero\" class=\"zero-ctrl-button\">" + value + "</button>");
                        child.$component.append($valueButton);
                        $valueButton.button();

                        $valueButton.click(
                            (function() {
                                var $slider = $ctrlSlider;
                                var v = value;
                                return function() {
                                    $slider.slider("option", "value", clamp(v * divisions, 0, divisions));
                                }
                            })()
                        );
                    }

                }

            }


            if (compIsSeed(child)) {
                var propInfo = child.propertyInfo;

                var $clearButton = $("<button style=\"height: 3em; font-size: 60%\" title=\"Clear seed\" class=\"clear-seed-button\">C</button>");
                var $randomizeButton = $("<button style=\"height: 3em; font-size: 60%\" title=\"Randomize seed\" class=\"randomizer-seed-button\">R</button>");
                child.$component.append($clearButton);
                child.$component.append($randomizeButton);

                $clearButton.button();
                $randomizeButton.button();
                var $explicitButton = null;

                if (globalGenInfo[propInfo.propertyName]) {
                    var $explicitButton = $("<button style=\"height: 3em; font-size: 60%\" title=\"Explicit seed\" class=\"explicit-seed-button\">E</button>");
                    child.$component.append($explicitButton);
                    $explicitButton.button();
                }
                addSeedButtonsEventHandlers(child, $clearButton, $randomizeButton, $explicitButton);
            }

        }
    }


    function createTabs($parent, tabsId, tabsClass, tabCaptions, tabObjects, changeListener, presets, addSeeds) {

        if (!addSeeds) {
            addSeeds = [];
        }

        var tabsArr = ["<div id=\"" + tabsId + "\">"];

        var createdComps = [];
        var contentArrs = [];

        tabsArr.push('<ul class="' + tabsClass + '-ul">');
        for (var i=0; i<tabCaptions.length; i++) {
            tabsArr.push("<li><a href=\"#" + (tabsId + i) + "\" >" + tabCaptions[i] + "</a></li>");
        }
        tabsArr.push("</ul>");

        var hasSeeds = [];
        var hasLikelihoods = [];

        if (presets) {
            for (var i=0; i<presets.length; i++) {
                var preset = presets[i];
                for (var j=0; j<preset.items.length; j++) {
                    var item = preset.items[j];
                    uidManager.addUniqueId(uidManager, tabsId + i, item.name);
                }
            }
        }

        function addHeaderHtml(arr, index) {
            var defaultButtonId = (tabsId + "_default_button_" + index);
            var saveButtonId = (tabsId + "_save_button_" + index);
            var loadButtonId = (tabsId + "_load_button_" + index);
            var manageButtonId = (tabsId + "_manage_button_" + index);
            var clearSeedsButtonId = (tabsId + "_clear_seeds_button_" + index);
            var randomizeSeedsButtonId = (tabsId + "_randomize_seeds_button_" + index);
            var explicitSeedsButtonId = (tabsId + "_explicit_seeds_button_" + index);

            var buttonStyle = "style=\"height: 3em; font-size: 50%\"";
            var headerArr = [
                "<div " +
                    "id=\"" + (tabsId + "_header_" + i) + "\" " +
                    "class=\"" + tabsClass + "\" " +
                    " >",
                (presets ? "<button  style=\"" + buttonStyle + "\" id=\"" + defaultButtonId + "\" title=\"All settings to default values\"  >Set Default</button>" : ""),
                (hasSeeds[index] && addSeeds[index] ? "<button  style=\"" + buttonStyle + "\" id=\"" + clearSeedsButtonId + "\" title=\"Clear all seed values\" >Clear Seeds</button>" : ""),
                (hasSeeds[index] && addSeeds[index] ? "<button  style=\"" + buttonStyle + "\" id=\"" + randomizeSeedsButtonId + "\" title=\"Randomize all seed values\" >Randomize Seeds</button>" : ""),
                (hasSeeds[index] && addSeeds[index] ? "<button  style=\"" + buttonStyle + "\" id=\"" + explicitSeedsButtonId + "\" title=\"Set all seeds to their explicit values\"  >Explicit Seeds</button>" : ""),
                (presets ? "<button  style=\"" + buttonStyle + "\" id=\"" + saveButtonId + "\" title=\"Save current settings as a preset\" >Save</button>" : ""),
                (presets ? "<button  style=\"" + buttonStyle + "\" id=\"" + loadButtonId + "\" title=\"Load settings preset\" >Load</button>" : ""),
                (presets ? "<button  style=\"" + buttonStyle + "\" id=\"" + manageButtonId + "\" title=\"Edit settings presets\" >Edit Presets</button>" : ""),
                "</div>"
            ];
            arr.push(headerArr.join(""));
        }




        function createHeaderComponents(index) {

            var defaultButtonId = (tabsId + "_default_button_" + index);
            var saveButtonId = (tabsId + "_save_button_" + index);
            var loadButtonId = (tabsId + "_load_button_" + index);
            var manageButtonId = (tabsId + "_manage_button_" + index);

            var clearSeedsButtonId = (tabsId + "_clear_seeds_button_" + index);
            var randomizeSeedsButtonId = (tabsId + "_randomize_seeds_button_" + index);
            var explicitSeedsButtonId = (tabsId + "_explicit_seeds_button_" + index);

            if (hasSeeds[index] && addSeeds[index]) {
                $("#" + clearSeedsButtonId).button().click(function() {
                    var seedChildren = getAllSeedChildren(index, createdComps);
                    for (var i=0; i<seedChildren.length; i++) {
                        clearSeed(seedChildren[i]);
                    }
                });
                $("#" + randomizeSeedsButtonId).button().click(function() {
                    var seedChildren = getAllSeedChildren(index, createdComps);
                    for (var i=0; i<seedChildren.length; i++) {
                        randomizeSeed(seedChildren[i]);
                    }
                });
                $("#" + explicitSeedsButtonId).button().click(function() {
                    var seedChildren = getAllSeedChildren(index, createdComps);
                    for (var i=0; i<seedChildren.length; i++) {
                        explicitizeSeed(seedChildren[i]);
                    }
                });
            }

            if (presets) {
                $("#" + saveButtonId).button().click(function() {
                    var content = "";
                    var idSuggest = uidManager.getNextUniqueId(tabsId + index, tabCaptions[index] + " Sub-Settings ");
                    content += "<div>";
                    content += "<span class=\"preset-name-label\" >Name:</span>";
                    content += "<input class=\"preset-name-input ui-corner-all\" value=\"" + idSuggest + "\" />";
                    content += "</div>";
                    var options = {
                        modal: true,
                        width: 450,
                        buttons: {
                            "Save": function() {
                                if (presets) {
                                    var newId = $(this).find(".preset-name-input")[0].value;
                                    var preset = presets[index];
                                    var item = preset.getItemWithName(newId);

                                    if (!item) {
                                        item = new PresetItem();
                                        preset.items.push(item);
                                        uidManager.addUniqueId(uidManager, tabsId + index, newId);
                                    }
                                    item.name = newId;
                                    item.data = copyValueDeep(tabObjects[index]);

                                    preset.saveToLocalStorage();
                                }
//                        logit("Creating new item with name " + newItem.name);
                                $( this ).dialog( "close" );
                            },
                            "Cancel": function() {
                                $( this ).dialog( "close" );
                            }
                        }
                    };
                    showModalDialog("Save " + tabCaptions[index] + " Sub-Settings", content, options);
                });

                $("#" + loadButtonId).button().click(function() {

                    var content = "";
                    content += "<div>";
                    content += "<select class=\"preset-name-select ui-corner-all\" >";
                    if (presets) {
                        var preset = presets[index];
                        for (var i=0; i<preset.items.length; i++) {
                            var item = preset.items[i];
                            content += "<option value=\"" + item.name + "\" >" + item.name + "</option>";
                        }
                    }
                    content += "</select>";
                    content += "</div>";
                    var options = {
                        modal: true,
                        width: 450,
                        buttons: {
                            "Load": function() {
                                if (presets) {
                                    var presetName = $(this).find(".preset-name-select")[0].value;
                                    var preset = presets[index];
                                    var item = null;
                                    for (var i=0; i<preset.items.length; i++) {
                                        if (preset.items[i].name == presetName) {
                                            item = preset.items[i];
                                            break;
                                        }
                                    }
                                    if (item && item.data) {
                                        changeComponentValue(item.data, createdComps, index, tabsId, changeListener);
                                    }
//                            logit("Loading preset item " + JSON.stringify(item));
                                }
                                $( this ).dialog( "close" );
                            },
                            "Cancel": function() {
                                $( this ).dialog( "close" );
                            }
                        }
                    };
                    showModalDialog("Load " + tabCaptions[index] + " Sub-Settings", content, options);
                });

                $("#" + manageButtonId).button().click(function() {
                    var content = "";
                    content += "<div>";
                    content += "<ol class=\"preset-list\" >";
                    if (presets) {
                        var preset = presets[index];
                        for (var i=0; i<preset.items.length; i++) {
                            var item = preset.items[i];
                            content += "<li class=\"ui-widget-content\" >" + item.name + "</li>";
                        }
                    }
                    content += "</ol>";
                    content += "</div>";

                    content += "<div>";
                    content += "<button class=\"preset-rename-button\">Rename</button>";
                    content += "<button class=\"preset-duplicate-button\">Duplicate</button>";
                    content += "<button class=\"preset-delete-button\">Delete</button>";
                    content += "</div>";
                    var options = {
                        modal: true,
                        width: 450,
                        buttons: {
                            "Close": function() {
                                $( this ).dialog( "close" );
                            }
                        }
                    };
                    var selectedList = [];
                    var selectedSet = {};
                    var $dialog = showModalDialog("Edit " + tabCaptions[index] + " Sub-Settings", content, options);
                    var $list = $dialog.find(".preset-list").selectable({
                        selected: function(event, ui) {
                            var selected = ui.selected;
                            if (!arrayContains(selectedList, selected.innerHTML)) {
                                selectedList.push(selected.innerHTML);
                            }
                            selectedSet[selected.innerHTML] = selected;
                        },
                        unselected: function(event, ui) {
                            var unselected = ui.unselected;
                            arrayDelete(selectedList, unselected.innerHTML);
                            selectedSet[unselected.innerHTML] = null;
                        }
                    });
                    var $renameButton = $dialog.find(".preset-rename-button").button();
                    var $duplicateButton = $dialog.find(".preset-duplicate-button").button();
                    var $deleteButton = $dialog.find(".preset-delete-button").button();
                    $renameButton.click(
                        function() {
                            if (selectedList.length == 1) {
                                logit("Renaming " + selectedList[0]);
                            }
                        }
                    );
                    $deleteButton.click(
                        function() {
                            if (presets) {
                                var preset = presets[index];
                                for (var i=0; i<selectedList.length; i++) {
                                    var item = preset.getItemWithName(selectedList[i]);
                                    arrayDelete(preset.items, item);
                                    var $sel = $(selectedSet[selectedList[i]]);
                                    $sel.remove();
                                }
                                preset.saveToLocalStorage();
                                selectedList = [];
                                selectedSet = {};
                            }
                        }
                    );
                });

                $("#" + defaultButtonId).button().click(function() {
                    var newValue = eval("new " + tabObjects[index]._constructorName + "()");
                    changeComponentValue(newValue, createdComps, index, tabsId, changeListener);
                });
            }
        }



        for (var i=0; i<tabCaptions.length; i++) {
            var obj = tabObjects[i];

            var headerArr = [];
            var contentArr = [];

            if (obj) {
                var comp = new GuiPropertiesComponent({object: obj, propertyInfoProvider: propertyInfoProvider});
                createdComps[i] = comp;
                var seedChildren = getAllSeedChildren(i, createdComps);
                hasSeeds[i] = seedChildren.length > 0;
                var likelihoodChildren = getAllLikelihoodChildren(i, createdComps);
                hasLikelihoods[i] = likelihoodChildren.length > 0;
                comp.createJQueryStrings(contentArr);
                contentArrs.push(contentArr);
                addHeaderHtml(headerArr, i);
            }

            tabsArr.push(
                "<div " +
                    "id=\"" + (tabsId + i) + "\" " +
                    "class=\"" + tabsClass + "\" " +
                    " >" +
                    headerArr.join("") +
                    contentArr.join("") +
                    "</div>");
        }

        tabsArr.push("</div>");


        var $tabs = $(tabsArr.join(""));
        $parent.append($tabs);

        for (var i=0; i<tabCaptions.length; i++) {
            var $tab = $("#" + tabsId + i);
        }


        for (var i=0; i<createdComps.length; i++) {
            var comp = createdComps[i];
            comp.jQueryCreated($tabs);
            addChangeListener(i, createdComps, changeListener);
            createHeaderComponents(i);
        }

        for (var i=0; i<createdComps.length; i++) {
            var comp = createdComps[i];
            comp.alignComponents();
            addSideButtons(comp);
        }

        $tabs.tabs();

        return {
            createdComps: createdComps,
            changeListener: changeListener
        };
    }

    return {
        createTabs: createTabs,
        changeComponentValue: changeComponentValue
    }

})();




var AsyncServerChildTaskType = {
    RENDER: 0,
    EXPORT_MIDI: 1,
    EXPORT_WAV: 2,
    EXPORT_MP3: 3,
    EXPORT_OGG: 4,
    SAVE_PRESET: 5,
    SAVE_SONG: 6,
    DELETE_SONG: 7,
    RENAME_SONG: 8,
    DUPLICATE_SONGS: 9,
    OVERWRITE_SONG: 10
};


var WorkerTaskType = {
    RENDER: 0,
    EXPORT_MIDI: 1,
    EXPORT_WAV: 2
};


function AsyncOperation(options) {

    this.requireLogin = getValueOrDefault(options, "requireLogin", true);

    this.onDone = getValueOrDefault(options, "onDone", function(op) {
//        console.log("No onDone function specified...");
    });
    this.onFail = getValueOrDefault(options, "onFail", function(op) {
//        console.log("No onDone function specified...");
    });
    this.onCancel = getValueOrDefault(options, "onCancel", function(op) {
    });
    this.onSuccess = getValueOrDefault(options, "onSuccess", function(op) {
    });

    this.id = getValueOrDefault(options, "id", "theId");

    this.caption = getValueOrDefault(options, "caption", "Progress " + this.id + "(" + this.type + ")");
    this.doneCaption = getValueOrDefault(options, "doneCaption", "Done!");
    this.maxCount = getValueOrDefault(options, "maxCount", 1);
    this.progressDivId = getValueOrDefault(options, "progressDivId", "progressdiv");

    this.resultDivId = getValueOrDefault(options, "resultDivId", "progressdiv");

    this.createProgress = getValueOrDefault(options, "createProgress", true);


    this.done = false;
    this.cancelled = false;

    this.failReason = "";

    this.removeDelay = 2000; // Milliseconds before the progress stuff is removed
    this.$progressBar = null;
    this.$progressComp = null;
    this.$captionComp = null;
    this.$cancelButton = null;
}

AsyncOperation.prototype.update = function() {
};

AsyncOperation.prototype.start = function() {
};

AsyncOperation.prototype.cancel = function() {
    var that = this;
    setTimeout(function() {
        that.removeProgress();
    }, this.removeDelay);

    if (this.$progressComp) {
        // Some visual indication that the operation is a failure
    }
    if (that.onCancel) {
        that.onCancel(that);
    }
    that.cancelled = true;
};


AsyncOperation.prototype.removeProgress = function(fraction) {
    if (this.$progressComp) {
        var that = this;
        this.$progressComp.hide("fast", function() {
            that.$progressComp.remove();
        });
    }
};



AsyncOperation.prototype.addResultUrl = function(resultUrl) {
    if (this.resultDivId) {
        var $resultDiv = $("#" + this.resultDivId);

        $resultDiv.prepend($("<div style=\"display: none\" class=\"ui-widget-content ui-corner-all progress-component\" ><a href=\"" + resultUrl + "\">Result</a></div>"));
        $resultDiv.show("fast");
    }
};


AsyncOperation.prototype.updateProgress = function(intProgress) {
    if (this.createProgress) {
        var barId = this.$progressBar.attr("id");
        this.$progressBar.progressbar("option", "value", intProgress);
    }
};

AsyncOperation.prototype.success = function() {
    var that = this;
    setTimeout(function() {
        that.removeProgress();
    }, that.removeDelay);
    if (that.createProgress) {
        // Some visual indication that the operation is a success
        that.updateProgress(100);
        that.$captionComp.html(that.doneCaption);
        that.$cancelButton.button("disable");
    }
    if (that.onSuccess) {
        that.onSuccess(that);
    }
    if (that.onDone) {
        that.onDone(that);
    }
    that.done = true;
};


AsyncOperation.prototype.fail = function() {
    var that = this;
    setTimeout(function() {
        that.removeProgress();
    }, this.removeDelay);

    if (this.$progressComp) {
        // Some visual indication that the operation is a failure
        var captionId = this.id + "_caption";
        var failStr = this.failReason ? this.failReason : "Failed...";
        this.$progressComp.find("#" + captionId)[0].innerHTML = failStr;
    }
    if (that.onFail) {
        that.onFail(that);
    }
    if (that.onDone) {
        that.onDone(that);
    }
    that.done = true;
};


AsyncOperation.prototype.addProgress = function() {
    if (this.createProgress) {
        var $progressDiv = $("#" + this.progressDivId);

        var barId = this.id + "_progressbar";
        var captionId = this.id + "_caption";
        var cancelButtonId = this.id + "_cancelbutton";
        var progressStrs = [
            "<div style=\"display: none\" class=\"ui-widget-content ui-corner-all progress-component\" >",
            "<div class=\"ui-widget\" id=\"" + captionId + "\" >" + this.caption + "</div>",
            "<div id=\"" + barId + "\" class=\"progress-bar\" ></div>",
            "<button id=\"" + cancelButtonId + "\">Cancel</button>",
            "</div>"];

        this.$progressComp = $(progressStrs.join(""));

        $progressDiv.prepend(this.$progressComp);
        this.$progressComp.show("fast");

//        logit("Bar id " + barId);
        this.$progressBar = this.$progressComp.find("#" + barId);
        this.$progressBar.progressbar();
        this.$captionComp = this.$progressComp.find("#" + captionId);
        this.$cancelButton = this.$progressComp.find("#" + cancelButtonId);
        this.$cancelButton.button();

        var that = this;
        this.$cancelButton.click(function() {
            that.cancel();
        });
    }

};

function LoadSamplesAsyncOperation(options) {
    if (options) {
        options.caption = "Loading samples...";
    }
    AsyncOperation.call(this, options);
    this.requireLogin = false;

    this.audioType = getValueOrDefault(options, "audioType", "audio/mpeg");

    this.bufferUrls = getValueOrDefault(options, "bufferUrls", []);

    this.resultBuffers = [];
    this.loadedCount = 0;

}
LoadSamplesAsyncOperation.prototype = new AsyncOperation();


function LoadSM2SoundsAsyncOperation(options) {
    LoadSamplesAsyncOperation.call(this, options);

}
LoadSM2SoundsAsyncOperation.prototype = new LoadSamplesAsyncOperation();

LoadSM2SoundsAsyncOperation.prototype.sm2Loaded = false;

LoadSM2SoundsAsyncOperation.prototype._bufferMap = {}; // Indexed by urls


LoadSM2SoundsAsyncOperation.prototype.start = function() {

    var that = this;


    if (!LoadSM2SoundsAsyncOperation.prototype.sm2Loaded) {

        // Load the script dynamically
        $.ajax("js/soundmanager2-nodebug-jsmin.js", {
            complete: function(jqXhr, textStatus) {
                if (textStatus == "success") {
                    $.globalEval(jqXhr.responseText);
                    // Setup the sound manager

                    soundManager.setup({
                        url: 'swf/',

                        onready: function() {
                            logit("Soundmanager is ready!!!");
                            LoadSM2SoundsAsyncOperation.prototype.sm2Loaded = true;
                            that.start();
                        }
                    });
                } else {
                    console.log("Could not load: " + textStatus);
                    that.failReason = "Unable to initialize player";
                    that.fail();
                }
            },
            type: 'GET'
        });
        return; // Start is called later
    }

    this.addProgress();

    function addBuffer(buffer, url, index) {
        LoadSM2SoundsAsyncOperation.prototype._bufferMap[url] = buffer;
        that.resultBuffers[index] = buffer;
        that.loadedCount++;

        var fractionDone = that.loadedCount / that.bufferUrls.length;
        var intProgress = Math.round(100 * fractionDone);

        that.updateProgress(intProgress);

        if (!that.cancelled) {
            if (that.loadedCount == that.bufferUrls.length) {
                that.success();
            }
        }
    }


    function loadBuffer(index) {
        var url = that.bufferUrls[index];

        var theBuffer = LoadSM2SoundsAsyncOperation.prototype._bufferMap[url];

        if (theBuffer) {
            addBuffer(theBuffer, url, index);
        } else {

            var sound = soundManager.createSound({
                id: url,
                url: url
            });
            sound.load();
            addBuffer(sound, url, index);

//            addBuffer(sound, url, index);
        }
    }

    try {

        if (that.bufferUrls.length > 0) {
            for (var i=0; i<this.bufferUrls.length; i++) {
                loadBuffer(i);
            }
        }
    } catch (ex) {
        that.failReason = "Error when loading samples";
        that.fail();
        throw ex;
    }
};



function LoadAudioBuffersAsyncOperation(options) {
    LoadSamplesAsyncOperation.call(this, options);

    this.audioContext = getValueOrDefault(options, "audioContext", null);
}
LoadAudioBuffersAsyncOperation.prototype = new LoadSamplesAsyncOperation();

LoadAudioBuffersAsyncOperation.prototype._bufferMap = {};

LoadAudioBuffersAsyncOperation.prototype.createBuffer = function(func, freq) {
    var buffer = this.context.createBuffer(1, this.context.sampleRate, this.context.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i=0; i<data.length; i++) {
        var frac = i / (data.length - 1);
        data[i] = 0.5 * func(frac * freq);
    }
    return buffer;
};


LoadAudioBuffersAsyncOperation.prototype.start = function() {

    var that = this;

    this.addProgress();

    var maxConcurrent = 1;

    function addBuffer(buffer, url, index) {
        LoadAudioBuffersAsyncOperation.prototype._bufferMap[url] = buffer;
        that.resultBuffers[index] = buffer;
        that.loadedCount++;

        var fractionDone = that.loadedCount / that.bufferUrls.length;
        var intProgress = Math.round(100 * fractionDone);

        that.updateProgress(intProgress);

        if (!that.cancelled) {
            if (that.loadedCount == that.bufferUrls.length) {
                that.success();
            } else {
                var nextIndex = index + maxConcurrent;
                if (nextIndex < that.bufferUrls.length) {
                    loadBuffer(nextIndex);
                }
            }
        }
    }


    function loadBuffer(index) {
        var url = that.bufferUrls[index];

        var theBuffer = LoadAudioBuffersAsyncOperation.prototype._bufferMap[url];

        if (theBuffer) {
            // Already found the buffer
//            logit("reusing buffer " + url);
            addBuffer(theBuffer, url, index);
        } else {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            request.onfail = function() {
                that.fail();
            };
            request.onload = function() {
                that.audioContext.decodeAudioData(request.response, function(buffer) {
                    addBuffer(buffer, url, index);
                }, function() {
                    that.fail();
                });
            };
            request.send();
        }
    }
    if (that.bufferUrls.length > 0) {
        for (var i=0; i<maxConcurrent; i++) {
            loadBuffer(i);
        }
    }

};



function AsyncServerChildTask(options) {
    AsyncOperation.call(this, options);
    this.taskType = getValueOrDefault(options, "taskType", AsyncServerChildTaskType.RENDER);
    this.user = getValueOrDefault(options, "user", "guest");
    this.content = getValueOrDefault(options, "content", {});

    switch (this.taskType) {
        case AsyncServerChildTaskType.EXPORT_MIDI:
        case AsyncServerChildTaskType.EXPORT_MP3:
        case AsyncServerChildTaskType.EXPORT_OGG:
        case AsyncServerChildTaskType.RENDER:
            this.requireLogin = false;
            break;
    }

    this.resultUrl = null;
    this.resultRenderData = null;
    this.resultRenderDataLength = 1;
    this.resultSongStructureInfo = null;
    this.resultSectionTimes = null;
    this.resultChannelMaps = null;

    this.taskName = null; // Received from server
}
AsyncServerChildTask.prototype = new AsyncOperation();


AsyncServerChildTask.prototype.cancel = function() {
    AsyncOperation.prototype.cancel.call(this);

    var message = {
        type: "cancelTask",
        taskName: this.taskName
    };

    var that = this;
    $.ajax("task", {
        data: JSON.stringify(message),
        contentType: "application/json",
        complete: function(jqXhr, textStatus) {
            if (textStatus == "success") {
                var response = $.parseJSON(jqXhr.responseText);
//                logit(" Received task name " + that.taskName);
            } else {
                console.log("Task cancel ajax complete. Text status not success: " + textStatus);
            }
        },
        type: 'POST'
    });

};


AsyncServerChildTask.prototype.update = function() {
    if (this.cancelled || this.done) {
        return;
    }

    // Get progress reports from server
    var message = {
        type: "getTaskProgress",
        taskType: this.taskType,
        taskName: this.taskName
    };

    if (this.taskName && !this.done) {
        var that = this;
        $.ajax("task", {
            data: JSON.stringify(message),
            contentType: "application/json",
            complete: function(jqXhr, textStatus) {

                if (that.done) {
                    return; // A result that comes after the task is done, just ignore it
                }

                if (textStatus == "success") {

                    var response = $.parseJSON(jqXhr.responseText);

//                    logit(" received progress result: " + jqXhr.responseText);

                    if (response.type == "progress") {

                        var intProgress = Math.round(100 * response.progress);

                        that.updateProgress(intProgress);
                        if (response.progress == 1 && (response.result || response.resultUrl)) {
                            if (response.resultUrl) {
//                            <audio controls="controls">
//                                <source src="horse.ogg" type="audio/ogg">
//                                    <source src="horse.mp3" type="audio/mp3">
//                                    Your browser does not support the audio element.
//                                    </audio>

                                if (that.resultDivId) {
                                    var $resultDiv = $("#" + that.resultDivId);

                                    var addAudioElement = true;

                                    var audioType = "audio/mp3";

                                    switch (that.taskType) {
                                        case AsyncServerChildTaskType.EXPORT_MP3:
                                            addAudioElement = true;
                                            audioType = "audio/mp3";
                                            break;
                                        case AsyncServerChildTaskType.EXPORT_OGG:
                                            addAudioElement = true;
                                            audioType = "audio/ogg";
                                            break;
                                        case AsyncServerChildTaskType.EXPORT_WAV:
                                        case AsyncServerChildTaskType.EXPORT_MIDI:
                                        case AsyncServerChildTaskType.RENDER:
                                            addAudioElement = false;
                                            break;
                                    }

                                    var audioElementHtml = "";
                                    if (addAudioElement) {
                                        audioElementHtml = "<audio style=\"width: 20em; height: 3em; \" class=\"audio-player\" controls=\"controls\" preload=\"none\" >" +
                                            "<source src=\"" + response.resultUrl + "\" type=\"" + audioType + "\" />" +
                                            "</audio>";
                                    }

                                    var removeButtonId = response.resultUrl.replace(/\/|\./g, "_") + "_button";
                                    var resultDivId = response.resultUrl.replace(/\/|\./g, "_") + "_div";

                                    var $theResult = $("<div style=\"display: none\" " +
                                        "class=\"ui-widget-content ui-corner-all progress-component\" " +
                                        "id=\"" + resultDivId + "\" >" +
                                        audioElementHtml +
                                        "<a class=\"result-url\" href=\"" + response.resultUrl + "\" target=\"_blank\" >Result Link</a>" +
                                        "<button id=\"" + removeButtonId + "\">Remove</button>" +
                                        "</div>");
                                    $resultDiv.prepend($theResult);
                                    $("#" + removeButtonId).button().click(function() {
                                        $("#" + resultDivId).detach();
//                                    logit("dhflks6djf");
                                    });
                                    $theResult.show("slow");

                                    if (addAudioElement) {
                                        that.$audioElement = $theResult.find("audio");
                                    }
                                }

//                                that.addResultUrl(response.resultUrl);
                            }
                            if (response.result) {
                                that.resultRenderData = response.result.renderData;
                                that.resultRenderDataLength = response.result.renderDataLength;
                                that.resultSongStructureInfo = response.result.songStructureInfo;
                                that.resultChannelMaps = response.result.channelMaps;
                                that.resultSectionTimes = response.result.sectionTimes;
                            }
                            that.success();
                        }
                    } else if (response.type == "error") {
                        if (!that.done) {

                            that.failReason = "Unable to get progress";
                            logit(response);
                            that.fail();
                        }
                    } else {

                        logit("Ignoring result from getTaskProgress");
                        logit(response);
                    }

                } else {
                    console.log("Task progress ajax complete. Text status not success: " + textStatus);
                    that.fail();
                }
            },
            type: 'POST'
        });
    }
};

AsyncServerChildTask.prototype.start = function() {

    var message = {
        type: "startTask",
        taskType: this.taskType,
        user: this.user,
        content: this.content
    };

    var that = this;
    $.ajax("task", {
        data: JSON.stringify(message),
        contentType: "application/json",
        complete: function(jqXhr, textStatus) {
            if (textStatus == "success") {
                var response = $.parseJSON(jqXhr.responseText);
                if (response.type == "error") {
                    that.failReason = response.message;
                    that.fail();
                }
//                logit(response);

                that.taskName = response.taskName;
//                logit(" Received task name " + that.taskName);
            } else {
                that.fail();
                console.log("Task start ajax complete. Text status not success: " + textStatus);
            }
        },
        type: 'POST'
    });

    this.addProgress();

};


function AsyncWorkerTask(options) {
    AsyncOperation.call(this, options);

    this.requireLogin = false;

    this.taskType = getValueOrDefault(options, "taskType", WorkerTaskType.RENDER);
    this.content = getValueOrDefault(options, "content", {});

    this.transferableSupported = false;

    this.resultRenderData = null;
    this.resultRenderDataLength = 1;
    this.resultSongStructureInfo = null;
    this.resultChannelMaps = null;
    this.resultSectionTimes = null;

    this.progress = 0;

    var script = 'js/worker.js';

    this.worker = new Worker(script);
    this.worker.postMessage({});

    var that = this;

    var testBuf = new ArrayBuffer(1);
    try {
        this.worker.postMessage(testBuf, [testBuf]);
        if (testBuf.byteLength) {
            // Not supported
        } else {
//        logit("Transferable supported!!!!");
//            this.transferableSupported = true;
        }
    } catch (exc) {
        logit("Exception thrown when trying to post message to worker.");
    }

    function padNumberString(number, length) {
        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }

    function getFilenamePrefix() {
        var date = new Date();
        var songName = "song";
        return songName + "_" +
            padNumberString(date.getUTCFullYear(), 4) + "" +
            padNumberString(date.getUTCMonth() + 1, 2) + "" + // utc month starts at zero :)
            padNumberString(date.getUTCDate(), 2) + "_" +
            padNumberString(date.getUTCHours(), 2) + "" +
            padNumberString(date.getUTCMinutes(), 2) + "" +
            padNumberString(date.getUTCSeconds(), 2) + "_" +
            padNumberString(date.getUTCMilliseconds(), 3);
    }

    var onWorkerMessage = function(e) {
        var msg = e.data;

        var type = msg.type;

        if (type) {
            switch (type) {
                case "log":
                    console.log(msg.data);
                    break;
                case "error":
                    that.failReason = msg.data;
                    that.fail();
                    that.worker.terminate();
                    break;
                case "result":
                    var result = JSON.parse(msg.data);
                    that.resultRenderData = result.renderData;
                    that.resultRenderDataLength = result.renderDataLength;
                    that.resultChannelMaps = result.channelMaps;
                    that.resultSongStructureInfo = result.songStructureInfo;
                    that.resultSectionTimes = result.sectionTimes;

                    if (that.taskType == WorkerTaskType.EXPORT_MIDI || that.taskType == WorkerTaskType.EXPORT_WAV) {
//                    logit(result.midiData);

                        var buffer = null;
                        var extension = ".mid";

                        var addAudioElement = false;
                        var audioType = "audio/wav";

                        switch (that.taskType) {
                            case WorkerTaskType.EXPORT_MIDI:
                                var fakeByteArray = new FakeByteArray();
                                Midi.encodeMidi(result.midiData, fakeByteArray);
                                buffer = fakeByteArray.toBuffer();
//                                addAudioElement = true;
//                                audioType = "audio/midi";
                                break;
                            case WorkerTaskType.EXPORT_WAV:
                                if (!that.resultBuffer) {
                                    logit("Expected a result buffer from the worker before the result message");
                                }
                                buffer = that.resultBuffer;
                                extension = ".wav";
                                addAudioElement = true;
                                audioType = "audio/wav";
                                break;
                        }

                        if (buffer) {

                            var blob = new Blob([new Uint8Array(buffer)]);

                            var resultUrl = window.URL.createObjectURL(blob);

                            var audioElementHtml = "";

                            if (addAudioElement) {
                                if (addAudioElement) {
                                    audioElementHtml = "<audio style=\"width: 20em; height: 3em; \" class=\"audio-player\" controls=\"controls\" preload=\"none\" >" +
                                        "<source src=\"" + resultUrl + "\" type=\"" + audioType + "\" />" +
                                        "</audio>";
                                }
                            }

                            var removeButtonId = that.id + "_result_remove_button";
                            var loadButtonId = that.id + "_result_load_button";
                            var resultDivId = that.id + "_result_div";

                            var $resultDiv = $("#" + that.resultDivId);

//                    var resultUrl = "";

                            var downloadName = getFilenamePrefix() + extension;

                            var extraHint = "";
                            var a = document.createElement('a');
                            if (typeof a.download === "undefined") {
                                extraHint = '<div>You need to "save link target as" and ensure that the filename ends with "' + extension + '"</div>';
                            }

                            var $theResult = $("<div style=\"display: none\" " +
                                "class=\"ui-widget-content ui-corner-all progress-component\" " +
                                "id=\"" + resultDivId + "\" >" +
                                audioElementHtml +
                                "<a class=\"result-url\" " +
                                'download="' + downloadName + '" ' +
                                "href=\"" + resultUrl + "\" " +
                                "target=\"_blank\" >Result Link</a>" +
                                "<button id=\"" + removeButtonId + "\">Remove</button>" +
                                "<button id=\"" + loadButtonId + "\">Load</button>" +
                                extraHint +
                                "</div>");
                            $resultDiv.prepend($theResult);
                            $("#" + removeButtonId).button().click(function() {
                                $("#" + resultDivId).detach();
                            });
                            $("#" + loadButtonId).button().click(function() {
                                updateSongSettingsComponent(that.content.genInfo, {name: that.content.name, seed: "" + that.content.strSeed});
                                afterExport(that);
                            });
                            $theResult.show("slow");

                            if (addAudioElement) {
                                that.$audioElement = $theResult.find("audio");
                            }

                        } else {
                            logit("Could not create wav blob...");
                        }

                    }
                    that.worker.removeEventListener('message', onWorkerMessage);
                    that.worker.terminate();
                    that.success();
                    break;
                case "progressReport":
                    that.progress = Math.round(100 * parseFloat(msg.progress));
//                console.log("Setting progress to " + that.progress);
//                that.updateProgress()
                    break;
            }

        } else {
            // Assuming that it is a buffer
            that.resultBuffer = msg;
        }

    };

    this.worker.addEventListener('message', onWorkerMessage, false);

}
AsyncWorkerTask.prototype = new AsyncOperation();



AsyncWorkerTask.prototype.cancel = function() {
    AsyncOperation.prototype.cancel.call(this);

    var message = {
        type: "cancelTask"
    };
//    this.worker.postMessage(message);
};


AsyncWorkerTask.prototype.update = function() {
    if (this.cancelled || this.done) {
        return;
    }
    if (!this.done) {
        this.updateProgress(this.progress);
    }
};

AsyncWorkerTask.prototype.start = function() {

    var message = {
        type: "startTask",
        transferableSupported: this.transferableSupported,
        taskType: this.taskType,
        content: this.content
    };

    this.worker.postMessage(message);

    this.addProgress();

};





function gatherEventsWithType(events, type) {
    var result = [];
    for (var i=0; i<events.length; i++) {
        var e = events[i];

//        console.log(e);
        if (e.y == type) {
            result.push(e);
        }
    }
    return result;
}

function beatsToSeconds(beats, tempo) {
    return 60.0 * (beats / tempo);
};


function secondsToBeats(seconds, tempo) {
    return seconds * tempo / 60.0;
}

function predictBeat(tempoEvents, time) {

    var currentTempo = 120;

    var currentSeconds = 0;
    var prevSeconds = 0;

    var currentBeat = 0;

    for (var i=0; i<tempoEvents.length; i++) {
        prevSeconds = currentSeconds;

        var e = tempoEvents[i];

        var beatStep = e.t - currentBeat;

        var secondsStep = beatsToSeconds(beatStep, currentTempo);

        if (time >= currentSeconds && time <= currentSeconds + secondsStep) {
            var timeFrac = (time - currentSeconds) / secondsStep;
            currentBeat += timeFrac * beatStep;
            currentSeconds += secondsStep * 2; // So we don't check true later
            break;
        }

        currentSeconds += secondsStep;
        currentBeat += beatStep;

        currentTempo = e.b;
    }
    if (time > currentSeconds) {
        var diff = time - currentSeconds;
        var dt = secondsToBeats(diff, currentTempo);
        currentBeat += dt;
    }
    return currentBeat;
}



// Events must be sorted
function gatherNotesFromEvents(events) {
    var notes = {};
    var notesDone = {};
    var allNotes = [];

    var currentTempo = 120;

    var currentTime = 0; // Seconds

    var currentBeat = 0;
    for (var i=0; i<events.length; i++) {
        var e = events[i];

//        console.log(e);

        var beatStep = e.t - currentBeat;
        if (beatStep < 0) {
            logit("The events must be sorted " + beatStep);
        }
        var timeStep = beatsToSeconds(beatStep, currentTempo);
        currentTime += timeStep;
        switch (e.y) { // The compressed format
            case "c":
                e.seconds = currentTime;
                break;
            case "n":
                var current = notes[e.c];
                if (!current) {
                    current = [];
                    notes[e.c] = current;
                }
                current.push({onEvent: e, onTime: currentTime});
//                logit(" event beat: " + e.t + " seconds: " + currentTime + " tempo: " + currentTempo);
                break;
            case "f":
                var current = notes[e.c];
                if (!current) {
                    logit("Found note off without noteOn");
                } else {
                    var minTimeData = null;
                    for (var j=0; j<current.length; j++) {
                        var c = current[j];
                        if (e.n == c.onEvent.n) {
                            if (!minTimeData || c.onEvent.t < minTimeData.onEvent.t) {
                                minTimeData = c;
                            }
                        }
                    }
                    if (!minTimeData) {
                        logit("Failed to find matching noteOn event");
                    } else {
                        minTimeData.offEvent = e;
                        minTimeData.offTime = currentTime;
                        var doneArr = notesDone[e.c];
                        if (!doneArr) {
                            doneArr = [];
                            notesDone[e.c] = doneArr;
                        }
                        doneArr.push(minTimeData);
                        allNotes.push(minTimeData);
                        arrayDelete(current, minTimeData);
//                    current.indexOf(minTimeData)
                    }
                }
                break;
            case "t":
                e.seconds = currentTime;
                var bpm = e.b;
                currentTempo = bpm;
                break;
            default:
                logit("Unknown event type " + e.y);
                break;
        }
        currentBeat = e.t;
    }
    return notesDone;

}var AudioPlayerMode = {
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








function FrustumCullingChunks() {
    this.objects = [];
    this.boundingSpheres = [];
    this.maxDistance = 1000;

    this.objectsInScene = [];
    this.objectsNotInScene = [];

    this.planes = [
        new THREE.Vector4(),
        new THREE.Vector4(),
        new THREE.Vector4(),
        new THREE.Vector4(),
        new THREE.Vector4(),
        new THREE.Vector4()
    ];
}

FrustumCullingChunks.prototype.addChunk = function(object, sphere) {
    this.objects.push(object);
    this.boundingSpheres.push(sphere);
    this.objectsInScene.push(this.objects.length - 1);
};

FrustumCullingChunks.prototype.updateScene = function(scene, m) {

    var plane;
    var planes = this.planes;

    var me = m.elements;
    var me0 = me[0], me1 = me[1], me2 = me[2], me3 = me[3];
    var me4 = me[4], me5 = me[5], me6 = me[6], me7 = me[7];
    var me8 = me[8], me9 = me[9], me10 = me[10], me11 = me[11];
    var me12 = me[12], me13 = me[13], me14 = me[14], me15 = me[15];

    planes[ 0 ].set( me3 - me0, me7 - me4, me11 - me8, me15 - me12 );
    planes[ 1 ].set( me3 + me0, me7 + me4, me11 + me8, me15 + me12 );
    planes[ 2 ].set( me3 + me1, me7 + me5, me11 + me9, me15 + me13 );
    planes[ 3 ].set( me3 - me1, me7 - me5, me11 - me9, me15 - me13 );
    planes[ 4 ].set( me3 - me2, me7 - me6, me11 - me10, me15 - me14 );
    planes[ 5 ].set( me3 + me2, me7 + me6, me11 + me10, me15 + me14 );

    for ( var i = 0; i < 6; i ++ ) {
        plane = planes[ i ];
        plane.divideScalar( Math.sqrt( plane.x * plane.x + plane.y * plane.y + plane.z * plane.z ) );
    }

    var sceneObjectsToRemove = [];
    var sceneObjectsToAdd = [];

    var newSceneObjects = [];
    var newNotInSceneObjects = [];
    for (var i=0; i<this.objectsInScene.length; i++) {
        var index = this.objectsInScene[i];
        var object = this.objects[index];
        var sphere = this.boundingSpheres[index];
        if (!this.contains(object, sphere)) {
            sceneObjectsToRemove.push(object);
            newNotInSceneObjects.push(index);
        } else {
            newSceneObjects.push(index);
        }
    }
    for (var i=0; i<this.objectsNotInScene.length; i++) {
        var index = this.objectsNotInScene[i];
        var object = this.objects[index];
        var sphere = this.boundingSpheres[index];
        if (this.contains(object, sphere)) {
            sceneObjectsToAdd.push(object);
            newSceneObjects.push(index);
        } else {
            newNotInSceneObjects.push(index);
        }
    }
    this.objectsNotInScene = newNotInSceneObjects;
    this.objectsInScene = newSceneObjects;

    for (var i=0; i<sceneObjectsToAdd.length; i++) {
        scene.add(sceneObjectsToAdd[i]);
//        logit("Adding chunk..." + i + " " + this.objectsInScene.length + " " + this.objectsNotInScene.length);
    }
    for (var i=0; i<sceneObjectsToRemove.length; i++) {
        scene.remove(sceneObjectsToRemove[i]);
//        logit("Removing chunk... " + i + " " + this.objectsInScene.length + " " + this.objectsNotInScene.length);
    }

};


FrustumCullingChunks.prototype.contains = function ( object, boundingSphere ) {
    var distance = 0.0;
    var planes = this.planes;
    var matrix = object.matrixWorld;
    var me = matrix.elements;
    var radius = - boundingSphere.radius * matrix.getMaxScaleOnAxis();

    for ( var i = 0; i < 6; i ++ ) {

        distance = planes[ i ].x * me[12] + planes[ i ].y * me[13] + planes[ i ].z * me[14] + planes[ i ].w;
        if ( distance <= radius ) return false;

    }
    return true;
};


var VisualizerMode = {
    PLAY: 0,
    PAUSE: 1,
    STOP: 2
};




function Visualizer() {
    this.mode = VisualizerMode.STOP;
    this.currentBeatTime = 0;
    this.currentStopBeatTime = 0;
    this.minBeat = 0;
    this.maxBeat = 1;
    this.focusBeat = 0;

    this.sectionTimes = null;
    this.songStructureInfo = null;
}

Visualizer.prototype.updateSectionFramework = function() {
};

Visualizer.prototype.setSectionInfos = function(times, structure) {
    this.sectionTimes = times;
    this.songStructureInfo = structure;
    this.updateSectionFramework();
    return this;
};

Visualizer.prototype.setMode = function(mode) {
    this.mode = mode;
//    switch (mode) {
//        case VisualizerMode.STOP:
//            this.clearHighlightNotes();
//            break;
//    }
    return this;
};


Visualizer.prototype.render = function() {
};

Visualizer.prototype.step = function(dt) {
};

Visualizer.prototype.setCurrentPlayBeatTime = function(beatTime) {
    this.currentBeatTime = beatTime;
//    logit(" someone setting beat time " + beatTime);
    return this;
};


Visualizer.prototype.addRenderData = function(data, beatOffset) {
};

Visualizer.prototype.resetRenderData = function() {
    this.mode = VisualizerMode.STOP;
    this.minBeat = 0;
    this.maxBeat = 1;
};



var Visualizer3DPlayMovementMode = {
    ROTATE: 0,
    PAN: 1
};
var Visualizer3DPauseMovementMode = {
    ROTATE: 0,
    PAN: 1
};

function Visualizer3D(canvas, options) {
    Visualizer.call(this);
    if (canvas) {


        this.mousePageX = canvas.width * 0.5;
        this.mousePageY = canvas.height * 0.5;
        this.mouseCanvasX = canvas.width * 0.5;
        this.mouseCanvasY = canvas.height * 0.5;
        this.mouseCanvasDragDx = 0;
        this.mouseCanvasDragDy = 0;
        this.mouseCanvasDown = false;

        this.fractionDragVelX = 0;
        this.fractionDragVelY = 0;

        this.currentAngle = 0;

        var that = this;

//        $(canvas).on("touchmove", function (event) {
//            var e = event.originalEvent;
//            if (e.touches && e.touches.length > 0) {
//                var touch = e.touches[0];
//
//                var dx = touch.clientX - that.mousePageX;
//                var dy = touch.clientY - that.mousePageY;
//                that.mouseCanvasDragDx += dx;
//                that.mouseCanvasDragDy += dy;
//            }
//        });
//        $(canvas).on("touchstart", function (event) {
//            var e = event.originalEvent;
//            if (e.touches && e.touches.length > 0) {
//                var touch = e.touches[0];
//                that.mouseCanvasDown = true;
//                that.mousePageX = touch.clientX;
//                that.mousePageY = touch.clientY;
//            }
//        });
//        $(canvas).on("touchend", function (event) {
//            var e = event.originalEvent;
//            if (e.touches && e.touches.length > 0) {
//                var touch = e.touches[0];
//                var dx = touch.clientX - that.mousePageX;
//                var dy = touch.clientY - that.mousePageY;
//                that.mouseCanvasDragDx += dx;
//                that.mouseCanvasDragDy += dy;
//            }
//            that.mouseCanvasDown = false;
//        });

        $(document).on("mousemove", function(event) {
            if (that.mouseCanvasDown) {
                var dx = event.pageX - that.mousePageX;
                var dy = event.pageY - that.mousePageY;
                that.mouseCanvasDragDx += dx;
                that.mouseCanvasDragDy += dy;
            }
            that.mousePageX = event.pageX;
            that.mousePageY = event.pageY;
        });
        $(canvas).on("mousemove", function(event) {
            if (that.mouseCanvasDown) {
                that.mouseCanvasDragDx += event.pageX - that.mouseCanvasX;
                that.mouseCanvasDragDy += event.pageY - that.mouseCanvasY;
            }
            that.mouseCanvasX = event.pageX;
            that.mouseCanvasY = event.pageY;
        });
        $(canvas).on("mousedown", function(event) {
            that.mouseCanvasDown = true;
        });
        $(document).on("mouseup", function(event) {
            that.mouseCanvasDown = false;
        });

        this.clearColor = 0x050510;

        this.renderChannelNames = [];

        this.playMovementMode = Visualizer3DPlayMovementMode.PAN;
        this.stopMovementMode = Visualizer3DStopMovementMode.PAN_INTERACTIVE_HOVER;
        this.pauseMovementMode = Visualizer3DPauseMovementMode.PAN;
        this.beatLengthScale = 2.0;
        var w = canvas.width;
        var h = canvas.height;

        var fov = 75;
        var near = 1;
        var far = 1000;

        this.canvas = canvas;
//        this.camera = new THREE.PerspectiveCamera( fov, w / h, near, far );
        this.camera = new THREE.CombinedCamera(w, h, fov, near, far, near, far);
        this.camera.position.set(0, 60, 50);
        this.camera.lookAt(new THREE.Vector3(0, 40, 0));
//        this.camera.toOrthographic();
        this.scene = new THREE.Scene();

        this.scene.fog = new THREE.FogExp2( this.clearColor, 0.008);


        this.landscapeChunkSize = 128;
        this.landscapeChunkDivisions = this.getLandscapeChunkDivisions();

        var rnd = new MersenneTwister(3423432);
        this.perlin = new ClassicalNoise(rnd);

        this.frustumChunks = new FrustumCullingChunks();

        this.createLandscape();
//        this.scene.add(this.createLandscape());

        this.addGlobalLights();

        this.noteChunks = [];

        this.noteCollisionGrid = [];
        this.allNoteDatas = [];

        this.currentLookAt = new THREE.Vector3(0, 0, 0);

    }
}

Visualizer3D.prototype = new Visualizer();

Visualizer3D.prototype.getLandscapeChunkDivisions = function() {
    return 16;
};

Visualizer3D.prototype.clearHighlightNotes = function() {

    this.upperLight.intensity = 0;
    this.middleLight.intensity = 0;
    this.lowerLight.intensity = 0;

    for (var i=0; i<this.allNoteDatas.length; i++) {
        var dat = this.allNoteDatas[i];
        dat.mesh.scale.set(dat.w, 1, 1);
        dat.material.emissive = new THREE.Color(dat.normalEmissive);
        dat.material.color = new THREE.Color(dat.normalColor);
    }
};

Visualizer3D.prototype.highlightNotes = function(beat) {
    var b = Math.floor(beat);
//    logit("Checking beat " + beat);

    this.upperLight.intensity = 0;
    this.middleLight.intensity = 0;
    this.lowerLight.intensity = 0;

    var lightDatas = [
        {
            light: this.upperLight,
            colorVec: new THREE.Vector3(0.01, 0.01, 0.01),
            pos: new THREE.Vector3(0, 0, 0),
            count: 0
        },
        {
            light: this.middleLight,
            colorVec: new THREE.Vector3(0.01, 0.01, 0.01),
            pos: new THREE.Vector3(0, 0, 0),
            count: 0
        },
        {
            light: this.lowerLight,
            colorVec: new THREE.Vector3(0.01, 0.01, 0.01),
            pos: new THREE.Vector3(0, 0, 0),
            count: 0
        }
    ];


    if (b >= 0) {
        var arr = this.noteCollisionGrid[b];

        if (arr) {
//            logit("Checking beat " + beat + " " + arr.length);


            for (var i=0; i<arr.length; i++) {
                var dat = arr[i];
                var onEvent = dat.onEvent;
                var channel = onEvent.c;
//                logit(channel);

                var channelName = this.renderChannelNames[channel];

                var offEvent = dat.offEvent;
                if (beat >= onEvent.t && beat <= offEvent.t) {
                    var frac = (beat - onEvent.t) / (offEvent.t - onEvent.t);
                    var invFrac = 1.0 - frac;
                    var amp = 0.7;
                    var newEmissive = new THREE.Color(dat.normalColor);
                    var newColor = new THREE.Color(dat.playColor);
                    dat.material.emissive = newEmissive;
                    dat.material.color = newColor;
                    dat.mesh.scale.set(dat.w, 1 + amp * invFrac, 1 + amp * invFrac);

                    var lightIndex = 0;
                    if (channelName.indexOf("inner") == 0) {
                        lightIndex = 1;
                    } else if (channelName.indexOf("bass") == 0 || channelName.indexOf("percussion") == 0) {
                        lightIndex = 2;
                    }
                    var lightData = lightDatas[lightIndex];

                    var intensity = Math.max(0.5, invFrac);

                    lightData.colorVec.add(new THREE.Vector3(newEmissive.r * intensity, newEmissive.g * intensity, newEmissive.b * intensity));
                    lightData.pos.add(new THREE.Vector3(dat.minX, dat.minY, dat.minZ));
                    lightData.count++;

                } else {
                    dat.mesh.scale.set(dat.w, 1, 1);
                    dat.material.emissive = new THREE.Color(dat.normalEmissive);
                    dat.material.color = new THREE.Color(dat.normalColor);
                }
            }
        }
    }

    for (var i=0; i<lightDatas.length; i++) {
        var lightData = lightDatas[i];
        if (lightData.count > 0) {
            lightData.pos.divideScalar(lightData.count);
            lightData.light.position.copy(lightData.pos);
//            logit(lightData.pos.x + ", " + lightData.pos.y + ", " + lightData.pos.z);
            lightData.light.intensity = 0.5 * lightData.colorVec.length();
            lightData.colorVec.normalize();
            var lightColor = new THREE.Color();
            lightColor.r = lightData.colorVec.x;
            lightColor.g = lightData.colorVec.y;
            lightColor.b = lightData.colorVec.z;
            lightData.light.color = lightColor;
        }
    }
};

Visualizer3D.prototype.step = function(dt) {


    var towardsPosition = new THREE.Vector3();
    var towardsLookAt = new THREE.Vector3(1, 0, 0);

    var currentPosition = new THREE.Vector3().copy(this.camera.position);
    var currentLookAt = this.currentLookAt;

    var factor = 0.9;


    var docW = window.innerWidth;
    var docH = window.innerHeight;

    var fractionX = this.mousePageX / docW;
    var fractionY = this.mousePageY / docH;

    var fractionCanvasDragDx = this.mouseCanvasDragDx / docW;
    var fractionCanvasDragDy = this.mouseCanvasDragDy / docH;

    var dSec = dt * 0.001;

    if (!docW || !docH) {
        var $document = $(document);
        docW = $document.innerWidth();
        docH = $document.innerWidth();
    }

    if (dSec > 0 && docW && docH) {
        if (this.mouseCanvasDown) {
            var velFactor = 0.5;
            var invVelFactor = 1.0 - velFactor;

            var fractionCanvasDragDxDt = fractionCanvasDragDx / dSec;
            var fractionCanvasDragDyDt = fractionCanvasDragDy / dSec;
            this.fractionDragVelX = this.fractionDragVelX * velFactor + fractionCanvasDragDxDt * invVelFactor;
            this.fractionDragVelY = this.fractionDragVelY * velFactor + fractionCanvasDragDyDt * invVelFactor;
        } else {
            var dragCoeff = 1.5;
            var forceX = -dragCoeff * this.fractionDragVelX;
            var forceY = -dragCoeff * this.fractionDragVelY;
            this.fractionDragVelX += forceX * dSec;
            this.fractionDragVelY += forceY * dSec;
        }
    }

    switch (this.mode) {
        case VisualizerMode.PLAY:
            var posX = this.currentBeatTime * this.beatLengthScale;
            var distanceZ = 70;

            var lookAtY = 70;

            towardsPosition.set(posX, lookAtY, distanceZ);
            towardsLookAt.set(posX, lookAtY, 0);

            this.highlightNotes(this.currentBeatTime);
            break;
        case VisualizerMode.PAUSE:
        case VisualizerMode.STOP:
            this.currentStopBeatTime += dt * 0.002;
            var seconds = this.currentStopBeatTime;
//            this.clearHighlightNotes();
            switch (this.stopMovementMode) {
                case Visualizer3DStopMovementMode.ROTATE_INTERACTIVE_HOVER:
                    var centerX = this.maxBeat * 0.5 * this.beatLengthScale;

                    var distance = 150 - 100 * fractionY;
                    var height = 150 - 100 * fractionY;
                    var phase = Math.PI * fractionX;

                    towardsPosition.set(distance * Math.cos(phase) + centerX, height, distance * Math.sin(phase));
                    towardsLookAt.set(centerX, 60, 0);

                    break;
                case Visualizer3DStopMovementMode.ROTATE_PAN_INTERACTIVE_HOVER:
                    var centerX = this.maxBeat * fractionX * this.beatLengthScale;

                    var distance = 100 - 50 * fractionY;
                    var height = 100 - 50 * fractionY;
                    var phase = -0.75 * Math.PI * (fractionX - 0.5) - Math.PI * 1.5;

                    towardsPosition.set(distance * Math.cos(phase) + centerX, height, distance * Math.sin(phase));
                    towardsLookAt.set(centerX, 60, 0);

                    break;
                case Visualizer3DStopMovementMode.PAN_INTERACTIVE_HOVER:
                    var centerX = this.maxBeat * fractionX * this.beatLengthScale;

                    var depth = 60;
                    var height = 80 - 40 * fractionY;

                    towardsPosition.set(centerX, height, depth);
                    towardsLookAt.set(centerX, height, 0);
                    break;
                case Visualizer3DStopMovementMode.PAN_INTERACTIVE_DRAG:

                    var targetX = clamp(currentLookAt.x - docW * this.fractionDragVelX * dSec, 0, this.maxBeat * this.beatLengthScale);
                    var targetY = clamp(currentLookAt.y + docH * this.fractionDragVelY * dSec, 0, 127);

                    var depth = 60;

                    towardsPosition.set(targetX, targetY, depth);
                    towardsLookAt.set(targetX, targetY, 0);
                    break;
                case Visualizer3DStopMovementMode.ROTATE_INTERACTIVE_DRAG:

                    var centerX = this.maxBeat * 0.5 * this.beatLengthScale;
                    this.currentAngle += this.fractionDragVelX * dSec;

                    var camPos = this.camera.position;
                    var targetDistance = clamp(camPos.y + docH * this.fractionDragVelY * dSec, 40, 500);

                    var height = targetDistance;
                    var distance = targetDistance;
                    var lookAtY = 60;

                    towardsPosition.set(centerX + distance * Math.cos(this.currentAngle), height, distance * Math.sin(this.currentAngle));
                    towardsLookAt.set(centerX, lookAtY, 0);
                    break;
                case Visualizer3DStopMovementMode.ROTATE_PAN_INTERACTIVE_DRAG:

                    var camPos = this.camera.position;
                    var targetX = clamp(currentLookAt.x - docW * this.fractionDragVelX * dSec, 0, this.maxBeat * this.beatLengthScale);
                    var targetY = clamp(camPos.y + 500 * this.fractionDragVelY * dSec, 20, 300);

                    fractionX = targetX / (this.maxBeat * this.beatLengthScale);
                    var phase = 0.25 * Math.PI * (fractionX - 0.5) - Math.PI * 1.5;

                    var distance = targetY;

                    towardsPosition.set(distance * Math.cos(phase) + targetX, targetY, distance * Math.sin(phase));
                    towardsLookAt.set(targetX, 60, 0);
                    break;
                case Visualizer3DStopMovementMode.PAN:
                    var beatsPerSeconds = 1;

                    var distance = 60;
                    var frac = 0;
                    if (this.maxBeat > 5) {
                        var period = 2 * this.maxBeat * this.beatLengthScale;

                        var x = beatsPerSeconds * this.beatLengthScale * seconds;
                        frac = mod(x, period) / period;

                        if (frac >= 0.5) {
                            frac = 1.0 - (frac - 0.5) * 2;
                        } else {
                            frac *= 2;
                        }
                    }
                    var posX = frac * this.maxBeat * 2;

                    towardsPosition.set(posX, distance, distance);
                    towardsLookAt.set(posX, 60, 0);
                    break;
                case Visualizer3DStopMovementMode.ROTATE:
                    var centerX = this.maxBeat * 0.5 * this.beatLengthScale;

                    var distance = 100;
                    var height = 100;
                    var frequency = 0.01;
                    var phase = frequency * Math.PI * 2 * seconds + Math.PI / 2;

                    towardsPosition.set(100 * Math.cos(phase) + centerX, height, 100 * Math.sin(phase));
                    towardsLookAt.set(centerX, 60, 0);
                    break;
            }
            break;
    }

    var invFactor = 1.0 - factor;

    this.camera.position.set(towardsPosition.x * invFactor + currentPosition.x * factor,
        towardsPosition.y * invFactor + currentPosition.y * factor,
        towardsPosition.z * invFactor + currentPosition.z * factor);

    currentLookAt = new THREE.Vector3(towardsLookAt.x * invFactor + currentLookAt.x * factor,
        towardsLookAt.y * invFactor + currentLookAt.y * factor,
        towardsLookAt.z * invFactor + currentLookAt.z * factor);
    var distanceToLookAt = this.camera.position.distanceTo(currentLookAt);
    if (distanceToLookAt < 0.0001) {
        // Crazy, but it feels better to deal with this than to hope for the best :)
        currentLookAt.add(new THREE.Vector3(0.1 * Math.random() + 0.01, 0.1 * Math.random(), 0.1 * Math.random()));
    }

    this.camera.lookAt(currentLookAt);
    this.currentLookAt = currentLookAt;

    var camMatrix = new THREE.Matrix4();
    camMatrix.multiplyMatrices( this.camera.projectionMatrix, this.camera.matrixWorldInverse );
    this.frustumChunks.updateScene(this.scene, camMatrix);

    // Reset the drag memory
    this.mouseCanvasDragDx = 0;
    this.mouseCanvasDragDy = 0;

};


Visualizer3D.prototype.getLandscapeNormal = function(x, y) {

    var d = 0.1;
    var h = this.randomHeight(x, y);
    var dzdx = (this.randomHeight(x + d, y) - h) / d;
    var dzdy = (this.randomHeight(x, y + d) - h) / d;

//    logit("d stuff " + dzdx + " " + dzdy);

    var result = new THREE.Vector3(-dzdx, 1, -dzdy).normalize();

    return result;
};

Visualizer3D.prototype.randomHeight = function(x, y) {
    var freq = 3;

    var landscapeChunkSize = this.landscapeChunkSize;
    var perlin = this.perlin;

    var z = 34.342352
    var n = perlin.noise(freq * x / landscapeChunkSize, freq * y / landscapeChunkSize, z);

    freq *= 2;
    z = 21.23423;
    n += 0.5 * perlin.noise(freq * x / landscapeChunkSize, freq * y / landscapeChunkSize, z);

    freq *= 2;
    z = 43.24891;
    n += 0.25 * perlin.noise(freq * x / landscapeChunkSize, freq * y / landscapeChunkSize, z);
//        var n = perlin.noise(x, y, 21.32124432);

    var result = 40 + n * 20;

    var corridorRadius = 35;
    var corridorHeight = 15;

    var corridorMaxInfulence = 0.5;
    var absY = Math.abs(y);
    if (absY < corridorRadius) {
        var mixValue = (corridorRadius - absY) / corridorRadius;
        mixValue = Math.min(mixValue, corridorMaxInfulence);
        result = mixValue * corridorHeight + (1.0 - mixValue) * result;
    }

    return result;
};


Visualizer3D.prototype.createLandscapeChunk = function(cx, cz) {

    var landscapeChunkSize = this.landscapeChunkSize;
    var landscapeChunkDivisions = this.landscapeChunkDivisions;


    var landscapeChunkParent = new THREE.Object3D();
    var landscapeGeom = new THREE.PlaneGeometry(landscapeChunkSize, landscapeChunkSize,
        landscapeChunkDivisions-1, landscapeChunkDivisions-1);
    var m2 = new THREE.Matrix4();
    m2.rotateX(-Math.PI * 0.5);

    var chunkOffsetX = cx * landscapeChunkSize;
    var chunkOffsetZ = cz * landscapeChunkSize;

    landscapeGeom.applyMatrix(m2);
    var step = landscapeChunkSize / landscapeChunkDivisions;
    for ( var i = 0, l = landscapeGeom.vertices.length; i < l; i ++ ) {
        var x = i % landscapeChunkDivisions;
        var y = ~~ ( i / landscapeChunkDivisions );
        var v = landscapeGeom.vertices[i];
        v.y = this.randomHeight(v.x + chunkOffsetX, v.z + chunkOffsetZ);
    }

    var vertices = landscapeGeom.vertices;
    for (var i=0; i<landscapeGeom.faces.length; i++) {
        var face = landscapeGeom.faces[i];
        var va = vertices[face.a];
        var vb = vertices[face.b];
        var vc = vertices[face.c];
        var vd = vertices[face.d];
        face.vertexNormals[ 0 ].copy(this.getLandscapeNormal(va.x + chunkOffsetX, va.z + chunkOffsetZ));
        face.vertexNormals[ 1 ].copy(this.getLandscapeNormal(vb.x + chunkOffsetX, vb.z + chunkOffsetZ));
        face.vertexNormals[ 2 ].copy(this.getLandscapeNormal(vc.x + chunkOffsetX, vc.z + chunkOffsetZ));
        face.vertexNormals[ 3 ].copy(this.getLandscapeNormal(vd.x + chunkOffsetX, vd.z + chunkOffsetZ));
    }


    landscapeGeom.computeFaceNormals();
//    landscapeGeom.computeVertexNormals();
    landscapeGeom.normalsNeedUpdate = true;

//    var material = this.getLandscapeMaterial(0x444444, 0x000000);
    var material = this.getLandscapeMaterial(0x444444, 0x333333);

    landscapeGeom.computeCentroids();

    var mesh = new THREE.Mesh( landscapeGeom, material );
    landscapeChunkParent.add(mesh);

    landscapeChunkParent.position.set(chunkOffsetX, 0, chunkOffsetZ)

    return landscapeChunkParent;
};


Visualizer3D.prototype.createLandscape = function() {
    this.landscapeInfos = [];


//    var landscapeParent = new THREE.Object3D();

    var minChunkIndexX = -1;
    var maxChunkIndexX = 5;
    var minChunkIndexZ = -1;
    var maxChunkIndexZ = 1;
    var chunkRad = this.landscapeChunkSize / Math.sqrt(2);

    for (var x=minChunkIndexX; x<=maxChunkIndexX; x++) {
        for (var z=minChunkIndexZ; z<=maxChunkIndexZ; z++) {
            var xIndex = x;
            var yIndex = z;
            var lsChunk = this.createLandscapeChunk(xIndex, yIndex);
            this.scene.add(lsChunk);
            this.frustumChunks.addChunk(lsChunk, {radius: chunkRad});
        }
    }
//    return landscapeParent;
};


Visualizer3D.prototype.render = function() {
    this.renderer.render(this.scene, this.camera);
};


Visualizer3D.prototype.resized = function(w, h) {
//    var w = this.canvas.width;
//    var h = this.canvas.height;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
};

Visualizer3D.prototype.addGlobalLights = function() {
    var light = new THREE.DirectionalLight(0xffffff, 0.5);
    var pos = new THREE.Vector3(0.5, 0.5, 0.5).normalize();
    light.position.copy(pos);
    this.scene.add(light);

    this.upperLight = new THREE.PointLight(0xffffff, 0, 100);
    this.middleLight = new THREE.PointLight(0xffffff, 0, 100);
    this.lowerLight = new THREE.PointLight(0xffffff, 0, 100);

    this.scene.add(this.upperLight);
    this.scene.add(this.middleLight);
    this.scene.add(this.lowerLight);
};

Visualizer3D.prototype.getNoteMaterial = function(color, emissive) {
    if (!color) {
        color = 0;
    }
    if (!emissive) {
        emissive = 0;
    }
    return new THREE.MeshPhongMaterial( { color: color, emissive: emissive, overdraw: true} );
//    return new THREE.LineBasicMaterial( { color: color, emissive: emissive, overdraw: true} );
};

Visualizer3D.prototype.getLandscapeMaterial = function(color, emissive) {
//    return new THREE.LineBasicMaterial( { color: color, emissive: emissive, overdraw: true} );
    return new THREE.MeshPhongMaterial( { color: color, emissive: emissive, overdraw: true } );
};

Visualizer3D.prototype.createNoteGeometry = function() {
    return new THREE.CubeGeometry( 1, 1, 1 );
};

Visualizer3D.prototype.getChannelPlayColors = function() {
    return {
        melody: [0xff0000, 0xff8800, 0xff8888],
        inner1: [0x00ff00, 0x88ff00, 0x88ff88],
        inner2: [0x0000ff, 0x8800ff, 0x8888ff],
        bass: [0xff0000, 0xff8800, 0xff8888],
        percussion: [0x666666]
    };
};

Visualizer3D.prototype.addRenderData = function(data, length) {
    Visualizer.prototype.addRenderData.call(this, data, length);

    this.renderChannelNames = data.renderChannelNames;

//    logit(this.renderChannelNames);

    var events = data.events;

    var parent = new THREE.Object3D();
//    parent.position.set(beatOffset * this.beatLengthScale, 0, 0);

    this.maxBeat = Math.max(this.maxBeat, length);

//    logit("setting pos to " + beatOffset * this.beatLengthScale);

    var notesDone = gatherNotesFromEvents(events);


    var channelColors = {
        melody: [0xff0000, 0xff8800, 0xff8888],
        inner1: [0x00ff00, 0x88ff00, 0x88ff88],
        inner2: [0x0000ff, 0x8800ff, 0x8888ff],
        bass: [0xff0000, 0xff8800, 0xff8888],
        percussion: [0x666666]
    };

    var channelPlayColors = this.getChannelPlayColors();


    var channelEmissiveColors = {
        melody: [0x020000, 0x020100, 0x020101],
        inner1: [0x000200, 0x010200, 0x010201],
        inner2: [0x000002, 0x010002, 0x010102],
        bass: [0x020000, 0x020100, 0x020101],
        percussion: [0x010101]
    };

    var channelZs = {
        melody: 2,
        inner1: 1,
        inner2: 0,
        bass: -1,
        percussion: -2
    };

    function getFromPrefix(data, str, def) {
        var result = def;
        for (var p in data) {
            if (str.indexOf(p) == 0) {
                result = data[p];
            }
        }
        return result;
    }

    var zSeparation = 2;

    var noteGeom = this.createNoteGeometry();

    // Prepare the collision grid. Make sure that every index has an array.
    for (var i=0; i<=length; i++) {
        this.noteCollisionGrid[i] = [];
    }

    this.allNoteDatas = [];
    for (var ch in notesDone) {
        var rawChannelIndex = parseInt(ch);
        var realChannelName = data.renderChannelNames[rawChannelIndex];

        if (realChannelName == "chordsRenderChannel") {
            continue;
        }

        var datas = notesDone[ch];
//    logit("Adding " + ch + " to scene");

        addAll(this.allNoteDatas, datas);

        var channelIndex = parseInt(realChannelName.charAt(realChannelName.length - 1)) - 1;

//        logit("real channel: " + realChannelName + " " + channelIndex);

        var color = getFromPrefix(channelColors, realChannelName, 0xffffff)[channelIndex];
        var playColor = getFromPrefix(channelPlayColors, realChannelName, 0xffffff)[channelIndex];
        var emissive = getFromPrefix(channelEmissiveColors, realChannelName, 0xffffff)[channelIndex];
        var z = zSeparation * getFromPrefix(channelZs, realChannelName, -4);

        for (var j=0; j<datas.length; j++) {
            var dat = datas[j];
            var onEvent = dat.onEvent;
            var offEvent = dat.offEvent;
            if (!offEvent) {
//            logit("Found on event without off event in final for");
                continue;
            }


            var minX = Math.floor(onEvent.t);
            var maxX = Math.ceil(offEvent.t);
            for (var xx = minX; xx <= maxX; xx++) {
                var arr = this.noteCollisionGrid[xx];
                if (!arr) {
                    arr = [];
                    this.noteCollisionGrid[xx] = arr;
                }
                arr.push(dat);
            }

            var noteDepth = 1;
            var noteHeight = 1;

            var x = onEvent.t * this.beatLengthScale;
            var y = onEvent.n;
            var w = this.beatLengthScale * (Math.max(0.05, (offEvent.t - onEvent.t - 0.1)));

            var material = this.getNoteMaterial(color, emissive);
            var mesh = new THREE.Mesh( noteGeom, material );

            dat.minX = x;
            dat.maxX = offEvent.t * this.beatLengthScale;
            dat.minY = y;
            dat.maxY = y + noteHeight;
            dat.minZ = z;
            dat.maxZ = z + noteDepth;
            dat.material = material;
            dat.normalColor = color;
            dat.playColor = playColor;
            dat.normalEmissive = emissive;
            dat.w = w;
            dat.mesh = mesh;

            mesh.position.set(x + w * 0.5, y, z);
            mesh.scale.set(w, 1, 1);

            parent.add(mesh);
        }
    }

    this.scene.add(parent);

    this.noteChunks.push(parent);

    this.render();
};

Visualizer3D.prototype.updateSectionFramework = function() {
    if (this.sectionMarkers && this.sectionMarkers.frameworkObject) {
        this.scene.remove(this.sectionMarkers.frameworkObject);
    }

    if (this.songStructureInfo && this.sectionTimes) {


        var frameworkObject = new THREE.Object3D();
        this.sectionMarkers = {
            frameworkObject: frameworkObject
        };


        function createLine(fx, fy, fz, tx, ty, tz, mat) {
            var geometry = new THREE.Geometry();
            var from = new THREE.Vector3();
            from.x = fx;
            from.z = fz;
            from.y = fy;
            var to = new THREE.Vector3();
            to.x = tx;
            to.z = tz;
            to.y = ty;
            geometry.vertices.push(from);
            geometry.vertices.push(to);

            var line = new THREE.Line( geometry, mat );
            return line;
        }


        function createText(x, y, z, text, size) {
            var fontSize = 12;
            var textMat = new THREE.ParticleCanvasMaterial( {
                color: 0xffffff,
                program: function ( context ) {
                    context.scale(1, -1);
                    context.font = fontSize + 'px Segoe UI,Arial,sans-serif';
                    context.fillText(text, 0, fontSize * 1.5);
                }
            } );

            var particle = new THREE.Particle(textMat);
            particle.position.x = x;
            particle.position.y = y;
            particle.position.z = z;
            particle.scale.x = particle.scale.y = size / fontSize;
            return particle;
        }


        var lineMat = new THREE.LineBasicMaterial( { color: 0xffff00, opacity: 0.5 } );

        var sectionTimes = arrayCopy(this.sectionTimes);
        sectionTimes.unshift(0);

        var minY = 20;
        var maxY = 105;

        var indexInfos = this.songStructureInfo.indexInfos;

        for (var i=0; i<sectionTimes.length; i++) {
            var time = sectionTimes[i];
            var x = time * this.beatLengthScale;
            frameworkObject.add(createLine(x, maxY, 0, x, maxY, 0, lineMat));
            frameworkObject.add(createLine(x, minY, 0, x, maxY, 0, lineMat));

            if (i < indexInfos.length) {
                var text = getSongPartName(i, this.songStructureInfo);
                frameworkObject.add(createText(x + 1, maxY, 0, text, 2));
            }
        }
//        console.log(this.songStructureInfo);

        this.scene.add(frameworkObject);
    }
};


Visualizer3D.prototype.resetRenderData = function() {
    Visualizer.prototype.resetRenderData.call(this);
    for (var i=0; i<this.noteChunks.length; i++) {
        var o = this.noteChunks[i];
        this.scene.remove(o);
    }

    this.noteChunks = [];
    this.noteCollisionGrid = [];
    this.currentBeatTime = 0;
    this.currentStopBeatTime = 0;

//    this.sectionMarkers = null;
//    logit(" render data is reset");
};


function CanvasVisualizer3D(canvas, options) {
    Visualizer3D.call(this, canvas, options);

    var w = canvas.width;
    var h = canvas.height;

    this.renderer = new THREE.CanvasRenderer({canvas: canvas});
    this.renderer.sortObjects = false;
    this.renderer.setSize( w, h );
    this.renderer.setClearColorHex(this.clearColor, 1);

}

CanvasVisualizer3D.prototype = new Visualizer3D();

CanvasVisualizer3D.prototype.getChannelPlayColors = function() {
    return {
        melody: [0xffffff, 0xffffff, 0xffffff],
        inner1: [0xffffff, 0xffffff, 0xffffff],
        inner2: [0xffffff, 0xffffff, 0xffffff],
        bass: [0xffffff, 0xffffff, 0xffffff],
        percussion: [0xffffff]
    };
};


CanvasVisualizer3D.prototype.createNoteGeometry = function() {
    return new THREE.PlaneGeometry( 1, 1 );
};


CanvasVisualizer3D.prototype.getLandscapeChunkDivisions = function() {
    return 8;
};


CanvasVisualizer3D.prototype.getNoteMaterial = function(color, emissive) {
    var result = new THREE.MeshBasicMaterial( { color: color, emissive: emissive, wireframe: false} );
    result.side = THREE.DoubleSide;
    return result;
};

CanvasVisualizer3D.prototype.getLandscapeMaterial = function(color, emissive) {
    return new THREE.MeshBasicMaterial( { color: color, emissive: emissive, wireframe: true } );
};


function WebGLVisualizer3D(canvas, options) {
    Visualizer3D.call(this, canvas, options);

    this.addBloom = getValueOrDefault(options, "addBloom", true);
    this.addVignette = getValueOrDefault(options, "addVignette", true);
    this.addSimulatedAA = getValueOrDefault(options, "addSimulatedAA", true);

    var w = canvas.width;
    var h = canvas.height;

    this.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: false});
    this.renderer.sortObjects = false;

    this.renderer.setSize( w, h );
    this.renderer.setClearColorHex(this.clearColor, 1);
    this.renderer.autoClear = false;

//    var renderTargetParameters = { generateMipmaps: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };

    var renderModel = new THREE.RenderPass( this.scene, this.camera );
    var effectBloom = new THREE.BloomPass(1, 25, 4.0, 512);
    var effectCopy = new THREE.ShaderPass( THREE.CopyShader );

    this.effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );

    this.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / w, 1 / h );

    var vignette = new THREE.ShaderPass(THREE.VignetteShader);
    vignette.uniforms[ 'darkness' ].value = 1.1;
    vignette.uniforms[ 'offset' ].value = 1;

    effectCopy.renderToScreen = true;

    this.composer = new THREE.EffectComposer( this.renderer );


    this.composer.addPass( renderModel );
    if (this.addBloom) {
        this.composer.addPass( effectBloom );
    }
    if (this.addSimulatedAA) {
        this.composer.addPass( this.effectFXAA );
    }
    if (this.addVignette) {
        this.composer.addPass( vignette );
    }
    this.composer.addPass( effectCopy );

}

WebGLVisualizer3D.prototype = new Visualizer3D();

WebGLVisualizer3D.prototype.render = function() {
    this.renderer.clear();
    this.composer.render();
};

WebGLVisualizer3D.prototype.resized = function(w, h) {
    Visualizer3D.prototype.resized.call(this, w, h);
    this.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / w, 1 / h );
//    this.glowcomposer.reset();
    this.composer.reset();
};








var lightServerMode = true;

window.URL = window.URL || window.webkitURL || window.mozURL || window.oURL || window.msURL;

var loaderTimeout = 10;

var allLoaded = false;

var usingWebGL = false;

var AudioPlayerConstructor = null;

if (Modernizr.webaudio) {
    AudioPlayerConstructor = WebAudioPlayer;
}

var canPlayMp3 = true;


var loggedIn = false;
var user = null;
var userInfo = null;

var globalRnd = new MersenneTwister();
var globalGenInfo = new GenInfo();

var settingsDirty = false;

var songSettingsChangedWhileRendering = false;

var audioPlayer = null;

var uidManager = new UniqueIdManager();


var songSettingsCompInfo = null;

var songSettingsDirty = false;

var asyncOperations = [];
var asyncOperationCounter = 0;


var propertyInfoProvider = new PropertyInfoProvider();


var visualizer = null;

var $playButton = null;
var $stopButton = null;
var $forwardButton = null;
var $rewindButton = null;

var $refreshButton = null;

function getMainSeed() {
    var seed = 213124;

    if (songSettings.seed) {
        var tempSeed = parseInt(songSettings.seed);

        if (isNaN(tempSeed)) {
            seed = hashCode(songSettings.seed);
        } else {
            seed = tempSeed;
        }
    }
    return seed;
}



function getSeedStringsObject(reference, genInfo) {
    var result = {};
    for (var prop in reference) {
        if (prop.indexOf("Seed") >= 0) {
            var seed = genInfo[prop];
            if (typeof(seed) != 'undefined') {
                result[prop] = "" + seed;
            } else {
                result[prop] = "";
            }
        }
    }
    return result;
}

function getSeeds(result, settings) {
    for (var prop in settings) {
        if (prop.indexOf("Seed") >= 0) {
            var seedStr = settings[prop];
            if (seedStr) {
                var seed = parseInt(seedStr);

                if (isNaN(seed)) {
                    seed = hashCode(seedStr);
                }
                if (!isNaN(seed)) {
                    result[prop] = seed;
                }
            }
        }
    }
}

function copyWithPropertyInfoProvider(result, settings, source) {
    if (!result) {
        result = {};
    }
    if (!source) {
        source = settings;
    }
    var infos = propertyInfoProvider.getGuiPropertyInfos(settings).getAsArray();
    for (var i=0; i<infos.length; i++) {
        var info = infos[i];
        var value = source[info.propertyName];
        if (!isFunction(value)) {
            result[info.propertyName] = value;
        }
    }
    return result;
}


function getGenInfo() {
    var result = {};

    getSeeds(result, songStructureSeedSettings);
    getSeeds(result, songContentSeedSettings);
    getSeeds(result, songIndicesSeedSettings);

    copyWithPropertyInfoProvider(result, songParameters);
    copyWithPropertyInfoProvider(result, songDomains);
    copyWithPropertyInfoProvider(result, songDetails);

    return result;
}



function showModalDialog(title, content, options) {
    var $dialog = $("<div title=\"" + title + "\" >" + content + "</div>");

    $("#dialogsdiv").append($dialog);

    if (!options) {
        options = {
            modal: true,
            buttons: {
                "Ok": function() {
                    $( this ).dialog( "close" );
                }
            }
        }
    }
    $dialog.dialog(options);

    return $dialog;
}

function showConfirmDialog(title, content, yesCaption, noCaption, yesCallback, noCallback) {

    var buttons = {};
    buttons[yesCaption] = function() {
        $(this).dialog("close");
        if (yesCallback) {
            yesCallback();
        }
    };
    buttons[noCaption] = function() {
        $(this).dialog("close");
        if (noCallback) {
            noCallback();
        }
    };

    var options = {
        modal: true,
        buttons: buttons
    };
    return showModalDialog(title, content, options);
}


function setSongSettingsDirty(val) {
    songSettingsDirty = val;

    if ($refreshButton) {
        $refreshButton.button("option", "disabled", !val);
    }
}

var $latestAudioElement = null;
var exportTimeout = null;
var tempTempoEvents = null;

function afterExport(op) {
    stopSong();
    updateRenderStorageAndVisualizer(op);

    if (op.$audioElement) {
        $latestAudioElement = op.$audioElement;

        function updateExportPlayer() {
            if ($latestAudioElement && $latestAudioElement[0]) {
                var time = $latestAudioElement[0].currentTime;
                if (time) {
                    var beat = predictBeat(tempTempoEvents, time);
//                    logit("predicted beat " + beat + " from " + time);
                    visualizer.setCurrentPlayBeatTime(beat);
                }
                exportTimeout = setTimeout(updateExportPlayer, 100);
            }
        }

        $latestAudioElement.on("play", function() {
            visualizer.setMode(VisualizerMode.PLAY);
            visualizer.setCurrentPlayBeatTime(0);
            updateExportPlayer();
        });
        $latestAudioElement.on("pause", function() {
            visualizer.setMode(VisualizerMode.PAUSE);
        });
        $latestAudioElement.on("stop", function() {
            visualizer.setMode(VisualizerMode.STOP);
            visualizer.setCurrentPlayBeatTime(0);
        });
    } else {
        $latestAudioElement = null;
    }
}

function joinNotEmpty(arr, str) {
    var newArr = [];
    for (var i=0; i<arr.length; i++) {
        if (arr[i]) {
            newArr.push(arr[i]);
        }
    }
    return newArr.join(str);
}

var exportSupportArr = [
    (window.ArrayBuffer ? "" : "Array Buffer"),
    (window.DataView ? "" : "Data View"),
    (window.URL ? "" : "URL object"),
    (Modernizr.webworkers ? "" : "Web Workers"),
    (Modernizr.blobconstructor ? "" : "Blob Constructor")
];

function exportMidi() {

    var clientExportSupport = Modernizr.webworkers && Modernizr.blobconstructor && window.URL && window.ArrayBuffer && window.DataView;

    if (lightServerMode && !clientExportSupport) {
        showModalDialog("Midi Export Not Supported by this browser",
            "The browser need support for " + joinNotEmpty(exportSupportArr, ", "));
    } else {
        var seed = getMainSeed();
        var genInfo = getGenInfo();
        copyWithPropertyInfoProvider(genInfo, midiExportSettings);

        delete genInfo.export2;

        var renderRequestData = {seed: seed, strSeed: songSettings.seed, name: songSettings.name, sectionIndex: -1, genInfo: genInfo};

        var params = {
            taskType: AsyncServerChildTaskType.EXPORT_MIDI,
            content: renderRequestData,
            caption: "Exporting midi...",
            doneCaption: "Done!",
            resultDivId: "midi-export-result-div",
            onSuccess: function(op) {
                afterExport(op);
            },
            id: "task" + asyncOperationCounter};

        var task = null;
        if (clientExportSupport) {
            params.taskType = WorkerTaskType.EXPORT_MIDI;
            task = new AsyncWorkerTask(params);
        } else {
            task = new AsyncServerChildTask(params);
        }
        addAsyncOperation(task);
    }

}


function exportWav() {

    var clientExportSupport = Modernizr.webworkers && Modernizr.blobconstructor && window.URL && window.ArrayBuffer && window.DataView;

    if (lightServerMode && !clientExportSupport) {
        showModalDialog("Wav Export Not Supported by this browser",
            "The browser need support for " + joinNotEmpty(exportSupportArr, ", "));
    } else {
        var seed = getMainSeed();
        var genInfo = getGenInfo();

        if (clientExportSupport) {
            copyWithPropertyInfoProvider(genInfo, wavClientExportSettings);
        } else {
            copyWithPropertyInfoProvider(genInfo, wavExportSettings);
        }

        delete genInfo.export2;

        var renderRequestData = {seed: seed, strSeed: songSettings.seed, name: songSettings.name, sectionIndex: -1, genInfo: genInfo};

        var params = {
            taskType: AsyncServerChildTaskType.EXPORT_WAV,
            content: renderRequestData,
            caption: "Exporting wav...",
            doneCaption: "Done!",
            resultDivId: "wav-export-result-div",
            onSuccess: function(op) {
                afterExport(op);
            },
            id: "task" + asyncOperationCounter};

        var task = null;
        if (clientExportSupport) {
            params.taskType = WorkerTaskType.EXPORT_WAV;
            task = new AsyncWorkerTask(params);
        } else {
            task = new AsyncServerChildTask(params);
        }
        addAsyncOperation(task);
    }

}


function exportIT() {
    showModalDialog("", "IT export not implemented.");
}

function savePreset() {
    var seed = getMainSeed();
    var genInfo = getGenInfo();
    copyWithPropertyInfoProvider(genInfo, mp3ExportSettings);

    var renderRequestData = {seed: seed, sectionIndex: -1, genInfo: genInfo};

    var task = new AsyncServerChildTask({
        taskType: AsyncServerChildTaskType.SAVE_PRESET,
        content: renderRequestData,
        caption: "Saving preset...",
        doneCaption: "Done!",
        requireLogin: false,
        resultDivId: "",
        id: "task" + asyncOperationCounter});
    addAsyncOperation(task);
}

function exportMp3() {

    if (lightServerMode) {
        showModalDialog("Mp3 Export Not Supported",
            "The server doesn't support this operation and you can not do this in the browser yet.");
    } else {
        var seed = getMainSeed();
        var genInfo = getGenInfo();
        copyWithPropertyInfoProvider(genInfo, mp3ExportSettings);

        var renderRequestData = {seed: seed, sectionIndex: -1, genInfo: genInfo};
        var curOperation = false; // getFirstRunningServerTaskWithType(AsyncServerChildTaskType.EXPORT_MP3);

        var task = new AsyncServerChildTask({
            taskType: AsyncServerChildTaskType.EXPORT_MP3,
            content: renderRequestData,
            caption: "Exporting mp3...",
            doneCaption: "Done!",
            resultDivId: "mp3-export-result-div",
            onSuccess: function(op) {
                afterExport(op);
            },
            id: "task" + asyncOperationCounter});
        addAsyncOperation(task);
    }
}

function exportOgg() {
    if (lightServerMode) {
        showModalDialog("Mp3 Export Not Supported",
            "The server doesn't support this operation and you can not do this in the browser yet.");
    } else {
        var seed = getMainSeed();
        var genInfo = getGenInfo();
        copyWithPropertyInfoProvider(genInfo, oggExportSettings);

        var renderRequestData = {seed: seed, sectionIndex: -1, genInfo: genInfo};
        var curOperation = getFirstRunningServerTaskWithType(AsyncServerChildTaskType.EXPORT_OGG);

        var task = new AsyncServerChildTask({
            taskType: AsyncServerChildTaskType.EXPORT_OGG,
            content: renderRequestData,
            caption: "Exporting ogg...",
            doneCaption: "Done!",
            resultDivId: "ogg-export-result-div",
            onSuccess: function(op) {
                afterExport(op);
            },
            id: "task" + asyncOperationCounter});
        addAsyncOperation(task);
    }
}


function updateAsyncOperations() {
    var nextOps = [];
    for (var i=0; i<asyncOperations.length; i++) {
        var op = asyncOperations[i];
        op.update();
        if (!op.done && !op.cancelled) {
            nextOps.push(op);
        }
    }
    asyncOperations = nextOps;
    if (asyncOperations.length > 0) {
        setTimeout(updateAsyncOperations, 500);
    }
}

function addAsyncOperation(op) {
    if (!op) {
        return false;
    }
    if (loggedIn || !op.requireLogin) {
        asyncOperations.push(op);
        op.start();
        updateAsyncOperations();
        asyncOperationCounter++;
        return true;
    } else {
        showModalDialog("Not logged in", "You must log in to export or compose new songs.");
        return false;
    }
}


function logit(str) {
//    console.log(printStackTrace());
    console.log(str);
}

function getFirstRunningServerTaskWithType(type) {
    for (var i=0; i<asyncOperations.length; i++) {
        var op = asyncOperations[i];
        if (op.taskType == type) {
            return op;
        }
    }
    return null;
}


function createExportPanel() {
    var tabCaptions = ["Midi", "Mp3", "Ogg", "IT"];
    var tabObjects = [midiExportSettings, mp3ExportSettings, oggExportSettings, itExportSettings];
    var tabObjectPresets = [midiExportSettingsPresets, mp3ExportSettingsPresets, oggExportSettingsPresets, itExportSettingsPresets];

    if (lightServerMode) {
        tabCaptions.length = 1;
        tabObjects.length = 1;
        tabObjectPresets.length = 1;
//        tabCaptions.push("Wav (Alpha)");
//        tabObjects.push(wavClientExportSettings);
//        tabObjectPresets.push(wavClientExportSettingsPresets);
    }
    SongSettingsComponent.createTabs($("#exportDialogDiv"), "exportTab", "export-panel", tabCaptions, tabObjects,
        function() {
            settingsDirty = true;
        }, tabObjectPresets);

    if (lightServerMode) {
        $("#exportTab0").prepend($("<div id=\"midi-export-result-div\" ></div>"));
//        $("#exportTab1").prepend($("<div id=\"wav-export-result-div\" ></div>"));
    } else {
        $("#exportTab0").prepend($("<div id=\"midi-export-result-div\" ></div>"));
        $("#exportTab1").prepend($("<div id=\"mp3-export-result-div\" ></div>"));
        $("#exportTab2").prepend($("<div id=\"ogg-export-result-div\" ></div>"));
        $("#exportTab3").prepend($("<div id=\"it-export-result-div\" ></div>"));
    }

}


function createSongInfoPanel() {
    var $songInfoDiv = $("#songInfoTabs");
    $songInfoDiv.tabs();
}

function getSongPartName(i, songStructureInfo) {

    var text = "Part";

    var indexInfo = songStructureInfo.indexInfos[i];

    var songPartType = songStructureInfo.songPartTypes[i];
    if (indexInfo.isIntro) {
        text = "Intro";
    } else if (indexInfo.isEnd) {
        text = "End";
    } else if (indexInfo.isConnectGroup) {
        text = "Connect";
        if (indexInfo.isPostfixGroup) {
            text = "Postfix";
        } else if (indexInfo.isPrefixGroup) {
            text = "Prefix";
        }
    } else {
        switch (songPartType) {
            case 0:
            case 1:
                text = "Verse " + (songPartType + 1);
                break;
            case 2:
            case 3:
                text = "Chorus " + (songPartType - 1);
                break;
            case 4:
            case 5:
                text = "Bridge " + (songPartType - 3);
                break;
            case 6:
            case 7:
                text = "Misc " + (songPartType - 5);
                break;
        }
        if (indexInfo.phraseGroupCount > 1) {
            text += ", " + (indexInfo.phraseGroupIndex + 1);
        }
    }

    return text;
}

function updateSongInfoPanel() {
    var $structureDiv = $("#songInfoTabStructure");
    var $instrumentsDiv = $("#songInfoTabInstruments");

    $instrumentsDiv.empty();
    $structureDiv.empty();


    var songStructureInfo = renderStorage.songStructureInfo;

    var rowClasses = ['evenTableRow', 'oddTableRow'];

    if (songStructureInfo) {
        var indexInfos = songStructureInfo.indexInfos;
        var htmlArr = [];
        htmlArr.push('<table class="songInfoInstrumentsTable">');
        var rowIndex = 0;

        function getPropertyTableRow(header, arr) {
            var rowClass = rowClasses[rowIndex % rowClasses.length];
            htmlArr.push('<tr class="' + rowClass + '">');
            htmlArr.push('<td>' + header + '</td>')
            for (var i=0; i<arr.length; i++) {
                var text = '' + arr[i];
                htmlArr.push('<td>' + text + '</td>');
            }
            rowIndex++;
        }

        if (indexInfos) {
//            logit(songStructureInfo);
            var rowClass = rowClasses[rowIndex % rowClasses.length];
            htmlArr.push('<tr class="' + rowClass + '">');
            htmlArr.push('<td>Type</td>')
            for (var i=0; i<indexInfos.length; i++) {
                var text = getSongPartName(i, songStructureInfo);
                htmlArr.push('<td>' + text + '</td>');
            }
            htmlArr.push('</tr>');
            rowIndex++;
            getPropertyTableRow("Harmony Rythm", songStructureInfo.harmonyRythmIndices);
            getPropertyTableRow("Harmony Char.", songStructureInfo.harmonyExtraIndices);
            getPropertyTableRow("Melody Shape", songStructureInfo.melodyShapeIndices);
            getPropertyTableRow("Bass Shape", songStructureInfo.bassShapeIndices);
            getPropertyTableRow("Melody Motif Dist.", songStructureInfo.melodyMotifDistributionIndices);
            getPropertyTableRow("Bass Motif Dist.", songStructureInfo.bassMotifDistributionIndices);
            getPropertyTableRow("Inner 1 Motif Dist.", songStructureInfo.inner1MotifDistributionIndices);
            getPropertyTableRow("Inner 2 Motif Dist.", songStructureInfo.inner2MotifDistributionIndices);
            getPropertyTableRow("Percussion Dist.", songStructureInfo.percussionMotifDistributionIndices);
            getPropertyTableRow("Percussion Fill Dist.", songStructureInfo.percussionFillMotifDistributionIndices);
            getPropertyTableRow("Melody Instr.", songStructureInfo.melodyChannelDistributionIndices);
            getPropertyTableRow("Bass Instr.", songStructureInfo.bassChannelDistributionIndices);
            getPropertyTableRow("Inner 1 Instr.", songStructureInfo.inner1ChannelDistributionIndices);
            getPropertyTableRow("Inner 2 Instr.", songStructureInfo.inner2ChannelDistributionIndices);
            getPropertyTableRow("Melody Effects", songStructureInfo.sequentialMelodyEffectChangeIndices);
            getPropertyTableRow("Bass Effects", songStructureInfo.sequentialBassEffectChangeIndices);
            getPropertyTableRow("Inner 1 Effects", songStructureInfo.sequentialInner1EffectChangeIndices);
            getPropertyTableRow("Inner 2 Effects", songStructureInfo.sequentialInner2EffectChangeIndices);
            getPropertyTableRow("Percussion Effects", songStructureInfo.sequentialPercussionEffectChangeIndices);
        }
        htmlArr.push('</table>');

        $structureDiv.append(htmlArr.join(""));
    }

    var channelMaps = renderStorage.channelMaps;
    if (channelMaps) {
        var htmlArr = [];
        htmlArr.push('<table class="songInfoInstrumentsTable">');
        for (var i=0; i<channelMaps.length-1; i++) {
            var rowClass = rowClasses[i % rowClasses.length];
            htmlArr.push('<tr class="' + rowClass + '">');
            var chMap = channelMaps[i];
            var str = MidiProgram.toString(chMap.program);
            var instrStr = "Unknown";
            switch (i) {
                case 0:
                case 1:
                case 2:
                    instrStr = "Melody instrument " + (i + 1);
                    break;
                case 3:
                case 4:
                case 5:
                    instrStr = "Inner 1 instrument " + (i + 2);
                    break;
                case 6:
                case 7:
                case 8:
                    instrStr = "Inner 2 instrument " + (i - 5);
                    break;
                case 9:
                case 10:
                case 11:
                    instrStr = "Bass instrument " + (i - 8);
                    break;
            }
            htmlArr.push('<td>' + instrStr + '</td>');
            htmlArr.push('<td>' + str + '</td>');
//            htmlArr.push(str + '<br />');
            htmlArr.push("</tr>");
        }
        htmlArr.push('</table>');
        $instrumentsDiv.append(htmlArr.join(""));
    }
}


function deleteSong(songIndex, callback) {

    showConfirmDialog("Really delete?", "Do you really want to delete the song?", "Yes", "No",
        function() {
            var deleteRequestData = {songIndex: songIndex};
            var task = new AsyncServerChildTask({
                taskType: AsyncServerChildTaskType.DELETE_SONG,
                content: deleteRequestData,
                caption: "Deleting song...",
                doneCaption: "Done!",
                resultDivId: "",
                onDone: function(op) {
                    callback();
                },
                id: "task" + asyncOperationCounter});
            addAsyncOperation(task);
        },
        function() {
        });
}

function renameSong(songIndex, newName, callback) {
    var deleteRequestData = {newName: newName, songIndex: songIndex};
    var task = new AsyncServerChildTask({
        taskType: AsyncServerChildTaskType.RENAME_SONG,
        content: deleteRequestData,
        caption: "Renaming song...",
        doneCaption: "Done!",
        resultDivId: "",
        onDone: function(op) {
            callback();
        },
        id: "task" + asyncOperationCounter});
    addAsyncOperation(task);
}

function overwriteSong(prefix, songInfo) {
    var seed = getMainSeed();
    var name = songSettings.name;
    var genInfo = getGenInfo();
    copyWithPropertyInfoProvider(genInfo, mp3ExportSettings);

    var owRequestData = {seed: seed, songName: name, prefix: songInfo.prefix, genInfo: genInfo};

    var task = new AsyncServerChildTask({
        taskType: AsyncServerChildTaskType.OVERWRITE_SONG,
        content: owRequestData,
        caption: "Overwriting song...",
        doneCaption: "Done!",
        resultDivId: "",
        onDone: function() {
            loadMySongsList();
        },
        id: "task" + asyncOperationCounter});
    if (!addAsyncOperation(task)) {
        logit("Failed to add async op for overwrite song?");
    }

}

function completeGenInfo(genInfo) {
    var refGenInfo = new GenInfo();
    for (var prop in refGenInfo) {
        if (!stringEndsWith(prop, "Seed")) {
            var refValue = refGenInfo[prop];
            var value = genInfo[prop];
            if (!isFunction(refValue) && typeof(value) === 'undefined') {
                genInfo[prop] = copyValueDeep(refValue);
//                logit("Completing gen info " + prop + ": " + refValue);
            }
        }
    }
}


function updateSongSettingsComponent(genInfo, newSongSettings) {

    var tabsId = "songSettingsTab";

    completeGenInfo(genInfo);
    var newValues = [
        newSongSettings,
        getSeedStringsObject(songStructureSeedSettings, genInfo),
        getSeedStringsObject(songContentSeedSettings, genInfo),
        getSeedStringsObject(songIndicesSeedSettings, genInfo),
        copyWithPropertyInfoProvider(null, songParameters, genInfo),
        copyWithPropertyInfoProvider(null, songDomains, genInfo),
        copyWithPropertyInfoProvider(null, songDetails, genInfo)
    ];

    for (var i=0; i<newValues.length; i++) {
        SongSettingsComponent.changeComponentValue(newValues[i], songSettingsCompInfo.createdComps, i, tabsId, songSettingsCompInfo.changeListener);
    }

}

function loadSong(prefix, songInfo, force) {

    function loadTheSongNow() {

        var dataFilename = prefix + "/" + songInfo.prefix + ".json";

        $.ajax(dataFilename, {
            complete: function(jqXhr, textStatus) {
                if (textStatus == "success") {
                    var response = $.parseJSON(jqXhr.responseText);
                    if (response) {
//                            logit(response);
                        var genInfo = response.genInfo;
                        var newSongSettings = {name: songInfo.name || "Song", seed: "" + response.seed};
                        // Copy all those properties that are missing from the default GenInfo
                        // This happens when new properties are added and loading an old song

                        updateSongSettingsComponent(genInfo, newSongSettings);
                        if (response.channelMaps && response.renderData) {
                            // Presets
                            stopSong();
                            renderStorage.channelMaps = response.channelMaps;
                            renderStorage.renderData = response.renderData;
                            renderStorage.renderDataLength = Math.max(1, response.renderDataLength);
                            renderStorage.dirty = true;
                            settingsDirty = true;
                            visualizer.resetRenderData();
                            visualizer.addRenderData(renderStorage.renderData, renderStorage.renderDataLength);
                            setSongSettingsDirty(false);
                        } else {
                            settingsDirty = true;
                            setSongSettingsDirty(false);
                            if (loggedIn) {
                                renderSong(function() {
                                    stopSong();
                                });
                            }
                        }

                    }
                } else {
                    console.log("Failed to load song: " + dataFilename);
                }
            },
            type: 'GET'
        });
    }

    if (songSettingsDirty && loggedIn && !force) {
        showConfirmDialog("Load?", "Really load the song? This will overwrite the current song settings", "Yes", "No",
            function() {
                loadTheSongNow();
            },
            function() {
            });
    } else {
        loadTheSongNow();
    }
}

function loadPresetSong(songInfo, force) {
    loadSong("songpresets", songInfo, force);
}


function getUserInfo(onSuccess, onFail, onDone) {
    if (lightServerMode) {

    } else {
        $.ajax("task", {
            data: JSON.stringify({type: "getUserInfo"}),
            contentType: "application/json",
            complete: function(jqXhr, textStatus) {
                if (textStatus == "success") {
                    var response = $.parseJSON(jqXhr.responseText);
                    if (onSuccess) {
                        onSuccess(response);
                    }
                } else {
                    if (onFail) {
                        onFail(jqXhr, textStatus);
                    }
                }
                if (onDone) {
                    onDone(jqXhr, textStatus);
                }
            },
            type: "POST"
        });
    }
}

function loadMySongsList() {

    if (lightServerMode) {

    } else {
        $('#my-songs-song-list').remove();

        var urlPrefix = "users/" + userToDirName(user);
        var indexUrl = urlPrefix + "/index.json";

        var $mySongsDiv = $("#my-songs-tab");

        getUserInfo(
            function(response) {
                if (response && response.songs) { // onSuccess
                    createSongList(response, $mySongsDiv, urlPrefix, "my-songs", "Song", true, true, true);
                } else {
                    console.log("Did not get a valid UserInfo from server.");
                }
            },
            function(jqXhr, textStatus) { // onFail
                console.log("Did not get an answer for getUserInfo from server. Text status not success: " + textStatus);
            });
    }

}


function createLoadButton(buttonId, songInfo, $targetDiv, urlPrefix) {
    var $loadButton = $targetDiv.find("#" + buttonId);
    $loadButton.button();
    $loadButton.click(function() {
        loadSong(urlPrefix, songInfo);
    });
}
function createOverwriteButton(buttonId, songInfo, $targetDiv, urlPrefix) {
    var $owButton = $targetDiv.find("#" + buttonId);
    $owButton.button();
    $owButton.click(function() {
        overwriteSong(urlPrefix, songInfo);
    });
}
function createDeleteButton(buttonId, songInfos, songInfoIndex, $targetDiv, urlPrefix) {
    var $button = $targetDiv.find("#" + buttonId);
    $button.button();
    $button.click(function() {
        deleteSong(songInfoIndex, function() {
            loadMySongsList();
        });
    });
}
function createRenameButton(buttonId, songInfos, songInfoIndex, $targetDiv, urlPrefix) {
    var $button = $targetDiv.find("#" + buttonId);
    $button.button();
    $button.click(function() {
    });
}

function createSongList(info, $targetDiv, urlPrefix, idPrefix, namePrefix, createLoad, createDelete, createRename) {
    var songs = info.songs;
    var content = "";
    content += '<ol id="' + idPrefix + '-song-list" class="song-list" >';

    var linkStyle = "margin-right: 0.5em;";
    for (var i=0; i<songs.length; i++) {
        var songInfo = songs[i];

        var songName = songInfo.name;
        if (!songName) {
            songName = namePrefix + " " + (i + 1);
        }

        var tableContent = "<tr><td>" + songName + "</td>";

        var columns = 1;
        var columnCounter = 1;
        if (songInfo.soundfonts && songInfo.soundfonts.length > 0) {
            var defaultSfIndex = songInfo.soundfonts[0];
            var prefix = urlPrefix + "/" + songInfo.prefix;
            var midiFilename = prefix + ".mid";
            var mp3Filename = prefix + "_" + defaultSfIndex + ".mp3";
            var oggFilename = prefix + "_" + defaultSfIndex + ".ogg";

            tableContent += '<td><a style="' + linkStyle + '" href="' + midiFilename + '" >Midi</a>';
            tableContent += '<a style="' + linkStyle + '" href="' + mp3Filename + '" >Mp3</a>';
            tableContent += '<a style="' + linkStyle + '" href="' + oggFilename + '" >Ogg</a></td>';
            columnCounter += 1;
        }

        tableContent += "<td>";
        columnCounter += 1;
        if (createDelete) {
            var deleteButtonId = idPrefix + "-delete-song-button-" + i;
            tableContent += '<button id="' + deleteButtonId + '" >Delete</button>';
        }
//        if (createOverwrite) {
//            var owButtonId = idPrefix + "-overwrite-song-button-" + i;
//            liContent += '<button id="' + owButtonId + '" >Overwrite</button>';
//        }
        if (createRename) {
            var renameButtonId = idPrefix + "-rename-song-button-" + i;
            tableContent += '<button id="' + renameButtonId + '" >Rename</button>';
        }
        if (createLoad) {
            var loadButtonId = idPrefix + "-load-song-button-" + i;
            tableContent += '<button id="' + loadButtonId + '" >Load</button>';
        }
        tableContent += "</td>";

        tableContent += "</tr>";

        columns = columnCounter;
        columnCounter = 0;
//        if (songInfo.soundfonts && songInfo.soundfonts.length > 0) {
//            tableContent += "<tr>";
//            tableContent += "<td>Variants Mp3</td>";
//            columnCounter += 1;
//            tableContent += "<td>";
//            columnCounter += 1;
//            for (var j=1; j<songInfo.soundfonts.length; j++) {
//                var sfIndex = songInfo.soundfonts[j];
//                var sfName = SoundFontType.toShortString(sfIndex);
//                var mp3Filename = prefix + "_" + sfIndex + ".mp3";
//                tableContent += '<a style="' + linkStyle + '" href="' + mp3Filename + '" >' + sfName + '</a>';
//            }
//            tableContent += "</td>";
//            tableContent += "</tr>";
//
//            columns = Math.max(columns, columnCounter);
//            columnCounter = 0;
//
//            tableContent += "<tr>";
//            tableContent += "<td>Variants Ogg</td>";
//            columnCounter += 1;
//            tableContent += "<td>";
//            columnCounter += 1;
//            for (var j=1; j<songInfo.soundfonts.length; j++) {
//                var sfIndex = songInfo.soundfonts[j];
//                var sfName = SoundFontType.toShortString(sfIndex);
//                var oggFilename = prefix + "_" + sfIndex + ".ogg";
//                tableContent += '<a style="' + linkStyle + '" href="' + oggFilename + '" >' + sfName + '</a>';
//                columnCounter += 1;
//            }
//            tableContent += "</td>";
//            tableContent += "</tr>";
//            columns = Math.max(columns, columnCounter);
//        }

        content += '<table style="margin: 0px; padding: 0px; border: 0px; width: 100%" class="ui-widget-content" >';
        content += '<colgroup>';
        var colWidth = 100 / columns;
        for (var j=0; j<columns; j++) {
            content += '<col span="1" style="width: ' + Math.round(colWidth) + '%;">';
        }
        content += "</colgroup>";
        content += tableContent;
        content += "</table>";
    }
    content += "</ol>";
    var $list = $(content);
//        $list.selectable();

    $targetDiv.append($list);

    for (var i=0; i<songs.length; i++) {
        var songInfo = songs[i];
        if (createLoad) {
            var buttonId = idPrefix + "-load-song-button-" + i;
            createLoadButton(buttonId, songInfo, $targetDiv, urlPrefix);
        }
//        if (createOverwrite) {
//            var buttonId = idPrefix + "-overwrite-song-button-" + i;
//            createOverwriteButton(buttonId, songInfo, $targetDiv, urlPrefix);
//        }
        if (createDelete) {
            var buttonId = idPrefix + "-delete-song-button-" + i;
            createDeleteButton(buttonId, songs, i, $targetDiv, urlPrefix);
        }
        if (createRename) {
            var buttonId = idPrefix + "-rename-song-button-" + i;
            createRenameButton(buttonId, songs, i, $targetDiv, urlPrefix);
        }
    }
}


function createSongsPanel() {
    if (loggedIn && user) {
        $("#songtabs ul").append($('<li><a href="#my-songs-tab">My Songs</a></li>'));

        var mySongsContent = "";

        mySongsContent += '<button id="save-song-button">Save Current Song</button>';

        $("#songtabs").append($('<div id="my-songs-tab" >' + mySongsContent + '</div> '));;
    }



    $("#save-song-button").button().click(function() {
        var seed = getMainSeed();
        var name = songSettings.name;
        var genInfo = getGenInfo();
        copyWithPropertyInfoProvider(genInfo, mp3ExportSettings);

        var saveRequestData = {seed: seed, songName: name, genInfo: genInfo};

        var task = new AsyncServerChildTask({
            taskType: AsyncServerChildTaskType.SAVE_SONG,
            content: saveRequestData,
            caption: "Saving song...",
            doneCaption: "Done!",
            resultDivId: "",
            onDone: function() {
                loadMySongsList();
            },
            id: "task" + asyncOperationCounter});
        if (!addAsyncOperation(task)) {
            logit("Failed to add async op for saving song?");
        }

    });

    $("#songtabs").tabs();

    var $examplesDiv = $("#example-songs-tab");



    // Loading presets
    $.ajax("songpresets/index.json", {
//        contentType: "application/json",
        complete: function(jqXhr, textStatus) {
            if (textStatus == "success") {
                var response = $.parseJSON(jqXhr.responseText);
                if (response) {
                    createSongList(response, $examplesDiv, "songpresets", "preset", "Song Example", true, false, false);
                    var songs = response.songs;
                    if (!renderStorage.renderData && songs.length > 0) {
                        loadPresetSong(songs[0], true);
                    }
                }
//                logit(response);
            } else {
                console.log("Failed to get preset songs: " + textStatus);
            }
        },
        type: 'GET'
    });


    // Loading my songs
    if (loggedIn && user) {
        loadMySongsList();
    }

}

function UserInfo() {
    this.name = "";
    this.email = "";
    this.subscribe = false;
    this.acceptedTOU = false;
    this._constructorName = "UserInfo";
}

function sendSimpleCommand(data) {
    $.ajax("task", {
        data: JSON.stringify(data),
        contentType: "application/json",
        complete: function(jqXhr, textStatus) {
            if (textStatus == "success") {

            } else {
                logit("Failed to send simple command:");
                logit(data);
            }
        },
        type: "POST"
    });

}

function updateUserInfo(showDialog) {
//    logit("Updating user info...");
//    logit(userInfo);

    if ($updateUserInfoButton) {
        $updateUserInfoButton.button("disable");
    }

    sendSimpleCommand({type: "updateUserInfo", name: userInfo.name, email: userInfo.email, subscribe: userInfo.subscribe, acceptedTOU: userInfo.acceptedTOU});
    if (showDialog) {
        showModalDialog("User info updated", "<p>Your personal information will only be used for support, unless you subscribe to the newsletter.</p>");
    }
}

var $updateUserInfoButton = null;

function createAccountPanel() {

    if (lightServerMode) {

    } else {
        loggedIn = false;
        var userInfoComp = null;
        getUserInfo(
            function(response) { // onSuccess
                if (response._constructorName == "UserInfo") {
                    loggedIn = true;
                    userInfo = response;
//                logit(userInfo);
                    if (typeof(userInfo.name) == 'undefined') {
                        userInfo.name = "";
                    }
                    if (typeof(userInfo.email) == 'undefined') {
                        userInfo.email = "";
                    }
                    if (typeof(userInfo.subscribe) == 'undefined') {
                        userInfo.subscribe = false;
                    }
                    if (typeof(userInfo.acceptedTOU) == 'undefined') {
                        userInfo.acceptedTOU = false;
                    }
                    function showTOUWhenLoaded() {
                        if (allLoaded) {
                            showAcceptTermsOfUseIfNecessary();
                        } else {
                            setTimeout(showTOUWhenLoaded, 100);
                        }
                    }
                    showTOUWhenLoaded();
                } else {
                    console.log(response);
                }
            },
            function(jqXhr, textStatus) { // onFail
                console.log("Failed to get user info in account panel " + textStatus);
            },
            function() { // onDone
                var html = "<p></p>";
                if (loggedIn) {
                    html =
                        '<form action="logout" method="get" id="logout_form">' +
                            '<fieldset>' +
                            '<div id="logout_input_area">' +
                            '<input id="openid_submit" type="submit" value="Log Out"/>' +
                            '</div>' +
                            '</fieldset>' +
                            '</form>';
//                html += userInfo.name + " " + userInfo.email;

                    var userInfoComp = new GuiPropertiesComponent({object: userInfo, propertyInfoProvider: propertyInfoProvider});
                    userInfoComp.changeListeners.push(function() {
                        if ($updateUserInfoButton) {
                            $updateUserInfoButton.button("enable");
                        }
                    });

                    var contentArr = [];
                    userInfoComp.createJQueryStrings(contentArr);
                    html += contentArr.join("");

                    html += '<button id="updateUserInfoButton" >Submit personal info</button>';

                } else {
                    html =
                        '<form action="auth" method="get" id="openid_form">' +
                            '<input type="hidden" name="action" value="verify" />' +
                            '<fieldset>' +
                            '<legend>Sign-in or Create New Account</legend>' +
                            '<div id="openid_choice">' +
                            '<p>Please click your account provider:</p>' +
                            '<div id="openid_btns"></div>' +
                            '</div>' +
                            '<div id="openid_input_area">' +
                            '<input id="openid_identifier" name="openid_identifier" type="text" value="http://" />' +
                            '<input id="openid_submit" type="submit" value="Sign-In"/>' +
                            '</div>' +
                            '<noscript>' +
                            '<p>OpenID is service that allows you to log-on to many different websites using a single identity.' +
                            'Find out <a href="http://openid.net/what/">more about OpenID</a> and <a href="http://openid.net/get/">how to get an OpenID enabled account</a>.</p>' +
                            '</noscript>' +
                            '</fieldset>' +
                            '</form>';
                }

                html += '<p><button id="touButton" >Terms of use</button></p>';

                var $html = $(html);


                var $div = $("#accountDialogDiv");
                $div.append($html);

                $updateUserInfoButton = $("#updateUserInfoButton");
                $updateUserInfoButton.button().click(function() {
                    updateUserInfo(true);
                });
                $updateUserInfoButton.button("disable");

                $touButton = $("#touButton");
                $touButton.button().click(function() {
                    showTermsOfUse();
                });

                openid.init('openid_identifier');

                $div.find("#openid_submit").button();
                //    openid.setDemoMode(true);

                if (userInfoComp) {
                    userInfoComp.jQueryCreated($div);
                    userInfoComp.alignComponents();
                }

            }
        );

    }

}

function createTutorialsPanel() {

    var $tutorialTabs = $("#tutorialtabs");

    var arr = ['<ul>'];


    arr.push('<li><a href="tutorials/info.html">Info</a></li>');

    for (var i=1; i<=5; i++) {
        arr.push('<li><a href="tutorials/tutorial_' + i + '.html">Tutorial ' + i + '</a></li>');
    }
//    <li><a href="tutorials/tutorial_1.html">Tutorial 1</a></li>

    arr.push('</ul>');

    $tutorialTabs.append($(arr.join("")));

    $tutorialTabs.tabs();


}

function createPlayerPanel() {

    var $playerDialog = $("#playerDialogDiv");

    if (AudioPlayerConstructor) {
        var prefixes = ["wa"];

        var playerButtons = ["rewind", "play", "stop", "forward"];
        var playerButtonIcons = ["seek-prev", "play", "stop", "seek-next"];
        for (var j=0; j<prefixes.length; j++) {
            var prefix = prefixes[j];
            for (var i=0; i<playerButtons.length; i++) {
                var $button = $("#" + prefix + playerButtons[i] + "button");

                var icon = playerButtonIcons[i];
                $button.button({
                    "text": false,
                    "icons": {
                        primary: "ui-icon-" + icon
                    }
                });
            }
        }


        var $webAudioPlayerDiv = $("#waPlayerDiv");

        var tabCaptions = [AudioPlayerConstructor.prototype.title];
        var tabObjects = [webAudioPlayerSettings];

        var tabObjectPresets = null; // [visualizer3DSettingsPresets];

        var result = SongSettingsComponent.createTabs($playerDialog, "playerSettingsTab", "player-settings-panel", tabCaptions, tabObjects,
            function(comp, oldValue, newValue) {
                settingsDirty = true;
            }, tabObjectPresets);

        $webAudioPlayerDiv.detach();
        $("#playerSettingsTab0").prepend($webAudioPlayerDiv);

        return result;
    } else {
        $playerDialog.remove();
        return null;
    }
}


function createVisualizerSettingsPanel() {
    var tabCaptions = ["Visualizer", "Interface"];
    var tabObjects = [visualizer3DSettings, themeSettings];
    var tabObjectPresets = null; // [visualizer3DSettingsPresets, themeSettingsPresets];

    var id = "visualizerSettingsTab";
    var cls = "visualizer-settings-panel";
    SongSettingsComponent.createTabs($("#visualizerSettingsDialogDiv"), id, cls, tabCaptions, tabObjects,
        function(comp, oldValue, newValue) {
            settingsDirty = true;
        }, tabObjectPresets);

}


function createSongSettingsPanel() {
    var $songSettingsDialog = $("#songSettingsDialogDiv");
    var tabCaptions = ["Song", "Structure Seeds", "Content Seeds", "Indices Seeds", "Parameters", "Domains", "Details"];
    var tabObjects = [songSettings, songStructureSeedSettings, songContentSeedSettings, songIndicesSeedSettings, songParameters, songDomains, songDetails];
    var tabObjectPresets = [songSettingsPresets, songStructureSeedSettingsPresets, songContentSeedSettingsPresets, songIndicesSeedSettingsPresets, songParametersPresets, songDomainsPresets, songDetailsPresets];
    var createSeeds = [false, true, true, true, false, false, false];
    var tabsId = "songSettingsTab";
    return SongSettingsComponent.createTabs($songSettingsDialog, tabsId, "settings-panel", tabCaptions, tabObjects,
        function(comp, oldValue, newValue) {
            settingsDirty = true;
            setSongSettingsDirty(true);
            if (getFirstRunningServerTaskWithType(AsyncServerChildTaskType.RENDER)) {
                songSettingsChangedWhileRendering = true;
            }
        }, tabObjectPresets, createSeeds);
}



function updateGuiFromEditorSettings(dialogs) {
    // Hide the dialogs that should be hidden :)
    for (var i=0; i<dialogs.length; i++) {
        var dialog = dialogs[i];
        var $dialog = $("#" + dialog + "DialogDiv");
        var pos = editorSettings[dialog + "Position"];
        if (pos) {
            $dialog.dialog("option", "position", {my: "left top", at: "left+" + pos[0] + " top+" + pos[1]});
//            console.log("left : " + left);
        } else {
            logit("Could not find pos for " + dialog);
        }
        var visible = !!editorSettings[dialog + "Visible"];
        if (!visible) {
            $dialog.dialog("close");
        }
    }
}


function createDialogAndToggle(dialog, caption, width, at) {

    var $buttonsDiv = $("#buttonsDiv");

    $buttonsDiv.append($('<input type="checkbox" checked="checked" id="' + dialog + 'DialogShow"/><label class="toggle-button" for="' + dialog + 'DialogShow">' + caption + '</label>'));

    var $toggle = $("#" + dialog + "DialogShow");
    var $dialog = $("#" + dialog + "DialogDiv");

    $dialog.dialog({
//        dialogClass: "transparent",
        closeText: "hide",
        width: width,
        resizable: false,
        show: {effect: "fade", duration: "fast"},

        create: function(event, ui) {
            var widget = $(this).dialog("widget");
            $(".ui-dialog-titlebar-close span", widget)
                .removeClass("ui-icon-closethick")
                .addClass("ui-icon-minusthick");
        },
        dragStop: function(event, ui) {
            editorSettings[dialog + "Position"] = [ui.position.left, ui.position.top];
            settingsDirty = true;
            editorSettings.dirty = true;
//            logit(JSON.stringify(ui));
//            if (pos) {
//                $dialog.dialog("option", "position", {my: "left top", at: "left+" + pos[0] + " top+" + pos[1]});
//            }
//                logit("hej");
        }
//        hide: {effect: "fade", duration: 20}
    });


    $dialog.dialog("option", "position", {my: "center", at: at});

//    $dialog.on("dragstop", function(event, ui) {logit("hej")});


    var $dialogWidget = $dialog.dialog("widget");
    if (themeSettings.transparentDialogs) {
        $dialogWidget.addClass("transparent");
        $dialog.addClass("very-transparent");
    }

    function makeFullyVisible() {
        if (visualizer && !visualizer.mouseCanvasDown) {
            $dialogWidget.removeClass("transparent");
            $dialog.removeClass("very-transparent");
            $dialog.removeClass("transparent");
        }
    }

    $dialogWidget.on("mousedown", function() {
        makeFullyVisible();
        $dialog.dialog("moveToTop");
        $dialog.data("dragging", true);
    });

    $dialogWidget.on("mouseup", function() {
        makeFullyVisible();
        $dialog.data("dragging", false);
    });

    $dialogWidget.on("mouseenter", function() {
        if (visualizer && !visualizer.mouseCanvasDown) {
            makeFullyVisible();
//            $dialog.removeClass("very-transparent");
        }
    });
    $dialogWidget.on("mouseleave", function() {
        if (themeSettings.transparentDialogs && !$dialog.data("dragging")) {
            $dialogWidget.addClass("transparent");
            $dialog.addClass("very-transparent");
            $dialog.removeClass("transparent");
        }
    });

    $dialog.on("dialogclose", function() {
//            console.log("Closing...");
        $toggle[0].checked = false;
        $toggle.button("refresh");
        editorSettings[dialog + "Visible"] = false;
        editorSettings.dirty = true;
        settingsDirty = true;
//        $dialogWidget.addClass("transparent");
//        logit("Closing " + dialog);
    });
//    $dialogsDiv.css("opacity", "0.5");
//    $dialog.css("opacity", "0.5");

    $dialog.css("max-height", "35em");
//    $dialog.css("opacity", "0.5");
//        $dialog.css("min-height", "500px");
//        $dialog.dialog("option", "maxHeight", 500);
//        $dialog.dialog("option", "minHeight", 400);
    $dialog.on("dialogopen", function() {
//                   console.log("Opening...");
        editorSettings[dialog + "Visible"] = true;
        editorSettings.dirty = true;
        settingsDirty = true;
//        logit("Opening " + dialog);
    });
    $toggle.button().on("change", function() {
        var dialogOpen = $dialog.dialog("isOpen");
        if (this.checked && !dialogOpen) {
            $dialog.dialog("open");
        } else if (!this.checked && dialogOpen) {
            $dialog.dialog("close");
        }
    });
}

function stopSong() {
    if (audioPlayer) {
        audioPlayer.stop();
    }
    visualizer.clearHighlightNotes();
    visualizer.setMode(VisualizerMode.STOP);
    if (audioPlayer) {
        visualizer.setCurrentPlayBeatTime(audioPlayer.songPlayBeatTime);
    }
    $playButton.button( "option", "icons", {primary: "ui-icon-play"});
}

//function foo() {
//    logit("Logged in cookie: " + $.cookie('loggedin'));
//}

var termsOfUseContent = [
    '<p>',
    '<ul>',
    '<li>All songs that are generated through this site (abundant-music.com) are public domain by default. Users do not get copyright of any generated song' +
        ', but since the songs are public domain, they can be used commercially.</li>',
    '<li>The user is responsible that the generated songs or their use do not infringe any other copyrights. ' +
        'In such cases, the generated songs are not public domain.</li>',
    '<li>It is not allowed to use this site as an API. It is only allowed to use through abundant-music.com\'s graphical user interface. ' +
        'It is not allowed to use the site in parallel from several computers with same login.</li>',
    '<li>The site uses cookies, which are small files stored on the user\'s computer. ' +
        'The cookies on the site are only used to determine whether users are logged in or not.</li>',
//            '<li></li>',
    '</ul>',
    '<p>',
    '<p>Note that these terms of use may change.</p>'];

function showTermsOfUse() {
    showModalDialog("Terms of Use", termsOfUseContent.join(""),
        {
            resizable: false,
            draggable: false,
            width: '40em',
            modal: true,
            closeOnEscape: false,
            buttons: {
                "OK": function() {
                    $(this).dialog("close");
                }
            }
        });
}

function showAcceptTermsOfUseIfNecessary() {
    // Show the terms of use if not accepted
    if (userInfo && !userInfo.acceptedTOU) {
        showModalDialog("Terms of Use", termsOfUseContent.join(""),
            {
                resizable: false,
                draggable: false,
                beforeClose: function() {
                    if (!userInfo.acceptedTOU) {
                        return false;
                    }
                },
                width: '40em',
                modal: true,
                closeOnEscape: false,
                buttons: {
                    "I Accept": function() {
                        userInfo.acceptedTOU = true;
                        updateUserInfo(false);
                        $(this).dialog("close");
                    },
                    "Logout": function() {
                        window.location.href = "logout";
                    }
                }
            });
    }
}

function updateRenderStorageAndVisualizer(op) {
    renderStorage.channelMaps = op.resultChannelMaps;
    renderStorage.channelMaps = op.resultChannelMaps;
    renderStorage.renderData = op.resultRenderData;
    renderStorage.sectionTimes = op.resultSectionTimes;
    renderStorage.songStructureInfo = op.resultSongStructureInfo;
    renderStorage.renderDataLength = Math.max(1, op.resultRenderDataLength);
    renderStorage.dirty = true;
    settingsDirty = true;

    tempTempoEvents = copyValueDeep(gatherEventsWithType(renderStorage.renderData.events, "t"));
    visualizer.resetRenderData();
    visualizer.addRenderData(renderStorage.renderData, renderStorage.renderDataLength);

    visualizer.setSectionInfos(op.resultSectionTimes, op.resultSongStructureInfo);

    updateSongInfoPanel();

    if (!songSettingsChangedWhileRendering) {
        setSongSettingsDirty(false);
    }
}


function renderSong(doneFunc, cancelFunc, failFunc) {

    if (lightServerMode && !window.Worker) {
        showModalDialog("Not Supported",
            "The server doesn't support this operation and you need a browser with WebWorker support to do this in the client.");
    } else {

        songSettingsChangedWhileRendering = false;

        var seed = getMainSeed();
        var renderRequestData = {seed: seed, sectionIndex: -1, genInfo: getGenInfo()};

//    logit("Rendeirng with seed " + seed);

        var params = {
            taskType: WorkerTaskType.RENDER,
            content: renderRequestData,
            caption: "Composing song...",
            doneCaption: "Done!",
            onSuccess: function(op) {

//            logit("Rendered song success!");
                updateRenderStorageAndVisualizer(op);
                if (doneFunc) {
                    doneFunc();
                }
            },
            onCancel: function(op) {
                if (cancelFunc) {
                    cancelFunc();
                }
            },
            onFail: function(op) {
                if (failFunc) {
                    failFunc();
                }
            },
            id: "task" + asyncOperationCounter};

        var task = null;
        if (window.Worker) {
            task = new AsyncWorkerTask(params);
        } else {
            if (lightServerMode) {
                showModalDialog("No Web Worker Support Detected",
                    "This browser doesn't support web workers, which is necessary when Abundant Music runs on a lightweight server");
            } else {
                params.taskType = AsyncServerChildTaskType.RENDER;
                task = new AsyncServerChildTask(params);
            }
        }

        if (!addAsyncOperation(task)) {
            if (failFunc) {
                failFunc();
            }
        }
    }
}

var first = true;
function setVisualizerSize() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    if (!w || !h) {
        var $document = $(document);
        w = $document.innerWidth();
        h = $document.innerWidth();
    }
    if (first) {
        $body = $("body");
        var scaler = clamp(Math.min(w, h) / 1000, 0.5, 2);
        var fontSize = 16 * scaler;
        $body.css("font-size", fontSize + "px");
        first = false;
    }

    visualizer.resized(w, h);
}

function sendFeedback() {

    var feedbackStr = $("#feedbackTextArea").val();

    if (feedbackStr) {
        sendSimpleCommand({type: "giveFeedback", feedback: feedbackStr});
        showModalDialog("Feedback sent", "<p>Thanks a lot!</p>");
    } else {
        showModalDialog("Feedback info", "<p>Feedback text empty?</p>");
    }
}


function composeSetup1() {

    // Check if we are logged in
    loggedIn = $.cookie('loggedin') == "true";
    user = decodeURIComponent($.cookie('loggedinuser'));

//    logit("user dir name: " + userToDirName(user) + " from " + user);

    var $window = $(window);
    var $canvasfor2dcontext = $("#canvasfor2dcontext");

    var canvasfor2dcontext = $canvasfor2dcontext[0];

    var startTime = Date.now();

    if (Modernizr.webgl && !visualizer3DSettings.forceContext2D) {
//        visualizer = new CanvasVisualizer3D(canvasfor2dcontext, startTime);
        var webGLOptions = {
            addBloom: visualizer3DSettings.addBloom,
            addSimulatedAA: visualizer3DSettings.addSimulatedAA,
            addVignette: visualizer3DSettings.addVignette
        };
        try {
            visualizer = new WebGLVisualizer3D(canvasfor2dcontext, webGLOptions);
            usingWebGL = true;
        } catch (exc) {
            console.log(exc);
            console.log("Error when initializing webgl. Using 2D context.");
            visualizer = new CanvasVisualizer3D(canvasfor2dcontext, startTime);
            visualizer3DSettings.forceContext2D = true;
        }
    } else {
        visualizer = new CanvasVisualizer3D(canvasfor2dcontext, startTime);
    }
//    visualizer.render();


    $window.on("resize", function() {
        setVisualizerSize();
        visualizer.render();
    });

    setVisualizerSize();

    setTimeout(composeSetup2, loaderTimeout);

    updateLoaderProgress(70);
}

function composeSetup2() {
    songSettingsCompInfo = createSongSettingsPanel();
    setTimeout(composeSetup3, loaderTimeout);
    updateLoaderProgress(80);
}

function composeSetup3() {

    createVisualizerSettingsPanel();
    createExportPanel();
    createSongInfoPanel();
    createPlayerPanel();
    createAccountPanel();
    createTutorialsPanel();

    $("#helpTabs").tabs();

    createSongsPanel();

    setTimeout(composeSetup4, loaderTimeout);

    updateLoaderProgress(90);
}


function composeSetup4() {
    var $feedbackDialogDiv = $("#feedbackDialogDiv");
    if (!loggedIn) {
        $feedbackDialogDiv.empty();
        $feedbackDialogDiv.append("Log in to enable feedback. Thanks!");
    } else {
        $feedbackDialogDiv.find("#submitFeedbackButton").button().click(function() {
            sendFeedback();
            $feedbackDialogDiv.find("#feedbackTextArea").val("");
        });
    }

    var dialogs = ["songSettings", "songInfo", "player", "visualizerSettings", "tutorials", "songs", "export", "help", "feedback", "account"];
    var captions = ["Song Settings" , "Song Info", "Player", "Visual Settings", "Tutorials", "Songs", "Export", "Help/Credits", "Feedback", "Account"];
    var widths = ["60em", "60em", Modernizr.webaudio ? "45em" : null, "45em", "55em", "45em", "45em", "50em", lightServerMode ? null : "45em", lightServerMode ? null : "40em"];
    var ats = ["right", "right top", "right", "top", "left", "top", "top", "left", "left", "left"];

    for (var i=0; i<dialogs.length; i++) {

        var dialog = dialogs[i];
        var width = widths[i];
        var caption = captions[i];
        if (width) {
            createDialogAndToggle(dialog, caption, width, ats[i]);
        } else {
            // Remove toggle
            var $dialog = $("#" + dialog + "DialogDiv");
            $dialog.remove();
        }
    }

    $refreshButton = $('<button style="margin-left: 1em;">Compose</button>');
    var $buttonsDiv = $("#buttonsDiv");
    $buttonsDiv.append($refreshButton);
    $refreshButton.button({
            icons: {
                primary: "ui-icon-locked"
            }
        }
    );
    $refreshButton.click(function() {
        if (songSettingsDirty) {
            $refreshButton.button("option", "disabled", true);
            renderSong(
                function() { // On done
                },
                function() { // On cancel
                    $refreshButton.button("option", "disabled", false);
                },
                function() { // On fail
                    $refreshButton.button("option", "disabled", false);
                }
            );
        }
    });

    // Updating GUI from settings
    updateGuiFromEditorSettings(dialogs);

    $playButton = $("#waplaybutton");
    $stopButton = $("#wastopbutton");
    $forwardButton = $("#waforwardbutton");
    $rewindButton = $("#warewindbutton");

    var audioStepTime = 10;

    function playerUpdate() {
        var updateMillis = 500;
        if (audioPlayer) {
            var before = Date.now();
            audioPlayer.step();
            var after = Date.now();

            var diff = after - before;

            audioStepTime = 0.95 * audioStepTime + 0.05 * diff;

//            logit(" audio step time " + audioStepTime + " latest: " + diff);
//            logit("player beat time: " + webAudioPlayer.songPlayBeatTime);

            if (audioPlayer.mode == AudioPlayerMode.PLAY) {
                visualizer.setCurrentPlayBeatTime(audioPlayer.songPlayBeatTime);
                updateMillis = 100;
            }
        }
//        logit("Update millis " + updateMillis);
        setTimeout(playerUpdate, updateMillis);
    }

    function playSong() {
        if (audioPlayer == null) {
            audioPlayer = new AudioPlayerConstructor();
        }

        $latestAudioElement = null; // Cancels the other player

        audioPlayer.soundFontType = webAudioPlayerSettings.soundFontType;

        audioPlayer.settings = webAudioPlayerSettings;

        audioPlayer.setRenderData(renderStorage.renderData);

        audioPlayer.setChannelMaps(renderStorage.channelMaps);

        function doPlay() {
            audioPlayer.play();
            visualizer.setMode(VisualizerMode.PLAY);
            visualizer.setCurrentPlayBeatTime(audioPlayer.songPlayBeatTime);
            $playButton.button( "option", "icons", {primary: "ui-icon-pause"});
        }
        audioPlayer.getReadyForPlay(
            function() {
                $playButton.button("option", "disabled", false);
                doPlay();
            },
            function() { // cancel
                $playButton.button("option", "disabled", false);
            }
        );
    }

    function pauseSong() {
        audioPlayer.pause();
        visualizer.setMode(VisualizerMode.PAUSE);
        $playButton.button( "option", "icons", {primary: "ui-icon-play"});
    }

    function stepForward() {
        if (audioPlayer) {
            audioPlayer.gotoBeat(audioPlayer.songPlayBeatTime + 8);
            visualizer.clearHighlightNotes();
            visualizer.setCurrentPlayBeatTime(audioPlayer.songPlayBeatTime);
        }
    }
    function rewind() {
        if (audioPlayer) {
            audioPlayer.gotoBeat(audioPlayer.songPlayBeatTime - 8);
            visualizer.clearHighlightNotes();
            visualizer.setCurrentPlayBeatTime(audioPlayer.songPlayBeatTime);
        }
    }


    $playButton.click(function() {
        if (audioPlayer && audioPlayer.mode == AudioPlayerMode.PLAY) {
            pauseSong();
        } else {
            $playButton.button("option", "disabled", true);
            if (songSettingsDirty) {
                renderSong(
                    function() { // On done
                        playSong();
                    },
                    function() { // On cancel
                        $playButton.button("option", "disabled", false);
                    },
                    function() { // On fail
                        logit("kljd");
                        $playButton.button("option", "disabled", false);
                    }
                );
            } else {
                $playButton.button("option", "disabled", true);
                playSong();
            }
        }
    });

    $stopButton.click(function() {
        stopSong();
    });

    $forwardButton.click(function() {
        stepForward();
    });

    $rewindButton.click(function() {
        rewind();
    });

    function checkSettingsChange() {
        if (settingsDirty) {
            saveSettingsToLocalStorage();
            settingsDirty = false;
            logit("Saving settings");
        }
        setTimeout(checkSettingsChange, 500);
    }
    checkSettingsChange();

    var prevVisualizerTime = Date.now();

    var stepCounter = 0;

    function animate() {
        requestAnimationFrame(animate);

//        logit("dhskf " + stepCounter);
        var paintFps = visualizer3DSettings.context2DFps;
        if (usingWebGL) {
            paintFps = visualizer3DSettings.webGLFps;
        }
        if (visualizer3DSettings.usePerspective) {
            if (!visualizer.camera.inPerspectiveMode) {
                visualizer.camera.toPerspective();
            }
        } else {
            if (!visualizer.camera.inOrthographicMode) {
                visualizer.camera.toOrthographic();
            }
        }

        var paintModulus = clamp(Math.round(60 / paintFps), 1, 60);
        var time = Date.now();
        var dt = time - prevVisualizerTime;
        visualizer.stopMovementMode = visualizer3DSettings.stopMovementMode;
        visualizer.step(dt);
        stepCounter++;
        if ((stepCounter % paintModulus) == 0) {
            if (visualizer3DSettings.on) {
                visualizer.render();
            }
        }
        prevVisualizerTime = time;
    }

    animate();
    playerUpdate();


    if (renderStorage.renderData) {
        setSongSettingsDirty(false);
        visualizer.addRenderData(renderStorage.renderData, renderStorage.renderDataLength);
    }
    if (renderStorage.songStructureInfo && renderStorage.sectionTimes) {
        visualizer.setSectionInfos(renderStorage.sectionTimes, renderStorage.songStructureInfo);
    }

    updateSongInfoPanel();


    // All is loaded now. We can stop hiding :)
    $("#hider-div").remove();

    allLoaded = true;
}