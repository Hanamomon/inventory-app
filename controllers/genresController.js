const { getAllGenres, getGamesByGenre } = require('../db/queries');

async function genresGetAll(req, res) {
  const genres = await getAllGenres();
  res.send('These are all the genres:' + genres.map(genre => ` ${genre.name}`));
};

async function genresGetGames(req, res) {
  const { name } = req.params;
  const gamesByGenre = await getGamesByGenre(name);
  res.send(`These are all the ${name} games:` + gamesByGenre.map(game => ` ${game.name}`));
}

module.exports = {
  genresGetAll,
  genresGetGames
};