/*!
 * Expandable/collapsible content v1.3 / Contenu en arborescence affichable/masquable v1.3
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */
(function($){
	$.fn.expandHide = function() {
		var $elm;
		
		var currUrlObj = PE.url();
		
		var currIndexTC = 1;
		var currIndexTM = 1;
		
		dictionary = {
			hideText :(PE.language == "eng") ? "Hide:" : "Masquer :",
			hideMenuText :(PE.language == "eng") ? "hide" : "masquer",
			hideAllText: (PE.language == "eng") ? "Hide All<span class=\"cn-invisible\"> sections of collapsable content</span>" : "Masquer Tout<span class=\"cn-invisible\">es les sections de contenu rabatable</span>",
			expandText : (PE.language == "eng") ?  "Expand:" : "Afficher :",
			expandMenuText : (PE.language == "eng") ?  "expand" : "afficher",
			expandAllText: (PE.language == "eng") ? "Expand All<span class=\"cn-invisible\"> sections of collapsed content</span>" : "Afficher Tout<span class=\"cn-invisible\">es les sections masqu\xe9es</span>" 
		}
		
		/** Special Overide - CRA REQUEST **/
		/*if(expandhide.params.rule == 'enforce-nav-open') {
			$("div#cn-left-col ul > li:has(ul)").addClass('nav-open');
			$("ul.toggle-menu").parent("ul > li").removeClass('nav-open');
		}*/

		addGlobalTriggers = function($container){  
			var toggleAllContainer = "<p class=\"toggle-all-controls\"><a class=\"toggle-all-expand\" href=\"javascript:;\" role=\"button\"><span>" + dictionary.expandAllText+ "</span></a><a class=\"toggle-all-collapse\" href=\"javascript:;\" role=\"button\"><span>" + dictionary.hideAllText+ "</span></a></p>"
			
			if ($container.hasClass("global-toggles-start")){
				$container.prepend($(toggleAllContainer));
			}
			
			if($container.hasClass("global-toggles-end")){
				$container.append($(toggleAllContainer));
			}
			
			$container.find(".toggle-all-expand").bind("click", {container : $container}, function(e){showAll(e.data.container);});
			$container.find(".toggle-all-collapse").bind("click", {container : $container}, function(e){hideAll(e.data.container);});
		}
		
		addTriggers = function($container){
			var idPrefixTC = 'toggle-content-id';
			var ariaControls = '';
			var idPrefixTM = 'toggle-menu-id';
			
			//Add ids to toggle elements that don't have them
			$container.find('.toggle-content, .toggle-menu').each(function(e){
				$this = $(this);
				if ($this.is('.toggle-content'))
				{
					if ($this.attr('id') == undefined) {
						$this.attr('id',idPrefixTC + currIndexTC);
						if (currIndexTC == 1) ariaControls = ariaControls + idPrefixTC + currIndexTC;
						else ariaControls = ariaControls + ' ' + idPrefixTC + currIndexTC;
						currIndexTC++;
					}
				} else {
					if ($this.attr('id').length == 0) {
						$(this).attr('id',idPrefixTM + currIndexTM);
						currIndexTM++;
					}
				}
			});
			
			loadStates($container);
			
			$container.find('.toggle-content').each(function(){createContentControl($container, $(this));});
			$container.find('.toggle-menu').each(function(){createMenuControl($container, $(this));});
			
			if (currIndexTC > 1) {
				$('.toggle-all-expand').attr('aria-control',ariaControls);
				$('.toggle-all-collapse').attr('aria-control',ariaControls);
			}
		}
		
		//NEEDS OPTIMIZATION
		// TC.3 - Since there are two potential classes that have different childern selectors and mechanics seperate object based methods were created.
		//  - Method : createContentControl - Creates the Content body expand/hide functionality
		createContentControl = function($container, $content) {
			var $toggleContainer = $("<div></div>");
			var titleSelector = ":header:eq(0)";
			var titleText = $content.find(titleSelector).html();
	
			$content.find(titleSelector).addClass('cn-invisible'); // UxWG Request to remove duplicate Head elements
			var initText; var initClass;
			if ($content.hasClass('collapse')){
				$content.hide().attr('aria-hidden','true');
				initText = dictionary.expandText;
				initClass="toggle-link-expand";
			} else{
				$content.attr('aria-hidden','false')
				initText = dictionary.hideText;
				initClass="toggle-link-collapse";
			}
			var $toggleElm = $("<a class=\"" + initClass + "\" href=\"javascript:;\" role=\"button\" aria-pressed=\"" +( ($content.hasClass('collapse')) ? 'false' : 'true')+ "\" aria-controls=\"" + $content.attr('id') + "\"><span class=\"cn-invisible "+( ($content.hasClass('collapse')) ? 'state-expand' : 'state-hide')+"\">" + initText + "</span> " + titleText + "</a>");
			
			$toggleElm.click(function(){toggle($container, $content, $(this));});
			$toggleContainer.append($toggleElm);
			$content.before($toggleContainer);
		}
		
		//NEEDS OPTIMIZATION
		// TC.3 - Since there are two potential classes that have different childern selectors and mechanics seperate object based methods were created.
		//  - Method : createMenuControl - Creates the Ul Meun based expand/hide functionality
		createMenuControl = function($container, $content) {
			var titleSelector = ":header:eq(0)";
			
			$content.hide();
			$content.prev().addClass('toggle-menu-spacer'); // dynamenu-spacer => toggle-menu-spacer
			var tText = $content.parent().find(titleSelector).html() ;
			/** Add Arrow **/
			$content.before("<a class=\"toggle-menu-link-expand\" href=\"javascript://\" role=\"button\" aria-pressed=\"false\" aria-controls=\"" + $content.attr('id') + "\">"+dictionary.expandMenuText+" <span class=\"cn-invisible\">"+tText+"</span></a>");
			$content.addClass('toggle-menu-collapse').attr('aria-hidden','true');
			/** Now add the toggle level **/
			$content.prev().click(
			function() {
				$(this).next().slideToggle('normal');
				var tText = $(this).parent().find(titleSelector).html() ;
					 
				if ( $(this).next().hasClass('toggle-menu-collapse') ) {
					$(this).html( dictionary.hideMenuText +" <span class=\"cn-invisible\">"+tText+"</span>");
					$(this).removeClass('toggle-menu-link-expand');
					$(this).addClass('toggle-menu-link-collapse').attr('aria-pressed','true');
					$(this).parent().addClass('nav-open');
					$(this).next().removeClass('toggle-menu-collapse').attr('aria-hidden','false');  
				}else{ 
					$(this).html( dictionary.expandMenuText+" <span class=\"cn-invisible\">"+tText+"</span>");
					$(this).removeClass('toggle-menu-link-collapse');
					$(this).addClass('toggle-menu-link-expand').attr('aria-pressed','false');
					$(this).parent().removeClass('nav-open');
					$(this).next().addClass('toggle-menu-collapse').attr('aria-hidden','true');                 
				}
			}
				);
				/** Special Overide - CRA REQUEST **/
				/** if(expandhide.params.rule == 'enforce-nav-open') {
					$("ul").parent("ul > li").addClass('nav-open');
					$("ul.toggle-menu").parent("ul > li").removeClass('nav-open');
					}    **/
		}
		
		toggle = function($container, $content, $toggle){
			if ($content.attr('aria-hidden') == 'false') $content.slideToggle('normal').addClass("collapse").attr('aria-hidden','true');
			else $content.removeClass("collapse").slideToggle('normal').attr('aria-hidden','false');
			$toggle.toggleClass("toggle-link-expand toggle-link-collapse");
			toggleText($toggle);
			
			//Save the states after the animations are done
			$content.promise().done(function(){saveStates($container)});
		}
		
		showAll = function ($container){
			$cnt = $container.find('.toggle-content')
			$cnt.removeClass("collapse").slideDown('normal').attr('aria-hidden','false');
			var toggles = $container.find('.toggle-link-expand');
			toggles.removeClass('toggle-link-expand').addClass('toggle-link-collapse');
			toggles.each(
				function(){toggleText($(this));}
			)
			
			//Save the states after the animations are done
			$cnt.promise().done(function(){saveStates($container)});
		}
		
		hideAll = function ($container){
			$cnt = $container.find('.toggle-content')
			$cnt.addClass("collapse").slideUp('normal').attr('aria-hidden','true');
			var $toggles = $container.find('.toggle-link-collapse');
			$toggles.removeClass('toggle-link-collapse').addClass('toggle-link-expand');
			$toggles.each(
				function(){toggleText($(this));}
			)
			
			//Save the states after the animations are done
			$cnt.promise().done(function(){saveStates($container)});
		}
		
		toggleText = function($toggle){
			if ( $toggle.find('span').hasClass('state-expand') ){
				$toggle.find('span').removeClass('state-expand').addClass('state-hide').text(this.dictionary.hideText);
				$toggle.attr('aria-pressed','true');
			}else{
				$toggle.find('span').removeClass('state-hide').addClass('state-expand').text(this.dictionary.expandText);
				$toggle.attr('aria-pressed','false');
			}
		}
		
		
		saveStates = function($container){
			var context = getStateContext($container);
			if (context !== null){
				var states="";
				
				var $toggles = $container.find(".toggle-content");
				$toggles.each(function(index){
					$this = $(this);
					states += $this.attr("id") + "=" + $this.is(":not(:hidden)");
					if (index < $toggles.length -1) {states += ",";}
				});
				
				$.Storage.set(context, states)
			}
		}
		
		loadStates = function($container){
			var initial = {};
			
			//Load storage states
			var context = getStateContext($container);
			if (context !== null){
				var states = $.Storage.get(context);
				
				if (states !== null && states !== undefined ){
					states = states.split(",");
					
					for (var s=0; s < states.length; s++){
						var t = states[s].split("=");
						initial[t[0]] = (t[1] === "true") ? true : false;
					}
				}
			}
			
			//Load states from the querystring
			if (currUrlObj.queryTokenized.expand) {
				var ids = currUrlObj.queryTokenized.expand.split(",");
				var query = {};
				
				for (var s=0; s < ids.length;s++){
					query[ids[s]] = true;
				}
				
				//Override cookie settings with querystring information
				$.extend(initial, query)
			}
			
			//Modify the states of the objects
			for (var s in initial){
				var $o = $container.find("#" + s);
				
				if ($o.hasClass("collapse") && initial[s] === true){
					$o.removeClass("collapse");
				}else if (!$o.hasClass("collapse") && initial[s] === false){
					$o.addClass("collapse");
				}
			}
		}
		
		getStateContext = function($container){
			//persist-static uses the querystring in the url to save states. persist diregards the querystring when saving states allowing to share states for dynamic pages using
			if ($container.attr("id") !== undefined && ($container.hasClass("persist") || $container.hasClass("persist-static"))){
				url = currUrlObj.absolute
				
				//Removes the anchor
				if (currUrlObj.anchor != "") url = url.replace ("#" + currUrlObj.anchor, "");
				
				if ($container.hasClass("persist") ){
					//Removes the querystring
					if (currUrlObj.query != "") url = url.replace ("?" + currUrlObj.query, "");
				}
				
				url += "#" + $container.attr("id");
				
				return url;
			}
			
			return null;
		}
		
		$(this).each(function(){;
			$elm = $(this);
			addTriggers($elm);
			if ($elm.hasClass("global-toggles-start") || $elm.hasClass("global-toggles-end")){
				addGlobalTriggers($elm);
			}
		});
	}

	PE.load('jquery.cookie.js');

	// Add Style Sheet Support for this plug-in
	Utils.addCSSSupportFile(Utils.getSupportPath()+"/expandhide/style.css"); 
	// Init Call at Runtime
	$("document").ready(function(){   if (cssEnabled == null || cssEnabled) $(".wet-boew-expandhide").expandHide() });
})(jQuery); 