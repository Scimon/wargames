var Editor_Feature_Slope = Editor_Feature.extend({
	'render' : function() {
	    var start = this.position_select( 'start', this.model.get('start') );
	    var end = this.position_select(  'end', this.model.get('end') );
		
	    this.$el.html( "<p>Slope : Start " + start + " End " + end + "</p>" +
			   "<p>Height : Start <input class='start_height' value='" + this.model.get('start_height') + "' size='3'>" +
			   " End  <input class='end_height' value='" + this.model.get('end_height') + "' size='3'></p>");
	    return this;
	},
	'events' : function() {
	    this._events['change select.start'] = 'update_points';
	    this._events['change select.end'] = 'update_points';
	    this._events['change input.start_height'] = 'update_heights';
	    this._events['change input.end_height'] = 'update_heights';
	    return this._events;
	},
	'update_heights' : function( e ) {
	    var selector = e.target;
	    var criteria = {};
	    criteria[selector.className] = selector.value;
	    this.model.set( criteria, { wait : true } );    
	},
	'update_points' : function( e ) {
	    var selector = e.target;
	    var criteria = {};
	    criteria[selector.className] = selector.options[selector.selectedIndex].value;
	    this.model.set( criteria, { wait : true } );
	},
	'create_new' : function() {
	    return new Game_Hex_Feature_Slope( { 'type' : 'Slope', 'start' : 's0', 'end' : 's3', 'start_height' : 1, 'end_height' : 2 } );
	}

    });