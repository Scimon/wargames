package WargamesAcademy::Admin;
use 5.010;  
use strict;	
use warnings;
    
use Mojo::Base 'Mojolicious::Controller';
    
use Game::Collection::HexMap;

sub index {
    my $self = shift;
    return $self->redirect_to('/system_login') unless $self->session('user');

    $self->stash( 'title' => "Index" );
    $self->render;
}

sub maps {
    my $self = shift;
    return $self->redirect_to('/system_login') unless $self->session('user');

    $self->stash( 'title' => "Maps List", 'collection' => new Game::Collection::HexMap() );
  

    $self->render;
}

1;
