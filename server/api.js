let router = require('express').Router()
const abis = require('./metadata')

router.get('/metadata', function (req, res) {
    res.json(abis)
})

module.exports = { router }
