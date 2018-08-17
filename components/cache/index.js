var LRU = require('lru-cache'),
    cache_config = getConfig('cache')

var Cache = function(ns, config) {
    if (!ns) return
    ns = ns.toLowerCase()
    config = config || {}
    if (cache_config.hasOwnProperty(ns)) {
        config = Object.assign({}, cache_config.default || {}, cache_config[ns], config)
    }
    this.config = config
    this.cache = LRU(config)
}

Cache.prototype = {
    get: function(key) {
        return this.cache.get(key)
    },
    set: function(key,val) {
        this.cache.set(key,val)
        return this
    },
    del: function() {
        this.cache.clear()
        this.cache = null
    }
}

module.exports = Cache