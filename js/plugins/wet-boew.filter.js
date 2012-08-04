/*!
 * Filterable content v1.01 / Contenu filtrable v1.01
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */
var filter = {
	//Used to store localized strings for your plugin.
	dictionary : {
	    filteredMatches :(PE.language == "eng") ? "Filtered matches: " : "Correspondances filtrées : ",
	    noMatch :(PE.language == "eng") ? "Sorry, there are no matches that meet your filter criteria" : "Désolé. Aucune correspondance ne répond à vos critères de filtration.",
		addFilter : (PE.language == "eng") ? "Add filter: " : "Ajouter le filtre : ",
		removeFilter : (PE.language == "eng") ? "Remove filter: " : "Supprimer le filtre : "
	},
	
	//Method that is executed when the page loads
	init : function(){
		$('.filter-block').attr("aria-hidden",false);
		query = parseUri(window.location).queryKey;
		$(".filter-container").each(function(){
			container = $(this);
			if (container.attr("id") != ""){
				var t = $("#" + container.attr("id") + "-controls")
				if (t.length > 0){
					controls = $(t[0]);
					filter.loadControls(container, controls, query[container.attr("id") + '-filters']);
				}
			}
		});
	},
	
	loadControls : function(container, controls, initialfilters){
		var settings = container.metadata();
		var controlsUrl = settings["controls-href"];
		
		if(controlsUrl != null){
			controls.load(controlsUrl, function(){
				var triggers = controls.find(".filter-trigger").attr("role","button").attr("aria-pressed",false);
				
				//Add the event bindings
				triggers.bind("click", {"container" : container, "controls": controls}, function(event){
					filter.onFilterSelect(event.data.container, event.data.controls, $(event.target).closest('a'));
				});
				
				//Add the initial text for accessibility
				context = $("<span class=\"cn-invisible\">" + filter.dictionary.addFilter + "</span>");
				triggers.filter('*:not(.filter-reset)').prepend(context);
				$('.filter-matches').attr("role","status").attr("aria-live","polite").attr("aria-relevant","additions text").attr("aria-hidden",false);
				$('.filter-reset').attr("aria-pressed", true);
				
				//apply initial filter based on query parameters
				if(initialfilters != undefined){
					filters = initialfilters.split(',');
					for(f=0; f < filters.length; f++){
						fObj = $('#' + filters[f])[0];
						$(fObj).click()
					}
				}
			});
		}
	},
	
	onFilterSelect : function(container, controls, target){
		if (target.hasClass("filter-reset")){
			controls.find(".filter-selected").removeClass("filter-selected").attr("aria-pressed", false).children(".cn-invisible").text(filter.dictionary.addFilter);
		}else if(target.attr("id") != ""){
			target.closest(".filter-group, .filter-controls-container").find(".filter-selected:not(#" + target.attr("id") + ")").removeClass("filter-selected").attr("aria-pressed", false).children(".cn-invisible").text(filter.dictionary.addFilter);
			target.children(".cn-invisible").text((target.hasClass("filter-selected")) ? filter.dictionary.addFilter : filter.dictionary.removeFilter);
			target.toggleClass("filter-selected", "");
			if (target.hasClass("filter-selected")) target.attr("aria-pressed",true);
			else target.attr("aria-pressed",false);
		}
		
		selected = new Array();
		controls.find(".filter-selected:not(.filter-reset)").each(function(){
			selected.push($(this).attr("id"));
		});
			
		if  (selected.length > 0){
			controls.find(".filter-reset").removeClass("filter-selected").attr("aria-pressed", false);
			filter.applyFilterByID(container, selected, true);
		}else{
			controls.find(".filter-reset").addClass("filter-selected").attr("aria-pressed", true);
			filter.removeFilter(container);
		}
			
			
	},
	
	applyFilterByID : function(container, ids, intersect){
		prefix = ".filter-" 
		seperator = intersect ? "" : ", "
		selector = prefix + ids.join(seperator + prefix)
		container.find(".filter-block:not(" + selector + ")").hide().attr("aria-hidden", true);
		
		visible = container.find(selector)
		visible.show().attr("aria-hidden", false);
		filter.updateResultsString(container, visible.length)
	},
	
	removeFilter : function(container){
		visible = container.find('.filter-block')
		visible.show().attr("aria-hidden", false);
		filter.updateResultsString(container, visible.length)
	},
	
	updateResultsString : function(container, count){
		e = container.children(".filter-matches");
		
		if (e.length > 0){
			element = $(e[0]);
			text = count > 0 ? filter.dictionary.filteredMatches + count : filter.dictionary.noMatch;
			element.html("<p>" + text + "</p>");
			element.show().attr("aria-hidden", false);
		}
	}
}
// Add Style Sheet Support for this plug-in
Utils.addCSSSupportFile(Utils.getSupportPath()+"/filter/style.css"); 

// Init Call at Runtime
$("document").ready(function(){ 		var t=setTimeout("filter.init()",5); });