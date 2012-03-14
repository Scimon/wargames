{
	package Game::Hex::Type;
	
	use Moose::Role;
	use MooseX::Storage;

	with Storage('format' => 'JSON');

	
	has 'name', is => 'ro', isa => 'Str';
	
	
	'module returns true';
}
