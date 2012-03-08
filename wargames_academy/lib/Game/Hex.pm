{
	package Game::Hex;
	
	use Moose;
	use Game::HexType;
	use Game::Hex::Vector;
	
	has 'x', is => 'rw', isa => 'Int';
	has 'y', is => 'rw', isa => 'Int';
	has 'map', is => 'rw', isa => 'Game::HexMap';
	has 'hextype', is => 'rw', isa => 'Game::HexType';
	has 'height_base', is => 'rw', isa => 'Int';
	has 'height_end', is => 'rw', isa => 'Int';
	has 'slope', is => 'rw', isa => 'Game::Hex::Vector';
	
	'module returns true';
}


