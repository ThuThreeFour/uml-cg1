//
// A sample which uses the fractal library
//
//                              by Sebastian Mihai, 2013
//

// onload method
function smOnload() {

	// point the fractal generator at the proper DOM element
	var fractal = new Fractal( "smCanvas", "Circles, by Sebastian Mihai" );
	
	// we'll generate up to this depth
	fractal.SetMaxDepth( 6 );

	// our first node will be in the centre of the canvas
	fractal.Queue().Push( new QueueItem( fractal.Width() / 2, fractal.Height() / 2, 0 ) );

	// this function will be called by the fractal generator for each node
	var delegate = function( theFractal, theQueue, node, depth ) {
		
		var x = node.X();
		var y = node.Y();
		
		// draw a circle at [x,y]
		theFractal.DrawCircle( x, y, 20/(depth+2) );
		
		// amount by which we shift each of the four child nodes
		var power = Math.pow( 2, depth );
		var delta = 160.0 / ( power ) * 0.9 - 2;
		
		// create the four child nodes
		var topLeft = new QueueItem( x - delta, y - delta, depth+1 );
		var topRight = new QueueItem( x + delta, y - delta, depth+1 );
		var bottomLeft = new QueueItem( x - delta, y + delta, depth+1 );
		var bottomRight = new QueueItem( x + delta, y + delta, depth+1 );
		
		// push the four child nodes to the queues
		theQueue.Push( topLeft );
		theQueue.Push( topRight );
		theQueue.Push( bottomLeft );
		theQueue.Push( bottomRight );
	}

	// tell fractal generator about our delegate
	fractal.SetDelegate( delegate );
	
	// this fractal looks better if it's not rendered in colour
	fractal.UseGrayscale();
	
	// render fractal in an progressive, animated fashion
	// ( for a direct rendering, use fractal.Render() )
	fractal.RenderProgressively( 10 );
}
