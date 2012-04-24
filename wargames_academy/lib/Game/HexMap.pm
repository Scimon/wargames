{
    package Game::HexMap;
	
    use Moose;
	use Moose::Util::TypeConstraints;
    use MooseX::Storage;
    
    with Storage('format' => 'JSON');
    
    use Game::Hex;
    use Game::Hex::Type::Factory;
    use Game::Hex::Feature::Factory;
    use POSIX qw( floor );
    use JSON;    
	use Database;

	enum 'MapStatus', [qw( edit live archive )];
    
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
    has 'url', is => 'rw', isa => 'Str', 'default' => '', 'trigger' => \&_set_url;
    has 'status', is => 'rw', isa => 'MapStatus', 'default' => sub { 'edit' };

    sub _set_url {
	my ( $self, $url ) = @_;
	
	$url = $url . '/' . $self->id();
	$self->{url} = $url;
	foreach my $hex ( $self->hex_list() ) {
	    $hex->url( $url );
	}
    }

    sub hex_at {
	my ( $self, $x, $y ) = @_;
	foreach my $hex ( $self->hex_list() ) {
	    if ( $hex->x() == $x && $hex->y() == $y ) {
		return $hex;
	    }
	}
	return undef;
    }

    sub make_map {
	my ( $self, $height, $width, $default_type  ) = @_;
	my $factory = new Game::Hex::Type::Factory();
	for ( my $x = 0; $x < $width; $x++ ) {
	    my $top = -( floor( $x / 2 ) );
	    for ( my $l = 0; $l < $height; $l++ ) {
		my $y = $top + $l;
		my $hex = new Game::Hex( 'x' => $x, 
					 'y' => $y, 
					 'map_id' => $self->id(),
					 'hextype' => $factory->make( $default_type ) );
		$self->add_hex( $hex );
	    }
	}
    }

	sub BUILD {
		my $self = shift;
		my $args = shift;
		
		if ( $args->{load} ) {
			delete $args->{load};
			$self->id( $args->{id} );
			$self->load();
		}
	}
    
    sub save {
	my $self = shift;
	my $dbh = Database::connection();
	
	if ( $self->id() ) {
	    $dbh->do( "UPDATE hexmap SET name = ? WHERE id = ?", undef, ( $self->name(), $self->id() ) );
	    $self->map_hexes( sub { $_->map_id( $self->id() ) } );
	} else {
	    $dbh->do( "INSERT INTO hexmap ( name ) VALUES ( ? )", undef, ( $self->name() ) );
	    $self->id( $dbh->last_insert_id(undef, undef, undef, undef) );
	    $self->map_hexes( sub { $_->map_id( $self->id() ) } );
	}

	foreach my $hex ( $self->hex_list() ) {
	    $hex->save();
	}
    }
    
    sub load {
		my $self = shift;
		if ( $self->id() ) {
			my $dbh = Database::connection();
			my @data = $dbh->selectrow_array( "SELECT name FROM hexmap WHERE id = ?",undef, $self->id() );
			$self->name( $data[0] );
			
			my $sth = $dbh->prepare( "SELECT x,y FROM hex WHERE map_id = ?" );
			$sth->execute( $self->id() );
			
			while ( my $row = $sth->fetchrow_hashref() ) {
				my $hex = new Game::Hex({ 'load' => 1, 'x' => $row->{'x'}, 'y' => $row->{'y'}, 'map_id' => $self->id()});
				$self->add_hex( $hex );
			}
		}
    }

    __PACKAGE__->meta->make_immutable;
    
    'module returns true';
}
