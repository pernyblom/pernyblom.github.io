
function PerfTimer(name) {
    this.name = name;
    this.lastStartTime = 0;
    this.totalTime = 0;
    this.intervals = 0;
}

PerfTimer.prototype.report = function() {
    console.log("PerfTimer " + this.name + " total time: " + this.totalTime + " time per interval: " + (this.totalTime / this.intervals) + " intervals: " + this.intervals);
};


PerfTimer.prototype.start = function() {
    this.lastStartTime = Date.now();
};



PerfTimer.prototype.pause = function() {
    var now = Date.now();
    var diff = now - this.lastStartTime;
    this.intervals++;
    this.totalTime += diff;
    this.lastStartTime = now;
};



var moduleConstructTimer = new PerfTimer("module construct");
var composeTimer = new PerfTimer("compose");

var harmonyTimer = new PerfTimer("harmony");
var voiceLeadingTimer = new PerfTimer("voice leading");
var voiceLeadingPrepareTimer = new PerfTimer("voice leading prepare");
var figurationTimer = new PerfTimer("figuration");

var perfTimer1 = new PerfTimer("timer 1");
var perfTimer2 = new PerfTimer("timer 2");
var perfTimer3 = new PerfTimer("timer 3");



