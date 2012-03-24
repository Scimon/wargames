var Game_Hex = Backbone.Model.extend( {
	'defaults' : {
	    'hextype' : null,
	    'features' : [],
	    'x' : 0,
	    'y' : 0,
	    'height' : 0,
	    'parent' : null,
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
	    this._hex_height = Math.sqrt( Math.pow( this.get('parent').get('hexRadius'), 2) - Math.pow( this.get('parent').get('hexRadius') /2 ,2));
	},
	'center' : function () {
	    var y = Math.round( ( this.get('y') * 2 * this._hex_height ) + ( this.get('x') * this._hex_height ) );
	    var x = Math.round( ( this.get('x') * 1.5 * this.get('parent').get('hexRadius') ) );
	    return new Vector( { 'x' : x, 'y' : y } );
	},
	'box' : function() {
	    var center = this.center();
	    var top_left = new Vector( { 'x' : center.get('x') - this.get('parent').get('hexRadius'),
					 'y' : Math.round( center.get('y') - this._hex_height ) } );
	    var bottom_right = new Vector( { 'x' : center.get('x') + this.get('parent').get('hexRadius'),
					     'y' :  Math.round( center.get('y') + this._hex_height ) } );
	    return { 'top_left' : top_left, 'bottom_right' : bottom_right };
	},

} );

var Game_Hex_View = Backbone.View.extend( {
	'tagName' : 'canvas',
	'render' : function() {
	    var height = Math.round( this.model._hex_height * 2 );
	    var width = this.model.get('parent').get('hexRadius') * 2;
	    $(this.el).attr( 'width',width ).attr( 'height',height );
	    var ctx = this.el.getContext('2d');
	    ctx.fillStyle = 'rgba( ' + ( 15 * this.model.get('x') ) + ',' + ( 15 * this.model.get('y') ) + ', 100, .75 )';
	    ctx.strokeStyle = 'rgba( 0,0,0,.75 )';
	    ctx.fillRect(0,0,width,height);
	    ctx.strokeRect(0,0,width,height);
	    return this;
	}
    } );

var Game_Hex_Collection = Backbone.Collection.extend( {
	'model' : Game_Hex,
	'initialize' : function() {	    
	}
    });