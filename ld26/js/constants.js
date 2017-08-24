
var STANDARD_LEVEL_COUNT = 10;

var GRID_CELL_SIZE = 40;

var PLAYER_WIDTH = 3;
var PLAYER_HEIGHT = 2;
var PLAYER_LENGTH = 5;

var SUSPENSION_LENGTH = 1.5;

var ATLAS_SIZE = 32;

var SIMULATION_SPEED = 120;

var COUNTDOWN = 300;

// Tile ids
var ROAD_NS = 1;
var ROAD_EW = 2;
var ROAD_CROSSING = 3;
var ROAD_TURN_SE = 1 * ATLAS_SIZE + 1;
var ROAD_TURN_WS = 1 * ATLAS_SIZE + 2;
var ROAD_TURN_NW = 2 * ATLAS_SIZE + 2;
var ROAD_TURN_EN = 2 * ATLAS_SIZE + 1;

var HOUSE_1 = 8 * ATLAS_SIZE + 1;

var GRASS = 4;
var CHECKPOINT = 7;
var INVISIBLE = 8;

var RAMP_W = 5 * ATLAS_SIZE + 1;
var RAMP_E = 5 * ATLAS_SIZE + 3;
var RAMP_S = 5 * ATLAS_SIZE + 4;
var RAMP_N = 7 * ATLAS_SIZE + 4;

var HIGHER_EW = 5 * ATLAS_SIZE + 2;
var HIGHER_NS = 6 * ATLAS_SIZE + 4;

var HIGHER_CROSSING = 6 * ATLAS_SIZE + 5;

var HIGHER_TURN_SE = 6 * ATLAS_SIZE + 1;
var HIGHER_TURN_WS = 6 * ATLAS_SIZE + 2;
var HIGHER_TURN_NW = 7 * ATLAS_SIZE + 2;
var HIGHER_TURN_EN = 7 * ATLAS_SIZE + 1;

var TUNNEL_EW = 6 * ATLAS_SIZE + 3;
var TUNNEL_NS = 7 * ATLAS_SIZE + 3;

var PLAYER_N = 3 * ATLAS_SIZE + 1;
var PLAYER_W = 3 * ATLAS_SIZE + 2;
var PLAYER_S = 3 * ATLAS_SIZE + 3;
var PLAYER_E = 3 * ATLAS_SIZE + 4;

var GOAL_N = 4 * ATLAS_SIZE + 1;
var GOAL_W = 4 * ATLAS_SIZE + 2;
var GOAL_S = 4 * ATLAS_SIZE + 3;
var GOAL_E = 4 * ATLAS_SIZE + 4;

var WALL_UP = 4 * ATLAS_SIZE + 6;
var WALL_LEFT = 4 * ATLAS_SIZE + 7;
var WALL_RIGHT = 4 * ATLAS_SIZE + 8;
var WALL_DOWN = 4 * ATLAS_SIZE + 9;

