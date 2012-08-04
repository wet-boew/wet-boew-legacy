/*!
 * Geomap v1.3 / Géocarte v1.3
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */

/**
* GeomapQueryresultsPlugin is a Geomap plugin that adds data points support. Assuming a REST MapServer with queryable layers, it makes a 
* cross domain call to retrieve data pertinent to the query. It utilizes the WMAT Queryresults widget to output data points in the form of 
* an accessible table.
* 
* For this demo we are using the layer number 1 from the WMAT MapServer (http://maps-cartes.ec.gc.ca/ArcGIS/rest/services/WMAT/MapServer) that 
* has a set of dummy points. To use a different REST MapServer, you may need to adjust a query string that is being sent to the sever and 
* adjust handling of the returned data to properly display it on the page.
* 
* The Queryresults is a YUI widget that is responsible for rendering columnar data into an accessible HTML table. The Queryresults visualizes 
* structured data as a table and provides highly customizable pagination controls to break long data sets into pages. 
* (http://maps-cartes.ec.gc.ca/wmat/widgets/queryresults/queryresultsDemo.aspx)
* 
* 
* Supports : Firefox, Opera, Safari, Chrome, IE 7+
*
* @author Aleksuei Riabtsev, Christopher Varano
* @version 1.0
**/

/* The following code adheres to the Code Conventions for the JavaScript Programming Language (http://javascript.crockford.com/code.html).
Be sure to run JSlint on the code (http://www.jslint.com/) after making changes. */

/*global YUI, PE, YUI_config, Utils, map, OpenLayers, document, jQuery*/

(function geomapQueryresultsPlugin($) {
	
	var queryresultsWidget,
		parameters,
		// prototype of a REST service interface object
		servicePrototype = {
			mapServiceUrl : "",
			//The result of this operation is a resultset resource. This resource provides information about query results including 
			//the values for the fields requested by the user. If you request geometry information, the geometry of each result is also 
			//returned in the resultset.
			queryLayer: function (layerNumber, where, returnGeometry) {
				var link;
				link = this.mapServiceUrl + "/" + layerNumber + "/query";
				link += "?where=" + where;
				link += "&returnGeometry=" + returnGeometry;
				link += "&outFields=*";
				link += "&f=json";
				link += "&callback={callback}";
				return link;
			}
		},
		
		DETAIL_SECTION_TEMPLATE	=	'<div id="detailSection">' +
										'<div id="detailSectionHeader">' + 
											'<h2 id="detailSectionTitle"><span></span></h2>' + 
										'</div>' + 
										'<div id="detailSectionBody">' +
											'<div id="detailSectionTable">' +
												'<ul id="detailSectionDataList"></ul>' +
											'</div>' +
										'</div>' + 
									'</div>',
		
		DETAILS_TEMPLATE	=	'<li class="{rowClass}">' +
									'<h3 class="detailSectionProjectHeader"><span>{prj_nam_en} ({CATEG_NAM_ENG})</span></h3>' +
									'<span class="organizationName">{PROV_ID}</span><br>' + 
									'<span class="organizationName">{ORG_NAM}</span><br>' +
									'<span>Marcian\'s Contribution = $</span><span class="ecContribution">{PRJ_AMOUNT}</span><br>' +
									'<p><span>{prj_desc_en}</span></p><p class="projectDuration"><span>{REAL_START_DAT}</span></p>' +
								'</li>';
	
	//loads YUI library and WMAT widgets if they are not already loaded
	function loadDependencies() {
		if (typeof YUI === "undefined") {
		    //load either from external or internal source
			//PE.loadExternal('http://yui.yahooapis.com/3.3.0/build/yui/yui-min.js');
			PE.load('yui-min.js');
		}

		if ((typeof YUI_config === "undefined") ||
				(typeof YUI_config.groups === "undefined") ||
				(typeof YUI_config.groups.wmat === "undefined")) {
			//load either from external or internal source
			//PE.loadExternal('http://maps-cartes.ec.gc.ca/wmat/js/1.0.0/build/wmat-base/wmat-base.js');
			PE.load('wmat/1.0.0/build/wmat-base/wmat-base.js');
		}
	}
	
	function init() {
	    // get the plugin parameters from the html page
		parameters = Utils.loadParamsFromScriptID("geomapQueryresults");
		
		YUI(
		    {
		        //specifying the language widgets should use
		        lang: parameters.lang
		    }
		).use('node', 'event', 'jsonp', 'queryresults', function (Y) {
			var query = {
					'provinceName' : Y.one('#queryProvinceSelector'),
					'companyName' : Y.one('#queryCompanyNameTextbox')
				},
				buttons =   {
					'execute' : Y.one('#queryExecuteButton'),
					'reset' : Y.one('#queryResetButton')
				},
				mapService = Y.Object(servicePrototype),
				markersToDisplay = [],
				detailSection, 
				detailSectionDataList, 
				detailSectionTitle,
				markerLayer,
				widgetHeaders =   {
			        en : { 'PROV_ID': 'PRV', 'ORG_NAM': 'Organization', 'prj_nam_en': 'Project Name', 'round_year': 'Year' },
			        fr : { 'PROV_ID': 'PRV', 'ORG_NAM': 'Organisation', 'prj_nam_fr': 'Nom du projet', 'round_year': 'Année' }
				};
			
			mapService.mapServiceUrl = parameters.restServiceUrl;
			
			// instantiate the Queryresults widget
			queryresultsWidget = new Y.Queryresults({
				position: 'both',
				pagesToDisplay: 7,
				itemsPerPageSelector: false,
				itemsPerPageValues: false,
				gotoPageSelector: false,
				pluginHighlight: true,
				pluginRowClick: true,
				pluginRowClickHeader: 'ORG_NAM',
				pluginAria: true
			}).render('#queryresultsGrid').hide();
			
			// creates a marker layer and adds it to the map
			function createMarkerLayer() {
			    if (map) {
			        markerLayer = new OpenLayers.Layer.Markers('Markers', {numZoomLevels : 20});
			        map.addLayers([markerLayer]);
			        return true;
			    } else {
			        return false;
			    }
			}
			
			// creating additional HTML markup for displaying additional details about one or more datapoints
			function initDetailSection() {
				detailSection = Y.Node.create(DETAIL_SECTION_TEMPLATE);
				detailSectionDataList = detailSection.one('#detailSectionDataList');
				detailSectionTitle = detailSection.one('#detailSectionTitle span');
				detailSection.set('aria-live', 'polite');
				detailSection.hide();
				Y.one('#geomap').insert(detailSection, 'after');
			}
			
			// displaying additional details about datapoints in the previously created HTML markup
			function displayDetailSection(data) {
				var i, prj, alterRow = false;
				
				if (data.message) {
				    detailSectionTitle.setContent(data.message);
				}
				
				detailSectionDataList.purge(true);
				detailSectionDataList.get('childNodes').remove(true);
				
				for (i = 0; i < data.projects.length; i += 1) {
					prj = data.projects[i];
					
					detailSectionDataList.appendChild(
						Y.Node.create(
							Y.substitute(DETAILS_TEMPLATE, 
								Y.merge(prj, {rowClass : !alterRow || 'alterRow'})
								)
						)
					);

					alterRow = !alterRow;
				}
				
				detailSection.show();
			}
			
			// retriving data from the query form and incorporating them into a layer definition of the REST query string
			function getQueryData() {
				var inputData, 
					options = query.provinceName.get('elements'), 
					option = options.shift(), 
					provinceName = "", 
					companyName;

				while (option) {
					if (option.get('checked') === true) {
						provinceName += ",'" + option.get('value') + "'";
					}
					option = options.shift();
				}
				provinceName = provinceName.substring(1);
				
				// replacing spaces with the "%" wildcard
				companyName = "'%25" + query.companyName.get('value').replace(/ /gi, "%25") + "%25'";
				
				inputData = 'PROV_ID IN (' + provinceName + ') AND ORG_NAM LIKE (' + companyName + ')';

				return inputData;
			}
			
			// reseting the query form and hiding the queryresults widget
			function resetQueryFunction(ev, resetForm) {
				var marker = markersToDisplay.shift(),
					options = query.provinceName.get('elements'),
					option = options.shift();
				
				// reseting checkboxes
				if (resetForm) {
					while (option) {
						option.set('checked', false);
						option = options.shift();
					}
				}
				
				while (marker) {
					markerLayer.removeMarker(marker);
					marker = markersToDisplay.shift();
				}
				detailSection.hide();
				queryresultsWidget.hide();
			}
			
			// retriving data according to the user query and populating the queryresults widget with it
			function executeQueryFunction() {
				var inputData = getQueryData();
				
				// displaying additional details on marker click
				function markerClick(ev) {
					displayDetailSection({ projects: this.data.projects, message: 'Project Details' });
				}
                
                // displaying point details on marker hover
				function markerHover(ev) {
					if (this.popup === null) {
						this.popup = this.createPopup(this.closeBox);
						map.addPopup(this.popup);
						this.popup.show();
					} else {
                        this.popup.toggle();
					}
				}
				
				// callback function
				function handleQueryResponse(response) {
					var i, feature, mapFeature, attribute,
					    // headers is an object specifying what properties will be displayed in the queryresults widget
						headers = widgetHeaders[parameters.lang],
						bounds = new OpenLayers.Bounds(),
						rows = [];

					resetQueryFunction();
					
					if (response.features) {
						for (i = 0; i < response.features.length; i += 1) {
							feature = response.features[i];
							
							rows[i] = {};
							for (attribute in feature.attributes) {
								if ((feature.attributes.hasOwnProperty(attribute))) {
									rows[i][attribute] = feature.attributes[attribute];
								}
							}
							
							// calculating bounds
							bounds.top = bounds.top ? Math.max(feature.attributes.prj_latitude, bounds.top) : feature.attributes.prj_latitude;
							bounds.bottom = bounds.bottom ? Math.min(feature.attributes.prj_latitude, bounds.bottom) : feature.attributes.prj_latitude;
							bounds.left = bounds.left ? Math.min(feature.attributes.prj_longitude, bounds.left) : feature.attributes.prj_longitude;
							bounds.right = bounds.right ? Math.max(feature.attributes.prj_longitude, bounds.right) : feature.attributes.prj_longitude;
							
							// creating markers and adding them to the markers layer
							mapFeature = new OpenLayers.Feature(markerLayer, new OpenLayers.LonLat(feature.attributes.prj_longitude, feature.attributes.prj_latitude));
							mapFeature.data.projects = [rows[i]];

							mapFeature.closeBox = false;
							mapFeature.popupClass = OpenLayers.Class(OpenLayers.Popup.AnchoredBubble, { 'autoSize': true });
							mapFeature.data.popupContentHTML = rows[i].prj_nam_en;
							mapFeature.data.overflow = "hidden";

							markersToDisplay[i] = mapFeature.createMarker();
							markersToDisplay[i].id = i;
							markersToDisplay[i].events.register("mousedown", mapFeature, markerClick);
							markersToDisplay[i].events.register("mouseover", mapFeature, markerHover);
							markersToDisplay[i].events.register("mouseout", mapFeature, markerHover);
							markerLayer.addMarker(markersToDisplay[i]);
						}

						if (response.features.length !== 0) {
							queryresultsWidget.show();
							queryresultsWidget.set('headers', headers);
							queryresultsWidget.set('rows', rows);
							
							map.zoomToExtent(bounds);
							map.zoomOut();
						}
					}
				}
				
				// create the markers layer if id doesn't exist
				if ((markerLayer) || (createMarkerLayer())) {
				    // retriving data from the specified REST service using a cross domain call
				    Y.jsonp(mapService.queryLayer(parameters.layerNumber, inputData, false), handleQueryResponse);    
				}
			}
			
			// attach a listener to a submit button click
			if (buttons.reset) {
				buttons.reset.on('click', resetQueryFunction, this, true);
			}
			
			// attach a listener to a reset button click
			if (buttons.execute) {
				buttons.execute.on('click', executeQueryFunction);
			}
			
			// attach a listener to a widget "Show More" link click
			queryresultsWidget.on('queryresults:rowClick', function onQueryresultsRowClick(e) {
				displayDetailSection({projects: [e.row], message: 'Project Details'});
			});
			
			initDetailSection();
				  
		});
	}
	
	loadDependencies();
	$(document).ready(init);
	
	return {
		queryresultsWidget: function returnQueryresultsWidget() {
			return this.queryresultsWidget;
		}
	};
	
}(jQuery));