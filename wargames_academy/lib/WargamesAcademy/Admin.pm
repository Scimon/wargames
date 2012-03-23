package WargamesAcademy::Admin;
use 5.010;  
use strict;	
use warnings;
    
use Mojo::Base 'Mojolicious::Controller';
    
use Game::Collection::HexMap;
use Game::HexMap;

sub index {
    my $self = shift;
    return $self->redirect_to('/system_login') unless $self->session('user');

    $self->stash( 'title' => "Index" );
    $self->render;
}

sub map {
    my $self = shift;
    return $self->redirect_to('/system_login') unless $self->session('user');

    my $id = $self->stash( 'id' );
    my $map = new Game::HexMap( 'id' => $id );
    $map->load();
    
    $self->stash( 'title' => 'Edit : ' . $map->name(), 
				  'Map' => $map,
				  'map_json' => $map->freeze(),
				  'modules' => [ 'Game', 'Game_HexMap', 'Game_Hex', 'Game_Hex_Feature', 'Game_Hex_Vector', 'Game_Hex_Feature_River', 'Game_Hex_Feature_Slope', 'Game_Hex_Type', 'Game_Hex_Type_Grass' ] );

    $self->render;
}

sub maps {
    my $self = shift;
    return $self->redirect_to('/system_login') unless $self->session('user');

    $self->stash( 'title' => "Maps List", 'collection' => new Game::Collection::HexMap() ); 

    $self->render;
}

1;
