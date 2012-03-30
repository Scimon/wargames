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

sub hex {
	my $self = shift;
    return $self->redirect_to('/system_login') unless $self->session('user');
}

sub map {
    my $self = shift;
    return $self->redirect_to('/system_login') unless $self->session('user');

	my $req = $self->request();

	if ( $req->method() eq 'POST' ) {
		my $map = new Game::HexMap();
		$map->make_map( $self->stash('height'), $self->stash('width'), 'Grass' );
		$map->name( $self->stash('name') );
		$map->save();
		return $self->redirect_to('/admin/map/'.$map->id());
	}

	if ( $req->is_xhr ) {
		if ( $req->method() eq 'PUT' ) {
			# Edit request goes here
		}
		
	} else {
		my $id = $self->stash( 'id' );
		my $map = new Game::HexMap( 'id' => $id, load => 1 );
		my $type_fac = new Game::Hex::Type::Factory();
		my @type_modules = map { "Game/Hex/Type/$_" } $type_fac->types_available();
		
		$self->stash( 
			'title' => 'Edit : ' . $map->name(), 
			'Map' => $map,
			'map_json' => $map->freeze(),
			'types' => [ $type_fac->types_available() ],
			'modules' => [ 
				'Vector',
				'Game/Hex/Feature', 
				'Game/Hex/Vector', 
				'Game/Hex/Feature/River', 
				'Game/Hex/Feature/Slope', 
				'Game/Hex/Type', 
				@type_modules,
				'Game/Hex', 	  
				'Game/HexMap', 
				'Game', 
				'Editor',
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
