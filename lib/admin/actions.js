// [
//   'keys:load', 'keys:load:success', 'keys:load:fail',
//   'key:set',
//   'layout:set',
//   'layout:load', 'layout:load:success', 'layout:load:fail',
//   'layout:toJSON', 'layout:toJSON:success', 'layout:toJSON:fail'
//   'layout:save', 'layout:save:success', 'layout:save:fail'
// ]

module.exports = function(config) {
  config || (config = {});

  var client = config.client || require('../http')({
    path: config.url,
    password: config.password || 'bugidiboo'
  });

  var actions = {
    'keys:load': function() {
      var t = this;
      this.dispatch('keys:load');
      client.keys(function(err, keys) {
        if (err) {
          return t.dispatch('keys:load:fail', {
            err: err
          });
        }
        t.dispatch('keys:load:success', {
          keys: keys
        });
        if (keys.length > 0) {
          actions['key:set'].call(t, keys[0]);
        }
      });
    },

    'key:set': function(key) {
      this.dispatch('key:set', {
        key: key
      });
      key && actions['layout:load'].call(this, key);
    },

    'layout:load': function(key) {
      var t = this;

      this.dispatch('layout:load', {
        key: key
      });
      client.raw(key, function(err, layout) {
        if (err) {
          return t.dispatch('layout:load:fail', {
            err: err
          });
        }
        actions['layout:set'].call(t, layout);
        t.dispatch('layout:load:success', {
          key: key,
          layout: layout
        });

      });
    },

    'layout:set': function(layout) {
      this.dispatch('layout:set', {
        layout: layout
      });
      actions['layout:toJSON'].call(this, layout);
    },

    'layout:toJSON': function(layout) {
      var t = this;
      this.dispatch('layout:toJSON', {
        layout: layout
      });

      client.toJSON(layout, function(err, obj) {
        if (err) {
          return t.dispatch('layout:toJSON:fail', {
            err: err
          });
        }
        t.dispatch('layout:toJSON:success', {
          obj: obj
        });
      });
    },

    'layout:save': function(key, layout) {
      var t = this;
      this.dispatch('layout:save', {
        key: key,
        layout: layout
      });

      client.set(key, layout, function(err) {
        if (err) {
          return t.dispatch('layout:save:fail', {
            err: err
          });
        }
        t.dispatch('layout:save:success');
      });
    }
  };
  return actions;
};