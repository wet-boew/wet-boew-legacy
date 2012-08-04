/*!
 * Slider control v1.0 / Commande de barre coulissante v1.0
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */

/* loading jQuery UI */
PE.load_ui();
PE.load('jquery.metadata.js');

(function($) {
	$.fn.sliderWET = function(){
		// Global defaults
		var settings={orientation : "horizontal"};
		
		// Override global defaults with settings from element metadata
		$(this).slider($.extend(settings,$(this).metadata().wetboewslider));
	}

	/* plugin init */
	$(document).ready(function() {
		$(".wet-boew-slider").each(function(){
			$(this).sliderWET();
		});
	});
})(jQuery)