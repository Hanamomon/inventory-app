const { getAllDevelopers, getDeveloperById, getGamesByDeveloper, postDeveloper, updateDeveloper, deleteDeveloper } = require('../db/developerQueries');
const { countriesFromCodes, codesFromCountries, countriesArray } = require('../countries');
const { validationResult, matchedData } = require('express-validator');

async function developersGetAll(req, res) {
  const developers = await getAllDevelopers();
  res.render('developers/developers', { developers: developers });
};

async function developersGetDeveloper(req, res) {
  const { id } = req.params;
  const developers = await getDeveloperById(id);
  res.render('developers/developerInfo', { developer: developers[0] });
}

async function developersGetAdd(req, res) {
  res.render('developers/addDeveloper', { countries: countriesArray });
}

async function developersPostAdd(req, res) {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render('developers/addDeveloper', {
      errors: errors.array(),
      countries: countriesArray
    });
  }
  const { name, description, country, founded } = matchedData(req);
  const countryFull = countriesFromCodes.get(country);

  await postDeveloper(name, description, countryFull, founded);
  res.redirect('/developers');
}

async function developersGetUpdate(req, res) {
  const { id } = req.params;
  const developers = await getDeveloperById(id);
  const { name, description, country, founded } = developers[0];
  const developer = { id, name, description, code: codesFromCountries.get(country), founded: founded.toISOString().split('T')[0] };
  res.render(`developers/updateDeveloper`, { developer: developer, countries: countriesArray });
}

async function developersPostUpdate(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const { id } = req.params;
    const developers = await getDeveloperById(id);
    return res.status(400).render('developers/updateDeveloper', {
      errors: errors.array(),
      developer: {...developers[0], code: codesFromCountries.get(developers[0].country), founded: developers[0].founded.toISOString().split('T')[0] },
      countries: countriesArray
    });
  }
  const { name, description, country, founded, id } = matchedData(req);
  const countryFull = countriesFromCodes.get(country);
  await updateDeveloper(name, description, countryFull, founded, id);
  res.redirect('/developers');
}

async function developersGetGames(req, res) {
  const { id } = req.params;
  const gamesByDeveloper = await getGamesByDeveloper(id);
  res.render('developers/developerGames', { title: `${gamesByDeveloper[0].developer}'s Games`, games: gamesByDeveloper });
}

async function developersGetDelete(req, res) {
  const { id } = req.params;
  const developers = await getDeveloperById(id);
  res.render('deleteEntry', { title: 'Delete Developer', entry: developers[0], requestPath: `/developers/${id}/delete`, backPath: `/developers/${id}` });
}

async function developersPostDelete(req, res) {
  const errors = validationResult(req);
  const { id } = req.params;
  if (!errors.isEmpty()) {
    const developers = await getDeveloperById(id);
    return res.status(400).render('deleteEntry', {
      errors: errors.array(),
      title: 'Delete Developer',
      entry: developers[0],
      requestPath: `/developers/${id}/delete`,
      backPath: `/developers/${id}`
    });
  }
  const developerRelations = await deleteDeveloper(id);
  res.redirect('/developers');
}

module.exports = {
  developersGetAll,
  developersGetDeveloper,
  developersGetGames,
  developersGetAdd,
  developersPostAdd,
  developersGetUpdate,
  developersPostUpdate,
  developersGetDelete,
  developersPostDelete
};