const app = require('./app')
const http = require('http')
const config = require('./utilities/config')

const server = http.createServer(app)
console.log(`Environment: ${config.NODE_ENV}`)

server.listen(config.PORT, () => {
    console.log(`Server listening on port ${config.PORT}...`)
})
