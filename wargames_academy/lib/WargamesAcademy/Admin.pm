package WargamesAcademy::Admin;
    
use strict;	
use warnings;
    
use base 'Mojolicious::Controller';
    
sub main {
    my $self = shift;

    $self->render_text('Main method of Admin controller called.');
}

1;