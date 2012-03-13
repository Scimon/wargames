{
	package Game::HexType;
	
	use Moose;
	
	has 'name', is => 'rw', isa => 'Str';
	
	'module returns true';
}
