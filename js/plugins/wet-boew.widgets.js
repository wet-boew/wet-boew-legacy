/*!
 * Customizable interface v1.1 / Interface personnalisable v1.1
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * Terms and conditions of use: http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Terms
 * Conditions régissant l'utilisation : http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Conditions
 */
var widgets = {
	
	// Load the parameters used in the plugin declaration. Parameters can be access using this.parms.parameterName
	params :  Utils.loadParamsFromScriptID("widgets"),
	
	cookie_name :  "widgets-",
	
	//Used to store localized strings for your plugin.
	dictionary : {
		instructionsTitle :(PE.language == "eng") ? "How to customize this page" : "Comment personaliser cette page",
		instructionsText :(PE.language == "eng") ? "While some boxes are locked in place, most can be moved to neighbouring columns.  This allows you to create the homepage that best suites your needs.  You can also choose to have them open or closed, by default.  When you return to this page, the boxes you expanded will remain open and the collapsed boxes will stay closed." : "[French]While some boxes are locked in place, most can be moved to neighbouring columns.  This allows you to create the homepage that best suites your needs.  You can also choose to have them open or closed, by default.  When you return to this page, the boxes you expanded will remain open and the collapsed boxes will stay closed.",
		instructionsMouseTitle :(PE.language == "eng") ? "With your mouse:" : "Avec la souris : ",
		instructionsMouseText :(PE.language == "eng") ? " Drag and drop a box to a new location." : " Glisser et deposer au nouvel endroit",
		instructionsKeyboardTitle :(PE.language == "eng") ? "With your keyboard:" : "Avec le clavier : ",
		instructionsKeyboardText :(PE.language == "eng") ? " Tab to any box  and then pressing CTRL + [arrow key] to move it to a new location." : "[French] Tab to any box  and then pressing CTRL + [arrow key] to move it to a new location."
	},
	
	//Method that is executed when the page loads
	init : function(){
		
		// Create the cookie name
		if (this.params.cookie_scope != null) {
			if (this.params.cookie_scope == "domain") this.cookie_name += window.location.host;
			else if (this.params.cookie_scope == "query") this.cookie_name += window.location.host + window.location.pathname + window.location.search;
			else this.cookie_name += window.location.host + window.location.pathname;
		} else {
			this.cookie_name += window.location.host + window.location.pathname;
		}
		
		if (this.params.cookie_expires == null || isNaN(this.params.cookie_expires)) {
			this.params.cookie_expires = 365;
		}else{
			this.params.cookie_expires = parseInt(this.params.cookie_expires);
		}
		
		this.addInstructions();
		
		var options = {
			selectors: {
				columns: ".widgets-column",
				modules: "> div > div",
				lockedModules: ".widgets-locked",
				dropWarning: ".flc-reorderer-dropWarning"
			},
			
			
			listeners: {
				afterMove : widgets.afterMove
			}
		};
		
		fluid.reorderLayout ("#widget-container1", options);
		
		this.loadLayout()

		// Return focus to widget expand/collapse link when it is clicked
		$(".widgets-column").bind('click', function(event) {
			if ($(event.target).is('.toggle-link-expand') || $(event.target).is('.toggle-link-collapse') ) $(event.target).focus();
		});
	},
	
	addInstructions : function(){
		$instructions = $('<div class="toggle-content collapse"></div><div class="clear"></div>');
		$instructions.append('<p class="toggle-link-text"><strong>' + this.dictionary.instructionsTitle + '</strong></p>');
		$instructions.append('<p>' + this.dictionary.instructionsText + '</p>');
		$instructions.append('<p><strong>' + this.dictionary.instructionsMouseTitle + '</strong>' + this.dictionary.instructionsMouseText + '</p>');
		$instructions.append('<p><strong>' + this.dictionary.instructionsKeyboardTitle + '</strong>' + this.dictionary.instructionsKeyboardText + '</p>');
		
		$('.' + this.params.instruction_container).append($instructions);
	},
	
	afterMove : function (item, requestedPosition, movables){
		widgets.saveLayout(movables)
	},
	
	saveLayout : function(elements){
		var cookie = ""
		elements.parent().each(function(pindex, parent){
			$(parent).children().each(function( cindex, child){
				cookie += $(child).attr("id") + ":" +  $(parent).attr("id") + ","
			});
		});
		$.cookie(this.cookie_name, cookie.substr(0, cookie.length-1), { expires: this.params.cookie_expires});
	},
	
	loadLayout : function(){
		var cookie = $.cookie(this.cookie_name);
		
		//Resets the expiring date
		$.cookie(this.cookie_name, cookie, { expires: this.params.cookie_expires});
		
		if (cookie != null){
			var positions = cookie.split(',');
			for(p = 0; p< positions.length;p++){
				
				var parts = positions[p].split(':')
				
				var box = $('#' + parts[0]);
				var parent = box.parent();
				box.detach();
				
				if (parts[1] != null && parts[1] != ""){
					var destination = $("#" + parts[1])
					
					if (destination.length ==1){
						destination.append(box);
					}else{
						parent.append(box);
					}
				}else{
					parent.append(box);
				}
				
				
				
			}
		}
	}
}


// Add Style Sheet Support for this plug-in
Utils.addCSSSupportFile(Utils.getSupportPath()+"/widgets/style.css"); 

//Loads a library that the plugin depends on fromthe lib folder
PE.load('widgets/jquery.ui.core.js');
PE.load('widgets/jquery.ui.widget.js');
PE.load('widgets/jquery.ui.mouse.js');
PE.load('widgets/jquery.ui.draggable.js');
PE.load('widgets/jquery.keyboard-a11y.js');
PE.load('widgets/json2.js');
PE.load('widgets/Fluid.js');
PE.load('widgets/FluidDOMUtilities.js');
PE.load('widgets/ReordererDOMUtilities.js');
PE.load('widgets/GeometricManager.js');
PE.load('widgets/Reorderer.js');
PE.load('widgets/ModuleLayout.js');
PE.load('widgets/layoutReorderer.js');
PE.load('jquery.cookie.js');

// Init Call at Runtime
$("document").ready(function(){   widgets.init(); });
