var canvas = document.getElementById('fractalCanvas'),
    ctx = canvas.getContext('2d');


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


var drawKochCurve = function(x1, y1, x2, y2, color, alfa, k){
    if( ((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1)) < k) {
        drawLine(x1,y1,x2,y2, color);
        return;
    }
    var xa = x1 + 1/3 * (x2 - x1),
        ya = y1 + 1/3 * (y2 - y1),

        xb = x1 + 2/3 * (x2 - x1),
        yb = y1 + 2/3 * (y2 - y1),

        xc = xa + (xb - xa) * Math.cos(-alfa) - (yb - ya) * Math.sin(-alfa),
        yc = ya + (yb - ya) * Math.cos(-alfa) + (xb - xa) * Math.sin(-alfa);

    drawKochCurve(x1,y1, xa,ya, color, alfa, k);
    drawKochCurve(xa,ya, xc,yc, color,alfa, k);
    drawKochCurve(xc,yc, xb,yb, color, alfa, k);
    drawKochCurve(xb,yb, x2,y2, color, alfa, k);

}
//
//
// var k = 1000000;
// var a = 0.1;
// setInterval(function(){
//     ctx.clearRect(0, 0, 400, 210);
    drawKochCurve(20.0, 200.0, 400.0, 200.0, '#000', Math.PI/3, 1);
//     k = k * a;
//     if (1000000 == k || 1 == k) a = 1/a;
//
// }, 300);

/*
 var degK = Math.PI/180;
 var deg = 0;
 var aa = 1;
 setInterval(function(){
 //ctx.clearRect(20, 210, canvas.width, canvas.height);

 drawKochCurve(20.0, 400.0, 400.0, 400.0, "rgb(" + Math.floor((Math.random()*255)) + ","+Math.floor((Math.random()*255))+","+Math.floor((Math.random()*255))+")", deg * degK, 1);

 deg += aa;
 if (0 == deg || 60 == deg) aa *= -1;
 if (deg == 0) ctx.clearRect(20, 210, canvas.width, canvas.height);

 }, 30);
 */