const UploadsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'Uploads File',
  version: '1.0.0',
  register: (server, { service, validator }) => {
    const uploadImagesHandler = new UploadsHandler(service, validator)

    server.route(routes(uploadImagesHandler))
  }
}
