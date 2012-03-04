package WargamesAcademy::Site;
    
use strict;	
use warnings;
    
use base 'Mojolicious::Controller';

sub main {
	my $self = shift;
	$self->holding();
}
    
sub holding {
    my $self = shift;

    $self->render_text('Nothing to see here.');
}

1;