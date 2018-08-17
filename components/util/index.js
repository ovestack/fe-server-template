'use strict'
var fs = require('fs')
var util = require('util')

var promisify = (function() {
    if (util.promisify) {
        return util.promisify
    }
    var promisify = function(fn) {
    	return new Promise(function(resolve, reject) {
    		fn(function(err,data) {
    			if (err) {
    				reject(err)
    			} else {
    				if (arguments.length > 2) {
                        data = [].slice.call(arguments, 1)
                    }
    				resolve(data)
    			}
    		})
    	})
    }
    return function(originFn) {
    	return function() {
            var args = [].slice.call(arguments)
        	return promisify(function(cb) {
        		args = args.concat(cb)
        		originFn.apply(this, args)
        	}.bind(this))
        }
    }
})()

var walk = function(dir, cb) {
    var rets = []
    rets = fs.readdirSync(dir)
    if (cb) {
        rets = rets.filter(cb)
    }
    return rets
}

function isType(type){
	return function(el){
		return Object.prototype.toString.call(el) === '[object '+type+']'
	}
}

function reload_module(module_path) {
    var mod_path = require.resolve(module_path)
    var module = require.cache[mod_path]
    if (module && module.parent) {
        module.parent.children.splice(module.parent.children.indexOf(module), 1);
    }
    module = require.cache[mod_path] = null
}

function merge(target, ...sources) {
    if (!sources.length) return target
    const source = sources.shift()
    const isObject = isType('Object')
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                    merge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return merge(target, ...sources);
}

module.exports = {
    promisify,
	walk,
    isGenerator: isType('GeneratorFunction'),
    isArray: isType('Array'),
    isObject: isType('Object'),
    isFunction: isType('Function'),
    isString: isType('String'),
    isNumber: isType('Number'),
    isAsync: isType('AsyncFunction'),
    reload_module,
    merge
}
