var Editor_Feature_Height = Editor_Feature.extend({
	'render' : function() {
	    this.$el.html( "<p>Height : Start <input class='height' value='" + this.model.get('height') + "' size='3'></p>");
	    return this;
	},
	'events' : function() {
	    this._events['change input.height'] = 'update_height';
	    return this._events;
	},
	'update_height' : function( e ) {
	    this.model.set( { 'height' : e.target.value  }, { wait : true } );    
	},
	'create_new' : function() {
	    return new Game_Hex_Feature_Height( { 'type' : 'Height', 'height' : 2 } );
	}

    });