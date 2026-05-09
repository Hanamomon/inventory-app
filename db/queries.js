const pool = require('./pool');

async function getAllGames() {
  const { rows } = await pool.query('SELECT * FROM games');
  return rows;
};


async function getAllGenres() {
  const { rows } = await pool.query('SELECT * FROM genres');
  return rows;
};
async function getGamesByGenre(genre) {
  const { rows } = await pool.query('SELECT games.name FROM games JOIN games_genres ON games.id = games_genres.game_id JOIN genres ON genres.id = games_genres.genre_id WHERE genres.name = $1', [genre]);
  return rows;
};


async function getAllDevelopers() {
  const { rows } = await pool.query('SELECT * FROM developers');
  return rows;
};
async function getGamesByDeveloper(developer) {
  const { rows } = await pool.query('SELECT games.name FROM games JOIN games_developers ON games.id = games_developers.game_id JOIN developers ON developers.id = games_developers.developer_id WHERE developers.name = $1', [developer]);
  return rows;
};

module.exports = {
  getAllGames,
  getGamesByGenre,
  getGamesByDeveloper,
  getAllGenres,
  getAllDevelopers
};