{
	package Game::Hex::Feature;

	use Moose;
	extends 'Game::Hex::Vector';
	
	has 'type', is => 'ro', isa => 'Str';


	'module returns true';
}
