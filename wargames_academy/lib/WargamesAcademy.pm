package WargamesAcademy;
use Mojo::Base 'Mojolicious';

# This method will run once at server start
sub startup {
  my $self = shift;
  $self->secret( "ddkl23dijfop2v doijecwoimd" );
  # Routes
  my $r = $self->routes;

  # Default Route
  $r->route('/:controller/:action/:id')->to('site#main', id => 1);
}

1;
