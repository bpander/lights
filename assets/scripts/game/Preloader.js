define([
    'lib/Util'
], function (
    Util
) {
    "use strict";

    var Preloader = function () {};

    var _numAssets = 0;

    var _numAssetsLoaded = 0;

    var _percentComplete = 0;

    var _triggerProgress = function () {
        _numAssetsLoaded++;
        _percentComplete = _numAssetsLoaded / _numAssets;
        _onProgress(_percentComplete);
        if (_percentComplete === 1) {
            _onDone();
        }
    };

    var _onProgress = Util.noop;

    var _onDone = Util.noop;

    Preloader.prototype.load = function (assets) {
        _numAssets = assets.length;
        var asset;
        var i = 0;
        for (; i < _numAssets; i++) {
            asset = assets[i];
            switch (asset.type) {
                case 'audio':
                    AudioLoader.load(asset);
                    break;
                case 'image':
                    ImageLoader.load(asset);
                    break;

                default:
                    throw 'Error: no loader found for asset type ' + asset.type;
            }
        }
        return this;
    };

    Preloader.prototype.progress = function (fn) {
        _onProgress = fn.bind(this);
        return this;
    };

    Preloader.prototype.done = function (fn) {
        _onDone = fn.bind(this);
        return this;
    };

    var AudioLoader = (function () {

        var AudioLoader = {};

        var _extension = Util.getAudioSupport().mp3 ? '.mp3' : '.wav';

        AudioLoader.load = function (asset) {
            var onCanPlay = function () {
                asset.data.removeEventListener('canplay', onCanPlay);
                _triggerProgress();
            };
            var onError = function () {
                asset.data.removeEventListener('error', onError);
                throw 'Error: could not load asset ' + asset.path;
            };
            asset.data = document.createElement('audio');
            asset.data.src = asset.path + _extension;
            asset.data.addEventListener('canplay', onCanPlay);
            asset.data.addEventListener('error', onError);
        };

        return AudioLoader;
    }());

    var ImageLoader = (function () {

        var ImageLoader = {};

        ImageLoader.load = function (asset) {
            asset.data = new Image();
            asset.data.src = asset.path;
            asset.data.onload = _triggerProgress();
        }

        return ImageLoader;
    }());

    return Preloader;
});