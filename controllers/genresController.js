const { getAllGenres, getGenreById, getGamesByGenre, postGenre, updateGenre, deleteGenre } = require('../db/queries');

async function genresGetAll(req, res) {
  const genres = await getAllGenres();
  res.render('genres', { genres: genres });
};

async function genresGetGenre(req, res) {
  const { id } = req.params;
  const genres = await getGenreById(id);
  res.render('genreInfo', { genre: genres[0] });
}

async function genresGetAdd(req, res) {
  const genres = await getAllGenres();
  res.render('create/addGenre', { genres: genres });
};

async function genresPostAdd(req, res) {
  const { name, description } = req.body;
  await postGenre(name, description);
  res.redirect('/genres');
}

async function genresGetUpdate(req, res) {
  const { id } = req.params;
  const genres = await getGenreById(id);
  res.render('update/updateGenre', { genre: genres[0] });
}

async function genresPostUpdate(req, res) {
  const { id } = req.params;
  const { name, description } = req.body;
  await updateGenre(name, description, id);
  res.redirect('/genres');
}

async function genresPostDelete(req, res) {
  const { id } = req.params;
  await deleteGenre(id);
  res.redirect('/genres');
}

async function genresGetGames(req, res) {
  const { id } = req.params;
  const gamesByGenre = await getGamesByGenre(id);
  res.render('genreGames', { title: `Games`, games: gamesByGenre });
}

module.exports = {
  genresGetAll,
  genresGetGenre,
  genresGetGames,
  genresGetAdd,
  genresPostAdd,
  genresGetUpdate,
  genresPostUpdate,
  genresPostDelete
};