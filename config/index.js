'use strict'
var path = require('path'),
    fs = require('fs')

var {
    merge,
    walk
} = requireMod('util')

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

config = exports = module.exports = merge({}, config, configs[ENV])

var getModuleConf = function(file) {
    var {
        name: key
    } = path.parse(file)
    var module = require(path.resolve(__dirname, './conf', file))
    var conf = {}
    if (module.default) {
        conf = module.default
    }
    var env_conf = module[MAPS[ENV]]
    if (env_conf) {
        merge(conf, env_conf)
    }
    env_conf = module = null
    return {
        [key]: conf
    }
}

global.getConfig = function(key) {
    if (!key) {
        return config
    }
    var keys = key.split('.')
    var re = config
    while (key = keys.shift()) {
        if (typeof re[key] !== 'undefined') {
            re = re[key]
        } else {
            re = undefined
            break
        }
    }
	return re
}

walk(path.resolve(__dirname, './conf'), (dir) => {
    merge(config, getModuleConf(dir))
})