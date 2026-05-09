const { Router } = require('express');
const gamesRouter = Router();
const gamesController = require('../controllers/gamesController');

gamesRouter.get('/', gamesController.gamesGetAll);

module.exports = gamesRouter;