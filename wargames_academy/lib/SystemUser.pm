package SystemUser;

use strict;
use warnings;

my $USERS = {
	scimon => 'f3NR15',
	sean   => 'harew00d',
};

sub new { bless {}, shift }

sub check {
	my ($self, $user, $pass) = @_;

	# Success
	return 1 if $USERS->{$user} && $USERS->{$user} eq $pass;

	# Fail
	return;
}

1;