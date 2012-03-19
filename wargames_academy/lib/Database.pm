{
	package Database;
	use DBI;

	sub connection {
		return DBI->connect("DBI:mysql:database=wargames_dev;host=localhost", "wargames", 'ed34CV%^');
	}

	'module returns true';
}
