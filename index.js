require('./src/robloxClient')
const server = require('express')()
const bodyParser = require('body-parser')

require('mongoose').connect(`${process.env.MONGO_DB}Roblox`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
})
server
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .disable('etag')
  .disable('x-powered-by')
  .use('/data', require('./src/routes/data'))
  .use('/action', require('./src/routes/action'))
  .use((req, res) => res.json({ status: 'OK' }))
  .listen(3000, () => {
    console.log('HTTP Server is ready!')
  })

process.on('uncaughtException', (err) => console.log(err))
process.on('unhandledRejection', (err) => console.log(err))
console.clear()
