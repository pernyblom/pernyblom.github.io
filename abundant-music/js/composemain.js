

var lightServerMode = true;

window.URL = window.URL || window.webkitURL || window.mozURL || window.oURL || window.msURL;

var loaderTimeout = 10;

var allLoaded = false;

var usingWebGL = false;

var AudioPlayerConstructor = null;

if (Modernizr.webaudio) {
    AudioPlayerConstructor = WebAudioPlayer;
}

var canPlayMp3 = true;


var loggedIn = false;
var user = null;
var userInfo = null;

var globalRnd = new MersenneTwister();
var globalGenInfo = new GenInfo();

var settingsDirty = false;

var songSettingsChangedWhileRendering = false;

var audioPlayer = null;

var uidManager = new UniqueIdManager();


var songSettingsCompInfo = null;

var songSettingsDirty = false;

var asyncOperations = [];
var asyncOperationCounter = 0;


var propertyInfoProvider = new PropertyInfoProvider();


var visualizer = null;

var $playButton = null;
var $stopButton = null;
var $forwardButton = null;
var $rewindButton = null;

var $refreshButton = null;

function getMainSeed() {
    var seed = 213124;

    if (songSettings.seed) {
        var tempSeed = parseInt(songSettings.seed);

        if (isNaN(tempSeed)) {
            seed = hashCode(songSettings.seed);
        } else {
            seed = tempSeed;
        }
    }
    return seed;
}



function getSeedStringsObject(reference, genInfo) {
    var result = {};
    for (var prop in reference) {
        if (prop.indexOf("Seed") >= 0) {
            var seed = genInfo[prop];
            if (typeof(seed) != 'undefined') {
                result[prop] = "" + seed;
            } else {
                result[prop] = "";
            }
        }
    }
    return result;
}

function getSeeds(result, settings) {
    for (var prop in settings) {
        if (prop.indexOf("Seed") >= 0) {
            var seedStr = settings[prop];
            if (seedStr) {
                var seed = parseInt(seedStr);

                if (isNaN(seed)) {
                    seed = hashCode(seedStr);
                }
                if (!isNaN(seed)) {
                    result[prop] = seed;
                }
            }
        }
    }
}

function copyWithPropertyInfoProvider(result, settings, source) {
    if (!result) {
        result = {};
    }
    if (!source) {
        source = settings;
    }
    var infos = propertyInfoProvider.getGuiPropertyInfos(settings).getAsArray();
    for (var i=0; i<infos.length; i++) {
        var info = infos[i];
        var value = source[info.propertyName];
        if (!isFunction(value)) {
            result[info.propertyName] = value;
        }
    }
    return result;
}


function getGenInfo() {
    var result = {};

    getSeeds(result, songStructureSeedSettings);
    getSeeds(result, songContentSeedSettings);
    getSeeds(result, songIndicesSeedSettings);

    copyWithPropertyInfoProvider(result, songParameters);
    copyWithPropertyInfoProvider(result, songDomains);
    copyWithPropertyInfoProvider(result, songDetails);

    return result;
}



function showModalDialog(title, content, options) {
    var $dialog = $("<div title=\"" + title + "\" >" + content + "</div>");

    $("#dialogsdiv").append($dialog);

    if (!options) {
        options = {
            modal: true,
            buttons: {
                "Ok": function() {
                    $( this ).dialog( "close" );
                }
            }
        }
    }
    $dialog.dialog(options);

    return $dialog;
}

function showConfirmDialog(title, content, yesCaption, noCaption, yesCallback, noCallback) {

    var buttons = {};
    buttons[yesCaption] = function() {
        $(this).dialog("close");
        if (yesCallback) {
            yesCallback();
        }
    };
    buttons[noCaption] = function() {
        $(this).dialog("close");
        if (noCallback) {
            noCallback();
        }
    };

    var options = {
        modal: true,
        buttons: buttons
    };
    return showModalDialog(title, content, options);
}


function setSongSettingsDirty(val) {
    songSettingsDirty = val;

    if ($refreshButton) {
        $refreshButton.button("option", "disabled", !val);
    }
}

var $latestAudioElement = null;
var exportTimeout = null;
var tempTempoEvents = null;

function afterExport(op) {
    stopSong();
    updateRenderStorageAndVisualizer(op);

    if (op.$audioElement) {
        $latestAudioElement = op.$audioElement;

        function updateExportPlayer() {
            if ($latestAudioElement && $latestAudioElement[0]) {
                var time = $latestAudioElement[0].currentTime;
                if (time) {
                    var beat = predictBeat(tempTempoEvents, time);
//                    logit("predicted beat " + beat + " from " + time);
                    visualizer.setCurrentPlayBeatTime(beat);
                }
                exportTimeout = setTimeout(updateExportPlayer, 100);
            }
        }

        $latestAudioElement.on("play", function() {
            visualizer.setMode(VisualizerMode.PLAY);
            visualizer.setCurrentPlayBeatTime(0);
            updateExportPlayer();
        });
        $latestAudioElement.on("pause", function() {
            visualizer.setMode(VisualizerMode.PAUSE);
        });
        $latestAudioElement.on("stop", function() {
            visualizer.setMode(VisualizerMode.STOP);
            visualizer.setCurrentPlayBeatTime(0);
        });
    } else {
        $latestAudioElement = null;
    }
}

function joinNotEmpty(arr, str) {
    var newArr = [];
    for (var i=0; i<arr.length; i++) {
        if (arr[i]) {
            newArr.push(arr[i]);
        }
    }
    return newArr.join(str);
}

var exportSupportArr = [
    (window.ArrayBuffer ? "" : "Array Buffer"),
    (window.DataView ? "" : "Data View"),
    (window.URL ? "" : "URL object"),
    (Modernizr.webworkers ? "" : "Web Workers"),
    (Modernizr.blobconstructor ? "" : "Blob Constructor")
];

function exportMidi() {

    var clientExportSupport = Modernizr.webworkers && Modernizr.blobconstructor && window.URL && window.ArrayBuffer && window.DataView;

    if (lightServerMode && !clientExportSupport) {
        showModalDialog("Midi Export Not Supported by this browser",
            "The browser need support for " + joinNotEmpty(exportSupportArr, ", "));
    } else {
        var seed = getMainSeed();
        var genInfo = getGenInfo();
        copyWithPropertyInfoProvider(genInfo, midiExportSettings);

        delete genInfo.export2;

        var renderRequestData = {seed: seed, strSeed: songSettings.seed, name: songSettings.name, sectionIndex: -1, genInfo: genInfo};

        var params = {
            taskType: AsyncServerChildTaskType.EXPORT_MIDI,
            content: renderRequestData,
            caption: "Exporting midi...",
            doneCaption: "Done!",
            resultDivId: "midi-export-result-div",
            onSuccess: function(op) {
                afterExport(op);
            },
            id: "task" + asyncOperationCounter};

        var task = null;
        if (clientExportSupport) {
            params.taskType = WorkerTaskType.EXPORT_MIDI;
            task = new AsyncWorkerTask(params);
        } else {
            task = new AsyncServerChildTask(params);
        }
        addAsyncOperation(task);
    }

}


function exportWav() {

    var clientExportSupport = Modernizr.webworkers && Modernizr.blobconstructor && window.URL && window.ArrayBuffer && window.DataView;

    if (lightServerMode && !clientExportSupport) {
        showModalDialog("Wav Export Not Supported by this browser",
            "The browser need support for " + joinNotEmpty(exportSupportArr, ", "));
    } else {
        var seed = getMainSeed();
        var genInfo = getGenInfo();

        if (clientExportSupport) {
            copyWithPropertyInfoProvider(genInfo, wavClientExportSettings);
        } else {
            copyWithPropertyInfoProvider(genInfo, wavExportSettings);
        }

        delete genInfo.export2;

        var renderRequestData = {seed: seed, strSeed: songSettings.seed, name: songSettings.name, sectionIndex: -1, genInfo: genInfo};

        var params = {
            taskType: AsyncServerChildTaskType.EXPORT_WAV,
            content: renderRequestData,
            caption: "Exporting wav...",
            doneCaption: "Done!",
            resultDivId: "wav-export-result-div",
            onSuccess: function(op) {
                afterExport(op);
            },
            id: "task" + asyncOperationCounter};

        var task = null;
        if (clientExportSupport) {
            params.taskType = WorkerTaskType.EXPORT_WAV;
            task = new AsyncWorkerTask(params);
        } else {
            task = new AsyncServerChildTask(params);
        }
        addAsyncOperation(task);
    }

}


function exportIT() {
    showModalDialog("", "IT export not implemented.");
}

function savePreset() {
    var seed = getMainSeed();
    var genInfo = getGenInfo();
    copyWithPropertyInfoProvider(genInfo, mp3ExportSettings);

    var renderRequestData = {seed: seed, sectionIndex: -1, genInfo: genInfo};

    var task = new AsyncServerChildTask({
        taskType: AsyncServerChildTaskType.SAVE_PRESET,
        content: renderRequestData,
        caption: "Saving preset...",
        doneCaption: "Done!",
        requireLogin: false,
        resultDivId: "",
        id: "task" + asyncOperationCounter});
    addAsyncOperation(task);
}

function exportMp3() {

    if (lightServerMode) {
        showModalDialog("Mp3 Export Not Supported",
            "The server doesn't support this operation and you can not do this in the browser yet.");
    } else {
        var seed = getMainSeed();
        var genInfo = getGenInfo();
        copyWithPropertyInfoProvider(genInfo, mp3ExportSettings);

        var renderRequestData = {seed: seed, sectionIndex: -1, genInfo: genInfo};
        var curOperation = false; // getFirstRunningServerTaskWithType(AsyncServerChildTaskType.EXPORT_MP3);

        var task = new AsyncServerChildTask({
            taskType: AsyncServerChildTaskType.EXPORT_MP3,
            content: renderRequestData,
            caption: "Exporting mp3...",
            doneCaption: "Done!",
            resultDivId: "mp3-export-result-div",
            onSuccess: function(op) {
                afterExport(op);
            },
            id: "task" + asyncOperationCounter});
        addAsyncOperation(task);
    }
}

function exportOgg() {
    if (lightServerMode) {
        showModalDialog("Mp3 Export Not Supported",
            "The server doesn't support this operation and you can not do this in the browser yet.");
    } else {
        var seed = getMainSeed();
        var genInfo = getGenInfo();
        copyWithPropertyInfoProvider(genInfo, oggExportSettings);

        var renderRequestData = {seed: seed, sectionIndex: -1, genInfo: genInfo};
        var curOperation = getFirstRunningServerTaskWithType(AsyncServerChildTaskType.EXPORT_OGG);

        var task = new AsyncServerChildTask({
            taskType: AsyncServerChildTaskType.EXPORT_OGG,
            content: renderRequestData,
            caption: "Exporting ogg...",
            doneCaption: "Done!",
            resultDivId: "ogg-export-result-div",
            onSuccess: function(op) {
                afterExport(op);
            },
            id: "task" + asyncOperationCounter});
        addAsyncOperation(task);
    }
}


function updateAsyncOperations() {
    var nextOps = [];
    for (var i=0; i<asyncOperations.length; i++) {
        var op = asyncOperations[i];
        op.update();
        if (!op.done && !op.cancelled) {
            nextOps.push(op);
        }
    }
    asyncOperations = nextOps;
    if (asyncOperations.length > 0) {
        setTimeout(updateAsyncOperations, 500);
    }
}

function addAsyncOperation(op) {
    if (!op) {
        return false;
    }
    if (loggedIn || !op.requireLogin) {
        asyncOperations.push(op);
        op.start();
        updateAsyncOperations();
        asyncOperationCounter++;
        return true;
    } else {
        showModalDialog("Not logged in", "You must log in to export or compose new songs.");
        return false;
    }
}


function logit(str) {
//    console.log(printStackTrace());
    console.log(str);
}

function getFirstRunningServerTaskWithType(type) {
    for (var i=0; i<asyncOperations.length; i++) {
        var op = asyncOperations[i];
        if (op.taskType == type) {
            return op;
        }
    }
    return null;
}


function createExportPanel() {
    var tabCaptions = ["Midi", "Mp3", "Ogg", "IT"];
    var tabObjects = [midiExportSettings, mp3ExportSettings, oggExportSettings, itExportSettings];
    var tabObjectPresets = [midiExportSettingsPresets, mp3ExportSettingsPresets, oggExportSettingsPresets, itExportSettingsPresets];

    if (lightServerMode) {
        tabCaptions.length = 1;
        tabObjects.length = 1;
        tabObjectPresets.length = 1;
//        tabCaptions.push("Wav (Alpha)");
//        tabObjects.push(wavClientExportSettings);
//        tabObjectPresets.push(wavClientExportSettingsPresets);
    }
    SongSettingsComponent.createTabs($("#exportDialogDiv"), "exportTab", "export-panel", tabCaptions, tabObjects,
        function() {
            settingsDirty = true;
        }, tabObjectPresets);

    if (lightServerMode) {
        $("#exportTab0").prepend($("<div id=\"midi-export-result-div\" ></div>"));
//        $("#exportTab1").prepend($("<div id=\"wav-export-result-div\" ></div>"));
    } else {
        $("#exportTab0").prepend($("<div id=\"midi-export-result-div\" ></div>"));
        $("#exportTab1").prepend($("<div id=\"mp3-export-result-div\" ></div>"));
        $("#exportTab2").prepend($("<div id=\"ogg-export-result-div\" ></div>"));
        $("#exportTab3").prepend($("<div id=\"it-export-result-div\" ></div>"));
    }

}


function createSongInfoPanel() {
    var $songInfoDiv = $("#songInfoTabs");
    $songInfoDiv.tabs();
}

function getSongPartName(i, songStructureInfo) {

    var text = "Part";

    var indexInfo = songStructureInfo.indexInfos[i];

    var songPartType = songStructureInfo.songPartTypes[i];
    if (indexInfo.isIntro) {
        text = "Intro";
    } else if (indexInfo.isEnd) {
        text = "End";
    } else if (indexInfo.isConnectGroup) {
        text = "Connect";
        if (indexInfo.isPostfixGroup) {
            text = "Postfix";
        } else if (indexInfo.isPrefixGroup) {
            text = "Prefix";
        }
    } else {
        switch (songPartType) {
            case 0:
            case 1:
                text = "Verse " + (songPartType + 1);
                break;
            case 2:
            case 3:
                text = "Chorus " + (songPartType - 1);
                break;
            case 4:
            case 5:
                text = "Bridge " + (songPartType - 3);
                break;
            case 6:
            case 7:
                text = "Misc " + (songPartType - 5);
                break;
        }
        if (indexInfo.phraseGroupCount > 1) {
            text += ", " + (indexInfo.phraseGroupIndex + 1);
        }
    }

    return text;
}

function updateSongInfoPanel() {
    var $structureDiv = $("#songInfoTabStructure");
    var $instrumentsDiv = $("#songInfoTabInstruments");

    $instrumentsDiv.empty();
    $structureDiv.empty();


    var songStructureInfo = renderStorage.songStructureInfo;

    var rowClasses = ['evenTableRow', 'oddTableRow'];

    if (songStructureInfo) {
        var indexInfos = songStructureInfo.indexInfos;
        var htmlArr = [];
        htmlArr.push('<table class="songInfoInstrumentsTable">');
        var rowIndex = 0;

        function getPropertyTableRow(header, arr) {
            var rowClass = rowClasses[rowIndex % rowClasses.length];
            htmlArr.push('<tr class="' + rowClass + '">');
            htmlArr.push('<td>' + header + '</td>')
            for (var i=0; i<arr.length; i++) {
                var text = '' + arr[i];
                htmlArr.push('<td>' + text + '</td>');
            }
            rowIndex++;
        }

        if (indexInfos) {
//            logit(songStructureInfo);
            var rowClass = rowClasses[rowIndex % rowClasses.length];
            htmlArr.push('<tr class="' + rowClass + '">');
            htmlArr.push('<td>Type</td>')
            for (var i=0; i<indexInfos.length; i++) {
                var text = getSongPartName(i, songStructureInfo);
                htmlArr.push('<td>' + text + '</td>');
            }
            htmlArr.push('</tr>');
            rowIndex++;
            getPropertyTableRow("Harmony Rythm", songStructureInfo.harmonyRythmIndices);
            getPropertyTableRow("Harmony Char.", songStructureInfo.harmonyExtraIndices);
            getPropertyTableRow("Melody Shape", songStructureInfo.melodyShapeIndices);
            getPropertyTableRow("Bass Shape", songStructureInfo.bassShapeIndices);
            getPropertyTableRow("Melody Motif Dist.", songStructureInfo.melodyMotifDistributionIndices);
            getPropertyTableRow("Bass Motif Dist.", songStructureInfo.bassMotifDistributionIndices);
            getPropertyTableRow("Inner 1 Motif Dist.", songStructureInfo.inner1MotifDistributionIndices);
            getPropertyTableRow("Inner 2 Motif Dist.", songStructureInfo.inner2MotifDistributionIndices);
            getPropertyTableRow("Percussion Dist.", songStructureInfo.percussionMotifDistributionIndices);
            getPropertyTableRow("Percussion Fill Dist.", songStructureInfo.percussionFillMotifDistributionIndices);
            getPropertyTableRow("Melody Instr.", songStructureInfo.melodyChannelDistributionIndices);
            getPropertyTableRow("Bass Instr.", songStructureInfo.bassChannelDistributionIndices);
            getPropertyTableRow("Inner 1 Instr.", songStructureInfo.inner1ChannelDistributionIndices);
            getPropertyTableRow("Inner 2 Instr.", songStructureInfo.inner2ChannelDistributionIndices);
            getPropertyTableRow("Melody Effects", songStructureInfo.sequentialMelodyEffectChangeIndices);
            getPropertyTableRow("Bass Effects", songStructureInfo.sequentialBassEffectChangeIndices);
            getPropertyTableRow("Inner 1 Effects", songStructureInfo.sequentialInner1EffectChangeIndices);
            getPropertyTableRow("Inner 2 Effects", songStructureInfo.sequentialInner2EffectChangeIndices);
            getPropertyTableRow("Percussion Effects", songStructureInfo.sequentialPercussionEffectChangeIndices);
        }
        htmlArr.push('</table>');

        $structureDiv.append(htmlArr.join(""));
    }

    var channelMaps = renderStorage.channelMaps;
    if (channelMaps) {
        var htmlArr = [];
        htmlArr.push('<table class="songInfoInstrumentsTable">');
        for (var i=0; i<channelMaps.length-1; i++) {
            var rowClass = rowClasses[i % rowClasses.length];
            htmlArr.push('<tr class="' + rowClass + '">');
            var chMap = channelMaps[i];
            var str = MidiProgram.toString(chMap.program);
            var instrStr = "Unknown";
            switch (i) {
                case 0:
                case 1:
                case 2:
                    instrStr = "Melody instrument " + (i + 1);
                    break;
                case 3:
                case 4:
                case 5:
                    instrStr = "Inner 1 instrument " + (i + 2);
                    break;
                case 6:
                case 7:
                case 8:
                    instrStr = "Inner 2 instrument " + (i - 5);
                    break;
                case 9:
                case 10:
                case 11:
                    instrStr = "Bass instrument " + (i - 8);
                    break;
            }
            htmlArr.push('<td>' + instrStr + '</td>');
            htmlArr.push('<td>' + str + '</td>');
//            htmlArr.push(str + '<br />');
            htmlArr.push("</tr>");
        }
        htmlArr.push('</table>');
        $instrumentsDiv.append(htmlArr.join(""));
    }
}


function deleteSong(songIndex, callback) {

    showConfirmDialog("Really delete?", "Do you really want to delete the song?", "Yes", "No",
        function() {
            var deleteRequestData = {songIndex: songIndex};
            var task = new AsyncServerChildTask({
                taskType: AsyncServerChildTaskType.DELETE_SONG,
                content: deleteRequestData,
                caption: "Deleting song...",
                doneCaption: "Done!",
                resultDivId: "",
                onDone: function(op) {
                    callback();
                },
                id: "task" + asyncOperationCounter});
            addAsyncOperation(task);
        },
        function() {
        });
}

function renameSong(songIndex, newName, callback) {
    var deleteRequestData = {newName: newName, songIndex: songIndex};
    var task = new AsyncServerChildTask({
        taskType: AsyncServerChildTaskType.RENAME_SONG,
        content: deleteRequestData,
        caption: "Renaming song...",
        doneCaption: "Done!",
        resultDivId: "",
        onDone: function(op) {
            callback();
        },
        id: "task" + asyncOperationCounter});
    addAsyncOperation(task);
}

function overwriteSong(prefix, songInfo) {
    var seed = getMainSeed();
    var name = songSettings.name;
    var genInfo = getGenInfo();
    copyWithPropertyInfoProvider(genInfo, mp3ExportSettings);

    var owRequestData = {seed: seed, songName: name, prefix: songInfo.prefix, genInfo: genInfo};

    var task = new AsyncServerChildTask({
        taskType: AsyncServerChildTaskType.OVERWRITE_SONG,
        content: owRequestData,
        caption: "Overwriting song...",
        doneCaption: "Done!",
        resultDivId: "",
        onDone: function() {
            loadMySongsList();
        },
        id: "task" + asyncOperationCounter});
    if (!addAsyncOperation(task)) {
        logit("Failed to add async op for overwrite song?");
    }

}

function completeGenInfo(genInfo) {
    var refGenInfo = new GenInfo();
    for (var prop in refGenInfo) {
        if (!stringEndsWith(prop, "Seed")) {
            var refValue = refGenInfo[prop];
            var value = genInfo[prop];
            if (!isFunction(refValue) && typeof(value) === 'undefined') {
                genInfo[prop] = copyValueDeep(refValue);
//                logit("Completing gen info " + prop + ": " + refValue);
            }
        }
    }
}


function updateSongSettingsComponent(genInfo, newSongSettings) {

    var tabsId = "songSettingsTab";

    completeGenInfo(genInfo);
    var newValues = [
        newSongSettings,
        getSeedStringsObject(songStructureSeedSettings, genInfo),
        getSeedStringsObject(songContentSeedSettings, genInfo),
        getSeedStringsObject(songIndicesSeedSettings, genInfo),
        copyWithPropertyInfoProvider(null, songParameters, genInfo),
        copyWithPropertyInfoProvider(null, songDomains, genInfo),
        copyWithPropertyInfoProvider(null, songDetails, genInfo)
    ];

    for (var i=0; i<newValues.length; i++) {
        SongSettingsComponent.changeComponentValue(newValues[i], songSettingsCompInfo.createdComps, i, tabsId, songSettingsCompInfo.changeListener);
    }

}

function loadSong(prefix, songInfo, force) {

    function loadTheSongNow() {

        var dataFilename = prefix + "/" + songInfo.prefix + ".json";

        $.ajax(dataFilename, {
            complete: function(jqXhr, textStatus) {
                if (textStatus == "success") {
                    var response = $.parseJSON(jqXhr.responseText);
                    if (response) {
//                            logit(response);
                        var genInfo = response.genInfo;
                        var newSongSettings = {name: songInfo.name || "Song", seed: "" + response.seed};
                        // Copy all those properties that are missing from the default GenInfo
                        // This happens when new properties are added and loading an old song

                        updateSongSettingsComponent(genInfo, newSongSettings);
                        if (response.channelMaps && response.renderData) {
                            // Presets
                            stopSong();
                            renderStorage.channelMaps = response.channelMaps;
                            renderStorage.renderData = response.renderData;
                            renderStorage.renderDataLength = Math.max(1, response.renderDataLength);
                            renderStorage.dirty = true;
                            settingsDirty = true;
                            visualizer.resetRenderData();
                            visualizer.addRenderData(renderStorage.renderData, renderStorage.renderDataLength);
                            setSongSettingsDirty(false);
                        } else {
                            settingsDirty = true;
                            setSongSettingsDirty(false);
                            if (loggedIn) {
                                renderSong(function() {
                                    stopSong();
                                });
                            }
                        }

                    }
                } else {
                    console.log("Failed to load song: " + dataFilename);
                }
            },
            type: 'GET'
        });
    }

    if (songSettingsDirty && loggedIn && !force) {
        showConfirmDialog("Load?", "Really load the song? This will overwrite the current song settings", "Yes", "No",
            function() {
                loadTheSongNow();
            },
            function() {
            });
    } else {
        loadTheSongNow();
    }
}

function loadPresetSong(songInfo, force) {
    loadSong("songpresets", songInfo, force);
}


function getUserInfo(onSuccess, onFail, onDone) {
    if (lightServerMode) {

    } else {
        $.ajax("task", {
            data: JSON.stringify({type: "getUserInfo"}),
            contentType: "application/json",
            complete: function(jqXhr, textStatus) {
                if (textStatus == "success") {
                    var response = $.parseJSON(jqXhr.responseText);
                    if (onSuccess) {
                        onSuccess(response);
                    }
                } else {
                    if (onFail) {
                        onFail(jqXhr, textStatus);
                    }
                }
                if (onDone) {
                    onDone(jqXhr, textStatus);
                }
            },
            type: "POST"
        });
    }
}

function loadMySongsList() {

    if (lightServerMode) {

    } else {
        $('#my-songs-song-list').remove();

        var urlPrefix = "users/" + userToDirName(user);
        var indexUrl = urlPrefix + "/index.json";

        var $mySongsDiv = $("#my-songs-tab");

        getUserInfo(
            function(response) {
                if (response && response.songs) { // onSuccess
                    createSongList(response, $mySongsDiv, urlPrefix, "my-songs", "Song", true, true, true);
                } else {
                    console.log("Did not get a valid UserInfo from server.");
                }
            },
            function(jqXhr, textStatus) { // onFail
                console.log("Did not get an answer for getUserInfo from server. Text status not success: " + textStatus);
            });
    }

}


function createLoadButton(buttonId, songInfo, $targetDiv, urlPrefix) {
    var $loadButton = $targetDiv.find("#" + buttonId);
    $loadButton.button();
    $loadButton.click(function() {
        loadSong(urlPrefix, songInfo);
    });
}
function createOverwriteButton(buttonId, songInfo, $targetDiv, urlPrefix) {
    var $owButton = $targetDiv.find("#" + buttonId);
    $owButton.button();
    $owButton.click(function() {
        overwriteSong(urlPrefix, songInfo);
    });
}
function createDeleteButton(buttonId, songInfos, songInfoIndex, $targetDiv, urlPrefix) {
    var $button = $targetDiv.find("#" + buttonId);
    $button.button();
    $button.click(function() {
        deleteSong(songInfoIndex, function() {
            loadMySongsList();
        });
    });
}
function createRenameButton(buttonId, songInfos, songInfoIndex, $targetDiv, urlPrefix) {
    var $button = $targetDiv.find("#" + buttonId);
    $button.button();
    $button.click(function() {
    });
}

function createSongList(info, $targetDiv, urlPrefix, idPrefix, namePrefix, createLoad, createDelete, createRename) {
    var songs = info.songs;
    var content = "";
    content += '<ol id="' + idPrefix + '-song-list" class="song-list" >';

    var linkStyle = "margin-right: 0.5em;";
    for (var i=0; i<songs.length; i++) {
        var songInfo = songs[i];

        var songName = songInfo.name;
        if (!songName) {
            songName = namePrefix + " " + (i + 1);
        }

        var tableContent = "<tr><td>" + songName + "</td>";

        var columns = 1;
        var columnCounter = 1;
        if (songInfo.soundfonts && songInfo.soundfonts.length > 0) {
            var defaultSfIndex = songInfo.soundfonts[0];
            var prefix = urlPrefix + "/" + songInfo.prefix;
            var midiFilename = prefix + ".mid";
            var mp3Filename = prefix + "_" + defaultSfIndex + ".mp3";
            var oggFilename = prefix + "_" + defaultSfIndex + ".ogg";

            tableContent += '<td><a style="' + linkStyle + '" href="' + midiFilename + '" >Midi</a>';
            tableContent += '<a style="' + linkStyle + '" href="' + mp3Filename + '" >Mp3</a>';
            tableContent += '<a style="' + linkStyle + '" href="' + oggFilename + '" >Ogg</a></td>';
            columnCounter += 1;
        }

        tableContent += "<td>";
        columnCounter += 1;
        if (createDelete) {
            var deleteButtonId = idPrefix + "-delete-song-button-" + i;
            tableContent += '<button id="' + deleteButtonId + '" >Delete</button>';
        }
//        if (createOverwrite) {
//            var owButtonId = idPrefix + "-overwrite-song-button-" + i;
//            liContent += '<button id="' + owButtonId + '" >Overwrite</button>';
//        }
        if (createRename) {
            var renameButtonId = idPrefix + "-rename-song-button-" + i;
            tableContent += '<button id="' + renameButtonId + '" >Rename</button>';
        }
        if (createLoad) {
            var loadButtonId = idPrefix + "-load-song-button-" + i;
            tableContent += '<button id="' + loadButtonId + '" >Load</button>';
        }
        tableContent += "</td>";

        tableContent += "</tr>";

        columns = columnCounter;
        columnCounter = 0;
//        if (songInfo.soundfonts && songInfo.soundfonts.length > 0) {
//            tableContent += "<tr>";
//            tableContent += "<td>Variants Mp3</td>";
//            columnCounter += 1;
//            tableContent += "<td>";
//            columnCounter += 1;
//            for (var j=1; j<songInfo.soundfonts.length; j++) {
//                var sfIndex = songInfo.soundfonts[j];
//                var sfName = SoundFontType.toShortString(sfIndex);
//                var mp3Filename = prefix + "_" + sfIndex + ".mp3";
//                tableContent += '<a style="' + linkStyle + '" href="' + mp3Filename + '" >' + sfName + '</a>';
//            }
//            tableContent += "</td>";
//            tableContent += "</tr>";
//
//            columns = Math.max(columns, columnCounter);
//            columnCounter = 0;
//
//            tableContent += "<tr>";
//            tableContent += "<td>Variants Ogg</td>";
//            columnCounter += 1;
//            tableContent += "<td>";
//            columnCounter += 1;
//            for (var j=1; j<songInfo.soundfonts.length; j++) {
//                var sfIndex = songInfo.soundfonts[j];
//                var sfName = SoundFontType.toShortString(sfIndex);
//                var oggFilename = prefix + "_" + sfIndex + ".ogg";
//                tableContent += '<a style="' + linkStyle + '" href="' + oggFilename + '" >' + sfName + '</a>';
//                columnCounter += 1;
//            }
//            tableContent += "</td>";
//            tableContent += "</tr>";
//            columns = Math.max(columns, columnCounter);
//        }

        content += '<table style="margin: 0px; padding: 0px; border: 0px; width: 100%" class="ui-widget-content" >';
        content += '<colgroup>';
        var colWidth = 100 / columns;
        for (var j=0; j<columns; j++) {
            content += '<col span="1" style="width: ' + Math.round(colWidth) + '%;">';
        }
        content += "</colgroup>";
        content += tableContent;
        content += "</table>";
    }
    content += "</ol>";
    var $list = $(content);
//        $list.selectable();

    $targetDiv.append($list);

    for (var i=0; i<songs.length; i++) {
        var songInfo = songs[i];
        if (createLoad) {
            var buttonId = idPrefix + "-load-song-button-" + i;
            createLoadButton(buttonId, songInfo, $targetDiv, urlPrefix);
        }
//        if (createOverwrite) {
//            var buttonId = idPrefix + "-overwrite-song-button-" + i;
//            createOverwriteButton(buttonId, songInfo, $targetDiv, urlPrefix);
//        }
        if (createDelete) {
            var buttonId = idPrefix + "-delete-song-button-" + i;
            createDeleteButton(buttonId, songs, i, $targetDiv, urlPrefix);
        }
        if (createRename) {
            var buttonId = idPrefix + "-rename-song-button-" + i;
            createRenameButton(buttonId, songs, i, $targetDiv, urlPrefix);
        }
    }
}


function createSongsPanel() {
    if (loggedIn && user) {
        $("#songtabs ul").append($('<li><a href="#my-songs-tab">My Songs</a></li>'));

        var mySongsContent = "";

        mySongsContent += '<button id="save-song-button">Save Current Song</button>';

        $("#songtabs").append($('<div id="my-songs-tab" >' + mySongsContent + '</div> '));;
    }



    $("#save-song-button").button().click(function() {
        var seed = getMainSeed();
        var name = songSettings.name;
        var genInfo = getGenInfo();
        copyWithPropertyInfoProvider(genInfo, mp3ExportSettings);

        var saveRequestData = {seed: seed, songName: name, genInfo: genInfo};

        var task = new AsyncServerChildTask({
            taskType: AsyncServerChildTaskType.SAVE_SONG,
            content: saveRequestData,
            caption: "Saving song...",
            doneCaption: "Done!",
            resultDivId: "",
            onDone: function() {
                loadMySongsList();
            },
            id: "task" + asyncOperationCounter});
        if (!addAsyncOperation(task)) {
            logit("Failed to add async op for saving song?");
        }

    });

    $("#songtabs").tabs();

    var $examplesDiv = $("#example-songs-tab");



    // Loading presets
    $.ajax("songpresets/index.json", {
//        contentType: "application/json",
        complete: function(jqXhr, textStatus) {
            if (textStatus == "success") {
                var response = $.parseJSON(jqXhr.responseText);
                if (response) {
                    createSongList(response, $examplesDiv, "songpresets", "preset", "Song Example", true, false, false);
                    var songs = response.songs;
                    if (!renderStorage.renderData && songs.length > 0) {
                        loadPresetSong(songs[0], true);
                    }
                }
//                logit(response);
            } else {
                console.log("Failed to get preset songs: " + textStatus);
            }
        },
        type: 'GET'
    });


    // Loading my songs
    if (loggedIn && user) {
        loadMySongsList();
    }

}

function UserInfo() {
    this.name = "";
    this.email = "";
    this.subscribe = false;
    this.acceptedTOU = false;
    this._constructorName = "UserInfo";
}

function sendSimpleCommand(data) {
    $.ajax("task", {
        data: JSON.stringify(data),
        contentType: "application/json",
        complete: function(jqXhr, textStatus) {
            if (textStatus == "success") {

            } else {
                logit("Failed to send simple command:");
                logit(data);
            }
        },
        type: "POST"
    });

}

function updateUserInfo(showDialog) {
//    logit("Updating user info...");
//    logit(userInfo);

    if ($updateUserInfoButton) {
        $updateUserInfoButton.button("disable");
    }

    sendSimpleCommand({type: "updateUserInfo", name: userInfo.name, email: userInfo.email, subscribe: userInfo.subscribe, acceptedTOU: userInfo.acceptedTOU});
    if (showDialog) {
        showModalDialog("User info updated", "<p>Your personal information will only be used for support, unless you subscribe to the newsletter.</p>");
    }
}

var $updateUserInfoButton = null;

function createAccountPanel() {

    if (lightServerMode) {

    } else {
        loggedIn = false;
        var userInfoComp = null;
        getUserInfo(
            function(response) { // onSuccess
                if (response._constructorName == "UserInfo") {
                    loggedIn = true;
                    userInfo = response;
//                logit(userInfo);
                    if (typeof(userInfo.name) == 'undefined') {
                        userInfo.name = "";
                    }
                    if (typeof(userInfo.email) == 'undefined') {
                        userInfo.email = "";
                    }
                    if (typeof(userInfo.subscribe) == 'undefined') {
                        userInfo.subscribe = false;
                    }
                    if (typeof(userInfo.acceptedTOU) == 'undefined') {
                        userInfo.acceptedTOU = false;
                    }
                    function showTOUWhenLoaded() {
                        if (allLoaded) {
                            showAcceptTermsOfUseIfNecessary();
                        } else {
                            setTimeout(showTOUWhenLoaded, 100);
                        }
                    }
                    showTOUWhenLoaded();
                } else {
                    console.log(response);
                }
            },
            function(jqXhr, textStatus) { // onFail
                console.log("Failed to get user info in account panel " + textStatus);
            },
            function() { // onDone
                var html = "<p></p>";
                if (loggedIn) {
                    html =
                        '<form action="logout" method="get" id="logout_form">' +
                            '<fieldset>' +
                            '<div id="logout_input_area">' +
                            '<input id="openid_submit" type="submit" value="Log Out"/>' +
                            '</div>' +
                            '</fieldset>' +
                            '</form>';
//                html += userInfo.name + " " + userInfo.email;

                    var userInfoComp = new GuiPropertiesComponent({object: userInfo, propertyInfoProvider: propertyInfoProvider});
                    userInfoComp.changeListeners.push(function() {
                        if ($updateUserInfoButton) {
                            $updateUserInfoButton.button("enable");
                        }
                    });

                    var contentArr = [];
                    userInfoComp.createJQueryStrings(contentArr);
                    html += contentArr.join("");

                    html += '<button id="updateUserInfoButton" >Submit personal info</button>';

                } else {
                    html =
                        '<form action="auth" method="get" id="openid_form">' +
                            '<input type="hidden" name="action" value="verify" />' +
                            '<fieldset>' +
                            '<legend>Sign-in or Create New Account</legend>' +
                            '<div id="openid_choice">' +
                            '<p>Please click your account provider:</p>' +
                            '<div id="openid_btns"></div>' +
                            '</div>' +
                            '<div id="openid_input_area">' +
                            '<input id="openid_identifier" name="openid_identifier" type="text" value="http://" />' +
                            '<input id="openid_submit" type="submit" value="Sign-In"/>' +
                            '</div>' +
                            '<noscript>' +
                            '<p>OpenID is service that allows you to log-on to many different websites using a single identity.' +
                            'Find out <a href="http://openid.net/what/">more about OpenID</a> and <a href="http://openid.net/get/">how to get an OpenID enabled account</a>.</p>' +
                            '</noscript>' +
                            '</fieldset>' +
                            '</form>';
                }

                html += '<p><button id="touButton" >Terms of use</button></p>';

                var $html = $(html);


                var $div = $("#accountDialogDiv");
                $div.append($html);

                $updateUserInfoButton = $("#updateUserInfoButton");
                $updateUserInfoButton.button().click(function() {
                    updateUserInfo(true);
                });
                $updateUserInfoButton.button("disable");

                $touButton = $("#touButton");
                $touButton.button().click(function() {
                    showTermsOfUse();
                });

                openid.init('openid_identifier');

                $div.find("#openid_submit").button();
                //    openid.setDemoMode(true);

                if (userInfoComp) {
                    userInfoComp.jQueryCreated($div);
                    userInfoComp.alignComponents();
                }

            }
        );

    }

}

function createTutorialsPanel() {

    var $tutorialTabs = $("#tutorialtabs");

    var arr = ['<ul>'];


    arr.push('<li><a href="tutorials/info.html">Info</a></li>');

    for (var i=1; i<=5; i++) {
        arr.push('<li><a href="tutorials/tutorial_' + i + '.html">Tutorial ' + i + '</a></li>');
    }
//    <li><a href="tutorials/tutorial_1.html">Tutorial 1</a></li>

    arr.push('</ul>');

    $tutorialTabs.append($(arr.join("")));

    $tutorialTabs.tabs();


}

function createPlayerPanel() {

    var $playerDialog = $("#playerDialogDiv");

    if (AudioPlayerConstructor) {
        var prefixes = ["wa"];

        var playerButtons = ["rewind", "play", "stop", "forward"];
        var playerButtonIcons = ["seek-prev", "play", "stop", "seek-next"];
        for (var j=0; j<prefixes.length; j++) {
            var prefix = prefixes[j];
            for (var i=0; i<playerButtons.length; i++) {
                var $button = $("#" + prefix + playerButtons[i] + "button");

                var icon = playerButtonIcons[i];
                $button.button({
                    "text": false,
                    "icons": {
                        primary: "ui-icon-" + icon
                    }
                });
            }
        }


        var $webAudioPlayerDiv = $("#waPlayerDiv");

        var tabCaptions = [AudioPlayerConstructor.prototype.title];
        var tabObjects = [webAudioPlayerSettings];

        var tabObjectPresets = null; // [visualizer3DSettingsPresets];

        var result = SongSettingsComponent.createTabs($playerDialog, "playerSettingsTab", "player-settings-panel", tabCaptions, tabObjects,
            function(comp, oldValue, newValue) {
                settingsDirty = true;
            }, tabObjectPresets);

        $webAudioPlayerDiv.detach();
        $("#playerSettingsTab0").prepend($webAudioPlayerDiv);

        return result;
    } else {
        $playerDialog.remove();
        return null;
    }
}


function createVisualizerSettingsPanel() {
    var tabCaptions = ["Visualizer", "Interface"];
    var tabObjects = [visualizer3DSettings, themeSettings];
    var tabObjectPresets = null; // [visualizer3DSettingsPresets, themeSettingsPresets];

    var id = "visualizerSettingsTab";
    var cls = "visualizer-settings-panel";
    SongSettingsComponent.createTabs($("#visualizerSettingsDialogDiv"), id, cls, tabCaptions, tabObjects,
        function(comp, oldValue, newValue) {
            settingsDirty = true;
        }, tabObjectPresets);

}


function createSongSettingsPanel() {
    var $songSettingsDialog = $("#songSettingsDialogDiv");
    var tabCaptions = ["Song", "Structure Seeds", "Content Seeds", "Indices Seeds", "Parameters", "Domains", "Details"];
    var tabObjects = [songSettings, songStructureSeedSettings, songContentSeedSettings, songIndicesSeedSettings, songParameters, songDomains, songDetails];
    var tabObjectPresets = [songSettingsPresets, songStructureSeedSettingsPresets, songContentSeedSettingsPresets, songIndicesSeedSettingsPresets, songParametersPresets, songDomainsPresets, songDetailsPresets];
    var createSeeds = [false, true, true, true, false, false, false];
    var tabsId = "songSettingsTab";
    return SongSettingsComponent.createTabs($songSettingsDialog, tabsId, "settings-panel", tabCaptions, tabObjects,
        function(comp, oldValue, newValue) {
            settingsDirty = true;
            setSongSettingsDirty(true);
            if (getFirstRunningServerTaskWithType(AsyncServerChildTaskType.RENDER)) {
                songSettingsChangedWhileRendering = true;
            }
        }, tabObjectPresets, createSeeds);
}



function updateGuiFromEditorSettings(dialogs) {
    // Hide the dialogs that should be hidden :)
    for (var i=0; i<dialogs.length; i++) {
        var dialog = dialogs[i];
        var $dialog = $("#" + dialog + "DialogDiv");
        var pos = editorSettings[dialog + "Position"];
        if (pos) {
            $dialog.dialog("option", "position", {my: "left top", at: "left+" + pos[0] + " top+" + pos[1]});
//            console.log("left : " + left);
        } else {
            logit("Could not find pos for " + dialog);
        }
        var visible = !!editorSettings[dialog + "Visible"];
        if (!visible) {
            $dialog.dialog("close");
        }
    }
}


function createDialogAndToggle(dialog, caption, width, at) {

    var $buttonsDiv = $("#buttonsDiv");

    $buttonsDiv.append($('<input type="checkbox" checked="checked" id="' + dialog + 'DialogShow"/><label class="toggle-button" for="' + dialog + 'DialogShow">' + caption + '</label>'));

    var $toggle = $("#" + dialog + "DialogShow");
    var $dialog = $("#" + dialog + "DialogDiv");

    $dialog.dialog({
//        dialogClass: "transparent",
        closeText: "hide",
        width: width,
        resizable: false,
        show: {effect: "fade", duration: "fast"},

        create: function(event, ui) {
            var widget = $(this).dialog("widget");
            $(".ui-dialog-titlebar-close span", widget)
                .removeClass("ui-icon-closethick")
                .addClass("ui-icon-minusthick");
        },
        dragStop: function(event, ui) {
            editorSettings[dialog + "Position"] = [ui.position.left, ui.position.top];
            settingsDirty = true;
            editorSettings.dirty = true;
//            logit(JSON.stringify(ui));
//            if (pos) {
//                $dialog.dialog("option", "position", {my: "left top", at: "left+" + pos[0] + " top+" + pos[1]});
//            }
//                logit("hej");
        }
//        hide: {effect: "fade", duration: 20}
    });


    $dialog.dialog("option", "position", {my: "center", at: at});

//    $dialog.on("dragstop", function(event, ui) {logit("hej")});


    var $dialogWidget = $dialog.dialog("widget");
    if (themeSettings.transparentDialogs) {
        $dialogWidget.addClass("transparent");
        $dialog.addClass("very-transparent");
    }

    function makeFullyVisible() {
        if (visualizer && !visualizer.mouseCanvasDown) {
            $dialogWidget.removeClass("transparent");
            $dialog.removeClass("very-transparent");
            $dialog.removeClass("transparent");
        }
    }

    $dialogWidget.on("mousedown", function() {
        makeFullyVisible();
        $dialog.dialog("moveToTop");
        $dialog.data("dragging", true);
    });

    $dialogWidget.on("mouseup", function() {
        makeFullyVisible();
        $dialog.data("dragging", false);
    });

    $dialogWidget.on("mouseenter", function() {
        if (visualizer && !visualizer.mouseCanvasDown) {
            makeFullyVisible();
//            $dialog.removeClass("very-transparent");
        }
    });
    $dialogWidget.on("mouseleave", function() {
        if (themeSettings.transparentDialogs && !$dialog.data("dragging")) {
            $dialogWidget.addClass("transparent");
            $dialog.addClass("very-transparent");
            $dialog.removeClass("transparent");
        }
    });

    $dialog.on("dialogclose", function() {
//            console.log("Closing...");
        $toggle[0].checked = false;
        $toggle.button("refresh");
        editorSettings[dialog + "Visible"] = false;
        editorSettings.dirty = true;
        settingsDirty = true;
//        $dialogWidget.addClass("transparent");
//        logit("Closing " + dialog);
    });
//    $dialogsDiv.css("opacity", "0.5");
//    $dialog.css("opacity", "0.5");

    $dialog.css("max-height", "35em");
//    $dialog.css("opacity", "0.5");
//        $dialog.css("min-height", "500px");
//        $dialog.dialog("option", "maxHeight", 500);
//        $dialog.dialog("option", "minHeight", 400);
    $dialog.on("dialogopen", function() {
//                   console.log("Opening...");
        editorSettings[dialog + "Visible"] = true;
        editorSettings.dirty = true;
        settingsDirty = true;
//        logit("Opening " + dialog);
    });
    $toggle.button().on("change", function() {
        var dialogOpen = $dialog.dialog("isOpen");
        if (this.checked && !dialogOpen) {
            $dialog.dialog("open");
        } else if (!this.checked && dialogOpen) {
            $dialog.dialog("close");
        }
    });
}

function stopSong() {
    if (audioPlayer) {
        audioPlayer.stop();
    }
    visualizer.clearHighlightNotes();
    visualizer.setMode(VisualizerMode.STOP);
    if (audioPlayer) {
        visualizer.setCurrentPlayBeatTime(audioPlayer.songPlayBeatTime);
    }
    $playButton.button( "option", "icons", {primary: "ui-icon-play"});
}

//function foo() {
//    logit("Logged in cookie: " + $.cookie('loggedin'));
//}

var termsOfUseContent = [
    '<p>',
    '<ul>',
    '<li>All songs that are generated through this site (abundant-music.com) are public domain by default. Users do not get copyright of any generated song' +
        ', but since the songs are public domain, they can be used commercially.</li>',
    '<li>The user is responsible that the generated songs or their use do not infringe any other copyrights. ' +
        'In such cases, the generated songs are not public domain.</li>',
    '<li>It is not allowed to use this site as an API. It is only allowed to use through abundant-music.com\'s graphical user interface. ' +
        'It is not allowed to use the site in parallel from several computers with same login.</li>',
    '<li>The site uses cookies, which are small files stored on the user\'s computer. ' +
        'The cookies on the site are only used to determine whether users are logged in or not.</li>',
//            '<li></li>',
    '</ul>',
    '<p>',
    '<p>Note that these terms of use may change.</p>'];

function showTermsOfUse() {
    showModalDialog("Terms of Use", termsOfUseContent.join(""),
        {
            resizable: false,
            draggable: false,
            width: '40em',
            modal: true,
            closeOnEscape: false,
            buttons: {
                "OK": function() {
                    $(this).dialog("close");
                }
            }
        });
}

function showAcceptTermsOfUseIfNecessary() {
    // Show the terms of use if not accepted
    if (userInfo && !userInfo.acceptedTOU) {
        showModalDialog("Terms of Use", termsOfUseContent.join(""),
            {
                resizable: false,
                draggable: false,
                beforeClose: function() {
                    if (!userInfo.acceptedTOU) {
                        return false;
                    }
                },
                width: '40em',
                modal: true,
                closeOnEscape: false,
                buttons: {
                    "I Accept": function() {
                        userInfo.acceptedTOU = true;
                        updateUserInfo(false);
                        $(this).dialog("close");
                    },
                    "Logout": function() {
                        window.location.href = "logout";
                    }
                }
            });
    }
}

function updateRenderStorageAndVisualizer(op) {
    renderStorage.channelMaps = op.resultChannelMaps;
    renderStorage.channelMaps = op.resultChannelMaps;
    renderStorage.renderData = op.resultRenderData;
    renderStorage.sectionTimes = op.resultSectionTimes;
    renderStorage.songStructureInfo = op.resultSongStructureInfo;
    renderStorage.renderDataLength = Math.max(1, op.resultRenderDataLength);
    renderStorage.dirty = true;
    settingsDirty = true;

    tempTempoEvents = copyValueDeep(gatherEventsWithType(renderStorage.renderData.events, "t"));
    visualizer.resetRenderData();
    visualizer.addRenderData(renderStorage.renderData, renderStorage.renderDataLength);

    visualizer.setSectionInfos(op.resultSectionTimes, op.resultSongStructureInfo);

    updateSongInfoPanel();

    if (!songSettingsChangedWhileRendering) {
        setSongSettingsDirty(false);
    }
}


function renderSong(doneFunc, cancelFunc, failFunc) {

    if (lightServerMode && !window.Worker) {
        showModalDialog("Not Supported",
            "The server doesn't support this operation and you need a browser with WebWorker support to do this in the client.");
    } else {

        songSettingsChangedWhileRendering = false;

        var seed = getMainSeed();
        var renderRequestData = {seed: seed, sectionIndex: -1, genInfo: getGenInfo()};

//    logit("Rendeirng with seed " + seed);

        var params = {
            taskType: WorkerTaskType.RENDER,
            content: renderRequestData,
            caption: "Composing song...",
            doneCaption: "Done!",
            onSuccess: function(op) {

//            logit("Rendered song success!");
                updateRenderStorageAndVisualizer(op);
                if (doneFunc) {
                    doneFunc();
                }
            },
            onCancel: function(op) {
                if (cancelFunc) {
                    cancelFunc();
                }
            },
            onFail: function(op) {
                if (failFunc) {
                    failFunc();
                }
            },
            id: "task" + asyncOperationCounter};

        var task = null;
        if (window.Worker) {
            task = new AsyncWorkerTask(params);
        } else {
            if (lightServerMode) {
                showModalDialog("No Web Worker Support Detected",
                    "This browser doesn't support web workers, which is necessary when Abundant Music runs on a lightweight server");
            } else {
                params.taskType = AsyncServerChildTaskType.RENDER;
                task = new AsyncServerChildTask(params);
            }
        }

        if (!addAsyncOperation(task)) {
            if (failFunc) {
                failFunc();
            }
        }
    }
}

var first = true;
function setVisualizerSize() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    if (!w || !h) {
        var $document = $(document);
        w = $document.innerWidth();
        h = $document.innerWidth();
    }
    if (first) {
        $body = $("body");
        var scaler = clamp(Math.min(w, h) / 1000, 0.5, 2);
        var fontSize = 16 * scaler;
        $body.css("font-size", fontSize + "px");
        first = false;
    }

    visualizer.resized(w, h);
}

function sendFeedback() {

    var feedbackStr = $("#feedbackTextArea").val();

    if (feedbackStr) {
        sendSimpleCommand({type: "giveFeedback", feedback: feedbackStr});
        showModalDialog("Feedback sent", "<p>Thanks a lot!</p>");
    } else {
        showModalDialog("Feedback info", "<p>Feedback text empty?</p>");
    }
}


function composeSetup1() {

    // Check if we are logged in
    loggedIn = $.cookie('loggedin') == "true";
    user = decodeURIComponent($.cookie('loggedinuser'));

//    logit("user dir name: " + userToDirName(user) + " from " + user);

    var $window = $(window);
    var $canvasfor2dcontext = $("#canvasfor2dcontext");

    var canvasfor2dcontext = $canvasfor2dcontext[0];

    var startTime = Date.now();

    if (Modernizr.webgl && !visualizer3DSettings.forceContext2D) {
//        visualizer = new CanvasVisualizer3D(canvasfor2dcontext, startTime);
        var webGLOptions = {
            addBloom: visualizer3DSettings.addBloom,
            addSimulatedAA: visualizer3DSettings.addSimulatedAA,
            addVignette: visualizer3DSettings.addVignette
        };
        try {
            visualizer = new WebGLVisualizer3D(canvasfor2dcontext, webGLOptions);
            usingWebGL = true;
        } catch (exc) {
            console.log(exc);
            console.log("Error when initializing webgl. Using 2D context.");
            visualizer = new CanvasVisualizer3D(canvasfor2dcontext, startTime);
            visualizer3DSettings.forceContext2D = true;
        }
    } else {
        visualizer = new CanvasVisualizer3D(canvasfor2dcontext, startTime);
    }
//    visualizer.render();


    $window.on("resize", function() {
        setVisualizerSize();
        visualizer.render();
    });

    setVisualizerSize();

    setTimeout(composeSetup2, loaderTimeout);

    updateLoaderProgress(70);
}

function composeSetup2() {
    songSettingsCompInfo = createSongSettingsPanel();
    setTimeout(composeSetup3, loaderTimeout);
    updateLoaderProgress(80);
}

function composeSetup3() {

    createVisualizerSettingsPanel();
    createExportPanel();
    createSongInfoPanel();
    createPlayerPanel();
    createAccountPanel();
    createTutorialsPanel();

    $("#helpTabs").tabs();

    createSongsPanel();

    setTimeout(composeSetup4, loaderTimeout);

    updateLoaderProgress(90);
}


function composeSetup4() {
    var $feedbackDialogDiv = $("#feedbackDialogDiv");
    if (!loggedIn) {
        $feedbackDialogDiv.empty();
        $feedbackDialogDiv.append("Log in to enable feedback. Thanks!");
    } else {
        $feedbackDialogDiv.find("#submitFeedbackButton").button().click(function() {
            sendFeedback();
            $feedbackDialogDiv.find("#feedbackTextArea").val("");
        });
    }

    var dialogs = ["songSettings", "songInfo", "player", "visualizerSettings", "tutorials", "songs", "export", "help", "feedback", "account"];
    var captions = ["Song Settings" , "Song Info", "Player", "Visual Settings", "Tutorials", "Songs", "Export", "Help/Credits", "Feedback", "Account"];
    var widths = ["60em", "60em", Modernizr.webaudio ? "45em" : null, "45em", "55em", "45em", "45em", "50em", lightServerMode ? null : "45em", lightServerMode ? null : "40em"];
    var ats = ["right", "right top", "right", "top", "left", "top", "top", "left", "left", "left"];

    for (var i=0; i<dialogs.length; i++) {

        var dialog = dialogs[i];
        var width = widths[i];
        var caption = captions[i];
        if (width) {
            createDialogAndToggle(dialog, caption, width, ats[i]);
        } else {
            // Remove toggle
            var $dialog = $("#" + dialog + "DialogDiv");
            $dialog.remove();
        }
    }

    $refreshButton = $('<button style="margin-left: 1em;">Compose</button>');
    var $buttonsDiv = $("#buttonsDiv");
    $buttonsDiv.append($refreshButton);
    $refreshButton.button({
            icons: {
                primary: "ui-icon-locked"
            }
        }
    );
    $refreshButton.click(function() {
        if (songSettingsDirty) {
            $refreshButton.button("option", "disabled", true);
            renderSong(
                function() { // On done
                },
                function() { // On cancel
                    $refreshButton.button("option", "disabled", false);
                },
                function() { // On fail
                    $refreshButton.button("option", "disabled", false);
                }
            );
        }
    });

    // Updating GUI from settings
    updateGuiFromEditorSettings(dialogs);

    $playButton = $("#waplaybutton");
    $stopButton = $("#wastopbutton");
    $forwardButton = $("#waforwardbutton");
    $rewindButton = $("#warewindbutton");

    var audioStepTime = 10;

    function playerUpdate() {
        var updateMillis = 500;
        if (audioPlayer) {
            var before = Date.now();
            audioPlayer.step();
            var after = Date.now();

            var diff = after - before;

            audioStepTime = 0.95 * audioStepTime + 0.05 * diff;

//            logit(" audio step time " + audioStepTime + " latest: " + diff);
//            logit("player beat time: " + webAudioPlayer.songPlayBeatTime);

            if (audioPlayer.mode == AudioPlayerMode.PLAY) {
                visualizer.setCurrentPlayBeatTime(audioPlayer.songPlayBeatTime);
                updateMillis = 100;
            }
        }
//        logit("Update millis " + updateMillis);
        setTimeout(playerUpdate, updateMillis);
    }

    function playSong() {
        if (audioPlayer == null) {
            audioPlayer = new AudioPlayerConstructor();
        }

        $latestAudioElement = null; // Cancels the other player

        audioPlayer.soundFontType = webAudioPlayerSettings.soundFontType;

        audioPlayer.settings = webAudioPlayerSettings;

        audioPlayer.setRenderData(renderStorage.renderData);

        audioPlayer.setChannelMaps(renderStorage.channelMaps);

        function doPlay() {
            audioPlayer.play();
            visualizer.setMode(VisualizerMode.PLAY);
            visualizer.setCurrentPlayBeatTime(audioPlayer.songPlayBeatTime);
            $playButton.button( "option", "icons", {primary: "ui-icon-pause"});
        }
        audioPlayer.getReadyForPlay(
            function() {
                $playButton.button("option", "disabled", false);
                doPlay();
            },
            function() { // cancel
                $playButton.button("option", "disabled", false);
            }
        );
    }

    function pauseSong() {
        audioPlayer.pause();
        visualizer.setMode(VisualizerMode.PAUSE);
        $playButton.button( "option", "icons", {primary: "ui-icon-play"});
    }

    function stepForward() {
        if (audioPlayer) {
            audioPlayer.gotoBeat(audioPlayer.songPlayBeatTime + 8);
            visualizer.clearHighlightNotes();
            visualizer.setCurrentPlayBeatTime(audioPlayer.songPlayBeatTime);
        }
    }
    function rewind() {
        if (audioPlayer) {
            audioPlayer.gotoBeat(audioPlayer.songPlayBeatTime - 8);
            visualizer.clearHighlightNotes();
            visualizer.setCurrentPlayBeatTime(audioPlayer.songPlayBeatTime);
        }
    }


    $playButton.click(function() {
        if (audioPlayer && audioPlayer.mode == AudioPlayerMode.PLAY) {
            pauseSong();
        } else {
            $playButton.button("option", "disabled", true);
            if (songSettingsDirty) {
                renderSong(
                    function() { // On done
                        playSong();
                    },
                    function() { // On cancel
                        $playButton.button("option", "disabled", false);
                    },
                    function() { // On fail
                        logit("kljd");
                        $playButton.button("option", "disabled", false);
                    }
                );
            } else {
                $playButton.button("option", "disabled", true);
                playSong();
            }
        }
    });

    $stopButton.click(function() {
        stopSong();
    });

    $forwardButton.click(function() {
        stepForward();
    });

    $rewindButton.click(function() {
        rewind();
    });

    function checkSettingsChange() {
        if (settingsDirty) {
            saveSettingsToLocalStorage();
            settingsDirty = false;
            logit("Saving settings");
        }
        setTimeout(checkSettingsChange, 500);
    }
    checkSettingsChange();

    var prevVisualizerTime = Date.now();

    var stepCounter = 0;

    function animate() {
        requestAnimationFrame(animate);

//        logit("dhskf " + stepCounter);
        var paintFps = visualizer3DSettings.context2DFps;
        if (usingWebGL) {
            paintFps = visualizer3DSettings.webGLFps;
        }
        if (visualizer3DSettings.usePerspective) {
            if (!visualizer.camera.inPerspectiveMode) {
                visualizer.camera.toPerspective();
            }
        } else {
            if (!visualizer.camera.inOrthographicMode) {
                visualizer.camera.toOrthographic();
            }
        }

        var paintModulus = clamp(Math.round(60 / paintFps), 1, 60);
        var time = Date.now();
        var dt = time - prevVisualizerTime;
        visualizer.stopMovementMode = visualizer3DSettings.stopMovementMode;
        visualizer.step(dt);
        stepCounter++;
        if ((stepCounter % paintModulus) == 0) {
            if (visualizer3DSettings.on) {
                visualizer.render();
            }
        }
        prevVisualizerTime = time;
    }

    animate();
    playerUpdate();


    if (renderStorage.renderData) {
        setSongSettingsDirty(false);
        visualizer.addRenderData(renderStorage.renderData, renderStorage.renderDataLength);
    }
    if (renderStorage.songStructureInfo && renderStorage.sectionTimes) {
        visualizer.setSectionInfos(renderStorage.sectionTimes, renderStorage.songStructureInfo);
    }

    updateSongInfoPanel();


    // All is loaded now. We can stop hiding :)
    $("#hider-div").remove();

    allLoaded = true;
}