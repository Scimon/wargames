{
	package Game::HexMap;
	
	use Moose;
	use Game::Hex;
	
	has 'hexes', is => 'rw', isa => 'ArrayRef[Game::Hex]';
	
	'module returns true';
}
