/**
 * Globals
 * @type {{clickCount: number, enableRubberBandDraw: boolean, p0: {x: null, y: null}, p1: {x: null, y: null}}}
 */
var lineSeg = {
    clickCount: 0,
    enableRubberBandDraw: false,
    p0: {x: null,y: null },
    p1: {x: null,y: null },
    points: [],
    currPoint: {x: null,y: null }
};

/**
 * Wait for the DOM and everything else (files, images, etc.) to load
 */
$(document).ready(function(){

    var canvas = document.getElementById('polylinesCanvas');
    var context = canvas.getContext('2d');
    var clearBtn = document.getElementById('clearPolylinesBtn');

    canvas.addEventListener('click', function(event) {
        var mousePos = getMousePosition(canvas, event);

        if( lineSeg.clickCount === 0 ) {
            // console.log("Mouse position: " + mousePos.x + "," + mousePos.y);
            context.fillRect(mousePos.x, mousePos.y, 1, 1);
            lineSeg.p0.x = mousePos.x;
            lineSeg.p0.y = mousePos.y;
            lineSeg.points.push({x: mousePos.x ,y: mousePos.y});
            lineSeg.clickCount++;
            lineSeg.enableRubberBandDraw = true;
        } else if( lineSeg.clickCount == 1 ) {
            // lineSeg.clickCount++;
            lineSeg.p0.x = mousePos.x;
            lineSeg.p0.y = mousePos.y;
            lineSeg.points.push({x: mousePos.x ,y: mousePos.y});
            context.clearRect(0, 0, canvas.width, canvas.height);
            for( var i = 0; i < lineSeg.points.length - 1; i++ ){
                drawPoints(context, lineSeg.points[i], lineSeg.points[i + 1], '#e83e8c');
            }

        }
    }, false);

    canvas.addEventListener('mousemove', function(event) {
        rubberbandning( event, canvas, context, lineSeg );
    });

    canvas.addEventListener('dblclick', function (event) {
        endDraw( lineSeg );
    });

    clearBtn.addEventListener('click', function (event) {
        clearCanvas( context, canvas.width, canvas.height, lineSeg);
    });


});




