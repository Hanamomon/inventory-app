const { getAllGames } = require('../db/queries');

async function gamesGetAll(req, res) {
  const games = await getAllGames();
  console.log(games);
  res.send('These are all the games:' + games.map(game => ` ${game.name} ${game.description}`));
};

module.exports = {
  gamesGetAll
};