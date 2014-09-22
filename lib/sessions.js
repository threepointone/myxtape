var _ = require('underscore'),
  sessions = require('client-sessions');

module.exports = function(config) {
  if (!config.secret) {
    throw new Error('sessions require a .secret, preferably a good one');
  }
  return sessions(_.extend({
    duration: 15 * 60 * 60 * 1000,
    activeDuration: 1000 * 60 * 5
  }, config));
};