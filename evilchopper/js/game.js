

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
    SHOWING_GAME_MENU: 7,
    SHOWING_SETTINGS_MENU: 8,
    SHOWING_GRAPHICS_SETTINGS_MENU: 9,
    SHOWING_SOUND_SETTINGS_MENU: 10,
    SHOWING_GAME_SETTINGS_MENU: 11,
    PAUSED: 12
};

var GameState = {
    playerCount: 2,
    canvas: null,
    $mainMenu: null,
    groundTexture: null,
    hitCounts: [],
    hitComboTicksLefts: [],
    killCounts: [],
    killComboTicksLefts: [],
    initialLevelIndex: 0,
    explosionLights: [],
    quickGround: [],
    availableExplosionLights: [],
    directionalLight: null,
    cannonDamageLevels: [],
    cannonRateLevels: [],
    bombDamageLevels: [],
    bombRateLevels: [],
    speedLevels: [],
    healthLevels: [],
    gatheredCannonDamageLevels: [],
    gatheredCannonRateLevels: [],
    gatheredBombDamageLevels: [],
    gatheredBombRateLevels: [],
    gatheredSpeedLevels: [],
    gatheredHealthLevels: [],
    counter1: 0,
    counter2: 0,
    latestMessageTick: 0,
    permanentCounter1: 0,
    subState: GameSubState.SHOWING_GAME_MENU,
    subStateChanged: false,
    prevSubState: -1,
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
    players: [],
    camera: new THREE.PerspectiveCamera(50, 1, 0.1, 20000),
    cameraStopped: false,
    scene: new THREE.Scene(),
    particleParent: null,
    introScene: new THREE.Scene(),
    levelCompleteScene: new THREE.Scene(),
    gameCompleteScene: new THREE.Scene(),
    renderer: null,
    collisionGrid: null,
    didDamage: function(playerIndex) {
        this.hitCount++;
//        logit("Hit count: " + this.hitCount + " " + this.hitComboTicksLeft);
        this.hitComboTicksLefts[playerIndex] = HIT_COMBO_TICKS;
        for (var i=0; i<hitComboLevels.length; i++) {
            var level = hitComboLevels[i];
            if (this.hitCounts[playerIndex] == level[0]) {
                var sp = getGoodScreenMessagePos(playerIndex);
                var message = new ScreenMessage("Hit Combo x" + this.hitCount + "!", sp.x, sp.y);
                GameState.screenMessages.push(message);
                if (level[1] == "powerUp") {
                    givePowerup(level[2], playerIndex);
                } else if (level[1] == "points") {
                    giveScore(level[2], playerIndex);
                    sp = getGoodScreenMessagePos(playerIndex);
                    var message = new ScreenMessage("Extra score +" + level[2] + "!", sp.x, sp.y);
                    GameState.screenMessages.push(message);
                }
            }
        }
    },
    killed: function(playerIndex) {
        this.killCounts[playerIndex]++;
        this.killComboTicksLefts[playerIndex] = KILL_COMBO_TICKS;
    },
    init: function() {
        resetAllUpgrades();
    },
    clear: function() {
        this.scene = new THREE.Scene();
        this.introScene = new THREE.Scene();
        this.gameCompleteScene = new THREE.Scene();
        this.hitComboTicksLefts = createFilledArray(this.playerCount, 0);
        this.hitCounts = createFilledArray(this.playerCount, 0);
        this.killComboTicksLefts = createFilledArray(this.playerCount, 0);
        this.killCounts = createFilledArray(this.playerCount, 0);
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

        function createGatheredLevels(levels) {
            var result = [];
            for (var i=0; i<levels.length; i++) {
                result.push(createFilledArray(levels[i].length, 0));
            }
            return result;
        }

        this.gatheredBombDamageLevels = createGatheredLevels(this.bombDamageLevels);
        this.gatheredBombRateLevels = createGatheredLevels(this.bombRateLevels);
        this.gatheredCannonDamageLevels = createGatheredLevels(this.cannonDamageLevels);
        this.gatheredCannonRateLevels = createGatheredLevels(this.cannonRateLevels);
        this.gatheredHealthLevels = createFilledArray(this.playerCount, 0);
        this.gatheredSpeedLevels = createFilledArray(this.playerCount, 0);
    },
    step: function() {
        this.permanentCounter1++;
        for (var i=0; i<this.playerCount; i++) {
            this.hitComboTicksLefts[i]--;
            if (this.hitComboTicksLefts[i] < 0) {
                this.hitCounts[i] = 0;
            }
            this.killComboTicksLefts[i]--;
            if (this.killComboTicksLefts[i] < 0) {
                this.killCounts[i] = 0;
            }
        }
    }

};
