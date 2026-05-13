const pool = require('./pool');

async function getAllGames() {
  const { rows } = await pool.query(`
    SELECT g.name,
      g.id,
      JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('name', gen.name, 'id', gen.id)) AS genres,
      JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('name', d.name, 'id', d.id)) AS developers FROM games g
        LEFT JOIN games_genres gg ON g.id = gg.game_id
        LEFT JOIN genres gen ON gen.id = gg.genre_id
        LEFT JOIN games_developers gd ON g.id = gd.game_id
        LEFT JOIN developers d ON d.id = gd.developer_id
        GROUP BY g.id, g.name;
  `);
  return rows;
};

async function getGameById(id) {
  const { rows } = await pool.query(`
    SELECT g.name,
      g.id,
      g.description,
      JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('name', gen.name, 'id', gen.id)) AS genres,
      JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('name', d.name, 'id', d.id)) AS developers FROM games g
        LEFT JOIN games_genres gg ON g.id = gg.game_id
        LEFT JOIN genres gen ON gen.id = gg.genre_id
        LEFT JOIN games_developers gd ON g.id = gd.game_id
        LEFT JOIN developers d ON d.id = gd.developer_id
        WHERE g.id = $1
        GROUP BY g.id, g.name;
  `, [id]);
  return rows;
};

async function postGame(name, description, genres, developers) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(`INSERT INTO games (name, description) VALUES ($1, $2) RETURNING id;`, [name, description]);
    const gameId = rows[0].id;
    await Promise.all(
      genres.map(genreId => client.query(`INSERT INTO games_genres (game_id, genre_id) VALUES ($1, $2)`, [gameId, genreId]))
    );

    await Promise.all(
      developers.map(developerId => client.query(`INSERT INTO games_developers (game_id, developer_id) VALUES ($1, $2)`, [gameId, developerId]))
    );

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

async function updateGame(name, description, genres, developers, id) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    await client.query(`
      UPDATE games
        SET name = $1,
            description = $2
        WHERE games.id = $3;
    `, [name, description, id]);

    await client.query(`
      DELETE FROM games_genres WHERE game_id = $1
      `, [id]);
    await Promise.all(
      genres.map(genreId => client.query(`
        INSERT INTO games_genres (game_id, genre_id) VALUES ($1, $2);
      `, [id, genreId]))
    );

    await client.query(`
      DELETE FROM games_developers WHERE game_id = $1
      `, [id]);
    await Promise.all(
      developers.map(developerId => client.query(`
        INSERT INTO games_developers (game_id, developer_id) VALUES ($1, $2);
      `, [id, developerId]))
    );

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

async function deleteGame(id) {
const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`DELETE FROM games_genres WHERE game_id = $1`, [id]);
    await client.query(`DELETE FROM games_developers WHERE game_id = $1`, [id]);
    await client.query(`DELETE FROM games WHERE id = $1`, [id]);
    
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }  
};

async function getGameByName(name) {
  const { rows } = await pool.query(`SELECT * FROM games WHERE name = $1`, [name]);
  return rows;
};

module.exports = {
  getAllGames,
  getGameById,
  getGameByName,
  postGame,
  updateGame,
  deleteGame,
};