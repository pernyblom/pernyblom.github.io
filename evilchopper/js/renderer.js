

function Renderer3D(canvas, options) {
    if (canvas) {

        this.clearColor = 0x050510;

        var w = canvas.width;
        var h = canvas.height;

        var fov = 75;
        var near = 1;
        var far = 1000;

        this.canvas = canvas;

//        this.scene.fog = new THREE.FogExp2( this.clearColor, 0.008);
    }
}


Renderer3D.prototype.render = function() {
    this.renderer.render(this.scene, this.camera);
};


Renderer3D.prototype.resized = function(w, h) {
//    var w = this.canvas.width;
//    var h = this.canvas.height;
    GameState.camera.aspect = w / h;
    GameState.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
};

Renderer3D.prototype.getPlayerShipBodyMaterial = function() {
    return new THREE.MeshLambertMaterial({color: 0xaaaaaa, emissive: 0x442222});
};

Renderer3D.prototype.getChopperBodyMaterial = function() {
    return new THREE.MeshLambertMaterial({color: 0777733, emissive: 0x333322});
};

Renderer3D.prototype.getChopperBossMaterial = function() {
    return new THREE.MeshLambertMaterial({color: 0xff2222, emissive: 0x441111});
};

Renderer3D.prototype.getPowerupMaterial = function(color, emissive) {
    return new THREE.MeshLambertMaterial({color: color, emissive: emissive});
};

Renderer3D.prototype.getDefenceTowerMaterial = function() {
    return new THREE.MeshLambertMaterial({color: 0xffffff, emissive: 0x111111});
};

Renderer3D.prototype.getDefenceTowerBossMaterial = function() {
    return new THREE.MeshLambertMaterial({color: 0xff2222, emissive: 0x441111});
};

Renderer3D.prototype.getHouse1Material = function() {
    return new THREE.MeshLambertMaterial({color: 0xffffff, emissive: 0x222222});
};


Renderer3D.prototype.getHouse2Material = function() {
    return new THREE.MeshLambertMaterial({color: 0xff5555, emissive: 0x332222});
};


Renderer3D.prototype.getCannonBulletMaterial = function() {
    return new THREE.MeshLambertMaterial({color: 0xff0000, emissive: 0x660000});
};

Renderer3D.prototype.getBombMaterial = function() {
    return new THREE.MeshLambertMaterial({color: 0xffff00, emissive: 0x666600});
};



Renderer3D.prototype.getWaterMaterial = function() {
    var result = new THREE.MeshLambertMaterial({color: 0x3333ff, emissive: 0x111144, opacity: 0.5});
    result.side = THREE.DoubleSide;
//    result.vertexColors = THREE.FaceColors;
    return result;
};

Renderer3D.prototype.getExplosionMaterial = function() {
    var result = new THREE.MeshLambertMaterial({color: 0xff2222, emissive: 0xff2222});
//    result.side = THREE.DoubleSide;
//    result.vertexColors = THREE.FaceColors;
    return result;
};

Renderer3D.prototype.getGroundMaterial = function(texture) {
    return new THREE.MeshPhongMaterial( { emissive: 0x222222, map: texture } );
};



function CanvasRenderer3D(canvas, options) {
    Renderer3D.call(this, canvas, options);

    var w = canvas.width;
    var h = canvas.height;

    this.renderer = new THREE.CanvasRenderer({canvas: canvas});
    this.renderer.sortObjects = false;
    this.renderer.setSize( w, h );
    this.renderer.setClearColorHex(this.clearColor, 1);
}
CanvasRenderer3D.prototype = new Renderer3D();


CanvasRenderer3D.prototype.getPhongOrBasicMaterial = function(color, emissive) {
    if (renderSettings.materialQuality > Quality.MEDIUM) {
        return new THREE.MeshPhongMaterial({color: color, emissive: emissive, shading: THREE.FlatShading});
    } else if (renderSettings.materialQuality > Quality.VERY_LOW) {
        return new THREE.MeshBasicMaterial({color: color, emissive: emissive, shading: THREE.FlatShading});
    } else {
        return new THREE.MeshBasicMaterial({color: color, emissive: emissive, wireframe: true, shading: THREE.FlatShading});
    }
};

CanvasRenderer3D.prototype.getPlayerShipBodyMaterial = function() {
    return this.getPhongOrBasicMaterial(0xaaaaaa, 0x442222);
};

CanvasRenderer3D.prototype.getChopperBodyMaterial = function() {
    return this.getPhongOrBasicMaterial(0x777733, 0x333311);
};

CanvasRenderer3D.prototype.getChopperBossMaterial = function() {
    return this.getPhongOrBasicMaterial(0xff2222, 0x441111);
};

CanvasRenderer3D.prototype.getPowerupMaterial = function(color, emissive) {
    return this.getPhongOrBasicMaterial(color, emissive);
};

CanvasRenderer3D.prototype.getDefenceTowerMaterial = function() {
    return this.getPhongOrBasicMaterial(0x444444, 0x111111);
};

CanvasRenderer3D.prototype.getDefenceTowerBossMaterial = function() {
    return this.getPhongOrBasicMaterial(0xff4444, 0x441111);
};

CanvasRenderer3D.prototype.getHouse1Material = function() {
    return this.getPhongOrBasicMaterial(0x666666, 0x222222);
};


CanvasRenderer3D.prototype.getHouse2Material = function() {
    return this.getPhongOrBasicMaterial(0x884444, 0x332222);
};


CanvasRenderer3D.prototype.getCannonBulletMaterial = function() {
    return this.getPhongOrBasicMaterial(0xff0000, 0x660000);
};

CanvasRenderer3D.prototype.getBombMaterial = function() {
    return this.getPhongOrBasicMaterial(0xffff00, 0x666600);
};


CanvasRenderer3D.prototype.getGroundMaterial = function(texture) {
    return new THREE.MeshBasicMaterial( { color: 0x333333, map: texture, overdraw: true, shading: THREE.FlatShading } );
};

CanvasRenderer3D.prototype.getWaterMaterial = function() {
    var result = new THREE.MeshBasicMaterial({color: 0x3333ff, emissive: 0x111144, opacity: 0.5});
    result.side = THREE.DoubleSide;
//    result.vertexColors = THREE.FaceColors;
    return result;
};

CanvasRenderer3D.prototype.getExplosionMaterial = function() {
    var result = new THREE.MeshBasicMaterial({color: 0xff2222, emissive: 0xff2222});
//    result.side = THREE.DoubleSide;
//    result.vertexColors = THREE.FaceColors;
    return result;
};


CanvasRenderer3D.prototype.render = function() {
//    this.renderer.clear();

//    this.renderModel.scene = GameState.scene;
//    this.renderModel.camera = GameState.camera;
    this.renderer.render(GameState.scene, GameState.camera);
};



function WebGLRenderer3D(canvas, options) {
    Renderer3D.call(this, canvas, options);

    this.addBloom = getValueOrDefault(options, "addBloom", true);
    this.addVignette = getValueOrDefault(options, "addVignette", true);
    this.addSimulatedAA = getValueOrDefault(options, "addSimulatedAA", true);

    var w = canvas.width;
    var h = canvas.height;

    this.renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: false});
    this.renderer.sortObjects = false;

    this.renderer.shadowMapEnabled = getValueOrDefault(options, "enableShadowMap", true);

    logit("Shadow maps: " + this.renderer.shadowMapEnabled);

    this.renderer.setSize( w, h );
    this.renderer.setClearColorHex(this.clearColor, 1);
    this.renderer.autoClear = false;

//    var renderTargetParameters = { generateMipmaps: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };

    this.renderModel = new THREE.RenderPass( GameState.scene, GameState.camera );
    var effectBloom = new THREE.BloomPass(1, 25, 4.0, 512);
    var effectCopy = new THREE.ShaderPass( THREE.CopyShader );

    this.effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );

    this.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / w, 1 / h );

    var vignette = new THREE.ShaderPass(THREE.VignetteShader);
    vignette.uniforms[ 'darkness' ].value = 1.1;
    vignette.uniforms[ 'offset' ].value = 1;

    effectCopy.renderToScreen = true;

    this.composer = new THREE.EffectComposer( this.renderer );


    this.composer.addPass( this.renderModel );
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

WebGLRenderer3D.prototype = new Renderer3D();

WebGLRenderer3D.prototype.render = function() {
    this.renderer.clear();

    this.renderModel.scene = GameState.scene;
    this.renderModel.camera = GameState.camera;
    this.composer.render();
};

WebGLRenderer3D.prototype.resized = function(w, h) {
    Renderer3D.prototype.resized.call(this, w, h);
    this.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / w, 1 / h );
    this.composer.reset();
};






