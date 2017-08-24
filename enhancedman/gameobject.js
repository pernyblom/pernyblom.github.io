
var bodyGeometry = null;
var bodyMaterial = null;

var headGeometry = null;
var headMaterial = null;

var legGeometry = null;
var legMaterial = null;

var armGeometry = null;
var armMaterial = null;

var goalGeometry = null;
var goalMaterial = null;

var materials = {};
var geometries = {};


function GameObject(size) {
    if (!size) {
        size = GRID_SIZE;
    }
    this.removeMe = false;
    this.ticks = 0;
    this.threeObject = null;
    this.collisionRect = [0, 0, size, size];
    this.initialPosition = null;
}

GameObject.prototype.step = function() {
};
GameObject.prototype.removed = function() {
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


function Goal() {
    GameObject.call(this, GRID_SIZE);

    if (goalGeometry == null) {
        goalGeometry = new THREE.CubeGeometry(GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }
    if (goalMaterial == null) {
        if (GameState.renderer instanceof THREE.CanvasRenderer) {
            goalMaterial = new THREE.MeshBasicMaterial({color: 0xffff11, emissive: 0xeeee00});
        } else {
            goalMaterial = new THREE.MeshLambertMaterial({color: 0xffff11, emissive: 0xeeee00});
        }
    }
    this.threeObject = new THREE.Mesh(goalGeometry, goalMaterial);

}
Goal.prototype = new GameObject();

Goal.prototype.step = function() {
    this.ticks++;
    this.threeObject.rotation.y += 0.08;
    this.threeObject.position.y = this.initialPosition.y + 0.2 * GRID_SIZE * Math.sin(this.ticks * 0.1);
    if (this.light) {
        this.light.position.x = this.threeObject.position.x;
        this.light.position.y = this.threeObject.position.y;
        this.light.position.z = this.threeObject.position.z;
    }

//    var closestGoals = [];
//    for (var i=0; i<GameState.goals.length; i++) {
//        var goal = GameState.goals;
//        var distanceToPlayer = goal.threeObject.position.distanceTo(GameState.player.threeObject.position);
//
//    }
//
//    if (closestGoal) {
//    }
    var distanceToPlayer = this.threeObject.position.distanceTo(GameState.player.threeObject.position);
    if (this.light && distanceToPlayer > 15 * GRID_SIZE) {
        GameState.availableGoalLights.push(this.light);
        this.light = null;
//        logit("Removing light " + distanceToPlayer);
    } else if (!this.light && distanceToPlayer < 12 * GRID_SIZE && GameState.availableGoalLights.length > 0) {
        this.light = GameState.availableGoalLights.pop();
        GameState.scene.add(this.light);
//        logit("Adding light " + distanceToPlayer);
    }
};

Goal.prototype.removeFromScene = function(scene) {
    GameObject.prototype.removeFromScene.call(this, scene);
    if (this.light) {
        GameState.availableGoalLights.push(this.light);
        this.light.position = new THREE.Vector3(-99999, 0, 0);
        this.light = null;
    }
//    scene.remove(this.light);
//    this.lightPartOfScene = false;
};


Goal.prototype.addToScene = function(scene) {
    GameObject.prototype.addToScene.call(this, scene);
//    if (GameState.renderer instanceof THREE.CanvasRenderer) {
//    } else {

//        scene.add(this.light);
//    }
};

function ColoredBlock(type, color, emissive, size) {
    GameObject.call(this, size);

    this.type = type;

    if (!size) {
        size = GRID_SIZE;
    }

    if (!emissive) {
        emissive = 0x000000;
    }

    var geometry = geometries[type];

    if (!geometry) {
        geometry = new THREE.CubeGeometry(size, size, size);
        geometries[type] = geometry;
    }
    var material = materials[type];
    if (!material) {
        if (GameState.renderer instanceof THREE.CanvasRenderer) {
            if (!emissive) {
                material = new THREE.MeshLambertMaterial({color: color, emissive: emissive});
            } else {
                material = new THREE.MeshBasicMaterial({color: emissive});
            }
        } else {
            material = new THREE.MeshLambertMaterial({color: color, emissive: emissive});
        }
        materials[type] = material;
    }
    this.threeObject = new THREE.Mesh(geometry, material);

    this.emitFire = false;
    if (type == "fire") {
        this.emitFire = true;
        this.emitInterval = Math.round(50 + 20 * Math.random());
    }
}
ColoredBlock.prototype = new GameObject();


function MovingColoredBlock(type, color, emissive, size, posAmplitude, posFrequency, rotY) {
    ColoredBlock.call(this, type, color, emissive, size);
    this.posAmplitude = posAmplitude;
    this.posFrequencey = posFrequency;
    this.rotY = rotY;
}
MovingColoredBlock.prototype = new ColoredBlock();

MovingColoredBlock.prototype.step = function() {
    this.ticks++;
    this.threeObject.rotation.y += this.rotY;
    this.threeObject.position.y = this.initialPosition.y + this.posAmplitude * GRID_SIZE * Math.sin(this.ticks * this.posFrequencey);
};



function ColoredText(type, color, emissive, size, text) {
    GameObject.call(this, size);

    this.type = type;

    if (!size) {
        size = GRID_SIZE;
    }

    if (!emissive) {
        emissive = 0x000000;
    }

    var geometry = geometries[type];

    if (!geometry) {
        geometry = new THREE.TextGeometry(text, {
            height: size / 4,
            size: size,
//            hover: size,

            curveSegments: 4,

            bevelThickness: 2,
            bevelSize: 1.5,
            bevelSegments: 3,
            bevelEnabled: true,
            bend: true,

            font: "helvetiker", 		// helvetiker, optimer, gentilis, droid sans, droid serif
            weight: "bold",		// normal bold
            style: "normal"
        });
//        geometry.cen

        geometry.boundingBox = null;
        geometry.computeBoundingBox();

        var bb = geometry.boundingBox;
        var centerX = 0.5 * (bb.max.x + bb.min.x);
        var centerY = 0.5 * (bb.max.y + bb.min.y);
        var centerZ = 0.5 * (bb.max.z + bb.min.z);

        var m1 = new THREE.Matrix4();
        m1.translate(new THREE.Vector3(-centerX, -centerY, -centerZ));
        geometry.applyMatrix(m1);

        geometries[type] = geometry;
    }
    var material = materials[type];
    if (!material) {
        if (GameState.renderer instanceof THREE.CanvasRenderer) {
            if (emissive) {
                material = new THREE.MeshBasicMaterial({color: color, emissive: emissive});
            } else {
                material = new THREE.MeshLambertMaterial({color: color, emissive: emissive});
            }
        } else {
            material = new THREE.MeshLambertMaterial({color: color, emissive: emissive});
        }
        materials[type] = material;
    }
    this.threeObject = new THREE.Mesh(geometry, material);
    this.threeObject.rotation.z = -Math.PI / 2;
}
ColoredText.prototype = new GameObject();


function MovingColoredText(type, color, emissive, size, text, posAmplitude, posFrequency, rotY) {
    ColoredText.call(this, type, color, emissive, size, text);
    this.posAmplitude = posAmplitude;
    this.posFrequencey = posFrequency;
    this.rotY = rotY;
}
MovingColoredText.prototype = new ColoredText();

MovingColoredText.prototype.step = function() {
    this.ticks++;
    this.threeObject.rotation.y += this.rotY;
    this.threeObject.position.y = this.initialPosition.y + this.posAmplitude * GRID_SIZE * Math.sin(this.ticks * this.posFrequencey);
};



function PointLight(color, intensity, distance) {
    GameObject.call(this);

    this.threeObject = new THREE.PointLight(color, intensity, distance);
}
PointLight.prototype = new GameObject();


function MovingObject() {
    GameObject.call(this);
    this.velocity = new THREE.Vector3(0, 0, 0);
}
MovingObject.prototype = new GameObject();

MovingObject.prototype.step = function() {
    this.threeObject.position.addSelf(this.velocity);
};


function Particle(type, size, color, emissive) {
    MovingObject.call(this, size);
    this.type = type;

    var material = materials[type];
    if (!material) {
        material = new THREE.MeshLambertMaterial({color: color, emissive: emissive});
        materials[type] = material;
    }
    var geometry = geometries[type];
    if (!geometry) {

    }
    this.threeObject = new THREE.Mesh(goalGeometry, goalMaterial);
}
Particle.prototype = new MovingObject();

Particle.prototype.step = function() {
    MovingObject.prototype.step.call(this);
    this.threeObject.rotation.z += 0.01;
};




function LivingObject() {
    MovingObject.call(this);
    this.health = 1.0;
    this.maxHealth = this.health;
    this.justHitFire = false;
}
LivingObject.prototype = new MovingObject();

LivingObject.prototype.step = function() {
    MovingObject.prototype.step.call(this);
};


var PlayerState = {
    STANDING: 0,
    FLYING: 1,
    SLIDING: 2,
    WALKING: 3
};

function Player() {
    LivingObject.call(this);

    this.health = getMaxHealth();
    this.maxHealth = getMaxHealth();

    this.state = 0; // PlayerState.STANDING;

    this.collisionRect = [0, 0, PLAYER_WIDTH, PLAYER_HEIGHT];

    if (bodyGeometry == null) {
        bodyGeometry = new THREE.CubeGeometry(PLAYER_WIDTH * 0.6, PLAYER_HEIGHT * 0.45, PLAYER_WIDTH);
    }
    if (bodyMaterial == null) {
        if (GameState.renderer instanceof THREE.CanvasRenderer) {
            bodyMaterial = new THREE.MeshBasicMaterial({color: 0x444444});
        } else {
            bodyMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, emissive: 0x440000});
        }
    }
    if (headGeometry == null) {
        headGeometry = new THREE.SphereGeometry(PLAYER_WIDTH * 0.5, 4, 5);
    }
    if (legGeometry == null) {
        var legLength = PLAYER_HEIGHT * 0.5;
        legGeometry = new THREE.CubeGeometry(PLAYER_WIDTH * 0.3, legLength, PLAYER_WIDTH * 0.3);
        var m1 = new THREE.Matrix4();
        m1.translate(new THREE.Vector3(0, -legLength * 0.5, 0));
        legGeometry.applyMatrix(m1);
    }
    if (armGeometry == null) {
        var armLength = PLAYER_HEIGHT * 0.45;
        armGeometry = new THREE.CubeGeometry(PLAYER_WIDTH * 0.25, armLength, PLAYER_WIDTH * 0.25);
        var m1 = new THREE.Matrix4();
        m1.translate(new THREE.Vector3(0, -armLength * 0.5, 0));
        armGeometry.applyMatrix(m1);
    }
    if (headMaterial == null) {
        if (GameState.renderer instanceof THREE.CanvasRenderer) {
            headMaterial = new THREE.MeshBasicMaterial({color: 0x333333});
        } else {
            headMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, emissive: 0x222222});
        }
    }
    if (legMaterial == null) {
        if (GameState.renderer instanceof THREE.CanvasRenderer) {
            legMaterial = new THREE.MeshBasicMaterial({color: 0x444444, emissive: 0x222222});
        } else {
            legMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, emissive: 0x222222});
        }
    }
    if (armMaterial == null) {
        if (GameState.renderer instanceof THREE.CanvasRenderer) {
            armMaterial = new THREE.MeshBasicMaterial({color: 0x666666});
        } else {
            armMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, emissive: 0x222222});
        }
    }
    this.threeObject = new THREE.Mesh(bodyGeometry, bodyMaterial);

    this.leftArm = new THREE.Mesh(armGeometry, armMaterial);
    this.leftArm.position = new THREE.Vector3(0, PLAYER_HEIGHT * 0.3, PLAYER_WIDTH);
    this.threeObject.add(this.leftArm);

    this.rightArm = new THREE.Mesh(armGeometry, armMaterial);
    this.rightArm.position = new THREE.Vector3(0, PLAYER_HEIGHT * 0.3, -PLAYER_WIDTH);
    this.threeObject.add(this.rightArm);

    this.leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    this.leftLeg.position = new THREE.Vector3(0, 0, PLAYER_WIDTH);
    this.threeObject.add(this.leftLeg);

    this.rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    this.rightLeg.position = new THREE.Vector3(0, 0, -PLAYER_WIDTH);
    this.threeObject.add(this.rightLeg);

    this.head = new THREE.Mesh(headGeometry, headMaterial);
    this.head.position = new THREE.Vector3(0, PLAYER_HEIGHT * 0.5, 0);
    this.threeObject.add(this.head);

//    this.playerLight = new THREE.PointLight(0xffffff, 0.7, GRID_SIZE * 7);

    this.jumping = false;

    this.oldAngle = 0.2;
}

Player.prototype = new LivingObject();

Player.prototype.addToScene = function(scene) {
    LivingObject.prototype.addToScene.call(this, scene);
//    if (GameState.renderer instanceof THREE.CanvasRenderer) {
//
//    } else {
//    scene.add(this.playerLight);
//    }
}

Player.prototype.removeFromScene = function(scene) {
    GameObject.prototype.removeFromScene.call(this, scene);
//    if (GameState.renderer instanceof THREE.CanvasRenderer) {
//    } else {
//    scene.remove(this.playerLight);
//    }
};

function getMaxFlyingCorrectionSpeed() {
    return MAX_FLYING_CORRECTION_SPEED + (GameState.aerialControlLevel + GameState.gatheredAerialControlLevel) * 0.1;
}
function getMaxFlyingCorrection() {
    return MAX_FLYING_CORRECTION + (GameState.aerialControlLevel + GameState.gatheredAerialControlLevel) * 0.01;
}
function getPlayerGravity() {
    return Math.max(0.05, PLAYER_GRAVITY - (GameState.aerialControlLevel + GameState.gatheredAerialControlLevel) * 0.01);
}
function getMaxWalkSpeed() {
    return MAX_WALK_SPEED + (GameState.accelerationLevel + GameState.gatheredAccelerationLevel) * 0.25;
}
function getWalkAcceleration() {
    return WALK_ACCELERATION + (GameState.accelerationLevel + GameState.gatheredAccelerationLevel) * 0.01;
}
function getJumpSpeed() {
    return JUMP_SPEED  + (GameState.jumpLevel + GameState.gatheredJumpLevel) * 0.5;
}
function getMaxHealth() {
    return 1.0 +  + (GameState.healthLevel + GameState.gatheredHealthLevel) * 0.25;
}


Player.prototype.step = function() {

    this.ticks++;

    var pos = this.threeObject.position;
    var px = pos.x;
    var py = pos.y;

    var lightPosition = GameState.playerLight.position;
    lightPosition.x = px;
    lightPosition.y = py + 50;
    lightPosition.z = 200;

    var vx = this.velocity.x;
    var vy = this.velocity.y;
    var oldVy = vy;
    var oldVx = vx;

    var dVx = 0;
    var dVy = 0;

    var leftDown = Input.isDown(Input.ARROW_LEFT);
    var rightDown = Input.isDown(Input.ARROW_RIGHT);
    var upDown = Input.isDown(Input.ARROW_UP);
    var downDown = Input.isDown(Input.ARROW_DOWN);


    var maxFlyingCorrectionSpeed = getMaxFlyingCorrectionSpeed();
    var maxFlyingCorrection = getMaxFlyingCorrection();
    var playerGravity = getPlayerGravity();
    var maxWalkSpeed = getMaxWalkSpeed();
    var walkAcceleration = getWalkAcceleration();
    var jumpSpeed = getJumpSpeed();

    var freq = 0.2 + (GameState.accelerationLevel + GameState.gatheredAccelerationLevel) * 0.02;

    var angle = this.oldAngle;
    var zAngle = -0.01;
    var offset = 0;
    var armAmplitude = 0.7;
    var legAmplitude = 0.5;
    if (leftDown) {
        offset = Math.PI;
    }
    switch (this.state) {
        case PlayerState.SLIDING:
        case PlayerState.STANDING:
        case PlayerState.WALKING:
        case PlayerState.FLYING:
            if (this.jumping) {
                angle = Math.PI * 0.5;
                zAngle = -0.2;
                armAmplitude = 0.9;
                legAmplitude = 0.7;
            } else {
                if (leftDown || rightDown) {
                    angle = mod(freq * this.ticks, Math.PI * 2.0);
                    zAngle = -0.1;
                } else {
                    var factor = 0.95;
                    var invFactor = 1.0 - factor;
                    if (angle > Math.PI * 1.5) {
                        // Go towards Math.PI * 2
                        angle = Math.abs(angle) < Math.PI * 2 - 0.2 ? factor * this.oldAngle +
                            invFactor * Math.PI * 2 : 0.9999 * this.oldAngle;
                    } else {
                        // Go towards 0
                        angle = Math.abs(angle) > 0.2 ? factor * this.oldAngle : 0.9999 * this.oldAngle;
                    }

                    zAngle = -0.01;
                }
            }
            break;
    }

    this.oldAngle = angle;
    this.leftLeg.rotation.z = legAmplitude * Math.sin(angle);
    this.rightLeg.rotation.z = -legAmplitude * Math.sin(angle);
    this.leftArm.rotation.z = -armAmplitude * Math.sin(angle);
    this.rightArm.rotation.z = armAmplitude * Math.sin(angle);

    this.threeObject.rotation.y = 0.2 * Math.cos(angle) + offset;
    this.threeObject.rotation.z = zAngle;


    switch (this.state) {
        case PlayerState.FLYING:
            if (leftDown && vx > -maxFlyingCorrectionSpeed) {
                dVx -= maxFlyingCorrection;
            }
            if (rightDown && vx < maxFlyingCorrectionSpeed) {
                dVx += maxFlyingCorrection;
            }
            if (downDown) {
                dVy -= maxFlyingCorrection;
            }
            if (this.jumping && !upDown) {
                this.jumping = false;
                if (vy > 0.5 * JUMP_SPEED) {
                    dVy -= (vy - 0.5 * JUMP_SPEED) * 0.8;
                }
            }
            break;
        case PlayerState.WALKING:
            if (leftDown && vx > -maxWalkSpeed) {
                dVx -= walkAcceleration;
            }
            if (rightDown && vx < maxWalkSpeed) {
                dVx += walkAcceleration;
            }
            if (upDown) {
                dVy += jumpSpeed;
                this.state = PlayerState.FLYING;
                this.jumping = true;
            }
            if (!leftDown && !rightDown && !upDown) {
                this.state = PlayerState.SLIDING;
            }
            break;
        case PlayerState.SLIDING:
            if (vx > 0.0) {
                dVx -= SLIDING_FRICTION;
                if (vx + dVx < 0.0) {
                    dVx = -vx;
                    this.state = PlayerState.STANDING;
                }
            } else if (vx < 0.0) {
                dVx += SLIDING_FRICTION;
                if (vx + dVx > 0.0) {
                    dVx = -vx;
                    this.state = PlayerState.STANDING;
                }
            }
            if (leftDown || rightDown) {
                this.state = PlayerState.WALKING;
            }
            if (upDown) {
                dVy = jumpSpeed;
                this.state = PlayerState.FLYING;
                this.jumping = true;
            }
            break;
        case PlayerState.STANDING:
            if (Input.isDown(Input.ARROW_UP)) {
                dVy += jumpSpeed;
                this.state = PlayerState.FLYING;
                this.jumping = true;
            }
            if (leftDown || rightDown) {
                this.state = PlayerState.WALKING;
            }
            break;
    }

    if (this.justHitFire) {
        this.justHitFire = false;
        dVy += HIT_FIRE_SPEED;
        this.health -= FIRE_DAMAGE;

        if (GameState.fireWarnings < 3) {
            GameState.fireWarnings++;
            $messages.append("<p>" + "The lava is dangerous!" + "</p>");
            GameState.latestMessageTick = GameState.permanentCounter1;
        }
        if (this.health < 0.0 && GameState.subState == GameSubState.PLAYING) {
            GameState.subState = GameSubState.DYING;
            GameState.counter1 = 0;
            this.removeFromScene(GameState.scene);
            arrayDelete(GameState.agents, this);
        }
    }

    if (vy > -MAX_FALL_SPEED) {
        dVy -= playerGravity;
    }


    vx += dVx;
    vy += dVy;

    var canMoveHoriz = true;
    var canMoveVert = true;

    px += PLAYER_WIDTH * 0.5;


    var newVx = vx;
    var newVy = vy;

    var tests = 1;
    var factor = 0.5;

    var hitFire = false;
    for (var i=0; i<tests; i++) {
        var lastTest = i == tests - 1;

        var dr = [px + newVx, py + newVy, PLAYER_WIDTH, PLAYER_HEIGHT];

        var resultInfo = {};

        if (GameState.collisionGrid.rectIntersects(dr, resultInfo)) {
            hitFire = resultInfo.hitFire;

            dr = [px + newVx, py, PLAYER_WIDTH, PLAYER_HEIGHT];
            canMoveHoriz = !GameState.collisionGrid.rectIntersects(dr);

            if (!canMoveHoriz) {
                newVx *= factor;
                if (lastTest) {
                    newVx = 0;
                }
                dr = [px, py + newVy, PLAYER_WIDTH, PLAYER_HEIGHT];
                canMoveVert = !GameState.collisionGrid.rectIntersects(dr);
                if (!canMoveVert) {
                    newVy *= factor;
                    if (lastTest) {
                        newVy = 0;
                    }
                }
            } else {
                newVy *= factor;
                if (lastTest) {
                    newVy = 0;
                }
            }
        } else {
            // We managed to not collide
            break;
        }
    }

    if (hitFire) {
        this.justHitFire = true;
    }

    vx = newVx;
    vy = newVy;


    switch (this.state) {
        case PlayerState.WALKING:
            if (vy != 0) {
                this.state = PlayerState.FLYING;
            }
            break;
        case PlayerState.SLIDING:
            if (vx == 0) {
                this.state = PlayerState.STANDING;
            }
            if (vy != 0) {
                this.state = PlayerState.FLYING;
            }
            break;
        case PlayerState.STANDING:
            break;
        case PlayerState.FLYING:
            if (vy == 0 && oldVy < 0) {
                // Fell before but is now on a surface
                this.jumping = false;
                if (leftDown || rightDown) {
                    this.state = PlayerState.WALKING;
                } else {
                    this.state = PlayerState.SLIDING;
                }
            }
            break;
    }


    this.velocity.x = vx;
    this.velocity.y = vy;

    LivingObject.prototype.step.call(this);

    // Check if we hit something else
    pos = this.threeObject.position;
    px = pos.x;
    py = pos.y;
    px += PLAYER_WIDTH * 0.5;

    var pr = [px, py, PLAYER_WIDTH, PLAYER_HEIGHT];




    var result = {};
    if (checkGameObjectCollision(pr, GameState.goals, result)) {
        var toRemove = [];

        var pickup1 = resources["pickup1"];

        if (allSoundsLoaded) {
            pickup1.play();
        }
        for (var i=0; i<result.objects.length; i++) {
            toRemove.push(result.objects[i]);
            result.objects[i].removeFromScene(GameState.scene);
        }
        arrayDeleteAll(GameState.goals, toRemove);
        if (GameState.goals.length == 0) {
            if (resources["level" + (GameState.levelIndex + 1)]) {
                GameState.subState = GameSubState.COMPLETING;
            } else {
                GameState.subState = GameSubState.COMPLETING_GAME;
            }
            GameState.counter1 = 0;
        } else {
            if (GameState.goals.length == 1) {
                $messages.append("<p>" + "Checkpoint! " +
                    "One is left..." + "</p>");
            } else {
                $messages.append("<p>" + "Checkpoint! " +
                    GameState.goals.length + " are left..." + "</p>");
            }
            GameState.latestMessageTick = GameState.permanentCounter1;
        }
    }


    result = {};
    if (checkGameObjectCollision(pr, GameState.pickups, result)) {
        var toRemove = [];
        for (var i=0; i<result.objects.length; i++) {
            var o = result.objects[i];

            var pickup1 = resources["pickup1"];
            var pickup2 = resources["pickup2"];

            var pickupSound = pickup1;

            var doRemove = true;

//            "<p>ACCELERATION LEVEL: " + (GameState.accelerationLevel + 1) + "</p>" +
//                "<p>AERIAL LEVEL: " + (GameState.aerialControlLevel + 1) + "</p>" +
//                "<p>JUMP LEVEL: " + (GameState.jumpLevel + 1) + "</p>" +
//                "<p>HEALTH LEVEL: " + (GameState.healthLevel + 1) + "</p>";

            switch (o.type) {
                case "evolverun":
                    GameState.gatheredAccelerationLevel++;
                    $messages.append("<p>" + "Acceleration level increased to " +
                        (GameState.gatheredAccelerationLevel + GameState.accelerationLevel + 1) + "</p>");
                    GameState.latestMessageTick = GameState.permanentCounter1;
                    break;
                case "evolveaerial":
                    GameState.gatheredAerialControlLevel++;
                    $messages.append("<p>" + "Aerial control level increased to " +
                        (GameState.gatheredAerialControlLevel + GameState.aerialControlLevel + 1) + "</p>");
                    GameState.latestMessageTick = GameState.permanentCounter1;
                    break;
                case "evolvehealth":
                    GameState.gatheredHealthLevel++;
                    GameState.player.maxHealth = getMaxHealth();
                    GameState.player.health = GameState.player.maxHealth;
                    $messages.append("<p>" + "Health level increased to " +
                        (GameState.healthLevel + GameState.gatheredHealthLevel + 1) + "</p>");
                    GameState.latestMessageTick = GameState.permanentCounter1;
                    break;
                case "evolvejump":
                    GameState.gatheredJumpLevel++;
                    $messages.append("<p>" + "Jump capability level increased to " +
                        (GameState.jumpLevel + GameState.gatheredJumpLevel + 1) + "</p>");
                    GameState.latestMessageTick = GameState.permanentCounter1;
                    break;
                case "health":
                    pickupSound = pickup2;
                    if (this.health >= this.maxHealth) {
                        doRemove = false;
                    } else {
                        $messages.append("<p>" + "Health replenished" + "</p>");
//                        $messages.append($messages.children().size());

                        GameState.latestMessageTick = GameState.permanentCounter1;
                        this.health += 0.7;
                        if (this.health > this.maxHealth) {
                            this.health = this.maxHealth;
                        }
                    }
                    break;
            }

            if (doRemove) {
                toRemove.push(o);
                o.removeFromScene(GameState.scene);
                if (pickupSound && allSoundsLoaded) {
                    pickupSound.play();
                }
            }
        }
        arrayDeleteAll(GameState.pickups, toRemove);
    }

};


function checkGameObjectCollision(pr, arr, result) {
    result.objects = [];
    for (var i=0; i<arr.length; i++) {
        var obj = arr[i];
        var goalPos = obj.threeObject.position;
        var gx = goalPos.x + obj.collisionRect[2] * 0.5;
        var gy = goalPos.y;
        var or = [gx, gy, obj.collisionRect[2], obj.collisionRect[3]];
        if (rectCollide(pr, or)) {
            result.objects.push(obj);
            return true;
        }
    }
    return false;
}


