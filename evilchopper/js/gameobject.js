
var bulletGeometry = null;
var bombGeometry = null;

var cubeGeometry = null;
var sphereGeometry = null;

var cannonBulletMaterial = null;
var bombMaterial = null;


var materials = {};
var geometries = {};


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


function Powerup(type, text, color, emissive, posAmplitude, posFrequency, rotZ) {
    GameObject.call(this);

    this.type = type;
    this.text = text;

    if (!emissive) {
        emissive = 0x000000;
    }

    var geometry = geometries[type];

    if (!geometry) {
        if (stringStartsWith(type, "ship")) {
            geometry = new THREE.CylinderGeometry(0.1, 0.5, 1);
        } else {
            geometry = new THREE.CubeGeometry(1, 1, 1);
        }
        geometries[type] = geometry;
    }
    var material = materials[type];
    if (!material) {
        material = GameState.renderer.getPowerupMaterial(color, emissive);
        materials[type] = material;
    }
    this.threeObject = new THREE.Mesh(geometry, material);

    this.posAmplitude = posAmplitude;
    this.posFrequencey = posFrequency;
    this.rotZ = rotZ;

}
Powerup.prototype = new GameObject();


Powerup.prototype.step = function() {
    this.ticks++;
    this.threeObject.rotation.z += this.rotZ;
    this.threeObject.position.z = this.initialPosition.z + this.posAmplitude * GRID_SIZE * Math.sin(this.ticks * this.posFrequencey);
};


function MovingObject() {
    GameObject.call(this);
    this.owner = null;
    this.velocity = new THREE.Vector3(0, 0, 0);
}
MovingObject.prototype = new GameObject();

MovingObject.prototype.step = function() {
    this.threeObject.position.addSelf(this.velocity);
};

MovingObject.prototype.setVelocity = function(v) {
    this.velocity.copy(v);
};


function Explosion() {
    MovingObject.call(this);
    this.maxDamage = 1;

    if (sphereGeometry == null) {
        sphereGeometry = new THREE.SphereGeometry(0.5);
    }
    this.material = GameState.renderer.getExplosionMaterial();
    this.threeObject = new THREE.Mesh(sphereGeometry, this.material);
//    var size = 0.25;
//    this.threeObject.scale.set(size, size, size);
    this.threeObject.castShadow = true;
    this.threeObject.receiveShadow = false;

    this.duration = 20;

    this.rndValue1 = globalRnd.random();
    this.rndValue2 = globalRnd.random();
    this.rndValue3 = globalRnd.random();
    this.rndValue4 = globalRnd.random();

    this.explosionLight = null;

}
Explosion.prototype = new MovingObject();


Explosion.prototype.addToScene = function(scene) {
    GameState.particleParent.add(this.threeObject);
};

Explosion.prototype.removeFromScene = function(scene) {
    GameState.particleParent.remove(this.threeObject);
};


Explosion.prototype.step = function() {
    MovingObject.prototype.step.call(this);

    if (this.ticks == 0) {

        this.radius = this.threeObject.scale.x;

        if (GameState.availableExplosionLights.length > 0) {
            this.explosionLight = GameState.availableExplosionLights.pop();
            this.explosionLight.distance = this.radius * 10;
            this.explosionLight.intensity = 2;

            this.explosionLight.position.copy(this.threeObject.position.clone().addSelf(new THREE.Vector3(0, 0, this.radius)));
        }

        var pos = this.threeObject.position;
        for (var i=0; i<GameState.solids.length; i++) {
            var solid = GameState.solids[i];

            var solPos = solid.threeObject.position;
            var solScale = solid.threeObject.scale;
            var gx = solPos.x - solScale.x * 0.5;
            var gy = solPos.y - solScale.y * 0.5;
            var or = [gx, gy, solScale.x, solScale.y];

            var dist = rectDistanceToPoint(or, pos);
            if (dist < this.radius) {
                var damFrac = 1.0 - dist / this.radius;
                solid.doDamage(damFrac * this.maxDamage);
                if (this.owner.isPlayer) {
                    GameState.didDamage(this.owner.index);
                }
//                logit("expl hit solid " + dist + " " + damFrac);
            }
        }

        for (var i=0; i<GameState.agents.length; i++) {

            var agent = GameState.agents[i];


            var solPos = agent.threeObject.position;
            var solScale = agent.threeObject.scale;
            var gx = solPos.x - solScale.x * 0.5;
            var gy = solPos.y - solScale.y * 0.5;
            var or = [gx, gy, solScale.x, solScale.y];

            var dist = rectDistanceToPoint(or, pos);

            var vertDist = solPos.z - pos.z;
            var dist = Math.sqrt(vertDist * vertDist + dist * dist);

            if (dist < this.radius) {
                var damFrac = 1.0 - dist / this.radius;
                agent.doDamage(damFrac * this.maxDamage);
                if (this.owner.isPlayer && this.owner != agent) {
                    GameState.didDamage(this.owner.index);
                }
//                logit("expl hit solid " + dist + " " + damFrac);
            }
        }

    }
    this.ticks++;

    var frac = this.ticks / this.duration;

    if (this.explosionLight) {
        this.explosionLight.intensity = 2 - frac * 1;
    }

    var rad = frac * this.radius * 2;
    this.setScale(new THREE.Vector3(rad, rad, rad));

    var r = 1.0 - this.rndValue1 * 0.1 - 0.15 * frac;
    var g = 1.0 - this.rndValue2 * 0.1 - 0.85 * frac;
    var b = 1.0 - this.rndValue3 * 0.1 - frac;
    var op = 1.0 - this.rndValue4 * 0.1 - 0.1 * frac;
    var col = new THREE.Color().setRGB(r, g, b);
    if (this.material.emissive) {
        this.material.emissive.copy(col);
    }
    this.material.color.copy(col);
    this.material.opacity = op;
    this.ticks++;
    if (this.ticks > this.duration) {
        if (this.explosionLight) {
            GameState.availableExplosionLights.push(this.explosionLight);
            this.explosionLight.position.set(-9999, 9999, 9999);
            this.explosionLight = null;
        }
        this.removeMe = true;
    }
};


function Projectile() {
    MovingObject.call(this);
}
Projectile.prototype = new MovingObject();


Projectile.prototype.step = function() {
    MovingObject.prototype.step.call(this);

    var obj = this.threeObject;
    var pos = obj.position;
    var vel = this.velocity;
    var scale = obj.scale;

    var result = {};
    var cr = [pos.x - scale.x * 0.5 + vel.x, pos.y - scale.y * 0.5 + vel.y, scale.x, scale.y];

//    logit(cr + " " + GameState.solids[0].threeObject.position.y);

    if (checkGameObjectCollision(cr, GameState.solids, result)) {
        for (var i=0; i<result.objects.length; i++) {
            var solid = result.objects[i];
            this.hitSolid(solid);
        }
    }


    var scale = obj.scale;

    var result = {};
    if (!this.owner.isPlayer) {
        for (var j=0; j<GameState.players.length; j++) {
            var player = GameState.players[j];
            if (!player.isDead && player.threeObject) {
                var playerObj = player.threeObject;
                var pScale = playerObj.scale;
                result.objects = [];
                var diffZ = Math.abs(obj.position.z - playerObj.position.z);

                var maxDiff = 0.5 * (scale.z + pScale.z);
                if (diffZ < maxDiff) {
                    if (checkSingleObjectCollision(cr, player, result)) {
                        for (var i=0; i<result.objects.length; i++) {
                            var agent = result.objects[i];
                            this.hitAgent(agent);
                        }
                    }
                }
            }
        }
    } else {
        if (checkGameObjectCollision(cr, GameState.agents, result)) {
            for (var i=0; i<result.objects.length; i++) {
                var agent = result.objects[i];
                if (this.owner != agent) {
                    var aObj = agent.threeObject;
                    var diffZ = Math.abs(obj.position.z - aObj.position.z);
                    var oScale = aObj.scale;
                    var maxDiff = 0.5 * (scale.z + oScale.z);

//                    logit("maxdiff: " + maxDiff);
                    if (diffZ < maxDiff) {
                        this.hitAgent(agent);
                    }
                }
            }
        }
    }
};

Projectile.prototype.hitSolid = function(solid) {
//    logit("projectile hit solid ");
    this.removeMe = true;
};

Projectile.prototype.hitAgent = function(agent) {
//    logit("projectile hit agent ");
    this.removeMe = true;
};


function CannonBullet() {
    Projectile.call(this);
    if (bulletGeometry == null) {
        bulletGeometry = new THREE.CylinderGeometry(0.1, 0.4, 1);
        var m = new THREE.Matrix4();
        m.rotateX(Math.PI * 0.5);
        bulletGeometry.applyMatrix(m);
    }
    if (cannonBulletMaterial == null) {
        cannonBulletMaterial = GameState.renderer.getCannonBulletMaterial();
    }
    this.threeObject = new THREE.Mesh(bulletGeometry, cannonBulletMaterial);
//    var size = 0.25;
//    this.threeObject.scale.set(size, size, size);
    this.threeObject.castShadow = true;
    this.threeObject.receiveShadow = true;

    this.duration = 50;
    this.direction = new THREE.Vector3(0, 1, 0);

    this.damage = 0.45;
}
CannonBullet.prototype = new Projectile();

CannonBullet.prototype.hitSolid = function(solid) {
    this.removeMe = true;
    solid.doDamage(this.damage);

    if (this.owner.isPlayer) {
        GameState.didDamage(this.owner.index);
    }
    playIfAvailable(sounds.hitBuilding.sound);
};

CannonBullet.prototype.hitAgent = function(agent) {
    this.removeMe = true;
    agent.doDamage(this.damage);

    if (this.owner.isPlayer && !agent.isPlayer) {
        GameState.didDamage(this.owner.index);
    }
    playIfAvailable(sounds.hitEnemy.sound);
};


CannonBullet.prototype.step = function() {
    Projectile.prototype.step.call(this);

//    logit("hfsdj");

    this.ticks++;

    if (this.ticks > this.duration) {
        this.removeMe = true;
    }
};


function Bomb() {
    Projectile.call(this);
    if (bombGeometry == null) {
        bombGeometry = new THREE.CylinderGeometry(0.1, 0.4, 1.5);
//        var m = new THREE.Matrix4();
//        m.rotateX(Math.PI * 0.5);
//        bombGeometry.applyMatrix(m);
    }
    if (bombMaterial == null) {
        bombMaterial = GameState.renderer.getBombMaterial();
    }
    this.threeObject = new THREE.Mesh(bombGeometry, bombMaterial);
//    var size = 0.25;
//    this.threeObject.scale.set(size, size, size);
    this.threeObject.castShadow = true;
    this.threeObject.receiveShadow = true;

    this.damage = 1;
    this.duration = 1000;
}
Bomb.prototype = new Projectile();

Bomb.prototype.explode = function() {
    var explosion = new Explosion();
    explosion.maxDamage = this.damage;
    GameState.particles.push(explosion);
    explosion.addToScene(GameState.scene);
    explosion.setPosition(this.threeObject.position);
//        bomb.setVelocity({x: this.velocity.x + speed * dx, y: this.velocity.y + speed * dy, z: this.velocity.z});
    var explosionSize = GRID_SIZE + GRID_SIZE * this.damage;
    explosion.setScale({x: explosionSize, y: explosionSize, z: explosionSize});
    explosion.owner = this.owner;

    playIfAvailable(sounds.explosion.sound);

    this.removeMe = true;
};

Bomb.prototype.hitSolid = function(solid) {
    this.explode();
    playIfAvailable(sounds.hitBuilding.sound);
};

Bomb.prototype.hitAgent = function(agent) {
    this.removeMe = true;
    this.explode();
    playIfAvailable(sounds.hitEnemy.sound);
};

Bomb.prototype.step = function() {

    var vel = this.velocity.clone();

    var gravity = -0.1;

    vel.z += gravity;

    this.velocity.set(vel.x, vel.y, vel.z);

    Projectile.prototype.step.call(this);

    this.ticks++;

    if (this.ticks > this.duration) {
        this.removeMe = true;
    }

    var pos = this.threeObject.position;
    var groundHeight = getQuickGroundHeightAt(pos.x, pos.y, GameState.groundLayer);
    if (pos.z < groundHeight) {
        this.explode();
    }
};



//function Particle(type, size, color, emissive) {
//    MovingObject.call(this, size);
//    this.type = type;
//
//    var material = materials[type];
//    if (!material) {
//        material = new THREE.MeshLambertMaterial({color: color, emissive: emissive});
//        materials[type] = material;
//    }
//    var geometry = geometries[type];
//    if (!geometry) {
//
//    }
//    this.threeObject = new THREE.Mesh(goalGeometry, goalMaterial);
//}
//Particle.prototype = new MovingObject();
//
//Particle.prototype.step = function() {
//    MovingObject.prototype.step.call(this);
//    this.threeObject.rotation.z += 0.01;
//};


function LivingObject() {
    MovingObject.call(this);

    this.isPlayer = false;

    this.dropsPowerups = [];

    this.health = 1.0;
    this.maxHealth = this.health;

    this.isDead = false;

    this.blinkTicksLeft = 0;
    this.blinkStartTick = 0;
    this.blinkOnLength = 5;
    this.blinkOffLength = 3;

    this.blinkColor = 0xffffff;

    this.origMaterialInfos = [];
    this.blinkingMaterials = [];
}
LivingObject.prototype = new MovingObject();

LivingObject.prototype.step = function() {
    MovingObject.prototype.step.call(this);

    this.ticks++;

    if (this.blinkTicksLeft > 0) {
        this.blinkTicksLeft--;
        if (this.blinkTicksLeft == 0) {
            this.restoreMaterialInfo();
        } else {
            this.blink();
        }
    }
};

LivingObject.prototype.getClosestLivingPlayer = function() {

    var closestLivingPlayer = null;
    var closestDistance = 999999;
    for (var i=0; i<GameState.players.length; i++) {
        var player = GameState.players[i];
        if (player.threeObject && !player.isDead) {
            var diffVec = player.threeObject.position.clone();
            diffVec.subSelf(this.threeObject.position);
            var dist = diffVec.length();
            if (dist < closestDistance) {
                closestDistance = dist;
                closestLivingPlayer = player;
            }
        }
    }

    return closestLivingPlayer;
};


LivingObject.prototype.doDamage = function(damage) {
    this.health -= damage;
    this.blinkTicksLeft = Math.min(35, Math.max(15, Math.round(damage * 50)));
    if (this.health <= 0.0 && !this.isDead) {
        this.health = 0;
        this.die();
        this.isDead = true;
    }
};

LivingObject.prototype.addPowerup = function() {
    if (this.dropsPowerups.length > 0) {
        var powerup = sampleData(this.dropsPowerups, globalRnd);

        logit("Adding powerup " + powerup);

        var pos = this.threeObject.position;

        var obj = {
            type: powerup,
            x: pos.x,
            y: pos.y

        };
        var newObjs = [];

        var powerupText = powerupTexts[obj.type]; // "Powerup";
        if (!powerupText) {
            powerupText = "Powerup";
        }

        switch (powerup) {
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
        }

        for (var i=0; i<newObjs.length; i++) {
            var newObj = newObjs[i];
            var w = obj.width;
            var h = obj.height;
            var d = obj.depth;
            if (d === undefined) {
                d = Math.min(w, h);
            }

            newObj.setPosition({x: obj.x, y: obj.y, z: PLAYER_Z});
            newObj.setScale({x: w, y: h, z: d});
            newObj.addToScene(GameState.scene);
        }
    }
};

LivingObject.prototype.die = function() {
    this.removeMe = true;
    this.addPowerup();
};

LivingObject.prototype.storeMaterialInfo = function(material) {
    this.origMaterialInfos.push({emissive: material.emissive, color: material.color});
    this.blinkingMaterials.push(material);
};

LivingObject.prototype.restoreMaterialInfo = function() {
    for (var i=0; i<this.blinkingMaterials.length; i++) {
        var mat = this.blinkingMaterials[i];
        var info = this.origMaterialInfos[i];
        if (mat.emissive) {
            mat.emissive.copy(info.emissive);
        }
        if (mat.color) {
            mat.color.copy(info.color);
        }
    }
};

LivingObject.prototype.blink = function() {
    var period = this.blinkOnLength + this.blinkOffLength;
    var phase = this.ticks % period;

    if (phase == 0) {
        for (var i=0; i<this.blinkingMaterials.length; i++) {
            var mat = this.blinkingMaterials[i];
            if (mat.emissive) {
                mat.emissive = new THREE.Color(this.blinkColor);
            }
            if (mat.color) {
                mat.color = new THREE.Color(this.blinkColor);
            }
        }
    } else if (phase == this.blinkOnLength) {
        this.restoreMaterialInfo();
    }
};

function Building(c) {
    LivingObject.call(this);
};
Building.prototype = new LivingObject();


Building.prototype.die = function() {
    if (!this.removeMe) {
        this.removeMe = true;

        this.addPowerup();
        var explosion = new Explosion();
        explosion.maxDamage = 0;
        explosion.setPosition(this.threeObject.position);
//        bomb.setVelocity({x: this.velocity.x + speed * dx, y: this.velocity.y + speed * dy, z: this.velocity.z});
        var explosionSize = Math.max(this.threeObject.scale.x, this.threeObject.scale.y);
        explosion.setScale({x: explosionSize, y: explosionSize, z: explosionSize});
        explosion.owner = this;

//        logit(explosion);

        playIfAvailable(sounds.explosion.sound);

        if (explosionSize < 888 && explosionSize > 0.01) {
            explosion.addToScene(GameState.scene);
            GameState.particles.push(explosion);
        }

//        var tex = GameState.groundTexture;
//        var image = tex.image;
//        var context = image.getContext("2d");
//        context.fillStyle = "#111111";
//        var groundLayer = GameState.groundLayer;
//
//        var pos = this.threeObject.position;
//        var imageX = Math.floor(PIXELS_PER_CELL * (pos.x / GRID_SIZE));
//        var imageY = Math.floor(PIXELS_PER_CELL * (-pos.y / GRID_SIZE));
//
//        var rad = 5;
//        context.fillRect(imageX - rad, imageY - rad, rad * 2, rad * 2);

//        logit("imagex/y " + imageX + ", " + imageY + " pos x/y " + pos.x + ", " + pos.y);
//        tex.needsUpdate = true;
    } else {
        logit("Trying to add an explosin a lot! ");
//        logit(this);
    }
};


function House1(c) {
    Building.call(this);

    this.maxHealth = 5;
    this.health = this.maxHealth;

    if (cubeGeometry == null) {
        cubeGeometry = new THREE.CubeGeometry(1, 1, 1);
    }
    var material = GameState.renderer.getHouse1Material();
    this.storeMaterialInfo(material);
    this.threeObject = new THREE.Mesh(cubeGeometry, material);
    this.threeObject.castShadow = true;
    this.threeObject.receiveShadow = true;
}
House1.prototype = new Building(true);




function House2() {
    Building.call(this);

    this.maxHealth = 5;
    this.health = this.maxHealth;

    if (cubeGeometry == null) {
        cubeGeometry = new THREE.CubeGeometry(1, 1, 1);
    }
    var material = GameState.renderer.getHouse2Material();
    this.storeMaterialInfo(material);
    this.threeObject = new THREE.Mesh(cubeGeometry, material);
    this.threeObject.castShadow = true;
    this.threeObject.receiveShadow = true;
}
House2.prototype = new Building();


function DefenceTower(level, isBoss) {
    Building.call(this);

    this.health = 1.5 + level * 0.5;
    if (isBoss) {
        this.health *= 2;
    }
    this.maxHealth = this.health;

    this.fireInterval = 80 - level * 15;
    this.damage = 0.1 + 0.1 * level;
    this.defenceRadius = GRID_SIZE * (8 + 2 * level);
    this.bulletSpeed = 3 + level;
    this.bulletDuration = 80;
    this.fireCounter = 1000;

    this.geometry = new THREE.CylinderGeometry(0.5 + level * 0.05, 0.8 + level * 0.1, 1 + level * 0.05);

    var m = new THREE.Matrix4();
    m.rotateX(Math.PI / 2);
    this.geometry.applyMatrix(m);
    if (isBoss) {
        this.material = GameState.renderer.getDefenceTowerBossMaterial();
    } else {
        this.material = GameState.renderer.getDefenceTowerMaterial();
    }

    this.storeMaterialInfo(this.material);

    this.threeObject = new THREE.Mesh(this.geometry, this.material);
    this.threeObject.castShadow = true;
    this.threeObject.receiveShadow = true;
}
DefenceTower.prototype = new Building();


DefenceTower.prototype.step = function() {
    LivingObject.prototype.step.call(this);

    var closestLivingPlayer = this.getClosestLivingPlayer();

    if (closestLivingPlayer) {
        var player = closestLivingPlayer;
        var diffVec = player.threeObject.position.clone();
        diffVec.subSelf(this.threeObject.position);

        var dist = diffVec.length();

        this.fireCounter++;
        if (dist < this.defenceRadius && this.fireCounter > this.fireInterval) {
            this.fireCounter = 0;
            diffVec.normalize();
            var bullet = new CannonBullet();
            bullet.damage = this.damage;
            bullet.addToScene(GameState.scene);
            bullet.setPosition(this.threeObject.position);
            var speed = this.bulletSpeed;
            bullet.duration = this.bulletDuration;
//        logit("Firing bullet " + diffVec.x + " " + diffVec.y + " " + diffVec.z + speed );
            bullet.setVelocity({x: diffVec.x * speed, y: diffVec.y * speed, z: diffVec.z * speed});
            var bulletSize = (0.25 + 0.2 * bullet.damage) * GRID_SIZE;
            bullet.setScale({x: bulletSize, y: bulletSize, z: bulletSize});
            bullet.owner = this;

            var lookAtPos = bullet.threeObject.position.clone().addSelf(diffVec);
            bullet.threeObject.lookAt(lookAtPos);

            GameState.projectiles.push(bullet);

            if (this.cannonPlayCounter > 10) {
                playIfAvailable(sounds.cannon.sound);
                this.cannonPlayCounter = 0;
            }

        }
    }
};


function Humanoid(level, isBoss) {
    LivingObject.call(this);

    this.maxSpeed = 1 + 0.3 * level;

    this.fireInterval = 80 - 10 * level;
    this.fireCounter = 889;
    this.bulletDuration = 80;
    this.bulletSpeed = 3 + 0.5 * level;
    this.damage = 0.2;

    this.health = 1.5 + level * 0.5;
    if (isBoss) {
        this.health *= 2;
    }
    this.maxHealth = this.health;

    if (!cubeGeometry) {
        cubeGeometry = new THREE.CubeGeometry(1, 1, 1);
    }
    if (!sphereGeometry) {
        sphereGeometry = new THREE.SphereGeometry(0.5);
    }

    if (isBoss) {
        this.bodyMaterial = GameState.renderer.getChopperBossMaterial();
    } else {
        this.bodyMaterial = GameState.renderer.getChopperBodyMaterial();
    }

    if (humanoidBodyGeometry == null) {
        humanoidBodyGeometry = new THREE.CubeGeometry(HUMANOID_WIDTH * 0.6, HUMANOID_HEIGHT * 0.45, HUMANOID_WIDTH);
    }

    this.bodyMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, emissive: 0x440000});

    if (headGeometry == null) {
        headGeometry = new THREE.SphereGeometry(HUMANOID_WIDTH * 0.5, 4, 5);
    }
    if (legGeometry == null) {
        var legLength = HUMANOID_HEIGHT * 0.5;
        legGeometry = new THREE.CubeGeometry(HUMANOID_WIDTH * 0.3, legLength, HUMANOID_WIDTH * 0.3);
        var m1 = new THREE.Matrix4();
        m1.translate(new THREE.Vector3(0, -legLength * 0.5, 0));
        legGeometry.applyMatrix(m1);
    }
    if (armGeometry == null) {
        var armLength = HUMANOID_HEIGHT * 0.45;
        armGeometry = new THREE.CubeGeometry(HUMANOID_WIDTH * 0.25, armLength, HUMANOID_WIDTH * 0.25);
        var m1 = new THREE.Matrix4();
        m1.translate(new THREE.Vector3(0, -armLength * 0.5, 0));
        armGeometry.applyMatrix(m1);
    }
    if (headMaterial == null) {
        headMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, emissive: 0x222222});
    }
    if (legMaterial == null) {
        legMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, emissive: 0x222222});
    }
    if (armMaterial == null) {
        armMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, emissive: 0x222222});
    }
    this.threeObject = new THREE.Mesh(bodyGeometry, bodyMaterial);
    this.threeObject.castShadow = true;
    this.threeObject.receiveShadow = true;

    this.leftArm = new THREE.Mesh(armGeometry, armMaterial);
    this.leftArm.position = new THREE.Vector3(0, HUMANOID_HEIGHT * 0.3, HUMANOID_WIDTH);
    this.threeObject.add(this.leftArm);

    this.rightArm = new THREE.Mesh(armGeometry, armMaterial);
    this.rightArm.position = new THREE.Vector3(0, HUMANOID_HEIGHT * 0.3, -HUMANOID_WIDTH);
    this.threeObject.add(this.rightArm);

    this.leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    this.leftLeg.position = new THREE.Vector3(0, 0, HUMANOID_WIDTH);
    this.threeObject.add(this.leftLeg);

    this.rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    this.rightLeg.position = new THREE.Vector3(0, 0, -HUMANOID_WIDTH);
    this.threeObject.add(this.rightLeg);

    this.head = new THREE.Mesh(headGeometry, headMaterial);
    this.head.position = new THREE.Vector3(0, HUMANOID_HEIGHT * 0.5, 0);
    this.threeObject.add(this.head);

    this.jumping = false;

    this.oldAngle = 0.2;

    this.storeMaterialInfo(this.bodyMaterial);
}
Humanoid.prototype = new LivingObject();



function Chopper(level, isBoss) {
    LivingObject.call(this);

    this.defenceRadius = GRID_SIZE * (10 + level * 2);
    this.lowerFightRadius = GRID_SIZE * 4;
    this.upperFightRadius = this.defenceRadius - GRID_SIZE * 2;

    this.maxSpeed = 1 + 0.3 * level;


    this.fireInterval = 80 - 10 * level;
    this.fireCounter = 889;
    this.bulletDuration = 80;
    this.bulletSpeed = 3 + 0.5 * level;
    this.damage = 0.2;

    this.health = 1.5 + level * 0.5;
    if (isBoss) {
        this.health *= 2;
    }
    this.maxHealth = this.health;

    if (!cubeGeometry) {
        cubeGeometry = new THREE.CubeGeometry(1, 1, 1);
    }
    if (!sphereGeometry) {
        sphereGeometry = new THREE.SphereGeometry(0.5);
    }

    if (isBoss) {
        this.bodyMaterial = GameState.renderer.getChopperBossMaterial();
    } else {
        this.bodyMaterial = GameState.renderer.getChopperBodyMaterial();
    }


    this.threeObject = new THREE.Object3D();
    this.threeObject.castShadow = true;
    this.threeObject.receiveShadow = true;


    this.mainBody = new THREE.Mesh(sphereGeometry, this.bodyMaterial);
    this.mainBody.scale.set(1, 1, 1.2);
    this.mainBody.position.set(0, 0, 0.2);
    this.mainBody.castShadow = true;
    this.mainBody.receiveShadow = true;
    this.threeObject.add(this.mainBody);

    this.backBody = new THREE.Mesh(cubeGeometry, this.bodyMaterial);
    this.backBody.scale.set(0.3, 0.2, 1.2);
    this.backBody.position.set(0, 0, -0.6);
    this.backBody.castShadow = true;
    this.backBody.receiveShadow = true;
    this.threeObject.add(this.backBody);

    this.rotor = new THREE.Mesh(cubeGeometry, this.bodyMaterial);
    this.rotor.scale.set(0.1, 0.3, 2);
    this.rotor.position.set(0, 0.5, 0);
    this.rotor.castShadow = true;
    this.rotor.receiveShadow = true;
    this.threeObject.add(this.rotor);

    this.backRotor = new THREE.Mesh(cubeGeometry, this.bodyMaterial);
    this.backRotor.scale.set(0.1, 0.4, 0.2);
    this.backRotor.position.set(-0.2, 0.2, -1.2);
    this.backRotor.castShadow = true;
    this.backRotor.receiveShadow = true;
    this.threeObject.add(this.backRotor);

//    var m = new THREE.Matrix4();
//    m.rotate(Math.PI * 0.5);
//    this.threeObject.applyMatrix(m);


    this.storeMaterialInfo(this.bodyMaterial);
}
Chopper.prototype = new LivingObject();

Chopper.prototype.step = function() {

    var pos = this.threeObject.position;
    var px = pos.x;
    var py = pos.y;

    var vx = this.velocity.x;
    var vy = this.velocity.y;


    var newVx = vx;
    var newVy = vy;

    var maxSpeed = this.maxSpeed;


    this.fireCounter++;

    var player = this.getClosestLivingPlayer();

    if (player) {

        var playerPos = player.threeObject.position;

        var diffVec = playerPos.clone();
        diffVec.subSelf(this.threeObject.position);

        var dist = diffVec.length();


        var moveVec = new THREE.Vector2(0, 0);

        this.threeObject.up.set(0, 0, 1);
        this.threeObject.lookAt(playerPos);

        newVx = 0;
        newVy = 0;
        if (dist < this.defenceRadius) {

            for (var i=0; i<GameState.flyers.length; i++) {
                var flyer = GameState.flyers[i];
                if (flyer != this) {
                    var fDiffVec = flyer.threeObject.position.clone();
                    fDiffVec.subSelf(pos);
                    var fDist = fDiffVec.length();
                    if (fDist > 0.01 && fDist < GRID_SIZE * 4) {
                        fDiffVec.normalize();
                        moveVec.x += -fDiffVec.x * maxSpeed;
                        moveVec.y += -fDiffVec.y * maxSpeed;
                    }
                }
            }


//        logit(diffVec.y);
            if (diffVec.y > -GRID_SIZE * 4) {
                moveVec.y += maxSpeed;
            }

            diffVec.normalize();

            if (dist < this.lowerFightRadius) {
                moveVec.x += -diffVec.x * maxSpeed;
                moveVec.y += -diffVec.y * maxSpeed;
            } else if (dist > this.upperFightRadius) {
                moveVec.x += diffVec.x * maxSpeed;
                moveVec.y += diffVec.y * maxSpeed;
            }


            if (moveVec.length() > 0.001) {
                moveVec.normalize().multiplyScalar(maxSpeed);
            }

            newVx = moveVec.x;
            newVy = moveVec.y;


//        this.threeObject.rotation.z += 0.03;

            if (this.fireCounter > this.fireInterval && !player.isDead) {
                this.fireCounter = 0;
                var bullet = new CannonBullet();
                bullet.damage = this.damage;
                bullet.addToScene(GameState.scene);
                bullet.setPosition(this.threeObject.position);
                var speed = this.bulletSpeed;
                bullet.duration = this.bulletDuration;
//        logit("Firing bullet " + diffVec.x + " " + diffVec.y + " " + diffVec.z + speed );
                bullet.setVelocity({x: diffVec.x * speed, y: diffVec.y * speed, z: diffVec.z * speed});
                var bulletSize = (0.25 + 0.2 * bullet.damage) * GRID_SIZE;
                bullet.setScale({x: bulletSize, y: bulletSize, z: bulletSize});
                bullet.owner = this;

                var lookAtPos = bullet.threeObject.position.clone().addSelf(diffVec);
                bullet.threeObject.lookAt(lookAtPos);

                GameState.projectiles.push(bullet);

                if (this.cannonPlayCounter > 10) {
                    playIfAvailable(sounds.cannon.sound);

                    this.cannonPlayCounter = 0;
                }

            }


        }
    }

    this.rotor.rotation.y += 0.5 + globalRnd.random() * 0.01; // mod(this.ticks * 0.5, Math.PI * 2);
    this.backRotor.rotation.x += 0.5 + globalRnd.random() * 0.01; // mod(this.ticks * 0.5, Math.PI * 2);
//    this.threeObject.rotation.setZ(this.turnAngle);


//    if (px + newVx < maxBorderDist || px + newVx > GameState.groundLayer.width * GRID_SIZE - maxBorderDist) {
//        newVx = 0;
//    }

    // Check if we hit something solid
    pos = this.threeObject.position;
    var scale = this.threeObject.scale;
    px = pos.x;
    py = pos.y;

    var pr = [px - scale.x * 0.5 + newVx, py - scale.y * 0.5 + newVy, scale.x, scale.y];

    var result = {};
    if (checkGameObjectCollision(pr, GameState.solids, result)) {

        // Check only moving along y
        prx = [px - scale.x * 0.5 + newVx, py - scale.y * 0.5, scale.x, scale.y];
        pry = [px - scale.x * 0.5, py - scale.y * 0.5 + newVy, scale.x, scale.y];

        var collideX = checkGameObjectCollision(prx, GameState.solids, result);
        var collideY = checkGameObjectCollision(pry, GameState.solids, result);

        if (collideX) {
            newVx = 0;
        }
        if (collideY) {
            newVy = 0;
        }
    }


    vx = newVx;
    vy = newVy;

    this.velocity.x = vx;
    this.velocity.y = vy;

    LivingObject.prototype.step.call(this);

};




var AccelerationState = {
    NONE: 0,
    FORWARD: 1,
    BACKWARD: 2
};

var SideMovementState = {
    NONE: 0,
    LEFT: 1,
    RIGHT: 2
};



function Player(index) {
    LivingObject.call(this);

    this.index = index;

    var allLeftButtons = [[Input.ARROW_LEFT], [Input.A], [Input.J], [Input.F]];
    var allRightButtons = [[Input.ARROW_RIGHT], [Input.D], [Input.L], [Input.H]];
    var allUpButtons = [[Input.ARROW_UP], [Input.W], [Input.I], [Input.T]];
    var allDownButtons = [[Input.ARROW_DOWN], [Input.S], [Input.K], [Input.G]];
    var allFireButtons = [[Input.COMMA], [Input.Z], [Input.N], [Input.V]];
    var allBombButtons = [[Input.POINT], [Input.X], [Input.M], [Input.B]];

    this.leftButtons = allLeftButtons[index];
    this.rightButtons = allRightButtons[index];
    this.upButtons = allUpButtons[index];
    this.downButtons = allDownButtons[index];
    this.fireButtons = allFireButtons[index];
    this.bombButtons = allBombButtons[index];

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
    stealOtherButtons(this.fireButtons, allFireButtons);
    stealOtherButtons(this.bombButtons, allBombButtons);

    this.isPlayer = true;

    this.health = getMaxHealth(index);
    this.maxHealth = getMaxHealth(index);

    this.accelerationState = AccelerationState.NONE;
    this.sideMovementState = SideMovementState.NONE;

    if (!cubeGeometry) {
        cubeGeometry = new THREE.CubeGeometry(1, 1, 1);
    }
    if (!sphereGeometry) {
        sphereGeometry = new THREE.SphereGeometry(0.5);
    }

    this.bodyMaterial = GameState.renderer.getPlayerShipBodyMaterial();
    this.turnAngle = 0.0;
    this.targetTurnAngle = 0.0;
    this.pitchAngle = 0.0;
    this.targetPitchAngle = 0.0;

    this.threeObject = new THREE.Object3D();
    this.threeObject.castShadow = true;
    this.threeObject.receiveShadow = true;

    this.mainBody = new THREE.Mesh(sphereGeometry, this.bodyMaterial);
    this.mainBody.scale.set(1, 1.2, 1);
    this.mainBody.position.set(0, 0.2, 0);
    this.mainBody.castShadow = true;
    this.mainBody.receiveShadow = true;
    this.threeObject.add(this.mainBody);

    this.backBody = new THREE.Mesh(cubeGeometry, this.bodyMaterial);
    this.backBody.scale.set(0.2, 1.2, 0.3);
    this.backBody.position.set(0, -0.6, 0);
    this.backBody.castShadow = true;
    this.backBody.receiveShadow = true;
    this.threeObject.add(this.backBody);

    this.rotor = new THREE.Mesh(cubeGeometry, this.bodyMaterial);
    this.rotor.scale.set(2, 0.3, 0.1);
    this.rotor.position.set(0, 0, 0.5);
    this.rotor.castShadow = true;
    this.rotor.receiveShadow = true;
    this.threeObject.add(this.rotor);

    this.backRotor = new THREE.Mesh(cubeGeometry, this.bodyMaterial);
    this.backRotor.scale.set(0.1, 0.4, 0.2);
    this.backRotor.position.set(-0.2, -1.2, 0.2);
    this.backRotor.castShadow = true;
    this.backRotor.receiveShadow = true;
    this.threeObject.add(this.backRotor);

    this.storeMaterialInfo(this.bodyMaterial);

    this.cannonFireCounters = createFilledArray(GameState.cannonRateLevels[index].length, 1000);
    this.bombFireCounters = createFilledArray(GameState.bombRateLevels[index].length, 1000);

    this.hiddenBySolids = [];

    this.cannonPlayCounter = 10;
    this.bombPlayCounter = 10;

    this.projector = new THREE.Projector();
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


function getMaxHealth(index) {
    return 1.0 +  + (GameState.healthLevels[index] + GameState.gatheredHealthLevels[index]) * 0.25;
}

function getMaxSpeed(index) {
    var totalLevel = GameState.gatheredSpeedLevels[index] + GameState.speedLevels[index];
    return CAMERA_SPEED * (4 + totalLevel * 0.2);
}

//30 - fireIntervalLevel * 2;

function getCannonDamage(index, playerIndex) {
    var gLevel = GameState.gatheredCannonDamageLevels[playerIndex][index];
    var level = GameState.cannonDamageLevels[playerIndex][index];
    var totalLevel = (typeof(gLevel) !== 'undefined' ? gLevel : 0) + (typeof(level) !== 'undefined' ? level : 0);
    return 0.2 + totalLevel * 0.2;
}
function getCannonFireInterval(index, playerIndex) {
    var gLevel = GameState.gatheredCannonRateLevels[playerIndex][index];
    var level = GameState.cannonRateLevels[playerIndex][index];
    var totalLevel = (typeof(gLevel) !== 'undefined' ? gLevel : 0) + (typeof(level) !== 'undefined' ? level : 0);
    return Math.max(10, 30 - totalLevel * 2);
}

function getBombMaxDamage(index, playerIndex) {
    var gLevel = GameState.gatheredCannonDamageLevels[playerIndex][index];
    var level = GameState.cannonDamageLevels[playerIndex][index];
    var totalLevel = (typeof(gLevel) !== 'undefined' ? gLevel : 0) + (typeof(level) !== 'undefined' ? level : 0);
    return 1 + totalLevel * 0.2;
}

function getBombFireInterval(index, playerIndex) {
    var gLevel = GameState.gatheredBombRateLevels[playerIndex][index];
    var level = GameState.bombRateLevels[playerIndex][index];
    var totalLevel = (typeof(gLevel) !== 'undefined' ? gLevel : 0) + (typeof(level) !== 'undefined' ? level : 0);
    return Math.max(30, 80 - totalLevel * 5);
}


function getBombRadius(index) {
    return level;
}

Player.prototype.checkHidden = function() {

//    var canvas = GameState.canvas;
//
//    var vector = new THREE.Vector3( canvas.width * 0.5,canvas.height * 0.5, 0.5 );
//    this.projector.unprojectVector( vector, GameState.camera );



    var plPos = this.threeObject.position;
    var camPos = GameState.camera.position;

    var dir = plPos.clone().subSelf(camPos).normalize();
    var ray = new THREE.Ray( camPos, dir); //vector.subSelf( GameState.camera.position ).normalize() );

//    logit(ray);

//    logit(" " + dir.x + " " + dir.y + " " + dir.z);

    for (var i=0; i<this.hiddenBySolids.length; i++) {
        var h = this.hiddenBySolids[i];
        for (var j=0; j<h.blinkingMaterials.length; j++) {
            var mat = h.blinkingMaterials[j];
            mat.opacity = 1;
        }
    }

    this.hiddenBySolids = [];

    var objects = [];
    for (var i=0; i<GameState.solids.length; i++) {
        var solid = GameState.solids[i];
        var threeObj = solid.threeObject;
        threeObj._theSolid = solid;

        if (threeObj.position.y < plPos.y) {
            this.hiddenBySolids.push(solid);
            for (var j=0; j<solid.blinkingMaterials.length; j++) {
                var mat = solid.blinkingMaterials[j];
                mat.opacity = 0.5;
            }
        } else {
            objects.push(threeObj);
        }
    }

    var intersects = ray.intersectObjects( objects, true );

    if (intersects.length > 0) {
//        logit("solid intersected player!");
        for (var i=0; i<intersects.length; i++) {
            var inter = intersects[i];
            var obj = inter.object;
            var solid = obj._theSolid;
            this.hiddenBySolids.push(solid);
            for (var j=0; j<solid.blinkingMaterials.length; j++) {
                var mat = solid.blinkingMaterials[j];
                mat.opacity = 0.5;
            }
        }
    }

};

//Player.prototype.die = function() {
//    this.removeMe = true;
//    this.isDead = true;
//    if (GameState.subState == GameSubState.PLAYING) {
//        GameState.subState = GameSubState.DYING;
//        GameState.counter1 = 0;
//    }
//};

Player.prototype.step = function() {

//    if (this.removeMe || this.health < 0.0) {
//        logit("Stepped " + this.removeMe + " " + this.health);
//    }

    if ((this.ticks % 5) == 0) {
        this.checkHidden();
    }

    var pos = this.threeObject.position;
    var px = pos.x;
    var py = pos.y;


    var vx = this.velocity.x;
    var vy = this.velocity.y;
    var oldVy = vy;
    var oldVx = vx;

    var leftDown = Input.isAnyDown(this.leftButtons);
    var rightDown = Input.isAnyDown(this.rightButtons);
    var upDown = Input.isAnyDown(this.upButtons);
    var downDown = Input.isAnyDown(this.downButtons);
    var fireDown = Input.isAnyDown(this.fireButtons);
    var bombDown = Input.isAnyDown(this.bombButtons);

    this.threeObject.rotation.z = this.turnAngle;

    var canMoveHoriz = true;
    var canMoveVert = true;

    px += PLAYER_WIDTH * 0.5;

    var newVx = vx;
    var newVy = vy;

//    var maxSpeed = CAMERA_SPEED * 4;

    var maxSpeed = getMaxSpeed(this.index);

    var xAxis = Input.xAxes[this.index];
    var yAxis = Input.yAxes[this.index];

    if (upDown) {
        yAxis = 1;
    } else if (downDown) {
        yAxis = -1;
    }
    if (rightDown) {
        xAxis = 1;
    } else if (leftDown) {
        xAxis = -1;
    }

//    logit("xaxis " + xAxis + " " + yAxis);

    if (yAxis > 0) {
        newVy = maxSpeed * yAxis;
        this.accelerationState = AccelerationState.FORWARD;
    } else if (yAxis < 0) {
        newVy = maxSpeed * yAxis;
        this.accelerationState = AccelerationState.BACKWARD;
    } else {
        if (GameState.cameraStopped) {
            newVy = 0;
        } else {
            newVy = CAMERA_SPEED;
        }
        this.accelerationState = AccelerationState.NONE;
    }

    if (xAxis < 0) {
        newVx = maxSpeed * xAxis;
        this.sideMovementState = SideMovementState.LEFT;
    } else if (xAxis > 0) {
        newVx = maxSpeed * xAxis;
        this.sideMovementState = SideMovementState.RIGHT;
    } else {
        newVx = 0;
        this.sideMovementState = SideMovementState.NONE;
    }

    // Check camera movement
    // Object must not get outside of the camera


    switch (this.accelerationState) {
        case AccelerationState.NONE:
            this.targetPitchAngle = 0;
            break;
        case AccelerationState.BACKWARD:
            this.targetPitchAngle = -yAxis * Math.PI / 5;
            break;
        case AccelerationState.FORWARD:
            this.targetPitchAngle = -yAxis * Math.PI / 5;
            break;
    }


    switch (this.sideMovementState) {
        case SideMovementState.NONE:
            this.targetTurnAngle = 0;
            break;
        case SideMovementState.LEFT:
            this.targetTurnAngle = xAxis * Math.PI / 5;
            break;
        case SideMovementState.RIGHT:
            this.targetTurnAngle = xAxis * Math.PI / 5;
            break;
    }

    var f = 0.95;
    var invF = 1.0 - f;
    this.turnAngle = f * this.turnAngle +  invF * this.targetTurnAngle;
    this.pitchAngle = f * this.pitchAngle +  invF * this.targetPitchAngle;
    this.threeObject.rotation.set(this.pitchAngle, this.turnAngle, 0);


    this.rotor.rotation.z += 0.5 + globalRnd.random() * 0.01; // mod(this.ticks * 0.5, Math.PI * 2);
    this.backRotor.rotation.x += 0.5 + globalRnd.random() * 0.01; // mod(this.ticks * 0.5, Math.PI * 2);

//    this.rotor.rotation.z = mod(this.ticks * 0.5, Math.PI * 2);
//    this.backRotor.rotation.x = mod(this.ticks * 0.5, Math.PI * 2);
//    this.threeObject.rotation.setZ(this.turnAngle);

    var camY = GameState.camera.position.y;

    var maxCamOffsetForward = GRID_SIZE * 15;
    var maxCamOffsetBackward = 0;

    if (py + newVy < camY - maxCamOffsetBackward) {
        newVy = Math.max(CAMERA_SPEED * 1.25, newVy);
    }
    if (py + newVy > camY + maxCamOffsetForward) {
        newVy = Math.min(0, newVy);
    }
    var maxBorderDist = GRID_SIZE * 2;

    if (px + newVx < maxBorderDist || px + newVx > GameState.groundLayer.width * GRID_SIZE - maxBorderDist) {
        newVx = 0;
    }

    // Check if we hit something solid
    pos = this.threeObject.position;
    var scale = this.threeObject.scale;
    px = pos.x;
    py = pos.y;

    var pr = [px - scale.x * 0.5 + newVx, py - scale.y * 0.5 + newVy, scale.x, scale.y];

    var result = {};
    if (checkGameObjectCollision(pr, GameState.solids, result)) {

        // Check only moving along y
        prx = [px - scale.x * 0.5 + newVx, py - scale.y * 0.5, scale.x, scale.y];
        pry = [px - scale.x * 0.5, py - scale.y * 0.5 + newVy, scale.x, scale.y];

        var collideX = checkGameObjectCollision(prx, GameState.solids, result);
        var collideY = checkGameObjectCollision(pry, GameState.solids, result);

        if (collideX) {
            newVx = 0;
        }
        if (collideY) {
            newVy = 0;
        }
    }

    if (newVy != 0 && newVx != 0) {
        var velVec = new THREE.Vector2(newVx, newVy);
        var speed = velVec.length();
        if (speed > maxSpeed) {
            var correctedVel = new THREE.Vector2(newVx, newVy).multiplyScalar(maxSpeed / speed);
            newVx = correctedVel.x;
            newVy = correctedVel.y;
        }
    }

    vx = newVx;
    vy = newVy;

    this.velocity.x = vx;
    this.velocity.y = vy;

    LivingObject.prototype.step.call(this);

    var cannonCount = this.cannonFireCounters.length;
    var cannonAngleInc = Math.PI * 2 / cannonCount;

    this.cannonPlayCounter++;

    for (var i=0; i<cannonCount; i++) {
        this.cannonFireCounters[i]++;

        var fireIntervalLevel = 1 + i;

        var interval = getCannonFireInterval(i, this.index);

        if (fireDown && this.cannonFireCounters[i] > interval) {
            this.cannonFireCounters[i] = 0;

            var angle = Math.PI * 0.5 + i * cannonAngleInc;

            var dx = Math.cos(angle);
            var dy = Math.sin(angle);

            var speed = 10;

            var bullet = new CannonBullet();
            bullet.damage = getCannonDamage(i, this.index);
            bullet.addToScene(GameState.scene);
            bullet.setPosition(this.threeObject.position);


            bullet.setVelocity({x: this.velocity.x + dx * speed, y: this.velocity.y + dy * speed, z: this.velocity.z});
            var bulletSize = (0.25 + 0.2 * bullet.damage) * GRID_SIZE;
            bullet.setScale({x: bulletSize, y: bulletSize, z: bulletSize});
            bullet.owner = this;

            var direction = new THREE.Vector3(dx, dy, 0);
            var lookAtPos = bullet.threeObject.position.clone().addSelf(direction);
            bullet.threeObject.lookAt(lookAtPos);

            GameState.projectiles.push(bullet);

            if (this.cannonPlayCounter > 10) {
                playIfAvailable(sounds.cannon.sound);
                this.cannonPlayCounter = 0;
            }

        }

    }

    var bombCount = this.bombFireCounters.length;
    var cannonAngleInc = Math.PI * 0.2 / bombCount;

    this.bombPlayCounter++;

    for (var i=0; i<bombCount; i++) {
        this.bombFireCounters[i]++;

        var interval = getBombFireInterval(i, this.index);

        if (bombDown && this.bombFireCounters[i] > interval) {


            this.bombFireCounters[i] = 0;

            var angle = Math.PI * 0.5;
            if (bombCount > 1) {
                var frac = i / (bombCount - 1);
                angle = Math.PI * (0.5 - 0.2 + 0.4 * frac);
            }
            var dx = Math.cos(angle);
            var dy = Math.sin(angle);

            var speed = 3;

            var bomb = new Bomb();
            bomb.damage = getBombMaxDamage(i, this.index);
            bomb.addToScene(GameState.scene);
            bomb.setPosition(this.threeObject.position);
            bomb.setVelocity({x: this.velocity.x * 0.25 + speed * dx, y: this.velocity.y * 0.25 + speed * dy, z: this.velocity.z});
            var bombSize = (0.25 + 0.05 * bomb.damage) * GRID_SIZE;

            bomb.setScale({x: bombSize, y: bombSize, z: bombSize});
            bomb.owner = this;

            if (this.bombPlayCounter > 10) {
                playIfAvailable(sounds.bomb.sound);
                this.bombPlayCounter = 0;
            }

            GameState.projectiles.push(bomb);
//            logit("Adding bomb");
        }

    }


    result = {};
    if (checkGameObjectCollision(pr, GameState.pickups, result)) {
        var toRemove = [];
        for (var i=0; i<result.objects.length; i++) {
            var o = result.objects[i];

            givePowerup(o.type, this.index);
            o.removeMe = true;
        }
    }

};


function checkMultiGameObjectCollision(arr1, arr2, result) {
    result.pairs = [];
    for (var j=0; j<arr1.length; j++) {
        var obj1 = arr1[j];

        var scale1 = obj1.threeObject.scale;
        var pos1 = obj1.threeObject.position;
        var vel1 = obj1.velocity;

        var cr1 = null;
        if (vel1) {
            cr1 = [pos1.x - scale1.x * 0.5 + vel1.x, pos1.x - scale1.y * 0.5 + vel1.y, scale1.x, scale1.y];
        } else {
            cr1 = [pos1.x - scale1.x * 0.5, pos1.x - scale1.y * 0.5, scale1.x, scale1.y];
        }
        for (var i=0; i<arr2.length; i++) {
            var obj2 = arr2[i];
            var pos = obj2.threeObject.position;
            var scale = obj2.threeObject.scale;
            var gx = pos.x - scale.x * 0.5;
            var gy = pos.y - scale.y * 0.5;
            var cr2 = [gx, gy, scale.x, scale.y];
            if (rectCollide(cr1, cr2)) {
                result.pairs.push([obj1, obj2]);
                return true;
            }
        }
    }
    return false;
}

function checkSingleObjectCollision(pr, obj, result) {
    var pos = obj.threeObject.position;
    var scale = obj.threeObject.scale;
    var gx = pos.x - scale.x * 0.5;
    var gy = pos.y - scale.y * 0.5;
    var or = [gx, gy, scale.x, scale.y];
    if (rectCollide(pr, or)) {
        result.objects.push(obj);
        return true;
    }
}

function checkGameObjectCollision(pr, arr, result) {
    var r = false;
    result.objects = [];
    for (var i=0; i<arr.length; i++) {
        var obj = arr[i];
        if (checkSingleObjectCollision(pr, obj, result)) {
            r = true;
            return true;
        }
    }
    return r;
}


function giveScore(score, playerIndex) {
    var soundInfo = sounds.extraPoints;

    if (soundInfo) {
        playIfAvailable(soundInfo.sound);
    } else {
        logit("Cound not find sound for points ");
    }

}

function givePowerup(type, playerIndex) {
    var soundInfo = sounds[type];

    if (soundInfo) {
        playIfAvailable(soundInfo.sound);
    } else {
        logit("Cound not find sound for pickup " + type);
    }

    var player = GameState.players[playerIndex];
    switch (type) {
        case CANNON_FASTER:
            GameState.gatheredCannonRateLevels[playerIndex][findMinIndex(GameState.gatheredCannonRateLevels[playerIndex])]++;
            break;
        case CANNON_DAMAGE_UP:
            GameState.gatheredCannonDamageLevels[playerIndex][findMinIndex(GameState.gatheredCannonDamageLevels[playerIndex])]++;
            break;
        case CANNON_NEW:
            GameState.gatheredCannonDamageLevels[playerIndex].push(0);
            GameState.gatheredCannonRateLevels[playerIndex].push(0);
            player.cannonFireCounters.push(1000);
            break;
        case BOMB_FASTER:
            GameState.gatheredBombRateLevels[playerIndex][findMinIndex(GameState.gatheredBombRateLevels[playerIndex])]++;
            break;
        case BOMB_DAMAGE_UP:
            GameState.gatheredBombDamageLevels[playerIndex][findMinIndex(GameState.gatheredBombDamageLevels[playerIndex])]++;
            break;
        case BOMB_NEW:
            GameState.gatheredBombDamageLevels[playerIndex].push(0);
            GameState.gatheredBombRateLevels[playerIndex].push(0);
            player.bombFireCounters.push(1000);
            break;
        case SHIP_FASTER:
            GameState.gatheredSpeedLevels[playerIndex]++;
            break;
        case SHIP_MAX_HEALTH:
            GameState.gatheredHealthLevels[playerIndex]++;
            player.maxHealth = getMaxHealth(playerIndex);
            player.health = player.maxHealth;
            break;
        case SHIP_HEALTH:
            player.health += 0.5;
            if (player.health > player.maxHealth) {
                player.health = player.maxHealth;
            }
            break;
    }
    var sp = getGoodScreenMessagePos(playerIndex);
    var message = new ScreenMessage(powerupTexts[type], sp.x, sp.y);
    GameState.screenMessages.push(message);

}


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