const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class MusicService {
  constructor () {
    this._music = []
  }

  addSong ({ title, year, performer, genre, duration }) {
    const id = nanoid(16)
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

    const newMusic = {
      id, title, year: +year, performer, genre, duration: +duration, insertedAt, updatedAt
    }

    this._music.push(newMusic)

    const isSuccess = this._music.filter((music) => music.id === id).length > 0

    if (!isSuccess) {
      throw new InvariantError('Lagu gagal ditambahkan')
    }
    return id
  }

  getSongs () {
    return this._music.map(({ id, title, performer }) => ({ id, title, performer }))
  }

  getSongById (songId) {
    const getMusic = this._music.filter((music) => music.id === songId)[0]

    if (!getMusic) {
      throw new NotFoundError('Lagu tidak ditemukan')
    }
    return getMusic
  }

  editSongById (songId, { title, year, performer, genre, duration }) {
    const editMusic = this._music.findIndex((music) => music.id === songId)
    if (editMusic === -1) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan')
    }

    const updatedAt = new Date().toISOString()

    this._music[editMusic] = {
      ...this._music[editMusic],
      title,
      year,
      performer,
      genre,
      duration,
      updatedAt
    }
  }

  deleteSongById (songId) {
    const index = this._music.findIndex((music) => music.id === songId)

    if (index === -1) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan')
    }
    this._music.splice(index, 1)
  }
}

module.exports = MusicService
