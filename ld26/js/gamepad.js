

function setupGamepads() {

    if (Modernizr.gamepads) {
        var funcs = [navigator.webkitGetGamepads, navigator.getGamepads, function() {return []}];
        for (var i=0; i<funcs.length; i++) {
            if (funcs[i]) {
                Input.getGamepads = funcs[i];
                break;
            }
        }
    }

}

var gamepadButtons = [
    {padIndex: 0, buttonIndex: 0, buttons: [Input.COMMA]},
    {padIndex: 0, buttonIndex: 1, buttons: [Input.POINT]},
    {padIndex: 0, buttonIndex: 2, buttons: [Input.COMMA]},
    {padIndex: 0, buttonIndex: 3, buttons: [Input.POINT]},
    {padIndex: 0, buttonIndex: 4, buttons: [Input.COMMA]},
    {padIndex: 0, buttonIndex: 5, buttons: [Input.POINT]},
    {padIndex: 0, buttonIndex: 6, buttons: [Input.COMMA]},
    {padIndex: 0, buttonIndex: 7, buttons: [Input.POINT]},
    {padIndex: 0, buttonIndex: 8, buttons: [Input.ESCAPE]},
    {padIndex: 0, buttonIndex: 9, buttons: [Input.ESCAPE]},
    {padIndex: 0, buttonIndex: 10, buttons: [Input.COMMA]},
    {padIndex: 0, buttonIndex: 11, buttons: [Input.POINT]},
    {padIndex: 0, buttonIndex: 12, buttons: [Input.ARROW_UP]},
    {padIndex: 0, buttonIndex: 13, buttons: [Input.ARROW_DOWN]},
    {padIndex: 0, buttonIndex: 14, buttons: [Input.ARROW_LEFT]},
    {padIndex: 0, buttonIndex: 15, buttons: [Input.ARROW_RIGHT]},
    {padIndex: 1, buttonIndex: 0, buttons: [Input.Z]},
    {padIndex: 1, buttonIndex: 1, buttons: [Input.X]},
    {padIndex: 1, buttonIndex: 2, buttons: [Input.Z]},
    {padIndex: 1, buttonIndex: 3, buttons: [Input.X]},
    {padIndex: 1, buttonIndex: 4, buttons: [Input.Z]},
    {padIndex: 1, buttonIndex: 5, buttons: [Input.X]},
    {padIndex: 1, buttonIndex: 6, buttons: [Input.Z]},
    {padIndex: 1, buttonIndex: 7, buttons: [Input.X]},
    {padIndex: 1, buttonIndex: 8, buttons: [Input.ESCAPE]},
    {padIndex: 1, buttonIndex: 9, buttons: [Input.ESCAPE]},
    {padIndex: 1, buttonIndex: 10, buttons: [Input.Z]},
    {padIndex: 1, buttonIndex: 11, buttons: [Input.X]},
    {padIndex: 1, buttonIndex: 12, buttons: [Input.W]},
    {padIndex: 1, buttonIndex: 13, buttons: [Input.S]},
    {padIndex: 1, buttonIndex: 14, buttons: [Input.A]},
    {padIndex: 1, buttonIndex: 15, buttons: [Input.D]}
];

var gamepadAxis2dControls = [
    {padIndex: 0, property: "xAxes", propertyIndex: 0, axisIndex: 0, deadZone: 0.1, multiplier: 1},
    {padIndex: 0, property: "yAxes", propertyIndex: 0, axisIndex: 1, deadZone: 0.1, multiplier: -1},
    {padIndex: 1, property: "xAxes", propertyIndex: 1, axisIndex: 0, deadZone: 0.1, multiplier: 1},
    {padIndex: 1, property: "yAxes", propertyIndex: 1, axisIndex: 1, deadZone: 0.1, multiplier: -1}
];


function handleGamepadInput() {

    var gamepads = Input.getGamepads.call(navigator);

    var keysDownByOther = {};

    for (var i=0; i<gamepads.length; i++) {
        var pad = gamepads[i];
        if (pad) {
            for (var j=0; j<gamepadButtons.length; j++) {
                var gpb = gamepadButtons[j];
                if (i == gpb.padIndex) {
                    var button = pad.buttons[gpb.buttonIndex];
//                    logit(" " + button);
                    if (button > 0.1) {
                        gpb.down = true;
                        for (var k=0; k<gpb.buttons.length; k++) {
                            var b = gpb.buttons[k];
                            Input.keysDown[b] = true;
                            Input.justPressed[b] = true;
                            keysDownByOther[b] = true;
                        }
                    } else {
                        if (gpb.down) {
                            for (var k=0; k<gpb.buttons.length; k++) {
                                var b = gpb.buttons[k];
                                if (!keysDownByOther[b]) {
                                    Input.keysDown[b] = false;
                                }
                            }
                            gpb.down = false;
                        }
                    }
                }
            }

            for (var j=0; j<gamepadAxis2dControls.length; j++) {
                var gac = gamepadAxis2dControls[j];
                if (i == gac.padIndex) {
                    var axisValue = gac.multiplier * pad.axes[gac.axisIndex];
                    if (Math.abs(axisValue) < gac.deadZone) {
                        axisValue = 0;
                    }
                    Input[gac.property][gac.propertyIndex] = axisValue;
                }
            }

        }
    }

}