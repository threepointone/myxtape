var express = require('express'),
  _ = require('underscore'),
  sessions = require('./sessions'),
  browserify = require('browserify-middleware');
Router = express.Router;


module.exports = function(config) {
  config || (config = {});

  var router = new Router(),
    client = require('./client')(config),
    cookieName = (process.env.NODE_ENV || 'development') + '_myxtape_' + config.collection;

  var auth = require('./authware').basic(config);


  // setup client side sessions. whee!
  if (config.sessionConfig) {
    router.use('*', sessions(_.extend({
      cookieName: cookieName,
    }, config.sessionConfig)));
  }

  router.get('/', function(req, res, next) {
    client.query(JSON.parse(req.query.query || '{}'), function(err, obj) {
      if (err) {
        return next(err);
      }
      res.type('json');
      res.send(obj || []);
    });
  });

  router.get('/_keys_', function(req, res, next) {
    client.keys(function(err, keys) {
      if (err) {
        return next(err);
      }
      res.type('json');
      res.send(keys);
    });
  });

  // compiled and transformed 
  router.get('/:key', function(req, res, next) {
    if (req.params.key === 'admin') { // bypass
      return next();
    }
    client.get(req.params.key, function(err, obj) {
      if (err) {
        return next(err);
      }
      res.type('json');
      res.send(obj);
    });
  });


  // these need to be password protected

  // returns raw document
  router.get('/store/:key', auth, function(req, res, next) {
    client.store.get(req.params.key, function(err, doc) {
      if (err) {
        return next(err);
      }
      res.type('json');
      res.send(doc || {});
    });
  });

  router.post('/_toJSON_', auth, function(req, res, next) {
    res.type('json');
    client.toJSON(req.body.value, function(err, obj) {
      if (err) {
        return next(err);
      }
      res.send(obj || {});
    });
  });

  router.post('/_clearCache_', auth, function(req, res, next) {
    res.type('json');
    res.send({});
    client.cache.clear(req.body.key);
  });

  router.post('/:key', auth, function(req, res, next) {
    res.type('json');
    client.set(req.params.key, req.body.value, function(err, obj) {
      if (err) {
        return next(err);
      }
      res.send(obj);
    });
  });

  router.delete('/:key', auth, function(req, res, next) {
    client.del(key, function(err) {
      if (err) {
        return next(err);
      }
      res.send({});
    });
  });

  if (config.admin) {
    // todo - this yucky, and must be rewritten
    router.get('/admin', auth, function(req, res, next) {
      res.render(config.view);
    });

    router.get('/admin/script.js', auth, browserify(config.admin, {
      cache: 'dynamic',
      debug: (process.env.NODE_ENV === 'development')
    }));
  }



  return router;
};