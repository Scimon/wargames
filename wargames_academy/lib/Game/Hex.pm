{
	package Game::Hex;
	
	use Moose;
	
	has 'x', is => 'rw', isa => 'Int';
	has 'y', is => 'rw', isa => 'Int';
	has 'mapid', is => 'rw', isa => 'Int', 'default' => sub { -1 };
	
	'module returns true';
}
