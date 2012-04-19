{
	package Game::Hex::Feature::Bridge;

	use Moose;
	use MooseX::Storage;
	
	with Storage('format' => 'JSON');

	extends 'Game::Hex::Feature';
	with 'Game::Hex::Vector';
	
	has 'length', is => 'rw', isa => 'Int', default => 50;
	
	around BUILDARGS => sub {
		my $orig  = shift;
		my $class = shift;
		
		return $class->$orig( { @_, 'type' => 'Bridge' } );
	};

	__PACKAGE__->meta->make_immutable;

	'module returns true';
}
