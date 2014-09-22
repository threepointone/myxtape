var LRU = require('lru-cache'),
  _ = require('underscore');

function cache(config) {
  if (!(this instanceof cache)) {
    return new cache(config || {});
  }
  this.lru = new LRU({
    max: config.max || 100,
    maxAge: config.maxAge || 1000 * 10,
    length: config.length,
    dispose: config.dispose,
    stale: true
  });
}

_.extend(cache.prototype, {
  has: function(key, callback){
    return (callback(null, this.lru.has(key)));
  },
  get: function(key, callback) {
    callback || (callback = function(){});
    callback(null, this.lru.get(key));

  },
  set: function(key, value, callback) {
    callback || (callback = function(){});
    callback(null, this.lru.set(key, value));
  },
  clear: function(key, callback) {
    callback || (callback = function(){});
    if (typeof key === 'function') {
      callback = key;
      key = '';
    }
    if (!key) {
      this.lru.reset();
    }
    this.lru.del(key);

    return callback();
  }
});

module.exports = cache;