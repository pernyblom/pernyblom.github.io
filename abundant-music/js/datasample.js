
function DataSample(options) {
//    this.id = "";
    this.likelihood = getValueOrDefault(options, "likelihood", 1);
    this.active = true;
    this._constructorName = "DataSample";
}

function IntDataSample(options) {
    DataSample.call(this, options);
    this.data = 0;
    this._constructorName = "IntDataSample";
}
IntDataSample.prototype = new DataSample();

function IntListDataSample(options) {
    DataSample.call(this, options);
    this.data = [];
    this._constructorName = "IntListDataSample";
}
IntListDataSample.prototype = new DataSample();

function IntList2DDataSample(options) {
    DataSample.call(this, options);
    this.data = [];
    this._constructorName = "IntList2DDataSample";
}
IntList2DDataSample.prototype = new DataSample();

function FloatDataSample(options) {
    DataSample.call(this, options);
    this.data = 0.0;
    this._constructorName = "FloatDataSample";
}
FloatDataSample.prototype = new DataSample();

function FloatListDataSample(options) {
    DataSample.call(this, options);
    this.data = [];
    this._constructorName = "FloatListDataSample";
}
FloatListDataSample.prototype = new DataSample();


function MidiProgramDataSample(options) {
    DataSample.call(this, options);
    this.data = getValueOrDefault(options, "data", MidiProgram.ACOUSTIC_GRAND_PIANO);
    this._constructorName = "MidiProgramDataSample";
}
MidiProgramDataSample.prototype = new DataSample();


function MidiDrumDataSample(options) {
    DataSample.call(this, options);
    this.data = getValueOrDefault(options, "data", MidiDrum.BASS_DRUM_1);
    this._constructorName = "MidiDrumDataSample";
}
MidiDrumDataSample.prototype = new DataSample();


function PhraseGroupTypeDataSample(options) {
    DataSample.call(this, options);
    this.data = getValueOrDefault(options, "data", SimpleModuleGeneratorPhraseGroupType.ANTECEDENT_CONSEQUENT);
    this._constructorName = "PhraseGroupTypeDataSample";
}
PhraseGroupTypeDataSample.prototype = new DataSample();

function ModulationTargetDataSample(options) {
    DataSample.call(this, options);
    this.data = getValueOrDefault(options, "data", DynamicHarmonyModulationTarget.MEDIANT);
    this._constructorName = "ModulationTargetDataSample";
}
ModulationTargetDataSample.prototype = new DataSample();


function SongPartStructureInfoDataSample(options) {
    DataSample.call(this, options);
    this.data = [new SongPartStructureInfo()]; //getValueOrDefault(options, "data", new SongPartStructureInfo());
    this._constructorName = "SongPartStructureInfoDataSample";
}
SongPartStructureInfoDataSample.prototype = new DataSample();
SongPartStructureInfoDataSample.prototype.data_allowedTypes = {"SongPartStructureInfo": 1};


function HarmonicPlanDataSample(options) {
    DataSample.call(this, options);
    this.data = [DynamicHarmonyModulationTarget.DOMINANT, DynamicHarmonyModulationTarget.SUBDOMINANT]; //getValueOrDefault(options, "data", new SongPartStructureInfo());
    this._constructorName = "HarmonicPlanDataSample";
}
HarmonicPlanDataSample.prototype = new DataSample();
