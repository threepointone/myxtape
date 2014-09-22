// for now, we hardwire to sql version

var adapters = {
	':sql': require('./sql'),
	':parse': require('./parse'),
	':fs': require('fs')
};

module.exports = function(config){
	config || (config = {});
	return adapters[config.adapter || ':sql'](config);
};