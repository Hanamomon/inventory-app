const { getAllGames, getGameById, getAllGenres, getAllDevelopers, postGame } = require('../db/queries');

async function gamesGetAll(req, res) {
  const games = await getAllGames();
  res.render('games', { games: games });
};

async function gamesGetGame(req, res) {
  const { id } = req.params;
  const games = await getGameById(id);
  res.render('gameInfo', { game: games[0] });
}

async function gamesGetAdd(req, res) {
  const genres = await getAllGenres();
  const developers = await getAllDevelopers();
  res.render('create/addGame', { genres: genres, developers: developers });
}

async function gamesPostAdd(req, res) {
  const data = req.body;
  const genres = [...data.genres];
  const developers = [...data.developers];
  await postGame(data.name, data.description, genres, developers);
  res.redirect('/games');
}

module.exports = {
  gamesGetAll,
  gamesGetGame,
  gamesGetAdd,
  gamesPostAdd
};