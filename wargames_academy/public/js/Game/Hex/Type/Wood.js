var Game_Hex_Type_Wood = Game_Hex_Type.extend( {
	'draw' : function( ctx, hex ) {
	    var height = hex._half_height * 2;
	    var width = hex._half_width * 2;
	    var land_height = hex.get('height');
	    var random = hex.random();
	    ctx.fillStyle = 'rgb( 0, ' + ( 80 + ( land_height  * 40 ) ) + ', 0 )';
	    ctx.fillRect(0,0,width,height);
	    for ( var g = 0; g < 10; g++ ) {
		ctx.fillStyle = 'rgba( 0, 150, 0, 1)';
		ctx.strokeStyle = 'rgba( 0, 50, 0, 1 )';
		ctx.lineWidth = 2;
		ctx.beginPath();
		var rad = Math.floor( ( random() * ( height / 10 ) ) + ( height / 15 ) );
		var cx = Math.floor( ( width / 2 ) + ( rad * 4 * ( 0.5-random() ) ) );
		var cy = Math.floor( ( height / 2 ) + ( rad * 4 * ( 0.5-random() ) ) );
		ctx.arc( cx, cy, rad, 0 , Math.PI * 2, false );
		ctx.stroke();
		ctx.fill();
	    }

	}
});