const amqp = require('amqplib')
const PlaylistsService = require('./src/PlaylistsService')
const MailSender = require('./src/MailSender')
const Listener = require('./src/Listener')
const CacheService = require('./src/cache/CacheService')

const init = async () => {
  const cacheService = new CacheService()
  const playlistsService = new PlaylistsService(cacheService)
  const mailSender = new MailSender()
  const listener = new Listener(playlistsService, mailSender)

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER)
  const channel = await connection.createChannel()

  await channel.assertQueue('export:playlists', {
    durable: true
  })

  channel.consume('export:playlists', listener.eventListener, { noAck: true })
}

init()
