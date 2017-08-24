
function detectMobile() {
    if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
        ){
        return true;
    }
    else {
        return false;
    }
}


var mobileButtons = [
    {x: 0, y: 50, w: 50, h: 50, down: false, buttons: [Input.A]}
];

var mobileAxis2dControls = [
    {xProperty: "xAxis", yProperty: "yAxis", x: 20, y: 20, w: 150, h: 150, noInputRadius: 0.2, maxInputRadius: 0.2, markerRadius: 0.3}
];

function updateMobileControls() {

    var canvas = GameState.canvas;
    var w = canvas.width;
    var h = canvas.height;
    var offset = clamp(Math.min(w * 0.02, h * 0.02), 5, 10);
    var ctrlSize = clamp((w + h) * 0.4 * 0.5, 50, Math.min(w, h) * 0.45);
    var buttonSize = ctrlSize / 3.0;

    var buttonY = canvas.height - ctrlSize - offset;

    mobileButtons = [
        {x: w - offset - buttonSize, y: h - offset - buttonSize, w: buttonSize, h: buttonSize, down: false, buttons: [Input.N]},
        {x: w - offset * 2 - buttonSize * 2, y: h - offset - buttonSize, w: buttonSize, h: buttonSize, down: false, buttons: [Input.B]},
        {x: w - offset * 3 - buttonSize * 3, y: h - offset - buttonSize, w: buttonSize, h: buttonSize, down: false, buttons: [Input.B, Input.N]}
//        {x: offset, y: buttonY, w: buttonSize, h: buttonSize, down: false, buttons: [Input.W, Input.A]},
//        {x: offset, y: buttonY, w: buttonSize, h: buttonSize, down: false, buttons: [Input.W, Input.A]},
//        {x: offset + buttonSize * 2, y: buttonY, w: buttonSize, h: buttonSize, down: false, buttons: [Input.W, Input.D]},
//        {x: offset, y: buttonY + buttonSize * 2, w: buttonSize, h: buttonSize, down: false, buttons: [Input.S, Input.A]},
//        {x: offset + buttonSize * 2, y: buttonY + buttonSize * 2, w: buttonSize, h: buttonSize, down: false, buttons: [Input.S, Input.D]},
//        {x: offset + buttonSize, y: buttonY, w: buttonSize, h: buttonSize, down: false, buttons: [Input.W]},
//        {x: offset + buttonSize, y: buttonY + buttonSize * 2, w: buttonSize, h: buttonSize, down: false, buttons: [Input.S]},
//        {x: offset + buttonSize * 2, y: buttonY + buttonSize, w: buttonSize, h: buttonSize, down: false, buttons: [Input.D]},
//        {x: offset, y: buttonY + buttonSize, w: buttonSize, h: buttonSize, down: false, buttons: [Input.A]}
    ];

    mobileAxis2dControls = [
        {xProperty: "xAxis", yProperty: "yAxis", x: offset, y: buttonY, w: ctrlSize, h: ctrlSize, noInputRadius: 0.0, maxInputRadius: 0.8, markerRadius: 0.3,
            rawX: 0, rawY: 0}
    ];
}


function handleMobileInput() {
    if (isMobile) {

        var prevent =
            GameState.subState == GameSubState.PLAYING ||
                GameState.subState == GameSubState.COMPLETING ||
                GameState.subState == GameSubState.COMPLETING_GAME;
        Input.preventTouchStartDefault = prevent;
        Input.preventTouchEndDefault = prevent;


        for (var i=0; i<mobileAxis2dControls.length; i++) {
            var info = mobileAxis2dControls[i];
            var rect = [info.x, info.y, info.w, info.h];
            Input[info.xProperty] = 0;
            Input[info.yProperty] = 0;
            info.rawX = 0;
            info.rawY = 0;
            for (var j=0; j<Input.touches.length; j++) {
                var touch = Input.touches.item(j);
                if (rectContains(rect, [touch.clientX, touch.clientY])) {
                    var fracX = (touch.clientX - info.x) / info.w;
                    var fracY = (touch.clientY - info.y) / info.h;
                    var dx = 2 * (fracX - 0.5);
                    var dy = -2 * (fracY - 0.5);

//                    logit("" + dx + " " + dy);

                    var vec = new THREE.Vector2(dx, dy);
                    var length = vec.length();
                    if (length > 1) {
                        vec.normalize();
                        length = 1;
                    }


                    // Convert to new range
                    info.rawX = vec.x;
                    info.rawY = vec.y;

                    if (length < info.noInputRadius) {
                        vec.x = 0;
                        vec.y = 0;
                    } else if (length > info.maxInputRadius) {
                        vec.multiplyScalar(1.0 / length);
                    }

                    Input[info.xProperty] = vec.x;
                    Input[info.yProperty] = vec.y;
                }
            }
        }

        var keysDownByOther = {};
        for (var i=0; i<mobileButtons.length; i++) {
            var info = mobileButtons[i];

            info.down = false;
            var rect = [info.x, info.y, info.w, info.h];
            for (var j=0; j<Input.touches.length; j++) {
                var touch = Input.touches.item(j);
                info.down = info.down || rectContains(rect, [touch.clientX, touch.clientY]);
            }

            for (var j=0; j<info.buttons.length; j++) {
                var key = info.buttons[j];
                if (!keysDownByOther[key]) {
                    Input.keysDown[key] = info.down;
                }
                if (info.down) {
                    keysDownByOther[key] = true;
                }
            }
        }
    }
}


function paintMobileControls(ctx) {
    if (isMobile) {

        ctx.strokeStyle = "#ffffff";
        ctx.fillStyle = "#ffffff";
        ctx.lineWidth = 2;

        for (var i=0; i<mobileAxis2dControls.length; i++) {
            var info = mobileAxis2dControls[i];
            ctx.beginPath();
            var rad = info.w * 0.5;
            ctx.arc(info.x + rad, info.y + rad, rad, 0, Math.PI * 2);
            ctx.stroke();

            var x = info.rawX * info.w * 0.5 + info.x + info.w * 0.5;
            var y = -info.rawY * info.h * 0.5 + info.y + info.h * 0.5;

            ctx.beginPath();
            var rad = info.markerRadius * info.w * 0.5;
//            logit("" + x + " " + y + " " + rad);
            ctx.arc(x, y, rad, 0, Math.PI * 2);
            ctx.stroke();
        }


        for (var i=0; i<mobileButtons.length; i++) {
            var info = mobileButtons[i];

            ctx.strokeRect(info.x, info.y, info.w, info.h);

            if (info.down) {
                var border = 4;
                ctx.fillRect(info.x + border, info.y + border, info.w - border * 2, info.h - border * 2);
            }
        }


    }
}
