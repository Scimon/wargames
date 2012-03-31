{
	package Game::Hex::Type::Factory;

	use Moose;
	use Game::Hex::Type::Grass;
	use Game::Hex::Type::Water;
	use Game::Hex::Type::Forest;
	use Game::Hex::Type::Wood;
	use Game::Hex::Type::Town;	
	use Game::Hex::Type::Rocky;
	use Game::Hex::Type::Arid;
	
	my @typelist = qw( Grass Water Wood Forest Town Rocky Arid );
	my %types = map { $_ => "Game::Hex::Type::$_" } @typelist;

	sub types_available {
	    return @typelist;
	}

	sub make {
		my $self = shift;
		my $type = shift;

		if ( ref( $type ) eq ref( {} ) ) {
		    $type = $type->{name};
		} elsif ( ref( $type ) ) {
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
