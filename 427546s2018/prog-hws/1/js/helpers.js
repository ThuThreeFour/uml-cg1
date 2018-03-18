

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
 * drawPoints() is adaptation of:
 *   https://stackoverflow.com/questions/44646035/js-calculate-midpoints-of-lines-recursively
 */

function drawPoints(context, p0, p1, color) {
    var coordinates = {x: [], y: []};

    function drawPoint( context, p0, p1, color ) {
        var midpoint = {x: getMidpoint(p0.x, p1.x), y: getMidpoint(p0.y, p1.y)};
        context.fillStyle = color;
        context.fillRect(midpoint.x, midpoint.y, 1, 1);
        coordinates.x.push(midpoint.x);
        coordinates.y.push(midpoint.y);
        if ((p0.x !== midpoint.x || p0.y !== midpoint.y) && (p1.x !== midpoint.x || p1.y !== midpoint.y)) {
            drawPoint(context, p0, midpoint);
            drawPoint(context, midpoint, p1);
        }
    }

    drawPoint( context, p0, p1, color );

    return coordinates;
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