const { Router } = require('express');
const developersRouter = Router();
const developersController = require('../controllers/developersController');
const { validateAddDeveloper, validateUpdateDeveloper } = require('../validator');

developersRouter.get('/', developersController.developersGetAll);
developersRouter.get('/add', developersController.developersGetAdd);
developersRouter.post('/add', validateAddDeveloper, developersController.developersPostAdd);
developersRouter.get('/:id', developersController.developersGetDeveloper);
developersRouter.get('/:id/update', developersController.developersGetUpdate);
developersRouter.post('/:id/update', validateUpdateDeveloper, developersController.developersPostUpdate);
developersRouter.get('/:id/games', developersController.developersGetGames);
developersRouter.post('/:id/delete', developersController.developersPostDelete);

module.exports = developersRouter;