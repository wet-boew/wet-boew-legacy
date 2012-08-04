/*!
 * Progress bar v1.0 / Barre de progression v1.0
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */

 /* loading jQuery UI */
PE.load_ui();
PE.load('jquery.metadata.js');
Utils.addCSSSupportFile(Utils.getSupportPath() + '/progressbar/style.css');

(function($) {
	$.fn.progressBar = function() {
		var $this = $(this);

		//Get the value
		var value = $this.text();
		value = parseInt(value.substring(0, value.indexOf("%")));
		
		// Global defaults
		var settings={disabled: false, value: value};

		// Override global defaults with settings from element metadata
		$.extend(settings,$(this).metadata().wetboewprogressbar)

		// If the progress bar is not initialized yet
		if(isNaN($this.progressbar("value"))) $this.html("<span class=\"cn-invisible\">" + $this.text() + "</span>");

		// Update the settings
		$this.progressbar(settings);
		
		if ($this.hasClass("resizable"))$this.resizable();
	}
	
	/* plugin init */
	$(document).ready(function(){
		$(".wet-boew-progressbar").each(function(){$(this).progressBar()});
	});
})(jQuery)