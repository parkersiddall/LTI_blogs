const apiRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const Comment = require("../models/comment")

apiRouter.post("/blog", async (request, response) => {
  // collect and save new blogs when send via ajax
  try {
    const newBlog = new Blog({
      dateCreated: new Date(),
      creator: request.session.user.id,
      title: request.body.title,
      content: request.body.content,
      views: 0,
      comments: 0,
    })

    let savedBlog = await newBlog.save()
    const responseData = {
      blog: savedBlog,
      ltiMessageType: request.session.auth.lti_message_type,
    }
    response.json(responseData)
  } catch (error) {
    response.status(500)
    response.json({ error })
  }
})

apiRouter.delete("/blog/:id", async (request, response) => {
  // delete blogs when send via ajax
  try {
    const blog = await Blog.findById(request.params.id)
    const creator = await User.findOne({
      username: request.session.auth.lis_person_contact_email_primary,
      university: request.session.auth.oauth_consumer_key,
    })
    console.log(blog, creator)
    if (blog.creator._id.toString() != creator._id.toString()) {
      response.status(404)
      response.json({ Unauthorized: "You are not the creator of this blog." })
      response.end()
    }
    const result = await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    response.status(500)
    response.json({ error: error.message })
  }
})

apiRouter.post("/comment/:id", async (request, response) => {
  // collect and save new comments when send via ajax
  try {
    const blog = await Blog.findById(request.params.id)
    const creator = await User.findOne({
      username: request.session.auth.lis_person_contact_email_primary,
      university: request.session.auth.oauth_consumer_key,
    })

    const newComment = new Comment({
      creator: creator,
      blog: blog,
      comment: request.body.comment,
    })

    const result = await newComment.save()
    response.json(result)
  } catch (error) {
    response.status(500)
    response.json({ error: error.message })
  }
})

module.exports = apiRouter
