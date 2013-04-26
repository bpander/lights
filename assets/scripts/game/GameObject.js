define([
], function (
) {
    "use strict";

    var GameObject = function () {

        this.game = null;

        this.x = -1;

        this.y = -1;

    };

    GameObject.prototype.update = function () {
        throw 'Error: update function not implemented';
    };

    GameObject.prototype.render = function () {
        throw 'Error: render function not implemented';
    };

    GameObject.prototype.addTo = function (game) {
        game.add(this);
        return this;
    };

    return GameObject;
});