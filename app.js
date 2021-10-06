const express = require('express')
const morganBody = require('morgan-body')

// initiate app with parsers
const app = express()
app.use(express.json())
app.use(express.urlencoded())

// middleware
morganBody(app);

// routes
app.get('/', (request, response) => {
    response.send('<h1>Hello World, this is LTI 1.1</h1>')
})

app.post('/lti', (request, response) => {
    
    // handle launch data here
    response.json({
        message: "not yet implemented"
    })
})

module.exports = app