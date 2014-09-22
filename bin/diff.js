// don't use

require('node-jsx').install({
	extension: '.jsx',
	harmony: true
});


function trunco(str, length){
	length = length || 40;
	if(str.length<length){
		return str;
	}
	return str.substr(0, (length/2 -2) ) + ' ... ' + str.slice(str.length - (length/2 -2) );
}

var jsdiff = require('diff'),
	_ = require('underscore'),
	colors = require('colors'),
	async = require('async');

var store = require('myxtape/lib/store')(require('./config').storeConfig);

var store1Config = {
	collection: 'RetailAndroid',
	dbConfig: require('../../dbConfig')['development']
};

var store2Config = {
	collection: 'RetailAndroid',
	dbConfig: require('../../dbConfig')['test']
};

function diff(one, two) {
	var d = jsdiff.diffLines(one, two);
	d.forEach(function(part, i) {
		// green for additions, red for deletions
		// grey for common parts

		var color = part.added ? 'green' :
			part.removed ? 'red' : 'grey';
		if(color==='grey'){
			process.stderr.write(trunco(part.value[color]));
			
		}
		else{
			process.stderr.write(part.value[color]);
			
		}		
	});
}

var store = require('myxtape/lib/store')

var store1 = store(store1Config);

var store2 = store(store2Config);

async.parallel([
	function(done) {
		store1.query(done);
	},
	function(done) {
		store2.query(done);
	}
], function(err, resArr) {
	_(resArr[0]).each(function(doc) {
		var match = _(resArr[1]).find(function(d) {
			return d.key === doc.key;
		});
		if(match){
			diff(doc.value, match.value);
		}

	});

});