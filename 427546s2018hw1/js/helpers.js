function getMousePosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function getMidpoint(a, b) {
    return Math.floor((a + b) / 2);
}

/**
 * midpoint() and drawPoints() is adaptation of:
 *   https://stackoverflow.com/questions/44646035/js-calculate-midpoints-of-lines-recursively
 */

function drawPoints(context, p0, p1) {
    var midpoint = {x: getMidpoint(p0.x, p1.x), y: getMidpoint(p0.y, p1.y)};
    context.fillRect(midpoint.x, midpoint.y, 1, 1);
    if ((p0.x !== midpoint.x || p0.y !== midpoint.y) && (p1.x !== midpoint.x || p1.y !== midpoint.y)) {
        drawPoints(context, p0, midpoint);
        drawPoints(context, midpoint, p1);
    }
}

// polylines and polygon
function clearCanvas( context, canvasWidth, canvasHeight, obj ) {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    obj.enableRubberBandDraw = false;
    obj.clickCount = 0;
    obj.points = [];
}

function endDraw( obj ) {
    obj.enableRubberBandDraw = false;
    obj.clickCount = 0;
}

function rubberbandning( event, canvas, context, obj ) {
    var mousePos = getMousePosition(canvas, event);
    console.log("Mouse position: " + mousePos.x + "," + mousePos.y);

    if( obj.enableRubberBandDraw ) {
        if( obj.points.length == 1 ) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawPoints(context, obj.points[0], mousePos);
        } else if ( obj.points.length >= 2 ) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            for( var i = 0; i < obj.points.length - 1; i++ ){
                drawPoints(context, obj.points[i], obj.points[i + 1]);
            }
            drawPoints(context, obj.points[obj.points.length - 1], mousePos);
        }
    }
}