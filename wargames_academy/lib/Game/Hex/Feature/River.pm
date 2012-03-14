{
	package Game::Hex::Feature::River;

	use Moose;
	extends 'Game::Hex::Feature';
	with 'Game::Hex::Vector';
	
	around BUILDARGS => sub {
		my $orig  = shift;
		my $class = shift;
		
		return $class->$orig( { @_, 'type' => 'River' } );
	};

	__PACKAGE__->meta->make_immutable;

	'module returns true';
}
