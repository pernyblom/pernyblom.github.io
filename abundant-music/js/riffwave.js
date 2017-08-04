/* 
 * RIFFWAVE.js v0.03 - Audio encoder for HTML5 <audio> elements.
 * Copyleft 2011 by Pedro Ladaria <pedro.ladaria at Gmail dot com>
 *
 * Public Domain
 *
 * Changelog:
 *
 * 0.01 - First release
 * 0.02 - New faster base64 encoding
 * 0.03 - Support for 16bit samples
 *
 * Notes:
 *
 * 8 bit data is unsigned: 0..255
 * 16 bit data is signed: −32,768..32,767
 *
 */

var FastBase64 = {

    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encLookup: [],

    Init: function() {
        for (var i=0; i<4096; i++) {
            this.encLookup[i] = this.chars[i >> 6] + this.chars[i & 0x3F];
        }
    },

    Encode: function(src) {
        var len = src.length;
        var dst = '';
        var i = 0;
        while (len > 2) {
            n = (src[i] << 16) | (src[i+1]<<8) | src[i+2];
            dst+= this.encLookup[n >> 12] + this.encLookup[n & 0xFFF];
            len-= 3;
            i+= 3;
        }
        if (len > 0) {
            var n1= (src[i] & 0xFC) >> 2;
            var n2= (src[i] & 0x03) << 4;
            if (len > 1) n2 |= (src[++i] & 0xF0) >> 4;
            dst+= this.chars[n1];
            dst+= this.chars[n2];
            if (len == 2) {
                var n3= (src[i++] & 0x0F) << 2;
                n3 |= (src[i] & 0xC0) >> 6;
                dst+= this.chars[n3];
            }
            if (len == 1) dst+= '=';
            dst+= '=';
        }
        return dst;
    } // end Encode

}

FastBase64.Init();

var RIFFWAVE = function(data) {

    this.data = [];        // Array containing audio samples
    this.wav = [];         // Array containing the generated wave file
    this.dataURI = '';     // http://en.wikipedia.org/wiki/Data_URI_scheme

    this.header = {                         // OFFS SIZE NOTES
        chunkId      : [0x52,0x49,0x46,0x46], // 0    4    "RIFF" = 0x52494646
        chunkSize    : 0,                     // 4    4    36+SubChunk2Size = 4+(8+SubChunk1Size)+(8+SubChunk2Size)
        format       : [0x57,0x41,0x56,0x45], // 8    4    "WAVE" = 0x57415645
        subChunk1Id  : [0x66,0x6d,0x74,0x20], // 12   4    "fmt " = 0x666d7420
        subChunk1Size: 16,                    // 16   4    16 for PCM
        audioFormat  : 1,                     // 20   2    PCM = 1
        numChannels  : 2,                     // 22   2    Mono = 1, Stereo = 2...
        sampleRate   : 44100,                 // 24   4    8000, 44100...
        byteRate     : 0,                     // 28   4    SampleRate*NumChannels*BitsPerSample/8
        blockAlign   : 0,                     // 32   2    NumChannels*BitsPerSample/8
        bitsPerSample: 16,                    // 34   2    8 bits = 8, 16 bits = 16
        subChunk2Id  : [0x64,0x61,0x74,0x61], // 36   4    "data" = 0x64617461
        subChunk2Size: 0                      // 40   4    data size = NumSamples*NumChannels*BitsPerSample/8
    };

    function u32ToArray(i) {
        return [i&0xFF, (i>>8)&0xFF, (i>>16)&0xFF, (i>>24)&0xFF];
    }

    function u16ToArray(i) {
        return [i&0xFF, (i>>8)&0xFF];
    }

    function split16bitArray(data) {
        var r = [];
        var j = 0;
        var len = data.length;
        for (var i=0; i<len; i++) {
            r[j++] = data[i] & 0xFF;
            r[j++] = (data[i]>>8) & 0xFF;
        }
        return r;
    }

    this.toDataURI = function() {
        return 'data:audio/wav;base64,'+FastBase64.Encode(this.wav);
    };

    // dataView points to a buffer that contains an array of Int16
    this.create = function(dataView) {

        this.header.blockAlign = (this.header.numChannels * this.header.bitsPerSample) >> 3;
        this.header.byteRate = this.header.blockAlign * this.sampleRate;
        this.header.subChunk2Size = (dataView.byteLength / 2) * (this.header.bitsPerSample >> 3);
        this.header.chunkSize = 36 + this.header.subChunk2Size;

        var byteLength = 44 + dataView.byteLength;

        var resultBuffer = new ArrayBuffer(byteLength);
        var view = new DataView(resultBuffer);

        function setInt8Array(view, arr, offset) {
            for (var i=0; i<arr.length; i++) {
                view.setInt8(offset++, arr[i], true);
            }
            return offset;
        }

        function copyInt16Array(view, viewToCopy, offset) {
            var len = viewToCopy.byteLength / 2;
            for (var i=0; i<len; i++) {
                view.setInt16(offset, viewToCopy.getInt16(i * 2, true), true);
                offset += 2;
            }
            return offset;
        }


        var offset = 0;
        offset = setInt8Array(view, this.header.chunkId, offset);
        view.setUint32(offset, this.header.chunkSize, true); offset += 4;
        offset = setInt8Array(view, this.header.format, offset);
        offset = setInt8Array(view, this.header.subChunk1Id, offset);
        view.setUint32(offset, this.header.subChunk1Size, true); offset += 4;
        view.setUint16(offset, this.header.audioFormat, true); offset += 2;
        view.setUint16(offset, this.header.numChannels, true); offset += 2;
        view.setUint32(offset, this.header.sampleRate, true); offset += 4;
        view.setUint32(offset, this.header.byteRate, true); offset += 4;
        view.setUint16(offset, this.header.blockAlign, true); offset += 2;
        view.setUint16(offset, this.header.bitsPerSample, true); offset += 2;
        offset = setInt8Array(view, this.header.subChunk2Id, offset);
        view.setUint32(offset, this.header.subChunk2Size, true); offset += 4;
        offset = copyInt16Array(view, dataView, offset);

        this.buffer = resultBuffer;

//        this.wav = this.header.chunkId.concat(
//            u32ToArray(this.header.chunkSize),
//            this.header.format,
//            this.header.subChunk1Id,
//            u32ToArray(this.header.subChunk1Size),
//            u16ToArray(this.header.audioFormat),
//            u16ToArray(this.header.numChannels),
//            u32ToArray(this.header.sampleRate),
//            u32ToArray(this.header.byteRate),
//            u16ToArray(this.header.blockAlign),
//            u16ToArray(this.header.bitsPerSample),
//            this.header.subChunk2Id,
//            u32ToArray(this.header.subChunk2Size),
//            (this.header.bitsPerSample == 16) ? split16bitArray(this.data) : this.data
//        );

//        logit("Calculated length " + byteLength);
//        logit("Actual length " + offset);

        return resultBuffer;
    };


}; // end RIFFWAVE


