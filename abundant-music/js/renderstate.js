

function RenderState(module, data) {
    this.module = module;
    this.data = data;

    // Time from the beginning at the start of the current rendered section
    this.sectionTime = 0;

    // The harmony for the previous and current section
    this.harmony = null;
    this.previousConstantHarmony = null;
    this.constantHarmony = null;

    // Specific harmonies for voice lines
    this.voiceLineHarmonies = {};

    // A reference to the current section
    this.section = null;
    this.sectionModifiers = null;

    this.voiceLines = null;

    // The planned voices for the previous and current section
    this.previousPlannedVoiceLines = null;
    this.plannedVoiceLines = null;

    this.sectionTempo = 60.0;

    this.renderLines = null;
    this.controlLines = null;

    this.renderChannel = null;
    this.controlChannel = null;
    this.controlSlotDatas = {}; // map from control channel id to SlotDatas for those channels
    this.controlSlotData = null;
}




