var _ = require('underscore');

function spaces(n) {
	return new Array(n).join(' ');  
}

function json2jsx(node, indent) {
  indent = indent || 0;
  return spaces(indent) + '<' + node.type + (node.props ? ('\n' + _(node.props).map(function(v, k) {
    return spaces(indent + 2) + k + '="' + v + '"';
  }).join(' \n')) : '') + '>\n' + _(node.children).map(function(c) {
    return json2jsx(c, indent + 2);
  }).join('') + spaces(indent) + '</' + node.type + '>\n'
}

module.exports = json2jsx;