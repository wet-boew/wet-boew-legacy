/*!
 * Web feeds widget v1.21 / Gadget des fils de syndication v1.21
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */

/*
 * jGFeed 1.0 - Google Feed API abstraction plugin for jQuery
 * URL: http://jquery-howto.blogspot.com
 * Author URL: http://me.boo.uz
 */
jQuery.extend({jGFeed:function(a,b,c,d){if(a==null)return!1;a="http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q="+a;c!=null&&(a+="&num="+c);d!=null&&(a+="&key="+d);jQuery.getJSON(a,function(a){if(typeof b=="function")b.call(this,a.responseData.feed);else return!1})}});

/**
 * jQuery.timers - Timer abstractions for jQuery Written by Blair Mitchelmore
 * (blair DOT mitchelmore AT gmail DOT com) Licensed under the WTFPL
 * (http://sam.zoy.org/wtfpl/). Date: 2009/10/16
 * 
 * @author Blair Mitchelmore
 * @version 1.2
 * 
 */
jQuery.fn.extend({everyTime:function(a,b,c,d){return this.each(function(){jQuery.timer.add(this,a,b,c,d)})},oneTime:function(a,b,c){return this.each(function(){jQuery.timer.add(this,a,b,c,1)})},stopTime:function(a,b){return this.each(function(){jQuery.timer.remove(this,a,b)})}});jQuery.extend({timer:{global:[],guid:1,dataKey:"jQuery.timer",regex:/^([0-9]+(?:\.[0-9]*)?)\s*(.*s)?$/,powers:{'ms':1,'cs':10,'ds':100,'s':1000,'das':10000,'hs':100000,'ks':1000000},timeParse:function(a){if(a==undefined||a==null)return null;var b=this.regex.exec(jQuery.trim(a.toString()));if(b[2]){var c=parseFloat(b[1]);var d=this.powers[b[2]]||1;return c*d}else{return a}},add:function(a,b,c,d,e){var f=0;if(jQuery.isFunction(c)){if(!e)e=d;d=c;c=b}b=jQuery.timer.timeParse(b);if(typeof b!='number'||isNaN(b)||b<0)return;if(typeof e!='number'||isNaN(e)||e<0)e=0;e=e||0;var g=jQuery.data(a,this.dataKey)||jQuery.data(a,this.dataKey,{});if(!g[c])g[c]={};d.timerID=d.timerID||this.guid++;var h=function(){if((++f>e&&e!==0)||d.call(a,f)==false)jQuery.timer.remove(a,c,d)};h.timerID=d.timerID;if(!g[c][d.timerID])g[c][d.timerID]=window.setInterval(h,b);this.global.push(a)},remove:function(a,b,c){var d=jQuery.data(a,this.dataKey),ret;if(d){if(!b){for(b in d)this.remove(a,b,c)}else if(d[b]){if(c){if(c.timerID){window.clearInterval(d[b][c.timerID]);delete d[b][c.timerID]}}else{for(var c in d[b]){window.clearInterval(d[b][c]);delete d[b][c]}}for(ret in d[b])break;if(!ret){ret=null;delete d[b]}}for(ret in d)break;if(!ret)jQuery.removeData(a,this.dataKey)}}}});jQuery(window).bind("unload",function(){jQuery.each(jQuery.timer.global,function(a,b){jQuery.timer.remove(b)})});

/**
 * Web feeds Widget v1.2 Government of Canada
 */
var WebFeedsWidget = {
	params : Utils.loadParamsFromScriptID('webfeedswidget'),
	dictionary : function(pword) {
		switch (pword) {
		case "reportProblem":
			return (PE.language == 'eng') ? "Report an unsafe product"
					: "Signaler un produit dangereux";
		case "addWidget":
			return (PE.language == 'eng') ? "Add this widget"
					: "Ajouter ce gadget";
		case "widgetTitle":
			return (PE.language == 'eng') ? "Recalls and Safety Alerts"
					: "Retraits et avis";
		case "interfaceClass":
			return (PE.language == 'eng') ? "sharewidget-container-e"
					: "sharewidget-container-f";
		case "addThisWidget":
			return (PE.language == 'eng') ? "http://www.hc-sc.gc.ca/home-accueil/sm-ms/wid-gad-eng.php"
					: "http://www.hc-sc.gc.ca/home-accueil/sm-ms/wid-gad-fra.php";
		case "reportLink":
			return (PE.language == 'eng') ? "http://www.hc-sc.gc.ca/cips-icsp/reporting-signalez/index-eng.php"
					: "http://www.hc-sc.gc.ca/cips-icsp/reporting-signalez/index-fra.php";
		}
		;
	},
	/** getFeed - a hardcoded dictionary of values
	*/
	getFeed : function(spar) {
		switch (spar) {
		case "1": // Consumer Product
			return (PE.language == 'eng') ? 'http://www.hc-sc.gc.ca/rss/hecs-dgsesc/cps-spc-eng.xml': 'http://www.hc-sc.gc.ca/rss/hecs-dgsesc/cps-spc-fra.xml'
		case "2": // Drug
			return (PE.language == 'eng') ? 'http://www.hc-sc.gc.ca/rss/dhp-mps/compli-conform-eng.xml': 'http://www.hc-sc.gc.ca/rss/dhp-mps/compli-conform-fra.xml'
		case "3": // Food
			return (PE.language == 'eng') ? 'http://active.inspection.gc.ca/eng/util/newrsse.asp?cid=40': 'http://active.inspection.gc.ca/fra/util/newrssf.asp?cid=40'
		case "4": // Public Health
			return (PE.language == 'eng') ? 'http://www.phac-aspc.gc.ca/rss/new-eng.xml': 'http://www.phac-aspc.gc.ca/rss/new-fra.xml'
		case "5": // Transport
			return (PE.language == 'eng') ? 'http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/Search/Rss-Search.aspx?lang=eng': 'http://wwwapps.tc.gc.ca/Saf-Sec-Sur/7/VRDB-BDRV/Search/Rss-Search.aspx?lang=fra'
		default:
			return (PE.language == 'eng') ? 'http://www.hc-sc.gc.ca/rss/pacrb-dgapcr/hc-sc-eng.xml':'http://www.hc-sc.gc.ca/rss/pacrb-dgapcr/hc-sc-fra.xml'
		}
	},
	createWidget : function() {
		
				/* Load StyleSheets */	
				Utils.addCSSSupportFile(Utils.getSupportPath() + "/webfeedswidget/themes/base-style.css");
				// load appropiate theme
				
			switch (WebFeedsWidget.getTheme(jQuery('.wet-boew-web-feeds-widget').get(0))) {
					case "1":
						Utils.addCSSSupportFile(Utils.getSupportPath() + "/webfeedswidget/themes/1/theme.css");
						break;
					case "2":
						Utils.addCSSSupportFile(Utils.getSupportPath() + "/webfeedswidget/themes/2/theme.css");
						break;
					case "3":
						Utils.addCSSSupportFile(Utils.getSupportPath() + "/webfeedswidget/themes/3/theme.css");
						break;
					case "4":
						Utils.addCSSSupportFile(Utils.getSupportPath() + "/webfeedswidget/themes/4/theme.css");
						break;
					default:
						Utils.addCSSSupportFile(Utils.getSupportPath() + "/webfeedswidget/themes/default/theme.css");
		};
		
		jQuery('.wet-boew-web-feeds-widget').each(function(){
			var $widget = jQuery(this);
			// create the HTML Container
			$widget.html(
						"<div class=\"module-sharewidget\"><div class=\""
								+ WebFeedsWidget.dictionary('interfaceClass')
								+ "\">"
								+ "<h2 class=\"sharewidget-title\">"
								+ WebFeedsWidget.dictionary('widgetTitle')
								+ "</h2>"
								+ "<ul class=\"sharewidget-content\" role=\"log\" aria-relevant=\"additions\" aria-atomic=\"false\" aria-labelledby=\"sharewidget-title\"></ul>"
								+ "<p class=\"sharewidget-report\"><a href=\""
								+ WebFeedsWidget.dictionary('reportLink')
								+ "\">"
								+ WebFeedsWidget.dictionary('reportProblem')
								+ "</a></p>"
								+ "<div class=\"sharewidget-fip\"></div>"
								+ "</div>"
								+ "<div class=\"sharewidget-add\">"
								+ "<p><a href=\"#\">"
								+ WebFeedsWidget.dictionary('addWidget')
								+ "</a></p>"
								+ "</div>"
								+ "<div class=\"sharewidget-datastore\"><ul class=\"sharewidget-cache cn-invisible\"></ul></div>");
				/* Get Feed Contents */
				WebFeedsWidget.getWebFeedsData( jQuery('.sharewidget-content', $widget) );
		});
	    // set the global timers
		jQuery(document).everyTime(300000, WebFeedsWidget.checkUpdates, 0);
	},
	getTheme : function(elm) {
		 // check the container for theme
		 var theme_property = jQuery(elm).attr('class').split(/\s+/);
		 for(var i = 0; i < theme_property.length; i++ )
		 {
		 	if (theme_property[i].indexOf('theme-') === 0 ){
		 	   var param = theme_property[i].split(/\-/);
		 	   return param[ param.length-1 ]
		 	}
		 }
		 return '999';
	},
	checkUpdates : function() {
		jQuery('.wet-boew-web-feeds-widget').each(function(){
			var $widget = jQuery(this);
			WebFeedsWidget.getWebFeedsData( jQuery('.sharewidget-cache', $widget) );
			/* Compare items in widget to see if there are any developments */
			var current = jQuery('.sharewidget-content li a', $widget);
			var uniques = jQuery('.sharewidget-cache li', $widget).filter(function() {
							// a rather dirty but effective filter that plays on scope and XOR logic to compare
							return !current.filter("[href="+ jQuery(this).find("a").attr("href") + "]").length;
						 });
			/* Only do more work if we have more elements **/
			if (uniques.length > 0) {
				jQuery(uniques).each(
					function(index, obj) {
						WebFeedsWidget.prependListItem('sharewidget-content', "<li>"
								+ $(this).html() + "</li>");
					});
			};
			jQuery('.sharewidget-cache', $widget ).empty();
		});
		
	},
	// getWebFeedsData - is a refreshing function that refreshes the cache store on all the widgets
	// @parms : jQuery Object of the cache element
	getWebFeedsData : function(elm) {
		 /** Modification - changed to a RSStoJSON parser solution to increase performance and reliablity - cross browser **/
		
			$.jGFeed( WebFeedsWidget.getFeed(WebFeedsWidget.params.feed),
				function(feeds){
  					// Check for errors
  					if(!feeds)
    					return false;
  					var feed_t = "";
  					// do whatever you want with feeds here
  					for(var i=0; i<feeds.entries.length; i++){
    					var entry = feeds.entries[i];
    					// create the source code for the feed
    					feed_t += "<li><a href=\""+entry.link+"\" class=\"sharewidget-notice\">"+entry.title+"</a><span class=\"sharewidget-details\">["+entry.publishedDate+"]</span></li>";
  					}
  					jQuery(elm).html(feed_t)
				}, 10); // @TODO:: the last number is the amount of items in a feed. this could be turned into a parameter
	},
	// prependListItem - the effects function for adding a list element to the already seen
	prependListItem : function(listName, listItemHTML) {
		jQuery(listItemHTML).hide().css('opacity', 0.0).prependTo(
				'#' + listName).slideDown('normal').animate( {
			opacity : 1.0
		}, "fast");
	},
	// a simplifed sprintf function to allow for number padding
	_pad : function (number, length) {
		var str = '' + number;
		while (str.length < length) {
			str = '0' + str;
		}
		return str;
	},
	// a simple format date function to facilitate date rendering in the widget
	_formatDate: function(d_ate) {
		var d = new Date(d_ate);
		var curr_date = d.getDate();
		var curr_month = d.getMonth();
		curr_month++;
		var curr_year = d.getFullYear();
		return curr_year + "-" + WebFeedsWidget._pad(curr_month, 2) + "-" + WebFeedsWidget._pad(curr_date, 2);
	}

};

/**
 * 
 * jQuery Runtime Call
 */
jQuery(document).ready(function($) {
	WebFeedsWidget.createWidget();
});
