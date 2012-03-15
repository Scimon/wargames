{
	package Game::Hex::Feature::Factory;

	use Moose;
	use JSON;

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

	sub thaw {
	    my $self = shift;
	    my $json = shift;

	    my $decoded = decode_json( $json );
	    my $object;
	    if ( defined $decoded->{'__CLASS__'} ) {
		$object = $decoded->{'__CLASS__'}->thaw( $json );
	    }
	    return $object;
	}

	__PACKAGE__->meta->make_immutable;

	'module returns true';
}
