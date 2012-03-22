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
#  $r->route('/admin/map/:id')->to( 'Admin#map', id => 0 );
#  $r->route('/admin/map/:id/:method')->to( 'Admin#map', id => 0 );
  $r->route('/:controller/:action/:id')->to('site#index', id => 1);
}

1;
