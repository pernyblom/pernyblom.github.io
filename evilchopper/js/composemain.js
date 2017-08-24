
var AudioPlayerConstructor = SoundManager2Player;

var hasWebAudio = false;
if (typeof(AudioContext) != 'undefined' || typeof(webkitAudioContext) != 'undefined') {
    hasWebAudio = true;
    AudioPlayerConstructor = WebAudioPlayer;
}

var canPlayMp3 = true;


var loggedIn = false;

var globalRnd = new MersenneTwister();
var globalGenInfo = new GenInfo();

var settingsDirty = false;

var songSettingsDirty = true;
var songSettingsChangedWhileRendering = false;

var audioPlayer = null;

var uidManager = new UniqueIdManager();

var renderStorage = new RenderStorage();

var songSettingsCompInfo = null;

var editorSettings = new EditorSettings();

var renderSettings = new Visualizer3DSettings();
var visualizer3DSettingsPresets = new Visualizer3DSettingsPresets();

var themeSettings = new ThemeSettings();
var themeSettingsPresets = new ThemeSettingsPresets();

var webAudioPlayerSettings = new WebAudioPlayerSettings();
var audioElementPlayerSettings = new AudioElementPlayerSettings();
var soundManager2PlayerSettings = new SoundManager2PlayerSettings();

var midiExportSettings = new MidiExportSettings();
var midiExportSettingsPresets = new MidiExportSettingsPresets();
var wavExportSettings = new WavExportSettings();
var wavExportSettingsPresets = new WavExportSettingsPresets();
var mp3ExportSettings = new Mp3ExportSettings();
var mp3ExportSettingsPresets = new Mp3ExportSettingsPresets();
var oggExportSettings = new OggExportSettings();
var oggExportSettingsPresets = new OggExportSettingsPresets();
var itExportSettings = new ItExportSettings();
var itExportSettingsPresets = new ItExportSettingsPresets();

var songSettings = new SongSettings();
var songSettingsPresets = new SongSettingsPresets();
var songStructureSeedSettings = new SongStructureSeedSettings();
var songStructureSeedSettingsPresets = new SongStructureSeedSettingsPresets();
var songContentSeedSettings = new SongContentSeedSettings();
var songContentSeedSettingsPresets = new SongContentSeedSettingsPresets();
var songIndicesSeedSettings = new SongIndicesSeedSettings();
var songIndicesSeedSettingsPresets = new SongIndicesSeedSettingsPresets();
var songParameters = new SongParameters();
var songParametersPresets = new SongParametersPresets();
var songDomains = new SongDomains();
var songDomainsPresets = new SongDomainsPresets();

var allSettings = [
    renderStorage, // Rendered stuff
    themeSettings,
    editorSettings, renderSettings, webAudioPlayerSettings, soundManager2PlayerSettings, audioElementPlayerSettings, // GUI
    midiExportSettings, wavExportSettings, mp3ExportSettings, oggExportSettings, itExportSettings, // Export
    midiExportSettingsPresets, wavExportSettingsPresets, mp3ExportSettingsPresets, oggExportSettingsPresets, itExportSettingsPresets, // Export presets
    songSettings, // Song
    songSettingsPresets, // Song presets
    songStructureSeedSettings, songContentSeedSettings, songIndicesSeedSettings, // Seeds
    songStructureSeedSettingsPresets, songContentSeedSettingsPresets, songIndicesSeedSettingsPresets, // Seeds presets
    songParameters, songDomains, // Domains and params
    songParametersPresets, songDomainsPresets // Domains and params presets
];


var allLoadSaveSongSettings = [
    songSettings,
    songStructureSeedSettings, songContentSeedSettings, songIndicesSeedSettings,
    songParameters, songDomains
];

var asyncOperations = [];
var asyncOperationCounter = 0;


var propertyInfoProvider = new PropertyInfoProvider();


var renderer = null;

var $playButton = null;
var $stopButton = null;
var $forwardButton = null;
var $rewindButton = null;


//function alignEverything() {
//    for (var i=0; i<createdCompsArr.length; i++) {
//        var comps = createdCompsArr[i].createdComps;
//        for (var j=0; j<comps.length; j++) {
//            var comp = comps[j];
////            comp.resetAlignment();
////            comp.alignComponents();
//        }
//    }
//}

function updateTheme() {
    var theme = JQueryUITheme.toUrlString(themeSettings.theme);
//    var theme = "blitzer";
    $("#theme-link").attr("href", "css/" + theme + "/jquery.ui.theme.css");

//    setTimeout(alignEverything, 1000);
}


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

function afterExport(op) {
    stopSong();
    renderStorage.channelMaps = op.resultChannelMaps;
    renderStorage.renderData = op.resultRenderData;
    renderStorage.renderDataLength = Math.max(1, op.resultRenderDataLength);
    renderStorage.dirty = true;
    settingsDirty = true;
    renderer.resetRenderData();
    renderer.addRenderData(renderStorage.renderData, renderStorage.renderDataLength);
    if (!songSettingsChangedWhileRendering) {
        songSettingsDirty = false;
    }
}

function exportMidi() {
    var seed = getMainSeed();
    var genInfo = getGenInfo();
    copyWithPropertyInfoProvider(genInfo, midiExportSettings);
    var renderRequestData = {seed: seed, sectionIndex: -1, genInfo: genInfo};
    var curOperation = getFirstRunningServerTaskWithType(AsyncServerChildTaskType.EXPORT_MIDI);

    if (curOperation) {
        // Cancel current render instead!
        showModalDialog("", "Multiple exports not allowed.");
    } else {
        var task = new AsyncServerChildTask({
            taskType: AsyncServerChildTaskType.EXPORT_MIDI,
            content: renderRequestData,
            caption: "Exporting midi...",
            doneCaption: "Done!",
            resultDivId: "midi-export-result-div",
            onSuccess: function(op) {
                afterExport(op);
            },
            id: "task" + asyncOperationCounter});
        addAsyncOperation(task);
    }
}


function exportWav() {
    var seed = getMainSeed();
    var genInfo = getGenInfo();
    copyWithPropertyInfoProvider(genInfo, wavExportSettings);

//    logit(genInfo);
    var renderRequestData = {seed: seed, sectionIndex: -1, genInfo: genInfo};
    var curOperation = getFirstRunningServerTaskWithType(AsyncServerChildTaskType.EXPORT_WAV);

    if (curOperation) {
        // Cancel current render instead!
        showModalDialog("", "Multiple exports not allowed.");
    } else {
        var task = new AsyncServerChildTask({
            taskType: AsyncServerChildTaskType.EXPORT_WAV,
            content: renderRequestData,
            caption: "Exporting wav...",
            doneCaption: "Done!",
            resultDivId: "wav-export-result-div",
            onSuccess: function(op) {
                afterExport(op);
            },
            id: "task" + asyncOperationCounter});
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
    var seed = getMainSeed();
    var genInfo = getGenInfo();
    copyWithPropertyInfoProvider(genInfo, mp3ExportSettings);

    var renderRequestData = {seed: seed, sectionIndex: -1, genInfo: genInfo};
    var curOperation = getFirstRunningServerTaskWithType(AsyncServerChildTaskType.EXPORT_MP3);

    if (curOperation) {
        // Cancel current render instead!
        showModalDialog("", "Multiple exports not allowed.");
    } else {
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
    var seed = getMainSeed();
    var genInfo = getGenInfo();
    copyWithPropertyInfoProvider(genInfo, oggExportSettings);

    var renderRequestData = {seed: seed, sectionIndex: -1, genInfo: genInfo};
    var curOperation = getFirstRunningServerTaskWithType(AsyncServerChildTaskType.EXPORT_OGG);

    if (curOperation) {
        // Cancel current render instead!
        showModalDialog("", "Multiple exports not allowed.");
    } else {
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
    SongSettingsComponent.createTabs($("#exportDialogDiv"), "exportTab", "export-panel", tabCaptions, tabObjects,
        function() {
            settingsDirty = true;
        }, tabObjectPresets);

    $("#exportTab0").prepend($("<div id=\"midi-export-result-div\" ></div>"));
    $("#exportTab1").prepend($("<div id=\"mp3-export-result-div\" ></div>"));
    $("#exportTab2").prepend($("<div id=\"ogg-export-result-div\" ></div>"));
    $("#exportTab3").prepend($("<div id=\"it-export-result-div\" ></div>"));
}

function loadPresetSong(songInfo) {
    var dataFilename = "songpresets/" + songInfo.prefix + ".json";

    $.ajax(dataFilename, {
        complete: function(jqXhr, textStatus) {
            if (textStatus == "success") {
                var response = $.parseJSON(jqXhr.responseText);
                if (response) {
//                            logit(response);
                    var tabsId = "songSettingsTab";
                    var newSongSettings = {name: "Test", seed: "" + response.seed};
                    var genInfo = response.genInfo;
                    var newValues = [
                        newSongSettings,
                        getSeedStringsObject(songStructureSeedSettings, genInfo),
                        getSeedStringsObject(songContentSeedSettings, genInfo),
                        getSeedStringsObject(songIndicesSeedSettings, genInfo),
                        copyWithPropertyInfoProvider(null, songParameters, genInfo),
                        copyWithPropertyInfoProvider(null, songDomains, genInfo)
                    ];
                    for (var i=0; i<newValues.length; i++) {
                        SongSettingsComponent.changeComponentValue(newValues[i], songSettingsCompInfo.createdComps, i, tabsId, songSettingsCompInfo.changeListener);
                    }
                    stopSong();
                    renderStorage.channelMaps = response.channelMaps;
                    renderStorage.renderData = response.renderData;
                    renderStorage.renderDataLength = Math.max(1, response.renderDataLength);
                    renderStorage.dirty = true;
                    settingsDirty = true;
                    renderer.resetRenderData();
                    renderer.addRenderData(renderStorage.renderData, renderStorage.renderDataLength);
                    songSettingsDirty = false;
                }
            } else {
                console.log("Failed to load preset song: " + dataFilename);
            }
        },
        type: 'GET'
    });

}

function createSongsPanel() {
    $("#songtabs").tabs();

    var $examplesDiv = $("#example-songs-tab");

    function createLoadButton(buttonId, songInfo) {
        var $loadButton = $examplesDiv.find("#" + buttonId);
        $loadButton.button();
        $loadButton.click(function() {
            loadPresetSong(songInfo);
        });
    }

    function createSongList(info, $targetDiv) {
        var songs = info.songs;
        var content = "";
        content += "<ol class=\"song-list\" >";

        var linkStyle = "margin-left: 8px; margin-right: 8px;";
        for (var i=0; i<songs.length; i++) {
            var songInfo = songs[i];

            var defaultSfIndex = songInfo.soundfonts[0];

            var songName = songInfo.name;
            if (!songName) {
                songName = "Song Example " + (i + 1);
            }

            var liContent = "<p>" + songName;;

            var prefix = "songpresets/" + songInfo.prefix;
            var midiFilename = prefix + ".mid";
            var mp3Filename = prefix + "_" + defaultSfIndex + ".mp3";
            var oggFilename = prefix + "_" + defaultSfIndex + ".ogg";

            liContent += '<a style="' + linkStyle + '" href="' + midiFilename + '" >Midi</a>';
            liContent += '<a style="' + linkStyle + '" href="' + mp3Filename + '" >Mp3</a>';
            liContent += '<a style="' + linkStyle + '" href="' + oggFilename + '" >Ogg</a>';

            var buttonId = "preset-song-button-" + i;
            liContent += '<button id="' + buttonId + '" >Load</button>';

            liContent += "</p>";

            liContent += "<p>";
            liContent += "Variants Mp3: ";
            for (var j=1; j<songInfo.soundfonts.length; j++) {
                var sfIndex = songInfo.soundfonts[j];
                var sfName = SoundFontType.toString(sfIndex);
                var mp3Filename = prefix + "_" + sfIndex + ".mp3";
                liContent += '<a style="' + linkStyle + '" href="' + mp3Filename + '" >' + sfName + '</a>';
            }
            liContent += "</p>";

            liContent += "<p>";
            liContent += "Variants Ogg: ";
            for (var j=1; j<songInfo.soundfonts.length; j++) {
                var sfIndex = songInfo.soundfonts[j];
                var sfName = SoundFontType.toString(sfIndex);
                var oggFilename = prefix + "_" + sfIndex + ".ogg";
                liContent += '<a style="' + linkStyle + '" href="' + oggFilename + '" >' + sfName + '</a>';
            }
            liContent += "</p>";


            content += "<li class=\"ui-widget-content\" >";
            content += liContent;
            content += "</li>";
        }
        content += "</ol>";
        var $list = $(content);
//        $list.selectable();

        $targetDiv.append($list);

        for (var i=0; i<songs.length; i++) {
            var songInfo = songs[i];
            var buttonId = "preset-song-button-" + i;
            createLoadButton(buttonId, songInfo);
        }

        if (!renderStorage.renderData && songs.length > 0) {
            loadPresetSong(songs[0]);
        }
    }

    $.ajax("songpresets/index.json", {
//        contentType: "application/json",
        complete: function(jqXhr, textStatus) {
            if (textStatus == "success") {
                var response = $.parseJSON(jqXhr.responseText);
                if (response) {
                    createSongList(response, $examplesDiv);
                }
//                logit(response);
            } else {
                console.log("Failed to get preset songs: " + textStatus);
            }
        },
        type: 'GET'
    });

}

function createAccountPanel() {

//    logit("The cookie: " + document.cookie);

    var html = "<p></p>"
    if (loggedIn) {
        html =
            '<form action="logout" method="get" id="logout_form">' +
                '<fieldset>' +
                '<div id="logout_input_area">' +
                '<input id="openid_submit" type="submit" value="Log Out"/>' +
                '</div>' +
                '</fieldset>' +
                '</form>';
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
    var $html = $(html);

    var $div = $("#accountDialogDiv");
    $div.append($html);

    openid.init('openid_identifier');

    $div.find("#openid_submit").button();
//    openid.setDemoMode(true);
}

function createPlayerPanel() {

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

    var $playerDialog = $("#playerDialogDiv");

    var $webAudioPlayerDiv = $("#waPlayerDiv");
    var $sm2PlayerDiv = $("#sm2PlayerDiv");

    var tabCaptions = [AudioPlayerConstructor.prototype.title];
    var tabObjects = [webAudioPlayerSettings];

    var tabObjectPresets = null; // [visualizer3DSettingsPresets];

    var result = SongSettingsComponent.createTabs($playerDialog, "playerSettingsTab", "player-settings-panel", tabCaptions, tabObjects,
        function(comp, oldValue, newValue) {
            settingsDirty = true;
        }, tabObjectPresets);

    $webAudioPlayerDiv.detach();
    $sm2PlayerDiv.detach();
    $("#playerSettingsTab0").prepend($webAudioPlayerDiv);

    return result;
}


function createVisualizerSettingsPanel() {
    var tabCaptions = ["3D", "Theme"];
    var tabObjects = [renderSettings, themeSettings];
    var tabObjectPresets = null; // [visualizer3DSettingsPresets, themeSettingsPresets];

    SongSettingsComponent.createTabs($("#visualizerSettingsDialogDiv"), "visualizerSettingsTab", "visualizer-settings-panel", tabCaptions, tabObjects,
        function(comp, oldValue, newValue) {
            settingsDirty = true;
        }, tabObjectPresets);
}


function createSongSettingsPanel() {
    var $songSettingsDialog = $("#songSettingsDialogDiv");
    var tabCaptions = ["Song", "Structure Seeds", "Content Seeds", "Indices Seeds", "Parameters", "Domains"];
    var tabObjects = [songSettings, songStructureSeedSettings, songContentSeedSettings, songIndicesSeedSettings, songParameters, songDomains];
    var tabObjectPresets = [songSettingsPresets, songStructureSeedSettingsPresets, songContentSeedSettingsPresets, songIndicesSeedSettingsPresets, songParametersPresets, songDomainsPresets];
    var createSeeds = [false, true, true, true, false, false];
    var tabsId = "songSettingsTab";
    return SongSettingsComponent.createTabs($songSettingsDialog, tabsId, "settings-panel", tabCaptions, tabObjects,
        function(comp, oldValue, newValue) {
            settingsDirty = true;
            songSettingsDirty = true;
            if (getFirstRunningServerTaskWithType(AsyncServerChildTaskType.RENDER)) {
                songSettingsChangedWhileRendering = true;
            }
        }, tabObjectPresets, createSeeds);
}


function onDialogClosed($dialog, $toggle) {
//    console.log($toggle[0]);
    $toggle[0].checked = false;
    $toggle.button("refresh");
}

function loadSettingsFromLocalStorage() {
    for (var i=0; i<allSettings.length; i++) {
        var settings = allSettings[i];
        settings.loadFromLocalStorage();
    }
}
function saveSettingsToLocalStorage() {
    for (var i=0; i<allSettings.length; i++) {
        var settings = allSettings[i];
        if (settings.dirty) {
            settings.saveToLocalStorage();
            settings.dirty = false;
        }
    }
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

function updateEditorSettingsFromGui(dialogs) {
    // Read the values from all the dialogs.
    // This should be done when navigating away from the page and before updating local storage stuff


}


function createDialogAndToggle(dialog, caption, width, at) {
    var $buttonsDiv = $("#buttonsDiv");
    $buttonsDiv.append($('<input type="checkbox" checked="checked" id="' + dialog + 'DialogShow"/><label class="toggle-button" for="' + dialog + 'DialogShow">' + caption + '</label>'));

    var $toggle = $("#" + dialog + "DialogShow");
    var $dialog = $("#" + dialog + "DialogDiv");
    $dialog.dialog({
        width: width,
        resizable: false,
        show: {effect: "fade", duration: "fast"},
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

    $dialog.on("dialogclose", function() {
//            console.log("Closing...");
        $toggle[0].checked = false;
        $toggle.button("refresh");
        editorSettings[dialog + "Visible"] = false;
        editorSettings.dirty = true;
        settingsDirty = true;
//        logit("Closing " + dialog);
    });
    $dialog.css("max-height", "500px");
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
    renderer.clearHighlightNotes();
    renderer.setMode(VisualizerMode.STOP);
    if (audioPlayer) {
        renderer.setCurrentPlayBeatTime(audioPlayer.songPlayBeatTime);
    }
    $playButton.button( "option", "icons", {primary: "ui-icon-play"});
}

//function foo() {
//    logit("Logged in cookie: " + $.cookie('loggedin'));
//}

function composeSetup() {

    loadSettingsFromLocalStorage();


    // Check if we are logged in
    loggedIn = $.cookie('loggedin') == "true";

    var $topDiv = $("#topdiv");
    var $body = $("body");
    var $window = $(window);
    var $document = $(document);
    var $canvasfor2dcontext = $("#canvasfor2dcontext");


    var canvasfor2dcontext = $canvasfor2dcontext[0];

    var startTime = Date.now();

    var usingWebGL = false;
    if (Detector.webgl && !renderSettings.forceContext2D) {
//        visualizer = new CanvasVisualizer3D(canvasfor2dcontext, startTime);
        var webGLOptions = {
            addBloom: renderSettings.addBloom,
            addSimulatedAA: renderSettings.addSimulatedAA,
            addVignette: renderSettings.addVignette
        };
        renderer = new WebGLRenderer3D(canvasfor2dcontext, webGLOptions);
        usingWebGL = true;
    } else {
        renderer = new CanvasRenderer3D(canvasfor2dcontext, startTime);
    }
//    visualizer.render();

    function setVisualizerSize() {
        var w = window.innerWidth;
        var h = window.innerHeight;

        if (!w || !h) {
            w = $document.innerWidth();
            h = $document.innerWidth();
        }
        renderer.resized(w, h);
    }

    $window.on("resize", function() {
        setVisualizerSize();
        renderer.render();
    });

    setVisualizerSize();
//    console.log(canvasfor2dcontext.width + " " + canvasfor2dcontext.height);

//    hasWebAudio = false;

    var dialogs = ["songSettings", "visualizerSettings", "player", "tutorials", "songs", "export", "help", "feedback", "account"];
    var captions = ["Song Settings", "Visualizer Settings", "Player", "Tutorials", "Songs", "Export", "Help", "Feedback", "Account"];
    var widths = [950, 700, 700, 800, 700, 700, 700, 700, 650];
    var ats = ["right top", "top", "top", "left", "top", "top", "left", "left", "left"];

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

    songSettingsCompInfo = createSongSettingsPanel();
    createVisualizerSettingsPanel();
    createExportPanel();
    createPlayerPanel();
    createAccountPanel();

    $("#tutorialtabs").tabs();
    $("#helpTabs").tabs();

    createSongsPanel();

    // Updating GUI from settings
    updateGuiFromEditorSettings(dialogs);

    $playButton = $("#waplaybutton");
    $stopButton = $("#wastopbutton");
    $forwardButton = $("#waforwardbutton");
    $rewindButton = $("#warewindbutton");

    function renderSong(doneFunc, cancelFunc, failFunc) {

        songSettingsChangedWhileRendering = false;

        var seed = getMainSeed();
        var renderRequestData = {seed: seed, sectionIndex: -1, genInfo: getGenInfo()};

        var curOperation = getFirstRunningServerTaskWithType(AsyncServerChildTaskType.RENDER);

        if (curOperation) {
            // Cancel current render instead!
            showModalDialog("", "Multiple renders not allowed.");
        } else {
            var task = new AsyncServerChildTask({
                taskType: AsyncServerChildTaskType.RENDER,
                content: renderRequestData,
                caption: "Rendering song...",
                doneCaption: "Done!",
                onSuccess: function(op) {
                    renderStorage.channelMaps = op.resultChannelMaps;
                    renderStorage.renderData = op.resultRenderData;
                    renderStorage.renderDataLength = Math.max(1, op.resultRenderDataLength);
                    renderStorage.dirty = true;
                    settingsDirty = true;
                    renderer.resetRenderData();
                    renderer.addRenderData(renderStorage.renderData, renderStorage.renderDataLength);
                    if (!songSettingsChangedWhileRendering) {
                        songSettingsDirty = false;
                    }
                    doneFunc();
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
                id: "task" + asyncOperationCounter});
            if (!addAsyncOperation(task)) {
                if (failFunc) {
                    failFunc();
                }
            }
        }
    }

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
                renderer.setCurrentPlayBeatTime(audioPlayer.songPlayBeatTime);
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

        audioPlayer.soundFontType = webAudioPlayerSettings.soundFontType;

        audioPlayer.settings = webAudioPlayerSettings;

        audioPlayer.setRenderData(renderStorage.renderData);

        audioPlayer.setChannelMaps(renderStorage.channelMaps);

        function doPlay() {
            audioPlayer.play();
            renderer.setMode(VisualizerMode.PLAY);
            renderer.setCurrentPlayBeatTime(audioPlayer.songPlayBeatTime);
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
        renderer.setMode(VisualizerMode.PAUSE);
        $playButton.button( "option", "icons", {primary: "ui-icon-play"});
    }

    function stepForward() {
        if (audioPlayer) {
            audioPlayer.gotoBeat(audioPlayer.songPlayBeatTime + 8);
            renderer.clearHighlightNotes();
            renderer.setCurrentPlayBeatTime(audioPlayer.songPlayBeatTime);
        }
    }
    function rewind() {
        if (audioPlayer) {
            audioPlayer.gotoBeat(audioPlayer.songPlayBeatTime - 8);
            renderer.clearHighlightNotes();
            renderer.setCurrentPlayBeatTime(audioPlayer.songPlayBeatTime);
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

    //    exportMidi();

    function checkSettingsChange() {
        if (settingsDirty) {
            saveSettingsToLocalStorage();
            settingsDirty = false;
            logit("Saving settings")
        }
        setTimeout(checkSettingsChange, 500);
    }
    checkSettingsChange();

    var prevVisualizerTime = Date.now();

    var stepCounter = 0;

    function animate() {
        requestAnimationFrame( animate );
        var paintFps = renderSettings.context2DFps;
        if (usingWebGL) {
            paintFps = renderSettings.webGLFps;
        }
        if (renderSettings.usePerspective) {
            if (!renderer.camera.inPerspectiveMode) {
                renderer.camera.toPerspective();
            }
        } else {
            if (!renderer.camera.inOrthographicMode) {
                renderer.camera.toOrthographic();
            }
        }

        var paintModulus = clamp(Math.round(60 / paintFps), 1, 60);
        var time = Date.now();
        var dt = time - prevVisualizerTime;
        renderer.stopMovementMode = renderSettings.stopMovementMode;
        renderer.step(dt);
        stepCounter++;
        if ((stepCounter % paintModulus) == 0) {
            if (renderSettings.on) {
                renderer.render();
            }
        }
        prevVisualizerTime = time;
    }

    animate();
    playerUpdate();

    if (renderStorage.renderData) {
        songSettingsDirty = false;
        renderer.addRenderData(renderStorage.renderData, renderStorage.renderDataLength);
    } else {
//        renderSong(function() {
//        });
    }

//    var audio = document.createElement("audio");
//    canPlayMp3 = !!audio.canPlayType('audio/mpeg');

//    var $document = $(document);
//    var $audioTest = $('<audio id="audio-test"><source src="samples/gb_style/program0/length1000/note_60.mp3" type="audio/mpeg" /></audio>');
//    $document.append($audioTest);
//
//    $audioTest.on("canplaythrough", function() {
//        logit("can play through");
//    });
//    $audioTest.on("canplay", function() {
//       logit("can play");
//    });
//    $audioTest[0].play();



//    $audioTest.on("canplay", function() {
//       logit("can play");
//    });

//    updateTheme();

//    $(document).tooltip({
//        position: { my: "left top+15", at: "left bottom", collision: "flipfit" }
//        show: { duration: 800 }
//    });
}