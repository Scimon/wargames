var Game_Hex_Type = Backbone.Model.extend( {
	'initialize' : function() {
	    if ( this.has( '__CLASS__' ) ) {
		this.unset( '__CLASS__' );
	    }
	}, 
	'draw' : function( ctx, hex ) {
	    return ctx;
	}
} );