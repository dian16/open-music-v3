require('dotenv').config()

// const MusicService = require("./services/inMemory/MusicService")
const MusicService = require('./services/postgres/MusicService')
const Hapi = require('@hapi/hapi')
const songs = require('./api/songs')
const SongsValidator = require('./validator/songs')

const init = async () => {
  const musicService = new MusicService()
  const server = Hapi.server({
    // port: 5000,
    // host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register({
    plugin: songs,
    options: {
      service: musicService,
      validator: SongsValidator
    }
  })

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
