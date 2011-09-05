Joshfire.define(['src/spec/wording', 'joshfire/vendor/underscore'], function(TXT, _) {

  var error = TXT.error;

  return function(data) {
    var list = [];

    if (_.isString(data)) {
      list.push(data);
    } else {
      if (!_.isArray(data))
        data = [data];
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (_.isString(item)) {
          list.push(item)
        } else if (item.id) {
          if (item.id.indexOf('.') != -1) {
            var msg = error;
            _.each(item.id.split('.'), function(idx) { msg = msg[idx]; });
          } else {
            // TODO: Fix this.
            var msg = error[item.id];
          }
          for (var id in item.params) msg = msg.replace('$'+ id.toUpperCase(), item.params[id]);
          list.push(msg);
        } else {
          list.push(error.unknown);
        }
      }
    }

    var disconnected = false;
    for (var i = 0; i < list.length; i++) {
      if (list[i] == error.auth.api) {
        list[i] = error.auth.client;
        disconnected = true;
        break ;
      }
    }

    var self = this;
    var msg = list.join('\n')
      , time = (new Date()).getTime();

      
    self.lastError = null;

    // Avoid repeating errors it they are the same (in a time range of 3seconds)
    if (!self.lastError || !(self.lastError.msg == msg && (time - self.lastError.time) < (3 * 1000))) {
      function __cb() {
        if (disconnected)
          self.moveTo('userLogin');
      }

      if (typeof navigator.notification == 'undefined') {
        alert(msg);
        __cb();
      } else {
        navigator.notification.alert(msg, __cb, TXT.alert);
      }
    }

    self.lastError = { time:time, msg:msg }

    return (false);
  };

});
