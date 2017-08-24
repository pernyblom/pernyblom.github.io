


var Input = {
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32,
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
    keysDown: createFilledArray(256, false),
    justPressed: createFilledArray(256, false),
    isDown: function(key) {
        return !!this.keysDown[key];
    },
    wasPressed: function(key) {
        return !!this.justPressed[key];
    },
    step: function() {
        this.justPressed = createFilledArray(256, false);
    }
};

function setupInput() {

    var $document = $(document);

    $document.on("keydown", function(event) {
        Input.keysDown[event.keyCode] = true;
        Input.justPressed[event.keyCode] = true;
//        logitDoc(JSON.stringify(Input.keysDown));
    });

    $document.on("keyup", function(event) {
        Input.keysDown[event.keyCode] = false;
//        logitDoc(JSON.stringify(Input.keysDown));
    });

}
