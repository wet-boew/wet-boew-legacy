/*! 
 * Archived Web Page template v1.11 / Modèle de page Web archivée v1.1
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */

/*
@author Stéphane Bérubé, Monica Baxter Burkitt
@description This feature provides an "archive" notice for your archived content. The notice appears at the top of the browser window when the user scrolls away from the top of the page.
*/

var archived = {
	
	// Load the parameters used in the plugin declaration. Parameters can be access using this.parms.parameterName
	params :  Utils.loadParamsFromScriptID("archived"),
	
	// Used to store localized strings for your plugin.
	dictionary : {
		notice :(PE.language == "eng") ? "This Web page has been archived on the Web." : "Cette page Web a été archivée dans le Web."
	},
	
	// Method that is executed when the page loads
	init : function(){
		var uagent = navigator.userAgent.toLowerCase();
		this.createToolbar();

        // Emulate fixed positioning for IE6
        if(jQuery.browser.msie && parseInt(jQuery.browser.version) == 6) {
            archived.reposition();
            $(window).bind('resize', archived.reposition);
        }
        
		if (uagent.search("ipad") > -1 || uagent.search("iphone") > -1 || uagent.search("ipod") > -1 || uagent.search("android") > -1 || uagent.search("symbian") > -1 || uagent.search("windows ce") > -1 || uagent.search("blackberry") > -1 || uagent.search("palm") > -1) {
			$(".archived").remove();
		} else {
			$(window).bind('scroll', archived.onScroll);
			//This is necessary for browser that do not fire a scroll event when page loads scrolled (ex. when linked with an anchor or when using the back and forward buttons)
			$(document).bind('ready', archived.onScroll);	
			if($(this).scrollTop() < 10 || $(this).scrollTop() == undefined) {$(".archived").hide();}
			else $(".archived").show();
		}
        
        // If we're in the Usability theme
        if($('#cn-gcnb').length > 0) { // NOTE: this assumes there is no id="cn-gcnb" on a CLF2 theme page. Which could be wrong...
            $('#archived').css({'margin-left': '10px', 'margin-right': '10px'});
        }
	},
	
    // Emulate fixed positioning for IE6
    reposition : function(){
        if(jQuery.browser.msie && parseInt(jQuery.browser.version) == 6) {
            $('.archived').css('width', $(document).width() + 'px');
            $('.archived').offset({top: $('.archived').offset().top, left: 0});
        }
    },
    
	createToolbar : function(){
		if ($("#cn-body-inner-3col").length > 0){
			container = $("#cn-body-inner-3col");
		}else if ($("#cn-body-inner-2col").length > 0){
			container = $("#cn-body-inner-2col");
		}else if ($("#cn-body-inner-1col").length > 0){
			container = $("#cn-body-inner-1col");
		}else{
			container = $("body");
		}
		
		container.append('<div class="archived" role="toolbar"><a class="archived-top-page" href="#archived" role="link">' + archived.dictionary.notice + '</a></div>')
        
        // If clicking on an anchor, take the height of the floating bar in consideration
        $('a').click(function(e){
            e.preventDefault(); // Ensures the execution order
            // Disregard hash when comparing URLs. Removing the hash with a regex might be more performant
            var targetURL = this.protocol + this.host + this.pathname + this.search;
            var currentURL = window.location.protocol + window.location.host + window.location.pathname + window.location.search;

            if(this.hash && (targetURL == currentURL)) { // If we clicked on an anchor on this page            
                window.location = this.hash; // Add anchor to URL
                $(window).scrollTop($(this.hash).offset().top-22); // Reposition so we don't overlap the targetted element
            }
            else { // If we clicked on a link to a different page, proceed as normal
                window.location = $(this).attr('href');
            }        
        });
	},
	
	onScroll: function(){
		if($(this).scrollTop() > 10) {
            archived.show();
		}else{
            // IE6 needs repositioning right before the notice is hidden
            archived.reposition();
			archived.hide();
		}
	},
	
	show : function(){
        if($('.archived').css('display') != 'block') {
            // IE6 needs repositioning right after the notice is shown
            $(".archived").fadeIn("normal", function(){archived.reposition()}).attr('aria-hidden','false');
        }
	},
	
	hide : function(){
		$(".archived").fadeOut("normal").attr('aria-hidden','true');
	}
}

// Init Call at Runtime
$("document").ready(function(){ archived.init(); });