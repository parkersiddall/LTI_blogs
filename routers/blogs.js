const blogsRouter = require("express").Router()
const middleware_auth = require("../utilities/middleware_authentication")
const Blog = require('../models/blog')
const User = require("../models/user")
const Comment = require("../models/comment")

// returns view that displays all blogs created by that user
blogsRouter.get("/",
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
blogsRouter.get("/:id",
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

module.exports = blogsRouter