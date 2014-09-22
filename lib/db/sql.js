// 'sql' adapter
// based on knex, bookshelf


var _ = require('underscore'),
  knex = require('knex'),
  bookshelf = require('bookshelf');

function db(config) {
  if (!(this instanceof db)) {
    return new db(config);
  }
  
  this.config = config || {};

  this.knex = knex(this.config);
  this.bookshelf = bookshelf(this.knex);

  this.Model = this.config.Model || this.bookshelf.Model.extend(this.config.modelConfig || {
    tableName: this.config.collection,
    idAttribute: 'key'
  });

  this.Collection = this.bookshelf.Collection.extend(this.config.collectionConfig || {
    model: this.Model
  });
}

_.extend(db.prototype, {
  setup: function(callback) {
    this.knex.schema.createTable(this.config.collection, function(table) {
      table.increments();
      table.string('key', 32).unique();
      table.text('value');
    }).then(function(x) {
      callback(null, x);
    })['catch'](function(err){
      callback(err);
    });

  },
  teardown: function(callback){
    // todo
  },
  read: function(key, callback) {
    this.Model.where({
      key: key
    }).fetch().then(function(model) {
      callback(null, model ? model.attributes : null);
    })['catch'](function(err){
      callback(err);
    });

  },

  create: function(key, value, callback) {
    var model = new this.Model({
      key: key,
      value: value
    });
    model.save({}, {
      method: 'insert'
    }).then(function(model) {
      callback(null, model ? model.attributes : null);
    })['catch'](function(err){
      callback(err);
    });
  },

  update: function(key, value, callback) {
    var model = new this.Model({
      key: key
    });
    model.save({
      value: value
    }, {
      patch: true
    }).then(function(model) {
      callback(null, model ? model.attributes : null);
    })['catch'](function(err){
      callback(err);
    });
  },

  del: function(key, value, callback) {
    new this.Model({
      key: key
    }).destroy().then(function(model) {
      callback(null, model ? model.attributes : null);
    })['catch'](function(err){
      callback(err);
    });
  },

  set: function(key, value, callback){
    if (typeof value !== 'string') {
      throw new Error('cannot set non-string value in a text field');
    }
    var t= this;

    this.read(key, function(err, doc) {
      if(err){        
        return callback(err);
      }

      if (!doc) {
        return t.create(key, value, callback);
      }
      return t.update(key, value, callback);
    });
  },

  query: function(options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    this.Model.query(options).fetchAll().then(function(collection) {
      callback(null, collection.toJSON());
    })['catch'](function(err){
      callback(err);
    });
  }
  
});

module.exports = db;