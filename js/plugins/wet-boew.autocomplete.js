/*!
 * Auto-complete for text input fields v1.0 / Remplissage automatique des champs de saisie v1.0
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */

/* loading jQuery UI */
PE.load_ui();
PE.load('jquery.metadata.js');

(function($) {
	$.fn.autocompleteWET = function(){
		// Global defaults
        var availableTags = [
			"ActionScript",
			"AppleScript",
			"Asp",
			"BASIC",
			"C",
			"C++",
			"Clojure",
			"COBOL",
			"ColdFusion",
			"Erlang",
			"Fortran",
			"Groovy",
			"Haskell",
			"Java",
			"JavaScript",
			"Lisp",
			"Perl",
			"PHP",
			"Python",
			"Ruby",
			"Scala",
			"Scheme"
		];
		var settings={minLength: 1, source: availableTags};
		
		// Override global defaults with settings from element metadata
		$(this).autocomplete($.extend(settings,$(this).metadata().wetboewautocomplete));
	};

	/* plugin init */
	$(document).ready(function() {
		$(".wet-boew-autocomplete").each(function(){
			$(this).autocompleteWET();
		});
	});
})(jQuery)