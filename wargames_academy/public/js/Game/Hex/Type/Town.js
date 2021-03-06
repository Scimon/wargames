var Game_Hex_Type_Town = Game_Hex_Type.extend( {
	'_drawBase' : function( ctx, hex ) {
	    var height = hex._half_height * 2;
	    var width = hex._half_width * 2;
	    var land_height = hex.get('height');
	    var random = hex.random();
	    var base = ( land_height  * 40 );
	    ctx.fillStyle = 'rgb( ' + base + ', ' + base + ', ' + base + ' )';
	    ctx.fillRect(0,0,width,height);
		var rects = [];
		ctx.fillStyle = 'rgba( 100, 100, 100, 1)';
		ctx.strokeStyle = 'rgba( 0, 0, 0, 1 )';
		ctx.lineWidth = 3;
	    for ( var g = 0; g < 10; g++ ) {
			var bh = Math.floor( 1 + ( random() * 3 ) * ( height / 10 ) ); 
			var bw = Math.floor( 1 + ( random() * 3 ) * ( width / 10 ) ); 
			var x = Math.floor( random() * 10 * ( ( ( width - bw ) / 10 ) ) );
			var y = Math.floor( random() * 10 * ( ( ( height - bh ) / 10 ) ) );
			ctx.strokeRect(x,y,bw,bh);
			rects.push( [x,y,bw,bh] );
		
	    }
		for ( var o,i=0; o = rects[i]; i++ ) {
			ctx.fillRect(o[0],o[1],o[2],o[3]);
		}
	}
});