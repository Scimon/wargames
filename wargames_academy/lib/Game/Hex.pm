{
	package Game::Hex;
	
	use Moose;
	use Game::Hex::Type::Factory;
	use Game::Hex::Feature::Factory;
	use JSON;
	use MooseX::Storage;
    use Database;

	with Storage('format' => 'JSON');

	has 'map_id', is => 'rw', isa => 'Int';
	has 'x', is => 'rw', isa => 'Int';
	has 'y', is => 'rw', isa => 'Int';
	has 'hextype', is => 'rw', isa => 'Game::Hex::Type';
	has 'height', is => 'rw', isa => 'Num', default => 1; 
	has 'features' => (
		trigger => \&_apply_features,
		is => 'rw', 
		isa => 'ArrayRef[Game::Hex::Feature]', 
		traits =>  ['Array'], 
		default => sub { [] },
		handles => {
			'add_feature' => 'push',
			'remove_features' => 'clear',
			'feature_list' => 'elements',
			'map_features' => 'map',
		},
	);
	
	sub _apply_features {
		my $self = shift;

		foreach my $feature ( $self->feature_list() ) {
			$feature->apply( $self );
		}
	}

	sub BUILD {
		my $self = shift;
		my $args = shift;
		
		if ( $args->{load} ) {
			delete $args->{load};
			$self->load( $args->{map_id}, $args->{x}, $args->{y} );
		}
	}
	
	sub load {
		my $self = shift;
		my ( $map_id, $x, $y ) = @_;
		my $dbh = Database::connection();

		$self->map_id($map_id);
		$self->x($x);
		$self->y($y);
		
		my $type_fac = new Game::Hex::Type::Factory();
		my $feature_fac = new Game::Hex::Feature::Factory();
		
		my $sth = $dbh->prepare( "SELECT x,y,hextype,features FROM hex WHERE map_id = ?" );
		$sth->execute( $self->map_id() );
						
		if ( my $row = $sth->fetchrow_hashref() ) {
			$self->hextype( $type_fac->make( $row->{'hextype'} ) );
			my $features = decode_json( $row->{'features'} );
			foreach my $json ( @{$features} ) {
				$self->add_feature( $feature_fac->thaw( $json ) );
			}		
		}
	}

	sub save {
	    my $self = shift;
	    my $dbh = Database::connection();

	    if ( $self->map_id() ) {
		my $features = encode_json( [ $self->map_features( sub { $_->freeze() } ) ] );
		$dbh->do( "INSERT INTO hex ( map_id, x, y, hextype, features ) 
                           VALUES ( ?, ?, ?, ?, ? )
                           ON DUPLICATE KEY UPDATE hextype = ?, features = ?", undef,
			  $self->map_id(), $self->x(), $self->y(),
			  $self->hextype()->name(), $features, $self->hextype()->name(), $features );
	    }

	}

	__PACKAGE__->meta->make_immutable;
	
	'module returns true';
}


