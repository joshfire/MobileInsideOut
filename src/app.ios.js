Joshfire.define(['joshfire/app', 'joshfire/class', 'src/tree.data', 'joshfire/vendor/underscore', 'src/tree.ui'], function(BaseApp, Class, Data, _, UI) {

  return Class(BaseApp, {
    id: 'insideout',
    uiClass: UI,
    dataClass: Data,

    setup: function(callback) {
      var self = this;

      callback(null);
    }

  });

});
