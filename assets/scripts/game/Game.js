define([
    'game/Keyboard',
    'models/Sparticle',
    'models/Light',
    'models/Ring'
], function (
    Keyboard,
    Sparticle,
    Light,
    Ring
) {
    "use strict";

    var Game = {

        canvas: null,

        ctx: null,

        width: -1,

        heigh: -1,

        assets: [
            {
                id: 'ding',
                type: 'audio',
                path: 'assets/audio/shiny-ding',
                data: null
            },
            {
                id: 'ding-low',
                type: 'audio',
                path: 'assets/audio/shiny-ding-low',
                data: null
            },
            {
                id: 'tibetan-dream',
                type: 'audio',
                path: 'assets/audio/tibetan-dream',
                data: null
            },
            {
                id: 'night-scene',
                type: 'image',
                path: 'assets/images/night-scene.jpg'
            }
        ]

    };

    var CANVAS_ID = 'game-canvas';

    var _gameObjects = [];

    var _garbage = [];

    var _animRequestId = -1;

    var _collectGarbage = function () {
        var i = _garbage.length;
        var j;
        var currentGarbageObject = null;
        while (i--) {
            currentGarbageObject = _garbage[i];
            j = _gameObjects.length;
            while (j--) {
                if (currentGarbageObject === _gameObjects[j]) {
                    _gameObjects.splice(j, 1);
                    break;
                }
            }
        }
        return this;
    };

    var _onKey = function (e) {
        var keyCode = e.keyCode;
        var disabledKeys = this.keyboard.KEY;
        var friendlyKey;
        for (friendlyKey in disabledKeys) {
            if (e.keyCode === disabledKeys[friendlyKey]) {
                e.preventDefault();
            }
        }
    };

    var _onFocus = function () {
        $(this.canvas).focus();
    };

    Game.init = function () {
        this.canvas = document.getElementById(CANVAS_ID);
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.keyboard = new Keyboard();
        this.render = this.render.bind(this);

        _onKey = _onKey.bind(this);
        _onFocus = _onFocus.bind(this);
        $(document).on('keypress keydown keyup', _onKey);
        $('#evil-button').on('focus', _onFocus);

        this.populateScene();
        this.render();
    };

    Game.populateScene = function () {
        // Play music
        var music = this.getAssetById('tibetan-dream').data;
        music.loop = true;
        music.play();

        // Create the sparticle
        var sparticle = new Sparticle();
        sparticle.x = 50;
        sparticle.y = 50;

        // Create the lights
        var light;
        var numLights = $(document.getElementById('num-lights-input')).val();
        var i = numLights;
        while (i--) {
            light = new Light();
            light.x = Math.random() * this.width;
            light.y = Math.random() * 300;
            this.add(light);
        }

        light = new Light();
        light.x = 240;
        light.y = 300;

        // Add them to the scene
        this.add(sparticle);//.add(light);
    };

    Game.add = function (gameObject) {
        _gameObjects.push(gameObject);
        gameObject.game = this;
        return this;
    };

    Game.remove = function (gameObject) {
        _garbage.push(gameObject);
    };

    Game.render = function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.drawImage(this.getAssetById('night-scene').data, 0, 0);
        var gameObject;
        var l = _gameObjects.length;
        var i = 0;
        for (; i < l; i++) {
            gameObject = _gameObjects[i];
            gameObject.update();
            gameObject.render();
        }
        _collectGarbage();
        _animRequestId = requestAnimFrame(this.render);
    };

    Game.getAssetById = function (assetId) {
        var asset;
        var i = this.assets.length;
        while (i--) {
            asset = this.assets[i];
            if (asset.id === assetId) {
                return asset;
            }
        }
        return null;
    };

    Game.getRings = function () {
        var rings = [];
        var gameObject;
        var i = _gameObjects.length;
        while (i--) {
            gameObject = _gameObjects[i];
            if (gameObject instanceof Ring) {
                rings.push(gameObject);
            }
        }
        return rings;
    };

    Game.reset = function () {
        this.exit();
        this.init();
    };

    Game.exit = function () {
        $(document).on('keypress keydown keyup', _onKey);
        $('#evil-button').on('focus', _onFocus);
        _gameObjects = [];
        cancelAnimFrame(_animRequestId);
    };

    return Game;
});