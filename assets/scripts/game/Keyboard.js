define([
    'lib/Util'
], function (
    Util
) {
    "use strict";

    var Keyboard = function () {

        this.KEY = {
            LEFT_ARROW: 37,
            UP_ARROW: 38,
            RIGHT_ARROW: 39,
            DOWN_ARROW: 40,
            SPACE_BAR: 32
        };

        this.init();
    };

    var _keysDown = [];

    var _events = {

        onKeyDown: function(e) {
            if (_keysDown.indexOf(e.keyCode) < 0) {
                _keysDown.push(e.keyCode);
            }
        },

        onKeyUp: function(e) {
            var index = _keysDown.indexOf(e.keyCode);
            _keysDown.splice(index, 1);
        }
    };

    Keyboard.prototype.init = function () {
        Util.bindAll(_events, this);
        document.addEventListener('keydown', _events.onKeyDown);
        document.addEventListener('keyup', _events.onKeyUp);
    };

    Keyboard.prototype.isKeyDown = function (keyCode) {
        return _keysDown.indexOf(keyCode) !== -1;
    };

    return Keyboard;
});