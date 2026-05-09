const { getAllDevelopers, getDeveloperById, getGamesByDeveloper } = require('../db/queries');

async function developersGetAll(req, res) {
  const developers = await getAllDevelopers();
  res.render('developers', { developers: developers });
};

async function developersGetDeveloper(req, res) {
  const { id } = req.params;
  const developers = await getDeveloperById(id);
  res.render('developerInfo', { developer: developers[0] });
}

async function developersGetGames(req, res) {
  const { id } = req.params;
  const gamesByDeveloper = await getGamesByDeveloper(id);
  res.render('developerGames', { title: gamesByDeveloper[0].developer, games: gamesByDeveloper });
}

module.exports = {
  developersGetAll,
  developersGetDeveloper,
  developersGetGames
};