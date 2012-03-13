{
	package Game::Hex::Feature;

	use Moose;
	extends 'Game::Hex::Vector';
	
	has 'type', is => 'ro', isa => 'Str';

	__PACKAGE__->meta->make_immutable;

	'module returns true';
}
