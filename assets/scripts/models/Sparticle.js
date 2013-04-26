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

    var Sparticle = function () {

        this.radius = 100;

        this.vx = 0;

        this.vy = 0;

        this.gravity = 0.98;

        this.vxMax = 4;

        this.acceleration = 1;

        this.deceleration = 0.1;

    };
    Sparticle.prototype = new GameObject();
    Sparticle.prototype.constructor = Sparticle;

    var _isJumping = true;

    var _ringIsReady = true;

    Sparticle.prototype.createGradient = function () {
        var gradient = this.game.ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius
        );
        gradient.addColorStop(0.01, 'rgba(175, 240, 255, 1)');
        gradient.addColorStop(0.07, 'rgba(175, 240, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(175, 240, 255, 0)');

        return gradient;
    };

    Sparticle.prototype.enableControl = function () {
        // Events.on(this, 'keydown', _events.onKeyDown);
        // Events.on(this, 'keyup', _events.onKeyUp);
    };

    Sparticle.prototype.moveLeft = function () {
        if (this.vx * -1 < this.vxMax) {
            this.vx = this.vx - this.acceleration;
        }
    };

    Sparticle.prototype.moveRight = function () {
        if (this.vx < this.vxMax) {
            this.vx = this.vx + this.acceleration;
        }
    };

    Sparticle.prototype.jump = function () {

    };

    Sparticle.prototype.createRing = function () {
        var ring = new Ring();
        ring.sound = this.game.getAssetById('ding').data.cloneNode();
        ring.sound.play();
        ring.x = this.x;
        ring.y = this.y;
        this.game.add(ring);
        _ringIsReady = false;
        new Timer(500).done(function () {
            _ringIsReady = true;
        }).addTo(this.game);
    }

    Sparticle.prototype.update = function () {
        var keyboard = this.game.keyboard;

        if (keyboard.isKeyDown(keyboard.KEY.RIGHT_ARROW)) {
            this.moveRight();
        }
        if (keyboard.isKeyDown(keyboard.KEY.LEFT_ARROW)) {
            this.moveLeft();
        }
        this.x = this.x + this.vx;
        if (Math.abs(this.vx) < 1) {
            this.vx = 0;
        } else {
            this.vx = this.vx * 0.75;
        }

        if (_ringIsReady && keyboard.isKeyDown(keyboard.KEY.SPACE_BAR)) {
            this.createRing();
        }

        if (!this.isJumping() && keyboard.isKeyDown(keyboard.KEY.UP_ARROW)) {
            _isJumping = true;
            this.vy = -10;
        }
        this.vy = this.vy + this.gravity;
        this.y = this.y + this.vy;
        if (this.y > 380) {
            this.y = 380;
            if (this.vy < 1) {
                this.vy = 0;
                _isJumping = false;
            } else {
                _isJumping = true;
                this.vy = this.vy * -0.33;
            }
        }
    };

    Sparticle.prototype.render = function () {
        var ctx = this.game.ctx;

        ctx.fillStyle = this.createGradient();
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Util.TAU, true);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
    };

    Sparticle.prototype.isJumping = function () {
        return _isJumping;
    };

    return Sparticle;
});