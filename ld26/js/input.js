


var Input = {
    BACKSPACE: 8,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    ESCAPE: 27,
    SPACE: 32,
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    F1: 112,
    COMMA: 188,
    POINT: 190,
    keysDown: createFilledArray(256, false),
    justPressed: createFilledArray(256, false),
    mouseDown: false,
    mouseJustPressed: false,
    mousePressX: 0,
    mousePressY: 0,
    mouseMoveX: 0,
    mouseMoveY: 0,
    touches: [],
    preventTouchStartDefault: false,
    preventTouchEndDefault: false,
    xAxes: createFilledArray(256, 0),
    yAxes: createFilledArray(256, 0),
    isDown: function(key) {
        return !!this.keysDown[key];
    },
    isAnyDown: function(keys) {
        if (keys) {
            for (var i=0; i<keys.length; i++) {
                if (!!this.keysDown[keys[i]]) {
                    return true;
                }
            }
        }
        return false;
    },
    wasPressed: function(key) {
        return !!this.justPressed[key];
    },
    getGamepads: function() {
        return [];
    },
    step: function() {
        this.justPressed = createFilledArray(256, false);
        this.mouseJustPressed = false;
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
    });

    $document.on("touchmove", function (event) {
        var e = event.originalEvent;
        if (e.touches) {
            Input.touches = e.touches;
        }
        e.preventDefault();
    });
    $document.on("touchstart", function (event) {
        var e = event.originalEvent;
        if (e.touches) {
            Input.touches = e.touches;
        }
        if (Input.preventTouchStartDefault) {
            e.preventDefault();
        }
    });
    $document.on("touchend", function (event) {
        var e = event.originalEvent;
        if (e.touches) {
            Input.touches = e.touches;
        }
        if (Input.preventTouchEndDefault) {
            e.preventDefault();
        }
    });
    $document.on("touchcancel", function (event) {
        var e = event.originalEvent;
        if (e.touches) {
            Input.touches = e.touches;
        }
    });

    $document.mousemove(function(event) {
        Input.mouseMoveX = event.clientX;
        Input.mouseMoveY = event.clientY;
    });

    $document.mousedown(function(event) {
        Input.mouseDown = true;
        Input.mouseJustPressed = true;
        Input.mousePressX = event.clientX;
        Input.mousePressY = event.clientY;
    });
    $document.mouseup(function(event) {
        Input.mouseDown = false;
    });


}

