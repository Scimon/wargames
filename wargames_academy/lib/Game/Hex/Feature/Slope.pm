{
	package Game::Hex::Feature::Slope;

	use Moose;
	use MooseX::Storage;
	
	with Storage('format' => 'JSON');
	extends 'Game::Hex::Feature';
	with 'Game::Hex::Vector';
	

	has 'start_height', is => 'rw', isa => 'Int', default => 1;
	has 'end_height', is => 'rw', isa => 'Int', default => 1;
 
	around BUILDARGS => sub {
		my $orig  = shift;
		my $class = shift;
		
		return $class->$orig( { @_, 'type' => 'Slope' } );
	};

	sub apply {
		my ( $self, $hex ) = @_;
		$hex->height( ( $self->start_height() + $self->end_height() ) / 2 );
	}


	__PACKAGE__->meta->make_immutable;

	'module returns true';
}
