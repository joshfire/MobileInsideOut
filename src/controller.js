Joshfire.define(['joshfire/class', 'joshfire/vendor/underscore', 'src/utils/error'], function(Class, _, ERROR) {

  var localController = Class({

    __constructor: function(C, extend, param) {
      var self = this;
      _.each(extend, function(val, key) {
        self[key] = val;
      });

      self.UI = C.UI;
      self.dtor = C.dtor;

      self.options = {};

      self.subscription = [];
      self.UIElement = {};

      C.ctor(this, param);
    },

    __destructor: function() {
      this.unsubscribe();
      if (this.UIElement.panel) {
        this.hide(this.UIElement.panel);
      }
      if (_.isFunction(this.dtor))
        this.dtor(this);
    },

    __element: function(element) {
      return _.isString(element) ? this.app.ui.element(element) : element;
    },


    subscribe: function(element, event, callback) {
      element = this.__element(element);

      var token = element.subscribe(event, callback);
      this.subscription.push({ element:element, token:token });

      //console.error('sub: '+ event +' | '+ element.id +' | '+ token);
      return (token);
    },

    subscribeOnce: function(element, event, callback) {
      element = this.__element(element);

      var self = this;

      function __localCb(msg, data, token) {
        //console.error('  unsubscribe '+ element.id +' | '+ token);
        self.unsubscribe(element, token);
        callback.apply(null, arguments);
      }

      var token = element.subscribe(event, __localCb);
      self.subscription.push({ element:element, token:token });

      //console.error('subOnce: '+ event +' | '+ element.id +' | '+ token);
    },

    unsubscribe: function(element, token) {
      element = element ? this.__element(element) : null;

      for (var idx = 0; idx < this.subscription.length;) {
        var el = this.subscription[idx];
        //console.error('  >> '+ el.element.id);
        if (!element || ((el.element == element) && (!token || el.token == token))) {
          el.element.unsubscribe(el.token);
          //console.error('  real unsubscribe on: '+ el.element.id +' | '+ el.token +' | '+ idx, this.subscription.length);
          this.subscription.splice(idx, 1);
        } else {
          ++idx;
        }
      }
    },

    show: function(element) {
      element = _.isString(element) ? this.app.ui.element(element) : element;
      element.show();
      //this.UIElement.push(element);
    },

    hide: function(element) {
      element = _.isString(element) ? this.app.ui.element(element) : element;
      element.hide();
      //this.UIElement.push(element);
    },

    error: function() { ERROR.apply(this, arguments) },

    UIShortcut: function(data, dest) {
      var self = this;
      dest = dest || self.UIElement;
      _.each(data, function(val, key) {
        if (_.isString(val)) {
          dest[key] = self.app.ui.element(val);
        } else {
          dest[key] = {};
          self.UIShortcut(val, dest[key]);
        }
      });
    },

    back: function(element, name) {
      var self = this;
      self.subscribe(element, 'select', function() {
        self.master.moveTo(name);
      });
    },

    moveTo: function(name, param) {
      var self = this;
      self.master.moveTo(name, param);
    }

  });

  var controller = {
    list: {},
    app: null,
    current: null,

    add: function(name, ctrl, UI) {
      this.list[name] = { ctor:ctrl.ctor, dtor:ctrl.dtor, UI: UI ? UI(this) : null };
    },

    moveTo: function(name, param) {
      var self = this;

      param = param || {};

      if (!this.list[name]) {
        console.error('Controller: you tried to move to"'+ name +'" which is unknown');
        return false;
      }

      if (this.current) {
        var last = this.current.name;
        this.current.__destructor();
      }

      self.current = new localController(this.list[name], { name:name, app:self.app, master:self, last:last }, param);

      if (self.current.options.show !== false && self.current.UIElement.panel)
        self.current.UIElement.panel.show();

      return true; 
    },

    start: function() {
      var UI = _.reduce(this.list, function(current, elem) {
        if (elem.UI) current.push(elem.UI[0]);
        return current;
      }, []);

      console.warn('UI', UI);

      this.app.ui.set('/', UI, function() { console.log('UI inserted'); });
    },

    error: function() { ERROR.apply(this, arguments) }
  };

  return controller;
});
