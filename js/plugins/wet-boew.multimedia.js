/*!
 * Multimedia player v1.3 / Lecteur multimédia v1.3
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */
	/**
	 * @name : Multimedia Player Plugin
	 * @author : Government of Canada 
	 */
	 
	 /*
	  * Load helper libraries
	  */
	PE.load('jquery.plugin.js');
	PE.load('jquery.template.js');

	/**
	 * Load Default Theme
	 * TODO: This function should be extended to allow intelligent style sheet additions so that plugins can have various stylesheets
	 */
	Utils.addCSSSupportFile(Utils.getSupportPath() + '/multimedia/themes/default/style.css');


	/*
	 *  Multimedia Controller
	 */
	var mPlayerRemote = {
		// this singleton only wants one plugin so create a private property
		_plugin : null,
		
		//Default settings
		defaults : {
			flash : {
				required : '10.1'
			},
			
			silverlight : {
				required : '3.0'
			}
		},
		
		init : function(options){
			//Merge input settibngs with default settings
			$.extend (true, options, this.defaults);
			
			// lets set the default
			this._plugin = false;
			// lets check to make sure flash and/or silverlight is available
			if ($.browser.plugin.flash.isAvailable || $.browser.plugin.silverlight.isAvailable )
			{ 
					 
				if ($.browser.plugin.flash.isAvailable && $.browser.plugin.flash.isVersionSupported(options.flash.required) && ( options.force.length === 0 || options.force.toLowerCase() === 'flash' )) 
				{
					// check to see if flash version is supported
					this._plugin  = $.browser.plugin.flash;
				}
				else if ($.browser.plugin.silverlight.isAvailable && $.browser.plugin.silverlight.isVersionSupported(options.silverlight.required) && ( options.force.length === 0 || options.force.toLowerCase() === 'silverlight' )) 
				{
					// check to see if flash version is supported
					this._plugin = $.browser.plugin.silverlight;
				}
			}
		},
				
		getPluginInstance : function(options) {
			if (this._plugin === null){
				throw "Player not yet initialized";
			}
			return this._plugin;
		},
			 
		exec : function( pid, api, args) {               
			var playerObject = (navigator.appName.indexOf("Microsoft Internet")!=-1) ?  document.getElementById(pid) : $('#' + pid+ '')[0];

			// Execute command
				   PlayerLib[this._plugin.namespace].objectRef(playerObject)[api](args);
		},
		
		update : function(pid, fname, prm1, prm2)
		{
			// Update Interface
			switch (fname)
			{
				case "play":
					$("#"+pid+"PlayStopButton").attr('title', PlayerLib.dictionary.pause);
					$("#"+pid+"PlayStopButton").children("img").attr("alt", PlayerLib.dictionary.pause);
					$("#"+pid+"PlayStopButton").children("img").attr("src", PlayerLib.icons.pause);
					$("#"+pid).trigger('mp-play');
					break;
				case "pause":
					$("#"+pid+"PlayStopButton").attr('title', PlayerLib.dictionary.play);
					$("#"+pid+"PlayStopButton").children("img").attr("alt", PlayerLib.dictionary.play);
					$("#"+pid+"PlayStopButton").children("img").attr("src", PlayerLib.icons.play);
					$("#"+pid).trigger('mp-pause');
					break;
				case "captions":
					$("#"+pid+"CaptionOnOffButton").attr('title', PlayerLib.dictionary.closedcaptions_on);
					$("#"+pid+"CaptionOnOffButton").children("img").attr("alt", PlayerLib.dictionary.closedcaptions_on);
					$("#"+pid+"CaptionOnOffButton").children("img").attr("src", PlayerLib.icons.closedcaptions_on);
					$("#"+pid).trigger('mp-captions-on');
					break;
				case "nocaptions":
					$("#"+pid+"CaptionOnOffButton").attr('title', PlayerLib.dictionary.closedcaptions_off);
					$("#"+pid+"CaptionOnOffButton").children("img").attr("alt", PlayerLib.dictionary.closedcaptions_off);
					$("#"+pid+"CaptionOnOffButton").children("img").attr("src", PlayerLib.icons.closedcaptions_off);
					$("#"+pid).trigger('mp-captions-off');
					break;
				case "audiodescription":
					$("#"+pid+"AudioDescriptionOnOffButton").attr('title', PlayerLib.dictionary.audiodescription_on);
					$("#"+pid+"AudioDescriptionOnOffButton").children("img").attr("alt", PlayerLib.dictionary.audiodescription_on);
					$("#"+pid+"AudioDescriptionOnOffButton").children("img").attr("src", PlayerLib.icons.audiodescription_on);
					$("#"+pid).trigger('mp-audiodesc-on');
					break;
				case "noaudiodescription":
					$("#"+pid+"AudioDescriptionOnOffButton").attr('title', PlayerLib.dictionary.audiodescription_off);
					$("#"+pid+"AudioDescriptionOnOffButton").children("img").attr("alt", PlayerLib.dictionary.audiodescription_off);
					$("#"+pid+"AudioDescriptionOnOffButton").children("img").attr("src", PlayerLib.icons.audiodescription_off);
					$("#"+pid).trigger('mp-audiodesc-off');
					break;
				case "mute":
					$("#"+pid+"MuteUnmuteButton").attr('title',PlayerLib.dictionary.unmute);
					$("#"+pid+"MuteUnmuteButton").children("img").attr("alt",PlayerLib.dictionary.unmute);
					$("#"+pid+"MuteUnmuteButton").children("img").attr("src",PlayerLib.icons.unmute);
					$("#"+pid).trigger('mp-mute-on');
					break;
				case "unmute":
					$("#"+pid+"MuteUnmuteButton").attr('title',PlayerLib.dictionary.mute);
					$("#"+pid+"MuteUnmuteButton").children("img").attr("alt",PlayerLib.dictionary.mute);
					$("#"+pid+"MuteUnmuteButton").children("img").attr("src",PlayerLib.icons.mute);
					$("#"+pid).trigger('mp-mute-off');
					break;
				case "totalTime":
					var step = 10
					
					if (!isNaN(prm1))
					{
						$("#"+pid+"Duration").text(mPlayerRemote.secondsToTimecode(prm1));
						$("#"+pid+"Position").text("00:00");

						//Calculate the seeking step
						var step = Math.ceil(prm1 /100 * 5);
						if (step <10) step =10; // The Flash variant seek function seems to not like it when jumping less than 10 seconds at the time
					}
					
					$("#"+pid).parent().data('seekStep', step);
					
					break;
				case "currentTime" :
					if (!isNaN(prm1))
					{
						$("#"+pid+"Position").text(mPlayerRemote.secondsToTimecode(prm1));
					}
					break;
				case "loaded" :
					if (!isNaN(prm1))
					{
						$("#"+pid+"Buffered").text("["+ prm1 + "%]");
					}
					break;
			}
		},
		
		secondsToTimecode : function(seconds){
			var minutes = Math.floor(seconds /60);
			var seconds = Math.floor(seconds % 60);
			
			return (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
		}
	};

	/**
	 *  Player Library of apicalls 
	 *  TODO: We could modularize this alot more
	 */
	var PlayerLib = {
		// Dictonary Terms
		dictionary : {
			play : (PE.language === 'eng') ? "Play " : "Démarrer ",
			pause : "Pause ",
			closewindow : (PE.language === 'eng') ? "Close" : "Fermer",
			rewind : (PE.language === 'eng') ? "Rewind " : "Reculer ",
			fastforward : (PE.language === 'eng') ? "Fast forward " : "Avancer ",
			mute: (PE.language === 'eng') ? "Mute" : "Activer le mode muet",
			unmute: (PE.language === 'eng') ? "Unmute" : "Désactiver le mode muet",
			closedcaptions_on: (PE.language === 'eng') ? "Hide Closed captioning " : "Masquer le sous-titrage ",
			closedcaptions_off: (PE.language === 'eng') ? "Show Closed captioning" : "Afficher le sous-titrage ",
			audiodescription_on: (PE.language === 'eng') ? "Disable Audio Description " : "Désactiver l'audiodescription ",
			audiodescription_off: (PE.language === 'eng') ? "Enable Audio Description" : "Activer l'audiodescription ",
			novideo : (PE.language === 'eng') ? "Your browser does not appear to have the capabilities to play this video, please download the video below":
									  "Votre navigateur ne semble pas avoir les capacité nécessaires pour lire cette vidéo, s'il vous plaît télécharger la vidéo ci-dessous",
			position: (PE.language === 'eng') ? "Current Position: " : "Position actuelle : ",
			duration: (PE.language === 'eng') ? "Total Time: " : "Temps total : ",
			buffered: (PE.language === 'eng') ? "Buffered: " : "Mis en mémoire-tampon : "
		},
		
		icons : {
			background : Utils.getSupportPath() + '/multimedia/themes/default/images/background-toolbar.png',
			play: Utils.getSupportPath() + '/multimedia/themes/default/images/play-control.png',
			pause : Utils.getSupportPath() + '/multimedia/themes/default/images/pause-control.png',
			rewind : Utils.getSupportPath() + '/multimedia/themes/default/images/rewind-control.png',
			fastforward : Utils.getSupportPath() + '/multimedia/themes/default/images/fastforward-control.png',
			closedcaptions_off : Utils.getSupportPath() + '/multimedia/themes/default/images/cc-off-control.png',
			closedcaptions_on : Utils.getSupportPath() + '/multimedia/themes/default/images/cc-on-control.png',
			audiodescription_off : Utils.getSupportPath() + '/multimedia/themes/default/images/description-off-control.png',
			audiodescription_on : Utils.getSupportPath() + '/multimedia/themes/default/images/description-on-control.png',
			mute : Utils.getSupportPath() + '/multimedia/themes/default/images/sound-control.png',
			unmute : Utils.getSupportPath() + '/multimedia/themes/default/images/mute-control.png'
			//Utils.getSupportPath() + '/multimedia/themes/default/images/play-button-overlay.png'
		},
		
		'flash' : {
			objectRef : function(ref) {  return ref  },
			play : 'togglePlay',
			pause : 'togglePlay',
			captions : { on : 'toggleCaptions', off : 'toggleCaptions' },
			audiodescription : { on : 'toggleAudioDescription', off : 'toggleAudioDescription' },
			mute : { on : 'toggleMute', off : 'toggleMute' } ,
			fastforward : 'seek',
			rewind : 'seek'
		},
		
		'silverlight' : {
			objectRef : function(ref) {  return ref.Content.Player  },
			play : 'play',
			pause : 'pause',
			captions : { on : 'toggleCaptions', off : 'toggleCaptions' },
			audiodescription : { on : 'toggleAudioDescription', off : 'toggleAudioDescription' },
			mute : { on : 'toggleMute', off : 'toggleMute' } ,
			fastforward : 'fastForward',
			rewind : 'rewind'
		}
	};

	/*
	 * Extend jQuery to include function for media player
	 */

	 (function($){
		$.fn.mediaPlayer = function(options) {
			mPlayerRemote.init(options);
			
			// there's no need to do $(this) because
			// "this" is already a jquery object
		
			// get a unique id for the object tag
			var _registerPlayer = function() { var now = new Date(); var num = (now.getMilliseconds()); return 'mp'+num }
		
			var _createPlayer = function(elm){
				// Create the parameters for the source code
				var _id = _registerPlayer();
				// Section where we will initiate properties for the mediaplayer
				var node = $(elm);
		  
				// now get the xml for parsing
				//var docNode = (node.find('.mp-alternative').attr('href').match())
				// Create a properties file
				var properties = {
					height : (node.hasClass('force-dimensions')) ? node.find('img.posterimg').height(): Math.round( node.find('img.posterimg').width()*900 / 1600 ),
					width : node.find('img.posterimg').width(),
					id : _id,
					scale : (node.is('.scale-fill, .scale-zoom') ) ? node.hasClass('scale-fill') ? 'fill' : 'zoom' : '', 
					posterimg : node.find('img.posterimg').get(0).src,
					title : node.find('img.posterimg').attr('alt'),
					arialabel: node.find('img.posterimg').attr('alt'),
					media : node.find('.mp-mp4 a').get(0).href,
					captions : node.find(".mp-tt a").get(0).href,
					audiodescription : (node.find(".mp-tt a").length > 0) ? node.find(".mp-tt a").get(0).href : ""
				};
				
				if (node.find(".mp-tt").hasClass("tt-html")){
					properties.captionType = 'html';
				};
				
				if (mPlayerRemote.getPluginInstance().namespace != 'flash'){
					properties.parameters = {
						source : options.silverlight.src
					};
				}else{
					properties.data = options.flash.src;
				}
			 
				var ht_ml = "\n<!-- Autogenerated code by mediaplayer plugin -->\n\n";
				// Use the Plugins Plugin to give us the object text required for the browser
				ht_ml += mPlayerRemote.getPluginInstance().embed( properties );
				// Add the tool bar
				ht_ml += '<div class="wet-boew-toolbar">'
				+ '<div class="wet-boew-controls-start">'
				+ '<button id="${jsId}RewindButton" class="wet-boew-button rewind" title="${text.rewind}" aria-controls="${jsId}"><img src="${icons.rewind}" alt="${text.rewind}" /></button>'
				+ '<button id="${jsId}PlayStopButton" class="wet-boew-button ui-button-first" title="${text.play}" aria-controls="${jsId}"><img src="${icons.play}" alt="${text.play}" /></button>'
				+ '<button id="${jsId}FastForwardButton" class="wet-boew-button fastforward" title="${text.fastforward}" aria-controls="${jsId}"><img src="${icons.fastforward}" alt="${text.fastforward}" /></button>'
				+ '</div><div class="wet-boew-controls-end">'
	//			+ '<button id="${jsId}AudioDescriptionOnOffButton" class="wet-boew-button" title="${text.audiodescription_off}" aria-controls="${jsId}"><img src="${icons.audiodescription_off}" alt="${text.audiodescription_off}" /></button>'
				+ '<button id="${jsId}CaptionOnOffButton" class="wet-boew-button cc" title="${text.closedcaptions_off}" aria-controls="${jsId}"><img src="${icons.closedcaptions_off}" alt="${text.closedcaptions_off}" /></button>'
				+ '<button id="${jsId}MuteUnmuteButton" class="wet-boew-button ui-button-last mute" title="${text.mute}" aria-controls="${jsId}"><img src="${icons.mute}" alt="${text.mute}" /></button>'
				+ '</div><div class="wet-boew-controls-middle">'
				+ '<span class="cn-invisible" id="lbl${jsId}Position">${position}</span><span id="${jsId}Position" class="ui-display-position" aria-role="timer" aria-labelledby="lbl${jsId}Position">--:--</span><span>/</span>'
				+ '<span class="cn-invisible" id="lbl${jsId}Duration">${duration}</span><span id="${jsId}Duration" class="ui-display-duration" aria-role="status" aria-labelledby="lbl${jsId}Duration">--:--</span>'
				+ '<span class="cn-invisible" id="lbl${jsId}Buffered"> ${buffered}</span><span>&nbsp;</span><span id="${jsId}Buffered" class="ui-display-buffered" aria-role="status" aria-labelledby="lbl${jsId}Buffered">[--]</span><span></span>'
				+ '</div></div>'
		  
				ht_ml = ht_ml + "\n\n<!-- End of Autogenerated code by mediaplayer plugin -->\n";
				// Cache the complete object code and into the Template
				$.template("mpmarkup", ht_ml);
		  
				// Load the vars that will populate the object code
				var template = {
					jsId : _id,
					text : PlayerLib.dictionary,
					icons : PlayerLib.icons
				}
				
		  
				// Create the element to bind events to
				var _mediaplyr = $.tmpl('mpmarkup', template);
				$(elm).prepend(_mediaplyr);
				$(elm).children("img").remove();
				$(elm).find("object").attr("tabindex",-1);
				// now tweak toolbar width and some restrictions
				$(elm).find('.wet-boew-toolbar').width(properties.width - 2); // minus 2 px for 1px border on each side
				if ( $(elm).find('.wet-boew-toolbar').width() - $(elm).find('.wet-boew-controls-start').width() - $(elm).find('.wet-boew-controls-end').width()  < 150 ) {
					$(elm).find('.ui-display-buffered').addClass('cn-invisible');
				}
			   
				//Initialize the event handlers
				$('#' + _id + 'RewindButton').click(
					function(){
						var step = $("#"+_id).parent().data().seekStep;
						if (step != undefined){
							mPlayerRemote.exec(_id, PlayerLib[mPlayerRemote.getPluginInstance().namespace].rewind, -step);
						}
					}
				);
				
				$('#' + _id + 'PlayStopButton').click(
					function(){
						if ($(this).children("span.ui-icon-control-play").length > 0)
						{
							mPlayerRemote.exec(_id, PlayerLib[mPlayerRemote.getPluginInstance().namespace].play);
						}else{
							mPlayerRemote.exec(_id, PlayerLib[mPlayerRemote.getPluginInstance().namespace].pause);
						}
					}
				);
					
				$('#' + _id + 'FastForwardButton').click(
					function(){
						var step = $("#"+_id).parent().data().seekStep;
						if (step != undefined){
							mPlayerRemote.exec(_id, PlayerLib[mPlayerRemote.getPluginInstance().namespace].fastforward, step);
						}
					}
				);
					
				$('#' + _id + 'CaptionOnOffButton').click(
					function(){
						if ($(this).children("span.ui-icon-control-closed-caption-off").length > 0)
						{
							mPlayerRemote.exec(_id, PlayerLib[mPlayerRemote.getPluginInstance().namespace].captions.on);
						}else{
							mPlayerRemote.exec(_id, PlayerLib[mPlayerRemote.getPluginInstance().namespace].captions.off);
						}
					}
				);
					
	/*			$('#' + _id + 'AudioDescriptionOnOffButton').click(
					function(){
						if ($(this).children("span.ui-icon-control-audio-description-off").length > 0)
						{
							mPlayerRemote.exec(_id, PlayerLib[mPlayerRemote.getPluginInstance().namespace].audiodescription.on);
						}else{
							mPlayerRemote.exec(_id, PlayerLib[mPlayerRemote.getPluginInstance().namespace].audiodescription.off);
						}
					}
				);
	*/				
				$('#' + _id + 'MuteUnmuteButton').click(
					function(){
						if ($(this).children("span.ui-icon-control-sound").length > 0)
						{
							mPlayerRemote.exec(_id, PlayerLib[mPlayerRemote.getPluginInstance().namespace].mute.on);
						}else{
							mPlayerRemote.exec(_id, PlayerLib[mPlayerRemote.getPluginInstance().namespace].mute.off);
						}
					}
				);
				
			}
		 
			if (mPlayerRemote.getPluginInstance())
				this.each( function(){ _createPlayer($(this)); } )
		};
	})( jQuery );


	 /*
	  *  Runtime Hook to document.ready()
	  */
	 
	$(document).ready( function(){
	  
	  // Default settings
	  var settings = {
		   flash  : { src : Utils.getSupportPath() + '/multimedia/mp-jm.swf?c=' + Math.random() * 100000 },
		   silverlight : { src : Utils.getSupportPath() + '/multimedia/mp-jm.xap' },
		   force : ( Utils.loadParamsFromScriptID('multimedia').force ) ? Utils.loadParamsFromScriptID('multimedia').force : '' 
	   };
	   
	  // Load the mediaplayer
	  $('.mediaplayer').mediaPlayer(settings);
	});