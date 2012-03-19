{
    package Game::Collection::HexMap;

    use Moose;
    use Game::HexMap;
    use Database;

    has list => (
	is => 'ro', 
	isa => 'ArrayRef[Game::HexMap]', 
	traits =>  ['Array'], 
	lazy => 1,
	builder => '_load_list',
	handles => {
	    'elements' => 'elements',
	    'count' => 'count',
	    'is_empty' => 'is_empty',
	    'get' => 'get',
	},
      	);
    
    sub _load_list {
	my $dbh = Database::connection();

	my $sth = $dbh->prepare( "SELECT id FROM hexmap" );
	$sth->execute();

	my @array = ();

	while ( my ( $id ) = $sth->fetchrow_array() ) {
	    my $map = new Game::HexMap( 'id' => $id );
	    $map->load();
	    push @array, $map;
	}

	return \@array;
    }
    'module returns true';
}
