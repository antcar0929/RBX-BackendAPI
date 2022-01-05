import './src/robloxClient.js'
import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import dataRoute from './src/routes/data.js'
import actionRoute from './src/routes/action.js'
const server = express()

mongoose.connect(`${process.env.MONGO_DB}Roblox`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
})

server
  .set('port', process.env.PORT || 3000)
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .disable('etag')
  .disable('x-powered-by')
  .use('/data', dataRoute)
  .use('/action', actionRoute)
  .use((req, res) => res.json({ status: 'OK' }))
  .listen(server.get('port'), () => console.log('HTTP Server is ready!'))

process.on('uncaughtException', (err) => console.log(err))
process.on('unhandledRejection', (err) => console.log(err))
