/*!
 * Search term highlighting v1.2 / Mise en surbrillance des termes recherchés v1.2
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */
(function($){
	$.fn.termHighlighting = function(settings) {
		$elm = $(this);
	
		var defaults = {
			minLength:3
		}
		
		$.extend(settings, defaults);
		
		var dictionary = {
			label : (PE.language == "eng") ? 'Search for term(s):' : 'Recherche de terme(s):',
			noMatch : (PE.language == "eng") ? 'No match found' : 'Aucune correspondance trouvée',
			oneMatch : (PE.language == "eng") ? '1 match found' : '1 correspondance trouvée',
			multiMatch : (PE.language == "eng") ? ' matches found' : ' correspondances trouvées'
		}
		
		var terms = (PE.url().queryTokenized.term != undefined) ? PE.url().queryTokenized.term : "";
		
		form = $('<form class="wet-boew-termSearch"><label for="term">' + dictionary.label + '</label> <input type="text" id="term" name="term" value="' + terms + '" role="textbox" aria-multiline="false" />&#160;<span class="matches-found" role="status" aria-live="polite" aria-relevant="additions text"></span></form>');
		$elm.before(form);
		
		
		// Event handling
		form.delegate("input", "change keypress click", function(event){
			setTimeout(function(){
				var terms = $(event.delegateTarget).find("input[type=text]").attr("value");
				var target = $(event.delegateTarget).next();
			
				if (terms.length >= settings.minLength){
					clearHighlightedTerms(target);
					highlightTerms(terms, target, settings);
				}else{
					clearHighlightedTerms(target);
				}
			},50);
		})
		
		//Prevents the form from submitting
		form.submit(function(){return false;});
		
		$elm.bind("searchComplete", function(event, matchesCount){
			var message;
			
			if (matchesCount < 1){
				message = dictionary.noMatch
			}else if(matchesCount === 1){
				message = dictionary.oneMatch
			}else{
				message = matchesCount + dictionary.multiMatch
			}

			$(event.target).prev().find(".matches-found").text(message);
		});
		
		//Initialize with query parameter
		if (terms.length >= settings.minLength)
			highlightTerms(terms, $(this), settings);
		
		/*
		 * highlightTerms
		 *
		 * This function will search the content within an element(s) of the page and hightlight
		 * matches found based on the search term(s) entered by the user
		 *
		 * @param   searchTerms		string		The keywords that we want to search on.
		 * @param	target 	Object			The DOM object to look into
		 * @param	settings	Object		The plugins settings
		 *
		 * @return	(nothing)			Just updates the content directly
		 *
		 */
		
		function highlightTerms(searchTerms, target, settings) {
			var matches     = 0;
			var searchTerms = searchTerms.replace(/^\s+|\s+$/g, '');
			searchTerms	    = searchTerms.replace(/\|+/g, ''); // don't let them use the | symbol

			// --------------------------------------------------------------------------------------------
			// Split the data into an array so that we can exclude anything smaller than the minimum length
			var arrTerms = searchTerms.split(' ');
			if (arrTerms.length > 0) {
				var searchTerms = '';
				for(i = 0; i < arrTerms.length; i++) {
					if (arrTerms[i].length >= settings.minLength) { searchTerms += arrTerms[i] + " "; }
				}
				searchTerms = searchTerms.replace(/^\s+|\s+$|\"|\(|\)/g, '');
			}
			
			searchTerms = searchTerms.replace(/\s+/g, '|'); // OR each value
			searchTerms =  "(?=([^>]*<))([\\s'])?(" + searchTerms + ")(?!>)"; // Make sure that we're not checking for terms within a tag; only the text outside of tags.
			
			// --------------------------------------------------------------------------------------------

			var newText = target.html().replace(new RegExp(searchTerms, "gi"), function(match, grp1, grp2, grp3) {
				matches++;
				return grp2 + '<span class="wet-boew-highlight-term">' + grp3 + '</span>';
			});
			target.trigger("searchComplete", [matches])
			target.html(newText); 
			return null;

		}; // end of highlightTerms

		/*
		 * clearHighlightedTerms
		 *
		 * This function will clear out any terms that were highlighted before hand that are not in the list of terms anymore
		 *
		 * @param	target 	Object			The DOM object to clear 
		 * @return	(nothing)			Just updates the content directly
		 *
		 */

		function clearHighlightedTerms(target) {
			target.find('span.wet-boew-highlight-term').each( function() {
				var text = $(this).text();
				$(this).replaceWith(text);
			});
			target.prev().find(".matches-found").text("");
		}; // end of clearHighlightedTerms
		
		return this;
	};
	
	$(document).ready(function(){
		options = {};
		$(".wet-boew-termHighlighting").termHighlighting(options);
	});
	
	// Add the stylesheet for this plugin
	Utils.addCSSSupportFile(Utils.getSupportPath() + "/searchTermHighlighting/style.css");
})(jQuery); 