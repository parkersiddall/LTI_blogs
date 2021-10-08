require('dotenv').config()

const NODE_ENV = process.env.NODE_ENV
const PORT = process.env.PORT
const KEY = process.env.KEY
const SECRET = process.env.SECRET

module.exports = {
    NODE_ENV,
    PORT,
    KEY,
    SECRET
}