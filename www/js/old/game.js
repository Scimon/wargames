var Game = function( id ) {
	// Check 
	var wrapper = $('#' + id )[0];
	if ( wrapper ) {
		$(wrapper).append( '<div class="back layer" id="' + id + '-back"></div>' );
		$(wrapper).append( '<canvas class="layer" id="' + id + '-map"></canvas>' );
		return {
		    'mapData' : { 'height' : 0, 'width' : 0, 'basehex' : {}, 'grid' : {}, 'hexes' : {}  },
			'displayData' :	{ 
			    
			    'baseRadius' : 10,
                            'baseWidth' : ( 0.6 ),
							'scale' : null, 
							'radius' : 10,
							'lineWidth' : 1 / 4,
							'canvas' : {
								'map' : $('#' + id + '-map')[0].getContext('2d')
							},
							'position' : [0,0],
							'size' : [0,0],
							'wrappersize' : [wrapper.clientWidth,wrapper.clientHeight],
							'types' : new Types(),
							'hexcanvas' : {}
			},
			'loadMapData' : function( data ) {
			    var keys = [ 'height', 'width', 'hexes','basehex'];
				for( var i in keys ) {
					var key = keys[i];
					if ( data[key] != null ) {
						this.mapData[key] = data[key];
					}
				}
				this.refresh();
                                this.setScale();
				this.displayData.position = [0,0];
				this.updatePosition();
			},
			'refresh' : function() {			
				this.mapData.grid = new HexMap( null, this.displayData.radius );
				this.displayData.hexcanvas = this.mapData.grid.hexcanvas();
				this.displayData.types.prepare( this.displayData.hexcanvas.height, this.displayData.hexcanvas.width );
				var lastBox = this.mapData.grid.box( [ this.mapData.width - 1, 
				                                       this.mapData.height - Math.floor( ( this.mapData.width ) / 2 )  ] ); 
				this.displayData.size = [lastBox.br[0], lastBox.br[1]];
				$('#' + id + ' .layer').css('width',this.displayData.size[0] + 'px').css('height',this.displayData.size[1] + 'px' );
				$('#' + id + ' canvas').attr('width',this.displayData.size[0]).attr('height',this.displayData.size[1]);
				var list = hexGrid( [0,0], this.mapData.width, this.mapData.height );
				for ( var p,i = 0; p = list[i];i++ ) {
				    var gridref = p[0] + 'x' + p[1];

				    if ( this.mapData.hexes[gridref] == null ) {
					this.mapData.hexes[gridref] = this.mapData.basehex;	
				    }
				    for ( var type in this.mapData.hexes[gridref].t ) {
					type = this.mapData.hexes[gridref].t[type];
					var t = type.t;
					var r = type.r == null ? {} : type.r;
					this.drawHex( 'map', p[0], p[1], t, r );
				    }
//					this.drawHex( 'map', p[0],p[1], 'g', {} );
				}
			//	for ( var h,i = 0; h = this.mapData.hexes[i]; i++ ) {
			//		this.drawHex( 'map', h.x, h.y, h.t, h.r );
			//	}
			},
			'movePosition' : function( dx, dy ) {
				var dData = this.displayData;
				this.changePosition( dData.position[0] + ( dx * dData.radius ), dData.position[1] + ( dy * dData.radius ) );
			},
			'changePosition' : function( x, y ) {
				var dData = this.displayData;
				dData.position[0] = x;
				dData.position[1] = y;
				this.updatePosition();
			},
			'updatePosition' : function() {
				var dData = this.displayData;
				var xPos = Math.round( ( dData.wrappersize[0] - dData.size[0] ) / 2 ) + dData.position[0]; 
				var yPos = Math.round( ( dData.wrappersize[1] - dData.size[1] ) / 2 ) + dData.position[1]; 
				$('#' + id + ' .layer').css('top',yPos + 'px').css('left',xPos + 'px');
			},
			'followPath' : function( id, list ) {
				var ctx = this.displayData.canvas[id];
				ctx.beginPath();	
				if ( list.length == 0 ) { return }
				var point1 = list.pop();
				ctx.moveTo( point1[0], point1[1] );
				while ( list.length > 0 ) {
				        var point = list.pop();
					ctx.lineTo( point[0], point[1] );
				}
				ctx.lineTo( point1[0], point1[1] );
			},
		    'curvePoints' : function( p, x, y ) {
			var cp1, cp2;
			var vec = new Vector( [p[1][0]-p[0][0],p[1][1] - p[0][1]] );
			var s = new Vector( p[0] );
			// Generate 4 numbers
			var r = new Alea( x, y, this.mapData.height,  this.mapData.width );
			if ( r() < 0.5 ) {
			    cp1 = vec.scale(0.4).add(vec.tangent().scale(-3/10)).add(s).toArray();
			    cp2 = vec.scale(0.6).add(vec.tangent().scale(3/10)).add(s).toArray();
			} else {
			    cp1 = vec.scale(0.4).add(vec.tangent().scale(3/10)).add(s).toArray();
			    cp2 = vec.scale(0.6).add(vec.tangent().scale(-3/10)).add(s).toArray();
			}


			cp1[0] += ( r() * this.displayData.scale * 6 ) - (this.displayData.scale * 3 );						
			cp1[1] += ( r() * this.displayData.scale * 6 ) - (this.displayData.scale * 3 );			
			cp2[0] += ( r() * this.displayData.scale * 6 ) - (this.displayData.scale * 3 );			
			cp2[1] += ( r() * this.displayData.scale * 6 ) - (this.displayData.scale * 3 );

			return [cp1,cp2];
		    },
			'drawHex' : function( id, x, y, type, details ) {
			    // first up drawn a line from top to bottom
			    var ctx = this.displayData.canvas[id];
			    ctx.lineWidth = this.displayData.lineWidth;

			   // var points = this.mapData.grid.sidepoints([x,y]);
			   // var controls = this.curvePoints( [ points[1], points[4] ], x, y );
			   // ctx.beginPath();
			   // ctx.moveTo( points[1][0], points[1][1] );
			  //  ctx.bezierCurveTo( controls[0][0], controls[0][1], controls[1][0], controls[1][1], points[4][0], points[4][1] );
			   // ctx.stroke();

			    var r = new Alea( x, y, this.mapData.height,  this.mapData.width );

				// First up we need to call the type code.
				var imagepoints = this.mapData.grid.hex_to_point( [x,y] );
				imagepoints[0] -= this.displayData.hexcanvas.width / 2;
				imagepoints[1] -= this.displayData.hexcanvas.height / 2;
				
				ctx.save();
				this.followPath( id, this.mapData.grid.vertices([x,y]));
				ctx.clip();
			    ctx.drawImage( this.displayData.types.draw( type, details, r, this.displayData.scale ), imagepoints[0], imagepoints[1] );
				ctx.restore();
				this.followPath( id, this.mapData.grid.vertices([x,y]));
				ctx.stroke();
			},
			'setScale' : function( value ) {
				if ( value == null && this.displayData.scale == null ) {
					value = 3;
				}
				value = Math.round( value * 1 );
				if ( value >= 1 && value <= 15 ) {
					var delta = value / this.displayData.scale;
					this.displayData.position[0] = Math.round( this.displayData.position[0] * delta );
					this.displayData.position[1] = Math.round( this.displayData.position[1] * delta );
					this.displayData.scale = value;
					this.displayData.radius = value * this.displayData.baseRadius ;
					this.displayData.lineWidth = value * this.displayData.baseWidth;
					this.refresh();
					this.updatePosition();
				}
				return this.displayData.scale;
			}
		};
	} else {
		return null;
	}
}

function Alea() {
  return (function(args) {
    // Johannes BaagÃ¸e <baagoe@baagoe.com>, 2010
    var s0 = 0;
    var s1 = 0;
    var s2 = 0;
    var c = 1;

    if (args.length == 0) {
      args = [+new Date];
    }
    var mash = Mash();
    s0 = mash(' ');
    s1 = mash(' ');
    s2 = mash(' ');

    for (var i = 0; i < args.length; i++) {
      s0 -= mash(args[i]);
      if (s0 < 0) {
        s0 += 1;
      }
      s1 -= mash(args[i]);
      if (s1 < 0) {
        s1 += 1;
      }
      s2 -= mash(args[i]);
      if (s2 < 0) {
        s2 += 1;
      }
    }
    mash = null;

    var random = function() {
      var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
      s0 = s1;
      s1 = s2;
      return s2 = t - (c = t | 0);
    };
    random.uint32 = function() {
      return random() * 0x100000000; // 2^32
    };
    random.fract53 = function() {
      return random() + 
        (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
    };
    random.version = 'Alea 0.9';
    random.args = args;
    return random;

  } (Array.prototype.slice.call(arguments)));
};

function Mash() {
  var n = 0xefc8249d;

  var mash = function(data) {
    data = data.toString();
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  mash.version = 'Mash 0.9';
  return mash;
}

