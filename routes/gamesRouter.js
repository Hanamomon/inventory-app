const { Router } = require('express');
const gamesRouter = Router();
const gamesController = require('../controllers/gamesController');

const { body, param } = require('express-validator');

const emptyErr = 'must not be empty.';
const alphannumErr = 'must contain only numbers and letters.';
const intErr = 'must be an integer.';
const dateErr = 'Founded date must be valid.';
const validateAdd = [
  body('name').trim()
    .notEmpty().withMessage(`Developer name ${emptyErr}`).bail()
    .matches(/^[\p{L}0-9\s'-]+$/u).withMessage(`Developer name ${alphannumErr}`).bail(),
  body('description').trim()
    .notEmpty().withMessage(`Developer description ${emptyErr}`).bail()
    .matches(/^[\p{L}0-9\s'-]+$/u).withMessage(`Develoepr description ${alphannumErr}`).bail(),
]
const validateUpdate = [
  param('id').trim()
    .isInt().withMessage(`Developer id ${intErr}`).bail(),
  validateAdd
]

gamesRouter.get('/', gamesController.gamesGetAll);
gamesRouter.get('/add', gamesController.gamesGetAdd);
gamesRouter.post('/add', gamesController.gamesPostAdd);
gamesRouter.get('/:id', gamesController.gamesGetGame);
gamesRouter.get('/:id/update', gamesController.gamesGetUpdate);
gamesRouter.post('/:id/update', gamesController.gamesPostUpdate);
gamesRouter.post('/:id/delete', gamesController.gamesPostDelete);

module.exports = gamesRouter;