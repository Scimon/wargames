{
	package Game::Hex;
	
	use Moose;
	use Game::HexType;
	use Game::Hex::Feature;
	
	has 'x', is => 'rw', isa => 'Int';
	has 'y', is => 'rw', isa => 'Int';
	has 'map', is => 'rw', isa => 'Game::HexMap';
	has 'hextype', is => 'rw', isa => 'Game::HexType';
	has 'height', is => 'rw', isa => 'Num'; 
	has 'features', is => 'rw', isa => 'ArrayRef[Game::Hex::Feature]';
	
	'module returns true';
}


