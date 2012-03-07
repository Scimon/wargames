{
	package Game::Hex;
	
	use Moose;
	use Game::HexType;
	
	has 'x', is => 'rw', isa => 'Int';
	has 'y', is => 'rw', isa => 'Int';
	has 'map', is => 'rw', isa => 'Game::HexMap';
	has 'hextype', is => 'rw', isa => 'Game::HexType';
	
	'module returns true';
}
