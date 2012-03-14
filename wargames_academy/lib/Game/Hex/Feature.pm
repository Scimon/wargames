{
	package Game::Hex::Feature;

	use Moose;

	has 'type', is => 'ro', isa => 'Str';

	sub apply {
		my ( $self, $hex ) = @_;
	}

	'module returns true';
}
