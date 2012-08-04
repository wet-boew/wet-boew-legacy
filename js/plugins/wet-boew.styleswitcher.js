/*!
 * Style switcher v1.1 / Sélecteur de style v1.1
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * Terms and conditions of use: http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Terms
 * Conditions régissant l'utilisation : http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Conditions
 */
 
/** Change Log
 * 2010.07.07 - Dave Schindler - Port of CRA jQuery Plugin and rewrite
 * 2010.07.19 - Dave Schindler - Added French download link
 **/
(function($) {
	var params, availableStylesheets, activeStylesheetIndex, dictionary, alternates, altLinkClasses;
	$.fn.styleswitcher = {};
	
	$(document).ready(function() {
		if (cssEnabled == null || cssEnabled) $.fn.styleswitcher();
	});
	
	$.fn.styleswitcher = function() {
		params = $.extend({}, $.fn.styleswitcher.defaults, Utils.loadParamsFromScriptID("styleswitcher"));
		params.helpLink = {
			"eng": params.helpLinkEng,
			"fra": params.helpLinkFra
		};
		// Todo: get French translations
		dictionary = {
			toggleLinkValue: {
				fra: "Basculer par les options d'apparence",
				eng: "Toggle through the appearance options"
			},
			menuLinkValue: {
				fra: "Options de couleur " ,
				eng: "Colour options "
			},
			defaultLinkValue: {
				fra: "Th&#232;me par d&#233;faut",
				eng: "Default theme"
			},
			altLinkValues: [{fra: 'Th&#232;me de couleur&#160;1', eng: 'Colour theme&#160;1'}, {fra: 'Th&#232;me de couleur&#160;2', eng: 'Colour theme&#160;2'}, {fra: 'Th&#232;me de couleur&#160;3', eng: 'Colour theme&#160;3'}, {fra: 'Th&#232;me de couleur&#160;4', eng: 'Colour theme&#160;4'}, {fra: 'Th&#232;me de couleur&#160;5', eng: 'Colour theme&#160;5'}, {fra: 'Th&#232;me de couleur&#160;6', eng: 'Colour theme&#160;6'}, {fra: 'Th&#232;me de couleur&#160;7', eng: 'Colour theme&#160;7'}, {fra: 'Th&#232;me de couleur&#160;8', eng: 'Colour theme&#160;8'}, {fra: 'Th&#232;me de couleur&#160;9', eng: 'Colour theme&#160;9'}, {fra: 'Haute couleur de contraste', eng: 'High contrast colour'}],
			downloadLinkValue: {
				fra: "Installer un feuille de style d&#39;haute contraste pour affecter tous les sites Web du <abbr title='Gouvernement du Canada'>GC</abbr>",
				eng: "Install a high contrast style sheet that affects <strong>all</strong> <abbr title='Government of Canada'>GC</abbr> Web sites"
			}
		};
		alternates = ['theme-1.css', 'theme-2.css', 'theme-3.css', 'theme-4.css', 'theme-5.css', 'theme-6.css', 'theme-7.css', 'theme-8.css', 'theme-9.css', 'contrast.css'];
		altLinkClasses = ['theme-1', 'theme-2', 'theme-3', 'theme-4', 'theme-5', 'theme-6', 'theme-7', 'theme-8', 'theme-9', 'theme-contrast'];
		availableStylesheets = [];
		activeStylesheetIndex = 0;
		
		// Dynamically insert the style switcher menu
		$.fn.styleswitcher.init($('.utilities ul:first'));
		
		// Initialise the list of available stylesheets
		availableStylesheets.push('');
		for (var i = 0; i < alternates.length; i++) {
			if (alternates[i].length) {
				availableStylesheets.push(alternates[i]);
			}
		}
		
		// Switch to the user's last selection, or the default
		var c = readCookie(params.cookie);
		if (c) {
			$.fn.styleswitcher.switchTo(c);
		}
		
		// When the default is clicked then remove the current styleswitcher theme.
		$('.styleswitcherdefault').bind('click', function() {
			$.fn.styleswitcher.switchTo('');
			return false;
		});
		
		// When one of the styleswitch links is clicked then switch the stylesheet to
		// the one matching the value of that links rel attribute.
		$('.styleswitcher').bind('click', function() {
			$.fn.styleswitcher.switchTo(this.getAttribute('rel'));
			return false;
		});
		
		// This code loops through the stylesheets when you click the link with 
		// an ID of "toggler" below.
		$('#toggler').bind('click', function() {
			$.fn.styleswitcher.toggle();
			return false;
		});
	};
	
	/**
	 * Plugin's default options. 
	 *
	 * @param cookie - The name you want to use for the cookie stored on the user's computer.
	 * The cookie is used to remember the last stylesheet selected by the user.
	 */
	$.fn.styleswitcher.defaults = {
		cookie: 'styleswitcher',
		helpLinkEng : 'javascript:;',
		helpLinkFra : 'javascript:;'
	};
	
	/** 
	 * Public functions
	 **/
	// Sticks the list of links to toggle the stylesheet into the html, appended to parent.
	// Parent should be an <ol> or <ul>
	$.fn.styleswitcher.init = function($parent) {
		var $menu = $('<li>');
		$menu.append('<a class="utility-theme toggle-link-text" href="' + params.helpLink[PE.language] + '">' + dictionary.menuLinkValue[PE.language] + '</a>');
		var $submenu = $('<ul class="toggle-menu"></ul>');
		$submenu.append('<li><a href="#" class="styleswitcherdefault theme-default">' + dictionary.defaultLinkValue[PE.language] + '</a></li>');
		for (var i = 0; i < alternates.length; i++) {
			$submenu.append('<li><a href="#" rel="' + alternates[i] + '" class="styleswitcher ' + altLinkClasses[i] + '">' + dictionary.altLinkValues[i][PE.language] + '</a></li>');
		}
		$submenu.append('<li><a href="#" id="toggler" class="theme-toggle">' + dictionary.toggleLinkValue[PE.language] + '</a></li>');
		$submenu.append('<li><a href="http://www.tbs-sct.gc.ca/clf2-nsi2/tb-bo/acch-aacc-' + PE.language + '.asp" class="theme-contrast-download">' + dictionary.downloadLinkValue[PE.language] + '</a></li>');
		$menu.append($submenu);
		$parent.append($menu);
	};
	
	// Loops through available stylesheets
	$.fn.styleswitcher.toggle = function() {
		activeStylesheetIndex++;
		activeStylesheetIndex %= availableStylesheets.length;
		$.fn.styleswitcher.switchTo(availableStylesheets[activeStylesheetIndex]);
	};
	
	// Switches to a specific named stylesheet
	$.fn.styleswitcher.switchTo = function(styleName) {
		var href;
		var links = document.getElementsByTagName('link');
		$(links).each(function() {
			href = $(this).attr('href');
			if (availableStylesheets.join().match(href.substring(href.search('[^/]*$')))) {
				$(this).remove();
			}
		});
		Utils.addCSSSupportFile(Utils.getSupportPath() + "/styleswitcher/" + styleName);
		activeStylesheetIndex = availableStylesheets.indexOf(styleName);
		createCookie(params.cookie, styleName, 365);
	};
	
	// Adds missing Array.indexOf to IE.
	[].indexOf ||
	(Array.prototype.indexOf = function(v, n) {
		n = (n == null) ? 0 : n;
		var m = this.length;
		for (var i = n; i < m; i++) 
			if (this[i] == v) 
				return i;
		return -1;
	});
	
	/** 
	 * Private functions
	 **/
	// cookie function http://www.quirksmode.org/js/cookies.html
	function createCookie(name, value, days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			var expires = "; expires=" + date.toGMTString();
		} else 
			var expires = "";
		document.cookie = name + "=" + value + expires + "; path=/";
	}
	
	// cookie function http://www.quirksmode.org/js/cookies.html
	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') 
				c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0) 
				return c.substring(nameEQ.length, c.length);
		}
		return null;
	}
	
	// cookie function http://www.quirksmode.org/js/cookies.html
	function eraseCookie(name) {
		createCookie(name, "", -1);
	}
	
})(jQuery);

// Add Style Sheet Support for this plug-in
Utils.addCSSSupportFile(Utils.getSupportPath()+"/styleswitcher/style.css"); 