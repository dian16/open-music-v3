const redis = require('redis')
const InvariantError = require('../exceptions/InvariantError')

class CacheService {
  constructor () {
    this._client = redis.createClient({
      host: process.env.REDIS_SERVER
    })
    this._client.on('error', (error) => {
      throw new InvariantError(error)
    })
  }

  set (key, value, expirationInSecond = 900) {
    return new Promise((resolve, reject) => {
      this._client.set(key, value, 'EX', expirationInSecond, (error, ok) => {
        if (error) {
          return reject(error)
        }
        return resolve(ok)
      })
    })
  }

  get (key) {
    return new Promise((resolve, reject) => {
      this._client.get(key, (error, reply) => {
        if (error) {
          return reject(error)
        } else if (reply === null) {
          return reject(reply)
        }

        return resolve(reply)
      })
    })
  }

  delete (key) {
    return new Promise((resolve, reject) => {
      this._client.del(key, (error, count) => {
        if (error) {
          return reject(error)
        }

        return resolve(count)
      })
    })
  }
}

module.exports = CacheService
