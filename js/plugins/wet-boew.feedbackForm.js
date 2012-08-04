/*!
 * Feedback form v1.3 / Feuille de réponse v1.3
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */

/**
 * FeedbackForm is a jQuery plugin for adding the ability to submit comments for a specific page
 * or the site in general.
 *
 * @name Feedback Form
 * @return jQuery
 */
 
 //Hides selected divs from view
 function hideAll(form){
 	form.find('#skip, #web, #mobile, #info').attr('aria-hidden','true').hide();
	form.find('#computer').attr('aria-hidden','false');
 }
 
 //Toggles selected divs from view
 function hideNShow(form){
 
	//Web Questions
	form.find('#feedback').attr('aria-controls','web').keyup(function() { 
		if ($(this).val()==('web')) form.find('#web').attr('aria-hidden','false').show("slow");
		else form.find('#web').attr('aria-hidden','true').hide("slow");
	}).click(function() { 
		if ($(this).val()==('web')) form.find('#web').attr('aria-hidden','false').show("slow");
		else form.find('#web').attr('aria-hidden','true').hide("slow");
	});
	
	//Computer and Mobile
	form.find('#access').attr('aria-controls','mobile computer').keyup(function() { 
		if ($(this).val()==('mobile')) {
			form.find('#mobile').attr('aria-hidden','false').show("slow");
			form.find('#computer').attr('aria-hidden','true').hide("slow");
		} else {
			form.find('#computer').attr('aria-hidden','false').show("slow");
			form.find('#mobile').attr('aria-hidden','true').hide("slow");
		}
	}).click(function() { 
		if ($(this).val()==('mobile')) {
			form.find('#mobile').attr('aria-hidden','false').show("slow");
			form.find('#computer').attr('aria-hidden','true').hide("slow");
		} else {
			form.find('#computer').attr('aria-hidden','false').show("slow");
			form.find('#mobile').attr('aria-hidden','true').hide("slow");
		}
	});

	//Contact info first selection
	form.find('#contact1').attr('aria-controls','info').keyup(function() {
		if ($(this).val()==('yes')) {
			form.find('#info').attr('aria-hidden','false').show("slow");
		} else if ($(this).val()==('no')) {	
			if ((form.find('#contact2').val()==('no')) | form.find('#contact2').val()==null) form.find('#info').attr('aria-hidden','true').hide("slow");
		}
	}).click(function() {
		if ($(this).val()==('yes')) {
			form.find('#info').attr('aria-hidden','false').show("slow");
		} else if ($(this).val()==('no')) {	
			if ((form.find('#contact2').val()==('no')) | form.find('#contact2').val()==null) form.find('#info').attr('aria-hidden','true').hide("slow");
		}
	}); 

	//Contact info second selection
	form.find('#contact2').attr('aria-controls','info').keyup(function() { 
		if ($(this).val()==('yes')) {
			form.find('#info').attr('aria-hidden','false').show("slow");
		} else if ($(this).val()==('no')) {	
			if ((form.find('#contact1').val()==('no')) | form.find('#contact1').val()==null) form.find('#info').attr('aria-hidden','true').hide("slow");
		}
	}).click(function() { 
		if ($(this).val()==('yes')) {
			form.find('#info').attr('aria-hidden','false').show("slow");
		} else if ($(this).val()==('no')) {	
			if ((form.find('#contact1').val()==('no')) | form.find('#contact1').val()==null) form.find('#info').attr('aria-hidden','true').hide("slow");
		}
	});
}

$.fn.feedbackForm = function () {	
	 // Get the plugin parameters from the html page
	var params = Utils.loadParamsFromScriptID("feedbackForm");
	var form = $(this);
	
	hideAll(form);
	hideNShow(form);
	
	// Prepopulates URL form field with referrer
	var referrerUrl = document.referrer;
	form.find('input#page').attr('value', referrerUrl);
	
	// Automatically select the reason if specified in the query string
	form.find('option[value="' + PE.url().queryTokenized.feedback + '"]').attr("selected","selected");

	// Make the hidden required/obligatoire labels visible
	form.find('.req-oblig').css("display","inline");
	
	// Add WAI-ARIA roles
	form.find('textarea').attr('role','textbox').attr('aria-multiline','true');
	form.find('select').attr('role','listbox').attr('aria-multiselectable','false').change(function() {
		$(this).children(":selected").attr('aria-selected','true').siblings().attr('aria-selected','false');
	});
	form.find('option').attr('role','option').attr('aria-selected','false');
	form.find('select').change();
	form.find('input:text').attr('role','textbox').attr('aria-multiline','false');
	form.find('input:checkbox').attr('role','checkbox').attr('aria-checked','false').change(function() {
		if ($(this).is('input:checked')) $(this).attr('aria-checked','true');
		else $(this).attr('aria-checked','false');
	});
	form.find('input:checked').attr('aria-checked','true');
}

// Add the stylesheet for this plugin
Utils.addCSSSupportFile(Utils.getSupportPath() + "/feedbackForm/style.css");
$(document).ready(function() {$('.wet-boew-feedback-form').feedbackForm(); });