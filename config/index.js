'use strict'
var path = require('path'),
    fs = require('fs'),
    version = requireMod('version')

var util = requireMod('util')

const ENV = process.env.NODE_ENV || 'development'

const MAPS = {
    development: 'dev',
    production: 'prod'
}

var configs = {
    development: require('./config.dev'),
    production: require('./config.prod')
}

var config = require('./config')

config = exports = module.exports = util.merge({}, config, configs[ENV])

global.getConfig = function(key) {
    if (!key) {
        return config
    }
    var module = path.resolve(__dirname, './conf', key + '.js')
    if (!fs.accessSync(module)) {
        module = require(module)
    } else {
        module = null
        return {}
    }
	var conf = {}
	if (module.default) {
		conf = module.default
	}
	var env_conf = module[MAPS[ENV]]
	if (env_conf) {
		util.merge(conf, env_conf)
	}
	env_conf = module = null
	return conf
}

var static_dir = getConfig('staticConfig').dir

if (config.revision) {
    if (!config.entry) {
        config.version = version.max(util.walk(static_dir, function(ret) {
            return version.is(ret) && ret.indexOf(['.DS_Store']) === -1
        }))
        config.entry = '/' + config.version + '/index.html'
    } else {
        if (!config.version) {
            var matched = version.match(config.entry)
            matched = matched[0] || '1.0.0'
            config.version = matched
        }
    }
}

