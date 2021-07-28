const express = require('express')
const app = express()

// ports will distinguish
// port/api/metadata =>
/**
 * localhost:8080/ => vue app
 *
 *
 *
 * https explroera.avax.network:443/ => vue app
 * explroera.avax.network:4000
 */
const port = process.env.PORT || 4000

app.listen(port, () => {
    onListening()
    console.log(`listening on ${port}`)
})
