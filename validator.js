const { body, param } = require('express-validator');
const { getGameByName, getGameById, getGameByNameExceptId } = require('./db/gameQueries');
const { getGenreById, getGenreByName } = require('./db/genreQueries');
const { getDeveloperById, getDeveloperByName } = require('./db/developerQueries');
const { countriesArray } = require('./countries');

const emptyErr = 'must not be empty.';
const alphannumErr = 'must contain only numbers and letters.';
const selectErr = 'Select at least one';
const intErr = 'must be an integer.';

const countryErr = 'Developer country must be a valid country.';
const dateErr = 'Founded date must be valid.';

const validateAddGame = [
  body('name').trim()
    .notEmpty().withMessage(`Game name ${emptyErr}`).bail()
    .matches(/^[\p{L}0-9\s'-]+$/u).withMessage(`Game title ${alphannumErr}`).bail()
    .custom(async value => {
      const existingGame = await getGameByName(value);
      if (existingGame.length !== 0 ) {
        throw new Error('A game with this title exists already.');
      }
    }).bail(),
  body('description').trim()
    .notEmpty().withMessage(`Game description ${emptyErr}`).bail()
    .matches(/^[\p{L}0-9\s'-]+$/u).withMessage(`Game description ${alphannumErr}`).bail(),
  body('genres')
    .notEmpty().withMessage(`${selectErr} genre.`).bail(),
  body('genres.*').trim()
    .custom(async value => {
    const existingGenre = await getGenreById(value);
    if (existingGenre.length === 0 ) {
      throw new Error('Select a genre from the list of existing genres.');
    }
  }).bail(),
  body('developers')
    .notEmpty().withMessage(`${selectErr} developer.`).bail(),
  body('developers.*').trim()
    .notEmpty().withMessage(`${selectErr} developer.`).bail()
    .custom(async value => {
      const existingDeveloper = await getDeveloperById(value);
      if (existingDeveloper.length === 0 ) {
        throw new Error('Select a developer from the list of existing developers.');
      }
    })
]

const validateUpdateGame = [
  param('id').trim()
    .isInt().withMessage(`Game id ${intErr}`).bail()
    .custom(async value => {
      const existingGame = await getGameById(value);
      if (existingGame.length === 0) {
        throw new Error('Game with the specified id doesn\'t exit.');
      }
    }),
  body('name').trim()
    .notEmpty().withMessage(`Game name ${emptyErr}`).bail()
    .matches(/^[\p{L}0-9\s'-]+$/u).withMessage(`Game title ${alphannumErr}`).bail()
    .custom(async (value, { req }) => {
      const existingGameExceptToUpdate = await getGameByNameExceptId(value, req.params.id);
      if (existingGameExceptToUpdate.length !== 0 ) {
        throw new Error('A game with this title exists already.');
      }
    }).bail(),
  validateAddGame.slice(1)
]

const validateAddDeveloper = [
  body('name').trim()
    .notEmpty().withMessage(`Developer name ${emptyErr}`).bail()
    .matches(/^[\p{L}0-9\s'-]+$/u).withMessage(`Developer name ${alphannumErr}`).bail()
    .custom(async value => {
      const existingDeveloper = await getDeveloperByName(value);
      if (existingDeveloper.length !== 0 ) {
        throw new Error('A developer with that name already exists.')
      }
    }),
  body('description').trim()
    .notEmpty().withMessage(`Developer description ${emptyErr}`).bail()
    .matches(/^[\p{L}0-9\s'-]+$/u).withMessage(`Develoepr description ${alphannumErr}`).bail(),
  body('country').trim()
    .custom(value => {
      if (!countriesArray.some(countryPair => countryPair[0] === value))
        throw new Error(countryErr);
    }).bail(),
  body('founded').trim()
    .isDate().withMessage(dateErr),
]
const validateUpdateDeveloper = [
  param('id').trim()
    .isInt().withMessage(`Developer id ${intErr}`).bail()
    .custom(async value => {
      const existingDeveloper = await getDeveloperById(value);
      if (existingDeveloper.length === 0) {
        throw new Error('Developer with the specified id doesn\'t exit.');
      }
    }).bail(),
  validateAddDeveloper
]

const validateAddGenre = [
  body('name').trim()
    .notEmpty().withMessage(`Genre name ${emptyErr}`).bail()
    .matches(/^[\p{L}0-9\s'-]+$/u).withMessage(`Genre name ${alphannumErr}`).bail()
    .custom(async value => {
      const existingGenre = await getGenreByName(value);
      if (existingGenre.length !== 0) {
        throw new Error('A genre with this name already exists.');
      }
    }).bail({ level: 'request' }),
  body('description').trim()
    .notEmpty().withMessage(`Genre description ${emptyErr}`).bail()
    .matches(/^[\p{L}0-9\s'-]+$/u).withMessage(`Genre description ${alphannumErr}`),
]
const validateUpdateGenre = [
  param('id').trim()
    .isInt().withMessage(`Genre id ${intErr}`).bail()
    .custom(async value => {
      const existingGenre = await getGenreById(value);
      if (existingGenre.length === 0) {
        throw new Error('Genre with the specified id doesn\'t exit.');
      }
    }).bail({ level: 'request' }),
  validateAddGenre
]

module.exports = {
  validateAddGame,
  validateUpdateGame,
  validateAddDeveloper,
  validateUpdateDeveloper,
  validateAddGenre,
  validateUpdateGenre
}