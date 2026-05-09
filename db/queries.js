const pool = require('./pool');

async function getAllGames() {
  const { rows } = await pool.query(`
    SELECT g.name,
      g.id,
      JSON_AGG(DISTINCT gen.name ORDER BY gen.name) AS genres,
      JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('name', d.name, 'id', d.id)) AS developers FROM games g
        JOIN games_genres gg ON g.id = gg.game_id
        JOIN genres gen ON gen.id = gg.genre_id
        JOIN games_developers gd ON g.id = gd.game_id
        JOIN developers d ON d.id = gd.developer_id
        GROUP BY g.id, g.name;
  `);
  return rows;
};

async function getGameById(id) {
  const { rows } = await pool.query(`
    SELECT g.name,
      g.id,
      g.description,
      JSON_AGG(DISTINCT gen.name ORDER BY gen.name) AS genres,
      JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('name', d.name, 'id', d.id)) AS developers FROM games g
        JOIN games_genres gg ON g.id = gg.game_id
        JOIN genres gen ON gen.id = gg.genre_id
        JOIN games_developers gd ON g.id = gd.game_id
        JOIN developers d ON d.id = gd.developer_id
        WHERE g.id = $1
        GROUP BY g.id, g.name;
  `, [id]);
  return rows;
}

async function getAllGenres() {
  const { rows } = await pool.query('SELECT * FROM genres');
  return rows;
};
async function getGamesByGenre(genre) {
  const { rows } = await pool.query(`
    SELECT g.name,
      g.id,
      JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('name', d.name, 'id', d.id)) AS developers FROM games g
        JOIN games_genres gg ON g.id = gg.game_id
        JOIN genres gen ON gen.id = gg.genre_id
        JOIN games_developers gd ON g.id = gd.game_id
        JOIN developers d ON d.id = gd.developer_id
        WHERE gen.name = $1
        GROUP BY g.id, g.name;
    `, [genre]);
  return rows;
};


async function getAllDevelopers() {
  const { rows } = await pool.query('SELECT * FROM developers');
  return rows;
};
async function getDeveloperById(id) {
  const { rows } = await pool.query(`
    SELECT *,
      (SELECT COUNT(g.id)
        FROM developers d
        JOIN games_developers gd ON d.id = gd.developer_id
        JOIN games g ON g.id = gd.game_id
        WHERE d.id = $1) AS developed_count
      FROM developers d
      WHERE d.id = $1;
  `, [id]);
  return rows;
}
async function getGamesByDeveloper(id) {
  const { rows } = await pool.query(`
    SELECT g.name,
      g.id,
      d.name AS developer,
      JSON_AGG(DISTINCT gen.name ORDER BY gen.name) AS genres FROM games g
        JOIN games_developers gd ON g.id = gd.game_id
        JOIN developers d ON d.id = gd.developer_id
        JOIN games_genres gg ON g.id = gg.game_id
        JOIN genres gen ON gen.id = gg.genre_id
        WHERE d.id = $1
        GROUP BY g.id, g.name, d.name;
    `, [id]);
  return rows;
};

module.exports = {
  getAllGames,
  getGameById,
  getGamesByGenre,
  getGamesByDeveloper,
  getAllGenres,
  getAllDevelopers,
  getDeveloperById
};