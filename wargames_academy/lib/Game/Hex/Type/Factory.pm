{
	package Game::Hex::Type::Factory;

	use Moose;
	use Game::Hex::Type::Grass;

	my %types = map { $_ => "Game::Hex::Type::$_" } qw( Grass Water Wood Forest Town Rocky Arid );

	sub make {
		my $self = shift;
		my $type = shift;

		if ( ref( $type ) ) {
			$type = $type->name();
		}

		if ( defined $types{$type} ) {
			return $types{$type}->new();
		} else {
			die "Unable to make a hextype of $type";
		}
	}

	__PACKAGE__->meta->make_immutable;

	'module returns true';
}
