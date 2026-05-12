const { Router } = require('express');
const developersRouter = Router();
const developersController = require('../controllers/developersController');

const { body, param } = require('express-validator');
const { countriesArray } = require('../countries');

const emptyErr = 'must not be empty.';
const alphannumErr = 'must contain only numbers and letters.';
const intErr = 'must be an integer.';
const countryErr = 'Developer country must be a valid country.';
const dateErr = 'Founded date must be valid.';
const validateAdd = [
  body('name').trim()
    .notEmpty().withMessage(`Developer name ${emptyErr}`).bail()
    .matches(/^[\p{L}0-9\s'-]+$/u).withMessage(`Developer name ${alphannumErr}`).bail(),
  body('description').trim()
    .notEmpty().withMessage(`Developer description ${emptyErr}`).bail()
    .matches(/^[\p{L}0-9\s'-]+$/u).withMessage(`Develoepr description ${alphannumErr}`).bail(),
  body('country').trim()
    .custom(value => {
      if (!countriesArray.some(countryPair => countryPair[0] === value))
        throw new Error(countryErr)
      return true;
    }).bail(),
  body('founded').trim()
    .isDate().withMessage(dateErr),
]
const validateUpdate = [
  param('id').trim()
    .isInt().withMessage(`Developer id ${intErr}`).bail(),
  validateAdd
]

developersRouter.get('/', developersController.developersGetAll);
developersRouter.get('/add', developersController.developersGetAdd);
developersRouter.post('/add', validateAdd, developersController.developersPostAdd);
developersRouter.get('/:id', developersController.developersGetDeveloper);
developersRouter.get('/:id/update', developersController.developersGetUpdate);
developersRouter.post('/:id/update', validateUpdate, developersController.developersPostUpdate);
developersRouter.get('/:id/games', developersController.developersGetGames);
developersRouter.post('/:id/delete', developersController.developersPostDelete);

module.exports = developersRouter;