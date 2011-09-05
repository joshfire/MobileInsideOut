Joshfire.define(['joshfire/vendor/zepto', 'joshfire/vendor/underscore'], function(Zepto, _) {

  ;(function($) {
    $.fn.allImagesLoaded = function(callback) {

      var obj = $(this),
      allImgs = [];

      obj.find('img').each(function() {
        allImgs.push({
          src: this.src,
          element: this
        });
      });

      var allImgsLength = allImgs.length,
      allImgsLoaded = 0;

      if (allImgsLength == 0) {
        callback.call(obj[0]);
        return;
      }

      _.each(allImgs, function(img) {
        var image = new Image;
        image.onload = function() {
          allImgsLoaded++;
          if (allImgsLoaded == allImgsLength) {
            callback.call(obj[0]);
            return false;
          };
        };
        image.src = img.src;
      });

      return $;

    };
  })(Zepto);

  return {};

});
