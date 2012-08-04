/*!
 * Charts and graphs support v2.0 / Soutien des graphiques v2.0
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */
var charts = {
	
	// Load the parameters used in the plugin declaration. Parameters can be access using this.parms.parameterName
	params :  Utils.loadParamsFromScriptID("charts"),
	
	//Method that is executed when the page loads
	init : function(){
		var paramsFix = eval(decodeURIComponent(this.params.chart));
		
		$(paramsFix).each(function(index, value){
			// console.log(value);
			// var graph = $(value.selector).charts({type : value.type}, (value.container != null) ? $(value.container) : null)
			var graph = $(value.selector).charts(value, (value.container != null) ? $(value.container) : null)
		});
	}
}

//Loads a library that the plugin depends on from the lib folder
PE.load('raphael-min.js');
PE.load('charts.jQuery.js');

// Load depend library
PE.load('axis2dgraph.js');
PE.load('circleGraph.js');

// adding style sheets
Utils.addCSSSupportFile(Utils.getSupportPath()+"/graph/style.css");

// Init Call at Runtime
$("document").ready(function(){   charts.init(); });

