var Game_Hex = Backbone.Model.extend( {
	'defaults' : {
	    'hextype' : null,
	    'features' : [],
	    'x' : 0,
	    'y' : 0,
	    'height' : 0,
	    'map_height' : 0,
	    'map_width' : 0,
	    'hexRadius' : 0,
	    'random' : null,
	    'selected' : 0,
	},
	'url' : function() {
	    return this.get('url');
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
	    this.set('id', this.get('map_id') + '/' + this.get('x') + '/' + this.get('y') );
	    this._calc_halves();
	    this.on('change:hexRadius', this._calc_halves, this );
	},
	'setHexType' : function(type) {
	    var className = 'Game_Hex_Type_' + type;
	    var newType = new window[className]( { 'name' : type } );
	    this.save({'hextype' : newType});
	},
	'random' : function() {
	    return globalFunctions.Alea( this.get('x'), this.get('y'), this.get('map_height'), this.get('map_width') );
	},
	'_calc_halves' : function() {
	    this._half_height = Math.round( Math.sqrt( Math.pow( this.get('hexRadius'), 2) - 
						       Math.pow( this.get('hexRadius') /2 ,2)) );
	    this._half_width = Math.round( this.get('hexRadius') );
	},
	'center' : function () {
	    var y = this._half_height + ( this.get('y') * 2 * this._half_height ) + ( this.get('x') * this._half_height );
	    var x = this._half_width + ( this.get('x') * 1.5 * this._half_width );
	    return new Vector( { 'x' : x, 'y' : y } );
	},
	'box' : function() {
	    var center = this.center();
	    var top_left = new Vector( { 'x' : center.get('x') - this._half_width,
					 'y' : center.get('y') - this._half_height } );
	    var bottom_right = new Vector( { 'x' : center.get('x') + this._half_width,
					     'y' : center.get('y') + this._half_height } );
	    return { 'top_left' : top_left, 'bottom_right' : bottom_right };
	},
	'vertices' : function() {
	    var center = this.center();
	    var hhw = Math.round( this._half_width / 2 );
	    var x = this._half_width;		
	    var y = this._half_height;
	    var ret = [];
	    ret.push( new Vector( { 'x' : x - this._half_width, 'y' : y } ) );
	    ret.push( new Vector( { 'x' : x - hhw, 'y' : y - this._half_height } ) );
	    ret.push( new Vector( { 'x' : x + hhw,'y' : y - this._half_height } ) );
	    ret.push( new Vector( { 'x' : x + this._half_width, 'y' : y } ) );
	    ret.push( new Vector( { 'x' : x + hhw, 'y' : y + this._half_height } ) );
	    ret.push( new Vector( { 'x' : x - hhw, 'y' : y + this._half_height } ) );
	    return ret;
	},

} );

var Game_Hex_View = Backbone.View.extend( {
	'tagName' : 'canvas',
	'render' : function() {
	    var height = this.model._half_height * 2;
	    var width = this.model._half_width * 2;
	    $(this.el).attr( 'width',width ).attr( 'height',height );
	    var ctx = this.el.getContext('2d');
	    ctx.strokeStyle = 'rgba( 0,0,0,1 )';
	    ctx.lineWidth = 1.5;

	    ctx.save();
	    this.follow_path( ctx, this.model.vertices() );
	    ctx.clip();

	    this.model.get('hextype').draw( ctx, this.model );

	    if ( this.model.get('selected') ) {
			this.greyscale( ctx, width, height, 255 );
			ctx.fillStyle = 'rgba( 255,0,0,0.25 )';
			ctx.fillRect(0,0,width,height);
	    }

	    ctx.restore();
	    this.follow_path( ctx, this.model.vertices() );
	    ctx.stroke();

	    return this;
	},
	'greyscale' : function(ctx,width,height,weight) {
		var imgPixels = ctx.getImageData(0, 0, width, height);

		for( var y = 0; y < imgPixels.height; y++){
			for( var x = 0; x < imgPixels.width; x++){
				var i = (y * 4) * imgPixels.width + x * 4;
				var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
				if ( ! _.isNull( weight ) ) {
					avg = ( avg + weight ) / 2;
				}
				imgPixels.data[i] = avg;
				imgPixels.data[i + 1] = avg;
				imgPixels.data[i + 2] = avg;
			}
		}
		ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);

	},
	'follow_path' : function( ctx, list ) {
	    ctx.beginPath();	
	    var point1 = list.pop();
	    ctx.moveTo( point1.get('x'), point1.get('y') );
	    while ( list.length > 0 ) {
		var point = list.pop();
		ctx.lineTo( point.get('x'), point.get('y') );
	    }
	    ctx.lineTo( point1.get('x'), point1.get('y') );
	},    
    } );

var Game_Hex_Collection = Backbone.Collection.extend( {
	'model' : Game_Hex,
	'url' : function() { return '' },
	'initialize' : function() {	    
	}
    });