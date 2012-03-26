{
	package Game::Hex::Type::Town;

	use Moose;

	with 'Game::Hex::Type';

	around BUILDARGS => sub {
		my $orig  = shift;
		my $class = shift;

		return $class->$orig( { 'name' => 'Town' } );
	};
	
	__PACKAGE__->meta->make_immutable;

	'module returns true';

}
