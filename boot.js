var log4js = require('log4js')
var mongoose = require('mongoose')

var genModelName = function(model) {
    model = model.replace(/\/([a-z])/g, (str, $1) => {
        return '_' + $1.toUpperCase()
    })
    return `${model[0].toUpperCase()}${model.slice(1)}`
}

global.getLogger = function(cat) {
	return log4js.getLogger(cat)
}

global.requireMod = function(mod) {
	return require('./components/' + mod)
}

global.requireModel = function(model) {
	var schema = require('./models/' + model)
    return mongoose.model(genModelName(model), schema)
}

global.requireService = function(service) {
	return require('./services/' + service)
}

global.genSchema = function(conf) {
    return new mongoose.Schema(conf)
}

require('./config')

log4js.configure(getConfig('log4js'))