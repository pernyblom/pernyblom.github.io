
function EditorProcedure() {
    this.id = "";
    this._constructorName = "EditorProcedure";
}

EditorProcedure.prototype.getProcedure = function(module) {
    return function() {};
};

function CustomEditorProcedure() {
    EditorProcedure.call(this);
    this.procedureText = "";
    
    this._constructorName = "CustomEditorProcedure";
}

CustomEditorProcedure.prototype = new EditorProcedure();

CustomEditorProcedure.prototype.getProcedure = function(module) {
    return function() {eval(this.procedureText)};
};

