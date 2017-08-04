
var documentData = {
    "trails": [
        {
            "name": "Basic Tutorials",
            "documents": [
                "first",
                "sub-seeds",
                "parameters",
                "domains",
                "details"
            ]
        },
        {
            "name": "Advanced Tutorials",
            "documents": [
                "custom-song-structure",
                "custom-harmony",
                "coupled-songs",
                "custom-song-part-indices"
            ]
        },
        {
            "name": "In-depth Tutorials",
            "documents": [
                "render-and-play-songs"
            ]
        }
    ],
    "documents": {
        "first": {
            "name": "Introduction",
            "page": "introduction"
        },
        "sub-seeds": {
            "name": "Sub Seeds",
            "page": "sub_seeds"
        },
        "parameters": {
            "name": "Parameters",
            "page": "parameters"
        },
        "domains": {
            "name": "Domains",
            "page": "domains"
        },
        "details": {
            "name": "Details",
            "page": "details"
        },
        "custom-song-structure": {
            "name": "Custom Song Structure",
            "page": "custom_song_structure"
        },
        "custom-harmony": {
            "name": "Custom Harmony",
            "page": "custom_harmony"
        },
        "coupled-songs": {
            "name": "Connected Songs",
            "page": "connected_songs"
        },
        "custom-song-part-indices": {
            "name": "Custom Song Part Indices"
//            "page": "coupled_songs"
        },
        "render-and-play-songs": {
            "name": "Render and Play Songs",
            "page": "render_and_play_songs"
        }
    }
};

function getTrailInfo(docId) {
    var trails = documentData.trails;
    for (var i = 0; i<trails.length; i++) {
        var trail = trails[i];
        var index = trail.documents.indexOf(docId);
        if (index >= 0) {
            return {index: index, trail: trail};
        }
    }
    return null;
}

function generate(docData) {
}

function createLargeToc() {
    var $largeTocDiv = $(".large-toc-div");
    if ($largeTocDiv.size() > 0) {
        var tocHtmlArr = [];

        var trails = documentData.trails;
        for (var i = 0; i<trails.length; i++) {
            var trail = trails[i];
            tocHtmlArr.push('<h2>' + trail.name + '</h2>');
            for (var j=0; j<trail.documents.length; j++) {
                var docId = trail.documents[j];
                var doc = documentData.documents[docId];
                if (doc) {
                    var page = doc.page;
                    tocHtmlArr.push('<p>' +
                        (page ? '<a href="' + page + '.html">' : "") +
                        doc.name +
                        (page ? '</a>' : "") +
                        '</p>');
                } else {
                    console.log("Could not find document " + docId);
                }
            }
        }

        $largeTocDiv.append($(tocHtmlArr.join("")));
    }
}

function createTrailToc($trailTocDiv) {
    var $trailTocDiv = $(".trail-toc-div");
    if ($trailTocDiv.size() > 0) {
        var tocHtmlArr = ['<p>testing index</p>'];

        documentData.trails;

        $trailTocDiv.append($(tocHtmlArr.join("")));
    }
}


function createHeader() {
}

function createFooter() {
}


$( document ).ready( function() {

    var $mainDiv = $(".main-div");
    var mainId = $mainDiv.attr("id");

    createLargeToc();
    createTrailToc();
    createHeader();
    createFooter();

    if (mainId == "index") {
        console.log("Found index");
    } else if (mainId) {

        var docData = documentData.documents[mainId];
        if (docData) {
            var trailInfo = getTrailInfo(mainId);
            if (trailInfo) {
                console.log(trailInfo);
            } else {
                console.log("Could not find trail for document " + mainId);
            }
        } else {
            console.log("Could not find doc data for id " + mainId);
        }
    } else {
        console.log("Could not find the id for this document");
    }
});