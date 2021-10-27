const Blog = require("../models/blog")

const isAuthenticated = (request, response, next) => {
  if (!request.session.auth) {
    response.status(403)
    return response.render("error", {
      errorCode: 403,
      errorMessage: "You are not authenticated",
      returnUrl: request.body.launch_presentation_return_url || "",
    })
  }

  next()
}

module.exports = {
  isAuthenticated
}
