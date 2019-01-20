'use strict'

var cron = require('./cron'),
    fs = require('fs'),
    path = require('path'),
    config = getConfig('cron')

function getEntry(dir, result) {
    var fss = fs.readdirSync(dir)
    fss.forEach(function(f) {
        f = path.join(dir,f)
        var stat = fs.statSync(f)
        if (stat.isDirectory()) {
            getEntry(f,result)
        } else {
            var ext = path.extname(f)
            if (ext !== '.js') return
            if (path.basename(f).replace(ext, '') === path.dirname(f).split(path.sep).pop()) {
                result.push(f)
            }
        }
    })
}

var result = []

getEntry(path.resolve(__dirname, '../../cron'), result)

result.forEach(function(entry) {
    var task = require(entry) || {}
    var key = task.key
    if (!key) return
    var conf = config[key] || {}
    conf.name = key
    if (conf && conf.enable === false) return    
    switch (conf.type) {
        case 'interval':
            cron.interval(conf, task)
            break
        case 'schedule':
            ;(async function() {
                await cron.schedule(conf, task)
            })()
            break
    }
})