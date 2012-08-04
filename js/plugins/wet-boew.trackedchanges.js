/*!
 * Tracked changes v1.01 / Suivi des modifications v1.01
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */

/*
 * trackedchanges is a styles sheet to visually identify tracked changes in an HTML document and a
 * script to enable navigating an HTML document by tracked change.
 *
 * Supports : Firefox, to be tested
 *
 * @name trackedchanges
 * @author Thomas Gohard
 *
 */

var trackedchanges = {
	// Load the parameters used in the plugin declaration. Parameters can be access using this.parms.parameterName
	params : Utils.loadParamsFromScriptID("trackedchanges"),
	
	// Used to store localized strings for your plugin.
	dictionary : {
		CHANGEID_PREFIX : (PE.language == "eng") ? "change-" : "modification-",
		INS : (PE.language == "eng") ? "inserted" : "insertion de",
		DEL : (PE.language == "eng") ? "deleted" : "suppression de"
	},
	
	currChangeID : -1,
	minChangeID : -1,
	maxChangeID : -1,
	
	// Method that is executed when the page loads
	init : function() {
		var minID = 0;
		var maxID = minID - 1;
		
		/* anchor tracked changes */
		$('del, ins').wrap('<a class="change-anchor" tabindex="0" />');
		$('.change-anchor').each(function() {
			maxID++;
			$(this).attr('id', trackedchanges.dictionary['CHANGEID_PREFIX'] + maxID);
			$(this).attr('name', trackedchanges.dictionary['CHANGEID_PREFIX'] + maxID);
		});
		
		this.minChangeID = minID;
		this.maxChangeID = maxID;
		
		/* accessify tracked changes */
		$('del, ins').each(function() {
			$(this).attr('title', trackedchanges.dictionary[this.nodeName]);
		});
		
		/* insert tracked changes toolbar */
		$('#cn-centre-col-inner').prepend('<div id="track-changes-toolbar">\n\t<h2>Track Changes Toolbar</h2>\n\t<p class="legend">Legend: <ins>Inserted text</ins> | <del>Deleted text</del>.</p>\n\t<p class="nav"> <a href="#' + maxID + '" id="prev-change">&larr; Previous change</a> | <a href="#' + minID + '" id="next-change">Next change &rarr;</a></p>\n</div>');
		
		/* bind events */
		$(document).bind('keydown', function(e) {
			var op;
						
			if ((e.keyCode == 37) || (e.keyCode == 39)) {	/* an arrow key was pressed */
				if (e.keyCode == 37) {			/* left arrow key */
					op = trackedchanges.decr;
				} else if (e.keyCode == 39) {	/* right arrow key */
					op = trackedchanges.incr;
				}
			
				trackedchanges.cycleChangeID(op);
			}
		});
		
		$('#prev-change').bind('click', function(e) {
			e.preventDefault();
			
			trackedchanges.cycleChangeID(trackedchanges.decr);
		});
		$('#next-change').bind('click', function(e) {
			e.preventDefault();
			
			trackedchanges.cycleChangeID(trackedchanges.incr);
		});
		
		/* enable accessible change tooltip */
		$('.change-anchor').bind('mouseover focus', function(e) {
			trackedchanges.ttOn($(this).find('del, ins'));
		});
		$('.change-anchor').bind('mouseout blur', function(e) {
			trackedchanges.ttOff($(this).find('del, ins'));
		});
	},
	
	incr : function(v) {
		return ++v;
	},
	
	decr : function(v) {
		return --v;
	},
	
	opChangeID : function(ChangeID, op) {
		if ((ChangeID == this.minChangeID) && (op == this.decr)) {
			ChangeID = this.maxChangeID;
		} else if ((ChangeID == this.maxChangeID) && (op == this.incr)) {
			ChangeID = this.minChangeID;
		} else {
			ChangeID = op(ChangeID);
		}
		
		return ChangeID;
	},
	
	cycleChangeID : function(op) {
		var prevChangeID;
		var nextChangeID;
			
		if ((this.currChangeID >= -1) && (this.currChangeID <= this.maxChangeID)) {
			$('#' + this.dictionary['CHANGEID_PREFIX'] + this.currChangeID + ' del, #' + this.dictionary['CHANGEID_PREFIX'] + this.currChangeID + ' ins').removeClass('selected');
			
			this.currChangeID = this.opChangeID(this.currChangeID, op);
			prevChangeID = this.opChangeID(this.currChangeID, this.decr);
			nextChangeID = this.opChangeID(this.currChangeID, this.incr);
			
			$('#' + this.dictionary['CHANGEID_PREFIX'] + this.currChangeID + ' del, #' + this.dictionary['CHANGEID_PREFIX'] + this.currChangeID + ' ins').addClass('selected');
			
			$('#prev-change').attr('href', '#' + this.dictionary['CHANGEID_PREFIX'] + prevChangeID);							
			$('#next-change').attr('href', '#' + this.dictionary['CHANGEID_PREFIX'] + nextChangeID);
			
			$('html,body').animate({scrollTop: $('#' + this.dictionary['CHANGEID_PREFIX'] + this.currChangeID + ' del, #' + this.dictionary['CHANGEID_PREFIX'] + this.currChangeID + ' ins').offset().top}, 150);
		}
	},
	
	// accessible tooltip
	ttOn : function(elem) {
		$(elem).html('<span class="change-tab">' + $(elem).attr('title') + ' </span>' + $(elem).html());
		$(elem).removeAttr('title');
	},
	
	ttOff : function(elem) {
		$(elem).attr('title', function(i, val) {
			return $.trim($(this).find('span.change-tab').html());
		});
		$(elem).find('span.change-tab').remove();
	}
};

// Add Style Sheet Support for this plug-in
Utils.addCSSSupportFile(Utils.getSupportPath() + "/trackedchanges/wet-boew.trackedchanges.css");
Utils.addCSSSupportFile(Utils.getSupportPath() + "/trackedchanges/wet-boew.trackedchanges.print.css");

// Init Call at Runtime
$("document").ready(function() {
	trackedchanges.init();
});