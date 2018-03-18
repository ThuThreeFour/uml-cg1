var arcCanvas = document.getElementById('arcCanvas'),
    arcCtx = arcCanvas.getContext('2d'),
    arcDepth = 1,
    // arcEndpoints = {start: {x: 400, y:300}, end: {x: 600, y: 300}, iterations: 0},
    arcEndpoints = {start: {x: 50, y:200}, end: {x: 200, y: 200}, iterations: 0}
    testArc = {x: arcEndpoints.start.x, y: arcEndpoints.start.y, radius: 200, startAngle: 0, endAngle: Math.PI, anticlockwise: true};

var fractalArc = new arc(arcCtx, arcEndpoints);
// fractalArc.drawArcs(testArc);



var drawFakeLine = function(x1,y1,x2,y2, color)
{
    arcCtx.fillStyle = '#000';
    arcCtx.strokeStyle = color;

    arcCtx.beginPath();
    arcCtx.moveTo(x1, y1);
    arcCtx.lineTo(x2, y2);
    arcCtx.lineWidth = 1;
    arcCtx.stroke();
    arcCtx.closePath();
}
var drawKochCurveforArc = function(x1, y1, x2, y2, color, alfa, iterations, ratio){
    if (iterations == 0) {
        drawFakeLine(x1,y1,x2,y2, color);
        return;
    }

    var kockLine = new arc(arcCtx, arcEndpoints);
    kockLine.generatePoints();

    for (var i = 0; i < kockLine.points.length - 1; i++)  drawKochCurveforArc(kockLine.points[i][0],kockLine.points[i][1], kockLine.points[i+1][0],kockLine.points[i+1][1], color, alfa, iterations-1, ratio);

};

drawKochCurveforArc(200, 300, 600, 300, '#000', Math.PI/3, 1, 1/2);

arcCanvas.addEventListener('mousemove', function(event) {
    var mousePos = getMousePosition(arcCanvas, event);
    $( "input#x-val" ).val(mousePos.x);
    $( "input#y-val" ).val(mousePos.y);
});









// KOCH SNOWFLAKE STARTS HERE

var canvas = document.getElementById('fractalCanvas'),
    ctx = canvas.getContext('2d'),
    depth = 1;


var drawLine = function(x1,y1,x2,y2, color)
{
    ctx.fillStyle = '#000';
    ctx.strokeStyle = color;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
}

var drawKochCurve = function(x1, y1, x2, y2, color, alfa, iterations, ratio){
    if (iterations == 0) {
        drawLine(x1,y1,x2,y2, color);
        return;
    }

    var kockLine = new KochLine({start: {x: x1, y: y1}, end: {x: x2, y: y2}, ratio: ratio});
    kockLine.generate();

    for (var i = 0; i < kockLine.points.length - 1; i++)  drawKochCurve(kockLine.points[i][0],kockLine.points[i][1], kockLine.points[i+1][0],kockLine.points[i+1][1], color, alfa, iterations-1, ratio);

};



canvas.addEventListener('mousemove', function(event) {
    var mousePos = getMousePosition(canvas, event);
    $( "input#x-val" ).val(mousePos.x);
    $( "input#y-val" ).val(mousePos.y);
});


        // drawKochCurve(200, 300, 600, 300, '#000', Math.PI/3, 1, 1/3);
drawKochCurve(50, 200, 200, 200, '#000', Math.PI/3, 1, 1/3);


// $(document).ready(function(){
//     var iterations = 0;
//     var colors = ["#C2272D", "#F8931F", "#FFFF01", "#009245", "#0193D9", "#0C04ED", "#612F90"];
//
//     setInterval(function() {
//         ctx.clearRect(0,0, canvas.width, canvas.height);
//
//         var color = colors.pop();
//
//         colors.unshift(color);
//
//         drawKochCurve(200, 300, 600, 300, color, Math.PI/3, iterations, 1/4);
//
//         if (iterations < depth) {
//             iterations++;
//         } else {
//             iterations = 0;
//         }
//
//     }, 1000);
// });
