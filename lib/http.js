// isomorphic http client base for generated endpoints in route.js
// use this if you want to talk to the service via http

var _ = require('underscore'),
  superagent = require('superagent');

function client(options) {
  // the good thing here is you won't have to declare tag names 
  // and no weight of compile libs, etc
  // feel free to add an lsacche layer. your call.
  // you'll have to set the password header though
  // and it'll have to be preconfigured
  if (!(this instanceof client)) {
    return new client(options);
  }

  this.config = options || {};
  if (!this.config.path) {
    throw new Error('needs path configuration');
  }

  // check for trailing /
  var p = this.config.path;
  if (p[p.length - 1] !== '/') {
    this.config.path += '/'
  }

}

_.extend(client.prototype, {
  get: function(key, callback) {
    return this.request('get', key).end(function(err, res){
      if(err){
        return callback(err);
      }
      callback(null, res.body);
    });
  },

  raw: function(key, callback) {
    return this.request('get', 'store/' + key).end(function(err, res){
      if(err){
        return callback(err);
      }
      callback(null, res.body.value || null);
    });
  },

  keys: function(callback){
      return this.request('get', '_keys_').end(function(err, res){
      if(err){
        return callback(err);
      }
      callback(null, res.body || []);
    });
  },

  set: function(key, value, callback) {
    if (!this.config.password) {
      throw new Error('missing password');
    }
    return this.request('post', key).send({
      value: value
    }).end(function(err, res){
      if(err){
        return callback(err);
      }
      callback(null, res.body);
    });
  },

  query: function(query, callback) {
    return this.request('get', '?query=' + encodeURIComponent(JSON.stringify(query))).end(function(err, res){
      if(err){
        return callback(err);
      }
      callback(null, res.body);
    });
  },

  clear: function(key, callback){
    // todo
    throw new Error('not implemented');
  },

  toJSON: function(src, callback){
    return this.request('post', '_toJSON_').send({
      value: src
    }).end(function(err, res){
      if(err || res.error){
        return callback(err || res.body || res.error);
      }
      callback(null, res.body);
    })
  },


  request: function(method, path) {
    var req = superagent[method](this.config.path + path).type('json');
    if (this.config.password) {
      req = req.set('myxtape', this.config.password);
    }
    return req;

  }
});

module.exports = client;