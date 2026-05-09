const { getAllDevelopers, getGamesByDeveloper } = require('../db/queries');

async function developersGetAll(req, res) {
  const developers = await getAllDevelopers();
  res.send('These are all the developers:' + developers.map(developer => ` ${developer.name} ${developer.country} ${developer.founded} ${developer.description}`));
};

async function developersGetGames(req, res) {
  const { name } = req.params;
  const gamesByDeveloper = await getGamesByDeveloper(name);
  res.send(`These are all of ${name}'s games:` + gamesByDeveloper.map(game => ` ${game.name}`));
}

module.exports = {
  developersGetAll,
  developersGetGames
};