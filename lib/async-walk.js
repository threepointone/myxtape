//async tree traversale, tuned for the type/props/children format that we use
// depth first, starts with the children and moves up
var async = require('async'),
  _ = require('underscore');

function walk(node, handlers, callback) {
  handlers || (handlers = {});
  async.parallel(_(node.children || []).map(function(child) {
    return function(done) {
      walk(child, handlers, done);
    };
  }), function(err, resArr) {
    if (err) {
      return callback(err);
    }
    var children = resArr;
    // default function
    var fn = handlers[node.type] || function(node, cb) {
      var n = {
        type: node.type,
        props: node.props // todo - some kind of immutable copy?
      };
      if (resArr && resArr.length > 0) {
        n.children = children;
      }
      cb(null, n);
    };
    fn(node, callback);
  });
}

module.exports = walk;