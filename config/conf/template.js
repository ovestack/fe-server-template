var path = require('path')

exports.default = {
	root: path.join(__dirname, '../../views'),
	layout: false,
	viewExt: 'html'
}

exports.prod = {
    cache: true
}

exports.dev = {
    cache: false
}