/*!
 * Multimedia player v1.3 / Lecteur multimédia v1.3
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */
$.timedText = function(url, containerId){
	return new $.timedText.instance(url, containerId);
};
	
$.timedText.instance = function (url, containerId){
	this.container = $("#" + containerId);
	this.complete = false;
	
	var data =null;
	var qIndex = url.indexOf("?")
	if (qIndex > -1){
		querystring = url.substr(qIndex+1).split('&');
		url = url.substr(0, qIndex);
		   
		data={}
		$.each(querystring, function(x,y){
			var temp = y.split('=');
			data[temp[0]] = temp[1];
		});
 
	 }
	 
	 var settings = {
		async: false,
		global:false,
		url: url,
		context:this,
		data:data,
		dataType: "text",
		cache: false,
		success: this.load
	 };
	 $.ajax(settings);
}
	
$.extend($.timedText.instance.prototype, {
	timedTextArea : null,
	captions : null,
	 
	load: function(data, textStatus, XMLHttpRequest){
		this.captions = new Array();
	  
		var xml
		var filter
		var text
	  
		if (XMLHttpRequest.responseXML.documentElement == undefined){
			xml=$(XMLHttpRequest.responseText);
			text = xml.find('div, p, span').children().filter(":not(:empty)");
		}else{
			xml = $(XMLHttpRequest.responseXML)
			text = xml.find('body').find('*').children().filter(":not(:empty)");
		}
	  
		var _this = this;
		var idCount=0;
		//Find the text and start value of each caption
		text.each(function(index){
			var caption = new Array();
			var start = 0;
			var end = 0;
	   
			var opjCaption = $(this);
	   
			//Create the caption structure
	   
			//Get the text of the caption
			var c = opjCaption.clone();
			c.children().empty();
			caption[0] = $("<root />").html(c.contents()).html();

			//Go through every parents and
			var parents = $(this).add(opjCaption.parents(':not(body, tt)'))
			parents.each(function(index){
				//Assign an id if none is present. (Makes nesting easier)
				if($(this).attr("xml:id") == undefined){
					$(this).attr("xml:id", "c" + (idCount++))
				}
		
				var node =  this.nodeName.toLowerCase() + "[";
				node += "id=" + $(this).attr("xml:id");
				node += "]";
				caption[index+1] = node;
			});
	   
			//Get the start time of the caption
			parents.filter('[begin]').each(function(){
				var s = parseFloat($(this).attr("begin"));
				if (s > start){start = s;}
			});
	   
			//Get the end time of the caption
			parents.each(function(){
				if ($(this).attr("end") != undefined && $(this).attr("dur") == undefined){
					var e = parseFloat($(this).attr("end"));
					if (e<end || end == 0){
						end = e;
					}
				}else if ($(this).attr("dur") != undefined && $(this).attr("end") == undefined){
					var e = parseFloat($(this).attr("dur")) + start;
					if (e<end || end == 0){
						end = e;
					}
				}else if ($(this).attr("end") != undefined  && $(this).attr("dur") != undefined ){
					var e1 = parseFloat($(this).attr("end"));
					var e2 = parseFloat($(this).attr("dur")) + start;
					var e = (e1<e2)? e1 : e2;
		 
					if (e<end || end == 0){
						end = e;
					}
				}
			});
			_this.captions[index] = [caption, start, end];
		});
   
	 },
	 
	 show : function(){
		timedTextArea = $('<div class="timed-text"></div>')
		this.container.append(timedTextArea);
	 },
	 
	 update : function(seconds){
		timedTextArea.empty();
		for(c=0; c<this.captions.length; c++){
			var caption = this.captions[c]
			if (seconds >= caption[1] && seconds <= caption[2]){
				var parent = timedTextArea;
				for(p=1;p<caption[0].length;p++){
					var e = caption[0][p];
					var tag = e.substr(0,e.indexOf('['))
					var att = e.substr(e.indexOf('[') + 1, e.indexOf(']') - e.indexOf('[') - 1).split('&')
		 
					var obj = $(tag + "#" + att[0].split('=')[1]);
					if(obj.length < 1){
						obj = $("<" + tag + "></" + tag + ">")
						for(attpair=0; attpair<att.length;attpair++){
							var a = att[attpair].split('=');
							obj.attr(a[0], a[1]);
						}
						parent.append(obj);
					}
		 
					parent = obj;
				}
				parent.append(caption[0][0])
			}
		}
	}
});
