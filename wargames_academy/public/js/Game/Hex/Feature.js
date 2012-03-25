var Game_Hex_Feature = Backbone.Model.extend( {
	'initialiaze' : function() {
	    if ( this.has( '__CLASS__' ) ) {
		this.unset( '__CLASS__' );
	    }
	},
	'draw' : function( ctx, hex ) {
	    return ctx;
	}
} );

var Game_Hex_Feature_Collection = Backbone.Collection.extend( {
	'model' : Game_Hex_Feature,
	'initialize' : function() {	    
	}
    });