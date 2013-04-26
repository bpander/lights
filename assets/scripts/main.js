define([
    'game/Preloader',
    'game/Game',
    'jquery',
    'shims/requestAnimFrame'
], function (
    Preloader,
    Game
) {
    "use strict";

    $(function() {

        var preloader = new Preloader()
            .progress(function () {
            })
            .done(function () {
                Game.init();
                $('.settings-form').on('submit', function (e) {
                    e.preventDefault();
                    Game.reset();
                });
            })
            .load(Game.assets)
        ;
    });

});