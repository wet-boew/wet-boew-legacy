/*!
 * Geo-targeting v1.05 / Géociblage v1.05
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */

window.onerror = null;
hostaddress = hostname = "(unknown)";

// Embedding jquery-json to get JSON encoding/decoding capability
(function($){var escapeable=/["\\\x00-\x1f\x7f-\x9f]/g,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'};$.toJSON=typeof JSON==='object'&&JSON.stringify?JSON.stringify:function(o){if(o===null){return'null';}
var type=typeof o;if(type==='undefined'){return undefined;}
if(type==='number'||type==='boolean'){return''+o;}
if(type==='string'){return $.quoteString(o);}
if(type==='object'){if(typeof o.toJSON==='function'){return $.toJSON(o.toJSON());}
if(o.constructor===Date){var month=o.getUTCMonth()+1,day=o.getUTCDate(),year=o.getUTCFullYear(),hours=o.getUTCHours(),minutes=o.getUTCMinutes(),seconds=o.getUTCSeconds(),milli=o.getUTCMilliseconds();if(month<10){month='0'+month;}
if(day<10){day='0'+day;}
if(hours<10){hours='0'+hours;}
if(minutes<10){minutes='0'+minutes;}
if(seconds<10){seconds='0'+seconds;}
if(milli<100){milli='0'+milli;}
if(milli<10){milli='0'+milli;}
return'"'+year+'-'+month+'-'+day+'T'+
hours+':'+minutes+':'+seconds+'.'+milli+'Z"';}
if(o.constructor===Array){var ret=[];for(var i=0;i<o.length;i++){ret.push($.toJSON(o[i])||'null');}
return'['+ret.join(',')+']';}
var name,val,pairs=[];for(var k in o){type=typeof k;if(type==='number'){name='"'+k+'"';}else if(type==='string'){name=$.quoteString(k);}else{continue;}
type=typeof o[k];if(type==='function'||type==='undefined'){continue;}
val=$.toJSON(o[k]);pairs.push(name+':'+val);}
return'{'+pairs.join(',')+'}';}};$.evalJSON=typeof JSON==='object'&&JSON.parse?JSON.parse:function(src){return eval('('+src+')');};$.secureEvalJSON=typeof JSON==='object'&&JSON.parse?JSON.parse:function(src){var filtered=src.replace(/\\["\\\/bfnrtu]/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,'');if(/^[\],:{}\s]*$/.test(filtered)){return eval('('+src+')');}else{throw new SyntaxError('Error parsing JSON, source is not valid.');}};$.quoteString=function(string){if(string.match(escapeable)){return'"'+string.replace(escapeable,function(a){var c=meta[a];if(typeof c==='string'){return c;}
c=a.charCodeAt();return'\\u00'+Math.floor(c/16).toString(16)+(c%16).toString(16);})+'"';}
return'"'+string+'"';};})(jQuery);

var geotarget = {
	// Load the parameters used in the plugin declaration. Parameters can be access using this.parms.parameterName
	params :  Utils.loadParamsFromScriptID("geotarget"),
	userip : '',
	loadScript: function(url, func) {
		var script_tag = document.createElement('script');
		script_tag.setAttribute('type', 'text/javascript');
		script_tag.setAttribute('src', url);
		(document.getElementsByTagName('head')[0] || document.documentElement).appendChild(script_tag);
	},
	init : function(){
		// Retrieve the geo-targeting results if they were stored locally for the session
		var geotargetSaved = $.Storage.get("geoData");
		
		// If locally saved results don't exist, then query IPInfoDB
		if (!geotargetSaved) {geotarget.loadScript('http://api.ipinfodb.com/v3/ip-city/?key=' + this.params.apikey + '&format=json&output=json&callback=geotarget.parseIp&timezone=true&time='+(new Date().getTime().toString()));}
		else {
			geotarget.parseIp($.evalJSON(geotargetSaved));
		}
   	},
	parseIp: function(geoData){
		if (geoData.statusCode === "OK") {
			// Store the geo-targeting results locally for the session
			$.Storage.set("geoData",$.toJSON(geoData));
			
			$('.gtIP').replaceWith($("<div id='gtIP'>" + geoData.ipAddress + "</div>"));
			$('.gtCountryCode').replaceWith($("<div id='gtCountryCode'>" + geoData.countryCode + "</div>"));
			$('.gtCountryName').replaceWith($("<div id='gtCountryName'>" + geoData.countryName + "</div>"));
			$('.gtRegionName').replaceWith($("<div id='gtRegionName'>" + geoData.regionName + "</div>"));
			$('.gtCity').replaceWith($("<div id='gtCity'>" + geoData.cityName + "</div>"));
			$('.gtZipCode').replaceWith($("<div id='gtZipCode'>" + geoData.zipCode + "</div>"));
			$('.gtLatitude').replaceWith($("<div id='gtLatitude'>" + geoData.latitude + "</div>"));
			$('.gtLongitude').replaceWith($("<div id='gtLongitude'>" + geoData.longitude + "</div>"));
			$('.gtTimezone').replaceWith($("<div id='gtTimezone'>" + geoData.timeZone + "</div>"));

			if (PE.language == "eng") {
				// Page is in English
				$('.gtCountryFlag').replaceWith($("<div id='gtCountryFlag'><img src='" + this.params.flags + geoData.countryCode.toLowerCase() + ".png' alt='Flag of " + geoData.countryName + "'></div>"));
			} else {
				// Page is in French
				$('.gtCountryFlag').replaceWith($("<div id='gtCountryFlag'><img src='" + this.params.flags + geoData.countryCode.toLowerCase() + ".png' alt='Drapeau du " + geoData.countryName + "'></div>"));
			}

			// Executes the 'geoTrigger' function once all geoData has been retrieved
			$(document).trigger('geoTrigger', [geoData]);
		}
	},
	//Get the cookie content
	getCookie: function(c_name) {
		if (document.cookie.length > 0 ) {
		  c_start=document.cookie.indexOf(c_name + "=");
		  if (c_start != -1){
			c_start=c_start + c_name.length+1;
			c_end=document.cookie.indexOf(";",c_start);
			if (c_end == -1) {
			  c_end=document.cookie.length;
			}
			return unescape(document.cookie.substring(c_start,c_end));
		  }
		}
		return '';
	}
}

// Init Call at Runtime
$("document").ready(function(){ geotarget.init(); });
