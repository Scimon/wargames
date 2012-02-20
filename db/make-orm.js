var orm = require("orm");
orm.connect("mysql://wargames:ed34CV%^@localhost/wargames_dev", function (success, db) {
    if (!success) {
        console.log("Could not connect to database!");
        return;
    }

    // you can now use db variable to define models
	var Hextype = db.define( 'hextype',
		{ 'name' : { 'type' : 'string' } },
		{ 'methods' : {} } 
	);
	var Hexmap = db.define( 'hexmap',
		{ 'name' : { 'type' : 'string' } },
		{ 'methods' : { } }
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
	
	console.log( "Hextypes" );
	Hextype.sync();
	console.log( "Hexes" );
	Hex.sync();
	console.log( "Hexmaps" );
	Hexmap.sync();
	return;
});
console.log( "Done" );