const { Router } = require('express');
const genresRouter = Router();
const genresController = require('../controllers/genresController');

genresRouter.get('/', genresController.genresGetAll);
genresRouter.get('/add', genresController.genresGetAdd);
genresRouter.post('/add', genresController.genresPostAdd);
genresRouter.get('/:id', genresController.genresGetGenre);
genresRouter.get('/:id/games', genresController.genresGetGames);
genresRouter.get('/:id/update', genresController.genresGetUpdate)
genresRouter.post('/:id/update', genresController.genresPostUpdate);
genresRouter.post('/:id/delete', genresController.genresPostDelete);

module.exports = genresRouter;