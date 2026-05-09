const { Router } = require('express');
const developersRouter = Router();
const developersController = require('../controllers/developersController');

developersRouter.get('/', developersController.developersGetAll);
developersRouter.get('/:id', developersController.developersGetDeveloper);
developersRouter.get('/:id/games', developersController.developersGetGames);

module.exports = developersRouter;