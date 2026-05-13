const { Router } = require('express');
const genresRouter = Router();
const genresController = require('../controllers/genresController');
const { validateAddGenre, validateUpdateGenre, validatePassword } = require('../validator');

genresRouter.get('/', genresController.genresGetAll);
genresRouter.get('/add', genresController.genresGetAdd);
genresRouter.post('/add', validateAddGenre, genresController.genresPostAdd);
genresRouter.get('/:id', genresController.genresGetGenre);
genresRouter.get('/:id/games', genresController.genresGetGames);
genresRouter.get('/:id/update', genresController.genresGetUpdate)
genresRouter.post('/:id/update', validateUpdateGenre, genresController.genresPostUpdate);
genresRouter.get('/:id/delete', genresController.genresGetDelete);
genresRouter.post('/:id/delete', validatePassword, genresController.genresPostDelete);

module.exports = genresRouter;