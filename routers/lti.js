const ltiRouter = require('express').Router()
const middleware_lti = require("../utilities/middleware_lti")
const config = require("../utilities/config")

ltiRouter.post(
  "/",
  middleware_lti.validate_lti_launch,
  middleware_lti.establish_session,
  (request, response) => {

    // render view based on user role
    if (config.INSTRUCTOR_ROLES.includes(request.session.auth.roles)) {
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

module.exports = ltiRouter