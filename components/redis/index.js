'use strict'

var Redis = require('ioredis'),
    config = getConfig(),
    logger = global.getLogger('redis'),
    util = requireMod('util')

var client = connect()

function connect(conf = {}) {
    conf = util.merge({}, config.redis, conf)
    var client = new Redis(conf)
    client.on('connect', () => {
        logger.info('redis connected')
    }).on('reconnecting', () => {
        logger.info('redis reconnecting')
    })
    return client
}

module.exports = function(ctx) {
    if (ctx) {
        ctx.context.redis = client
    }
    return client
}

module.exports.connect = connect
