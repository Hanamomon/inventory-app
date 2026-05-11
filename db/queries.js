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
}

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
}

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
}

async function getAllGenres() {
  const { rows } = await pool.query('SELECT * FROM genres');
  return rows;
};
async function getGenreById(id) {
  const { rows } = await pool.query(`
    SELECT *, (SELECT COUNT(g.id)
        FROM genres gen
        JOIN games_genres gg ON gen.id = gg.genre_id
        JOIN games g ON g.id = gg.game_id
        WHERE gen.id = $1) AS game_count
      FROM genres
     WHERE id = $1
  `, [id]);
  return rows;
}
async function postGenre(name, description) {
  await pool.query('INSERT INTO genres (name, description) VALUES ($1, $2);', [name, description]);
}
async function getGamesByGenre(id) {
  const { rows } = await pool.query(`
    SELECT g.name,
      g.id,
      gen.name AS genre,
      JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('name', d.name, 'id', d.id)) AS developers FROM games g
        JOIN games_genres gg ON g.id = gg.game_id
        JOIN genres gen ON gen.id = gg.genre_id
        JOIN games_developers gd ON g.id = gd.game_id
        JOIN developers d ON d.id = gd.developer_id
        WHERE gen.id = $1
        GROUP BY g.id, g.name, gen.name;
    `, [id]);
  return rows;
};
async function updateGenre(name, description, id) {
  await pool.query(`
    UPDATE genres
      SET name = $1,
          description = $2
      WHERE id = $3
  `, [name, description, id]);
}

async function deleteGenre(id) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      DELETE FROM games_genres
        WHERE game_id IN (SELECT game_id
          FROM games_genres
          WHERE genre_id = $1) AND genre_id = $1;
    `, [id]);
    await client.query(`DELETE FROM genres WHERE id = $1;`, [id]);

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }  
}

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

module.exports = {
  getAllGames,
  getGameById,
  getGamesByGenre,
  getGamesByDeveloper,
  getAllGenres,
  getGenreById,
  getAllDevelopers,
  getDeveloperById,
  postGame,
  postGenre,
  postDeveloper,
  updateDeveloper,
  updateGame,
  updateGenre,
  deleteDeveloper,
  deleteGame,
  deleteGenre
};