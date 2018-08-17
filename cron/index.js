'use strict'

var cron = requireMod('cron'),
    fs = require('fs'),
    path = require('path'),
    co = require('co')

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

getEntry(__dirname,result)

result.forEach(function(entry) {
    var task = require(entry) || {}
    if (task.enable === false) return
    if (task.type) {
        switch (task.type) {
            case 'interval':
                cron.interval(task.config)
                break
            case 'schedule':
                ;(async function() {
                    await cron.schedule(task.config)
                })()
                break
        }
    }
})