
var Menus = {
    GAME_MENU: "game_menu",
    SETTINGS_MENU: "settings_menu",
    GRAPHICS_SETTINGS_MENU: "graphics_settings_menu",
    SOUND_SETTINGS_MENU: "sound_settings_menu",
    GAME_SETTINGS_MENU: "game_settings_menu",
    LEVEL_INTRO: "level_intro",
    LEVEL_COMPLETE: "level_complete",
    GAME_COMPLETE: "game_complete",
    PAUSE_MENU: "pause_menu"
};


var MenuInfos = {};

var graphicsSettingsChanged = false;

function setupMenus() {

    MenuInfos[Menus.GAME_MENU] = {
        caption: "Main Menu",
//    width: "15em",
        components: [
            {type: "button", text: "Play", width: "10em", height: "2em",
                action: function() {
                    changeLevel(GameState.initialLevelIndex);
                    GameState.subState = GameSubState.SHOWING_LEVEL_INTRO;
                    GameState.counter1 = 0;
                }},
            {type: "button", text: "Settings", width: "10em", height: "2em",
                action: function() {
                    GameState.subState = GameSubState.SHOWING_SETTINGS_MENU;
                }},
            {type: "dynamictext", texts: function() {
                var result = [];
                if (!Detector.webgl) {
                    result.push("WebGL not supported");
                }
                if (graphicsSettingsChanged) {
                    result.push("Graphics settings changed");
                    result.push("Refresh page to see any effect")
                }
                return result;
            }, fontSize: "50%", width: "20em"}
        ]
    };

    MenuInfos[Menus.PAUSE_MENU] = {
        caption: "Pause",
        components: [
            {type: "button", text: "Resume", width: "10em", height: "2em",
                action: function() {
                    GameState.subState = GameSubState.PLAYING;
                }},
            {type: "button", text: "Restart Level", width: "10em", height: "2em",
                action: function() {
                    changeLevel(GameState.levelIndex);
                    GameState.subState = GameSubState.SHOWING_LEVEL_INTRO;
                    GameState.counter1 = 0;
                }},
            {type: "button", text: "Main Menu", width: "10em", height: "2em",
                action: function() {
                    GameState.subState = GameSubState.SHOWING_GAME_MENU;
                    GameState.counter1 = 0;
                }}
        ]
    };


    MenuInfos[Menus.LEVEL_INTRO] = {
        caption: function() {
            return "Level " + (GameState.levelIndex + 1);
        },
        components: [
            {type: "dynamictext", texts: function() {
                var result = [];
                switch (GameState.levelIndex) {
                    case 0:
                    case 1:
                        if (isMobile) {
                            result.push("Left pad to move");
                            result.push("Shoot with 'S'");
                            result.push("Drop bomb with 'B'");
                            result.push("Shoot and drop bomb with 'S+B'");
                        } else {
                            result.push("Arrow keys or WASD to move");
                            result.push("Shoot with Z, C, B");
                            result.push("Drop bomb with X, V, N");
                        }
                        break;
                }
                return result;
            }, width: "15em", fontSize: "0.75em"},
            {type: "button", text: "GO!", width: "10em", height: "2em",
                action: function() {
                    GameState.subState = GameSubState.PLAYING;
                    GameState.counter1 = 0;
                }}
        ]
    };

    MenuInfos[Menus.SETTINGS_MENU] = {
        caption: "Settings",
        components: [
            {type: "button", text: "Game", width: "10em", height: "2em",
                action: function() {
                    GameState.subState = GameSubState.SHOWING_GAME_SETTINGS_MENU;
                }},
            {type: "button", text: "Graphics", width: "10em", height: "2em",
                action: function() {
                    GameState.subState = GameSubState.SHOWING_GRAPHICS_SETTINGS_MENU;
                }},
            {type: "button", text: "Sound", width: "10em", height: "2em",
                action: function() {
                    GameState.subState = GameSubState.SHOWING_SOUND_SETTINGS_MENU;
                }},
            {type: "button", text: "Back", width: "8em", height: "2em",
                action: function() {
                    GameState.subState = GameSubState.SHOWING_GAME_MENU;
                    GameState.counter1 = 0;
                }},
            {type: "dynamictext", texts: function() {
                var result = [];
                if (graphicsSettingsChanged) {
                    result.push("Graphics settings changed");
                    result.push("Refresh page to see any effect")
                }
                return result;
            }, fontSize: "50%", width: "20em"}

        ]
    };


    MenuInfos[Menus.GRAPHICS_SETTINGS_MENU] = {
        caption: "Graphics Settings",
        components: [
            {type: "text", texts: ["Graphics settings require game restart"], width: "12em", fontSize: "0.8em"},
            {type: "object", object: renderSettings,
                changeListeners: [
                    function() {
                        graphicsSettingsChanged = true;
                        renderSettings.saveToLocalStorage();
                    }],
                fontSize: "0.8em"},
            {type: "button", text: "Back", width: "8em", height: "2em",
                action: function() {
                    GameState.subState = GameSubState.SHOWING_SETTINGS_MENU;
                    renderSettings.saveToLocalStorage();
                }}
        ]
    };

    MenuInfos[Menus.SOUND_SETTINGS_MENU] = {
        caption: "Sound Settings",
        components: [
            {type: "object", object: soundSettings, fontSize: "0.8em"},
            {type: "button", text: "Back", width: "8em", height: "2em",
                action: function() {
                    GameState.subState = GameSubState.SHOWING_SETTINGS_MENU;
                    soundSettings.saveToLocalStorage();
                }}
        ]
    };

    MenuInfos[Menus.GAME_SETTINGS_MENU] = {
        caption: "Game Settings",
        components: [
            {type: "object", object: gameSettings, fontSize: "0.8em"},
            {type: "button", text: "Back", width: "8em", height: "2em",
                action: function() {
                    GameState.subState = GameSubState.SHOWING_SETTINGS_MENU;
                    gameSettings.saveToLocalStorage();
                    updateMobileControls();
                }}
        ]
    };


    MenuInfos[Menus.LEVEL_COMPLETE] = {
        caption: "Level Complete!",
        components: [
//            {type: "text", texts: ["", "More info..."], width: "10em"},
            {type: "button", text: "GO!", width: "10em", height: "2em",
                action: function() {
                    GameState.counter1 = 0;
                    GameState.subState = GameSubState.SHOWING_LEVEL_INTRO;
                    if (levelArr[GameState.levelIndex + 1]) {
                        changeLevel(GameState.levelIndex + 1);
                    }
                }}
        ]
    };

    MenuInfos[Menus.GAME_COMPLETE] = {
        caption: "Game Complete!",
        components: [
//            {type: "text", texts: ["", "More info..."], width: "10em"},
            {type: "button", text: "OKI!", width: "10em", height: "2em",
                action: function() {
                    GameState.counter1 = 0;
                    GameState.subState = GameSubState.SHOWING_GAME_MENU;
                    changeLevel(0);
                }}
        ]
    };
}


function getMenuSizeScaler(ctx) {

    var canvas = ctx.canvas;
    var w = canvas.width;
    var h = canvas.height;

    return clamp(Math.min(w, h) / 800, 0.3, 1.0);
}


function showMenu(id) {
    var menuId = id + '-menu';
    var arr = [
        '<div id="' + menuId + '" class="ui-widget-content ui-widget menu">'
    ];



    var menuInfo = MenuInfos[id];
    if (menuInfo) {

        var propertyInfoProvider = new PropertyInfoProvider();

        if (menuInfo.caption) {
            arr.push('<div style="text-align: center">');
            var caption = menuInfo.caption;
            if (isFunction(caption)) {
                caption = caption();
            }
            arr.push(caption);
            arr.push('</div>');
        }

        function getCompHtml(comp, idPrefix, arr) {
            var compId = idPrefix;
            comp.id = compId;
            switch (comp.type) {
                case "object":
                    arr.push('<div id="' + compId + '">');
                    var gpc = new GuiPropertiesComponent({object: comp.object, propertyInfoProvider: propertyInfoProvider});
                    gpc.createJQueryStrings(arr);
                    comp.gpc = gpc;
                    arr.push('</div>');
                    break;
                case "tabs":
                    break;
                case "accordion":
                    arr.push('<div id="' + compId + '">');

                    var accArr = []
                    for (var i=0; i<comp.parts.length; i++) {
                        var part = comp.parts[i];
                        accArr.push('<h3>' + part.caption + '</h3>');
                        accArr.push('<div>');
                        for (var j=0; j<part.components.length; j++) {
                            getCompHtml(part.components[j], idPrefix + "-" + j, accArr);
                        }
                        accArr.push('</div>');
                    }
                    addAll(arr, accArr);
                    arr.push('</div>');

                    break;
                case "button":
                    arr.push('<p style="text-align: center; margin: 0; padding: 0; border: 0;">');
                    arr.push('<button id="' + compId + '" >' + comp.text + '</button>');
                    arr.push('</p>');
                    break;
                case "text":
                case "dynamictext":
                    var texts = comp.texts;
                    if (comp.type == "dynamictext") {
                        texts = comp.texts();
                    }
                    arr.push('<div id="' + compId + '">');
                    for (var j=0; j<texts.length; j++) {
                        var text = texts[j];
                        arr.push('<div>' + text + '</div>');
                    }
                    arr.push('</div>');
                    break;
            }
        }

        for (var i=0; i<menuInfo.components.length; i++) {
            var comp = menuInfo.components[i];
            getCompHtml(comp, id + '-comp-' + i, arr);
        }
    }
    arr.push('</div>');

    var str = arr.join("");

    var $componentsDiv = $("#componentsDiv");
    $componentsDiv.append(str);

    var w = window.innerWidth;
    var h = window.innerHeight;

    $componentsDiv.css("width", w);
    $componentsDiv.css("height", h);

    var scaler = getMenuSizeScaler(GameState.overCanvasContext);

    var $menu = $componentsDiv.find("#" + menuId);
    var menuFontSize = Math.ceil(35 * scaler);
    $menu.css("font-size", menuFontSize + "px");
    $menu.css("padding", "1em");
    $menu.css("border", "1em");
    $menu.css("position", "absolute");
    $menu.css("position", "absolute");
    if (menuInfo) {
        if (menuInfo.width) {
            $menu.css("width", menuInfo.width);
        }
    }



    function setupCompProps(comp) {
        var $comp = $componentsDiv.find("#" + comp.id);
        $comp.css("margin-top", "1em");
        if (comp.fontSize) {
            $comp.css("font-size", comp.fontSize);
        }
        switch (comp.type) {
            case "object":
                comp.gpc.jQueryCreated($comp);
                comp.gpc.alignComponents();
                if (comp.changeListeners) {
                    addAll(comp.gpc.changeListeners, comp.changeListeners);
                }
                break;
            case "tabs":
                $comp.tabs();
                break;
            case "accordion":
                for (var i=0; i<comp.parts.length; i++) {
                    var part = comp.parts[i];
                    for (var j=0; j<part.components.length; j++) {
                        setupCompProps(part.components[j]);
                    }
                }
                $comp.accordion();
                break;
            case "text":
            case "dynamictext":
                $comp.css("width", comp.width);
                break;
            case "button":
                $comp.button();
                $comp.click(comp.action);
                $comp.css("height", comp.height);
                $comp.css("width", comp.width);
                break;
        }
    }


    if (menuInfo) {
        for (var i=0; i<menuInfo.components.length; i++) {
            var comp = menuInfo.components[i];
            setupCompProps(comp);
        }
    }


    $menu.position({
        of: $componentsDiv,
        my: "center middle",
        at: "center middle"
    });


}

function hideMenus() {
    $("#componentsDiv").empty();
}


function stepMenu(force) {

    if (GameState.subStateChanged || force) {
        hideMenus();
        switch (GameState.subState) {
            case GameSubState.COMPLETING:
            case GameSubState.COMPLETING_GAME:
            case GameSubState.DYING:
            case GameSubState.PLAYING:
                break;
            case GameSubState.PAUSED:
                showMenu(Menus.PAUSE_MENU);
                break;
            case GameSubState.SHOWING_GAME_MENU:
                showMenu(Menus.GAME_MENU);
                break;
            case GameSubState.SHOWING_SETTINGS_MENU:
                showMenu(Menus.SETTINGS_MENU);
                break;
            case GameSubState.SHOWING_GRAPHICS_SETTINGS_MENU:
                showMenu(Menus.GRAPHICS_SETTINGS_MENU);
                break;
            case GameSubState.SHOWING_SOUND_SETTINGS_MENU:
                showMenu(Menus.SOUND_SETTINGS_MENU);
                break;
            case GameSubState.SHOWING_GAME_SETTINGS_MENU:
                showMenu(Menus.GAME_SETTINGS_MENU);
                break;
            case GameSubState.SHOWING_LEVEL_INTRO:
                showMenu(Menus.LEVEL_INTRO);
                break;
            case GameSubState.SHOWING_LEVEL_COMPLETE:
                showMenu(Menus.LEVEL_COMPLETE);
                break;
            case GameSubState.SHOWING_GAME_COMPLETE:
                showMenu(Menus.GAME_COMPLETE);
                break;
        }
    }

}