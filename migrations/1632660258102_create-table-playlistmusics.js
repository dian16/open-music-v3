/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('playlistmusics', {
    id: {
      type: 'VARCHAR(60)',
      primaryKey: true
    },
    playlist_id: {
      type: 'TEXT',
      notNull: true
    },
    music_id: {
      type: 'TEXT',
      notNull: true
    }
  })

  pgm.addConstraint('playlistmusics', 'unique_playlist_id_and_music_id', 'UNIQUE(playlist_id, music_id)')
  pgm.addConstraint('playlistmusics', 'fk_playlistmusics.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE')
  pgm.addConstraint('playlistmusics', 'fk_playlistmusics.music_id_musics.id', 'FOREIGN KEY(music_id) REFERENCES musics(id) ON DELETE CASCADE')
}

exports.down = pgm => {
  pgm.dropTable('playlistmusics')
}
