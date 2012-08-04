/*!
 * Form validation v1.1 / Validation des formulaires v1.1
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */

/**
 * A jQuery plug-in for generic validation and error message handling in Web forms.
 *
 * @name Form validation
 * @notes Using the jQuery Validation Plugin 1.9.0
			http://bassistance.de/jquery-plugins/jquery-plugin-validation/
			http://docs.jquery.com/Plugins/Validation
		
		Accessible solution from the Humanising Technology Blog by Matt Lawson (with modifications)
			http://www.nomensa.com/blog/2010/accessible-forms-using-the-jquery-validation-plug-in/
		
 */

/*
 * Load jQuery Validation Plugin files
 */
PE.load('formValidation/jquery-validation/jquery.validate.min.js');
PE.load('formValidation/jquery-validation/additional-methods.min.js');
if (PE.language != "eng") PE.load('formValidation/jquery-validation/localization/wet-boew-messages-fra.js')
 
$.fn.formValidation = function () {	
	//Custom accessibility method for the jQuery validation plug-in
	$(this).accValidate();
}

$.fn.accValidate = function(){
 
    var form = this;
	var submitted = false;
	
	var dictionary = {
		errorSummary1: (PE.language == "eng") ? "The form could not be submitted because " : "Le formulaire n'a pu être soumis car ",
		errorSummary2a: (PE.language == "eng") ? " errors were found." : " erreurs ont été trouvées.",
		errorSummary2b: (PE.language == "eng") ? " error was found." : " erreur a été trouvée.",
		error: (PE.language == "eng") ? "Error " : "Erreur ",
		colon: (PE.language == "eng") ? ": " : "&#160;: "
	};
	
	// Add WAI-ARIA roles
	form.find(':text').attr('role','textbox').attr('aria-multiline','false');
	if (!/MSIE ((5\.5)|6|7)/.test(navigator.userAgent)) {
		form.find('.required').attr('aria-required','true').attr('required','required');
	} else {
		form.find('.required').attr('aria-required','true');
	}
	form.find('#form :submit').attr('role','button');
	
		
	//The jQuery validation plug-in in action
	$(form).validate({
		meta: "validate",
	
		//Focus on the first link in the error list
		focusInvalid: false,
		
		//Set the element which will wrap the inline error messages
		errorElement: "strong",
		
		//Location for the inline error messages
		//In this case we will place them in the associated label element
		errorPlacement: function(error, element) {
			error.appendTo(form.find('label[for="' + $(element).attr('id') + '"]'));
		},
	
		//Create our error summary that will appear before the form
		showErrors: function(errorMap, errorList) {
			this.defaultShowErrors();
			var errors = form.find("strong.error:not(:hidden)");
			var $errorFormId = 'errors-' + form.attr('id');
			var summaryContainer = form.find('#' + $errorFormId);
			
			if (errors.length > 0){
				//Create our container if one doesnt already exits
				//better than an empty div being in the HTML source
				
				if(summaryContainer.length == 0) {
					summaryContainer = $('<div id="' + $errorFormId + '" class="errorContainer" role="alert" tabindex="-1"/>').prependTo(form);
				}else{
					summaryContainer.empty();
				}

				//Post process
				var summary=$("<ul></ul>");
				errors.each(function(index){
					$this = $(this);
					$this.attr("role","alert");
					$this.find("span.prefix").detach();
					$this.prepend("<span class=\"prefix\">" + dictionary.error + (index+1) + dictionary.colon + "</span>");
					var link = $('<a href="#' + $this.closest("label").attr("for") + '">' + $this.html() + '</a>');
					summary.append($('<li></li>').append(link));
				});
				
				//Output our error summary and place it in the error container
				summaryContainer.append($('<p>' + dictionary.errorSummary1 + this.numberOfInvalids() + (this.numberOfInvalids() != 1 ? dictionary.errorSummary2a : dictionary.errorSummary2b) + '</p>'));
				summaryContainer.append(summary);
				
				//Move the focus to the associated input when error message link is triggered
				//a simple href anchor link doesnt seem to place focus inside the input
				if (!/MSIE ((5\.5)|6|7)/.test(navigator.userAgent)) {
					form.find('#' + $errorFormId + ' a').click(function() {
						$($(this).attr('href')).focus();
						return false;
					});
				}

				submitted = false;
			}else{
				summaryContainer.detach();
			}
		}, //end of showErrors()
		invalidHandler: function(form, validator){
			submitted = true;
		},
		onkeyup: function(element, event) {
			// Only change the error message when there is a keypress that will change the actual field value (versus navigating there)
			if ( (event.keyCode < 9 || event.keyCode > 45) && !event.shiftKey && (element.name in this.submitted || element == this.lastElement) ) {
				this.element(element);
			}
		}
	}); //end of validate()
}; //end of accValidate()

/**
 *  Progressive Enhancement Runtime
 **/

//Load default stylesheet for this plugin
Utils.addCSSSupportFile(Utils.getSupportPath() + "/formValidation/style.css");
$(document).ready(function() {$('.wet-boew-form-validation').show().find('form').formValidation(); });