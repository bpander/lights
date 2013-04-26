define([
], function (
) {
    "use strict";

    var Util = {};

    Util.TAU = Math.PI * 2;

    Util.noop = function () {};

    Util.bindAll = function (object, thisArg) {
        var key;
        var value;
        for (key in object) {
            value = object[key];
            if (typeof value === 'function') {
                object[key] = value.bind(thisArg);
            }
        }
    };

    Util.rgba = function (r, g, b, a) {
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
    };

    Util.getAudioSupport = function () {
        var audio = document.createElement('audio');
        var support = {};
        support.ogg  = audio.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,'');
        support.mp3  = audio.canPlayType('audio/mpeg;').replace(/^no$/,'');
        support.wav  = audio.canPlayType('audio/wav; codecs="1"').replace(/^no$/,'');
        support.m4a  = (audio.canPlayType('audio/x-m4a;') || audio.canPlayType('audio/aac;')).replace(/^no$/,'');
        return support;
    };

    return Util;
});