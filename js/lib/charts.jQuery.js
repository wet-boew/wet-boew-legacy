/*!
 * Charts and graphs support v2.0.1 / Soutien des graphiques v2.0.1
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */
/**
 * Chart plugin v2.0
 * 
 * @author: Pierre Dubois
 * @contributor: Qibo Zhu
 */
(function($) { 
$.fn.charts = function(options, container){
	return $(this).each(function(){
		// Requirement : Each cell need an appropriate col header and row header (one of the header [col|row] need to be unique to the serie)

		// console.log(options);

		//configuration
		var o = $.extend({
			
			
			"default-namespace": "wb-graph",
			
			"graphclass-autocreate": true, // This add the ability to set custom css class to the figure container.
			"graphclass-overwrite-array-mode": true,
			"graphclass-typeof": "string",
			
			"hide-autocreate": true,

			/*
			general: {
				type: 'line', // line, bar, stacked, pie
				width: $(this).width(), // This will be re-adjusted to the best fit as a lower value
				height: $(this).height(), // This will be re-adjusted to the best fit as a lower value
				maxWidth: 598, // Will overwrite the 'width' value if the width are larger
				parseDirection: 'x', // 'x' | 'y' => That is the way to inteprete the table serie if is vertical or horizontal
				foregroundColor: 'black', // Color used to draw the label and line (HTML color name or hexa Color value like #000000 				
				hide: false // Indicate if the Table need to be hidden
			},*/
			
			// This is the default option for a series
			serie: {
				type: 'line',
				color: 'blue' // Line color or Fill Color
			},
			
			serie2dAxis: {
				dasharray: "",
				fillopacity: 100 // Use for Area graph type
			},
			
			heading2dAxis: {
				fill: 'white', // Color used to fill the Heading zone
				fillover: 'blue', // Color used to fill the Heading on a mouse over
				foreground: 'black', // foreground color for the Heading
				foregroundover: 'red' // foreground color on mouse over
			},
			
			'default-option': 'type', // Default CSS Options
			
			// Graph Type
			type: 'bar', // TODO: Can be one of or an array of: area, pie, line, bar, stacked
			"type-autocreate": true,
			
			"endcaption-autocreate": true,
			"endcaption-typeof": "boolean",
			
			// Generate Graph ID automatic
			// TODO: Enable this feature behaviour
			generateids: true, // This will ovewrite any headers attribute set
			"generateids-typeof": "boolean",
			
			
			optionsClass: {
				'default-option': 'type', // Default CSS Options
				"type-autocreate": true,
				"color-autocreate": true,
				"overcolor-autocreate": true,
				"default-namespace": "wb-graph",
				"dasharray-autocreate": true,
				"hide-autocreate": true,
				"fillopacity-autocreate": true,
				"fillopacity-typeof": "number"
			},
			
			
			
			
			
			//
			// Graph Layout
			//
			width: $(this).width(), // width of canvas - defaults to table height
			"width-typeof": "number",
			height: $(this).height(), // height of canvas - defaults to table height
			"height-typeof": "number",
			maxwidth: '590',// '590',
			"maxwidth-typeof": "locked",
			
			widthPadding: 2, // That is to fix the svg positioning offset (left: -0.5px; top: -0.56665px)
			
			//
			// Colors
			//
			colors: ['#be1e2d','#666699','#92d5ea','#ee8310','#8d10ee','#5a3b16','#26a4ed','#f45a90','#e9e744'], // Serie colors set
			textColors: [], //corresponds with colors array. null/undefined items will fall back to CSS
			
			//
			// Data Table and Graph Orientation
			//
			parseDirection: 'x', // which direction to parse the table data
			drawDirection: 'x', // TODO NEW v2.0 - which direction are the dependant axis
			
			//
			// Pie Graph Option 
			//
			pieMargin: 20, //pie charts only - spacing around pie
			pieLabelsAsPercent: true,
			pieLabelPos: 'inside',
			
			//
			// Line, Area, Bar, Stacked Option
			//
			lineWeight: 4, // for line and area - stroke weight
			barGroupMargin: 10,
			barMargin: 1, // space around bars in bar chart (added to both sides of bar)
			
			//
			// Font Option * NEW v2.0
			//
			font: {
				height: 20, // Number of pixel
				width: 10, // Number of pixel (Minimum Value = half size of the height)
				size: 14 // Font Size
			},
			
			//
			// Axis Draw Option * NEW v2.0
			//
			axis: {
				top: {
					tick: null, // Draw the top tick line (If specified the axis.tick would be ignored)
					lenght: null, // Number of pixel (If specified the axis.lenght would be ignored)
					padding: null // Padding at the top of x-axis
				},
				right: {
					tick: null, // Draw the right tick line (If specified the axis.tick would be ignored)
					lenght: null, // Number of pixel (If specified the axis.lenght would be ignored)
					padding: null // Padding at the right of x-axis
				},
				bottom: {
					tick: null, // Draw the bottom tick line (If specified the axis.tick would be ignored)
					lenght: null, // Number of pixel (If specified the axis.lenght would be ignored)
					padding: null // Padding at the bottom of x-axis
				},
				left: {
					tick: null, // Draw the left tick line (If specified the axis.tick would be ignored)
					lenght: null, // Number of pixel (If specified the axis.lenght would be ignored)
					padding: null // Padding at the left of x-axis
				},
				tick: true, // Draw the tick line
				lenght: 4, // Number of pixel
				padding: 4, // Number of pixel, distance between the axes/graph limit and the text
				minNbIncrementStep: 6 // Minimum Number of incrementing step, that's mean an auto resize if needed and no Axis cut
			}
			



			// // //
			// Not longer supported Options
			// // //
			// For acessibility and comprehension, a caption is always required
			// appendTitle: true, // table caption text is added to chart
			// title: null, // grabs from table caption if null
			// // //
			// Because the Key (header) of the serie are invisible the key (legend) is always added
			// appendKey: true, //color key is added to chart
			// // //
			// In a future version that would be replaced by th class attribute to specify the column and/or row are descriptive only
			// rowFilter: ' ',
			// colFilter: ' ',
			// // //
			// Replaced by font.height
			// yLabelInterval: 30 //distance between y labels
			// // //
		},options);

		
		var self = $(this);
		
		var graphStartExecTime = new Date().getTime(); // This variable is used to autogenerate ids for the given tables.
		


		// Table Parser Object
		var parser = {
			sourceTblSelf: undefined,
			param: {}, // TO BE ELIMINATED WITH THE DEFAULT JS OPTIONS
			parse: function(){
				
				
				
				
				parser.sourceTblSelf = self;
				
				// Swap the table is requested
				if((parser.param.parseDirection? parser.param.parseDirection: o.parseDirection) == 'y'){
					self = parser.swapTable(parser.sourceTblSelf);
				}
				
				parser.setSeriesHeadingLenght();
				
				
				// The following variable is used for auto add ids/headers to the table
				var columnIds = []; // The array lenght must equal of parser.seriesHeadingLenght and each item are ids separated by space
				
				
				
				// Parse the Table Heading
				$('thead', self).each(function(){
					
					var ColumnHeading = [];
					var SpannedRow = [];
					
					
					parser.rowPos = 0; // re-init the row numbering

					
					// FOR EACH row get the series
					$('tr', this).each(function(){

						
						var currentSerieLevel = 0;
						
						var CurrColPosition = 0;	
					
						
						// Check if the first cell was spanned
						$.each(SpannedRow, function(){
							if(this.colpos == CurrColPosition && this.rowspan > 0){
								
								// Calculate the width of the spanned row
								var w = (($(this.ele).attr('colspan') != undefined ? $(this.ele).attr('colspan') : 1) * 1);
								
								CurrColPosition += w;
								
								this.rowspan --;
								
							}
						});
						
						
						
						
						var serieHeader = ''; // That would contain the current on process serie header
						
						// Get the Row heading Width
						$('td, th', this).each(function(){
							
							parser.cellID ++;
							
							
							var IgnoreCurrentCell = false; // TODO check if wet-graph-ignore class is set, if yes use the cell value data as non numerical data
							

							// Get the dimension for the cell
							var w = (($(this).attr('colspan') != undefined ? $(this).attr('colspan') : 1) * 1);
							var RowSpan = (($(this).attr('rowspan') != undefined ? $(this).attr('rowspan') : 1) * 1);
							
												
							// Check if is a rowspan, if that row span are an header (th) that mean it a grouping of series
							if(RowSpan > 1){
								var NbRowToBeSpan = RowSpan - 1;
								// Add the row to the list to be spanned
								SpannedRow.push({ele: $(this), rowspan: NbRowToBeSpan, colpos: CurrColPosition});
							}
							
							
							// If is the second or more row, check for a group ID
							CurrentGroupingID = 0;
							if(parser.rowPos > 0){
								var headerList = '';
								$.each(ColumnHeading, function(){
									if(CurrColPosition >= this.colPos && 
										CurrColPosition < (this.colPos + this.width) && 
										this.isGroup &&
										this.level < parser.rowPos){
										// That is a Header group
										CurrentGroupingID = this.id;
										// Get the associate header for that cell
										// headerList = (columnIds[this.colPos] != undefined ? columnIds[this.colPos]: '') + (this.uniqueID != '' ? ' ' + this.uniqueID : '');
										
										
									}
								});
								
								// $(this).attr('headers', headerList); // Set the header and overwrite if any exist

							}
							
							
							
							// Check for Column Header spanned
							var isGroup = false;
							if(this.nodeName.toLowerCase() == 'th' && w > 1) {
								isGroup = true;
							}
							
							if(columnIds[CurrColPosition] != undefined){
								$(this).attr('headers', columnIds[CurrColPosition]);
							}
							
							
							// If this is an heading and there are no id, we create a new one
							var cellId = '';
							if(this.nodeName.toLowerCase() == 'th' && $(this).text().replace(/ /g,'') != ""){ 
								cellId = $(this).attr('id');
								//console.log(cellId);
								if(cellId == undefined || cellId == ''){
									cellId = 'graphcellid'+ graphStartExecTime + 'row' + parser.rowPos + 'col' + CurrColPosition; // Generate a new unique ID
									$(this).attr('id', cellId); // Add the new ID to the table
								}			
								//console.log(cellId);
								
								// This loop make sur all column have their column set
								for(i=0; i<w; i++){
									var cellPos = i + CurrColPosition;
									if(columnIds[cellPos] == undefined){
										columnIds[cellPos] = cellId;
									} else {
										columnIds[cellPos] = columnIds[cellPos] + ' ' + cellId;
									}
								}
								
							}
							
							
							
							var tblId = $(parser.sourceTblSelf).attr('id');
					
							
							

							var header = {
								id : parser.cellID,
								uniqueID: cellId,
								level : parser.rowPos,
								width : w,
								height: RowSpan,
								header : $(this).text(),
								groupId : CurrentGroupingID,
								isGroup : isGroup,
								colPos: CurrColPosition,
								param: parser.classToJson(this)
							};
							ColumnHeading.push(header);

							if(parser.tBodySeries.nbColLevel <= parser.rowPos || parser.tBodySeries.nbColLevel == undefined){
								parser.tBodySeries.nbColLevel = (parser.rowPos + 1);
							}

							
							
							CurrColPosition += w; // Increment the Current ColPos

							
							
							// Check for span row
							$.each(SpannedRow, function(){
								if(this.colpos == CurrColPosition && this.rowspan > 0){
									var w = (($(this.ele).attr('colspan') != undefined ? $(this.ele).attr('colspan') : 1) * 1);
									CurrColPosition += w;
									this.rowspan --;
								}
							});
							
							
						// console.log(CurrColPosition);							

						});
							
						
										
						parser.rowPos ++;

						
					});
					
			
					parser.tBodySeries.ColHeading = ColumnHeading;
					
				});
				
				// console.log(columnIds);
				
				var rowsIds = [];
				
				// Parse the Table Cell Data and Serie Heading
				$('tbody', self).each(function(){
					var maxValue;
					var minValue;
					var unit;
					var SpannedRow = [];
					var Series = {
						headerList: [],
						series: [],
						param: parser.classToJson(this)
					};
					
					// FOR EACH row get the series
					$('tr', this).each(function(){
						var currentSerieLevel = 0;
						var CurrColPosition = 0;
						var CurrentGroupingID = 0;		
						var arrAllCell = $(this).children();
						var cellOrdered = [];
						var cellHeadingOrdered = [];
						
						
						// Check if the first cell was spanned
						$.each(SpannedRow, function(){
							if(this.colpos == CurrColPosition && this.rowspan > 0){
								// Calculate the width of the spanned row
								var w = (($(this.ele.obj).attr('colspan') != undefined ? $(this.ele.obj).attr('colspan') : 1) * 1);
								for(i=1; i<=w; i++){
									this.ele.colPos = i+CurrColPosition;
									if(this.ele.isHeader){
										cellHeadingOrdered.push(jQuery.extend(true, {}, this.ele));
									} else {
										cellOrdered.push(jQuery.extend(true, {}, this.ele));
									}
								}
								CurrColPosition += w;
								if($(this.ele.obj).get(0).nodeName.toLowerCase() == 'th' && parser.seriesHeadingLenght > CurrColPosition){
									currentSerieLevel ++; // That would say on witch heading level we are
									
									if(this.rowspan >= 1){
										// Change the Grouping ID on the next iteration
										CurrentGroupingID = this.ele.id;
									}
								}
								
								this.rowspan --;
							}
						});
						
						var serieHeaderText = ''; // That would contain the current on process serie header
						var serieHeader; // JQuery object of the native Header for the current serie
						var isRejected = false;
						var rejectedRaison = "";
						
						// Get the Row heading Width
						$('th, td', this).each(function(){
							
							parser.cellID ++;
							
							var IgnoreCurrentCell = false; // TODO check if wet-graph-ignore class is set, if yes use the cell value data as non numerical data
							
							// Get the cell Value
							var cellValueObj = parser.getCellValue($(this).text());
							
							var cellInfo = {
								id : parser.cellID,
								isHeader: false,
								rowPos: parser.rowPos,
								rawValue: $(this).text(),
								value: cellValueObj.cellValue,
								unit: cellValueObj.cellUnit,
								obj: $(this),
								param: parser.classToJson(this)
							};
							
							// Get the dimension for the cell
							var w = (($(this).attr('colspan') != undefined ? $(this).attr('colspan') : 1) * 1);
							var RowSpan = (($(this).attr('rowspan') != undefined ? $(this).attr('rowspan') : 1) * 1);


							//
							// DO something when colspan and *row span*
							//
							//
							
							// Set the header for the cells, if applicable
							// console.log('CurrColPosition: ' + CurrColPosition + ' width: ' + w);
							// console.log('rowpos:' + parser.rowPos + ' CurrColPosition:' + CurrColPosition );
							var cellColHeaders = "";
							for(i = CurrColPosition; i<(CurrColPosition+w); i++){
								if(columnIds[i] != undefined){
									if(cellColHeaders == ''){
										// Normal cell
										cellColHeaders = columnIds[i];
									} else {
										// This is for about colspaned cell
										var tblCellColHeaders = parser.removeDuplicateElement(cellColHeaders.split(' ').concat(columnIds[i].split(' ')));
										cellColHeaders  = tblCellColHeaders.join(' ');
									}
								}
							}

							var cellRowHeaders = "";
							if(rowsIds[parser.rowPos] != undefined){
								cellRowHeaders = rowsIds[parser.rowPos];
							}
							
							$(this).attr('headers', cellColHeaders + (cellColHeaders != "" && cellRowHeaders != ""? ' ': '') + cellRowHeaders);
							
							
							// cellUnit will be use as global for the entire row group
							if(this.nodeName.toLowerCase() == 'th'){
								// Mark the current cell as Header 
								cellInfo.isHeader = true;
								
								// Generate a cell ID if none + add it inside the heading list
								
								
								cellId = $(this).attr('id');
								if(cellId == undefined || cellId == ''){
									cellId = 'graphcellid'+ graphStartExecTime + 'row' + parser.rowPos + 'col' + CurrColPosition; // Generate a new unique ID
									$(this).attr('id', cellId); // Add the new ID to the table
								}			
								//console.log(cellId);
								
								// This loop make sur all column have their column set
								for(i=0; i<RowSpan; i++){
									var cellPos = i + parser.rowPos;
									// console.log(cellPos);
									if(rowsIds[cellPos] == undefined){
										rowsIds[cellPos] = cellId;
									} else {
										rowsIds[cellPos] = rowsIds[cellPos] + ' ' + cellId;
									}
								}
								
								
							}
							
							


							// Check if is a rowspan, if that row span are an header (th) that mean it a grouping of series
							if(RowSpan > 1){

								var NbRowToBeSpan = RowSpan - 1;
								// Add the row to the list to be spanned
								SpannedRow.push({ele: cellInfo, rowspan: NbRowToBeSpan, colpos: CurrColPosition, groupId : CurrentGroupingID});

								// Check if is a header, if yes this series would be a inner series and that header are a goup header
								if(cellInfo.isHeader && parser.seriesHeadingLenght > CurrColPosition) {
									// This represent a sub row grouping
									currentSerieLevel ++; // Increment the heading level
									
									// Mark the current cell as Header 
									cellInfo.isHeader = true;
									
									var header = {
										id : parser.cellID,
										level : currentSerieLevel,
										width : RowSpan,
										height: w,
										header : $(this).text(),
										groupId : CurrentGroupingID,
										isGroup : true,
										rowPos: parser.rowPos,
										param: parser.classToJson(this)
									};
									
									Series.headerList.push(header);
									
									CurrentGroupingID = parser.cellID;

								}
								
							}
							
							// Add the current Row
							for(i=1; i<=w; i++){
								cellInfo.colPos = i+CurrColPosition;
								if(cellInfo.isHeader){
									cellHeadingOrdered.push(jQuery.extend(true, {}, cellInfo));
								} else {
									cellOrdered.push(jQuery.extend(true, {}, cellInfo));
								}
							}
							
							CurrColPosition += w; // Increment the Current ColPos

							if(parser.seriesHeadingLenght == CurrColPosition){
								// That should correspond to a th element, if not that is a error
								if(!cellInfo.isHeader){
									isRejected = true;
									rejectedRaison = 'Serie heading not good, current cell value:' + $(this).text();
								}
								serieHeaderText = $(this).text();
								serieHeader = $(this);
								
								// Add it to header listing
								var header = {
									id: parser.cellID,
									level : currentSerieLevel,
									width : RowSpan,
									height: w,
									header : $(this).text(),
									groupId : CurrentGroupingID,
									isGroup : false,
									rowPos: parser.rowPos,
									param: parser.classToJson(this)

								};
								Series.headerList.push(header);
								
							}
							
							
							// Check for span row
							$.each(SpannedRow, function(){
								if(this.colpos == CurrColPosition && this.rowspan > 0){
									// Calculate the width of the spanned row
									var w = (($(this.ele.obj).attr('colspan') != undefined ? $(this.ele.obj).attr('colspan') : 1) * 1);
									for(i=1; i<=w; i++){
										this.ele.colPos = i+CurrColPosition;
										if(this.ele.isHeader){
											cellHeadingOrdered.push(jQuery.extend(true, {}, this.ele));
										} else {
											cellOrdered.push(jQuery.extend(true, {}, this.ele));
										}
									}
									CurrColPosition += w;
									
									// Concat the new row heading as needed
									var CurrCellHeaders = ($(this.ele.obj).attr('headers') != undefined? $(this.ele.obj).attr('headers'): '');
									var tblCellColHeaders = parser.removeDuplicateElement(CurrCellHeaders.split(' ').concat(rowsIds[parser.rowPos].split(' ')));
									$(this.ele.obj).attr('headers', tblCellColHeaders.join(' '));
									
									this.rowspan --;
								}
							});
						});
						
						// Create the serie object and add it the current collection
						serie = {
							cell : cellOrdered,
							cellHeading : cellHeadingOrdered,
							header : serieHeaderText,
							headerParam : parser.classToJson(serieHeader),
							level : currentSerieLevel,
							GroupId : CurrentGroupingID,
							rowPos: parser.rowPos,
							isRejected: isRejected,
							rejectedRaison: rejectedRaison
						}
						
						if((parser.tBodySeries.nbRowLevel <= currentSerieLevel || parser.tBodySeries.nbRowLevel == undefined) && !isRejected){
							parser.tBodySeries.nbRowLevel = (currentSerieLevel + 1);
						}
						
						Series.series.push(serie);
						
						
						
						parser.rowPos ++;
						

						
					});
					
					
					parser.tBodySeries.series.push(Series);
					
					
				});
				
				// console.log(rowsIds);
			
				// TODO: Parse the Table Foot (Check if an option set it at cumulative data or just suplementary data
				
				parser.compute(); // Compute the parsed data
			},

			seriesHeadingLenght: 0,
			setSeriesHeadingLenght: function(){
				// Calculate once the width for the Series Heading
				$('tbody:first tr:first th', self).each(function(){
					var w = (($(this).attr('colspan') != undefined ? $(this).attr('colspan') : 1) * 1);
					parser.seriesHeadingLenght += w;
				});
			},
			rowPos: 0,
			cellID: 0,
			
			removeDuplicateElement: function (arrayName) {
				var newArray=new Array();
				label:for(var i=0; i<arrayName.length;i++){  
					for(var j=0; j<newArray.length;j++){
						if(newArray[j]==arrayName[i])
							continue label;
					}
					newArray[newArray.length] = arrayName[i];
				}
				return newArray;
			},
			
			// Function to switch the series order, like make it as vertical series to horizontal series (see Task #2997)
			swapTable: function(){

				// function swapTable for request #2799, transforming horizontal table to virtical table; 
				// Government of Canada. Contact Qibo or Pierre for algorithm info and bug-fixing; 
				// important table element: id or class, th; 
				var sMatrix = [];  
				var i=0;  
				var j=0;  
				var capVal="Table caption tag is missing"; 
				capVal =  $("caption", self).text(); 

				var maxRowCol=10; //basic;  
				var s=0; 

				$('tr ', self).each(function(){
						maxRowCol++; 
                                              if(s<1){
                                                       $('td,th', $(this)).each(function(){

                                                               if($(this).attr('colspan') != undefined) {
                                                               }else{
                                                                       $(this).attr('colspan', 1);
                                                               }
                                                               maxRowCol += Number($(this).attr("colspan"));
                                                               // block change, 20120118 fix for defect #3226, jquery 1.4 problem about colspan attribute, qibo; 
                                                       })
                                               }
                                               s++;
                                       }) ;

                                       var tMatrix = [];
                                       // prepare the place holding matrix;
                                       for (var s=0; s<maxRowCol; s++){
                                               tMatrix[s] = [];
                                               for (var t=0; t<maxRowCol; t++){
                                                       tMatrix[s][t] = 0;
                                               }
                                       }


                                       $('tr ', self).each(function(){
                                               j= 0;
                                               var attrCol = 1;
                                               var attrRow = 1;

                                               $('td,th', $(this)).each(function(){

                                                       if($(this).attr('colspan') != undefined) {
                                                       }else{
                                                               $(this).attr('colspan', 1);
                                                       }
                                                       if($(this).attr('rowspan') != undefined) {
                                                       }else{
                                                               $(this).attr('rowspan', 1);
                                                       }

                                                       attrCol = Number($(this).attr("colspan"));
                                                       attrRow = Number($(this).attr("rowspan"));
                                                       // block change, 20120118 fix for defect #3226, jquery 1.4 problem about colspan attribute, qibo; 


						       while (tMatrix[i][j] == 3){
						       j++; 
						       }

						       if(attrRow >1 && attrCol>1){
						       var ii=i; 
						       var jj=j; 
						       var stopRow = i+ attrRow -1; 
						       var stopCol = j+ attrCol -1; 
						       for(jj=j;jj<=stopCol; jj++){
							       for(ii=i;ii<=stopRow; ii++){
								       tMatrix[ii][jj]=3; //random number as place marker; 
							       }
						       }
						       }else if(attrRow >1){
							       var ii=i; 
							       var stopRow = i+ attrRow -1; 
							       for(ii=i;ii<=stopRow; ii++){
								       tMatrix[ii][j]=3; // place holder; 
							       }
						       }

						       var ss1= $(this).clone(); // have a copy of it, not destroying the look of the original table; 
						       // transforming rows and cols and their properties; 
						       ss1.attr("colspan", attrRow);
						       ss1.attr("rowspan", attrCol);
						       (sMatrix[j] = sMatrix[j] || [])[i] = ss1;
						       j=j+attrCol;   
					       })  
					       i++;  
				       });

				       // now creating the swapped table from the transformed matrix;
				       var swappedTable = $('<table>');  
				       $.each(sMatrix, function(s){  
						       var oneRow = $('<tr>'); 
						       swappedTable.append(oneRow);  
						       $.each(sMatrix[s], function(ind, val){  
							       oneRow.append(val); 
							       }); 
						       });  

				       // now adding the missing thead; 
				       var html2=swappedTable.html();
				       var headStr="<table id=\"swappedGraph\">" + "<caption>" + capVal + " (Horizontal to Virtical)</caption><thead>";
				       html2=html2.replace(/<tbody>/gi, headStr);
				       html2=html2.replace(/<\/tbody>/gi, "</tbody></table>");
				       html2=html2.replace(/\n/g,"");
				       html2=html2.replace(/<tr/gi,"\n<tr");
				       var arr=html2.split("\n"); 
				       for(i=0;i<arr.length; i++){
					       var tr=arr[i];
					       if(tr.match(/<td/i) != null){
						       arr[i]= '</thead><tbody>' + tr; 
						       break; 
					       }
				       }
				       html2=arr.join("\n"); 
				       // alert(html2); // see the source 
				       $(html2).insertAfter(self).hide(); //visible, for debugging and checking;

				       return $(html2);   
			}, //end of function; 
			

			// Compute the series value (see Task #2998)
			compute: function(){
				$.each(parser.tBodySeries.series, function(){
					// This loop is for each tbody section (series group)
					
					var grpMaxValue = undefined;
					var grpMinValue = undefined;
					
					var nbDataSerieLength = undefined; // To know and evaluate the table previously parsed)
					
					$.each(this.series, function(){
						if(!this.isRejected) {
							
						// This loop is for each individual serie
						var maxValue = undefined;
						var minValue = undefined;
						var nbData = 0;
						$.each(this.cell, function(){
							// This loop is for each cell into the serie, here we will compute the total value for the serie
							
							if(!this.isHeader){
								// Evaluate max value
								if(this.value > maxValue || maxValue == undefined){
									maxValue = this.value;
								}
								if(this.value < minValue || minValue == undefined){
									minValue = this.value;
								}
								
								nbData ++;
							}
						});
						
						this.maxValue = maxValue;
						this.minValue = minValue;
						this.length = nbData;
						
						if(nbDataSerieLength == undefined){
							nbDataSerieLength = nbData;
						}
						
						if(nbData != nbDataSerieLength){
							// That series need to be rejected because the data are not properly structured
							this.isRejected = true;
							this.rejectedRaison = 'The data length need to be equal for all the series';
						}
						
						// Evaluate max value (for the group)
						if((maxValue > grpMaxValue || grpMaxValue == undefined) && !this.isRejected){
							grpMaxValue = maxValue;
						}
						if((minValue < grpMinValue || grpMinValue == undefined) && !this.isRejected){
							grpMinValue = minValue;
						}
						
						}
					});
					
					if(grpMaxValue > 0){
						grpMaxValue = grpMaxValue 
					} else {
						grpMaxValue = grpMaxValue;
					}
					
					if(grpMinValue > 0){
						grpMinValue = grpMinValue;
					} else {
						grpMinValue = grpMinValue;
					}
					

					this.maxValue = grpMaxValue;
					this.minValue = grpMinValue;
					this.dataLength = nbDataSerieLength;
				});
			},

			getCellValue: function (cellRawValue){
				//trim spaces in the string; 
				var cellRawValue=cellRawValue.replace(/\s\s+/g," ");
				var cellRawValue=cellRawValue.replace(/^\s+|\s+$/g,"");
				// Return the result
				var result = {
					cellUnit:  cellRawValue.match(/[^\+\-\.\, 0-9]+[^\-\+0-9]*/), // Type: Float - Hint: You can use the JS function "parseFloat(string)"
					cellValue: parseFloat(cellRawValue.match(/[\+\-0-9]+[0-9,\. ]*/)) // Type: String
				}
				return result;
			},
			
			// Function to Convert Class instance to JSON
			classToJson: function (el, namespace){
				var strClass = "";
				if(typeof(el) == 'string'){
					strClass = el;
				} else {
					strClass = ($(el).attr('class') != undefined ? $(el).attr('class') : ""); // Get the content of class attribute
				}
				
				return parser.setClassOptions(jQuery.extend(true, o.optionsClass, o.axis2dgraph), strClass, namespace);
			},
			setClassOptions: function(sourceOptions, strClass, namespace){

				
					// Test: optSource
					if(typeof(sourceOptions) != "object"){
						console.log("Empty source");
						return {};
					}
					
					// Get a working copy for the sourceOptions
					sourceOptions = jQuery.extend(true, {}, sourceOptions);
					
					/*
					// Check if some option need to be removed
					function unsetOption(opt, currLevel, maxLevel){
						if(currLevel > maxLevel || !$.isArray(opt)){
							return;
						}
						var arrToRemove = [];
						for(key in opt){
							// if the key are ending "-remove", get the key to remove
							if(key.lenght > 7 && key.substr(key.lenght - 7) == "-remove"){
								arrToRemove.push(key.substr(0, key.lenght - 7));
							} else {
								// get it deeper if applicable
								if(typeof(opt[key])) == "object"){
									currLevel ++;
									if(currLevel < maxLevel){
										unsetOption(opt[key], currLevel, maxLevel);
									}
								}
							}
						}
						for(i=0;i<arrToRemove.lenght;i++){
							delete opt[arrToRemove[i]];
						}
					}
					
					// Check for an unsetOptionsLevel, if defined to the unset
					if(sourceOptions['default-unsetoptionlevel'] && typeof(sourceOptions['default-unsetoptionlevel']) == "number"){
						unsetOption(sourceOptions, 1, sourceOptions['default-unsetoptionlevel']);
					}*/
					

					// Test: strClass
					if(typeof(strClass) != "string" || strClass.lenght == 0){
						console.log("no string class");
						return sourceOptions;
					}

					// Test: namespace
					if (typeof(namespace) != "string" || namespace.lenght == 0) {
						
						// Try to get the default namespace
						if(sourceOptions['default-namespace'] && typeof(sourceOptions['default-namespace']) == "string"){
							namespace = sourceOptions['default-namespace'];
						} else {
							// This a not a valid namespace
							console.log("no namespace");
							return sourceOptions;
						}
					}
					
					// Get the namespace separator if defined (optional)
					var separatorNS = "";
					if(sourceOptions['default-namespace-separator'] && typeof(sourceOptions['default-namespace-separator']) == "string"){
						separatorNS = sourceOptions['default-namespace-separator'];
					} else {
						separatorNS = "-"; // Use the default
					}
					
					// Get the option separator if defined (optional)
					var separator = "";
					if(sourceOptions['default-separator'] && typeof(sourceOptions['default-separator']) == "string"){
						separator = sourceOptions['default-separator'];
					} else {
						separator = " "; // Use the default
					}
					
					// Check if the the Auto Json option creation are authorized from class
					var autoCreate = false;
					if(sourceOptions['default-autocreate']){
						 autoCreate = true;
					}
					

					
					var arrNamespace = namespace.split(separatorNS);
					

					var arrClass = strClass.split(separator); // Get each defined class
					$.each(arrClass, function(){
						
						// Get only the item larger than the namespace and remove the namespace
						if(namespace == (this.length > namespace.length+separatorNS.length ? this.slice(0, namespace.length): "")){
							// This is a valid parameter, start the convertion to a JSON object
							
							
							// Get all defined parameter
							var arrParameter = this.split(separatorNS).slice(arrNamespace.length);
							
							// That variable is use for synchronization
							var currObj = sourceOptions;
							
							// Set the default property name (this can be overwrited later)
							var propName = arrNamespace[arrNamespace.length - 1];
							
							
							for(i=0; i<arrParameter.length; i++){
								
								var valIsNext = (i+2 == arrParameter.length ? true: false);
								var isVal = (i+1 == arrParameter.length ? true: false);
								

								// console.log('propName:' + propName + ' value:' + arrParameter[i] + ' valIsNext:' + valIsNext + ' isVal:' + isVal);
								
								// Check if that is the default value and make a reset to the parameter name if applicable
								if(isVal && arrParameter.length == 1 && sourceOptions['default-option']){
									propName = sourceOptions['default-option'];
								} else if(!isVal) {
									propName = arrParameter[i];
								}
								
								
								
								
								// Get the type of the current option (if available)
								// (Note: an invalid value are defined by "undefined" value)
								
								// Check if the type are defined
								if(currObj[propName + '-typeof']){
									
									// Repair the value if needed
									var arrValue = [];
									for(j=(i+1); j<arrParameter.length; j++){
										arrValue.push(arrParameter[j]);
									}
									arrParameter[i] = arrValue.join(separatorNS);
									valIsNext = false;
									isVal = true;								
								
									switch(currObj[propName + '-typeof']){
										case "boolean":
											if(arrParameter[i] == "true" || arrParameter[i] == "1" || arrParameter[i] == "vrai" || arrParameter[i] == "yes" || arrParameter[i] == "oui"){
												arrParameter[i] = true;
											} else if(arrParameter[i] == "false" || arrParameter[i] == "0" || arrParameter[i] == "faux" || arrParameter[i] == "no" || arrParameter[i] == "non"){
												arrParameter[i] = false;
											} else {
												arrParameter[i] = undefined;
											}
											break;
										case "number":
											// console.log(arrParameter[i]);
											
											if(!isNaN(parseInt(arrParameter[i]))){
												arrParameter[i] = parseInt(arrParameter[i]);
											} else {
												arrParameter[i] = undefined;
											}
											break;
										case "string":
											break;
										case "undefined":
										case "function":
										case "locked":
											arrParameter[i] = undefined;
											break;
										default:
											// that include the case "object"
											break;
									}
								}
								

								
								
								// Get the type of overwritting, default are replacing the value
								var arrayOverwrite = false;
								if(currObj[propName + '-overwrite-array-mode']){
									arrayOverwrite = true;
								}
								
								// Check if this unique option can be autocreated
								var autoCreateMe = false;
								if(currObj[propName + '-autocreate']){
									autoCreateMe = true;
								}
								
								// console.log('After propName:' + propName + ' value:' + arrParameter[i] + ' valIsNext:' + valIsNext + ' isVal:' + isVal);
								
								
								if(valIsNext && arrParameter[i] !== undefined){
									// Keep the Property Name
									propName = arrParameter[i];
								} else if(isVal && arrParameter[i] !== undefined){
																	
									if(currObj[propName] && arrayOverwrite){
										// Already one object defined and array overwriting authorized
										if($.isArray(currObj[propName])){
											currObj[propName].push(arrParameter[i]);
										} else {
											var val = currObj[propName];
											currObj[propName] = [];
											currObj[propName].push(val);
											currObj[propName].push(arrParameter[i]);
										}
									} else if(currObj[propName] || autoCreate || autoCreateMe || currObj[propName] == 0 || currObj[propName] == false) {
										// Set the value by extending the options
										
										var jsonString = '';
										if(typeof(arrParameter[i]) == "boolean" || typeof(arrParameter[i]) == "number"){
											jsonString = '{\"' + propName + '\": ' + arrParameter[i] + '}';
										} else {
											jsonString = '{\"' + propName + '\": \"' + arrParameter[i] + '\"}';
										}
										currObj = jQuery.extend(true, currObj, jQuery.parseJSON(jsonString));
									}
									
									i = arrParameter.length; // Make sur we don't iterate again
								} else {
									// Create a sub object
									if(arrParameter[i] !== undefined && currObj[arrParameter[i]]){
										// The object or property already exist, just get the reference of it
										currObj = currObj[arrParameter[i]];
										propName = arrParameter[i];
									} else if((autoCreate || autoCreateMe) && arrParameter[i] !== undefined) {
										var jsonString = '{\"' + arrParameter[i] + '\": {}}';
										currObj = jQuery.extend(true, currObj, jQuery.parseJSON(jsonString));
										currObj = currObj[arrParameter[i]];
									} else {
										// This configuration are rejected
										i = arrParameter.length; // We don't iterate again
									}
								}
								
							}
								
								
							
						}
					});
					
					return sourceOptions;
			
			},
			/*// Function to Convert Class instance to JSON
			classToJson: function (el, namespace){
				if (namespace === undefined ) {
				  namespace = 'wb-graph';
				}
				
				// Binded directly with the current option
				// If the option are not exist, refuse the parameter
				// this function check into the options if a typeof are defined (if available) to get the good type for the parameter
				//
				// an options file like
				//		{color: 'blue'}
				//	would be intreprated as a string only
				// but
				// if an options file like
				//		{color: 'blue', "color-typeof": ['string', 'array']}
				//	first instance would be a string, the second or subsequent would be stacked into an array of string
				//		"wb-graph-color-black-blue" would be {color: 'black-blue'}
				//		"wb-graph-color-black wb-graph-color-blue" would be {color: ['black', 'blue']}
				// if an options file like
				//		{color: null, "color-typeof": 'json'}
				//  would create a json object for each param as the number of dash, like wb-graph-color-black-blue would be {color: {black: 'blue'}}
				// 		"wb-graph-color-black-blue" would be {color: {black: 'blue'}}
				
				// This function would try to best inteprete the options type in his best.
				
				
				var sourceOptions = o; // Change the "o" variable for your own option variable (if needed)
				
				var arrNamespace = namespace.split('-');
				
				var strClass = "";
				if(typeof(el) == 'string'){
					strClass = el;
				} else {
					strClass = ($(el).attr('class') != undefined ? $(el).attr('class') : ""); // Get the content of class attribute
				}
				
				var jsonClass = {};

				if(strClass.lenght == 0){
					return jsonClass;
				}

				var arrClass = strClass.split(' '); // Get each defined class
				$.each(arrClass, function(){
					
					// This is for each class defined
					
					if(this.length > namespace.length+1){
					var extractNamespace  = this.slice(0, namespace.length);
					if(extractNamespace == namespace){

						// This is a valid parameter, convert to JSON object for options setup
						var arrParameter = this.split('-').slice(arrNamespace.length),
							currObj = jsonClass,
							navOptions = sourceOptions,
							propName = arrNamespace[arrNamespace.length - 1], // use the last namespace element to define the property by default
							ignoreMe = false,
							ignoreOptionExist = false;
						for(i=0; i<arrParameter.length; i++){
							
							var isEndNode = (i+1 == arrParameter.length ? true : false);
							
							var valeur = arrParameter[i];
							
							
							// Check for the default case (eg. wb-graph-line => default are wb-graph-type-line)
							if(isEndNode && arrParameter.length == 1){
								// Default option need to be defined in the options
								if(navOptions['default-option']){
									var opt = navOptions['default-option'];
									var jsonString = "";
									jsonString = '{\"' + opt + '\": \"' + valeur + '\"}';
								}
							}
							
							if(!isEndNode){
								// Check the corresponding type if exist
								if(!ignoreOptionExist && navOptions[valeur]){
									// Check if a typeof are defined for this options
									
									var typeofDefined = (navOptions[valeur + '-typeof'] ? navOptions[valeur + '-typeof'] : "");
									
									var typeofOption = typeof(navOptions[valeur]); // Get the typeof
									
									// Check if the option are a function, if true ignore the replacement
									if(typeofOption == "function"){
										ignoreMe = true;
									}
									
									
									// a typeof undefined will be intrepreted as "json" or "array" object and will ignore subsequant check for props existance
									if((typeofDefined == "" | typeofDefined == "json" | typeofDefined == "array") && (typeofOption == "object" || typeofOption == "undefined")){
										ignoreOptionExist = true;
									} else {
										
										// Get the rest of the value
										var arrValue = [];
										for(j=(i+1); j<arrParameter.length; j++){
											arrValue.push(arrParameter[j]);
										}
										var val = arrValue.join("-");
										// Parse the value are the proper typeof if possible
										if(val == "true"){
											val = true;
										}
										if(val == "false"){
											val = false;
										}
										if(!isNaN(parseInt(val))){
											val = parseInt(val);
										}
										
										var typeofVal = typeof(val);
										
										if(typeofVal == typeofDefined){ // Possible value: boolean, number or string
											// Set or Add the value
											
										}
										
									}
									
									
									// For an Array object, get the first itm and that would define the type we search
									// eg. Options => {color: ["black"]} == Array of String
									// eg. Options => {color: ["back"], 'color-typeof': 'number'} == Array of number
									
									
									
									
									
									
								} else {
									// Not a valid value, set it to ignoreMe
									ignoreMe = true;
								}
								
							}
							
							
							var valIsNext = false;
							if(i+2 == arrParameter.length){
								valIsNext = true;
							}
							
							var isVal = false;
							if(i+1 == arrParameter.length){
								isVal = true;

								
								// // Fix for boolean value
								// if(arrParameter[i] == "true"){
								//	arrParameter[i] = true;
								// }
								// if(arrParameter[i] == "false"){
								//	arrParameter[i] = false;
								// }
								// if(!isNaN(parseInt(arrParameter[i]))){
								// 	arrParameter[i] = parseInt(arrParameter[i]);
								// }
								
							}
							
							
							// Get the value of the Property
							propName = arrParameter[i];
							
							
							if(valIsNext){
								// Keep the Property Name
								propName = arrParameter[i];
							} else if(isVal){
								
								// Check if they are already an existing value, if yes change the value for an array
								if(!currObj[propName]){
									// Set the value
									var jsonString = '';
									if(arrParameter[i] === true || arrParameter[i] === false || !isNaN(parseInt(arrParameter[i]))){
										jsonString = '{\"' + propName + '\": ' + arrParameter[i] + '}';
									} else {
										jsonString = '{\"' + propName + '\": \"' + arrParameter[i] + '\"}';
									}
									currObj = jQuery.extend(true, currObj, jQuery.parseJSON(jsonString));
								} else {
									if($.isArray(currObj[propName])){
										currObj[propName].push(arrParameter[i]);
									} else {
										var val = currObj[propName];
										currObj[propName] = [];
										currObj[propName].push(val);
										currObj[propName].push(arrParameter[i]);
									}
								}
							} else {
								// Create a sub object
								if(!currObj[arrParameter[i]]){
									var jsonString = '{\"' + arrParameter[i] + '\": {}}';
									currObj = jQuery.extend(true, currObj, jQuery.parseJSON(jsonString));
									// parentObj = jQuery.extend(true, parentObj, currObj));
									currObj = currObj[arrParameter[i]];
								} else {
									// The object or property already exist, just set the reference of
									currObj = currObj[arrParameter[i]];
								}
							}
						}
					}}
				});
				
				return jsonClass;
			
			},*/
			
			tBodySeries: {
				series: [],
				nbRowLevel: undefined,
				nbColLevel: undefined
			}
		};
		
		// Set the new class options if defined
		o = parser.setClassOptions(o, ($(self).attr('class') != undefined ? $(self).attr('class') : ""));

		parser.param = o;

		
		//
		// Type of serie and graph in general
		//
		//	wb-graph-type-line : Linear graphic
		//	wb-graph-type-bar : Single Bar Alone
		//	wb-graph-type-stacked : Same as the Bar but if the previous serie are stacked [line or pie are ignored] would be at the same place over it
		//	wb-graph-type-pie : Pie Chart for that serie [The Pie need to have it's own sqare space]

		// NOTE:
		// class example: wet-graph-color-[color partern]-percent
		// wet-graph-color-rgb255000000 => rgb(255,0,0)
		// wet-graph-color-red => red
		// wet-graph-color-f00 => #f00
		// wet-graph-color-ffffff => #ffffff
		// wet-graph-line
		// TODO: for IE compatibility, translate color name to the appropriate hex code
		

		parser.parse();
		
		
		
		
		//
		// Validate the parameter
		//
		
		//reset width, height to numbers
		o.width = parseFloat((parser.param.width? parser.param.width - o.widthPadding: o.width - o.widthPadding));
		o.width = parseFloat(o.width > (o.maxwidth - o.widthPadding) ? o.maxwidth - o.widthPadding : o.width);
		o.height = parseFloat((parser.param.height? parser.param.height: o.height));

		
		
		// 0 => Nearest of the serie, 1 > series grouping if any
		var DesignerHeadingLevel = parser.tBodySeries.nbRowLevel;
		
		// Get the default Graph Type [Table level]
		
		var GraphTypeTableDefault = '';
		if(parser.param.graph){ // Check for table defined param
			GraphTypeTableDefault = parser.param.graph;
		} else if(parser.param.type){ // Overide the default if the type is clearly defined
			GraphTypeTableDefault = parser.param.type;
		} else { // Fall back to the setting
			GraphTypeTableDefault = o.type;
		}
		
				
		// For each tbody (Graphic Zone)
		$.each(parser.tBodySeries.series, function(){
			
		
			//
			// Determine Type of Graph, if "2d axis graph" or "Circle Graph"
			//
			var nb2dAxisGraph = 0;
			var Series2dAxis = [];
			
			var nbCircleGraph = 0;
			var SeriesCircle = [];
			
			
			
			// Get the default Graph Type [Table Level]
			var GraphTypeTBody = 'line'; // Default of the Param default
			if(parser.param.type){ // Overide the default if the type is clearly defined
				GraphTypeTBody = parser.param.type;
			}
			// Get the default Graph Type [Tbody Level]
			if(this.param.graph){ // Check for table defined param
				GraphTypeTBody = this.param.graph;
			}

			
			
			
			// Check for Series Definied Graph [Row level or Serie level]
			var LastHeaderId = -1;
			var SeriesCellCumulative = [];
			var PreviousGraphType = GraphTypeTBody;
			var PreviousGraphGroup = '';
			var PreviousParam = {};
			var PreviousHeading = {};
			
			var SerieCells = [];
			var fullSerieRejected = true;
			
			$.each(this.series, function(){
				if(this.cellHeading.length == 0){
					this.isRejected = true;
				}
				if(!this.isRejected){
					fullSerieRejected = false;
					
					var isCumulative = false;
					
					// Get the param for the appropriate designer heading level
					var SerieObj = {}
					
					if(this.cellHeading.length > DesignerHeadingLevel){
						// This implicate data cumulation for the series grouping
						SerieObj = this.cellHeading[DesignerHeadingLevel];
						
						
						if(LastHeaderId == SerieObj.id){
							SeriesCellCumulative.push(jQuery.extend(true, {}, SerieObj));
						} else {
							// Compile the series
							var MasterSeriesCell = [];
							
							// Sum of each cell for each series
							$.each(SeriesCellCumulative, function(){
								for(i=0; i<this.cell.length; i++){
									
									if(MasterSeriesCell.length <= i){
										MasterSeriesCell.push(this.cell[i]);
									} else {
										MasterSeriesCell[i] += this.cell[i];
									}
								}
							});
							
							// Get the average
							for(i=0; i<MasterSeriesCell.length; i++){
								MasterSeriesCell[i] = MasterSeriesCell[i]/SeriesCellCumulative.length;
							}
							
							
							if(PreviousGraphGroup=='2daxis'){
								
								var seriesObj={
									cell: MasterSeriesCell,
									type: PreviousGraphType,
									param: PreviousParam,
									header: PreviousHeading
								};
								
								Series2dAxis.push(seriesObj);
							} else if(PreviousGraphGroup=='cicle'){
								var seriesObj={
									cell: MasterSeriesCell,
									type: PreviousGraphType,
									param: PreviousParam,
									header: PreviousHeading
								};
								
								SeriesCircle.push(seriesObj);
							}
							
							// SerieCells = MasterSeriesCell;
							
							// That is the SerieCells for the previous item ????   not the current one :-(
							
							SeriesCellCumulative = []; // Reset the cumulative system
							SeriesCellCumulative.push(jQuery.extend(true, {}, SerieObj)); // Add the current series
							PreviousParam = SerieObj.param;
						}
						
						
					} else {
						// This the lowest serie base on the table
						// console.log(this.cellHeading);
						SerieObj = this.cellHeading[this.cellHeading.length - 1];
						
						// Add the Previous SeriesCells
						if(PreviousGraphGroup=='2daxis'){
							var seriesObj={
								cell: SerieCells,
								type: PreviousGraphType,
								param: PreviousParam,
								header: PreviousHeading
							};
							
							Series2dAxis.push(seriesObj);
						} else if(PreviousGraphGroup=='cicle'){
							var seriesObj={
								cell: SerieCells,
								type: PreviousGraphType,
								param: PreviousParam,
								header: PreviousHeading
							};
							
							SeriesCircle.push(seriesObj);
						}
						
						SerieCells = this.cell;
						PreviousParam = SerieObj.param;
					}
					
					PreviousHeading = SerieObj;
					
					
					var GraphType = '';
					if(SerieObj.param.type){
						GraphType = SerieObj.param.type;
					} else {
						GraphType = GraphTypeTBody;
					}
					
					
					
					if(GraphType == 'bar' || GraphType == 'stacked' || GraphType == 'line' || GraphType == 'area'){
						nb2dAxisGraph ++;
						PreviousGraphGroup = '2daxis';
						PreviousGraphType = GraphType;
					} else if(GraphType == 'pie'){
						nbCircleGraph ++;
						PreviousGraphGroup = 'cicle';
						PreviousGraphType = GraphType;
					} else {
						// Not suppose to happen, TODO later do something in case of....
					}
					
					LastHeaderId = SerieObj.id;
				
				}
			});
			
			
			
			
			var MasterSeriesCell = [];

			
			// Sum of each cell for each series
			$.each(SeriesCellCumulative, function(){
				for(i=0; i<this.cell.length; i++){
					
					if(MasterSeriesCell.length <= i){
						MasterSeriesCell.push(this.cell[i]);
					} else {
						MasterSeriesCell[i] += this.cell[i];
					}
				}
			});
			
			
			
			// Get the average
			for(i=0; i<MasterSeriesCell.length; i++){
				MasterSeriesCell[i] = MasterSeriesCell[i]/SeriesCellCumulative.length;
			}
			
			
			
			if(MasterSeriesCell.length != 0){
				SerieCells = MasterSeriesCell;
			}
			
			
			if(PreviousGraphGroup=='2daxis'){
				var seriesObj={
					cell: SerieCells,
					type: PreviousGraphType,
					param: PreviousParam,
					header: PreviousHeading
				};
				
				Series2dAxis.push(seriesObj);
			} else if(PreviousGraphGroup=='cicle'){
				var seriesObj={
					cell: SerieCells,
					type: PreviousGraphType,
					param: PreviousParam,
					header: PreviousHeading
				};
				
				SeriesCircle.push(seriesObj);
			}
			
			
			
			var Group2dSeriesObj = {
				heading: parser.tBodySeries.ColHeading,
				nbRowLevel: parser.tBodySeries.nbRowLevel,
				nbColLevel: parser.tBodySeries.nbColLevel,
				series: Series2dAxis
			};
			var GroupCircleSeriesObj = {
				heading: parser.tBodySeries.ColHeading,
				nbRowLevel: parser.tBodySeries.nbRowLevel,
				nbColLevel: parser.tBodySeries.nbColLevel,
				series: SeriesCircle
			};
			
			
			if(Group2dSeriesObj.series.length > 0){
				// console.log(parser);
				// console.log(Group2dSeriesObj);
				
				// Initiate the Graph zone
				charts.graph2dAxis.init(Group2dSeriesObj, o);
			}
			
			
			if(GroupCircleSeriesObj.series.length > 0){
				// Initiate the Graph Circle zone
				charts.circleGraph.init(GroupCircleSeriesObj, o);
			}
	
			// Create a container next to the table (Use Section for an HTML5 webpage)
			// TODO: do something if the person have specified the container
			// var paperContainer = (container || $('<div style="margin-top:10px; margin-bottom:10px" \/>').insertAfter(self));
			
			
			
			
			// var paperContainer = $('<div style="margin-top:10px; margin-bottom:10px" \/>').insertAfter(parser.sourceTblSelf);
			var paperContainer = $('<figure />').insertAfter(parser.sourceTblSelf);
			
			// $(paperContainer).addClass(
			
			// Set the width of the container
			$(paperContainer).width(o.width + o.widthPadding);
			
			//
			// Add the container class
			//
			$(paperContainer).addClass(o["default-namespace"]);
			
			
			
			// Set the container class if required, by default the namespace is use as a class
			if(parser.param.graphclass){
				if($.isArray(parser.param.graphclass)){
					for(i=0;i<parser.param.graphclass.length;i++){
						$(paperContainer).addClass(parser.param.graphclass[i]);
					}
				} else {
					$(paperContainer).addClass(parser.param.graphclass);
				}
			} 
			
			
			
			// console.log(parser.param);
			
			
			
			// Create the drawing object
			var paper;
			
			
			
			if(GroupCircleSeriesObj.series.length > 0){
			
				// For the circle Graph, use Separate Paper for each Series, that would fix a printing issue (graph cutted when printed)
				paper = [];
				var lstpaperSubContainer = [];
				
				$.each(GroupCircleSeriesObj.series, function(){
					// var subContainer = $(paperContainer).append('<div />');
				
			
					// Add the caption for the series
					var serieCaption = $('<figcaption />');
					
					$(serieCaption).append(this.header.rawValue); // Set the caption text
					// var serieCaptionID = 'graphcaption' + paper.length + new Date().getTime(); // Generate a new ID
					// $(serieCaption).attr('id', serieCaptionID); // Add the new ID to the title
					
				
					
					// var subContainer = $('<div />');
					var subContainer = $('<figure />');
					
					$(paperContainer).append(subContainer);
					
					lstpaperSubContainer.push(subContainer);
					
					//
					// Amélioré l'accessibility avec l'images
					//

					// $(subContainer).attr('role', 'img'); // required if is a div element
					//$(subContainer).attr('aria-labelledby', serieCaptionID);


					var subPaper = Raphael($(subContainer).get(0), charts.circleGraph.width, charts.circleGraph.height);
					
					// Add the caption
					$(serieCaption).prependTo($(subContainer));
					
					// $(serieCaption).insertBefore($(subPaper));
					//$(paperContainer).append(serieCaption);
					
					paper.push(subPaper);
					
					
					// charts.circleGraph.generateGraph(subContainer, subPaper);
					
				});
				
				charts.circleGraph.generateGraph(lstpaperSubContainer, paper);
				// charts.circleGraph.generateGraph(paperContainer, paper);
			}
			
			
			
			if(Group2dSeriesObj.series.length > 0){
				paper = Raphael($(paperContainer).get(0), o.width, o.height);
				charts.graph2dAxis.generateGraph(paperContainer, paper);
			}
			
			
	
			

			
			
			
			//
			// Add the Graph Title and Make it Accessible
			//
			
			// Get the VML or SVG tag and/or object
			
			
			if(!fullSerieRejected){
				// var paperDOM = $(paperContainer).children();

				
				
				// Create the Graph Caption
				var graphTitle = $('<figcaption />')
				// Transpose any inner element
				$(graphTitle).append($('caption', parser.sourceTblSelf).html());

				// Set the Graph Title
				if(parser.param.endcaption){
					$(paperContainer).append(graphTitle); // Put the caption at the end
				} else {
					$(paperContainer).prepend(graphTitle); // Default
				}
				
				
				var setAccessiblity = function(){
					
					// Generate a unique id for the Graph Title
					// var TitleID = 'graphtitle'+ new Date().getTime(); // Generate a new ID
					// $(graphTitle).attr('id', TitleID); // Add the new ID to the title
					
					// Check if the source Table have an id, if not generate a new one
					
					var tblId = $(parser.sourceTblSelf).attr('id');
					if(tblId == undefined || tblId == ''){
						tblId = 'graphsource'+ new Date().getTime(); // Generate a new ID
						$(parser.sourceTblSelf).attr('id', tblId); // Add the new ID to the table
					}
					
					// $(paperContainer).attr('role', 'img'); This are not needed because the Container are set to Figure element
					// $(paperContainer).attr('aria-labelledby', TitleID);
					$(paperContainer).attr('aria-describedby', tblId);

					//console.log(charts.graph2dAxis.paperDOM);
					
					// $(paperDOM).attr('role', 'presentation');
					// $(charts.graph2dAxis.legendContainer).attr('role', 'presentation');
					
				};

				// Make the graph Accessible
				setAccessiblity();
			} else {
				// Destroy the paper container
				$(paperContainer).remove();
			}
			
			
			
			// Create the Drawing Zone
			
			// Draw the graphic
			
			
			// console.log(SeriesCircle);
			
			// console.log(charts.graph2dAxis);
			

			
		});
				
				
		
		
		// designer.init();
		
		
		
		


	
	// console.log(parser);
	
	// The graphic are draw, hide if requested the source table
	if(parser.param.hide){
		parser.sourceTblSelf.hide();
	}
	
	}).next();
};
})(jQuery);


function colourNameToHex(colour)
		{
			var colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff","beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887","cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff","darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f","darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1","darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff","firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff","gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f","honeydew":"#f0fff0","hotpink":"#ff69b4","indianred ":"#cd5c5c","indigo ":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c","lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2","lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de","lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6","magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee","mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5","navajowhite":"#ffdead","navy":"#000080","oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6","palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1","saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4","tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0","violet":"#ee82ee","wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5","yellow":"#ffff00","yellowgreen":"#9acd32"};

			return (typeof colours[colour.toLowerCase()] != 'undefined' ? colours[colour.toLowerCase()] : ($.isArray(o.colors)? o.colors[0]: o.colors));
		}
