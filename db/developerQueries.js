const pool = require('./pool');

async function getAllDevelopers() {
  const { rows } = await pool.query('SELECT * FROM developers');
  return rows;
};
async function postDeveloper(name, description, country, founded) {
  await pool.query('INSERT INTO developers (name, description, country, founded) VALUES ($1, $2, $3, $4)',
    [name, description, country, founded]);
}
async function updateDeveloper(name, description, country, founded, id) {
  await pool.query(`
    UPDATE developers
    SET name = $1,
        description = $2,
        country = $3,
        founded = $4
    WHERE id = $5;
    `, [name, description, country, founded, id]);
}
async function getDeveloperById(id) {
  const { rows } = await pool.query(`
    SELECT *,
      (SELECT COUNT(g.id)
        FROM developers d
        JOIN games_developers gd ON d.id = gd.developer_id
        JOIN games g ON g.id = gd.game_id
        WHERE d.id = $1) AS developed_count
      FROM developers d
      WHERE d.id = $1;
  `, [id]);
  return rows;
}
async function getGamesByDeveloper(id) {
  const { rows } = await pool.query(`
    SELECT g.name,
      g.id,
      d.name AS developer,
      JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('name', gen.name, 'id', gen.id)) AS genres FROM games g
        JOIN games_developers gd ON g.id = gd.game_id
        JOIN developers d ON d.id = gd.developer_id
        JOIN games_genres gg ON g.id = gg.game_id
        JOIN genres gen ON gen.id = gg.genre_id
        WHERE d.id = $1
        GROUP BY g.id, g.name, d.name;
    `, [id]);
  return rows;
};

async function deleteDeveloper(id) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      DELETE FROM games_developers
        WHERE game_id IN (SELECT game_id
          FROM games_developers
          WHERE developer_id = $1);
    `, [id]);
    await client.query(`DELETE FROM developers WHERE id = $1;`, [id]);

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

async function getDeveloperByName(name) {
  const { rows } = await pool.query(`SELECT * FROM developers WHERE name = $1`, [name]);
  return rows;
}

module.exports = {
  getGamesByDeveloper,
  getAllDevelopers,
  getDeveloperById,
  getDeveloperByName,
  postDeveloper,
  updateDeveloper,
  deleteDeveloper,
};