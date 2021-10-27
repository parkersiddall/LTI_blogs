const express = require("express")
const morganBody = require("morgan-body")
const mongoose = require("mongoose")
const config = require("./utilities/config")
const session = require('express-session')
const ltiRouter = require("./routers/lti")
const apiRouter = require("./routers/api")
const middleware_lti = require("./utilities/middleware_lti")
const middleware_auth = require("./utilities/middleware_authentication")
const uuid = require("uuid")
const oauthSignature = require("oauth-signature")
const Blog = require('./models/blog')
const User = require("./models/user")
const Comment = require("./models/comment")

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

app.post("/CIMrequest",
  middleware_lti.confirm_launch_request,
  middleware_lti.check_app_parameters,
  middleware_lti.validate_lti_launch,
  middleware_lti.establish_session,
  (request, response) => {
    response.redirect(301, "/blogs")
})

app.get("/CIMRequestConfirmation/:id",
  middleware_auth.isAuthenticated,
  async (request, response) => {
    // checks should be done to ensure that it is the blog creator making the request
    // or use roles to check that it is not a student
    try {
      const blog = await Blog.findById(request.params.id)
      const creator = await User.findOne({
        username: request.session.auth.lis_person_contact_email_primary,
        university: request.session.auth.oauth_consumer_key,
      })
      if (blog.creator._id.toString() != creator._id.toString()) {
        return response.render("error", {
          errorCode: 403,
          errorMessage: "You are not the creator of this blog",
          returnUrl: request.body.launch_presentation_return_url || "",
        })
      }
  
      // construct content_items
      const content_item = {
        "@context" : "http://purl.imsglobal.org/ctx/lti/v1/ContentItem",
        "@graph" : [
          { "@type" : "LtiLinkItem",
            "url" : `http://localhost/lti/blogs/${blog.id}`,
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
    } catch (e) {
      return response.render("error", {
        errorCode: e.status,
        errorMessage: e.message,
        returnUrl: request.body.launch_presentation_return_url || "",
      })
    }
})

app.get("/blogs",
  middleware_auth.isAuthenticated,
   async (request, response) => {
  try {
    const user =  await User.findOne(request.session.user)
    const blogs = await Blog.find({creator: user})

    response.render("blogs", {
      session: request.session.auth,
      blogs: blogs
    })
  } catch (e) {
    return response.render("error", {
      errorCode: 404,
      errorMessage: e.message,
      returnUrl: request.body.launch_presentation_return_url,
    })
  }
})
// returns blog view without LTI launch checks
app.get("/blogs/:id",
middleware_auth.isAuthenticated,
async (request, response) => {
  try {
    const blog =  await Blog.findById(request.params.id)
    blog.creator = await User.findById(blog.creator)
    const comments = await Comment.find({blog: blog}).populate("creator")
    response.render("blog", {
      blog: blog,
      comments: comments
    })
  } catch (error) {
    console.log(error)
    return response.render("error", {
      errorCode: 404,
      errorMessage: "Blog not found.",
      returnUrl: request.body.launch_presentation_return_url,
    })
  }
})

module.exports = app
