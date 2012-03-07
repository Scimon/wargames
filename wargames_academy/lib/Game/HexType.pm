{
	package Game::HexType;
	
	use Moose;
	
	has 'id', is => 'rw', isa => 'Int';
	has 'name', is => 'rw', isa => 'Str';
	
	'module returns true';
}