var Vector = Backbone.Model.extend( {
	'defaults' : {
	    'x' : 0,
	    'y' : 0,
	},
	'magnitude' : function() {
	    return Math.sqrt( ( this.get('x') * this.get('x') ) + ( this.get('y') * this.get('y') ) );
	},
	'unit' : function() {
	    var m = this.magnitude();
	    return new Vector( { 'x' : this.get('x')/m, 'y' : this.get('y')/m } );
	},
	'tangent' : function() {
	    return new Vector( { 'x' : -this.get('y'), 'y' : this.get('x') } );
	},
	'scale' : function(s) { 
	    return new Vector( { 'x' : this.get('x') * s, 'y' : this.get('y') * s } );
	},
	'add' : function(vec) {
	    return new Vector( { 'x' : this.get('x') + vec.get('x'), 'y' : this.get('y') + vec.get('y') } );
	},
	'sub' : function(vec) {
	    return new Vector( { 'x' : this.get('x') - vec.get('x'), 'y' : this.get('y') - vec.get('y') } );
	}, 
} );
