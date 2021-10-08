/*
This middleware handles the process of checking an LTI launch request,
making sure it is valid, checking for required parameters, establishing a user session,
and redirecting the user.

https://www.imsglobal.org/learning-tools-interoperability-verifying-launch-messages
*/

const config = require("./config")
const lti = require("ims-lti")

// check required LTI parameters
const confirm_launch_request = (request, response, next) => {
  if (request.body.lti_message_type !== "basic-lti-launch-request") {
    response.status(400).send({ error: "Error with lti_message_type" })
  }
  if (request.body.lti_version !== "LTI-1p0") {
    response.status(400).send({ error: "Error with lti_version" })
  }
  if (!request.body.oauth_consumer_key) {
    response.status(400).send({ error: "Error with oauth_consumer_key" })
  }
  if (!request.body.resource_link_id) {
    response.status(400).send({ error: "Error with resource_link_id" })
  }

  next()
}

// validate LTI request
const validate_lti_launch = (request, response, next) => {
  // get credentials
  const consumer_key = config.KEY
  const consumer_secret = config.SECRET

  // initiate provider and validate
  ltiProvider = new lti.Provider(consumer_key, consumer_secret)
  ltiProvider.valid_request(request, (err, isValid) => {
    console.log(err, isValid)
    if (err) {
      response.status(400).send({ error: err })
    } else if (!isValid) {
      response.status(400).send({ error: "LTI request is not valid." })
    }
  })

  next()
}

// check that application-specific parameters are present
const check_app_parameters = (request, response, next) => {
  // the following are needed for general functionality
  if (!request.body.roles) {
    response.status(400).send({ error: "Error with roles" })
  }
  if (!request.body.lis_person_contact_email_primary) {
    response.status(400).send({ error: "Error with user email" })
  }
  if (!request.body.context_id) {
    response.status(400).send({ error: "Error with context_id" })
  }
  if (!request.body.context_label) {
    response.status(400).send({ error: "Error with context_label" })
  }

  next()
}

// establish a user session
const establish_session = (request, response, next) => {
  // cancel any previous cookies from this site
  // check if user already esists
  // initialize login session with use id or email, role, resource ID, return url

  next()
}

module.exports = {
  confirm_launch_request,
  validate_lti_launch,
  check_app_parameters,
  establish_session,
}
