{
	package Game::HexMap;
	
	use Moose;
	use Game::Hex;
	use POSIX qw( floor );
	
	has 'hexes', is => 'rw', isa => 'HashRef[HashRef[Game::Hex]]', default => sub { {} };
	has 'id', is => 'rw', 'isa' => 'Int', 'default' => sub { -1 };
	has 'name', is => 'rw', isa => 'Str';
	
	sub add_hexes {
		my ( $self, @hexes ) = @_;
		foreach my $hex ( @hexes ) {
			$hex->map( $self );
			$self->hexes()->{$hex->x()}->{$hex->y()} = $hex;
		}
	}
	
	sub _set_parent_for_hexes {
		my $self = shift;
		foreach my $x ( keys %{$self->hexes()} ) {
			my $ref = $self->hexes($x);
			foreach my $y ( keys %{$self->hexes()->{$x}} ) {
				$self->hexes()->{$x}->{$y}->map($self);
			}
		}
	}
	
	sub make_map {
		my ( $self, $height, $width, $default_type  ) = @_;
		for ( my $x = 0; $x < $width; $x++ ) {
			my $top = -( floor( $x / 2 ) );
			for ( my $y = 0; $y < $height; $y++ ) {
				
				$self->hexes()->{$x}->{$top + $y} = new Game::Hex( 'x' => $x, 'y' => $y, 'map' => $self, 'hextype' => $default_type );
			}
		}
	}

	'module returns true';
}
