// this file is mostly useless, and should probably be phased out. 


var _ = require('underscore'),
  db = require('./db');

function truncate(str, length) {
  length = length || 40;
  if (str.length > length) {
    return str.substr(0, length) + '...';
  }
  return str;
}

function store(options) {
  if (!(this instanceof store)) {
    return new store(options);
  }

  this.config = options || {};

  if (!this.config.collection) {
    throw new Error('missing collection name');
  }

  this.db = this.config.db || db(_.extend({}, this.config.dbConfig || {}, {
    collection: this.config.collection
  }));
}

_.extend(store.prototype, {
  get: function(key, callback) {
    return this.db.read(key, callback);
  },

  set: function(key, value, callback) {
    if (typeof value !== 'string') {
      throw new Error('cannot set non-string value in a text field');
    }
    return this.db.set(key, value, callback);

  },

  del: function(key, callback) {
    return this.db.del(key, callback);
  },

  query: function(options, callback) {
    return this.db.query(options, callback);
  }
});

module.exports = store;