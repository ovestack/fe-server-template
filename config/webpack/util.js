var fs = require('fs'),
    path = require('path')

const DIR = path.resolve(__dirname, '../../views')
const BASE_DIR = require('./vars').BASE_DIR

function resolvePath(dir) {
    return dir.split(path.sep).join('/')
}

function getComponentName(realPath) {
    return Camelize(resolvePath(path.dirname(realPath).replace(DIR,'')))
}

function getComponentFile(realPath) {
    return resolvePath(realPath)
}

function Camelize(prop){
    if (prop.indexOf('/') === 0) {
        prop = prop.slice(1)
    }
	return prop.replace(/\/([a-z])/ig,function(all,letter){
        return letter.toUpperCase()
    })
}

function genHtmlFileName(filename) {
    filename = filename.replace(BASE_DIR, '')
    return path.join(path.dirname(filename), 'index.html')
}

var getEntrys = function(type) {
    type = '.' + type
    var entrys = {}
    function gen(dir){
        var fss = fs.readdirSync(dir)
        fss.forEach(function(f){
            var basename = path.basename(f),
                realPath = path.resolve(dir,f)
            if(basename[0] === '_') return
            var stat = fs.statSync(realPath)
            if(stat.isDirectory()){
                gen(realPath)
            } else {
                var extname = path.extname(realPath)
                if (extname !== type) return
                var basename = path.basename(realPath).replace(extname,''),
                    dirname = path.dirname(realPath).split(path.sep).pop()
                if (basename === dirname.split(path.sep).pop()) {
                    entrys[getComponentName(realPath)] = getComponentFile(realPath)
                }
            }
        })
        return entrys
    }
    return gen(DIR)
}

module.exports = {
    getEntrys,
    genHtmlFileName
}