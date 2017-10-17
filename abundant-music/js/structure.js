
function Structure() {
    this.id = "structure";
    this.references = [];
    this._constructorName = "Structure";
}


Structure.prototype.renderBatch = function(state, progressFunc) {

    composeTimer.start();
    for (var i=0; i<this.references.length; i++) {
        var ref = this.references[i];
        if (ref.active) {
            ref.renderBatch(state);
        }
        if (progressFunc) {
            var fraction = 1;
            if (this.references.length > 1) {
                fraction = i / (this.references.length - 1);
            }
            progressFunc(fraction);
        }
    }
    composeTimer.pause();
};


Structure.prototype.renderSection = function(state, index) {
    var ref = this.references[index];
    if (ref) {
        ref.renderBatch(state);
    } else {
        logit(this._constructorName + ": Could not find section with index " + index);
    }
};


