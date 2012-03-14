{
	package Game::HexMap;
	
	use Moose;
	use MooseX::Storage;

	with Storage('format' => 'JSON');

	use Game::Hex;
	use Game::Hex::Type::Factory;
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
		my $factory = new Game::Hex::Type::Factory();
		for ( my $x = 0; $x < $width; $x++ ) {
			my $top = -( floor( $x / 2 ) );
			for ( my $l = 0; $l < $height; $l++ ) {
				my $y = $top + $l;
				$self->hexes()->{$x}->{$y} = new Game::Hex( 'x' => $x, 'y' => $y, 'map' => $self, 'type' => $factory->make( $default_type ) );
			}
		}
	}

	__PACKAGE__->meta->make_immutable;

	'module returns true';
}
