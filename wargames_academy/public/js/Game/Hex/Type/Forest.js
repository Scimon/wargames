var Game_Hex_Type_Forest = Game_Hex_Type.extend( {
	'_drawBase' : function( ctx, hex ) {
	    var height = hex._half_height * 2;
	    var width = hex._half_width * 2;
	    var land_height = hex.get('height');
	    var random = hex.random();
	    ctx.fillStyle = 'rgb( 0, ' + ( 80 + ( land_height  * 40 ) ) + ', 0 )';
	    ctx.fillRect(0,0,width,height);
	    for ( var g = 0; g < 30; g++ ) {
		ctx.fillStyle = 'rgba( 50, 100, 0, 1)';
		ctx.strokeStyle = 'rgba( 0, 50, 0, 1 )';
		ctx.lineWidth = 2;
		ctx.beginPath();
		var rad = Math.floor( ( random() * ( height / 10 ) ) + ( height / 15 ) );
		var cx = Math.floor( random() * ( width - ( rad * 2 ) ) ) + rad; 
		var cy = Math.floor( random() * ( height - ( rad * 2 ) ) ) + rad; 
		ctx.arc( cx, cy, rad, 0 , Math.PI * 2, false );
		ctx.stroke();
		ctx.fill();
	    }

	}
});