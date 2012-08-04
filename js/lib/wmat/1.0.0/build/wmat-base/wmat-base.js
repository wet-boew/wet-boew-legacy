/*!
 * Geomap v1.3 / Géocarte v1.3
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */
 (function() {
    YUI_config = {
        gallery: 'gallery-2011.03.11-23-49', //'gallery-2010.12.10-17-31',
        //filter: 'debug',
        groups: {
            wmat: {
                //base : 'http://' + this.location.host + '/wmat/js/1.0.0/build/',
                // finds out where wmat-base.js is linked from and create a base url to load dependencies
                base: (function baseSelector() {
                    var scriptTags = document.getElementsByTagName('script'),
                        wmatVersion = '1.0.0',
                        partialUrl = wmatVersion + '/build/wmat-base/wmat-base.js',
                        i, re, tag, indexOfPartialUrl, wmatBaseUrl;
                    
                    if (scriptTags) {
                        re = new RegExp(partialUrl, 'i');

                        for (i = 0; i < scriptTags.length; i += 1) {
                            tag = scriptTags[i];
                            indexOfPartialUrl = tag.src.search(re);
                            if (indexOfPartialUrl !== -1) {
                                wmatBaseUrl = tag.src.substring(0, indexOfPartialUrl) + wmatVersion + '/build/';
                                break;
                            }
                        }
                    }
                    
                    if (!wmatBaseUrl) {
                        wmatBaseUrl = 'http://maps-cartes.ec.gc.ca/wmat/js/' + wmatVersion + '/build/';
                    }
                    
                    return wmatBaseUrl;
                })(),
                modules : {
                    'navigation' : {
                        requires : ['widget', 'widget-position', 'slider'],
                        lang : ['en', 'fr'],
                        skinnable: true
                    },
                    
                    'queryresults' : {
                        requires : ['widget', 'gallery-simple-datatable', 'gallery-plugin-paginate-base', 'gallery-plugin-simple-datatable-paginate-client'],
                        lang : ['en', 'fr'],
                        skinnable: true
                    },

                    'mapscale': {
						requires: ['widget', 'substitute', 'datatype-number'],
						lang: ['en', 'fr'],
                        skinnable: true
                    },

                    'legend': {
						requires: ['widget', 'widget-position', 'substitute'],
                   		lang: ['en', 'fr'],
                        skinnable: true
                    }
                }
            }
        },
        
        skin : {
            base : 'assets/skins/',
            overrides : {
                navigation : ['wmat'],
                queryresults : ['wmat'],
                mapscale : ['wmat'],
                legend : ['wmat']
            }
        }
    };
}());
