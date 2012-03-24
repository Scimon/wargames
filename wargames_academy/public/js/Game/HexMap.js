var Game_HexMap = Backbone.Model.extend( {
	'defaults' : {
	    'hexes' : [],
	    'id' : 0,
	    'name' : '',
	    'scale' : 3,
	},
	'validate' : function(attrs) {
	    if ( attrs.scale < 1 || attrs.scale > 15 ) {
		return( "Scale must be between 1 and 15" );
	    }
	},
	'initialize' : function() {
	    if ( this.has( '__CLASS__' ) ) {
		this.unset( '__CLASS__' );
	    }
	    var Data = _.map( this.get('hexes'), 
			      function( hex ) { 
				  hex.parent = this;
				  return new Game_Hex( hex );
			      }, this );
	    var collection = new Game_Hex_Collection( Data );
	    collection.each( function( hex, index ) {
		    if ( _.isUndefined( this._hex_link[hex.get('x')] ) ) { this._hex_link[hex.get('x')] = {}; }
		    this._hex_link[hex.get('x')][hex.get('y')] = hex;
		}, this );
	    this.set('hexes', collection  );
	},
	'hexAt' : function( x, y ) {
	    if ( ! _.isUdefined( this._hex_link[x] ) ) {
		if ( ! _.isUdefined( this._hex_link[x][y] ) ) {
		    return this._hex_link[x][y]
		}
	    }
	    return null;
	},
	'_hex_link' : {},
    } );

var Game_HexMap_View = Backbone.View.extend( {
	'tagName' : 'canvas',
	'render' : function() {
	    
	},
	'_hex_views' : [],
	'initialize' : function() {
	    var hexes = this.model.get('hexes');
	    this._hex_views = [];
	    hexes.each( function( hex, index ) {
		    this._hex_views.push( new Game_Hex_View( { 'model' : hex } ) );
		}, this );
	    this.model.on( 'change', this.render, this );
	}
    } );