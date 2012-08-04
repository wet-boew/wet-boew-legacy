/*!
 * DISTCHA (Accessible CAPTCHA) v0.3 / DISTCHA (CAPTCHA accessible) v0.3
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * Terms and conditions of use: http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Terms
 * Conditions régissant l'utilisation : http://tbs-sct.ircan.gc.ca/projects/gcwwwtemplates/wiki/Conditions
 */
 
/**
 * DISTCHA plugin
 * @author Samuel Sirois <ssirois@accessibiliteweb.com>
 * @author Rocío Alvarado <ralvarado@accessibiliteweb.com>
 */
var distcha = {

  // Load the parameters used in the plugin declaration. Parameters can be access using this.parms.parameterName
  params :  Utils.loadParamsFromScriptID("Distcha"),

    // Used to store localized strings for your plugin.
    dictionary : {
        errorMsg :(PE.language == "eng") ? "The captcha slider is not at it's maximum value." : "La coulisse captcha n'est pas à sa valeur maximum."
    },
    
    startX : 0,
    positionX : 0,
    step1done : false,
    step2done : false,
    step3done : false,
    reverseTuringTestURL : 'reverse-turing-test.php',

    // Method that is executed when the page loads
    init : function(){
      this._hookCaptchaCursorMouseEvents();
      this._hookCaptchaCursorKeyboardEvents();
      this._hookCaptchaCursorTouchScreenEvents();
      this._voidCaptchaCursorClickEvents();
      this._hookSubmitEvents();
      this._initWAIAriaAttributes();
    },
    
  _hookCaptchaCursorMouseEvents : function(){
    $('#captcha').draggable(
      {
        drag: function(event,ui){ 
          distcha._cursorDragMarkerEvent(event,ui);
        },
        containment: 'parent',
        axis: 'x',
        cancel: null,
        stop: function(event,ui){
          distcha._cursorDragStopEvent(event,ui);
        }
      }
    );
  },

  _hookCaptchaCursorKeyboardEvents : function(){
    $('#captcha').keydown(function(event){
      distcha._cursorKeydownEvent(event);
    });
  },

  _hookCaptchaCursorTouchScreenEvents : function(){
    var cursor = document.getElementById('captcha');
    
    cursor.addEventListener('touchstart', function(event){
      return distcha._cursorTouchStartEvent(event);
      return distcha._cursorTouchStartEvent(event);
    }, false);
  },
  
  _voidCaptchaCursorClickEvents : function(){
    $('#captcha').click(
      function(event)
      {
        event.stopImmediatePropagation();
        return false;
      }
    );
  },
  
  _hookSubmitEvents : function(){
    $('#submit').click(function(){
        $('#captchaSuccessMessage').show();
        // take the guid loaded into the hidden value and send it to the post file
        $.post(
          distcha.reverseTuringTestURL,
          { captchaValue: $('#captchaValue').attr('value') },
          function(data){
            var content = $(data).find( '#msg' ).text();
            $( "#captchaSuccessMessage" ).html( content );
          }
        );

        return false;
      });
  },

  _initWAIAriaAttributes : function(){
    this._initWAIAriaAttributesForCaptchaSlider();
    this._initWAIAriaAttributesForCaptchaSuccessMessageContainer();
  },
  
  _initWAIAriaAttributesForCaptchaSlider : function(){
    var captcha = $('#captcha');
    
    captcha
      .attr('aria-valuetext', '0 percent.')
      .attr('aria-valuenow', '0')
      .attr('aria-valuemin', '0')
      .attr('aria-valuemax', '100')
      .attr('role', 'slider');
  },
  
  _initWAIAriaAttributesForCaptchaSuccessMessageContainer : function(){
    var captchaSuccessMessageContainer = $('#captchaSuccessMessageContainer');
    captchaSuccessMessageContainer.attr('aria-live', 'polite');
  },

  _cursorDragStopEvent : function(event, ui){
    var cursorPosition = ui.position.left;
    var ariaValue = Math.round((ui.position.left / (ui.helper.parent().width() - ui.helper.width())) * 100);

    this._setCursorPosition(ui.helper, cursorPosition, ariaValue);
  },
  
  _cursorDragMarkerEvent : function(event, ui){
    var cursorPosition = ui.position.left;
    var ariaValue = Math.round((cursorPosition / (ui.helper.parent().width() - ui.helper.width())) * 100);

    this._logCursorMovement(cursorPosition, ariaValue);
  },
  
  _logCursorMovement : function(cursorPosition, ariaValue){
    var guid = $('#captchaValue').attr('value');

    if (this._isReadyToLogCursorMovement(cursorPosition, ariaValue)) {
      this._doLogCursorMovement(cursorPosition, guid);
    }
  },

  _isReadyToLogCursorMovement : function(cursorPosition, ariaValue) {

    //at these positions register the guid and the position for exclusive use of the php script
    if(cursorPosition >= 100 && this.step1done == false) {
      this.step1done = true;
      return true;
    }
    if(cursorPosition >= 300 && this.step1done == true && this.step2done == false) {
      this.step2done = true;
      return true;
    }
    if (ariaValue == 100 && this.step1done == true && this.step2done == true && this.step3done == false) {
      this.step3done = true;
      return true;
    }

    return false;
  },

  _doLogCursorMovement : function(cursorPosition, guid) {
    $.post( 
        '../guid/create-file-guid.php', // location of your php script
        { id: guid, position: cursorPosition }, // post data
        function( data ){  // a function to deal with the returned information
          return;
        }
      );
  },

  _cursorKeydownEvent : function(event){
    var cursor = $(event.target);
    
    var maxWidth = cursor.parent().width() - cursor.width();
    var cursorPosition = cursor.position().left;
    
    if (this._isKeyPressGoesRight(event.keyCode))
    {
      this._moveCursorRight(cursor, cursorPosition, maxWidth);
    }
    else if (this._isKeyPressGoesLeft(event.keyCode))
    {
      this._moveCursorLeft(cursor, cursorPosition, maxWidth);
    }
  },
  
  _isKeyPressGoesRight : function(keyCode){
    var pageUpKeyCode = 33;
    var endKeyCode = 35;
    var upKeyCode = 38;
    var rightKeyCode = 39;
    
    return (
      keyCode == pageUpKeyCode || 
      keyCode == endKeyCode ||
      keyCode == upKeyCode ||
      keyCode == rightKeyCode
    );
  },
  
  _isKeyPressGoesLeft : function(keyCode){
    var pageDownKeyCode = 34;
    var homeKeyCode = 36;
    var leftKeyCode = 37;
    var downKeyCode = 40;
    
    return (
      keyCode == pageDownKeyCode || 
      keyCode == homeKeyCode || 
      keyCode == leftKeyCode || 
      keyCode == downKeyCode
    );
  },
  
  _cursorTouchStartEvent : function(event){
    if (event.targetTouches.length != 1)
      return false;
    
    this.startX = event.targetTouches[0].clientX;
    
    var cursor = document.getElementById('captcha');
    cursor.addEventListener('touchmove', function(event){
      return distcha._cursorTouchMoveEvent(event);
    }, false);
    cursor.addEventListener('touchend', function(event){
      return distcha._cursorTouchEndEvent(event);
    }, false);
    
    return false;
  },
  
  _cursorTouchMoveEvent : function(event){
    // Prevent the browser from doing its default thing (scroll, zoom)
    event.preventDefault();
    // Don't track motion when multiple touches are down in this element (that's a gesture)
    if (event.targetTouches.length != 1)
      return false;
    
    this._doMove(event.targetTouches[0].clientX);
    
    this.startX = event.targetTouches[0].clientX;
    
    return false;
  },
  
  _doMove : function(x){
    var cursor = $('#captcha');
    
    var leftDelta = x - this.startX;
    
    var newLeft = this.positionX + leftDelta;
    if (newLeft > Math.round(cursor.parent().width() - cursor.width()))
      newLeft = Math.round(cursor.parent().width() - cursor.width());
    else if (newLeft < 0)
      newLeft = 0;
    this.positionX = newLeft;
    
    var ariaValue = Math.round((newLeft / (cursor.parent().width() - cursor.width())) * 100);
    
    this._setCursorPosition(cursor, newLeft, ariaValue);
  },
  
  _cursorTouchEndEvent : function(event){
    // Prevent the browser from doing its default thing (scroll, zoom)
    event.preventDefault();
    // Stop tracking when the last finger is removed from this element
    if (event.targetTouches.length > 0)
      return false;
    
    var cursor = document.getElementById('captcha');
    cursor.removeEventListener('touchmove', function(event){
      return distcha._cursorTouchMoveEvent(event);
    }, false);
    cursor.removeEventListener('touchend', function(event){
      return distcha._cursorTouchEndEvent(event);
    }, false);
    
    return false;
  },
  
  _setCursorPosition : function(cursor, cursorPosition, ariaValue){
    var positionSuffix = (cursorPosition > 1) ? ' percent.' : ' percents.';

    cursor.animate(
      {
        left: cursorPosition,
        queue: true
      },
      250
    );

    $('#captchaSuccessMessage').hide();

    cursor.attr('aria-valuenow', ariaValue);
    cursor.attr('aria-valuetext', ariaValue + positionSuffix);
  },

  _moveCursorRight : function(cursor, cursorPosition, sliderWidth){
    var guid = $('#captchaValue').attr('value');
    var step0 = Math.round(0 * sliderWidth);
    var step1 = Math.round(0.25 * sliderWidth);
    var step2 = Math.round(0.50 * sliderWidth);
    var step3 = Math.round(0.75 * sliderWidth);
    var step4 = Math.round(1.00 * sliderWidth);
    
    //at some steps register the guid and the position for exclusive use of the php script
    if (cursorPosition >= step3)
    {
      cursorPosition = step4;
      ariaValue = 100;
      if(this.step3done == false) {
        $.post( 
          '../guid/create-file-guid.php', // location of your php script
          { id: guid, position: cursorPosition }, // post data
          function( data ){  // a function to deal with the returned information
            if( this.step3done ) return;
        });
      }
      this.step3done = true;
    }
    else if (cursorPosition >= step2)
    {
      cursorPosition = step3;
      ariaValue = 75;
      if(this.step2done == false) {
        $.post( 
          '../guid/create-file-guid.php',
          { id: guid, position: cursorPosition },
          function( data ){
            if( this.step2done ) return;
        });
      }
      this.step2done = true;
    }
    else if (cursorPosition >= step1)
    {
      cursorPosition = step2;
      ariaValue = 50;
    }
    else
    {
      cursorPosition = step1;
      ariaValue = 25;
      if(this.step1done == false) {
        $.post( 
          '../guid/create-file-guid.php',
          { id: guid, position: cursorPosition },
          function( data ){ 
            if( this.step1done ) return;
        });
      }
      this.step1done = true;
    }

    this._setCursorPosition(cursor, cursorPosition, ariaValue);
  },

  _moveCursorLeft : function(cursor, cursorPosition, sliderWidth){
    var step0 = Math.round(0 * sliderWidth);
    var step1 = Math.round(0.25 * sliderWidth);
    var step2 = Math.round(0.50 * sliderWidth);
    var step3 = Math.round(0.75 * sliderWidth);
    var step4 = Math.round(1.00 * sliderWidth);

    if (cursorPosition < step1)
    {
      cursorPosition = step0;
      ariaValue = 0;
    }
    else if (cursorPosition >= step1 && cursorPosition < step2)
    {
      cursorPosition = step0;
      ariaValue = 0;
    }
    else if (cursorPosition >= step2 && cursorPosition < step3)
    {
      cursorPosition = step1;
      ariaValue = 25;
    }
    else if (cursorPosition >= step3 && cursorPosition < step4)
    {
      cursorPosition = step2;
      ariaValue = 50;
    }
    else
    {
      cursorPosition = step3;
      ariaValue = 75;
    }

    this._setCursorPosition(cursor, cursorPosition, ariaValue);
  }
}
// Add Style Sheet Support for this plug-in
Utils.addCSSSupportFile(Utils.getSupportPath()+"/distcha/style.css"); 

// Loads a library that the plugin depends on from the lib folder
PE.load('distcha/jquery-ui.min.js');

// Init Call at Runtime
$("document").ready(function(){   distcha.init(); });
