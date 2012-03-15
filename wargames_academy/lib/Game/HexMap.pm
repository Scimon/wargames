{
	package Game::HexMap;
	
	use Moose;
	use MooseX::Storage;

	with Storage('format' => 'JSON');

	use Game::Hex;
	use Game::Hex::Type::Factory;
	use POSIX qw( floor );

	use DBI;
	
	has 'hexes' => ( is => 'rw', 
					 isa => 'ArrayRef[Game::Hex]', 
					 traits =>  ['Array'], 
					 handles => {
						 'add_hex' => 'push',
						 'remove_hexes' => 'clear',
						 'hex_list' => 'elements',
						 'map_hexes' => 'map',
					 },
					 default => sub { [] }
		);
	has 'id', is => 'rw', 'isa' => 'Int', 'default' => sub { 0 };
	has 'name', is => 'rw', isa => 'Str', 'default' => sub { '' };
			
	sub make_map {
		my ( $self, $height, $width, $default_type  ) = @_;
		my $factory = new Game::Hex::Type::Factory();
		for ( my $x = 0; $x < $width; $x++ ) {
			my $top = -( floor( $x / 2 ) );
			for ( my $l = 0; $l < $height; $l++ ) {
				my $y = $top + $l;
				my $hex = new Game::Hex( 'x' => $x, 
										 'y' => $y, 
										 'mapid' => $self->id(),
										 'type' => $factory->make( $default_type ) );
				$self->add_hex( $hex );
			}
		}
	}

	sub save {
		my $self = shift;

		my $dbh = DBI->connect("DBI:mysql:database=wargames_dev;host=localhost", "wargames", 'ed34CV%^');

		if ( $self->id() ) {
			$dbh->prepare( "UPDATE hexmap SET name = ? WHERE id = ?", undef, ( $self->name(), $self->id() ) );
		} else {
			$dbh->prepare( "INSERT INTO hexmap ( name ) VALUES ( ? )", undef, ( $self->name() ) );
			$self->id( $dbh->last_insert_id() );
			$self->map_hexes( $_->mapid( $self->id() ) );
		}
	}

	__PACKAGE__->meta->make_immutable;

	'module returns true';
}
