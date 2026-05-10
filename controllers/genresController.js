const { getAllGenres, getGamesByGenre, postGenre } = require('../db/queries');

async function genresGetAll(req, res) {
  const genres = await getAllGenres();
  res.render('genres', { genres: genres });
};

async function genresGetAdd(req, res) {
  const genres = await getAllGenres();
  res.render('create/addGenre', { genres: genres });
};

async function genresPostAdd(req, res) {
  const { name } = req.body;
  await postGenre(name);
  res.redirect('/genres');
}

async function genresGetGames(req, res) {
  const { name } = req.params;
  const gamesByGenre = await getGamesByGenre(name);
  res.render('genreGames', { title: `${name} Games`, games: gamesByGenre });
}

module.exports = {
  genresGetAll,
  genresGetGames,
  genresGetAdd,
  genresPostAdd
};