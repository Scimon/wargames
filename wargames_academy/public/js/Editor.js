var Editor = Game.extend( {
	'editor' : null,
	'select_hex' : function( hex ) {
	    if ( this.get('selected') ) {
		this.editor.$el.css('display','none');
		hex.off( null, null, this.editor );
		this.get('selected').set('selected',0);
		this.editor = null;
	    }
	    this.set( 'selected', hex );
	    if ( hex ) {
		hex.set( 'selected', 1 );
		this.editor = new Hex_Editor( { el : $('#hex_editor'), model : hex  } );
		hex.bind( 'all:editing', this.editor.render, this.editor );
		this.editor.$el.css('display','block');
	    }
	}
	
    } );

var Hex_Editor = Backbone.View.extend( {
	'initialize' : function() {
	    this.template = _.template($('#hex_editor_template').html());
	    this.render();
	    this.type_select = this.$el.find('#type_list')[0];
	    var type = this.model.get('hextype').get('name');
	    for ( var o,i = 0;o = this.type_select.options[i]; i++ ) {
		if ( o.value == type ) {
		    o.selected = true;
		    break;
		}
	    }
	},
	'events' : {
	    'change #type_list' : 'updateType',
	},
	'updateType' : function() {
	    var type = this.type_select.options[this.type_select.selectedIndex].value;
	    this.model.setHex( type );
	},
	'render' : function() {
	    this.$el.html(this.template(this.model.toJSON()));
	    
	    return this;
	}
    });

$(document).ready( 
		  function() {
		      window.map_editor = new Editor( { 'mapdata' : mapdata } );
		      window.map_view = new Game_HexMap_View( { 'model' : map_editor.get('mapdata') } );
		      $('#gamemap').append('<div class="game-layer back"></div>');
		      $('#gamemap').append( window.map_view.el );
		      $('.scale').click( function() { map_editor.get('mapdata').set('scale', this.value * 1 ); } );
		      window.map_view.render();
		  }
		   );