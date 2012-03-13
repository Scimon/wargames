{
	package Game::Hex::Feature::River;

	use Moose;
	extends 'Game::Hex::Feature';
	
	has 'type', is => 'ro', isa => 'Str', default => sub { 'river' };

	__PACKAGE__->meta->make_immutable;

	'module returns true';
}
