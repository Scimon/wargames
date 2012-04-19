{
	package Game::Hex::Feature::Factory;

	use Moose;
	use JSON;

	use Game::Hex::Feature::Slope;
	use Game::Hex::Feature::River;
	use Game::Hex::Feature::Height;
	use Game::Hex::Feature::Road;
	use Game::Hex::Feature::Bridge;


	my @typelist = qw( River Road Bridge Slope Height );
	my %types = map { $_ => "Game::Hex::Feature::$_" } @typelist;

	sub features_available {
	    return @typelist;
	}

	sub make {
		my $self = shift;
		my $type = shift;
		my @args = @_;

 		if ( ref($type) eq ref({}) ) {
			my %args = %{$type};
			$type = $args{'type'};
			@args = %args;
		}

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
