{
	package Game::HexType::Grass;

	use Moose;

	with 'Game::HexType';

	around BUILDARGS => sub {
		my $orig  = shift;
		my $class = shift;

		return $class->$orig( { 'name' => 'Grass' } );
	};
	
	__PACKAGE__->meta->make_immutable;

	'module returns true';

}
