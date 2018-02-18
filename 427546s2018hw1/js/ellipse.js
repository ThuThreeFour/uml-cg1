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


    var canvas = document.getElementById('ellipseCanvas');
    var context = canvas.getContext('2d');

    canvas.addEventListener('click', function(event) {
        var mousePos = getMousePosition(canvas, event);

        if( circleObj.clickCount === 0 ) {
            // console.log("Mouse position: " + mousePos.x + "," + mousePos.y);
            // context.fillRect(mousePos.x, mousePos.y, 1, 1);
            drawElipse(context, 75, 50, canvas.width/2, canvas.height/2 );
            // circleObj.p0.x = mousePos.x;
            // circleObj.p0.y = mousePos.y;
            // circleObj.clickCount++;
            // circleObj.enableRubberBandDraw = true;
        }

        // else if( circleObj.clickCount === 1 ) {
        //     context.clearRect(0, 0, canvas.width, canvas.height);
        //     drawElipse(context, 75, 50, canvas.width/2, canvas.height/2 );
        //     circleObj.clickCount++;
        //     circleObj.enableRubberBandDraw = false;
        // } else {
        //     context.clearRect(0, 0, canvas.width, canvas.height);
        //     circleObj.clickCount = 0;
        // }
    }, false);

    $("#ellipseCanvas").mousemove(function(event) {
        var mousePos = getMousePosition(canvas, event);
        //
        // if( circleObj.enableRubberBandDraw ) {
        //     context.clearRect(200, 100, canvas.width, canvas.height);
        //     circleObj.p1.x = mousePos.x;
        //     circleObj.p1.y = mousePos.y;
        //     drawPoints(context, circleObj.p0,circleObj.p1);
        // }
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
 *
 * @param x
 * @param y
 * @param midpoint
 */
function isInEllipse(x, y, midpoint, xMajorAxisRadius, ytMajorAxisRadius) {
    var left = Math.pow(( (x - midpoint.h) / xMajorAxisRadius), 2);
    var right = Math.pow(( (y - midpoint.k) / ytMajorAxisRadius), 2);
    var membership = left + right;

    switch( true ) {
        case ( (membership >= (0.95)) && (membership <= 1) ):
            return true;
        case (membership == 0):
            return true;
        case (membership < 0):
            return true;
        case  (membership > 0):
            return false;
        default:
            return false;
    }
}



function isBorderPoint(distance, radius) {
    return ((distance > (radius - 1)) && (distance <= radius));
}
function drawElipse(context, rx, ry, xOrigin, yOrigin)
{
    var midpoint = {h: xOrigin,k: yOrigin};


    for( var j = midpoint.h - rx; j <= midpoint.h + rx; j++ ) {
        for( var k = midpoint.k - ry; k <= midpoint.k + ry; k++ ) {
            // rx > ry
             var distance = isInEllipse(j, k, midpoint, rx, ry);
            // var distance = isInEllipse(151, 105, midpoint, 2, 5);
            if( distance ) context.fillRect(j, k, 1, 1);
        }
    }

    context.fillStyle = 'blue';
    context.fillRect(rx + xOrigin, ry + ry, 3,3);
}