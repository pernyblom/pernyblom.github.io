
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
