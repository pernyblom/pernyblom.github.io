
var that = self;

function logit(str) {
    that.postMessage({type: "log", data: str});
}


importScripts("composeworkersource-min.js");

//importScripts("composeworkersource.js");

//importScripts("midisynthsourceconcat.js");

importScripts("riffwave.js", "midisynthsource.js", "midisynthenvelope.js", "midisynthfilter.js", "midisynthoscillator.js", "midisynthvoice.js", "midisynthinstrument.js", "midisynth.js");

importScripts("stacktrace.js");

function inputOk(genInfo, correct) {
    var valid = true;
    try {
        valid = validateValueWithSafeValue(genInfo, new GenInfo(), null, {"array": 1, "number": 1}, correct);
        if (!valid) {
            logit("Input validation failed");
        }
    } catch (exc) {
        logit("Input validation threw exception:");
        logit(exc.toString());
        valid = false;
    }
    return valid;
}

function render(data, progressMultiplier) {

    var content = data.content;

//                        logit("Worker is composing with seed " + content.seed);
    var seed = content.seed;
    var sectionIndex = content.sectionIndex;

    var rnd = new MersenneTwister(seed);
    var genInfo = content.genInfo;


    if (inputOk(genInfo, true)) {

        var resultObj = {};
        var maxSections = 40;
        var module = createTestModule(rnd.genrand_int31(), genInfo, resultObj);

        var midiRenderer = module.getSynthRenderer("midiRenderer");

        var result = {
            songStructureInfo: resultObj.songStructureInfo,
            seed: seed,
            channelMaps: midiRenderer.channelMaps,
            module: module
        };

        var renderData = new RenderData();
        var state = new RenderState(module, renderData);
        var structure = module.structures[0];
        if (structure.references.length > maxSections) {
            structure.references.length = maxSections;
        }
        var sectionTimes = [];
        structure.renderBatch(state, function(progress) {
            sectionTimes.push(state.sectionTime);
            that.postMessage({type: "progressReport", progress: progress * progressMultiplier});
        });
        renderData.sort();

        result.origRenderData = renderData;

        var netJson = renderData.toNetJSON();

        result.renderData = JSON.parse(netJson);
        result.renderDataLength = state.sectionTime;
        result.sectionTimes = sectionTimes;

        return result;

    }
    return null;
}


self.addEventListener('message', function(e) {

    try {

        var data = e.data;

        if (!data) {
            return; // Empty message
        }

        if (!data.type) {
            // Probably just testing for transferable object support
            return;
        }

        switch (data.type) {
            case "startTask":
                var taskType = data.taskType;
                switch (taskType) {
                    case 0:
//                        logit("Worker is composing...");

                        var result = render(data, 1);
                        if (result) {
                            delete result.origRenderData; // No use to us
                            delete result.module; // No use to us
                            self.postMessage({type: "progressReport", progress: 1});
                            self.postMessage({type: "result", data: JSON.stringify(result)});
                        } else {
                            self.postMessage({type: "error", data: "No result from render"});
                        }
                        break;
                    case 1: // Midi
                    case 2: // Wav
//                        logit("Worker is exporting midi...");


                        var progMult = taskType == 1 ? 1 : 0.5;

                        var result = render(data, progMult);
                        if (result) {
                            var midiRenderer = result.module.getSynthRenderer("midiRenderer");
                            var midiData = midiRenderer.getMidiData(result.origRenderData, result.module, data.content.genInfo);
                            result.midiData = midiData;

//                            logit("Result midi data " + JSON.stringify(result.midiData));

                            delete result.origRenderData; // No use to us now after midi has been rendered
                            delete result.module; // No use to us now after midi has been rendered

                            var that = self;
                            if (taskType == 2) {
                                // Render wav and send the buffer first
                                var options = {sampleFreq: 44100, channels: 2};
                                var synth = new MidiSynth(options);
                                var floatResult = synth.synthesizeBatch(result.midiData, function(progress) {
                                    that.postMessage({type: "progressReport", progress: 0.5 + 0.5 * progress});
                                });

                                var maxShort = (256 * 256) / 2 - 1;

                                var len = floatResult[0].length;

                                var dataView = new DataView(new ArrayBuffer(len * 4));

                                for (var i=0; i<len; i++) {
                                    var value = floatResult[0][i];
                                    dataView.setInt16(i * 4, Math.round(maxShort * value), true);
                                    var value = floatResult[1][i];
                                    dataView.setInt16(i * 4 + 2, Math.round(maxShort * value), true);
                                }

                                var rw = new RIFFWAVE();
                                var buffer = rw.create(dataView);
                                if (data.transferableSupported) {
//                                    logit("Using transferable!");
                                    self.postMessage(buffer, [buffer]);
                                } else {
                                    self.postMessage(buffer);
                                }
                            }
                            self.postMessage({type: "progressReport", progress: 1});
                            self.postMessage({type: "result", data: JSON.stringify(result)});

                        } else {
                            logit("Error, no result");
                            self.postMessage({type: "error", data: "No result from render"});
                        }
                        break;
                }
                break;
            case "cancelTask":
                break;
        }
//        self.close();
    } catch (exc) {
        logit("Exception in worker " + exc + " ");
        logit(printStackTrace({e: exc}).join("\n"));

        self.postMessage({type: "error", data: exc.toString()});
//        self.close();
    }
}, false);