/*!
 * Charts and graphs support v2.0 / Soutien des graphiques v2.0
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */
/**
 * Chart plugin v2.0
 * 
 * @author: Pierre Dubois
 */
charts.graph2dAxis = {
			
			// Drawing Property
			drawDirection: 'x',
			height: undefined, // Height of the draw area
			width: undefined, // Width of the draw area
			offset: { // with the Offset it's possible to determine the drawing area
				top: undefined, 
				right: undefined,
				bottom: undefined,
				left: undefined
			},
			cuttingOffset: undefined,
			xAxisOffset: undefined, // Exact Y Position of the x Axis [old: xAxisYPos]
			cuttingPosPaper: undefined, // [old: cutingPosPaper]
			
			// Informative Property for drawing
			NbColumnHeading: 0, // Number of Heading without any grouping
			NbColumnHeaderLevel: undefined, // Number of Grouping level
			zeroPos: undefined, // Position [in labeling position] of the 0 axes
			cuttingPos: undefined, // Position [in labeling position] of the cutting axes
			incrementation: undefined, // Incrementation step for each labeling position [old: interval]
			nbStep: undefined, //  Number of Incrementation step [TODO: including the 0 axes and the cutting axes if apply]
			
			
			// Layout Information
			layout: {
				headingMinSize: undefined,
				nbColHeading: undefined
			},
			
			// Graphic Value
			top:undefined,
			bottom:undefined,
			
			
			// Graphic itself
			graphTitle: undefined,
			legendContainer: undefined,
			paperContainer: undefined,
			paper: undefined,
			paperDOM: undefined,
			
			
			// Series Information
			series:{},
			options: {},

			setNbColumnHeading: function(){
				
				// Adapted for Horizontal Drawing
				
				charts.graph2dAxis.NbColumnHeading = 0;
				charts.graph2dAxis.NbColumnHeaderLevel = 0;
				
				var headingSize = undefined;
				var headingWidth = [];
				
				
				// Count the number of unique column
				$.each(charts.graph2dAxis.series.heading, function(){
					if(!this.isGroup && (this.colPos + this.width) > charts.graph2dAxis.series.nbRowLevel){
						charts.graph2dAxis.NbColumnHeading ++;
						if(!headingWidth[this.level] || (this.header.length * charts.graph2dAxis.options.font.width) > (headingWidth[this.level] * charts.graph2dAxis.options.font.width)){
							headingWidth[this.level] = this.header.length * charts.graph2dAxis.options.font.width;
						}
					}
					if(this.level > charts.graph2dAxis.NbColumnHeaderLevel || charts.graph2dAxis.NbColumnHeaderLevel == undefined){
						charts.graph2dAxis.NbColumnHeaderLevel = this.level;
					}
				});
				charts.graph2dAxis.NbColumnHeaderLevel ++; // Increment to get the count value;

				// headingSize: would be Top or Bottom Offset depend of client param or Negative/Positive data
				headingSize = (charts.graph2dAxis.options.font.height * charts.graph2dAxis.NbColumnHeaderLevel) + (charts.graph2dAxis.options.axis.top.padding != null ? charts.graph2dAxis.options.axis.top.padding : charts.graph2dAxis.options.axis.padding);
				
				charts.graph2dAxis.layout.headingMinSize = headingSize;
				
			},
			
			utils: {
				topRound: function(val){
					if(val >= 0){
						return Math.ceil(val);
					} else {
						return Math.floor(val);
					}
				}

				
			},
			
				
			setHeightXLabel: function(){
					// There are no Maximum regarding the height of the graph, just a minimum
					
					// Top Offset, half size of the Font height
					charts.graph2dAxis.offset.top = (charts.graph2dAxis.options.font.height / 2);
					
					// Get the available Height for the draw area
					var nbVerticalStep = Math.ceil((charts.graph2dAxis.options.height-charts.graph2dAxis.layout.headingMinSize) / charts.graph2dAxis.options.font.height);
					
					// Remove the number of step required for drawing the label
					var nbNumberVertical = nbVerticalStep - charts.graph2dAxis.NbColumnHeaderLevel;
					
					// Check if we meet the minimum requirement regarding the height size
					if(nbNumberVertical < charts.graph2dAxis.options.axis.minNbIncrementStep){
						// Force a minimum height
						nbNumberVertical = charts.graph2dAxis.options.axis.minNbIncrementStep;
						nbVerticalStep = charts.graph2dAxis.options.axis.minNbIncrementStep + charts.graph2dAxis.NbColumnHeaderLevel;
						
					}
					
					// console.log('nbNumberVertical:' + nbNumberVertical + ' charts.graph2dAxis.options.font.height:' + charts.graph2dAxis.options.font.height);
					
		
		
					// Set Nb Of Incrementing Available Step
					charts.graph2dAxis.nbStep = nbNumberVertical;

					
					// Reset the height of the graphic
					charts.graph2dAxis.options.height = (charts.graph2dAxis.options.font.height * nbVerticalStep);// + charts.graph2dAxis.layout.headingMinSize;

					// Overload the result, now calculated base on nbStep
					// charts.graph2dAxis.options.height = (charts.graph2dAxis.options.font.height * charts.graph2dAxis.nbStep) + charts.graph2dAxis.layout.headingMinSize;



					// console.log('new height:' + charts.graph2dAxis.options.height + ' font.height:' + charts.graph2dAxis.options.font.height + ' headingMinSize:' + charts.graph2dAxis.layout.headingMinSize + ' nbVerticalStep:' + nbVerticalStep);
					

			},
			setLeftOffset: function(){
				// Calculate the space used for the Y-Label
				if(charts.graph2dAxis.top.toString().length > charts.graph2dAxis.bottom.toString().length){
					charts.graph2dAxis.offset.left = charts.graph2dAxis.options.font.width * charts.graph2dAxis.top.toString().length;
				} else {
					charts.graph2dAxis.offset.left = charts.graph2dAxis.options.font.width * charts.graph2dAxis.bottom.toString().length;
				}
			},
			setBottomOffset: function(){
				// The Bottom Offset is base on the number of y Incrementation
				
				
				charts.graph2dAxis.offset.bottom = charts.graph2dAxis.options.height - (charts.graph2dAxis.nbStep * charts.graph2dAxis.options.font.height);
				
				if(charts.graph2dAxis.cuttingPos > 0){
					charts.graph2dAxis.offset.bottom -= (2*charts.graph2dAxis.options.font.height);
				}
				
			},
			
			
			setMetric: function(){
			
				var TopValue = undefined; // Max Value of the axe
				var BottomValue = undefined; // Min Value of the axe
				var interval = undefined; // Incrementation Step Between Max to Min
				var zeroPos = undefined; // Position into the axes of the 0 Value
				var cutingPos = 0; // If needed, Axe cutting Postion, Before of After the 0 Value, 0 Position = no cut
				
				
				// Get Top and Bottom Serie value
				$.each(charts.graph2dAxis.series.series, function(){
					$.each(this.cell, function(){
						if(TopValue == undefined){
							TopValue = this.value;
						}
						if(TopValue < this.value){
							TopValue = this.value;
						}
						if(BottomValue == undefined){
							BottomValue = this.value;
						}
						if(BottomValue > this.value){
							BottomValue = this.value;
						}
						
						
					});
				});
				
				// console.log('TopValue:' + TopValue + ' BottomValue:' + BottomValue);

				// Initial Top and Bottom Value
				if(TopValue > 0){
					var idealTopValue = Math.floor(TopValue);
					TopValue = (TopValue - idealTopValue > 0 ? idealTopValue+1: idealTopValue);
					// TopValue = Math.floor(TopValue);
				} else {
					TopValue = Math.ceil(TopValue);
				}
				BottomValue = Math.floor(BottomValue);
				
				if(TopValue == BottomValue){ // See Issue #4278
					if(TopValue > 0){
						BottomValue = 0;
					} else if(TopValue < 0){
						TopValue = 0;
					} else {
						BottomValue = -5;
						TopValue = 5;
					}
				}
				
				// console.log('TopValue:' + TopValue + ' BottomValue:' + BottomValue);
				

				// Get Ìntitial Range and Interval
				var range = charts.graph2dAxis.utils.topRound(TopValue - BottomValue);
				interval = charts.graph2dAxis.utils.topRound(range/ charts.graph2dAxis.nbStep);
				// TODO, Validate the Precision, currently no decimal are authorized for the interval
				
				
				
				// Set the Zero Position 
				zeroPos = Math.round(charts.graph2dAxis.nbStep * TopValue / range);
				if(zeroPos > charts.graph2dAxis.nbStep){
					zeroPos = charts.graph2dAxis.nbStep;
				}
				if(zeroPos < 0){
					zeroPos = 1;
				}
				
				
				
				// Get Best TopValue and BottomValue Interval
				var IntervalTop = charts.graph2dAxis.utils.topRound(TopValue/(zeroPos - 1));
				var IntervalBottom = Math.abs(charts.graph2dAxis.utils.topRound(BottomValue/(charts.graph2dAxis.nbStep-zeroPos)));
				// Set the Interval
				// Positive and negative Or Positive only table
				if(IntervalTop > interval && (BottomValue >= 0 || (TopValue > 0 && 0 > BottomValue))){
					interval = IntervalTop;
				}
				// Positive and negative Or Negative only table
				if(IntervalBottom > interval && (TopValue <= 0 || (TopValue > 0 && 0 > BottomValue))){
					interval = IntervalBottom;
				}
				
				
				// Check if we can cut the Axe
				var IntervalWithAxeCut = charts.graph2dAxis.utils.topRound(range/(charts.graph2dAxis.nbStep - 2)); // Minus 2 because we don't count the 0 position plus the cutting point
				// Positive Table with Small range posibility
				if(IntervalWithAxeCut < IntervalTop && BottomValue > 0){
					cutingPos = (charts.graph2dAxis.nbStep - 1);
					//
					// Change the NbIncrementStep Variable for charts.graph2dAxis.nbStep
					//
					charts.graph2dAxis.nbStep = charts.graph2dAxis.nbStep - 2; // 2 step are lose for the 0 position and the cut
					interval = IntervalWithAxeCut;
				}
				// Negative Table with Smal range posibility
				if(IntervalWithAxeCut < IntervalBottom && TopValue < 0){
					cutingPos = 2;
					//
					// Change the NbIncrementStep Variable for charts.graph2dAxis.nbStep
					//
					charts.graph2dAxis.nbStep = charts.graph2dAxis.nbStep - 2; // 2 step are lose for the 0 position and the cut
					interval = IntervalWithAxeCut;
				}
				
				
				// Set the new Top and Bottom Value with the new interval found
				if(cutingPos == 0){
					TopValue = charts.graph2dAxis.utils.topRound((zeroPos - 1) * interval);
					BottomValue = Math.floor(TopValue - ((charts.graph2dAxis.nbStep - 1) * interval));
				} else {
					TopValue = TopValue;
					BottomValue = Math.floor(TopValue - ((charts.graph2dAxis.nbStep - 1) * interval));
				}
				
				
				
				// Set the Object Property
				charts.graph2dAxis.top = TopValue;
				charts.graph2dAxis.bottom = BottomValue;
				charts.graph2dAxis.zeroPos = zeroPos;
				charts.graph2dAxis.cuttingPos = cutingPos;
				charts.graph2dAxis.incrementation = interval;
			
				// console.log(charts.graph2dAxis);
			},
			
			init: function(series, options){
				
				
				charts.graph2dAxis.series = series;
				charts.graph2dAxis.options = options;
				

				// Get Nb of Row Heading [Used to label the x Axis]
				
				// Get the available remaining space height for the y axis [minimum of 3 step are required]
				
				// Determine the width of the y axis
				


				charts.graph2dAxis.setNbColumnHeading();
				
				
				if(charts.graph2dAxis.drawDirection == 'x'){
					
					charts.graph2dAxis.setHeightXLabel();
				
					charts.graph2dAxis.setMetric();
					
					// return; // For debug only
					
					// Set the Cutting Pos Offset if needed
					charts.graph2dAxis.cuttingOffset = 0;
					if(charts.graph2dAxis.cuttingPos == (charts.graph2dAxis.nbStep - 1) ){
						charts.graph2dAxis.cuttingOffset = charts.graph2dAxis.options.font.height;
					}
				}
			},
			
			generateGraph: function(paperContainer, paper){
				
				// return; // For debug only
				
				charts.graph2dAxis.paperContainer = paperContainer;
				charts.graph2dAxis.paper = paper;
				
				if(charts.graph2dAxis.drawDirection == 'x'){
					// Get Top and Bottom Value for the Number of Step
					
					// Get the Graph Width
					
					
					
					// Set Left Offset
					charts.graph2dAxis.setLeftOffset();
					
					// Set Bottom Offset
					charts.graph2dAxis.setBottomOffset();
					
					// Draw x-Axis
					charts.graph2dAxis.xAxis();
					
					// Draw x-Label
					charts.graph2dAxis.xLabel();
					
					// Draw y-Axis and y-Label
					charts.graph2dAxis.yAxisLabel();

			
					// Draw the graph
					charts.graph2dAxis.graph();


					
				} else {
					// There are a Maximum and a Minimum regarding the width of the graph, 
					// 		If is not possible to meet that requirement check if we can reverse the draw of the graphic, if not that graph are invalid

				

				}
				
				
				/*if(nbCircleGraph > 0){
					
					// Prepare the Drawing Zone
					
					
					charts.graph2dAxis.paperContainer = $('<div style="margin-top:10px; margin-bottom:10px" \/>').insertAfter(parser.sourceTblSelf);
					// Create the drawing object
					charts.graph2dAxis.paper = Raphael($(charts.graph2dAxis.paperContainer).get(0), charts.graph2dAxis.options.width, charts.graph2dAxis.options.height);
					
					// Draw the graph
					charts.graph2dAxis.graph();
				}*/
			},
			
				
			xAxis: function(){
				// 
				// Draw the x-axis
				//
			
			
				//
				// TODO: Developper NOTE:
				//	 Here they are a glitch when we draw the x axis, because his lenght is too long regarding the graph generated,
				//   :-|
				// 
			
				
				charts.graph2dAxis.xAxisOffset = (charts.graph2dAxis.options.font.height*(charts.graph2dAxis.zeroPos-1) + charts.graph2dAxis.offset.top + charts.graph2dAxis.cuttingOffset);
				
				/*
				var DrawXaxisTick = true;
				var xAxisTickTop = 4; // Number of Pixel for the line up on the x axis;
				var xAxisTickDown = 4; // Number of Pixel for the line down on the x axis;
				*/
				
				var xAxisPath = 'M ' + charts.graph2dAxis.offset.left + ' ' + charts.graph2dAxis.xAxisOffset + ' ';
				
				var maxPos;
				
				for(i=1; i<=(charts.graph2dAxis.NbColumnHeading); i++){
					
					// Valeur Maximale
					maxPos = (i * ((charts.graph2dAxis.options.width - charts.graph2dAxis.offset.left) / charts.graph2dAxis.NbColumnHeading));
					if(charts.graph2dAxis.options.axis.tick || (charts.graph2dAxis.options.axis.top.tick != null ? charts.graph2dAxis.options.axis.top.tick : false) || (charts.graph2dAxis.options.axis.bottom.tick != null ? charts.graph2dAxis.options.axis.bottom.tick : false)){
						// Calculer la position centrale
						var minPos = ((i-1) * ((charts.graph2dAxis.options.width - charts.graph2dAxis.offset.left) / charts.graph2dAxis.NbColumnHeading));
						var centerPos = ((maxPos - minPos) / 2) + minPos;
						
						// Add the Calculated Left Padding
						centerPos += charts.graph2dAxis.offset.left;
						
						// Ligne Droite
						xAxisPath += 'L ' + centerPos + ' ' + charts.graph2dAxis.xAxisOffset + ' ';
						
						// Draw the Top Tick
						if(charts.graph2dAxis.options.axis.top.tick != null ? charts.graph2dAxis.options.axis.top.tick : charts.graph2dAxis.options.axis.tick){
							xAxisPath += 'L ' + centerPos + ' ' + (charts.graph2dAxis.xAxisOffset - (charts.graph2dAxis.options.axis.top.lenght != null ? charts.graph2dAxis.options.axis.top.lenght : charts.graph2dAxis.options.axis.lenght))  + ' ';
						}
						
						// Draw the Bottom Tick
						if(charts.graph2dAxis.options.axis.bottom.tick != null ? charts.graph2dAxis.options.axis.bottom.tick : charts.graph2dAxis.options.axis.tick){
							xAxisPath += 'L ' + centerPos + ' ' + (charts.graph2dAxis.xAxisOffset + (charts.graph2dAxis.options.axis.bottom.lenght != null ? charts.graph2dAxis.options.axis.bottom.lenght : charts.graph2dAxis.options.axis.lenght))  + ' ';
						}

						// Retour a zero
						xAxisPath += 'L ' + centerPos + ' ' + charts.graph2dAxis.xAxisOffset  + ' ';
					}
					// Finir la ligne au MaxPos
					maxPos += charts.graph2dAxis.offset.left;
					xAxisPath += 'L ' + maxPos + ' ' + charts.graph2dAxis.xAxisOffset  + ' ';
					
					// Write the appropriate label
					

				}	
				try {
					charts.graph2dAxis.paper.path(xAxisPath);
				} catch (ex) {
					console.log('Error xAxisPath: ' + xAxisPath);
				}
			},
			
			xLabel: function(){
				
				//
				// Draw the X Label
				//
				
				// TODO
				// for(i=0; i<tBodySeries.nbRowLevel; i++){
				// 	// Draw a background for each row
				// }
				
				// For each column Header, calculate his position and add the label
				$.each(charts.graph2dAxis.series.heading, function(){
					
					// Min Pos + Max Pos
					var xMinPos = this.colPos;
					var xMaxPos = (this.colPos + this.width);
					
					if(xMinPos >= charts.graph2dAxis.series.nbRowLevel){
						
						// Get the starting x-axis position of the header area
						xMinPos -= charts.graph2dAxis.series.nbRowLevel;
						xMaxPos = xMaxPos - charts.graph2dAxis.series.nbRowLevel;
						var xMinPosPaper = Math.floor((charts.graph2dAxis.options.width - charts.graph2dAxis.offset.left) / (charts.graph2dAxis.NbColumnHeading) * xMinPos);
						var xMaxPosPaper = Math.floor((charts.graph2dAxis.options.width - charts.graph2dAxis.offset.left) / (charts.graph2dAxis.NbColumnHeading) * xMaxPos);

						//console.log('header:' + this.header);
						//console.log('    xMinPos: ' + xMinPos + ' xMaxPos: ' + xMaxPos + ' xMinPosPaper: ' + xMinPosPaper + ' xMaxPosPaper: ' + xMaxPosPaper);

						
						// Get the middle position
						var xPos = xMinPosPaper;
						xPos = Math.floor((xMaxPosPaper - xMinPosPaper) / 2) + xMinPosPaper;
						var textAnchor = 'middle';
						
						// Add the Offset
						xPos += charts.graph2dAxis.offset.left;
						
						
						// Calculate the Label position into the Y perpective
						
						// TODO NOTE: for draw-x use nbColLevel, and for draw-y use nbRowLevel
						var hMin = (charts.graph2dAxis.series.nbColLevel - this.height - this.level);
						// var hMax = hMin + (this.height-1);
						// console.log(charts.graph2dAxis.series);
						// console.log('hMin:' + hMin + ' nbRowLevel:' + charts.graph2dAxis.series.nbRowLevel + ' height' + this.height + ' level:' + this.level);
						

						// Get the Top and Bottom Position;
						// var topPos = (charts.graph2dAxis.options.height - charts.graph2dAxis.offset.bottom) + (charts.graph2dAxis.options.font.height * hMin);
						var topPos = (charts.graph2dAxis.options.height - charts.graph2dAxis.layout.headingMinSize) + (charts.graph2dAxis.options.font.height * hMin);
						var bottomPos = topPos + (this.height * charts.graph2dAxis.options.font.height);

						// console.log('topPos:' + topPos + ' bottomPos:' + bottomPos + ' height:' + charts.graph2dAxis.options.height + ' headingMinSize:' + charts.graph2dAxis.layout.headingMinSize + ' FontHeight:' + charts.graph2dAxis.options.font.height + ' hMin:' + hMin);

						
						// Get the Middle pos for the label
						var middlePos = topPos + ((bottomPos-topPos) / 2);

						//console.log('    hMin: ' + hMin + ' nbColLevel:' + charts.graph2dAxis.series.nbRowLevel + ' height:' + this.height + ' level:' + this.level);
						
						// var h = ((charts.graph2dAxis.options.height -30) + ((((hMax-hMin) / 2) + hMin) * charts.graph2dAxis.options.font.height) - charts.graph2dAxis.options.font.height + charts.graph2dAxis.offset.top + charts.graph2dAxis.cuttingOffset + (4 * 2));
						// var h = (charts.graph2dAxis.options.height + ((((hMax-hMin) / 2) + hMin) * charts.graph2dAxis.options.font.height) - charts.graph2dAxis.options.font.height - charts.graph2dAxis.offset.top - charts.graph2dAxis.cuttingOffset - (4 * 2));
						
						
						
						// TopPos => offset.top + 
						
						//console.log('    topPos: ' + topPos + ' bottomPos:' + bottomPos + ' charts.graph2dAxis.options.height:' + charts.graph2dAxis.options.height + ' offset.top:' + charts.graph2dAxis.offset.top + ' offset.bottom:' + charts.graph2dAxis.offset.bottom);
						
						
						var leftPos = xMinPosPaper + charts.graph2dAxis.offset.left;
						// var topPos = (charts.graph2dAxis.options.height + (hMin * charts.graph2dAxis.options.font.height) -charts.graph2dAxis.options.font.height + charts.graph2dAxis.offset.top + charts.graph2dAxis.cuttingOffset);
						// var topPos = (charts.graph2dAxis.options.height + (hMin * charts.graph2dAxis.options.font.height) -charts.graph2dAxis.options.font.height - charts.graph2dAxis.offset.top - charts.graph2dAxis.cuttingOffset);
						
						
						var width = ((charts.graph2dAxis.options.width - charts.graph2dAxis.offset.left) / (charts.graph2dAxis.NbColumnHeading)) * (this.width);
						var height = bottomPos - topPos;
						
						
						// Draw a background
						// var fillColor = '90-#ee7-#ddd'; //'lightgreen';
						var fillColor = '50-#F4F4F4-#FFF'; //'lightgreen';
						
						//var fillOverColor = colourNameToHex('lightblue');
						// var fillOverColor = '90-#ddd-#7ee';
						var fillOverColor = '90-#FFF-#F4F4F4';
						if(this.param.fill){
							fillColor = colourNameToHex(this.param.fill);
						}
						if(this.param.fillover){
							fillOverColor = colourNameToHex(this.param.fillover);
						}
						var YLabelBg = charts.graph2dAxis.paper.rect(leftPos, topPos, width, height);
						YLabelBg.attr('fill', fillColor);
						YLabelBg.attr('stroke-width', '0');
						
						
						// var YLabel = paper.text(xPos, h, (this.level == 1 ? this.header.substring(0,1):this.header) ); // Test Only for (2lines-eng) by default use the second commented instruction.
						
						var headingText = this.header;
						
						// Check if the heading text fit in the area
						if((headingText.length * charts.graph2dAxis.options.font.width) > width){
							// Set the best width
							headingText = headingText.substring(0, Math.floor(width/charts.graph2dAxis.options.font.width));
						}
						
						var YLabel = charts.graph2dAxis.paper.text(xPos, middlePos, headingText);
						YLabel.attr("text-anchor", textAnchor);
						YLabel.attr('font-size', charts.graph2dAxis.options.font.size + 'px');
						
						


						YLabelBg.mouseover(function(){
								YLabelBg.attr('fill', fillOverColor);
						}).mouseout(function() {
								YLabelBg.attr('fill', fillColor);
						});				
						YLabel.mouseover(function(){
								YLabelBg.attr('fill', fillOverColor);
						}).mouseout(function() {
								YLabelBg.attr('fill', fillColor);
						});				
					
					}
					
				});
			},
			
			yAxisLabel: function(){
				
		
				var yAxisPath = 'M ' + charts.graph2dAxis.offset.left + ' ' + charts.graph2dAxis.offset.top + ' ';
				charts.graph2dAxis.cuttingPosPaper = 0;
				
				
				if(charts.graph2dAxis.top < 0){
					// Draw the 0 label
					var YLabel = charts.graph2dAxis.paper.text(charts.graph2dAxis.offset.left - 4, charts.graph2dAxis.offset.top, 0);
					YLabel.attr("text-anchor", "end");
					YLabel.attr('font-size', charts.graph2dAxis.options.font.size + 'px');
					
					// Draw the 0 axis line
					yAxisPath += 'L ' + charts.graph2dAxis.offset.left + ' ' + charts.graph2dAxis.offset.top + ' '; // Bas
					yAxisPath += 'L ' + (charts.graph2dAxis.offset.left + 4) + ' ' + charts.graph2dAxis.offset.top + ' '; // Droite
					yAxisPath += 'L ' + (charts.graph2dAxis.offset.left - 2) + ' ' + charts.graph2dAxis.offset.top + ' '; // Gauche
					yAxisPath += 'L ' + charts.graph2dAxis.offset.left + ' ' + charts.graph2dAxis.offset.top + ' '; // Retour
					
					// Draw a axis Top cut line
					yAxisPath += 'L ' + charts.graph2dAxis.offset.left + ' ' + (charts.graph2dAxis.offset.top + (charts.graph2dAxis.options.font.height) - (charts.graph2dAxis.options.font.height/4)) + ' '; // Bas
					yAxisPath += 'L ' + (charts.graph2dAxis.offset.left + 10) + ' ' + (charts.graph2dAxis.offset.top + (charts.graph2dAxis.options.font.height)) + ' '; // Droite
					yAxisPath += 'L ' + (charts.graph2dAxis.offset.left - 10) + ' ' + (charts.graph2dAxis.offset.top + (charts.graph2dAxis.options.font.height) - (charts.graph2dAxis.options.font.height/2)) + ' '; // Gauche

					charts.graph2dAxis.paper.path(yAxisPath); // axis-end
					
					// Draw a axis Down cut
					yAxisPath = 'M ' + charts.graph2dAxis.offset.left + ' ' + (charts.graph2dAxis.offset.top + charts.graph2dAxis.options.font.height + (charts.graph2dAxis.options.font.height/4)) + ' '; // Depart
					yAxisPath += 'L ' + (charts.graph2dAxis.offset.left + 10) + ' ' + (charts.graph2dAxis.offset.top + charts.graph2dAxis.options.font.height + (charts.graph2dAxis.options.font.height/2)) + ' '; // Bas Gauche
					yAxisPath += 'L ' + (charts.graph2dAxis.offset.left - 10) + ' ' + (charts.graph2dAxis.offset.top + charts.graph2dAxis.options.font.height) + ' '; // Haut Droite
					yAxisPath += 'L ' + (charts.graph2dAxis.offset.left) + ' ' + (charts.graph2dAxis.offset.top + charts.graph2dAxis.options.font.height+ (charts.graph2dAxis.options.font.height/4)) + ' '; // Retour Centre
					
					charts.graph2dAxis.cuttingPosPaper = (charts.graph2dAxis.offset.top + charts.graph2dAxis.options.font.height);
					
					// Adjust the charts.graph2dAxis.offset.top
					charts.graph2dAxis.offset.top += (2*charts.graph2dAxis.options.font.height);
				}

				
				
				for(i=0; i < charts.graph2dAxis.nbStep; i++){
					
					
					if(charts.graph2dAxis.cuttingPos == 0 || (charts.graph2dAxis.cuttingPos > i && charts.graph2dAxis.bottom > 0) || charts.graph2dAxis.top < 0){
								
						// No Cutting currently normal way to do the data
						
						// y axis label
						var YLabel = charts.graph2dAxis.paper.text(charts.graph2dAxis.offset.left - 4, charts.graph2dAxis.offset.top + (i * charts.graph2dAxis.options.font.height), (charts.graph2dAxis.top - (i* charts.graph2dAxis.incrementation)));
						YLabel.attr("text-anchor", "end");
						YLabel.attr('font-size', charts.graph2dAxis.options.font.size + 'px');
						
						// y axis line
						yAxisPath += 'L ' + charts.graph2dAxis.offset.left + ' ' + (charts.graph2dAxis.offset.top + (i * charts.graph2dAxis.options.font.height)) + ' '; // Bas
						yAxisPath += 'L ' + (charts.graph2dAxis.offset.left + 4) + ' ' + (charts.graph2dAxis.offset.top + (i * charts.graph2dAxis.options.font.height)) + ' '; // Droite
						yAxisPath += 'L ' + (charts.graph2dAxis.offset.left - 2) + ' ' + (charts.graph2dAxis.offset.top + (i * charts.graph2dAxis.options.font.height)) + ' '; // Gauche
						
						yAxisPath += 'L ' + charts.graph2dAxis.offset.left + ' ' + (charts.graph2dAxis.offset.top + (i * charts.graph2dAxis.options.font.height)) + ' '; // Retour
					}

				}
				
				if(charts.graph2dAxis.cuttingPos > charts.graph2dAxis.nbStep && charts.graph2dAxis.bottom > 0){
						
					// Draw a axis Top cut
					yAxisPath += 'L ' + charts.graph2dAxis.offset.left + ' ' + (charts.graph2dAxis.offset.top + (i * charts.graph2dAxis.options.font.height) - (charts.graph2dAxis.options.font.height/4)) + ' '; // Bas
					yAxisPath += 'L ' + (charts.graph2dAxis.offset.left - 10) + ' ' + (charts.graph2dAxis.offset.top + (i * charts.graph2dAxis.options.font.height)) + ' '; // Droite
					yAxisPath += 'L ' + (charts.graph2dAxis.offset.left + 10) + ' ' + (charts.graph2dAxis.offset.top + (i * charts.graph2dAxis.options.font.height) - (charts.graph2dAxis.options.font.height/2)) + ' '; // Gauche

					charts.graph2dAxis.paper.path(yAxisPath); // axis-end
					
					// Draw a axis Down cut
					yAxisPath = 'M ' + charts.graph2dAxis.offset.left + ' ' + (charts.graph2dAxis.offset.top + (i * charts.graph2dAxis.options.font.height) + (charts.graph2dAxis.options.font.height/4)) + ' '; // Depart
					yAxisPath += 'L ' + (charts.graph2dAxis.offset.left - 10) + ' ' + (charts.graph2dAxis.offset.top + (i * charts.graph2dAxis.options.font.height) + (charts.graph2dAxis.options.font.height/2)) + ' '; // Bas Gauche
					yAxisPath += 'L ' + (charts.graph2dAxis.offset.left + 10) + ' ' + (charts.graph2dAxis.offset.top + (i * charts.graph2dAxis.options.font.height)) + ' '; // Haut Droite
					yAxisPath += 'L ' + (charts.graph2dAxis.offset.left) + ' ' + (charts.graph2dAxis.offset.top + (i * charts.graph2dAxis.options.font.height)+ (charts.graph2dAxis.options.font.height/4)) + ' '; // Retour Centre
					
					// Draw the 0 label
					var YLabel = charts.graph2dAxis.paper.text(charts.graph2dAxis.offset.left - 4, charts.graph2dAxis.offset.top + ((i+1) * charts.graph2dAxis.options.font.height), 0);
					YLabel.attr("text-anchor", "end");
					YLabel.attr('font-size', charts.graph2dAxis.options.font.size + 'px');
					
					// Draw the 0 y-axis point
					
					yAxisPath += 'L ' + charts.graph2dAxis.offset.left + ' ' + (charts.graph2dAxis.offset.top + ((i+1) * charts.graph2dAxis.options.font.height)) + ' '; // Bas
					yAxisPath += 'L ' + (charts.graph2dAxis.offset.left + 4) + ' ' + (charts.graph2dAxis.offset.top + ((i+1) * charts.graph2dAxis.options.font.height)) + ' '; // Droite
					yAxisPath += 'L ' + (charts.graph2dAxis.offset.left - 2) + ' ' + (charts.graph2dAxis.offset.top + ((i+1) * charts.graph2dAxis.options.font.height)) + ' '; // Gauche
					yAxisPath += 'L ' + charts.graph2dAxis.offset.left + ' ' + (charts.graph2dAxis.offset.top + ((i+1) * charts.graph2dAxis.options.font.height)) + ' '; // Retour
					
					charts.graph2dAxis.cuttingPosPaper = (charts.graph2dAxis.offset.top + (i * charts.graph2dAxis.options.font.height));
					
					charts.graph2dAxis.options.height -= (2*charts.graph2dAxis.options.font.height); // Remove the 0 level and the cutting point to the drawing graph area
					
				}
				
				var yAxis = charts.graph2dAxis.paper.path(yAxisPath);

				
			},

			graph: function(){
				
				
				//
				// Calculate the space required for bar and stacked
				//
				var nbGraphBarSpace = 0;
				var PreviousGraphType = undefined;

				var GraphType = 'line'; // That is the default
				

				$.each(charts.graph2dAxis.series.series, function(){
					
					GraphType = this.type; // The first row are the default
					
					
					if(GraphType == 'bar'){ // && (PreviousGraphType != 'bar' || PreviousGraphType == undefined)){
						nbGraphBarSpace ++;
						PreviousGraphType = 'bar';
					}
					if(GraphType == 'stacked'  && (PreviousGraphType != 'stacked' || PreviousGraphType == undefined)){
						nbGraphBarSpace ++;
						PreviousGraphType = 'stacked';
					}		
				});
				
				
				
				PreviousGraphType = undefined;
				var currGraphTypePos = -1;
				
				var legendList = $('<ul>').appendTo($(charts.graph2dAxis.paperContainer));
				
				charts.graph2dAxis.legendContainer = legendList;
				
				var CurrentSerieID = 0;
				
				$.each(charts.graph2dAxis.series.series, function(){
					
					var currentSerie = this;
				
					var legendItem = $('<li></li>').appendTo($(legendList));
					var legendPaperEle = $('<span style="margin-right:7px;"></span>').appendTo($(legendItem));
					var legendPaper = Raphael($(legendPaperEle).get(0), charts.graph2dAxis.options.font.size, charts.graph2dAxis.options.font.size);
					var legendRect = legendPaper.rect(2,2, charts.graph2dAxis.options.font.size - (2*2) + (2/2), charts.graph2dAxis.options.font.size - (2*2) + (2/2));
					
					
					
					
					GraphType = this.type;

					
					var Color = undefined;
					var StrokeDashArray = "";

		//			StrokeDashArray
		//			[“”, “-”, “.”, “-.”, “-..”, “. ”, “- ”, “--”, “- .”, “--.”, “--..”]
		//			none,
		//			Dash,
		//			Dot,
		//			DashDot,
		//			DashDotDot,
		//			DotSpace,
		//			DashSpace,
		//			DashDash,
		//			DashSpaceDot,
		//			DashDashDot,
		//			DashDashDotDot,
					
					if(charts.graph2dAxis.options.colors[CurrentSerieID]){
						Color = charts.graph2dAxis.options.colors[CurrentSerieID];
					} else {
						Color = charts.graph2dAxis.options.colors[0];
					}
					
					
					
					if(currentSerie.param.color){
						Color = colourNameToHex(currentSerie.param.color);
					}
					
					if(currentSerie.param.dasharray){
						StrokeDashArray = currentSerie.param.dasharray.toLowerCase();
						// Do the appropriate find and replace in the string
						StrokeDashArray = StrokeDashArray.replace("space", " ").replace("dash", "-").replace("dot", ".").replace("none", "");
						
					}
					
					
					var dataCellPos = 0;
					var WorkingSpace = undefined;
					var HeaderText = undefined;
					if(HeaderText == undefined){
						HeaderText = currentSerie.header.rawValue;
					}
					// For each value calculate the path
					$.each(this.cell, function(){
						
						var minPos = (dataCellPos * ((charts.graph2dAxis.options.width - charts.graph2dAxis.offset.left) / charts.graph2dAxis.NbColumnHeading));
						var maxPos = ((dataCellPos+1) * ((charts.graph2dAxis.options.width - charts.graph2dAxis.offset.left) / charts.graph2dAxis.NbColumnHeading));
						var centerPos = ((maxPos-minPos)/2) + minPos + charts.graph2dAxis.offset.left;
						
						if(!this.isHeader){
							
							this.graphMinPos = minPos;
							this.graphMaxPos = maxPos;
							this.graphCenterPos = centerPos;
							/*
							this.debugNbStep = charts.graph2dAxis.nbStep;
							this.debugTop = charts.graph2dAxis.top;
							this.debugBottom = charts.graph2dAxis.bottom;
							*/
							this.graphValue = (((charts.graph2dAxis.top - this.value) * (charts.graph2dAxis.options.font.height*(charts.graph2dAxis.nbStep-1)) / (charts.graph2dAxis.top-charts.graph2dAxis.bottom))+ charts.graph2dAxis.offset.top);
							
							if(WorkingSpace == undefined){
								WorkingSpace = maxPos - minPos;
							}
							
							

							dataCellPos ++;
						}
					});
					
					$(legendItem).append(HeaderText);
					
					
					// Draw the appropriate graph
					if(GraphType == 'line' || GraphType == 'area'){
						
						// TODO: area graphic
						// - Relay the area zone always to the 0 axis
						// - Consider the cut axis pos if applicable
						// - Consider the GraphValue can be positive and negative in the same series (Always relay the area to the 0 axis)
						
						var path = undefined;
						
						var firstPos = undefined;
						var lastPos = undefined;
						
						$.each(this.cell, function(){
							if(!this.isHeader){
								if(path == undefined){
									path = 'M ' + this.graphCenterPos + ' ';
								} else {
									path += 'L ' + this.graphCenterPos + ' ';
								}
								path +=  this.graphValue + ' ';
								
								if(firstPos == undefined){
									firstPos = this.graphCenterPos;
								}
								lastPos = this.graphCenterPos;
							}
						});
						
						if(GraphType == 'area'){
							
							// Check if an axis cut exist
							if(charts.graph2dAxis.cuttingPosPaper == 0){
								// Finish the draw
								path += 'L ' + lastPos + ' ' + charts.graph2dAxis.xAxisOffset + ' ';
								path += 'L ' + firstPos + ' ' + charts.graph2dAxis.xAxisOffset + ' ';
								path += 'z'
							} else {
								// Find the cut position and cut the bar
								if(charts.graph2dAxis.top < 0){
									// Negative Table
									path += ' L ' + lastPos + ' ' + (charts.graph2dAxis.cuttingPosPaper + (charts.graph2dAxis.options.font.height/2));
									path += ' L ' + firstPos + ' ' + charts.graph2dAxis.cuttingPosPaper;
									path += ' z';
									
									var c = charts.graph2dAxis.paper.path(path);
									c.attr("stroke", Color);
									c.attr("stroke-dasharray", StrokeDashArray);
									
									if(GraphType == 'area'){
										c.attr("fill", Color);
										c.attr("fill-opacity", (30 / 100));
									}
									
									// Second bar
									path = 'M ' + firstPos + ' ' + (charts.graph2dAxis.cuttingPosPaper - (charts.graph2dAxis.options.font.height/2));
									path += ' L ' + lastPos + ' ' + charts.graph2dAxis.cuttingPosPaper;
									path += ' L ' + lastPos + ' ' + charts.graph2dAxis.xAxisOffset;
									path += ' L ' + firstPos + ' ' + charts.graph2dAxis.xAxisOffset;
									path += ' z';
																	
								} else {
									// Positive Table
									path += ' L ' + lastPos + ' ' + (charts.graph2dAxis.cuttingPosPaper - (charts.graph2dAxis.options.font.height/2));
									path += ' L ' + firstPos + ' ' + charts.graph2dAxis.cuttingPosPaper;
									path += ' z';

									var c = charts.graph2dAxis.paper.path(path);
									c.attr("stroke", Color);
									c.attr("stroke-dasharray", StrokeDashArray);
									
									if(GraphType == 'area'){
										c.attr("fill", Color);
										c.attr("fill-opacity", (30 / 100));
									}
									
									// Second bar
									path = 'M ' + firstPos + ' ' + (charts.graph2dAxis.cuttingPosPaper + (charts.graph2dAxis.options.font.height/2));
									path += ' L ' + lastPos + ' ' + charts.graph2dAxis.cuttingPosPaper;
									path += ' L ' + lastPos + ' ' + charts.graph2dAxis.xAxisOffset;
									path += ' L ' + firstPos + ' ' + charts.graph2dAxis.xAxisOffset;
									path += ' z';
								}
							}
							
						}
						
						var c = charts.graph2dAxis.paper.path(path);
						
						
						c.attr("stroke", Color);
						legendRect.attr("stroke", Color);
						c.attr("stroke-dasharray", StrokeDashArray);
						legendRect.attr("stroke-dasharray", StrokeDashArray);
						
						if(GraphType == 'area'){
							c.attr("fill", Color);
							legendRect.attr("fill", Color);
							c.attr("fill-opacity", (30 / 100));
							legendRect.attr("fill-opacity", (30 / 100));
						} else {
							legendRect.attr("fill", Color);
						}
						
					}
					
					if(GraphType == 'bar' || GraphType == 'stacked'){
						
						
						
						if(PreviousGraphType != 'stacked' && GraphType != 'stacked' || PreviousGraphType != GraphType){
							currGraphTypePos ++;
						}
						// console.log('PreviousGraphType:' + PreviousGraphType + ' GraphType:' + GraphType + ' currGraphTypePos:' + currGraphTypePos);
						PreviousGraphType = GraphType;


						
						// Calculare the space for the bar
						// 0 Bar space between each bar [That can be set to something else (May be a percentage of the real bar space)]
						// 1/4 bar space at the begin [That can be set to something else (May be a percentage of the real bar space)]
						// 1/4 bar space at the end [That can be set to something else (May be a percentage of the real bar space)]
						
						// (nbGraphBarSpace * 4) + 1 + 1 = Nombre Total de segment
						// (nbGraphBarSpace * 100) + 25 + 25 = Nombre Total de petit-segment sur une base de 100 pour 1 segment
						var percentPaddingStart = 50;
						var percentPaddingEnd = 50;
						var nbSmallSegment = (nbGraphBarSpace * 100) + percentPaddingStart + percentPaddingEnd; // Ou 25 = EmptyStartWorkingspace et l'autre 25 = empty end working space
						var EmptyStartWorkingSpace = (percentPaddingStart * WorkingSpace / nbSmallSegment);
						var EmptyEndWorkingSpace = (percentPaddingEnd * WorkingSpace / nbSmallSegment);
						
						var RealWorkingSpace = WorkingSpace - EmptyStartWorkingSpace - EmptyEndWorkingSpace;
						
						var SegmentWidth = RealWorkingSpace/nbGraphBarSpace;
						
						var StartPos = SegmentWidth * currGraphTypePos;
						var EndPos = StartPos + SegmentWidth;
						
						// console.log('id:' + $(self).attr('id') + ' nbGraphBarSpace:' + nbGraphBarSpace + ' nbSmallSegment:' + nbSmallSegment);
						// console.log('id:' + $(self).attr('id') + ' WorkingSpace:' + WorkingSpace + ' EmptyStartWorkingSpace:' + EmptyStartWorkingSpace + ' EmptyEndWorkingSpace:' + EmptyEndWorkingSpace);
						// console.log('id:' + $(self).attr('id') + ' RealWorkingSpace:' + RealWorkingSpace + ' SegmentWidth:' + SegmentWidth + ' StartPos:' + StartPos + ' EndPos:' + EndPos);
						
						
						
						
						$.each(this.cell, function(){
							if(!this.isHeader){
								
								var xTopLeft = this.graphMinPos + StartPos + EmptyStartWorkingSpace+ charts.graph2dAxis.offset.left; // That never change
								var yTopLeft = undefined;
								var height = undefined;
								var width = SegmentWidth; // That never change
								
								
								// Check if the graphValue are below the 0 axis or top of 
								if(charts.graph2dAxis.xAxisOffset >= this.graphValue){
									// The Point are below the 0 axis
									yTopLeft = this.graphValue;
									height = charts.graph2dAxis.xAxisOffset - this.graphValue;
								} else {
									// The Point are upper the 0 axis
									yTopLeft = charts.graph2dAxis.xAxisOffset;
									height = this.graphValue - charts.graph2dAxis.xAxisOffset;
								}
								
								var path = "";
								// Check if the y-axis is cut, if true cut the bar also
								

								if(charts.graph2dAxis.cuttingPosPaper == 0){
									// Draw it the none cut bar
									path = 'M ' + xTopLeft + ' ' + yTopLeft;
									path += ' L ' + (xTopLeft + width) + ' ' + yTopLeft;
									path += ' L ' + (xTopLeft + width) + ' ' + (yTopLeft + height);
									path += ' L ' + xTopLeft + ' ' + (yTopLeft + height);
									path += ' z';
								
								} else {
									// Find the cut position and cut the bar
									if(charts.graph2dAxis.top < 0){
										// Negative Table
										path = 'M ' + xTopLeft + ' ' + yTopLeft;
										path += ' L ' + (xTopLeft + width) + ' ' + yTopLeft;
										path += ' L ' + (xTopLeft + width) + ' ' + charts.graph2dAxis.cuttingPosPaper;
										path += ' L ' + xTopLeft + ' ' + (charts.graph2dAxis.cuttingPosPaper - (charts.graph2dAxis.options.font.height/2));
										path += ' z';
										var bar = charts.graph2dAxis.paper.path(path);
										bar.attr("fill", Color);
										
										
										if(currentSerie.param.fillopacity){
											bar.attr("fill-opacity", (currentSerie.param.fillopacity / 100));
										}
										
										
										// Second bar
										path = 'M ' + xTopLeft + ' ' + charts.graph2dAxis.cuttingPosPaper;
										path += ' L ' + (xTopLeft + width) + ' ' + (charts.graph2dAxis.cuttingPosPaper + (charts.graph2dAxis.options.font.height/2));
										path += ' L ' + (xTopLeft + width) + ' ' + (yTopLeft + height);
										path += ' L ' + xTopLeft + ' ' + (yTopLeft + height);
										path += ' z';
																		
									} else {
										// Positive Table
										path = 'M ' + xTopLeft + ' ' + yTopLeft;
										path += ' L ' + (xTopLeft + width) + ' ' + yTopLeft;
										path += ' L ' + (xTopLeft + width) + ' ' + (charts.graph2dAxis.cuttingPosPaper - (charts.graph2dAxis.options.font.height/2));
										path += ' L ' + xTopLeft + ' ' + charts.graph2dAxis.cuttingPosPaper;
										path += ' z';
										var bar = charts.graph2dAxis.paper.path(path);
										bar.attr("fill", Color);
										
										
										if(currentSerie.param.fillopacity){
											bar.attr("fill-opacity", (currentSerie.param.fillopacity / 100));
										}
										
										
										// Second bar
										path = 'M ' + xTopLeft + ' ' + (charts.graph2dAxis.cuttingPosPaper + (charts.graph2dAxis.options.font.height/2));
										path += ' L ' + (xTopLeft + width) + ' ' + charts.graph2dAxis.cuttingPosPaper;
										path += ' L ' + (xTopLeft + width) + ' ' + (yTopLeft + height);
										path += ' L ' + xTopLeft + ' ' + (yTopLeft + height);
										path += ' z';
									}
									
								}
								var bar = charts.graph2dAxis.paper.path(path);
								bar.attr("fill", Color);
								legendRect.attr("fill", Color);
								
								
								if(currentSerie.param.fillopacity){
									bar.attr("fill-opacity", (currentSerie.param.fillopacity / 100));
									legendRect.attr("fill-opacity", (currentSerie.param.fillopacity / 100));
								}
								
								
							}
						});
						
						

						
						/*
						if(GraphType == 'bar' && (PreviousGraphType != 'bar' || PreviousGraphType == undefined)){
							currGraphTypePos ++;
							PreviousGraphType = 'bar';
						}
						if(GraphType == 'stacked'  && (PreviousGraphType != 'stacked' || PreviousGraphType == undefined)){
							currGraphTypePos ++;
							PreviousGraphType = 'stacked';
						}	*/
						
					}
					
					
					CurrentSerieID++;
				});
			}
		};
		
		
