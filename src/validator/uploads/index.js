const InvariantError = require('../../exceptions/InvariantError')
const { UploadHeadersSchema } = require('./schema')

const UploadsValidator = {
  validateUploadHeaders: (headers) => {
    const validationResult = UploadHeadersSchema.validate(headers)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = UploadsValidator
