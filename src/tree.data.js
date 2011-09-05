Joshfire.define(['joshfire/class', 'joshfire/tree.data', 'joshfire/vendor/underscore','joshfire/utils/datasource'], function(Class, DataTree, _, DataSource) {

  var APIROOT = "http://local.insideoutproject.net/api/";
  var DS = new DataSource();
  
  return Class(DataTree, {

    buildTree: function() {
      var app = this.app;

      return [
        {
          id: 'photos',
          children: function(query,cb) {
            DS.request({
              "url":APIROOT+"photos?page="+(query.skip/100+1),
              "dataType":"jsonp"
            },function(err,data) {
              
              cb(null,_.map(data,function(photo) {
                return {
                  "id":photo.url.replace("/sp/",""),
                  "image":photo.src,
                  "label":photo.name,
                  "meta":photo
                };
              }));
            });
          }
            
        }
      ];
    }

  });

});
