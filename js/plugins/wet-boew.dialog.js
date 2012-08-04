/*!
 * Dialog box enhancement v1.0 / Amélioration des boîtes de dialogue v1.0
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */

 /* loading jQuery UI */
PE.load_ui();
PE.load('jquery.metadata.js');

(function($) {
	$.fn.dialogWET = function(){

	 	var dictionary = {
			resizeDialog :(PE.language == "eng") ? "Resize dialog box" : "Redimensionner le boîte de dialogue",
			moveDialog :(PE.language == "eng") ? "Move dialog box" : "Déplacer le boîte de dialogue",
			closeDialog :(PE.language == "eng") ? "Close dialog box" : "Fermer le boîte de dialogue"
		};	
	
		// Global defaults
		var settings={closeText : dictionary.closeDialog};
		
		// Override global defaults with settings from element metadata
		$(this).dialog($.extend(settings,$(this).metadata().wetboewdialog));
	
		/*** Start of modified code from http://hanshillen.github.com/jqtest/#goto_dialog ***/
		$( ".ui-resizable-se" )
			.attr("tabindex", "0") //keyboard support for resizable
			.attr("role", "button")
    		.attr("title", dictionary.resizeDialog)
        	.keydown(function(event) {
        		if (jQuery.inArray(event.keyCode, [37, 38, 39, 40]) == -1)
        			return true; //only interested in arrow keys
        		var handle = $(this);
        		var offset = handle.offset();
        		var increment = event.ctrlKey ? 100 : (event.shiftKey ? 1 : 20);
        		var overEvent, downEvent, moveEvent1, moveEvent2, upEvent;
        		// simulate mouse events to trigger resize action
        		overEvent = new $.Event("mouseover");
        		downEvent = new $.Event("mousedown");
        		moveEvent1 = new $.Event("mousemove");
        		moveEvent2 = new $.Event("mousemove"); //only second move event leads to actual resize 
        		upEvent = new $.Event("mouseup");
        		overEvent.pageX = downEvent.pageX = moveEvent1.pageX = 
        			moveEvent2.pageX = upEvent.pageX = offset.left;
        		overEvent.pageY = downEvent.pageY = moveEvent1.pageY = 
        			moveEvent2.pageY = upEvent.pageY = offset.top;
        		downEvent.which = upEvent.which = 1;
        		// prevents drag from being canceled for IE in _mouseMove:
        		moveEvent1.button = moveEvent2.button = 1; 
        		switch (event.keyCode) {
        			case 37: //left
        				moveEvent1.pageX = moveEvent2.pageX = upEvent.pageX = downEvent.pageX - increment;
        				break;
        			case 38: //up
        				moveEvent1.pageY = moveEvent2.pageY = upEvent.pageY = downEvent.pageY - increment;
        				break;
        			case 39: //right
        				moveEvent1.pageX = moveEvent2.pageX = upEvent.pageX = downEvent.pageX + increment;
        				break;
        			case 40: //down
        				moveEvent1.pageY = moveEvent2.pageY = upEvent.pageY = downEvent.pageY + increment;
        				break;
        		}
        		handle.trigger(overEvent);
        		handle.trigger(downEvent);
        		handle.trigger(moveEvent1);
        		handle.trigger(moveEvent2);
        		handle.trigger(upEvent);
        		event.stopPropagation();
        		return false;
        	});	
		
		//keyboard support for draggable dialog
		$( ".ui-dialog-titlebar" )
			.attr("tabindex", "0")
    		.attr("role", "button")
    		.attr("title", dictionary.moveDialog)
    		.keydown(function(event) {
    			if (jQuery.inArray(event.keyCode, [37, 38, 39, 40]) == -1)
    				return true;
    			if (this !== event.target) // event could bubble up from close button
    				return;
    			var handle = $(this);
    			var offset = handle.offset();
    			var increment = event.ctrlKey ? 100 : (event.shiftKey ? 1 : 20);
    			// simulate mouse events to trigger drag action
    			var downEvent, moveEvent, upEvent;
    			downEvent = new $.Event("mousedown");
    			moveEvent = new $.Event("mousemove");
    			upEvent = new $.Event("mouseup");
    			downEvent.pageX = moveEvent.pageX = upEvent.pageX = offset.left;
    			downEvent.pageY = moveEvent.pageY = upEvent.pageY = offset.top;
    			downEvent.which = upEvent.which = 1;
    			// prevents drag from being canceled for IE in _mouseMove:
    			moveEvent.button = 1;
    			switch (event.keyCode) {
    				case 37: //left
    					moveEvent.pageX = upEvent.pageX = moveEvent.pageX - increment;
    					break;
    				case 38: //up
    					moveEvent.pageY = upEvent.pageY = moveEvent.pageY - increment;
    					break;
    				case 39: //right
    					moveEvent.pageX = upEvent.pageX = moveEvent.pageX + increment;
    					break;
    				case 40: //down
    					moveEvent.pageY = upEvent.pageY = moveEvent.pageY + increment;
    					break;
    			}
    			handle.trigger(downEvent);
    			handle.trigger(moveEvent);
    			handle.trigger(upEvent);
    			event.stopPropagation();
    			return false;
    		});
		/*** End of modified code from http://hanshillen.github.com/jqtest/#goto_dialog ***/
	}

	/* plugin init */
	$(document).ready(function() {
		$(".wet-boew-dialog").each(function(){
			$(this).dialogWET();
		});
	});
})(jQuery)