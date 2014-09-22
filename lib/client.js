// bring in the compilers here

var _ = require('underscore'),
  async = require('async'),
  store = require('./store');

function client(options) {
  if (!(this instanceof client)) {
    return new client(options);
  }
  var t = this;

  this.config = options || {};

  this.store = this.config.store || store(_.extend({
    collection: this.config.collection
  }, this.config.storeConfig));

  t.compile = t.config.compile || t.compile;
  t.transform = t.config.transform || t.transform;
  t.validate = t.config.validate || t.validate;

  // setup caching for .get()
  this.cache = this.config.cache || require('./cache')(this.config.cacheConfig);
  this.get = (t.config.cachify || t.cache.cachify || _.identity)(_.bind(this.get, this));

}

_.extend(client.prototype, {
  get: function(key, callback) {
    var t = this;
    return this.raw(key, function(err, src) {
      if (err) {
        return callback(err);
      }
      return t.toJSON(src, callback);
    });
  },

  raw: function(key, callback) {
    var t = this;
    return this.store.get(key, function(err, doc) {
      callback(err, doc ? doc.value : null);
    });

  },

  keys: function(callback) {
    // needs a more efficient way 
    this.store.query({}, function(err, docs) {
      if (err) {
        return callback(err);
      }
      return callback(null, _(docs).pluck('key'));
    });
  },

  set: function(key, value, callback) {
    // todo - first,  compile to make sure it validates?
    var t = this;
    this.validate(key, value, function(errs){
      if(errs){
        return callback(errs);
      }
      return t.store.set(key, value, function(err, res) {
        // clear cache
        if (!err) {
          t.cache.clear(key);
        }
        return callback(err, res);
      });

    });    
  },

  query: function(query, callback) {
    var t = this;
    return this.store.query(query, function(err, docs) {
      if (err) {
        return callback(err);
      }
      return async.parallel(_.map(docs, function(doc) {
        return function(done) {
          t.toJSON(doc.value, done);
        }
      }), function(err, resArr) {
        if (err) {
          return callback(err);
        }
        return callback(null, resArr);
      });
    });
  },

  validate: function(key, value, callback) {
    return callback();
  },

  compile: function() {
    throw new Error('.compile not defined');
  },

  transform: function(node, callback) {
    return callback(null, node);
  },

  toJSON: function(src, callback) {
    try {
      return this.transform(this.compile(src), callback);
    } catch (e) {
      return callback(e);
    }
  }
});


module.exports = client;