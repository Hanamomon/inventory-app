const { getAllGames, getGameById } = require('../db/queries');

async function gamesGetAll(req, res) {
  const games = await getAllGames();
  res.render('games', { games: games });
};

async function gamesGetGame(req, res) {
  const { id } = req.params;
  const games = await getGameById(id);
  res.render('gameInfo', { game: games[0] });
}

module.exports = {
  gamesGetAll,
  gamesGetGame
};