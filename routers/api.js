const apiRouter = require('express').Router()
const config = require("../utilities/config")
const samples = require("../utilities/samples")
const Blog = require('../models/blog')

apiRouter.post("/blog", async (request, response) => {
  // collect and save new blogs when send via ajax
  console.log("user: ", request.session.user)
  try {
    const newBlog = new Blog({
      dateCreated: new Date(),
      creator: request.session.user.id,
      title: request.body.title,
      content: request.body.content,
      views: 0,
      comments: 0
    })

    let savedBlog = await newBlog.save()
    const responseData = {
      blog: savedBlog,
      ltiMessageType: request.session.auth.lti_message_type
    }
    response.json(responseData)

  } catch (error) {
    response.status(500)
    response.json({error})
  }
})

apiRouter.delete("/blog", (request, response) => {
  // delete blogs when send via ajax
})

apiRouter.post("/comment", (request, response) => {
  // collect and save new comments when send via ajax
})

module.exports = apiRouter