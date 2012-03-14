{
	package Game::Hex;
	
	use Moose;
	use Game::HexType;
	use Game::Hex::Feature;
	
	has 'x', is => 'rw', isa => 'Int';
	has 'y', is => 'rw', isa => 'Int';
	has 'map', is => 'rw', isa => 'Game::HexMap';
	has 'hextype', is => 'rw', isa => 'Game::HexType';
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
			'feature_list' => 'elements'
		},
		);
	
	sub _apply_features {
		my $self = shift;

		foreach my $feature ( $self->feature_list() ) {
			use Data::Dumper;
			print Dumper( $feature );
			$feature->apply( $self );
		}
	}

	__PACKAGE__->meta->make_immutable;
	
	'module returns true';
}


