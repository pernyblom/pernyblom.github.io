
var VisualizerMode = {
    PLAY: 0,
    PAUSE: 1,
    STOP: 2
};




function Visualizer() {
    this.mode = VisualizerMode.STOP;
    this.currentBeatTime = 0;
    this.currentStopBeatTime = 0;
    this.minBeat = 0;
    this.maxBeat = 1;
    this.focusBeat = 0;

    this.sectionTimes = null;
    this.songStructureInfo = null;
}

Visualizer.prototype.updateSectionFramework = function() {
};

Visualizer.prototype.setSectionInfos = function(times, structure) {
    this.sectionTimes = times;
    this.songStructureInfo = structure;
    this.updateSectionFramework();
    return this;
};

Visualizer.prototype.setMode = function(mode) {
    this.mode = mode;
//    switch (mode) {
//        case VisualizerMode.STOP:
//            this.clearHighlightNotes();
//            break;
//    }
    return this;
};


Visualizer.prototype.render = function() {
};

Visualizer.prototype.step = function(dt) {
};

Visualizer.prototype.setCurrentPlayBeatTime = function(beatTime) {
    this.currentBeatTime = beatTime;
//    logit(" someone setting beat time " + beatTime);
    return this;
};


Visualizer.prototype.addRenderData = function(data, beatOffset) {
};

Visualizer.prototype.resetRenderData = function() {
    this.mode = VisualizerMode.STOP;
    this.minBeat = 0;
    this.maxBeat = 1;
};



var Visualizer3DPlayMovementMode = {
    ROTATE: 0,
    PAN: 1
};
var Visualizer3DPauseMovementMode = {
    ROTATE: 0,
    PAN: 1
};

function Visualizer3D(canvas, options) {
    Visualizer.call(this);
    if (canvas) {


        this.mousePageX = canvas.width * 0.5;
        this.mousePageY = canvas.height * 0.5;
        this.mouseCanvasX = canvas.width * 0.5;
        this.mouseCanvasY = canvas.height * 0.5;
        this.mouseCanvasDragDx = 0;
        this.mouseCanvasDragDy = 0;
        this.mouseCanvasDown = false;

        this.fractionDragVelX = 0;
        this.fractionDragVelY = 0;

        this.currentAngle = 0;

        var that = this;

//        $(canvas).on("touchmove", function (event) {
//            var e = event.originalEvent;
//            if (e.touches && e.touches.length > 0) {
//                var touch = e.touches[0];
//
//                var dx = touch.clientX - that.mousePageX;
//                var dy = touch.clientY - that.mousePageY;
//                that.mouseCanvasDragDx += dx;
//                that.mouseCanvasDragDy += dy;
//            }
//        });
//        $(canvas).on("touchstart", function (event) {
//            var e = event.originalEvent;
//            if (e.touches && e.touches.length > 0) {
//                var touch = e.touches[0];
//                that.mouseCanvasDown = true;
//                that.mousePageX = touch.clientX;
//                that.mousePageY = touch.clientY;
//            }
//        });
//        $(canvas).on("touchend", function (event) {
//            var e = event.originalEvent;
//            if (e.touches && e.touches.length > 0) {
//                var touch = e.touches[0];
//                var dx = touch.clientX - that.mousePageX;
//                var dy = touch.clientY - that.mousePageY;
//                that.mouseCanvasDragDx += dx;
//                that.mouseCanvasDragDy += dy;
//            }
//            that.mouseCanvasDown = false;
//        });

        $(document).on("mousemove", function(event) {
            if (that.mouseCanvasDown) {
                var dx = event.pageX - that.mousePageX;
                var dy = event.pageY - that.mousePageY;
                that.mouseCanvasDragDx += dx;
                that.mouseCanvasDragDy += dy;
            }
            that.mousePageX = event.pageX;
            that.mousePageY = event.pageY;
        });
        $(canvas).on("mousemove", function(event) {
            if (that.mouseCanvasDown) {
                that.mouseCanvasDragDx += event.pageX - that.mouseCanvasX;
                that.mouseCanvasDragDy += event.pageY - that.mouseCanvasY;
            }
            that.mouseCanvasX = event.pageX;
            that.mouseCanvasY = event.pageY;
        });
        $(canvas).on("mousedown", function(event) {
            that.mouseCanvasDown = true;
        });
        $(document).on("mouseup", function(event) {
            that.mouseCanvasDown = false;
        });

        this.clearColor = 0x050510;

        this.renderChannelNames = [];

        this.playMovementMode = Visualizer3DPlayMovementMode.PAN;
        this.stopMovementMode = Visualizer3DStopMovementMode.PAN_INTERACTIVE_HOVER;
        this.pauseMovementMode = Visualizer3DPauseMovementMode.PAN;
        this.beatLengthScale = 2.0;
        var w = canvas.width;
        var h = canvas.height;

        var fov = 75;
        var near = 1;
        var far = 1000;

        this.canvas = canvas;
//        this.camera = new THREE.PerspectiveCamera( fov, w / h, near, far );
        this.camera = new THREE.CombinedCamera(w, h, fov, near, far, near, far);
        this.camera.position.set(0, 60, 50);
        this.camera.lookAt(new THREE.Vector3(0, 40, 0));
//        this.camera.toOrthographic();
        this.scene = new THREE.Scene();

        this.scene.fog = new THREE.FogExp2( this.clearColor, 0.008);


        this.landscapeChunkSize = 128;
        this.landscapeChunkDivisions = this.getLandscapeChunkDivisions();

        var rnd = new MersenneTwister(3423432);
        this.perlin = new ClassicalNoise(rnd);

        this.frustumChunks = new FrustumCullingChunks();

        this.createLandscape();
//        this.scene.add(this.createLandscape());

        this.addGlobalLights();

        this.noteChunks = [];

        this.noteCollisionGrid = [];
        this.allNoteDatas = [];

        this.currentLookAt = new THREE.Vector3(0, 0, 0);

    }
}

Visualizer3D.prototype = new Visualizer();

Visualizer3D.prototype.getLandscapeChunkDivisions = function() {
    return 16;
};

Visualizer3D.prototype.clearHighlightNotes = function() {

    this.upperLight.intensity = 0;
    this.middleLight.intensity = 0;
    this.lowerLight.intensity = 0;

    for (var i=0; i<this.allNoteDatas.length; i++) {
        var dat = this.allNoteDatas[i];
        dat.mesh.scale.set(dat.w, 1, 1);
        dat.material.emissive = new THREE.Color(dat.normalEmissive);
        dat.material.color = new THREE.Color(dat.normalColor);
    }
};

Visualizer3D.prototype.highlightNotes = function(beat) {
    var b = Math.floor(beat);
//    logit("Checking beat " + beat);

    this.upperLight.intensity = 0;
    this.middleLight.intensity = 0;
    this.lowerLight.intensity = 0;

    var lightDatas = [
        {
            light: this.upperLight,
            colorVec: new THREE.Vector3(0.01, 0.01, 0.01),
            pos: new THREE.Vector3(0, 0, 0),
            count: 0
        },
        {
            light: this.middleLight,
            colorVec: new THREE.Vector3(0.01, 0.01, 0.01),
            pos: new THREE.Vector3(0, 0, 0),
            count: 0
        },
        {
            light: this.lowerLight,
            colorVec: new THREE.Vector3(0.01, 0.01, 0.01),
            pos: new THREE.Vector3(0, 0, 0),
            count: 0
        }
    ];


    if (b >= 0) {
        var arr = this.noteCollisionGrid[b];

        if (arr) {
//            logit("Checking beat " + beat + " " + arr.length);


            for (var i=0; i<arr.length; i++) {
                var dat = arr[i];
                var onEvent = dat.onEvent;
                var channel = onEvent.c;
//                logit(channel);

                var channelName = this.renderChannelNames[channel];

                var offEvent = dat.offEvent;
                if (beat >= onEvent.t && beat <= offEvent.t) {
                    var frac = (beat - onEvent.t) / (offEvent.t - onEvent.t);
                    var invFrac = 1.0 - frac;
                    var amp = 0.7;
                    var newEmissive = new THREE.Color(dat.normalColor);
                    var newColor = new THREE.Color(dat.playColor);
                    dat.material.emissive = newEmissive;
                    dat.material.color = newColor;
                    dat.mesh.scale.set(dat.w, 1 + amp * invFrac, 1 + amp * invFrac);

                    var lightIndex = 0;
                    if (channelName.indexOf("inner") == 0) {
                        lightIndex = 1;
                    } else if (channelName.indexOf("bass") == 0 || channelName.indexOf("percussion") == 0) {
                        lightIndex = 2;
                    }
                    var lightData = lightDatas[lightIndex];

                    var intensity = Math.max(0.5, invFrac);

                    lightData.colorVec.add(new THREE.Vector3(newEmissive.r * intensity, newEmissive.g * intensity, newEmissive.b * intensity));
                    lightData.pos.add(new THREE.Vector3(dat.minX, dat.minY, dat.minZ));
                    lightData.count++;

                } else {
                    dat.mesh.scale.set(dat.w, 1, 1);
                    dat.material.emissive = new THREE.Color(dat.normalEmissive);
                    dat.material.color = new THREE.Color(dat.normalColor);
                }
            }
        }
    }

    for (var i=0; i<lightDatas.length; i++) {
        var lightData = lightDatas[i];
        if (lightData.count > 0) {
            lightData.pos.divideScalar(lightData.count);
            lightData.light.position.copy(lightData.pos);
//            logit(lightData.pos.x + ", " + lightData.pos.y + ", " + lightData.pos.z);
            lightData.light.intensity = 0.5 * lightData.colorVec.length();
            lightData.colorVec.normalize();
            var lightColor = new THREE.Color();
            lightColor.r = lightData.colorVec.x;
            lightColor.g = lightData.colorVec.y;
            lightColor.b = lightData.colorVec.z;
            lightData.light.color = lightColor;
        }
    }
};

Visualizer3D.prototype.step = function(dt) {


    var towardsPosition = new THREE.Vector3();
    var towardsLookAt = new THREE.Vector3(1, 0, 0);

    var currentPosition = new THREE.Vector3().copy(this.camera.position);
    var currentLookAt = this.currentLookAt;

    var factor = 0.9;


    var docW = window.innerWidth;
    var docH = window.innerHeight;

    var fractionX = this.mousePageX / docW;
    var fractionY = this.mousePageY / docH;

    var fractionCanvasDragDx = this.mouseCanvasDragDx / docW;
    var fractionCanvasDragDy = this.mouseCanvasDragDy / docH;

    var dSec = dt * 0.001;

    if (!docW || !docH) {
        var $document = $(document);
        docW = $document.innerWidth();
        docH = $document.innerWidth();
    }

    if (dSec > 0 && docW && docH) {
        if (this.mouseCanvasDown) {
            var velFactor = 0.5;
            var invVelFactor = 1.0 - velFactor;

            var fractionCanvasDragDxDt = fractionCanvasDragDx / dSec;
            var fractionCanvasDragDyDt = fractionCanvasDragDy / dSec;
            this.fractionDragVelX = this.fractionDragVelX * velFactor + fractionCanvasDragDxDt * invVelFactor;
            this.fractionDragVelY = this.fractionDragVelY * velFactor + fractionCanvasDragDyDt * invVelFactor;
        } else {
            var dragCoeff = 1.5;
            var forceX = -dragCoeff * this.fractionDragVelX;
            var forceY = -dragCoeff * this.fractionDragVelY;
            this.fractionDragVelX += forceX * dSec;
            this.fractionDragVelY += forceY * dSec;
        }
    }

    switch (this.mode) {
        case VisualizerMode.PLAY:
            var posX = this.currentBeatTime * this.beatLengthScale;
            var distanceZ = 70;

            var lookAtY = 70;

            towardsPosition.set(posX, lookAtY, distanceZ);
            towardsLookAt.set(posX, lookAtY, 0);

            this.highlightNotes(this.currentBeatTime);
            break;
        case VisualizerMode.PAUSE:
        case VisualizerMode.STOP:
            this.currentStopBeatTime += dt * 0.002;
            var seconds = this.currentStopBeatTime;
//            this.clearHighlightNotes();
            switch (this.stopMovementMode) {
                case Visualizer3DStopMovementMode.ROTATE_INTERACTIVE_HOVER:
                    var centerX = this.maxBeat * 0.5 * this.beatLengthScale;

                    var distance = 150 - 100 * fractionY;
                    var height = 150 - 100 * fractionY;
                    var phase = Math.PI * fractionX;

                    towardsPosition.set(distance * Math.cos(phase) + centerX, height, distance * Math.sin(phase));
                    towardsLookAt.set(centerX, 60, 0);

                    break;
                case Visualizer3DStopMovementMode.ROTATE_PAN_INTERACTIVE_HOVER:
                    var centerX = this.maxBeat * fractionX * this.beatLengthScale;

                    var distance = 100 - 50 * fractionY;
                    var height = 100 - 50 * fractionY;
                    var phase = -0.75 * Math.PI * (fractionX - 0.5) - Math.PI * 1.5;

                    towardsPosition.set(distance * Math.cos(phase) + centerX, height, distance * Math.sin(phase));
                    towardsLookAt.set(centerX, 60, 0);

                    break;
                case Visualizer3DStopMovementMode.PAN_INTERACTIVE_HOVER:
                    var centerX = this.maxBeat * fractionX * this.beatLengthScale;

                    var depth = 60;
                    var height = 80 - 40 * fractionY;

                    towardsPosition.set(centerX, height, depth);
                    towardsLookAt.set(centerX, height, 0);
                    break;
                case Visualizer3DStopMovementMode.PAN_INTERACTIVE_DRAG:

                    var targetX = clamp(currentLookAt.x - docW * this.fractionDragVelX * dSec, 0, this.maxBeat * this.beatLengthScale);
                    var targetY = clamp(currentLookAt.y + docH * this.fractionDragVelY * dSec, 0, 127);

                    var depth = 60;

                    towardsPosition.set(targetX, targetY, depth);
                    towardsLookAt.set(targetX, targetY, 0);
                    break;
                case Visualizer3DStopMovementMode.ROTATE_INTERACTIVE_DRAG:

                    var centerX = this.maxBeat * 0.5 * this.beatLengthScale;
                    this.currentAngle += this.fractionDragVelX * dSec;

                    var camPos = this.camera.position;
                    var targetDistance = clamp(camPos.y + docH * this.fractionDragVelY * dSec, 40, 500);

                    var height = targetDistance;
                    var distance = targetDistance;
                    var lookAtY = 60;

                    towardsPosition.set(centerX + distance * Math.cos(this.currentAngle), height, distance * Math.sin(this.currentAngle));
                    towardsLookAt.set(centerX, lookAtY, 0);
                    break;
                case Visualizer3DStopMovementMode.ROTATE_PAN_INTERACTIVE_DRAG:

                    var camPos = this.camera.position;
                    var targetX = clamp(currentLookAt.x - docW * this.fractionDragVelX * dSec, 0, this.maxBeat * this.beatLengthScale);
                    var targetY = clamp(camPos.y + 500 * this.fractionDragVelY * dSec, 20, 300);

                    fractionX = targetX / (this.maxBeat * this.beatLengthScale);
                    var phase = 0.25 * Math.PI * (fractionX - 0.5) - Math.PI * 1.5;

                    var distance = targetY;

                    towardsPosition.set(distance * Math.cos(phase) + targetX, targetY, distance * Math.sin(phase));
                    towardsLookAt.set(targetX, 60, 0);
                    break;
                case Visualizer3DStopMovementMode.PAN:
                    var beatsPerSeconds = 1;

                    var distance = 60;
                    var frac = 0;
                    if (this.maxBeat > 5) {
                        var period = 2 * this.maxBeat * this.beatLengthScale;

                        var x = beatsPerSeconds * this.beatLengthScale * seconds;
                        frac = mod(x, period) / period;

                        if (frac >= 0.5) {
                            frac = 1.0 - (frac - 0.5) * 2;
                        } else {
                            frac *= 2;
                        }
                    }
                    var posX = frac * this.maxBeat * 2;

                    towardsPosition.set(posX, distance, distance);
                    towardsLookAt.set(posX, 60, 0);
                    break;
                case Visualizer3DStopMovementMode.ROTATE:
                    var centerX = this.maxBeat * 0.5 * this.beatLengthScale;

                    var distance = 100;
                    var height = 100;
                    var frequency = 0.01;
                    var phase = frequency * Math.PI * 2 * seconds + Math.PI / 2;

                    towardsPosition.set(100 * Math.cos(phase) + centerX, height, 100 * Math.sin(phase));
                    towardsLookAt.set(centerX, 60, 0);
                    break;
            }
            break;
    }

    var invFactor = 1.0 - factor;

    this.camera.position.set(towardsPosition.x * invFactor + currentPosition.x * factor,
        towardsPosition.y * invFactor + currentPosition.y * factor,
        towardsPosition.z * invFactor + currentPosition.z * factor);

    currentLookAt = new THREE.Vector3(towardsLookAt.x * invFactor + currentLookAt.x * factor,
        towardsLookAt.y * invFactor + currentLookAt.y * factor,
        towardsLookAt.z * invFactor + currentLookAt.z * factor);
    var distanceToLookAt = this.camera.position.distanceTo(currentLookAt);
    if (distanceToLookAt < 0.0001) {
        // Crazy, but it feels better to deal with this than to hope for the best :)
        currentLookAt.add(new THREE.Vector3(0.1 * Math.random() + 0.01, 0.1 * Math.random(), 0.1 * Math.random()));
    }

    this.camera.lookAt(currentLookAt);
    this.currentLookAt = currentLookAt;

    var camMatrix = new THREE.Matrix4();
    camMatrix.multiplyMatrices( this.camera.projectionMatrix, this.camera.matrixWorldInverse );
    this.frustumChunks.updateScene(this.scene, camMatrix);

    // Reset the drag memory
    this.mouseCanvasDragDx = 0;
    this.mouseCanvasDragDy = 0;

};


Visualizer3D.prototype.getLandscapeNormal = function(x, y) {

    var d = 0.1;
    var h = this.randomHeight(x, y);
    var dzdx = (this.randomHeight(x + d, y) - h) / d;
    var dzdy = (this.randomHeight(x, y + d) - h) / d;

//    logit("d stuff " + dzdx + " " + dzdy);

    var result = new THREE.Vector3(-dzdx, 1, -dzdy).normalize();

    return result;
};

Visualizer3D.prototype.randomHeight = function(x, y) {
    var freq = 3;

    var landscapeChunkSize = this.landscapeChunkSize;
    var perlin = this.perlin;

    var z = 34.342352
    var n = perlin.noise(freq * x / landscapeChunkSize, freq * y / landscapeChunkSize, z);

    freq *= 2;
    z = 21.23423;
    n += 0.5 * perlin.noise(freq * x / landscapeChunkSize, freq * y / landscapeChunkSize, z);

    freq *= 2;
    z = 43.24891;
    n += 0.25 * perlin.noise(freq * x / landscapeChunkSize, freq * y / landscapeChunkSize, z);
//        var n = perlin.noise(x, y, 21.32124432);

    var result = 40 + n * 20;

    var corridorRadius = 35;
    var corridorHeight = 15;

    var corridorMaxInfulence = 0.5;
    var absY = Math.abs(y);
    if (absY < corridorRadius) {
        var mixValue = (corridorRadius - absY) / corridorRadius;
        mixValue = Math.min(mixValue, corridorMaxInfulence);
        result = mixValue * corridorHeight + (1.0 - mixValue) * result;
    }

    return result;
};


Visualizer3D.prototype.createLandscapeChunk = function(cx, cz) {

    var landscapeChunkSize = this.landscapeChunkSize;
    var landscapeChunkDivisions = this.landscapeChunkDivisions;


    var landscapeChunkParent = new THREE.Object3D();
    var landscapeGeom = new THREE.PlaneGeometry(landscapeChunkSize, landscapeChunkSize,
        landscapeChunkDivisions-1, landscapeChunkDivisions-1);
    var m2 = new THREE.Matrix4();
    m2.rotateX(-Math.PI * 0.5);

    var chunkOffsetX = cx * landscapeChunkSize;
    var chunkOffsetZ = cz * landscapeChunkSize;

    landscapeGeom.applyMatrix(m2);
    var step = landscapeChunkSize / landscapeChunkDivisions;
    for ( var i = 0, l = landscapeGeom.vertices.length; i < l; i ++ ) {
        var x = i % landscapeChunkDivisions;
        var y = ~~ ( i / landscapeChunkDivisions );
        var v = landscapeGeom.vertices[i];
        v.y = this.randomHeight(v.x + chunkOffsetX, v.z + chunkOffsetZ);
    }

    var vertices = landscapeGeom.vertices;
    for (var i=0; i<landscapeGeom.faces.length; i++) {
        var face = landscapeGeom.faces[i];
        var va = vertices[face.a];
        var vb = vertices[face.b];
        var vc = vertices[face.c];
        var vd = vertices[face.d];
        face.vertexNormals[ 0 ].copy(this.getLandscapeNormal(va.x + chunkOffsetX, va.z + chunkOffsetZ));
        face.vertexNormals[ 1 ].copy(this.getLandscapeNormal(vb.x + chunkOffsetX, vb.z + chunkOffsetZ));
        face.vertexNormals[ 2 ].copy(this.getLandscapeNormal(vc.x + chunkOffsetX, vc.z + chunkOffsetZ));
        face.vertexNormals[ 3 ].copy(this.getLandscapeNormal(vd.x + chunkOffsetX, vd.z + chunkOffsetZ));
    }


    landscapeGeom.computeFaceNormals();
//    landscapeGeom.computeVertexNormals();
    landscapeGeom.normalsNeedUpdate = true;

//    var material = this.getLandscapeMaterial(0x444444, 0x000000);
    var material = this.getLandscapeMaterial(0x444444, 0x333333);

    landscapeGeom.computeCentroids();

    var mesh = new THREE.Mesh( landscapeGeom, material );
    landscapeChunkParent.add(mesh);

    landscapeChunkParent.position.set(chunkOffsetX, 0, chunkOffsetZ)

    return landscapeChunkParent;
};


Visualizer3D.prototype.createLandscape = function() {
    this.landscapeInfos = [];


//    var landscapeParent = new THREE.Object3D();

    var minChunkIndexX = -1;
    var maxChunkIndexX = 5;
    var minChunkIndexZ = -1;
    var maxChunkIndexZ = 1;
    var chunkRad = this.landscapeChunkSize / Math.sqrt(2);

    for (var x=minChunkIndexX; x<=maxChunkIndexX; x++) {
        for (var z=minChunkIndexZ; z<=maxChunkIndexZ; z++) {
            var xIndex = x;
            var yIndex = z;
            var lsChunk = this.createLandscapeChunk(xIndex, yIndex);
            this.scene.add(lsChunk);
            this.frustumChunks.addChunk(lsChunk, {radius: chunkRad});
        }
    }
//    return landscapeParent;
};


Visualizer3D.prototype.render = function() {
    this.renderer.render(this.scene, this.camera);
};


Visualizer3D.prototype.resized = function(w, h) {
//    var w = this.canvas.width;
//    var h = this.canvas.height;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
};

Visualizer3D.prototype.addGlobalLights = function() {
    var light = new THREE.DirectionalLight(0xffffff, 0.5);
    var pos = new THREE.Vector3(0.5, 0.5, 0.5).normalize();
    light.position.copy(pos);
    this.scene.add(light);

    this.upperLight = new THREE.PointLight(0xffffff, 0, 100);
    this.middleLight = new THREE.PointLight(0xffffff, 0, 100);
    this.lowerLight = new THREE.PointLight(0xffffff, 0, 100);

    this.scene.add(this.upperLight);
    this.scene.add(this.middleLight);
    this.scene.add(this.lowerLight);
};

Visualizer3D.prototype.getNoteMaterial = function(color, emissive) {
    if (!color) {
        color = 0;
    }
    if (!emissive) {
        emissive = 0;
    }
    return new THREE.MeshPhongMaterial( { color: color, emissive: emissive, overdraw: true} );
//    return new THREE.LineBasicMaterial( { color: color, emissive: emissive, overdraw: true} );
};

Visualizer3D.prototype.getLandscapeMaterial = function(color, emissive) {
//    return new THREE.LineBasicMaterial( { color: color, emissive: emissive, overdraw: true} );
    return new THREE.MeshPhongMaterial( { color: color, emissive: emissive, overdraw: true } );
};

Visualizer3D.prototype.createNoteGeometry = function() {
    return new THREE.CubeGeometry( 1, 1, 1 );
};

Visualizer3D.prototype.getChannelPlayColors = function() {
    return {
        melody: [0xff0000, 0xff8800, 0xff8888],
        inner1: [0x00ff00, 0x88ff00, 0x88ff88],
        inner2: [0x0000ff, 0x8800ff, 0x8888ff],
        bass: [0xff0000, 0xff8800, 0xff8888],
        percussion: [0x666666]
    };
};

Visualizer3D.prototype.addRenderData = function(data, length) {
    Visualizer.prototype.addRenderData.call(this, data, length);

    this.renderChannelNames = data.renderChannelNames;

//    logit(this.renderChannelNames);

    var events = data.events;

    var parent = new THREE.Object3D();
//    parent.position.set(beatOffset * this.beatLengthScale, 0, 0);

    this.maxBeat = Math.max(this.maxBeat, length);

//    logit("setting pos to " + beatOffset * this.beatLengthScale);

    var notesDone = gatherNotesFromEvents(events);


    var channelColors = {
        melody: [0xff0000, 0xff8800, 0xff8888],
        inner1: [0x00ff00, 0x88ff00, 0x88ff88],
        inner2: [0x0000ff, 0x8800ff, 0x8888ff],
        bass: [0xff0000, 0xff8800, 0xff8888],
        percussion: [0x666666]
    };

    var channelPlayColors = this.getChannelPlayColors();


    var channelEmissiveColors = {
        melody: [0x020000, 0x020100, 0x020101],
        inner1: [0x000200, 0x010200, 0x010201],
        inner2: [0x000002, 0x010002, 0x010102],
        bass: [0x020000, 0x020100, 0x020101],
        percussion: [0x010101]
    };

    var channelZs = {
        melody: 2,
        inner1: 1,
        inner2: 0,
        bass: -1,
        percussion: -2
    };

    function getFromPrefix(data, str, def) {
        var result = def;
        for (var p in data) {
            if (str.indexOf(p) == 0) {
                result = data[p];
            }
        }
        return result;
    }

    var zSeparation = 2;

    var noteGeom = this.createNoteGeometry();

    // Prepare the collision grid. Make sure that every index has an array.
    for (var i=0; i<=length; i++) {
        this.noteCollisionGrid[i] = [];
    }

    this.allNoteDatas = [];
    for (var ch in notesDone) {
        var rawChannelIndex = parseInt(ch);
        var realChannelName = data.renderChannelNames[rawChannelIndex];

        if (realChannelName == "chordsRenderChannel") {
            continue;
        }

        var datas = notesDone[ch];
//    logit("Adding " + ch + " to scene");

        addAll(this.allNoteDatas, datas);

        var channelIndex = parseInt(realChannelName.charAt(realChannelName.length - 1)) - 1;

//        logit("real channel: " + realChannelName + " " + channelIndex);

        var color = getFromPrefix(channelColors, realChannelName, 0xffffff)[channelIndex];
        var playColor = getFromPrefix(channelPlayColors, realChannelName, 0xffffff)[channelIndex];
        var emissive = getFromPrefix(channelEmissiveColors, realChannelName, 0xffffff)[channelIndex];
        var z = zSeparation * getFromPrefix(channelZs, realChannelName, -4);

        for (var j=0; j<datas.length; j++) {
            var dat = datas[j];
            var onEvent = dat.onEvent;
            var offEvent = dat.offEvent;
            if (!offEvent) {
//            logit("Found on event without off event in final for");
                continue;
            }


            var minX = Math.floor(onEvent.t);
            var maxX = Math.ceil(offEvent.t);
            for (var xx = minX; xx <= maxX; xx++) {
                var arr = this.noteCollisionGrid[xx];
                if (!arr) {
                    arr = [];
                    this.noteCollisionGrid[xx] = arr;
                }
                arr.push(dat);
            }

            var noteDepth = 1;
            var noteHeight = 1;

            var x = onEvent.t * this.beatLengthScale;
            var y = onEvent.n;
            var w = this.beatLengthScale * (Math.max(0.05, (offEvent.t - onEvent.t - 0.1)));

            var material = this.getNoteMaterial(color, emissive);
            var mesh = new THREE.Mesh( noteGeom, material );

            dat.minX = x;
            dat.maxX = offEvent.t * this.beatLengthScale;
            dat.minY = y;
            dat.maxY = y + noteHeight;
            dat.minZ = z;
            dat.maxZ = z + noteDepth;
            dat.material = material;
            dat.normalColor = color;
            dat.playColor = playColor;
            dat.normalEmissive = emissive;
            dat.w = w;
            dat.mesh = mesh;

            mesh.position.set(x + w * 0.5, y, z);
            mesh.scale.set(w, 1, 1);

            parent.add(mesh);
        }
    }

    this.scene.add(parent);

    this.noteChunks.push(parent);

    this.render();
};

Visualizer3D.prototype.updateSectionFramework = function() {
    if (this.sectionMarkers && this.sectionMarkers.frameworkObject) {
        this.scene.remove(this.sectionMarkers.frameworkObject);
    }

    if (this.songStructureInfo && this.sectionTimes) {


        var frameworkObject = new THREE.Object3D();
        this.sectionMarkers = {
            frameworkObject: frameworkObject
        };


        function createLine(fx, fy, fz, tx, ty, tz, mat) {
            var geometry = new THREE.Geometry();
            var from = new THREE.Vector3();
            from.x = fx;
            from.z = fz;
            from.y = fy;
            var to = new THREE.Vector3();
            to.x = tx;
            to.z = tz;
            to.y = ty;
            geometry.vertices.push(from);
            geometry.vertices.push(to);

            var line = new THREE.Line( geometry, mat );
            return line;
        }


        function createText(x, y, z, text, size) {
            var fontSize = 12;
            var textMat = new THREE.ParticleCanvasMaterial( {
                color: 0xffffff,
                program: function ( context ) {
                    context.scale(1, -1);
                    context.font = fontSize + 'px Segoe UI,Arial,sans-serif';
                    context.fillText(text, 0, fontSize * 1.5);
                }
            } );

            var particle = new THREE.Particle(textMat);
            particle.position.x = x;
            particle.position.y = y;
            particle.position.z = z;
            particle.scale.x = particle.scale.y = size / fontSize;
            return particle;
        }


        var lineMat = new THREE.LineBasicMaterial( { color: 0xffff00, opacity: 0.5 } );

        var sectionTimes = arrayCopy(this.sectionTimes);
        sectionTimes.unshift(0);

        var minY = 20;
        var maxY = 105;

        var indexInfos = this.songStructureInfo.indexInfos;

        for (var i=0; i<sectionTimes.length; i++) {
            var time = sectionTimes[i];
            var x = time * this.beatLengthScale;
            frameworkObject.add(createLine(x, maxY, 0, x, maxY, 0, lineMat));
            frameworkObject.add(createLine(x, minY, 0, x, maxY, 0, lineMat));

            if (i < indexInfos.length) {
                var text = getSongPartName(i, this.songStructureInfo);
                frameworkObject.add(createText(x + 1, maxY, 0, text, 2));
            }
        }
//        console.log(this.songStructureInfo);

        this.scene.add(frameworkObject);
    }
};


Visualizer3D.prototype.resetRenderData = function() {
    Visualizer.prototype.resetRenderData.call(this);
    for (var i=0; i<this.noteChunks.length; i++) {
        var o = this.noteChunks[i];
        this.scene.remove(o);
    }

    this.noteChunks = [];
    this.noteCollisionGrid = [];
    this.currentBeatTime = 0;
    this.currentStopBeatTime = 0;

//    this.sectionMarkers = null;
//    logit(" render data is reset");
};


function CanvasVisualizer3D(canvas, options) {
    Visualizer3D.call(this, canvas, options);

    var w = canvas.width;
    var h = canvas.height;

    this.renderer = new THREE.CanvasRenderer({canvas: canvas});
    this.renderer.sortObjects = false;
    this.renderer.setSize( w, h );
    this.renderer.setClearColorHex(this.clearColor, 1);

}

CanvasVisualizer3D.prototype = new Visualizer3D();

CanvasVisualizer3D.prototype.getChannelPlayColors = function() {
    return {
        melody: [0xffffff, 0xffffff, 0xffffff],
        inner1: [0xffffff, 0xffffff, 0xffffff],
        inner2: [0xffffff, 0xffffff, 0xffffff],
        bass: [0xffffff, 0xffffff, 0xffffff],
        percussion: [0xffffff]
    };
};


CanvasVisualizer3D.prototype.createNoteGeometry = function() {
    return new THREE.PlaneGeometry( 1, 1 );
};


CanvasVisualizer3D.prototype.getLandscapeChunkDivisions = function() {
    return 8;
};


CanvasVisualizer3D.prototype.getNoteMaterial = function(color, emissive) {
    var result = new THREE.MeshBasicMaterial( { color: color, emissive: emissive, wireframe: false} );
    result.side = THREE.DoubleSide;
    return result;
};

CanvasVisualizer3D.prototype.getLandscapeMaterial = function(color, emissive) {
    return new THREE.MeshBasicMaterial( { color: color, emissive: emissive, wireframe: true } );
};


function WebGLVisualizer3D(canvas, options) {
    Visualizer3D.call(this, canvas, options);

    this.addBloom = getValueOrDefault(options, "addBloom", true);
    this.addVignette = getValueOrDefault(options, "addVignette", true);
    this.addSimulatedAA = getValueOrDefault(options, "addSimulatedAA", true);

    var w = canvas.width;
    var h = canvas.height;

    this.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: false});
    this.renderer.sortObjects = false;

    this.renderer.setSize( w, h );
    this.renderer.setClearColorHex(this.clearColor, 1);
    this.renderer.autoClear = false;

//    var renderTargetParameters = { generateMipmaps: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };

    var renderModel = new THREE.RenderPass( this.scene, this.camera );
    var effectBloom = new THREE.BloomPass(1, 25, 4.0, 512);
    var effectCopy = new THREE.ShaderPass( THREE.CopyShader );

    this.effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );

    this.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / w, 1 / h );

    var vignette = new THREE.ShaderPass(THREE.VignetteShader);
    vignette.uniforms[ 'darkness' ].value = 1.1;
    vignette.uniforms[ 'offset' ].value = 1;

    effectCopy.renderToScreen = true;

    this.composer = new THREE.EffectComposer( this.renderer );


    this.composer.addPass( renderModel );
    if (this.addBloom) {
        this.composer.addPass( effectBloom );
    }
    if (this.addSimulatedAA) {
        this.composer.addPass( this.effectFXAA );
    }
    if (this.addVignette) {
        this.composer.addPass( vignette );
    }
    this.composer.addPass( effectCopy );

}

WebGLVisualizer3D.prototype = new Visualizer3D();

WebGLVisualizer3D.prototype.render = function() {
    this.renderer.clear();
    this.composer.render();
};

WebGLVisualizer3D.prototype.resized = function(w, h) {
    Visualizer3D.prototype.resized.call(this, w, h);
    this.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / w, 1 / h );
//    this.glowcomposer.reset();
    this.composer.reset();
};






