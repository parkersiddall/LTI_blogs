require("dotenv").config()

const NODE_ENV = process.env.NODE_ENV
const PORT = process.env.PORT
const KEY = process.env.KEY
const SECRET = process.env.SECRET
const MONGO_URL = process.env.MONGO_URL
const SESSION_SECRET =  process.env.SESSION_SECRET

// LTI roles
const INSTRUCTOR_ROLES = [
  "urn:lti:role:ims/lis/Instructor"
  // add in others here once understood
]

const STUDENT_ROLES = [
  "urn:lti:role:ims/lis/Learner"
  // add in others here once understood
]

module.exports = {
  NODE_ENV,
  PORT,
  KEY,
  SECRET,
  MONGO_URL,
  SESSION_SECRET,
  INSTRUCTOR_ROLES,
  STUDENT_ROLES
}
