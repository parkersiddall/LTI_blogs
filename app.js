const express = require('express')

// initiate app with parsers
const app = express()
app.use(express.json())
app.use(express.urlencoded())

// routes
app.get('/', (request, response) => {
    response.send('<h1>Hello World, this is LTI 1.1</h1>')
})

app.post('/lti', (request, response) => {
    
    // handle launch data here
    console.log(request.body)
    response.json({
        message: "not yet implemented"
    })
})

module.exports = app