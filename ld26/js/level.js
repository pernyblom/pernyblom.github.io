
var groundPerlin = new ClassicalNoise(new MersenneTwister(39463));

function updateCameras() {

    for (var i=0; i<GameState.cameras.length; i++) {
        var player = GameState.players[i];
        var p = player.rigidBody.position;
        var v = player.rigidBody.velocity;

        var forward = player.rigidBody.quaternion.vmult(new CANNON.Vec3(0, 1, 0)).toThreeJs();

        var plPos = new THREE.Vector3(p.x, p.y, p.z);
        var plVel = new THREE.Vector3(v.x, v.y, v.z);

        var camera = GameState.cameras[i];
        var camPos = camera.position;

        if (GameState.directionalLight) {
            var plPos = GameState.players[0].threeObject.position;
            GameState.directionalLight.position.copy(plPos.clone().add(new THREE.Vector3(-1, 1, 2).normalize().multiplyScalar(2000)));
//            GameState.directionalLight.target.position.copy(plPos);
        }

//        logit("player pos " + plPos.x + " " + plPos.y);

        var canvas = GameState.canvas;
        var w = canvas.width;
        var h = canvas.height;

        var aspect = w / h;

        var velFactor = 1;

        var currentDiffNorm = camPos.clone().sub(plPos).normalize();
//        var currentDistance = currentDiff.length();

        var wantedDistance = 15 + 0.15 * plVel.length();

        var offsetDir = new THREE.Vector3(-forward.x, -forward.y, 0.75).sub(plVel.clone().multiplyScalar(0.25)).add(currentDiffNorm).normalize();

        var offset = offsetDir.clone().multiplyScalar(wantedDistance);
//        if (plVel.lengthSq() > 0.01) {
//            var plVelNorm = plVel.clone().normalize();
//            offset.add(plVelNorm.multiplyScalar(-wantedDistance));
//        }

        var targetCamPos = new THREE.Vector3(
            plPos.x,
            plPos.y,
            plPos.z).add(offset);
        var targetLookAtPos = plPos;

        if (!camera.lookAtPos) {
            camera.lookAtPos = targetLookAtPos;
        }
        var currentLookAtPos = camera.lookAtPos;

        var f = 0.98;
        var invF = 1.0 - f;

        camPos.x = camPos.x * f + invF * targetCamPos.x;
        camPos.y = camPos.y * f + invF * targetCamPos.y;
        camPos.z = camPos.z * f + invF * targetCamPos.z;

        camera.up = new THREE.Vector3(0, 0, 1);
        camera.lookAt(targetLookAtPos);
        camera.lookAtPos = targetLookAtPos;
    }
}


function stepLevel() {
    var level = GameState.currentLevel;

    GameState.levelCurrentTime = (GameState.counter3 - COUNTDOWN) * 0.01;
    GameState.timeFractionLeft = clamp(1.0 - GameState.levelCurrentTime / GameState.levelSeconds, 0, 1);

    var doStep = false;
    switch (GameState.subState) {
        case GameSubState.SHOWING_GAME_MENU:
            GameState.counter1++;
            break;
        case GameSubState.COMPLETING:
            GameState.counter1++;
            if (GameState.counter1 > 500 || Input.mouseJustPressed || Input.wasPressed(Input.ENTER)|| Input.wasPressed(Input.ESCAPE) || Input.wasPressed(Input.SPACE)) {
                GameState.subState = GameSubState.SHOWING_LEVEL_COMPLETE;
                GameState.counter1 = 0;
            }
            doStep = true;
            break;
        case GameSubState.DYING:
            GameState.counter1++;
            if (GameState.counter1 > 500 || Input.mouseJustPressed || Input.wasPressed(Input.ENTER)|| Input.wasPressed(Input.ESCAPE) || Input.wasPressed(Input.SPACE)) {
                GameState.subState = GameSubState.SHOWING_LEVEL_INTRO;
                GameState.counter1 = 0;
//                changeLevel(GameState.levelIndex);
            }
            doStep = true;
            break;
        case GameSubState.COMPLETING_GAME:
            GameState.counter1++;
            if (GameState.counter1 > 700) {
                GameState.subState = GameSubState.SHOWING_GAME_COMPLETE;
                GameState.counter1 = 0;
            }
            doStep = true;
            break;
        case GameSubState.PLAYING:
            var allPlayersDead = true;
            for (var i=0; i<GameState.playerCount; i++) {
                if (!GameState.players[i].isDead) {
                    allPlayersDead = false;
                }
            }
            if (GameState.levelCurrentTime >= GameState.levelSeconds) {
                GameState.subState = GameSubState.DYING;
                GameState.counter1 = 0;
            }
            doStep = true;

            if (Input.wasPressed(Input.ESCAPE)) {
                GameState.subState = GameSubState.PAUSED;
            }
            GameState.counter3++;
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

        if (GameState.world) {
            GameState.world.step(1.0/120.0);
            GameState.physicsSteps++;
//            GameState.world.step(1.0/120.0);
        }
//        logit("Stepping level " + GameState.agents);
        stepAll(GameState.agents);
        stepAll(GameState.particles);
        stepAll(GameState.projectiles);
        stepAll(GameState.solids);
        stepAll(GameState.pickups);
        stepAll(GameState.screenMessages);

        updateCameras();
    }

}




function changeLevel(levelIndex, isUserLevel) {
    var levelName = "level" + levelIndex;
    var level = levelArr[levelIndex];

    logit("Changing level to " + levelIndex);
    if (isUserLevel) {

    }
    if (!level) {
        logit("Could not find level " + levelIndex + " arr length " + levelArr.length);
        level = levelArr[0];
    }

    GameState.levelSeconds = parseFloat(level.properties.time);

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
        var light = new THREE.PointLight(0xffff00, 2, GRID_CELL_SIZE * 10);
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
//        var dl = GameState.directionalLight;
//        dl.castShadow = true;
//        dl.shadowCameraNear = 0.2;
//        dl.shadowCameraFar = 10000;
//
//        var shadowSize = 1000;
//        dl.shadowCameraLeft = -shadowSize;
//        dl.shadowCameraRight = shadowSize;
//        dl.shadowCameraTop = shadowSize;
//        dl.shadowCameraBottom = -shadowSize;
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

    GameState.groundMaterial = null;

    var tileSet = level.tilesets[0];
    var imageHeight = tileSet.imageheight;
    var imageWidth = tileSet.imagewidth;

    var playerPlaced = false;


    for (var k=0; k<level.layers.length; k++) {
        var layer = level.layers[k];

        var layerData = layer.data;
        var layerName = layer.name;

        var layerWidth = layer.width;
        var layerHeight = layer.height;

        if (layerData) {

            for (var i=0; i<layerData.length; i++) {

                var tileId = layerData[i];

                var xIndex = i % layerWidth;
                var yIndex = Math.floor(i / layerWidth);

                var x = xIndex * GRID_CELL_SIZE;
                var y = -yIndex * GRID_CELL_SIZE;

                var angle = 0;
                var createGroundTile = layerName == "Road";

                switch (tileId) {
                    case RAMP_N:
                    case ROAD_NS:
                    case PLAYER_N:
                    case GOAL_N:
                    case HIGHER_NS:
                    case TUNNEL_NS:
                    case ROAD_TURN_SE:
                    case HIGHER_TURN_SE:
                        angle = 0;
                        break;
                    case RAMP_E:
                    case ROAD_EW:
                    case HIGHER_EW:
                    case PLAYER_E:
                    case GOAL_E:
                    case TUNNEL_EW:
                    case ROAD_TURN_EN:
                    case HIGHER_TURN_WS:
                        angle = Math.PI * 0.5;
                        break;
                    case RAMP_S:
                    case PLAYER_S:
                    case GOAL_S:
                    case ROAD_TURN_NW:
                    case HIGHER_TURN_NW:
                        angle = Math.PI;
                        break;
                    case RAMP_W:
                    case PLAYER_W:
                    case GOAL_W:
                    case ROAD_TURN_WS:
                    case HIGHER_TURN_EN:
                        angle = Math.PI * 1.5;
                        break;
                }


                switch (tileId) {
                    case RAMP_N:
                    case RAMP_E:
                    case RAMP_S:
                    case RAMP_W:
                        break;
                    case GRASS: // Plain grass
                        break;
                    case INVISIBLE:
                        break;
                    case ROAD_NS:
                    case ROAD_EW:
                        break;
                    case HIGHER_NS:
                    case HIGHER_EW:
                        break;
                    case TUNNEL_NS:
                    case TUNNEL_EW:
                        break;
                    case HIGHER_TURN_SE:
                    case HIGHER_TURN_EN:
                    case HIGHER_TURN_NW:
                    case HIGHER_TURN_WS:
                        break;
                    case HIGHER_CROSSING:
                    case ROAD_CROSSING:
                        break;
                    case GOAL_N:
                    case GOAL_E:
                    case GOAL_S:
                    case GOAL_W:
                        var goal = new Goal();
                        GameState.pickups.push(goal);
                        goal.setPosition(new THREE.Vector3(x, y, 0));
                        goal.addToScene(GameState.scene);
                        break;
                    case PLAYER_N:
                    case PLAYER_E:
                    case PLAYER_S:
                    case PLAYER_W:
                        if (playerPlaced) {
                            logit("Found to player places... Ignoring this one...")
                        } else {
                            for (var j=0; j<GameState.playerCount; j++) {
                                var o = new Player(j);

                                GameState.agents.push(o);
                                GameState.players.push(o);

                                var pos = new CANNON.Vec3(x, y, PLAYER_HEIGHT + SUSPENSION_LENGTH);
                                o.rigidBody.initPosition.set(pos.x, pos.y, pos.z);
                                o.rigidBody.position.set(pos.x, pos.y, pos.z);

                                GameState.world.add(o.rigidBody);
                                o.addToScene(GameState.scene);

//                                logit("Setting player pos to " + pos.x + " " + pos.y);
                            }
                            playerPlaced = true;
                        }
                        break;
                    case CHECKPOINT:
                        var cp = new Checkpoint();
                        GameState.pickups.push(cp);
                        cp.setPosition(new THREE.Vector3(x, y, 0));
                        cp.addToScene(GameState.scene);
                        GameState.checkpointCount++;
                        break;
                    case WALL_UP:
                    case WALL_DOWN:
                    case WALL_LEFT:
                    case WALL_RIGHT:
                        break;
                    default:
//                        createGroundTile = false;
//                        logit("Unknown tile id " + tileId);
                        break;
                }

                if (createGroundTile) {
//                    logit("Creating ground tile " + tileId);

                    var tileXIndex = (tileId - 1) % ATLAS_SIZE;
                    var tileYIndex = Math.floor((tileId - 1) / ATLAS_SIZE);


                    var imageX = tileXIndex * GRID_CELL_SIZE;
                    var imageY = tileYIndex * GRID_CELL_SIZE;

                    var s1 = imageX / imageWidth;
                    var t1 = imageY / imageHeight;
                    var s2 = (imageX + GRID_CELL_SIZE) / imageWidth;
                    var t2 = (imageY + GRID_CELL_SIZE) / imageHeight;

                    var tile = new GroundTile(tileId, imageArr[0], s1, t1, s2, t2, angle);
                    tile.setPosition(new THREE.Vector3(x, y, 0));
//                    tile.rigidBody.initPosition = new CANNON.Vec3(x, y, 0);

//                    logit("SEtting tile pos " + x + " " + y + " ");
//                    logit("Creating tile " + tileId + " i: " + i + " xIndex: " + xIndex + " yIndex: " + yIndex);

                    tile.addToScene(GameState.scene);

                }
            }
        }
    }

    GameState.particleParent = new THREE.Object3D();
    GameState.scene.add(GameState.particleParent);

    GameState.directionalLight.target = GameState.players[0].threeObject;

    // Add the ground physical body
    var groundBoxSizeZ = 10;
    var groundShape = new CANNON.Box(new CANNON.Vec3(GRID_CELL_SIZE * 100, GRID_CELL_SIZE * 100, 0.5 * groundBoxSizeZ));
    createPhysicsMaterials();
    var groundBody = new CANNON.RigidBody(0, groundShape, groundPhysicsMaterial);
    groundBody.position.set(0, 0, -0.5 * groundBoxSizeZ);
    groundBody.initPosition.set(0, 0, -0.5 * groundBoxSizeZ);
    GameState.world.add(groundBody);
    GameState.solidBodies.push(groundBody);


    var groundGeom = new THREE.PlaneGeometry(GRID_CELL_SIZE * 100, GRID_CELL_SIZE * 100);
    var groundMesh = new THREE.Mesh(groundGeom, groundTileMaterial);
    GameState.scene.add(groundMesh);

    for (var i=0; i<GameState.players.length; i++) {
        GameState.cameras[i].position.copy(GameState.players[i].threeObject.position);
        GameState.cameras[i].lookAt(GameState.cameras[i].position.clone().add(new THREE.Vector3(0, 0, -100)));
    }

    GameState.currentLevel = level;
    GameState.currentLevelName = levelName;
}



