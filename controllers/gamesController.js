const { getAllGames, getGameById, postGame, updateGame, deleteGame } = require('../db/gameQueries');
const { getAllGenres } =require('../db/genreQueries');
const { getAllDevelopers } = require('../db/developerQueries');
const { validationResult, matchedData } = require('express-validator');

async function gamesGetAll(req, res) {
  const games = await getAllGames();
  res.render('games/games', { games: games });
};

async function gamesGetGame(req, res) {
  const { id } = req.params;
  const games = await getGameById(id);
  res.render('games/gameInfo', { game: games[0] });
}

async function gamesGetAdd(req, res) {
  const genres = await getAllGenres();
  const developers = await getAllDevelopers();
  res.render('games/addGame', { genres: genres, developers: developers });
}

async function gamesPostAdd(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const genres = await getAllGenres();
    const developers = await getAllDevelopers();
    return res.status(400).render('games/addGame', {
      errors: errors.array(),
      genres,
      developers
    });
  }

  const data = matchedData(req);
  const genres = Array.isArray(data.genres) ? data.genres : [data.genres];
  const developers = Array.isArray(data.developers) ? data.developers : [data.developers];
  await postGame(data.name, data.description, genres, developers);
  res.redirect('/games');
}

async function gamesGetUpdate(req, res) {
  const { id } = req.params;
  const results = await Promise.all([getGameById(id), getAllGenres(), getAllDevelopers()]);
  res.render('games/updateGame', { game: results[0][0], genreList: results[1], developerList: results[2] });
}

async function gamesPostUpdate(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const { id } = req.params;
    const results = await Promise.all([getGameById(id), getAllGenres(), getAllDevelopers()]);
    return res.status(400).render('games/updateGame', {
      errors: errors.array(),
      game: results[0][0],
      genreList: results[1],
      developerList: results[2] 
    });
  }
  
  const data = matchedData(req);
  const genres = Array.isArray(data.genres) ? data.genres : [data.genres];
  const developers = Array.isArray(data.developers) ? data.developers : [data.developers];
  await updateGame(data.name, data.description, genres, developers, data.id);
  res.redirect('/games');
}

async function gamesGetDelete(req, res) {
  const { id } = req.params;
  const games = await getGameById(id);
  res.render('deleteEntry', { title: 'Delete Game', entry: games[0], requestPath: `/games/${id}/delete`, backPath: `/games/${id}` });  
}

async function gamesPostDelete(req, res) {
  const errors = validationResult(req);
  const { id } = req.params;
  if (!errors.isEmpty()) {
    const games = await getGameById(id);
    return res.status(400).render('deleteEntry', {
      errors: errors.array(),
      title: 'Delete Game',
      entry: games[0],
      requestPath: `/games/${id}/delete`,
      backPath: `/games/${id}`
    });
  }
  await deleteGame(id);
  res.redirect('/games');
}

module.exports = {
  gamesGetAll,
  gamesGetGame,
  gamesGetAdd,
  gamesPostAdd,
  gamesGetUpdate,
  gamesPostUpdate,
  gamesGetDelete,
  gamesPostDelete
};