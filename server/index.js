const express = require('express')
const app = express()
const metadata = require('./metadata')

app.get('/api/metadata/:addressId', async function (req, res) {
    let response = await metadata.getMetadata(req.params.addressId)
    res.send(response)
})

// ports will distinguish
const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`listening on ${port}`)
})
