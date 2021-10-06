const express = require('express')
const pug = require('pug')
const morganBody = require('morgan-body')

// initiate and configure app
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.set('views', './views')
app.set('view engine', 'pug')

// middleware
morganBody(app);

// routes
app.get('/', (request, response) => {
    response.send('<h1>Hello World, this is LTI 1.1</h1>')
})

app.post('/lti', (request, response) => {
    
    // handle launch data here
    response.render('lti_launch', {
        title: "You've launched!",
        message: JSON.stringify(request.body)
    })
})

module.exports = app