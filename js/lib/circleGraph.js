/*!
 * Charts and graphs support v2.0.1 / Soutien des graphiques v2.0.1
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */
/**
 * Chart plugin v2.0.1
 * 
 * @author: Pierre Dubois
 */
charts.circleGraph = {
			
			height: undefined, // Height of the draw area
			width: undefined, // Width of the draw area
			offset: { // with the Offset it's possible to determine the drawing area
				top: undefined, 
				right: undefined,
				bottom: undefined,
				left: undefined
			},
			
			sizeMode: 'minimal', // 'maximal' => would take all the available width space to draw, 'minimal' => Would just reserve the minimal space requirement to draw
			
			maxWidth: 600,
			
			minWidth: 150, // That is the minimal width for first level
			strokeWidth: 3, // For each pie quarter
			minLevelWidth: 25, // That is the value of the radius
			levelPadding: 10, // Padding to add between each level
			
			nbPieByRow: undefined, // Set something to force the number of pie by row
			
			props: {
				minWidth: 100,
				minLevelWidth: 50
			},
			
			
			captionFontSize: 20,
			fontSize:10,
			
		
			piePadding: 10,
			graphPadding: 10,
			
			
			// Designer Props
			pieByRow: undefined,
			minPieWidth: undefined,
			
			
			// Graphic itself
			graphTitle: undefined,
			legendContainer: undefined,
			paperContainer: undefined,
			paper: undefined,
			paperDOM: undefined,
			
			
			// Series Information
			series:{},
			options: {},
			
			// Legend Info
			legendContainer: undefined,

			
			init: function(series, options){
				
				charts.circleGraph.width = undefined; // Reset to the default value [That fix an issue for the second Pie chart generated]
				charts.circleGraph.minWidth = 150; // Reset to the default value [That fix an issue for the second Pie chart generated]
				charts.circleGraph.minLevelWidth = 25; // Reset to the default value [That fix an issue for the second Pie chart generated]
				charts.circleGraph.levelPadding = 10; // Reset to the default value [That fix an issue for the second Pie chart generated]
				
				
				charts.circleGraph.series = series;
				charts.circleGraph.options = options;
				charts.circleGraph.width = charts.circleGraph.options.width;
				
				
				
				var pieByRow = 1; // For the time being use 1 pie by Row (in the future try to calculate how many pie can be by row)
				charts.circleGraph.pieByRow = pieByRow;
				
				var nbExtraLevel = charts.circleGraph.series.nbColLevel-1;
				
				// Adapt the sector with based on the available space,
				
				var XtraLevelWidth = (nbExtraLevel * ((charts.circleGraph.minLevelWidth*2) + (charts.circleGraph.levelPadding * 2)) + (nbExtraLevel * (charts.circleGraph.strokeWidth * 2)));
				var centerWidth = charts.circleGraph.minWidth + (charts.circleGraph.levelPadding*2) + (charts.circleGraph.strokeWidth *2);
				
				var minWidth = XtraLevelWidth + centerWidth;
				
				// console.log('charts.circleGraph.width:' + charts.circleGraph.width + ' minWidth:' + minWidth + ' XtraLevelWidth:' + XtraLevelWidth + ' centerWidth:' + centerWidth);

				
				if(!charts.circleGraph.width || minWidth > charts.circleGraph.width){
					// Set the minimal width for the graphic
					charts.circleGraph.width = minWidth;
				} else {
					// TODO: Add the choice of strategy of growing [like ExtraLevel only, keep a specific ratio, stop at a maximum grow, ....
					
					// Adap the sector width proportionally

					var centerRatio = charts.circleGraph.minWidth / minWidth;
					var XtraLevelRatio = charts.circleGraph.minLevelWidth / minWidth;
					
					charts.circleGraph.minWidth = Math.floor(centerRatio * (charts.circleGraph.width));
					charts.circleGraph.minLevelWidth = Math.floor(XtraLevelRatio * (charts.circleGraph.width));
					
					
				}
				
				// Calculate the height
				charts.circleGraph.height = charts.circleGraph.width;
				/*
				// Note: Each pie are in a separate Paper
				// console.log(charts.circleGraph);
				if(!charts.circleGraph.height || charts.circleGraph.height < ((charts.circleGraph.width + (charts.circleGraph.levelPadding*2) + charts.circleGraph.options.font.height) * charts.circleGraph.series.series.length) / charts.circleGraph.series.series.length){
					
					// Set the minimal height
					charts.circleGraph.height = ((charts.circleGraph.width + charts.circleGraph.levelPadding + charts.circleGraph.options.font.height) * charts.circleGraph.series.series.length) / charts.circleGraph.series.series.length + charts.circleGraph.levelPadding;
					
				}
				*/
				
				//
				// Log the caption for each series
				//
				
				

				/*
				
				
				charts.circleGraph.minWidth = charts.circleGraph.options.width;
				
				// Get Number of Pie to be written (Each serie are a Pie)
				var NbPie = charts.circleGraph.series.series.length;
				
				
				
				var minPieWidth = (NbPie * charts.circleGraph.props.minWidth) + ((charts.circleGraph.series.nbColLevel - 1) * charts.circleGraph.props.minLevelWidth);
				
				var realMinSize = charts.circleGraph.minWidth + (2* charts.circleGraph.graphPadding);
				
				
				var pieOverPieces = realMinSize % (minPieWidth + (2*charts.circleGraph.graphPadding));
				
				var pieByRow = (charts.circleGraph.minWidth - pieOverPieces) / minPieWidth;
				
				
				// Minimum Width Size: pieByRow * minPieWidth + (2* charts.circleGraph.graphPadding) 
				if(pieByRow == 0){
					// Force the change of the width for the minimum requirement
					charts.circleGraph.width = minPieWidth + (2* charts.circleGraph.graphPadding); 
				} else {
					// Check what kind of strategy is used, like take full width or keep it as minimal space
					
					if(charts.circleGraph.sizeMode == 'minimal'){
						charts.circleGraph.width = (pieByRow * minPieWidth) + (2* charts.circleGraph.graphPadding);
						charts.circleGraph.height = Math.floor(NbPie / pieByRow * minPieWidth + (2* charts.circleGraph.graphPadding));
					} else if(charts.circleGraph.sizeMode == 'maximal'){
						// TO BE IMPLEMENTED IN THE FUTURE
					} else {
						// TO BE IMPLEMENTED IN THE FUTURE
					}

					
				}
				
				
				charts.circleGraph.pieByRow = pieByRow;
				charts.circleGraph.minPieWidth = minPieWidth;
				
				// console.log('minPieWidth: ' + minPieWidth + ' pieByRow: ' + pieByRow + ' charts.circleGraph.options.width:' + charts.circleGraph.options.width);
				
				*/
				
			},
			
			generateGraph: function(paperContainer, paper){
				
				charts.circleGraph.paperContainer = paperContainer;
				charts.circleGraph.paper = paper;
				
				
				
				
				
				
				
				// For each series,
				//	- Get his center position
				//	- For each cell calculate their percentage
				//	- Draw the first level
				
				var currPosition = 1;
				var currRowPos = 1;
				var currColPos = 0;
				var currRowPos2 = 0;
				// console.log(charts.circleGraph.series);
				
				
				var chartsLabels = []; 
				
				var legendGenerated = false;
				
				$.each(charts.circleGraph.series.series, function(){
					
					legendGenerated = false;
					
					var legendList = $('<ul>').appendTo(($.isArray(charts.circleGraph.paperContainer) ?  $(charts.circleGraph.paperContainer[currRowPos -1]) : charts.circleGraph.paperContainer));
				
					charts.circleGraph.legendContainer = legendList;

					// var currentPaper = charts.circleGraph.paper[charts.circleGraph.series.series.length - currRowPos];
					var currentPaper = ($.isArray(charts.circleGraph.paper) ? charts.circleGraph.paper[currRowPos -1] : charts.circleGraph.paper);
					
					currRowPos ++;
					if(currPosition >= (charts.circleGraph.pieByRow  * (currRowPos + 1))){
						// currRowPos ++;
						currColPos = 0;
					}
					
/*
					// Write the pie label (That is the Series Header)
					var serieTitleX = (charts.circleGraph.width/2) + (charts.circleGraph.width * currColPos);
					var serieTitleY = ((charts.circleGraph.width + charts.circleGraph.levelPadding + charts.circleGraph.options.font.height) * currRowPos2) + (charts.circleGraph.options.font.height/2); // + charts.circleGraph.levelPadding;

					var serieTxt = currentPaper.text(serieTitleX, serieTitleY, this.header.rawValue).attr({fill: '#000', stroke: "none", "font-size": charts.circleGraph.captionFontSize, "text-anchor": "middle"});					
					
					*/
					
					// Calcule the percent based on their range
					var total = 0;
					
					var InvalidSerie = false;
					
					// Get Top and Bottom Serie value
					$.each(this.cell, function(){
						if(this.value < 0){
							InvalidSerie = true;
						}
						total += this.value;
					});
					
					if(InvalidSerie){
						alert('This series are invalid, only positive number are acceptable');
					}
					
					var cx = (charts.circleGraph.width/2) + (charts.circleGraph.width * currColPos),
						cy = (charts.circleGraph.width/2) + (charts.circleGraph.width * currColPos);

					/*
					var cx = (charts.circleGraph.width/2) + (charts.circleGraph.width * currColPos),
						cy = (charts.circleGraph.width/2) + ((charts.circleGraph.width + charts.circleGraph.levelPadding + charts.circleGraph.options.font.height) * currRowPos2);
					*/
					
					// console.log('cx:' + cx + ' cy:' + cy);
						
					var	r = undefined,
						stroke = '#000';
					
					var start = 0,
						angle = 90,// 0,
						rad = Math.PI / 180,
						lastEndAngle = undefined,
						ms = 500; // animation time
					
			
					function getRBottom(level, height){
						var r1 = (charts.circleGraph.minWidth/2) + // CenterPie
								charts.circleGraph.strokeWidth + // CenterPie Stroke
								charts.circleGraph.levelPadding + // CenterPie Padding
								(charts.circleGraph.series.nbColLevel - level - height -1 ) // Number of under existing Level
								* (charts.circleGraph.levelPadding + (charts.circleGraph.strokeWidth * 2) + charts.circleGraph.minLevelWidth) ;
						return r1;
					}
					
					function getRTop(level, height){
						return (getRBottom(level, height) + charts.circleGraph.minLevelWidth + charts.circleGraph.strokeWidth);
					}
					
					
					var CurrentLevel = charts.circleGraph.series.nbColLevel;
					
					var GroupingSeries = [];
										
					// For each cell get the Total value base on SerieRange
					$.each(this.cell, function(){
						
						// Get the Cell Heading
						var cellColPos = this.colPos;
						
						var currentHeading = '';
						var HeadingLevel = CurrentLevel;
						
						var SuperiorHeading = []; // List containing the appropriate Path for the supperior existing heading
						
						// Current Heading
						$.each(charts.circleGraph.series.heading, function(){
							
							// Check if the Heading correspond with the colPos and the rowPos
							if(this.colPos < cellColPos && cellColPos <= (this.colPos + this.width)) {
								
								// Get the information for the current heading
								if(this.level <= CurrentLevel && CurrentLevel <= (this.level + this.height)){
									currentHeading = this.header;
									HeadingLevel = this.level;
								} else { // if(this.level < CurrentLevel) {
									// Compute this series
									
									var serieComputed = {
										level: this.level,
										height: this.height,
										id: this.id,
										header: this.header,
										param: this.param 
									};
									SuperiorHeading.push(serieComputed);
								}

							}
						});
						

						//
						// Determine the Path for the sector
						//
						
						var path = [];
						// Add the center Pos
						path.push("M", cx, cy);
						
						// Get the pie Angle
						var angleplus = 360 * this.value/total;
						
						// Check if the pie quarter need to be expend in some level
						r = (charts.circleGraph.minWidth/2);
						
						if(HeadingLevel < (CurrentLevel - 1)){
							//charts.circleGraph.levelPadding
							r += ((charts.circleGraph.minLevelWidth + charts.circleGraph.levelPadding + (charts.circleGraph.strokeWidth * 2)) * 
								((CurrentLevel-1)-HeadingLevel));
						}
						
						// Calculate the pos of the first segment
						var startAngle = angle,
							x1 = cx + r * Math.cos(-startAngle * rad),
							y1 = cy + r * Math.sin(-startAngle * rad);
						
						// Draw the line
						path.push("L", x1, y1);
						
						// Calculate the pos of the second segment
						var endAngle = angle + angleplus,
							x2 = cx + r * Math.cos(-endAngle * rad),
							y2 = cy + r * Math.sin(-endAngle * rad);
						
						lastEndAngle = endAngle;
						
						// Draw the Curve (Elipsis)
						path.push("A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2);
						
						// Close the path
						path.push("z");
						
						
						$.each(SuperiorHeading, function(){
							// This cell have a supperior heading
							var supHeading = this;
							supHeading.still = false; // Just a flag to know if is computed or not
							
							var AddToIt = true;
							// Check if can be computed
							$.each(GroupingSeries, function(){
								
								if(this.id == supHeading.id){
									// Compute the data, add the new point to the path
									
									supHeading.still = true;
									this.still = true;
									AddToIt = false;
									
									return false;
								}
								
								
							});
							

								
							if(!this.topX1){
							
								var r2 = getRBottom(this.level, this.height),
									r1 = getRTop(this.level, this.height);


								
								// Set the starting point
								this.topX1 = cx + r1 * Math.cos(-startAngle * rad);
								this.topY1 = cy + r1 * Math.sin(-startAngle * rad);
								
								this.bottomX1 = cx + r2 * Math.cos(-startAngle * rad);
								this.bottomY1 = cy + r2 * Math.sin(-startAngle * rad);
								
								// Add the radius
								this.r1 = r1;
								this.r2 = r2;
								
								this.startAngle = startAngle;
								
								this.bcolor = Raphael.hsb(start, 1, 1);
								
								this.color = Raphael.hsb(start, .75, 1);
								this.start = start;
								start += .05;
								
							}
							
							if(AddToIt){
								// Add it to the GroupingSeries
								this.still = true;
								GroupingSeries.push(this);
							}

						});
						
						$.each(GroupingSeries, function(){
							// There are currently existing superior heading
							
							
							// console.log(this.endAngle);
							
							if(!this.still  && !this.ignoreMe){
								// console.log(this);
								// Draw this group
								var r2 = getRBottom(this.level, this.height),
									r1 = getRTop(this.level, this.height);

								var topX2 = cx + r1 * Math.cos(-startAngle * rad);
								var topY2 = cy + r1 * Math.sin(-startAngle * rad);
								
								var bottomX2 = cx + r2 * Math.cos(-startAngle * rad);
								var bottomY2 = cy + r2 * Math.sin(-startAngle * rad);
								
								// console.log('Start r: ' + this.r1 + ', ' + this.r2 + '  End r:' + r1 + ', ' + r2 + ' Header:'  + this.header);
								
								var p = [];
								p.push("M", this.topX1, this.topY1);
								
								p.push("A", r1, r1, 0, +(startAngle - this.startAngle > 180), 0, Math.ceil(topX2), Math.ceil(topY2));
								
								p.push("L", Math.ceil(bottomX2), Math.ceil(bottomY2));
								
								p.push("A", r2, r2, 0, +(startAngle - this.startAngle > 180), 1, Math.ceil(this.bottomX1), Math.ceil(this.bottomY1));
								
								p.push("z");
								// console.log('p:' + p);
								var percent = (startAngle - this.startAngle) / 360 * 100;
								percent = Math.ceil(percent * 1000);
								percent = Math.floor(percent/1000);
								
								
								var fillColor = "90-" + this.bcolor + "-" + this.color;
								if(this.param.color){
									fillColor = colourNameToHex(this.param.color);
								}

								if(!legendGenerated){
									var legendItem = $('<li></li>').appendTo($(legendList));
									var legendPaperEle = $('<span style="margin-right:7px;"></span>').appendTo($(legendItem));
									var legendPaper = Raphael($(legendPaperEle).get(0), charts.circleGraph.options.font.size, charts.circleGraph.options.font.size);
									var legendRect = legendPaper.rect(2,2, charts.circleGraph.options.font.size - (2*2) + (2/2), charts.circleGraph.options.font.size - (2*2) + (2/2));
									
									$(legendItem).append(this.header);
									legendRect.attr("fill", fillColor);
								}
								
								var PaperPath = currentPaper.path(p).attr({fill: fillColor, stroke: stroke, "stroke-width": 3, "title": this.header + ' (' + percent + '%)'});
								
								
								
								// That the following was replaced by the Tooltip functionality
								var popangle = ((startAngle - this.startAngle)/2) + this.startAngle;

								// Old Caption : this.header + ' (' + percent + '%)'
								var txt = currentPaper.text(cx + (r1 * Math.cos(-popangle * rad)), cy + (r1 * Math.sin(-popangle * rad)), percent + '%').attr({fill: '#000', stroke: "none", opacity: 1, "font-size": charts.circleGraph.fontSize});
								
								var txtBorder = txt.getBBox();
								
								var txtBackGround = currentPaper.rect(txtBorder.x - 10, txtBorder.y - 10, txtBorder.width+ (2*10), txtBorder.height + (2*10)).attr({fill: '#FFF', stroke: "black", "stroke-width": "1", opacity: 1});
								
								chartsLabels.push({txt: txt, bg: txtBackGround});
								
								var startColor = this.start;
								var fillOverColor = Raphael.hsb(startColor, 1, .3);
								if(this.param.overcolor){
									fillOverColor = colourNameToHex(this.param.overcolor);
								}
									

								PaperPath.mouseover(function(){
									PaperPath.stop().attr({fill: fillOverColor});
									// PaperPath.stop().attr({fill: Raphael.hsb(startColor, 1, .3)});
									txtBackGround.stop().attr({"stroke-width": "3"});
									//PaperPath.stop().animate({opacity: 0.3}, ms, "linear");
								}).mouseout(function () {
									PaperPath.stop().attr({fill: fillColor});
									// PaperPath.stop().attr({fill: Raphael.hsb(startColor, 1, 1)});
									txtBackGround.stop().attr({"stroke-width": "1"});
									//PaperPath.stop().animate({opacity: 1}, ms);
								});
								txtBackGround.mouseover(function(){
									PaperPath.stop().attr({fill: fillOverColor});
									// PaperPath.stop().attr({fill: Raphael.hsb(startColor, 1, .3)});
									txtBackGround.stop().attr({"stroke-width": "3"});
								}).mouseout(function () {
									PaperPath.stop().attr({fill: fillColor});
									// PaperPath.stop().attr({fill: Raphael.hsb(startColor, 1, 1)});
									txtBackGround.stop().attr({"stroke-width": "1"});
								});
								txt.mouseover(function(){
									PaperPath.stop().attr({fill: fillOverColor});
									// PaperPath.stop().attr({fill: Raphael.hsb(startColor, 1, .3)});
									txtBackGround.stop().attr({"stroke-width": "3"});
								}).mouseout(function () {
									PaperPath.stop().attr({fill: fillColor});
									// PaperPath.stop().attr({fill: Raphael.hsb(startColor, 1, 1)});
									txtBackGround.stop().attr({"stroke-width": "1"});
								});
								
								
								
								this.ignoreMe = true;
								
							} 
							
							this.still = false;
							
						});
						
						
						
						
						
						
						// Add the new path
						var bcolor = Raphael.hsb(start, 1, 1),
							color = Raphael.hsb(start, .75, 1);
						var percent = (endAngle - startAngle) / 360 * 100;
						percent = Math.ceil(percent * 1000);
						percent = Math.floor(percent/1000);

						var fillColor = "90-" + bcolor + "-" + color;
						if(this.param.color){
							fillColor = colourNameToHex(this.param.color);
						}
						// console.log(this);
						
						// USE this.colPos if defined
						// and get charts.circleGraph.series.ColHeading for the default color, and to build the legend.
						
						
						var PaperPath = currentPaper.path(path).attr({fill: fillColor, stroke: stroke, "stroke-width": 3, "title": currentHeading + ' (' + percent + '%)'});
						
						if(!legendGenerated){
							// Create the legend
							var legendItem = $('<li></li>').appendTo($(legendList));
							var legendPaperEle = $('<span style="margin-right:7px;"></span>').appendTo($(legendItem));
							var legendPaper = Raphael($(legendPaperEle).get(0), charts.circleGraph.options.font.size, charts.circleGraph.options.font.size);
							var legendRect = legendPaper.rect(2,2, charts.circleGraph.options.font.size - (2*2) + (2/2), charts.circleGraph.options.font.size - (2*2) + (2/2));
							
							$(legendItem).append(currentHeading);
							legendRect.attr("fill", fillColor);
						}
						// var currentHeading = '';
						// var HeadingLevel = CurrentLevel;
						
						
						
						// Replaced by the Tooltip functionality
						
						var popangle = angle + (angleplus/2);
						// old caption : currentHeading + ' (' + percent + '%)'
						var txt = currentPaper.text(cx + (r * Math.cos(-popangle * rad)), cy + (r * Math.sin(-popangle * rad)), percent + '%').attr({fill: '#000', stroke: "none", opacity: 1, "font-size": charts.circleGraph.fontSize});
						
						var txtBorder = txt.getBBox();
						
						var txtBackGround = currentPaper.rect(txtBorder.x - 10, txtBorder.y - 10, txtBorder.width+ (2*10), txtBorder.height + (2*10)).attr({fill: '#FFF', stroke: "black", "stroke-width": "1", opacity: 1});
						
						chartsLabels.push({txt: txt, bg: txtBackGround});
						
						var startColor = start;
						var fillOverColor = Raphael.hsb(startColor, 1, .3);
						if(this.param.overcolor){
							fillOverColor = colourNameToHex(this.param.overcolor);
						}
						PaperPath.mouseover(function(){
							PaperPath.stop().attr({fill: fillOverColor});
							// PaperPath.stop().attr({fill: Raphael.hsb(startColor, 1, .3)});
							txtBackGround.stop().attr({"stroke-width": "3"});
							//PaperPath.stop().animate({opacity: 0.3}, ms, "linear");
						}).mouseout(function () {
							PaperPath.stop().attr({fill: fillColor});
							// PaperPath.stop().attr({fill: Raphael.hsb(startColor, 1, 1)});
							txtBackGround.stop().attr({"stroke-width": "1"});
							//PaperPath.stop().animate({opacity: 1}, ms);
						});
						txtBackGround.mouseover(function(){
							PaperPath.stop().attr({fill: fillOverColor});
							// PaperPath.stop().attr({fill: Raphael.hsb(startColor, 1, .3)});
							txtBackGround.stop().attr({"stroke-width": "3"});
						}).mouseout(function () {
							PaperPath.stop().attr({fill: fillColor});
							// PaperPath.stop().attr({fill: Raphael.hsb(startColor, 1, 1)});
							txtBackGround.stop().attr({"stroke-width": "1"});
						});
						txt.mouseover(function(){
							PaperPath.stop().attr({fill: fillOverColor});
							// PaperPath.stop().attr({fill: Raphael.hsb(startColor, 1, .3)});
							txtBackGround.stop().attr({"stroke-width": "3"});
						}).mouseout(function () {
							PaperPath.stop().attr({fill: fillColor});
							// PaperPath.stop().attr({fill: Raphael.hsb(startColor, 1, 1)});
							txtBackGround.stop().attr({"stroke-width": "1"});
						});
						
						
						
						
						
						angle += angleplus;
						start += .1;
						
						currPosition++;
						currColPos ++;
					});
					
					// Close any pending grouping
					$.each(GroupingSeries, function(){
						// There are currently existing superior heading
						
						
						// console.log(this.endAngle);
						
						if(!this.ignoreMe){
							// Draw this group
							var r2 = getRBottom(this.level, this.height),
								r1 = getRTop(this.level, this.height);

							
							var topX2 = cx + r1 * Math.cos(-lastEndAngle * rad);
							var topY2 = cy + r1 * Math.sin(-lastEndAngle * rad);
							
							var bottomX2 = cx + r2 * Math.cos(-lastEndAngle * rad);
							var bottomY2 = cy + r2 * Math.sin(-lastEndAngle * rad);
							
							var p = [];
							p.push("M", this.topX1, this.topY1);
							
							p.push("A", r1, r1, 0, +(lastEndAngle - this.startAngle > 180), 0, Math.ceil(topX2), Math.ceil(topY2));
							
							p.push("L", Math.ceil(bottomX2), Math.ceil(bottomY2));
							
							p.push("A", r2, r2, 0, +(lastEndAngle - this.startAngle > 180), 1, Math.ceil(this.bottomX1), Math.ceil(this.bottomY1));
							
							p.push("z");
							var percent = (lastEndAngle - this.startAngle) / 360 * 100;
							percent = Math.ceil(percent * 1000);
							percent = Math.floor(percent/1000);
							
							var fillColor = "90-" + this.bcolor + "-" + this.color;
							if(this.param.color){
								fillColor = colourNameToHex(this.param.color);
							}
							
							if(!legendGenerated){
								var legendItem = $('<li></li>').appendTo($(legendList));
								var legendPaperEle = $('<span style="margin-right:7px;"></span>').appendTo($(legendItem));
								var legendPaper = Raphael($(legendPaperEle).get(0), charts.circleGraph.options.font.size, charts.circleGraph.options.font.size);
								var legendRect = legendPaper.rect(2,2, charts.circleGraph.options.font.size - (2*2) + (2/2), charts.circleGraph.options.font.size - (2*2) + (2/2));
								
								$(legendItem).append(this.header);
								legendRect.attr("fill", fillColor);
							}
							
							var PaperPath = currentPaper.path(p).attr({fill: fillColor, stroke: stroke, "stroke-width": 3, "title": this.header + ' (' + percent + '%)'});
							
							
							
							// Replaced by the tooltip functionality
							var popangle = ((lastEndAngle - this.startAngle)/2) + this.startAngle;
							
								
							// old caption: this.header + ' (' + percent + '%)'
							var txt = currentPaper.text(cx + (r1 * Math.cos(-popangle * rad)), cy + (r1 * Math.sin(-popangle * rad)), percent + '%').attr({fill: '#000', stroke: "none", opacity: 1, "font-size": charts.circleGraph.fontSize});
							
							var txtBorder = txt.getBBox();
							
							var txtBackGround = currentPaper.rect(txtBorder.x - 10, txtBorder.y - 10, txtBorder.width+ (2*10), txtBorder.height + (2*10)).attr({fill: '#FFF', stroke: "black", "stroke-width": "1", opacity: 1});
							
							chartsLabels.push({txt: txt, bg: txtBackGround});
							
							var startColor = this.start;
							var fillOverColor = Raphael.hsb(startColor, 1, .3);
							if(this.param.overcolor){
								fillOverColor = colourNameToHex(this.param.overcolor);
							}
							PaperPath.mouseover(function(){
								PaperPath.stop().attr({fill: fillOverColor});
								// PaperPath.stop().attr({fill: Raphael.hsb(startColor, 1, .3)});
								txtBackGround.stop().attr({"stroke-width": "3"});
								//PaperPath.stop().animate({opacity: 0.3}, ms, "linear");
							}).mouseout(function () {
								PaperPath.stop().attr({fill: fillColor});
								// PaperPath.stop().attr({fill: Raphael.hsb(startColor, 1, 1)});
								txtBackGround.stop().attr({"stroke-width": "1"});
								//PaperPath.stop().animate({opacity: 1}, ms);
							});
							txtBackGround.mouseover(function(){
								PaperPath.stop().attr({fill: fillOverColor});
								// PaperPath.stop().attr({fill: Raphael.hsb(startColor, 1, .3)});
								txtBackGround.stop().attr({"stroke-width": "3"});
							}).mouseout(function () {
								PaperPath.stop().attr({fill: fillColor});
								// PaperPath.stop().attr({fill: Raphael.hsb(startColor, 1, 1)});
								txtBackGround.stop().attr({"stroke-width": "1"});
							});
							txt.mouseover(function(){
								PaperPath.stop().attr({fill: fillOverColor});
								// PaperPath.stop().attr({fill: Raphael.hsb(startColor, 1, .3)});
								txtBackGround.stop().attr({"stroke-width": "3"});
							}).mouseout(function () {
								PaperPath.stop().attr({fill: fillColor});
								// PaperPath.stop().attr({fill: Raphael.hsb(startColor, 1, 1)});
								txtBackGround.stop().attr({"stroke-width": "1"});
							});
							
							this.ignoreMe = true;
							
						} 
						
					});
					
					
				
					// Create a hidden rect to get the lastelement
					var lastPathObj = currentPaper.rect(0, 0, 1, 1).attr({opacity: 0});
					
					$.each(chartsLabels, function(){
						this.txt.insertAfter(lastPathObj);
						this.bg.insertBefore(this.txt);
						
					});
					chartsLabels = [];
					
					
					legendGenerated = true;
					
				});	

				
			}
		};
		
		
