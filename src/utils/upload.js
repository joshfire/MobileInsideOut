Joshfire.define(['src/spec/wording', 'joshfire/vendor/underscore'], function(TXT, _) {

  var list = {
    upload: function() {}
  , showCameraOptions: function() {}
  };


  if (typeof device != 'undefined' && device.phonegap == '1.0.0') {

    list.upload = function(callback, data) {

      var options = _.extend(new FileUploadOptions(), {
        fileKey: 'file'
      , fileName: data.imageURI.substr(data.imageURI.lastIndexOf('/')+1)
      , mimeType: 'image/jpeg'
      }, data.options || {});

      function cbSuccess(v) { callback(null, v); }
      function cbFailure(v) { callback(v, null); }

      var ft = new FileTransfer();
      ft.upload(data.imageURI, data.apiURL, cbSuccess, cbFailure, options);
    };


    list.showCameraOptions = function(callback, data) {

      var buttons = [TXT.photo.take, TXT.photo.choose, TXT.photo.cancel];
      var nativeControls = window.plugins.nativeControls;
      var pictureSource = navigator.camera.PictureSourceType;
      var destinationType = navigator.camera.DestinationType;
      var delegate = nativeControls.createActionSheet(buttons, null, 2, null);
      
      function cbSuccess(v) { callback(null, v); }
      function cbFailure(v) { callback(v, null); }

      delegate.onActionSheetDismissed = function(index) {
        if (data && data.onChoice)
          data.onChoice();
        if (index == 0) {
          navigator.camera.getPicture(cbSuccess, cbFailure, {
            quality: 50,
            destinationType: destinationType.FILE_URI,
            allowEdit: true
          });
        } else if (index == 1) {
          navigator.camera.getPicture(cbSuccess, cbFailure, {
            quality: 50,
            destinationType: destinationType.FILE_URI,
            sourceType: pictureSource.PHOTOLIBRARY
          });
        }
      };
    };

  }

  return list;

});
