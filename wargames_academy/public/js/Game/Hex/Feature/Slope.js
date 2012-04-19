var Game_Hex_Feature_Slope = Game_Hex_Feature.extend({
	'draw' : function( ctx, hex, grid ) {
	    var canvas = this.blankCanvas( hex );
	    var newCtx = canvas.getContext( '2d' );
	    
	    var start = hex.processPoint( this.get('start') );
	    var end = hex.processPoint( this.get('end') );
	    var height_diff = ( this.get('end_height') - this.get('start_height') ) * 40;
	    var s_col = Math.floor( 128 - height_diff / 2 );
	    var e_col = Math.floor( 128 + height_diff / 2);;

	    var lingrad = ctx.createLinearGradient(start.get('x'),start.get('y'),end.get('x'),end.get('y'));  
	    lingrad.addColorStop(0, 'rgba( ' + s_col + ',' + s_col + ',' + s_col +', 0.05 )');
	    lingrad.addColorStop(0.5, 'rgba( 128,128,128, 0.5 )');
 	    lingrad.addColorStop(1, 'rgba( ' + e_col + ',' + e_col + ',' + e_col +', 0.05 )');  

	    newCtx.strokeStyle = lingrad;
	    newCtx.lineWidth = hex.get('hexRadius') * 3;
	    newCtx.beginPath();
	    newCtx.moveTo( start.get('x'), start.get('y') );
	    newCtx.lineTo( end.get('x'), end.get('y') );
	    newCtx.stroke();

	    ctx.drawImage( canvas, 0,0 );

	    return grid;
	}

});