const express = require("express")
const pug = require("pug")
const morganBody = require("morgan-body")
const mongoose = require("mongoose")
const config = require("./utilities/config")
const session = require('express-session')
const ltiRouter = require("./routers/lti")
const samples = require("./utilities/samples")  // resources for testing without db
const { request } = require("express")
const middleware_lti = require("./utilities/middleware_lti")
const uuid = require("uuid")
const oauthSignature = require("oauth-signature")
const replaceall = require("replaceall")

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

// routes & routers
app.get("/", (request, response) => {
  response.send("<h1>Hello World, this is LTI 1.1</h1>")
})

app.use("/lti", ltiRouter)

app.post("/CIMrequest",
  middleware_lti.confirm_launch_request,
  middleware_lti.check_app_parameters,
  middleware_lti.validate_lti_launch,
  middleware_lti.establish_session,
  (request, response) => {
    response.render("blogs", {
      session: request.session.auth,
      blogs: samples.blogs
    })
})

// TODO: add authentication middleware to this route
app.get("/CIMRequestConfirmation/:id",
  (request, response) => {

    // pull out id from post
    const blog = samples.blogs.find(x => x.id === request.params.id)

    // construct content_items
    const content_item = {
      "@context" : "http://purl.imsglobal.org/ctx/lti/v1/ContentItem",
      "@graph" : [
        { "@type" : "LtiLinkItem",
          "url" : `http://localhost/lti/blog/${blog.id}`,
          "mediaType" : "application/vnd.ims.lti.v1.ltilink",
          "title" : blog.title,
          "text" : "Click this link to view the blog and comments.",
        }
      ]
    }

    var content_item_string = JSON.stringify(content_item)
    //var content_item_string = replaceall("\"", "&quot;", content_item_string)
    //var content_item_string = replaceall("\'", "&#39;", content_item_string)

    // construct params
    var params = {}
    params.lti_message_type = "ContentItemSelection"
    params.lti_version = "LTI-1p0"
    params.content_items = content_item_string
    params.data = request.session.auth.data
    params.oauth_version = "1.0"
    params.oauth_nonce = uuid.v1()
    params.oauth_timestamp = Math.floor(Date.now() / 1000)
    params.oauth_consumer_key = config.KEY
    params.oauth_callback = "about:blank"
    params.oauth_signature_method = "HMAC-SHA1"

    // make signature, add it to params
    const httpMethod = "POST"
    const url = request.session.auth.content_item_return_url
    const secret = config.SECRET
    token = null
    const signature = oauthSignature.generate(httpMethod, url, params, secret, token, 
      { encodeSignature: false});
    params.oauth_signature = signature

    response.render("cimrequestconfirm", {
      url: url,
      params: params
    })
})

// returns blog view without LTI launch checks
// TODO: add session authentication middleware
app.get("/blog/:id", (request, response) => {
  const blog = samples.blogs.find(x => x.id === request.params.id)
  response.render("blog", {
    blog: blog
  })
})

// test endpoint for developing pug templates
app.get(
  "/test", (request, response) => {
    response.render("blogs", {
      session: samples.session_auth,
      blogs: samples.blogs
    })
  }
)

module.exports = app
