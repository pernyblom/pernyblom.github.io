

function getIntroMessage() {
    var introMessage = GameState.currentLevel.properties.introMessage;
    if (!introMessage) {
        introMessage = "Intro message missing for " + GameState.levelIndex;
    }
    var result = "<p>" + introMessage + "</p>";
    return result;
}


var tempStepArr = [];
function stepAll(arr) {
    tempStepArr.length = 0;
    for (var i=0; i<arr.length; i++) {
        var o = arr[i];
        if (o.removeMe) {
            o.removed();
        } else {
            o.step();
            tempStepArr.push(o);
        }
    }
    arr.length = 0;
    addAll(arr, tempStepArr);
}

var GameSubState = {
    PLAYING: 0,
    SHOWING_LEVEL_INTRO: 1,
    SHOWING_LEVEL_COMPLETE: 2,
    SHOWING_GAME_COMPLETE: 3,
    COMPLETING: 4,
    DYING: 5,
    COMPLETING_GAME: 6,
    SHOWING_GAME_MENU: 7,
    SHOWING_SETTINGS_MENU: 8,
    SHOWING_GRAPHICS_SETTINGS_MENU: 9,
    SHOWING_SOUND_SETTINGS_MENU: 10,
    SHOWING_GAME_SETTINGS_MENU: 11,
    PAUSED: 12,
    SHOWING_ABOUT_MENU: 13,
    SHOWING_HOW_TO_PLAY_MENU: 14
};

var GameState = {
    world: null,
    playerSteps: 0,
    physicsSteps: 0,
    playerCount: 2,
    levelSeconds: 60,
    levelCurrentTime: 0,
    timeFractionLeft: 1,
    checkpointCount: 0,
    canvas: null,
    $mainMenu: null,
    groundTexture: null,
    explosionLights: [],
    quickGround: [],
    availableExplosionLights: [],
    directionalLight: null,
    gatheredCheckpoints: {},
    counter1: 0,
    counter2: 0,
    counter3: 0,
    latestMessageTick: 0,
    permanentCounter1: 0,
    subState: GameSubState.SHOWING_GAME_MENU,
    subStateChanged: false,
    prevSubState: -1,
    currentLevelName: null,
    currentLevel: null,
    levelIndex: 0,
    solidBodies: [], // rigid bodies
    solids: [],
    agents: [],
    particles: [],
    projectiles: [],
    bosses: [],
    flyers: [],
    pickups: [],
    screenMessages: [],
    players: [],
    cameras: [new THREE.PerspectiveCamera(50, 1, 0.1, 20000)],
    cameraStopped: false,
    scene: new THREE.Scene(),
    particleParent: null,
    introScene: new THREE.Scene(),
    levelCompleteScene: new THREE.Scene(),
    gameCompleteScene: new THREE.Scene(),
    renderer: null,
    collisionGrid: null,
    init: function() {
    },
    createCannonWorld: function() {
        var world = new CANNON.World();
        world.gravity.set(0,0,-9.82);
        world.broadphase = new CANNON.NaiveBroadphase();
        return world;
    },
    clear: function() {
        this.scene = new THREE.Scene();
        this.introScene = new THREE.Scene();
        this.gameCompleteScene = new THREE.Scene();
        this.world = this.createCannonWorld();
        this.solidBodies.length = 0;
        this.flyers.length = 0;
        this.bosses.length = 0;
        this.agents.length = 0;
        this.players.length = 0;
        this.particles.length = 0;
        this.projectiles.length = 0;
        this.solids.length = 0;
        this.pickups.length = 0;
        this.screenMessages.length = 0;
        this.counter1 = 0;
        this.counter2 = 1110;
        this.checkpointCount = 0;
        this.timeFractionLeft = 1;
        this.levelCurrentTime = 0;
        this.counter3 = 0;
    },
    step: function() {
        this.permanentCounter1++;
        for (var i=0; i<this.playerCount; i++) {
        }
    }

};
