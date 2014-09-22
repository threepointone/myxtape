var _ = require('underscore');

// var htmlTags = require('./html-tags');

var content = {
  toComponent: function(node, options) {
    if (node) {
      // if(options.tags[node.type]){}
      // if html component 
      // if string 
      // if array
      if(!node || _.isEmpty(node)){
        return;
      }
      return options.components[node.type](node.props, _(node.children || []).reduce(function(arr, child) {
        if (typeof child == 'string') return arr;
        // if(typeof child =='string') return arr.concat(child);
        return arr.concat(content.toComponent(child, options));
      }, []));
    }

  }
}

module.exports = content;