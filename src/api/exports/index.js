const routes = require('./routes')
const ExportsHandler = require('./handler')

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: (server, { exportsService, playlistsService, validator }) => {
    const exportSongsHandler = new ExportsHandler({
      exportsService, playlistsService, validator
    })

    server.route(routes(exportSongsHandler))
  }
}
