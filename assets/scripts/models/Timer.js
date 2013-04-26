define([
    'game/GameObject',
    'lib/Util'
], function (
    GameObject,
    Util
) {
    "use strict";

    /**
     * @param {Number}   delayInMs 
     * @param {Function} callback  
     */
    var Timer = function (delayInMs) {
        this.delayInFrames = _msToFrames(delayInMs);
        this.currentFrame = 0;
        this._onDone = Util.noop;
        this._onProgress = Util.noop;
    };
    Timer.prototype = new GameObject();

    var _msToFrames = function (ms) {
        return Math.round(ms / 16.67);
    };

    Timer.prototype.done = function (fn) {
        this._onDone = fn.bind(this);
        return this;
    };

    Timer.prototype.progress = function (fn) {
        this._onProgress = fn.bind(this);
        return this;
    }

    Timer.prototype.reset = function () {
        this.currentFrame = 0;
    };

    Timer.prototype.update = function () {
        this.currentFrame = this.currentFrame + 1;
        var progress = this.currentFrame / this.delayInFrames;
        this._onProgress(progress);
        if (progress === 1) {
            this._onDone();
            this.game.remove(this);
        }
    };

    Timer.prototype.render = Util.noop;

    return Timer;
});