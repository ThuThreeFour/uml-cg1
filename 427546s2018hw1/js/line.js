/**
 * Globals
 * @type {{clickCount: number, enableRubberBandDraw: boolean, p0: {x: null, y: null}, p1: {x: null, y: null}}}
 */
var lineSeg = {
    clickCount: 0,
    enableRubberBandDraw: false,
    p0: {x: null,y: null },
    p1: {x: null,y: null }
};

/**
 * Wait for the DOM and everything else (files, images, etc.) to load
 */
$(document).ready(function(){

    var canvas = document.getElementById('lineCanvas');
    var context = canvas.getContext('2d');

    var clearBtn = document.getElementById('clearLineBtn');
    clearBtn.addEventListener('click', function (event) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        lineSeg.clickCount = 0;
    });

    canvas.addEventListener('click', function(event) {
        var mousePos = getMousePosition(canvas, event);

        if( lineSeg.clickCount === 0 ) {
            // console.log("Mouse position: " + mousePos.x + "," + mousePos.y);
            context.fillRect(mousePos.x, mousePos.y, 1, 1);
            lineSeg.p0.x = mousePos.x;
            lineSeg.p0.y = mousePos.y;
            lineSeg.clickCount++;
            lineSeg.enableRubberBandDraw = true;
        } else if( lineSeg.clickCount === 1 ) {
            lineSeg.clickCount = 0;
            lineSeg.enableRubberBandDraw = false;
        }
    });

    $("#lineCanvas").mousemove(function(event) {
        var mousePos = getMousePosition(canvas, event);
        console.log("Mouse position: " + mousePos.x + "," + mousePos.y);

        if( lineSeg.enableRubberBandDraw ) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            lineSeg.p1.x = mousePos.x;
            lineSeg.p1.y = mousePos.y;
            drawPoints(context, lineSeg.p0, lineSeg.p1, '#DC3445');
        }
    });
});



