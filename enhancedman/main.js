
//var $debugDiv = null;
//var $debugTextArea = null;

var useWebGL = true;

var $textOverlay;
var $messages;

var logitAlsoDoc = false;

var GameSubState = {
    PLAYING: 0,
    SHOWING_LEVEL_INTRO: 1,
    SHOWING_LEVEL_COMPLETE: 2,
    SHOWING_GAME_COMPLETE: 3,
    COMPLETING: 4,
    DYING: 5,
    COMPLETING_GAME: 6
};

var GameState = {
    fireWarnings: 0,
    initialLevelIndex: 1,
    goalLights: [],
    availableGoalLights: [],
    playerLight: null,
    directionalLight: null,
    jumpLevel: 0,
    accelerationLevel: 0,
    aerialControlLevel: 0,
    healthLevel: 0,
    gatheredJumpLevel: 0,
    gatheredAccelerationLevel: 0,
    gatheredAerialControlLevel: 0,
    gatheredHealthLevel: 0,
    counter1: 0,
    counter2: 0,
    latestMessageTick: 0,
    permanentCounter1: 0,
    subState: GameSubState.SHOWING_LEVEL_INTRO,
    currentLevelName: null,
    currentLevel: null,
    levelIndex: 1,
    solids: [],
    agents: [],
    particles: [],
    projectiles: [],
    goals: [],
    checkpoints: [],
    pickups: [],
    player: null,
    camera: null,
    scene: null,
    introScene: null,
    completeScene: null,
    renderer: null,
    collisionGrid: null,
    clearHard: function() {
        this.jumpLevel = 0;
        this.accelerationLevel = 0;
        this.aerialControlLevel = 0;
        this.healthLevel = 0;
        this.clear();
    },
    clear: function() {
        this.fireWarnings = 0;
        this.scene = new THREE.Scene();
        this.introScene = new THREE.Scene();
        this.completeScene = new THREE.Scene();
        this.goals.length = 0;
        this.checkpoints.length = 0;
        this.agents.length = 0;
        this.particles.length = 0;
        this.projectiles.length = 0;
        this.solids.length = 0;
        this.pickups.length = 0;
        this.counter1 = 0;
        this.counter2 = 1110;
        this.gatheredAccelerationLevel = 0;
        this.gatheredAerialControlLevel = 0;
        this.gatheredHealthLevel = 0;
        this.gatheredJumpLevel = 0;
    },
    step: function() {
        this.permanentCounter1++;
    }

};


function logit(data) {
    console.log(data);
    if (logitAlsoDoc) {
        logitDoc(data);
    }
}
function logitRnd(data, rnd) {
    if (Math.random() < rnd) {
        logit(data);
    }
}
function logitDocRnd(data, rnd) {
    if (Math.random() < rnd) {
        logitDoc(data);
    }
}

function logitDoc(data) {
//    $debugTextArea[0].innerHTML += data + "\n";
}

function stepAll(arr) {
    var toRemove = [];
    for (var i=0; i<arr.length; i++) {
        var o = arr[i];
        o.step();
        if (o.removeMe) {
            toRemove.push(o);
            o.removed();
        }
    }
    arrayDeleteAll(arr, toRemove);
}


function getIntroMessage() {
    var introMessage = GameState.currentLevel.properties.introMessage;
    if (!introMessage) {
        introMessage = "Intro message missing for " + GameState.levelIndex;
    }
    var result = "<p>" + introMessage + "</p>";
    if (GameState.levelIndex == 1) {
        return result;
    } else {
        return result + "<br />" +
            "<p>ACCELERATION LEVEL: " + (GameState.accelerationLevel + 1) + "</p>" +
            "<p>AERIAL LEVEL: " + (GameState.aerialControlLevel + 1) + "</p>" +
            "<p>JUMP LEVEL: " + (GameState.jumpLevel + 1) + "</p>" +
            "<p>HEALTH LEVEL: " + (GameState.healthLevel + 1) + "</p>";
    }
}

var stepTime = -1;
var millisPerStep = 15;

function animate(t) {
    requestAnimationFrame(animate);

    stepResources();

    if (allResourcesLoaded) {

        if (stepTime == -1) {
            stepTime = t - millisPerStep - 1;
        }

        var diffStepTime = t - stepTime;

        var steps = Math.ceil(diffStepTime / millisPerStep);

        if (allSoundsLoaded) {
            var successSong = resources["successSong"];
            var mainSong = resources["mainSong"];
            var failSong = resources["failSong"];

            switch (GameState.subState) {
                case GameSubState.COMPLETING:
                case GameSubState.COMPLETING_GAME:
                    if (successSong.playState == 0 && GameState.counter2 > 500) {
                        GameState.counter2 = 0;
                        successSong.play();
                    }
                    if (mainSong.playState == 1 && !mainSong.muted) {
                        mainSong.mute();
                    }
                    break;
                case GameSubState.SHOWING_GAME_COMPLETE:
                case GameSubState.PLAYING:
                case GameSubState.SHOWING_LEVEL_INTRO:
                    if (mainSong.playState == 0) {
                        mainSong.play();
                    } else if (mainSong.muted) {
                        mainSong.unmute();
                    }
                    if (successSong.playState == 1) {
                        successSong.stop();
                    }
                    if (failSong.playState == 1) {
                        failSong.stop();
                    }
                    break;
                case GameSubState.DYING:
                    if (failSong.playState == 0) {
                        failSong.play();
                    }
                    if (mainSong.playState == 1 && !mainSong.muted) {
                        mainSong.mute();
                    }
                    break;
                case GameSubState.SHOWING_LEVEL_COMPLETE:
                    break;
            }
        }

        var changedOverlay = false;

        if (GameState.currentLevel == null) {
            changeLevel(GameState.initialLevelIndex);
            $textOverlay.show();
            $textOverlay.empty();
            $textOverlay.append($(getIntroMessage()));
            changedOverlay = true;
        }

        var oldSubState = GameState.subState;

        var steppedLevel = true;

        var actualSteps = steps;
        if (steps > 6) {
            actualSteps = 6;
            stepTime = t - actualSteps * millisPerStep;
        }
        for (var i=0; i<actualSteps; i++) {
            stepTime += millisPerStep;
            stepLevel();

            // Remove stuff from the messages
            if (GameState.latestMessageTick < GameState.permanentCounter1 - 200) {
                var $children = $messages.children();
                if ($children.size() > 0) {
                    $children.first().detach();
                    GameState.latestMessageTick = GameState.permanentCounter1;
                }
            }

            GameState.step();
            GameState.counter2++;

            if (oldSubState != GameState.subState) {
                switch (GameState.subState) {
                    case GameSubState.PLAYING:
                        $textOverlay.hide();
                        break;
                    case GameSubState.COMPLETING:
                        $textOverlay.show();
                        $textOverlay.empty();
                        $textOverlay.append($("<p>Well Done!</p>"));
                        changedOverlay = true;
                        break;
                    case GameSubState.DYING:
                        $textOverlay.show();
                        $textOverlay.empty();
                        $textOverlay.append($("<p>Sorry... Try again!</p>"));
                        changedOverlay = true;
                        break;
                    case GameSubState.COMPLETING_GAME:
                        $textOverlay.show();
                        $textOverlay.empty();
                        $textOverlay.append($("<p>FANTASTIC! YOU MADE IT!</p>"));
                        changedOverlay = true;
                        break;
                    case GameSubState.SHOWING_LEVEL_INTRO:
                        $textOverlay.show();
                        $textOverlay.empty();
                        $textOverlay.append($(getIntroMessage()));
                        changedOverlay = true;
                        break;
                    case GameSubState.SHOWING_LEVEL_COMPLETE:
                        $textOverlay.show();
                        $textOverlay.empty();
                        var completeMessage = GameState.currentLevel.properties.completeMessage;
                        if (!completeMessage) {
                            completeMessage = "Complete message missing for " + GameState.levelIndex;
                        }
                        $textOverlay.append($("<p>" + completeMessage +  "</p>"));
                        changedOverlay = true;
                        break;
                    case GameSubState.SHOWING_GAME_COMPLETE:
                        $textOverlay.show();
                        $textOverlay.empty();
                        $textOverlay.append($("<p>Thanks for playing!</p>" +
                            "<p>This game was made by Per Nyblom for Ludum Dare #24</p>" +
                            "<p>Thanks to all participants!</p>"));
                        changedOverlay = true;
                        break;
                }
            }
            if (changedOverlay) {
                var $document = $(window.document);
                var canvasWidth = Math.max(16, $document.innerWidth() - 4);
                $textOverlay.css("left", (Math.round((canvasWidth - $textOverlay.innerWidth()) * 0.5)) + "px");
            }
        }
        switch (GameState.subState) {
            case GameSubState.COMPLETING:
            case GameSubState.COMPLETING_GAME:
            case GameSubState.DYING:
            case GameSubState.PLAYING:
                GameState.renderer.render(GameState.scene, GameState.camera);
                break;
            case GameSubState.SHOWING_LEVEL_INTRO:
                GameState.renderer.render(GameState.introScene, GameState.camera);
                break;
            case GameSubState.SHOWING_LEVEL_COMPLETE:
                GameState.renderer.render(GameState.completeScene, GameState.camera);
                break;
            case GameSubState.SHOWING_GAME_COMPLETE:
                GameState.renderer.render(GameState.completeScene, GameState.camera);
                break;
        }



        if (steppedLevel) {
            // Only remove justPressed when level has been stepped
            Input.step();
        }
    }
}

function gatherElements() {
    $textOverlay = $("#textoverlay");
    $messages = $("#messages");
//    $debugTextArea = $("#debugtextarea");
}


var soundsLoaded = 0;
var allSoundsLoaded = false;
var soundInfos = [
    {
        id: "pickup1",
        url: "pickup.mp3"
    },
    {
        id: "pickup2",
        url: "pickup2.mp3"
    },
    {
        id: "mainSong",
        url: "song.mp3"
    },
    {
        id: "failSong",
        url: "fail.mp3"
    },
    {
        id: "successSong",
        url: "success.mp3"
    }
];

function createSound(id, url) {
    var theSound = soundManager.createSound({
        id: id,
        url: url,
        autoLoad: true,
        volume: 40,
        onload: function() {
            soundsLoaded++;
//            logit("loaded sound " + id);
            if (soundsLoaded == soundInfos.length) {
                allSoundsLoaded = true;
            }
        }
    });
    resources[id] = theSound;
}

function setupSound() {
    soundManager.setup({
        url: '',
        flashVersion: 9, // optional: shiny features (default = 8)
        useFlashBlock: false, // optionally, enable when you're ready to dive in/**
        onready: function() {


            for (var i=0; i<soundInfos.length; i++) {
                var s = soundInfos[i];
                createSound(s.id, s.url);
            }
        }
    });
}



function setupAndRun() {

    gatherElements();

    setupRenderer();

    setupSound();

    setupInput();

    loadResources();

    animate();
}