{
	package Game::Hex::Feature;

	use Moose;
	
	has 'type', is => 'ro', isa => 'Str';

	'module returns true';
}
