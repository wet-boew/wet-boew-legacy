/*!
 * Zebra striping v1.2 / Rayage du zèbre v1.2
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */
(function($) {
	$.fn.zebra = {
		
		defaults : {
			tableEvenClass : "table-even",
			tableOddClass : "table-odd",
			listEvenClass : "list-even",
			listOddClass : "list-odd"
		},
		
		init : function (){
			$(".zebra").each(function(i) {
				var $this = $(this);
				if ($this.is('table')) {

					var $trs = $this.find('tr').filter(function() {
						return $(this).parent("thead").length === 0;
					});
					
					// note: even/odd's indices start at 0
					$trs.filter(':odd').addClass($.fn.zebra.defaults.tableEvenClass);
					$trs.filter(':even').addClass($.fn.zebra.defaults.tableOddClass);
				} else {
					var $lis = $this.find('li');
					var parity = ($this.parents('li').length + 1) % 2;
					$lis.filter(':odd').addClass(parity === 0 ? $.fn.zebra.defaults.listOddClass : $.fn.zebra.defaults.listEvenClass);
					$lis.filter(':even').addClass(parity === 1 ? $.fn.zebra.defaults.listOddClass : $.fn.zebra.defaults.listEvenClass);
				}
			});
		}
	}
	
	Utils.addCSSSupportFile(Utils.getSupportPath() + "/zebra/style.css");
	
	$(document).ready(function() {
		$.fn.zebra.init();
	});
})(jQuery);
