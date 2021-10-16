const { nanoid } = require('nanoid')
const { Pool } = require('pg')

const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const AuthorizationError = require('../../exceptions/AuthorizationError')

class PlaylistsService {
  constructor (collaborationsService, cacheService) {
    this._pool = new Pool()
    this._collaborationsService = collaborationsService
    this._cacheService = cacheService
  }

  async addPlaylist (nameSong, owner) {
    const id = `playlist-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id',
      values: [id, nameSong, owner]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan')
    }

    await this._cacheService.delete(`playlists:${owner}`)
    return result.rows[0].id
  }

  async getPlaylists (owner) {
    try {
      const result = await this._cacheService.get(`playlists:${owner}`)
      return JSON.parse(result)
    } catch {
      const query = {
        text: `SELECT playlists.id, playlists.name, users.username
                    FROM playlists
                    LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
                    INNER JOIN users ON playlists.owner = users.id
                    WHERE playlists.owner = $1 OR collaborations.user_id = $1
                    GROUP BY playlists.id, users.id`,
        values: [owner]
      }

      const result = await this._pool.query(query)
      const parseToJSON = JSON.stringify(result.rows)

      await this._cacheService.set(`playlists:${owner}`, parseToJSON, (60 * 30))

      return result.rows
    }
  }

  async deletePlaylistById (id, owner) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus playlist, Id tidak ditemukan')
    }
    await this._cacheService.delete(`playlists:${owner}`)
  }

  async verifyPlaylistOwner (id, owner) {
    const query = {
      text: 'SELECT id, owner FROM playlists WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }

    const playlist = result.rows[0]

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak mempunyai akses atas resource ini.')
    }
  }

  async addSongToPlaylist (playlistId, songId) {
    const id = `ps-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO playlistmusics VALUES ($1, $2, $3)',
      values: [id, playlistId, songId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan lagu ke playlist')
    }
    await this._cacheService.delete(`songs:${playlistId}`)
  }

  async getSongsInPlaylist (playlistId) {
    const query = {
      text: `SELECT musics.id, musics.title, musics.performer FROM musics
                    LEFT JOIN playlistmusics ON musics.id = playlistmusics.music_id
                    WHERE playlistmusics.playlist_id = $1
                    GROUP BY musics.id`,
      values: [playlistId]
    }

    const result = await this._pool.query(query)
    const parseToJSON = JSON.stringify(result.rows)

    await this._cacheService.set(`songs:${playlistId}`, parseToJSON, (60 * 30))

    return result.rows
  }

  async deleteSongFromPlaylistById (playlistId) {
    const query = {
      text: 'DELETE FROM playlistmusics WHERE playlist_id = $1',
      values: [playlistId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Gagal menghapus lagu dari playlist. Id tidak ditemukan')
    }
    await this._cacheService.delete(`songs:${playlistId}`)
  }

  async verifyPlaylistAccess (playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }

      try {
        await this._collaborationsService.verifyCollaborator(playlistId, userId)
      } catch {
        throw error
      }
    }
  }
}

module.exports = PlaylistsService
