var Editor_Feature_Road = Editor_Feature.extend({
	'render' : function() {
	    var start = this.position_select( 'start', this.model.get('start') );
	    var end = this.position_select(  'end', this.model.get('end') );
		
	    this.$el.html( "<p>Road : Start " + start + " End " + end + "</p>" );
	    this.start_select = $(this.model.cid + ':start');
	    this.end_select = $(this.model.cid + ':end');
	    this.delegateEvents();
	    return this;
	},
	'events' : {
	    'change select.start' : 'update_points',
	    'change select.end' : 'update_points',
	},
	'update_points' : function( e ) {
	    var selector = e.target;
	    var criteria = {};
	    criteria[selector.className] = selector.options[selector.selectedIndex].value;
	    this.model.set( criteria, { wait : true } );
	},
	'create_new' : function() {
	    return new Game_Hex_Feature_Road( { 'type' : 'Road', 'start' : 'c0', 'end' : 'c3' } );
	}

    });