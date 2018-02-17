var circleObj = {
    clickCount: 0,
    enableRubberBandDraw: false,
    p0: {x: null, y: null},
    p1: {x: null, y: null}
}
/**
 * Wait for the DOM and everything else (files, images, etc.) to load
 */
$(document).ready(function(){


    var canvas = document.getElementById('circleCanvas');
    var context = canvas.getContext('2d');

    canvas.addEventListener('click', function(event) {
        var mousePos = getMousePosition(canvas, event);

        if( circleObj.clickCount === 0 ) {
            // console.log("Mouse position: " + mousePos.x + "," + mousePos.y);
            context.fillRect(mousePos.x, mousePos.y, 1, 1);
            circleObj.p0.x = mousePos.x;
            circleObj.p0.y = mousePos.y;
            circleObj.clickCount++;
            circleObj.enableRubberBandDraw = true;
        } else if( circleObj.clickCount === 1 ) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawCircle(context, circleObj.p0, circleObj.p1);
            circleObj.clickCount++;
            circleObj.enableRubberBandDraw = false;
        } else {
            context.clearRect(0, 0, canvas.width, canvas.height);
            circleObj.clickCount = 0;
        }
    }, false);

    $("#circleCanvas").mousemove(function(event) {
        var mousePos = getMousePosition(canvas, event);

        if( circleObj.enableRubberBandDraw ) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            circleObj.p1.x = mousePos.x;
            circleObj.p1.y = mousePos.y;
            drawPoints(context, circleObj.p0,circleObj.p1);
        }
    });
});

function distanceFromCentriod(p1, p2)
{
    var dx = p2.x - p1.x;
    dx = Math.pow(dx, 2);
    var dy = p2.y - p1.y;
    dy = Math.pow(dy, 2);
    return Math.sqrt( dx + dy );
}

/**
 * If the distance is between (radius - 1) and radius then is a it is a border point
 * and returns true
 * @param distance
 * @param radius
 * @return {boolean}
 */
function isBorderPoint(distance, radius) {
    return ((distance > (radius - 1)) && (distance <= radius));
}
function drawCircle(context, p0, p1)
{
    // use midpoint formula to find center of circleObj
    var midpoint = {h: getMidpoint(p0.x, p1.x), k: getMidpoint(p0.y, p1.y)};
    // r = squareroot( ( (x1 + x2)/2 ) + ((y1 + y2)/2) )
    var radius = Math.sqrt(Math.pow(p0.x - midpoint.h, 2) + Math.pow(p0.y - midpoint.k, 2));

    for( var j = midpoint.h - radius; j <= midpoint.h +radius; j++ ) {
        for( var k = midpoint.k - radius; k <= midpoint.k + radius; k++ ) {
            var distance = distanceFromCentriod({x: j, y: k}, {x: midpoint.h, y: midpoint.k});
            if( isBorderPoint(distance, radius) ) context.fillRect(j, k, 1, 1);
        }
    }
}