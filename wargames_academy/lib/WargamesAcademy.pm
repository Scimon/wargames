package WargamesAcademy;
use 5.010;
use strict;
use warnings;

use Mojo::Base 'Mojolicious';

use SystemUser;

# This method will run once at server start
sub startup {
  my $self = shift;
  $self->secret( "ddkl23dijfop2v doijecwoimd" );

  my $sysusers = SystemUser->new;
  $self->helper( system_users => sub { return $sysusers });

  # Routes
  my $r = $self->routes;

  # Default Route
  $r->route('/admin/map/:id', 'id' => qr/\d+/ )->to( 'admin#map', id => 0 );
  $r->route('/admin/map/:id/:x/:y', 'x' => qr/-?\d+/, 'y' => qr/-?\d+/ )->to( 'admin#hex', 'id' => 0, 'x' => 0, 'y' => 0  );
  $r->route('/:controller/:action/:id', 'id' => qr/\d+/ )->to('site#index', id => 1 );
}

1;
