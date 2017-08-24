

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


var tempStepArr = [];
function stepAll(arr) {
    tempStepArr.length = 0;
    for (var i=0; i<arr.length; i++) {
        var o = arr[i];
        o.step();
        if (o.removeMe) {
            o.removed();
        } else {
            tempStepArr.push(o);
        }
    }
    arr.length = 0;
    addAll(arr, tempStepArr);
}

var killComboLevels = [
    [3, "points", 1000],
    [5, "powerUp", SHIP_HEALTH],
    [10, "points", 5000],
    [15, "powerUp", SHIP_MAX_HEALTH]
];
var hitComboLevels = [
    [10, "points", 100],
    [20, "points", 200],
    [50, "points", 1000],
    [100, "points", 5000],
    [200, "powerUp", SHIP_HEALTH],
    [500, "powerUp", SHIP_FASTER],
    [1000, "powerUp", SHIP_MAX_HEALTH],
    [2000, "powerUp", CANNON_DAMAGE_UP],
    [3000, "powerUp", CANNON_FASTER],
    [4000, "powerUp", CANNON_NEW],
    [5000, "powerUp", BOMB_DAMAGE_UP],
    [6000, "powerUp", BOMB_FASTER],
    [7000, "powerUp", BOMB_NEW]
];

var GameSubState = {
    PLAYING: 0,
    SHOWING_LEVEL_INTRO: 1,
    SHOWING_LEVEL_COMPLETE: 2,
    SHOWING_GAME_COMPLETE: 3,
    COMPLETING: 4,
    DYING: 5,
    COMPLETING_GAME: 6,
    SHOWING_GAME_MENU: 7
};

var GameState = {
    canvas: null,
    $mainMenu: null,
    groundTexture: null,
    hitCount: 0,
    hitComboTicksLeft: 0,
    killCount: 0,
    killComboTicksLeft: 0,
    fireWarnings: 0,
    initialLevelIndex: 0,
    explosionLights: [],
    quickGround: [],
    availableExplosionLights: [],
    playerLight: null,
    directionalLight: null,
    cannonDamageLevels: [0],
    cannonRateLevels: [0],
    bombDamageLevels: [0],
    bombRateLevels: [0],
    speedLevel: 0,
    healthLevel: 0,
    gatheredCannonDamageLevels: [0],
    gatheredCannonRateLevels: [0],
    gatheredBombDamageLevels: [0],
    gatheredBombRateLevels: [0],
    gatheredSpeedLevel: 0,
    gatheredHealthLevel: 0,
    counter1: 0,
    counter2: 0,
    latestMessageTick: 0,
    permanentCounter1: 0,
    subState: GameSubState.SHOWING_GAME_MENU,
    currentLevelName: null,
    currentLevel: null,
    groundLayer: null,
    levelIndex: 1,
    solids: [],
    agents: [],
    particles: [],
    projectiles: [],
    bosses: [],
    flyers: [],
    pickups: [],
    screenMessages: [],
    player: null,
    camera: new THREE.PerspectiveCamera(50, 1, 0.1, 20000),
    cameraStopped: false,
    scene: new THREE.Scene(),
    particleParent: null,
    introScene: new THREE.Scene(),
    completeScene: new THREE.Scene(),
    renderer: null,
    collisionGrid: null,
    didDamage: function() {
        this.hitCount++;
//        logit("Hit count: " + this.hitCount + " " + this.hitComboTicksLeft);
        this.hitComboTicksLeft = HIT_COMBO_TICKS;
        for (var i=0; i<hitComboLevels.length; i++) {
            var level = hitComboLevels[i];
            if (this.hitCount == level[0]) {
                var sp = getGoodScreenMessagePos();
                var message = new ScreenMessage("Hit Combo x" + this.hitCount + "!", sp.x, sp.y);
                GameState.screenMessages.push(message);
                if (level[1] == "powerUp") {
                    givePowerup(level[2]);
                } else if (level[1] == "points") {
                    giveScore(level[2]);
                    sp = getGoodScreenMessagePos();
                    var message = new ScreenMessage("Extra score +" + level[2] + "!", sp.x, sp.y);
                    GameState.screenMessages.push(message);
                }
            }
        }
    },
    killed: function() {
        this.killCount++;
        this.killComboTicksLeft = KILL_COMBO_TICKS;
    },
    clear: function() {
        this.fireWarnings = 0;
        this.scene = new THREE.Scene();
        this.introScene = new THREE.Scene();
        this.completeScene = new THREE.Scene();
        this.hitComboTicksLeft = 0;
        this.hitCount = 0;
        this.killComboTicksLeft = 0;
        this.killCount = 0;
        this.flyers.length = 0;
        this.bosses.length = 0;
        this.agents.length = 0;
        this.particles.length = 0;
        this.projectiles.length = 0;
        this.solids.length = 0;
        this.pickups.length = 0;
        this.screenMessages.length = 0;
        this.counter1 = 0;
        this.counter2 = 1110;
        this.gatheredBombDamageLevels = createFilledArray(this.bombDamageLevels.length, 0);
        this.gatheredBombRateLevels = createFilledArray(this.bombRateLevels.length, 0);
        this.gatheredCannonDamageLevels = createFilledArray(this.cannonDamageLevels.length, 0);;
        this.gatheredCannonRateLevels = createFilledArray(this.cannonRateLevels.length, 0);;
        this.gatheredHealthLevel = 0;
        this.gatheredSpeedLevel = 0;
    },
    step: function() {
        this.permanentCounter1++;
        this.hitComboTicksLeft--;
        if (this.hitComboTicksLeft < 0) {
            this.hitCount = 0;
        }
        this.killComboTicksLeft--;
        if (this.killComboTicksLeft < 0) {
            this.killCount = 0;
        }
    }

};
