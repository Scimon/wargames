{
	package Game::Squad;
	use Moose;

	use Game::Troop;

	has 'troop' => is => 'rw', isa => 'Game::Troop'; 
	has 'squad_size' => is => 'rw', isa => 'Int', default => 1;

	'module returns true';
}
