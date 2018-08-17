var mongoose = require('mongoose'),
    config = getConfig(),
    db = mongoose.connection

var logger = getLogger('mongo')

db.on('error', function() {
    logger.error('connection error')
})
db.once('open', function() {
    logger.info('connect!')
})

mongoose.Promise = global.Promise

module.exports = mongoose.connect(config.db, {
    useMongoClient: true
})