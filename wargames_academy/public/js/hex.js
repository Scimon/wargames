function bCurve( start, end, p1, p2 ) {
	calc = function(t,p0,p1,p2,p3) {
		return ( ( Math.pow(1-t,3) * p0 ) + ( 3 * Math.pow(1-t,2) * t * p1 ) + ( 3 * (1-t) * Math.pow(t,2) * p2 ) + ( Math.pow(t,3) * p3 ) ); 
	}
	var ret = [];
	for ( var x = 0; x <= 1; x += 0.025 ) {
		ret.push( [calc(x,start[0],p1[0],p2[0],end[0]),calc(x,start[1],p1[1],p2[1],end[1])] );
	}
	return ret;
}
var Vector = function(v) {
	return {
		'magnitude' : function() {
			return Math.sqrt( ( v[0] * v[0] ) + ( v[1] * v[1] ) );
		},
		'unit' : function() {
			var m = this.magnitude();
			return new Vector( [v[0]/m,v[1]/m] );
		},
		'tangent' : function() {
			return new Vector([-v[1],v[0]] );
		},
		'scale' : function(s) { 
			return new Vector([v[0] * s, v[1] * s] );
		},
		'add' : function(v1) {
			return new Vector([v[0] + v1.x(),v[1] + v1.y()] );
		},
		'x' : function() { return v[0] },
		'y' : function() { return v[1] },
		'toArray' : function() { return v }
	};
}
function closest_point( p, list ) {
	var dists = [];
	for ( var i = 0; i < list.length; i++ ) {
		var vec = new Vector([p[0]-list[i][0],p[1]-list[i][1]]);
		dists.push( [list[i],vec.magnitude()] );
	}
	return dists.sort( function(a,b) { return a[1] < b[1] ? -1 : b[1] < a[1] ? 1 : 0 } )[0][0]; 
}

function hexGrid( start, width , height ) {
	var points = [];
	for ( var x = 0; x < width; x++ ) {
		var top = start[1] - Math.floor(x/2);
		for ( var y = 0; y < height; y++ ) {
			points.push( [ start[0] + x, top + y ] );
		}
	}
	return points;
}

function fullCircle( point, radius ) {
	points = [point];
	while ( radius > 0 ) {
		points = points.concat( hexCircle( point,radius ) );
		radius--;
	}
	return points;
}

function hexCircle( point, radius ) {
	var points = [];
	for ( var l = 0; l < radius; l++ ) {
		points.push( [point[0] + l, point[1] - radius] );
		points.push( [point[0] + radius, point[1] - radius + l] );
		points.push( [point[0] + radius - l, point[1] + l] );
		points.push( [point[0] - l, point[1] + radius] );
		points.push( [point[0] - radius, point[1] + radius - l] );
		points.push( [point[0] - radius + l, point[1] - l] );
	}
	return points;
}

var HexMap = function( origin, radius ) {
	var height = Math.sqrt( Math.pow( radius, 2) - Math.pow( radius /2 ,2));
	if ( origin == null ) {
		origin = [radius,height];
	}

	return {
//		'origin' : origin,
//		'radius' : radius, 
		'hexcanvas' : function() {
			return { 'height' : height * 2, 'width' : radius * 2 };
		},
		'box' : function(hex) {
			var point = this.hex_to_point( hex );
			return { 'tl' : [point[0]-radius,Math.round( point[1]-height )], 'br' : [point[0]+radius,Math.round( point[1]+height )] };
		},
	    'hex_to_point' : function (hex) {
			var y = Math.round( origin[1] + ( hex[1] * 2 * height ) + ( hex[0] * height ) );
			var x = Math.round( origin[0] + ( hex[0] * 1.5 * radius ) );
			return [x,y];
		},
		'point_to_hex' : function (point) {
			var x = Math.round( ( point[0] - origin[0] ) / ( 1.5 * radius ) );
			var y = Math.round( ( ( point[1] - origin[1] ) - ( x * height ) ) / ( 2 * height ) );
			return [x,y];
		},
		'vertices' : function(center) {
			var hr = radius / 2;
			var hh = height / 2;
			var qr = radius / 4;
			var tqr = qr * 3;
			var t = this.hex_to_point(center);
			var x = t[0];		
			var y = t[1];
			var ret = [];
			ret.push([x-radius,y]);
			ret.push([x-hr,y-height]);
			ret.push([x+hr,y-height]);
			ret.push([x+radius,y]);
			ret.push([x+hr,y+height]);
			ret.push([x-hr,y+height]);
			return ret;
		},
		'sidepoints' : function(center) {
			var hr = radius / 2;
			var hh = height / 2;
			var qr = radius / 4;
			var tqr = qr * 3;
			var t = this.hex_to_point(center);
			var x = t[0];		
			var y = t[1];
			var ret = [];
			ret.push([x-tqr,y-hh]);
			ret.push([x,y-height]);
			ret.push([x+tqr,y-hh]);
			ret.push([x+tqr,y+hh]);
			ret.push([x,y+height]);
			ret.push([x-tqr,y+hh]);
			return ret;
		},
		'cardinal' : function( center, code ) {
			if ( code == 'C' ) {
				return this.hex_to_point(center);
			} else {
				var m = code.match( /(V|S)(\d)/ );
				if ( m[1] == 'V' ) {
					return this.vertices(center)[m[2]];
				} else if ( m[1] = 'S' ) {
					return this.sidepoints(center)[m[2]];
				} 
			}
			return;
		},
		'find_cardinal' : function (center,point) {
			var check = [this.hex_to_point(center)];
			var map = {}
			map[check[0].join('x')] = 'C';
			var list = this.vertices(center);
			for ( var i = 0; i < list.length; i++ ) {
				map[list[i].join('x')] = 'V' + i;
			}
			check = check.concat(list);
			list = this.sidepoints(center);
			for (i = 0; i < list.length; i++ ) {
				map[list[i].join('x')] = 'S' + i;
			}
			check = check.concat(list);
			point = closest_point(point,check);
			return map[point.join('x')];
		},
		'find_hex' : function (point) {
			var x = point[0];
			var y = point[1];
			var hor = [ ( ( y - origin[1] ) - ( ( y - origin[1] ) % height ) + origin[1] )];
			hor[1] = ( y < origin[1] ? hor[0] - height : hor[0] + height );
			var ver = [	( ( x - origin[0] ) - ( ( x - origin[0] ) % ( radius / 2 ) ) + origin[0] ) ];
			ver[1] = ( x < origin[0] ? ver[0] - radius / 2 : ver[0] + radius / 2 );
			ver[2] = ( x < origin[0] ? ( ver[0] + ( radius / 2 ) ) : ( ver[0] - ( radius / 2 ) ) );
			var h = [];
			var d = [];
			var di = [];
			if ( x >= origin[0] && y < origin[1] ) { d = [[1,-1],[1,0]];  }
			if ( x < origin[0] && y < origin[1] ) { d = [[-1,0],[-1,1]];}
			if ( x >= origin[0] && y >= origin[1] ) { d = [[1,0],[1,-1]]; }
			if ( x < origin[0] && y >= origin[1] ) { d = [[-1,1],[-1,0]];}
			for ( var j = 0; j < 3; j++ ) { ver[j] = Math.round(ver[j]) }
			for ( var i = 0; i < 2; i++ ) {
				hor[i] = Math.round(hor[i]);
				for ( var c = 0; c < 3; c++ ) {
					var hx = this.point_to_hex([ver[c],hor[i]]);
					var check = this.hex_to_point(hx);
					if ( check[0] == ver[c] && check[1] == hor[i] ) {
						if ( c < 2 ) { 
							return hx;
						} else {
							h[0] = hx;
							h[1] = [0+h[0][0]+d[i][0],0+h[0][1]+d[i][1]];
						}
					}
				}	
			}
			if ( h.length == 0 ) { return null }	
			for ( var i = 0; i < 2; i++ ) {
				var t = this.hex_to_point(h[i]);
				di[i] = Math.sqrt(((x-t[0])*(x-t[0]))+((y-t[1])*(y-t[1])));
			}
			return di[0] < di[1] ? h[0] : h[1];
		}		
	}
};
