/*!
 * Panorama v1.02 / Panorama v1.02
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */

(function($) {
	$.fn.panorama = function(options){
		$this = $(this);
		
		var settings = $.extend({}, {suffix: '-pan'}, options);
		$this.reel(settings);
		
		// Add accessible navigation
		$('.minus').click(function(){
			$this.trigger('fractionChange', [ $this.data('fraction') - 0.05 ] );
		});   
		$('.plus').click(function(){
			$this.trigger('fractionChange', [ $this.data('fraction') + 0.05 ] );
		});

		// Add keyboard support
		$(document.documentElement).keydown(function (event) {
			// handle cursor keys
			if (event.keyCode == 37) {
			// go left
			$('.minus').focus().click();
			} else if (event.keyCode == 39) {
			// go right	
			$('.plus').focus().click();
			}
		});
	}
	
	$(document).ready(function() {
		var params = Utils.loadParamsFromScriptID("panorama");
		$("#panorama").each(function(){
			$(this).panorama(params);
		})
	})
})(jQuery)
  
PE.load('jquery.reel-min.js');

// Add Style Sheet Support for this plug-in
Utils.addCSSSupportFile(Utils.getSupportPath() + "/panorama/styles.css");