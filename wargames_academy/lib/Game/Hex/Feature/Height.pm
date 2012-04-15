{
	package Game::Hex::Feature::Height;

	use Moose;
	use MooseX::Storage;
	
	with Storage('format' => 'JSON');
	extends 'Game::Hex::Feature';
	
	has 'height', is => 'rw', isa => 'Int', default => 1;

	around BUILDARGS => sub {
	    my $orig  = shift;
	    my $class = shift;
	    
	    return $class->$orig( { @_, 'type' => 'Height' } );
	};

	sub apply {
	    my ( $self, $hex ) = @_;
	    $hex->height( $self->height() ); 
	}
	

	__PACKAGE__->meta->make_immutable;

	'module returns true';
}

