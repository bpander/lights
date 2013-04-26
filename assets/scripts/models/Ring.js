define([
    'lib/Util'
], function (
    Util
) {
    "use strict";

    var Ring = function () {
        this.radius = 10;
        this.alpha = 1;
        this.sound = null;
        this.color = {
            r: 200,
            g: 255,
            b: 150
        };
        this.triggeredLights = [];
    };

    Ring.prototype.createGradient = function () {
        var gradient = this.game.ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius
        );
        gradient.addColorStop(0,   Util.rgba(this.color.r, this.color.g, this.color.b, 0));
        gradient.addColorStop(0.7, Util.rgba(this.color.r, this.color.g, this.color.b, 0.25));
        gradient.addColorStop(0.9, Util.rgba(225, 255, 200, 0.5));
        gradient.addColorStop(1,   Util.rgba(this.color.r, this.color.g, this.color.b, 0));

        return gradient;
    };

    Ring.prototype.update = function () {
        this.radius = this.radius + (1 / this.radius * 200);
        if (this.radius > 150) {
            if (this.alpha > 0) {
                this.alpha = this.alpha - 0.025;
            }
            if (this.alpha < 0) {
                this.alpha = 0;
                this.game.remove(this);
            }
        }
    };

    Ring.prototype.render = function () {
        var ctx = this.game.ctx;

        ctx.fillStyle = this.createGradient();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Util.TAU, true);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
    };

    Ring.prototype.containsPoint = function (x, y) {
        var withinRadius = Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2);
        var withinOuterRadius = withinRadius < Math.pow(this.radius, 2);
        var withinInnerRadius = withinRadius < Math.pow(this.radius - 10, 2);
        return withinOuterRadius && !withinInnerRadius;
    };

    Ring.prototype.hasTriggeredLight = function (light) {
        return this.triggeredLights.indexOf(light) !== -1;
    };

    Ring.prototype.triggered = function (light) {
        this.triggeredLights.push(light);
    };

    return Ring;
});