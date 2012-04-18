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
	    'scale' : 0,
	    'random' : null,
	    'selected' : 0,
	},
	'url' : function() {
	    return this.get('url');
	},
	'check_load' : function() {
	    if ( this.has( '__CLASS__' ) ) {
		this.load_data();
	    }
	},
	'load_data' : function() {
	    if ( this.has( '__CLASS__' ) ) {
                this.unset( '__CLASS__' );
            }
            if ( this.has( 'hextype' ) && this.get('hextype')['__CLASS__']  ) {
                var obj = this.get('hextype');
                var className = obj.__CLASS__.replace( /::/g, '_' );
                this.set('hextype', new window[className]( obj ) );
            }
            var Data = _.map( this.get('features'),
                              function( obj ) {
				  if ( obj['__CLASS__'] ) {
				      var className = obj.__CLASS__.replace( /::/g, '_' );
				      delete obj.__CLASS__;
				      return new window[className]( obj );
				  } else {
				      return obj;
				  }
                              } );
            this.set('features', new Game_Hex_Feature_Collection( Data ) );
	    this.get('features').bind( 'change', this.updateFeatures, this );
            this.set('id', this.get('map_id') + '/' + this.get('x') + '/' + this.get('y') );
	},
	'initialize' : function() {
	    this.load_data();
	    this._calc_halves();
	    this.on('change:hexRadius', this._calc_halves, this );
	},
	'updateFeatures' : function() {
	    var selected = this.get('selected');
	    this.save( { 'features' : this.get('features') },{'wait':true});
	    this.set('selected',selected);
	},
	'setHexType' : function(type) {
	    var className = 'Game_Hex_Type_' + type;
	    var newType = new window[className]( { 'name' : type } );
	    var selected = this.get('selected');
	    this.save({'hextype' : newType},{'wait':true});
	    this.set('selected',selected);
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
	'sides' : function() {
	    var hh = Math.round( this._half_height / 2 );
	    var tqr = Math.round( this._half_width / 4 * 3 );
	    var x = this._half_width;		
	    var y = this._half_height;
	    var ret = [];
	    ret.push( new Vector( { 'x' : x - tqr, 'y' : y - hh } ) );
	    ret.push( new Vector( { 'x' : x , 'y' : y - this._half_height } ) );
	    ret.push( new Vector( { 'x' : x + tqr, 'y' : y - hh } ) );
	    ret.push( new Vector( { 'x' : x + tqr, 'y' : y + hh } ) );
	    ret.push( new Vector( { 'x' : x , 'y' : y + this._half_height } ) );
	    ret.push( new Vector( { 'x' : x - tqr, 'y' : y + hh } ) );
	    return ret;
	},
	'processPoint' : function( point ) {
	    var sides = this.sides();
	    var corners = this.vertices();
	    var from = point.match( /^([sc])(\d)$/ );
	    if ( from.length == 3 ) {
		from = from[1] == 's' ? sides[from[2]] : corners[from[2]];
	    } else { 
		from = sides[0];
	    }
	    return from;
	}

} );

var Game_Hex_View = Backbone.View.extend( {
	'tagName' : 'canvas',
	'render' : function() {
	    this.model.check_load();
	    var height = this.model._half_height * 2;
	    var width = this.model._half_width * 2;
	    $(this.el).attr( 'width',width ).attr( 'height',height );
	    var ctx = this.el.getContext('2d');
	    ctx.strokeStyle = 'rgba( 0,0,0,1 )';
	    ctx.lineWidth = this.model.get('scale') / 2;

	    ctx.save();
	    this.follow_path( ctx, this.model.vertices() );
	    ctx.clip();

	    this.model.get('hextype').draw( ctx, this.model );
	    
	    if ( this.model.get('selected') ) {
		ctx.strokeStyle = 'rgba( 255,0,0,0.5 )';
		ctx.lineWidth = this.model.get('scale') * 5;
		this.follow_path( ctx, this.model.vertices() );
		ctx.stroke();
	    }

	    ctx.restore();
	    this.follow_path( ctx, this.model.vertices() );
	    ctx.stroke();

	    return this;
	},
	'greyscale' : function(ctx,width,height,spread) {
	    var imgPixels = ctx.getImageData(0, 0, width, height);
	    var min = 255;
	    var max = 0;

	    for( var y = 0; y < imgPixels.height; y++){
		for( var x = 0; x < imgPixels.width; x++){
		    var i = ( (y * 4) * imgPixels.width ) + ( x * 4) ;
		    var avg = Math.floor( (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3 );
		    min = min > avg ? avg : min;
		    max = max < avg ? avg : max;
		    imgPixels.data[i] = avg;
		}
	    }
	    var diff = max - min;
	    var mid = Math.floor( min + ( diff / 2 ) );
	    var mult = Math.floor( spread / diff );
	    for( var y = 0; y < imgPixels.height; y++){
		for( var x = 0; x < imgPixels.width; x++){
		    var i = ( (y * 4) * imgPixels.width ) + ( x * 4) ;
		    var val = imgPixels.data[i];
		    val = Math.floor( ( ( val - mid ) * mult ) + mid );
		    imgPixels.data[i] = val;
		    imgPixels.data[i + 1] = val;
		    imgPixels.data[i + 2] = val;
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