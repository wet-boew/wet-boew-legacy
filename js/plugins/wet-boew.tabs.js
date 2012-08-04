/*!
 * Tabbed interface v1.3 / Interface à onglets v1.3
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */

/**
 * Tabs plugin
 * @author Dave Schindler (sorry for the huge mess of uncommented code. I will add comments as soon as I figure out what code will stay)
 * @author Paul Jackson
 */
(function($) {
	/** default console logging for development purposes **/
	var debugMode = false, log;
	if (debugMode && window.console && window.console.log) {
		log = window.console.log;
	} else {
		log = function() {};
	}

	/** core function **/
	$.fn.tabs = function(opts) {
		
		var dictionary = {
			startButtonText : (PE.language==="eng") ? "Play" : "Jouer",
			startButtonHiddenText : (PE.language==="eng") ? ": Start tab rotation" : " : Lancer la rotation d'onglets",
			stopButtonText : (PE.language==="eng") ? "Pause" : "Pause",
			stopButtonHiddenText : (PE.language==="eng") ? ": Stop tab rotation" : " : Arrêter la rotation d'onglets"
		}

		// use jQuery best practices for chainability - returning a this and using .each allows for parameter setting via classname conventions
		return this.each(function(i) {
			// localize the parent node and its childern to bind events to
			var $this = $(this);
			// now we start to set the parameters via the classname method we can also leverage the format to pass this object directly to the easytabs plugins reducing code bloat
			var opts = {
				"panelActiveClass":'active', // since parameterless allows us to set more standard approaches we can now be more firm to facilitate use
				"tabActiveClass":'active', // since parameterless allows us to set more standard approaches we can now be more firm to facilitate use
				"defaultTab": '.default', // we are now class-based ** note easytabs needed a modification to allow for fallback
				"autoHeight" : ( $this.hasClass('auto-height-none') ) ? false : true,
				"cycle" :  ( $this.hasClass('cycle-slow') ) ? 12000 : ( ( $this.hasClass('cycle-fast') ) ? 6000 : ($this.hasClass('cycle')) ? 10000 : false ), // we can now standardize the cycle speed to fast, normal , slow
				"autoPlay" : ( $this.hasClass('auto-play-none') ) ? false : true,
				"animate": ( $this.hasClass('animate') || $this.hasClass('animate-slow') || $this.hasClass('animate-fast')  ) ? true : false,
				"animationSpeed":( $this.hasClass('animate-slow') ) ? 'slow' : ( ( $this.hasClass('animate-fast') ) ? 'fast' : 'normal' )
			}
			// set the navigation start point - set by the .tabs class
			var $nav = $this.find(".tabs");
			// find the array of tabs to isolate - but to increase flexibility lets isolate anchors
			var $tabs = $nav.find('li > a');
			// lets go find the child
			var $panels = $this.find('.tabs-panel').children();
			// lets set the default tab or find it
			var $default_tab = ( $nav.find('.default').length > 0 ) ? $nav.find('.default') : $nav.find('li:first-child') ;
			// WAI-ARIA accessibility features
			$nav.attr("role", "tablist");
			// now traverse li in each of the nav and assign it the WAI-ARIA Properties
			$nav.find('li').each(function() {
				$(this).attr("role", "presentation");
				$(this).children('a').each(function() {
					$(this).attr("role", "tab").attr("aria-selected","false").attr("id",$(this).attr("href").substring(1) + "-link").bind('click', function(evt){
						$(this).parent().parent().children('.active').children('a').each(function() {
							$(this).attr("aria-selected","false");
							$('#'+$(this).attr("href").substring(1)).attr("aria-hidden","true");
						});
						$(this).attr("aria-selected","true");
						$('#'+$(this).attr("href").substring(1)).attr("aria-hidden","false");
					});
				});
			});

			// now traverse the panels
			$panels.each(function(){
				$(this).attr("role", "tabpanel").attr("aria-hidden", "true").attr("aria-labelledby", $('a[href*="#'+$(this).attr("id")+'"]').attr("id"))}
				);
			// class .default is now the parameterless default for the tabbed interface
			$default_tab.children('a').each(function() {
				$(this).attr("aria-selected","true");
				$('#'+$(this).attr("href").substring(1)).attr("aria-hidden","false");
			});

			// Allows for keyboard support
			$(this).bind('keydown', 'ctrl+left ctrl+up', function(evt){
				// call function to move to previous tab
				selectPrev($tabs, $panels, opts);
				evt.stopPropagation ? evt.stopImmediatePropagation() : evt.cancelBubble = true;
			});
			$(this).bind('keydown', 'ctrl+right ctrl+down', function(evt){
				// call function to move to next tab
				selectNext($tabs, $panels, opts);
				evt.stopPropagation ? evt.stopImmediatePropagation() : evt.cancelBubble = true;
			});
			
			// lets the user move from the tab to the corresponding panel by pressing enter or spacebar on the tab
			$nav.find('li a').bind('keydown', function(e) {
				if (e.keyCode == 13 || e.keyCode == 32) {
					// this was a call to a method before with can be a bit of overhead we can just call it directy for speed sake
					var $current = $panels.filter(function() { return $(this).is('.active') });
					$current.attr('tabindex','0');
					// setTimeout so that JAWS doesn't ignore the .focus() on a usually non-focusable element.
					setTimeout(function(){$current.focus();},0);
				}
			});

			var selectPrev = function($tabs, $panels, opts, keepFocus) {
				var $current = $tabs.filter(function() { return $(this).is('.active') });
				var $prev = $tabs.eq( (($tabs.index($current) - 1) + $tabs.size()) % $tabs.size());
				if (opts.animate) {
					$panels.filter("." + opts.panelActiveClass).removeClass(opts.panelActiveClass).attr("aria-hidden","true").fadeOut(opts.animationSpeed, function(){$panels.filter("#" + $next.attr("href").substr(1)).fadeIn(opts.animationSpeed, function(){ $(this).addClass(opts.panelActiveClass).attr("aria-hidden","false");});});
				} else {
					$panels.removeClass(opts.panelActiveClass).attr("aria-hidden","true").hide();
					$panels.filter("#" + $prev.attr("href").substr(1)).show().addClass(opts.panelActiveClass).attr("aria-hidden","false");
				}
				$tabs.parent().removeClass(opts.tabActiveClass).children().removeClass(opts.tabActiveClass).filter('a').attr("aria-selected","false");
				$prev.parent().addClass(opts.tabActiveClass).children().addClass(opts.tabActiveClass).filter('a').attr("aria-selected","true");
				var cycleButton = $current.parent().siblings('.tabs-toggle');
				if (!keepFocus && (cycleButton.length === 0 || cycleButton.data("state") === "stopped")) {$prev.focus();}
			};

			var selectNext = function($tabs, $panels, opts, keepFocus) {
				var $current = $tabs.filter(function() { return $(this).is('.active') });
				var $next = $tabs.eq(($tabs.index($current) + 1) % $tabs.size());
				if (opts.animate) {
					$panels.filter("." + opts.panelActiveClass).removeClass(opts.panelActiveClass).attr("aria-hidden","true").fadeOut(opts.animationSpeed, function(){$panels.filter("#" + $next.attr("href").substr(1)).fadeIn(opts.animationSpeed, function(){ $(this).addClass(opts.panelActiveClass).attr("aria-hidden","false");});});
				} else {
					$panels.removeClass(opts.panelActiveClass).attr("aria-hidden","true").hide();
					$panels.filter("#" + $next.attr("href").substr(1)).show().addClass(opts.panelActiveClass).attr("aria-hidden","false");
				}
				$tabs.parent().removeClass(opts.tabActiveClass).children().removeClass(opts.tabActiveClass).filter('a').attr("aria-selected","false");
				$next.parent().addClass(opts.tabActiveClass).children().addClass(opts.tabActiveClass).filter('a').attr("aria-selected","true");
				var cycleButton = $current.parent().siblings('.tabs-toggle');
				if (!keepFocus && (cycleButton.length === 0 || cycleButton.data("state") === "stopped")) {$next.focus();}
			};

			if (opts.autoHeight) {
				$panels.show();
				$('.tabs-panel', $this).equalHeights(true);
			}
			
			// most of the heavy lifting is done by EasyTabs... and since we are going parameterless this is where the bulk of the parameters are being set
			// use the jquery extend function to set the cycle options to false to not use the easytab cycling feature and use the plugin's one instead. easyTabs always receives false for cycle but the opts.cycle retains its real value
			$this.easytabs($.extend({}, opts, {cycle : false}));

			// ...except for cycling, because easyTabs' cycle feature is buggy when there are multiple instances per page...and it's missing some nice features.
			if (opts.cycle) {
				var cycle = function($tabs, $panels, opts) {
					var $current = $tabs.filter(function() { return $(this).is('.active') });
					var $pbar = $current.siblings('.tabs-roller');
					$this.find('.tabs-toggle').data('state', 'started');
					$pbar.show().animate({"width":$current.parent().width()}, opts.cycle-200, "linear", function() {
						$(this).width(0).hide();
						selectNext($tabs, $panels, opts, true);
						$this.data('interval', setTimeout(function(){cycle($tabs, $panels, opts);}, 0));
					});
				};
				var stopCycle = function(opts) {
					clearTimeout($this.data('interval'));
					$this.find('.tabs-roller').width(0).hide().stop();
					$this.find('.tabs-toggle').data('state', 'stopped');
					$toggleButton.removeClass(stop["class"]).addClass(start["class"]).html(start["text"] + "<span class='cn-invisible'>" + start["hidden-text"] + "</span>").attr('aria-pressed', false);
					$('.cn-invisible', $toggleButton).text(start["hidden-text"]);
				};

				// creates a play/pause button, and lets the user toggle the state
				var $toggleRow = $("<li class='tabs-toggle'>");
				var stop = {"class":"tabs-stop", "text":dictionary.stopButtonText, "hidden-text":dictionary.stopButtonHiddenText};
				var start = {"class":"tabs-start", "text":dictionary.startButtonText, "hidden-text":dictionary.startButtonHiddenText};
				var $toggleButton = $("<a class='" + stop["class"] + "' href='javascript:;' role='button' aria-pressed='true'>" + stop["text"] + "<span class='cn-invisible'>" + stop["hidden-text"] + "</span></a>");
				$nav.append($toggleRow.append($toggleButton));
				// handler for $toggleButton clicks
				var toggleCycle = function() {
					if ($toggleRow.data("state") === "stopped") {
						// start cycle and toggle button text to pause
						selectNext($tabs, $panels, opts, true);
						cycle($tabs, $panels, opts);
						$toggleButton.removeClass(start["class"]).addClass(stop["class"]).html(stop["text"] + "<span class='cn-invisible'>" + stop["hidden-text"] + "</span>").attr('aria-pressed', true);
						$('.cn-invisible', $toggleButton).text(stop["hidden-text"]);
					} else if ($toggleRow.data("state") === "started") {
						// stop cycle and toggle button text to play
						stopCycle(opts);
					}
				};
				// lets the user pause cycling by clicking on the start/stop button
				$toggleRow.click(toggleCycle).bind("keydown", function(e) {
					if (e.keyCode == 32) {
						toggleCycle();
						e.preventDefault();
					}
				});
				// also stop cycling if the user clicks on a tab
				$nav.find('li a').not($toggleRow.find('a')).click(function() {
					stopCycle(opts);
				});
				// Sliding progress bar setup
				$tabs.each(function(){
					var $pbar = $('<div class="tabs-roller">').hide().click(function(){
						// let clicks pass through
						$(this).siblings('a').click();
					}).hover(function(){
						$(this).css("cursor", "text");
					});
					if ($.browser.msie && $.browser.version < 8) {
						$(".tabs-style-2 .tabs, .tabs-style-2 .tabs li").css("filter", "");
					}
					$(this).parent().append($pbar);
				});

				// okay, we're set up, so start cycling
				cycle($tabs, $panels, opts);
				if (!opts.autoPlay) {
					stopCycle(opts);
				}
			} // end of cycle code

			// check for anchors in the panels, and add click listeners to focus on them if their panel is hidden. - modified the scope to focus on just the tabbed interface
			$this.find('a[href^="#"]').each(function() {
				var hash = $(this).attr('href');
				if (hash.length > 1) {
					var anchor = $(hash, $panels);
					if (anchor.length) {
						console.log("anchor found:",anchor, ", for link:",$(this));
						$(this).click(function(e) {
							var panel = anchor.parents('[role="tabpanel"]:hidden');
							if (panel) {
								e.preventDefault();
								var panelId = panel.attr("id");
								panel.parent().siblings('.tabs').find('a[href="#' + panelId + '"]').click();
								anchor.get(0).scrollIntoView(true);
							}
						});
					}
				}
			});

		}); // end of for each loop on tabSelector
	}; // end of $.fn.tabs definition

	// adding style sheets
	Utils.addCSSSupportFile(Utils.getSupportPath()+"/tabs/style.css");
	Utils.addIECSSSupportFile(Utils.getSupportPath()+"/tabs/styleIE6.css", 6);
	Utils.addIECSSSupportFile(Utils.getSupportPath()+"/tabs/styleIE7.css", 7);
	PE.load('tabs/easyTabs.js');
    // setting defaults


	$(document).ready(function() {
			$('.wet-boew-tabbed-interface').tabs();
	});

	// end of closure
})(jQuery);

