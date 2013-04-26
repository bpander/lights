define([
    'game/GameObject',
    'models/Ring',
    'models/Timer',
    'lib/Util'
], function (
    GameObject,
    Ring,
    Timer,
    Util
) {
    "use strict";

    var Light = function () {

        this.radius = 100;

        this.ringIsReady = true;

    };
    Light.prototype = new GameObject();
    Light.prototype.constructor = Light;

    var _color = {
        r: 255,
        g: 240,
        b: 175
    };

    Light.prototype.createGradient = function () {
        var gradient = this.game.ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius
        );
        gradient.addColorStop(0.03, Util.rgba(_color.r, _color.g, _color.b, 1));
        gradient.addColorStop(0.05, Util.rgba(_color.r, _color.g, _color.b, 0.1));
        gradient.addColorStop(1, Util.rgba(_color.r, _color.g, _color.b, 0));

        return gradient;
    };

    Light.prototype.update = function () {
        var rings = this.game.getRings();
        var ring;
        var point;
        var circle;
        var i = rings.length;
        while (i--) { 
            ring = rings[i];
            if (this.ringIsReady && ring.containsPoint(this.x, this.y) && !ring.hasTriggeredLight(this)) {
                this.triggerBy(ring);
            }
        }
    };

    Light.prototype.render = function () {
        var ctx = this.game.ctx;

        ctx.fillStyle = this.createGradient();
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Util.TAU, true);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
    };

    Light.prototype.triggerBy = function (ring) {
        this.ringIsReady = false;
        var self = this;
        new Timer(3000).done(function () {
            self.ringIsReady = true;
        }).addTo(this.game);
        ring.triggered(this);
        this.createRing().triggered(this);
    };

    Light.prototype.createRing = function () {
        var ring = new Ring();
        ring.sound = this.game.getAssetById('ding-low').data.cloneNode();
        ring.sound.volume = Math.random() * 0.5;
        ring.sound.play();
        ring.color = {
            r: Math.round(Math.random() * 255),
            g: Math.round(Math.random() * 255),
            b: Math.round(Math.random() * 255)
        };
        ring.x = this.x;
        ring.y = this.y;
        this.game.add(ring);
        return ring;
    };

    return Light;
});