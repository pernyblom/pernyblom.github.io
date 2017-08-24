
var GRID_SIZE = 32;

var PLAYER_WIDTH = 22;
var PLAYER_HEIGHT = 40;

var HUMANOID_WIDTH = 22;
var HUMANOID_HEIGHT = 40;


var PLAYER_Z = GRID_SIZE * 4;

var CAMERA_SPEED = 0.65;

var CAMERA_STOP_Y = -25 * GRID_SIZE;

var CANNON_FASTER = "cannonFaster";
var CANNON_DAMAGE_UP = "cannonDamageUp";
var CANNON_NEW = "cannonNew";
var BOMB_FASTER = "bombFaster";
var BOMB_DAMAGE_UP = "bombDamageUp";
var BOMB_NEW = "bombNew";
var SHIP_FASTER = "shipFaster";
var SHIP_HEALTH = "shipHealth";
var SHIP_MAX_HEALTH = "shipMaxHealth";

var QUICK_GROUND_STEPS = 4;

var HIT_COMBO_TICKS = 100;
var KILL_COMBO_TICKS = 200;

var PIXELS_PER_CELL = 3;

var powerupTexts = {};

powerupTexts[CANNON_FASTER] = "Cannon Fire Rate";
powerupTexts[CANNON_DAMAGE_UP] = "Cannon Damage";
powerupTexts[CANNON_NEW] = "Additional Cannon";
powerupTexts[BOMB_FASTER] =
    "Bomb Rate";
powerupTexts[BOMB_DAMAGE_UP] =
    "Bomb Damage";
powerupTexts[BOMB_NEW] =
    "Additional Bomb";
powerupTexts[SHIP_FASTER] =
    "Speed";
powerupTexts[SHIP_HEALTH] =
    "Health";
powerupTexts[SHIP_MAX_HEALTH] =
    "Max Health";
