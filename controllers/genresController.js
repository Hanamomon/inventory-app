const { getAllGenres, getGenreById, getGamesByGenre, postGenre, updateGenre, deleteGenre } = require('../db/genreQueries');
const { validationResult, matchedData} = require('express-validator');

async function genresGetAll(req, res) {
  const genres = await getAllGenres();
  res.render('genres/genres', { genres: genres });
};

async function genresGetGenre(req, res) {
  const { id } = req.params;
  const genres = await getGenreById(id);
  res.render('genres/genreInfo', { genre: genres[0] });
}

async function genresGetAdd(req, res) {
  const genres = await getAllGenres();
  res.render('genres/addGenre', { genres: genres });
};

async function genresPostAdd(req, res) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const genres = await getAllGenres();
    return res.status(400).render('genres/addGenre', {
      errors: errors.array(),
      genres
    });
  }

  const { name, description } = matchedData(req);

  await postGenre(name, description);
  res.redirect('/genres');
}

async function genresGetUpdate(req, res) {
  const { id } = req.params;
  const genres = await getGenreById(id);
  res.render('genres/updateGenre', { genre: genres[0] });
}

async function genresPostUpdate(req, res) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { id } = req.params;
    const genres = await getGenreById(id);
    return res.status(400).render('genres/updateGenre', {
        errors: errors.array(),
        genre: genres[0]
    });
  }

  const { name, description, id } = matchedData(req);

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
  res.render('genres/genreGames', { title: `${gamesByGenre[0].genre} Games`, games: gamesByGenre });
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