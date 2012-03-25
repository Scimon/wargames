var Editor = Game.extend( {
	'select_hex' : function( hex ) {
	    if ( this.get('selected') ) {
		this.get('selected').set('selected',0);
	    }
	    this.set( 'selected', hex );
	    if ( hex ) {
		hex.set( 'selected', 1 );
	    }
	},
	
    } );

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