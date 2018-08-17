const ENV = process.env.NODE_ENV || 'development'

const MAPS = {
    development: 'dev',
    production: 'prod'
}

module.exports = require('./webpack.' + MAPS[ENV] + '.js') 