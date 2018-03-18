$(function() {
    var canvas = $("#fractalCanvas");
    var context = canvas.get(0).getContext("2d");
    context.fillStyle = "rgb(63, 169, 245)";
    var x;
    var y;
    var angle;
    var level = 0;

    var animateKochSnowflake = function() {
        initialize();
        save();
        drawKochSnowflake();
        flush();
        level++;
    }

    //Create snowflake
    var drawKochSnowflake = function() {
        drawKochCurve(level, 150);
        angle += 120;
        drawKochCurve(level, 150);
        angle += 120;
        drawKochCurve(level, 150);
    };

    //Recursive implementation
    var drawKochCurve = function(level, sideLength) {
        if (level < 1) {
            draw(sideLength);
        }
        else {
            drawKochCurve(level - 1, sideLength / 3);
            angle -= 45;
            drawKochCurve(level - 1, sideLength / 3);
            angle += 90;
            drawKochCurve(level - 1, sideLength / 3);
            angle -= 45;
            drawKochCurve(level - 1, sideLength / 3);
        }
    };

    var draw = function(sideLength) {
        x += sideLength * Math.sin(angle * Math.PI/180);
        y -= sideLength * Math.cos(angle * Math.PI/180);
        context.lineTo(x, y);
    };

    var initialize = function() {
        angle = 90;
        x = 170;
        y = 100;
        if (level > 5) {
            level = 0;
        }
    };

    var save = function() {
        context.save();
        context.beginPath();
        context.clearRect(0, 0, 640, 480);
        context.translate(-level*10, 0);

        context.moveTo(x, y);
    };

    var flush = function() {
        context.closePath();
        context.fill();
        context.restore();
    };

    // var animate = function() {
    //     setInterval(animateKochSnowflake, 1000);
    // };
    //
    // animate();

    animateKochSnowflake();

});