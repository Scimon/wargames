package WargamesAcademy::Admin;
    
use strict;	
use warnings;
    
use base 'Mojolicious::Controller';
    
sub welcome {
    my $self = shift;

    $self->render_text('Welcome method of Admin controller called.');
}

1;