
function RenderChannel() {
    this.id = "";
    this.percussion = false;
    this._constructorName = "RenderChannel";
}


function NamedNote() {
    this.id = "";
    this._constructorName = "NamedNote";
}

NamedNote.prototype.getNote = function() {
    return 60;
};

NamedNote.prototype.setId = function(n) {
    this.id = n;
    return this;
};


function SimpleNamedNote() {
    NamedNote.call(this);
    this.note = 60;
    this._constructorName = "SimpleNamedNote";
}

SimpleNamedNote.prototype = new NamedNote();

SimpleNamedNote.prototype.getNote = function() {
    return this.note;
};

SimpleNamedNote.prototype.setNote = function(n) {
    this.note = n;
    return this;
};

function MidiDrumNamedNote() {
    NamedNote.call(this);
    this.note = MidiDrum.BASS_DRUM_1;
    this._constructorName = "MidiDrumNamedNote";
}

MidiDrumNamedNote.prototype = new NamedNote();

MidiDrumNamedNote.prototype.getNote = function() {
    return this.note;
};

MidiDrumNamedNote.prototype.setNote = function(n) {
    this.note = n;
    return this;
};


