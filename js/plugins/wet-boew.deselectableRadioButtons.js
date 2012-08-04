/*!
 * Deselectable radio buttons v1.01 / Boutons radio désélectionnable v1.01
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */

/**
 * deselectableRadioButtons adds the ability to deselect a radio button after one of the radio buttons in a named group is selected, so that either one radio button is selected, or no radio button is selected.
 *
 * @name deselectableRadioButtons
 * @author Dave Schindler, Paul Jackson
 * @version 1.0
 * @return jQuery
 */
(function($) {
	$.fn.deselectableRadioButtons = function() {
		var currIndex = 1;
		$(this).each(function() {
			var group = $(this);
			group.attr('id', group.attr('id')?group.attr('id'):'desRad-id'+currIndex);
			$(':radio', group).attr('aria-checked','false').attr('role','radio').attr('aria-controls','desRad-id'+currIndex).click(function() {
				if ($(this).attr('aria-checked') === 'true') {
					$(this).removeAttr('checked').attr('aria-checked','false');
				} else {
					$(':radio', group).removeAttr('checked').attr('aria-checked','false');
					$(this).attr('checked','true').attr('aria-checked','true');
				}
			});
			currIndex++;
		});
		return this;
	};
	$(document).ready(function(){$('.deselectableRadioButtons').deselectableRadioButtons();});
})(jQuery);
