package WargamesAcademy::Admin;
use 5.010;  
use strict;	
use warnings;
    
use Mojo::Base 'Mojolicious::Controller';
    
use Game::Collection::HexMap;
use Game::HexMap;
use Game::Hex;
use JSON;

use Data::Dumper;

sub index {
    my $self = shift;
    return $self->redirect_to('/system_login') unless $self->session('user');

    $self->stash( 'title' => "Index" );
    $self->render;
}

sub hex {
    my $self = shift;
    return $self->redirect_to('/system_login') unless $self->session('user');

    my $req = $self->req();
    
    if ( $req->is_xhr ) {
	if ( $req->method() eq 'PUT' ) {
	    my $data = decode_json( $req->content->asset->slurp() );
	    $data->{url} = '/admin/map/' . $data->{map_id};
	    my $hex = new Game::Hex( { 'load' => 1, 'map_id' => $self->stash('id'), 'x' => $self->stash('x'), 'y' => $self->stash('y') } );
	    $hex->update( $data );
	    $self->render( text => $hex->freeze(), format => 'json' );
	}
    }
    
}

sub map {
    my $self = shift;
    return $self->redirect_to('/system_login') unless $self->session('user');
    
    my $req = $self->req();

    if ( $req->method() eq 'POST' ) {
	my $map = new Game::HexMap();
	$map->make_map( $req->param('height'), $req->param('width'), 'Grass' );
	$map->name( $req->param('name') );
	$map->save();
	return $self->redirect_to('/admin/map/'.$map->id());
    } else {
	my $id = $self->stash( 'id' );
	my $map = new Game::HexMap( 'id' => $id, load => 1 );
	$map->url('/admin/map');
	my $type_fac = new Game::Hex::Type::Factory();
	my $feature_fac = new Game::Hex::Feature::Factory();
	my @type_modules = map { "Game/Hex/Type/$_" } $type_fac->types_available();
	my @feature_modules = map { "Game/Hex/Feature/$_" } $feature_fac->features_available();
	my @editor_feature_modules = map { "Editor/Feature/$_" } $feature_fac->features_available();
	
	$self->stash( 
	    'title' => 'Edit : ' . $map->name(), 
	    'Map' => $map,
	    'map_json' => $map->freeze(),
	    'types' => [ $type_fac->types_available() ],
	    'features' => [ $feature_fac->features_available() ],
	    'modules' => [ 
		'Vector',
		'Game/Hex/Feature', 
		'Editor/Feature',
		'Game/Hex/Vector', 
		'Game/Hex/Type', 
		'Game/Hex', 	  
		'Game/HexMap', 
		'Game', 
		'Editor',
		@type_modules,
		@feature_modules,
		@editor_feature_modules
	    ] 
	    );
	
	$self->render;
	}
}

sub maps {
    my $self = shift;
    return $self->redirect_to('/system_login') unless $self->session('user');

    $self->stash( 'title' => "Maps List", 'collection' => new Game::Collection::HexMap() ); 

    $self->render;
}

1;
