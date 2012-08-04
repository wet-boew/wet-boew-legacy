/*!
 * Coda slider v1.11 / Coulisse coda v1.11
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * Terms and conditions of use: http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Terms
 * Conditions régissant l'utilisation : http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Conditions
 */

/*
	jQuery Coda-Slider v2.0 - http://www.ndoherty.biz/coda-slider
	Copyright (c) 2009 Niall Doherty
	This plugin available for use in all personal or commercial projects under both MIT and GPL licenses.
*/

/**
 * Codaslider is a jQuery plugin for scrolling, sliding, or rotating cotent 
 * horizontally or vertically
 *
 * Supports : Firefox, Opera, Safari, Chrome, IE 6 and IE 7+
 *
 * @name Codaslider
 * @author Dave Schindler
 * @author Alex Bégin
 * @author Paul Jackson
 * @version 1.1
 */
 

$.fn.codaslider = function () {
	
	var params = Utils.loadParamsFromScriptID("codaslider");
	var $panels = $('#'+ params.id +' .scroll-panel');
	var $container = $('#'+ params.id +' #scroll-container');
	var $nav = $('#' + params.id + ' .slider-nav');
	var $dir = params.dir;
	var $max_height = 0;
	var horizontal = true;
	
	var prev = PE.language === 'eng' ? 'Previous<span class="cn-invisible">&#160;item in the group</span>' : 'Pr\xe9c\xe9dent<span class="cn-invisible">&#160;- Article pr\xe9c\xe9dent dans le groupe</span>';
	var next = PE.language === 'eng' ? 'Next<span class="cn-invisible">&#160;item in the group</span>' : 'Suivant<span class="cn-invisible">&#160;- Article suivant dans le groupe</span>';
	
	// insert a div to clear floats
	var $clearDiv = $('<div class="clear"></div>');
	$panels.last().after($clearDiv);
	
	// Checks if content is scrolled horizontally or vertically
	if ($dir == "horizontal")		horizontal = true;
	else if	($dir == "vertical") 	horizontal = false;
	
	// WAI-ARIA accessibility features
	$nav.attr("role", "tablist");
	$('li', $nav).each(function() {		
		$(this).attr("role", "presentation");
		$(this).children('a').each(function() {
			$(this).attr("role", "tab").attr("id",$(this).attr("href").substring(1) + "-link");
		});
	});
	$panels.each(function() {$(this).attr("role", "tabpanel").attr("aria-labelledby", $('a[href*="#'+$(this).attr("id")+'"]').attr("id"))});
	
	// set a height for the container if going vertical
	if (!horizontal) {
		// Sets the container height dynamically to the largest content panel
		jQuery.each($panels, function(index, value) { 
			if ($(value).outerHeight() > $max_height ) {
				$max_height =  $(value).outerHeight();
			}
		});
		jQuery.each($panels, function(index, value) { 
			$(value).wrap('<div style="height:'+$max_height+'px"></div>');
		});
		// calculate a new width for the container (so it holds all panels)
		$('.scroll').css('height', $max_height);
	}
	
	// float the panels left if we're going horizontal
	if (horizontal) {
		$panels.css({
			'float' : 'left',
			'position' : 'relative' // IE fix to ensure overflow is hidden
		});
		// calculate a new width for the container (so it holds all panels)
		$container.css('width', $panels.outerWidth(true) * $panels.length);
	}

	// collect the scroll object, at the same time apply the hidden overflow
	// to remove the default scrollbars that will appear
	var $scroll = $('#'+ params.id +' .scroll').css('overflow', 'hidden');

	// apply our left + right buttons
	$('#'+ params.id +' .slider-nav')
		.after('<div class="slider-buttons" role="toolbar"><a class="slider-prev" href="#" aria-controls="scroll-container">' + prev + '</a><a class="slider-next" href="#" aria-controls="scroll-container">' + next + '</a></div>');
	 
	// handle nav selection
	function selectNav() {
	  $(this)
			.parents('ul:first')
				.find('a')
				.removeClass('slider-selected').attr('aria-selected','false')
				.end()
			.end()
		.addClass('slider-selected').attr('aria-selected','true');
	}

	$nav.find('a').click(selectNav);
	
	// go find the navigation link that has this target and select the nav
	function trigger(data) {
		var el = $nav.find('a[href$="' + data.id + '"]').get(0);
		selectNav.call(el);
	}

	// Next and Prev Functions to bind 
	function nextElement() { 
		$('#'+ params.id +' .scroll').trigger('next');
		var $el = $nav.find('a.slider-selected').parent().next().children();
		if ($el.length === 0) {
			$el = $('a', $nav).first();
		}
		$el.focus();
		selectNav.call($el.get(0));
	};
	function prevElement() {
		$('#'+ params.id +' .scroll').trigger('prev') ;
		var $el = $nav.find('a.slider-selected').parent().prev().children();
		if ($el.length === 0) {
			$el = $('a', $nav).last();
		}
		$el.focus();
		selectNav.call($el.get(0));
	};

	// If there is an anchor present in the URL the slider will still select the first
	// nav item
	if (window.location.hash) {
		trigger({ id : window.location.hash.substr(1) });
	} else {
		$nav.find('a:first').click();
	}
	
	// Refocuses on the referring image link when the brower back button is used
	$(window).bind('hashchange', function () {
		if (window.location.hash) trigger({ id : window.location.hash.substr(1) });
		else {
			$('.slider-selected').focus();
		}
	});

	// offset is used to move to *exactly* the right place, since I'm using
	// padding on my example, I need to subtract the amount of padding to
	// the offset.  Try removing this to get a good idea of the effect
	var offset = parseInt((horizontal ? 
		$container.css('paddingTop') : 
		$container.css('paddingLeft')) 
		|| 0) * -1;

	var scrollOptions = {
		target: $scroll, 					// the element that has the overflow
		items: $panels,						// can be a selector which will be relative to the target	  
		navigation: '.slider-nav a',		// selectors are NOT relative to document, i.e. make sure they're unique
		prev: 'a.slider-prev', 
		next: 'a.slider-next',
		axis: 'xy',							// allow the scroll effect to run both directions
		//onAfter: trigger, 					// our final callback
		offset: offset,
		duration: 'normal',					// duration of the sliding effect
		easing: 'swing'
		// easing - can be used with the easing plugin: 
		// http://gsgd.co.uk/sandbox/jquery/easing/
	};

	// apply serialScroll to the slider - we chose this plugin because it 
	// supports// the indexed next and previous scroll along with hooking 
	// in to our navigation.
	$('#'+ params.id ).serialScroll(scrollOptions);
	
	// Selects on focus, so that users can tab through the nav list, and the panels react.
	$('a', $nav).bind('focus', function() {$(this).click();});
	
	// Switches the displayed panel when tabbing from an element in one panel to an element in another panel
	$('a', $container).bind('focus', function() {
		if ($(this).parents('.scroll-panel').attr('id') != $('.slider-selected').attr('href').substring(1)) {
			$('a[href$="' + $(this).parents('.scroll-panel').attr('id') + '"]').click();
			$(this).focus();
		}
	});
	$('input', $container).bind('focus', function() {
		if ($(this).parents('.scroll-panel').attr('id') != $('.slider-selected').attr('href').substring(1)) {
			$('a[href$="' + $(this).parents('.scroll-panel').attr('id') + '"]').click();
			$(this).focus();
		}
	});
	$('select', $container).bind('focus', function() {
		if ($(this).parents('.scroll-panel').attr('id') != $('.slider-selected').attr('href').substring(1)) {
			$('a[href$="' + $(this).parents('.scroll-panel').attr('id') + '"]').click();
			$(this).focus();
		}
	});
	$('textarea', $container).bind('focus', function() {
		if ($(this).parents('.scroll-panel').attr('id') != $('.slider-selected').attr('href').substring(1)) {
			$('a[href$="' + $(this).parents('.scroll-panel').attr('id') + '"]').click();
			$(this).focus();
		}
	});
	$('button', $container).bind('focus', function() {
		if ($(this).parents('.scroll-panel').attr('id') != $('.slider-selected').attr('href').substring(1)) {
			$('a[href$="' + $(this).parents('.scroll-panel').attr('id') + '"]').click();
			$(this).focus();
		}
	});
	
	// Sends focus to the panel if one of the links has focus and either Enter of Space bar is pressed
	$('a', $nav).bind('keyup', function(event) {
		if (event.keyCode == 13 || event.keyCode == 32) {
			window.location = $(this).attr('href');
			$('[class="scroll-panel"][tabindex="-1"]').removeAttr('tabindex');
			setTimeout("$($('a.slider-selected').attr('href')).attr('tabindex','-1').focus();",0);
			
			// Prevent IE6 and IE7 scrolling bug when tab activated with the space bar
			if (event.keyCode == 32 && $.browser.msie && $.browser.version < 8) {
				scrollOptions.duration = 1;
				$.localScroll.hash(scrollOptions);
			}
		}
	});

	// now apply localScroll to hook any other arbitrary links to trigger 
	// the effect
	$nav.localScroll(scrollOptions);

	// finally, if the URL has a hash, move the slider in to position, 
	// setting the duration to 1 because I don't want it to scroll in the
	// very first page load.  We don't always need this, but it ensures
	// the positioning is absolutely spot on when the pages loads.
	scrollOptions.duration = 1;
	$.localScroll.hash(scrollOptions);
};

PE.load('codaslider/jquery.localscroll.js');
PE.load('codaslider/jquery.scrollTo.js');
PE.load('codaslider/jquery.serialScroll.js');
Utils.addCSSSupportFile( Utils.getSupportPath()+"/codaslider/style.css");
$(document).ready(function() {$('.codaslider').codaslider(); });
