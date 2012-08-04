/*!
 * Floating toolbar v1.2 / Barre d'outils flottée v1.2
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * Terms and conditions of use: http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Terms
 * Conditions régissant l'utilisation : http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Conditions
 */
var toolbar = {
	
	//Global parameters
	defaultMethod : "get",
	defaultSearchFieldName : "search",
	
	// Load the parameters used in the plugin declaration. Parameters can be access using this.parms.parameterName
	params :  Utils.loadParamsFromScriptID("toolbar"),
	
	//Used to store localized strings for your plugin.
	dictionary : {
		homePage :(PE.language == "eng") ? "Home" : "Accueil",
		topOfPage :(PE.language == "eng") ? "Top of Page" : "Haut de la page",
		searchLabel :(PE.language == "eng") ? "Search:" : "Recherche : ",
		searchButton :(PE.language == "eng") ? "Search" : "Recherche"
	},
	
	//Method that is executed when the page loads
	init : function(){
		var uagent = navigator.userAgent.toLowerCase();
		this.createToolbar();
				
		if (uagent.search("ipad") > -1 || uagent.search("iphone") > -1 || uagent.search("ipod") > -1 || uagent.search("android") > -1 || uagent.search("symbian") > -1 || uagent.search("windows ce") > -1 || uagent.search("blackberry") > -1 || uagent.search("palm") > -1 || uagent.search("Skyfire") > -1) {
			$(".toolbar").remove();
		} else {
			$(window).bind('scroll', toolbar.onScroll);	
			if($(this).scrollTop() < 10 || $(this).scrollTop() == undefined) {$(".toolbar").hide();}
			else $(".toolbar").show();
		}
	},
	
	createToolbar : function(){
		var homeLink;
		var action;
		var method;
		var fieldName;
		var container;
				
		if (this.params.homeLinkSelector != null)
		{
			homeLink = $(this.params.homeLinkSelector)[0];
		}
		
		if (this.params.searchLinkSelector != null){
			action = $(this.params.searchLinkSelector)[0];
		}
		
		if ($("#cn-body-inner-3col").length > 0){
			container = $("#cn-body-inner-3col");
		}else if ($("#cn-body-inner-2col").length > 0){
			container = $("#cn-body-inner-2col");
		}else if ($("#cn-body-inner-1col").length > 0){
			container = $("#cn-body-inner-1col");
		}else{
			container = $("body");
		}
		
		var method = (this.params.searchMethod != null) ? this.params.searchMethod : this.defaultMethod
		var fieldName = (this.params.searchFieldName != null) ? this.params.searchFieldName : this.defaultSearchFieldName
		
		container.append('<div class="toolbar" role="toolbar"><ul><li><a href="' + homeLink + '" class="toolbar-homepage" role="link">' + this.dictionary.homePage + '</a></li><li><form action="' + action + '" method="' + method + '"><div class="toolbar-search-box" role="search"><p><label for="toolbar-search-field">' + this.dictionary.searchLabel + '</label><input id="toolbar-search-field" name="' + fieldName + '" type="search" role="textbox" aria-multiline="false" /><input class="toolbar-search-button" value="' + this.dictionary.searchButton + '" type="submit" role="button" /></p></div></form></li><li class="toolbar-top-page"> <a href="#cn-tphp" role="link">' + this.dictionary.topOfPage + '</a> </li></ul></div>')
	},
	
	onScroll: function(){
		if($(this).scrollTop() > 10) {
			toolbar.show();
		}else{
			toolbar.hide();
		}
	},
	
	show : function(){
		$(".toolbar").fadeIn("normal").attr('aria-hidden','false');
	},
	
	hide : function(){
		$(".toolbar").fadeOut("normal").attr('aria-hidden','true');
	}
}
// Add Style Sheet Support for this plug-in
Utils.addCSSSupportFile(Utils.getSupportPath()+"/toolbar/style.css");

// Init Call at Runtime
$("document").ready(function(){   toolbar.init(); });