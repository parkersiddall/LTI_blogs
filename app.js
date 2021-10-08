const express = require('express')
const pug = require('pug')
const morganBody = require('morgan-body')
const middleware_lti = require('./utilities/middleware_lti')
const mongoose = require('mongoose')
const config = require('./utilities/config')

const url = config.MONGO_URL

console.log(`Connecting to database:`, url)
mongoose.connect(url, { useNewUrlParser: true })
  .then(result => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log(error)
  })

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

app.post('/lti', middleware_lti.validate_lti_launch, (request, response) => {
    response.render('lti_launch', {
        title: "You've launched!",
        message: JSON.stringify(request.body)
    })
})

module.exports = app