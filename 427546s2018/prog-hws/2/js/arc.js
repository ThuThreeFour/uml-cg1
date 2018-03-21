var arc = function (context, arcEndpoints) {
    this.start = {x: arcEndpoints.start.x, y: arcEndpoints.start.y};
    this.end = {x: arcEndpoints.end.x, y: arcEndpoints.end.y};
    this.iterations = arcEndpoints.iterations;
    this.context = context;
    this.points = [];
    this.angle = Math.PI/3; // 60 degrees, we are creating an equilateral triangle
    this.radius = 200;
    this.ratio = {start: 0, end: 1/3};
    this.next = null;


    // because JavaScript is wonky
    var that = this;

    /**
     * Draws an arc
     * Param are copied and pasted from https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc
     *
     * @param {Object} context 2D canvas context
     * @param {Object } options
     * @param {Number} options.x The x coordinate of the arc's center.
     * @param {Number} options.y The y coordinate of the arc's center.
     * @param {Number} options.radius The arc's radius.
     * @param {Number} options.startAngle The angle at which the arc starts, measured clockwise from the positive x axis and expressed in radians.
     * @param {Number} options.endAngle The angle at which the arc ends, measured clockwise from the positive x axis and expressed in radians.
     * @param {Boolean} options.anticlockwise Optional An optional Boolean which, if true, causes the arc to be drawn counter-clockwise between the two angles. By default it is drawn clockwise.
     */

    var drawArc = function (options, color) {

        that.context.strokeStyle = color;
        that.context.beginPath();
        that.context.arc(options.x, options.y, options.radius, options.startAngle, options.endAngle, options.anticlockwise);
        that.context.stroke();
        that.context.stroke();

    };

    this.drawArcs = function (options) {

        if (that.iterations == 0) drawArc(options);

        generatePoints();

        // draw all arc of >1-nth iteration
        for (var i = 0; i < that.points.length - 1; i++)  drawArc(options);

    };
    var centriod = function(startpoint, endpoint) {
        var start = {x: startpoint[0] + (1/2 * (endpoint[0] - startpoint[0])), y: startpoint[1] + (1/2 * (endpoint[1] - startpoint[1]))};

        start.radius = start.x/2;

        return start;
    };


    this.generatePoints = function () {
        that.angle *= -1;
        var numberOfArcs = 3;
        var degrees = [[Math.PI, 0], [Math.PI, 0], [Math.PI, 0]];

        drawArc({x: 125, y: 200, radius: 75, startAngle: 0, endAngle: Math.PI, anticlockwise: true}, '#6f42c1');

        that.points.push([that.start.x, that.start.y]);
        var x_center = ((that.end.x - that.start.x)/2) + that.start.x;
        var currSegment = {start: {x:that.start.x,  y: that.start.y}, end: {x: x_center, y: that.start.y}};
        var xa = currSegment.start.x + (currSegment.end.x - currSegment.start.x) * Math.cos(that.angle) - (currSegment.end.y - currSegment.start.y) * Math.sin(that.angle),
            ya = currSegment.start.y + (currSegment.end.y - currSegment.start.y) * Math.cos(that.angle) + (currSegment.end.x - currSegment.start.x) * Math.sin(that.angle);
        that.points.push([xa, ya]);
        that.points.push([xa, ya]);

        currSegment = {start: {x:xa,  y: ya}, end: {x: x_center, y: that.start.y}};

        var xb = currSegment.start.x + (currSegment.end.x - currSegment.start.x) * Math.cos(that.angle) - (currSegment.end.y - currSegment.start.y) * Math.sin(that.angle),
            yb = currSegment.start.y + (currSegment.end.y - currSegment.start.y) * Math.cos(that.angle) + (currSegment.end.x - currSegment.start.x) * Math.sin(that.angle);

        that.points.push([xb, yb]);

        // last rightmost line to draw
        that.points.push([xb, yb]);
        that.points.push([that.end.x, that.end.y]);

        for (var i=0, j=0; i < that.points.length; i += 2, j++) {
            console.log(that.points.length/2);
            var midpoint = centriod(that.points[i], that.points[i+1]);
            var p2 = {x: midpoint.x  , y: midpoint.y},
                p1 = {x: that.points[i+1][0]   , y: that.points[i+1][1] },
                p3 = {x: that.points[i][0]   , y: that.points[i][1] },
                diffX = p1.x - p2.x,
                diffY = p1.y - p2.y,
                radius = Math.abs(Math.sqrt(diffX*diffX + diffY*diffY)),
                startAngle = Math.atan2(diffY, diffX),
                endAngle   = Math.atan2(p3.y - p2.y, p3.x - p2.x),
                anitclockwise = ((j + 1) & 1) ? false : true;


            drawArc({x: p2.x, y: p2.y, radius: radius, startAngle: startAngle, endAngle: endAngle, anticlockwise: anitclockwise}, '#e83e8c');
        }

        return that.points;
    };

    var createArc = function () {
        that.angle = -1; // alternate bt up-side down or right-side up triangle

        var currSegment = set.next();

        var xc = currSegment.start.x + (currSegment.end.x - currSegment.start.x) * Math.cos(that.angle) - (currSegment.end.y - currSegment.start.y) * Math.sin(that.angle),
            yc = currSegment.start.y + (currSegment.end.y - currSegment.start.y) * Math.cos(that.angle) + (currSegment.end.x - currSegment.start.x) * Math.sin(that.angle);

        // return 2 points of the triangle: middle, right (left point is either start point or previous segment's right point)
        return [[xc, yc], [currSegment.end.x, currSegment.end.y]];
    }

    var set = {
        next: function () {

            var fractalizedSegment = {
                start: {x: that.start.x + that.ratio.start * (that.end.x - that.start.x), y: that.start.y + that.ratio.start * (that.end.y - that.start.y)},
                end: {x: that.start.x + that.ratio.end * (that.end.x - that.start.x), y: that.start.y + that.ratio.end * (that.end.y - that.start.y)}
            };

            var ratio = that.ratio.end - that.ratio.start;

            that.ratio = {start: that.ratio.end, end: that.ratio.end + ratio > 1 ? 1 : that.ratio.end + ratio};

            return fractalizedSegment;

        }
    }

    var drawLine = function(x1,y1,x2,y2, color)
    {
        that.context.fillStyle = '#000';
        that.context.strokeStyle = color;

        that.context.beginPath();
        that.context.moveTo(x1, y1);
        that.context.lineTo(x2, y2);
        that.context.lineWidth = 1;
        that.context.stroke();
        that.context.closePath();
    }






};
