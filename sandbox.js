var _ = require('underscore'),
	superagent = require('superagent');


var compile = require('./lib/compile/fml'),
	src = require('fs').readFileSync('./samples/something.fml', 'utf8');

// console.log(src);
console.log(compile(src));



// var client = require('./src/client')({
// 	storeConfig: {
// 		collection: 'TestCollection'
// 	},
// 	compile: function(src) {
// 		return require('./src/compile')(src, {
// 			tags: ['layout', 'banner', 'tabs', 'tab', 'navi', 'offer', 'carousel', 'image', 'icons', 'icon']
// 		});
// 	},
// 	transform: require('./src/transforms/0.0.x'),
// 	cache:{}
// });


// client.get('home', function(err, obj) {
// 	console.log(JSON.stringify(obj));
// 	process.exit();
// })


// var express = require('express'),
// 	app = express(),
// 	bodyParser = require('body-parser');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());


// app.use(require('./src/route')({
// 	storeConfig: {
// 		collection: 'TestCollection'
// 	},
// 	compile: function(src) {
// 		return require('./src/compile/jsx')(src, {
// 			tags: ['layout', 'banner', 'tabs', 'tab', 'navi', 'offer', 'carousel', 'image', 'icons', 'icon']
// 		});
// 	},
// 	password:'boogabooga',
// 	transform: require('./src/transforms/0.0.x')
// }));

// app.set('port', process.env.PORT || 3000);

// var server = app.listen(app.get('port'), function() {
//   console.log('Express server listening on port ' + server.address().port);

//   superagent.post('http://localhost:3000/men').send({value: require('fs').readFileSync('./samples/men.jsx', 'utf8')}).end(function(err, res){
//   	console.log(err, res ? 'success!' : null);
//   });
// });




// var superagent = require('superagent');
// // var svc = require('./src/service')();

// // svc.get('web.home', function(){
// // 	console.log(arguments);
// // });


// // var backwards = require('./src/backwards'),
// // 	compile = require('./src/compile'),
// // 	src = require('fs').readFileSync('./shops/men.jsx', 'utf8');

// // console.log(JSON.stringify(backwards(compile(src.replace(/&/mg, '&amp;'))), null, '  '));
// var tags = ['layout', 'banner', 'tabs', 'tab', 'navi', 'offer', 'carousel', 'image', 'icons', 'icon', 'product'];


// var client = require('./src/client')({
// 	appId: 'AQ8EpRuxeumxzEd5a4238RWuUgNGYYtKH7pBjgMt',
// 	appKey: 'N6zjLdBq48zclJ2cbSNpIG4pNDS8bAhFaxr3KZeH',
// 	collection: 'TestCollection',
// 	// transform: require('./src/transforms/0.0.x'),
// 	tags: tags,
// 	compile: true
// });

// // client.set('what', 'sadfsdf', function(err, res){
// // 	// console.log(arguments);
// // 	console.log(err);
// // 	client.get('what', function(err, doc){
// // 		console.log(err, doc);
// // 	});	
// // });


// var walk = require('./src/async-walk');

// function product(node, callback) {
// 	// console.log(options);
// 	superagent.get('http://developer.myntra.com/style/' + node.props.id).end(function(err, res) {
// 		if (err) {
// 			return callback(err);
// 		}
// 		callback(null, {
// 			type: 'product',
// 			props: res.body.data
// 		});
// 		// console.log('res', res.body.data);
// 	});
// }

// // client.get('home', function(err, obj) {
// // 	// console.log(JSON.stringify(obj, null, '  '));
// // 	walk(obj, {}, function(err, obj2){
// // 		console.log(JSON.stringify(obj2, null, '  '));
// // 	});

// // });

// // product({id: 123456}, function(err, res){
// // 	// console.log
// // });

// var transform = require('./src/transforms/0.0.x');

// var compile = require('./src/compile'),
// 	src = require('fs').readFileSync('./samples/home.jsx', 'utf8');



// walk(compile(src, {
// 	tags: tags
// }), {
// 	product: product
// }, function(err, obj) {
// 	transform(obj, function(err, transformed){
// 		console.log(JSON.stringify(transformed, null, '  '));
// 		// console.log(arguments);
// 	});

// });


// // console.log(JSON.stringify(backwards(compile(src.replace(/&/mg, '&amp;'))), null, '  '));