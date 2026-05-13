const pool = require('./pool');

async function getAllGenres() {
  const { rows } = await pool.query('SELECT * FROM genres');
  return rows;
};
async function getGenreById(id) {
  const { rows } = await pool.query(`
    SELECT *, (SELECT COUNT(g.id)
        FROM genres gen
        JOIN games_genres gg ON gen.id = gg.genre_id
        JOIN games g ON g.id = gg.game_id
        WHERE gen.id = $1) AS game_count
      FROM genres
     WHERE id = $1
  `, [id]);
  return rows;
}
async function postGenre(name, description) {
  await pool.query('INSERT INTO genres (name, description) VALUES ($1, $2);', [name, description]);
}
async function getGamesByGenre(id) {
  const { rows } = await pool.query(`
    SELECT g.name,
      g.id,
      gen.name AS genre,
      JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('name', d.name, 'id', d.id)) AS developers FROM games g
        JOIN games_genres gg ON g.id = gg.game_id
        JOIN genres gen ON gen.id = gg.genre_id
        JOIN games_developers gd ON g.id = gd.game_id
        JOIN developers d ON d.id = gd.developer_id
        WHERE gen.id = $1
        GROUP BY g.id, g.name, gen.name;
    `, [id]);
  return rows;
};
async function updateGenre(name, description, id) {
  await pool.query(`
    UPDATE genres
      SET name = $1,
          description = $2
      WHERE id = $3
  `, [name, description, id]);
}

async function deleteGenre(id) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      DELETE FROM games_genres
        WHERE game_id IN (SELECT game_id
          FROM games_genres
          WHERE genre_id = $1) AND genre_id = $1;
    `, [id]);
    await client.query(`DELETE FROM genres WHERE id = $1;`, [id]);

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }  
}

async function getGenreByName(name) {
  const { rows } = await pool.query(`SELECT * FROM genres WHERE name = $1`, [name]);
  return rows;
}

module.exports = {
  getGamesByGenre,
  getAllGenres,
  getGenreById,
  getGenreByName,
  postGenre,
  updateGenre,
  deleteGenre
};