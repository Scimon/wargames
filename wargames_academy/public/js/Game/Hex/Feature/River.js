var Game_Hex_Feature_River = Game_Hex_Feature.extend({
	'draw' : function( ctx, hex, grid ) {
	    var canvas = this.blankCanvas( hex );
	    var newCtx = canvas.getContext( '2d' );
	    
	    var start = hex.processPoint( this.get('start') );
	    var end = hex.processPoint( this.get('end') );
	    var points = this.curvePoints( start, end, hex.random(), hex.get('scale') );

	    newCtx.strokeStyle = 'rgba( 75, 75, 0, 1 )';
	    newCtx.lineCap = 'round';
	    newCtx.lineWidth = hex.get('scale') * 5;
	    newCtx.beginPath();
	    newCtx.moveTo( start.get('x'), start.get('y') );
	    newCtx.bezierCurveTo( points.a.get('x'), points.a.get('y'), points.b.get('x'), points.b.get('y'), end.get('x'), end.get('y') );
	    newCtx.stroke();
	    newCtx.strokeStyle = 'rgba( 0, 0, 150, 1 )';
	    newCtx.lineCap = 'round';
	    newCtx.lineWidth = hex.get('scale') * 4;
	
	    newCtx.beginPath();
	    newCtx.moveTo( start.get('x'), start.get('y') );
	    newCtx.bezierCurveTo( points.a.get('x'), points.a.get('y'), points.b.get('x'), points.b.get('y'), end.get('x'), end.get('y') );
	    newCtx.stroke();

	    ctx.drawImage( canvas, 0,0 );


	    return grid;
	}
    });