const ltiRouter = require('express').Router()
const middleware_lti = require("../utilities/middleware_lti")
const middleware_auth = require("../utilities/middleware_authentication")
const config = require("../utilities/config")
const Blog = require("../models/blog")
const User = require("../models/user")
const Comment = require("../models/comment")
const uuid = require("uuid")
const oauthSignature = require("oauth-signature")

ltiRouter.post(
  "/",
  middleware_lti.confirm_launch_request,
  middleware_lti.check_app_parameters,
  middleware_lti.validate_lti_launch,
  middleware_lti.establish_session,
  (request, response) => {
    if (config.INSTRUCTOR_ROLES.includes(request.session.auth.roles)) {
      response.redirect(301, "/blogs")
    } else {
      response.render("error", {
        errorCode: 403,
        errorMessage: "Your role is not authorized to see this page.",
        returnUrl: request.body.launch_presentation_return_url
      })
    }
  }
)

// handles lti launch to view a blog after deep link clicked
ltiRouter.post("/blogs/:id", 
middleware_lti.confirm_launch_request,
middleware_lti.check_app_parameters,
middleware_lti.validate_lti_launch,
middleware_lti.establish_session,
async (request, response) => {
  try {
    const blog =  await Blog.findById(request.params.id)
    blog.creator = await User.findById(blog.creator)
    const comments = await Comment.find({blog: blog}).populate("creator")

    blog.views = blog.views + 1
    blog.save()

    response.render("blog", {
      blog: blog,
      comments: comments
    })
  } catch (e) {
    return response.render("error", {
      errorCode: e.code,
      errorMessage: e.message,
      returnUrl: request.body.launch_presentation_return_url,
    })
  }
})

// after deep link content is selected, this route prepares the response to LMS
ltiRouter.get("/CIMRequestConfirmation/:id",
  middleware_auth.isAuthenticated,
  async (request, response) => {
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

module.exports = ltiRouter