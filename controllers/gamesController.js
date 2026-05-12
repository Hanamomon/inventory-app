const { getAllGames, getGameById, getAllGenres, getAllDevelopers, postGame, updateGame, deleteGame } = require('../db/queries');
const { validationResult, matchedData } = require('express-validator');

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
  const genres = Array.isArray(data.genres) ? data.genres : [data.genres];
  const developers = Array.isArray(data.developers) ? data.developers : [data.developers];
  await postGame(data.name, data.description, genres, developers);
  res.redirect('/games');
}

async function gamesGetUpdate(req, res) {
  const { id } = req.params;
  const results = await Promise.all([getGameById(id), getAllGenres(), getAllDevelopers()]);
  res.render('update/updateGame', { game: results[0][0], genreList: results[1], developerList: results[2] });
}

async function gamesPostUpdate(req, res) {
  const { id } = req.params;
  const data = req.body;
  const genres = Array.isArray(data.genres) ? data.genres : [data.genres];
  const developers = Array.isArray(data.developers) ? data.developers : [data.developers];
  await updateGame(data.name, data.description, genres, developers, id);
  res.redirect('/games');
}

async function gamesPostDelete(req, res) {
  const { id } = req.params;
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
  gamesPostDelete
};