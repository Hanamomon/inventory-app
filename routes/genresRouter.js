const { Router } = require('express');
const genresRouter = Router();
const genresController = require('../controllers/genresController');

genresRouter.get('/', genresController.genresGetAll);
genresRouter.get('/add', genresController.genresGetAdd);
genresRouter.post('/add', genresController.genresPostAdd);
genresRouter.get('/:name', genresController.genresGetGames);

module.exports = genresRouter;