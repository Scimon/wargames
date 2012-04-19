var Game_Hex_Feature_Road = Game_Hex_Feature.extend({
	'draw' : function( ctx, hex, grid ) {
	    var canvas = this.blankCanvas( hex );
	    var newCtx = canvas.getContext( '2d' );
	    
	    var start = hex.processPoint( this.get('start') );
	    var end = hex.processPoint( this.get('end') );
	    var points = this.curvePoints( start, end, hex.random(), hex.get('scale') );


	    newCtx.strokeStyle = 'rgba( 20, 20, 20, 1 )';
	    newCtx.lineCap = 'round';
	    newCtx.lineWidth = hex.get('scale') * 3.5;
	    newCtx.beginPath();
	    newCtx.moveTo( start.get('x'), start.get('y') );
	    newCtx.bezierCurveTo( points.a.get('x'), points.a.get('y'), points.b.get('x'), points.b.get('y'), end.get('x'), end.get('y') );
	    newCtx.stroke();

		
	    newCtx.strokeStyle = 'rgba( 220, 220, 190, 1 )';
	    newCtx.lineWidth = hex.get('scale') * 3;
	    newCtx.beginPath();
	    newCtx.moveTo( start.get('x'), start.get('y') );
	    newCtx.bezierCurveTo( points.a.get('x'), points.a.get('y'), points.b.get('x'), points.b.get('y'), end.get('x'), end.get('y') );
	    newCtx.stroke();

	    ctx.drawImage( canvas, 0,0 );


	    return grid;
	}
});