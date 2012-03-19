{
	package Game::Hex;
	
	use Moose;
	use Game::Hex::Type;
	use Game::Hex::Feature;
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


