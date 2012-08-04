/*!
 * Checkbox list enhancement v1.02 / Amélioration de liste de case à cocher v1.02
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */

/**
 * CheckboxList jQuery plugin
 * checkboxList() enhances a list of checkboxes, by adding buttons to check/uncheck all boxes,
 * and by adding the ability to transform the list into a fixed-height/auto-scrolling checkbox
 * container. The fixed-height can be controled by specifying the number of rows to show before
 * adding scrollbars.
 *
 * A default CSS theme is provided, but can be overridden.
 *
 * checkboxList accepts a single argument which is an options object.
 * The following attributes are supported in the options:
 *
 *  maxRows:		The maximum number of rows to show before clipping the content and adding scrollbars.
 *
 * Usage:
 * <ul class="checkboxList">
 * 		<li><label for="a1"><input type="checkbox" id="a1" checked="checked"/>one</label></li>
 * 		<li><label for="a2"><input type="checkbox" id="a2" />two</label></li>
 * 		<li><label for="a3"><input type="checkbox" id="a3" checked="checked"/>three</label></li>
 * 		<li><label for="a4"><input type="checkbox" id="a4" disabled="disabled"/>four</label></li>
 * 		<li><label for="a5"><input type="checkbox" id="a5" />five</label></li>
 * 	</ul>
 *
 * And to trigger the plugin:
 * var params = {
 *		checkboxList: { id:"checkboxList", maxRows:4 }
 *	};
 *	PE.progress(params);
 *
 * @name checkBoxList
 * @author Dave Schindler, Paul Jackson 
 * @version 1.0
 * @param settings - object literal containing options which control the checkboxList functionaltiy
 * @return jQuery
 */
	
(function($) {

	/**
	 * Event handler for when the user presses the check all button.
	 * Checks all the checkable checkboxes and highlights the corresponding labels.
	 */
	function checkAllHandler() {
		var $rows = $(this).parent().prev().children();
		$rows.each(function() {
			var $checkbox = $(':checkbox', this);
			if (!$checkbox.attr('disabled')) {
				$checkbox.attr('checked', true).attr('aria-checked','true');
				$('label', this).addClass('cblLabelChecked');
			}
		});
	}

	/**
	 * Event handler for when the user presses the uncheck all button.
	 * Unchecks all the checkboxes and removes highlights from the corresponding labels.
	 */
	function uncheckAllHandler() {
		var $list = $(this).parent().prev();
		var $checkboxes = $(':checkbox', $list);
		$checkboxes.removeAttr('checked').attr('aria-checked','false');
		var $labels = $('label', $list);
		$labels.removeClass('cblLabelChecked');
	}

	/**
	 * Sets up the style toggling for each row based on whether the row's checkbox is
	 * checked, unchecked, or disabled.
	 *
	 * @param list - The list element (dl, ul, ol) currently being acted on by the plugin.
	 */
	function styleRows(list) {
		$(list).children().each(function() {
			var $label = $('label', this);
			var $input = $(':checkbox', this).attr('role','checkbox').prependTo($label);
			// Initial style
			if ($input.attr('checked')) {
				$label.addClass('cblLabelChecked');
				$input.attr('aria-checked','true');
			} else {
				$label.removeClass('cblLabelChecked');
				$input.attr('aria-checked','false');
			}
			// Changes by the user
			$input.bind('click', function(event) {
				if ($input.is(':checked')) {
					$label.addClass('cblLabelChecked');
					$input.attr('aria-checked','true');
				} else {
					$label.removeClass('cblLabelChecked');
					$input.attr('aria-checked','false');
				}
			});
			// Grey-out disabled labels
			if ($input.is(':disabled')) {
				$label.addClass('disabled');
				$label.attr('aria-disabled','true');
			} else {
				$label.removeClass('disabled');
			}
		});
	}

	/**
	 * Sets the width of the checkboxList widget based on the width of its content.
	 *
	 * @param list - The list element (dl, ul, ol) currently being acted on by the plugin.
	 * @param buttondiv - The div holding the check all and uncheck all buttons (its width is checked).
	 */
	function setWidth(list, buttonDiv) {
		var width = buttonDiv[0].offsetWidth;
		$(list).children().each(function() {
			if (this.offsetWidth > width) {
				width = this.offsetWidth;
			}
		});
		if (width > ($('body').width() - 20) && width < ($('body').width() + 20)) {
			$(list).css('width', '100%');
		} else {
			$(list).width(width);
		}
	}

	/**
	 * Sets the height of the widget based on the maxRows value.
	 *
	 * @param list - The list element (dl, ul, ol) currently being acted on by the plugin.
	 * @param maxRows - The maximum number or rows to show before clipping and adding scrollbars.
	 */
	function setHeight(list, maxRows) {
		if (maxRows <= 0) {
			return;
		}
		var rows = $(list).children().length;
		if (rows > maxRows) {
			var rowHeight = $(list).height() / rows;
			var height = rowHeight * maxRows + 2;
			$(list).height(height);
		}
	}

	$.fn.checkboxList = function() {
		// Only work on list-type elements
		var $lists = this.filter('dl, ul, ol, menu');
		if ($lists.length) {
			var defaults = {
				maxRows : 0,
				checkLabel: {
					fra: 'Tout s&eacute;lectionner',
					eng: 'Select all'
				},
				uncheckLabel: {
					fra: 'Tout d&eacute;s&eacute;lectionner',
					eng: 'Deselect all'
				}
			};
			// extend the defaults with the plugin parameters from the html page, if any
			var params = $.extend({}, defaults, Utils.loadParamsFromScriptID("checkboxList"));
			var currId = 1;
		
			$lists.each(function() {
				// Initialize container
				$(this).wrap('<div class="cblContainer"><div id="cblContainer' + currId + '"></div></div>');
				$('.cblContainer').after('<div class="cblClear" />');
			
				// Initialize buttons
				var $checkAllButton = $('<button type="button" role="button" aria-controls="cblContainer' + currId + '">' + params.checkLabel[PE.language] + '</button>');
				var $uncheckAllButton = $('<button type="button" role="button" aria-controls="cblContainer' + currId + '">' + params.uncheckLabel[PE.language] + '</button>');
				var $buttons = $('<div/>').append($checkAllButton).append($uncheckAllButton).insertAfter(this);
				$checkAllButton.bind('click', checkAllHandler);
				$uncheckAllButton.bind('click', uncheckAllHandler);

				// Initialize styles
				$(this).addClass('cbl');
				$('label', this).addClass('cblLabel');
				styleRows(this);
				setWidth(this, $buttons);
				setHeight(this, params.maxRows);

				currId++;
			});
		}

		return this;
	};
		
	// Add the stylesheet for this plugin
	Utils.addCSSSupportFile(Utils.getSupportPath() + "/checkboxList/style.css");
	$(document).ready(function(){$('.checkboxList').checkboxList();});
})(jQuery);
