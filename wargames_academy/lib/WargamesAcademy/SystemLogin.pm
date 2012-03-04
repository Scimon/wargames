package WargamesAcademy::SystemLogin;
use Mojo::Base 'Mojolicious::Controller';

sub index {
	my $self = shift;

	my $user = $self->param('user') || '';
	my $pass = $self->param('pass') || '';
	return $self->render unless $self->users->check($user, $pass);

	$self->session(user => $user);
	$self->flash(message => 'Thanks for logging in.');
	$self->redirect_to('/admin');
}

sub logout {
	my $self = shift;
	$self->session(expires => 1);
	$self->redirect_to('/');
}

1;