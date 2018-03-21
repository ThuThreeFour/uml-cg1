
$(document).ready(function(){
    var canvas = document.getElementById('wheelCanvas'),
        context = canvas.getContext('2d');

    $("#wheel_submit").click(function(event){

        context.clearRect(0, 0, canvas.width, canvas.height);

        var wheelRadius = parseInt($('#wheel_radius').val()),
            score       = parseInt($('#driver_score').val());

        if ( (wheelRadius < 100) || (wheelRadius > 300) || !wheelRadius) {
            alert('Wheel radius must be between 100 and 500');
            event.preventDefault();
        }

        if ( (score < 0) || (score > 100) || !score ) {
            alert("Driver's score must be between 0 and 100");
            event.preventDefault();
        }

        switch (true) {
            case score == 100:
                wheel.draw.rimBolts(context, canvas.width/2 - 30, canvas.height/2 - 25, 0);
                wheel.draw.circle(wheelRadius, canvas.width/2, canvas.height/2,  context);
                if (wheelRadius < 200) {
                    wheelRadius -= 10;
                } else {
                    wheelRadius -= 50;
                }
                wheel.draw.circle(wheelRadius, canvas.width/2, canvas.height/2, context);
                break;
            case (score < 100) && (score >= 80):
                var ellipse_height = wheelRadius - (((100 - score) / 100) * 200);
                var minorAxis = wheelRadius;
                var majorAxis = ellipse_height;
                wheel.draw.ellipse(majorAxis, minorAxis, context, canvas.height, canvas.width);

                if (wheelRadius < 200) {
                    majorAxis -= 10;
                    minorAxis -= 10;
                } else {
                    majorAxis -= 50;
                    minorAxis -= 50;
                }

                wheel.draw.rimBolts(context, canvas.width/2 - 30, canvas.height/2 - 25, 0);

                wheel.draw.ellipse( majorAxis, minorAxis, context, canvas.height, canvas.width);
                break;
            case (score >= 2) && (score < 80):
                wheel.draw.polygon(wheelRadius, score, context, canvas.height - 500 , canvas.width - 550);
                if ((wheelRadius > 100) && (score > 3)) {
                    wheel.draw.rimBolts(context, canvas.width - 480, canvas.height - 440, 0);
                }
                wheel.draw.polygon( wheelRadius - 50, score, context, canvas.height - 480 , canvas.width - 530);
                break;
            case score == 1:
                wheel.draw.line(wheelRadius, context, canvas.width - 500, canvas.height/2);
                break;
            case score == 0:
                wheel.draw.none(canvas.width, canvas.height, context);

        }

    });



    canvas.addEventListener('mousemove', function(event) {
        var mousePos = getMousePosition(canvas, event);
        $( "input#wheel-x-val" ).val(mousePos.x);
        $( "input#wheel-y-val" ).val(mousePos.y);
    });
});


var wheel = {
    draw: {
        none: function (canvasWidth, canvasHeight, context) {
            context.font = "30px Arial";
            context.fillStyle = "#e83e8c";
            context.textAlign = 'center';
            context.fillText("A driver score of 0 results in no wheels.", canvasWidth/2, canvasHeight/2);
        },
        line: function (length, context, startX, startY) {
            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(startX + length, startY);
            context.stroke();
        },
        circle: function (radius, centerX, centerY, context) {
            context.beginPath();
            context.arc(centerX, centerY, radius ,0 , 2*Math.PI);
            context.stroke();
        },
        ellipse: function (radiusHorizontal, radiusVertical, context, canvasHeight, canvasWidth) {
            context.beginPath();
            context.ellipse(canvasWidth/2, canvasHeight/2, radiusHorizontal, radiusVertical, 90 * Math.PI/180, 0, 2 * Math.PI);
            context.stroke();
        },
        polygon: function (diameter, numSides, context, canvasHeight, canvasWidth) {
            var Points = [];
            for (var i = 0; i < numSides; i++) {
                var p = {};
                p.x = (diameter / 2 + diameter / 2 * Math.cos(i * 2 * Math.PI / numSides)) + canvasWidth;
                p.y = (diameter / 2 + diameter / 2 * Math.sin(i * 2 * Math.PI / numSides)) + canvasHeight;
                Points.push(p);
            }
            // make the path
            context.beginPath();
            context.moveTo(Points[0].x, Points[0].y);
            for (var i = 0; i < numSides; i++) {
                context.lineTo(Points[i].x, Points[i].y);
            }
            context.closePath();
            context.stroke();

        },
        rimBolts: function (context, topLeftX, topLeftY, strecth) {
            var oX = 60, oY = 60;

            var img = new Image(oX, oY);
            img.onload = function() {

                if (strecth == 0) {
                    context.drawImage(img, topLeftX, topLeftY);
                }
            }
            img.src = "./images/wheel-center.svg";
        }
    }

};

