var path = require('path'),
	config = getConfig()

exports.default = {
	dir: path.join(__dirname, '../../public'),
}

exports.prod = {
    maxAge: 24 * 60 * 60
}

exports.dev = {
    maxAge: 0,
    hidden: true
}