/*! 
 * Slide out tab widget v1.1 / Gadget d'onglet coulissant v1.1
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * www.tbs.gc.ca/ws-nw/wet-boew/terms / www.sct.gc.ca/ws-nw/wet-boew/conditions
 */

/*
@author Stéphane Bérubé
@description A tab sitting at the edge of the content area with the ability to slide out to show content
*/

var slideOut = {
    addCSSPrintSupportFile: function (pathtofile) {
        var $link = jQuery('<link rel="stylesheet" type="text/css" media="print" />').appendTo('head');
        $link.attr(
        {
            href: pathtofile,
            rel: 'stylesheet',
            type: 'text/css',
            media: 'print'
        });

    },

    defaultParams: {
        scroll: true,
        imgShow: (PE.language == "eng" ) ? { path: Utils.getSupportPath() + '/slideout/images/show.png', height: 147, width: 30, alt: 'Show Table of Contents' } : { path: Utils.getSupportPath() + '/slideout/images/afficher.png', height: 147, width: 30, alt: 'Afficher la table des matières' },
        imgHide: (PE.language == "eng" ) ? { path: Utils.getSupportPath() + '/slideout/images/hide.png', height: 147, width: 30, alt: 'Hide Table of Contents' } : { path: Utils.getSupportPath() + '/slideout/images/cacher.png', height: 147, width: 30, alt: 'Cacher la table des matières' },
        hideLbl: (PE.language == "eng" ) ? 'Hide<span class="cn-invisible"> Table of Contents</span>' : 'Cacher<span class="cn-invisible"> la table des matières</span>',
        hideLblTitle: (PE.language == "eng" ) ? 'Hide Table of Contents' : 'Cacher la table des matières',
        rmCurrLink: true
    },
    
    opened: false,
    ttlHeight: 0,
    focusOutlineAllowance: 2, // Makes room for the dashed outline to be displayed when the toggle link gains focus
    
    init: function() {
        if($('#slideout').length == 0)
            return; // Bail out if there's no element with an ID of "slideout"
    
        // Get params from script and URL-decode the necessary parts
        var params = Utils.loadParamsFromScriptID('slideout');
        params.imgShow = eval( "(" + decodeURIComponent(Utils.loadParamsFromScriptID("slideout").imgShow) + ")");
        params.imgHide = eval( "(" + decodeURIComponent(Utils.loadParamsFromScriptID("slideout").imgHide) + ")");
        // Merge default options with params from script
        slideOut.params = $.extend(true, {}, slideOut.defaultParams, params);
        
        // Converting strings to booleans. If strings are anything else than "false", we default to true.
        slideOut.params.scroll = !(slideOut.params.scroll == "false");
        slideOut.params.rmCurrLink = !(slideOut.params.rmCurrLink == "false");

        // Remove the link off the page we're on if we're asked to
        if(slideOut.params.rmCurrLink)
            $('#slideout li a').each( function() { 
                if($(this).get()[0].href == window.location.href) { 
                    $(this).replaceWith('<span class="so-active">' + $(this).text() + '</span>'); 
                } 
            });

        $('#slideout li a').each( function() { 
            $(this).bind('click', slideOut.toggle);
            $(this).click( function() { $($(this).attr('href')).attr("tabindex", -1).focus(); } );
        });

        // Add the wrappers
        $('#slideout').wrap('<div id="slideoutWrapper" />'); // This is used for overflow: hidden.
        $('#slideout').wrap('<div id="slideoutInnerWrapper" />'); // This is used for "animate".

        // Add the "Hide" link
        $('#slideout').append('<a href="#" id="slideoutClose" title="' + slideOut.params.hideLblTitle + '"onclick="$(\'#toggleLink\').focus(); return false;">' + slideOut.params.hideLbl + '</a>');

        // Add the slideout toggle // TODO: If we're not using images, don't generate a <img /> tag.
        $('#slideoutInnerWrapper').css('padding', (slideOut.focusOutlineAllowance/2) + 'px').prepend('<div id="slideoutToggle" class="slideoutToggle"><a id="toggleLink" role="button" aria-pressed="false" aria-controls="slideout" href="#" onclick="return false;"><img width="' + slideOut.params.imgShow.width + 'px' + '" height="' + slideOut.params.imgShow.height + 'px' + '" src="' + slideOut.params.imgShow.path + '" alt="' + slideOut.params.imgShow.alt + '" title="' + slideOut.params.imgShow.alt + '" /></a></div>');

        // FIXME: Eventually, the containers should resize according to its content
        $('#slideoutToggle').css({'width' : slideOut.params.imgShow.width, 'height' : slideOut.params.imgShow.height}); // Resize the toggle to correct dimensions
        
        // Apply the CSS
        $('#slideout').addClass('tabbedSlideout');
        // Since we're hiding div#slideout, its height will be zero so we cache it now
        slideOut.ttlHeight = $('#slideout').outerHeight();

        // Set vertical position and hide the slideout on load -- we don't want it to animate so we can't call slideout.toggle()
        $('#slideoutWrapper').css('width', (slideOut.params.imgShow.width + slideOut.focusOutlineAllowance) + 'px').css('top', $('#cn-centre-col').offset().top);

        // Hide widget content so we don't tab through the links when the slideout is closed
        $('#slideout').hide();
        $('#slideout').attr('aria-hidden', 'true');
        $('#slideoutInnerWrapper').css('width', slideOut.params.imgHide.width);
        
        // Figure out where to anchor the tab.
        // Looks better on div#cn-cols if div#cn-cols.bgcolor = body.bgcolor
        // Here, we assume that div#cn-cols.bgcolor is white/transparent
        var bodyBgColor = $('body').css('background-color');
        
        if(bodyBgColor == 'rgba(0, 0, 0, 0)' || bodyBgColor == 'transparent') { // Chrome: rgba, firefox and ie: transparent
            slideOut.params.anchorPoint = $('#cn-cols-inner');
            
            // Compensate for the 10px gap when narrowing the viewport due to cn-body-inner-ncol border
            slideOut.params.borderWidth = 10;
        }
        else {
            slideOut.params.anchorPoint = $('#cn-cols');
            slideOut.params.borderWidth = 0;
        }

        // IE6 and lower don't support position: fixed.
        // IE7's zoom messes up document dimensions (IE8 compat. view isn't affected)
        if(jQuery.browser.msie && document.documentMode == undefined) { // IE7 and lower (not including IE8 compat. view)
            slideOut.params.scroll = false;
        }
        
        if(slideOut.params.scroll) {
            $('#slideoutWrapper').addClass('slideoutWrapper');
            // Handle window resize and zoom in/out events
            ResizeEvents.eventElement.bind('x-initial-sizes x-text-resize x-zoom-resize x-window-resize', function (){
                slideOut.reposition();
            });
            slideOut.reposition();
        }
        else {
            $('#slideoutWrapper').addClass('so-ie6');
            $('#slideoutWrapper').addClass('slideoutWrapperRel')
                .css({'right': slideOut.params.borderWidth-10, 'top': '0'});
        }

        // Toggle slideout
        $('#toggleLink').click(slideOut.toggle);
        $('#slideoutClose').click(slideOut.toggle);
        
        // Fix scrolling issue in some versions of IE (#4051)
        if (jQuery.browser.msie && jQuery.browser.version == '7.0') {$('html').css('overflowY', 'auto');}
    },
    
    // Recalculate the slideout's position
    reposition: function() {
        if(!slideOut.opened) { // Only when slideout is closed
            var newPosition = slideOut.params.anchorPoint.offset().left;
            
            if(newPosition <= slideOut.params.borderWidth) {
                newPosition = 0;
            }

            // Vertical
            $('#slideoutWrapper').css('top', $('#cn-centre-col').offset().top);
            // Horizontal
            $('#slideoutWrapper').css('right', newPosition);     
        }
    },
    
    toggle: function(e) {
        $('#toggleLink').unbind('click');
        $('#slideoutClose').unbind('click');
    
        if (!slideOut.opened) {
            var position = $('#slideoutWrapper').position();
            if(!jQuery.browser.msie || document.documentMode != undefined) {
                $('#slideoutWrapper').removeClass('slideoutWrapper')
                    .addClass('slideoutWrapperRel')
                    .css({"top": position.top - $('#cn-centre-col').offset().top, "right": slideOut.params.borderWidth-10});
            }
            $('#slideout').show(); // Show the widget content if it is about to be opened
        }
        
        slideOut.opened = !slideOut.opened;
        $('#slideoutWrapper').animate({
                // FIXME: container should resize according to its content
                width: parseInt($('#slideoutWrapper').css('width'),10) == (slideOut.params.imgShow.width + slideOut.focusOutlineAllowance) ? $('#slideout').outerWidth() + (slideOut.params.imgShow.width + slideOut.focusOutlineAllowance): (slideOut.params.imgShow.width + slideOut.focusOutlineAllowance) + 'px'
            }, function() {
                // Animation complete.
                if (!slideOut.opened) {
                    $('#slideout').hide(); // Hide the widget content if the widget was just closed
                    $('#slideoutInnerWrapper').css('width', slideOut.params.imgHide.width);

                    if(!jQuery.browser.msie || document.documentMode != undefined) {
                        $('#slideoutWrapper').addClass('slideoutWrapper');
                        $('#slideoutWrapper').removeClass('slideoutWrapperRel');
                        $('#slideoutWrapper').css('width', (slideOut.params.imgShow.width + slideOut.focusOutlineAllowance) + 'px').css('top', $('#cn-centre-col').offset().top);            
                        slideOut.reposition();
                    }

                }
                else { // Slideout just opened
                    if(jQuery.browser.msie && jQuery.browser.version == '7.0' && document.documentMode == undefined) { // Just true IE7
                        $('#slideout ul').html($('#slideout ul').html()); // Ugly fix for #4312 (post #11)
                    }
                }                
                $('#toggleLink').click(slideOut.toggle);        
                $('#slideoutClose').click(slideOut.toggle);
            }
        );
        
        if(slideOut.opened) {
            $('#slideoutToggle a img').attr({'src': slideOut.params.imgHide.path,
                'title': slideOut.params.imgHide.alt,
                'alt': slideOut.params.imgHide.alt});
            $('#slideoutToggle a').attr('aria-pressed', 'true');
            $('#slideout').attr('aria-hidden', 'false');
            $('#slideoutInnerWrapper').css('width', '');
        }
        else {
            $('#slideoutToggle a img').attr({'src': slideOut.params.imgShow.path,
                'title': slideOut.params.imgShow.alt,
                'alt': slideOut.params.imgShow.alt});
            $('#slideoutToggle a').attr('aria-pressed', 'false');
            $('#slideout').attr('aria-hidden', 'true');
       }
    }
};

/**
 *  Progress Enhancement Runtime
 **/

// Add the stylesheet for this plugin
Utils.addCSSSupportFile(Utils.getSupportPath() + "/slideout/style.css");
slideOut.addCSSPrintSupportFile(Utils.getSupportPath() + '/slideout/pf-if.css');
$("document").ready(function(){ slideOut.init(); });