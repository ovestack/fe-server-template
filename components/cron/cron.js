'use strict'
var co = require('co'),
    shortid = require('shortid'),
    logger = getLogger('cron'),
    redis = requireMod('redis'),
    util = requireMod('util')

const CRON_KEY = '__cron'

var interval = function(opt, callback) {
    opt = opt || {}
    var delay = opt.delay * 1e3
    if (typeof callback !== 'function') return
    var cb = callback()
    if (cb && typeof cb.then === 'function') {
        cb.then(function() {
            setTimeout(function() {
                interval(opt, callback)
            }, delay)
        },function() {
            logger.error('Cron:interval', opt.name)
            callback._errorcount = callback._errorcount || 0
            ++callback._errorcount
            if (opt.repeat) {
                if (callback._errorcount > opt.repeat) {
                    return
                }
            }
            setTimeout(function() {
                interval(opt, callback)
            }, delay)
        })
    } else {
        setTimeout(function() {
            interval(opt, callback)
        }, delay)
    }
}

// config set notify-keyspace-events KEA

var schedules = {}

var subRedisClient = redis.connect({
    db: 1
})

var scheduleRedis = redis()

;(async function () {
    subRedisClient.psubscribe('__keyevent@' + 1 + '__:expired')
    subRedisClient.on('pmessage', function(pattern, channel, expiredKey) {
        co(function*() {
            expiredKey = expiredKey.split(':')
            var eventType = expiredKey[0]
            switch (eventType) {
                case CRON_KEY:
                    let key = expiredKey[1],
                        schedule = schedules[key]
                    if (util.isGenerator(schedule.fn)) {
                        yield schedule.fn.apply(null, schedule.args || [])
                    } else {
                        schedule.fn.apply(null, schedule.args || [])
                    }
                    schedules[key] = null
                    delete schedules[key]
                    break
            }
        }).catch(function(err) {
            logger.error('Cron:schedule', err)
        })
    })
})()

var schedule = async function(opt, callback) {
    opt = opt || {}
    if (typeof callback !== 'function') return
    var cronId = shortid.generate()
    if (!opt.delay || opt.delay < 0) {
        opt.delay = 1
    }
    var delay = opt.delay * 1e3
    try {
        await scheduleRedis.del(CRON_KEY + ':' + cronId)
        schedules[cronId] = {}
        if (opt.args) {
            schedules[cronId].args = opt.args
        }
        schedules[cronId].fn = callback
        await scheduleRedis.psetex(CRON_KEY + ':' + cronId, delay, '')
    } catch (err) {
        logger.error('Cron:schedule', err)
    }
}

module.exports = {
    schedule,
    interval
}