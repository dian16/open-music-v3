const InvariantError = require('../../exceptions/InvariantError')
const { SongPayloadSchema } = require('./schema')

const SongsValidator = {
  validateSongPayload: (payload) => {
    const validataResult = SongPayloadSchema.validate(payload)
    if (validataResult.error) {
      throw new InvariantError(validataResult.error.message)
    }
  }
}

module.exports = SongsValidator
