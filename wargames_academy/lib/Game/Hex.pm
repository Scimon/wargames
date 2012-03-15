{
	package Game::Hex;
	
	use Moose;
	use Game::Hex::Type;
	use Game::Hex::Feature;

	use MooseX::Storage;

	with Storage('format' => 'JSON');

	has 'mapid', is => 'rw', isa => 'Int';
	has 'x', is => 'rw', isa => 'Int';
	has 'y', is => 'rw', isa => 'Int';
	has 'type', is => 'rw', isa => 'Game::Hex::Type';
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
			$feature->apply( $self );
		}
	}

	__PACKAGE__->meta->make_immutable;
	
	'module returns true';
}


