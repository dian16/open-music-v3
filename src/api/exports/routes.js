const routes = (handler) => [
  {
    method: 'POST',
    path: '/exports/playlist/{playlistId}',
    handler: handler.postExportSongsHandler,
    options: {
      auth: 'musicsapp_jwt'
    }
  }
]

module.exports = routes
