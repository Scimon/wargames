var Game_Hex_Type = Backbone.Model.extend( {
	'initialize' : function() {
	    if ( this.has( '__CLASS__' ) ) {
		this.unset( '__CLASS__' );
	    }
	}, 
	'_drawBase' : function( ctx, hex ) {
	    return ctx;
	},
	'_drawFeatures' : function( ctx, hex, grid ) {
	    var data = { 'grid' : grid };
	    hex.get('features').each( function( feature ) {
		    this.grid = feature.draw( ctx, hex, this.grid );
		}, data );
	    return data.grid;
	},
	'_drawDetail' : function( ctx, hex, grid ) {
	    return ctx;
	},
	'draw' : function( ctx, hex ) {
	    this._drawBase( ctx, hex ); 
	    grid = this.imageGrid( hex );
	    grid = this._drawFeatures( ctx, hex, grid );
	    this._drawDetail( ctx, hex, grid );
	    return ctx;
	},
	'imageGrid' : function( hex ) {
	    var cell_height = hex._half_height / 5;
	    var cell_width = hex._half_width / 5;
	    var grid = [];
	    for ( var i = 0; i < cell_height; i++ ) {
		for ( var j = 0; j < cell_width; j++ ) {
		    grid[grid.length] = true;
		}
	    }
	    return grid;
	},

} );