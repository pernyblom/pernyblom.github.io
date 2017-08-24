
var allResourcesLoaded = false;

var totalResourceCount = 0;
var resourcesLoaded = 0;

var sounds = {
//    menu: {url: "menu.mp3"},
    playSong1: {url: "playSong1.mp3"},
    fail: {url: "failure.mp3"},
    success: {url: "success.mp3"},
    menu: {url: "menu.mp3"},
    hitBuilding: {url: "hitbuilding.mp3"},
    hitEnemy: {url: "hitenemy.mp3"},
    explosion: {url: "explosion.mp3"},
    cannon: {url: "shot.mp3"},
    bomb: {url: "dropbomb.mp3"},
    extraPoints: {url: "extrapoints.mp3"},
    shipFaster: {url: "shipfaster.mp3"},
    shipHealth: {url: "shiphealth.mp3"},
    shipMaxHealth: {url: "shipmaxhealth.mp3"},
    cannonFaster: {url: "cannonfaster.mp3"},
    cannonDamageUp: {url: "cannondamageup.mp3"},
    cannonNew: {url: "cannonnew.mp3"},
    bombFaster: {url: "bombfaster.mp3"},
    bombDamageUp: {url: "bombdamageup.mp3"},
    bombNew: {url: "bombnew.mp3"}
};
var images = {
    test: {url: "test.png"}
};
var levels = [
    {url: "level1.json"},
    {url: "level2.json"},
    {url: "level3.json"}
]

var levelArr = [];

var fonts = {
    font: {url: "font"}
};

var objectTemplates = {
    wagon: {url: "wagon.xml"}
};

function resourceLoaded() {
    resourcesLoaded++;
    if (resourcesLoaded == totalResourceCount) {
        allResourcesLoaded = true;
        logit("All resources loaded!");
    } else {
//        logit("Not All resources loaded yet " + resourcesLoaded + " of " + totalResourceCount);
    }
}

function loadSoundResource(info, prefix) {
    try {
        var theSound = soundManager.createSound({
            id: info.url,
            url: prefix + info.url,
            autoLoad: true,
            volume: 100,
            onload: function() {
//                info.sound = theSound;
            }
        });
        info.sound = theSound;
    } catch (ex) {
        // Create dummy sound :)
        console.log("Failed to create sound " + info.url);
        info.sound = {
            play: function() {},
            stop: function() {},
            playState: 0
        };
    }
}

function loadTextResourceWithAjax(url, successCallback, failureCallback) {
    $.ajax(url, {
        complete: function(jqXhr, textStatus) {
            if (textStatus == "success") {
                if (successCallback) {
                    resourceLoaded();
                    successCallback(jqXhr);
                }
            } else {
                if (failureCallback) {
                    failureCallback(jqXhr, textStatus);
                }
            }
        },
        type: 'GET'
    });
}


function loadResources() {
//    $.each(sounds, function(prop, value) {
////        totalResourceCount++;
//        totalSoundCount++;
//    });
    $.each(levels, function(prop, value) {
        totalResourceCount++;
    });

    // Setup the sound manager before loading anything
    soundManager.setup({
        url: 'swf/',
        debugMode: false,
        debugFlash: false,
        onready: function() {
            logit("Soundmanager is ready!!!");
            $.each(sounds, function(prop, value) {
//                logit("Loading sound " + prop + " " + value);
                loadSoundResource(value, "sounds/");
            });
        }
    });


    $.each(levels, function(prop, value) {
//        logit("Loading level " + prop + " " + value.url);

        loadTextResourceWithAjax("levels/" + value.url,
            function(jqXhr) {
//                var xml = $.parseXML(jqXhr.responseText);
//                var $xml = $(xml);

//                console.log(xml);

//                var levelJson = xml2json(xml);
//                logit(levelJson);

                var level = JSON.parse(jqXhr.responseText);
                logit("loading level " + prop);
                levelArr[prop] = level;
            },
            function() {
                console.log("Could not load level: " + JSON.stringify(value));
            });
    });

}




