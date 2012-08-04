/*!
 * Accessibility responsibility breakdown v1.03 / Répartition des responsabilités d'accessibilité v1.03
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */
var accessRespBreakdown = {
	
	// Load the parameters used in the plugin declaration. Parameters can be access using this.parms.parameterName
	params :  Utils.loadParamsFromScriptID("accessRespBreakdown"),
	
	//Used to store localized strings for your plugin.
	dictionary : {
	        levels :(PE.language == "eng") ? "Levels" : "Niveaux",
			level :(PE.language == "eng") ? "Level" : "Niveau",
			phases :(PE.language == "eng") ? "Production chain phases" : "&Eacute;tapes de la cha&icirc;ne de production",
			phase1 :(PE.language == "eng") ? "Analysis" : "Analyse",
			phase2 :(PE.language == "eng") ? "Architecture" : "Architecture",
			phase3 :(PE.language == "eng") ? "Interaction design" : "Conception d'interaction",
			phase4 :(PE.language == "eng") ? "Graphic design" : "Graphisme",
			phase5 :(PE.language == "eng") ? "Prototyping" : "Prototypage",
			phase6 :(PE.language == "eng") ? "Editing" : "Rédaction",
			phase7 :(PE.language == "eng") ? "Development" : "Développement",
			phase8 :(PE.language == "eng") ? "Quality control" : "Contrôle Qualité"
	},
	
	//Method that is executed when the page loads
	init : function(){
		$('#tsrw').before('\
			<fieldset id="toggle-level">\
				<legend>' + accessRespBreakdown.dictionary.levels + '</legend>\
				<div><input type="checkbox" id="a-wcag2-toggle-level" name="a-wcag2-toggle-level" checked="checked" aria-checked="true" aria-controls="tsrw" /><label for="a-wcag2-toggle-level">'+accessRespBreakdown.dictionary.level+'&#160;A</label></div>\
				<div><input type="checkbox" id="aa-wcag2-toggle-level" name="aa-wcag2-toggle-level" checked="checked" aria-checked="true" aria-controls="tsrw" /><label for="aa-wcag2-toggle-level">'+accessRespBreakdown.dictionary.level+'&#160;AA</label></div>\
				<div><input type="checkbox" id="aaa-wcag2-toggle-level" name="aaa-wcag2-toggle-level" checked="checked" aria-checked="true" aria-controls="tsrw" /><label for="aaa-wcag2-toggle-level">'+accessRespBreakdown.dictionary.level+'&#160;AAA</label></div>\
			</fieldset><br />\
			<fieldset id="toggle-phase">\
				<legend>' + accessRespBreakdown.dictionary.phases + '</legend>\
				<div><input type="checkbox" id="phase1-toggle" name="phase1-toggle" checked="checked" aria-checked="true" aria-controls="tsrw" /><label for="phase1-toggle">'+ accessRespBreakdown.dictionary.phase1 + '</label></div>\
				<div><input type="checkbox" id="phase2-toggle" name="phase2-toggle" checked="checked" aria-checked="true" aria-controls="tsrw" /><label for="phase2-toggle">'+ accessRespBreakdown.dictionary.phase2 + '</label></div>\
				<div><input type="checkbox" id="phase3-toggle" name="phase3-toggle" checked="checked" aria-checked="true" aria-controls="tsrw" /><label for="phase3-toggle">'+ accessRespBreakdown.dictionary.phase3 + '</label></div>\
				<div><input type="checkbox" id="phase4-toggle" name="phase4-toggle" checked="checked" aria-checked="true" aria-controls="tsrw" /><label for="phase4-toggle">'+ accessRespBreakdown.dictionary.phase4 + '</label></div>\
				<div><input type="checkbox" id="phase5-toggle" name="phase5-toggle" checked="checked" aria-checked="true" aria-controls="tsrw" /><label for="phase5-toggle">'+ accessRespBreakdown.dictionary.phase5 + '</label></div>\
				<div><input type="checkbox" id="phase6-toggle" name="phase6-toggle" checked="checked" aria-checked="true" aria-controls="tsrw" /><label for="phase6-toggle">'+ accessRespBreakdown.dictionary.phase6 + '</label></div>\
				<div><input type="checkbox" id="phase7-toggle" name="phase7-toggle" checked="checked" aria-checked="true" aria-controls="tsrw" /><label for="phase7-toggle">'+ accessRespBreakdown.dictionary.phase7 + '</label></div>\
				<div><input type="checkbox" id="phase8-toggle" name="phase8-toggle" checked="checked" aria-checked="true" aria-controls="tsrw" /><label for="phase8-toggle">'+ accessRespBreakdown.dictionary.phase8 + '</label></div>\
			</fieldset>\
		');
		$('#tsrw tr, #tsrw td, #tsrw tr:nth-child(2) th').attr('aria-hidden','false');
		$('#toggle-level input').bind('change', function(event) {
			if ($(event.target).is('input:checked')) {
				$(event.target).attr('aria-checked','true');
				$('#tsrw tr[id ^="' + $(event.target).attr("id").substr(0,5) + '"]').show().attr('aria-hidden','false');
			} else {
				$(event.target).attr('aria-checked','false');
				$('#tsrw tr[id ^="' + $(event.target).attr("id").substr(0,5) + '"]').hide().attr('aria-hidden','true');
			}
		});
		$('#toggle-phase input').bind('change', function(event) {
			var thCell = parseInt($(event.target).attr("id").charAt(5));
			var tdCell = thCell + 1;
			if ($(event.target).is('input:checked')) {
				$(event.target).attr('aria-checked','true');
				$('#tsrw tr td:nth-child('+tdCell+'),#tsrw tr:nth-child(2) th:nth-child('+thCell+')').show().attr('aria-hidden','false');
			} else {
				$(event.target).attr('aria-checked','false');
				$('#tsrw tr td:nth-child('+tdCell+'),#tsrw tr:nth-child(2) th:nth-child('+thCell+')').hide().attr('aria-hidden','true');
			}
		});

		// Filter content if defaults set
		if (accessRespBreakdown.params.levelA == "false") $('#a-wcag2-toggle-level').click().change();
		if (accessRespBreakdown.params.levelAA == "false") $('#aa-wcag2-toggle-level').click().change();
		if (accessRespBreakdown.params.levelAAA == "false") $('#aaa-wcag2-toggle-level').click().change();
		if (accessRespBreakdown.params.phase1 == "false") $('#phase1-toggle').click().change();
		if (accessRespBreakdown.params.phase2 == "false") $('#phase2-toggle').click().change();
		if (accessRespBreakdown.params.phase3 == "false") $('#phase3-toggle').click().change();
		if (accessRespBreakdown.params.phase4 == "false") $('#phase4-toggle').click().change();
		if (accessRespBreakdown.params.phase5 == "false") $('#phase5-toggle').click().change();
		if (accessRespBreakdown.params.phase6 == "false") $('#phase6-toggle').click().change();
		if (accessRespBreakdown.params.phase7 == "false") $('#phase7-toggle').click().change();
		if (accessRespBreakdown.params.phase8 == "false") $('#phase8-toggle').click().change();
	}
}
// Add Style Sheet Support for this plug-in
Utils.addCSSSupportFile(Utils.getSupportPath()+"/accessRespBreakdown/style.css"); 

// Init Call at Runtime
$("document").ready(function(){   accessRespBreakdown.init(); });