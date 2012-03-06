package WargamesAcademy::Site;
use 5.010;
use strict;	
use warnings;
    
use Mojo::Base 'Mojolicious::Controller';

sub index {
	my $self = shift;
	$self->holding();
}
    
sub holding {
    my $self = shift;

    $self->render_text('Nothing to see here.');
}

1;
