/*!
 * Open new window/tab v1.3 / Nouvelle fenêtre/Nouvel onglet v1.3
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */
var newWindow = {
    defaultParams : { container: '#cn-cols' },
	params :  Utils.loadParamsFromScriptID("newwindow"),
	xhtml : (jQuery("html").attr("xml:lang")) ? true : false,
	dictionary : {
		// Initial bilingual versions of content found in <a> tags title attribute.
		iniTitle : (PE.language == "eng" ) ? "External link" : "Lien externe" ,
		// Modified bilingual versions of content found in <a> tags title attribute.
		modTitle : (PE.language == "eng" ) ? "Opens in a new window" : "Ouvre dans une nouvelle fen&#234;tre"
	},
	init: function() {
        newWindow.params = $.extend(true, {}, newWindow.defaultParams, newWindow.params);
		var linkdesc = null;
		var intNoSpan = "<span><span> " + newWindow.dictionary.modTitle + "</span></span>";
		var intSpan = " (" + newWindow.dictionary.modTitle + ")";
		var extNoSpan = "<span><span> " + newWindow.dictionary.iniTitle + ", " + newWindow.dictionary.modTitle + "</span></span>";
		var extSpanWarn = ", " + newWindow.dictionary.modTitle;
		var extSpanNoWarn = " (" + newWindow.dictionary.iniTitle + ", " + newWindow.dictionary.modTitle + ")";
		
		$("a.wet-newwindow, a[rel='external']", newWindow.params.container).each(function() {
			linkdesc = jQuery(this).find('span > span');
			if (jQuery(this).hasClass("wet-newwindow")) {
				jQuery(this).addClass("cn-internal2 cn-linkdesc");
				if (linkdesc.html() == null) { // Anchor element does not contain nested span elements
					jQuery(this).append(intNoSpan); // Append nested spans with open new window warning
				} else { // Anchor element contains nested span elements
					linkdesc.append(intSpan); // Append open new window warning to hidden link description
				}
			}
			else {
				jQuery(this).addClass("cn-external2 cn-linkdesc");
				if (linkdesc.html() == null) { // Anchor element does not contain nested span elements
					jQuery(this).append(extNoSpan); // Append nested spans with external link and open new window warnings
				} else { // Anchor element contains nested span elements
					if (linkdesc.html().search(newWindow.dictionary.iniTitle) == (linkdesc.html().length - newWindow.dictionary.iniTitle.length)) linkdesc.append(extSpanWarn); // External link warning already exists so append the open new window warning
					else linkdesc.append(extSpanNoWarn); // // External link warning does not exists so append the external link and open new window warnings
				}
			}
			
			if (!newWindow.xhtml) jQuery(this).attr("target","_blank");
			else {
				jQuery.clickOrEnter( this , function(target) {
					while (jQuery(target).attr('href') === undefined) {
						target = jQuery(target).parent();
					}
					window.open(jQuery(target).attr('href'));
				});
			}
		});
	}
};
/*
@author Bryan Gullan
@version 1.2
@description Bind mouse click and enter key to a given element. On Click or Enter, specified function is called and default event action blocked. The function called is aware of the target of the click / enter keypress.

Sample use is to add popup to a link, where the href would be followed if javascript were turned off.

var popup = function(target) {
	alert('activated'+ $(target).attr('href'));
};
$(document).ready(function() {
	$.clickOrEnter('a',popup);
});

(c) 2007 Bryan Gullan.
Use and distribute freely with this header intact
*/

jQuery.clickOrEnter = function(element,callback) {
	jQuery(element).bind('click', function(event) {
  		callback(event.target);
  		event.preventDefault(); //prevent browser from following the actual href
	});
	jQuery(element).bind('keypress', function(event) {
		var code=event.charCode || event.keyCode;
		if(code && code == 13) {// if enter is pressed
  			callback(event.target);
  			event.preventDefault(); //prevent browser from following the actual href
		};
	});
};


/**
 *  Progress Enhancement Runtime
 **/
	
// Add the stylesheet for this plugin
Utils.addCSSSupportFile(Utils.getSupportPath() + "/newwindow/style.css");
$("document").ready(function(){   newWindow.init(); });