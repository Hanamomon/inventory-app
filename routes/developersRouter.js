const { Router } = require('express');
const developersRouter = Router();
const developersController = require('../controllers/developersController');

developersRouter.get('/', developersController.developersGetAll);
developersRouter.get('/add', developersController.developersGetAdd);
developersRouter.post('/add', developersController.developersPostAdd);
developersRouter.get('/:id', developersController.developersGetDeveloper);
developersRouter.get('/:id/update', developersController.developersGetUpdate);
developersRouter.post('/:id/update', developersController.developersPostUpdate);
developersRouter.get('/:id/games', developersController.developersGetGames);

module.exports = developersRouter;