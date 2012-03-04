package WargamesAcademy;
use Mojo::Base 'Mojolicious';

use SystemUsers;

# This method will run once at server start
sub startup {
  my $self = shift;
  $self->secret( "ddkl23dijfop2v doijecwoimd" );

  my $sysusers = SystemUsers->new;
  $self->helper( system_users => sub { return $users });

  # Routes
  my $r = $self->routes;

  # Default Route
  $r->route('/:controller/:action/:id')->to('site#index', id => 1);
}

1;
