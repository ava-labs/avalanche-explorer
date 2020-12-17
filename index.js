const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const history = require('connect-history-api-fallback')

const app = express()

app.disable('x-powered-by')
app.use(cors())
app.use(bodyParser.json())
app.enable('trust proxy')

app.use(function (req, res, next) {
    if (req.secure) {
        // request was via https, so do no special handling
        next()
    } else {
        // request was via http, so redirect to https
        res.redirect('https://' + req.headers.host + req.url)
    }
})

app.use(history())

// Serving Static Files
app.use(express.static('dist'))

const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log(`listening on ${port}`)
})
