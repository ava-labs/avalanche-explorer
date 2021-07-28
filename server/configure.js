let api = require('./configure')
let { getMetadata } = require('./metadata')

function beforeMiddleware(app) {
    app.use('/api', api)
}

function onListening() {
    getMetadata()
    setInterval(updatePrices, 60000)
}

module.exports = {
    beforeMiddleware,
    onListening,
}
