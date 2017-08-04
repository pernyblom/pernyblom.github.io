/* 
 * RIFFWAVE.js v0.03 - Audio encoder for HTML5 <audio> elements.
 * Copyleft 2011 by Pedro Ladaria <pedro.ladaria at Gmail dot com>
 *
 * Public Domain
 *
 * Changelog:
 *
 * 0.01 - First release
 * 0.02 - New faster base64 encoding
 * 0.03 - Support for 16bit samples
 *
 * Notes:
 *
 * 8 bit data is unsigned: 0..255
 * 16 bit data is signed: −32,768..32,767
 *
 */

var FastBase64 = {

    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encLookup: [],

    Init: function() {
        for (var i=0; i<4096; i++) {
            this.encLookup[i] = this.chars[i >> 6] + this.chars[i & 0x3F];
        }
    },

    Encode: function(src) {
        var len = src.length;
        var dst = '';
        var i = 0;
        while (len > 2) {
            n = (src[i] << 16) | (src[i+1]<<8) | src[i+2];
            dst+= this.encLookup[n >> 12] + this.encLookup[n & 0xFFF];
            len-= 3;
            i+= 3;
        }
        if (len > 0) {
            var n1= (src[i] & 0xFC) >> 2;
            var n2= (src[i] & 0x03) << 4;
            if (len > 1) n2 |= (src[++i] & 0xF0) >> 4;
            dst+= this.chars[n1];
            dst+= this.chars[n2];
            if (len == 2) {
                var n3= (src[i++] & 0x0F) << 2;
                n3 |= (src[i] & 0xC0) >> 6;
                dst+= this.chars[n3];
            }
            if (len == 1) dst+= '=';
            dst+= '=';
        }
        return dst;
    } // end Encode

}

FastBase64.Init();

var RIFFWAVE = function(data) {

    this.data = [];        // Array containing audio samples
    this.wav = [];         // Array containing the generated wave file
    this.dataURI = '';     // http://en.wikipedia.org/wiki/Data_URI_scheme

    this.header = {                         // OFFS SIZE NOTES
        chunkId      : [0x52,0x49,0x46,0x46], // 0    4    "RIFF" = 0x52494646
        chunkSize    : 0,                     // 4    4    36+SubChunk2Size = 4+(8+SubChunk1Size)+(8+SubChunk2Size)
        format       : [0x57,0x41,0x56,0x45], // 8    4    "WAVE" = 0x57415645
        subChunk1Id  : [0x66,0x6d,0x74,0x20], // 12   4    "fmt " = 0x666d7420
        subChunk1Size: 16,                    // 16   4    16 for PCM
        audioFormat  : 1,                     // 20   2    PCM = 1
        numChannels  : 2,                     // 22   2    Mono = 1, Stereo = 2...
        sampleRate   : 44100,                 // 24   4    8000, 44100...
        byteRate     : 0,                     // 28   4    SampleRate*NumChannels*BitsPerSample/8
        blockAlign   : 0,                     // 32   2    NumChannels*BitsPerSample/8
        bitsPerSample: 16,                    // 34   2    8 bits = 8, 16 bits = 16
        subChunk2Id  : [0x64,0x61,0x74,0x61], // 36   4    "data" = 0x64617461
        subChunk2Size: 0                      // 40   4    data size = NumSamples*NumChannels*BitsPerSample/8
    };

    function u32ToArray(i) {
        return [i&0xFF, (i>>8)&0xFF, (i>>16)&0xFF, (i>>24)&0xFF];
    }

    function u16ToArray(i) {
        return [i&0xFF, (i>>8)&0xFF];
    }

    function split16bitArray(data) {
        var r = [];
        var j = 0;
        var len = data.length;
        for (var i=0; i<len; i++) {
            r[j++] = data[i] & 0xFF;
            r[j++] = (data[i]>>8) & 0xFF;
        }
        return r;
    }

    this.toDataURI = function() {
        return 'data:audio/wav;base64,'+FastBase64.Encode(this.wav);
    };

    // dataView points to a buffer that contains an array of Int16
    this.create = function(dataView) {

        this.header.blockAlign = (this.header.numChannels * this.header.bitsPerSample) >> 3;
        this.header.byteRate = this.header.blockAlign * this.sampleRate;
        this.header.subChunk2Size = (dataView.byteLength / 2) * (this.header.bitsPerSample >> 3);
        this.header.chunkSize = 36 + this.header.subChunk2Size;

        var byteLength = 44 + dataView.byteLength;

        var resultBuffer = new ArrayBuffer(byteLength);
        var view = new DataView(resultBuffer);

        function setInt8Array(view, arr, offset) {
            for (var i=0; i<arr.length; i++) {
                view.setInt8(offset++, arr[i], true);
            }
            return offset;
        }

        function copyInt16Array(view, viewToCopy, offset) {
            var len = viewToCopy.byteLength / 2;
            for (var i=0; i<len; i++) {
                view.setInt16(offset, viewToCopy.getInt16(i * 2, true), true);
                offset += 2;
            }
            return offset;
        }


        var offset = 0;
        offset = setInt8Array(view, this.header.chunkId, offset);
        view.setUint32(offset, this.header.chunkSize, true); offset += 4;
        offset = setInt8Array(view, this.header.format, offset);
        offset = setInt8Array(view, this.header.subChunk1Id, offset);
        view.setUint32(offset, this.header.subChunk1Size, true); offset += 4;
        view.setUint16(offset, this.header.audioFormat, true); offset += 2;
        view.setUint16(offset, this.header.numChannels, true); offset += 2;
        view.setUint32(offset, this.header.sampleRate, true); offset += 4;
        view.setUint32(offset, this.header.byteRate, true); offset += 4;
        view.setUint16(offset, this.header.blockAlign, true); offset += 2;
        view.setUint16(offset, this.header.bitsPerSample, true); offset += 2;
        offset = setInt8Array(view, this.header.subChunk2Id, offset);
        view.setUint32(offset, this.header.subChunk2Size, true); offset += 4;
        offset = copyInt16Array(view, dataView, offset);

        this.buffer = resultBuffer;

//        this.wav = this.header.chunkId.concat(
//            u32ToArray(this.header.chunkSize),
//            this.header.format,
//            this.header.subChunk1Id,
//            u32ToArray(this.header.subChunk1Size),
//            u16ToArray(this.header.audioFormat),
//            u16ToArray(this.header.numChannels),
//            u32ToArray(this.header.sampleRate),
//            u32ToArray(this.header.byteRate),
//            u16ToArray(this.header.blockAlign),
//            u16ToArray(this.header.bitsPerSample),
//            this.header.subChunk2Id,
//            u32ToArray(this.header.subChunk2Size),
//            (this.header.bitsPerSample == 16) ? split16bitArray(this.data) : this.data
//        );

//        logit("Calculated length " + byteLength);
//        logit("Actual length " + offset);

        return resultBuffer;
    };


}; // end RIFFWAVE



function MidiSynthSource(sampleFreq, bufferLen) {
    this.sampleFreq = sampleFreq;
    this.bufferLen = bufferLen;
};

function MidiSynthEnvelope(sampleFreq, bufferLen) {
    this.sampleFreq = sampleFreq;
    this.bufferLen = bufferLen;
    this.released = false;
}

MidiSynthEnvelope.prototype.writeEnvelope = function(arr, offset, len, synth) {
};
MidiSynthEnvelope.prototype.release = function() {
    this.released = true;
};


function MidiSynthADSREnvelope(sampleFreq, bufferLen) {
    MidiSynthEnvelope.call(this, sampleFreq, bufferLen);

    this.attackTime = 0.1;
    this.decayTime = 0.2;
    this.sustainLevel = 0.25;
    this.releaseTime = 0.15;

    this.attackBufLen = 100;
    this.decayBufLen = 100;
    this.releaseBufLen = 100;

    this.released = false;
    this.releaseValue = 1;
    this.bufferIndex = 0;

    this.lastValue = 0;
    this.done = false;

    this.ampScale = 1;

    this.updateBufferLengths();
}
MidiSynthADSREnvelope.prototype = new MidiSynthEnvelope(44100, 100);

MidiSynthADSREnvelope.prototype.updateBufferLengths = function() {
    this.attackBufLen = this.attackTime * this.sampleFreq;
    this.decayBufLen = this.decayTime * this.sampleFreq;
    this.releaseBufLen = this.releaseTime * this.sampleFreq;
};

MidiSynthADSREnvelope.prototype.setSpecification = function(attackTime, decayTime, sustainLevel, releaseTime) {
    this.attackTime = attackTime;
    this.decayTime = decayTime;
    this.sustainLevel = sustainLevel;
    this.releaseTime = releaseTime;

    this.updateBufferLengths();
};

MidiSynthADSREnvelope.prototype.release = function() {
    MidiSynthEnvelope.prototype.release.call(this);
    this.releaseBufferIndex = this.bufferIndex;
    this.releaseValue = this.lastValue;
};

MidiSynthADSREnvelope.prototype.writeEnvelope = function(arr, offset, len, synth) {
    if (this.done) {
        return;
    }
    var bufferIndex = this.bufferIndex;
    var attackBufLen = this.attackBufLen;
    var decayBufLen = this.decayBufLen;
    var releaseBufLen = this.releaseBufLen;
    var sustainLevel = this.sustainLevel;
    var ampScale = this.ampScale;

    var value = 0;
    if (this.releaseBufferIndex > 0) {
        var releaseBufferIndex = this.releaseBufferIndex;
        var releaseValue = this.releaseValue;
        for (var i=0; i<len; i++) {
            var diffT = bufferIndex - releaseBufferIndex;

            var k = -releaseValue / releaseBufLen;
            value = k * diffT + releaseValue;

            if (value < 0) {
                value = 0;
                this.done = true;
            }
            arr[offset + i] += value * ampScale;
            bufferIndex++;
        }
    } else {
        for (var i=0; i<len; i++) {
            var value = 0;
            if (bufferIndex < attackBufLen) {
                value = bufferIndex / attackBufLen;
            } else if (bufferIndex < attackBufLen + decayBufLen) {
                var k = -(1 - sustainLevel) / decayBufLen;
                value = 1 + k * (bufferIndex - attackBufLen);
            } else {
                value = sustainLevel;
            }
            arr[offset + i] += value * ampScale;
            bufferIndex++;
        }
//        logit("wrote attack phase. Attack buf len: " + attackBufLen + " len: " + len + " bufferIndex: " + bufferIndex + " " + JSON.stringify(arr));

    }
    this.bufferIndex = bufferIndex;
    this.lastValue = value;
};


function MidiSynthFilter(sampleFreq, bufferLen) {
    this.sampleFreq = sampleFreq;
    this.bufferLen = bufferLen;
}

MidiSynthFilter.prototype.write = function(arr, offset, len, synth) {
}

function SerialMidiSynthFilter(sampleFreq, bufferLen) {
    MidiSynthFilter.call(this, sampleFreq, bufferLen);
}

SerialMidiSynthFilter.prototype = new MidiSynthFilter();

function MidiSynthOscillator(sampleFreq, bufferLen) {
    MidiSynthSource.call(this, sampleFreq, bufferLen);
    this.freq = 440;
}
MidiSynthOscillator.prototype = new MidiSynthSource();


MidiSynthOscillator.prototype.setFrequency = function(freq) {
    this.freq = freq;
};


// func should have a frequency of 1
function MidiSynthCustomOscillator(sampleFreq, bufferLen, func) {
    MidiSynthOscillator.call(this, sampleFreq, bufferLen);
    this.normalizedPhase = 0;
    this.phaseStep = 0;
    this.func = func;
    this.setFrequency(this.freq);
}
MidiSynthCustomOscillator.prototype = new MidiSynthOscillator(44100, 100);

MidiSynthCustomOscillator.prototype.setFrequency = function(freq) {
    this.freq = freq;
    this.phaseStep = freq / this.sampleFreq;
};

MidiSynthCustomOscillator.prototype.write = function(arr, offset, len, restore) {
    for (var i=0; i<len; i++) {
        arr[i + offset] += this.func(this.normalizedPhase);
        this.normalizedPhase += this.phaseStep;
        if (this.normalizedPhase > 1) {
            this.normalizedPhase = mod(this.normalizedPhase, 1);
        }
    }
};


// func should have a frequency of 1
function MidiSynthSampleAndHoldOscillator(sampleFreq, bufferLen, func) {
    MidiSynthOscillator.call(this, sampleFreq, bufferLen);
    this.normalizedPhase = 0;
    this.phaseStep = 0;
    this.func = func;
    this.funcSampleFreqMult = 1;
    this.value = null;
    this.setFrequency(this.freq);
}
MidiSynthSampleAndHoldOscillator.prototype = new MidiSynthOscillator(44100, 100);

MidiSynthSampleAndHoldOscillator.prototype.setFrequency = function(freq) {
    this.freq = freq;
};

MidiSynthSampleAndHoldOscillator.prototype.write = function(arr, offset, len, restore) {
    var funcSampleFreqMult = this.funcSampleFreqMult;

    this.phaseStep = this.freq / this.sampleFreq;

    if (this.value === null) {
        this.value = this.func(this.phase);
    }

    for (var i=0; i<len; i++) {
        arr[i + offset] += this.value;
        this.normalizedPhase += this.phaseStep;
        this.phase += this.phaseStep;
        if (funcSampleFreqMult * this.normalizedPhase > 1) {
            this.normalizedPhase = mod(funcSampleFreqMult * this.normalizedPhase, 1);
            this.value = this.func(this.phase); // Take a new sample
        }
    }
};



function MidiSynthSineOscillator(sampleFreq, bufferLen) {
    MidiSynthOscillator.call(this, sampleFreq, bufferLen);
    this.sinVal = 0;
    this.cosVal = 1;
    this.dFreq = 0;

    this.setFrequency(this.freq);
}
MidiSynthSineOscillator.prototype = new MidiSynthOscillator(44100, 100);

MidiSynthSineOscillator.prototype.setFrequency = function(freq) {
    this.freq = freq;
    this.delta = freq * (2 * Math.PI) / this.sampleFreq;
    var sinHalfDelta = Math.sin(this.delta * 0.5);
    this.alpha = 2 * sinHalfDelta * sinHalfDelta;
    this.beta = Math.sin(this.delta);
};


MidiSynthSineOscillator.prototype.write = function(arr, offset, len, restore) {
    var oldSinVal = this.sinVal;
    var oldCosVal = this.cosVal;

    for (var i=0; i<len; i++) {
        arr[i + offset] += this.sinVal;
        var cosVal = this.cosVal;
        var sinVal = this.sinVal;
        this.cosVal = cosVal - (this.alpha * cosVal + this.beta * sinVal);
        this.sinVal = sinVal - (this.alpha * sinVal - this.beta * cosVal);
    }

    if (restore) {
        this.sinVal = oldSinVal;
        this.cosVal = oldCosVal;
    }
};


var MidiSynthVoiceMode = {
    ON: 0,
    RELEASE: 1,
    OFF: 2
};

function MidiSynthVoice(sampleFreq, bufferLen) {
    this.sampleFreq = sampleFreq;
    this.bufferLen = bufferLen;
    this.done = false;
    this.note = 60;
    this.channel = 0;
    this.velocity = 127;
    this.instrument = null;
    this.time = 0;
    this.startTime = 0;
    this.offTime = 0;
    this.oscillators = [];
    this.envelopes = [];
    this.mode = MidiSynthVoiceMode.ON;
    this.data = {}; // For instrument-specific stuff
}

MidiSynthVoice.prototype.writeVoice = function(arr, offset, len, synth) {
    if (!this.instrument) {
        this.instrument = new DefaultMidiSynthInstrument(this.sampleFreq, this.bufferLen);
    }
    this.instrument.writeVoice(arr, offset, len, synth, this);
}

MidiSynthVoice.prototype.noteOff = function(offTime) {
    this.offTime = offTime;
    this.mode = MidiSynthVoiceMode.RELEASE;
}


function MidiSynthInstrument(sampleFreq, bufferLen) {
    this.sampleFreq = sampleFreq;
    this.bufferLen = bufferLen;
};

MidiSynthInstrument.prototype.writeVoice = function(arr, offset, len, synth, voice) {
};

function DefaultMidiSynthInstrument(sampleFreq, bufferLen) {
    MidiSynthInstrument.call(this, sampleFreq, bufferLen);

}
DefaultMidiSynthInstrument.prototype = new MidiSynthInstrument();

DefaultMidiSynthInstrument.prototype.random = function(x) {
    return 2 * Math.random() - 1;
};

DefaultMidiSynthInstrument.prototype.writeVoice = function(arr, offset, len, synth, voice) {

    var volEnvelope = voice.envelopes[0];
    var oscillator = voice.oscillators[0];
    if (!volEnvelope) {
        volEnvelope = new MidiSynthADSREnvelope(this.sampleFreq, this.bufferLen);
        voice.envelopes[0] = volEnvelope;
    }
    if (!oscillator) {
        if (voice.channel == 9) {

            var oscillatorType = 0;
            var oscFunc = this.random;
            var baseFreq = 100;
            var freqMult = 1;
            var attack = 0.001;
            var decay = 0.1;
            var sustain = 1;
            var release = 0.15;

            var ampScale = 1;

            switch (voice.note) {
                case MidiDrum.BASS_DRUM_1:
                case MidiDrum.BASS_DRUM_2:
                    freqMult = 2;
                    ampScale = 2;
                    break;
                case MidiDrum.RIDE_BELL:
                case MidiDrum.RIDE_CYMBAL_1:
                case MidiDrum.RIDE_CYMBAL_2:
                    freqMult = 30;
                    sustain = 0.25;
                    ampScale = 0.3;
                    break;
                case MidiDrum.CLOSED_HIHAT:
                case MidiDrum.OPEN_HIHAT:
                case MidiDrum.RIMSHOT:
                case MidiDrum.PEDAL_HIHAT:
                    freqMult = 25;
                    sustain = 0.25;
                    ampScale = 0.5;
                    break;
                case MidiDrum.CABASA:
                case MidiDrum.CHINESE_CYMBAL:
                case MidiDrum.CLAVES:
                case MidiDrum.COWBELL:
                case MidiDrum.CRASH_CYMBAL_1:
                case MidiDrum.CRASH_CYMBAL_2:
                case MidiDrum.HAND_CLAP:
                case MidiDrum.HIGH_AGOGO:
                case MidiDrum.HIGH_BONGO:
                case MidiDrum.HIGH_TIMBALE:
                case MidiDrum.HIGH_TOM_1:
                case MidiDrum.HIGH_TOM_2:
                case MidiDrum.HIGH_WOOD_BLOCK:
                case MidiDrum.LONG_GUIRO:
                case MidiDrum.LONG_WHISTLE:
                case MidiDrum.LOW_AGOGO:
                case MidiDrum.LOW_BONGO:
                case MidiDrum.LOW_CONGA:
                case MidiDrum.LOW_TIMBALE:
                case MidiDrum.LOW_TOM_1:
                case MidiDrum.LOW_TOM_2:
                case MidiDrum.LOW_WOOD_BLOCK:
                case MidiDrum.MARACAS:
                case MidiDrum.MID_TOM_1:
                case MidiDrum.MID_TOM_2:
                case MidiDrum.MUTE_CUICA:
                case MidiDrum.MUTE_HIGH_CONGA:
                case MidiDrum.MUTE_TRIANGLE:
                case MidiDrum.OPEN_CUICA:
                case MidiDrum.OPEN_HIGH_CONGA:
                case MidiDrum.OPEN_TRIANGLE:
                case MidiDrum.SHORT_GUIRO:
                case MidiDrum.SHORT_WHISTLE:
                case MidiDrum.SNARE_DRUM_1:
                case MidiDrum.SNARE_DRUM_2:
                case MidiDrum.SPLASH_CYMBAL:
                case MidiDrum.TAMBOURINE:
                case MidiDrum.VIBRA_SLAP:
                    freqMult = 8;
                    sustain = 0.5;
                    break;
            }

            volEnvelope.setSpecification(attack, decay, sustain, release);
            volEnvelope.ampScale = ampScale;
            switch (oscillatorType) {
                case 0:
                    oscillator = new MidiSynthSampleAndHoldOscillator(this.sampleFreq, this.bufferLen);
                    oscillator.setFrequency(baseFreq);
                    oscillator.func = oscFunc;
                    oscillator.funcSampleFreqMult = freqMult;
                    break;
            }

        } else {
            oscillator = new MidiSynthSineOscillator(this.sampleFreq, this.bufferLen);
            var noteFreq = midiNoteToFrequency(voice.note);
            oscillator.setFrequency(noteFreq);
        }
        voice.oscillators[0] = oscillator;
    }

    // Write the vol envelope
    var volBuf = createFilledArray(len, 0);
    switch (voice.mode) {
        case MidiSynthVoiceMode.ON:
        case MidiSynthVoiceMode.RELEASE:
            volEnvelope.writeEnvelope(volBuf, 0, len, synth);
            if (voice.mode == MidiSynthVoiceMode.RELEASE) {
                if (!volEnvelope.released) {
                    volEnvelope.release();
                }
                if (volEnvelope.done) {
                    voice.mode = MidiSynthVoiceMode.OFF;
                }
            }
//            logit("Envelope wrote " + JSON.stringify(volBuf));
            break;
        case MidiSynthVoiceMode.OFF:
            return; // No need to write anything
    }

    var sourceBuf = createFilledArray(len, 0);
    oscillator.write(sourceBuf, 0, len, false);

//    logit("Oscillator wrote " + JSON.stringify(sourceBuf));

    for (var i=0; i<len; i++) {
        var val = volBuf[i] * sourceBuf[i];
        for (var j=0; j<synth.channels; j++) {
            var buf = arr[j];
            buf[i + offset] += val;
        }
    }
};




function MidiSynth(options) {
    this.sampleFreq = getValueOrDefault(options, "sampleFreq", 44100);
    this.channels = getValueOrDefault(options, "channels", 2);

    this.voices = [];
    this.instruments = [];
}


MidiSynth.prototype.synthesizeBatch = function(midiData, progressFunc) {
//    logit(midiData);

//    var midiEvents = midiData.tracks[0];

    var events = midiData.midiTracks[0].trackEvents;

    var midiDivisions = midiData.midiDivisions;


    var controlFreq = 200; // Hz

    var bufferLen = Math.max(1, Math.round(this.sampleFreq / controlFreq));

//    logit("Control freq of " + controlFreq + " gives a buffer size " + bufferLen);


    var channelBuffers = [];
    var dirtyChannelBuffers = [];
    var midiChannelCount = 32;
    for (var i=0; i<midiChannelCount; i++) {
        channelBuffers[i] = [];
        dirtyChannelBuffers[i] = false;
    }

    // Check if there is a set tempo event at time 0
    // Also get the max tick to calculate buffer length
    var currentMicrosPerQuarter = 500000; // Default is 120 bpm
    var tempMicrosPerQuarter = currentMicrosPerQuarter; // Use a temp for calculating song length
    var tempTick = 0;
    var tempSeconds = 0;
    for (var i=0; i<events.length; i++) {
        var e = events[i];
        var eventMessage = e.eventMessage;
        if (eventMessage.messageClass == "SetTempoMessage") {
            if (tempTick == 0) {
                // The initial tempo
                currentMicrosPerQuarter = eventMessage.microsPerQuarter;
            }
            tempMicrosPerQuarter = eventMessage.microsPerQuarter;
//            logit("Tempo at " + tempSeconds + " set to " + (1000000 * 60) / tempMicrosPerQuarter);
        }
        var micros = tempMicrosPerQuarter * (e.eventTime / midiDivisions);
        var seconds = micros / 1000000;
        tempSeconds += seconds;
        tempTick += e.eventTime;
    }
    var maxTick = tempTick;

    // We now know the length of the song
    var endSeconds = 1;
    var totalBufferLen = Math.round(this.sampleFreq * (tempSeconds + endSeconds));

//    logit("Total buffer length: " + totalBufferLen);

    var mixerBuffer = [];

    var result = [];
    for (var i=0; i<this.channels; i++) {
        result[i] = [];
        mixerBuffer[i] = createFilledArray(bufferLen, 0);
    }

    var bufferLenLeft = totalBufferLen;


//    logit("Max tick " + maxTick);
//    logit("Song length " + tempSeconds + " seconds");
//    logit("Init tempo is " + currentMicrosPerQuarter);
//    logit("Bpm: " + (1000000 * 60) / currentMicrosPerQuarter);

    var bufferLenSeconds = bufferLen / this.sampleFreq;

    var currentBufferTimeSeconds = 0;
    var currentMidiTick = 0;
    var currentMidiTickSeconds = 0;
    var midiDataIndex = 0;

    var secondsPerMicros = 1 / 1000000;

    var bufferIndex = 0;

    var progPeriod = 22050;
    var progPhase = 0;

    while (bufferLenLeft > 0) {

        var nextBufferTimeSeconds = currentBufferTimeSeconds + bufferLenSeconds;

        var secondsPerMidiTick = secondsPerMicros * (currentMicrosPerQuarter / midiDivisions);

        var nextMicrosPerQuarter = currentMicrosPerQuarter;
        // Take care of midi messages
        for (var i=midiDataIndex; i<events.length; i++) {
            var e = events[i];
            var eventTime = e.eventTime;
            var stepSeconds = secondsPerMidiTick * eventTime;
            if (stepSeconds + currentMidiTickSeconds < nextBufferTimeSeconds) {
                // This midi event should be taken care of
                currentMidiTick += eventTime;
                currentMidiTickSeconds += stepSeconds;
                midiDataIndex = i + 1;

                var eventMessage = e.eventMessage;

                // Handle midi message here
                switch (eventMessage.messageClass) {
                    case "ChannelMessage":
                        var statusStr = eventMessage.status;
//                        status = MessageStatus.CONTROL_CHANGE;
                        switch (statusStr) {
                            case "CONTROL_CHANGE":
//                                status = MessageStatus.CONTROL_CHANGE;
                                break;
                        }
//                        message = new ChannelMessage(status, eventMessage.channel, eventMessage.data1, eventMessage.data2);
                        break;
                    case "VoiceMessage":
//                        logit("Taking care of midi event " + JSON.stringify(e));
                        statusStr = eventMessage.status;
//                        status = MessageStatus.NOTE_OFF;
                        switch (statusStr) {
                            case "NOTE_ON":
                                // Create a new voice
                                var newVoice = new MidiSynthVoice(this.sampleFreq, bufferLen);
                                newVoice.channel = eventMessage.channel;
                                newVoice.note = eventMessage.data1;
                                newVoice.velocity = eventMessage.data2;
                                newVoice.startTime = currentMidiTickSeconds;
                                this.voices.push(newVoice);
//                                logit(newVoice);
//                                logit("Adding note " + JSON.stringify(newVoice));
                                break;
                            case "NOTE_OFF":
                                // Find the oldest voice with the note
                                var oldestVoice = null;
                                var minTime = currentMidiTickSeconds + 100;
//                                logit("Should remove note " + eventMessage.data1 + " on channel " + eventMessage.channel + " minTime " + minTime);

                                for (var j=0; j<this.voices.length; j++) {
                                    var v = this.voices[j];
                                    if (v.mode == MidiSynthVoiceMode.ON &&
                                        v.channel == eventMessage.channel &&
                                        v.note == eventMessage.data1) {
                                        if (v.startTime < minTime) {
                                            minTime = v.startTime;
                                            oldestVoice = v;
                                        }
                                    }
                                }
                                if (oldestVoice) {
                                    oldestVoice.noteOff();
                                } else {
                                    logit("Could not find an active voice");
                                }
                                break;
                        }
//                        message = new VoiceMessage(status, eventMessage.channel, eventMessage.data1, eventMessage.data2);
                        break;
                    case "EndTrackMessage":
//                        message = EndTrackMessage.prototype.END_OF_TRACK;
                        break;
                    case "ProgramChangeMessage":
//                        message = new ProgramChangeMessage(eventMessage.channel, eventMessage.program);
                        break;
                    case "SetTempoMessage":
                        nextMicrosPerQuarter = eventMessage.microsPerQuarter;
                        break;
                    default:
                        logit("Unknown message ");
                        logit(eventMessage);
                        break;
                }
            } else {
                // We wait
                break;
            }
        }

//        logit("Voice count " + this.voices.length);

        var newVoices = [];
        // Gather everything from the voices
        for (var i=0; i<this.voices.length; i++) {
            var voice = this.voices[i];

            var voiceBufArr = channelBuffers[voice.channel];

            if (!dirtyChannelBuffers[voice.channel]) {
                // Writing for the first time this bufLength step
                for (var j=0; j<this.channels; j++) {
                    voiceBufArr[j] = createFilledArray(bufferLen, 0);
                }
            }
            dirtyChannelBuffers[voice.channel] = true;
            voice.writeVoice(voiceBufArr, 0, bufferLen, this);
            if (voice.mode != MidiSynthVoiceMode.OFF) {
                newVoices.push(voice);
            } else {
//                logit("Removing voice ");
            }
        }
        this.voices = newVoices;

        // Apply channel filters

        // Mixer
        for (var i=0; i<this.channels; i++) {
            fillArray(mixerBuffer[i], bufferLen, 0);
        }

        for (var i=0; i<channelBuffers.length; i++) {
            if (dirtyChannelBuffers[i]) {
                var cBuf = channelBuffers[i];
                for (var j=0; j<this.channels; j++) {
                    var buf = cBuf[j];
                    for (var k=0; k<buf.length; k++) {
                        mixerBuffer[j][k] += buf[k];
                    }
                }
                dirtyChannelBuffers[i] = false;
            }
        }

        // Apply final filters

        // Write to result buffer

        var toWriteLen = Math.min(bufferLen, bufferLenLeft);
        for (var i=0; i<this.channels; i++) {
            var buf = mixerBuffer[i];
            var resultBuf = result[i];
            for (var j=0; j<toWriteLen; j++) {
                resultBuf[j + bufferIndex] = buf[j];
            }
        }

        currentMicrosPerQuarter = nextMicrosPerQuarter; // Update tempo
        currentBufferTimeSeconds += bufferLenSeconds;
        bufferLenLeft -= bufferLen;
        bufferIndex += bufferLen;


        // Send progress
        if (progressFunc) {
            progPhase += bufferLen;
            if (progPhase > progPeriod) {
                progPhase = 0;
                progressFunc(Math.min(1, bufferIndex / totalBufferLen));
            }
        }
    }

    if (this.voices.length > 0) {
        logit("Voice count after finish: " + this.voices.length);

        for (var i=0; i<this.voices.length; i++) {
            var v = this.voices[i];
            logit(" voice " + i + ": " + v.mode);
        }
    }


    // Normalize result

    // Find the max value
    var absMax = 0;
    var maxIndex = 0;
    for (var j=0; j<this.channels; j++) {
        var buf = result[j];
        buf.length = totalBufferLen;
        for (var k=0; k<buf.length; k++) {
            var test = Math.abs(buf[k]);
            if (test > absMax) {
                absMax = test;
                maxIndex = k;
            }
        }
    }
    // Multiply to normalize
    var newMax = 0.95;
    var multiplier = newMax * (absMax > 0.001 ? 1 / absMax : 1);
    if (multiplier != newMax) {
        for (var j=0; j<this.channels; j++) {
            var buf = result[j];
            for (var k=0; k<buf.length; k++) {
                buf[k] *= multiplier;
            }
        }
    }
    logit("Normalize multiplier: " + multiplier + " max: " + absMax + " at " + maxIndex);

    logit("Final buffer lengths " + result[0].length);

//    var testEnv = new MidiSynthADSREnvelope(100, 100);
//    var testBuf = createFilledArray(100, 0);
//    testEnv.writeEnvelope(testBuf, 0, 100, this);
//
//    logit("Test env output: " + JSON.stringify(testBuf));


//    var sampleCount = this.sampleFreq;
//
//    var freqFactor = (2 * Math.PI) / this.sampleFreq;
//
//    for (var j=0; j<this.channels; j++) {
//        var arr = result[j];
//        for (var i=0; i<sampleCount; i++) {
//            arr[i] = Math.sin(freqFactor * i * 440 * (j + 1));
//        }
//    }

//    logit(result);

    return result;
};