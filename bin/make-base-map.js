var orm = require("orm");
orm.connect("mysql://wargames:ed34CV%^@localhost/wargames_dev", function (success, db) {
    if (!success) {
        console.log("Could not connect to database!");
        process.exit( 1 );
    }
	var Hextype = db.define( 'hextype',
		{ 'name' : { 'type' : 'string' } },
		{ 'methods' : {} } 
	);
	var Hex = db.define( 'hex', 
		{ 'x' : { 'type' : 'int' },
		  'y' : { 'type' : 'int' } },
		{ 'methods' : {} }

	);
	var Hexmap = db.define( 'hexmap',
		{ 'name' : { 'type' : 'string' } },
		{ 'methods' : { 
			'populate' : function( height, width ) {
				for ( var x = 0; x < width; x++ ) {
					var top = 0 - Math.floor(x/2);
					for ( var y = 0; y < height; y++ ) {
					    var hex = new Hex( { 'x': x, 'y': y, 'type' : this.default_type } );
					    var aH = function( t ) { return function( h ) { t.addHexes( h, function(){} ); } }( this );
					    hex.save( function( e, h ) {
						    if ( ! e ) { aH( h ); }
					    });
					}
				}
				return this;
			}
		}
		}
	);
	Hex.hasOne( 'type', Hextype );
	Hexmap.hasMany( 'hexes', Hex, 'hex' );
	Hexmap.hasOne( 'default_type', Hextype );
	Hextype.sync( function(err) { if ( err ) { console.dir(err) } } );
	Hex.sync( function(err) { if ( err ) { console.dir(err) } } );
	Hexmap.sync( function(err) { if ( err ) { console.dir(err) } } );	


	
	Hextype.find( {'name':'grass'}, function(types) {
		var grass;
		console.log( types );
		if ( types === null ) {
		    console.log( "Making Grass" );
		    grass = new Hextype( { 'name' : 'grass' } );
		    grass.save(function (err, copy) {
			    if (!err) {
				console.log("Saved! ID=" + copy.id); 
			    } else {
				console.log("Something went wrong...");
				console.dir(err);
			    }
			});
		} else {
		    grass = types[0];
		}
		console.log( grass );
		var map = new Hexmap( { 'name' : 'Test' } );
		map.setDefault_type( grass );
		map.save(function( e, copy ) {
			if ( ! e ) {
			    copy.populate( 2, 2 ).save(function( e ) {
				    process.exit(0);
				});
			}
		    });
	    } );

	//	var map = new Hexmap( { 'name' : 'Test', 'default_type' : grass } );
	// map.populate( 5, 5 );
	
	//process.exit(0);
    } );
