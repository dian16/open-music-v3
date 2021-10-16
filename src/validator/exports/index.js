const ExportSongsPayloadSchema = require('./schema')
const InvariantError = require('../../exceptions/InvariantError')

const ExportsValidator = {
  validateExportSongsPlayload: (payload) => {
    const validationResult = ExportSongsPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = ExportsValidator
