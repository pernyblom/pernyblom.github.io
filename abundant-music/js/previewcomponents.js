function PreviewComponent() {
    JQueryComponent.call(this);
    this.previewOnShow = true;
    this.object = null;
    this.propertyInfo = null;
    this.setUniqueId();
}

PreviewComponent.prototype = new JQueryComponent();

PreviewComponent.prototype.componentRemoved = function() {
    };

PreviewComponent.prototype.cleanAfterDelete = function(value) {
    };

PreviewComponent.prototype.gatherAlignmentInfo = function(info) {
    };

PreviewComponent.prototype.setAlignment = function(info) {
    };


PreviewComponent.prototype.appendPianoRollCanvas = function(options, $canvasContainer, withinDiv) {
    var pr = new PianoRoll(options);

    // Use the size of the piano roll to create a canvas
    var canvasWidth = pr.width;
    var canvasHeight = pr.height;

    var canvasString = "";
    if (withinDiv) {
        canvasString += "<div>";
    }
    canvasString += "<canvas width='" + canvasWidth + "' height='" + canvasHeight + "' ></canvas>";
    if (withinDiv) {
        canvasString += "</div>";
    }

    var $canvas = $(canvasString);

    $canvasContainer.append($canvas);

    var canvas = withinDiv ? $canvas.find("canvas").get(0) : $canvas.get(0);
    var ctx = canvas.getContext("2d");

    if (ctx) {
        pr.updateSize();
        pr.paint(0, 0, ctx);
    }

};


function CurvePreviewComponent() {
    PreviewComponent.call(this);
    this.canvasContext = null;

    this.sourceMinX = 0;
    this.sourceMaxX = 1;
    this.sourceMinY = -1;
    this.sourceMaxY = 1;

    this.canvasWidth = 400;
    this.canvasHeight = 300;
    
    this.targetMinX = 10;
    this.targetMaxX = this.canvasWidth - 10;
    this.targetMinY = 10;
    this.targetMaxY = this.canvasHeight - 10;

    this.otherCssClasses.push("ui-widget-content");
    this.otherCssClasses.push("curve-preview-component");
}

CurvePreviewComponent.prototype = new PreviewComponent();

CurvePreviewComponent.prototype.getHtmlContentBeforeChildren = function(resultArr) {
    resultArr.push("<div>");
    resultArr.push("<canvas id='" + this.id + "-canvas' width='" + this.canvasWidth + "' height='" + this.canvasHeight + "' ></canvas>");
    resultArr.push("</div>");
    resultArr.push("<button id='" + this.id + "-update-button' >Update</button>");
    resultArr.push("<button id='" + this.id + "-set-view-button' >Set View Rectangle</button>");
};

CurvePreviewComponent.prototype.jQueryCreated = function($localRoot) {
    JQueryComponent.prototype.jQueryCreated.call(this, $localRoot);

    var comp = this;

    var $canvas = this.$component.find("#" + this.id + "-canvas");
    var $updateButton = this.$component.find("#" + this.id + "-update-button");
    var $viewButton = this.$component.find("#" + this.id + "-set-view-button");

    $updateButton.button();
    $viewButton.button();

    $updateButton.on("click", function() {
        comp.paintPreview();
    });

    this.canvas = $canvas.get(0);
    this.canvasContext = this.canvas.getContext("2d");

    if (this.previewOnShow) {
        this.paintPreview();
    }
};

CurvePreviewComponent.prototype.paintPreview = function() {
    var ctx = this.canvasContext;
    var canvas = this.canvas;
    if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#00ff00";

        ctx.fillRect(0, 0, canvas.width, canvas.height);

        var module = this.propertyInfo.otherInfo.data;

        var curve = this.object;

        var targetHeight = this.targetMaxY - this.targetMinY;
        var targetWidth = this.targetMaxX - this.targetMinX;
        var sourceHeight = this.sourceMaxY - this.sourceMinY;
        var sourceWidth = this.sourceMaxX - this.sourceMinX;

        var first = true;
        ctx.beginPath();
        for (var i=this.targetMinX; i<=this.targetMaxX; i++) {
            var fractionX = (i - this.targetMinX) / targetWidth;
            
            var x = this.sourceMinX + fractionX * sourceWidth;
            var curveValue = curve.getValue(module, x);

            var fractionY = (curveValue - this.sourceMinY) / sourceHeight;
            var j = this.targetMinY + (targetHeight - targetHeight * fractionY);

            //            logit(i + "," + j + " ");
            if (first) {
                first = false;
                ctx.moveTo(i, j);
            } else {
                ctx.lineTo(i, j);
            }
        }
        ctx.stroke();
    }
};



function PianoRollPreviewComponent() {
    PreviewComponent.call(this);

    this.addUpdateButton = true;
    this.addPlayButton = false;
    this.addStopButton = false;
    
    this.pianoRollWithinDiv = false;
    
    this.$canvasContainer = null;

    this.previewNumerator = 4;
    this.previewDenominator = 4;

    this.otherCssClasses.push("ui-widget-content");
    this.otherCssClasses.push("piano-roll-preview-component");
}

PianoRollPreviewComponent.prototype = new PreviewComponent();


PianoRollPreviewComponent.prototype.paintPreview = function() {
    this.$canvasContainer.empty();

    var options = this.getPianoRollOptions();
    for (var i=0; i<options.length; i++) {
        this.appendPianoRollCanvas(options[i], this.$canvasContainer, this.pianoRollWithinDiv);
    }
};

PianoRollPreviewComponent.prototype.playPreview = function() {
};
PianoRollPreviewComponent.prototype.stopPreview = function() {
};

PianoRollPreviewComponent.prototype.getHtmlContentBeforeChildren = function(resultArr) {
    resultArr.push("<div>Preview</div>");
    resultArr.push("<div class='canvas-container-div' >");
    resultArr.push("</div>");
    if (this.addUpdateButton) {
        resultArr.push("<button id='" + this.id + "-update-button' >Update</button>");
    }
    if (this.addPlayButton) {
        resultArr.push("<button id='" + this.id + "-play-button' >Play</button>");
    }
    if (this.addStopButton) {
        resultArr.push("<button id='" + this.id + "-stop-button' >Stop</button>");
    }
};

PianoRollPreviewComponent.prototype.jQueryCreated = function($localRoot) {
    JQueryComponent.prototype.jQueryCreated.call(this, $localRoot);

    var comp = this;

    this.$canvasContainer = this.$component.find(".canvas-container-div");

    if (this.addUpdateButton) {
        var $updateButton = this.$component.find("#" + this.id + "-update-button");

        $updateButton.button();

        $updateButton.on("click", function() {
            comp.paintPreview();
        });
    }
    if (this.addPlayButton) {
        var $playButton = this.$component.find("#" + this.id + "-play-button");

        $playButton.button();

        $playButton.on("click", function() {
            comp.playPreview();
        });
    }
    if (this.addStopButton) {
        var $stopButton = this.$component.find("#" + this.id + "-stop-button");

        $stopButton.button();

        $stopButton.on("click", function() {
            comp.stopPreview();
        });
    }

    if (this.previewOnShow) {
        this.paintPreview();
    }
};


function RythmPreviewComponent() {
    PianoRollPreviewComponent.call(this);
    this.addPlayButton = true;
    this.addStopButton = true;
}

RythmPreviewComponent.prototype = new PianoRollPreviewComponent();



RythmPreviewComponent.prototype.getPianoRollOptions = function() {

    var rythm = this.object;
    var module = this.propertyInfo.otherInfo.data;


    var harmony = new ConstantHarmonicRythm([new ConstantHarmonyElement()]);
    // Create the rythm elements
    var elements = rythm.getNoteRythmElements(module, harmony, 0);

    // Create some notes that have the same length as the rythm
    var dummyChannel = new RenderChannel();
    dummyChannel.id = "dummyChannel";

    var renderData = new RenderData();
    var currentTime = 0;
    for (var i=0; i<elements.length; i++) {
        var element = elements[i];
        var beatLength = positionUnitToBeats(element.length, element.lengthUnit,
            this.previewNumerator, this.previewDenominator);
        //        logit("Beat length: " + beatLength + " element length: " + element.length + " unit: " + PositionUnit.toString(element.lengthUnit));
        if (!element.rest) {
            var noteOn = new NoteOnEvent(60, currentTime, 1.0, dummyChannel);
            var noteOff = new NoteOffEvent(60, currentTime + beatLength, 1.0, dummyChannel);
            renderData.addEvent(noteOn);
            renderData.addEvent(noteOff);
        }
        //        logit("Current time: " + currentTime + "<br />");
        currentTime += beatLength;
    }

    // Create a piano roll
    var options = {
        renderData: renderData,
        harmony: null,
        showKeys: false
    };
    return [options];
};



function MotifPreviewComponent() {
    PianoRollPreviewComponent.call(this);
}

MotifPreviewComponent.prototype = new PianoRollPreviewComponent();



MotifPreviewComponent.prototype.getPianoRollOptions = function() {

    var motif = this.object;
    var module = this.propertyInfo.otherInfo.data;

    var harmony = new ConstantHarmonicRythm([new ConstantHarmonyElement()]);

    var dummyChannel = new RenderChannel();
    dummyChannel.id = "dummyChannel";


    var mre = new MotifRenderElement();
    mre.voiceLine = "dummyVoiceLine";
    mre.motif = motif.id;

    var renderData = new RenderData();

    var voiceLine = new ConstantVoiceLine();
    voiceLine.id = "dummyVoiceLine";
    voiceLine.addVoiceLineElement(new ConstantVoiceLineElement());

    var state = new RenderState(module, renderData);
    state.constantHarmony = harmony;
    state.plannedVoiceLines = [voiceLine];

    mre.renderBatch(state);

    var options = {
        renderData: renderData,
        harmony: harmony,
        showKeys: true
    };
    return [options];
};


function PercussionMotifPreviewComponent() {
    PianoRollPreviewComponent.call(this);
}

PercussionMotifPreviewComponent.prototype = new PianoRollPreviewComponent();



PercussionMotifPreviewComponent.prototype.getPianoRollOptions = function() {

    var motif = this.object;
    var module = this.propertyInfo.otherInfo.data;

    var harmony = new ConstantHarmonicRythm([new ConstantHarmonyElement()]);

    var dummyChannel = new RenderChannel();
    dummyChannel.id = "dummyChannel";

    var mre = new PercussionMotifRenderElement();
    mre.motifs = [motif.id];

    var renderData = new RenderData();

    var state = new RenderState(module, renderData);
    state.constantHarmony = harmony;

    mre.renderBatch(state);

    // logit("Render data: " + renderData.events + " <br />");

    var options = {
        renderData: renderData,
        harmony: harmony,
        showKeys: true
    };
    return [options];
};



// Works for both harmonic rythms and harmony elements
function HarmonyPreviewComponent() {
    PianoRollPreviewComponent.call(this);
}

HarmonyPreviewComponent.prototype = new PianoRollPreviewComponent();


HarmonyPreviewComponent.prototype.getPianoRollOptions = function() {

    var harmony = this.object;
    
    var module = this.propertyInfo.otherInfo.data;

    var harmonyElements = harmony.getConstantHarmonyElements(module);

    var chr = new ConstantHarmonicRythm(
        harmonyElements);

    var dummyChannel = new RenderChannel();
    dummyChannel.id = "dummyChannel";

    var renderData = new RenderData();

    var currentTime = 0;
    for (var i=0;i<chr.getCount(); i++) {
        var che = chr.get(i);
        var beatLength = positionUnitToBeats(che.length, che.lengthUnit, che.tsNumerator, che.tsDenominator, null);

        var scaleIndices = che.getChordScaleIndices();

        for (var j=0; j<scaleIndices.length; j++) {
            var absNote = che.getAbsoluteNoteFromChordBassIndex(j);
            var noteOn = new NoteOnEvent(absNote, currentTime, 1.0, dummyChannel);
            var noteOff = new NoteOffEvent(absNote, currentTime + beatLength, 1.0, dummyChannel);
            renderData.addEvent(noteOn);
            renderData.addEvent(noteOff);
        }

        currentTime += beatLength;
    }

    var maxWidth = 800;
    var beatWidth = Math.round(Math.min(50, maxWidth / currentTime));

    var options = {
        renderData: renderData,
        harmony: chr,
        showKeys: true,
        beatWidth: beatWidth
    };
    return [options];
};



function SectionPreviewComponent() {
    PianoRollPreviewComponent.call(this);
    this.previewOnShow = false;
}

SectionPreviewComponent.prototype = new PianoRollPreviewComponent();


SectionPreviewComponent.prototype.getPianoRollOptions = function() {

    var section = this.object;
    var module = this.propertyInfo.otherInfo.data;

    var renderData = new RenderData();

    var state = new RenderState(module, renderData);
    state.section = section;
    state.sectionModifiers = [];

    section.renderBatch(state);

    var maxTime = renderData.getTimeLimits()[1];

    maxTime = Math.max(maxTime, state.constantHarmony.getBeatLength());

    if (maxTime <= 0) {
        maxTime = 4;
    }
    
    var maxWidth = 800;
    var beatWidth = Math.round(Math.min(50, maxWidth / maxTime));

    var options = {
        renderData: renderData,
        harmony: state.constantHarmony,
        showKeys: true,
        beatWidth: beatWidth
    };
    return [options];
};



function StructurePreviewComponent() {
    PianoRollPreviewComponent.call(this);
    this.pianoRollWithinDiv = true;
    this.previewOnShow = false;
}

StructurePreviewComponent.prototype = new PianoRollPreviewComponent();


StructurePreviewComponent.prototype.getPianoRollOptions = function() {

    var structure = this.object;
    var module = this.propertyInfo.otherInfo.data;

    var renderDatas = [];
    var harmonies = [];
    var result = [];

    var maxWidth = 800;
    var beatWidth = 50;

    for (var i=0; i<structure.references.length; i++) {
        var ref = structure.references[i];
        if (!ref.active) {
            continue;
        }
        var renderData = new RenderData();
        var state = new RenderState(module, renderData);

        ref.renderBatch(state);
        renderDatas.push(renderData);
        harmonies.push(state.constantHarmony);

        var maxTime = state.constantHarmony.getBeatLength();
        maxTime = Math.max(maxTime, renderData.getTimeLimits()[1]);
        if (maxTime <= 0) {
            maxTime = 4;
        }
        beatWidth = Math.min(beatWidth, Math.round(Math.min(50, maxWidth / maxTime)));
    }

    for (var i=0; i<renderDatas.length; i++) {
        var options = {
            renderData: renderDatas[i],
            harmony: harmonies[i],
            showKeys: true,
            beatWidth: beatWidth
        };
        result.push(options);
    }
    return result;
};


