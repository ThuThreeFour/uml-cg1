var canvas = document.getElementById('fractalCanvas'),
    ctx = canvas.getContext('2d'),
    depth = 7;


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

//drawLine(100,100,200,200);


var drawKochCurve = function(x1, y1, x2, y2, color, alfa, iterations){
    if (iterations == 0) {
        drawLine(x1,y1,x2,y2, color);
        return;
    }

    var c = Math.cos(-alfa);
    var s = Math.sin(-alfa);

    var xa = x1 + 1/3 * (x2 - x1),
        ya = y1 + 1/3 * (y2 - y1),

        xb = x1 + 2/3 * (x2 - x1),
        yb = y1 + 2/3 * (y2 - y1),

        xc = xa + (xb - xa) * Math.cos(-alfa) - (yb - ya) * Math.sin(-alfa),
        yc = ya + (yb - ya) * Math.cos(-alfa) + (xb - xa) * Math.sin(-alfa);

    var xd = x1 + (xa - x1) * Math.cos(alfa) - (ya - y1) * Math.sin(alfa),
        yd = y1 + (ya - y1) * Math.cos(alfa) + (xa - x1) * Math.sin(alfa),
        xe = x1 + (xa - x1) * Math.cos(alfa) - (ya - y1) * Math.sin(alfa),
        ye = y1 + (ya - y1) * Math.cos(alfa) + (xa - x1) * Math.sin(alfa);

    // drawKochCurve(x1,y1, xa,ya, color, alfa, iterations-1);
    drawKochCurve(x1,y1, xd,yd, color, alfa, iterations-1);
    drawKochCurve(xd,yd, xa,ya, color, alfa, iterations-1);
    drawKochCurve(xa,ya, xc,yc, color,alfa, iterations-1);
    drawKochCurve(xc,yc, xb,yb, color, alfa, iterations-1);
    drawKochCurve(xb,yb, x2,y2, color, alfa, iterations-1);

}


// var k = 1000000;
// var a = 0.1;
// setInterval(function(){
//     ctx.clearRect(0, 0, 400, 210);
drawKochCurve(20.0, 200.0, 400.0, 200.0, '#000', Math.PI/3, depth);
//     k = k * a;
//     if (1000000 == k || 1 == k) a = 1/a;
//
// }, 300);