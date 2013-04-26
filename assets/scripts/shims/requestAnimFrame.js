window.requestAnimFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    (function () {
        var mspf = 1000 / 60;
        return function (callback) {
            return window.setTimeout(callback, mspf);
        }
    }());
;

window.cancelAnimFrame = window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    function (animRequestId) {
        clearTimeout(animRequestId);
    }
;
