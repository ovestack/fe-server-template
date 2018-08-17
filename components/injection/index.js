'use strict'

var isObject = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

var replaceVars = function(html) {
    var injection = getConfig('injection') || {}
    Object.keys(injection).forEach(function(key) {
        var data = injection[key]
        if (isObject(data)) {
            data = JSON.stringify(data)
        }
        html = html.replace('{' + key +'}', data)
    })
    injection = null
    return html
}

module.exports = replaceVars