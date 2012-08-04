/*!
 * Geomap v1.3 / Géocarte v1.3
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */
YUI.add('queryresults-base', function(Y) {

/* QueryresultsBase class constructor */
function QueryresultsBase(config) {
    QueryresultsBase.superclass.constructor.apply(this, arguments);
}

/* 
 * Required NAME static field, to identify the Widget class and 
 * used as an event prefix, to generate class names etc. (set to the 
 * class name in camel case). 
 */
QueryresultsBase.NAME = "queryresults-base";

/*
 * The attribute configuration for the widget. This defines the core user facing state of the widget
 */
QueryresultsBase.ATTRS = {
    // Object of headers to be displayed. {key: 'Display'} pattern. Key is used to match values to be displayed for row data.
    headers : {
        value : {}
    },
    
    // Array of objects with a similar pattern to the headers.
    rows : {
        value : {}
    },
    
    // Highlights rows on hover.
    pluginHighlight : {
        value : false,
        writeOnce: true,
        setter : '_setBooleanValue'
    },
    
    // Adds an extra column with a "Show more" link in it.
    pluginRowClick : {
        value : false,
        writeOnce: true,
        setter : '_setBooleanValue'
    },
    
    pluginRowClickHeader : {
        value : ''
    },
    
    // Adds ARIA landmarks and roles to the widget.
    pluginAria : {
        value : false,
        writeOnce: true,
        setter : '_setBooleanValue'
    },
    
    // Specifies the position of pagination controls.
    position : {
        value : 'before'
    },
    
    // The number of the current page.
    currentPageNumber : {
        value : 1,
        setter : '_setIntegerValue'
    },
    
    // The number of items displayed per page.
	itemsPerPage : {
        value : 10
    },
    
    // The maximum number of page links displayed.
	pagesToDisplay : {
        value : 10
    },
    
    // Specifies visiblity of the page links.
	pageButtons : {
        value : true
    },
    
    // Specifies visibility of the "First page" link
	firstPageButton : {
        value : true
    },
    
    // Specifies visibility of the "Last page" link
	lastPageButton : {
        value : true
    },
    
    // Specifies visibility of the "Next page" link
	nextPageButton : {
        value : true
    },
    // Specified visibility of the "Previous page" link
	previousPageButton : {
        value : true
    },
    
    // Specifies visibility of the "Goto page" selector
	gotoPageSelector : {
        value : true
    },
    
    // Specifies visibility of the "Items per page" selector
	itemsPerPageSelector:  {
        value : true
    },
    
    // A set of number a user can choose from to modify the number of items displayed per page.
	itemsPerPageValues : {
        value : [10, 20, 30, 40, 50]
    },
    
    strings : {
        value : Y.Intl.get('queryresults'),
        readOnly : true
    }
};

/* 
 * The HTML_PARSER static constant is used if the Widget supports progressive enhancement, and is
 * used to populate the configuration for the MyWidget instance from markup already on the page.
 */
QueryresultsBase.HTML_PARSER = {
    
    // extracts headers from the existing HTML markup
    headers : function(srcNode) {
        var headerCells, headers = {},
            cell, i;
            
        if (srcNode.test('table'))
        {
            headerCells = srcNode.all('th');
            
            cell = headerCells.shift();
            i = 1;
            
            while (cell) {
                headers['c' + i] = cell.get('text');
                
                cell = headerCells.shift();
                i += 1;
            }
        }
        
        return headers;
    },
    
    // extracts data from the existing HTML markup
    rows : function(srcNode) {
        var dataRows, dataRow, rows = [], row = [],
            cell, i, j;
            
        if (srcNode.test('table'))
        {
            dataRows = srcNode.all('tbody tr');
            dataRow = dataRows.shift();
            if (dataRow) {
                dataRow = dataRow.all('td');
                i = 1;
                
                while (dataRow) {
                    
                    if (!dataRow.isEmpty()) {
                    
                        cell = dataRow.shift();
                        row = [];
                        j = 1;
                        
                        while (cell) {
                            row.push(cell.get('text'));
                            
                            cell = dataRow.shift();
                            j += 1;
                        }
                        
                        rows.push(row);
                    }
                    
                    dataRow = dataRows.shift();
                    if (dataRow) {
                        dataRow = dataRow.all('td');
                    }        
                    i += 1;
                }
            }
        }
        
        return rows;
    }

};

/* QueryresultsBase extends the base Widget class */
Y.QueryresultsBase = Y.extend(QueryresultsBase, Y.Widget, {

    initializer: function() {
        /*
         * initializer is part of the lifecycle introduced by 
         * the Base class. It is invoked during construction,
         * and can be used to setup instance specific state or publish events which
         * require special configuration (if they don't need custom configuration, 
         * events are published lazily only if there are subscribers).
         *
         * It does not need to invoke the superclass initializer. 
         * init() will call initializer() for all classes in the hierarchy.
         */
        var contentBox = this.get('contentBox');
        
        // if the source node was indicated (an existing HTML table), create a new div container from the template
        // and substitute it for the source node
        if (!contentBox.test('div')) {
            contentBox = Y.Node.create(this.CONTENT_TEMPLATE);
            this._set('contentBox', contentBox);    
        }
    },

    destructor : function() {
        /*
         * destructor is part of the lifecycle introduced by 
         * the Widget class. It is invoked during destruction,
         * and can be used to cleanup instance specific state.
         *
         * Anything under the boundingBox will be cleaned up by the Widget base class
         * We only need to clean up nodes/events attached outside of the bounding Box
         *
         * It does not need to invoke the superclass destructor. 
         * destroy() will call initializer() for all classes in the hierarchy.
         */
    },

    renderUI : function() {
        /*
         * renderUI is part of the lifecycle introduced by the
         * Widget class. Widget's renderer method invokes:
         *
         *     renderUI()
         *     bindUI()
         *     syncUI()
         *
         * renderUI is intended to be used by the Widget subclass
         * to create or insert new elements into the DOM. 
         */
        
        var contentBox = this.get("contentBox");
        
        this.grid = new Y.SimpleDatatable();
                    
        if (this.get('pluginHighlight')) {
            this.grid.plug(Y.QueryresultsHighlight);
        }
        
        if (this.get('pluginRowClick')) {
            this.grid.plug(Y.QueryresultsClick);
            this.grid.queryresultsClick.set('pluginRowClickHeader', this.get('pluginRowClickHeader'));
        }
        
        if (this.get('pluginAria')) {
            this.grid.plug(Y.QueryresultsAria);
        }
        
        this.grid.plug(Y.QueryresultsControls).render(contentBox);
        
        this.grid.controls.setAttrs({
            position: this.get('position'),
            itemsPerPage : this.get('itemsPerPage'),
            pagesToDisplay : this.get('pagesToDisplay'),
            pageButtons: this.get('pageButtons'),
            firstPageButton : this.get('firstPageButton'),
            lastPageButton : this.get('lastPageButton'),
            nextPageButton : this.get('nextPageButton'),
            previousPageButton : this.get('previousPageButton'),
            gotoPageSelector: this.get('gotoPageSelector'),
            itemsPerPageSelector : this.get('itemsPerPageSelector'),
            itemsPerPageValues : this.get('itemsPerPageValues')
        });
    },

    bindUI : function() {
        
        /*
         * bindUI is intended to be used by the Widget subclass 
         * to bind any event listeners which will drive the Widget UI.
         * 
         * It will generally bind event listeners for attribute change
         * events, to update the state of the rendered UI in response 
         * to attribute value changes, and also attach any DOM events,
         * to activate the UI.
         */
         
        this.after('headersChange', this._afterHeadersChange, this);
        this.after('rowsChange', this._afterRowsChange, this);
        this.after('pluginRowClickHeaderChange', this._afterRowClickHeaderChange, this);
         
        this.after('positionChange', this._afterControlsProperyChange, this);
        this.after('currentPageNumberChange', this.grid.controls.setCurrentPageNumber, this.grid.controls);
        this.after('itemsPerPageChange', this._afterControlsProperyChange, this);
        this.after('pagesToDisplayChange', this._afterControlsProperyChange, this);
        this.after('pageButtonsChange', this._afterControlsProperyChange, this);
        this.after('firstPageButtonChange', this._afterControlsProperyChange, this);
        this.after('lastPageButtonChange', this._afterControlsProperyChange, this);
        this.after('nextPageButtonChange', this._afterControlsProperyChange, this);
        this.after('previousPageButtonChange', this._afterControlsProperyChange, this);
        this.after('gotoPageSelectorChange', this._afterControlsProperyChange, this);
        this.after('itemsPerPageSelectorChange', this._afterControlsProperyChange, this);
        this.after('itemsPerPageValuesChange', this._afterControlsProperyChange, this);
        
        this.grid.on('queryresults:rowClick', this._onRowClick, this);
        
        this.grid.controls.after('currentPageNumberChange', this._afterCurrentPageNumberChange, this);
    },

    syncUI : function() {
        /*
         * syncUI is intended to be used by the Widget subclass to
         * update the UI to reflect the initial state of the widget,
         * after renderUI. From there, the event listeners we bound above
         * will take over.
         */
        
        this.grid.set('headers', this.get('headers'));
        this.grid.setHeaders(this.get('headers'));
        this.grid.set('rows', this.get('rows'));
        if (this.grid.queryresultsClick) {
            this.grid.queryresultsClick._addShowMoreButtonColumn();
        }
    },        
    
    // Beyond this point is the MyWidget specific application and rendering logic
    
    // Updates headers attributes and forces reconstruction of the table also invoking the queryresultsClick plugin if needed
    _afterHeadersChange : function(ev) {
        this.grid.set(ev.attrName, ev.newVal);
        this.grid.setHeaders(ev.newVal);
        if (this.grid.queryresultsClick) {
            this.grid.queryresultsClick._addShowMoreButtonColumn();
        }
    },
    
    // Updates rows attributes and forces reconstruction of the table also invoking the queryresultsClick plugin if needed
    _afterRowsChange : function(ev) {
        this.grid.set(ev.attrName, ev.newVal);
        if (this.grid.queryresultsClick) {
            this.grid.queryresultsClick._addShowMoreButtonColumn();
        }
    },
    
    // Updates the "show more" button text
    _afterRowClickHeaderChange : function(ev) {
        if (this.grid.queryresultsClick) {
            this.grid.queryresultsClick.set('pluginRowClickHeader', ev.newVal);
            this.grid.queryresultsClick._addShowMoreButtonColumn();
        }
    },
    
    // Updates the changed property of a pagination control
    _afterControlsProperyChange : function(ev) {
        this.grid.controls.set(ev.attrName, ev.newVal); 
    },
    
    _onRowClick : function(ev) {
        this.fire('queryresults:rowClick', {'row' : ev.row });
    },
    
    // Updates the data in the table on currentPageNumberChange event
    _afterCurrentPageNumberChange : function(ev) {
        this.set('currentPageNumber', ev.newVal);
    },
    
    /* Attribute state supporting methods (see attribute config above) */
    
    _setIntegerValue : function(attrVal, attrName) {
        return parseInt(attrVal, 10);
    },
    
    _setBooleanValue : function(attrVal, attrName) {
        if (attrVal) {
            return true;
        }
        else {
            return false;
        }
    }
    
});



}, '@VERSION@' ,{requires:['widget', 'substitute'], skinnable:true});

YUI.add('queryresults-results', function(Y) {

Y.Queryresults = Y.Base.build( 'queryresults', Y.QueryresultsBase, [] );



}, '@VERSION@' ,{requires:['queryresults-base', 'base']});

YUI.add('queryresults-highlight', function(Y) {

/* QueryresultsHighlight class constructor */
function QueryresultsHighlight(config) {
    QueryresultsHighlight.superclass.constructor.apply(this, arguments);
}

/* 
 * Required NAME static field, to identify the class and 
 * used as an event prefix, to generate class names etc. (set to the 
 * class name in camel case). 
 */
QueryresultsHighlight.NAME = "highlight";

/* 
 * Required NS static field, to identify the property on the host which will, 
 * be used to refer to the plugin instance ( e.g. host.feature.doSomething() )
 */
QueryresultsHighlight.NS = "plugin-queryresults-highlight";

/* QueryresultsHighlight extends the base Plugin.Base class */
Y.QueryresultsHighlight = Y.extend(QueryresultsHighlight, Y.Plugin.Base, {

    initializer: function(config) {            
         this.afterHostEvent("render", this._afterHostRenderEvent);
    },

    destructor : function() {
        var tabul = this.get('host'),
            boundingBox = tabul.get('boundingBox');
        boundingBox.detach();
    },

    /* Supporting Methods */

    _afterHostRenderEvent : function(e) {
        /* React after the host render event */
        var tabul = this.get('host'),
            boundingBox = tabul.get('boundingBox');
        
        boundingBox.delegate('mouseenter', this._onMouseEnterLeave, 'table tr');
        boundingBox.delegate('mouseleave', this._onMouseEnterLeave, 'table tr');
    },
    
    _onMouseEnterLeave : function(ev) {
        ev.currentTarget.toggleClass('queryresults-highlight-hover');
    }
    
});



}, '@VERSION@' ,{requires:['plugin']});

YUI.add('queryresults-aria', function(Y) {

/* QueryresultsAria class constructor */
function QueryresultsAria(config) {
    QueryresultsAria.superclass.constructor.apply(this, arguments);
}

/* 
 * Required NAME static field, to identify the class and 
 * used as an event prefix, to generate class names etc. (set to the 
 * class name in camel case). 
 */
QueryresultsAria.NAME = "queryresults-aria";

/* 
 * Required NS static field, to identify the property on the host which will, 
 * be used to refer to the plugin instance ( e.g. host.feature.doSomething() )
 */
QueryresultsAria.NS = "aria";

/* QueryresultsAria extends the base Plugin.Base class */
Y.QueryresultsAria = Y.extend(QueryresultsAria, Y.Plugin.Base, {

    initializer: function(config) {            
         this.afterHostEvent('render', this._afterHostRenderEvent);
         this.afterHostMethod('setRows', this._afterHostSetRowsMethod);
         this.afterHostMethod('setHeaders', this._afterHostsetHeadersMethod);
    },

    destructor : function() {
        
    },

    /* Supporting Methods */

    _afterHostRenderEvent : function(e) {
        /* React after the host render event */
        var host = this.get('host'),
            boundingBox = host.get('boundingBox');
        
        boundingBox.set('aria-live', 'polite');
        boundingBox.one('table').setAttrs({'role' : 'grid', 'aria-readonly' : 'true'});
        
    },
    
    // reset aria properties after the headers of the table are rerendered
    _afterHostsetHeadersMethod : function(headerObj) {
        var host = this.get('host'),
            boundingBox = host.get('boundingBox');
        
        boundingBox.all('thead th').set('role', 'columnheader');
        boundingBox.all('thead tr').set('role', 'row');
    },
    
    // reset aria properties after the rows of the table are rerendered
    _afterHostSetRowsMethod : function(arrayOfRows) {
        var host = this.get('host'),
            boundingBox = host.get('boundingBox');
        
        boundingBox.all('tbody tr').set('role', 'row');
        boundingBox.all('tbody tr td').set('role', 'gridcell');
    }
    
});



}, '@VERSION@' ,{requires:['plugin']});

YUI.add('queryresults-controls', function(Y) {

/* Any frequently used shortcuts, strings and constants */
var Lang = Y.Lang;

/* QueryresultsControls class constructor */
function QueryresultsControls(config) {
    QueryresultsControls.superclass.constructor.apply(this, arguments);
}

/* 
 * Required NAME static field, to identify the class and 
 * used as an event prefix, to generate class names etc. (set to the 
 * class name in camel case). 
 */
QueryresultsControls.NAME = "queryresults-contorls";

/* 
 * Required NS static field, to identify the property on the host which will, 
 * be used to refer to the plugin instance ( e.g. host.feature.doSomething() )
 */
QueryresultsControls.NS = "controls";

QueryresultsControls.ATTRS = {
    position : {
        value : 'before',
        setter : '_setPosition'
    },
    
    pagesToDisplay : {
        value : 10,
        setter : '_setIntegerValue'
    },             
    
    pageButtons : {
        value : true,
        setter : '_setBooleanValue'
    },
    
    firstPageButton : {
        value : false,
        setter : '_setBooleanValue'
    },

    lastPageButton : {
        value : false,
        setter : '_setBooleanValue'
    },

    nextPageButton : {
        value : true,
        setter : '_setBooleanValue'
    },

    previousPageButton : {
        value : true,
        setter : '_setBooleanValue'
    },

    gotoPageSelector : {
        value : false,
        setter : '_setBooleanValue'
    },
    
    itemsPerPageSelector : {
        value : false,
        setter : '_setBooleanValue'
    },
    
    itemsPerPageValues : {
        value : undefined,
        validator: "_validateItemsPerPageValues"
    },
    
    strings : {
        value : Y.Intl.get("queryresults")
    }
};

/* QueryresultsControls extends the base Plugin.Base class */
Y.QueryresultsControls = Y.extend(QueryresultsControls, Y.Plugin.SDTPaginateClient, {

    initializer: function(config) {
        this.host = this.get('host');
        this.afterHostEvent("render", this._afterHostRenderEvent);
        Y.Intl.after("intl:langChange", this._afterLangChange, this);
    },

    destructor : function() {
        
    },
    
    // 
    setCurrentPageNumber : function(ev) {
        var numberOfPages = this.get('numberOfPages');
        
        if ((ev.newVal >= 1) && (ev.newVal <= numberOfPages)) {
            this.set('currentPageNumber', ev.newVal);
        }
    },
    
    /* Supporting Methods */
    
    _setupControls : function() {
        var boundingBox = this.host.get('boundingBox'),
            position = this.get('position');
        
        this._calculateItemsPerPageArray();
        
        this._controls = {};
        this._controls.before = this._renderControlsDivs('before');
        this._controls.after = this._renderControlsDivs('after');
        
        boundingBox.insert(this._controls[position].boundingDiv, position);
        
        this._refreshControls();
    },
    
    _calculateItemsPerPageArray : function() {
        var itemsPerPageValues = this.get('itemsPerPageValues'),
            totalItems = this.get('totalItems'),
            sortNumber;
            
        if (!itemsPerPageValues) {
            sortNumber = function(a, b) {
                return a - b;
            };
            
            itemsPerPageValues = [this.get('itemsPerPage'), 
                                    Math.round(totalItems * 0.1 / 10) * 10, 
                                    Math.round(totalItems * 0.2 / 10) * 10, 
                                    Math.round(totalItems * 0.3 / 10) * 10, 
                                    Math.round(totalItems * 0.5 / 10) * 10
                                ].sort(sortNumber);
            this.set('itemsPerPageValues', itemsPerPageValues);
        }
    },
    
    _renderControlsDivs : function(type) {
        var boundingDiv, contentDiv;
        boundingDiv = Y.Node.create(
                    Y.substitute(this.DIV, {
                        divClass    : this.host.getClassName('controls')
                    }));
        boundingDiv.addClass(this.host.getClassName(type, 'controls'));
        contentDiv = Y.Node.create(
                    Y.substitute(this.DIV, {
                        divClass    : this.host.getClassName('controls', 'content')
                    }));
        boundingDiv.appendChild(contentDiv);
        
        return {'boundingDiv' : boundingDiv, 'contentDiv' : contentDiv};
    },
    
    _refreshControls : function(destroy) {
        var position = this.get('position');
        
        if (position === 'both') {
            this._renderControls(this._controls.before.contentDiv, destroy);
            this._renderControls(this._controls.after.contentDiv, destroy);
        }
        else {
            this._renderControls(this._controls[position].contentDiv, destroy);
        }
    },
    
    _renderControls : function(contentDiv, destroy) {
        if (destroy) {
            contentDiv.purge(true);
            contentDiv.get('childNodes').remove(true);
        }

        this._calculateStartEndPages();
        this._renderDisplayedLabel(contentDiv);
        this._renderPageButtons(contentDiv);
        this._renderSelectors(contentDiv);       
    },
    
    _calculateStartEndPages : function() {
        var currentPageNumber = this.get('currentPageNumber'),
            numberOfPages = this.get('numberOfPages'),
            pagesToDisplay = this.get('pagesToDisplay');
        
        this.startPage = Math.max(
                            1,
                            currentPageNumber - Math.ceil(pagesToDisplay / 2 - 1)
                        );
        
        if ((numberOfPages - this.startPage) < pagesToDisplay) {
            this.startPage = Math.max(
                                1,
                                numberOfPages - pagesToDisplay + 1);
        }
        
        this.endPage = Math.min(
                            numberOfPages,
                            this.startPage + pagesToDisplay - 1);
    },
    
    _renderDisplayedLabel : function(contentDiv) {
        var recordLabel,
            currentIndex = this.get('currentIndex'),
            totalItems = this.get('totalItems'),
            itemsPerPage = this.get('itemsPerPage'),
            strings = this.get('strings');
        
        recordLabel = Y.Node.create(
            Y.substitute(this.RECORDS_LABEL_TEMPLATE, {
                wordDisplayRecord : strings.word_display_record,
                recordFrom        : currentIndex,
                prepTo            : strings.prep_to,
                recordTo          : Math.min(currentIndex + itemsPerPage - 1, totalItems),
                prepOf            : strings.prep_of,
                recordOf          : totalItems,
                wordRecords       : strings.word_records,
                labelledByClass   : this.host.getClassName('controls', 'displayed'),
                id                : Y.guid()
            } ) );
        
        contentDiv.appendChild(recordLabel);
    },
    
    _renderPageButtons : function(contentDiv) {
        var label, list, i,
            currentPageNumber = this.get('currentPageNumber'),
            numberOfPages = this.get('numberOfPages'),
            strings = this.get('strings');
        
        label = Y.Node.create(
            Y.substitute(this.LABEL_TEMPLATE, {
                paginationText    : strings.pagination_text,
                labelledByClass   : this.host.getClassName('controls', 'audible'),
                id                : Y.guid()
            } ) );
        
        contentDiv.appendChild(label);
        
        list = Y.Node.create(
            Y.substitute(this.LIST_TEMPLATE, {
                paginationListClass   : this.host.getClassName('controls', 'list'),
                labelId               : label.get('id')
            } ) );
        
        if (currentPageNumber !== 1) {
            this._renderPageButton(list, 'firstPageButton', strings.first_page_alt, strings.first_page_text, 1);
            this._renderPageButton(list, 'previousPageButton', strings.previous_page_alt, strings.previous_page_text, currentPageNumber - 1);
        }
        
        for (i = this.startPage; i < currentPageNumber; i += 1) {
            this._renderPageButton(list, 'pageButtons', strings.page_button_alt, i, i);
        }
        
        this._renderPageSpan(list, 'pageButtons', strings.current_page_button_alt, currentPageNumber);
            
        for (i = currentPageNumber + 1; i <= this.endPage; i += 1) {
            this._renderPageButton(list, 'pageButtons', strings.page_button_alt, i, i);
        }
        
        if (currentPageNumber !== numberOfPages) {
            this._renderPageButton(list, 'nextPageButton', strings.next_page_alt, strings.next_page_text, currentPageNumber + 1);
            this._renderPageButton(list, 'lastPageButton', strings.last_page_alt, strings.last_page_text, numberOfPages);
        }
        
        contentDiv.appendChild(list);
    },
    
    _setPaginationListeners : function() {
        this._controls.before.boundingDiv.delegate('click', this._onPageButtonClick, 'a.yui3-sdt-controls-page-button', this);
        this._controls.after.boundingDiv.delegate('click', this._onPageButtonClick, 'a.yui3-sdt-controls-page-button', this);
    },
    
    _renderSelectors : function(contentDiv) {
        if (this.get('gotoPageSelector')) {
            this._renderGotoPageSelector(contentDiv);
        }
        if (this.get('itemsPerPageSelector')) {
            this._renderItemsPerPageSelector(contentDiv);
        }
    },
    
    _renderPageButton : function(list, type, alt, text, toPage) {
        var numberOfPages = this.get('numberOfPages'), li;
        
        if ((this.get(type)) && (toPage >= 1) && (toPage <= numberOfPages)) {
            li = Y.Node.create(this.ITEM_TEMPLATE);
                
            li.appendChild(
                Y.Node.create(
                    Y.substitute(this.BUTTON_TEMPLATE, {
                            pageButtonClass     : this.host.getClassName('controls', 'page', 'button'),
                            text                : text,
                            spanButtonClass     : this.host.getClassName('controls', 'audible'),
                            spanText            : alt,
                            href                : '#page' + toPage
                        })).setData('toPage', toPage)
            );
            
            list.appendChild(li);
        }
    },
    
    _renderPageSpan : function(list, type, alt, text) {
        if (this.get(type)) {
            list.appendChild(
                Y.Node.create(
                    Y.substitute(this.CURRENT_PAGE_TEMPLATE, {
                        pageCurrentClass        : this.host.getClassName('controls', 'page', 'current'),
                        text                    : text,
                        spanButtonClass         : this.host.getClassName('controls', 'audible'),
                        spanText                : alt
                    }))
            );
        }
    },
    
    _renderGotoPageSelector : function(contentDiv) {
        var currentPageNumber = this.get('currentPageNumber'),
            numberOfPages = this.get('numberOfPages'),
            strings = this.get('strings'),
            i, gotoPageLabel, pageSelector, selectOption;
        
        pageSelector = Y.Node.create(
                        Y.substitute(this.SELECTOR_TEMPLATE, {
                            selectorClass   : this.host.getClassName('controls', 'page', 'selector'),
                            selectorId  : Y.guid()
                        }));
        
        gotoPageLabel = Y.Node.create(
                        Y.substitute(this.SPAN_TEMPLATE, {
                            text    : strings.goto_page_label,
                            spanClass : this.host.getClassName('controls', 'page', 'selector', 'label'),
                            forId   : pageSelector.get('id')
                        }));
        
        for (i = 1; i <= numberOfPages; i += 1) {
            selectOption = false;
            if (i === currentPageNumber) {
                selectOption = true;
            }
            pageSelector.appendChild(
                Y.Node.create(
                    Y.substitute(this.OPTION_TEMPLATE, {
                            value       : i,
                            textValue   : i
                        })).set('selected', selectOption)
            );
        }
        
        pageSelector.on('change', this._onGotoSelectroChange, this);
        
        contentDiv.appendChild(gotoPageLabel);
        contentDiv.appendChild(pageSelector);
    },
    
    _renderItemsPerPageSelector : function(contentDiv) {
        var itemsPerPageValues = this.get('itemsPerPageValues'),
            itemsPerPage = this.get('itemsPerPage'),
            strings = this.get('strings'),
            i, itemsPerPageLavel, itemsSelector, selectOption;
        
        itemsSelector = Y.Node.create(
                        Y.substitute(this.SELECTOR_TEMPLATE, {
                            selectorClass   : this.host.getClassName('controls', 'items', 'selector'),
                            selectorId   :   Y.guid()
                        }));
        
        itemsPerPageLavel = Y.Node.create(
                        Y.substitute(this.SPAN_TEMPLATE, {
                            text    : strings.items_per_page_label,
                            spanClass : this.host.getClassName('controls', 'items', 'selector', 'label'),
                            forId   :   itemsSelector.get('id')
                        }));
        
        for (i = 0; i < itemsPerPageValues.length; i += 1) {
            selectOption = false;
            if (itemsPerPageValues[i] === itemsPerPage) {
                selectOption = true;
            }
            itemsSelector.appendChild(
                Y.Node.create(
                    Y.substitute(this.OPTION_TEMPLATE, {
                            value       : itemsPerPageValues[i],
                            textValue   : itemsPerPageValues[i]
                        })).set('selected', selectOption)
            );
        }
        
        itemsSelector.on('change', this._onItemsPerPageChange, this);
        
        contentDiv.appendChild(itemsPerPageLavel);
        contentDiv.appendChild(itemsSelector);
    },
    
    /* Supporting function */
    
    _onPageButtonClick : function(ev) {
        var newVal = ev.currentTarget.getData('toPage');
        
        ev.halt();
        this.set('currentPageNumber', newVal);
    },
    
    _onGotoSelectroChange : function(ev) {
        var newVal = ev.target.get('value');
        
        ev.halt();
        this.set('currentPageNumber', newVal);
    },
    
    _onItemsPerPageChange : function(ev) {
        var newVal = ev.target.get('value');
        
        ev.halt();
        this.set('itemsPerPage', newVal);
    },
    
    _afterHostRenderEvent : function(ev) {
        /* React after the host render event */
        this._setupControls();
        this._setPaginationListeners();
        
        this.afterHostMethod('setRows', this._afterHostMethodSetRows, this);
        
        this.after('positionChange', this._afterPositionChange, this);
        this.after('pagesToDisplayChange', this._afterProperyChange, this);
        this.after('pageButtonsChange', this._afterProperyChange, this);
        this.after('firstPageButtonChange', this._afterProperyChange, this);
        this.after('lastPageButtonChange', this._afterProperyChange, this);
        this.after('nextPageButtonChange', this._afterProperyChange, this);
        this.after('previousPageButtonChange', this._afterProperyChange, this);
        this.after('gotoPageSelectorChange', this._afterProperyChange, this);
        this.after('itemsPerPageSelectorChange', this._afterProperyChange, this);
        this.after('itemsPerPageValuesChange', this._afterItemsPerPageValuesChange, this);
    },
    
    _afterLangChange : function(ev) {
        if (ev.module === 'queryresults') {
            this.set("strings", Y.Intl.get('queryresults'));
            this._refreshControls(true);
        }
    },
    
    _setPosition : function(attrVal, attrName) {
        if (attrVal === 'before') {
            return 'before';
        } 
        else if (attrVal === 'after') {
            return 'after';
        }
        else {
            return 'both';
        }
    },
    
    _setIntegerValue : function(attrVal, attrName) {
        return parseInt(attrVal, 10);
    },
    
    _setBooleanValue : function(attrVal, attrName) {
        if (attrVal) {
            return true;
        }
        else {
            return false;
        }
    },
    
    _validateItemsPerPageValues : function(attrVal, attrName) {
        var i;
        
        if (Lang.isArray(attrVal)) {
            for (i = 0; i < attrVal.length; i += 1) {
                if (!Lang.isNumber(attrVal[i])) {
                    return false;
                }
            }
            return true;
        }
        else {
            return false;
        }
    },
    
    _afterHostMethodSetRows : function(ev) {
        this._refreshControls(true);
    },
    
    _afterPositionChange : function(ev) {
        var boundingBox = this.host.get('boundingBox');
        
        if (ev.newVal === 'both') {
            if (ev.prevVal === 'before') {
                boundingBox.insert(this._controls.after.boundingDiv, 'after');
            }
            else {
                boundingBox.insert(this._controls.before.boundingDiv, 'before');
            }
        }
        else {
            if (ev.prevVal === 'both') {
                if (ev.newVal === 'before') {
                    this._controls.after.boundingDiv.remove();
                }
                else {
                    this._controls.before.boundingDiv.remove();
                }
            }
            else {
                this._controls[ev.prevVal].boundingDiv.remove();
            }
            boundingBox.insert(this._controls[ev.newVal].boundingDiv, ev.newVal);
        }
        
        this._refreshControls(true);
    },
    
    _afterProperyChange : function(ev) {
        this._refreshControls(true);
    },
    
    _afterItemsPerPageValuesChange : function(ev) {
        var itemsPerPage = this.get('itemsPerPage'),
            newVal;
        
        if (Y.Array.indexOf(ev.newVal, itemsPerPage) === -1) {
            if (ev.newVal[0]) {
                newVal = ev.newVal[0];
                this.set('itemsPerPage', newVal);
            }    
        }
        
        this._refreshControls(true);
    },
    
    DIV : '<div class="{divClass}"></div>',
    
    LABEL_TEMPLATE   :   '<p class="{labelledByClass}" id="{id}">{paginationText}</p>',
    
    RECORDS_LABEL_TEMPLATE   :   '<p class="{labelledByClass}" id="{id}">{wordDisplayRecord} {recordFrom} {prepTo} {recordTo} {prepOf} {recordOf} {wordRecords}</p>',
    
    LIST_TEMPLATE    :   '<ul class="{paginationListClass}" role="navigation" aria-labelledby="{labelId}"></ul>',
    
    BUTTON_TEMPLATE     :   '<a href="{href}" class="{pageButtonClass}">' +
                                '<span class="{spanButtonClass}">{spanText}</span>' +
                                    '{text}' + 
                            '</a>',
                                        
    ITEM_TEMPLATE     :    '<li></li>',
    
    
    CURRENT_PAGE_TEMPLATE     :   '<li><span class="{pageCurrentClass}">' +
                                        '<span class="{spanButtonClass}">{spanText}</span>' +
                                            '{text}' +
                                        '</span>' + 
                                    '</li>',

    SPAN_TEMPLATE   :   '<label class="{spanClass}" for="{forId}">{text}</label>',
                                                            
    SELECTOR_TEMPLATE    :  '<select class="{selectorClass}" id={selectorId} ></select>',
    
    OPTION_TEMPLATE  :   '<option value="{value}">{textValue}</option>'
    
});



}, '@VERSION@' ,{requires:['plugin', 'gallery-plugin-simple-datatable-paginate-client']});

YUI.add('queryresults-click', function(Y) {

/* QueryresultsClick class constructor */
function QueryresultsClick(config) {
    QueryresultsClick.superclass.constructor.apply(this, arguments);
}

/* 
 * Required NAME static field, to identify the class and 
 * used as an event prefix, to generate class names etc. (set to the 
 * class name in camel case). 
 */
QueryresultsClick.NAME = "queryresults-click";

/* 
 * Required NS static field, to identify the property on the host which will, 
 * be used to refer to the plugin instance ( e.g. host.feature.doSomething() )
 */
QueryresultsClick.NS = "queryresultsClick";

QueryresultsClick.ATTRS = {
    strings : {
        value : Y.Intl.get("queryresults")
    },
    
    pluginRowClickHeader : {
        value : ''
    }
};

/* QueryresultsClick extends the base Plugin.Base class */
Y.QueryresultsClick = Y.extend(QueryresultsClick, Y.Plugin.Base, {

    initializer: function(config) {            
         this.beforeHostMethod('syncUI', this._beforeHostSyncUIMethod);
         this.afterHostEvent('render', this._afterHostRenderEvent);
         
         Y.Intl.after("intl:langChange", this._afterLangChange, this);
    },
    
    destructor : function() {
    
    },

    /* Supporting Methods */
    
    _beforeHostSyncUIMethod : function(e) {
        this._addShowMoreButtonColumn();
    },
    
    // Adds listener to the bounding box of the widget to intersept clicks on the Show More links
    _afterHostRenderEvent : function(e) {
        /* React after the host render event */
        var host = this.get('host'),
            boundingBox = host.get('boundingBox');
            
       boundingBox.delegate('click', this._onMouseClick, 'tbody tr', this);
    },
    
    // Extracts data from the row clicked and makes the host fire queryresults:rowClick event
    _onMouseClick : function(ev) {
        var host = this.get('host'),
            headers = host.get('headers'),
            rows = host.get('rows'),
            data = {}, field, row, rowid;
        
        ev.halt();
        
        rowid = ev.target.getAttribute('rowid');
        if (rowid) {
            row = rows[rowid];
            for (field in row) {
                if ((row.hasOwnProperty(field)) && (field !== 'button')) {
                    data[field] = row[field];
                }
            }
            
            host.fire('queryresults:rowClick', {'row' : data });
        }
    },
    
    // Adds Show More link to every row in the table
    _addShowMoreButtonColumn : function() {
            var host = this.get('host'),
                headers = host.get('headers'),
                rows = host.get('rows'), 
                strings = this.get('strings'),
                rowName = this.get('pluginRowClickHeader'),
                spanCode = '',
                i;
        
            headers.button = strings.show_button_header;
            
            for (i = 0; i < rows.length; i += 1) {
                // creates a unique link with the text "Show more about <cellData>" where column of the cell is specified by pluginRowClickHeader property
                // if pluginRowClickHeader is undefined or incorrect, the link has text "Show more information about the row number {number}"
                if (rows[i][rowName]) {
                    spanCode = Y.substitute(this.SPAN_TEMPLATE, {
                                    spanClass       : host.getClassName('controls', 'audible'),
                                    spanText        : Y.substitute(strings.show_button_title_about, { "cellText" : rows[i][rowName]})
                                });
                } else {
                    spanCode = Y.substitute(this.SPAN_TEMPLATE, {
                                    spanClass       : host.getClassName('controls', 'audible'),
                                    spanText        : Y.substitute(strings.show_button_title_information, { "number" : (i + 1)})
                                });
                }
                
                rows[i].button = Y.substitute(this.SHOW_BUTTON_TEMPLATE, {
                                    rowid           : i,
                                    text            : strings.show_button_label,
                                    showButtonClass : host.getClassName('show', 'button'),
                                    title           : strings.show_button_title,
                                    span            : spanCode
                                });
            }
            
            host.setHeaders(headers);
            host.set('headers', headers);
            host.setRows(rows);
            host.set('rows', rows);
    },
    
    
    _afterLangChange : function(ev) {
        
        if (ev.module === 'queryresults'/*this.get('host').name*/) {
            this.set("strings", Y.Intl.get('queryresults'/*this.name*/));
            this._addShowMoreButtonColumn();
        }
    },
    
    SHOW_BUTTON_TEMPLATE :  '<a href="javascript:void(0)" role="button" class="{showButtonClass}" rowid="{rowid}">' +
                                '{text}{span}' +
                            '</a>',
    
    SPAN_TEMPLATE       : '<span class="{spanClass}">{spanText}</span>'
    
});



}, '@VERSION@' ,{requires:['plugin', 'substitute']});



YUI.add('queryresults', function(Y){}, '@VERSION@' ,{use:['queryresults-results', 'queryresults-base', 'queryresults-highlight', 'queryresults-aria', 'queryresults-controls', 'queryresults-click'], skinnable:true});

