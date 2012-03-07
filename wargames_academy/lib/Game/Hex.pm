{
	package Game::Hex;
	
	use Moose;
	
	has 'x', is => 'rw', isa => 'Int';
	has 'y', is => 'rw', isa => 'Int';
	
	'module returns true';
}
