{
	package Game::Hex::Feature;

	use Moose;
	extends 'Game::Hex::Vector';

	has 'name', is => 'rw', 'isa' => 'Str';


	'module returns true';
}
