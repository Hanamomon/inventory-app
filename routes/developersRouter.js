const { Router } = require('express');
const developersRouter = Router();
const developersController = require('../controllers/developersController');

developersRouter.get('/', developersController.developersGetAll);
developersRouter.get('/:name', developersController.developersGetGames);

module.exports = developersRouter;