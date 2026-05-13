const { body, param } = require('express-validator');
require('dotenv').config();
const { MASTER_PASSWORD } = process.env;

const { getGameByName, getGameById, getGameByNameExceptId } = require('./db/gameQueries');
const { getGenreById, getGenreByName, getGenreByNameExceptId } = require('./db/genreQueries');
const { getDeveloperById, getDeveloperByName, getDeveloperByNameExceptId } = require('./db/developerQueries');
const { countriesArray } = require('./countries');

const emptyErr = 'must not be empty.';
const alphannumErr = 'must contain only numbers and letters.';
const selectErr = 'Select at least one';
const intErr = 'must be an integer.';

const countryErr = 'Developer country must be a valid country.';
const dateErr = 'Founded date must be valid.';

const passErr = 'Password is incorrect.';

const validatePassword = [
  body('password')
    .notEmpty().withMessage('Enter the password.').bail()
    .custom(value => {
      console.log(value);
      console.log(MASTER_PASSWORD)
      if (value !== MASTER_PASSWORD) {
        throw new Error('Enter the correct password.');
      }
      return true;
    }).bail({ level: 'request' }),
]

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
  validatePassword,
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
      console.log(existingDeveloper)
      if (existingDeveloper.length !== 0 ) {
        throw new Error('A developer with that name already exists.')
      }
    }).bail({ level: 'request' }),
  body('description').trim()
    .notEmpty().withMessage(`Developer description ${emptyErr}`).bail()
    .matches(/^[\p{L}0-9\s'-]+$/u).withMessage(`Develoepr description ${alphannumErr}`).bail({ level: 'request' }),
  body('country').trim()
    .custom(value => {
      if (!countriesArray.some(countryPair => countryPair[0] === value))
        throw new Error(countryErr);
      return true;
    }).bail({ level: 'request' }),
  body('founded').trim()
    .isDate().withMessage(dateErr),
]
const validateUpdateDeveloper = [
  validatePassword,
  param('id').trim()
    .isInt().withMessage(`Developer id ${intErr}`).bail()
    .custom(async value => {
      const existingDeveloper = await getDeveloperById(value);
      if (existingDeveloper.length === 0) {
        throw new Error('Developer with the specified id doesn\'t exit.');
      }
    }).bail({ level: 'request' }),
  body('name').trim()
    .notEmpty().withMessage(`Developer name ${emptyErr}`).bail()
    .matches(/^[\p{L}0-9\s'-]+$/u).withMessage(`Developer name ${alphannumErr}`).bail()
    .custom(async (value, { req }) => {
      const existingDveloperExceptToUpdate = await getDeveloperByNameExceptId(value, req.params.id);
      if (existingDveloperExceptToUpdate.length !== 0 ) {
        throw new Error('A developer with that name already exists.')
      }
    }).bail({ level: 'request' }),  
  validateAddDeveloper.slice(1)
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
  validatePassword,
  param('id').trim()
    .isInt().withMessage(`Genre id ${intErr}`).bail()
    .custom(async value => {
      const existingGenre = await getGenreById(value);
      if (existingGenre.length === 0) {
        throw new Error('Genre with the specified id doesn\'t exit.');
      }
    }).bail({ level: 'request' }),
  body('name').trim()
    .notEmpty().withMessage(`Genre name ${emptyErr}`).bail()
    .matches(/^[\p{L}0-9\s'-]+$/u).withMessage(`Genre name ${alphannumErr}`).bail()
    .custom(async (value, { req }) => {
      const existingGenreExceptToUpdate = await getGenreByNameExceptId(value, req.params.id);
      if (existingGenreExceptToUpdate.length !== 0) {
        throw new Error('A genre with this name already exists.');
      }
    }).bail({ level: 'request' }),
  validateAddGenre.slice(1)
]

module.exports = {
  validateAddGame,
  validateUpdateGame,
  validateAddDeveloper,
  validateUpdateDeveloper,
  validateAddGenre,
  validateUpdateGenre
}