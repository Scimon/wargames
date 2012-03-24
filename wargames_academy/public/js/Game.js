// Top Level Game Object. Includes code for parsing into child objects
var Game = Backbone.Model.extend( {
	'defaults' : {
	    'mapdata' : {},
	},
	'makeFrom' : function( obj ) {
	    if ( _.isArray( obj ) ) {
		return _.map( obj, this.makeFrom, this );
	    }
	    if ( _.isObject( obj ) && _.has( obj, '__CLASS__' ) ) {
		var className = obj.__CLASS__.replace( /::/g, '_' );
		delete obj.__CLASS__;
		for ( var key in obj ) {
		    obj[key] = this.makeFrom( obj[key] );
		}
		return new window[className]( obj );
	    }
	    return obj;
	},
	'initialize' : function() {
	    if ( ! _.isEmpty( this.get('mapdata') ) ) {
		var Data = this.get('mapdata');
		if ( Data.__CLASS__ === 'Game::HexMap' ) {
		    delete Data.__CLASS__;
		    Data.game = this;
		    this.set( 'mapdata', new Game_HexMap( Data ) );		    
		} else {
		    unset( 'mapdata' );
		}
	    }
	},
	'Alea' : function() {
	    var gameRoot = this;
	    return (function(args) {
		    // Johannes Baagøe <baagoe@baagoe.com>, 2010
		    var s0 = 0;
		    var s1 = 0;
		    var s2 = 0;
		    var c = 1;
		    
		    if (args.length == 0) {
			args = [+new Date];
		    }
		    var mash = gameRoot.Mash();
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
	},
	'Mash' : function() {
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

} );

var Game_View = Backbone.View.extend( {
 
    } );