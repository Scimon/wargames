{
	package Game::Hex::Feature::Slope;

	use Moose;
	extends 'Game::Hex::Feature';
	with 'Games::Hex::Vector';
	
	has 'start_height', is => 'rw', isa => 'Int';
	has 'end_height', is => 'rw', isa => 'Int';
	has 'mid_point', is => 'rw', isa => 'Int', default => sub { 50 };

	around BUILDARGS => sub {
		my $orig  = shift;
		my $class = shift;
		
		return $class->$orig( { 'type' => 'Slope' } );
	};

	__PACKAGE__->meta->make_immutable;

	'module returns true';
}
