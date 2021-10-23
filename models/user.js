const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  university: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true
  }
})

userSchema.plugin(uniqueValidator)

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const User = mongoose.model("User", userSchema)

module.exports = User
