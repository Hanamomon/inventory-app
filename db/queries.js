const pool = require('./pool');

async function getAllGames() {
  const { rows } = await pool.query('SELECT games.name, games.id AS id, genres.name AS genre, developers.name AS developer, developers.id AS dev_id FROM games JOIN games_genres ON games.id = games_genres.game_id JOIN genres ON genres.id = games_genres.genre_id JOIN games_developers ON games.id = games_developers.game_id JOIN developers ON developers.id = games_developers.developer_id');
  return rows;
};

async function getGameById(id) {
  const { rows } = await pool.query('SELECT games.name, games.id AS id, games.description, genres.name AS genre, developers.name AS developer, developers.id AS dev_id FROM games JOIN games_genres ON games.id = games_genres.game_id JOIN genres ON genres.id = games_genres.genre_id JOIN games_developers ON games.id = games_developers.game_id JOIN developers ON developers.id = games_developers.developer_id WHERE games.id = $1', [id]);
  return rows;
}

async function getAllGenres() {
  const { rows } = await pool.query('SELECT * FROM genres');
  return rows;
};
async function getGamesByGenre(genre) {
  const { rows } = await pool.query('SELECT games.name, games.id AS id, developers.name AS developer, developers.id AS dev_id FROM games JOIN games_genres ON games.id = games_genres.game_id JOIN genres ON genres.id = games_genres.genre_id JOIN games_developers ON games.id = games_developers.game_id JOIN developers ON developers.id = games_developers.developer_id WHERE genres.name = $1', [genre]);
  return rows;
};


async function getAllDevelopers() {
  const { rows } = await pool.query('SELECT * FROM developers');
  return rows;
};
async function getGamesByDeveloper(id) {
  const { rows } = await pool.query('SELECT games.name, games.id AS id, genres.name AS genre, developers.name AS developer FROM games JOIN games_developers ON games.id = games_developers.game_id JOIN developers ON developers.id = games_developers.developer_id JOIN games_genres ON games.id = games_genres.game_id JOIN genres ON genres.id = games_genres.genre_id WHERE developers.id = $1', [id]);
  return rows;
};

module.exports = {
  getAllGames,
  getGameById,
  getGamesByGenre,
  getGamesByDeveloper,
  getAllGenres,
  getAllDevelopers
};