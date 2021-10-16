const { Pool } = require('pg')

class PlaylistsService {
  constructor (cacheService) {
    this._pool = new Pool()
    this._cacheService = cacheService
  }

  async getPlaylists (playlistId) {
    try {
      const result = await this._cacheService.get(`playlist:${playlistId}`)
      return JSON.parse(result)
    } catch {
      const query = {
        text: `
                    SELECT musics.title, musics.year, musics.performer, musics.genre, musics.duration FROM musics
                    LEFT JOIN playlistmusics ON musics.id = playlistmusics.music_id
                    WHERE playlistmusics.playlist_id = $1
                `,
        values: [playlistId]
      }

      const result = await this._pool.query(query)
      const parseToJSON = JSON.stringify(result.rows)

      await this._cacheService.set(`playlist:${playlistId}`, parseToJSON)

      return result.rows
    }
  }
}

module.exports = PlaylistsService
