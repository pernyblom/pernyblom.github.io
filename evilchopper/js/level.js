
var groundPerlin = new ClassicalNoise(new MersenneTwister(39463));

function updateCamera() {
    var plCenterPos = new THREE.Vector3();

    var alivePlayers = 0;
    for (var i=0; i<GameState.playerCount; i++) {
        var player = GameState.players[i];
        if (!player.isDead) {
            alivePlayers++;
            plCenterPos.addSelf(player.threeObject.position);
        }
    }
    if (alivePlayers > 0) {
        plCenterPos.multiplyScalar(1.0 / alivePlayers);
    } else {
        plCenterPos.copy(GameState.camera.lookAtPos);
    }

//    logit("Alive count " + alivePlayers + " " + JSON.stringify(plCenterPos));

    var camPos = GameState.camera.position;

//        if (GameState.playerLight) {
//            var lightPosition = GameState.playerLight.position;
//            lightPosition.x = plPos.x;
//            lightPosition.y = plPos.y + 50;
//            lightPosition.z = 200;
//        }

    if (GameState.directionalLight) {
        var plPos = GameState.players[0].threeObject.position;
        GameState.directionalLight.position.copy(plPos.clone().addSelf(new THREE.Vector3(-1, 1, 2).normalize().multiplyScalar(2000)));
//            GameState.directionalLight.target.position.copy(plPos);
    }
    var camY = camPos.y;

    var canvas = GameState.canvas;
    var w = canvas.width;
    var h = canvas.height;

    var aspect = w / h;

    GameState.cameraStopped = camY > CAMERA_STOP_Y;
    if (!GameState.cameraStopped) {
        camY += CAMERA_SPEED;
    }
//    logit(camY);


//    logit("plPos " + plPos.x + " " + plPos.y);

    var yOffset = GRID_SIZE * 2;
    var zOffset = 500;

    var targetCamPos = new THREE.Vector3(
        plCenterPos.x,
        camY,
        zOffset);
    var targetLookAtPos = new THREE.Vector3(targetCamPos.x, camY, 0);

    if (!GameState.camera.lookAtPos) {
        GameState.camera.lookAtPos = targetLookAtPos;
    }
    var currentLookAtPos = GameState.camera.lookAtPos;

    var factor = 0.95;
    var invFactor = 1.0 - factor;

    var camX = camPos.x * factor + targetCamPos.x * invFactor;


    var maxBorderDist = clamp(5 * GRID_SIZE * aspect, 2 * GRID_SIZE, 10 * GRID_SIZE);
    if (camX < maxBorderDist) {
        camX = maxBorderDist;
    } else if (camX > GameState.groundLayer.width * GRID_SIZE - maxBorderDist) {
        camX = GameState.groundLayer.width * GRID_SIZE - maxBorderDist;
    }

    var newCamPos = new THREE.Vector3(camX,
        camY,
        camPos.z * factor + targetCamPos.z * invFactor);
    var newLookAtPos = new THREE.Vector3(camX,
        camY + 8 * GRID_SIZE,
        currentLookAtPos.z * factor + targetLookAtPos.z * invFactor);

    camPos.x = newCamPos.x;
    camPos.y = newCamPos.y;
    camPos.z = newCamPos.z;
    GameState.camera.lookAt(newLookAtPos);
    GameState.camera.lookAtPos = newLookAtPos;
}

function upgradeArr(levels, gatheredLevels) {
    var newArr = [];
    for (var i=0; i<Math.max(levels.length, gatheredLevels.length); i++) {
        var total = (levels[i] ? levels[i] : 0) + (gatheredLevels[i] ? gatheredLevels[i] : 0);
        newArr[i] = total;
    }
    levels.length = 0;
    for (var i=0; i<newArr.length; i++) {
        levels[i] = newArr[i];
    }
}

function upgradeArrs(levels, gatheredLevels) {
    for (var i=0; i<levels.length; i++) {
        upgradeArr(levels[i], gatheredLevels[i]);
    }
}

function resetAllUpgrades() {
    GameState.bombDamageLevels = createFilledArrayWithCopyValue(GameState.playerCount, [0]);
    GameState.bombRateLevels = createFilledArrayWithCopyValue(GameState.playerCount, [0]);
    GameState.cannonDamageLevels = createFilledArrayWithCopyValue(GameState.playerCount, [0]);
    GameState.cannonRateLevels = createFilledArrayWithCopyValue(GameState.playerCount, [0]);
    GameState.healthLevels = createFilledArray(GameState.playerCount, 0);
    GameState.speedLevels = createFilledArray(GameState.playerCount, 0);
}

function upgradeEverything() {
    upgradeArrs(GameState.bombDamageLevels, GameState.gatheredBombDamageLevels);
    upgradeArrs(GameState.bombRateLevels, GameState.gatheredBombRateLevels);
    upgradeArrs(GameState.cannonDamageLevels, GameState.gatheredCannonDamageLevels);
    upgradeArrs(GameState.cannonRateLevels, GameState.gatheredCannonRateLevels);
    for (var i=0; i<GameState.playerCount; i++) {
        GameState.healthLevels[i] += GameState.gatheredHealthLevels[i];
        GameState.speedLevels[i] += GameState.gatheredSpeedLevels[i];
    }
}

function stepLevel() {
    var level = GameState.currentLevel;

    var doStep = false;
    switch (GameState.subState) {
        case GameSubState.SHOWING_GAME_MENU:
            GameState.counter1++;
            break;
        case GameSubState.COMPLETING:
            GameState.counter1++;
            if (GameState.counter1 > 250 || Input.mouseJustPressed || Input.wasPressed(Input.ENTER)|| Input.wasPressed(Input.ESCAPE) || Input.wasPressed(Input.SPACE)) {
                GameState.subState = GameSubState.SHOWING_LEVEL_COMPLETE;
                GameState.counter1 = 0;
//                logit("Increasing levels...");
                upgradeEverything();
            }
            doStep = true;
            break;
        case GameSubState.DYING:
            GameState.counter1++;
            if (GameState.counter1 > 250 || Input.mouseJustPressed || Input.wasPressed(Input.ENTER)|| Input.wasPressed(Input.ESCAPE) || Input.wasPressed(Input.SPACE)) {
                GameState.subState = GameSubState.SHOWING_LEVEL_INTRO;
                GameState.counter1 = 0;
                changeLevel(GameState.levelIndex);
            }
            doStep = true;
            break;
        case GameSubState.COMPLETING_GAME:
            GameState.counter1++;
            if (GameState.counter1 > 400) {
                GameState.subState = GameSubState.SHOWING_GAME_COMPLETE;
                GameState.counter1 = 0;
                resetAllUpgrades();
            }
            doStep = true;
            break;
        case GameSubState.PLAYING:
            var allDead = GameState.bosses.length > 0;
            for (var i=0; i<GameState.bosses.length; i++) {
                var boss = GameState.bosses[i];
                if (!boss.isDead) {
                    allDead = false;
                    break;
                }
            }
            if (allDead) {
                if (levelArr[GameState.levelIndex + 1]) {
//                    logit("Switching level to " + ("level" + (GameState.levelIndex + 1)));
                    GameState.subState = GameSubState.COMPLETING;
                } else {
                    GameState.subState = GameSubState.COMPLETING_GAME;
                }
                GameState.counter1 = 0;
            }
            var allPlayersDead = true;
            for (var i=0; i<GameState.playerCount; i++) {
                if (!GameState.players[i].isDead) {
                    allPlayersDead = false;
                }
            }
            if (allPlayersDead) {
                GameState.subState = GameSubState.DYING;
                GameState.counter1 = 0;
            }
            doStep = true;

            if (Input.wasPressed(Input.ESCAPE)) {
                GameState.subState = GameSubState.PAUSED;
            }
            break;
        case GameSubState.PAUSED:
            break;
        case GameSubState.SHOWING_LEVEL_INTRO:
            GameState.counter1++;
            break;
        case GameSubState.SHOWING_LEVEL_COMPLETE:
            GameState.counter1++;
            break;
        case GameSubState.SHOWING_GAME_COMPLETE:
            GameState.counter1++;
            if (GameState.counter1 > 10 && (Input.mouseJustPressed || Input.wasPressed(Input.ESCAPE))) {
                // Load a new level if available or go to game complete
            }
            break;
    }

    if (doStep) {

//        logit("Stepping level " + GameState.agents);
        stepAll(GameState.agents);
        stepAll(GameState.particles);
        stepAll(GameState.projectiles);
        stepAll(GameState.solids);
        stepAll(GameState.pickups);
        stepAll(GameState.screenMessages);

        updateCamera();
    }

}

function addNewObjs(newObjs, obj, list) {
    for (var j=0; j<newObjs.length; j++) {
        var newObj = newObjs[j];
        if (newObj.setPosition) {
//                        logit("Setting obj pos " + obj.type + " to ");
//                        logit(obj);
            var objZ = obj.z;
            if (objZ === undefined) {
                objZ = 0;
            }
            var w = obj.width;
            var h = obj.height;
            var d = obj.depth;
            if (d === undefined) {
                d = Math.min(w, h);
            }

            var pos = {x: obj.x + w * 0.5, y: -obj.y - h * 0.5, z: objZ};
            newObj.setPosition(pos);

            if (newObj instanceof Player) {
                logit("SEtting player pos to " + JSON.stringify(pos));
            }

            newObj.setScale({x: w, y: h, z: d});
            list.push(newObj);
        } else {
            logit("Failed to set position for:");
            logit(newObj);
        }
    }
}



function changeLevel(levelIndex) {
    var levelName = "level" + levelIndex;
    var level = levelArr[levelIndex];

//    $messages.empty();

//    GameState.scene = new THREE.Scene();

    GameState.playerCount = gameSettings.playerCount;
    GameState.levelIndex = levelIndex;
    if (levelIndex == 0) {
        logit("Initializing game state")
        GameState.init();
    }
    GameState.clear();

    var directionalLightIntensity = 0.5;

    GameState.directionalLight = new THREE.DirectionalLight( 0xffffff, directionalLightIntensity );

    if (renderSettings.lightQuality >= Quality.HIGH) {
        GameState.explosionLights = [];
        var light = new THREE.PointLight(0xffff00, 2, GRID_SIZE * 10);
        GameState.explosionLights.push(light);
    }

    GameState.availableExplosionLights = [];
    for (var i=0; i<GameState.explosionLights.length; i++) {
        var el = GameState.explosionLights[i];
        el.position.set(-9999, 9999, 9999);
        GameState.scene.add(el);
        GameState.availableExplosionLights.push(el);
    }

    if (GameState.renderer instanceof WebGLRenderer3D) {
        var dl = GameState.directionalLight;
        dl.castShadow = true;
        dl.shadowCameraNear = 0.2;
        dl.shadowCameraFar = 10000;

        var shadowSize = 1000;
        dl.shadowCameraLeft = -shadowSize;
        dl.shadowCameraRight = shadowSize;
        dl.shadowCameraTop = shadowSize;
        dl.shadowCameraBottom = -shadowSize;
    }

    GameState.directionalLight.position.set(1, 1, 1).normalize();
    GameState.scene.add(GameState.directionalLight);


    var levelWidthCells = 0;
    var levelHeightCells = 0;

    for (var k=0; k<level.layers.length; k++) {
        var layer = level.layers[k];

        var layerData = layer.data;
        var layerName = layer.name;
        if (layerData) {
            if (layerName == "ground") {
                GameState.groundLayer = layer;
                var water = createWater(layer);
                GameState.scene.add(water);
            }
        }
    }

    var newObjList = [];

    for (var k=0; k<level.layers.length; k++) {
        var layer = level.layers[k];

        var layerName = layer.name;

        var layerHeight = layer.height;
        var layerWidth = layer.width;

        levelWidthCells = Math.max(levelWidthCells, layerWidth);
        levelHeightCells = Math.max(levelHeightCells, layerHeight);

        var layerDepth = 0;
        if (layerName == "objects") {
            var collisionGrid = new CollisionGrid(layerWidth, layerHeight);
            GameState.collisionGrid = collisionGrid;
        }

        var layerData = layer.data;

        var layerObjects = layer.objects;

        if (layerObjects) {


            for (var i=0; i<layerObjects.length; i++) {
                var obj = layerObjects[i];

                var newObjs = [];
                switch (obj.type) {
                    case "house1":
                        var o = new House1();
                        o.dropsPowerups = [
                            {data: CANNON_DAMAGE_UP, likelihood: 1},
                            {data: CANNON_FASTER, likelihood: 1},
                            {data: BOMB_DAMAGE_UP, likelihood: 1},
                            {data: BOMB_FASTER, likelihood: 1},
                            {data: SHIP_HEALTH, likelihood: 1},
                            {data: SHIP_FASTER, likelihood: 1}
                        ];
                        newObjs.push(o);
                        obj.depth = obj.properties.height * GRID_SIZE;
                        obj.z = obj.depth * 0.5;
                        GameState.solids.push(o);
                        break;
                    case "house2":
                        var o = new House2();
                        o.dropsPowerups = [
                            {data: CANNON_DAMAGE_UP, likelihood: 1},
                            {data: CANNON_FASTER, likelihood: 1},
                            {data: BOMB_DAMAGE_UP, likelihood: 1},
                            {data: SHIP_HEALTH, likelihood: 1},
                            {data: BOMB_FASTER, likelihood: 1},
                            {data: SHIP_FASTER, likelihood: 1}
                        ];

                        obj.depth = obj.properties.height * GRID_SIZE;
                        obj.z = obj.depth * 0.5;
                        newObjs.push(o);
                        GameState.solids.push(o);
                        break;
                }
                addNewObjs(newObjs, obj, newObjList);
            }

            function moverSortValue() {
                return -100;
            }


            for (var i=0; i<layerObjects.length; i++) {
                var obj = layerObjects[i];

                var powerupText = powerupTexts[obj.type]; // "Powerup";
                if (!powerupText) {
                    powerupText = "Powerup";
                }
                var newObjs = [];

                var callAddNewObjs = true;
                switch (obj.type) {
                    case "flyingEnemy1":
                        obj.z = PLAYER_Z;
                        var o = new Chopper(0);
                        o.getSortValue = moverSortValue;
                        o.dropsPowerups = [
                            {data: CANNON_DAMAGE_UP, likelihood: 1},
                            {data: CANNON_FASTER, likelihood: 1},
                            {data: BOMB_DAMAGE_UP, likelihood: 1},
                            {data: BOMB_FASTER, likelihood: 1},
                            {data: SHIP_HEALTH, likelihood: 1},
                            {data: SHIP_FASTER, likelihood: 1}
                        ];
                        newObjs.push(o);
                        GameState.agents.push(o);
                        GameState.flyers.push(o);
                        break;
                    case "flyingEnemy2":
                        obj.z = PLAYER_Z;
                        var o = new Chopper(1);
                        o.getSortValue = moverSortValue;
                        o.dropsPowerups = [
                            {data: SHIP_MAX_HEALTH, likelihood: 1},
                            {data: CANNON_DAMAGE_UP, likelihood: 1},
                            {data: CANNON_FASTER, likelihood: 1},
                            {data: BOMB_DAMAGE_UP, likelihood: 1},
                            {data: BOMB_FASTER, likelihood: 1},
                            {data: SHIP_HEALTH, likelihood: 1},
                            {data: SHIP_FASTER, likelihood: 1}
                        ];
                        newObjs.push(o);
                        GameState.agents.push(o);
                        GameState.flyers.push(o);
                        break;
                    case "groundEnemy1":
                        obj.z = 0.5 * obj.width + getGroundHeightAt(obj.x, -obj.y, GameState.groundLayer); // PLAYER_Z;
                        var o = new DefenceTower(0);
                        o.getSortValue = moverSortValue;
                        o.dropsPowerups = [
                            {data: CANNON_DAMAGE_UP, likelihood: 1},
                            {data: CANNON_FASTER, likelihood: 1},
                            {data: BOMB_DAMAGE_UP, likelihood: 1},
                            {data: BOMB_FASTER, likelihood: 1},
                            {data: SHIP_HEALTH, likelihood: 1},
                            {data: SHIP_FASTER, likelihood: 1}
                        ];
                        newObjs.push(o);
                        GameState.agents.push(o);
                        break;
                    case "groundEnemy2":
                        obj.z = 0.5 * obj.width + getGroundHeightAt(obj.x, -obj.y, GameState.groundLayer); // PLAYER_Z;
                        var o = new DefenceTower(1);
                        o.getSortValue = moverSortValue;
                        o.dropsPowerups = [
                            {data: SHIP_MAX_HEALTH, likelihood: 1},
                            {data: CANNON_DAMAGE_UP, likelihood: 1},
                            {data: CANNON_FASTER, likelihood: 1},
                            {data: BOMB_DAMAGE_UP, likelihood: 1},
                            {data: BOMB_FASTER, likelihood: 1},
                            {data: SHIP_HEALTH, likelihood: 1},
                            {data: SHIP_FASTER, likelihood: 1}
                        ];
                        newObjs.push(o);
                        GameState.agents.push(o);
                        break;
                    case "waterEnemy1": // Boat
                        obj.z = 0.4 * obj.width - GRID_SIZE;
                        var o = new DefenceTower(1);
                        o.getSortValue = moverSortValue;
                        o.dropsPowerups = [
                            {data: SHIP_MAX_HEALTH, likelihood: 1},
                            {data: CANNON_DAMAGE_UP, likelihood: 1},
                            {data: CANNON_FASTER, likelihood: 1},
                            {data: BOMB_DAMAGE_UP, likelihood: 1},
                            {data: BOMB_FASTER, likelihood: 1},
                            {data: SHIP_HEALTH, likelihood: 1},
                            {data: SHIP_FASTER, likelihood: 1}
                        ];
                        newObjs.push(o);
                        GameState.agents.push(o);
                        break;
                    case "waterEnemy2": // Submarine
                        obj.z = obj.width + getGroundHeightAt(obj.x, -obj.y, GameState.groundLayer); // PLAYER_Z;
                        var o = new DefenceTower(1);
                        o.getSortValue = moverSortValue;
                        o.dropsPowerups = [
                            {data: SHIP_MAX_HEALTH, likelihood: 1},
                            {data: CANNON_DAMAGE_UP, likelihood: 1},
                            {data: CANNON_FASTER, likelihood: 1},
                            {data: BOMB_DAMAGE_UP, likelihood: 1},
                            {data: BOMB_FASTER, likelihood: 1},
                            {data: SHIP_HEALTH, likelihood: 1},
                            {data: SHIP_FASTER, likelihood: 1}
                        ];
                        newObjs.push(o);
                        GameState.agents.push(o);
                        break;
                    case "boss1":
                        obj.z = 0.5 * obj.width + getGroundHeightAt(obj.x, -obj.y, GameState.groundLayer); // PLAYER_Z;
                        var o = new DefenceTower(1, true);
                        o.getSortValue = moverSortValue;
                        o.dropsPowerups = [
                            {data: SHIP_MAX_HEALTH, likelihood: 1},
                            {data: BOMB_NEW, likelihood: 1},
                            {data: CANNON_NEW, likelihood: 1}
                        ];
                        newObjs.push(o);
                        GameState.agents.push(o);
                        GameState.bosses.push(o);

                        break;
                    case "boss2":
                        obj.z = PLAYER_Z;
                        var o = new Chopper(2, true);
                        o.getSortValue = moverSortValue;
                        o.dropsPowerups = [
                            {data: SHIP_MAX_HEALTH, likelihood: 1},
                            {data: BOMB_NEW, likelihood: 1},
                            {data: CANNON_NEW, likelihood: 1}
                        ];
                        newObjs.push(o);
                        GameState.agents.push(o);
                        GameState.bosses.push(o);
                        GameState.flyers.push(o);
                        break;
                    case "boss3":
                        obj.z = PLAYER_Z;
                        var o = new Chopper(3, true);
                        o.dropsPowerups = [
                            {data: SHIP_MAX_HEALTH, likelihood: 1},
                            {data: BOMB_NEW, likelihood: 1},
                            {data: CANNON_NEW, likelihood: 1}
                        ];
                        o.getSortValue = moverSortValue;
                        newObjs.push(o);
                        GameState.agents.push(o);
                        GameState.bosses.push(o);
                        GameState.flyers.push(o);
                        break;
                    case CANNON_FASTER:
                    case CANNON_DAMAGE_UP:
                    case CANNON_NEW:
                        obj.z = PLAYER_Z;
                        var o = new Powerup(obj.type, powerupText, 0xffffff, 0x444444, 0.1, 0.02, 0.04);
                        obj.width = GRID_SIZE * 0.25;
                        obj.height = obj.width * 3;
                        newObjs.push(o);
                        GameState.pickups.push(o);
                        break;
                    case BOMB_FASTER:
                    case BOMB_DAMAGE_UP:
                    case BOMB_NEW:
                        obj.z = PLAYER_Z;
                        var o = new Powerup(obj.type, powerupText, 0xffff00, 0x444400, 0.1, 0.02, 0.04);
                        obj.width = GRID_SIZE * 0.5;
                        obj.height = obj.width;
                        newObjs.push(o);
                        GameState.pickups.push(o);
                        break;
                    case SHIP_FASTER:
                    case SHIP_HEALTH:
                    case SHIP_MAX_HEALTH:
                        obj.z = PLAYER_Z;
                        var o = new Powerup(obj.type, powerupText, 0x00ffff, 0x004444, 0.1, 0.02, 0.04);
                        obj.width = GRID_SIZE * 0.5;
                        obj.height = obj.width;
                        newObjs.push(o);
                        GameState.pickups.push(o);
                        break;
                    case "player":
                        callAddNewObjs = false; // We do it ourself instead :)
                        for (var j=0; j<GameState.playerCount; j++) {
                            obj = copyValueDeep(obj);
                            var index = j;
                            var o = new Player(index);
                            obj.z = PLAYER_Z;
                            obj.getSortValue = function() {
                                return -100;
                            }
                            newObjs = [o];
                            GameState.agents.push(o);
                            GameState.players.push(o);
                            obj.x += j * GRID_SIZE * 2;
                            addNewObjs(newObjs, obj, newObjList);
                        }
                        break;
                }
                if (callAddNewObjs) {
                    addNewObjs(newObjs, obj, newObjList);
                }
            }
        }
    }

    newObjList.sort(function(a, b) {
        var aSortValue;
        var bSortValue;
        if (a.getSortValue) {
            aSortValue = a.getSortValue();
        } else {
            aSortValue = a.threeObject.position.y;
        }
        if (b.getSortValue) {
            bSortValue = b.getSortValue();
        } else {
            bSortValue = b.threeObject.position.y;
        }
        return a - b;
    });

    for (var i=0; i<newObjList.length; i++) {
        var newObj = newObjList[i];
        newObj.addToScene(GameState.scene);
    }

    for (var k=0; k<level.layers.length; k++) {
        var layer = level.layers[k];

        var layerData = layer.data;
        var layerName = layer.name;
        if (layerData) {
            if (layerName == "ground") {
                var ground = createGround(layer);
                GameState.scene.add(ground);
            }
        }
    }

    GameState.particleParent = new THREE.Object3D();
    GameState.scene.add(GameState.particleParent);

    GameState.directionalLight.target = GameState.players[0].threeObject;

    GameState.camera.position.copy(GameState.players[0].threeObject.position);
    GameState.camera.lookAt(GameState.camera.position.clone().addSelf(new THREE.Vector3(0, 0, -1000)));

    GameState.currentLevel = level;
    GameState.currentLevelName = levelName;
}


function getGroundNormalAt(x, y, layer) {

    var d = 0.1;
    var h = getGroundHeightAt(x, y, layer);
    var dzdx = (getGroundHeightAt(x + d, y, layer) - h) / d;
    var dzdy = (getGroundHeightAt(x, y + d, layer) - h) / d;

//    logit("d stuff " + dzdx + " " + dzdy);

    var result = new THREE.Vector3(-dzdx, -dzdy, 1).normalize();

    return result;
};


function getQuickGroundHeightAt(x, y, layer) {

    var qgW = layer.width * QUICK_GROUND_STEPS;
    var qgH = layer.height * QUICK_GROUND_STEPS;

    var gridX = clamp(Math.floor(QUICK_GROUND_STEPS * x / GRID_SIZE), 0, qgW-1);
    var gridY = clamp(Math.floor(QUICK_GROUND_STEPS * -y / GRID_SIZE), 0, qgH-1);

    return GameState.quickGround[gridX + gridY * qgW];
}

function getGroundHeightAt(x, y, layer) {
    var freq = 0.072341;

    var landscapeChunkWidth = layer.width;
    var landscapeChunkHeight = layer.height;
    var perlin = groundPerlin;

    var z = 34.342352
    var n = perlin.noise(freq * x / landscapeChunkWidth, freq * y / landscapeChunkWidth, z);

    freq *= 2;
    z = 21.23423;
    n += 0.5 * perlin.noise(freq * x / landscapeChunkWidth, freq * y / landscapeChunkWidth, z);

    freq *= 2;
    z = 43.24891;
    n += 0.25 * perlin.noise(freq * x / landscapeChunkWidth, freq * y / landscapeChunkWidth, z);
//        var n = perlin.noise(x, y, 21.32124432);
    var result = n * GRID_SIZE;

    var cell = getLevelCell(x, y);
    var dataIndex = cell[0] + cell[1] * layer.width;
    if (dataIndex >= 0 && dataIndex < layer.data.length) {
        var item = layer.data[dataIndex];

        if (GameState.renderer instanceof CanvasRenderer3D) {
            switch (item) {
                case 3:
                    result = 10;
                    break;
                case 2:
                case 18:
                case 34:
                case 50:
                    result = -GRID_SIZE;
                    break;
                case 17:
                    result += GRID_SIZE;
                    break;
                case 33:
                    result += 1.5 * GRID_SIZE;
                    break;
                case 49:
                    result += 3 * GRID_SIZE;
                    break;
            }
        } else {
            switch (item) {
                case 3:
                    result = 10;
                    break;
                case 2:
                    result -= 1.5 * GRID_SIZE;
                    break;
                case 18:
                    result -= 2.5 * GRID_SIZE;
                    break;
                case 34:
                    result -= 3 * GRID_SIZE;
                    break;
                case 50:
                    result -= 4 * GRID_SIZE;
                    break;
                case 17:
                    result += GRID_SIZE;
                    break;
                case 33:
                    result += 1.5 * GRID_SIZE;
                    break;
                case 49:
                    result += 3 * GRID_SIZE;
                    break;
            }
        }
    }
    return result;
};

function getLevelCell(x, y) {
    return [Math.floor(x / GRID_SIZE), Math.floor(-y / GRID_SIZE)];
}


function createWater(layer) {
    var landscapeChunkParent = new THREE.Object3D();
    if (GameState.renderer instanceof CanvasRenderer3D) {
        return landscapeChunkParent;
    }
    var landscapeChunkWidth = layer.width;
    var landscapeChunkHeight = layer.height;

    var segmentsX = 5;
    var segmentsY = 5;
    var waterGeom = new THREE.PlaneGeometry(landscapeChunkWidth * GRID_SIZE, landscapeChunkHeight * GRID_SIZE,
        segmentsX, segmentsY);

    var waterMaterial = GameState.renderer.getWaterMaterial();

    var water = new THREE.Mesh( waterGeom, waterMaterial );
    water.position.set(0, 0, -GRID_SIZE);
    water.receiveShadow = true;
    landscapeChunkParent.add(water);

    var chunkOffsetX = layer.width * GRID_SIZE * 0.5;
    var chunkOffsetY = -layer.height * GRID_SIZE * 0.5;

    landscapeChunkParent.position.set(chunkOffsetX, chunkOffsetY, 0)

    return landscapeChunkParent;
}

function createGround(layer) {

    var landscapeChunkWidth = layer.width;
    var landscapeChunkHeight = layer.height;

    var landscapeChunkParent = new THREE.Object3D();

    var groundPlaneXCells = landscapeChunkWidth-1;
    var groundPlaneYCells = landscapeChunkHeight-1;
    if (GameState.renderer instanceof CanvasRenderer3D) {
        groundPlaneXCells = Math.floor(groundPlaneXCells * 0.25);
        groundPlaneYCells = Math.floor(groundPlaneYCells * 0.25);
    }
    var landscapeGeom = new THREE.PlaneGeometry(landscapeChunkWidth * GRID_SIZE, landscapeChunkHeight * GRID_SIZE,
        groundPlaneXCells, groundPlaneYCells);


    var chunkOffsetX = layer.width * GRID_SIZE * 0.5;
    var chunkOffsetY = -layer.height * GRID_SIZE * 0.5;

    var m2 = new THREE.Matrix4();
//    m2.scale({x: 2, y: 2, z: 2});
//    m2.translateY(chunkOffsetY);

//    logit("Offsets " + chunkOffsetX + ", " + chunkOffsetY);
//    landscapeGeom.applyMatrix(m2);
    for ( var i = 0, l = landscapeGeom.vertices.length; i < l; i ++ ) {
//        var x = i % landscapeChunkWidth;
//        var y = ~~ ( i / landscapeChunkWidth );
        var v = landscapeGeom.vertices[i];

//        logit("ground vert x " + v.x + ", y " + v.y);

        v.z = getGroundHeightAt(v.x + chunkOffsetX, v.y + chunkOffsetY, layer);
    }

    var qgW = layer.width * QUICK_GROUND_STEPS;
    var qgH = layer.height * QUICK_GROUND_STEPS;
    for (var i=0; i<qgW * qgH; i++) {
        var x = (i % qgW) * GRID_SIZE / QUICK_GROUND_STEPS;
        var y = -Math.floor(i / qgW) * GRID_SIZE / QUICK_GROUND_STEPS;
        GameState.quickGround[i] = getGroundHeightAt(x, y, layer);
    }

    var vertices = landscapeGeom.vertices;
    for (var i=0; i<landscapeGeom.faces.length; i++) {
        var face = landscapeGeom.faces[i];
        var va = vertices[face.a];
        var vb = vertices[face.b];
        var vc = vertices[face.c];
        var vd = vertices[face.d];
        face.vertexNormals[ 0 ].copy(getGroundNormalAt(va.x + chunkOffsetX, va.y + chunkOffsetY, layer));
        face.vertexNormals[ 1 ].copy(getGroundNormalAt(vb.x + chunkOffsetX, vb.y + chunkOffsetY, layer));
        face.vertexNormals[ 2 ].copy(getGroundNormalAt(vc.x + chunkOffsetX, vc.y + chunkOffsetY, layer));
        face.vertexNormals[ 3 ].copy(getGroundNormalAt(vd.x + chunkOffsetX, vd.y + chunkOffsetY, layer));

//        face.vertexColors[0] = new THREE.Color().copy({r: 255, g: 0, b: 0});
//        face.vertexColors[1] = new THREE.Color().copy({r: 255, g: 0, b: 0});
//        face.vertexColors[2] = new THREE.Color().copy({r: 255, g: 0, b: 0});
//        face.vertexColors[3] = new THREE.Color().copy({r: 255, g: 0, b: 0});
    }

    landscapeGeom.computeFaceNormals();
//    landscapeGeom.computeVertexNormals();
    landscapeGeom.normalsNeedUpdate = true;
    landscapeGeom.colorsNeedUpdate = true;



//    var material = this.getLandscapeMaterial(0x444444, 0x000000);
//    var material = GameState.renderer.getGroundMaterial();

    var groundCanvas = generateGroundTexture(layer);
    var texture = new THREE.Texture( groundCanvas, new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping );
    texture.needsUpdate = true;
//    texture.premultiplyAlpha = true;

    GameState.groundTexture = texture;

    var material = GameState.renderer.getGroundMaterial(texture); // new THREE.MeshPhongMaterial( { emissive: 0x222222, map: texture } );

//    var fakeGroundMaterial = new THREE.MeshPhongMaterial({emissive: 0x222222, map: texture });

    landscapeGeom.computeCentroids();

    var mesh = new THREE.Mesh( landscapeGeom, material );
    mesh.receiveShadow = true;


    landscapeChunkParent.add(mesh);
    landscapeChunkParent.position.set(chunkOffsetX, chunkOffsetY, 0)


//    var left = new THREE.Mesh( fakeGroundGeom, fakeGroundMaterial );
//    left.position.set(-chunkOffsetX * 2, chunkOffsetY, 0);
//    left.receiveShadow = true;
//    landscapeChunkParent.add(left);

    return landscapeChunkParent;
};

function generateGroundTexture(layer) {

    var scale = PIXELS_PER_CELL;

    var width = layer.width;
    var height = layer.height;

    var canvas, context, image, imageData;

    canvas = document.createElement( 'canvas' );
    canvas.width = width * scale;
    canvas.height = height * scale;

    context = canvas.getContext( '2d' );
    context.fillStyle = '#000';
    context.fillRect( 0, 0, width * scale, height * scale);

    image = context.getImageData( 0, 0, canvas.width, canvas.height );
    imageData = image.data;

    var waterR = 0;
    var waterG = 150;
    var waterB = 0;

    if (GameState.renderer instanceof CanvasRenderer3D) {
        waterR = 50;
        waterG = 50;
        waterB = 240;
    }

    for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

        var imageX = j % (width * scale);
        var imageY = Math.floor(j / (width * scale));

        var item = layer.data[Math.floor(imageX / scale) + Math.floor(imageY / scale) * width];

        var r = Math.floor(Math.random() * 199);
        var g = Math.floor(Math.random() * 199);
        var b = Math.floor(Math.random() * 199);

        switch (item) {
            case 0:
                r = 255;
                g = 255;
                b = 255;
                break;
            case 2:
            case 18:
            case 34:
            case 50:
                r = waterR;
                g = waterG;
                b = waterB;
                break;
            case 1:
            case 17:
            case 33:
            case 49:
                r = 0;
                g = 150;
                b = 0;
                break;
            case 3: // Road
                r = 50;
                g = 50;
                b = 50;
                break;
            default:
                logit("Unknown tile " + item);
                break;
        }

//        vector3.x = data[ j - 2 ] - data[ j + 2 ];
//        vector3.y = 2;
//        vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
//        vector3.normalize();
//
//        shade = vector3.dot( sun );

        imageData[ i ] = r;
        imageData[ i + 1 ] = g;
        imageData[ i + 2 ] = b;
    }

    context.putImageData( image, 0, 0 );

    return canvas;
}

