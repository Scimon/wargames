{
	package Game::Unit;
	use Moose;
	
	use Game::Squad;

	has 'squads' => ( is => 'rw', 
			 isa => 'ArrayRef[Game::Squad]', 
			 traits =>  ['Array'], 
			 handles => {
			     'add_squad' => 'push',
			     'remove_squad' => 'clear',
			     'squad_list' => 'elements',
			     'map_squads' => 'map',
			 },
			 default => sub { [] }
	    );
	

	'module returns true';
}
