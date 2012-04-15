var Game_Hex_Feature = Backbone.Model.extend( {
	'initialize' : function() {
	    if ( this.has( '__CLASS__' ) ) {
		this.unset( '__CLASS__' );
	    }
	},
	'blankCanvas' : function( hex ) {
	    var height = hex._half_height * 2;
	    var width = hex._half_width * 2;
	    return  $('<canvas>').attr( 'width',width ).attr( 'height',height )[0];
	},
	'draw' : function( ctx, hex, grid ) {
	    return { 'ctx' : ctx, 'grid' : grid };
	},
        'curvePoints' : function( start, end, r, scale ) {
	    var cp1, cp2;
	    var vec = end.sub( start );
	    
	    var s = new Vector( { 'x' : start.get('x'), 'y' : start.get('y') } );
	    
	    if ( r() < 0.5 ) {
		cp1 = vec.scale(0.4).add(vec.tangent().scale(-3/10)).add(s);
		cp2 = vec.scale(0.6).add(vec.tangent().scale(3/10)).add(s);
	    } else {
		cp1 = vec.scale(0.4).add(vec.tangent().scale(3/10)).add(s);
		cp2 = vec.scale(0.6).add(vec.tangent().scale(-3/10)).add(s);
	    }
		    
	    cp1.set( 'x' , cp1.get('x') + ( r() * scale * 6 ) - (scale * 3 ) );						
	    cp1.set( 'y' , cp1.get('y') + ( r() * scale * 6 ) - (scale * 3 ) );			
	    cp2.set( 'x' , cp2.get('x') + ( r() * scale * 6 ) - (scale * 3 ) );
	    cp2.set( 'y' , cp2.get('x') + ( r() * scale * 6 ) - (scale * 3 ) );
	    
	    return { 'a' : cp1, 'b' : cp2 };
	}


} );

var Game_Hex_Feature_Collection = Backbone.Collection.extend( {
	'model' : Game_Hex_Feature,
	'initialize' : function() {	    
	}
    });