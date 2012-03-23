var Game_HexMap = Backbone.Model.extend( {
	'defaults' : {
	    'hexes' : [],
	    'id' : 0,
	    'name' : '',
	},
	'initialize' : function() {
	    if ( this.has( '__CLASS__' ) ) {
		this.unset( '__CLASS__' );
	    }
	    var Data = _.map( this.get('hexes'), function( hex ) { return new Game_Hex( hex ) } );
	    this.set('hexes', new Game_Hex_Collection( Data ) );
	}
} );