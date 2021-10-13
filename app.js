const express = require("express")
const pug = require("pug")
const morganBody = require("morgan-body")
const middleware_lti = require("./utilities/middleware_lti")
const mongoose = require("mongoose")
const config = require("./utilities/config")
const session = require('express-session')

const url = config.MONGO_URL

console.log(`Connecting to database:`, url)
mongoose
  .connect(url, { useNewUrlParser: true })
  .then((result) => {
    console.log("Connected to MongoDB")
  })
  .catch((error) => {
    console.log(error)
  })

// initiate and configure app
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.set("views", "./views")
app.set("view engine", "pug")

// middleware
morganBody(app)
app.use(session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  // store: config.NODE_ENV == "production" ? sessionStore : MemoryStore,
  cookie: { 
    maxAge: 60 * 60 * 1000  // minutes , seconds, milleseconds (1 hour)
  }
}))

// routes
app.get("/", (request, response) => {
  response.send("<h1>Hello World, this is LTI 1.1</h1>")
})

app.post(
  "/lti",
  middleware_lti.validate_lti_launch,
  middleware_lti.establish_session,
  (request, response) => {

    // render view based on user role
    if (config.INSTRUCTOR_ROLES.includes(request.session.roles)) {
      response.render("lti_launch", {
        title: "You've launched!",
        message: request.body,
        returnUrl: request.body.launch_presentation_return_url
      })
    } else {
      response.render("error", {
        errorCode: 403,
        errorMessage: "Your role is not authorized to see this page.",
        returnUrl: request.body.launch_presentation_return_url
      })
    }
  }
)

// test endpoint for developing pug templates
app.get(
  "/test", (request, response) => {
    response.render("test", {
      title: "You've launched!",
      message: request.body,
      returnUrl: request.body.launch_presentation_return_url
    })
  }
)

module.exports = app
