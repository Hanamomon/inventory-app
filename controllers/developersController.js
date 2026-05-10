const { getAllDevelopers, getDeveloperById, getGamesByDeveloper, postDeveloper } = require('../db/queries');
const { countriesFromCodes, codesFromCountries, countriesArray } = require('../countries');

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
  res.render('create/addDeveloper', { countries: countriesArray });
}

async function developersPostAdd(req, res) {
  const { name, description, country, founded } = req.body;
  const countryFull = countriesFromCodes.get(country);
  await postDeveloper(name, description, countryFull, founded);
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