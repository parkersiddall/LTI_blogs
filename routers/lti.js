const ltiRouter = require('express').Router()
const middleware_lti = require("../utilities/middleware_lti")
const config = require("../utilities/config")
const samples = require("../utilities/samples")

ltiRouter.post(
  "/",
  middleware_lti.confirm_launch_request,
  middleware_lti.check_app_parameters,
  middleware_lti.validate_lti_launch,
  middleware_lti.establish_session,
  (request, response) => {

    // TODO: This endpoint will be used to handle ALL LTI launched. Redirecting to GET endpoints will then be done
    // base on roles and lti messages. The GET enpoints will then display the user with the views.

    // render view based on user role
    if (config.INSTRUCTOR_ROLES.includes(request.session.auth.roles)) {
      response.render("blogs", {
        session: request.session.auth,
        blogs: samples.blogs
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

// handles lti launch to view a blog after deep link clicked
ltiRouter.post("/blog/:id", 
middleware_lti.confirm_launch_request,
middleware_lti.check_app_parameters,
middleware_lti.validate_lti_launch,
middleware_lti.establish_session,
(request, response) => {
  const blog = samples.blogs.find(x => x.id === request.params.id)
  response.render("blog", {
    blog: blog,
    comments: samples.comments  //TODO: to replace once implemented
  })
})

module.exports = ltiRouter