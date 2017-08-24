
var Debug = {

    lines: [],

    lineMaterial: null,

    drawLine: function(from, to, color) {
        if (!this.lineMaterial) {
            this.lineMaterial = new THREE.LineBasicMaterial( { color: color, opacity: 1, linewidth: 3, vertexColors: THREE.VertexColors } );
        }
        var line = new THREE.Line( [], this.lineMaterial);
        GameState.scene.add( line );
    },

    afterRender: function() {
        for (var i=0; i<this.lines.length; i++) {
            var l = this.lines[i];
            GameState.scene.remove(l);
        }
        this.lines = [];
    }


}