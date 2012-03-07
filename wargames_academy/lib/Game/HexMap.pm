{
	package Game::HexMap;
	
	use Moose;
	use Game::Hex;
	
	has 'hexes', is => 'rw', isa => 'ArrayRef[Game::Hex]', default => sub { [] }, 'trigger' => \&_set_id_for_hexes;
	has 'id', is => 'rw', 'isa' => 'Int', 'default' => sub { -1 }, 'trigger' => \&_set_id_for_hexes;
	
	sub add_hex {
		my $self, $hex = @_;
		$self->hexes( [@{$self->hexes()},$hex] );
	}
	
	sub _set_id_for_hexes {
		my $self = shift;
		if ( $self->id() > -1 ) {
			foreach my $hex ( @{$self->hexes()} ) {
				$hex->mapid( $self->id() );
			}
		}
	}
	
	'module returns true';
}
