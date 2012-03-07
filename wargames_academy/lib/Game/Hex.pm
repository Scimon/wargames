{
	package Game::Hex;
	
	use Moose;
	
	has 'x', is => 'rw', isa => 'Int';
	hax 'y', is => 'rw', isa => 'Int';
}