/*
This middleware handles the process of checking an LTI launch request,
making sure it is valid, checking for required parameters, establishing a user session,
and redirecting the user.

https://www.imsglobal.org/learning-tools-interoperability-verifying-launch-messages
*/

const config = require("./config")
const lti = require("ims-lti")
const User = require("../models/user")

// check required LTI parameters
const confirm_launch_request = (request, response, next) => {
  if (request.body.lti_message_type !== "basic-lti-launch-request") {
    response.status(400)
    return response.render("error", {
      errorCode: 400,
      errorMessage: "Invalid LTI launch parameters.",
      returnUrl: request.body.launch_presentation_return_url,
    })
  }
  if (request.body.lti_version !== "LTI-1p0") {
    response.status(400)
    return response.render("error", {
      errorCode: 400,
      errorMessage: "Invalid LTI launch parameters.",
      returnUrl: request.body.launch_presentation_return_url,
    })
  }
  if (!request.body.oauth_consumer_key) {
    response.status(400)
    return response.render("error", {
      errorCode: 400,
      errorMessage: "Invalid LTI launch parameters.",
      returnUrl: request.body.launch_presentation_return_url,
    })
  }
  if (!request.body.resource_link_id) {
    response.status(400)
    return response.render("error", {
      errorCode: 400,
      errorMessage: "Invalid LTI launch parameters.",
      returnUrl: request.body.launch_presentation_return_url,
    })
  }

  next()
}

// validate LTI request
const validate_lti_launch = (request, response, next) => {
  const consumer_key = config.KEY
  const consumer_secret = config.SECRET

  // initiate provider and validate
  ltiProvider = new lti.Provider(consumer_key, consumer_secret)
  ltiProvider.valid_request(request, (err, isValid) => {
    if (err) {
      response.status(400)
      return response.render("error", {
        errorCode: 400,
        errorMessage: "LTI launch is not valid.",
        returnUrl: request.body.launch_presentation_return_url,
      })
    } else if (!isValid) {
      response.status(400)
      return response.render("error", {
        errorCode: 400,
        errorMessage: "LTI launch is not valid.",
        returnUrl: request.body.launch_presentation_return_url,
      })
    }
  })

  next()
}

// check that application-specific parameters are needed for 
// general functionality of this app
const check_app_parameters = (request, response, next) => {
  if (!request.body.roles) {
    response.status(400)
    return response.render("error", {
      errorCode: 400,
      errorMessage: "LTI launch is not valid. Roles are missing.",
      returnUrl: request.body.launch_presentation_return_url,
    })
  }
  if (!request.body.lis_person_contact_email_primary) {
    response.status(400)
    return response.render("error", {
      errorCode: 400,
      errorMessage: "LTI launch is not valid. Email is missing.",
      returnUrl: request.body.launch_presentation_return_url,
    })
  }
  if (!request.body.context_id) {
    response.status(400)
    return response.render("error", {
      errorCode: 400,
      errorMessage: "LTI launch is not valid. Context ID is missing.",
      returnUrl: request.body.launch_presentation_return_url,
    })
  }
  if (!request.body.context_label) {
    return response.render("error", {
      errorCode: 400,
      errorMessage: "LTI launch is not valid. Context label is missing.",
      returnUrl: request.body.launch_presentation_return_url,
    })
  }

  next()
}

// establish a user session
const establish_session = async (request, response, next) => {
  // check any previous auth data from this site, clear it
  // this is necessary because users have different levels of authorization
  // depending on their role in the class where the launch initiated
  if (request.session.auth) {
    request.session.auth = null
  }

  // check if user already esists, otherwise create user
  const userEmail = request.body.lis_person_contact_email_primary
  try {
    const user = await User.findOne({ username: userEmail })
    if (!user) {
      const newUser = new User({
        username: userEmail,
        university: request.body.oauth_consumer_key,
      })
      const savedUser = await newUser.save()
    }

    // copy launch data to session
    request.session.auth = request.body
    
  } catch (error) {
    console.log(error)
    response.status(500)
    return response.render("error", {
      errorCode: 500,
      errorMessage: "Internal server error.",
      returnUrl: request.body.launch_presentation_return_url,
    })
  }

  next()
}

module.exports = {
  confirm_launch_request,
  validate_lti_launch,
  check_app_parameters,
  establish_session,
}
