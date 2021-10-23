const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
  dateCreated: {
    type: Date
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  views: {
    type: Number
  },
  comments: {
    type: Number
  }
})

blogSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const User = mongoose.model("Blog", blogSchema)

module.exports = User
