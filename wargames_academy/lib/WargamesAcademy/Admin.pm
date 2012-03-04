package WargamesAcademy::Admin;
    
use strict;	
use warnings;
    
use base 'Mojolicious::Controller';
    
sub index {
    my $self = shift;
	return $self->redirect_to('/system_login') unless $self->session('user');

    $self->render_text('Main method of Admin controller called.');
}

1;