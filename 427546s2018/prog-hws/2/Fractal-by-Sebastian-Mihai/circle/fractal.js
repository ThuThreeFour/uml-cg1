// a "class" to hold one fractal
function Fractal( canvasElementName, fractalName ) {

	this.m_maxDepth = 5;
	
	this.m_delegate = function() {};

	this.m_canvasElement = document.getElementById( canvasElementName );
	this.m_canvasElement.width = this.m_canvasElement.width;
	this.m_context = this.m_canvasElement.getContext( "2d" );

	if( typeof fractalName != 'undefined' ) {
		
		this.m_context.fillStyle = "#777777";
		this.m_context.font = "bold 12px Arial";
		this.m_context.fillText( fractalName, 5, 17 );
	}
	
	this.m_lastDepth = 0;
	
	this.m_queue = new Queue();
	
	this.m_coloursByDepthGrayscale = new Array( 
		"#FFFFFF",
		"#DDDDDD",
		"#BBBBBB", 
		"#999999", 
		"#777777", 
		"#555555",
		"#333333"
		);
	
	this.m_coloursByDepth = new Array(
		"#FF0000", 
			"#FF4000",
		"#FF7F00",
			"#FFB800",
		"#FFFF00",
			"#80FF00",
		"#00FF00",
			"#008080",
		"#0000FF",
			"#2600B8",
		"#4B0082",
			"#6E00BA",
		"#8F00FF",
			"#BA0080"
		);
	
	Fractal.prototype.Queue = function( ) {
		return this.m_queue;
	}
	
	Fractal.prototype.UseGrayscale = function( maxDepth ) {
		this.m_coloursByDepth = this.m_coloursByDepthGrayscale;
	}
	
	Fractal.prototype.SetMaxDepth = function( maxDepth ) {
		this.m_maxDepth = maxDepth;
	}
	
	Fractal.prototype.Width = function() {
		return this.m_canvasElement.width;
	}
	
	Fractal.prototype.Height = function() {
		return this.m_canvasElement.height;
	}
	
	Fractal.prototype.SetDelegate = function( delegate ) {
		this.m_delegate = delegate;
	}
	
	// Begin Simple "Render" - Render the whole thing at once
	Fractal.prototype.Render = function() {
		this.m_lastDepth = 0;
		this.m_RenderWorker();
	}
	
	this.m_RenderWorker = function() {
	
		while( true ) {

			var node = this.m_queue.Pop();
			
			this.m_lastDepth = node.Depth();
			
			if( this.m_lastDepth > this.m_maxDepth ) {
				break;
			}
			
			this.m_delegate( this, this.m_queue, node, this.m_lastDepth );
		}
	}
	// End simple "Render"
	
	// Render Progressively - show each iteration progressively, like an animation
	Fractal.prototype.RenderProgressively = function( delayMilliseconds ) {
	
		// if no delay is specified, default to 1ms
		if( typeof delayMilliseconds == 'undefined' ) {
			delayMilliseconds = 1;
		}
		
		this.m_lastDepth = 0;
		this.m_RenderProgressivelyLoop( delayMilliseconds );
	}
	
	// a workaround to make up for JavaScript's lack of an asynchronous sleep method
	this.m_RenderProgressivelyLoop = function( delayMilliseconds ) {
	
		var me = this;
		var theDelayMilliseconds;
	
		// if there aren't any other nodes to process, we're done
		if( this.m_queue.Count() === 0 ) {
			return;
		}
		
		if( this.m_queue.Peek().Depth() < 2 ) {
			theDelayMilliseconds = 8 * delayMilliseconds;
		} else {
			theDelayMilliseconds = delayMilliseconds;
		}
	
		this.m_RenderProgressivelyWorker();

		setTimeout( 
			function() { me.m_RenderProgressivelyLoop( delayMilliseconds ); },
			theDelayMilliseconds
			);
	}
	
	this.m_RenderProgressivelyWorker = function() {

		var node = this.m_queue.Pop();
		
		this.m_lastDepth = node.Depth();
		
		// if we're past the maximum depth, we do nothing for this node
		if( this.m_lastDepth > this.m_maxDepth ) {
			return;
		}
		
		this.m_delegate( this, this.m_queue, node, this.m_lastDepth );
	}
	// End Progressively Render
	
	this.m_CalculateColour = function () {
		
		var index = this.m_lastDepth % this.m_coloursByDepth.length; 		
		return this.m_coloursByDepth[ index ];
	}
	
	Fractal.prototype.SetPixel = function( x, y ) {
	
		this.m_context.fillStyle = this.m_CalculateColour();
		this.m_context.fillRect( x, y, 1, 1 );
	}
	
	Fractal.prototype.DrawLine = function( x, y, toX, toY, colour ) {
	
		var theColour;
	
		if( typeof colour == 'undefined' ) {
			theColour = this.m_CalculateColour();
		} else {
			theColour = colour;
		}
	
		this.m_context.strokeStyle = theColour;
		this.m_context.lineWidth = 1;
		this.m_context.beginPath();
		this.m_context.moveTo( x, y );
		this.m_context.lineTo( toX, toY );
		this.m_context.stroke();
	}
	
	Fractal.prototype.DrawCircle = function( x, y, radius ) {	

		this.m_context.strokeStyle = this.m_CalculateColour();
		
		this.m_context.beginPath();
		this.m_context.arc( x, y, radius, 0, Math.PI*2 ); 

		this.m_context.fillStyle = this.m_context.strokeStyle;
		this.m_context.fill();
		
		this.m_context.closePath();
	}
}



// a "class" for a node in a recursion iteration
function QueueItem( x, y, depth ) {

	this.m_x = x;
	this.m_y = y;
	this.m_depth = depth;
	
	QueueItem.prototype.X = function() {
		return this.m_x;
	}
	
	QueueItem.prototype.Y = function() {
		return this.m_y;
	}
	
	QueueItem.prototype.Depth = function() {
		return this.m_depth;
	}
}

// a "class" for a simple queue implementation
function Queue() {

	this.m_items = new Array();
	
	Queue.prototype.Push = function( incoming ) {
		this.m_items.push( incoming );
	}

	Queue.prototype.Pop = function() {
		if( this.m_items.length > 0 ) {
			return this.m_items.shift();
		}
	}

	Queue.prototype.Count = function() {
		return this.m_items.length;
	}
	
	Queue.prototype.Peek = function() {
		return this.m_items[0];
	}
}
