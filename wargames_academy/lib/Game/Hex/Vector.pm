{
	package Game::Hex::Vector;
	# Object that defines a vector within a hex.
	# s0 - s5 (Side 0 to 5, 0 being top going clock wise)
	# c0 - c5 (Cardinal point 0 to 5, 0 being right of top side going clockwise) 
	use Moose::Role;
	use Moose::Util::TypeConstraints;

	subtype 'VectorPoint' => as 'Str' => where {  
		$_ =~ /^[sc][0-5]|c$/;
	};

	has 'start', is => 'rw', isa => 'VectorPoint', default => sub { 's0' };
	has 'end', is => 'rw', isa => 'VectorPoint', default => sub { 's0' };

	'module returns true';
}
