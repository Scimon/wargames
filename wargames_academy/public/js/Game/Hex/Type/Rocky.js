var Game_Hex_Type_Rocky = Game_Hex_Type.extend( {
	'draw' : function( ctx, hex ) {
	    var height = hex._half_height * 2;
	    var width = hex._half_width * 2;
	    var land_height = hex.get('height');
	    var random = hex.random();
		var colour = ( 80 + ( land_height  * 40 ) );
	    ctx.fillStyle = 'rgb( ' + colour + ', ' + colour + ', ' + colour +' )';
	    var base = 110 + ( land_height * 40 );
	    ctx.fillRect(0,0,width,height);
	    for ( var g = base; g > base - 50; g = g - 10 ) {
			ctx.fillStyle = 'rgba( ' + g + ', ' + g + ', ' + g +', 0.08 )';
			ctx.beginPath();
			var rad = Math.floor( ( random() * ( height / 2 ) ) + ( height / 4 ) );
			var cx = Math.floor( random() * ( width - ( rad * 2 ) ) ) + rad; 
			var cy = Math.floor( random() * ( height - ( rad * 2 ) ) ) + rad; 
			ctx.arc( cx, cy, rad, 0 , Math.PI * 2, false );
			ctx.fill();
		}
	}
} );