/*!
 * Session timeout v1.1 / Expiration de la session v1.1
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */

// Let's load the support files
Utils.addCSSSupportFile(Utils.getSupportPath()+ '/sTimeout/style.css');

(function($){
	$.fn.idleTimeout = function(options) {
		
		// this is the parameter definitions.
		var PARAMETERS = [
			{name:"inactivity", 		default_value:1200000},	// default inactivity period 20 minutes
			{name:"reactionTime", 		default_value:30000, alias:["noconfirm"]},// default confirmation period of 30 seconds
			{name:"sessionalive",		default_value:1200000},	// default session alive period 20 minutes
			{name:"logouturl",			default_value:'./'}, // can't really set a default logout URL
			{name:"refreshOnClick",		default_value:true}, // refresh session if user clicks on the page
			// Ajax call back url function to server to keep the session alive, this has to return true or false from server on success
			{name:"refreshCallbackUrl",	default_value:'./'}, // Can't really set a default callbackurl
			{name:"regex",				default_value:/^([0-9]+(?:\.[0-9]*)?)\s*(.*s)?$/},
			{name:"powers",				default_value:{
													'ms': 1,
													'cs': 10,
													'ds': 100,
													's': 1000,
													'das': 10000,
													'hs': 100000,
													'ks': 1000000
			}}
		];
		
		// this is to ensure that if we cannot detect the language(or if the  
		// language is in a different case) that we default to an appropriate language.
		var language = PE.language && PE.language.toLowerCase() == "eng"?"eng":"fra";
		
		// Message to show on pop up (set the message according to the language being used in metadata)
		var timeoutMessage = {
			eng: "Your session is about to expire, you have until #expireTime# to activate the \"OK\" button below to extend your session.",
			fra: "Votre session est sur le point d\'expirer, vous avez jusqu\'a #expireTime# pour sélectionnez \"OK\" ci-dessous pour prolonger votre session."
		};
		var msgBoxTitle = {
			eng:"Session timeout warning",
			fra:"Avertissement d\'expiration de la session"
		};
		var alreadyTimeoutMsg = {
			eng: "Sorry your session has already expired. Please login again.",
			fra: "Désolé, votre session a déjà expiré. S\'il vous plaît vous connecter à nouveau."
		};
		
		// the following code will take the parameters passed to this object
		// and configure them (also, it will set the defaults if need be.
		// Aliases take priority.
		var opts = {};
		var params = options.sTimeout?options.sTimeout:{};
		var i = 0,j = 0;
		for(i = 0; i < PARAMETERS.length; i++){
			//opts[PARAMETERS[i].name] = params[PARAMETERS[i].name]?params[PARAMETERS[i].name]:PARAMETERS[i].default_value;
			opts[PARAMETERS[i].name] = params[PARAMETERS[i].name] != undefined?params[PARAMETERS[i].name]:PARAMETERS[i].default_value;
			if(PARAMETERS[i].alias)
				for(j=0; j < PARAMETERS[i].alias.length; j++)
					opts[PARAMETERS[i].name] = params[PARAMETERS[i].alias[j]]?params[PARAMETERS[i].alias[j]]:opts[PARAMETERS[i].name];
		}
		
		// An overlay over the screen when showing the dialog message
		// Added &nbsp; to fix Chrome bug (received from Charlie Lavers - PWGSC)
		var overLay='<div class="sOverlay jqmOverlay">&nbsp;</div>';
		var liveTimeout, sessionTimeout;
		
		//------------------------------------------------------ Main functions
		
		function keep_session() {
			clearTimeout(sessionTimeout);
			// If the refreshCallbackUrl not present then dont show any error
			if (opts.refreshCallbackUrl.length>2) {
				$.post( opts.refreshCallbackUrl,
					function (responseData) {
						// if the response data returns "false", we should display that the session has timed out.
						if (responseData && responseData.replace(/\s/g,"") != "false") {
							sessionTimeout = setTimeout(keep_session, timeParse(opts.sessionalive));
						} else {
							alert(alreadyTimeoutMsg[language]);
							redirect();
						}	
					});
			}
		}
		
		function start_liveTimeout() {
			clearTimeout(liveTimeout);
			liveTimeout = setTimeout(logout, timeParse(opts.inactivity));
		  
			if (opts.sessionalive)
				keep_session();
		}
		
		// code to display the alert message
		function displayTimeoutMessage(){
			var expireTime = getExpireTime();
			var $where_was_i = document.activeElement; // Grab where the focus in the page was BEFORE the modal dialog appears
			var result;
			
			$(document.body).append(overLay);
			result = confirm(timeoutMessage[language].replace("#expireTime#", expireTime));
			$where_was_i.focus();
			$(".jqmOverlay").detach();
			return result;
		}
		
		function logout() {
			var start = getCurrentTimeMs();
			
			// because of short circuit evaluation, this statement 
			// will show the dialog before evaluating the time, thus the 
			// getCurrentTimeMs() will return the time after the alert
			// box is shown.
			if (displayTimeoutMessage() 
					&& getCurrentTimeMs() - start <= opts.reactionTime)
				stay_logged_in();
			else 
				redirect();
		}
		
		//--------------------------------------------------- Utility functions
		
		function getCurrentTimeMs(){return (new Date()).getTime();}
		
		function redirect() { window.location.href = opts.logouturl; }
		
		var stay_logged_in = start_liveTimeout;
		
		// Parsing function for time period
		function timeParse(value) {
			if (value == undefined || value == null)
				return null;
			
			var result = opts.regex.exec(jQuery.trim(value.toString()));
			if (result[2]) {
				var num = parseFloat(result[1]);
				var mult = opts.powers[result[2]] || 1;
				return num * mult;
			} else {
				return value;
			}
		}
		
		function getExpireTime() {
			var expire = new Date( getCurrentTimeMs() + opts.reactionTime );
			var hours = expire.getHours(), 
				minutes = expire.getMinutes(), 
				seconds = expire.getSeconds();
			
			var timeformat=hours<12 ? " AM":" PM";
		    hours = hours%12;
			if (hours==0)
		    	hours=12;
				
		    // Add a zero if needed in the time
		    hours = hours<10?'0'+hours:hours;
		    minutes = minutes<10?'0'+minutes:minutes;
		    seconds = seconds<10?'0'+seconds:seconds;
			
			return hours+":"+minutes+":"+seconds+timeformat;
		}
		
		// Build & return the instance of the item as a plugin
		return this.each(function() {
			start_liveTimeout();
			if (opts.refreshOnClick)
				$(document).bind('click', start_liveTimeout);
		});
	};
})(jQuery);
$(document).idleTimeout(PE.parameters);