/*!
 * Language selector v1.1 / Sélecteur de langue v1.1
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * Terms and conditions of use: http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Terms
 * Conditions régissant l'utilisation : http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Conditions
 */
var altLang = {
	params :  Utils.loadParamsFromScriptID("lang"),
	init: function() { 
		$("#cn-cmb1").click(function () {
			var url = window.location.toString();
			if ((url.search(/_f\.htm/) > -1) || (url.search(/-fra\./) > -1)) {
				url = url.replace(/_f\./, "_e.");
				url = url.replace(/-fra\./, "-eng.");
			} else {
				url = url.replace(/_e\./, "_f.");
				url = url.replace(/-eng\./, "-fra.");
			}
			if (url.search(/lang=eng/) > -1) {
				url = url.replace(/lang=eng/, "lang=fra");
			} else {
				url = url.replace(/lang=fra/, "lang=eng");
			}
			window.location = url;
			return false;
		});
	}
};
$("document").ready(function(){ altLang.init(); });