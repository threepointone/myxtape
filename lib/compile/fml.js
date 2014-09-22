var extract = require('extract-values'),
	yaml = require('js-yaml');


module.exports = function(src, options){

	var extracted = src.split('---\n'),
		frontmatter = yaml.load('---\n' + extracted[1]);


	return {
		meta: frontmatter,
		body: require('./' + frontmatter.format)(extracted[2])
	};
};