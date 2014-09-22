var _ = require('underscore');

module.exports = require('fluxxor').createStore({
  initialize: function(config) {
    this.state = {
      keysErrs: null,
      layoutErrs: null,
      toJSONErrs: null,
      savingErrs: null,
      keys: [],
      key: null,
      layout: '',
      saving: false,
      loading: false,
      dirty: false
    };


    this.bindActions('keys:load', 'keys:load',
      'keys:load:success', 'keys:load:success',
      'keys:load:fail', 'keys:load:fail',
      'key:set', 'key:set',
      'layout:set', 'layout:set',
      'layout:load', 'layout:load',
      'layout:load:success', 'layout:load:success',
      'layout:load:fail', 'layout:load:fail',
      'layout:toJSON', 'layout:toJSON',
      'layout:toJSON:success', 'layout:toJSON:success',
      'layout:toJSON:fail', 'layout:toJSON:fail',
      'layout:save', 'layout:save',
      'layout:save:success', 'layout:save:success',
      'layout:save:fail', 'layout:save:fail');

  },
  setState: function(state, clear) {
    this.state = clear ? state : _.extend({}, this.state, state);
    this.emit('change');

  },
  get: function(key) {
    if (!key) {
      return this.state;
    }
    return this.state[key];
  },

  'keys:load': function() {
    this.setState({
      keysErrs: null,
      loading: true
    });
  },
  'keys:load:success': function(payload) {
    this.setState({
      loading: false,
      keys: payload.keys
    });
  },
  'keys:load:fail': function(payload) {
    this.setState({
      loading: false,
      keys: [],
      keysErrs: [payload.err]
    });
  },
  'key:set': function(payload) {
    this.setState({
      key: payload.key,
      layout: null
    });
  },
  'layout:set': function(payload) {
    this.setState({
      layout: payload.layout,
      dirty: true
    });
  },
  'layout:load': function() {
    this.setState({
      layoutErrs: null,
      loading: true
    });
  },
  'layout:load:success': function(payload) {
    this.setState({
      originalLayout: payload.layout,
      layout: payload.layout,
      loading: false,
      dirty: false
    })
  },
  'layout:load:fail': function(payload) {
    this.setState({
      layoutErrs: payload.err,
      layout: null,
      loading: false
    })
  },
  'layout:toJSON': function() {
    this.setState({
      toJSONErrs: null,
      loading: true
    })
  },
  'layout:toJSON:success': function(payload) {
    this.setState({
      obj: payload.obj,
      loading: false

    })
  },
  'layout:toJSON:fail': function(payload) {
    this.setState({
      toJSONErrs: [payload.err],
      loading: false,
      obj: null
    })
  },
  'layout:save': function(payload) {
    this.setState({
      savingErrs: null,
      saving: true
    })
  },
  'layout:save:success': function() {
    this.setState({
      saving: false,
      dirty: false
    });
  },
  'layout:save:fail': function(payload) {
    this.setState({
      savingErrs: [payload.err]
    });
  }


});