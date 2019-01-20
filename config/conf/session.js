var redisConf = getConfig('redis'),
    redisStore = require('koa-redis')
exports.default = {
    sessionKeys: ['fe-server'],
    key: 'fe.sid',
    prefix: 'fe:ss',
    store: redisStore({
        host: redisConf.host,
        port: redisConf.port,
        auth_pass: redisConf.password
    })
}