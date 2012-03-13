{
	package Game::HexType;
	
	use Moose::Role;
	
	has 'name', is => 'ro', isa => 'Str';
	
	
	'module returns true';
}
