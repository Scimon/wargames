package WargamesAcademy::Admin;
use 5.010;  
use strict;	
use warnings;
    
use Mojo::Base 'Mojolicious::Controller';
    
sub index {
    my $self = shift;
	return $self->redirect_to('/system_login') unless $self->session('user');

    $self->render_text('Main method of Admin controller called.');
}

1;
