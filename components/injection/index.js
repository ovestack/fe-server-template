'use strict'
var {
    isObject
} = requireMod('util')

var replaceVars = function(html) {
    var injection = getConfig('injection') || {}
    Object.keys(injection).forEach(function(key) {
        var data = injection[key]
        if (isObject(data)) {
            data = JSON.stringify(data)
        }
        html = html.replace(`{${key}}`, data)
    })
    injection = null
    return html
}

module.exports = replaceVars