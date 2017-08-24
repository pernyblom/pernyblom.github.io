
var globalRnd = new MersenneTwister();

var overProjector = null;

var audioPlayer = null;

var renderSettings = new RenderSettings();
var soundSettings = new SoundSettings();
var gameSettings = new GameSettings();
var levelSettings = new LevelSettings();

var allSettings = [renderSettings, soundSettings, gameSettings, levelSettings];

var objectTextWidths = {};
var screenMessageTextWidths = {};
var largeTextWidths = {};

var usingWebGL = false;

var isTouch = false;


var screenMessageFontFamily = 'press_start_2pregular';


function showModalDialog(title, content, options) {
    var $dialog = $("<div title=\"" + title + "\" >" + content + "</div>");
    $("#layer3div").append($dialog);

    if (!options) {
        options = {
            modal: true,
            buttons: {
                "Ok": function() {
                    $( this ).dialog( "close" );
                }
            }
        }
    }
    $dialog.dialog(options);
    return $dialog;
}



function logit(str) {
    console.log(str);
}

function loadSettingsFromLocalStorage() {
    for (var i=0; i<allSettings.length; i++) {
        var settings = allSettings[i];
        settings.loadFromLocalStorage();
    }
    gameSettings.levelIndex = 0; // Just confusing otherwise
}
function saveSettingsToLocalStorage() {
    for (var i=0; i<allSettings.length; i++) {
        var settings = allSettings[i];
        if (settings.dirty) {
            settings.saveToLocalStorage();
            settings.dirty = false;
        }
    }
}

function stopIfPlaying(sound) {
    if (sound && sound.readyState == 3 && sound.playState == 1) {
        sound.stop();
    }
}
function playIfStopped(sound) {
    if (sound && sound.readyState == 3 && sound.playState == 0) {
        sound.play();
    }
}

function playIfAvailable(sound) {
    if (soundSettings.sfxs && sound && sound.readyState == 3) {
        sound.play();
    }
}

function stopAllSongs() {
    stopIfPlaying(sounds.success.sound);
    stopIfPlaying(sounds.fail.sound);
    stopIfPlaying(sounds.menu.sound);
    stopIfPlaying(sounds.playSong1.sound);
}

function playGameSong() {
    stopIfPlaying(sounds.success.sound);
    stopIfPlaying(sounds.fail.sound);
    stopIfPlaying(sounds.menu.sound);
    playIfStopped(sounds.playSong1.sound);
}

function playMenuSong() {
    stopIfPlaying(sounds.success.sound);
    stopIfPlaying(sounds.fail.sound);
    stopIfPlaying(sounds.playSong1.sound);
    playIfStopped(sounds.menu.sound);
}

function playSuccessSong() {
    stopIfPlaying(sounds.menu.sound);
    stopIfPlaying(sounds.fail.sound);
    stopIfPlaying(sounds.playSong1.sound);
    playIfStopped(sounds.success.sound);
}

function playFailSong() {
    stopIfPlaying(sounds.menu.sound);
    stopIfPlaying(sounds.success.sound);
    stopIfPlaying(sounds.playSong1.sound);
    playIfStopped(sounds.fail.sound);
}

function updateRendererType() {
    if (Modernizr.webgl && !renderSettings.forceContext2D) {
        var webGLOptions = {
            addBloom: renderSettings.addBloom,
            addSimulatedAA: renderSettings.addSimulatedAA,
            addVignette: renderSettings.addVignette,
            enableShadowMap: renderSettings.enableShadowMap
        };
        try {
            GameState.renderer = new WebGLRenderer3D(GameState.canvas, webGLOptions);
            usingWebGL = true;
        } catch (exc) {
            console.log("Webgl initialization failed. Using 2d context renderer.");
            GameState.renderer = new CanvasRenderer3D(GameState.canvas, {});
            renderSettings.forceContext2D = true;
        }
    } else {
        GameState.renderer = new CanvasRenderer3D(GameState.canvas, {});
    }
    setRendererSize();
}

function setRendererSize() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    if (!w || !h) {
        var $document = $("document");
        w = $document.innerWidth();
        h = $document.innerWidth();
    }
    GameState.overCanvas.width = w;
    GameState.overCanvas.height = h;
    GameState.renderer.resized(w, h);

    objectTextWidths = {};
    screenMessageTextWidths = {};
    largeTextWidths = {};

    updateMobileControls();

    stepMenu(true);
}


function setup() {

    loadSettingsFromLocalStorage();

    setupMenus();

    setupGamepads();

    var $canvas = $("#canvas");
    var $overCcanvas = $("#overCanvas");

    var canvas = $canvas[0];
    var overCanvas = $overCcanvas[0];

    GameState.canvas = canvas;
    GameState.overCanvas = overCanvas;
    GameState.overCanvasContext = overCanvas.getContext("2d");


    var startTime = Date.now();

    isTouch = detectMobile();

    var $window = $(window);

    $window.on("resize", function() {
        setRendererSize();
        GameState.renderer.render();
    });

    updateRendererType();

    setupInput();


    var stepTime = -1;
    var millisPerStep = 7;

    function animate(t) {
        requestAnimationFrame( animate );

        if (allResourcesLoaded) {

            if (stepTime == -1) {
                stepTime = t - millisPerStep - 1;

//                GameState.$mainMenu = showModalDialog("Menu", "Are you ready?", {
//                    modal: true,
//                    buttons: {
//                        "Start": function() {
//                            GameState.subState = GameSubState.SHOWING_LEVEL_INTRO;
//                            GameState.counter1 = 0;
//                            $( this ).dialog( "close" );
//                        }
//                    }
//                });

            }

            var diffStepTime = t - stepTime;

            var steps = Math.ceil(diffStepTime / millisPerStep);

            if (soundSettings.music) {
                switch (GameState.subState) {
                    case GameSubState.COMPLETING:
                    case GameSubState.COMPLETING_GAME:
                        playSuccessSong();
                        break;
                    case GameSubState.SHOWING_GAME_COMPLETE:
                        playMenuSong();
                        break;
                    case GameSubState.PLAYING:
                    case GameSubState.PAUSED:
                        playGameSong();
                        break;
                    case GameSubState.SHOWING_LEVEL_INTRO:
                        playMenuSong();
                        break;
                    case GameSubState.DYING:
                        playFailSong();
                        break;
                    case GameSubState.SHOWING_GRAPHICS_SETTINGS_MENU:
                    case GameSubState.SHOWING_SOUND_SETTINGS_MENU:
                    case GameSubState.SHOWING_GAME_SETTINGS_MENU:
                    case GameSubState.SHOWING_SETTINGS_MENU:
                    case GameSubState.SHOWING_GAME_MENU:
                        playMenuSong();
                        break;
                    case GameSubState.SHOWING_LEVEL_COMPLETE:
                        playMenuSong();
                        break;
                }
            } else {
                stopAllSongs();
            }

//            if (GameState.currentLevel == null) {
//                changeLevel(GameState.initialLevelIndex);
//
//                if (GameState.currentLevel == null) {
//                    logit("Failed to load initial level");
//                    GameState.currentLevel = {};
//                }
//            }

            var steppedLevel = true;

            var actualSteps = steps;
            if (steps > 6) {
                actualSteps = 6;
                stepTime = t - actualSteps * millisPerStep;
            }
            if (steps == 0) {
                actualSteps = 1;
//                logit("zero steps");
            }
//            if (Math.random() < 0.01) {
//                logit("Actual steps " + actualSteps);
//            }

            handleMobileInput();
            handleGamepadInput();

            GameState.subStateChanged = false;
            if (GameState.subState != GameState.prevSubState) {
                GameState.subStateChanged = true;
                GameState.prevSubState = GameState.subState;
            }

//            logit("Actual steps " + actualSteps);

            for (var i=0; i<actualSteps; i++) {
                stepTime += millisPerStep;

                stepLevel();

                GameState.step();
                GameState.counter2++;
            }

            stepMenu();

            switch (GameState.subState) {
                case GameSubState.COMPLETING:
                case GameSubState.COMPLETING_GAME:
                case GameSubState.DYING:
                    paintLargeTextEvent();
                    break;
                case GameSubState.PLAYING:
                case GameSubState.PAUSED:
                    GameState.renderer.render(GameState.scene, GameState.cameras[0]);
                    renderOverCanvas();
                    break;
                case GameSubState.SHOWING_SETTINGS_MENU:
                case GameSubState.SHOWING_GAME_MENU:
                    paintGameMenuOverlay();
                    break;
                case GameSubState.SHOWING_LEVEL_INTRO:
                    paintLevelIntro();
//                    GameState.renderer.render(GameState.introScene, GameState.cameras[0]);
                    break;
                case GameSubState.SHOWING_LEVEL_COMPLETE:
                    paintLevelComplete();
//                    GameState.renderer.render(GameState.levelCompleteScene, GameState.cameras[0]);
                    break;
                case GameSubState.SHOWING_GAME_COMPLETE:
                    paintGameComplete();
//                    GameState.renderer.render(GameState.gameCompleteScene, GameState.cameras[0]);
                    break;
            }

            if (steppedLevel) {
                // Only remove justPressed when level has been stepped
                Input.step();

            }
        } else {
            paintLoadingProgress();
        }
    }

    animate();

}



function paintBar(ctx, x, y, w, h, fraction) {
    ctx.strokeRect(x, y, w, h);
    var border = 2;
    ctx.fillRect(x + border, y + border, Math.round(fraction * (w - 2 * border)), h - 2 * border);
}

function paintObjectText(ctx, obj) {
    var object = obj.threeObject;

    var objectPos = object.position.clone();
    var scale = object.scale;
    objectPos.add(new THREE.Vector3(0, -scale.y * 0.5, -scale.z * 0.5));

    var textPos = overProjector.projectVector(objectPos, GameState.cameras[0]);

    var canvas = ctx.canvas;
    var w = canvas.width;
    var h = canvas.height;

    var wh = w * 0.5;
    var hh = h * 0.5;

    var text = obj.text;
    paintNiceCenteredText(ctx, textPos.x * wh + wh, -textPos.y * hh + hh, text, "#111111", objectTextWidths);
}

function paintNiceText(ctx, px, py, text, bgFillStyle) {
    var canvas = ctx.canvas;
    var w = canvas.width;
    var h = canvas.height;
    if (px > -100 && px < w + 100 && py > -100 && py < h + 100) {
        var oldFillStyle = ctx.fillStyle;
        ctx.fillStyle = bgFillStyle;
        ctx.fillText(text, px + 2, py + 2);
        ctx.fillStyle = oldFillStyle;
        ctx.fillText(text, px, py);
    }
}

function paintNiceCenteredText(ctx, px, py, text, bgFillStyle, textWidths) {
    if (text) {
        var textWidth = textWidths[text];
        if (!textWidth) {
            textWidth = ctx.measureText(text).width;
            textWidths[text] = textWidth;
        }
        var tpx = px - textWidth * 0.5;
        var tpy = py;

        paintNiceText(ctx, tpx, tpy, text, bgFillStyle);
    }
}


function worldToScreenPosition(pos) {

    var objectPos = pos.clone();
    var tempPos = overProjector.projectVector(objectPos, GameState.cameras[0]);

    var canvas = GameState.canvas;
    var w = canvas.width;
    var h = canvas.height;

    var wh = w * 0.5;
    var hh = h * 0.5;
    var px = tempPos.x * wh + wh;
    var py = -tempPos.y * hh + hh;

    return new THREE.Vector2(px, py);
}

function getSizeScaler(ctx) {

    var canvas = ctx.canvas;
    var w = canvas.width;
    var h = canvas.height;

    return clamp((w + h) * 0.5 / 800, 0.3, 1.0);
}

function paintHealthBar(ctx, obj) {

    var canvas = ctx.canvas;
    var w = canvas.width;
    var h = canvas.height;

    var object = obj.threeObject;

    var objectPos = object.position.clone();
    var scale = object.scale;
    objectPos.add(new THREE.Vector3(0, -scale.y * 0.5, -scale.z * 0.5));

    var scaler = getSizeScaler(ctx);

    var barScaler = 40 * scaler;

    var barWidth = obj.maxHealth * barScaler;
    var barHeight = 15 * scaler;

    var healthBarPos = overProjector.projectVector(objectPos, GameState.cameras[0]);


    var wh = w * 0.5;
    var hh = h * 0.5;
    var px = healthBarPos.x * wh + wh - barWidth * 0.5;
    var py = -healthBarPos.y * hh + hh;

    var frac = obj.health / obj.maxHealth;

    if (frac > 0.85) {
        ctx.fillStyle = "#00ff00";
    } else if (frac > 0.5) {
        ctx.fillStyle = "#ffff00";
    } else {
        ctx.fillStyle = "#ff0000";
    }
    ctx.strokeStyle = "#444444";

    paintBar(ctx, px, py, barWidth, barHeight, frac);
//    ctx.strokeRect(px, py, barWidth, barHeight);
//    var border = 2;
//    ctx.fillRect(px + border, py + border, Math.round(frac * (barWidth - 2 * border)), barHeight - 2 * border);

//    ctx.strokeText("Player", px, py, 200);

}

function paintGameMenuOverlay() {
    var ctx = GameState.overCanvasContext;
    var canvas = ctx.canvas;

    var scaler = getSizeScaler(ctx);

    var w = canvas.width;
    var h = canvas.height;

    ctx.fillStyle = "#222222";
    ctx.fillRect(0, 0, w, h);

}

function paintLevelIntro() {
    var ctx = GameState.overCanvasContext;
    var canvas = ctx.canvas;

    var w = canvas.width;
    var h = canvas.height;

    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#aaaaaa";
    ctx.fillRect(0, 0, w, h);

}

function paintLevelComplete() {
    var ctx = GameState.overCanvasContext;
    var canvas = ctx.canvas;

    var w = canvas.width;
    var h = canvas.height;

    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#aaaaaa";
    ctx.fillRect(0, 0, w, h);

}

function paintGameComplete() {
    var ctx = GameState.overCanvasContext;
    var canvas = ctx.canvas;

    var w = canvas.width;
    var h = canvas.height;

    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#aaaaaa";
    ctx.fillRect(0, 0, w, h);
}



function paintLoadingProgress() {
    var ctx = GameState.overCanvasContext;
    var canvas = ctx.canvas;

    var w = canvas.width;
    var h = canvas.height;

    var scaler = getSizeScaler(ctx);

    ctx.fillStyle = "#555555";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "#eeeeee";
    ctx.fillStyle = "#eeeeee";
    var fraction = resourcesLoaded / totalResourceCount;
    ctx.font = Math.ceil(20 * scaler) + 'px ' + screenMessageFontFamily;
    ctx.fillText("Loading...", 50 * scaler, 100 * scaler);

    ctx.fillStyle = "#888888";
    ctx.strokeStyle = "#aaaaaa";
    paintBar(ctx, 50 * scaler, 50 * scaler, w - 100 * scaler, 20 * scaler, fraction);


}

function paintLargeTextEvent() {

    var completeText = "";

    var fillStyle = "#eeeeee";
    switch (GameState.subState) {
        case GameSubState.COMPLETING:
            completeText = "GREAT!";
            break;
        case GameSubState.COMPLETING_GAME:
            completeText = "YOU DID IT!";
            break;
        case GameSubState.DYING:
            completeText = "TO LATE!!!";
            fillStyle = "#ee0202";
            break;
    }

    GameState.renderer.render(GameState.scene, GameState.cameras[0]);
    renderOverCanvas();

    var canvas = GameState.overCanvas;
    var ctx = GameState.overCanvasContext;

    var scaler = getSizeScaler(ctx);

    var largeFontSize = Math.ceil(80 * scaler);

    GameState.overCanvasContext.font = largeFontSize + 'px ' + screenMessageFontFamily;
    GameState.overCanvasContext.fillStyle = fillStyle;
    var w = GameState.overCanvas.width;
    var h = GameState.overCanvas.height;
    paintNiceCenteredText(GameState.overCanvasContext, w * 0.5, h * 0.25, completeText, "#111111", largeTextWidths);
}

function renderOverCanvas() {
    var canvas = GameState.overCanvas;
    var ctx = GameState.overCanvasContext;

    if (!overProjector) {
        overProjector = new THREE.Projector();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

//    for (var i=0; i<GameState.players.length; i++) {
//        var player = GameState.players[i];
//        if (!player.isDead) {
//            paintHealthBar(ctx, player);
//        }
//    }
//    for (var i=0; i<GameState.solids.length; i++) {
//        var solid = GameState.solids[i];
//        if (solid.health < solid.maxHealth) {
//            paintHealthBar(ctx, solid);
//        }
//    }
//    for (var i=0; i<GameState.agents.length; i++) {
//        var agent = GameState.agents[i];
//        if (!agent.isPlayer && agent.health < agent.maxHealth) {
//            paintHealthBar(ctx, agent);
//        }
//    }

    var scaler = getSizeScaler(ctx);

    var pickupFontSize = Math.ceil(13 * scaler);

    ctx.font = pickupFontSize + 'px ' + screenMessageFontFamily;
    ctx.fillStyle = "#eeeeee";
    for (var i=0; i<GameState.pickups.length; i++) {
        paintObjectText(ctx, GameState.pickups[i]);
    }

    var screenMessageFontSize = Math.ceil(16 * scaler);

    ctx.font = screenMessageFontSize + 'px ' + screenMessageFontFamily;
    ctx.fillStyle = "#eeeeee";
    for (var i=0; i<GameState.screenMessages.length; i++) {
        var message = GameState.screenMessages[i];
        paintNiceCenteredText(ctx, message.position.x, message.position.y, message.text, "#050505", screenMessageTextWidths);
//        paintObjectText(ctx, GameState.pickups[i]);
    }

//    paintNiceCenteredText(ctx, 400, 400, GameState.playerSteps + " " + GameState.physicsSteps, "#050505", screenMessageTextWidths);

    if (GameState.subState == GameSubState.PLAYING) {
        var timeBarWidth = 400 * scaler;
        var textW = 140 * scaler;
        var textX = 30 * scaler;
        paintNiceText(ctx, textX, 50 * scaler, "Time Left", "#222222");
        ctx.fillStyle = "#eeeeee";
        ctx.strokeStyle = "#ffffff";
        paintBar(ctx, textX + textW + 20 * scaler, 30 * scaler, timeBarWidth, 20 * scaler, GameState.timeFractionLeft);
    }


//    var comboFontSize = Math.ceil(20 * scaler);

//    if (GameState.hitComboTicksLefts[0] > 0) {
//        ctx.font = comboFontSize + 'px ' + screenMessageFontFamily;
//        var frac = GameState.hitComboTicksLefts[0] / HIT_COMBO_TICKS;
//        ctx.fillStyle = "#eeeeee";
//        ctx.strokeStyle = "#ffffff";
////        paintNiceText(ctx, 50, 70, "Hit combo", "#222222");
//        paintBar(ctx, 50 * scaler, 50 * scaler, 100 * scaler, 20 * scaler, frac);
//    }
//
//    if (GameState.killComboTicksLefts[0] > 0) {
//        ctx.font = comboFontSize + 'px ' + screenMessageFontFamily;
//        var frac = GameState.killComboTicksLefts[0] / KILL_COMBO_TICKS;
//        ctx.fillStyle = "#eeeeee";
//        ctx.strokeStyle = "#ffffff";
////        paintNiceText(ctx, 50, 70, "Kill combo", "#222222");
//        paintBar(ctx, 50 * scaler, 80 * scaler, 100 * scaler, 20 * scaler, frac);
//    }

    paintMobileControls(ctx);

}