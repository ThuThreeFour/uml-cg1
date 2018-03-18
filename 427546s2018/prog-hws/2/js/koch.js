var KochLine = function (segmentLength) {
    this.start = {x: segmentLength.start.x, y: segmentLength.start.y};
    this.end = {x: segmentLength.end.x, y: segmentLength.end.y};
    this.ratio = {start: 0, end: segmentLength.ratio};
    this.next = null;
    this.angle = Math.PI/3; // 60 degrees, we are creating an equilateral triangle
    this.points = [];

    // because JavaScript is wonky
    var that = this;

    this.generate = function () {

        var numberOfLineSegments = Math.floor(1/that.ratio.end);

        that.points.push([that.start.x, that.start.y]);

        for (var i = 0; i < numberOfLineSegments - 1; i++) {
            createTriangle().forEach(function (pt) {
                that.points.push(pt);
            });
        }

        createTriangle().forEach(function (pt) {
            that.points.push(pt);
        });

    };

    var createTriangle = function () {
            that.angle *= -1; // alternate bt up-side down or right-side up triangle

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
};



