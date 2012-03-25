function processPoint( grid, point ) {
	var sides = grid.sidepoints([0,0]);
	var corners = grid.vertices([0,0]);
	var from = point.match( /^([sc])(\d)$/ );
	if ( from.length == 3 ) {
		from = from[1] == 's' ? sides[from[2]] : corners[from[2]];
	} else { 
		from = sides[0];
	}
	return from;
}

function curvePoints( p, r, scale ) {
	var cp1, cp2;
	var vec = new Vector( [p[1][0]-p[0][0],p[1][1] - p[0][1]] );
	var s = new Vector( p[0] );
	// Generate 4 numbers
	if ( r() < 0.5 ) {
		cp1 = vec.scale(0.4).add(vec.tangent().scale(-3/10)).add(s).toArray();
		cp2 = vec.scale(0.6).add(vec.tangent().scale(3/10)).add(s).toArray();
	} else {
		cp1 = vec.scale(0.4).add(vec.tangent().scale(3/10)).add(s).toArray();
		cp2 = vec.scale(0.6).add(vec.tangent().scale(-3/10)).add(s).toArray();
	}


	cp1[0] += ( r() * scale * 6 ) - (scale * 3 );						
	cp1[1] += ( r() * scale * 6 ) - (scale * 3 );			
	cp2[0] += ( r() * scale * 6 ) - (scale * 3 );			
	cp2[1] += ( r() * scale * 6 ) - (scale * 3 );

	return [cp1,cp2];
}

var Types = function() {
	var types = {
	    // Grass
	    'g' : function( ctx, grid, details, r, scale ) {
			var data = grid.hexcanvas();
			var h = data.height;
			var w = data.width;
                var base = 130;
		if ( details.h != null ) {
			if ( details.h <= 0 ) { // Water in here.
			    ctx.fillStyle = 'rgb( 0, ' + ( 80 + ( details.h * 40 ) ) + ', 0 )';
				base = 110 + ( details.h * 40 );				
			} else {
				ctx.fillStyle = 'rgb( 0, ' + ( 80 + ( details.h * 40 ) ) + ', 0 )';
				base = 110 + ( details.h * 40 );
			}
		} else {
		    var sides = grid.sidepoints([0,0]);
		    var corners = grid.vertices([0,0]);
		    
		    var from = processPoint( grid, details.f );
		    var to = processPoint( grid, details.t );

		    var lineargradient = ctx.createLinearGradient(from[0],from[1],to[0],to[1]);
		    lineargradient.addColorStop(0,'rgb( 0, ' + ( 80 + ( details.hf * 40 ) ) + ', 0 )'); 
		    lineargradient.addColorStop(1,'rgb( 0, ' + ( 80 + ( details.ht * 40 ) ) + ', 0 )'); 
		    ctx.fillStyle =  lineargradient;
		    base = Math.floor( 110 + ( ( ( details.hf + details.ht ) / 2 ) * 40 ) );
		}
		     	ctx.fillRect(0,0,w,h);
		     for ( var g = base; g > base - 50; g = g - 10 ) {
		     	ctx.fillStyle = 'rgba( ' + g + ', ' + g + ', 0, 0.08 )';
		     	ctx.beginPath();
		     	var rad = Math.floor( ( r() * ( h / 2 ) ) + ( h / 4 ) );
		     	var cx = Math.floor( r() * ( w - ( rad * 2 ) ) ) + rad; 
		     	var cy = Math.floor( r() * ( h - ( rad * 2 ) ) ) + rad; 
		     	ctx.arc( cx, cy, rad, 0 , Math.PI * 2, false );
		     	ctx.fill();
		     }

		}, 
	    // River
		'r' : function( ctx, grid, details, r, scale ) {
			var sides = grid.sidepoints([0,0]);
			var corners = grid.vertices([0,0]);
			
			var from = processPoint( grid, details.f );
			var to = processPoint( grid, details.t );
			
			var controls = curvePoints( [ from, to ], r, scale );
			  
			
			ctx.strokeStyle = 'rgba( 75, 75, 0, 0.5 )';
			ctx.lineCap = 'round';
			ctx.lineWidth = scale * 5;
			ctx.beginPath();
			ctx.moveTo( from[0], from[1] );
			ctx.bezierCurveTo( controls[0][0], controls[0][1], controls[1][0], controls[1][1], to[0], to[1] );
			ctx.stroke();
			ctx.strokeStyle = 'rgba( 0, 0, 150, 0.75 )';
			ctx.lineCap = 'round';
			ctx.lineWidth = scale * 4;
			//ctx.shadowOffsetX = 0;
			//ctx.shadowOffsetY = 0;
			//ctx.shadowBlur = 20;
			//ctx.shadowColor = 'rgba( 15, 15, 0, 1 )';

			ctx.beginPath();
			ctx.moveTo( from[0], from[1] );
			ctx.bezierCurveTo( controls[0][0], controls[0][1], controls[1][0], controls[1][1], to[0], to[1] );
			ctx.stroke();
				
		}
	};	
	return {
		'canvas' : null,
		'grid' : null,
		'exists' : function ( type ) {
			return !! types[type];
		},
		'prepare' : function( height, width ) {
			this.canvas = document.createElement("canvas");
			this.canvas.height = height;
			this.canvas.width = width;
			this.grid = new HexMap( null, width / 2 );
		},
		'clear' : function() {
			this.canvas.width = this.canvas.width;
		},
	    'draw' : function( type, details, r , scale ) {
			if ( this.exists(type) ) {
				this.clear();
				types[type]( this.canvas.getContext('2d'), this.grid, details, r, scale );
			} 
			return this.canvas;
		}
	}
}