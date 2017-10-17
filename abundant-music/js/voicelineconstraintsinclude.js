
function VoiceLinePlannerConstraint() {
    this.id = "";
    this._constructorName = "VoiceLinePlannerConstraint";
}


function EmptyVoiceLinePlannerConstraint() {
    VoiceLinePlannerConstraint.call(this);
    this._constructorName = "EmptyVoiceLinePlannerConstraint";
}
EmptyVoiceLinePlannerConstraint.prototype = new VoiceLinePlannerConstraint();



function MinVoiceLinePlannerConstraint() {
    VoiceLinePlannerConstraint.call(this);
    this.constraints = [];
    this._constructorName = "MinVoiceLinePlannerConstraint";

}
MinVoiceLinePlannerConstraint.prototype = new VoiceLinePlannerConstraint();


function VoiceChordNotesVoiceLinePlannerConstraint() {
    VoiceLinePlannerConstraint.call(this);
    this.chordRootPitchClassConstraints = []; // 2d arrays
    this.chordBassPitchClassConstraints = [];
    this.chordRootPitchClassConstraintCosts = [[1]]; // 2d arrays
    this.chordBassPitchClassConstraintCosts = [[1]];

    this._constructorName = "VoiceChordNotesVoiceLinePlannerConstraint";
}
VoiceChordNotesVoiceLinePlannerConstraint.prototype = new VoiceLinePlannerConstraint();
