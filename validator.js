const { body, param } = require('express-validator');
const { getGameByName, getGameById, getGenreById, getDeveloperById } = require('./db/queries');

const emptyErr = 'must not be empty.';
const alphannumErr = 'must contain only numbers and letters.';
const selectErr = 'Select at least one';
const intErr = 'must be an integer.';

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
  validateAddGame
]

module.exports = {
  validateAddGame,
  validateUpdateGame
}