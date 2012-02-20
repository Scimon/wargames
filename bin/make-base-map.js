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
	var Hexmap = db.define( 'hexmap',
		{ 'name' : { 'type' : 'string' } },
		{ 'methods' : { 
			'populate' : function( height, width ) {
				for ( var x = 0; x < width; x++ ) {
					var top = 0 - Math.floor(x/2);
					for ( var y = 0; y < height; y++ ) {
						var hex = new Hex( { 'x', x, 'y', y, 'type' : this.default_type } );
						this.addHex( hex );
					}
				}
			}
		}
		}
	);
	var Hex = db.define( 'hex', 
		{ 'x' : { 'type' : 'int' },
		  'y' : { 'type' : 'int' } },
		{ 'methods' : {} }

	);
	Hex.hasOne( 'type', Hextype );
	Hex.hasOne( 'map', Hexmap );
	Hexmap.hasMany( 'hexes', Hex, 'hex' );
	Hexmap.hasOne( 'default_type', Hextype );

	var grass;
	Hextype.find( {'name':'grass'}, function(types) ) {
		if ( types === null ) {
			grass = Hextype.new( { 'name' : 'grass' } );
			grass.save();
		} else {
			grass.types[0];
		}
	}
	var map = new Hexmap( { 'name' : 'Test', 'default_type' : grass } );
	map.populate( 5, 5 );
		
	process.exit(0);
}
