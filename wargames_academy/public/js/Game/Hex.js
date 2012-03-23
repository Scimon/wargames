var Game_Hex = Backbone.Model.extend( {
	'defaults' : {
	    'hextype' : null,
	    'features' : [],
	    'x' : 0,
	    'y' : 0,
	    'height' : 0,
	},
	'initialize' : function() {
	    if ( this.has( '__CLASS__' ) ) {
		this.unset( '__CLASS__' );
	    }
	    if ( this.has( 'hextype' ) ) {
		var obj = this.get('hextype');
		var className = obj.__CLASS__.replace( /::/g, '_' );
		this.set('hextype', new window[className]( obj ) );
	    }
	    var Data = _.map( this.get('features'),  
			      function( obj ) { 
				  var className = obj.__CLASS__.replace( /::/g, '_' );
				  delete obj.__CLASS__;
				  return new window[className]( obj ); 
			      } );
	    this.set('features', new Game_Hex_Feature_Collection( Data ) );

	}
} );

var Game_Hex_Collection = Backbone.Collection.extend( {
	'model' : Game_Hex,
	'initialize' : function() {	    
	}
    });