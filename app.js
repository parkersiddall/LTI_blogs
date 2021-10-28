const express = require("express")
const morganBody = require("morgan-body")
const mongoose = require("mongoose")
const config = require("./utilities/config")
const session = require('express-session')
const ltiRouter = require("./routers/lti")
const apiRouter = require("./routers/api")
const blogsRouter = require("./routers/blogs")

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
app.use("/static", express.static("public"))

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

// routes & routers
app.get("/", (request, response) => {
  response.send("<h1>Hello World, this is LTI 1.1</h1>")
})
app.use("/lti", ltiRouter)
app.use("/api", apiRouter)
app.use("/blogs", blogsRouter)

module.exports = app
