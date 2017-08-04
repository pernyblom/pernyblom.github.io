
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
