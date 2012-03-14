{
	package Game::Hex::Feature::River;

	use Moose;
	extends 'Game::Hex::Feature';
	with 'Games::Hex::Vector';
	
	around BUILDARGS => sub {
		my $orig  = shift;
		my $class = shift;
		
		return $class->$orig( { 'type' => 'River' } );
	};

	__PACKAGE__->meta->make_immutable;

	'module returns true';
}
