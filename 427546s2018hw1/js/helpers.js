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