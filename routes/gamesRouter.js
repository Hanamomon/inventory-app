const { Router } = require('express');
const gamesRouter = Router();
const gamesController = require('../controllers/gamesController');

const { body, param } = require('express-validator');
const { validateAddGame, validateUpdateGame } = require('../validator'); 

gamesRouter.get('/', gamesController.gamesGetAll);
gamesRouter.get('/add', gamesController.gamesGetAdd);
gamesRouter.post('/add', validateAddGame, gamesController.gamesPostAdd);
gamesRouter.get('/:id', gamesController.gamesGetGame);
gamesRouter.get('/:id/update', gamesController.gamesGetUpdate);
gamesRouter.post('/:id/update', validateUpdateGame, gamesController.gamesPostUpdate);
gamesRouter.post('/:id/delete', gamesController.gamesPostDelete);

module.exports = gamesRouter;