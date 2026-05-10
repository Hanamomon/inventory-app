const { getAllDevelopers, getDeveloperById, getGamesByDeveloper, postDeveloper } = require('../db/queries');
const countries = require('../countries');

async function developersGetAll(req, res) {
  const developers = await getAllDevelopers();
  res.render('developers', { developers: developers });
};

async function developersGetDeveloper(req, res) {
  const { id } = req.params;
  const developers = await getDeveloperById(id);
  res.render('developerInfo', { developer: developers[0] });
}

async function developersGetAdd(req, res) {
  res.render('create/addDeveloper');
}

async function developersPostAdd(req, res) {
  const { name, description, countryCode, founded } = req.body;
  const country = countries.get(countryCode);
  await postDeveloper(name, description, country, founded);
  res.redirect('/developers');
}

async function developersGetGames(req, res) {
  const { id } = req.params;
  const gamesByDeveloper = await getGamesByDeveloper(id);
  res.render('developerGames', { title: gamesByDeveloper[0].developer, games: gamesByDeveloper });
}

module.exports = {
  developersGetAll,
  developersGetDeveloper,
  developersGetGames,
  developersGetAdd,
  developersPostAdd
};