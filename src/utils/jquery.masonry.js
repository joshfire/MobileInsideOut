/**
 * jQuery Masonry v2.0.111015
 * A dynamic layout plugin for jQuery
 * The flip-side of CSS Floats
 * http://masonry.desandro.com
 *
 * Licensed under the MIT license.
 * Copyright 2011 David DeSandro
 */
 
Joshfire.define(["joshfire/vendor/jquery"],function($){

  /*
   * smartresize: debounced resize event for jQuery
   *
   * latest version and complete README available on Github:
   * https://github.com/louisremi/jquery.smartresize.js
   *
   * Copyright 2011 @louis_remi
   * Licensed under the MIT license.
   */

  var $event = $.event,
      resizeTimeout;

  $event.special.smartresize = {
    setup: function() {
      $(this).bind( "resize", $event.special.smartresize.handler );
    },
    teardown: function() {
      $(this).unbind( "resize", $event.special.smartresize.handler );
    },
    handler: function( event, execAsap ) {
      // Save the context
      var context = this,
          args = arguments;

      // set correct event type
      event.type = "smartresize";

      if ( resizeTimeout ) { clearTimeout( resizeTimeout ); }
      resizeTimeout = setTimeout(function() {
        jQuery.event.handle.apply( context, args );
      }, execAsap === "execAsap"? 0 : 100 );
    }
  };

  $.fn.smartresize = function( fn ) {
    return fn ? this.bind( "smartresize", fn ) : this.trigger( "smartresize", ["execAsap"] );
  };



// ========================= Masonry ===============================


  // our "Widget" object constructor
  $.Mason = function( options, element ){
    this.element = $( element );

    this._create( options );
    this._init();
  };
  
  // styles of container element we want to keep track of
  var masonryContainerStyles = [ 'position', 'height' ];
  
  $.Mason.settings = {
    isResizable: true,
    isAnimated: false,
    animationOptions: {
      queue: false,
      duration: 500
    },
    gutterWidth: 0,
    isRTL: false,
    isFitWidth: false
  };

  $.Mason.prototype = {

    _filterFindBricks: function( $elems ) {
      var selector = this.options.itemSelector;
      // if there is a selector
      // filter/find appropriate item elements
      return !selector ? $elems : $elems.filter( selector ).add( $elems.find( selector ) );
    },

    _getBricks: function( $elems ) {
      var $bricks = this._filterFindBricks( $elems )
        .css({ position: 'absolute' })
        .addClass('masonry-brick');
      return $bricks;
    },
    
    // sets up widget
    _create : function( options ) {
      
      this.options = $.extend( true, {}, $.Mason.settings, options );
      
      this.styleQueue = [];
      // need to get bricks
      this.reloadItems();


      // get original styles in case we re-apply them in .destroy()
      var elemStyle = this.element[0].style;
      this.originalStyle = {};
      for ( var i=0, len = masonryContainerStyles.length; i < len; i++ ) {
        var prop = masonryContainerStyles[i];
        this.originalStyle[ prop ] = elemStyle[ prop ] || '';
      }

      this.element.css({
        position : 'relative'
      });
      
      this.horizontalDirection = this.options.isRTL ? 'right' : 'left';
      this.offset = {};
      
      // get top left position of where the bricks should be
      var $cursor = $( document.createElement('div') );
      this.element.prepend( $cursor );
      this.offset.y = Math.round( $cursor.position().top );
      // get horizontal offset
      if ( !this.options.isRTL ) {
        this.offset.x = Math.round( $cursor.position().left );
      } else {
        $cursor.css({ 'float': 'right', display: 'inline-block'});
        this.offset.x = Math.round( this.element.outerWidth() - $cursor.position().left );
      }
      $cursor.remove();

      // add masonry class first time around
      var instance = this;
      setTimeout( function() {
        instance.element.addClass('masonry');
      }, 0 );
      
      // bind resize method
      if ( this.options.isResizable ) {
        $(window).bind( 'smartresize.masonry', function() { 
          instance.resize();
        });
      }
      
    },
  
    // _init fires when instance is first created
    // and when instance is triggered again -> $el.masonry();
    _init : function( callback ) {
      this._getColumns();
      this._reLayout( callback );
    },

    option: function( key, value ){
      // set options AFTER initialization:
      // signature: $('#foo').bar({ cool:false });
      if ( $.isPlainObject( key ) ){
        this.options = $.extend(true, this.options, key);
      } 
    },
    
    // ====================== General Layout ======================

    // used on collection of atoms (should be filtered, and sorted before )
    // accepts atoms-to-be-laid-out to start with
    layout : function( $bricks, callback ) {

      // layout logic
      var $brick, colSpan, groupCount, groupY, groupColY, j;
      
      for (var i=0, len = $bricks.length; i < len; i++) {
        $brick = $( $bricks[i] );
        //how many columns does this brick span
        colSpan = Math.ceil( $brick.outerWidth(true) / this.columnWidth );
        colSpan = Math.min( colSpan, this.cols );

        if ( colSpan === 1 ) {
          // if brick spans only one column, just like singleMode
          this._placeBrick( $brick, this.colYs );
        } else {
          // brick spans more than one column
          // how many different places could this brick fit horizontally
          groupCount = this.cols + 1 - colSpan;
          groupY = [];

          // for each group potential horizontal position
          for ( j=0; j < groupCount; j++ ) {
            // make an array of colY values for that one group
            groupColY = this.colYs.slice( j, j+colSpan );
            // and get the max value of the array
            groupY[j] = Math.max.apply( Math, groupColY );
          }
        
          this._placeBrick( $brick, groupY );
        }
      }
      
      // set the size of the container
      var containerSize = {};
      containerSize.height = Math.max.apply( Math, this.colYs ) - this.offset.y;
      if ( this.options.isFitWidth ) {
        var unusedCols = 0,
            i = this.cols;
        // count unused columns
        while ( --i ) {
          if ( this.colYs[i] !== this.offset.y ) {
            break;
          }
          unusedCols++;
        }
        // fit container to columns that have been used;
        containerSize.width = (this.cols - unusedCols) * this.columnWidth - this.options.gutterWidth;
      }
      this.styleQueue.push({ $el: this.element, style: containerSize });

      // are we animating the layout arrangement?
      // use plugin-ish syntax for css or animate
      var styleFn = !this.isLaidOut ? 'css' : (
            this.options.isAnimated ? 'animate' : 'css'
          ),
          animOpts = this.options.animationOptions;

      // process styleQueue
      var obj;
      for (i=0, len = this.styleQueue.length; i < len; i++) {
        obj = this.styleQueue[i];
        obj.$el[ styleFn ]( obj.style, animOpts );
      }

      // clear out queue for next time
      this.styleQueue = [];

      // provide $elems as context for the callback
      if ( callback ) {
        callback.call( $bricks );
      }
      
      this.isLaidOut = true;
    },
    
    // calculates number of columns
    // i.e. this.columnWidth = 200
    _getColumns : function() {
      var container = this.options.isFitWidth ? this.element.parent() : this.element,
          containerWidth = container.width();
      
      this.columnWidth = this.options.columnWidth ||
                    // or use the size of the first item
                    this.$bricks.outerWidth(true) ||
                    // if there's no items, use size of container
                    containerWidth;

      this.columnWidth += this.options.gutterWidth;

      this.cols = Math.floor( ( containerWidth + this.options.gutterWidth ) / this.columnWidth );
      this.cols = Math.max( this.cols, 1 );

    },

    _placeBrick : function( $brick, setY ) {
      // get the minimum Y value from the columns
      var minimumY = Math.min.apply( Math, setY ),
          shortCol = 0;
      
      // Find index of short column, the first from the left
      for (var i=0, len = setY.length; i < len; i++) {
        if ( setY[i] === minimumY ) {
          shortCol = i;
          break;
        }
      }

      // position the brick
      var position = {
        top : minimumY
      };
      // position.left or position.right
      position[ this.horizontalDirection ] = this.columnWidth * shortCol + this.offset.x;
      this.styleQueue.push({ $el: $brick, style: position });

      // apply setHeight to necessary columns
      var setHeight = minimumY + $brick.outerHeight(true),
          setSpan = this.cols + 1 - len;
      for ( i=0; i < setSpan; i++ ) {
        this.colYs[ shortCol + i ] = setHeight;
      }

    },
    
    
    resize : function() {
      var prevColCount = this.cols;
      // get updated colCount
      this._getColumns();
      if ( this.cols !== prevColCount ) {
        // if column count has changed, trigger new layout
        this._reLayout();
      }
    },
    
    
    _reLayout : function( callback ) {
      // reset columns
      var i = this.cols;
      this.colYs = [];
      while (i--) {
        this.colYs.push( this.offset.y );
      }
      // apply layout logic to all bricks
      this.layout( this.$bricks, callback );
    },
    
    // ====================== Convenience methods ======================
    
    // goes through all children again and gets bricks in proper order
    reloadItems : function() {
      this.$bricks = this._getBricks( this.element.children() );
    },
    
    
    reload : function( callback ) {
      this.reloadItems();
      this._init( callback );
    },
    

    // convienence method for working with Infinite Scroll
    appended : function( $content, isAnimatedFromBottom, callback ) {
      if ( isAnimatedFromBottom ) {
        // set new stuff to the bottom
        this._filterFindBricks( $content ).css({ top: this.element.height() });
        var instance = this;
        setTimeout( function(){
          instance._appended( $content, callback );
        }, 1 );
      } else {
        this._appended( $content, callback );
      }
    },
    
    _appended : function( $content, callback ) {
      var $newBricks = this._getBricks( $content );
      // add new bricks to brick pool
      this.$bricks = this.$bricks.add( $newBricks );
      this.layout( $newBricks, callback );
    },
    
    // removes elements from Masonry widget
    remove : function( $content ) {
      this.$bricks = this.$bricks.not( $content );
      $content.remove();
    },
    
    // destroys widget, returns elements and container back (close) to original style
    destroy : function() {

      this.$bricks
        .removeClass('masonry-brick')
        .each(function(){
          this.style.position = '';
          this.style.top = '';
          this.style.left = '';
        });
      
      // re-apply saved container styles
      var elemStyle = this.element[0].style;
      for ( var i=0, len = masonryContainerStyles.length; i < len; i++ ) {
        var prop = masonryContainerStyles[i];
        elemStyle[ prop ] = this.originalStyle[ prop ];
      }
      
      this.element
        .unbind('.masonry')
        .removeClass('masonry')
        .removeData('masonry');
      
      $(window).unbind('.masonry');

    }
    
  };
  
  
  // ======================= imagesLoaded Plugin ===============================
  /*!
   * jQuery imagesLoaded plugin v1.0.3
   * http://github.com/desandro/imagesloaded
   *
   * MIT License. by Paul Irish et al.
   */


  // $('#my-container').imagesLoaded(myFunction)
  // or
  // $('img').imagesLoaded(myFunction)

  // execute a callback when all images have loaded.
  // needed because .load() doesn't work on cached images

  // callback function gets image collection as argument
  //  `this` is the container

  $.fn.imagesLoaded = function( callback ) {
    var $this = this,
        $images = $this.find('img').add( $this.filter('img') ),
        len = $images.length,
        blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

    function triggerCallback() {
      callback.call( $this, $images );
    }

    function imgLoaded() {
      if ( --len <= 0 && this.src !== blank ){
        setTimeout( triggerCallback );
        $images.unbind( 'load error', imgLoaded );
      }
    }

    if ( !len ) {
      triggerCallback();
    }

    $images.bind( 'load error',  imgLoaded ).each( function() {
      // cached images don't fire load sometimes, so we reset src.
      if (this.complete || this.complete === undefined){
        var src = this.src;
        // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
        // data uri bypasses webkit log warning (thx doug jones)
        this.src = blank;
        this.src = src;
      }
    });

    return $this;
  };


  // helper function for logging errors
  // $.error breaks jQuery chaining
  var logError = function( message ) {
    if ( this.console ) {
      console.error( message );
    }
  };
  
  // =======================  Plugin bridge  ===============================
  // leverages data method to either create or return $.Mason constructor
  // A bit from jQuery UI
  //   https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js
  // A bit from jcarousel 
  //   https://github.com/jsor/jcarousel/blob/master/lib/jquery.jcarousel.js

  $.fn.masonry = function( options ) {
    if ( typeof options === 'string' ) {
      // call method
      var args = Array.prototype.slice.call( arguments, 1 );

      this.each(function(){
        var instance = $.data( this, 'masonry' );
        if ( !instance ) {
          logError( "cannot call methods on masonry prior to initialization; " +
            "attempted to call method '" + options + "'" );
          return;
        }
        if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
          logError( "no such method '" + options + "' for masonry instance" );
          return;
        }
        // apply method
        instance[ options ].apply( instance, args );
      });
    } else {
      this.each(function() {
        var instance = $.data( this, 'masonry' );
        if ( instance ) {
          // apply options & init
          instance.option( options || {} );
          instance._init();
        } else {
          // initialize new instance
          $.data( this, 'masonry', new $.Mason( options, this ) );
        }
      });
    }
    return this;
  };

  return $;

});