var mongoose = require('mongoose'),
    config = getConfig('db'),
    db = mongoose.connection

var logger = getLogger('mongo')

db.on('error', function(err) {
    logger.error(err)
})
db.once('open', function() {
    logger.info('connect!')
})

mongoose.Promise = global.Promise

module.exports = mongoose.connect(config, {
    useMongoClient: true,
    autoReconnect: true
}).catch(err => {
    logger.error(err)
})
