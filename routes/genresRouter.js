const { Router } = require('express');
const genresRouter = Router();
const genresController = require('../controllers/genresController');

genresRouter.get('/', genresController.genresGetAll);
genresRouter.get('/:name', genresController.genresGetGames);

module.exports = genresRouter;