const apiRouter = require('express').Router()
const middleware_lti = require("../utilities/middleware_lti")
const config = require("../utilities/config")
const samples = require("../utilities/samples")

apiRouter.post("/blog", (request, response) => {
  // collect and save new blogs when send via ajax
})

apiRouter.delete("/blog", (request, response) => {
  // delete blogs when send via ajax
})

module.exports = apiRouter