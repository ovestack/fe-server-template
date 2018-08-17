var VERSION_REG = /^v?(?:0|[1-9]\d*)(\.(?:[x*]|0|[1-9]\d*)(\.(?:[x*]|0|[1-9]\d*)(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i;

var sort_version = function(v1,v2) {
    // 去除v
    v1 = v1.replace('v', '').split('.')
    v2 = v2.replace('v', '').split('.')
    var len = Math.max.call(Math,v1.length,v2.length)
    var ret = -1
    for(var i = 0,l = len;i < l;i++) {
        if(v1[i] >= v2[i]) {
            continue
        } else {
            return 1
        }
    }
    return ret
}

exports.max = function(versions) {
    var sorted = versions.sort(sort_version)
    return sorted[0]
}

exports.min = function(versions) {
    var sorted = versions.sort(sort_version)
    sorted.reverse()
    return sorted[0]
}

exports.get = function(input) {
    var matched = input.match(VERSION_REG)
    if (matched) {
        return matched[0]
    } else {
        return matched
    }
}

exports.match = function(input) {
    input = input.split('/')
    var ret = []
    input.forEach(function(path) {
        var matched = path.match(VERSION_REG)
        if (matched) {
            ret.push(matched[0])
        }
    })
    return ret
}

exports.is = function(input) {
    return input.match(VERSION_REG)
}