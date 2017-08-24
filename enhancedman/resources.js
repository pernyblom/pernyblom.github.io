
var resources = {};

var resourceList = [
    {name: "level1", url: "level1.json", type: "level"},
    {name: "level2", url: "level2.json", type: "level"},
    {name: "level3", url: "level3.json", type: "level"}
//    {name: "mainsong", url: "song.mp3", type: "sound"}
//    {name: "test", url: "test.png", type: "image"}
];

var resourcesLoaded = 0;
var allResourcesLoaded = false;

function loadJsonResource(resourceInfo) {
    $.ajax({
        url: resourceInfo.url,
        dataType: 'json',
        async: true
    }).done(function(data) {
            resources[resourceInfo.name] = data;
            resourcesLoaded++;
        });
}


function loadLevel(resourceInfo) {
    loadJsonResource(resourceInfo);
}

function loadResources() {



    for (var i=0; i<resourceList.length; i++) {
        var resourceInfo = resourceList[i];
        switch (resourceInfo.type) {
            case "level":
                loadLevel(resourceInfo)
                break;
        }
    }
}

function stepResources() {
    if (resourcesLoaded == resourceList.length) {
        allResourcesLoaded = true;
    }
}
