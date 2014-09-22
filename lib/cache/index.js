// asynchronous caches

var Promise = require('es6-promise').Promise;

var adapters = {
  ':memory': require('./memory'),
  ':redis': require('./redis'),
  ':fs': require('./fs')
};


module.exports = function(config) {
  config || (config = {});

  var cache = adapters[config.adapter || ':memory'](config);

  cache.cachify = cache.cachify || function(fn) {
    var promises = {};

    return function(key, callback) {
      cache.has(key, function(err, has) {
        if (has) {
          return cache.get(key, callback);
        }

        if (!promises[key]) {
          promises[key] = new Promise(function(resolve, reject) {
            fn(key, function(err, res) {
              promises[key] = null;
              if (err) {
                return reject(err);
              }
              cache.set(key, res);
              return resolve(res);
            });
          });

        }
        return promises[key].then(function(res) {
          callback(null, res);
        })['catch'](function(err) {
          callback(err);
        });
      });
    };
  };
  return cache;
};

// peer dependencies on react, express, mysql, sqlite3, pg, mongo, whatnot