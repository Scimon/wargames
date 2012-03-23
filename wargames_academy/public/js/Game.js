// Top Level Game Object. Includes code for parsing into child objects
var Game = Backbone.Model.extend( {
	'defaults' : {
	    'mapdata' : {},
	},
	'makeFrom' : function( obj ) {
	    if ( _.isArray( obj ) ) {
		return _.map( obj, this.makeFrom, this );
	    }
	    if ( _.isObject( obj ) && _.has( obj, '__CLASS__' ) ) {
		var className = obj.__CLASS__.replace( /::/g, '_' );
		delete obj.__CLASS__;
		for ( var key in obj ) {
		    obj[key] = this.makeFrom( obj[key] );
		}
		return new window[className]( obj );
	    }
	    return obj;
	},
	'initialize' : function() {
	    if ( ! _.isEmpty( this.get('mapdata') ) ) {
		var Data = this.get('mapdata');
		if ( Data.__CLASS__ === 'Game::HexMap' ) {
		    delete Data.__CLASS__;
		    this.set( 'mapdata', new Game_HexMap( Data ) );		    
		} else {
		    unset( 'mapdata' );
		}
	    }
	},

} );

var GameView = Backbone.View.extend( {

    } );