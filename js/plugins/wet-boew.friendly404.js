/*!
 * Helpful 404 error pages v1.0 / Pages d'erreur 404 utiles v1.0
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * Terms and conditions of use: http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Terms
 * Conditions régissant l'utilisation : http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Conditions
 */

 /*
Friendly 404 page Script by Christian Rochefort
2011.05.19 Christian Rochefort Initial version
*/
friendly404 = {
	
	engines : [
		{	pattern : "google", name: "Google"	},
		{	pattern : "yahoo", name: "Yahoo"	},
		{	pattern : "bing", name: "Bing"		}
	],
	
	//Used to store localized strings for your plugin.
	dictionary : {
		eng : {
			searchEngineMsgStart : "You have been redirected on this page through a link provided by ",
			searchEngineMsgEnd : ". Your search criterias are not up to date on the search engine.",
			suggestionsMsgStart : "Base on the old link",
			suggestionsMsgEnd : ", maybe this is what you are searching for:"
		},
			
		fra:{
			searchEngineMsgStart : "Vous avez été redirigé sur cette page par l'entremise d'un lien fourni par " ,
			searchEngineMsgEnd : ". Les critères de votre recherche n'ont pas été mis à jour sur l'engin de recherche.",
			suggestionsMsgStart : "Basés sur le lien brisé", 
			suggestionsMsgEnd : ", nous vous suggérons d'essayer:"
		}
	},
	
	templates : {
		searchEngine : "<p>${text.searchEngineMsgStart}${searchEngine}${text.searchEngineMsgEnd}</p>",
		suggestions : "<div class=\"suggestions\"><p><strong>${text.suggestionsMsgStart}</strong>${text.suggestionsMsgEnd}</p><ul class=\"suggestions-list\"></ul></div>",
		suggestionItem : "<li><a href=\"${href}\">${title}</a></li>"
	},
	
	init : function(){
		/* Preparing the message for the search engine */
		searchEngine = ""
		
		for(e = 0; e < this.engines.length; e++){
			if(document.referrer.match(this.engines[e].pattern)){
				searchEngine = this.engines[e].name;
			}
		}
		
		/* Display the message for the search engine */
		if (searchEngine != "")
		{
			//Remove the message about bookmark 
			$(".bookmark-message").empty();
			
			$.template("searchEngine", this.templates.searchEngine);
			options = 
			$("#cn-left-msg, #cn-right-msg").each(function(){
				options = {
					searchEngine : searchEngine,
					text : friendly404.dictionary[friendly404.getSectionLanguage(this)]
				};
				
				$(this).append($.tmpl('searchEngine', options));
			});
		}
		
		this.getSuggestions();
	},
	
	displaySuggestions : function(list){
		var suggestions = [];
		
		for(m = 0; m < list.length; m++){
			if(window.location.pathname.match(list[m].pattern)){
				suggestions[suggestions.length] = list[m];
			}
		}
		
		if (suggestions.length > 0){
			$.template("suggestions", friendly404.templates.suggestions);
			$.template("suggestionItem", friendly404.templates.suggestionItem);
			
			$("#cn-left-msg, #cn-right-msg").each(function(){
				var lang = friendly404.getSectionLanguage(this);
				var options = {
					text : friendly404.dictionary[lang]
				}

				container = $.tmpl('suggestions', options);
				for(s = 0; s < suggestions.length; s++){
					var item = suggestions[s].destination[lang];
					container.find(".suggestions-list").append($.tmpl('suggestionItem', item));
				}
				
				$(this).append(container);
			});
		}
	},
	
	getSuggestions : function(){
		var url = this.getSuggestionURL();
		if (url != null){
			var options = {url : url, cache : "true", dataType : "json", success : this.displaySuggestions};
			$.ajax(options);
			
		}
		
		return null;
	},
	
	getSuggestionURL : function(){
		if ($("body").attr("data-suggestions-href") != ''){
			return $("body").attr("data-suggestions-href");
		}else{
			//Gets the XHTML variables in the class attribute (if any).
			var xhtml_vars = new Array();
			if ($("body").attr("class").indexOf("{") > -1){
				var m = $("body").attr("class").match(/\{(.*)\}/)[1];
				pairs = m.split(',')
				for(p=0; p<pairs.length;p++){
					i = pairs[p].split(':');
					xhtml_vars[i[0].replace(' ', '')] = i[1].replace(' ', '');
				}
			}
			
			if(xhtml_vars["suggestions-href"]){
				return xhtml_vars["controls-href"];
			}
		}
	},
	
	getSectionLanguage : function(section){
		if ($(section).attr("lang") == ""){
			return PE.language
		}else{
			return (PE.language == "eng") ? "fra" : "eng";
		}
	}
}
	
// Add Style Sheet Support for this plug-in
Utils.addCSSSupportFile(Utils.getSupportPath()+"/friendly404/style.css"); 

PE.load('jquery.template.js');

$(document).ready(function() {
	friendly404.init();
});
/* WET-BOEW ends */