/*!
 * Active link indicator v1.02 / Indicateur de lien actif v1.02
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */

/**
 * Adds a class name to the link (or links) that matches the current page's URL. Can be used to
 * differentiate the current nav menu link from other nav menu links.
 *
 * @name navCurrent
 * @author Dave Schindler, Chad Farquharson
 * @return jQuery
 */
(function($) {
	var defaults = {
		id: "navCurrent",
		currentClass: "nav-current",
		navMenuSelector: ".module-menu-section"
	}
	var params = $.extend({}, defaults, Utils.loadParamsFromScriptID("navCurrent"));
		
	$.fn.navCurrent = function() {
		var el1 = document.createElement('div');
		el1.innerHTML = '<a href="' + location.href + '">this</a>';
		var href1 = el1.firstChild.href.replace(/[\?#].*$/,'');
		$('a', this).each(function(i) {
			var el2 = document.createElement('div');
			el2.innerHTML = '<a href="' + this.href + '">this</a>';
			var href2 = el2.firstChild.href.replace(/[\?#].*$/,'');
			if (href1 == href2) {
				$(this).parent('li').addClass(params.currentClass);
			}
			delete el2;
		});
		delete el1;
		return this;
	};
	Utils.addCSSSupportFile(Utils.getSupportPath() + "/navCurrent/style.css");
	$(document).ready(function(){$(params.navMenuSelector).navCurrent();});
})(jQuery);
