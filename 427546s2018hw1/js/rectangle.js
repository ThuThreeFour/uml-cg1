var rect = {
    width: 100,
    height: 50,
    topLft: {x: 50, y:50},
    topRt: null,
    bottomLft: null,
    bottomRt: null,
    right: {x: null, y: null}
};

/**
 * Wait for the DOM and everything else (files, images, etc.) to load
 */
$(document).ready(function(){

    var canvas = document.getElementById('rectCanvas');
    var context = canvas.getContext('2d');
    var clearBtn = document.getElementById('clearRectBtn');

    rect.topRt = {x: rect.topLft.x + rect.width, y: rect.topLft.y};
    rect.bottomLft = {x: rect.topLft.x, y: rect.topLft.y + rect.height};
    rect.bottomRt = {x: rect.topLft.x + rect.width + 1, y: rect.topLft.y + rect.height + 1};

    drawRect( context, rect );

    function drawRect( context, rect ) {
        drawPoints(context, rect.topLft, rect.topRt, '#6f42c1');
        drawPoints(context, rect.bottomLft, rect.bottomRt, '#6f42c1');

        drawPoints(context, rect.topLft, rect.bottomLft, '#6f42c1');
        rect.right = drawPoints(context, rect.topRt, rect.bottomRt, '#6f42c1');
    }

    clearBtn.addEventListener('click', function (event) {
        clearCanvas( context, canvas.width, canvas.height, rect);
    });

    // attempting to detect if cursor is on rect border
    var drag = false;
    var dragEnd;
    canvas.addEventListener('mousedown', function(event) {
        var mousePos = getMousePosition(canvas, event);

        console.log("Mouse position: " + mousePos.x + "," + mousePos.y);
        //
        if( ( rect.right.x.indexOf(Math.floor(mousePos.x - 5)) !== -1 ) || (rect.right.x.indexOf(Math.floor(mousePos.x + 5))) ){
            console.log('drag started', rect.right.x.indexOf(mousePos.x));
            drag = true;
        } else {
            drag = false;
            console.log('drag end');
        }


    });

    canvas.addEventListener('mousemove', function(event) {
        if (drag) {
            dragEnd = {
                x: event.pageX - canvas.offsetLeft,
                y: event.pageY - canvas.offsetTop
            }
            console.log('dragging');
        }

    });



});




