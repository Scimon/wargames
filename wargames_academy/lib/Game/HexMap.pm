{
	package Game::HexMap;
	
	use Moose;
	use Game::Hex;
	
	has 'hexes', is => 'rw', isa => 'ArrayRef[Game::Hex]', default => sub { [] }, 'trigger' => '_set_id_for_hexes';
	has 'id', is => 'rw', 'isa' => 'Int', 'default' => sub { -1 }, 'trigger' => '_set_id_for_hexes';
	
	sub _set_id_for_hexes {
		my $self = shift;
		if ( $self->id() > -1 ) {
			$self->hexes = [ map { $_->mapid( $self->id() ) } @$self->hexes ];
		}
	}
	
	'module returns true';
}
