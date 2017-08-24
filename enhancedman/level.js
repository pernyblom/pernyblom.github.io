

var LevelObjectType = {
    EMPTY: 0,
    PLAYER: 1,
    GOAL: 2,
    CHECKPOINT: 3,
    HEALTH_PICKUP: 5,
    EVOLVE_RUN: 6,
    EVOLVE_AERIAL: 7,
    EVOLVE_HEALTH: 8,
    EVOLVE_JUMP: 9,
    STONE_BLOCK: 17,
    DESTROYABLE_STONE_BLOCK: 18,
    WOOD: 19,
    LEAVES: 20,
    FIRE: 21,
    LIGHT_1: 33,
    LIGHT_2: 34,
    LIGHT_3: 35
};


function updateCamera() {
    var plPos = GameState.player.threeObject.position;
    var plVel = GameState.player.velocity;
    var camPos = GameState.camera.position;

    var yOffset = 80;
    var velXYCorrection = 20;
    var velZCorrection = 10;

    var targetCamPos = new THREE.Vector3(
        plPos.x + plVel.x * velXYCorrection,
        plPos.y + plVel.y * velXYCorrection + yOffset,
        4 * yOffset + plVel.length() * velZCorrection);
    var targetLookAtPos = new THREE.Vector3(targetCamPos.x, targetCamPos.y - yOffset, 0);

    if (!GameState.camera.lookAtPos) {
        GameState.camera.lookAtPos = targetLookAtPos;
    }
    var currentLookAtPos = GameState.camera.lookAtPos;

    var factor = 0.95;
    var invFactor = 1.0 - factor;

    var newCamPos = new THREE.Vector3(camPos.x * factor + targetCamPos.x * invFactor,
        camPos.y * factor + targetCamPos.y * invFactor,
        camPos.z * factor + targetCamPos.z * invFactor);
    var newLookAtPos = new THREE.Vector3(currentLookAtPos.x * factor + targetLookAtPos.x * invFactor,
        currentLookAtPos.y * factor + targetLookAtPos.y * invFactor,
        currentLookAtPos.z * factor + targetLookAtPos.z * invFactor);

    camPos.x = newCamPos.x;
    camPos.y = newCamPos.y;
    camPos.z = newCamPos.z;
    GameState.camera.lookAt(newLookAtPos);
    GameState.camera.lookAtPos = newLookAtPos;
}

function stepLevel() {
    var level = GameState.currentLevel;

    var doStep = false;
    switch (GameState.subState) {
        case GameSubState.COMPLETING:
            GameState.counter1++;
            if (GameState.counter1 > 250 || Input.isDown(Input.ENTER)|| Input.isDown(Input.ESCAPE) || Input.isDown(Input.SPACE)) {
                GameState.subState = GameSubState.SHOWING_LEVEL_COMPLETE;
                GameState.counter1 = 0;
//                logit("Increasing levels...");
                GameState.accelerationLevel += GameState.gatheredAccelerationLevel;
                GameState.aerialControlLevel += GameState.gatheredAerialControlLevel;
                GameState.healthLevel += GameState.gatheredHealthLevel;
                GameState.jumpLevel += GameState.gatheredJumpLevel;
            }
            doStep = true;
            break;
        case GameSubState.DYING:
            GameState.counter1++;
            if (GameState.counter1 > 250 || Input.isDown(Input.ENTER)|| Input.isDown(Input.ESCAPE) || Input.isDown(Input.SPACE)) {
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
                GameState.accelerationLevel += GameState.gatheredAccelerationLevel;
                GameState.aerialControlLevel += GameState.gatheredAerialControlLevel;
                GameState.healthLevel += GameState.gatheredHealthLevel;
                GameState.jumpLevel += GameState.gatheredJumpLevel;
            }
            doStep = true;
            break;
        case GameSubState.PLAYING:
            doStep = true;
            break;
        case GameSubState.SHOWING_LEVEL_INTRO:
            if (Input.wasPressed(Input.SPACE) || Input.wasPressed(Input.ENTER) || Input.wasPressed(Input.ESCAPE)) {
                GameState.subState = GameSubState.PLAYING;
            }
            break;
        case GameSubState.SHOWING_LEVEL_COMPLETE:
            if (Input.wasPressed(Input.SPACE) || Input.wasPressed(Input.ENTER) || Input.wasPressed(Input.ESCAPE)) {
                // Load a new level if available or go to game complete
                GameState.subState = GameSubState.SHOWING_LEVEL_INTRO;
                if (resources["level" + (GameState.levelIndex + 1)]) {
                    changeLevel(GameState.levelIndex + 1);
                }
            }
            break;
        case GameSubState.SHOWING_GAME_COMPLETE:
            if (Input.wasPressed(Input.ESCAPE)) {
                // Load a new level if available or go to game complete
                GameState.subState = GameSubState.SHOWING_LEVEL_INTRO;
                changeLevel(1);
            }
            break;
    }

    if (doStep) {
        stepAll(GameState.agents);
        stepAll(GameState.particles);
        stepAll(GameState.projectiles);
        stepAll(GameState.solids);
        stepAll(GameState.goals);
        stepAll(GameState.checkpoints);
        stepAll(GameState.pickups);

        updateCamera();
    }

}


function changeLevel(levelIndex) {
    var levelName = "level" + levelIndex;
    var level = resources[levelName];

    $messages.empty();

    GameState.levelIndex = levelIndex;
    if (levelIndex == 1) {
//        GameState.clearHard();
        GameState.clear();
    } else {
        GameState.clear();
    }
    // console.log("Changing level to " + levelName);
    console.log(level);

    var directionalLightIntensity = 0.01;
//    if (GameState.renderer instanceof THREE.CanvasRenderer) {
//        directionalLightIntensity = 0.5;
//    }

    if (GameState.goalLights.length == 0) {
        var light = new THREE.PointLight(0xffff00, 2, GRID_SIZE * 4);
        GameState.goalLights.push(light);
    }
    GameState.availableGoalLights = [];
    for (var i=0; i<GameState.goalLights.length; i++) {
        GameState.scene.add(GameState.goalLights[i]);
        GameState.availableGoalLights.push(GameState.goalLights[i]);
    }

    if (!GameState.directionalLight) {
        GameState.directionalLight = new THREE.DirectionalLight( 0xffffff, directionalLightIntensity );
    }
    GameState.directionalLight.position.set(1, 1, 1).normalize();
    GameState.scene.add(GameState.directionalLight);

    if (!GameState.playerLight) {
        GameState.playerLight = new THREE.PointLight(0xffffff, 0.7, GRID_SIZE * 7);
    }
    GameState.scene.add(GameState.playerLight);

    var levelWidthCells = 0;
    var levelHeightCells = 0;

    for (var k=0; k<level.layers.length; k++) {
        var layer = level.layers[k];

        var layerName = layer.name;

        var layerHeight = layer.height;
        var layerWidth = layer.width;

        levelWidthCells = Math.max(levelWidthCells, layerWidth);
        levelHeightCells = Math.max(levelHeightCells, layerHeight);

        var layerDepth = 0;
        if (layerName == "Misc") {
            layerDepth = 1;
        }
        if (layerName == "Background") {
            layerDepth = -1;
        }
        if (layerName == "Solid") {
            var collisionGrid = new CollisionGrid(layerWidth, layerHeight);
            GameState.collisionGrid = collisionGrid;
        }

        var layerData = layer.data;

        var layerObjects = layer.objects;

        if (layerObjects) {

        }

        if (layerData) {
            for (var i=0; i<layerData.length; i++) {
                var tile = layerData[i];
                var tileX = i % layerWidth;
                var tileY = Math.floor(i / layerWidth);

                var newObjs = [];
                switch (tile) {
                    case LevelObjectType.EMPTY:
                        break;
                    case LevelObjectType.LIGHT_1:
                        if (GameState.renderer instanceof THREE.CanvasRenderer) {
                        } else {
//                            var o = new PointLight(0xffffff, 1, GRID_SIZE * 4);
//                            newObjs.push(o);
                        }
                        break;
                    case LevelObjectType.HEALTH_PICKUP:
                        var o = new MovingColoredBlock("health", 0x4444ff, 0x111144, GRID_SIZE * 0.4, 0.1, 0.02, 0.04);
                        newObjs.push(o);
                        GameState.pickups.push(o);
                        break;
                    case LevelObjectType.EVOLVE_RUN:
                        var o = new MovingColoredText("evolverun", 0xaaaaaa, 0xaaaaaa, GRID_SIZE * 0.4, "R", 0.1, 0.02, 0.04);
                        newObjs.push(o);
                        GameState.pickups.push(o);
                        break;
                    case LevelObjectType.EVOLVE_AERIAL:
                        var o = new MovingColoredText("evolveaerial", 0xaaaaaa, 0xaaaaaa, GRID_SIZE * 0.4, "Ae", 0.1, 0.02, 0.04);
                        newObjs.push(o);
                        GameState.pickups.push(o);
                        break;
                    case LevelObjectType.EVOLVE_HEALTH:
                        var o = new MovingColoredText("evolvehealth", 0xaaaaaa, 0xaaaaaa, GRID_SIZE * 0.4, "H", 0.1, 0.02, 0.04);
                        newObjs.push(o);
                        GameState.pickups.push(o);
                        break;
                    case LevelObjectType.EVOLVE_JUMP:
                        var o = new MovingColoredText("evolvejump", 0xaaaaaa, 0xaaaaaa, GRID_SIZE * 0.4, "J", 0.1, 0.02, 0.04);
                        newObjs.push(o);
                        GameState.pickups.push(o);
                        break;
                    case LevelObjectType.STONE_BLOCK:
                        var o = new ColoredBlock("stone", 0x777777);
                        newObjs.push(o);
                        GameState.solids.push(o);
                        if (layerName == "Solid") {
                            GameState.collisionGrid.setSolid(tileX, tileY, true);
                        }
                        break;
                    case LevelObjectType.GOAL:
                    case LevelObjectType.CHECKPOINT:
                        var o = new Goal();
                        newObjs.push(o);
                        GameState.goals.push(o);
                        break;
                    case LevelObjectType.LEAVES:
                        var o = new ColoredBlock("leaves", 0x22ff22);
                        newObjs.push(o);
                        GameState.solids.push(o);
                        if (layerName == "Solid") {
                            GameState.collisionGrid.setSolid(tileX, tileY, true);
                        }
                        break;
                    case LevelObjectType.FIRE:
                        var o = new ColoredBlock("fire", 0xff1100, 0xff1100, GRID_SIZE);
                        newObjs.push(o);
                        GameState.solids.push(o);
                        if (layerName == "Solid") {
                            GameState.collisionGrid.setSolid(tileX, tileY, true);
                            GameState.collisionGrid.setFire(tileX, tileY, true);
                        }
                        break;
                    case LevelObjectType.WOOD:
                        var o = new ColoredBlock("wood", 0x705D00);
                        newObjs.push(o);
                        GameState.solids.push(o);
                        if (layerName == "Solid") {
                            GameState.collisionGrid.setSolid(tileX, tileY, true);
                        }
                        break;
                    case LevelObjectType.PLAYER:
                        var o = new Player();
                        newObjs.push(o);
                        GameState.agents.push(o);
                        GameState.player = o;
                        break;
                    default:
                        logit(tile + " at " + tileX + " " + tileY);
                        break;
                }
                for (var j=0; j<newObjs.length; j++) {
                    var obj = newObjs[j];
                    if (obj.setPosition) {
                        obj.setPosition({x: tileX * GRID_SIZE, y: -tileY * GRID_SIZE, z: layerDepth * GRID_SIZE});
                        obj.addToScene(GameState.scene);
                    } else {
                        logit("Failed to set position for:");
                        logit(obj);
                    }
                }
            }
        }
    }

    // Add a ground plane

    var groundGeometry = new THREE.PlaneGeometry(GRID_SIZE * levelWidthCells * 1.5, GRID_SIZE * 20);

    var groundMaterial = null;
    if (GameState.renderer instanceof THREE.CanvasRenderer) {
        groundMaterial = new THREE.MeshBasicMaterial({color: 0x111111});
    } else {
        groundMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    }
//    var groundMaterial = new THREE.MeshLambertMaterial({color: 0x00ff00, emissive: 0xff0000});
    var groundPlane = new THREE.Mesh(groundGeometry, groundMaterial);
    groundPlane.position.x = GRID_SIZE * levelWidthCells * 0.5;
    groundPlane.position.y = -GRID_SIZE * levelHeightCells;
    groundPlane.rotation.x = -Math.PI / 2;

    GameState.scene.add(groundPlane);

    GameState.currentLevel = level;
    GameState.currentLevelName = levelName;
}

