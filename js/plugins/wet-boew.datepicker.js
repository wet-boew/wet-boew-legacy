/*!
 * Calendar interface v1.23 / Interface du calendrier v1.23
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */
var datepicker = {
	// Load the parameters used in the plugin declaration. Parameters can be access using this.parms.parameterName
	
	defaultFormat : "YYYY-MM-DD",
	
	// Used to store localized strings for your plugin.
	dictionary : { 
        hideText : (PE.language == "eng") ? "Hide Calendar" : "Masquer le calendrier",
        showText : (PE.language == "eng") ?  "Pick a date from a calendar for field: " : "Sélectionner une date à partir d'un calendrier pour le champ : ",
        selectedText : (PE.language == "eng") ?  "Selected" : "Sélectionné"
	},
	
	// Method that is executed when the page loads
	init : function(){
		var date = (new Date);
		var year = date.getFullYear();
		var month = date.getMonth();

		
		$(".date-picker").each(function(index, value){
			if($(this).attr("id")){
				
				//Gets the XHTML variables in the class attribute (if any).
				var xhtml_vars = new Array();
				if ($(this).attr("class").indexOf("{") > -1){
					var m = $(this).attr("class").match(/\{(.*)\}/)[1];
					pairs = m.split(',')
					for(p=0; p<pairs.length;p++){
						i = pairs[p].split(':');
						xhtml_vars[jQuery.trim(i[0])] = jQuery.trim(i[1]);
					}
				}
				
				var minDate;
				if ($(this).attr("data-min-date") != null){
					minDate = $(this).attr("data-min-date");
				}else if(xhtml_vars["min-date"]){
					minDate = xhtml_vars["min-date"];
				}else{
					minDate = '1800-01-01';
				}
				
				var maxDate;
				if ($(this).attr("data-max-date") != null){
					maxDate = $(this).attr("data-max-date");
				}else if(xhtml_vars["min-date"]){
					maxDate = xhtml_vars["max-date"];
				}else{
					maxDate = '2100-01-01';
				}
				
				var format
				if ($(this).attr("data-date-format") != null){
					format = $(this).attr("data-date-format") 
				}else if (xhtml_vars["date-format"]) {
					format=xhtml_vars["date-format"]
				}else{
					format = datepicker.defaultFormat;
				}
				
				var id = $(this).attr("id")
				var field = $(this);
				var containerid = id + '-picker'
				var container = $('<div id="' + containerid + '" class=\"picker-overlay\" role="dialog" aria-controls="' + id + '" aria-labelledby="' + containerid +'-toggle"></div>');

                // Escape key to close popup
                container.bind('keyup', function(e){ 
                    if (e.keyCode == 27) {
                        datepicker.hideAll();
                        $('#' + id + '-picker-toggle').focus();
                    }
                });

				field.parent().after(container)
				
				container.bind("calendarDisplayed", function(e, year,  month, days){
					datepicker.addLinksToCalendar(id, year, month, days, minDate, maxDate, format);
					datepicker.setSelectedDate(id, year, month, days, format);

                    // Close the popup a second after blur
                    container.find('a, select').blur(function(){
                        window.setTimeout(function(){
                            if(container.find(':focus').length === 0) {
                                datepicker.hideAll();
                            }
                        }, 1000);
                    });                    
				});
				calendar.create(containerid, year, month, true, minDate, maxDate); 
				datepicker.createToggleIcon(id, containerid);

                // 'Hide' link at the bottom of calendar to close the popup without selecting a date
                $('<a class="picker-close" href="javascript:;">' + datepicker.dictionary.hideText + '</a>').appendTo(container)
                    .click(function(){
                        datepicker.toggle(id, containerid);
                    });
				
				//Disable the tabbing of all the links when calendar is hidden
				container.find("a").attr("tabindex", -1);

				//Resize the form element to fit a standard date
				field.addClass("picker-field");
			}
		});
	},
	
	addLinksToCalendar : function(fieldid, year, month, days, minDate, maxDate, format){
		minDate = calendar.getDateFromISOString(minDate);
		maxDate = calendar.getDateFromISOString(maxDate);
		
		var lLimit = (year == minDate.getFullYear() && month == minDate.getMonth())? true : false;
		var hLimit = (year == maxDate.getFullYear() && month == maxDate.getMonth())? true : false;

		days.each(function(index, value){
			if ((!lLimit && !hLimit) || (lLimit == true && index >= minDate.getDate()) || (hLimit == true && index <= maxDate.getDate())){
                $(value).removeClass('ui-datepicker-unselectable ui-state-disabled');
				var obj = $(value).children("div");
				var link = $("<a href=\"javascript:;\"></a>");
				var parent = obj.parent()
				parent.empty();

                var date = new Date();
                if (index+1 == date.getDate() && month == date.getMonth() && year == date.getFullYear()) {
                    link.addClass("ui-state-highlight");
                }                
                
                link.addClass('ui-state-default');
                link.hover(function(){$(this).addClass("ui-state-hover");});
                link.focus(function(){$(this).addClass("ui-state-hover");});
                link.blur(function(){$(this).removeClass("ui-state-hover");})
                link.mouseout(function(){$(this).removeClass("ui-state-hover");})
				link.append(obj.html());
				link.appendTo(parent);
				link.bind('click', {fieldid: fieldid, year: year, month : month, day: index + 1, days:days, format: format}, 
					function(event){
						datepicker.addSelectedDateToField(event.data.fieldid, event.data.year, event.data.month+1, event.data.day, event.data.format); 
						datepicker.setSelectedDate(event.data.fieldid, event.data.year, event.data.month, event.data.days, event.data.format);
						//Hide the calendar on selection
						datepicker.toggle(event.data.fieldid , event.data.fieldid + "-picker");
					}
				);
			}
		});

	},
	
	createToggleIcon : function(fieldid, containerid){
		var fieldLabel = $("label[for='" + fieldid + "']").text()
		objToggle = $('<a id="' + containerid +'-toggle" class="picker-toggle-hidden" href="javascript:;" title="' + this.dictionary.showText + fieldLabel + '"><img src="' + Utils.getSupportPath() + "/datepicker/icon.png"+ '" alt=""/></a>');
		objToggle.click(function(){datepicker.toggle(fieldid, containerid);})
		var field = $('#' + fieldid);
		field.after(objToggle);
		
		var container = $('#' + containerid);
		container.slideUp(0);
	},
	
	setSelectedDate : function(fieldid, year, month, days, format){
		//Reset selection state
		$(days).removeClass("datepicker-selected");
		$(days).find(".datepicker-selected-text").detach();
		
		//Create regular expression to match value (Note: Using a, b and c to avoid replacing conflicts)
		format = format.replace("DD", "(?<a> [0-9]{2})");
		format = format.replace("D", "(?<a> [0-9] )");
		format = format.replace("MM", "(?<b> [0-9]{2})");
		format = format.replace("M", "(?<b> [0-9])");
		format = format.replace("YYYY", "(?<c> [0-9]{4})");
		format = format.replace("YY", "(?<c> [0-9]{2})");
		var pattern = "^" + format + "$";
		
		//Get the date from the field
		var date = $("#" + fieldid).attr("value");
		regex = XRegExp(pattern, "x");
        
		try{
			if (date != '')
			{
				var cpntDate =  $.parseJSON(date.replace(regex, '{"year":"${c}", "month":"${b}", "day":"${a}"}'));
				if (cpntDate.year == year && cpntDate.month== month+1){
					$(days[cpntDate.day - 1]).addClass("datepicker-selected");
					$(days[cpntDate.day - 1]).children("a").append("<span class=\"cn-invisible datepicker-selected-text\"> [" + this.dictionary.selectedText + "]</span>");
				}
			}
		}catch(e){

		}
	},
		
	addSelectedDateToField : function (fieldid, year, month, day, format){
		$("#" + fieldid).attr("value", this.formatDate(year, month, day, format));
	},

	toggle : function (fieldid, containerid){
		var toggle = $("#" + containerid + "-toggle");
		toggle.toggleClass("picker-toggle-hidden picker-toggle-visible");
		var container = $('#' + containerid);
		
		container.unbind("focusout.calendar");
		container.unbind("focusin.calendar");
		
		if(toggle.hasClass("picker-toggle-visible")){
			//Hide all other calendars
			datepicker.hideAll(fieldid);
			
			//Enable the tabbing of all the links when calendar is visible
			container.find("a").attr("tabindex", 0);
			container.slideDown('fast', function(){datepicker.ieFix($(this))});
			container.attr("aria-hidden","false");
			toggle.children("a").children("span").text(datepicker.dictionary.hideText);

            $('.cal-prevmonth a').focus();
		}else{
			//Disable the tabbing of all the links when calendar is hidden
			container.find("a").attr("tabindex", -1);
			container.slideUp('fast', function(){datepicker.ieFix($(this))});
			calendar.hideGoToForm(containerid);
			var fieldLabel = $("label[for='" + fieldid + "']").text()
			toggle.children("a").children("span").text(datepicker.dictionary.showText + fieldLabel);
			container.attr("aria-hidden","true");
			
			$("#" + fieldid).focus();
		}

		
	},
	
	
	hideAll : function(exception){
		$(".date-picker").each(function(index, value){
			if($(this).attr("id") != exception){
				var fieldid = $(this).attr("id")
				var containerid =  fieldid+ '-picker';
				var container = $("#" + containerid);
				var toggle = $("#" + containerid + "-toggle");
				
				//Disable the tabbing of all the links when calendar is hidden
				container.find("a").attr("tabindex", -1);
				container.slideUp('fast');
				container.attr("aria-hidden","true");
				calendar.hideGoToForm(containerid);
				var fieldLabel = $("label[for='" + fieldid + "']").text()
				toggle.children("a").children("span").text(datepicker.dictionary.showText + fieldLabel);
				toggle.removeClass("picker-toggle-visible");
				toggle.addClass("picker-toggle-hidden");
			}
		});
	},
	
	ieFix : function (container){
		//IE Fix for when the page is too small to display the calendar
		if ( /MSIE 7/.test(navigator.userAgent) ) {
			var calendarBottom = container.height() + container.offset().top - $("#cn-centre-col-inner").offset().top + 50;
			if ($("#cn-centre-col-inner").height() >= calendarBottom) 
				$("#cn-centre-col-inner").css("min-height", "");
			else if ($("#cn-centre-col-inner").height() < calendarBottom) 
				$("#cn-centre-col-inner").css("min-height", calendarBottom);
		} else if (/MSIE ((5\.5)|6)/.test(navigator.userAgent)) {
			var calendarBottom = container.height() + container.offset().top - $("#cn-centre-col-inner").offset().top; + 50
			if ($("#cn-centre-col-inner").height() >= calendarBottom) 
				$("#cn-centre-col-inner").css("height", "");
			else if ($("#cn-centre-col-inner").height() < calendarBottom) 
				$("#cn-centre-col-inner").css("height", calendarBottom);
		}
	},
		
	formatDate : function (year, month, day, format){
		output = format;
		output = output.replace("DD", calendar.strPad(day, 2, '0'));
		output = output.replace("D", day);
		output = output.replace("MM", calendar.strPad(month, 2, '0'));
		output = output.replace("M", month);
		output = output.replace("YYYY", year);
		output = output.replace("YY", year.toString().substr(2,2));
		
		return output
	}
}

// Add Style Sheet Support for this plug-in
Utils.addCSSSupportFile(Utils.getSupportPath() + "/datepicker/styles.css");

// Loads a library that the plugin depends on from the lib folder
PE.load('calendar/wet-boew.calendar.js');
PE.load('xregexp.js');

// Init Call at Runtime
$("document").ready(function(){   datepicker.init(); });
