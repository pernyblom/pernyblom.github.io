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

