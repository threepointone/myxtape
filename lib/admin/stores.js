var Collection = require('./collection');
module.exports = function(config){
	return {
		collection: new Collection()
	};
};