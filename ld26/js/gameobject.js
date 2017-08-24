
var cubeGeometry = null;
var planeGeometry = null;
var sphereGeometry = null;
var cylinderGeometry = null;
var checkpointGeometry = null;
var rampGeometry = null;

var materials = {};

var groundTileMaterial = null;
var roadMaterial = null;
var startMaterial = null;
var goalMaterial = null;
var rampMaterial = null;
var house1Material = null;
var groundTileTexture = null;

var playerPhysicsMaterial = null;
var groundPhysicsMaterial = null;

function ScreenMessage(text, x, y) {
    this.text = text ? text : "Bad text... in screen message";
    this.ticks = 0;
    this.removeMe = false;
    this.duration = 100;
    this.dx = 0.0;
    this.dy = -1;
    this.position = new THREE.Vector2(x, y);
}

ScreenMessage.prototype.step = function() {
    this.ticks++;
    if (this.ticks > this.duration) {
        this.removeMe = true;
    }
    this.position.x += this.dx;
    this.position.y += this.dy;
};

ScreenMessage.prototype.removed = function() {
};

// Just some object. Not necessary a physical thing
function GameObject() {
    this.removeMe = false;
    this.ticks = 0;
    this.threeObject = null;
    this.rigidBody = null;
    this.initialPosition = null;
}

GameObject.prototype.step = function() {
};

GameObject.prototype.removed = function() {
    this.removeFromScene(GameState.scene);
};

GameObject.prototype.addToScene = function(scene) {
    scene.add(this.threeObject);
};


GameObject.prototype.removeFromScene = function(scene) {
    scene.remove(this.threeObject);
};

GameObject.prototype.setPosition = function(pos) {
    this.threeObject.position = new THREE.Vector3(pos.x, pos.y, pos.z);
    this.initialPosition = new THREE.Vector3(pos.x, pos.y, pos.z);
};

GameObject.prototype.updatePosition = function(pos) {
    this.threeObject.position = new THREE.Vector3(pos.x, pos.y, pos.z);
};


GameObject.prototype.setScale = function(s) {
    this.threeObject.scale = new THREE.Vector3(s.x, s.y, s.z);
};




function StationaryObject() {
    GameObject.call(this);
}
StationaryObject.prototype = new GameObject();


function c2t(v) {
    return new THREE.Vector3(v.x, v.y, v.z);
}
function t2c(v) {
    return new CANNON.Vec3(v.x, v.y, v.z);
}


function GroundTile(tileId, image, s1, t1, s2, t2, angle) {
    StationaryObject.call(this);

    createPhysicsMaterials();

    this.threeObject = new THREE.Object3D();
    this.threeObject.castShadow = false;
    this.threeObject.receiveShadow = true;
    this.threeObject.useQuaternion = true;

    if (!groundTileTexture) {
        groundTileTexture = THREE.ImageUtils.loadTexture( 'images/icons.png' );
//        groundTileTexture = new THREE.Texture( image, new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping );
        groundTileMaterial = GameState.renderer.getGroundTileMaterial(groundTileTexture);
        roadMaterial = GameState.renderer.getRoadMaterial(groundTileTexture);
        startMaterial = GameState.renderer.getStartMaterial(groundTileTexture);
        goalMaterial = GameState.renderer.getGoalMaterial(groundTileTexture);
        rampMaterial = GameState.renderer.getRampMaterial();
        house1Material = GameState.renderer.getHouse1Material();
    }

    var V = CANNON.Vec3;

    var rampWidth = GRID_CELL_SIZE * 0.5;
    var rampHeight = GRID_CELL_SIZE * 0.25;
    var hrw = rampWidth * 0.5;
    var hgs = GRID_CELL_SIZE * 0.5;

    createCubeGeometry();

    function createCannonGeometry(h, offset) {
        var geometry = new THREE.Geometry();
        if (!offset) {
            offset = new CANNON.Vec3();
        }
        for (var i=0; i<h.vertices.length; i++) {
            geometry.vertices[i] = c2t(h.vertices[i].vadd(offset));
        }
        for (var i=0; i<h.faces.length; i++) {
            var face = h.faces[i];
            var normal = h.faceNormals[i];
            var threeFace = null;
            if (face.length == 3) {
                threeFace = new THREE.Face3(face[0], face[1], face[2], c2t(normal));
            } else if (face.length == 4) {
                threeFace = new THREE.Face4(face[0], face[1], face[2], face[3], c2t(normal));
            }
            geometry.faces[i] = threeFace;
        }
        return geometry;
    }

    this.rigidBodies = [];

    var material = null;
    var geometry = null;

    switch (tileId) {
        case HIGHER_EW:
        case HIGHER_NS:
            var h = new CANNON.Box(new V(hrw, hgs, 0.5 * rampHeight));
            this.rigidBody = new CANNON.RigidBody(0, h, groundPhysicsMaterial);
            this.rigidBody.position = new V(0, 0, 0.5 * rampHeight);
            this.rigidBody.initPosition = new V(0, 0, 0.5 * rampHeight);
            this.threeObject.position.add(new THREE.Vector3(0, 0, 0.5 * rampHeight));
            geometry = new THREE.CubeGeometry(hrw * 2, hgs * 2, rampHeight);
            material = rampMaterial;
            break;
        case HIGHER_TURN_SE:
        case HIGHER_TURN_EN:
        case HIGHER_TURN_NW:
        case HIGHER_TURN_WS:
            var toShorten = 0; // 0.5 * (hgs * 2 - hrw * 2);
            var h = new CANNON.Box(new V(hgs - toShorten * 0.5, hgs - toShorten * 0.5, 0.5 * rampHeight));
            this.rigidBody = new CANNON.RigidBody(0, h, groundPhysicsMaterial);
            this.rigidBody.position = new V(-toShorten * 0.5, -toShorten * 0.5, 0.5 * rampHeight);
            this.rigidBody.initPosition = new V(-toShorten * 0.5, -toShorten * 0.5, 0.5 * rampHeight);
            this.threeObject.position.add(new THREE.Vector3(-toShorten * 0.5, -toShorten * 0.5, 0.5 * rampHeight));

            geometry = new THREE.CubeGeometry(hgs * 2 - toShorten, hgs * 2 - toShorten, rampHeight);
            material = rampMaterial;
            break;
        case HOUSE_1:
            var h = new CANNON.Box(new V(hgs, hgs, 1 * rampHeight));
            this.rigidBody = new CANNON.RigidBody(0, h, groundPhysicsMaterial);
            this.rigidBody.position = new V(0, 0, 1 * rampHeight);
            this.rigidBody.initPosition = new V(0, 0, 1 * rampHeight);
            this.threeObject.position.add(new THREE.Vector3(0, 0, 1 * rampHeight));

            geometry = new THREE.CubeGeometry(hgs * 2, hgs * 2, rampHeight * 2);
            material = house1Material;
            break;
        case HIGHER_CROSSING:
            var h = new CANNON.Box(new V(hgs, hgs, 0.5 * rampHeight));
            this.rigidBody = new CANNON.RigidBody(0, h, groundPhysicsMaterial);
            this.rigidBody.position = new V(0, 0, 0.5 * rampHeight);
            this.rigidBody.initPosition = new V(0, 0, 0.5 * rampHeight);
            this.threeObject.position.add(new THREE.Vector3(0, 0, 0.5 * rampHeight));
            geometry = new THREE.CubeGeometry(hgs * 2, hgs * 2, rampHeight);
            material = rampMaterial;
            break;
        case TUNNEL_EW:
        case TUNNEL_NS:
            var h = new CANNON.Box(new V(hrw, hgs, 0.1 * rampHeight));
            this.rigidBody = new CANNON.RigidBody(0, h, groundPhysicsMaterial);
            this.rigidBody.position = new V(0, 0, 0.9 * rampHeight);
            this.rigidBody.initPosition = new V(0, 0, 0.9 * rampHeight);
            this.threeObject.position.add(new THREE.Vector3(0, 0, 0.9 * rampHeight));
            geometry = new THREE.CubeGeometry(hrw * 2, hgs * 2, 0.1 * rampHeight * 2);
//            geometry = createCannonGeometry(h.convexPolyhedronRepresentation, new V(0, 0, 0.9 * rampHeight));
            material = rampMaterial;
            break;
        case RAMP_N:
        case RAMP_E:
        case RAMP_S:
        case RAMP_W:

            var h = new CANNON.ConvexPolyhedron([
                new V(-hrw,-hgs,0), // 0
                new V( hrw,-hgs,0), // 1
                new V( hrw, hgs,0), // 2
                new V(-hrw, hgs,0), // 3
                new V(-hrw, hgs,rampHeight), // 4
                new V( hrw, hgs,rampHeight) // 5
            ],
                [[1,5,4,0], // A
                    [2,5,1], // B
                    [0,4,3], // C
                    [3,4,5,2], // D
                    [3,2,1,0] // E
                ],
                [new V( 0, -rampHeight,GRID_CELL_SIZE).unit(), // A
                    new V( 1, 0, 0), // B
                    new V( -1,0, 0), // C
                    new V( 0, 1, 0), // D
                    new V(0, 0, -1) // E
                ]
            );
            this.rigidBody = new CANNON.RigidBody(0, h, groundPhysicsMaterial);

            geometry = createCannonGeometry(h);
            material = rampMaterial;
            break;
    }

    if (geometry && material) {
        this.mainBody = new THREE.Mesh(geometry, material);
        this.mainBody.useQuaternion = true;
        this.mainBody.receiveShadow = true;
        this.threeObject.add(this.mainBody);
    }

    // Always add ground tile mesh


    // Add road stuff
    switch (tileId) {
        case ROAD_CROSSING:
            var planeGeom1 = new THREE.PlaneGeometry(GRID_CELL_SIZE * 0.5, GRID_CELL_SIZE);
            var planeGeom2 = new THREE.PlaneGeometry(GRID_CELL_SIZE, GRID_CELL_SIZE * 0.5);
            var roadMesh1 = new THREE.Mesh(planeGeom1, roadMaterial);
            var roadMesh2 = new THREE.Mesh(planeGeom2, roadMaterial);
            roadMesh1.position = this.threeObject.position.clone().negate().add(new THREE.Vector3(0, 0, 0.02));
            roadMesh2.position = this.threeObject.position.clone().negate().add(new THREE.Vector3(0, 0, 0.02));
            roadMesh1.useQuaternion = true;
            roadMesh2.useQuaternion = true;
            roadMesh1.receiveShadow = true;
            roadMesh2.receiveShadow = true;
            this.threeObject.add(roadMesh1);
            this.threeObject.add(roadMesh2);
            break;
        case TUNNEL_NS:
        case TUNNEL_EW:
            this.planeGeom = new THREE.PlaneGeometry(GRID_CELL_SIZE, GRID_CELL_SIZE * 0.5);
            var roadMesh = new THREE.Mesh(this.planeGeom, roadMaterial);
            roadMesh.position = this.threeObject.position.clone().negate().add(new THREE.Vector3(0, 0, 0.02));
            roadMesh.useQuaternion = true;
            roadMesh.receiveShadow = true;
            this.threeObject.add(roadMesh);
            break;
        case PLAYER_N:
        case PLAYER_E:
        case PLAYER_S:
        case PLAYER_W:
            var planeGeom = new THREE.PlaneGeometry(GRID_CELL_SIZE * 0.5, GRID_CELL_SIZE);
            var roadMesh = new THREE.Mesh(planeGeom, startMaterial);
            roadMesh.position = this.threeObject.position.clone().negate().add(new THREE.Vector3(0, 0, 0.02));
            roadMesh.useQuaternion = true;
            roadMesh.receiveShadow = true;
            this.threeObject.add(roadMesh);
            break;
        case GOAL_N:
        case GOAL_E:
        case GOAL_S:
        case GOAL_W:
            var planeGeom = new THREE.PlaneGeometry(GRID_CELL_SIZE * 0.5, GRID_CELL_SIZE);
            var roadMesh = new THREE.Mesh(planeGeom, goalMaterial);
            roadMesh.position = this.threeObject.position.clone().negate().add(new THREE.Vector3(0, 0, 0.02));
            roadMesh.useQuaternion = true;
            roadMesh.receiveShadow = true;
            this.threeObject.add(roadMesh);
            break;
        case ROAD_NS:
        case ROAD_EW:
            this.planeGeom = new THREE.PlaneGeometry(GRID_CELL_SIZE * 0.5, GRID_CELL_SIZE);
            var roadMesh = new THREE.Mesh(this.planeGeom, roadMaterial);
            roadMesh.position = this.threeObject.position.clone().negate().add(new THREE.Vector3(0, 0, 0.02));
            roadMesh.useQuaternion = true;
            roadMesh.receiveShadow = true;
            this.threeObject.add(roadMesh);
            break;
        case ROAD_TURN_EN:
        case ROAD_TURN_NW:
        case ROAD_TURN_SE:
        case ROAD_TURN_WS:
            var planeGeom1 = new THREE.PlaneGeometry(GRID_CELL_SIZE * 0.5, GRID_CELL_SIZE * 0.75);
            var planeGeom2 = new THREE.PlaneGeometry(GRID_CELL_SIZE * 0.25, GRID_CELL_SIZE * 0.5);
            var roadMesh1 = new THREE.Mesh(planeGeom1, roadMaterial);
            var roadMesh2 = new THREE.Mesh(planeGeom2, roadMaterial);
            roadMesh1.position = this.threeObject.position.clone().negate().add(new THREE.Vector3(0, -GRID_CELL_SIZE * 0.125, 0.02));
            roadMesh2.position = this.threeObject.position.clone().negate().add(new THREE.Vector3((0.5 - 0.125) * GRID_CELL_SIZE, 0, 0.02));
            roadMesh1.useQuaternion = true;
            roadMesh2.useQuaternion = true;
            roadMesh1.receiveShadow = true;
            roadMesh2.receiveShadow = true;
            this.threeObject.add(roadMesh1);
            this.threeObject.add(roadMesh2);
            break;

    }

    this.threeObject.scale.set(1, 1, 1);

    this.threeObject.rotateOnAxis(new THREE.Vector3(0, 0, 1), angle);
    if (this.rigidBody) {
        GameState.world.add(this.rigidBody);
        GameState.solidBodies.push(this.rigidBody);

        var q = this.threeObject.quaternion;
        this.rigidBody.quaternion.set(q.x, q.y, q.z, q.w);
        this.rigidBody.initQuaternion.set(q.x, q.y, q.z, q.w);
    }

    this.angle = angle;
//    var rigidShape = new CANNON.Box(new CANNON.Vec3(GRID_CELL_SIZE * 0.5, GRID_CELL_SIZE * 0.5, GRID_CELL_SIZE * 0.5));
//
//    this.rigidBody = new CANNON.RigidBody(0, rigidShape);

}
GroundTile.prototype = new StationaryObject();

GroundTile.prototype.setPosition = function(pos) {
    this.threeObject.position.add(new THREE.Vector3(pos.x, pos.y, pos.z));
    if (this.rigidBody) {
        this.rigidBody.position = this.rigidBody.position.vadd(t2c(pos));
        this.rigidBody.initPosition = this.rigidBody.initPosition.vadd(t2c(pos));
    }
    if (this.rigidBodies) {
        for (var i=0; i<this.rigidBodies.length; i++) {
            var rb = this.rigidBodies[i];
            rb.position = rb.position.vadd(t2c(pos));
            rb.initPosition = rb.initPosition.vadd(t2c(pos));
        }
    }
};

function DynamicObject() {
    GameObject.call(this);
}
DynamicObject.prototype = new GameObject();


function LivingObject() {
    DynamicObject.call(this);

    this.isPlayer = false;

    this.health = 1.0;
    this.maxHealth = this.health;

    this.isDead = false;

}
LivingObject.prototype = new DynamicObject();

LivingObject.prototype.step = function() {
    DynamicObject.prototype.step.call(this);

    this.ticks++;

};

LivingObject.prototype.getClosestLivingPlayer = function() {

    var closestLivingPlayer = null;
    var closestDistance = 999999;
    for (var i=0; i<GameState.players.length; i++) {
        var player = GameState.players[i];
        if (player.threeObject && !player.isDead) {
            var diffVec = player.threeObject.position.clone();
            diffVec.sub(this.threeObject.position);
            var dist = diffVec.length();
            if (dist < closestDistance) {
                closestDistance = dist;
                closestLivingPlayer = player;
            }
        }
    }

    return closestLivingPlayer;
};




LivingObject.prototype.die = function() {
    this.removeMe = true;
};


function Building(c) {
    LivingObject.call(this);
};
Building.prototype = new LivingObject();


function createCubeGeometry() {
    if (cubeGeometry == null) {
        cubeGeometry = new THREE.CubeGeometry(1, 1, 1);
    }

}


function House1(c) {
    Building.call(this);

    this.maxHealth = 5;
    this.health = this.maxHealth;

    createCubeGeometry();
    var material = GameState.renderer.getHouse1Material();
    this.threeObject = new THREE.Mesh(cubeGeometry, material);
    this.threeObject.castShadow = true;
    this.threeObject.receiveShadow = true;
}
House1.prototype = new Building(true);




function House2() {
    Building.call(this);

    this.maxHealth = 5;
    this.health = this.maxHealth;

    createCubeGeometry();
    var material = GameState.renderer.getHouse2Material();
    this.threeObject = new THREE.Mesh(cubeGeometry, material);
    this.threeObject.castShadow = true;
    this.threeObject.receiveShadow = true;
}
House2.prototype = new Building();



function Checkpoint() {
    GameObject.call(this);
    var material = GameState.renderer.getCheckpointMaterial();
    this.cpMaterial = material;
    material.transparent = true;
    if (!checkpointGeometry) {
        checkpointGeometry = new THREE.CylinderGeometry(0.01, 0.5, 1);
    }
    this.threeObject = new THREE.Object3D();
    this.cp = new THREE.Mesh(checkpointGeometry, material);
    this.cp.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI * 0.5);
//    this.cp.position.add(new THREE.Vector3(0, 0, GRID_CELL_SIZE * 0.5));
    this.cp.scale.set(GRID_CELL_SIZE, GRID_CELL_SIZE * 5, GRID_CELL_SIZE);

    this.inScene = true;

    this.playersLeft = createFilledNumericIncArray(gameSettings.playerCount, 1, 1);

    this.threeObject.add(this.cp);
}
Checkpoint.prototype = new GameObject();


Checkpoint.prototype.step = function() {
//    logit(GameState.counter2);
    var scale = 0.4 + 0.2 * Math.sin(GameState.counter2 * 0.01);
    this.cp.scale.set(GRID_CELL_SIZE * scale, GRID_CELL_SIZE * scale * 5, GRID_CELL_SIZE * scale);

    var closestDistance = 1000;
    for (var i=0; i<GameState.players.length; i++) {
        var player = GameState.players[i];
        var diff = player.threeObject.position.clone().sub(this.threeObject.position);
        var dist = diff.length();
        closestDistance = Math.min(closestDistance, dist);
        if (dist < GRID_CELL_SIZE * 0.5 && arrayContains(this.playersLeft, i + 1)) {
            arrayDelete(this.playersLeft, i + 1);
            if (this.playersLeft.length == 0) {
                this.removeMe = true;
            }
            player.checkpointsTaken++;

//            playIfAvailable(sounds.checkpoint.sound);
//            var sp = worldToScreenPosition(player.threeObject.position);
//            var message = new ScreenMessage("Checkpoint", sp.x, sp.y - 50);
//            message.duration = 75;
//            message.dy = -0.25;
//            GameState.screenMessages.push(message);
        }

    }
    if (this.inScene && closestDistance > GRID_CELL_SIZE * 5) {
        GameState.scene.remove(this.threeObject);
        this.inScene = false;
    } else if (!this.inScene && closestDistance < GRID_CELL_SIZE * 5) {
        GameState.scene.add(this.threeObject);
        this.inScene = true;
    }

    if (this.inScene) {
        this.cpMaterial.opacity = 0.7 / (1 + 0.5 * closestDistance / GRID_CELL_SIZE);
    }

//    this.cp.position.set(new THREE.Vector3(0, 0, 0)); //GRID_CELL_SIZE * 0.5 * scale));
};



function Goal() {
    GameObject.call(this);
    var material = GameState.renderer.getGoalMaterial();
    this.goalMaterial = material;
    material.transparent = true;
    if (!checkpointGeometry) {
        checkpointGeometry = new THREE.CylinderGeometry(0.01, 0.5, 1);
    }
    this.threeObject = new THREE.Object3D();
    this.goal = new THREE.Mesh(checkpointGeometry, material);
    this.goal.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI * 0.5);
//    this.cp.position.add(new THREE.Vector3(0, 0, GRID_CELL_SIZE * 0.5));
    this.goal.scale.set(GRID_CELL_SIZE, GRID_CELL_SIZE, GRID_CELL_SIZE);

    this.inScene = true;

    this.playersLeft = createFilledNumericIncArray(gameSettings.playerCount, 1, 1);

    this.threeObject.add(this.goal);
}
Goal.prototype = new GameObject();


Goal.prototype.step = function() {
//    logit(GameState.counter2);
    var scale = 0.4 + 0.2 * Math.sin(GameState.counter2 * 0.01);
    this.goal.scale.set(GRID_CELL_SIZE * scale, GRID_CELL_SIZE * scale * 10, GRID_CELL_SIZE * scale);

    var closestDistance = 1000;

    for (var i=0; i<GameState.players.length; i++) {
        var player = GameState.players[i];
        var diff = player.threeObject.position.clone().sub(this.threeObject.position);
        var dist = diff.length();
        closestDistance = Math.min(closestDistance, dist);
        if (dist < GRID_CELL_SIZE * 0.5 && GameState.subState == GameSubState.PLAYING) {
            if (player.checkpointsTaken >= GameState.checkpointCount && arrayContains(this.playersLeft, i + 1)) {
                arrayDelete(this.playersLeft, i + 1);
                if (this.playersLeft.length == 0) {
                    this.removeMe = true;
                }
                var nextLevelIndex = gameSettings.levelIndex + 1;
                GameState.counter1 = 0;
//                logit("next level index " + nextLevelIndex + " " + levelArr.length);
//                logit("unlocked maybe " + nextLevelIndex);
                if (nextLevelIndex < levelArr.length) {
                    GameState.subState = GameSubState.COMPLETING;
                    gameSettings.unlockedLevels = Math.max(gameSettings.unlockedLevels, nextLevelIndex);
                    updateStandardLevel();
                    gameSettings.saveToLocalStorage();
                } else {
                    GameState.subState = GameSubState.COMPLETING_GAME;
                }
            }
        }

    }
    if (this.inScene && closestDistance > GRID_CELL_SIZE * 5) {
        GameState.scene.remove(this.threeObject);
        this.inScene = false;
    } else if (!this.inScene && closestDistance < GRID_CELL_SIZE * 5) {
        GameState.scene.add(this.threeObject);
        this.inScene = true;
    }

    if (this.inScene) {
        this.goalMaterial.opacity = 0.7 / (1 + 0.25 * closestDistance / GRID_CELL_SIZE);
    }


};




function createPhysicsMaterials() {
    if (!playerPhysicsMaterial) {
        playerPhysicsMaterial = new CANNON.Material();
        groundPhysicsMaterial = new CANNON.Material();
        GameState.world.addContactMaterial(new CANNON.ContactMaterial(playerPhysicsMaterial, groundPhysicsMaterial, 0.005, 0.9));
    }
}


function Player(index) {
    LivingObject.call(this);

    this.index = index;
    createPhysicsMaterials();

    this.checkpointsTaken = 0;

    var allLeftButtons = [[Input.ARROW_LEFT], [Input.A], [Input.J], [Input.F]];
    var allRightButtons = [[Input.ARROW_RIGHT], [Input.D], [Input.L], [Input.H]];
    var allUpButtons = [[Input.ARROW_UP], [Input.W], [Input.I], [Input.T]];
    var allDownButtons = [[Input.ARROW_DOWN], [Input.S], [Input.K], [Input.G]];
    var allControlGravityButtons = [[Input.CTRL], [Input.SHIFT], [Input.N], [Input.V]];

    this.leftButtons = allLeftButtons[index];
    this.rightButtons = allRightButtons[index];
    this.upButtons = allUpButtons[index];
    this.downButtons = allDownButtons[index];
    this.gravityButtons = allControlGravityButtons[index];

    function stealOtherButtons(buttons, buttonsArr) {
        for (var i=0; i<buttonsArr.length; i++) {
            if (i >= gameSettings.playerCount) {
                // Can steal
                var stealIndex = i % gameSettings.playerCount;
                if (stealIndex == index) {
                    addAll(buttons, buttonsArr[i]);
                }
            }
        }
    }
    stealOtherButtons(this.leftButtons, allLeftButtons);
    stealOtherButtons(this.rightButtons, allRightButtons);
    stealOtherButtons(this.upButtons, allUpButtons);
    stealOtherButtons(this.downButtons, allDownButtons);
    stealOtherButtons(this.gravityButtons, allControlGravityButtons);

    this.isPlayer = true;


    createCubeGeometry();

    if (!sphereGeometry) {
        sphereGeometry = new THREE.SphereGeometry(0.5);
    }
    if (!cylinderGeometry) {
        cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1);
    }

    this.bodyMaterial = GameState.renderer.getPlayerMaterial();
    this.turnAngle = 0.0;
    this.targetTurnAngle = 0.0;
    this.pitchAngle = 0.0;
    this.targetPitchAngle = 0.0;

    this.threeObject = new THREE.Object3D();
    this.threeObject.castShadow = true;
    this.threeObject.receiveShadow = true;

    this.threeObject.useQuaternion = true;

    this.hiddenBySolids = [];

    var rigidShape = new CANNON.Box(new CANNON.Vec3(PLAYER_WIDTH * 0.5, PLAYER_LENGTH * 0.5, PLAYER_HEIGHT * 0.5));
    this.rigidBody = new CANNON.RigidBody(80, rigidShape, playerPhysicsMaterial);
    this.rigidBody.linearDamping = 0.1;
    this.rigidBody.angularDamping = 0.2;


    this.mainBody = new THREE.Mesh(cubeGeometry, this.bodyMaterial);
    this.mainBody.scale.set(PLAYER_WIDTH, PLAYER_LENGTH, PLAYER_HEIGHT);
    this.mainBody.position.set(0, 0, 0);
    this.mainBody.castShadow = true;
    this.mainBody.receiveShadow = true;
    this.threeObject.add(this.mainBody);

    this.projector = new THREE.Projector();

    var o = 0.55;
    this.wheelLocalPositions = [
        new THREE.Vector3(PLAYER_WIDTH * o, PLAYER_LENGTH * o, 0),
        new THREE.Vector3(-PLAYER_WIDTH * o, PLAYER_LENGTH * o, 0),
        new THREE.Vector3(PLAYER_WIDTH * o, -PLAYER_LENGTH * o, 0),
        new THREE.Vector3(-PLAYER_WIDTH * o, -PLAYER_LENGTH * o, 0)
    ];

    var sl = PLAYER_HEIGHT * 0.5 + SUSPENSION_LENGTH;
    this.wheelSuspensionLengths = createFilledArray(4, sl);
    this.oldWheelSuspensionLengths = createFilledArray(4, sl);

    this.wheelLocalDirections = [
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 1, 0)
    ];

    this.wheelAngles = [0, 0, 0, 0];

    this.wheels = [];
    // Adding wheels

    this.wheelRadius = 0.6;
    for (var i=0; i<this.wheelLocalPositions.length; i++) {
        var off = this.wheelLocalPositions[i];
        var wheel = new THREE.Mesh(cylinderGeometry, this.bodyMaterial);
        wheel.useQuaternion = true;
        wheel.scale.set(this.wheelRadius * 2, 0.75, this.wheelRadius * 2);
        wheel.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2);
//        wheel.rota(Math.PI);
        wheel.castShadow = false;
        wheel.receiveShadow = false;
        this.threeObject.add(wheel);
        this.wheels.push(wheel);
    }

    this.wheelHit = false;
}

Player.prototype = new LivingObject();


Player.prototype.addToScene = function(scene) {
//    logit("player added to scene");
    scene.add(this.threeObject);
};



Player.prototype.removeFromScene = function(scene) {
//    logit("player removed from scene");
    scene.remove(this.threeObject);
//    this.threeObject = null;
//    GameState.renderer.renderer.deallocateObject(this.threeObject);
};


Player.prototype.checkHidden = function() {

//    var canvas = GameState.canvas;
//
//    var vector = new THREE.Vector3( canvas.width * 0.5,canvas.height * 0.5, 0.5 );
//    this.projector.unprojectVector( vector, GameState.camera );


    var plPos = this.threeObject.position;
    var camPos = GameState.cameras[0].position;

    var dir = plPos.clone().sub(camPos).normalize();
    var rayCaster = new THREE.Raycaster( camPos, dir); //vector.sub( GameState.camera.position ).normalize() );

//    logit(ray);

//    logit(" " + dir.x + " " + dir.y + " " + dir.z);

//    for (var i=0; i<this.hiddenBySolids.length; i++) {
//        var h = this.hiddenBySolids[i];
//        for (var j=0; j<h.blinkingMaterials.length; j++) {
//            var mat = h.blinkingMaterials[j];
//            mat.opacity = 1;
//            mat.transparent = false;
//        }
//    }

    this.hiddenBySolids = [];

    var objects = [];
    for (var i=0; i<GameState.solids.length; i++) {
        var solid = GameState.solids[i];
        var threeObj = solid.threeObject;
        threeObj._theSolid = solid;

//        if (threeObj.position.y < plPos.y) {
//            this.hiddenBySolids.push(solid);
//        } else {
        objects.push(threeObj);
//        }
    }

    var intersects = rayCaster.intersectObjects( objects, true );

    if (intersects.length > 0) {
//        logit("solid intersected player!");
        for (var i=0; i<intersects.length; i++) {
            var inter = intersects[i];
            var obj = inter.object;
            var solid = obj._theSolid;
            this.hiddenBySolids.push(solid);
        }
    }

};

Player.prototype.step = function() {


    GameState.playerSteps++;


    this.rigidBody.position.copy(this.threeObject.position);
    this.rigidBody.quaternion.copy(this.threeObject.quaternion);

    var pos = this.threeObject.position.clone();

    var velocity = new THREE.Vector3();
    this.rigidBody.velocity.copy(velocity);

//    if ((this.ticks % 5) == 0) {
//        this.checkHidden();
//    }

    var leftDown = Input.isAnyDown(this.leftButtons);
    var rightDown = Input.isAnyDown(this.rightButtons);
    var upDown = Input.isAnyDown(this.upButtons);
    var downDown = Input.isAnyDown(this.downButtons);
    var gravityDown = Input.isAnyDown(this.gravityButtons);

    var ctrlXAxis = Input.xAxes[this.index];
    var ctrlYAxis = Input.yAxes[this.index];

    if (upDown) {
        ctrlYAxis = 1;
    } else if (downDown) {
        ctrlYAxis = -1;
    }
    if (rightDown) {
        ctrlXAxis = 1;
    } else if (leftDown) {
        ctrlXAxis = -1;
    }

    if (GameState.counter3 < COUNTDOWN) {
        ctrlXAxis = 0;
        ctrlYAxis = 0;
    }
    if (GameState.counter3 == 100) {
        var sp = worldToScreenPosition(this.threeObject.position);
        var readyMessage = new ScreenMessage("Ready!", sp.x, sp.y - 100);
        readyMessage.duration = 200;
        readyMessage.dy = 0;
        GameState.screenMessages.push(readyMessage);
    }
    if (GameState.counter3 == COUNTDOWN) {
        var sp = worldToScreenPosition(this.threeObject.position);
        var goMessage = new ScreenMessage("GO!", sp.x, sp.y - 100);
        goMessage.duration = 200;
        goMessage.dy = 0;
        GameState.screenMessages.push(goMessage);
    }

    var wheelsToTurn = [0, 1];

    var localRefForward = new THREE.Vector3(0, 1, 0);
    var localUp = new THREE.Vector3(0, 0, 1);
    for (var i=0; i<wheelsToTurn.length; i++) {
        var wheelIndex = wheelsToTurn[i];
        var localDir = this.wheelLocalDirections[wheelIndex];
        localDir.set(0, 1, 0);
//        if (ctrlXAxis) {
            var oldAngle = this.wheelAngles[i];
            var wantedAngle = -ctrlXAxis * 0.6;
            var step = 0.01;

            var newAngle;
            var diff = wantedAngle - oldAngle;
            if (diff > 0) {
                newAngle = oldAngle + Math.min(step, diff);
            } else {
                newAngle = oldAngle - Math.min(step, -diff);
            }

            localDir.applyAxisAngle(localUp, newAngle);
//        }

        var angle = -ctrlXAxis * localDir.angleTo(localRefForward);
//        logit("Angle " + angle);
//        logit("Local dir " + localDir.x + " " + localDir.y);

        this.wheelAngles[i] = angle;
    }

    var gravity = c2t(GameState.world.gravity);
    var gravityNorm = gravity.clone().normalize();
    var negGravityNorm = gravityNorm.clone().negate();

    var center = this.threeObject.localToWorld(new THREE.Vector3());
    var toUp = this.threeObject.localToWorld(new THREE.Vector3(0, 0, 1));
    var toDown = this.threeObject.localToWorld(new THREE.Vector3(0, 0, -1));
    var worldUp = toUp.clone().sub(center);

    var angVelMag = this.rigidBody.angularVelocity.norm();

    var angleToUp = worldUp.angleTo(negGravityNorm);
    var onCorrectionAngle = Math.PI * 0.1;

//    if (Math.random() < 0.01 && angVelMag > 0.1) {
//        logit("Ang vel mag: " + angVelMag);
//    }
    if (!this.wheelHit && angleToUp > onCorrectionAngle) {
        // Apply correction torque
        var axis = worldUp.clone().cross(negGravityNorm);
        var forceDir = axis.clone().cross(worldUp).normalize();
        var multiplier = 1 / (1 + angVelMag);
        var mag = clamp(50 * (angleToUp - onCorrectionAngle), 0, 80) * multiplier;
        this.rigidBody.applyForce(t2c(forceDir.multiplyScalar(-mag)), t2c(toUp));
        this.rigidBody.applyForce(t2c(forceDir.multiplyScalar(mag)), t2c(toDown));
    }


    this.wheelHit = false;

    // Do some raycasts for the wheels
    // Pairs of [local pos, local dir]
    for (var i=0; i<this.wheelLocalPositions.length; i++) {
        var off = this.wheelLocalPositions[i];
        var localDir = this.wheelLocalDirections[i];

        var from = this.threeObject.localToWorld(off.clone());
        var toDown = this.threeObject.localToWorld(new THREE.Vector3(off.x, off.y, off.z - 1));

        var toForward = this.threeObject.localToWorld(new THREE.Vector3(off.x + localDir.x, off.y + localDir.y, off.z + localDir.z));

        var down = toDown.clone().sub(from);
        var forward = toForward.clone().sub(from);
        var right = toForward.clone().crossVectors(down, forward);

        var ray = new CANNON.Ray(new CANNON.Vec3(from.x, from.y, from.z), new CANNON.Vec3(down.x, down.y, down.z));

        var intersects = ray.intersectBodies(GameState.solidBodies);

        // Each intersect is like this:
        //        intersect = {
        //            distance: this.origin.distanceTo( intersectPoint ),
        //            point: intersectPoint.copy(),
        //            face: face,
        //            body: body
        //        };

        var wantedDist = PLAYER_HEIGHT * 0.5 + SUSPENSION_LENGTH;

        var wheelSuspSpeed = (this.wheelSuspensionLengths[i] - this.oldWheelSuspensionLengths[i]) * SIMULATION_SPEED;

//        if (Math.abs(wheelSuspSpeed) > 0.2 * SIMULATION_SPEED) {
//            logit(wheelSuspSpeed);
//        }

        wheelSuspSpeed = clamp(wheelSuspSpeed, -0.2 * SIMULATION_SPEED, 0.2 * SIMULATION_SPEED);


        this.oldWheelSuspensionLengths[i] = this.wheelSuspensionLengths[i];

        this.wheelSuspensionLengths[i] = wantedDist;
        if (intersects.length > 0) {
            var dist = intersects[0].distance;
            var face = intersects[0].face;
            var body = intersects[0].body;

            var shape = body.shape;

            if (shape instanceof CANNON.Box) {
                shape = shape.convexPolyhedronRepresentation;
            }

            // Need to find the face index?

            var faceIndex = -1;
            for (var k=0; k<shape.faces.length; k++) {
                var testFace = shape.faces[k];
                var foundIt = false;
                if (testFace.length == face.length) {
                    foundIt = true;
                    for (var j=0; j<face.length; j++) {
                        if (face[j] != testFace[j]) {
                            foundIt = false;
                            break;
                        }
                    }
                }
                if (foundIt) {
                    faceIndex = k;
                    break;
                }
            }
//
            var hitNormal = new THREE.Vector3(0, 0, 1);
            if (faceIndex > -1) {

                hitNormal = shape.faceNormals[faceIndex].toThreeJs();
//                if (ctrlYAxis) {
//                    logit(faceIndex);
////                    logit(face);
////                    logit(shape.faces[faceIndex]);
//                    logit(shape.faceNormals[faceIndex]);
//                }

            }

            if (dist > 0.001) {
                if (dist < wantedDist) {

                    this.wheelHit = true;
                    this.wheelSuspensionLengths[i] = dist;

                    var diff = wantedDist - dist;

                    var dampForce = wheelSuspSpeed * 80;
                    var forceMag = diff * 800 - dampForce;

//                    if (Math.random() < 0.01) {
//                        logit(forceMag + " " + dampForce);
//                    }

                    this.rigidBody.applyForce(new CANNON.Vec3(forceMag * -down.x, forceMag * -down.y, forceMag * -down.z), new CANNON.Vec3(from.x, from.y, from.z));
//                logit("Hit dist: " + dist + " mag: " + forceMag);
//                logit("speed force: " + dampForce);

//                    var hitNormal = new THREE.Vector3(0, 0, 1);
                    var forwardProj = forward.clone().projectOnPlane(hitNormal);

                    var rightProj = right.clone().projectOnPlane(hitNormal);


                    var forwardForceMag = ctrlYAxis * forceMag;
                    if (forwardForceMag != 0) {
                        // Project the forward force onto plane
//                    var frictionForce = new CANNON.Vec3(forwardForceMag * forward.x, forwardForceMag * forward.y, forwardForceMag * forward.z);
                        var frictionForce = new CANNON.Vec3(forwardForceMag * forwardProj.x, forwardForceMag * forwardProj.y, forwardForceMag * forwardProj.z);

                        this.rigidBody.applyForce(frictionForce,
                            new CANNON.Vec3(from.x, from.y, from.z));
//                    logit("forward force mag " + forwardForceMag);
                    }

                    // Apply friction for the side
                    // Note: add ang vel velocity as well...

                    var rotVel = this.rigidBody.angularVelocity.cross(new CANNON.Vec3(from.x - pos.x, from.y - pos.y, from.z - pos.z));

//                    logit("Rot vel " + rotVel.x + " " + rotVel.y + " " + rotVel.z);
                    var wheelVel = velocity.clone().add(rotVel);

                    var vsp = wheelVel.clone().projectOnVector(rightProj);

                    var sideForceMag = -0.15 * forceMag;

                    var sideFrictionForce = new CANNON.Vec3(sideForceMag * vsp.x, sideForceMag * vsp.y, sideForceMag * vsp.z);
                    var sideFricDist = dist * 0.08;
                    this.rigidBody.applyForce(sideFrictionForce,
                        new CANNON.Vec3(from.x + down.x * sideFricDist, from.y + down.y * sideFricDist, from.z + down.z * sideFricDist));


                }
            }
        }
        var wheel = this.wheels[i];
        wheel.position.set(off.x, off.y, off.z - this.wheelSuspensionLengths[i] + this.wheelRadius);
        wheel.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), this.wheelAngles[i] + Math.PI * 0.5);
    }



//    var wheelTorque = 1;

//    var rbPos = this.rigidBody.position;
//    var absForce = 10000;
//    this.rigidBody.applyForce(new CANNON.Vec3(xAxis * absForce, yAxis * absForce, 0), rbPos);

//    LivingObject.prototype.step.call(this);

};


function getGoodScreenMessagePos(index) {
    var sp = worldToScreenPosition(GameState.players[index].threeObject.position);
    sp.y -= 0;
    for (var i=0; i<GameState.screenMessages.length; i++) {
        var m = GameState.screenMessages[i];
        if (Math.abs(m.position.y - sp.y) < 30) {
            sp.y += 30;
        }
    }
    return sp;
}