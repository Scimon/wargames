{
	package Game::HexMap;
	
	use Moose;
	use Game::Hex;
	
	has 'hexes', is => 'rw', isa => 'ArrayRef[Game::Hex]', default => sub { [] }, 'trigger' => \&_set_parent_for_hexes;
	has 'id', is => 'rw', 'isa' => 'Int', 'default' => sub { -1 };
	has 'name', is => 'rw', isa => 'Str';
	
	sub add_hex {
		my ( $self, $hex ) = @_;
		$self->hexes( [@{$self->hexes()},$hex] );
	}
	
	sub _set_parent_for_hexes {
		my $self = shift;
		foreach my $hex ( @{$self->hexes()} ) {
			$hex->map( $self );
		}
	}
	
	'module returns true';
}
