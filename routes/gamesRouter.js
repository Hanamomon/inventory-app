const { Router } = require('express');
const gamesRouter = Router();
const gamesController = require('../controllers/gamesController');

gamesRouter.get('/', gamesController.gamesGetAll);
gamesRouter.get('/:id', gamesController.gamesGetGame);

module.exports = gamesRouter;