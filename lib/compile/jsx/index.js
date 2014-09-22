var htmlTags = require('./html-tags');

var slice = [].slice,
  tools = require('react-tools'),
  React = require('react/addons'),
  vm = require('vm'),
  _ = require('underscore');

function jsx2json(jsx, options) {
  var o = {};

  options = options || {};

  _(options.tags || []).each(function(tag) {
    
    o[tag] = function() {
      var children = _(slice.call(arguments, 1)).filter(function(child) {
        return typeof child !== 'string';
      });

      var ret = {
        type: tag
      };
      if(arguments[0]){
        ret.props = arguments[0];
      }

      if (children.length > 0) {
        ret.children = children;
      }

      return ret;
    };
  });
  
  o._ = _;
  o.React = React;  // this... works?!
  
  return vm.runInNewContext(jsx, o, __filename);
}

function compile(src, options) {
  return jsx2json(tools.transform('/** @jsx React.DOM */' + src), options);
}

module.exports = compile;

// todo - lightweight compile for browser?
