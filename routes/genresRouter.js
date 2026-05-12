const { Router } = require('express');
const genresRouter = Router();
const genresController = require('../controllers/genresController');

const { body, param } = require('express-validator');

const emptyErr = 'must not be empty.';
const alphannumErr = 'must contain only numbers and letters.';
const intErr = 'must be an integer.';

const validateAdd = [
  body('name').trim()
    .notEmpty().withMessage(`Genre name ${emptyErr}`).bail()
    .matches(/^[\p{L}0-9\s'-]+$/u).withMessage(`Genre name ${alphannumErr}`).bail(),
  body('description').trim()
    .notEmpty().withMessage(`Genre description ${emptyErr}`).bail()
    .matches(/^[\p{L}0-9\s'-]+$/u).withMessage(`Genre description ${alphannumErr}`),
]
const validateUpdate = [
  param('id').trim()
    .isInt().withMessage(`Genre id ${intErr}`).bail(),
  validateAdd
]

genresRouter.get('/', genresController.genresGetAll);
genresRouter.get('/add', genresController.genresGetAdd);
genresRouter.post('/add', validateAdd, genresController.genresPostAdd);
genresRouter.get('/:id', genresController.genresGetGenre);
genresRouter.get('/:id/games', genresController.genresGetGames);
genresRouter.get('/:id/update', genresController.genresGetUpdate)
genresRouter.post('/:id/update', validateUpdate, genresController.genresPostUpdate);
genresRouter.post('/:id/delete', genresController.genresPostDelete);

module.exports = genresRouter;