// parse.com
var superagent = require('superagent');

var _ = require('underscore');

function httpErrCallback(fn){
  return function(err, res){
    if(err){
      return fn(err, res);
    }
    if(res && res.error){
      return fn(res.error, res);
    }
    fn(null, res);
  };
}

function httpErr(status, msg){
  var err = new Error(msg);
  err.status = status;
  return err;
}

function db(config) {
  if (!(this instanceof db)) {
    return new db(config);
  }

  this.config = config || {};

  if(!this.config.appID || !this.config.appKey){
    throw new Error('parse credentials missing');
  }

  // todo - throw if appId and appKey are not passed in



}

_.extend(db.prototype, {
  setup: function(callback) {
    // can't really create tables via script?
  },
  teardown: function(callback) {

  },
  read: function(key, callback) {
    return this._where({key: key}, function(err, res){
      if(err){
        return callback(err);
      }
      if(!res[0]){
        return callback(httpErr(404, 'not found'));
      }
      callback(null, res[0]);
    });
  },
  
  set: function(key, value, callback){
    var t = this;

    this.read(key, function(err, res){
      if(err){
        if(err.status === 404){
          return t._request('post').send({key:key, value: value}).end(httpErrCallback(andThen));
        }
        return callback(err);
      }
      return t._request('put', res.objectId).send({key:key, value: value}).end(httpErrCallback(andThen));
      
    });

    function andThen(err, res){
      if(err){
        return callback(err);
      }
      return callback(null, res.body);
    }
  },
  del: function(key, callback) {
    // todo - not tested!!!
    this.read(key, function(err, res){
      if(err){
        return callback(err);
      }
      t._request('delete', res.objectId).end(httpErrCallback(andThen));
    });
    function andThen(err, res){
      if(err){
        return callback(err);
      }
      return callback(null, res.body);
    }
  },
  query: function(options, callback) {

    var path = _.reduce(options, function(arr, value, key){
      return arr.concat([encodeURIComponent(key) + (value ? ('=' + encodeURIComponent(value)) : '') ]);
    }, []).join('&'),

      req = this._request('get', '?' + path).end(httpErrCallback(function(err, res){
        if(err){
          return callback(err);
        }
        callback(null, res.body.results);
      }));
      return req;
  },
  _request: function(method, path){
    // helper, don't use
    return superagent[method]('https://api.parse.com/1/classes/' + this.config.collection + '/' + (path || ''))
      .type('json')
      .set('X-Parse-Application-Id', this.config.appID)
      .set('X-Parse-REST-API-Key ', this.config.appKey);
  },
  _where: function(w, callback){
    return this.query({
      where: JSON.stringify(w)
    }, callback);
  }

});

module.exports = db;