

function setupRenderer() {
    var $topDiv = $("#topdiv");
    var $overlay = $("#overlay");
    var $textOverlay = $("#textoverlay");
    var $body = $("#body");
    var $document = $(window.document);

    $body.css("margin", "0px");
    $body.css("padding", "0px");
    $body.css("border", "0px");
    $document.css("margin", "0px");
    $document.css("padding", "0px");
    $document.css("border", "0px");

    var canvasWidth = Math.max(16, $document.innerWidth() - 4);
    var canvasHeight = Math.max(16, $document.innerHeight() - 4);

//    $topDiv.css("margin-left", "auto");
//    $topDiv.css("margin-right", "auto");
    $topDiv.css("padding", "0px");
    $topDiv.css("border", "0px");
    $topDiv.css("width", canvasWidth + "px");
    $topDiv.css("height", canvasHeight + "px");
    $topDiv.css("position", "relative");

    $overlay.css("width", canvasWidth + "px");
    $overlay.css("height", canvasHeight + "px");
    $overlay.css("margin", "0px");
    $overlay.css("padding", "0px");
    $overlay.css("border", "0px");

//    $textOverlay.css("width", canvasWidth + "px");
//    $textOverlay.css("height", canvasHeight + "px");
    $textOverlay.css("top", (Math.round(canvasHeight * 0.3)) + "px");
    $textOverlay.css("left", (Math.round((canvasWidth - $textOverlay.innerWidth()) * 0.5)) + "px");
    $textOverlay.css("margin", "0px");
    $textOverlay.css("padding", "0px");
    $textOverlay.css("border", "0px");

//    alert(canvasWidth + ", " + canvasHeight);

    GameState.camera = new THREE.PerspectiveCamera( 75, canvasWidth / canvasHeight, 1, 10000 );
    GameState.camera.position.z = 800;

    GameState.scene = new THREE.Scene();

    if (useWebGL) {
        GameState.renderer = new THREE.WebGLRenderer({clearAlpha: 1, maxLights: 8});
    } else {
        GameState.renderer = new THREE.CanvasRenderer();
        GameState.renderer.setClearColorHex(0x000000, 1);
//        GameState.renderer.autoClear = false;
    }
    GameState.renderer.setSize( canvasWidth, canvasHeight );
    var $canvas = $(GameState.renderer.domElement);
    $canvas.css("margin", "0px");
    $canvas.css("padding", "0px");
    $canvas.css("border", "0px");
    $topDiv.append($canvas);
}
