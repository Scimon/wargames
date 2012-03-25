var Game_HexMap = Backbone.Model.extend( {
	'defaults' : {
	    'hexes' : [],
	    'id' : 0,
	    'name' : '',
	    'scale' : 3,
	    'radius' : 10,
	    'hexRadius' : 30,
	    'height' : 0,
	    'width' : 0,
	    'game' : null,
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
				  hex.random = this.get('game').Alea( hex.x, hex.y );
				  return new Game_Hex( hex );
			      }, this );
	    var collection = new Game_Hex_Collection( Data );
	    collection.each( function( hex, index ) {
		    if ( _.isUndefined( this._hex_link[hex.get('x')] ) ) { this._hex_link[hex.get('x')] = {}; }
		    this._hex_link[hex.get('x')][hex.get('y')] = hex;
		    if ( hex.get('x') + 1 > this.get('width') ) { this.set('width',hex.get('x')+1); }
		    if ( hex.get('y') + 1 > this.get('height') ) { this.set('height',hex.get('y')+1); }
		}, this );
	    this.set('hexes', collection  );
	    this.on('change:radius', this._update_hexRadius, this );
	    this.on('change:scale', this._update_hexRadius, this );
	},
	'_update_hexRadius' : function() {
	    this.set( 'hexRadius', this.get( 'radius' ) * this.get('scale') );
	    this.get('hexes').each( function( hex ) {
		    hex._calc_halves();
		}, this );
	},
	'hex_at' : function( x, y ) {
	    if ( ! _.isUndefined( this._hex_link[x] ) ) {
		if ( ! _.isUndefined( this._hex_link[x][y] ) ) {
		    return this._hex_link[x][y]
		}
	    }
	    return null;
	},
	'_hex_link' : {},
	'find_hex' : function ( point ) {
	    // var x = point.get('x');
	    // var y = point.get('y');
	    // 		var hor = [ ( ( y - origin[1] ) - ( ( y - origin[1] ) % height ) + origin[1] )];
	    // 		hor[1] = ( y < origin[1] ? hor[0] - height : hor[0] + height );
	    // 		var ver = [	( ( x - origin[0] ) - ( ( x - origin[0] ) % ( radius / 2 ) ) + origin[0] ) ];
	    // 		ver[1] = ( x < origin[0] ? ver[0] - radius / 2 : ver[0] + radius / 2 );
	    // 		ver[2] = ( x < origin[0] ? ( ver[0] + ( radius / 2 ) ) : ( ver[0] - ( radius / 2 ) ) );
	    // 		var h = [];
	    // 		var d = [];
	    // 		var di = [];
	    // 		if ( x >= origin[0] && y < origin[1] ) { d = [[1,-1],[1,0]];  }
	    // 		if ( x < origin[0] && y < origin[1] ) { d = [[-1,0],[-1,1]];}
	    // 		if ( x >= origin[0] && y >= origin[1] ) { d = [[1,0],[1,-1]]; }
	    // 		if ( x < origin[0] && y >= origin[1] ) { d = [[-1,1],[-1,0]];}
	    // 		for ( var j = 0; j < 3; j++ ) { ver[j] = Math.round(ver[j]) }
	    // 		for ( var i = 0; i < 2; i++ ) {
	    // 			hor[i] = Math.round(hor[i]);
	    // 			for ( var c = 0; c < 3; c++ ) {
	    // 				var hx = this.point_to_hex([ver[c],hor[i]]);
	    // 				var check = this.hex_to_point(hx);
	    // 				if ( check[0] == ver[c] && check[1] == hor[i] ) {
	    // 					if ( c < 2 ) { 
	    // 						return hx;
	    // 					} else {
	    // 						h[0] = hx;
	    // 						h[1] = [0+h[0][0]+d[i][0],0+h[0][1]+d[i][1]];
	    // 					}
	    // 				}
	    // 			}	
	    // 		}
	    // 		if ( h.length == 0 ) { return null }	
	    // 		for ( var i = 0; i < 2; i++ ) {
	    // 			var t = this.hex_to_point(h[i]);
	    // 			di[i] = Math.sqrt(((x-t[0])*(x-t[0]))+((y-t[1])*(y-t[1])));
	    // 		}
	    // 		return di[0] < di[1] ? h[0] : h[1];
		}		

    } );

var Game_HexMap_View = Backbone.View.extend( {
	'tagName' : 'canvas',
	'attributes' : {
	    'class' : 'game-layer',
	},
	'render' : function() {
	    var bottom = this.model.hex_at( this.model.get('width') - 1, this.model.get('height') - Math.floor( ( this.model.get('width') ) / 2 ) );
	    var box = bottom.box();
	    $('.game-layer').css('width',box.bottom_right.get('x') + 'px').css('height',box.bottom_right.get('y') + 'px' );
	    $(this.el).attr( 'width',box.bottom_right.get('x') ).attr( 'height',box.bottom_right.get('y') );
	    var ctx = this.el.getContext('2d');
	    _.each( this._hex_views,function( view ) {
		    var canvas = view.render().el;
		    var box = view.model.box();
		    ctx.drawImage( canvas, box.top_left.get('x'), box.top_left.get('y') );
		}, 
		this);
	    return this;
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