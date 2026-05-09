const { Router } = require('express');
const gamesRouter = Router();
const gamesController = require('../controllers/gamesController');

gamesRouter.get('/', gamesController.gamesGetAll);
gamesRouter.get('/add', gamesController.gamesGetAdd);
gamesRouter.post('/add', gamesController.gamesPostAdd);
gamesRouter.get('/:id', gamesController.gamesGetGame);

module.exports = gamesRouter;