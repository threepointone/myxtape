var auth = require('basic-auth');

function needsAuth(res) {
	res.statusCode = 401;
	res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
	return res.end('<html><body>username/password required</body></html>');
}

module.exports.basic = function(options) {
	return function(req, res, next) {
		var user = auth(req);
		var authenticate = options.authenticate || function(user, fn){ fn(null, true);};
		if (!user) {
			return needsAuth(res);
		}
		authenticate(user, function(err, valid) {
			if (err) {
				return next(err)
			}
			if (!valid) {
				return needsAuth(res);
			}
			next();
		});
	}
};