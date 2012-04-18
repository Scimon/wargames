var Editor_Feature = Backbone.View.extend( {
	'tagName' : 'div',
	'className' : 'feature-editor',
	'render' : function() {
	    this.$el.html( "Feature" );
	    return this;
	},
	'create_new' : function() {
	    console.log( "Implement creating a new feature of this type" );
	    return null;
	},
        'position_select' : function( id, value ) {
	    var options = { 's' : 'Side', 'c' : 'Corner' };
	    var points = [0,1,2,3,4,5];
	    var output = ['<select class="' + id + '">'];
	    _(options).each( function( display, key ) {
		    _(points).each( function( point ) {
			    var val = key + point;
			    var sel = ( val == value ) ? ' selected="selected"' : '';
			    output.push( '<option value="' + val + '"' + sel + '>' + display + ' ' + point + '</option>' );
			} );
		} );
	    output.push( '<select>' );
	    return output.join( '' );
	}
    } );