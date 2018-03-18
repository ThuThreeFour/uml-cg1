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

    var clearBtn = document.getElementById('clearEllipseBtn');
    clearBtn.addEventListener('click', function (event) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        lineSeg.clickCount = 0;
    });

    canvas.addEventListener('click', function(event) {
        var mousePos = getMousePosition(canvas, event);

        if( circleObj.clickCount === 0 ) {
            drawElipse(context, 75, 50, canvas.width/2, canvas.height/2, '#17a2b8' );
            context.clearRect(canvas.width/2, canvas.height/2, 1, 1);
        }

    }, false);

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

    // midpoint ellipse algorithm: http://vplab.snu.ac.kr/lectures/09-2/under_graphics/02_ScanConversion_2.pdf
    switch( true ) {
        case ( (membership >= (0.9)) && (membership <= 1) ):  // 0.9 is for thickness
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
function drawElipse(context, rx, ry, xOrigin, yOrigin, color)
{
    var midpoint = {h: xOrigin,k: yOrigin};


    for( var j = midpoint.h - rx; j <= midpoint.h + rx; j++ ) {
        for( var k = midpoint.k - ry; k <= midpoint.k + ry; k++ ) {
            // rx > ry
             var distance = isInEllipse(j, k, midpoint, rx, ry);
            if( distance ) {
                context.fillStyle = color;
                context.fillRect(j, k, 1, 1);
            }
        }
    }

}