{
	package Game::Hex::Type::Water;

	use Moose;

	with 'Game::Hex::Type';

	around BUILDARGS => sub {
		my $orig  = shift;
		my $class = shift;

		return $class->$orig( { 'name' => 'Water' } );
	};
	
	__PACKAGE__->meta->make_immutable;

	'module returns true';

}
