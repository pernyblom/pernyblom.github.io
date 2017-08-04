

function gatherEventsWithType(events, type) {
    var result = [];
    for (var i=0; i<events.length; i++) {
        var e = events[i];

//        console.log(e);
        if (e.y == type) {
            result.push(e);
        }
    }
    return result;
}

function beatsToSeconds(beats, tempo) {
    return 60.0 * (beats / tempo);
};


function secondsToBeats(seconds, tempo) {
    return seconds * tempo / 60.0;
}

function predictBeat(tempoEvents, time) {

    var currentTempo = 120;

    var currentSeconds = 0;
    var prevSeconds = 0;

    var currentBeat = 0;

    for (var i=0; i<tempoEvents.length; i++) {
        prevSeconds = currentSeconds;

        var e = tempoEvents[i];

        var beatStep = e.t - currentBeat;

        var secondsStep = beatsToSeconds(beatStep, currentTempo);

        if (time >= currentSeconds && time <= currentSeconds + secondsStep) {
            var timeFrac = (time - currentSeconds) / secondsStep;
            currentBeat += timeFrac * beatStep;
            currentSeconds += secondsStep * 2; // So we don't check true later
            break;
        }

        currentSeconds += secondsStep;
        currentBeat += beatStep;

        currentTempo = e.b;
    }
    if (time > currentSeconds) {
        var diff = time - currentSeconds;
        var dt = secondsToBeats(diff, currentTempo);
        currentBeat += dt;
    }
    return currentBeat;
}



// Events must be sorted
function gatherNotesFromEvents(events) {
    var notes = {};
    var notesDone = {};
    var allNotes = [];

    var currentTempo = 120;

    var currentTime = 0; // Seconds

    var currentBeat = 0;
    for (var i=0; i<events.length; i++) {
        var e = events[i];

//        console.log(e);

        var beatStep = e.t - currentBeat;
        if (beatStep < 0) {
            logit("The events must be sorted " + beatStep);
        }
        var timeStep = beatsToSeconds(beatStep, currentTempo);
        currentTime += timeStep;
        switch (e.y) { // The compressed format
            case "c":
                e.seconds = currentTime;
                break;
            case "n":
                var current = notes[e.c];
                if (!current) {
                    current = [];
                    notes[e.c] = current;
                }
                current.push({onEvent: e, onTime: currentTime});
//                logit(" event beat: " + e.t + " seconds: " + currentTime + " tempo: " + currentTempo);
                break;
            case "f":
                var current = notes[e.c];
                if (!current) {
                    logit("Found note off without noteOn");
                } else {
                    var minTimeData = null;
                    for (var j=0; j<current.length; j++) {
                        var c = current[j];
                        if (e.n == c.onEvent.n) {
                            if (!minTimeData || c.onEvent.t < minTimeData.onEvent.t) {
                                minTimeData = c;
                            }
                        }
                    }
                    if (!minTimeData) {
                        logit("Failed to find matching noteOn event");
                    } else {
                        minTimeData.offEvent = e;
                        minTimeData.offTime = currentTime;
                        var doneArr = notesDone[e.c];
                        if (!doneArr) {
                            doneArr = [];
                            notesDone[e.c] = doneArr;
                        }
                        doneArr.push(minTimeData);
                        allNotes.push(minTimeData);
                        arrayDelete(current, minTimeData);
//                    current.indexOf(minTimeData)
                    }
                }
                break;
            case "t":
                e.seconds = currentTime;
                var bpm = e.b;
                currentTempo = bpm;
                break;
            default:
                logit("Unknown event type " + e.y);
                break;
        }
        currentBeat = e.t;
    }
    return notesDone;

}