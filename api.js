const router = require('express').Router()
const { versions } = require('./versions')

router.get('/peerinfo', function (req, res) {
    res.json(versions)
})

module.exports = router
