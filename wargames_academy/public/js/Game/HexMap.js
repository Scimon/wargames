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
	    var x = point.get('x');
	    var y = point.get('y');
	    var half_height = Math.round( Math.sqrt( Math.pow( this.get('hexRadius'), 2) - 
						     Math.pow( this.get('hexRadius') /2 ,2)) );
	    var half_width = this.get('hexRadius');

	    var ver = [ ( ( y - half_height ) - ( ( y - half_height ) % half_height ) + half_height )];
	    ver[1] = ( y < half_height ? ver[0] - half_height : ver[0] + half_height );
	    var hor = [	( ( x - half_width ) - ( ( x - half_width ) % ( half_width / 2 ) ) + half_width ) ];
	    hor[1] = ( x < half_width ? hor[0] - half_width / 2 : hor[0] + half_width / 2 );
	    hor[2] = ( x < half_width ? ( hor[0] + ( half_width / 2 ) ) : ( hor[0] - ( half_width / 2 ) ) );
	    var h = [];
	    var d = [];
	    var di = [];
	    if ( x >= half_width && y < half_height ) { d = [[1,-1],[1,0]];  }
	    if ( x < half_width && y < half_height ) { d = [[-1,0],[-1,1]];}
	    if ( x >= half_width && y >= half_height ) { d = [[1,0],[1,-1]]; }
	    if ( x < half_width && y >= half_height ) { d = [[-1,1],[-1,0]];}
	    for ( var j = 0; j < 3; j++ ) { hor[j] = Math.round(hor[j]) }
	    for ( var i = 0; i < 2; i++ ) {
		ver[i] = Math.round(ver[i]);
		for ( var c = 0; c < 3; c++ ) {
		    var hx = this.point_to_hex( 0 + hor[c], 0 + ver[i]);
		    var check = this.hex_to_point(hx.get('x'),hx.get('y'));
		    
		    if ( check.get('x') == hor[c] && check.get('y') == ver[i] ) {
			if ( c < 2 ) { 
			    return this.hex_at( hx.get('x'), hx.get('y') );
			} else {
			    h[0] = [hx.get('x'),hx.get('y')];
			    h[1] = [hx.get('x') + d[i][0] ,hx.get('y') +d[i][1]];
			}
		    }
		}	
	    }
	    if ( h.length == 0 ) { return null }	
	    for ( var i = 0; i < 2; i++ ) {
		var cy = half_height + ( h[1] * 2 * half_height ) + ( h[0] * half_height );
		var cx = half_width + ( h[0] * 1.5 * half_width );
		di[i] = Math.sqrt(((x-cx)*(x-cx))+((y-cy)*(y-cy)));
	    }
	    if ( di[0] < di[1] ) {
		return this.hex_at( h[0][0], h[0][1] );
	    } else {
		return this.hex_at( h[1][0], h[1][1] );
	    }	
	},
	'point_to_hex' : function ( x, y ) {
	    var half_height = Math.round( Math.sqrt( Math.pow( this.get('hexRadius'), 2) - 
						     Math.pow( this.get('hexRadius') /2 ,2)) );
	    var half_width = this.get('hexRadius');
	    var cx = Math.round( ( x - half_width ) / ( 1.5 * half_width ) );
	    var cy = Math.round( ( ( y - half_height ) - ( cx * half_height ) ) / ( 2 * half_height ) );
	    return new Vector( { 'x' : cx, 'y' : cy } );
	},
	'hex_to_point' : function( x, y ) {
	    var half_height = Math.round( Math.sqrt( Math.pow( this.get('hexRadius'), 2) - 
						     Math.pow( this.get('hexRadius') /2 ,2)) );
	    var half_width = this.get('hexRadius');
	    var cx = half_width + ( x * 1.5 * half_width );
	    var cy = half_height + ( y * 2 * half_height ) + ( x * half_height );
	    return new Vector( { 'x' : cx, 'y' : cy } )
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
	    _.each( this._hex_views, function( view ) { this.render_part( view, ctx ) }, this);
	    return this;
	},
	'render_part' : function( view, ctx ) {
		if ( ! ctx ) { ctx = this.el.getContext('2d'); }
		var canvas = view.render().el;
		var box = view.model.box();
		ctx.drawImage( canvas, box.top_left.get('x'), box.top_left.get('y') );
	},
	'events' : {
	    'click' : 'select_hex',
	},
	'select_hex' : function(e) {
	    var position = $(this.el).offset();
	    var x = Math.round( e.pageX - position.left );
	    var y = Math.round( e.pageY - position.top);
	    var hex = this.model.find_hex( new Vector( { 'x' : x, 'y': y } ) );
	    this.model.get( 'game' ).select_hex( hex );
	},
	'_hex_views' : [],
	'initialize' : function() {
	    var hexes = this.model.get('hexes');
	    this._hex_views = [];
	    hexes.each( function( hex, index ) {
			var hex_view = new Game_Hex_View( { 'model' : hex } );
	    	    this._hex_views.push( hex_view );
	    	}, this );
	    hexes.on( 'change', this.render, this );
	    this.model.on( 'change', this.render, this );
	}
    } );