/*!
 * Web Accessibility Assessment Methodology v1.1 / Méthodologie d’évaluation sur l’accessibilité des sites Web v1.1
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */
var assessMthdEvalWebAccess = {
	
	// Load the parameters used in the plugin declaration. Parameters can be access using this.parms.parameterName
	params :  Utils.loadParamsFromScriptID("assessMthdEvalWebAccess"),
	
	isIE8OrOlder: (/MSIE ((5\.5)|6|7|8)/.test(navigator.userAgent) && (navigator.platform == "Win32" || navigator.platform == "Win64")),
	
	aaaIncluded: false,

	dictionary : {
	    evaltext :(PE.language == "eng") ? "Success Criteria evaluated" : "Crit&#233;res de succ&#232;s &#233;valu&#233;s",
		natext :(PE.language == "eng") ? "Success Criteria <abbr title=\"Not applicable\">N/A</abbr>" : "Crit&#233;res de succ&#232;s <abbr title=\"Sans objet\">S/O</abbr>"
	},
	
	//Method that is executed when the page loads
	init : function(){
		aaaIncluded = ($('#rsltAAA').length > 0); //Test to see if AAA Success Criteria are included
		$('#summary').append("<tr style=\"border-top: 2px solid #000\"><th scope=\"row\">" + assessMthdEvalWebAccess.dictionary.evaltext + "</th><td><span id=\"evalTotal\"></span>/" + ((aaaIncluded == true) ? "61" : "38") + " (<span id=\"percEvalTotal\"></span>%)</td></tr>");
		$('#summary').append("<tr><th scope=\"row\">" + assessMthdEvalWebAccess.dictionary.natext + "</th><td><span id=\"naTotal\"></span>/" + ((aaaIncluded == true) ? "61" : "38") + " (<span id=\"percNATotal\"></span>%)</td></tr>");
		$('#evalTotal, #percEvalTotal, #rsltA, #percA, #rsltAA, #percAA, #rsltTotal, #percTotal, #naTotal, #percNATotal').html("0");
		if (aaaIncluded) $('#rsltAAA, #percAAA').html("0");
		$('#summary td').attr('aria-live','polite').attr('aria-relevant','text').attr('aria-atomic','true').attr('aria-busy','false');
			
		//Calculate the results once a radio button changes
		$('#checklist input').attr('checked', false).attr('aria-checked','false').bind('change', function(event) {
			$(event.target).parent().children('input').each(function() {
				if ($(this).is('input:checked')) $(this).attr('aria-checked','true');
				else $(this).attr('aria-checked','false');
			});
			
			var a = $('#checklist input[id ^="ap"]:checked, #checklist input[id ^="an"]:checked').length;
			var aeval = a + $('#checklist input[id ^="af"]:checked').length;
			var aa = $('#checklist input[id ^="aap"]:checked, #checklist input[id ^="aan"]:checked').length;
			var aaeval = aa + $('#checklist input[id ^="aaf"]:checked').length;
			if (aaaIncluded) {
				var aaa = $('#checklist input[id ^="aaap"]:checked, #checklist input[id ^="aaan"]:checked').length;
				var aaaeval = aaa + $('#checklist input[id ^="aaaf"]:checked').length;
			}
			var na = $('#checklist input[id ^="an"]:checked, #checklist input[id ^="aan"]:checked, #checklist input[id ^="aaan"]:checked').length;
			
			//Update number of Success Criteria evaluated and passed
			$('#summary td').attr('aria-busy','true');
			$('#rsltA').html(a);
			$('#percA').html(Math.round(a/0.25));
			$('#rsltAA').html(aa);
			$('#percAA').html(Math.round(aa/0.13));
			$('#naTotal').html(na);
			if (aaaIncluded) {
				$('#rsltAAA').html(aaa);
				$('#percAAA').html(Math.round(aaa/0.23));
				$('#evalTotal').html(aeval + aaeval + aaaeval);
				$('#percEvalTotal').html(Math.round((aeval + aaeval + aaaeval)/0.61));
				$('#rsltTotal').html(a+aa+aaa);
				$('#percTotal').html(Math.round((a+aa+aaa)/0.61));
				$('#percNATotal').html(Math.round(na/0.61));
			} else {
				$('#evalTotal').html(aeval + aaeval);
				$('#percEvalTotal').html(Math.round((aeval + aaeval)/0.38));
				$('#rsltTotal').html(a+aa);
				$('#percTotal').html(Math.round((a+aa)/0.38));
				$('#percNATotal').html(Math.round(na/0.38));
			}
			$('#summary td').attr('aria-busy','false');
		});
		
		// Disable rounded corners before printing and restore after printing (rounded corners do not print well in IE6 - IE8)
		if (assessMthdEvalWebAccess.isIE8OrOlder) {
			window.onbeforeprint=assessMthdEvalWebAccess.removeCorners;
			window.onafterprint=assessMthdEvalWebAccess.restoreCorners;
		}
	},
	
	removeCorners : function() {
		$('#cn-centre-col h2, #checklist h3, .last').each(function() {
			$(this).before('<'+$(this).get(0).tagName+' class="print">' + $(this).text() + '</'+$(this).get(0).tagName+'>');
			$(this).hide();
		});		
	},
	restoreCorners : function() {
		$('.print').remove();
		$('#cn-centre-col h2, #checklist h3, .last').show();
	}
}

// Init Call at Runtime
$("document").ready(function(){   assessMthdEvalWebAccess.init(); });