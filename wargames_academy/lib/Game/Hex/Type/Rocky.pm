{
	package Game::Hex::Type::Rocky;

	use Moose;

	with 'Game::Hex::Type';

	around BUILDARGS => sub {
		my $orig  = shift;
		my $class = shift;

		return $class->$orig( { 'name' => 'Rocky' } );
	};
	
	__PACKAGE__->meta->make_immutable;

	'module returns true';

}
