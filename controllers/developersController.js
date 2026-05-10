const { getAllDevelopers, getDeveloperById, getGamesByDeveloper, postDeveloper, updateDeveloper } = require('../db/queries');
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

async function developersGetUpdate(req, res) {
  const { id } = req.params;
  const developers = await getDeveloperById(id);
  const { name, description, country, founded } = developers[0];
  const developer = { id, name, description, code: codesFromCountries.get(country), founded: founded.toISOString().split('T')[0] };
  res.render(`update/updateDeveloper`, { developer: developer, countries: countriesArray });
}

async function developersPostUpdate(req, res) {
  const { id } = req.params;
  const { name, description, country, founded } = req.body;
  const countryFull = countriesFromCodes.get(country);
  await updateDeveloper(name, description, countryFull, founded, id);
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
  developersPostAdd,
  developersGetUpdate,
  developersPostUpdate
};