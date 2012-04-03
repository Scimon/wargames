var Editor = Game.extend( {
	'editor' : null,
	'select_hex' : function( hex ) {
	    if ( this.get('selected') ) {
		this.editor.hide();
		this.get('selected').set('selected',0);
	    }
	    this.set( 'selected', hex );
	    if ( hex ) {
		hex.set( 'selected', 1 );
		this.editor = new Hex_Editor( { el : $('#hex_editor'), model : hex  } );

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
	    this.delegateEvents();
	    this.$el.css('display','block');
	},
	'hide' : function() {
	    this.$el.css('display','none');
	    this.undelegateEvents();
	},
	'events' : {
	    'change #type_list' : 'updateType',
	},
	'updateType' : function() {
	    var type = this.type_select.options[this.type_select.selectedIndex].value;
	    this.model.setHexType( type );
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
			  $('#up').click( function() { var i = map_editor.get('mapdata').get( 'yOffset'); map_editor.get('mapdata').set( 'yOffset', i-1); } );
			  $('#down').click( function() { var i = map_editor.get('mapdata').get( 'yOffset'); map_editor.get('mapdata').set( 'yOffset', i+1); } );
			  $('#left').click( function() { var i = map_editor.get('mapdata').get( 'xOffset'); map_editor.get('mapdata').set( 'xOffset', i-1);} );
			  $('#right').click( function() { var i = map_editor.get('mapdata').get( 'xOffset'); map_editor.get('mapdata').set( 'xOffset', i+1); } );
		      window.map_view.render();
		  }
		   );