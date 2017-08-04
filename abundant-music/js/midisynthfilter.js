

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

