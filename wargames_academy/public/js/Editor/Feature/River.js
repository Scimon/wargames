var Editor_Feature_River = Editor_Feature.extend({
	'render' : function() {
	    var start = this.position_select( 'start', this.model.get('start') );
	    var end = this.position_select(  'end', this.model.get('end') );

	    this.$el.html( "<p>River : Start " + start + " End " + end + "</p>" );
	    return this;
	},
	'events' : function() {
	    this._events['change select.start'] = 'update_points';
	    this._events['change select.end'] = 'update_points';
	    return this._events;
	},
	'update_points' : function( e ) {
	    var selector = e.target;
	    var criteria = {};
	    criteria[selector.className] = selector.options[selector.selectedIndex].value;
	    this.model.set( criteria, { wait : true } );
	},
	'create_new' : function() {
	    return new Game_Hex_Feature_River( { 'type' : 'River', 'start' : 'c0', 'end' : 'c3' } );
	}
    });