const ClientError = require('../../exceptions/ClientError')

class ExportsHandler {
  constructor ({ exportsService, playlistsService, validator }) {
    this._exportsService = exportsService
    this._playlistsService = playlistsService
    this._validator = validator

    this.postExportSongsHandler = this.postExportSongsHandler.bind(this)
  }

  async postExportSongsHandler (request, h) {
    try {
      this._validator.validateExportSongsPayload(request.payload)

      const { playlist: id } = request.params
      const { id: userId } = request.auth.credentials

      await this._playlistsService.verifyPlaylistAccess(id, userId)

      const message = {
        playlistId: id,
        targetEmail: request.payload.targetEmail
      }

      await this._exportsService.sendMessage('export:playlists', JSON.stringify(message))

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses'
      })
      response.code(201)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      response.code(500)
      console.error(error)
      return response
    }
  }
}

module.exports = ExportsHandler
