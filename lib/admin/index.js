var Fluxxor = require('fluxxor'),
  React = require('react/addons');

window.React = React;

function app(config) {
  config || (config = {});

  var actions = require('./actions')({
    client: config.client,
    url: config.url,
    password: config.password
  });

  var stores = require('./stores')();

  var mount = config.el || document.body;

  var flux = new Fluxxor.Flux(stores, actions);

  var Application = require('./editor.jsx')({
    flux: flux,
    components: config.components,
  });

  function render() {
    React.renderComponent(Application, mount);
  }

  // stores.collection.on('change', render);
  render();

  flux.actions['keys:load']();

  var _d = flux.dispatcher.dispatch;
  flux.dispatcher.dispatch = function() {
    console.log('$d', arguments[0]);
    return _d.apply(flux.dispatcher, arguments);
  }

  return flux;
}

module.exports = app;