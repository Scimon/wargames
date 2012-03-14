{
	package Game::Hex::Feature::Factory;

	use Moose;
	use Game::Hex::Feature::Slope;
	use Game::Hex::Feature::River;

	my %types = map { $_ => "Game::Hex::Feature::$_" } qw( Slope River );

	sub make {
		my $self = shift;
		my $type = shift;
		my @args = @_;

		if ( defined $types{$type} ) {
			return $types{$type}->new( @args );
		} else {
			die "Unable to make a Feature of type $type";
		}
	}

	__PACKAGE__->meta->make_immutable;

	'module returns true';
}
