

var AsyncServerChildTaskType = {
    RENDER: 0,
    EXPORT_MIDI: 1,
    EXPORT_WAV: 2,
    EXPORT_MP3: 3,
    EXPORT_OGG: 4,
    SAVE_PRESET: 5,
    SAVE_SONG: 6,
    DELETE_SONG: 7,
    RENAME_SONG: 8,
    DUPLICATE_SONGS: 9,
    OVERWRITE_SONG: 10
};


var WorkerTaskType = {
    RENDER: 0,
    EXPORT_MIDI: 1,
    EXPORT_WAV: 2
};


function AsyncOperation(options) {

    this.requireLogin = getValueOrDefault(options, "requireLogin", true);

    this.onDone = getValueOrDefault(options, "onDone", function(op) {
//        console.log("No onDone function specified...");
    });
    this.onFail = getValueOrDefault(options, "onFail", function(op) {
//        console.log("No onDone function specified...");
    });
    this.onCancel = getValueOrDefault(options, "onCancel", function(op) {
    });
    this.onSuccess = getValueOrDefault(options, "onSuccess", function(op) {
    });

    this.id = getValueOrDefault(options, "id", "theId");

    this.caption = getValueOrDefault(options, "caption", "Progress " + this.id + "(" + this.type + ")");
    this.doneCaption = getValueOrDefault(options, "doneCaption", "Done!");
    this.maxCount = getValueOrDefault(options, "maxCount", 1);
    this.progressDivId = getValueOrDefault(options, "progressDivId", "progressdiv");

    this.resultDivId = getValueOrDefault(options, "resultDivId", "progressdiv");

    this.createProgress = getValueOrDefault(options, "createProgress", true);


    this.done = false;
    this.cancelled = false;

    this.failReason = "";

    this.removeDelay = 2000; // Milliseconds before the progress stuff is removed
    this.$progressBar = null;
    this.$progressComp = null;
    this.$captionComp = null;
    this.$cancelButton = null;
}

AsyncOperation.prototype.update = function() {
};

AsyncOperation.prototype.start = function() {
};

AsyncOperation.prototype.cancel = function() {
    var that = this;
    setTimeout(function() {
        that.removeProgress();
    }, this.removeDelay);

    if (this.$progressComp) {
        // Some visual indication that the operation is a failure
    }
    if (that.onCancel) {
        that.onCancel(that);
    }
    that.cancelled = true;
};


AsyncOperation.prototype.removeProgress = function(fraction) {
    if (this.$progressComp) {
        var that = this;
        this.$progressComp.hide("fast", function() {
            that.$progressComp.remove();
        });
    }
};



AsyncOperation.prototype.addResultUrl = function(resultUrl) {
    if (this.resultDivId) {
        var $resultDiv = $("#" + this.resultDivId);

        $resultDiv.prepend($("<div style=\"display: none\" class=\"ui-widget-content ui-corner-all progress-component\" ><a href=\"" + resultUrl + "\">Result</a></div>"));
        $resultDiv.show("fast");
    }
};


AsyncOperation.prototype.updateProgress = function(intProgress) {
    if (this.createProgress) {
        var barId = this.$progressBar.attr("id");
        this.$progressBar.progressbar("option", "value", intProgress);
    }
};

AsyncOperation.prototype.success = function() {
    var that = this;
    setTimeout(function() {
        that.removeProgress();
    }, that.removeDelay);
    if (that.createProgress) {
        // Some visual indication that the operation is a success
        that.updateProgress(100);
        that.$captionComp.html(that.doneCaption);
        that.$cancelButton.button("disable");
    }
    if (that.onSuccess) {
        that.onSuccess(that);
    }
    if (that.onDone) {
        that.onDone(that);
    }
    that.done = true;
};


AsyncOperation.prototype.fail = function() {
    var that = this;
    setTimeout(function() {
        that.removeProgress();
    }, this.removeDelay);

    if (this.$progressComp) {
        // Some visual indication that the operation is a failure
        var captionId = this.id + "_caption";
        var failStr = this.failReason ? this.failReason : "Failed...";
        this.$progressComp.find("#" + captionId)[0].innerHTML = failStr;
    }
    if (that.onFail) {
        that.onFail(that);
    }
    if (that.onDone) {
        that.onDone(that);
    }
    that.done = true;
};


AsyncOperation.prototype.addProgress = function() {
    if (this.createProgress) {
        var $progressDiv = $("#" + this.progressDivId);

        var barId = this.id + "_progressbar";
        var captionId = this.id + "_caption";
        var cancelButtonId = this.id + "_cancelbutton";
        var progressStrs = [
            "<div style=\"display: none\" class=\"ui-widget-content ui-corner-all progress-component\" >",
            "<div class=\"ui-widget\" id=\"" + captionId + "\" >" + this.caption + "</div>",
            "<div id=\"" + barId + "\" class=\"progress-bar\" ></div>",
            "<button id=\"" + cancelButtonId + "\">Cancel</button>",
            "</div>"];

        this.$progressComp = $(progressStrs.join(""));

        $progressDiv.prepend(this.$progressComp);
        this.$progressComp.show("fast");

//        logit("Bar id " + barId);
        this.$progressBar = this.$progressComp.find("#" + barId);
        this.$progressBar.progressbar();
        this.$captionComp = this.$progressComp.find("#" + captionId);
        this.$cancelButton = this.$progressComp.find("#" + cancelButtonId);
        this.$cancelButton.button();

        var that = this;
        this.$cancelButton.click(function() {
            that.cancel();
        });
    }

};

function LoadSamplesAsyncOperation(options) {
    if (options) {
        options.caption = "Loading samples...";
    }
    AsyncOperation.call(this, options);
    this.requireLogin = false;

    this.audioType = getValueOrDefault(options, "audioType", "audio/mpeg");

    this.bufferUrls = getValueOrDefault(options, "bufferUrls", []);

    this.resultBuffers = [];
    this.loadedCount = 0;

}
LoadSamplesAsyncOperation.prototype = new AsyncOperation();


function LoadSM2SoundsAsyncOperation(options) {
    LoadSamplesAsyncOperation.call(this, options);

}
LoadSM2SoundsAsyncOperation.prototype = new LoadSamplesAsyncOperation();

LoadSM2SoundsAsyncOperation.prototype.sm2Loaded = false;

LoadSM2SoundsAsyncOperation.prototype._bufferMap = {}; // Indexed by urls


LoadSM2SoundsAsyncOperation.prototype.start = function() {

    var that = this;


    if (!LoadSM2SoundsAsyncOperation.prototype.sm2Loaded) {

        // Load the script dynamically
        $.ajax("js/soundmanager2-nodebug-jsmin.js", {
            complete: function(jqXhr, textStatus) {
                if (textStatus == "success") {
                    $.globalEval(jqXhr.responseText);
                    // Setup the sound manager

                    soundManager.setup({
                        url: 'swf/',

                        onready: function() {
                            logit("Soundmanager is ready!!!");
                            LoadSM2SoundsAsyncOperation.prototype.sm2Loaded = true;
                            that.start();
                        }
                    });
                } else {
                    console.log("Could not load: " + textStatus);
                    that.failReason = "Unable to initialize player";
                    that.fail();
                }
            },
            type: 'GET'
        });
        return; // Start is called later
    }

    this.addProgress();

    function addBuffer(buffer, url, index) {
        LoadSM2SoundsAsyncOperation.prototype._bufferMap[url] = buffer;
        that.resultBuffers[index] = buffer;
        that.loadedCount++;

        var fractionDone = that.loadedCount / that.bufferUrls.length;
        var intProgress = Math.round(100 * fractionDone);

        that.updateProgress(intProgress);

        if (!that.cancelled) {
            if (that.loadedCount == that.bufferUrls.length) {
                that.success();
            }
        }
    }


    function loadBuffer(index) {
        var url = that.bufferUrls[index];

        var theBuffer = LoadSM2SoundsAsyncOperation.prototype._bufferMap[url];

        if (theBuffer) {
            addBuffer(theBuffer, url, index);
        } else {

            var sound = soundManager.createSound({
                id: url,
                url: url
            });
            sound.load();
            addBuffer(sound, url, index);

//            addBuffer(sound, url, index);
        }
    }

    try {

        if (that.bufferUrls.length > 0) {
            for (var i=0; i<this.bufferUrls.length; i++) {
                loadBuffer(i);
            }
        }
    } catch (ex) {
        that.failReason = "Error when loading samples";
        that.fail();
        throw ex;
    }
};



function LoadAudioBuffersAsyncOperation(options) {
    LoadSamplesAsyncOperation.call(this, options);

    this.audioContext = getValueOrDefault(options, "audioContext", null);
}
LoadAudioBuffersAsyncOperation.prototype = new LoadSamplesAsyncOperation();

LoadAudioBuffersAsyncOperation.prototype._bufferMap = {};

LoadAudioBuffersAsyncOperation.prototype.createBuffer = function(func, freq) {
    var buffer = this.context.createBuffer(1, this.context.sampleRate, this.context.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i=0; i<data.length; i++) {
        var frac = i / (data.length - 1);
        data[i] = 0.5 * func(frac * freq);
    }
    return buffer;
};


LoadAudioBuffersAsyncOperation.prototype.start = function() {

    var that = this;

    this.addProgress();

    var maxConcurrent = 1;

    function addBuffer(buffer, url, index) {
        LoadAudioBuffersAsyncOperation.prototype._bufferMap[url] = buffer;
        that.resultBuffers[index] = buffer;
        that.loadedCount++;

        var fractionDone = that.loadedCount / that.bufferUrls.length;
        var intProgress = Math.round(100 * fractionDone);

        that.updateProgress(intProgress);

        if (!that.cancelled) {
            if (that.loadedCount == that.bufferUrls.length) {
                that.success();
            } else {
                var nextIndex = index + maxConcurrent;
                if (nextIndex < that.bufferUrls.length) {
                    loadBuffer(nextIndex);
                }
            }
        }
    }


    function loadBuffer(index) {
        var url = that.bufferUrls[index];

        var theBuffer = LoadAudioBuffersAsyncOperation.prototype._bufferMap[url];

        if (theBuffer) {
            // Already found the buffer
//            logit("reusing buffer " + url);
            addBuffer(theBuffer, url, index);
        } else {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            request.onfail = function() {
                that.fail();
            };
            request.onload = function() {
                that.audioContext.decodeAudioData(request.response, function(buffer) {
                    addBuffer(buffer, url, index);
                }, function() {
                    that.fail();
                });
            };
            request.send();
        }
    }
    if (that.bufferUrls.length > 0) {
        for (var i=0; i<maxConcurrent; i++) {
            loadBuffer(i);
        }
    }

};



function AsyncServerChildTask(options) {
    AsyncOperation.call(this, options);
    this.taskType = getValueOrDefault(options, "taskType", AsyncServerChildTaskType.RENDER);
    this.user = getValueOrDefault(options, "user", "guest");
    this.content = getValueOrDefault(options, "content", {});

    switch (this.taskType) {
        case AsyncServerChildTaskType.EXPORT_MIDI:
        case AsyncServerChildTaskType.EXPORT_MP3:
        case AsyncServerChildTaskType.EXPORT_OGG:
        case AsyncServerChildTaskType.RENDER:
            this.requireLogin = false;
            break;
    }

    this.resultUrl = null;
    this.resultRenderData = null;
    this.resultRenderDataLength = 1;
    this.resultSongStructureInfo = null;
    this.resultSectionTimes = null;
    this.resultChannelMaps = null;

    this.taskName = null; // Received from server
}
AsyncServerChildTask.prototype = new AsyncOperation();


AsyncServerChildTask.prototype.cancel = function() {
    AsyncOperation.prototype.cancel.call(this);

    var message = {
        type: "cancelTask",
        taskName: this.taskName
    };

    var that = this;
    $.ajax("task", {
        data: JSON.stringify(message),
        contentType: "application/json",
        complete: function(jqXhr, textStatus) {
            if (textStatus == "success") {
                var response = $.parseJSON(jqXhr.responseText);
//                logit(" Received task name " + that.taskName);
            } else {
                console.log("Task cancel ajax complete. Text status not success: " + textStatus);
            }
        },
        type: 'POST'
    });

};


AsyncServerChildTask.prototype.update = function() {
    if (this.cancelled || this.done) {
        return;
    }

    // Get progress reports from server
    var message = {
        type: "getTaskProgress",
        taskType: this.taskType,
        taskName: this.taskName
    };

    if (this.taskName && !this.done) {
        var that = this;
        $.ajax("task", {
            data: JSON.stringify(message),
            contentType: "application/json",
            complete: function(jqXhr, textStatus) {

                if (that.done) {
                    return; // A result that comes after the task is done, just ignore it
                }

                if (textStatus == "success") {

                    var response = $.parseJSON(jqXhr.responseText);

//                    logit(" received progress result: " + jqXhr.responseText);

                    if (response.type == "progress") {

                        var intProgress = Math.round(100 * response.progress);

                        that.updateProgress(intProgress);
                        if (response.progress == 1 && (response.result || response.resultUrl)) {
                            if (response.resultUrl) {
//                            <audio controls="controls">
//                                <source src="horse.ogg" type="audio/ogg">
//                                    <source src="horse.mp3" type="audio/mp3">
//                                    Your browser does not support the audio element.
//                                    </audio>

                                if (that.resultDivId) {
                                    var $resultDiv = $("#" + that.resultDivId);

                                    var addAudioElement = true;

                                    var audioType = "audio/mp3";

                                    switch (that.taskType) {
                                        case AsyncServerChildTaskType.EXPORT_MP3:
                                            addAudioElement = true;
                                            audioType = "audio/mp3";
                                            break;
                                        case AsyncServerChildTaskType.EXPORT_OGG:
                                            addAudioElement = true;
                                            audioType = "audio/ogg";
                                            break;
                                        case AsyncServerChildTaskType.EXPORT_WAV:
                                        case AsyncServerChildTaskType.EXPORT_MIDI:
                                        case AsyncServerChildTaskType.RENDER:
                                            addAudioElement = false;
                                            break;
                                    }

                                    var audioElementHtml = "";
                                    if (addAudioElement) {
                                        audioElementHtml = "<audio style=\"width: 20em; height: 3em; \" class=\"audio-player\" controls=\"controls\" preload=\"none\" >" +
                                            "<source src=\"" + response.resultUrl + "\" type=\"" + audioType + "\" />" +
                                            "</audio>";
                                    }

                                    var removeButtonId = response.resultUrl.replace(/\/|\./g, "_") + "_button";
                                    var resultDivId = response.resultUrl.replace(/\/|\./g, "_") + "_div";

                                    var $theResult = $("<div style=\"display: none\" " +
                                        "class=\"ui-widget-content ui-corner-all progress-component\" " +
                                        "id=\"" + resultDivId + "\" >" +
                                        audioElementHtml +
                                        "<a class=\"result-url\" href=\"" + response.resultUrl + "\" target=\"_blank\" >Result Link</a>" +
                                        "<button id=\"" + removeButtonId + "\">Remove</button>" +
                                        "</div>");
                                    $resultDiv.prepend($theResult);
                                    $("#" + removeButtonId).button().click(function() {
                                        $("#" + resultDivId).detach();
//                                    logit("dhflks6djf");
                                    });
                                    $theResult.show("slow");

                                    if (addAudioElement) {
                                        that.$audioElement = $theResult.find("audio");
                                    }
                                }

//                                that.addResultUrl(response.resultUrl);
                            }
                            if (response.result) {
                                that.resultRenderData = response.result.renderData;
                                that.resultRenderDataLength = response.result.renderDataLength;
                                that.resultSongStructureInfo = response.result.songStructureInfo;
                                that.resultChannelMaps = response.result.channelMaps;
                                that.resultSectionTimes = response.result.sectionTimes;
                            }
                            that.success();
                        }
                    } else if (response.type == "error") {
                        if (!that.done) {

                            that.failReason = "Unable to get progress";
                            logit(response);
                            that.fail();
                        }
                    } else {

                        logit("Ignoring result from getTaskProgress");
                        logit(response);
                    }

                } else {
                    console.log("Task progress ajax complete. Text status not success: " + textStatus);
                    that.fail();
                }
            },
            type: 'POST'
        });
    }
};

AsyncServerChildTask.prototype.start = function() {

    var message = {
        type: "startTask",
        taskType: this.taskType,
        user: this.user,
        content: this.content
    };

    var that = this;
    $.ajax("task", {
        data: JSON.stringify(message),
        contentType: "application/json",
        complete: function(jqXhr, textStatus) {
            if (textStatus == "success") {
                var response = $.parseJSON(jqXhr.responseText);
                if (response.type == "error") {
                    that.failReason = response.message;
                    that.fail();
                }
//                logit(response);

                that.taskName = response.taskName;
//                logit(" Received task name " + that.taskName);
            } else {
                that.fail();
                console.log("Task start ajax complete. Text status not success: " + textStatus);
            }
        },
        type: 'POST'
    });

    this.addProgress();

};


function AsyncWorkerTask(options) {
    AsyncOperation.call(this, options);

    this.requireLogin = false;

    this.taskType = getValueOrDefault(options, "taskType", WorkerTaskType.RENDER);
    this.content = getValueOrDefault(options, "content", {});

    this.transferableSupported = false;

    this.resultRenderData = null;
    this.resultRenderDataLength = 1;
    this.resultSongStructureInfo = null;
    this.resultChannelMaps = null;
    this.resultSectionTimes = null;

    this.progress = 0;

    var script = 'js/worker.js';

    this.worker = new Worker(script);
    this.worker.postMessage({});

    var that = this;

    var testBuf = new ArrayBuffer(1);
    try {
        this.worker.postMessage(testBuf, [testBuf]);
        if (testBuf.byteLength) {
            // Not supported
        } else {
//        logit("Transferable supported!!!!");
//            this.transferableSupported = true;
        }
    } catch (exc) {
        logit("Exception thrown when trying to post message to worker.");
    }

    function padNumberString(number, length) {
        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }

    function getFilenamePrefix() {
        var date = new Date();
        var songName = "song";
        return songName + "_" +
            padNumberString(date.getUTCFullYear(), 4) + "" +
            padNumberString(date.getUTCMonth() + 1, 2) + "" + // utc month starts at zero :)
            padNumberString(date.getUTCDate(), 2) + "_" +
            padNumberString(date.getUTCHours(), 2) + "" +
            padNumberString(date.getUTCMinutes(), 2) + "" +
            padNumberString(date.getUTCSeconds(), 2) + "_" +
            padNumberString(date.getUTCMilliseconds(), 3);
    }

    var onWorkerMessage = function(e) {
        var msg = e.data;

        var type = msg.type;

        if (type) {
            switch (type) {
                case "log":
                    console.log(msg.data);
                    break;
                case "error":
                    that.failReason = msg.data;
                    that.fail();
                    that.worker.terminate();
                    break;
                case "result":
                    var result = JSON.parse(msg.data);
                    that.resultRenderData = result.renderData;
                    that.resultRenderDataLength = result.renderDataLength;
                    that.resultChannelMaps = result.channelMaps;
                    that.resultSongStructureInfo = result.songStructureInfo;
                    that.resultSectionTimes = result.sectionTimes;

                    if (that.taskType == WorkerTaskType.EXPORT_MIDI || that.taskType == WorkerTaskType.EXPORT_WAV) {
//                    logit(result.midiData);

                        var buffer = null;
                        var extension = ".mid";

                        var addAudioElement = false;
                        var audioType = "audio/wav";

                        switch (that.taskType) {
                            case WorkerTaskType.EXPORT_MIDI:
                                var fakeByteArray = new FakeByteArray();
                                Midi.encodeMidi(result.midiData, fakeByteArray);
                                buffer = fakeByteArray.toBuffer();
//                                addAudioElement = true;
//                                audioType = "audio/midi";
                                break;
                            case WorkerTaskType.EXPORT_WAV:
                                if (!that.resultBuffer) {
                                    logit("Expected a result buffer from the worker before the result message");
                                }
                                buffer = that.resultBuffer;
                                extension = ".wav";
                                addAudioElement = true;
                                audioType = "audio/wav";
                                break;
                        }

                        if (buffer) {

                            var blob = new Blob([new Uint8Array(buffer)]);

                            var resultUrl = window.URL.createObjectURL(blob);

                            var audioElementHtml = "";

                            if (addAudioElement) {
                                if (addAudioElement) {
                                    audioElementHtml = "<audio style=\"width: 20em; height: 3em; \" class=\"audio-player\" controls=\"controls\" preload=\"none\" >" +
                                        "<source src=\"" + resultUrl + "\" type=\"" + audioType + "\" />" +
                                        "</audio>";
                                }
                            }

                            var removeButtonId = that.id + "_result_remove_button";
                            var loadButtonId = that.id + "_result_load_button";
                            var resultDivId = that.id + "_result_div";

                            var $resultDiv = $("#" + that.resultDivId);

//                    var resultUrl = "";

                            var downloadName = getFilenamePrefix() + extension;

                            var extraHint = "";
                            var a = document.createElement('a');
                            if (typeof a.download === "undefined") {
                                extraHint = '<div>You need to "save link target as" and ensure that the filename ends with "' + extension + '"</div>';
                            }

                            var $theResult = $("<div style=\"display: none\" " +
                                "class=\"ui-widget-content ui-corner-all progress-component\" " +
                                "id=\"" + resultDivId + "\" >" +
                                audioElementHtml +
                                "<a class=\"result-url\" " +
                                'download="' + downloadName + '" ' +
                                "href=\"" + resultUrl + "\" " +
                                "target=\"_blank\" >Result Link</a>" +
                                "<button id=\"" + removeButtonId + "\">Remove</button>" +
                                "<button id=\"" + loadButtonId + "\">Load</button>" +
                                extraHint +
                                "</div>");
                            $resultDiv.prepend($theResult);
                            $("#" + removeButtonId).button().click(function() {
                                $("#" + resultDivId).detach();
                            });
                            $("#" + loadButtonId).button().click(function() {
                                updateSongSettingsComponent(that.content.genInfo, {name: that.content.name, seed: "" + that.content.strSeed});
                                afterExport(that);
                            });
                            $theResult.show("slow");

                            if (addAudioElement) {
                                that.$audioElement = $theResult.find("audio");
                            }

                        } else {
                            logit("Could not create wav blob...");
                        }

                    }
                    that.worker.removeEventListener('message', onWorkerMessage);
                    that.worker.terminate();
                    that.success();
                    break;
                case "progressReport":
                    that.progress = Math.round(100 * parseFloat(msg.progress));
//                console.log("Setting progress to " + that.progress);
//                that.updateProgress()
                    break;
            }

        } else {
            // Assuming that it is a buffer
            that.resultBuffer = msg;
        }

    };

    this.worker.addEventListener('message', onWorkerMessage, false);

}
AsyncWorkerTask.prototype = new AsyncOperation();



AsyncWorkerTask.prototype.cancel = function() {
    AsyncOperation.prototype.cancel.call(this);

    var message = {
        type: "cancelTask"
    };
//    this.worker.postMessage(message);
};


AsyncWorkerTask.prototype.update = function() {
    if (this.cancelled || this.done) {
        return;
    }
    if (!this.done) {
        this.updateProgress(this.progress);
    }
};

AsyncWorkerTask.prototype.start = function() {

    var message = {
        type: "startTask",
        transferableSupported: this.transferableSupported,
        taskType: this.taskType,
        content: this.content
    };

    this.worker.postMessage(message);

    this.addProgress();

};



