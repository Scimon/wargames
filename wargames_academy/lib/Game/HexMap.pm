{
	package Game::HexMap;
	
	use Moose;
	use Game::Hex;
	
	has 'hexes', is => 'ArrayRef[Game::Hex];
	
	'module returns true';
}
