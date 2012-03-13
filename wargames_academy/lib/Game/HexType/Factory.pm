{
	package Game::HexType::Factory;

	use Moose;
	use Game::HexType::Grass;

	my %types = map { $_ => "Game::HexType::$_" } qw( Grass );

	sub make {
		my $self = shift;
		my $type = shift;

		if ( defined $types{$type} ) {
			return $types{$type}->new();
		} else {
			die "Unable to make a hextype of $type";
		}
	}

	__PACKAGE__->meta->make_immutable;

	'module returns true';
}
