const { Router } = require('express');
const gamesRouter = Router();
const gamesController = require('../controllers/gamesController');
const { validateAddGame, validateUpdateGame, validatePassword } = require('../validator'); 

gamesRouter.get('/', gamesController.gamesGetAll);
gamesRouter.get('/add', gamesController.gamesGetAdd);
gamesRouter.post('/add', validateAddGame, gamesController.gamesPostAdd);
gamesRouter.get('/:id', gamesController.gamesGetGame);
gamesRouter.get('/:id/update', gamesController.gamesGetUpdate);
gamesRouter.post('/:id/update', validateUpdateGame, gamesController.gamesPostUpdate);
gamesRouter.get('/:id/delete', gamesController.gamesGetDelete);
gamesRouter.post('/:id/delete', validatePassword, gamesController.gamesPostDelete);

module.exports = gamesRouter;